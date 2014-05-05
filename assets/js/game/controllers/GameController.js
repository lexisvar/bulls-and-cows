angular.module('BullsAndCows').controller('GameController', [
  '$scope', '$rootScope', 'Server',
  function ($scope, $root, Server) {
    var game = $root.gameGet();
    console.log(game);
  }
])