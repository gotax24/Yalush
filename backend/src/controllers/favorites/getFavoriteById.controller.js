const Favorite = require("../../models/favorite.model");

exports.getFavoriteById = async (request, response) => {
  try {
    const favorite = await Favorite.findById(request.params.id);

    if (!favorite)
      return response
        .status(404)
        .json({ error: "No existe ese articulo favorito" });

    response.status(200).json(favorite);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};
