import { NextResponse, type NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

// Called by Vercel Cron every few minutes (see vercel.json).
// Finds any 'scheduled' article whose publish_at has passed and flips it
// to 'published' — this is what makes scheduled publishing automatic,
// with no manual step and no redeploy.
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = createAdminClient();
  const now = new Date().toISOString();

  const { data: due, error } = await db
    .from('articles')
    .select('id')
    .eq('status', 'scheduled')
    .lte('publish_at', now);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!due || due.length === 0) {
    return NextResponse.json({ published: 0 });
  }

  const ids = due.map((a) => a.id);
  await db
    .from('articles')
    .update({ status: 'published', published_at: now })
    .in('id', ids);

  return NextResponse.json({ published: ids.length, ids });
}
