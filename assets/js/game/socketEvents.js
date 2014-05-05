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
      switch (message.model) {
      case 'game':
        if ('create' === message.verb)
          return $root.lobbyAddGame(message.data);

        if ('destroy' === message.verb)
          return $root.lobbyRemoveGame(message.data);

        if ('update' === message.verb) {
          if ('start' === message.data.action) {
            return $root.gameStart(message.data);
          } else if ('unsubscribe' === message.data.action) {
            return $root.lobbyReset();
          }
        }

        break;
      case 'gameTurn':
        return $root.addTurn(message.data);
      }
    });


  }
])