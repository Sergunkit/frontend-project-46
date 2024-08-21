import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

function parser(filepath) {
  const fullPath = (fpath) => (fpath.includes('__fixtures__')
    ? path.resolve(process.cwd(), fpath)
    : path.resolve(process.cwd(), (`__fixtures__/${fpath}`))
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
