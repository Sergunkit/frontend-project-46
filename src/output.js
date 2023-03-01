const output = (diff, option) => {
    const string = JSON.stringify(Object.fromEntries(diff));
    let stringOut = string.replace(/,/g, '\n');
    stringOut = stringOut.replace('{', '{\n').replace('}', '\n}').replace(/"/g, '');
    console.log(stringOut);
    return stringOut;
};
// return JSON.stringify(Object.fromEntries(diff));
// return stringOut;
export default output;
