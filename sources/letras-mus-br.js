var request = require("request");
var cheerio = require("cheerio");
var Q = require('q');
var _util = require('../util');
var url = require('url');
var mainUrl = "http://letras.mus.br/";

exports.get = get;

function get(artist, song) {
  var deferred = Q.defer();
  var firstUrl = mainUrl + _util.toDashedUrl(artist) + "/";
  var found = false;
  request(firstUrl, function (err, response, html) {
    if (err || response.statusCode !== 200) {
      err = err || {};
      err.statusCode = response ? response.statusCode : undefined;
      return deferred.reject(err);
    }
    var $ = cheerio.load(html);
    $('.cnt_listas span').each(function (i) {
      var $this = $(this);
      $this.text($this.text().toLowerCase());
      if (!found && $this.text() === song.trim().toLowerCase()) {
        getSecond(artist, song, $, $this, deferred);
        found = true;
      } else if (!found && i === $('.cnt_listas span').length - 1)
        return deferred.reject({
          statusCode: 404
        });
    });
  });

  return deferred.promise;
}

function getSecond(artist, song, $, $el, deferred) {
  var href = $el.parent().attr('href');
  var secondUrl = url.resolve(mainUrl, href);
  request(secondUrl, function (err, response, html) {
    if (err || response.statusCode !== 200) {
      err = err || {};
      err.statusCode = response ? response.statusCode : undefined;
      return deferred.reject(err);
    }
    $ = cheerio.load(html);
    var artist = $('a[itemprop="byArtist"]').text().trim();
    $('#div_letra > br').replaceWith('\n');
    var lyrics = $("#div_letra").text();
    var title = $('h1[itemprop="name"]').text().trim();
    var song = {
      name: title,
      artistName: artist,
      lyric: lyrics
    };

    var resp = {
      statusCode: response.statusCode,
      song: song,
      source: 'letras-mus-br'
    };
    deferred.resolve(resp);
  });
}
