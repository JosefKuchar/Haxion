//Init and connect to server
var socket = io();

//Components
Vue.component("terminal", {
    template: "#terminal-template",
    data: function() {
        return {
            input: "",
            ps1: "user@127.0.0.1:/$ ",
            lines: []
        };
    },
    methods: {
        send: function() {
            // Check if it's clear command
            if(this.input === "clear")
            {
                this.lines = [];
                this.input = "";
                return;
            }

            // Add line
            this.lines.push(this.ps1 + this.input);
            // Send terminal text to server
            socket.emit("terminal", this.input);
            // Reset input
            this.input = "";
        },
        focus: function() {
            //FIXME: On focus
            //this.$el.querySelector(".terminal-field").focus();
        }
    },
    created: function() {
        socket.on("terminal", function(data) {
            this.lines.push(data);
        }.bind(this));
    }
});

Vue.component("irc", {
    template: "#irc-template",
    data: function() {
        return {
            input: "",
            lines: []
        };
    },
    methods: {
        send: function() {
            // Send command
            socket.emit("irc", this.input);

            // Reset input
            this.input = "";
        }
    },
    created: function() {
        socket.on("irc", function(data) {
            var now = new Date();
            var time = now.getHours() + ":" + now.getMinutes();

            this.lines.push(time + " -!- " + data);
        }.bind(this));
    }
});

//VueJs
var app = new Vue({
    el: "#app"
});