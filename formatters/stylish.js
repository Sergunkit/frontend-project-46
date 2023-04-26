const makeStylish = (dif) => {
  const prevDeep = { deep: 0 }; // объект для хранения глубины вложенности предыд-го эл-та
  const flashBack = {};
  const bracketCount = dif.reduce((acc, el) => { // считаем закрывающие кавычки
    if (el.diff && (el.diff.length > 1) && (el.diff[0] === '[complex value]') && (el.diff[1] === '[complex value]')) {
      return acc + 2;
    }
    if (el.value === '[complex value]') return acc + 1;
    if (el.diff && el.diff.includes('[complex value]')) return acc + 1;
    return acc;
  }, 0);
  const brackets = { bracketCount };

  const bracketCloser = (shiftLeft, eltDeep) => {
    const shftArr = [...Array(shiftLeft).keys()].reverse();
    const endObj = shftArr.reduce((acc, elt) => {
      const shiftRight = ('  ').repeat(eltDeep * 2 + 1);
      return acc.concat(`  ${('    ').repeat(elt)}${shiftRight}}\n`);
    }, '');
    return endObj;
  };

  const innerFunc = (elmt, shift) => { // генерация строк вывода
    const value = (elmt.value === '[complex value]') ? '{' : elmt.value;
    brackets.bracketCount -= (shift > 0) ? shift : 0; // уменьшаем кол-во закрыв-х кавычек
    const bracks = (shift > 0) ? bracketCloser(shift, elmt.deep) : '';
    const tab = bracks + ('  ').repeat(elmt.deep * 2 + 1);
    if (!elmt.diff) return `${tab}  ${elmt.key}: ${value}\n`;
    if (elmt.diff === 'added') return `${tab}+ ${elmt.key}: ${value}\n`;
    if (elmt.diff === 'removed') return `${tab}- ${elmt.key}: ${value}\n`;
    if (elmt.diff === 'changed') return `${tab}  ${elmt.key}: ${value}\n`;
    const value1 = (elmt.diff[0] === '[complex value]') ? '{' : elmt.diff[0];
    const value2 = (elmt.diff[1] === '[complex value]') ? '{' : elmt.diff[1];
    if (elmt.diff[0] === '[complex value]') { // изменился вложенный объект
      flashBack.str = `${tab}+ ${elmt.key}: ${value2}\n`;
      flashBack.deep = elmt.deep;
      flashBack.children = elmt.chldn;
      return `${tab}- ${elmt.key}: ${value1}\n`;
    }
    return `${tab}- ${elmt.key}: ${value1}\n${tab}+ ${elmt.key}: ${value2}\n`;
  };

  const res = dif.reduce((acc, elmt) => { // собирает вывод
    const shift = prevDeep.deep - elmt.deep;
    if (flashBack.deep && (!flashBack.children.includes(elmt.key))) {
      // есть отложенная запись и всех детей перебрали
      flashBack.deep = '';
      flashBack.children = [];
      brackets.bracketCount -= 1;
      prevDeep.deep = elmt.deep;
      return acc.concat(`${bracketCloser(1, prevDeep.deep + 1)}${flashBack.str}${innerFunc(elmt, shift - 1)}`);
    }
    prevDeep.deep = elmt.deep;
    return acc.concat(innerFunc(elmt, shift));
  }, '{\n');
  const stlshDiff = `${res + bracketCloser(brackets.bracketCount, prevDeep.deep - 1)}}`;

  return stlshDiff;
};
export default makeStylish;
