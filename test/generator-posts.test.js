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
    postsGenerator = rewire('../generators/posts');

chai.use(sinonChai);

describe('posts generator', function () {
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
        reset = postsGenerator.__set__('fileWriter', {
            prefix: filePrefix
        });
    });

    it('should be resilient against missing content', function (done) {
        Bluebird.all([
            postsGenerator({'my': 'pipe'}).then(function (result) {
                expect(result).to.deep.equal({'my': 'pipe'});
            }),
            postsGenerator({'content': {'my': 'pipe'}}).then(function (result) {
                expect(result).to.deep.equal({'content': {'my': 'pipe'}});
            }),
            postsGenerator({'content': {'./': {'my': 'pipe'}}}).then(function (result) {
                expect(result).to.deep.equal({'content': {'./': {'my': 'pipe'}}});
            })
        ]).then(function () {
            done();
        });
    });

    it('should call the theme with the correct content', function (done) {
        var callCounter = 0,
            testTheme = function (content, cb) {
                callCounter += 1;
                cb(content.name + '.html', 'custom-html');
            };

        postsGenerator(testData, testTheme).then(function () {
            expect(callCounter).to.equal(3);
            expect(filePrefix).to.have.been.calledThrice;
            expect(filePrefix.firstCall).to.have.been.calledWith(path.resolve(testData.buildDir, 'test-category-one/'));
            expect(filePrefix.secondCall).to.have.been.calledWith(path.resolve(testData.buildDir, 'test-category-two/'));
            expect(filePrefix.thirdCall).to.have.been.calledWith(path.resolve(testData.buildDir, 'test-category-three/'));
            expect(fileAdd).to.have.been.calledThrice;
            expect(fileAdd.firstCall).to.have.been.calledWith('test-post-1.html', 'custom-html');
            expect(fileAdd.secondCall).to.have.been.calledWith('test-post-2.html', 'custom-html');
            expect(fileAdd.thirdCall).to.have.been.calledWith('test-post-3.html', 'custom-html');
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
