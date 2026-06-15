type OriginalityStatus = "Present" | "Missing" | "Unknown"

type OriginalityItem = {
  category: string
  name: string
  status: OriginalityStatus
}

const registryStats = [
  { label: "Original production", value: "400", note: "commonly quoted figure" },
  { label: "Peak DVLA count", value: "467", note: "recorded in 1996" },
  { label: "DVLA total", value: "279", note: "2025 Q4 licensed + SORN" },
  { label: "Documented here", value: "1", note: "registry just started" },
]

const cars = [
  {
    id: "GE-001",
    registration: "N9 OWO",
    previousRegistrations: ["N131 FHE", "N2 EAC", "N131 FHE", "N9 OWO"],
    vinPublic: "JMZNA18P200301***",
    colour: "Montego Blue Mica",
    interior: "Champagne leather / tartan",
    country: "United Kingdom",
    status: "Under restoration",
    summary:
      "A UK Mazda MX-5 Gleneagles currently undergoing a major preservation-focused restoration.",
  },
]

const originality: OriginalityItem[] = [
  { category: "Identity", name: "Original Gleneagles edition", status: "Present" },
  { category: "Identity", name: "Montego Blue Mica paint", status: "Present" },
  { category: "Interior", name: "Champagne leather seats", status: "Present" },
  { category: "Interior", name: "Tartan seat inserts", status: "Present" },
  { category: "Interior", name: "Nardi steering wheel", status: "Present" },
  { category: "Interior", name: "Wood centre console", status: "Present" },
  { category: "Accessories", name: "Tartan document wallet", status: "Present" },
  { category: "Accessories", name: "Tonneau cover", status: "Present" },
  { category: "Accessories", name: "Wind blocker", status: "Present" },
  { category: "Accessories", name: "OEM Gleneagles hardtop", status: "Missing" },
  { category: "Documentation", name: "Original sales invoice", status: "Missing" },
  { category: "Documentation", name: "Original service history", status: "Missing" },
  { category: "Mechanical", name: "Power steering", status: "Present" },
  { category: "Mechanical", name: "Air conditioning", status: "Missing" },
]

function statusClass(status: OriginalityStatus) {
  return status.toLowerCase()
}

function groupedOriginality() {
  return originality.reduce<Record<string, OriginalityItem[]>>((groups, item) => {
    groups[item.category] = groups[item.category] || []
    groups[item.category].push(item)
    return groups
  }, {})
}

export default function App() {
  const car = cars[0]
  const grouped = groupedOriginality()

  return (
    <div className="site">
      <header className="topbar">
        <a className="brand" href="#home" aria-label="MX5 Gleneagles Registry home">
          <span>MX5</span>
          Gleneagles Registry
        </a>

        <nav>
          <a href="#registry">Registry</a>
          <a href="#car-ge-001">GE-001</a>
          <a href="#history">History</a>
          <a href="#submit">Submit</a>
          <a href="#privacy">Privacy</a>
        </nav>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="heroCopy">
            <p className="eyebrow">Independent Mazda MX-5 archive</p>
            <h1>Documenting every surviving Gleneagles.</h1>
            <p className="lead">
              A public registry for the UK-market Mazda MX-5 Gleneagles Special Edition,
              preserving known cars, registration history, originality details, photographs
              and restoration records.
            </p>

            <div className="heroActions">
              <a className="button primary" href="#registry">Browse registry</a>
              <a className="button secondary" href="#submit">Submit a car</a>
            </div>
          </div>

          <aside className="heroPanel">
            <p className="panelLabel">Current focus</p>
            <h2>Building the first public records</h2>
            <p>
              The registry is in early development. GE-001 is being used as the
              first template before owner submissions and account features are added.
            </p>
          </aside>
        </section>

        <section className="statsGrid" aria-label="Gleneagles statistics">
          {registryStats.map((stat) => (
            <article className="statCard" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
              <small>{stat.note}</small>
            </article>
          ))}
        </section>

        <section className="section split" id="history">
          <div>
            <p className="eyebrow">History</p>
            <h2>Why the numbers matter</h2>
          </div>
          <div className="copy">
            <p>
              The Gleneagles is usually described as a limited UK special edition with
              around 400 examples produced. DVLA-derived statistics, however, show a
              peak recorded population of 467 in 1996. That mismatch is one of the
              questions this registry aims to investigate over time.
            </p>
            <p>
              By collecting partial VINs, registrations, photographs and owner-submitted
              evidence, the registry can help separate confirmed surviving cars from
              unknown, exported, scrapped or misclassified examples.
            </p>
          </div>
        </section>

        <section className="section" id="registry">
          <div className="sectionHeading">
            <p className="eyebrow">Registry</p>
            <h2>Known cars</h2>
            <p>
              Public entries show car-focused information only. Owner contact details,
              full VINs and private notes are not displayed.
            </p>
          </div>

          <div className="registryTable">
            <div className="tableHead">
              <span>ID</span>
              <span>Registration</span>
              <span>Colour</span>
              <span>Country</span>
              <span>Status</span>
            </div>

            {cars.map((item) => (
              <a className="tableRow" href={`#car-${item.id.toLowerCase()}`} key={item.id}>
                <span>{item.id}</span>
                <span>{item.registration}</span>
                <span>{item.colour}</span>
                <span>{item.country}</span>
                <span><mark>{item.status}</mark></span>
              </a>
            ))}
          </div>
        </section>

        <section className="section carPage" id="car-ge-001">
          <div className="carHero">
            <div>
              <p className="eyebrow">Registry entry</p>
              <h2>{car.id}</h2>
              <p>{car.summary}</p>
            </div>

            <div className="photoPlaceholder">
              <span>Photo area</span>
              <small>Add exterior, interior and restoration images later</small>
            </div>
          </div>

          <div className="detailGrid">
            <article><span>Current registration</span><strong>{car.registration}</strong></article>
            <article><span>Partial VIN</span><strong>{car.vinPublic}</strong></article>
            <article><span>Colour</span><strong>{car.colour}</strong></article>
            <article><span>Interior</span><strong>{car.interior}</strong></article>
            <article><span>Country</span><strong>{car.country}</strong></article>
            <article><span>Status</span><strong>{car.status}</strong></article>
          </div>

          <div className="subsection">
            <h3>Registration history</h3>
            <div className="regHistory">
              {car.previousRegistrations.map((reg, index) => (
                <div className="regStep" key={`${reg}-${index}`}>
                  <span>{reg}</span>
                  {index < car.previousRegistrations.length - 1 && <b>→</b>}
                </div>
              ))}
            </div>
          </div>

          <div className="subsection">
            <h3>Originality checklist</h3>
            <p className="subtle">
              This uses Present / Missing / Unknown rather than a simple score, because
              some items are optional, dealer-fit or commonly lost over time.
            </p>

            <div className="checklist">
              {Object.entries(grouped).map(([category, items]) => (
                <article className="checkGroup" key={category}>
                  <h4>{category}</h4>
                  {items.map((item) => (
                    <div className="checkItem" key={item.name}>
                      <span>{item.name}</span>
                      <em className={statusClass(item.status)}>{item.status}</em>
                    </div>
                  ))}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section submitPanel" id="submit">
          <p className="eyebrow">Submit</p>
          <h2>Own or know of a Gleneagles?</h2>
          <p>
            The submission system is not live yet. When available, owners will be able
            to submit a car, choose how much registration information is public, and
            provide originality details for review.
          </p>

          <div className="submitGrid">
            <article>
              <h3>Public by default</h3>
              <p>Registry ID, colour, country, status, partial VIN and approved photos.</p>
            </article>
            <article>
              <h3>Owner controlled</h3>
              <p>Current registration can be full, partial or hidden at owner request.</p>
            </article>
            <article>
              <h3>Private</h3>
              <p>Owner email, phone, full VIN, address and private notes.</p>
            </article>
          </div>

          <a className="button primary" href="mailto:registry@mx5gleneagles.uk">
            Contact the registry
          </a>
        </section>

        <section className="section split" id="privacy">
          <div>
            <p className="eyebrow">Privacy</p>
            <h2>Cars are public. Owners are private.</h2>
          </div>
          <div className="copy">
            <p>
              The registry is designed to preserve vehicle history without exposing
              personal information. Exact owner locations, private contact details
              and full VINs should not be placed on public pages.
            </p>
            <p>
              Future owner edits should go through an approval queue before appearing
              publicly. This protects against false claims, incorrect data and vandalism.
            </p>
          </div>
        </section>
      </main>

      <footer>
        <p>
          MX5 Gleneagles Registry is an independent enthusiast archive. It is not
          affiliated with Mazda Motor Corporation, the MX-5 Owners Club, or Gleneagles Hotel.
        </p>
      </footer>
    </div>
  )
}
