/* Set body height to max */
angular.element(document).ready(
    function() {
      var setBodyHeight;
      var body = angular.element( document.getElementsByTagName('body')[0] );
      (setBodyHeight = function() {
          function getInt(varName) {
            var parse = parseInt( body.css(varName) );
            return isNaN(parse) ? 0 : parse;
          }
          newHeight = window.innerHeight
                     - getInt('margin-top')
                     - getInt('margin-bottom') 
                     - getInt('padding-top')
                     - getInt('padding-bottom');
          body.css('min-height', newHeight + 'px');
      })();
      angular.element(window).bind('resize', setBodyHeight);
    }
);

