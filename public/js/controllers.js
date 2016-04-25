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


function IndexCtrl($scope, $http) {
  $http.get('/api/posts').
    success(function(data, status, headers, config) {
      $scope.posts = data.posts;
      console.log(data.user);
      $scope.user = data.user;
    });
}



function AddPostCtrl($scope, $http, $location) {
  $scope.form = {};
  $scope.submitPost = function () {
    if ($scope.form.title && $scope.form.text) {
      $http.post('/api/post', $scope.form).then(
        function(res) {$location.path('/');}, // If ok, path home
        function(res) {$location.path('/login'); //else path login
      });
    }
    else{
      console.log("ENTER STUFF");
    }
  };
}

function ReadPostCtrl($scope, $http, $routeParams) {
  $http.get('/api/post/' + $routeParams.id).
    success(function(data) {
      $scope.post = data.post;
    });
}

function EditPostCtrl($scope, $http, $location, $routeParams) {
  $scope.form = {};
  $http.get('/api/post/' + $routeParams.id).
    success(function(data) {
      $scope.form = data.post;
    });

  $scope.editPost = function () {
    $http.put('/api/post/' + $routeParams.id, $scope.form).
      success(function(data) {
        $location.url('/readPost/' + $routeParams.id);
      });
  };
}

function DeletePostCtrl($scope, $http, $location, $routeParams) {
  $http.get('/api/post/' + $routeParams.id).
    success(function(data) {
      $scope.post = data.post;
    });

  $scope.deletePost = function () {
    $http.delete('/api/post/' + $routeParams.id).
      success(function(data) {
        $location.url('/');
      });
  };

  $scope.home = function () {
    $location.url('/');
  };
}

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


function ViewEventCtrl($scope, $http, $routeParams) {
  $http.get('/api/event/' + $routeParams.id).
    success(function(data) {
      $scope.event= data.event;
    });
}