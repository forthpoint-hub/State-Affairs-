import { getSiteSettings, getSocialLinks } from '@/lib/data';

export const metadata = { title: 'Contact' };

export default async function ContactPage() {
  const [settings, socialLinks] = await Promise.all([getSiteSettings(), getSocialLinks()]);

  const rows = [
    { label: 'General Inquiries', value: settings.contact_email },
    { label: 'Editorial', value: settings.editorial_email },
    { label: 'News Tips', value: settings.tip_email },
  ].filter((r) => r.value);

  return (
    <div className="max-w-xl">
      <h1 className="font-serif text-3xl font-bold mb-8">Contact</h1>

      {rows.length === 0 ? (
        <p className="text-muted">
          Contact details haven&rsquo;t been added yet. Set them in the CMS under Settings.
        </p>
      ) : (
        <dl className="space-y-5">
          {rows.map((r) => (
            <div key={r.label}>
              <dt className="text-xs uppercase tracking-wide text-muted">{r.label}</dt>
              <dd className="text-lg">
                <a href={`mailto:${r.value}`} className="hover:text-accent">
                  {r.value}
                </a>
              </dd>
            </div>
          ))}
        </dl>
      )}

      {socialLinks.length > 0 && (
        <div className="mt-10 pt-6 border-t border-line">
          <p className="text-xs uppercase tracking-wide text-muted mb-3">Follow Us</p>
          <div className="flex gap-4">
            {socialLinks.map((s) => (
              <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className="capitalize hover:text-accent">
                {s.platform}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
