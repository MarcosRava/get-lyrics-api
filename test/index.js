var cheerio = require('cheerio');
var request = require('request');

request("http://www.darklyrics.com/lyrics/labyrinthofabyss/thecultofturulpride.html", function(err, resp, html) {
  var $ = cheerio.load(html);
  var lyrics = $('.lyrics');
  console.log(lyrics[0])
});