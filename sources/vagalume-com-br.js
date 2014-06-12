var request = require("request");
var cheerio = require("cheerio");
var _util = require('../util');

exports.get = get;

function get(artist, song, callback) {
  artist = _util.toDashedUrl(artist);
  song = _util.toDashedUrl(song);
  var url = "http://www.vagalume.com.br/" + artist + "/" + song + '.html';
  request(url, function(err, response, html) {
    if(err || response.statusCode === 404 ) return callback(err, response.statusCode);
    var $ = cheerio.load(html);
    $('div[itemprop="description"] > br').replaceWith("\n");
    var lyrics = $('div[itemprop="description"]').text();
    var title = $('#header h1').text().trim();
    callback(null, response.statusCode, title + '\n\n' + lyrics);
  });
}
