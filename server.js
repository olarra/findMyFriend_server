/**
* Dependencies and modules
*/
var express    = require('express');                    //  + mini framework for nodejs applications
var bodyParser = require('body-parser');                //  + pull information from HTML POST
var morgan = require('morgan');                         //  + log requests to the console (express4)
var mongoose = require('mongoose');                     //  + mongoose for mongodb
var passport = require('passport')
var cors       = require('cors');                       //  + handling Multiple Origins Using URL
var passportLocalStrategy= require('./config/passport.localStrategy')(passport);

var app = express();
/**
* Configuration.
*/
const DB_NAME = 'find_my_friend';                                                            // + Database name declaration
const DB_LOCAL = 'mongodb://127.0.0.1:27017/'+ DB_NAME;                             // + Local Hostname for the BD
const DB_REMOTE='mongodb://root:root@ds135669.mlab.com:35669/'+DB_NAME              // + Remote Hostname for the BD
const HOST = '127.0.0.1';                                                           // + Hostname for NodeJs App
const PORT = process.env.PORT || 3000;                                              // + Server port for nodejs app

app.use(bodyParser.json());                                                         // + Parse application/json
app.use(bodyParser.urlencoded({ extended: true }));                                 // + Parse application/x-ww-form-urlencoded
app.use(morgan('dev'));                                                             // + log every request to the console
app.use(passport.initialize());                                                     // + Initializing Passport module
app.use(cors());                                                                    // + Activate CORS requests
app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'DELETE, PUT','GET','POST');
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});
var routes = require('./app/routes.login')(app,passport);                          //  + Routes for the Backend =====> SO IMPORTANT <=======

/**
* MongoDB connection
*/
mongoose.connect(DB_REMOTE,function(err,res){
  if(err)
       console.log("Error connecting to the Database. " + err);
  else
       console.log("Connected to the Database : " + DB_NAME);
});
/**
* Server Execution
*/
app.listen(PORT, function(){
console.log("Server running at http://" + HOST + ":" + (PORT) + "/");
});
