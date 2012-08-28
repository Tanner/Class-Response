
var redis = require("redis");

function index(req, res) {
	var client = redis.createClient();

	client.on("error", function(error) {
		console.log("Error connection to db");
	});

	client.on("connect", function(error) {
		client.lrange("quizzes", 0, -1, function(err, reply) {	
			res.render('admin', { quizzes: reply }, function(err, html) {
				if (err) {
					console.log(err);
					return;
				}

				res.send(html);
			});

			client.quit();
		});
	});
}

exports.index = index;
