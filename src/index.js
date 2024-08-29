import output from './formatters/index.js';
import getObj from './parsers.js';
import compareObj from './compareObj.js';

const gendiff = (filepath1, filepath2, option = 'stylish') => {
  const obj1 = getObj(filepath1);
  const obj2 = getObj(filepath2);
  const diff = {
    type: 'root',
    children: compareObj(obj1, obj2),
  };
  return output(diff, option);
};

export default gendiff;
