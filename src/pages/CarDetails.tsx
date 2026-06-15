import { Link, useParams } from "react-router-dom"
import type { OriginalityItem, OriginalityStatus, RegistryCar } from "../data/cars"

function statusClass(status: OriginalityStatus) {
  return status.toLowerCase()
}

function groupedOriginality(items: OriginalityItem[]) {
  return items.reduce<Record<string, OriginalityItem[]>>((groups, item) => {
    groups[item.category] = groups[item.category] || []
    groups[item.category].push(item)
    return groups
  }, {})
}

export default function CarDetails({ cars }: { cars: RegistryCar[] }) {
  const { slug } = useParams()
  const car = cars.find((item) => item.slug === slug)

  if (!car) {
    return (
      <main>
        <section className="pageHeader">
          <p className="eyebrow">Not found</p>
          <h1>Car not found</h1>
          <p>This registry entry does not exist.</p>
          <Link className="button primary" to="/registry">Back to registry</Link>
        </section>
      </main>
    )
  }

  const grouped = groupedOriginality(car.originality)

  return (
    <main>
      <section className="carPage">
        <Link className="backLink" to="/registry">← Back to registry</Link>

        <div className="carHero">
          <div>
            <p className="eyebrow">Registry entry</p>
            <h1>{car.id}</h1>
            <p>{car.summary}</p>
          </div>

          <div className="photoPlaceholder">
            <span>Photo area</span>
            <small>Add exterior, interior and restoration images later</small>
          </div>
        </div>

        <div className="metaGrid">
          <article>
            <span>Last updated</span>
            <strong>{car.updatedAt}</strong>
          </article>
          <article>
            <span>Entry created</span>
            <strong>{car.createdAt}</strong>
          </article>
          <article>
            <span>Updated by</span>
            <strong>{car.updatedBy}</strong>
          </article>
          <article>
            <span>Data confidence</span>
            <strong>{car.dataConfidence}</strong>
          </article>
          <article>
            <span>Originality</span>
            <strong>{car.originalityRating}</strong>
          </article>
          <article>
            <span>Photos / documents</span>
            <strong>{car.photoCount} / {car.documentCount}</strong>
          </article>
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
          <h2>Registration history</h2>
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
          <h2>Originality checklist</h2>
          <p className="subtle">
            Present / Missing / Unknown / Modified gives a clearer picture than a simple score.
          </p>

          <div className="checklist">
            {Object.entries(grouped).map(([category, items]) => (
              <article className="checkGroup" key={category}>
                <h3>{category}</h3>
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

        <div className="subsection">
          <h2>Update history</h2>
          <p className="subtle">
            Future owner edits should be reviewed before publication. This log will
            show what changed, when it changed, and whether it was updated by an owner
            or registry administrator.
          </p>

          <div className="timeline">
            {car.changelog.map((entry) => (
              <article className="timelineEntry" key={`${entry.date}-${entry.updatedBy}`}>
                <div>
                  <strong>{entry.date}</strong>
                  <span>{entry.updatedBy}</span>
                </div>
                <ul>
                  {entry.changes.map((change) => (
                    <li key={change}>{change}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
