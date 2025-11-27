exports.getFavorites = async (request, response) => {
  try {
    const favorites = await Favorite.find({ userId: request.params.userId });
    response.status(200).json(favorites);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};
