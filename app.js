
var express = require('express');
var app = express();

var welcome = require('./welcome');
var quizzes = require('./quizzes');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/:id', quizzes.show);
app.get('/', welcome.show);

app.listen(8080);
