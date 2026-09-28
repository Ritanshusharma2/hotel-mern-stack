const Hotel = require('../models/Hotel');
const Room = require('../models/Room');

// @desc    Create a hotel
// @route   POST /api/hotels
// @access  Private/Admin
const createHotel = async (req, res, next) => {
  try {
    const { name, type, city, address, distance, images, description, featured } = req.body;

    const hotel = new Hotel({
      name,
      type,
      city,
      address,
      distance,
      images,
      description,
      featured,
    });

    const createdHotel = await hotel.save();
    res.status(201).json(createdHotel);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a hotel
// @route   PUT /api/hotels/:id
// @access  Private/Admin
const updateHotel = async (req, res, next) => {
  try {
    const { name, type, city, address, distance, images, description, featured } = req.body;

    const hotel = await Hotel.findById(req.params.id);

    if (hotel) {
      hotel.name = name || hotel.name;
      hotel.type = type || hotel.type;
      hotel.city = city || hotel.city;
      hotel.address = address || hotel.address;
      hotel.distance = distance || hotel.distance;
      hotel.images = images || hotel.images;
      hotel.description = description || hotel.description;
      hotel.featured = featured !== undefined ? featured : hotel.featured;

      const updatedHotel = await hotel.save();
      res.json(updatedHotel);
    } else {
      res.status(404);
      throw new Error('Hotel not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a hotel
// @route   DELETE /api/hotels/:id
// @access  Private/Admin
const deleteHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (hotel) {
      // Also delete all rooms linked to this hotel
      await Room.deleteMany({ hotel: hotel._id });
      await Hotel.findByIdAndDelete(req.params.id);
      res.json({ message: 'Hotel and associated rooms deleted successfully' });
    } else {
      res.status(404);
      throw new Error('Hotel not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all hotels (with search, filter, count)
// @route   GET /api/hotels
// @access  Public
const getHotels = async (req, res, next) => {
  try {
    const { featured, city, limit, search, type } = req.query;

    const query = {};

    if (featured !== undefined) {
      query.featured = featured === 'true';
    }

    if (type) {
      query.type = type;
    }

    if (city) {
      query.city = { $regex: new RegExp(city, 'i') };
    }

    if (search) {
      query.$or = [
        { name: { $regex: new RegExp(search, 'i') } },
        { city: { $regex: new RegExp(search, 'i') } },
        { description: { $regex: new RegExp(search, 'i') } },
      ];
    }

    let hotelsQuery = Hotel.find(query).populate('rooms');

    if (limit) {
      hotelsQuery = hotelsQuery.limit(parseInt(limit));
    }

    const hotels = await hotelsQuery;
    res.json(hotels);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single hotel by ID
// @route   GET /api/hotels/:id
// @access  Public
const getHotelById = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id).populate('rooms');

    if (hotel) {
      res.json(hotel);
    } else {
      res.status(404);
      throw new Error('Hotel not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get rooms of a hotel
// @route   GET /api/hotels/:id/rooms
// @access  Public
const getHotelRooms = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      res.status(404);
      throw new Error('Hotel not found');
    }

    const rooms = await Room.find({ hotel: req.params.id });
    res.json(rooms);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createHotel,
  updateHotel,
  deleteHotel,
  getHotels,
  getHotelById,
  getHotelRooms,
};
