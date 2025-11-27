const CartItem = require("../../models/cartItem.model");

exports.deleteCartItem = async (request, response) => {
  try {
    const cartItem = await CartItem.findByIdAndDelete(request.params.id);

    if (!cartItem)
      return response.status(404).json({ error: "El carrito no se encontro" });

    response.status(200).json({ message: "El carrito fue eliminado" });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};
