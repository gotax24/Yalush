export const dateNow = () => {
  const now = new Date();
  const today = now.toISOString().split("T")[0]; // "2025-05-21"

  return today
};
