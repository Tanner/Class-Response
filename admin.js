
var redis = require("redis");

function index(req, res) {
	var client = redis.createClient();

	client.on("error", function(error) {
		console.log("Error connection to db");
	});

	client.on("connect", function(error) {
		client.lrange("quizzes", 0, -1, function(err, reply) {
			res.send(reply);
			client.quit();
		});
	});
}

exports.index = index;
