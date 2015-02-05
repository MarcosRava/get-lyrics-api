var request = require("request");
var cheerio = require("cheerio");
var _util = require('../util');
var Q = require('q');

exports.get = get;

function get(artist, song) {
  var deferred = Q.defer();
  artist = _util.toDashedUrl(artist);
  song = _util.toDashedUrl(song);
  var url = "http://www.vagalume.com.br/" + artist + "/" + song + '.html';
  request(url, function(err, response, html) {
    if(err || response.statusCode !== 200 ) {
      err = err || {};
      err.statusCode = response ? response.statusCode : undefined;
      return deferred.reject(err);
    }
    var $ = cheerio.load(html);
    var artistName = $('em[itemprop="name"]').text();
    $('div[itemprop="description"] > br').replaceWith("\n");
    var lyrics = $('div[itemprop="description"]').text();
    var title = $('#header h1').text().trim();
    var song = {
      name: title,
      artistName: artistName,
      lyric: lyrics,
    };
    var resp = {
      statusCode: lyrics ? response.statusCode: 404,
      song : song,
      source: 'vagalume'
    };
    if (resp.statusCode === 404) {
      return deferred.reject({statusCode:404});
    }
    deferred.resolve(resp);
  });
  return deferred.promise;
}
