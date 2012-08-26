
function show(req, res) {
	var id = req.params.id;
	
	res.render('default_layout', 
		{ id: id },
		function(err, html) {
			if (err) {
				console.log(err);
				return;
			}

			res.send(html);
		}
	);
}

exports.show = show;
