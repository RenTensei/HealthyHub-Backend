/* eslint-disable no-param-reassign */
const parseStringPropsToNums = obj =>
  Object.keys(obj).reduce((parsedObj, prop) => {
    parsedObj[prop] =
      typeof obj[prop] === 'string' && !Number.isNaN(Number(obj[prop]))
        ? Number(obj[prop])
        : obj[prop];
    return parsedObj;
  }, {});

module.exports = parseStringPropsToNums;
