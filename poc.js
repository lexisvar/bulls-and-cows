var $ = require('./shared/GameEngine.js')
  , secret = $.pickNewRandomNumber()
  , possibilities = $.getNewPossibilitiesSet()
  , attempt = 0;

console.log('Secret number to guess: ', secret, "\n");

while(true) {
	guess = $.nextGuess(possibilities);
	attempt++;
	console.log('Trying',guess,'out of', possibilities.length, 'possibilities');

	result = $.findCowsAndBulls(guess, secret);
	if(result.bulls === 4) {
		console.log("\nNumber found in", attempt, "attempts!");
		break;
	}

	console.log('Found', 
		result.bulls, (result.bulls != 1? 'bulls' : 'bull'), 'and',
		result.cows, (result.cows != 1? 'cows' : 'cow' ));
	
	possibilities = $.filterGuessList(guess, result, possibilities);
}


