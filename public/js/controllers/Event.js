
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
      $scope.events = data.events;
      $scope.user = data.user;
    });
}


function ViewEventCtrl($scope, $http, $routeParams, $location) {
  $http.get('/api/event/' + $routeParams.id).
    success(function(data) {
      $scope.event= data.event;
      $scope.user= data.user;
    });
  $scope.attend = function(){
    if ($scope.user)
    {$http.post('/api/event-attend/' + $routeParams.id).then(
        function(res) {
          if (!res.data.error)
          {
            $location.path('/');
          }
          else
          {
            $scope.error = "Could not join event.";
          }
        }
    );}
    else
    {
      $location.path('/login');
    }
    
  };
}