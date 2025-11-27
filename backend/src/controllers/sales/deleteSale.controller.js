const Sale = require("../../models/sale.model");

exports.deleteSale = async (request, response) => {
  try {
    const sale = await Sale.findByIdAndUpdate(request.params.id);

    if (!sale)
      return response.status(404).json({ error: "La venta no fue encontrada" });

    response.status(200).json({ message: "La venta fue eliminada" });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};
