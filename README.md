# Utterson-Generator
Git markdown parsing and static html generator module for the static blog generation framework [Utterson](https://github.com/zusatzstoff/utterson).

## Installation

```
npm install utterson-generator
```

## Usage

```
var generator = require('utterson-generator');
```

## Requirements

* Parses markdown files from different directories on one level
* Needs an intelligent template like [Utterson-Casper](https://github.com/zusatzstoff/utterson-casper) to generate the static html

## Core Methods

```
// Set the template
generator.use(templateReference);

// Add a source directory for markdown files
generator.add(pathToMarkdownDirectory);

// Ignoring a specific directory in sources
generator.ignore(['folderName1', 'folderName2']);

// Setup the distribution folder that will be the destination of the static html files
generator.dist(pathToDistributionFolder);

// Trigger the transformation from the markdown files
generator.build();
```

## Additional Methods

```
// Set a logging function
generator.logger(loggingFn);
```

## License
MIT-Licensed