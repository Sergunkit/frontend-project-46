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



// import path from 'node:path';
// import fs from 'fs';
// import parse from './parsers.js';
// import buildAst from './buildAST.js';
// import formatter from './formatters/index.js';

// const resolvePath = (filepath) => (filepath.includes('__fixtures__')
//   ? path.resolve(process.cwd(), filepath)
//   : path.resolve(process.cwd(), (`__fixtures__/${filepath}`))
// );

// const extractFormat = (filepath) => path.extname(filepath).slice(1);

// const getData = (filepath) => parse(fs.readFileSync(filepath, 'utf-8'), extractFormat(filepath));

// export default (filepath1, filepath2, format = 'stylish') => {
//   const path1 = resolvePath(filepath1);
//   const path2 = resolvePath(filepath2);

//   const data1 = getData(resolvePath(path1));
//   const data2 = getData(resolvePath(path2));

//   const ast = buildAst(data1, data2);
//   return formatter(ast, format);
// };
