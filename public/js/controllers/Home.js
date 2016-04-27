// this function should be adapted for the home page
// it should get some form of api/recommendations from the server
// if there is no user, find local events and display
// if there is a user, find local events that are to user preferences

function IndexCtrl($scope, $http) {
	$scope.tagline = 'To the moon and back!'; 
  // $http.get('/api/rec').
  //   success(function(data, status, headers, config) {
  //     $scope.user = data.user;
  //   });
}

