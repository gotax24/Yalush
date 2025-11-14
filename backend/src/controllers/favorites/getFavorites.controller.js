const Favorite = require("../../models/favorite.model");

exports.getFavorites = async (request, response) => {
  try {
    const favorites = await Favorite.find();

    response.status(200).json(favorites);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};
