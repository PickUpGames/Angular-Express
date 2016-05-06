//Handles our AddEvent Page
function AddEventCtrl($scope, $http, $location) {
  $scope.form = {};
  //submits event to server then redirects
  $scope.submitEvent = function () {
    if ($scope.form.eventName && $scope.form.eventType) {
      $http.post('/api/event', $scope.form).then(
         function(res) {
            if (res.data.user)
            { $location.path('/'); }
            else
            { $location.path('/login'); }
          }
        
      );
    }
    else{
      console.log("Enter name and type.");
    }
  };
}

//handles the main Events page
function EventCtrl($scope, $http) {
  //returns all event data
  $http.get('/api/events').
    success(function(data, status, headers, config) {
      $scope.events = data.events;
      $scope.user = data.user;
      $scope.dbevents = [];
      console.log("HERE");

      for(var i = 0; i < $scope.events.length; i++)
      {
        // Assign a picture to each type of event
        $scope.events[i].eventName = $scope.events[i].eventName.substr(0, 12) + '..';
        if ($scope.events[i].eventType == 'Outdoor Sport') { $scope.events[i].src = '/img/sports.png'; $scope.events[i].alt= 'Sports'}
        else if ($scope.events[i].eventType == 'Football') { $scope.events[i].src = '/img/football.png'; $scope.events[i].alt= 'Football'}
        else if ($scope.events[i].eventType == 'Basketball') { $scope.events[i].src = '/img/basketball.png'; $scope.events[i].alt= 'Basketball'}
        else if ($scope.events[i].eventType == 'Soccer') { $scope.events[i].src = '/img/soccer.png'; $scope.events[i].alt= 'Soccer'}
        else if ($scope.events[i].eventType == 'Tennis') { $scope.events[i].src = '/img/tennis.png'; $scope.events[i].alt= 'Tennis'}
        else if ($scope.events[i].eventType == 'Indoor Game') { $scope.events[i].src = '/img/board.png'; $scope.events[i].alt= 'Game'}
        else if ($scope.events[i].eventType == 'Computer Game') { $scope.events[i].src = '/img/PC.png'; $scope.events[i].alt= 'PC'}
        else if ($scope.events[i].eventType == 'Other') { $scope.events[i].src = '/img/other.png'; $scope.events[i].alt= 'Other'} 
      }  

      //if user exists, remove attended events 
      if ($scope.user)
      {
        for(var i = 0; i < $scope.events.length; i++)
        {
          console.log($scope.user.regEvents.indexOf($scope.events[i]._id.toString()));
          if($scope.user.regEvents.indexOf($scope.events[i]._id.toString()) == -1)
          {
            $scope.dbevents.push($scope.events[i]);
          }
        }  
      }
      else
        {$scope.dbevents = $scope.events;}
      
    });
}

// returns information for a single Event that was selected.
function ViewEventCtrl($scope, $http, $routeParams, $location) {
  $http.get('/api/event/' + $routeParams.id).
    success(function(data) {
      $scope.event= data.event;
      $scope.user= data.user;
      // Assign a picture to each type of event
      if ($scope.event.eventType == 'Outdoor Sport') { $scope.event.src = '/img/sports.png'; $scope.event.alt= 'Sports'}
      else if ($scope.event.eventType == 'Football') { $scope.event.src = '/img/football.png'; $scope.event.alt= 'Football'}
      else if ($scope.event.eventType == 'Basketball') { $scope.event.src = '/img/basketball.png'; $scope.event.alt= 'Basketball'}
      else if ($scope.event.eventType == 'Soccer') { $scope.event.src = '/img/soccer.png'; $scope.event.alt= 'Soccer'}
      else if ($scope.event.eventType == 'Tennis') { $scope.event.src = '/img/tennis.png'; $scope.event.alt= 'Tennis'}
      else if ($scope.event.eventType == 'Indoor Game') { $scope.event.src = '/img/board.png'; $scope.event.alt= 'Game'}
      else if ($scope.event.eventType == 'Computer Game') { $scope.event.src = '/img/PC.png'; $scope.event.alt= 'PC'}
      else if ($scope.event.eventType == 'Other') { $scope.event.src = '/img/other.png'; $scope.event.alt= 'Other'}
      

      $scope.attended = ($scope.user.regEvents.indexOf($scope.event._id.toString()));

    });
  //allows the user to attend the event
  $scope.attend = function(){
    if ($scope.user)
    {
      //this sends a request to the database to increment event attendee count
      $http.post('/api/event-attend/' + $routeParams.id).then(
        function(res) {
          if (!res.data.error)
          { $location.path('/');}
          else
          { $scope.error = "Could not join event.";}
        }
      );


    }
    else
    { //redirects if not a user
      $location.path('/login');
    }
    
  };
  //cancels attendance to an event
  $scope.cancel = function(){
    if ($scope.user)
    {
      //removes the event from the User's data
      $http.delete('/api/event-cancel/'  + $routeParams.id).then(
        function(res) {
          if (!res.data.error)
          { $location.path('/');}
          else
          { $scope.error = "Could not cancel event.";}
        }
       );
  }
  };
  // forwards the comment to the server to send
  $scope.comment = function(){
    if ($scope.user)  //if logged in
    {     
        //send data to server
        $scope.form.comment.name = $scope.user.username;
        $http.post('/api/comment/'  + $routeParams.id, $scope.form).then(
        function(res) {
          // console.log(res);
          if (res.data)
          { $scope.event= res.data.event;}
          else
          { $scope.error = "Could not comment event.";}
        }
       );
    }
  };
}