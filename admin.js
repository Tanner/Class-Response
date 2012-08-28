
var redis = require("redis");

function index(req, res) {
	var client = redis.createClient();

	client.on("error", function(error) {
		console.log("Error connection to db");
	});

	client.on("connect", function(error) {
		getQuizzes(client, function(quizzes) {
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

		if (reply) {
			reply.forEach(function(id) {
				getQuiz(client, id, function(quiz) {
					quizzes.push(quiz);

					if (quizzes.length == reply.length) {
						return callback(quizzes);
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
			return err;
		}

		quiz.name = reply;

		return callback(quiz);
	});
}

exports.index = index;
