/**
 * Extension of the $rootScope for handling the
 * loading message widget
 */
angular.module('BullsAndCows').run([
  '$rootScope',
  function ($root) {
    $root.flags.loadingIsVisible = true;

    $root.loadingIsVisible = function () {
      return $root.flags.loadingIsVisible;
    }

    /**
     * Tells the $rootScope to HIDE the loading message
     * @return {void}
     */
    $root.loadingShow = function () {
      return $root.apply(function () {
        $root.flags.loadingIsVisible = true
      });
    }

    /**
     * Tells $rootScope to HIDE the loading message
     * @return {[type]} [description]
     */
    $root.loadingHide = function () {
      return $root.apply(function () {
        $root.flags.loadingIsVisible = false
      });
    }

  }
])