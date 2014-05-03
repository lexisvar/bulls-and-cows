angular.module('BullsAndCows').config([
  '$routeProvider',
  function ($routeProvider) {
    'use strict';

    $routeProvider
      .when('/', {
        controller: 'SplashController',
        templateUrl: 'templates/splash.html'
      })
      .when('/lobby', {
        controller: 'LobbyController',
        templateUrl: 'templates/lobby.html'
      })
      .when('/game', {
        controller: 'GameController',
        templateUrl: 'templates/game.html'
      })
      .otherwise({
        redirectTo: '/'
      });
  }
]);