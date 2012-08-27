
var express = require('express');
var app = express();
var server = app.listen(8000);
var io = require('socket.io').listen(server);

var welcome = require('./welcome');
var quizzes = require('./quizzes');
var admin = require('./admin');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/', welcome.show);
app.get('/admin', admin.index);
app.get('/quiz/:id', quizzes.show);

io.sockets.on('connection', function(socket) {
	socket.emit('news', { hello: 'world' });
	socket.on('my other event', function(data) {
		console.log(data);
	});
});

