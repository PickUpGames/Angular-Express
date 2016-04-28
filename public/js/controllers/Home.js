// this function should be adapted for the home page
// it should get some form of api/recommendations from the server
// if there is no user, find local events and display
// if there is a user, find local events that are to user preferences

function IndexCtrl($scope, $http) {
	

	$http.get('/api/events').success(function(data, status, headers, config){
		$scope.events = data.events;
    $scope.tagline = 'Welcome, ' + data.user.name + '. Time to play!'; 
	});
	
  // $http.get('/api/rec').
  //   success(function(data, status, headers, config) {
  //     $scope.user = data.user;
  //   });
}



function SearchCtrl($scope, $http) {
    $http.get('/api/events').success(function(data, status, headers, config){
    $scope.events = data.events;
    $scope.predicate = 'eventDate';
    $scope.reverse = true;
    $scope.order = function(predicate) {
      $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
      $scope.predicate = predicate;
    };
  });

}
