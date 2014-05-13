/**
 * Wrapper for Socket.io communication with the
 * Sails backend, extracted from the default Sails
 * bundle and converted into an Angular module
 */
angular.module('BullsAndCows')
  .provider('$socket', function () {
    this.$get = function () {
      return new SocketProvider();
    }

    var SocketProvider = function () {
      this.io = window.io;
      this.socket = this.io.connect();
      return this;
    }


    /**
     * Register event handler
     */
    SocketProvider.prototype.on = function (eventName, callback, context) {
      return this.socket.on(eventName, function (result) {
        return callback.call(context || null, result);
      })
    }

    /**
     * Unregister event handler
     */
    SocketProvider.prototype.off = function (eventName) {
      return this.socket.removeAllListeners(eventName);
    }

    /**
     * Extension of the Socket.io emit method that uses
     * callback context
     */
    SocketProvider.prototype.emit = function (eventName, data, callback, context) {
      return this.socket.emit(eventName, data, function (result) {
        return callback.call(context || null, result);
      })
    }

    /**
     * Simulate a GET request
     */
    SocketProvider.prototype.get = function (url, data, callback, context) {
      return this.request(url, data, callback, 'get', context);
    };

    /**
     * Simulate a POST request
     */
    SocketProvider.prototype.post = function (url, data, callback, context) {
      return this.request(url, data, callback, 'post', context);
    };

    /**
     * Simulate a PUT request
     */
    SocketProvider.prototype.put = function (url, data, callback, context) {
      return this.request(url, data, callback, 'put', context);
    };

    /**
     * Simulate a DELETE request
     */
    SocketProvider.prototype.delete = function (url, data, callback, context) {
      return this.request(url, data, callback, 'delete', context);
    };

    /**
     * Simulate HTTP over Socket.io
     * @api private :: but exposed for backwards compatibility
     */
    SocketProvider.prototype.request = function (url, data, callback, method, context) {
      var usage = 'Usage:\n socket.' +
        (method || 'request') +
        '( destinationURL, dataToSend, fnToCallWhenComplete )';

      // Remove trailing slashes and spaces
      url = url.replace(/^(.+)\/*\s*$/, '$1');

      // If method is undefined, use 'get'
      method = method || 'get';

      if (typeof url !== 'string') {
        throw new Error('Invalid or missing URL!\n' + usage);
      }

      // Allow data arg to be optional
      if (typeof data === 'function') {
        context = callback;
        callback = data;
        data = {};
      }

      // Build to request
      var json = this.io.JSON.stringify({
        url: url,
        data: data
      });

      // Send the message over the socket
      this.emit(method, json, function afterEmitted(result) {
        var parsedResult = result;

        try {
          parsedResult = window.io.JSON.parse(result);
        } catch (e) {
          if (typeof console !== 'undefined') {
            console.warn("Could not parse:", result, e);
          }
          throw new Error("Server response could not be parsed!\n" + result);
        }

        // TODO: Handle errors more effectively
        if (parsedResult === 404) throw new Error("404: Not found");
        if (parsedResult === 403) throw new Error("403: Forbidden");
        if (parsedResult === 500) throw new Error("500: Server error");

        callback && callback.call(context || null, parsedResult);
      }, this);
    }
  });