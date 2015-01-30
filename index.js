var five = require('johnny-five');
var board = new five.Board();

console.log( 'I…AM…RUN-NING' );

board.on('ready', function() {

  console.log( 'here we goooooooo!' );

  var lcd = new five.LCD({
    pins: [12, 11, 2, 3, 4, 5]
  });

  var knob = new five.Sensor({
    pin: 'A0',
    freq: 50,
    threshold: 5
  });

  knob.scale(100, 1000).on('data', function() {
    opts.tickDur = this.value;
  });

  var curIdx = 0;
  var opts = {
    tickDur: 1000,
    words: []
  };

  function lastWordIdx() {
    return opts.words.length - 1;
  }

  function printNextWord() {
    lcd.clear().print(opts.words[curIdx] || '');
  }

  function prepNextWord() {
    curIdx++;
    if (curIdx > lastWordIdx()) { curIdx = 0; }
  }

  function tick() {
    setTimeout(function() {
      printNextWord();
      prepNextWord();
      tick();
    }, opts.tickDur);
  }

  tick();

  this.repl.inject({
    lcd: lcd,
    knob: knob,
    opts: opts
  });

});
