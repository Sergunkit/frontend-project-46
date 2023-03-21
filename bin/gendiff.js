#!/usr/bin/env node

import { Command } from 'commander';
import gendiff from '../src/compareObj.js';

const program = new Command();

program
  .name('gendiff')
  .description('Compares two configuration files and shows a difference.')
  .version('1.0.0')
  .argument('<filepath1>', 'file1')
  .argument('<filepath2>', 'file2')
  .option('-f, --format <type>', 'define output format', 'stylish')
  .action((filepath1, filepath2) => {
    const options = program.opts();
    console.log(gendiff(filepath1, filepath2, options.format));
  });

program.parse();

export default gendiff;
