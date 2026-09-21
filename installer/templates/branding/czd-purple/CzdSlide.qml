// One slide of the CZD install slideshow (batch 08, calamares-slideshow). Eyebrow, Archivo title,
// mono body, the log line at the foot. Held for 8 s and cut; nothing animates. Template.
import QtQuick

Item {
    id: slide
    property string eyebrow: ""
    property string title: ""
    property string body: ""
    anchors.fill: parent

    Rectangle { anchors.fill: parent; color: "{{ surface.base }}" }

    Column {
        x: 64; y: 64
        width: parent.width - 128
        spacing: 16
        Text { text: slide.eyebrow; color: "{{ trace.gold }}"; font { family: "{{ font.mono.family }}"; pixelSize: 16; weight: Font.Bold; letterSpacing: 2.2 } }
        Rectangle { width: parent.width; height: 2; color: "{{ trace.gold }}" }
        Text { text: slide.title; color: "{{ text.primary }}"; width: parent.width; wrapMode: Text.WordWrap; font { family: "{{ font.ui.family }}"; pixelSize: 40; weight: Font.Bold; letterSpacing: -0.6 } }
        Text { text: slide.body; color: "{{ text.secondary }}"; width: parent.width; wrapMode: Text.WordWrap; lineHeight: 1.45; font { family: "{{ font.mono.family }}"; pixelSize: 18 } }
    }
    Text {
        x: 64; y: parent.height - 64 - height
        text: "LOG AT /VAR/LOG/CALAMARES.LOG · NOTHING IS HIDDEN"
        color: "{{ text.disabled }}"
        font { family: "{{ font.mono.family }}"; pixelSize: 13; weight: Font.Bold; letterSpacing: 1.8 }
    }
}
