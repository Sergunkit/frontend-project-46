const makeStylish = (diff) => {
  const string = JSON.stringify(diff);
  let stringOut = string.replace(/:/g, ': ');
  stringOut = stringOut.replace(/"/g, '');
  let deep = 0;
  const shift = ' ';
  let stylishDiff = '';
  for (let i = 0; i < stringOut.length; i += 1) {
    let j = stringOut[i];
    if (stringOut[i] === '{') {
      deep += 4;
      j = `{\n${shift.repeat(deep - 2)}`;
    }
    if (stringOut[i] === '}') {
      j = `\n${shift.repeat(deep - 4)}}`;
      deep -= 4;
    }
    if (stringOut[i] === ',') {
      j = `\n${shift.repeat(deep - 2)}`;
    }
    stylishDiff += j;
  }
  // console.log(stylishDiff);
  return stylishDiff;
};

export default makeStylish;
