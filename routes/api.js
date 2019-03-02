module.exports = (app) => {

  var ServiceController = app.controllers.service;

  var api_root_v1 = '/api/v1';

  /* API */
  app.get('/', ServiceController.index);
  app.get(api_root_v1 + '/version', ServiceController.version);
  
}