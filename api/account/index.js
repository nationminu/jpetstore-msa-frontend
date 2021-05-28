(function (){
  'use strict';
 
  var async = require("async"), express = require("express"), request = require("request"), endpoints = require("../endpoints"), helpers = require("../../helpers"), app = express(), cookie_name = "logged_in"
 
  app.get("/accounts", function(req, res, next) {
    helpers.simpleHttpRequest(endpoints.accountUrl, res, next);
  });

  app.get("/accounts/:id", function(req, res, next) {
    helpers.simpleHttpRequest(endpoints.accountUrl + "/" + req.params.id, res, next);
  });
  
  app.get("/profile/:id", function(req, res, next) {  
    var custId = helpers.getCustomerId(req, app.get("env"));
    var authToken = helpers.getAuthToken(req, app.get("env")); 

    var options = {
      headers: {
          'Authorization': authToken
      },
      uri: endpoints.profileUrl + "/" + custId,
      method: 'GET'
    };
    request(options, function (error, response, body) {
      if (error) {
        return next(error);
      }
      console.log('Account data with status: ' + response.statusCode);
      helpers.respondStatusBody(res, response.statusCode, body)
    });  
  }); 

  app.get("/customer/:id", function(req, res, next) {
    console.log("Request received: " + req.url + ", " + req.query.custId);
    var custId = helpers.getCustomerId(req, app.get("env"));
    var authToken = helpers.getAuthToken(req, app.get("env"));
    
    console.log("Customer ID: " + custId);
    console.log("Customer ID: " + authToken);

    var options = {
      headers: {
          'Authorization': authToken
      },
      uri: endpoints.accountUrl + "/" + custId,
      method: 'GET'
    };
    request(options, function (error, response, body) {
      if (error) {
        return next(error);
      }
      console.log('Account data with status: ' + response.statusCode);
      helpers.respondStatusBody(res, response.statusCode, body)
    }); 
  });

  app.get("/signon/:id", function(req, res, next) {
    helpers.simpleHttpRequest(endpoints.signonUrl + "/" + req.params.id, res, next);
  });
 
  app.get("/signin/:id", function(req, res, next) {
    console.log("Received login request");

    async.waterfall([
            function(callback) {
                var options = {
                    headers: {
                        'Authorization': req.get('Authorization')
                    },
                    uri: endpoints.accountUrl + '/' + req.params.id
                };
                request(options, function(error, response, body) {
                    if (error) {
                        callback(error);
                        return;
                    }
                    if (response.statusCode == 200 && body != null && body != "") {
                        console.log(body);
                        var customerId = JSON.parse(body).userid;
                        console.log(customerId);
                        req.session.customerId = customerId; 
                        req.session.token = req.get('Authorization'); 
                        callback(null, customerId);
                        return;
                    }
                    console.log(response.statusCode);
                    callback(true);
                });
            },
            function(custId, callback) {
                var sessionId = req.session.id;
                console.log("Merging carts for customer id: " + custId + " and session id: " + sessionId);

                var options = {
                    uri: endpoints.cartsUrl + "/" + custId + "/merge" + "?sessionId=" + sessionId,
                    method: 'GET'
                };
                request(options, function(error, response, body) {
                    if (error) {
                        // if cart fails just log it, it prevenst login
                        console.log(error);
                        //return;
                    }
                    console.log('Carts merged.');
                    callback(null, custId);
                });
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
            res.cookie(cookie_name, req.session.id , {
                maxAge: 3600000
            }).send('Cookie is set');
            
            console.log("Sent cookies.");
            res.end();
            return;
        });
  });


  app.post("/signup", function(req, res, next) {
      var options = {
        uri: endpoints.accountUrl,
        method: 'POST',
        json: true,
        body: req.body
      };  

      console.log("Posting Account: " + JSON.stringify(req.body));

      request(options, function(error, response, body) {
          if (error) {
              return next(error);
          }
          console.log('Account data with status: ' + response.statusCode);
          if(response.statusCode == 201){
            helpers.respondSuccessBody(res, JSON.stringify(body));
          }else{
            return next(response.statusCode);
          }
      }.bind({
          res: res
      }));
  });


  app.post("/signup/:id", function(req, res, next) {
    var custId = helpers.getCustomerId(req, app.get("env"));  
    var authToken = helpers.getAuthToken(req, app.get("env")); 
    var username, password;

    if(req.params.id != custId) return false;

    console.log(authToken);

    var options = {
      headers: {
          'Authorization': authToken
      },
      uri: endpoints.accountUrl + '/' + custId,
      method: 'POST',
      json: true,
      body: req.body
    };  

    console.log("signon = " + req.body.signon);     

    if(req.body.signon != undefined){
      password = req.body.signon.password;
    } 

    console.log("password = " + password);     

    console.log("Posting Account: " + JSON.stringify(req.body));

    request(options, function(error, response, body) {
        if (error) {
            return next(error);
        }
        console.log('Account data with status: ' + response.statusCode);
        if(response.statusCode == 201){
          if(password != undefined){
            console.log("old Token = " + authToken);     
            req.session.token = "Basic " + btoa(custId + ":" + password)     
            console.log("new Token = " + req.session.token);     
          }
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
