var artist = process.argv[2] && process.argv[2];
var song = process.argv[3] && process.argv[3];
if (!artist || !song) {
  console.log("Usage: node lyrics_scrape.js [artist] [track]");
  process.exit(1);
}
var sources = require('./sources');
var wikia = sources.wikia;
var letras = sources.letras;
var vagalume = sources.vagalume;
var darkLyrics = sources.darkLyrics;

wikia.get(artist, song)
  .fail(function () {
    console.log('dark');
    return darkLyrics.get(artist, song);
  })
  .fail(function () {
    console.log('letras');
    return letras.get(artist, song);
  })
  .fail(function () {
    console.log('vaga');
    return vagalume.get(artist, song);
  })
  .then(callback)
  .fail(callback);

function callback(obj) {
  console.log(obj, 'eita');
}
