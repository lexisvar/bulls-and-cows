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
          return $root.addGame(message.data);

        if ('destroy' === message.verb)
          return $root.removeGame(message.data);

        if ('update' === message.verb) {
          if (true === message.data.start) {
            return $root.gameStart(message.data);
          } else if (true === message.data.unsubscribe) {
            return $root.resetGames();
          }
        }

        break;
      case 'gameTurn':
        if ('create' === message.verb)
          return $root.addTurn(message.data);
      }
    });


  }
])