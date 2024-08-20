import parser from './parsers.js';
import compareObj from './compareObj.js';
import formatter from './formatters/index.js';

export default (filepath1, filepath2, format = 'stylish') => {
  const data1 = parser(filepath1);
  const data2 = parser(filepath2);

  const dif = compareObj(data1, data2);
  return formatter(dif, format);
};
