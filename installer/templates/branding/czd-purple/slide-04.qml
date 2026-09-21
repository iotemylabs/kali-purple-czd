// Respin edit 07: the conference-bits slide. One sentence of venue detail, new each year.
import QtQuick
CzdSlide {
    eyebrow: "// 04 · WHERE THE CONFERENCE BITS LIVE"
    title: "{{ event.name }} · {{ event.date_line }}"
    body: "The schedule, the Wi-Fi name and the CTF rules are in czd-welcome, shown once on first login. Bring it back from the menu or by typing czd-welcome. {{ event.venue }}."
}
