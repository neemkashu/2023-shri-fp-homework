import {
  __,
  allPass,
  always,
  andThen,
  apply,
  applySpec,
  call,
  compose,
  concat,
  converge,
  count,
  curry,
  equals,
  gt,
  head,
  identity,
  ifElse,
  length,
  lt,
  lte,
  mathMod,
  not,
  otherwise,
  over,
  prop,
  split,
  tap,
  test,
  toString,
  lensProp,
  clone,
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

// const api = new Api({ errorCountdown: 1, ebableErrors: true });
const api = new Api({ errorCountdown: 7, ebableErrors: true });

// const consoler = tap(console.log);

const getValue = prop("value");
const getResult = prop("result");
const getWriteLog = prop("writeLog");
const getHandleSuccess = prop("handleSuccess");
const getHandleError = prop("handleError");

const splitOnChars = split("");
const amountOfChars = compose(length, splitOnChars);
const isShorterThan10 = compose(lt(__, 10), amountOfChars);
const isLongerThan2 = compose(gt(__, 2), amountOfChars);
const isMinus = equals("-");
const isNotNegative = compose(not, isMinus, head);
const isDot = equals(".");
const isLonlyDot = compose(lte(__, 1), count(isDot), splitOnChars);
const isDigitsAndDot = test(/^[0-9.]+$/);
const isValidNumber = compose(
  allPass([
    isShorterThan10,
    isLongerThan2,
    isNotNegative,
    isLonlyDot,
    isDigitsAndDot,
  ]),
  getValue
);

const changeValue = over(lensProp("value"));

const roundToInteger = curry(Math.round);
const makeParams = changeValue(
  applySpec({
    number: identity,
    from: always(10),
    to: always(2),
  })
);

const fetchApi = api.get("https://api.tech/numbers/base");
const fulfillPromiseWithExtraFields = (fetch, objInput, paramKey = "value") => {
  const obj = clone(objInput);
  return fetch(obj[paramKey])
    .then((value) => {
      obj[paramKey] = value;
      return obj;
    })
    .catch((reason) => {
      obj[paramKey] = reason;
      return Promise.reject(obj);
    });
};
const fetchNumber = curry(fulfillPromiseWithExtraFields)(fetchApi);

const animalUrl = concat("https://animals.tech/");
const fetchAnimal = compose(api.get(__, {}), animalUrl, toString);
const fetchAnimalWithExtraFields = curry(fulfillPromiseWithExtraFields)(
  fetchAnimal
);
const size = prop("length");
const square = curry(Math.pow)(__, 2);
const remainderBy3 = mathMod(__, 3);
const validationError = compose(
  apply(__, ["ValidationError"]),
  curry,
  getHandleError
);
const logger = tap(converge(call, [compose(curry, getWriteLog), getValue]));
const errorLogger = tap(
  converge(call, [compose(curry, getHandleError), getValue])
);
const successLogger = tap(
  converge(call, [
    compose(curry, getHandleSuccess),
    compose(getResult, getValue),
  ])
);
const roundFromString = changeValue(compose(roundToInteger, curry(parseFloat)));

const getAnimal = compose(
  otherwise(errorLogger),
  andThen(successLogger),
  fetchAnimalWithExtraFields,
  logger,
  changeValue(remainderBy3),
  changeValue(square),
  logger,
  changeValue(size),
  logger,
  changeValue(getResult)
);

const parseIdAndFetch = compose(
  otherwise(errorLogger),
  andThen(getAnimal),
  fetchNumber,
  makeParams,
  logger,
  roundFromString,
  logger
);

const processSequence = ifElse(isValidNumber, parseIdAndFetch, validationError);

export default processSequence;
