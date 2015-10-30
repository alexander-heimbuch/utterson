# Utterson
Simple static blog (and page) generator written in NodeJS.

## Installation

```
npm install utterson
```

## Usage

*TL;DR Have a look at the [utterson-example](https://github.com/alexander-heimbuch/utterson-example) repository for a basic example*

```
var utterson = require('utterson');
utterson();
```

Utterson follows the mindset convention over configuration. If you are sticking to the following conventions you don't need to pass any parameter to Utterson. In any other case it is possible to configure Utterson to your needs by passing a configuration object to the function:

```
var config = {
    "contentDir": "content",
    "buildDir": "build",
    "templatesDir": "templates",
    "template": "default",
    "content": {
        "./": {
            "type": "pages"
        },
        "static/": {
            "type": "statics"
        }
    }
};

utterson(config);
```

## Documentation

[1 Content and Configuration](https://github.com/alexander-heimbuch/utterson/wiki/1-Content-and-Configuration)

[2 Templates](https://github.com/alexander-heimbuch/utterson/wiki/2-Templates)

[3 Filewriter](https://github.com/alexander-heimbuch/utterson/wiki/3-Filewriter)

## License
MIT-Licensed
