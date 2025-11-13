const User = require("../../models/user.model");

exports.updateUser = async (request, response) => {
  try {
    const user = await User.findByIdAndUpdate(request.params.id, request.body, {
      new: true,
      runValidators: true,
    });

    if (!user)
      return response.status(404).json({ error: "Usuario no encontrado" });

    response.status(200).json(user);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};
