// устанавливает тип вывода согласно опции
// import makeStylish from './stylish.js';
// import makePlain from './plain.js';
// import makeJson from './json.js';

// function output(diff, opt) {
//   if (opt === 'stylish') return makeStylish(diff);
//   if (opt === 'plain') return makePlain(diff);
//   return makeJson(diff);
// }

// export default output;  МОЕ




import path from 'node:path';
import fs from 'fs';
import parse from './parsers.js';
import buildAst from './buildAST.js';
import formatter from './formatters/index.js'; // parsers.js и index.js помнять местами?
// после проверки в тестах
const resolvePath = (filepath) => (filepath.includes('__fixtures__') // добавляет __fixtures__
  ? path.resolve(process.cwd(), filepath)
  : path.resolve(process.cwd(), (`__fixtures__/${filepath}`))
);

const extractFormat = (filepath) => path.extname(filepath).slice(1); // достает расширение файла

const getData = (filepath) => parse(fs.readFileSync(filepath, 'utf-8'), extractFormat(filepath)); // вынимает парсит данные
// export default (data, format) => parsers[format](data) (это parse)

export default (filepath1, filepath2, format = 'stylish') => {
  const path1 = resolvePath(filepath1);
  const path2 = resolvePath(filepath2);

  const data1 = getData(resolvePath(path1));
  const data2 = getData(resolvePath(path2));

  const ast = buildAst(data1, data2);
  return formatter(ast, format);
};  // не модифицированно по Сизову из src/index.js





// import yaml from 'js-yaml';
// import fs from 'fs';
// import path from 'path';

// function parser(filepath) {
//   const fullPath = path.resolve(process.cwd(), filepath);
//   if (['.yml', '.yaml'].includes(path.extname(fullPath))) {
//     try { // yaml
//       return yaml.load(fs.readFileSync(fullPath, 'utf8'));
//     } catch (err) {
//       console.error(err);
//     }
//   } else if (path.extname(fullPath) === '.json') {
//     try { // json
//       return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
//     } catch (err) {
//       console.error(err);
//     }
//   } else {
//     try { // txt
//       return fs.readFileSync(fullPath, 'utf8');
//     } catch (err) {
//       console.error(err);
//     }
//   }
//   return NaN;
// }

// export default parser;  МОЕ из parsers.js