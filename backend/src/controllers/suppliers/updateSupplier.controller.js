const Supplier = require("../../models/supplier.model");

exports.updateSupplier = async (request, response) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(
      request.params.id,
      request.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!supplier)
      return response.status(404).json({ error: "Usuario no encontrado" });

    response.status(201).json(supplier);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};
