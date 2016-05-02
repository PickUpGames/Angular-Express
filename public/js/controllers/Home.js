// this function should be adapted for the home page
// it should get some form of api/recommendations from the server
// if there is no user, find local events and display
// if there is a user, find local events that are to user preferences

function IndexCtrl($scope, $http) {

	$scope.tagline = 'Please login to see recommendations';
	$http.get('/api/events').success(function(data, status, headers, config){
		$scope.events = data.events;
		
    	$scope.tagline = 'Welcome, ' + data.user.name + '. Time to play!';
    	$scope.eventList = [];
    	$scope.joinedEvents = [];
		for(var i = 0; i < $scope.events.length; i++)
      	{
      		// $scope.events[i].img = {'src':'','alt':''};
      		if ($scope.events[i].eventType == 'Outdoor Sport') { $scope.events[i].src = '/img/sports.png'; $scope.events[i].alt= 'Sports'}
			        else if ($scope.events[i].eventType == 'Football') { $scope.events[i].src = '/img/football.png'; $scope.events[i].alt= 'Football'}
      else if ($scope.events[i].eventType == 'Basketball') { $scope.events[i].src = '/img/basketball.png'; $scope.events[i].alt= 'Basketball'}
      else if ($scope.events[i].eventType == 'Soccer') { $scope.events[i].src = '/img/soccer.png'; $scope.events[i].alt= 'Soccer'}
      else if ($scope.events[i].eventType == 'Tennis') { $scope.events[i].src = '/img/tennis.png'; $scope.events[i].alt= 'Tennis'}
      else if ($scope.events[i].eventType == 'Indoor Game') { $scope.events[i].src = '/img/board.png'; $scope.events[i].alt= 'Game'}
      else if ($scope.events[i].eventType == 'Computer Game') { $scope.events[i].src = '/img/PC2.jpeg'; $scope.events[i].alt= 'PC'}
      else if ($scope.events[i].eventType == 'Other') { $scope.events[i].src = '/img/other.png'; $scope.events[i].alt= 'Other'}
			// console.log($scope.events[i].src);
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
    	if ($scope.events[i].eventType == 'Outdoor Sport') { $scope.events[i].src = '/img/sports.png'; $scope.events[i].alt= 'Sports'}
	  else if ($scope.events[i].eventType == 'Football') { $scope.events[i].src = '/img/football.png'; $scope.events[i].alt= 'Football'}
      else if ($scope.events[i].eventType == 'Basketball') { $scope.events[i].src = '/img/basketball.png'; $scope.events[i].alt= 'Basketball'}
      else if ($scope.events[i].eventType == 'Soccer') { $scope.events[i].src = '/img/soccer.png'; $scope.events[i].alt= 'Soccer'}
      else if ($scope.events[i].eventType == 'Tennis') { $scope.events[i].src = '/img/tennis.png'; $scope.events[i].alt= 'Tennis'}
      else if ($scope.events[i].eventType == 'Indoor Game') { $scope.events[i].src = '/img/board.png'; $scope.events[i].alt= 'Game'}
      else if ($scope.events[i].eventType == 'Computer Game') { $scope.events[i].src = '/img/PC.png'; $scope.events[i].alt= 'PC'}
      else if ($scope.events[i].eventType == 'Other') { $scope.events[i].src = '/img/other.png'; $scope.events[i].alt= 'Other'}
    }
    $scope.predicate = 'eventDate';
    $scope.reverse = true;
    $scope.order = function(predicate) {
      $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
      $scope.predicate = predicate;
    };
  });

}


function ImageCtrl($scope){

}