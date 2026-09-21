// CZD Purple — SDDM greeter (batch 03, sddm-login · batch 06, sddm-refused).
// Qt6 QML for SDDM 0.21. The form lands in the 720 × 460 reserve cut into wallpaper-lock at
// x600 y310. No user list, no avatar, no blur, no radius, no shadow, 0ms motion.
// Template: every colour below is a token rendered by tokens/generate.py.
import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import SddmComponents

Rectangle {
    id: root
    width: 1920
    height: 1080
    color: "{{ surface.base }}"

    // --- tokens ---------------------------------------------------------------
    readonly property color surfaceBase:   "{{ surface.base }}"
    readonly property color surfaceRaised: "{{ surface.raised }}"
    readonly property color surfaceInset:  "{{ surface.inset }}"
    readonly property color gold:          "{{ trace.gold }}"
    readonly property color goldDim:       "{{ trace.gold.dim }}"
    readonly property color goldSurge:     "{{ trace.gold.surge }}"
    readonly property color inkPrimary:    "{{ text.primary }}"
    readonly property color inkSecondary:  "{{ text.secondary }}"
    readonly property color inkDisabled:   "{{ text.disabled }}"
    readonly property color stateError:    "{{ state.error }}"
    readonly property color rule:          "{{ trace.gold | argb:0.26 }}"
    readonly property color ruleSoft:      "{{ trace.gold | argb:0.13 }}"
    readonly property color tint:          "{{ trace.gold | argb:0.05 }}"
    readonly property string fontUi:       "{{ font.ui.family }}"
    readonly property string fontMono:     "{{ font.mono.family }}"
    readonly property string buildString:  "{{ build.tag_upper }}"
    readonly property string eventLine:    "CHARLESTON ZERO DAY · {{ event.date_line }}"
    readonly property string siteLine:     "{{ event.site | upper }}"

    // --- state ----------------------------------------------------------------
    property bool failed: false
    property string failMessage: ""
    property int sessionIndex: sessionModel.lastIndex >= 0 ? sessionModel.lastIndex : 0

    // The plate is drawn at 1920 × 1080 and scaled uniformly to the screen, so every quoted
    // position stays literal and the form still lands in the wallpaper's reserve.
    Item {
        id: plate
        width: 1920
        height: 1080
        anchors.centerIn: parent
        scale: Math.min(root.width / 1920, root.height / 1080)

        Image {
            anchors.fill: parent
            source: config.background
            fillMode: Image.PreserveAspectCrop
            smooth: true
        }

        // The wordmark (top-left) and the attribution (bottom-left) are painted by wallpaper-lock
        // itself; the greeter adds only the clock, the form and the power row.

        // --- top-right clock ---------------------------------------------------
        Column {
            x: 1920 - 112 - width; y: 112
            spacing: 8
            Text {
                id: clock
                anchors.right: parent.right
                color: inkPrimary
                font { family: fontUi; pixelSize: 40; weight: Font.DemiBold; letterSpacing: -0.6 }
                text: Qt.formatTime(new Date(), "h:mm AP")
            }
            Text {
                anchors.right: parent.right
                color: gold
                font { family: fontMono; pixelSize: 24; weight: Font.Bold; letterSpacing: 3.4 }
                text: Qt.formatDate(new Date(), "ddd MMM dd, yyyy").toUpperCase()
                      + " · KEYBOARD " + (keyboard.layouts.length > 0 ? keyboard.layouts[keyboard.currentLayout].shortName.toUpperCase() : "TBC")
            }
        }
        Timer { interval: 1000; running: true; repeat: true; onTriggered: clock.text = Qt.formatTime(new Date(), "h:mm AP") }

        // --- the form: 720 × 460 at x600 y310 ----------------------------------
        Item {
            id: form
            x: 600; y: 310
            width: 720; height: 460

            Column {
                anchors.fill: parent
                spacing: 0

                // eyebrow + rule
                Row {
                    width: parent.width; height: 32; spacing: 16
                    Text { text: "// SIGN IN"; color: gold; anchors.verticalCenter: parent.verticalCenter; font { family: fontMono; pixelSize: 24; weight: Font.Bold; letterSpacing: 3.4 } }
                    Rectangle { height: 1; color: rule; anchors.verticalCenter: parent.verticalCenter; width: parent.width - 16 - 140 }
                }
                Item { width: 1; height: 24 }

                // USER
                Text { text: "USER"; color: gold; font { family: fontMono; pixelSize: 24; weight: Font.Bold; letterSpacing: 3.4 } }
                Item { width: 1; height: 8 }
                CzdField { id: userField; width: parent.width; text: userModel.lastUser; onAccepted: passwordField.forceActiveFocus() }
                Item { width: 1; height: 24 }

                // PASSWORD — the label swaps to state.error on a refused login; nothing moves.
                Text {
                    text: failed ? "PASSWORD · " + failMessage.toUpperCase() : "PASSWORD"
                    color: failed ? stateError : gold
                    font { family: fontMono; pixelSize: 24; weight: Font.Bold; letterSpacing: 3.4 }
                }
                Item { width: 1; height: 8 }
                CzdField { id: passwordField; width: parent.width; echoMode: TextInput.Password; onAccepted: root.tryLogin() }
                Item { width: 1; height: 24 }

                // SESSION · PLASMA (WAYLAND) ↓  — a hidden ComboBox resolves the session name by role.
                ComboBox { id: sessionBox; visible: false; model: sessionModel; textRole: "name"; currentIndex: sessionIndex }
                Row {
                    width: parent.width; height: 32
                    Text {
                        text: "SESSION · " + (sessionBox.currentText || "TBC").toUpperCase() + " ↓"
                        color: gold
                        anchors.verticalCenter: parent.verticalCenter
                        font { family: fontMono; pixelSize: 24; weight: Font.Bold; letterSpacing: 3.4 }
                        MouseArea { anchors.fill: parent; onClicked: sessionIndex = (sessionIndex + 1) % sessionModel.rowCount() }
                    }
                }
                Item { width: 1; height: 32 }

                // SIGN IN → : the one filled-gold element on the screen
                Rectangle {
                    id: signIn
                    width: parent.width; height: 56
                    color: signInMouse.containsMouse && !signInMouse.pressed ? goldSurge : gold
                    border.width: 0
                    Text { anchors.centerIn: parent; text: "SIGN IN →"; color: surfaceBase; font { family: fontMono; pixelSize: 24; weight: Font.Bold; letterSpacing: 3.4 } }
                    Rectangle { anchors.fill: parent; anchors.margins: -3; color: "transparent"; border.color: gold; border.width: signIn.activeFocus ? 1 : 0 }
                    MouseArea { id: signInMouse; anchors.fill: parent; hoverEnabled: true; onClicked: root.tryLogin() }
                    Keys.onReturnPressed: root.tryLogin()
                    Keys.onSpacePressed: root.tryLogin()
                    activeFocusOnTab: true
                }
            }
        }

        // --- bottom-right power row -------------------------------------------
        Row {
            x: 1920 - 112 - width; y: 1080 - 112 - height
            spacing: 16
            CzdAction { text: "SUSPEND"; enabled: sddm.canSuspend; onActivated: sddm.suspend() }
            Text { text: "·"; color: gold; font { family: fontMono; pixelSize: 24; weight: Font.Bold } }
            CzdAction { text: "RESTART"; enabled: sddm.canReboot; onActivated: sddm.reboot() }
            Text { text: "·"; color: gold; font { family: fontMono; pixelSize: 24; weight: Font.Bold } }
            CzdAction { text: "SHUT DOWN"; enabled: sddm.canPowerOff; onActivated: sddm.powerOff() }
        }
    }

    // --- components -------------------------------------------------------------
    component CzdField: Rectangle {
        property alias text: input.text
        property alias echoMode: input.echoMode
        signal accepted()
        height: 56
        color: surfaceInset
        border.color: gold
        border.width: 1
        // focus ring: 1px gold at 2px offset, never removed
        Rectangle { anchors.fill: parent; anchors.margins: -3; color: "transparent"; border.color: gold; border.width: input.activeFocus ? 1 : 0 }
        TextInput {
            id: input
            anchors.fill: parent
            anchors.leftMargin: 16; anchors.rightMargin: 16
            verticalAlignment: TextInput.AlignVCenter
            color: inkPrimary
            selectionColor: goldDim
            selectedTextColor: inkPrimary
            font { family: fontMono; pixelSize: 24 }
            cursorDelegate: Rectangle { width: 2; height: 34; color: gold }   // 2 × 34 gold block, no blink
            passwordCharacter: "•"
            onAccepted: parent.accepted()
        }
        function forceActiveFocus() { input.forceActiveFocus() }
    }

    component CzdAction: Text {
        signal activated()
        color: enabled ? (hover.containsMouse ? goldSurge : gold) : inkDisabled
        font { family: fontMono; pixelSize: 24; weight: Font.Bold; letterSpacing: 3.4 }
        MouseArea { id: hover; anchors.fill: parent; hoverEnabled: true; onClicked: if (parent.enabled) parent.activated() }
    }

    // --- login ------------------------------------------------------------------
    function tryLogin() {
        failed = false
        sddm.login(userField.text, passwordField.text, sessionIndex)
    }
    Connections {
        target: sddm
        function onLoginFailed() {
            failed = true
            failMessage = keyboard.capsLock ? "wrong password · caps lock on" : "wrong password"
            passwordField.text = ""
            passwordField.forceActiveFocus()
        }
        function onLoginSucceeded() { failed = false }
    }
    Component.onCompleted: (userField.text.length > 0 ? passwordField : userField).forceActiveFocus()
}
