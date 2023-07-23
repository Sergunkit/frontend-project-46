// устанавливает тип вывода согласно опции
import makeStylish from './stylish.js';
import makePlain from './plain.js';
import makeJson from './json.js';

function output(diff, opt) {
  if (opt === 'stylish') return makeStylish(diff);
  if (opt === 'plain') return makePlain(diff);
  return makeJson(diff);
}

export default output;
