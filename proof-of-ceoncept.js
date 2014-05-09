#!/usr/bin/node
/**
 * A proof of concept script showing the bot logic
 * that guesses a valid random bulls and cows number
 *
 * The script is configured to use only 4 digit numbers
 * that DON'T start with a zero
 */

var $ = require('./shared/GameEngine.js'),
  // Random number to be guessed
  secret = $.pickRandom(),

  // A set of possible numbers containing the secret number
  set = $.getSetCopy(),

  // Number of attempts at guessing the corrent number
  attempt = 0;

console.log('Secret number to guess: ', secret, "\n");

while (true) {

  // get next guess from set of possiblities
  guess = $.nextGuess(set);
  attempt++;


  console.log('Trying', guess, 'out of', set.length, 'possibilities');

  // get the bulls & cows score of the guess versus the secret
  score = $.findMatches(guess, secret);

  // 4 bulls === win
  if (score.b === 4) {
    console.log("\nNumber found in", attempt, "attempts!");
    break;
  }

  // based on the score, filter the possibilities set
  set = $.filterSet(set, guess, score);

  console.log('Found',
    score.b, (score.b != 1 ? 'bulls' : 'bull'), 'and',
    score.c, (score.c != 1 ? 'cows' : 'cow'));
}
