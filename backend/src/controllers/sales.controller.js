const Sales = require("../models/sale.model");
const asyncHandler = require("../helpers/asyncHandler");
const getAllowedFields = require("../helpers/getAllowedFields");
const AppError = require("../helpers/AppError");

exports.createSales = asyncHandler(async (request, response, next) => {
  //userId, products(productId, quantity, price), total, typePayment, paymentStatus, transactionInfo(cellphone, refNumber, email)
  const { products, total, typePayment, paymentStatus, transactionInfo } =
    request.body;

  const sales = await Sales.create(
    products,
    total,
    typePayment,
    paymentStatus,
    transactionInfo
  );

  response.status(201).json({
    success: true,
    message: "Venta registrada",
    data: sales,
  });
});

exports.getSales = asyncHandler(async (request, response, next) => {
  const sales = await Sales.find().sort({ name: 1 });

  response.status(200).json({
    sucess: true,
    result: sales.length,
    data: sales,
  });
});

exports.getSaleById = asyncHandler(async (request, response, next) => {
  const sale = await Sales.findById(request.params.id);

  if (!sale) return next(new AppError("No se encontro la venta", 404));

  response.status(200).json({
    success: true,
    data: sale,
  });
});

exports.updateSale = asyncHandler(async (request, response, next) => {
  const allowedFields = [
    "products,paymentStatus, typePayment, transactionInfo",
  ];
  const filteredBody = getAllowedFields(request.body, allowedFields);

  if (Object.keys(filteredBody).length === 0)
    return next(new AppError("No hay campos para actualizar", 400));

  const sale = await Sales.findByIdAndUpdate(
    request.params.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }.select("-__v")
  );

  if (!sale) return next(new AppError("No se encontro la venta"));

  response.status(200).json({
    success: true,
    message: "LA venta fue actualizada",
    data: sale,
  });
});

exports.deleteSale = asyncHandler(async (request, response, next) => {
  const sale = await Sales.findByIdAndDelete(request.params.id);

  if (!sale) return next(new AppError("No se encontro la venta"));

  response.status(200).json({
    sucess: true,
    message: "La venta fue borrada exitosamente",
  });
});
