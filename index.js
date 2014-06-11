var artist = process.argv[2] && process.argv[2];
var song = process.argv[3] && process.argv[3];
if(!artist || !song) {
  console.log("Usage: node lyrics_scrape.js [artist] [track]");
  process.exit(1);
}
var wikia = require('./lyrics-wikia-com.js');
var letras = require('./letras-mus-br.js');
var vagalume = require('./vagalume-com-br.js');

wikia.get(artist, song, callback);
letras.get(artist, song, callback);
vagalume.get(artist, song, callback);
function callback(err, status, lyric) {
  lyric = lyric || 'Not Found!';
  console.log(lyric.split('\n'), status);
}
