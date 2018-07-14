const fs = require('fs');
const expectedTokens = fs.readFileSync(process.cwd() + '/test/youtube-page-tokens.txt', 'utf8').split('\n').filter((each) => typeof each === 'string' && each.length > 0);
const expect = require('chai').expect;
const constructPageToken = require(process.cwd() + '/youtube-page-token-generator');

describe('Youtube Page Token Generator', function() {
  it('should create the correct token for each index', function() {
    for (let i = 0; i < expectedTokens.length; i++) {
      expect(constructPageToken(i)).to.equal(expectedTokens[i]);
    }
  });
});
