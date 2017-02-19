/**
* schemas
**/
var mongoose = require ('mongoose');
var Schema = mongoose.Schema;

var myAgendaSchema =  new Schema ({
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
  contacts :[{ }]
});

module.exports = mongoose.model('agenda',myAgendaSchema);
