module.exports = {
  log: log,
  time: time,
}

function log(args) {
  var s = '';
  for (var k in args) {
    var v = args[k];
    s += k
    s += '='
    s += v
    s += ' '
  }

  console.log(s)
}

function time() {
  return new Logger()
}

function Logger() {
  this.time = new Date().getTime()
}

Logger.prototype.log = function(args) {
  args.elapsed = new Date().getTime() - this.time
  log(args)
}