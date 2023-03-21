import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import makeStylish from '../formatters/stylish.js';
import readFile from '../src/parsers.js';
import genDiff from '../src/compareObj.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const makeTestString = (filePath) => {
  let fixtureFile = readFile(getFixturePath(filePath));
  fixtureFile = makeStylish(fixtureFile);
  return fixtureFile;
};

const makePlainTestString = (filePath) => {
  const str = readFile(getFixturePath(filePath));
  return str;
};

const makeJsonTestString = (filePath) => {
  const str = `[${JSON.stringify(readFile(getFixturePath(filePath)))}]`;
  return str;
};

test('FlatFile gendiff check', () => {
  expect(genDiff(getFixturePath('file1.json'), getFixturePath('file2.json'))).toEqual(makeTestString('output_12.json'));
  expect(genDiff(getFixturePath('file1.yaml'), getFixturePath('file2.yaml'))).toEqual(makeTestString('output_12.json'));
});

test('TreeFile gendiff check', () => {
  expect(genDiff(getFixturePath('file3.json'), getFixturePath('file4.json'))).toEqual(makeTestString('output_34.json'));
  expect(genDiff(getFixturePath('file3.yaml'), getFixturePath('file4.yaml'))).toEqual(makeTestString('output_34.json'));
});

test('Plain formatter check', () => {
  expect(genDiff(getFixturePath('file3.json'), getFixturePath('file4.json'), 'plain')).toEqual(makePlainTestString('output_34_plain'));
});

test('JSON formatter check', () => {
  expect(genDiff(getFixturePath('file3.json'), getFixturePath('file4.json'), 'json')).toEqual(makeJsonTestString('output_34.json'));
});

test('json-string modifying', () => {
  const output = '{\n    - follow: false\n      host: hexlet.io\n    - proxy: 123.234.53.22\n    - timeout: 50\n    + timeout: 20\n    + verbose: true\n    }';
  expect(makeTestString('output_12.json')).toEqual(output);
});
