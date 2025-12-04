//Previene que usuarios maliciosos modifiquen campos criticos
const getAllowedFields = (body, allowedFields) => {
  return Object.keys(body)
    .filter((key) => allowedFields.includes(key))
    .reduce((obj, key) => {
      obj[key] = body[key];
      return obj;
    }, {});
};

module.exports = getAllowedFields;
