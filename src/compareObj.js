import fs from 'fs';
import path from 'path';
import output from './output.js'

const getMap = (filepath) => { // получает путь к файлу выдает содержимое в виде Map
    if (typeof filepath === 'Object') return (new Map(Object.entries(filepath)));
    // если getMap вызывается в рекурсии возвращаем сортированный Map
    const fullPath = path.resolve(filepath); // получаем (проверяем) полный путь к файлу
    try {
        const data = JSON.parse(fs.readFileSync(fullPath, "utf8")); // получаем строку, делаем объект
        return (new Map(Object.entries(data))); // делаем из него карту, возвращаем
        ;
    } catch (err) {
        console.error(err);
    }
};

const compareElem = (key, value1, map1, map2) => { //  поэлементно сравнивает карты
    const value2 = map2.get(key)
    if (!map2.has(key)) {
        return `- ${key}, ${value1}` // если во втором файле нет ключа - возвр. "-"
    };
    if (map1.get(key) === map2.get(key)) {
        map2.delete(key); // удаляем общее значение из второго объекта
        return `  ${key}, ${value1}` // если значения совпадают переписываем пару без знаков
    };
    if ((typeof value1 === 'Object') && (typeof value2 === 'Object')) {
        genDiff(value1, value2); // если значения - объекты - рекурсивно вызываем genDiff
    }
    map2.delete(key); // удаляем общее значение из второго объекта
    return `- ${key}, ${value1},+ ${key}, ${value2}`; // если значения разные возвр. два значения в строке
};

const genDiff = (filepath1, filepath2, option) => {
    const map1 = getMap(filepath1);
    const map2 = getMap(filepath2);
    let diff = new Map();
    for(const [key, value] of map1 ) {
        const pair = compareElem(key, value, map1, map2).split(',')
        if (pair.length > 2) {
            const [x, y, z, u] = pair; // если в строке два занечиния - разделяем на пары
            diff.set(x, y).set(z, u);
        }
        diff.set(...pair);
    };
    for(const [key, value] of map2 ) { diff.set(`+ ${key}`, value) }
    // прибавляем '+' к уникальным ключам 2-го объекта, добавляем в diff
    const sortDiff = new Map([...diff.entries()].sort((a, b) => { // сортировка
        if (a[0].slice(2) === b[0].slice(2)) { return 0 };
        return a[0][2] > b[0][2] ? 1 : -1
    }));
    return output(sortDiff, option);
};

export default genDiff;
