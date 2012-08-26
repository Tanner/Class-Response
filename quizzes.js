
function show(req, res) {
	var id = req.params.id;
	
	res.send('quiz id ' + id);
}

exports.show = show;
