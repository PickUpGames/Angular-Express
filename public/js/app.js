// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider. //all these angular paths are dealt with by the server.js file
      when('/', {
        templateUrl: 'partials/index',
        controller: IndexCtrl
      })
      .when('/login', {
        templateUrl: 'user/login',
        controller: LoginCtrl
      })
      .when('/logout', {
        templateUrl: 'partials/index',
        controller: LogoutCtrl
      })
      .when('/register', {
        templateUrl: 'user/register',
        controller: RegisterCtrl
      })
      .when('/addPost', {
        templateUrl: 'partials/addPost',
        controller: AddPostCtrl
      })
      .when('/readPost/:id', {
        templateUrl: 'partials/readPost',
        controller: ReadPostCtrl
      })
      .when('/editPost/:id', {
        templateUrl: 'partials/editPost',
        controller: EditPostCtrl
      })
      .when('/deletePost/:id', {
        templateUrl: 'partials/deletePost',
        controller: DeletePostCtrl
      })
      .when('/viewprofile',{
            templateUrl: 'profile/view'
      })
      // .when('/manageprofile',{
      //       templateUrl: 'profile/manage'
      // })
      .when('/contact',{
            templateUrl: 'profile/contact'
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


