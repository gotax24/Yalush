export const isValidExpiryDate = (date) => {
  if (!/^\d{2}\/\d{2}$/.test(date)) return false;

  const [month, year] = date.split("/");
  const monthNum = parseInt(month);
  const yearNum = parseInt(year);

  if (monthNum < 1 || monthNum > 12) return false;

  const expiry = new Date(2000 + yearNum, monthNum - 1);
  const now = new Date();

  return expiry > now;
};
