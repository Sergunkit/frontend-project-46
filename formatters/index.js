// устанавливает тип вывода согласно опции
import { makeStylish } from './stylish.js';
import { makePlain } from './plain.js';

const output = (diff, option) => {
    option = (typeof option === 'object') ? option.format : option;
    if (option === 'stylish') return makeStylish(diff);
    if (option === 'plain') return makePlain(diff);
    if (option === 'json') return `[${JSON.stringify(diff)}]`;
};

export { output };