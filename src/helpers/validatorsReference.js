// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = ({ star, square, triangle, circle }) => {
  if (triangle !== "white" || circle !== "white") {
    return false;
  }

  return star === "red" && square === "green";
};

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = ({ star, square, triangle, circle }) => {
  return (
    [star, square, triangle, circle].filter((color) => color === "green")
      .length >= 2
  );
};

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = ({ star, square, triangle, circle }) => {
  const redAmount = [star, square, triangle, circle].filter(
    (color) => color === "red"
  ).length;
  const blueAmount = [star, square, triangle, circle].filter(
    (color) => color === "blue"
  ).length;
  return redAmount === blueAmount;
};

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = ({ star, square, triangle, circle }) => {
  return circle === "blue" && star === "red" && square === "orange";
};

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = ({ star, square, triangle, circle }) => {
  const nonWhite = [star, square, triangle, circle].filter((color) => {
    return color !== "white";
  });
  if (nonWhite.length < 3) return false;
  const colors = {
    green: 0,
    blue: 0,
    red: 0,
    orange: 0,
  };
  nonWhite.forEach((color) => {
    colors[color] += 1;
  });
  for (let color in colors) {
    if (colors[color] >= 3) return true;
  }
  return false;
};

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = ({ star, square, triangle, circle }) => {
  const green = [star, square, triangle, circle].filter(
    (color) => color === "green"
  ).length;
  const red = [star, square, triangle, circle].filter(
    (color) => color === "red"
  ).length;
  return triangle === "green" && green === 2 && red === 1;
};

// 7. Все фигуры оранжевые.
export const validateFieldN7 = ({ star, square, triangle, circle }) => {
  return (
    circle === "orange" &&
    star === "orange" &&
    square === "orange" &&
    triangle === "orange"
  );
};

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = ({ star, square, triangle, circle }) => {
  return star !== "red" && star !== "white";
};

// 9. Все фигуры зеленые.
export const validateFieldN9 = ({ star, square, triangle, circle }) => {
  return (
    circle === "green" &&
    star === "green" &&
    square === "green" &&
    triangle === "green"
  );
};

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = ({ star, square, triangle, circle }) => {
  return square !== "white" && triangle !== "white" && square === triangle;
};
