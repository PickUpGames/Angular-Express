
/*
 * GET home page.
 */
//renders index file
exports.index = function(req, res){
	if (req.user)
	{
		var user = JSON.stringify(req.user.username); 
	}
  res.locals.user = user;
  res.render('index');
};


//returns home page
exports.home = function (req, res) {
  res.render('partials/home');
};

//returns home page
exports.search = function (req, res) {
  res.render('partials/search/index');
};



//returns all profile pages
exports.view = function (req, res) {
  res.render('partials/profile/view');
};

//returns all profile pages
exports.profile = function (req, res) {
  var name = req.params.name;
  res.render('partials/profile/' + name);
};

//returns all event pages
exports.event = function (req, res) {
  var name = req.params.name;
  res.render('partials/events/' + name);
};

//returns all user authentication pages
exports.user = function (req, res) {
  var name = req.params.name;
  if (name == 'logout')
  {
    req.session.destroy();
    //delete req.user;
    res.redirect('/register');    
  }
  else
    res.render('partials/user/' + name);
};
