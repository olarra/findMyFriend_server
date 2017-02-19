/**
* schemas
**/
var mongoose = require ('mongoose');
var Schema = mongoose.Schema;

var myConnectionSchema =  new Schema ({
  username:  {
    type : String,
    unique: true,
    required : true
  },
  telephone :
  {
    type : String,
    required : true
  },
  localisation : [{ }],
  connection : Number
});

module.exports = mongoose.model('connection',myConnectionSchema);
