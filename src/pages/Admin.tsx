import { useEffect, useState } from 'react'
import {
  fetchPendingChangeRequests,
  fetchPendingOwnershipClaims,
  isCurrentUserAdmin,
  reviewChangeRequest,
  reviewOwnershipClaim,
  type PendingChangeRequest,
  type PendingOwnershipClaim,
} from '../services/admin'
import Loading from '../components/Loading'
import ErrorBox from '../components/ErrorBox'

export default function Admin() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [checked, setChecked] = useState(false)
  const [changeRequests, setChangeRequests] = useState<PendingChangeRequest[]>([])
  const [ownershipClaims, setOwnershipClaims] = useState<PendingOwnershipClaim[]>([])
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const admin = await isCurrentUserAdmin()
        setIsAdmin(admin)
        if (admin) {
          const [claims, requests] = await Promise.all([
            fetchPendingOwnershipClaims(),
            fetchPendingChangeRequests(),
          ])
          setOwnershipClaims(claims)
          setChangeRequests(requests)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not load admin page.')
      } finally {
        setChecked(true)
      }
    }
    load()
  }, [])

  async function markChangeReviewed(id: number, status: 'approved' | 'rejected') {
    setMessage('')
    try {
      await reviewChangeRequest(id, status, `Marked ${status} in admin UI. Apply approved changes manually until automatic merge is added.`)
      setChangeRequests((current) => current.filter((request) => request.id !== id))
      setMessage(`Update request ${status}.`)
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Could not update request.')
    }
  }

  async function markClaimReviewed(id: number, status: 'approved' | 'rejected') {
    setMessage('')
    try {
      await reviewOwnershipClaim(id, status, `Marked ${status} in admin UI. Contact user separately for proof before approval.`)
      setOwnershipClaims((current) => current.filter((claim) => claim.id !== id))
      setMessage(`Ownership claim ${status}.`)
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Could not update claim.')
    }
  }

  if (!checked) return <main><section className="pageHeader"><Loading label="Checking admin access" /></section></main>

  return (
    <main>
      <section className="pageHeader">
        <p className="eyebrow">Admin</p>
        <h1>Pending review</h1>
        <p>Review ownership claims and owner-submitted changes before updating the public registry.</p>
      </section>

      <section className="section">
        {error && <ErrorBox message={error} />}
        {!isAdmin && <p className="notice">You are not listed as an admin user. Add your auth user ID to the admin_users table in Supabase.</p>}
        {message && <p className="notice">{message}</p>}

        {isAdmin && (
          <>
            <div className="subsection">
              <h2>Ownership claims</h2>
              {ownershipClaims.length === 0 && <p className="notice">No pending ownership claims.</p>}
              <div className="cardsGrid">
                {ownershipClaims.map((claim) => (
                  <article className="miniCard" key={claim.id}>
                    <h3>{claim.cars?.registry_id ?? `Car #${claim.car_id}`}</h3>
                    <p><strong>Registration:</strong> {claim.cars?.registration ?? 'Unknown'}</p>
                    <p><strong>User email:</strong> {claim.submitted_email ?? 'No email recorded'}</p>
                    <p><strong>Status:</strong> {claim.status}</p>
                    <p><strong>Submitted:</strong> {claim.created_at ? new Date(claim.created_at).toLocaleString() : 'Unknown'}</p>
                    {claim.claim_notes && <p>{claim.claim_notes}</p>}
                    <div className="heroActions">
                      <a className="button secondary" href={`mailto:${claim.submitted_email ?? ''}?subject=MX5 Gleneagles Registry ownership proof for ${claim.cars?.registry_id ?? 'your car'}`}>Email user</a>
                      <button className="button primary" type="button" onClick={() => markClaimReviewed(claim.id, 'approved')}>Mark approved</button>
                      <button className="button secondary" type="button" onClick={() => markClaimReviewed(claim.id, 'rejected')}>Reject</button>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="subsection">
              <h2>Data update requests</h2>
              {changeRequests.length === 0 && <p className="notice">No pending update requests.</p>}
              <div className="cardsGrid">
                {changeRequests.map((request) => (
                  <article className="miniCard" key={request.id}>
                    <h3>{request.cars?.registry_id ?? `Car #${request.car_id}`}</h3>
                    <p>Status: {request.status}</p>
                    <pre>{JSON.stringify(request.proposed_changes, null, 2)}</pre>
                    <div className="heroActions">
                      <button className="button primary" type="button" onClick={() => markChangeReviewed(request.id, 'approved')}>Mark approved</button>
                      <button className="button secondary" type="button" onClick={() => markChangeReviewed(request.id, 'rejected')}>Reject</button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  )
}
