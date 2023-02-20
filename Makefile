
install:
	npm ci
gendiff:
	node bin/gendiff.js
publish:
	npm publish --dry-run
.PHONY:
	test
lint:
	npx eslint .
