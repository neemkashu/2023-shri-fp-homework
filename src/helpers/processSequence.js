import {
  __,
  allPass,
  always,
  andThen,
  applySpec,
  compose,
  concat,
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
  otherwise,
  prop,
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
//  */
// Привести строку к числу, округлить к ближайшему целому с точностью до единицы, записать в writeLog.
// C помощью API /numbers/base перевести из 10-й системы счисления в двоичную, результат записать в writeLog
// Взять кол-во символов в полученном от API числе записать в writeLog
// Возвести в квадрат с помощью Javascript записать в writeLog
// Взять остаток от деления на 3, записать в writeLog
// C помощью API /animals.tech/id/name получить случайное животное используя полученный остаток в качестве id
// Завершить цепочку вызовом handleSuccess в который в качестве аргумента положить результат полученный на предыдущем шаге

const api = new Api({ errorCountdown: 1, ebableErrors: true });
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
const roundToInteger = curry(Math.round);
const makeParams = applySpec({
  number: (x) => x,
  from: always(10),
  to: always(2),
});
const toString = (x) => `${x}`;
const fetchApi = api.get("https://api.tech/numbers/base");
const animalUrl = concat("https://animals.tech/");
const fetchAnimal = compose(api.get(__, {}), animalUrl, toString);
const getConverted = prop("result");
const size = prop("length");
const square = curry(Math.pow)(__, 2);
const remainderBy3 = (x) => x % 3;

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
  const logger = tap(writeLog);
  const curriedHandleError = curryN(2, handleError);
  const handleEnd = compose(handleSuccess, getConverted);

  const logAndGiveNull = compose(always(null), curry(handleError));

  const getAnimal = compose(
    andThen(handleEnd),
    otherwise(logAndGiveNull),
    fetchAnimal,
    logger,
    remainderBy3,
    square,
    logger,
    size,
    logger,
    getConverted
  );

  const parseIdAndFetch = compose(
    andThen(getAnimal),
    otherwise(logAndGiveNull),
    fetchApi,
    makeParams,
    roundToInteger,
    logger,
    curry(parseFloat),
    logger
  );

  ifElse(
    isValidNumber,
    parseIdAndFetch,
    curriedHandleError("ValidationError")
  )(value);
};

export default processSequence;
