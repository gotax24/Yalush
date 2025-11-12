const User = require("../../models/user.model");

exports.getUserById = async (request, response) => {
  try {
    const user = await User.findById(request.params.id);
    response.status(200).json(user);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};
