import _ from 'lodash';

const formPath = (nodeNames) => nodeNames.flat().join('.');

const normVal = (value) => {
  switch (typeof value) {
    case 'object': {
      return !value ? 'null' : '[complex value]';
    }
    case 'string': {
      return `'${value}'`;
    }
    default: {
      return `${value}`;
    }
  }
};

export function makePlainDiff(tree) {
  const formResString = (node, path) => node.map((elem) => {
    const currentPath = formPath([path, elem.key]);
    switch (elem.type) {
      case 'nested': {
        return formResString(elem.children, currentPath);
      }
      case 'added': {
        return `Property '${currentPath}' was added with value: ${normVal(elem.value)}`;
      }
      case 'removed': {
        return `Property '${currentPath}' was removed`;
      }
      case 'changed': {
        return `Property '${currentPath}' was updated. From ${normVal(elem.value)} to ${normVal(elem.value2)}`;
      }
      case 'unchanged': {
        return null;
      }
      default: {
        throw Error('Uncorrect data');
      }
    }
  });
  return formResString(tree.children, []);
}

export default function makePlainForm(data) {
  const res = makePlainDiff(data);
  const flattenRes = _.flattenDeep(res);
  const filteredRes = flattenRes.filter((elem) => elem);
  return filteredRes.join('\n');
}
