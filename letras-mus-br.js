var request = require("request");
var cheerio = require("cheerio");
var _util = require('./util');
var url = require('url');
var mainUrl = "http://letras.mus.br/";

exports.get = get;

function get(artist, song, callback) {
  var firstUrl = mainUrl + _util.toDashedUrl(artist) + "/";
  var found = false;
  request(firstUrl, function(err, response, html) {
    if(err || response.statusCode === 404 ) return callback(err, response.statusCode);
    var $ = cheerio.load(html);
    $('.cnt_listas span').each(function(i){
      var $this = $(this);
      $this.text($this.text().toLowerCase());
      if (!found && $this.text() === song.trim().toLowerCase()) {
        getSecond(artist, song, $, $this, callback);
        found = true;
      }
      else if (!found && i === $('.cnt_listas span').length - 1)
        callback(null, 404);
    });
  });

}

function getSecond(artist, song, $, $el, callback) {
    var href = $el.parent().attr('href');
    var secondUrl = url.resolve(mainUrl, href);
    request(secondUrl, function(err, response, html) {
      if(err || response.statusCode === 404 ) return callback(err, response.statusCode);
      $ = cheerio.load(html);
      $('#div_letra > br').replaceWith('\n');
      var lyrics = $("#div_letra").text();
      var title = $('h1[itemprop="name"]').text().trim();
      callback(null, 200, title + '\n\n' + lyrics);
    });
}
