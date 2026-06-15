const stats = [
  { label: "Original UK production", value: "400" },
  { label: "Registry status", value: "Starting now" },
  { label: "Public submissions", value: "Coming soon" },
];

const goals = [
  "Record surviving Mazda MX-5 Gleneagles examples",
  "Preserve car histories, registrations, photos and restoration notes",
  "Help owners verify details without exposing private information",
  "Create a long-term archive for the special edition",
];

export default function App() {
  return (
    <div className="site">
      <header className="nav">
        <a className="brand" href="#top">MX5 Gleneagles Registry</a>
        <nav>
          <a href="#about">About</a>
          <a href="#registry">Registry</a>
          <a href="#submit">Submit</a>
          <a href="#privacy">Privacy</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <div className="heroText">
            <p className="eyebrow">Independent enthusiast archive</p>
            <h1>Preserving the Mazda MX-5 Gleneagles story.</h1>
            <p className="lead">
              A dedicated registry for the rare UK-market Mazda MX-5 Gleneagles
              Special Edition, built to document surviving cars, known histories,
              restoration details and owner-submitted information.
            </p>
            <div className="actions">
              <a className="button primary" href="#submit">Submit a car</a>
              <a className="button ghost" href="#about">Learn about the project</a>
            </div>
          </div>

          <aside className="heroPanel">
            <span className="panelTag">Project status</span>
            <h2>Registry build in progress</h2>
            <p>
              The site is currently being built. Early records are being gathered
              before the public searchable registry goes live.
            </p>
          </aside>
        </section>

        <section className="stats" aria-label="Registry statistics">
          {stats.map((stat) => (
            <div className="stat" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </section>

        <section className="section split" id="about">
          <div>
            <p className="eyebrow">About</p>
            <h2>Why this registry exists</h2>
          </div>
          <div className="copy">
            <p>
              The Gleneagles was one of the limited UK special editions of the
              first-generation Mazda MX-5. With a small production run and cars
              now approaching classic status, information is easily lost when
              cars change hands, are restored, exported or broken for parts.
            </p>
            <p>
              This project aims to preserve that information in one place. Public
              records will focus on safe details such as registry number, partial
              VIN, colour, status, country and known history. Private owner
              contact details will not be published.
            </p>
          </div>
        </section>

        <section className="section" id="registry">
          <p className="eyebrow">Registry goals</p>
          <h2>What the archive will track</h2>
          <div className="cards">
            {goals.map((goal) => (
              <article className="card" key={goal}>
                <span></span>
                <p>{goal}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section feature">
          <div>
            <p className="eyebrow">Example entry</p>
            <h2>GE-001</h2>
            <p>
              Registry entries will show safe public details only. Full VINs,
              owner emails, phone numbers and private notes will be kept off the
              public website.
            </p>
          </div>
          <div className="entry">
            <dl>
              <div><dt>Registration</dt><dd>N9 OWO</dd></div>
              <div><dt>Colour</dt><dd>Montego Blue Mica</dd></div>
              <div><dt>Interior</dt><dd>Champagne leather / tartan</dd></div>
              <div><dt>Status</dt><dd>Under restoration</dd></div>
              <div><dt>VIN</dt><dd>JMZNA18P200301***</dd></div>
            </dl>
          </div>
        </section>

        <section className="section submit" id="submit">
          <p className="eyebrow">Submit</p>
          <h2>Own or know of a Gleneagles?</h2>
          <p>
            Submissions are not open yet, but the registry will accept owner
            information, photos, previous registrations, restoration notes and
            history evidence once the submission system is ready.
          </p>
          <a className="button primary" href="mailto:registry@mx5gleneagles.uk">
            Contact the registry
          </a>
        </section>

        <section className="section split" id="privacy">
          <div>
            <p className="eyebrow">Privacy</p>
            <h2>Public archive, private owner data</h2>
          </div>
          <div className="copy">
            <p>
              The registry is intended to document cars, not expose owners.
              Sensitive details such as owner names, email addresses, phone
              numbers, full VINs and private correspondence will not be shown on
              public car pages.
            </p>
            <p>
              Owner-submitted changes will be reviewed before becoming public.
              This helps prevent false claims, incorrect edits and vandalism.
            </p>
          </div>
        </section>
      </main>

      <footer>
        <p>
          MX5 Gleneagles Registry is an independent enthusiast archive. It is not
          affiliated with Mazda Motor Corporation, the MX-5 Owners Club, or
          Gleneagles Hotel.
        </p>
      </footer>
    </div>
  );
}
