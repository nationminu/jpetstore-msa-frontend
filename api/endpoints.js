(function (){
  'use strict';

  var util = require('util');

  var domain = ":8080";
  process.argv.forEach(function (val, index, array) {
    var arg = val.split("=");
    if (arg.length > 1) {
      if (arg[0] == "--domain") {
        domain = "." + arg[1];
        console.log("Setting domain to:", domain);
      }
    }
  });

  module.exports = {
    loggedUrl:     util.format("http://accounts%s/customer", domain),
    accountUrl:    util.format("http://accounts%s/accounts", domain),
    profileUrl:    util.format("http://accounts%s/profile", domain),
    signonUrl:     util.format("http://accounts%s/signon", domain),
    itemUrl:       util.format("http://items%s/items", domain),
    productUrl:    util.format("http://products%s/products", domain),
    categoryUrl:   util.format("http://categories%s/categories", domain),
    bannerUrl:     util.format("http://banners%s/banners", domain), 
    cartsUrl:      util.format("http://carts%s/carts", domain),
    ordersUrl:     util.format("http://orders%s", domain)
  };
}());
