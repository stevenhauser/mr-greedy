var five            = require('johnny-five');
var playerCreator   = require('./player');
var controlsCreator = require('./controls');
var utils           = require('./utils');

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
    max: 15
  });

  controls.on('changed', player.move.bind(player));

  var refreshRate = 100;
  function tick() {
    lcd.clear();
    lcd.cursor(1, player.loc);
    lcd.print(player.char);
    setTimeout(tick, refreshRate);
  }

  tick();

  this.repl.inject({
    lcd: lcd,
    player: player,
    controls: controls
  });

});
