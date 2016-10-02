var http = require('http');

var config = require('./helpers/config');
var routes = require('./routes/index');

var app = http.createServer(routes.processRequest);

app.listen(config.port, function(err){
    if(err){
      console.log(err);
    }
    else {
      console.log("Listening at port 8000!");
    }
});
