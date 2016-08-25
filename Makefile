INSTALL_STAMP=.install.stamp

all: install
install: $(INSTALL_STAMP)

$(INSTALL_STAMP):
	npm install
	touch $(INSTALL_STAMP)

test: install
	@./node_modules/mocha-phantomjs/bin/mocha-phantomjs spec/index.html

docs: install
	@./node_modules/jsdoc/jsdoc -d ./docs/ src/ README.md

clean:
	rm -rf node_modules/ $(INSTALL_STAMP)

.PHONY: test docs
