/**
 * Error formatter for custom ORM entity error messages
 */
(function ($) {

  /**
   * Performs error messages format based on custom messages registered
   * within the Object's errorMEssages array, if no custom messages are
   * found, the formatter returns a list of erros provided by SailsJS
   *
   * @param  {Object} obj    ORM entities for which the errors are generated
   * @param  {Object} errors SailsJS standard error list
   * @return {Object}        Reformatted list of error messages to display
   */
  $.format = function (obj, errors) {
    var messages = {}, message, argument;

    for (argument in errors.ValidationError) {
      if (undefined !== obj.errorMessages && undefined !== obj.errorMessages[argument]) {
        messages[argument] = obj.errorMessages[argument];
      } else {
        messages[argument] = [];
        obj.errorMessages[argument].forEach(function (error) {
          messages[argument].push(error.message);
        })
      }
    }

    return messages;
  }

})(module.exports)