angular.module('BullsAndCows').run([
  '$socket', '$rootScope',
  function ($socket, $root) {
    /**
     * Message router for different socket events and
     * states
     * @param  {object} event  Socket event message
     * @return {void}          Executes the proper action
     */
    $socket.socket.on('message', function (message) {
      console.log('Socket message:', message);
      if ('game' === message.model) {
        switch (message.verb) {
        case 'create':
          return $root.lobbyAddGame(message.data);
        case 'destroy':
          return $root.lobbyRemoveGame(message.data);
        case 'update':
          if ('turn' === message.data.action)
            return $root.gameAddTurn(message.data.turn);
        }
      }
    });


  }
])