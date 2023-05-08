import _ from 'lodash';
import getObj from './parsers.js';
import output from '../formatters/index.js';

const modify = (obj) => { // модифицирует объект с вложениями в плоский массив объектов
  const getFlatObj = (value, path, deep, key) => { // вызывается рекурсивно
    const rslt = [];
    if ((typeof value === 'object') && value !== null) {
      const chldn = Object.keys(value);
      const elem = {
        key, value: '[complex value]', chldn, deep, path,
      };
      const re = chldn.reduce((acc, cKey) => {
        const cPath = key ? `${path}.${key}` : '';
        return acc.concat(getFlatObj(value[cKey], cPath, deep + 1, cKey));
      }, []);
      return [...re, elem];
    }
    const elem = {
      key, value, deep, path,
    };
    return [...rslt, elem];
  };
  const res = getFlatObj(obj, [], -1).filter((elem) => (!!elem.key)) // удаление пустых елементов
    .map((elem) => {
      if (elem.path && elem.path.startsWith('.')) { // удаление точек в начале пути
        const mPath = elem.path.slice(1);
        const item = { ...elem, path: mPath };
        return item;
      }
      return elem;
    });
  return res;
};

const compareArr = (elem, names1, namedArr2) => { // сравивает поэлементно массивы
  // const diff2 = [];
  const di = namedArr2.reduce((acc, el) => { // итерируется по второму массиву элемнетов
    if (!(names1.includes(el.key))) {
      // console.log(el.key);
      // names1.push(el.key);
      return acc.concat({ ...el, value: el.value, diff: 'added' });
    }
    if ((el.key === elem.key) && (el.value === elem.value)) { // не изм.
      const chldn = _.union(el.chldn, elem.chldn);
      return acc.concat({ ...el, chldn });
    }
    if ((el.key === elem.key)) { // значение элемента изменилось
      const chldn = _.union(el.chldn, elem.chldn);
      return acc.concat({ ...el, chldn, diff: [elem.value, el.value] });
    }
    // if (el.key === elem.key) { // одинаковый ключ, разные пути
    //   return [...acc, el, elem];
    // }
    return acc;
  }, []);
  // console.log(di, 'ttt');
  return [di];
};

const makeDiff = (obj1, obj2) => { // формирует результат
  const arr1 = modify(obj1); // объект преобразуется в массив
  const arr2 = modify(obj2);
  const namedArr2 = arr2.map((el) => (
    { ...el, key: `${el.key}/${el.path}` }
  ));
  const namedArr1 = arr1.map((el) => (
    { ...el, key: `${el.key}/${el.path}` }
  ));
  const names1 = arr1.map((item) => `${item.key}/${item.path}`);
  const names2 = arr2.map((item) => `${item.key}/${item.path}`);
  const dif1 = namedArr1.reduce((acc, elem) => { // итерация по первому массиву
    if (!(names2.includes(elem.key))) { // если эл-та нет во втором массиве записываем 'removed'
      return acc.concat({ ...elem, diff: 'removed' });
    }
    return acc.concat(compareArr(elem, names1, namedArr2)); // вызов функции, на второй массиив
  }, []);
  const flattedDif = dif1.flat().filter((el) => !!el);
  const difNames = _.union(flattedDif.map((el) => el.key));
  const dif2 = difNames.map((elt) => {
    const elmt = flattedDif.find((el) => el.key === elt);
    return elmt;
  });
  return dif2.flat();
};

const sortDiff = (arr) => { // поуровневая сортировка по ключам
  const parents = arr.filter((elem) => elem.path === '');
  const sortedPar = _.sortBy(parents, 'key'); // делаем и сортируем список корневых эл-тов
  const sortChild = (par, diff) => {
    const curChldn = _.sortBy(par.chldn); // делаем и сортируем список вложений
    const sortedChld = curChldn.reduce((acc, chldName) => { // итерация по вложениям корневых эл.
      const elemOfDif = diff.filter((elt) => { // поиск элемента в массиве по имени влож-го объекта
        const pKey = par.path ? `.${par.key}` : `${par.key}`; // точка перед ключом, если путь есть
        const chldPath = par.path.concat(pKey); // формируем полный путь
        return ((elt.key === chldName) && (chldPath === elt.path));
      })[0];
      const elemByName = (par.diff) ? { ...elemOfDif, diff: 'changed' } : elemOfDif;// если родитель изменен, выделяем вложение
      if (elemByName.chldn) { // если есть вложения, делаем рекурсивный вызов
        return acc.concat([elemByName, ...sortChild(elemByName, arr)]);
      }
      return acc.concat(elemByName);
    }, []);
    return sortedChld;
  };
  const dif = sortedPar.reduce((acc, par) => {
    if (par.chldn) {
      return [...acc, par, ...sortChild(par, arr)];
    }
    return acc.concat(par);
  }, []);
  return dif;
};

const gendiff = (filepath1, filepath2, option = 'stylish') => { // получает два файла и формирует результат
  const obj1 = getObj(filepath1); // из файла формируется объект
  const obj2 = getObj(filepath2);
  const diff = makeDiff(obj1, obj2);
  const dif = diff.map((el) => (
    { ...el, key: el.key.split('/')[0] }
  ));
  const sortedDiff = sortDiff(dif);
  return output(sortedDiff, option);
  // return sortedDiff;
};

// console.log(modify(getObj('./__fixtures__/file3.json')));
// console.log(getObj('./__fixtures__/file4.yaml'));
console.log(gendiff('./__fixtures__/file3.json', './__fixtures__/file4.json', 'stylish'));
export default gendiff;
