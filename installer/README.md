# installer/

Calamares configuration for the live image (batch 08). It overrides the files that
`calamares-settings-debian` installs, so that package stays for its Debian-specific helper
modules (`bootloader-config`, `sources-media`, `dpkg-unsafe-io`) and CZD supplies the settings,
the module tweaks and the branding.

- `static/` — `settings.conf` and `modules/*.conf`. Committed as-is; no colours.
- `templates/branding/czd-purple/` — `branding.desc`, `stylesheet.qss`, the slideshow. Token
  placeholders, rendered by `tokens/generate.py` into `installer/generated/` (ignored), which
  also drops the mark and lockup crops in from `design/`.
- `build.sh` copies `installer/static/` and `installer/generated/` into
  `live-build/…/includes.chroot/etc/calamares/` at build time.

Respin edit 07 is `templates/branding/czd-purple/slide-04.qml`.
