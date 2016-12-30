var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var http     = require('http');
var compression = require('compression');
var bodyParser   = require('body-parser');

var path = require('path');

var server = http.createServer(app);

// set up our express application

app.use(bodyParser()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true}));
app.use(compression());	

// routes ======================================================================
app.use(express.static(path.join(__dirname, 'src')));

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send({
        message: err.message,
        error: {}
    });
});

server.listen(port);
console.log("Server started on port " + port+"...");
