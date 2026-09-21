// CZD Purple — default Plasma layout (batch 04, plasma-desktop).
// One bottom panel, 56px, no float, no translucency. Words, not icons, in the task manager.
// Applied by plasmashell on first start when org.czd.purple.desktop is the look-and-feel
// package; never re-applied over a user's own layout.

const panelHeight = 56;

// --- desktop containments: wallpaper only; Folder View (Plasma 6 default) keeps the icons ---
var allDesktops = desktops();
for (var i = 0; i < allDesktops.length; i++) {
    var d = allDesktops[i];
    d.wallpaperPlugin = "org.kde.image";
    d.currentConfigGroup = ["Wallpaper", "org.kde.image", "General"];
    d.writeConfig("Image", "file:///usr/share/wallpapers/czd-purple-default/");
    d.writeConfig("FillMode", 2);
    d.currentConfigGroup = ["General"];
    // Icon cells 160px from x64 y64 down the quiet zone (batch 04). Folder View sizes are
    // indices into its scale; 4 is the 64px icon step. Alignment left, sorted by name.
    d.writeConfig("iconSize", 4);
    d.writeConfig("alignment", 0);
    d.writeConfig("sortMode", 0);
    d.writeConfig("labelWidth", 1);
    d.writeConfig("textLines", 2);
}

// --- the panel: a rule that happens to hold controls ---
var panel = new Panel;
panel.location = "bottom";
panel.alignment = "left";
panel.lengthMode = "fill";
panel.hiding = "none";
panel.floating = false;
panel.opacity = "opaque";
panel.height = panelHeight;

// Launcher. Kickoff opens on DEFENSIVE; category list is the inset column.
var kickoff = panel.addWidget("org.kde.plasma.kickoff");
kickoff.currentConfigGroup = ["General"];
kickoff.writeConfig("icon", "czd-mark");
kickoff.writeConfig("alphaSort", true);
kickoff.writeConfig("showActionButtonCaptions", true);
kickoff.writeConfig("compactMode", true);
kickoff.writeConfig("applicationsDisplay", 1);
kickoff.writeConfig("favoritesDisplay", 1);
kickoff.writeConfig("primaryActions", 0);
kickoff.writeConfig("systemFavorites", "lock-screen\\,logout\\,shutdown");

// Virtual desktops 1–4 as numbers.
var pager = panel.addWidget("org.kde.plasma.pager");
pager.currentConfigGroup = ["General"];
pager.writeConfig("displayedText", 1);
pager.writeConfig("showWindowIcons", false);

// Task manager: text labels, no icons-only mode, no grouping, no tooltips (batch 04, 02).
var tasks = panel.addWidget("org.kde.plasma.taskmanager");
tasks.currentConfigGroup = ["General"];
tasks.writeConfig("showOnlyCurrentDesktop", false);
tasks.writeConfig("showOnlyCurrentActivity", true);
tasks.writeConfig("groupingStrategy", 0);
tasks.writeConfig("maxStripes", 1);
tasks.writeConfig("forceStripes", false);
tasks.writeConfig("fill", true);
tasks.writeConfig("showToolTips", false);
tasks.writeConfig("highlightWindows", false);
tasks.writeConfig("indicateAudioStreams", false);
tasks.writeConfig("launchers", "applications:org.kde.konsole.desktop,applications:org.kde.dolphin.desktop");

panel.addWidget("org.kde.plasma.marginsseparator");

// Tray: labels are the tray's own text; icons are the icon theme's (batch 05).
var tray = panel.addWidget("org.kde.plasma.systemtray");
tray.currentConfigGroup = ["General"];
tray.writeConfig("iconSize", 1);
tray.writeConfig("scaleIconsToFit", false);

// Clock: 9:25 AM over FRI OCT 02, mono, bold.
var clock = panel.addWidget("org.kde.plasma.digitalclock");
clock.currentConfigGroup = ["Appearance"];
clock.writeConfig("showDate", true);
clock.writeConfig("dateDisplayFormat", "BelowTime");
clock.writeConfig("dateFormat", "custom");
clock.writeConfig("customDateFormat", "ddd MMM dd");
clock.writeConfig("use24hFormat", 0);
clock.writeConfig("showSeconds", 0);
clock.writeConfig("autoFontAndSize", false);
clock.writeConfig("fontFamily", "IBM Plex Mono");
clock.writeConfig("boldText", true);
clock.writeConfig("fontSize", 12);
clock.writeConfig("fontStyleName", "Bold");
