/* eslint-env node, mocha */
'use strict';

var chai = require('chai'),
    sinonChai = require('sinon-chai'),
    path = require('path'),
    architect = require('../pipe/architect'),
    expect = chai.expect;

chai.use(sinonChai);

describe('pipe architect', function () {
    it('should resolve the default buildDir correctly', function (done) {
        architect.initializeConfig().then(function (data) {
            expect(data.buildDir).to.equal(path.resolve('build'));
            done();
        });
    });

    it('should resolve a custom buildDir correctly', function (done) {
        architect.initializeConfig({
            buildDir: 'my-custom-build-dir'
        }).then(function (data) {
            expect(data.buildDir).to.equal(path.resolve('my-custom-build-dir'));
            done();
        });
    });

    it('should resolve the default contentDir correctly', function (done) {
        architect.initializeConfig().then(function (data) {
            expect(data.contentDir).to.equal(path.resolve('content'));
            done();
        });
    });

    it('should resolve a custom contentDir correctly', function (done) {
        architect.initializeConfig({
            contentDir: 'my-custom-content-dir'
        }).then(function (data) {
            expect(data.contentDir).to.equal(path.resolve('my-custom-content-dir'));
            done();
        });
    });

    it('should resolve the themesDir correctly', function (done) {
        architect.initializeConfig().then(function (data) {
            expect(data.themesDir).to.equal(path.resolve('themes'));
            done();
        });
    });

    it('should resolve a custom themesDir correctly', function (done) {
        architect.initializeConfig({
            themesDir: 'my-custom-themes-dir'
        }).then(function (data) {
            expect(data.themesDir).to.equal(path.resolve('my-custom-themes-dir'));
            done();
        });
    });

    it('should resolve a custom content structure', function (done) {
        architect.initializeConfig({
            contentDir: 'test/content',
            content: {
                'test-category-two/': {
                    type: 'pages'
                }
            }
        }).then(architect.loadCustoms).then(function (data) {
            expect(data.content).to.deep.equal({
                './': {
                    type: 'pages'
                },
                'static/': {
                    type: 'statics'
                },
                'test-category-two/': {
                    type: 'pages'
                }
            });
            done();
        });
    });
});
