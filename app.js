
var express = require('express');
var app = express();
var server = app.listen(8000);
var consolidate = require('consolidate');

var sockets = require('./sockets');
var welcome = require('./welcome');
var quizzes = require('./quizzes');
var admin = require('./admin');

sockets.startSocketServer(app);

app.engine('jade', consolidate.jade);
app.set('view engine', 'jade');

app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.get('/', welcome.show);
app.get('/admin', admin.index);
app.get('/quiz/:id', quizzes.show);
