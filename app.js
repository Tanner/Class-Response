
var express = require('express');
var app = express();
var server = app.listen(8000);
var io = require('socket.io').listen(server);
var consolidate = require('consolidate');

var welcome = require('./welcome');
var quizzes = require('./quizzes');
var admin = require('./admin');

app.engine('jade', consolidate.jade);
app.set('view engine', 'jade');

app.set('views', __dirname + '/views');
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

