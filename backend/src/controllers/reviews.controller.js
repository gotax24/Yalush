const Review = require("../models/review.model");
const Product = require("../models/product.model");
const Sale = require("../models/sale.model");
const AppError = require("../helpers/AppError");
const asyncHandler = require("../helpers/asyncHandler");
const getAllowedFields = require("../helpers/getAllowedFields");

exports.createReview = asyncHandler(async (request, response, next) => {
  const { productId, rating, comment } = request.body;
  const userId = request.user._id;

  const product = await Product.findById(productId);

  if (!product) {
    return next(new AppError("Producto no encontrado", 404));
  }

  const existingReview = await Review.findOne({
    userId,
    productId,
    isActive: true,
  });

  if (existingReview) {
    return next(new AppError("Ya has comentado este producto", 400));
  }

  const hasPurchased = await Sale.findOne({
    userId,
    "products.productId": productId,
    paymentStatus: "paid",
  });

  const review = await Review.create({
    productId,
    userId,
    rating,
    comment,
    verified: !hasPurchased,
  });

  await review.populate("userID", "firstName lastaName");

  response.status(200).json({
    success: true,
    message: "Review creada exitosamente ",
    data: review,
  });
});

exports.getReviewsByProduct = asyncHandler(async (request, response, next) => {
  const { productId } = request.params;

  const product = await Product.findById(productId);
  if (!product) return next(new AppError("El productId no se encuentra", 404));

  const {
    rating,
    verified,
    sortBy = "-createdAt",
    page = 1,
    limit = 10,
  } = request.query;

  const filter = {
    productId,
    isActive: true,
  };

  if (rating) filter.rating = Number(rating);
  if (verified) filter.verified = verified === "true";

  const skip = (page - 1) * limit;

  const reviews = await Review.find(filter)
    .populate("userId", "firstName lastName")
    .select("-__v")
    .sort(sortBy)
    .skip(skip)
    .limit(Number(limit));

  const total = await reviews.countDocuments(filter);

  //const reviews = await Review.find({ productId, isActive: true });

  response.status(200).json({
    success: true,
    results: reviews.length,
    totalResults: total,
    totalPages: Math.ceil(total / limit),
    currentPage: Number(page),
    data: reviews,
  });
});

//No creo que sea necesario no voy a necesitar ver un solo comentario (creo)
exports.getReviewById = asyncHandler(async (request, response, next) => {
  const review = await Review.findById(request.params.id)
    .populate("userId", "firstName lastName")
    .populate("productId", "name price");

  if (!review || !review.isActive) {
    return next(new AppError("Review no encontrada", 404));
  }

  response.status(200).json({
    success: true,
    data: review,
  });
});

exports.updateReview = asyncHandler(async (request, response, next) => {
  const allowedFields = ["rating", "comment"];
  const filteredBody = getAllowedFields(request.body, allowedFields);

  if (Object.keys(filteredBody).length === 0) {
    return next(new AppError("No hay campos para actualizar", 400));
  }

  const review = await Review.findById(request.params.id);

  if (!review || !review.isActive) {
    return next(new AppError("Review no encontrada", 404));
  }

  if (review.userId.toString() !== request.user._id.toString()) {
    return next(new AppError("No puede editar reviews de otros usuarios", 403));
  }

  Object.assign(review, filteredBody);
  await review.save(); //esto dispara el middleware post-save

  response.status(200).json({
    success: true,
    message: "Review actualizada",
    data: review,
  });
});

exports.softDeleteReview = asyncHandler(async (request, response, next) => {
  const review = await Review.findById(request.params.id);

  if (!review) {
    return next(new AppError("Review no encontrada", 404));
  }

  const isOwner = request.userId.toString() === request.user._id.toString();
  const isAdmin = request.user.role === "admin";

  if (!isOwner && !isAdmin) {
    return next(
      new AppError("No tienes permiso para eliminar esta review", 403)
    );
  }

  review.isActive = false;
  await review.save();

  response.status(200).json({
    success: true,
    message: "Review desactivada",
  });
});

exports.hardDeleteReview = asyncHandler(async (request, response, next) => {
  if (!request.user.role !== "admin") {
    return next(
      new AppError("Solo administradores pueden eliminar permanentemente", 403)
    );
  }

  const review = await Review.findByIdAndDelete(request.params.id);

  if (!review) return next(new AppError("No existe la review", 404));

  response.status(200).json({
    success: true,
    message: "La review fue eliminado permanentemente",
  });
});

exports.markHelpLike = asyncHandler(async (request, response, next) => {
  const review = await Review.findByIdAndUpdate(
    request.params.id,
    { $inc: { helpLikeCount: 1 } },
    { new: true }
  );

  if (!review) {
    return next(new AppError("Review no encontrada", 404));
  }

  response.status(200).json({
    success: true,
    message: "Marcada como util",
    data: { helpLikeCount: review.helpLikeCount },
  });
});

exports.getUserReviews = asyncHandler(async (request, response, next) => {
  const userId = request.params.userId || request.user._id;

  const reviews = await Review.find({
    userId,
    isActive: true,
  })
    .populate("productId", "name price, image")
    .sort("-createdAt");

  response.status(200).json({
    success: true,
    results: reviews.length,
    data: reviews,
  });
});
