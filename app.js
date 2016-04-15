
/**
 * Module dependencies
 */

var express = require('express'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  morgan = require('morgan'),
  routes = require('./routes'),
  api = require('./routes/api'),
  http = require('http'),
  path = require('path');

var expressSession = require('express-session');

var app = module.exports = express();

/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(morgan('dev'));
app.use(bodyParser());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use( expressSession({
  secret: 'somesecretrandomstring'
}));


var env = process.env.NODE_ENV || 'development';


// production only
if (env === 'production') {
  // TODO
}


// Routes

app.get('/', routes.index);
app.get('/partials/:name', routes.partials);  //angular routes to this and routes/index renders the file
app.get('/user/login', routes.user);

// JSON API

app.get('/api/posts', api.posts); //return all posts from db

//same route but different function calls to perform actions on post
app.get('/api/post/:id', api.post); //return specific post from db
app.post('/api/post', api.addPost); //add new post to db
app.put('/api/post/:id', api.editPost);  //edit existing post in db
app.delete('/api/post/:id', api.deletePost); //remove post from db

app.post('/api/login', api.tryLogin);


// redirect all others to the index (HTML5 history)
app.get('*', routes.index);


/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
