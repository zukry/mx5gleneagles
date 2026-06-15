import { Link } from "react-router-dom"
import type { RegistryCar } from "../data/cars"

export default function Registry({ cars }: { cars: RegistryCar[] }) {
  return (
    <main>
      <section className="pageHeader">
        <p className="eyebrow">Registry</p>
        <h1>Known cars</h1>
        <p>
          Click an entry to view the full vehicle page. Public entries show
          car-focused information only; owner contact details and full VINs are private.
        </p>
      </section>

      <section className="section">
        <div className="registryTable">
          <div className="tableHead">
            <span>ID</span>
            <span>Registration</span>
            <span>Colour</span>
            <span>Country</span>
            <span>Status</span>
          </div>

          {cars.map((car) => (
            <Link className="tableRow" to={`/cars/${car.slug}`} key={car.id}>
              <span>{car.id}</span>
              <span>{car.registration}</span>
              <span>{car.colour}</span>
              <span>{car.country}</span>
              <span><mark>{car.status}</mark></span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
