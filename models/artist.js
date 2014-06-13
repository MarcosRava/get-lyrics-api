var model = require('model');
var Model = model.Model;
var Album = require('./aslbum.js');

var Artist;
module.exports = Artist =(function(_super) {
  function Artist(args) {
    _super._init_(this, args);    
  }
  Artist.schema = {    
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
      albums: {
        type: 'array',
        ref: Album
      }
    }
  };
  return Artist;
})(Model);