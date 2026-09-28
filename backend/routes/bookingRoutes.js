const express = require('express');
const {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
} = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, createBooking)
  .get(protect, admin, getAllBookings);

router.get('/mybookings', protect, getMyBookings);

router.route('/:id')
  .get(protect, getBookingById);

router.put('/:id/cancel', protect, cancelBooking);

router.put('/:id/status', protect, admin, updateBookingStatus);

module.exports = router;
