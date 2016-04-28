/* initialize MongoDatabase */ 

var db = require('../db/config/db.js');
var mongoose = require('mongoose');

require('../db/models/Users');
var User = mongoose.model('User');
require('../db/models/Events');
var Event = mongoose.model('Event');

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


//check for username, if same username, ignore
//if username taken, error
// 
function verifyProfile(req, callback){
  nullUser= {};
  console.log("ID IS "+ req.session.user._id);
  Data = req.body;
  User.findOne({ username : Data.username}, function(err, user){
    if (user)
    {
      // console.log(user._id.toString());
      // console.log(req.session.user._id.toString());
      if (user._id.toString() == req.session.user._id.toString())
      {
        user.name = Data.name;
        user.password = Data.password;
        user.birthday = Data.birthday;
        user.location = Data.location;
        user.save();
        req.session.user.name = Data.name;
        callback(req,"Changes saved!", user);
      }
      else
      {
        callback(req,"Username already taken.", nullUser);
      }
    }
    else
    {
        User.findOne({ _id : req.session.user._id}, function(err, nuser){
        nuser.name = Data.name;
        nuser.username = Data.username;
        nuser.password = Data.password;
        nuser.birthday = Data.birthday;
        nuser.location = Data.location;
        nuser.save();
        req.session.user.username = Data.username;
        callback(req,"Username changed!", nuser);
        });
    }
    
  });
}

//update tags
function edit(type, req, callback){
  Data = req.body;
  console.log("USer is " + req.session.username);
  User.findOne({username: req.session.username}, function(err, user){
    if (type=="P")
    {
      console.log("tags are " + Data);
      user.tag = Data;
      user.save();
    }    
    callback("Preferences changed!", user);
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
  var tag = newEvent.tag.split(',');
  var sorted = [];
  for (var i = 0; i < tag.length; i++) {
    sorted.push(tag[i].trim().toLowerCase());
  }
  sorted.sort();
  var eventData = {

    hostName: username,
    eventName: newEvent.eventName,
    location: newEvent.location,
    eventType: newEvent.eventType,
    eventDate: newEvent.eventDate,
    eventDescription: newEvent.eventDescription,
    guests: 1,
    maxGuests: newEvent.maxGuests,
    tag: sorted
  };


  var newE = new Event(eventData);
  newE.save(function(err,event){
    callback(err,event);
  });
}





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
    User.remove({}, true);
    res.json(true);
};

exports.profile = function(req, res){
   User.findOne({username: req.session.username}, function(err, user){
    res.send({ user: user });
   });
};


exports.editprofile = function(req, res){
  var name = req.params.name;
  console.log(name);
  console.log("HEREW" + req.body);
  if (name == "A")
  {
    verifyProfile(req, function(newreq, status,user){

    res.req.session.username = newreq.session.user.username;
    res.send({ status: status });
  });  
  }
  else
    {edit(name, req, function(status, user){
      console.log("EDIT SOMETHING");
    });}
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
        event: event[0],
        user: req.user
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
        res.status(400).send({ error: err});
      }
      else{
        res.send({ user: req.user});
        // res.redirect('/event/view/'+event._id); //this line is possibly wrong
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
      if (event.guests < event.maxGuests)
      {
        event.guests += 1;
        event.save();
        res.json(true);
      }
      else
      {
        res.send({error: true});
      }
    });
  } else {
    res.send({error: true});
  }
};

// PUT

// DELETE


