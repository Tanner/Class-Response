
function show(req, res) {
	res.render('welcome', function(err, html) {
		res.send(html);
	});
}

exports.show = show;
