import React, { useState, useEffect, useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import RatingStars from '../components/RatingStars';
import { MapPin, Calendar, Users, Coffee, Wifi, Tv, Wind, CheckCircle, HelpCircle, Star, MessageSquare } from 'lucide-react';

const HotelDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Parse query params for dates
  const queryParams = new URLSearchParams(location.search);
  const initialCheckIn = queryParams.get('checkIn') || '';
  const initialCheckOut = queryParams.get('checkOut') || '';
  const initialGuests = queryParams.get('guests') || '2';

  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Availability Search State
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [guests, setGuests] = useState(initialGuests);

  // Rooms Availability State (maps roomId -> available details)
  const [roomsAvailability, setRoomsAvailability] = useState({});
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  // Review Form State
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewError, setReviewError] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const fetchHotelDetails = async () => {
    try {
      setLoading(true);
      const hotelRes = await axios.get(`/api/hotels/${id}`);
      setHotel(hotelRes.data);

      const roomsRes = await axios.get(`/api/hotels/${id}/rooms`);
      setRooms(roomsRes.data);

      const reviewsRes = await axios.get(`/api/reviews/${id}`);
      setReviews(reviewsRes.data);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching hotel details:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotelDetails();
  }, [id]);

  // Check availability for all rooms when dates change
  useEffect(() => {
    const checkAllRoomsAvailability = async () => {
      if (!checkIn || !checkOut || rooms.length === 0) return;

      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      if (checkInDate >= checkOutDate) return;

      try {
        setCheckingAvailability(true);
        const availabilityData = {};

        await Promise.all(
          rooms.map(async (room) => {
            const { data } = await axios.get(`/api/rooms/${room._id}/availability?checkIn=${checkIn}&checkOut=${checkOut}`);
            availabilityData[room._id] = data;
          })
        );

        setRoomsAvailability(availabilityData);
        setCheckingAvailability(false);
      } catch (err) {
        console.error('Error checking room availabilities:', err);
        setCheckingAvailability(false);
      }
    };

    checkAllRoomsAvailability();
  }, [checkIn, checkOut, rooms]);

  const handleBookRoom = (room) => {
    if (!user) {
      navigate('/login', { state: { from: location.pathname + location.search } });
      return;
    }

    if (!checkIn || !checkOut) {
      alert('Please select check-in and check-out dates first.');
      return;
    }

    navigate('/checkout', {
      state: {
        hotelId: hotel._id,
        roomId: room._id,
        checkIn,
        checkOut,
        guests: Number(guests),
      },
    });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError(null);
    setReviewSuccess(false);

    if (!reviewComment) {
      setReviewError('Please enter a comment.');
      return;
    }

    try {
      await axios.post(`/api/reviews/${hotel._id}`, {
        rating: reviewRating,
        comment: reviewComment,
      });

      setReviewSuccess(true);
      setReviewComment('');
      setReviewRating(5);

      // Re-fetch hotel and reviews to update average rating and reviews list
      const hotelRes = await axios.get(`/api/hotels/${id}`);
      setHotel(hotelRes.data);
      const reviewsRes = await axios.get(`/api/reviews/${id}`);
      setReviews(reviewsRes.data);
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    }
  };

  const getAmenityIcon = (amenity) => {
    const text = amenity.toLowerCase();
    if (text.includes('wi-fi') || text.includes('internet')) return <Wifi size={16} />;
    if (text.includes('coffee') || text.includes('espresso')) return <Coffee size={16} />;
    if (text.includes('tv') || text.includes('screen')) return <Tv size={16} />;
    if (text.includes('air') || text.includes('condition')) return <Wind size={16} />;
    return <CheckCircle size={16} />;
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '60vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2>Hotel Not Found</h2>
        <button onClick={() => navigate('/')} className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Back to Home</button>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem' }}>
      {/* Header Info */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-serif)', marginBottom: '0.5rem' }}>{hotel.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              <MapPin size={16} style={{ color: 'var(--primary)' }} />
              <span>{hotel.address} &middot; {hotel.distance}</span>
            </div>
          </div>
          <div className="glass-panel" style={{ padding: '0.75rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Rating</span>
            <RatingStars rating={hotel.rating} count={hotel.numReviews} />
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '1rem',
        height: '400px',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        marginBottom: '3rem',
        boxShadow: 'var(--shadow-md)',
      }}>
        <div style={{ height: '100%' }}>
          <img
            src={hotel.images[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'}
            alt={hotel.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '1rem', height: '100%' }}>
          <img
            src={hotel.images[1] || 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80'}
            alt={hotel.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <img
            src={hotel.images[2] || 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80'}
            alt={hotel.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '3rem',
      }}>
        {/* Left Column: Description & Rooms */}
        <div>
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '3rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontFamily: 'var(--font-sans)', color: '#fff' }}>About Aurelia Sanctuary</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '1rem' }}>
              {hotel.description}
            </p>
          </div>

          {/* Rooms Availability Checking */}
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)' }}>Available Accommodations</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
            {rooms.map((room) => {
              const availability = roomsAvailability[room._id];
              const hasChecked = availability !== undefined;
              const isAvailable = hasChecked ? availability.isAvailable : true;
              const availQty = hasChecked ? availability.availableQuantity : room.quantity;

              return (
                <div key={room._id} className="glass-panel" style={{
                  display: 'grid',
                  gridTemplateColumns: '220px 1fr',
                  overflow: 'hidden',
                }}>
                  <div style={{ height: '100%', minHeight: '180px' }}>
                    <img
                      src={room.images[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80'}
                      alt={room.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <h4 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-sans)', color: '#fff' }}>{room.title}</h4>
                        <div>
                          {checkIn && checkOut ? (
                            isAvailable ? (
                              <span className="badge badge-success">Available ({availQty} left)</span>
                            ) : (
                              <span className="badge badge-danger">Sold Out</span>
                            )
                          ) : (
                            <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                              <HelpCircle size={12} />
                              Select dates to check
                            </span>
                          )}
                        </div>
                      </div>

                      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>{room.description}</p>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
                        <span style={{ fontSize: '0.8rem', color: '#fff', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                          <Users size={12} style={{ color: 'var(--primary)' }} />
                          Max {room.maxPeople} guests
                        </span>
                        {room.amenities.map((amenity, idx) => (
                          <span key={idx} style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', background: 'rgba(255,255,255,0.03)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                            {getAmenityIcon(amenity)}
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Price</span>
                        <span style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--primary)' }}>
                          ${room.price}
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400 }}> / night</span>
                        </span>
                      </div>

                      <button
                        onClick={() => handleBookRoom(room)}
                        disabled={checkIn && checkOut && !isAvailable}
                        className="btn btn-primary"
                        style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
                      >
                        {isAvailable ? 'Book Suite' : 'Sold Out'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reviews List */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontFamily: 'var(--font-sans)', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageSquare size={20} style={{ color: 'var(--primary)' }} />
              Guest Reviews ({reviews.length})
            </h3>

            {reviews.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>No reviews yet for this sanctuary. Be the first to share your experience!</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {reviews.map((review) => (
                  <div key={review._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: '600', color: '#fff' }}>{review.user?.name || 'Anonymous User'}</span>
                      <RatingStars rating={review.rating} />
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>"{review.comment}"</p>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)', marginTop: '0.25rem', display: 'block' }}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Reservation Panel & Write Review */}
        <div>
          {/* Reservation Widget */}
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', position: 'sticky', top: '90px' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1.25rem', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>Check Availability</h3>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Check-in Date</label>
              <input
                type="date"
                className="form-input"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Check-out Date</label>
              <input
                type="date"
                className="form-input"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                min={checkIn || new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Guests</label>
              <select
                className="form-input"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
              >
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4">4 Guests</option>
                <option value="5">5+ Guests</option>
              </select>
            </div>

            {checkingAvailability && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--primary)', fontSize: '0.85rem' }}>
                <div className="spinner" style={{ width: '14px', height: '14px', borderWidth: '2px' }}></div>
                <span>Checking room options...</span>
              </div>
            )}
          </div>

          {/* Write a Review Widget */}
          {user ? (
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1.25rem', color: '#fff' }}>Leave a Review</h3>

              {reviewSuccess && (
                <div className="badge badge-success" style={{ marginBottom: '1rem', width: '100%', padding: '0.5rem', justifyContent: 'center' }}>
                  Review posted successfully!
                </div>
              )}

              {reviewError && (
                <div className="badge badge-danger" style={{ marginBottom: '1rem', width: '100%', padding: '0.5rem', justifyContent: 'center' }}>
                  {reviewError}
                </div>
              )}

              <form onSubmit={handleReviewSubmit}>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Rating</label>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      >
                        <Star
                          size={24}
                          fill={star <= reviewRating ? 'var(--primary)' : 'none'}
                          color={star <= reviewRating ? 'var(--primary)' : 'rgba(255,255,255,0.2)'}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Comments</label>
                  <textarea
                    className="form-input"
                    placeholder="Describe your stay, details about service..."
                    rows={4}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    style={{ resize: 'none' }}
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary btn-block">Submit Review</button>
              </form>
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Please <span style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }} onClick={() => navigate('/login')}>Login</span> to submit a rating or review.
              </p>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @media (max-width: 992px) {
          .container > div {
            grid-template-columns: 1fr !important;
          }
          .glass-panel {
            position: relative !important;
            top: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default HotelDetails;
