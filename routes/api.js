/* initialize MongoDatabase */ 
var db = require('../db/config/db.js');
var mongoose = require('mongoose');
//add in DB models
require('../db/models/Users');
var User = mongoose.model('User');
require('../db/models/Events');
var Event = mongoose.model('Event');
//connection point for DB to server
mongoose.connect('mongodb://localhost:27017/users');


//mailer
nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user:'PickUpGamesHelp@gmail.com',
    pass: 'PUG1234567'
  }
});



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
  Data = req.body;
  User.findOne({ username : Data.username}, function(err, user){
    if (user)
    {
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
  User.findOne({username: req.session.username}, function(err, user){
    if (type=="P")
    {
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

//adds a new event to the database
function createEvent(username, newEvent,callback){
  console.log("EVENTCREATED = "+newEvent.eventName);
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

//Logins the user
exports.login = function(req, res){
  console.log("TRIED TO LOGIN | _id=" + req.body.username + " _pwd=" + req.body.password);
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
      // console.log("ERROR | " + err);
    }
    else {
      // console.log("REGISTER | OK");
      req.session.username = user.username;
      res.locals.user = user;
      res.json(true);
    }

  });
};

//remove all users
exports.clear = function (req, res) {
    User.remove({}, true);
    res.json(true);
};

//returns user information to profile page
exports.profile = function(req, res){
   User.findOne({username: req.session.username}, function(err, user){
    res.send({ user: user });
   });
};

//modifies user information on profile page
exports.editprofile = function(req, res){
  var name = req.params.name;
  if (name == "A")
  {
    verifyProfile(req, function(newreq, status,user){

    res.req.session.username = newreq.session.user.username;
    res.send({ status: status });
  });  
  }
  else
    {edit(name, req, function(status, user){
      res.send({user:user});
    });}
};

// Sends a message to developers
exports.contact = function(req, res){
  var data = req.body;
    // console.log(data);
    transporter.sendMail({
        from: 'PickUpGamesHelp@gmail.com',
        to: 'PickUpGamesHelp@gmail.com',
        subject: 'Message from ' + data.contactName,
        text: data.contactMsg
    }
    // , function(err, info)
    // {
    //   console.log(err);
    //   console.log(info);
    // }
    );
 
    res.json(data);
}

//*********************************************************************************************************
//_________________________________________________EVENTS___________________________________________________
//*********************************************************************************************************
// GET
//returns all event
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
      events: db,
      user: req.user
    });
  }); 
};

//returns a single event that was requested
exports.event = function (req, res) {
/* MongoDB */
  var id = req.params.id
  if (id)
  {
    Event.find({"_id": id}, function(err, event){
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
//adds an event
exports.addEvent = function (req, res) {

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

// allows he user to attend an event
exports.attendEvent = function (req, res) {
  var id = req.params.id
  if (id) {
    Event.findOne({ _id : id }, function (err, event){
      if (event.guests < event.maxGuests)
      {
        event.guests += 1;
        event.save();
        User.findOne({username: req.session.username}, function(err, user){
          user.regEvents.push(id);
          user.save();
        });
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

//This function lets the user remove himself from the event
exports.cancelEvent = function (req, res) {
  var id = req.params.id
  if (id) {
    Event.findOne({ _id : id }, function (err, event){
      if (event.guests > 0)
      {
        event.guests -= 1;
        event.save();
        User.findOne({username: req.session.username}, function(err, user){
          user.regEvents.splice(user.regEvents.indexOf(id),1);
          user.save();
        });
        res.json(true);
      }
      else
      {
        res.send({user: user});
      }
    });
  } else {
    res.send({error: true});
  }
};

// commenting import and export to database. 
// also updates the user with the latest comments when submitted
exports.comment = function (req, res) {
  var id = req.params.id
  if (id) {
    Event.findOne({ _id : id }, function (err, event){
      if (event)
      {
        // console.log(req.body.comment);
        event.comments.push(req.body.comment);
        event.save();
        res.json({event:event});
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