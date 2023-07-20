import { COLORS, SHAPES } from "../constants";
import * as validatorsFunctional from "./validators";
import * as validatorsReference from "./validatorsReference";

import "lodash.multipermutations";
import _ from "lodash";

const shapes = Object.values(SHAPES);
const colors = Object.values(COLORS);

const colorsPermutations = _.multipermutations(colors, shapes.length);

const paintShapes = (colors) => {
  return shapes.reduce((accum, shape, i) => {
    accum[shape] = colors[i];
    return accum;
  }, {});
};

const cases = [
  "N1 Красная звезда, зеленый квадрат, все остальные белые",
  "N2 Как минимум две фигуры зеленые",
  "N3 Количество красных фигур равно кол-ву синих",
  "N4 Синий круг, красная звезда, оранжевый квадрат, треугольник любого цвета",
  "N5 Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true)",
  "N6 Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия",
  "N7 Все фигуры оранжевые",
  "N8 Не красная и не белая звезда, остальные – любого цвета",
  "N9 Все фигуры зеленые",
  "N10 Треугольник и квадрат одного цвета (не белого)",
];

for (let i = 0; i < cases.length; i++) {
  const testName = cases[i];
  const functionName = `validateFieldN${i + 1}`;

  test(testName, () => {
    for (let colors of colorsPermutations) {
      const shapes = paintShapes(colors);
      if (
        validatorsReference[functionName](shapes) !==
        validatorsFunctional[functionName](shapes)
      ) {
        console.log(functionName, shapes);
      }
      expect(validatorsReference[functionName](shapes)).toBe(
        validatorsFunctional[functionName](shapes)
      );
    }
  });
}