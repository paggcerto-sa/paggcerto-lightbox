const _isArray = value => {
  return value instanceof Array;
};

const _isBoolean = value => {
  return typeof value === "boolean";
};

const _isNullOrUndefined = value => {
  return value === undefined || value === null;
};

const _isNumber = value => {
  return typeof value === "number";
};

const _isNumberPositive = value => {
  var isNumber = _isNumber(value);
  if (!isNumber) return false;

  var _isNumberPositive = value <= 0;
  return !_isNumberPositive && isNumber;
};

const _isObject = value => {
  return typeof value === "object";
};

const _isString = value => {
  return typeof value === "string";
};

const _isFunction = value => {
  return typeof value === "function";
};

const _isNumberPositiveOrNeutral = value => {
  var isNumber = _isNumber(value);
  if (!isNumber) return false;

  var _isNumberPositive = value < 0;
  return !_isNumberPositive && isNumber;
};

export {
  _isArray,
  _isBoolean,
  _isNullOrUndefined,
  _isNumber,
  _isNumberPositive,
  _isObject,
  _isString,
  _isFunction,
  _isNumberPositiveOrNeutral
};
