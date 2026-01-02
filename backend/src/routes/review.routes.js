const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth");
const { validateObjectId } = require("../middlewares/validateObjectId");
const reviewController = require("../controllers/reviews.controller");

router.get(
  "product/:product",
  validateObjectId("productId"),
  reviewController.getReviewsByProduct
);

router.get("/:id", validateObjectId(), reviewController.getReviewById);

//protegidas
router.use(protect); //Todas las rutas debajo requieren autenticacion

router.post("/", reviewController.createReview);

router.patch("/:id", validateObjectId(), reviewController.updateReview);

router.delete("/:id", validateObjectId(), reviewController.softDeleteReview);

router.patch("/:id/helpFul", validateObjectId(), reviewController.markHelpLike);

router.get(
  "/user/:userId",
  validateObjectId("userId"),
  reviewController.getUserReviews
);

//admin solamente
router.delete(
  "/:id/permanet",
  validateObjectId(),
  reviewController.hardDeleteReview
);

module.exports = router;
