export const formatCardNumber = (value) => {
  const number = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
  const matches = number.match(/\d{4,16}/g);
  const match = (matches && matches[0]) || "";
  const parts = [];

  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }

  return parts.length ? parts.join(" ") : number;
};
