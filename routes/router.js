module.exports = (app) => {

  const ServiceController = app.controllers.service;
  const LoginController = app.controllers.login;

  const api_v1 = '/api/v1';

  //API 
  app.get('/', ServiceController.index);
  app.get(api_v1 + '/version', ServiceController.version);

  //Login
  app.get('/init',LoginController.init);
  app.post('/ticket',LoginController.ticket);
  app.post('/login',LoginController.login);
  
}