const getPositiveInt = (value, defaultValue, max = Infinity) => {
  const parsed = parseInt(value);

  if (isNaN(parsed) || parsed < 1) return defaultValue;
  return Math.min(parsed, max);
};

module.exports = getPositiveInt;
