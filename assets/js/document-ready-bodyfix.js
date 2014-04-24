/* Set body height to max */
$(document).ready(function() {
    var setBodyHeight;
    (setBodyHeight = function() {
        var body = $('body');
        function getInt(varName) {
          return parseInt(body.css(varName));
        }
        newHeight = window.innerHeight
                   - getInt('margin-top')
                   - getInt('margin-bottom') 
                   - getInt('padding-top')
                   - getInt('padding-bottom');
        body.css('min-height', newHeight);
    })();
    $(window).on('resize', setBodyHeight);
});

