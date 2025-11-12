const User = require("../../models/user.model");

exports.getUsers = async (request, response) => {
  try {
    const users = await User.find();
    response.status(200).json(users);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};

