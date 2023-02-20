#!/usr/bin/env node

import { program } from 'commander';

program
    .name('gendiff')
    .description('Compares two configuration files and shows a difference.')
    .version('1.0.0')
    .argument('<filepath1>', 'file1')
    .argument('<filepath1>', 'file2')
    .option('-f, --format <type>',  'output format')
    .parse(process.argv);

program.parse()


// export default genDiff;
