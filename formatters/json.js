const makeStylish = (dif) => {
  const bracketCloser = (shiftElmt) => {
    const bracks = (shiftElmt >= 1) ? ('}').concat(bracketCloser(shiftElmt - 1)) : '';
    return bracks;
  };

  const innerFunc = (elmt, index, arr) => { // генерация строк вывода
    // const nextElDeep = (arr[index + 1]) ? arr[index + 1].deep : 0;
    const shift = (arr[index + 1]) ? (elmt.deep - arr[index + 1].deep) : 0;
    const preValue = (typeof elmt.value === 'string') ? `"${elmt.value}"` : elmt.value;
    const value = (preValue === '"[complex value]"') ? '{' : preValue;
    const bracks = (shift > 0) ? bracketCloser(shift) : '';
    // console.log(shift);
    // const tab = ('  ').repeat(elmt.deep * 2 + 1);

    const insertChldn = (ar, elem) => {
      const chldrn = ar.reduce((acc, el) => {
        if (elem.chldn.includes(el.key) && (el.path.split('.').slice(0, -1).join('.') === elem.path)) {
          return acc.concat(innerFunc(el, index, arr));
        }
        return acc;
      }, '');
      return chldrn;
    };

    if (!elmt.diff) return `"  ${elmt.key}":${value}${bracks},`;
    if (elmt.diff === 'added') return `"+ ${elmt.key}":${value}${bracks},`;
    if (elmt.diff === 'removed') return `"- ${elmt.key}":${value}${bracks},`;
    if (elmt.diff === 'changed') return `"  ${elmt.key}":${value}${bracks},`;
    const preValue1 = (typeof elmt.diff[0] === 'string') ? `"${elmt.diff[0]}"` : elmt.diff[0];
    const value1 = (preValue1 === '"[complex value]"') ? '{' : `${preValue1},`;
    const preValue2 = (typeof elmt.diff[1] === 'string') ? `"${elmt.diff[1]}"` : elmt.diff[1];
    const value2 = (preValue2 === '"[complex value]"') ? '{' : `${preValue2},`;
    if (preValue1 === '"[complex value]"') { // изменился вложенный объект
      const chldCount = elmt.chldn.length;
      const shift1 = 1;
      const secondPart = `"+ ${elmt.key}":${value2}}${bracketCloser(shift1)}${chldCount}`;
      return `"- ${elmt.key}":${value1},${insertChldn(arr, elmt)}${bracketCloser(shift1)}${secondPart}`;
    }
    return `"- ${elmt.key}":${value1}"+ ${elmt.key}":${value2}${bracks}`;
  };

  const res = dif.reduce((acc, elmt, index, arr) => { // собирает вывод
    const lastPos = Number(acc.split('}').slice(-1).join(''));
    const str = acc.split('}').slice(0, -1).join('}');
    if (lastPos > 0) {
      const newCount = (lastPos > 1) ? (lastPos - 1) : '';
      return str.concat(`${newCount}`);
    }
    return acc.concat(innerFunc(elmt, index, arr));
  }, '[{');

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
  const stlshDiff = `${res + bracketCloser(finishBrackets, 0)}}]`;
  const stringOut1 = stlshDiff.replace(/{,/g, '{');
  const stringOut2 = stringOut1.replace(/,}/g, '}');
  const stilDiff = stringOut2.replace(/}"/g, '},"');
  return stilDiff;
};
export default makeStylish;
