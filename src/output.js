// const makeShift = (diff) => {
//     let deep = 0;
//     const shift = '    ';
//     for (prop in diff) {
//         if (typeof diff[prop] === 'object') {
            
//             prop = `${deep * shift}${prop}`;
//             deep += 1;
//         }
//         deep -= 1;
//     }
//     return diff;
// }



     
// };
// console.log(res)

const makeStylish = (diff, option) => {
    const string = JSON.stringify(diff);
    let stringOut = string.replace(/:/g, ': ');
    stringOut = stringOut.replace(/"/g, '');
    let deep = 0;
    const shift = '    ';
    let res = '';
    for (let i = 0; i <  stringOut.length; i += 1) {
        let j = stringOut[i];
        if (stringOut[i] === '{') {
            deep += 1;
            j = `{\n${shift.repeat(deep)}`
        };
        if (stringOut[i] === '}') {
           
            j = `\n${shift.repeat(deep)}}`
            deep -= 1;
        };
        // if ((stringOut[i] === '}') && (stringOut[i - 1] === '}')) {
        //     j = `\n${shift.repeat(deep)}}`
        //     deep -= 1;
            
        // }; Глубина = ${deep}...

        if (stringOut[i] === ',') {
            j = `\n${shift.repeat(deep)}`
        };
        if ((stringOut[i] === '+') || (stringOut[i] === '-')) {
            
        }
        res += j;
    }
    
    console.log(res);
    return res;
};

// return JSON.stringify(Object.fromEntries(diff));
// return res;
//const makeStylish = (diff) => {

// }

const output = (diff, option) => makeStylish(diff);

export { makeStylish, output };
