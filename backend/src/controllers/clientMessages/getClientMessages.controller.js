const ClientMessage = require("../../models/clientMessage.model")

exports.getClientMessages = async(request, response) => {
  try {
    const clientMessages = await ClientMessage.find()

    response.status(200).json(clientMessages)
  } catch (error) {
    response.status(500).json({error: error.message})
  }
}