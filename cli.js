#! /usr/bin/env node

const fs = require('fs');

const cyclops = require('./cyclops');
const program = require('commander');

program
  .version('0.1.2')
  .arguments('<sourceFile>')
  .parse(process.argv);

if (process.argv.length < 3) {
  throw 'no file to run :(';
}
fs.readFile(process.argv[2], { encoding: 'utf8' }, function (err, data) {
  if (err) {
    throw err;
  }
  cyclops(data, function (err, output) {
    if (err) {
      throw err;
    }
    console.log(output);
  });
});
