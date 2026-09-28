import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Building, ShieldAlert, Plus, Trash2, Key, Users, Landmark, FileText, Check, X } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  
  // Data States
  const [bookings, setBookings] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Forms Visibility States
  const [showHotelForm, setShowHotelForm] = useState(false);
  const [showRoomForm, setShowRoomForm] = useState(false);

  // New Hotel Form State
  const [hotelName, setHotelName] = useState('');
  const [hotelType, setHotelType] = useState('hotel');
  const [hotelCity, setHotelCity] = useState('');
  const [hotelAddress, setHotelAddress] = useState('');
  const [hotelDistance, setHotelDistance] = useState('');
  const [hotelDesc, setHotelDesc] = useState('');
  const [hotelImages, setHotelImages] = useState('');
  const [hotelFeatured, setHotelFeatured] = useState(false);

  // New Room Form State
  const [roomHotelId, setRoomHotelId] = useState('');
  const [roomTitle, setRoomTitle] = useState('');
  const [roomPrice, setRoomPrice] = useState('');
  const [roomMaxPeople, setRoomMaxPeople] = useState('2');
  const [roomQuantity, setRoomQuantity] = useState('1');
  const [roomDesc, setRoomDesc] = useState('');
  const [roomAmenities, setRoomAmenities] = useState('');
  const [roomImages, setRoomImages] = useState('');

  // Status logs
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const displaySuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const displayError = (msg) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(''), 4000);
  };

  // Fetch Operations
  const fetchAllBookings = async () => {
    try {
      const { data } = await axios.get('/api/bookings');
      setBookings(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAllHotels = async () => {
    try {
      const { data } = await axios.get('/api/hotels');
      setHotels(data);
      if (data.length > 0 && !roomHotelId) {
        setRoomHotelId(data[0]._id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAllRooms = async () => {
    try {
      const { data } = await axios.get('/api/rooms');
      setRooms(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadData = async () => {
    setLoading(true);
    await Promise.all([fetchAllBookings(), fetchAllHotels(), fetchAllRooms()]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handlers
  const handleCancelBooking = async (id) => {
    if (!window.confirm('Cancel this customer booking?')) return;
    try {
      await axios.put(`/api/bookings/${id}/cancel`);
      displaySuccess('Booking cancelled successfully.');
      fetchAllBookings();
    } catch (err) {
      displayError(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const handleDeleteHotel = async (id) => {
    if (!window.confirm('Delete this hotel and all associated rooms?')) return;
    try {
      await axios.delete(`/api/hotels/${id}`);
      displaySuccess('Hotel and its rooms deleted successfully.');
      loadData(); // Reload all as rooms will be affected
    } catch (err) {
      displayError(err.response?.data?.message || 'Failed to delete hotel');
    }
  };

  const handleDeleteRoom = async (id) => {
    if (!window.confirm('Delete this room option?')) return;
    try {
      await axios.delete(`/api/rooms/${id}`);
      displaySuccess('Room deleted successfully.');
      loadData();
    } catch (err) {
      displayError(err.response?.data?.message || 'Failed to delete room');
    }
  };

  const handleCreateHotel = async (e) => {
    e.preventDefault();
    if (!hotelName || !hotelCity || !hotelAddress || !hotelDistance || !hotelDesc) {
      displayError('Please fill in all required hotel fields.');
      return;
    }

    const imagesArray = hotelImages
      ? hotelImages.split(';').map(img => img.trim()).filter(Boolean)
      : ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'];

    try {
      await axios.post('/api/hotels', {
        name: hotelName,
        type: hotelType,
        city: hotelCity,
        address: hotelAddress,
        distance: hotelDistance,
        description: hotelDesc,
        images: imagesArray,
        featured: hotelFeatured,
      });

      displaySuccess('New hotel sanctuary created successfully!');
      // Clear Form
      setHotelName('');
      setHotelCity('');
      setHotelAddress('');
      setHotelDistance('');
      setHotelDesc('');
      setHotelImages('');
      setHotelFeatured(false);
      setShowHotelForm(false);

      loadData();
    } catch (err) {
      displayError(err.response?.data?.message || 'Failed to create hotel');
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!roomHotelId || !roomTitle || !roomPrice || !roomDesc) {
      displayError('Please fill in all required room fields.');
      return;
    }

    const amenitiesArray = roomAmenities
      ? roomAmenities.split(',').map(a => a.trim()).filter(Boolean)
      : ['Free Wi-Fi', 'Air Conditioning'];

    const imagesArray = roomImages
      ? roomImages.split(';').map(img => img.trim()).filter(Boolean)
      : ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'];

    try {
      await axios.post(`/api/rooms/hotel/${roomHotelId}`, {
        title: roomTitle,
        price: Number(roomPrice),
        maxPeople: Number(roomMaxPeople),
        quantity: Number(roomQuantity),
        description: roomDesc,
        amenities: amenitiesArray,
        images: imagesArray,
      });

      displaySuccess('New room option added successfully!');
      // Clear Form
      setRoomTitle('');
      setRoomPrice('');
      setRoomMaxPeople('2');
      setRoomQuantity('1');
      setRoomDesc('');
      setRoomAmenities('');
      setRoomImages('');
      setShowRoomForm(false);

      loadData();
    } catch (err) {
      displayError(err.response?.data?.message || 'Failed to create room');
    }
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
      
      {/* Admin Title Banner */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
        <ShieldAlert size={32} style={{ color: 'var(--primary)' }} />
        <div>
          <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-sans)', color: '#fff' }}>Control Panel</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Sanctuary administrative logs and inventory editors</p>
        </div>
      </div>

      {/* Action alerts */}
      {successMsg && (
        <div className="badge badge-success" style={{ padding: '0.75rem 1rem', width: '100%', marginBottom: '1.5rem', justifyContent: 'center' }}>
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="badge badge-danger" style={{ padding: '0.75rem 1rem', width: '100%', marginBottom: '1.5rem', justifyContent: 'center' }}>
          {errorMsg}
        </div>
      )}

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`btn ${activeTab === 'bookings' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '0.5rem 1.5rem' }}
        >
          <Calendar size={16} />
          <span>All Bookings ({bookings.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('hotels')}
          className={`btn ${activeTab === 'hotels' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '0.5rem 1.5rem' }}
        >
          <Building size={16} />
          <span>Hotels ({hotels.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('rooms')}
          className={`btn ${activeTab === 'rooms' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '0.5rem 1.5rem' }}
        >
          <Key size={16} />
          <span>Rooms ({rooms.length})</span>
        </button>
      </div>

      {/* TAB CONTENT 1: BOOKINGS LIST */}
      {activeTab === 'bookings' && (
        <div className="glass-panel" style={{ padding: '2rem', overflowX: 'auto' }}>
          <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '1.5rem' }}>Customer Reservations</h3>
          
          {bookings.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No bookings currently in the database.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <th style={{ padding: '0.75rem' }}>Client</th>
                  <th style={{ padding: '0.75rem' }}>Hotel Sanctuary</th>
                  <th style={{ padding: '0.75rem' }}>Room Suite</th>
                  <th style={{ padding: '0.75rem' }}>Check-In / Out</th>
                  <th style={{ padding: '0.75rem' }}>Price Paid</th>
                  <th style={{ padding: '0.75rem' }}>Status</th>
                  <th style={{ padding: '0.75rem', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.9rem' }}>
                    <td style={{ padding: '1rem 0.75rem' }}>
                      <span style={{ color: '#fff', fontWeight: 600, display: 'block' }}>{booking.user?.name || 'Deleted User'}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{booking.user?.email || 'N/A'}</span>
                    </td>
                    <td style={{ padding: '1rem 0.75rem', color: '#fff' }}>{booking.hotel?.name || 'Deleted Hotel'}</td>
                    <td style={{ padding: '1rem 0.75rem', color: 'var(--text-muted)' }}>{booking.room?.title || 'Deleted Room'}</td>
                    <td style={{ padding: '1rem 0.75rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {new Date(booking.checkIn).toLocaleDateString()} &rarr; {new Date(booking.checkOut).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem 0.75rem', color: 'var(--primary)', fontWeight: 600 }}>${booking.totalPrice}</td>
                    <td style={{ padding: '1rem 0.75rem' }}>
                      {booking.status === 'Confirmed' ? (
                        <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>Confirmed</span>
                      ) : (
                        <span className="badge badge-danger" style={{ fontSize: '0.7rem' }}>Cancelled</span>
                      )}
                    </td>
                    <td style={{ padding: '1rem 0.75rem', textAlign: 'center' }}>
                      {booking.status === 'Confirmed' && (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          className="btn btn-danger"
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem' }}
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* TAB CONTENT 2: HOTELS LIST & CREATE FORM */}
      {activeTab === 'hotels' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.4rem', color: '#fff' }}>Manage Hotel Inventory</h3>
            <button
              onClick={() => setShowHotelForm(!showHotelForm)}
              className="btn btn-primary"
              style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}
            >
              {showHotelForm ? <X size={14} /> : <Plus size={14} />}
              <span>{showHotelForm ? 'Cancel' : 'Create Hotel'}</span>
            </button>
          </div>

          {/* Create Hotel Form */}
          {showHotelForm && (
            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
              <h4 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', color: '#fff' }}>New Hotel Sanctuary</h4>
              <form onSubmit={handleCreateHotel}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={hotelName}
                      onChange={(e) => setHotelName(e.target.value)}
                      placeholder="e.g. The Venice Palace"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Type *</label>
                    <select
                      className="form-input"
                      value={hotelType}
                      onChange={(e) => setHotelType(e.target.value)}
                      style={{ cursor: 'pointer' }}
                    >
                      <option value="hotel">Hotel</option>
                      <option value="resort">Resort</option>
                      <option value="cabin">Cabin</option>
                      <option value="villa">Villa</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Address *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={hotelAddress}
                      onChange={(e) => setHotelAddress(e.target.value)}
                      placeholder="e.g. Piazza San Marco, Venice"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={hotelCity}
                      onChange={(e) => setHotelCity(e.target.value)}
                      placeholder="e.g. Venice"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Distance from center *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={hotelDistance}
                      onChange={(e) => setHotelDistance(e.target.value)}
                      placeholder="e.g. 200m from center"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description *</label>
                  <textarea
                    className="form-input"
                    rows={4}
                    value={hotelDesc}
                    onChange={(e) => setHotelDesc(e.target.value)}
                    placeholder="Provide a luxurious description detail..."
                    style={{ resize: 'none' }}
                  ></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">Image URLs (Semicolon ';' separated)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={hotelImages}
                    onChange={(e) => setHotelImages(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-1; https://images.unsplash.com/photo-2"
                  />
                </div>

                <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  <input
                    type="checkbox"
                    id="featured"
                    checked={hotelFeatured}
                    onChange={(e) => setHotelFeatured(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                  />
                  <label htmlFor="featured" className="form-label" style={{ marginBottom: 0, cursor: 'pointer' }}>
                    Feature this hotel on home page
                  </label>
                </div>

                <button type="submit" className="btn btn-primary">Create Hotel</button>
              </form>
            </div>
          )}

          {/* Hotel list display */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            {hotels.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No hotels currently stored in database.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {hotels.map((hotel) => (
                  <div key={hotel._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <img
                        src={hotel.images[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=150&q=80'}
                        alt={hotel.name}
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                      <div>
                        <h4 style={{ color: '#fff', fontSize: '1.1rem' }}>{hotel.name}</h4>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {hotel.city} &middot; {hotel.address} &middot; {hotel.rooms?.length || 0} Room Options
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteHotel(hotel._id)}
                      className="btn btn-danger"
                      style={{ padding: '0.4rem', borderRadius: '4px' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: ROOMS LIST & CREATE FORM */}
      {activeTab === 'rooms' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.4rem', color: '#fff' }}>Manage Room Options</h3>
            <button
              onClick={() => setShowRoomForm(!showRoomForm)}
              className="btn btn-primary"
              style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}
              disabled={hotels.length === 0}
            >
              {showRoomForm ? <X size={14} /> : <Plus size={14} />}
              <span>{showRoomForm ? 'Cancel' : 'Create Room Option'}</span>
            </button>
          </div>

          {/* Create Room Form */}
          {showRoomForm && (
            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
              <h4 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', color: '#fff' }}>Add Room Type Option</h4>
              <form onSubmit={handleCreateRoom}>
                <div className="form-group">
                  <label className="form-label">Link to Hotel Sanctuary *</label>
                  <select
                    className="form-input"
                    value={roomHotelId}
                    onChange={(e) => setRoomHotelId(e.target.value)}
                  >
                    {hotels.map(h => (
                      <option key={h._id} value={h._id}>{h.name} ({h.city})</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Room Title *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={roomTitle}
                      onChange={(e) => setRoomTitle(e.target.value)}
                      placeholder="e.g. Deluxe Garden Suite"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Price per night ($) *</label>
                    <input
                      type="number"
                      className="form-input"
                      value={roomPrice}
                      onChange={(e) => setRoomPrice(e.target.value)}
                      placeholder="e.g. 290"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Max Occupants *</label>
                    <input
                      type="number"
                      className="form-input"
                      value={roomMaxPeople}
                      onChange={(e) => setRoomMaxPeople(e.target.value)}
                      min="1"
                      max="10"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Quantity Inventory *</label>
                    <input
                      type="number"
                      className="form-input"
                      value={roomQuantity}
                      onChange={(e) => setRoomQuantity(e.target.value)}
                      min="1"
                      max="100"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Room Description *</label>
                  <textarea
                    className="form-input"
                    rows={3}
                    value={roomDesc}
                    onChange={(e) => setRoomDesc(e.target.value)}
                    placeholder="Amenities details, bedding types, views..."
                    style={{ resize: 'none' }}
                  ></textarea>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Amenities (Comma ',' separated)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={roomAmenities}
                      onChange={(e) => setRoomAmenities(e.target.value)}
                      placeholder="Free Wi-Fi, Air Conditioning, Balcony, Coffee"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Image URLs (Semicolon ';' separated)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={roomImages}
                      onChange={(e) => setRoomImages(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-1"
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Create Room</button>
              </form>
            </div>
          )}

          {/* Room List Display */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            {rooms.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No room types currently defined.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {rooms.map((room) => (
                  <div key={room._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <img
                        src={room.images[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=150&q=80'}
                        alt={room.title}
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                      <div>
                        <h4 style={{ color: '#fff', fontSize: '1.1rem' }}>{room.title}</h4>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Sanctuary: <strong style={{ color: '#fff' }}>{room.hotel?.name || 'Unknown'}</strong> &middot; Price: <strong style={{ color: 'var(--primary)' }}>${room.price}</strong> &middot; Inventory Quantity: <strong style={{ color: '#fff' }}>{room.quantity}</strong>
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteRoom(room._id)}
                      className="btn btn-danger"
                      style={{ padding: '0.4rem', borderRadius: '4px' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
