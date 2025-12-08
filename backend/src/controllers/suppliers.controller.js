const Supplier = require("../models/supplier.model");
const asyncHandler = require("../helpers/asyncHandler");
const AppError = require("../helpers/AppError");
const getAllowedFields = require("../helpers/getAllowedFields");

exports.createSupplier = asyncHandler(async (request, response, next) => {
  //name, email, phone
  const { name, email, phone } = request.body;

  const existingSupplier = await Supplier.findOne({
    $or: [{ email: email }, { phone: phone }],
  });

  if (existingSupplier) {
    return next(
      new AppError("Ya existe el proveedor con ese email o telefono", 400)
    );
  }

  const supplier = await Supplier.create(request.body);
  response.status(201).json({
    success: true,
    message: "Proveedor fue creado exitosamanete",
    data: supplier,
  });
});

exports.getSuppliers = asyncHandler(async (request, response, next) => {
  const suppliers = await Supplier.find();
  response.status(200).json({
    success: true,
    data: suppliers,
  });
});

exports.getSupplerById = asyncHandler(async (request, response, next) => {
  if (!request.params.id.match(/^[0-9a-fA-F]{24}$/))
    return next(new AppError("ID de usuario invalido", 400));

  const supplier = await Supplier.findById(request.params.id);

  if (!supplier) return next(new AppError("No se encontro el proveedor", 400));

  response.status(200).json({
    success: true,
    data: supplier,
  });
});

exports.updateSupplier = asyncHandler(async (request, response, next) => {
  const { email } = request.body;

  const allowedFields = ["email", "phone"];

  const filteredBody = getAllowedFields(request.body, allowedFields);

  if (Object.keys(filteredBody).length === 0) {
    return next(new AppError("No hay campos para actualizar", 400));
  }

  const existingSupplier = await Supplier.findOne({
    email: email,
  });

  if (existingSupplier) return next(new AppError("Ese correo ya existe", 400));

  const supplier = Supplier.findByIdAndUpdate(request.params.id, request.body, {
    new: true,
    runValidators: true,
  });

  if (!supplier) return next(new AppError("No se encontro el proveedor", 400));

  response.status(200).json({
    success: true,
    data: supplier,
  });
});

exports.deleteSupplier = asyncHandler(async (request, response, next) => {
  const supplier = await Supplier.findByIdAndDelete(request.params.id);

  if (!supplier)
    return next(new AppError("No fue encontrado el proveedor", 400));

  response.status(200).json({
    success: true,
    message: "El proveedor fue eliminado correctamente",
  });
});
