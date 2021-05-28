(function (){
  'use strict';

  var express   = require("express")
    , request   = require("request")
    , endpoints = require("../endpoints")
    , helpers   = require("../../helpers")
    , app       = express()

 
  app.get("/items", function(req, res, next) {
    helpers.simpleHttpRequest(endpoints.itemUrl, res, next);
  });

  app.get("/items/:id", function(req, res, next) {
    helpers.simpleHttpRequest(endpoints.itemUrl + "/" + req.params.id, res, next);
  });
  app.get("/items/:id/inventories", function(req, res, next) {
    helpers.simpleHttpRequest(endpoints.itemUrl + "/" + req.params.id + '/inventories', res, next);
  });

  module.exports = app;
}());
