const Review = require('../models/Review');
const Hotel = require('../models/Hotel');

// @desc    Create a hotel review
// @route   POST /api/reviews/:hotelId
// @access  Private
const createReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const hotelId = req.params.hotelId;

    if (!rating || !comment) {
      res.status(400);
      throw new Error('Please provide rating and comment');
    }

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      res.status(404);
      throw new Error('Hotel not found');
    }

    // Check if user already reviewed this hotel
    const alreadyReviewed = await Review.findOne({
      user: req.user._id,
      hotel: hotelId,
    });

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('You have already reviewed this hotel');
    }

    const review = new Review({
      user: req.user._id,
      hotel: hotelId,
      rating: Number(rating),
      comment,
    });

    await review.save();

    // Recalculate rating and number of reviews for the hotel
    const reviews = await Review.find({ hotel: hotelId });
    const numReviews = reviews.length;
    const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / numReviews;

    // Standardize rating to 1 decimal place
    hotel.rating = Math.round(avgRating * 10) / 10;
    hotel.numReviews = numReviews;
    await hotel.save();

    res.status(201).json({ message: 'Review added successfully', review });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews of a hotel
// @route   GET /api/reviews/:hotelId
// @access  Public
const getHotelReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ hotel: req.params.hotelId })
      .populate('user', 'name')
      .sort('-createdAt');
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview,
  getHotelReviews,
};
