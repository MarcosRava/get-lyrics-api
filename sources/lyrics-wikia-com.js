var request = require("request");
var cheerio = require("cheerio");
var Q = require('q');

exports.get = get;

function get(artist, song) {
  var deferred = Q.defer();
  var url = "http://lyrics.wikia.com/" + artist + ":" + song;
  request(url, function (err, response, html) {
    if (err || response.statusCode !== 200) {
      err = err || {};
      err.statusCode = response ? response.statusCode : undefined;
      return deferred.reject(err);
    }
    var $ = cheerio.load(html);
    var artistInfo = $('#mw-content-text b a');
    var album;
    var year;
    if (!artistInfo[0]) return deferred.reject({
      statusCode: 404
    });
    var albumInfo = $('#mw-content-text i a')[0];
    if (albumInfo) {
      var _split = $(albumInfo).text().split('(');
      album = _split[0].trim();
      year = _split[1].trim().replace(')', '');
    }
    var artistName = $(artistInfo[0]).text();
    var songName = $('#WikiaPageHeader h1').text().split(':')[1].replace('Lyrics', '').trim();
    $("div.lyricbox > .rtMatcher, div.lyricbox > .lyricsbreak").remove();
    $("div.lyricbox > br").replaceWith("\n");
    $('div.lyricbox script, div.lyricbox nonscript').remove();
    var lyrics = $("div.lyricbox").text();
    var song = {
      name: songName,
      artistName: artistName,
      lyric: lyrics,
      albumName: album,
      albumYear: year
    };

    var resp = {
      statusCode: response.statusCode,
      song: song,
      source: 'lyrics-wikia'
    };
    deferred.resolve(resp);
  });

  return deferred.promise;
}
