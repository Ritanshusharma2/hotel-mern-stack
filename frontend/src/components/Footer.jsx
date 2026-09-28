import React from 'react';
import { Hotel, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="glass-panel" style={{
      marginTop: 'auto',
      borderRadius: '16px 16px 0 0',
      borderBottom: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      padding: '4rem 0 2rem 0',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem',
        }}>
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '1.4rem',
              fontWeight: 800,
              color: '#fff',
              fontFamily: 'var(--font-serif)',
              marginBottom: '1rem',
            }}>
              <Hotel style={{ color: 'var(--primary)', width: '24px', height: '24px' }} />
              <span>QuickStay<span style={{ color: 'var(--primary)', fontWeight: '300' }}></span></span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Handpicked luxury hotels and residences in primary world destinations. Experience unforgettable comfort and legendary services.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', fontFamily: 'var(--font-sans)', color: '#fff' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <li><a href="/" style={{ color: 'var(--text-muted)' }} className="footer-link">Home</a></li>
              <li><a href="/?search=Paris" style={{ color: 'var(--text-muted)' }} className="footer-link">Paris Collection</a></li>
              <li><a href="/?search=Tokyo" style={{ color: 'var(--text-muted)' }} className="footer-link">Tokyo Collection</a></li>
              <li><a href="/?search=London" style={{ color: 'var(--text-muted)' }} className="footer-link">London Collection</a></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', fontFamily: 'var(--font-sans)', color: '#fff' }}>Contact Us</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} style={{ color: 'var(--primary)' }} />
                <span>15 Avenue Montaigne, Paris</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} style={{ color: 'var(--primary)' }} />
                <span>+1 (555) 123-4567</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} style={{ color: 'var(--primary)' }} />
                <span>concierge@aurelia.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '2rem',
          textAlign: 'center',
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
        }}>
          &copy; {new Date().getFullYear()} Aurelia Residences. All rights reserved. Made with love.
        </div>
      </div>

      <style>{`
        .footer-link:hover {
          color: var(--primary) !important;
          padding-left: 4px;
        }
        .footer-link {
          transition: var(--transition);
        }
      `}</style>
    </footer>
  );
};

export default Footer;
