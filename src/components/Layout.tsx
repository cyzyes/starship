import { NavLink, Outlet } from "react-router-dom";
import { OxTextCursor } from "@/components/OxTextCursor";
import { SpaceshipLogo } from "@/components/SpaceshipLogo";
import { VaporBackdrop } from "@/components/VaporBackdrop";

const nav = [
  { to: "/write", label: "Write Post", icon: "edit_note" },
  { to: "/about", label: "About Me", icon: "person_search" },
  { to: "/plaza", label: "Blog Plaza", icon: "grid_view" },
] as const;

function NavIcon({ name }: { name: string }) {
  return (
    <span className="material-symbols-outlined" aria-hidden>
      {name}
    </span>
  );
}

export function Layout() {
  return (
    <>
      <OxTextCursor />
      <VaporBackdrop />

      <header className="site-header">
        <NavLink to="/" className="brand-lockup">
          <SpaceshipLogo className="logo-mark" />
          <span className="brand-title">FREE_OS</span>
        </NavLink>
        <button type="button" className="icon-btn" aria-label="Launch console">
          <span className="material-symbols-outlined">rocket_launch</span>
        </button>
      </header>

      <main className="app-shell">
        <Outlet />
      </main>

      <nav className="dock-nav" aria-label="Primary navigation">
        <div className="dock-nav-head">
          <div className="font-headline" style={{ color: "var(--cyan)", lineHeight: 1 }}>
            FREE_OS
          </div>
          <div className="font-label" style={{ color: "var(--cyan)", opacity: 0.55 }}>
            V.84-BETA
          </div>
        </div>
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => (isActive ? "active" : undefined)}
          >
            <NavIcon name={item.icon} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <nav className="mobile-tabbar" aria-label="Mobile navigation">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => (isActive ? "active" : undefined)}
          >
            <NavIcon name={item.icon} />
            <span>{item.label.split(" ")[0]}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
