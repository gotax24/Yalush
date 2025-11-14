const ClientMessage = require("../../models/clientMessage.model");

exports.getClientMessageById = async (request, response) => {
  try {
    const clientMessage = await ClientMessage.findById(request.params.id);

    if (!clientMessage)
      return response.status(404).json({ error: "El mensaje no se encontro" });

    response.status(200).json(clientMessage);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};
