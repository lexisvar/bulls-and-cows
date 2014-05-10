angular.module('BullsAndCows').run([
  '$socket', '$rootScope',
  function ($socket, $root) {
    var socket = $socket.socket;

    // when a new game is added to the lobby
    socket.on('newGame', function (game) {
      console.debug('[SOCKET] New game:', game);
      return $root.lobbyAddGame(game);
    })

    // when removing a game from the lobby
    socket.on('removeGame', function (id) {
      console.debug('[SOCKET] Remove game:', id);
      return $root.lobbyRemoveGame(id);
    })

    // when a game's guest arrives
    socket.on('guestArrived', function (player) {
      console.debug('[SOCKET] Guest joined:', player);
      return $root.gameApplyGuestPlayer(player);
    })

    // a new turn is played
    socket.on('turn', function (turn) {
      console.debug('[SOCKET] New turn is played:', turn);
      return $root.gameAddTurn(turn);
    })

    // when a game closes prematurely
    socket.on('prematureClose', function (data) {
      console.debug('[SOCKET] Game closed prematurely:', data);
      return $root.gamePrematureClose(data);
    })
  }
]);