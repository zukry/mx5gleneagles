import { Link, useParams } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { fetchCarBySlug, fetchViewerOwnershipState, requestOwnershipClaim, type ViewerOwnershipState } from '../services/cars'
import type { CarDetails as CarDetailsType, OriginalityItem } from '../types/database'
import Loading from '../components/Loading'
import ErrorBox from '../components/ErrorBox'

function statusClass(status: string) {
  return status.toLowerCase().replaceAll(' ', '-')
}

function groupedOriginality(items: OriginalityItem[]) {
  return items.reduce<Record<string, OriginalityItem[]>>((groups, item) => {
    groups[item.category] = groups[item.category] || []
    groups[item.category].push(item)
    return groups
  }, {})
}

export default function CarDetails() {
  const { slug } = useParams()
  const [car, setCar] = useState<CarDetailsType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [claimMessage, setClaimMessage] = useState('')
  const [ownershipState, setOwnershipState] = useState<ViewerOwnershipState>({ signedIn: false, isApprovedOwner: false, hasPendingClaim: false })

  useEffect(() => {
    if (!slug) return
    const carSlug = slug

    async function loadCar() {
      try {
        const loadedCar = await fetchCarBySlug(carSlug)
        setCar(loadedCar)
        if (loadedCar) {
          const viewerState = await fetchViewerOwnershipState(loadedCar.id)
          setOwnershipState(viewerState)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not load car.')
      } finally {
        setLoading(false)
      }
    }

    loadCar()
  }, [slug])

  const grouped = useMemo(() => groupedOriginality(car?.originality_items ?? []), [car])

  async function handleClaim() {
    if (!car) return
    setClaimMessage('')
    try {
      await requestOwnershipClaim(car.id)
      setOwnershipState((current) => ({ ...current, signedIn: true, hasPendingClaim: true }))
      setClaimMessage('Ownership claim submitted. You will be contacted shortly for proof of ownership.')
    } catch (err) {
      setClaimMessage(err instanceof Error ? err.message : 'Could not submit claim.')
    }
  }

  function renderClaimState() {
    if (ownershipState.isApprovedOwner) {
      return (
        <div className="claimState">
          <p className="notice">This car is claimed by you.</p>
          <Link className="button primary" to={`/cars/${car?.slug}/manage`}>Manage my car</Link>
        </div>
      )
    }

    if (ownershipState.hasPendingClaim) {
      return (
        <div className="claimState">
          <p className="notice">Ownership claim pending. Your claim has been submitted and is awaiting review. You will be contacted shortly for proof of ownership.</p>
        </div>
      )
    }

    return <button className="button secondary" type="button" onClick={handleClaim}>Claim this car</button>
  }

  if (loading) return <main><section className="pageHeader"><Loading label="Loading car" /></section></main>
  if (error) return <main><section className="pageHeader"><ErrorBox message={error} /></section></main>
  if (!car) {
    return (
      <main>
        <section className="pageHeader">
          <p className="eyebrow">Not found</p>
          <h1>Car not found</h1>
          <Link className="button primary" to="/registry">Back to registry</Link>
        </section>
      </main>
    )
  }

  return (
    <main>
      <section className="carPage">
        <Link className="backLink" to="/registry">← Back to registry</Link>

        <div className="carHero">
          <div>
            <p className="eyebrow">Registry entry</p>
            <h1>{car.registry_id}</h1>
            <p>{car.summary}</p>
            {renderClaimState()}
            {claimMessage && <p className="notice">{claimMessage}</p>}
          </div>

          <div className="photoPlaceholder">
            <span>Photo area</span>
            <small>{car.photos.length ? 'Approved public photos will appear here' : 'No public photos yet'}</small>
          </div>
        </div>

        <div className="metaGrid">
          <article><span>Last updated</span><strong>{car.updated_at ? new Date(car.updated_at).toLocaleDateString() : 'Unknown'}</strong></article>
          <article><span>Entry created</span><strong>{car.created_at ? new Date(car.created_at).toLocaleDateString() : 'Unknown'}</strong></article>
          <article><span>Updated by</span><strong>{car.updated_by ?? 'Unknown'}</strong></article>
          <article><span>Data confidence</span><strong>{car.data_confidence ?? 'Unknown'}</strong></article>
          <article><span>Originality</span><strong>{car.originality_rating ?? 'Unknown'}</strong></article>
          <article><span>Photos / documents</span><strong>{car.photo_count ?? 0} / {car.document_count ?? 0}</strong></article>
        </div>

        <div className="detailGrid">
          <article><span>Current registration</span><strong>{car.registration ?? 'Withheld'}</strong></article>
          <article><span>Partial VIN</span><strong>{car.partial_vin ?? 'Withheld'}</strong></article>
          <article><span>Colour</span><strong>{car.colour ?? 'Unknown'}</strong></article>
          <article><span>Interior</span><strong>{car.interior ?? 'Unknown'}</strong></article>
          <article><span>Country</span><strong>{car.country ?? 'Unknown'}</strong></article>
          <article><span>Status</span><strong>{car.status ?? 'Unknown'}</strong></article>
          <article><span>Known owners</span><strong>{car.owner_count ?? 'Unknown'}</strong></article>
          <article><span>Current owner since</span><strong>{car.current_owner_since ?? 'Unknown'}</strong></article>
          <article><span>Ownership</span><strong>{car.ownership_status ?? 'Unknown'}</strong></article>
        </div>

        <div className="subsection">
          <h2>Registration history</h2>
          <div className="regHistory">
            {car.registrations.map((reg, index) => (
              <div className="regStep" key={reg.id}>
                <span>{reg.registration}</span>
                {index < car.registrations.length - 1 && <b>→</b>}
              </div>
            ))}
          </div>
          {car.registrations.map((reg) => (
            <p className="subtle" key={`note-${reg.id}`}>
              <strong>{reg.registration}:</strong> {reg.start_year ?? 'Unknown'}–{reg.end_year ?? (reg.current_registration ? 'present' : 'unknown')} {reg.notes ? `— ${reg.notes}` : ''}
            </p>
          ))}
        </div>

        <div className="subsection">
          <h2>Originality checklist</h2>
          <p className="subtle">Present / Missing / Unknown / Refurbished / Optional gives a clearer picture than a simple score.</p>

          <div className="checklist">
            {Object.entries(grouped).map(([category, items]) => (
              <article className="checkGroup" key={category}>
                <h3>{category}</h3>
                {items.map((item) => (
                  <div className="checkItem" key={item.id}>
                    <span>{item.item_name}</span>
                    <em className={statusClass(item.status)}>{item.status}</em>
                  </div>
                ))}
              </article>
            ))}
          </div>
        </div>

        <div className="subsection">
          <h2>Sources</h2>
          {car.sources.length === 0 && <p className="subtle">No public sources listed yet.</p>}
          <div className="cardsGrid">
            {car.sources.map((source) => (
              <article className="miniCard" key={source.id}>
                <h3>{source.source_name ?? source.source_type ?? 'Source'}</h3>
                <p>{source.notes}</p>
                {source.source_url && <a href={source.source_url} target="_blank" rel="noreferrer">Open source</a>}
              </article>
            ))}
          </div>
        </div>

        <div className="subsection">
          <h2>Update history</h2>
          <div className="timeline">
            {car.change_log.map((entry) => (
              <article className="timelineEntry" key={entry.id}>
                <div>
                  <strong>{entry.change_date ? new Date(entry.change_date).toLocaleDateString() : 'Unknown date'}</strong>
                  <span>{entry.updated_by ?? 'Unknown'}</span>
                </div>
                <p>{entry.change_text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
