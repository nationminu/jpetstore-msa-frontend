(function (){
  'use strict';

  var express   = require("express")
    , request   = require("request")
    , endpoints = require("../endpoints")
    , helpers   = require("../../helpers")
    , app       = express()

 
  app.get("/products", function(req, res, next) {
    helpers.simpleHttpRequest(endpoints.productUrl, res, next);
  });

  app.get("/products/:id", function(req, res, next) {
    helpers.simpleHttpRequest(endpoints.productUrl + "/" + req.params.id, res, next);
  });

  app.get("/products/:id/items", function(req, res, next) {
    helpers.simpleHttpRequest(endpoints.productUrl + "/" + req.params.id + '/items', res, next);
  });

  app.get("/products/filter/:keyword", function(req, res, next) {
    helpers.simpleHttpRequest(endpoints.productUrl + "/filter/" + req.params.keyword, res, next);
  });

  module.exports = app;
}());
