const Sale = require("../../models/sale.model");

exports.getSalesById = async (request, response) => {
  try {
    const sale = await Sale.findById(request.params.id);

    if (!sale)
      return response.status(404).json({ error: "La venta no se encontro" });

    response.status(200).json(sale);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};
