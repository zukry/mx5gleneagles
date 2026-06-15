import { BrowserRouter, Link, NavLink, Route, Routes } from "react-router-dom"
import { cars } from "./data/cars"
import Home from "./pages/Home"
import Registry from "./pages/Registry"
import CarDetails from "./pages/CarDetails"
import History from "./pages/History"
import Submit from "./pages/Submit"
import Privacy from "./pages/Privacy"

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
            <NavLink to="/history">History</NavLink>
            <NavLink to="/submit">Submit</NavLink>
            <NavLink to="/privacy">Privacy</NavLink>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<Home cars={cars} />} />
          <Route path="/registry" element={<Registry cars={cars} />} />
          <Route path="/cars/:slug" element={<CarDetails cars={cars} />} />
          <Route path="/history" element={<History />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>

        <footer>
          <p>
            MX5 Gleneagles Registry is an independent enthusiast archive. It is not
            affiliated with Mazda Motor Corporation, the MX-5 Owners Club, or Gleneagles Hotel.
          </p>
        </footer>
      </div>
    </BrowserRouter>
  )
}
