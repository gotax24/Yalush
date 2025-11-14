const ClientMessage = require("../../models/clientMessage.model");

exports.createClientMessage = async (request, response) => {
  try {
    const clientMessage = await ClientMessage.create(request.body);

    response.status(201).json(clientMessage);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};
