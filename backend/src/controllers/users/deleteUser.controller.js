const User = require("../../models/user.model");

exports.deleteUSer = async (request, response) => {
  try {
    const user = await User.findByIdAndDelete(request.params.id);

    if (!user)
      return response.status(404).json({ error: "Usuario no encontrado" });

    response.status(200).json({message: "Usuario eliminado"})
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};
