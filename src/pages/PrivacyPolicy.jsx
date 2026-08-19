export default function PrivacyPolicy() {
  return (
    <div className="page" style={{ maxWidth: 720, margin: "0 auto", paddingTop: 48, paddingBottom: 64 }}>
      <h1 style={{ fontSize: "clamp(28px, 6vw, 40px)", marginBottom: 8 }}>Privacy Policy</h1>
      <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, marginBottom: 32 }}>Last updated: August 2026</p>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>Information we collect</h2>
        <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>
          TrackFights does not collect any personally identifiable information. We may collect anonymous
          usage data (page views, feature interactions) solely to improve the product experience.
        </p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>Cookies</h2>
        <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>
          We use local storage to remember your votes on fight cards. No cross-site tracking cookies are used.
        </p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>Third-party services</h2>
        <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>
          We use Firebase Analytics to understand how users interact with the site. Firebase may collect
          anonymous session data according to{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noreferrer"
            style={{ color: "#e63a3a" }}
          >
            Google's Privacy Policy
          </a>
          .
        </p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>Contact</h2>
        <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>
          For any privacy-related queries, reach us at{" "}
          <a href="https://nexgensoftwares.in" target="_blank" rel="noreferrer" style={{ color: "#e63a3a" }}>
            nexgensoftwares.in
          </a>
          .
        </p>
      </section>
    </div>
  );
}
