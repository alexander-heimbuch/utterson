/* eslint-env node */
'use strict';

var path = require('path');

module.exports = {
    contentDir: path.resolve('test/content'),
    content: {
        './': {
            type: 'pages',
            files: ['test-markdown-page-1.md', 'test-markdown-page-2.md']
        },
        'static/': {
            type: 'statics',
            files: ['test-image-1.png', 'test-image-2.png']
        },
        'test-category-one/': {
            type: 'posts',
            files: ['test-markdown-post-1.md', 'test-markdown-post-2.md', 'test-markdown-post-5.md']
        },
        'test-category-two/': {
            type: 'posts',
            files: ['test-markdown-post-3.md', 'test-markdown-post-4.md']
        }
    }
};
