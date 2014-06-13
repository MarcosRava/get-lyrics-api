var request = require("request");
var cheerio = require("cheerio");
var _util = require('../util');
var Song = require('../models/song.js');


exports.get = get;

function get(artist, song, callback) {
  artist = _util.toDashedUrl(artist);
  song = _util.toDashedUrl(song);
  var url = "http://www.vagalume.com.br/" + artist + "/" + song + '.html';
  request(url, function(err, response, html) {
    if(err || response.statusCode !== 200 ) return callback(err, response.statusCode);
    var $ = cheerio.load(html);
    var artistName = $('em[itemprop="name"]').text();
    $('div[itemprop="description"] > br').replaceWith("\n");
    var lyrics = $('div[itemprop="description"]').text();
    var title = $('#header h1').text().trim();
    var song = new Song({
      name: title,
      artistName: artistName,
      lyric: lyrics,
    });
    callback(null, lyrics ? response.statusCode: 404, lyrics ? song: undefined);
  });
}
