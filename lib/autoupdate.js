"use strict";

var path = require('path');
var async = require('async');
var fs = require('fs');

/**
 * Initializes the crx autoupdate grunt helper
 *
 * @returns {{buildXML: Function, build: Function}}
 */
exports.init = function(){
  /**
   * Generates an autoupdate XML file
   *
   * @param {crx} ChromeExtension
   * @param {Function} callback
   */
  function buildXML(ChromeExtension, callback) {
    if (!ChromeExtension.manifest.update_url || !ChromeExtension.codebase){
      return callback();
    }

    async.series([
      //ensuring publicKey
      function generatePublicKey(done){
        if (ChromeExtension.publicKey !== undefined){
          return done();
        }

        ChromeExtension.generatePublicKey(done);
      },
      //generating file
      function generateXML(done){
        ChromeExtension.generateUpdateXML();
        var dest = path.dirname(ChromeExtension.dest);
        var filename = path.join(dest, path.basename(ChromeExtension.manifest.update_url));

	fs.writeFile(filename, ChromeExtension.updateXML, done);
      }
    ], callback);
  }

  /*
   * Blending
   */
  return {
    "buildXML": buildXML
  };
};