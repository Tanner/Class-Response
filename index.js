
var express = require('express');
var app = express();

var welcome = require('./welcome');
var quizzes = require('./quizzes');

// ClassResponse::Application.routes.draw do
//   constraints(:id => /[0-9]+/) do
//     match ':id' => 'quizzes#show'
//     match ':id/submit/' => 'quizzes#submit'
//     match ':id/json/:time' => 'quizzes#json'
//     match ':id/csv' => 'quizzes#csv'
//   end
  
//   root :to => 'welcome#index'

app.get('/', welcome.show);
app.get('/:id', quizzes.show);

app.listen(8080);
