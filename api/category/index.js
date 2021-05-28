(function (){
  'use strict';

  var express   = require("express")
    , request   = require("request")
    , endpoints = require("../endpoints")
    , helpers   = require("../../helpers")
    , app       = express()

 
  app.get("/categories", function(req, res, next) {
    helpers.simpleHttpRequest(endpoints.categoryUrl, res, next);
  });

  app.get("/categories/:id", function(req, res, next) {
    helpers.simpleHttpRequest(endpoints.categoryUrl + "/" + req.params.id, res, next);
  });  

  app.get("/categories/:id/products", function(req, res, next) {
    helpers.simpleHttpRequest(endpoints.categoryUrl + "/" + req.params.id + '/products', res, next);
  });

  module.exports = app;
}());
