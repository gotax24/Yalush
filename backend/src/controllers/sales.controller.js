const mongoose = require("mongoose");
const Sales = require("../models/sale.model");
const Product = require("../models/product.model");
const asyncHandler = require("../helpers/asyncHandler");
const getAllowedFields = require("../helpers/getAllowedFields");
const AppError = require("../helpers/AppError");

exports.createSales = asyncHandler(async (request, response, next) => {
  const { products, typePayment, transactionInfo } = request.body;

  if (!products || products.length === 0)
    return next(new AppError("El carrito esta vacio", 400));

  if (["pagoMovil", "zelle"].includes(typePayment)) {
    if (!transactionInfo?.refNumber?.trim()) {
      return next(
        new AppError(
          `El numero de referencia es obligatorio para ${typePayment}`,
          400
        )
      );
    }
  }

  if (!transactionInfo?.email || !transactionInfo?.cellphone) {
    return next(new AppError("Email y telefono son obligatorios", 400));
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let total = 0;
    const productWithDetails = [];

    for (const item of products) {
      const product = await Product.findById(item.productId)
        .select("+cost")
        .session(session);

      if (!product) {
        throw new AppError(`Producto ${item.productId} no encontrado`, 404);
      }

      if (product.stock < item.quantity) {
        throw new AppError(
          `Stock insuficiente para ${product.name}. Disponibles ${product.stock}`,
          400
        );
      }

      const actualPrice = product.price;
      const subtotal = actualPrice * item.quantity;

      if (Math.abs(product.price - item.price) > 0.01) {
        throw new AppError(
          `El precio de ${product.name} ha cambiado. Recarga la pagina`,
          409
        );
      }

      await product.updateStock(item.quantity, "subtract", session);
      await product.save({ session });

      productWithDetails.push({
        productId: product._id,
        name: product.name,
        sku: product.sku,
        quantity: item.quantity,
        price: actualPrice,
        subtotal,
      });

      total += subtotal;
    }

    const sale = await Sales.create(
      [
        {
          userId: request.user._id,
          products: productWithDetails,
          total,
          typePayment,
          paymentStatus: "pending",
          transactionInfo,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    response.status(201).json({
      success: true,
      message: "Venta registrada exitosamente",
      data: sale[0],
    });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

exports.getSales = asyncHandler(async (request, response, next) => {
  const { status, method, userId, startDate, endDate } = request.query;

  const filter = { isActive: true };

  if (status) filter.paymentStatus = status;
  if (method) filter.typePayment = method;
  if (userId) filter.userId = userId;

  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  const sales = await Sales.find(filter)
    .populate("userId", "firstName lastName email")
    .populate("products.productId", "name sku")
    .select("-__v")
    .sort({ createdAt: -1 });

  response.status(200).json({
    success: true,
    results: sales.length,
    data: sales,
  });
});

exports.getSaleById = asyncHandler(async (request, response, next) => {
  const sale = await Sales.findById(request.params.id)
    .populate("userId", "firstName lastName email phone")
    .populate("products.productId", "name sku categoryId");

  if (!sale) {
    return next(new AppError("Venta no encontrada", 404));
  }

  response.status(200).json({
    success: true,
    data: sale,
  });
});

exports.updateSale = asyncHandler(async (request, response, next) => {
  const allowedFields = ["paymentStatus"];
  const filteredBody = getAllowedFields(request.body, allowedFields);

  if (Object.keys(filteredBody).length === 0)
    return next(new AppError("No hay campos para actualizar", 400));

  const sale = await Sales.findById(request.params.id);
  if (!sale) return next(new AppError("No se encontro la venta", 404));

  if (
    sale.paymentStatus === "paid" &&
    filteredBody.paymentStatus === "failed"
  ) {
    return next(
      new AppError("No se puede cambiar una venta pagada a fallida", 400)
    );
  }

  Object.assign(sale, filteredBody);
  await sale.save();

  response.status(200).json({
    success: true,
    message: "Estado de venta actualizado",
    data: sale,
  });
});

exports.softDeleteSale = asyncHandler(async (request, response, next) => {
  const sale = await Sales.findById(request.params.id);

  if (!sale) return next(new AppError("Venta no encontrada", 404));

  if (sale.paymentStatus === "paid") {
    return next(
      new AppError(
        "No se puede eliminar una venta confirmada. Usa rembolso",
        403
      )
    );
  }

  sale.isActive = false;
  (sale.cancelledAt = new Date()), (sale.cancelledBy = request.user._id);
  await sale.save();

  response.status(200).json({
    success: true,
    message: "Venta cancelada exitosamente",
  });
});

exports.refundSale = asyncHandler(async (request, response, next) => {
  const { reason } = request.body;

  if (!reason?.trim()) {
    return next(
      new AppError("Debe proporcionar una razon para el rembolso", 400)
    );
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const sale = await Sales.findById(request.params.id).session(session);

    if (!sale) {
      throw new AppError("Venta no encontrada", 404);
    }

    if (sale.paymentStatus !== "paid") {
      throw new AppError("Solo se pueden reembolsar ventas pagadas", 400);
    }

    for (const item of sale.products) {
      const product = await Product.findById(item.productId).session(session);
      if (product) {
        await product.updateStock(item.quantity, "add");
      }
    }

    (sale.paymentStatus = "refunded"),
      (sale.refundReason = reason),
      (sale.refundDate = new Date()),
      (sale.refundedBy = request.user._id);
    await sale.save({ session });

    await session.commitTransaction();

    response.status(200).json({
      success: true,
      message: "Venta reembolsada exitosamente",
      data: sale,
    });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

exports.getSalesStats = asyncHandler(async (request, response, next) => {
  const { startDate, endDate } = request.query;

  const matchStage = {
    paymentStatus: "paid",
    isActive: true,
  };

  if (startDate || endDate) {
    matchStage.createdAt = {};
    if (startDate) matchStage.createdAt.$gte = new Date(startDate);
    if (endDate) matchStage.createdAt.$lte = new Date(endDate);
  }

  const stats = await Sales.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalSales: { $sum: 1 },
        totalRevenue: { $sum: "$total" },
        avgOrderValue: { $avg: "$total" },
        byPaymentMethod: {
          $push: { method: "$typePayment", amount: "$total" },
        },
      },
    },
  ]);

  response.status(200).json({
    success: true,
    data: stats[0] || {
      totalSales: 0,
      totalRevenue: 0,
      avgOrderValue: 0,
    },
  });
});
