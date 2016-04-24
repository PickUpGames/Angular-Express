
/*
 * GET home page.
 */

exports.index = function(req, res){
	if (req.user)
	{
		var user = JSON.stringify(req.user.username); 
  		console.log("USER = " +user);	
	}
  res.locals.user = user;
  res.render('index');
};

exports.partials = function (req, res) {
  var name = req.params.name;
  res.render('partials/post/' + name);
};

exports.profile = function (req, res) {
  var name = req.params.name;
  res.render('partials/profile/' + name);
};


exports.login =function (req, res){
	res.render('partials/user/login');
};

exports.register =function (req, res){
	res.render('partials/user/register');
};

exports.logout = function(req, res){
  req.session.destroy();
  //delete req.user;
  res.redirect('/register');
};