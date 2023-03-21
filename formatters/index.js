// устанавливает тип вывода согласно опции
import makeStylish from './stylish.js';
import makePlain from './plain.js';

function output(diff, option) {
  const opt = (typeof option === 'object') ? option.format : option;
  if (opt === 'stylish') return makeStylish(diff);
  if (opt === 'plain') return makePlain(diff);
  // console.log(`[${JSON.stringify(diff)}]`);
  return `[${JSON.stringify(diff)}]`;
}

export default output;
