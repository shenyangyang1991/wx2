'use strict';
const uuid = require('node-uuid');
const chars = [ 'a', 'b', 'c', 'd', 'e', 'f',
  'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's',
  't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5',
  '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I',
  'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V',
  'W', 'X', 'Y', 'Z' ];

exports.uuid8 = function() {
  const uid = uuid.v1().replace(/\-/g, '');
  const shortIndex = [ 0, 1, 2, 3, 4, 5, 6, 7 ];
  const shortUid = [];
  shortIndex.forEach(item => {
    const str = uid.substr(item * 4, item * 4 + 4);
    const factor = parseInt(str, 16);
    shortUid.push(chars[factor % 0x3E]);
  });
  return shortUid.join('');
};

exports.model2arr = function(model) {
  const result = [];
  if (model && model.length > 0) {
    model.forEach(body => {
      result.push(body[1]);
    });
  }

  return result;
};

exports.str2obj = function(arr) {
  if (!arr) return [];
  const arrObj = [];
  arr.forEach(str => {
    arrObj.push(JSON.parse(str));
  });
  return arrObj;
};
