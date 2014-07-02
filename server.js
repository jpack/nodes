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
io.on('connection', function(socket){
	console.log('Connection established, socket id ' + socket.id);

    socket.on('board-update', function(data){
        console.log('board-update recieved with data: ' + data.row + " " + data.col + " " + data.tileValue);
        console.log('broadcasting new board info to all clients from ' + socket.id);
        socket.broadcast.emit('board-update', data);
    });
});

server.listen(8080);
console.log("App listening on port 8080");
