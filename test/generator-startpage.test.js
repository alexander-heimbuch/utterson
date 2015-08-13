/* eslint-env node, mocha */
'use strict';
var Bluebird = require('bluebird'),
    path = require('path'),
    sinon = require('sinon'),
    chai = require('chai'),
    sinonChai = require('sinon-chai'),
    rewire = require('rewire');

var expect = chai.expect,
    startpageGenerator = rewire('../generators/startpage');

chai.use(sinonChai);

describe('startpage generator', function () {
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
        reset = startpageGenerator.__set__('fileWriter', {
            prefix: filePrefix
        });
    });

    it('should be resilient against missing content', function (done) {
        Bluebird.all([
            startpageGenerator({'my': 'pipe'}).then(function (result) {
                expect(result).to.deep.equal({'my': 'pipe'});
            }),
            startpageGenerator({'content': {'my': 'pipe'}}).then(function (result) {
                expect(result).to.deep.equal({'content': {'my': 'pipe'}});
            }),
            startpageGenerator({'content': {'./': {'my': 'pipe'}}}).then(function (result) {
                expect(result).to.deep.equal({'content': {'./': {'my': 'pipe'}}});
            })
        ]).then(function () {
            done();
        });
    });

    it('should call the template with the correct content', function (done) {
        var testData = {
                'buildDir': path.resolve('test'),
                'content': {
                    './': {
                        'index.md': 'testcontent'
                    }
                }
            },
            testTemplate = function (content, cb) {
                expect(content).to.equal('testcontent');
                cb('index.html', 'custom-html');
            };

        startpageGenerator(testData, testTemplate).then(function () {
            expect(filePrefix).to.have.been.calledWith(testData.buildDir);
            expect(fileAdd).to.have.been.calledWith('index.html', 'custom-html');
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
