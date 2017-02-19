var api = require('./controllers.login.js');
var passport = require('passport');

var routes = function (app) {

  app.post('/api/signup/',api.signup);
  app.post('/api/login/',api.login);
  app.get('/api/getProfil/',passport.authenticate('jwt', {session: false}),api.getProfil);
  app.post('/api/saveContacts/',api.saveContacts);
  app.post('/api/savePosition/',api.savePosition);
  app.delete('/api/deletePosition/:position_date',api.deletePosition);
  app.get('/api/fetchContacts/',api.fetchContacts);
  app.get('/api/fetchDetails/:phone_no',api.fetchDetails);
  app.get('/',api.status);

};

module.exports = routes;
