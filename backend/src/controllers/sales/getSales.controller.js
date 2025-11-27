const Sale = require("../../models/sale.model");

exports.getSales = async (request, response) => {
  try {
    const sales = await Sale.find();
    response.status(200).json(sales);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};
