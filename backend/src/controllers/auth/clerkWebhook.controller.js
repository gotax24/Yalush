const User = require("../../models/user.model");
const asyncHandler = require("../../helpers/asyncHandler");

//clerk llama a este endpoint cuando un usuario se registra/actualiza
exports.clerkWebhook = asyncHandler(async (request, response, next) => {
  const { type, data } = request.body;

  switch (type) {
    case "user.created":
    case "user.updated":
      const {
        id: clerkId,
        email_addresses,
        first_name,
        last_name,
        image_url,
      } = data;

      const email = email_addresses[0]?.email_address;

      let user = await User.findOne({ email });

      if (user) {
        //si existe actualiza sus datos
        (user.clerkId = clerkId),
          (user.firstName = first_name || user.firstName);
        user.lastName = last_name || user.lastName;
        user.profileImageUrl = image_url || userProfileImageUrl;
        user.authMethod = "clerk";
        await user.save();
      } else {
        user = await User.create({
          clerkId,
          email,
          firstName: first_name,
          lastName: last_name,
          profileImageUrl: image_url,
          authMethod: "clerk",
        });
      }
      return response.status(200).json({ success: true, message: "" });

    default:
      return response.status(200).json({ success: true, message: "" });
  }
});
