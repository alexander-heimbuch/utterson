/* eslint-env node, mocha */
'use strict';
var _ = require('lodash'),
    Bluebird = require('bluebird'),
    path = require('path'),
    sinon = require('sinon'),
    chai = require('chai'),
    sinonChai = require('sinon-chai'),
    rewire = require('rewire'),
    testData = require('./helper/test-data-generator');

var expect = chai.expect,
    categoryGenerator = rewire('../generators/categories');

chai.use(sinonChai);

describe('categories generator', function () {
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
        reset = categoryGenerator.__set__('fileWriter', {
            prefix: filePrefix
        });
    });

    it('should be resilient against missing content', function (done) {
        Bluebird.all([
            categoryGenerator({'my': 'pipe'}).then(function (result) {
                expect(result).to.deep.equal({'my': 'pipe'});
            }),
            categoryGenerator({'content': {'my': 'pipe'}}).then(function (result) {
                expect(result).to.deep.equal({'content': {'my': 'pipe'}});
            }),
            categoryGenerator({'content': {'./': {'my': 'pipe'}}}).then(function (result) {
                expect(result).to.deep.equal({'content': {'./': {'my': 'pipe'}}});
            })
        ]).then(function () {
            done();
        });
    });

    it('should call the template with the correct content', function (done) {
        var callCounter = 0,
            testTemplate = function (content, cb) {
                callCounter += 1;
                cb('index.html', 'custom-html');
            };

        categoryGenerator(testData, testTemplate).then(function () {
            expect(callCounter).to.equal(2);
            expect(filePrefix).to.have.been.calledTwice;
            expect(filePrefix.firstCall).to.have.been.calledWith(path.resolve(testData.buildDir, 'test-category-one/'));
            expect(filePrefix.secondCall).to.have.been.calledWith(path.resolve(testData.buildDir, 'test-category-two/'));
            expect(fileAdd).to.have.been.calledTwice;
            expect(fileAdd).to.have.been.always.calledWith('index.html', 'custom-html');
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
