/* eslint-env node, mocha */
'use strict';

var Bluebird = require('bluebird'),
    chai = require('chai'),
    sinonChai = require('sinon-chai'),
    sinon = require('sinon'),
    rewire = require('rewire'),
    testData = require('./helper/test-data-generator');

var expect = chai.expect,
    staticsGenerator = rewire('../generators/statics');

chai.use(sinonChai);

describe('static generator', function () {
    var reset,

        fileAdd = sinon.stub().returns({
            run: function () {
                return Bluebird.resolve();
            }
        }),

        filePrefix = sinon.stub().returns({
            add: fileAdd
        });

    before(function () {
        reset = staticsGenerator.__set__('fileWriter', {
            prefix: filePrefix
        });
    });

    it('should export a function', function () {
        expect(staticsGenerator).to.be.a('function');
    });

    it('should be resilient against missing content', function (done) {
        Bluebird.all([
            staticsGenerator({'my': 'pipe'}).then(function (result) {
                expect(result).to.deep.equal({'my': 'pipe'});
            }),
            staticsGenerator({'content': {'my': 'pipe'}}).then(function (result) {
                expect(result).to.deep.equal({'content': {'my': 'pipe'}});
            }),
            staticsGenerator({'content': {'./': {'my': 'pipe'}}}).then(function (result) {
                expect(result).to.deep.equal({'content': {'./': {'my': 'pipe'}}});
            })
        ]).then(function () {
            done();
        });
    });

    it('should parse all static files and initiate the write process', function (done) {
        staticsGenerator(testData).then(function () {
            expect(filePrefix).to.have.been.calledFourth;
            expect(filePrefix).to.have.been.calledWith(testData.buildDir);
            expect(fileAdd).to.have.been.calledFourth;
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
