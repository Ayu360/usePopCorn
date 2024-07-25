import useWindowSize from "./useWindowSize";

export function Navbar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function Logo() {
  const { isMobile } = useWindowSize();
  return (
    <div className="logo">
      <span role="img">🍿</span>
      {!isMobile && <h1>usePopcorn</h1>}
    </div>
  );
}
