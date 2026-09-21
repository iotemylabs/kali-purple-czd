# CZD Purple — convenience targets. build.sh is the release entry point; this file
# exists so the checks in RELEASING.md are one word each.

TAG ?= $(shell git describe --tags --exact-match 2>/dev/null)
PKGS := $(notdir $(wildcard packages/czd-*))

.PHONY: help generate clean check check-drift check-json check-shell packages iso

help:
	@echo "make generate      render tokens -> packages/*/generated (build string from tag or token file)"
	@echo "make check         every static check from the release gate that runs without hardware"
	@echo "make packages      build the eight .debs into out/  (Linux, needs debhelper)"
	@echo "make iso           full ISO via ./build.sh          (Linux, root, 40 GB free)"
	@echo "make clean         remove generated files and build/ out/"

generate:
	python3 tokens/generate.py $(if $(TAG),--tag $(TAG),)

clean:
	python3 tokens/generate.py --clean
	rm -rf build out

check: check-json check-drift check-shell
	@echo "check: OK"

# Release gate row 06 — token drift. Runs against committed files only; generated/ is a build product.
check-drift:
	@bad=$$(git ls-files packages/ installer/ live-build/ | grep -vE '\.(png|jpg|ttf|otf|pf2)$$' | xargs grep -lnE '#[0-9A-Fa-f]{6}\b' 2>/dev/null); \
	if [ -n "$$bad" ]; then echo "hex literal outside tokens/ in:"; echo "$$bad"; exit 1; fi; \
	echo "check-drift: no hex outside tokens/"

check-json:
	@python3 -c "import json,sys; json.load(open('tokens/czd-purple-tokens.json', encoding='utf-8')); print('check-json: tokens parse')"
	@python3 tokens/generate.py --list >/dev/null && echo "check-json: generator dry run OK"

check-shell:
	@bash -n build.sh && echo "check-shell: build.sh parses"
	@for f in packages/*/debian/postinst packages/*/debian/postrm; do [ -f $$f ] && sh -n $$f || true; done; echo "check-shell: maintainer scripts parse"

packages: generate
	@mkdir -p out
	@for p in $(PKGS); do \
	  echo "== $$p"; \
	  (cd packages/$$p && dpkg-buildpackage -us -uc -b --no-sign 2>&1 | tail -3) || exit 1; \
	done
	@mv -f packages/*.deb packages/*.buildinfo packages/*.changes out/ 2>/dev/null || true
	@ls -1 out/*.deb

iso:
	./build.sh $(if $(TAG),--tag $(TAG),)
