const Review = require("../../models/review.model");

exports.updateReview = async (request, response) => {
  try {
    const review = await Review.findByIdAndUpdate(
      request.params.id,
      request.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!review)
      return response
        .status(404)
        .json({ error: "La calificacion no fue encontrada" });

    response.status(200).json(review);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};
