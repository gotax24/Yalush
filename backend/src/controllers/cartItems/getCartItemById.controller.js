const CartItem = require("../../models/cartItem.model");

exports.getCartItemById = async (request, response) => {
  try {
    const cartItem = await CartItem.findById(request.params.id);

    if (!cartItem)
      return response.status(404).json({ error: "El carrito no se encontro " });

    response.status(200).json(cartItem);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};
