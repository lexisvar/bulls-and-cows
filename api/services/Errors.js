(function ($) {
  $.format = function (obj, errors) {
    var messages = {}, message, argument;

    for (argument in errors.ValidationError) {
      if (undefined !== obj.errorMessages[argument]) {
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