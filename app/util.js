'use strict';

const uuid = require('node-uuid');
const char = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

exports.uuid8 = () => {
  const uid       = uuid.v1().replace(/\-/g, '');
  const short     = [0, 1, 2, 3, 4, 5, 6, 7];
  const uid8      = [];
  short.forEach(x => {
    const y       = uid.substr(x * 4, x * 4 + 4);
    const factor  = parseInt(y, 16);
    uid8.push(char[factor % 0x3E]);
  });
  return uid8.join('');
};

exports.model2arr = (model) => {
  const arr = [];
  if (model && model.length > 0) {
    model.forEach(item => {
      arr.push(item[1]);
    });
  }
  return arr;
};

exports.arr2obj = (arr) => {
  if (!arr) return [];
  const arrObj = [];
  arr.forEach(str => {
    arrObj.push(JSON.parse(str));
  });
  return arrObj;
};

exports.lasttime = (today) => {
  today = today || new Date();
  today.setHours(23);
  today.setMinutes(59);
  today.setSeconds(59);
  today.setMilliseconds(999);
  return today.getTime();
};
