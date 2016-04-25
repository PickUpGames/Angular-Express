
/**
 * Module dependencies
 */

var express = require('express'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  routes = require('./routes'),
  api = require('./routes/api'),
  path = require('path');


//implements user sessions
var expressSession = require('express-session');

//initalize the app
var app = module.exports = express();

/**
 * Configuration
 */

// all environments
var port = process.env.PORT || 8080;
app.set('port', port);
app.set('views', __dirname + '/views'); //sets the view file paths
app.set('view engine', 'jade'); // uses jade files, google htmltojade
app.use(bodyParser());
app.use( require('cookie-parser')());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use( expressSession({
  secret: 'somesecretrandomstring'
}));



//login checker @ routes ->  api.js
app.use(api.checkIfLoggedIn);


//use this function in routes down below that you want user-only
//also need to add angular controllers to handle pathing
function requireUser(req, res, next){
  if (!req.user) {
    //throw authorization error
    res.status(401).send({ error: "ERR"});
  } else {
    next();
  }
}

// Routes
//takes http calls from Angular controllers and directs 
//  page calls to the routes/index
//  database calls to routes/api


app.get('/', routes.index);
app.get('/partials/:name', routes.partials);  
app.get('/profile/:name', routes.profile);
app.get('/event/:name', routes.event);
app.get('/user/:name', routes.user);


// JSON API

//posts
app.get('/api/posts', api.posts); //return all posts from db
app.get('/api/post/:id', api.post); //return specific post from db
app.post('/api/post', requireUser, api.addPost); //add new post to db
app.put('/api/post/:id', api.editPost);  //edit existing post in db
app.delete('/api/post/:id', api.deletePost); //remove post from db

//events
// app.get('/api/events', api.events); //return all events from db
// app.get('/api/event/:id', api.events); //return specific event from db
app.post('/api/event', requireUser, api.addEvent); //add new event to db
// app.put('/api/event/:id', api.editEvent);  //edit existing event in db
// app.delete('/api/event/:id', api.deleteEvent); //remove event from db


app.post('/api/login', api.login);
app.post('/api/register', api.register)
app.delete('/api/clear', api.clear)


// redirect all others to the index (HTML5 history)
app.get('*', routes.index);


/**
 * Start Server
 */

app.listen(port);
console.log('Magic happens on port ' + port);