/**
 * A directive to generate icons for each and every icon in a
 * turn. Did this, because Angular 1.0.8 doesn't support
 * ng-repeat range or anything similar to loop this within the
 * template directly
 */
angular.module('BullsAndCows').directive('bcIcon', ['$window',
  function ($window) {
    return {
      restrict: 'A',
      scope: {
        cows: '=',
        bulls: '='
      },
      link: function renderAnimals(scope, element, attr) {
        var html = '';
        for (var i = 0; i < scope.cows; i++) {
          html += '<div class="icon-cow"></div>';
        }

        for (var i = 0; i < scope.bulls; i++) {
          html += '<div class="icon-bull"></div>';
        }

        return element.html(html);
      }
    }
  }
]);