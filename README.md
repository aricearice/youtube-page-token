youtube-page-token
===========
A function that translates a desired index to a YouTube [pageToken](https://developers.google.com/youtube/v3/docs/playlistItems/list#pageToken).

### Usage: 

```js
var createPageToken = require('youtube-page-token');

var zero = createPageToken(0);
console.log(zero); // 'CAAQAA'
```
