import { BrowserRouter, Link, NavLink, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Registry from './pages/Registry'
import CarDetails from './pages/CarDetails'
import History from './pages/History'
import Submit from './pages/Submit'
import Privacy from './pages/Privacy'
import Auth from './pages/Auth'
import Admin from './pages/Admin'
import Statistics from './pages/Statistics'

export default function App() {
  return (
    <BrowserRouter>
      <div className="site">
        <header className="topbar">
          <Link className="brand" to="/">
            <span>MX5</span>
            Gleneagles Registry
          </Link>

          <nav>
            <NavLink to="/registry">Registry</NavLink>
            <NavLink to="/statistics">Statistics</NavLink>
            <NavLink to="/history">History</NavLink>
            <NavLink to="/submit">Submit</NavLink>
            <NavLink to="/auth">Login</NavLink>
            <NavLink to="/admin">Admin</NavLink>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/registry" element={<Registry />} />
          <Route path="/cars/:slug" element={<CarDetails />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/history" element={<History />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>

        <footer>
          <p>
            MX5 Gleneagles Registry is an independent enthusiast archive. It is not
            affiliated with Mazda Motor Corporation, the MX-5 Owners Club, or Gleneagles Hotel.
          </p>
          <p>
            Site operated by Zukry ·{' '}
            <a href="https://github.com/zukry/mx5gleneagles" target="_blank" rel="noreferrer">
              View source on GitHub
            </a>
          </p>
          <Link to="/privacy">Privacy and data policy</Link>
        </footer>
      </div>
    </BrowserRouter>
  )
}
