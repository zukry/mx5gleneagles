import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { fetchCars, submitChangeRequest } from '../services/cars'
import type { Car } from '../types/database'

export default function Submit() {
  const [cars, setCars] = useState<Car[]>([])
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [selectedCarId, setSelectedCarId] = useState('')
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState('')
  const [registrationVisibility, setRegistrationVisibility] = useState('')

  useEffect(() => {
    fetchCars().then(setCars).catch(() => setCars([]))
    supabase.auth.getUser().then(({ data }) => setUserEmail(data.user?.email ?? null))
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('')

    try {
      await submitChangeRequest(Number(selectedCarId), {
        status: status || undefined,
        registration_visibility: registrationVisibility || undefined,
        notes,
      })
      setMessage('Update request submitted. It will be reviewed before publication.')
      setNotes('')
      setStatus('')
      setRegistrationVisibility('')
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Could not submit update.')
    }
  }

  return (
    <main>
      <section className="pageHeader">
        <p className="eyebrow">Submit</p>
        <h1>Submit an update</h1>
        <p>
          Owners and contributors can submit proposed changes. Requests are saved as pending
          records and should be approved before changing the public registry.
        </p>
        {!userEmail && <Link className="button primary" to="/auth">Log in to submit</Link>}
      </section>

      <section className="section submitPanel">
        {userEmail ? <p className="notice">Signed in as {userEmail}</p> : <p className="notice">You must be signed in before submitting updates.</p>}

        <form className="form" onSubmit={handleSubmit}>
          <label>
            Car
            <select value={selectedCarId} onChange={(event) => setSelectedCarId(event.target.value)} required>
              <option value="">Select a car</option>
              {cars.map((car) => (
                <option value={car.id} key={car.id}>{car.registry_id} — {car.registration}</option>
              ))}
            </select>
          </label>

          <label>
            New status
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="">No change</option>
              <option>Roadworthy</option>
              <option>Under restoration</option>
              <option>Stored</option>
              <option>Exported</option>
              <option>Scrapped</option>
              <option>Unknown</option>
            </select>
          </label>

          <label>
            Registration visibility
            <select value={registrationVisibility} onChange={(event) => setRegistrationVisibility(event.target.value)}>
              <option value="">No change</option>
              <option value="public">Public</option>
              <option value="partial">Partial</option>
              <option value="hidden">Hidden</option>
            </select>
          </label>

          <label>
            Notes / evidence
            <textarea value={notes} onChange={(event) => setNotes(event.target.value)} required rows={7} />
          </label>

          <button className="button primary" type="submit" disabled={!userEmail}>Submit for review</button>
        </form>

        {message && <p className="notice">{message}</p>}
      </section>
    </main>
  )
}
