const express = require('express');
const {
  createRoom,
  updateRoom,
  deleteRoom,
  getRooms,
  getRoomById,
  checkRoomAvailability,
} = require('../controllers/roomController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getRooms);

router.route('/:id')
  .get(getRoomById)
  .put(protect, admin, updateRoom)
  .delete(protect, admin, deleteRoom);

router.route('/:id/availability')
  .get(checkRoomAvailability);

router.route('/hotel/:hotelId')
  .post(protect, admin, createRoom);

module.exports = router;
