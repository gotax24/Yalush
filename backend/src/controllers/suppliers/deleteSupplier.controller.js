const Supplier = require("../../models/supplier.model");

exports.deleteSupplier = async (request, response) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(request.params.id);

    if (!supplier)
      return response.status(404).json({ error: "Proveedor no encotrado" });

    response.status(200).json({ message: "Proveedor eliminado" });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};
