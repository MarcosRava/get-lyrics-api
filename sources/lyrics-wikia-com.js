var request = require("request");
var cheerio = require("cheerio");
var Song = require('../models/song.js');

exports.get = get;

function get(artist, song, callback) {
  var url = "http://lyrics.wikia.com/" + artist + ":" + song;
  request(url, function(err, response, html) {
    if(err || response.statusCode !== 200 ) return callback(err, response.statusCode);
    var $ = cheerio.load(html);
    var artistInfo = $('#gracenoteid').prev();
    var album;
    var year;
    if (!artistInfo[0]) return callback(err, 404);
    if (artistInfo[0].name === 'i') {
      var _split = artistInfo.text().split('(');
      album = _split[0].trim();
      year = _split[1].trim().replace(')', '');
      artistInfo = artistInfo.prev();
    }
    var artistName = artistInfo.text();
    var songName = $('#WikiaPageHeader h1').text().split(':')[1].replace('Lyrics', '').trim();
    $("div.lyricbox > .rtMatcher, div.lyricbox > .lyricsbreak").remove();
    $("div.lyricbox > br").replaceWith("\n");
    var lyrics = $("div.lyricbox").text();
    var song = new Song({
      name: songName,
      artistName: artistName,
      lyric: lyrics,
      albumName: album,
      albumYear: year
    });
    callback(null, response.statusCode, song);
  });
}
