var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var User = require('./models').User

app.use(express.static('public'))
app.use(bodyParser.json())

app.get('/', function (request, response) {
  response.json({message: 'slowdown mon'})
});

app.post('/test', function(request, response){
  response.json({params: request.body})
})

app.listen(3000, function () {
 console.log('Todo Server listening on port 3000!');
});
