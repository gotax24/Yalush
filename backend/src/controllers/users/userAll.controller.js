const User = require("../../models/user.model");
const asyncHandler = require("../../helpers/asyncHandler");
const AppError = require("../../helpers/AppError");

//Previene que usuarios maliciosos modifiquen campos criticos
const getAllowedFields = (body, allowedFields) => {
  return Object.keys(body)
    .filter((key) => allowedFields.includes(key))
    .reduce((obj, key) => {
      obj[key] = body[key];
      return obj;
    }, {});
};

//Error generico de usuario no encontrado
const notFindUser = new AppError("Usuario no encontrado", 404);

exports.createUser = asyncHandler(async (request, response, next) => {
  const allowedFields = [
    "clerkId",
    "firstName",
    "lastName",
    "email",
    "profileImageUrl",
  ];

  const filteredBody = getAllowedFields(request.body, allowedFields);

  //Validar que existen campos obligatorios
  if (!filteredBody.clerkId || !filteredBody.email) {
    return next(new AppError("El clerkId y email son obligatorio", 400));
  }

  //Verificar si ya existe se evita duplicado
  const existingUser = await User.findOne({
    $or: [{ email: filteredBody.email }, { clerkId: filteredBody.clerkId }],
  });

  if (existingUser) {
    return next(
      new AppError("Ya existe un usuario con ese email o clerkId", 400)
    );
  }

  const user = await User.create(filteredBody);

  response.status(201).json({
    success: true,
    message: "Usuario creado exitosamente",
    data: user,
  });
});

exports.getUsers = asyncHandler(async (request, response, next) => {
  //parametros para la paginacion
  const page = parseInt(request.query.page) || 1;
  const limit = parseInt(request.query.limit) || 10;
  const skip = (page - 1) * limit;

  //flitros para usuarios solo activos
  const filter = { isActive: true };
  if (request.query.role) filter.role = request.query.role;

  //consulta con paginacion
  const users = await User.find(filter)
    .select()
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 }); // mas reciente primero

  //contar el total con paginacion para el frontend
  const total = await User.countDocuments(filter);

  response.status(200).json({
    success: true,
    count: users.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: users,
  });
});

exports.getUserById = asyncHandler(async (request, response, next) => {
  //validacion formato del id
  if (!request.params.id.match(/^[0-9a-fA-F]{24}$/))
    return next(new AppError("ID de usuario invalido", 400));

  const user = await User.findById(request.params.id);

  if (!user) return next(notFindUser);

  response.status(200).json({
    success: true,
    data: user,
  });
});

exports.updateUser = asyncHandler(async (request, response, next) => {
  const user = await User.findByIdAndUpdate(request.params.id, request.body, {
    new: true,
    runValidators: true,
  });

  if (!user) return next(notFindUser);

  response.status(200).json({
    success: false,
    data: user,
  });
});

exports.deleteUser = asyncHandler(async (request, response, next) => {
  const user = await User.findByIdAndDelete(request.params.id);

  if (!user) return next(notFindUser);

  response.status(200).json({
    success: true,
    message: "El usuario ha sido eliminado exitosamente",
  });
});
