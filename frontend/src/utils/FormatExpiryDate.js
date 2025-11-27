export const formatExpiryDate = (value) => {
  const numbers = value.replace(/\D/g, "");
  if (numbers.length >= 2) {
    return numbers.substring(0, 2) + "/" + numbers.substring(2, 4);
  }
  return numbers;
};
