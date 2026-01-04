const Product = require("../../models/product.model");
const Category = require("../models/category.model");
const Supplier = require("../models/supplier.model");
const asyncHandler = require("../helpers/asyncHandler");
const AppError = require("../helpers/AppError");

//name, price, image, categoryId, stock, cost, supplierId, sku
exports.createProduct = asyncHandler(async (request, response, next) => {
  const {
    name,
    price,
    image = null,
    categoryId,
    stock,
    cost,
    supplierId,
    sku,
  } = request.body;

  const [category, supplier, existingSku] = await Promise.all([
    Category.findById(categoryId),
    Supplier.findById(supplierId),
    Product.findOne({ sku: sku.toUpperCase() }),
  ]);

  if (!category) {
    return next(new AppError("La categoria no existe", 404));
  }

  if (!supplier) {
    return next(new AppError("El proveedor no existe", 404));
  }

  if (existingSku) {
    return next(new AppError("El SKU ya esta registrado", 409));
  }

  if (price <= cost) {
    return next(
      new AppError("El precio debe ser mayor al costo para tener ganancia", 400)
    );
  }

  const product = await Product.create({
    name,
    price,
    image: image || null,
    stock,
    cost,
    categoryId,
    supplierId,
    sku: sku.toUpperCase(),
  });

  response.status(201).json({
    success: true,
    message: "El producto fue creado exitosamente",
    data: product,
  });
});

exports.getProducts = asyncHandler(async (request, response, next) => {
  const page = Math.max(1, parseInt(request.query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(request.query.limit) || 12));
  const skip = (page - 1) * limit;

  //filtro dinamicos
  const filter = { isActive: true };

  //filtro por categoria
  if (request.query.categoryId) {
    filter.categoryId = request.query.categoryId;
  }

  //filtro por rango de precio
  if (request.query.minPrice || request.query.maxPrice) {
    filter.price = {};
    if (request.query.minPrice) {
      filter.price.$gte = parseFloat(request.query.minPriced);
    }
    if (request.query.maxPrice) {
      filter.price.$lte = parseFloat(request.query.maxPrice);
    }
  }

  //Busqueda por nombre
  if (request.query.search) {
    filter.name = { $regex: request.query.search, $option: 1 };
  }

  //filtro por estado de stock
  if (request.query.stockStatus) {
    switch (request.query.stockStatus) {
      case "sin_stock":
        filter.stock = 0;
        break;
      case "bajo_stock":
        filter.stock = { $lte: 20, $gt: 5 };
        break;
      case "stock_alto":
        filter.stock = { $gt: 20 };
        break;
    }
  }

  //ordenamiento dinamico
  let sortBy = "-createdAt"; //Por defecto: mas recientes
  if (request.query.sortBy) {
    const sortOptions = {
      price_asc: "price",
      price_desc: "-price",
      name_asc: "name",
      name_desc: "-name",
      popular: "-soldCount -averageRating",
      rating: "-averageRating -reviewCoutn",
    };

    sortBy = sortOptions[request.query.sortBy] || sortBy;
  }

  const [products, total] = await Promise.all([
    Product.find(filter)
      .select("-__v")
      .populate("categoryId", "name")
      .populate("supplierId", "name")
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .lean(), // retonra objetos planos
    Product.countDocuments(filter),
  ]);

  response.status(200).json({
    success: true,
    results: products.length,
    totalResult: total,
    totalPage: Math.ceil(total / limit),
    currentPage: Number(page),
    data: products,
  });
});

exports.getProductById = asyncHandler(async (request, response, next) => {
  const product = await Product.findById(request.params.id)
    .populate("categoryId", "name description")
    .populate("supplierId", "name email phone");

  if (!product || !product.isActive) {
    return next(new AppError("No existe el producto", 404));
  }
  response.status(200).json({
    success: true,
    data: product,
  });
});

exports.updateProduct = asyncHandler(async (request, response, next) => {
  const allowedFields = [
    "name",
    "price",
    "image",
    "stock",
    "cost",
    "categoryId",
    "supplierId",
    "isActive",
  ];

  //filtrar campos no permitidos
  const updates = {};
  Object.keys(request.body).forEach((key) => {
    if (allowedFields.includes(key)) {
      update[key] = request.body[key];
    }
  });

  //validacion sku no se puede modificar
  if (request.body.sku) {
    return next(new AppError("El SKU no puede modificarse", 400));
  }

  //validacion precio > costo
  if (updates.price || updates.cost) {
    const product = await Product.findById(request.params.id).select("+cost");
    const newPrice = updates.price || product.price;
    const newCost = update.cost || product.cost;

    if (newPrice <= newCost) {
      return next(new AppError("El precio debe ser mayor al costo", 400));
    }
  }

  const product = await Product.findByIdAndUpdate(request.params.id, updates, {
    new: true,
    runValidators: true,
  });

  if (!product) return next(new AppError("El producto no existe", 404));

  response.status(200).json({
    success: true,
    message: "Producto actualizado exitosamente",
    data: product,
  });
});

exports.softDeleteProduct = asyncHandler(async (request, response, next) => {
  const product = await Product.findOne(request.params.id);

  if (!product) return next(new AppError("No existe el producto", 404));

  product.isActive = false;
  await product.save();

  response.status(200).json({
    success: true,
    message: "El producto fue desactivado exitosamente",
  });
});

exports.hardDeleteProduct = asyncHandler(async (request, response, next) => {
  if (request.user.role !== "admin") {
    return next(
      new AppError("Solo administradores tienen permitido esta accion", 403)
    );
  }
  const product = await Product.findByIdAndDelete(request.params.id);

  if (!product) return next(new AppError("El producto no existe", 404));

  response.status(200).json({
    success: true,
    message: "El producto fue eliminado permanentemente",
  });
});

exports.getLowStockProducts = asyncHandler(async (request, response, next) => {
  const threshold = parseInt(request.query.threshold) || 5;

  const products = await Product.findLowStock(threshold)
    .select("name sku stock stockStatus")
    .populate("supplierId", "name email");

  response.status(200).json({
    success: true,
    results: products.length,
    data: products,
  });
});

exports.getTopSellingProducts = asyncHandler(
  async (request, response, next) => {
    const limit = Math.min(20, parseInt(request.query.limit) || 10);

    const products = await Product.find({ isActive: true })
      .sort("-soldCount - averageRating")
      .limit(limit)
      .select("name sku soldCount averageRating price")
      .populate("categoryId", "name");

    response
      .status(200)
      .json({ success: true, results: products.length, data: products });
  }
);
