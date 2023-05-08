const makeStylish = (dif) => {
  const bracketCloser = (shiftElmt, eltDeep) => {
    const shiftRight = (shiftElmt >= 0) ? `${('    ').repeat(shiftElmt)}${('    ').repeat(eltDeep)}}\n` : '';
    const bracks = (shiftElmt >= 1) ? (`${shiftRight}`).concat(bracketCloser(shiftElmt - 1, eltDeep)) : '';
    return bracks;
  };

  const innerFunc = (elmt, index, arr) => { // генерация строк вывода
    const nextElDeep = (arr[index + 1]) ? arr[index + 1].deep : 0;
    const shift = (arr[index + 1]) ? (elmt.deep - arr[index + 1].deep) : 0;
    const value = (elmt.value === '[complex value]') ? '{' : elmt.value;
    const bracks = (shift > 0) ? bracketCloser(shift, nextElDeep) : '';
    const tab = ('  ').repeat(elmt.deep * 2 + 1);

    const insertChldn = (ar, elem) => {
      const chldrn = ar.reduce((acc, el) => {
        if (elem.chldn.includes(el.key) && (el.path.split('.').slice(0, -1).join('.') === elem.path)) {
          return acc.concat(innerFunc(el, index, arr));
        }
        return acc;
      }, '');
      return chldrn;
    };

    if (!elmt.diff) return `${tab}  ${elmt.key}: ${value}\n${bracks}`;
    if (elmt.diff === 'added') return `${tab}+ ${elmt.key}: ${value}\n${bracks}`;
    if (elmt.diff === 'removed') return `${tab}- ${elmt.key}: ${value}\n${bracks}`;
    if (elmt.diff === 'changed') return `${tab}  ${elmt.key}: ${value}\n${bracks}`;
    const value1 = (elmt.diff[0] === '[complex value]') ? '{' : elmt.diff[0];
    const value2 = (elmt.diff[1] === '[complex value]') ? '{' : elmt.diff[1];
    if (elmt.diff[0] === '[complex value]') { // изменился вложенный объект
      const chldCount = elmt.chldn.length;
      const shift1 = 1;
      const secondPart = `${tab}+ ${elmt.key}: ${value2}\n${bracketCloser(shift1, arr[index + 1 + chldCount].deep)}${chldCount}`;
      return `${tab}- ${elmt.key}: ${value1}\n${insertChldn(arr, elmt)}${bracketCloser(shift1, elmt.deep)}${secondPart}`;
    }
    return `${tab}- ${elmt.key}: ${value1}\n${tab}+ ${elmt.key}: ${value2}\n${bracks}`;
  };

  const res = dif.reduce((acc, elmt, index, arr) => { // собирает вывод
    const lastPos = Number(acc.split('\n').slice(-1).join(''));
    const str = acc.split('\n').slice(0, -1).join('\n');
    if (lastPos > 0) {
      const newCount = (lastPos > 1) ? (lastPos - 1) : '';
      return str.concat(`${newCount}\n`);
    }
    return acc.concat(innerFunc(elmt, index, arr));
  }, '{\n');

  const bracketCount = dif.reduce((acc, el) => { // считаем закрывающие скобки
    if (el.diff && (el.diff.length > 1) && (el.diff[0] === '[complex value]') && (el.diff[1] === '[complex value]')) {
      return acc + 2;
    }
    if (el.value === '[complex value]') return acc + 1;
    if (el.diff && el.diff.includes('[complex value]')) return acc + 1;
    return acc;
  }, 0);

  const countCloseBrackets = res.split('').reduce((count, el) => { // считаем незакрытые скобки
    if (el === '}') {
      const newCount = count + 1;
      return newCount;
    }
    return count;
  }, 0);

  const finishBrackets = bracketCount - countCloseBrackets;
  const stlshDiff = `${res + bracketCloser(finishBrackets, 0)}}`;

  return stlshDiff;
};
export default makeStylish;
