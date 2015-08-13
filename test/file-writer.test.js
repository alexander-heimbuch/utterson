/* eslint-env node, mocha */
'use strict';

var path = require('path'),
    chai = require('chai'),
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),
    fsMock = require('fs-extra-promise'),
    rewire = require('rewire');

var expect = chai.expect,
    fileWriter = rewire('../tools/file-writer');

chai.use(sinonChai);

describe('file writer', function () {
    var reset;

    before(function () {
        fsMock.outputFileAsync = sinon.stub();
        fsMock.copyAsync = sinon.stub();
        reset = fileWriter.__set__({
            'fs': fsMock,
            'winston': {
                info: function () {}
            }
        });
    });

    beforeEach(function () {
        fileWriter.stack = [];
    });

    it('should export it\'s core functionality', function () {
        expect(fileWriter).to.be.an('object').that.have.any.keys(['add', 'run', 'write', 'stack']);
        expect(fileWriter.add).to.be.a('function');
        expect(fileWriter.run).to.be.a('function');
        expect(fileWriter.write).to.be.a('function');
        expect(fileWriter.stack).to.be.an('array');
    });

    it('should be able to add a order with function two parameters', function () {
        fileWriter.add('myFilePath', 'myFileContent');
        expect(fileWriter.stack).to.have.length(1);
        expect(fileWriter.stack[0]).to.have.keys(['dest', 'content']);
        expect(fileWriter.stack[0].dest).to.equal('myFilePath');
        expect(fileWriter.stack[0].content).to.equal('myFileContent');
    });

    it('should be able to add a order with a single object', function () {
        fileWriter.add({dest: 'myFilePath', content: 'myFileContent'});
        expect(fileWriter.stack).to.have.length(1);
        expect(fileWriter.stack[0]).to.have.keys(['dest', 'content']);
        expect(fileWriter.stack[0].dest).to.equal('myFilePath');
        expect(fileWriter.stack[0].content).to.equal('myFileContent');
    });

    it('should be able to add a order with a single object', function () {
        fileWriter.add({dest: 'myFilePath', content: 'myFileContent'});
        expect(fileWriter.stack).to.have.length(1);
        expect(fileWriter.stack[0]).to.have.keys(['dest', 'content']);
        expect(fileWriter.stack[0].dest).to.equal('myFilePath');
        expect(fileWriter.stack[0].content).to.equal('myFileContent');
    });

    it('should be able to add a order with multiple objects', function () {
        fileWriter.add({dest: 'myFilePath', content: 'myFileContent'}, {dest: 'myFilePath1', content: 'myFileContent1'});
        expect(fileWriter.stack).to.have.length(2);
        expect(fileWriter.stack[0]).to.have.keys(['dest', 'content']);
        expect(fileWriter.stack[0].dest).to.equal('myFilePath');
        expect(fileWriter.stack[0].content).to.equal('myFileContent');
        expect(fileWriter.stack[1]).to.have.keys(['dest', 'content']);
        expect(fileWriter.stack[1].dest).to.equal('myFilePath1');
        expect(fileWriter.stack[1].content).to.equal('myFileContent1');
    });

    it('should be able to add a order with an array', function () {
        fileWriter.add([
            {dest: 'myFilePath', content: 'myFileContent'},
            {dest: 'myFilePath1', content: 'myFileContent1'}
        ]);
        expect(fileWriter.stack).to.have.length(2);
        expect(fileWriter.stack[0]).to.have.keys(['dest', 'content']);
        expect(fileWriter.stack[0].dest).to.equal('myFilePath');
        expect(fileWriter.stack[0].content).to.equal('myFileContent');
        expect(fileWriter.stack[1]).to.have.keys(['dest', 'content']);
        expect(fileWriter.stack[1].dest).to.equal('myFilePath1');
        expect(fileWriter.stack[1].content).to.equal('myFileContent1');
    });

    it('should be resilient towards invalid file properties', function () {
        fileWriter.add({invalid: 'myFilePath', content: 'myFileContent'});
        fileWriter.add({dest: 123, content: 'myFileContent'});
        fileWriter.add(123, 'myFileContent');
        fileWriter.add([{dest: 123, content: 'myFileContent'}]);
        expect(fileWriter.stack).to.have.length(0);
    });

    it('should have the ability to chain add', function () {
        fileWriter
            .add('myFilePath', 'myFileContent')
            .add('myFilePath1', 'myFileContent1');
        expect(fileWriter.stack).to.have.length(2);
        expect(fileWriter.stack[0]).to.have.keys(['dest', 'content']);
        expect(fileWriter.stack[0].dest).to.equal('myFilePath');
        expect(fileWriter.stack[0].content).to.equal('myFileContent');
        expect(fileWriter.stack[1]).to.have.keys(['dest', 'content']);
        expect(fileWriter.stack[1].dest).to.equal('myFilePath1');
        expect(fileWriter.stack[1].content).to.equal('myFileContent1');
    });

    it('should be able to write file content', function (done) {
        fileWriter
            .add('myFilePath', 'myFileContent')
            .run()
            .then(function () {
                expect(fsMock.outputFileAsync).to.have.been.calledWith(path.resolve('myFilePath'), 'myFileContent');
                done();
            });
    });

    it('should be able to copy files', function (done) {
        fileWriter
            .add({dest: 'myFilePath', src: 'myFileSrc'})
            .run()
            .then(function () {
                expect(fsMock.copyAsync).to.have.been.calledWith('myFileSrc', path.resolve('myFilePath'));
                done();
            });
    });

    afterEach(function () {
        fsMock.outputFileAsync.reset();
        fsMock.copyAsync.reset();
    });

    after(function () {
        reset();
    });
});
