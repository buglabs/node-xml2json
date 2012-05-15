SPECS = specs/*.js
REPORTER = list
JSLINT   := /usr/local/bin/gjslint
FIX_STYLE := /usr/local/bin/fixjsstyle
JSLINT_PARAMS := --custom_jsdoc_tags public,static --recurse lib/ --recurse test/

test:
	@./node_modules/mocha/bin/mocha \
		--require should \
		--reporter $(REPORTER) \
		--ui bdd \
		$(SPECS)

jslint:
	$(JSLINT) $(JSLINT_PARAMS)

install: 
	npm install

fixstyle:
	$(FIX_STYLE) $(JSLINT_PARAMS)

.PHONY: test jslint fixstyle
