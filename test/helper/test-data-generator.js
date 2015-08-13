/* eslint-env node */
'use strict';

var path = require('path');

module.exports = {
    buildDir: path.resolve('test'),
    templatesDir: path.resolve('test'),
    template: 'template',
    content: {
        'test-folder-one/': {
            type: 'pages',
            'index.md': 'testcontent-page-one',
            files: ['test-page-1.md'],
            'test-page-1.md': {
                content: 'test content page 1'
            }
        },
        'test-folder-two/': {
            type: 'pages',
            'index.md': 'testcontent-page-two',
            files: ['test-page-2.md'],
            'test-page-2.md': {
                content: 'test content page 2'
            }
        },
        'test-category-one/': {
            type: 'posts',
            'index.md': {
                posts: ['test content post 1']
            },
            files: ['index.md', 'test-post-1.md'],
            'test-post-1.md': {
                content: 'test content post 1'
            }
        },
        'test-category-two/': {
            type: 'posts',
            'index.md': {
                posts: ['test content post 2']
            },
            files: ['index.md', 'test-post-2.md'],
            'test-post-2.md': {
                content: 'test content post 2'
            }
        },
        'statics/': {
            type: 'statics',
            files: ['static-file-1', 'static-file-2', 'static-file-3'],
            'static-file-1': {content: 'bitstream'},
            'static-file-2': {content: 'bitstream'},
            'static-file-3': {content: 'bitstream'}
        }
    }
};
