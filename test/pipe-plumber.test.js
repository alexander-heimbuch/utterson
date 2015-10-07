/*eslint-env node, mocha*/
'use strict';

var chai = require('chai'),
    sinonChai = require('sinon-chai'),
    path = require('path'),
    plumber = require('../pipe/plumber'),
    expect = chai.expect;

chai.use(sinonChai);

describe('pipe plumber', function () {
    it('should export path, sieve and filter method', function () {
        expect(plumber).to.be.an('object');
        expect(plumber.path).to.be.a('function');
        expect(plumber.sieve).to.be.a('function');
        expect(plumber.filter).to.be.a('function');
    });

    it('should resolve a given path', function () {
        var defaults = {
                'attr': 'val'
            },
            custom = {
                'attr': 'val2'
            };

        expect(plumber.path).to.throw('Missing Parameter');
        expect(function () {
            plumber.path(defaults);
        }).to.throw('Missing Parameter');
        expect(plumber.path(defaults, 'attr')).to.equal(path.resolve('val'));
        expect(plumber.path(defaults, 'attr', custom)).to.equal(path.resolve('val2'));
    });

    it('should sieve posts, pages and statics from the content', function () {
        var testContent = {
            './': { type: 'pages' },
            'static/': { type: 'statics' },
            'test-category-one/': { type: 'posts' },
            'test-category-two/': { type: 'posts' }
        };

        expect(plumber.sieve(undefined, 'posts')).to.be.an('Object')
            .that.is.empty;
        expect(plumber.sieve(undefined, 'pages')).to.be.an('Object')
            .that.is.empty;
        expect(plumber.sieve(undefined, 'statics')).to.be.an('Object')
            .that.is.empty;

        expect(plumber.sieve(testContent, 'posts')).to.be.an('Object')
            .with.keys(['test-category-one/', 'test-category-two/']);

        expect(plumber.sieve(testContent, 'pages')).to.be.an('Object')
            .with.keys(['./']);

        expect(plumber.sieve(testContent, 'statics')).to.be.an('Object')
            .with.keys(['static/']);
    });

    it('should filter posts, pages and statics from the content', function () {
        var testContent = {
            './': {
                type: 'pages',
                files: ['test-page-1.md', 'test-page-2.md', 'index.md'],
                'test-page-1.md': 'page content',
                'test-page-2.md': 'page content',
                'index.md': 'page content'
            },
            'static/': {
                type: 'statics',
                files: ['test-image-1.png', 'test-image-2.png'],
                'test-image-1.png': 'image content',
                'test-image-2.png': 'image content'
            },
            'test-category-one/': {
                type: 'posts',
                files: ['test-post-1.md', 'test-post-2.md', 'index.md'],
                'test-post-1.md': 'post content',
                'test-post-2.md': 'post content',
                'index.md': {
                    posts: ['post-1', 'post-2']
                }
            },
            'test-category-two/': {
                type: 'posts',
                files: ['test-post-3.md', 'test-post-4.md'],
                'test-post-3.md': 'post content',
                'test-post-4.md': 'post content'
            }
        };

        expect(plumber.filter(testContent, 'posts')).to.be.an('Array')
            .with.length(4);

        expect(plumber.filter(testContent, 'pages')).to.be.an('Array')
            .with.length(3);

        expect(plumber.filter(testContent, 'statics')).to.be.an('Array')
            .with.length(2);
    });
});
