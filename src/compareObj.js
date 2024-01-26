import _ from 'lodash';
import getObj from './parsers.js';
import output from './index.js';

// По 6-му и 8-му пункту замечаний к проекту: примерно такой алгоритм содержало мое первое решение
// проекта. Оно сравнивало два объекта и формировало объект, который потом форматировался, оно было
// написано на циклах for и содержало около пяти рекурсий. Из-за циклов пришлось делать рефакторинг.
// Для рефакторинга была выбрана другая концепция: формирование плоских объектов
// всего с одним рекурсивным проходом, их сравнение и форматирование без рекурсий.
// Получилось, правда, немного сложнее, но я думаю, такого решения больше ни у кого нет.
// Не пррокатило(((

const modify = (obj) => {
  const getFlatObj = (value, path, deep, key) => {
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
  const res = getFlatObj(obj, [], -1).filter((elem) => (!!elem.key))
    .map((elem) => {
      if (elem.path && elem.path.startsWith('.')) {
        const mPath = elem.path.slice(1);
        const item = { ...elem, path: mPath };
        return item;
      }
      return elem;
    });
  return res;
};

const compareArr = (elem, names1, namedArr2) => {
  const di = namedArr2.reduce((acc, el) => {
    if (!(names1.includes(el.key))) {
      return acc.concat({ ...el, value: el.value, diff: 'added' });
    }
    if ((el.key === elem.key) && (el.value === elem.value)) {
      const chldn = _.union(el.chldn, elem.chldn);
      return acc.concat({ ...el, chldn });
    }
    if ((el.key === elem.key)) {
      const chldn = _.union(el.chldn, elem.chldn);
      return acc.concat({ ...el, chldn, diff: [elem.value, el.value] });
    }
    return acc;
  }, []);
  return [di];
};

const makeDiff = (obj1, obj2) => {
  const arr1 = modify(obj1);
  const arr2 = modify(obj2);
  const namedArr2 = arr2.map((el) => (
    { ...el, key: `${el.key}/${el.path}` }
  ));
  const namedArr1 = arr1.map((el) => (
    { ...el, key: `${el.key}/${el.path}` }
  ));
  const names1 = arr1.map((item) => `${item.key}/${item.path}`);
  const names2 = arr2.map((item) => `${item.key}/${item.path}`);
  const dif1 = namedArr1.reduce((acc, elem) => {
    if (!(names2.includes(elem.key))) {
      return acc.concat({ ...elem, diff: 'removed' });
    }
    return acc.concat(compareArr(elem, names1, namedArr2));
  }, []);
  const flattedDif = dif1.flat().filter((el) => !!el);
  const difNames = _.union(flattedDif.map((el) => el.key));
  const dif2 = difNames.map((elt) => {
    const elmt = flattedDif.find((el) => el.key === elt);
    return elmt;
  });
  return dif2.flat();
};

const sortDiff = (arr) => {
  const parents = arr.filter((elem) => elem.path === '');
  const sortedPar = _.sortBy(parents, 'key');
  const sortChild = (par, diff) => {
    const curChldn = _.sortBy(par.chldn);
    const sortedChld = curChldn.reduce((acc, chldName) => {
      const elemOfDif = diff.filter((elt) => {
        const pKey = par.path ? `.${par.key}` : `${par.key}`;
        const chldPath = par.path.concat(pKey);
        return ((elt.key === chldName) && (chldPath === elt.path));
      })[0];
      const elemByName = (par.diff) ? { ...elemOfDif, diff: 'changed' } : elemOfDif;
      if (elemByName.chldn) {
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

const gendiff = (filepath1, filepath2, option = 'stylish') => {
  const obj1 = getObj(filepath1);
  const obj2 = getObj(filepath2);
  const diff = makeDiff(obj1, obj2);
  const dif = diff.map((el) => (
    { ...el, key: el.key.split('/')[0] }
  ));
  const sortedDiff = sortDiff(dif);
  return output(sortedDiff, option);
};

export default gendiff;
