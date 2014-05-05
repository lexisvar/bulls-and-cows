/**
 * Main $rootScope API properties and methods
 */
angular.module('BullsAndCows').run([
  '$rootScope',
  function ($root) {
    /**
     * $rootScope state flags
     * @type {Object}
     */
    $root.flags = {
      appLoaded: false
    }

    /**
     * List of phases when NOT to use $apply
     * @type {Array}
     */
    var dontApplyWhen = ['$apply', '$digest'];

    /**
     * Save version of $apply, when not from callback
     * @param  {function} callback Apply callback
     * @return {void}
     */
    $root.apply = function (callback) {
      return dontApplyWhen.indexOf($root.$$phase) > -1 ? callback.call() : $root.$apply(callback);
    }

    /**
     * A method to set the application loaded state to true and
     * hide the loading message
     * @return {void}
     */
    $root.appIsLoaded = function () {
      return $root.apply(function () {
        $root.flags.appLoaded = true;
        $root.hideLoading();
      });
    }
  }
])