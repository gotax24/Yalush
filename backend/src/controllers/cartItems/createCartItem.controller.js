const CartItem = require("../../models/cartItem.model");

exports.createCartItem = async (request, response) => {
  try {
    const cartItem = await CartItem.create(request.body);

    response.status(201).json(cartItem);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};
