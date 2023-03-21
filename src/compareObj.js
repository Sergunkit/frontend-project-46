import getObj from './parsers.js';
import output from '../formatters/index.js';

const makeDiff = (obj1, obj2, diff) => { // рекурс., вход: вложенные объекты и промежуточный diff
  // eslint-disable-next-line no-restricted-syntax
  for (const key of Object.keys(obj1)) { // итерирует эл-ты первого объекта
    let pair = {};
    // eslint-disable-next-line no-use-before-define
    pair = compareElem(key, obj1, obj2);
    // eslint-disable-next-line no-param-reassign
    diff = { ...diff, ...pair };
  }
  // eslint-disable-next-line no-restricted-syntax, guard-for-in
  for (let key2 in obj2) { // добавляется уникальные объекты второго объекта
    const value2 = obj2[key2];
    key2 = `+ ${key2}`;
    // eslint-disable-next-line no-param-reassign
    diff[key2] = value2;
  }
  // eslint-disable-next-line no-param-reassign
  diff = [...Object.entries(diff)].sort((a, b) => { // сортировка промежуточного diff-a
    if (a[0].slice(2) === b[0].slice(2)) { return 0; }
    return a[0].slice(2) > b[0].slice(2) ? 1 : -1;
  });
  // eslint-disable-next-line no-param-reassign
  diff = Object.fromEntries(diff);
  return diff;
};

const compareElem = (key, obj1, obj2) => { //  поэлементно сравнивает объекты
  const value1 = obj1[key];
  const value2 = obj2[key];
  if (!(key in obj2)) {
    const currentKey = `- ${key}`;
    return { [currentKey]: value1 }; // если во втором файле нет ключа - возвр. "-"
  }
  if (obj1[key] === obj2[key]) {
    // eslint-disable-next-line no-param-reassign
    delete obj2[key]; // удаляем общее значение из второго объекта
    const currentKey = `  ${key}`;
    return { [currentKey]: value1 }; // значения совпадают - переписываем пару без знаков '+' и '-'
  }
  if ((typeof value1 === 'object') && (typeof value2 === 'object')) {
    // eslint-disable-next-line no-param-reassign
    delete obj2[key]; // удаляем общее значение из второго объекта
    const currentKey = `  ${key}`;
    return { [currentKey]: makeDiff(value1, value2) };
    // если значения - объекты - рекурсивно вызываем makeDiff
  }
  // eslint-disable-next-line no-param-reassign
  delete obj2[key];
  const key1 = `- ${key}`;
  const key2 = `+ ${key}`;
  return { [key1]: value1, [key2]: value2 }; // если значения разные возвр. два значения
};

const addingSpaces = (obj) => { // добавляет пробелы к вложенным (добавленным /удаленным) ключам
  // eslint-disable-next-line no-restricted-syntax, guard-for-in
  for (let key in obj) {
    const value = obj[key];
    if ((!(key.startsWith('  ')) && (!(key.startsWith('+ ')) && (!(key.startsWith('- ')))))) {
      // eslint-disable-next-line no-param-reassign
      delete obj[key];
      key = `  ${key}`;
      // eslint-disable-next-line no-param-reassign
      obj[key] = value;
    }
    if (typeof value === 'object') {
      // eslint-disable-next-line no-param-reassign
      obj = { ...obj, [key]: addingSpaces(value) };
    }
  }
  return obj;
};

const gendiff = (filepath1, filepath2, option = 'stylish') => { // получает два объекта и формирует diff
  const obj1 = getObj(filepath1);
  const obj2 = getObj(filepath2);
  let diff = makeDiff(obj1, obj2);
  diff = addingSpaces(diff);
  return output(diff, option);
};

export default gendiff;
