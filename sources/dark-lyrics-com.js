var request = require("request");
var cheerio = require("cheerio");
var _util = require('../util');
var Song = require('../models/song.js');

exports.get = get;

function get(artist, song, callback) {
  var url = require('url');
  var mainUrl = "http://www.darklyrics.com/";
  var found = false;
  var album;
  var year;
  var songName;
  var firstUrl = mainUrl + artist[0].toLowerCase() + "/" + artist.replace(/ /gi,'').toLowerCase().replace(/[^a-z0-9]/gi, '') + ".html";
  request(firstUrl, function(err, response, html) {
    if(err || response.statusCode === 404 ) return callback(err, response.statusCode);
    var $ = cheerio.load(html);
    var foundAlbum = false;
    $('.album a').each(function(i){
      var $t = $(this);
      if (!foundAlbum && $t.text().toLowerCase().indexOf(song.trim().toLowerCase()) !== -1) {
        var href = $t.attr("href");
        var $s = $t.parent().find('strong');
        album = $s.text().replace(/"/gi,'');
        year = $s[0].next.data.trim().replace('(', '').replace(')', '');
        songName = $t.text();
        secondRequest(href);
        foundAlbum = true;
      }
      else if (!foundAlbum && i === $('.album a').length - 1)
        callback(null, 404);
    });
    function secondRequest(href) {
      var secondUrl = url.resolve(mainUrl, href);
      request(secondUrl, function(err, response, html) {
        if(err || response.statusCode === 404 ) return callback(err, response.statusCode);
        $ = cheerio.load(html);

        $('.lyrics a').each(function(){$(this).text($(this).text().toLowerCase());});

        $('.lyrics a').each(function(i) {
          var $this = $(this);
          if (!found && $this.text().toLowerCase().indexOf(song.trim().toLowerCase()) !== -1) {
            parseH3($this.parent());
            found = true;
          }
          else if (!found && i === $('.lyrics a').length - 1)
            callback(null, 404);
        });

        function parseH3(h3) {
          var lyric = "";
          var h = h3[0];
          for(var s = h.next; s && (s.name !== 'h3' || $(s).hasClass('thanks')); s = s.next) {
            if(s.type === 'text' && s.data) lyric+= s.data;
          }
          var song = new Song({
            name: songName,
            artistName: _util.camelize(artist),
            lyric: lyric,
            albumName: album,
            albumYear: year
          });
          callback(null, 200, song);
        }
      });
    }

  });

}
