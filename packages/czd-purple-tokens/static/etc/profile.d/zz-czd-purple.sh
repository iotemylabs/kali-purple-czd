# CZD Purple — activate the CZD XDG configuration tree.
#
# Kali Purple selects its look by prepending /etc/xdg/xdg-kali-purple to XDG_CONFIG_DIRS from
# /etc/profile.d/kali-themes-purple.sh. CZD does the same one level up, from a file that sorts
# after Kali's so it wins. Removing czd-purple-tokens removes this file and Kali Purple's own
# tree is what is left — that is release gate row 07.
if [ -d /etc/xdg/xdg-czd-purple ]; then
  case ":${XDG_CONFIG_DIRS:-/etc/xdg}:" in
    *:/etc/xdg/xdg-czd-purple:*) ;;
    *) XDG_CONFIG_DIRS="/etc/xdg/xdg-czd-purple:${XDG_CONFIG_DIRS:-/etc/xdg}"; export XDG_CONFIG_DIRS ;;
  esac
  # GTK 4 and libadwaita read only the per-user gtk.css. Seed a symlink once so the colour
  # override reaches them; a dangling link after purge is ignored by GTK.
  if [ -n "${HOME:-}" ] && [ ! -e "$HOME/.config/gtk-4.0/gtk.css" ] && [ -f /etc/xdg/xdg-czd-purple/gtk-4.0/gtk.css ]; then
    mkdir -p "$HOME/.config/gtk-4.0" 2>/dev/null && ln -s /etc/xdg/xdg-czd-purple/gtk-4.0/gtk.css "$HOME/.config/gtk-4.0/gtk.css" 2>/dev/null || true
  fi
fi
