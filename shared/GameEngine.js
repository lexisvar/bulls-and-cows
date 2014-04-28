(function($this) {

    var VALID_REGEX = /^(?!0)(?!.*(.).*\1)[\d]{4}$/;

    $this.isValidNumber = function(toValidate) {
        return toValidate.toString().match(VALID_REGEX) ? true : false;
    }

    function generatePossibilitySet() {
        var set = [];

        for (var i = 1234; i < 9877; i++) {
            if ($this.isValidNumber(i))
                set.push(i);
        }

        return set;
    }

    var possibilities = generatePossibilitySet();

    $this.pickNewRandomNumber = function() {
        var random = Math.floor(Math.random() * possibilities.length);
        return possibilities[random];
    }

    $this.getNewPossibilitiesSet = function() {
        return possibilities.slice(0);
    }

    $this.findCowsAndBulls = function(fromNumber, inNumber) {
        var testChar, testAgainst, cows = bulls = 0;

        fromNumber = fromNumber.toString(),
        inNumber = inNumber.toString();

        for (var i = 0; i < inNumber.length; i++) {
            testChar = fromNumber[i],
            testAgainst = inNumber[i];

            if (testChar === testAgainst) {
                bulls++;
            } else if (inNumber.indexOf(testChar) > -1) {
                cows++;
            }
        }

        return {
            cows: cows,
            bulls: bulls
        }
    }

    $this.compareScores = function(compareSet, versusSet) {
        var scoreCompare = compareSet.cows + compareSet.bulls,
            scoreVersus = versusSet.cows + versusSet.bulls,
            possiblyMoreCows = compareSet.cows >= versusSet.cows,
            equalBulls = compareSet.bulls == versusSet.bulls;

        return scoreCompare == scoreVersus && possiblyMoreCows && equalBulls;
    }

    $this.filterGuessList = function(secretNumber, cowsAndBulls, guessList) {
        var secretTest, secretProbe,
            index = -1,
            result = [],
            secretNumber = secretNumber.toString(),
            length = guessList.length;

        // filter rest of the members
        while (++index < length) {
            secretProbe = guessList[index];
            secretTest = $this.findCowsAndBulls(secretProbe, secretNumber);
            if (true === $this.compareScores(secretTest, cowsAndBulls)) {
                result.push(secretProbe);
            }
        }

        return result;
    }

    $this.nextGuess = function(guessList) {
        return guessList[0];
    }

})('object' === typeof exports ? exports : this['BullsAndCows'] = {});