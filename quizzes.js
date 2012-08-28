
var database = require("./database");
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

	var databaseClient = database.createClient();
	var io = sockets.startSocketServer();

	databaseClient.on("connect", function(error) {
		io.sockets.on('connection', function (socket) {
			database.getQuiz(databaseClient, id, function (err, quiz) {
				socket.emit('quiz', quiz);
			});
		});
	});
}

exports.show = show;
