import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

function parser(filepath) {
  const fullPath = path.resolve(process.cwd(), filepath);

  if (['.yml', '.yaml'].includes(path.extname(fullPath))) { // yaml
    try {
      return yaml.load(fs.readFileSync(fullPath, 'utf8'));
    } catch (err) {
      console.error(err);
    }
  } else if (path.extname(fullPath) === '.json') { // json
    try {
      return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    } catch (err) {
      console.error(err);
    }
  } else { // txt
    try {
      return fs.readFileSync(fullPath, 'utf8');
    } catch (err) {
      console.error(err);
    }
  }
  return NaN;
}

export default parser;
