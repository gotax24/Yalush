const Supplier = require("../../models/supplier.model");

exports.getSupplierById = async (request, response) => {
  try {
    const supplier = await Supplier.findById(request.params.id);
    response.status(200).json(supplier);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};
