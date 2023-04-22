/* eslint-disable prefer-destructuring */
const makeJson = (dif) => {
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

  const innerFunc = (elmt, shift) => { // генерация строк вывода
    const value = `${elmt.value},`;
    const value0 = ((elmt.diff) && (elmt.diff.length > 1)) ? `${elmt.diff[0]},` : 0;
    const value1 = ((elmt.diff) && (elmt.diff.length > 1)) ? `${elmt.diff[1]},` : 1;
    const items = { value, value0, value1 };
    if (typeof elmt.value === 'string') { items.value = `"${elmt.value}",`; }
    if (elmt.value === '[complex value]') { items.value = '{'; }
    items.key = `${elmt.key}`;
    brackets.bracketCount -= (shift > 0) ? shift : 0; // уменьшаем кол-во закрыв-х кавычек
    const bracks = (shift > 0) ? ('}').repeat(shift) : '';
    if (!elmt.diff) return `${bracks}"  ${items.key}":${items.value}`;
    if (elmt.diff === 'added') return `${bracks}"+ ${items.key}":${items.value}`;
    if (elmt.diff === 'removed') return `${bracks}"- ${items.key}":${items.value}`;
    if (elmt.diff === 'changed') return `${bracks}"  ${items.key}":${items.value}`;
    // если знанеие элемента изменилось
    if (typeof elmt.diff[1] === 'string') { items.value1 = `"${elmt.diff[1]}",`; }
    if (elmt.diff[1] === '[complex value]') { items.value1 = '{'; }
    if (typeof elmt.diff[0] === 'string') { items.value0 = `"${elmt.diff[0]}",`; }
    if (elmt.diff[0] === '[complex value]') {
      items.value0 = '{'; // изменился вложенный объект
      flashBack.str = `${bracks}"+ ${items.key}":${items.value1}`;
      flashBack.deep = elmt.deep;
      flashBack.children = elmt.chldn;
      return `${bracks}"- ${items.key}":${items.value0}`;
    }
    return `${bracks}"- ${items.key}":${items.value0}${bracks}"+ ${items.key}":${items.value1}`;
  };

  const res = dif.reduce((acc, elmt) => { // собирает вывод
    const shift = prevDeep.deep - elmt.deep;
    if (flashBack.deep && (!flashBack.children.includes(elmt.key))) {
      // есть отложенная запись и всех детей перебрали
      flashBack.deep = '';
      flashBack.children = [];
      brackets.bracketCount -= 1;
      prevDeep.deep = elmt.deep;
      return acc.concat(`}${flashBack.str}${innerFunc(elmt, shift - 1)}`);
    }
    prevDeep.deep = elmt.deep;
    return acc.concat(innerFunc(elmt, shift));
  }, '[{');

  const stringOut = `${res + ('}').repeat(brackets.bracketCount)}}]`;
  const stringOut1 = stringOut.replace(/,}/g, '}');
  const jsonDiff = stringOut1.replace(/}"/g, '},"');
  return jsonDiff;
};
export default makeJson;
