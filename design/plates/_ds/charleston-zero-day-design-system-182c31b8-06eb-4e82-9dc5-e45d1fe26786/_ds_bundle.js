/* @ds-bundle: {"format":4,"namespace":"CharlestonZeroDayDesignSystem_182c31","components":[{"name":"ScheduleRow","sourcePath":"components/schedule/ScheduleRow.jsx"},{"name":"SessionTag","sourcePath":"components/schedule/SessionTag.jsx"},{"name":"StatusChip","sourcePath":"components/schedule/StatusChip.jsx"},{"name":"Brandmark","sourcePath":"components/structure/Brandmark.jsx"},{"name":"EyebrowHeader","sourcePath":"components/structure/EyebrowHeader.jsx"},{"name":"LogoSlot","sourcePath":"components/structure/LogoSlot.jsx"},{"name":"Rule","sourcePath":"components/structure/Rule.jsx"},{"name":"MapKeyItem","sourcePath":"components/wayfinding/MapKeyItem.jsx"},{"name":"QRBlock","sourcePath":"components/wayfinding/QRBlock.jsx"},{"name":"WayfindingBlock","sourcePath":"components/wayfinding/WayfindingBlock.jsx"}],"sourceHashes":{"components/schedule/ScheduleRow.jsx":"b8ca4338a628","components/schedule/SessionTag.jsx":"48fb7c1b5ab0","components/schedule/StatusChip.jsx":"02fd2c07743d","components/structure/Brandmark.jsx":"fcd6a0907baf","components/structure/EyebrowHeader.jsx":"b836dabb7fb5","components/structure/LogoSlot.jsx":"47db03a658f4","components/structure/Rule.jsx":"87ef8b9efb9d","components/wayfinding/MapKeyItem.jsx":"44a66354723e","components/wayfinding/QRBlock.jsx":"85d23fdfce22","components/wayfinding/WayfindingBlock.jsx":"47d35ebbedf4","ui_kits/program-guide/TrifoldInside.jsx":"9ae06326db19","ui_kits/program-guide/TrifoldOutside.jsx":"fd2854832e68","ui_kits/program-guide/TrifoldSheet.jsx":"dfdda9b9ab95","ui_kits/signage/NowNextBoard.jsx":"6c52f7e0b29e","ui_kits/signage/RoomBoard.jsx":"79a705918f17","ui_kits/signage/WayfindingBoard.jsx":"89512fa1ea66","ui_kits/website/HomeScreen.jsx":"d004ca61a62e","ui_kits/website/ScheduleScreen.jsx":"a9370b30d5f1","ui_kits/website/SiteChrome.jsx":"9ee9cda021bc","ui_kits/website/SponsorsScreen.jsx":"6be64ee340f8","ui_kits/website/TicketsScreen.jsx":"01664ca365de","ui_kits/website/VenueScreen.jsx":"35af6641efb1"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.CharlestonZeroDayDesignSystem_182c31 = window.CharlestonZeroDayDesignSystem_182c31 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/schedule/SessionTag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SCALE = {
  screen: {
    size: "11px",
    track: "0.14em"
  },
  print: {
    size: "8px",
    track: "0.14em"
  },
  signage: {
    size: "24px",
    track: "0.16em"
  }
};
function SessionTag({
  label,
  scale = "screen",
  tone = "gold",
  style,
  ...rest
}) {
  const s = SCALE[scale] || SCALE.screen;
  const color = tone === "muted" ? "var(--text-muted)" : tone === "deep" ? "var(--czd-gold-mid)" : "var(--text-accent)";
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      fontFamily: "var(--font-mono)",
      fontWeight: 700,
      fontSize: s.size,
      letterSpacing: s.track,
      textTransform: "uppercase",
      color,
      lineHeight: 1,
      display: "inline-block",
      ...style
    }
  }, rest), label);
}
Object.assign(__ds_scope, { SessionTag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/schedule/SessionTag.jsx", error: String((e && e.message) || e) }); }

// components/schedule/ScheduleRow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SCALE = {
  screen: {
    pad: "14px 0",
    timeW: "var(--time-col-w)",
    time: "12.5px",
    title: "20px",
    byline: "12.5px",
    gap: "20px",
    titleTrack: "-0.018em",
    terminal: "13px"
  },
  print: {
    pad: "5px 0",
    timeW: "var(--time-col-w-print)",
    time: "9px",
    title: "11px",
    byline: "8.5px",
    gap: "10px",
    titleTrack: "-0.012em",
    terminal: "8.5px"
  },
  signage: {
    pad: "22px 0",
    timeW: "var(--time-col-w-signage)",
    time: "30px",
    title: "44px",
    byline: "26px",
    gap: "48px",
    titleTrack: "-0.024em",
    terminal: "30px"
  }
};
function ScheduleRow({
  start,
  end,
  title,
  byline,
  tag,
  room,
  variant = "standard",
  scale = "screen",
  state,
  capTop = false,
  capBottom = false,
  style,
  ...rest
}) {
  const s = SCALE[scale] || SCALE.screen;
  const emphasis = variant === "emphasis";
  const terminal = variant === "terminal";
  const past = state === "past";
  const borderTop = capTop ? "2px solid var(--czd-line)" : emphasis ? "2px solid var(--czd-line)" : "1px solid var(--czd-line-soft)";
  const borderBottom = capBottom ? "2px solid var(--czd-line)" : emphasis ? "2px solid var(--czd-line)" : "none";
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "grid",
      gridTemplateColumns: `${s.timeW} minmax(0,1fr)`,
      gap: s.gap,
      alignItems: "start",
      padding: s.pad,
      paddingLeft: emphasis ? s.gap : 0,
      paddingRight: emphasis ? s.gap : 0,
      marginLeft: emphasis ? `calc(-1 * ${s.gap})` : 0,
      marginRight: emphasis ? `calc(-1 * ${s.gap})` : 0,
      background: emphasis ? "var(--surface-row-emphasis)" : "transparent",
      borderTop,
      borderBottom,
      opacity: past ? 0.45 : 1,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontWeight: 500,
      fontSize: s.time,
      lineHeight: 1.3,
      letterSpacing: "0.01em",
      color: state === "now" ? "var(--text-accent-peak)" : "var(--text-accent)",
      fontVariantNumeric: "tabular-nums"
    }
  }, /*#__PURE__*/React.createElement("div", null, start), end ? /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--czd-gold-mid)"
    }
  }, end) : null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: scale === "print" ? "2px" : "6px"
    }
  }, tag ? /*#__PURE__*/React.createElement(__ds_scope.SessionTag, {
    label: tag,
    scale: scale,
    tone: past ? "muted" : "gold"
  }) : null, terminal ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontWeight: 700,
      fontSize: s.terminal,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color: "var(--text-accent)",
      lineHeight: 1.2
    }
  }, title) : /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      fontSize: s.title,
      letterSpacing: s.titleTrack,
      lineHeight: 1.02,
      color: "var(--text-heading)",
      textWrap: "pretty"
    }
  }, title), byline ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontWeight: 400,
      fontSize: s.byline,
      lineHeight: 1.45,
      color: "var(--text-body)",
      textWrap: "pretty"
    }
  }, byline) : null, room ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontWeight: 500,
      fontSize: s.byline,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: "var(--text-muted)"
    }
  }, room) : null));
}
Object.assign(__ds_scope, { ScheduleRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/schedule/ScheduleRow.jsx", error: String((e && e.message) || e) }); }

// components/schedule/StatusChip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STATES = {
  now: {
    label: "NOW",
    fg: "#0A0A0A",
    bg: "var(--czd-gold)",
    border: "var(--czd-gold)"
  },
  next: {
    label: "NEXT",
    fg: "var(--czd-gold)",
    bg: "transparent",
    border: "var(--czd-gold)"
  },
  hold: {
    label: "HOLD",
    fg: "var(--state-hold)",
    bg: "transparent",
    border: "var(--state-hold)"
  },
  stale: {
    label: "STALE",
    fg: "var(--state-stale)",
    bg: "transparent",
    border: "var(--state-stale)"
  }
};
const SCALE = {
  screen: {
    size: "10.5px",
    pad: "5px 9px"
  },
  signage: {
    size: "26px",
    pad: "10px 20px"
  }
};
function StatusChip({
  state = "now",
  label,
  scale = "signage",
  style,
  ...rest
}) {
  const st = STATES[state] || STATES.now;
  const s = SCALE[scale] || SCALE.signage;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-block",
      padding: s.pad,
      background: st.bg,
      color: st.fg,
      border: `1px solid ${st.border}`,
      fontFamily: "var(--font-mono)",
      fontWeight: 700,
      fontSize: s.size,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      lineHeight: 1,
      ...style
    }
  }, rest), label || st.label);
}
Object.assign(__ds_scope, { StatusChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/schedule/StatusChip.jsx", error: String((e && e.message) || e) }); }

// components/structure/Brandmark.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const FILES = {
  lockup: "czd-lockup-gold.png",
  mark: "czd-mark-gold.png",
  wordmark: "czd-wordmark-gold.png"
};
function Brandmark({
  variant = "lockup",
  height = 48,
  src,
  assetBase = "assets",
  alt = "Charleston Zero Day",
  style,
  ...rest
}) {
  const url = src || `${assetBase.replace(/\/$/, "")}/${FILES[variant] || FILES.lockup}`;
  return /*#__PURE__*/React.createElement("img", _extends({
    src: url,
    alt: alt,
    style: {
      height,
      width: "auto",
      display: "block",
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Brandmark });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/structure/Brandmark.jsx", error: String((e && e.message) || e) }); }

// components/structure/EyebrowHeader.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SCALE = {
  screen: {
    size: "11px",
    track: "0.14em",
    gap: "12px"
  },
  print: {
    size: "8px",
    track: "0.16em",
    gap: "8px"
  },
  signage: {
    size: "24px",
    track: "0.20em",
    gap: "24px"
  }
};
function EyebrowHeader({
  label,
  marker = "//",
  index,
  scale = "screen",
  rule = true,
  trailing,
  style,
  ...rest
}) {
  const s = SCALE[scale] || SCALE.screen;
  const text = [marker, index, label].filter(Boolean).join(" ").replace(/^\/\/ /, "// ");
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      alignItems: "center",
      gap: s.gap,
      width: "100%",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontWeight: 700,
      fontSize: s.size,
      letterSpacing: s.track,
      textTransform: "uppercase",
      color: "var(--text-accent)",
      whiteSpace: "nowrap",
      lineHeight: 1
    }
  }, text), rule ? /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      height: "1px",
      background: "var(--czd-gold)",
      minWidth: "16px"
    }
  }) : null, trailing ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontWeight: 500,
      fontSize: s.size,
      letterSpacing: s.track,
      textTransform: "uppercase",
      color: "var(--text-muted)",
      whiteSpace: "nowrap",
      lineHeight: 1
    }
  }, trailing) : null);
}
Object.assign(__ds_scope, { EyebrowHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/structure/EyebrowHeader.jsx", error: String((e && e.message) || e) }); }

// components/structure/LogoSlot.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function LogoSlot({
  label = "LOGO",
  width = "100%",
  height = 56,
  scale = "screen",
  style,
  ...rest
}) {
  const size = scale === "print" ? "7px" : scale === "signage" ? "18px" : "7.5px";
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      width,
      height,
      border: "1px dashed var(--czd-line)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "transparent",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontWeight: 500,
      fontSize: size,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "var(--text-muted)",
      lineHeight: 1
    }
  }, label));
}
Object.assign(__ds_scope, { LogoSlot });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/structure/LogoSlot.jsx", error: String((e && e.message) || e) }); }

// components/structure/Rule.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const W = {
  hair: "1px",
  soft: "1px",
  bold: "2px"
};
const C = {
  hair: "var(--czd-line)",
  soft: "var(--czd-line-soft)",
  bold: "var(--czd-gold)"
};
function Rule({
  variant = "hair",
  vertical = false,
  style,
  ...rest
}) {
  const w = W[variant] || W.hair;
  const c = C[variant] || C.hair;
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "separator",
    style: vertical ? {
      width: w,
      alignSelf: "stretch",
      background: c,
      flex: "0 0 auto",
      ...style
    } : {
      height: w,
      width: "100%",
      background: c,
      flex: "0 0 auto",
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Rule });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/structure/Rule.jsx", error: String((e && e.message) || e) }); }

// components/wayfinding/MapKeyItem.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SCALE = {
  screen: {
    num: "16px",
    place: "12px",
    detail: "11.5px",
    w: "28px"
  },
  print: {
    num: "11px",
    place: "8.5px",
    detail: "8px",
    w: "18px"
  },
  signage: {
    num: "38px",
    place: "28px",
    detail: "24px",
    w: "62px"
  }
};
function MapKeyItem({
  number,
  place,
  detail,
  scale = "screen",
  style,
  ...rest
}) {
  const s = SCALE[scale] || SCALE.screen;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      gap: scale === "print" ? "8px" : "14px",
      alignItems: "baseline",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: s.num,
      letterSpacing: "-0.02em",
      color: "var(--text-accent)",
      width: s.w,
      flex: "0 0 auto",
      fontVariantNumeric: "tabular-nums",
      lineHeight: 1
    }
  }, number), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: scale === "print" ? "1px" : "3px",
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontWeight: 600,
      fontSize: s.place,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: "var(--text-heading)",
      lineHeight: 1.2
    }
  }, place), detail ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontWeight: 400,
      fontSize: s.detail,
      lineHeight: 1.4,
      color: "var(--text-body)"
    }
  }, detail) : null));
}
Object.assign(__ds_scope, { MapKeyItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/wayfinding/MapKeyItem.jsx", error: String((e && e.message) || e) }); }

// components/wayfinding/QRBlock.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SCALE = {
  screen: {
    slot: 82,
    eyebrow: "11px",
    line: "12px",
    gap: "16px"
  },
  print: {
    slot: 54,
    eyebrow: "8px",
    line: "8.5px",
    gap: "10px"
  },
  signage: {
    slot: 220,
    eyebrow: "24px",
    line: "28px",
    gap: "32px"
  }
};
function QRBlock({
  eyebrow,
  primary,
  secondary,
  src,
  scale = "screen",
  style,
  ...rest
}) {
  const s = SCALE[scale] || SCALE.screen;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      borderTop: "2px solid var(--czd-gold)",
      paddingTop: s.gap,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: s.gap,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: s.slot,
      height: s.slot,
      flex: "0 0 auto",
      border: src ? "none" : "1px dashed var(--czd-line)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden"
    }
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: eyebrow || "QR code",
    style: {
      width: "100%",
      height: "100%",
      display: "block"
    }
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontWeight: 500,
      fontSize: scale === "print" ? "7px" : "7.5px",
      letterSpacing: "0.12em",
      color: "var(--text-muted)"
    }
  }, "QR")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: scale === "print" ? "3px" : "6px",
      minWidth: 0
    }
  }, eyebrow ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontWeight: 700,
      fontSize: s.eyebrow,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color: "var(--text-accent)",
      lineHeight: 1
    }
  }, eyebrow) : null, primary ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontWeight: 500,
      fontSize: s.line,
      color: "var(--text-heading)",
      lineHeight: 1.4
    }
  }, primary) : null, secondary ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontWeight: 400,
      fontSize: s.line,
      color: "var(--text-body)",
      lineHeight: 1.4
    }
  }, secondary) : null)));
}
Object.assign(__ds_scope, { QRBlock });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/wayfinding/QRBlock.jsx", error: String((e && e.message) || e) }); }

// components/wayfinding/WayfindingBlock.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SCALE = {
  screen: {
    label: "11px",
    dest: "28px",
    dir: "12.5px",
    time: "11px",
    gap: "8px"
  },
  print: {
    label: "8px",
    dest: "15px",
    dir: "8.5px",
    time: "8px",
    gap: "4px"
  },
  signage: {
    label: "24px",
    dest: "72px",
    dir: "30px",
    time: "24px",
    gap: "16px"
  }
};
function WayfindingBlock({
  label,
  destination,
  directions,
  time,
  arrow = "→",
  scale = "screen",
  style,
  ...rest
}) {
  const s = SCALE[scale] || SCALE.screen;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      flexDirection: "column",
      gap: s.gap,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontWeight: 700,
      fontSize: s.label,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color: "var(--text-accent)",
      lineHeight: 1
    }
  }, label, arrow ? /*#__PURE__*/React.createElement("span", {
    style: {
      paddingLeft: "0.5em"
    }
  }, arrow) : null), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      fontSize: s.dest,
      letterSpacing: "-0.028em",
      lineHeight: 0.92,
      color: "var(--text-heading)"
    }
  }, destination), directions ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontWeight: 400,
      fontSize: s.dir,
      lineHeight: 1.45,
      color: "var(--text-body)",
      textWrap: "pretty"
    }
  }, directions) : null, time ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontWeight: 500,
      fontSize: s.time,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: "var(--text-muted)"
    }
  }, time) : null);
}
Object.assign(__ds_scope, { WayfindingBlock });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/wayfinding/WayfindingBlock.jsx", error: String((e && e.message) || e) }); }

// ui_kits/program-guide/TrifoldInside.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  EyebrowHeader,
  ScheduleRow,
  WayfindingBlock,
  Rule,
  QRBlock
} = window.CharlestonZeroDayDesignSystem_182c31;
const DAY1 = [{
  start: "8:00",
  end: "9:15",
  title: "Registration & coffee",
  byline: "Clay Tower Lobby."
}, {
  start: "9:25",
  end: "10:15",
  tag: "Keynote",
  title: "So you've got your badge. What's next?",
  byline: "Dana Reeves · IoTemy Labs"
}, {
  start: "10:30",
  end: "11:15",
  tag: "PANEL_02",
  title: "Hiring out of a two-college state",
  byline: "Women in Tech · Four panelists"
}, {
  start: "11:25",
  end: "12:00",
  tag: "TALK_04",
  title: "Your SCADA network is on the internet",
  byline: "Speaker TBC"
}, {
  start: "12:00",
  end: "1:00",
  variant: "emphasis",
  title: "Lunch",
  byline: "Student Union. Vendor floor stays open."
}, {
  start: "1:10",
  end: "2:00",
  tag: "TALK_05",
  title: "Reading a firmware dump you did not ask for",
  byline: "M. Whitaker · KDE Technology"
}, {
  start: "2:15",
  end: "3:00",
  tag: "WORKSHOP_01",
  title: "Packet capture without the theater",
  byline: "Bring a laptop."
}, {
  start: "3:15",
  end: "4:00",
  tag: "TALK_06",
  title: "Ransomware at a 40-bed hospital",
  byline: "Speaker TBC"
}, {
  start: "5:30",
  variant: "terminal",
  title: "Day 1 concludes"
}];
const DAY2 = [{
  start: "9:00",
  end: "9:45",
  tag: "TALK_08",
  title: "What the state's incident reports actually say",
  byline: "Speaker TBC"
}, {
  start: "10:00",
  end: "10:45",
  tag: "PANEL_03",
  title: "Running security with a team of one",
  byline: "Hospitals and utilities"
}, {
  start: "11:00",
  end: "11:45",
  tag: "WORKSHOP_04",
  title: "Your first HAM contact",
  byline: "Riggleman 120. Radios provided."
}, {
  start: "12:00",
  end: "1:00",
  variant: "emphasis",
  title: "Lunch",
  byline: "CTF submissions close 2:00 PM."
}, {
  start: "1:10",
  end: "2:15",
  tag: "TALK_09",
  title: "Badge teardown, live",
  byline: "Bring your badge."
}, {
  start: "2:30",
  end: "3:15",
  tag: "Closing",
  title: "CTF scoreboard and prizes",
  byline: "Stay for it."
}, {
  start: "4:00",
  variant: "terminal",
  title: "CZD 2026 ends"
}];
function TrifoldInside({
  paper
}) {
  const {
    Sheet,
    Panel
  } = window;
  return /*#__PURE__*/React.createElement(Sheet, {
    paper: paper
  }, /*#__PURE__*/React.createElement(Panel, {
    style: {
      borderLeft: "none"
    }
  }, /*#__PURE__*/React.createElement(EyebrowHeader, {
    index: "01 \xB7",
    label: "Day 01",
    scale: "print",
    trailing: "FRI OCT 02"
  }), /*#__PURE__*/React.createElement("div", null, DAY1.map((r, i) => /*#__PURE__*/React.createElement(ScheduleRow, _extends({
    key: i,
    scale: "print"
  }, r, {
    capTop: i === 0,
    capBottom: i === DAY1.length - 1
  }))))), /*#__PURE__*/React.createElement(Panel, {
    inset: true
  }, /*#__PURE__*/React.createElement(EyebrowHeader, {
    index: "02 \xB7",
    label: "Day 02",
    scale: "print",
    trailing: "SAT OCT 03"
  }), /*#__PURE__*/React.createElement("div", null, DAY2.map((r, i) => /*#__PURE__*/React.createElement(ScheduleRow, _extends({
    key: i,
    scale: "print"
  }, r, {
    capTop: i === 0,
    capBottom: i === DAY2.length - 1
  }))))), /*#__PURE__*/React.createElement(Panel, null, /*#__PURE__*/React.createElement(EyebrowHeader, {
    index: "03 \xB7",
    label: "All weekend",
    scale: "print"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(WayfindingBlock, {
    scale: "print",
    label: "Lock lab",
    destination: "Riggleman 118",
    directions: "Beginners welcome. Picks and practice locks provided.",
    time: "9:00 AM \u2013 5:00 PM \xB7 BOTH DAYS"
  }), /*#__PURE__*/React.createElement(Rule, {
    variant: "soft"
  }), /*#__PURE__*/React.createElement(WayfindingBlock, {
    scale: "print",
    label: "HAM testing",
    destination: "Riggleman 120",
    directions: "Technician through Extra. Bring ID and $15.",
    time: "9:00 AM \u2013 3:00 PM \xB7 FRI ONLY"
  }), /*#__PURE__*/React.createElement(Rule, {
    variant: "soft"
  }), /*#__PURE__*/React.createElement(WayfindingBlock, {
    scale: "print",
    label: "CTF",
    arrow: "\u2191",
    destination: "Riggleman 204",
    directions: "Teams of up to four. Scoreboard runs all weekend.",
    time: "OPENS 9:00 AM FRI"
  }), /*#__PURE__*/React.createElement(Rule, {
    variant: "soft"
  }), /*#__PURE__*/React.createElement(WayfindingBlock, {
    scale: "print",
    label: "Vendor floor",
    destination: "Clay Tower Lobby",
    directions: "40+ tables. Talk to people; that is the point.",
    time: "9:00 AM \u2013 5:00 PM \xB7 BOTH DAYS"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "auto"
    }
  }, /*#__PURE__*/React.createElement(QRBlock, {
    scale: "print",
    eyebrow: "Wi-Fi",
    primary: "SSID: CZD-GUEST",
    secondary: "No password. Assume it is hostile."
  }))));
}
Object.assign(window, {
  TrifoldInside
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/program-guide/TrifoldInside.jsx", error: String((e && e.message) || e) }); }

// ui_kits/program-guide/TrifoldOutside.jsx
try { (() => {
const {
  EyebrowHeader,
  LogoSlot,
  QRBlock,
  Brandmark,
  MapKeyItem,
  WayfindingBlock,
  Rule
} = window.CharlestonZeroDayDesignSystem_182c31;
function TrifoldOutside({
  paper
}) {
  const {
    Sheet,
    Panel
  } = window;
  return /*#__PURE__*/React.createElement(Sheet, {
    paper: paper
  }, /*#__PURE__*/React.createElement(Panel, {
    style: {
      borderLeft: "none"
    }
  }, /*#__PURE__*/React.createElement(EyebrowHeader, {
    index: "04 \xB7",
    label: "Campus",
    scale: "print"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(MapKeyItem, {
    scale: "print",
    number: "01",
    place: "Geary Auditorium",
    detail: "Main stage \xB7 Both days"
  }), /*#__PURE__*/React.createElement(MapKeyItem, {
    scale: "print",
    number: "02",
    place: "Clay Tower Lobby",
    detail: "Registration \xB7 Vendor floor"
  }), /*#__PURE__*/React.createElement(MapKeyItem, {
    scale: "print",
    number: "03",
    place: "Riggleman Hall",
    detail: "Lock lab \xB7 HAM testing \xB7 CTF"
  }), /*#__PURE__*/React.createElement(MapKeyItem, {
    scale: "print",
    number: "04",
    place: "Student Union",
    detail: "Lunch \xB7 12:00 PM \u2013 1:00 PM"
  }), /*#__PURE__*/React.createElement(MapKeyItem, {
    scale: "print",
    number: "05",
    place: "Lot C",
    detail: "Free parking with a badge"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      border: "1px dashed var(--czd-line)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: 180
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 7.5,
      letterSpacing: "0.12em",
      color: "var(--text-muted)"
    }
  }, "CAMPUS MAP \u2014 ARTWORK PENDING")), /*#__PURE__*/React.createElement(QRBlock, {
    scale: "print",
    eyebrow: "Live schedule",
    primary: "charlestonzeroday.com/schedule",
    secondary: "Room changes post here first."
  })), /*#__PURE__*/React.createElement(Panel, {
    inset: true
  }, /*#__PURE__*/React.createElement(EyebrowHeader, {
    index: "05 \xB7",
    label: "Sponsors",
    scale: "print"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 8
    }
  }, Array.from({
    length: 4
  }).map((_, i) => /*#__PURE__*/React.createElement(LogoSlot, {
    key: i,
    scale: "print",
    height: 44
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: 8
    }
  }, Array.from({
    length: 6
  }).map((_, i) => /*#__PURE__*/React.createElement(LogoSlot, {
    key: i,
    scale: "print",
    height: 30
  }))), /*#__PURE__*/React.createElement(Rule, {
    variant: "soft"
  }), /*#__PURE__*/React.createElement(EyebrowHeader, {
    index: "06 \xB7",
    label: "House rules",
    scale: "print"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 7
    }
  }, ["Badge visible past the lobby. Both days.", "Ask before you photograph anyone.", "The lock lab is for practice locks only. Leave the building's hardware alone.", "The CTF network is the CTF network. Nothing else on campus is in scope.", "Code of conduct is enforced. Find a board member in a gold lanyard."].map(t => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      display: "flex",
      gap: 7,
      fontFamily: "var(--font-mono)",
      fontSize: 8.5,
      lineHeight: 1.5,
      color: "var(--text-body)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--czd-gold)"
    }
  }, "\xB7"), /*#__PURE__*/React.createElement("span", null, t)))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "auto",
      display: "flex",
      flexDirection: "column",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Rule, null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 8,
      letterSpacing: "0.14em",
      color: "var(--text-muted)"
    }
  }, "THE CZD BOARD \xB7 IOTEMY LABS \xB7 UNIVERSITY OF CHARLESTON \xB7 KDE TECHNOLOGY"))), /*#__PURE__*/React.createElement(Panel, {
    style: {
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 22
    }
  }, /*#__PURE__*/React.createElement(Brandmark, {
    variant: "mark",
    height: 132,
    assetBase: "../../assets"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 44,
      letterSpacing: "-0.035em",
      lineHeight: 0.84,
      textTransform: "uppercase",
      color: "var(--text-heading)"
    }
  }, "Charleston", /*#__PURE__*/React.createElement("br", null), "Zero Day"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 44,
      letterSpacing: "-0.035em",
      lineHeight: 0.9,
      color: "var(--text-display-deep)"
    }
  }, "2026")), /*#__PURE__*/React.createElement(Rule, {
    variant: "bold"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontWeight: 700,
      fontSize: 9,
      letterSpacing: "0.16em",
      color: "var(--text-accent)",
      lineHeight: 1.8
    }
  }, "FRI OCT 02 \u2013 SAT OCT 03, 2026", /*#__PURE__*/React.createElement("br", null), "UNIVERSITY OF CHARLESTON", /*#__PURE__*/React.createElement("br", null), "2300 MACCORKLE AVE SE"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 8.5,
      lineHeight: 1.6,
      color: "var(--text-body)"
    }
  }, "West Virginia's cybersecurity conference. Two days, one main stage, a vendor floor, a lock lab, HAM radio testing, and a CTF.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Rule, null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontWeight: 700,
      fontSize: 9,
      letterSpacing: "0.16em",
      color: "var(--text-accent)"
    }
  }, "#CZD2026 \xB7 CHARLESTONZERODAY.COM"))));
}
Object.assign(window, {
  TrifoldOutside
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/program-guide/TrifoldOutside.jsx", error: String((e && e.message) || e) }); }

// ui_kits/program-guide/TrifoldSheet.jsx
try { (() => {
const {
  EyebrowHeader,
  ScheduleRow,
  LogoSlot,
  QRBlock,
  Brandmark,
  Rule,
  MapKeyItem,
  WayfindingBlock
} = window.CharlestonZeroDayDesignSystem_182c31;

// Letter landscape at 96dpi = 1056 x 816.
function Sheet({
  children,
  paper
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: paper ? "czd-paper" : undefined,
    style: {
      width: 1056,
      height: 816,
      background: "var(--surface-page)",
      position: "relative",
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      overflow: "hidden"
    }
  }, children, [33.333, 66.666].map(p => ["top", "bottom"].map(side => /*#__PURE__*/React.createElement("span", {
    key: p + side,
    style: {
      position: "absolute",
      left: `${p}%`,
      [side]: 0,
      width: 1,
      height: 12,
      background: "var(--border-fold-tick)"
    }
  }))));
}
function Panel({
  children,
  inset,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "32px 28px",
      background: inset ? "var(--surface-inset)" : "transparent",
      borderLeft: "1px solid var(--czd-line-soft)",
      display: "flex",
      flexDirection: "column",
      gap: 18,
      minWidth: 0,
      ...style
    }
  }, children);
}
Object.assign(window, {
  Sheet,
  Panel
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/program-guide/TrifoldSheet.jsx", error: String((e && e.message) || e) }); }

// ui_kits/signage/NowNextBoard.jsx
try { (() => {
const {
  EyebrowHeader,
  StatusChip,
  ScheduleRow,
  Brandmark,
  Rule,
  SessionTag
} = window.CharlestonZeroDayDesignSystem_182c31;
function Frame({
  children,
  inset
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1920,
      height: 1080,
      background: inset ? "var(--surface-inset)" : "var(--surface-page)",
      position: "relative",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      padding: "4%",
      display: "flex",
      flexDirection: "column"
    }
  }, children));
}
function BoardHeader({
  label,
  right
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 48,
      paddingBottom: 28,
      borderBottom: "2px solid var(--czd-gold)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 32
    }
  }, /*#__PURE__*/React.createElement(Brandmark, {
    variant: "lockup",
    height: 54,
    assetBase: "../../assets"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 1,
      height: 54,
      background: "var(--czd-line)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontWeight: 700,
      fontSize: 26,
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      color: "var(--text-accent)"
    }
  }, label)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontWeight: 500,
      fontSize: 26,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: "var(--text-muted)",
      fontVariantNumeric: "tabular-nums"
    }
  }, right));
}
function NowNextBoard() {
  return /*#__PURE__*/React.createElement(Frame, null, /*#__PURE__*/React.createElement(BoardHeader, {
    label: "Main stage \xB7 Geary",
    right: "FRI OCT 02 \xB7 10:42 AM"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      gap: 56
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "260px minmax(0,1fr)",
      gap: 56,
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement(StatusChip, {
    state: "now"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(SessionTag, {
    label: "PANEL_02 \xB7 Women in Tech",
    scale: "signage"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 118,
      letterSpacing: "-0.035em",
      lineHeight: 0.86,
      color: "var(--text-heading)"
    }
  }, "Hiring out of a two-college state"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 32,
      color: "var(--text-body)"
    }
  }, "Four panelists \xB7 Moderated by the CZD Board"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontWeight: 500,
      fontSize: 30,
      letterSpacing: "0.1em",
      color: "var(--text-accent)",
      fontVariantNumeric: "tabular-nums"
    }
  }, "10:30 AM \u2013 11:15 AM"))), /*#__PURE__*/React.createElement(Rule, null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "260px minmax(0,1fr)",
      gap: 56,
      alignItems: "start",
      opacity: 0.92
    }
  }, /*#__PURE__*/React.createElement(StatusChip, {
    state: "next"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(SessionTag, {
    label: "TALK_04",
    scale: "signage"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      fontSize: 64,
      letterSpacing: "-0.028em",
      lineHeight: 0.92,
      color: "var(--text-heading)"
    }
  }, "Your SCADA network is on the internet"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 28,
      color: "var(--text-body)"
    }
  }, "Speaker ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-accent)",
      fontWeight: 700,
      letterSpacing: "0.12em"
    }
  }, "TBC"), " \xB7 11:25 AM")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: 28,
      borderTop: "1px solid var(--czd-line)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontWeight: 700,
      fontSize: 24,
      letterSpacing: "0.18em",
      color: "var(--text-accent)"
    }
  }, "// CHARLESTONZERODAY.COM/SCHEDULE"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 24,
      letterSpacing: "0.18em",
      color: "var(--text-muted)"
    }
  }, "#CZD2026")));
}
Object.assign(window, {
  Frame,
  BoardHeader,
  NowNextBoard
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/signage/NowNextBoard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/signage/RoomBoard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  ScheduleRow,
  EyebrowHeader,
  StatusChip
} = window.CharlestonZeroDayDesignSystem_182c31;
const ROWS = [{
  start: "9:25 AM",
  end: "10:15 AM",
  tag: "Keynote",
  title: "So you've got your badge. What's next?",
  byline: "Dana Reeves · IoTemy Labs",
  state: "past"
}, {
  start: "10:30 AM",
  end: "11:15 AM",
  tag: "PANEL_02 · Women in Tech",
  title: "Hiring out of a two-college state",
  byline: "Four panelists · Moderated by the CZD Board",
  state: "now"
}, {
  start: "11:25 AM",
  end: "12:00 PM",
  tag: "TALK_04",
  title: "Your SCADA network is on the internet",
  byline: "Speaker TBC"
}, {
  start: "12:00 PM",
  end: "1:00 PM",
  variant: "emphasis",
  title: "Lunch",
  byline: "Student Union. Vendor floor stays open."
}, {
  start: "1:10 PM",
  end: "2:00 PM",
  tag: "TALK_05",
  title: "Reading a firmware dump you did not ask for",
  byline: "M. Whitaker · KDE Technology"
}];
function RoomBoard() {
  const {
    Frame,
    BoardHeader
  } = window;
  return /*#__PURE__*/React.createElement(Frame, {
    inset: true
  }, /*#__PURE__*/React.createElement(BoardHeader, {
    label: "Today \xB7 Geary Auditorium",
    right: "FRI OCT 02 \xB7 10:42 AM"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      paddingTop: 40
    }
  }, ROWS.map((r, i) => /*#__PURE__*/React.createElement(ScheduleRow, _extends({
    key: i,
    scale: "signage"
  }, r, {
    capTop: i === 0,
    capBottom: i === ROWS.length - 1
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: 24
    }
  }, /*#__PURE__*/React.createElement(StatusChip, {
    state: "stale",
    label: "Updated 10:41 AM"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontWeight: 700,
      fontSize: 24,
      letterSpacing: "0.18em",
      color: "var(--text-accent)"
    }
  }, "// ROOM CHANGES POST TO CHARLESTONZERODAY.COM/ROOMS")));
}
Object.assign(window, {
  RoomBoard
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/signage/RoomBoard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/signage/WayfindingBoard.jsx
try { (() => {
const {
  WayfindingBlock,
  MapKeyItem,
  EyebrowHeader,
  Rule,
  LogoSlot,
  QRBlock,
  StatusChip
} = window.CharlestonZeroDayDesignSystem_182c31;
function WayfindingBoard() {
  const {
    Frame,
    BoardHeader
  } = window;
  return /*#__PURE__*/React.createElement(Frame, null, /*#__PURE__*/React.createElement(BoardHeader, {
    label: "Where things are",
    right: "CLAY TOWER LOBBY"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "grid",
      gridTemplateColumns: "minmax(0,1fr) 1px minmax(0,1fr)",
      gap: 64,
      paddingTop: 48
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 56,
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(WayfindingBlock, {
    scale: "signage",
    label: "Lunch",
    destination: "Student Union",
    directions: "Out the north doors, across the quad.",
    time: "12:00 PM \u2013 1:00 PM"
  }), /*#__PURE__*/React.createElement(WayfindingBlock, {
    scale: "signage",
    label: "CTF",
    arrow: "\u2191",
    destination: "Riggleman 204",
    directions: "Second floor, stairs by registration."
  })), /*#__PURE__*/React.createElement(Rule, {
    vertical: true,
    variant: "soft"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 34,
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(MapKeyItem, {
    scale: "signage",
    number: "01",
    place: "Geary Auditorium",
    detail: "Main stage \xB7 Both days"
  }), /*#__PURE__*/React.createElement(MapKeyItem, {
    scale: "signage",
    number: "02",
    place: "Clay Tower Lobby",
    detail: "Registration \xB7 Vendor floor"
  }), /*#__PURE__*/React.createElement(MapKeyItem, {
    scale: "signage",
    number: "03",
    place: "Riggleman Hall",
    detail: "Lock lab \xB7 HAM testing \xB7 CTF"
  }), /*#__PURE__*/React.createElement(MapKeyItem, {
    scale: "signage",
    number: "04",
    place: "Lot C",
    detail: "Free parking with a badge"
  }))), /*#__PURE__*/React.createElement(QRBlock, {
    scale: "signage",
    eyebrow: "Live schedule",
    primary: "charlestonzeroday.com/schedule",
    secondary: "#CZD2026"
  }));
}
function HoldBoard() {
  const {
    Frame,
    BoardHeader
  } = window;
  return /*#__PURE__*/React.createElement(Frame, {
    inset: true
  }, /*#__PURE__*/React.createElement(BoardHeader, {
    label: "Main stage \xB7 Geary",
    right: "FRI OCT 02 \xB7 12:18 PM"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      gap: 40
    }
  }, /*#__PURE__*/React.createElement(StatusChip, {
    state: "hold"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 132,
      letterSpacing: "-0.035em",
      lineHeight: 0.84,
      color: "var(--text-heading)"
    }
  }, "Nothing on stage", /*#__PURE__*/React.createElement("br", null), "until 1:10 PM"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 32,
      color: "var(--text-body)",
      maxWidth: "40ch",
      lineHeight: 1.5
    }
  }, "Lunch is in the Student Union. The vendor floor and lock lab stay open.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(6,1fr)",
      gap: 24,
      paddingTop: 32,
      borderTop: "1px solid var(--czd-line)"
    }
  }, Array.from({
    length: 6
  }).map((_, i) => /*#__PURE__*/React.createElement(LogoSlot, {
    key: i,
    height: 96,
    scale: "signage"
  }))));
}
Object.assign(window, {
  WayfindingBoard,
  HoldBoard
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/signage/WayfindingBoard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/HomeScreen.jsx
try { (() => {
const {
  Brandmark,
  ScheduleRow,
  LogoSlot,
  Rule,
  SessionTag
} = window.CharlestonZeroDayDesignSystem_182c31;
const FACTS = [["2", "DAYS"], ["1", "MAIN STAGE"], ["18", "SESSIONS"], ["40+", "VENDORS"]];
const TRACKS = [["01", "Main stage", "Geary Auditorium. One talk at a time, no overlap, no track-hopping."], ["02", "Vendor floor", "Clay Tower Lobby. Open both days, 9:00 AM to 5:00 PM."], ["03", "Lock lab", "Riggleman 118. Beginners welcome. Picks and practice locks provided."], ["04", "HAM radio testing", "Riggleman 120. Technician through Extra. Bring ID and $15."], ["05", "Capture the flag", "Riggleman 204. Teams of up to four. Scoreboard runs all weekend."], ["06", "Hallway track", "Wherever you are standing. Historically the best one."]];
function HomeScreen({
  onNav
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--content-max)",
      margin: "0 auto",
      padding: "64px 32px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "minmax(0,1fr) 300px",
      gap: 48,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 22
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: "0.2em",
      color: "var(--text-accent)"
    }
  }, "// FRI OCT 02 \u2013 SAT OCT 03, 2026 \xB7 UNIVERSITY OF CHARLESTON"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 78,
      letterSpacing: "-0.035em",
      lineHeight: 0.86,
      color: "var(--text-heading)",
      textTransform: "uppercase",
      margin: 0
    }
  }, "Charleston", /*#__PURE__*/React.createElement("br", null), "Zero Day"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14.5,
      color: "var(--text-body)",
      maxWidth: "56ch",
      lineHeight: 1.7
    }
  }, "West Virginia's cybersecurity conference. Two days, one main stage, a vendor floor, a lock lab, HAM radio testing, and a CTF. Built by practitioners for practitioners."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 14,
      paddingTop: 4
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNav("Tickets"),
    style: {
      fontFamily: "var(--font-mono)",
      fontWeight: 700,
      fontSize: 11.5,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      padding: "13px 22px",
      background: "var(--czd-gold)",
      color: "#0A0A0A",
      border: "1px solid var(--czd-gold)",
      cursor: "pointer"
    }
  }, "Get a badge \u2014 $40"), /*#__PURE__*/React.createElement("button", {
    onClick: () => onNav("Schedule"),
    style: {
      fontFamily: "var(--font-mono)",
      fontWeight: 700,
      fontSize: 11.5,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      padding: "13px 22px",
      background: "transparent",
      color: "var(--text-accent)",
      border: "1px solid var(--czd-line)",
      cursor: "pointer"
    }
  }, "See the schedule"))), /*#__PURE__*/React.createElement(Brandmark, {
    variant: "mark",
    height: 250,
    assetBase: "../../assets",
    style: {
      justifySelf: "end"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: 1,
      background: "var(--czd-line-soft)",
      border: "1px solid var(--czd-line)",
      borderLeft: "none",
      borderRight: "none",
      marginTop: 56
    }
  }, FACTS.map(([n, l]) => /*#__PURE__*/React.createElement("div", {
    key: l,
    style: {
      background: "var(--surface-page)",
      padding: "20px 22px",
      display: "flex",
      flexDirection: "column",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 40,
      letterSpacing: "-0.03em",
      color: "var(--text-accent)",
      lineHeight: 1
    }
  }, n), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: "0.16em",
      color: "var(--text-muted)"
    }
  }, l))))), /*#__PURE__*/React.createElement(Section, {
    index: "01 \xB7",
    label: "What's here",
    trailing: "Both days"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "0 48px"
    }
  }, TRACKS.map(([n, t, d], i) => /*#__PURE__*/React.createElement("div", {
    key: n,
    style: {
      display: "grid",
      gridTemplateColumns: "44px minmax(0,1fr)",
      gap: 16,
      padding: "18px 0",
      borderTop: i < 2 ? "2px solid var(--czd-line)" : "1px solid var(--czd-line-soft)",
      borderBottom: i >= TRACKS.length - 2 ? "2px solid var(--czd-line)" : "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 18,
      color: "var(--text-accent)",
      lineHeight: 1.1
    }
  }, n), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      fontSize: 21,
      letterSpacing: "-0.022em",
      color: "var(--text-heading)",
      lineHeight: 1.02
    }
  }, t), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      color: "var(--text-body)",
      lineHeight: 1.6
    }
  }, d)))))), /*#__PURE__*/React.createElement(Section, {
    index: "02 \xB7",
    label: "Friday at a glance",
    trailing: "Day 01 \xB7 Geary Auditorium"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(ScheduleRow, {
    capTop: true,
    start: "8:00 AM",
    end: "9:15 AM",
    title: "Registration & coffee",
    byline: "Clay Tower Lobby. Badge required past the lobby."
  }), /*#__PURE__*/React.createElement(ScheduleRow, {
    start: "9:25 AM",
    end: "10:15 AM",
    tag: "Keynote",
    title: "So you've got your badge. What's next?",
    byline: "Dana Reeves \xB7 IoTemy Labs"
  }), /*#__PURE__*/React.createElement(ScheduleRow, {
    start: "10:30 AM",
    end: "11:15 AM",
    tag: "PANEL_02 \xB7 Women in Tech",
    title: "Hiring out of a two-college state",
    byline: "Four panelists \xB7 Moderated by the CZD Board"
  }), /*#__PURE__*/React.createElement(ScheduleRow, {
    variant: "emphasis",
    start: "12:00 PM",
    end: "1:00 PM",
    title: "Lunch",
    byline: "Vendor floor stays open. Lock lab does not."
  }), /*#__PURE__*/React.createElement(ScheduleRow, {
    capBottom: true,
    variant: "terminal",
    start: "5:30 PM",
    title: "Day 1 concludes"
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => onNav("Schedule"),
    style: {
      alignSelf: "flex-start",
      background: "none",
      border: "none",
      padding: 0,
      cursor: "pointer",
      fontFamily: "var(--font-mono)",
      fontWeight: 700,
      fontSize: 11,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color: "var(--text-accent)",
      borderBottom: "1px solid var(--czd-line)"
    }
  }, "Full two-day schedule \u2192")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 56
    }
  }), /*#__PURE__*/React.createElement(Section, {
    index: "03 \xB7",
    label: "Sponsors",
    trailing: "Tier 1",
    inset: true
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: 16
    }
  }, Array.from({
    length: 8
  }).map((_, i) => /*#__PURE__*/React.createElement(LogoSlot, {
    key: i,
    height: 76
  })))));
}
Object.assign(window, {
  HomeScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/HomeScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/ScheduleScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  ScheduleRow,
  EyebrowHeader,
  Rule
} = window.CharlestonZeroDayDesignSystem_182c31;
const DAYS = {
  "DAY 01": {
    date: "FRI OCT 02, 2026",
    sections: [{
      label: "Main stage",
      room: "Geary Auditorium",
      rows: [{
        start: "8:00 AM",
        end: "9:15 AM",
        title: "Registration & coffee",
        byline: "Clay Tower Lobby. Badge required past the lobby."
      }, {
        start: "9:25 AM",
        end: "10:15 AM",
        tag: "Keynote",
        title: "So you've got your badge. What's next?",
        byline: "Dana Reeves · IoTemy Labs"
      }, {
        start: "10:30 AM",
        end: "11:15 AM",
        tag: "PANEL_02 · Women in Tech",
        title: "Hiring out of a two-college state",
        byline: "Four panelists · Moderated by the CZD Board"
      }, {
        start: "11:25 AM",
        end: "12:00 PM",
        tag: "TALK_04",
        title: "Your SCADA network is on the internet",
        byline: "Speaker TBC · Room TBC"
      }, {
        start: "12:00 PM",
        end: "1:00 PM",
        variant: "emphasis",
        title: "Lunch",
        byline: "Vendor floor stays open. Lock lab does not."
      }, {
        start: "1:10 PM",
        end: "2:00 PM",
        tag: "TALK_05",
        title: "Reading a firmware dump you did not ask for",
        byline: "M. Whitaker · KDE Technology"
      }, {
        start: "2:15 PM",
        end: "3:00 PM",
        tag: "WORKSHOP_01",
        title: "Packet capture without the theater",
        byline: "Bring a laptop. Wireshark installed beforehand."
      }, {
        start: "5:30 PM",
        variant: "terminal",
        title: "Day 1 concludes"
      }]
    }, {
      label: "All day",
      room: "Riggleman Hall",
      rows: [{
        start: "9:00 AM",
        end: "5:00 PM",
        tag: "Lock lab",
        title: "Open the thing in front of you",
        byline: "Beginners welcome. Picks and practice locks provided.",
        room: "Riggleman 118"
      }, {
        start: "9:00 AM",
        end: "3:00 PM",
        tag: "HAM testing",
        title: "Technician through Extra",
        byline: "Bring ID and $15. Walk-ins taken until seats run out.",
        room: "Riggleman 120"
      }, {
        start: "9:00 AM",
        end: "5:00 PM",
        tag: "CTF",
        title: "Capture the flag",
        byline: "Teams of up to four. Scoreboard runs all weekend.",
        room: "Riggleman 204"
      }]
    }]
  },
  "DAY 02": {
    date: "SAT OCT 03, 2026",
    sections: [{
      label: "Main stage",
      room: "Geary Auditorium",
      rows: [{
        start: "9:00 AM",
        end: "9:45 AM",
        tag: "TALK_08",
        title: "What the state's incident reports actually say",
        byline: "Speaker TBC"
      }, {
        start: "10:00 AM",
        end: "10:45 AM",
        tag: "PANEL_03",
        title: "Running security with a team of one",
        byline: "Three panelists from regional hospitals and utilities"
      }, {
        start: "12:00 PM",
        end: "1:00 PM",
        variant: "emphasis",
        title: "Lunch",
        byline: "Last call for CTF submissions is 2:00 PM."
      }, {
        start: "2:30 PM",
        end: "3:15 PM",
        tag: "Closing",
        title: "CTF scoreboard and prizes",
        byline: "Stay for it. The last three years went to the wire."
      }, {
        start: "4:00 PM",
        variant: "terminal",
        title: "Charleston Zero Day 2026 ends"
      }]
    }]
  }
};
function ScheduleScreen() {
  const [day, setDay] = React.useState("DAY 01");
  const d = DAYS[day];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--content-max)",
      margin: "0 auto",
      padding: "48px 32px 0",
      display: "flex",
      flexDirection: "column",
      gap: 32
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 54,
      letterSpacing: "-0.032em",
      lineHeight: 0.9,
      textTransform: "uppercase",
      color: "var(--text-heading)"
    }
  }, "Schedule"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 0,
      borderTop: "1px solid var(--czd-line)",
      borderBottom: "1px solid var(--czd-line)"
    }
  }, Object.keys(DAYS).map(k => /*#__PURE__*/React.createElement("button", {
    key: k,
    onClick: () => setDay(k),
    style: {
      flex: "0 0 auto",
      padding: "14px 26px",
      background: day === k ? "var(--czd-tint)" : "transparent",
      border: "none",
      borderRight: "1px solid var(--czd-line-soft)",
      cursor: "pointer",
      fontFamily: "var(--font-mono)",
      fontWeight: 700,
      fontSize: 11.5,
      letterSpacing: "0.18em",
      color: day === k ? "var(--text-accent-peak)" : "var(--text-muted)"
    }
  }, k, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-muted)",
      fontWeight: 400,
      letterSpacing: "0.08em"
    }
  }, "\xB7 ", DAYS[k].date))))), d.sections.map((s, si) => /*#__PURE__*/React.createElement("div", {
    key: s.label,
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(EyebrowHeader, {
    index: `0${si + 1} ·`,
    label: s.label,
    trailing: s.room
  }), /*#__PURE__*/React.createElement("div", null, s.rows.map((r, i) => /*#__PURE__*/React.createElement(ScheduleRow, _extends({
    key: i
  }, r, {
    capTop: i === 0,
    capBottom: i === s.rows.length - 1
  })))))));
}
Object.assign(window, {
  ScheduleScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/ScheduleScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/SiteChrome.jsx
try { (() => {
const {
  Brandmark,
  Rule,
  EyebrowHeader,
  QRBlock
} = window.CharlestonZeroDayDesignSystem_182c31;
const NAV = ["Schedule", "Venue", "Sponsors", "Tickets"];
function SiteHeader({
  page,
  onNav
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: "sticky",
      top: 0,
      zIndex: 5,
      background: "var(--surface-page)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 2,
      background: "var(--czd-gold)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--content-max)",
      margin: "0 auto",
      padding: "18px 32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 32,
      borderBottom: "1px solid var(--czd-line)"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNav("Home"),
    style: {
      background: "none",
      border: "none",
      padding: 0,
      cursor: "pointer",
      display: "flex"
    }
  }, /*#__PURE__*/React.createElement(Brandmark, {
    variant: "lockup",
    height: 26,
    assetBase: "../../assets"
  })), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      gap: 26,
      alignItems: "center"
    }
  }, NAV.map(n => /*#__PURE__*/React.createElement("button", {
    key: n,
    onClick: () => onNav(n),
    style: {
      background: "none",
      border: "none",
      padding: "4px 0",
      cursor: "pointer",
      fontFamily: "var(--font-mono)",
      fontWeight: 700,
      fontSize: 11,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color: page === n ? "var(--text-accent-peak)" : "var(--text-body)",
      borderBottom: page === n ? "1px solid var(--czd-gold)" : "1px solid transparent"
    }
  }, n)))));
}
function SiteFooter() {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      maxWidth: "var(--content-max)",
      margin: "0 auto",
      padding: "48px 32px 64px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 48
    }
  }, /*#__PURE__*/React.createElement(QRBlock, {
    eyebrow: "Live schedule",
    primary: "charlestonzeroday.com/schedule",
    secondary: "Changes are pushed here first."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "2px solid var(--czd-gold)",
      paddingTop: 16,
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(EyebrowHeader, {
    label: "Run by",
    rule: false
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: "var(--text-body)",
      lineHeight: 1.7
    }
  }, "The CZD Board \xB7 IoTemy Labs \xB7 University of Charleston \xB7 KDE Technology"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: "var(--text-muted)",
      letterSpacing: "0.06em"
    }
  }, "#CZD2026 \xB7 FRI OCT 02 \u2013 SAT OCT 03, 2026"))));
}
function Section({
  index,
  label,
  trailing,
  children,
  inset
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: inset ? "var(--surface-inset)" : "transparent",
      padding: inset ? "56px 0" : "0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--content-max)",
      margin: "0 auto",
      padding: inset ? "0 32px" : "56px 32px 0",
      display: "flex",
      flexDirection: "column",
      gap: 28
    }
  }, /*#__PURE__*/React.createElement(EyebrowHeader, {
    index: index,
    label: label,
    trailing: trailing
  }), children));
}
Object.assign(window, {
  SiteHeader,
  SiteFooter,
  Section
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/SiteChrome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/SponsorsScreen.jsx
try { (() => {
const {
  LogoSlot,
  EyebrowHeader,
  QRBlock,
  Rule
} = window.CharlestonZeroDayDesignSystem_182c31;
const TIERS = [["Tier 1", 4, 108, "Main stage banner · Full trifold panel · Vendor floor corner"], ["Tier 2", 6, 76, "Vendor floor table · Program guide mark · Signage rotation"], ["Tier 3", 10, 54, "Program guide mark"]];
function SponsorsScreen() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--content-max)",
      margin: "0 auto",
      padding: "48px 32px 0",
      display: "flex",
      flexDirection: "column",
      gap: 36
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: "0.2em",
      color: "var(--text-accent)"
    }
  }, "// SPONSORS \xB7 2026"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 54,
      letterSpacing: "-0.032em",
      lineHeight: 0.9,
      textTransform: "uppercase",
      color: "var(--text-heading)"
    }
  }, "Who pays for this"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      color: "var(--text-body)",
      maxWidth: "62ch",
      lineHeight: 1.7
    }
  }, "Badges cover about a third of the cost. These companies cover the rest. Marks land here as agreements are signed \u2014 empty slots are honest, not decorative.")), TIERS.map(([name, count, h, perks], i) => /*#__PURE__*/React.createElement("div", {
    key: name,
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(EyebrowHeader, {
    index: `0${i + 1} ·`,
    label: name,
    trailing: perks
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: `repeat(${count > 6 ? 5 : count > 4 ? 3 : 4},1fr)`,
      gap: 16
    }
  }, Array.from({
    length: count
  }).map((_, k) => /*#__PURE__*/React.createElement(LogoSlot, {
    key: k,
    height: h,
    label: k === count - 1 ? "OPEN" : "LOGO"
  }))))), /*#__PURE__*/React.createElement(QRBlock, {
    eyebrow: "Sponsor prospectus",
    primary: "charlestonzeroday.com/sponsor",
    secondary: "Tiers, deadlines, and what each one buys."
  }));
}
Object.assign(window, {
  SponsorsScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/SponsorsScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/TicketsScreen.jsx
try { (() => {
const {
  EyebrowHeader,
  Rule,
  QRBlock
} = window.CharlestonZeroDayDesignSystem_182c31;
const TIERS = [["General", "$40", ["Both days", "Lunch both days", "Lock lab, CTF, vendor floor", "T-shirt while sizes last"]], ["Student", "$15", ["Both days", "Lunch both days", "Valid .edu address at the door"]], ["Supporter", "$120", ["Everything in General", "Name in the program guide", "Pays for two student badges"]]];
function TicketsScreen() {
  const [picked, setPicked] = React.useState("General");
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--content-max)",
      margin: "0 auto",
      padding: "48px 32px 0",
      display: "flex",
      flexDirection: "column",
      gap: 32
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: "0.2em",
      color: "var(--text-accent)"
    }
  }, "// BADGES \xB7 FRI OCT 02 \u2013 SAT OCT 03, 2026"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 54,
      letterSpacing: "-0.032em",
      lineHeight: 0.9,
      textTransform: "uppercase",
      color: "var(--text-heading)"
    }
  }, "Get a badge"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      color: "var(--text-body)",
      maxWidth: "62ch",
      lineHeight: 1.7
    }
  }, "One price, both days. No tiers of access \u2014 a student badge gets you into the same rooms as everyone else.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: 1,
      background: "var(--czd-line-soft)",
      borderTop: "2px solid var(--czd-line)",
      borderBottom: "2px solid var(--czd-line)"
    }
  }, TIERS.map(([name, price, perks]) => {
    const on = picked === name;
    return /*#__PURE__*/React.createElement("button", {
      key: name,
      onClick: () => setPicked(name),
      style: {
        textAlign: "left",
        background: on ? "var(--czd-tint)" : "var(--surface-page)",
        border: "none",
        padding: "24px 22px",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-mono)",
        fontWeight: 700,
        fontSize: 11,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: on ? "var(--text-accent-peak)" : "var(--text-accent)"
      }
    }, name), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: 46,
        letterSpacing: "-0.03em",
        lineHeight: 1,
        color: "var(--text-heading)"
      }
    }, price), /*#__PURE__*/React.createElement("span", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 6
      }
    }, perks.map(p => /*#__PURE__*/React.createElement("span", {
      key: p,
      style: {
        fontFamily: "var(--font-mono)",
        fontSize: 11.5,
        color: "var(--text-body)",
        display: "flex",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--czd-gold-mid)"
      }
    }, "\xB7"), p))));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 16,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: {
      fontFamily: "var(--font-mono)",
      fontWeight: 700,
      fontSize: 11.5,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      padding: "14px 24px",
      background: "var(--czd-gold)",
      color: "#0A0A0A",
      border: "1px solid var(--czd-gold)",
      cursor: "pointer"
    }
  }, "Check out \u2014 ", picked), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11.5,
      color: "var(--text-muted)"
    }
  }, "Registration opens 8:00 AM Friday in Clay Tower Lobby.")), /*#__PURE__*/React.createElement(QRBlock, {
    eyebrow: "Code of conduct",
    primary: "charlestonzeroday.com/conduct",
    secondary: "Read it before you buy. It is enforced."
  }));
}
Object.assign(window, {
  TicketsScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/TicketsScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/VenueScreen.jsx
try { (() => {
const {
  WayfindingBlock,
  MapKeyItem,
  EyebrowHeader,
  QRBlock,
  Rule
} = window.CharlestonZeroDayDesignSystem_182c31;
const KEYS = [["01", "Geary Auditorium", "Main stage · Both days"], ["02", "Clay Tower Lobby", "Registration · Vendor floor"], ["03", "Riggleman Hall", "Lock lab, HAM testing, CTF"], ["04", "Student Union", "Lunch · 12:00 PM – 1:00 PM"], ["05", "Lot C", "Free parking with a badge"]];
function VenueScreen() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--content-max)",
      margin: "0 auto",
      padding: "48px 32px 0",
      display: "flex",
      flexDirection: "column",
      gap: 36
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: "0.2em",
      color: "var(--text-accent)"
    }
  }, "// CAMPUS \xB7 UNIVERSITY OF CHARLESTON"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 54,
      letterSpacing: "-0.032em",
      lineHeight: 0.9,
      textTransform: "uppercase",
      color: "var(--text-heading)"
    }
  }, "Getting around"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      color: "var(--text-body)",
      maxWidth: "62ch",
      lineHeight: 1.7
    }
  }, "Everything is within a four-minute walk. 2300 MacCorkle Ave SE, Charleston WV. Park in Lot C and enter through Clay Tower.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "minmax(0,1.15fr) 1px minmax(0,1fr)",
      gap: 40
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(EyebrowHeader, {
    index: "01 \xB7",
    label: "Map"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: "4 / 3",
      border: "1px dashed var(--czd-line)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--surface-inset)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 10,
      letterSpacing: "0.16em",
      color: "var(--text-muted)"
    }
  }, "CAMPUS MAP ARTWORK \u2014 NOT SUPPLIED")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, KEYS.map(([n, p, d]) => /*#__PURE__*/React.createElement(MapKeyItem, {
    key: n,
    number: n,
    place: p,
    detail: d
  })))), /*#__PURE__*/React.createElement(Rule, {
    vertical: true,
    variant: "soft"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 28
    }
  }, /*#__PURE__*/React.createElement(EyebrowHeader, {
    index: "02 \xB7",
    label: "Directions"
  }), /*#__PURE__*/React.createElement(WayfindingBlock, {
    label: "Registration",
    destination: "Clay Tower Lobby",
    directions: "Enter from Lot C. Tables are straight ahead, under the gold banner.",
    time: "8:00 AM \u2013 3:00 PM \xB7 BOTH DAYS"
  }), /*#__PURE__*/React.createElement(WayfindingBlock, {
    label: "Lunch",
    destination: "Student Union",
    directions: "Out the north doors, across the quad, first building on your right.",
    time: "12:00 PM \u2013 1:00 PM \xB7 BOTH DAYS"
  }), /*#__PURE__*/React.createElement(WayfindingBlock, {
    label: "CTF",
    arrow: "\u2191",
    destination: "Riggleman Hall 204",
    directions: "Second floor. Take the stairs by registration.",
    time: "OPEN 9:00 AM \u2013 5:00 PM"
  }), /*#__PURE__*/React.createElement(QRBlock, {
    eyebrow: "Live room changes",
    primary: "charlestonzeroday.com/rooms",
    secondary: "Boards update from this page."
  }))));
}
Object.assign(window, {
  VenueScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/VenueScreen.jsx", error: String((e && e.message) || e) }); }

__ds_ns.ScheduleRow = __ds_scope.ScheduleRow;

__ds_ns.SessionTag = __ds_scope.SessionTag;

__ds_ns.StatusChip = __ds_scope.StatusChip;

__ds_ns.Brandmark = __ds_scope.Brandmark;

__ds_ns.EyebrowHeader = __ds_scope.EyebrowHeader;

__ds_ns.LogoSlot = __ds_scope.LogoSlot;

__ds_ns.Rule = __ds_scope.Rule;

__ds_ns.MapKeyItem = __ds_scope.MapKeyItem;

__ds_ns.QRBlock = __ds_scope.QRBlock;

__ds_ns.WayfindingBlock = __ds_scope.WayfindingBlock;

})();
