import _ from 'lodash';

const compareObj = (data1, data2) => {
  const data1Keys = _.keys(data1);
  const data2Keys = _.keys(data2);
  const sortedKeys = _.sortBy(_.union(data1Keys, data2Keys));

  const nodes = sortedKeys.map((key) => {
    if (!_.has(data1, key)) {
      return {
        type: 'added',
        key,
        value: data2[key],
      };
    }
    if (!_.has(data2, key)) {
      return {
        type: 'removed',
        key,
        value: data1[key],
      };
    }
    if (_.isPlainObject(data1[key]) && _.isPlainObject(data2[key])) {
      return {
        type: 'nested',
        key,
        children: compareObj(data1[key], data2[key]),
      };
    }
    if (_.isEqual(data1[key], data2[key])) {
      return {
        type: 'unchanged',
        key,
        value: data1[key],
      };
    }
    return {
      type: 'changed',
      key,
      value: data1[key],
      value2: data2[key],
    };
  });
  return nodes;
};

const gendiff = (data1, data2) => ({
  type: 'root',
  children: compareObj(data1, data2),
});

export default gendiff;
