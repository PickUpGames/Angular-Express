function LoginCtrl($scope, $http, $location) {
  $scope.form = {};
  $scope.error= "Need to login to add/join events.";
  $scope.login = function () {
    // $http.post('/api/login', $scope.form) .success(function(data) {$location.path('/'); });
    $http.post('/api/login', $scope.form).then(
      function(res) {$location.path('/'); location.reload();},
      function(res) {$scope.error= res.data.error;});
  };
}

function LogoutCtrl($http, $location) {
    console.log("logging out");
     $http.get('/user/logout').then(
      function(res) {$location.path('/'); location.reload();},
      function(res) {});
}


function RegisterCtrl($scope, $http, $location) {
  $scope.form = {};
  $scope.register = function () {
    $http.post('/api/register', $scope.form).then(
      function(res) {$location.path('/');},
      function(res) {$scope.error= res.data.error;})
  };
  $scope.clear = function () {
    $http.delete('/api/clear').then(
      function(res) {$location.path('/');}
    )
  };
}
function ProfileCtrl($scope, $http, $location) {
  //get user data
  $http.get('/api/profile').then(
    function(res) {
      if (res.data.user)
      {
        $scope.user = res.data.user; $scope.form = res.data.user;
      }
      else
      {
        $location.path('/login');
      }
     }
  ); 

  $scope.Edit = function ()
  {
    $http.put('/api/profile', $scope.form).
      success(function(res) {
        $scope.status= res.status;
      });
  };
}