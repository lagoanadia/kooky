// Header.tsx
import logoImg from '../images/Logo.png'; // versión SIN el círculo verde de fondo

function Logo() {
  return (
    <header className="header">
      <img src={logoImg} alt="Kooky" className="header-logo" />
    </header>
  )
}

export default Logo