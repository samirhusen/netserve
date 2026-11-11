import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const CUSTOMER_LINKS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/plans', label: 'Plans' },
  { to: '/bills', label: 'Bills' },
  { to: '/tickets', label: 'Support' },
  { to: '/profile', label: 'Profile' },
];

const ADMIN_LINKS = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/plans', label: 'Plans' },
  { to: '/admin/subscriptions', label: 'Subscriptions' },
  { to: '/admin/bills', label: 'Bills' },
  { to: '/admin/tickets', label: 'Tickets' },
];

const GUEST_LINKS = [{ to: '/plans', label: 'Plans' }];

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const links = !user ? GUEST_LINKS : isAdmin ? ADMIN_LINKS : CUSTOMER_LINKS;

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark app-navbar sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold" to={user ? (isAdmin ? '/admin' : '/dashboard') : '/'}>
          <span className="brand-dot" /> NetServe
          {isAdmin && <span className="badge bg-warning text-dark ms-2 small">Admin</span>}
        </Link>

        <button className="navbar-toggler" type="button" aria-label="Toggle navigation" onClick={() => setOpen(!open)}>
          <span className="navbar-toggler-icon" />
        </button>

        <div className={`collapse navbar-collapse ${open ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto">
            {links.map((link) => (
              <li className="nav-item" key={link.to}>
                <NavLink className="nav-link" to={link.to} end={link.end} onClick={() => setOpen(false)}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="d-flex align-items-center gap-2">
            {user ? (
              <>
                <span className="text-white-50 small me-2">Hi, {user.fullName}</span>
                <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link className="btn btn-outline-light btn-sm" to="/login" onClick={() => setOpen(false)}>Login</Link>
                <Link className="btn btn-light btn-sm" to="/register" onClick={() => setOpen(false)}>Sign up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
