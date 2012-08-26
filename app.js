
var express = require('express');
var app = express();
var server = app.listen(8000);
var io = require('socket.io').listen(server);

var welcome = require('./welcome');
var quizzes = require('./quizzes');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/:id', quizzes.show);
app.get('/', welcome.show);

io.sockets.on('connection', function(socket) {
	socket.emit('news', { hello: 'world' });
	socket.on('my other event', function(data) {
		console.log(data);
	});
});

