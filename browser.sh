browserify node_modules/bitcoinjs-lib/src/index.js -s bitcoin | ./node_modules/.bin/uglifyjs > bitcoinjs-lib.min.js
browserify node_modules/helloblock-js/lib/helloblock.js -s HelloBlock | ./node_modules/.bin/uglifyjs > helloblock-js.min.js
