import genDiff from '../src/compareObj.js'
import { fileURLToPath } from 'url';
import path from 'path';
import { dirname } from 'path';
import { makeStylish } from '../src/output.js';
import readFile from '../src/parsers.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const makeTestString = (filePath) => {
  let fixtureFile = readFile(getFixturePath(filePath));
  fixtureFile = makeStylish(fixtureFile);
  return fixtureFile
};

test('FlatFile gendiff check', () => {
  expect(genDiff(getFixturePath('file1.json'), getFixturePath('file2.json'))).toEqual(makeTestString('output_12.json'));
  expect(genDiff(getFixturePath('file1.yaml'), getFixturePath('file2.yaml'))).toEqual(makeTestString('output_12.json'));
});

test('TreeFile gendiff chek', () => {
  expect(genDiff(getFixturePath('file3.json'), getFixturePath('file4.json'))).toEqual(makeTestString('output_34.json'));
  expect(genDiff(getFixturePath('file3.yaml'), getFixturePath('file4.yaml'))).toEqual(makeTestString('output_34.json'));

});

test('json-string modifying', () => {
  const output = '{\n\
    - follow: false\n\
      host: hexlet.io\n\
    - proxy: 123.234.53.22\n\
    - timeout: 50\n\
    + timeout: 20\n\
    + verbose: true\n\
    }';
  expect(makeTestString('output_12.json')).toEqual(output);
});
