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

  // Set up in `intialize` below;
  var score;
  var winningScore;
  var refreshRate;

  // Create a simple entity w/o a prototype
  // to faciliate collision detection.
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

  function drawEntity(entity) {
    lcd.cursor(entity.row, entity.col);
    lcd.print(entity.char);
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
      drawEntity(coin);
    });
  }

  function updatePlayer() {
    drawEntity(player);
  }

  function updateScore() {
    drawEntity({
      row: 0,
      col: constants.LAST_COL_IDX - 1,
      char: _.padLeft(score, 2, 0)
    });
  }

  function updateReset() {
    if (utils.areColliding(reset, player)) {
      resetScore();
    } else {
      drawEntity(reset);
    }
  }

  function updateMessage() {
    drawEntity({
      row: 0,
      col: 4,
      char: 'You win.'
    });
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
    winningScore = 50;
    refreshRate = 300;
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
