
function AddEventCtrl($scope, $http, $location) {
  $scope.form = {};
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


function EventCtrl($scope, $http) {
  $http.get('/api/events').
    success(function(data, status, headers, config) {
      $scope.dbevents = data.events;
      $scope.user = data.user;
      $scope.events = [];
      if ($scope.user)
      {
        for(var i = 0; i < $scope.dbevents.length; i++)
      {
        if($scope.user.regEvents.indexOf($scope.dbevents[i]._id.toString()) == -1)
        {
          $scope.events.push($scope.dbevents[i]);
        }
      }  
      }
      else
        {$scope.events = $scope.dbevents;}
      
    });
}


function ViewEventCtrl($scope, $http, $routeParams, $location) {
  $http.get('/api/event/' + $routeParams.id).
    success(function(data) {
      $scope.event= data.event;
      $scope.user= data.user;
      // console.log($scope.user.regEvents);
      // console.log($scope.event._id.toString());
      $scope.attended = ($scope.user.regEvents.indexOf($scope.event._id.toString()));
      // console.log($scope.attended);
    });
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
    {
      $location.path('/login');
    }
    
  };

  $scope.cancel = function(){
    if ($scope.user)
    {
      $http.delete('/api/event-cancel/'  + $routeParams.id).then(
        function(res) {
          if (!res.data.error)
          { $location.path('/');}
          else
          { $scope.error = "Could not cancel event.";}
        }
       );
  };
  }
}