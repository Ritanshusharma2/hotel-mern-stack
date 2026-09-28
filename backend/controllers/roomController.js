const Room = require('../models/Room');
const Hotel = require('../models/Hotel');
const Booking = require('../models/Booking');

// @desc    Create a room type for a hotel
// @route   POST /api/rooms/:hotelId
// @access  Private/Admin
const createRoom = async (req, res, next) => {
  try {
    const hotelId = req.params.hotelId;
    const { title, price, maxPeople, description, quantity, images, amenities } = req.body;

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      res.status(404);
      throw new Error('Hotel not found');
    }

    const room = new Room({
      hotel: hotelId,
      title,
      price,
      maxPeople,
      description,
      quantity,
      images,
      amenities,
    });

    const createdRoom = await room.save();

    // Push room to hotel's room list
    hotel.rooms.push(createdRoom._id);
    await hotel.save();

    res.status(201).json(createdRoom);
  } catch (error) {
    next(error);
  }
};

// @desc    Update room details
// @route   PUT /api/rooms/:id
// @access  Private/Admin
const updateRoom = async (req, res, next) => {
  try {
    const { title, price, maxPeople, description, quantity, images, amenities } = req.body;

    const room = await Room.findById(req.params.id);

    if (room) {
      room.title = title || room.title;
      room.price = price !== undefined ? price : room.price;
      room.maxPeople = maxPeople !== undefined ? maxPeople : room.maxPeople;
      room.description = description || room.description;
      room.quantity = quantity !== undefined ? quantity : room.quantity;
      room.images = images || room.images;
      room.amenities = amenities || room.amenities;

      const updatedRoom = await room.save();
      res.json(updatedRoom);
    } else {
      res.status(404);
      throw new Error('Room not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a room
// @route   DELETE /api/rooms/:id
// @access  Private/Admin
const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);

    if (room) {
      // Find the associated hotel and pull this room from its rooms array
      await Hotel.findByIdAndUpdate(room.hotel, {
        $pull: { rooms: room._id },
      });

      // Delete all bookings associated with this room
      await Booking.deleteMany({ room: room._id });

      // Delete room
      await Room.findByIdAndDelete(req.params.id);

      res.json({ message: 'Room and associated bookings deleted successfully' });
    } else {
      res.status(404);
      throw new Error('Room not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Public
const getRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find({}).populate('hotel', 'name city');
    res.json(rooms);
  } catch (error) {
    next(error);
  }
};

// @desc    Get room by ID
// @route   GET /api/rooms/:id
// @access  Public
const getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id).populate('hotel', 'name city');
    if (room) {
      res.json(room);
    } else {
      res.status(404);
      throw new Error('Room not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Check room availability for checkIn/checkOut dates
// @route   GET /api/rooms/:id/availability
// @access  Public
const checkRoomAvailability = async (req, res, next) => {
  try {
    const { checkIn, checkOut } = req.query;
    if (!checkIn || !checkOut) {
      res.status(400);
      throw new Error('Please provide both checkIn and checkOut dates');
    }

    const room = await Room.findById(req.params.id);
    if (!room) {
      res.status(404);
      throw new Error('Room not found');
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate) || isNaN(checkOutDate)) {
      res.status(400);
      throw new Error('Invalid date formats');
    }

    if (checkInDate >= checkOutDate) {
      res.status(400);
      throw new Error('Check-out date must be after Check-in date');
    }

    // Find bookings that overlap with requested range and are active
    const overlappingBookings = await Booking.find({
      room: room._id,
      status: { $ne: 'Cancelled' },
      checkIn: { $lt: checkOutDate },
      checkOut: { $gt: checkInDate },
    });

    const availableQuantity = room.quantity - overlappingBookings.length;
    const isAvailable = availableQuantity > 0;

    res.json({
      roomId: room._id,
      title: room.title,
      totalQuantity: room.quantity,
      activeBookings: overlappingBookings.length,
      availableQuantity,
      isAvailable,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRoom,
  updateRoom,
  deleteRoom,
  getRooms,
  getRoomById,
  checkRoomAvailability,
};
