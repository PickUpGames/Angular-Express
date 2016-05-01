// this function should be adapted for the home page
// it should get some form of api/recommendations from the server
// if there is no user, find local events and display
// if there is a user, find local events that are to user preferences

function IndexCtrl($scope, $http) {
	

	$http.get('/api/events').success(function(data, status, headers, config){
		$scope.events = data.events;
    	$scope.tagline = 'Welcome, ' + data.user.name + '. Time to play!';
    	$scope.eventList = [];
    	$scope.joinedEvents = [];
		for(var i = 0; i < $scope.events.length; i++)
      	{
        	if(data.user.regEvents.indexOf($scope.events[i]._id.toString()) != -1)
        	{
        		$scope.events[i].eventName = $scope.events[i].eventName.substr(0, 12) + '...';
          		$scope.joinedEvents.push($scope.events[i]);
          		// console.log($scope.events[i]._id);
        	}
      	}
		if(data.user.tag.length > 0) {
		//loop through events list
			for (var i = 0; i < $scope.events.length; i ++){
				//set current list of tags in event.
				$scope.cur_tags = $scope.events[i].tag;
				//loop through tag identifiers in user  tag list
				for (var j = 0; j < data.user.tag.length; j++){
					// check if user tag is in event tag list.
					if ($scope.cur_tags.indexOf(data.user.tag[j]) != -1){
						
						if ($scope.joinedEvents.indexOf($scope.events[i]) == -1)
						{
							$scope.events[i].eventName = $scope.events[i].eventName.substr(0, 12) + '..';
							$scope.eventList.push($scope.events[i]);
							break;
						}
					} else {
						//false
					}
				}
			}
		}

	});
}



function SearchCtrl($scope, $http) {
    $http.get('/api/events').success(function(data, status, headers, config){
    $scope.events = data.events;
    for (var i=0; i< $scope.events.length; i++)
    {
    	$scope.events[i].eventName = $scope.events[i].eventName.substr(0, 12) + '..';
    }
    $scope.predicate = 'eventDate';
    $scope.reverse = true;
    $scope.order = function(predicate) {
      $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
      $scope.predicate = predicate;
    };
  });

}
