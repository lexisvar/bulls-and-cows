(function ($) {

  var validNumberRegex = /^(?!0)(?!.*(.).*\1)[\d]{4}$/;

  /**
   * Check if a number is:
   *   - not starting with a 4
   *   - contains only unique digits
   *   - is 4 digits long
   * @param  {integer}  toValidate The number to validate
   * @return {Boolean}             True if its a valid number
   */
  $.isValidNumber = function (toValidate) {
    return validNumberRegex.test(toValidate.toString());
  }

  var Set = [];
  for (var i = 1022; i < 9877; ++i) {
    if ($.isValidNumber(i)) {
      Set.push(i);
    }
  }

  /**
   * Pick a random number from the set of all possiblities
   * @return {integer} Random number
   */
  $.pickRandom = function () {
    random = Math.floor(Math.random() * Set.length);
    return Set[random];
  }

  /**
   * Get a copy of the "all possiblities" set
   * @return {array} All possible numbers that are answers to the game
   */
  $.getSetCopy = function () {
    return Set.slice(0);
  }

  /**
   * Find how many cows and bulls by comparing a guess
   * and a secret number
   * @param  {integer} fromNumber The "guess" number to be scored
   * @param  {integer} inNumber   The "secret" number to compare with
   * @return {object}             A $.buildScore entity
   */
  $.findMatches = function (fromNumber, inNumber) {
    var testChar, testAgainst,
      cows = 0,
      bulls = 0;

    fromNumber = fromNumber.toString();
    inNumber = inNumber.toString();

    for (var i = 0; i < fromNumber.length; i++) {
      testChar = fromNumber[i],
      testAgainst = inNumber[i];

      if (testChar === testAgainst) {
        bulls++;
      } else if (inNumber.indexOf(testChar) > -1) {
        cows++;
      }
    }

    return $.buildScore(bulls, cows);
  }

  /**
   * Generate a shorter score format that also contains a score of total
   * bulls and cows
   * @param  {integer} bulls The amount of bulls
   * @param  {integer} cows  The amount of cows
   * @return {object}        The formatted score object
   */
  $.buildScore = function (bulls, cows) {
    return {
      b: bulls,
      c: cows,
      s: cows + bulls
    }
  }

  /**
   * Filter a set of possiblities by comparing each of its members
   * to the original guess and comparing the score outcome with
   * the score of the original guess
   * @param  {array} set      Set of possible answers
   * @param  {integer} guess  Previous attempt at guessing the number
   * @param  {object} score   Score of the previous attempt
   * @return {array}          The filtered set
   */
  $.filterSet = function (set, guess, score) {
    var test,
      // setting to 0 means skipping the first number, which should equal guess
      i = 0,
      result = []; // the output array

    // filter rest of the members
    while (++i < set.length) {

      /**
       * Get the score of the current set item versuse
       * the previously guessed number
       */
      test = $.findMatches(set[i], guess);

      /**
       * See if the score shows potential to be the true
       * result
       */
      if (true === $.isGoodNumber(score, test)) {
        result.push(set[i]);
      }
    }

    return result;
  }

  /**
   * Reduce an array of possiblities based on a list of previous moves
   * @param  {array} set   List of possibe answers
   * @param  {arry}  turns List of turns (each has guess number and score)
   * @return {array}       The filtered set
   */
  $.filterTurns = function (set, turns) {
    var turn, score, secret;
    for (var i in turns) {
      turn = turns[i];
      score = $.buildScore(turn.bulls, turn.cows);
      set = $.filterSet(set, turn.guess, score);
    }
    return set;
  }

  /**
   * Compares the score of two numbers. For a number to be good
   * a score need to have:
   *   - equal amount of cows and bulls
   *   - equal amount of bulls
   *   - cows in test should be less or equal to origin's
   *
   * @param  GameScoreObject  origin Contains the score of an earlier guess
   * @param  GameScoreObject  test   Contains the score of a test guess
   * @return {Boolean}               Returns true if a test score contains a
   *                                 a possiblitiy to be the secret number
   */
  $.isGoodNumber = function (origin, test) {
    return origin.b === test.b && origin.c >= test.c && origin.s === test.s;
  }

  /**
   * Get the next guess from the set
   * @param  {array} set  Array of possibilities
   * @return {integer}    Return the first item from the set (e.g. lowest value)
   */
  $.nextGuess = function (set) {
    return set[0];
  }

  /**
   * Attach model, based on environment
   */
  // if angular is defined
  if ('object' === typeof angular) {
    angular.module('BullsAndCows').service('Engine', function () {
      return $;
    });
  } else if ('object' === typeof window) {
    window['BullsAndCows_Engine'] = $;
  }

  return $;
})((function () {
  if ('undefined' === typeof module || 'undefined' === typeof module.exports)
    return {}

  return module.exports
})());