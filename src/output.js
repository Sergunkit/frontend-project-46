const output = (diff, option) => {
    const string = JSON.stringify(Object.fromEntries(diff));
    let stringOut = string.replace(/,/g, '\n');
    stringOut = stringOut.replace('{', '{\n').replace('}', '\n}').replace(/"/g, '');
    console.log(stringOut);
    return JSON.stringify(Object.fromEntries(diff));
};

export default output;
