module.exports = function(io, socket) {
    socket.on("irc", function(data) {
        parseInput(data, io, socket);
    })

    socket.irc = {
        currentRoom: ""
    };
};

function parseInput(data, io, socket) {
    // Check if it's command
    if(data[0] === "/")
    {
        // Get command position end
        var position = data.indexOf(" ");

        //Check if position exists
        if(position !== -1)
        {
            // Get command
            var command = data.substr(1, position - 1);

            // Get value
            var value = data.substr(position + 1, data.length - 1);

            console.log(command + ", " + value);
            // Call command
            doCommand(command, value, socket);
        } else {

        }
    } else {
        io.to("irc-" + socket.irc.currentRoom).emit("irc", data);
    }
}

function doCommand(data, value, socket) {
    if(data === "join") {
        socket.leave("irc-" + socket.irc.currentRoom);
        socket.join("irc-" + value);
        socket.irc.currentRoom = value;
    } else if (data === "help") {

    }
}