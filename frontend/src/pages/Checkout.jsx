import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CreditCard, Calendar, Users, ShieldCheck, Landmark, Building, MapPin } from 'lucide-react';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // States from location
  const bookingState = location.state;

  const [hotel, setHotel] = useState(null);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Card Payment State
  const [cardName, setCardName] = useState(user?.name || '');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [paymentError, setPaymentError] = useState(null);

  useEffect(() => {
    if (!bookingState || !bookingState.hotelId || !bookingState.roomId) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const hotelRes = await axios.get(`/api/hotels/${bookingState.hotelId}`);
        setHotel(hotelRes.data);

        const roomRes = await axios.get(`/api/rooms/${bookingState.roomId}`);
        setRoom(roomRes.data);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching checkout data:', err);
        setLoading(false);
      }
    };

    fetchData();
  }, [bookingState, navigate]);

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '60vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!hotel || !room) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2>Error Loading Checkout</h2>
        <button onClick={() => navigate('/')} className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Back to Home</button>
      </div>
    );
  }

  // Calculate pricing
  const checkInDate = new Date(bookingState.checkIn);
  const checkOutDate = new Date(bookingState.checkOut);
  const diffTime = Math.abs(checkOutDate - checkInDate);
  const totalNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const subtotal = room.price * totalNights;
  const tax = Math.round(subtotal * 0.1 * 100) / 100; // 10% tax
  const totalAmount = subtotal + tax;

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setPaymentError(null);

    // Basic validation
    if (!cardName || !cardNumber || !cardExpiry || !cardCvv) {
      setPaymentError('Please fill out all payment details.');
      return;
    }

    if (cardNumber.replace(/\s/g, '').length < 16) {
      setPaymentError('Invalid card number. Must be 16 digits.');
      return;
    }

    try {
      setProcessing(true);

      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const paymentDetails = {
        cardBrand: cardNumber.startsWith('4') ? 'Visa' : 'Mastercard',
        last4: cardNumber.replace(/\s/g, '').slice(-4),
        transactionId: `TXN_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      };

      await axios.post('/api/bookings', {
        hotelId: hotel._id,
        roomId: room._id,
        checkIn: bookingState.checkIn,
        checkOut: bookingState.checkOut,
        guests: bookingState.guests,
        paymentDetails,
      });

      setProcessing(false);
      // Redirect to bookings page with success alert
      navigate('/my-bookings', { state: { bookingSuccess: true } });
    } catch (err) {
      setProcessing(false);
      setPaymentError(err.response?.data?.message || 'Payment processing failed. Please try again.');
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
    }
    return v;
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem' }}>
      <h2 style={{ fontSize: '2.2rem', marginBottom: '2rem', fontFamily: 'var(--font-serif)', textAlign: 'center' }}>
        Complete Your Sanctuary Booking
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '2.5rem',
        alignItems: 'start',
      }}>
        {/* Left Side: Secure Checkout & Payment Details */}
        <div className="glass-panel" style={{ padding: '2.5rem' }}>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff' }}>
            <ShieldCheck size={22} style={{ color: 'var(--primary)' }} />
            Secure Payment
          </h3>

          {paymentError && (
            <div className="badge badge-danger" style={{ marginBottom: '1.5rem', width: '100%', padding: '0.75rem', justifyContent: 'center' }}>
              {paymentError}
            </div>
          )}

          <form onSubmit={handlePaymentSubmit}>
            <div className="form-group">
              <label className="form-label">Cardholder Name</label>
              <input
                type="text"
                className="form-input"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="As printed on card"
                disabled={processing}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Card Number</label>
              <div style={{ position: 'relative' }}>
                <CreditCard size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                <input
                  type="text"
                  className="form-input"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                  style={{ paddingLeft: '2.5rem' }}
                  disabled={processing}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Expiration Date</label>
                <input
                  type="text"
                  className="form-input"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                  placeholder="MM/YY"
                  maxLength={5}
                  disabled={processing}
                />
              </div>

              <div className="form-group">
                <label className="form-label">CVV Security Code</label>
                <input
                  type="password"
                  className="form-input"
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="000"
                  maxLength={3}
                  disabled={processing}
                />
              </div>
            </div>

            <div style={{ margin: '1.5rem 0', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <Landmark size={24} style={{ color: 'var(--primary)', flexShrink: 0 }} />
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                Your payment is fully encrypted and secured. Aurelia Residences processes credit transactions according to PCI-DSS standards.
              </p>
            </div>

            <button type="submit" className="btn btn-primary btn-block" style={{ height: '50px' }} disabled={processing}>
              {processing ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></div>
                  <span>Securing Booking...</span>
                </div>
              ) : `Pay $${totalAmount.toLocaleString()}`}
            </button>
          </form>
        </div>

        {/* Right Side: Booking Breakdown Receipt */}
        <div className="glass-panel" style={{ padding: '2.5rem' }}>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>Booking Summary</h3>

          {/* Hotel Mini details */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <img
              src={hotel.images[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=150&q=80'}
              alt={hotel.name}
              style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
            />
            <div>
              <h4 style={{ fontSize: '1.1rem', color: '#fff', fontFamily: 'var(--font-sans)', marginBottom: '0.25rem' }}>{hotel.name}</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                <MapPin size={12} style={{ color: 'var(--primary)' }} />
                <span>{hotel.city}</span>
              </div>
              <span className="badge badge-primary" style={{ marginTop: '0.5rem', fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}>{room.title}</span>
            </div>
          </div>

          {/* Booking Dates / Info */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '6px',
            padding: '1rem',
            marginBottom: '2rem',
          }}>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Check-In</span>
              <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                <Calendar size={14} style={{ color: 'var(--primary)' }} />
                {new Date(bookingState.checkIn).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Check-Out</span>
              <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                <Calendar size={14} style={{ color: 'var(--primary)' }} />
                {new Date(bookingState.checkOut).toLocaleDateString()}
              </span>
            </div>
            <div style={{ gridColumn: 'span 2', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Guests & Duration</span>
              <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                <Users size={14} style={{ color: 'var(--primary)' }} />
                {bookingState.guests} Guests &middot; {totalNights} {totalNights === 1 ? 'Night' : 'Nights'}
              </span>
            </div>
          </div>

          {/* Pricing breakdown list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Room Rate (${room.price} x {totalNights} nights)</span>
              <span style={{ color: '#fff' }}>${subtotal.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Luxury Lodging Tax (10%)</span>
              <span style={{ color: '#fff' }}>${tax.toLocaleString()}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '1.2rem',
              fontWeight: 700,
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              paddingTop: '1rem',
              marginTop: '0.5rem',
            }}>
              <span style={{ color: '#fff' }}>Total Amount</span>
              <span style={{ color: 'var(--primary)' }}>${totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
