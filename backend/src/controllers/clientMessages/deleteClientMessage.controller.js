const ClientMessage = require("../../models/clientMessage.model");

exports.deleteClientMessage = async (request, response) => {
  try {
    const clientMessage = await ClientMessage.findByIdAndDelete(
      request.params.id
    );

    if (!clientMessage)
      return response
        .status(404)
        .json({ error: "No fue encontrado el mensaje" });

    response.status(200).json({ message: "El mensaje fue eliminado" });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};
