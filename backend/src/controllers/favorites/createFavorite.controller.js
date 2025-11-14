const Favorite = require("../../models/favorite.model");

exports.createFavorite = async (request, response) => {
  try {
    const favorite = await Favorite.create(request.body);

    response.status(201).json(favorite);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};
