
install:
	npm ci
gendiff:
	bin/gendiff.js ./__fixtures__/file3.yaml ./__fixtures__/file4.yaml
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
 