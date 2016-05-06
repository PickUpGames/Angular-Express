
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
    // res.redirect('/login');
    // res.json({ error: "Need to login."});
    res.json({ error: 'Need to login.'});
  } else {
    next();
  }
}

// Routes
//takes http calls from Angular controllers and directs 
//  page calls to the routes/index
//  database calls to routes/api

app.get('/', routes.index);     
app.get('/partials/home', routes.home);
app.get('/partials/search', routes.search);
app.get('/profile/view', requireUser, routes.view);
app.get('/profile/:name', routes.profile);
app.get('/event/:name', routes.event);
app.get('/user/:name', routes.user);


// JSON API


//events
app.get('/api/events', api.events); //return all events from db
app.get('/api/event/:id', api.event); //return specific event from db
app.post('/api/event', requireUser, api.addEvent); //add new event to db
app.post('/api/event-attend/:id', requireUser, api.attendEvent);
app.post('/api/comment/:id', requireUser, api.comment)
// app.put('/api/event/:id', api.editEvent);  //edit existing event in db
app.delete('/api/event-cancel/:id', api.cancelEvent); //remove event from user


//user account
app.post('/api/login', api.login);
app.post('/api/register', api.register)
app.delete('/api/clear', api.clear)

//profile
app.get('/api/profile', api.profile); //return user profile from db
app.put('/api/profile/:name', api.editprofile);
app.post('/contact-form', api.contact);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);


/**
 * Start Server
 */

app.listen(port);
console.log('Magic happens on port ' + port);