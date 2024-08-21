import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

function parser(filepath) {
  const fullPath = (filepath) => (filepath.includes('__fixtures__')
   ? path.resolve(process.cwd(), filepath)
   : path.resolve(process.cwd(), (`__fixtures__/${filepath}`))
  );

  if (['.yml', '.yaml'].includes(path.extname(fullPath(filepath)))) { // yaml
    try {
      return yaml.load(fs.readFileSync(fullPath(filepath), 'utf8'));
    } catch (err) {
      console.error(err);
    }
  } else if (path.extname(fullPath(filepath)) === '.json') { // json
    try {
      return JSON.parse(fs.readFileSync(fullPath(filepath), 'utf8'));
    } catch (err) {
      console.error(err);
    }
  } else { // txt
    try {
      return fs.readFileSync(fullPath(filepath), 'utf8');
    } catch (err) {
      console.error(err);
    }
  }
  return NaN;
}

export default parser;

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