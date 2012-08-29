
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
		quiz.description = reply.description;

		return callback(null, quiz);
	});
}

exports.getQuizzes = getQuizzes;
exports.getQuiz = getQuiz;
