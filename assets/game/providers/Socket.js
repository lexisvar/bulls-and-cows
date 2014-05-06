/**
 * Wrapper for Socket.io communication with the
 * Sails backend, extracted from the default Sails
 * bundle and converted into an Angular module
 */
angular.module('BullsAndCows', [])
  .provider('$socket', function () {
    var io = window.io,
      socketClass = io.SocketNamespace,
      socket = window.socket = io.connect();

    this.$get = function () {
      return {
        socket: socket,
        get: socket.get,
        post: socket.post,
        put: socket.put,
        'delete': socket['delete'],
        request: socket.request,
        io: window.io
      }
    }

    /**
     * Simulate a GET request to sails
     * e.g.
     *    `socket.get('/user/3', Stats.populate)`
     *
     * @param {String} url    ::    destination URL
     * @param {Object1} params ::    parameters to send with the request [optional]
     * @param {Function} cb   ::    callback function to call when finished [optional]
     */
    socketClass.prototype.get = function (url, data, cb) {
      return this.request(url, data, cb, 'get');
    };

    /**
     * Simulate a POST request to sails
     * e.g.
     *    `socket.post('/event', newMeeting, $spinner.hide)`
     *
     * @param {String} url    ::    destination URL
     * @param {Object} params ::    parameters to send with the request [optional]
     * @param {Function} cb   ::    callback function to call when finished [optional]
     */
    socketClass.prototype.post = function (url, data, cb) {
      return this.request(url, data, cb, 'post');
    };

    /**
     * Simulate a PUT request to sails
     * e.g.
     *    `socket.post('/event/3', changedFields, $spinner.hide)`
     *
     * @param {String} url    ::    destination URL
     * @param {Object} params ::    parameters to send with the request [optional]
     * @param {Function} cb   ::    callback function to call when finished [optional]
     */
    socketClass.prototype.put = function (url, data, cb) {
      return this.request(url, data, cb, 'put');
    };

    /**
     * Simulate a DELETE request to sails
     * e.g.
     *    `socket.delete('/event', $spinner.hide)`
     *
     * @param {String} url    ::    destination URL
     * @param {Object} params ::    parameters to send with the request [optional]
     * @param {Function} cb   ::    callback function to call when finished [optional]
     */
    socketClass.prototype['delete'] = function (url, data, cb) {
      return this.request(url, data, cb, 'delete');
    };

    /**
     * Simulate HTTP over Socket.io
     * @api private :: but exposed for backwards compatibility w/ <= sails@~0.8
     */
    socketClass.prototype.request = function (url, data, cb, method) {
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
        cb = data;
        data = {};
      }

      // Build to request
      var json = window.io.JSON.stringify({
        url: url,
        data: data
      });

      // Send the message over the socket
      socket.emit(method, json, function afterEmitted(result) {

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

        cb && cb(parsedResult);
      });
    }
  });