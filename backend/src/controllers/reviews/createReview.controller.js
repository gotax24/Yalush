const Review = require("../../models/review.model");

exports.createReview = async (request, response) => {
  try {
    const review = await Review.create(request.body);

    response.status(201).json(review);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};
