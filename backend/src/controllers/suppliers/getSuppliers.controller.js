const Supplier = require("../../models/supplier.model");

exports.getSuppliers = async (request, response) => {
  try {
    const supplier = await Supplier.find();
    response.status(200).json(supplier);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};
