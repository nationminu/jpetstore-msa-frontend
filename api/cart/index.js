(function (){
  'use strict';

  var async     = require("async")
    , express   = require("express")
    , request   = require("request")
    , helpers   = require("../../helpers")
    , endpoints = require("../endpoints")
    , app       = express()

  // List items in cart for current logged in user.
  app.get("/carts", function (req, res, next) {
    console.log("Request received: " + req.url );
    var custId = helpers.getCustomerId(req, app.get("env"));
    console.log("Customer ID: " + custId);
    request(endpoints.cartsUrl + "/" + custId + "/items", function (error, response, body) {
      if (error) {
        return next(error);
      }
      helpers.respondStatusBody(res, response.statusCode, body)
    });
  });
 
  app.delete("/carts/:itemId/item", function(req, res, next) {
    console.log("Request received: " + req.url);
    var custId = helpers.getCustomerId(req, app.get("env"));
    console.log("Deleting Item " + req.params.itemId);
    var options = {
        uri: endpoints.cartsUrl + "/" + custId + "/item/" + req.params.itemId,
        method: 'DELETE'
    };
    request(options, function(error, response, body) {
        if (error) {
            return next(error);
        }
        helpers.respondSuccessBody(res, JSON.stringify(body));
    }.bind({
        res: res
    }));
  });
  

  app.post("/carts", function(req, res, next) {
    console.log("Received login request");

    async.waterfall([
            function(callback) {
                var custId = helpers.getCustomerId(req, app.get("env")); 
                console.log(custId);  
                var options = { 
                  uri: endpoints.cartsUrl + "/" + custId,
                  method: 'POST',
                  json: true,
                  body: req.body
                };
                request(options, function(error, response, body) {
                    if (error) {
                        callback(error);
                        return;
                    }
                    if (response.statusCode == 200 && body != null && body != "") {
                        console.log(body);  
                        callback(null, custId);
                        return;
                    }
                    console.log(response.statusCode);
                    callback(true);
                });
            },
            function(custId, callback) {
                var sessionId = req.session.id;
                callback(null, custId);
            }
        ],
        function(err, custId) {
            if (err) {
                console.log("Error with log in: " + err);
                res.status(401);
                res.end();
                return;
            }
            res.status(200);
            res.cookie("carted_in", req.session.id , {
                maxAge: 3600000
            }).send('Cookie is set');
            
            console.log("Sent cookies.");
            res.end();
            return;
        });
  });
 
  app.post("/cartsold", function(req, res, next) {

      console.log("Request received: " + req.url);
      var custId = helpers.getCustomerId(req, app.get("env")); 
  
      var options = {
        uri: endpoints.cartsUrl + "/" + custId,
        method: 'POST',
        json: true,
        body: req.body
      };  
      
      request(options, function(error, response, body) {
          if (error) {
              return next(error);
          }
          console.log('Account item with status: ' + response.statusCode);
          if(response.statusCode == 200){
            helpers.respondSuccessBody(res, JSON.stringify(body));
          }else{
            return next(response.statusCode);
          }
      }.bind({
          res: res
      }));
  });


  app.post("/carts/update", function(req, res, next) {
    console.log("Request received: " + req.url + ", " + req.query.custId);
    var custId = helpers.getCustomerId(req, app.get("env")); 

    var options = {
      uri: endpoints.cartsUrl + "/" + custId + "/update",
      method: 'POST',
      json: true,
      body: req.body
    };  
    
    request(options, function(error, response, body) {
        if (error) {
            return next(error);
        }
        console.log('Account item with status: ' + response.statusCode);
        if(response.statusCode == 200){
          helpers.respondSuccessBody(res, JSON.stringify(body));
        }else{
          return next(response.statusCode);
        }
    }.bind({
        res: res
    }));
});
  
  module.exports = app;
}());
