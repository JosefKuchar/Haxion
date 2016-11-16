var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);

app.get("/", function(req, res){
    res.sendFile(__dirname + "/public/index.html");
});

// Serve from public
app.use(express.static(__dirname + "/public"));

// Set port to 5000
http.listen(5000);