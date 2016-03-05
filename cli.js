#! /usr/bin/env node

const fs = require('fs');

const cyclops = require('./cyclops');
const program = require('commander');

program
  .version('0.1.2')
  .arguments('<sourceFile>')
  .parse(process.argv);
