
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

/**
 * Gets all the quizzes from the database.
 * @param  {Object}		client		Redis Client
 * @param  {Function}	callback	Function for callback taking in err and reply
 * @return {array}					Array of quiz objects
 */
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

/**
 * Get the data for a specific quiz ID.
 * @param  {Object}   client   Redis Client
 * @param  {Object}   id       ID of a quiz
 * @param  {Function} callback Function callback taking in an err and quiz
 * @return {Object}            Object containing id and name fields
 */
function getQuiz(client, id, callback) {
	var quiz = {};

	client.hgetall("quiz:" + id, function(err, reply) {
		if (err) {
			return callback(err, null);
		}

		quiz.id = id;
		quiz.name = reply.name;

		return callback(null, quiz);
	});
}

exports.index = index;
