const CartItem = require("../../models/cartItem.model");

exports.getCartItems = async (request, response) => {
  try {
    const cartItem = await CartItem.find();

    response.status(200).json(cartItem);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};
