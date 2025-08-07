import Ie, { useRef as y, useEffect as R, useState as w, useCallback as K } from "react";
var me = { exports: {} }, ee = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ee;
function $e() {
  if (Ee) return ee;
  Ee = 1;
  var u = Symbol.for("react.transitional.element"), m = Symbol.for("react.fragment");
  function a(d, l, h) {
    var b = null;
    if (h !== void 0 && (b = "" + h), l.key !== void 0 && (b = "" + l.key), "key" in l) {
      h = {};
      for (var g in l)
        g !== "key" && (h[g] = l[g]);
    } else h = l;
    return l = h.ref, {
      $$typeof: u,
      type: d,
      key: b,
      ref: l !== void 0 ? l : null,
      props: h
    };
  }
  return ee.Fragment = m, ee.jsx = a, ee.jsxs = a, ee;
}
var te = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Te;
function We() {
  return Te || (Te = 1, process.env.NODE_ENV !== "production" && function() {
    function u(r) {
      if (r == null) return null;
      if (typeof r == "function")
        return r.$$typeof === W ? null : r.displayName || r.name || null;
      if (typeof r == "string") return r;
      switch (r) {
        case $:
          return "Fragment";
        case ne:
          return "Profiler";
        case re:
          return "StrictMode";
        case he:
          return "Suspense";
        case pe:
          return "SuspenseList";
        case ge:
          return "Activity";
      }
      if (typeof r == "object")
        switch (typeof r.tag == "number" && console.error(
          "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
        ), r.$$typeof) {
          case U:
            return "Portal";
          case V:
            return (r.displayName || "Context") + ".Provider";
          case H:
            return (r._context.displayName || "Context") + ".Consumer";
          case se:
            var o = r.render;
            return r = r.displayName, r || (r = o.displayName || o.name || "", r = r !== "" ? "ForwardRef(" + r + ")" : "ForwardRef"), r;
          case ve:
            return o = r.displayName || null, o !== null ? o : u(r.type) || "Memo";
          case _:
            o = r._payload, r = r._init;
            try {
              return u(r(o));
            } catch {
            }
        }
      return null;
    }
    function m(r) {
      return "" + r;
    }
    function a(r) {
      try {
        m(r);
        var o = !1;
      } catch {
        o = !0;
      }
      if (o) {
        o = console;
        var c = o.error, v = typeof Symbol == "function" && Symbol.toStringTag && r[Symbol.toStringTag] || r.constructor.name || "Object";
        return c.call(
          o,
          "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
          v
        ), m(r);
      }
    }
    function d(r) {
      if (r === $) return "<>";
      if (typeof r == "object" && r !== null && r.$$typeof === _)
        return "<...>";
      try {
        var o = u(r);
        return o ? "<" + o + ">" : "<...>";
      } catch {
        return "<...>";
      }
    }
    function l() {
      var r = z.A;
      return r === null ? null : r.getOwner();
    }
    function h() {
      return Error("react-stack-top-frame");
    }
    function b(r) {
      if (M.call(r, "key")) {
        var o = Object.getOwnPropertyDescriptor(r, "key").get;
        if (o && o.isReactWarning) return !1;
      }
      return r.key !== void 0;
    }
    function g(r, o) {
      function c() {
        B || (B = !0, console.error(
          "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
          o
        ));
      }
      c.isReactWarning = !0, Object.defineProperty(r, "key", {
        get: c,
        configurable: !0
      });
    }
    function E() {
      var r = u(this.type);
      return F[r] || (F[r] = !0, console.error(
        "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
      )), r = this.props.ref, r !== void 0 ? r : null;
    }
    function T(r, o, c, v, k, j, L, A) {
      return c = j.ref, r = {
        $$typeof: O,
        type: r,
        key: o,
        props: j,
        _owner: k
      }, (c !== void 0 ? c : null) !== null ? Object.defineProperty(r, "ref", {
        enumerable: !1,
        get: E
      }) : Object.defineProperty(r, "ref", { enumerable: !1, value: null }), r._store = {}, Object.defineProperty(r._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: 0
      }), Object.defineProperty(r, "_debugInfo", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: null
      }), Object.defineProperty(r, "_debugStack", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: L
      }), Object.defineProperty(r, "_debugTask", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: A
      }), Object.freeze && (Object.freeze(r.props), Object.freeze(r)), r;
    }
    function x(r, o, c, v, k, j, L, A) {
      var p = o.children;
      if (p !== void 0)
        if (v)
          if (q(p)) {
            for (v = 0; v < p.length; v++)
              i(p[v]);
            Object.freeze && Object.freeze(p);
          } else
            console.error(
              "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
            );
        else i(p);
      if (M.call(o, "key")) {
        p = u(r);
        var S = Object.keys(o).filter(function(P) {
          return P !== "key";
        });
        v = 0 < S.length ? "{key: someKey, " + S.join(": ..., ") + ": ...}" : "{key: someKey}", G[p + v] || (S = 0 < S.length ? "{" + S.join(": ..., ") + ": ...}" : "{}", console.error(
          `A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`,
          v,
          p,
          S,
          p
        ), G[p + v] = !0);
      }
      if (p = null, c !== void 0 && (a(c), p = "" + c), b(o) && (a(o.key), p = "" + o.key), "key" in o) {
        c = {};
        for (var Y in o)
          Y !== "key" && (c[Y] = o[Y]);
      } else c = o;
      return p && g(
        c,
        typeof r == "function" ? r.displayName || r.name || "Unknown" : r
      ), T(
        r,
        p,
        j,
        k,
        l(),
        c,
        L,
        A
      );
    }
    function i(r) {
      typeof r == "object" && r !== null && r.$$typeof === O && r._store && (r._store.validated = 1);
    }
    var I = Ie, O = Symbol.for("react.transitional.element"), U = Symbol.for("react.portal"), $ = Symbol.for("react.fragment"), re = Symbol.for("react.strict_mode"), ne = Symbol.for("react.profiler"), H = Symbol.for("react.consumer"), V = Symbol.for("react.context"), se = Symbol.for("react.forward_ref"), he = Symbol.for("react.suspense"), pe = Symbol.for("react.suspense_list"), ve = Symbol.for("react.memo"), _ = Symbol.for("react.lazy"), ge = Symbol.for("react.activity"), W = Symbol.for("react.client.reference"), z = I.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, M = Object.prototype.hasOwnProperty, q = Array.isArray, X = console.createTask ? console.createTask : function() {
      return null;
    };
    I = {
      react_stack_bottom_frame: function(r) {
        return r();
      }
    };
    var B, F = {}, C = I.react_stack_bottom_frame.bind(
      I,
      h
    )(), J = X(d(h)), G = {};
    te.Fragment = $, te.jsx = function(r, o, c, v, k) {
      var j = 1e4 > z.recentlyCreatedOwnerStacks++;
      return x(
        r,
        o,
        c,
        !1,
        v,
        k,
        j ? Error("react-stack-top-frame") : C,
        j ? X(d(r)) : J
      );
    }, te.jsxs = function(r, o, c, v, k) {
      var j = 1e4 > z.recentlyCreatedOwnerStacks++;
      return x(
        r,
        o,
        c,
        !0,
        v,
        k,
        j ? Error("react-stack-top-frame") : C,
        j ? X(d(r)) : J
      );
    };
  }()), te;
}
var Se;
function Xe() {
  return Se || (Se = 1, process.env.NODE_ENV === "production" ? me.exports = $e() : me.exports = We()), me.exports;
}
var t = Xe();
function Ye() {
  return /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
    /* @__PURE__ */ t.jsx("div", { className: "spinner" }),
    /* @__PURE__ */ t.jsx("style", { children: `
          .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f97316;
            border-top-color: transparent;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin: auto;
          }
  
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        ` })
  ] });
}
function De(u) {
  let m = "";
  const a = u?.split(`
`);
  let d, l = !1, h, b = "";
  for (const g in a) {
    const E = a[g].trim();
    E == "" && d && (m += h?.replace(/,/g, ".") + `
`, m += b + `
`, b = "", l = !1, d = !1), d && (b += E + `
`), l && (h = E, d = !0, l = !1), !isNaN(Number(E)) && E != "" && !l && (l = !0);
  }
  return m;
}
function Ue(u) {
  const m = De(u), a = new Blob([`WEBVTT - https://${window.location.href}

` + m], { type: "text/vtt;charset=UTF-8" });
  return URL.createObjectURL(a);
}
const Ne = (u) => {
  const m = Math.floor(u / 3600), a = Math.floor(u % 3600 / 60), d = Math.floor(u % 60);
  return `${m.toString().padStart(2, "0")}:${a.toString().padStart(2, "0")}:${d.toString().padStart(2, "0")}`;
}, Re = ({
  progress: u,
  fref: m,
  isDragging: a,
  width: d,
  onClick: l,
  onDrag: h
}) => {
  const b = y(!1);
  return a || (a = b), R(() => {
    const g = () => {
      a.current = !1;
    };
    return document.addEventListener("mouseup", g), () => document.removeEventListener("mouseup", g);
  }, [a]), /* @__PURE__ */ t.jsxs(
    "div",
    {
      style: d ? { width: d } : {},
      className: "player-progress-container",
      ref: m,
      onClick: l,
      onMouseDown: () => a.current = !0,
      onMouseUp: () => a.current = !1,
      onMouseMove: (g) => a?.current && h(g),
      onTouchStart: () => a.current = !0,
      onTouchEnd: () => a.current = !1,
      onTouchMove: (g) => a?.current && h(g),
      children: [
        /* @__PURE__ */ t.jsx(
          "div",
          {
            className: "player-progress-bar",
            style: {
              width: `${u}%`
            }
          }
        ),
        /* @__PURE__ */ t.jsx(
          "div",
          {
            className: "player-container-bullet",
            style: {
              left: `calc(${u}%)`
            }
          }
        )
      ]
    }
  );
}, He = {
  Settings: "تنظیمات",
  "Rewind 10 seconds": "۱۰ ثانیه عقب بردن",
  "Forward 10 seconds": "۱۰ ثانیه جلو بردن",
  Subtitles: "زیرنویس ها",
  "Select Subtitle": "انتخاب زیرنویس",
  "Advance Subtitles": "عقب بردن زیرنویس",
  "Delay Subtitles": "جلو بردن زیرنویس",
  "Move Subtitles Down": "پایین آوردن زیرنویس",
  "Move Subtitles Up": "بالا بردن زیرنویس",
  "Subtitle Alignment": "جهت نمایش زیرنویس",
  "Play from First": "پخش از ابتدا"
}, Ve = {
  play: "Play"
}, ze = {
  fa: He,
  en: Ve
};
function Le(u) {
  return (m) => ze[u]?.[m] || m;
}
const qe = ({
  subtitle: u,
  activeSubtitle: m,
  lang: a,
  selectSubtitle: d
}) => {
  const [l, h] = w(""), b = Le(a);
  return /* @__PURE__ */ t.jsx("li", { children: /* @__PURE__ */ t.jsx("button", { "aria-label": b("Subtitle"), className: m === u?.id ? "text-primary" : `text-${l}`, onClick: async (g) => {
    g.preventDefault(), d(u), h("success");
  }, children: u?.title }) });
};
function Ge({
  alert: u,
  children: m,
  id: a,
  src: d,
  subtitles: l,
  lang: h = "en",
  onPlay: b,
  onPause: g,
  onLoad: E,
  onFullScreen: T
}) {
  const x = Le(h), i = y(null), I = y(null), O = y(null), U = y(null), $ = y(null), re = y(null), ne = y(0), H = y(null), [V, se] = w(""), [he, pe] = w(0), [ve, _] = w(0), [ge, W] = w(0), [z, M] = w(0), [q, X] = w(0), [B, F] = w(!1), C = y(!1), [J, G] = w(!1), [r, o] = w(!1), [c, v] = w(!1), k = y(null), j = y(!1), [L, A] = w(!1), [p, S] = w(!0);
  let Y = 20;
  typeof localStorage < "u" && localStorage.getItem("subtitleMargin") && (Y = parseInt(localStorage?.getItem("subtitleMargin") || "0"));
  const [P, we] = w(Y), [be, Ce] = w("ltr"), oe = y(!1), [ae, ie] = w(!1), ke = () => {
    const n = i.current?.textTracks[0];
    n && (n.mode = "hidden", n.oncuechange = () => {
      const s = n.activeCues?.[0];
      se(s && s ? s?.text : "");
    });
  };
  R(() => {
    const e = i.current;
    ke();
    const n = () => {
      oe.current && e.requestVideoFrameCallback(() => {
        j?.current || (_(e.currentTime / e.duration * 100), W(e.currentTime), M(e.duration)), n();
      });
    };
    e.addEventListener("loadedmetadata", () => {
      M(e.duration);
    }), e.addEventListener("play", () => {
      oe.current = !0, n();
    }), e.addEventListener("pause", () => {
      oe.current = !1;
    }), e.addEventListener("ended", () => {
      oe.current = !1;
    }), e.addEventListener("timeupdate", () => {
      Math.abs(e.currentTime - ne.current) >= 5 && (localStorage.setItem(`video-progress-${a}`, String(e.currentTime)), ne.current = e.currentTime);
    }), e.addEventListener("ended", () => {
      localStorage.removeItem(`video-progress-${a}`);
    }), e.addEventListener("loadedmetadata", () => {
      const N = `video-progress-${a}`, D = parseFloat(localStorage.getItem(N) || "0");
      !isNaN(D) && D < e.duration - 10 && D > 0 && (v(!0), e.currentTime = D, _(e.currentTime / e.duration * 100), W(e.currentTime), M(e.duration));
    });
    const s = () => G(!0), f = () => G(!1);
    return e.addEventListener("waiting", s), e.addEventListener("seeking", s), e.addEventListener("canplay", f), e.addEventListener("playing", f), e.addEventListener("ended", f), () => {
      e.removeEventListener("waiting", s), e.removeEventListener("seeking", s), e.removeEventListener("canplay", f), e.removeEventListener("playing", f), e.removeEventListener("ended", f);
    };
  }, [V, a, j, L]);
  const je = (e) => {
    const s = $.current.getBoundingClientRect(), N = (e - s.left) / s.width;
    return _(N * 100), N;
  }, _e = (e) => {
    const n = je(e.clientX), s = i.current;
    try {
      s.currentTime = n * s.duration;
    } catch (f) {
      console.log(f);
    }
  }, Me = (e) => {
    let n = 0;
    "touches" in e ? n = e.touches[0].clientX : n = e.clientX;
    const s = je(n), f = i.current;
    try {
      f.currentTime = s * f.duration;
    } catch (N) {
      console.log(N);
    }
  }, Ae = () => {
    const e = U.current;
    document.fullscreenElement === e ? (T && T(!1), A(!1), document.exitFullscreen()) : (T && T(!0), A(!0), e.requestFullscreen()), i?.current?.focus(), C.current = !0;
  }, xe = () => {
    if (!i?.current)
      return;
    const e = i?.current, n = e?.src !== "" && e?.src !== document.location.href;
    B ? (g && g(i, L), n && e.pause()) : (b && b(i, L), n && e.play().catch((s) => {
      console.error(s);
    })), n && F(!B);
  }, [le, ce] = w(100);
  R(() => {
    if (i.current) {
      const e = le / 100;
      i.current.volume = e > 1 ? 1 : e;
    }
  }, [le]);
  const ye = (e) => {
    const s = re.current.getBoundingClientRect();
    return (e - s.left) / s.width;
  }, Pe = (e) => {
    let n = 0;
    "touches" in e ? n = e.touches[0].clientX : n = e.clientX;
    const s = ye(n);
    s > 1 || s < 0 || (ce(s * 100), i.current && (i.current.volume = s));
  }, Z = K(async (e) => {
    if (!O.current) return;
    ie(!1);
    const N = (await (await fetch(e.link)).json())?.data?.[0];
    return O.current && (O.current.src = Ue(N)), ke(), pe(e?.id), N;
  }, []);
  R(() => {
    E && E(Z);
  }, [E, Z]);
  const Q = K(() => {
    L && U?.current && (clearTimeout(H.current), H.current = setTimeout(() => {
      S(!1), document.body.style.cursor = "none";
    }, 5e3));
  }, [L]), ue = K(() => {
    const e = i.current;
    e && (_(e.currentTime / e.duration * 100), W(e.currentTime), M(e.duration), S(!0), Q());
  }, [Q]), de = K(() => {
    const e = i.current;
    e && (e.currentTime = Math.min(e.currentTime + 10, e.duration), ue());
  }, [ue]), fe = K(() => {
    const e = i.current;
    e && (e.currentTime = Math.max(e.currentTime - 10, 0), ue());
  }, [ue]);
  R(() => {
    const e = (n) => {
      C?.current && (n.key === "ArrowLeft" ? fe() : n.key === "ArrowRight" && de());
    };
    return c && setTimeout(() => {
      v(!1);
    }, 1e4), window.addEventListener("keydown", e), () => window.removeEventListener("keydown", e);
  }, [c, C, fe, de]), R(() => {
    const e = i?.current;
    return e && (e.src = d || ""), () => {
      e && (e.pause(), e.src = "", e.load());
    };
  }, [d]);
  const Oe = 'video/x-matroska; codecs="theora, vorbis"';
  R(() => () => {
    clearTimeout(H.current), document.body.style.cursor = "default";
  }, []), R(() => {
    const e = () => {
      document.fullscreenElement ? (T && T(!0), A(!0)) : (T && T(!1), A(!1));
    };
    return document.addEventListener("fullscreenchange", e), () => {
      document.removeEventListener("fullscreenchange", e);
    };
  }, [T]), R(() => {
    const e = (n) => {
      if (C?.current && n.key === "Enter") {
        const s = i.current;
        s && (p ? s.paused ? (s.play(), F(!0)) : (s.pause(), F(!1)) : (S(!0), Q()));
      }
    };
    return window.addEventListener("keydown", e), () => {
      window.removeEventListener("keydown", e);
    };
  }, [p, Q]), R(() => {
    const e = () => {
      document.body.style.cursor = "default";
    };
    return document.addEventListener("mousemove", e), () => document.removeEventListener("mousemove", e);
  }, []);
  const Be = (e = 0.5) => {
    const n = i?.current;
    return n && Array.from(n.textTracks).forEach((s) => {
      if (s.cues)
        return Array.from(s.cues).forEach((f) => {
          X(q + e), f.startTime += e, f.endTime += e;
        }), !0;
    }), !1;
  }, Fe = (e = 0.5) => {
    const n = i?.current;
    return n && Array.from(n.textTracks).forEach((s) => {
      if (s.cues)
        return Array.from(s.cues).forEach((f) => {
          X(q - e), f.startTime -= e, f.endTime -= e;
        }), !0;
    }), !1;
  };
  return R(() => {
    l?.map((e) => {
      e?.default && Z(e);
    });
  }, [Z, l]), /* @__PURE__ */ t.jsxs(
    "div",
    {
      ref: U,
      onMouseMove: () => {
        p || (S(!0), document.body.style.cursor = "default"), Q();
      },
      className: "player-container" + (L ? " player-fullscreen" : ""),
      children: [
        /* @__PURE__ */ t.jsx(
          "video",
          {
            preload: "none",
            type: Oe,
            tabIndex: 0,
            autoFocus: !0,
            onClick: () => {
              k.current || (k.current = setTimeout(() => {
                ie(!1), ae || xe(), k.current = null;
              }, 200));
            },
            onDoubleClick: (e) => {
              k.current && (clearTimeout(k.current), k.current = null);
              const { clientX: n } = e, { width: s, left: f } = e.currentTarget.getBoundingClientRect();
              n - f < s / 2 ? fe() : de(), i.current.play().catch((D) => {
                console.error(D);
              }), F(!0);
            },
            onMouseEnter: () => C.current = !0,
            onMouseLeave: () => C.current = !1,
            ref: i,
            src: d,
            style: { width: "100%", height: "100%" },
            children: /* @__PURE__ */ t.jsx(
              "track",
              {
                ref: O,
                label: "Subtitle",
                kind: "subtitles",
                srcLang: "en",
                src: "/subtitle.vtt",
                default: !0
              }
            )
          }
        ),
        J && /* @__PURE__ */ t.jsx("div", { className: "player-title", children: /* @__PURE__ */ t.jsx(Ye, {}) }),
        !J && !B && /* @__PURE__ */ t.jsxs("div", { className: "player-title player-title-no-background", onClick: () => {
          ie(!1), ae || xe();
        }, children: [
          /* @__PURE__ */ t.jsx("div", { className: "player-play-icon", children: /* @__PURE__ */ t.jsx("i", { children: /* @__PURE__ */ t.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: 32, height: 32, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", className: "lucide lucide-play-icon lucide-play", children: /* @__PURE__ */ t.jsx("path", { d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" }) }) }) }),
          u
        ] }),
        /* @__PURE__ */ t.jsxs("div", { className: "player-bar-wrapper", ref: I, children: [
          m,
          V !== "" && /* @__PURE__ */ t.jsx("div", { className: "player-subtitle", style: { marginBottom: P }, dir: be, dangerouslySetInnerHTML: { __html: V } }),
          /* @__PURE__ */ t.jsxs("div", { className: "player-bars" + (p ? "" : " v-none"), children: [
            /* @__PURE__ */ t.jsxs("div", { className: "player-bar", children: [
              c && /* @__PURE__ */ t.jsx("button", { "aria-label": x("Play From First"), onClick: () => {
                const e = i?.current;
                if (e) {
                  e.currentTime = 0, _(e.currentTime / e.duration * 100), W(e.currentTime), M(e.duration);
                  const n = `video-progress-${a}`;
                  localStorage.removeItem(n), v(!1), i.current.play().catch((s) => {
                    console.error(s);
                  });
                }
              }, className: "player-fromfirst", children: /* @__PURE__ */ t.jsx("h5", { children: x("Play from First") }) }),
              /* @__PURE__ */ t.jsx("button", { onClick: () => {
                o(!r);
              }, "data-bs-toggle": "tooltip", "data-bs-placement": "top", title: x("Settings"), className: "player-btn", children: /* @__PURE__ */ t.jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: 28, height: 28, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", className: "lucide lucide-settings-icon lucide-settings", children: [
                /* @__PURE__ */ t.jsx("path", { d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" }),
                /* @__PURE__ */ t.jsx("circle", { cx: 12, cy: 12, r: 3 })
              ] }) }),
              /* @__PURE__ */ t.jsx("button", { "data-bs-toggle": "tooltip", "data-bs-placement": "top", title: x("Rewind 10 seconds"), className: "player-btn", onClick: fe, children: /* @__PURE__ */ t.jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: 28, height: 28, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", className: "lucide lucide-backward", children: [
                /* @__PURE__ */ t.jsx("path", { d: "m9 17-5-5 5-5" }),
                /* @__PURE__ */ t.jsx("path", { d: "M20 18v-2a4 4 0 0 0-4-4H4" })
              ] }) }),
              /* @__PURE__ */ t.jsx("button", { "data-bs-toggle": "tooltip", "data-bs-placement": "top", title: x("Forward 10 seconds"), className: "player-btn", onClick: de, children: /* @__PURE__ */ t.jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: 28, height: 28, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", className: "lucide lucide-forward-icon lucide-forward", children: [
                /* @__PURE__ */ t.jsx("path", { d: "m15 17 5-5-5-5" }),
                /* @__PURE__ */ t.jsx("path", { d: "M4 18v-2a4 4 0 0 1 4-4h12" })
              ] }) }),
              !!r && /* @__PURE__ */ t.jsxs("div", { className: "player-settings", children: [
                /* @__PURE__ */ t.jsx("button", { "data-bs-toggle": "tooltip", "data-bs-placement": "top", title: x("Subtitle Alignment"), className: "player-btn", onClick: () => {
                  Ce((e) => e === "rtl" ? "ltr" : "rtl");
                }, children: be === "rtl" ? /* @__PURE__ */ t.jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: 28, height: 28, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", className: "lucide lucide-align-left-icon lucide-align-left", children: [
                  /* @__PURE__ */ t.jsx("path", { d: "M15 12H3" }),
                  /* @__PURE__ */ t.jsx("path", { d: "M17 18H3" }),
                  /* @__PURE__ */ t.jsx("path", { d: "M21 6H3" })
                ] }) : /* @__PURE__ */ t.jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: 28, height: 28, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", className: "lucide lucide-align-right-icon lucide-align-right", children: [
                  /* @__PURE__ */ t.jsx("path", { d: "M21 12H9" }),
                  /* @__PURE__ */ t.jsx("path", { d: "M21 18H7" }),
                  /* @__PURE__ */ t.jsx("path", { d: "M21 6H3" })
                ] }) }),
                /* @__PURE__ */ t.jsx("button", { "data-bs-toggle": "tooltip", "data-bs-placement": "top", title: x("Move Subtitles Up"), className: "player-btn", onClick: () => {
                  we(P + 5), localStorage.setItem("subtitleMargin", (P + 5).toString());
                }, children: /* @__PURE__ */ t.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ t.jsx("path", { d: "M7 14L12 9L17 14", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }) }) }),
                /* @__PURE__ */ t.jsx("button", { "data-bs-toggle": "tooltip", "data-bs-placement": "top", title: x("Move Subtitles Down"), className: "player-btn", onClick: () => {
                  we(P - 5), localStorage.setItem("subtitleMargin", (P - 5).toString());
                }, children: /* @__PURE__ */ t.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ t.jsx("path", { d: "M7 10L12 15L17 10", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }) }) }),
                /* @__PURE__ */ t.jsx("div", { className: "text-white", children: /* @__PURE__ */ t.jsx("span", { className: "badge bg-primary", children: P }) }),
                /* @__PURE__ */ t.jsx("button", { "data-bs-toggle": "tooltip", "data-bs-placement": "top", title: x("Delay Subtitles"), className: "player-btn", onClick: () => {
                  Be();
                }, children: /* @__PURE__ */ t.jsx("svg", { fill: "currentColor", width: 24, height: 24, viewBox: "0 0 32 32", version: "1.1", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ t.jsx("path", { d: "M31.218 15.838c-0.007-0.058-0.018-0.109-0.031-0.159l0.002 0.008c-0.051-0.223-0.158-0.416-0.305-0.571l0 0.001-5-5c-0.226-0.227-0.539-0.367-0.885-0.367-0.691 0-1.251 0.56-1.251 1.251 0 0.345 0.14 0.658 0.366 0.884v0l2.867 2.866h-18.982c-0.69 0-1.25 0.56-1.25 1.25s0.56 1.25 1.25 1.25v0h18.981l-2.866 2.865c-0.226 0.226-0.366 0.539-0.366 0.884 0 0.691 0.56 1.251 1.251 1.251 0.345 0 0.658-0.14 0.884-0.366l5-5.001c0.012-0.012 0.016-0.029 0.027-0.041 0.099-0.103 0.18-0.223 0.239-0.356l0.003-0.008 0-0.003c0.051-0.13 0.080-0.28 0.080-0.437 0-0.071-0.006-0.141-0.017-0.208l0.001 0.007zM2 0.75c-0.69 0-1.25 0.56-1.25 1.25v0 28c0 0.69 0.56 1.25 1.25 1.25s1.25-0.56 1.25-1.25v0-28c0-0.69-0.56-1.25-1.25-1.25v0z" }) }) }),
                /* @__PURE__ */ t.jsx("button", { "data-bs-toggle": "tooltip", "data-bs-placement": "top", title: x("Advance Subtitles"), className: "player-btn", onClick: () => {
                  Fe();
                }, children: /* @__PURE__ */ t.jsx("svg", { fill: "currentColor", width: 24, height: 24, viewBox: "0 0 32 32", version: "1.1", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ t.jsx("path", { d: "M24 14.75h-18.982l2.866-2.866c0.225-0.226 0.363-0.537 0.363-0.881 0-0.69-0.56-1.25-1.25-1.25-0.344 0-0.655 0.139-0.881 0.363l-5 5c-0.011 0.011-0.015 0.027-0.026 0.039-0.1 0.104-0.183 0.225-0.243 0.359l-0.003 0.008-0 0.004c-0.050 0.129-0.079 0.279-0.079 0.435 0 0.072 0.006 0.142 0.018 0.21l-0.001-0.007c0.007 0.058 0.018 0.108 0.031 0.158l-0.002-0.008c0.051 0.223 0.158 0.417 0.306 0.571l-0-0 5 5.001c0.226 0.226 0.539 0.366 0.884 0.366 0.691 0 1.251-0.56 1.251-1.251 0-0.346-0.14-0.658-0.367-0.885l-2.866-2.865h18.982c0.69 0 1.25-0.56 1.25-1.25s-0.56-1.25-1.25-1.25v0zM30 0.75c-0.69 0-1.25 0.56-1.25 1.25v28c0 0.69 0.56 1.25 1.25 1.25s1.25-0.56 1.25-1.25v0-28c-0-0.69-0.56-1.25-1.25-1.25h-0z" }) }) }),
                /* @__PURE__ */ t.jsx("div", { className: "text-white", children: /* @__PURE__ */ t.jsx("span", { className: "badge bg-primary", children: q }) })
              ] })
            ] }),
            /* @__PURE__ */ t.jsx(Re, { fref: $, onClick: _e, isDragging: j, progress: ve, onDrag: Me }),
            /* @__PURE__ */ t.jsxs("div", { className: "player-bar", children: [
              /* @__PURE__ */ t.jsx("button", { "aria-label": x("Play or Pause"), "data-bs-toggle": "tooltip", "data-bs-placement": "top", className: "player-btn", onClick: xe, children: B ? /* @__PURE__ */ t.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: 32, height: 32, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", className: "lucide lucide-square-icon lucide-square", children: /* @__PURE__ */ t.jsx("rect", { width: 18, height: 18, x: 3, y: 3, rx: 2 }) }) : /* @__PURE__ */ t.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: 32, height: 32, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", className: "lucide lucide-play-icon lucide-play", children: /* @__PURE__ */ t.jsx("path", { d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" }) }) }),
              l && l?.length > 0 && /* @__PURE__ */ t.jsx("button", { "data-bs-toggle": "tooltip", "data-bs-placement": "top", title: x("Subtitles"), className: "player-btn", onClick: () => ie(!ae), children: /* @__PURE__ */ t.jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: 32, height: 32, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", className: "lucide lucide-closed-caption-icon lucide-closed-caption", children: [
                /* @__PURE__ */ t.jsx("path", { d: "M10 9.17a3 3 0 1 0 0 5.66" }),
                /* @__PURE__ */ t.jsx("path", { d: "M17 9.17a3 3 0 1 0 0 5.66" }),
                /* @__PURE__ */ t.jsx("rect", { x: 2, y: 5, width: 20, height: 14, rx: 2 })
              ] }) }),
              /* @__PURE__ */ t.jsxs("div", { className: "player-right-side", children: [
                /* @__PURE__ */ t.jsxs("div", { className: "player-sound-wrapper", children: [
                  le > 0 ? /* @__PURE__ */ t.jsx("button", { className: "player-btn", "aria-label": x("Mute"), onClick: () => ce(0), children: /* @__PURE__ */ t.jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: 28, height: 28, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", className: "lucide lucide-volume2-icon lucide-volume-2", children: [
                    /* @__PURE__ */ t.jsx("path", { d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" }),
                    /* @__PURE__ */ t.jsx("path", { d: "M16 9a5 5 0 0 1 0 6" }),
                    /* @__PURE__ */ t.jsx("path", { d: "M19.364 18.364a9 9 0 0 0 0-12.728" })
                  ] }) }) : /* @__PURE__ */ t.jsx("button", { className: "player-btn", "aria-label": x("Unmute"), onClick: () => ce(100), children: /* @__PURE__ */ t.jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: 28, height: 28, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", className: "lucide lucide-volume-off-icon lucide-volume-off", children: [
                    /* @__PURE__ */ t.jsx("path", { d: "M16 9a5 5 0 0 1 .95 2.293" }),
                    /* @__PURE__ */ t.jsx("path", { d: "M19.364 5.636a9 9 0 0 1 1.889 9.96" }),
                    /* @__PURE__ */ t.jsx("path", { d: "m2 2 20 20" }),
                    /* @__PURE__ */ t.jsx("path", { d: "m7 7-.587.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298V11" }),
                    /* @__PURE__ */ t.jsx("path", { d: "M9.828 4.172A.686.686 0 0 1 11 4.657v.686" })
                  ] }) }),
                  /* @__PURE__ */ t.jsx(
                    Re,
                    {
                      fref: re,
                      progress: le,
                      onClick: (e) => {
                        const n = ye(e.clientX);
                        ce(n * 100), i.current && (i.current.volume = n);
                      },
                      onDrag: Pe,
                      width: 100
                    }
                  )
                ] }),
                /* @__PURE__ */ t.jsxs("span", { className: "player-time", children: [
                  Ne(ge),
                  " - ",
                  Ne(z)
                ] }),
                /* @__PURE__ */ t.jsx("button", { className: "player-btn", onClick: Ae, "aria-label": x("Fullscreen"), children: /* @__PURE__ */ t.jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: 32, height: 32, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", className: "lucide lucide-fullscreen-icon lucide-fullscreen", children: [
                  /* @__PURE__ */ t.jsx("path", { d: "M3 7V5a2 2 0 0 1 2-2h2" }),
                  /* @__PURE__ */ t.jsx("path", { d: "M17 3h2a2 2 0 0 1 2 2v2" }),
                  /* @__PURE__ */ t.jsx("path", { d: "M21 17v2a2 2 0 0 1-2 2h-2" }),
                  /* @__PURE__ */ t.jsx("path", { d: "M7 21H5a2 2 0 0 1-2-2v-2" }),
                  /* @__PURE__ */ t.jsx("rect", { width: 10, height: 8, x: 7, y: 8, rx: 1 })
                ] }) })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ t.jsxs("div", { className: `player-subtitles ${ae ? "" : "d-none"}`, children: [
          /* @__PURE__ */ t.jsx("strong", { children: x("Select Subtitle") }),
          /* @__PURE__ */ t.jsx("ul", { children: l?.map((e) => /* @__PURE__ */ t.jsx(qe, { lang: h, subtitle: e, selectSubtitle: Z, activeSubtitle: he }, e?.id)) })
        ] })
      ]
    }
  );
}
export {
  Ge as ReactPlayerCC,
  Ge as default
};
