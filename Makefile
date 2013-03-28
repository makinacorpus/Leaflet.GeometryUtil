test:
	@./node_modules/mocha-phantomjs/bin/mocha-phantomjs test/index.html

docs:
	@./node_modules/jsdoc/jsdoc -d ./docs/ dist/ README.md

.PHONY: test docs
