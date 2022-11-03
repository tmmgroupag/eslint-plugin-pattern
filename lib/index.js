/**
 * @fileoverview Pattern property extension for already existing eslint rules
 * @author Timo Loesch
 */
 "use strict";
 
 //------------------------------------------------------------------------------
 // Plugin Definition
 //------------------------------------------------------------------------------
 
 
 // import all rules in lib/rules
 module.exports = {
     rules: {
         'no-undef': require('./rules/no-undef'),
     }
 };