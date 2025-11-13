const Sales = require("../../models/sale.model");

exports.updateSale = async (request, response) => {
  try {
    const sale = await Sales.findByIdAndUpdate(
      request.params.id,
      request.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!sale)
      return response.status(404).json({ error: "La venta no fue encontrada" });

    response.status(200).json(sale);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};
