import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import RatingStars from '../components/RatingStars';
import { Search, Calendar, Users, MapPin, Compass, Building, Flame, Trees, Castle } from 'lucide-react';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');
  const [featuredHotels, setFeaturedHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Load featured hotels on mount
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await axios.get('/api/hotels?featured=true');
        setFeaturedHotels(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching featured hotels:', error);
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    let queryParams = [];
    if (searchQuery) queryParams.push(`search=${encodeURIComponent(searchQuery)}`);
    if (checkIn) queryParams.push(`checkIn=${checkIn}`);
    if (checkOut) queryParams.push(`checkOut=${checkOut}`);
    if (guests) queryParams.push(`guests=${guests}`);

    const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
    navigate(`/search${queryString}`);
  };

  const handleTypeClick = (type) => {
    navigate(`/search?type=${type}`);
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
      {/* Hero Banner */}
      <section style={{
        position: 'relative',
        height: '75vh',
        minHeight: '500px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'linear-gradient(rgba(9, 10, 15, 0.4), rgba(9, 10, 15, 0.85)), url("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1800&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '0 0 40px 40px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
      }}>
        <div className="container" style={{ textAlign: 'center', zIndex: 1 }}>
          <span className="badge badge-primary" style={{ marginBottom: '1rem', fontSize: '0.8rem', padding: '0.4rem 1rem' }}>
            The Ultimate Hotel Experience
          </span>
          <h1 style={{
            fontSize: 'calc(2.2rem + 2vw)',
            fontWeight: '700',
            lineHeight: '1.2',
            marginBottom: '1.5rem',
            color: '#fff',
          }}>
            Discover Your Perfect Gateway Destination
          </h1>
          <p style={{
            color: 'var(--text-muted)',
            fontSize: '1.1rem',
            maxWidth: '650px',
            margin: '0 auto 3rem auto',
            lineHeight: '1.8',
          }}>
            Unlock private, curated villas and luxury hotel rooms around the globe. Legendary service combined with breathtaking views.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="glass-panel" style={{
            maxWidth: '900px',
            margin: '0 auto',
            padding: '1.25rem',
            borderRadius: '20px',
            display: 'grid',
            gridTemplateColumns: '2fr 1.5fr 1.5fr 1fr 1fr',
            gap: '1rem',
            alignItems: 'end',
            textAlign: 'left',
          }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Where to?</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Paris, Tokyo, Cabin..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: '2.25rem', height: '42px', fontSize: '0.9rem' }}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Check-in</label>
              <div style={{ position: 'relative' }}>
                <Calendar size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                <input
                  type="date"
                  className="form-input"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  style={{ paddingLeft: '2.25rem', height: '42px', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Check-out</label>
              <div style={{ position: 'relative' }}>
                <Calendar size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                <input
                  type="date"
                  className="form-input"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn || new Date().toISOString().split('T')[0]}
                  style={{ paddingLeft: '2.25rem', height: '42px', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Guests</label>
              <div style={{ position: 'relative' }}>
                <Users size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                <select
                  className="form-input"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  style={{ paddingLeft: '2.25rem', height: '42px', fontSize: '0.9rem', appearance: 'none', background: 'rgba(18, 22, 33, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', cursor: 'pointer' }}
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                  <option value="5">5+ Guests</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ height: '42px', padding: 0 }}>
              <Search size={16} />
              <span>Search</span>
            </button>
          </form>
        </div>
      </section>

      {/* Property Types */}
      <section className="container" style={{ marginTop: '5rem' }}>
        <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '2.5rem' }}>Browse by Property Type</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
        }}>
          {[
            { id: 'hotel', label: 'Luxury Hotels', icon: <Building size={24} /> },
            { id: 'resort', label: 'Private Resorts', icon: <Castle size={24} /> },
            { id: 'cabin', label: 'Alpine Cabins', icon: <Trees size={24} /> },
            { id: 'villa', label: 'Exclusive Villas', icon: <Flame size={24} /> },
          ].map((type) => (
            <div
              key={type.id}
              onClick={() => handleTypeClick(type.id)}
              className="glass-panel flex-center"
              style={{
                flexDirection: 'column',
                gap: '1rem',
                padding: '2.5rem 1.5rem',
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              <div style={{
                color: 'var(--primary)',
                background: 'rgba(212, 175, 55, 0.1)',
                padding: '1rem',
                borderRadius: '50%',
                display: 'inline-flex',
              }}>
                {type.icon}
              </div>
              <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-sans)', color: '#fff' }}>{type.label}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Properties */}
      <section className="container" style={{ marginTop: '5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
          <div>
            <h2 style={{ fontSize: '2.2rem' }}>Featured Sanctuaries</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Handpicked accommodations providing legendary service</p>
          </div>
          <button onClick={() => navigate('/search')} className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center' }}>
            <Compass size={16} />
            View All
          </button>
        </div>

        {loading ? (
          <div className="flex-center" style={{ minHeight: '30vh' }}>
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="grid-cols-3">
            {featuredHotels.map((hotel) => (
              <div key={hotel._id} className="glass-panel" style={{
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}>
                <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                  <img
                    src={hotel.images[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80'}
                    alt={hotel.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'var(--transition)' }}
                    className="hotel-card-image"
                  />
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    zIndex: 1,
                  }}>
                    <span className="badge badge-primary">
                      {hotel.city}
                    </span>
                  </div>
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    zIndex: 1,
                  }}>
                    <span className="badge badge-success" style={{ textTransform: 'capitalize' }}>
                      {hotel.type}
                    </span>
                  </div>
                </div>

                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', fontFamily: 'var(--font-serif)' }}>{hotel.name}</h3>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <RatingStars rating={hotel.rating} count={hotel.numReviews} />
                  </div>
                  <p style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.9rem',
                    lineHeight: '1.6',
                    marginBottom: '1.5rem',
                    flex: 1,
                  }}>
                    {hotel.description.length > 120 ? `${hotel.description.substring(0, 120)}...` : hotel.description}
                  </p>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    paddingTop: '1rem',
                  }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>From</span>
                      <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>
                        ${hotel.rooms && hotel.rooms.length > 0 ? Math.min(...hotel.rooms.map(r => r.price)) : 190}
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 400 }}> / night</span>
                      </span>
                    </div>

                    <button onClick={() => navigate(`/hotel/${hotel._id}`)} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Styled inline component transitions */}
      <style>{`
        .hotel-card-image:hover {
          transform: scale(1.05);
        }
        form select {
          -webkit-appearance: none;
          -moz-appearance: none;
          background-image: url('data:image/svg+xml;utf8,<svg fill="%23d4af37" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>');
          background-repeat: no-repeat;
          background-position: right 10px center;
        }
        @media (max-width: 768px) {
          form {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
