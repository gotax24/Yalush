const CartItem = require("../../models/cartItem.model");

exports.updateCartItem = async (request, response) => {
  try {
    const cartItem = await CartItem.findByIdAndUpdate(
      request.params.id,
      request.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!cartItem)
      return response
        .status(404)
        .json({ error: "El carrito no fue encontrado" });

    response.status(200).json(cartItem);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};
