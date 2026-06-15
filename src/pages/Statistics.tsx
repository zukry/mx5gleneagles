import { useEffect, useState } from 'react'
import { fetchCars } from '../services/cars'
import type { Car } from '../types/database'

export default function Statistics() {
  const [cars, setCars] = useState<Car[]>([])

  useEffect(() => {
    fetchCars().then(setCars).catch(() => setCars([]))
  }, [])

  const claimed = cars.filter((car) => car.ownership_status === 'claimed').length

  return (
    <main>
      <section className="pageHeader">
        <p className="eyebrow">Statistics</p>
        <h1>Registry statistics</h1>
        <p>High-level figures for the Gleneagles population and this registry.</p>
      </section>

      <section className="statsGrid">
        <article className="statCard"><strong>400</strong><span>Original production</span><small>commonly quoted</small></article>
        <article className="statCard"><strong>467</strong><span>Peak DVLA count</span><small>1996</small></article>
        <article className="statCard"><strong>279</strong><span>DVLA total</span><small>2025 Q4 licensed + SORN</small></article>
        <article className="statCard"><strong>{cars.length}</strong><span>Registry entries</span><small>live database rows</small></article>
        <article className="statCard"><strong>{claimed}</strong><span>Claimed entries</span><small>owner-linked</small></article>
        <article className="statCard"><strong>{Math.max(279 - cars.length, 0)}</strong><span>Awaiting rediscovery</span><small>DVLA total minus registry entries</small></article>
      </section>
    </main>
  )
}
