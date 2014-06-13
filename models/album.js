var model = require('model');
var Model = model.Model;
var Song = require('./song.js');

var Album;
module.exports = Album =(function(_super) {
  function Album(args) {
    _super._init_(this, args);
  }
  Album.schema = {    
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
      year: {
        type: 'integer'
      },
      songs: {
        type: 'array',
        ref: Song
      },  
      artistName: {
        type: 'string',
        required: true
      }
    }
  };
  return Album;
})(Model);