var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserAuthSchema = new Schema({
   username:{
      type:String,
      required:true
   },
   password:{
      type:String,
      required:true
   }
});

module.exports = mongoose.model('userAuth', UserAuthSchema);