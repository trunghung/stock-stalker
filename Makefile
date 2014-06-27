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
	@for file in js/templates/templ/*.html ; do \
		tmp="$${file/templates\/templ/templates/dust}"; \
		out="$${tmp%%.*}.js"; \
		name="$${out##*/}"; name="$${name%%.*}"; \
		dustc --name=$$name $$file $$out ; \
	done \
	
	@echo $(ECHO_FLAG) "Combining dust templates"
	@if test -e js/templates/dust/templates.js; \
	then rm js/templates/dust/templates.js; \
	fi
	@for file in js/templates/dust/*.js ; do \
		cat $$file >> js/templates/dust/templates.js; \
	done \
