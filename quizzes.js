
var sockets = require('./sockets');

function show(req, res) {
	var id = req.params.id;
	
	res.render('quiz', 
		{ id: id },
		function(err, html) {
			if (err) {
				console.log(err);
				return;
			}

			res.send(html);
		}
	);

	var io = sockets.startSocketServer();
	io.sockets.on('connection', function (socket) {
		socket.emit('quiz', {
			id: id
		});
	})
}

exports.show = show;
