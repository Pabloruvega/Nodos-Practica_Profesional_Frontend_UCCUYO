import { NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav>
      <NavLink to="/">Evaluación</NavLink>
      <NavLink to="/historial">Historial</NavLink>
    </nav>
  )
}