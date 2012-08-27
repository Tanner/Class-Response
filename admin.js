
var redis = require("redis");

function index(req, res) {
	var client = redis.createClient();

	client.on("error", function(error) {
		console.log("Error connection to db");
	});

	client.on("connect", function(error) {
		console.log("Database is ready.");

		client.llen("quizzes", redis.print);
		client.lrange("quizzes", 0, client.llen("quizzes"), redis.print);

		client.quit();

		res.send("oh hai");
	});
}

exports.index = index;
