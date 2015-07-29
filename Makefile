test:
	@node node_modules/.bin/lab -v test/test.js

deps:
	npm install .

.PHONY: test deps
