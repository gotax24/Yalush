const User = require("../../models/user.model");

exports.createUser = async (request, response) => {
  try {
    const user = await User.create(request.body);
    response.status(201).json(user);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
};
