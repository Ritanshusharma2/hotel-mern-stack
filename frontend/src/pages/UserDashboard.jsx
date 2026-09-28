import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Calendar, Users, MapPin, CheckCircle2, AlertOctagon, XCircle, CreditCard, ChevronRight } from 'lucide-react';

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);

  // Check if redirected from a successful booking checkout
  useEffect(() => {
    if (location.state?.bookingSuccess) {
      setShowSuccessAlert(true);
      // Clean up history state so reloading doesn't show alert again
      window.history.replaceState({}, document.title);
      // Auto-hide alert after 5 seconds
      const timer = setTimeout(() => setShowSuccessAlert(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const fetchUserBookings = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/bookings/mybookings');
      setBookings(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      return;
    }

    try {
      setCancellingId(bookingId);
      await axios.put(`/api/bookings/${bookingId}/cancel`);
      
      // Update local state instead of re-fetching completely
      setBookings(prevBookings =>
        prevBookings.map(b =>
          b._id === bookingId ? { ...b, status: 'Cancelled' } : b
        )
      );
      setCancellingId(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking');
      setCancellingId(null);
    }
  };

  // Group Bookings
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const activeBookings = bookings.filter(b => b.status !== 'Cancelled' && new Date(b.checkOut) >= today);
  const pastBookings = bookings.filter(b => b.status === 'Cancelled' || new Date(b.checkOut) < today);

  const getStatusBadge = (status) => {
    if (status === 'Confirmed') return <span className="badge badge-success">Confirmed</span>;
    if (status === 'Cancelled') return <span className="badge badge-danger">Cancelled</span>;
    return <span className="badge badge-warning">{status}</span>;
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '60vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem', minHeight: '70vh' }}>
      
      {/* Success Alert Banner */}
      {showSuccessAlert && (
        <div className="glass-panel" style={{
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          padding: '1.25rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}>
          <CheckCircle2 size={28} style={{ color: 'var(--success)' }} />
          <div>
            <h4 style={{ color: '#fff', fontSize: '1.1rem', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>Booking Confirmed!</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Your reservation was recorded successfully. A confirmation receipt has been sent to your profile.</p>
          </div>
        </div>
      )}

      {/* Profile Header */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--primary) 0%, #b39025 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.8rem',
          fontWeight: 800,
          color: 'var(--text-dark)',
        }}>
          {user?.name?.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-sans)' }}>{user?.name}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {user?.email} &middot; Phone: {user?.phone || 'No phone number provided'}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2.5rem', alignItems: 'start' }}>
        
        {/* Left Column: Booking Lists */}
        <div>
          {/* Active Bookings */}
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Active Reservations
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 400 }}>({activeBookings.length})</span>
          </h3>

          {activeBookings.length === 0 ? (
            <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', marginBottom: '3rem' }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>You don't have any active reservations. Ready to book your next trip?</p>
              <button onClick={() => navigate('/')} className="btn btn-primary">Find a Suite</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
              {activeBookings.map((booking) => (
                <div key={booking._id} className="glass-panel" style={{ display: 'grid', gridTemplateColumns: '200px 1fr', overflow: 'hidden' }}>
                  <img
                    src={booking.hotel?.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80'}
                    alt={booking.hotel?.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                        <div>
                          <h4 style={{ fontSize: '1.25rem', color: '#fff', fontFamily: 'var(--font-sans)' }}>{booking.hotel?.name}</h4>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                            <MapPin size={12} style={{ color: 'var(--primary)' }} />
                            {booking.hotel?.city}
                          </span>
                        </div>
                        {getStatusBadge(booking.status)}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '1rem 0', background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.04)' }}>
                        <div>
                          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Check-In</span>
                          <span style={{ fontSize: '0.85rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.15rem' }}>
                            <Calendar size={12} style={{ color: 'var(--primary)' }} />
                            {new Date(booking.checkIn).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Check-Out</span>
                          <span style={{ fontSize: '0.85rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.15rem' }}>
                            <Calendar size={12} style={{ color: 'var(--primary)' }} />
                            {new Date(booking.checkOut).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        <span>Room Type: <strong style={{ color: '#fff' }}>{booking.room?.title}</strong></span>
                        <span>Guests: <strong style={{ color: '#fff' }}>{booking.guests}</strong></span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem', marginTop: '1rem' }}>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Paid Amount</span>
                        <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)' }}>${booking.totalPrice}</span>
                      </div>

                      {new Date(booking.checkIn) > today && (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          disabled={cancellingId === booking._id}
                          className="btn btn-danger"
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                        >
                          {cancellingId === booking._id ? 'Cancelling...' : 'Cancel Stay'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Past Bookings */}
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Past & Cancelled Bookings
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 400 }}>({pastBookings.length})</span>
          </h3>

          {pastBookings.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No past reservation records found.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {pastBookings.map((booking) => (
                <div key={booking._id} className="glass-panel" style={{
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  opacity: 0.7,
                }}>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {booking.hotel?.name}
                      {getStatusBadge(booking.status)}
                    </h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                      {booking.room?.title} &middot; {new Date(booking.checkIn).toLocaleDateString()} to {new Date(booking.checkOut).toLocaleDateString()} &middot; ${booking.totalPrice}
                    </p>
                  </div>
                  <button onClick={() => navigate(`/hotel/${booking.hotel?._id}`)} className="btn btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
                    View Sanctuary
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Mini Info Cards */}
        <div>
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '1rem' }}>Concierge Support</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '1rem' }}>
              Need assistance modifying your dates or requests? Contact the Aurelia elite services line directly.
            </p>
            <span style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 600 }}>+1 (555) 987-6543</span>
          </div>

          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h4 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '1rem' }}>Simulated Payment Wallet</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '1rem' }}>
              This profile has mock payments enabled. All booking checkouts bypass real banks and credit networks.
            </p>
            <span style={{ color: 'var(--success)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              <CreditCard size={14} />
              Sandboxed Mode Active
            </span>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 992px) {
          .container > div {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default UserDashboard;
