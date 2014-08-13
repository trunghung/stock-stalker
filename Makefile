UNAME:=$(shell uname)

PATH:=$(PATH):./node_modules/.bin:./build/localizr/bin
BUILD:=build

ifeq ($(UNAME), Linux)
ECHO_FLAG=-e
else
ECHO_FLAG=
endif

dust:
	@echo
	@echo $(ECHO_FLAG) "Compiling dust templates"
	@for file in templates/*.html ; do \
		tmp="$${file/templates\/templ/build/templates/}"; \
		out="$${tmp%%.*}.js"; \
		name="$${out##*/}"; name="$${name%%.*}"; \
		node_modules/dustjs-linkedin/bin/dustc --name=$$name $$file $$out ; \
	done \
	
	@echo $(ECHO_FLAG) "Combining dust templates"
	@if test -e build/templates.js; \
	then rm build/templates/templates.js; \
	fi
	@for file in templates/*.js ; do \
		cat $$file >> build/templates/templates.js; \
	done \
