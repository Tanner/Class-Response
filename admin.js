
var redis = require("redis");

function index(req, res) {
	var client = redis.createClient();

	client.on("error", function(error) {
		console.log("Error connection to db");
	});

	client.on("connect", function(error) {
		getQuizzes(client, function(err, quizzes) {
			if (err) {
				console.log(err);
				return;
			}

			data = {quizzes: quizzes};

			res.render('admin', data, function(err, html) {
				if (err) {
					console.log(err);
					return;
				}

				res.send(html);

				client.quit();
			});
		});
	});
}

function getQuizzes(client, callback) {
	client.lrange("quizzes", 0, -1, function(err, reply) {
		quizzes = [];

		if (err) {
			return callback(err, null);
		}

		if (reply) {
			reply.forEach(function(id) {
				getQuiz(client, id, function(err, quiz) {
					if (err) {
						return callback(err, null);
					}

					quizzes.push(quiz);

					if (quizzes.length == reply.length) {
						return callback(null, quizzes);
					}
				});
			});
		}
	});
}

function getQuiz(client, id, callback) {
	var quiz = {};

	quiz.id = id;

	client.hget("quiz:" + id, "name", function(err, reply) {
		if (err) {
			return callback(err, quiz);
		}

		quiz.name = reply;

		return callback(null, quiz);
	});
}

exports.index = index;
