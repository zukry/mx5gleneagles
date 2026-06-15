import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { supabase } from '../lib/supabase'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setCurrentUser(data.user?.email ?? null))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user.email ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setMessage(error ? error.message : 'Signed in.')
  }

  async function signUp() {
    setMessage('')
    const { error } = await supabase.auth.signUp({ email, password })
    setMessage(error ? error.message : 'Account created. Check your email if confirmation is enabled.')
  }

  async function signOut() {
    await supabase.auth.signOut()
    setMessage('Signed out.')
  }

  return (
    <main>
      <section className="pageHeader">
        <p className="eyebrow">Account</p>
        <h1>Login or create account</h1>
        <p>Accounts are used for car claims and proposed registry updates.</p>
      </section>

      <section className="section submitPanel">
        {currentUser ? (
          <div>
            <p className="notice">Signed in as {currentUser}</p>
            <button className="button secondary" type="button" onClick={signOut}>Sign out</button>
          </div>
        ) : (
          <form className="form" onSubmit={signIn}>
            <label>
              Email
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </label>
            <label>
              Password
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={6} />
            </label>
            <div className="heroActions">
              <button className="button primary" type="submit">Sign in</button>
              <button className="button secondary" type="button" onClick={signUp}>Create account</button>
            </div>
          </form>
        )}
        {message && <p className="notice">{message}</p>}
      </section>
    </main>
  )
}
