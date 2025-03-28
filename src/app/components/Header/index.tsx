import Link from 'next/link';

export const Header = () => {
  return (
    <header>
      <nav className="header">
        <Link className="logo" href="#"></Link>
        <Link className="items" href="#">Home</Link>
        <Link className="items" href="#about">About</Link>
        <Link className="items" href="#contact">Contact</Link>
      </nav>
    </header>
  )
}

export default Header;