var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;

// load up the user model
var User = require('../app/model.user');
var config = require('./config.login'); // get db config file

module.exports = function(passport) {
  var jwtOptions = {};
  jwtOptions.secretOrKey = config.login.TOKEN_SECRET;

  var strategy = (new JwtStrategy(jwtOptions, function(jwt_payload, done) {

  User.findOne({id: jwt_payload.id}, function(err, user) {
          if (err) {
              return done(err, false);
          }
          if (user) {
              done(null, user);
          } else {
              done(null, false);
          }
      });
  }));
  passport.use(strategy)
};
