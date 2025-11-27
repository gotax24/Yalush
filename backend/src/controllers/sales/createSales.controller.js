const Sale = require("../../models/sale.model");

exports.createSales = async (request, response) => {
  try {
    const sales = await Sale.create(request.body);
    response.status(201).json(sales);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};
