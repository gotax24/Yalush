const Review = require("../models/review.model")
const AppError = require("../helpers/AppError")
const asyncHandler = require("../helpers/asyncHandler")
const mongoose = require("mongoose")
const Product = require("../models/product.model") 
const User = require("../models/user.model")

exports.createReview = asyncHandler(async (request, response, next) => {
  const {productId, userId} = request.body

  const user = await User.findById(userId)
  const product = await Product.findById(productId)

  if(!product || !user) {
   return next(new AppError("Falta credenciales (userId o productId)", 404))
  }
  
  const review = await Review.create(request.body)
  
  response.status(200).json({
    success: true,
    message: "Review creada exitosamente ",
    data: 
  })
})