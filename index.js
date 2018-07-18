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
  const parsedIndex = parseInt(index, 10);
  const lowerLimit = 0;
  const upperLimit = 64 * 4 * parseInt(4000, 16);

  if (isNaN(parsedIndex)) {
    throw new TypeError(`${index} is not a number.`);
  }
  if (parsedIndex < lowerLimit || parsedIndex >= upperLimit) {
    throw new Error(`${parsedIndex} is out of range (${lowerLimit}, ${upperLimit}].`);
  }

  let finalSymbol = 'A';
  if (options && options.previous) {
    finalSymbol = 'Q';
  }

  let tokenArray = ['C', encodeMultiplesOf10(parsedIndex), encodeOnes(parsedIndex), encodeMultiplesOf80(parsedIndex), encodeMultiplesOf4k(parsedIndex), finalSymbol];
  return tokenArray.filter(each => { return each !== null; }).join('');
}

// construct the dict of the possible chars in the pageToken
const charSet = [
  ...Array(26).fill().map((v, k) => String.fromCharCode('A'.charCodeAt(0) + k)),
  ...Array(26).fill().map((v, k) => String.fromCharCode('a'.charCodeAt(0) + k)),
  ...Array(10).keys(),
  ...['-', '_']
];

const multiplesOf4kcharSet = Array(26 * 4).fill().map((v, k) => {
  return `${charSet[Math.floor(k / 4) % charSet.length]}${charSet[(k * 16 + 1) % charSet.length]}A`;
});

const onesCharSets = Array(4).fill().map((v, k) => {
  return constructOnesCharSet(k);
});

const tensCharSets = {
  A: constructTensCharSet('A'),
  I: constructTensCharSet('I')
};

function constructOnesCharSet(startingPosition) {
  return Array(16).fill().map((val, index) => {
    return charSet[index * 4 + startingPosition];
  });
}

function constructTensCharSet(startChar) {
  return Array(8).fill().map((v, k) => String.fromCharCode(startChar.charCodeAt(0) + k));
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

  return onesCharSets[startingPosition][val % 16];
}

function encodeMultiplesOf10(val) {
  let startingPosition;
  startingPosition = val < parseInt(80, 16) ? 'A' : 'I';

  return tensCharSets[startingPosition][Math.floor(val / parseInt(10, 16)) % 8];
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

  return multiplesOf4kcharSet[quotient];
}
