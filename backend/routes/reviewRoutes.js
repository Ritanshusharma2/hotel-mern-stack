const express = require('express');
const { createReview, getHotelReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/:hotelId')
  .get(getHotelReviews)
  .post(protect, createReview);

module.exports = router;
