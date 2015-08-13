/* eslint-env node, mocha */
'use strict';

var Bluebird = require('bluebird'),
    chai = require('chai'),
    sinonChai = require('sinon-chai'),
    sinon = require('sinon'),
    rewire = require('rewire'),
    testData = require('./helper/test-data-generator');

var expect = chai.expect,
    customGenerator = rewire('../generators/custom');

chai.use(sinonChai);

describe('custom generator', function () {
    var reset,

        fileAdd = sinon.stub().returns({
            run: function () {
                return Bluebird.resolve(testData);
            }
        }),

        filePrefix = sinon.stub().returns({
            add: fileAdd
        });

    before(function () {
        reset = customGenerator.__set__('fileWriter', {
            prefix: filePrefix
        });
    });

    it('should export a function', function () {
        expect(customGenerator).to.be.a('function');
    });

    it('should be resilient against missing content', function (done) {
        var testTemplate = function (pipe, cb) {
            cb();
        };

        Bluebird.all([
            customGenerator({'my': 'pipe'}, testTemplate).then(function (result) {
                expect(result).to.deep.equal({'my': 'pipe'});
            }),
            customGenerator({'content': {'my': 'pipe'}}, testTemplate).then(function (result) {
                expect(result).to.deep.equal({'content': {'my': 'pipe'}});
            }),
            customGenerator({'content': {'./': {'my': 'pipe'}}}, testTemplate).then(function (result) {
                expect(result).to.deep.equal({'content': {'./': {'my': 'pipe'}}});
            })
        ]).then(function () {
            done();
        });
    });

    it('should parse all static files and initiate the write process', function (done) {
        var testTemplate = function (pipe, cb) {
            expect(pipe).to.equal(testData);
            cb({'dest': 'testDest', 'content': 'testContent'});
        };

        customGenerator(testData, testTemplate).then(function () {
            expect(filePrefix).to.have.been.calledOnce;
            expect(filePrefix).to.have.been.calledWith(testData.buildDir);
            expect(fileAdd).to.have.been.calledOnce;
            done();
        });
    });

    afterEach(function () {
        fileAdd.reset();
        filePrefix.reset();
    });

    after(function () {
        reset();
    });
});
