const Translator = (text) => {
  if (!text || typeof text !== "string") return "traducción no disponible";

  const dictionary = {
    pillows: "almohadas",
    bags: "bolsos",
    keychains: "llaveros",
    swimwear: "traje de baño",
    dress: "vestido",
    other: "otros",
  };

  return dictionary[text.toLowerCase()]
};

export default Translator;
