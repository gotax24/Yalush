const Review = require("../../models/review.model");

exports.getReviews = async (request, response) => {
  try {
    const reviews = await Review.find();

    response.status(200).json(reviews);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};
