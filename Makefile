test:
	@./node_modules/.bin/mocha

docs:
	@./node_modules/jsdoc/jsdoc -d ./docs/ dist/ README.md

.PHONY: test docs
