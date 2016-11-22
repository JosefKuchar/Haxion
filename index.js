// Third party modules
const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const mongojs = require("mongojs");
const parseArgs = require("minimist");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const flash = require('connect-flash');

// Passport
const passport = require("passport");
const session = require("express-session");

const RedisStore = require('connect-redis')(session)
const redisUrl = require("redis-url");

const configDB = require("./config/database.js");
require('./config/passport.js')(passport);

// Conect to DB
mongoose.connect(configDB.url);

// Redis
const sessionStore = new RedisStore({ client: redisUrl.connect(process.env.REDIS_URL)});

// HTTP Body parser
app.use(bodyParser.urlencoded({ extended: true }));

// Express session middleware
app.use(session({
    secret: "ilovescotchscotchyscotchscotch",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.ENVIRONMENT !== 'development' && process.env.ENVIRONMENT !== 'test',
        //maxAge: 2419200000
        expires: false
    },
}));

var User = require("./app/models/user.js");



// Initialize Passport session
app.use(session({ 
    secret: 'ilovescotchscotchyscotchscotch', 
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


// My files
var commands = require("./app/commands.js");

// Set rendering engine to EJS
app.set("views", __dirname + "/app/views");
app.set("view engine", "ejs");

// Serve from public
app.use(express.static(__dirname + "/public"));

// Set port to 5000
http.listen(5000);

// Routes 
require("./app/routes.js")(app, passport);

var SOCKET_LIST = [];

io.sockets.on("connection", function(socket) {
    console.log("new connection!");

    socket.on("terminal", function(data) {
        var output = runCommand(parseArguments(data));

        socket.emit("terminal", output);
    }); 

    require("./app/irc.js")(io, socket);
});

function runCommand(args) {
    if(commands[args._[0]]) {
        //TODO: Do command
        return null;
    } else if (args._[0] === undefined) {
        return null;
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

