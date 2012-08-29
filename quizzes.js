
var redis = require("redis");

var quiz = require("./models/quiz.js");
var sockets = require('./sockets.js');

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

	var client = redis.createClient();
	var io = sockets.startSocketServer();

	client.on("connect", function(error) {
		io.sockets.on('connection', function (socket) {
			quiz.getQuiz(client, id, function (err, quiz) {
				socket.emit('quiz', quiz);
			});
		});
	});
}

exports.show = show;
