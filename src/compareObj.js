import getObj from './parsers.js';
import { output } from '../formatters/index.js';

const genDiff = (filepath1, filepath2, option = 'stylish') => { // получает два объекта и формирует diff
    const obj1 = getObj(filepath1);
    const obj2 = getObj(filepath2);
    let diff = makeDiff(obj1, obj2);
    diff = addingSpaces(diff);
    return output(diff, option);
};

const makeDiff  = (obj1, obj2, diff) => { // рекурс., вход: вложенные объекты и промежуточный diff
    for(const key in obj1 ) { // итерирует эл-ты первого объекта
        let pair = {};
        pair = compareElem(key, obj1, obj2)
        diff = { ...diff, ...pair };
    };
    for (let key2 in obj2 ) { // добавляется уникальные объекты второго объекта
        const value2 = obj2[key2];
        key2 = `+ ${key2}`;
        diff[key2] = value2;
    };
    diff = [...Object.entries(diff)].sort((a, b) => { // сортировка промежуточного diff-a
        if (a[0].slice(2) === b[0].slice(2)) { return 0 };
        return a[0].slice(2) > b[0].slice(2) ? 1 : -1;
      });
    diff = Object.fromEntries(diff);
    return diff;
};

const compareElem = (key, obj1, obj2) => { //  поэлементно сравнивает объекты
    const value1 = obj1[key];
    const value2 = obj2[key];
    if (!(key in obj2)) {       
        key = `- ${key}`;
        return {[key]: value1}; // если во втором файле нет ключа - возвр. "-"
    };
    if (obj1[key] === obj2[key]) {
        delete obj2[key]; // удаляем общее значение из второго объекта
        key = `  ${key}`;
        return { [key]: value1 }; // если значения совпадают переписываем пару без знаков '+' и '-'
    };
    if ((typeof value1 === 'object') && (typeof value2 === 'object')) {
        delete obj2[key]; // удаляем общее значение из второго объекта
        key = `  ${key}`;
        return  { [key]: makeDiff(value1, value2) };
        // если значения - объекты - рекурсивно вызываем makeDiff
    };
    delete obj2[key]
    let key1 = `- ${key}`;
    let key2 = `+ ${key}`;
    return {[key1]: value1, [key2]: value2}; // если значения разные возвр. два значения
};

const addingSpaces = (obj) => { // добавляет пробелы к вложенным (добавленным /удаленным) ключам
    for (let key in obj) {
        const value = obj[key];
        if ((!(key.startsWith('  ')) && (!(key.startsWith('+ ')) && (!(key.startsWith('- ')))))) {
            delete obj[key];
            key = `  ${key}`;
            obj[key] = value;
        };
        if (typeof value === 'object') {
            obj = {...obj, [key]: addingSpaces(value)};
        };
    };
    return obj;
};

export { genDiff };
