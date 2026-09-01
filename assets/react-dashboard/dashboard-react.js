var wj = Object.defineProperty;
var Sj = (e, t, r) => t in e ? wj(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var ss = (e, t, r) => Sj(e, typeof t != "symbol" ? t + "" : t, r);
function Pj(e, t) {
  for (var r = 0; r < t.length; r++) {
    const n = t[r];
    if (typeof n != "string" && !Array.isArray(n)) {
      for (const a in n)
        if (a !== "default" && !(a in e)) {
          const l = Object.getOwnPropertyDescriptor(n, a);
          l && Object.defineProperty(e, a, l.get ? l : {
            enumerable: !0,
            get: () => n[a]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }));
}
function NS(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var mv = { exports: {} }, tl = {}, yv = { exports: {} }, Ee = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ux;
function Aj() {
  if (ux) return Ee;
  ux = 1;
  var e = Symbol.for("react.element"), t = Symbol.for("react.portal"), r = Symbol.for("react.fragment"), n = Symbol.for("react.strict_mode"), a = Symbol.for("react.profiler"), l = Symbol.for("react.provider"), u = Symbol.for("react.context"), c = Symbol.for("react.forward_ref"), f = Symbol.for("react.suspense"), d = Symbol.for("react.memo"), h = Symbol.for("react.lazy"), p = Symbol.iterator;
  function y(D) {
    return D === null || typeof D != "object" ? null : (D = p && D[p] || D["@@iterator"], typeof D == "function" ? D : null);
  }
  var b = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, w = Object.assign, P = {};
  function S(D, H, ve) {
    this.props = D, this.context = H, this.refs = P, this.updater = ve || b;
  }
  S.prototype.isReactComponent = {}, S.prototype.setState = function(D, H) {
    if (typeof D != "object" && typeof D != "function" && D != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, D, H, "setState");
  }, S.prototype.forceUpdate = function(D) {
    this.updater.enqueueForceUpdate(this, D, "forceUpdate");
  };
  function O() {
  }
  O.prototype = S.prototype;
  function k(D, H, ve) {
    this.props = D, this.context = H, this.refs = P, this.updater = ve || b;
  }
  var I = k.prototype = new O();
  I.constructor = k, w(I, S.prototype), I.isPureReactComponent = !0;
  var E = Array.isArray, _ = Object.prototype.hasOwnProperty, C = { current: null }, R = { key: !0, ref: !0, __self: !0, __source: !0 };
  function W(D, H, ve) {
    var ye, Pe = {}, Ae = null, Oe = null;
    if (H != null) for (ye in H.ref !== void 0 && (Oe = H.ref), H.key !== void 0 && (Ae = "" + H.key), H) _.call(H, ye) && !R.hasOwnProperty(ye) && (Pe[ye] = H[ye]);
    var ke = arguments.length - 2;
    if (ke === 1) Pe.children = ve;
    else if (1 < ke) {
      for (var J = Array(ke), me = 0; me < ke; me++) J[me] = arguments[me + 2];
      Pe.children = J;
    }
    if (D && D.defaultProps) for (ye in ke = D.defaultProps, ke) Pe[ye] === void 0 && (Pe[ye] = ke[ye]);
    return { $$typeof: e, type: D, key: Ae, ref: Oe, props: Pe, _owner: C.current };
  }
  function V(D, H) {
    return { $$typeof: e, type: D.type, key: H, ref: D.ref, props: D.props, _owner: D._owner };
  }
  function K(D) {
    return typeof D == "object" && D !== null && D.$$typeof === e;
  }
  function G(D) {
    var H = { "=": "=0", ":": "=2" };
    return "$" + D.replace(/[=:]/g, function(ve) {
      return H[ve];
    });
  }
  var F = /\/+/g;
  function ie(D, H) {
    return typeof D == "object" && D !== null && D.key != null ? G("" + D.key) : H.toString(36);
  }
  function re(D, H, ve, ye, Pe) {
    var Ae = typeof D;
    (Ae === "undefined" || Ae === "boolean") && (D = null);
    var Oe = !1;
    if (D === null) Oe = !0;
    else switch (Ae) {
      case "string":
      case "number":
        Oe = !0;
        break;
      case "object":
        switch (D.$$typeof) {
          case e:
          case t:
            Oe = !0;
        }
    }
    if (Oe) return Oe = D, Pe = Pe(Oe), D = ye === "" ? "." + ie(Oe, 0) : ye, E(Pe) ? (ve = "", D != null && (ve = D.replace(F, "$&/") + "/"), re(Pe, H, ve, "", function(me) {
      return me;
    })) : Pe != null && (K(Pe) && (Pe = V(Pe, ve + (!Pe.key || Oe && Oe.key === Pe.key ? "" : ("" + Pe.key).replace(F, "$&/") + "/") + D)), H.push(Pe)), 1;
    if (Oe = 0, ye = ye === "" ? "." : ye + ":", E(D)) for (var ke = 0; ke < D.length; ke++) {
      Ae = D[ke];
      var J = ye + ie(Ae, ke);
      Oe += re(Ae, H, ve, J, Pe);
    }
    else if (J = y(D), typeof J == "function") for (D = J.call(D), ke = 0; !(Ae = D.next()).done; ) Ae = Ae.value, J = ye + ie(Ae, ke++), Oe += re(Ae, H, ve, J, Pe);
    else if (Ae === "object") throw H = String(D), Error("Objects are not valid as a React child (found: " + (H === "[object Object]" ? "object with keys {" + Object.keys(D).join(", ") + "}" : H) + "). If you meant to render a collection of children, use an array instead.");
    return Oe;
  }
  function ne(D, H, ve) {
    if (D == null) return D;
    var ye = [], Pe = 0;
    return re(D, ye, "", "", function(Ae) {
      return H.call(ve, Ae, Pe++);
    }), ye;
  }
  function fe(D) {
    if (D._status === -1) {
      var H = D._result;
      H = H(), H.then(function(ve) {
        (D._status === 0 || D._status === -1) && (D._status = 1, D._result = ve);
      }, function(ve) {
        (D._status === 0 || D._status === -1) && (D._status = 2, D._result = ve);
      }), D._status === -1 && (D._status = 0, D._result = H);
    }
    if (D._status === 1) return D._result.default;
    throw D._result;
  }
  var ae = { current: null }, U = { transition: null }, ee = { ReactCurrentDispatcher: ae, ReactCurrentBatchConfig: U, ReactCurrentOwner: C };
  function Y() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return Ee.Children = { map: ne, forEach: function(D, H, ve) {
    ne(D, function() {
      H.apply(this, arguments);
    }, ve);
  }, count: function(D) {
    var H = 0;
    return ne(D, function() {
      H++;
    }), H;
  }, toArray: function(D) {
    return ne(D, function(H) {
      return H;
    }) || [];
  }, only: function(D) {
    if (!K(D)) throw Error("React.Children.only expected to receive a single React element child.");
    return D;
  } }, Ee.Component = S, Ee.Fragment = r, Ee.Profiler = a, Ee.PureComponent = k, Ee.StrictMode = n, Ee.Suspense = f, Ee.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ee, Ee.act = Y, Ee.cloneElement = function(D, H, ve) {
    if (D == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + D + ".");
    var ye = w({}, D.props), Pe = D.key, Ae = D.ref, Oe = D._owner;
    if (H != null) {
      if (H.ref !== void 0 && (Ae = H.ref, Oe = C.current), H.key !== void 0 && (Pe = "" + H.key), D.type && D.type.defaultProps) var ke = D.type.defaultProps;
      for (J in H) _.call(H, J) && !R.hasOwnProperty(J) && (ye[J] = H[J] === void 0 && ke !== void 0 ? ke[J] : H[J]);
    }
    var J = arguments.length - 2;
    if (J === 1) ye.children = ve;
    else if (1 < J) {
      ke = Array(J);
      for (var me = 0; me < J; me++) ke[me] = arguments[me + 2];
      ye.children = ke;
    }
    return { $$typeof: e, type: D.type, key: Pe, ref: Ae, props: ye, _owner: Oe };
  }, Ee.createContext = function(D) {
    return D = { $$typeof: u, _currentValue: D, _currentValue2: D, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, D.Provider = { $$typeof: l, _context: D }, D.Consumer = D;
  }, Ee.createElement = W, Ee.createFactory = function(D) {
    var H = W.bind(null, D);
    return H.type = D, H;
  }, Ee.createRef = function() {
    return { current: null };
  }, Ee.forwardRef = function(D) {
    return { $$typeof: c, render: D };
  }, Ee.isValidElement = K, Ee.lazy = function(D) {
    return { $$typeof: h, _payload: { _status: -1, _result: D }, _init: fe };
  }, Ee.memo = function(D, H) {
    return { $$typeof: d, type: D, compare: H === void 0 ? null : H };
  }, Ee.startTransition = function(D) {
    var H = U.transition;
    U.transition = {};
    try {
      D();
    } finally {
      U.transition = H;
    }
  }, Ee.unstable_act = Y, Ee.useCallback = function(D, H) {
    return ae.current.useCallback(D, H);
  }, Ee.useContext = function(D) {
    return ae.current.useContext(D);
  }, Ee.useDebugValue = function() {
  }, Ee.useDeferredValue = function(D) {
    return ae.current.useDeferredValue(D);
  }, Ee.useEffect = function(D, H) {
    return ae.current.useEffect(D, H);
  }, Ee.useId = function() {
    return ae.current.useId();
  }, Ee.useImperativeHandle = function(D, H, ve) {
    return ae.current.useImperativeHandle(D, H, ve);
  }, Ee.useInsertionEffect = function(D, H) {
    return ae.current.useInsertionEffect(D, H);
  }, Ee.useLayoutEffect = function(D, H) {
    return ae.current.useLayoutEffect(D, H);
  }, Ee.useMemo = function(D, H) {
    return ae.current.useMemo(D, H);
  }, Ee.useReducer = function(D, H, ve) {
    return ae.current.useReducer(D, H, ve);
  }, Ee.useRef = function(D) {
    return ae.current.useRef(D);
  }, Ee.useState = function(D) {
    return ae.current.useState(D);
  }, Ee.useSyncExternalStore = function(D, H, ve) {
    return ae.current.useSyncExternalStore(D, H, ve);
  }, Ee.useTransition = function() {
    return ae.current.useTransition();
  }, Ee.version = "18.3.1", Ee;
}
var sx;
function eo() {
  return sx || (sx = 1, yv.exports = Aj()), yv.exports;
}
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var cx;
function Oj() {
  if (cx) return tl;
  cx = 1;
  var e = eo(), t = Symbol.for("react.element"), r = Symbol.for("react.fragment"), n = Object.prototype.hasOwnProperty, a = e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, l = { key: !0, ref: !0, __self: !0, __source: !0 };
  function u(c, f, d) {
    var h, p = {}, y = null, b = null;
    d !== void 0 && (y = "" + d), f.key !== void 0 && (y = "" + f.key), f.ref !== void 0 && (b = f.ref);
    for (h in f) n.call(f, h) && !l.hasOwnProperty(h) && (p[h] = f[h]);
    if (c && c.defaultProps) for (h in f = c.defaultProps, f) p[h] === void 0 && (p[h] = f[h]);
    return { $$typeof: t, type: c, key: y, ref: b, props: p, _owner: a.current };
  }
  return tl.Fragment = r, tl.jsx = u, tl.jsxs = u, tl;
}
var fx;
function Ej() {
  return fx || (fx = 1, mv.exports = Oj()), mv.exports;
}
var N = Ej(), x = eo();
const kj = /* @__PURE__ */ NS(x), Cj = /* @__PURE__ */ Pj({
  __proto__: null,
  default: kj
}, [x]);
var cs = {}, gv = { exports: {} }, tr = {}, xv = { exports: {} }, bv = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var dx;
function Ij() {
  return dx || (dx = 1, (function(e) {
    function t(U, ee) {
      var Y = U.length;
      U.push(ee);
      e: for (; 0 < Y; ) {
        var D = Y - 1 >>> 1, H = U[D];
        if (0 < a(H, ee)) U[D] = ee, U[Y] = H, Y = D;
        else break e;
      }
    }
    function r(U) {
      return U.length === 0 ? null : U[0];
    }
    function n(U) {
      if (U.length === 0) return null;
      var ee = U[0], Y = U.pop();
      if (Y !== ee) {
        U[0] = Y;
        e: for (var D = 0, H = U.length, ve = H >>> 1; D < ve; ) {
          var ye = 2 * (D + 1) - 1, Pe = U[ye], Ae = ye + 1, Oe = U[Ae];
          if (0 > a(Pe, Y)) Ae < H && 0 > a(Oe, Pe) ? (U[D] = Oe, U[Ae] = Y, D = Ae) : (U[D] = Pe, U[ye] = Y, D = ye);
          else if (Ae < H && 0 > a(Oe, Y)) U[D] = Oe, U[Ae] = Y, D = Ae;
          else break e;
        }
      }
      return ee;
    }
    function a(U, ee) {
      var Y = U.sortIndex - ee.sortIndex;
      return Y !== 0 ? Y : U.id - ee.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var l = performance;
      e.unstable_now = function() {
        return l.now();
      };
    } else {
      var u = Date, c = u.now();
      e.unstable_now = function() {
        return u.now() - c;
      };
    }
    var f = [], d = [], h = 1, p = null, y = 3, b = !1, w = !1, P = !1, S = typeof setTimeout == "function" ? setTimeout : null, O = typeof clearTimeout == "function" ? clearTimeout : null, k = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function I(U) {
      for (var ee = r(d); ee !== null; ) {
        if (ee.callback === null) n(d);
        else if (ee.startTime <= U) n(d), ee.sortIndex = ee.expirationTime, t(f, ee);
        else break;
        ee = r(d);
      }
    }
    function E(U) {
      if (P = !1, I(U), !w) if (r(f) !== null) w = !0, fe(_);
      else {
        var ee = r(d);
        ee !== null && ae(E, ee.startTime - U);
      }
    }
    function _(U, ee) {
      w = !1, P && (P = !1, O(W), W = -1), b = !0;
      var Y = y;
      try {
        for (I(ee), p = r(f); p !== null && (!(p.expirationTime > ee) || U && !G()); ) {
          var D = p.callback;
          if (typeof D == "function") {
            p.callback = null, y = p.priorityLevel;
            var H = D(p.expirationTime <= ee);
            ee = e.unstable_now(), typeof H == "function" ? p.callback = H : p === r(f) && n(f), I(ee);
          } else n(f);
          p = r(f);
        }
        if (p !== null) var ve = !0;
        else {
          var ye = r(d);
          ye !== null && ae(E, ye.startTime - ee), ve = !1;
        }
        return ve;
      } finally {
        p = null, y = Y, b = !1;
      }
    }
    var C = !1, R = null, W = -1, V = 5, K = -1;
    function G() {
      return !(e.unstable_now() - K < V);
    }
    function F() {
      if (R !== null) {
        var U = e.unstable_now();
        K = U;
        var ee = !0;
        try {
          ee = R(!0, U);
        } finally {
          ee ? ie() : (C = !1, R = null);
        }
      } else C = !1;
    }
    var ie;
    if (typeof k == "function") ie = function() {
      k(F);
    };
    else if (typeof MessageChannel < "u") {
      var re = new MessageChannel(), ne = re.port2;
      re.port1.onmessage = F, ie = function() {
        ne.postMessage(null);
      };
    } else ie = function() {
      S(F, 0);
    };
    function fe(U) {
      R = U, C || (C = !0, ie());
    }
    function ae(U, ee) {
      W = S(function() {
        U(e.unstable_now());
      }, ee);
    }
    e.unstable_IdlePriority = 5, e.unstable_ImmediatePriority = 1, e.unstable_LowPriority = 4, e.unstable_NormalPriority = 3, e.unstable_Profiling = null, e.unstable_UserBlockingPriority = 2, e.unstable_cancelCallback = function(U) {
      U.callback = null;
    }, e.unstable_continueExecution = function() {
      w || b || (w = !0, fe(_));
    }, e.unstable_forceFrameRate = function(U) {
      0 > U || 125 < U ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : V = 0 < U ? Math.floor(1e3 / U) : 5;
    }, e.unstable_getCurrentPriorityLevel = function() {
      return y;
    }, e.unstable_getFirstCallbackNode = function() {
      return r(f);
    }, e.unstable_next = function(U) {
      switch (y) {
        case 1:
        case 2:
        case 3:
          var ee = 3;
          break;
        default:
          ee = y;
      }
      var Y = y;
      y = ee;
      try {
        return U();
      } finally {
        y = Y;
      }
    }, e.unstable_pauseExecution = function() {
    }, e.unstable_requestPaint = function() {
    }, e.unstable_runWithPriority = function(U, ee) {
      switch (U) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          U = 3;
      }
      var Y = y;
      y = U;
      try {
        return ee();
      } finally {
        y = Y;
      }
    }, e.unstable_scheduleCallback = function(U, ee, Y) {
      var D = e.unstable_now();
      switch (typeof Y == "object" && Y !== null ? (Y = Y.delay, Y = typeof Y == "number" && 0 < Y ? D + Y : D) : Y = D, U) {
        case 1:
          var H = -1;
          break;
        case 2:
          H = 250;
          break;
        case 5:
          H = 1073741823;
          break;
        case 4:
          H = 1e4;
          break;
        default:
          H = 5e3;
      }
      return H = Y + H, U = { id: h++, callback: ee, priorityLevel: U, startTime: Y, expirationTime: H, sortIndex: -1 }, Y > D ? (U.sortIndex = Y, t(d, U), r(f) === null && U === r(d) && (P ? (O(W), W = -1) : P = !0, ae(E, Y - D))) : (U.sortIndex = H, t(f, U), w || b || (w = !0, fe(_))), U;
    }, e.unstable_shouldYield = G, e.unstable_wrapCallback = function(U) {
      var ee = y;
      return function() {
        var Y = y;
        y = ee;
        try {
          return U.apply(this, arguments);
        } finally {
          y = Y;
        }
      };
    };
  })(bv)), bv;
}
var vx;
function jj() {
  return vx || (vx = 1, xv.exports = Ij()), xv.exports;
}
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hx;
function _j() {
  if (hx) return tr;
  hx = 1;
  var e = eo(), t = jj();
  function r(i) {
    for (var o = "https://reactjs.org/docs/error-decoder.html?invariant=" + i, s = 1; s < arguments.length; s++) o += "&args[]=" + encodeURIComponent(arguments[s]);
    return "Minified React error #" + i + "; visit " + o + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var n = /* @__PURE__ */ new Set(), a = {};
  function l(i, o) {
    u(i, o), u(i + "Capture", o);
  }
  function u(i, o) {
    for (a[i] = o, i = 0; i < o.length; i++) n.add(o[i]);
  }
  var c = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), f = Object.prototype.hasOwnProperty, d = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, h = {}, p = {};
  function y(i) {
    return f.call(p, i) ? !0 : f.call(h, i) ? !1 : d.test(i) ? p[i] = !0 : (h[i] = !0, !1);
  }
  function b(i, o, s, v) {
    if (s !== null && s.type === 0) return !1;
    switch (typeof o) {
      case "function":
      case "symbol":
        return !0;
      case "boolean":
        return v ? !1 : s !== null ? !s.acceptsBooleans : (i = i.toLowerCase().slice(0, 5), i !== "data-" && i !== "aria-");
      default:
        return !1;
    }
  }
  function w(i, o, s, v) {
    if (o === null || typeof o > "u" || b(i, o, s, v)) return !0;
    if (v) return !1;
    if (s !== null) switch (s.type) {
      case 3:
        return !o;
      case 4:
        return o === !1;
      case 5:
        return isNaN(o);
      case 6:
        return isNaN(o) || 1 > o;
    }
    return !1;
  }
  function P(i, o, s, v, m, g, A) {
    this.acceptsBooleans = o === 2 || o === 3 || o === 4, this.attributeName = v, this.attributeNamespace = m, this.mustUseProperty = s, this.propertyName = i, this.type = o, this.sanitizeURL = g, this.removeEmptyString = A;
  }
  var S = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(i) {
    S[i] = new P(i, 0, !1, i, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(i) {
    var o = i[0];
    S[o] = new P(o, 1, !1, i[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(i) {
    S[i] = new P(i, 2, !1, i.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(i) {
    S[i] = new P(i, 2, !1, i, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(i) {
    S[i] = new P(i, 3, !1, i.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(i) {
    S[i] = new P(i, 3, !0, i, null, !1, !1);
  }), ["capture", "download"].forEach(function(i) {
    S[i] = new P(i, 4, !1, i, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(i) {
    S[i] = new P(i, 6, !1, i, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(i) {
    S[i] = new P(i, 5, !1, i.toLowerCase(), null, !1, !1);
  });
  var O = /[\-:]([a-z])/g;
  function k(i) {
    return i[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(i) {
    var o = i.replace(
      O,
      k
    );
    S[o] = new P(o, 1, !1, i, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(i) {
    var o = i.replace(O, k);
    S[o] = new P(o, 1, !1, i, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(i) {
    var o = i.replace(O, k);
    S[o] = new P(o, 1, !1, i, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(i) {
    S[i] = new P(i, 1, !1, i.toLowerCase(), null, !1, !1);
  }), S.xlinkHref = new P("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(i) {
    S[i] = new P(i, 1, !1, i.toLowerCase(), null, !0, !0);
  });
  function I(i, o, s, v) {
    var m = S.hasOwnProperty(o) ? S[o] : null;
    (m !== null ? m.type !== 0 : v || !(2 < o.length) || o[0] !== "o" && o[0] !== "O" || o[1] !== "n" && o[1] !== "N") && (w(o, s, m, v) && (s = null), v || m === null ? y(o) && (s === null ? i.removeAttribute(o) : i.setAttribute(o, "" + s)) : m.mustUseProperty ? i[m.propertyName] = s === null ? m.type === 3 ? !1 : "" : s : (o = m.attributeName, v = m.attributeNamespace, s === null ? i.removeAttribute(o) : (m = m.type, s = m === 3 || m === 4 && s === !0 ? "" : "" + s, v ? i.setAttributeNS(v, o, s) : i.setAttribute(o, s))));
  }
  var E = e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, _ = Symbol.for("react.element"), C = Symbol.for("react.portal"), R = Symbol.for("react.fragment"), W = Symbol.for("react.strict_mode"), V = Symbol.for("react.profiler"), K = Symbol.for("react.provider"), G = Symbol.for("react.context"), F = Symbol.for("react.forward_ref"), ie = Symbol.for("react.suspense"), re = Symbol.for("react.suspense_list"), ne = Symbol.for("react.memo"), fe = Symbol.for("react.lazy"), ae = Symbol.for("react.offscreen"), U = Symbol.iterator;
  function ee(i) {
    return i === null || typeof i != "object" ? null : (i = U && i[U] || i["@@iterator"], typeof i == "function" ? i : null);
  }
  var Y = Object.assign, D;
  function H(i) {
    if (D === void 0) try {
      throw Error();
    } catch (s) {
      var o = s.stack.trim().match(/\n( *(at )?)/);
      D = o && o[1] || "";
    }
    return `
` + D + i;
  }
  var ve = !1;
  function ye(i, o) {
    if (!i || ve) return "";
    ve = !0;
    var s = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      if (o) if (o = function() {
        throw Error();
      }, Object.defineProperty(o.prototype, "props", { set: function() {
        throw Error();
      } }), typeof Reflect == "object" && Reflect.construct) {
        try {
          Reflect.construct(o, []);
        } catch (B) {
          var v = B;
        }
        Reflect.construct(i, [], o);
      } else {
        try {
          o.call();
        } catch (B) {
          v = B;
        }
        i.call(o.prototype);
      }
      else {
        try {
          throw Error();
        } catch (B) {
          v = B;
        }
        i();
      }
    } catch (B) {
      if (B && v && typeof B.stack == "string") {
        for (var m = B.stack.split(`
`), g = v.stack.split(`
`), A = m.length - 1, j = g.length - 1; 1 <= A && 0 <= j && m[A] !== g[j]; ) j--;
        for (; 1 <= A && 0 <= j; A--, j--) if (m[A] !== g[j]) {
          if (A !== 1 || j !== 1)
            do
              if (A--, j--, 0 > j || m[A] !== g[j]) {
                var T = `
` + m[A].replace(" at new ", " at ");
                return i.displayName && T.includes("<anonymous>") && (T = T.replace("<anonymous>", i.displayName)), T;
              }
            while (1 <= A && 0 <= j);
          break;
        }
      }
    } finally {
      ve = !1, Error.prepareStackTrace = s;
    }
    return (i = i ? i.displayName || i.name : "") ? H(i) : "";
  }
  function Pe(i) {
    switch (i.tag) {
      case 5:
        return H(i.type);
      case 16:
        return H("Lazy");
      case 13:
        return H("Suspense");
      case 19:
        return H("SuspenseList");
      case 0:
      case 2:
      case 15:
        return i = ye(i.type, !1), i;
      case 11:
        return i = ye(i.type.render, !1), i;
      case 1:
        return i = ye(i.type, !0), i;
      default:
        return "";
    }
  }
  function Ae(i) {
    if (i == null) return null;
    if (typeof i == "function") return i.displayName || i.name || null;
    if (typeof i == "string") return i;
    switch (i) {
      case R:
        return "Fragment";
      case C:
        return "Portal";
      case V:
        return "Profiler";
      case W:
        return "StrictMode";
      case ie:
        return "Suspense";
      case re:
        return "SuspenseList";
    }
    if (typeof i == "object") switch (i.$$typeof) {
      case G:
        return (i.displayName || "Context") + ".Consumer";
      case K:
        return (i._context.displayName || "Context") + ".Provider";
      case F:
        var o = i.render;
        return i = i.displayName, i || (i = o.displayName || o.name || "", i = i !== "" ? "ForwardRef(" + i + ")" : "ForwardRef"), i;
      case ne:
        return o = i.displayName || null, o !== null ? o : Ae(i.type) || "Memo";
      case fe:
        o = i._payload, i = i._init;
        try {
          return Ae(i(o));
        } catch {
        }
    }
    return null;
  }
  function Oe(i) {
    var o = i.type;
    switch (i.tag) {
      case 24:
        return "Cache";
      case 9:
        return (o.displayName || "Context") + ".Consumer";
      case 10:
        return (o._context.displayName || "Context") + ".Provider";
      case 18:
        return "DehydratedFragment";
      case 11:
        return i = o.render, i = i.displayName || i.name || "", o.displayName || (i !== "" ? "ForwardRef(" + i + ")" : "ForwardRef");
      case 7:
        return "Fragment";
      case 5:
        return o;
      case 4:
        return "Portal";
      case 3:
        return "Root";
      case 6:
        return "Text";
      case 16:
        return Ae(o);
      case 8:
        return o === W ? "StrictMode" : "Mode";
      case 22:
        return "Offscreen";
      case 12:
        return "Profiler";
      case 21:
        return "Scope";
      case 13:
        return "Suspense";
      case 19:
        return "SuspenseList";
      case 25:
        return "TracingMarker";
      case 1:
      case 0:
      case 17:
      case 2:
      case 14:
      case 15:
        if (typeof o == "function") return o.displayName || o.name || null;
        if (typeof o == "string") return o;
    }
    return null;
  }
  function ke(i) {
    switch (typeof i) {
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return i;
      case "object":
        return i;
      default:
        return "";
    }
  }
  function J(i) {
    var o = i.type;
    return (i = i.nodeName) && i.toLowerCase() === "input" && (o === "checkbox" || o === "radio");
  }
  function me(i) {
    var o = J(i) ? "checked" : "value", s = Object.getOwnPropertyDescriptor(i.constructor.prototype, o), v = "" + i[o];
    if (!i.hasOwnProperty(o) && typeof s < "u" && typeof s.get == "function" && typeof s.set == "function") {
      var m = s.get, g = s.set;
      return Object.defineProperty(i, o, { configurable: !0, get: function() {
        return m.call(this);
      }, set: function(A) {
        v = "" + A, g.call(this, A);
      } }), Object.defineProperty(i, o, { enumerable: s.enumerable }), { getValue: function() {
        return v;
      }, setValue: function(A) {
        v = "" + A;
      }, stopTracking: function() {
        i._valueTracker = null, delete i[o];
      } };
    }
  }
  function we(i) {
    i._valueTracker || (i._valueTracker = me(i));
  }
  function Z(i) {
    if (!i) return !1;
    var o = i._valueTracker;
    if (!o) return !0;
    var s = o.getValue(), v = "";
    return i && (v = J(i) ? i.checked ? "true" : "false" : i.value), i = v, i !== s ? (o.setValue(i), !0) : !1;
  }
  function at(i) {
    if (i = i || (typeof document < "u" ? document : void 0), typeof i > "u") return null;
    try {
      return i.activeElement || i.body;
    } catch {
      return i.body;
    }
  }
  function _e(i, o) {
    var s = o.checked;
    return Y({}, o, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: s ?? i._wrapperState.initialChecked });
  }
  function be(i, o) {
    var s = o.defaultValue == null ? "" : o.defaultValue, v = o.checked != null ? o.checked : o.defaultChecked;
    s = ke(o.value != null ? o.value : s), i._wrapperState = { initialChecked: v, initialValue: s, controlled: o.type === "checkbox" || o.type === "radio" ? o.checked != null : o.value != null };
  }
  function Nt(i, o) {
    o = o.checked, o != null && I(i, "checked", o, !1);
  }
  function Tr(i, o) {
    Nt(i, o);
    var s = ke(o.value), v = o.type;
    if (s != null) v === "number" ? (s === 0 && i.value === "" || i.value != s) && (i.value = "" + s) : i.value !== "" + s && (i.value = "" + s);
    else if (v === "submit" || v === "reset") {
      i.removeAttribute("value");
      return;
    }
    o.hasOwnProperty("value") ? Of(i, o.type, s) : o.hasOwnProperty("defaultValue") && Of(i, o.type, ke(o.defaultValue)), o.checked == null && o.defaultChecked != null && (i.defaultChecked = !!o.defaultChecked);
  }
  function po(i, o, s) {
    if (o.hasOwnProperty("value") || o.hasOwnProperty("defaultValue")) {
      var v = o.type;
      if (!(v !== "submit" && v !== "reset" || o.value !== void 0 && o.value !== null)) return;
      o = "" + i._wrapperState.initialValue, s || o === i.value || (i.value = o), i.defaultValue = o;
    }
    s = i.name, s !== "" && (i.name = ""), i.defaultChecked = !!i._wrapperState.initialChecked, s !== "" && (i.name = s);
  }
  function Of(i, o, s) {
    (o !== "number" || at(i.ownerDocument) !== i) && (s == null ? i.defaultValue = "" + i._wrapperState.initialValue : i.defaultValue !== "" + s && (i.defaultValue = "" + s));
  }
  var mo = Array.isArray;
  function oa(i, o, s, v) {
    if (i = i.options, o) {
      o = {};
      for (var m = 0; m < s.length; m++) o["$" + s[m]] = !0;
      for (s = 0; s < i.length; s++) m = o.hasOwnProperty("$" + i[s].value), i[s].selected !== m && (i[s].selected = m), m && v && (i[s].defaultSelected = !0);
    } else {
      for (s = "" + ke(s), o = null, m = 0; m < i.length; m++) {
        if (i[m].value === s) {
          i[m].selected = !0, v && (i[m].defaultSelected = !0);
          return;
        }
        o !== null || i[m].disabled || (o = i[m]);
      }
      o !== null && (o.selected = !0);
    }
  }
  function Ef(i, o) {
    if (o.dangerouslySetInnerHTML != null) throw Error(r(91));
    return Y({}, o, { value: void 0, defaultValue: void 0, children: "" + i._wrapperState.initialValue });
  }
  function gy(i, o) {
    var s = o.value;
    if (s == null) {
      if (s = o.children, o = o.defaultValue, s != null) {
        if (o != null) throw Error(r(92));
        if (mo(s)) {
          if (1 < s.length) throw Error(r(93));
          s = s[0];
        }
        o = s;
      }
      o == null && (o = ""), s = o;
    }
    i._wrapperState = { initialValue: ke(s) };
  }
  function xy(i, o) {
    var s = ke(o.value), v = ke(o.defaultValue);
    s != null && (s = "" + s, s !== i.value && (i.value = s), o.defaultValue == null && i.defaultValue !== s && (i.defaultValue = s)), v != null && (i.defaultValue = "" + v);
  }
  function by(i) {
    var o = i.textContent;
    o === i._wrapperState.initialValue && o !== "" && o !== null && (i.value = o);
  }
  function wy(i) {
    switch (i) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function kf(i, o) {
    return i == null || i === "http://www.w3.org/1999/xhtml" ? wy(o) : i === "http://www.w3.org/2000/svg" && o === "foreignObject" ? "http://www.w3.org/1999/xhtml" : i;
  }
  var tu, Sy = (function(i) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(o, s, v, m) {
      MSApp.execUnsafeLocalFunction(function() {
        return i(o, s, v, m);
      });
    } : i;
  })(function(i, o) {
    if (i.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in i) i.innerHTML = o;
    else {
      for (tu = tu || document.createElement("div"), tu.innerHTML = "<svg>" + o.valueOf().toString() + "</svg>", o = tu.firstChild; i.firstChild; ) i.removeChild(i.firstChild);
      for (; o.firstChild; ) i.appendChild(o.firstChild);
    }
  });
  function yo(i, o) {
    if (o) {
      var s = i.firstChild;
      if (s && s === i.lastChild && s.nodeType === 3) {
        s.nodeValue = o;
        return;
      }
    }
    i.textContent = o;
  }
  var go = {
    animationIterationCount: !0,
    aspectRatio: !0,
    borderImageOutset: !0,
    borderImageSlice: !0,
    borderImageWidth: !0,
    boxFlex: !0,
    boxFlexGroup: !0,
    boxOrdinalGroup: !0,
    columnCount: !0,
    columns: !0,
    flex: !0,
    flexGrow: !0,
    flexPositive: !0,
    flexShrink: !0,
    flexNegative: !0,
    flexOrder: !0,
    gridArea: !0,
    gridRow: !0,
    gridRowEnd: !0,
    gridRowSpan: !0,
    gridRowStart: !0,
    gridColumn: !0,
    gridColumnEnd: !0,
    gridColumnSpan: !0,
    gridColumnStart: !0,
    fontWeight: !0,
    lineClamp: !0,
    lineHeight: !0,
    opacity: !0,
    order: !0,
    orphans: !0,
    tabSize: !0,
    widows: !0,
    zIndex: !0,
    zoom: !0,
    fillOpacity: !0,
    floodOpacity: !0,
    stopOpacity: !0,
    strokeDasharray: !0,
    strokeDashoffset: !0,
    strokeMiterlimit: !0,
    strokeOpacity: !0,
    strokeWidth: !0
  }, OC = ["Webkit", "ms", "Moz", "O"];
  Object.keys(go).forEach(function(i) {
    OC.forEach(function(o) {
      o = o + i.charAt(0).toUpperCase() + i.substring(1), go[o] = go[i];
    });
  });
  function Py(i, o, s) {
    return o == null || typeof o == "boolean" || o === "" ? "" : s || typeof o != "number" || o === 0 || go.hasOwnProperty(i) && go[i] ? ("" + o).trim() : o + "px";
  }
  function Ay(i, o) {
    i = i.style;
    for (var s in o) if (o.hasOwnProperty(s)) {
      var v = s.indexOf("--") === 0, m = Py(s, o[s], v);
      s === "float" && (s = "cssFloat"), v ? i.setProperty(s, m) : i[s] = m;
    }
  }
  var EC = Y({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function Cf(i, o) {
    if (o) {
      if (EC[i] && (o.children != null || o.dangerouslySetInnerHTML != null)) throw Error(r(137, i));
      if (o.dangerouslySetInnerHTML != null) {
        if (o.children != null) throw Error(r(60));
        if (typeof o.dangerouslySetInnerHTML != "object" || !("__html" in o.dangerouslySetInnerHTML)) throw Error(r(61));
      }
      if (o.style != null && typeof o.style != "object") throw Error(r(62));
    }
  }
  function If(i, o) {
    if (i.indexOf("-") === -1) return typeof o.is == "string";
    switch (i) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var jf = null;
  function _f(i) {
    return i = i.target || i.srcElement || window, i.correspondingUseElement && (i = i.correspondingUseElement), i.nodeType === 3 ? i.parentNode : i;
  }
  var Tf = null, la = null, ua = null;
  function Oy(i) {
    if (i = Bo(i)) {
      if (typeof Tf != "function") throw Error(r(280));
      var o = i.stateNode;
      o && (o = Au(o), Tf(i.stateNode, i.type, o));
    }
  }
  function Ey(i) {
    la ? ua ? ua.push(i) : ua = [i] : la = i;
  }
  function ky() {
    if (la) {
      var i = la, o = ua;
      if (ua = la = null, Oy(i), o) for (i = 0; i < o.length; i++) Oy(o[i]);
    }
  }
  function Cy(i, o) {
    return i(o);
  }
  function Iy() {
  }
  var Mf = !1;
  function jy(i, o, s) {
    if (Mf) return i(o, s);
    Mf = !0;
    try {
      return Cy(i, o, s);
    } finally {
      Mf = !1, (la !== null || ua !== null) && (Iy(), ky());
    }
  }
  function xo(i, o) {
    var s = i.stateNode;
    if (s === null) return null;
    var v = Au(s);
    if (v === null) return null;
    s = v[o];
    e: switch (o) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (v = !v.disabled) || (i = i.type, v = !(i === "button" || i === "input" || i === "select" || i === "textarea")), i = !v;
        break e;
      default:
        i = !1;
    }
    if (i) return null;
    if (s && typeof s != "function") throw Error(r(231, o, typeof s));
    return s;
  }
  var Df = !1;
  if (c) try {
    var bo = {};
    Object.defineProperty(bo, "passive", { get: function() {
      Df = !0;
    } }), window.addEventListener("test", bo, bo), window.removeEventListener("test", bo, bo);
  } catch {
    Df = !1;
  }
  function kC(i, o, s, v, m, g, A, j, T) {
    var B = Array.prototype.slice.call(arguments, 3);
    try {
      o.apply(s, B);
    } catch (X) {
      this.onError(X);
    }
  }
  var wo = !1, ru = null, nu = !1, Nf = null, CC = { onError: function(i) {
    wo = !0, ru = i;
  } };
  function IC(i, o, s, v, m, g, A, j, T) {
    wo = !1, ru = null, kC.apply(CC, arguments);
  }
  function jC(i, o, s, v, m, g, A, j, T) {
    if (IC.apply(this, arguments), wo) {
      if (wo) {
        var B = ru;
        wo = !1, ru = null;
      } else throw Error(r(198));
      nu || (nu = !0, Nf = B);
    }
  }
  function yi(i) {
    var o = i, s = i;
    if (i.alternate) for (; o.return; ) o = o.return;
    else {
      i = o;
      do
        o = i, (o.flags & 4098) !== 0 && (s = o.return), i = o.return;
      while (i);
    }
    return o.tag === 3 ? s : null;
  }
  function _y(i) {
    if (i.tag === 13) {
      var o = i.memoizedState;
      if (o === null && (i = i.alternate, i !== null && (o = i.memoizedState)), o !== null) return o.dehydrated;
    }
    return null;
  }
  function Ty(i) {
    if (yi(i) !== i) throw Error(r(188));
  }
  function _C(i) {
    var o = i.alternate;
    if (!o) {
      if (o = yi(i), o === null) throw Error(r(188));
      return o !== i ? null : i;
    }
    for (var s = i, v = o; ; ) {
      var m = s.return;
      if (m === null) break;
      var g = m.alternate;
      if (g === null) {
        if (v = m.return, v !== null) {
          s = v;
          continue;
        }
        break;
      }
      if (m.child === g.child) {
        for (g = m.child; g; ) {
          if (g === s) return Ty(m), i;
          if (g === v) return Ty(m), o;
          g = g.sibling;
        }
        throw Error(r(188));
      }
      if (s.return !== v.return) s = m, v = g;
      else {
        for (var A = !1, j = m.child; j; ) {
          if (j === s) {
            A = !0, s = m, v = g;
            break;
          }
          if (j === v) {
            A = !0, v = m, s = g;
            break;
          }
          j = j.sibling;
        }
        if (!A) {
          for (j = g.child; j; ) {
            if (j === s) {
              A = !0, s = g, v = m;
              break;
            }
            if (j === v) {
              A = !0, v = g, s = m;
              break;
            }
            j = j.sibling;
          }
          if (!A) throw Error(r(189));
        }
      }
      if (s.alternate !== v) throw Error(r(190));
    }
    if (s.tag !== 3) throw Error(r(188));
    return s.stateNode.current === s ? i : o;
  }
  function My(i) {
    return i = _C(i), i !== null ? Dy(i) : null;
  }
  function Dy(i) {
    if (i.tag === 5 || i.tag === 6) return i;
    for (i = i.child; i !== null; ) {
      var o = Dy(i);
      if (o !== null) return o;
      i = i.sibling;
    }
    return null;
  }
  var Ny = t.unstable_scheduleCallback, $y = t.unstable_cancelCallback, TC = t.unstable_shouldYield, MC = t.unstable_requestPaint, ot = t.unstable_now, DC = t.unstable_getCurrentPriorityLevel, $f = t.unstable_ImmediatePriority, Ry = t.unstable_UserBlockingPriority, iu = t.unstable_NormalPriority, NC = t.unstable_LowPriority, Ly = t.unstable_IdlePriority, au = null, Gr = null;
  function $C(i) {
    if (Gr && typeof Gr.onCommitFiberRoot == "function") try {
      Gr.onCommitFiberRoot(au, i, void 0, (i.current.flags & 128) === 128);
    } catch {
    }
  }
  var Mr = Math.clz32 ? Math.clz32 : zC, RC = Math.log, LC = Math.LN2;
  function zC(i) {
    return i >>>= 0, i === 0 ? 32 : 31 - (RC(i) / LC | 0) | 0;
  }
  var ou = 64, lu = 4194304;
  function So(i) {
    switch (i & -i) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return i & 4194240;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return i & 130023424;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 1073741824;
      default:
        return i;
    }
  }
  function uu(i, o) {
    var s = i.pendingLanes;
    if (s === 0) return 0;
    var v = 0, m = i.suspendedLanes, g = i.pingedLanes, A = s & 268435455;
    if (A !== 0) {
      var j = A & ~m;
      j !== 0 ? v = So(j) : (g &= A, g !== 0 && (v = So(g)));
    } else A = s & ~m, A !== 0 ? v = So(A) : g !== 0 && (v = So(g));
    if (v === 0) return 0;
    if (o !== 0 && o !== v && (o & m) === 0 && (m = v & -v, g = o & -o, m >= g || m === 16 && (g & 4194240) !== 0)) return o;
    if ((v & 4) !== 0 && (v |= s & 16), o = i.entangledLanes, o !== 0) for (i = i.entanglements, o &= v; 0 < o; ) s = 31 - Mr(o), m = 1 << s, v |= i[s], o &= ~m;
    return v;
  }
  function BC(i, o) {
    switch (i) {
      case 1:
      case 2:
      case 4:
        return o + 250;
      case 8:
      case 16:
      case 32:
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return o + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return -1;
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function FC(i, o) {
    for (var s = i.suspendedLanes, v = i.pingedLanes, m = i.expirationTimes, g = i.pendingLanes; 0 < g; ) {
      var A = 31 - Mr(g), j = 1 << A, T = m[A];
      T === -1 ? ((j & s) === 0 || (j & v) !== 0) && (m[A] = BC(j, o)) : T <= o && (i.expiredLanes |= j), g &= ~j;
    }
  }
  function Rf(i) {
    return i = i.pendingLanes & -1073741825, i !== 0 ? i : i & 1073741824 ? 1073741824 : 0;
  }
  function zy() {
    var i = ou;
    return ou <<= 1, (ou & 4194240) === 0 && (ou = 64), i;
  }
  function Lf(i) {
    for (var o = [], s = 0; 31 > s; s++) o.push(i);
    return o;
  }
  function Po(i, o, s) {
    i.pendingLanes |= o, o !== 536870912 && (i.suspendedLanes = 0, i.pingedLanes = 0), i = i.eventTimes, o = 31 - Mr(o), i[o] = s;
  }
  function WC(i, o) {
    var s = i.pendingLanes & ~o;
    i.pendingLanes = o, i.suspendedLanes = 0, i.pingedLanes = 0, i.expiredLanes &= o, i.mutableReadLanes &= o, i.entangledLanes &= o, o = i.entanglements;
    var v = i.eventTimes;
    for (i = i.expirationTimes; 0 < s; ) {
      var m = 31 - Mr(s), g = 1 << m;
      o[m] = 0, v[m] = -1, i[m] = -1, s &= ~g;
    }
  }
  function zf(i, o) {
    var s = i.entangledLanes |= o;
    for (i = i.entanglements; s; ) {
      var v = 31 - Mr(s), m = 1 << v;
      m & o | i[v] & o && (i[v] |= o), s &= ~m;
    }
  }
  var ze = 0;
  function By(i) {
    return i &= -i, 1 < i ? 4 < i ? (i & 268435455) !== 0 ? 16 : 536870912 : 4 : 1;
  }
  var Fy, Bf, Wy, Uy, Ky, Ff = !1, su = [], Ln = null, zn = null, Bn = null, Ao = /* @__PURE__ */ new Map(), Oo = /* @__PURE__ */ new Map(), Fn = [], UC = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function Hy(i, o) {
    switch (i) {
      case "focusin":
      case "focusout":
        Ln = null;
        break;
      case "dragenter":
      case "dragleave":
        zn = null;
        break;
      case "mouseover":
      case "mouseout":
        Bn = null;
        break;
      case "pointerover":
      case "pointerout":
        Ao.delete(o.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Oo.delete(o.pointerId);
    }
  }
  function Eo(i, o, s, v, m, g) {
    return i === null || i.nativeEvent !== g ? (i = { blockedOn: o, domEventName: s, eventSystemFlags: v, nativeEvent: g, targetContainers: [m] }, o !== null && (o = Bo(o), o !== null && Bf(o)), i) : (i.eventSystemFlags |= v, o = i.targetContainers, m !== null && o.indexOf(m) === -1 && o.push(m), i);
  }
  function KC(i, o, s, v, m) {
    switch (o) {
      case "focusin":
        return Ln = Eo(Ln, i, o, s, v, m), !0;
      case "dragenter":
        return zn = Eo(zn, i, o, s, v, m), !0;
      case "mouseover":
        return Bn = Eo(Bn, i, o, s, v, m), !0;
      case "pointerover":
        var g = m.pointerId;
        return Ao.set(g, Eo(Ao.get(g) || null, i, o, s, v, m)), !0;
      case "gotpointercapture":
        return g = m.pointerId, Oo.set(g, Eo(Oo.get(g) || null, i, o, s, v, m)), !0;
    }
    return !1;
  }
  function Vy(i) {
    var o = gi(i.target);
    if (o !== null) {
      var s = yi(o);
      if (s !== null) {
        if (o = s.tag, o === 13) {
          if (o = _y(s), o !== null) {
            i.blockedOn = o, Ky(i.priority, function() {
              Wy(s);
            });
            return;
          }
        } else if (o === 3 && s.stateNode.current.memoizedState.isDehydrated) {
          i.blockedOn = s.tag === 3 ? s.stateNode.containerInfo : null;
          return;
        }
      }
    }
    i.blockedOn = null;
  }
  function cu(i) {
    if (i.blockedOn !== null) return !1;
    for (var o = i.targetContainers; 0 < o.length; ) {
      var s = Uf(i.domEventName, i.eventSystemFlags, o[0], i.nativeEvent);
      if (s === null) {
        s = i.nativeEvent;
        var v = new s.constructor(s.type, s);
        jf = v, s.target.dispatchEvent(v), jf = null;
      } else return o = Bo(s), o !== null && Bf(o), i.blockedOn = s, !1;
      o.shift();
    }
    return !0;
  }
  function Gy(i, o, s) {
    cu(i) && s.delete(o);
  }
  function HC() {
    Ff = !1, Ln !== null && cu(Ln) && (Ln = null), zn !== null && cu(zn) && (zn = null), Bn !== null && cu(Bn) && (Bn = null), Ao.forEach(Gy), Oo.forEach(Gy);
  }
  function ko(i, o) {
    i.blockedOn === o && (i.blockedOn = null, Ff || (Ff = !0, t.unstable_scheduleCallback(t.unstable_NormalPriority, HC)));
  }
  function Co(i) {
    function o(m) {
      return ko(m, i);
    }
    if (0 < su.length) {
      ko(su[0], i);
      for (var s = 1; s < su.length; s++) {
        var v = su[s];
        v.blockedOn === i && (v.blockedOn = null);
      }
    }
    for (Ln !== null && ko(Ln, i), zn !== null && ko(zn, i), Bn !== null && ko(Bn, i), Ao.forEach(o), Oo.forEach(o), s = 0; s < Fn.length; s++) v = Fn[s], v.blockedOn === i && (v.blockedOn = null);
    for (; 0 < Fn.length && (s = Fn[0], s.blockedOn === null); ) Vy(s), s.blockedOn === null && Fn.shift();
  }
  var sa = E.ReactCurrentBatchConfig, fu = !0;
  function VC(i, o, s, v) {
    var m = ze, g = sa.transition;
    sa.transition = null;
    try {
      ze = 1, Wf(i, o, s, v);
    } finally {
      ze = m, sa.transition = g;
    }
  }
  function GC(i, o, s, v) {
    var m = ze, g = sa.transition;
    sa.transition = null;
    try {
      ze = 4, Wf(i, o, s, v);
    } finally {
      ze = m, sa.transition = g;
    }
  }
  function Wf(i, o, s, v) {
    if (fu) {
      var m = Uf(i, o, s, v);
      if (m === null) od(i, o, v, du, s), Hy(i, v);
      else if (KC(m, i, o, s, v)) v.stopPropagation();
      else if (Hy(i, v), o & 4 && -1 < UC.indexOf(i)) {
        for (; m !== null; ) {
          var g = Bo(m);
          if (g !== null && Fy(g), g = Uf(i, o, s, v), g === null && od(i, o, v, du, s), g === m) break;
          m = g;
        }
        m !== null && v.stopPropagation();
      } else od(i, o, v, null, s);
    }
  }
  var du = null;
  function Uf(i, o, s, v) {
    if (du = null, i = _f(v), i = gi(i), i !== null) if (o = yi(i), o === null) i = null;
    else if (s = o.tag, s === 13) {
      if (i = _y(o), i !== null) return i;
      i = null;
    } else if (s === 3) {
      if (o.stateNode.current.memoizedState.isDehydrated) return o.tag === 3 ? o.stateNode.containerInfo : null;
      i = null;
    } else o !== i && (i = null);
    return du = i, null;
  }
  function Yy(i) {
    switch (i) {
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 1;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "toggle":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 4;
      case "message":
        switch (DC()) {
          case $f:
            return 1;
          case Ry:
            return 4;
          case iu:
          case NC:
            return 16;
          case Ly:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var Wn = null, Kf = null, vu = null;
  function qy() {
    if (vu) return vu;
    var i, o = Kf, s = o.length, v, m = "value" in Wn ? Wn.value : Wn.textContent, g = m.length;
    for (i = 0; i < s && o[i] === m[i]; i++) ;
    var A = s - i;
    for (v = 1; v <= A && o[s - v] === m[g - v]; v++) ;
    return vu = m.slice(i, 1 < v ? 1 - v : void 0);
  }
  function hu(i) {
    var o = i.keyCode;
    return "charCode" in i ? (i = i.charCode, i === 0 && o === 13 && (i = 13)) : i = o, i === 10 && (i = 13), 32 <= i || i === 13 ? i : 0;
  }
  function pu() {
    return !0;
  }
  function Xy() {
    return !1;
  }
  function or(i) {
    function o(s, v, m, g, A) {
      this._reactName = s, this._targetInst = m, this.type = v, this.nativeEvent = g, this.target = A, this.currentTarget = null;
      for (var j in i) i.hasOwnProperty(j) && (s = i[j], this[j] = s ? s(g) : g[j]);
      return this.isDefaultPrevented = (g.defaultPrevented != null ? g.defaultPrevented : g.returnValue === !1) ? pu : Xy, this.isPropagationStopped = Xy, this;
    }
    return Y(o.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var s = this.nativeEvent;
      s && (s.preventDefault ? s.preventDefault() : typeof s.returnValue != "unknown" && (s.returnValue = !1), this.isDefaultPrevented = pu);
    }, stopPropagation: function() {
      var s = this.nativeEvent;
      s && (s.stopPropagation ? s.stopPropagation() : typeof s.cancelBubble != "unknown" && (s.cancelBubble = !0), this.isPropagationStopped = pu);
    }, persist: function() {
    }, isPersistent: pu }), o;
  }
  var ca = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(i) {
    return i.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, Hf = or(ca), Io = Y({}, ca, { view: 0, detail: 0 }), YC = or(Io), Vf, Gf, jo, mu = Y({}, Io, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: qf, button: 0, buttons: 0, relatedTarget: function(i) {
    return i.relatedTarget === void 0 ? i.fromElement === i.srcElement ? i.toElement : i.fromElement : i.relatedTarget;
  }, movementX: function(i) {
    return "movementX" in i ? i.movementX : (i !== jo && (jo && i.type === "mousemove" ? (Vf = i.screenX - jo.screenX, Gf = i.screenY - jo.screenY) : Gf = Vf = 0, jo = i), Vf);
  }, movementY: function(i) {
    return "movementY" in i ? i.movementY : Gf;
  } }), Qy = or(mu), qC = Y({}, mu, { dataTransfer: 0 }), XC = or(qC), QC = Y({}, Io, { relatedTarget: 0 }), Yf = or(QC), ZC = Y({}, ca, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), JC = or(ZC), eI = Y({}, ca, { clipboardData: function(i) {
    return "clipboardData" in i ? i.clipboardData : window.clipboardData;
  } }), tI = or(eI), rI = Y({}, ca, { data: 0 }), Zy = or(rI), nI = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  }, iI = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  }, aI = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function oI(i) {
    var o = this.nativeEvent;
    return o.getModifierState ? o.getModifierState(i) : (i = aI[i]) ? !!o[i] : !1;
  }
  function qf() {
    return oI;
  }
  var lI = Y({}, Io, { key: function(i) {
    if (i.key) {
      var o = nI[i.key] || i.key;
      if (o !== "Unidentified") return o;
    }
    return i.type === "keypress" ? (i = hu(i), i === 13 ? "Enter" : String.fromCharCode(i)) : i.type === "keydown" || i.type === "keyup" ? iI[i.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: qf, charCode: function(i) {
    return i.type === "keypress" ? hu(i) : 0;
  }, keyCode: function(i) {
    return i.type === "keydown" || i.type === "keyup" ? i.keyCode : 0;
  }, which: function(i) {
    return i.type === "keypress" ? hu(i) : i.type === "keydown" || i.type === "keyup" ? i.keyCode : 0;
  } }), uI = or(lI), sI = Y({}, mu, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Jy = or(sI), cI = Y({}, Io, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: qf }), fI = or(cI), dI = Y({}, ca, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), vI = or(dI), hI = Y({}, mu, {
    deltaX: function(i) {
      return "deltaX" in i ? i.deltaX : "wheelDeltaX" in i ? -i.wheelDeltaX : 0;
    },
    deltaY: function(i) {
      return "deltaY" in i ? i.deltaY : "wheelDeltaY" in i ? -i.wheelDeltaY : "wheelDelta" in i ? -i.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), pI = or(hI), mI = [9, 13, 27, 32], Xf = c && "CompositionEvent" in window, _o = null;
  c && "documentMode" in document && (_o = document.documentMode);
  var yI = c && "TextEvent" in window && !_o, eg = c && (!Xf || _o && 8 < _o && 11 >= _o), tg = " ", rg = !1;
  function ng(i, o) {
    switch (i) {
      case "keyup":
        return mI.indexOf(o.keyCode) !== -1;
      case "keydown":
        return o.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function ig(i) {
    return i = i.detail, typeof i == "object" && "data" in i ? i.data : null;
  }
  var fa = !1;
  function gI(i, o) {
    switch (i) {
      case "compositionend":
        return ig(o);
      case "keypress":
        return o.which !== 32 ? null : (rg = !0, tg);
      case "textInput":
        return i = o.data, i === tg && rg ? null : i;
      default:
        return null;
    }
  }
  function xI(i, o) {
    if (fa) return i === "compositionend" || !Xf && ng(i, o) ? (i = qy(), vu = Kf = Wn = null, fa = !1, i) : null;
    switch (i) {
      case "paste":
        return null;
      case "keypress":
        if (!(o.ctrlKey || o.altKey || o.metaKey) || o.ctrlKey && o.altKey) {
          if (o.char && 1 < o.char.length) return o.char;
          if (o.which) return String.fromCharCode(o.which);
        }
        return null;
      case "compositionend":
        return eg && o.locale !== "ko" ? null : o.data;
      default:
        return null;
    }
  }
  var bI = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function ag(i) {
    var o = i && i.nodeName && i.nodeName.toLowerCase();
    return o === "input" ? !!bI[i.type] : o === "textarea";
  }
  function og(i, o, s, v) {
    Ey(v), o = wu(o, "onChange"), 0 < o.length && (s = new Hf("onChange", "change", null, s, v), i.push({ event: s, listeners: o }));
  }
  var To = null, Mo = null;
  function wI(i) {
    Ag(i, 0);
  }
  function yu(i) {
    var o = ma(i);
    if (Z(o)) return i;
  }
  function SI(i, o) {
    if (i === "change") return o;
  }
  var lg = !1;
  if (c) {
    var Qf;
    if (c) {
      var Zf = "oninput" in document;
      if (!Zf) {
        var ug = document.createElement("div");
        ug.setAttribute("oninput", "return;"), Zf = typeof ug.oninput == "function";
      }
      Qf = Zf;
    } else Qf = !1;
    lg = Qf && (!document.documentMode || 9 < document.documentMode);
  }
  function sg() {
    To && (To.detachEvent("onpropertychange", cg), Mo = To = null);
  }
  function cg(i) {
    if (i.propertyName === "value" && yu(Mo)) {
      var o = [];
      og(o, Mo, i, _f(i)), jy(wI, o);
    }
  }
  function PI(i, o, s) {
    i === "focusin" ? (sg(), To = o, Mo = s, To.attachEvent("onpropertychange", cg)) : i === "focusout" && sg();
  }
  function AI(i) {
    if (i === "selectionchange" || i === "keyup" || i === "keydown") return yu(Mo);
  }
  function OI(i, o) {
    if (i === "click") return yu(o);
  }
  function EI(i, o) {
    if (i === "input" || i === "change") return yu(o);
  }
  function kI(i, o) {
    return i === o && (i !== 0 || 1 / i === 1 / o) || i !== i && o !== o;
  }
  var Dr = typeof Object.is == "function" ? Object.is : kI;
  function Do(i, o) {
    if (Dr(i, o)) return !0;
    if (typeof i != "object" || i === null || typeof o != "object" || o === null) return !1;
    var s = Object.keys(i), v = Object.keys(o);
    if (s.length !== v.length) return !1;
    for (v = 0; v < s.length; v++) {
      var m = s[v];
      if (!f.call(o, m) || !Dr(i[m], o[m])) return !1;
    }
    return !0;
  }
  function fg(i) {
    for (; i && i.firstChild; ) i = i.firstChild;
    return i;
  }
  function dg(i, o) {
    var s = fg(i);
    i = 0;
    for (var v; s; ) {
      if (s.nodeType === 3) {
        if (v = i + s.textContent.length, i <= o && v >= o) return { node: s, offset: o - i };
        i = v;
      }
      e: {
        for (; s; ) {
          if (s.nextSibling) {
            s = s.nextSibling;
            break e;
          }
          s = s.parentNode;
        }
        s = void 0;
      }
      s = fg(s);
    }
  }
  function vg(i, o) {
    return i && o ? i === o ? !0 : i && i.nodeType === 3 ? !1 : o && o.nodeType === 3 ? vg(i, o.parentNode) : "contains" in i ? i.contains(o) : i.compareDocumentPosition ? !!(i.compareDocumentPosition(o) & 16) : !1 : !1;
  }
  function hg() {
    for (var i = window, o = at(); o instanceof i.HTMLIFrameElement; ) {
      try {
        var s = typeof o.contentWindow.location.href == "string";
      } catch {
        s = !1;
      }
      if (s) i = o.contentWindow;
      else break;
      o = at(i.document);
    }
    return o;
  }
  function Jf(i) {
    var o = i && i.nodeName && i.nodeName.toLowerCase();
    return o && (o === "input" && (i.type === "text" || i.type === "search" || i.type === "tel" || i.type === "url" || i.type === "password") || o === "textarea" || i.contentEditable === "true");
  }
  function CI(i) {
    var o = hg(), s = i.focusedElem, v = i.selectionRange;
    if (o !== s && s && s.ownerDocument && vg(s.ownerDocument.documentElement, s)) {
      if (v !== null && Jf(s)) {
        if (o = v.start, i = v.end, i === void 0 && (i = o), "selectionStart" in s) s.selectionStart = o, s.selectionEnd = Math.min(i, s.value.length);
        else if (i = (o = s.ownerDocument || document) && o.defaultView || window, i.getSelection) {
          i = i.getSelection();
          var m = s.textContent.length, g = Math.min(v.start, m);
          v = v.end === void 0 ? g : Math.min(v.end, m), !i.extend && g > v && (m = v, v = g, g = m), m = dg(s, g);
          var A = dg(
            s,
            v
          );
          m && A && (i.rangeCount !== 1 || i.anchorNode !== m.node || i.anchorOffset !== m.offset || i.focusNode !== A.node || i.focusOffset !== A.offset) && (o = o.createRange(), o.setStart(m.node, m.offset), i.removeAllRanges(), g > v ? (i.addRange(o), i.extend(A.node, A.offset)) : (o.setEnd(A.node, A.offset), i.addRange(o)));
        }
      }
      for (o = [], i = s; i = i.parentNode; ) i.nodeType === 1 && o.push({ element: i, left: i.scrollLeft, top: i.scrollTop });
      for (typeof s.focus == "function" && s.focus(), s = 0; s < o.length; s++) i = o[s], i.element.scrollLeft = i.left, i.element.scrollTop = i.top;
    }
  }
  var II = c && "documentMode" in document && 11 >= document.documentMode, da = null, ed = null, No = null, td = !1;
  function pg(i, o, s) {
    var v = s.window === s ? s.document : s.nodeType === 9 ? s : s.ownerDocument;
    td || da == null || da !== at(v) || (v = da, "selectionStart" in v && Jf(v) ? v = { start: v.selectionStart, end: v.selectionEnd } : (v = (v.ownerDocument && v.ownerDocument.defaultView || window).getSelection(), v = { anchorNode: v.anchorNode, anchorOffset: v.anchorOffset, focusNode: v.focusNode, focusOffset: v.focusOffset }), No && Do(No, v) || (No = v, v = wu(ed, "onSelect"), 0 < v.length && (o = new Hf("onSelect", "select", null, o, s), i.push({ event: o, listeners: v }), o.target = da)));
  }
  function gu(i, o) {
    var s = {};
    return s[i.toLowerCase()] = o.toLowerCase(), s["Webkit" + i] = "webkit" + o, s["Moz" + i] = "moz" + o, s;
  }
  var va = { animationend: gu("Animation", "AnimationEnd"), animationiteration: gu("Animation", "AnimationIteration"), animationstart: gu("Animation", "AnimationStart"), transitionend: gu("Transition", "TransitionEnd") }, rd = {}, mg = {};
  c && (mg = document.createElement("div").style, "AnimationEvent" in window || (delete va.animationend.animation, delete va.animationiteration.animation, delete va.animationstart.animation), "TransitionEvent" in window || delete va.transitionend.transition);
  function xu(i) {
    if (rd[i]) return rd[i];
    if (!va[i]) return i;
    var o = va[i], s;
    for (s in o) if (o.hasOwnProperty(s) && s in mg) return rd[i] = o[s];
    return i;
  }
  var yg = xu("animationend"), gg = xu("animationiteration"), xg = xu("animationstart"), bg = xu("transitionend"), wg = /* @__PURE__ */ new Map(), Sg = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function Un(i, o) {
    wg.set(i, o), l(o, [i]);
  }
  for (var nd = 0; nd < Sg.length; nd++) {
    var id = Sg[nd], jI = id.toLowerCase(), _I = id[0].toUpperCase() + id.slice(1);
    Un(jI, "on" + _I);
  }
  Un(yg, "onAnimationEnd"), Un(gg, "onAnimationIteration"), Un(xg, "onAnimationStart"), Un("dblclick", "onDoubleClick"), Un("focusin", "onFocus"), Un("focusout", "onBlur"), Un(bg, "onTransitionEnd"), u("onMouseEnter", ["mouseout", "mouseover"]), u("onMouseLeave", ["mouseout", "mouseover"]), u("onPointerEnter", ["pointerout", "pointerover"]), u("onPointerLeave", ["pointerout", "pointerover"]), l("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), l("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), l("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), l("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), l("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), l("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var $o = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), TI = new Set("cancel close invalid load scroll toggle".split(" ").concat($o));
  function Pg(i, o, s) {
    var v = i.type || "unknown-event";
    i.currentTarget = s, jC(v, o, void 0, i), i.currentTarget = null;
  }
  function Ag(i, o) {
    o = (o & 4) !== 0;
    for (var s = 0; s < i.length; s++) {
      var v = i[s], m = v.event;
      v = v.listeners;
      e: {
        var g = void 0;
        if (o) for (var A = v.length - 1; 0 <= A; A--) {
          var j = v[A], T = j.instance, B = j.currentTarget;
          if (j = j.listener, T !== g && m.isPropagationStopped()) break e;
          Pg(m, j, B), g = T;
        }
        else for (A = 0; A < v.length; A++) {
          if (j = v[A], T = j.instance, B = j.currentTarget, j = j.listener, T !== g && m.isPropagationStopped()) break e;
          Pg(m, j, B), g = T;
        }
      }
    }
    if (nu) throw i = Nf, nu = !1, Nf = null, i;
  }
  function Ke(i, o) {
    var s = o[dd];
    s === void 0 && (s = o[dd] = /* @__PURE__ */ new Set());
    var v = i + "__bubble";
    s.has(v) || (Og(o, i, 2, !1), s.add(v));
  }
  function ad(i, o, s) {
    var v = 0;
    o && (v |= 4), Og(s, i, v, o);
  }
  var bu = "_reactListening" + Math.random().toString(36).slice(2);
  function Ro(i) {
    if (!i[bu]) {
      i[bu] = !0, n.forEach(function(s) {
        s !== "selectionchange" && (TI.has(s) || ad(s, !1, i), ad(s, !0, i));
      });
      var o = i.nodeType === 9 ? i : i.ownerDocument;
      o === null || o[bu] || (o[bu] = !0, ad("selectionchange", !1, o));
    }
  }
  function Og(i, o, s, v) {
    switch (Yy(o)) {
      case 1:
        var m = VC;
        break;
      case 4:
        m = GC;
        break;
      default:
        m = Wf;
    }
    s = m.bind(null, o, s, i), m = void 0, !Df || o !== "touchstart" && o !== "touchmove" && o !== "wheel" || (m = !0), v ? m !== void 0 ? i.addEventListener(o, s, { capture: !0, passive: m }) : i.addEventListener(o, s, !0) : m !== void 0 ? i.addEventListener(o, s, { passive: m }) : i.addEventListener(o, s, !1);
  }
  function od(i, o, s, v, m) {
    var g = v;
    if ((o & 1) === 0 && (o & 2) === 0 && v !== null) e: for (; ; ) {
      if (v === null) return;
      var A = v.tag;
      if (A === 3 || A === 4) {
        var j = v.stateNode.containerInfo;
        if (j === m || j.nodeType === 8 && j.parentNode === m) break;
        if (A === 4) for (A = v.return; A !== null; ) {
          var T = A.tag;
          if ((T === 3 || T === 4) && (T = A.stateNode.containerInfo, T === m || T.nodeType === 8 && T.parentNode === m)) return;
          A = A.return;
        }
        for (; j !== null; ) {
          if (A = gi(j), A === null) return;
          if (T = A.tag, T === 5 || T === 6) {
            v = g = A;
            continue e;
          }
          j = j.parentNode;
        }
      }
      v = v.return;
    }
    jy(function() {
      var B = g, X = _f(s), Q = [];
      e: {
        var q = wg.get(i);
        if (q !== void 0) {
          var le = Hf, de = i;
          switch (i) {
            case "keypress":
              if (hu(s) === 0) break e;
            case "keydown":
            case "keyup":
              le = uI;
              break;
            case "focusin":
              de = "focus", le = Yf;
              break;
            case "focusout":
              de = "blur", le = Yf;
              break;
            case "beforeblur":
            case "afterblur":
              le = Yf;
              break;
            case "click":
              if (s.button === 2) break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              le = Qy;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              le = XC;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              le = fI;
              break;
            case yg:
            case gg:
            case xg:
              le = JC;
              break;
            case bg:
              le = vI;
              break;
            case "scroll":
              le = YC;
              break;
            case "wheel":
              le = pI;
              break;
            case "copy":
            case "cut":
            case "paste":
              le = tI;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              le = Jy;
          }
          var he = (o & 4) !== 0, lt = !he && i === "scroll", L = he ? q !== null ? q + "Capture" : null : q;
          he = [];
          for (var M = B, z; M !== null; ) {
            z = M;
            var te = z.stateNode;
            if (z.tag === 5 && te !== null && (z = te, L !== null && (te = xo(M, L), te != null && he.push(Lo(M, te, z)))), lt) break;
            M = M.return;
          }
          0 < he.length && (q = new le(q, de, null, s, X), Q.push({ event: q, listeners: he }));
        }
      }
      if ((o & 7) === 0) {
        e: {
          if (q = i === "mouseover" || i === "pointerover", le = i === "mouseout" || i === "pointerout", q && s !== jf && (de = s.relatedTarget || s.fromElement) && (gi(de) || de[hn])) break e;
          if ((le || q) && (q = X.window === X ? X : (q = X.ownerDocument) ? q.defaultView || q.parentWindow : window, le ? (de = s.relatedTarget || s.toElement, le = B, de = de ? gi(de) : null, de !== null && (lt = yi(de), de !== lt || de.tag !== 5 && de.tag !== 6) && (de = null)) : (le = null, de = B), le !== de)) {
            if (he = Qy, te = "onMouseLeave", L = "onMouseEnter", M = "mouse", (i === "pointerout" || i === "pointerover") && (he = Jy, te = "onPointerLeave", L = "onPointerEnter", M = "pointer"), lt = le == null ? q : ma(le), z = de == null ? q : ma(de), q = new he(te, M + "leave", le, s, X), q.target = lt, q.relatedTarget = z, te = null, gi(X) === B && (he = new he(L, M + "enter", de, s, X), he.target = z, he.relatedTarget = lt, te = he), lt = te, le && de) t: {
              for (he = le, L = de, M = 0, z = he; z; z = ha(z)) M++;
              for (z = 0, te = L; te; te = ha(te)) z++;
              for (; 0 < M - z; ) he = ha(he), M--;
              for (; 0 < z - M; ) L = ha(L), z--;
              for (; M--; ) {
                if (he === L || L !== null && he === L.alternate) break t;
                he = ha(he), L = ha(L);
              }
              he = null;
            }
            else he = null;
            le !== null && Eg(Q, q, le, he, !1), de !== null && lt !== null && Eg(Q, lt, de, he, !0);
          }
        }
        e: {
          if (q = B ? ma(B) : window, le = q.nodeName && q.nodeName.toLowerCase(), le === "select" || le === "input" && q.type === "file") var pe = SI;
          else if (ag(q)) if (lg) pe = EI;
          else {
            pe = AI;
            var ge = PI;
          }
          else (le = q.nodeName) && le.toLowerCase() === "input" && (q.type === "checkbox" || q.type === "radio") && (pe = OI);
          if (pe && (pe = pe(i, B))) {
            og(Q, pe, s, X);
            break e;
          }
          ge && ge(i, q, B), i === "focusout" && (ge = q._wrapperState) && ge.controlled && q.type === "number" && Of(q, "number", q.value);
        }
        switch (ge = B ? ma(B) : window, i) {
          case "focusin":
            (ag(ge) || ge.contentEditable === "true") && (da = ge, ed = B, No = null);
            break;
          case "focusout":
            No = ed = da = null;
            break;
          case "mousedown":
            td = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            td = !1, pg(Q, s, X);
            break;
          case "selectionchange":
            if (II) break;
          case "keydown":
          case "keyup":
            pg(Q, s, X);
        }
        var xe;
        if (Xf) e: {
          switch (i) {
            case "compositionstart":
              var Se = "onCompositionStart";
              break e;
            case "compositionend":
              Se = "onCompositionEnd";
              break e;
            case "compositionupdate":
              Se = "onCompositionUpdate";
              break e;
          }
          Se = void 0;
        }
        else fa ? ng(i, s) && (Se = "onCompositionEnd") : i === "keydown" && s.keyCode === 229 && (Se = "onCompositionStart");
        Se && (eg && s.locale !== "ko" && (fa || Se !== "onCompositionStart" ? Se === "onCompositionEnd" && fa && (xe = qy()) : (Wn = X, Kf = "value" in Wn ? Wn.value : Wn.textContent, fa = !0)), ge = wu(B, Se), 0 < ge.length && (Se = new Zy(Se, i, null, s, X), Q.push({ event: Se, listeners: ge }), xe ? Se.data = xe : (xe = ig(s), xe !== null && (Se.data = xe)))), (xe = yI ? gI(i, s) : xI(i, s)) && (B = wu(B, "onBeforeInput"), 0 < B.length && (X = new Zy("onBeforeInput", "beforeinput", null, s, X), Q.push({ event: X, listeners: B }), X.data = xe));
      }
      Ag(Q, o);
    });
  }
  function Lo(i, o, s) {
    return { instance: i, listener: o, currentTarget: s };
  }
  function wu(i, o) {
    for (var s = o + "Capture", v = []; i !== null; ) {
      var m = i, g = m.stateNode;
      m.tag === 5 && g !== null && (m = g, g = xo(i, s), g != null && v.unshift(Lo(i, g, m)), g = xo(i, o), g != null && v.push(Lo(i, g, m))), i = i.return;
    }
    return v;
  }
  function ha(i) {
    if (i === null) return null;
    do
      i = i.return;
    while (i && i.tag !== 5);
    return i || null;
  }
  function Eg(i, o, s, v, m) {
    for (var g = o._reactName, A = []; s !== null && s !== v; ) {
      var j = s, T = j.alternate, B = j.stateNode;
      if (T !== null && T === v) break;
      j.tag === 5 && B !== null && (j = B, m ? (T = xo(s, g), T != null && A.unshift(Lo(s, T, j))) : m || (T = xo(s, g), T != null && A.push(Lo(s, T, j)))), s = s.return;
    }
    A.length !== 0 && i.push({ event: o, listeners: A });
  }
  var MI = /\r\n?/g, DI = /\u0000|\uFFFD/g;
  function kg(i) {
    return (typeof i == "string" ? i : "" + i).replace(MI, `
`).replace(DI, "");
  }
  function Su(i, o, s) {
    if (o = kg(o), kg(i) !== o && s) throw Error(r(425));
  }
  function Pu() {
  }
  var ld = null, ud = null;
  function sd(i, o) {
    return i === "textarea" || i === "noscript" || typeof o.children == "string" || typeof o.children == "number" || typeof o.dangerouslySetInnerHTML == "object" && o.dangerouslySetInnerHTML !== null && o.dangerouslySetInnerHTML.__html != null;
  }
  var cd = typeof setTimeout == "function" ? setTimeout : void 0, NI = typeof clearTimeout == "function" ? clearTimeout : void 0, Cg = typeof Promise == "function" ? Promise : void 0, $I = typeof queueMicrotask == "function" ? queueMicrotask : typeof Cg < "u" ? function(i) {
    return Cg.resolve(null).then(i).catch(RI);
  } : cd;
  function RI(i) {
    setTimeout(function() {
      throw i;
    });
  }
  function fd(i, o) {
    var s = o, v = 0;
    do {
      var m = s.nextSibling;
      if (i.removeChild(s), m && m.nodeType === 8) if (s = m.data, s === "/$") {
        if (v === 0) {
          i.removeChild(m), Co(o);
          return;
        }
        v--;
      } else s !== "$" && s !== "$?" && s !== "$!" || v++;
      s = m;
    } while (s);
    Co(o);
  }
  function Kn(i) {
    for (; i != null; i = i.nextSibling) {
      var o = i.nodeType;
      if (o === 1 || o === 3) break;
      if (o === 8) {
        if (o = i.data, o === "$" || o === "$!" || o === "$?") break;
        if (o === "/$") return null;
      }
    }
    return i;
  }
  function Ig(i) {
    i = i.previousSibling;
    for (var o = 0; i; ) {
      if (i.nodeType === 8) {
        var s = i.data;
        if (s === "$" || s === "$!" || s === "$?") {
          if (o === 0) return i;
          o--;
        } else s === "/$" && o++;
      }
      i = i.previousSibling;
    }
    return null;
  }
  var pa = Math.random().toString(36).slice(2), Yr = "__reactFiber$" + pa, zo = "__reactProps$" + pa, hn = "__reactContainer$" + pa, dd = "__reactEvents$" + pa, LI = "__reactListeners$" + pa, zI = "__reactHandles$" + pa;
  function gi(i) {
    var o = i[Yr];
    if (o) return o;
    for (var s = i.parentNode; s; ) {
      if (o = s[hn] || s[Yr]) {
        if (s = o.alternate, o.child !== null || s !== null && s.child !== null) for (i = Ig(i); i !== null; ) {
          if (s = i[Yr]) return s;
          i = Ig(i);
        }
        return o;
      }
      i = s, s = i.parentNode;
    }
    return null;
  }
  function Bo(i) {
    return i = i[Yr] || i[hn], !i || i.tag !== 5 && i.tag !== 6 && i.tag !== 13 && i.tag !== 3 ? null : i;
  }
  function ma(i) {
    if (i.tag === 5 || i.tag === 6) return i.stateNode;
    throw Error(r(33));
  }
  function Au(i) {
    return i[zo] || null;
  }
  var vd = [], ya = -1;
  function Hn(i) {
    return { current: i };
  }
  function He(i) {
    0 > ya || (i.current = vd[ya], vd[ya] = null, ya--);
  }
  function We(i, o) {
    ya++, vd[ya] = i.current, i.current = o;
  }
  var Vn = {}, $t = Hn(Vn), Xt = Hn(!1), xi = Vn;
  function ga(i, o) {
    var s = i.type.contextTypes;
    if (!s) return Vn;
    var v = i.stateNode;
    if (v && v.__reactInternalMemoizedUnmaskedChildContext === o) return v.__reactInternalMemoizedMaskedChildContext;
    var m = {}, g;
    for (g in s) m[g] = o[g];
    return v && (i = i.stateNode, i.__reactInternalMemoizedUnmaskedChildContext = o, i.__reactInternalMemoizedMaskedChildContext = m), m;
  }
  function Qt(i) {
    return i = i.childContextTypes, i != null;
  }
  function Ou() {
    He(Xt), He($t);
  }
  function jg(i, o, s) {
    if ($t.current !== Vn) throw Error(r(168));
    We($t, o), We(Xt, s);
  }
  function _g(i, o, s) {
    var v = i.stateNode;
    if (o = o.childContextTypes, typeof v.getChildContext != "function") return s;
    v = v.getChildContext();
    for (var m in v) if (!(m in o)) throw Error(r(108, Oe(i) || "Unknown", m));
    return Y({}, s, v);
  }
  function Eu(i) {
    return i = (i = i.stateNode) && i.__reactInternalMemoizedMergedChildContext || Vn, xi = $t.current, We($t, i), We(Xt, Xt.current), !0;
  }
  function Tg(i, o, s) {
    var v = i.stateNode;
    if (!v) throw Error(r(169));
    s ? (i = _g(i, o, xi), v.__reactInternalMemoizedMergedChildContext = i, He(Xt), He($t), We($t, i)) : He(Xt), We(Xt, s);
  }
  var pn = null, ku = !1, hd = !1;
  function Mg(i) {
    pn === null ? pn = [i] : pn.push(i);
  }
  function BI(i) {
    ku = !0, Mg(i);
  }
  function Gn() {
    if (!hd && pn !== null) {
      hd = !0;
      var i = 0, o = ze;
      try {
        var s = pn;
        for (ze = 1; i < s.length; i++) {
          var v = s[i];
          do
            v = v(!0);
          while (v !== null);
        }
        pn = null, ku = !1;
      } catch (m) {
        throw pn !== null && (pn = pn.slice(i + 1)), Ny($f, Gn), m;
      } finally {
        ze = o, hd = !1;
      }
    }
    return null;
  }
  var xa = [], ba = 0, Cu = null, Iu = 0, mr = [], yr = 0, bi = null, mn = 1, yn = "";
  function wi(i, o) {
    xa[ba++] = Iu, xa[ba++] = Cu, Cu = i, Iu = o;
  }
  function Dg(i, o, s) {
    mr[yr++] = mn, mr[yr++] = yn, mr[yr++] = bi, bi = i;
    var v = mn;
    i = yn;
    var m = 32 - Mr(v) - 1;
    v &= ~(1 << m), s += 1;
    var g = 32 - Mr(o) + m;
    if (30 < g) {
      var A = m - m % 5;
      g = (v & (1 << A) - 1).toString(32), v >>= A, m -= A, mn = 1 << 32 - Mr(o) + m | s << m | v, yn = g + i;
    } else mn = 1 << g | s << m | v, yn = i;
  }
  function pd(i) {
    i.return !== null && (wi(i, 1), Dg(i, 1, 0));
  }
  function md(i) {
    for (; i === Cu; ) Cu = xa[--ba], xa[ba] = null, Iu = xa[--ba], xa[ba] = null;
    for (; i === bi; ) bi = mr[--yr], mr[yr] = null, yn = mr[--yr], mr[yr] = null, mn = mr[--yr], mr[yr] = null;
  }
  var lr = null, ur = null, Ye = !1, Nr = null;
  function Ng(i, o) {
    var s = wr(5, null, null, 0);
    s.elementType = "DELETED", s.stateNode = o, s.return = i, o = i.deletions, o === null ? (i.deletions = [s], i.flags |= 16) : o.push(s);
  }
  function $g(i, o) {
    switch (i.tag) {
      case 5:
        var s = i.type;
        return o = o.nodeType !== 1 || s.toLowerCase() !== o.nodeName.toLowerCase() ? null : o, o !== null ? (i.stateNode = o, lr = i, ur = Kn(o.firstChild), !0) : !1;
      case 6:
        return o = i.pendingProps === "" || o.nodeType !== 3 ? null : o, o !== null ? (i.stateNode = o, lr = i, ur = null, !0) : !1;
      case 13:
        return o = o.nodeType !== 8 ? null : o, o !== null ? (s = bi !== null ? { id: mn, overflow: yn } : null, i.memoizedState = { dehydrated: o, treeContext: s, retryLane: 1073741824 }, s = wr(18, null, null, 0), s.stateNode = o, s.return = i, i.child = s, lr = i, ur = null, !0) : !1;
      default:
        return !1;
    }
  }
  function yd(i) {
    return (i.mode & 1) !== 0 && (i.flags & 128) === 0;
  }
  function gd(i) {
    if (Ye) {
      var o = ur;
      if (o) {
        var s = o;
        if (!$g(i, o)) {
          if (yd(i)) throw Error(r(418));
          o = Kn(s.nextSibling);
          var v = lr;
          o && $g(i, o) ? Ng(v, s) : (i.flags = i.flags & -4097 | 2, Ye = !1, lr = i);
        }
      } else {
        if (yd(i)) throw Error(r(418));
        i.flags = i.flags & -4097 | 2, Ye = !1, lr = i;
      }
    }
  }
  function Rg(i) {
    for (i = i.return; i !== null && i.tag !== 5 && i.tag !== 3 && i.tag !== 13; ) i = i.return;
    lr = i;
  }
  function ju(i) {
    if (i !== lr) return !1;
    if (!Ye) return Rg(i), Ye = !0, !1;
    var o;
    if ((o = i.tag !== 3) && !(o = i.tag !== 5) && (o = i.type, o = o !== "head" && o !== "body" && !sd(i.type, i.memoizedProps)), o && (o = ur)) {
      if (yd(i)) throw Lg(), Error(r(418));
      for (; o; ) Ng(i, o), o = Kn(o.nextSibling);
    }
    if (Rg(i), i.tag === 13) {
      if (i = i.memoizedState, i = i !== null ? i.dehydrated : null, !i) throw Error(r(317));
      e: {
        for (i = i.nextSibling, o = 0; i; ) {
          if (i.nodeType === 8) {
            var s = i.data;
            if (s === "/$") {
              if (o === 0) {
                ur = Kn(i.nextSibling);
                break e;
              }
              o--;
            } else s !== "$" && s !== "$!" && s !== "$?" || o++;
          }
          i = i.nextSibling;
        }
        ur = null;
      }
    } else ur = lr ? Kn(i.stateNode.nextSibling) : null;
    return !0;
  }
  function Lg() {
    for (var i = ur; i; ) i = Kn(i.nextSibling);
  }
  function wa() {
    ur = lr = null, Ye = !1;
  }
  function xd(i) {
    Nr === null ? Nr = [i] : Nr.push(i);
  }
  var FI = E.ReactCurrentBatchConfig;
  function Fo(i, o, s) {
    if (i = s.ref, i !== null && typeof i != "function" && typeof i != "object") {
      if (s._owner) {
        if (s = s._owner, s) {
          if (s.tag !== 1) throw Error(r(309));
          var v = s.stateNode;
        }
        if (!v) throw Error(r(147, i));
        var m = v, g = "" + i;
        return o !== null && o.ref !== null && typeof o.ref == "function" && o.ref._stringRef === g ? o.ref : (o = function(A) {
          var j = m.refs;
          A === null ? delete j[g] : j[g] = A;
        }, o._stringRef = g, o);
      }
      if (typeof i != "string") throw Error(r(284));
      if (!s._owner) throw Error(r(290, i));
    }
    return i;
  }
  function _u(i, o) {
    throw i = Object.prototype.toString.call(o), Error(r(31, i === "[object Object]" ? "object with keys {" + Object.keys(o).join(", ") + "}" : i));
  }
  function zg(i) {
    var o = i._init;
    return o(i._payload);
  }
  function Bg(i) {
    function o(L, M) {
      if (i) {
        var z = L.deletions;
        z === null ? (L.deletions = [M], L.flags |= 16) : z.push(M);
      }
    }
    function s(L, M) {
      if (!i) return null;
      for (; M !== null; ) o(L, M), M = M.sibling;
      return null;
    }
    function v(L, M) {
      for (L = /* @__PURE__ */ new Map(); M !== null; ) M.key !== null ? L.set(M.key, M) : L.set(M.index, M), M = M.sibling;
      return L;
    }
    function m(L, M) {
      return L = ti(L, M), L.index = 0, L.sibling = null, L;
    }
    function g(L, M, z) {
      return L.index = z, i ? (z = L.alternate, z !== null ? (z = z.index, z < M ? (L.flags |= 2, M) : z) : (L.flags |= 2, M)) : (L.flags |= 1048576, M);
    }
    function A(L) {
      return i && L.alternate === null && (L.flags |= 2), L;
    }
    function j(L, M, z, te) {
      return M === null || M.tag !== 6 ? (M = cv(z, L.mode, te), M.return = L, M) : (M = m(M, z), M.return = L, M);
    }
    function T(L, M, z, te) {
      var pe = z.type;
      return pe === R ? X(L, M, z.props.children, te, z.key) : M !== null && (M.elementType === pe || typeof pe == "object" && pe !== null && pe.$$typeof === fe && zg(pe) === M.type) ? (te = m(M, z.props), te.ref = Fo(L, M, z), te.return = L, te) : (te = ts(z.type, z.key, z.props, null, L.mode, te), te.ref = Fo(L, M, z), te.return = L, te);
    }
    function B(L, M, z, te) {
      return M === null || M.tag !== 4 || M.stateNode.containerInfo !== z.containerInfo || M.stateNode.implementation !== z.implementation ? (M = fv(z, L.mode, te), M.return = L, M) : (M = m(M, z.children || []), M.return = L, M);
    }
    function X(L, M, z, te, pe) {
      return M === null || M.tag !== 7 ? (M = Ii(z, L.mode, te, pe), M.return = L, M) : (M = m(M, z), M.return = L, M);
    }
    function Q(L, M, z) {
      if (typeof M == "string" && M !== "" || typeof M == "number") return M = cv("" + M, L.mode, z), M.return = L, M;
      if (typeof M == "object" && M !== null) {
        switch (M.$$typeof) {
          case _:
            return z = ts(M.type, M.key, M.props, null, L.mode, z), z.ref = Fo(L, null, M), z.return = L, z;
          case C:
            return M = fv(M, L.mode, z), M.return = L, M;
          case fe:
            var te = M._init;
            return Q(L, te(M._payload), z);
        }
        if (mo(M) || ee(M)) return M = Ii(M, L.mode, z, null), M.return = L, M;
        _u(L, M);
      }
      return null;
    }
    function q(L, M, z, te) {
      var pe = M !== null ? M.key : null;
      if (typeof z == "string" && z !== "" || typeof z == "number") return pe !== null ? null : j(L, M, "" + z, te);
      if (typeof z == "object" && z !== null) {
        switch (z.$$typeof) {
          case _:
            return z.key === pe ? T(L, M, z, te) : null;
          case C:
            return z.key === pe ? B(L, M, z, te) : null;
          case fe:
            return pe = z._init, q(
              L,
              M,
              pe(z._payload),
              te
            );
        }
        if (mo(z) || ee(z)) return pe !== null ? null : X(L, M, z, te, null);
        _u(L, z);
      }
      return null;
    }
    function le(L, M, z, te, pe) {
      if (typeof te == "string" && te !== "" || typeof te == "number") return L = L.get(z) || null, j(M, L, "" + te, pe);
      if (typeof te == "object" && te !== null) {
        switch (te.$$typeof) {
          case _:
            return L = L.get(te.key === null ? z : te.key) || null, T(M, L, te, pe);
          case C:
            return L = L.get(te.key === null ? z : te.key) || null, B(M, L, te, pe);
          case fe:
            var ge = te._init;
            return le(L, M, z, ge(te._payload), pe);
        }
        if (mo(te) || ee(te)) return L = L.get(z) || null, X(M, L, te, pe, null);
        _u(M, te);
      }
      return null;
    }
    function de(L, M, z, te) {
      for (var pe = null, ge = null, xe = M, Se = M = 0, At = null; xe !== null && Se < z.length; Se++) {
        xe.index > Se ? (At = xe, xe = null) : At = xe.sibling;
        var Te = q(L, xe, z[Se], te);
        if (Te === null) {
          xe === null && (xe = At);
          break;
        }
        i && xe && Te.alternate === null && o(L, xe), M = g(Te, M, Se), ge === null ? pe = Te : ge.sibling = Te, ge = Te, xe = At;
      }
      if (Se === z.length) return s(L, xe), Ye && wi(L, Se), pe;
      if (xe === null) {
        for (; Se < z.length; Se++) xe = Q(L, z[Se], te), xe !== null && (M = g(xe, M, Se), ge === null ? pe = xe : ge.sibling = xe, ge = xe);
        return Ye && wi(L, Se), pe;
      }
      for (xe = v(L, xe); Se < z.length; Se++) At = le(xe, L, Se, z[Se], te), At !== null && (i && At.alternate !== null && xe.delete(At.key === null ? Se : At.key), M = g(At, M, Se), ge === null ? pe = At : ge.sibling = At, ge = At);
      return i && xe.forEach(function(ri) {
        return o(L, ri);
      }), Ye && wi(L, Se), pe;
    }
    function he(L, M, z, te) {
      var pe = ee(z);
      if (typeof pe != "function") throw Error(r(150));
      if (z = pe.call(z), z == null) throw Error(r(151));
      for (var ge = pe = null, xe = M, Se = M = 0, At = null, Te = z.next(); xe !== null && !Te.done; Se++, Te = z.next()) {
        xe.index > Se ? (At = xe, xe = null) : At = xe.sibling;
        var ri = q(L, xe, Te.value, te);
        if (ri === null) {
          xe === null && (xe = At);
          break;
        }
        i && xe && ri.alternate === null && o(L, xe), M = g(ri, M, Se), ge === null ? pe = ri : ge.sibling = ri, ge = ri, xe = At;
      }
      if (Te.done) return s(
        L,
        xe
      ), Ye && wi(L, Se), pe;
      if (xe === null) {
        for (; !Te.done; Se++, Te = z.next()) Te = Q(L, Te.value, te), Te !== null && (M = g(Te, M, Se), ge === null ? pe = Te : ge.sibling = Te, ge = Te);
        return Ye && wi(L, Se), pe;
      }
      for (xe = v(L, xe); !Te.done; Se++, Te = z.next()) Te = le(xe, L, Se, Te.value, te), Te !== null && (i && Te.alternate !== null && xe.delete(Te.key === null ? Se : Te.key), M = g(Te, M, Se), ge === null ? pe = Te : ge.sibling = Te, ge = Te);
      return i && xe.forEach(function(bj) {
        return o(L, bj);
      }), Ye && wi(L, Se), pe;
    }
    function lt(L, M, z, te) {
      if (typeof z == "object" && z !== null && z.type === R && z.key === null && (z = z.props.children), typeof z == "object" && z !== null) {
        switch (z.$$typeof) {
          case _:
            e: {
              for (var pe = z.key, ge = M; ge !== null; ) {
                if (ge.key === pe) {
                  if (pe = z.type, pe === R) {
                    if (ge.tag === 7) {
                      s(L, ge.sibling), M = m(ge, z.props.children), M.return = L, L = M;
                      break e;
                    }
                  } else if (ge.elementType === pe || typeof pe == "object" && pe !== null && pe.$$typeof === fe && zg(pe) === ge.type) {
                    s(L, ge.sibling), M = m(ge, z.props), M.ref = Fo(L, ge, z), M.return = L, L = M;
                    break e;
                  }
                  s(L, ge);
                  break;
                } else o(L, ge);
                ge = ge.sibling;
              }
              z.type === R ? (M = Ii(z.props.children, L.mode, te, z.key), M.return = L, L = M) : (te = ts(z.type, z.key, z.props, null, L.mode, te), te.ref = Fo(L, M, z), te.return = L, L = te);
            }
            return A(L);
          case C:
            e: {
              for (ge = z.key; M !== null; ) {
                if (M.key === ge) if (M.tag === 4 && M.stateNode.containerInfo === z.containerInfo && M.stateNode.implementation === z.implementation) {
                  s(L, M.sibling), M = m(M, z.children || []), M.return = L, L = M;
                  break e;
                } else {
                  s(L, M);
                  break;
                }
                else o(L, M);
                M = M.sibling;
              }
              M = fv(z, L.mode, te), M.return = L, L = M;
            }
            return A(L);
          case fe:
            return ge = z._init, lt(L, M, ge(z._payload), te);
        }
        if (mo(z)) return de(L, M, z, te);
        if (ee(z)) return he(L, M, z, te);
        _u(L, z);
      }
      return typeof z == "string" && z !== "" || typeof z == "number" ? (z = "" + z, M !== null && M.tag === 6 ? (s(L, M.sibling), M = m(M, z), M.return = L, L = M) : (s(L, M), M = cv(z, L.mode, te), M.return = L, L = M), A(L)) : s(L, M);
    }
    return lt;
  }
  var Sa = Bg(!0), Fg = Bg(!1), Tu = Hn(null), Mu = null, Pa = null, bd = null;
  function wd() {
    bd = Pa = Mu = null;
  }
  function Sd(i) {
    var o = Tu.current;
    He(Tu), i._currentValue = o;
  }
  function Pd(i, o, s) {
    for (; i !== null; ) {
      var v = i.alternate;
      if ((i.childLanes & o) !== o ? (i.childLanes |= o, v !== null && (v.childLanes |= o)) : v !== null && (v.childLanes & o) !== o && (v.childLanes |= o), i === s) break;
      i = i.return;
    }
  }
  function Aa(i, o) {
    Mu = i, bd = Pa = null, i = i.dependencies, i !== null && i.firstContext !== null && ((i.lanes & o) !== 0 && (Zt = !0), i.firstContext = null);
  }
  function gr(i) {
    var o = i._currentValue;
    if (bd !== i) if (i = { context: i, memoizedValue: o, next: null }, Pa === null) {
      if (Mu === null) throw Error(r(308));
      Pa = i, Mu.dependencies = { lanes: 0, firstContext: i };
    } else Pa = Pa.next = i;
    return o;
  }
  var Si = null;
  function Ad(i) {
    Si === null ? Si = [i] : Si.push(i);
  }
  function Wg(i, o, s, v) {
    var m = o.interleaved;
    return m === null ? (s.next = s, Ad(o)) : (s.next = m.next, m.next = s), o.interleaved = s, gn(i, v);
  }
  function gn(i, o) {
    i.lanes |= o;
    var s = i.alternate;
    for (s !== null && (s.lanes |= o), s = i, i = i.return; i !== null; ) i.childLanes |= o, s = i.alternate, s !== null && (s.childLanes |= o), s = i, i = i.return;
    return s.tag === 3 ? s.stateNode : null;
  }
  var Yn = !1;
  function Od(i) {
    i.updateQueue = { baseState: i.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function Ug(i, o) {
    i = i.updateQueue, o.updateQueue === i && (o.updateQueue = { baseState: i.baseState, firstBaseUpdate: i.firstBaseUpdate, lastBaseUpdate: i.lastBaseUpdate, shared: i.shared, effects: i.effects });
  }
  function xn(i, o) {
    return { eventTime: i, lane: o, tag: 0, payload: null, callback: null, next: null };
  }
  function qn(i, o, s) {
    var v = i.updateQueue;
    if (v === null) return null;
    if (v = v.shared, (je & 2) !== 0) {
      var m = v.pending;
      return m === null ? o.next = o : (o.next = m.next, m.next = o), v.pending = o, gn(i, s);
    }
    return m = v.interleaved, m === null ? (o.next = o, Ad(v)) : (o.next = m.next, m.next = o), v.interleaved = o, gn(i, s);
  }
  function Du(i, o, s) {
    if (o = o.updateQueue, o !== null && (o = o.shared, (s & 4194240) !== 0)) {
      var v = o.lanes;
      v &= i.pendingLanes, s |= v, o.lanes = s, zf(i, s);
    }
  }
  function Kg(i, o) {
    var s = i.updateQueue, v = i.alternate;
    if (v !== null && (v = v.updateQueue, s === v)) {
      var m = null, g = null;
      if (s = s.firstBaseUpdate, s !== null) {
        do {
          var A = { eventTime: s.eventTime, lane: s.lane, tag: s.tag, payload: s.payload, callback: s.callback, next: null };
          g === null ? m = g = A : g = g.next = A, s = s.next;
        } while (s !== null);
        g === null ? m = g = o : g = g.next = o;
      } else m = g = o;
      s = { baseState: v.baseState, firstBaseUpdate: m, lastBaseUpdate: g, shared: v.shared, effects: v.effects }, i.updateQueue = s;
      return;
    }
    i = s.lastBaseUpdate, i === null ? s.firstBaseUpdate = o : i.next = o, s.lastBaseUpdate = o;
  }
  function Nu(i, o, s, v) {
    var m = i.updateQueue;
    Yn = !1;
    var g = m.firstBaseUpdate, A = m.lastBaseUpdate, j = m.shared.pending;
    if (j !== null) {
      m.shared.pending = null;
      var T = j, B = T.next;
      T.next = null, A === null ? g = B : A.next = B, A = T;
      var X = i.alternate;
      X !== null && (X = X.updateQueue, j = X.lastBaseUpdate, j !== A && (j === null ? X.firstBaseUpdate = B : j.next = B, X.lastBaseUpdate = T));
    }
    if (g !== null) {
      var Q = m.baseState;
      A = 0, X = B = T = null, j = g;
      do {
        var q = j.lane, le = j.eventTime;
        if ((v & q) === q) {
          X !== null && (X = X.next = {
            eventTime: le,
            lane: 0,
            tag: j.tag,
            payload: j.payload,
            callback: j.callback,
            next: null
          });
          e: {
            var de = i, he = j;
            switch (q = o, le = s, he.tag) {
              case 1:
                if (de = he.payload, typeof de == "function") {
                  Q = de.call(le, Q, q);
                  break e;
                }
                Q = de;
                break e;
              case 3:
                de.flags = de.flags & -65537 | 128;
              case 0:
                if (de = he.payload, q = typeof de == "function" ? de.call(le, Q, q) : de, q == null) break e;
                Q = Y({}, Q, q);
                break e;
              case 2:
                Yn = !0;
            }
          }
          j.callback !== null && j.lane !== 0 && (i.flags |= 64, q = m.effects, q === null ? m.effects = [j] : q.push(j));
        } else le = { eventTime: le, lane: q, tag: j.tag, payload: j.payload, callback: j.callback, next: null }, X === null ? (B = X = le, T = Q) : X = X.next = le, A |= q;
        if (j = j.next, j === null) {
          if (j = m.shared.pending, j === null) break;
          q = j, j = q.next, q.next = null, m.lastBaseUpdate = q, m.shared.pending = null;
        }
      } while (!0);
      if (X === null && (T = Q), m.baseState = T, m.firstBaseUpdate = B, m.lastBaseUpdate = X, o = m.shared.interleaved, o !== null) {
        m = o;
        do
          A |= m.lane, m = m.next;
        while (m !== o);
      } else g === null && (m.shared.lanes = 0);
      Oi |= A, i.lanes = A, i.memoizedState = Q;
    }
  }
  function Hg(i, o, s) {
    if (i = o.effects, o.effects = null, i !== null) for (o = 0; o < i.length; o++) {
      var v = i[o], m = v.callback;
      if (m !== null) {
        if (v.callback = null, v = s, typeof m != "function") throw Error(r(191, m));
        m.call(v);
      }
    }
  }
  var Wo = {}, qr = Hn(Wo), Uo = Hn(Wo), Ko = Hn(Wo);
  function Pi(i) {
    if (i === Wo) throw Error(r(174));
    return i;
  }
  function Ed(i, o) {
    switch (We(Ko, o), We(Uo, i), We(qr, Wo), i = o.nodeType, i) {
      case 9:
      case 11:
        o = (o = o.documentElement) ? o.namespaceURI : kf(null, "");
        break;
      default:
        i = i === 8 ? o.parentNode : o, o = i.namespaceURI || null, i = i.tagName, o = kf(o, i);
    }
    He(qr), We(qr, o);
  }
  function Oa() {
    He(qr), He(Uo), He(Ko);
  }
  function Vg(i) {
    Pi(Ko.current);
    var o = Pi(qr.current), s = kf(o, i.type);
    o !== s && (We(Uo, i), We(qr, s));
  }
  function kd(i) {
    Uo.current === i && (He(qr), He(Uo));
  }
  var Ze = Hn(0);
  function $u(i) {
    for (var o = i; o !== null; ) {
      if (o.tag === 13) {
        var s = o.memoizedState;
        if (s !== null && (s = s.dehydrated, s === null || s.data === "$?" || s.data === "$!")) return o;
      } else if (o.tag === 19 && o.memoizedProps.revealOrder !== void 0) {
        if ((o.flags & 128) !== 0) return o;
      } else if (o.child !== null) {
        o.child.return = o, o = o.child;
        continue;
      }
      if (o === i) break;
      for (; o.sibling === null; ) {
        if (o.return === null || o.return === i) return null;
        o = o.return;
      }
      o.sibling.return = o.return, o = o.sibling;
    }
    return null;
  }
  var Cd = [];
  function Id() {
    for (var i = 0; i < Cd.length; i++) Cd[i]._workInProgressVersionPrimary = null;
    Cd.length = 0;
  }
  var Ru = E.ReactCurrentDispatcher, jd = E.ReactCurrentBatchConfig, Ai = 0, Je = null, dt = null, St = null, Lu = !1, Ho = !1, Vo = 0, WI = 0;
  function Rt() {
    throw Error(r(321));
  }
  function _d(i, o) {
    if (o === null) return !1;
    for (var s = 0; s < o.length && s < i.length; s++) if (!Dr(i[s], o[s])) return !1;
    return !0;
  }
  function Td(i, o, s, v, m, g) {
    if (Ai = g, Je = o, o.memoizedState = null, o.updateQueue = null, o.lanes = 0, Ru.current = i === null || i.memoizedState === null ? VI : GI, i = s(v, m), Ho) {
      g = 0;
      do {
        if (Ho = !1, Vo = 0, 25 <= g) throw Error(r(301));
        g += 1, St = dt = null, o.updateQueue = null, Ru.current = YI, i = s(v, m);
      } while (Ho);
    }
    if (Ru.current = Fu, o = dt !== null && dt.next !== null, Ai = 0, St = dt = Je = null, Lu = !1, o) throw Error(r(300));
    return i;
  }
  function Md() {
    var i = Vo !== 0;
    return Vo = 0, i;
  }
  function Xr() {
    var i = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return St === null ? Je.memoizedState = St = i : St = St.next = i, St;
  }
  function xr() {
    if (dt === null) {
      var i = Je.alternate;
      i = i !== null ? i.memoizedState : null;
    } else i = dt.next;
    var o = St === null ? Je.memoizedState : St.next;
    if (o !== null) St = o, dt = i;
    else {
      if (i === null) throw Error(r(310));
      dt = i, i = { memoizedState: dt.memoizedState, baseState: dt.baseState, baseQueue: dt.baseQueue, queue: dt.queue, next: null }, St === null ? Je.memoizedState = St = i : St = St.next = i;
    }
    return St;
  }
  function Go(i, o) {
    return typeof o == "function" ? o(i) : o;
  }
  function Dd(i) {
    var o = xr(), s = o.queue;
    if (s === null) throw Error(r(311));
    s.lastRenderedReducer = i;
    var v = dt, m = v.baseQueue, g = s.pending;
    if (g !== null) {
      if (m !== null) {
        var A = m.next;
        m.next = g.next, g.next = A;
      }
      v.baseQueue = m = g, s.pending = null;
    }
    if (m !== null) {
      g = m.next, v = v.baseState;
      var j = A = null, T = null, B = g;
      do {
        var X = B.lane;
        if ((Ai & X) === X) T !== null && (T = T.next = { lane: 0, action: B.action, hasEagerState: B.hasEagerState, eagerState: B.eagerState, next: null }), v = B.hasEagerState ? B.eagerState : i(v, B.action);
        else {
          var Q = {
            lane: X,
            action: B.action,
            hasEagerState: B.hasEagerState,
            eagerState: B.eagerState,
            next: null
          };
          T === null ? (j = T = Q, A = v) : T = T.next = Q, Je.lanes |= X, Oi |= X;
        }
        B = B.next;
      } while (B !== null && B !== g);
      T === null ? A = v : T.next = j, Dr(v, o.memoizedState) || (Zt = !0), o.memoizedState = v, o.baseState = A, o.baseQueue = T, s.lastRenderedState = v;
    }
    if (i = s.interleaved, i !== null) {
      m = i;
      do
        g = m.lane, Je.lanes |= g, Oi |= g, m = m.next;
      while (m !== i);
    } else m === null && (s.lanes = 0);
    return [o.memoizedState, s.dispatch];
  }
  function Nd(i) {
    var o = xr(), s = o.queue;
    if (s === null) throw Error(r(311));
    s.lastRenderedReducer = i;
    var v = s.dispatch, m = s.pending, g = o.memoizedState;
    if (m !== null) {
      s.pending = null;
      var A = m = m.next;
      do
        g = i(g, A.action), A = A.next;
      while (A !== m);
      Dr(g, o.memoizedState) || (Zt = !0), o.memoizedState = g, o.baseQueue === null && (o.baseState = g), s.lastRenderedState = g;
    }
    return [g, v];
  }
  function Gg() {
  }
  function Yg(i, o) {
    var s = Je, v = xr(), m = o(), g = !Dr(v.memoizedState, m);
    if (g && (v.memoizedState = m, Zt = !0), v = v.queue, $d(Qg.bind(null, s, v, i), [i]), v.getSnapshot !== o || g || St !== null && St.memoizedState.tag & 1) {
      if (s.flags |= 2048, Yo(9, Xg.bind(null, s, v, m, o), void 0, null), Pt === null) throw Error(r(349));
      (Ai & 30) !== 0 || qg(s, o, m);
    }
    return m;
  }
  function qg(i, o, s) {
    i.flags |= 16384, i = { getSnapshot: o, value: s }, o = Je.updateQueue, o === null ? (o = { lastEffect: null, stores: null }, Je.updateQueue = o, o.stores = [i]) : (s = o.stores, s === null ? o.stores = [i] : s.push(i));
  }
  function Xg(i, o, s, v) {
    o.value = s, o.getSnapshot = v, Zg(o) && Jg(i);
  }
  function Qg(i, o, s) {
    return s(function() {
      Zg(o) && Jg(i);
    });
  }
  function Zg(i) {
    var o = i.getSnapshot;
    i = i.value;
    try {
      var s = o();
      return !Dr(i, s);
    } catch {
      return !0;
    }
  }
  function Jg(i) {
    var o = gn(i, 1);
    o !== null && zr(o, i, 1, -1);
  }
  function e0(i) {
    var o = Xr();
    return typeof i == "function" && (i = i()), o.memoizedState = o.baseState = i, i = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Go, lastRenderedState: i }, o.queue = i, i = i.dispatch = HI.bind(null, Je, i), [o.memoizedState, i];
  }
  function Yo(i, o, s, v) {
    return i = { tag: i, create: o, destroy: s, deps: v, next: null }, o = Je.updateQueue, o === null ? (o = { lastEffect: null, stores: null }, Je.updateQueue = o, o.lastEffect = i.next = i) : (s = o.lastEffect, s === null ? o.lastEffect = i.next = i : (v = s.next, s.next = i, i.next = v, o.lastEffect = i)), i;
  }
  function t0() {
    return xr().memoizedState;
  }
  function zu(i, o, s, v) {
    var m = Xr();
    Je.flags |= i, m.memoizedState = Yo(1 | o, s, void 0, v === void 0 ? null : v);
  }
  function Bu(i, o, s, v) {
    var m = xr();
    v = v === void 0 ? null : v;
    var g = void 0;
    if (dt !== null) {
      var A = dt.memoizedState;
      if (g = A.destroy, v !== null && _d(v, A.deps)) {
        m.memoizedState = Yo(o, s, g, v);
        return;
      }
    }
    Je.flags |= i, m.memoizedState = Yo(1 | o, s, g, v);
  }
  function r0(i, o) {
    return zu(8390656, 8, i, o);
  }
  function $d(i, o) {
    return Bu(2048, 8, i, o);
  }
  function n0(i, o) {
    return Bu(4, 2, i, o);
  }
  function i0(i, o) {
    return Bu(4, 4, i, o);
  }
  function a0(i, o) {
    if (typeof o == "function") return i = i(), o(i), function() {
      o(null);
    };
    if (o != null) return i = i(), o.current = i, function() {
      o.current = null;
    };
  }
  function o0(i, o, s) {
    return s = s != null ? s.concat([i]) : null, Bu(4, 4, a0.bind(null, o, i), s);
  }
  function Rd() {
  }
  function l0(i, o) {
    var s = xr();
    o = o === void 0 ? null : o;
    var v = s.memoizedState;
    return v !== null && o !== null && _d(o, v[1]) ? v[0] : (s.memoizedState = [i, o], i);
  }
  function u0(i, o) {
    var s = xr();
    o = o === void 0 ? null : o;
    var v = s.memoizedState;
    return v !== null && o !== null && _d(o, v[1]) ? v[0] : (i = i(), s.memoizedState = [i, o], i);
  }
  function s0(i, o, s) {
    return (Ai & 21) === 0 ? (i.baseState && (i.baseState = !1, Zt = !0), i.memoizedState = s) : (Dr(s, o) || (s = zy(), Je.lanes |= s, Oi |= s, i.baseState = !0), o);
  }
  function UI(i, o) {
    var s = ze;
    ze = s !== 0 && 4 > s ? s : 4, i(!0);
    var v = jd.transition;
    jd.transition = {};
    try {
      i(!1), o();
    } finally {
      ze = s, jd.transition = v;
    }
  }
  function c0() {
    return xr().memoizedState;
  }
  function KI(i, o, s) {
    var v = Jn(i);
    if (s = { lane: v, action: s, hasEagerState: !1, eagerState: null, next: null }, f0(i)) d0(o, s);
    else if (s = Wg(i, o, s, v), s !== null) {
      var m = Gt();
      zr(s, i, v, m), v0(s, o, v);
    }
  }
  function HI(i, o, s) {
    var v = Jn(i), m = { lane: v, action: s, hasEagerState: !1, eagerState: null, next: null };
    if (f0(i)) d0(o, m);
    else {
      var g = i.alternate;
      if (i.lanes === 0 && (g === null || g.lanes === 0) && (g = o.lastRenderedReducer, g !== null)) try {
        var A = o.lastRenderedState, j = g(A, s);
        if (m.hasEagerState = !0, m.eagerState = j, Dr(j, A)) {
          var T = o.interleaved;
          T === null ? (m.next = m, Ad(o)) : (m.next = T.next, T.next = m), o.interleaved = m;
          return;
        }
      } catch {
      } finally {
      }
      s = Wg(i, o, m, v), s !== null && (m = Gt(), zr(s, i, v, m), v0(s, o, v));
    }
  }
  function f0(i) {
    var o = i.alternate;
    return i === Je || o !== null && o === Je;
  }
  function d0(i, o) {
    Ho = Lu = !0;
    var s = i.pending;
    s === null ? o.next = o : (o.next = s.next, s.next = o), i.pending = o;
  }
  function v0(i, o, s) {
    if ((s & 4194240) !== 0) {
      var v = o.lanes;
      v &= i.pendingLanes, s |= v, o.lanes = s, zf(i, s);
    }
  }
  var Fu = { readContext: gr, useCallback: Rt, useContext: Rt, useEffect: Rt, useImperativeHandle: Rt, useInsertionEffect: Rt, useLayoutEffect: Rt, useMemo: Rt, useReducer: Rt, useRef: Rt, useState: Rt, useDebugValue: Rt, useDeferredValue: Rt, useTransition: Rt, useMutableSource: Rt, useSyncExternalStore: Rt, useId: Rt, unstable_isNewReconciler: !1 }, VI = { readContext: gr, useCallback: function(i, o) {
    return Xr().memoizedState = [i, o === void 0 ? null : o], i;
  }, useContext: gr, useEffect: r0, useImperativeHandle: function(i, o, s) {
    return s = s != null ? s.concat([i]) : null, zu(
      4194308,
      4,
      a0.bind(null, o, i),
      s
    );
  }, useLayoutEffect: function(i, o) {
    return zu(4194308, 4, i, o);
  }, useInsertionEffect: function(i, o) {
    return zu(4, 2, i, o);
  }, useMemo: function(i, o) {
    var s = Xr();
    return o = o === void 0 ? null : o, i = i(), s.memoizedState = [i, o], i;
  }, useReducer: function(i, o, s) {
    var v = Xr();
    return o = s !== void 0 ? s(o) : o, v.memoizedState = v.baseState = o, i = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: i, lastRenderedState: o }, v.queue = i, i = i.dispatch = KI.bind(null, Je, i), [v.memoizedState, i];
  }, useRef: function(i) {
    var o = Xr();
    return i = { current: i }, o.memoizedState = i;
  }, useState: e0, useDebugValue: Rd, useDeferredValue: function(i) {
    return Xr().memoizedState = i;
  }, useTransition: function() {
    var i = e0(!1), o = i[0];
    return i = UI.bind(null, i[1]), Xr().memoizedState = i, [o, i];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(i, o, s) {
    var v = Je, m = Xr();
    if (Ye) {
      if (s === void 0) throw Error(r(407));
      s = s();
    } else {
      if (s = o(), Pt === null) throw Error(r(349));
      (Ai & 30) !== 0 || qg(v, o, s);
    }
    m.memoizedState = s;
    var g = { value: s, getSnapshot: o };
    return m.queue = g, r0(Qg.bind(
      null,
      v,
      g,
      i
    ), [i]), v.flags |= 2048, Yo(9, Xg.bind(null, v, g, s, o), void 0, null), s;
  }, useId: function() {
    var i = Xr(), o = Pt.identifierPrefix;
    if (Ye) {
      var s = yn, v = mn;
      s = (v & ~(1 << 32 - Mr(v) - 1)).toString(32) + s, o = ":" + o + "R" + s, s = Vo++, 0 < s && (o += "H" + s.toString(32)), o += ":";
    } else s = WI++, o = ":" + o + "r" + s.toString(32) + ":";
    return i.memoizedState = o;
  }, unstable_isNewReconciler: !1 }, GI = {
    readContext: gr,
    useCallback: l0,
    useContext: gr,
    useEffect: $d,
    useImperativeHandle: o0,
    useInsertionEffect: n0,
    useLayoutEffect: i0,
    useMemo: u0,
    useReducer: Dd,
    useRef: t0,
    useState: function() {
      return Dd(Go);
    },
    useDebugValue: Rd,
    useDeferredValue: function(i) {
      var o = xr();
      return s0(o, dt.memoizedState, i);
    },
    useTransition: function() {
      var i = Dd(Go)[0], o = xr().memoizedState;
      return [i, o];
    },
    useMutableSource: Gg,
    useSyncExternalStore: Yg,
    useId: c0,
    unstable_isNewReconciler: !1
  }, YI = { readContext: gr, useCallback: l0, useContext: gr, useEffect: $d, useImperativeHandle: o0, useInsertionEffect: n0, useLayoutEffect: i0, useMemo: u0, useReducer: Nd, useRef: t0, useState: function() {
    return Nd(Go);
  }, useDebugValue: Rd, useDeferredValue: function(i) {
    var o = xr();
    return dt === null ? o.memoizedState = i : s0(o, dt.memoizedState, i);
  }, useTransition: function() {
    var i = Nd(Go)[0], o = xr().memoizedState;
    return [i, o];
  }, useMutableSource: Gg, useSyncExternalStore: Yg, useId: c0, unstable_isNewReconciler: !1 };
  function $r(i, o) {
    if (i && i.defaultProps) {
      o = Y({}, o), i = i.defaultProps;
      for (var s in i) o[s] === void 0 && (o[s] = i[s]);
      return o;
    }
    return o;
  }
  function Ld(i, o, s, v) {
    o = i.memoizedState, s = s(v, o), s = s == null ? o : Y({}, o, s), i.memoizedState = s, i.lanes === 0 && (i.updateQueue.baseState = s);
  }
  var Wu = { isMounted: function(i) {
    return (i = i._reactInternals) ? yi(i) === i : !1;
  }, enqueueSetState: function(i, o, s) {
    i = i._reactInternals;
    var v = Gt(), m = Jn(i), g = xn(v, m);
    g.payload = o, s != null && (g.callback = s), o = qn(i, g, m), o !== null && (zr(o, i, m, v), Du(o, i, m));
  }, enqueueReplaceState: function(i, o, s) {
    i = i._reactInternals;
    var v = Gt(), m = Jn(i), g = xn(v, m);
    g.tag = 1, g.payload = o, s != null && (g.callback = s), o = qn(i, g, m), o !== null && (zr(o, i, m, v), Du(o, i, m));
  }, enqueueForceUpdate: function(i, o) {
    i = i._reactInternals;
    var s = Gt(), v = Jn(i), m = xn(s, v);
    m.tag = 2, o != null && (m.callback = o), o = qn(i, m, v), o !== null && (zr(o, i, v, s), Du(o, i, v));
  } };
  function h0(i, o, s, v, m, g, A) {
    return i = i.stateNode, typeof i.shouldComponentUpdate == "function" ? i.shouldComponentUpdate(v, g, A) : o.prototype && o.prototype.isPureReactComponent ? !Do(s, v) || !Do(m, g) : !0;
  }
  function p0(i, o, s) {
    var v = !1, m = Vn, g = o.contextType;
    return typeof g == "object" && g !== null ? g = gr(g) : (m = Qt(o) ? xi : $t.current, v = o.contextTypes, g = (v = v != null) ? ga(i, m) : Vn), o = new o(s, g), i.memoizedState = o.state !== null && o.state !== void 0 ? o.state : null, o.updater = Wu, i.stateNode = o, o._reactInternals = i, v && (i = i.stateNode, i.__reactInternalMemoizedUnmaskedChildContext = m, i.__reactInternalMemoizedMaskedChildContext = g), o;
  }
  function m0(i, o, s, v) {
    i = o.state, typeof o.componentWillReceiveProps == "function" && o.componentWillReceiveProps(s, v), typeof o.UNSAFE_componentWillReceiveProps == "function" && o.UNSAFE_componentWillReceiveProps(s, v), o.state !== i && Wu.enqueueReplaceState(o, o.state, null);
  }
  function zd(i, o, s, v) {
    var m = i.stateNode;
    m.props = s, m.state = i.memoizedState, m.refs = {}, Od(i);
    var g = o.contextType;
    typeof g == "object" && g !== null ? m.context = gr(g) : (g = Qt(o) ? xi : $t.current, m.context = ga(i, g)), m.state = i.memoizedState, g = o.getDerivedStateFromProps, typeof g == "function" && (Ld(i, o, g, s), m.state = i.memoizedState), typeof o.getDerivedStateFromProps == "function" || typeof m.getSnapshotBeforeUpdate == "function" || typeof m.UNSAFE_componentWillMount != "function" && typeof m.componentWillMount != "function" || (o = m.state, typeof m.componentWillMount == "function" && m.componentWillMount(), typeof m.UNSAFE_componentWillMount == "function" && m.UNSAFE_componentWillMount(), o !== m.state && Wu.enqueueReplaceState(m, m.state, null), Nu(i, s, m, v), m.state = i.memoizedState), typeof m.componentDidMount == "function" && (i.flags |= 4194308);
  }
  function Ea(i, o) {
    try {
      var s = "", v = o;
      do
        s += Pe(v), v = v.return;
      while (v);
      var m = s;
    } catch (g) {
      m = `
Error generating stack: ` + g.message + `
` + g.stack;
    }
    return { value: i, source: o, stack: m, digest: null };
  }
  function Bd(i, o, s) {
    return { value: i, source: null, stack: s ?? null, digest: o ?? null };
  }
  function Fd(i, o) {
    try {
      console.error(o.value);
    } catch (s) {
      setTimeout(function() {
        throw s;
      });
    }
  }
  var qI = typeof WeakMap == "function" ? WeakMap : Map;
  function y0(i, o, s) {
    s = xn(-1, s), s.tag = 3, s.payload = { element: null };
    var v = o.value;
    return s.callback = function() {
      qu || (qu = !0, rv = v), Fd(i, o);
    }, s;
  }
  function g0(i, o, s) {
    s = xn(-1, s), s.tag = 3;
    var v = i.type.getDerivedStateFromError;
    if (typeof v == "function") {
      var m = o.value;
      s.payload = function() {
        return v(m);
      }, s.callback = function() {
        Fd(i, o);
      };
    }
    var g = i.stateNode;
    return g !== null && typeof g.componentDidCatch == "function" && (s.callback = function() {
      Fd(i, o), typeof v != "function" && (Qn === null ? Qn = /* @__PURE__ */ new Set([this]) : Qn.add(this));
      var A = o.stack;
      this.componentDidCatch(o.value, { componentStack: A !== null ? A : "" });
    }), s;
  }
  function x0(i, o, s) {
    var v = i.pingCache;
    if (v === null) {
      v = i.pingCache = new qI();
      var m = /* @__PURE__ */ new Set();
      v.set(o, m);
    } else m = v.get(o), m === void 0 && (m = /* @__PURE__ */ new Set(), v.set(o, m));
    m.has(s) || (m.add(s), i = sj.bind(null, i, o, s), o.then(i, i));
  }
  function b0(i) {
    do {
      var o;
      if ((o = i.tag === 13) && (o = i.memoizedState, o = o !== null ? o.dehydrated !== null : !0), o) return i;
      i = i.return;
    } while (i !== null);
    return null;
  }
  function w0(i, o, s, v, m) {
    return (i.mode & 1) === 0 ? (i === o ? i.flags |= 65536 : (i.flags |= 128, s.flags |= 131072, s.flags &= -52805, s.tag === 1 && (s.alternate === null ? s.tag = 17 : (o = xn(-1, 1), o.tag = 2, qn(s, o, 1))), s.lanes |= 1), i) : (i.flags |= 65536, i.lanes = m, i);
  }
  var XI = E.ReactCurrentOwner, Zt = !1;
  function Vt(i, o, s, v) {
    o.child = i === null ? Fg(o, null, s, v) : Sa(o, i.child, s, v);
  }
  function S0(i, o, s, v, m) {
    s = s.render;
    var g = o.ref;
    return Aa(o, m), v = Td(i, o, s, v, g, m), s = Md(), i !== null && !Zt ? (o.updateQueue = i.updateQueue, o.flags &= -2053, i.lanes &= ~m, bn(i, o, m)) : (Ye && s && pd(o), o.flags |= 1, Vt(i, o, v, m), o.child);
  }
  function P0(i, o, s, v, m) {
    if (i === null) {
      var g = s.type;
      return typeof g == "function" && !sv(g) && g.defaultProps === void 0 && s.compare === null && s.defaultProps === void 0 ? (o.tag = 15, o.type = g, A0(i, o, g, v, m)) : (i = ts(s.type, null, v, o, o.mode, m), i.ref = o.ref, i.return = o, o.child = i);
    }
    if (g = i.child, (i.lanes & m) === 0) {
      var A = g.memoizedProps;
      if (s = s.compare, s = s !== null ? s : Do, s(A, v) && i.ref === o.ref) return bn(i, o, m);
    }
    return o.flags |= 1, i = ti(g, v), i.ref = o.ref, i.return = o, o.child = i;
  }
  function A0(i, o, s, v, m) {
    if (i !== null) {
      var g = i.memoizedProps;
      if (Do(g, v) && i.ref === o.ref) if (Zt = !1, o.pendingProps = v = g, (i.lanes & m) !== 0) (i.flags & 131072) !== 0 && (Zt = !0);
      else return o.lanes = i.lanes, bn(i, o, m);
    }
    return Wd(i, o, s, v, m);
  }
  function O0(i, o, s) {
    var v = o.pendingProps, m = v.children, g = i !== null ? i.memoizedState : null;
    if (v.mode === "hidden") if ((o.mode & 1) === 0) o.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, We(Ca, sr), sr |= s;
    else {
      if ((s & 1073741824) === 0) return i = g !== null ? g.baseLanes | s : s, o.lanes = o.childLanes = 1073741824, o.memoizedState = { baseLanes: i, cachePool: null, transitions: null }, o.updateQueue = null, We(Ca, sr), sr |= i, null;
      o.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, v = g !== null ? g.baseLanes : s, We(Ca, sr), sr |= v;
    }
    else g !== null ? (v = g.baseLanes | s, o.memoizedState = null) : v = s, We(Ca, sr), sr |= v;
    return Vt(i, o, m, s), o.child;
  }
  function E0(i, o) {
    var s = o.ref;
    (i === null && s !== null || i !== null && i.ref !== s) && (o.flags |= 512, o.flags |= 2097152);
  }
  function Wd(i, o, s, v, m) {
    var g = Qt(s) ? xi : $t.current;
    return g = ga(o, g), Aa(o, m), s = Td(i, o, s, v, g, m), v = Md(), i !== null && !Zt ? (o.updateQueue = i.updateQueue, o.flags &= -2053, i.lanes &= ~m, bn(i, o, m)) : (Ye && v && pd(o), o.flags |= 1, Vt(i, o, s, m), o.child);
  }
  function k0(i, o, s, v, m) {
    if (Qt(s)) {
      var g = !0;
      Eu(o);
    } else g = !1;
    if (Aa(o, m), o.stateNode === null) Ku(i, o), p0(o, s, v), zd(o, s, v, m), v = !0;
    else if (i === null) {
      var A = o.stateNode, j = o.memoizedProps;
      A.props = j;
      var T = A.context, B = s.contextType;
      typeof B == "object" && B !== null ? B = gr(B) : (B = Qt(s) ? xi : $t.current, B = ga(o, B));
      var X = s.getDerivedStateFromProps, Q = typeof X == "function" || typeof A.getSnapshotBeforeUpdate == "function";
      Q || typeof A.UNSAFE_componentWillReceiveProps != "function" && typeof A.componentWillReceiveProps != "function" || (j !== v || T !== B) && m0(o, A, v, B), Yn = !1;
      var q = o.memoizedState;
      A.state = q, Nu(o, v, A, m), T = o.memoizedState, j !== v || q !== T || Xt.current || Yn ? (typeof X == "function" && (Ld(o, s, X, v), T = o.memoizedState), (j = Yn || h0(o, s, j, v, q, T, B)) ? (Q || typeof A.UNSAFE_componentWillMount != "function" && typeof A.componentWillMount != "function" || (typeof A.componentWillMount == "function" && A.componentWillMount(), typeof A.UNSAFE_componentWillMount == "function" && A.UNSAFE_componentWillMount()), typeof A.componentDidMount == "function" && (o.flags |= 4194308)) : (typeof A.componentDidMount == "function" && (o.flags |= 4194308), o.memoizedProps = v, o.memoizedState = T), A.props = v, A.state = T, A.context = B, v = j) : (typeof A.componentDidMount == "function" && (o.flags |= 4194308), v = !1);
    } else {
      A = o.stateNode, Ug(i, o), j = o.memoizedProps, B = o.type === o.elementType ? j : $r(o.type, j), A.props = B, Q = o.pendingProps, q = A.context, T = s.contextType, typeof T == "object" && T !== null ? T = gr(T) : (T = Qt(s) ? xi : $t.current, T = ga(o, T));
      var le = s.getDerivedStateFromProps;
      (X = typeof le == "function" || typeof A.getSnapshotBeforeUpdate == "function") || typeof A.UNSAFE_componentWillReceiveProps != "function" && typeof A.componentWillReceiveProps != "function" || (j !== Q || q !== T) && m0(o, A, v, T), Yn = !1, q = o.memoizedState, A.state = q, Nu(o, v, A, m);
      var de = o.memoizedState;
      j !== Q || q !== de || Xt.current || Yn ? (typeof le == "function" && (Ld(o, s, le, v), de = o.memoizedState), (B = Yn || h0(o, s, B, v, q, de, T) || !1) ? (X || typeof A.UNSAFE_componentWillUpdate != "function" && typeof A.componentWillUpdate != "function" || (typeof A.componentWillUpdate == "function" && A.componentWillUpdate(v, de, T), typeof A.UNSAFE_componentWillUpdate == "function" && A.UNSAFE_componentWillUpdate(v, de, T)), typeof A.componentDidUpdate == "function" && (o.flags |= 4), typeof A.getSnapshotBeforeUpdate == "function" && (o.flags |= 1024)) : (typeof A.componentDidUpdate != "function" || j === i.memoizedProps && q === i.memoizedState || (o.flags |= 4), typeof A.getSnapshotBeforeUpdate != "function" || j === i.memoizedProps && q === i.memoizedState || (o.flags |= 1024), o.memoizedProps = v, o.memoizedState = de), A.props = v, A.state = de, A.context = T, v = B) : (typeof A.componentDidUpdate != "function" || j === i.memoizedProps && q === i.memoizedState || (o.flags |= 4), typeof A.getSnapshotBeforeUpdate != "function" || j === i.memoizedProps && q === i.memoizedState || (o.flags |= 1024), v = !1);
    }
    return Ud(i, o, s, v, g, m);
  }
  function Ud(i, o, s, v, m, g) {
    E0(i, o);
    var A = (o.flags & 128) !== 0;
    if (!v && !A) return m && Tg(o, s, !1), bn(i, o, g);
    v = o.stateNode, XI.current = o;
    var j = A && typeof s.getDerivedStateFromError != "function" ? null : v.render();
    return o.flags |= 1, i !== null && A ? (o.child = Sa(o, i.child, null, g), o.child = Sa(o, null, j, g)) : Vt(i, o, j, g), o.memoizedState = v.state, m && Tg(o, s, !0), o.child;
  }
  function C0(i) {
    var o = i.stateNode;
    o.pendingContext ? jg(i, o.pendingContext, o.pendingContext !== o.context) : o.context && jg(i, o.context, !1), Ed(i, o.containerInfo);
  }
  function I0(i, o, s, v, m) {
    return wa(), xd(m), o.flags |= 256, Vt(i, o, s, v), o.child;
  }
  var Kd = { dehydrated: null, treeContext: null, retryLane: 0 };
  function Hd(i) {
    return { baseLanes: i, cachePool: null, transitions: null };
  }
  function j0(i, o, s) {
    var v = o.pendingProps, m = Ze.current, g = !1, A = (o.flags & 128) !== 0, j;
    if ((j = A) || (j = i !== null && i.memoizedState === null ? !1 : (m & 2) !== 0), j ? (g = !0, o.flags &= -129) : (i === null || i.memoizedState !== null) && (m |= 1), We(Ze, m & 1), i === null)
      return gd(o), i = o.memoizedState, i !== null && (i = i.dehydrated, i !== null) ? ((o.mode & 1) === 0 ? o.lanes = 1 : i.data === "$!" ? o.lanes = 8 : o.lanes = 1073741824, null) : (A = v.children, i = v.fallback, g ? (v = o.mode, g = o.child, A = { mode: "hidden", children: A }, (v & 1) === 0 && g !== null ? (g.childLanes = 0, g.pendingProps = A) : g = rs(A, v, 0, null), i = Ii(i, v, s, null), g.return = o, i.return = o, g.sibling = i, o.child = g, o.child.memoizedState = Hd(s), o.memoizedState = Kd, i) : Vd(o, A));
    if (m = i.memoizedState, m !== null && (j = m.dehydrated, j !== null)) return QI(i, o, A, v, j, m, s);
    if (g) {
      g = v.fallback, A = o.mode, m = i.child, j = m.sibling;
      var T = { mode: "hidden", children: v.children };
      return (A & 1) === 0 && o.child !== m ? (v = o.child, v.childLanes = 0, v.pendingProps = T, o.deletions = null) : (v = ti(m, T), v.subtreeFlags = m.subtreeFlags & 14680064), j !== null ? g = ti(j, g) : (g = Ii(g, A, s, null), g.flags |= 2), g.return = o, v.return = o, v.sibling = g, o.child = v, v = g, g = o.child, A = i.child.memoizedState, A = A === null ? Hd(s) : { baseLanes: A.baseLanes | s, cachePool: null, transitions: A.transitions }, g.memoizedState = A, g.childLanes = i.childLanes & ~s, o.memoizedState = Kd, v;
    }
    return g = i.child, i = g.sibling, v = ti(g, { mode: "visible", children: v.children }), (o.mode & 1) === 0 && (v.lanes = s), v.return = o, v.sibling = null, i !== null && (s = o.deletions, s === null ? (o.deletions = [i], o.flags |= 16) : s.push(i)), o.child = v, o.memoizedState = null, v;
  }
  function Vd(i, o) {
    return o = rs({ mode: "visible", children: o }, i.mode, 0, null), o.return = i, i.child = o;
  }
  function Uu(i, o, s, v) {
    return v !== null && xd(v), Sa(o, i.child, null, s), i = Vd(o, o.pendingProps.children), i.flags |= 2, o.memoizedState = null, i;
  }
  function QI(i, o, s, v, m, g, A) {
    if (s)
      return o.flags & 256 ? (o.flags &= -257, v = Bd(Error(r(422))), Uu(i, o, A, v)) : o.memoizedState !== null ? (o.child = i.child, o.flags |= 128, null) : (g = v.fallback, m = o.mode, v = rs({ mode: "visible", children: v.children }, m, 0, null), g = Ii(g, m, A, null), g.flags |= 2, v.return = o, g.return = o, v.sibling = g, o.child = v, (o.mode & 1) !== 0 && Sa(o, i.child, null, A), o.child.memoizedState = Hd(A), o.memoizedState = Kd, g);
    if ((o.mode & 1) === 0) return Uu(i, o, A, null);
    if (m.data === "$!") {
      if (v = m.nextSibling && m.nextSibling.dataset, v) var j = v.dgst;
      return v = j, g = Error(r(419)), v = Bd(g, v, void 0), Uu(i, o, A, v);
    }
    if (j = (A & i.childLanes) !== 0, Zt || j) {
      if (v = Pt, v !== null) {
        switch (A & -A) {
          case 4:
            m = 2;
            break;
          case 16:
            m = 8;
            break;
          case 64:
          case 128:
          case 256:
          case 512:
          case 1024:
          case 2048:
          case 4096:
          case 8192:
          case 16384:
          case 32768:
          case 65536:
          case 131072:
          case 262144:
          case 524288:
          case 1048576:
          case 2097152:
          case 4194304:
          case 8388608:
          case 16777216:
          case 33554432:
          case 67108864:
            m = 32;
            break;
          case 536870912:
            m = 268435456;
            break;
          default:
            m = 0;
        }
        m = (m & (v.suspendedLanes | A)) !== 0 ? 0 : m, m !== 0 && m !== g.retryLane && (g.retryLane = m, gn(i, m), zr(v, i, m, -1));
      }
      return uv(), v = Bd(Error(r(421))), Uu(i, o, A, v);
    }
    return m.data === "$?" ? (o.flags |= 128, o.child = i.child, o = cj.bind(null, i), m._reactRetry = o, null) : (i = g.treeContext, ur = Kn(m.nextSibling), lr = o, Ye = !0, Nr = null, i !== null && (mr[yr++] = mn, mr[yr++] = yn, mr[yr++] = bi, mn = i.id, yn = i.overflow, bi = o), o = Vd(o, v.children), o.flags |= 4096, o);
  }
  function _0(i, o, s) {
    i.lanes |= o;
    var v = i.alternate;
    v !== null && (v.lanes |= o), Pd(i.return, o, s);
  }
  function Gd(i, o, s, v, m) {
    var g = i.memoizedState;
    g === null ? i.memoizedState = { isBackwards: o, rendering: null, renderingStartTime: 0, last: v, tail: s, tailMode: m } : (g.isBackwards = o, g.rendering = null, g.renderingStartTime = 0, g.last = v, g.tail = s, g.tailMode = m);
  }
  function T0(i, o, s) {
    var v = o.pendingProps, m = v.revealOrder, g = v.tail;
    if (Vt(i, o, v.children, s), v = Ze.current, (v & 2) !== 0) v = v & 1 | 2, o.flags |= 128;
    else {
      if (i !== null && (i.flags & 128) !== 0) e: for (i = o.child; i !== null; ) {
        if (i.tag === 13) i.memoizedState !== null && _0(i, s, o);
        else if (i.tag === 19) _0(i, s, o);
        else if (i.child !== null) {
          i.child.return = i, i = i.child;
          continue;
        }
        if (i === o) break e;
        for (; i.sibling === null; ) {
          if (i.return === null || i.return === o) break e;
          i = i.return;
        }
        i.sibling.return = i.return, i = i.sibling;
      }
      v &= 1;
    }
    if (We(Ze, v), (o.mode & 1) === 0) o.memoizedState = null;
    else switch (m) {
      case "forwards":
        for (s = o.child, m = null; s !== null; ) i = s.alternate, i !== null && $u(i) === null && (m = s), s = s.sibling;
        s = m, s === null ? (m = o.child, o.child = null) : (m = s.sibling, s.sibling = null), Gd(o, !1, m, s, g);
        break;
      case "backwards":
        for (s = null, m = o.child, o.child = null; m !== null; ) {
          if (i = m.alternate, i !== null && $u(i) === null) {
            o.child = m;
            break;
          }
          i = m.sibling, m.sibling = s, s = m, m = i;
        }
        Gd(o, !0, s, null, g);
        break;
      case "together":
        Gd(o, !1, null, null, void 0);
        break;
      default:
        o.memoizedState = null;
    }
    return o.child;
  }
  function Ku(i, o) {
    (o.mode & 1) === 0 && i !== null && (i.alternate = null, o.alternate = null, o.flags |= 2);
  }
  function bn(i, o, s) {
    if (i !== null && (o.dependencies = i.dependencies), Oi |= o.lanes, (s & o.childLanes) === 0) return null;
    if (i !== null && o.child !== i.child) throw Error(r(153));
    if (o.child !== null) {
      for (i = o.child, s = ti(i, i.pendingProps), o.child = s, s.return = o; i.sibling !== null; ) i = i.sibling, s = s.sibling = ti(i, i.pendingProps), s.return = o;
      s.sibling = null;
    }
    return o.child;
  }
  function ZI(i, o, s) {
    switch (o.tag) {
      case 3:
        C0(o), wa();
        break;
      case 5:
        Vg(o);
        break;
      case 1:
        Qt(o.type) && Eu(o);
        break;
      case 4:
        Ed(o, o.stateNode.containerInfo);
        break;
      case 10:
        var v = o.type._context, m = o.memoizedProps.value;
        We(Tu, v._currentValue), v._currentValue = m;
        break;
      case 13:
        if (v = o.memoizedState, v !== null)
          return v.dehydrated !== null ? (We(Ze, Ze.current & 1), o.flags |= 128, null) : (s & o.child.childLanes) !== 0 ? j0(i, o, s) : (We(Ze, Ze.current & 1), i = bn(i, o, s), i !== null ? i.sibling : null);
        We(Ze, Ze.current & 1);
        break;
      case 19:
        if (v = (s & o.childLanes) !== 0, (i.flags & 128) !== 0) {
          if (v) return T0(i, o, s);
          o.flags |= 128;
        }
        if (m = o.memoizedState, m !== null && (m.rendering = null, m.tail = null, m.lastEffect = null), We(Ze, Ze.current), v) break;
        return null;
      case 22:
      case 23:
        return o.lanes = 0, O0(i, o, s);
    }
    return bn(i, o, s);
  }
  var M0, Yd, D0, N0;
  M0 = function(i, o) {
    for (var s = o.child; s !== null; ) {
      if (s.tag === 5 || s.tag === 6) i.appendChild(s.stateNode);
      else if (s.tag !== 4 && s.child !== null) {
        s.child.return = s, s = s.child;
        continue;
      }
      if (s === o) break;
      for (; s.sibling === null; ) {
        if (s.return === null || s.return === o) return;
        s = s.return;
      }
      s.sibling.return = s.return, s = s.sibling;
    }
  }, Yd = function() {
  }, D0 = function(i, o, s, v) {
    var m = i.memoizedProps;
    if (m !== v) {
      i = o.stateNode, Pi(qr.current);
      var g = null;
      switch (s) {
        case "input":
          m = _e(i, m), v = _e(i, v), g = [];
          break;
        case "select":
          m = Y({}, m, { value: void 0 }), v = Y({}, v, { value: void 0 }), g = [];
          break;
        case "textarea":
          m = Ef(i, m), v = Ef(i, v), g = [];
          break;
        default:
          typeof m.onClick != "function" && typeof v.onClick == "function" && (i.onclick = Pu);
      }
      Cf(s, v);
      var A;
      s = null;
      for (B in m) if (!v.hasOwnProperty(B) && m.hasOwnProperty(B) && m[B] != null) if (B === "style") {
        var j = m[B];
        for (A in j) j.hasOwnProperty(A) && (s || (s = {}), s[A] = "");
      } else B !== "dangerouslySetInnerHTML" && B !== "children" && B !== "suppressContentEditableWarning" && B !== "suppressHydrationWarning" && B !== "autoFocus" && (a.hasOwnProperty(B) ? g || (g = []) : (g = g || []).push(B, null));
      for (B in v) {
        var T = v[B];
        if (j = m != null ? m[B] : void 0, v.hasOwnProperty(B) && T !== j && (T != null || j != null)) if (B === "style") if (j) {
          for (A in j) !j.hasOwnProperty(A) || T && T.hasOwnProperty(A) || (s || (s = {}), s[A] = "");
          for (A in T) T.hasOwnProperty(A) && j[A] !== T[A] && (s || (s = {}), s[A] = T[A]);
        } else s || (g || (g = []), g.push(
          B,
          s
        )), s = T;
        else B === "dangerouslySetInnerHTML" ? (T = T ? T.__html : void 0, j = j ? j.__html : void 0, T != null && j !== T && (g = g || []).push(B, T)) : B === "children" ? typeof T != "string" && typeof T != "number" || (g = g || []).push(B, "" + T) : B !== "suppressContentEditableWarning" && B !== "suppressHydrationWarning" && (a.hasOwnProperty(B) ? (T != null && B === "onScroll" && Ke("scroll", i), g || j === T || (g = [])) : (g = g || []).push(B, T));
      }
      s && (g = g || []).push("style", s);
      var B = g;
      (o.updateQueue = B) && (o.flags |= 4);
    }
  }, N0 = function(i, o, s, v) {
    s !== v && (o.flags |= 4);
  };
  function qo(i, o) {
    if (!Ye) switch (i.tailMode) {
      case "hidden":
        o = i.tail;
        for (var s = null; o !== null; ) o.alternate !== null && (s = o), o = o.sibling;
        s === null ? i.tail = null : s.sibling = null;
        break;
      case "collapsed":
        s = i.tail;
        for (var v = null; s !== null; ) s.alternate !== null && (v = s), s = s.sibling;
        v === null ? o || i.tail === null ? i.tail = null : i.tail.sibling = null : v.sibling = null;
    }
  }
  function Lt(i) {
    var o = i.alternate !== null && i.alternate.child === i.child, s = 0, v = 0;
    if (o) for (var m = i.child; m !== null; ) s |= m.lanes | m.childLanes, v |= m.subtreeFlags & 14680064, v |= m.flags & 14680064, m.return = i, m = m.sibling;
    else for (m = i.child; m !== null; ) s |= m.lanes | m.childLanes, v |= m.subtreeFlags, v |= m.flags, m.return = i, m = m.sibling;
    return i.subtreeFlags |= v, i.childLanes = s, o;
  }
  function JI(i, o, s) {
    var v = o.pendingProps;
    switch (md(o), o.tag) {
      case 2:
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return Lt(o), null;
      case 1:
        return Qt(o.type) && Ou(), Lt(o), null;
      case 3:
        return v = o.stateNode, Oa(), He(Xt), He($t), Id(), v.pendingContext && (v.context = v.pendingContext, v.pendingContext = null), (i === null || i.child === null) && (ju(o) ? o.flags |= 4 : i === null || i.memoizedState.isDehydrated && (o.flags & 256) === 0 || (o.flags |= 1024, Nr !== null && (av(Nr), Nr = null))), Yd(i, o), Lt(o), null;
      case 5:
        kd(o);
        var m = Pi(Ko.current);
        if (s = o.type, i !== null && o.stateNode != null) D0(i, o, s, v, m), i.ref !== o.ref && (o.flags |= 512, o.flags |= 2097152);
        else {
          if (!v) {
            if (o.stateNode === null) throw Error(r(166));
            return Lt(o), null;
          }
          if (i = Pi(qr.current), ju(o)) {
            v = o.stateNode, s = o.type;
            var g = o.memoizedProps;
            switch (v[Yr] = o, v[zo] = g, i = (o.mode & 1) !== 0, s) {
              case "dialog":
                Ke("cancel", v), Ke("close", v);
                break;
              case "iframe":
              case "object":
              case "embed":
                Ke("load", v);
                break;
              case "video":
              case "audio":
                for (m = 0; m < $o.length; m++) Ke($o[m], v);
                break;
              case "source":
                Ke("error", v);
                break;
              case "img":
              case "image":
              case "link":
                Ke(
                  "error",
                  v
                ), Ke("load", v);
                break;
              case "details":
                Ke("toggle", v);
                break;
              case "input":
                be(v, g), Ke("invalid", v);
                break;
              case "select":
                v._wrapperState = { wasMultiple: !!g.multiple }, Ke("invalid", v);
                break;
              case "textarea":
                gy(v, g), Ke("invalid", v);
            }
            Cf(s, g), m = null;
            for (var A in g) if (g.hasOwnProperty(A)) {
              var j = g[A];
              A === "children" ? typeof j == "string" ? v.textContent !== j && (g.suppressHydrationWarning !== !0 && Su(v.textContent, j, i), m = ["children", j]) : typeof j == "number" && v.textContent !== "" + j && (g.suppressHydrationWarning !== !0 && Su(
                v.textContent,
                j,
                i
              ), m = ["children", "" + j]) : a.hasOwnProperty(A) && j != null && A === "onScroll" && Ke("scroll", v);
            }
            switch (s) {
              case "input":
                we(v), po(v, g, !0);
                break;
              case "textarea":
                we(v), by(v);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof g.onClick == "function" && (v.onclick = Pu);
            }
            v = m, o.updateQueue = v, v !== null && (o.flags |= 4);
          } else {
            A = m.nodeType === 9 ? m : m.ownerDocument, i === "http://www.w3.org/1999/xhtml" && (i = wy(s)), i === "http://www.w3.org/1999/xhtml" ? s === "script" ? (i = A.createElement("div"), i.innerHTML = "<script><\/script>", i = i.removeChild(i.firstChild)) : typeof v.is == "string" ? i = A.createElement(s, { is: v.is }) : (i = A.createElement(s), s === "select" && (A = i, v.multiple ? A.multiple = !0 : v.size && (A.size = v.size))) : i = A.createElementNS(i, s), i[Yr] = o, i[zo] = v, M0(i, o, !1, !1), o.stateNode = i;
            e: {
              switch (A = If(s, v), s) {
                case "dialog":
                  Ke("cancel", i), Ke("close", i), m = v;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  Ke("load", i), m = v;
                  break;
                case "video":
                case "audio":
                  for (m = 0; m < $o.length; m++) Ke($o[m], i);
                  m = v;
                  break;
                case "source":
                  Ke("error", i), m = v;
                  break;
                case "img":
                case "image":
                case "link":
                  Ke(
                    "error",
                    i
                  ), Ke("load", i), m = v;
                  break;
                case "details":
                  Ke("toggle", i), m = v;
                  break;
                case "input":
                  be(i, v), m = _e(i, v), Ke("invalid", i);
                  break;
                case "option":
                  m = v;
                  break;
                case "select":
                  i._wrapperState = { wasMultiple: !!v.multiple }, m = Y({}, v, { value: void 0 }), Ke("invalid", i);
                  break;
                case "textarea":
                  gy(i, v), m = Ef(i, v), Ke("invalid", i);
                  break;
                default:
                  m = v;
              }
              Cf(s, m), j = m;
              for (g in j) if (j.hasOwnProperty(g)) {
                var T = j[g];
                g === "style" ? Ay(i, T) : g === "dangerouslySetInnerHTML" ? (T = T ? T.__html : void 0, T != null && Sy(i, T)) : g === "children" ? typeof T == "string" ? (s !== "textarea" || T !== "") && yo(i, T) : typeof T == "number" && yo(i, "" + T) : g !== "suppressContentEditableWarning" && g !== "suppressHydrationWarning" && g !== "autoFocus" && (a.hasOwnProperty(g) ? T != null && g === "onScroll" && Ke("scroll", i) : T != null && I(i, g, T, A));
              }
              switch (s) {
                case "input":
                  we(i), po(i, v, !1);
                  break;
                case "textarea":
                  we(i), by(i);
                  break;
                case "option":
                  v.value != null && i.setAttribute("value", "" + ke(v.value));
                  break;
                case "select":
                  i.multiple = !!v.multiple, g = v.value, g != null ? oa(i, !!v.multiple, g, !1) : v.defaultValue != null && oa(
                    i,
                    !!v.multiple,
                    v.defaultValue,
                    !0
                  );
                  break;
                default:
                  typeof m.onClick == "function" && (i.onclick = Pu);
              }
              switch (s) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  v = !!v.autoFocus;
                  break e;
                case "img":
                  v = !0;
                  break e;
                default:
                  v = !1;
              }
            }
            v && (o.flags |= 4);
          }
          o.ref !== null && (o.flags |= 512, o.flags |= 2097152);
        }
        return Lt(o), null;
      case 6:
        if (i && o.stateNode != null) N0(i, o, i.memoizedProps, v);
        else {
          if (typeof v != "string" && o.stateNode === null) throw Error(r(166));
          if (s = Pi(Ko.current), Pi(qr.current), ju(o)) {
            if (v = o.stateNode, s = o.memoizedProps, v[Yr] = o, (g = v.nodeValue !== s) && (i = lr, i !== null)) switch (i.tag) {
              case 3:
                Su(v.nodeValue, s, (i.mode & 1) !== 0);
                break;
              case 5:
                i.memoizedProps.suppressHydrationWarning !== !0 && Su(v.nodeValue, s, (i.mode & 1) !== 0);
            }
            g && (o.flags |= 4);
          } else v = (s.nodeType === 9 ? s : s.ownerDocument).createTextNode(v), v[Yr] = o, o.stateNode = v;
        }
        return Lt(o), null;
      case 13:
        if (He(Ze), v = o.memoizedState, i === null || i.memoizedState !== null && i.memoizedState.dehydrated !== null) {
          if (Ye && ur !== null && (o.mode & 1) !== 0 && (o.flags & 128) === 0) Lg(), wa(), o.flags |= 98560, g = !1;
          else if (g = ju(o), v !== null && v.dehydrated !== null) {
            if (i === null) {
              if (!g) throw Error(r(318));
              if (g = o.memoizedState, g = g !== null ? g.dehydrated : null, !g) throw Error(r(317));
              g[Yr] = o;
            } else wa(), (o.flags & 128) === 0 && (o.memoizedState = null), o.flags |= 4;
            Lt(o), g = !1;
          } else Nr !== null && (av(Nr), Nr = null), g = !0;
          if (!g) return o.flags & 65536 ? o : null;
        }
        return (o.flags & 128) !== 0 ? (o.lanes = s, o) : (v = v !== null, v !== (i !== null && i.memoizedState !== null) && v && (o.child.flags |= 8192, (o.mode & 1) !== 0 && (i === null || (Ze.current & 1) !== 0 ? vt === 0 && (vt = 3) : uv())), o.updateQueue !== null && (o.flags |= 4), Lt(o), null);
      case 4:
        return Oa(), Yd(i, o), i === null && Ro(o.stateNode.containerInfo), Lt(o), null;
      case 10:
        return Sd(o.type._context), Lt(o), null;
      case 17:
        return Qt(o.type) && Ou(), Lt(o), null;
      case 19:
        if (He(Ze), g = o.memoizedState, g === null) return Lt(o), null;
        if (v = (o.flags & 128) !== 0, A = g.rendering, A === null) if (v) qo(g, !1);
        else {
          if (vt !== 0 || i !== null && (i.flags & 128) !== 0) for (i = o.child; i !== null; ) {
            if (A = $u(i), A !== null) {
              for (o.flags |= 128, qo(g, !1), v = A.updateQueue, v !== null && (o.updateQueue = v, o.flags |= 4), o.subtreeFlags = 0, v = s, s = o.child; s !== null; ) g = s, i = v, g.flags &= 14680066, A = g.alternate, A === null ? (g.childLanes = 0, g.lanes = i, g.child = null, g.subtreeFlags = 0, g.memoizedProps = null, g.memoizedState = null, g.updateQueue = null, g.dependencies = null, g.stateNode = null) : (g.childLanes = A.childLanes, g.lanes = A.lanes, g.child = A.child, g.subtreeFlags = 0, g.deletions = null, g.memoizedProps = A.memoizedProps, g.memoizedState = A.memoizedState, g.updateQueue = A.updateQueue, g.type = A.type, i = A.dependencies, g.dependencies = i === null ? null : { lanes: i.lanes, firstContext: i.firstContext }), s = s.sibling;
              return We(Ze, Ze.current & 1 | 2), o.child;
            }
            i = i.sibling;
          }
          g.tail !== null && ot() > Ia && (o.flags |= 128, v = !0, qo(g, !1), o.lanes = 4194304);
        }
        else {
          if (!v) if (i = $u(A), i !== null) {
            if (o.flags |= 128, v = !0, s = i.updateQueue, s !== null && (o.updateQueue = s, o.flags |= 4), qo(g, !0), g.tail === null && g.tailMode === "hidden" && !A.alternate && !Ye) return Lt(o), null;
          } else 2 * ot() - g.renderingStartTime > Ia && s !== 1073741824 && (o.flags |= 128, v = !0, qo(g, !1), o.lanes = 4194304);
          g.isBackwards ? (A.sibling = o.child, o.child = A) : (s = g.last, s !== null ? s.sibling = A : o.child = A, g.last = A);
        }
        return g.tail !== null ? (o = g.tail, g.rendering = o, g.tail = o.sibling, g.renderingStartTime = ot(), o.sibling = null, s = Ze.current, We(Ze, v ? s & 1 | 2 : s & 1), o) : (Lt(o), null);
      case 22:
      case 23:
        return lv(), v = o.memoizedState !== null, i !== null && i.memoizedState !== null !== v && (o.flags |= 8192), v && (o.mode & 1) !== 0 ? (sr & 1073741824) !== 0 && (Lt(o), o.subtreeFlags & 6 && (o.flags |= 8192)) : Lt(o), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(r(156, o.tag));
  }
  function ej(i, o) {
    switch (md(o), o.tag) {
      case 1:
        return Qt(o.type) && Ou(), i = o.flags, i & 65536 ? (o.flags = i & -65537 | 128, o) : null;
      case 3:
        return Oa(), He(Xt), He($t), Id(), i = o.flags, (i & 65536) !== 0 && (i & 128) === 0 ? (o.flags = i & -65537 | 128, o) : null;
      case 5:
        return kd(o), null;
      case 13:
        if (He(Ze), i = o.memoizedState, i !== null && i.dehydrated !== null) {
          if (o.alternate === null) throw Error(r(340));
          wa();
        }
        return i = o.flags, i & 65536 ? (o.flags = i & -65537 | 128, o) : null;
      case 19:
        return He(Ze), null;
      case 4:
        return Oa(), null;
      case 10:
        return Sd(o.type._context), null;
      case 22:
      case 23:
        return lv(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var Hu = !1, zt = !1, tj = typeof WeakSet == "function" ? WeakSet : Set, se = null;
  function ka(i, o) {
    var s = i.ref;
    if (s !== null) if (typeof s == "function") try {
      s(null);
    } catch (v) {
      rt(i, o, v);
    }
    else s.current = null;
  }
  function qd(i, o, s) {
    try {
      s();
    } catch (v) {
      rt(i, o, v);
    }
  }
  var $0 = !1;
  function rj(i, o) {
    if (ld = fu, i = hg(), Jf(i)) {
      if ("selectionStart" in i) var s = { start: i.selectionStart, end: i.selectionEnd };
      else e: {
        s = (s = i.ownerDocument) && s.defaultView || window;
        var v = s.getSelection && s.getSelection();
        if (v && v.rangeCount !== 0) {
          s = v.anchorNode;
          var m = v.anchorOffset, g = v.focusNode;
          v = v.focusOffset;
          try {
            s.nodeType, g.nodeType;
          } catch {
            s = null;
            break e;
          }
          var A = 0, j = -1, T = -1, B = 0, X = 0, Q = i, q = null;
          t: for (; ; ) {
            for (var le; Q !== s || m !== 0 && Q.nodeType !== 3 || (j = A + m), Q !== g || v !== 0 && Q.nodeType !== 3 || (T = A + v), Q.nodeType === 3 && (A += Q.nodeValue.length), (le = Q.firstChild) !== null; )
              q = Q, Q = le;
            for (; ; ) {
              if (Q === i) break t;
              if (q === s && ++B === m && (j = A), q === g && ++X === v && (T = A), (le = Q.nextSibling) !== null) break;
              Q = q, q = Q.parentNode;
            }
            Q = le;
          }
          s = j === -1 || T === -1 ? null : { start: j, end: T };
        } else s = null;
      }
      s = s || { start: 0, end: 0 };
    } else s = null;
    for (ud = { focusedElem: i, selectionRange: s }, fu = !1, se = o; se !== null; ) if (o = se, i = o.child, (o.subtreeFlags & 1028) !== 0 && i !== null) i.return = o, se = i;
    else for (; se !== null; ) {
      o = se;
      try {
        var de = o.alternate;
        if ((o.flags & 1024) !== 0) switch (o.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (de !== null) {
              var he = de.memoizedProps, lt = de.memoizedState, L = o.stateNode, M = L.getSnapshotBeforeUpdate(o.elementType === o.type ? he : $r(o.type, he), lt);
              L.__reactInternalSnapshotBeforeUpdate = M;
            }
            break;
          case 3:
            var z = o.stateNode.containerInfo;
            z.nodeType === 1 ? z.textContent = "" : z.nodeType === 9 && z.documentElement && z.removeChild(z.documentElement);
            break;
          case 5:
          case 6:
          case 4:
          case 17:
            break;
          default:
            throw Error(r(163));
        }
      } catch (te) {
        rt(o, o.return, te);
      }
      if (i = o.sibling, i !== null) {
        i.return = o.return, se = i;
        break;
      }
      se = o.return;
    }
    return de = $0, $0 = !1, de;
  }
  function Xo(i, o, s) {
    var v = o.updateQueue;
    if (v = v !== null ? v.lastEffect : null, v !== null) {
      var m = v = v.next;
      do {
        if ((m.tag & i) === i) {
          var g = m.destroy;
          m.destroy = void 0, g !== void 0 && qd(o, s, g);
        }
        m = m.next;
      } while (m !== v);
    }
  }
  function Vu(i, o) {
    if (o = o.updateQueue, o = o !== null ? o.lastEffect : null, o !== null) {
      var s = o = o.next;
      do {
        if ((s.tag & i) === i) {
          var v = s.create;
          s.destroy = v();
        }
        s = s.next;
      } while (s !== o);
    }
  }
  function Xd(i) {
    var o = i.ref;
    if (o !== null) {
      var s = i.stateNode;
      switch (i.tag) {
        case 5:
          i = s;
          break;
        default:
          i = s;
      }
      typeof o == "function" ? o(i) : o.current = i;
    }
  }
  function R0(i) {
    var o = i.alternate;
    o !== null && (i.alternate = null, R0(o)), i.child = null, i.deletions = null, i.sibling = null, i.tag === 5 && (o = i.stateNode, o !== null && (delete o[Yr], delete o[zo], delete o[dd], delete o[LI], delete o[zI])), i.stateNode = null, i.return = null, i.dependencies = null, i.memoizedProps = null, i.memoizedState = null, i.pendingProps = null, i.stateNode = null, i.updateQueue = null;
  }
  function L0(i) {
    return i.tag === 5 || i.tag === 3 || i.tag === 4;
  }
  function z0(i) {
    e: for (; ; ) {
      for (; i.sibling === null; ) {
        if (i.return === null || L0(i.return)) return null;
        i = i.return;
      }
      for (i.sibling.return = i.return, i = i.sibling; i.tag !== 5 && i.tag !== 6 && i.tag !== 18; ) {
        if (i.flags & 2 || i.child === null || i.tag === 4) continue e;
        i.child.return = i, i = i.child;
      }
      if (!(i.flags & 2)) return i.stateNode;
    }
  }
  function Qd(i, o, s) {
    var v = i.tag;
    if (v === 5 || v === 6) i = i.stateNode, o ? s.nodeType === 8 ? s.parentNode.insertBefore(i, o) : s.insertBefore(i, o) : (s.nodeType === 8 ? (o = s.parentNode, o.insertBefore(i, s)) : (o = s, o.appendChild(i)), s = s._reactRootContainer, s != null || o.onclick !== null || (o.onclick = Pu));
    else if (v !== 4 && (i = i.child, i !== null)) for (Qd(i, o, s), i = i.sibling; i !== null; ) Qd(i, o, s), i = i.sibling;
  }
  function Zd(i, o, s) {
    var v = i.tag;
    if (v === 5 || v === 6) i = i.stateNode, o ? s.insertBefore(i, o) : s.appendChild(i);
    else if (v !== 4 && (i = i.child, i !== null)) for (Zd(i, o, s), i = i.sibling; i !== null; ) Zd(i, o, s), i = i.sibling;
  }
  var It = null, Rr = !1;
  function Xn(i, o, s) {
    for (s = s.child; s !== null; ) B0(i, o, s), s = s.sibling;
  }
  function B0(i, o, s) {
    if (Gr && typeof Gr.onCommitFiberUnmount == "function") try {
      Gr.onCommitFiberUnmount(au, s);
    } catch {
    }
    switch (s.tag) {
      case 5:
        zt || ka(s, o);
      case 6:
        var v = It, m = Rr;
        It = null, Xn(i, o, s), It = v, Rr = m, It !== null && (Rr ? (i = It, s = s.stateNode, i.nodeType === 8 ? i.parentNode.removeChild(s) : i.removeChild(s)) : It.removeChild(s.stateNode));
        break;
      case 18:
        It !== null && (Rr ? (i = It, s = s.stateNode, i.nodeType === 8 ? fd(i.parentNode, s) : i.nodeType === 1 && fd(i, s), Co(i)) : fd(It, s.stateNode));
        break;
      case 4:
        v = It, m = Rr, It = s.stateNode.containerInfo, Rr = !0, Xn(i, o, s), It = v, Rr = m;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!zt && (v = s.updateQueue, v !== null && (v = v.lastEffect, v !== null))) {
          m = v = v.next;
          do {
            var g = m, A = g.destroy;
            g = g.tag, A !== void 0 && ((g & 2) !== 0 || (g & 4) !== 0) && qd(s, o, A), m = m.next;
          } while (m !== v);
        }
        Xn(i, o, s);
        break;
      case 1:
        if (!zt && (ka(s, o), v = s.stateNode, typeof v.componentWillUnmount == "function")) try {
          v.props = s.memoizedProps, v.state = s.memoizedState, v.componentWillUnmount();
        } catch (j) {
          rt(s, o, j);
        }
        Xn(i, o, s);
        break;
      case 21:
        Xn(i, o, s);
        break;
      case 22:
        s.mode & 1 ? (zt = (v = zt) || s.memoizedState !== null, Xn(i, o, s), zt = v) : Xn(i, o, s);
        break;
      default:
        Xn(i, o, s);
    }
  }
  function F0(i) {
    var o = i.updateQueue;
    if (o !== null) {
      i.updateQueue = null;
      var s = i.stateNode;
      s === null && (s = i.stateNode = new tj()), o.forEach(function(v) {
        var m = fj.bind(null, i, v);
        s.has(v) || (s.add(v), v.then(m, m));
      });
    }
  }
  function Lr(i, o) {
    var s = o.deletions;
    if (s !== null) for (var v = 0; v < s.length; v++) {
      var m = s[v];
      try {
        var g = i, A = o, j = A;
        e: for (; j !== null; ) {
          switch (j.tag) {
            case 5:
              It = j.stateNode, Rr = !1;
              break e;
            case 3:
              It = j.stateNode.containerInfo, Rr = !0;
              break e;
            case 4:
              It = j.stateNode.containerInfo, Rr = !0;
              break e;
          }
          j = j.return;
        }
        if (It === null) throw Error(r(160));
        B0(g, A, m), It = null, Rr = !1;
        var T = m.alternate;
        T !== null && (T.return = null), m.return = null;
      } catch (B) {
        rt(m, o, B);
      }
    }
    if (o.subtreeFlags & 12854) for (o = o.child; o !== null; ) W0(o, i), o = o.sibling;
  }
  function W0(i, o) {
    var s = i.alternate, v = i.flags;
    switch (i.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (Lr(o, i), Qr(i), v & 4) {
          try {
            Xo(3, i, i.return), Vu(3, i);
          } catch (he) {
            rt(i, i.return, he);
          }
          try {
            Xo(5, i, i.return);
          } catch (he) {
            rt(i, i.return, he);
          }
        }
        break;
      case 1:
        Lr(o, i), Qr(i), v & 512 && s !== null && ka(s, s.return);
        break;
      case 5:
        if (Lr(o, i), Qr(i), v & 512 && s !== null && ka(s, s.return), i.flags & 32) {
          var m = i.stateNode;
          try {
            yo(m, "");
          } catch (he) {
            rt(i, i.return, he);
          }
        }
        if (v & 4 && (m = i.stateNode, m != null)) {
          var g = i.memoizedProps, A = s !== null ? s.memoizedProps : g, j = i.type, T = i.updateQueue;
          if (i.updateQueue = null, T !== null) try {
            j === "input" && g.type === "radio" && g.name != null && Nt(m, g), If(j, A);
            var B = If(j, g);
            for (A = 0; A < T.length; A += 2) {
              var X = T[A], Q = T[A + 1];
              X === "style" ? Ay(m, Q) : X === "dangerouslySetInnerHTML" ? Sy(m, Q) : X === "children" ? yo(m, Q) : I(m, X, Q, B);
            }
            switch (j) {
              case "input":
                Tr(m, g);
                break;
              case "textarea":
                xy(m, g);
                break;
              case "select":
                var q = m._wrapperState.wasMultiple;
                m._wrapperState.wasMultiple = !!g.multiple;
                var le = g.value;
                le != null ? oa(m, !!g.multiple, le, !1) : q !== !!g.multiple && (g.defaultValue != null ? oa(
                  m,
                  !!g.multiple,
                  g.defaultValue,
                  !0
                ) : oa(m, !!g.multiple, g.multiple ? [] : "", !1));
            }
            m[zo] = g;
          } catch (he) {
            rt(i, i.return, he);
          }
        }
        break;
      case 6:
        if (Lr(o, i), Qr(i), v & 4) {
          if (i.stateNode === null) throw Error(r(162));
          m = i.stateNode, g = i.memoizedProps;
          try {
            m.nodeValue = g;
          } catch (he) {
            rt(i, i.return, he);
          }
        }
        break;
      case 3:
        if (Lr(o, i), Qr(i), v & 4 && s !== null && s.memoizedState.isDehydrated) try {
          Co(o.containerInfo);
        } catch (he) {
          rt(i, i.return, he);
        }
        break;
      case 4:
        Lr(o, i), Qr(i);
        break;
      case 13:
        Lr(o, i), Qr(i), m = i.child, m.flags & 8192 && (g = m.memoizedState !== null, m.stateNode.isHidden = g, !g || m.alternate !== null && m.alternate.memoizedState !== null || (tv = ot())), v & 4 && F0(i);
        break;
      case 22:
        if (X = s !== null && s.memoizedState !== null, i.mode & 1 ? (zt = (B = zt) || X, Lr(o, i), zt = B) : Lr(o, i), Qr(i), v & 8192) {
          if (B = i.memoizedState !== null, (i.stateNode.isHidden = B) && !X && (i.mode & 1) !== 0) for (se = i, X = i.child; X !== null; ) {
            for (Q = se = X; se !== null; ) {
              switch (q = se, le = q.child, q.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  Xo(4, q, q.return);
                  break;
                case 1:
                  ka(q, q.return);
                  var de = q.stateNode;
                  if (typeof de.componentWillUnmount == "function") {
                    v = q, s = q.return;
                    try {
                      o = v, de.props = o.memoizedProps, de.state = o.memoizedState, de.componentWillUnmount();
                    } catch (he) {
                      rt(v, s, he);
                    }
                  }
                  break;
                case 5:
                  ka(q, q.return);
                  break;
                case 22:
                  if (q.memoizedState !== null) {
                    H0(Q);
                    continue;
                  }
              }
              le !== null ? (le.return = q, se = le) : H0(Q);
            }
            X = X.sibling;
          }
          e: for (X = null, Q = i; ; ) {
            if (Q.tag === 5) {
              if (X === null) {
                X = Q;
                try {
                  m = Q.stateNode, B ? (g = m.style, typeof g.setProperty == "function" ? g.setProperty("display", "none", "important") : g.display = "none") : (j = Q.stateNode, T = Q.memoizedProps.style, A = T != null && T.hasOwnProperty("display") ? T.display : null, j.style.display = Py("display", A));
                } catch (he) {
                  rt(i, i.return, he);
                }
              }
            } else if (Q.tag === 6) {
              if (X === null) try {
                Q.stateNode.nodeValue = B ? "" : Q.memoizedProps;
              } catch (he) {
                rt(i, i.return, he);
              }
            } else if ((Q.tag !== 22 && Q.tag !== 23 || Q.memoizedState === null || Q === i) && Q.child !== null) {
              Q.child.return = Q, Q = Q.child;
              continue;
            }
            if (Q === i) break e;
            for (; Q.sibling === null; ) {
              if (Q.return === null || Q.return === i) break e;
              X === Q && (X = null), Q = Q.return;
            }
            X === Q && (X = null), Q.sibling.return = Q.return, Q = Q.sibling;
          }
        }
        break;
      case 19:
        Lr(o, i), Qr(i), v & 4 && F0(i);
        break;
      case 21:
        break;
      default:
        Lr(
          o,
          i
        ), Qr(i);
    }
  }
  function Qr(i) {
    var o = i.flags;
    if (o & 2) {
      try {
        e: {
          for (var s = i.return; s !== null; ) {
            if (L0(s)) {
              var v = s;
              break e;
            }
            s = s.return;
          }
          throw Error(r(160));
        }
        switch (v.tag) {
          case 5:
            var m = v.stateNode;
            v.flags & 32 && (yo(m, ""), v.flags &= -33);
            var g = z0(i);
            Zd(i, g, m);
            break;
          case 3:
          case 4:
            var A = v.stateNode.containerInfo, j = z0(i);
            Qd(i, j, A);
            break;
          default:
            throw Error(r(161));
        }
      } catch (T) {
        rt(i, i.return, T);
      }
      i.flags &= -3;
    }
    o & 4096 && (i.flags &= -4097);
  }
  function nj(i, o, s) {
    se = i, U0(i);
  }
  function U0(i, o, s) {
    for (var v = (i.mode & 1) !== 0; se !== null; ) {
      var m = se, g = m.child;
      if (m.tag === 22 && v) {
        var A = m.memoizedState !== null || Hu;
        if (!A) {
          var j = m.alternate, T = j !== null && j.memoizedState !== null || zt;
          j = Hu;
          var B = zt;
          if (Hu = A, (zt = T) && !B) for (se = m; se !== null; ) A = se, T = A.child, A.tag === 22 && A.memoizedState !== null ? V0(m) : T !== null ? (T.return = A, se = T) : V0(m);
          for (; g !== null; ) se = g, U0(g), g = g.sibling;
          se = m, Hu = j, zt = B;
        }
        K0(i);
      } else (m.subtreeFlags & 8772) !== 0 && g !== null ? (g.return = m, se = g) : K0(i);
    }
  }
  function K0(i) {
    for (; se !== null; ) {
      var o = se;
      if ((o.flags & 8772) !== 0) {
        var s = o.alternate;
        try {
          if ((o.flags & 8772) !== 0) switch (o.tag) {
            case 0:
            case 11:
            case 15:
              zt || Vu(5, o);
              break;
            case 1:
              var v = o.stateNode;
              if (o.flags & 4 && !zt) if (s === null) v.componentDidMount();
              else {
                var m = o.elementType === o.type ? s.memoizedProps : $r(o.type, s.memoizedProps);
                v.componentDidUpdate(m, s.memoizedState, v.__reactInternalSnapshotBeforeUpdate);
              }
              var g = o.updateQueue;
              g !== null && Hg(o, g, v);
              break;
            case 3:
              var A = o.updateQueue;
              if (A !== null) {
                if (s = null, o.child !== null) switch (o.child.tag) {
                  case 5:
                    s = o.child.stateNode;
                    break;
                  case 1:
                    s = o.child.stateNode;
                }
                Hg(o, A, s);
              }
              break;
            case 5:
              var j = o.stateNode;
              if (s === null && o.flags & 4) {
                s = j;
                var T = o.memoizedProps;
                switch (o.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    T.autoFocus && s.focus();
                    break;
                  case "img":
                    T.src && (s.src = T.src);
                }
              }
              break;
            case 6:
              break;
            case 4:
              break;
            case 12:
              break;
            case 13:
              if (o.memoizedState === null) {
                var B = o.alternate;
                if (B !== null) {
                  var X = B.memoizedState;
                  if (X !== null) {
                    var Q = X.dehydrated;
                    Q !== null && Co(Q);
                  }
                }
              }
              break;
            case 19:
            case 17:
            case 21:
            case 22:
            case 23:
            case 25:
              break;
            default:
              throw Error(r(163));
          }
          zt || o.flags & 512 && Xd(o);
        } catch (q) {
          rt(o, o.return, q);
        }
      }
      if (o === i) {
        se = null;
        break;
      }
      if (s = o.sibling, s !== null) {
        s.return = o.return, se = s;
        break;
      }
      se = o.return;
    }
  }
  function H0(i) {
    for (; se !== null; ) {
      var o = se;
      if (o === i) {
        se = null;
        break;
      }
      var s = o.sibling;
      if (s !== null) {
        s.return = o.return, se = s;
        break;
      }
      se = o.return;
    }
  }
  function V0(i) {
    for (; se !== null; ) {
      var o = se;
      try {
        switch (o.tag) {
          case 0:
          case 11:
          case 15:
            var s = o.return;
            try {
              Vu(4, o);
            } catch (T) {
              rt(o, s, T);
            }
            break;
          case 1:
            var v = o.stateNode;
            if (typeof v.componentDidMount == "function") {
              var m = o.return;
              try {
                v.componentDidMount();
              } catch (T) {
                rt(o, m, T);
              }
            }
            var g = o.return;
            try {
              Xd(o);
            } catch (T) {
              rt(o, g, T);
            }
            break;
          case 5:
            var A = o.return;
            try {
              Xd(o);
            } catch (T) {
              rt(o, A, T);
            }
        }
      } catch (T) {
        rt(o, o.return, T);
      }
      if (o === i) {
        se = null;
        break;
      }
      var j = o.sibling;
      if (j !== null) {
        j.return = o.return, se = j;
        break;
      }
      se = o.return;
    }
  }
  var ij = Math.ceil, Gu = E.ReactCurrentDispatcher, Jd = E.ReactCurrentOwner, br = E.ReactCurrentBatchConfig, je = 0, Pt = null, ut = null, jt = 0, sr = 0, Ca = Hn(0), vt = 0, Qo = null, Oi = 0, Yu = 0, ev = 0, Zo = null, Jt = null, tv = 0, Ia = 1 / 0, wn = null, qu = !1, rv = null, Qn = null, Xu = !1, Zn = null, Qu = 0, Jo = 0, nv = null, Zu = -1, Ju = 0;
  function Gt() {
    return (je & 6) !== 0 ? ot() : Zu !== -1 ? Zu : Zu = ot();
  }
  function Jn(i) {
    return (i.mode & 1) === 0 ? 1 : (je & 2) !== 0 && jt !== 0 ? jt & -jt : FI.transition !== null ? (Ju === 0 && (Ju = zy()), Ju) : (i = ze, i !== 0 || (i = window.event, i = i === void 0 ? 16 : Yy(i.type)), i);
  }
  function zr(i, o, s, v) {
    if (50 < Jo) throw Jo = 0, nv = null, Error(r(185));
    Po(i, s, v), ((je & 2) === 0 || i !== Pt) && (i === Pt && ((je & 2) === 0 && (Yu |= s), vt === 4 && ei(i, jt)), er(i, v), s === 1 && je === 0 && (o.mode & 1) === 0 && (Ia = ot() + 500, ku && Gn()));
  }
  function er(i, o) {
    var s = i.callbackNode;
    FC(i, o);
    var v = uu(i, i === Pt ? jt : 0);
    if (v === 0) s !== null && $y(s), i.callbackNode = null, i.callbackPriority = 0;
    else if (o = v & -v, i.callbackPriority !== o) {
      if (s != null && $y(s), o === 1) i.tag === 0 ? BI(Y0.bind(null, i)) : Mg(Y0.bind(null, i)), $I(function() {
        (je & 6) === 0 && Gn();
      }), s = null;
      else {
        switch (By(v)) {
          case 1:
            s = $f;
            break;
          case 4:
            s = Ry;
            break;
          case 16:
            s = iu;
            break;
          case 536870912:
            s = Ly;
            break;
          default:
            s = iu;
        }
        s = rx(s, G0.bind(null, i));
      }
      i.callbackPriority = o, i.callbackNode = s;
    }
  }
  function G0(i, o) {
    if (Zu = -1, Ju = 0, (je & 6) !== 0) throw Error(r(327));
    var s = i.callbackNode;
    if (ja() && i.callbackNode !== s) return null;
    var v = uu(i, i === Pt ? jt : 0);
    if (v === 0) return null;
    if ((v & 30) !== 0 || (v & i.expiredLanes) !== 0 || o) o = es(i, v);
    else {
      o = v;
      var m = je;
      je |= 2;
      var g = X0();
      (Pt !== i || jt !== o) && (wn = null, Ia = ot() + 500, ki(i, o));
      do
        try {
          lj();
          break;
        } catch (j) {
          q0(i, j);
        }
      while (!0);
      wd(), Gu.current = g, je = m, ut !== null ? o = 0 : (Pt = null, jt = 0, o = vt);
    }
    if (o !== 0) {
      if (o === 2 && (m = Rf(i), m !== 0 && (v = m, o = iv(i, m))), o === 1) throw s = Qo, ki(i, 0), ei(i, v), er(i, ot()), s;
      if (o === 6) ei(i, v);
      else {
        if (m = i.current.alternate, (v & 30) === 0 && !aj(m) && (o = es(i, v), o === 2 && (g = Rf(i), g !== 0 && (v = g, o = iv(i, g))), o === 1)) throw s = Qo, ki(i, 0), ei(i, v), er(i, ot()), s;
        switch (i.finishedWork = m, i.finishedLanes = v, o) {
          case 0:
          case 1:
            throw Error(r(345));
          case 2:
            Ci(i, Jt, wn);
            break;
          case 3:
            if (ei(i, v), (v & 130023424) === v && (o = tv + 500 - ot(), 10 < o)) {
              if (uu(i, 0) !== 0) break;
              if (m = i.suspendedLanes, (m & v) !== v) {
                Gt(), i.pingedLanes |= i.suspendedLanes & m;
                break;
              }
              i.timeoutHandle = cd(Ci.bind(null, i, Jt, wn), o);
              break;
            }
            Ci(i, Jt, wn);
            break;
          case 4:
            if (ei(i, v), (v & 4194240) === v) break;
            for (o = i.eventTimes, m = -1; 0 < v; ) {
              var A = 31 - Mr(v);
              g = 1 << A, A = o[A], A > m && (m = A), v &= ~g;
            }
            if (v = m, v = ot() - v, v = (120 > v ? 120 : 480 > v ? 480 : 1080 > v ? 1080 : 1920 > v ? 1920 : 3e3 > v ? 3e3 : 4320 > v ? 4320 : 1960 * ij(v / 1960)) - v, 10 < v) {
              i.timeoutHandle = cd(Ci.bind(null, i, Jt, wn), v);
              break;
            }
            Ci(i, Jt, wn);
            break;
          case 5:
            Ci(i, Jt, wn);
            break;
          default:
            throw Error(r(329));
        }
      }
    }
    return er(i, ot()), i.callbackNode === s ? G0.bind(null, i) : null;
  }
  function iv(i, o) {
    var s = Zo;
    return i.current.memoizedState.isDehydrated && (ki(i, o).flags |= 256), i = es(i, o), i !== 2 && (o = Jt, Jt = s, o !== null && av(o)), i;
  }
  function av(i) {
    Jt === null ? Jt = i : Jt.push.apply(Jt, i);
  }
  function aj(i) {
    for (var o = i; ; ) {
      if (o.flags & 16384) {
        var s = o.updateQueue;
        if (s !== null && (s = s.stores, s !== null)) for (var v = 0; v < s.length; v++) {
          var m = s[v], g = m.getSnapshot;
          m = m.value;
          try {
            if (!Dr(g(), m)) return !1;
          } catch {
            return !1;
          }
        }
      }
      if (s = o.child, o.subtreeFlags & 16384 && s !== null) s.return = o, o = s;
      else {
        if (o === i) break;
        for (; o.sibling === null; ) {
          if (o.return === null || o.return === i) return !0;
          o = o.return;
        }
        o.sibling.return = o.return, o = o.sibling;
      }
    }
    return !0;
  }
  function ei(i, o) {
    for (o &= ~ev, o &= ~Yu, i.suspendedLanes |= o, i.pingedLanes &= ~o, i = i.expirationTimes; 0 < o; ) {
      var s = 31 - Mr(o), v = 1 << s;
      i[s] = -1, o &= ~v;
    }
  }
  function Y0(i) {
    if ((je & 6) !== 0) throw Error(r(327));
    ja();
    var o = uu(i, 0);
    if ((o & 1) === 0) return er(i, ot()), null;
    var s = es(i, o);
    if (i.tag !== 0 && s === 2) {
      var v = Rf(i);
      v !== 0 && (o = v, s = iv(i, v));
    }
    if (s === 1) throw s = Qo, ki(i, 0), ei(i, o), er(i, ot()), s;
    if (s === 6) throw Error(r(345));
    return i.finishedWork = i.current.alternate, i.finishedLanes = o, Ci(i, Jt, wn), er(i, ot()), null;
  }
  function ov(i, o) {
    var s = je;
    je |= 1;
    try {
      return i(o);
    } finally {
      je = s, je === 0 && (Ia = ot() + 500, ku && Gn());
    }
  }
  function Ei(i) {
    Zn !== null && Zn.tag === 0 && (je & 6) === 0 && ja();
    var o = je;
    je |= 1;
    var s = br.transition, v = ze;
    try {
      if (br.transition = null, ze = 1, i) return i();
    } finally {
      ze = v, br.transition = s, je = o, (je & 6) === 0 && Gn();
    }
  }
  function lv() {
    sr = Ca.current, He(Ca);
  }
  function ki(i, o) {
    i.finishedWork = null, i.finishedLanes = 0;
    var s = i.timeoutHandle;
    if (s !== -1 && (i.timeoutHandle = -1, NI(s)), ut !== null) for (s = ut.return; s !== null; ) {
      var v = s;
      switch (md(v), v.tag) {
        case 1:
          v = v.type.childContextTypes, v != null && Ou();
          break;
        case 3:
          Oa(), He(Xt), He($t), Id();
          break;
        case 5:
          kd(v);
          break;
        case 4:
          Oa();
          break;
        case 13:
          He(Ze);
          break;
        case 19:
          He(Ze);
          break;
        case 10:
          Sd(v.type._context);
          break;
        case 22:
        case 23:
          lv();
      }
      s = s.return;
    }
    if (Pt = i, ut = i = ti(i.current, null), jt = sr = o, vt = 0, Qo = null, ev = Yu = Oi = 0, Jt = Zo = null, Si !== null) {
      for (o = 0; o < Si.length; o++) if (s = Si[o], v = s.interleaved, v !== null) {
        s.interleaved = null;
        var m = v.next, g = s.pending;
        if (g !== null) {
          var A = g.next;
          g.next = m, v.next = A;
        }
        s.pending = v;
      }
      Si = null;
    }
    return i;
  }
  function q0(i, o) {
    do {
      var s = ut;
      try {
        if (wd(), Ru.current = Fu, Lu) {
          for (var v = Je.memoizedState; v !== null; ) {
            var m = v.queue;
            m !== null && (m.pending = null), v = v.next;
          }
          Lu = !1;
        }
        if (Ai = 0, St = dt = Je = null, Ho = !1, Vo = 0, Jd.current = null, s === null || s.return === null) {
          vt = 1, Qo = o, ut = null;
          break;
        }
        e: {
          var g = i, A = s.return, j = s, T = o;
          if (o = jt, j.flags |= 32768, T !== null && typeof T == "object" && typeof T.then == "function") {
            var B = T, X = j, Q = X.tag;
            if ((X.mode & 1) === 0 && (Q === 0 || Q === 11 || Q === 15)) {
              var q = X.alternate;
              q ? (X.updateQueue = q.updateQueue, X.memoizedState = q.memoizedState, X.lanes = q.lanes) : (X.updateQueue = null, X.memoizedState = null);
            }
            var le = b0(A);
            if (le !== null) {
              le.flags &= -257, w0(le, A, j, g, o), le.mode & 1 && x0(g, B, o), o = le, T = B;
              var de = o.updateQueue;
              if (de === null) {
                var he = /* @__PURE__ */ new Set();
                he.add(T), o.updateQueue = he;
              } else de.add(T);
              break e;
            } else {
              if ((o & 1) === 0) {
                x0(g, B, o), uv();
                break e;
              }
              T = Error(r(426));
            }
          } else if (Ye && j.mode & 1) {
            var lt = b0(A);
            if (lt !== null) {
              (lt.flags & 65536) === 0 && (lt.flags |= 256), w0(lt, A, j, g, o), xd(Ea(T, j));
              break e;
            }
          }
          g = T = Ea(T, j), vt !== 4 && (vt = 2), Zo === null ? Zo = [g] : Zo.push(g), g = A;
          do {
            switch (g.tag) {
              case 3:
                g.flags |= 65536, o &= -o, g.lanes |= o;
                var L = y0(g, T, o);
                Kg(g, L);
                break e;
              case 1:
                j = T;
                var M = g.type, z = g.stateNode;
                if ((g.flags & 128) === 0 && (typeof M.getDerivedStateFromError == "function" || z !== null && typeof z.componentDidCatch == "function" && (Qn === null || !Qn.has(z)))) {
                  g.flags |= 65536, o &= -o, g.lanes |= o;
                  var te = g0(g, j, o);
                  Kg(g, te);
                  break e;
                }
            }
            g = g.return;
          } while (g !== null);
        }
        Z0(s);
      } catch (pe) {
        o = pe, ut === s && s !== null && (ut = s = s.return);
        continue;
      }
      break;
    } while (!0);
  }
  function X0() {
    var i = Gu.current;
    return Gu.current = Fu, i === null ? Fu : i;
  }
  function uv() {
    (vt === 0 || vt === 3 || vt === 2) && (vt = 4), Pt === null || (Oi & 268435455) === 0 && (Yu & 268435455) === 0 || ei(Pt, jt);
  }
  function es(i, o) {
    var s = je;
    je |= 2;
    var v = X0();
    (Pt !== i || jt !== o) && (wn = null, ki(i, o));
    do
      try {
        oj();
        break;
      } catch (m) {
        q0(i, m);
      }
    while (!0);
    if (wd(), je = s, Gu.current = v, ut !== null) throw Error(r(261));
    return Pt = null, jt = 0, vt;
  }
  function oj() {
    for (; ut !== null; ) Q0(ut);
  }
  function lj() {
    for (; ut !== null && !TC(); ) Q0(ut);
  }
  function Q0(i) {
    var o = tx(i.alternate, i, sr);
    i.memoizedProps = i.pendingProps, o === null ? Z0(i) : ut = o, Jd.current = null;
  }
  function Z0(i) {
    var o = i;
    do {
      var s = o.alternate;
      if (i = o.return, (o.flags & 32768) === 0) {
        if (s = JI(s, o, sr), s !== null) {
          ut = s;
          return;
        }
      } else {
        if (s = ej(s, o), s !== null) {
          s.flags &= 32767, ut = s;
          return;
        }
        if (i !== null) i.flags |= 32768, i.subtreeFlags = 0, i.deletions = null;
        else {
          vt = 6, ut = null;
          return;
        }
      }
      if (o = o.sibling, o !== null) {
        ut = o;
        return;
      }
      ut = o = i;
    } while (o !== null);
    vt === 0 && (vt = 5);
  }
  function Ci(i, o, s) {
    var v = ze, m = br.transition;
    try {
      br.transition = null, ze = 1, uj(i, o, s, v);
    } finally {
      br.transition = m, ze = v;
    }
    return null;
  }
  function uj(i, o, s, v) {
    do
      ja();
    while (Zn !== null);
    if ((je & 6) !== 0) throw Error(r(327));
    s = i.finishedWork;
    var m = i.finishedLanes;
    if (s === null) return null;
    if (i.finishedWork = null, i.finishedLanes = 0, s === i.current) throw Error(r(177));
    i.callbackNode = null, i.callbackPriority = 0;
    var g = s.lanes | s.childLanes;
    if (WC(i, g), i === Pt && (ut = Pt = null, jt = 0), (s.subtreeFlags & 2064) === 0 && (s.flags & 2064) === 0 || Xu || (Xu = !0, rx(iu, function() {
      return ja(), null;
    })), g = (s.flags & 15990) !== 0, (s.subtreeFlags & 15990) !== 0 || g) {
      g = br.transition, br.transition = null;
      var A = ze;
      ze = 1;
      var j = je;
      je |= 4, Jd.current = null, rj(i, s), W0(s, i), CI(ud), fu = !!ld, ud = ld = null, i.current = s, nj(s), MC(), je = j, ze = A, br.transition = g;
    } else i.current = s;
    if (Xu && (Xu = !1, Zn = i, Qu = m), g = i.pendingLanes, g === 0 && (Qn = null), $C(s.stateNode), er(i, ot()), o !== null) for (v = i.onRecoverableError, s = 0; s < o.length; s++) m = o[s], v(m.value, { componentStack: m.stack, digest: m.digest });
    if (qu) throw qu = !1, i = rv, rv = null, i;
    return (Qu & 1) !== 0 && i.tag !== 0 && ja(), g = i.pendingLanes, (g & 1) !== 0 ? i === nv ? Jo++ : (Jo = 0, nv = i) : Jo = 0, Gn(), null;
  }
  function ja() {
    if (Zn !== null) {
      var i = By(Qu), o = br.transition, s = ze;
      try {
        if (br.transition = null, ze = 16 > i ? 16 : i, Zn === null) var v = !1;
        else {
          if (i = Zn, Zn = null, Qu = 0, (je & 6) !== 0) throw Error(r(331));
          var m = je;
          for (je |= 4, se = i.current; se !== null; ) {
            var g = se, A = g.child;
            if ((se.flags & 16) !== 0) {
              var j = g.deletions;
              if (j !== null) {
                for (var T = 0; T < j.length; T++) {
                  var B = j[T];
                  for (se = B; se !== null; ) {
                    var X = se;
                    switch (X.tag) {
                      case 0:
                      case 11:
                      case 15:
                        Xo(8, X, g);
                    }
                    var Q = X.child;
                    if (Q !== null) Q.return = X, se = Q;
                    else for (; se !== null; ) {
                      X = se;
                      var q = X.sibling, le = X.return;
                      if (R0(X), X === B) {
                        se = null;
                        break;
                      }
                      if (q !== null) {
                        q.return = le, se = q;
                        break;
                      }
                      se = le;
                    }
                  }
                }
                var de = g.alternate;
                if (de !== null) {
                  var he = de.child;
                  if (he !== null) {
                    de.child = null;
                    do {
                      var lt = he.sibling;
                      he.sibling = null, he = lt;
                    } while (he !== null);
                  }
                }
                se = g;
              }
            }
            if ((g.subtreeFlags & 2064) !== 0 && A !== null) A.return = g, se = A;
            else e: for (; se !== null; ) {
              if (g = se, (g.flags & 2048) !== 0) switch (g.tag) {
                case 0:
                case 11:
                case 15:
                  Xo(9, g, g.return);
              }
              var L = g.sibling;
              if (L !== null) {
                L.return = g.return, se = L;
                break e;
              }
              se = g.return;
            }
          }
          var M = i.current;
          for (se = M; se !== null; ) {
            A = se;
            var z = A.child;
            if ((A.subtreeFlags & 2064) !== 0 && z !== null) z.return = A, se = z;
            else e: for (A = M; se !== null; ) {
              if (j = se, (j.flags & 2048) !== 0) try {
                switch (j.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Vu(9, j);
                }
              } catch (pe) {
                rt(j, j.return, pe);
              }
              if (j === A) {
                se = null;
                break e;
              }
              var te = j.sibling;
              if (te !== null) {
                te.return = j.return, se = te;
                break e;
              }
              se = j.return;
            }
          }
          if (je = m, Gn(), Gr && typeof Gr.onPostCommitFiberRoot == "function") try {
            Gr.onPostCommitFiberRoot(au, i);
          } catch {
          }
          v = !0;
        }
        return v;
      } finally {
        ze = s, br.transition = o;
      }
    }
    return !1;
  }
  function J0(i, o, s) {
    o = Ea(s, o), o = y0(i, o, 1), i = qn(i, o, 1), o = Gt(), i !== null && (Po(i, 1, o), er(i, o));
  }
  function rt(i, o, s) {
    if (i.tag === 3) J0(i, i, s);
    else for (; o !== null; ) {
      if (o.tag === 3) {
        J0(o, i, s);
        break;
      } else if (o.tag === 1) {
        var v = o.stateNode;
        if (typeof o.type.getDerivedStateFromError == "function" || typeof v.componentDidCatch == "function" && (Qn === null || !Qn.has(v))) {
          i = Ea(s, i), i = g0(o, i, 1), o = qn(o, i, 1), i = Gt(), o !== null && (Po(o, 1, i), er(o, i));
          break;
        }
      }
      o = o.return;
    }
  }
  function sj(i, o, s) {
    var v = i.pingCache;
    v !== null && v.delete(o), o = Gt(), i.pingedLanes |= i.suspendedLanes & s, Pt === i && (jt & s) === s && (vt === 4 || vt === 3 && (jt & 130023424) === jt && 500 > ot() - tv ? ki(i, 0) : ev |= s), er(i, o);
  }
  function ex(i, o) {
    o === 0 && ((i.mode & 1) === 0 ? o = 1 : (o = lu, lu <<= 1, (lu & 130023424) === 0 && (lu = 4194304)));
    var s = Gt();
    i = gn(i, o), i !== null && (Po(i, o, s), er(i, s));
  }
  function cj(i) {
    var o = i.memoizedState, s = 0;
    o !== null && (s = o.retryLane), ex(i, s);
  }
  function fj(i, o) {
    var s = 0;
    switch (i.tag) {
      case 13:
        var v = i.stateNode, m = i.memoizedState;
        m !== null && (s = m.retryLane);
        break;
      case 19:
        v = i.stateNode;
        break;
      default:
        throw Error(r(314));
    }
    v !== null && v.delete(o), ex(i, s);
  }
  var tx;
  tx = function(i, o, s) {
    if (i !== null) if (i.memoizedProps !== o.pendingProps || Xt.current) Zt = !0;
    else {
      if ((i.lanes & s) === 0 && (o.flags & 128) === 0) return Zt = !1, ZI(i, o, s);
      Zt = (i.flags & 131072) !== 0;
    }
    else Zt = !1, Ye && (o.flags & 1048576) !== 0 && Dg(o, Iu, o.index);
    switch (o.lanes = 0, o.tag) {
      case 2:
        var v = o.type;
        Ku(i, o), i = o.pendingProps;
        var m = ga(o, $t.current);
        Aa(o, s), m = Td(null, o, v, i, m, s);
        var g = Md();
        return o.flags |= 1, typeof m == "object" && m !== null && typeof m.render == "function" && m.$$typeof === void 0 ? (o.tag = 1, o.memoizedState = null, o.updateQueue = null, Qt(v) ? (g = !0, Eu(o)) : g = !1, o.memoizedState = m.state !== null && m.state !== void 0 ? m.state : null, Od(o), m.updater = Wu, o.stateNode = m, m._reactInternals = o, zd(o, v, i, s), o = Ud(null, o, v, !0, g, s)) : (o.tag = 0, Ye && g && pd(o), Vt(null, o, m, s), o = o.child), o;
      case 16:
        v = o.elementType;
        e: {
          switch (Ku(i, o), i = o.pendingProps, m = v._init, v = m(v._payload), o.type = v, m = o.tag = vj(v), i = $r(v, i), m) {
            case 0:
              o = Wd(null, o, v, i, s);
              break e;
            case 1:
              o = k0(null, o, v, i, s);
              break e;
            case 11:
              o = S0(null, o, v, i, s);
              break e;
            case 14:
              o = P0(null, o, v, $r(v.type, i), s);
              break e;
          }
          throw Error(r(
            306,
            v,
            ""
          ));
        }
        return o;
      case 0:
        return v = o.type, m = o.pendingProps, m = o.elementType === v ? m : $r(v, m), Wd(i, o, v, m, s);
      case 1:
        return v = o.type, m = o.pendingProps, m = o.elementType === v ? m : $r(v, m), k0(i, o, v, m, s);
      case 3:
        e: {
          if (C0(o), i === null) throw Error(r(387));
          v = o.pendingProps, g = o.memoizedState, m = g.element, Ug(i, o), Nu(o, v, null, s);
          var A = o.memoizedState;
          if (v = A.element, g.isDehydrated) if (g = { element: v, isDehydrated: !1, cache: A.cache, pendingSuspenseBoundaries: A.pendingSuspenseBoundaries, transitions: A.transitions }, o.updateQueue.baseState = g, o.memoizedState = g, o.flags & 256) {
            m = Ea(Error(r(423)), o), o = I0(i, o, v, s, m);
            break e;
          } else if (v !== m) {
            m = Ea(Error(r(424)), o), o = I0(i, o, v, s, m);
            break e;
          } else for (ur = Kn(o.stateNode.containerInfo.firstChild), lr = o, Ye = !0, Nr = null, s = Fg(o, null, v, s), o.child = s; s; ) s.flags = s.flags & -3 | 4096, s = s.sibling;
          else {
            if (wa(), v === m) {
              o = bn(i, o, s);
              break e;
            }
            Vt(i, o, v, s);
          }
          o = o.child;
        }
        return o;
      case 5:
        return Vg(o), i === null && gd(o), v = o.type, m = o.pendingProps, g = i !== null ? i.memoizedProps : null, A = m.children, sd(v, m) ? A = null : g !== null && sd(v, g) && (o.flags |= 32), E0(i, o), Vt(i, o, A, s), o.child;
      case 6:
        return i === null && gd(o), null;
      case 13:
        return j0(i, o, s);
      case 4:
        return Ed(o, o.stateNode.containerInfo), v = o.pendingProps, i === null ? o.child = Sa(o, null, v, s) : Vt(i, o, v, s), o.child;
      case 11:
        return v = o.type, m = o.pendingProps, m = o.elementType === v ? m : $r(v, m), S0(i, o, v, m, s);
      case 7:
        return Vt(i, o, o.pendingProps, s), o.child;
      case 8:
        return Vt(i, o, o.pendingProps.children, s), o.child;
      case 12:
        return Vt(i, o, o.pendingProps.children, s), o.child;
      case 10:
        e: {
          if (v = o.type._context, m = o.pendingProps, g = o.memoizedProps, A = m.value, We(Tu, v._currentValue), v._currentValue = A, g !== null) if (Dr(g.value, A)) {
            if (g.children === m.children && !Xt.current) {
              o = bn(i, o, s);
              break e;
            }
          } else for (g = o.child, g !== null && (g.return = o); g !== null; ) {
            var j = g.dependencies;
            if (j !== null) {
              A = g.child;
              for (var T = j.firstContext; T !== null; ) {
                if (T.context === v) {
                  if (g.tag === 1) {
                    T = xn(-1, s & -s), T.tag = 2;
                    var B = g.updateQueue;
                    if (B !== null) {
                      B = B.shared;
                      var X = B.pending;
                      X === null ? T.next = T : (T.next = X.next, X.next = T), B.pending = T;
                    }
                  }
                  g.lanes |= s, T = g.alternate, T !== null && (T.lanes |= s), Pd(
                    g.return,
                    s,
                    o
                  ), j.lanes |= s;
                  break;
                }
                T = T.next;
              }
            } else if (g.tag === 10) A = g.type === o.type ? null : g.child;
            else if (g.tag === 18) {
              if (A = g.return, A === null) throw Error(r(341));
              A.lanes |= s, j = A.alternate, j !== null && (j.lanes |= s), Pd(A, s, o), A = g.sibling;
            } else A = g.child;
            if (A !== null) A.return = g;
            else for (A = g; A !== null; ) {
              if (A === o) {
                A = null;
                break;
              }
              if (g = A.sibling, g !== null) {
                g.return = A.return, A = g;
                break;
              }
              A = A.return;
            }
            g = A;
          }
          Vt(i, o, m.children, s), o = o.child;
        }
        return o;
      case 9:
        return m = o.type, v = o.pendingProps.children, Aa(o, s), m = gr(m), v = v(m), o.flags |= 1, Vt(i, o, v, s), o.child;
      case 14:
        return v = o.type, m = $r(v, o.pendingProps), m = $r(v.type, m), P0(i, o, v, m, s);
      case 15:
        return A0(i, o, o.type, o.pendingProps, s);
      case 17:
        return v = o.type, m = o.pendingProps, m = o.elementType === v ? m : $r(v, m), Ku(i, o), o.tag = 1, Qt(v) ? (i = !0, Eu(o)) : i = !1, Aa(o, s), p0(o, v, m), zd(o, v, m, s), Ud(null, o, v, !0, i, s);
      case 19:
        return T0(i, o, s);
      case 22:
        return O0(i, o, s);
    }
    throw Error(r(156, o.tag));
  };
  function rx(i, o) {
    return Ny(i, o);
  }
  function dj(i, o, s, v) {
    this.tag = i, this.key = s, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = o, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = v, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function wr(i, o, s, v) {
    return new dj(i, o, s, v);
  }
  function sv(i) {
    return i = i.prototype, !(!i || !i.isReactComponent);
  }
  function vj(i) {
    if (typeof i == "function") return sv(i) ? 1 : 0;
    if (i != null) {
      if (i = i.$$typeof, i === F) return 11;
      if (i === ne) return 14;
    }
    return 2;
  }
  function ti(i, o) {
    var s = i.alternate;
    return s === null ? (s = wr(i.tag, o, i.key, i.mode), s.elementType = i.elementType, s.type = i.type, s.stateNode = i.stateNode, s.alternate = i, i.alternate = s) : (s.pendingProps = o, s.type = i.type, s.flags = 0, s.subtreeFlags = 0, s.deletions = null), s.flags = i.flags & 14680064, s.childLanes = i.childLanes, s.lanes = i.lanes, s.child = i.child, s.memoizedProps = i.memoizedProps, s.memoizedState = i.memoizedState, s.updateQueue = i.updateQueue, o = i.dependencies, s.dependencies = o === null ? null : { lanes: o.lanes, firstContext: o.firstContext }, s.sibling = i.sibling, s.index = i.index, s.ref = i.ref, s;
  }
  function ts(i, o, s, v, m, g) {
    var A = 2;
    if (v = i, typeof i == "function") sv(i) && (A = 1);
    else if (typeof i == "string") A = 5;
    else e: switch (i) {
      case R:
        return Ii(s.children, m, g, o);
      case W:
        A = 8, m |= 8;
        break;
      case V:
        return i = wr(12, s, o, m | 2), i.elementType = V, i.lanes = g, i;
      case ie:
        return i = wr(13, s, o, m), i.elementType = ie, i.lanes = g, i;
      case re:
        return i = wr(19, s, o, m), i.elementType = re, i.lanes = g, i;
      case ae:
        return rs(s, m, g, o);
      default:
        if (typeof i == "object" && i !== null) switch (i.$$typeof) {
          case K:
            A = 10;
            break e;
          case G:
            A = 9;
            break e;
          case F:
            A = 11;
            break e;
          case ne:
            A = 14;
            break e;
          case fe:
            A = 16, v = null;
            break e;
        }
        throw Error(r(130, i == null ? i : typeof i, ""));
    }
    return o = wr(A, s, o, m), o.elementType = i, o.type = v, o.lanes = g, o;
  }
  function Ii(i, o, s, v) {
    return i = wr(7, i, v, o), i.lanes = s, i;
  }
  function rs(i, o, s, v) {
    return i = wr(22, i, v, o), i.elementType = ae, i.lanes = s, i.stateNode = { isHidden: !1 }, i;
  }
  function cv(i, o, s) {
    return i = wr(6, i, null, o), i.lanes = s, i;
  }
  function fv(i, o, s) {
    return o = wr(4, i.children !== null ? i.children : [], i.key, o), o.lanes = s, o.stateNode = { containerInfo: i.containerInfo, pendingChildren: null, implementation: i.implementation }, o;
  }
  function hj(i, o, s, v, m) {
    this.tag = o, this.containerInfo = i, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = Lf(0), this.expirationTimes = Lf(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Lf(0), this.identifierPrefix = v, this.onRecoverableError = m, this.mutableSourceEagerHydrationData = null;
  }
  function dv(i, o, s, v, m, g, A, j, T) {
    return i = new hj(i, o, s, j, T), o === 1 ? (o = 1, g === !0 && (o |= 8)) : o = 0, g = wr(3, null, null, o), i.current = g, g.stateNode = i, g.memoizedState = { element: v, isDehydrated: s, cache: null, transitions: null, pendingSuspenseBoundaries: null }, Od(g), i;
  }
  function pj(i, o, s) {
    var v = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: C, key: v == null ? null : "" + v, children: i, containerInfo: o, implementation: s };
  }
  function nx(i) {
    if (!i) return Vn;
    i = i._reactInternals;
    e: {
      if (yi(i) !== i || i.tag !== 1) throw Error(r(170));
      var o = i;
      do {
        switch (o.tag) {
          case 3:
            o = o.stateNode.context;
            break e;
          case 1:
            if (Qt(o.type)) {
              o = o.stateNode.__reactInternalMemoizedMergedChildContext;
              break e;
            }
        }
        o = o.return;
      } while (o !== null);
      throw Error(r(171));
    }
    if (i.tag === 1) {
      var s = i.type;
      if (Qt(s)) return _g(i, s, o);
    }
    return o;
  }
  function ix(i, o, s, v, m, g, A, j, T) {
    return i = dv(s, v, !0, i, m, g, A, j, T), i.context = nx(null), s = i.current, v = Gt(), m = Jn(s), g = xn(v, m), g.callback = o ?? null, qn(s, g, m), i.current.lanes = m, Po(i, m, v), er(i, v), i;
  }
  function ns(i, o, s, v) {
    var m = o.current, g = Gt(), A = Jn(m);
    return s = nx(s), o.context === null ? o.context = s : o.pendingContext = s, o = xn(g, A), o.payload = { element: i }, v = v === void 0 ? null : v, v !== null && (o.callback = v), i = qn(m, o, A), i !== null && (zr(i, m, A, g), Du(i, m, A)), A;
  }
  function is(i) {
    if (i = i.current, !i.child) return null;
    switch (i.child.tag) {
      case 5:
        return i.child.stateNode;
      default:
        return i.child.stateNode;
    }
  }
  function ax(i, o) {
    if (i = i.memoizedState, i !== null && i.dehydrated !== null) {
      var s = i.retryLane;
      i.retryLane = s !== 0 && s < o ? s : o;
    }
  }
  function vv(i, o) {
    ax(i, o), (i = i.alternate) && ax(i, o);
  }
  function mj() {
    return null;
  }
  var ox = typeof reportError == "function" ? reportError : function(i) {
    console.error(i);
  };
  function hv(i) {
    this._internalRoot = i;
  }
  as.prototype.render = hv.prototype.render = function(i) {
    var o = this._internalRoot;
    if (o === null) throw Error(r(409));
    ns(i, o, null, null);
  }, as.prototype.unmount = hv.prototype.unmount = function() {
    var i = this._internalRoot;
    if (i !== null) {
      this._internalRoot = null;
      var o = i.containerInfo;
      Ei(function() {
        ns(null, i, null, null);
      }), o[hn] = null;
    }
  };
  function as(i) {
    this._internalRoot = i;
  }
  as.prototype.unstable_scheduleHydration = function(i) {
    if (i) {
      var o = Uy();
      i = { blockedOn: null, target: i, priority: o };
      for (var s = 0; s < Fn.length && o !== 0 && o < Fn[s].priority; s++) ;
      Fn.splice(s, 0, i), s === 0 && Vy(i);
    }
  };
  function pv(i) {
    return !(!i || i.nodeType !== 1 && i.nodeType !== 9 && i.nodeType !== 11);
  }
  function os(i) {
    return !(!i || i.nodeType !== 1 && i.nodeType !== 9 && i.nodeType !== 11 && (i.nodeType !== 8 || i.nodeValue !== " react-mount-point-unstable "));
  }
  function lx() {
  }
  function yj(i, o, s, v, m) {
    if (m) {
      if (typeof v == "function") {
        var g = v;
        v = function() {
          var B = is(A);
          g.call(B);
        };
      }
      var A = ix(o, v, i, 0, null, !1, !1, "", lx);
      return i._reactRootContainer = A, i[hn] = A.current, Ro(i.nodeType === 8 ? i.parentNode : i), Ei(), A;
    }
    for (; m = i.lastChild; ) i.removeChild(m);
    if (typeof v == "function") {
      var j = v;
      v = function() {
        var B = is(T);
        j.call(B);
      };
    }
    var T = dv(i, 0, !1, null, null, !1, !1, "", lx);
    return i._reactRootContainer = T, i[hn] = T.current, Ro(i.nodeType === 8 ? i.parentNode : i), Ei(function() {
      ns(o, T, s, v);
    }), T;
  }
  function ls(i, o, s, v, m) {
    var g = s._reactRootContainer;
    if (g) {
      var A = g;
      if (typeof m == "function") {
        var j = m;
        m = function() {
          var T = is(A);
          j.call(T);
        };
      }
      ns(o, A, i, m);
    } else A = yj(s, o, i, m, v);
    return is(A);
  }
  Fy = function(i) {
    switch (i.tag) {
      case 3:
        var o = i.stateNode;
        if (o.current.memoizedState.isDehydrated) {
          var s = So(o.pendingLanes);
          s !== 0 && (zf(o, s | 1), er(o, ot()), (je & 6) === 0 && (Ia = ot() + 500, Gn()));
        }
        break;
      case 13:
        Ei(function() {
          var v = gn(i, 1);
          if (v !== null) {
            var m = Gt();
            zr(v, i, 1, m);
          }
        }), vv(i, 1);
    }
  }, Bf = function(i) {
    if (i.tag === 13) {
      var o = gn(i, 134217728);
      if (o !== null) {
        var s = Gt();
        zr(o, i, 134217728, s);
      }
      vv(i, 134217728);
    }
  }, Wy = function(i) {
    if (i.tag === 13) {
      var o = Jn(i), s = gn(i, o);
      if (s !== null) {
        var v = Gt();
        zr(s, i, o, v);
      }
      vv(i, o);
    }
  }, Uy = function() {
    return ze;
  }, Ky = function(i, o) {
    var s = ze;
    try {
      return ze = i, o();
    } finally {
      ze = s;
    }
  }, Tf = function(i, o, s) {
    switch (o) {
      case "input":
        if (Tr(i, s), o = s.name, s.type === "radio" && o != null) {
          for (s = i; s.parentNode; ) s = s.parentNode;
          for (s = s.querySelectorAll("input[name=" + JSON.stringify("" + o) + '][type="radio"]'), o = 0; o < s.length; o++) {
            var v = s[o];
            if (v !== i && v.form === i.form) {
              var m = Au(v);
              if (!m) throw Error(r(90));
              Z(v), Tr(v, m);
            }
          }
        }
        break;
      case "textarea":
        xy(i, s);
        break;
      case "select":
        o = s.value, o != null && oa(i, !!s.multiple, o, !1);
    }
  }, Cy = ov, Iy = Ei;
  var gj = { usingClientEntryPoint: !1, Events: [Bo, ma, Au, Ey, ky, ov] }, el = { findFiberByHostInstance: gi, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, xj = { bundleType: el.bundleType, version: el.version, rendererPackageName: el.rendererPackageName, rendererConfig: el.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: E.ReactCurrentDispatcher, findHostInstanceByFiber: function(i) {
    return i = My(i), i === null ? null : i.stateNode;
  }, findFiberByHostInstance: el.findFiberByHostInstance || mj, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var us = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!us.isDisabled && us.supportsFiber) try {
      au = us.inject(xj), Gr = us;
    } catch {
    }
  }
  return tr.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = gj, tr.createPortal = function(i, o) {
    var s = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!pv(o)) throw Error(r(200));
    return pj(i, o, null, s);
  }, tr.createRoot = function(i, o) {
    if (!pv(i)) throw Error(r(299));
    var s = !1, v = "", m = ox;
    return o != null && (o.unstable_strictMode === !0 && (s = !0), o.identifierPrefix !== void 0 && (v = o.identifierPrefix), o.onRecoverableError !== void 0 && (m = o.onRecoverableError)), o = dv(i, 1, !1, null, null, s, !1, v, m), i[hn] = o.current, Ro(i.nodeType === 8 ? i.parentNode : i), new hv(o);
  }, tr.findDOMNode = function(i) {
    if (i == null) return null;
    if (i.nodeType === 1) return i;
    var o = i._reactInternals;
    if (o === void 0)
      throw typeof i.render == "function" ? Error(r(188)) : (i = Object.keys(i).join(","), Error(r(268, i)));
    return i = My(o), i = i === null ? null : i.stateNode, i;
  }, tr.flushSync = function(i) {
    return Ei(i);
  }, tr.hydrate = function(i, o, s) {
    if (!os(o)) throw Error(r(200));
    return ls(null, i, o, !0, s);
  }, tr.hydrateRoot = function(i, o, s) {
    if (!pv(i)) throw Error(r(405));
    var v = s != null && s.hydratedSources || null, m = !1, g = "", A = ox;
    if (s != null && (s.unstable_strictMode === !0 && (m = !0), s.identifierPrefix !== void 0 && (g = s.identifierPrefix), s.onRecoverableError !== void 0 && (A = s.onRecoverableError)), o = ix(o, null, i, 1, s ?? null, m, !1, g, A), i[hn] = o.current, Ro(i), v) for (i = 0; i < v.length; i++) s = v[i], m = s._getVersion, m = m(s._source), o.mutableSourceEagerHydrationData == null ? o.mutableSourceEagerHydrationData = [s, m] : o.mutableSourceEagerHydrationData.push(
      s,
      m
    );
    return new as(o);
  }, tr.render = function(i, o, s) {
    if (!os(o)) throw Error(r(200));
    return ls(null, i, o, !1, s);
  }, tr.unmountComponentAtNode = function(i) {
    if (!os(i)) throw Error(r(40));
    return i._reactRootContainer ? (Ei(function() {
      ls(null, null, i, !1, function() {
        i._reactRootContainer = null, i[hn] = null;
      });
    }), !0) : !1;
  }, tr.unstable_batchedUpdates = ov, tr.unstable_renderSubtreeIntoContainer = function(i, o, s, v) {
    if (!os(s)) throw Error(r(200));
    if (i == null || i._reactInternals === void 0) throw Error(r(38));
    return ls(i, o, s, !1, v);
  }, tr.version = "18.3.1-next-f1338f8080-20240426", tr;
}
var px;
function $S() {
  if (px) return gv.exports;
  px = 1;
  function e() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(e);
      } catch (t) {
        console.error(t);
      }
  }
  return e(), gv.exports = _j(), gv.exports;
}
var mx;
function Tj() {
  if (mx) return cs;
  mx = 1;
  var e = $S();
  return cs.createRoot = e.createRoot, cs.hydrateRoot = e.hydrateRoot, cs;
}
var Mj = Tj();
const Dj = [9, 8, 9, 12, 16, 11, 11, 10, 9, 10, 10, 11, 10, 9, 12, 14, 10, 10, 13, 9, 8, 10, 9, 10, 8, 7, 9, 13, 12, 11], Nj = [8, 7, 8, 12, 15, 10, 10, 9, 8, 9, 11, 10, 9, 8, 11, 13, 9, 10, 12, 8, 7, 9, 8, 9, 7, 6, 8, 13, 12, 11], $j = {
  period: { start: "2026-09-01", end: "2026-09-30" },
  status: { backendConnected: !0, enterSession: "active", errorsToday: 0, updatedAt: "08:45" },
  portfolio: {
    activeBase: 10379,
    monthlyEntries: 310,
    entriesTrend: 26.7,
    monthlyClosures: 287,
    closuresTrend: 192,
    monthlyAgreements: 21,
    pendingAgreements: 19,
    archivableProcesses: 83
  },
  distribution: {
    states: [
      { label: "SP", value: 1419 },
      { label: "Outros", value: 1294 },
      { label: "RJ", value: 687 },
      { label: "BA", value: 670 },
      { label: "MG", value: 664 },
      { label: "SC", value: 637 },
      { label: "AM", value: 505 },
      { label: "MA", value: 465 },
      { label: "PR", value: 434 },
      { label: "PE", value: 355 },
      { label: "GO", value: 249 }
    ],
    products: [
      { label: "Cartão Consignado", value: 4231 },
      { label: "Crédito Pessoal", value: 2505 },
      { label: "Empréstimo Consignado", value: 2132 },
      { label: "Seguros Diversos", value: 639 },
      { label: "Conta Corrente", value: 468 },
      { label: "Outros", value: 402 }
    ],
    courtTypes: [{ label: "Vara Cível", value: 7450 }, { label: "Juizado", value: 2929 }],
    burden: [{ label: "Com ônus", value: 332 }, { label: "Sem ônus", value: 10047 }]
  },
  movement: {
    daily: Dj.map((e, t) => ({
      day: String(t + 1).padStart(2, "0"),
      fullDate: `${String(t + 1).padStart(2, "0")}/09/2026`,
      entries: e,
      closures: Nj[t]
    })),
    closureReasons: [
      { label: "Improcedente", value: 175 },
      { label: "Sem Resolução", value: 80 },
      { label: "Acordo", value: 32 }
    ]
  },
  payments: {
    totalAmount: 261216.34,
    totalTrend: 18,
    tkm: 842.17,
    pendingApproval: { count: 17, amount: 28450.32 },
    missingReceipt: { count: 24, amount: 15237.8 },
    cancelled: { count: 6, amount: 4890.11 },
    agreementPayments: { count: 21, amount: 68342.2 },
    tkmHistory: [
      { label: "Abr/26", value: 734.12 },
      { label: "Mai/26", value: 781.33 },
      { label: "Jun/26", value: 812.44 },
      { label: "Jul/26", value: 790.88 },
      { label: "Ago/26", value: 835.91 },
      { label: "Set/26", value: 842.17 }
    ],
    topCredenciados: [
      { label: "Credenciado A", value: 98213.44 },
      { label: "Credenciado B", value: 76721.33 },
      { label: "Credenciado C", value: 42556.11 }
    ],
    credenciados: ["Credenciado A", "Credenciado B", "Credenciado C"]
  },
  updatedAt: "2026-09-01T08:45:00-04:00",
  autoRefreshMinutes: 15
}, Rj = {
  "Credenciado A": 98213.44 / 261216.34,
  "Credenciado B": 76721.33 / 261216.34,
  "Credenciado C": 42556.11 / 261216.34
};
async function Lj(e) {
  var a;
  const t = structuredClone($j);
  e != null && e.startDate && (t.period.start = e.startDate), e != null && e.endDate && (t.period.end = e.endDate);
  const r = e == null ? void 0 : e.credenciado, n = r ? Rj[r] : void 0;
  return !r || n === void 0 || (t.payments.totalAmount = ((a = t.payments.topCredenciados.find((l) => l.label === r)) == null ? void 0 : a.value) ?? 0, t.payments.pendingApproval.count = Math.round((t.payments.pendingApproval.count ?? 0) * n), t.payments.pendingApproval.amount *= n, t.payments.missingReceipt.count = Math.round((t.payments.missingReceipt.count ?? 0) * n), t.payments.missingReceipt.amount *= n, t.payments.cancelled.count = Math.round((t.payments.cancelled.count ?? 0) * n), t.payments.cancelled.amount *= n, t.payments.agreementPayments.count = Math.round((t.payments.agreementPayments.count ?? 0) * n), t.payments.agreementPayments.amount *= n, t.payments.topCredenciados = t.payments.topCredenciados.filter((l) => l.label === r)), t;
}
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const zj = (e) => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), RS = (...e) => e.filter((t, r, n) => !!t && t.trim() !== "" && n.indexOf(t) === r).join(" ").trim();
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var Bj = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Fj = x.forwardRef(
  ({
    color: e = "currentColor",
    size: t = 24,
    strokeWidth: r = 2,
    absoluteStrokeWidth: n,
    className: a = "",
    children: l,
    iconNode: u,
    ...c
  }, f) => x.createElement(
    "svg",
    {
      ref: f,
      ...Bj,
      width: t,
      height: t,
      stroke: e,
      strokeWidth: n ? Number(r) * 24 / Number(t) : r,
      className: RS("lucide", a),
      ...c
    },
    [
      ...u.map(([d, h]) => x.createElement(d, h)),
      ...Array.isArray(l) ? l : [l]
    ]
  )
);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const qt = (e, t) => {
  const r = x.forwardRef(
    ({ className: n, ...a }, l) => x.createElement(Fj, {
      ref: l,
      iconNode: t,
      className: RS(`lucide-${zj(e)}`, n),
      ...a
    })
  );
  return r.displayName = `${e}`, r;
};
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Wj = qt("Archive", [
  ["rect", { width: "20", height: "5", x: "2", y: "3", rx: "1", key: "1wp1u1" }],
  ["path", { d: "M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8", key: "1s80jp" }],
  ["path", { d: "M10 12h4", key: "a56b0p" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Uj = qt("CalendarDays", [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }],
  ["path", { d: "M8 14h.01", key: "6423bh" }],
  ["path", { d: "M12 14h.01", key: "1etili" }],
  ["path", { d: "M16 14h.01", key: "1gbofw" }],
  ["path", { d: "M8 18h.01", key: "lrp35t" }],
  ["path", { d: "M12 18h.01", key: "mhygvu" }],
  ["path", { d: "M16 18h.01", key: "kzsmim" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Kj = qt("CircleCheck", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Hj = qt("CircleDollarSign", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8", key: "1h4pet" }],
  ["path", { d: "M12 18V6", key: "zqpxq5" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Vj = qt("CircleX", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Gj = qt("Clock3", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["polyline", { points: "12 6 12 12 16.5 12", key: "1aq6pp" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Yj = qt("Download", [
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["polyline", { points: "7 10 12 15 17 10", key: "2ggqvy" }],
  ["line", { x1: "12", x2: "12", y1: "15", y2: "3", key: "1vk2je" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const qj = qt("FileWarning", [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M12 9v4", key: "juzpu7" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Xj = qt("FolderKanban", [
  [
    "path",
    {
      d: "M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z",
      key: "1fr9dc"
    }
  ],
  ["path", { d: "M8 10v4", key: "tgpxqk" }],
  ["path", { d: "M12 10v2", key: "hh53o1" }],
  ["path", { d: "M16 10v6", key: "1d6xys" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const LS = qt("Handshake", [
  ["path", { d: "m11 17 2 2a1 1 0 1 0 3-3", key: "efffak" }],
  [
    "path",
    {
      d: "m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4",
      key: "9pr0kb"
    }
  ],
  ["path", { d: "m21 3 1 11h-2", key: "1tisrp" }],
  ["path", { d: "M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3", key: "1uvwmv" }],
  ["path", { d: "M3 4h8", key: "1ep09j" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Qj = qt("LockKeyhole", [
  ["circle", { cx: "12", cy: "16", r: "1", key: "1au0dj" }],
  ["rect", { x: "3", y: "10", width: "18", height: "12", rx: "2", key: "6s8ecr" }],
  ["path", { d: "M7 10V7a5 5 0 0 1 10 0v3", key: "1pqi11" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Zj = qt("RefreshCw", [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Jj = qt("Server", [
  ["rect", { width: "20", height: "8", x: "2", y: "2", rx: "2", ry: "2", key: "ngkwjq" }],
  ["rect", { width: "20", height: "8", x: "2", y: "14", rx: "2", ry: "2", key: "iecqi9" }],
  ["line", { x1: "6", x2: "6.01", y1: "6", y2: "6", key: "16zg32" }],
  ["line", { x1: "6", x2: "6.01", y1: "18", y2: "18", key: "nzw8ys" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ep = qt("TriangleAlert", [
  [
    "path",
    {
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
      key: "wmoenq"
    }
  ],
  ["path", { d: "M12 9v4", key: "juzpu7" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const e_ = qt("WalletCards", [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2", key: "4125el" }],
  [
    "path",
    {
      d: "M3 11h3c.8 0 1.6.3 2.1.9l1.1.9c1.6 1.6 4.1 1.6 5.7 0l1.1-.9c.5-.5 1.3-.9 2.1-.9H21",
      key: "1dpki6"
    }
  ]
]);
function tp({ title: e, actions: t, children: r, className: n = "" }) {
  return /* @__PURE__ */ N.jsxs("section", { className: `dash-section ${n}`, "aria-labelledby": `section-${e.replace(/\W+/g, "-").toLowerCase()}`, children: [
    /* @__PURE__ */ N.jsxs("div", { className: "dash-section-heading", children: [
      /* @__PURE__ */ N.jsx("h2", { id: `section-${e.replace(/\W+/g, "-").toLowerCase()}`, children: e }),
      t
    ] }),
    r
  ] });
}
function rl({ title: e, value: t, subtitle: r, trend: n, icon: a, tone: l = "blue", onClick: u }) {
  const c = /* @__PURE__ */ N.jsxs(N.Fragment, { children: [
    /* @__PURE__ */ N.jsx("div", { className: `metric-icon ${l}`, children: /* @__PURE__ */ N.jsx(a, { "aria-hidden": "true" }) }),
    /* @__PURE__ */ N.jsxs("div", { className: "metric-copy", children: [
      /* @__PURE__ */ N.jsx("span", { children: e }),
      /* @__PURE__ */ N.jsx("strong", { children: t }),
      n ? /* @__PURE__ */ N.jsx("small", { className: "positive-trend", children: n }) : r ? /* @__PURE__ */ N.jsx("small", { children: r }) : null
    ] })
  ] });
  return u ? /* @__PURE__ */ N.jsx("button", { className: "metric-card clickable", type: "button", onClick: u, children: c }) : /* @__PURE__ */ N.jsx("article", { className: "metric-card", children: c });
}
function _a({ count: e, countLabel: t, ...r }) {
  const n = r.icon;
  return /* @__PURE__ */ N.jsxs("article", { className: "payment-metric-card", children: [
    /* @__PURE__ */ N.jsxs("div", { className: "payment-card-top", children: [
      /* @__PURE__ */ N.jsx("div", { className: `metric-icon ${r.tone ?? "blue"}`, children: /* @__PURE__ */ N.jsx(n, { "aria-hidden": "true" }) }),
      /* @__PURE__ */ N.jsx("span", { children: r.title })
    ] }),
    e !== void 0 && /* @__PURE__ */ N.jsxs("div", { className: "payment-count", children: [
      /* @__PURE__ */ N.jsx("strong", { children: e }),
      /* @__PURE__ */ N.jsx("small", { children: t })
    ] }),
    /* @__PURE__ */ N.jsx("strong", { className: "payment-amount", children: r.value }),
    r.trend ? /* @__PURE__ */ N.jsx("small", { className: "positive-trend", children: r.trend }) : r.subtitle ? /* @__PURE__ */ N.jsx("small", { className: "payment-subtitle", children: r.subtitle }) : null
  ] });
}
function to({ title: e, children: t, className: r = "" }) {
  return /* @__PURE__ */ N.jsxs("article", { className: `chart-card ${r}`, children: [
    /* @__PURE__ */ N.jsx("h3", { children: e }),
    t
  ] });
}
function Cc({ message: e = "Não há dados para o período selecionado." }) {
  return /* @__PURE__ */ N.jsxs("div", { className: "chart-empty", children: [
    /* @__PURE__ */ N.jsx(ep, { "aria-hidden": "true" }),
    /* @__PURE__ */ N.jsx("span", { children: e })
  ] });
}
function t_() {
  return /* @__PURE__ */ N.jsxs("div", { className: "react-dashboard-skeleton", "aria-label": "Carregando dashboard", children: [
    /* @__PURE__ */ N.jsx("div", { className: "skeleton-block skeleton-welcome" }),
    /* @__PURE__ */ N.jsx("div", { className: "skeleton-grid", children: Array.from({ length: 5 }, (e, t) => /* @__PURE__ */ N.jsx("div", { className: "skeleton-block" }, t)) })
  ] });
}
function r_({ onRetry: e }) {
  return /* @__PURE__ */ N.jsxs("div", { className: "dashboard-error", role: "alert", children: [
    /* @__PURE__ */ N.jsx(ep, { "aria-hidden": "true" }),
    /* @__PURE__ */ N.jsxs("div", { children: [
      /* @__PURE__ */ N.jsx("strong", { children: "Não foi possível carregar o Dashboard." }),
      /* @__PURE__ */ N.jsx("span", { children: "Tente novamente em instantes." })
    ] }),
    /* @__PURE__ */ N.jsx("button", { type: "button", onClick: e, children: "Tentar novamente" })
  ] });
}
const n_ = new Intl.NumberFormat("pt-BR"), i_ = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }), a_ = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 1 }), Dt = (e) => n_.format(e), ii = (e) => i_.format(e), Ms = (e) => `${a_.format(e)}%`, yx = (e) => e.split("-").reverse().join("/");
function zS(e) {
  var t, r, n = "";
  if (typeof e == "string" || typeof e == "number") n += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var a = e.length;
    for (t = 0; t < a; t++) e[t] && (r = zS(e[t])) && (n && (n += " "), n += r);
  } else for (r in e) e[r] && (n && (n += " "), n += r);
  return n;
}
function $e() {
  for (var e, t, r = 0, n = "", a = arguments.length; r < a; r++) (e = arguments[r]) && (t = zS(e)) && (n && (n += " "), n += t);
  return n;
}
var o_ = ["dangerouslySetInnerHTML", "onCopy", "onCopyCapture", "onCut", "onCutCapture", "onPaste", "onPasteCapture", "onCompositionEnd", "onCompositionEndCapture", "onCompositionStart", "onCompositionStartCapture", "onCompositionUpdate", "onCompositionUpdateCapture", "onFocus", "onFocusCapture", "onBlur", "onBlurCapture", "onChange", "onChangeCapture", "onBeforeInput", "onBeforeInputCapture", "onInput", "onInputCapture", "onReset", "onResetCapture", "onSubmit", "onSubmitCapture", "onInvalid", "onInvalidCapture", "onLoad", "onLoadCapture", "onError", "onErrorCapture", "onKeyDown", "onKeyDownCapture", "onKeyPress", "onKeyPressCapture", "onKeyUp", "onKeyUpCapture", "onAbort", "onAbortCapture", "onCanPlay", "onCanPlayCapture", "onCanPlayThrough", "onCanPlayThroughCapture", "onDurationChange", "onDurationChangeCapture", "onEmptied", "onEmptiedCapture", "onEncrypted", "onEncryptedCapture", "onEnded", "onEndedCapture", "onLoadedData", "onLoadedDataCapture", "onLoadedMetadata", "onLoadedMetadataCapture", "onLoadStart", "onLoadStartCapture", "onPause", "onPauseCapture", "onPlay", "onPlayCapture", "onPlaying", "onPlayingCapture", "onProgress", "onProgressCapture", "onRateChange", "onRateChangeCapture", "onSeeked", "onSeekedCapture", "onSeeking", "onSeekingCapture", "onStalled", "onStalledCapture", "onSuspend", "onSuspendCapture", "onTimeUpdate", "onTimeUpdateCapture", "onVolumeChange", "onVolumeChangeCapture", "onWaiting", "onWaitingCapture", "onAuxClick", "onAuxClickCapture", "onClick", "onClickCapture", "onContextMenu", "onContextMenuCapture", "onDoubleClick", "onDoubleClickCapture", "onDrag", "onDragCapture", "onDragEnd", "onDragEndCapture", "onDragEnter", "onDragEnterCapture", "onDragExit", "onDragExitCapture", "onDragLeave", "onDragLeaveCapture", "onDragOver", "onDragOverCapture", "onDragStart", "onDragStartCapture", "onDrop", "onDropCapture", "onMouseDown", "onMouseDownCapture", "onMouseEnter", "onMouseLeave", "onMouseMove", "onMouseMoveCapture", "onMouseOut", "onMouseOutCapture", "onMouseOver", "onMouseOverCapture", "onMouseUp", "onMouseUpCapture", "onSelect", "onSelectCapture", "onTouchCancel", "onTouchCancelCapture", "onTouchEnd", "onTouchEndCapture", "onTouchMove", "onTouchMoveCapture", "onTouchStart", "onTouchStartCapture", "onPointerDown", "onPointerDownCapture", "onPointerMove", "onPointerMoveCapture", "onPointerUp", "onPointerUpCapture", "onPointerCancel", "onPointerCancelCapture", "onPointerEnter", "onPointerEnterCapture", "onPointerLeave", "onPointerLeaveCapture", "onPointerOver", "onPointerOverCapture", "onPointerOut", "onPointerOutCapture", "onGotPointerCapture", "onGotPointerCaptureCapture", "onLostPointerCapture", "onLostPointerCaptureCapture", "onScroll", "onScrollCapture", "onWheel", "onWheelCapture", "onAnimationStart", "onAnimationStartCapture", "onAnimationEnd", "onAnimationEndCapture", "onAnimationIteration", "onAnimationIterationCapture", "onTransitionEnd", "onTransitionEndCapture"];
function rp(e) {
  if (typeof e != "string")
    return !1;
  var t = o_;
  return t.includes(e);
}
var l_ = [
  "aria-activedescendant",
  "aria-atomic",
  "aria-autocomplete",
  "aria-busy",
  "aria-checked",
  "aria-colcount",
  "aria-colindex",
  "aria-colspan",
  "aria-controls",
  "aria-current",
  "aria-describedby",
  "aria-details",
  "aria-disabled",
  "aria-errormessage",
  "aria-expanded",
  "aria-flowto",
  "aria-haspopup",
  "aria-hidden",
  "aria-invalid",
  "aria-keyshortcuts",
  "aria-label",
  "aria-labelledby",
  "aria-level",
  "aria-live",
  "aria-modal",
  "aria-multiline",
  "aria-multiselectable",
  "aria-orientation",
  "aria-owns",
  "aria-placeholder",
  "aria-posinset",
  "aria-pressed",
  "aria-readonly",
  "aria-relevant",
  "aria-required",
  "aria-roledescription",
  "aria-rowcount",
  "aria-rowindex",
  "aria-rowspan",
  "aria-selected",
  "aria-setsize",
  "aria-sort",
  "aria-valuemax",
  "aria-valuemin",
  "aria-valuenow",
  "aria-valuetext",
  "className",
  "color",
  "height",
  "id",
  "lang",
  "max",
  "media",
  "method",
  "min",
  "name",
  "style",
  /*
   * removed 'type' SVGElementPropKey because we do not currently use any SVG elements
   * that can use it, and it conflicts with the recharts prop 'type'
   * https://github.com/recharts/recharts/pull/3327
   * https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/type
   */
  // 'type',
  "target",
  "width",
  "role",
  "tabIndex",
  "accentHeight",
  "accumulate",
  "additive",
  "alignmentBaseline",
  "allowReorder",
  "alphabetic",
  "amplitude",
  "arabicForm",
  "ascent",
  "attributeName",
  "attributeType",
  "autoReverse",
  "azimuth",
  "baseFrequency",
  "baselineShift",
  "baseProfile",
  "bbox",
  "begin",
  "bias",
  "by",
  "calcMode",
  "capHeight",
  "clip",
  "clipPath",
  "clipPathUnits",
  "clipRule",
  "colorInterpolation",
  "colorInterpolationFilters",
  "colorProfile",
  "colorRendering",
  "contentScriptType",
  "contentStyleType",
  "cursor",
  "cx",
  "cy",
  "d",
  "decelerate",
  "descent",
  "diffuseConstant",
  "direction",
  "display",
  "divisor",
  "dominantBaseline",
  "dur",
  "dx",
  "dy",
  "edgeMode",
  "elevation",
  "enableBackground",
  "end",
  "exponent",
  "externalResourcesRequired",
  "fill",
  "fillOpacity",
  "fillRule",
  "filter",
  "filterRes",
  "filterUnits",
  "floodColor",
  "floodOpacity",
  "focusable",
  "fontFamily",
  "fontSize",
  "fontSizeAdjust",
  "fontStretch",
  "fontStyle",
  "fontVariant",
  "fontWeight",
  "format",
  "from",
  "fx",
  "fy",
  "g1",
  "g2",
  "glyphName",
  "glyphOrientationHorizontal",
  "glyphOrientationVertical",
  "glyphRef",
  "gradientTransform",
  "gradientUnits",
  "hanging",
  "horizAdvX",
  "horizOriginX",
  "href",
  "ideographic",
  "imageRendering",
  "in2",
  "in",
  "intercept",
  "k1",
  "k2",
  "k3",
  "k4",
  "k",
  "kernelMatrix",
  "kernelUnitLength",
  "kerning",
  "keyPoints",
  "keySplines",
  "keyTimes",
  "lengthAdjust",
  "letterSpacing",
  "lightingColor",
  "limitingConeAngle",
  "local",
  "markerEnd",
  "markerHeight",
  "markerMid",
  "markerStart",
  "markerUnits",
  "markerWidth",
  "mask",
  "maskContentUnits",
  "maskUnits",
  "mathematical",
  "mode",
  "numOctaves",
  "offset",
  "opacity",
  "operator",
  "order",
  "orient",
  "orientation",
  "origin",
  "overflow",
  "overlinePosition",
  "overlineThickness",
  "paintOrder",
  "panose1",
  "pathLength",
  "patternContentUnits",
  "patternTransform",
  "patternUnits",
  "pointerEvents",
  "pointsAtX",
  "pointsAtY",
  "pointsAtZ",
  "preserveAlpha",
  "preserveAspectRatio",
  "primitiveUnits",
  "r",
  "radius",
  "refX",
  "refY",
  "renderingIntent",
  "repeatCount",
  "repeatDur",
  "requiredExtensions",
  "requiredFeatures",
  "restart",
  "result",
  "rotate",
  "rx",
  "ry",
  "seed",
  "shapeRendering",
  "slope",
  "spacing",
  "specularConstant",
  "specularExponent",
  "speed",
  "spreadMethod",
  "startOffset",
  "stdDeviation",
  "stemh",
  "stemv",
  "stitchTiles",
  "stopColor",
  "stopOpacity",
  "strikethroughPosition",
  "strikethroughThickness",
  "string",
  "stroke",
  "strokeDasharray",
  "strokeDashoffset",
  "strokeLinecap",
  "strokeLinejoin",
  "strokeMiterlimit",
  "strokeOpacity",
  "strokeWidth",
  "surfaceScale",
  "systemLanguage",
  "tableValues",
  "targetX",
  "targetY",
  "textAnchor",
  "textDecoration",
  "textLength",
  "textRendering",
  "to",
  "transform",
  "u1",
  "u2",
  "underlinePosition",
  "underlineThickness",
  "unicode",
  "unicodeBidi",
  "unicodeRange",
  "unitsPerEm",
  "vAlphabetic",
  "values",
  "vectorEffect",
  "version",
  "vertAdvY",
  "vertOriginX",
  "vertOriginY",
  "vHanging",
  "vIdeographic",
  "viewTarget",
  "visibility",
  "vMathematical",
  "widths",
  "wordSpacing",
  "writingMode",
  "x1",
  "x2",
  "x",
  "xChannelSelector",
  "xHeight",
  "xlinkActuate",
  "xlinkArcrole",
  "xlinkHref",
  "xlinkRole",
  "xlinkShow",
  "xlinkTitle",
  "xlinkType",
  "xmlBase",
  "xmlLang",
  "xmlns",
  "xmlnsXlink",
  "xmlSpace",
  "y1",
  "y2",
  "y",
  "yChannelSelector",
  "z",
  "zoomAndPan",
  "ref",
  "key",
  "angle"
], u_ = new Set(l_);
function BS(e) {
  return typeof e != "string" ? !1 : u_.has(e);
}
function FS(e) {
  return typeof e == "string" && e.startsWith("data-");
}
function vr(e) {
  if (typeof e != "object" || e === null)
    return {};
  var t = {};
  for (var r in e)
    Object.prototype.hasOwnProperty.call(e, r) && (BS(r) || FS(r)) && (t[r] = e[r]);
  return t;
}
function Hi(e) {
  if (e == null)
    return null;
  if (/* @__PURE__ */ x.isValidElement(e) && typeof e.props == "object" && e.props !== null) {
    var t = e.props;
    return vr(t);
  }
  return typeof e == "object" && !Array.isArray(e) ? vr(e) : null;
}
function hr(e) {
  var t = {};
  for (var r in e)
    Object.prototype.hasOwnProperty.call(e, r) && (BS(r) || FS(r) || rp(r)) && (t[r] = e[r]);
  return t;
}
function s_(e) {
  return e == null ? null : /* @__PURE__ */ x.isValidElement(e) ? hr(e.props) : typeof e == "object" && !Array.isArray(e) ? hr(e) : null;
}
var c_ = ["children", "width", "height", "viewBox", "className", "style", "title", "desc"];
function ah() {
  return ah = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, ah.apply(null, arguments);
}
function f_(e, t) {
  if (e == null) return {};
  var r, n, a = d_(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]);
  }
  return a;
}
function d_(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
var np = /* @__PURE__ */ x.forwardRef((e, t) => {
  var r = e.children, n = e.width, a = e.height, l = e.viewBox, u = e.className, c = e.style, f = e.title, d = e.desc, h = f_(e, c_), p = l || {
    width: n,
    height: a,
    x: 0,
    y: 0
  }, y = $e("recharts-surface", u);
  return /* @__PURE__ */ x.createElement("svg", ah({}, hr(h), {
    className: y,
    width: n,
    height: a,
    style: c,
    viewBox: "".concat(p.x, " ").concat(p.y, " ").concat(p.width, " ").concat(p.height),
    ref: t
  }), /* @__PURE__ */ x.createElement("title", null, f), /* @__PURE__ */ x.createElement("desc", null, d), r);
}), v_ = ["children", "className"];
function oh() {
  return oh = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, oh.apply(null, arguments);
}
function h_(e, t) {
  if (e == null) return {};
  var r, n, a = p_(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]);
  }
  return a;
}
function p_(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
var yt = /* @__PURE__ */ x.forwardRef((e, t) => {
  var r = e.children, n = e.className, a = h_(e, v_), l = $e("recharts-layer", n);
  return /* @__PURE__ */ x.createElement("g", oh({
    className: l
  }, hr(a), {
    ref: t
  }), r);
}), ip = $S();
function lh(e) {
  return e === "__proto__";
}
const m_ = /\.|(\[(?:[^[\]]*|(["'])(?:(?!\2)[^\\]|\\.)*?\2)\])/;
function WS(e) {
  switch (typeof e) {
    case "number":
    case "symbol":
      return !1;
    case "string":
      return e === "" || e.startsWith(".") || e.endsWith(".") ? !1 : m_.test(e);
    default:
      return !1;
  }
}
function Ic(e) {
  var t;
  return typeof e == "string" || typeof e == "symbol" ? e : Object.is((t = e == null ? void 0 : e.valueOf) == null ? void 0 : t.call(e), -0) ? "-0" : String(e);
}
function ap(e) {
  return typeof e == "symbol" || e instanceof Symbol;
}
function y_(e) {
  return e == null ? "" : US(e);
}
function US(e) {
  if (typeof e == "string") return e;
  if (Array.isArray(e)) return e.map(US).join(",");
  if (ap(e)) return e.toString();
  const t = e + "";
  return t === "0" && Object.is(Number(e), -0) ? "-0" : t;
}
function op(e) {
  if (Array.isArray(e)) return e.map(Ic);
  if (typeof e == "symbol") return [e];
  e = y_(e);
  const t = [], r = e.length;
  if (r === 0) return t;
  let n = 0, a = "", l = "", u = !1, c = !1;
  const f = /^-?\d+(?:\.\d+)?$/;
  for (e.charCodeAt(0) === 46 && t.push(""); n < r; ) {
    const d = e[n];
    if (l) d === "\\" && n + 1 < r ? (n++, a += e[n]) : d === l ? l = "" : a += d;
    else if (u) if (d === '"' || d === "'")
      l = d, c = !0;
    else if (d === "]") {
      if (u = !1, !c && a.includes(".") && !f.test(a)) {
        const h = a.split(".");
        for (let p = 0; p < h.length; p++) h[p] !== "" && t.push(h[p]);
      } else t.push(a);
      a = "";
    } else a += d;
    else if (d === "[")
      u = !0, c = !1, a && (t.push(a), a = "");
    else if (d === ".") {
      a && (t.push(a), a = "");
      const h = e[n + 1];
      (h === void 0 || h === ".") && t.push("");
    } else a += d;
    n++;
  }
  return a && t.push(a), t;
}
function ln(e, t, r) {
  if (e == null) return r;
  switch (typeof t) {
    case "string": {
      if (lh(t)) return r;
      const n = e[t];
      return n === void 0 ? WS(t) && !Object.hasOwn(e, t) ? ln(e, op(t), r) : r : n;
    }
    case "number":
    case "symbol": {
      typeof t == "number" && (t = Ic(t));
      const n = e[t];
      return n === void 0 ? r : n;
    }
    default: {
      if (Array.isArray(t)) return g_(e, t, r);
      if (Object.is(t == null ? void 0 : t.valueOf(), -0) ? t = "-0" : t = String(t), lh(t)) return r;
      const n = e[t];
      return n === void 0 ? r : n;
    }
  }
}
function g_(e, t, r) {
  if (t.length === 0) return r;
  let n = e;
  for (let a = 0; a < t.length; a++) {
    if (n == null || lh(t[a])) return r;
    n = n[t[a]];
  }
  return n === void 0 ? r : n;
}
var x_ = 4;
function An(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : x_, r = 10 ** t, n = Math.round(e * r) / r;
  return Object.is(n, -0) ? 0 : n;
}
function Tt(e) {
  for (var t = arguments.length, r = new Array(t > 1 ? t - 1 : 0), n = 1; n < t; n++)
    r[n - 1] = arguments[n];
  return e.reduce((a, l, u) => {
    var c = r[u - 1];
    return typeof c == "string" ? a + c + l : c !== void 0 ? a + An(c) + l : a + l;
  }, "");
}
var Et = (e) => e === 0 ? 0 : e > 0 ? 1 : -1, un = (e) => typeof e == "number" && e != +e, Vi = (e) => typeof e == "string" && e.length > 1 && e.indexOf("%") === e.length - 1, oe = (e) => (typeof e == "number" || e instanceof Number) && !un(e), sn = (e) => oe(e) || typeof e == "string", b_ = 0, bl = (e) => {
  var t = ++b_;
  return "".concat(e || "").concat(t);
}, Wt = function(t, r) {
  var n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0, a = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : !1;
  if (!oe(t) && typeof t != "string")
    return n;
  var l;
  if (Vi(t)) {
    if (r == null)
      return n;
    var u = t.indexOf("%");
    l = r * parseFloat(t.slice(0, u)) / 100;
  } else
    l = +t;
  return un(l) && (l = n), a && r != null && l > r && (l = r), l;
}, KS = (e) => {
  if (!Array.isArray(e))
    return !1;
  for (var t = e.length, r = {}, n = 0; n < t; n++)
    if (!r[String(e[n])])
      r[String(e[n])] = !0;
    else
      return !0;
  return !1;
};
function nt(e, t, r) {
  return oe(e) && oe(t) ? An(e + r * (t - e)) : t;
}
function HS(e, t, r) {
  if (!(!e || !e.length))
    return e.find((n) => n && (typeof t == "function" ? t(n) : ln(n, t)) === r);
}
var Qe = (e) => e === null || typeof e > "u", Tl = (e) => Qe(e) ? e : "".concat(e.charAt(0).toUpperCase()).concat(e.slice(1));
function nr(e) {
  return e != null;
}
function Ji() {
}
function lp(e) {
  if (e)
    return {
      x: e.x,
      y: e.y,
      upperWidth: "upperWidth" in e ? e.upperWidth : e.width,
      lowerWidth: "lowerWidth" in e ? e.lowerWidth : e.width,
      width: e.width,
      height: e.height
    };
}
function gx(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Zr(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? gx(Object(r), !0).forEach(function(n) {
      w_(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : gx(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function w_(e, t, r) {
  return (t = S_(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function S_(e) {
  var t = P_(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function P_(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var VS = (e) => {
  var t = e.viewBox, r = e.position, n = e.offset, a = n === void 0 ? 0 : n, l = e.parentViewBox, u = e.clamp, c = lp(t), f = c.x, d = c.y, h = c.height, p = c.upperWidth, y = c.lowerWidth, b = f, w = f + (p - y) / 2, P = (b + w) / 2, S = (p + y) / 2, O = b + p / 2, k = h >= 0 ? 1 : -1, I = k * a, E = k > 0 ? "end" : "start", _ = k > 0 ? "start" : "end", C = p >= 0 ? 1 : -1, R = C * a, W = C > 0 ? "end" : "start", V = C > 0 ? "start" : "end", K = l;
  if (r === "top") {
    var G = {
      x: b + p / 2,
      y: d - I,
      horizontalAnchor: "middle",
      verticalAnchor: E
    };
    return u && K && (G.height = Math.max(d - K.y, 0), G.width = p), G;
  }
  if (r === "bottom") {
    var F = {
      x: w + y / 2,
      y: d + h + I,
      horizontalAnchor: "middle",
      verticalAnchor: _
    };
    return u && K && (F.height = Math.max(K.y + K.height - (d + h), 0), F.width = y), F;
  }
  if (r === "left") {
    var ie = {
      x: P - R,
      y: d + h / 2,
      horizontalAnchor: W,
      verticalAnchor: "middle"
    };
    return u && K && (ie.width = Math.max(ie.x - K.x, 0), ie.height = h), ie;
  }
  if (r === "right") {
    var re = {
      x: P + S + R,
      y: d + h / 2,
      horizontalAnchor: V,
      verticalAnchor: "middle"
    };
    return u && K && (re.width = Math.max(K.x + K.width - re.x, 0), re.height = h), re;
  }
  var ne = u && K ? {
    width: S,
    height: h
  } : {};
  return r === "insideLeft" ? Zr({
    x: P + R,
    y: d + h / 2,
    horizontalAnchor: V,
    verticalAnchor: "middle"
  }, ne) : r === "insideRight" ? Zr({
    x: P + S - R,
    y: d + h / 2,
    horizontalAnchor: W,
    verticalAnchor: "middle"
  }, ne) : r === "insideTop" ? Zr({
    x: b + p / 2,
    y: d + I,
    horizontalAnchor: "middle",
    verticalAnchor: _
  }, ne) : r === "insideBottom" ? Zr({
    x: w + y / 2,
    y: d + h - I,
    horizontalAnchor: "middle",
    verticalAnchor: E
  }, ne) : r === "insideTopLeft" ? Zr({
    x: b + R,
    y: d + I,
    horizontalAnchor: V,
    verticalAnchor: _
  }, ne) : r === "insideTopRight" ? Zr({
    x: b + p - R,
    y: d + I,
    horizontalAnchor: W,
    verticalAnchor: _
  }, ne) : r === "insideBottomLeft" ? Zr({
    x: w + R,
    y: d + h - I,
    horizontalAnchor: V,
    verticalAnchor: E
  }, ne) : r === "insideBottomRight" ? Zr({
    x: w + y - R,
    y: d + h - I,
    horizontalAnchor: W,
    verticalAnchor: E
  }, ne) : r && typeof r == "object" && (oe(r.x) || Vi(r.x)) && (oe(r.y) || Vi(r.y)) ? Zr({
    x: f + Wt(r.x, S),
    y: d + Wt(r.y, h),
    horizontalAnchor: "end",
    verticalAnchor: "end"
  }, ne) : Zr({
    x: O,
    y: d + h / 2,
    horizontalAnchor: "middle",
    verticalAnchor: "middle"
  }, ne);
}, A_ = ["top", "left", "right", "bottom"];
function up(e) {
  return e == null ? !1 : typeof e == "object" ? !0 : A_.includes(e);
}
var GS = /* @__PURE__ */ x.createContext(null), O_ = () => x.useContext(GS);
function Ue(e) {
  return function() {
    return e;
  };
}
const YS = Math.cos, Ds = Math.sin, Kr = Math.sqrt, Ns = Math.PI, jc = 2 * Ns, uh = Math.PI, sh = 2 * uh, Di = 1e-6, E_ = sh - Di;
function qS(e) {
  this._ += e[0];
  for (let t = 1, r = e.length; t < r; ++t)
    this._ += arguments[t] + e[t];
}
function k_(e) {
  let t = Math.floor(e);
  if (!(t >= 0)) throw new Error(`invalid digits: ${e}`);
  if (t > 15) return qS;
  const r = 10 ** t;
  return function(n) {
    this._ += n[0];
    for (let a = 1, l = n.length; a < l; ++a)
      this._ += Math.round(arguments[a] * r) / r + n[a];
  };
}
class C_ {
  constructor(t) {
    this._x0 = this._y0 = // start of current subpath
    this._x1 = this._y1 = null, this._ = "", this._append = t == null ? qS : k_(t);
  }
  moveTo(t, r) {
    this._append`M${this._x0 = this._x1 = +t},${this._y0 = this._y1 = +r}`;
  }
  closePath() {
    this._x1 !== null && (this._x1 = this._x0, this._y1 = this._y0, this._append`Z`);
  }
  lineTo(t, r) {
    this._append`L${this._x1 = +t},${this._y1 = +r}`;
  }
  quadraticCurveTo(t, r, n, a) {
    this._append`Q${+t},${+r},${this._x1 = +n},${this._y1 = +a}`;
  }
  bezierCurveTo(t, r, n, a, l, u) {
    this._append`C${+t},${+r},${+n},${+a},${this._x1 = +l},${this._y1 = +u}`;
  }
  arcTo(t, r, n, a, l) {
    if (t = +t, r = +r, n = +n, a = +a, l = +l, l < 0) throw new Error(`negative radius: ${l}`);
    let u = this._x1, c = this._y1, f = n - t, d = a - r, h = u - t, p = c - r, y = h * h + p * p;
    if (this._x1 === null)
      this._append`M${this._x1 = t},${this._y1 = r}`;
    else if (y > Di) if (!(Math.abs(p * f - d * h) > Di) || !l)
      this._append`L${this._x1 = t},${this._y1 = r}`;
    else {
      let b = n - u, w = a - c, P = f * f + d * d, S = b * b + w * w, O = Math.sqrt(P), k = Math.sqrt(y), I = l * Math.tan((uh - Math.acos((P + y - S) / (2 * O * k))) / 2), E = I / k, _ = I / O;
      Math.abs(E - 1) > Di && this._append`L${t + E * h},${r + E * p}`, this._append`A${l},${l},0,0,${+(p * b > h * w)},${this._x1 = t + _ * f},${this._y1 = r + _ * d}`;
    }
  }
  arc(t, r, n, a, l, u) {
    if (t = +t, r = +r, n = +n, u = !!u, n < 0) throw new Error(`negative radius: ${n}`);
    let c = n * Math.cos(a), f = n * Math.sin(a), d = t + c, h = r + f, p = 1 ^ u, y = u ? a - l : l - a;
    this._x1 === null ? this._append`M${d},${h}` : (Math.abs(this._x1 - d) > Di || Math.abs(this._y1 - h) > Di) && this._append`L${d},${h}`, n && (y < 0 && (y = y % sh + sh), y > E_ ? this._append`A${n},${n},0,1,${p},${t - c},${r - f}A${n},${n},0,1,${p},${this._x1 = d},${this._y1 = h}` : y > Di && this._append`A${n},${n},0,${+(y >= uh)},${p},${this._x1 = t + n * Math.cos(l)},${this._y1 = r + n * Math.sin(l)}`);
  }
  rect(t, r, n, a) {
    this._append`M${this._x0 = this._x1 = +t},${this._y0 = this._y1 = +r}h${n = +n}v${+a}h${-n}Z`;
  }
  toString() {
    return this._;
  }
}
function sp(e) {
  let t = 3;
  return e.digits = function(r) {
    if (!arguments.length) return t;
    if (r == null)
      t = null;
    else {
      const n = Math.floor(r);
      if (!(n >= 0)) throw new RangeError(`invalid digits: ${r}`);
      t = n;
    }
    return e;
  }, () => new C_(t);
}
function cp(e) {
  return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function XS(e) {
  this._context = e;
}
XS.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._point = 0;
  },
  lineEnd: function() {
    (this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
  },
  point: function(e, t) {
    switch (e = +e, t = +t, this._point) {
      case 0:
        this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
        break;
      case 1:
        this._point = 2;
      // falls through
      default:
        this._context.lineTo(e, t);
        break;
    }
  }
};
function _c(e) {
  return new XS(e);
}
function QS(e) {
  return e[0];
}
function ZS(e) {
  return e[1];
}
function JS(e, t) {
  var r = Ue(!0), n = null, a = _c, l = null, u = sp(c);
  e = typeof e == "function" ? e : e === void 0 ? QS : Ue(e), t = typeof t == "function" ? t : t === void 0 ? ZS : Ue(t);
  function c(f) {
    var d, h = (f = cp(f)).length, p, y = !1, b;
    for (n == null && (l = a(b = u())), d = 0; d <= h; ++d)
      !(d < h && r(p = f[d], d, f)) === y && ((y = !y) ? l.lineStart() : l.lineEnd()), y && l.point(+e(p, d, f), +t(p, d, f));
    if (b) return l = null, b + "" || null;
  }
  return c.x = function(f) {
    return arguments.length ? (e = typeof f == "function" ? f : Ue(+f), c) : e;
  }, c.y = function(f) {
    return arguments.length ? (t = typeof f == "function" ? f : Ue(+f), c) : t;
  }, c.defined = function(f) {
    return arguments.length ? (r = typeof f == "function" ? f : Ue(!!f), c) : r;
  }, c.curve = function(f) {
    return arguments.length ? (a = f, n != null && (l = a(n)), c) : a;
  }, c.context = function(f) {
    return arguments.length ? (f == null ? n = l = null : l = a(n = f), c) : n;
  }, c;
}
function fs(e, t, r) {
  var n = null, a = Ue(!0), l = null, u = _c, c = null, f = sp(d);
  e = typeof e == "function" ? e : e === void 0 ? QS : Ue(+e), t = typeof t == "function" ? t : Ue(t === void 0 ? 0 : +t), r = typeof r == "function" ? r : r === void 0 ? ZS : Ue(+r);
  function d(p) {
    var y, b, w, P = (p = cp(p)).length, S, O = !1, k, I = new Array(P), E = new Array(P);
    for (l == null && (c = u(k = f())), y = 0; y <= P; ++y) {
      if (!(y < P && a(S = p[y], y, p)) === O)
        if (O = !O)
          b = y, c.areaStart(), c.lineStart();
        else {
          for (c.lineEnd(), c.lineStart(), w = y - 1; w >= b; --w)
            c.point(I[w], E[w]);
          c.lineEnd(), c.areaEnd();
        }
      O && (I[y] = +e(S, y, p), E[y] = +t(S, y, p), c.point(n ? +n(S, y, p) : I[y], r ? +r(S, y, p) : E[y]));
    }
    if (k) return c = null, k + "" || null;
  }
  function h() {
    return JS().defined(a).curve(u).context(l);
  }
  return d.x = function(p) {
    return arguments.length ? (e = typeof p == "function" ? p : Ue(+p), n = null, d) : e;
  }, d.x0 = function(p) {
    return arguments.length ? (e = typeof p == "function" ? p : Ue(+p), d) : e;
  }, d.x1 = function(p) {
    return arguments.length ? (n = p == null ? null : typeof p == "function" ? p : Ue(+p), d) : n;
  }, d.y = function(p) {
    return arguments.length ? (t = typeof p == "function" ? p : Ue(+p), r = null, d) : t;
  }, d.y0 = function(p) {
    return arguments.length ? (t = typeof p == "function" ? p : Ue(+p), d) : t;
  }, d.y1 = function(p) {
    return arguments.length ? (r = p == null ? null : typeof p == "function" ? p : Ue(+p), d) : r;
  }, d.lineX0 = d.lineY0 = function() {
    return h().x(e).y(t);
  }, d.lineY1 = function() {
    return h().x(e).y(r);
  }, d.lineX1 = function() {
    return h().x(n).y(t);
  }, d.defined = function(p) {
    return arguments.length ? (a = typeof p == "function" ? p : Ue(!!p), d) : a;
  }, d.curve = function(p) {
    return arguments.length ? (u = p, l != null && (c = u(l)), d) : u;
  }, d.context = function(p) {
    return arguments.length ? (p == null ? l = c = null : c = u(l = p), d) : l;
  }, d;
}
class eP {
  constructor(t, r) {
    this._context = t, this._x = r;
  }
  areaStart() {
    this._line = 0;
  }
  areaEnd() {
    this._line = NaN;
  }
  lineStart() {
    this._point = 0;
  }
  lineEnd() {
    (this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
  }
  point(t, r) {
    switch (t = +t, r = +r, this._point) {
      case 0: {
        this._point = 1, this._line ? this._context.lineTo(t, r) : this._context.moveTo(t, r);
        break;
      }
      case 1:
        this._point = 2;
      // falls through
      default: {
        this._x ? this._context.bezierCurveTo(this._x0 = (this._x0 + t) / 2, this._y0, this._x0, r, t, r) : this._context.bezierCurveTo(this._x0, this._y0 = (this._y0 + r) / 2, t, this._y0, t, r);
        break;
      }
    }
    this._x0 = t, this._y0 = r;
  }
}
function I_(e) {
  return new eP(e, !0);
}
function j_(e) {
  return new eP(e, !1);
}
const fp = {
  draw(e, t) {
    const r = Kr(t / Ns);
    e.moveTo(r, 0), e.arc(0, 0, r, 0, jc);
  }
}, __ = {
  draw(e, t) {
    const r = Kr(t / 5) / 2;
    e.moveTo(-3 * r, -r), e.lineTo(-r, -r), e.lineTo(-r, -3 * r), e.lineTo(r, -3 * r), e.lineTo(r, -r), e.lineTo(3 * r, -r), e.lineTo(3 * r, r), e.lineTo(r, r), e.lineTo(r, 3 * r), e.lineTo(-r, 3 * r), e.lineTo(-r, r), e.lineTo(-3 * r, r), e.closePath();
  }
}, tP = Kr(1 / 3), T_ = tP * 2, M_ = {
  draw(e, t) {
    const r = Kr(t / T_), n = r * tP;
    e.moveTo(0, -r), e.lineTo(n, 0), e.lineTo(0, r), e.lineTo(-n, 0), e.closePath();
  }
}, D_ = {
  draw(e, t) {
    const r = Kr(t), n = -r / 2;
    e.rect(n, n, r, r);
  }
}, N_ = 0.8908130915292852, rP = Ds(Ns / 10) / Ds(7 * Ns / 10), $_ = Ds(jc / 10) * rP, R_ = -YS(jc / 10) * rP, L_ = {
  draw(e, t) {
    const r = Kr(t * N_), n = $_ * r, a = R_ * r;
    e.moveTo(0, -r), e.lineTo(n, a);
    for (let l = 1; l < 5; ++l) {
      const u = jc * l / 5, c = YS(u), f = Ds(u);
      e.lineTo(f * r, -c * r), e.lineTo(c * n - f * a, f * n + c * a);
    }
    e.closePath();
  }
}, wv = Kr(3), z_ = {
  draw(e, t) {
    const r = -Kr(t / (wv * 3));
    e.moveTo(0, r * 2), e.lineTo(-wv * r, -r), e.lineTo(wv * r, -r), e.closePath();
  }
}, Sr = -0.5, Pr = Kr(3) / 2, ch = 1 / Kr(12), B_ = (ch / 2 + 1) * 3, F_ = {
  draw(e, t) {
    const r = Kr(t / B_), n = r / 2, a = r * ch, l = n, u = r * ch + r, c = -l, f = u;
    e.moveTo(n, a), e.lineTo(l, u), e.lineTo(c, f), e.lineTo(Sr * n - Pr * a, Pr * n + Sr * a), e.lineTo(Sr * l - Pr * u, Pr * l + Sr * u), e.lineTo(Sr * c - Pr * f, Pr * c + Sr * f), e.lineTo(Sr * n + Pr * a, Sr * a - Pr * n), e.lineTo(Sr * l + Pr * u, Sr * u - Pr * l), e.lineTo(Sr * c + Pr * f, Sr * f - Pr * c), e.closePath();
  }
};
function W_(e, t) {
  let r = null, n = sp(a);
  e = typeof e == "function" ? e : Ue(e || fp), t = typeof t == "function" ? t : Ue(t === void 0 ? 64 : +t);
  function a() {
    let l;
    if (r || (r = l = n()), e.apply(this, arguments).draw(r, +t.apply(this, arguments)), l) return r = null, l + "" || null;
  }
  return a.type = function(l) {
    return arguments.length ? (e = typeof l == "function" ? l : Ue(l), a) : e;
  }, a.size = function(l) {
    return arguments.length ? (t = typeof l == "function" ? l : Ue(+l), a) : t;
  }, a.context = function(l) {
    return arguments.length ? (r = l ?? null, a) : r;
  }, a;
}
function $s() {
}
function Rs(e, t, r) {
  e._context.bezierCurveTo(
    (2 * e._x0 + e._x1) / 3,
    (2 * e._y0 + e._y1) / 3,
    (e._x0 + 2 * e._x1) / 3,
    (e._y0 + 2 * e._y1) / 3,
    (e._x0 + 4 * e._x1 + t) / 6,
    (e._y0 + 4 * e._y1 + r) / 6
  );
}
function nP(e) {
  this._context = e;
}
nP.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._y0 = this._y1 = NaN, this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 3:
        Rs(this, this._x1, this._y1);
      // falls through
      case 2:
        this._context.lineTo(this._x1, this._y1);
        break;
    }
    (this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
  },
  point: function(e, t) {
    switch (e = +e, t = +t, this._point) {
      case 0:
        this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        this._point = 3, this._context.lineTo((5 * this._x0 + this._x1) / 6, (5 * this._y0 + this._y1) / 6);
      // falls through
      default:
        Rs(this, e, t);
        break;
    }
    this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t;
  }
};
function U_(e) {
  return new nP(e);
}
function iP(e) {
  this._context = e;
}
iP.prototype = {
  areaStart: $s,
  areaEnd: $s,
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = NaN, this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 1: {
        this._context.moveTo(this._x2, this._y2), this._context.closePath();
        break;
      }
      case 2: {
        this._context.moveTo((this._x2 + 2 * this._x3) / 3, (this._y2 + 2 * this._y3) / 3), this._context.lineTo((this._x3 + 2 * this._x2) / 3, (this._y3 + 2 * this._y2) / 3), this._context.closePath();
        break;
      }
      case 3: {
        this.point(this._x2, this._y2), this.point(this._x3, this._y3), this.point(this._x4, this._y4);
        break;
      }
    }
  },
  point: function(e, t) {
    switch (e = +e, t = +t, this._point) {
      case 0:
        this._point = 1, this._x2 = e, this._y2 = t;
        break;
      case 1:
        this._point = 2, this._x3 = e, this._y3 = t;
        break;
      case 2:
        this._point = 3, this._x4 = e, this._y4 = t, this._context.moveTo((this._x0 + 4 * this._x1 + e) / 6, (this._y0 + 4 * this._y1 + t) / 6);
        break;
      default:
        Rs(this, e, t);
        break;
    }
    this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t;
  }
};
function K_(e) {
  return new iP(e);
}
function aP(e) {
  this._context = e;
}
aP.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._y0 = this._y1 = NaN, this._point = 0;
  },
  lineEnd: function() {
    (this._line || this._line !== 0 && this._point === 3) && this._context.closePath(), this._line = 1 - this._line;
  },
  point: function(e, t) {
    switch (e = +e, t = +t, this._point) {
      case 0:
        this._point = 1;
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        this._point = 3;
        var r = (this._x0 + 4 * this._x1 + e) / 6, n = (this._y0 + 4 * this._y1 + t) / 6;
        this._line ? this._context.lineTo(r, n) : this._context.moveTo(r, n);
        break;
      case 3:
        this._point = 4;
      // falls through
      default:
        Rs(this, e, t);
        break;
    }
    this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t;
  }
};
function H_(e) {
  return new aP(e);
}
function oP(e) {
  this._context = e;
}
oP.prototype = {
  areaStart: $s,
  areaEnd: $s,
  lineStart: function() {
    this._point = 0;
  },
  lineEnd: function() {
    this._point && this._context.closePath();
  },
  point: function(e, t) {
    e = +e, t = +t, this._point ? this._context.lineTo(e, t) : (this._point = 1, this._context.moveTo(e, t));
  }
};
function V_(e) {
  return new oP(e);
}
function xx(e) {
  return e < 0 ? -1 : 1;
}
function bx(e, t, r) {
  var n = e._x1 - e._x0, a = t - e._x1, l = (e._y1 - e._y0) / (n || a < 0 && -0), u = (r - e._y1) / (a || n < 0 && -0), c = (l * a + u * n) / (n + a);
  return (xx(l) + xx(u)) * Math.min(Math.abs(l), Math.abs(u), 0.5 * Math.abs(c)) || 0;
}
function wx(e, t) {
  var r = e._x1 - e._x0;
  return r ? (3 * (e._y1 - e._y0) / r - t) / 2 : t;
}
function Sv(e, t, r) {
  var n = e._x0, a = e._y0, l = e._x1, u = e._y1, c = (l - n) / 3;
  e._context.bezierCurveTo(n + c, a + c * t, l - c, u - c * r, l, u);
}
function Ls(e) {
  this._context = e;
}
Ls.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._y0 = this._y1 = this._t0 = NaN, this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 2:
        this._context.lineTo(this._x1, this._y1);
        break;
      case 3:
        Sv(this, this._t0, wx(this, this._t0));
        break;
    }
    (this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
  },
  point: function(e, t) {
    var r = NaN;
    if (e = +e, t = +t, !(e === this._x1 && t === this._y1)) {
      switch (this._point) {
        case 0:
          this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
          break;
        case 1:
          this._point = 2;
          break;
        case 2:
          this._point = 3, Sv(this, wx(this, r = bx(this, e, t)), r);
          break;
        default:
          Sv(this, this._t0, r = bx(this, e, t));
          break;
      }
      this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t, this._t0 = r;
    }
  }
};
function lP(e) {
  this._context = new uP(e);
}
(lP.prototype = Object.create(Ls.prototype)).point = function(e, t) {
  Ls.prototype.point.call(this, t, e);
};
function uP(e) {
  this._context = e;
}
uP.prototype = {
  moveTo: function(e, t) {
    this._context.moveTo(t, e);
  },
  closePath: function() {
    this._context.closePath();
  },
  lineTo: function(e, t) {
    this._context.lineTo(t, e);
  },
  bezierCurveTo: function(e, t, r, n, a, l) {
    this._context.bezierCurveTo(t, e, n, r, l, a);
  }
};
function G_(e) {
  return new Ls(e);
}
function Y_(e) {
  return new lP(e);
}
function sP(e) {
  this._context = e;
}
sP.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x = [], this._y = [];
  },
  lineEnd: function() {
    var e = this._x, t = this._y, r = e.length;
    if (r)
      if (this._line ? this._context.lineTo(e[0], t[0]) : this._context.moveTo(e[0], t[0]), r === 2)
        this._context.lineTo(e[1], t[1]);
      else
        for (var n = Sx(e), a = Sx(t), l = 0, u = 1; u < r; ++l, ++u)
          this._context.bezierCurveTo(n[0][l], a[0][l], n[1][l], a[1][l], e[u], t[u]);
    (this._line || this._line !== 0 && r === 1) && this._context.closePath(), this._line = 1 - this._line, this._x = this._y = null;
  },
  point: function(e, t) {
    this._x.push(+e), this._y.push(+t);
  }
};
function Sx(e) {
  var t, r = e.length - 1, n, a = new Array(r), l = new Array(r), u = new Array(r);
  for (a[0] = 0, l[0] = 2, u[0] = e[0] + 2 * e[1], t = 1; t < r - 1; ++t) a[t] = 1, l[t] = 4, u[t] = 4 * e[t] + 2 * e[t + 1];
  for (a[r - 1] = 2, l[r - 1] = 7, u[r - 1] = 8 * e[r - 1] + e[r], t = 1; t < r; ++t) n = a[t] / l[t - 1], l[t] -= n, u[t] -= n * u[t - 1];
  for (a[r - 1] = u[r - 1] / l[r - 1], t = r - 2; t >= 0; --t) a[t] = (u[t] - a[t + 1]) / l[t];
  for (l[r - 1] = (e[r] + a[r - 1]) / 2, t = 0; t < r - 1; ++t) l[t] = 2 * e[t + 1] - a[t + 1];
  return [a, l];
}
function q_(e) {
  return new sP(e);
}
function Tc(e, t) {
  this._context = e, this._t = t;
}
Tc.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x = this._y = NaN, this._point = 0;
  },
  lineEnd: function() {
    0 < this._t && this._t < 1 && this._point === 2 && this._context.lineTo(this._x, this._y), (this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line >= 0 && (this._t = 1 - this._t, this._line = 1 - this._line);
  },
  point: function(e, t) {
    switch (e = +e, t = +t, this._point) {
      case 0:
        this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
        break;
      case 1:
        this._point = 2;
      // falls through
      default: {
        if (this._t <= 0)
          this._context.lineTo(this._x, t), this._context.lineTo(e, t);
        else {
          var r = this._x * (1 - this._t) + e * this._t;
          this._context.lineTo(r, this._y), this._context.lineTo(r, t);
        }
        break;
      }
    }
    this._x = e, this._y = t;
  }
};
function X_(e) {
  return new Tc(e, 0.5);
}
function Q_(e) {
  return new Tc(e, 0);
}
function Z_(e) {
  return new Tc(e, 1);
}
function Gi(e, t) {
  if ((u = e.length) > 1)
    for (var r = 1, n, a, l = e[t[0]], u, c = l.length; r < u; ++r)
      for (a = l, l = e[t[r]], n = 0; n < c; ++n)
        l[n][1] += l[n][0] = isNaN(a[n][1]) ? a[n][0] : a[n][1];
}
function fh(e) {
  for (var t = e.length, r = new Array(t); --t >= 0; ) r[t] = t;
  return r;
}
function J_(e, t) {
  return e[t];
}
function e2(e) {
  const t = [];
  return t.key = e, t;
}
function t2() {
  var e = Ue([]), t = fh, r = Gi, n = J_;
  function a(l) {
    var u = Array.from(e.apply(this, arguments), e2), c, f = u.length, d = -1, h;
    for (const p of l)
      for (c = 0, ++d; c < f; ++c)
        (u[c][d] = [0, +n(p, u[c].key, d, l)]).data = p;
    for (c = 0, h = cp(t(u)); c < f; ++c)
      u[h[c]].index = c;
    return r(u, h), u;
  }
  return a.keys = function(l) {
    return arguments.length ? (e = typeof l == "function" ? l : Ue(Array.from(l)), a) : e;
  }, a.value = function(l) {
    return arguments.length ? (n = typeof l == "function" ? l : Ue(+l), a) : n;
  }, a.order = function(l) {
    return arguments.length ? (t = l == null ? fh : typeof l == "function" ? l : Ue(Array.from(l)), a) : t;
  }, a.offset = function(l) {
    return arguments.length ? (r = l ?? Gi, a) : r;
  }, a;
}
function r2(e, t) {
  if ((n = e.length) > 0) {
    for (var r, n, a = 0, l = e[0].length, u; a < l; ++a) {
      for (u = r = 0; r < n; ++r) u += e[r][a][1] || 0;
      if (u) for (r = 0; r < n; ++r) e[r][a][1] /= u;
    }
    Gi(e, t);
  }
}
function n2(e, t) {
  if ((a = e.length) > 0) {
    for (var r = 0, n = e[t[0]], a, l = n.length; r < l; ++r) {
      for (var u = 0, c = 0; u < a; ++u) c += e[u][r][1] || 0;
      n[r][1] += n[r][0] = -c / 2;
    }
    Gi(e, t);
  }
}
function i2(e, t) {
  if (!(!((u = e.length) > 0) || !((l = (a = e[t[0]]).length) > 0))) {
    for (var r = 0, n = 1, a, l, u; n < l; ++n) {
      for (var c = 0, f = 0, d = 0; c < u; ++c) {
        for (var h = e[t[c]], p = h[n][1] || 0, y = h[n - 1][1] || 0, b = (p - y) / 2, w = 0; w < c; ++w) {
          var P = e[t[w]], S = P[n][1] || 0, O = P[n - 1][1] || 0;
          b += S - O;
        }
        f += p, d += b * p;
      }
      a[n - 1][1] += a[n - 1][0] = r, f && (r -= d / f);
    }
    a[n - 1][1] += a[n - 1][0] = r, Gi(e, t);
  }
}
var a2 = ["type", "size", "sizeType"];
function dh() {
  return dh = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, dh.apply(null, arguments);
}
function Px(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Ax(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Px(Object(r), !0).forEach(function(n) {
      o2(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Px(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function o2(e, t, r) {
  return (t = l2(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function l2(e) {
  var t = u2(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function u2(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function s2(e, t) {
  if (e == null) return {};
  var r, n, a = c2(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]);
  }
  return a;
}
function c2(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
var cP = {
  symbolCircle: fp,
  symbolCross: __,
  symbolDiamond: M_,
  symbolSquare: D_,
  symbolStar: L_,
  symbolTriangle: z_,
  symbolWye: F_
}, f2 = Math.PI / 180, d2 = (e) => {
  var t = "symbol".concat(Tl(e));
  return cP[t] || fp;
}, v2 = (e, t, r) => {
  if (t === "area")
    return e;
  switch (r) {
    case "cross":
      return 5 * e * e / 9;
    case "diamond":
      return 0.5 * e * e / Math.sqrt(3);
    case "square":
      return e * e;
    case "star": {
      var n = 18 * f2;
      return 1.25 * e * e * (Math.tan(n) - Math.tan(n * 2) * Math.tan(n) ** 2);
    }
    case "triangle":
      return Math.sqrt(3) * e * e / 4;
    case "wye":
      return (21 - 10 * Math.sqrt(3)) * e * e / 8;
    default:
      return Math.PI * e * e / 4;
  }
}, h2 = (e, t) => {
  cP["symbol".concat(Tl(e))] = t;
}, fP = (e) => {
  var t = e.type, r = t === void 0 ? "circle" : t, n = e.size, a = n === void 0 ? 64 : n, l = e.sizeType, u = l === void 0 ? "area" : l, c = s2(e, a2), f = Ax(Ax({}, c), {}, {
    type: r,
    size: a,
    sizeType: u
  }), d = "circle";
  typeof r == "string" && (d = r);
  var h = () => {
    var P = d2(d), S = W_().type(P).size(v2(a, u, d)), O = S();
    if (O !== null)
      return O;
  }, p = f.className, y = f.cx, b = f.cy, w = hr(f);
  return oe(y) && oe(b) && oe(a) ? /* @__PURE__ */ x.createElement("path", dh({}, w, {
    className: $e("recharts-symbols", p),
    transform: "translate(".concat(y, ", ").concat(b, ")"),
    d: h()
  })) : null;
};
fP.registerSymbol = h2;
var dP = (e) => "radius" in e && "startAngle" in e && "endAngle" in e, dp = (e, t) => {
  if (!e || typeof e == "function" || typeof e == "boolean")
    return null;
  var r = e;
  if (/* @__PURE__ */ x.isValidElement(e) && (r = e.props), typeof r != "object" && typeof r != "function")
    return null;
  var n = {};
  return Object.keys(r).forEach((a) => {
    rp(a) && typeof r[a] == "function" && (n[a] = ((l) => r[a](r, l)));
  }), n;
}, p2 = (e, t, r) => (n) => (e(t, r, n), null), Ml = (e, t, r) => {
  if (e === null || typeof e != "object" && typeof e != "function")
    return null;
  var n = null;
  return Object.keys(e).forEach((a) => {
    var l = e[a];
    rp(a) && typeof l == "function" && (n || (n = {}), n[a] = p2(l, t, r));
  }), n;
};
function Ox(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function m2(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Ox(Object(r), !0).forEach(function(n) {
      y2(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Ox(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function y2(e, t, r) {
  return (t = g2(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function g2(e) {
  var t = x2(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function x2(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function gt(e, t) {
  var r = m2({}, e), n = t, a = Object.keys(t), l = a.reduce((u, c) => (u[c] === void 0 && n[c] !== void 0 && (u[c] = n[c]), u), r);
  return l;
}
function zs() {
  return zs = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, zs.apply(null, arguments);
}
function Ex(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function vP(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Ex(Object(r), !0).forEach(function(n) {
      b2(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Ex(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function b2(e, t, r) {
  return (t = w2(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function w2(e) {
  var t = S2(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function S2(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Or = 32, P2 = {
  align: "center",
  iconSize: 14,
  inactiveColor: "#ccc",
  layout: "horizontal",
  verticalAlign: "middle",
  labelStyle: {}
};
function A2(e) {
  if (typeof e == "object" && e !== null && "strokeDasharray" in e)
    return String(e.strokeDasharray);
}
function O2(e) {
  var t = e.data, r = e.iconType, n = e.inactiveColor, a = Or / 2, l = Or / 6, u = Or / 3, c = t.inactive ? n : t.color, f = r ?? t.type;
  if (f === "none")
    return null;
  if (f === "plainline")
    return /* @__PURE__ */ x.createElement("line", {
      strokeWidth: 4,
      fill: "none",
      stroke: c,
      strokeDasharray: A2(t.payload),
      x1: 0,
      y1: a,
      x2: Or,
      y2: a,
      className: "recharts-legend-icon"
    });
  if (f === "line")
    return /* @__PURE__ */ x.createElement("path", {
      strokeWidth: 4,
      fill: "none",
      stroke: c,
      d: "M0,".concat(a, "h").concat(u, `
            A`).concat(l, ",").concat(l, ",0,1,1,").concat(2 * u, ",").concat(a, `
            H`).concat(Or, "M").concat(2 * u, ",").concat(a, `
            A`).concat(l, ",").concat(l, ",0,1,1,").concat(u, ",").concat(a),
      className: "recharts-legend-icon"
    });
  if (f === "rect")
    return /* @__PURE__ */ x.createElement("path", {
      stroke: "none",
      fill: c,
      d: "M0,".concat(Or / 8, "h").concat(Or, "v").concat(Or * 3 / 4, "h").concat(-Or, "z"),
      className: "recharts-legend-icon"
    });
  if (/* @__PURE__ */ x.isValidElement(t.legendIcon)) {
    var d = vP({}, t);
    return delete d.legendIcon, /* @__PURE__ */ x.cloneElement(t.legendIcon, d);
  }
  return /* @__PURE__ */ x.createElement(fP, {
    fill: c,
    cx: a,
    cy: a,
    size: Or,
    sizeType: "diameter",
    type: f
  });
}
function E2(e) {
  var t = e.payload, r = e.iconSize, n = e.layout, a = e.formatter, l = e.inactiveColor, u = e.iconType, c = e.labelStyle, f = {
    x: 0,
    y: 0,
    width: Or,
    height: Or
  }, d = {
    display: n === "horizontal" ? "inline-block" : "block",
    marginRight: 10,
    whiteSpace: "nowrap"
  }, h = {
    display: "inline-block",
    verticalAlign: "middle",
    marginRight: 4
  };
  return t.map((p, y) => {
    var b, w, P = p.formatter || a, S = $e({
      "recharts-legend-item": !0,
      ["legend-item-".concat(y)]: !0,
      inactive: p.inactive
    });
    if (p.type === "none")
      return null;
    var O = typeof c == "object" ? vP({}, c) : {};
    O.color = p.inactive ? l : O.color || p.color, (b = O.whiteSpace) !== null && b !== void 0 || (O.whiteSpace = "normal"), (w = O.overflowWrap) !== null && w !== void 0 || (O.overflowWrap = "break-word");
    var k = P ? P(p.value, p, y) : p.value;
    return /* @__PURE__ */ x.createElement("li", zs({
      className: S,
      style: d,
      key: "legend-item-".concat(y)
    }, Ml(e, p, y)), /* @__PURE__ */ x.createElement(np, {
      width: r,
      height: r,
      viewBox: f,
      style: h,
      "aria-label": p.value == null ? "legend icon" : "".concat(p.value, " legend icon")
    }, /* @__PURE__ */ x.createElement(O2, {
      data: p,
      iconType: u,
      inactiveColor: l
    })), /* @__PURE__ */ x.createElement("span", {
      className: "recharts-legend-item-text",
      style: O
    }, k));
  });
}
var k2 = (e) => {
  var t = gt(e, P2), r = t.payload, n = t.layout, a = t.align;
  if (!r || !r.length)
    return null;
  var l = {
    padding: 0,
    margin: 0,
    textAlign: n === "horizontal" ? a : "left"
  };
  return /* @__PURE__ */ x.createElement("ul", {
    className: "recharts-default-legend",
    style: l
  }, /* @__PURE__ */ x.createElement(E2, zs({}, t, {
    payload: r
  })));
};
function C2(e, t) {
  const r = /* @__PURE__ */ new Map();
  for (let n = 0; n < e.length; n++) {
    const a = e[n], l = t(a, n, e);
    r.has(l) || r.set(l, a);
  }
  return Array.from(r.values());
}
function I2(e, t) {
  return function(...r) {
    return e.apply(this, r.slice(0, t));
  };
}
function hP(e) {
  return e;
}
function j2(e) {
  return Number.isSafeInteger(e) && e >= 0;
}
function vp(e) {
  return e != null && typeof e != "function" && j2(e.length);
}
function _2(e) {
  return function(t) {
    return ln(t, e);
  };
}
function pP(e) {
  return e == null || typeof e != "object" && typeof e != "function";
}
function T2(e) {
  return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
function vh(e) {
  return Object.getOwnPropertySymbols(e).filter((t) => Object.prototype.propertyIsEnumerable.call(e, t));
}
function Ha(e) {
  return e == null ? e === void 0 ? "[object Undefined]" : "[object Null]" : Object.prototype.toString.call(e);
}
const mP = "[object RegExp]", hp = "[object String]", pp = "[object Number]", mp = "[object Boolean]", yP = "[object Arguments]", gP = "[object Symbol]", xP = "[object Date]", bP = "[object Map]", wP = "[object Set]", SP = "[object Array]", M2 = "[object Function]", PP = "[object ArrayBuffer]", Cs = "[object Object]", D2 = "[object Error]", AP = "[object DataView]", OP = "[object Uint8Array]", EP = "[object Uint8ClampedArray]", kP = "[object Uint16Array]", CP = "[object Uint32Array]", N2 = "[object BigUint64Array]", IP = "[object Int8Array]", jP = "[object Int16Array]", _P = "[object Int32Array]", $2 = "[object BigInt64Array]", TP = "[object Float32Array]", MP = "[object Float64Array]", kx = typeof globalThis == "object" && globalThis || typeof window == "object" && window || typeof self == "object" && self || typeof global == "object" && global || /* @__PURE__ */ (function() {
  return this;
})();
function hh(e) {
  return typeof kx.Buffer < "u" && kx.Buffer.isBuffer(e);
}
function R2(e, t) {
  return Ri(e, void 0, e, /* @__PURE__ */ new Map(), t);
}
function Ri(e, t, r, n = /* @__PURE__ */ new Map(), a = void 0) {
  const l = a == null ? void 0 : a(e, t, r, n);
  if (l !== void 0) return l;
  if (pP(e)) return e;
  if (n.has(e)) return n.get(e);
  if (Array.isArray(e)) {
    const u = new Array(e.length);
    n.set(e, u);
    for (let c = 0; c < e.length; c++) u[c] = Ri(e[c], c, r, n, a);
    return Object.hasOwn(e, "index") && (u.index = e.index), Object.hasOwn(e, "input") && (u.input = e.input), u;
  }
  if (e instanceof Date) return new Date(e.getTime());
  if (e instanceof RegExp) {
    const u = new RegExp(e.source, e.flags);
    return u.lastIndex = e.lastIndex, u;
  }
  if (e instanceof Map) {
    const u = /* @__PURE__ */ new Map();
    n.set(e, u);
    for (const [c, f] of e) u.set(c, Ri(f, c, r, n, a));
    return u;
  }
  if (e instanceof Set) {
    const u = /* @__PURE__ */ new Set();
    n.set(e, u);
    for (const c of e) u.add(Ri(c, void 0, r, n, a));
    return u;
  }
  if (hh(e)) return e.subarray();
  if (T2(e)) {
    const u = new (Object.getPrototypeOf(e)).constructor(e.length);
    n.set(e, u);
    for (let c = 0; c < e.length; c++) u[c] = Ri(e[c], c, r, n, a);
    return u;
  }
  if (e instanceof ArrayBuffer || typeof SharedArrayBuffer < "u" && e instanceof SharedArrayBuffer) return e.slice(0);
  if (e instanceof DataView) {
    const u = new DataView(e.buffer.slice(0), e.byteOffset, e.byteLength);
    return n.set(e, u), Br(u, e, r, n, a), u;
  }
  if (typeof File < "u" && e instanceof File) {
    const u = new File([e], e.name, { type: e.type });
    return n.set(e, u), Br(u, e, r, n, a), u;
  }
  if (typeof Blob < "u" && e instanceof Blob) {
    const u = new Blob([e], { type: e.type });
    return n.set(e, u), Br(u, e, r, n, a), u;
  }
  if (e instanceof Error) {
    const u = structuredClone(e);
    return n.set(e, u), u.message = e.message, u.name = e.name, u.stack = e.stack, u.cause = e.cause, u.constructor = e.constructor, Br(u, e, r, n, a), u;
  }
  if (e instanceof Boolean) {
    const u = new Boolean(e.valueOf());
    return n.set(e, u), Br(u, e, r, n, a), u;
  }
  if (e instanceof Number) {
    const u = new Number(e.valueOf());
    return n.set(e, u), Br(u, e, r, n, a), u;
  }
  if (e instanceof String) {
    const u = new String(e.valueOf());
    return n.set(e, u), Br(u, e, r, n, a), u;
  }
  if (typeof e == "object" && L2(e)) {
    const u = Object.create(Object.getPrototypeOf(e));
    return n.set(e, u), Br(u, e, r, n, a), u;
  }
  return e;
}
function Br(e, t, r = e, n, a) {
  const l = [...Object.keys(t), ...vh(t)];
  for (let u = 0; u < l.length; u++) {
    const c = l[u], f = Object.getOwnPropertyDescriptor(e, c);
    (f == null || f.writable) && (e[c] = Ri(t[c], c, r, n, a));
  }
}
function L2(e) {
  switch (Ha(e)) {
    case yP:
    case SP:
    case PP:
    case AP:
    case mp:
    case xP:
    case TP:
    case MP:
    case IP:
    case jP:
    case _P:
    case bP:
    case pp:
    case Cs:
    case mP:
    case wP:
    case hp:
    case gP:
    case OP:
    case EP:
    case kP:
    case CP:
      return !0;
    default:
      return !1;
  }
}
function z2(e) {
  return Ri(e, void 0, e, /* @__PURE__ */ new Map(), void 0);
}
function ml(e, t) {
  return e === t || Number.isNaN(e) && Number.isNaN(t);
}
function DP(e) {
  return e !== null && (typeof e == "object" || typeof e == "function");
}
function NP(e, t, r) {
  return typeof r != "function" ? NP(e, t, () => {
  }) : ph(e, t, function n(a, l, u, c, f, d) {
    const h = r(a, l, u, c, f, d);
    return h !== void 0 ? !!h : ph(a, l, n, d, !1);
  }, /* @__PURE__ */ new Map(), !0);
}
function ph(e, t, r, n, a = !1) {
  if (t === e) return !0;
  switch (typeof t) {
    case "object":
      return B2(e, t, r, n, a);
    case "function":
      return Object.keys(t).length > 0 ? ph(e, { ...t }, r, n, a) : ml(e, t);
    default:
      return DP(e) && a ? typeof t == "string" ? t === "" : !0 : ml(e, t);
  }
}
function B2(e, t, r, n, a = !1) {
  if (t == null) return !0;
  if (Array.isArray(t)) return $P(e, t, r, n);
  if (t instanceof Map) return F2(e, t, r, n);
  if (t instanceof Set) return W2(e, t, r, n);
  const l = Object.keys(t);
  if (e == null) return a && l.length === 0;
  if (a)
    pP(e) && (e = Object(e));
  else {
    const u = Ha(e);
    if (u !== "[object Object]" && u !== "[object Arguments]") return !1;
  }
  if (l.length === 0) return !0;
  if (n != null && n.has(t)) return n.get(t) === e;
  n == null || n.set(t, e);
  try {
    for (let u = 0; u < l.length; u++) {
      const c = l[u];
      if (!(c in e) || t[c] === void 0 && e[c] !== void 0 || t[c] === null && e[c] !== null || !r(e[c], t[c], c, e, t, n)) return !1;
    }
    return !0;
  } finally {
    n == null || n.delete(t);
  }
}
function F2(e, t, r, n) {
  if (t.size === 0) return !0;
  if (!(e instanceof Map)) return !1;
  for (const [a, l] of t.entries()) if (r(e.get(a), l, a, e, t, n) === !1) return !1;
  return !0;
}
function $P(e, t, r, n) {
  if (t.length === 0) return !0;
  if (!Array.isArray(e)) return !1;
  const a = /* @__PURE__ */ new Set();
  for (let l = 0; l < t.length; l++) {
    const u = t[l];
    let c = !1;
    for (let f = 0; f < e.length; f++) {
      if (a.has(f)) continue;
      const d = e[f];
      let h = !1;
      if (r(d, u, l, e, t, n) && (h = !0), h) {
        a.add(f), c = !0;
        break;
      }
    }
    if (!c) return !1;
  }
  return !0;
}
function W2(e, t, r, n) {
  return t.size === 0 ? !0 : e instanceof Set ? $P([...e], [...t], r, n) : !1;
}
function RP(e, t) {
  return NP(e, t, () => {
  });
}
function U2(e) {
  return e = z2(e), (t) => RP(t, e);
}
function K2(e, t) {
  return R2(e, (r, n, a, l) => {
    if (typeof e == "object") {
      if (Ha(e) === "[object Object]" && typeof e.constructor != "function") {
        const u = {};
        return l.set(e, u), Br(u, e, a, l), u;
      }
      switch (Object.prototype.toString.call(e)) {
        case pp:
        case hp:
        case mp: {
          const u = new e.constructor(e == null ? void 0 : e.valueOf());
          return Br(u, e), u;
        }
        case yP: {
          const u = {};
          return Br(u, e), u.length = e.length, u[Symbol.iterator] = e[Symbol.iterator], u;
        }
        default:
          return;
      }
    }
  });
}
function H2(e) {
  return K2(e);
}
const V2 = /^(?:0|[1-9]\d*)$/;
function LP(e, t = Number.MAX_SAFE_INTEGER) {
  switch (typeof e) {
    case "number":
      return Number.isInteger(e) && e >= 0 && e < t;
    case "symbol":
      return !1;
    case "string":
      return V2.test(e);
  }
}
function G2(e) {
  return e !== null && typeof e == "object" && Ha(e) === "[object Arguments]";
}
function Y2(e, t) {
  let r;
  if (Array.isArray(t) ? r = t : typeof t == "string" && WS(t) && !(t in Object(e)) ? r = op(t) : r = [t], r.length === 0) return !1;
  let n = e;
  for (let a = 0; a < r.length; a++) {
    const l = Ic(r[a]);
    if ((n == null || !Object.hasOwn(n, l)) && !((Array.isArray(n) || G2(n)) && LP(l) && Number(l) < n.length))
      return !1;
    n = n[l];
  }
  return !0;
}
function q2(e, t) {
  switch (typeof e) {
    case "object":
      Object.is(e == null ? void 0 : e.valueOf(), -0) && (e = "-0");
      break;
    case "number":
      e = Ic(e);
      break;
  }
  return t = H2(t), function(r) {
    const n = ln(r, e);
    return n === void 0 ? Y2(r, e) : t === void 0 ? n === void 0 : RP(n, t);
  };
}
function X2(e) {
  if (e == null) return hP;
  switch (typeof e) {
    case "function":
      return e;
    case "object":
      return Array.isArray(e) && e.length === 2 ? q2(e[0], e[1]) : U2(e);
    default:
      return _2(e);
  }
}
function Q2(e) {
  return e === 0 ? 0 : e;
}
function Cx(e, t = hP) {
  return vp(e) ? C2(Array.from(e), I2(X2(t), 1)).map(Q2) : [];
}
function zP(e, t, r) {
  return t === !0 ? Cx(e, r) : typeof t == "function" ? Cx(e, t) : e;
}
var Pv = { exports: {} }, Av = {}, Ov = { exports: {} }, Ev = {};
/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ix;
function Z2() {
  if (Ix) return Ev;
  Ix = 1;
  var e = eo();
  function t(p, y) {
    return p === y && (p !== 0 || 1 / p === 1 / y) || p !== p && y !== y;
  }
  var r = typeof Object.is == "function" ? Object.is : t, n = e.useState, a = e.useEffect, l = e.useLayoutEffect, u = e.useDebugValue;
  function c(p, y) {
    var b = y(), w = n({ inst: { value: b, getSnapshot: y } }), P = w[0].inst, S = w[1];
    return l(
      function() {
        P.value = b, P.getSnapshot = y, f(P) && S({ inst: P });
      },
      [p, b, y]
    ), a(
      function() {
        return f(P) && S({ inst: P }), p(function() {
          f(P) && S({ inst: P });
        });
      },
      [p]
    ), u(b), b;
  }
  function f(p) {
    var y = p.getSnapshot;
    p = p.value;
    try {
      var b = y();
      return !r(p, b);
    } catch {
      return !0;
    }
  }
  function d(p, y) {
    return y();
  }
  var h = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? d : c;
  return Ev.useSyncExternalStore = e.useSyncExternalStore !== void 0 ? e.useSyncExternalStore : h, Ev;
}
var jx;
function J2() {
  return jx || (jx = 1, Ov.exports = Z2()), Ov.exports;
}
/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var _x;
function eT() {
  if (_x) return Av;
  _x = 1;
  var e = eo(), t = J2();
  function r(d, h) {
    return d === h && (d !== 0 || 1 / d === 1 / h) || d !== d && h !== h;
  }
  var n = typeof Object.is == "function" ? Object.is : r, a = t.useSyncExternalStore, l = e.useRef, u = e.useEffect, c = e.useMemo, f = e.useDebugValue;
  return Av.useSyncExternalStoreWithSelector = function(d, h, p, y, b) {
    var w = l(null);
    if (w.current === null) {
      var P = { hasValue: !1, value: null };
      w.current = P;
    } else P = w.current;
    w = c(
      function() {
        function O(C) {
          if (!k) {
            if (k = !0, I = C, C = y(C), b !== void 0 && P.hasValue) {
              var R = P.value;
              if (b(R, C))
                return E = R;
            }
            return E = C;
          }
          if (R = E, n(I, C)) return R;
          var W = y(C);
          return b !== void 0 && b(R, W) ? (I = C, R) : (I = C, E = W);
        }
        var k = !1, I, E, _ = p === void 0 ? null : p;
        return [
          function() {
            return O(h());
          },
          _ === null ? void 0 : function() {
            return O(_());
          }
        ];
      },
      [h, p, y, b]
    );
    var S = a(d, w[0], w[1]);
    return u(
      function() {
        P.hasValue = !0, P.value = S;
      },
      [S]
    ), f(S), S;
  }, Av;
}
var Tx;
function tT() {
  return Tx || (Tx = 1, Pv.exports = eT()), Pv.exports;
}
var rT = tT(), yp = /* @__PURE__ */ x.createContext(null), nT = (e) => e, Be = () => {
  var e = x.useContext(yp);
  return e ? e.store.dispatch : nT;
}, Is = () => {
}, iT = () => Is, aT = (e, t) => e === t;
function ue(e) {
  var t = x.useContext(yp), r = x.useMemo(() => t ? (n) => {
    if (n != null)
      return e(n);
  } : Is, [t, e]);
  return rT.useSyncExternalStoreWithSelector(t ? t.subscription.addNestedSub : iT, t ? t.store.getState : Is, t ? t.store.getState : Is, r, aT);
}
function oT(e, t = `expected a function, instead received ${typeof e}`) {
  if (typeof e != "function")
    throw new TypeError(t);
}
function lT(e, t = "expected all items to be functions, instead received the following types: ") {
  if (!e.every((r) => typeof r == "function")) {
    const r = e.map(
      (n) => typeof n == "function" ? `function ${n.name || "unnamed"}()` : typeof n
    ).join(", ");
    throw new TypeError(`${t}[${r}]`);
  }
}
var Mx = (e) => Array.isArray(e) ? e : [e];
function uT(e) {
  const t = Array.isArray(e[0]) ? e[0] : e;
  return lT(
    t,
    "createSelector expects all input-selectors to be functions, but received the following types: "
  ), t;
}
function sT(e, t) {
  const r = [], { length: n } = e;
  for (let a = 0; a < n; a++)
    r.push(e[a].apply(null, t));
  return r;
}
var cT = class {
  constructor(e) {
    this.value = e;
  }
  deref() {
    return this.value;
  }
}, fT = () => typeof WeakRef > "u" ? cT : WeakRef, BP = /* @__PURE__ */ fT(), dT = 0, Dx = 1;
function ds() {
  return {
    s: dT,
    v: void 0,
    o: null,
    p: null
  };
}
function vT(e) {
  return e instanceof BP ? e.deref() : e;
}
function FP(e, t = {}) {
  let r = ds();
  const { resultEqualityCheck: n } = t;
  let a, l = 0;
  function u() {
    let c = r;
    const { length: f } = arguments;
    for (let p = 0, y = f; p < y; p++) {
      const b = arguments[p];
      if (typeof b == "function" || typeof b == "object" && b !== null) {
        let w = c.o;
        w === null && (c.o = w = /* @__PURE__ */ new WeakMap());
        const P = w.get(b);
        P === void 0 ? (c = ds(), w.set(b, c)) : c = P;
      } else {
        let w = c.p;
        w === null && (c.p = w = /* @__PURE__ */ new Map());
        const P = w.get(b);
        P === void 0 ? (c = ds(), w.set(b, c)) : c = P;
      }
    }
    const d = c;
    let h;
    if (c.s === Dx)
      h = c.v;
    else if (h = e.apply(null, arguments), l++, n) {
      const p = vT(a);
      p != null && n(p, h) && (h = p, l !== 0 && l--), a = typeof h == "object" && h !== null || typeof h == "function" ? /* @__PURE__ */ new BP(h) : h;
    }
    return d.s = Dx, d.v = h, h;
  }
  return u.clearCache = () => {
    r = ds(), u.resetResultsCount();
  }, u.resultsCount = () => l, u.resetResultsCount = () => {
    l = 0;
  }, u;
}
function hT(e, ...t) {
  const r = typeof e == "function" ? {
    memoize: e,
    memoizeOptions: t
  } : e, n = (...a) => {
    let l = 0, u = 0, c, f = {}, d = a.pop();
    typeof d == "object" && (f = d, d = a.pop()), oT(
      d,
      `createSelector expects an output function after the inputs, but received: [${typeof d}]`
    );
    const h = {
      ...r,
      ...f
    }, {
      memoize: p,
      memoizeOptions: y = [],
      argsMemoize: b = FP,
      argsMemoizeOptions: w = []
    } = h, P = Mx(y), S = Mx(w), O = uT(a), k = p(function() {
      return l++, d.apply(
        null,
        arguments
      );
    }, ...P), I = b(function() {
      u++;
      const _ = sT(
        O,
        arguments
      );
      return c = k.apply(null, _), c;
    }, ...S);
    return Object.assign(I, {
      resultFunc: d,
      memoizedResultFunc: k,
      dependencies: O,
      dependencyRecomputations: () => u,
      resetDependencyRecomputations: () => {
        u = 0;
      },
      lastResult: () => c,
      recomputations: () => l,
      resetRecomputations: () => {
        l = 0;
      },
      memoize: p,
      argsMemoize: b
    });
  };
  return Object.assign(n, {
    withTypes: () => n
  }), n;
}
var $ = /* @__PURE__ */ hT(FP);
function pT(e, t = 1) {
  const r = [], n = Math.floor(t), a = (l, u) => {
    for (let c = 0; c < l.length; c++) {
      const f = l[c];
      Array.isArray(f) && u < n ? a(f, u + 1) : r.push(f);
    }
  };
  return a(e, 0), r;
}
function mh(e, t, r) {
  return DP(r) && (typeof t == "number" && vp(r) && LP(t) && t < r.length || typeof t == "string" && t in r) ? ml(r[t], e) : !1;
}
function Nx(e) {
  return typeof e == "symbol" ? 1 : e === null ? 2 : e === void 0 ? 3 : e !== e ? 4 : 0;
}
const mT = (e, t, r) => {
  if (e !== t) {
    const n = Nx(e), a = Nx(t);
    if (n === a && n === 0) {
      if (e < t) return r === "desc" ? 1 : -1;
      if (e > t) return r === "desc" ? -1 : 1;
    }
    return r === "desc" ? a - n : n - a;
  }
  return 0;
}, yT = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, gT = /^\w*$/;
function xT(e, t) {
  return Array.isArray(e) ? !1 : typeof e == "number" || typeof e == "boolean" || e == null || ap(e) ? !0 : typeof e == "string" && (gT.test(e) || !yT.test(e)) || t != null;
}
function bT(e, t, r, n) {
  if (e == null) return [];
  r = r, Array.isArray(e) || (e = vp(e) ? Array.from(e) : Object.values(e)), Array.isArray(t) || (t = t == null ? [null] : [t]), t.length === 0 && (t = [null]), Array.isArray(r) || (r = r == null ? [] : [r]), r = r.map((c) => String(c));
  const a = (c, f) => {
    let d = c, h = 0;
    for (; h < f.length && d != null; ++h) d = d[f[h]];
    return h > 0 && h === f.length ? d : void 0;
  }, l = (c, f) => {
    if (c == null) return f;
    if (f != null)
      return typeof c == "object" && "key" in c ? Object.hasOwn(f, c.key) ? f[c.key] : a(f, c.path) : typeof c == "function" ? c(f) : Array.isArray(c) ? a(f, c) : f[c];
  }, u = t.map((c) => (Array.isArray(c) && c.length === 1 && (c = c[0]), c == null || typeof c == "function" || Array.isArray(c) || xT(c) ? c : {
    key: c,
    path: op(c)
  }));
  return e.map((c) => ({
    original: c,
    criteria: u.map((f) => l(f, c))
  })).slice().sort((c, f) => {
    for (let d = 0; d < u.length; d++) {
      const h = mT(c.criteria[d], f.criteria[d], r[d]);
      if (h !== 0) return h;
    }
    return 0;
  }).map((c) => c.original);
}
function Mc(e, ...t) {
  const r = t.length;
  return r > 1 && mh(e, t[0], t[1]) ? t = [] : r > 2 && mh(t[0], t[1], t[2]) && (t = [t[0]]), bT(e, pT(t), ["asc"]);
}
var WP = (e) => e.legend.settings, wT = (e) => e.legend.size, ST = (e) => e.legend.payload, PT = $([ST, WP], (e, t) => {
  var r = t.itemSorter, n = e.flat(1);
  return r ? Mc(n, r) : n;
});
function AT() {
  return ue(PT);
}
function OT(e, t) {
  return IT(e) || CT(e, t) || kT(e, t) || ET();
}
function ET() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function kT(e, t) {
  if (e) {
    if (typeof e == "string") return $x(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? $x(e, t) : void 0;
  }
}
function $x(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function CT(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, a, l, u, c = [], f = !0, d = !1;
    try {
      if (l = (r = r.call(e)).next, t !== 0) for (; !(f = (n = l.call(r)).done) && (c.push(n.value), c.length !== t); f = !0) ;
    } catch (h) {
      d = !0, a = h;
    } finally {
      try {
        if (!f && r.return != null && (u = r.return(), Object(u) !== u)) return;
      } finally {
        if (d) throw a;
      }
    }
    return c;
  }
}
function IT(e) {
  if (Array.isArray(e)) return e;
}
var vs = 1;
function Rx(e, t) {
  return Math.abs(e.height - t.height) > vs || Math.abs(e.left - t.left) > vs || Math.abs(e.top - t.top) > vs || Math.abs(e.width - t.width) > vs;
}
function Lx(e) {
  var t = e.getBoundingClientRect();
  return {
    height: t.height,
    left: t.left,
    top: t.top,
    width: t.width
  };
}
function UP() {
  var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [], t = x.useState({
    height: 0,
    left: 0,
    top: 0,
    width: 0
  }), r = OT(t, 2), n = r[0], a = r[1], l = x.useRef(null), u = x.useRef(n);
  u.current = n;
  var c = x.useCallback(
    (f) => {
      if (l.current != null && (l.current.disconnect(), l.current = null), f != null) {
        var d = Lx(f);
        if (Rx(d, u.current) && a(d), typeof ResizeObserver < "u") {
          var h = new ResizeObserver(() => {
            var p = Lx(f);
            Rx(p, u.current) && a(p);
          });
          h.observe(f), l.current = h;
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...e]
  );
  return x.useEffect(() => () => {
    var f;
    (f = l.current) === null || f === void 0 || f.disconnect();
  }, []), [n, c];
}
function _t(e) {
  return `Minified Redux error #${e}; visit https://redux.js.org/Errors?code=${e} for the full message or use the non-minified dev environment for full errors. `;
}
var jT = typeof Symbol == "function" && Symbol.observable || "@@observable", zx = jT, kv = () => Math.random().toString(36).substring(7).split("").join("."), _T = {
  INIT: `@@redux/INIT${/* @__PURE__ */ kv()}`,
  REPLACE: `@@redux/REPLACE${/* @__PURE__ */ kv()}`,
  PROBE_UNKNOWN_ACTION: () => `@@redux/PROBE_UNKNOWN_ACTION${kv()}`
}, Bs = _T;
function gp(e) {
  if (typeof e != "object" || e === null)
    return !1;
  let t = e;
  for (; Object.getPrototypeOf(t) !== null; )
    t = Object.getPrototypeOf(t);
  return Object.getPrototypeOf(e) === t || Object.getPrototypeOf(e) === null;
}
function KP(e, t, r) {
  if (typeof e != "function")
    throw new Error(_t(2));
  if (typeof t == "function" && typeof r == "function" || typeof r == "function" && typeof arguments[3] == "function")
    throw new Error(_t(0));
  if (typeof t == "function" && typeof r > "u" && (r = t, t = void 0), typeof r < "u") {
    if (typeof r != "function")
      throw new Error(_t(1));
    return r(KP)(e, t);
  }
  let n = e, a = t, l = /* @__PURE__ */ new Map(), u = l, c = 0, f = !1;
  function d() {
    u === l && (u = /* @__PURE__ */ new Map(), l.forEach((S, O) => {
      u.set(O, S);
    }));
  }
  function h() {
    if (f)
      throw new Error(_t(3));
    return a;
  }
  function p(S) {
    if (typeof S != "function")
      throw new Error(_t(4));
    if (f)
      throw new Error(_t(5));
    let O = !0;
    d();
    const k = c++;
    return u.set(k, S), function() {
      if (O) {
        if (f)
          throw new Error(_t(6));
        O = !1, d(), u.delete(k), l = null;
      }
    };
  }
  function y(S) {
    if (!gp(S))
      throw new Error(_t(7));
    if (typeof S.type > "u")
      throw new Error(_t(8));
    if (typeof S.type != "string")
      throw new Error(_t(17));
    if (f)
      throw new Error(_t(9));
    try {
      f = !0, a = n(a, S);
    } finally {
      f = !1;
    }
    return (l = u).forEach((k) => {
      k();
    }), S;
  }
  function b(S) {
    if (typeof S != "function")
      throw new Error(_t(10));
    n = S, y({
      type: Bs.REPLACE
    });
  }
  function w() {
    const S = p;
    return {
      /**
       * The minimal observable subscription method.
       * @param observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe(O) {
        if (typeof O != "object" || O === null)
          throw new Error(_t(11));
        function k() {
          const E = O;
          E.next && E.next(h());
        }
        return k(), {
          unsubscribe: S(k)
        };
      },
      [zx]() {
        return this;
      }
    };
  }
  return y({
    type: Bs.INIT
  }), {
    dispatch: y,
    subscribe: p,
    getState: h,
    replaceReducer: b,
    [zx]: w
  };
}
function TT(e) {
  Object.keys(e).forEach((t) => {
    const r = e[t];
    if (typeof r(void 0, {
      type: Bs.INIT
    }) > "u")
      throw new Error(_t(12));
    if (typeof r(void 0, {
      type: Bs.PROBE_UNKNOWN_ACTION()
    }) > "u")
      throw new Error(_t(13));
  });
}
function HP(e) {
  const t = Object.keys(e), r = {};
  for (let l = 0; l < t.length; l++) {
    const u = t[l];
    typeof e[u] == "function" && (r[u] = e[u]);
  }
  const n = Object.keys(r);
  let a;
  try {
    TT(r);
  } catch (l) {
    a = l;
  }
  return function(u = {}, c) {
    if (a)
      throw a;
    let f = !1;
    const d = {};
    for (let h = 0; h < n.length; h++) {
      const p = n[h], y = r[p], b = u[p], w = y(b, c);
      if (typeof w > "u")
        throw c && c.type, new Error(_t(14));
      d[p] = w, f = f || w !== b;
    }
    return f = f || n.length !== Object.keys(u).length, f ? d : u;
  };
}
function Fs(...e) {
  return e.length === 0 ? (t) => t : e.length === 1 ? e[0] : e.reduce((t, r) => (...n) => t(r(...n)));
}
function MT(...e) {
  return (t) => (r, n) => {
    const a = t(r, n);
    let l = () => {
      throw new Error(_t(15));
    };
    const u = {
      getState: a.getState,
      dispatch: (f, ...d) => l(f, ...d)
    }, c = e.map((f) => f(u));
    return l = Fs(...c)(a.dispatch), {
      ...a,
      dispatch: l
    };
  };
}
function VP(e) {
  return gp(e) && "type" in e && typeof e.type == "string";
}
var GP = Symbol.for("immer-nothing"), Bx = Symbol.for("immer-draftable"), Ut = Symbol.for("immer-state");
function Fr(e, ...t) {
  throw new Error(
    `[Immer] minified error nr: ${e}. Full error at: https://bit.ly/3cXEKWf`
  );
}
var fr = Object, Va = fr.getPrototypeOf, Ws = "constructor", Dc = "prototype", yh = "configurable", Us = "enumerable", js = "writable", wl = "value", In = (e) => !!e && !!e[Ut];
function Cr(e) {
  var t;
  return e ? YP(e) || $c(e) || !!e[Bx] || !!((t = e[Ws]) != null && t[Bx]) || Rc(e) || Lc(e) : !1;
}
var DT = fr[Dc][Ws].toString(), Fx = /* @__PURE__ */ new WeakMap();
function YP(e) {
  if (!e || !xp(e))
    return !1;
  const t = Va(e);
  if (t === null || t === fr[Dc])
    return !0;
  const r = fr.hasOwnProperty.call(t, Ws) && t[Ws];
  if (r === Object)
    return !0;
  if (!za(r))
    return !1;
  let n = Fx.get(r);
  return n === void 0 && (n = Function.toString.call(r), Fx.set(r, n)), n === DT;
}
function Nc(e, t, r = !0) {
  Dl(e) === 0 ? (r ? Reflect.ownKeys(e) : fr.keys(e)).forEach((a) => {
    t(a, e[a], e);
  }) : e.forEach((n, a) => t(a, n, e));
}
function Dl(e) {
  const t = e[Ut];
  return t ? t.type_ : $c(e) ? 1 : Rc(e) ? 2 : Lc(e) ? 3 : 0;
}
var Cv = (e, t, r = Dl(e)) => r === 2 ? e.has(t) : fr[Dc].hasOwnProperty.call(e, t), gh = (e, t, r = Dl(e)) => (
  // @ts-ignore
  r === 2 ? e.get(t) : e[t]
), Ks = (e, t, r, n = Dl(e)) => {
  n === 2 ? e.set(t, r) : n === 3 ? e.add(r) : e[t] = r;
};
function NT(e, t) {
  return e === t ? e !== 0 || 1 / e === 1 / t : e !== e && t !== t;
}
var $c = Array.isArray, Rc = (e) => e instanceof Map, Lc = (e) => e instanceof Set, xp = (e) => typeof e == "object", za = (e) => typeof e == "function", Iv = (e) => typeof e == "boolean";
function $T(e) {
  const t = +e;
  return Number.isInteger(t) && String(t) === e;
}
var Sn = (e) => e.copy_ || e.base_, bp = (e) => e.modified_ ? e.copy_ : e.base_;
function xh(e, t) {
  if (Rc(e))
    return new Map(e);
  if (Lc(e))
    return new Set(e);
  if ($c(e))
    return Array[Dc].slice.call(e);
  const r = YP(e);
  if (t === !0 || t === "class_only" && !r) {
    const n = fr.getOwnPropertyDescriptors(e);
    delete n[Ut];
    let a = Reflect.ownKeys(n);
    for (let l = 0; l < a.length; l++) {
      const u = a[l], c = n[u];
      c[js] === !1 && (c[js] = !0, c[yh] = !0), (c.get || c.set) && (n[u] = {
        [yh]: !0,
        [js]: !0,
        // could live with !!desc.set as well here...
        [Us]: c[Us],
        [wl]: e[u]
      });
    }
    return fr.create(Va(e), n);
  } else {
    const n = Va(e);
    if (n !== null && r)
      return { ...e };
    const a = fr.create(n);
    return fr.assign(a, e);
  }
}
function wp(e, t = !1) {
  return zc(e) || In(e) || !Cr(e) || (Dl(e) > 1 && fr.defineProperties(e, {
    set: hs,
    add: hs,
    clear: hs,
    delete: hs
  }), fr.freeze(e), t && Nc(
    e,
    (r, n) => {
      wp(n, !0);
    },
    !1
  )), e;
}
function RT() {
  Fr(2);
}
var hs = {
  [wl]: RT
};
function zc(e) {
  return e === null || !xp(e) ? !0 : fr.isFrozen(e);
}
var Hs = "MapSet", bh = "Patches", Wx = "ArrayMethods", qP = {};
function Yi(e) {
  const t = qP[e];
  return t || Fr(0, e), t;
}
var Ux = (e) => !!qP[e], Sl, XP = () => Sl, LT = (e, t) => ({
  drafts_: [],
  parent_: e,
  immer_: t,
  // Whenever the modified draft contains a draft from another scope, we
  // need to prevent auto-freezing so the unowned draft can be finalized.
  canAutoFreeze_: !0,
  unfinalizedDrafts_: 0,
  handledSet_: /* @__PURE__ */ new Set(),
  processedForPatches_: /* @__PURE__ */ new Set(),
  mapSetPlugin_: Ux(Hs) ? Yi(Hs) : void 0,
  arrayMethodsPlugin_: Ux(Wx) ? Yi(Wx) : void 0
});
function Kx(e, t) {
  t && (e.patchPlugin_ = Yi(bh), e.patches_ = [], e.inversePatches_ = [], e.patchListener_ = t);
}
function wh(e) {
  Sh(e), e.drafts_.forEach(zT), e.drafts_ = null;
}
function Sh(e) {
  e === Sl && (Sl = e.parent_);
}
var Hx = (e) => Sl = LT(Sl, e);
function zT(e) {
  const t = e[Ut];
  t.type_ === 0 || t.type_ === 1 ? t.revoke_() : t.revoked_ = !0;
}
function Vx(e, t) {
  t.unfinalizedDrafts_ = t.drafts_.length;
  const r = t.drafts_[0];
  if (e !== void 0 && e !== r) {
    r[Ut].modified_ && (wh(t), Fr(4)), Cr(e) && (e = Gx(t, e));
    const { patchPlugin_: a } = t;
    a && a.generateReplacementPatches_(
      r[Ut].base_,
      e,
      t
    );
  } else
    e = Gx(t, r);
  return BT(t, e, !0), wh(t), t.patches_ && t.patchListener_(t.patches_, t.inversePatches_), e !== GP ? e : void 0;
}
function Gx(e, t) {
  if (zc(t))
    return t;
  const r = t[Ut];
  if (!r)
    return Vs(t, e.handledSet_, e);
  if (!Bc(r, e))
    return t;
  if (!r.modified_)
    return r.base_;
  if (!r.finalized_) {
    const { callbacks_: n } = r;
    if (n)
      for (; n.length > 0; )
        n.pop()(e);
    JP(r, e);
  }
  return r.copy_;
}
function BT(e, t, r = !1) {
  !e.parent_ && e.immer_.autoFreeze_ && e.canAutoFreeze_ && wp(t, r);
}
function QP(e) {
  e.finalized_ = !0, e.scope_.unfinalizedDrafts_--;
}
var Bc = (e, t) => e.scope_ === t, FT = [];
function ZP(e, t, r, n) {
  const a = Sn(e), l = e.type_;
  if (n !== void 0 && gh(a, n, l) === t) {
    Ks(a, n, r, l);
    return;
  }
  if (!e.draftLocations_) {
    const c = e.draftLocations_ = /* @__PURE__ */ new Map();
    Nc(a, (f, d) => {
      if (In(d)) {
        const h = c.get(d) || [];
        h.push(f), c.set(d, h);
      }
    });
  }
  const u = e.draftLocations_.get(t) ?? FT;
  for (const c of u)
    Ks(a, c, r, l);
}
function WT(e, t, r) {
  e.callbacks_.push(function(a) {
    var c;
    const l = t;
    if (!l || !Bc(l, a))
      return;
    (c = a.mapSetPlugin_) == null || c.fixSetContents(l);
    const u = bp(l);
    ZP(e, l.draft_ ?? l, u, r), JP(l, a);
  });
}
function JP(e, t) {
  var n;
  if (e.modified_ && !e.finalized_ && (e.type_ === 3 || e.type_ === 1 && e.allIndicesReassigned_ || (((n = e.assigned_) == null ? void 0 : n.size) ?? 0) > 0)) {
    const { patchPlugin_: a } = t;
    if (a) {
      const l = a.getPath(e);
      l && a.generatePatches_(e, l, t);
    }
    QP(e);
  }
}
function UT(e, t, r) {
  const { scope_: n } = e;
  if (In(r)) {
    const a = r[Ut];
    Bc(a, n) && a.callbacks_.push(function() {
      _s(e);
      const u = bp(a);
      ZP(e, r, u, t);
    });
  } else Cr(r) && e.callbacks_.push(function() {
    const l = Sn(e);
    e.type_ === 3 ? l.has(r) && Vs(r, n.handledSet_, n) : gh(l, t, e.type_) === r && n.drafts_.length > 1 && (e.assigned_.get(t) ?? !1) === !0 && e.copy_ && Vs(
      gh(e.copy_, t, e.type_),
      n.handledSet_,
      n
    );
  });
}
function Vs(e, t, r) {
  return !r.immer_.autoFreeze_ && r.unfinalizedDrafts_ < 1 || In(e) || t.has(e) || !Cr(e) || zc(e) || (t.add(e), Nc(e, (n, a) => {
    if (In(a)) {
      const l = a[Ut];
      if (Bc(l, r)) {
        const u = bp(l);
        Ks(e, n, u, e.type_), QP(l);
      }
    } else Cr(a) && Vs(a, t, r);
  })), e;
}
function KT(e, t) {
  const r = $c(e), n = {
    type_: r ? 1 : 0,
    // Track which produce call this is associated with.
    scope_: t ? t.scope_ : XP(),
    // True for both shallow and deep changes.
    modified_: !1,
    // Used during finalization.
    finalized_: !1,
    // Track which properties have been assigned (true) or deleted (false).
    // actually instantiated in `prepareCopy()`
    assigned_: void 0,
    // The parent draft state.
    parent_: t,
    // The base state.
    base_: e,
    // The base proxy.
    draft_: null,
    // set below
    // The base copy with any updated values.
    copy_: null,
    // Called by the `produce` function.
    revoke_: null,
    isManual_: !1,
    // `callbacks` actually gets assigned in `createProxy`
    callbacks_: void 0
  };
  let a = n, l = Gs;
  r && (a = [n], l = Pl);
  const { revoke: u, proxy: c } = Proxy.revocable(a, l);
  return n.draft_ = c, n.revoke_ = u, [c, n];
}
var Gs = {
  get(e, t) {
    if (t === Ut)
      return e;
    let r = e.scope_.arrayMethodsPlugin_;
    const n = e.type_ === 1 && typeof t == "string";
    if (n && r != null && r.isArrayOperationMethod(t))
      return r.createMethodInterceptor(e, t);
    const a = Sn(e);
    if (!Cv(a, t, e.type_))
      return VT(e, a, t);
    const l = a[t];
    if (e.finalized_ || !Cr(l) || n && e.operationMethod && (r != null && r.isMutatingArrayMethod(
      e.operationMethod
    )) && $T(t))
      return l;
    if (l === jv(e.base_, t) || HT(e, t, l)) {
      _s(e);
      const u = e.type_ === 1 ? +t : t, c = Ah(e.scope_, l, e, u);
      return e.copy_[u] = c;
    }
    return l;
  },
  has(e, t) {
    return t in Sn(e);
  },
  ownKeys(e) {
    return Reflect.ownKeys(Sn(e));
  },
  set(e, t, r) {
    const n = eA(Sn(e), t);
    if (n != null && n.set)
      return n.set.call(e.draft_, r), !0;
    if (!e.modified_) {
      const a = jv(Sn(e), t), l = a == null ? void 0 : a[Ut];
      if (l && l.base_ === r)
        return e.copy_[t] = r, e.assigned_.set(t, !1), !0;
      if (NT(r, a) && (r !== void 0 || Cv(e.base_, t, e.type_)))
        return !0;
      _s(e), Ph(e);
    }
    return e.copy_[t] === r && // special case: handle new props with value 'undefined'
    (r !== void 0 || Cv(e.copy_, t, e.type_)) || // special case: NaN
    Number.isNaN(r) && Number.isNaN(e.copy_[t]) || (e.copy_[t] = r, e.assigned_.set(t, !0), UT(e, t, r)), !0;
  },
  deleteProperty(e, t) {
    return _s(e), jv(e.base_, t) !== void 0 || t in e.base_ ? (e.assigned_.set(t, !1), Ph(e)) : e.assigned_.delete(t), e.copy_ && delete e.copy_[t], !0;
  },
  // Note: We never coerce `desc.value` into an Immer draft, because we can't make
  // the same guarantee in ES5 mode.
  getOwnPropertyDescriptor(e, t) {
    const r = Sn(e), n = Reflect.getOwnPropertyDescriptor(r, t);
    return n && {
      [js]: !0,
      [yh]: e.type_ !== 1 || t !== "length",
      [Us]: n[Us],
      [wl]: r[t]
    };
  },
  defineProperty() {
    Fr(11);
  },
  getPrototypeOf(e) {
    return Va(e.base_);
  },
  setPrototypeOf() {
    Fr(12);
  }
}, Pl = {};
for (let e in Gs) {
  let t = Gs[e];
  Pl[e] = function() {
    const r = arguments;
    return r[0] = r[0][0], t.apply(this, r);
  };
}
Pl.deleteProperty = function(e, t) {
  return Pl.set.call(this, e, t, void 0);
};
Pl.set = function(e, t, r) {
  return Gs.set.call(this, e[0], t, r, e[0]);
};
function jv(e, t) {
  const r = e[Ut];
  return (r ? Sn(r) : e)[t];
}
function HT(e, t, r) {
  var n;
  return e.type_ !== 1 || !e.allIndicesReassigned_ || (n = e.assigned_) != null && n.get(t) || !Cr(r) || r[Ut] ? !1 : e.baseRefs_.has(r);
}
function VT(e, t, r) {
  var a;
  const n = eA(t, r);
  return n ? wl in n ? n[wl] : (
    // This is a very special case, if the prop is a getter defined by the
    // prototype, we should invoke it with the draft as context!
    (a = n.get) == null ? void 0 : a.call(e.draft_)
  ) : void 0;
}
function eA(e, t) {
  if (!(t in e))
    return;
  let r = Va(e);
  for (; r; ) {
    const n = Object.getOwnPropertyDescriptor(r, t);
    if (n)
      return n;
    r = Va(r);
  }
}
function Ph(e) {
  e.modified_ || (e.modified_ = !0, e.parent_ && Ph(e.parent_));
}
function _s(e) {
  e.copy_ || (e.assigned_ = /* @__PURE__ */ new Map(), e.copy_ = xh(
    e.base_,
    e.scope_.immer_.useStrictShallowCopy_
  ));
}
var GT = class {
  constructor(e) {
    this.autoFreeze_ = !0, this.useStrictShallowCopy_ = !1, this.useStrictIteration_ = !1, this.produce = (t, r, n) => {
      if (za(t) && !za(r)) {
        const l = r;
        r = t;
        const u = this;
        return function(f = l, ...d) {
          return u.produce(f, (h) => r.call(this, h, ...d));
        };
      }
      za(r) || Fr(6), n !== void 0 && !za(n) && Fr(7);
      let a;
      if (Cr(t)) {
        const l = Hx(this), u = Ah(l, t, void 0);
        let c = !0;
        try {
          a = r(u), c = !1;
        } finally {
          c ? wh(l) : Sh(l);
        }
        return Kx(l, n), Vx(a, l);
      } else if (!t || !xp(t)) {
        if (a = r(t), a === void 0 && (a = t), a === GP && (a = void 0), this.autoFreeze_ && wp(a, !0), n) {
          const l = [], u = [];
          Yi(bh).generateReplacementPatches_(t, a, {
            patches_: l,
            inversePatches_: u
          }), n(l, u);
        }
        return a;
      } else
        Fr(1, t);
    }, this.produceWithPatches = (t, r) => {
      if (za(t))
        return (u, ...c) => this.produceWithPatches(u, (f) => t(f, ...c));
      let n, a;
      return [this.produce(t, r, (u, c) => {
        n = u, a = c;
      }), n, a];
    }, Iv(e == null ? void 0 : e.autoFreeze) && this.setAutoFreeze(e.autoFreeze), Iv(e == null ? void 0 : e.useStrictShallowCopy) && this.setUseStrictShallowCopy(e.useStrictShallowCopy), Iv(e == null ? void 0 : e.useStrictIteration) && this.setUseStrictIteration(e.useStrictIteration);
  }
  createDraft(e) {
    Cr(e) || Fr(8), In(e) && (e = Er(e));
    const t = Hx(this), r = Ah(t, e, void 0);
    return r[Ut].isManual_ = !0, Sh(t), r;
  }
  finishDraft(e, t) {
    const r = e && e[Ut];
    (!r || !r.isManual_) && Fr(9);
    const { scope_: n } = r;
    return Kx(n, t), Vx(void 0, n);
  }
  /**
   * Pass true to automatically freeze all copies created by Immer.
   *
   * By default, auto-freezing is enabled.
   */
  setAutoFreeze(e) {
    this.autoFreeze_ = e;
  }
  /**
   * Pass true to enable strict shallow copy.
   *
   * By default, immer does not copy the object descriptors such as getter, setter and non-enumrable properties.
   */
  setUseStrictShallowCopy(e) {
    this.useStrictShallowCopy_ = e;
  }
  /**
   * Pass false to use faster iteration that skips non-enumerable properties
   * but still handles symbols for compatibility.
   *
   * By default, strict iteration is enabled (includes all own properties).
   */
  setUseStrictIteration(e) {
    this.useStrictIteration_ = e;
  }
  shouldUseStrictIteration() {
    return this.useStrictIteration_;
  }
  applyPatches(e, t) {
    let r;
    for (r = t.length - 1; r >= 0; r--) {
      const a = t[r];
      if (a.path.length === 0 && a.op === "replace") {
        e = a.value;
        break;
      }
    }
    r > -1 && (t = t.slice(r + 1));
    const n = Yi(bh).applyPatches_;
    return In(e) ? n(e, t) : this.produce(
      e,
      (a) => n(a, t)
    );
  }
};
function Ah(e, t, r, n) {
  const [a, l] = Rc(t) ? Yi(Hs).proxyMap_(t, r) : Lc(t) ? Yi(Hs).proxySet_(t, r) : KT(t, r);
  return ((r == null ? void 0 : r.scope_) ?? XP()).drafts_.push(a), l.callbacks_ = (r == null ? void 0 : r.callbacks_) ?? [], l.key_ = n, r && n !== void 0 ? WT(r, l, n) : l.callbacks_.push(function(f) {
    var h;
    (h = f.mapSetPlugin_) == null || h.fixSetContents(l);
    const { patchPlugin_: d } = f;
    l.modified_ && d && d.generatePatches_(l, [], f);
  }), a;
}
function Er(e) {
  return In(e) || Fr(10, e), tA(e);
}
function tA(e) {
  if (!Cr(e) || zc(e))
    return e;
  const t = e[Ut];
  let r, n = !0;
  if (t) {
    if (!t.modified_)
      return t.base_;
    t.finalized_ = !0, r = xh(e, t.scope_.immer_.useStrictShallowCopy_), n = t.scope_.immer_.shouldUseStrictIteration();
  } else
    r = xh(e, !0);
  return Nc(
    r,
    (a, l) => {
      Ks(r, a, tA(l));
    },
    n
  ), t && (t.finalized_ = !1), r;
}
var _v = globalThis.Iterator;
_v == null || _v.from;
var YT = new GT(), rA = YT.produce, Me = (e) => e;
function nA(e) {
  return ({ dispatch: r, getState: n }) => (a) => (l) => typeof l == "function" ? l(r, n, e) : a(l);
}
var qT = nA(), XT = nA, QT = typeof window < "u" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : function() {
  if (arguments.length !== 0)
    return typeof arguments[0] == "object" ? Fs : Fs.apply(null, arguments);
};
function pr(e, t) {
  function r(...n) {
    if (t) {
      let a = t(...n);
      if (!a)
        throw new Error(dr(0));
      return {
        type: e,
        payload: a.payload,
        ..."meta" in a && {
          meta: a.meta
        },
        ..."error" in a && {
          error: a.error
        }
      };
    }
    return {
      type: e,
      payload: n[0]
    };
  }
  return r.toString = () => `${e}`, r.type = e, r.match = (n) => VP(n) && n.type === e, r;
}
var iA = class vl extends Array {
  constructor(...t) {
    super(...t), Object.setPrototypeOf(this, vl.prototype);
  }
  static get [Symbol.species]() {
    return vl;
  }
  concat(...t) {
    return super.concat.apply(this, t);
  }
  prepend(...t) {
    return t.length === 1 && Array.isArray(t[0]) ? new vl(...t[0].concat(this)) : new vl(...t.concat(this));
  }
};
function Yx(e) {
  return Cr(e) ? rA(e, () => {
  }) : e;
}
function ps(e, t, r) {
  return e.has(t) ? e.get(t) : e.set(t, r(t)).get(t);
}
function ZT(e) {
  return typeof e == "boolean";
}
var JT = () => function(t) {
  const {
    thunk: r = !0,
    immutableCheck: n = !0,
    serializableCheck: a = !0,
    actionCreatorCheck: l = !0
  } = t ?? {};
  let u = new iA();
  return r && (ZT(r) ? u.push(qT) : u.push(XT(r.extraArgument))), u;
}, aA = "RTK_autoBatch", Ve = () => (e) => ({
  payload: e,
  meta: {
    [aA]: !0
  }
}), qx = (e) => (t) => {
  setTimeout(t, e);
}, eM = (e, t) => (r) => {
  let n = !1;
  const a = () => {
    n || (n = !0, cancelAnimationFrame(l), clearTimeout(u), r());
  }, l = e(a), u = setTimeout(a, t);
}, oA = (e = {
  type: "raf"
}) => (t) => (...r) => {
  const n = t(...r);
  let a = !0, l = !1, u = !1;
  const c = /* @__PURE__ */ new Set(), f = e.type === "tick" ? queueMicrotask : e.type === "raf" ? (
    // requestAnimationFrame won't exist in SSR environments. Fall back to a vague approximation just to keep from erroring.
    typeof window < "u" && window.requestAnimationFrame ? eM(window.requestAnimationFrame, 100) : qx(10)
  ) : e.type === "callback" ? e.queueNotification : qx(e.timeout), d = () => {
    u = !1, l && (l = !1, c.forEach((h) => h()));
  };
  return Object.assign({}, n, {
    // Override the base `store.subscribe` method to keep original listeners
    // from running if we're delaying notifications
    subscribe(h) {
      const p = () => a && h(), y = n.subscribe(p);
      return c.add(h), () => {
        y(), c.delete(h);
      };
    },
    // Override the base `store.dispatch` method so that we can check actions
    // for the `shouldAutoBatch` flag and determine if batching is active
    dispatch(h) {
      var p;
      try {
        return a = !((p = h == null ? void 0 : h.meta) != null && p[aA]), l = !a, l && (u || (u = !0, f(d))), n.dispatch(h);
      } finally {
        a = !0;
      }
    }
  });
}, tM = (e) => function(r) {
  const {
    autoBatch: n = !0
  } = r ?? {};
  let a = new iA(e);
  return n && a.push(oA(typeof n == "object" ? n : void 0)), a;
};
function rM(e) {
  const t = JT(), {
    reducer: r = void 0,
    middleware: n,
    devTools: a = !0,
    preloadedState: l = void 0,
    enhancers: u = void 0
  } = e || {};
  let c;
  if (typeof r == "function")
    c = r;
  else if (gp(r))
    c = HP(r);
  else
    throw new Error(dr(1));
  let f;
  typeof n == "function" ? f = n(t) : f = t();
  let d = Fs;
  a && (d = QT({
    // Enable capture of stack traces for dispatched Redux actions
    trace: !1,
    ...typeof a == "object" && a
  }));
  const h = MT(...f), p = tM(h);
  let y = typeof u == "function" ? u(p) : p();
  const b = d(...y);
  return KP(c, l, b);
}
function lA(e) {
  const t = {}, r = [];
  let n;
  const a = {
    addCase(l, u) {
      const c = typeof l == "string" ? l : l.type;
      if (!c)
        throw new Error(dr(28));
      if (c in t)
        throw new Error(dr(29));
      return t[c] = u, a;
    },
    addAsyncThunk(l, u) {
      return u.pending && (t[l.pending.type] = u.pending), u.rejected && (t[l.rejected.type] = u.rejected), u.fulfilled && (t[l.fulfilled.type] = u.fulfilled), u.settled && r.push({
        matcher: l.settled,
        reducer: u.settled
      }), a;
    },
    addMatcher(l, u) {
      return r.push({
        matcher: l,
        reducer: u
      }), a;
    },
    addDefaultCase(l) {
      return n = l, a;
    }
  };
  return e(a), [t, r, n];
}
function nM(e) {
  return typeof e == "function";
}
function iM(e, t) {
  let [r, n, a] = lA(t), l;
  if (nM(e))
    l = () => Yx(e());
  else {
    const c = Yx(e);
    l = () => c;
  }
  function u(c = l(), f) {
    let d = [r[f.type], ...n.filter(({
      matcher: h
    }) => h(f)).map(({
      reducer: h
    }) => h)];
    return d.filter((h) => !!h).length === 0 && (d = [a]), d.reduce((h, p) => {
      if (p)
        if (In(h)) {
          const b = p(h, f);
          return b === void 0 ? h : b;
        } else {
          if (Cr(h))
            return rA(h, (y) => p(y, f));
          {
            const y = p(h, f);
            if (y === void 0) {
              if (h === null)
                return h;
              throw Error("A case reducer on a non-draftable value must not return undefined");
            }
            return y;
          }
        }
      return h;
    }, c);
  }
  return u.getInitialState = l, u;
}
var aM = "ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZXIjQW", oM = (e = 21) => {
  let t = "", r = e;
  for (; r--; )
    t += aM[Math.random() * 64 | 0];
  return t;
}, lM = /* @__PURE__ */ Symbol.for("rtk-slice-createasyncthunk");
function uM(e, t) {
  return `${e}/${t}`;
}
function sM({
  creators: e
} = {}) {
  var r;
  const t = (r = e == null ? void 0 : e.asyncThunk) == null ? void 0 : r[lM];
  return function(a) {
    const {
      name: l,
      reducerPath: u = l
    } = a;
    if (!l)
      throw new Error(dr(11));
    const c = (typeof a.reducers == "function" ? a.reducers(fM()) : a.reducers) || {}, f = Object.keys(c), d = {
      sliceCaseReducersByName: {},
      sliceCaseReducersByType: {},
      actionCreators: {},
      sliceMatchers: []
    }, h = {
      addCase(E, _) {
        const C = typeof E == "string" ? E : E.type;
        if (!C)
          throw new Error(dr(12));
        if (C in d.sliceCaseReducersByType)
          throw new Error(dr(13));
        return d.sliceCaseReducersByType[C] = _, h;
      },
      addMatcher(E, _) {
        return d.sliceMatchers.push({
          matcher: E,
          reducer: _
        }), h;
      },
      exposeAction(E, _) {
        return d.actionCreators[E] = _, h;
      },
      exposeCaseReducer(E, _) {
        return d.sliceCaseReducersByName[E] = _, h;
      }
    };
    f.forEach((E) => {
      const _ = c[E], C = {
        reducerName: E,
        type: uM(l, E),
        createNotation: typeof a.reducers == "function"
      };
      vM(_) ? pM(C, _, h, t) : dM(C, _, h);
    });
    function p() {
      const [E = {}, _ = [], C = void 0] = typeof a.extraReducers == "function" ? lA(a.extraReducers) : [a.extraReducers], R = {
        ...E,
        ...d.sliceCaseReducersByType
      };
      return iM(a.initialState, (W) => {
        for (let V in R)
          W.addCase(V, R[V]);
        for (let V of d.sliceMatchers)
          W.addMatcher(V.matcher, V.reducer);
        for (let V of _)
          W.addMatcher(V.matcher, V.reducer);
        C && W.addDefaultCase(C);
      });
    }
    const y = (E) => E, b = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new WeakMap();
    let P;
    function S(E, _) {
      return P || (P = p()), P(E, _);
    }
    function O() {
      return P || (P = p()), P.getInitialState();
    }
    function k(E, _ = !1) {
      function C(W) {
        let V = W[E];
        return typeof V > "u" && _ && (V = ps(w, C, O)), V;
      }
      function R(W = y) {
        const V = ps(b, _, () => /* @__PURE__ */ new WeakMap());
        return ps(V, W, () => {
          const K = {};
          for (const [G, F] of Object.entries(a.selectors ?? {}))
            K[G] = cM(F, W, () => ps(w, W, O), _);
          return K;
        });
      }
      return {
        reducerPath: E,
        getSelectors: R,
        get selectors() {
          return R(C);
        },
        selectSlice: C
      };
    }
    const I = {
      name: l,
      reducer: S,
      actions: d.actionCreators,
      caseReducers: d.sliceCaseReducersByName,
      getInitialState: O,
      ...k(u),
      injectInto(E, {
        reducerPath: _,
        ...C
      } = {}) {
        const R = _ ?? u;
        return E.inject({
          reducerPath: R,
          reducer: S
        }, C), {
          ...I,
          ...k(R, !0)
        };
      }
    };
    return I;
  };
}
function cM(e, t, r, n) {
  function a(l, ...u) {
    let c = t(l);
    return typeof c > "u" && n && (c = r()), e(c, ...u);
  }
  return a.unwrapped = e, a;
}
var Kt = /* @__PURE__ */ sM();
function fM() {
  function e(t, r) {
    return {
      _reducerDefinitionType: "asyncThunk",
      payloadCreator: t,
      ...r
    };
  }
  return e.withTypes = () => e, {
    reducer(t) {
      return Object.assign({
        // hack so the wrapping function has the same name as the original
        // we need to create a wrapper so the `reducerDefinitionType` is not assigned to the original
        [t.name](...r) {
          return t(...r);
        }
      }[t.name], {
        _reducerDefinitionType: "reducer"
        /* reducer */
      });
    },
    preparedReducer(t, r) {
      return {
        _reducerDefinitionType: "reducerWithPrepare",
        prepare: t,
        reducer: r
      };
    },
    asyncThunk: e
  };
}
function dM({
  type: e,
  reducerName: t,
  createNotation: r
}, n, a) {
  let l, u;
  if ("reducer" in n) {
    if (r && !hM(n))
      throw new Error(dr(17));
    l = n.reducer, u = n.prepare;
  } else
    l = n;
  a.addCase(e, l).exposeCaseReducer(t, l).exposeAction(t, u ? pr(e, u) : pr(e));
}
function vM(e) {
  return e._reducerDefinitionType === "asyncThunk";
}
function hM(e) {
  return e._reducerDefinitionType === "reducerWithPrepare";
}
function pM({
  type: e,
  reducerName: t
}, r, n, a) {
  if (!a)
    throw new Error(dr(18));
  const {
    payloadCreator: l,
    fulfilled: u,
    pending: c,
    rejected: f,
    settled: d,
    options: h
  } = r, p = a(e, l, h);
  n.exposeAction(t, p), u && n.addCase(p.fulfilled, u), c && n.addCase(p.pending, c), f && n.addCase(p.rejected, f), d && n.addMatcher(p.settled, d), n.exposeCaseReducer(t, {
    fulfilled: u || ms,
    pending: c || ms,
    rejected: f || ms,
    settled: d || ms
  });
}
function ms() {
}
var mM = "task", uA = "listener", sA = "completed", Sp = "cancelled", yM = `task-${Sp}`, gM = `task-${sA}`, Oh = `${uA}-${Sp}`, xM = `${uA}-${sA}`, Fc = class {
  constructor(e) {
    ss(this, "code");
    ss(this, "name", "TaskAbortError");
    ss(this, "message");
    this.code = e, this.message = `${mM} ${Sp} (reason: ${e})`;
  }
}, Pp = (e, t) => {
  if (typeof e != "function")
    throw new TypeError(dr(32));
}, Ys = () => {
}, cA = (e, t = Ys) => (e.catch(t), e), fA = (e, t) => (e.addEventListener("abort", t, {
  once: !0
}), () => e.removeEventListener("abort", t)), Wi = (e) => {
  if (e.aborted)
    throw new Fc(e.reason);
};
function dA(e, t) {
  let r = Ys;
  return new Promise((n, a) => {
    const l = () => a(new Fc(e.reason));
    if (e.aborted) {
      l();
      return;
    }
    r = fA(e, l), t.finally(() => r()).then(n, a);
  }).finally(() => {
    r = Ys;
  });
}
var bM = async (e, t) => {
  try {
    return await Promise.resolve(), {
      status: "ok",
      value: await e()
    };
  } catch (r) {
    return {
      status: r instanceof Fc ? "cancelled" : "rejected",
      error: r
    };
  } finally {
    t == null || t();
  }
}, qs = (e) => (t) => cA(dA(e, t).then((r) => (Wi(e), r))), vA = (e) => {
  const t = qs(e);
  return (r) => t(new Promise((n) => setTimeout(n, r)));
}, {
  assign: Wa
} = Object, Xx = {}, Wc = "listenerMiddleware", wM = (e, t) => {
  const r = (n) => fA(e, () => n.abort(e.reason));
  return (n, a) => {
    Pp(n);
    const l = new AbortController();
    r(l);
    const u = bM(async () => {
      Wi(e), Wi(l.signal);
      const c = await n({
        pause: qs(l.signal),
        delay: vA(l.signal),
        signal: l.signal
      });
      return Wi(l.signal), c;
    }, () => l.abort(gM));
    return a != null && a.autoJoin && t.push(u.catch(Ys)), {
      result: qs(e)(u),
      cancel() {
        l.abort(yM);
      }
    };
  };
}, SM = (e, t) => {
  const r = async (n, a) => {
    Wi(t);
    let l = () => {
    };
    const c = [new Promise((f, d) => {
      let h = e({
        predicate: n,
        effect: (p, y) => {
          y.unsubscribe(), f([p, y.getState(), y.getOriginalState()]);
        }
      });
      l = () => {
        h(), d();
      };
    })];
    a != null && c.push(new Promise((f) => setTimeout(f, a, null)));
    try {
      const f = await dA(t, Promise.race(c));
      return Wi(t), f;
    } finally {
      l();
    }
  };
  return ((n, a) => cA(r(n, a)));
}, hA = (e) => {
  let {
    type: t,
    actionCreator: r,
    matcher: n,
    predicate: a,
    effect: l
  } = e;
  if (t)
    a = pr(t).match;
  else if (r)
    t = r.type, a = r.match;
  else if (n)
    a = n;
  else if (!a) throw new Error(dr(21));
  return Pp(l), {
    predicate: a,
    type: t,
    effect: l
  };
}, pA = /* @__PURE__ */ Wa((e) => {
  const {
    type: t,
    predicate: r,
    effect: n
  } = hA(e);
  return {
    id: oM(),
    effect: n,
    type: t,
    predicate: r,
    pending: /* @__PURE__ */ new Set(),
    unsubscribe: () => {
      throw new Error(dr(22));
    }
  };
}, {
  withTypes: () => pA
}), Qx = (e, t) => {
  const {
    type: r,
    effect: n,
    predicate: a
  } = hA(t);
  return Array.from(e.values()).find((l) => (typeof r == "string" ? l.type === r : l.predicate === a) && l.effect === n);
}, Eh = (e) => {
  e.pending.forEach((t) => {
    t.abort(Oh);
  });
}, PM = (e, t) => () => {
  for (const r of t.keys())
    Eh(r);
  e.clear();
}, Zx = (e, t, r) => {
  try {
    e(t, r);
  } catch (n) {
    setTimeout(() => {
      throw n;
    }, 0);
  }
}, mA = /* @__PURE__ */ Wa(/* @__PURE__ */ pr(`${Wc}/add`), {
  withTypes: () => mA
}), AM = /* @__PURE__ */ pr(`${Wc}/removeAll`), yA = /* @__PURE__ */ Wa(/* @__PURE__ */ pr(`${Wc}/remove`), {
  withTypes: () => yA
}), OM = (...e) => {
  console.error(`${Wc}/error`, ...e);
}, Nl = (e = {}) => {
  const t = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), n = (b) => {
    const w = r.get(b) ?? 0;
    r.set(b, w + 1);
  }, a = (b) => {
    const w = r.get(b) ?? 1;
    w === 1 ? r.delete(b) : r.set(b, w - 1);
  }, {
    extra: l,
    onError: u = OM
  } = e;
  Pp(u);
  const c = (b) => (b.unsubscribe = () => t.delete(b.id), t.set(b.id, b), (w) => {
    b.unsubscribe(), w != null && w.cancelActive && Eh(b);
  }), f = ((b) => {
    const w = Qx(t, b) ?? pA(b);
    return c(w);
  });
  Wa(f, {
    withTypes: () => f
  });
  const d = (b) => {
    const w = Qx(t, b);
    return w && (w.unsubscribe(), b.cancelActive && Eh(w)), !!w;
  };
  Wa(d, {
    withTypes: () => d
  });
  const h = async (b, w, P, S) => {
    const O = new AbortController(), k = SM(f, O.signal), I = [];
    try {
      b.pending.add(O), n(b), await Promise.resolve(b.effect(
        w,
        // Use assign() rather than ... to avoid extra helper functions added to bundle
        Wa({}, P, {
          getOriginalState: S,
          condition: (E, _) => k(E, _).then(Boolean),
          take: k,
          delay: vA(O.signal),
          pause: qs(O.signal),
          extra: l,
          signal: O.signal,
          fork: wM(O.signal, I),
          unsubscribe: b.unsubscribe,
          subscribe: () => {
            t.set(b.id, b);
          },
          cancelActiveListeners: () => {
            b.pending.forEach((E, _, C) => {
              E !== O && (E.abort(Oh), C.delete(E));
            });
          },
          cancel: () => {
            O.abort(Oh), b.pending.delete(O);
          },
          throwIfCancelled: () => {
            Wi(O.signal);
          }
        })
      ));
    } catch (E) {
      E instanceof Fc || Zx(u, E, {
        raisedBy: "effect"
      });
    } finally {
      await Promise.all(I), O.abort(xM), a(b), b.pending.delete(O);
    }
  }, p = PM(t, r);
  return {
    middleware: (b) => (w) => (P) => {
      if (!VP(P))
        return w(P);
      if (mA.match(P))
        return f(P.payload);
      if (AM.match(P)) {
        p();
        return;
      }
      if (yA.match(P))
        return d(P.payload);
      let S = b.getState();
      const O = () => {
        if (S === Xx)
          throw new Error(dr(23));
        return S;
      };
      let k;
      try {
        if (k = w(P), t.size > 0) {
          const I = b.getState(), E = Array.from(t.values());
          for (const _ of E) {
            let C = !1;
            try {
              C = _.predicate(P, I, S);
            } catch (R) {
              C = !1, Zx(u, R, {
                raisedBy: "predicate"
              });
            }
            C && h(_, P, b, O);
          }
        }
      } finally {
        S = Xx;
      }
      return k;
    },
    startListening: f,
    stopListening: d,
    clearListeners: p
  };
};
function dr(e) {
  return `Minified Redux Toolkit error #${e}; visit https://redux-toolkit.js.org/Errors?code=${e} for the full message or use the non-minified dev environment for full errors. `;
}
var EM = {
  layoutType: "horizontal",
  width: 0,
  height: 0,
  margin: {
    top: 5,
    right: 5,
    bottom: 5,
    left: 5
  },
  scale: 1
}, gA = Kt({
  name: "chartLayout",
  initialState: EM,
  reducers: {
    setLayout(e, t) {
      e.layoutType = t.payload;
    },
    setChartSize(e, t) {
      e.width = t.payload.width, e.height = t.payload.height;
    },
    setMargin(e, t) {
      var r, n, a, l;
      e.margin.top = (r = t.payload.top) !== null && r !== void 0 ? r : 0, e.margin.right = (n = t.payload.right) !== null && n !== void 0 ? n : 0, e.margin.bottom = (a = t.payload.bottom) !== null && a !== void 0 ? a : 0, e.margin.left = (l = t.payload.left) !== null && l !== void 0 ? l : 0;
    },
    setScale(e, t) {
      e.scale = t.payload;
    }
  }
}), Uc = gA.actions, kM = Uc.setMargin, CM = Uc.setLayout, IM = Uc.setChartSize, jM = Uc.setScale, _M = gA.reducer;
function xA(e, t, r) {
  return Array.isArray(e) && e && t + r !== 0 ? e.slice(t, r + 1) : e;
}
function Ie(e) {
  return Number.isFinite(e);
}
function cn(e) {
  return typeof e == "number" && e > 0 && Number.isFinite(e);
}
function Jx(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function rr(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Jx(Object(r), !0).forEach(function(n) {
      TM(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Jx(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function TM(e, t, r) {
  return (t = MM(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function MM(e) {
  var t = DM(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function DM(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function Le(e, t, r) {
  return Qe(e) || Qe(t) ? r : sn(t) ? ln(e, t, r) : typeof t == "function" ? t(e) : r;
}
var NM = (e, t, r) => {
  if (t && r) {
    var n = r.width, a = r.height, l = t.align, u = t.verticalAlign, c = t.layout, f = t.position, d = t.offset, h = d === void 0 ? 0 : d;
    if (f != null) {
      if (up(f)) {
        if (f === "top" && oe(e.top))
          return rr(rr({}, e), {}, {
            top: e.top + (a || 0) + h
          });
        if (f === "bottom" && oe(e.bottom))
          return rr(rr({}, e), {}, {
            bottom: e.bottom + (a || 0) + h
          });
        if (f === "left" && oe(e.left))
          return rr(rr({}, e), {}, {
            left: e.left + (n || 0) + h
          });
        if (f === "right" && oe(e.right))
          return rr(rr({}, e), {}, {
            right: e.right + (n || 0) + h
          });
      }
      return e;
    }
    if ((c === "vertical" || c === "horizontal" && u === "middle") && l !== "center" && oe(e[l]))
      return rr(rr({}, e), {}, {
        [l]: e[l] + (n || 0)
      });
    if ((c === "horizontal" || c === "vertical" && l === "center") && u !== "middle" && oe(e[u]))
      return rr(rr({}, e), {}, {
        [u]: e[u] + (a || 0)
      });
  }
  return e;
}, Mn = (e, t) => e === "horizontal" && t === "xAxis" || e === "vertical" && t === "yAxis" || e === "centric" && t === "angleAxis" || e === "radial" && t === "radiusAxis", bA = (e, t, r, n) => {
  if (n)
    return e.map((c) => c.coordinate);
  var a, l, u = e.map((c) => (c.coordinate === t && (a = !0), c.coordinate === r && (l = !0), c.coordinate));
  return a || u.push(t), l || u.push(r), u;
}, wA = (e, t, r) => {
  if (!e)
    return null;
  var n = e.duplicateDomain, a = e.type, l = e.range, u = e.scale, c = e.realScaleType, f = e.isCategorical, d = e.categoricalDomain, h = e.tickCount, p = e.ticks, y = e.niceTicks, b = e.axisType;
  if (!u)
    return null;
  var w = c === "scaleBand" && u.bandwidth ? u.bandwidth() / 2 : 2, P = a === "category" && u.bandwidth ? u.bandwidth() / w : 0;
  if (P = b === "angleAxis" && l && l.length >= 2 ? Et(l[0] - l[1]) * 2 * P : P, p || y) {
    var S = (p || y || []).map((O, k) => {
      var I = n ? n.indexOf(O) : O, E = u.map(I);
      return Ie(E) ? {
        // If the scaleContent is not a number, the coordinate will be NaN.
        // That could be the case for example with a PointScale and a string as domain.
        coordinate: E + P,
        value: O,
        offset: P,
        index: k
      } : null;
    }).filter(nr);
    return S;
  }
  return f && d ? d.map((O, k) => {
    var I = u.map(O);
    return Ie(I) ? {
      coordinate: I + P,
      value: O,
      index: k,
      offset: P
    } : null;
  }).filter(nr) : u.ticks && h != null ? u.ticks(h).map((O, k) => {
    var I = u.map(O);
    return Ie(I) ? {
      coordinate: I + P,
      value: O,
      index: k,
      offset: P
    } : null;
  }).filter(nr) : u.domain().map((O, k) => {
    var I = u.map(O);
    return Ie(I) ? {
      coordinate: I + P,
      // @ts-expect-error can't use Date as an index
      value: n ? n[O] : O,
      index: k,
      offset: P
    } : null;
  }).filter(nr);
}, $M = (e, t) => {
  if (!t || t.length !== 2 || !oe(t[0]) || !oe(t[1]))
    return e;
  var r = Math.min(t[0], t[1]), n = Math.max(t[0], t[1]), a = [e[0], e[1]];
  return (!oe(e[0]) || e[0] < r) && (a[0] = r), (!oe(e[1]) || e[1] > n) && (a[1] = n), a[0] > n && (a[0] = n), a[1] < r && (a[1] = r), a;
}, RM = (e) => {
  var t, r = e.length;
  if (!(r <= 0)) {
    var n = (t = e[0]) === null || t === void 0 ? void 0 : t.length;
    if (!(n == null || n <= 0))
      for (var a = 0; a < n; ++a)
        for (var l = 0, u = 0, c = 0; c < r; ++c) {
          var f = e[c], d = f == null ? void 0 : f[a];
          if (d != null) {
            var h = d[1], p = d[0], y = un(h) ? p : h;
            y >= 0 ? (d[0] = l, l += y, d[1] = l) : (d[0] = u, u += y, d[1] = u);
          }
        }
  }
}, LM = (e) => {
  var t, r = e.length;
  if (!(r <= 0)) {
    var n = (t = e[0]) === null || t === void 0 ? void 0 : t.length;
    if (!(n == null || n <= 0))
      for (var a = 0; a < n; ++a)
        for (var l = 0, u = 0; u < r; ++u) {
          var c = e[u], f = c == null ? void 0 : c[a];
          if (f != null) {
            var d = un(f[1]) ? f[0] : f[1];
            d >= 0 ? (f[0] = l, l += d, f[1] = l) : (f[0] = 0, f[1] = 0);
          }
        }
  }
}, zM = {
  sign: RM,
  // @ts-expect-error definitelytyped types are incorrect
  expand: r2,
  // @ts-expect-error definitelytyped types are incorrect
  none: Gi,
  // @ts-expect-error definitelytyped types are incorrect
  silhouette: n2,
  // @ts-expect-error definitelytyped types are incorrect
  wiggle: i2,
  positive: LM
}, BM = (e, t, r) => {
  var n, a = (n = zM[r]) !== null && n !== void 0 ? n : Gi, l = t2().keys(t).value((c, f) => Number(Le(c, f, 0))).order(fh).offset(a), u = l(e);
  return u.forEach((c, f) => {
    c.forEach((d, h) => {
      var p = Le(e[h], t[f], 0);
      Array.isArray(p) && p.length === 2 && oe(p[0]) && oe(p[1]) && (d[0] = p[0], d[1] = p[1]);
    });
  }), u;
};
function FM(e) {
  return e == null ? void 0 : String(e);
}
function eb(e) {
  var t = e.axis, r = e.ticks, n = e.bandSize, a = e.entry, l = e.index, u = e.dataKey;
  if (t.type === "category") {
    if (!t.allowDuplicatedCategory && t.dataKey && !Qe(a[t.dataKey])) {
      var c = HS(r, "value", a[t.dataKey]);
      if (c)
        return c.coordinate + n / 2;
    }
    return r != null && r[l] ? r[l].coordinate + n / 2 : null;
  }
  var f = Le(a, Qe(u) ? t.dataKey : u), d = t.scale.map(f);
  return oe(d) ? d : null;
}
var tb = (e) => {
  var t = e.axis, r = e.ticks, n = e.offset, a = e.bandSize, l = e.entry, u = e.index;
  if (t.type === "category")
    return r[u] ? r[u].coordinate + n : null;
  var c = Le(l, t.dataKey, t.scale.domain()[u]);
  if (Qe(c))
    return null;
  var f = t.scale.map(c);
  return oe(f) ? f - a / 2 + n : null;
}, WM = (e) => {
  var t = e.numericAxis, r = t.scale.domain();
  if (t.type === "number") {
    var n = Math.min(r[0], r[1]), a = Math.max(r[0], r[1]);
    return n <= 0 && a >= 0 ? 0 : a < 0 ? a : n;
  }
  return r[0];
}, UM = (e) => {
  var t = e.flat(2).filter(oe);
  return [Math.min(...t), Math.max(...t)];
}, KM = (e) => [e[0] === 1 / 0 ? 0 : e[0], e[1] === -1 / 0 ? 0 : e[1]], HM = (e, t, r) => {
  if (!(e == null || Object.keys(e).length === 0))
    return KM(Object.keys(e).reduce((n, a) => {
      var l = e[a];
      if (!l)
        return n;
      var u = l.stackedData, c = u.reduce((f, d) => {
        var h = xA(d, t, r), p = UM(h);
        return !Ie(p[0]) || !Ie(p[1]) ? f : [Math.min(f[0], p[0]), Math.max(f[1], p[1])];
      }, [1 / 0, -1 / 0]);
      return [Math.min(c[0], n[0]), Math.max(c[1], n[1])];
    }, [1 / 0, -1 / 0]));
}, rb = /^dataMin[\s]*-[\s]*([0-9]+([.]{1}[0-9]+){0,1})$/, nb = /^dataMax[\s]*\+[\s]*([0-9]+([.]{1}[0-9]+){0,1})$/, Ga = (e, t, r) => {
  if (e && e.scale && e.scale.bandwidth) {
    var n = e.scale.bandwidth();
    if (!r || n > 0)
      return n;
  }
  if (e && t && t.length >= 2) {
    for (var a = Mc(t, (P) => P.coordinate), l = [], u = 0, c = 1, f = a.length; c < f; c++) {
      var d, h, p = (((d = a[c]) === null || d === void 0 ? void 0 : d.coordinate) || 0) - (((h = a[c - 1]) === null || h === void 0 ? void 0 : h.coordinate) || 0);
      l.push(p), u = Math.max(p, u);
    }
    var y = u * 1e-4, b = 1 / 0;
    for (var w of l)
      w > y && (b = Math.min(w, b));
    return b === 1 / 0 ? 0 : b;
  }
  return r ? void 0 : 0;
};
function ib(e) {
  var t = e.tooltipEntrySettings, r = e.dataKey, n = e.payload, a = e.value, l = e.name;
  return rr(rr({}, t), {}, {
    dataKey: r,
    payload: n,
    value: a,
    name: l
  });
}
function ro(e, t) {
  if (e != null)
    return String(e);
  if (typeof t == "string")
    return t;
}
var VM = (e, t) => {
  if (t === "horizontal")
    return e.relativeX;
  if (t === "vertical")
    return e.relativeY;
}, GM = (e, t) => t === "centric" ? e.angle : e.radius, dn = (e) => e.layout.width, vn = (e) => e.layout.height, YM = (e) => e.layout.scale, Ap = (e) => e.layout.margin, Kc = $((e) => e.cartesianAxis.xAxis, (e) => Object.values(e)), Hc = $((e) => e.cartesianAxis.yAxis, (e) => Object.values(e)), SA = "data-recharts-item-index", PA = "data-recharts-item-id", $l = 60, Op = 30;
function ab(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function ys(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? ab(Object(r), !0).forEach(function(n) {
      qM(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : ab(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function qM(e, t, r) {
  return (t = XM(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function XM(e) {
  var t = QM(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function QM(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var ZM = (e) => e.brush.height;
function JM(e) {
  var t = Hc(e);
  return t.reduce((r, n) => {
    if (n.orientation === "left" && !n.mirror && !n.hide) {
      var a = typeof n.width == "number" ? n.width : $l;
      return r + a;
    }
    return r;
  }, 0);
}
function eD(e) {
  var t = Hc(e);
  return t.reduce((r, n) => {
    if (n.orientation === "right" && !n.mirror && !n.hide) {
      var a = typeof n.width == "number" ? n.width : $l;
      return r + a;
    }
    return r;
  }, 0);
}
function tD(e) {
  var t = Kc(e);
  return t.reduce((r, n) => {
    if (n.orientation === "top" && !n.mirror && !n.hide) {
      var a = typeof n.height == "number" ? n.height : Op;
      return r + a;
    }
    return r;
  }, 0);
}
function rD(e) {
  var t = Kc(e);
  return t.reduce((r, n) => {
    if (n.orientation === "bottom" && !n.mirror && !n.hide) {
      var a = typeof n.height == "number" ? n.height : Op;
      return r + a;
    }
    return r;
  }, 0);
}
var xt = $([dn, vn, Ap, ZM, JM, eD, tD, rD, WP, wT], (e, t, r, n, a, l, u, c, f, d) => {
  var h = {
    left: (r.left || 0) + a,
    right: (r.right || 0) + l
  }, p = {
    top: (r.top || 0) + u,
    bottom: (r.bottom || 0) + c
  }, y = ys(ys({}, p), h), b = y.bottom;
  y.bottom += n, y = NM(y, f, d);
  var w = e - y.left - y.right, P = t - y.top - y.bottom;
  return ys(ys({
    brushBottom: b
  }, y), {}, {
    // never return negative values for height and width
    width: Math.max(w, 0),
    height: Math.max(P, 0)
  });
}), AA = $(xt, (e) => ({
  x: e.left,
  y: e.top,
  width: e.width,
  height: e.height
})), Ep = $(dn, vn, (e, t) => ({
  x: 0,
  y: 0,
  width: e,
  height: t
})), nD = /* @__PURE__ */ x.createContext(null), Ht = () => x.useContext(nD) != null, Vc = (e) => e.brush, Gc = $([Vc, xt, Ap], (e, t, r) => ({
  height: e.height,
  x: oe(e.x) ? e.x : t.left,
  y: oe(e.y) ? e.y : t.top + t.height + t.brushBottom - ((r == null ? void 0 : r.bottom) || 0),
  width: oe(e.width) ? e.width : t.width
}));
function iD(e, t, { signal: r, edges: n } = {}) {
  let a, l = null;
  const u = n != null && n.includes("leading"), c = n == null || n.includes("trailing"), f = () => {
    l !== null && (e.apply(a, l), a = void 0, l = null);
  }, d = () => {
    c && f(), b();
  };
  let h = null;
  const p = () => {
    h != null && clearTimeout(h), h = setTimeout(() => {
      h = null, d();
    }, t);
  }, y = () => {
    h !== null && (clearTimeout(h), h = null);
  }, b = () => {
    y(), a = void 0, l = null;
  }, w = () => {
    f();
  }, P = function(...S) {
    if (r != null && r.aborted) return;
    a = this, l = S;
    const O = h == null;
    p(), u && O && f();
  };
  return P.schedule = p, P.cancel = b, P.flush = w, r == null || r.addEventListener("abort", b, { once: !0 }), P;
}
function aD(e, t = 0, r = {}) {
  typeof r != "object" && (r = {});
  const { leading: n = !1, trailing: a = !0, maxWait: l } = r, u = Array(2);
  n && (u[0] = "leading"), a && (u[1] = "trailing");
  let c, f = null;
  const d = iD(function(...y) {
    c = e.apply(this, y), f = null;
  }, t, { edges: u }), h = function(...y) {
    return l != null && (f === null && (f = Date.now()), Date.now() - f >= l) ? ((n || a) && (c = e.apply(this, y)), f = Date.now(), d.cancel(), d.schedule(), c) : (d.apply(this, y), c);
  }, p = () => (d.flush(), c);
  return h.cancel = d.cancel, h.flush = p, h;
}
function oD(e, t = 0, r = {}) {
  const { leading: n = !0, trailing: a = !0 } = r;
  return aD(e, t, {
    leading: n,
    maxWait: t,
    trailing: a
  });
}
var Xs = function(t, r) {
  for (var n = arguments.length, a = new Array(n > 2 ? n - 2 : 0), l = 2; l < n; l++)
    a[l - 2] = arguments[l];
  if (typeof console < "u" && console.warn && (r === void 0 && console.warn("LogUtils requires an error message argument"), !t))
    if (r === void 0)
      console.warn("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");
    else {
      var u = 0;
      console.warn(r.replace(/%s/g, () => a[u++]));
    }
}, rn = {
  width: "100%",
  height: "100%",
  debounce: 0,
  minWidth: 0,
  initialDimension: {
    width: -1,
    height: -1
  }
}, OA = (e, t, r) => {
  var n = r.width, a = n === void 0 ? rn.width : n, l = r.height, u = l === void 0 ? rn.height : l, c = r.aspect, f = r.maxHeight, d = Vi(a) ? e : Number(a), h = Vi(u) ? t : Number(u);
  return c && c > 0 && (d ? h = d / c : h && (d = h * c), f && h != null && h > f && (h = f)), {
    calculatedWidth: d,
    calculatedHeight: h
  };
}, lD = {
  width: 0,
  height: 0,
  overflow: "visible"
}, uD = {
  width: 0,
  overflowX: "visible"
}, sD = {
  height: 0,
  overflowY: "visible"
}, cD = {}, fD = (e) => {
  var t = e.width, r = e.height, n = Vi(t), a = Vi(r);
  return n && a ? lD : n ? uD : a ? sD : cD;
};
function dD(e) {
  var t = e.width, r = e.height, n = e.aspect, a = t, l = r;
  return a === void 0 && l === void 0 ? (a = rn.width, l = rn.height) : a === void 0 ? a = n && n > 0 ? void 0 : rn.width : l === void 0 && (l = n && n > 0 ? void 0 : rn.height), {
    width: a,
    height: l
  };
}
var vD = ["aspect", "initialDimension", "width", "height", "minWidth", "minHeight", "maxHeight", "children", "debounce", "id", "className", "onResize", "style"];
function Qs() {
  return Qs = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Qs.apply(null, arguments);
}
function ob(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function lb(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? ob(Object(r), !0).forEach(function(n) {
      hD(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : ob(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function hD(e, t, r) {
  return (t = pD(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function pD(e) {
  var t = mD(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function mD(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function yD(e, t) {
  return wD(e) || bD(e, t) || xD(e, t) || gD();
}
function gD() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function xD(e, t) {
  if (e) {
    if (typeof e == "string") return ub(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? ub(e, t) : void 0;
  }
}
function ub(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function bD(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, a, l, u, c = [], f = !0, d = !1;
    try {
      if (l = (r = r.call(e)).next, t !== 0) for (; !(f = (n = l.call(r)).done) && (c.push(n.value), c.length !== t); f = !0) ;
    } catch (h) {
      d = !0, a = h;
    } finally {
      try {
        if (!f && r.return != null && (u = r.return(), Object(u) !== u)) return;
      } finally {
        if (d) throw a;
      }
    }
    return c;
  }
}
function wD(e) {
  if (Array.isArray(e)) return e;
}
function SD(e, t) {
  if (e == null) return {};
  var r, n, a = PD(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]);
  }
  return a;
}
function PD(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
var EA = /* @__PURE__ */ x.createContext(rn.initialDimension);
function AD(e) {
  return cn(e.width) && cn(e.height);
}
function kA(e) {
  var t = e.children, r = e.width, n = e.height, a = x.useMemo(() => ({
    width: r,
    height: n
  }), [r, n]);
  return AD(a) ? /* @__PURE__ */ x.createElement(EA.Provider, {
    value: a
  }, t) : null;
}
var kp = () => x.useContext(EA), OD = /* @__PURE__ */ x.forwardRef((e, t) => {
  var r = e.aspect, n = e.initialDimension, a = n === void 0 ? rn.initialDimension : n, l = e.width, u = e.height, c = e.minWidth, f = c === void 0 ? rn.minWidth : c, d = e.minHeight, h = e.maxHeight, p = e.children, y = e.debounce, b = y === void 0 ? rn.debounce : y, w = e.id, P = e.className, S = e.onResize, O = e.style, k = O === void 0 ? {} : O, I = SD(e, vD), E = x.useRef(null), _ = x.useRef();
  _.current = S, x.useImperativeHandle(t, () => E.current);
  var C = x.useState({
    containerWidth: a.width,
    containerHeight: a.height
  }), R = yD(C, 2), W = R[0], V = R[1], K = x.useCallback((fe, ae) => {
    V((U) => {
      var ee = Math.round(fe), Y = Math.round(ae);
      return U.containerWidth === ee && U.containerHeight === Y ? U : {
        containerWidth: ee,
        containerHeight: Y
      };
    });
  }, []);
  x.useEffect(() => {
    if (E.current == null || typeof ResizeObserver > "u")
      return Ji;
    var fe = (D) => {
      var H, ve = D[0];
      if (ve != null) {
        var ye = ve.contentRect, Pe = ye.width, Ae = ye.height;
        K(Pe, Ae), (H = _.current) === null || H === void 0 || H.call(_, Pe, Ae);
      }
    };
    b > 0 && (fe = oD(fe, b, {
      trailing: !0,
      leading: !1
    }));
    var ae = new ResizeObserver(fe), U = E.current.getBoundingClientRect(), ee = U.width, Y = U.height;
    return K(ee, Y), ae.observe(E.current), () => {
      ae.disconnect();
    };
  }, [K, b]);
  var G = W.containerWidth, F = W.containerHeight;
  Xs(!r || r > 0, "The aspect(%s) must be greater than zero.", r);
  var ie = OA(G, F, {
    width: l,
    height: u,
    aspect: r,
    maxHeight: h
  }), re = ie.calculatedWidth, ne = ie.calculatedHeight;
  return Xs(G < 0 || F < 0 || re != null && re > 0 || ne != null && ne > 0, `The width(%s) and height(%s) of chart should be greater than 0,
       please check the style of container, or the props width(%s) and height(%s),
       or add a minWidth(%s) or minHeight(%s) or use aspect(%s) to control the
       height and width.`, re, ne, l, u, f, d, r), /* @__PURE__ */ x.createElement("div", Qs({
    id: w ? "".concat(w) : void 0,
    className: $e("recharts-responsive-container", P),
    style: lb(lb({}, k), {}, {
      width: l,
      height: u,
      minWidth: f,
      minHeight: d,
      maxHeight: h
    }),
    ref: E
  }, I), /* @__PURE__ */ x.createElement("div", {
    style: fD({
      width: l,
      height: u
    })
  }, /* @__PURE__ */ x.createElement(kA, {
    width: re,
    height: ne
  }, p)));
}), Yc = /* @__PURE__ */ x.forwardRef((e, t) => {
  var r = kp();
  if (cn(r.width) && cn(r.height))
    return e.children;
  var n = dD({
    width: e.width,
    height: e.height,
    aspect: e.aspect
  }), a = n.width, l = n.height, u = OA(void 0, void 0, {
    width: a,
    height: l,
    aspect: e.aspect,
    maxHeight: e.maxHeight
  }), c = u.calculatedWidth, f = u.calculatedHeight;
  return oe(c) && oe(f) ? /* @__PURE__ */ x.createElement(kA, {
    width: c,
    height: f
  }, e.children) : /* @__PURE__ */ x.createElement(OD, Qs({}, e, {
    width: a,
    height: l,
    ref: t
  }));
}), qc = () => {
  var e, t = Ht(), r = ue(AA), n = ue(Gc), a = (e = ue(Vc)) === null || e === void 0 ? void 0 : e.padding;
  return !t || !n || !a ? r : {
    width: n.width - a.left - a.right,
    height: n.height - a.top - a.bottom,
    x: a.left,
    y: a.top
  };
}, ED = {
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  width: 0,
  height: 0,
  brushBottom: 0
}, CA = () => {
  var e;
  return (e = ue(xt)) !== null && e !== void 0 ? e : ED;
}, Cp = () => ue(dn), Ip = () => ue(vn), kD = () => ue((e) => e.layout.margin), Ne = (e) => e.layout.layoutType, ea = () => ue(Ne), IA = () => {
  var e = ea();
  if (e === "horizontal" || e === "vertical")
    return e;
}, jp = (e) => {
  var t = e.layout.layoutType;
  if (t === "centric" || t === "radial")
    return t;
}, CD = () => ue(jp), ID = () => {
  var e = ea();
  return e !== void 0;
}, Rl = (e) => {
  var t = Be(), r = Ht(), n = e.width, a = e.height, l = kp(), u = n, c = a;
  return l && (u = l.width > 0 ? l.width : n, c = l.height > 0 ? l.height : a), x.useEffect(() => {
    !r && cn(u) && cn(c) && t(IM({
      width: u,
      height: c
    }));
  }, [t, r, u, c]), null;
}, jD = {
  settings: {
    layout: "horizontal",
    align: "center",
    verticalAlign: "bottom",
    itemSorter: "value",
    position: void 0,
    offset: 0
  },
  size: {
    width: 0,
    height: 0
  },
  payload: []
}, jA = Kt({
  name: "legend",
  initialState: jD,
  reducers: {
    setLegendSize(e, t) {
      e.size.width = t.payload.width, e.size.height = t.payload.height;
    },
    setLegendSettings(e, t) {
      e.settings.align = t.payload.align, e.settings.layout = t.payload.layout, e.settings.verticalAlign = t.payload.verticalAlign, e.settings.itemSorter = t.payload.itemSorter, e.settings.position = t.payload.position, e.settings.offset = t.payload.offset;
    },
    addLegendPayload: {
      reducer(e, t) {
        e.payload.push(Me(t.payload));
      },
      prepare: Ve()
    },
    replaceLegendPayload: {
      reducer(e, t) {
        var r = t.payload, n = r.prev, a = r.next, l = Er(e).payload.indexOf(Me(n));
        l > -1 && (e.payload[l] = Me(a));
      },
      prepare: Ve()
    },
    removeLegendPayload: {
      reducer(e, t) {
        var r = Er(e).payload.indexOf(Me(t.payload));
        r > -1 && e.payload.splice(r, 1);
      },
      prepare: Ve()
    }
  }
}), Ll = jA.actions, sb = Ll.setLegendSize, _D = Ll.setLegendSettings, _A = Ll.addLegendPayload, TA = Ll.replaceLegendPayload, MA = Ll.removeLegendPayload, TD = jA.reducer, Tv = { exports: {} }, Mv = {};
/**
 * @license React
 * use-sync-external-store-with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var cb;
function MD() {
  if (cb) return Mv;
  cb = 1;
  var e = eo();
  function t(f, d) {
    return f === d && (f !== 0 || 1 / f === 1 / d) || f !== f && d !== d;
  }
  var r = typeof Object.is == "function" ? Object.is : t, n = e.useSyncExternalStore, a = e.useRef, l = e.useEffect, u = e.useMemo, c = e.useDebugValue;
  return Mv.useSyncExternalStoreWithSelector = function(f, d, h, p, y) {
    var b = a(null);
    if (b.current === null) {
      var w = { hasValue: !1, value: null };
      b.current = w;
    } else w = b.current;
    b = u(
      function() {
        function S(_) {
          if (!O) {
            if (O = !0, k = _, _ = p(_), y !== void 0 && w.hasValue) {
              var C = w.value;
              if (y(C, _))
                return I = C;
            }
            return I = _;
          }
          if (C = I, r(k, _)) return C;
          var R = p(_);
          return y !== void 0 && y(C, R) ? (k = _, C) : (k = _, I = R);
        }
        var O = !1, k, I, E = h === void 0 ? null : h;
        return [
          function() {
            return S(d());
          },
          E === null ? void 0 : function() {
            return S(E());
          }
        ];
      },
      [d, h, p, y]
    );
    var P = n(f, b[0], b[1]);
    return l(
      function() {
        w.hasValue = !0, w.value = P;
      },
      [P]
    ), c(P), P;
  }, Mv;
}
var fb;
function DD() {
  return fb || (fb = 1, Tv.exports = MD()), Tv.exports;
}
DD();
function ND(e) {
  e();
}
function $D() {
  let e = null, t = null;
  return {
    clear() {
      e = null, t = null;
    },
    notify() {
      ND(() => {
        let r = e;
        for (; r; )
          r.callback(), r = r.next;
      });
    },
    get() {
      const r = [];
      let n = e;
      for (; n; )
        r.push(n), n = n.next;
      return r;
    },
    subscribe(r) {
      let n = !0;
      const a = t = {
        callback: r,
        next: null,
        prev: t
      };
      return a.prev ? a.prev.next = a : e = a, function() {
        !n || e === null || (n = !1, a.next ? a.next.prev = a.prev : t = a.prev, a.prev ? a.prev.next = a.next : e = a.next);
      };
    }
  };
}
var db = {
  notify() {
  },
  get: () => []
};
function RD(e, t) {
  let r, n = db, a = 0, l = !1;
  function u(P) {
    h();
    const S = n.subscribe(P);
    let O = !1;
    return () => {
      O || (O = !0, S(), p());
    };
  }
  function c() {
    n.notify();
  }
  function f() {
    w.onStateChange && w.onStateChange();
  }
  function d() {
    return l;
  }
  function h() {
    a++, r || (r = e.subscribe(f), n = $D());
  }
  function p() {
    a--, r && a === 0 && (r(), r = void 0, n.clear(), n = db);
  }
  function y() {
    l || (l = !0, h());
  }
  function b() {
    l && (l = !1, p());
  }
  const w = {
    addNestedSub: u,
    notifyNestedSubs: c,
    handleChangeWrapper: f,
    isSubscribed: d,
    trySubscribe: y,
    tryUnsubscribe: b,
    getListeners: () => n
  };
  return w;
}
var LD = () => typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u", zD = /* @__PURE__ */ LD(), BD = () => typeof navigator < "u" && navigator.product === "ReactNative", FD = /* @__PURE__ */ BD(), WD = () => zD || FD ? x.useLayoutEffect : x.useEffect, UD = /* @__PURE__ */ WD();
function vb(e, t) {
  return e === t ? e !== 0 || t !== 0 || 1 / e === 1 / t : e !== e && t !== t;
}
function KD(e, t) {
  if (vb(e, t)) return !0;
  if (typeof e != "object" || e === null || typeof t != "object" || t === null)
    return !1;
  const r = Object.keys(e), n = Object.keys(t);
  if (r.length !== n.length) return !1;
  for (let a = 0; a < r.length; a++)
    if (!Object.prototype.hasOwnProperty.call(t, r[a]) || !vb(e[r[a]], t[r[a]]))
      return !1;
  return !0;
}
var Dv = /* @__PURE__ */ Symbol.for("react-redux-context"), Nv = typeof globalThis < "u" ? globalThis : (
  /* fall back to a per-module scope (pre-8.1 behaviour) if `globalThis` is not available */
  {}
);
function HD() {
  if (!x.createContext) return {};
  const e = Nv[Dv] ?? (Nv[Dv] = /* @__PURE__ */ new Map());
  let t = e.get(x.createContext);
  return t || (t = x.createContext(
    null
  ), e.set(x.createContext, t)), t;
}
var VD = /* @__PURE__ */ HD();
function GD(e) {
  const { children: t, context: r, serverState: n, store: a } = e, l = x.useMemo(() => {
    const f = RD(a);
    return {
      store: a,
      subscription: f,
      getServerState: n ? () => n : void 0
    };
  }, [a, n]), u = x.useMemo(() => a.getState(), [a]);
  UD(() => {
    const { subscription: f } = l;
    return f.onStateChange = f.notifyNestedSubs, f.trySubscribe(), u !== a.getState() && f.notifyNestedSubs(), () => {
      f.tryUnsubscribe(), f.onStateChange = void 0;
    };
  }, [l, u]);
  const c = r || VD;
  return /* @__PURE__ */ x.createElement(c.Provider, { value: l }, t);
}
var YD = GD, qD = /* @__PURE__ */ new Set([
  "axisLine",
  "tickLine",
  "activeBar",
  "activeDot",
  "activeLabel",
  "activeShape",
  "allowEscapeViewBox",
  "background",
  "cursor",
  "dot",
  "label",
  "line",
  "margin",
  "padding",
  "position",
  "shape",
  "style",
  "tick",
  "wrapperStyle",
  // radius can be an array of 4 numbers, easy to compare shallowly
  "radius",
  "throttledEvents"
]);
function XD(e, t) {
  return e == null && t == null ? !0 : typeof e == "number" && typeof t == "number" ? e === t || e !== e && t !== t : e === t;
}
function no(e, t) {
  var r = /* @__PURE__ */ new Set([...Object.keys(e), ...Object.keys(t)]);
  for (var n of r)
    if (qD.has(n)) {
      if (e[n] == null && t[n] == null)
        continue;
      if (!KD(e[n], t[n]))
        return !1;
    } else if (!XD(e[n], t[n]))
      return !1;
  return !0;
}
var QD = $([dn, vn, Ap], (e, t, r) => ({
  x: r.left || 0,
  y: r.top || 0,
  width: Math.max(e - (r.left || 0) - (r.right || 0), 0),
  height: Math.max(t - (r.top || 0) - (r.bottom || 0), 0)
}));
function ZD(e, t) {
  var r;
  if (e === "start" && t === "start")
    return "";
  var n = {
    start: "0",
    middle: "-50%",
    end: "-100%"
  }, a = {
    start: "0",
    middle: "-50%",
    end: "-100%"
  }, l = e === "inherit" ? "0" : n[e], u = (r = a[t]) !== null && r !== void 0 ? r : "0";
  return "translate(".concat(l, ", ").concat(u, ")");
}
var JD = ["contextPayload"];
function kh() {
  return kh = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, kh.apply(null, arguments);
}
function eN(e, t) {
  return iN(e) || nN(e, t) || rN(e, t) || tN();
}
function tN() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function rN(e, t) {
  if (e) {
    if (typeof e == "string") return hb(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? hb(e, t) : void 0;
  }
}
function hb(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function nN(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, a, l, u, c = [], f = !0, d = !1;
    try {
      if (l = (r = r.call(e)).next, t !== 0) for (; !(f = (n = l.call(r)).done) && (c.push(n.value), c.length !== t); f = !0) ;
    } catch (h) {
      d = !0, a = h;
    } finally {
      try {
        if (!f && r.return != null && (u = r.return(), Object(u) !== u)) return;
      } finally {
        if (d) throw a;
      }
    }
    return c;
  }
}
function iN(e) {
  if (Array.isArray(e)) return e;
}
function pb(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Ya(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? pb(Object(r), !0).forEach(function(n) {
      aN(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : pb(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function aN(e, t, r) {
  return (t = oN(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function oN(e) {
  var t = lN(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function lN(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function uN(e, t) {
  if (e == null) return {};
  var r, n, a = sN(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]);
  }
  return a;
}
function sN(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
function cN(e) {
  return e.value;
}
function fN(e) {
  var t = e.contextPayload, r = uN(e, JD), n = zP(t, e.payloadUniqBy, cN), a = Ya(Ya({}, r), {}, {
    payload: n
  });
  return /* @__PURE__ */ x.isValidElement(e.content) ? /* @__PURE__ */ x.cloneElement(e.content, a) : typeof e.content == "function" ? /* @__PURE__ */ x.createElement(e.content, a) : /* @__PURE__ */ x.createElement(k2, a);
}
function dN(e) {
  return e === "left" || e === "right" || e === "insideLeft" || e === "insideRight" ? "vertical" : "horizontal";
}
function vN(e, t) {
  return t == null ? null : up(t) ? QD(e) : AA(e);
}
function hN(e, t, r) {
  return e === "top" ? {
    top: r.height + t
  } : e === "bottom" ? {
    top: -r.height - t
  } : e === "left" ? {
    left: r.width + t
  } : e === "right" ? {
    left: -r.width - t
  } : {};
}
function pN(e, t, r, n, a, l) {
  var u = t.layout, c = t.align, f = t.verticalAlign, d, h;
  return (!e || (e.left === void 0 || e.left === null) && (e.right === void 0 || e.right === null)) && (c === "center" && u === "vertical" ? d = {
    left: ((n || 0) - l.width) / 2
  } : d = c === "right" ? {
    right: r && r.right || 0
  } : {
    left: r && r.left || 0
  }), (!e || (e.top === void 0 || e.top === null) && (e.bottom === void 0 || e.bottom === null)) && (f === "middle" ? h = {
    top: ((a || 0) - l.height) / 2
  } : h = f === "bottom" ? {
    bottom: r && r.bottom || 0
  } : {
    top: r && r.top || 0
  }), Ya(Ya({}, d), h);
}
function mN(e) {
  var t = e.align, r = e.layout, n = e.verticalAlign, a = e.itemSorter, l = e.position, u = e.offset, c = Be();
  return x.useLayoutEffect(() => {
    c(_D({
      align: t,
      layout: r,
      verticalAlign: n,
      itemSorter: a,
      position: l,
      offset: u
    }));
  }, [c, t, r, n, a, l, u]), null;
}
function yN(e) {
  var t = e.width, r = e.height, n = Be();
  return x.useLayoutEffect(() => {
    n(sb({
      width: t,
      height: r
    }));
  }, [n, t, r]), x.useLayoutEffect(() => () => {
    n(sb({
      width: 0,
      height: 0
    }));
  }, [n]), null;
}
function gN(e, t, r, n) {
  return e === "vertical" && t != null ? {
    height: t
  } : e === "horizontal" ? {
    width: r || n
  } : null;
}
var xN = {
  align: "center",
  iconSize: 14,
  inactiveColor: "#ccc",
  itemSorter: "value",
  labelStyle: {},
  layout: "auto",
  verticalAlign: "bottom",
  offset: 0
};
function bN(e) {
  var t, r, n, a, l, u, c, f, d = gt(e, xN), h = e.layout && e.layout !== "auto" ? e.layout : dN(d.position), p = AT(), y = O_(), b = kD(), w = ue((Y) => vN(Y, d.position)), P = d.width, S = d.height, O = d.wrapperStyle, k = d.portal, I = k == null && (d.position == null || up(d.position)), E = UP([p]), _ = eN(E, 2), C = _[0], R = _[1], W = Cp(), V = Ip();
  if (W == null || V == null || d.position != null && w == null)
    return null;
  var K = W - ((b == null ? void 0 : b.left) || 0) - ((b == null ? void 0 : b.right) || 0), G = gN(h, S, P, K), F = d.position == null ? null : VS({
    /*
     * When calculating the position we use two different view boxes.
     * Inside positions use the plot area; outside positions use the margin-inset
     * chart area, placing the Legend beyond any axes.
     */
    viewBox: w ?? {
      x: 0,
      y: 0,
      width: W,
      height: V
    },
    position: d.position,
    offset: (t = d.offset) !== null && t !== void 0 ? t : 0
  }), ie = hN(d.position, (r = d.offset) !== null && r !== void 0 ? r : 0, C), re = h === "vertical" ? ((n = w == null ? void 0 : w.width) !== null && n !== void 0 ? n : 0) / 2 : (a = w == null ? void 0 : w.width) !== null && a !== void 0 ? a : 0, ne = h === "horizontal" ? ((l = w == null ? void 0 : w.height) !== null && l !== void 0 ? l : 0) / 2 : (u = w == null ? void 0 : w.height) !== null && u !== void 0 ? u : 0, fe = F ? {
    width: "max-content",
    height: "max-content",
    maxWidth: re,
    maxHeight: ne,
    overflowY: "auto",
    top: F.y + ((c = ie.top) !== null && c !== void 0 ? c : 0),
    left: F.x + ((f = ie.left) !== null && f !== void 0 ? f : 0),
    transform: ZD(F.horizontalAnchor, F.verticalAnchor)
  } : pN(O, d, b, W, V, C), ae = k ? O : Ya(Ya({
    position: "absolute",
    width: (G == null ? void 0 : G.width) || P || "auto",
    height: (G == null ? void 0 : G.height) || S || "auto"
  }, fe), O), U = k ?? y;
  if (U == null || p == null)
    return null;
  var ee = /* @__PURE__ */ x.createElement("div", {
    className: "recharts-legend-wrapper",
    style: ae,
    ref: R
  }, /* @__PURE__ */ x.createElement(mN, {
    layout: h,
    align: d.align,
    verticalAlign: d.verticalAlign,
    itemSorter: d.itemSorter,
    position: d.position,
    offset: d.offset
  }), I && /* @__PURE__ */ x.createElement(yN, C), /* @__PURE__ */ x.createElement(fN, kh({}, d, {
    layout: h
  }, G, {
    margin: b,
    chartWidth: W,
    chartHeight: V,
    contextPayload: p
  })));
  return /* @__PURE__ */ ip.createPortal(ee, U);
}
var DA = /* @__PURE__ */ x.memo(bN, no);
DA.displayName = "Legend";
function Ch() {
  return Ch = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Ch.apply(null, arguments);
}
function mb(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function nl(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? mb(Object(r), !0).forEach(function(n) {
      wN(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : mb(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function wN(e, t, r) {
  return (t = SN(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function SN(e) {
  var t = PN(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function PN(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function AN(e, t) {
  return CN(e) || kN(e, t) || EN(e, t) || ON();
}
function ON() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function EN(e, t) {
  if (e) {
    if (typeof e == "string") return yb(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? yb(e, t) : void 0;
  }
}
function yb(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function kN(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, a, l, u, c = [], f = !0, d = !1;
    try {
      if (l = (r = r.call(e)).next, t !== 0) for (; !(f = (n = l.call(r)).done) && (c.push(n.value), c.length !== t); f = !0) ;
    } catch (h) {
      d = !0, a = h;
    } finally {
      try {
        if (!f && r.return != null && (u = r.return(), Object(u) !== u)) return;
      } finally {
        if (d) throw a;
      }
    }
    return c;
  }
}
function CN(e) {
  if (Array.isArray(e)) return e;
}
function IN(e) {
  return Array.isArray(e) && sn(e[0]) && sn(e[1]) ? e.join(" ~ ") : e;
}
var Ta = {
  separator: " : ",
  contentStyle: {
    margin: 0,
    padding: 10,
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    whiteSpace: "nowrap"
  },
  itemStyle: {
    display: "block",
    paddingTop: 4,
    paddingBottom: 4,
    color: "#000"
  },
  labelStyle: {},
  accessibilityLayer: !1
};
function jN(e, t) {
  return t == null ? e : Mc(e, t);
}
var _N = (e) => {
  var t = e.separator, r = t === void 0 ? Ta.separator : t, n = e.contentStyle, a = e.itemStyle, l = e.labelStyle, u = l === void 0 ? Ta.labelStyle : l, c = e.payload, f = e.formatter, d = e.itemSorter, h = e.wrapperClassName, p = e.labelClassName, y = e.label, b = e.labelFormatter, w = e.accessibilityLayer, P = w === void 0 ? Ta.accessibilityLayer : w, S = () => {
    if (c && c.length) {
      var W = {
        padding: 0,
        margin: 0
      }, V = jN(c, d), K = V.map((G, F) => {
        if (!G || G.type === "none")
          return null;
        var ie = G.formatter || f || IN, re = G.value, ne = G.name, fe = re, ae = ne;
        if (ie) {
          var U = ie(re, ne, G, F, c);
          if (Array.isArray(U)) {
            var ee = AN(U, 2);
            fe = ee[0], ae = ee[1];
          } else if (U != null)
            fe = U;
          else
            return null;
        }
        var Y = nl(nl({}, Ta.itemStyle), {}, {
          color: G.color || Ta.itemStyle.color
        }, a);
        return /* @__PURE__ */ x.createElement("li", {
          className: "recharts-tooltip-item",
          key: "tooltip-item-".concat(F),
          style: Y
        }, sn(ae) ? /* @__PURE__ */ x.createElement("span", {
          className: "recharts-tooltip-item-name"
        }, ae) : null, sn(ae) ? /* @__PURE__ */ x.createElement("span", {
          className: "recharts-tooltip-item-separator"
        }, r) : null, /* @__PURE__ */ x.createElement("span", {
          className: "recharts-tooltip-item-value"
        }, fe), /* @__PURE__ */ x.createElement("span", {
          className: "recharts-tooltip-item-unit"
        }, G.unit || ""));
      });
      return /* @__PURE__ */ x.createElement("ul", {
        className: "recharts-tooltip-item-list",
        style: W
      }, K);
    }
    return null;
  }, O = nl(nl({}, Ta.contentStyle), n), k = nl({
    margin: 0
  }, u), I = !Qe(y), E = I ? y : "", _ = $e("recharts-default-tooltip", h), C = $e("recharts-tooltip-label", p);
  I && b && c !== void 0 && c !== null && (E = b(y, c));
  var R = P ? {
    role: "status",
    "aria-live": "assertive"
  } : {};
  return /* @__PURE__ */ x.createElement("div", Ch({
    className: _,
    style: O
  }, R), /* @__PURE__ */ x.createElement("p", {
    className: C,
    style: k
  }, /* @__PURE__ */ x.isValidElement(E) ? E : "".concat(E)), S());
}, il = "recharts-tooltip-wrapper", TN = {
  visibility: "hidden"
};
function MN(e) {
  var t = e.coordinate, r = e.translateX, n = e.translateY;
  return $e(il, {
    ["".concat(il, "-right")]: oe(r) && t && oe(t.x) && r >= t.x,
    ["".concat(il, "-left")]: oe(r) && t && oe(t.x) && r < t.x,
    ["".concat(il, "-bottom")]: oe(n) && t && oe(t.y) && n >= t.y,
    ["".concat(il, "-top")]: oe(n) && t && oe(t.y) && n < t.y
  });
}
function gb(e) {
  var t = e.allowEscapeViewBox, r = e.coordinate, n = e.key, a = e.offset, l = e.position, u = e.reverseDirection, c = e.tooltipDimension, f = e.viewBox, d = e.viewBoxDimension;
  if (l && oe(l[n]))
    return l[n];
  var h = r[n] - c - (a > 0 ? a : 0), p = r[n] + a;
  if (t[n])
    return u[n] ? h : p;
  var y = f[n];
  if (y == null)
    return 0;
  if (u[n]) {
    var b = h, w = y;
    return b < w ? Math.max(p, y) : Math.max(h, y);
  }
  if (d == null)
    return 0;
  var P = p + c, S = y + d;
  return P > S ? Math.max(h, y) : Math.max(p, y);
}
function DN(e) {
  var t = e.translateX, r = e.translateY, n = e.useTranslate3d;
  return {
    transform: n ? "translate3d(".concat(t, "px, ").concat(r, "px, 0)") : "translate(".concat(t, "px, ").concat(r, "px)")
  };
}
function NN(e) {
  var t = e.allowEscapeViewBox, r = e.coordinate, n = e.offsetTop, a = e.offsetLeft, l = e.position, u = e.reverseDirection, c = e.tooltipBox, f = e.useTranslate3d, d = e.viewBox, h, p, y;
  return c && c.height > 0 && c.width > 0 && r ? (p = gb({
    allowEscapeViewBox: t,
    coordinate: r,
    key: "x",
    offset: a,
    position: l,
    reverseDirection: u,
    tooltipDimension: c.width,
    viewBox: d,
    viewBoxDimension: d.width
  }), y = gb({
    allowEscapeViewBox: t,
    coordinate: r,
    key: "y",
    offset: n,
    position: l,
    reverseDirection: u,
    tooltipDimension: c.height,
    viewBox: d,
    viewBoxDimension: d.height
  }), h = DN({
    translateX: p,
    translateY: y,
    useTranslate3d: f
  })) : h = TN, {
    cssProperties: h,
    cssClasses: MN({
      translateX: p,
      translateY: y,
      coordinate: r
    })
  };
}
var $N = () => !(typeof window < "u" && window.document && window.document.createElement && window.setTimeout), zl = {
  isSsr: $N()
};
function RN(e, t) {
  return FN(e) || BN(e, t) || zN(e, t) || LN();
}
function LN() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function zN(e, t) {
  if (e) {
    if (typeof e == "string") return xb(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? xb(e, t) : void 0;
  }
}
function xb(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function BN(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, a, l, u, c = [], f = !0, d = !1;
    try {
      if (l = (r = r.call(e)).next, t !== 0) for (; !(f = (n = l.call(r)).done) && (c.push(n.value), c.length !== t); f = !0) ;
    } catch (h) {
      d = !0, a = h;
    } finally {
      try {
        if (!f && r.return != null && (u = r.return(), Object(u) !== u)) return;
      } finally {
        if (d) throw a;
      }
    }
    return c;
  }
}
function FN(e) {
  if (Array.isArray(e)) return e;
}
function NA() {
  var e = x.useState(() => zl.isSsr || !window.matchMedia ? !1 : window.matchMedia("(prefers-reduced-motion: reduce)").matches), t = RN(e, 2), r = t[0], n = t[1];
  return x.useEffect(() => {
    if (window.matchMedia) {
      var a = window.matchMedia("(prefers-reduced-motion: reduce)"), l = () => {
        n(a.matches);
      };
      return a.addEventListener("change", l), () => {
        a.removeEventListener("change", l);
      };
    }
  }, []), r;
}
function bb(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Ma(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? bb(Object(r), !0).forEach(function(n) {
      WN(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : bb(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function WN(e, t, r) {
  return (t = UN(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function UN(e) {
  var t = KN(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function KN(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function HN(e, t) {
  return qN(e) || YN(e, t) || GN(e, t) || VN();
}
function VN() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function GN(e, t) {
  if (e) {
    if (typeof e == "string") return wb(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? wb(e, t) : void 0;
  }
}
function wb(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function YN(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, a, l, u, c = [], f = !0, d = !1;
    try {
      if (l = (r = r.call(e)).next, t !== 0) for (; !(f = (n = l.call(r)).done) && (c.push(n.value), c.length !== t); f = !0) ;
    } catch (h) {
      d = !0, a = h;
    } finally {
      try {
        if (!f && r.return != null && (u = r.return(), Object(u) !== u)) return;
      } finally {
        if (d) throw a;
      }
    }
    return c;
  }
}
function qN(e) {
  if (Array.isArray(e)) return e;
}
function XN(e) {
  if (!(e.prefersReducedMotion && e.isAnimationActive === "auto") && e.isAnimationActive && e.active) {
    var t = typeof e.animationEasing == "string" ? e.animationEasing : "ease";
    return "transform ".concat(e.animationDuration, "ms ").concat(t);
  }
}
function QN(e) {
  var t, r, n, a, l, u, c = NA(), f = x.useState(() => ({
    dismissed: !1,
    dismissedAtCoordinate: {
      x: 0,
      y: 0
    }
  })), d = HN(f, 2), h = d[0], p = d[1];
  x.useEffect(() => {
    var O = (k) => {
      if (k.key === "Escape") {
        var I, E, _, C;
        p({
          dismissed: !0,
          dismissedAtCoordinate: {
            x: (I = (E = e.coordinate) === null || E === void 0 ? void 0 : E.x) !== null && I !== void 0 ? I : 0,
            y: (_ = (C = e.coordinate) === null || C === void 0 ? void 0 : C.y) !== null && _ !== void 0 ? _ : 0
          }
        });
      }
    };
    return document.addEventListener("keydown", O), () => {
      document.removeEventListener("keydown", O);
    };
  }, [(t = e.coordinate) === null || t === void 0 ? void 0 : t.x, (r = e.coordinate) === null || r === void 0 ? void 0 : r.y]), h.dismissed && (((n = (a = e.coordinate) === null || a === void 0 ? void 0 : a.x) !== null && n !== void 0 ? n : 0) !== h.dismissedAtCoordinate.x || ((l = (u = e.coordinate) === null || u === void 0 ? void 0 : u.y) !== null && l !== void 0 ? l : 0) !== h.dismissedAtCoordinate.y) && p(Ma(Ma({}, h), {}, {
    dismissed: !1
  }));
  var y = NN({
    allowEscapeViewBox: e.allowEscapeViewBox,
    coordinate: e.coordinate,
    offsetLeft: typeof e.offset == "number" ? e.offset : e.offset.x,
    offsetTop: typeof e.offset == "number" ? e.offset : e.offset.y,
    position: e.position,
    reverseDirection: e.reverseDirection,
    tooltipBox: e.lastBoundingBox,
    useTranslate3d: e.useTranslate3d,
    viewBox: e.viewBox
  }), b = y.cssClasses, w = y.cssProperties, P = e.hasPortalFromProps ? {} : Ma(Ma({
    transition: XN({
      prefersReducedMotion: c,
      isAnimationActive: e.isAnimationActive,
      active: e.active,
      animationDuration: e.animationDuration,
      animationEasing: e.animationEasing
    })
  }, w), {}, {
    pointerEvents: "none",
    position: "absolute",
    top: 0,
    left: 0
  }), S = Ma(Ma({}, P), {}, {
    visibility: !h.dismissed && e.active && e.hasPayload ? "visible" : "hidden"
  }, e.wrapperStyle);
  return /* @__PURE__ */ x.createElement("div", {
    // @ts-expect-error TypeScript library does not recognize xmlns attribute, but it's required for an HTML chunk inside SVG.
    xmlns: "http://www.w3.org/1999/xhtml",
    tabIndex: -1,
    className: b,
    style: S,
    ref: e.innerRef
  }, e.children);
}
var ZN = /* @__PURE__ */ x.memo(QN), $A = () => {
  var e;
  return (e = ue((t) => t.rootProps.accessibilityLayer)) !== null && e !== void 0 ? e : !0;
};
function Ih() {
  return Ih = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Ih.apply(null, arguments);
}
function Sb(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Pb(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Sb(Object(r), !0).forEach(function(n) {
      JN(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Sb(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function JN(e, t, r) {
  return (t = e$(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function e$(e) {
  var t = t$(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function t$(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Ab = {
  curveBasisClosed: K_,
  curveBasisOpen: H_,
  curveBasis: U_,
  curveBumpX: I_,
  curveBumpY: j_,
  curveLinearClosed: V_,
  curveLinear: _c,
  curveMonotoneX: G_,
  curveMonotoneY: Y_,
  curveNatural: q_,
  curveStep: X_,
  curveStepAfter: Z_,
  curveStepBefore: Q_
}, Zs = (e) => Ie(e.x) && Ie(e.y), Ob = (e) => e.base != null && Zs(e.base) && Zs(e), al = (e) => e.x, ol = (e) => e.y, r$ = (e, t) => {
  if (typeof e == "function")
    return e;
  var r = "curve".concat(Tl(e));
  if ((r === "curveMonotone" || r === "curveBump") && t) {
    var n = Ab["".concat(r).concat(t === "vertical" ? "Y" : "X")];
    if (n)
      return n;
  }
  return Ab[r] || _c;
}, Eb = {
  connectNulls: !1,
  type: "linear"
}, n$ = (e) => {
  var t = e.type, r = t === void 0 ? Eb.type : t, n = e.points, a = n === void 0 ? [] : n, l = e.baseLine, u = e.layout, c = e.connectNulls, f = c === void 0 ? Eb.connectNulls : c, d = r$(r, u), h = f ? a.filter(Zs) : a;
  if (Array.isArray(l)) {
    var p, y = a.map((O, k) => Pb(Pb({}, O), {}, {
      base: l[k]
    }));
    u === "vertical" ? p = fs().y(ol).x1(al).x0((O) => O.base.x) : p = fs().x(al).y1(ol).y0((O) => O.base.y);
    var b = p.defined(Ob).curve(d), w = f ? y.filter(Ob) : y;
    return b(w);
  }
  var P;
  u === "vertical" && oe(l) ? P = fs().y(ol).x1(al).x0(l) : oe(l) ? P = fs().x(al).y1(ol).y0(l) : P = JS().x(al).y(ol);
  var S = P.defined(Zs).curve(d);
  return S(h);
}, _p = (e) => {
  var t = e.className, r = e.points, n = e.path, a = e.pathRef, l = ea();
  if ((!r || !r.length) && !n)
    return null;
  var u = {
    type: e.type,
    points: e.points,
    baseLine: e.baseLine,
    layout: e.layout || l,
    connectNulls: e.connectNulls
  }, c = r && r.length ? n$(u) : n;
  return /* @__PURE__ */ x.createElement("path", Ih({}, vr(e), dp(e), {
    className: $e("recharts-curve", t),
    d: c === null ? void 0 : c,
    ref: a
  }));
}, i$ = ["x", "y", "top", "left", "width", "height", "className"];
function jh() {
  return jh = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, jh.apply(null, arguments);
}
function kb(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function a$(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? kb(Object(r), !0).forEach(function(n) {
      o$(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : kb(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function o$(e, t, r) {
  return (t = l$(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function l$(e) {
  var t = u$(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function u$(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function s$(e, t) {
  if (e == null) return {};
  var r, n, a = c$(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]);
  }
  return a;
}
function c$(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
var f$ = (e, t, r, n, a, l) => "M".concat(e, ",").concat(a, "v").concat(n, "M").concat(l, ",").concat(t, "h").concat(r), d$ = (e) => {
  var t = e.x, r = t === void 0 ? 0 : t, n = e.y, a = n === void 0 ? 0 : n, l = e.top, u = l === void 0 ? 0 : l, c = e.left, f = c === void 0 ? 0 : c, d = e.width, h = d === void 0 ? 0 : d, p = e.height, y = p === void 0 ? 0 : p, b = e.className, w = s$(e, i$), P = a$({
    x: r,
    y: a,
    top: u,
    left: f,
    width: h,
    height: y
  }, w);
  return !oe(r) || !oe(a) || !oe(h) || !oe(y) || !oe(u) || !oe(f) ? null : /* @__PURE__ */ x.createElement("path", jh({}, hr(P), {
    className: $e("recharts-cross", b),
    d: f$(r, a, h, y, u, f)
  }));
};
function v$(e, t, r, n) {
  var a = n / 2;
  return {
    stroke: "none",
    fill: "#ccc",
    x: e === "horizontal" ? t.x - a : r.left + 0.5,
    y: e === "horizontal" ? r.top + 0.5 : t.y - a,
    width: e === "horizontal" ? n : r.width - 1,
    height: e === "horizontal" ? r.height - 1 : n
  };
}
var Js = 1e-4, RA = (e, t) => [0, 3 * e, 3 * t - 6 * e, 3 * e - 3 * t + 1], LA = (e, t) => e.map((r, n) => r * t ** n).reduce((r, n) => r + n), Cb = (e, t) => (r) => {
  var n = RA(e, t);
  return LA(n, r);
}, h$ = (e, t) => (r) => {
  var n = RA(e, t), a = [...n.map((l, u) => l * u).slice(1), 0];
  return LA(a, r);
}, p$ = (e) => {
  var t, r = e.split("(");
  if (r.length !== 2 || r[0] !== "cubic-bezier")
    return null;
  var n = (t = r[1]) === null || t === void 0 || (t = t.split(")")[0]) === null || t === void 0 ? void 0 : t.split(",");
  if (n == null || n.length !== 4)
    return null;
  var a = n.map((l) => parseFloat(l));
  return [a[0], a[1], a[2], a[3]];
}, m$ = function() {
  for (var t = arguments.length, r = new Array(t), n = 0; n < t; n++)
    r[n] = arguments[n];
  if (r.length === 1)
    switch (r[0]) {
      case "linear":
        return [0, 0, 1, 1];
      case "ease":
        return [0.25, 0.1, 0.25, 1];
      case "ease-in":
        return [0.42, 0, 1, 1];
      case "ease-out":
        return [0.42, 0, 0.58, 1];
      case "ease-in-out":
        return [0, 0, 0.58, 1];
      default: {
        var a = p$(r[0]);
        if (a)
          return a;
      }
    }
  return r.length === 4 ? r : [0, 0, 1, 1];
}, y$ = (e, t, r, n) => {
  var a = Cb(e, r), l = Cb(t, n), u = h$(e, r), c = (d) => d > 1 ? 1 : d < 0 ? 0 : d, f = (d) => {
    for (var h = d > 1 ? 1 : d, p = h, y = 0; y < 8; ++y) {
      var b = a(p) - h, w = u(p);
      if (Math.abs(b - h) < Js || w < Js)
        return l(p);
      p = c(p - b / w);
    }
    return l(p);
  };
  return f.isStepper = !1, f;
}, Ib = function() {
  return y$(...m$(...arguments));
}, g$ = function() {
  for (var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = t.stiff, n = r === void 0 ? 100 : r, a = t.damping, l = a === void 0 ? 8 : a, u = t.dt, c = u === void 0 ? 16.67 : u, f = 1, d = [0], h = 0, p = 0, y = 1e4, b = 0; b < y; ) {
    var w = -(h - f) * n, P = p * l;
    if (p += (w - P) * c / 1e3, h += p * c / 1e3, d.push(h), Math.abs(h - f) < Js && Math.abs(p) < Js)
      break;
    b++;
  }
  d[d.length - 1] = f;
  var S = d.length - 1;
  return (O) => {
    var k, I, E;
    if (O <= 0) return 0;
    if (O >= 1) return f;
    var _ = O * S, C = Math.floor(_), R = _ - C;
    return ((k = d[C]) !== null && k !== void 0 ? k : 0) + (((I = d[C + 1]) !== null && I !== void 0 ? I : 0) - ((E = d[C]) !== null && E !== void 0 ? E : 0)) * R;
  };
}, x$ = (e) => {
  if (typeof e == "string")
    switch (e) {
      case "ease":
      case "ease-in-out":
      case "ease-out":
      case "ease-in":
      case "linear":
        return Ib(e);
      case "spring":
        return g$();
      default:
        if (e.split("(")[0] === "cubic-bezier")
          return Ib(e);
    }
  return typeof e == "function" ? e : null;
}, b$ = (e, t, r) => {
  var n, a = (l) => {
    var u = t.tick(l);
    if (t.getState() === "active") {
      if (r(t.getInterpolated()), t.getProgress() === 1) {
        t.complete(), n = void 0;
        return;
      }
      n = e.setTimeout(a, u);
      return;
    }
    n = e.setTimeout(a, u);
  };
  return n = e.setTimeout(a, 0), () => {
    var l;
    return (l = n) === null || l === void 0 ? void 0 : l();
  };
}, zA = /* @__PURE__ */ x.createContext(b$);
zA.Provider;
function w$(e) {
  var t = x.useContext(zA);
  return x.useMemo(() => e ?? t, [e, t]);
}
function S$(e, t, r) {
  return (t = P$(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function P$(e) {
  var t = A$(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function A$(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var jb = "init", _b = "pending", Tb = "active", O$ = "completed";
function $v(e) {
  return Math.max(0, e);
}
class E$ {
  /**
   * Returns the absolute time after the animationBegin delay has been completed,
   * and when the animationDuration started ticking.
   */
  getAnimationStartedTime() {
    return this.animationStartedTime;
  }
  /**
   * Returns the absolute time of when the animation began - now it will wait for {animationBegin} ms before the transition starts
   */
  getBeginStartedTime() {
    return this.beginStartedTime;
  }
  constructor(t) {
    var r;
    S$(this, "state", jb), this.animationId = t.animationId, this.onAnimationEnd = t.onAnimationEnd, this.animationDuration = $v(t.animationDuration), this.animationBegin = $v(t.animationBegin), this.progress = 0, this.from = t.from, this.to = t.to, this.easing = t.easing, (r = t.onAnimationStart) === null || r === void 0 || r.call(t);
  }
  /**
   * Returns the state machine current state
   * - `init`:       animation had just been created. It immediately calls `onAnimationStart`
   * - `pending`:    animation is now paused for `animationBegin` milliseconds until the transition begins
   * - `active`:     animation is transitioning items on screen
   * - `completed`:  animation has completed its transition and executed `onAnimationEnd`.
   *                 This state is final and the animation is no longer allowed to transition to other states.
   */
  getState() {
    return this.state;
  }
  /**
   * Returns the easing input or function
   */
  getEasing() {
    return this.easing;
  }
  /**
   * Returns the configuration - the duration of the transition.
   * Does not change in time, does not change when state changes, this is a static value.
   */
  getAnimationDuration() {
    return this.animationDuration;
  }
  /**
   * Sets the current time of the animation. The animation sets its internal state and progress accordingly.
   * This is current, absolute time; not additive!
   * This allows you to essentially "travel back in time" based on the value you pass in here.
   *
   * Returns the (relative) time remaining until the current activity is over.
   * Meaning: if the state is in a middle of a delay, returns the time left until the delay is finished.
   * If the state is in the middle of a transition, returns time left until that transition is complete.
   * This is useful because it's the same number you can take and put into setTimeout(fn, X)
   * as that's how much time we need to wait until the next state transition happens.
   */
  tick(t) {
    if (this.getState() === jb)
      return this.state = _b, this.beginStartedTime = t, this.animationBegin;
    if (this.getState() === _b) {
      if (this.beginStartedTime == null)
        throw new Error();
      var r = t - this.beginStartedTime;
      return r >= this.animationBegin ? (this.state = Tb, this.animationStartedTime = t, this.nextAnimationUpdate(0)) : $v(this.animationBegin - r);
    }
    if (this.getState() === Tb) {
      if (this.animationStartedTime == null)
        throw new Error();
      var n = t - this.animationStartedTime;
      return this.setProgress(n / this.animationDuration), this.nextAnimationUpdate(n);
    }
    return 0;
  }
  setProgress(t) {
    this.progress = Math.min(1, Math.max(0, t));
  }
  /**
   * Returns an abstract "progress" which is number between 0 and 1 which shows the distance of transition.
   * This progress depends on the animation state:
   * - `init`: 0
   * - `pending`: 0
   * - `active`: transitioning between [0, 1] based on the time elapsed
   * - `completed`: 1
   *
   * The progress is hard-capped to be between 0 and 1 (inclusive) to avoid overshooting caused by coarse timers.
   * For this reason, the easing function must be applied _after_ this animation state,
   * so that one has a chance to construct dynamic "overshoot" animations.
   *
   * The progress is linear with time.
   * If you wish for easing, use `getInterpolated()` instead.
   */
  getProgress() {
    return this.progress;
  }
  /**
   * Completes the animation. Completed animation:
   * - cannot be manipulated anymore
   * - its progress is set to 1
   * - tick function doesn't do anything
   * - getState() always returns 'completed'
   */
  complete() {
    if (this.progress = 1, this.state === "active") {
      var t;
      (t = this.onAnimationEnd) === null || t === void 0 || t.call(this);
    }
    this.state = O$;
  }
  /**
   * Returns the starting value of the animation.
   * Does not include progress, easing, interpolation, none of that - just the static starting value
   */
  getFrom() {
    return this.from;
  }
  /**
   * Returns the end value of the animation.
   * Does not include progress, easing, interpolation, none of that - just the static end value
   */
  getTo() {
    return this.to;
  }
  /**
   * Unique identifier of an animation
   */
  getAnimationId() {
    return this.animationId;
  }
  /**
   * Returns the configuration - the duration of delay in between animation initialization, and transition.
   * Does not change in time, does not change when state changes, this is a static value.
   */
  getAnimationBegin() {
    return this.animationBegin;
  }
  /**
   * Returns value of the transition at the current time.
   * The exact details differ based on the animation type
   */
  /**
   * Returns the duration of time of when the controller should ask for the next update
   */
}
class k$ extends E$ {
  // eslint-disable-next-line class-methods-use-this
  nextAnimationUpdate() {
    return 0;
  }
  /**
   * Returns value of the animation after its easing function had been applied.
   * This value, unlike getProgress(), can escape the [0..1] range
   * because this is entirely within the easing function control. Spring typically does this.
   */
  getInterpolated() {
    return this.easing(nt(this.getFrom(), this.getTo(), this.getProgress()));
  }
}
class C$ {
  setTimeout(t) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0, n = performance.now(), a = null, l = (u) => {
      u - n >= r ? t(u) : a = requestAnimationFrame(l);
    };
    return a = requestAnimationFrame(l), () => {
      a != null && cancelAnimationFrame(a);
    };
  }
}
function I$(e, t) {
  return M$(e) || T$(e, t) || _$(e, t) || j$();
}
function j$() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function _$(e, t) {
  if (e) {
    if (typeof e == "string") return Mb(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? Mb(e, t) : void 0;
  }
}
function Mb(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function T$(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, a, l, u, c = [], f = !0, d = !1;
    try {
      if (l = (r = r.call(e)).next, t !== 0) for (; !(f = (n = l.call(r)).done) && (c.push(n.value), c.length !== t); f = !0) ;
    } catch (h) {
      d = !0, a = h;
    } finally {
      try {
        if (!f && r.return != null && (u = r.return(), Object(u) !== u)) return;
      } finally {
        if (d) throw a;
      }
    }
    return c;
  }
}
function M$(e) {
  if (Array.isArray(e)) return e;
}
var D$ = {
  begin: 0,
  duration: 1e3,
  easing: "ease",
  isActive: !0,
  canBegin: !0,
  onAnimationEnd: () => {
  },
  onAnimationStart: () => {
  }
}, Db = 0, Rv = 1;
function BA(e) {
  var t = gt(e, D$), r = t.animationId, n = t.isActive, a = t.canBegin, l = t.duration, u = t.easing, c = t.begin, f = t.onAnimationEnd, d = t.onAnimationStart, h = t.children, p = NA(), y = n === "auto" ? !zl.isSsr && !p : n, b = w$(t.animationController), w = x.useState(y ? Db : Rv), P = I$(w, 2), S = P[0], O = P[1];
  return x.useEffect(() => {
    y || O(Rv);
  }, [y]), x.useEffect(() => {
    var k = x$(u);
    if (!y || !a || k == null)
      return Ji;
    var I = new C$(), E = new k$({
      animationId: r,
      easing: k,
      animationDuration: l,
      animationBegin: c,
      onAnimationStart: d,
      onAnimationEnd: f,
      from: Db,
      to: Rv
    });
    return b(I, E, O);
  }, [b, r, y, a, l, u, c, d, f]), h(Number(S));
}
function FA(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "animation-", r = x.useRef(bl(t)), n = x.useRef(e);
  return n.current !== e && (r.current = bl(t), n.current = e), r.current;
}
var N$ = (e) => e.replace(/([A-Z])/g, (t) => "-".concat(t.toLowerCase())), $$ = (e, t, r) => e.map((n) => "".concat(N$(n), " ").concat(t, "ms ").concat(r)).join(","), R$ = ["radius"], L$ = ["radius"], Nb, $b, Rb, Lb, zb, Bb, Fb, Wb, Ub, Kb;
function Hb(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Vb(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Hb(Object(r), !0).forEach(function(n) {
      z$(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Hb(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function z$(e, t, r) {
  return (t = B$(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function B$(e) {
  var t = F$(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function F$(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function ec() {
  return ec = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, ec.apply(null, arguments);
}
function Gb(e, t) {
  if (e == null) return {};
  var r, n, a = W$(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]);
  }
  return a;
}
function W$(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
function U$(e, t) {
  return G$(e) || V$(e, t) || H$(e, t) || K$();
}
function K$() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function H$(e, t) {
  if (e) {
    if (typeof e == "string") return Yb(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? Yb(e, t) : void 0;
  }
}
function Yb(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function V$(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, a, l, u, c = [], f = !0, d = !1;
    try {
      if (l = (r = r.call(e)).next, t !== 0) for (; !(f = (n = l.call(r)).done) && (c.push(n.value), c.length !== t); f = !0) ;
    } catch (h) {
      d = !0, a = h;
    } finally {
      try {
        if (!f && r.return != null && (u = r.return(), Object(u) !== u)) return;
      } finally {
        if (d) throw a;
      }
    }
    return c;
  }
}
function G$(e) {
  if (Array.isArray(e)) return e;
}
function Jr(e, t) {
  return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } }));
}
var qb = (e, t, r, n, a) => {
  var l = An(r), u = An(n), c = Math.min(Math.abs(l) / 2, Math.abs(u) / 2), f = u >= 0 ? 1 : -1, d = l >= 0 ? 1 : -1, h = u >= 0 && l >= 0 || u < 0 && l < 0 ? 1 : 0, p;
  if (c > 0 && Array.isArray(a)) {
    for (var y = [0, 0, 0, 0], b = 0, w = 4; b < w; b++) {
      var P, S = (P = a[b]) !== null && P !== void 0 ? P : 0;
      y[b] = S > c ? c : S;
    }
    p = Tt(Nb || (Nb = Jr(["M", ",", ""])), e, t + f * y[0]), y[0] > 0 && (p += Tt($b || ($b = Jr(["A ", ",", ",0,0,", ",", ",", ""])), y[0], y[0], h, e + d * y[0], t)), p += Tt(Rb || (Rb = Jr(["L ", ",", ""])), e + r - d * y[1], t), y[1] > 0 && (p += Tt(Lb || (Lb = Jr(["A ", ",", ",0,0,", `,
        `, ",", ""])), y[1], y[1], h, e + r, t + f * y[1])), p += Tt(zb || (zb = Jr(["L ", ",", ""])), e + r, t + n - f * y[2]), y[2] > 0 && (p += Tt(Bb || (Bb = Jr(["A ", ",", ",0,0,", `,
        `, ",", ""])), y[2], y[2], h, e + r - d * y[2], t + n)), p += Tt(Fb || (Fb = Jr(["L ", ",", ""])), e + d * y[3], t + n), y[3] > 0 && (p += Tt(Wb || (Wb = Jr(["A ", ",", ",0,0,", `,
        `, ",", ""])), y[3], y[3], h, e, t + n - f * y[3])), p += "Z";
  } else if (c > 0 && a === +a && a > 0) {
    var O = Math.min(c, a);
    p = Tt(Ub || (Ub = Jr(["M ", ",", `
            A `, ",", ",0,0,", ",", ",", `
            L `, ",", `
            A `, ",", ",0,0,", ",", ",", `
            L `, ",", `
            A `, ",", ",0,0,", ",", ",", `
            L `, ",", `
            A `, ",", ",0,0,", ",", ",", " Z"])), e, t + f * O, O, O, h, e + d * O, t, e + r - d * O, t, O, O, h, e + r, t + f * O, e + r, t + n - f * O, O, O, h, e + r - d * O, t + n, e + d * O, t + n, O, O, h, e, t + n - f * O);
  } else
    p = Tt(Kb || (Kb = Jr(["M ", ",", " h ", " v ", " h ", " Z"])), e, t, r, n, -r);
  return p;
}, Xb = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  radius: 0,
  isAnimationActive: !1,
  isUpdateAnimationActive: !1,
  animationBegin: 0,
  animationDuration: 1500,
  animationEasing: "ease"
}, WA = (e) => {
  var t = gt(e, Xb), r = x.useRef(null), n = x.useState(-1), a = U$(n, 2), l = a[0], u = a[1];
  x.useEffect(() => {
    if (r.current && r.current.getTotalLength)
      try {
        var U = r.current.getTotalLength();
        U && u(U);
      } catch {
      }
  }, []);
  var c = t.x, f = t.y, d = t.width, h = t.height, p = t.radius, y = t.className, b = t.animationEasing, w = t.animationDuration, P = t.animationBegin, S = t.isAnimationActive, O = t.isUpdateAnimationActive, k = x.useRef(d), I = x.useRef(h), E = x.useRef(c), _ = x.useRef(f), C = x.useMemo(() => ({
    x: c,
    y: f,
    width: d,
    height: h,
    radius: p
  }), [c, f, d, h, p]), R = FA(C, "rectangle-");
  if (c !== +c || f !== +f || d !== +d || h !== +h || d === 0 || h === 0)
    return null;
  var W = $e("recharts-rectangle", y);
  if (!O) {
    var V = hr(t);
    V.radius;
    var K = Gb(V, R$);
    return /* @__PURE__ */ x.createElement("path", ec({}, K, {
      x: An(c),
      y: An(f),
      width: An(d),
      height: An(h),
      radius: typeof p == "number" ? p : void 0,
      className: W,
      d: qb(c, f, d, h, p)
    }));
  }
  var G = k.current, F = I.current, ie = E.current, re = _.current, ne = "0px ".concat(l === -1 ? 1 : l, "px"), fe = "".concat(l, "px ").concat(l, "px"), ae = $$(["strokeDasharray"], w, typeof b == "string" ? b : Xb.animationEasing);
  return /* @__PURE__ */ x.createElement(BA, {
    animationId: R,
    key: R,
    canBegin: l > 0,
    duration: w,
    easing: b,
    isActive: O,
    begin: P
  }, (U) => {
    var ee = nt(G, d, U), Y = nt(F, h, U), D = nt(ie, c, U), H = nt(re, f, U);
    r.current && (k.current = ee, I.current = Y, E.current = D, _.current = H);
    var ve;
    S ? U > 0 ? ve = {
      transition: ae,
      strokeDasharray: fe
    } : ve = {
      strokeDasharray: ne
    } : ve = {
      strokeDasharray: fe
    };
    var ye = hr(t);
    ye.radius;
    var Pe = Gb(ye, L$);
    return /* @__PURE__ */ x.createElement("path", ec({}, Pe, {
      radius: typeof p == "number" ? p : void 0,
      className: W,
      d: qb(D, H, ee, Y, p),
      ref: r,
      style: Vb(Vb({}, ve), t.style)
    }));
  });
};
function Qb(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Zb(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Qb(Object(r), !0).forEach(function(n) {
      Y$(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Qb(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function Y$(e, t, r) {
  return (t = q$(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function q$(e) {
  var t = X$(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function X$(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var tc = Math.PI / 180, Q$ = (e) => e * 180 / Math.PI, st = (e, t, r, n) => ({
  x: e + Math.cos(-tc * n) * r,
  y: t + Math.sin(-tc * n) * r
}), UA = function(t, r) {
  var n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
  return Math.min(Math.abs(t - (n.left || 0) - (n.right || 0)), Math.abs(r - (n.top || 0) - (n.bottom || 0))) / 2;
}, Z$ = (e, t) => {
  var r = e.x, n = e.y, a = t.x, l = t.y;
  return Math.sqrt((r - a) ** 2 + (n - l) ** 2);
}, J$ = (e, t) => {
  var r = e.x, n = e.y, a = t.cx, l = t.cy, u = Z$({
    x: r,
    y: n
  }, {
    x: a,
    y: l
  });
  if (u <= 0)
    return {
      radius: u,
      angle: 0
    };
  var c = (r - a) / u, f = Math.acos(c);
  return n > l && (f = 2 * Math.PI - f), {
    radius: u,
    angle: Q$(f),
    angleInRadian: f
  };
}, eR = (e) => {
  var t = e.startAngle, r = e.endAngle, n = Math.floor(t / 360), a = Math.floor(r / 360), l = Math.min(n, a);
  return {
    startAngle: t - l * 360,
    endAngle: r - l * 360
  };
}, tR = (e, t) => {
  var r = t.startAngle, n = t.endAngle, a = Math.floor(r / 360), l = Math.floor(n / 360), u = Math.min(a, l);
  return e + u * 360;
}, rR = (e, t) => {
  var r = e.relativeX, n = e.relativeY, a = J$({
    x: r,
    y: n
  }, t), l = a.radius, u = a.angle, c = t.innerRadius, f = t.outerRadius;
  if (l < c || l > f || l === 0)
    return null;
  var d = eR(t), h = d.startAngle, p = d.endAngle, y = u, b;
  if (h <= p) {
    for (; y > p; )
      y -= 360;
    for (; y < h; )
      y += 360;
    b = y >= h && y <= p;
  } else {
    for (; y > h; )
      y -= 360;
    for (; y < p; )
      y += 360;
    b = y >= p && y <= h;
  }
  return b ? Zb(Zb({}, t), {}, {
    radius: l,
    angle: tR(y, t)
  }) : null;
};
function KA(e) {
  var t = e.cx, r = e.cy, n = e.radius, a = e.startAngle, l = e.endAngle, u = st(t, r, n, a), c = st(t, r, n, l);
  return {
    points: [u, c],
    cx: t,
    cy: r,
    radius: n,
    startAngle: a,
    endAngle: l
  };
}
var Jb, e1, t1, r1, n1, i1, a1;
function _h() {
  return _h = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, _h.apply(null, arguments);
}
function Li(e, t) {
  return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } }));
}
var nR = (e, t) => {
  var r = Et(t - e), n = Math.min(Math.abs(t - e), 359.999);
  return r * n;
}, gs = (e) => {
  var t = e.cx, r = e.cy, n = e.radius, a = e.angle, l = e.sign, u = e.isExternal, c = e.cornerRadius, f = e.cornerIsExternal, d = c * (u ? 1 : -1) + n, h = Math.asin(c / d) / tc, p = f ? a : a + l * h, y = st(t, r, d, p), b = st(t, r, n, p), w = f ? a - l * h : a, P = st(t, r, d * Math.cos(h * tc), w);
  return {
    center: y,
    circleTangency: b,
    lineTangency: P,
    theta: h
  };
}, HA = (e) => {
  var t = e.cx, r = e.cy, n = e.innerRadius, a = e.outerRadius, l = e.startAngle, u = e.endAngle, c = nR(l, u), f = l + c, d = st(t, r, a, l), h = st(t, r, a, f), p = Tt(Jb || (Jb = Li(["M ", ",", `
    A `, ",", `,0,
    `, ",", `,
    `, ",", `
  `])), d.x, d.y, a, a, +(Math.abs(c) > 180), +(l > f), h.x, h.y);
  if (n > 0) {
    var y = st(t, r, n, l), b = st(t, r, n, f);
    p += Tt(e1 || (e1 = Li(["L ", ",", `
            A `, ",", `,0,
            `, ",", `,
            `, ",", " Z"])), b.x, b.y, n, n, +(Math.abs(c) > 180), +(l <= f), y.x, y.y);
  } else
    p += Tt(t1 || (t1 = Li(["L ", ",", " Z"])), t, r);
  return p;
}, iR = (e) => {
  var t = e.cx, r = e.cy, n = e.innerRadius, a = e.outerRadius, l = e.cornerRadius, u = e.forceCornerRadius, c = e.cornerIsExternal, f = e.startAngle, d = e.endAngle, h = Et(d - f), p = gs({
    cx: t,
    cy: r,
    radius: a,
    angle: f,
    sign: h,
    cornerRadius: l,
    cornerIsExternal: c
  }), y = p.circleTangency, b = p.lineTangency, w = p.theta, P = gs({
    cx: t,
    cy: r,
    radius: a,
    angle: d,
    sign: -h,
    cornerRadius: l,
    cornerIsExternal: c
  }), S = P.circleTangency, O = P.lineTangency, k = P.theta, I = c ? Math.abs(f - d) : Math.abs(f - d) - w - k;
  if (I < 0)
    return u ? Tt(r1 || (r1 = Li(["M ", ",", `
        a`, ",", ",0,0,1,", `,0
        a`, ",", ",0,0,1,", `,0
      `])), b.x, b.y, l, l, l * 2, l, l, -l * 2) : HA({
      cx: t,
      cy: r,
      innerRadius: n,
      outerRadius: a,
      startAngle: f,
      endAngle: d
    });
  var E = Tt(n1 || (n1 = Li(["M ", ",", `
    A`, ",", ",0,0,", ",", ",", `
    A`, ",", ",0,", ",", ",", ",", `
    A`, ",", ",0,0,", ",", ",", `
  `])), b.x, b.y, l, l, +(h < 0), y.x, y.y, a, a, +(I > 180), +(h < 0), S.x, S.y, l, l, +(h < 0), O.x, O.y);
  if (n > 0) {
    var _ = gs({
      cx: t,
      cy: r,
      radius: n,
      angle: f,
      sign: h,
      isExternal: !0,
      cornerRadius: l,
      cornerIsExternal: c
    }), C = _.circleTangency, R = _.lineTangency, W = _.theta, V = gs({
      cx: t,
      cy: r,
      radius: n,
      angle: d,
      sign: -h,
      isExternal: !0,
      cornerRadius: l,
      cornerIsExternal: c
    }), K = V.circleTangency, G = V.lineTangency, F = V.theta, ie = c ? Math.abs(f - d) : Math.abs(f - d) - W - F;
    if (ie < 0 && l === 0)
      return "".concat(E, "L").concat(t, ",").concat(r, "Z");
    E += Tt(i1 || (i1 = Li(["L", ",", `
      A`, ",", ",0,0,", ",", ",", `
      A`, ",", ",0,", ",", ",", ",", `
      A`, ",", ",0,0,", ",", ",", "Z"])), G.x, G.y, l, l, +(h < 0), K.x, K.y, n, n, +(ie > 180), +(h > 0), C.x, C.y, l, l, +(h < 0), R.x, R.y);
  } else
    E += Tt(a1 || (a1 = Li(["L", ",", "Z"])), t, r);
  return E;
}, aR = {
  cx: 0,
  cy: 0,
  innerRadius: 0,
  outerRadius: 0,
  startAngle: 0,
  endAngle: 0,
  cornerRadius: 0,
  forceCornerRadius: !1,
  cornerIsExternal: !1
}, VA = (e) => {
  var t = gt(e, aR), r = t.cx, n = t.cy, a = t.innerRadius, l = t.outerRadius, u = t.cornerRadius, c = t.forceCornerRadius, f = t.cornerIsExternal, d = t.startAngle, h = t.endAngle, p = t.className;
  if (l < a || d === h)
    return null;
  var y = $e("recharts-sector", p), b = l - a, w = Wt(u, b, 0, !0), P;
  return w > 0 && Math.abs(d - h) < 360 ? P = iR({
    cx: r,
    cy: n,
    innerRadius: a,
    outerRadius: l,
    cornerRadius: Math.min(w, b / 2),
    forceCornerRadius: c,
    cornerIsExternal: f,
    startAngle: d,
    endAngle: h
  }) : P = HA({
    cx: r,
    cy: n,
    innerRadius: a,
    outerRadius: l,
    startAngle: d,
    endAngle: h
  }), /* @__PURE__ */ x.createElement("path", _h({}, hr(t), {
    className: y,
    d: P
  }));
};
function oR(e, t, r) {
  if (e === "horizontal")
    return [{
      x: t.x,
      y: r.top
    }, {
      x: t.x,
      y: r.top + r.height
    }];
  if (e === "vertical")
    return [{
      x: r.left,
      y: t.y
    }, {
      x: r.left + r.width,
      y: t.y
    }];
  if (dP(t)) {
    if (e === "centric") {
      var n = t.cx, a = t.cy, l = t.innerRadius, u = t.outerRadius, c = t.angle, f = st(n, a, l, c), d = st(n, a, u, c);
      return [{
        x: f.x,
        y: f.y
      }, {
        x: d.x,
        y: d.y
      }];
    }
    return KA(t);
  }
}
function lR(e) {
  return ap(e) ? NaN : Number(e);
}
function Lv(e) {
  return e ? (e = lR(e), e === 1 / 0 || e === -1 / 0 ? (e < 0 ? -1 : 1) * Number.MAX_VALUE : e === e ? e : 0) : e === 0 ? e : 0;
}
function GA(e, t, r) {
  r && typeof r != "number" && mh(e, t, r) && (t = r = void 0), e = Lv(e), t === void 0 ? (t = e, e = 0) : t = Lv(t), r = r === void 0 ? e < t ? 1 : -1 : Lv(r);
  const n = Math.max(Math.ceil((t - e) / (r || 1)), 0), a = new Array(n);
  for (let l = 0; l < n; l++)
    a[l] = e, e += r;
  return a;
}
var Hr = (e) => e.chartData, Bl = $([Hr], (e) => {
  var t = e.chartData != null ? e.chartData.length - 1 : 0;
  return {
    chartData: e.chartData,
    computedData: e.computedData,
    dataEndIndex: t,
    dataStartIndex: 0
  };
}), Fl = (e, t, r, n) => n ? Bl(e) : Hr(e), uR = (e, t, r) => r ? Bl(e) : Hr(e), sR = $([Fl], (e) => {
  var t = e.chartData, r = e.dataStartIndex, n = e.dataEndIndex;
  return t != null ? t.slice(r, n + 1) : [];
}), cR = $([Bl], (e) => {
  var t = e.chartData, r = e.dataStartIndex, n = e.dataEndIndex;
  return t != null ? t.slice(r, n + 1) : [];
}), fR = $([Hr], (e) => {
  var t = e.chartData, r = e.dataStartIndex, n = e.dataEndIndex;
  return t != null ? t.slice(r, n + 1) : [];
});
function Tp(e, t) {
  return pR(e) || hR(e, t) || vR(e, t) || dR();
}
function dR() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function vR(e, t) {
  if (e) {
    if (typeof e == "string") return o1(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? o1(e, t) : void 0;
  }
}
function o1(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function hR(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, a, l, u, c = [], f = !0, d = !1;
    try {
      if (l = (r = r.call(e)).next, t !== 0) for (; !(f = (n = l.call(r)).done) && (c.push(n.value), c.length !== t); f = !0) ;
    } catch (h) {
      d = !0, a = h;
    } finally {
      try {
        if (!f && r.return != null && (u = r.return(), Object(u) !== u)) return;
      } finally {
        if (d) throw a;
      }
    }
    return c;
  }
}
function pR(e) {
  if (Array.isArray(e)) return e;
}
function an(e) {
  if (Array.isArray(e) && e.length === 2) {
    var t = Tp(e, 2), r = t[0], n = t[1];
    if (Ie(r) && Ie(n))
      return !0;
  }
  return !1;
}
function l1(e, t, r) {
  return r ? e : [Math.min(e[0], t[0]), Math.max(e[1], t[1])];
}
function YA(e, t) {
  if (t && typeof e != "function" && Array.isArray(e) && e.length === 2) {
    var r = Tp(e, 2), n = r[0], a = r[1], l, u;
    if (Ie(n))
      l = n;
    else if (typeof n == "function")
      return;
    if (Ie(a))
      u = a;
    else if (typeof a == "function")
      return;
    var c = [l, u];
    if (an(c))
      return c;
  }
}
function mR(e, t, r) {
  if (!(!r && t == null)) {
    if (typeof e == "function" && t != null)
      try {
        var n = e(t, r);
        if (an(n))
          return l1(n, t, r);
      } catch {
      }
    if (Array.isArray(e) && e.length === 2) {
      var a = Tp(e, 2), l = a[0], u = a[1], c, f;
      if (l === "auto")
        t != null && (c = Math.min(...t));
      else if (oe(l))
        c = l;
      else if (typeof l == "function")
        try {
          t != null && (c = l(t == null ? void 0 : t[0]));
        } catch {
        }
      else if (typeof l == "string" && rb.test(l)) {
        var d = rb.exec(l);
        if (d == null || d[1] == null || t == null)
          c = void 0;
        else {
          var h = +d[1];
          c = t[0] - h;
        }
      } else
        c = t == null ? void 0 : t[0];
      if (u === "auto")
        t != null && (f = Math.max(...t));
      else if (oe(u))
        f = u;
      else if (typeof u == "function")
        try {
          t != null && (f = u(t == null ? void 0 : t[1]));
        } catch {
        }
      else if (typeof u == "string" && nb.test(u)) {
        var p = nb.exec(u);
        if (p == null || p[1] == null || t == null)
          f = void 0;
        else {
          var y = +p[1];
          f = t[1] + y;
        }
      } else
        f = t == null ? void 0 : t[1];
      var b = [c, f];
      if (an(b))
        return t == null ? b : l1(b, t, r);
    }
  }
}
var io = 1e9, yR = {
  // These values must be integers within the stated ranges (inclusive).
  // Most of these values can be changed during run-time using `Decimal.config`.
  // The maximum number of significant digits of the result of a calculation or base conversion.
  // E.g. `Decimal.config({ precision: 20 });`
  precision: 20,
  // 1 to MAX_DIGITS
  // The rounding mode used by default by `toInteger`, `toDecimalPlaces`, `toExponential`,
  // `toFixed`, `toPrecision` and `toSignificantDigits`.
  //
  // ROUND_UP         0 Away from zero.
  // ROUND_DOWN       1 Towards zero.
  // ROUND_CEIL       2 Towards +Infinity.
  // ROUND_FLOOR      3 Towards -Infinity.
  // ROUND_HALF_UP    4 Towards nearest neighbour. If equidistant, up.
  // ROUND_HALF_DOWN  5 Towards nearest neighbour. If equidistant, down.
  // ROUND_HALF_EVEN  6 Towards nearest neighbour. If equidistant, towards even neighbour.
  // ROUND_HALF_CEIL  7 Towards nearest neighbour. If equidistant, towards +Infinity.
  // ROUND_HALF_FLOOR 8 Towards nearest neighbour. If equidistant, towards -Infinity.
  //
  // E.g.
  // `Decimal.rounding = 4;`
  // `Decimal.rounding = Decimal.ROUND_HALF_UP;`
  rounding: 4,
  // 0 to 8
  // The exponent value at and beneath which `toString` returns exponential notation.
  // JavaScript numbers: -7
  toExpNeg: -7,
  // 0 to -MAX_E
  // The exponent value at and above which `toString` returns exponential notation.
  // JavaScript numbers: 21
  toExpPos: 21,
  // 0 to MAX_E
  // The natural logarithm of 10.
  // 115 digits
  LN10: "2.302585092994045684017991454684364207601101488628772976033327900967572609677352480235997205089598298341967784042286"
}, Dp, Xe = !0, Ir = "[DecimalError] ", Ui = Ir + "Invalid argument: ", Mp = Ir + "Exponent out of range: ", ao = Math.floor, Ni = Math.pow, gR = /^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i, cr, Ot = 1e7, Ge = 7, qA = 9007199254740991, rc = ao(qA / Ge), ce = {};
ce.absoluteValue = ce.abs = function() {
  var e = new this.constructor(this);
  return e.s && (e.s = 1), e;
};
ce.comparedTo = ce.cmp = function(e) {
  var t, r, n, a, l = this;
  if (e = new l.constructor(e), l.s !== e.s) return l.s || -e.s;
  if (l.e !== e.e) return l.e > e.e ^ l.s < 0 ? 1 : -1;
  for (n = l.d.length, a = e.d.length, t = 0, r = n < a ? n : a; t < r; ++t)
    if (l.d[t] !== e.d[t]) return l.d[t] > e.d[t] ^ l.s < 0 ? 1 : -1;
  return n === a ? 0 : n > a ^ l.s < 0 ? 1 : -1;
};
ce.decimalPlaces = ce.dp = function() {
  var e = this, t = e.d.length - 1, r = (t - e.e) * Ge;
  if (t = e.d[t], t) for (; t % 10 == 0; t /= 10) r--;
  return r < 0 ? 0 : r;
};
ce.dividedBy = ce.div = function(e) {
  return kn(this, new this.constructor(e));
};
ce.dividedToIntegerBy = ce.idiv = function(e) {
  var t = this, r = t.constructor;
  return Fe(kn(t, new r(e), 0, 1), r.precision);
};
ce.equals = ce.eq = function(e) {
  return !this.cmp(e);
};
ce.exponent = function() {
  return ft(this);
};
ce.greaterThan = ce.gt = function(e) {
  return this.cmp(e) > 0;
};
ce.greaterThanOrEqualTo = ce.gte = function(e) {
  return this.cmp(e) >= 0;
};
ce.isInteger = ce.isint = function() {
  return this.e > this.d.length - 2;
};
ce.isNegative = ce.isneg = function() {
  return this.s < 0;
};
ce.isPositive = ce.ispos = function() {
  return this.s > 0;
};
ce.isZero = function() {
  return this.s === 0;
};
ce.lessThan = ce.lt = function(e) {
  return this.cmp(e) < 0;
};
ce.lessThanOrEqualTo = ce.lte = function(e) {
  return this.cmp(e) < 1;
};
ce.logarithm = ce.log = function(e) {
  var t, r = this, n = r.constructor, a = n.precision, l = a + 5;
  if (e === void 0)
    e = new n(10);
  else if (e = new n(e), e.s < 1 || e.eq(cr)) throw Error(Ir + "NaN");
  if (r.s < 1) throw Error(Ir + (r.s ? "NaN" : "-Infinity"));
  return r.eq(cr) ? new n(0) : (Xe = !1, t = kn(Al(r, l), Al(e, l), l), Xe = !0, Fe(t, a));
};
ce.minus = ce.sub = function(e) {
  var t = this;
  return e = new t.constructor(e), t.s == e.s ? ZA(t, e) : XA(t, (e.s = -e.s, e));
};
ce.modulo = ce.mod = function(e) {
  var t, r = this, n = r.constructor, a = n.precision;
  if (e = new n(e), !e.s) throw Error(Ir + "NaN");
  return r.s ? (Xe = !1, t = kn(r, e, 0, 1).times(e), Xe = !0, r.minus(t)) : Fe(new n(r), a);
};
ce.naturalExponential = ce.exp = function() {
  return QA(this);
};
ce.naturalLogarithm = ce.ln = function() {
  return Al(this);
};
ce.negated = ce.neg = function() {
  var e = new this.constructor(this);
  return e.s = -e.s || 0, e;
};
ce.plus = ce.add = function(e) {
  var t = this;
  return e = new t.constructor(e), t.s == e.s ? XA(t, e) : ZA(t, (e.s = -e.s, e));
};
ce.precision = ce.sd = function(e) {
  var t, r, n, a = this;
  if (e !== void 0 && e !== !!e && e !== 1 && e !== 0) throw Error(Ui + e);
  if (t = ft(a) + 1, n = a.d.length - 1, r = n * Ge + 1, n = a.d[n], n) {
    for (; n % 10 == 0; n /= 10) r--;
    for (n = a.d[0]; n >= 10; n /= 10) r++;
  }
  return e && t > r ? t : r;
};
ce.squareRoot = ce.sqrt = function() {
  var e, t, r, n, a, l, u, c = this, f = c.constructor;
  if (c.s < 1) {
    if (!c.s) return new f(0);
    throw Error(Ir + "NaN");
  }
  for (e = ft(c), Xe = !1, a = Math.sqrt(+c), a == 0 || a == 1 / 0 ? (t = nn(c.d), (t.length + e) % 2 == 0 && (t += "0"), a = Math.sqrt(t), e = ao((e + 1) / 2) - (e < 0 || e % 2), a == 1 / 0 ? t = "5e" + e : (t = a.toExponential(), t = t.slice(0, t.indexOf("e") + 1) + e), n = new f(t)) : n = new f(a.toString()), r = f.precision, a = u = r + 3; ; )
    if (l = n, n = l.plus(kn(c, l, u + 2)).times(0.5), nn(l.d).slice(0, u) === (t = nn(n.d)).slice(0, u)) {
      if (t = t.slice(u - 3, u + 1), a == u && t == "4999") {
        if (Fe(l, r + 1, 0), l.times(l).eq(c)) {
          n = l;
          break;
        }
      } else if (t != "9999")
        break;
      u += 4;
    }
  return Xe = !0, Fe(n, r);
};
ce.times = ce.mul = function(e) {
  var t, r, n, a, l, u, c, f, d, h = this, p = h.constructor, y = h.d, b = (e = new p(e)).d;
  if (!h.s || !e.s) return new p(0);
  for (e.s *= h.s, r = h.e + e.e, f = y.length, d = b.length, f < d && (l = y, y = b, b = l, u = f, f = d, d = u), l = [], u = f + d, n = u; n--; ) l.push(0);
  for (n = d; --n >= 0; ) {
    for (t = 0, a = f + n; a > n; )
      c = l[a] + b[n] * y[a - n - 1] + t, l[a--] = c % Ot | 0, t = c / Ot | 0;
    l[a] = (l[a] + t) % Ot | 0;
  }
  for (; !l[--u]; ) l.pop();
  return t ? ++r : l.shift(), e.d = l, e.e = r, Xe ? Fe(e, p.precision) : e;
};
ce.toDecimalPlaces = ce.todp = function(e, t) {
  var r = this, n = r.constructor;
  return r = new n(r), e === void 0 ? r : (fn(e, 0, io), t === void 0 ? t = n.rounding : fn(t, 0, 8), Fe(r, e + ft(r) + 1, t));
};
ce.toExponential = function(e, t) {
  var r, n = this, a = n.constructor;
  return e === void 0 ? r = qi(n, !0) : (fn(e, 0, io), t === void 0 ? t = a.rounding : fn(t, 0, 8), n = Fe(new a(n), e + 1, t), r = qi(n, !0, e + 1)), r;
};
ce.toFixed = function(e, t) {
  var r, n, a = this, l = a.constructor;
  return e === void 0 ? qi(a) : (fn(e, 0, io), t === void 0 ? t = l.rounding : fn(t, 0, 8), n = Fe(new l(a), e + ft(a) + 1, t), r = qi(n.abs(), !1, e + ft(n) + 1), a.isneg() && !a.isZero() ? "-" + r : r);
};
ce.toInteger = ce.toint = function() {
  var e = this, t = e.constructor;
  return Fe(new t(e), ft(e) + 1, t.rounding);
};
ce.toNumber = function() {
  return +this;
};
ce.toPower = ce.pow = function(e) {
  var t, r, n, a, l, u, c = this, f = c.constructor, d = 12, h = +(e = new f(e));
  if (!e.s) return new f(cr);
  if (c = new f(c), !c.s) {
    if (e.s < 1) throw Error(Ir + "Infinity");
    return c;
  }
  if (c.eq(cr)) return c;
  if (n = f.precision, e.eq(cr)) return Fe(c, n);
  if (t = e.e, r = e.d.length - 1, u = t >= r, l = c.s, u) {
    if ((r = h < 0 ? -h : h) <= qA) {
      for (a = new f(cr), t = Math.ceil(n / Ge + 4), Xe = !1; r % 2 && (a = a.times(c), s1(a.d, t)), r = ao(r / 2), r !== 0; )
        c = c.times(c), s1(c.d, t);
      return Xe = !0, e.s < 0 ? new f(cr).div(a) : Fe(a, n);
    }
  } else if (l < 0) throw Error(Ir + "NaN");
  return l = l < 0 && e.d[Math.max(t, r)] & 1 ? -1 : 1, c.s = 1, Xe = !1, a = e.times(Al(c, n + d)), Xe = !0, a = QA(a), a.s = l, a;
};
ce.toPrecision = function(e, t) {
  var r, n, a = this, l = a.constructor;
  return e === void 0 ? (r = ft(a), n = qi(a, r <= l.toExpNeg || r >= l.toExpPos)) : (fn(e, 1, io), t === void 0 ? t = l.rounding : fn(t, 0, 8), a = Fe(new l(a), e, t), r = ft(a), n = qi(a, e <= r || r <= l.toExpNeg, e)), n;
};
ce.toSignificantDigits = ce.tosd = function(e, t) {
  var r = this, n = r.constructor;
  return e === void 0 ? (e = n.precision, t = n.rounding) : (fn(e, 1, io), t === void 0 ? t = n.rounding : fn(t, 0, 8)), Fe(new n(r), e, t);
};
ce.toString = ce.valueOf = ce.val = ce.toJSON = ce[Symbol.for("nodejs.util.inspect.custom")] = function() {
  var e = this, t = ft(e), r = e.constructor;
  return qi(e, t <= r.toExpNeg || t >= r.toExpPos);
};
function XA(e, t) {
  var r, n, a, l, u, c, f, d, h = e.constructor, p = h.precision;
  if (!e.s || !t.s)
    return t.s || (t = new h(e)), Xe ? Fe(t, p) : t;
  if (f = e.d, d = t.d, u = e.e, a = t.e, f = f.slice(), l = u - a, l) {
    for (l < 0 ? (n = f, l = -l, c = d.length) : (n = d, a = u, c = f.length), u = Math.ceil(p / Ge), c = u > c ? u + 1 : c + 1, l > c && (l = c, n.length = 1), n.reverse(); l--; ) n.push(0);
    n.reverse();
  }
  for (c = f.length, l = d.length, c - l < 0 && (l = c, n = d, d = f, f = n), r = 0; l; )
    r = (f[--l] = f[l] + d[l] + r) / Ot | 0, f[l] %= Ot;
  for (r && (f.unshift(r), ++a), c = f.length; f[--c] == 0; ) f.pop();
  return t.d = f, t.e = a, Xe ? Fe(t, p) : t;
}
function fn(e, t, r) {
  if (e !== ~~e || e < t || e > r)
    throw Error(Ui + e);
}
function nn(e) {
  var t, r, n, a = e.length - 1, l = "", u = e[0];
  if (a > 0) {
    for (l += u, t = 1; t < a; t++)
      n = e[t] + "", r = Ge - n.length, r && (l += ai(r)), l += n;
    u = e[t], n = u + "", r = Ge - n.length, r && (l += ai(r));
  } else if (u === 0)
    return "0";
  for (; u % 10 === 0; ) u /= 10;
  return l + u;
}
var kn = /* @__PURE__ */ (function() {
  function e(n, a) {
    var l, u = 0, c = n.length;
    for (n = n.slice(); c--; )
      l = n[c] * a + u, n[c] = l % Ot | 0, u = l / Ot | 0;
    return u && n.unshift(u), n;
  }
  function t(n, a, l, u) {
    var c, f;
    if (l != u)
      f = l > u ? 1 : -1;
    else
      for (c = f = 0; c < l; c++)
        if (n[c] != a[c]) {
          f = n[c] > a[c] ? 1 : -1;
          break;
        }
    return f;
  }
  function r(n, a, l) {
    for (var u = 0; l--; )
      n[l] -= u, u = n[l] < a[l] ? 1 : 0, n[l] = u * Ot + n[l] - a[l];
    for (; !n[0] && n.length > 1; ) n.shift();
  }
  return function(n, a, l, u) {
    var c, f, d, h, p, y, b, w, P, S, O, k, I, E, _, C, R, W, V = n.constructor, K = n.s == a.s ? 1 : -1, G = n.d, F = a.d;
    if (!n.s) return new V(n);
    if (!a.s) throw Error(Ir + "Division by zero");
    for (f = n.e - a.e, R = F.length, _ = G.length, b = new V(K), w = b.d = [], d = 0; F[d] == (G[d] || 0); ) ++d;
    if (F[d] > (G[d] || 0) && --f, l == null ? k = l = V.precision : u ? k = l + (ft(n) - ft(a)) + 1 : k = l, k < 0) return new V(0);
    if (k = k / Ge + 2 | 0, d = 0, R == 1)
      for (h = 0, F = F[0], k++; (d < _ || h) && k--; d++)
        I = h * Ot + (G[d] || 0), w[d] = I / F | 0, h = I % F | 0;
    else {
      for (h = Ot / (F[0] + 1) | 0, h > 1 && (F = e(F, h), G = e(G, h), R = F.length, _ = G.length), E = R, P = G.slice(0, R), S = P.length; S < R; ) P[S++] = 0;
      W = F.slice(), W.unshift(0), C = F[0], F[1] >= Ot / 2 && ++C;
      do
        h = 0, c = t(F, P, R, S), c < 0 ? (O = P[0], R != S && (O = O * Ot + (P[1] || 0)), h = O / C | 0, h > 1 ? (h >= Ot && (h = Ot - 1), p = e(F, h), y = p.length, S = P.length, c = t(p, P, y, S), c == 1 && (h--, r(p, R < y ? W : F, y))) : (h == 0 && (c = h = 1), p = F.slice()), y = p.length, y < S && p.unshift(0), r(P, p, S), c == -1 && (S = P.length, c = t(F, P, R, S), c < 1 && (h++, r(P, R < S ? W : F, S))), S = P.length) : c === 0 && (h++, P = [0]), w[d++] = h, c && P[0] ? P[S++] = G[E] || 0 : (P = [G[E]], S = 1);
      while ((E++ < _ || P[0] !== void 0) && k--);
    }
    return w[0] || w.shift(), b.e = f, Fe(b, u ? l + ft(b) + 1 : l);
  };
})();
function QA(e, t) {
  var r, n, a, l, u, c, f = 0, d = 0, h = e.constructor, p = h.precision;
  if (ft(e) > 16) throw Error(Mp + ft(e));
  if (!e.s) return new h(cr);
  for (Xe = !1, c = p, u = new h(0.03125); e.abs().gte(0.1); )
    e = e.times(u), d += 5;
  for (n = Math.log(Ni(2, d)) / Math.LN10 * 2 + 5 | 0, c += n, r = a = l = new h(cr), h.precision = c; ; ) {
    if (a = Fe(a.times(e), c), r = r.times(++f), u = l.plus(kn(a, r, c)), nn(u.d).slice(0, c) === nn(l.d).slice(0, c)) {
      for (; d--; ) l = Fe(l.times(l), c);
      return h.precision = p, t == null ? (Xe = !0, Fe(l, p)) : l;
    }
    l = u;
  }
}
function ft(e) {
  for (var t = e.e * Ge, r = e.d[0]; r >= 10; r /= 10) t++;
  return t;
}
function zv(e, t, r) {
  if (t > e.LN10.sd())
    throw Xe = !0, r && (e.precision = r), Error(Ir + "LN10 precision limit exceeded");
  return Fe(new e(e.LN10), t);
}
function ai(e) {
  for (var t = ""; e--; ) t += "0";
  return t;
}
function Al(e, t) {
  var r, n, a, l, u, c, f, d, h, p = 1, y = 10, b = e, w = b.d, P = b.constructor, S = P.precision;
  if (b.s < 1) throw Error(Ir + (b.s ? "NaN" : "-Infinity"));
  if (b.eq(cr)) return new P(0);
  if (t == null ? (Xe = !1, d = S) : d = t, b.eq(10))
    return t == null && (Xe = !0), zv(P, d);
  if (d += y, P.precision = d, r = nn(w), n = r.charAt(0), l = ft(b), Math.abs(l) < 15e14) {
    for (; n < 7 && n != 1 || n == 1 && r.charAt(1) > 3; )
      b = b.times(e), r = nn(b.d), n = r.charAt(0), p++;
    l = ft(b), n > 1 ? (b = new P("0." + r), l++) : b = new P(n + "." + r.slice(1));
  } else
    return f = zv(P, d + 2, S).times(l + ""), b = Al(new P(n + "." + r.slice(1)), d - y).plus(f), P.precision = S, t == null ? (Xe = !0, Fe(b, S)) : b;
  for (c = u = b = kn(b.minus(cr), b.plus(cr), d), h = Fe(b.times(b), d), a = 3; ; ) {
    if (u = Fe(u.times(h), d), f = c.plus(kn(u, new P(a), d)), nn(f.d).slice(0, d) === nn(c.d).slice(0, d))
      return c = c.times(2), l !== 0 && (c = c.plus(zv(P, d + 2, S).times(l + ""))), c = kn(c, new P(p), d), P.precision = S, t == null ? (Xe = !0, Fe(c, S)) : c;
    c = f, a += 2;
  }
}
function u1(e, t) {
  var r, n, a;
  for ((r = t.indexOf(".")) > -1 && (t = t.replace(".", "")), (n = t.search(/e/i)) > 0 ? (r < 0 && (r = n), r += +t.slice(n + 1), t = t.substring(0, n)) : r < 0 && (r = t.length), n = 0; t.charCodeAt(n) === 48; ) ++n;
  for (a = t.length; t.charCodeAt(a - 1) === 48; ) --a;
  if (t = t.slice(n, a), t) {
    if (a -= n, r = r - n - 1, e.e = ao(r / Ge), e.d = [], n = (r + 1) % Ge, r < 0 && (n += Ge), n < a) {
      for (n && e.d.push(+t.slice(0, n)), a -= Ge; n < a; ) e.d.push(+t.slice(n, n += Ge));
      t = t.slice(n), n = Ge - t.length;
    } else
      n -= a;
    for (; n--; ) t += "0";
    if (e.d.push(+t), Xe && (e.e > rc || e.e < -rc)) throw Error(Mp + r);
  } else
    e.s = 0, e.e = 0, e.d = [0];
  return e;
}
function Fe(e, t, r) {
  var n, a, l, u, c, f, d, h, p = e.d;
  for (u = 1, l = p[0]; l >= 10; l /= 10) u++;
  if (n = t - u, n < 0)
    n += Ge, a = t, d = p[h = 0];
  else {
    if (h = Math.ceil((n + 1) / Ge), l = p.length, h >= l) return e;
    for (d = l = p[h], u = 1; l >= 10; l /= 10) u++;
    n %= Ge, a = n - Ge + u;
  }
  if (r !== void 0 && (l = Ni(10, u - a - 1), c = d / l % 10 | 0, f = t < 0 || p[h + 1] !== void 0 || d % l, f = r < 4 ? (c || f) && (r == 0 || r == (e.s < 0 ? 3 : 2)) : c > 5 || c == 5 && (r == 4 || f || r == 6 && // Check whether the digit to the left of the rounding digit is odd.
  (n > 0 ? a > 0 ? d / Ni(10, u - a) : 0 : p[h - 1]) % 10 & 1 || r == (e.s < 0 ? 8 : 7))), t < 1 || !p[0])
    return f ? (l = ft(e), p.length = 1, t = t - l - 1, p[0] = Ni(10, (Ge - t % Ge) % Ge), e.e = ao(-t / Ge) || 0) : (p.length = 1, p[0] = e.e = e.s = 0), e;
  if (n == 0 ? (p.length = h, l = 1, h--) : (p.length = h + 1, l = Ni(10, Ge - n), p[h] = a > 0 ? (d / Ni(10, u - a) % Ni(10, a) | 0) * l : 0), f)
    for (; ; )
      if (h == 0) {
        (p[0] += l) == Ot && (p[0] = 1, ++e.e);
        break;
      } else {
        if (p[h] += l, p[h] != Ot) break;
        p[h--] = 0, l = 1;
      }
  for (n = p.length; p[--n] === 0; ) p.pop();
  if (Xe && (e.e > rc || e.e < -rc))
    throw Error(Mp + ft(e));
  return e;
}
function ZA(e, t) {
  var r, n, a, l, u, c, f, d, h, p, y = e.constructor, b = y.precision;
  if (!e.s || !t.s)
    return t.s ? t.s = -t.s : t = new y(e), Xe ? Fe(t, b) : t;
  if (f = e.d, p = t.d, n = t.e, d = e.e, f = f.slice(), u = d - n, u) {
    for (h = u < 0, h ? (r = f, u = -u, c = p.length) : (r = p, n = d, c = f.length), a = Math.max(Math.ceil(b / Ge), c) + 2, u > a && (u = a, r.length = 1), r.reverse(), a = u; a--; ) r.push(0);
    r.reverse();
  } else {
    for (a = f.length, c = p.length, h = a < c, h && (c = a), a = 0; a < c; a++)
      if (f[a] != p[a]) {
        h = f[a] < p[a];
        break;
      }
    u = 0;
  }
  for (h && (r = f, f = p, p = r, t.s = -t.s), c = f.length, a = p.length - c; a > 0; --a) f[c++] = 0;
  for (a = p.length; a > u; ) {
    if (f[--a] < p[a]) {
      for (l = a; l && f[--l] === 0; ) f[l] = Ot - 1;
      --f[l], f[a] += Ot;
    }
    f[a] -= p[a];
  }
  for (; f[--c] === 0; ) f.pop();
  for (; f[0] === 0; f.shift()) --n;
  return f[0] ? (t.d = f, t.e = n, Xe ? Fe(t, b) : t) : new y(0);
}
function qi(e, t, r) {
  var n, a = ft(e), l = nn(e.d), u = l.length;
  return t ? (r && (n = r - u) > 0 ? l = l.charAt(0) + "." + l.slice(1) + ai(n) : u > 1 && (l = l.charAt(0) + "." + l.slice(1)), l = l + (a < 0 ? "e" : "e+") + a) : a < 0 ? (l = "0." + ai(-a - 1) + l, r && (n = r - u) > 0 && (l += ai(n))) : a >= u ? (l += ai(a + 1 - u), r && (n = r - a - 1) > 0 && (l = l + "." + ai(n))) : ((n = a + 1) < u && (l = l.slice(0, n) + "." + l.slice(n)), r && (n = r - u) > 0 && (a + 1 === u && (l += "."), l += ai(n))), e.s < 0 ? "-" + l : l;
}
function s1(e, t) {
  if (e.length > t)
    return e.length = t, !0;
}
function JA(e) {
  var t, r, n;
  function a(l) {
    var u = this;
    if (!(u instanceof a)) return new a(l);
    if (u.constructor = a, l instanceof a) {
      u.s = l.s, u.e = l.e, u.d = (l = l.d) ? l.slice() : l;
      return;
    }
    if (typeof l == "number") {
      if (l * 0 !== 0)
        throw Error(Ui + l);
      if (l > 0)
        u.s = 1;
      else if (l < 0)
        l = -l, u.s = -1;
      else {
        u.s = 0, u.e = 0, u.d = [0];
        return;
      }
      if (l === ~~l && l < 1e7) {
        u.e = 0, u.d = [l];
        return;
      }
      return u1(u, l.toString());
    } else if (typeof l != "string")
      throw Error(Ui + l);
    if (l.charCodeAt(0) === 45 ? (l = l.slice(1), u.s = -1) : u.s = 1, gR.test(l)) u1(u, l);
    else throw Error(Ui + l);
  }
  if (a.prototype = ce, a.ROUND_UP = 0, a.ROUND_DOWN = 1, a.ROUND_CEIL = 2, a.ROUND_FLOOR = 3, a.ROUND_HALF_UP = 4, a.ROUND_HALF_DOWN = 5, a.ROUND_HALF_EVEN = 6, a.ROUND_HALF_CEIL = 7, a.ROUND_HALF_FLOOR = 8, a.clone = JA, a.config = a.set = xR, e === void 0 && (e = {}), e)
    for (n = ["precision", "rounding", "toExpNeg", "toExpPos", "LN10"], t = 0; t < n.length; ) e.hasOwnProperty(r = n[t++]) || (e[r] = this[r]);
  return a.config(e), a;
}
function xR(e) {
  if (!e || typeof e != "object")
    throw Error(Ir + "Object expected");
  var t, r, n, a = [
    "precision",
    1,
    io,
    "rounding",
    0,
    8,
    "toExpNeg",
    -1 / 0,
    0,
    "toExpPos",
    0,
    1 / 0
  ];
  for (t = 0; t < a.length; t += 3)
    if ((n = e[r = a[t]]) !== void 0)
      if (ao(n) === n && n >= a[t + 1] && n <= a[t + 2]) this[r] = n;
      else throw Error(Ui + r + ": " + n);
  if ((n = e[r = "LN10"]) !== void 0)
    if (n == Math.LN10) this[r] = new this(n);
    else throw Error(Ui + r + ": " + n);
  return this;
}
var Dp = JA(yR);
cr = new Dp(1);
const Ce = Dp;
function eO(e) {
  var t;
  return e === 0 ? t = 1 : t = Math.floor(new Ce(e).abs().log(10).toNumber()) + 1, t;
}
function tO(e, t, r) {
  for (var n = new Ce(e), a = 0, l = []; n.lt(t) && a < 1e5; )
    l.push(n.toNumber()), n = n.add(r), a++;
  return l;
}
function Ol(e, t) {
  return PR(e) || SR(e, t) || wR(e, t) || bR();
}
function bR() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function wR(e, t) {
  if (e) {
    if (typeof e == "string") return c1(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? c1(e, t) : void 0;
  }
}
function c1(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function SR(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, a, l, u, c = [], f = !0, d = !1;
    try {
      if (l = (r = r.call(e)).next, t !== 0) for (; !(f = (n = l.call(r)).done) && (c.push(n.value), c.length !== t); f = !0) ;
    } catch (h) {
      d = !0, a = h;
    } finally {
      try {
        if (!f && r.return != null && (u = r.return(), Object(u) !== u)) return;
      } finally {
        if (d) throw a;
      }
    }
    return c;
  }
}
function PR(e) {
  if (Array.isArray(e)) return e;
}
var rO = (e) => {
  var t = Ol(e, 2), r = t[0], n = t[1], a = r, l = n;
  return r > n && (a = n, l = r), [a, l];
}, Np = (e, t, r) => {
  if (e.lte(0))
    return new Ce(0);
  var n = eO(e.toNumber()), a = new Ce(10).pow(n), l = e.div(a), u = n !== 1 ? 0.05 : 0.1, c = new Ce(Math.ceil(l.div(u).toNumber())).add(r).mul(u), f = c.mul(a);
  return t ? new Ce(f.toNumber()) : new Ce(Math.ceil(f.toNumber()));
}, nO = (e, t, r) => {
  var n;
  if (e.lte(0))
    return new Ce(0);
  var a = [1, 2, 2.5, 5], l = e.toNumber(), u = Math.floor(new Ce(l).abs().log(10).toNumber()), c = new Ce(10).pow(u), f = e.div(c).toNumber(), d = a.findIndex((b) => b >= f - 1e-10);
  if (d === -1 && (c = c.mul(10), d = 0), d += r, d >= a.length) {
    var h = Math.floor(d / a.length);
    d %= a.length, c = c.mul(new Ce(10).pow(h));
  }
  var p = (n = a[d]) !== null && n !== void 0 ? n : 1, y = new Ce(p).mul(c);
  return t ? y : new Ce(Math.ceil(y.toNumber()));
}, AR = (e, t, r) => {
  var n = new Ce(1), a = new Ce(e);
  if (!a.isint() && r) {
    var l = Math.abs(e);
    l < 1 ? (n = new Ce(10).pow(eO(e) - 1), a = new Ce(Math.floor(a.div(n).toNumber())).mul(n)) : l > 1 && (a = new Ce(Math.floor(e)));
  } else e === 0 ? a = new Ce(Math.floor((t - 1) / 2)) : r || (a = new Ce(Math.floor(e)));
  for (var u = Math.floor((t - 1) / 2), c = [], f = 0; f < t; f++)
    c.push(a.add(new Ce(f - u).mul(n)).toNumber());
  return c;
}, iO = function(t, r, n, a) {
  var l = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : 0, u = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : Np;
  if (!Number.isFinite((r - t) / (n - 1)))
    return {
      step: new Ce(0),
      tickMin: new Ce(0),
      tickMax: new Ce(0)
    };
  var c = u(new Ce(r).sub(t).div(n - 1), a, l), f;
  t <= 0 && r >= 0 ? f = new Ce(0) : (f = new Ce(t).add(r).div(2), f = f.sub(new Ce(f).mod(c)));
  var d = Math.ceil(f.sub(t).div(c).toNumber()), h = Math.ceil(new Ce(r).sub(f).div(c).toNumber()), p = d + h + 1;
  return p > n ? iO(t, r, n, a, l + 1, u) : (p < n && (h = r > 0 ? h + (n - p) : h, d = r > 0 ? d : d + (n - p)), {
    step: c,
    tickMin: f.sub(new Ce(d).mul(c)),
    tickMax: f.add(new Ce(h).mul(c))
  });
}, f1 = function(t) {
  var r = Ol(t, 2), n = r[0], a = r[1], l = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 6, u = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0, c = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : "auto", f = Math.max(l, 2), d = rO([n, a]), h = Ol(d, 2), p = h[0], y = h[1];
  if (p === -1 / 0 || y === 1 / 0) {
    var b = y === 1 / 0 ? [p, ...Array(l - 1).fill(1 / 0)] : [...Array(l - 1).fill(-1 / 0), y];
    return n > a ? b.reverse() : b;
  }
  if (p === y)
    return AR(p, l, u);
  var w = c === "snap125" ? nO : Np, P = iO(p, y, f, u, 0, w), S = P.step, O = P.tickMin, k = P.tickMax, I = tO(O, k.add(new Ce(0.1).mul(S)), S);
  return n > a ? I.reverse() : I;
}, d1 = function(t, r) {
  var n = Ol(t, 2), a = n[0], l = n[1], u = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0, c = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : "auto", f = rO([a, l]), d = Ol(f, 2), h = d[0], p = d[1];
  if (h === -1 / 0 || p === 1 / 0)
    return [a, l];
  if (h === p)
    return [h];
  var y = c === "snap125" ? nO : Np, b = Math.max(r, 2), w = y(new Ce(p).sub(h).div(b - 1), u, 0), P = [...tO(new Ce(h), new Ce(p), w), p];
  if (u === !1) {
    P = P.map((O) => Math.round(O));
    var S = P.length - 1;
    S > 0 && P[S] === P[S - 1] && (P = P.slice(0, S));
  }
  return a > l ? P.reverse() : P;
}, aO = (e) => e.rootProps.maxBarSize, OR = (e) => e.rootProps.barGap, oO = (e) => e.rootProps.barCategoryGap, ER = (e) => e.rootProps.barSize, Wl = (e) => e.rootProps.stackOffset, lO = (e) => e.rootProps.reverseStackOrder, $p = (e) => e.options.chartName, Rp = (e) => e.rootProps.syncId, uO = (e) => e.rootProps.syncMethod, Lp = (e) => e.options.eventEmitter, ct = {
  /**
   * CartesianGrid and PolarGrid
   */
  grid: -100,
  /**
   * Background of Bar and RadialBar.
   * This is not visible by default but can be enabled by setting background={true} on Bar or RadialBar.
   */
  barBackground: -50,
  /*
   * other chart elements or custom elements without specific zIndex
   * render in here, at zIndex 0
   */
  /**
   * Area, Pie, Radar, and ReferenceArea
   */
  area: 100,
  /**
   * Cursor is embedded inside Tooltip and controlled by it.
   * The Tooltip itself has a separate portal and is not included in the zIndex system;
   * Cursor is the decoration inside the chart area. CursorRectangle is a rectangle box.
   * It renders below bar so that in a stacked bar chart the cursor rectangle does not hide the other bars.
   */
  cursorRectangle: 200,
  /**
   * Bar and RadialBar
   */
  bar: 300,
  /**
   * Line and ReferenceLine, and ErrorBor
   */
  line: 400,
  /**
   * XAxis and YAxis and PolarAngleAxis and PolarRadiusAxis ticks and lines and children
   */
  axis: 500,
  /**
   * Scatter and ReferenceDot,
   * and Dots of Line and Area and Radar if they have dot=true
   */
  scatter: 600,
  /**
   * Hovering over a Bar or RadialBar renders a highlight rectangle
   */
  activeBar: 1e3,
  /**
   * Cursor is embedded inside Tooltip and controlled by it.
   * The Tooltip itself has a separate portal and is not included in the zIndex system;
   * Cursor is the decoration inside the chart area, usually a cross or a box.
   * CursorLine is a line cursor rendered in Line, Area, Scatter, Radar charts.
   * It renders above the Line and Scatter so that it is always visible.
   * It renders below active dot so that the dot is always visible and shows the current point.
   * We're also assuming that the active dot is small enough that it does not fully cover the cursor line.
   *
   * This also applies to the radial cursor in RadialBarChart.
   */
  cursorLine: 1100,
  /**
   * Hovering over a Point in Line, Area, Scatter, Radar renders a highlight dot
   */
  activeDot: 1200,
  /**
   * LabelList and Label, including Axis labels
   */
  label: 2e3
}, ji = {
  allowDecimals: !1,
  // if I set this to false then Tooltip synchronisation stops working in Radar, wtf
  allowDataOverflow: !1,
  angleAxisId: 0,
  reversed: !1,
  scale: "auto",
  tick: !0,
  type: "auto"
}, en = {
  allowDataOverflow: !1,
  allowDecimals: !1,
  allowDuplicatedCategory: !0,
  includeHidden: !1,
  radiusAxisId: 0,
  reversed: !1,
  scale: "auto",
  tick: !0,
  tickCount: 5,
  type: "auto"
}, Xc = (e, t) => {
  if (!(!e || !t))
    return e != null && e.reversed ? [t[1], t[0]] : t;
};
function Qc(e, t, r) {
  if (r !== "auto")
    return r;
  if (e != null)
    return Mn(e, t) ? "category" : "number";
}
function v1(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function nc(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? v1(Object(r), !0).forEach(function(n) {
      kR(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : v1(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function kR(e, t, r) {
  return (t = CR(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function CR(e) {
  var t = IR(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function IR(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var h1 = {
  allowDataOverflow: ji.allowDataOverflow,
  allowDecimals: ji.allowDecimals,
  allowDuplicatedCategory: !1,
  // defaultPolarAngleAxisProps.allowDuplicatedCategory has it set to true but the actual axis rendering ignores the prop because reasons,
  dataKey: void 0,
  domain: void 0,
  id: ji.angleAxisId,
  includeHidden: !1,
  name: void 0,
  reversed: ji.reversed,
  scale: ji.scale,
  tick: ji.tick,
  tickCount: void 0,
  ticks: void 0,
  type: ji.type,
  unit: void 0,
  niceTicks: "auto"
}, p1 = {
  allowDataOverflow: en.allowDataOverflow,
  allowDecimals: en.allowDecimals,
  allowDuplicatedCategory: en.allowDuplicatedCategory,
  dataKey: void 0,
  domain: void 0,
  id: en.radiusAxisId,
  includeHidden: en.includeHidden,
  name: void 0,
  reversed: en.reversed,
  scale: en.scale,
  tick: en.tick,
  tickCount: en.tickCount,
  ticks: void 0,
  type: en.type,
  unit: void 0,
  niceTicks: "auto"
}, jR = (e, t) => {
  if (t != null)
    return e.polarAxis.angleAxis[t];
}, zp = $([jR, jp], (e, t) => {
  var r;
  if (e != null)
    return e;
  var n = (r = Qc(t, "angleAxis", h1.type)) !== null && r !== void 0 ? r : "category";
  return nc(nc({}, h1), {}, {
    type: n
  });
}), _R = (e, t) => e.polarAxis.radiusAxis[t], Bp = $([_R, jp], (e, t) => {
  var r;
  if (e != null)
    return e;
  var n = (r = Qc(t, "radiusAxis", p1.type)) !== null && r !== void 0 ? r : "category";
  return nc(nc({}, p1), {}, {
    type: n
  });
}), Zc = (e) => e.polarOptions, Fp = $([dn, vn, xt], UA), sO = $([Zc, Fp], (e, t) => {
  if (e != null)
    return Wt(e.innerRadius, t, 0);
}), cO = $([Zc, Fp], (e, t) => {
  if (e != null)
    return Wt(e.outerRadius, t, t * 0.8);
}), TR = (e) => {
  if (e == null)
    return [0, 0];
  var t = e.startAngle, r = e.endAngle;
  return [t, r];
}, fO = $([Zc], TR);
$([zp, fO], Xc);
var dO = $([Fp, sO, cO], (e, t, r) => {
  if (!(e == null || t == null || r == null))
    return [t, r];
});
$([Bp, dO], Xc);
var vO = $([Ne, Zc, sO, cO, dn, vn], (e, t, r, n, a, l) => {
  if (!(e !== "centric" && e !== "radial" || t == null || r == null || n == null)) {
    var u = t.cx, c = t.cy, f = t.startAngle, d = t.endAngle;
    return {
      cx: Wt(u, a, a / 2),
      cy: Wt(c, l, l / 2),
      innerRadius: r,
      outerRadius: n,
      startAngle: f,
      endAngle: d,
      clockWise: !1
      // this property look useful, why not use it?
    };
  }
}), et = (e, t) => t, Ul = (e, t, r) => r;
function Wp(e) {
  return e == null ? void 0 : e.id;
}
function hO(e, t, r) {
  var n = t.chartData, a = n === void 0 ? [] : n, l = r.allowDuplicatedCategory, u = r.dataKey, c = /* @__PURE__ */ new Map();
  return e.forEach((f) => {
    var d, h = (d = f.data) !== null && d !== void 0 ? d : a;
    if (!(h == null || h.length === 0)) {
      var p = Wp(f);
      h.forEach((y, b) => {
        var w = u == null || l ? b : String(Le(y, u, null)), P = Le(y, f.dataKey, 0), S;
        c.has(w) ? S = c.get(w) : S = {}, Object.assign(S, {
          [p]: P
        }), c.set(w, S);
      });
    }
  }), Array.from(c.values());
}
function Jc(e) {
  return "stackId" in e && e.stackId != null && e.dataKey != null;
}
var Kl = (e, t) => e === t ? !0 : e == null || t == null ? !1 : e[0] === t[0] && e[1] === t[1];
function ef(e, t) {
  return Array.isArray(e) && Array.isArray(t) && e.length === 0 && t.length === 0 ? !0 : e === t;
}
function MR(e, t) {
  if (e.length === t.length) {
    for (var r = 0; r < e.length; r++)
      if (e[r] !== t[r])
        return !1;
    return !0;
  }
  return !1;
}
var kt = (e) => {
  var t = Ne(e);
  return t === "horizontal" ? "xAxis" : t === "vertical" ? "yAxis" : t === "centric" ? "angleAxis" : "radiusAxis";
}, oo = (e) => e.tooltip.settings.axisId;
function Up(e) {
  if (e != null) {
    var t = e.ticks, r = e.bandwidth, n = e.range(), a = [Math.min(...n), Math.max(...n)];
    return {
      domain: () => e.domain(),
      range: (function(l) {
        function u() {
          return l.apply(this, arguments);
        }
        return u.toString = function() {
          return l.toString();
        }, u;
      })(() => a),
      rangeMin: () => a[0],
      rangeMax: () => a[1],
      isInRange(l) {
        var u = a[0], c = a[1];
        return u <= c ? l >= u && l <= c : l >= c && l <= u;
      },
      bandwidth: r ? () => r.call(e) : void 0,
      ticks: t ? (l) => t.call(e, l) : void 0,
      map: (l, u) => {
        var c = e(l);
        if (c != null) {
          if (e.bandwidth && u !== null && u !== void 0 && u.position) {
            var f = e.bandwidth();
            switch (u.position) {
              case "middle":
                c += f / 2;
                break;
              case "end":
                c += f;
                break;
            }
          }
          return c;
        }
      }
    };
  }
}
var pO = (e, t) => {
  if (t != null)
    switch (e) {
      case "linear": {
        if (!an(t)) {
          for (var r, n, a = 0; a < t.length; a++) {
            var l = t[a];
            Ie(l) && ((r === void 0 || l < r) && (r = l), (n === void 0 || l > n) && (n = l));
          }
          return r !== void 0 && n !== void 0 ? [r, n] : void 0;
        }
        return t;
      }
      default:
        return t;
    }
};
function ui(e, t) {
  return e == null || t == null ? NaN : e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function DR(e, t) {
  return e == null || t == null ? NaN : t < e ? -1 : t > e ? 1 : t >= e ? 0 : NaN;
}
function Kp(e) {
  let t, r, n;
  e.length !== 2 ? (t = ui, r = (c, f) => ui(e(c), f), n = (c, f) => e(c) - f) : (t = e === ui || e === DR ? e : NR, r = e, n = e);
  function a(c, f, d = 0, h = c.length) {
    if (d < h) {
      if (t(f, f) !== 0) return h;
      do {
        const p = d + h >>> 1;
        r(c[p], f) < 0 ? d = p + 1 : h = p;
      } while (d < h);
    }
    return d;
  }
  function l(c, f, d = 0, h = c.length) {
    if (d < h) {
      if (t(f, f) !== 0) return h;
      do {
        const p = d + h >>> 1;
        r(c[p], f) <= 0 ? d = p + 1 : h = p;
      } while (d < h);
    }
    return d;
  }
  function u(c, f, d = 0, h = c.length) {
    const p = a(c, f, d, h - 1);
    return p > d && n(c[p - 1], f) > -n(c[p], f) ? p - 1 : p;
  }
  return { left: a, center: u, right: l };
}
function NR() {
  return 0;
}
function mO(e) {
  return e === null ? NaN : +e;
}
function* $R(e, t) {
  for (let r of e)
    r != null && (r = +r) >= r && (yield r);
}
const RR = Kp(ui), Hl = RR.right;
Kp(mO).center;
class m1 extends Map {
  constructor(t, r = BR) {
    if (super(), Object.defineProperties(this, { _intern: { value: /* @__PURE__ */ new Map() }, _key: { value: r } }), t != null) for (const [n, a] of t) this.set(n, a);
  }
  get(t) {
    return super.get(y1(this, t));
  }
  has(t) {
    return super.has(y1(this, t));
  }
  set(t, r) {
    return super.set(LR(this, t), r);
  }
  delete(t) {
    return super.delete(zR(this, t));
  }
}
function y1({ _intern: e, _key: t }, r) {
  const n = t(r);
  return e.has(n) ? e.get(n) : r;
}
function LR({ _intern: e, _key: t }, r) {
  const n = t(r);
  return e.has(n) ? e.get(n) : (e.set(n, r), r);
}
function zR({ _intern: e, _key: t }, r) {
  const n = t(r);
  return e.has(n) && (r = e.get(n), e.delete(n)), r;
}
function BR(e) {
  return e !== null && typeof e == "object" ? e.valueOf() : e;
}
function FR(e = ui) {
  if (e === ui) return yO;
  if (typeof e != "function") throw new TypeError("compare is not a function");
  return (t, r) => {
    const n = e(t, r);
    return n || n === 0 ? n : (e(r, r) === 0) - (e(t, t) === 0);
  };
}
function yO(e, t) {
  return (e == null || !(e >= e)) - (t == null || !(t >= t)) || (e < t ? -1 : e > t ? 1 : 0);
}
const WR = Math.sqrt(50), UR = Math.sqrt(10), KR = Math.sqrt(2);
function ic(e, t, r) {
  const n = (t - e) / Math.max(0, r), a = Math.floor(Math.log10(n)), l = n / Math.pow(10, a), u = l >= WR ? 10 : l >= UR ? 5 : l >= KR ? 2 : 1;
  let c, f, d;
  return a < 0 ? (d = Math.pow(10, -a) / u, c = Math.round(e * d), f = Math.round(t * d), c / d < e && ++c, f / d > t && --f, d = -d) : (d = Math.pow(10, a) * u, c = Math.round(e / d), f = Math.round(t / d), c * d < e && ++c, f * d > t && --f), f < c && 0.5 <= r && r < 2 ? ic(e, t, r * 2) : [c, f, d];
}
function Th(e, t, r) {
  if (t = +t, e = +e, r = +r, !(r > 0)) return [];
  if (e === t) return [e];
  const n = t < e, [a, l, u] = n ? ic(t, e, r) : ic(e, t, r);
  if (!(l >= a)) return [];
  const c = l - a + 1, f = new Array(c);
  if (n)
    if (u < 0) for (let d = 0; d < c; ++d) f[d] = (l - d) / -u;
    else for (let d = 0; d < c; ++d) f[d] = (l - d) * u;
  else if (u < 0) for (let d = 0; d < c; ++d) f[d] = (a + d) / -u;
  else for (let d = 0; d < c; ++d) f[d] = (a + d) * u;
  return f;
}
function Mh(e, t, r) {
  return t = +t, e = +e, r = +r, ic(e, t, r)[2];
}
function Dh(e, t, r) {
  t = +t, e = +e, r = +r;
  const n = t < e, a = n ? Mh(t, e, r) : Mh(e, t, r);
  return (n ? -1 : 1) * (a < 0 ? 1 / -a : a);
}
function g1(e, t) {
  let r;
  for (const n of e)
    n != null && (r < n || r === void 0 && n >= n) && (r = n);
  return r;
}
function x1(e, t) {
  let r;
  for (const n of e)
    n != null && (r > n || r === void 0 && n >= n) && (r = n);
  return r;
}
function gO(e, t, r = 0, n = 1 / 0, a) {
  if (t = Math.floor(t), r = Math.floor(Math.max(0, r)), n = Math.floor(Math.min(e.length - 1, n)), !(r <= t && t <= n)) return e;
  for (a = a === void 0 ? yO : FR(a); n > r; ) {
    if (n - r > 600) {
      const f = n - r + 1, d = t - r + 1, h = Math.log(f), p = 0.5 * Math.exp(2 * h / 3), y = 0.5 * Math.sqrt(h * p * (f - p) / f) * (d - f / 2 < 0 ? -1 : 1), b = Math.max(r, Math.floor(t - d * p / f + y)), w = Math.min(n, Math.floor(t + (f - d) * p / f + y));
      gO(e, t, b, w, a);
    }
    const l = e[t];
    let u = r, c = n;
    for (ll(e, r, t), a(e[n], l) > 0 && ll(e, r, n); u < c; ) {
      for (ll(e, u, c), ++u, --c; a(e[u], l) < 0; ) ++u;
      for (; a(e[c], l) > 0; ) --c;
    }
    a(e[r], l) === 0 ? ll(e, r, c) : (++c, ll(e, c, n)), c <= t && (r = c + 1), t <= c && (n = c - 1);
  }
  return e;
}
function ll(e, t, r) {
  const n = e[t];
  e[t] = e[r], e[r] = n;
}
function HR(e, t, r) {
  if (e = Float64Array.from($R(e)), !(!(n = e.length) || isNaN(t = +t))) {
    if (t <= 0 || n < 2) return x1(e);
    if (t >= 1) return g1(e);
    var n, a = (n - 1) * t, l = Math.floor(a), u = g1(gO(e, l).subarray(0, l + 1)), c = x1(e.subarray(l + 1));
    return u + (c - u) * (a - l);
  }
}
function VR(e, t, r = mO) {
  if (!(!(n = e.length) || isNaN(t = +t))) {
    if (t <= 0 || n < 2) return +r(e[0], 0, e);
    if (t >= 1) return +r(e[n - 1], n - 1, e);
    var n, a = (n - 1) * t, l = Math.floor(a), u = +r(e[l], l, e), c = +r(e[l + 1], l + 1, e);
    return u + (c - u) * (a - l);
  }
}
function GR(e, t, r) {
  e = +e, t = +t, r = (a = arguments.length) < 2 ? (t = e, e = 0, 1) : a < 3 ? 1 : +r;
  for (var n = -1, a = Math.max(0, Math.ceil((t - e) / r)) | 0, l = new Array(a); ++n < a; )
    l[n] = e + n * r;
  return l;
}
function jr(e, t) {
  switch (arguments.length) {
    case 0:
      break;
    case 1:
      this.range(e);
      break;
    default:
      this.range(t).domain(e);
      break;
  }
  return this;
}
function Dn(e, t) {
  switch (arguments.length) {
    case 0:
      break;
    case 1: {
      typeof e == "function" ? this.interpolator(e) : this.range(e);
      break;
    }
    default: {
      this.domain(e), typeof t == "function" ? this.interpolator(t) : this.range(t);
      break;
    }
  }
  return this;
}
const Nh = Symbol("implicit");
function Hp() {
  var e = new m1(), t = [], r = [], n = Nh;
  function a(l) {
    let u = e.get(l);
    if (u === void 0) {
      if (n !== Nh) return n;
      e.set(l, u = t.push(l) - 1);
    }
    return r[u % r.length];
  }
  return a.domain = function(l) {
    if (!arguments.length) return t.slice();
    t = [], e = new m1();
    for (const u of l)
      e.has(u) || e.set(u, t.push(u) - 1);
    return a;
  }, a.range = function(l) {
    return arguments.length ? (r = Array.from(l), a) : r.slice();
  }, a.unknown = function(l) {
    return arguments.length ? (n = l, a) : n;
  }, a.copy = function() {
    return Hp(t, r).unknown(n);
  }, jr.apply(a, arguments), a;
}
function Vp() {
  var e = Hp().unknown(void 0), t = e.domain, r = e.range, n = 0, a = 1, l, u, c = !1, f = 0, d = 0, h = 0.5;
  delete e.unknown;
  function p() {
    var y = t().length, b = a < n, w = b ? a : n, P = b ? n : a;
    l = (P - w) / Math.max(1, y - f + d * 2), c && (l = Math.floor(l)), w += (P - w - l * (y - f)) * h, u = l * (1 - f), c && (w = Math.round(w), u = Math.round(u));
    var S = GR(y).map(function(O) {
      return w + l * O;
    });
    return r(b ? S.reverse() : S);
  }
  return e.domain = function(y) {
    return arguments.length ? (t(y), p()) : t();
  }, e.range = function(y) {
    return arguments.length ? ([n, a] = y, n = +n, a = +a, p()) : [n, a];
  }, e.rangeRound = function(y) {
    return [n, a] = y, n = +n, a = +a, c = !0, p();
  }, e.bandwidth = function() {
    return u;
  }, e.step = function() {
    return l;
  }, e.round = function(y) {
    return arguments.length ? (c = !!y, p()) : c;
  }, e.padding = function(y) {
    return arguments.length ? (f = Math.min(1, d = +y), p()) : f;
  }, e.paddingInner = function(y) {
    return arguments.length ? (f = Math.min(1, y), p()) : f;
  }, e.paddingOuter = function(y) {
    return arguments.length ? (d = +y, p()) : d;
  }, e.align = function(y) {
    return arguments.length ? (h = Math.max(0, Math.min(1, y)), p()) : h;
  }, e.copy = function() {
    return Vp(t(), [n, a]).round(c).paddingInner(f).paddingOuter(d).align(h);
  }, jr.apply(p(), arguments);
}
function xO(e) {
  var t = e.copy;
  return e.padding = e.paddingOuter, delete e.paddingInner, delete e.paddingOuter, e.copy = function() {
    return xO(t());
  }, e;
}
function YR() {
  return xO(Vp.apply(null, arguments).paddingInner(1));
}
function Gp(e, t, r) {
  e.prototype = t.prototype = r, r.constructor = e;
}
function bO(e, t) {
  var r = Object.create(e.prototype);
  for (var n in t) r[n] = t[n];
  return r;
}
function Vl() {
}
var El = 0.7, ac = 1 / El, Ua = "\\s*([+-]?\\d+)\\s*", kl = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", on = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", qR = /^#([0-9a-f]{3,8})$/, XR = new RegExp(`^rgb\\(${Ua},${Ua},${Ua}\\)$`), QR = new RegExp(`^rgb\\(${on},${on},${on}\\)$`), ZR = new RegExp(`^rgba\\(${Ua},${Ua},${Ua},${kl}\\)$`), JR = new RegExp(`^rgba\\(${on},${on},${on},${kl}\\)$`), eL = new RegExp(`^hsl\\(${kl},${on},${on}\\)$`), tL = new RegExp(`^hsla\\(${kl},${on},${on},${kl}\\)$`), b1 = {
  aliceblue: 15792383,
  antiquewhite: 16444375,
  aqua: 65535,
  aquamarine: 8388564,
  azure: 15794175,
  beige: 16119260,
  bisque: 16770244,
  black: 0,
  blanchedalmond: 16772045,
  blue: 255,
  blueviolet: 9055202,
  brown: 10824234,
  burlywood: 14596231,
  cadetblue: 6266528,
  chartreuse: 8388352,
  chocolate: 13789470,
  coral: 16744272,
  cornflowerblue: 6591981,
  cornsilk: 16775388,
  crimson: 14423100,
  cyan: 65535,
  darkblue: 139,
  darkcyan: 35723,
  darkgoldenrod: 12092939,
  darkgray: 11119017,
  darkgreen: 25600,
  darkgrey: 11119017,
  darkkhaki: 12433259,
  darkmagenta: 9109643,
  darkolivegreen: 5597999,
  darkorange: 16747520,
  darkorchid: 10040012,
  darkred: 9109504,
  darksalmon: 15308410,
  darkseagreen: 9419919,
  darkslateblue: 4734347,
  darkslategray: 3100495,
  darkslategrey: 3100495,
  darkturquoise: 52945,
  darkviolet: 9699539,
  deeppink: 16716947,
  deepskyblue: 49151,
  dimgray: 6908265,
  dimgrey: 6908265,
  dodgerblue: 2003199,
  firebrick: 11674146,
  floralwhite: 16775920,
  forestgreen: 2263842,
  fuchsia: 16711935,
  gainsboro: 14474460,
  ghostwhite: 16316671,
  gold: 16766720,
  goldenrod: 14329120,
  gray: 8421504,
  green: 32768,
  greenyellow: 11403055,
  grey: 8421504,
  honeydew: 15794160,
  hotpink: 16738740,
  indianred: 13458524,
  indigo: 4915330,
  ivory: 16777200,
  khaki: 15787660,
  lavender: 15132410,
  lavenderblush: 16773365,
  lawngreen: 8190976,
  lemonchiffon: 16775885,
  lightblue: 11393254,
  lightcoral: 15761536,
  lightcyan: 14745599,
  lightgoldenrodyellow: 16448210,
  lightgray: 13882323,
  lightgreen: 9498256,
  lightgrey: 13882323,
  lightpink: 16758465,
  lightsalmon: 16752762,
  lightseagreen: 2142890,
  lightskyblue: 8900346,
  lightslategray: 7833753,
  lightslategrey: 7833753,
  lightsteelblue: 11584734,
  lightyellow: 16777184,
  lime: 65280,
  limegreen: 3329330,
  linen: 16445670,
  magenta: 16711935,
  maroon: 8388608,
  mediumaquamarine: 6737322,
  mediumblue: 205,
  mediumorchid: 12211667,
  mediumpurple: 9662683,
  mediumseagreen: 3978097,
  mediumslateblue: 8087790,
  mediumspringgreen: 64154,
  mediumturquoise: 4772300,
  mediumvioletred: 13047173,
  midnightblue: 1644912,
  mintcream: 16121850,
  mistyrose: 16770273,
  moccasin: 16770229,
  navajowhite: 16768685,
  navy: 128,
  oldlace: 16643558,
  olive: 8421376,
  olivedrab: 7048739,
  orange: 16753920,
  orangered: 16729344,
  orchid: 14315734,
  palegoldenrod: 15657130,
  palegreen: 10025880,
  paleturquoise: 11529966,
  palevioletred: 14381203,
  papayawhip: 16773077,
  peachpuff: 16767673,
  peru: 13468991,
  pink: 16761035,
  plum: 14524637,
  powderblue: 11591910,
  purple: 8388736,
  rebeccapurple: 6697881,
  red: 16711680,
  rosybrown: 12357519,
  royalblue: 4286945,
  saddlebrown: 9127187,
  salmon: 16416882,
  sandybrown: 16032864,
  seagreen: 3050327,
  seashell: 16774638,
  sienna: 10506797,
  silver: 12632256,
  skyblue: 8900331,
  slateblue: 6970061,
  slategray: 7372944,
  slategrey: 7372944,
  snow: 16775930,
  springgreen: 65407,
  steelblue: 4620980,
  tan: 13808780,
  teal: 32896,
  thistle: 14204888,
  tomato: 16737095,
  turquoise: 4251856,
  violet: 15631086,
  wheat: 16113331,
  white: 16777215,
  whitesmoke: 16119285,
  yellow: 16776960,
  yellowgreen: 10145074
};
Gp(Vl, Cl, {
  copy(e) {
    return Object.assign(new this.constructor(), this, e);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: w1,
  // Deprecated! Use color.formatHex.
  formatHex: w1,
  formatHex8: rL,
  formatHsl: nL,
  formatRgb: S1,
  toString: S1
});
function w1() {
  return this.rgb().formatHex();
}
function rL() {
  return this.rgb().formatHex8();
}
function nL() {
  return wO(this).formatHsl();
}
function S1() {
  return this.rgb().formatRgb();
}
function Cl(e) {
  var t, r;
  return e = (e + "").trim().toLowerCase(), (t = qR.exec(e)) ? (r = t[1].length, t = parseInt(t[1], 16), r === 6 ? P1(t) : r === 3 ? new ir(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : r === 8 ? xs(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : r === 4 ? xs(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = XR.exec(e)) ? new ir(t[1], t[2], t[3], 1) : (t = QR.exec(e)) ? new ir(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = ZR.exec(e)) ? xs(t[1], t[2], t[3], t[4]) : (t = JR.exec(e)) ? xs(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = eL.exec(e)) ? E1(t[1], t[2] / 100, t[3] / 100, 1) : (t = tL.exec(e)) ? E1(t[1], t[2] / 100, t[3] / 100, t[4]) : b1.hasOwnProperty(e) ? P1(b1[e]) : e === "transparent" ? new ir(NaN, NaN, NaN, 0) : null;
}
function P1(e) {
  return new ir(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function xs(e, t, r, n) {
  return n <= 0 && (e = t = r = NaN), new ir(e, t, r, n);
}
function iL(e) {
  return e instanceof Vl || (e = Cl(e)), e ? (e = e.rgb(), new ir(e.r, e.g, e.b, e.opacity)) : new ir();
}
function $h(e, t, r, n) {
  return arguments.length === 1 ? iL(e) : new ir(e, t, r, n ?? 1);
}
function ir(e, t, r, n) {
  this.r = +e, this.g = +t, this.b = +r, this.opacity = +n;
}
Gp(ir, $h, bO(Vl, {
  brighter(e) {
    return e = e == null ? ac : Math.pow(ac, e), new ir(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? El : Math.pow(El, e), new ir(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new ir(Ki(this.r), Ki(this.g), Ki(this.b), oc(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: A1,
  // Deprecated! Use color.formatHex.
  formatHex: A1,
  formatHex8: aL,
  formatRgb: O1,
  toString: O1
}));
function A1() {
  return `#${zi(this.r)}${zi(this.g)}${zi(this.b)}`;
}
function aL() {
  return `#${zi(this.r)}${zi(this.g)}${zi(this.b)}${zi((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function O1() {
  const e = oc(this.opacity);
  return `${e === 1 ? "rgb(" : "rgba("}${Ki(this.r)}, ${Ki(this.g)}, ${Ki(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function oc(e) {
  return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function Ki(e) {
  return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function zi(e) {
  return e = Ki(e), (e < 16 ? "0" : "") + e.toString(16);
}
function E1(e, t, r, n) {
  return n <= 0 ? e = t = r = NaN : r <= 0 || r >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new Wr(e, t, r, n);
}
function wO(e) {
  if (e instanceof Wr) return new Wr(e.h, e.s, e.l, e.opacity);
  if (e instanceof Vl || (e = Cl(e)), !e) return new Wr();
  if (e instanceof Wr) return e;
  e = e.rgb();
  var t = e.r / 255, r = e.g / 255, n = e.b / 255, a = Math.min(t, r, n), l = Math.max(t, r, n), u = NaN, c = l - a, f = (l + a) / 2;
  return c ? (t === l ? u = (r - n) / c + (r < n) * 6 : r === l ? u = (n - t) / c + 2 : u = (t - r) / c + 4, c /= f < 0.5 ? l + a : 2 - l - a, u *= 60) : c = f > 0 && f < 1 ? 0 : u, new Wr(u, c, f, e.opacity);
}
function oL(e, t, r, n) {
  return arguments.length === 1 ? wO(e) : new Wr(e, t, r, n ?? 1);
}
function Wr(e, t, r, n) {
  this.h = +e, this.s = +t, this.l = +r, this.opacity = +n;
}
Gp(Wr, oL, bO(Vl, {
  brighter(e) {
    return e = e == null ? ac : Math.pow(ac, e), new Wr(this.h, this.s, this.l * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? El : Math.pow(El, e), new Wr(this.h, this.s, this.l * e, this.opacity);
  },
  rgb() {
    var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, r = this.l, n = r + (r < 0.5 ? r : 1 - r) * t, a = 2 * r - n;
    return new ir(
      Bv(e >= 240 ? e - 240 : e + 120, a, n),
      Bv(e, a, n),
      Bv(e < 120 ? e + 240 : e - 120, a, n),
      this.opacity
    );
  },
  clamp() {
    return new Wr(k1(this.h), bs(this.s), bs(this.l), oc(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const e = oc(this.opacity);
    return `${e === 1 ? "hsl(" : "hsla("}${k1(this.h)}, ${bs(this.s) * 100}%, ${bs(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
  }
}));
function k1(e) {
  return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function bs(e) {
  return Math.max(0, Math.min(1, e || 0));
}
function Bv(e, t, r) {
  return (e < 60 ? t + (r - t) * e / 60 : e < 180 ? r : e < 240 ? t + (r - t) * (240 - e) / 60 : t) * 255;
}
const Yp = (e) => () => e;
function lL(e, t) {
  return function(r) {
    return e + r * t;
  };
}
function uL(e, t, r) {
  return e = Math.pow(e, r), t = Math.pow(t, r) - e, r = 1 / r, function(n) {
    return Math.pow(e + n * t, r);
  };
}
function sL(e) {
  return (e = +e) == 1 ? SO : function(t, r) {
    return r - t ? uL(t, r, e) : Yp(isNaN(t) ? r : t);
  };
}
function SO(e, t) {
  var r = t - e;
  return r ? lL(e, r) : Yp(isNaN(e) ? t : e);
}
const C1 = (function e(t) {
  var r = sL(t);
  function n(a, l) {
    var u = r((a = $h(a)).r, (l = $h(l)).r), c = r(a.g, l.g), f = r(a.b, l.b), d = SO(a.opacity, l.opacity);
    return function(h) {
      return a.r = u(h), a.g = c(h), a.b = f(h), a.opacity = d(h), a + "";
    };
  }
  return n.gamma = e, n;
})(1);
function cL(e, t) {
  t || (t = []);
  var r = e ? Math.min(t.length, e.length) : 0, n = t.slice(), a;
  return function(l) {
    for (a = 0; a < r; ++a) n[a] = e[a] * (1 - l) + t[a] * l;
    return n;
  };
}
function fL(e) {
  return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
function dL(e, t) {
  var r = t ? t.length : 0, n = e ? Math.min(r, e.length) : 0, a = new Array(n), l = new Array(r), u;
  for (u = 0; u < n; ++u) a[u] = lo(e[u], t[u]);
  for (; u < r; ++u) l[u] = t[u];
  return function(c) {
    for (u = 0; u < n; ++u) l[u] = a[u](c);
    return l;
  };
}
function vL(e, t) {
  var r = /* @__PURE__ */ new Date();
  return e = +e, t = +t, function(n) {
    return r.setTime(e * (1 - n) + t * n), r;
  };
}
function lc(e, t) {
  return e = +e, t = +t, function(r) {
    return e * (1 - r) + t * r;
  };
}
function hL(e, t) {
  var r = {}, n = {}, a;
  (e === null || typeof e != "object") && (e = {}), (t === null || typeof t != "object") && (t = {});
  for (a in t)
    a in e ? r[a] = lo(e[a], t[a]) : n[a] = t[a];
  return function(l) {
    for (a in r) n[a] = r[a](l);
    return n;
  };
}
var Rh = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, Fv = new RegExp(Rh.source, "g");
function pL(e) {
  return function() {
    return e;
  };
}
function mL(e) {
  return function(t) {
    return e(t) + "";
  };
}
function yL(e, t) {
  var r = Rh.lastIndex = Fv.lastIndex = 0, n, a, l, u = -1, c = [], f = [];
  for (e = e + "", t = t + ""; (n = Rh.exec(e)) && (a = Fv.exec(t)); )
    (l = a.index) > r && (l = t.slice(r, l), c[u] ? c[u] += l : c[++u] = l), (n = n[0]) === (a = a[0]) ? c[u] ? c[u] += a : c[++u] = a : (c[++u] = null, f.push({ i: u, x: lc(n, a) })), r = Fv.lastIndex;
  return r < t.length && (l = t.slice(r), c[u] ? c[u] += l : c[++u] = l), c.length < 2 ? f[0] ? mL(f[0].x) : pL(t) : (t = f.length, function(d) {
    for (var h = 0, p; h < t; ++h) c[(p = f[h]).i] = p.x(d);
    return c.join("");
  });
}
function lo(e, t) {
  var r = typeof t, n;
  return t == null || r === "boolean" ? Yp(t) : (r === "number" ? lc : r === "string" ? (n = Cl(t)) ? (t = n, C1) : yL : t instanceof Cl ? C1 : t instanceof Date ? vL : fL(t) ? cL : Array.isArray(t) ? dL : typeof t.valueOf != "function" && typeof t.toString != "function" || isNaN(t) ? hL : lc)(e, t);
}
function qp(e, t) {
  return e = +e, t = +t, function(r) {
    return Math.round(e * (1 - r) + t * r);
  };
}
function gL(e, t) {
  t === void 0 && (t = e, e = lo);
  for (var r = 0, n = t.length - 1, a = t[0], l = new Array(n < 0 ? 0 : n); r < n; ) l[r] = e(a, a = t[++r]);
  return function(u) {
    var c = Math.max(0, Math.min(n - 1, Math.floor(u *= n)));
    return l[c](u - c);
  };
}
function xL(e) {
  return function() {
    return e;
  };
}
function uc(e) {
  return +e;
}
var I1 = [0, 1];
function Yt(e) {
  return e;
}
function Lh(e, t) {
  return (t -= e = +e) ? function(r) {
    return (r - e) / t;
  } : xL(isNaN(t) ? NaN : 0.5);
}
function bL(e, t) {
  var r;
  return e > t && (r = e, e = t, t = r), function(n) {
    return Math.max(e, Math.min(t, n));
  };
}
function wL(e, t, r) {
  var n = e[0], a = e[1], l = t[0], u = t[1];
  return a < n ? (n = Lh(a, n), l = r(u, l)) : (n = Lh(n, a), l = r(l, u)), function(c) {
    return l(n(c));
  };
}
function SL(e, t, r) {
  var n = Math.min(e.length, t.length) - 1, a = new Array(n), l = new Array(n), u = -1;
  for (e[n] < e[0] && (e = e.slice().reverse(), t = t.slice().reverse()); ++u < n; )
    a[u] = Lh(e[u], e[u + 1]), l[u] = r(t[u], t[u + 1]);
  return function(c) {
    var f = Hl(e, c, 1, n) - 1;
    return l[f](a[f](c));
  };
}
function Gl(e, t) {
  return t.domain(e.domain()).range(e.range()).interpolate(e.interpolate()).clamp(e.clamp()).unknown(e.unknown());
}
function tf() {
  var e = I1, t = I1, r = lo, n, a, l, u = Yt, c, f, d;
  function h() {
    var y = Math.min(e.length, t.length);
    return u !== Yt && (u = bL(e[0], e[y - 1])), c = y > 2 ? SL : wL, f = d = null, p;
  }
  function p(y) {
    return y == null || isNaN(y = +y) ? l : (f || (f = c(e.map(n), t, r)))(n(u(y)));
  }
  return p.invert = function(y) {
    return u(a((d || (d = c(t, e.map(n), lc)))(y)));
  }, p.domain = function(y) {
    return arguments.length ? (e = Array.from(y, uc), h()) : e.slice();
  }, p.range = function(y) {
    return arguments.length ? (t = Array.from(y), h()) : t.slice();
  }, p.rangeRound = function(y) {
    return t = Array.from(y), r = qp, h();
  }, p.clamp = function(y) {
    return arguments.length ? (u = y ? !0 : Yt, h()) : u !== Yt;
  }, p.interpolate = function(y) {
    return arguments.length ? (r = y, h()) : r;
  }, p.unknown = function(y) {
    return arguments.length ? (l = y, p) : l;
  }, function(y, b) {
    return n = y, a = b, h();
  };
}
function Xp() {
  return tf()(Yt, Yt);
}
function PL(e) {
  return Math.abs(e = Math.round(e)) >= 1e21 ? e.toLocaleString("en").replace(/,/g, "") : e.toString(10);
}
function sc(e, t) {
  if (!isFinite(e) || e === 0) return null;
  var r = (e = t ? e.toExponential(t - 1) : e.toExponential()).indexOf("e"), n = e.slice(0, r);
  return [
    n.length > 1 ? n[0] + n.slice(2) : n,
    +e.slice(r + 1)
  ];
}
function qa(e) {
  return e = sc(Math.abs(e)), e ? e[1] : NaN;
}
function AL(e, t) {
  return function(r, n) {
    for (var a = r.length, l = [], u = 0, c = e[0], f = 0; a > 0 && c > 0 && (f + c + 1 > n && (c = Math.max(1, n - f)), l.push(r.substring(a -= c, a + c)), !((f += c + 1) > n)); )
      c = e[u = (u + 1) % e.length];
    return l.reverse().join(t);
  };
}
function OL(e) {
  return function(t) {
    return t.replace(/[0-9]/g, function(r) {
      return e[+r];
    });
  };
}
var EL = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
function Il(e) {
  if (!(t = EL.exec(e))) throw new Error("invalid format: " + e);
  var t;
  return new Qp({
    fill: t[1],
    align: t[2],
    sign: t[3],
    symbol: t[4],
    zero: t[5],
    width: t[6],
    comma: t[7],
    precision: t[8] && t[8].slice(1),
    trim: t[9],
    type: t[10]
  });
}
Il.prototype = Qp.prototype;
function Qp(e) {
  this.fill = e.fill === void 0 ? " " : e.fill + "", this.align = e.align === void 0 ? ">" : e.align + "", this.sign = e.sign === void 0 ? "-" : e.sign + "", this.symbol = e.symbol === void 0 ? "" : e.symbol + "", this.zero = !!e.zero, this.width = e.width === void 0 ? void 0 : +e.width, this.comma = !!e.comma, this.precision = e.precision === void 0 ? void 0 : +e.precision, this.trim = !!e.trim, this.type = e.type === void 0 ? "" : e.type + "";
}
Qp.prototype.toString = function() {
  return this.fill + this.align + this.sign + this.symbol + (this.zero ? "0" : "") + (this.width === void 0 ? "" : Math.max(1, this.width | 0)) + (this.comma ? "," : "") + (this.precision === void 0 ? "" : "." + Math.max(0, this.precision | 0)) + (this.trim ? "~" : "") + this.type;
};
function kL(e) {
  e: for (var t = e.length, r = 1, n = -1, a; r < t; ++r)
    switch (e[r]) {
      case ".":
        n = a = r;
        break;
      case "0":
        n === 0 && (n = r), a = r;
        break;
      default:
        if (!+e[r]) break e;
        n > 0 && (n = 0);
        break;
    }
  return n > 0 ? e.slice(0, n) + e.slice(a + 1) : e;
}
var cc;
function CL(e, t) {
  var r = sc(e, t);
  if (!r) return cc = void 0, e.toPrecision(t);
  var n = r[0], a = r[1], l = a - (cc = Math.max(-8, Math.min(8, Math.floor(a / 3))) * 3) + 1, u = n.length;
  return l === u ? n : l > u ? n + new Array(l - u + 1).join("0") : l > 0 ? n.slice(0, l) + "." + n.slice(l) : "0." + new Array(1 - l).join("0") + sc(e, Math.max(0, t + l - 1))[0];
}
function j1(e, t) {
  var r = sc(e, t);
  if (!r) return e + "";
  var n = r[0], a = r[1];
  return a < 0 ? "0." + new Array(-a).join("0") + n : n.length > a + 1 ? n.slice(0, a + 1) + "." + n.slice(a + 1) : n + new Array(a - n.length + 2).join("0");
}
const _1 = {
  "%": (e, t) => (e * 100).toFixed(t),
  b: (e) => Math.round(e).toString(2),
  c: (e) => e + "",
  d: PL,
  e: (e, t) => e.toExponential(t),
  f: (e, t) => e.toFixed(t),
  g: (e, t) => e.toPrecision(t),
  o: (e) => Math.round(e).toString(8),
  p: (e, t) => j1(e * 100, t),
  r: j1,
  s: CL,
  X: (e) => Math.round(e).toString(16).toUpperCase(),
  x: (e) => Math.round(e).toString(16)
};
function T1(e) {
  return e;
}
var M1 = Array.prototype.map, D1 = ["y", "z", "a", "f", "p", "n", "µ", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"];
function IL(e) {
  var t = e.grouping === void 0 || e.thousands === void 0 ? T1 : AL(M1.call(e.grouping, Number), e.thousands + ""), r = e.currency === void 0 ? "" : e.currency[0] + "", n = e.currency === void 0 ? "" : e.currency[1] + "", a = e.decimal === void 0 ? "." : e.decimal + "", l = e.numerals === void 0 ? T1 : OL(M1.call(e.numerals, String)), u = e.percent === void 0 ? "%" : e.percent + "", c = e.minus === void 0 ? "−" : e.minus + "", f = e.nan === void 0 ? "NaN" : e.nan + "";
  function d(p, y) {
    p = Il(p);
    var b = p.fill, w = p.align, P = p.sign, S = p.symbol, O = p.zero, k = p.width, I = p.comma, E = p.precision, _ = p.trim, C = p.type;
    C === "n" ? (I = !0, C = "g") : _1[C] || (E === void 0 && (E = 12), _ = !0, C = "g"), (O || b === "0" && w === "=") && (O = !0, b = "0", w = "=");
    var R = (y && y.prefix !== void 0 ? y.prefix : "") + (S === "$" ? r : S === "#" && /[boxX]/.test(C) ? "0" + C.toLowerCase() : ""), W = (S === "$" ? n : /[%p]/.test(C) ? u : "") + (y && y.suffix !== void 0 ? y.suffix : ""), V = _1[C], K = /[defgprs%]/.test(C);
    E = E === void 0 ? 6 : /[gprs]/.test(C) ? Math.max(1, Math.min(21, E)) : Math.max(0, Math.min(20, E));
    function G(F) {
      var ie = R, re = W, ne, fe, ae;
      if (C === "c")
        re = V(F) + re, F = "";
      else {
        F = +F;
        var U = F < 0 || 1 / F < 0;
        if (F = isNaN(F) ? f : V(Math.abs(F), E), _ && (F = kL(F)), U && +F == 0 && P !== "+" && (U = !1), ie = (U ? P === "(" ? P : c : P === "-" || P === "(" ? "" : P) + ie, re = (C === "s" && !isNaN(F) && cc !== void 0 ? D1[8 + cc / 3] : "") + re + (U && P === "(" ? ")" : ""), K) {
          for (ne = -1, fe = F.length; ++ne < fe; )
            if (ae = F.charCodeAt(ne), 48 > ae || ae > 57) {
              re = (ae === 46 ? a + F.slice(ne + 1) : F.slice(ne)) + re, F = F.slice(0, ne);
              break;
            }
        }
      }
      I && !O && (F = t(F, 1 / 0));
      var ee = ie.length + F.length + re.length, Y = ee < k ? new Array(k - ee + 1).join(b) : "";
      switch (I && O && (F = t(Y + F, Y.length ? k - re.length : 1 / 0), Y = ""), w) {
        case "<":
          F = ie + F + re + Y;
          break;
        case "=":
          F = ie + Y + F + re;
          break;
        case "^":
          F = Y.slice(0, ee = Y.length >> 1) + ie + F + re + Y.slice(ee);
          break;
        default:
          F = Y + ie + F + re;
          break;
      }
      return l(F);
    }
    return G.toString = function() {
      return p + "";
    }, G;
  }
  function h(p, y) {
    var b = Math.max(-8, Math.min(8, Math.floor(qa(y) / 3))) * 3, w = Math.pow(10, -b), P = d((p = Il(p), p.type = "f", p), { suffix: D1[8 + b / 3] });
    return function(S) {
      return P(w * S);
    };
  }
  return {
    format: d,
    formatPrefix: h
  };
}
var ws, Zp, PO;
jL({
  thousands: ",",
  grouping: [3],
  currency: ["$", ""]
});
function jL(e) {
  return ws = IL(e), Zp = ws.format, PO = ws.formatPrefix, ws;
}
function _L(e) {
  return Math.max(0, -qa(Math.abs(e)));
}
function TL(e, t) {
  return Math.max(0, Math.max(-8, Math.min(8, Math.floor(qa(t) / 3))) * 3 - qa(Math.abs(e)));
}
function ML(e, t) {
  return e = Math.abs(e), t = Math.abs(t) - e, Math.max(0, qa(t) - qa(e)) + 1;
}
function AO(e, t, r, n) {
  var a = Dh(e, t, r), l;
  switch (n = Il(n ?? ",f"), n.type) {
    case "s": {
      var u = Math.max(Math.abs(e), Math.abs(t));
      return n.precision == null && !isNaN(l = TL(a, u)) && (n.precision = l), PO(n, u);
    }
    case "":
    case "e":
    case "g":
    case "p":
    case "r": {
      n.precision == null && !isNaN(l = ML(a, Math.max(Math.abs(e), Math.abs(t)))) && (n.precision = l - (n.type === "e"));
      break;
    }
    case "f":
    case "%": {
      n.precision == null && !isNaN(l = _L(a)) && (n.precision = l - (n.type === "%") * 2);
      break;
    }
  }
  return Zp(n);
}
function hi(e) {
  var t = e.domain;
  return e.ticks = function(r) {
    var n = t();
    return Th(n[0], n[n.length - 1], r ?? 10);
  }, e.tickFormat = function(r, n) {
    var a = t();
    return AO(a[0], a[a.length - 1], r ?? 10, n);
  }, e.nice = function(r) {
    r == null && (r = 10);
    var n = t(), a = 0, l = n.length - 1, u = n[a], c = n[l], f, d, h = 10;
    for (c < u && (d = u, u = c, c = d, d = a, a = l, l = d); h-- > 0; ) {
      if (d = Mh(u, c, r), d === f)
        return n[a] = u, n[l] = c, t(n);
      if (d > 0)
        u = Math.floor(u / d) * d, c = Math.ceil(c / d) * d;
      else if (d < 0)
        u = Math.ceil(u * d) / d, c = Math.floor(c * d) / d;
      else
        break;
      f = d;
    }
    return e;
  }, e;
}
function OO() {
  var e = Xp();
  return e.copy = function() {
    return Gl(e, OO());
  }, jr.apply(e, arguments), hi(e);
}
function EO(e) {
  var t;
  function r(n) {
    return n == null || isNaN(n = +n) ? t : n;
  }
  return r.invert = r, r.domain = r.range = function(n) {
    return arguments.length ? (e = Array.from(n, uc), r) : e.slice();
  }, r.unknown = function(n) {
    return arguments.length ? (t = n, r) : t;
  }, r.copy = function() {
    return EO(e).unknown(t);
  }, e = arguments.length ? Array.from(e, uc) : [0, 1], hi(r);
}
function kO(e, t) {
  e = e.slice();
  var r = 0, n = e.length - 1, a = e[r], l = e[n], u;
  return l < a && (u = r, r = n, n = u, u = a, a = l, l = u), e[r] = t.floor(a), e[n] = t.ceil(l), e;
}
function N1(e) {
  return Math.log(e);
}
function $1(e) {
  return Math.exp(e);
}
function DL(e) {
  return -Math.log(-e);
}
function NL(e) {
  return -Math.exp(-e);
}
function $L(e) {
  return isFinite(e) ? +("1e" + e) : e < 0 ? 0 : e;
}
function RL(e) {
  return e === 10 ? $L : e === Math.E ? Math.exp : (t) => Math.pow(e, t);
}
function LL(e) {
  return e === Math.E ? Math.log : e === 10 && Math.log10 || e === 2 && Math.log2 || (e = Math.log(e), (t) => Math.log(t) / e);
}
function R1(e) {
  return (t, r) => -e(-t, r);
}
function Jp(e) {
  const t = e(N1, $1), r = t.domain;
  let n = 10, a, l;
  function u() {
    return a = LL(n), l = RL(n), r()[0] < 0 ? (a = R1(a), l = R1(l), e(DL, NL)) : e(N1, $1), t;
  }
  return t.base = function(c) {
    return arguments.length ? (n = +c, u()) : n;
  }, t.domain = function(c) {
    return arguments.length ? (r(c), u()) : r();
  }, t.ticks = (c) => {
    const f = r();
    let d = f[0], h = f[f.length - 1];
    const p = h < d;
    p && ([d, h] = [h, d]);
    let y = a(d), b = a(h), w, P;
    const S = c == null ? 10 : +c;
    let O = [];
    if (!(n % 1) && b - y < S) {
      if (y = Math.floor(y), b = Math.ceil(b), d > 0) {
        for (; y <= b; ++y)
          for (w = 1; w < n; ++w)
            if (P = y < 0 ? w / l(-y) : w * l(y), !(P < d)) {
              if (P > h) break;
              O.push(P);
            }
      } else for (; y <= b; ++y)
        for (w = n - 1; w >= 1; --w)
          if (P = y > 0 ? w / l(-y) : w * l(y), !(P < d)) {
            if (P > h) break;
            O.push(P);
          }
      O.length * 2 < S && (O = Th(d, h, S));
    } else
      O = Th(y, b, Math.min(b - y, S)).map(l);
    return p ? O.reverse() : O;
  }, t.tickFormat = (c, f) => {
    if (c == null && (c = 10), f == null && (f = n === 10 ? "s" : ","), typeof f != "function" && (!(n % 1) && (f = Il(f)).precision == null && (f.trim = !0), f = Zp(f)), c === 1 / 0) return f;
    const d = Math.max(1, n * c / t.ticks().length);
    return (h) => {
      let p = h / l(Math.round(a(h)));
      return p * n < n - 0.5 && (p *= n), p <= d ? f(h) : "";
    };
  }, t.nice = () => r(kO(r(), {
    floor: (c) => l(Math.floor(a(c))),
    ceil: (c) => l(Math.ceil(a(c)))
  })), t;
}
function CO() {
  const e = Jp(tf()).domain([1, 10]);
  return e.copy = () => Gl(e, CO()).base(e.base()), jr.apply(e, arguments), e;
}
function L1(e) {
  return function(t) {
    return Math.sign(t) * Math.log1p(Math.abs(t / e));
  };
}
function z1(e) {
  return function(t) {
    return Math.sign(t) * Math.expm1(Math.abs(t)) * e;
  };
}
function em(e) {
  var t = 1, r = e(L1(t), z1(t));
  return r.constant = function(n) {
    return arguments.length ? e(L1(t = +n), z1(t)) : t;
  }, hi(r);
}
function IO() {
  var e = em(tf());
  return e.copy = function() {
    return Gl(e, IO()).constant(e.constant());
  }, jr.apply(e, arguments);
}
function B1(e) {
  return function(t) {
    return t < 0 ? -Math.pow(-t, e) : Math.pow(t, e);
  };
}
function zL(e) {
  return e < 0 ? -Math.sqrt(-e) : Math.sqrt(e);
}
function BL(e) {
  return e < 0 ? -e * e : e * e;
}
function tm(e) {
  var t = e(Yt, Yt), r = 1;
  function n() {
    return r === 1 ? e(Yt, Yt) : r === 0.5 ? e(zL, BL) : e(B1(r), B1(1 / r));
  }
  return t.exponent = function(a) {
    return arguments.length ? (r = +a, n()) : r;
  }, hi(t);
}
function rm() {
  var e = tm(tf());
  return e.copy = function() {
    return Gl(e, rm()).exponent(e.exponent());
  }, jr.apply(e, arguments), e;
}
function FL() {
  return rm.apply(null, arguments).exponent(0.5);
}
function F1(e) {
  return Math.sign(e) * e * e;
}
function WL(e) {
  return Math.sign(e) * Math.sqrt(Math.abs(e));
}
function jO() {
  var e = Xp(), t = [0, 1], r = !1, n;
  function a(l) {
    var u = WL(e(l));
    return isNaN(u) ? n : r ? Math.round(u) : u;
  }
  return a.invert = function(l) {
    return e.invert(F1(l));
  }, a.domain = function(l) {
    return arguments.length ? (e.domain(l), a) : e.domain();
  }, a.range = function(l) {
    return arguments.length ? (e.range((t = Array.from(l, uc)).map(F1)), a) : t.slice();
  }, a.rangeRound = function(l) {
    return a.range(l).round(!0);
  }, a.round = function(l) {
    return arguments.length ? (r = !!l, a) : r;
  }, a.clamp = function(l) {
    return arguments.length ? (e.clamp(l), a) : e.clamp();
  }, a.unknown = function(l) {
    return arguments.length ? (n = l, a) : n;
  }, a.copy = function() {
    return jO(e.domain(), t).round(r).clamp(e.clamp()).unknown(n);
  }, jr.apply(a, arguments), hi(a);
}
function _O() {
  var e = [], t = [], r = [], n;
  function a() {
    var u = 0, c = Math.max(1, t.length);
    for (r = new Array(c - 1); ++u < c; ) r[u - 1] = VR(e, u / c);
    return l;
  }
  function l(u) {
    return u == null || isNaN(u = +u) ? n : t[Hl(r, u)];
  }
  return l.invertExtent = function(u) {
    var c = t.indexOf(u);
    return c < 0 ? [NaN, NaN] : [
      c > 0 ? r[c - 1] : e[0],
      c < r.length ? r[c] : e[e.length - 1]
    ];
  }, l.domain = function(u) {
    if (!arguments.length) return e.slice();
    e = [];
    for (let c of u) c != null && !isNaN(c = +c) && e.push(c);
    return e.sort(ui), a();
  }, l.range = function(u) {
    return arguments.length ? (t = Array.from(u), a()) : t.slice();
  }, l.unknown = function(u) {
    return arguments.length ? (n = u, l) : n;
  }, l.quantiles = function() {
    return r.slice();
  }, l.copy = function() {
    return _O().domain(e).range(t).unknown(n);
  }, jr.apply(l, arguments);
}
function TO() {
  var e = 0, t = 1, r = 1, n = [0.5], a = [0, 1], l;
  function u(f) {
    return f != null && f <= f ? a[Hl(n, f, 0, r)] : l;
  }
  function c() {
    var f = -1;
    for (n = new Array(r); ++f < r; ) n[f] = ((f + 1) * t - (f - r) * e) / (r + 1);
    return u;
  }
  return u.domain = function(f) {
    return arguments.length ? ([e, t] = f, e = +e, t = +t, c()) : [e, t];
  }, u.range = function(f) {
    return arguments.length ? (r = (a = Array.from(f)).length - 1, c()) : a.slice();
  }, u.invertExtent = function(f) {
    var d = a.indexOf(f);
    return d < 0 ? [NaN, NaN] : d < 1 ? [e, n[0]] : d >= r ? [n[r - 1], t] : [n[d - 1], n[d]];
  }, u.unknown = function(f) {
    return arguments.length && (l = f), u;
  }, u.thresholds = function() {
    return n.slice();
  }, u.copy = function() {
    return TO().domain([e, t]).range(a).unknown(l);
  }, jr.apply(hi(u), arguments);
}
function MO() {
  var e = [0.5], t = [0, 1], r, n = 1;
  function a(l) {
    return l != null && l <= l ? t[Hl(e, l, 0, n)] : r;
  }
  return a.domain = function(l) {
    return arguments.length ? (e = Array.from(l), n = Math.min(e.length, t.length - 1), a) : e.slice();
  }, a.range = function(l) {
    return arguments.length ? (t = Array.from(l), n = Math.min(e.length, t.length - 1), a) : t.slice();
  }, a.invertExtent = function(l) {
    var u = t.indexOf(l);
    return [e[u - 1], e[u]];
  }, a.unknown = function(l) {
    return arguments.length ? (r = l, a) : r;
  }, a.copy = function() {
    return MO().domain(e).range(t).unknown(r);
  }, jr.apply(a, arguments);
}
const Wv = /* @__PURE__ */ new Date(), Uv = /* @__PURE__ */ new Date();
function bt(e, t, r, n) {
  function a(l) {
    return e(l = arguments.length === 0 ? /* @__PURE__ */ new Date() : /* @__PURE__ */ new Date(+l)), l;
  }
  return a.floor = (l) => (e(l = /* @__PURE__ */ new Date(+l)), l), a.ceil = (l) => (e(l = new Date(l - 1)), t(l, 1), e(l), l), a.round = (l) => {
    const u = a(l), c = a.ceil(l);
    return l - u < c - l ? u : c;
  }, a.offset = (l, u) => (t(l = /* @__PURE__ */ new Date(+l), u == null ? 1 : Math.floor(u)), l), a.range = (l, u, c) => {
    const f = [];
    if (l = a.ceil(l), c = c == null ? 1 : Math.floor(c), !(l < u) || !(c > 0)) return f;
    let d;
    do
      f.push(d = /* @__PURE__ */ new Date(+l)), t(l, c), e(l);
    while (d < l && l < u);
    return f;
  }, a.filter = (l) => bt((u) => {
    if (u >= u) for (; e(u), !l(u); ) u.setTime(u - 1);
  }, (u, c) => {
    if (u >= u)
      if (c < 0) for (; ++c <= 0; )
        for (; t(u, -1), !l(u); )
          ;
      else for (; --c >= 0; )
        for (; t(u, 1), !l(u); )
          ;
  }), r && (a.count = (l, u) => (Wv.setTime(+l), Uv.setTime(+u), e(Wv), e(Uv), Math.floor(r(Wv, Uv))), a.every = (l) => (l = Math.floor(l), !isFinite(l) || !(l > 0) ? null : l > 1 ? a.filter(n ? (u) => n(u) % l === 0 : (u) => a.count(0, u) % l === 0) : a)), a;
}
const fc = bt(() => {
}, (e, t) => {
  e.setTime(+e + t);
}, (e, t) => t - e);
fc.every = (e) => (e = Math.floor(e), !isFinite(e) || !(e > 0) ? null : e > 1 ? bt((t) => {
  t.setTime(Math.floor(t / e) * e);
}, (t, r) => {
  t.setTime(+t + r * e);
}, (t, r) => (r - t) / e) : fc);
fc.range;
const On = 1e3, kr = On * 60, En = kr * 60, jn = En * 24, nm = jn * 7, W1 = jn * 30, Kv = jn * 365, Bi = bt((e) => {
  e.setTime(e - e.getMilliseconds());
}, (e, t) => {
  e.setTime(+e + t * On);
}, (e, t) => (t - e) / On, (e) => e.getUTCSeconds());
Bi.range;
const im = bt((e) => {
  e.setTime(e - e.getMilliseconds() - e.getSeconds() * On);
}, (e, t) => {
  e.setTime(+e + t * kr);
}, (e, t) => (t - e) / kr, (e) => e.getMinutes());
im.range;
const am = bt((e) => {
  e.setUTCSeconds(0, 0);
}, (e, t) => {
  e.setTime(+e + t * kr);
}, (e, t) => (t - e) / kr, (e) => e.getUTCMinutes());
am.range;
const om = bt((e) => {
  e.setTime(e - e.getMilliseconds() - e.getSeconds() * On - e.getMinutes() * kr);
}, (e, t) => {
  e.setTime(+e + t * En);
}, (e, t) => (t - e) / En, (e) => e.getHours());
om.range;
const lm = bt((e) => {
  e.setUTCMinutes(0, 0, 0);
}, (e, t) => {
  e.setTime(+e + t * En);
}, (e, t) => (t - e) / En, (e) => e.getUTCHours());
lm.range;
const Yl = bt(
  (e) => e.setHours(0, 0, 0, 0),
  (e, t) => e.setDate(e.getDate() + t),
  (e, t) => (t - e - (t.getTimezoneOffset() - e.getTimezoneOffset()) * kr) / jn,
  (e) => e.getDate() - 1
);
Yl.range;
const rf = bt((e) => {
  e.setUTCHours(0, 0, 0, 0);
}, (e, t) => {
  e.setUTCDate(e.getUTCDate() + t);
}, (e, t) => (t - e) / jn, (e) => e.getUTCDate() - 1);
rf.range;
const DO = bt((e) => {
  e.setUTCHours(0, 0, 0, 0);
}, (e, t) => {
  e.setUTCDate(e.getUTCDate() + t);
}, (e, t) => (t - e) / jn, (e) => Math.floor(e / jn));
DO.range;
function ta(e) {
  return bt((t) => {
    t.setDate(t.getDate() - (t.getDay() + 7 - e) % 7), t.setHours(0, 0, 0, 0);
  }, (t, r) => {
    t.setDate(t.getDate() + r * 7);
  }, (t, r) => (r - t - (r.getTimezoneOffset() - t.getTimezoneOffset()) * kr) / nm);
}
const nf = ta(0), dc = ta(1), UL = ta(2), KL = ta(3), Xa = ta(4), HL = ta(5), VL = ta(6);
nf.range;
dc.range;
UL.range;
KL.range;
Xa.range;
HL.range;
VL.range;
function ra(e) {
  return bt((t) => {
    t.setUTCDate(t.getUTCDate() - (t.getUTCDay() + 7 - e) % 7), t.setUTCHours(0, 0, 0, 0);
  }, (t, r) => {
    t.setUTCDate(t.getUTCDate() + r * 7);
  }, (t, r) => (r - t) / nm);
}
const af = ra(0), vc = ra(1), GL = ra(2), YL = ra(3), Qa = ra(4), qL = ra(5), XL = ra(6);
af.range;
vc.range;
GL.range;
YL.range;
Qa.range;
qL.range;
XL.range;
const um = bt((e) => {
  e.setDate(1), e.setHours(0, 0, 0, 0);
}, (e, t) => {
  e.setMonth(e.getMonth() + t);
}, (e, t) => t.getMonth() - e.getMonth() + (t.getFullYear() - e.getFullYear()) * 12, (e) => e.getMonth());
um.range;
const sm = bt((e) => {
  e.setUTCDate(1), e.setUTCHours(0, 0, 0, 0);
}, (e, t) => {
  e.setUTCMonth(e.getUTCMonth() + t);
}, (e, t) => t.getUTCMonth() - e.getUTCMonth() + (t.getUTCFullYear() - e.getUTCFullYear()) * 12, (e) => e.getUTCMonth());
sm.range;
const _n = bt((e) => {
  e.setMonth(0, 1), e.setHours(0, 0, 0, 0);
}, (e, t) => {
  e.setFullYear(e.getFullYear() + t);
}, (e, t) => t.getFullYear() - e.getFullYear(), (e) => e.getFullYear());
_n.every = (e) => !isFinite(e = Math.floor(e)) || !(e > 0) ? null : bt((t) => {
  t.setFullYear(Math.floor(t.getFullYear() / e) * e), t.setMonth(0, 1), t.setHours(0, 0, 0, 0);
}, (t, r) => {
  t.setFullYear(t.getFullYear() + r * e);
});
_n.range;
const Tn = bt((e) => {
  e.setUTCMonth(0, 1), e.setUTCHours(0, 0, 0, 0);
}, (e, t) => {
  e.setUTCFullYear(e.getUTCFullYear() + t);
}, (e, t) => t.getUTCFullYear() - e.getUTCFullYear(), (e) => e.getUTCFullYear());
Tn.every = (e) => !isFinite(e = Math.floor(e)) || !(e > 0) ? null : bt((t) => {
  t.setUTCFullYear(Math.floor(t.getUTCFullYear() / e) * e), t.setUTCMonth(0, 1), t.setUTCHours(0, 0, 0, 0);
}, (t, r) => {
  t.setUTCFullYear(t.getUTCFullYear() + r * e);
});
Tn.range;
function NO(e, t, r, n, a, l) {
  const u = [
    [Bi, 1, On],
    [Bi, 5, 5 * On],
    [Bi, 15, 15 * On],
    [Bi, 30, 30 * On],
    [l, 1, kr],
    [l, 5, 5 * kr],
    [l, 15, 15 * kr],
    [l, 30, 30 * kr],
    [a, 1, En],
    [a, 3, 3 * En],
    [a, 6, 6 * En],
    [a, 12, 12 * En],
    [n, 1, jn],
    [n, 2, 2 * jn],
    [r, 1, nm],
    [t, 1, W1],
    [t, 3, 3 * W1],
    [e, 1, Kv]
  ];
  function c(d, h, p) {
    const y = h < d;
    y && ([d, h] = [h, d]);
    const b = p && typeof p.range == "function" ? p : f(d, h, p), w = b ? b.range(d, +h + 1) : [];
    return y ? w.reverse() : w;
  }
  function f(d, h, p) {
    const y = Math.abs(h - d) / p, b = Kp(([, , S]) => S).right(u, y);
    if (b === u.length) return e.every(Dh(d / Kv, h / Kv, p));
    if (b === 0) return fc.every(Math.max(Dh(d, h, p), 1));
    const [w, P] = u[y / u[b - 1][2] < u[b][2] / y ? b - 1 : b];
    return w.every(P);
  }
  return [c, f];
}
const [QL, ZL] = NO(Tn, sm, af, DO, lm, am), [JL, ez] = NO(_n, um, nf, Yl, om, im);
function Hv(e) {
  if (0 <= e.y && e.y < 100) {
    var t = new Date(-1, e.m, e.d, e.H, e.M, e.S, e.L);
    return t.setFullYear(e.y), t;
  }
  return new Date(e.y, e.m, e.d, e.H, e.M, e.S, e.L);
}
function Vv(e) {
  if (0 <= e.y && e.y < 100) {
    var t = new Date(Date.UTC(-1, e.m, e.d, e.H, e.M, e.S, e.L));
    return t.setUTCFullYear(e.y), t;
  }
  return new Date(Date.UTC(e.y, e.m, e.d, e.H, e.M, e.S, e.L));
}
function ul(e, t, r) {
  return { y: e, m: t, d: r, H: 0, M: 0, S: 0, L: 0 };
}
function tz(e) {
  var t = e.dateTime, r = e.date, n = e.time, a = e.periods, l = e.days, u = e.shortDays, c = e.months, f = e.shortMonths, d = sl(a), h = cl(a), p = sl(l), y = cl(l), b = sl(u), w = cl(u), P = sl(c), S = cl(c), O = sl(f), k = cl(f), I = {
    a: ae,
    A: U,
    b: ee,
    B: Y,
    c: null,
    d: Y1,
    e: Y1,
    f: Az,
    g: Dz,
    G: $z,
    H: wz,
    I: Sz,
    j: Pz,
    L: $O,
    m: Oz,
    M: Ez,
    p: D,
    q: H,
    Q: Q1,
    s: Z1,
    S: kz,
    u: Cz,
    U: Iz,
    V: jz,
    w: _z,
    W: Tz,
    x: null,
    X: null,
    y: Mz,
    Y: Nz,
    Z: Rz,
    "%": X1
  }, E = {
    a: ve,
    A: ye,
    b: Pe,
    B: Ae,
    c: null,
    d: q1,
    e: q1,
    f: Fz,
    g: Qz,
    G: Jz,
    H: Lz,
    I: zz,
    j: Bz,
    L: LO,
    m: Wz,
    M: Uz,
    p: Oe,
    q: ke,
    Q: Q1,
    s: Z1,
    S: Kz,
    u: Hz,
    U: Vz,
    V: Gz,
    w: Yz,
    W: qz,
    x: null,
    X: null,
    y: Xz,
    Y: Zz,
    Z: e3,
    "%": X1
  }, _ = {
    a: K,
    A: G,
    b: F,
    B: ie,
    c: re,
    d: V1,
    e: V1,
    f: yz,
    g: H1,
    G: K1,
    H: G1,
    I: G1,
    j: vz,
    L: mz,
    m: dz,
    M: hz,
    p: V,
    q: fz,
    Q: xz,
    s: bz,
    S: pz,
    u: oz,
    U: lz,
    V: uz,
    w: az,
    W: sz,
    x: ne,
    X: fe,
    y: H1,
    Y: K1,
    Z: cz,
    "%": gz
  };
  I.x = C(r, I), I.X = C(n, I), I.c = C(t, I), E.x = C(r, E), E.X = C(n, E), E.c = C(t, E);
  function C(J, me) {
    return function(we) {
      var Z = [], at = -1, _e = 0, be = J.length, Nt, Tr, po;
      for (we instanceof Date || (we = /* @__PURE__ */ new Date(+we)); ++at < be; )
        J.charCodeAt(at) === 37 && (Z.push(J.slice(_e, at)), (Tr = U1[Nt = J.charAt(++at)]) != null ? Nt = J.charAt(++at) : Tr = Nt === "e" ? " " : "0", (po = me[Nt]) && (Nt = po(we, Tr)), Z.push(Nt), _e = at + 1);
      return Z.push(J.slice(_e, at)), Z.join("");
    };
  }
  function R(J, me) {
    return function(we) {
      var Z = ul(1900, void 0, 1), at = W(Z, J, we += "", 0), _e, be;
      if (at != we.length) return null;
      if ("Q" in Z) return new Date(Z.Q);
      if ("s" in Z) return new Date(Z.s * 1e3 + ("L" in Z ? Z.L : 0));
      if (me && !("Z" in Z) && (Z.Z = 0), "p" in Z && (Z.H = Z.H % 12 + Z.p * 12), Z.m === void 0 && (Z.m = "q" in Z ? Z.q : 0), "V" in Z) {
        if (Z.V < 1 || Z.V > 53) return null;
        "w" in Z || (Z.w = 1), "Z" in Z ? (_e = Vv(ul(Z.y, 0, 1)), be = _e.getUTCDay(), _e = be > 4 || be === 0 ? vc.ceil(_e) : vc(_e), _e = rf.offset(_e, (Z.V - 1) * 7), Z.y = _e.getUTCFullYear(), Z.m = _e.getUTCMonth(), Z.d = _e.getUTCDate() + (Z.w + 6) % 7) : (_e = Hv(ul(Z.y, 0, 1)), be = _e.getDay(), _e = be > 4 || be === 0 ? dc.ceil(_e) : dc(_e), _e = Yl.offset(_e, (Z.V - 1) * 7), Z.y = _e.getFullYear(), Z.m = _e.getMonth(), Z.d = _e.getDate() + (Z.w + 6) % 7);
      } else ("W" in Z || "U" in Z) && ("w" in Z || (Z.w = "u" in Z ? Z.u % 7 : "W" in Z ? 1 : 0), be = "Z" in Z ? Vv(ul(Z.y, 0, 1)).getUTCDay() : Hv(ul(Z.y, 0, 1)).getDay(), Z.m = 0, Z.d = "W" in Z ? (Z.w + 6) % 7 + Z.W * 7 - (be + 5) % 7 : Z.w + Z.U * 7 - (be + 6) % 7);
      return "Z" in Z ? (Z.H += Z.Z / 100 | 0, Z.M += Z.Z % 100, Vv(Z)) : Hv(Z);
    };
  }
  function W(J, me, we, Z) {
    for (var at = 0, _e = me.length, be = we.length, Nt, Tr; at < _e; ) {
      if (Z >= be) return -1;
      if (Nt = me.charCodeAt(at++), Nt === 37) {
        if (Nt = me.charAt(at++), Tr = _[Nt in U1 ? me.charAt(at++) : Nt], !Tr || (Z = Tr(J, we, Z)) < 0) return -1;
      } else if (Nt != we.charCodeAt(Z++))
        return -1;
    }
    return Z;
  }
  function V(J, me, we) {
    var Z = d.exec(me.slice(we));
    return Z ? (J.p = h.get(Z[0].toLowerCase()), we + Z[0].length) : -1;
  }
  function K(J, me, we) {
    var Z = b.exec(me.slice(we));
    return Z ? (J.w = w.get(Z[0].toLowerCase()), we + Z[0].length) : -1;
  }
  function G(J, me, we) {
    var Z = p.exec(me.slice(we));
    return Z ? (J.w = y.get(Z[0].toLowerCase()), we + Z[0].length) : -1;
  }
  function F(J, me, we) {
    var Z = O.exec(me.slice(we));
    return Z ? (J.m = k.get(Z[0].toLowerCase()), we + Z[0].length) : -1;
  }
  function ie(J, me, we) {
    var Z = P.exec(me.slice(we));
    return Z ? (J.m = S.get(Z[0].toLowerCase()), we + Z[0].length) : -1;
  }
  function re(J, me, we) {
    return W(J, t, me, we);
  }
  function ne(J, me, we) {
    return W(J, r, me, we);
  }
  function fe(J, me, we) {
    return W(J, n, me, we);
  }
  function ae(J) {
    return u[J.getDay()];
  }
  function U(J) {
    return l[J.getDay()];
  }
  function ee(J) {
    return f[J.getMonth()];
  }
  function Y(J) {
    return c[J.getMonth()];
  }
  function D(J) {
    return a[+(J.getHours() >= 12)];
  }
  function H(J) {
    return 1 + ~~(J.getMonth() / 3);
  }
  function ve(J) {
    return u[J.getUTCDay()];
  }
  function ye(J) {
    return l[J.getUTCDay()];
  }
  function Pe(J) {
    return f[J.getUTCMonth()];
  }
  function Ae(J) {
    return c[J.getUTCMonth()];
  }
  function Oe(J) {
    return a[+(J.getUTCHours() >= 12)];
  }
  function ke(J) {
    return 1 + ~~(J.getUTCMonth() / 3);
  }
  return {
    format: function(J) {
      var me = C(J += "", I);
      return me.toString = function() {
        return J;
      }, me;
    },
    parse: function(J) {
      var me = R(J += "", !1);
      return me.toString = function() {
        return J;
      }, me;
    },
    utcFormat: function(J) {
      var me = C(J += "", E);
      return me.toString = function() {
        return J;
      }, me;
    },
    utcParse: function(J) {
      var me = R(J += "", !0);
      return me.toString = function() {
        return J;
      }, me;
    }
  };
}
var U1 = { "-": "", _: " ", 0: "0" }, Ct = /^\s*\d+/, rz = /^%/, nz = /[\\^$*+?|[\]().{}]/g;
function De(e, t, r) {
  var n = e < 0 ? "-" : "", a = (n ? -e : e) + "", l = a.length;
  return n + (l < r ? new Array(r - l + 1).join(t) + a : a);
}
function iz(e) {
  return e.replace(nz, "\\$&");
}
function sl(e) {
  return new RegExp("^(?:" + e.map(iz).join("|") + ")", "i");
}
function cl(e) {
  return new Map(e.map((t, r) => [t.toLowerCase(), r]));
}
function az(e, t, r) {
  var n = Ct.exec(t.slice(r, r + 1));
  return n ? (e.w = +n[0], r + n[0].length) : -1;
}
function oz(e, t, r) {
  var n = Ct.exec(t.slice(r, r + 1));
  return n ? (e.u = +n[0], r + n[0].length) : -1;
}
function lz(e, t, r) {
  var n = Ct.exec(t.slice(r, r + 2));
  return n ? (e.U = +n[0], r + n[0].length) : -1;
}
function uz(e, t, r) {
  var n = Ct.exec(t.slice(r, r + 2));
  return n ? (e.V = +n[0], r + n[0].length) : -1;
}
function sz(e, t, r) {
  var n = Ct.exec(t.slice(r, r + 2));
  return n ? (e.W = +n[0], r + n[0].length) : -1;
}
function K1(e, t, r) {
  var n = Ct.exec(t.slice(r, r + 4));
  return n ? (e.y = +n[0], r + n[0].length) : -1;
}
function H1(e, t, r) {
  var n = Ct.exec(t.slice(r, r + 2));
  return n ? (e.y = +n[0] + (+n[0] > 68 ? 1900 : 2e3), r + n[0].length) : -1;
}
function cz(e, t, r) {
  var n = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(t.slice(r, r + 6));
  return n ? (e.Z = n[1] ? 0 : -(n[2] + (n[3] || "00")), r + n[0].length) : -1;
}
function fz(e, t, r) {
  var n = Ct.exec(t.slice(r, r + 1));
  return n ? (e.q = n[0] * 3 - 3, r + n[0].length) : -1;
}
function dz(e, t, r) {
  var n = Ct.exec(t.slice(r, r + 2));
  return n ? (e.m = n[0] - 1, r + n[0].length) : -1;
}
function V1(e, t, r) {
  var n = Ct.exec(t.slice(r, r + 2));
  return n ? (e.d = +n[0], r + n[0].length) : -1;
}
function vz(e, t, r) {
  var n = Ct.exec(t.slice(r, r + 3));
  return n ? (e.m = 0, e.d = +n[0], r + n[0].length) : -1;
}
function G1(e, t, r) {
  var n = Ct.exec(t.slice(r, r + 2));
  return n ? (e.H = +n[0], r + n[0].length) : -1;
}
function hz(e, t, r) {
  var n = Ct.exec(t.slice(r, r + 2));
  return n ? (e.M = +n[0], r + n[0].length) : -1;
}
function pz(e, t, r) {
  var n = Ct.exec(t.slice(r, r + 2));
  return n ? (e.S = +n[0], r + n[0].length) : -1;
}
function mz(e, t, r) {
  var n = Ct.exec(t.slice(r, r + 3));
  return n ? (e.L = +n[0], r + n[0].length) : -1;
}
function yz(e, t, r) {
  var n = Ct.exec(t.slice(r, r + 6));
  return n ? (e.L = Math.floor(n[0] / 1e3), r + n[0].length) : -1;
}
function gz(e, t, r) {
  var n = rz.exec(t.slice(r, r + 1));
  return n ? r + n[0].length : -1;
}
function xz(e, t, r) {
  var n = Ct.exec(t.slice(r));
  return n ? (e.Q = +n[0], r + n[0].length) : -1;
}
function bz(e, t, r) {
  var n = Ct.exec(t.slice(r));
  return n ? (e.s = +n[0], r + n[0].length) : -1;
}
function Y1(e, t) {
  return De(e.getDate(), t, 2);
}
function wz(e, t) {
  return De(e.getHours(), t, 2);
}
function Sz(e, t) {
  return De(e.getHours() % 12 || 12, t, 2);
}
function Pz(e, t) {
  return De(1 + Yl.count(_n(e), e), t, 3);
}
function $O(e, t) {
  return De(e.getMilliseconds(), t, 3);
}
function Az(e, t) {
  return $O(e, t) + "000";
}
function Oz(e, t) {
  return De(e.getMonth() + 1, t, 2);
}
function Ez(e, t) {
  return De(e.getMinutes(), t, 2);
}
function kz(e, t) {
  return De(e.getSeconds(), t, 2);
}
function Cz(e) {
  var t = e.getDay();
  return t === 0 ? 7 : t;
}
function Iz(e, t) {
  return De(nf.count(_n(e) - 1, e), t, 2);
}
function RO(e) {
  var t = e.getDay();
  return t >= 4 || t === 0 ? Xa(e) : Xa.ceil(e);
}
function jz(e, t) {
  return e = RO(e), De(Xa.count(_n(e), e) + (_n(e).getDay() === 4), t, 2);
}
function _z(e) {
  return e.getDay();
}
function Tz(e, t) {
  return De(dc.count(_n(e) - 1, e), t, 2);
}
function Mz(e, t) {
  return De(e.getFullYear() % 100, t, 2);
}
function Dz(e, t) {
  return e = RO(e), De(e.getFullYear() % 100, t, 2);
}
function Nz(e, t) {
  return De(e.getFullYear() % 1e4, t, 4);
}
function $z(e, t) {
  var r = e.getDay();
  return e = r >= 4 || r === 0 ? Xa(e) : Xa.ceil(e), De(e.getFullYear() % 1e4, t, 4);
}
function Rz(e) {
  var t = e.getTimezoneOffset();
  return (t > 0 ? "-" : (t *= -1, "+")) + De(t / 60 | 0, "0", 2) + De(t % 60, "0", 2);
}
function q1(e, t) {
  return De(e.getUTCDate(), t, 2);
}
function Lz(e, t) {
  return De(e.getUTCHours(), t, 2);
}
function zz(e, t) {
  return De(e.getUTCHours() % 12 || 12, t, 2);
}
function Bz(e, t) {
  return De(1 + rf.count(Tn(e), e), t, 3);
}
function LO(e, t) {
  return De(e.getUTCMilliseconds(), t, 3);
}
function Fz(e, t) {
  return LO(e, t) + "000";
}
function Wz(e, t) {
  return De(e.getUTCMonth() + 1, t, 2);
}
function Uz(e, t) {
  return De(e.getUTCMinutes(), t, 2);
}
function Kz(e, t) {
  return De(e.getUTCSeconds(), t, 2);
}
function Hz(e) {
  var t = e.getUTCDay();
  return t === 0 ? 7 : t;
}
function Vz(e, t) {
  return De(af.count(Tn(e) - 1, e), t, 2);
}
function zO(e) {
  var t = e.getUTCDay();
  return t >= 4 || t === 0 ? Qa(e) : Qa.ceil(e);
}
function Gz(e, t) {
  return e = zO(e), De(Qa.count(Tn(e), e) + (Tn(e).getUTCDay() === 4), t, 2);
}
function Yz(e) {
  return e.getUTCDay();
}
function qz(e, t) {
  return De(vc.count(Tn(e) - 1, e), t, 2);
}
function Xz(e, t) {
  return De(e.getUTCFullYear() % 100, t, 2);
}
function Qz(e, t) {
  return e = zO(e), De(e.getUTCFullYear() % 100, t, 2);
}
function Zz(e, t) {
  return De(e.getUTCFullYear() % 1e4, t, 4);
}
function Jz(e, t) {
  var r = e.getUTCDay();
  return e = r >= 4 || r === 0 ? Qa(e) : Qa.ceil(e), De(e.getUTCFullYear() % 1e4, t, 4);
}
function e3() {
  return "+0000";
}
function X1() {
  return "%";
}
function Q1(e) {
  return +e;
}
function Z1(e) {
  return Math.floor(+e / 1e3);
}
var Da, BO, FO;
t3({
  dateTime: "%x, %X",
  date: "%-m/%-d/%Y",
  time: "%-I:%M:%S %p",
  periods: ["AM", "PM"],
  days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
});
function t3(e) {
  return Da = tz(e), BO = Da.format, Da.parse, FO = Da.utcFormat, Da.utcParse, Da;
}
function r3(e) {
  return new Date(e);
}
function n3(e) {
  return e instanceof Date ? +e : +/* @__PURE__ */ new Date(+e);
}
function cm(e, t, r, n, a, l, u, c, f, d) {
  var h = Xp(), p = h.invert, y = h.domain, b = d(".%L"), w = d(":%S"), P = d("%I:%M"), S = d("%I %p"), O = d("%a %d"), k = d("%b %d"), I = d("%B"), E = d("%Y");
  function _(C) {
    return (f(C) < C ? b : c(C) < C ? w : u(C) < C ? P : l(C) < C ? S : n(C) < C ? a(C) < C ? O : k : r(C) < C ? I : E)(C);
  }
  return h.invert = function(C) {
    return new Date(p(C));
  }, h.domain = function(C) {
    return arguments.length ? y(Array.from(C, n3)) : y().map(r3);
  }, h.ticks = function(C) {
    var R = y();
    return e(R[0], R[R.length - 1], C ?? 10);
  }, h.tickFormat = function(C, R) {
    return R == null ? _ : d(R);
  }, h.nice = function(C) {
    var R = y();
    return (!C || typeof C.range != "function") && (C = t(R[0], R[R.length - 1], C ?? 10)), C ? y(kO(R, C)) : h;
  }, h.copy = function() {
    return Gl(h, cm(e, t, r, n, a, l, u, c, f, d));
  }, h;
}
function i3() {
  return jr.apply(cm(JL, ez, _n, um, nf, Yl, om, im, Bi, BO).domain([new Date(2e3, 0, 1), new Date(2e3, 0, 2)]), arguments);
}
function a3() {
  return jr.apply(cm(QL, ZL, Tn, sm, af, rf, lm, am, Bi, FO).domain([Date.UTC(2e3, 0, 1), Date.UTC(2e3, 0, 2)]), arguments);
}
function of() {
  var e = 0, t = 1, r, n, a, l, u = Yt, c = !1, f;
  function d(p) {
    return p == null || isNaN(p = +p) ? f : u(a === 0 ? 0.5 : (p = (l(p) - r) * a, c ? Math.max(0, Math.min(1, p)) : p));
  }
  d.domain = function(p) {
    return arguments.length ? ([e, t] = p, r = l(e = +e), n = l(t = +t), a = r === n ? 0 : 1 / (n - r), d) : [e, t];
  }, d.clamp = function(p) {
    return arguments.length ? (c = !!p, d) : c;
  }, d.interpolator = function(p) {
    return arguments.length ? (u = p, d) : u;
  };
  function h(p) {
    return function(y) {
      var b, w;
      return arguments.length ? ([b, w] = y, u = p(b, w), d) : [u(0), u(1)];
    };
  }
  return d.range = h(lo), d.rangeRound = h(qp), d.unknown = function(p) {
    return arguments.length ? (f = p, d) : f;
  }, function(p) {
    return l = p, r = p(e), n = p(t), a = r === n ? 0 : 1 / (n - r), d;
  };
}
function pi(e, t) {
  return t.domain(e.domain()).interpolator(e.interpolator()).clamp(e.clamp()).unknown(e.unknown());
}
function WO() {
  var e = hi(of()(Yt));
  return e.copy = function() {
    return pi(e, WO());
  }, Dn.apply(e, arguments);
}
function UO() {
  var e = Jp(of()).domain([1, 10]);
  return e.copy = function() {
    return pi(e, UO()).base(e.base());
  }, Dn.apply(e, arguments);
}
function KO() {
  var e = em(of());
  return e.copy = function() {
    return pi(e, KO()).constant(e.constant());
  }, Dn.apply(e, arguments);
}
function fm() {
  var e = tm(of());
  return e.copy = function() {
    return pi(e, fm()).exponent(e.exponent());
  }, Dn.apply(e, arguments);
}
function o3() {
  return fm.apply(null, arguments).exponent(0.5);
}
function HO() {
  var e = [], t = Yt;
  function r(n) {
    if (n != null && !isNaN(n = +n)) return t((Hl(e, n, 1) - 1) / (e.length - 1));
  }
  return r.domain = function(n) {
    if (!arguments.length) return e.slice();
    e = [];
    for (let a of n) a != null && !isNaN(a = +a) && e.push(a);
    return e.sort(ui), r;
  }, r.interpolator = function(n) {
    return arguments.length ? (t = n, r) : t;
  }, r.range = function() {
    return e.map((n, a) => t(a / (e.length - 1)));
  }, r.quantiles = function(n) {
    return Array.from({ length: n + 1 }, (a, l) => HR(e, l / n));
  }, r.copy = function() {
    return HO(t).domain(e);
  }, Dn.apply(r, arguments);
}
function lf() {
  var e = 0, t = 0.5, r = 1, n = 1, a, l, u, c, f, d = Yt, h, p = !1, y;
  function b(P) {
    return isNaN(P = +P) ? y : (P = 0.5 + ((P = +h(P)) - l) * (n * P < n * l ? c : f), d(p ? Math.max(0, Math.min(1, P)) : P));
  }
  b.domain = function(P) {
    return arguments.length ? ([e, t, r] = P, a = h(e = +e), l = h(t = +t), u = h(r = +r), c = a === l ? 0 : 0.5 / (l - a), f = l === u ? 0 : 0.5 / (u - l), n = l < a ? -1 : 1, b) : [e, t, r];
  }, b.clamp = function(P) {
    return arguments.length ? (p = !!P, b) : p;
  }, b.interpolator = function(P) {
    return arguments.length ? (d = P, b) : d;
  };
  function w(P) {
    return function(S) {
      var O, k, I;
      return arguments.length ? ([O, k, I] = S, d = gL(P, [O, k, I]), b) : [d(0), d(0.5), d(1)];
    };
  }
  return b.range = w(lo), b.rangeRound = w(qp), b.unknown = function(P) {
    return arguments.length ? (y = P, b) : y;
  }, function(P) {
    return h = P, a = P(e), l = P(t), u = P(r), c = a === l ? 0 : 0.5 / (l - a), f = l === u ? 0 : 0.5 / (u - l), n = l < a ? -1 : 1, b;
  };
}
function VO() {
  var e = hi(lf()(Yt));
  return e.copy = function() {
    return pi(e, VO());
  }, Dn.apply(e, arguments);
}
function GO() {
  var e = Jp(lf()).domain([0.1, 1, 10]);
  return e.copy = function() {
    return pi(e, GO()).base(e.base());
  }, Dn.apply(e, arguments);
}
function YO() {
  var e = em(lf());
  return e.copy = function() {
    return pi(e, YO()).constant(e.constant());
  }, Dn.apply(e, arguments);
}
function dm() {
  var e = tm(lf());
  return e.copy = function() {
    return pi(e, dm()).exponent(e.exponent());
  }, Dn.apply(e, arguments);
}
function l3() {
  return dm.apply(null, arguments).exponent(0.5);
}
const qO = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  scaleBand: Vp,
  scaleDiverging: VO,
  scaleDivergingLog: GO,
  scaleDivergingPow: dm,
  scaleDivergingSqrt: l3,
  scaleDivergingSymlog: YO,
  scaleIdentity: EO,
  scaleImplicit: Nh,
  scaleLinear: OO,
  scaleLog: CO,
  scaleOrdinal: Hp,
  scalePoint: YR,
  scalePow: rm,
  scaleQuantile: _O,
  scaleQuantize: TO,
  scaleRadial: jO,
  scaleSequential: WO,
  scaleSequentialLog: UO,
  scaleSequentialPow: fm,
  scaleSequentialQuantile: HO,
  scaleSequentialSqrt: o3,
  scaleSequentialSymlog: KO,
  scaleSqrt: FL,
  scaleSymlog: IO,
  scaleThreshold: MO,
  scaleTime: i3,
  scaleUtc: a3,
  tickFormat: AO
}, Symbol.toStringTag, { value: "Module" }));
function u3(e) {
  var t = qO;
  if (e in t && typeof t[e] == "function")
    return t[e]();
  var r = "scale".concat(Tl(e));
  if (r in t && typeof t[r] == "function")
    return t[r]();
}
function J1(e, t, r) {
  if (typeof e == "function")
    return e.copy().domain(t).range(r);
  if (e != null) {
    var n = u3(e);
    if (n != null)
      return n.domain(t).range(r), n;
  }
}
function vm(e, t, r, n) {
  if (!(r == null || n == null))
    return typeof e.scale == "function" ? J1(e.scale, r, n) : J1(t, r, n);
}
function s3(e) {
  return "scale".concat(Tl(e));
}
function c3(e) {
  return s3(e) in qO;
}
var XO = (e, t, r) => {
  if (e != null) {
    var n = e.scale, a = e.type;
    if (n === "auto")
      return a === "category" && r && (r.indexOf("LineChart") >= 0 || r.indexOf("AreaChart") >= 0 || r.indexOf("ComposedChart") >= 0 && !t) ? "point" : a === "category" ? "band" : "linear";
    if (typeof n == "string")
      return c3(n) ? n : "point";
  }
};
function f3(e, t) {
  for (var r = 0, n = e.length, a = e[0] < e[e.length - 1]; r < n; ) {
    var l = Math.floor((r + n) / 2);
    (a ? e[l] < t : e[l] > t) ? r = l + 1 : n = l;
  }
  return r;
}
function QO(e, t) {
  if (e) {
    var r = t ?? e.domain(), n = r.map((l) => {
      var u;
      return (u = e(l)) !== null && u !== void 0 ? u : 0;
    }), a = e.range();
    if (!(r.length === 0 || a.length < 2))
      return (l) => {
        var u, c, f = f3(n, l);
        if (f <= 0)
          return r[0];
        if (f >= r.length)
          return r[r.length - 1];
        var d = (u = n[f - 1]) !== null && u !== void 0 ? u : 0, h = (c = n[f]) !== null && c !== void 0 ? c : 0;
        return Math.abs(l - d) <= Math.abs(l - h) ? r[f - 1] : r[f];
      };
  }
}
function d3(e) {
  if (e != null)
    return "invert" in e && typeof e.invert == "function" ? e.invert.bind(e) : QO(e, void 0);
}
function ew(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function hc(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? ew(Object(r), !0).forEach(function(n) {
      v3(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : ew(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function v3(e, t, r) {
  return (t = h3(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function h3(e) {
  var t = p3(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function p3(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function ZO(e, t) {
  return x3(e) || g3(e, t) || y3(e, t) || m3();
}
function m3() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function y3(e, t) {
  if (e) {
    if (typeof e == "string") return tw(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? tw(e, t) : void 0;
  }
}
function tw(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function g3(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, a, l, u, c = [], f = !0, d = !1;
    try {
      if (l = (r = r.call(e)).next, t !== 0) for (; !(f = (n = l.call(r)).done) && (c.push(n.value), c.length !== t); f = !0) ;
    } catch (h) {
      d = !0, a = h;
    } finally {
      try {
        if (!f && r.return != null && (u = r.return(), Object(u) !== u)) return;
      } finally {
        if (d) throw a;
      }
    }
    return c;
  }
}
function x3(e) {
  if (Array.isArray(e)) return e;
}
var zh = [0, "auto"], ht = {
  allowDataOverflow: !1,
  allowDecimals: !0,
  allowDuplicatedCategory: !0,
  angle: 0,
  dataKey: void 0,
  domain: void 0,
  height: 30,
  hide: !0,
  id: 0,
  includeHidden: !1,
  interval: "preserveEnd",
  minTickGap: 5,
  mirror: !1,
  name: void 0,
  orientation: "bottom",
  padding: {
    left: 0,
    right: 0
  },
  reversed: !1,
  scale: "auto",
  tick: !0,
  tickCount: 5,
  tickFormatter: void 0,
  ticks: void 0,
  type: "category",
  unit: void 0,
  niceTicks: "auto"
}, JO = (e, t) => e.cartesianAxis.xAxis[t], Nn = (e, t) => {
  var r = JO(e, t);
  return r ?? ht;
}, pt = {
  allowDataOverflow: !1,
  allowDecimals: !0,
  allowDuplicatedCategory: !0,
  angle: 0,
  dataKey: void 0,
  domain: zh,
  hide: !0,
  id: 0,
  includeHidden: !1,
  interval: "preserveEnd",
  minTickGap: 5,
  mirror: !1,
  name: void 0,
  orientation: "left",
  padding: {
    top: 0,
    bottom: 0
  },
  reversed: !1,
  scale: "auto",
  tick: !0,
  tickCount: 5,
  tickFormatter: void 0,
  ticks: void 0,
  type: "number",
  unit: void 0,
  niceTicks: "auto",
  width: $l
}, eE = (e, t) => e.cartesianAxis.yAxis[t], $n = (e, t) => {
  var r = eE(e, t);
  return r ?? pt;
}, b3 = {
  domain: [0, "auto"],
  includeHidden: !1,
  reversed: !1,
  allowDataOverflow: !1,
  allowDuplicatedCategory: !1,
  dataKey: void 0,
  id: 0,
  name: "",
  range: [64, 64],
  scale: "auto",
  type: "number",
  unit: ""
}, hm = (e, t) => {
  var r = e.cartesianAxis.zAxis[t];
  return r ?? b3;
}, tt = (e, t, r) => {
  switch (t) {
    case "xAxis":
      return Nn(e, r);
    case "yAxis":
      return $n(e, r);
    case "zAxis":
      return hm(e, r);
    case "angleAxis":
      return zp(e, r);
    case "radiusAxis":
      return Bp(e, r);
    default:
      throw new Error("Unexpected axis type: ".concat(t));
  }
}, w3 = (e, t, r) => {
  switch (t) {
    case "xAxis":
      return Nn(e, r);
    case "yAxis":
      return $n(e, r);
    default:
      throw new Error("Unexpected axis type: ".concat(t));
  }
}, uo = (e, t, r) => {
  switch (t) {
    case "xAxis":
      return Nn(e, r);
    case "yAxis":
      return $n(e, r);
    case "angleAxis":
      return zp(e, r);
    case "radiusAxis":
      return Bp(e, r);
    default:
      throw new Error("Unexpected axis type: ".concat(t));
  }
}, tE = (e) => e.graphicalItems.cartesianItems.some((t) => t.type === "bar") || e.graphicalItems.polarItems.some((t) => t.type === "radialBar");
function pm(e, t) {
  return (r) => {
    switch (e) {
      case "xAxis":
        return "xAxisId" in r && r.xAxisId === t;
      case "yAxis":
        return "yAxisId" in r && r.yAxisId === t;
      case "zAxis":
        return "zAxisId" in r && r.zAxisId === t;
      case "angleAxis":
        return "angleAxisId" in r && r.angleAxisId === t;
      case "radiusAxis":
        return "radiusAxisId" in r && r.radiusAxisId === t;
      default:
        return !1;
    }
  };
}
var uf = (e) => e.graphicalItems.cartesianItems, S3 = $([et, Ul], pm), mm = (e, t, r) => e.filter(r).filter((n) => (t == null ? void 0 : t.includeHidden) === !0 ? !0 : !n.hide), so = $([uf, tt, S3], mm, {
  memoizeOptions: {
    resultEqualityCheck: ef
  }
}), rE = $([so], (e) => e.filter((t) => t.type === "area" || t.type === "bar").filter(Jc)), nE = (e) => e.filter((t) => !("stackId" in t) || t.stackId === void 0), P3 = $([so], nE), ym = (e) => e.map((t) => t.data).filter(Boolean).flat(1), A3 = $([so], (e) => e.some((t) => !t.data)), iE = $([so], ym, {
  memoizeOptions: {
    resultEqualityCheck: ef
  }
}), gm = (e, t) => {
  var r = t.chartData, n = r === void 0 ? [] : r, a = t.dataStartIndex, l = t.dataEndIndex;
  return e.length > 0 ? e : n.slice(a, l + 1);
}, xm = $([iE, Fl], gm), aE = (e, t, r) => (t == null ? void 0 : t.dataKey) != null ? e.map((n) => ({
  value: Le(n, t.dataKey)
})) : r.length > 0 ? r.map((n) => n.dataKey).flatMap((n) => e.map((a) => ({
  value: Le(a, n)
}))) : e.map((n) => ({
  value: n
})), oE = (e, t, r, n, a, l) => {
  var u = n.chartData, c = u === void 0 ? [] : u, f = n.dataStartIndex, d = n.dataEndIndex, h = aE(e, t, r);
  if (a && (t == null ? void 0 : t.dataKey) != null && l.length > 0) {
    var p = c.slice(f, d + 1), y = p.map((b) => ({
      value: Le(b, t.dataKey)
    })).filter((b) => b.value != null);
    return [...y, ...h];
  }
  return h;
}, ql = $([xm, tt, so, Fl, A3, iE], oE);
function Ka(e) {
  if (sn(e) || e instanceof Date) {
    var t = Number(e);
    if (Ie(t))
      return t;
  }
}
function rw(e) {
  if (Array.isArray(e)) {
    var t = [Ka(e[0]), Ka(e[1])];
    return an(t) ? t : void 0;
  }
  var r = Ka(e);
  if (r != null)
    return [r, r];
}
function Ur(e) {
  return e.map(Ka).filter(nr);
}
function O3(e, t) {
  var r = Ka(e), n = Ka(t);
  return r == null && n == null ? 0 : r == null ? -1 : n == null ? 1 : r - n;
}
var E3 = $([ql], (e) => e == null ? void 0 : e.map((t) => t.value).sort(O3));
function lE(e, t) {
  switch (e) {
    case "xAxis":
      return t.direction === "x";
    case "yAxis":
      return t.direction === "y";
    default:
      return !1;
  }
}
function k3(e, t, r) {
  if (!r)
    return [];
  if (!r.length)
    return [];
  var n;
  if (typeof t == "number" && !un(t))
    n = t;
  else if (Array.isArray(t)) {
    var a = Ur(t);
    a.length > 0 && (n = Math.max(...a));
  }
  return n == null ? [] : Ur(r.flatMap((l) => {
    var u = Le(e, l.dataKey), c, f;
    if (Array.isArray(u)) {
      var d = ZO(u, 2);
      c = d[0], f = d[1];
    } else
      c = f = u;
    if (!(!Ie(c) || !Ie(f)))
      return [n - c, n + f];
  }));
}
var wt = (e) => {
  var t = kt(e), r = oo(e);
  return uo(e, t, r);
}, Za = $([wt], (e) => e == null ? void 0 : e.dataKey), C3 = $([rE, Fl, wt], hO), uE = (e, t, r, n) => {
  var a = {}, l = t.reduce((u, c) => {
    if (c.stackId == null)
      return u;
    var f = u[c.stackId];
    return f == null && (f = []), f.push(c), u[c.stackId] = f, u;
  }, a);
  return Object.fromEntries(Object.entries(l).map((u) => {
    var c = ZO(u, 2), f = c[0], d = c[1], h = n ? [...d].reverse() : d, p = h.map(Wp);
    return [f, {
      // @ts-expect-error getStackedData requires that the input is array of objects, Recharts does not test for that
      stackedData: BM(e, p, r),
      graphicalItems: h
    }];
  }));
}, Bh = $([C3, rE, Wl, lO], uE), sE = (e, t, r, n) => {
  var a = t.dataStartIndex, l = t.dataEndIndex;
  if (n == null && r !== "zAxis")
    return HM(e, a, l);
}, I3 = $([tt], (e) => e.allowDataOverflow), bm = (e) => {
  var t;
  if (e == null || !("domain" in e))
    return zh;
  if (e.domain != null)
    return e.domain;
  if ("ticks" in e && e.ticks != null) {
    if (e.type === "number") {
      var r = Ur(e.ticks);
      return [Math.min(...r), Math.max(...r)];
    }
    if (e.type === "category")
      return e.ticks.map(String);
  }
  return (t = e == null ? void 0 : e.domain) !== null && t !== void 0 ? t : zh;
}, wm = $([tt], bm), Sm = $([wm, I3], YA), j3 = $([Bh, Hr, et, Sm], sE, {
  memoizeOptions: {
    resultEqualityCheck: Kl
  }
}), sf = (e) => e.errorBars, _3 = (e, t, r) => e.flatMap((n) => t[n.id]).filter(Boolean).filter((n) => lE(r, n)), pc = function() {
  for (var t = arguments.length, r = new Array(t), n = 0; n < t; n++)
    r[n] = arguments[n];
  var a = r.filter(Boolean);
  if (a.length !== 0) {
    var l = a.flat(), u = Math.min(...l), c = Math.max(...l);
    return [u, c];
  }
}, Pm = function(t, r, n, a, l) {
  var u = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : [], c, f;
  if (n.length > 0 && n.forEach((d) => {
    var h, p = d.data != null ? [...d.data] : u, y = (h = a[d.id]) === null || h === void 0 ? void 0 : h.filter((b) => lE(l, b));
    p.forEach((b) => {
      var w, P = Le(b, (w = r.dataKey) !== null && w !== void 0 ? w : d.dataKey), S = k3(b, P, y);
      if (S.length >= 2) {
        var O = Math.min(...S), k = Math.max(...S);
        (c == null || O < c) && (c = O), (f == null || k > f) && (f = k);
      }
      var I = rw(P);
      I != null && (c = c == null ? I[0] : Math.min(c, I[0]), f = f == null ? I[1] : Math.max(f, I[1]));
    });
  }), (r == null ? void 0 : r.dataKey) != null && n.length === 0 && t.forEach((d) => {
    var h = rw(Le(d, r.dataKey));
    h != null && (c = c == null ? h[0] : Math.min(c, h[0]), f = f == null ? h[1] : Math.max(f, h[1]));
  }), Ie(c) && Ie(f))
    return [c, f];
}, T3 = $([xm, tt, P3, sf, et, sR], Pm, {
  memoizeOptions: {
    resultEqualityCheck: Kl
  }
});
function M3(e) {
  var t = e.value;
  if (sn(t) || t instanceof Date)
    return t;
}
var D3 = (e, t, r) => {
  var n = e.map(M3).filter((a) => a != null);
  return r && (t.dataKey == null || t.allowDuplicatedCategory && KS(n)) ? GA(0, e.length) : t.allowDuplicatedCategory ? n : Array.from(new Set(n));
}, cE = (e) => e.referenceElements.dots, co = (e, t, r) => e.filter((n) => n.ifOverflow === "extendDomain").filter((n) => t === "xAxis" ? n.xAxisId === r : n.yAxisId === r), N3 = $([cE, et, Ul], co), fE = (e) => e.referenceElements.areas, $3 = $([fE, et, Ul], co), dE = (e) => e.referenceElements.lines, R3 = $([dE, et, Ul], co), vE = (e, t) => {
  if (e != null) {
    var r = Ur(e.map((n) => t === "xAxis" ? n.x : n.y));
    if (r.length !== 0)
      return [Math.min(...r), Math.max(...r)];
  }
}, L3 = $(N3, et, vE), hE = (e, t) => {
  if (e != null) {
    var r = Ur(e.flatMap((n) => [t === "xAxis" ? n.x1 : n.y1, t === "xAxis" ? n.x2 : n.y2]));
    if (r.length !== 0)
      return [Math.min(...r), Math.max(...r)];
  }
}, z3 = $([$3, et], hE);
function B3(e) {
  var t;
  if (e.x != null)
    return Ur([e.x]);
  var r = (t = e.segment) === null || t === void 0 ? void 0 : t.map((n) => n.x);
  return r == null || r.length === 0 ? [] : Ur(r);
}
function F3(e) {
  var t;
  if (e.y != null)
    return Ur([e.y]);
  var r = (t = e.segment) === null || t === void 0 ? void 0 : t.map((n) => n.y);
  return r == null || r.length === 0 ? [] : Ur(r);
}
var pE = (e, t) => {
  if (e != null) {
    var r = e.flatMap((n) => t === "xAxis" ? B3(n) : F3(n));
    if (r.length !== 0)
      return [Math.min(...r), Math.max(...r)];
  }
}, W3 = $([R3, et], pE), U3 = $(L3, W3, z3, (e, t, r) => pc(e, r, t)), Am = (e, t, r, n, a, l, u, c, f) => {
  if (r != null)
    return r;
  var d = u === "vertical" && c === "xAxis" || u === "horizontal" && c === "yAxis", h = d ? pc(n, l, a) : pc(l, a), p = mR(t, h, e.allowDataOverflow);
  return p ?? (e.allowDataOverflow && h == null && f != null ? f : p);
}, K3 = (e) => {
  if (!(e == null || e.type !== "number" || !("ticks" in e) || e.ticks == null)) {
    var t = Ur(e.ticks);
    if (t.length !== 0)
      return [Math.min(...t), Math.max(...t)];
  }
}, H3 = $([tt], K3, {
  memoizeOptions: {
    resultEqualityCheck: Kl
  }
}), V3 = $([tt, wm, Sm, j3, T3, U3, Ne, et, H3], Am, {
  memoizeOptions: {
    resultEqualityCheck: Kl
  }
}), G3 = [0, 1], Om = (e, t, r, n, a, l, u) => {
  if (!((e == null || r == null || r.length === 0) && u === void 0)) {
    var c = e.dataKey, f = e.type, d = Mn(t, l);
    if (d && c == null) {
      var h;
      return GA(0, (h = r == null ? void 0 : r.length) !== null && h !== void 0 ? h : 0);
    }
    return f === "category" ? D3(n, e, d) : a === "expand" && !d ? G3 : u;
  }
}, Em = $([tt, Ne, xm, ql, Wl, et, V3], Om), mi = $([tt, tE, $p], XO), km = (e, t, r) => {
  var n = t.niceTicks;
  if (n !== "none") {
    var a = bm(t), l = Array.isArray(a) && (a[0] === "auto" || a[1] === "auto");
    if ((n === "snap125" || n === "adaptive") && t != null && t.tickCount && an(e)) {
      if (l)
        return f1(e, t.tickCount, t.allowDecimals, n);
      if (t.type === "number")
        return d1(e, t.tickCount, t.allowDecimals, n);
    }
    if (n === "auto" && r === "linear" && t != null && t.tickCount) {
      if (l && an(e))
        return f1(e, t.tickCount, t.allowDecimals, "adaptive");
      if (t.type === "number" && an(e))
        return d1(e, t.tickCount, t.allowDecimals, "adaptive");
    }
  }
}, Cm = $([Em, uo, mi], km), Im = (e, t, r, n) => {
  if (
    /*
     * Angle axis for some reason uses nice ticks when rendering axis tick labels,
     * but doesn't use nice ticks for extending domain like all the other axes do.
     * Not really sure why? Is there a good reason,
     * or is it just because someone added support for nice ticks to the other axes and forgot this one?
     */
    n !== "angleAxis" && (e == null ? void 0 : e.type) === "number" && an(t) && Array.isArray(r) && r.length > 0
  ) {
    var a, l, u = t[0], c = (a = r[0]) !== null && a !== void 0 ? a : 0, f = t[1], d = (l = r[r.length - 1]) !== null && l !== void 0 ? l : 0;
    return [Math.min(u, c), Math.max(f, d)];
  }
  return t;
}, Y3 = $([tt, Em, Cm, et], Im), q3 = $(ql, tt, (e, t) => {
  if (!(!t || t.type !== "number")) {
    var r = 1 / 0, n = Array.from(Ur(e.map((p) => p.value))).sort((p, y) => p - y), a = n[0], l = n[n.length - 1];
    if (a == null || l == null)
      return 1 / 0;
    var u = l - a;
    if (u === 0)
      return 1 / 0;
    for (var c = 0; c < n.length - 1; c++) {
      var f = n[c], d = n[c + 1];
      if (!(f == null || d == null)) {
        var h = d - f;
        r = Math.min(r, h);
      }
    }
    return r / u;
  }
}), mE = $(q3, Ne, oO, xt, (e, t, r, n, a) => a, (e, t, r, n, a) => {
  if (!Ie(e))
    return 0;
  var l = t === "vertical" ? n.height : n.width;
  if (a === "gap")
    return e * l / 2;
  if (a === "no-gap") {
    var u = Wt(r, e * l), c = e * l / 2;
    return c - u - (c - u) / l * u;
  }
  return 0;
}), X3 = (e, t, r) => {
  var n = Nn(e, t);
  return n == null || typeof n.padding != "string" ? 0 : mE(e, "xAxis", t, r, n.padding);
}, Q3 = (e, t, r) => {
  var n = $n(e, t);
  return n == null || typeof n.padding != "string" ? 0 : mE(e, "yAxis", t, r, n.padding);
}, Z3 = $(Nn, X3, (e, t) => {
  var r, n;
  if (e == null)
    return {
      left: 0,
      right: 0
    };
  var a = e.padding;
  return typeof a == "string" ? {
    left: t,
    right: t
  } : {
    left: ((r = a.left) !== null && r !== void 0 ? r : 0) + t,
    right: ((n = a.right) !== null && n !== void 0 ? n : 0) + t
  };
}), J3 = $($n, Q3, (e, t) => {
  var r, n;
  if (e == null)
    return {
      top: 0,
      bottom: 0
    };
  var a = e.padding;
  return typeof a == "string" ? {
    top: t,
    bottom: t
  } : {
    top: ((r = a.top) !== null && r !== void 0 ? r : 0) + t,
    bottom: ((n = a.bottom) !== null && n !== void 0 ? n : 0) + t
  };
}), yE = $([xt, Z3, Gc, Vc, (e, t, r) => r], (e, t, r, n, a) => {
  var l = n.padding;
  return a ? [l.left, r.width - l.right] : [e.left + t.left, e.left + e.width - t.right];
}), gE = $([xt, Ne, J3, Gc, Vc, (e, t, r) => r], (e, t, r, n, a, l) => {
  var u = a.padding;
  return l ? [n.height - u.bottom, u.top] : t === "horizontal" ? [e.top + e.height - r.bottom, e.top + r.top] : [e.top + r.top, e.top + e.height - r.bottom];
}), Xl = (e, t, r, n) => {
  var a;
  switch (t) {
    case "xAxis":
      return yE(e, r, n);
    case "yAxis":
      return gE(e, r, n);
    case "zAxis":
      return (a = hm(e, r)) === null || a === void 0 ? void 0 : a.range;
    case "angleAxis":
      return fO(e);
    case "radiusAxis":
      return dO(e, r);
    default:
      return;
  }
}, xE = $([tt, Xl], Xc), e4 = $([mi, Y3], pO), jm = $([tt, mi, e4, xE], vm), bE = (e, t, r, n) => {
  if (!(r == null || r.dataKey == null)) {
    var a = r.type, l = r.scale, u = Mn(e, n);
    if (u && (a === "number" || l !== "auto"))
      return t.map((c) => c.value);
  }
}, _m = $([Ne, ql, uo, et], bE), cf = $([jm], Up);
$([jm], d3);
$([jm, E3], QO);
$([so, sf, et], _3);
function wE(e, t) {
  return e.id < t.id ? -1 : e.id > t.id ? 1 : 0;
}
var ff = (e, t) => t, df = (e, t, r) => r, t4 = $(Kc, ff, df, (e, t, r) => e.filter((n) => n.orientation === t).filter((n) => n.mirror === r).sort(wE)), r4 = $(Hc, ff, df, (e, t, r) => e.filter((n) => n.orientation === t).filter((n) => n.mirror === r).sort(wE)), SE = (e, t) => {
  var r = typeof t.height == "number" ? t.height : Op;
  return {
    width: e.width,
    height: r
  };
}, n4 = (e, t) => {
  var r = typeof t.width == "number" ? t.width : $l;
  return {
    width: r,
    height: e.height
  };
}, PE = $(xt, Nn, SE), i4 = (e, t, r) => {
  switch (t) {
    case "top":
      return e.top;
    case "bottom":
      return r - e.bottom;
    default:
      return 0;
  }
}, a4 = (e, t, r) => {
  switch (t) {
    case "left":
      return e.left;
    case "right":
      return r - e.right;
    default:
      return 0;
  }
}, o4 = $(vn, xt, t4, ff, df, (e, t, r, n, a) => {
  var l = {}, u;
  return r.forEach((c) => {
    var f = SE(t, c);
    u == null && (u = i4(t, n, e));
    var d = n === "top" && !a || n === "bottom" && a;
    l[c.id] = u - Number(d) * f.height, u += (d ? -1 : 1) * f.height;
  }), l;
}), l4 = $(dn, xt, r4, ff, df, (e, t, r, n, a) => {
  var l = {}, u;
  return r.forEach((c) => {
    var f = n4(t, c);
    u == null && (u = a4(t, n, e));
    var d = n === "left" && !a || n === "right" && a;
    l[c.id] = u - Number(d) * f.width, u += (d ? -1 : 1) * f.width;
  }), l;
}), u4 = (e, t) => {
  var r = Nn(e, t);
  if (r != null)
    return o4(e, r.orientation, r.mirror);
}, s4 = $([xt, Nn, u4, (e, t) => t], (e, t, r, n) => {
  if (t != null) {
    var a = r == null ? void 0 : r[n];
    return a == null ? {
      x: e.left,
      y: 0
    } : {
      x: e.left,
      y: a
    };
  }
}), c4 = (e, t) => {
  var r = $n(e, t);
  if (r != null)
    return l4(e, r.orientation, r.mirror);
}, f4 = $([xt, $n, c4, (e, t) => t], (e, t, r, n) => {
  if (t != null) {
    var a = r == null ? void 0 : r[n];
    return a == null ? {
      x: 0,
      y: e.top
    } : {
      x: a,
      y: e.top
    };
  }
}), AE = $(xt, $n, (e, t) => {
  var r = typeof t.width == "number" ? t.width : $l;
  return {
    width: r,
    height: e.height
  };
}), nw = (e, t, r) => {
  switch (t) {
    case "xAxis":
      return PE(e, r).width;
    case "yAxis":
      return AE(e, r).height;
    default:
      return;
  }
}, OE = (e, t, r, n) => {
  if (r != null) {
    var a = r.allowDuplicatedCategory, l = r.type, u = r.dataKey, c = Mn(e, n), f = t.map((h) => h.value), d = f.filter((h) => h != null);
    if (u && c && l === "category" && a && KS(d))
      return f;
  }
}, Tm = $([Ne, ql, tt, et], OE), iw = $([Ne, w3, mi, cf, Tm, _m, Xl, Cm, et], (e, t, r, n, a, l, u, c, f) => {
  if (t != null) {
    var d = Mn(e, f);
    return {
      angle: t.angle,
      interval: t.interval,
      minTickGap: t.minTickGap,
      orientation: t.orientation,
      tick: t.tick,
      tickCount: t.tickCount,
      tickFormatter: t.tickFormatter,
      ticks: t.ticks,
      type: t.type,
      unit: t.unit,
      axisType: f,
      categoricalDomain: l,
      duplicateDomain: a,
      isCategorical: d,
      niceTicks: c,
      range: u,
      realScaleType: r,
      scale: n
    };
  }
}), d4 = (e, t, r, n, a, l, u, c, f) => {
  if (!(t == null || n == null)) {
    var d = Mn(e, f), h = t.type, p = t.ticks, y = t.tickCount, b = (
      // @ts-expect-error This is testing for `scaleBand` but for band axis the type is reported as `band` so this looks like a dead code with a workaround elsewhere?
      r === "scaleBand" && typeof n.bandwidth == "function" ? n.bandwidth() / 2 : 2
    ), w = h === "category" && n.bandwidth ? n.bandwidth() / b : 0;
    w = f === "angleAxis" && l != null && l.length >= 2 ? Et(l[0] - l[1]) * 2 * w : w;
    var P = p || a;
    return P ? P.map((S, O) => {
      var k = u ? u.indexOf(S) : S, I = n.map(k);
      return Ie(I) ? {
        index: O,
        coordinate: I + w,
        value: S,
        offset: w
      } : null;
    }).filter(nr) : d && c ? c.map((S, O) => {
      var k = n.map(S);
      return Ie(k) ? {
        coordinate: k + w,
        value: S,
        index: O,
        offset: w
      } : null;
    }).filter(nr) : n.ticks ? n.ticks(y).map((S, O) => {
      var k = n.map(S);
      return Ie(k) ? {
        coordinate: k + w,
        value: S,
        index: O,
        offset: w
      } : null;
    }).filter(nr) : n.domain().map((S, O) => {
      var k = n.map(S);
      return Ie(k) ? {
        coordinate: k + w,
        // @ts-expect-error can't use Date as index
        value: u ? u[S] : S,
        index: O,
        offset: w
      } : null;
    }).filter(nr);
  }
}, EE = $([Ne, uo, mi, cf, Cm, Xl, Tm, _m, et], d4), v4 = (e, t, r, n, a, l, u) => {
  if (!(t == null || r == null || n == null || n[0] === n[1])) {
    var c = Mn(e, u), f = t.tickCount, d = 0;
    return d = u === "angleAxis" && (n == null ? void 0 : n.length) >= 2 ? Et(n[0] - n[1]) * 2 * d : d, c && l ? l.map((h, p) => {
      var y = r.map(h);
      return Ie(y) ? {
        coordinate: y + d,
        value: h,
        index: p,
        offset: d
      } : null;
    }).filter(nr) : r.ticks ? r.ticks(f).map((h, p) => {
      var y = r.map(h);
      return Ie(y) ? {
        coordinate: y + d,
        value: h,
        index: p,
        offset: d
      } : null;
    }).filter(nr) : r.domain().map((h, p) => {
      var y = r.map(h);
      return Ie(y) ? {
        coordinate: y + d,
        // @ts-expect-error can't use unknown as index
        value: a ? a[h] : h,
        index: p,
        offset: d
      } : null;
    }).filter(nr);
  }
}, ci = $([Ne, uo, cf, Xl, Tm, _m, et], v4), fi = $(tt, cf, (e, t) => {
  if (!(e == null || t == null))
    return hc(hc({}, e), {}, {
      scale: t
    });
}), h4 = $([tt, mi, Em, xE], vm), p4 = $([h4], Up);
$((e, t, r) => hm(e, r), p4, (e, t) => {
  if (!(e == null || t == null))
    return hc(hc({}, e), {}, {
      scale: t
    });
});
var m4 = $([Ne, Kc, Hc], (e, t, r) => {
  switch (e) {
    case "horizontal":
      return t.some((n) => n.reversed) ? "right-to-left" : "left-to-right";
    case "vertical":
      return r.some((n) => n.reversed) ? "bottom-to-top" : "top-to-bottom";
    // TODO: make this better. For now, right arrow triggers "forward", left arrow "back"
    // however, the tooltip moves an unintuitive direction because of how the indices are rendered
    case "centric":
    case "radial":
      return "left-to-right";
    default:
      return;
  }
}), y4 = (e, t, r) => {
  var n;
  return (n = e.renderedTicks[t]) === null || n === void 0 ? void 0 : n[r];
};
$([y4], (e) => {
  if (!(!e || e.length === 0))
    return (t) => {
      var r, n = 1 / 0, a = e[0];
      for (var l of e) {
        var u = Math.abs(l.coordinate - t);
        u < n && (n = u, a = l);
      }
      return (r = a) === null || r === void 0 ? void 0 : r.value;
    };
});
var kE = (e) => e.options.defaultTooltipEventType, CE = (e) => e.options.validateTooltipEventTypes;
function IE(e, t, r) {
  if (e == null)
    return t;
  var n = e ? "axis" : "item";
  return r == null ? t : r.includes(n) ? n : t;
}
function Ql(e, t) {
  var r = kE(e), n = CE(e);
  return IE(t, r, n);
}
function g4(e) {
  return ue((t) => Ql(t, e));
}
var jE = (e, t) => {
  var r, n = Number(t);
  if (!(un(n) || t == null))
    return n >= 0 ? e == null || (r = e[n]) === null || r === void 0 ? void 0 : r.value : void 0;
}, x4 = (e) => e.tooltip.settings, li = {
  active: !1,
  index: null,
  dataKey: void 0,
  graphicalItemId: void 0,
  coordinate: void 0
}, b4 = {
  itemInteraction: {
    click: li,
    hover: li
  },
  axisInteraction: {
    click: li,
    hover: li
  },
  keyboardInteraction: li,
  syncInteraction: {
    active: !1,
    index: null,
    dataKey: void 0,
    label: void 0,
    coordinate: void 0,
    sourceViewBox: void 0,
    graphicalItemId: void 0
  },
  tooltipItemPayloads: [],
  settings: {
    shared: void 0,
    trigger: "hover",
    axisId: 0,
    active: !1,
    defaultIndex: void 0
  }
}, _E = Kt({
  name: "tooltip",
  initialState: b4,
  reducers: {
    addTooltipEntrySettings: {
      reducer(e, t) {
        e.tooltipItemPayloads.push(Me(t.payload));
      },
      prepare: Ve()
    },
    replaceTooltipEntrySettings: {
      reducer(e, t) {
        var r = t.payload, n = r.prev, a = r.next, l = Er(e).tooltipItemPayloads.indexOf(Me(n));
        l > -1 && (e.tooltipItemPayloads[l] = Me(a));
      },
      prepare: Ve()
    },
    removeTooltipEntrySettings: {
      reducer(e, t) {
        var r = Er(e).tooltipItemPayloads.indexOf(Me(t.payload));
        r > -1 && e.tooltipItemPayloads.splice(r, 1);
      },
      prepare: Ve()
    },
    setTooltipSettingsState(e, t) {
      e.settings = t.payload;
    },
    setActiveMouseOverItemIndex(e, t) {
      e.syncInteraction.active = !1, e.syncInteraction.sourceViewBox = void 0, e.keyboardInteraction.active = !1, e.itemInteraction.hover.active = !0, e.itemInteraction.hover.index = t.payload.activeIndex, e.itemInteraction.hover.dataKey = t.payload.activeDataKey, e.itemInteraction.hover.graphicalItemId = t.payload.activeGraphicalItemId, e.itemInteraction.hover.coordinate = t.payload.activeCoordinate;
    },
    mouseLeaveChart(e) {
      e.itemInteraction.hover.active = !1, e.axisInteraction.hover.active = !1;
    },
    mouseLeaveItem(e) {
      e.itemInteraction.hover.active = !1;
    },
    setActiveClickItemIndex(e, t) {
      e.syncInteraction.active = !1, e.syncInteraction.sourceViewBox = void 0, e.itemInteraction.click.active = !0, e.keyboardInteraction.active = !1, e.itemInteraction.click.index = t.payload.activeIndex, e.itemInteraction.click.dataKey = t.payload.activeDataKey, e.itemInteraction.click.graphicalItemId = t.payload.activeGraphicalItemId, e.itemInteraction.click.coordinate = t.payload.activeCoordinate;
    },
    setMouseOverAxisIndex(e, t) {
      e.syncInteraction.active = !1, e.syncInteraction.sourceViewBox = void 0, e.axisInteraction.hover.active = !0, e.keyboardInteraction.active = !1, e.axisInteraction.hover.index = t.payload.activeIndex, e.axisInteraction.hover.dataKey = t.payload.activeDataKey, e.axisInteraction.hover.coordinate = t.payload.activeCoordinate;
    },
    setMouseClickAxisIndex(e, t) {
      e.syncInteraction.active = !1, e.syncInteraction.sourceViewBox = void 0, e.keyboardInteraction.active = !1, e.axisInteraction.click.active = !0, e.axisInteraction.click.index = t.payload.activeIndex, e.axisInteraction.click.dataKey = t.payload.activeDataKey, e.axisInteraction.click.coordinate = t.payload.activeCoordinate;
    },
    setSyncInteraction(e, t) {
      e.syncInteraction = t.payload;
    },
    setKeyboardInteraction(e, t) {
      e.keyboardInteraction.active = t.payload.active, e.keyboardInteraction.index = t.payload.activeIndex, e.keyboardInteraction.coordinate = t.payload.activeCoordinate;
    }
  }
}), _r = _E.actions, w4 = _r.addTooltipEntrySettings, S4 = _r.replaceTooltipEntrySettings, P4 = _r.removeTooltipEntrySettings, A4 = _r.setTooltipSettingsState, TE = _r.setActiveMouseOverItemIndex, O4 = _r.mouseLeaveItem, ME = _r.mouseLeaveChart, E4 = _r.setActiveClickItemIndex, DE = _r.setMouseOverAxisIndex, k4 = _r.setMouseClickAxisIndex, hl = _r.setSyncInteraction, mc = _r.setKeyboardInteraction, C4 = _E.reducer;
function aw(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Ss(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? aw(Object(r), !0).forEach(function(n) {
      I4(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : aw(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function I4(e, t, r) {
  return (t = j4(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function j4(e) {
  var t = _4(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function _4(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function T4(e, t, r) {
  return t === "axis" ? r === "click" ? e.axisInteraction.click : e.axisInteraction.hover : r === "click" ? e.itemInteraction.click : e.itemInteraction.hover;
}
function M4(e) {
  return e.index != null;
}
var NE = (e, t, r, n) => {
  if (t == null)
    return li;
  var a = T4(e, t, r);
  if (a == null)
    return li;
  if (a.active)
    return a;
  if (e.keyboardInteraction.active)
    return e.keyboardInteraction;
  if (e.syncInteraction.active && e.syncInteraction.index != null)
    return e.syncInteraction;
  var l = e.settings.active === !0;
  if (M4(a)) {
    if (l)
      return Ss(Ss({}, a), {}, {
        active: !0
      });
  } else if (n != null)
    return {
      active: !0,
      coordinate: void 0,
      dataKey: void 0,
      index: n,
      graphicalItemId: void 0
    };
  return Ss(Ss({}, li), {}, {
    coordinate: a.coordinate
  });
};
function D4(e) {
  if (typeof e == "number")
    return Number.isFinite(e) ? e : void 0;
  if (e instanceof Date) {
    var t = e.valueOf();
    return Number.isFinite(t) ? t : void 0;
  }
  var r = Number(e);
  return Number.isFinite(r) ? r : void 0;
}
function N4(e, t) {
  var r = D4(e), n = t[0], a = t[1];
  if (r === void 0)
    return !1;
  var l = Math.min(n, a), u = Math.max(n, a);
  return r >= l && r <= u;
}
function $4(e, t, r) {
  if (r == null || t == null)
    return !0;
  var n = Le(e, t);
  return n == null || !an(r) ? !0 : N4(n, r);
}
var yl = (e, t, r, n) => {
  var a = e == null ? void 0 : e.index;
  if (a == null)
    return null;
  var l = Number(a);
  if (!Ie(l))
    return a;
  var u = 0, c = 1 / 0;
  t.length > 0 && (c = t.length - 1);
  var f = Math.max(u, Math.min(l, c)), d = t[f];
  return d == null || $4(d, r, n) ? String(f) : null;
}, $E = (e, t, r, n, a, l, u) => {
  if (l != null) {
    var c = u[0], f = c == null ? void 0 : c.getPosition(l);
    if (f != null)
      return f;
    var d = a == null ? void 0 : a[Number(l)];
    if (d)
      switch (r) {
        case "horizontal":
          return {
            x: d.coordinate,
            y: (n.top + t) / 2
          };
        default:
          return {
            x: (n.left + e) / 2,
            y: d.coordinate
          };
      }
  }
}, RE = (e, t, r, n) => {
  if (t === "axis")
    return e.tooltipItemPayloads;
  if (e.tooltipItemPayloads.length === 0)
    return [];
  var a;
  if (r === "hover" ? a = e.itemInteraction.hover.graphicalItemId : a = e.itemInteraction.click.graphicalItemId, e.syncInteraction.active && a == null)
    return e.tooltipItemPayloads;
  if (a == null && (n != null || e.keyboardInteraction.active)) {
    var l = e.tooltipItemPayloads[0];
    return l != null ? [l] : [];
  }
  return e.tooltipItemPayloads.filter((u) => {
    var c;
    return ((c = u.settings) === null || c === void 0 ? void 0 : c.graphicalItemId) === a;
  });
}, LE = (e) => e.options.tooltipPayloadSearcher, fo = (e) => e.tooltip;
function ow(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function lw(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? ow(Object(r), !0).forEach(function(n) {
      R4(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : ow(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function R4(e, t, r) {
  return (t = L4(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function L4(e) {
  var t = z4(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function z4(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function B4(e) {
  if (typeof e == "string" || typeof e == "number")
    return e;
}
function F4(e) {
  if (typeof e == "string" || typeof e == "number" || typeof e == "boolean")
    return e;
}
function W4(e) {
  if (typeof e == "string" || typeof e == "number")
    return e;
  if (typeof e == "function")
    return (t) => e(t);
}
function uw(e) {
  if (typeof e == "string")
    return e;
}
function U4(e) {
  if (!(e == null || typeof e != "object")) {
    var t = "name" in e ? B4(e.name) : void 0, r = "unit" in e ? F4(e.unit) : void 0, n = "dataKey" in e ? W4(e.dataKey) : void 0, a = "payload" in e ? e.payload : void 0, l = "color" in e ? uw(e.color) : void 0, u = "fill" in e ? uw(e.fill) : void 0;
    return {
      name: t,
      unit: r,
      dataKey: n,
      payload: a,
      color: l,
      fill: u
    };
  }
}
function K4(e, t) {
  return e ?? t;
}
var zE = (e, t, r, n, a, l, u) => {
  if (!(t == null || l == null)) {
    var c = r.chartData, f = r.computedData, d = r.dataStartIndex, h = r.dataEndIndex, p = [];
    return e.reduce((y, b) => {
      var w, P = b.dataDefinedOnItem, S = b.settings, O = K4(P, c), k = Array.isArray(O) ? xA(O, d, h) : O, I = (w = S == null ? void 0 : S.dataKey) !== null && w !== void 0 ? w : n, E = S == null ? void 0 : S.nameKey, _;
      if (n && Array.isArray(k) && /*
       * findEntryInArray won't work for Scatter because Scatter provides an array of arrays
       * as tooltip payloads and findEntryInArray is not prepared to handle that.
       * Sad but also ScatterChart only allows 'item' tooltipEventType
       * and also this is only a problem if there are multiple Scatters and each has its own data array
       * so let's fix that some other time.
       */
      !Array.isArray(k[0]) && /*
       * If the tooltipEventType is 'axis', we should search for the dataKey in the sliced data
       * because thanks to allowDuplicatedCategory=false, the order of elements in the array
       * no longer matches the order of elements in the original data
       * and so we need to search by the active dataKey + label rather than by index.
       *
       * The same happens if multiple graphical items are present in the chart
       * and each of them has its own data array. Those arrays get concatenated
       * and again the tooltip index no longer matches the original data.
       *
       * On the other hand the tooltipEventType 'item' should always search by index
       * because we get the index from interacting over the individual elements
       * which is always accurate, irrespective of the allowDuplicatedCategory setting.
       */
      u === "axis" ? (_ = HS(k, n, a), _ == null && (_ = l(k, t, f, E))) : _ = l(k, t, f, E), Array.isArray(_))
        _.forEach((R) => {
          var W, V, K = U4(R), G = K == null ? void 0 : K.name, F = K == null ? void 0 : K.dataKey, ie = K == null ? void 0 : K.payload, re = lw(lw({}, S), {}, {
            name: G,
            unit: K == null ? void 0 : K.unit,
            // Preserve item-level color/fill from graphical items.
            color: (W = K == null ? void 0 : K.color) !== null && W !== void 0 ? W : S == null ? void 0 : S.color,
            fill: (V = K == null ? void 0 : K.fill) !== null && V !== void 0 ? V : S == null ? void 0 : S.fill
          });
          y.push(ib({
            tooltipEntrySettings: re,
            dataKey: F,
            payload: ie,
            value: Le(ie, F),
            name: G == null ? void 0 : String(G)
          }));
        });
      else {
        var C;
        y.push(ib({
          tooltipEntrySettings: S,
          dataKey: I,
          payload: _,
          // getValueByDataKey does not validate the output type
          value: Le(_, I),
          // getValueByDataKey does not validate the output type
          name: (C = Le(_, E)) !== null && C !== void 0 ? C : S == null ? void 0 : S.name
        }));
      }
      return y;
    }, p);
  }
}, Mm = $([wt, tE, $p], XO), H4 = $([(e) => e.graphicalItems.cartesianItems, (e) => e.graphicalItems.polarItems], (e, t) => [...e, ...t]), V4 = $([kt, oo], pm), na = $([H4, wt, V4], mm, {
  memoizeOptions: {
    resultEqualityCheck: ef
  }
}), G4 = $([na], (e) => e.filter(Jc)), BE = $([na], ym, {
  memoizeOptions: {
    resultEqualityCheck: ef
  }
}), Y4 = $([na], (e) => e.some((t) => !t.data)), Xi = $([BE, Hr], gm), q4 = $([G4, Hr, wt], hO), Dm = $([Xi, wt, na, Hr, Y4, BE], oE), FE = $([wt], bm), X4 = $([wt], (e) => e.allowDataOverflow), WE = $([FE, X4], YA), Q4 = $([na], (e) => e.filter(Jc)), Z4 = $([q4, Q4, Wl, lO], uE), J4 = $([Z4, Hr, kt, WE], sE), eB = $([na], nE), tB = $([Xi, wt, eB, sf, kt, fR], Pm, {
  memoizeOptions: {
    resultEqualityCheck: Kl
  }
}), rB = $([cE, kt, oo], co), nB = $([rB, kt], vE), iB = $([fE, kt, oo], co), aB = $([iB, kt], hE), oB = $([dE, kt, oo], co), lB = $([oB, kt], pE), uB = $([nB, lB, aB], pc), sB = $([wt, FE, WE, J4, tB, uB, Ne, kt], Am), Ja = $([wt, Ne, Xi, Dm, Wl, kt, sB], Om), cB = $([Ja, wt, Mm], km), fB = $([wt, Ja, cB, kt], Im), UE = (e) => {
  var t = kt(e), r = oo(e), n = !1;
  return Xl(e, t, r, n);
}, KE = $([wt, UE], Xc), dB = $([wt, Mm, fB, KE], vm), HE = $([dB], Up), vB = $([Ne, Dm, wt, kt], OE), hB = $([Ne, Dm, wt, kt], bE), pB = (e, t, r, n, a, l, u, c) => {
  if (t) {
    var f = t.type, d = Mn(e, c);
    if (n) {
      var h = r === "scaleBand" && n.bandwidth ? n.bandwidth() / 2 : 2, p = f === "category" && n.bandwidth ? n.bandwidth() / h : 0;
      return p = c === "angleAxis" && a != null && (a == null ? void 0 : a.length) >= 2 ? Et(a[0] - a[1]) * 2 * p : p, d && u ? u.map((y, b) => {
        var w = n.map(y);
        return Ie(w) ? {
          coordinate: w + p,
          value: y,
          index: b,
          offset: p
        } : null;
      }).filter(nr) : n.domain().map((y, b) => {
        var w = n.map(y);
        return Ie(w) ? {
          coordinate: w + p,
          // @ts-expect-error can't use Date as an index
          value: l ? l[y] : y,
          index: b,
          offset: p
        } : null;
      }).filter(nr);
    }
  }
}, Rn = $([Ne, wt, Mm, HE, UE, vB, hB, kt], pB), Nm = $([kE, CE, x4], (e, t, r) => IE(r.shared, e, t)), VE = (e) => e.tooltip.settings.trigger, $m = (e) => e.tooltip.settings.defaultIndex, Zl = $([fo, Nm, VE, $m], NE), di = $([Zl, Xi, Za, Ja], yl), GE = $([Rn, di], jE), Rm = $([Zl], (e) => {
  if (e)
    return e.dataKey;
}), YE = $([Zl], (e) => {
  if (e)
    return e.graphicalItemId;
}), qE = $([fo, Nm, VE, $m], RE), mB = $([dn, vn, Ne, xt, Rn, $m, qE], $E), yB = $([Zl, mB], (e, t) => e != null && e.coordinate ? e.coordinate : t), gB = $([Zl], (e) => {
  var t;
  return (t = e == null ? void 0 : e.active) !== null && t !== void 0 ? t : !1;
}), xB = $([qE, di, Hr, Za, GE, LE, Nm], zE), bB = $([xB], (e) => {
  if (e != null) {
    var t = e.map((r) => r.payload).filter((r) => r != null);
    return Array.from(new Set(t));
  }
});
function sw(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function cw(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? sw(Object(r), !0).forEach(function(n) {
      wB(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : sw(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function wB(e, t, r) {
  return (t = SB(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function SB(e) {
  var t = PB(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function PB(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var AB = () => ue(wt), OB = () => {
  var e = AB(), t = ue(Rn), r = ue(HE);
  return Ga(!e || !r ? void 0 : cw(cw({}, e), {}, {
    scale: r
  }), t);
};
function fw(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Na(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? fw(Object(r), !0).forEach(function(n) {
      EB(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : fw(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function EB(e, t, r) {
  return (t = kB(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function kB(e) {
  var t = CB(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function CB(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var IB = (e, t, r, n) => {
  var a = t.find((l) => l && l.index === r);
  if (a) {
    if (e === "horizontal")
      return {
        x: a.coordinate,
        y: n.relativeY
      };
    if (e === "vertical")
      return {
        x: n.relativeX,
        y: a.coordinate
      };
  }
  return {
    x: 0,
    y: 0
  };
}, jB = (e, t, r, n) => {
  var a = t.find((d) => d && d.index === r);
  if (a) {
    if (e === "centric") {
      var l = a.coordinate, u = n.radius;
      return Na(Na(Na({}, n), st(n.cx, n.cy, u, l)), {}, {
        angle: l,
        radius: u
      });
    }
    var c = a.coordinate, f = n.angle;
    return Na(Na(Na({}, n), st(n.cx, n.cy, c, f)), {}, {
      angle: f,
      radius: c
    });
  }
  return {
    angle: 0,
    clockWise: !1,
    cx: 0,
    cy: 0,
    endAngle: 0,
    innerRadius: 0,
    outerRadius: 0,
    radius: 0,
    startAngle: 0,
    x: 0,
    y: 0
  };
};
function _B(e, t) {
  var r = e.relativeX, n = e.relativeY;
  return r >= t.left && r <= t.left + t.width && n >= t.top && n <= t.top + t.height;
}
var XE = (e, t, r, n, a) => {
  var l, u = (l = t == null ? void 0 : t.length) !== null && l !== void 0 ? l : 0;
  if (u <= 1 || e == null)
    return 0;
  if (n === "angleAxis" && a != null && Math.abs(Math.abs(a[1] - a[0]) - 360) <= 1e-6)
    for (var c = a[1] - a[0], f = (ne, fe, ae) => [e, e + c, e - c].some((U) => (ae ? U >= ne : U > ne) && U <= fe), d = 0; d < u; d++) {
      var h, p, y, b, w, P = d > 0 ? (h = r[d - 1]) === null || h === void 0 ? void 0 : h.coordinate : (p = r[u - 1]) === null || p === void 0 ? void 0 : p.coordinate, S = (y = r[d]) === null || y === void 0 ? void 0 : y.coordinate, O = d >= u - 1 ? (b = r[0]) === null || b === void 0 ? void 0 : b.coordinate : (w = r[d + 1]) === null || w === void 0 ? void 0 : w.coordinate, k = void 0;
      if (!(P == null || S == null || O == null))
        if (Et(S - P) !== Et(O - S)) {
          var I = [];
          if (Et(O - S) === Et(a[1] - a[0])) {
            k = O;
            var E = S + a[1] - a[0];
            I[0] = Math.min(E, (E + P) / 2), I[1] = Math.max(E, (E + P) / 2);
          } else {
            k = P;
            var _ = O + a[1] - a[0];
            I[0] = Math.min(S, (_ + S) / 2), I[1] = Math.max(S, (_ + S) / 2);
          }
          var C = [Math.min(S, (k + S) / 2), Math.max(S, (k + S) / 2)];
          if (f(C[0], C[1], !1) || f(I[0], I[1], !0)) {
            var R;
            return (R = r[d]) === null || R === void 0 ? void 0 : R.index;
          }
        } else {
          var W = Math.min(P, O), V = Math.max(P, O);
          if (f((W + S) / 2, (V + S) / 2, !1)) {
            var K;
            return (K = r[d]) === null || K === void 0 ? void 0 : K.index;
          }
        }
    }
  else if (t)
    for (var G = 0; G < u; G++) {
      var F = t[G];
      if (F != null) {
        var ie = t[G + 1], re = t[G - 1];
        if (G === 0 && ie != null && e <= (F.coordinate + ie.coordinate) / 2 || G === u - 1 && re != null && e > (F.coordinate + re.coordinate) / 2 || G > 0 && G < u - 1 && re != null && ie != null && e > (F.coordinate + re.coordinate) / 2 && e <= (F.coordinate + ie.coordinate) / 2)
          return F.index;
      }
    }
  return -1;
}, TB = () => ue($p), Lm = (e, t) => t, QE = (e, t, r) => r, zm = (e, t, r, n) => n, MB = $(Rn, (e) => Mc(e, (t) => t.coordinate)), Bm = $([fo, Lm, QE, zm], NE), Fm = $([Bm, Xi, Za, Ja], yl), DB = (e, t, r) => {
  if (t != null) {
    var n = fo(e);
    return t === "axis" ? r === "hover" ? n.axisInteraction.hover.dataKey : n.axisInteraction.click.dataKey : r === "hover" ? n.itemInteraction.hover.dataKey : n.itemInteraction.click.dataKey;
  }
}, ZE = $([fo, Lm, QE, zm], RE), yc = $([dn, vn, Ne, xt, Rn, zm, ZE], $E), NB = $([Bm, yc], (e, t) => {
  var r;
  return (r = e.coordinate) !== null && r !== void 0 ? r : t;
}), JE = $([Rn, Fm], jE), $B = $([ZE, Fm, Hr, Za, JE, LE, Lm], zE), RB = $([Bm, Fm], (e, t) => ({
  isActive: e.active && t != null,
  activeIndex: t
})), LB = (e, t, r, n, a, l, u) => {
  if (!(!e || !r || !n || !a) && _B(e, u)) {
    var c = VM(e, t), f = XE(c, l, a, r, n), d = IB(t, a, f, e);
    return {
      activeIndex: String(f),
      activeCoordinate: d
    };
  }
}, zB = (e, t, r, n, a, l, u) => {
  if (!(!e || !n || !a || !l || !r)) {
    var c = rR(e, r);
    if (c) {
      var f = GM(c, t), d = XE(f, u, l, n, a), h = jB(t, l, d, c);
      return {
        activeIndex: String(d),
        activeCoordinate: h
      };
    }
  }
}, BB = (e, t, r, n, a, l, u, c) => {
  if (!(!e || !t || !n || !a || !l))
    return t === "horizontal" || t === "vertical" ? LB(e, t, n, a, l, u, c) : zB(e, t, r, n, a, l, u);
}, FB = $((e) => e.zIndex.zIndexMap, (e, t) => t, (e, t, r) => r, (e, t, r) => {
  if (t != null) {
    var n = e[t];
    if (n != null)
      return r ? n.panoramaElement : n.element;
  }
}), WB = $((e) => e.zIndex.zIndexMap, (e) => {
  var t = Object.keys(e).map((n) => parseInt(n, 10)).concat(Object.values(ct)), r = Array.from(new Set(t));
  return r.sort((n, a) => n - a);
}, {
  memoizeOptions: {
    resultEqualityCheck: MR
  }
});
function dw(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function vw(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? dw(Object(r), !0).forEach(function(n) {
      UB(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : dw(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function UB(e, t, r) {
  return (t = KB(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function KB(e) {
  var t = HB(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function HB(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var VB = {}, GB = {
  zIndexMap: Object.values(ct).reduce((e, t) => vw(vw({}, e), {}, {
    [t]: {
      element: void 0,
      panoramaElement: void 0,
      consumers: 0
    }
  }), VB)
}, YB = new Set(Object.values(ct));
function qB(e) {
  return YB.has(e);
}
var ek = Kt({
  name: "zIndex",
  initialState: GB,
  reducers: {
    registerZIndexPortal: {
      reducer: (e, t) => {
        var r = t.payload.zIndex;
        e.zIndexMap[r] ? e.zIndexMap[r].consumers += 1 : e.zIndexMap[r] = {
          consumers: 1,
          element: void 0,
          panoramaElement: void 0
        };
      },
      prepare: Ve()
    },
    unregisterZIndexPortal: {
      reducer: (e, t) => {
        var r = t.payload.zIndex;
        e.zIndexMap[r] && (e.zIndexMap[r].consumers -= 1, e.zIndexMap[r].consumers <= 0 && !qB(r) && delete e.zIndexMap[r]);
      },
      prepare: Ve()
    },
    registerZIndexPortalElement: {
      reducer: (e, t) => {
        var r = t.payload, n = r.zIndex, a = r.element, l = r.isPanorama;
        e.zIndexMap[n] ? l ? e.zIndexMap[n].panoramaElement = Me(a) : e.zIndexMap[n].element = Me(a) : e.zIndexMap[n] = {
          consumers: 0,
          element: l ? void 0 : Me(a),
          panoramaElement: l ? Me(a) : void 0
        };
      },
      prepare: Ve()
    },
    unregisterZIndexPortalElement: {
      reducer: (e, t) => {
        var r = t.payload.zIndex;
        e.zIndexMap[r] && (t.payload.isPanorama ? e.zIndexMap[r].panoramaElement = void 0 : e.zIndexMap[r].element = void 0);
      },
      prepare: Ve()
    }
  }
}), vf = ek.actions, XB = vf.registerZIndexPortal, Gv = vf.unregisterZIndexPortal, QB = vf.registerZIndexPortalElement, ZB = vf.unregisterZIndexPortalElement, JB = ek.reducer;
function ar(e) {
  var t = e.zIndex, r = e.children, n = ID(), a = n && t !== void 0 && t !== 0, l = Ht(), u = x.useRef(void 0), c = x.useRef(/* @__PURE__ */ new Set()), f = Be(), d = ue((p) => FB(p, t, l));
  if (x.useLayoutEffect(() => {
    if (!a) {
      var p = c.current;
      p.forEach((b) => {
        f(Gv({
          zIndex: b
        }));
      }), p.clear(), u.current = void 0;
      return;
    }
    if (c.current.has(t) || (f(XB({
      zIndex: t
    })), c.current.add(t)), d) {
      u.current = d;
      var y = c.current;
      y.forEach((b) => {
        b !== t && (f(Gv({
          zIndex: b
        })), y.delete(b));
      });
    }
  }, [f, t, a, d]), x.useLayoutEffect(() => {
    var p = c.current;
    return () => {
      p.forEach((y) => {
        f(Gv({
          zIndex: y
        }));
      }), p.clear();
    };
  }, [f]), !a)
    return r;
  var h = d ?? u.current;
  return h ? /* @__PURE__ */ ip.createPortal(r, h) : null;
}
function Fh() {
  return Fh = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Fh.apply(null, arguments);
}
function hw(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Ps(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? hw(Object(r), !0).forEach(function(n) {
      e8(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : hw(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function e8(e, t, r) {
  return (t = t8(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function t8(e) {
  var t = r8(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function r8(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function n8(e) {
  var t = e.cursor, r = e.cursorComp, n = e.cursorProps;
  return /* @__PURE__ */ x.isValidElement(t) ? /* @__PURE__ */ x.cloneElement(t, n) : /* @__PURE__ */ x.createElement(r, n);
}
function i8(e) {
  var t, r = e.coordinate, n = e.payload, a = e.index, l = e.offset, u = e.tooltipAxisBandSize, c = e.layout, f = e.cursor, d = e.tooltipEventType, h = e.chartName, p = r, y = n, b = a;
  if (!f || !p || h !== "ScatterChart" && d !== "axis")
    return null;
  var w, P, S;
  if (h === "ScatterChart")
    w = p, P = d$, S = ct.cursorLine;
  else if (h === "BarChart")
    w = v$(c, p, l, u), P = WA, S = ct.cursorRectangle;
  else if (c === "radial" && dP(p)) {
    var O = KA(p), k = O.cx, I = O.cy, E = O.radius, _ = O.startAngle, C = O.endAngle;
    w = {
      cx: k,
      cy: I,
      startAngle: _,
      endAngle: C,
      innerRadius: E,
      outerRadius: E
    }, P = VA, S = ct.cursorLine;
  } else
    w = {
      points: oR(c, p, l)
    }, P = _p, S = ct.cursorLine;
  var R = typeof f == "object" && "className" in f ? f.className : void 0, W = Ps(Ps(Ps(Ps({
    stroke: "#ccc",
    pointerEvents: "none"
  }, l), w), Hi(f)), {}, {
    payload: y,
    payloadIndex: b,
    className: $e("recharts-tooltip-cursor", R)
  });
  return /* @__PURE__ */ x.createElement(ar, {
    zIndex: (t = e.zIndex) !== null && t !== void 0 ? t : S
  }, /* @__PURE__ */ x.createElement(n8, {
    cursor: f,
    cursorComp: P,
    cursorProps: W
  }));
}
function a8(e) {
  var t = OB(), r = CA(), n = ea(), a = TB();
  return t == null || r == null || n == null || a == null ? null : /* @__PURE__ */ x.createElement(i8, Fh({}, e, {
    offset: r,
    layout: n,
    tooltipAxisBandSize: t,
    chartName: a
  }));
}
var tk = /* @__PURE__ */ x.createContext(null), o8 = () => x.useContext(tk), Yv = { exports: {} }, pw;
function l8() {
  return pw || (pw = 1, (function(e) {
    var t = Object.prototype.hasOwnProperty, r = "~";
    function n() {
    }
    Object.create && (n.prototype = /* @__PURE__ */ Object.create(null), new n().__proto__ || (r = !1));
    function a(f, d, h) {
      this.fn = f, this.context = d, this.once = h || !1;
    }
    function l(f, d, h, p, y) {
      if (typeof h != "function")
        throw new TypeError("The listener must be a function");
      var b = new a(h, p || f, y), w = r ? r + d : d;
      return f._events[w] ? f._events[w].fn ? f._events[w] = [f._events[w], b] : f._events[w].push(b) : (f._events[w] = b, f._eventsCount++), f;
    }
    function u(f, d) {
      --f._eventsCount === 0 ? f._events = new n() : delete f._events[d];
    }
    function c() {
      this._events = new n(), this._eventsCount = 0;
    }
    c.prototype.eventNames = function() {
      var d = [], h, p;
      if (this._eventsCount === 0) return d;
      for (p in h = this._events)
        t.call(h, p) && d.push(r ? p.slice(1) : p);
      return Object.getOwnPropertySymbols ? d.concat(Object.getOwnPropertySymbols(h)) : d;
    }, c.prototype.listeners = function(d) {
      var h = r ? r + d : d, p = this._events[h];
      if (!p) return [];
      if (p.fn) return [p.fn];
      for (var y = 0, b = p.length, w = new Array(b); y < b; y++)
        w[y] = p[y].fn;
      return w;
    }, c.prototype.listenerCount = function(d) {
      var h = r ? r + d : d, p = this._events[h];
      return p ? p.fn ? 1 : p.length : 0;
    }, c.prototype.emit = function(d, h, p, y, b, w) {
      var P = r ? r + d : d;
      if (!this._events[P]) return !1;
      var S = this._events[P], O = arguments.length, k, I;
      if (S.fn) {
        switch (S.once && this.removeListener(d, S.fn, void 0, !0), O) {
          case 1:
            return S.fn.call(S.context), !0;
          case 2:
            return S.fn.call(S.context, h), !0;
          case 3:
            return S.fn.call(S.context, h, p), !0;
          case 4:
            return S.fn.call(S.context, h, p, y), !0;
          case 5:
            return S.fn.call(S.context, h, p, y, b), !0;
          case 6:
            return S.fn.call(S.context, h, p, y, b, w), !0;
        }
        for (I = 1, k = new Array(O - 1); I < O; I++)
          k[I - 1] = arguments[I];
        S.fn.apply(S.context, k);
      } else {
        var E = S.length, _;
        for (I = 0; I < E; I++)
          switch (S[I].once && this.removeListener(d, S[I].fn, void 0, !0), O) {
            case 1:
              S[I].fn.call(S[I].context);
              break;
            case 2:
              S[I].fn.call(S[I].context, h);
              break;
            case 3:
              S[I].fn.call(S[I].context, h, p);
              break;
            case 4:
              S[I].fn.call(S[I].context, h, p, y);
              break;
            default:
              if (!k) for (_ = 1, k = new Array(O - 1); _ < O; _++)
                k[_ - 1] = arguments[_];
              S[I].fn.apply(S[I].context, k);
          }
      }
      return !0;
    }, c.prototype.on = function(d, h, p) {
      return l(this, d, h, p, !1);
    }, c.prototype.once = function(d, h, p) {
      return l(this, d, h, p, !0);
    }, c.prototype.removeListener = function(d, h, p, y) {
      var b = r ? r + d : d;
      if (!this._events[b]) return this;
      if (!h)
        return u(this, b), this;
      var w = this._events[b];
      if (w.fn)
        w.fn === h && (!y || w.once) && (!p || w.context === p) && u(this, b);
      else {
        for (var P = 0, S = [], O = w.length; P < O; P++)
          (w[P].fn !== h || y && !w[P].once || p && w[P].context !== p) && S.push(w[P]);
        S.length ? this._events[b] = S.length === 1 ? S[0] : S : u(this, b);
      }
      return this;
    }, c.prototype.removeAllListeners = function(d) {
      var h;
      return d ? (h = r ? r + d : d, this._events[h] && u(this, h)) : (this._events = new n(), this._eventsCount = 0), this;
    }, c.prototype.off = c.prototype.removeListener, c.prototype.addListener = c.prototype.on, c.prefixed = r, c.EventEmitter = c, e.exports = c;
  })(Yv)), Yv.exports;
}
var u8 = l8();
const s8 = /* @__PURE__ */ NS(u8);
var jl = new s8(), Wh = "recharts.syncEvent.tooltip", mw = "recharts.syncEvent.brush", Wm = (e, t) => {
  if (t && Array.isArray(e)) {
    var r = Number.parseInt(t, 10);
    if (!un(r))
      return e[r];
  }
}, c8 = {
  chartName: "",
  tooltipPayloadSearcher: () => {
  },
  eventEmitter: void 0,
  defaultTooltipEventType: "axis"
}, rk = Kt({
  name: "options",
  initialState: c8,
  reducers: {
    createEventEmitter: (e) => {
      e.eventEmitter == null && (e.eventEmitter = Symbol("rechartsEventEmitter"));
    }
  }
}), f8 = rk.reducer, d8 = rk.actions.createEventEmitter;
function v8(e) {
  return e.tooltip.syncInteraction;
}
var h8 = {
  chartData: void 0,
  computedData: void 0,
  dataStartIndex: 0,
  dataEndIndex: 0
}, nk = Kt({
  name: "chartData",
  initialState: h8,
  reducers: {
    setChartData(e, t) {
      if (e.chartData = Me(t.payload), t.payload == null) {
        e.dataStartIndex = 0, e.dataEndIndex = 0;
        return;
      }
      t.payload.length > 0 && e.dataEndIndex !== t.payload.length - 1 && (e.dataEndIndex = t.payload.length - 1);
    },
    setComputedData(e, t) {
      e.computedData = t.payload;
    },
    setDataStartEndIndexes(e, t) {
      var r = t.payload, n = r.startIndex, a = r.endIndex;
      n != null && (e.dataStartIndex = n), a != null && (e.dataEndIndex = a);
    }
  }
}), Um = nk.actions, yw = Um.setChartData, p8 = Um.setDataStartEndIndexes;
Um.setComputedData;
var m8 = nk.reducer, y8 = ["x", "y"];
function gw(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function $a(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? gw(Object(r), !0).forEach(function(n) {
      g8(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : gw(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function g8(e, t, r) {
  return (t = x8(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function x8(e) {
  var t = b8(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function b8(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function w8(e, t) {
  if (e == null) return {};
  var r, n, a = S8(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]);
  }
  return a;
}
function S8(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
function P8() {
  var e = ue(Rp), t = ue(Lp), r = Be(), n = ue(uO), a = ue(Rn), l = ea(), u = qc(), c = ue((f) => f.rootProps.className);
  x.useEffect(() => {
    if (e == null)
      return Ji;
    var f = (d, h, p) => {
      if (t !== p && e === d) {
        if (h.payload.active === !1) {
          r(hl({
            active: !1,
            coordinate: void 0,
            dataKey: void 0,
            index: null,
            label: void 0,
            sourceViewBox: void 0,
            graphicalItemId: void 0
          }));
          return;
        }
        if (n === "index") {
          var y;
          if (u && h !== null && h !== void 0 && (y = h.payload) !== null && y !== void 0 && y.coordinate && h.payload.sourceViewBox) {
            var b = h.payload.coordinate, w = b.x, P = b.y, S = w8(b, y8), O = h.payload.sourceViewBox, k = O.x, I = O.y, E = O.width, _ = O.height, C = $a($a({}, S), {}, {
              x: u.x + (E ? (w - k) / E : 0) * u.width,
              y: u.y + (_ ? (P - I) / _ : 0) * u.height
            });
            r($a($a({}, h), {}, {
              payload: $a($a({}, h.payload), {}, {
                coordinate: C
              })
            }));
          } else
            r(h);
          return;
        }
        if (a != null) {
          var R;
          if (typeof n == "function") {
            var W = {
              activeTooltipIndex: h.payload.index == null ? void 0 : Number(h.payload.index),
              isTooltipActive: h.payload.active,
              activeIndex: h.payload.index == null ? void 0 : Number(h.payload.index),
              activeLabel: h.payload.label,
              activeDataKey: h.payload.dataKey,
              activeCoordinate: h.payload.coordinate
            }, V = n(a, W);
            R = a[V];
          } else n === "value" && (R = a.find((ae) => String(ae.value) === h.payload.label));
          var K = h.payload.coordinate;
          if (K == null || u == null) {
            r(hl({
              active: !1,
              coordinate: void 0,
              dataKey: void 0,
              index: null,
              label: void 0,
              sourceViewBox: void 0,
              graphicalItemId: void 0
            }));
            return;
          }
          if (R == null) {
            r(hl({
              active: !1,
              coordinate: void 0,
              dataKey: void 0,
              index: null,
              label: void 0,
              sourceViewBox: h.payload.sourceViewBox,
              graphicalItemId: void 0
            }));
            return;
          }
          var G = K.x, F = K.y, ie = Math.min(G, u.x + u.width), re = Math.min(F, u.y + u.height), ne = {
            x: l === "horizontal" ? R.coordinate : ie,
            y: l === "horizontal" ? re : R.coordinate
          }, fe = hl({
            active: h.payload.active,
            coordinate: ne,
            dataKey: h.payload.dataKey,
            index: String(R.index),
            label: h.payload.label,
            sourceViewBox: h.payload.sourceViewBox,
            graphicalItemId: h.payload.graphicalItemId
          });
          r(fe);
        }
      }
    };
    return jl.on(Wh, f), () => {
      jl.off(Wh, f);
    };
  }, [c, r, t, e, n, a, l, u]);
}
function A8() {
  var e = ue(Rp), t = ue(Lp), r = Be();
  x.useEffect(() => {
    if (e == null)
      return Ji;
    var n = (a, l, u) => {
      t !== u && e === a && r(p8(l));
    };
    return jl.on(mw, n), () => {
      jl.off(mw, n);
    };
  }, [r, t, e]);
}
function O8() {
  var e = Be();
  x.useEffect(() => {
    e(d8());
  }, [e]), P8(), A8();
}
function E8(e, t, r, n, a, l) {
  var u = ue((w) => DB(w, e, t)), c = ue(YE), f = ue(Lp), d = ue(Rp), h = ue(uO), p = ue(v8), y = (p == null ? void 0 : p.sourceViewBox) != null, b = qc();
  x.useEffect(() => {
    if (!y && d != null && f != null) {
      var w = hl({
        active: l,
        coordinate: r,
        dataKey: u,
        index: a,
        label: typeof n == "number" ? String(n) : n,
        sourceViewBox: b,
        graphicalItemId: c
      });
      jl.emit(Wh, d, w, f);
    }
  }, [y, r, u, c, a, n, f, d, h, l, b]);
}
function xw(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function bw(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? xw(Object(r), !0).forEach(function(n) {
      k8(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : xw(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function k8(e, t, r) {
  return (t = C8(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function C8(e) {
  var t = I8(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function I8(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function j8(e, t) {
  return D8(e) || M8(e, t) || T8(e, t) || _8();
}
function _8() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function T8(e, t) {
  if (e) {
    if (typeof e == "string") return ww(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? ww(e, t) : void 0;
  }
}
function ww(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function M8(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, a, l, u, c = [], f = !0, d = !1;
    try {
      if (l = (r = r.call(e)).next, t !== 0) for (; !(f = (n = l.call(r)).done) && (c.push(n.value), c.length !== t); f = !0) ;
    } catch (h) {
      d = !0, a = h;
    } finally {
      try {
        if (!f && r.return != null && (u = r.return(), Object(u) !== u)) return;
      } finally {
        if (d) throw a;
      }
    }
    return c;
  }
}
function D8(e) {
  if (Array.isArray(e)) return e;
}
function N8(e) {
  return e.dataKey;
}
function $8(e, t) {
  return /* @__PURE__ */ x.isValidElement(e) ? /* @__PURE__ */ x.cloneElement(e, t) : typeof e == "function" ? /* @__PURE__ */ x.createElement(e, t) : /* @__PURE__ */ x.createElement(_N, t);
}
var Sw = [], R8 = {
  allowEscapeViewBox: {
    x: !1,
    y: !1
  },
  animationDuration: 400,
  animationEasing: "ease",
  axisId: 0,
  contentStyle: {},
  cursor: !0,
  filterNull: !0,
  includeHidden: !1,
  isAnimationActive: "auto",
  itemSorter: "name",
  itemStyle: {},
  labelStyle: {},
  offset: 10,
  reverseDirection: {
    x: !1,
    y: !1
  },
  separator: " : ",
  trigger: "hover",
  useTranslate3d: !1,
  wrapperStyle: {}
};
function hf(e) {
  var t, r, n = gt(e, R8), a = n.active, l = n.allowEscapeViewBox, u = n.animationDuration, c = n.animationEasing, f = n.content, d = n.filterNull, h = n.isAnimationActive, p = n.offset, y = n.payloadUniqBy, b = n.position, w = n.reverseDirection, P = n.useTranslate3d, S = n.wrapperStyle, O = n.cursor, k = n.shared, I = n.trigger, E = n.defaultIndex, _ = n.portal, C = n.axisId, R = Be(), W = typeof E == "number" ? String(E) : E;
  x.useEffect(() => {
    R(A4({
      shared: k,
      trigger: I,
      axisId: C,
      active: a,
      defaultIndex: W
    }));
  }, [R, k, I, C, a, W]);
  var V = qc(), K = $A(), G = g4(k), F = (t = ue((we) => RB(we, G, I, W))) !== null && t !== void 0 ? t : {}, ie = F.activeIndex, re = F.isActive, ne = ue((we) => $B(we, G, I, W)), fe = ue((we) => JE(we, G, I, W)), ae = ue((we) => NB(we, G, I, W)), U = ne, ee = o8(), Y = (r = a ?? re) !== null && r !== void 0 ? r : !1, D = UP([U, Y]), H = j8(D, 2), ve = H[0], ye = H[1], Pe = G === "axis" ? fe : void 0;
  E8(G, I, ae, Pe, ie, Y);
  var Ae = _ ?? ee;
  if (Ae == null || V == null || G == null)
    return null;
  var Oe = U ?? Sw;
  Y || (Oe = Sw), d && Oe.length && (Oe = zP(Oe.filter((we) => we.value != null && (we.hide !== !0 || n.includeHidden)), y, N8));
  var ke = Oe.length > 0, J = bw(bw({}, n), {}, {
    payload: Oe,
    label: Pe,
    active: Y,
    activeIndex: ie,
    coordinate: ae,
    accessibilityLayer: K
  }), me = /* @__PURE__ */ x.createElement(ZN, {
    allowEscapeViewBox: l,
    animationDuration: u,
    animationEasing: c,
    isAnimationActive: h,
    active: Y,
    coordinate: ae,
    hasPayload: ke,
    offset: p,
    position: b,
    reverseDirection: w,
    useTranslate3d: P,
    viewBox: V,
    wrapperStyle: S,
    lastBoundingBox: ve,
    innerRef: ye,
    hasPortalFromProps: !!_
  }, $8(f, J));
  return /* @__PURE__ */ x.createElement(x.Fragment, null, /* @__PURE__ */ ip.createPortal(me, Ae), Y && /* @__PURE__ */ x.createElement(a8, {
    cursor: O,
    tooltipEventType: G,
    coordinate: ae,
    payload: Oe,
    index: ie
  }));
}
var Jl = (e) => null;
Jl.displayName = "Cell";
function L8(e, t, r) {
  return (t = z8(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function z8(e) {
  var t = B8(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function B8(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
class F8 {
  constructor(t) {
    L8(this, "cache", /* @__PURE__ */ new Map()), this.maxSize = t;
  }
  get(t) {
    var r = this.cache.get(t);
    return r !== void 0 && (this.cache.delete(t), this.cache.set(t, r)), r;
  }
  set(t, r) {
    if (this.cache.has(t))
      this.cache.delete(t);
    else if (this.cache.size >= this.maxSize) {
      var n = this.cache.keys().next().value;
      n != null && this.cache.delete(n);
    }
    this.cache.set(t, r);
  }
  clear() {
    this.cache.clear();
  }
  size() {
    return this.cache.size;
  }
}
function Pw(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function W8(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Pw(Object(r), !0).forEach(function(n) {
      U8(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Pw(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function U8(e, t, r) {
  return (t = K8(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function K8(e) {
  var t = H8(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function H8(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var V8 = {
  cacheSize: 2e3,
  enableCache: !0
}, ik = W8({}, V8), Aw = new F8(ik.cacheSize), G8 = {
  position: "absolute",
  top: "-20000px",
  left: 0,
  padding: 0,
  margin: 0,
  border: "none",
  whiteSpace: "pre"
}, Ow = "recharts_measurement_span";
function Y8(e, t) {
  var r = t.fontSize || "", n = t.fontFamily || "", a = t.fontWeight || "", l = t.fontStyle || "", u = t.letterSpacing || "", c = t.textTransform || "";
  return "".concat(e, "|").concat(r, "|").concat(n, "|").concat(a, "|").concat(l, "|").concat(u, "|").concat(c);
}
var Ew = (e, t) => {
  try {
    var r = document.getElementById(Ow);
    r || (r = document.createElement("span"), r.setAttribute("id", Ow), r.setAttribute("aria-hidden", "true"), document.body.appendChild(r)), Object.assign(r.style, G8, t), r.textContent = "".concat(e);
    var n = r.getBoundingClientRect();
    return {
      width: n.width,
      height: n.height
    };
  } catch {
    return {
      width: 0,
      height: 0
    };
  }
}, gl = function(t) {
  var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  if (t == null || zl.isSsr)
    return {
      width: 0,
      height: 0
    };
  if (!ik.enableCache)
    return Ew(t, r);
  var n = Y8(t, r), a = Aw.get(n);
  if (a)
    return a;
  var l = Ew(t, r);
  return Aw.set(n, l), l;
}, ak;
function gc(e, t) {
  return Z8(e) || Q8(e, t) || X8(e, t) || q8();
}
function q8() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function X8(e, t) {
  if (e) {
    if (typeof e == "string") return kw(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? kw(e, t) : void 0;
  }
}
function kw(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function Q8(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, a, l, u, c = [], f = !0, d = !1;
    try {
      if (l = (r = r.call(e)).next, t === 0) {
        if (Object(r) !== r) return;
        f = !1;
      } else for (; !(f = (n = l.call(r)).done) && (c.push(n.value), c.length !== t); f = !0) ;
    } catch (h) {
      d = !0, a = h;
    } finally {
      try {
        if (!f && r.return != null && (u = r.return(), Object(u) !== u)) return;
      } finally {
        if (d) throw a;
      }
    }
    return c;
  }
}
function Z8(e) {
  if (Array.isArray(e)) return e;
}
function J8(e, t, r) {
  return (t = eF(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function eF(e) {
  var t = tF(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function tF(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Cw = /(-?\d+(?:\.\d+)?[a-zA-Z%]*)([*/])(-?\d+(?:\.\d+)?[a-zA-Z%]*)/, Iw = /(-?\d+(?:\.\d+)?[a-zA-Z%]*)([+-])(-?\d+(?:\.\d+)?[a-zA-Z%]*)/, rF = /^(px|cm|vh|vw|em|rem|%|mm|in|pt|pc|ex|ch|vmin|vmax|Q)$/, nF = /(-?\d+(?:\.\d+)?)([a-zA-Z%]+)?/, iF = {
  cm: 96 / 2.54,
  mm: 96 / 25.4,
  pt: 96 / 72,
  pc: 96 / 6,
  in: 96,
  Q: 96 / (2.54 * 40),
  px: 1
}, aF = ["cm", "mm", "pt", "pc", "in", "Q", "px"];
function oF(e) {
  return aF.includes(e);
}
var Fa = "NaN";
function lF(e, t) {
  return e * iF[t];
}
class Mt {
  static parse(t) {
    var r, n = (r = nF.exec(t)) !== null && r !== void 0 ? r : [], a = gc(n, 3), l = a[1], u = a[2];
    return l == null ? Mt.NaN : new Mt(parseFloat(l), u ?? "");
  }
  constructor(t, r) {
    this.num = t, this.unit = r, this.num = t, this.unit = r, un(t) && (this.unit = ""), r !== "" && !rF.test(r) && (this.num = NaN, this.unit = ""), oF(r) && (this.num = lF(t, r), this.unit = "px");
  }
  add(t) {
    return this.unit !== t.unit ? new Mt(NaN, "") : new Mt(this.num + t.num, this.unit);
  }
  subtract(t) {
    return this.unit !== t.unit ? new Mt(NaN, "") : new Mt(this.num - t.num, this.unit);
  }
  multiply(t) {
    return this.unit !== "" && t.unit !== "" && this.unit !== t.unit ? new Mt(NaN, "") : new Mt(this.num * t.num, this.unit || t.unit);
  }
  divide(t) {
    return this.unit !== "" && t.unit !== "" && this.unit !== t.unit ? new Mt(NaN, "") : new Mt(this.num / t.num, this.unit || t.unit);
  }
  toString() {
    return "".concat(this.num).concat(this.unit);
  }
  isNaN() {
    return un(this.num);
  }
}
ak = Mt;
J8(Mt, "NaN", new ak(NaN, ""));
function ok(e) {
  if (e == null || e.includes(Fa))
    return Fa;
  for (var t = e; t.includes("*") || t.includes("/"); ) {
    var r, n = (r = Cw.exec(t)) !== null && r !== void 0 ? r : [], a = gc(n, 4), l = a[1], u = a[2], c = a[3], f = Mt.parse(l ?? ""), d = Mt.parse(c ?? ""), h = u === "*" ? f.multiply(d) : f.divide(d);
    if (h.isNaN())
      return Fa;
    t = t.replace(Cw, h.toString());
  }
  for (; t.includes("+") || /.-\d+(?:\.\d+)?/.test(t); ) {
    var p, y = (p = Iw.exec(t)) !== null && p !== void 0 ? p : [], b = gc(y, 4), w = b[1], P = b[2], S = b[3], O = Mt.parse(w ?? ""), k = Mt.parse(S ?? ""), I = P === "+" ? O.add(k) : O.subtract(k);
    if (I.isNaN())
      return Fa;
    t = t.replace(Iw, I.toString());
  }
  return t;
}
var jw = /\(([^()]*)\)/;
function uF(e) {
  for (var t = e, r; (r = jw.exec(t)) != null; ) {
    var n = r, a = gc(n, 2), l = a[1];
    t = t.replace(jw, ok(l));
  }
  return t;
}
function sF(e) {
  var t = e.replace(/\s+/g, "");
  return t = uF(t), t = ok(t), t;
}
function cF(e) {
  try {
    return sF(e);
  } catch {
    return Fa;
  }
}
function qv(e) {
  var t = cF(e.slice(5, -1));
  return t === Fa ? "" : t;
}
var fF = ["x", "y", "lineHeight", "capHeight", "fill", "scaleToFit", "textAnchor", "verticalAnchor"], dF = ["dx", "dy", "angle", "className", "breakAll"];
function Uh() {
  return Uh = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Uh.apply(null, arguments);
}
function _w(e, t) {
  if (e == null) return {};
  var r, n, a = vF(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]);
  }
  return a;
}
function vF(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
function Tw(e, t) {
  return yF(e) || mF(e, t) || pF(e, t) || hF();
}
function hF() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function pF(e, t) {
  if (e) {
    if (typeof e == "string") return Mw(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? Mw(e, t) : void 0;
  }
}
function Mw(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function mF(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, a, l, u, c = [], f = !0, d = !1;
    try {
      if (l = (r = r.call(e)).next, t === 0) {
        if (Object(r) !== r) return;
        f = !1;
      } else for (; !(f = (n = l.call(r)).done) && (c.push(n.value), c.length !== t); f = !0) ;
    } catch (h) {
      d = !0, a = h;
    } finally {
      try {
        if (!f && r.return != null && (u = r.return(), Object(u) !== u)) return;
      } finally {
        if (d) throw a;
      }
    }
    return c;
  }
}
function yF(e) {
  if (Array.isArray(e)) return e;
}
var lk = /[ \f\n\r\t\v\u2028\u2029]+/, uk = (e) => {
  var t = e.children, r = e.breakAll, n = e.style;
  try {
    var a = [];
    Qe(t) || (r ? a = t.toString().split("") : a = t.toString().split(lk));
    var l = a.map((c) => ({
      word: c,
      width: gl(c, n).width
    })), u = r ? 0 : gl(" ", n).width;
    return {
      wordsWithComputedWidth: l,
      spaceWidth: u
    };
  } catch {
    return null;
  }
};
function sk(e) {
  return e === "start" || e === "middle" || e === "end" || e === "inherit";
}
function gF(e) {
  return Qe(e) || typeof e == "string" || typeof e == "number" || typeof e == "boolean";
}
var ck = (e, t, r, n) => e.reduce((a, l) => {
  var u = l.word, c = l.width, f = a[a.length - 1];
  if (f && c != null && (t == null || n || f.width + c + r < Number(t)))
    f.words.push(u), f.width += c + r;
  else {
    var d = {
      words: [u],
      width: c
    };
    a.push(d);
  }
  return a;
}, []), fk = (e) => e.reduce((t, r) => t.width > r.width ? t : r), xF = "…", Dw = (e, t, r, n, a, l, u, c) => {
  var f = e.slice(0, t), d = uk({
    breakAll: r,
    style: n,
    children: f + xF
  });
  if (!d)
    return [!1, []];
  var h = ck(d.wordsWithComputedWidth, l, u, c), p = h.length > a || fk(h).width > Number(l);
  return [p, h];
}, bF = (e, t, r, n, a) => {
  var l = e.maxLines, u = e.children, c = e.style, f = e.breakAll, d = oe(l), h = String(u), p = ck(t, n, r, a);
  if (!d || a)
    return p;
  var y = p.length > l || fk(p).width > Number(n);
  if (!y)
    return p;
  for (var b = 0, w = h.length - 1, P = 0, S; b <= w && P <= h.length - 1; ) {
    var O = Math.floor((b + w) / 2), k = O - 1, I = Dw(h, k, f, c, l, n, r, a), E = Tw(I, 2), _ = E[0], C = E[1], R = Dw(h, O, f, c, l, n, r, a), W = Tw(R, 1), V = W[0];
    if (!_ && !V && (b = O + 1), _ && V && (w = O - 1), !_ && V) {
      S = C;
      break;
    }
    P++;
  }
  return S || p;
}, Nw = (e) => {
  var t = Qe(e) ? [] : e.toString().split(lk);
  return [{
    words: t,
    width: void 0
  }];
}, wF = (e) => {
  var t = e.width, r = e.scaleToFit, n = e.children, a = e.style, l = e.breakAll, u = e.maxLines;
  if ((t || r) && !zl.isSsr) {
    var c, f, d = uk({
      breakAll: l,
      children: n,
      style: a
    });
    if (d) {
      var h = d.wordsWithComputedWidth, p = d.spaceWidth;
      c = h, f = p;
    } else
      return Nw(n);
    return bF({
      breakAll: l,
      children: n,
      maxLines: u,
      style: a
    }, c, f, t, !!r);
  }
  return Nw(n);
}, dk = "#808080", SF = {
  angle: 0,
  breakAll: !1,
  // Magic number from d3
  capHeight: "0.71em",
  fill: dk,
  lineHeight: "1em",
  scaleToFit: !1,
  textAnchor: "start",
  // Maintain compat with existing charts / default SVG behavior
  verticalAnchor: "end",
  x: 0,
  y: 0
}, pf = /* @__PURE__ */ x.forwardRef((e, t) => {
  var r = gt(e, SF), n = r.x, a = r.y, l = r.lineHeight, u = r.capHeight, c = r.fill, f = r.scaleToFit, d = r.textAnchor, h = r.verticalAnchor, p = _w(r, fF), y = x.useMemo(() => wF({
    breakAll: p.breakAll,
    children: p.children,
    maxLines: p.maxLines,
    scaleToFit: f,
    style: p.style,
    width: p.width
  }), [p.breakAll, p.children, p.maxLines, f, p.style, p.width]), b = p.dx, w = p.dy, P = p.angle, S = p.className, O = p.breakAll, k = _w(p, dF);
  if (!sn(n) || !sn(a) || y.length === 0)
    return null;
  var I = Number(n) + (oe(b) ? b : 0), E = Number(a) + (oe(w) ? w : 0);
  if (!Ie(I) || !Ie(E))
    return null;
  var _;
  switch (h) {
    case "start":
      _ = qv("calc(".concat(u, ")"));
      break;
    case "middle":
      _ = qv("calc(".concat((y.length - 1) / 2, " * -").concat(l, " + (").concat(u, " / 2))"));
      break;
    default:
      _ = qv("calc(".concat(y.length - 1, " * -").concat(l, ")"));
      break;
  }
  var C = [], R = y[0];
  if (f && R != null) {
    var W = R.width, V = p.width;
    C.push("scale(".concat(oe(V) && oe(W) ? V / W : 1, ")"));
  }
  return P && C.push("rotate(".concat(P, ", ").concat(I, ", ").concat(E, ")")), C.length && (k.transform = C.join(" ")), /* @__PURE__ */ x.createElement("text", Uh({}, hr(k), {
    ref: t,
    x: I,
    y: E,
    className: $e("recharts-text", S),
    textAnchor: d,
    fill: c.includes("url") ? dk : c
  }), y.map((K, G) => {
    var F = K.words.join(O ? "" : " ");
    return (
      // duplicate words will cause duplicate keys which is why we add the array index here
      /* @__PURE__ */ x.createElement("tspan", {
        x: I,
        dy: G === 0 ? _ : l,
        key: "".concat(F, "-").concat(G)
      }, F)
    );
  }));
});
pf.displayName = "Text";
var PF = ["labelRef"], AF = ["content"];
function $w(e, t) {
  if (e == null) return {};
  var r, n, a = OF(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]);
  }
  return a;
}
function OF(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
function Rw(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function $i(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Rw(Object(r), !0).forEach(function(n) {
      EF(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Rw(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function EF(e, t, r) {
  return (t = kF(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function kF(e) {
  var t = CF(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function CF(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function Pn() {
  return Pn = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Pn.apply(null, arguments);
}
var vk = /* @__PURE__ */ x.createContext(null), IF = (e) => {
  var t = e.x, r = e.y, n = e.upperWidth, a = e.lowerWidth, l = e.width, u = e.height, c = e.children, f = x.useMemo(() => ({
    x: t,
    y: r,
    upperWidth: n,
    lowerWidth: a,
    width: l,
    height: u
  }), [t, r, n, a, l, u]);
  return /* @__PURE__ */ x.createElement(vk.Provider, {
    value: f
  }, c);
}, hk = () => {
  var e = x.useContext(vk), t = qc();
  return e || (t ? lp(t) : void 0);
}, pk = /* @__PURE__ */ x.createContext(null), jF = (e) => {
  var t = e.cx, r = e.cy, n = e.innerRadius, a = e.outerRadius, l = e.startAngle, u = e.endAngle, c = e.clockWise, f = e.children, d = x.useMemo(() => ({
    cx: t,
    cy: r,
    innerRadius: n,
    outerRadius: a,
    startAngle: l,
    endAngle: u,
    clockWise: c
  }), [t, r, n, a, l, u, c]);
  return /* @__PURE__ */ x.createElement(pk.Provider, {
    value: d
  }, f);
}, _F = () => {
  var e = x.useContext(pk), t = ue(vO);
  return e || t;
}, TF = (e) => {
  var t = e.value, r = e.formatter, n = Qe(e.children) ? t : e.children;
  return typeof r == "function" ? r(n) : n;
}, mf = (e) => e != null && typeof e == "function", MF = (e, t) => {
  var r = Et(t - e), n = Math.min(Math.abs(t - e), 360);
  return r * n;
}, DF = (e, t, r, n, a) => {
  var l = e.offset, u = e.className, c = a.cx, f = a.cy, d = a.innerRadius, h = a.outerRadius, p = a.startAngle, y = a.endAngle, b = a.clockWise, w = (d + h) / 2, P = MF(p, y), S = P >= 0 ? 1 : -1, O, k;
  switch (t) {
    case "insideStart":
      O = p + S * l, k = b;
      break;
    case "insideEnd":
      O = y - S * l, k = !b;
      break;
    case "end":
      O = y + S * l, k = b;
      break;
    default:
      throw new Error("Unsupported position ".concat(t));
  }
  k = P <= 0 ? k : !k;
  var I = st(c, f, w, O), E = st(c, f, w, O + (k ? 1 : -1) * 359), _ = "M".concat(I.x, ",").concat(I.y, `
    A`).concat(w, ",").concat(w, ",0,1,").concat(k ? 0 : 1, `,
    `).concat(E.x, ",").concat(E.y), C = Qe(e.id) ? bl("recharts-radial-line-") : e.id;
  return /* @__PURE__ */ x.createElement("text", Pn({}, n, {
    dominantBaseline: "central",
    className: $e("recharts-radial-bar-label", u)
  }), /* @__PURE__ */ x.createElement("defs", null, /* @__PURE__ */ x.createElement("path", {
    id: C,
    d: _
  })), /* @__PURE__ */ x.createElement("textPath", {
    xlinkHref: "#".concat(C)
  }, r));
}, NF = (e, t, r) => {
  var n = e.cx, a = e.cy, l = e.innerRadius, u = e.outerRadius, c = e.startAngle, f = e.endAngle, d = (c + f) / 2;
  if (r === "outside") {
    var h = st(n, a, u + t, d), p = h.x, y = h.y;
    return {
      x: p,
      y,
      textAnchor: p >= n ? "start" : "end",
      verticalAnchor: "middle"
    };
  }
  if (r === "center")
    return {
      x: n,
      y: a,
      textAnchor: "middle",
      verticalAnchor: "middle"
    };
  if (r === "centerTop")
    return {
      x: n,
      y: a,
      textAnchor: "middle",
      verticalAnchor: "start"
    };
  if (r === "centerBottom")
    return {
      x: n,
      y: a,
      textAnchor: "middle",
      verticalAnchor: "end"
    };
  var b = (l + u) / 2, w = st(n, a, b, d), P = w.x, S = w.y;
  return {
    x: P,
    y: S,
    textAnchor: "middle",
    verticalAnchor: "middle"
  };
}, Ba = (e) => e != null && "cx" in e && oe(e.cx), $F = {
  angle: 0,
  offset: 5,
  zIndex: ct.label,
  position: "middle",
  textBreakAll: !1
};
function RF(e) {
  if (!Ba(e))
    return e;
  var t = e.cx, r = e.cy, n = e.outerRadius, a = n * 2;
  return {
    x: t - n,
    y: r - n,
    width: a,
    upperWidth: a,
    lowerWidth: a,
    height: a
  };
}
function oi(e) {
  var t, r, n = gt(e, $F), a = n.viewBox, l = n.parentViewBox, u = n.position, c = n.value, f = n.children, d = n.content, h = n.className, p = h === void 0 ? "" : h, y = n.textBreakAll, b = n.labelRef, w = _F(), P = hk(), S = u === "center" ? P : w ?? P, O, k, I;
  a == null ? O = S : Ba(a) ? O = a : O = lp(a);
  var E = RF(O);
  if (!O || Qe(c) && Qe(f) && !/* @__PURE__ */ x.isValidElement(d) && typeof d != "function")
    return null;
  var _ = Ba(O) && (u === "insideStart" || u === "insideEnd" || u === "end");
  if (Ba(O))
    _ || (I = NF(O, n.offset, n.position));
  else if (E) {
    var C = VS({
      viewBox: E,
      position: u,
      offset: n.offset,
      parentViewBox: Ba(l) ? void 0 : l,
      clamp: !0
    });
    I = $i($i({
      x: C.x,
      y: C.y,
      textAnchor: C.horizontalAnchor,
      verticalAnchor: C.verticalAnchor
    }, C.width !== void 0 ? {
      width: C.width
    } : {}), C.height !== void 0 ? {
      height: C.height
    } : {});
  }
  var R = $i($i($i($i({}, ((t = I) === null || t === void 0 ? void 0 : t.x) !== void 0 ? {
    x: I.x
  } : {}), ((r = I) === null || r === void 0 ? void 0 : r.y) !== void 0 ? {
    y: I.y
  } : {}), n), {}, {
    viewBox: O
  });
  if (/* @__PURE__ */ x.isValidElement(d)) {
    R.labelRef;
    var W = $w(R, PF);
    return /* @__PURE__ */ x.cloneElement(d, W);
  }
  if (typeof d == "function") {
    R.content;
    var V = $w(R, AF);
    if (k = /* @__PURE__ */ x.createElement(d, V), /* @__PURE__ */ x.isValidElement(k))
      return k;
  } else
    k = TF(n);
  var K = hr(n);
  return _ && Ba(O) ? DF(n, u, k, K, O) : I == null ? null : /* @__PURE__ */ x.createElement(ar, {
    zIndex: n.zIndex
  }, /* @__PURE__ */ x.createElement(pf, Pn({
    ref: b,
    className: $e("recharts-label", p)
  }, K, I, {
    /*
     * textAnchor is decided by default based on the `position`
     * but we allow overriding via props for precise control.
     */
    textAnchor: sk(K.textAnchor) ? K.textAnchor : I.textAnchor,
    breakAll: y
  }), k));
}
oi.displayName = "Label";
var LF = (e, t, r) => {
  if (!e)
    return null;
  var n = {
    viewBox: t,
    labelRef: r
  };
  return e === !0 ? /* @__PURE__ */ x.createElement(oi, Pn({
    key: "label-implicit"
  }, n)) : sn(e) ? /* @__PURE__ */ x.createElement(oi, Pn({
    key: "label-implicit",
    value: e
  }, n)) : /* @__PURE__ */ x.isValidElement(e) ? e.type === oi ? /* @__PURE__ */ x.cloneElement(e, $i({
    key: "label-implicit"
  }, n)) : /* @__PURE__ */ x.createElement(oi, Pn({
    key: "label-implicit",
    content: e
  }, n)) : mf(e) ? /* @__PURE__ */ x.createElement(oi, Pn({
    key: "label-implicit",
    content: e
  }, n)) : e && typeof e == "object" ? /* @__PURE__ */ x.createElement(oi, Pn({}, e, {
    key: "label-implicit"
  }, n)) : null;
};
function zF(e) {
  var t = e.label, r = e.labelRef, n = hk();
  return LF(t, n, r) || null;
}
var BF = ["valueAccessor"], FF = ["dataKey", "clockWise", "id", "textBreakAll", "zIndex"];
function xc() {
  return xc = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, xc.apply(null, arguments);
}
function Lw(e, t) {
  if (e == null) return {};
  var r, n, a = WF(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]);
  }
  return a;
}
function WF(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
var UF = (e) => {
  var t = Array.isArray(e.value) ? e.value[e.value.length - 1] : e.value;
  if (gF(t))
    return t;
}, mk = /* @__PURE__ */ x.createContext(void 0), yk = mk.Provider, gk = /* @__PURE__ */ x.createContext(void 0), KF = gk.Provider;
function HF() {
  return x.useContext(mk);
}
function VF() {
  return x.useContext(gk);
}
function Ts(e) {
  var t = e.valueAccessor, r = t === void 0 ? UF : t, n = Lw(e, BF), a = n.dataKey;
  n.clockWise;
  var l = n.id, u = n.textBreakAll, c = n.zIndex, f = Lw(n, FF), d = HF(), h = VF(), p = d || h;
  return !p || !p.length ? null : /* @__PURE__ */ x.createElement(ar, {
    zIndex: c ?? ct.label
  }, /* @__PURE__ */ x.createElement(yt, {
    className: "recharts-label-list"
  }, p.map((y, b) => {
    var w, P = Qe(a) ? r(y, b) : Le(y.payload, a), S = Qe(l) ? {} : {
      id: "".concat(l, "-").concat(b)
    };
    return /* @__PURE__ */ x.createElement(oi, xc({
      key: "label-".concat(b)
    }, hr(y), f, S, {
      /*
       * Prefer to use the explicit fill from LabelList props.
       * Only in an absence of that, fall back to the fill of the entry.
       * The entry fill can be quite difficult to see especially in Bar, Pie, RadialBar in inside positions.
       * On the other hand it's quite convenient in Scatter, Line, or when the position is outside the Bar, Pie filled shapes.
       */
      fill: (w = n.fill) !== null && w !== void 0 ? w : y.fill,
      parentViewBox: y.parentViewBox,
      value: P,
      textBreakAll: u,
      viewBox: y.viewBox,
      index: b,
      zIndex: 0
    }));
  })));
}
Ts.displayName = "LabelList";
function Km(e) {
  var t = e.label;
  return t ? t === !0 ? /* @__PURE__ */ x.createElement(Ts, {
    key: "labelList-implicit"
  }) : /* @__PURE__ */ x.isValidElement(t) || mf(t) ? /* @__PURE__ */ x.createElement(Ts, {
    key: "labelList-implicit",
    content: t
  }) : typeof t == "object" ? /* @__PURE__ */ x.createElement(Ts, xc({
    key: "labelList-implicit"
  }, t, {
    type: String(t.type)
  })) : null : null;
}
function Kh() {
  return Kh = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Kh.apply(null, arguments);
}
var xk = (e) => {
  var t = e.cx, r = e.cy, n = e.r, a = e.className, l = $e("recharts-dot", a);
  return oe(t) && oe(r) && oe(n) ? /* @__PURE__ */ x.createElement("circle", Kh({}, vr(e), dp(e), {
    className: l,
    cx: t,
    cy: r,
    r: n
  })) : null;
}, bk = (e) => e.graphicalItems.polarItems, GF = $([et, Ul], pm), yf = $([bk, tt, GF], mm), YF = $([yf], ym), gf = $([YF, Bl], gm), qF = $([gf, tt, yf], aE);
$([gf, tt, yf], (e, t, r) => r.length > 0 ? e.flatMap((n) => r.flatMap((a) => {
  var l, u = Le(n, (l = t.dataKey) !== null && l !== void 0 ? l : a.dataKey);
  return {
    value: u,
    errorDomain: []
    // polar charts do not have error bars
  };
})).filter(Boolean) : (t == null ? void 0 : t.dataKey) != null ? e.map((n) => ({
  value: Le(n, t.dataKey),
  errorDomain: []
})) : e.map((n) => ({
  value: n,
  errorDomain: []
})));
var zw = () => {
}, XF = $([gf, tt, yf, sf, et, cR], Pm), QF = $([tt, wm, Sm, zw, XF, zw, Ne, et], Am), wk = $([tt, Ne, gf, qF, Wl, et, QF], Om), ZF = $([wk, uo, mi], km), JF = $([tt, wk, ZF, et], Im);
$([mi, JF], pO);
var e6 = {
  radiusAxis: {},
  angleAxis: {}
}, Sk = Kt({
  name: "polarAxis",
  initialState: e6,
  reducers: {
    addRadiusAxis(e, t) {
      e.radiusAxis[t.payload.id] = Me(t.payload);
    },
    removeRadiusAxis(e, t) {
      delete e.radiusAxis[t.payload.id];
    },
    addAngleAxis(e, t) {
      e.angleAxis[t.payload.id] = Me(t.payload);
    },
    removeAngleAxis(e, t) {
      delete e.angleAxis[t.payload.id];
    }
  }
}), xf = Sk.actions;
xf.addRadiusAxis;
xf.removeRadiusAxis;
xf.addAngleAxis;
xf.removeAngleAxis;
var t6 = Sk.reducer;
function Pk(e) {
  return e && typeof e == "object" && "className" in e && typeof e.className == "string" ? e.className : "";
}
function Bw(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Fw(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Bw(Object(r), !0).forEach(function(n) {
      r6(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Bw(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function r6(e, t, r) {
  return (t = n6(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function n6(e) {
  var t = i6(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function i6(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var a6 = (e, t) => t, Hm = $([bk, a6], (e, t) => e.filter((r) => r.type === "pie").find((r) => r.id === t)), o6 = [], Vm = (e, t, r) => (r == null ? void 0 : r.length) === 0 ? o6 : r, Ak = $([Bl, Hm, Vm], (e, t, r) => {
  var n = e.chartData;
  if (t != null) {
    var a;
    if ((t == null ? void 0 : t.data) != null && t.data.length > 0 ? a = t.data : a = n, (!a || !a.length) && r != null && (a = r.map((l) => Fw(Fw({}, t.presentationProps), l.props))), a != null)
      return a;
  }
}), l6 = $([Ak, Hm, Vm], (e, t, r) => {
  if (!(e == null || t == null))
    return e.map((n, a) => {
      var l, u = Le(n, t.nameKey, t.name), c;
      return r != null && (l = r[a]) !== null && l !== void 0 && (l = l.props) !== null && l !== void 0 && l.fill ? c = r[a].props.fill : typeof n == "object" && n != null && "fill" in n ? c = n.fill : c = t.fill, {
        value: ro(u, t.dataKey),
        dataKey: t.dataKey,
        color: c,
        // @ts-expect-error Legend payload.payload says it wants objects but our data can be unknown
        payload: n,
        type: t.legendType
      };
    });
}), u6 = $([Ak, Hm, Vm, xt], (e, t, r, n) => {
  if (!(t == null || e == null))
    return S5({
      offset: n,
      pieSettings: t,
      displayedData: e,
      cells: r
    });
}), Xv = { exports: {} }, Re = {};
/**
 * @license React
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ww;
function s6() {
  if (Ww) return Re;
  Ww = 1;
  var e = Symbol.for("react.element"), t = Symbol.for("react.portal"), r = Symbol.for("react.fragment"), n = Symbol.for("react.strict_mode"), a = Symbol.for("react.profiler"), l = Symbol.for("react.provider"), u = Symbol.for("react.context"), c = Symbol.for("react.server_context"), f = Symbol.for("react.forward_ref"), d = Symbol.for("react.suspense"), h = Symbol.for("react.suspense_list"), p = Symbol.for("react.memo"), y = Symbol.for("react.lazy"), b = Symbol.for("react.offscreen"), w;
  w = Symbol.for("react.module.reference");
  function P(S) {
    if (typeof S == "object" && S !== null) {
      var O = S.$$typeof;
      switch (O) {
        case e:
          switch (S = S.type, S) {
            case r:
            case a:
            case n:
            case d:
            case h:
              return S;
            default:
              switch (S = S && S.$$typeof, S) {
                case c:
                case u:
                case f:
                case y:
                case p:
                case l:
                  return S;
                default:
                  return O;
              }
          }
        case t:
          return O;
      }
    }
  }
  return Re.ContextConsumer = u, Re.ContextProvider = l, Re.Element = e, Re.ForwardRef = f, Re.Fragment = r, Re.Lazy = y, Re.Memo = p, Re.Portal = t, Re.Profiler = a, Re.StrictMode = n, Re.Suspense = d, Re.SuspenseList = h, Re.isAsyncMode = function() {
    return !1;
  }, Re.isConcurrentMode = function() {
    return !1;
  }, Re.isContextConsumer = function(S) {
    return P(S) === u;
  }, Re.isContextProvider = function(S) {
    return P(S) === l;
  }, Re.isElement = function(S) {
    return typeof S == "object" && S !== null && S.$$typeof === e;
  }, Re.isForwardRef = function(S) {
    return P(S) === f;
  }, Re.isFragment = function(S) {
    return P(S) === r;
  }, Re.isLazy = function(S) {
    return P(S) === y;
  }, Re.isMemo = function(S) {
    return P(S) === p;
  }, Re.isPortal = function(S) {
    return P(S) === t;
  }, Re.isProfiler = function(S) {
    return P(S) === a;
  }, Re.isStrictMode = function(S) {
    return P(S) === n;
  }, Re.isSuspense = function(S) {
    return P(S) === d;
  }, Re.isSuspenseList = function(S) {
    return P(S) === h;
  }, Re.isValidElementType = function(S) {
    return typeof S == "string" || typeof S == "function" || S === r || S === a || S === n || S === d || S === h || S === b || typeof S == "object" && S !== null && (S.$$typeof === y || S.$$typeof === p || S.$$typeof === l || S.$$typeof === u || S.$$typeof === f || S.$$typeof === w || S.getModuleId !== void 0);
  }, Re.typeOf = P, Re;
}
var Uw;
function c6() {
  return Uw || (Uw = 1, Xv.exports = s6()), Xv.exports;
}
var f6 = c6(), Kw = (e) => typeof e == "string" ? e : e ? e.displayName || e.name || "Component" : "", Hw = null, Qv = null, Ok = (e) => {
  if (e === Hw && Array.isArray(Qv))
    return Qv;
  var t = [];
  return x.Children.forEach(e, (r) => {
    Qe(r) || (f6.isFragment(r) ? t = t.concat(Ok(r.props.children)) : t.push(r));
  }), Qv = t, Hw = e, t;
};
function Gm(e, t) {
  var r = [], n = [];
  return Array.isArray(t) ? n = t.map((a) => Kw(a)) : n = [Kw(t)], Ok(e).forEach((a) => {
    var l = ln(a, "type.displayName") || ln(a, "type.name");
    l && n.indexOf(l) !== -1 && r.push(a);
  }), r;
}
var Ek = (e) => e && typeof e == "object" && "clipDot" in e ? !!e.clipDot : !0;
function Vw(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Gw(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Vw(Object(r), !0).forEach(function(n) {
      d6(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Vw(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function d6(e, t, r) {
  return (t = v6(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function v6(e) {
  var t = h6(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function h6(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function kk(e, t) {
  return Gw(Gw({}, t), e);
}
function p6(e) {
  return /* @__PURE__ */ x.isValidElement(e) ? e.props : e;
}
function m6(e, t) {
  return /* @__PURE__ */ x.cloneElement(e, kk(p6(e), t));
}
function y6(e) {
  if ("index" in e) {
    var t = e.index;
    return typeof t == "number" || typeof t == "string" ? t : void 0;
  }
}
function g6(e) {
  return "isActive" in e && e.isActive === !0;
}
function Ym(e) {
  var t = e.option, r = e.DefaultShape, n = e.shapeProps, a = e.activeClassName, l = a === void 0 ? "recharts-active-shape" : a, u = e.inActiveClassName, c = u === void 0 ? "recharts-shape" : u, f = y6(n), d;
  return /* @__PURE__ */ x.isValidElement(t) ? d = m6(t, n) : t === r ? d = /* @__PURE__ */ x.createElement(r, n) : typeof t == "function" ? d = t(n, f) : typeof t == "object" ? d = /* @__PURE__ */ x.createElement(r, kk(t, n)) : d = /* @__PURE__ */ x.createElement(r, n), g6(n) ? /* @__PURE__ */ x.createElement(yt, {
    className: l
  }, d) : /* @__PURE__ */ x.createElement(yt, {
    className: c
  }, d);
}
var qm = (e, t, r) => {
  var n = Be();
  return (a, l) => (u) => {
    e == null || e(a, l, u), n(TE({
      activeIndex: String(l),
      activeDataKey: t,
      activeCoordinate: a.tooltipPosition,
      activeGraphicalItemId: r
    }));
  };
}, Xm = (e) => {
  var t = Be();
  return (r, n) => (a) => {
    e == null || e(r, n, a), t(O4());
  };
}, Qm = (e, t, r) => {
  var n = Be();
  return (a, l) => (u) => {
    e == null || e(a, l, u), n(E4({
      activeIndex: String(l),
      activeDataKey: t,
      activeCoordinate: a.tooltipPosition,
      activeGraphicalItemId: r
    }));
  };
};
function Zm(e) {
  var t = e.tooltipEntrySettings, r = Be(), n = Ht(), a = x.useRef(null);
  return x.useLayoutEffect(() => {
    n || (a.current === null ? r(w4(t)) : a.current !== t && r(S4({
      prev: a.current,
      next: t
    })), a.current = t);
  }, [t, r, n]), x.useLayoutEffect(() => () => {
    a.current && (r(P4(a.current)), a.current = null);
  }, [r]), null;
}
function Ck(e) {
  var t = e.legendPayload, r = Be(), n = Ht(), a = x.useRef(null);
  return x.useLayoutEffect(() => {
    n || (a.current === null ? r(_A(t)) : a.current !== t && r(TA({
      prev: a.current,
      next: t
    })), a.current = t);
  }, [r, n, t]), x.useLayoutEffect(() => () => {
    a.current && (r(MA(a.current)), a.current = null);
  }, [r]), null;
}
function x6(e) {
  var t = e.legendPayload, r = Be(), n = ue(Ne), a = x.useRef(null);
  return x.useLayoutEffect(() => {
    n !== "centric" && n !== "radial" || (a.current === null ? r(_A(t)) : a.current !== t && r(TA({
      prev: a.current,
      next: t
    })), a.current = t);
  }, [r, n, t]), x.useLayoutEffect(() => () => {
    a.current && (r(MA(a.current)), a.current = null);
  }, [r]), null;
}
function b6(e, t) {
  return A6(e) || P6(e, t) || S6(e, t) || w6();
}
function w6() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function S6(e, t) {
  if (e) {
    if (typeof e == "string") return Yw(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? Yw(e, t) : void 0;
  }
}
function Yw(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function P6(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, a, l, u, c = [], f = !0, d = !1;
    try {
      if (l = (r = r.call(e)).next, t !== 0) for (; !(f = (n = l.call(r)).done) && (c.push(n.value), c.length !== t); f = !0) ;
    } catch (h) {
      d = !0, a = h;
    } finally {
      try {
        if (!f && r.return != null && (u = r.return(), Object(u) !== u)) return;
      } finally {
        if (d) throw a;
      }
    }
    return c;
  }
}
function A6(e) {
  if (Array.isArray(e)) return e;
}
var Jm = "index", ey = "append";
function ty(e, t) {
  var r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : [], n = [];
  for (var a of r)
    n.push({
      status: "removed",
      prev: a
    });
  for (var l = 0; l < t.length; l++) {
    var u = e[l], c = t[l];
    u != null ? n.push({
      status: "matched",
      prev: u,
      next: c
    }) : n.push({
      status: "added",
      next: c
    });
  }
  return n;
}
function O6(e, t) {
  var r = e.length / t.length, n = t.map((a, l) => e[Math.floor(l * r)]);
  return ty(n, t);
}
function E6(e, t) {
  var r = t.map((n, a) => e[a]);
  return ty(r, t);
}
function k6(e, t) {
  for (var r = /* @__PURE__ */ new Map(), n = 0; n < e.length; n++) {
    var a = e[n];
    if (a != null) {
      var l = t(a, n);
      l != null && !r.has(l) && r.set(l, a);
    }
  }
  return r;
}
function C6(e, t, r) {
  var n = k6(e, r), a = /* @__PURE__ */ new Set(), l = t.map((p, y) => {
    var b = r(p, y);
    if (b != null) {
      var w = n.get(b);
      if (w !== void 0)
        return a.add(b), w;
    }
  }), u = [];
  for (var c of n) {
    var f = b6(c, 2), d = f[0], h = f[1];
    a.has(d) || u.push(h);
  }
  return ty(l, t, u);
}
function I6(e, t, r) {
  return t == null ? null : e == null ? t.map((n) => ({
    status: "added",
    next: n
  })) : r === Jm ? O6(e, t) : r === ey ? E6(e, t) : C6(e, t, r);
}
function j6(e, t) {
  var r = x.useRef(e), n = x.useRef(t.current), a = x.useRef(!0);
  r.current !== e && (r.current = e, n.current = t.current, a.current = !1);
  var l = x.useCallback(function(u, c) {
    var f = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0;
    if (c === 0) {
      a.current = !0;
      return;
    }
    c === 1 && (n.current = u), c > 0 && a.current && f && (t.current = u);
  }, [t]);
  return {
    startValue: n.current,
    syncStepValue: l
  };
}
function _6(e, t) {
  return N6(e) || D6(e, t) || M6(e, t) || T6();
}
function T6() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function M6(e, t) {
  if (e) {
    if (typeof e == "string") return qw(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? qw(e, t) : void 0;
  }
}
function qw(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function D6(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, a, l, u, c = [], f = !0, d = !1;
    try {
      if (l = (r = r.call(e)).next, t !== 0) for (; !(f = (n = l.call(r)).done) && (c.push(n.value), c.length !== t); f = !0) ;
    } catch (h) {
      d = !0, a = h;
    } finally {
      try {
        if (!f && r.return != null && (u = r.return(), Object(u) !== u)) return;
      } finally {
        if (d) throw a;
      }
    }
    return c;
  }
}
function N6(e) {
  if (Array.isArray(e)) return e;
}
function ry(e, t) {
  var r = x.useState(!1), n = _6(r, 2), a = n[0], l = n[1], u = x.useCallback(() => {
    typeof e == "function" && e(), l(!0);
  }, [e]), c = x.useCallback(() => {
    typeof t == "function" && t(), l(!1);
  }, [t]);
  return {
    isAnimating: a,
    handleAnimationStart: u,
    handleAnimationEnd: c
  };
}
function ny(e) {
  var t, r = e.animationInput, n = e.animationIdPrefix, a = e.items, l = e.previousItemsRef, u = e.isAnimationActive, c = e.animationBegin, f = e.animationDuration, d = e.animationEasing, h = e.onAnimationStart, p = e.onAnimationEnd, y = e.animationInterpolateFn, b = e.animationMatchBy, w = e.shouldUpdatePreviousRef, P = e.children, S = e.layout, O = FA(r, n), k = j6(O, l), I = (t = k.startValue) !== null && t !== void 0 ? t : null, E = I6(I, a, b ?? Jm);
  return /* @__PURE__ */ x.createElement(BA, {
    animationId: O,
    begin: c,
    duration: f,
    isActive: u,
    easing: d,
    onAnimationEnd: p,
    onAnimationStart: h,
    key: O
  }, (_) => {
    var C = I == null, R = a == null ? a : y(E, _, S), W = w ? w(_) : _ > 0;
    return k.syncStepValue(R, _, W), R == null ? null : P(R, _, C);
  });
}
var Zv;
function $6(e, t) {
  return B6(e) || z6(e, t) || L6(e, t) || R6();
}
function R6() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function L6(e, t) {
  if (e) {
    if (typeof e == "string") return Xw(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? Xw(e, t) : void 0;
  }
}
function Xw(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function z6(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, a, l, u, c = [], f = !0, d = !1;
    try {
      if (l = (r = r.call(e)).next, t !== 0) for (; !(f = (n = l.call(r)).done) && (c.push(n.value), c.length !== t); f = !0) ;
    } catch (h) {
      d = !0, a = h;
    } finally {
      try {
        if (!f && r.return != null && (u = r.return(), Object(u) !== u)) return;
      } finally {
        if (d) throw a;
      }
    }
    return c;
  }
}
function B6(e) {
  if (Array.isArray(e)) return e;
}
var F6 = () => {
  var e = x.useState(() => bl("uid-")), t = $6(e, 1), r = t[0];
  return r;
}, W6 = (Zv = Cj.useId) !== null && Zv !== void 0 ? Zv : F6;
function U6(e, t) {
  var r = W6();
  return t || (e ? "".concat(e, "-").concat(r) : r);
}
var K6 = /* @__PURE__ */ x.createContext(void 0), iy = (e) => {
  var t = e.id, r = e.type, n = e.children, a = U6("recharts-".concat(r), t);
  return /* @__PURE__ */ x.createElement(K6.Provider, {
    value: a
  }, n(a));
}, H6 = {
  cartesianItems: [],
  polarItems: []
}, Ik = Kt({
  name: "graphicalItems",
  initialState: H6,
  reducers: {
    addCartesianGraphicalItem: {
      reducer(e, t) {
        e.cartesianItems.push(Me(t.payload));
      },
      prepare: Ve()
    },
    replaceCartesianGraphicalItem: {
      reducer(e, t) {
        var r = t.payload, n = r.prev, a = r.next, l = Er(e).cartesianItems.indexOf(Me(n));
        l > -1 && (e.cartesianItems[l] = Me(a));
      },
      prepare: Ve()
    },
    removeCartesianGraphicalItem: {
      reducer(e, t) {
        var r = Er(e).cartesianItems.indexOf(Me(t.payload));
        r > -1 && e.cartesianItems.splice(r, 1);
      },
      prepare: Ve()
    },
    addPolarGraphicalItem: {
      reducer(e, t) {
        e.polarItems.push(Me(t.payload));
      },
      prepare: Ve()
    },
    removePolarGraphicalItem: {
      reducer(e, t) {
        var r = Er(e).polarItems.indexOf(Me(t.payload));
        r > -1 && e.polarItems.splice(r, 1);
      },
      prepare: Ve()
    },
    replacePolarGraphicalItem: {
      reducer(e, t) {
        var r = t.payload, n = r.prev, a = r.next, l = Er(e).polarItems.indexOf(Me(n));
        l > -1 && (e.polarItems[l] = Me(a));
      },
      prepare: Ve()
    }
  }
}), vo = Ik.actions, V6 = vo.addCartesianGraphicalItem, G6 = vo.replaceCartesianGraphicalItem, Y6 = vo.removeCartesianGraphicalItem, q6 = vo.addPolarGraphicalItem, X6 = vo.removePolarGraphicalItem, Q6 = vo.replacePolarGraphicalItem, Z6 = Ik.reducer, J6 = (e) => {
  var t = Be(), r = x.useRef(null);
  return x.useLayoutEffect(() => {
    r.current === null ? t(V6(e)) : r.current !== e && t(G6({
      prev: r.current,
      next: e
    })), r.current = e;
  }, [t, e]), x.useLayoutEffect(() => () => {
    r.current && (t(Y6(r.current)), r.current = null);
  }, [t]), null;
}, jk = /* @__PURE__ */ x.memo(J6), e5 = (e) => {
  var t = Be(), r = x.useRef(null);
  return x.useLayoutEffect(() => {
    r.current === null ? t(q6(e)) : r.current !== e && t(Q6({
      prev: r.current,
      next: e
    })), r.current = e;
  }, [t, e]), x.useLayoutEffect(() => () => {
    r.current && (t(X6(r.current)), r.current = null);
  }, [t]), null;
}, t5 = /* @__PURE__ */ x.memo(e5), r5 = ["key"], n5 = ["onMouseEnter", "onClick", "onMouseLeave"], i5 = ["id"], a5 = ["id"];
function Qi() {
  return Qi = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Qi.apply(null, arguments);
}
function bf(e, t) {
  if (e == null) return {};
  var r, n, a = o5(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]);
  }
  return a;
}
function o5(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
function Qw(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function qe(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Qw(Object(r), !0).forEach(function(n) {
      l5(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Qw(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function l5(e, t, r) {
  return (t = u5(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function u5(e) {
  var t = s5(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function s5(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var _k = VA;
function c5(e) {
  var t = x.useMemo(() => Gm(e.children, Jl), [e.children]), r = ue((n) => l6(n, e.id, t));
  return r == null ? null : /* @__PURE__ */ x.createElement(x6, {
    legendPayload: r
  });
}
function f5(e) {
  if (!(e == null || typeof e == "boolean" || typeof e == "function")) {
    if (/* @__PURE__ */ x.isValidElement(e)) {
      var t, r = (t = e.props) === null || t === void 0 ? void 0 : t.fill;
      return typeof r == "string" ? r : void 0;
    }
    var n = e.fill;
    return typeof n == "string" ? n : void 0;
  }
}
var d5 = /* @__PURE__ */ x.memo((e) => {
  var t = e.dataKey, r = e.nameKey, n = e.sectors, a = e.stroke, l = e.strokeWidth, u = e.fill, c = e.name, f = e.hide, d = e.tooltipType, h = e.formatter, p = e.id, y = e.activeShape, b = f5(y), w = n.map((S) => {
    var O = S.tooltipPayload;
    return b == null || O == null ? O : O.map((k) => qe(qe({}, k), {}, {
      color: b,
      fill: b
    }));
  }), P = {
    dataDefinedOnItem: w,
    getPosition: (S) => {
      var O;
      return (O = n[Number(S)]) === null || O === void 0 ? void 0 : O.tooltipPosition;
    },
    settings: {
      stroke: a,
      strokeWidth: l,
      fill: u,
      dataKey: t,
      nameKey: r,
      name: ro(c, t),
      hide: f,
      type: d,
      color: u,
      unit: "",
      // why doesn't Pie support unit?
      formatter: h,
      graphicalItemId: p
    }
  };
  return /* @__PURE__ */ x.createElement(Zm, {
    tooltipEntrySettings: P
  });
}), v5 = (e, t) => e > t ? "start" : e < t ? "end" : "middle", h5 = (e, t, r) => Wt(typeof t == "function" ? t(e) : t, r, r * 0.8), p5 = (e, t, r) => {
  var n = t.top, a = t.left, l = t.width, u = t.height, c = UA(l, u), f = a + Wt(e.cx, l, l / 2), d = n + Wt(e.cy, u, u / 2), h = Wt(e.innerRadius, c, 0), p = h5(r, e.outerRadius, c), y = e.maxRadius || Math.sqrt(l * l + u * u) / 2;
  return {
    cx: f,
    cy: d,
    innerRadius: h,
    outerRadius: p,
    maxRadius: y
  };
}, m5 = (e, t) => {
  var r = Et(t - e), n = Math.min(Math.abs(t - e), 360);
  return r * n;
}, y5 = (e, t) => {
  if (/* @__PURE__ */ x.isValidElement(e))
    return /* @__PURE__ */ x.cloneElement(e, t);
  if (typeof e == "function")
    return e(t);
  var r = $e("recharts-pie-label-line", typeof e != "boolean" ? e.className : "");
  t.key;
  var n = bf(t, r5);
  return /* @__PURE__ */ x.createElement(_p, Qi({}, n, {
    type: "linear",
    className: r
  }));
}, g5 = (e, t, r) => {
  if (/* @__PURE__ */ x.isValidElement(e))
    return /* @__PURE__ */ x.cloneElement(e, t);
  var n = r;
  if (typeof e == "function" && (n = e(t), /* @__PURE__ */ x.isValidElement(n)))
    return n;
  var a = $e("recharts-pie-label-text", Pk(e));
  return /* @__PURE__ */ x.createElement(pf, Qi({}, t, {
    alignmentBaseline: "middle",
    className: a
  }), n);
};
function x5(e) {
  var t = e.sectors, r = e.props, n = e.showLabels, a = r.label, l = r.labelLine, u = r.dataKey;
  if (!n || !a || !t)
    return null;
  var c = vr(r), f = Hi(a), d = Hi(l), h = typeof a == "object" && "offsetRadius" in a && typeof a.offsetRadius == "number" && a.offsetRadius || 20, p = t.map((y, b) => {
    var w = (y.startAngle + y.endAngle) / 2, P = st(y.cx, y.cy, y.outerRadius + h, w), S = qe(qe(qe(qe({}, c), y), {}, {
      // @ts-expect-error customLabelProps is contributing unknown props
      stroke: "none"
    }, f), {}, {
      index: b,
      textAnchor: v5(P.x, y.cx)
    }, P), O = qe(qe(qe(qe({}, c), y), {}, {
      // @ts-expect-error customLabelLineProps is contributing unknown props
      fill: "none",
      // @ts-expect-error customLabelLineProps is contributing unknown props
      stroke: y.fill
    }, d), {}, {
      index: b,
      points: [st(y.cx, y.cy, y.outerRadius, w), P],
      key: "line"
    });
    return /* @__PURE__ */ x.createElement(ar, {
      zIndex: ct.label,
      key: "label-".concat(y.startAngle, "-").concat(y.endAngle, "-").concat(y.midAngle, "-").concat(b)
    }, /* @__PURE__ */ x.createElement(yt, null, l && y5(l, O), g5(a, S, Le(y, u))));
  });
  return /* @__PURE__ */ x.createElement(yt, {
    className: "recharts-pie-labels"
  }, p);
}
function b5(e) {
  var t = e.sectors, r = e.props, n = e.showLabels, a = r.label;
  return typeof a == "object" && a != null && "position" in a ? /* @__PURE__ */ x.createElement(Km, {
    label: a
  }) : /* @__PURE__ */ x.createElement(x5, {
    sectors: t,
    props: r,
    showLabels: n
  });
}
function w5(e) {
  var t = e.sectors, r = e.activeShape, n = e.inactiveShape, a = e.allOtherPieProps, l = e.shape, u = e.id, c = e.animationElapsedTime, f = e.isAnimating, d = e.isEntrance, h = ue(di), p = ue(Rm), y = ue(YE), b = a.onMouseEnter, w = a.onClick, P = a.onMouseLeave, S = bf(a, n5), O = qm(b, a.dataKey, u), k = Xm(P), I = Qm(w, a.dataKey, u);
  return t == null || t.length === 0 ? null : /* @__PURE__ */ x.createElement(x.Fragment, null, t.map((E, _) => {
    if ((E == null ? void 0 : E.startAngle) === 0 && (E == null ? void 0 : E.endAngle) === 0 && t.length !== 1) return null;
    var C = y == null || y === u, R = String(_) === h && (p == null || a.dataKey === p) && C, W = h ? n : null, V = r && R ? r : W, K = qe(qe({}, E), {}, {
      stroke: E.stroke,
      tabIndex: -1,
      index: _,
      isActive: R,
      animationElapsedTime: c,
      isAnimating: f,
      isEntrance: d,
      [SA]: _,
      [PA]: u
    });
    return /* @__PURE__ */ x.createElement(yt, Qi({
      key: "sector-".concat(E == null ? void 0 : E.startAngle, "-").concat(E == null ? void 0 : E.endAngle, "-").concat(E.midAngle, "-").concat(_),
      tabIndex: -1,
      className: "recharts-pie-sector"
    }, Ml(S, E, _), {
      onMouseEnter: O(E, _),
      onMouseLeave: k(E, _),
      onClick: I(E, _)
    }), /* @__PURE__ */ x.createElement(Ym, {
      option: V ?? l,
      DefaultShape: _k,
      shapeProps: K
    }));
  }));
}
function S5(e) {
  var t, r = e.pieSettings, n = e.displayedData, a = e.cells, l = e.offset, u = r.cornerRadius, c = r.startAngle, f = r.endAngle, d = r.dataKey, h = r.nameKey, p = r.tooltipType, y = Math.abs(r.minAngle), b = m5(c, f), w = Math.abs(b), P = n.length <= 1 ? 0 : (t = r.paddingAngle) !== null && t !== void 0 ? t : 0, S = n.filter((W) => Le(W, d, 0) !== 0).length, O = (w >= 360 ? S : S - 1) * P, k = n.reduce((W, V) => {
    var K = Le(V, d, 0);
    return W + (oe(K) ? K : 0);
  }, 0), I = y > 0 && k > 0 && n.some((W) => {
    var V = Le(W, d, 0), K = (oe(V) ? V : 0) / k;
    return V !== 0 && K * w < y;
  }), E = I ? y : 0, _ = w - S * E - O, C;
  if (k > 0) {
    var R;
    C = n.map((W, V) => {
      var K = Le(W, d, 0), G = Le(W, h, V), F = p5(r, l, W), ie = (oe(K) ? K : 0) / k, re, ne = qe(qe({}, W), a && a[V] && a[V].props), fe = ne != null && "fill" in ne && typeof ne.fill == "string" ? ne.fill : r.fill;
      V ? re = R.endAngle + Et(b) * P * (K !== 0 ? 1 : 0) : re = c;
      var ae = re + Et(b) * ((K !== 0 ? E : 0) + ie * _), U = (re + ae) / 2, ee = (F.innerRadius + F.outerRadius) / 2, Y = [{
        name: G,
        value: K,
        payload: ne,
        dataKey: d,
        type: p,
        color: fe,
        fill: fe,
        graphicalItemId: r.id
      }], D = st(F.cx, F.cy, ee, U);
      return R = qe(qe(qe(qe({}, r.presentationProps), {}, {
        percent: ie,
        cornerRadius: typeof u == "string" ? parseFloat(u) : u,
        name: G,
        tooltipPayload: Y,
        midAngle: U,
        middleRadius: ee,
        tooltipPosition: D
      }, ne), F), {}, {
        value: K,
        dataKey: d,
        startAngle: re,
        endAngle: ae,
        payload: ne,
        paddingAngle: K !== 0 ? Et(b) * P : 0
      }), R;
    });
  }
  return C;
}
function P5(e) {
  var t = e.showLabels, r = e.sectors, n = e.children, a = x.useMemo(() => !t || !r ? [] : r.map((l) => ({
    value: l.value,
    payload: l.payload,
    clockWise: !1,
    parentViewBox: void 0,
    viewBox: {
      cx: l.cx,
      cy: l.cy,
      innerRadius: l.innerRadius,
      outerRadius: l.outerRadius,
      startAngle: l.startAngle,
      endAngle: l.endAngle,
      clockWise: !1
    },
    fill: l.fill
  })), [r, t]);
  return /* @__PURE__ */ x.createElement(KF, {
    value: t ? a : void 0
  }, n);
}
var A5 = (e, t) => {
  if (e == null) return [];
  var r = [], n = e.find((l) => l.status !== "removed"), a = n ? n.next.startAngle : 0;
  return e.forEach((l, u) => {
    if (l.status !== "removed") {
      var c = u > 0 ? ln(l.next, "paddingAngle", 0) : 0;
      if (l.status === "matched") {
        var f = nt(l.prev.endAngle - l.prev.startAngle, l.next.endAngle - l.next.startAngle, t), d = qe(qe({}, l.next), {}, {
          startAngle: a + c,
          endAngle: a + f + c
        });
        r.push(d), a = d.endAngle;
      } else {
        var h = nt(0, l.next.endAngle - l.next.startAngle, t), p = qe(qe({}, l.next), {}, {
          startAngle: a + c,
          endAngle: a + h + c
        });
        r.push(p), a = p.endAngle;
      }
    }
  }), r;
};
function O5(e) {
  var t, r, n, a, l = e.props, u = e.previousSectorsRef, c = e.id, f = l.sectors, d = l.activeShape, h = l.inactiveShape, p = l.animationInterpolateFn, y = ry(l.onAnimationStart, l.onAnimationEnd), b = y.isAnimating, w = y.handleAnimationStart, P = y.handleAnimationEnd, S = CD();
  if (S == null) return null;
  var O = f[0];
  return /* @__PURE__ */ x.createElement(P5, {
    showLabels: !b,
    sectors: f
  }, /* @__PURE__ */ x.createElement(ny, {
    animationInput: l,
    animationIdPrefix: "recharts-pie-",
    items: f,
    previousItemsRef: u,
    isAnimationActive: l.isAnimationActive,
    animationBegin: l.animationBegin,
    animationDuration: l.animationDuration,
    animationEasing: l.animationEasing,
    onAnimationStart: w,
    onAnimationEnd: P,
    animationInterpolateFn: p,
    animationMatchBy: l.animationMatchBy,
    layout: S
  }, (k, I, E) => /* @__PURE__ */ x.createElement(yt, null, /* @__PURE__ */ x.createElement(w5, {
    sectors: k,
    activeShape: d,
    inactiveShape: h,
    allOtherPieProps: l,
    shape: l.shape,
    id: c,
    animationElapsedTime: I,
    isAnimating: b || I < 1,
    isEntrance: E
  }))), /* @__PURE__ */ x.createElement(b5, {
    showLabels: !b,
    sectors: f,
    props: l
  }), /* @__PURE__ */ x.createElement(jF, {
    cx: (t = O == null ? void 0 : O.cx) !== null && t !== void 0 ? t : 0,
    cy: (r = O == null ? void 0 : O.cy) !== null && r !== void 0 ? r : 0,
    innerRadius: (n = O == null ? void 0 : O.innerRadius) !== null && n !== void 0 ? n : 0,
    outerRadius: (a = O == null ? void 0 : O.outerRadius) !== null && a !== void 0 ? a : 0,
    startAngle: l.startAngle,
    endAngle: l.endAngle,
    clockWise: !1
  }, l.children));
}
var E5 = {
  animationBegin: 400,
  animationDuration: 1500,
  animationEasing: "ease",
  animationInterpolateFn: A5,
  animationMatchBy: ey,
  cx: "50%",
  cy: "50%",
  dataKey: "value",
  endAngle: 360,
  fill: "#808080",
  hide: !1,
  innerRadius: 0,
  isAnimationActive: "auto",
  label: !1,
  labelLine: !0,
  legendType: "rect",
  minAngle: 0,
  nameKey: "name",
  outerRadius: "80%",
  paddingAngle: 0,
  rootTabIndex: 0,
  shape: _k,
  startAngle: 0,
  stroke: "#fff",
  zIndex: ct.area
};
function k5(e) {
  var t = e.id, r = bf(e, i5), n = e.hide, a = e.className, l = e.rootTabIndex, u = x.useMemo(() => Gm(e.children, Jl), [e.children]), c = ue((h) => u6(h, t, u)), f = x.useRef(null), d = $e("recharts-pie", a);
  return n || c == null ? (f.current = null, /* @__PURE__ */ x.createElement(yt, {
    tabIndex: l,
    className: d
  })) : /* @__PURE__ */ x.createElement(ar, {
    zIndex: e.zIndex
  }, /* @__PURE__ */ x.createElement(d5, {
    dataKey: e.dataKey,
    nameKey: e.nameKey,
    sectors: c,
    stroke: e.stroke,
    strokeWidth: e.strokeWidth,
    fill: e.fill,
    name: e.name,
    hide: e.hide,
    tooltipType: e.tooltipType,
    formatter: e.formatter,
    id: t,
    activeShape: e.activeShape
  }), /* @__PURE__ */ x.createElement(yt, {
    tabIndex: l,
    className: d
  }, /* @__PURE__ */ x.createElement(O5, {
    props: qe(qe({}, r), {}, {
      sectors: c
    }),
    previousSectorsRef: f,
    id: t
  })));
}
function C5(e) {
  var t = gt(e, E5), r = t.id, n = bf(t, a5), a = vr(n);
  return /* @__PURE__ */ x.createElement(iy, {
    id: r,
    type: "pie"
  }, (l) => /* @__PURE__ */ x.createElement(x.Fragment, null, /* @__PURE__ */ x.createElement(t5, {
    type: "pie",
    id: l,
    data: n.data,
    dataKey: n.dataKey,
    hide: n.hide,
    angleAxisId: 0,
    radiusAxisId: 0,
    name: n.name,
    nameKey: n.nameKey,
    tooltipType: n.tooltipType,
    legendType: n.legendType,
    fill: n.fill,
    cx: n.cx,
    cy: n.cy,
    startAngle: n.startAngle,
    endAngle: n.endAngle,
    paddingAngle: n.paddingAngle,
    minAngle: n.minAngle,
    innerRadius: n.innerRadius,
    outerRadius: n.outerRadius,
    cornerRadius: n.cornerRadius,
    presentationProps: a,
    maxRadius: t.maxRadius
  }), /* @__PURE__ */ x.createElement(c5, Qi({}, n, {
    id: l
  })), /* @__PURE__ */ x.createElement(k5, Qi({}, n, {
    id: l
  }))));
}
var Tk = C5;
Tk.displayName = "Pie";
var I5 = ["points"];
function Zw(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Jv(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Zw(Object(r), !0).forEach(function(n) {
      j5(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Zw(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function j5(e, t, r) {
  return (t = _5(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function _5(e) {
  var t = T5(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function T5(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function bc() {
  return bc = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, bc.apply(null, arguments);
}
function M5(e, t) {
  if (e == null) return {};
  var r, n, a = D5(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]);
  }
  return a;
}
function D5(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
function N5(e) {
  var t = e.option, r = e.dotProps, n = e.className;
  if (/* @__PURE__ */ x.isValidElement(t))
    return /* @__PURE__ */ x.cloneElement(t, r);
  if (typeof t == "function")
    return t(r);
  var a = $e(n, typeof t != "boolean" ? t.className : ""), l = r ?? {};
  l.points;
  var u = M5(l, I5);
  return /* @__PURE__ */ x.createElement(xk, bc({}, u, {
    className: a
  }));
}
function $5(e, t) {
  return e == null ? !1 : t ? !0 : e.length === 1;
}
function R5(e) {
  var t = e.points, r = e.dot, n = e.className, a = e.dotClassName, l = e.dataKey, u = e.baseProps, c = e.needClip, f = e.clipPathId, d = e.zIndex, h = d === void 0 ? ct.scatter : d;
  if (!$5(t, r))
    return null;
  var p = Ek(r), y = s_(r), b = t.map((P, S) => {
    var O, k, I = Jv(Jv(Jv({
      r: 3
    }, u), y), {}, {
      index: S,
      cx: (O = P.x) !== null && O !== void 0 ? O : void 0,
      cy: (k = P.y) !== null && k !== void 0 ? k : void 0,
      dataKey: l,
      value: P.value,
      payload: P.payload,
      points: t
    });
    return /* @__PURE__ */ x.createElement(N5, {
      key: "dot-".concat(S),
      option: r,
      dotProps: I,
      className: a
    });
  }), w = {};
  return c && f != null && (w.clipPath = "url(#clipPath-".concat(p ? "" : "dots-").concat(f, ")")), /* @__PURE__ */ x.createElement(ar, {
    zIndex: h
  }, /* @__PURE__ */ x.createElement(yt, bc({
    className: n
  }, w), b));
}
function Jw(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function As(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Jw(Object(r), !0).forEach(function(n) {
      L5(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Jw(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function L5(e, t, r) {
  return (t = z5(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function z5(e) {
  var t = B5(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function B5(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Mk = 0, F5 = {
  xAxis: {},
  yAxis: {},
  zAxis: {}
}, Dk = Kt({
  name: "cartesianAxis",
  initialState: F5,
  reducers: {
    addXAxis: {
      reducer(e, t) {
        e.xAxis[t.payload.id] = Me(t.payload);
      },
      prepare: Ve()
    },
    replaceXAxis: {
      reducer(e, t) {
        var r = t.payload, n = r.prev, a = r.next;
        e.xAxis[n.id] !== void 0 && (n.id !== a.id && delete e.xAxis[n.id], e.xAxis[a.id] = Me(a));
      },
      prepare: Ve()
    },
    removeXAxis: {
      reducer(e, t) {
        delete e.xAxis[t.payload.id];
      },
      prepare: Ve()
    },
    addYAxis: {
      reducer(e, t) {
        e.yAxis[t.payload.id] = Me(t.payload);
      },
      prepare: Ve()
    },
    replaceYAxis: {
      reducer(e, t) {
        var r = t.payload, n = r.prev, a = r.next;
        e.yAxis[n.id] !== void 0 && (n.id !== a.id && delete e.yAxis[n.id], e.yAxis[a.id] = Me(a));
      },
      prepare: Ve()
    },
    removeYAxis: {
      reducer(e, t) {
        delete e.yAxis[t.payload.id];
      },
      prepare: Ve()
    },
    addZAxis: {
      reducer(e, t) {
        e.zAxis[t.payload.id] = Me(t.payload);
      },
      prepare: Ve()
    },
    replaceZAxis: {
      reducer(e, t) {
        var r = t.payload, n = r.prev, a = r.next;
        e.zAxis[n.id] !== void 0 && (n.id !== a.id && delete e.zAxis[n.id], e.zAxis[a.id] = Me(a));
      },
      prepare: Ve()
    },
    removeZAxis: {
      reducer(e, t) {
        delete e.zAxis[t.payload.id];
      },
      prepare: Ve()
    },
    updateYAxisWidth(e, t) {
      var r = t.payload, n = r.id, a = r.width, l = e.yAxis[n];
      if (l) {
        var u, c = l.widthHistory || [];
        if (c.length === 3 && c[0] === c[2] && a === c[1] && a !== l.width && Math.abs(a - ((u = c[0]) !== null && u !== void 0 ? u : 0)) <= 1)
          return;
        var f = [...c, a].slice(-3);
        e.yAxis[n] = As(As({}, l), {}, {
          width: a,
          widthHistory: f
        });
      }
    },
    updateXAxisHeight(e, t) {
      var r = t.payload, n = r.id, a = r.height, l = e.xAxis[n];
      if (l) {
        var u, c = l.heightHistory || [];
        if (c.length === 3 && c[0] === c[2] && a === c[1] && a !== l.height && Math.abs(a - ((u = c[0]) !== null && u !== void 0 ? u : 0)) <= 1)
          return;
        var f = [...c, a].slice(-3);
        e.xAxis[n] = As(As({}, l), {}, {
          height: a,
          heightHistory: f
        });
      }
    }
  }
}), Vr = Dk.actions, W5 = Vr.addXAxis, U5 = Vr.replaceXAxis, K5 = Vr.removeXAxis, H5 = Vr.addYAxis, V5 = Vr.replaceYAxis, G5 = Vr.removeYAxis;
Vr.addZAxis;
Vr.replaceZAxis;
Vr.removeZAxis;
var Y5 = Vr.updateYAxisWidth, q5 = Vr.updateXAxisHeight, X5 = Dk.reducer, Q5 = $([xt], (e) => ({
  top: e.top,
  bottom: e.bottom,
  left: e.left,
  right: e.right
})), Z5 = $([Q5, dn, vn], (e, t, r) => {
  if (!(!e || t == null || r == null))
    return {
      x: e.left,
      y: e.top,
      width: Math.max(0, t - e.left - e.right),
      height: Math.max(0, r - e.top - e.bottom)
    };
}), ay = () => ue(Z5), J5 = () => ue(bB);
function eS(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function eh(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? eS(Object(r), !0).forEach(function(n) {
      eW(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : eS(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function eW(e, t, r) {
  return (t = tW(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function tW(e) {
  var t = rW(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function rW(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var nW = (e) => {
  var t = e.point, r = e.childIndex, n = e.mainColor, a = e.activeDot, l = e.dataKey, u = e.clipPath;
  if (a === !1 || t.x == null || t.y == null)
    return null;
  var c = {
    index: r,
    dataKey: l,
    cx: t.x,
    cy: t.y,
    r: 4,
    fill: n ?? "none",
    strokeWidth: 2,
    stroke: "#fff",
    payload: t.payload,
    value: t.value
  }, f = eh(eh(eh({}, c), Hi(a)), dp(a)), d;
  return /* @__PURE__ */ x.isValidElement(a) ? d = /* @__PURE__ */ x.cloneElement(a, f) : typeof a == "function" ? d = a(f) : d = /* @__PURE__ */ x.createElement(xk, f), /* @__PURE__ */ x.createElement(yt, {
    className: "recharts-active-dot",
    clipPath: u
  }, d);
};
function iW(e) {
  var t = e.points, r = e.mainColor, n = e.activeDot, a = e.itemDataKey, l = e.clipPath, u = e.zIndex, c = u === void 0 ? ct.activeDot : u, f = ue(di), d = J5();
  if (t == null || d == null)
    return null;
  var h = t.find((p) => d.includes(p.payload));
  return Qe(h) ? null : /* @__PURE__ */ x.createElement(ar, {
    zIndex: c
  }, /* @__PURE__ */ x.createElement(nW, {
    point: h,
    childIndex: Number(f),
    mainColor: r,
    dataKey: a,
    activeDot: n,
    clipPath: l
  }));
}
function aW(e, t) {
  return sW(e) || uW(e, t) || lW(e, t) || oW();
}
function oW() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function lW(e, t) {
  if (e) {
    if (typeof e == "string") return tS(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? tS(e, t) : void 0;
  }
}
function tS(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function uW(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, a, l, u, c = [], f = !0, d = !1;
    try {
      if (l = (r = r.call(e)).next, t !== 0) for (; !(f = (n = l.call(r)).done) && (c.push(n.value), c.length !== t); f = !0) ;
    } catch (h) {
      d = !0, a = h;
    } finally {
      try {
        if (!f && r.return != null && (u = r.return(), Object(u) !== u)) return;
      } finally {
        if (d) throw a;
      }
    }
    return c;
  }
}
function sW(e) {
  if (Array.isArray(e)) return e;
}
var rS = (e, t, r) => {
  var n = r ?? e;
  if (!Qe(n))
    return Wt(n, t, 0);
}, cW = (e, t, r) => {
  var n = {}, a = e.filter(Jc), l = e.filter((d) => d.stackId == null), u = a.reduce((d, h) => {
    var p = d[h.stackId];
    return p == null && (p = []), p.push(h), d[h.stackId] = p, d;
  }, n), c = Object.entries(u).map((d) => {
    var h, p = aW(d, 2), y = p[0], b = p[1], w = b.map((S) => S.dataKey), P = rS(t, r, (h = b[0]) === null || h === void 0 ? void 0 : h.barSize);
    return {
      stackId: y,
      dataKeys: w,
      barSize: P
    };
  }), f = l.map((d) => {
    var h = [d.dataKey].filter((y) => y != null), p = rS(t, r, d.barSize);
    return {
      stackId: void 0,
      dataKeys: h,
      barSize: p
    };
  });
  return [...c, ...f];
};
function nS(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Os(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? nS(Object(r), !0).forEach(function(n) {
      fW(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : nS(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function fW(e, t, r) {
  return (t = dW(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function dW(e) {
  var t = vW(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function vW(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function hW(e, t, r, n, a) {
  var l, u = n.length;
  if (!(u < 1)) {
    var c = Wt(e, r, 0, !0), f, d = [];
    if (Ie((l = n[0]) === null || l === void 0 ? void 0 : l.barSize)) {
      var h = !1, p = r / u, y = n.reduce((k, I) => k + (I.barSize || 0), 0);
      y += (u - 1) * c, y >= r && (y -= (u - 1) * c, c = 0), y >= r && p > 0 && (h = !0, p *= 0.9, y = u * p);
      var b = Math.round((r - y) / 2), w = {
        offset: b - c,
        size: 0
      };
      f = n.reduce((k, I) => {
        var E, _ = {
          stackId: I.stackId,
          dataKeys: I.dataKeys,
          position: {
            offset: w.offset + w.size + c,
            size: h ? p : (E = I.barSize) !== null && E !== void 0 ? E : 0
          }
        }, C = [...k, _];
        return w = _.position, C;
      }, d);
    } else {
      var P = Wt(t, r, 0, !0);
      r - 2 * P - (u - 1) * c <= 0 && (c = 0);
      var S = (r - 2 * P - (u - 1) * c) / u;
      S > 1 && (S = Math.round(S));
      var O = Ie(a) ? Math.min(S, a) : S;
      f = n.reduce((k, I, E) => [...k, {
        stackId: I.stackId,
        dataKeys: I.dataKeys,
        position: {
          offset: P + u * (S - O) / 2 + (O + c) * E,
          size: O
        }
      }], d);
    }
    return f;
  }
}
var pW = (e, t, r, n, a, l, u) => {
  var c = Qe(u) ? t : u, f = hW(r, n, a !== l ? a : l, e, c);
  return a !== l && f != null && (f = f.map((d) => Os(Os({}, d), {}, {
    position: Os(Os({}, d.position), {}, {
      offset: d.position.offset - a / 2
    })
  }))), f;
}, mW = (e, t) => {
  var r = Wp(t);
  if (!(!e || r == null || t == null)) {
    var n = t.stackId;
    if (n != null) {
      var a = e[n];
      if (a) {
        var l = a.stackedData;
        if (l)
          return l.find((u) => u.key === r);
      }
    }
  }
}, yW = (e, t) => {
  if (!(e == null || t == null)) {
    var r = e.find((n) => n.stackId === t.stackId && t.dataKey != null && n.dataKeys.includes(t.dataKey));
    if (r != null)
      return r.position;
  }
};
function gW(e, t) {
  return e && typeof e == "object" && "zIndex" in e && typeof e.zIndex == "number" && Ie(e.zIndex) ? e.zIndex : t;
}
var Nk = (e) => {
  var t = e.chartData, r = Be(), n = Ht();
  return x.useEffect(() => n ? () => {
  } : (r(yw(t)), () => {
    r(yw(void 0));
  }), [t, r, n]), null;
}, iS = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  padding: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }
}, $k = Kt({
  name: "brush",
  initialState: iS,
  reducers: {
    setBrushSettings(e, t) {
      return t.payload == null ? iS : t.payload;
    }
  }
});
$k.actions.setBrushSettings;
var xW = $k.reducer;
function bW(e) {
  return (e % 180 + 180) % 180;
}
var wW = function(t) {
  var r = t.width, n = t.height, a = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0, l = bW(a), u = l * Math.PI / 180, c = Math.atan(n / r), f = u > c && u < Math.PI - c ? n / Math.sin(u) : r / Math.cos(u);
  return Math.abs(f);
}, SW = {
  dots: [],
  areas: [],
  lines: []
}, Rk = Kt({
  name: "referenceElements",
  initialState: SW,
  reducers: {
    addDot: (e, t) => {
      e.dots.push(t.payload);
    },
    removeDot: (e, t) => {
      var r = Er(e).dots.findIndex((n) => n === t.payload);
      r !== -1 && e.dots.splice(r, 1);
    },
    addArea: (e, t) => {
      e.areas.push(t.payload);
    },
    removeArea: (e, t) => {
      var r = Er(e).areas.findIndex((n) => n === t.payload);
      r !== -1 && e.areas.splice(r, 1);
    },
    addLine: (e, t) => {
      e.lines.push(Me(t.payload));
    },
    removeLine: (e, t) => {
      var r = Er(e).lines.findIndex((n) => n === t.payload);
      r !== -1 && e.lines.splice(r, 1);
    }
  }
}), ho = Rk.actions;
ho.addDot;
ho.removeDot;
ho.addArea;
ho.removeArea;
ho.addLine;
ho.removeLine;
var PW = Rk.reducer;
function AW(e, t) {
  return CW(e) || kW(e, t) || EW(e, t) || OW();
}
function OW() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function EW(e, t) {
  if (e) {
    if (typeof e == "string") return aS(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? aS(e, t) : void 0;
  }
}
function aS(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function kW(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, a, l, u, c = [], f = !0, d = !1;
    try {
      if (l = (r = r.call(e)).next, t !== 0) for (; !(f = (n = l.call(r)).done) && (c.push(n.value), c.length !== t); f = !0) ;
    } catch (h) {
      d = !0, a = h;
    } finally {
      try {
        if (!f && r.return != null && (u = r.return(), Object(u) !== u)) return;
      } finally {
        if (d) throw a;
      }
    }
    return c;
  }
}
function CW(e) {
  if (Array.isArray(e)) return e;
}
var IW = /* @__PURE__ */ x.createContext(void 0), jW = (e) => {
  var t = e.children, r = x.useState("".concat(bl("recharts"), "-clip")), n = AW(r, 1), a = n[0], l = ay();
  if (l == null)
    return null;
  var u = l.x, c = l.y, f = l.width, d = l.height;
  return /* @__PURE__ */ x.createElement(IW.Provider, {
    value: a
  }, /* @__PURE__ */ x.createElement("defs", null, /* @__PURE__ */ x.createElement("clipPath", {
    id: a
  }, /* @__PURE__ */ x.createElement("rect", {
    x: u,
    y: c,
    height: d,
    width: f
  }))), t);
};
function _W() {
}
function oS(e) {
  if (!e || typeof e != "object") return !1;
  const t = Object.getPrototypeOf(e);
  return t === null || t === Object.prototype || Object.getPrototypeOf(t) === null ? Object.prototype.toString.call(e) === "[object Object]" : !1;
}
function TW(e, t, r) {
  return pl(e, t, void 0, void 0, void 0, void 0, r);
}
function pl(e, t, r, n, a, l, u) {
  const c = u(e, t, r, n, a, l);
  if (c !== void 0) return c;
  if (typeof e == typeof t) switch (typeof e) {
    case "bigint":
    case "string":
    case "boolean":
    case "symbol":
    case "undefined":
      return e === t;
    case "number":
      return e === t || Object.is(e, t);
    case "function":
      return e === t;
    case "object":
      return xl(e, t, l, u);
  }
  return xl(e, t, l, u);
}
function xl(e, t, r, n) {
  if (Object.is(e, t)) return !0;
  let a = Ha(e), l = Ha(t);
  if (a === "[object Arguments]" && (a = Cs), l === "[object Arguments]" && (l = Cs), a !== l) return !1;
  switch (a) {
    case hp:
      return e.toString() === t.toString();
    case pp:
      return ml(e.valueOf(), t.valueOf());
    case mp:
    case xP:
    case gP:
      return Object.is(e.valueOf(), t.valueOf());
    case mP:
      return e.source === t.source && e.flags === t.flags;
    case M2:
      return e === t;
  }
  r = r ?? /* @__PURE__ */ new Map();
  const u = r.get(e), c = r.get(t);
  if (u != null && c != null) return u === t;
  r.set(e, t), r.set(t, e);
  try {
    switch (a) {
      case bP:
        if (e.size !== t.size) return !1;
        for (const [f, d] of e.entries()) if (!t.has(f) || !pl(d, t.get(f), f, e, t, r, n)) return !1;
        return !0;
      case wP: {
        if (e.size !== t.size) return !1;
        const f = Array.from(e.values()), d = Array.from(t.values());
        for (let h = 0; h < f.length; h++) {
          const p = f[h], y = d.findIndex((b) => pl(p, b, void 0, e, t, r, n));
          if (y === -1) return !1;
          d.splice(y, 1);
        }
        return !0;
      }
      case SP:
      case OP:
      case EP:
      case kP:
      case CP:
      case N2:
      case IP:
      case jP:
      case _P:
      case $2:
      case TP:
      case MP:
        if (hh(e) !== hh(t) || e.length !== t.length) return !1;
        for (let f = 0; f < e.length; f++) if (!pl(e[f], t[f], f, e, t, r, n)) return !1;
        return !0;
      case PP:
        return e.byteLength !== t.byteLength ? !1 : xl(new Uint8Array(e), new Uint8Array(t), r, n);
      case AP:
        return e.byteLength !== t.byteLength || e.byteOffset !== t.byteOffset ? !1 : xl(new Uint8Array(e), new Uint8Array(t), r, n);
      case D2:
        return e.name === t.name && e.message === t.message;
      case Cs: {
        if (!(xl(e.constructor, t.constructor, r, n) || oS(e) && oS(t))) return !1;
        const f = [...Object.keys(e), ...vh(e)], d = [...Object.keys(t), ...vh(t)];
        if (f.length !== d.length) return !1;
        for (let h = 0; h < f.length; h++) {
          const p = f[h], y = e[p];
          if (!Object.hasOwn(t, p)) return !1;
          const b = t[p];
          if (!pl(y, b, p, e, t, r, n)) return !1;
        }
        return !0;
      }
      default:
        return !1;
    }
  } finally {
    r.delete(e), r.delete(t);
  }
}
function MW(e, t) {
  return TW(e, t, _W);
}
function Lk(e, t) {
  if (t < 1)
    return [];
  if (t === 1)
    return e;
  for (var r = [], n = 0; n < e.length; n += t) {
    var a = e[n];
    a !== void 0 && r.push(a);
  }
  return r;
}
function DW(e, t, r) {
  var n = {
    width: e.width + t.width,
    height: e.height + t.height
  };
  return wW(n, r);
}
function NW(e, t, r) {
  var n = r === "width", a = e.x, l = e.y, u = e.width, c = e.height;
  return t === 1 ? {
    start: n ? a : l,
    end: n ? a + u : l + c
  } : {
    start: n ? a + u : l + c,
    end: n ? a : l
  };
}
function _l(e, t, r, n, a) {
  if (e * t < e * n || e * t > e * a)
    return !1;
  var l = r();
  return e * (t - e * l / 2 - n) >= 0 && e * (t + e * l / 2 - a) <= 0;
}
function $W(e, t) {
  return Lk(e, t + 1);
}
function RW(e, t, r, n, a) {
  for (var l = (n || []).slice(), u = t.start, c = t.end, f = 0, d = 1, h = u, p = function() {
    var w = n == null ? void 0 : n[f];
    if (w === void 0)
      return {
        v: Lk(n, d)
      };
    var P = f, S, O = () => (S === void 0 && (S = r(w, P)), S), k = w.coordinate, I = f === 0 || _l(e, k, O, h, c);
    I || (f = 0, h = u, d += 1), I && (h = k + e * (O() / 2 + a), f += d);
  }, y; d <= l.length; )
    if (y = p(), y) return y.v;
  return [];
}
function LW(e, t, r, n, a) {
  var l = (n || []).slice(), u = l.length;
  if (u === 0)
    return [];
  for (var c = t.start, f = t.end, d = 1; d <= u; d++) {
    for (var h = (u - 1) % d, p = c, y = !0, b = function() {
      var E = n[P];
      if (E == null)
        return 0;
      var _ = P, C, R = () => (C === void 0 && (C = r(E, _)), C), W = E.coordinate, V = P === h || _l(e, W, R, p, f);
      if (!V)
        return y = !1, 1;
      V && (p = W + e * (R() / 2 + a));
    }, w, P = h; P < u && (w = b(), !(w !== 0 && w === 1)); P += d)
      ;
    if (y) {
      for (var S = [], O = h; O < u; O += d) {
        var k = n[O];
        k != null && S.push(k);
      }
      return S;
    }
  }
  return [];
}
function lS(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Bt(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? lS(Object(r), !0).forEach(function(n) {
      zW(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : lS(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function zW(e, t, r) {
  return (t = BW(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function BW(e) {
  var t = FW(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function FW(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function WW(e, t, r, n, a) {
  for (var l = (n || []).slice(), u = l.length, c = t.start, f = t.end, d = function(y) {
    var b = l[y];
    if (b == null)
      return 1;
    var w = b, P, S = () => (P === void 0 && (P = r(b, y)), P);
    if (y === u - 1) {
      var O = e * (w.coordinate + e * S() / 2 - f);
      l[y] = w = Bt(Bt({}, w), {}, {
        tickCoord: O > 0 ? w.coordinate - O * e : w.coordinate
      });
    } else
      l[y] = w = Bt(Bt({}, w), {}, {
        tickCoord: w.coordinate
      });
    if (w.tickCoord != null) {
      var k = _l(e, w.tickCoord, S, c, f);
      k && (f = w.tickCoord - e * (S() / 2 + a), l[y] = Bt(Bt({}, w), {}, {
        isShow: !0
      }));
    }
  }, h = u - 1; h >= 0; h--)
    d(h);
  return l;
}
function UW(e, t, r, n, a, l) {
  var u = (n || []).slice(), c = u.length, f = t.start, d = t.end;
  if (l) {
    var h = n[c - 1];
    if (h != null) {
      var p = r(h, c - 1), y = e * (h.coordinate + e * p / 2 - d);
      if (u[c - 1] = h = Bt(Bt({}, h), {}, {
        tickCoord: y > 0 ? h.coordinate - y * e : h.coordinate
      }), h.tickCoord != null) {
        var b = _l(e, h.tickCoord, () => p, f, d);
        b && (d = h.tickCoord - e * (p / 2 + a), u[c - 1] = Bt(Bt({}, h), {}, {
          isShow: !0
        }));
      }
    }
  }
  for (var w = l ? c - 1 : c, P = function(k) {
    var I = u[k];
    if (I == null)
      return 1;
    var E = I, _, C = () => (_ === void 0 && (_ = r(I, k)), _);
    if (k === 0) {
      var R = e * (E.coordinate - e * C() / 2 - f);
      u[k] = E = Bt(Bt({}, E), {}, {
        tickCoord: R < 0 ? E.coordinate - R * e : E.coordinate
      });
    } else
      u[k] = E = Bt(Bt({}, E), {}, {
        tickCoord: E.coordinate
      });
    if (E.tickCoord != null) {
      var W = _l(e, E.tickCoord, C, f, d);
      W && (f = E.tickCoord + e * (C() / 2 + a), u[k] = Bt(Bt({}, E), {}, {
        isShow: !0
      }));
    }
  }, S = 0; S < w; S++)
    P(S);
  return u;
}
function oy(e, t, r) {
  var n = e.tick, a = e.ticks, l = e.viewBox, u = e.minTickGap, c = e.orientation, f = e.interval, d = e.tickFormatter, h = e.unit, p = e.angle;
  if (!a || !a.length || !n)
    return [];
  if (oe(f) || zl.isSsr) {
    var y;
    return (y = $W(a, oe(f) ? f : 0)) !== null && y !== void 0 ? y : [];
  }
  var b = [], w = c === "top" || c === "bottom" ? "width" : "height", P = h && w === "width" ? gl(h, {
    fontSize: t,
    letterSpacing: r
  }) : {
    width: 0,
    height: 0
  }, S = (_, C) => {
    var R = typeof d == "function" ? d(_.value, C) : _.value;
    return w === "width" ? DW(gl(R, {
      fontSize: t,
      letterSpacing: r
    }), P, p) : gl(R, {
      fontSize: t,
      letterSpacing: r
    })[w];
  }, O = a[0], k = a[1], I = a.length >= 2 && O != null && k != null ? Et(k.coordinate - O.coordinate) : 1, E = NW(l, I, w);
  return f === "equidistantPreserveStart" ? RW(I, E, S, a, u) : f === "equidistantPreserveEnd" ? LW(I, E, S, a, u) : (f === "preserveStart" || f === "preserveStartEnd" ? b = UW(I, E, S, a, u, f === "preserveStartEnd") : b = WW(I, E, S, a, u), b.filter((_) => _.isShow));
}
var KW = (e) => {
  var t = e.ticks, r = e.label, n = e.labelGapWithTick, a = n, l = e.tickSize, u = l === void 0 ? 0 : l, c = e.tickMargin, f = c === void 0 ? 0 : c, d = 0;
  if (t) {
    Array.from(t).forEach((b) => {
      if (b) {
        var w = b.getBoundingClientRect();
        w.width > d && (d = w.width);
      }
    });
    var h = r ? r.getBoundingClientRect().width : 0, p = u + f, y = d + p + h + (r ? a : 0);
    return Math.round(y);
  }
  return 0;
}, HW = (e) => {
  var t = e.ticks, r = e.label, n = e.labelGapWithTick, a = n, l = e.tickSize, u = l === void 0 ? 0 : l, c = e.tickMargin, f = c === void 0 ? 0 : c, d = 0;
  if (t) {
    Array.from(t).forEach((b) => {
      if (b) {
        var w = b.getBoundingClientRect();
        w.height > d && (d = w.height);
      }
    });
    var h = r ? r.getBoundingClientRect().height : 0, p = u + f, y = d + p + h + (r ? a : 0);
    return Math.round(y);
  }
  return 0;
}, VW = {
  xAxis: {},
  yAxis: {}
}, zk = Kt({
  name: "renderedTicks",
  initialState: VW,
  reducers: {
    setRenderedTicks: (e, t) => {
      var r = t.payload, n = r.axisType, a = r.axisId, l = r.ticks;
      e[n][a] = Me(l);
    },
    removeRenderedTicks: (e, t) => {
      var r = t.payload, n = r.axisType, a = r.axisId;
      delete e[n][a];
    }
  }
}), Bk = zk.actions, GW = Bk.setRenderedTicks, YW = Bk.removeRenderedTicks, qW = zk.reducer, XW = ["axisLine", "width", "height", "className", "hide", "ticks", "axisType", "axisId"];
function uS(e, t) {
  return eU(e) || JW(e, t) || ZW(e, t) || QW();
}
function QW() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function ZW(e, t) {
  if (e) {
    if (typeof e == "string") return sS(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? sS(e, t) : void 0;
  }
}
function sS(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function JW(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, a, l, u, c = [], f = !0, d = !1;
    try {
      if (l = (r = r.call(e)).next, t !== 0) for (; !(f = (n = l.call(r)).done) && (c.push(n.value), c.length !== t); f = !0) ;
    } catch (h) {
      d = !0, a = h;
    } finally {
      try {
        if (!f && r.return != null && (u = r.return(), Object(u) !== u)) return;
      } finally {
        if (d) throw a;
      }
    }
    return c;
  }
}
function eU(e) {
  if (Array.isArray(e)) return e;
}
function tU(e, t) {
  if (e == null) return {};
  var r, n, a = rU(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]);
  }
  return a;
}
function rU(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
function Zi() {
  return Zi = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Zi.apply(null, arguments);
}
function cS(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function it(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? cS(Object(r), !0).forEach(function(n) {
      nU(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : cS(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function nU(e, t, r) {
  return (t = iU(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function iU(e) {
  var t = aU(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function aU(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Cn = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  viewBox: {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  },
  // The orientation of axis
  orientation: "bottom",
  // The ticks
  ticks: [],
  stroke: "#666",
  tickLine: !0,
  axisLine: !0,
  tick: !0,
  mirror: !1,
  minTickGap: 5,
  // The width or height of tick
  tickSize: 6,
  tickMargin: 2,
  interval: "preserveEnd",
  zIndex: ct.axis
};
function oU(e) {
  var t = e.x, r = e.y, n = e.width, a = e.height, l = e.orientation, u = e.mirror, c = e.axisLine, f = e.otherSvgProps;
  if (!c)
    return null;
  var d = it(it(it({}, f), vr(c)), {}, {
    fill: "none"
  });
  if (l === "top" || l === "bottom") {
    var h = +(l === "top" && !u || l === "bottom" && u);
    d = it(it({}, d), {}, {
      x1: t,
      y1: r + h * a,
      x2: t + n,
      y2: r + h * a
    });
  } else {
    var p = +(l === "left" && !u || l === "right" && u);
    d = it(it({}, d), {}, {
      x1: t + p * n,
      y1: r,
      x2: t + p * n,
      y2: r + a
    });
  }
  return /* @__PURE__ */ x.createElement("line", Zi({}, d, {
    className: $e("recharts-cartesian-axis-line", ln(c, "className"))
  }));
}
function lU(e, t, r, n, a, l, u, c, f) {
  var d, h, p, y, b, w, P = c ? -1 : 1, S = e.tickSize || u, O = oe(e.tickCoord) ? e.tickCoord : e.coordinate;
  switch (l) {
    case "top":
      d = h = e.coordinate, y = r + +!c * a, p = y - P * S, w = p - P * f, b = O;
      break;
    case "left":
      p = y = e.coordinate, h = t + +!c * n, d = h - P * S, b = d - P * f, w = O;
      break;
    case "right":
      p = y = e.coordinate, h = t + +c * n, d = h + P * S, b = d + P * f, w = O;
      break;
    default:
      d = h = e.coordinate, y = r + +c * a, p = y + P * S, w = p + P * f, b = O;
      break;
  }
  return {
    line: {
      x1: d,
      y1: p,
      x2: h,
      y2: y
    },
    tick: {
      x: b,
      y: w
    }
  };
}
function uU(e, t) {
  switch (e) {
    case "left":
      return t ? "start" : "end";
    case "right":
      return t ? "end" : "start";
    default:
      return "middle";
  }
}
function sU(e, t) {
  switch (e) {
    case "left":
    case "right":
      return "middle";
    case "top":
      return t ? "start" : "end";
    default:
      return t ? "end" : "start";
  }
}
function cU(e) {
  var t = e.option, r = e.tickProps, n = e.value, a, l = $e(r.className, "recharts-cartesian-axis-tick-value");
  if (/* @__PURE__ */ x.isValidElement(t))
    a = /* @__PURE__ */ x.cloneElement(t, it(it({}, r), {}, {
      className: l
    }));
  else if (typeof t == "function")
    a = t(it(it({}, r), {}, {
      className: l
    }));
  else {
    var u = "recharts-cartesian-axis-tick-value";
    typeof t != "boolean" && (u = $e(u, Pk(t))), a = /* @__PURE__ */ x.createElement(pf, Zi({}, r, {
      className: u
    }), n);
  }
  return a;
}
function fU(e) {
  var t = e.ticks, r = e.axisType, n = e.axisId, a = Be(), l = x.useRef(null);
  return x.useEffect(() => {
    if (!(n == null || r == null)) {
      var u = t.map((f) => ({
        value: f.value,
        coordinate: f.coordinate,
        offset: f.offset,
        index: f.index
      })), c = l.current;
      c != null && c.axisId === n && c.axisType === r && MW(c.ticks, u) || (l.current = {
        ticks: u,
        axisId: n,
        axisType: r
      }, a(GW({
        ticks: u,
        axisId: n,
        axisType: r
      })));
    }
  }, [a, t, n, r]), x.useEffect(() => n == null || r == null ? Ji : () => {
    a(YW({
      axisId: n,
      axisType: r
    }));
  }, [a, n, r]), null;
}
var dU = /* @__PURE__ */ x.forwardRef((e, t) => {
  var r = e.ticks, n = r === void 0 ? [] : r, a = e.tick, l = e.tickLine, u = e.stroke, c = e.tickFormatter, f = e.unit, d = e.padding, h = e.tickTextProps, p = e.orientation, y = e.mirror, b = e.x, w = e.y, P = e.width, S = e.height, O = e.tickSize, k = e.tickMargin, I = e.fontSize, E = e.letterSpacing, _ = e.getTicksConfig, C = e.events, R = e.axisType, W = e.axisId, V = oy(it(it({}, _), {}, {
    ticks: n
  }), I, E), K = vr(_), G = Hi(a), F = sk(K.textAnchor) ? K.textAnchor : uU(p, y), ie = sU(p, y), re = {};
  typeof l == "object" && (re = l);
  var ne = it(it({}, K), {}, {
    fill: "none"
  }, re), fe = V.map((ee) => it({
    entry: ee
  }, lU(ee, b, w, P, S, p, O, y, k))), ae = fe.map((ee) => {
    var Y = ee.entry, D = ee.line;
    return /* @__PURE__ */ x.createElement(yt, {
      className: "recharts-cartesian-axis-tick",
      key: "tick-".concat(Y.value, "-").concat(Y.coordinate, "-").concat(Y.tickCoord)
    }, l && /* @__PURE__ */ x.createElement("line", Zi({}, ne, D, {
      className: $e("recharts-cartesian-axis-tick-line", ln(l, "className"))
    })));
  }), U = fe.map((ee, Y) => {
    var D, H, ve = ee.entry, ye = ee.tick, Pe = it(it(it(it({
      verticalAnchor: ie
    }, K), {}, {
      textAnchor: F,
      stroke: "none",
      fill: u
    }, ye), {}, {
      index: Y,
      payload: ve,
      visibleTicksCount: V.length,
      tickFormatter: c,
      padding: d
    }, h), {}, {
      angle: (D = (H = h == null ? void 0 : h.angle) !== null && H !== void 0 ? H : K.angle) !== null && D !== void 0 ? D : 0
    }), Ae = it(it({}, Pe), G);
    return /* @__PURE__ */ x.createElement(yt, Zi({
      className: "recharts-cartesian-axis-tick-label",
      key: "tick-label-".concat(ve.value, "-").concat(ve.coordinate, "-").concat(ve.tickCoord)
    }, Ml(C, ve, Y)), a && /* @__PURE__ */ x.createElement(cU, {
      option: a,
      tickProps: Ae,
      value: "".concat(typeof c == "function" ? c(ve.value, Y) : ve.value).concat(f || "")
    }));
  });
  return /* @__PURE__ */ x.createElement("g", {
    className: "recharts-cartesian-axis-ticks recharts-".concat(R, "-ticks")
  }, /* @__PURE__ */ x.createElement(fU, {
    ticks: V,
    axisId: W,
    axisType: R
  }), U.length > 0 && /* @__PURE__ */ x.createElement(ar, {
    zIndex: ct.label
  }, /* @__PURE__ */ x.createElement("g", {
    className: "recharts-cartesian-axis-tick-labels recharts-".concat(R, "-tick-labels"),
    ref: t
  }, U)), ae.length > 0 && /* @__PURE__ */ x.createElement("g", {
    className: "recharts-cartesian-axis-tick-lines recharts-".concat(R, "-tick-lines")
  }, ae));
}), vU = /* @__PURE__ */ x.forwardRef((e, t) => {
  var r = e.axisLine, n = e.width, a = e.height, l = e.className, u = e.hide, c = e.ticks, f = e.axisType, d = e.axisId, h = tU(e, XW), p = x.useState(""), y = uS(p, 2), b = y[0], w = y[1], P = x.useState(""), S = uS(P, 2), O = S[0], k = S[1], I = x.useRef(null);
  x.useImperativeHandle(t, () => ({
    getCalculatedWidth: () => {
      var _;
      return KW({
        ticks: I.current,
        label: (_ = e.labelRef) === null || _ === void 0 ? void 0 : _.current,
        labelGapWithTick: 5,
        tickSize: e.tickSize,
        tickMargin: e.tickMargin
      });
    },
    getCalculatedHeight: () => {
      var _;
      return HW({
        ticks: I.current,
        label: (_ = e.labelRef) === null || _ === void 0 ? void 0 : _.current,
        labelGapWithTick: 5,
        tickSize: e.tickSize,
        tickMargin: e.tickMargin
      });
    }
  }));
  var E = x.useCallback((_) => {
    if (_) {
      var C = _.getElementsByClassName("recharts-cartesian-axis-tick-value");
      I.current = C;
      var R = C[0];
      if (R) {
        var W = window.getComputedStyle(R), V = W.fontSize, K = W.letterSpacing;
        (V !== b || K !== O) && (w(V), k(K));
      }
    }
  }, [b, O]);
  return u || n != null && n <= 0 || a != null && a <= 0 ? null : /* @__PURE__ */ x.createElement(ar, {
    zIndex: e.zIndex
  }, /* @__PURE__ */ x.createElement(yt, {
    className: $e("recharts-cartesian-axis", l)
  }, /* @__PURE__ */ x.createElement(oU, {
    x: e.x,
    y: e.y,
    width: n,
    height: a,
    orientation: e.orientation,
    mirror: e.mirror,
    axisLine: r,
    otherSvgProps: vr(e)
  }), /* @__PURE__ */ x.createElement(dU, {
    ref: E,
    axisType: f,
    events: h,
    fontSize: b,
    getTicksConfig: e,
    height: e.height,
    letterSpacing: O,
    mirror: e.mirror,
    orientation: e.orientation,
    padding: e.padding,
    stroke: e.stroke,
    tick: e.tick,
    tickFormatter: e.tickFormatter,
    tickLine: e.tickLine,
    tickMargin: e.tickMargin,
    tickSize: e.tickSize,
    tickTextProps: e.tickTextProps,
    ticks: c,
    unit: e.unit,
    width: e.width,
    x: e.x,
    y: e.y,
    axisId: d
  }), /* @__PURE__ */ x.createElement(IF, {
    x: e.x,
    y: e.y,
    width: e.width,
    height: e.height,
    lowerWidth: e.width,
    upperWidth: e.width
  }, /* @__PURE__ */ x.createElement(zF, {
    label: e.label,
    labelRef: e.labelRef
  }), e.children)));
}), ly = /* @__PURE__ */ x.forwardRef((e, t) => {
  var r = gt(e, Cn);
  return /* @__PURE__ */ x.createElement(vU, Zi({}, r, {
    ref: t
  }));
});
ly.displayName = "CartesianAxis";
var hU = {
  grid: {
    stroke: "#ccc",
    fill: "none"
  }
}, Fk = /* @__PURE__ */ x.createContext(hU);
Fk.Provider;
var pU = () => x.useContext(Fk), mU = ["x1", "y1", "x2", "y2", "key"], yU = ["offset"], gU = ["xAxisId", "yAxisId"], xU = ["xAxisId", "yAxisId"];
function fS(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Ft(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? fS(Object(r), !0).forEach(function(n) {
      bU(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : fS(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function bU(e, t, r) {
  return (t = wU(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function wU(e) {
  var t = SU(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function SU(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function Fi() {
  return Fi = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Fi.apply(null, arguments);
}
function wc(e, t) {
  if (e == null) return {};
  var r, n, a = PU(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]);
  }
  return a;
}
function PU(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
var AU = (e) => {
  var t = e.fill;
  if (!t || t === "none")
    return null;
  var r = e.fillOpacity, n = e.x, a = e.y, l = e.width, u = e.height, c = e.ry;
  return /* @__PURE__ */ x.createElement("rect", {
    x: n,
    y: a,
    ry: c,
    width: l,
    height: u,
    stroke: "none",
    fill: t,
    fillOpacity: r,
    className: "recharts-cartesian-grid-bg"
  });
};
function Wk(e) {
  var t = e.option, r = e.lineItemProps, n;
  if (/* @__PURE__ */ x.isValidElement(t))
    n = /* @__PURE__ */ x.cloneElement(t, r);
  else if (typeof t == "function")
    n = t(r);
  else {
    var a, l = r.x1, u = r.y1, c = r.x2, f = r.y2, d = r.key, h = wc(r, mU), p = (a = vr(h)) !== null && a !== void 0 ? a : {};
    p.offset;
    var y = wc(p, yU), b = Array.isArray(y.strokeDasharray) ? y.strokeDasharray.join(",") : y.strokeDasharray;
    n = /* @__PURE__ */ x.createElement("line", Fi({}, y, {
      strokeDasharray: b,
      x1: l,
      y1: u,
      x2: c,
      y2: f,
      fill: "none",
      key: d
    }));
  }
  return n;
}
function OU(e) {
  var t = e.x, r = e.width, n = e.horizontal, a = n === void 0 ? !0 : n, l = e.horizontalPoints;
  if (!a || !l || !l.length)
    return null;
  e.xAxisId, e.yAxisId;
  var u = wc(e, gU), c = l.map((f, d) => {
    var h = Ft(Ft({}, u), {}, {
      x1: t,
      y1: f,
      x2: t + r,
      y2: f,
      key: "line-".concat(d),
      index: d
    });
    return /* @__PURE__ */ x.createElement(Wk, {
      key: "line-".concat(d),
      option: a,
      lineItemProps: h
    });
  });
  return /* @__PURE__ */ x.createElement("g", {
    className: "recharts-cartesian-grid-horizontal"
  }, c);
}
function EU(e) {
  var t = e.y, r = e.height, n = e.vertical, a = n === void 0 ? !0 : n, l = e.verticalPoints;
  if (!a || !l || !l.length)
    return null;
  e.xAxisId, e.yAxisId;
  var u = wc(e, xU), c = l.map((f, d) => {
    var h = Ft(Ft({}, u), {}, {
      x1: f,
      y1: t,
      x2: f,
      y2: t + r,
      key: "line-".concat(d),
      index: d
    });
    return /* @__PURE__ */ x.createElement(Wk, {
      option: a,
      lineItemProps: h,
      key: "line-".concat(d)
    });
  });
  return /* @__PURE__ */ x.createElement("g", {
    className: "recharts-cartesian-grid-vertical"
  }, c);
}
function kU(e) {
  var t = e.horizontalFill, r = e.fillOpacity, n = e.x, a = e.y, l = e.width, u = e.height, c = e.horizontalPoints, f = e.horizontal, d = f === void 0 ? !0 : f;
  if (!d || !t || !t.length || c == null)
    return null;
  var h = c.map((y) => Math.round(y + a - a)).sort((y, b) => y - b);
  a !== h[0] && h.unshift(0);
  var p = h.map((y, b) => {
    var w = h[b + 1], P = w == null, S = P ? a + u - y : w - y;
    if (S <= 0)
      return null;
    var O = b % t.length;
    return /* @__PURE__ */ x.createElement("rect", {
      key: "react-".concat(b),
      y,
      x: n,
      height: S,
      width: l,
      stroke: "none",
      fill: t[O],
      fillOpacity: r,
      className: "recharts-cartesian-grid-bg"
    });
  });
  return /* @__PURE__ */ x.createElement("g", {
    className: "recharts-cartesian-gridstripes-horizontal"
  }, p);
}
function CU(e) {
  var t = e.vertical, r = t === void 0 ? !0 : t, n = e.verticalFill, a = e.fillOpacity, l = e.x, u = e.y, c = e.width, f = e.height, d = e.verticalPoints;
  if (!r || !n || !n.length)
    return null;
  var h = d.map((y) => Math.round(y + l - l)).sort((y, b) => y - b);
  l !== h[0] && h.unshift(0);
  var p = h.map((y, b) => {
    var w = h[b + 1], P = w == null, S = P ? l + c - y : w - y;
    if (S <= 0)
      return null;
    var O = b % n.length;
    return /* @__PURE__ */ x.createElement("rect", {
      key: "react-".concat(b),
      x: y,
      y: u,
      width: S,
      height: f,
      stroke: "none",
      fill: n[O],
      fillOpacity: a,
      className: "recharts-cartesian-grid-bg"
    });
  });
  return /* @__PURE__ */ x.createElement("g", {
    className: "recharts-cartesian-gridstripes-vertical"
  }, p);
}
var IU = (e, t) => {
  var r = e.xAxis, n = e.width, a = e.height, l = e.offset;
  return bA(oy(Ft(Ft(Ft({}, Cn), r), {}, {
    ticks: wA(r),
    viewBox: {
      x: 0,
      y: 0,
      width: n,
      height: a
    }
  })), l.left, l.left + l.width, t);
}, jU = (e, t) => {
  var r = e.yAxis, n = e.width, a = e.height, l = e.offset;
  return bA(oy(Ft(Ft(Ft({}, Cn), r), {}, {
    ticks: wA(r),
    viewBox: {
      x: 0,
      y: 0,
      width: n,
      height: a
    }
  })), l.top, l.top + l.height, t);
}, _U = {
  horizontal: !0,
  vertical: !0,
  // The ordinates of horizontal grid lines
  horizontalPoints: [],
  // The abscissas of vertical grid lines
  verticalPoints: [],
  // The fill of colors of grid lines
  verticalFill: [],
  horizontalFill: [],
  xAxisId: 0,
  yAxisId: 0,
  syncWithTicks: !1,
  zIndex: ct.grid
};
function uy(e) {
  var t, r, n, a, l, u, c = Cp(), f = Ip(), d = CA(), h = Ft(Ft({}, gt(e, _U)), {}, {
    x: oe(e.x) ? e.x : d.left,
    y: oe(e.y) ? e.y : d.top,
    width: oe(e.width) ? e.width : d.width,
    height: oe(e.height) ? e.height : d.height
  }), p = h.xAxisId, y = h.yAxisId, b = h.x, w = h.y, P = h.width, S = h.height, O = h.syncWithTicks, k = h.horizontalValues, I = h.verticalValues, E = Ht(), _ = ue((ae) => iw(ae, "xAxis", p, E)), C = ue((ae) => iw(ae, "yAxis", y, E)), R = pU(), W = {
    stroke: (t = h.stroke) !== null && t !== void 0 ? t : R.grid.stroke,
    strokeWidth: (r = h.strokeWidth) !== null && r !== void 0 ? r : R.grid.strokeWidth,
    strokeOpacity: (n = h.strokeOpacity) !== null && n !== void 0 ? n : R.grid.strokeOpacity,
    strokeDasharray: (a = h.strokeDasharray) !== null && a !== void 0 ? a : R.grid.strokeDasharray
  };
  if (!cn(P) || !cn(S) || !oe(b) || !oe(w))
    return null;
  var V = h.verticalCoordinatesGenerator || IU, K = h.horizontalCoordinatesGenerator || jU, G = h.horizontalPoints, F = h.verticalPoints;
  if ((!G || !G.length) && typeof K == "function") {
    var ie = k && k.length, re = K({
      yAxis: C ? Ft(Ft({}, C), {}, {
        ticks: ie ? k : C.ticks
      }) : void 0,
      width: c ?? P,
      height: f ?? S,
      offset: d
    }, ie ? !0 : O);
    Xs(Array.isArray(re), "horizontalCoordinatesGenerator should return Array but instead it returned [".concat(typeof re, "]")), Array.isArray(re) && (G = re);
  }
  if ((!F || !F.length) && typeof V == "function") {
    var ne = I && I.length, fe = V({
      xAxis: _ ? Ft(Ft({}, _), {}, {
        ticks: ne ? I : _.ticks
      }) : void 0,
      width: c ?? P,
      height: f ?? S,
      offset: d
    }, ne ? !0 : O);
    Xs(Array.isArray(fe), "verticalCoordinatesGenerator should return Array but instead it returned [".concat(typeof fe, "]")), Array.isArray(fe) && (F = fe);
  }
  return /* @__PURE__ */ x.createElement(ar, {
    zIndex: h.zIndex
  }, /* @__PURE__ */ x.createElement("g", {
    className: "recharts-cartesian-grid"
  }, /* @__PURE__ */ x.createElement(AU, {
    fill: (l = h.fill) !== null && l !== void 0 ? l : R.grid.fill,
    fillOpacity: (u = h.fillOpacity) !== null && u !== void 0 ? u : R.grid.fillOpacity,
    x: h.x,
    y: h.y,
    width: h.width,
    height: h.height,
    ry: h.ry
  }), /* @__PURE__ */ x.createElement(kU, Fi({}, h, {
    horizontalPoints: G
  })), /* @__PURE__ */ x.createElement(CU, Fi({}, h, {
    verticalPoints: F
  })), /* @__PURE__ */ x.createElement(OU, Fi({}, h, W, {
    offset: d,
    horizontalPoints: G,
    xAxis: _,
    yAxis: C
  })), /* @__PURE__ */ x.createElement(EU, Fi({}, h, W, {
    offset: d,
    verticalPoints: F,
    xAxis: _,
    yAxis: C
  }))));
}
uy.displayName = "CartesianGrid";
var TU = ["animationElapsedTime", "isAnimating", "isEntrance", "visibleLength", "strokeDasharray", "connectNulls"];
function Hh() {
  return Hh = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Hh.apply(null, arguments);
}
function MU(e, t) {
  if (e == null) return {};
  var r, n, a = DU(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]);
  }
  return a;
}
function DU(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
function NU(e) {
  try {
    return e && e.getTotalLength && e.getTotalLength() || 0;
  } catch {
    return 0;
  }
}
function Uk(e, t) {
  return "".concat(t, "px ").concat(e, "px");
}
function $U(e) {
  return e.length % 2 !== 0 ? [...e, ...e] : e;
}
function RU(e, t) {
  for (var r = [], n = 0; n < t; ++n)
    r.push(...e);
  return r;
}
function LU(e, t, r) {
  var n = $U(r), a = n.reduce((b, w) => b + w, 0);
  if (!a)
    return Uk(t, e);
  for (var l = Math.floor(e / a), u = e % a, c = [], f = 0, d = 0; f < n.length; d += (h = n[f]) !== null && h !== void 0 ? h : 0, ++f) {
    var h, p = n[f];
    if (p != null && d + p > u) {
      c = [...n.slice(0, f), u - d];
      break;
    }
  }
  var y = c.length % 2 === 0 ? [0, t] : [t];
  return [...RU(n, l), ...c, ...y].map((b) => "".concat(b, "px")).join(", ");
}
function zU(e, t, r) {
  if (e) {
    var n = "".concat(e).split(/[,\s]+/gim).map((a) => parseFloat(a));
    return LU(r, t, n);
  }
  return Uk(t, r);
}
function BU(e) {
  e.animationElapsedTime, e.isAnimating, e.isEntrance;
  var t = e.visibleLength, r = e.strokeDasharray, n = e.connectNulls, a = MU(e, TU), l = n ?? !1, u;
  if (t != null) {
    var c, f = a.pathRef, d = NU((c = f == null ? void 0 : f.current) !== null && c !== void 0 ? c : null);
    u = zU(r, d, t);
  } else r != null && (u = String(r));
  return /* @__PURE__ */ x.createElement(_p, Hh({}, a, {
    connectNulls: l,
    strokeDasharray: u
  }));
}
function FU(e) {
  var t = x.useRef(0), r = x.useRef(0), n = x.useRef(!1), a = x.useRef(e);
  return a.current !== e && (t.current = r.current, a.current = e), x.useCallback((l, u) => {
    if (n.current)
      return null;
    var c = Math.min(An(t.current + l * u), u);
    return l > 0 && u > 0 && (r.current = Math.max(r.current, c), c >= u) ? (n.current = !0, null) : c;
  }, []);
}
var WU = {}, Kk = Kt({
  name: "errorBars",
  initialState: WU,
  reducers: {
    addErrorBar: (e, t) => {
      var r = t.payload, n = r.itemId, a = r.errorBar;
      e[n] || (e[n] = []), e[n].push(a);
    },
    replaceErrorBar: (e, t) => {
      var r = t.payload, n = r.itemId, a = r.prev, l = r.next;
      e[n] && (e[n] = e[n].map((u) => u.dataKey === a.dataKey && u.direction === a.direction ? l : u));
    },
    removeErrorBar: (e, t) => {
      var r = t.payload, n = r.itemId, a = r.errorBar;
      e[n] && (e[n] = e[n].filter((l) => l.dataKey !== a.dataKey || l.direction !== a.direction));
    }
  }
}), sy = Kk.actions;
sy.addErrorBar;
sy.replaceErrorBar;
sy.removeErrorBar;
var UU = Kk.reducer, KU = ["children"];
function HU(e, t) {
  if (e == null) return {};
  var r, n, a = VU(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]);
  }
  return a;
}
function VU(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
var GU = {
  data: [],
  xAxisId: "xAxis-0",
  yAxisId: "yAxis-0",
  dataPointFormatter: () => ({
    x: 0,
    y: 0,
    value: 0
  }),
  errorBarOffset: 0
}, YU = /* @__PURE__ */ x.createContext(GU);
function Hk(e) {
  var t = e.children, r = HU(e, KU);
  return /* @__PURE__ */ x.createElement(YU.Provider, {
    value: r
  }, t);
}
function cy(e, t) {
  var r, n, a = ue((d) => Nn(d, e)), l = ue((d) => $n(d, t)), u = (r = a == null ? void 0 : a.allowDataOverflow) !== null && r !== void 0 ? r : ht.allowDataOverflow, c = (n = l == null ? void 0 : l.allowDataOverflow) !== null && n !== void 0 ? n : pt.allowDataOverflow, f = u || c;
  return {
    needClip: f,
    needClipX: u,
    needClipY: c
  };
}
function Vk(e) {
  var t = e.xAxisId, r = e.yAxisId, n = e.clipPathId, a = ay(), l = cy(t, r), u = l.needClipX, c = l.needClipY, f = l.needClip, d = ue((I) => yE(I, t, !1)), h = ue((I) => gE(I, r, !1));
  if (!f || !a)
    return null;
  var p = a.x, y = a.y, b = a.width, w = a.height, P = u && d ? Math.min(d[0], d[1]) : p - b / 2, S = c && h ? Math.min(h[0], h[1]) : y - w / 2, O = u && d ? Math.abs(d[1] - d[0]) : b * 2, k = c && h ? Math.abs(h[1] - h[0]) : w * 2;
  return /* @__PURE__ */ x.createElement("clipPath", {
    id: "clipPath-".concat(n)
  }, /* @__PURE__ */ x.createElement("rect", {
    x: P,
    y: S,
    width: O,
    height: k
  }));
}
var Gk = (e, t, r, n) => fi(e, "xAxis", t, n), Yk = (e, t, r, n) => ci(e, "xAxis", t, n), qk = (e, t, r, n) => fi(e, "yAxis", r, n), Xk = (e, t, r, n) => ci(e, "yAxis", r, n), qU = $([Ne, Gk, qk, Yk, Xk], (e, t, r, n, a) => Mn(e, "xAxis") ? Ga(t, n, !1) : Ga(r, a, !1)), XU = (e, t, r, n, a) => a;
function QU(e) {
  return e.type === "line";
}
var ZU = $([uf, XU], (e, t) => e.filter(QU).find((r) => r.id === t)), JU = $([Ne, Gk, qk, Yk, Xk, ZU, qU, Fl], (e, t, r, n, a, l, u, c) => {
  var f = c.chartData, d = c.dataStartIndex, h = c.dataEndIndex;
  if (!(l == null || t == null || r == null || n == null || a == null || n.length === 0 || a.length === 0 || u == null || e !== "horizontal" && e !== "vertical")) {
    var p = l.dataKey, y = l.data, b;
    if (y != null && y.length > 0 ? b = y : b = f == null ? void 0 : f.slice(d, h + 1), b != null)
      return wK({
        layout: e,
        xAxis: t,
        yAxis: r,
        xAxisTicks: n,
        yAxisTicks: a,
        dataKey: p,
        bandSize: u,
        displayedData: b
      });
  }
});
function eK(e) {
  var t = Hi(e), r = 3, n = 2;
  if (t != null) {
    var a = t.r, l = t.strokeWidth, u = Number(a), c = Number(l);
    return (Number.isNaN(u) || u < 0) && (u = r), (Number.isNaN(c) || c < 0) && (c = n), {
      r: u,
      strokeWidth: c
    };
  }
  return {
    r,
    strokeWidth: n
  };
}
var tK = ["id"], rK = ["type", "layout", "connectNulls", "needClip", "shape", "strokeDasharray"], nK = ["activeDot", "animateNewValues", "animationBegin", "animationDuration", "animationEasing", "connectNulls", "dot", "hide", "isAnimationActive", "label", "legendType", "xAxisId", "yAxisId", "id"];
function Sc() {
  return Sc = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Sc.apply(null, arguments);
}
function fy(e, t) {
  if (e == null) return {};
  var r, n, a = iK(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]);
  }
  return a;
}
function iK(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
function dS(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function tn(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? dS(Object(r), !0).forEach(function(n) {
      aK(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : dS(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function aK(e, t, r) {
  return (t = oK(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function oK(e) {
  var t = lK(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function lK(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function uK(e) {
  try {
    return e && e.getTotalLength && e.getTotalLength() || 0;
  } catch {
    return 0;
  }
}
function sK(e) {
  var t = 0, r = 0;
  for (var n of e)
    n.status === "matched" && n.prev.x != null && n.next.x != null && (t += n.next.x - n.prev.x, r++);
  return r > 0 ? t / r : 0;
}
var cK = (e, t) => {
  if (e == null)
    return [];
  if (t === 1) return e.flatMap((c) => c.status === "removed" ? [] : [c.next]);
  var r = sK(e), n = [];
  for (var a of e)
    if (a.status === "matched")
      n.push(tn(tn({}, a.next), {}, {
        x: nt(a.prev.x, a.next.x, t),
        y: nt(a.prev.y, a.next.y, t)
      }));
    else if (a.status === "added")
      if (a.next.x != null) {
        var l = a.next.x - r;
        n.push(tn(tn({}, a.next), {}, {
          x: nt(l, a.next.x, t),
          y: a.next.y
        }));
      } else
        n.push(a.next);
    else if (a.status === "removed" && a.prev.x != null) {
      var u = a.prev.x + r;
      n.push(tn(tn({}, a.prev), {}, {
        x: nt(a.prev.x, u, t),
        y: a.prev.y
      }));
    }
  return n;
}, dy = {
  activeDot: !0,
  animateNewValues: !0,
  animationBegin: 0,
  animationDuration: 1500,
  animationEasing: "ease",
  animationInterpolateFn: cK,
  animationMatchBy: Jm,
  connectNulls: !1,
  dot: !0,
  fill: "#fff",
  hide: !1,
  isAnimationActive: "auto",
  label: !1,
  legendType: "line",
  shape: BU,
  stroke: "#3182bd",
  strokeWidth: 1,
  xAxisId: 0,
  yAxisId: 0,
  zIndex: ct.line,
  type: "linear"
}, fK = (e) => {
  var t = e.dataKey, r = e.name, n = e.stroke, a = e.legendType, l = e.hide;
  return [{
    inactive: l,
    dataKey: t,
    type: a,
    color: n,
    value: ro(r, t),
    payload: e
  }];
}, dK = /* @__PURE__ */ x.memo((e) => {
  var t = e.dataKey, r = e.data, n = e.stroke, a = e.strokeWidth, l = e.fill, u = e.name, c = e.hide, f = e.unit, d = e.formatter, h = e.tooltipType, p = e.id, y = {
    dataDefinedOnItem: r,
    getPosition: Ji,
    settings: {
      stroke: n,
      strokeWidth: a,
      fill: l,
      dataKey: t,
      nameKey: void 0,
      name: ro(u, t),
      hide: c,
      type: h,
      color: n,
      unit: f,
      formatter: d,
      graphicalItemId: p
    }
  };
  return /* @__PURE__ */ x.createElement(Zm, {
    tooltipEntrySettings: y
  });
});
function vK(e) {
  var t = e.clipPathId, r = e.points, n = e.props, a = n.dot, l = n.dataKey, u = n.needClip;
  n.id;
  var c = fy(n, tK), f = vr(c);
  return /* @__PURE__ */ x.createElement(R5, {
    points: r,
    dot: a,
    className: "recharts-line-dots",
    dotClassName: "recharts-line-dot",
    dataKey: l,
    baseProps: f,
    needClip: u,
    clipPathId: t
  });
}
function hK(e) {
  var t = e.showLabels, r = e.children, n = e.points, a = x.useMemo(() => n == null ? void 0 : n.map((l) => {
    var u, c, f = {
      x: (u = l.x) !== null && u !== void 0 ? u : 0,
      y: (c = l.y) !== null && c !== void 0 ? c : 0,
      width: 0,
      lowerWidth: 0,
      upperWidth: 0,
      height: 0
    };
    return tn(tn({}, f), {}, {
      value: l.value,
      payload: l.payload,
      viewBox: f,
      /*
       * Line is not passing parentViewBox to the LabelList so the labels can escape - looks like a bug, should we pass parentViewBox?
       * Or should this just be the root chart viewBox?
       */
      parentViewBox: void 0,
      fill: void 0
    });
  }), [n]);
  return /* @__PURE__ */ x.createElement(yk, {
    value: t ? a : void 0
  }, r);
}
function pK(e) {
  var t = e.clipPathId, r = e.pathRef, n = e.points, a = e.props, l = e.animationElapsedTime, u = e.isAnimating, c = e.isEntrance, f = e.visibleLength, d = a.type, h = a.layout, p = a.connectNulls, y = a.needClip, b = a.shape, w = a.strokeDasharray, P = fy(a, rK), S = tn(tn({}, hr(P)), {}, {
    fill: "none",
    className: "recharts-line-curve",
    clipPath: y ? "url(#clipPath-".concat(t, ")") : void 0,
    points: n,
    type: d,
    layout: h,
    connectNulls: p,
    strokeDasharray: w ?? a.strokeDasharray,
    pathRef: r,
    animationElapsedTime: l,
    isAnimating: u,
    isEntrance: a.animateNewValues ? c : !1,
    visibleLength: f
  });
  return /* @__PURE__ */ x.createElement(x.Fragment, null, (n == null ? void 0 : n.length) > 1 && /* @__PURE__ */ x.createElement(Ym, {
    option: b,
    DefaultShape: dy.shape,
    shapeProps: S
  }), /* @__PURE__ */ x.createElement(vK, {
    points: n,
    clipPathId: t,
    props: a
  }));
}
function mK(e) {
  var t = e.clipPathId, r = e.props, n = e.pathRef, a = e.previousPointsRef, l = r.points, u = r.isAnimationActive, c = r.animationBegin, f = r.animationDuration, d = r.animationEasing, h = r.animationMatchBy, p = r.animationInterpolateFn, y = r.layout, b = uK(n.current), w = ry(r.onAnimationStart, r.onAnimationEnd), P = w.isAnimating, S = w.handleAnimationStart, O = w.handleAnimationEnd, k = !P, I = FU(l), E = x.useCallback((_) => _ > 0 && b > 0, [b]);
  return /* @__PURE__ */ x.createElement(hK, {
    points: l,
    showLabels: k
  }, r.children, /* @__PURE__ */ x.createElement(ny, {
    animationInput: l,
    animationIdPrefix: "recharts-line-",
    items: l,
    previousItemsRef: a,
    isAnimationActive: u,
    animationBegin: c,
    animationDuration: f,
    animationEasing: d,
    onAnimationStart: S,
    onAnimationEnd: O,
    animationInterpolateFn: p,
    animationMatchBy: h,
    shouldUpdatePreviousRef: E,
    layout: y
  }, (_, C, R) => {
    var W = P || C < 1, V = W ? I(C, b) : null;
    return /* @__PURE__ */ x.createElement(pK, {
      props: r,
      points: _,
      clipPathId: t,
      pathRef: n,
      animationElapsedTime: C,
      isAnimating: W,
      isEntrance: R,
      visibleLength: V
    });
  }), /* @__PURE__ */ x.createElement(Km, {
    label: r.label
  }));
}
function yK(e) {
  var t = e.clipPathId, r = e.props, n = x.useRef(null), a = x.useRef(null);
  return /* @__PURE__ */ x.createElement(mK, {
    props: r,
    clipPathId: t,
    previousPointsRef: n,
    pathRef: a
  });
}
var gK = (e, t) => {
  var r, n;
  return {
    x: (r = e.x) !== null && r !== void 0 ? r : void 0,
    y: (n = e.y) !== null && n !== void 0 ? n : void 0,
    value: e.value,
    // getValueByDataKey does not validate the output type
    errorVal: Le(e.payload, t)
  };
};
class xK extends x.Component {
  render() {
    var t = this.props, r = t.hide, n = t.dot, a = t.points, l = t.className, u = t.xAxisId, c = t.yAxisId, f = t.top, d = t.left, h = t.width, p = t.height, y = t.id, b = t.needClip, w = t.zIndex;
    if (r)
      return null;
    var P = $e("recharts-line", l), S = y, O = eK(n), k = O.r, I = O.strokeWidth, E = Ek(n), _ = k * 2 + I, C = b ? "url(#clipPath-".concat(E ? "" : "dots-").concat(S, ")") : void 0;
    return /* @__PURE__ */ x.createElement(ar, {
      zIndex: w
    }, /* @__PURE__ */ x.createElement(yt, {
      className: P
    }, b && /* @__PURE__ */ x.createElement("defs", null, /* @__PURE__ */ x.createElement(Vk, {
      clipPathId: S,
      xAxisId: u,
      yAxisId: c
    }), !E && /* @__PURE__ */ x.createElement("clipPath", {
      id: "clipPath-dots-".concat(S)
    }, /* @__PURE__ */ x.createElement("rect", {
      x: d - _ / 2,
      y: f - _ / 2,
      width: h + _,
      height: p + _
    }))), /* @__PURE__ */ x.createElement(Hk, {
      xAxisId: u,
      yAxisId: c,
      data: a,
      dataPointFormatter: gK,
      errorBarOffset: 0
    }, /* @__PURE__ */ x.createElement(yK, {
      props: this.props,
      clipPathId: S
    }))), /* @__PURE__ */ x.createElement(iW, {
      activeDot: this.props.activeDot,
      points: a,
      mainColor: this.props.stroke,
      itemDataKey: this.props.dataKey,
      clipPath: C
    }));
  }
}
function bK(e) {
  var t = gt(e, dy), r = t.activeDot, n = t.animateNewValues, a = t.animationBegin, l = t.animationDuration, u = t.animationEasing, c = t.connectNulls, f = t.dot, d = t.hide, h = t.isAnimationActive, p = t.label, y = t.legendType, b = t.xAxisId, w = t.yAxisId, P = t.id, S = fy(t, nK), O = cy(b, w), k = O.needClip, I = ay(), E = ea(), _ = Ht(), C = ue((G) => JU(G, b, w, _, P));
  if (E !== "horizontal" && E !== "vertical" || C == null || I == null)
    return null;
  var R = I.height, W = I.width, V = I.x, K = I.y;
  return /* @__PURE__ */ x.createElement(xK, Sc({}, S, {
    id: P,
    connectNulls: c,
    dot: f,
    activeDot: r,
    animateNewValues: n,
    animationBegin: a,
    animationDuration: l,
    animationEasing: u,
    isAnimationActive: h,
    hide: d,
    label: p,
    legendType: y,
    xAxisId: b,
    yAxisId: w,
    points: C,
    layout: E,
    height: R,
    width: W,
    left: V,
    top: K,
    needClip: k
  }));
}
function wK(e) {
  var t = e.layout, r = e.xAxis, n = e.yAxis, a = e.xAxisTicks, l = e.yAxisTicks, u = e.dataKey, c = e.bandSize, f = e.displayedData;
  return f.map((d, h) => {
    var p = Le(d, u);
    if (t === "horizontal") {
      var y = eb({
        axis: r,
        ticks: a,
        bandSize: c,
        entry: d,
        index: h
      }), b = Qe(p) ? null : n.scale.map(p);
      return {
        x: y,
        y: b ?? null,
        value: p,
        payload: d
      };
    }
    var w = Qe(p) ? null : r.scale.map(p), P = eb({
      axis: n,
      ticks: l,
      bandSize: c,
      entry: d,
      index: h
    });
    return w == null || P == null ? null : {
      x: w,
      y: P,
      value: p,
      payload: d
    };
  }).filter(Boolean);
}
function SK(e) {
  var t = gt(e, dy), r = Ht();
  return /* @__PURE__ */ x.createElement(iy, {
    id: t.id,
    type: "line"
  }, (n) => /* @__PURE__ */ x.createElement(x.Fragment, null, /* @__PURE__ */ x.createElement(Ck, {
    legendPayload: fK(t)
  }), /* @__PURE__ */ x.createElement(dK, {
    dataKey: t.dataKey,
    data: t.data,
    stroke: t.stroke,
    strokeWidth: t.strokeWidth,
    fill: t.fill,
    name: t.name,
    hide: t.hide,
    unit: t.unit,
    formatter: t.formatter,
    tooltipType: t.tooltipType,
    id: n
  }), /* @__PURE__ */ x.createElement(jk, {
    type: "line",
    id: n,
    data: t.data,
    xAxisId: t.xAxisId,
    yAxisId: t.yAxisId,
    zAxisId: 0,
    dataKey: t.dataKey,
    hide: t.hide,
    isPanorama: r
  }), /* @__PURE__ */ x.createElement(bK, Sc({}, t, {
    id: n
  }))));
}
var Qk = /* @__PURE__ */ x.memo(SK, no);
Qk.displayName = "Line";
function ia(e, t) {
  var r, n;
  return (r = (n = e.graphicalItems.cartesianItems.find((a) => a.id === t)) === null || n === void 0 ? void 0 : n.xAxisId) !== null && r !== void 0 ? r : Mk;
}
function aa(e, t) {
  var r, n;
  return (r = (n = e.graphicalItems.cartesianItems.find((a) => a.id === t)) === null || n === void 0 ? void 0 : n.yAxisId) !== null && r !== void 0 ? r : Mk;
}
var PK = "Invariant failed";
function AK(e, t) {
  throw new Error(PK);
}
var OK = ["option"];
function EK(e, t) {
  if (e == null) return {};
  var r, n, a = kK(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]);
  }
  return a;
}
function kK(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
var vy = WA;
function hy(e) {
  var t = e.option, r = EK(e, OK);
  return /* @__PURE__ */ x.createElement(Ym, {
    option: t,
    DefaultShape: vy,
    shapeProps: r,
    activeClassName: "recharts-active-bar",
    inActiveClassName: "recharts-inactive-bar"
  });
}
var CK = function(t) {
  var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
  return (n, a) => {
    if (oe(t)) return t;
    var l = oe(n) || Qe(n);
    return l ? t(n, a) : (l || AK(), r);
  };
}, IK = (e, t, r) => r, jK = (e, t) => t, eu = $([uf, jK], (e, t) => e.filter((r) => r.type === "bar").find((r) => r.id === t)), _K = $([eu], (e) => e == null ? void 0 : e.maxBarSize), TK = (e, t, r, n) => n, MK = $([Ne, uf, ia, aa, IK], (e, t, r, n, a) => t.filter((l) => e === "horizontal" ? l.xAxisId === r : l.yAxisId === n).filter((l) => l.isPanorama === a).filter((l) => l.hide === !1).filter((l) => l.type === "bar")), DK = (e, t, r) => {
  var n = Ne(e), a = ia(e, t), l = aa(e, t);
  if (!(a == null || l == null))
    return n === "horizontal" ? Bh(e, "yAxis", l, r) : Bh(e, "xAxis", a, r);
}, NK = (e, t) => {
  var r = Ne(e), n = ia(e, t), a = aa(e, t);
  if (!(n == null || a == null))
    return r === "horizontal" ? nw(e, "xAxis", n) : nw(e, "yAxis", a);
}, $K = $([MK, ER, NK], cW), RK = (e, t, r) => {
  var n, a, l = eu(e, t);
  if (l == null)
    return 0;
  var u = ia(e, t), c = aa(e, t);
  if (u == null || c == null)
    return 0;
  var f = Ne(e), d = aO(e), h = l.maxBarSize, p = Qe(h) ? d : h, y, b;
  return f === "horizontal" ? (y = fi(e, "xAxis", u, r), b = ci(e, "xAxis", u, r)) : (y = fi(e, "yAxis", c, r), b = ci(e, "yAxis", c, r)), (n = (a = Ga(y, b, !0)) !== null && a !== void 0 ? a : p) !== null && n !== void 0 ? n : 0;
}, Zk = (e, t, r) => {
  var n = Ne(e), a = ia(e, t), l = aa(e, t);
  if (!(a == null || l == null)) {
    var u, c;
    return n === "horizontal" ? (u = fi(e, "xAxis", a, r), c = ci(e, "xAxis", a, r)) : (u = fi(e, "yAxis", l, r), c = ci(e, "yAxis", l, r)), Ga(u, c);
  }
}, LK = $([$K, aO, OR, oO, RK, Zk, _K], pW), zK = (e, t, r) => {
  var n = ia(e, t);
  if (n != null)
    return fi(e, "xAxis", n, r);
}, BK = (e, t, r) => {
  var n = aa(e, t);
  if (n != null)
    return fi(e, "yAxis", n, r);
}, FK = (e, t, r) => {
  var n = ia(e, t);
  if (n != null)
    return ci(e, "xAxis", n, r);
}, WK = (e, t, r) => {
  var n = aa(e, t);
  if (n != null)
    return ci(e, "yAxis", n, r);
}, UK = $([LK, eu], yW), KK = $([DK, eu], mW), HK = $([xt, Ep, zK, BK, FK, WK, UK, Ne, uR, Zk, KK, eu, TK], (e, t, r, n, a, l, u, c, f, d, h, p, y) => {
  var b = f.chartData, w = f.dataStartIndex, P = f.dataEndIndex;
  if (!(p == null || u == null || t == null || c !== "horizontal" && c !== "vertical" || r == null || n == null || a == null || l == null || d == null)) {
    var S = p.data, O;
    if (S != null && S.length > 0 ? O = S : O = b == null ? void 0 : b.slice(w, P + 1), O != null)
      return A9({
        layout: c,
        barSettings: p,
        pos: u,
        parentViewBox: t,
        bandSize: d,
        xAxis: r,
        yAxis: n,
        xAxisTicks: a,
        yAxisTicks: l,
        stackedData: h,
        displayedData: O,
        offset: e,
        cells: y,
        dataStartIndex: w
      });
  }
}), VK = ["index"];
function Vh() {
  return Vh = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Vh.apply(null, arguments);
}
function GK(e, t) {
  if (e == null) return {};
  var r, n, a = YK(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]);
  }
  return a;
}
function YK(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
var Jk = /* @__PURE__ */ x.createContext(void 0), qK = (e) => {
  var t = x.useContext(Jk);
  if (t != null)
    return t.stackId;
  if (e != null)
    return FM(e);
}, XK = (e, t) => "recharts-bar-stack-clip-path-".concat(e, "-").concat(t), QK = (e) => {
  var t = x.useContext(Jk);
  if (t != null) {
    var r = t.stackId;
    return "url(#".concat(XK(r, e), ")");
  }
}, eC = (e) => {
  var t = e.index, r = GK(e, VK), n = QK(t);
  return /* @__PURE__ */ x.createElement(yt, Vh({
    className: "recharts-bar-stack-layer",
    clipPath: n
  }, r));
}, ZK = ["onMouseEnter", "onMouseLeave", "onClick"], JK = ["value", "background", "tooltipPosition"], e9 = ["id"], t9 = ["onMouseEnter", "onClick", "onMouseLeave"];
function vS(e, t) {
  return a9(e) || i9(e, t) || n9(e, t) || r9();
}
function r9() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function n9(e, t) {
  if (e) {
    if (typeof e == "string") return hS(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? hS(e, t) : void 0;
  }
}
function hS(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function i9(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, a, l, u, c = [], f = !0, d = !1;
    try {
      if (l = (r = r.call(e)).next, t !== 0) for (; !(f = (n = l.call(r)).done) && (c.push(n.value), c.length !== t); f = !0) ;
    } catch (h) {
      d = !0, a = h;
    } finally {
      try {
        if (!f && r.return != null && (u = r.return(), Object(u) !== u)) return;
      } finally {
        if (d) throw a;
      }
    }
    return c;
  }
}
function a9(e) {
  if (Array.isArray(e)) return e;
}
function vi() {
  return vi = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, vi.apply(null, arguments);
}
function pS(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function mt(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? pS(Object(r), !0).forEach(function(n) {
      o9(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : pS(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function o9(e, t, r) {
  return (t = l9(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function l9(e) {
  var t = u9(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function u9(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function Pc(e, t) {
  if (e == null) return {};
  var r, n, a = s9(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]);
  }
  return a;
}
function s9(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
var c9 = (e) => {
  var t = e.dataKey, r = e.name, n = e.fill, a = e.legendType, l = e.hide;
  return [{
    inactive: l,
    dataKey: t,
    type: a,
    color: n,
    value: ro(r, t),
    payload: e
  }];
}, f9 = /* @__PURE__ */ x.memo((e) => {
  var t = e.dataKey, r = e.stroke, n = e.strokeWidth, a = e.fill, l = e.name, u = e.hide, c = e.unit, f = e.formatter, d = e.tooltipType, h = e.id, p = {
    dataDefinedOnItem: void 0,
    getPosition: Ji,
    settings: {
      stroke: r,
      strokeWidth: n,
      fill: a,
      dataKey: t,
      nameKey: void 0,
      name: ro(l, t),
      hide: u,
      type: d,
      color: a,
      unit: c,
      formatter: f,
      graphicalItemId: h
    }
  };
  return /* @__PURE__ */ x.createElement(Zm, {
    tooltipEntrySettings: p
  });
});
function d9(e) {
  var t = ue(di), r = e.data, n = e.dataKey, a = e.background, l = e.allOtherBarProps, u = l.onMouseEnter, c = l.onMouseLeave, f = l.onClick, d = Pc(l, ZK), h = qm(u, n, l.id), p = Xm(c), y = Qm(f, n, l.id);
  if (!a || r == null)
    return null;
  var b = Hi(a);
  return /* @__PURE__ */ x.createElement(ar, {
    zIndex: gW(a, ct.barBackground)
  }, r.map((w, P) => {
    w.value;
    var S = w.background;
    w.tooltipPosition;
    var O = Pc(w, JK);
    if (!S)
      return null;
    var k = h(w, w.originalDataIndex), I = p(w, w.originalDataIndex), E = y(w, w.originalDataIndex), _ = mt(mt(mt(mt(mt({
      option: a,
      isActive: String(w.originalDataIndex) === t
    }, O), {}, {
      // @ts-expect-error backgroundProps is contributing unknown props
      fill: "#eee"
    }, S), b), Ml(d, w, P)), {}, {
      onMouseEnter: k,
      onMouseLeave: I,
      onClick: E,
      dataKey: n,
      index: P,
      className: "recharts-bar-background-rectangle"
    });
    return /* @__PURE__ */ x.createElement(hy, vi({
      key: "background-bar-".concat(P)
    }, _));
  }));
}
function v9(e) {
  var t = e.showLabels, r = e.children, n = e.rects, a = n == null ? void 0 : n.map((l) => {
    var u = {
      x: l.x,
      y: l.y,
      width: l.width,
      lowerWidth: l.width,
      upperWidth: l.width,
      height: l.height
    };
    return mt(mt({}, u), {}, {
      value: l.value,
      payload: l.payload,
      parentViewBox: l.parentViewBox,
      viewBox: u,
      fill: l.fill
    });
  });
  return /* @__PURE__ */ x.createElement(yk, {
    value: t ? a : void 0
  }, r);
}
function h9(e) {
  var t = e.shape, r = e.activeBar, n = e.baseProps, a = e.entry, l = e.index, u = e.dataKey, c = ue(di), f = ue(Rm), d = r && String(a.originalDataIndex) === c && (f == null || u === f), h = c != null && (String(a.originalDataIndex) !== c || f != null && u !== f), p = x.useState(!1), y = vS(p, 2), b = y[0], w = y[1], P = x.useState(!1), S = vS(P, 2), O = S[0], k = S[1];
  x.useEffect(() => {
    var W;
    return d ? (w(!0), W = requestAnimationFrame(() => {
      k(!0);
    })) : (k(!1), h && w(!1)), () => {
      cancelAnimationFrame(W);
    };
  }, [d, h]);
  var I = x.useCallback(() => {
    d || w(!1);
  }, [d]), E = d && O, _ = d || b, C;
  d ? r === !0 ? C = t : C = r : C = t;
  var R = /* @__PURE__ */ x.createElement(hy, vi({}, n, {
    name: String(n.name)
  }, a, {
    isActive: E,
    option: C,
    index: l,
    dataKey: u,
    animationElapsedTime: e.animationElapsedTime,
    isAnimating: e.isAnimating,
    isEntrance: e.isEntrance,
    onTransitionEnd: I
  }));
  return _ ? /* @__PURE__ */ x.createElement(ar, {
    zIndex: ct.activeBar
  }, /* @__PURE__ */ x.createElement(eC, {
    index: a.originalDataIndex
  }, R)) : R;
}
function p9(e) {
  var t = e.shape, r = e.baseProps, n = e.entry, a = e.index, l = e.dataKey;
  return /* @__PURE__ */ x.createElement(hy, vi({}, r, {
    name: String(r.name)
  }, n, {
    isActive: !1,
    option: t,
    index: a,
    dataKey: l,
    animationElapsedTime: e.animationElapsedTime,
    isAnimating: e.isAnimating,
    isEntrance: e.isEntrance
  }));
}
function m9(e) {
  var t, r = e.data, n = e.props, a = e.animationElapsedTime, l = e.isAnimating, u = e.isEntrance, c = (t = vr(n)) !== null && t !== void 0 ? t : {}, f = c.id, d = Pc(c, e9), h = n.shape, p = n.dataKey, y = n.activeBar, b = n.onMouseEnter, w = n.onClick, P = n.onMouseLeave, S = Pc(n, t9), O = qm(b, p, f), k = Xm(P), I = Qm(w, p, f);
  return r ? /* @__PURE__ */ x.createElement(x.Fragment, null, r.map((E, _) => /* @__PURE__ */ x.createElement(eC, vi({
    index: E.originalDataIndex,
    key: "rectangle-".concat(E == null ? void 0 : E.x, "-").concat(E == null ? void 0 : E.y, "-").concat(E == null ? void 0 : E.value, "-").concat(_),
    className: "recharts-bar-rectangle"
  }, Ml(S, E, _), {
    onMouseEnter: O(E, E.originalDataIndex),
    onMouseLeave: k(E, E.originalDataIndex),
    onClick: I(E, E.originalDataIndex)
  }), y ? /* @__PURE__ */ x.createElement(h9, {
    shape: h,
    activeBar: y,
    baseProps: d,
    entry: E,
    index: _,
    dataKey: p,
    animationElapsedTime: a,
    isAnimating: l,
    isEntrance: u
  }) : (
    /*
     * If the `activeBar` prop is falsy, then let's call the variant without hooks.
     * Using the `selectActiveTooltipIndex` selector is usually fast
     * but in charts with large-ish amount of data even the few nanoseconds add up to a noticeable jank.
     * If the activeBar is false then we don't need to know which index is active - because we won't use it anyway.
     * So let's just skip the hooks altogether. That way, React can skip rendering the component,
     * and can skip the tree reconciliation for its children too.
     * Because we can't call hooks conditionally, we need to have a separate component for that.
     */
    /* @__PURE__ */ x.createElement(p9, {
      shape: h,
      baseProps: d,
      entry: E,
      index: _,
      dataKey: p,
      animationElapsedTime: a,
      isAnimating: l,
      isEntrance: u
    })
  )))) : null;
}
var y9 = (e, t, r) => e == null ? [] : t === 1 ? e.flatMap((n) => n.status === "removed" ? [] : [n.next]) : e.flatMap((n) => {
  if (n.status === "removed")
    return r === "horizontal" ? [mt(mt({}, n.prev), {}, {
      height: nt(n.prev.height, 0, t),
      y: nt(n.prev.y, n.prev.y + n.prev.height, t)
    })] : [mt(mt({}, n.prev), {}, {
      width: nt(n.prev.width, 0, t)
    })];
  if (n.status === "matched")
    return [mt(mt({}, n.next), {}, {
      x: nt(n.prev.x, n.next.x, t),
      y: nt(n.prev.y, n.next.y, t),
      width: nt(n.prev.width, n.next.width, t),
      height: nt(n.prev.height, n.next.height, t)
    })];
  var a = n.next;
  return r === "horizontal" ? [mt(mt({}, a), {}, {
    height: nt(0, a.height, t),
    y: nt(a.stackedBarStart, a.y, t)
  })] : [mt(mt({}, a), {}, {
    width: nt(0, a.width, t),
    x: nt(a.stackedBarStart, a.x, t)
  })];
});
function g9(e) {
  var t = e.props, r = e.previousRectanglesRef, n = t.data, a = t.isAnimationActive, l = t.animationBegin, u = t.animationDuration, c = t.animationEasing, f = t.animationInterpolateFn, d = t.layout, h = ry(t.onAnimationStart, t.onAnimationEnd), p = h.isAnimating, y = h.handleAnimationStart, b = h.handleAnimationEnd;
  return /* @__PURE__ */ x.createElement(v9, {
    showLabels: !p,
    rects: n
  }, /* @__PURE__ */ x.createElement(ny, {
    animationInput: n,
    animationIdPrefix: "recharts-bar-",
    items: n,
    previousItemsRef: r,
    isAnimationActive: a,
    animationBegin: l,
    animationDuration: u,
    animationEasing: c,
    onAnimationStart: y,
    onAnimationEnd: b,
    animationInterpolateFn: f,
    animationMatchBy: t.animationMatchBy,
    layout: d
  }, (w, P, S) => /* @__PURE__ */ x.createElement(yt, null, /* @__PURE__ */ x.createElement(m9, {
    props: t,
    data: w,
    animationElapsedTime: P,
    isAnimating: p || P < 1,
    isEntrance: S
  }))), /* @__PURE__ */ x.createElement(Km, {
    label: t.label
  }), t.children);
}
function x9(e) {
  var t = x.useRef(null);
  return /* @__PURE__ */ x.createElement(g9, {
    previousRectanglesRef: t,
    props: e
  });
}
var tC = 0, b9 = (e, t) => {
  var r = Array.isArray(e.value) ? e.value[1] : e.value;
  return {
    x: e.x,
    y: e.y,
    value: r,
    // getValueByDataKey does not validate the output type
    errorVal: Le(e, t)
  };
};
class w9 extends x.PureComponent {
  render() {
    var t = this.props, r = t.hide, n = t.data, a = t.dataKey, l = t.className, u = t.xAxisId, c = t.yAxisId, f = t.needClip, d = t.background, h = t.id;
    if (r || n == null)
      return null;
    var p = $e("recharts-bar", l), y = h;
    return /* @__PURE__ */ x.createElement(yt, {
      className: p,
      id: h
    }, f && /* @__PURE__ */ x.createElement("defs", null, /* @__PURE__ */ x.createElement(Vk, {
      clipPathId: y,
      xAxisId: u,
      yAxisId: c
    })), /* @__PURE__ */ x.createElement(yt, {
      className: "recharts-bar-rectangles",
      clipPath: f ? "url(#clipPath-".concat(y, ")") : void 0
    }, /* @__PURE__ */ x.createElement(d9, {
      data: n,
      dataKey: a,
      background: d,
      allOtherBarProps: this.props
    }), /* @__PURE__ */ x.createElement(x9, this.props)));
  }
}
var S9 = {
  activeBar: !1,
  animationBegin: 0,
  animationDuration: 400,
  animationEasing: "ease",
  animationInterpolateFn: y9,
  animationMatchBy: ey,
  background: !1,
  hide: !1,
  isAnimationActive: "auto",
  label: !1,
  legendType: "rect",
  minPointSize: tC,
  shape: vy,
  xAxisId: 0,
  yAxisId: 0,
  zIndex: ct.bar
};
function P9(e) {
  var t = e.xAxisId, r = e.yAxisId, n = e.hide, a = e.legendType, l = e.minPointSize, u = e.activeBar, c = e.animationBegin, f = e.animationDuration, d = e.animationEasing, h = e.isAnimationActive, p = cy(t, r), y = p.needClip, b = ea(), w = Ht(), P = Gm(e.children, Jl), S = ue((I) => HK(I, e.id, w, P));
  if (b !== "vertical" && b !== "horizontal")
    return null;
  var O, k = S == null ? void 0 : S[0];
  return k == null || k.height == null || k.width == null ? O = 0 : O = b === "vertical" ? k.height / 2 : k.width / 2, /* @__PURE__ */ x.createElement(Hk, {
    xAxisId: t,
    yAxisId: r,
    data: S,
    dataPointFormatter: b9,
    errorBarOffset: O
  }, /* @__PURE__ */ x.createElement(w9, vi({}, e, {
    layout: b,
    needClip: y,
    data: S,
    xAxisId: t,
    yAxisId: r,
    hide: n,
    legendType: a,
    minPointSize: l,
    activeBar: u,
    animationBegin: c,
    animationDuration: f,
    animationEasing: d,
    isAnimationActive: h
  })));
}
function A9(e) {
  var t = e.layout, r = e.barSettings, n = r.dataKey, a = r.minPointSize, l = r.hasCustomShape, u = e.pos, c = e.bandSize, f = e.xAxis, d = e.yAxis, h = e.xAxisTicks, p = e.yAxisTicks, y = e.stackedData, b = e.displayedData, w = e.offset, P = e.cells, S = e.parentViewBox, O = e.dataStartIndex, k = t === "horizontal" ? d : f, I = y ? k.scale.domain() : null, E = WM({
    numericAxis: k
  }), _ = k.scale.map(E);
  return b.map((C, R) => {
    var W, V, K, G, F, ie;
    if (y) {
      var re = y[R + O];
      if (re == null)
        return null;
      W = $M(re, I);
    } else
      W = Le(C, n), Array.isArray(W) || (W = [E, W]);
    var ne = CK(a, tC)(W[1], R);
    if (t === "horizontal") {
      var fe, ae = d.scale.map(W[0]), U = d.scale.map(W[1]);
      if (ae == null || U == null)
        return null;
      V = tb({
        axis: f,
        ticks: h,
        bandSize: c,
        offset: u.offset,
        entry: C,
        index: R
      }), K = (fe = U ?? ae) !== null && fe !== void 0 ? fe : void 0, G = u.size;
      var ee = ae - U;
      if (F = un(ee) ? 0 : ee, ie = {
        x: V,
        y: w.top,
        width: G,
        height: w.height
      }, Math.abs(ne) > 0 && Math.abs(F) < Math.abs(ne)) {
        var Y = Et(F || ne) * (Math.abs(ne) - Math.abs(F));
        K -= Y, F += Y;
      }
    } else {
      var D = f.scale.map(W[0]), H = f.scale.map(W[1]);
      if (D == null || H == null)
        return null;
      if (V = D, K = tb({
        axis: d,
        ticks: p,
        bandSize: c,
        offset: u.offset,
        entry: C,
        index: R
      }), G = H - D, F = u.size, ie = {
        x: w.left,
        y: K,
        width: w.width,
        height: F
      }, Math.abs(ne) > 0 && Math.abs(G) < Math.abs(ne)) {
        var ve = Et(G || ne) * (Math.abs(ne) - Math.abs(G));
        G += ve;
      }
    }
    if (V == null || K == null || G == null || F == null || !l && (G === 0 || F === 0))
      return null;
    var ye = mt(mt({}, C), {}, {
      stackedBarStart: _,
      x: V,
      y: K,
      width: G,
      height: F,
      value: y ? W : W[1],
      payload: C,
      background: ie,
      tooltipPosition: {
        x: V + G / 2,
        y: K + F / 2
      },
      parentViewBox: S,
      originalDataIndex: R
    }, P && P[R] && P[R].props);
    return ye;
  }).filter(Boolean);
}
function O9(e) {
  var t = gt(e, S9), r = qK(t.stackId), n = Ht();
  return /* @__PURE__ */ x.createElement(iy, {
    id: t.id,
    type: "bar"
  }, (a) => /* @__PURE__ */ x.createElement(x.Fragment, null, /* @__PURE__ */ x.createElement(Ck, {
    legendPayload: c9(t)
  }), /* @__PURE__ */ x.createElement(f9, {
    dataKey: t.dataKey,
    stroke: t.stroke,
    strokeWidth: t.strokeWidth,
    fill: t.fill,
    name: t.name,
    hide: t.hide,
    unit: t.unit,
    formatter: t.formatter,
    tooltipType: t.tooltipType,
    id: a
  }), /* @__PURE__ */ x.createElement(jk, {
    type: "bar",
    id: a,
    data: void 0,
    xAxisId: t.xAxisId,
    yAxisId: t.yAxisId,
    zAxisId: 0,
    dataKey: t.dataKey,
    stackId: r,
    hide: t.hide,
    barSize: t.barSize,
    minPointSize: t.minPointSize,
    maxBarSize: t.maxBarSize,
    isPanorama: n,
    hasCustomShape: t.shape != null && t.shape !== vy
  }), /* @__PURE__ */ x.createElement(ar, {
    zIndex: t.zIndex
  }, /* @__PURE__ */ x.createElement(P9, vi({}, t, {
    id: a
  })))));
}
var Ac = /* @__PURE__ */ x.memo(O9, no);
Ac.displayName = "Bar";
var E9 = ["domain", "range"], k9 = ["domain", "range"];
function mS(e, t) {
  if (e == null) return {};
  var r, n, a = C9(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]);
  }
  return a;
}
function C9(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
function yS(e, t) {
  return e === t ? !0 : Array.isArray(e) && e.length === 2 && Array.isArray(t) && t.length === 2 ? e[0] === t[0] && e[1] === t[1] : !1;
}
function rC(e, t) {
  if (e === t)
    return !0;
  var r = e.domain, n = e.range, a = mS(e, E9), l = t.domain, u = t.range, c = mS(t, k9);
  return !yS(r, l) || !yS(n, u) ? !1 : no(a, c);
}
var I9 = ["type"], j9 = ["dangerouslySetInnerHTML", "ticks", "scale"], _9 = ["id", "scale"];
function Gh() {
  return Gh = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Gh.apply(null, arguments);
}
function gS(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function xS(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? gS(Object(r), !0).forEach(function(n) {
      T9(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : gS(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function T9(e, t, r) {
  return (t = M9(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function M9(e) {
  var t = D9(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function D9(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function Yh(e, t) {
  if (e == null) return {};
  var r, n, a = N9(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]);
  }
  return a;
}
function N9(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
function $9(e) {
  var t = Be(), r = x.useRef(null), n = IA(), a = e.type, l = Yh(e, I9), u = Qc(n, "xAxis", a), c = x.useMemo(() => {
    if (u != null)
      return xS(xS({}, l), {}, {
        type: u
      });
  }, [l, u]);
  return x.useLayoutEffect(() => {
    c != null && (r.current === null ? t(W5(c)) : r.current !== c && t(U5({
      prev: r.current,
      next: c
    })), r.current = c);
  }, [c, t]), x.useLayoutEffect(() => () => {
    r.current && (t(K5(r.current)), r.current = null);
  }, [t]), null;
}
var R9 = (e) => {
  var t = e.xAxisId, r = e.className, n = e.height, a = e.label, l = x.useRef(null), u = x.useRef(null), c = ue(Ep), f = Ht(), d = Be(), h = "xAxis", p = ue((O) => EE(O, h, t, f)), y = ue((O) => PE(O, t)), b = ue((O) => s4(O, t)), w = ue((O) => JO(O, t));
  if (x.useLayoutEffect(() => {
    if (!(n !== "auto" || !y || mf(a) || /* @__PURE__ */ x.isValidElement(a) || w == null)) {
      var O = l.current;
      if (O) {
        var k = O.getCalculatedHeight();
        Math.round(y.height) !== Math.round(k) && d(q5({
          id: t,
          height: k
        }));
      }
    }
  }, [
    // The dependency on cartesianAxisRef.current is not needed because useLayoutEffect will run after every render.
    // The ref will be populated by then.
    // To re-run this effect when ticks change, we can depend on the ticks array from the store.
    p,
    y,
    d,
    a,
    t,
    n,
    w
  ]), y == null || b == null || w == null)
    return null;
  e.dangerouslySetInnerHTML, e.ticks, e.scale;
  var P = Yh(e, j9);
  w.id, w.scale;
  var S = Yh(w, _9);
  return /* @__PURE__ */ x.createElement(ly, Gh({}, P, S, {
    ref: l,
    labelRef: u,
    x: b.x,
    y: b.y,
    width: y.width,
    height: y.height,
    className: $e("recharts-".concat(h, " ").concat(h), r),
    viewBox: c,
    ticks: p,
    axisType: h,
    axisId: t
  }));
}, L9 = {
  allowDataOverflow: ht.allowDataOverflow,
  allowDecimals: ht.allowDecimals,
  allowDuplicatedCategory: ht.allowDuplicatedCategory,
  angle: ht.angle,
  axisLine: Cn.axisLine,
  height: ht.height,
  hide: !1,
  includeHidden: ht.includeHidden,
  interval: ht.interval,
  label: !1,
  minTickGap: ht.minTickGap,
  mirror: ht.mirror,
  orientation: ht.orientation,
  padding: ht.padding,
  reversed: ht.reversed,
  scale: ht.scale,
  tick: ht.tick,
  tickCount: ht.tickCount,
  tickLine: Cn.tickLine,
  tickSize: Cn.tickSize,
  type: ht.type,
  niceTicks: ht.niceTicks,
  xAxisId: 0
}, z9 = (e) => {
  var t = gt(e, L9);
  return /* @__PURE__ */ x.createElement(x.Fragment, null, /* @__PURE__ */ x.createElement($9, {
    allowDataOverflow: t.allowDataOverflow,
    allowDecimals: t.allowDecimals,
    allowDuplicatedCategory: t.allowDuplicatedCategory,
    angle: t.angle,
    dataKey: t.dataKey,
    domain: t.domain,
    height: t.height,
    hide: t.hide,
    id: t.xAxisId,
    includeHidden: t.includeHidden,
    interval: t.interval,
    minTickGap: t.minTickGap,
    mirror: t.mirror,
    name: t.name,
    orientation: t.orientation,
    padding: t.padding,
    reversed: t.reversed,
    scale: t.scale,
    tick: t.tick,
    tickCount: t.tickCount,
    tickFormatter: t.tickFormatter,
    ticks: t.ticks,
    type: t.type,
    unit: t.unit,
    niceTicks: t.niceTicks
  }), /* @__PURE__ */ x.createElement(R9, t));
}, wf = /* @__PURE__ */ x.memo(z9, rC);
wf.displayName = "XAxis";
var B9 = ["type"], F9 = ["dangerouslySetInnerHTML", "ticks", "scale"], W9 = ["id", "scale"];
function qh() {
  return qh = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, qh.apply(null, arguments);
}
function bS(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function wS(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? bS(Object(r), !0).forEach(function(n) {
      U9(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : bS(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function U9(e, t, r) {
  return (t = K9(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function K9(e) {
  var t = H9(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function H9(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function Xh(e, t) {
  if (e == null) return {};
  var r, n, a = V9(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]);
  }
  return a;
}
function V9(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
function G9(e) {
  var t = Be(), r = x.useRef(null), n = IA(), a = e.type, l = Xh(e, B9), u = Qc(n, "yAxis", a), c = x.useMemo(() => {
    if (u != null)
      return wS(wS({}, l), {}, {
        type: u
      });
  }, [u, l]);
  return x.useLayoutEffect(() => {
    c != null && (r.current === null ? t(H5(c)) : r.current !== c && t(V5({
      prev: r.current,
      next: c
    })), r.current = c);
  }, [c, t]), x.useLayoutEffect(() => () => {
    r.current && (t(G5(r.current)), r.current = null);
  }, [t]), null;
}
function Y9(e) {
  var t = e.yAxisId, r = e.className, n = e.width, a = e.label, l = x.useRef(null), u = x.useRef(null), c = ue(Ep), f = Ht(), d = Be(), h = "yAxis", p = ue((O) => AE(O, t)), y = ue((O) => f4(O, t)), b = ue((O) => EE(O, h, t, f)), w = ue((O) => eE(O, t));
  if (x.useLayoutEffect(() => {
    if (!(n !== "auto" || !p || mf(a) || /* @__PURE__ */ x.isValidElement(a) || w == null)) {
      var O = l.current;
      if (O) {
        var k = O.getCalculatedWidth();
        Math.round(p.width) !== Math.round(k) && d(Y5({
          id: t,
          width: k
        }));
      }
    }
  }, [
    // The dependency on cartesianAxisRef.current is not needed because useLayoutEffect will run after every render.
    // The ref will be populated by then.
    // To re-run this effect when ticks change, we can depend on the ticks array from the store.
    b,
    p,
    d,
    a,
    t,
    n,
    w
  ]), p == null || y == null || w == null)
    return null;
  e.dangerouslySetInnerHTML, e.ticks, e.scale;
  var P = Xh(e, F9);
  w.id, w.scale;
  var S = Xh(w, W9);
  return /* @__PURE__ */ x.createElement(ly, qh({}, P, S, {
    ref: l,
    labelRef: u,
    x: y.x,
    y: y.y,
    tickTextProps: n === "auto" ? {
      width: void 0
    } : {
      width: n
    },
    width: p.width,
    height: p.height,
    className: $e("recharts-".concat(h, " ").concat(h), r),
    viewBox: c,
    ticks: b,
    axisType: h,
    axisId: t
  }));
}
var q9 = {
  allowDataOverflow: pt.allowDataOverflow,
  allowDecimals: pt.allowDecimals,
  allowDuplicatedCategory: pt.allowDuplicatedCategory,
  angle: pt.angle,
  axisLine: Cn.axisLine,
  hide: !1,
  includeHidden: pt.includeHidden,
  interval: pt.interval,
  label: !1,
  minTickGap: pt.minTickGap,
  mirror: pt.mirror,
  orientation: pt.orientation,
  padding: pt.padding,
  reversed: pt.reversed,
  scale: pt.scale,
  tick: pt.tick,
  tickCount: pt.tickCount,
  tickLine: Cn.tickLine,
  tickSize: Cn.tickSize,
  type: pt.type,
  niceTicks: pt.niceTicks,
  width: pt.width,
  yAxisId: 0
}, X9 = (e) => {
  var t = gt(e, q9);
  return /* @__PURE__ */ x.createElement(x.Fragment, null, /* @__PURE__ */ x.createElement(G9, {
    interval: t.interval,
    id: t.yAxisId,
    scale: t.scale,
    type: t.type,
    domain: t.domain,
    allowDataOverflow: t.allowDataOverflow,
    dataKey: t.dataKey,
    allowDuplicatedCategory: t.allowDuplicatedCategory,
    allowDecimals: t.allowDecimals,
    tickCount: t.tickCount,
    padding: t.padding,
    includeHidden: t.includeHidden,
    reversed: t.reversed,
    ticks: t.ticks,
    width: t.width,
    orientation: t.orientation,
    mirror: t.mirror,
    hide: t.hide,
    unit: t.unit,
    name: t.name,
    angle: t.angle,
    minTickGap: t.minTickGap,
    tick: t.tick,
    tickFormatter: t.tickFormatter,
    niceTicks: t.niceTicks
  }), /* @__PURE__ */ x.createElement(Y9, t));
}, Sf = /* @__PURE__ */ x.memo(X9, rC);
Sf.displayName = "YAxis";
var Q9 = (e, t) => t, py = $([Q9, Ne, vO, kt, KE, Rn, MB, xt], BB);
function Z9(e) {
  return "getBBox" in e.currentTarget && typeof e.currentTarget.getBBox == "function";
}
function my(e) {
  var t = e.currentTarget.getBoundingClientRect(), r, n;
  if (Z9(e)) {
    var a = e.currentTarget.getBBox();
    r = a.width > 0 ? t.width / a.width : 1, n = a.height > 0 ? t.height / a.height : 1;
  } else {
    var l = e.currentTarget;
    r = l.offsetWidth > 0 ? t.width / l.offsetWidth : 1, n = l.offsetHeight > 0 ? t.height / l.offsetHeight : 1;
  }
  var u = (c, f) => ({
    /*
     * Here it's important to use:
     * - event.clientX and event.clientY to get the mouse position relative to the viewport, including scroll.
     * - pageX and pageY are not used because they are relative to the whole document, and ignore scroll.
     * - rect.left and rect.top are used to get the position of the chart relative to the viewport.
     * - offsetX and offsetY are not used because they are relative to the offset parent
     *  which may or may not be the same as the clientX and clientY, depending on the position of the chart in the DOM
     *  and surrounding element styles. CSS position: relative, absolute, fixed, will change the offset parent.
     * - scaleX and scaleY are necessary for when the chart element is scaled using CSS `transform: scale(N)`.
     */
    relativeX: Math.round((c - t.left) / r),
    relativeY: Math.round((f - t.top) / n)
  });
  return "touches" in e ? Array.from(e.touches).map((c) => u(c.clientX, c.clientY)) : u(e.clientX, e.clientY);
}
var nC = pr("mouseClick"), iC = Nl();
iC.startListening({
  actionCreator: nC,
  effect: (e, t) => {
    var r = e.payload, n = py(t.getState(), my(r));
    (n == null ? void 0 : n.activeIndex) != null && t.dispatch(k4({
      activeIndex: n.activeIndex,
      activeDataKey: void 0,
      activeCoordinate: n.activeCoordinate
    }));
  }
});
var Qh = pr("mouseMove"), aC = Nl(), Ra = null, _i = null, th = null;
aC.startListening({
  actionCreator: Qh,
  effect: (e, t) => {
    var r = e.payload, n = t.getState(), a = n.eventSettings, l = a.throttleDelay, u = a.throttledEvents, c = u === "all" || (u == null ? void 0 : u.includes("mousemove"));
    Ra !== null && (cancelAnimationFrame(Ra), Ra = null), _i !== null && (typeof l != "number" || !c) && (clearTimeout(_i), _i = null), th = my(r);
    var f = () => {
      var d = t.getState(), h = Ql(d, d.tooltip.settings.shared);
      if (!th) {
        Ra = null, _i = null;
        return;
      }
      if (h === "axis") {
        var p = py(d, th);
        (p == null ? void 0 : p.activeIndex) != null ? t.dispatch(DE({
          activeIndex: p.activeIndex,
          activeDataKey: void 0,
          activeCoordinate: p.activeCoordinate
        })) : t.dispatch(ME());
      }
      Ra = null, _i = null;
    };
    if (!c) {
      f();
      return;
    }
    l === "raf" ? Ra = requestAnimationFrame(f) : typeof l == "number" && _i === null && (_i = setTimeout(f, l));
  }
});
function J9(e, t) {
  return t instanceof HTMLElement ? "HTMLElement <".concat(t.tagName, ' class="').concat(t.className, '">') : t === window ? "global.window" : e === "children" && typeof t == "object" && t !== null ? "<<CHILDREN>>" : t;
}
var SS = {
  accessibilityLayer: !0,
  barCategoryGap: "10%",
  barGap: 4,
  barSize: void 0,
  className: void 0,
  maxBarSize: void 0,
  stackOffset: "none",
  syncId: void 0,
  syncMethod: "index",
  baseValue: void 0,
  reverseStackOrder: !1
}, oC = Kt({
  name: "rootProps",
  initialState: SS,
  reducers: {
    updateOptions: (e, t) => {
      var r;
      e.accessibilityLayer = t.payload.accessibilityLayer, e.barCategoryGap = t.payload.barCategoryGap, e.barGap = (r = t.payload.barGap) !== null && r !== void 0 ? r : SS.barGap, e.barSize = t.payload.barSize, e.maxBarSize = t.payload.maxBarSize, e.stackOffset = t.payload.stackOffset, e.syncId = t.payload.syncId, e.syncMethod = t.payload.syncMethod, e.className = t.payload.className, e.baseValue = t.payload.baseValue, e.reverseStackOrder = t.payload.reverseStackOrder;
    }
  }
}), eH = oC.reducer, tH = oC.actions.updateOptions, rH = null, nH = {
  updatePolarOptions: (e, t) => e === null ? t.payload : (e.startAngle = t.payload.startAngle, e.endAngle = t.payload.endAngle, e.cx = t.payload.cx, e.cy = t.payload.cy, e.innerRadius = t.payload.innerRadius, e.outerRadius = t.payload.outerRadius, e)
}, lC = Kt({
  name: "polarOptions",
  initialState: rH,
  reducers: nH
}), iH = lC.actions.updatePolarOptions, aH = lC.reducer, uC = pr("keyDown"), sC = pr("focus"), cC = pr("blur"), Pf = Nl(), La = null, Ti = null, Es = null;
Pf.startListening({
  actionCreator: uC,
  effect: (e, t) => {
    Es = e.payload, La !== null && (cancelAnimationFrame(La), La = null);
    var r = t.getState(), n = r.eventSettings, a = n.throttleDelay, l = n.throttledEvents, u = l === "all" || l.includes("keydown");
    Ti !== null && (typeof a != "number" || !u) && (clearTimeout(Ti), Ti = null);
    var c = () => {
      try {
        var f = t.getState(), d = f.rootProps.accessibilityLayer !== !1;
        if (!d)
          return;
        var h = f.tooltip.keyboardInteraction, p = Es;
        if (p !== "ArrowRight" && p !== "ArrowLeft" && p !== "Enter")
          return;
        var y = yl(h, Xi(f), Za(f), Ja(f)), b = y == null ? -1 : Number(y), w = !Number.isFinite(b) || b < 0, P = Rn(f), S = Xi(f), O = Ql(f, f.tooltip.settings.shared);
        if (p === "Enter") {
          if (w)
            return;
          var k = yc(f, O, "hover", String(h.index));
          t.dispatch(mc({
            active: !h.active,
            activeIndex: h.index,
            activeCoordinate: k
          }));
          return;
        }
        var I = m4(f), E = I === "left-to-right" ? 1 : -1, _ = p === "ArrowRight" ? 1 : -1, C;
        if (w) {
          var R = Za(f), W = Ja(f), V = _ * E, K = (ne) => ({
            active: !1,
            index: String(ne),
            dataKey: void 0,
            graphicalItemId: void 0,
            coordinate: void 0
          });
          if (C = -1, V > 0) {
            for (var G = 0; G < S.length; G++)
              if (yl(K(G), S, R, W) != null) {
                C = G;
                break;
              }
          } else
            for (var F = S.length - 1; F >= 0; F--)
              if (yl(K(F), S, R, W) != null) {
                C = F;
                break;
              }
          if (C < 0)
            return;
        } else {
          C = b + _ * E;
          var ie = (P == null ? void 0 : P.length) || S.length;
          if (ie === 0 || C >= ie || C < 0)
            return;
        }
        var re = yc(f, O, "hover", String(C));
        t.dispatch(mc({
          active: !0,
          activeIndex: C.toString(),
          activeCoordinate: re
        }));
      } finally {
        La = null, Ti = null;
      }
    };
    if (!u) {
      c();
      return;
    }
    a === "raf" ? La = requestAnimationFrame(c) : typeof a == "number" && Ti === null && (c(), Es = null, Ti = setTimeout(() => {
      Es ? c() : (Ti = null, La = null);
    }, a));
  }
});
Pf.startListening({
  actionCreator: sC,
  effect: (e, t) => {
    var r = t.getState(), n = r.rootProps.accessibilityLayer !== !1;
    if (n) {
      var a = r.tooltip.keyboardInteraction;
      if (!a.active && a.index == null) {
        var l = "0", u = Ql(r, r.tooltip.settings.shared), c = yc(r, u, "hover", String(l));
        t.dispatch(mc({
          active: !0,
          activeIndex: l,
          activeCoordinate: c
        }));
      }
    }
  }
});
Pf.startListening({
  actionCreator: cC,
  effect: (e, t) => {
    var r = t.getState(), n = r.rootProps.accessibilityLayer !== !1;
    if (n) {
      var a = r.tooltip.keyboardInteraction;
      a.active && t.dispatch(mc({
        active: !1,
        activeIndex: a.index,
        activeCoordinate: a.coordinate
      }));
    }
  }
});
function fC(e) {
  e.persist();
  var t = e.currentTarget;
  return new Proxy(e, {
    get: (r, n) => {
      if (n === "currentTarget")
        return t;
      var a = Reflect.get(r, n);
      return typeof a == "function" ? a.bind(r) : a;
    }
  });
}
var Ar = pr("externalEvent"), dC = Nl(), ks = /* @__PURE__ */ new Map(), fl = /* @__PURE__ */ new Map(), rh = /* @__PURE__ */ new Map();
dC.startListening({
  actionCreator: Ar,
  effect: (e, t) => {
    var r = e.payload, n = r.handler, a = r.reactEvent;
    if (n != null) {
      var l = a.type, u = fC(a);
      rh.set(l, {
        handler: n,
        reactEvent: u
      });
      var c = ks.get(l);
      c !== void 0 && (cancelAnimationFrame(c), ks.delete(l));
      var f = t.getState(), d = f.eventSettings, h = d.throttleDelay, p = d.throttledEvents, y = p, b = y === "all" || (y == null ? void 0 : y.includes(l)), w = fl.get(l);
      w !== void 0 && (typeof h != "number" || !b) && (clearTimeout(w), fl.delete(l));
      var P = () => {
        var k = rh.get(l);
        try {
          if (!k)
            return;
          var I = k.handler, E = k.reactEvent, _ = t.getState(), C = {
            activeCoordinate: yB(_),
            activeDataKey: Rm(_),
            activeIndex: di(_),
            activeLabel: GE(_),
            activeTooltipIndex: di(_),
            isTooltipActive: gB(_)
          };
          I && I(C, E);
        } finally {
          ks.delete(l), fl.delete(l), rh.delete(l);
        }
      };
      if (!b) {
        P();
        return;
      }
      if (h === "raf") {
        var S = requestAnimationFrame(P);
        ks.set(l, S);
      } else if (typeof h == "number") {
        if (!fl.has(l)) {
          P();
          var O = setTimeout(P, h);
          fl.set(l, O);
        }
      } else
        P();
    }
  }
});
var oH = $([fo], (e) => e.tooltipItemPayloads), lH = $([oH, (e, t) => t, (e, t, r) => r], (e, t, r) => {
  if (t != null) {
    var n = e.find((l) => l.settings.graphicalItemId === r);
    if (n != null) {
      var a = n.getPosition;
      if (a != null)
        return a(t);
    }
  }
}), vC = pr("touchMove"), hC = Nl(), Mi = null, ni = null, PS = null, dl = null;
hC.startListening({
  actionCreator: vC,
  effect: (e, t) => {
    var r = e.payload;
    if (!(r.touches == null || r.touches.length === 0)) {
      dl = fC(r);
      var n = t.getState(), a = n.eventSettings, l = a.throttleDelay, u = a.throttledEvents, c = u === "all" || u.includes("touchmove");
      Mi !== null && (cancelAnimationFrame(Mi), Mi = null), ni !== null && (typeof l != "number" || !c) && (clearTimeout(ni), ni = null), PS = Array.from(r.touches).map((d) => my({
        clientX: d.clientX,
        clientY: d.clientY,
        currentTarget: r.currentTarget
      }));
      var f = () => {
        if (dl != null) {
          var d = t.getState(), h = Ql(d, d.tooltip.settings.shared);
          if (h === "axis") {
            var p, y = (p = PS) === null || p === void 0 ? void 0 : p[0];
            if (y == null) {
              Mi = null, ni = null;
              return;
            }
            var b = py(d, y);
            (b == null ? void 0 : b.activeIndex) != null && t.dispatch(DE({
              activeIndex: b.activeIndex,
              activeDataKey: void 0,
              activeCoordinate: b.activeCoordinate
            }));
          } else if (h === "item") {
            var w, P = dl.touches[0];
            if (document.elementFromPoint == null || P == null)
              return;
            var S = document.elementFromPoint(P.clientX, P.clientY);
            if (!S || !S.getAttribute)
              return;
            var O = S.getAttribute(SA), k = (w = S.getAttribute(PA)) !== null && w !== void 0 ? w : void 0, I = na(d).find((C) => C.id === k);
            if (O == null || I == null || k == null)
              return;
            var E = I.dataKey, _ = lH(d, O, k);
            t.dispatch(TE({
              activeDataKey: E,
              activeIndex: O,
              activeCoordinate: _,
              activeGraphicalItemId: k
            }));
          }
          Mi = null, ni = null;
        }
      };
      if (!c) {
        f();
        return;
      }
      l === "raf" ? Mi = requestAnimationFrame(f) : typeof l == "number" && ni === null && (f(), dl = null, ni = setTimeout(() => {
        dl ? f() : (ni = null, Mi = null);
      }, l));
    }
  }
});
var yy = {
  throttleDelay: "raf",
  throttledEvents: ["mousemove", "touchmove", "pointermove", "scroll", "wheel"]
}, pC = Kt({
  name: "eventSettings",
  initialState: yy,
  reducers: {
    setEventSettings: (e, t) => {
      t.payload.throttleDelay != null && (e.throttleDelay = t.payload.throttleDelay), t.payload.throttledEvents != null && (e.throttledEvents = Me(t.payload.throttledEvents));
    }
  }
}), uH = pC.actions.setEventSettings, sH = pC.reducer, cH = HP({
  brush: xW,
  cartesianAxis: X5,
  chartData: m8,
  errorBars: UU,
  eventSettings: sH,
  graphicalItems: Z6,
  layout: _M,
  legend: TD,
  options: f8,
  polarAxis: t6,
  polarOptions: aH,
  referenceElements: PW,
  renderedTicks: qW,
  rootProps: eH,
  tooltip: C4,
  zIndex: JB
}), fH = function(t) {
  var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "Chart";
  return rM({
    reducer: cH,
    // redux-toolkit v1 types are unhappy with the preloadedState type. Remove the `as any` when bumping to v2
    preloadedState: t,
    // @ts-expect-error redux-toolkit v1 types are unhappy with the middleware array. Remove this comment when bumping to v2
    middleware: (n) => {
      var a;
      return n({
        serializableCheck: !1,
        immutableCheck: !["commonjs", "es6", "production"].includes((a = "es6") !== null && a !== void 0 ? a : "")
      }).concat([iC.middleware, aC.middleware, Pf.middleware, dC.middleware, hC.middleware]);
    },
    /*
     * I can't find out how to satisfy typescript here.
     * We return `EnhancerArray<[StoreEnhancer<{}, {}>, StoreEnhancer]>` from this function,
     * but the types say we should return `EnhancerArray<StoreEnhancer<{}, {}>`.
     * Looks like it's badly inferred generics, but it won't allow me to provide the correct type manually either.
     * So let's just ignore the error for now.
     */
    // @ts-expect-error mismatched generics
    enhancers: (n) => {
      var a = n;
      return typeof n == "function" && (a = n()), a.concat(oA({
        type: "raf"
      }));
    },
    devTools: {
      serialize: {
        replacer: J9
      },
      name: "recharts-".concat(r)
    }
  });
};
function mC(e) {
  var t = e.preloadedState, r = e.children, n = e.reduxStoreName, a = Ht(), l = x.useRef(null);
  if (a)
    return r;
  l.current == null && (l.current = fH(t, n));
  var u = yp;
  return /* @__PURE__ */ x.createElement(YD, {
    context: u,
    store: l.current
  }, r);
}
function dH(e) {
  var t = e.layout, r = e.margin, n = Be(), a = Ht();
  return x.useEffect(() => {
    a || (n(CM(t)), n(kM(r)));
  }, [n, a, t, r]), null;
}
var yC = /* @__PURE__ */ x.memo(dH, no);
function gC(e) {
  var t = Be();
  return x.useEffect(() => {
    t(tH(e));
  }, [t, e]), null;
}
var vH = (e) => {
  var t = Be();
  return x.useEffect(() => {
    t(uH(e));
  }, [t, e]), null;
}, xC = /* @__PURE__ */ x.memo(vH, no);
function AS(e) {
  var t = e.zIndex, r = e.isPanorama, n = x.useRef(null), a = Be();
  return x.useLayoutEffect(() => (n.current && a(QB({
    zIndex: t,
    element: n.current,
    isPanorama: r
  })), () => {
    a(ZB({
      zIndex: t,
      isPanorama: r
    }));
  }), [a, t, r]), /* @__PURE__ */ x.createElement("g", {
    tabIndex: -1,
    ref: n,
    className: "recharts-zIndex-layer_".concat(t)
  });
}
function OS(e) {
  var t = e.children, r = e.isPanorama, n = ue(WB);
  if (!n || n.length === 0)
    return t;
  var a = n.filter((u) => u < 0), l = n.filter((u) => u > 0);
  return /* @__PURE__ */ x.createElement(x.Fragment, null, a.map((u) => /* @__PURE__ */ x.createElement(AS, {
    key: u,
    zIndex: u,
    isPanorama: r
  })), t, l.map((u) => /* @__PURE__ */ x.createElement(AS, {
    key: u,
    zIndex: u,
    isPanorama: r
  })));
}
var hH = ["children"];
function pH(e, t) {
  if (e == null) return {};
  var r, n, a = mH(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]);
  }
  return a;
}
function mH(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
function Oc() {
  return Oc = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Oc.apply(null, arguments);
}
var yH = {
  width: "100%",
  height: "100%",
  /*
   * display: block is necessary here because the default for an SVG is display: inline,
   * which in some browsers (Chrome) adds a little bit of extra space above and below the SVG
   * to make space for the descender of letters like "g" and "y". This throws off the height calculation
   * and causes the container to grow indefinitely on each render with responsive=true.
   * Display: block removes that extra space.
   *
   * Interestingly, Firefox does not have this problem, but it doesn't hurt to add the style anyway.
   */
  display: "block"
}, gH = /* @__PURE__ */ x.forwardRef((e, t) => {
  var r = Cp(), n = Ip(), a = $A();
  if (!cn(r) || !cn(n))
    return null;
  var l = e.children, u = e.otherAttributes, c = e.title, f = e.desc, d, h;
  return u != null && (typeof u.tabIndex == "number" ? d = u.tabIndex : d = a ? 0 : void 0, typeof u.role == "string" ? h = u.role : h = a ? "application" : void 0), /* @__PURE__ */ x.createElement(np, Oc({}, u, {
    title: c,
    desc: f,
    role: h,
    tabIndex: d,
    width: r,
    height: n,
    style: yH,
    ref: t
  }), l);
}), xH = (e) => {
  var t = e.children, r = ue(Gc);
  if (!r)
    return null;
  var n = r.width, a = r.height, l = r.y, u = r.x;
  return /* @__PURE__ */ x.createElement(np, {
    width: n,
    height: a,
    x: u,
    y: l
  }, t);
}, ES = /* @__PURE__ */ x.forwardRef((e, t) => {
  var r = e.children, n = pH(e, hH), a = Ht();
  return a ? /* @__PURE__ */ x.createElement(xH, null, /* @__PURE__ */ x.createElement(OS, {
    isPanorama: !0
  }, r)) : /* @__PURE__ */ x.createElement(gH, Oc({
    ref: t
  }, n), /* @__PURE__ */ x.createElement(OS, {
    isPanorama: !1
  }, r));
});
function bH(e, t) {
  return AH(e) || PH(e, t) || SH(e, t) || wH();
}
function wH() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function SH(e, t) {
  if (e) {
    if (typeof e == "string") return kS(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? kS(e, t) : void 0;
  }
}
function kS(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function PH(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, a, l, u, c = [], f = !0, d = !1;
    try {
      if (l = (r = r.call(e)).next, t !== 0) for (; !(f = (n = l.call(r)).done) && (c.push(n.value), c.length !== t); f = !0) ;
    } catch (h) {
      d = !0, a = h;
    } finally {
      try {
        if (!f && r.return != null && (u = r.return(), Object(u) !== u)) return;
      } finally {
        if (d) throw a;
      }
    }
    return c;
  }
}
function AH(e) {
  if (Array.isArray(e)) return e;
}
function OH() {
  var e = Be(), t = x.useState(null), r = bH(t, 2), n = r[0], a = r[1], l = ue(YM);
  return x.useEffect(() => {
    if (n != null) {
      var u = n.getBoundingClientRect(), c = u.width / n.offsetWidth;
      Ie(c) && c !== l && e(jM(c));
    }
  }, [n, e, l]), a;
}
function CS(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function EH(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? CS(Object(r), !0).forEach(function(n) {
      kH(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : CS(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function kH(e, t, r) {
  return (t = CH(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function CH(e) {
  var t = IH(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function IH(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function si() {
  return si = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, si.apply(null, arguments);
}
function Ec(e, t) {
  return MH(e) || TH(e, t) || _H(e, t) || jH();
}
function jH() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function _H(e, t) {
  if (e) {
    if (typeof e == "string") return IS(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? IS(e, t) : void 0;
  }
}
function IS(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function TH(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, a, l, u, c = [], f = !0, d = !1;
    try {
      if (l = (r = r.call(e)).next, t !== 0) for (; !(f = (n = l.call(r)).done) && (c.push(n.value), c.length !== t); f = !0) ;
    } catch (h) {
      d = !0, a = h;
    } finally {
      try {
        if (!f && r.return != null && (u = r.return(), Object(u) !== u)) return;
      } finally {
        if (d) throw a;
      }
    }
    return c;
  }
}
function MH(e) {
  if (Array.isArray(e)) return e;
}
var DH = () => (O8(), null);
function kc(e) {
  if (typeof e == "number")
    return e;
  if (typeof e == "string") {
    var t = parseFloat(e);
    if (!Number.isNaN(t))
      return t;
  }
  return 0;
}
var NH = /* @__PURE__ */ x.forwardRef((e, t) => {
  var r, n, a = x.useRef(null), l = x.useState({
    containerWidth: kc((r = e.style) === null || r === void 0 ? void 0 : r.width),
    containerHeight: kc((n = e.style) === null || n === void 0 ? void 0 : n.height)
  }), u = Ec(l, 2), c = u[0], f = u[1], d = x.useCallback((p, y) => {
    f((b) => {
      var w = Math.round(p), P = Math.round(y);
      return b.containerWidth === w && b.containerHeight === P ? b : {
        containerWidth: w,
        containerHeight: P
      };
    });
  }, []), h = x.useCallback((p) => {
    if (typeof t == "function" && t(p), a.current != null && (a.current.disconnect(), a.current = null), p != null && typeof ResizeObserver < "u") {
      var y = p.getBoundingClientRect(), b = y.width, w = y.height;
      d(b, w);
      var P = (O) => {
        var k = O[0];
        if (k != null) {
          var I = k.contentRect, E = I.width, _ = I.height;
          d(E, _);
        }
      }, S = new ResizeObserver(P);
      S.observe(p), a.current = S;
    }
  }, [t, d]);
  return x.useEffect(() => () => {
    var p = a.current;
    p != null && p.disconnect();
  }, [d]), /* @__PURE__ */ x.createElement(x.Fragment, null, /* @__PURE__ */ x.createElement(Rl, {
    width: c.containerWidth,
    height: c.containerHeight
  }), /* @__PURE__ */ x.createElement("div", si({
    ref: h
  }, e)));
}), $H = /* @__PURE__ */ x.forwardRef((e, t) => {
  var r = e.width, n = e.height, a = x.useState({
    containerWidth: kc(r),
    containerHeight: kc(n)
  }), l = Ec(a, 2), u = l[0], c = l[1], f = x.useCallback((h, p) => {
    c((y) => {
      var b = Math.round(h), w = Math.round(p);
      return y.containerWidth === b && y.containerHeight === w ? y : {
        containerWidth: b,
        containerHeight: w
      };
    });
  }, []), d = x.useCallback((h) => {
    if (typeof t == "function" && t(h), h != null) {
      var p = h.getBoundingClientRect(), y = p.width, b = p.height;
      f(y, b);
    }
  }, [t, f]);
  return /* @__PURE__ */ x.createElement(x.Fragment, null, /* @__PURE__ */ x.createElement(Rl, {
    width: u.containerWidth,
    height: u.containerHeight
  }), /* @__PURE__ */ x.createElement("div", si({
    ref: d
  }, e)));
}), RH = /* @__PURE__ */ x.forwardRef((e, t) => {
  var r = e.width, n = e.height;
  return /* @__PURE__ */ x.createElement(x.Fragment, null, /* @__PURE__ */ x.createElement(Rl, {
    width: r,
    height: n
  }), /* @__PURE__ */ x.createElement("div", si({
    ref: t
  }, e)));
}), LH = /* @__PURE__ */ x.forwardRef((e, t) => {
  var r = e.width, n = e.height;
  return typeof r == "string" || typeof n == "string" ? /* @__PURE__ */ x.createElement($H, si({}, e, {
    ref: t
  })) : typeof r == "number" && typeof n == "number" ? /* @__PURE__ */ x.createElement(RH, si({}, e, {
    width: r,
    height: n,
    ref: t
  })) : /* @__PURE__ */ x.createElement(x.Fragment, null, /* @__PURE__ */ x.createElement(Rl, {
    width: r,
    height: n
  }), /* @__PURE__ */ x.createElement("div", si({
    ref: t
  }, e)));
});
function zH(e) {
  return e ? NH : LH;
}
var BH = /* @__PURE__ */ x.forwardRef((e, t) => {
  var r = e.children, n = e.className, a = e.height, l = e.onClick, u = e.onContextMenu, c = e.onDoubleClick, f = e.onMouseDown, d = e.onMouseEnter, h = e.onMouseLeave, p = e.onMouseMove, y = e.onMouseUp, b = e.onTouchEnd, w = e.onTouchMove, P = e.onTouchStart, S = e.style, O = e.width, k = e.responsive, I = e.dispatchTouchEvents, E = I === void 0 ? !0 : I, _ = x.useRef(null), C = Be(), R = x.useState(null), W = Ec(R, 2), V = W[0], K = W[1], G = x.useState(null), F = Ec(G, 2), ie = F[0], re = F[1], ne = OH(), fe = kp(), ae = (fe == null ? void 0 : fe.width) > 0 ? fe.width : O, U = (fe == null ? void 0 : fe.height) > 0 ? fe.height : a, ee = x.useCallback((be) => {
    ne(be), typeof t == "function" && t(be), K(be), re(be), be != null && (_.current = be);
  }, [ne, t, K, re]), Y = x.useCallback((be) => {
    C(nC(be)), C(Ar({
      handler: l,
      reactEvent: be
    }));
  }, [C, l]), D = x.useCallback((be) => {
    C(Qh(be)), C(Ar({
      handler: d,
      reactEvent: be
    }));
  }, [C, d]), H = x.useCallback((be) => {
    C(ME()), C(Ar({
      handler: h,
      reactEvent: be
    }));
  }, [C, h]), ve = x.useCallback((be) => {
    C(Qh(be)), C(Ar({
      handler: p,
      reactEvent: be
    }));
  }, [C, p]), ye = x.useCallback(() => {
    C(sC());
  }, [C]), Pe = x.useCallback(() => {
    C(cC());
  }, [C]), Ae = x.useCallback((be) => {
    C(uC(be.key));
  }, [C]), Oe = x.useCallback((be) => {
    C(Ar({
      handler: u,
      reactEvent: be
    }));
  }, [C, u]), ke = x.useCallback((be) => {
    C(Ar({
      handler: c,
      reactEvent: be
    }));
  }, [C, c]), J = x.useCallback((be) => {
    C(Ar({
      handler: f,
      reactEvent: be
    }));
  }, [C, f]), me = x.useCallback((be) => {
    C(Ar({
      handler: y,
      reactEvent: be
    }));
  }, [C, y]), we = x.useCallback((be) => {
    C(Ar({
      handler: P,
      reactEvent: be
    }));
  }, [C, P]), Z = x.useCallback((be) => {
    E && C(vC(be)), C(Ar({
      handler: w,
      reactEvent: be
    }));
  }, [C, E, w]), at = x.useCallback((be) => {
    C(Ar({
      handler: b,
      reactEvent: be
    }));
  }, [C, b]), _e = zH(k);
  return /* @__PURE__ */ x.createElement(tk.Provider, {
    value: V
  }, /* @__PURE__ */ x.createElement(GS.Provider, {
    value: ie
  }, /* @__PURE__ */ x.createElement(_e, {
    width: ae ?? (S == null ? void 0 : S.width),
    height: U ?? (S == null ? void 0 : S.height),
    className: $e("recharts-wrapper", n),
    style: EH({
      position: "relative",
      cursor: "default",
      width: ae,
      height: U
    }, S),
    onClick: Y,
    onContextMenu: Oe,
    onDoubleClick: ke,
    onFocus: ye,
    onBlur: Pe,
    onKeyDown: Ae,
    onMouseDown: J,
    onMouseEnter: D,
    onMouseLeave: H,
    onMouseMove: ve,
    onMouseUp: me,
    onTouchEnd: at,
    onTouchMove: Z,
    onTouchStart: we,
    ref: ee
  }, /* @__PURE__ */ x.createElement(DH, null), r)));
}), FH = ["width", "height", "responsive", "children", "className", "style", "compact", "title", "desc"];
function WH(e, t) {
  if (e == null) return {};
  var r, n, a = UH(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]);
  }
  return a;
}
function UH(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
var bC = /* @__PURE__ */ x.forwardRef((e, t) => {
  var r = e.width, n = e.height, a = e.responsive, l = e.children, u = e.className, c = e.style, f = e.compact, d = e.title, h = e.desc, p = WH(e, FH), y = vr(p);
  return f ? /* @__PURE__ */ x.createElement(x.Fragment, null, /* @__PURE__ */ x.createElement(Rl, {
    width: r,
    height: n
  }), /* @__PURE__ */ x.createElement(ES, {
    otherAttributes: y,
    title: d,
    desc: h
  }, l)) : /* @__PURE__ */ x.createElement(BH, {
    className: u,
    style: c,
    width: r,
    height: n,
    responsive: a ?? !1,
    onClick: e.onClick,
    onMouseLeave: e.onMouseLeave,
    onMouseEnter: e.onMouseEnter,
    onMouseMove: e.onMouseMove,
    onMouseDown: e.onMouseDown,
    onMouseUp: e.onMouseUp,
    onContextMenu: e.onContextMenu,
    onDoubleClick: e.onDoubleClick,
    onTouchStart: e.onTouchStart,
    onTouchMove: e.onTouchMove,
    onTouchEnd: e.onTouchEnd
  }, /* @__PURE__ */ x.createElement(ES, {
    otherAttributes: y,
    title: d,
    desc: h,
    ref: t
  }, /* @__PURE__ */ x.createElement(jW, null, l)));
});
function Zh() {
  return Zh = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Zh.apply(null, arguments);
}
function jS(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function KH(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? jS(Object(r), !0).forEach(function(n) {
      HH(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : jS(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function HH(e, t, r) {
  return (t = VH(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function VH(e) {
  var t = GH(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function GH(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var YH = {
  top: 5,
  right: 5,
  bottom: 5,
  left: 5
}, qH = KH({
  accessibilityLayer: !0,
  barCategoryGap: "10%",
  barGap: 4,
  layout: "horizontal",
  margin: YH,
  responsive: !1,
  reverseStackOrder: !1,
  stackOffset: "none",
  syncMethod: "index"
}, yy), wC = /* @__PURE__ */ x.forwardRef(function(t, r) {
  var n, a = gt(t.categoricalChartProps, qH), l = t.chartName, u = t.defaultTooltipEventType, c = t.validateTooltipEventTypes, f = t.tooltipPayloadSearcher, d = t.categoricalChartProps, h = {
    chartName: l,
    defaultTooltipEventType: u,
    validateTooltipEventTypes: c,
    tooltipPayloadSearcher: f,
    eventEmitter: void 0
  };
  return /* @__PURE__ */ x.createElement(mC, {
    preloadedState: {
      options: h
    },
    reduxStoreName: (n = d.id) !== null && n !== void 0 ? n : l
  }, /* @__PURE__ */ x.createElement(Nk, {
    chartData: d.data
  }), /* @__PURE__ */ x.createElement(yC, {
    layout: a.layout,
    margin: a.margin
  }), /* @__PURE__ */ x.createElement(xC, {
    throttleDelay: a.throttleDelay,
    throttledEvents: a.throttledEvents
  }), /* @__PURE__ */ x.createElement(gC, {
    baseValue: a.baseValue,
    accessibilityLayer: a.accessibilityLayer,
    barCategoryGap: a.barCategoryGap,
    maxBarSize: a.maxBarSize,
    stackOffset: a.stackOffset,
    barGap: a.barGap,
    barSize: a.barSize,
    syncId: a.syncId,
    syncMethod: a.syncMethod,
    className: a.className,
    reverseStackOrder: a.reverseStackOrder
  }), /* @__PURE__ */ x.createElement(bC, Zh({}, a, {
    ref: r
  })));
}), XH = ["axis"], QH = /* @__PURE__ */ x.forwardRef((e, t) => /* @__PURE__ */ x.createElement(wC, {
  chartName: "LineChart",
  defaultTooltipEventType: "axis",
  validateTooltipEventTypes: XH,
  tooltipPayloadSearcher: Wm,
  categoricalChartProps: e,
  ref: t
})), ZH = ["axis", "item"], SC = /* @__PURE__ */ x.forwardRef((e, t) => /* @__PURE__ */ x.createElement(wC, {
  chartName: "BarChart",
  defaultTooltipEventType: "axis",
  validateTooltipEventTypes: ZH,
  tooltipPayloadSearcher: Wm,
  categoricalChartProps: e,
  ref: t
}));
function JH(e) {
  var t = Be();
  return x.useEffect(() => {
    t(iH(e));
  }, [t, e]), null;
}
var e7 = ["layout"];
function Jh() {
  return Jh = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Jh.apply(null, arguments);
}
function t7(e, t) {
  if (e == null) return {};
  var r, n, a = r7(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]);
  }
  return a;
}
function r7(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
function _S(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function n7(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? _S(Object(r), !0).forEach(function(n) {
      i7(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : _S(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function i7(e, t, r) {
  return (t = a7(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function a7(e) {
  var t = o7(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function o7(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var l7 = {
  top: 5,
  right: 5,
  bottom: 5,
  left: 5
}, PC = n7({
  accessibilityLayer: !0,
  stackOffset: "none",
  barCategoryGap: "10%",
  barGap: 4,
  margin: l7,
  reverseStackOrder: !1,
  syncMethod: "index",
  layout: "radial",
  responsive: !1,
  cx: "50%",
  cy: "50%",
  innerRadius: 0,
  outerRadius: "80%"
}, yy), u7 = /* @__PURE__ */ x.forwardRef(function(t, r) {
  var n, a = gt(t.categoricalChartProps, PC), l = a.layout, u = t7(a, e7), c = t.chartName, f = t.defaultTooltipEventType, d = t.validateTooltipEventTypes, h = t.tooltipPayloadSearcher, p = {
    chartName: c,
    defaultTooltipEventType: f,
    validateTooltipEventTypes: d,
    tooltipPayloadSearcher: h,
    eventEmitter: void 0
  };
  return /* @__PURE__ */ x.createElement(mC, {
    preloadedState: {
      options: p
    },
    reduxStoreName: (n = a.id) !== null && n !== void 0 ? n : c
  }, /* @__PURE__ */ x.createElement(Nk, {
    chartData: a.data
  }), /* @__PURE__ */ x.createElement(yC, {
    layout: l,
    margin: a.margin
  }), /* @__PURE__ */ x.createElement(xC, {
    throttleDelay: a.throttleDelay,
    throttledEvents: a.throttledEvents
  }), /* @__PURE__ */ x.createElement(gC, {
    baseValue: void 0,
    accessibilityLayer: a.accessibilityLayer,
    barCategoryGap: a.barCategoryGap,
    maxBarSize: a.maxBarSize,
    stackOffset: a.stackOffset,
    barGap: a.barGap,
    barSize: a.barSize,
    syncId: a.syncId,
    syncMethod: a.syncMethod,
    className: a.className,
    reverseStackOrder: a.reverseStackOrder
  }), /* @__PURE__ */ x.createElement(JH, {
    cx: a.cx,
    cy: a.cy,
    startAngle: a.startAngle,
    endAngle: a.endAngle,
    innerRadius: a.innerRadius,
    outerRadius: a.outerRadius
  }), /* @__PURE__ */ x.createElement(bC, Jh({}, u, {
    ref: r
  })));
});
function TS(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function MS(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? TS(Object(r), !0).forEach(function(n) {
      s7(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : TS(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function s7(e, t, r) {
  return (t = c7(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function c7(e) {
  var t = f7(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function f7(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var d7 = ["item"], v7 = MS(MS({}, PC), {}, {
  layout: "centric",
  startAngle: 0,
  endAngle: 360
}), h7 = /* @__PURE__ */ x.forwardRef((e, t) => {
  var r = gt(e, v7);
  return /* @__PURE__ */ x.createElement(u7, {
    chartName: "PieChart",
    defaultTooltipEventType: "item",
    validateTooltipEventTypes: d7,
    tooltipPayloadSearcher: Wm,
    categoricalChartProps: r,
    ref: t
  });
});
const p7 = ["#2563eb", "#16a34a", "#1e3a8a"], Af = { border: "1px solid #e2e8f0", borderRadius: 8, boxShadow: "0 4px 14px rgba(15, 23, 42, .08)", fontSize: 11 };
function DS({ title: e, data: t, labelWidth: r = 54 }) {
  const n = [...t].sort((a, l) => l.value - a.value);
  return /* @__PURE__ */ N.jsx(to, { title: e, children: n.length ? /* @__PURE__ */ N.jsx("div", { className: "bar-chart-box", children: /* @__PURE__ */ N.jsx(Yc, { width: "100%", height: "100%", children: /* @__PURE__ */ N.jsxs(SC, { data: n, layout: "vertical", margin: { top: 2, right: 36, bottom: 2, left: 0 }, children: [
    /* @__PURE__ */ N.jsx(wf, { type: "number", hide: !0 }),
    /* @__PURE__ */ N.jsx(Sf, { type: "category", dataKey: "label", width: r, axisLine: !1, tickLine: !1, tick: { fill: "#475569", fontSize: 10 } }),
    /* @__PURE__ */ N.jsx(hf, { formatter: (a) => [`${Dt(Number(a ?? 0))} processos`, "Base"], contentStyle: Af, cursor: { fill: "#f8fafc" } }),
    /* @__PURE__ */ N.jsx(Ac, { dataKey: "value", fill: "#2563eb", radius: [0, 4, 4, 0], barSize: 11, label: { position: "right", fill: "#475569", fontSize: 10, formatter: (a) => Dt(Number(a ?? 0)) } })
  ] }) }) }) : /* @__PURE__ */ N.jsx(Cc, {}) });
}
function nh({ title: e, data: t, centerValue: r, centerLabel: n = "Total", colors: a = p7 }) {
  const l = t.reduce((u, c) => u + c.value, 0);
  return /* @__PURE__ */ N.jsx(to, { title: e, children: t.length ? /* @__PURE__ */ N.jsxs("div", { className: "donut-layout", children: [
    /* @__PURE__ */ N.jsxs("div", { className: "donut-box", children: [
      /* @__PURE__ */ N.jsx(Yc, { width: "100%", height: "100%", children: /* @__PURE__ */ N.jsxs(h7, { children: [
        /* @__PURE__ */ N.jsx(Tk, { data: t, dataKey: "value", nameKey: "label", innerRadius: "64%", outerRadius: "86%", stroke: "none", paddingAngle: 1.5, children: t.map((u, c) => /* @__PURE__ */ N.jsx(Jl, { fill: a[c % a.length] }, u.label)) }),
        /* @__PURE__ */ N.jsx(hf, { formatter: (u) => [Dt(Number(u ?? 0)), "Processos"], contentStyle: Af })
      ] }) }),
      /* @__PURE__ */ N.jsxs("div", { className: "donut-center", children: [
        /* @__PURE__ */ N.jsx("strong", { children: r }),
        /* @__PURE__ */ N.jsx("span", { children: n })
      ] })
    ] }),
    /* @__PURE__ */ N.jsx("div", { className: "donut-legend", children: t.map((u, c) => /* @__PURE__ */ N.jsxs("div", { children: [
      /* @__PURE__ */ N.jsx("i", { style: { background: a[c % a.length] } }),
      /* @__PURE__ */ N.jsxs("span", { children: [
        /* @__PURE__ */ N.jsx("strong", { children: u.label }),
        /* @__PURE__ */ N.jsxs("small", { children: [
          Dt(u.value),
          " (",
          Ms(u.value / l * 100),
          ")"
        ] })
      ] })
    ] }, u.label)) })
  ] }) : /* @__PURE__ */ N.jsx(Cc, {}) });
}
function m7({ data: e }) {
  return /* @__PURE__ */ N.jsx(to, { title: "ENTRADAS X ENCERRAMENTOS POR DIA", className: "daily-movement-card", children: e.length ? /* @__PURE__ */ N.jsx("div", { className: "daily-chart-box", children: /* @__PURE__ */ N.jsx(Yc, { width: "100%", height: "100%", children: /* @__PURE__ */ N.jsxs(SC, { data: e, margin: { top: 8, right: 8, left: -28, bottom: 0 }, children: [
    /* @__PURE__ */ N.jsx(uy, { vertical: !1, stroke: "#e2e8f0", strokeDasharray: "3 3" }),
    /* @__PURE__ */ N.jsx(wf, { dataKey: "day", tick: { fill: "#64748b", fontSize: 9 }, axisLine: { stroke: "#e2e8f0" }, tickLine: !1, interval: 2 }),
    /* @__PURE__ */ N.jsx(Sf, { tick: { fill: "#64748b", fontSize: 9 }, axisLine: !1, tickLine: !1 }),
    /* @__PURE__ */ N.jsx(hf, { labelFormatter: (t, r) => {
      var n, a;
      return ((a = (n = r == null ? void 0 : r[0]) == null ? void 0 : n.payload) == null ? void 0 : a.fullDate) ?? "";
    }, formatter: (t, r) => [Dt(Number(t ?? 0)), String(r) === "entries" ? "Entradas" : "Encerramentos"], contentStyle: Af }),
    /* @__PURE__ */ N.jsx(DA, { align: "right", verticalAlign: "top", content: () => /* @__PURE__ */ N.jsxs("div", { className: "daily-chart-legend", children: [
      /* @__PURE__ */ N.jsxs("span", { children: [
        /* @__PURE__ */ N.jsx("i", { className: "entries" }),
        "Entradas"
      ] }),
      /* @__PURE__ */ N.jsxs("span", { children: [
        /* @__PURE__ */ N.jsx("i", { className: "closures" }),
        "Encerramentos"
      ] })
    ] }), wrapperStyle: { fontSize: 10, paddingBottom: 8 } }),
    /* @__PURE__ */ N.jsx(Ac, { dataKey: "entries", fill: "#2563eb", radius: [3, 3, 0, 0], maxBarSize: 9 }),
    /* @__PURE__ */ N.jsx(Ac, { dataKey: "closures", fill: "#16a34a", radius: [3, 3, 0, 0], maxBarSize: 9 })
  ] }) }) }) : /* @__PURE__ */ N.jsx(Cc, {}) });
}
function y7({ data: e }) {
  return /* @__PURE__ */ N.jsx(to, { title: "EVOLUÇÃO DO TKM — ÚLTIMOS 6 MESES", className: "tkm-chart-card", children: e.length ? /* @__PURE__ */ N.jsx("div", { className: "tkm-chart-box", children: /* @__PURE__ */ N.jsx(Yc, { width: "100%", height: "100%", children: /* @__PURE__ */ N.jsxs(QH, { data: e, margin: { top: 12, right: 18, left: 8, bottom: 0 }, children: [
    /* @__PURE__ */ N.jsx(uy, { vertical: !1, stroke: "#e2e8f0", strokeDasharray: "3 3" }),
    /* @__PURE__ */ N.jsx(wf, { dataKey: "label", tick: { fill: "#64748b", fontSize: 10 }, axisLine: { stroke: "#e2e8f0" }, tickLine: !1 }),
    /* @__PURE__ */ N.jsx(Sf, { domain: ["dataMin - 30", "dataMax + 30"], tickFormatter: (t) => `R$ ${t}`, tick: { fill: "#64748b", fontSize: 9 }, axisLine: !1, tickLine: !1, width: 58 }),
    /* @__PURE__ */ N.jsx(hf, { formatter: (t) => [ii(Number(t ?? 0)), "TKM"], contentStyle: Af }),
    /* @__PURE__ */ N.jsx(Qk, { type: "monotone", dataKey: "value", stroke: "#2563eb", strokeWidth: 2, dot: { r: 3, fill: "#2563eb", strokeWidth: 0 }, activeDot: { r: 5 } })
  ] }) }) }) : /* @__PURE__ */ N.jsx(Cc, {}) });
}
function g7() {
  const e = window.MBA_CURRENT_USER, [t, r] = x.useState((e == null ? void 0 : e.name) || (e == null ? void 0 : e.nome) || "Usuário de Usuário");
  return x.useEffect(() => {
    const n = (a) => {
      const l = a.detail;
      r((l == null ? void 0 : l.name) || (l == null ? void 0 : l.nome) || "Usuário de Usuário");
    };
    return window.addEventListener("mba:authenticated", n), () => window.removeEventListener("mba:authenticated", n);
  }, []), t;
}
function ih({ title: e, status: t, icon: r, tone: n = "green", detail: a }) {
  return /* @__PURE__ */ N.jsxs("article", { className: `operational-status ${n}`, children: [
    /* @__PURE__ */ N.jsx("div", { className: "status-icon", children: /* @__PURE__ */ N.jsx(r, { "aria-hidden": "true" }) }),
    /* @__PURE__ */ N.jsxs("div", { children: [
      /* @__PURE__ */ N.jsx("span", { children: e }),
      /* @__PURE__ */ N.jsxs("strong", { children: [
        /* @__PURE__ */ N.jsx("i", {}),
        t
      ] }),
      a && /* @__PURE__ */ N.jsx("small", { children: a })
    ] })
  ] });
}
function x7({ data: e, onPeriodChange: t }) {
  const r = g7(), n = e.status.enterSession === "active" ? "Ativa" : e.status.enterSession === "expired" ? "Expirada" : "Indisponível";
  return /* @__PURE__ */ N.jsxs("section", { className: "executive-welcome", children: [
    /* @__PURE__ */ N.jsx("div", { className: "welcome-illustration", children: /* @__PURE__ */ N.jsx("img", { src: "assets/welcome-character.png", alt: "Pessoa utilizando um notebook" }) }),
    /* @__PURE__ */ N.jsxs("div", { className: "executive-welcome-copy", children: [
      /* @__PURE__ */ N.jsxs("h1", { children: [
        "Bem-vindo, ",
        /* @__PURE__ */ N.jsx("span", { id: "welcome-name", children: r }),
        "! ",
        /* @__PURE__ */ N.jsx("span", { "aria-hidden": "true", children: "👋" })
      ] }),
      /* @__PURE__ */ N.jsx("p", { children: "Acompanhe os principais indicadores da carteira Agibank." }),
      /* @__PURE__ */ N.jsxs("div", { className: "operational-grid", children: [
        /* @__PURE__ */ N.jsx(ih, { title: "Backend", status: e.status.backendConnected ? "Conectado" : "Indisponível", icon: Jj, tone: e.status.backendConnected ? "green" : "red" }),
        /* @__PURE__ */ N.jsx(ih, { title: "Sessão Enter", status: n, icon: Qj, tone: e.status.enterSession === "active" ? "green" : "red" }),
        /* @__PURE__ */ N.jsx(ih, { title: "Erros", status: Dt(e.status.errorsToday), icon: ep, tone: e.status.errorsToday === 0 ? "blue" : "red", detail: `Última atualização: ${e.status.updatedAt}` })
      ] })
    ] }),
    /* @__PURE__ */ N.jsxs("fieldset", { className: "period-filter", children: [
      /* @__PURE__ */ N.jsx("legend", { children: "Período global" }),
      /* @__PURE__ */ N.jsxs("div", { children: [
        /* @__PURE__ */ N.jsx(Uj, { "aria-hidden": "true" }),
        /* @__PURE__ */ N.jsxs("label", { children: [
          /* @__PURE__ */ N.jsx("span", { children: "Início" }),
          /* @__PURE__ */ N.jsx("input", { type: "date", value: e.period.start, onChange: (a) => t(a.target.value, e.period.end) })
        ] }),
        /* @__PURE__ */ N.jsx("b", { children: "—" }),
        /* @__PURE__ */ N.jsxs("label", { children: [
          /* @__PURE__ */ N.jsx("span", { children: "Fim" }),
          /* @__PURE__ */ N.jsx("input", { type: "date", value: e.period.end, onChange: (a) => t(e.period.start, a.target.value) })
        ] })
      ] }),
      /* @__PURE__ */ N.jsxs("small", { children: [
        yx(e.period.start),
        " - ",
        yx(e.period.end)
      ] })
    ] })
  ] });
}
function b7({ data: e }) {
  const t = e.portfolio;
  return /* @__PURE__ */ N.jsx(tp, { title: "VISÃO GERAL DA CARTEIRA — AGIBANK", children: /* @__PURE__ */ N.jsxs("div", { className: "portfolio-kpi-grid", children: [
    /* @__PURE__ */ N.jsx(rl, { title: "Base ativa", value: Dt(t.activeBase), subtitle: "Total de processos", icon: Xj }),
    /* @__PURE__ */ N.jsx(rl, { title: "Entradas no mês", value: Dt(t.monthlyEntries), trend: `+${Ms(t.entriesTrend)} vs mês anterior`, icon: Yj }),
    /* @__PURE__ */ N.jsx(rl, { title: "Encerramentos no mês", value: Dt(t.monthlyClosures), trend: `+${Ms(t.closuresTrend)} vs mês anterior`, icon: Kj }),
    /* @__PURE__ */ N.jsx(rl, { title: "Acordos no mês", value: Dt(t.monthlyAgreements), subtitle: `Pendentes: ${Dt(t.pendingAgreements)}`, icon: LS, tone: "amber" }),
    /* @__PURE__ */ N.jsx(rl, { title: "Aptos ao arquivamento", value: Dt(t.archivableProcesses), subtitle: "Ver detalhes", icon: Wj })
  ] }) });
}
function w7({ entries: e, closures: t }) {
  return /* @__PURE__ */ N.jsx(to, { title: "ENTRADAS X ENCERRAMENTOS", className: "movement-summary-card", children: /* @__PURE__ */ N.jsxs("div", { className: "movement-summary", children: [
    /* @__PURE__ */ N.jsxs("div", { className: "entries", children: [
      /* @__PURE__ */ N.jsx("strong", { children: Dt(e) }),
      /* @__PURE__ */ N.jsx("span", { children: "Entradas no mês" })
    ] }),
    /* @__PURE__ */ N.jsxs("div", { className: "closures", children: [
      /* @__PURE__ */ N.jsx("strong", { children: Dt(t) }),
      /* @__PURE__ */ N.jsx("span", { children: "Encerramentos no mês" })
    ] })
  ] }) });
}
function S7({ data: e }) {
  return /* @__PURE__ */ N.jsxs(tp, { title: "CARTEIRA — DISTRIBUIÇÃO E MOVIMENTAÇÃO", className: "distribution-section", children: [
    /* @__PURE__ */ N.jsxs("div", { className: "distribution-grid", children: [
      /* @__PURE__ */ N.jsx(DS, { title: "BASE POR ESTADO", data: e.distribution.states }),
      /* @__PURE__ */ N.jsx(DS, { title: "BASE POR PRODUTO / OBJETO", data: e.distribution.products, labelWidth: 116 }),
      /* @__PURE__ */ N.jsx(nh, { title: "VARA CÍVEL X JUIZADO", data: e.distribution.courtTypes, centerValue: Dt(e.portfolio.activeBase) }),
      /* @__PURE__ */ N.jsx(nh, { title: "COMPARAÇÃO ÔNUS", data: e.distribution.burden, centerValue: Dt(e.portfolio.activeBase) })
    ] }),
    /* @__PURE__ */ N.jsxs("div", { className: "movement-grid", children: [
      /* @__PURE__ */ N.jsx(m7, { data: e.movement.daily }),
      /* @__PURE__ */ N.jsx(w7, { entries: e.portfolio.monthlyEntries, closures: e.portfolio.monthlyClosures }),
      /* @__PURE__ */ N.jsx(nh, { title: "MOTIVOS DE ENCERRAMENTO", data: e.movement.closureReasons, centerValue: Dt(e.portfolio.monthlyClosures), colors: ["#2563eb", "#0f9f8f", "#1e3a8a"] })
    ] })
  ] });
}
function P7({ options: e, selected: t, onChange: r }) {
  return /* @__PURE__ */ N.jsxs("label", { className: "credenciado-filter", children: [
    /* @__PURE__ */ N.jsx("span", { children: "Filtro de credenciado" }),
    /* @__PURE__ */ N.jsxs("select", { value: t, onChange: (n) => r(n.target.value), children: [
      /* @__PURE__ */ N.jsx("option", { value: "", children: "Todos os credenciados" }),
      e.map((n) => /* @__PURE__ */ N.jsx("option", { value: n, children: n }, n))
    ] })
  ] });
}
function A7({ items: e }) {
  return /* @__PURE__ */ N.jsxs(to, { title: "MAIORES CREDENCIADOS (VALOR)", className: "top-creditors-card", children: [
    /* @__PURE__ */ N.jsx("div", { className: "top-creditors", children: e.length ? e.map((t, r) => /* @__PURE__ */ N.jsxs("div", { children: [
      /* @__PURE__ */ N.jsxs("span", { children: [
        /* @__PURE__ */ N.jsx("i", { children: r + 1 }),
        t.label
      ] }),
      /* @__PURE__ */ N.jsx("strong", { children: ii(t.value) })
    ] }, t.label)) : /* @__PURE__ */ N.jsx("p", { children: "Nenhum pagamento encontrado para este credenciado no período." }) }),
    /* @__PURE__ */ N.jsx("button", { className: "view-all-button", type: "button", children: "Ver todos" })
  ] });
}
function O7({ data: e, selectedCredenciado: t, onCredenciadoChange: r }) {
  const n = e.payments;
  return /* @__PURE__ */ N.jsxs(tp, { title: "PAGAMENTOS", actions: /* @__PURE__ */ N.jsx(P7, { options: n.credenciados, selected: t, onChange: r }), children: [
    /* @__PURE__ */ N.jsxs("div", { className: "payment-kpi-grid", children: [
      /* @__PURE__ */ N.jsx(_a, { title: "Total de pagamentos", value: ii(n.totalAmount), trend: `+${Ms(n.totalTrend)} vs mês anterior`, icon: Hj }),
      /* @__PURE__ */ N.jsx(_a, { title: "TKM realizado (mês)", value: ii(n.tkm), subtitle: "Valor médio por processo pago", icon: e_ }),
      /* @__PURE__ */ N.jsx(_a, { title: "Pagamentos aguardando aprovação", count: n.pendingApproval.count, countLabel: "Processos", value: ii(n.pendingApproval.amount), subtitle: "Valor total pendente", icon: Gj, tone: "amber" }),
      /* @__PURE__ */ N.jsx(_a, { title: "Pagamentos sem comprovante", count: n.missingReceipt.count, countLabel: "Processos", value: ii(n.missingReceipt.amount), subtitle: "Valor total", icon: qj, tone: "red" }),
      /* @__PURE__ */ N.jsx(_a, { title: "Pagamentos cancelados", count: n.cancelled.count, countLabel: "Processos", value: ii(n.cancelled.amount), subtitle: "Valor total", icon: Vj, tone: "navy" }),
      /* @__PURE__ */ N.jsx(_a, { title: "Pagamentos de acordo", count: n.agreementPayments.count, countLabel: "Processos", value: ii(n.agreementPayments.amount), subtitle: "Valor total", icon: LS, tone: "green" })
    ] }),
    /* @__PURE__ */ N.jsxs("div", { className: "payment-charts-grid", children: [
      /* @__PURE__ */ N.jsx(y7, { data: n.tkmHistory }),
      /* @__PURE__ */ N.jsx(A7, { items: n.topCredenciados })
    ] })
  ] });
}
function E7({ updatedAt: e, autoRefreshMinutes: t }) {
  const r = new Date(e).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  return /* @__PURE__ */ N.jsxs("footer", { className: "dashboard-footer", children: [
    /* @__PURE__ */ N.jsxs("span", { children: [
      "Última atualização: ",
      r
    ] }),
    /* @__PURE__ */ N.jsx("i", {}),
    /* @__PURE__ */ N.jsxs("span", { children: [
      /* @__PURE__ */ N.jsx(Zj, { "aria-hidden": "true" }),
      " Atualização automática a cada ",
      t,
      " minutos"
    ] })
  ] });
}
function k7() {
  const [e, t] = x.useState(null), [r, n] = x.useState(""), [a, l] = x.useState(!1), u = x.useCallback(async (d) => {
    try {
      l(!1);
      const h = await Lj(d);
      t(h);
    } catch {
      l(!0);
    }
  }, []);
  x.useEffect(() => {
    u();
  }, [u]);
  const c = (d, h) => {
    t((p) => p && { ...p, period: { start: d, end: h } });
  }, f = (d) => {
    n(d), u({
      credenciado: d,
      startDate: e == null ? void 0 : e.period.start,
      endDate: e == null ? void 0 : e.period.end
    });
  };
  return a ? /* @__PURE__ */ N.jsx(r_, { onRetry: () => void u() }) : e ? /* @__PURE__ */ N.jsxs("div", { className: "react-dashboard", children: [
    /* @__PURE__ */ N.jsx(x7, { data: e, onPeriodChange: c }),
    /* @__PURE__ */ N.jsx(b7, { data: e }),
    /* @__PURE__ */ N.jsx(S7, { data: e }),
    /* @__PURE__ */ N.jsx(O7, { data: e, selectedCredenciado: r, onCredenciadoChange: f }),
    /* @__PURE__ */ N.jsx(E7, { updatedAt: e.updatedAt, autoRefreshMinutes: e.autoRefreshMinutes })
  ] }) : /* @__PURE__ */ N.jsx(t_, {});
}
const AC = document.getElementById("dashboard-root");
if (!AC)
  throw new Error("O ponto de montagem #dashboard-root não foi encontrado.");
Mj.createRoot(AC).render(/* @__PURE__ */ N.jsx(x.StrictMode, { children: /* @__PURE__ */ N.jsx(k7, {}) }));
