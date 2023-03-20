const makeStylish = (diff) => {
  const string = JSON.stringify(diff);
  let stringOut = string.replace(/:/g, ': ');
  stringOut = stringOut.replace(/"/g, '');
  let deep = 0;
  const shift = '    ';
  let stylishDiff = '';
  for (let i = 0; i < stringOut.length; i += 1) {
    let j = stringOut[i];
    if (stringOut[i] === '{') {
      deep += 1;
      j = `{\n${shift.repeat(deep)}`;
    }
    if (stringOut[i] === '}') {
      j = `\n${shift.repeat(deep)}}`;
      deep -= 1;
    }
    if (stringOut[i] === ',') {
      j = `\n${shift.repeat(deep)}`;
    }
    stylishDiff += j;
  }
  return stylishDiff;
};

export default makeStylish;