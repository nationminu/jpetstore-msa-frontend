var request      = require("request")
  , express      = require("express")
  , morgan       = require("morgan")
  , path         = require("path")
  , bodyParser   = require("body-parser")
  , async        = require("async")
  , cookieParser = require("cookie-parser")
  , session      = require("express-session")
  , config       = require("./config")
  , helpers      = require("./helpers")
  , cart         = require("./api/cart")   
  , category     = require("./api/category")
  , product      = require("./api/product")
  , banner       = require("./api/banner")
  , account      = require("./api/account")
  , item         = require("./api/item")
  , metrics      = require("./api/metrics")
  , app          = express()


app.use(helpers.rewriteSlash);
app.use(metrics);
app.use(express.static("public"));
if(process.env.SESSION_REDIS) {
    console.log('Using the redis based session manager');
    app.use(session(config.session_redis));
}
else {
    console.log('Using local session manager');
    app.use(session(config.session));
}

app.use(bodyParser.json());
app.use(cookieParser());
app.use(helpers.sessionMiddleware);
app.use(morgan("dev", {})); 

var domain = "";
process.argv.forEach(function (val, index, array) {
  var arg = val.split("=");
  if (arg.length > 1) {
    if (arg[0] == "--domain") {
      domain = arg[1];
      console.log("Setting domain to:", domain);
    }
  }
});

/* Mount API endpoints */
app.use(cart);  
app.use(category);
app.use(banner);
app.use(product);
app.use(account);
app.use(item);

app.use(helpers.errorHandler);
 
var server = app.listen(process.env.PORT || 8080, function () {
  var port = server.address().port;
  console.log("App now running in %s mode on port %d", app.get("env"), port);
});
