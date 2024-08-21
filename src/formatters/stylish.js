import _ from 'lodash';

const space = ' ';
const spaceCount = 4;
const indent = (depth) => space.repeat(spaceCount * depth - 2);
const braceIndent = (depth) => space.repeat(spaceCount * depth - spaceCount);

const formString = (lines, depth) => [
  '{',
  ...lines,
  `${braceIndent(depth)}}`,
].join('\n');

const stringify = (data, depth) => {
  if ((!_.isObject(data)) || (data === null)) {
    return String(data);
  }
  const keys = _.keys(data);
  const lines = keys.map((key) => `${indent(depth)}  ${key}: ${stringify(data[key], depth + 1)}`);
  return formString(lines, depth);
};

const makeStylishFormat = (tree) => {
  const formResString = (node, depth) => {
    switch (node.type) {
      case 'root': {
        const res = node.children.flatMap((child) => formResString(child, depth));
        return formString(res, depth);
      }
      case 'nested': {
        const childrenToRes = node.children.flatMap((child) => formResString(child, depth + 1));
        return `${indent(depth)}  ${node.key}: ${formString(childrenToRes, depth + 1)}`;
      }
      case 'added': {
        return `${indent(depth)}+ ${node.key}: ${stringify(node.value, depth + 1)}`;
      }
      case 'removed': {
        return `${indent(depth)}- ${node.key}: ${stringify(node.value, depth + 1)}`;
      }
      case 'changed': {
        return [`${indent(depth)}- ${node.key}: ${stringify(node.value, depth + 1)}`,
          `${indent(depth)}+ ${node.key}: ${stringify(node.value2, depth + 1)}`];
      }
      case 'unchanged': {
        return `${indent(depth)}  ${node.key}: ${stringify(node.value, depth + 1)}`;
      }
      default: {
        throw Error('Uncorrect data');
      }
    }
  };
  return formResString(tree, 1);
};

export default makeStylishFormat;
