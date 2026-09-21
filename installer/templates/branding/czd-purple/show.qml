// CZD Purple — Calamares slideshow, API 2. Five slides, 8 s hold, cut never fade, 40 s loop.
import QtQuick
import calamares.slideshow 1.0

Presentation {
    id: presentation
    property bool activatedInCalamares: false

    // Presentation animates nothing unless told to; the Timer is the only motion, and it is a cut.
    Timer {
        interval: 8000
        running: presentation.activatedInCalamares
        repeat: true
        onTriggered: presentation.goToNextSlide()
    }

    Slide { Loader { anchors.fill: parent; source: "slide-01.qml" } }
    Slide { Loader { anchors.fill: parent; source: "slide-02.qml" } }
    Slide { Loader { anchors.fill: parent; source: "slide-03.qml" } }
    Slide { Loader { anchors.fill: parent; source: "slide-04.qml" } }
    Slide { Loader { anchors.fill: parent; source: "slide-05.qml" } }

    function onActivate() { presentation.activatedInCalamares = true }
    function onLeave() { presentation.activatedInCalamares = false }
}
