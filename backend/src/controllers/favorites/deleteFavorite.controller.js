const Favorite = require("../../models/favorite.model");

exports.deleteFavorite = async (request, response) => {
  try {
    const favorite = await Favorite.findByIdAndDelete(request.params.id);

    if (!favorite)
      return response.status(404).json({ error: "No se encontro el favorite" });

    response.status(200).json({ message: "El favorito eliminado" });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};
