import _ from 'lodash';
import getObj from './parsers.js';
import output from '../formatters/index.js';

const modify = (obj) => { // модифицирует объект в плоский массив объектов
  const deep = [0];
  const path = [];
  const getFlatObj = (value, cPath, key) => { // вызывается рекурсивно, записывает свойства в объект
    const res = [];
    if ((typeof (value) === 'object') && value !== null) {
      const chldn = Object.keys(value);
      const elem = {
        key, value: '[complex value]', chldn, deep: deep[0] - 1, path: path[0],
      };
      path[0] = key ? `${cPath}.${key}` : '';
      deep[0] += 1;
      const re = chldn.reduce((acc, cKey) => acc.concat(getFlatObj(value[cKey], path, cKey)), []);
      deep[0] -= 1;
      path[0] = path[0].split('.').slice(0, -1).join('.');
      return [...re, elem];
    }
    const elem = {
      key, value, deep: deep[0] - 1, path: path[0],
    };
    return [...res, elem];
  };
  const res = getFlatObj(obj, path).filter((elem) => (!!elem.key)) // удаление пустых елементов
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
  const diff2 = [];
  const di = namedArr2.reduce((acc, el) => { // итерируется по второму массиву элемнетов
    if (!(names1.includes(el.key))) { // если ключа нет в первом массиве имён, записываем 'added'
      names1.push(el.key); // добавляем ключ в первый массив, чтоб ключ не срабатывал на след. шагах
      return acc.concat({ ...el, value: el.value, diff: 'added' });
    }
    if ((el.key === elem.key) && (el.value === elem.value) && (el.path === elem.path)) { // не изм.
      const chldn = _.union(el.chldn, elem.chldn);
      return acc.concat({ ...el, chldn });
    }
    if ((el.key === elem.key) && (el.path === elem.path)) { // значение элемента изменилось
      const chldn = _.union(el.chldn, elem.chldn);
      return acc.concat({ ...el, chldn, diff: [elem.value, el.value] });
    }
    if (el.key === elem.key) { // одинаковый ключ, разные пути
      return [...acc, el, elem];
    }
    return acc;
  }, []);
  return [...diff2, di];
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
  const dif2 = namedArr2.filter((elt) => {
    const namesDif1 = dif1.map((el) => el.key);
    return (!namesDif1.includes(elt.key));
  });
  // const dif = [...dif1, ...dif2];
  // console.log(dif);
  return dif1.flat().filter((el) => !!el);
};

const sortDiff = (arr) => { // поуровневая сортировка по ключам
  const parents = arr.filter((elem) => elem.path === '');
  const sortedPar = _.sortBy(parents, 'key'); // делаем и сортируем список корневых эл-тов
  const sortChild = (par, diff) => {
    const curChldn = _.sortBy(par.chldn); // делаем и сортируем список вложений
    const sortedChld = curChldn.reduce((acc, chldName) => { // итерация по вложениям корневых эл.
      const elemByName = diff.filter((elt) => { // поиск элемента в массиве по имени ребенка
        // const name = elt.key.split('/')[0];
        const pKey = par.path ? `.${par.key}` : `${par.key}`; // точка перед ключом, если путь есть
        const chldPath = par.path.concat(pKey); // формируем полный путь
        return ((elt.key === chldName) && (chldPath === elt.path));
      })[0];
      if (par.diff) { elemByName.diff = 'changed'; } // если родитель изменен, выделяем вложение
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

// console.log(modify(getObj('./__fixtures__/file5.json')));
// console.log(getObj('./__fixtures__/file4.yaml'));
console.log(gendiff('./__fixtures__/file5.json', './__fixtures__/file6.json', 'stylish'));
export default gendiff;
