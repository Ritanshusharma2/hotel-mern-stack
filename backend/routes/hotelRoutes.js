const express = require('express');
const {
  createHotel,
  updateHotel,
  deleteHotel,
  getHotels,
  getHotelById,
  getHotelRooms,
} = require('../controllers/hotelController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getHotels)
  .post(protect, admin, createHotel);

router.route('/:id')
  .get(getHotelById)
  .put(protect, admin, updateHotel)
  .delete(protect, admin, deleteHotel);

router.get('/:id/rooms', getHotelRooms);

module.exports = router;
