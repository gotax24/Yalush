const Favorite = require("../../models/favorite.model");

exports.updateFavorite = async (request, response) => {
  try {
    const favorite = await Favorite.findByIdAndUpdate(
      request.params.id,
      request.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!favorite)
      return response
        .status(404)
        .json({ error: "No se encontro ningun favorito" });

    response.status(500).json(favorite);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};
