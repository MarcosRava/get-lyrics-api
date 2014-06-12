var request = require("request");
var cheerio = require("cheerio");

exports.get = get;

function get(artist, song, callback) {
  var url = "http://lyrics.wikia.com/" + artist + ":" + song;
  request(url, function(err, response, html) {
    if(err || response.statusCode === 404 ) return callback(err, response.statusCode);
    var $ = cheerio.load(html);
    $("div.lyricbox > .rtMatcher, div.lyricbox > .lyricsbreak").remove();
    $("div.lyricbox > br").replaceWith("\n");
    var lyrics = $("div.lyricbox").text();

    callback(null, response.statusCode, lyrics);
  });
}
