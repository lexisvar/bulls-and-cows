# Bulls & Cows 
### A SailsJS adventure
Welcome to the the page of my humble effort to make a Bulls & Cows game :)

### Number guessing proof-of-concept
The application includes an implementation of a number guessing mechanism, based on the concept of a reduced multitude of options. Basically you compare the results versus a list of possible options, until its reduced to a single number. To execute the proof-of-concept code, run the following command: 

```
node proof-of-concept.js
```

### Requirements
In order to have persistent sessions, you need to configure a redis connection in `config/session.js`

### Installation
Node & NPM are a clear requirements for this one, but you'll also need Bower for the front-end stuff. To install bower run:

```
npm install -g bower
```

To install the game requirements, run from the project folder:

```
npm install
bower install
```

### Launching the game
Start the app using `./launch.sh` and then access it at `http://localhost:1337/`

### Credits
Thanks to [Martin Berube](http://www.how-to-draw-funny-cartoons.com/) for providing his royalty free vector icons, that are used for ingame.

### License
MIT License