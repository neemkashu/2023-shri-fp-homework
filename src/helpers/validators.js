/* eslint-disable no-unused-vars */
import {
  __,
  allPass,
  anyPass,
  compose,
  equals,
  filter,
  gte,
  keys,
  length,
  map,
  prop,
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
const isWhite = equals(COLORS.WHITE);
const isRed = equals(COLORS.RED);
const isGreen = equals(COLORS.GREEN);
// const isBlue = equals(COLORS.BLUE);
// const isOrange = equals(COLORS.ORANGE);

const getCircle = prop(SHAPES.CIRCLE);
const getSquare = prop(SHAPES.SQUARE);
const getTriangle = prop(SHAPES.TRIANGLE);
const getStar = prop(SHAPES.STAR);

const isCircleWhite = compose(isWhite, getCircle);
const isCircleGreen = compose(isGreen, getCircle);
const isSquareGreen = compose(isGreen, getSquare);
const isTriangleWhite = compose(isWhite, getTriangle);
const isTriangleGreen = compose(isGreen, getTriangle);
const isStarRed = compose(isRed, getStar);
const isStarGreen = compose(isGreen, getStar);

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
  length,
  keys,
  filter(isGreen)
);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = () => false;

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = () => false;

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = () => false;

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = () => false;

// 7. Все фигуры оранжевые.
export const validateFieldN7 = () => false;

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = () => false;

// 9. Все фигуры зеленые.
export const validateFieldN9 = () => false;

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = () => false;
