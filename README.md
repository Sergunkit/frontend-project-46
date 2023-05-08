Console application that compares two files in JSON or YAML format and outputs the result of the comparison in one of three possible formats, depending on the option. Possible output formats: - stylish, - plain, - json.

### Hexlet tests and linter status:

[![Actions Status](https://github.com/Sergunkit/frontend-project-46/workflows/hexlet-check/badge.svg)](https://github.com/Sergunkit/frontend-project-46/actions)

[![Maintainability](https://api.codeclimate.com/v1/badges/574a83b3791c342014bf/maintainability)](https://codeclimate.com/github/Sergunkit/frontend-project-46/maintainability)

[![Test Coverage](https://api.codeclimate.com/v1/badges/574a83b3791c342014bf/test_coverage)](https://codeclimate.com/github/Sergunkit/frontend-project-46/test_coverage)

![Test Status](https://github.com/Sergunkit/frontend-project-46/actions/workflows/first.yml/badge.svg?event=push)

### Install:
git clone https://github.com/sergunkit/frontend-project-46
cd frontend-project-46/
make install

### Demo:
make gendiff

### Start:

bin/gendiff.js filePath.fileName1.fileExtension filePath.fileName3.fileExtension outputformat

fileExtension = .json 
              = .yaml
            
outputformat = 'stylish'
             = 'plain'
             = 'json'

https://asciinema.org/a/yIR5Yal0z323Yfn5dufWTTclX

https://asciinema.org/a/568642