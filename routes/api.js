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


// Helper functions

function authenticateUser(username, password, callback){
  User.findOne({username: username, password:password}, function(err, user){
    callback("User not found with username/password", user);
  });
}




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
      posts: posts
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


exports.tryLogin = function(req, res){
  console.log("TRIED TO LOGIN | _id=" + req.body.username + " _pwd=" + req.body.password);
  var username = req.body.username;
  var password = req.body.password;
  
  authenticateUser(username, password, function(err, user){
    if (user) {
      // This way subsequent requests will know the user is logged in.
      req.session.username = user.username;
      res.json(true);
      console.log("GOT IN | _id=" +username);
    } else {
      console.log("NOPE= " + err);
      res.status(400).send({ error: err });
      //res.render('partials/addPost', {error: err});
    }
  });

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