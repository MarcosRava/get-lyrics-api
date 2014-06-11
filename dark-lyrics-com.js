var request = require("request");
var cheerio = require("cheerio");


function get(artist, song, callback) {
  var url = require('url');
  var mainUrl = "http://www.darklyrics.com/";
  var firstUrl = mainUrl + artist[0].toLowerCase() + "/" + artist.replace(/ /gi,'').toLowerCase() + ".html";
  request(firstUrl, function(err, response, html) {
    if(err || response.statusCode === 404 ) return callback(err, response.statusCode);
    var $ = cheerio.load(html);
    $('.album a').each(function(){$(this).text($(this).text().toLowerCase());});
    var href = $('.album :contains("' + song.trim.toLowerCase() + '")').attr('href');
    var secondUrl = url.resolve(mainUrl, href);
    request(secondUrl, function(err, response, html) {
      if(err || response.statusCode === 404 ) return callback(err, response.statusCode);
      $ = cheerio.load(html);
      $('.lyrics a').each(function(){$(this).text($(this).text().toLowerCase());});
      //$('.lyrics a:contains("' + song.trim.toLowerCase() + '")');
      var name = $('.lyrics a:contains("against the law")').attr('name');
      var next = $('[name="' + (parseInt(name)+1) + '"]');
      if (next.length === 0) {
        next = $('.thanks');
      }
      var prev = $('[name="' + (parseInt(name)-1) + '"]');
    });

  });

}
