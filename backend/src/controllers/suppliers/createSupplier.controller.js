const Supplier = require("../../models/supplier.model");

exports.createSupplier = async (request, response) => {
  try {
    const supplier = await Supplier.create(request.body);
    response.status(201).json(supplier);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};
