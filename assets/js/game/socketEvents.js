angular.module('BullsAndCows').run([
  '$socket', '$rootScope',
  function ($socket, $root) {
    $socket.on('message', function (data) {
      console.log(data);
    });

    $.gameEvent = function (data) {

    }

    $.turnEvent = function (data) {

    }
  }
])