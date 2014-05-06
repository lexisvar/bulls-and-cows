angular.module('BullsAndCows').config([
  '$routeProvider', '$locationProvider',
  function ($routeProvider, $locationProvider) {
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
      .when('/game/:id', {
        controller: 'GameController',
        templateUrl: 'templates/game.html'
      })
      .otherwise({
        redirectTo: '/'
      });

    //$locationProvider.html5Mode(true).hashPrefix('!');
  }
]);