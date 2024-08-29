import makeStylishFormat from './stylish.js';
import makePlainFormat from './plain.js';

function output(diff, opt) {
  if (opt === 'stylish') return makeStylishFormat(diff);
  if (opt === 'plain') return makePlainFormat(diff);
  return JSON.stringify(diff);
}

export default output;
