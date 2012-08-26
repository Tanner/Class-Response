
function show(req, res) {
	// res.send('hello there');
	res.render('welcome', function(err, html) {
		res.send(html);
	});
}

exports.show = show;
