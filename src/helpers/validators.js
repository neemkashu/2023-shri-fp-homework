/* eslint-disable no-unused-vars */
import {
  __,
  allPass,
  compose,
  converge,
  count,
  equals,
  filter,
  gte,
  keys,
  length,
  lte,
  not,
  prop,
  uniq,
  values,
} from "ramda";
import { COLORS, SHAPES } from "../constants";

/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */
const objectSize = compose(length, keys);

const isWhite = equals(COLORS.WHITE);
const isRed = equals(COLORS.RED);
const isGreen = equals(COLORS.GREEN);
const isBlue = equals(COLORS.BLUE);
const isOrange = equals(COLORS.ORANGE);

const getCircle = prop(SHAPES.CIRCLE);
const getSquare = prop(SHAPES.SQUARE);
const getTriangle = prop(SHAPES.TRIANGLE);
const getStar = prop(SHAPES.STAR);

const isCircleWhite = compose(isWhite, getCircle);
const isSquareGreen = compose(isGreen, getSquare);
const isTriangleWhite = compose(isWhite, getTriangle);
const isTriangleGreen = compose(isGreen, getTriangle);
const isStarRed = compose(isRed, getStar);

// Фигуры на странице всегда в таком порядке: Circle Square Triangle Star
// export const validateFieldN1 = ({star, square, triangle, circle}) => {
// ...
// };

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([
  isCircleWhite,
  isSquareGreen,
  isTriangleWhite,
  isStarRed,
]);

// 2. Как минимум две фигуры зеленые.

const isGreaterThanOne = gte(__, 2);

export const validateFieldN2 = compose(
  isGreaterThanOne,
  objectSize,
  filter(isGreen)
);

// 3. Количество красных фигур равно кол-ву синих.
const redAmount = compose(objectSize, filter(isRed));
const blueAmount = compose(objectSize, filter(isBlue));

export const validateFieldN3 = converge(equals, [redAmount, blueAmount]);

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([
  compose(isBlue, getCircle),
  compose(isRed, getStar),
  compose(isOrange, getSquare),
]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
const isNotWhite = compose(not, isWhite);
const greaterOrEqualTo3 = gte(__, 3);

export const validateFieldN5 = compose(
  lte(__, 1),
  length,
  uniq,
  greaterOrEqualTo3,
  objectSize,
  filter(isNotWhite)
);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
const is1 = equals(1);
const is2 = equals(2);

// const colorCount = (isColor) => compose(objectSize, filter(isColor));

const twoGreenShapes = compose(is2, count(isGreen), values);
// const twoGreenShapes = compose(is2, objectSize, filter(isGreen));
const oneRedShape = compose(is1, objectSize, filter(isRed));

export const validateFieldN6 = allPass([
  twoGreenShapes,
  isTriangleGreen,
  oneRedShape,
]);

// 7. Все фигуры оранжевые.
const is4 = equals(4);

export const validateFieldN7 = compose(is4, objectSize, filter(isOrange));

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = allPass([
  compose(not, isWhite, getStar),
  compose(not, isRed, getStar),
]);

// 9. Все фигуры зеленые.
export const validateFieldN9 = compose(is4, objectSize, filter(isGreen));

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета

const isTriangleEqualSquare = converge(equals, [getTriangle, getSquare]);

export const validateFieldN10 = allPass([
  compose(not, isWhite, getTriangle),
  compose(not, isWhite, getSquare),
  isTriangleEqualSquare,
]);
