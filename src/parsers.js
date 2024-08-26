// import yaml from 'js-yaml';
// import fs from 'fs';
// import path from 'path';

// function parser(filepath) {
//   const fullPath = (fpath) => (fpath.includes('__fixtures__')
//     ? path.resolve(process.cwd(), fpath)
//     : path.resolve(process.cwd(), (`__fixtures__/${fpath}`))
//   );

//   if (['.yml', '.yaml'].includes(path.extname(fullPath(filepath)))) { // yaml
//     try {
//       return yaml.load(fs.readFileSync(fullPath(filepath), 'utf8'));
//     } catch (err) {
//       console.error(err);
//     }
//   } else if (path.extname(fullPath(filepath)) === '.json') { // json
//     try {
//       return JSON.parse(fs.readFileSync(fullPath(filepath), 'utf8'));
//     } catch (err) {
//       console.error(err);
//     }
//   } else { // txt
//     try {
//       return fs.readFileSync(fullPath(filepath), 'utf8');
//     } catch (err) {
//       console.error(err);
//     }
//   }
//   return NaN;
// }

// export default parser;

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

// export default parser;

import yaml from 'js-yaml';

const parsers = {
  json: JSON.parse,
  yaml: yaml.load,
  yml: yaml.load,
};

export default (data, format) => parsers[format](data);
