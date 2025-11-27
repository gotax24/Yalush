export const luhnCheck = (number) => {
    let array = (number + "")
      .split("")
      .reverse()
      .map((x) => parseInt(x));
    let lastDigit = array.splice(0, 1)[0];
    let suma = array.reduce(
      (acc, value, i) =>
        i % 2 !== 0 ? acc + value : acc + ((value * 2) % 9) || 9,
      0
    );
    suma += lastDigit;
    return suma % 10 === 0;
  };