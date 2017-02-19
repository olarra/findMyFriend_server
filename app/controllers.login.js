var User = require('./model.user');
var Connection = require('./model.connection');
var Agenda = require('./model.agenda');
var jwt = require('jwt-simple');                        //  + json web token generator
var timestampToDate = require('timestamp-to-date');
var config = require('../config/config.login'); // get db config file
var async = require('async');
var tmpContacts = [];
var item =[];
var allContacts = [];
var currentConnection = 0;
var nextConnection = 0;
var isUsingApp;

getToken = function (headers) {
    if (headers && headers.authorization) {
      var parted = headers.authorization.split(' ');
      if (parted.length === 2) {
        return parted[1];
      } else {
        return null;
      }
    } else {
      return null;
    }
  };

// Get reviews
  exports.deletePosition = function (req,res){


    getToken = function (headers) {
      if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
          return parted[1];
        } else {
          return null;
        }
      } else {
        return null;
      }
    };



    var token = getToken(req.headers);
    if (token) {
      var decoded = jwt.decode(token, config.login.TOKEN_SECRET);
      var username = decoded.username;
      var date = req.params.position_date;
      console.log(username + "  " + date);
      Connection.update({username :username },{$pull: { localisation :{date : date}}},{ safe: true },
      function (err, obj) {
          if(err){console.log(err);}
          else {console.log(obj);}
      });
      res.send({success: true});
    } else {
      return res.status(403).send({success: false, msg: 'No token provided.'});
    }

  }


exports.savePosition = function (req,res){

  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.login.TOKEN_SECRET);
    console.log(decoded.username);
  }

  console.log("Saving Position Controller activated");


  var latitude = req.body.position.coords.latitude;
  var longitude = req.body.position.coords.longitude;
  var timestamp = req.body.position.timestamp;

  var localisation = {
    latitude :  latitude,
    longitude : longitude,
    date : timestampToDate(timestamp,'yyyy-MM-dd HH:mm:ss')
  }
  console.log(localisation);
    Connection.update({username : decoded.username},{$push : {"localisation": localisation }},
    function(err, user) {
      if (err) {console.log(err);}
      else {console.log("success")}
    });

      res.json({success: true, msg: 'end of gps controller'});

};


exports.saveContacts = function (req,res){

  allContacts.length = 0;
  tmpContacts.length = 0;
  var phoneFormatted = "";
  var tmp = "XXXXXXXXXXXXXX";


  allContacts = req.body.allContacts;

    var token = getToken(req.headers);
    if (token) {
      var decoded = jwt.decode(token, config.login.TOKEN_SECRET);
      console.log(decoded.username);

    }
    //async loop
  //  for(var i=0; i < allContacts.length; i++)
    //{

    function asyncLoop( i, callback ) {

      if( i < allContacts.length ) {

      item=allContacts[i];

          if(item.phone_no == "Undefined" || item.type == "Undefined")
          {
            tmpContacts.push({id:item.id,name:item.name,type:"Undefined",phone_no:"Undefined",isUsingApp:false});
            asyncLoop( i+1, callback );
          } else {

              phoneNormalized = item.phone_no.replace(/\D/g,'');

                if (phoneNormalized.length > 8 ){

                   phoneFormatted = (phoneNormalized).slice(-10)

                    tmp = tmp.substr(0,0) + '(' + tmp.substr(0 + 1);
                    tmp = tmp.substr(0,1) + phoneFormatted.charAt(0) + tmp.substr(1 + 1);
                    tmp = tmp.substr(0,2) + phoneFormatted.charAt(1) + tmp.substr(2 + 1);
                    tmp = tmp.substr(0,3) + ')' + tmp.substr(3 + 1);
                    tmp = tmp.substr(0,4) + ' ' + tmp.substr(4 + 1);
                    tmp = tmp.substr(0,5) + phoneFormatted.charAt(2) + tmp.substr(5 + 1);
                    tmp = tmp.substr(0,6) + phoneFormatted.charAt(3) + tmp.substr(6 + 1);
                    tmp = tmp.substr(0,7) + phoneFormatted.charAt(4) + tmp.substr(7 + 1);
                    tmp = tmp.substr(0,8) + phoneFormatted.charAt(5) + tmp.substr(8 + 1);
                    tmp = tmp.substr(0,9) + '.' + tmp.substr(9 + 1);
                    tmp = tmp.substr(0,10) + phoneFormatted.charAt(6) + tmp.substr(10 + 1);
                    tmp = tmp.substr(0,11) + phoneFormatted.charAt(7) + tmp.substr(11 + 1);
                    tmp = tmp.substr(0,12) + phoneFormatted.charAt(8) + tmp.substr(12 + 1);
                    tmp = tmp.substr(0,13) + phoneFormatted.charAt(9) + tmp.substr(13 + 1);

                    phoneFormatted = tmp;
                    var query = User.findOne({ telephone: phoneFormatted });

                    query.exec(function(err, user) {
                        if (err) {
                          res.send(err)
                        } if(user) {
                          isUsingApp = true;
                          //console.log(user.username + " is using the application so : " + isUsingApp);
                        } else {
                          isUsingApp = false;

                        }
                        tmpContacts.push({id:item.id,name:item.name,type:item.type,phone_no:phoneFormatted,isUsingApp:isUsingApp});
                        asyncLoop( i+1, callback );
                    });

                } else {
                  phoneFormatted = (phoneNormalized).slice(-8)
                  isUsingApp = false;
                  tmpContacts.push({id:item.id,name:item.name,type:item.type,phone_no:phoneFormatted,isUsingApp:isUsingApp});
                  asyncLoop( i+1, callback );
                }
              }

              }
          else {
            callback();
            }
    }

    asyncLoop(0, function() {
    // put the code that should happen after the loop here
    Agenda.update({username : decoded.username},{$set : {"contacts": tmpContacts }},function(err, user) {
      if (!err) {console.log("agenda created")};
    });
});
      res.json(tmpContacts);
};


// Fetch ContactsContacts
exports.fetchContacts = function (req,res){

 console.log("fetching contacts");
 res.setHeader('Access-Control-Allow-Origin', '*');
 res.setHeader('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
 res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
 // use mongoose to get all contacts in the database
 var token = getToken(req.headers);
 if (token) {
   var decoded = jwt.decode(token, config.login.TOKEN_SECRET);
   console.log(decoded.username);

 }

 Agenda.findOne({username: decoded.username },function(err, agenda) {
 if (err)                // if there is an error retrieving, send the error. nothing after res.send(err) will execute
   res.send(err)
 res.json(agenda.contacts);       // return all reviews in JSON format
});
}

// Fetch ContactsContacts
exports.fetchDetails = function (req,res){

 console.log("fetching Details");
 res.setHeader('Access-Control-Allow-Origin', '*');
 res.setHeader('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
 res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
 // use mongoose to get all contacts in the database

  Connection.findOne({telephone: req.params.phone_no}, function(err, user) {
    if (err) {console.log(err);}
    if (user)
    {
      console.log(user);
      res.json(user);
    }
  });
}


exports.signup = function (req,res){

  console.log("SignUp Process initialized");

    if (!req.body.username || !req.body.password) {
      res.json({success: false, msg: 'Please pass name and password.'});
    } else {
      var newUser = new User({
        username: req.body.username,
        password: req.body.password,
        mail: req.body.mail,
        telephone: req.body.telephone,
        date: req.body.date,
        sex: req.body.sex
      });
      // save the use
      newUser.save(function(err) {
        if (err) {
          res.json({success: false, msg: 'Username already exists.'});
        }

        Connection.create({
            username: req.body.username,
            telephone : req.body.telephone,
            localisation: [{}],
            connection : 0
                   });

         Agenda.create({
           username: req.body.username,
           telephone : req.body.telephone,
           contacts : [{}]
                  });

          res.json({success: true, msg: 'Successful created new user.'});
      });
    }
};


exports.login = function (req,res){
  console.log("login process, from the server side");
  console.log(req.body.name);
  console.log(req.body.password);

  User.findOne({username: req.body.name}, function(err, username) {
    if (err) {console.log(err);}
    if (!username)
    {
      res.send({success: false, msg: 'Authentication failed. User not found.'});
    }
    else {
        // check if password matches
        username.comparePassword(req.body.password, function (err, isMatch) {
          if (isMatch && !err) {
            // if user is found and password is right create a token

            //ask if is the firs connection

            Connection.findOne({username: req.body.name}, function(err, user) {
              if (err) {console.log(err);}
              if (user)
              {
                console.log("tu connection : " + user.connection);
                currentConnection = user.connection;
                nextConnection = (currentConnection + 1);

                /**
                ** UPDATE connection
                **/
                Connection.update({username : req.body.name},{$set : {"connection": nextConnection }},function(err, user) {
                  if (err) {console.log(err);}
                });

                    var token = jwt.encode(username, config.login.TOKEN_SECRET);
                    // return the information including token as JSON
                    res.send({success: true, msg:'Authentication Successful', token: 'JWT ' + token, connection : currentConnection});
              }
            });

          } else {
            res.send({success: false, msg: 'Authentication failed. Wrong password.'});
          }
        });
    }
  });
};

exports.getProfil = function (req,res){

  getToken = function (headers) {
    if (headers && headers.authorization) {
      var parted = headers.authorization.split(' ');
      if (parted.length === 2) {
        return parted[1];
      } else {
        return null;
      }
    } else {
      return null;
    }
  };

  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.login.TOKEN_SECRET);
    User.findOne({
      username: decoded.username
    }, function(err, user) {
        if (err) throw err;

        if (!user) {
          return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
        } else {
          res.json({success: true, user: user});
        }
    });
  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }


}


exports.status = function (req,res){
  res.json(200, {msg: 'OK' });
}
