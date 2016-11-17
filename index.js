// Third party modules
var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var parseArgs = require('minimist');

//My files
var commands = require("./js/commands.js");

console.log(commands);

app.get("/", function(req, res){
    res.sendFile(__dirname + "/public/index.html");
});

// Serve from public
app.use(express.static(__dirname + "/public"));

// Set port to 5000
http.listen(5000);

io.sockets.on("connection", function(socket) {
    console.log("new connection!");

    socket.on("terminal", function(data) {
        var output = runCommand(parseArguments(data));

        socket.emit("terminal", output);
    }); 
});

function runCommand(args) {
    if(commands[args._[0]]) {
        //TODO: Do command
        return "";
    } else {
        return "bash: " + args._[0] + ": command not found";
    }
}

function parseArguments(line) {
    // Split line to array by space
    var argumentsArray = line.split(" ").filter(n => n);
    
    // Parse arguments by minimist package
    return parseArgs(argumentsArray);
}