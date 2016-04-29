function LoginCtrl($scope, $http, $location) {
  $scope.form = {};
  $scope.error= "";
  $scope.login = function () {
    // $http.post('/api/login', $scope.form) .success(function(data) {$location.path('/'); });
    $http.post('/api/login', $scope.form).then(
      function(res) {$location.path('/'); location.reload();},
      function(res) {$scope.error= res.data.error;});
  };
}

function LogoutCtrl($http, $location) {
     $http.get('/user/logout').then(
      function(res) {$location.path('/'); location.reload();},
      function(res) {});
}


function RegisterCtrl($scope, $http, $location) {
  $scope.form = {};
  $scope.register = function () {
    $http.post('/api/register', $scope.form).then(
      function(res) {$location.path('/'); location.reload();},
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
        $scope.user = res.data.user; 
        $scope.form = res.data.user;
        $scope.index = 0;
        $scope.tags = res.data.user.tag; 
      }
      else
      {
        $location.path('/login');
      }
     }
  ); 

  
  $scope.EditA = function ()
  {
    $http.put('/api/profile/A', $scope.form).
      success(function(res) {
        $scope.status= res.status;
      });
  };

  $scope.EditP = function ()
  {

    $scope.tags.push($scope.newTag);
    console.log($scope.tags)
    $http.put('/api/profile/P', $scope.tags).
      success(function(res) {
        $scope.status= res.status;
        $scope.newTag = [];
      });
  };

  $scope.close = function(E)
  {
    console.log(E);
    var ind = $scope.tags.indexOf(E);
    console.log(ind);
    $scope.tags.splice(ind,1);
    console.log($scope.tags);
    $http.put('/api/profile/P', $scope.tags).
      success(function(res) {
        $scope.status= res.status;
      });
  }

}

function ContactCtrl($scope, $http, $location, $timeout) {

  $scope.sendMail = function () {
            console.log("GOOGO!");
            var data = ({
                contactName : $scope.form.contactName,
                contactEmail : "anon@PUG.com",
                contactMsg : $scope.form.contactMsg
            });
            $http.post('/contact-form', data).
                success(function(data, status, headers, config) {
                    $scope.status = "Sent!"
                    $scope.ok = 1; 
                    // $location.path('/');
                    $timeout(function () {
                      $location.path('/');
                    }, 1000); 
                }).
                error(function(data, status, headers, config) {
                    $scope.ok = 0;
                    $scope.status = "Contact Failed!"

                });
 
        };
  }