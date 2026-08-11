export const metadata = { title: 'Privacy Policy' };

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-3xl font-bold mb-8">Privacy Policy</h1>
      <div className="space-y-6 text-[17px] leading-relaxed">
        <section>
          <h2 className="font-serif text-xl font-bold mb-2">Information We Collect</h2>
          <p>[Describe any analytics, cookies, or data collected from visitors.]</p>
        </section>
        <section>
          <h2 className="font-serif text-xl font-bold mb-2">How We Use Information</h2>
          <p>[Describe how collected data is used.]</p>
        </section>
        <section>
          <h2 className="font-serif text-xl font-bold mb-2">Cookies</h2>
          <p>[Describe cookie usage, if any.]</p>
        </section>
        <section>
          <h2 className="font-serif text-xl font-bold mb-2">Third Parties</h2>
          <p>[List any third-party services, e.g. analytics providers.]</p>
        </section>
        <section>
          <h2 className="font-serif text-xl font-bold mb-2">Contact</h2>
          <p>[Explain how to reach the publication about privacy questions.]</p>
        </section>
      </div>
    </div>
  );
}
