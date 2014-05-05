angular.module('BullsAndCows').run([
  '$rootScope',
  function ($root) {
    $root.flags.showLoading = true;

    /**
     * Tells the $rootScope to HIDE the loading message
     * @return {void}
     */
    $root.showLoading = function () {
      return $root.apply(function () {
        $root.flags.showLoading = true
      });
    }

    /**
     * Tells $rootScope to HIDE the loading message
     * @return {[type]} [description]
     */
    $root.hideLoading = function () {
      return $root.apply(function () {
        $root.flags.showLoading = false
      });
    }

  }
])