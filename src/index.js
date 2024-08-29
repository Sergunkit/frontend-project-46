// устанавливает тип вывода согласно опции
// import makeStylish from './stylish.js';
// import makePlain from './plain.js';
// import makeJson from './json.js';
import makeStylishFormat from './formatters/stylish.js';
import makePlainFormat from './formatters/plain.js';

function output(diff, opt) {
  if (opt === 'stylish') return makeStylishFormat(diff);
  if (opt === 'plain') return makePlainFormat(diff);
  return JSON.stringify(diff);
}

export default output;
