 const SkuGenerator = (data, lastId) => {
  // Generate SKU based on category and last ID
  if (!data || !data.category || typeof lastId !== "number") {
    throw new Error("Invalid data or lastId");
  }

  const prefix = "YAL-";
  const cat = data.category
    ? data.category.substring(0, 3).toUpperCase()
    : "XXX";

  const sku = `${prefix}${cat}-${lastId + 1}`;

  return sku;
};

export default SkuGenerator;