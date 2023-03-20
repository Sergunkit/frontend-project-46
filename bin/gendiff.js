#!/usr/bin/env node

import { program } from 'commander';
import genDiff from '../src/compareObj.js';

program
  .name('gendiff')
  .description('Compares two configuration files and shows a difference.')
  .version('1.0.0')
  .argument('<filepath1>', 'file1')
  .argument('<filepath2>', 'file2')
  .option('-f, --format <type>', 'define output format', 'stylish')
  .action((filepath1, filepath2, option) => { genDiff(filepath1, filepath2, option); });

program.parse(process.argv);
