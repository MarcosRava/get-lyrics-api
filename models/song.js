var model = require('model');
var Model = model.Model;

var Song;
module.exports = Song = (function(_super) {
  function Song(args) {
    _super._init_(this, args);
  }
  Song.schema = {    
    properties: {
      id : {
        type: 'integer',
        required: true,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: 'string',
        length: {
          maximun: 255
        }
      },
      lyric: {
        type: 'string',
      }, 
      karaoke: {
        type: 'string',
      }, 
      artistName: {
        type: 'string',
        required: true
      },
      albumName: {
        type: 'string',
      },
      albumYear: {
        type: 'integer',
      }
    }
  };
  return Song;
})(Model);