import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import RatingStars from '../components/RatingStars';
import { Search, MapPin, SlidersHorizontal, ArrowUpDown, Calendar, ArrowRight } from 'lucide-react';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Parse initial query params
  const getQueryParams = () => {
    const params = new URLSearchParams(location.search);
    return {
      search: params.get('search') || '',
      checkIn: params.get('checkIn') || '',
      checkOut: params.get('checkOut') || '',
      guests: params.get('guests') || '2',
      type: params.get('type') || '',
    };
  };

  const initialParams = getQueryParams();

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [cityFilter, setCityFilter] = useState(initialParams.search);
  const [typeFilter, setTypeFilter] = useState(initialParams.type);
  const [priceMax, setPriceMax] = useState(1000);
  const [sortBy, setSortBy] = useState('rating-desc');

  // Search info (passed to bookings later)
  const [checkIn, setCheckIn] = useState(initialParams.checkIn);
  const [checkOut, setCheckOut] = useState(initialParams.checkOut);
  const [guests, setGuests] = useState(initialParams.guests);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        // Build API URL
        let url = `/api/hotels?`;
        if (cityFilter) url += `search=${encodeURIComponent(cityFilter)}&`;
        if (typeFilter) url += `type=${typeFilter}&`;

        const { data } = await axios.get(url);
        setHotels(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setLoading(false);
      }
    };

    fetchHotels();
  }, [cityFilter, typeFilter]);

  // Handle local parameter synchronization when URL changes
  useEffect(() => {
    const params = getQueryParams();
    setCityFilter(params.search);
    setTypeFilter(params.type);
    setCheckIn(params.checkIn);
    setCheckOut(params.checkOut);
    setGuests(params.guests);
  }, [location.search]);

  // Apply frontend price filters and sorting
  const getProcessedHotels = () => {
    let result = [...hotels];

    // Filter by price max
    result = result.filter(hotel => {
      const minPrice = hotel.rooms && hotel.rooms.length > 0
        ? Math.min(...hotel.rooms.map(r => r.price))
        : 190;
      return minPrice <= priceMax;
    });

    // Sort
    if (sortBy === 'price-asc') {
      result.sort((a, b) => {
        const priceA = a.rooms && a.rooms.length > 0 ? Math.min(...a.rooms.map(r => r.price)) : 190;
        const priceB = b.rooms && b.rooms.length > 0 ? Math.min(...b.rooms.map(r => r.price)) : 190;
        return priceA - priceB;
      });
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => {
        const priceA = a.rooms && a.rooms.length > 0 ? Math.min(...a.rooms.map(r => r.price)) : 190;
        const priceB = b.rooms && b.rooms.length > 0 ? Math.min(...b.rooms.map(r => r.price)) : 190;
        return priceB - priceA;
      });
    } else if (sortBy === 'rating-desc') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  };

  const processedHotels = getProcessedHotels();

  // Navigate to hotel details page, preserving checkIn/checkOut/guests
  const handleHotelClick = (hotelId) => {
    let query = '';
    const params = [];
    if (checkIn) params.push(`checkIn=${checkIn}`);
    if (checkOut) params.push(`checkOut=${checkOut}`);
    if (guests) params.push(`guests=${guests}`);
    if (params.length > 0) query = `?${params.join('&')}`;

    navigate(`/hotel/${hotelId}${query}`);
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem' }}>
      <h2 style={{ fontSize: '2.2rem', marginBottom: '2rem', fontFamily: 'var(--font-serif)' }}>
        Discover Exceptional Stays
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '300px 1fr',
        gap: '2.5rem',
        alignItems: 'start',
      }}>
        {/* Sidebar Filters */}
        <aside className="glass-panel" style={{ padding: '2rem', position: 'sticky', top: '90px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem' }}>
            <SlidersHorizontal size={18} style={{ color: 'var(--primary)' }} />
            <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-sans)' }}>Filters</h3>
          </div>

          {/* Search Destination */}
          <div className="form-group">
            <label className="form-label">Destination</label>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-input"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                style={{ paddingLeft: '2.25rem' }}
                placeholder="Search city, name..."
              />
            </div>
          </div>

          {/* Property Type */}
          <div className="form-group">
            <label className="form-label">Property Type</label>
            <select
              className="form-input"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              style={{ cursor: 'pointer' }}
            >
              <option value="">All Types</option>
              <option value="hotel">Hotels</option>
              <option value="resort">Resorts</option>
              <option value="cabin">Cabins</option>
              <option value="villa">Villas</option>
            </select>
          </div>

          {/* Max Price Slider */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label className="form-label">Max Price</label>
              <span style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: '600' }}>${priceMax} / night</span>
            </div>
            <input
              type="range"
              min="100"
              max="1500"
              step="50"
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.1)',
                height: '4px',
                borderRadius: '2px',
                outline: 'none',
                accentColor: 'var(--primary)',
                cursor: 'pointer',
              }}
            />
          </div>

          {/* Dates & Guests Synchronization */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
            <h4 style={{ fontSize: '1rem', color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Calendar size={15} style={{ color: 'var(--primary)' }} />
              Stay Details
            </h4>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Check-in</label>
              <input
                type="date"
                className="form-input"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Check-out</label>
              <input
                type="date"
                className="form-input"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                min={checkIn || new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="form-group">
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
          </div>
        </aside>

        {/* Results List */}
        <div>
          {/* List Headers */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
          }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              We found <span style={{ color: '#fff', fontWeight: 600 }}>{processedHotels.length}</span> matching properties
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ArrowUpDown size={15} style={{ color: 'var(--primary)' }} />
              <select
                className="form-input"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ width: '180px', height: '36px', padding: '0 0.5rem', fontSize: '0.85rem' }}
              >
                <option value="rating-desc">Rating: High to Low</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Results Grid */}
          {loading ? (
            <div className="flex-center" style={{ minHeight: '40vh' }}>
              <div className="spinner"></div>
            </div>
          ) : processedHotels.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No Properties Found</h3>
              <p style={{ color: 'var(--text-muted)' }}>Try adjusting your filters or destination keywords.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {processedHotels.map((hotel) => {
                const minPrice = hotel.rooms && hotel.rooms.length > 0
                  ? Math.min(...hotel.rooms.map(r => r.price))
                  : 190;

                return (
                  <div
                    key={hotel._id}
                    className="glass-panel"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '260px 1fr',
                      overflow: 'hidden',
                    }}
                  >
                    <div style={{ position: 'relative', height: '100%', minHeight: '200px' }}>
                      <img
                        src={hotel.images[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80'}
                        alt={hotel.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <span className="badge badge-primary" style={{ position: 'absolute', top: '12px', left: '12px' }}>
                        {hotel.city}
                      </span>
                    </div>

                    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.25rem' }}>
                          <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif)' }}>{hotel.name}</h3>
                          <span className="badge badge-success" style={{ textTransform: 'capitalize' }}>{hotel.type}</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          <MapPin size={14} style={{ color: 'var(--primary)' }} />
                          <span>{hotel.address} &middot; {hotel.distance}</span>
                        </div>

                        <RatingStars rating={hotel.rating} count={hotel.numReviews} />

                        <p style={{
                          color: 'var(--text-muted)',
                          fontSize: '0.9rem',
                          marginTop: '0.75rem',
                          lineHeight: '1.5',
                        }}>
                          {hotel.description.length > 180 ? `${hotel.description.substring(0, 180)}...` : hotel.description}
                        </p>
                      </div>

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderTop: '1px solid rgba(255,255,255,0.06)',
                        paddingTop: '1rem',
                        marginTop: '1rem',
                      }}>
                        <div>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Rates From</span>
                          <span style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary)' }}>
                            ${minPrice}
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 400 }}> / night</span>
                          </span>
                        </div>

                        <button
                          onClick={() => handleHotelClick(hotel._id)}
                          className="btn btn-primary"
                          style={{ gap: '0.5rem' }}
                        >
                          <span>Select Suites</span>
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <style>{`
        @media (max-width: 992px) {
          .container > div {
            grid-template-columns: 1fr !important;
          }
          aside {
            position: relative !important;
            top: 0 !important;
            margin-bottom: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default SearchResults;
