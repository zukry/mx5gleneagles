import { Link } from "react-router-dom"
import type { RegistryCar } from "../data/cars"

const stats = [
  { label: "Original production", value: "400", note: "commonly quoted figure" },
  { label: "Peak DVLA count", value: "467", note: "recorded in 1996" },
  { label: "DVLA total", value: "279", note: "2025 Q4 licensed + SORN" },
]

export default function Home({ cars }: { cars: RegistryCar[] }) {
  return (
    <main>
      <section className="hero">
        <div className="heroCopy">
          <p className="eyebrow">Independent Mazda MX-5 archive</p>
          <h1>Documenting every surviving Gleneagles.</h1>
          <p className="lead">
            A public registry for the UK-market Mazda MX-5 Gleneagles Special Edition,
            preserving known cars, registration history, originality details, photographs
            and restoration records.
          </p>

          <div className="heroActions">
            <Link className="button primary" to="/registry">Browse registry</Link>
            <Link className="button secondary" to="/submit">Submit a car</Link>
          </div>
        </div>

        <aside className="heroPanel">
          <p className="panelLabel">Registry status</p>
          <h2>{cars.length} documented car{cars.length === 1 ? "" : "s"}</h2>
          <p>
            The registry is in early development. Each entry links to its own page
            with public-safe vehicle details and an edit history.
          </p>
        </aside>
      </section>

      <section className="statsGrid" aria-label="Gleneagles statistics">
        {stats.map((stat) => (
          <article className="statCard" key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
            <small>{stat.note}</small>
          </article>
        ))}
        <article className="statCard">
          <strong>{cars.length}</strong>
          <span>Documented here</span>
          <small>registry just started</small>
        </article>
      </section>

      <section className="section split">
        <div>
          <p className="eyebrow">Project</p>
          <h2>Registry index first, full history after click.</h2>
        </div>
        <div className="copy">
          <p>
            The registry page works like an index. Visitors see a compact list of
            known cars, then click a row to open the full page for that car.
          </p>
          <p>
            Full car pages can contain registration history, originality checklists,
            photographs, restoration records, source notes and update history without
            making the registry overview messy.
          </p>
        </div>
      </section>
    </main>
  )
}
