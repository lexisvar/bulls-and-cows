(function () {

  var Root = function ($rootScope) {
    this.root = $rootScope;
  }

  Root.$inject = ['$rootScope'];

  var dontApplyWhen = ['$apply', '$digest'];

  Root.prototype.apply = function (callback) {
    if (dontApplyWhen.indexOf(this.root.$$phase)) {
      return callback.call();
    }

    this.root.$apply(callback);
  }

  angular.module('BullsAndCows').service('Root', Root);

})()