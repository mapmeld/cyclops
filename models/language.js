const mongoose = require('mongoose');

const languageSchema = mongoose.Schema({
  name: String,
  humanlanguage: String,
  author: String,
  version: String,
  digits: String,
  rtl: Boolean,
  created: Date,
  updated: Date,
  cmd: {
    xHELPx: String,
    xLOOPx: String,
    xSWITCHx: String,
    xSWITCHEDx: String,
    xSUBTRACTx: String,
    xDIVIDEx: String,
    xMULTIPLYx: String,
    xBREAKx: String,
    xFUNCENDx: String,
    xFUNCSTARTx: String,
    xPARAMONEx: String,
    xPARAMTWOx: String,
    xPARAMTHREEx: String,
    xPARAMFOURx: String,
    xPARAMFIVEx: String,
    xPRINTx: String,
    xINPUTx: String,
    xRANDx: String,
    xGREATERx: String,
    xLESSERx: String,
    xDUBEQUALx: String,
    xADDx: String,
    xSTOREx: String
  }
});

module.exports = mongoose.model('Language', languageSchema);
