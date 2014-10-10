"use strict";

var grunt = require('grunt');
var path = require('path');
var rm = require('rimraf');
var mkdir = require('mkdirp');
var dynamicFilename = "grunt-crx-13.3.7.crx";
var expect = require('chai').expect;

var extensionHelper = require(__dirname + '/../lib/crx.js').init(grunt);

describe('lib/crx', function(){
  var extensionConfigs;

  beforeEach(function(){
    extensionConfigs = {
      "standard": extensionHelper.getTaskConfiguration('test-standard'),
      "codebase": extensionHelper.getTaskConfiguration('test-codebase'),
      "exclude": extensionHelper.getTaskConfiguration('test-exclude')
    };
  });

  afterEach(function(done){
    var filepath = path.join(__dirname, 'data', 'files');

    rm(filepath, mkdir.bind(null, filepath, done));
  });

  describe('build', function(){
    it('should build without the codebase parameter', function(done){
      var crx = extensionHelper.createObject(extensionConfigs.standard);

      extensionHelper.build(crx, function(){
	expect(grunt.file.expand('test/data/files/test.crx')).to.have.lengthOf(1);
	expect(grunt.file.expand('test/data/files/'+dynamicFilename)).to.have.lengthOf(0);
	expect(grunt.file.expand('test/data/files/updates.xml')).to.have.lengthOf(0);

	crx.destroy();
	done();
      });
    });

    it('should build with a codebase parameter', function(done){
      var crx = extensionHelper.createObject(extensionConfigs.codebase);

      extensionHelper.build(crx, function(){
	expect(grunt.file.expand('test/data/files/test.crx')).to.have.lengthOf(0);
	expect(grunt.file.expand('test/data/files/'+dynamicFilename)).to.have.lengthOf(1);
	expect(grunt.file.expand('test/data/files/updates.xml')).to.have.lengthOf(0);

        crx.destroy();
	done();
      });
    });

    it('should exclude files', function(done){
      var crx = extensionHelper.createObject(extensionConfigs.exclude);

      extensionHelper.build(crx, function(){
        //local
	expect(grunt.file.expand('test/data/src/stuff/*')).to.have.lengthOf(1);
	expect(grunt.file.expand('test/data/src/*')).to.have.lengthOf(5);

        //copy
	expect(grunt.file.expand(path.join(crx.path + '/stuff/*'))).to.have.lengthOf(0);
	expect(grunt.file.expand(path.join(crx.path + '/*'))).to.have.lengthOf(3);

        crx.destroy();
	done();
      });
    });
  });
});
