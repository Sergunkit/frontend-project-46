import _ from 'lodash';

const makePlain = (diff) => {
  const plndDif = diff.filter((el) => _.has(el, 'diff'))
    .reduce((acc, el) => {
      const el0 = (typeof el.diff[0] === 'string') && (el.diff[0] !== '[complex value]') ? `'${el.diff[0]}'` : el.diff[0];
      const el1 = (typeof el.diff[1] === 'string') && (el.diff[1] !== '[complex value]') ? `'${el.diff[1]}'` : el.diff[1];
      const value = (typeof el.value === 'string') && (el.value !== '[complex value]') ? `'${el.value}'` : el.value;
      const path = (el.path) ? `${el.path}.${el.key}` : el.key;
      switch (el.diff) {
        case 'added':
          return (
            acc.concat(`Property '${path}' was added with value: ${value}\n`)
          );
        case 'removed':
          return (
            acc.concat(`Property '${path}' was removed\n`)
          );
        case 'changed':
          return acc;
        default:
          return (
            acc.concat(`Property '${path}' was updated. From ${el0} to ${el1}\n`)
          );
      }
    }, '');
  const arr = plndDif.split('\n');
  const mArr = arr.slice(0, arr.length - 1);
  const plainDiff = mArr.join('\n');
  return plainDiff;
};
export default makePlain;
