
install:
	npm ci
gendiff:
	bin/gendiff.js file1.json file2.json
publish:
	npm publish --dry-run
.PHONY:
	test
lint:
	npx eslint .
test:
	NODE_OPTIONS=--experimental-vm-modules npx jest
test-coverage:
	NODE_OPTIONS=--experimental-vm-modules npx jest --coverage
 