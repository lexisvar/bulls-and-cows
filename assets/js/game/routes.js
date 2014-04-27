angular.module('BullsAndCows').config([
  '$routeProvider',
  function ($routeProvider) {
    'use strict';

    function route(controller, template) {
      return {
        controller: controller + 'Controller',
        templateUrl: 'templates/' + template + '.html'
      }
    }

    $routeProvider
      .when('/', route('Splash', 'splash'))
      .when('/lobby', route('Lobby', 'lobby'))
      .otherwise({
        redirectTo: '/'
      });
  }
]);