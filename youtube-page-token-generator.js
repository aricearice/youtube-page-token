// construct the dict of the possible chars in the pageToken
const charSet = [
  ...Array(26).fill().map((v, k) => String.fromCharCode('A'.charCodeAt(0) + k)),
  ...Array(26).fill().map((v, k) => String.fromCharCode('a'.charCodeAt(0) + k)),
  ...Array(10).keys(),
  ...['-', '_']
];

// The following numbers are all in base 16!
// left-most char is always 'C'
// second char is an encoding of multiples of 10
// third char is encoding of ones place
// fourth char: 
//   if < 80, always 'Q'
//   else, an encoding of multiples of 80
// fifth/sixth/seventh chars:
//   if < 80, always 'A'
//   if < 4000, always 'EA'
//   else, an encoding of multiples of 4000
//
// This _should_ be able to construct a pageToken for an index in [0, 4194304)
// Although it's only tested up to 10000

module.exports = constructPageToken;

function constructPageToken(index, options) {
  index = parseInt(index, 10);

  if (isNaN(index)) {
    throw new Error('Index is not a number!');
  }
  if (index < 0 || index >= (64 * 4 * parseInt(4000, 16))) {
    throw new Error('Index out of range!');
  }

  let finalSymbol = 'A';
  if (options && options.previous) {
    finalSymbol = 'Q';
  }

  let tokenArray = ['C', encodeMultiplesOf10(index), encodeOnes(index), encodeMultiplesOf80(index), encodeMultiplesOf4k(index), finalSymbol];
  return tokenArray.filter(each => { return each !== null; }).join('');
}

function encodeOnes(val) {
  let startingPosition;
  if (val < parseInt(80, 16)) {
    startingPosition = 0;
  } else {
    const quotient = Math.floor(val / parseInt(2000, 16));
    if (quotient < 4) {
      startingPosition = quotient;
    } else {
      startingPosition = 2 + (quotient % 2);
    }
  }

  const onesCharSet = Array(16).fill().map((val, index) => {
    return charSet[index * 4 + startingPosition];
  });

  return onesCharSet[val % 16];
}

function encodeMultiplesOf10(val) {
  let startingPosition, len = 8;
  startingPosition = val < parseInt(80, 16) ? 'A' : 'I';
  const tensCharSet = Array(len).fill().map((v, k) => String.fromCharCode(startingPosition.charCodeAt(0) + k));

  return tensCharSet[Math.floor(val / parseInt(10, 16)) % len];
}

function encodeMultiplesOf80(val) {
  if (val < parseInt(80, 16)) {
    return 'Q';
  }
  return charSet[Math.floor(val / parseInt(80, 16)) % charSet.length];
}

function encodeMultiplesOf4k(val) {
  if (val < parseInt(80, 16)) {
    return 'A';
  } else if (val < parseInt(4000, 16)) {
    return 'EA';
  }
  const quotient = Math.floor(val / parseInt(4000, 16));

  const multiplesOf4kcharSet = Array(quotient + 1).fill().map((v, k) => {
    return `${charSet[Math.floor(k / 4) % charSet.length]}${charSet[(k * 16 + 1) % charSet.length]}A`;
  });

  return multiplesOf4kcharSet[quotient];
}