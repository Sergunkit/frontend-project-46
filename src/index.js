import parser from './parsers.js';
import compareObj from './compareObj.js';
import formatter from './formatters/index.js';

// export default (filepath1, filepath2, format = 'stylish') => {
//   const data1 = parser(filepath1);
//   const data2 = parser(filepath2);
//   const dif = compareObj(data1, data2);
//   return formatter(dif, format);
// };

import path from 'node:path';
import fs from 'fs';
// import parse from './parsers.js';
// import buildAst from './buildAST.js';
// import formatter from './formatters/index.js';

const resolvePath = (filepath) => (filepath.includes('__fixtures__')
  ? path.resolve(process.cwd(), filepath)
  : path.resolve(process.cwd(), (`__fixtures__/${filepath}`))
);

const extractFormat = (filepath) => path.extname(filepath).slice(1);

const getData = (filepath) => parser(fs.readFileSync(filepath, 'utf-8'), extractFormat(filepath));

export default (filepath1, filepath2, format = 'stylish') => {
  const path1 = resolvePath(filepath1);
  const path2 = resolvePath(filepath2);

  const data1 = getData(resolvePath(path1));
  const data2 = getData(resolvePath(path2));

  const ast = compareObj(data1, data2);
  return formatter(ast, format);
};
