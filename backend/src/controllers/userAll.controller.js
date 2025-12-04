const User = require("../models/user.model");
const asyncHandler = require("../helpers/asyncHandler");
const AppError = require("../helpers/AppError");
const getAllowedFields = require("../helpers/getAllowedFields");
const getPositiveInt = require("../helpers/getPositiveInt");

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
  const page = getPositiveInt(request.query.page, 1, 100);
  const limit = getPositiveInt(request.query.limit, 10, 100);
  const skip = (page - 1) * limit;
  
  if (page < 1) page = 1;
  if (limit < 1) limit = 1;
  if (limit > 100) limit = 100;

  //flitros para usuarios solo activos
  const filter = { isActive: true };

  const allowedRoles = ["admin", "user", "superUser"];
  if (request.query.role && allowedRoles.includes(request.query.role)) {
    filter.role = request.query.role;
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .select("-password -__v")
      .lean()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    User.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit) || 1;
  if (page > totalPages && total > 0) {
    return next(
      new AppError(
        `Pagina ${page} no existe. Total de paginas: ${totalPages}`,
        400
      )
    );
  }

  const paginacion = {
    current: page,
    total: totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
    next: page < totalPages ? page + 1 : null,
    prev: page > 1 ? page - 1 : null,
  };

  response.status(200).json({
    success: true,
    count: users.length,
    total,
    paginacion,
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
  const allowedFields = [
    "firstName",
    "lastName",
    "email",
    "profileImageUrl",
    "cart",
    "favorite",
  ];

  const filteredBody = getAllowedFields(request.body, allowedFields);

  //verifica que haya campos para actualizar
  if (Object.keys(filteredBody).length === 0) {
    return next(new AppError("No hay campos para actualizar", 400));
  }

  const user = await User.findByIdAndUpdate(request.params.id, request.body, {
    new: true,
    runValidators: true,
  });

  if (!user) return next(notFindUser);

  response.status(200).json({
    success: true,
    message: "Usuario actualizado exitosamente",
    data: user,
  });
});

exports.softDeleteUser = asyncHandler(async (request, response, next) => {
  const user = await User.findByIdAndUpdate(
    request.params.id,
    { isActive: false },
    { new: true }
  );

  if (!user) return next(notFindUser);

  response.status(200).json({
    success: true,
    message: "Usuario eliminado correctamente",
  });
});

//Eliminar permanente
exports.hardDeleteUser = asyncHandler(async (request, response, next) => {
  const user = await User.findByIdAndDelete(request.params.id);

  if (!user) return next(notFindUser);

  response.status(200).json({
    success: true,
    message: "El usuario ha sido hard eliminado exitosamente",
  });
});
