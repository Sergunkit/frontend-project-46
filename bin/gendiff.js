#!/usr/bin/env node

import { program } from 'commander';

program
    .name('gendiff')
    .description('Compares two configuration files and shows a difference.')
    .option('-V, --version', 'output the version number')
    .version('0.8.0')
    .parse(process.argv);

program.parse()


// export default genDiff;
