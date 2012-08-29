
var redis = require("redis");

var quiz = require('./models/quiz.js');

function index(req, res) {
	var client = redis.createClient();

	client.on("error", function(error) {
		console.log("Error connection to db");
	});

	client.on("connect", function(error) {
		quiz.getQuizzes(client, function(err, quizzes) {
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

function createQuiz(req, res) {
	var client = redis.createClient();

	client.on("error", function(error) {
		console.log(error);
	})

	client.on("connect", function(error) {
		quiz.createQuiz(client, req.body.name, function(err, id) {
			res.writeHead(302, {'Location': '/admin/quiz/' + id});
			res.end();
		})
	});
}

exports.index = index;
exports.createQuiz = createQuiz;