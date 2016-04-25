/* initialize MongoDatabase */ 

var db = require('../db/config/db.js');
var mongoose = require('mongoose');

require('../db/models/Users');
var User = mongoose.model('User');
require('../db/models/Events');
var Event = mongoose.model('Event');
require('../db/models/Posts');
var Post = mongoose.model('Post');
mongoose.connect('mongodb://localhost:27017/users');


// Middleware - App checks for user before using any routes


//if logged in, makes sure client alway knows
exports.checkIfLoggedIn = function(req, res, next){
  if (req.session && req.session.username) {
    User.findOne({username: req.session.username}, function(err, user){
      if (!user) { 
        req.session.destroy();
        //res.redirect('/login');  //this does not work, because the server cannot manipulate client side, only angular can.
      }
      else
      {

        req.user = user; 
        delete req.user.password;
        req.session.user = req.user;
        res.locals.user = user;
      }
      next();
    });
  } else {
    next();
  }
}

// Helper functions


function authenticateUser(username, password, callback){
  User.findOne({username: username, password:password}, function(err, user){
    callback("User not found with username/password", user);
  });
}

//createUser takes in form data and adds a user to the DB 
function createUser(newUser, callback){
  if(newUser.password != newUser.passwordConfirmation){
    var err = 'Passwords do not match';
    callback(err);
  }
  else {
    var query = {username: newUser.username};

    User.findOne(query, function(err,user){
      if(user) {
        err = 'The username you entered is already in use.';
        callback(err);
      }
      else {
        var userData = {
          username: newUser.username,
          name: newUser.name,
          password: newUser.password,
          birthday: newUser.birthday
        };
        var newU = new User(userData);
        newU.save(function(err,user){
          callback(err,user);
        });
      }
    });
  }
}

function createEvent(username, newEvent,callback){
  console.log("EVENTDATE"+newEvent.eventDate);
  var eventData = {

    hostName: username,
    eventName: newEvent.eventName,
    location: newEvent.location,
    eventType: newEvent.eventType,
    eventDate: newEvent.eventDate,
    eventDescription: newEvent.eventDescription,
    guests: 1,
    maxGuests: newEvent.maxGuests
  };


  var newE = new Event(eventData);
  newE.save(function(err,event){
    callback(err,event);
  });
}



//*********************************************************************************************************
//_________________________________________________POSTS___________________________________________________
//*********************************************************************************************************
// GET

exports.posts = function (req, res) {
/* MongoDB */
	Post.find({}, function(err, db){
  	if (err) throw err;
		var posts = []
		db.forEach(function (post) {
	    posts.push({
			  id: post._id,
  		  title: post.title,
        text: post.text.substr(0, 50) + '...'
      });
    });
    res.json({
      posts: posts,
      user: req.session.username
	  });
  });	
};

exports.post = function (req, res) {
/* MongoDB */
	var id = req.params.id
	if (id)
	{
    Post.find({"_id": id}, function(err, post){
      if (err) throw err;
     // console.log(post);
      res.json({
        post: post[0]
      });
    });
	}	else{
		res.json(false);
	}
};


// POST
exports.addPost = function (req, res) {
 	// console.log(req.body);
	var newP = new Post(req.body);
	newP.save();
	res.json(true);
};

// PUT
exports.editPost = function (req, res) {
  var id = req.params.id;

  if (id) {
    Post.findOne({ _id : id }, function (err, post){
      post.title = req.body.title;
      post.text =  req.body.text;
      post.save();
    });
    res.json(true);
  } else {
    res.json(false);
  }
};

// DELETE
exports.deletePost = function (req, res) {
  var id = req.params.id;

  if (id) {
    Post.remove({"_id": id},true);
    res.json(true);
  } else {
    res.json(false);
  }
};

//*********************************************************************************************************
//_________________________________________________USERS___________________________________________________
//*********************************************************************************************************
// 


exports.login = function(req, res){
  // console.log("TRIED TO LOGIN | _id=" + req.body.username + " _pwd=" + req.body.password);
  var username = req.body.username;
  var password = req.body.password;
  
  authenticateUser(username, password, function(err, user){
    if (user) {
      // This way subsequent requests will know the user is logged in.
      req.session.username = user.username;
      res.locals.user = user;
      res.json(true);
      // console.log("GOT IN | _id=" +username);
    } else {
      // console.log("NOPE= " + err);
      res.status(400).send({ error: err });
    }
  });

};


// This check credentials where req.body holds all the form data 
exports.register = function(req, res){
 console.log("REGISTER | _id=" + req.body.username + " _pwd=" + req.body.password);
  createUser(req.body, function(err,user){
    if(err){
      res.status(401).send({ error: err });
      console.log("ERROR | " + err);
    }
    else {
      console.log("REGISTER | OK");
      req.session.username = user.username;
      res.json(true);
    }

  });
};

//remove all users
exports.clear = function (req, res) {
//  console.log("I DID MY JOB");
    User.remove({}, true);
    res.json(true);
};

//*********************************************************************************************************
//_________________________________________________EVENTS___________________________________________________
//*********************************************************************************************************
// GET
exports.events = function (req, res) {
/* MongoDB */
  Event.find({}, function(err, db){
    if (err) throw err;
    var events = []
    db.forEach(function (event) {
      events.push({
        id: event._id,
        title: event.eventName
        // ,pic: event.picture
      });
    });
    res.json({
      events: events,
      user: req.user
    });
  }); 
};

exports.event = function (req, res) {
/* MongoDB */
  var id = req.params.id
  // console.log(req.params.id);
  if (id)
  {
    Event.find({"_id": id}, function(err, event){
      // console.log(event.eventName);
      if (err) throw err;
      res.json({
        event: event[0]
      });
    });
  } else{
    res.json(false);
  }
};


// POST

exports.addEvent = function (req, res) {
  // console.log(req.body);

  if(req.user){
    var username = req.user.username;
    createEvent(username, req.body ,function(err,event){
      if(err){
        res.status(400).send({ error: err });
      }
      else{
        res.redirect('/event/view/'+event._id); //this line is possibly wrong
      }
    });
  }

};

exports.attendEvent = function (req, res) {
  // console.log(req.body);
  var id = req.params.id
  // console.log(req.params.id);
  if (id) {
    Event.findOne({ _id : id }, function (err, event){
      event.guests += 1;
      event.save();
    });
    res.json(true);
  } else {
    res.json(false);
  }
};

// PUT

// DELETE


