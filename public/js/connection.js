
var socket = io.connect('http://localhost');

socket.on('connect', function (data) {
	console.log('Connected');
});

socket.on('quiz', function (data) {
	console.log(data);
});
