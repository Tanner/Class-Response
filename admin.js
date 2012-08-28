
var database = require('./database');

function index(req, res) {
	var client = database.createClient();

	client.on("error", function(error) {
		console.log("Error connection to db");
	});

	client.on("connect", function(error) {
		database.getQuizzes(client, function(err, quizzes) {
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

exports.index = index;
