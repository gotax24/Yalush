const Review = require("../../models/review.model");

exports.deleteReview = async (request, response) => {
  try {
    const review = await Review.findByIdAndDelete(request.params.id);

    if (!review)
      return response
        .status(404)
        .json({ error: "No encontrado la calificacion" });

    response.status(200).json({ message: "La calificacion fue eliminada" });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};
