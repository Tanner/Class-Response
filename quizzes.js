
var sockets = require('./sockets');

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

	sockets.emit('quiz', { id: id });
}

exports.show = show;
