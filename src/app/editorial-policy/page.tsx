export const metadata = { title: 'Editorial Policy' };

const SECTIONS = [
  { title: 'Accuracy', body: '[State how facts are verified before publication.]' },
  { title: 'Fact-Checking', body: '[Describe the fact-checking process.]' },
  { title: 'Source Transparency', body: '[Explain how sources are attributed and evaluated.]' },
  { title: 'Corrections', body: '[Explain how and when corrections are issued and marked.]' },
  { title: 'Editorial Independence', body: '[State the publication\u2019s editorial independence.]' },
  { title: 'Conflict of Interest', body: '[Explain how conflicts of interest are disclosed and managed.]' },
  { title: 'Use of Anonymous Sources', body: '[Explain the conditions under which anonymity is granted.]' },
  { title: 'Opinion vs. Reporting', body: '[Explain how opinion/analysis is distinguished from news reporting.]' },
  { title: 'AI-Assisted Content', body: '[Explain how, if at all, AI tools assist reporting or editing, and how human editorial review applies.]' },
  { title: 'Ethical Journalism', body: '[State the broader ethical standards the newsroom follows.]' },
];

export default function EditorialPolicyPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-3xl font-bold mb-2">Editorial Policy</h1>
      <p className="text-muted mb-8">
        This page is a structural template. Replace each bracketed section with State Affairs&rsquo;
        actual editorial standards.
      </p>
      <div className="space-y-8">
        {SECTIONS.map((s) => (
          <section key={s.title}>
            <h2 className="font-serif text-xl font-bold mb-2">{s.title}</h2>
            <p className="text-[17px] leading-relaxed text-ink/90">{s.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
