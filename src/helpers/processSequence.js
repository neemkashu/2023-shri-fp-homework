import {
  __,
  allPass,
  compose,
  count,
  curry,
  curryN,
  equals,
  gt,
  head,
  ifElse,
  length,
  lt,
  lte,
  not,
  split,
  tap,
  test,
} from "ramda";
import Api from "../tools/api";

/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 * Строка валидируется по следующим правилам:
кол-во символов в числе должно быть меньше 10.
кол-во символов в числе должно быть больше 2.
число должно быть положительным
символы в строке только [0-9] и точка т.е. число в 10-ной системе счисления (возможно с плавающей запятой)
В случае ошибки валидации вызвать handleError с 'ValidationError' строкой в качестве аргумента
 */

const api = new Api();
const splitOnChars = split("");
const amountOfChars = compose(length, splitOnChars);
const isShorterThan10 = compose(lt(__, 10), amountOfChars);
const isLongerThan2 = compose(gt(__, 2), amountOfChars);
const isMinus = equals("-");
const isNotNegative = compose(not, isMinus, head);
const isDot = equals(".");
const isLonlyDot = compose(lte(__, 1), count(isDot), splitOnChars);
const isDigitsAndDot = test(/^[0-9.]+$/);
const isValidNumber = allPass([
  isShorterThan10,
  isLongerThan2,
  isNotNegative,
  isLonlyDot,
  isDigitsAndDot,
]);

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
  writeLog(value);
  const curriedHandleError = curryN(2, handleError);

  ifElse(
    isValidNumber,
    curry(parseFloat),
    curriedHandleError("ValidationError")
  )(value);
};

export default processSequence;
