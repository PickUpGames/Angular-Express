// this function should be adapted for the home page
// it should get some form of api/recommendations from the server
// if there is no user, find local events and display
// if there is a user, find local events that are to user preferences

function IndexCtrl($scope, $http) {
	

	$http.get('/api/events').success(function(data, status, headers, config){
		$scope.events = data.events;
		//console.log(data.user.tag);
    	$scope.tagline = 'Welcome, ' + data.user.name + '. Time to play!';
    	$scope.eventList = []; 
		if(data.user.tag.length > 0) {
		//loop through events list
		for (var i = 0; i < $scope.events.length; i ++){
			//set current list of tags in event.
			$scope.cur_tags = $scope.events[i].tag;
			//console.log($scope.cur_tags);
			//loop through tag identifiers in user  tag list
			for (var j = 0; j < data.user.tag.length; j++){
				// $scope.tag = data.user.tag[j];
				//console.log("users tag" + $scope.tag);
				//check if user tag is in event tag list.
				// console.log("SCOPE= " + $scope.cur_tags);
				// console.log(" DATA= " + data.user.tag[j]);
				if ($scope.cur_tags.indexOf(data.user.tag[j]) != -1){
					
					$scope.eventList.push($scope.events[i]);
					break;
				} else {
					//false
				}
			}
		}
	}
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
