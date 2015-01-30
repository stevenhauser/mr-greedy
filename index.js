var _               = require('lodash');
var five            = require('johnny-five');
var playerCreator   = require('./player');
var controlsCreator = require('./controls');
var coinsCreator    = require('./coin');
var utils           = require('./utils');
var constants       = require('./constants');

var log = console.log.bind(console);

log('I…AM…RUN-NING');

var board = new five.Board();

board.on('ready', function() {

  log('here we goooooooo!');

  var lcd = new five.LCD({
    pins: [12, 11, 2, 3, 4, 5]
  });

  lcd.noAutoscroll();

  var player = playerCreator.createPlayer({
    leftChar: '<',
    rightChar: '>',
    stillChar: '^',
    col: 0,
    row: 1
  });

  var controls = controlsCreator.createControls({
    knob: new five.Sensor({
      pin: 'A0',
      freq: 50,
      threshold: 5
    }),
    min: 0,
    max: constants.LAST_COL_IDX
  });

  var coins = _.times(4, function() {
    return coinsCreator.createCoin({
      values: [
        { points: 1, char: ':cent:' },
        { points: 5, char: '$' }
      ],
      // -2 to make room for score
      maxCol: constants.LAST_COL_IDX - 2,
      minDur: 1000,
      maxDur: 3000
    });
  });

  controls.on('changed', player.move.bind(player));

  var score = 0;
  var winningScore = 10;
  var refreshRate = 250;
  var reset = utils.makeA({}, {
    col: 0,
    row: 1,
    char: ':smile:'
  });

  function hasWon() {
    return score >= winningScore;
  }

  function resetScore() {
    score = 0;
  }

  function updateCoins() {
    coins.forEach(function(coin) {
      if (utils.areColliding(coin, player)) {
        score += coin.points;
        coin.reset();
        return;
      }
      if (coin.shouldReset()) {
        coin.reset();
      }
      lcd.cursor(coin.row, coin.col);
      lcd.print(coin.char);
    });
  }

  function updatePlayer() {
    lcd.cursor(player.row, player.col);
    lcd.print(player.char);
  }

  function updateScore() {
    lcd.cursor(0, constants.LAST_COL_IDX - 1);
    lcd.print(_.padLeft(score, 2, 0));
  }

  function updateReset() {
    lcd.cursor(reset.row, reset.col);
    lcd.print(reset.char);
    if (utils.areColliding(reset, player)) {
      resetScore();
    }
  }

  function updateMessage() {
    lcd.cursor(0, 4);
    lcd.print('You win.');
  }

  function tick() {
    lcd.clear();

    if (hasWon()) {
      updateMessage();
      updateReset();
    } else {
      updateCoins();
      updateScore();
    }

    updatePlayer();

    setTimeout(tick, refreshRate);
  }

  function initialize() {
    resetScore();
    lcd.useChar('cent');
    lcd.useChar('smile');
    tick();
  }

  initialize();

  this.repl.inject({
    lcd: lcd,
    player: player,
    controls: controls
  });

});
