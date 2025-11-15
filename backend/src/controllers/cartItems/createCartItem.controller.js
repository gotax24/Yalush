const CartItem = require("../../models/cartItem.model");

exports.createCartItem = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // Buscar si ya existe ese producto en el carrito del usuario
    const existing = await CartItem.findOne({ userId, productId });

    if (existing) {
      existing.quantity += quantity;
      await existing.save();
      return res.status(200).json(existing);
    }

    const cartItem = await CartItem.create(req.body);
    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
