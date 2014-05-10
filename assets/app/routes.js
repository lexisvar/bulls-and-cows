'use strict';
(function () {
  var config = function ($routeProvider) {
    $routeProvider
      .when('/', {
        controller: 'SplashController',
        controllerAs: 'splash',
        templateUrl: 'templates/splash.html'
      })
      .when('/lobby', {
        controller: 'LobbyController',
        controllerAs: 'lobby',
        templateUrl: 'templates/lobby.html'
      })
      .when('/game/:id', {
        controller: 'GameController',
        controllerAs: 'game',
        templateUrl: 'templates/game.html'
      })
      .otherwise({
        redirectTo: '/'
      });
  }

  config.$inject = ['$routeProvider'];
  angular.module('BullsAndCows').config(config);
})()