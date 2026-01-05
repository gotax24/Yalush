const Supplier = require("../models/supplier.model");
const asyncHandler = require("../helpers/asyncHandler");
const AppError = require("../helpers/AppError");
const getAllowedFields = require("../helpers/getAllowedFields");

exports.createSupplier = asyncHandler(async (request, response, next) => {
  //name, email, phone
  const { name, email, phone } = request.body;

  const existingSupplier = await Supplier.findOne({
    $or: [{ email }, { phone }],
  });

  if (existingSupplier) {
    const field = existingSupplier.email === email ? "email" : "telefono";
    return next(new AppError(`Ya existe el proveedor con ese ${field}`, 409));
  }

  const supplier = await Supplier.create({ name, email, phone });
  response.status(201).json({
    success: true,
    message: "Proveedor fue creado exitosamanete",
    data: supplier,
  });
});

exports.getSuppliers = asyncHandler(async (request, response, next) => {
  //filtrar solo proveedores por defecto
  const { includeInactive } = request.query;
  const filter = includeInactive === "true" ? {} : { isActive: true };

  const suppliers = await Supplier.find(filter)
    .select("-__v")
    .sort({ name: 1 });

  response.status(200).json({
    success: true,
    result: suppliers.length,
    data: suppliers,
  });
});

exports.getSupplerById = asyncHandler(async (request, response, next) => {
  const supplier = await Supplier.findById(request.params.id).populate(
    "productCount"
  );

  if (!supplier) return next(new AppError("No se encontro el proveedor", 404));

  response.status(200).json({
    success: true,
    data: supplier,
  });
});

exports.updateSupplier = asyncHandler(async (request, response, next) => {
  const allowedFields = ["name", "email", "phone", "address"];
  const filteredBody = getAllowedFields(request.body, allowedFields);

  if (Object.keys(filteredBody).length === 0) {
    return next(new AppError("No hay campos para actualizar", 400));
  }

  if (filteredBody.email || filteredBody.phone) {
    const query = {
      _id: { $ne: request.params.id },
      $or: [],
    };

    if (filteredBody.email) query.$or.push({ email: filteredBody.email });
    if (filteredBody.phone) query.$or.push({ phone: filteredBody.phone });

    const duplicate = await Supplier.findOne(query);

    if (duplicate) {
      const field =
        duplicate.email === filteredBody.email ? "email" : "telefono";
      return next(new AppError(`Ese ${field} ya existe`, 409));
    }
  }

  const supplier = await Supplier.findByIdAndUpdate(
    request.params.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  ).select("-__v");

  if (!supplier) return next(new AppError("No se encontro el proveedor", 404));

  response.status(200).json({
    success: true,
    message: "Proveedor actualizado correctamente",
    data: supplier,
  });
});

exports.softDeleteSupplier = asyncHandler(async (request, response, next) => {
  const supplier = await Supplier.findByIdAndUpdate(
    request.params.id,
    { isActive: false },
    { new: true }
  );

  if (!supplier) {
    return next(new AppError("Proveedor no encontrado", 404));
  }

  response.status(200).json({
    success: true,
    message: "Proveedor desactivado correctamente",
    data: supplier,
  });
});

exports.hardDeleteSupplier = asyncHandler(async (request, response, next) => {
  const supplier = await Supplier.findByIdAndDelete(request.params.id);

  if (!supplier)
    return next(new AppError("No fue encontrado el proveedor", 404));

  response.status(200).json({
    success: true,
    message: "El proveedor fue eliminado correctamente",
  });
});
