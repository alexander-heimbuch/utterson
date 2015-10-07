/* eslint-env node, mocha */
'use strict';
var Bluebird = require('bluebird'),
    path = require('path'),
    sinon = require('sinon'),
    chai = require('chai'),
    sinonChai = require('sinon-chai'),
    rewire = require('rewire'),
    testData = require('./helper/test-data-generator');

var expect = chai.expect,
    pagesGenerator = rewire('../generators/pages');

chai.use(sinonChai);

describe('pages generator', function () {
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
        reset = pagesGenerator.__set__('fileWriter', {
            prefix: filePrefix
        });
    });

    it('should be resilient against missing content', function (done) {
        Bluebird.all([
            pagesGenerator({'my': 'pipe'}).then(function (result) {
                expect(result).to.deep.equal({'my': 'pipe'});
            }),
            pagesGenerator({'content': {'my': 'pipe'}}).then(function (result) {
                expect(result).to.deep.equal({'content': {'my': 'pipe'}});
            }),
            pagesGenerator({'content': {'./': {'my': 'pipe'}}}).then(function (result) {
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
                cb(content.name + '.html', 'custom-html');
            };

        pagesGenerator(testData, testTemplate).then(function () {
            expect(callCounter).to.equal(2);
            expect(filePrefix).to.have.been.calledTwice;
            expect(filePrefix.firstCall).to.have.been.calledWith(path.resolve(testData.buildDir, 'test-folder-one/'));
            expect(filePrefix.secondCall).to.have.been.calledWith(path.resolve(testData.buildDir, 'test-folder-two/'));
            expect(fileAdd).to.have.been.calledTwice;
            expect(fileAdd.firstCall).to.have.been.calledWith('test-page-1.html', 'custom-html');
            expect(fileAdd.secondCall).to.have.been.calledWith('test-page-2.html', 'custom-html');
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
