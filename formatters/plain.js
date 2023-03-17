const comparator = (keyPath, res, diff) => { // сравивает между собой смежные элементы диффа
  let flag; // хранит полный путь ключа элемента до следующей итерации для  сравнения
  let lastValue = ''; // хранит значение "-"го элемента до след-й итерации
  for (const key in diff) {
    let lastKeyPath = keyPath; // записываем предыдущий ключ в полный путь
    let value = diff[key];
    keyPath = key.slice(2); // записываем новый ключ

    if (keyPath === flag) { // проверка на
      res = deleteLastRec(res, '\n');
      value = conformValue(value);
      res += `\nProperty '${lastKeyPath}.${keyPath}' was updated. From ${lastValue} to ${value}\n`;
      keyPath = lastKeyPath;
      continue;
    }
    if (key[0] === '-') { // проверка на "-"
      res += `Property '${lastKeyPath}.${keyPath}' was removed\n`;
      flag = keyPath;
      value = conformValue(value);
      lastValue = value;
    }
    if (key[0] === '+') { // проверка на "+"
      value = conformValue(value);
      res += `Property '${lastKeyPath}.${keyPath}' was added with value: ${value}\n`;
    }
    if ((key[0] === ' ') && (typeof value === 'object')) { // проверка на вложенность в неизмен-х ключах
      lastKeyPath += `.${keyPath}`;
      res = comparator(lastKeyPath, res, value);
      lastKeyPath = deleteLastRec(lastKeyPath, '.');
    }
    keyPath = lastKeyPath;
  }
  return res;
};

const deleteLastRec = (str, sep) => { // удаляет последюю запись из строки
  const arr = str.split(sep);
  const shift = (sep === '.') ? 1 : 2;
  arr.splice(arr.length - shift);
  str = arr.join(sep);
  return str;
};

const conformValue = (value) => { // форматирует значение в зависимости от типа
  if (typeof value === 'string') { value = `'${value}'`; }
  if ((typeof value === 'object') && (value !== null)) { value = '[complex value]'; }
  return value;
};

const makePlain = (diff) => { // опред-т переменные и вызывает рукурсивную comparator
  const res = '';
  const keyPath = '';
  let plainDiff = comparator(keyPath, res, diff);
  plainDiff = plainDiff.replace(/y './g, "y '");
  return plainDiff;
};

export default makePlain;
