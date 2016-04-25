
function AddEventCtrl($scope, $http, $location) {
  $scope.form = {};
  $scope.submitEvent = function () {
    if ($scope.form.eventName && $scope.form.eventType) {
      $http.post('/api/event', $scope.form).then(
        function(res) {$location.path('/');}, // If ok, path home
        function(res) {$location.path('/login'); //else path login
      });
    }
    else{
      console.log("ENTER STUFF");
    }
  };
}


function EventCtrl($scope, $http) {
  $http.get('/api/events').
    success(function(data, status, headers, config) {
      $scope.events = data.events;
      console.log(data.events);
      $scope.user = data.user;
    });
}


function ViewEventCtrl($scope, $http, $routeParams, $location) {
  $http.get('/api/event/' + $routeParams.id).
    success(function(data) {
      console.log(data.event);
      $scope.event= data.event;
    });
  $scope.attend = function(){
    $http.post('/api/event-attend/' + $routeParams.id).then(
        function(res) {$location.path('/');}
      )
  };
}