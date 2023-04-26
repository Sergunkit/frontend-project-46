import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import readFile from '../src/parsers.js';
import genDiff from '../src/compareObj.js';
import output34 from '../__fixtures__/output_34.js';
import output12 from '../__fixtures__/output_12.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const makePlainTestString = (filePath) => {
  const str = readFile(getFixturePath(filePath));
  return str;
};

const makeJsonTestString = (filePath) => {
  const str = `[${JSON.stringify(readFile(getFixturePath(filePath)))}]`;
  return str;
};

test('FlatFile gendiff check', () => {
  expect(genDiff(getFixturePath('file1.json'), getFixturePath('file2.json'))).toEqual(output12);
  expect(genDiff(getFixturePath('file1.yaml'), getFixturePath('file2.yaml'))).toEqual(output12);
});

test('TreeFile gendiff check', () => {
  expect(genDiff(getFixturePath('file3.json'), getFixturePath('file4.json'))).toEqual(output34);
  expect(genDiff(getFixturePath('file3.yaml'), getFixturePath('file4.yaml'))).toEqual(output34);
});

test('Plain formatter check', () => {
  expect(genDiff(getFixturePath('file3.json'), getFixturePath('file4.json'), 'plain')).toEqual(makePlainTestString('output_34_plain'));
});

test('JSON formatter check', () => {
  // console.log(readFile('./__fixtures__/output_56'));
  expect(genDiff(getFixturePath('file3.json'), getFixturePath('file4.json'), 'json')).toEqual(makeJsonTestString('output_34.json'));
});

test('hexlet test', () => {
  expect(genDiff(getFixturePath('file5.json'), getFixturePath('file6.json'), 'stylish')).toEqual(readFile('./__fixtures__/output_56'));
});
