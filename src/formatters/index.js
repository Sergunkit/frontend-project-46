import makeStylishFormat from './stylish.js';
import makePlainFormat from './plain.js';

export default (tree, format) => {
  switch (format) {
    case 'stylish':
      return makeStylishFormat(tree);
    case 'plain':
      return makePlainFormat(tree);
    case 'json':
      return JSON.stringify(tree);
    default:
      throw new Error(`Unknown format '${format}'`);
  }
};
