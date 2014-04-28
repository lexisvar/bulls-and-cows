module.exports = {
  get: function (model, errors) {
    console.log(errors);
    if ('function' !== typeof model['errorMessages']) {
      return {
        invalid: 'An unknown error occurred, while trying to process your request'
      };
    }

    var messages = model['errorMessages'].call();
  }
}