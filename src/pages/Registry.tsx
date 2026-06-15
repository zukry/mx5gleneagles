import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { fetchCars } from '../services/cars'
import type { Car } from '../types/database'
import Loading from '../components/Loading'
import ErrorBox from '../components/ErrorBox'

export default function Registry() {
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCars()
      .then(setCars)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

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
        {loading && <Loading label="Loading registry" />}
        {error && <ErrorBox message={error} />}

        {!loading && !error && (
          <div className="registryTable">
            <div className="tableHead">
              <span>ID</span>
              <span>Registration</span>
              <span>Colour</span>
              <span>Country</span>
              <span>Owners</span>
              <span>Status</span>
            </div>

            {cars.map((car) => (
              <Link className="tableRow" to={`/cars/${car.slug}`} key={car.id}>
                <span>{car.registry_id}</span>
                <span>{car.registration ?? 'Withheld'}</span>
                <span>{car.colour ?? 'Unknown'}</span>
                <span>{car.country ?? 'Unknown'}</span>
                <span>{car.owner_count ?? 'Unknown'}</span>
                <span><mark>{car.status ?? 'Unknown'}</mark></span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
