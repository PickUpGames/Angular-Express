// Declare app level module 
angular.module('myApp', []).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider. //all these angular paths are dealt with by the server.js file
      when('/', {
        templateUrl: 'partials/home',
        controller: IndexCtrl  //these controllers can be found in the js/controllers folder
      })
      .when('/login', {
        templateUrl: 'user/login',
        controller: LoginCtrl
      })
      .when('/logout', {
        templateUrl: 'partials/home',
        controller: LogoutCtrl
      })
      .when('/register', {
        templateUrl: 'user/register',
        controller: RegisterCtrl
      })
      .when('/search', {
        templateUrl: 'partials/search',
        controller: SearchCtrl
      })
      .when('/viewprofile',{
            templateUrl: 'profile/view'
            ,controller: ProfileCtrl
      })
      .when('/contact',{
            templateUrl: 'profile/contact'
            ,controller: ContactCtrl
      })
      .when('/faq',{
            templateUrl: 'profile/faq'
      })
      .when('/forget',{
            templateUrl: 'user/forget'
      })
      .when('/addEvent', {
          templateUrl: 'event/addEvent',
          controller: AddEventCtrl
      })
      .when('/events',{
          templateUrl: 'event/index',
          controller: EventCtrl
      })
      .when('/viewEvent/:id', {
        templateUrl: 'event/viewEvent',
        controller: ViewEventCtrl
      })
      .when('/editEvent/:id', {
        templateUrl: 'event/editEvent'
      //  controller: EditPostCtrl
      })
      .when('/deleteEvent/:id', {
        templateUrl: 'event/deleteEvent'
      //  controller: DeletePostCtrl
      })
      .otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(true);
  }]);


