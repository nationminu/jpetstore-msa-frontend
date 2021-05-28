(function (){
  'use strict';

  var express   = require("express")
    , request   = require("request")
    , endpoints = require("../endpoints")
    , helpers   = require("../../helpers")
    , app       = express()

 
  app.get("/banners", function(req, res, next) {
    helpers.simpleHttpRequest(endpoints.bannerUrl, res, next);
  });

  app.get("/banners/:id", function(req, res, next) {
    helpers.simpleHttpRequest(endpoints.bannerUrl + "/" + req.params.id, res, next);
  });

  module.exports = app;
}());
