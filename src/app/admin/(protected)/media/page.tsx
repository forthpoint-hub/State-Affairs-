import { createClient } from '@/lib/supabase/server';
import MediaLibrary from '@/components/admin/MediaLibrary';

export default async function MediaPage() {
  const supabase = createClient();
  const { data: media } = await supabase.from('media').select('*').order('created_at', { ascending: false });

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold mb-6">Media Library</h1>
      <MediaLibrary initialMedia={media ?? []} />
    </div>
  );
}
