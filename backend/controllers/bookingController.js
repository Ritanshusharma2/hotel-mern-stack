const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Hotel = require('../models/Hotel');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res, next) => {
  try {
    const { hotelId, roomId, checkIn, checkOut, guests, paymentDetails } = req.body;

    if (!hotelId || !roomId || !checkIn || !checkOut || !guests) {
      res.status(400);
      throw new Error('Please fill all required booking fields');
    }

    const room = await Room.findById(roomId);
    if (!room) {
      res.status(404);
      throw new Error('Room not found');
    }

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      res.status(404);
      throw new Error('Hotel not found');
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      res.status(400);
      throw new Error('Invalid check-in or check-out date');
    }

    if (checkInDate >= checkOutDate) {
      res.status(400);
      throw new Error('Check-out date must be after check-in date');
    }

    // Check availability
    const overlappingBookings = await Booking.find({
      room: room._id,
      status: { $ne: 'Cancelled' },
      checkIn: { $lt: checkOutDate },
      checkOut: { $gt: checkInDate },
    });

    if (overlappingBookings.length >= room.quantity) {
      res.status(400);
      throw new Error('This room is no longer available for the selected dates');
    }

    // Calculate pricing
    const diffTime = Math.abs(checkOutDate - checkInDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const totalPrice = room.price * diffDays;

    const booking = new Booking({
      user: req.user._id,
      hotel: hotelId,
      room: roomId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      totalPrice,
      paymentStatus: paymentDetails ? 'Paid' : 'Pending',
      status: 'Confirmed', // Automatically confirm on simulated successful payment
      paymentDetails: paymentDetails || {},
    });

    const createdBooking = await booking.save();
    res.status(201).json(createdBooking);
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user bookings
// @route   GET /api/bookings/mybookings
// @access  Private
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('hotel', 'name city images address')
      .populate('room', 'title price')
      .sort('-createdAt');
    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('hotel', 'name city images address distance description')
      .populate('room', 'title price description amenities');

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    // Check if the user is owner or admin
    if (booking.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      res.status(403);
      throw new Error('Not authorized to view this booking');
    }

    res.json(booking);
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    // Check if user is owner or admin
    if (booking.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      res.status(403);
      throw new Error('Not authorized to cancel this booking');
    }

    if (booking.status === 'Cancelled') {
      res.status(400);
      throw new Error('Booking is already cancelled');
    }

    booking.status = 'Cancelled';
    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({})
      .populate('user', 'name email')
      .populate('hotel', 'name city')
      .populate('room', 'title price')
      .sort('-createdAt');
    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status (Admin only)
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status, paymentStatus } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (booking) {
      booking.status = status || booking.status;
      booking.paymentStatus = paymentStatus || booking.paymentStatus;

      const updatedBooking = await booking.save();
      res.json(updatedBooking);
    } else {
      res.status(404);
      throw new Error('Booking not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
};
