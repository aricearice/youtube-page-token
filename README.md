youtube-page-token
===========
A function that translates a desired index to a YouTube [pageToken](https://developers.google.com/youtube/v3/docs/playlistItems/list#pageToken).

### Usage: 

```js
var createPageToken = require('youtube-page-token');

var zero = createPageToken(0); // defaults to a token for fetching the next page
console.log(zero); // 'CAAQAA'

var one = createPageToken(1, { previous: true }); // previous page
console.log(zero); // 'CAEQAQ'
```

In context:
```js
var desiredPosition = 10;
var pageToken = createPageToken(desiredPosition);

// get a page of ${maxResults} playlistItems, starting with the ${desiredPosition}th item.

buildApiRequest('GET',
                '/youtube/v3/playlistItems',
                {'maxResults': '10',
                 'part': 'snippet,contentDetails',
                 'playlistId': 'PLBCF2DAC6FFB574DE',
                 'pageToken': pageToken
                 });
```
