import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Hotel, User, LogOut, ShieldAlert, Compass } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="glass-panel" style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      borderRadius: '0 0 16px 16px',
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px',
      }}>
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '1.5rem',
          fontWeight: 800,
          color: '#fff',
          fontFamily: 'var(--font-serif)',
        }}>
          <Hotel style={{ color: 'var(--primary)', width: '28px', height: '28px' }} />
          <span>QuickStay<span style={{ color: 'var(--primary)', fontWeight: '600' }}></span></span>
        </Link>

        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
        }}>
          <Link to="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            fontSize: '0.9rem',
            fontWeight: '500',
            color: 'var(--text-muted)',
          }} className="nav-link">
            <Compass size={16} />
            Explore
          </Link>

          {user ? (
            <>
              <Link to="/my-bookings" style={{
                fontSize: '0.9rem',
                fontWeight: '500',
                color: 'var(--text-muted)',
              }} className="nav-link">
                My Bookings
              </Link>

              {user.isAdmin && (
                <Link to="/admin" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: 'var(--primary)',
                }} className="nav-link">
                  <ShieldAlert size={16} />
                  Admin
                </Link>
              )}

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
                paddingLeft: '1rem',
              }}>
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.9rem',
                  color: '#fff',
                  fontWeight: '500',
                }}>
                  <User size={16} style={{ color: 'var(--primary)' }} />
                  {user.name}
                </span>

                <button onClick={handleLogout} className="btn btn-danger" style={{
                  padding: '0.4rem 0.8rem',
                  fontSize: '0.8rem',
                }}>
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}>
              <Link to="/login" className="btn btn-secondary" style={{
                padding: '0.5rem 1.2rem',
                fontSize: '0.8rem',
              }}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary" style={{
                padding: '0.5rem 1.2rem',
                fontSize: '0.8rem',
              }}>
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>

      <style>{`
        .nav-link:hover {
          color: #fff !important;
        }
      `}</style>
    </header>
  );
};

export default Navbar;
