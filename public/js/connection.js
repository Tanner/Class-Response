
var socket = io.connect('http://localhost');

socket.on('connect', function (data) {
	console.log('Connected');
});

socket.on('news', function (data) {
	console.log(data);
	socket.emit('my other event', { my: 'data' });
});
