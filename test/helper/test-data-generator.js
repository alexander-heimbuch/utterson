/* eslint-env node */
'use strict';

var path = require('path');

module.exports = {
    buildDir: path.resolve('test'),
    themesDir: path.resolve('test'),
    theme: 'theme',
    content: {
        'test-folder-one/': {
            type: 'pages',
            'index.md': 'testcontent-page-one',
            files: ['test-page-1.md'],
            'test-page-1.md': {
                content: 'test content page 1',
                name: 'test-page-1',
                parentDir: 'test-folder-one/',
                href: 'test-folder-one/test-page-1'
            }
        },
        'test-folder-two/': {
            type: 'pages',
            'index.md': 'testcontent-page-two',
            files: ['test-page-2.md'],
            'test-page-2.md': {
                content: 'test content page 2',
                name: 'test-page-2',
                parentDir: 'test-folder-two/',
                href: 'test-folder-two/test-page-2'
            }
        },
        'test-folder-three/': {
            type: 'pages',
            'index.md': 'testcontent-page-three',
            files: ['test-page-3.md', 'test-page-4.md', 'test-page-5.md'],
            'test-page-3.md': undefined,
            'test-page-4.md': {
                content: 'test content page 5',
                parentDir: 'test-folder-two/',
                href: 'test-folder-two/test-page-5'
            },
            'test-page-5.md': {
                content: 'test content page 5',
                name: 'test-page-5',
                href: 'test-folder-two/test-page-5'
            }
        },
        'test-category-one/': {
            type: 'posts',
            'index.md': {
                posts: ['test content post 1']
            },
            files: ['index.md', 'test-post-1.md'],
            'test-post-1.md': {
                content: 'test content post 1',
                name: 'test-post-1',
                parentDir: 'test-category-one/',
                href: 'test-category-one/test-post-1'
            }
        },
        'test-category-two/': {
            type: 'posts',
            'index.md': {
                posts: ['test content post 2']
            },
            files: ['index.md', 'test-post-2.md'],
            'test-post-2.md': {
                content: 'test content post 2',
                name: 'test-post-2',
                parentDir: 'test-category-two/',
                href: 'test-category-two/test-post-2'
            }
        },
        'test-category-three/': {
            type: 'posts',
            files: ['test-post-3.md', 'test-post-4.md', 'test-post-5.md', 'test-post-6.md'],
            'test-post-3.md': {
                content: 'test content post 3',
                name: 'test-post-3',
                parentDir: 'test-category-three/',
                href: 'test-category-three/test-post-3'
            },
            'test-post-4.md': undefined,
            'test-post-5.md': {
                content: 'test content post 5',
                parentDir: 'test-category-three/',
                href: 'test-category-three/test-post-5'
            },
            'test-post-6.md': {
                content: 'test content post 6',
                name: 'test-post-6',
                href: 'test-category-three/test-post-6'
            }
        },
        'statics/': {
            type: 'statics',
            files: ['static-file-1', 'static-file-2', 'static-file-3'],
            'static-file-1': {
                content: 'bitstream',
                name: 'static-file-1',
                parentDir: 'statics/',
                href: 'statics/static-file-1'
            },
            'static-file-2': {
                content: 'bitstream',
                name: 'static-file-2',
                parentDir: 'statics/',
                href: 'statics/static-file-2'
            },
            'static-file-3': {
                content: 'bitstream',
                name: 'static-file-3',
                parentDir: 'statics/',
                href: 'statics/static-file-3'
            }
        }
    }
};
