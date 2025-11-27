const Favorite = require("../../models/favorite.model");

exports.createFavorite = async (request, response) => {
  try {
    const { userId, productId } = request.body;

    const existing = await Favorite.findOne({ userId, product: productId });
    if (existing)
      return response.status(400).json({ error: "El favorito ya existe" });

    const favorite = await Favorite.create(request.body);

    response.status(201).json(favorite);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};
