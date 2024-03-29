/**
 * A directive to change the body height
 * to the innerHeight of the window
 */
angular.module('BullsAndCows').directive('body', [
  '$window',
  function ($window) {
    return {
      restrict: 'E',
      link: function bodyResize(scope, element, attributes) {
        var heightConstraintsSum = 0,
          resize, property, value;

        var properties = ['margin-top', 'margin-bottom', 'padding-top', 'padding-left'];

        // remove margin and padding from calculation
        for (var x in properties) {
          property = properties[x];
          value = parseInt(element.css(property));
          heightConstraintsSum += isNaN(value) ? 0 : value;
        }

        // resize method -> define and execute once
        (resize = function () {
          var totalHeight = $window.innerHeight - heightConstraintsSum;
          element.css('min-height', totalHeight + 'px');
        })();

        // bind resize method to $window.onResize
        angular.element($window).bind('resize', resize);
      }
    }
  }
]);