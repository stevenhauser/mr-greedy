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
    stillChar: '^'
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
      char: '$',
      // -2 to make room for score
      maxCol: constants.LAST_COL_IDX - 2,
      minDur: 1000,
      maxDur: 3000
    })
  });

  controls.on('changed', player.move.bind(player));

  var score = 0;
  var refreshRate = 250;
  function tick() {
    lcd.clear();

    coins.forEach(function(coin) {
      if (utils.areColliding(coin, player)) {
        score++;
        coin.reset();
        return;
      }
      if (coin.shouldReset()) {
        coin.reset();
      }
      lcd.cursor(coin.row, coin.col);
      lcd.print(coin.char);
    });

    lcd.cursor(player.row, player.col);
    lcd.print(player.char);

    lcd.cursor(0, constants.LAST_COL_IDX - 1);
    lcd.print(_.padLeft(score, 2, 0));

    setTimeout(tick, refreshRate);
  }

  tick();

  this.repl.inject({
    lcd: lcd,
    player: player,
    controls: controls
  });

});
