export function Navbar({ isMobile, children }) {
  return (
    <nav className="nav-bar">
      <Logo isMobile={isMobile} />
      {children}
    </nav>
  );
}

function Logo({ isMobile }) {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      {!isMobile && <h1>usePopcorn</h1>}
    </div>
  );
}
