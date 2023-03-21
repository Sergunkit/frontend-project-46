const comparator = (keyPath, res, diff) => { // сравивает между собой смежные элементы диффа
  let flag; // хранит полный путь ключа элемента до следующей итерации для  сравнения
  let lastValue = ''; // хранит значение "-"го элемента до след-й итерации
  // eslint-disable-next-line no-restricted-syntax, guard-for-in
  for (const key in diff) {
    let lastKeyPath = keyPath; // записываем предыдущий ключ в полный путь
    let value = diff[key];
    // eslint-disable-next-line no-param-reassign
    keyPath = key.slice(2); // записываем новый ключ

    if (keyPath === flag) { // проверка на
      // eslint-disable-next-line no-use-before-define, no-param-reassign
      res = deleteLastRec(res, '\n');
      // eslint-disable-next-line no-use-before-define
      value = conformValue(value);
      // eslint-disable-next-line no-param-reassign
      res += `\nProperty '${lastKeyPath}.${keyPath}' was updated. From ${lastValue} to ${value}\n`;
      // eslint-disable-next-line no-param-reassign
      keyPath = lastKeyPath;
      // eslint-disable-next-line no-continue
      continue;
    }
    if (key[0] === '-') { // проверка на "-"
      // eslint-disable-next-line no-param-reassign
      res += `Property '${lastKeyPath}.${keyPath}' was removed\n`;
      flag = keyPath;
      // eslint-disable-next-line no-use-before-define
      value = conformValue(value);
      lastValue = value;
    }
    if (key[0] === '+') { // проверка на "+"
      // eslint-disable-next-line no-use-before-define
      value = conformValue(value);
      // eslint-disable-next-line no-param-reassign
      res += `Property '${lastKeyPath}.${keyPath}' was added with value: ${value}\n`;
    }
    if ((key[0] === ' ') && (typeof value === 'object')) { // проверка на вложенность в неизмен-х ключах
      lastKeyPath += `.${keyPath}`;
      // eslint-disable-next-line no-param-reassign
      res = comparator(lastKeyPath, res, value);
      // eslint-disable-next-line no-use-before-define
      lastKeyPath = deleteLastRec(lastKeyPath, '.');
    }
    // eslint-disable-next-line no-param-reassign
    keyPath = lastKeyPath;
  }
  return res;
};

const deleteLastRec = (str, sep) => { // удаляет последюю запись из строки
  const arr = str.split(sep);
  const shift = (sep === '.') ? 1 : 2;
  arr.splice(arr.length - shift);
  // eslint-disable-next-line no-param-reassign
  str = arr.join(sep);
  return str;
};

const conformValue = (value) => { // форматирует значение в зависимости от типа
  // eslint-disable-next-line no-param-reassign
  if (typeof value === 'string') { value = `'${value}'`; }
  // eslint-disable-next-line no-param-reassign
  if ((typeof value === 'object') && (value !== null)) { value = '[complex value]'; }
  return value;
};

const makePlain = (diff) => { // опред-т переменные и вызывает рукурсивную comparator
  const res = '';
  const keyPath = '';
  let plainDiff = comparator(keyPath, res, diff);
  plainDiff = plainDiff.replace(/y './g, "y '");
  // console.log(plainDiff);
  return plainDiff;
};

export default makePlain;
