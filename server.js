// server.js

// set up ========================
var express = require('express');
var app = express(); // create our app w/ express
var server = require('http').Server(app);
var io = require('socket.io')(server);

// configuration =================

app.configure(function() {
	app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
	app.use(express.logger('dev')); // log every request to the console
	app.use(express.bodyParser()); // pull information from html in POST
});

app.get('*', function(req, res) {
	res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});


// listen (start app with node server.js) ======================================
var numConnections = 0;
var reportedScores;
var winner = {'socket': null, 'score': 0};

io.on('connection', function(socket){
	console.log('Connection established, socket id ' + socket.id);
    numConnections++;

    socket.on('board-update', function(data){
        console.log('board-update recieved with data: ' + data.row + " " + data.col + " " + data.tileValue);
        console.log('broadcasting new board info to all clients from ' + socket.id);
        socket.broadcast.emit('board-update', data);
    });

    socket.on('send-score', function(score){
        reportedScores++;

        if(score > winner.score){
            winner.socket = socket;
            winner.score = score;
        }
    });

    socket.on('disconnect', function(){
        numConnections--;
    });
});


// Rounds.
var timer = 60;
setInterval(function(){
    timer--;

    io.emit('timer-update', timer);

    if(timer == 0) {
        console.log("Round end.");

        timer = 60;

        reportedScores = 0;
        winner.score = -1;

        var waitInt;

        io.emit('round-end');

        var waitForScores = function () {
            console.log("Waiting for scores... (" + reportedScores + "/" + numConnections + ")");

            if (reportedScores == numConnections) {
                console.log("All scores received! Sending win/loss messages.");

                winner.socket.emit('round-end-win');
                winner.socket.broadcast.emit('round-end-lose');

                clearInterval(waitInt);

                return true;
            } else {
                return false;
            }
        };

        waitInt = setInterval(waitForScores, 1000);
    }
}, 1000);

server.listen(8080);
console.log("App listening on port 8080");
