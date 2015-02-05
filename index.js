var sources = require('./sources');
var wikia = sources.wikia;
var letras = sources.letras;
var vagalume = sources.vagalume;
var darkLyrics = sources.darkLyrics;

var artist = process.argv[2] && process.argv[2];
var song = process.argv[3] && process.argv[3];
if (process.argv.length >= 3 && artist && song) {
  get(artist, song)
    .then(callback)
    .fail(callback);

  function callback(obj) {
    console.log(obj);
  }
}

function get(artist, song) {
  return wikia.get(artist, song)
    .fail(function () {
      return darkLyrics.get(artist, song);
    })
    .fail(function () {
      return letras.get(artist, song);
    })
    .fail(function () {
      return vagalume.get(artist, song);
    });
}

exports.get = get;
