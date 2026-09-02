var tj = Object.defineProperty;
var rj = (e, t, r) => t in e ? tj(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var ls = (e, t, r) => rj(e, typeof t != "symbol" ? t + "" : t, r);
function nj(e, t) {
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
function hS(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var cv = { exports: {} }, Qo = {}, fv = { exports: {} }, ke = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var B0;
function ij() {
  if (B0) return ke;
  B0 = 1;
  var e = Symbol.for("react.element"), t = Symbol.for("react.portal"), r = Symbol.for("react.fragment"), n = Symbol.for("react.strict_mode"), a = Symbol.for("react.profiler"), l = Symbol.for("react.provider"), u = Symbol.for("react.context"), c = Symbol.for("react.forward_ref"), f = Symbol.for("react.suspense"), d = Symbol.for("react.memo"), h = Symbol.for("react.lazy"), p = Symbol.iterator;
  function y(D) {
    return D === null || typeof D != "object" ? null : (D = p && D[p] || D["@@iterator"], typeof D == "function" ? D : null);
  }
  var b = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, A = Object.assign, w = {};
  function S(D, V, ve) {
    this.props = D, this.context = V, this.refs = w, this.updater = ve || b;
  }
  S.prototype.isReactComponent = {}, S.prototype.setState = function(D, V) {
    if (typeof D != "object" && typeof D != "function" && D != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, D, V, "setState");
  }, S.prototype.forceUpdate = function(D) {
    this.updater.enqueueForceUpdate(this, D, "forceUpdate");
  };
  function O() {
  }
  O.prototype = S.prototype;
  function C(D, V, ve) {
    this.props = D, this.context = V, this.refs = w, this.updater = ve || b;
  }
  var I = C.prototype = new O();
  I.constructor = C, A(I, S.prototype), I.isPureReactComponent = !0;
  var k = Array.isArray, T = Object.prototype.hasOwnProperty, E = { current: null }, $ = { key: !0, ref: !0, __self: !0, __source: !0 };
  function F(D, V, ve) {
    var ye, Ae = {}, Pe = null, Ee = null;
    if (V != null) for (ye in V.ref !== void 0 && (Ee = V.ref), V.key !== void 0 && (Pe = "" + V.key), V) T.call(V, ye) && !$.hasOwnProperty(ye) && (Ae[ye] = V[ye]);
    var Ce = arguments.length - 2;
    if (Ce === 1) Ae.children = ve;
    else if (1 < Ce) {
      for (var J = Array(Ce), me = 0; me < Ce; me++) J[me] = arguments[me + 2];
      Ae.children = J;
    }
    if (D && D.defaultProps) for (ye in Ce = D.defaultProps, Ce) Ae[ye] === void 0 && (Ae[ye] = Ce[ye]);
    return { $$typeof: e, type: D, key: Pe, ref: Ee, props: Ae, _owner: E.current };
  }
  function U(D, V) {
    return { $$typeof: e, type: D.type, key: V, ref: D.ref, props: D.props, _owner: D._owner };
  }
  function H(D) {
    return typeof D == "object" && D !== null && D.$$typeof === e;
  }
  function G(D) {
    var V = { "=": "=0", ":": "=2" };
    return "$" + D.replace(/[=:]/g, function(ve) {
      return V[ve];
    });
  }
  var W = /\/+/g;
  function ne(D, V) {
    return typeof D == "object" && D !== null && D.key != null ? G("" + D.key) : V.toString(36);
  }
  function re(D, V, ve, ye, Ae) {
    var Pe = typeof D;
    (Pe === "undefined" || Pe === "boolean") && (D = null);
    var Ee = !1;
    if (D === null) Ee = !0;
    else switch (Pe) {
      case "string":
      case "number":
        Ee = !0;
        break;
      case "object":
        switch (D.$$typeof) {
          case e:
          case t:
            Ee = !0;
        }
    }
    if (Ee) return Ee = D, Ae = Ae(Ee), D = ye === "" ? "." + ne(Ee, 0) : ye, k(Ae) ? (ve = "", D != null && (ve = D.replace(W, "$&/") + "/"), re(Ae, V, ve, "", function(me) {
      return me;
    })) : Ae != null && (H(Ae) && (Ae = U(Ae, ve + (!Ae.key || Ee && Ee.key === Ae.key ? "" : ("" + Ae.key).replace(W, "$&/") + "/") + D)), V.push(Ae)), 1;
    if (Ee = 0, ye = ye === "" ? "." : ye + ":", k(D)) for (var Ce = 0; Ce < D.length; Ce++) {
      Pe = D[Ce];
      var J = ye + ne(Pe, Ce);
      Ee += re(Pe, V, ve, J, Ae);
    }
    else if (J = y(D), typeof J == "function") for (D = J.call(D), Ce = 0; !(Pe = D.next()).done; ) Pe = Pe.value, J = ye + ne(Pe, Ce++), Ee += re(Pe, V, ve, J, Ae);
    else if (Pe === "object") throw V = String(D), Error("Objects are not valid as a React child (found: " + (V === "[object Object]" ? "object with keys {" + Object.keys(D).join(", ") + "}" : V) + "). If you meant to render a collection of children, use an array instead.");
    return Ee;
  }
  function le(D, V, ve) {
    if (D == null) return D;
    var ye = [], Ae = 0;
    return re(D, ye, "", "", function(Pe) {
      return V.call(ve, Pe, Ae++);
    }), ye;
  }
  function fe(D) {
    if (D._status === -1) {
      var V = D._result;
      V = V(), V.then(function(ve) {
        (D._status === 0 || D._status === -1) && (D._status = 1, D._result = ve);
      }, function(ve) {
        (D._status === 0 || D._status === -1) && (D._status = 2, D._result = ve);
      }), D._status === -1 && (D._status = 0, D._result = V);
    }
    if (D._status === 1) return D._result.default;
    throw D._result;
  }
  var ae = { current: null }, K = { transition: null }, te = { ReactCurrentDispatcher: ae, ReactCurrentBatchConfig: K, ReactCurrentOwner: E };
  function Y() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return ke.Children = { map: le, forEach: function(D, V, ve) {
    le(D, function() {
      V.apply(this, arguments);
    }, ve);
  }, count: function(D) {
    var V = 0;
    return le(D, function() {
      V++;
    }), V;
  }, toArray: function(D) {
    return le(D, function(V) {
      return V;
    }) || [];
  }, only: function(D) {
    if (!H(D)) throw Error("React.Children.only expected to receive a single React element child.");
    return D;
  } }, ke.Component = S, ke.Fragment = r, ke.Profiler = a, ke.PureComponent = C, ke.StrictMode = n, ke.Suspense = f, ke.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = te, ke.act = Y, ke.cloneElement = function(D, V, ve) {
    if (D == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + D + ".");
    var ye = A({}, D.props), Ae = D.key, Pe = D.ref, Ee = D._owner;
    if (V != null) {
      if (V.ref !== void 0 && (Pe = V.ref, Ee = E.current), V.key !== void 0 && (Ae = "" + V.key), D.type && D.type.defaultProps) var Ce = D.type.defaultProps;
      for (J in V) T.call(V, J) && !$.hasOwnProperty(J) && (ye[J] = V[J] === void 0 && Ce !== void 0 ? Ce[J] : V[J]);
    }
    var J = arguments.length - 2;
    if (J === 1) ye.children = ve;
    else if (1 < J) {
      Ce = Array(J);
      for (var me = 0; me < J; me++) Ce[me] = arguments[me + 2];
      ye.children = Ce;
    }
    return { $$typeof: e, type: D.type, key: Ae, ref: Pe, props: ye, _owner: Ee };
  }, ke.createContext = function(D) {
    return D = { $$typeof: u, _currentValue: D, _currentValue2: D, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, D.Provider = { $$typeof: l, _context: D }, D.Consumer = D;
  }, ke.createElement = F, ke.createFactory = function(D) {
    var V = F.bind(null, D);
    return V.type = D, V;
  }, ke.createRef = function() {
    return { current: null };
  }, ke.forwardRef = function(D) {
    return { $$typeof: c, render: D };
  }, ke.isValidElement = H, ke.lazy = function(D) {
    return { $$typeof: h, _payload: { _status: -1, _result: D }, _init: fe };
  }, ke.memo = function(D, V) {
    return { $$typeof: d, type: D, compare: V === void 0 ? null : V };
  }, ke.startTransition = function(D) {
    var V = K.transition;
    K.transition = {};
    try {
      D();
    } finally {
      K.transition = V;
    }
  }, ke.unstable_act = Y, ke.useCallback = function(D, V) {
    return ae.current.useCallback(D, V);
  }, ke.useContext = function(D) {
    return ae.current.useContext(D);
  }, ke.useDebugValue = function() {
  }, ke.useDeferredValue = function(D) {
    return ae.current.useDeferredValue(D);
  }, ke.useEffect = function(D, V) {
    return ae.current.useEffect(D, V);
  }, ke.useId = function() {
    return ae.current.useId();
  }, ke.useImperativeHandle = function(D, V, ve) {
    return ae.current.useImperativeHandle(D, V, ve);
  }, ke.useInsertionEffect = function(D, V) {
    return ae.current.useInsertionEffect(D, V);
  }, ke.useLayoutEffect = function(D, V) {
    return ae.current.useLayoutEffect(D, V);
  }, ke.useMemo = function(D, V) {
    return ae.current.useMemo(D, V);
  }, ke.useReducer = function(D, V, ve) {
    return ae.current.useReducer(D, V, ve);
  }, ke.useRef = function(D) {
    return ae.current.useRef(D);
  }, ke.useState = function(D) {
    return ae.current.useState(D);
  }, ke.useSyncExternalStore = function(D, V, ve) {
    return ae.current.useSyncExternalStore(D, V, ve);
  }, ke.useTransition = function() {
    return ae.current.useTransition();
  }, ke.version = "18.3.1", ke;
}
var F0;
function Qa() {
  return F0 || (F0 = 1, fv.exports = ij()), fv.exports;
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
var W0;
function aj() {
  if (W0) return Qo;
  W0 = 1;
  var e = Qa(), t = Symbol.for("react.element"), r = Symbol.for("react.fragment"), n = Object.prototype.hasOwnProperty, a = e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, l = { key: !0, ref: !0, __self: !0, __source: !0 };
  function u(c, f, d) {
    var h, p = {}, y = null, b = null;
    d !== void 0 && (y = "" + d), f.key !== void 0 && (y = "" + f.key), f.ref !== void 0 && (b = f.ref);
    for (h in f) n.call(f, h) && !l.hasOwnProperty(h) && (p[h] = f[h]);
    if (c && c.defaultProps) for (h in f = c.defaultProps, f) p[h] === void 0 && (p[h] = f[h]);
    return { $$typeof: t, type: c, key: y, ref: b, props: p, _owner: a.current };
  }
  return Qo.Fragment = r, Qo.jsx = u, Qo.jsxs = u, Qo;
}
var U0;
function oj() {
  return U0 || (U0 = 1, cv.exports = aj()), cv.exports;
}
var _ = oj(), x = Qa();
const lj = /* @__PURE__ */ hS(x), uj = /* @__PURE__ */ nj({
  __proto__: null,
  default: lj
}, [x]);
var us = {}, dv = { exports: {} }, tr = {}, vv = { exports: {} }, hv = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var K0;
function sj() {
  return K0 || (K0 = 1, (function(e) {
    function t(K, te) {
      var Y = K.length;
      K.push(te);
      e: for (; 0 < Y; ) {
        var D = Y - 1 >>> 1, V = K[D];
        if (0 < a(V, te)) K[D] = te, K[Y] = V, Y = D;
        else break e;
      }
    }
    function r(K) {
      return K.length === 0 ? null : K[0];
    }
    function n(K) {
      if (K.length === 0) return null;
      var te = K[0], Y = K.pop();
      if (Y !== te) {
        K[0] = Y;
        e: for (var D = 0, V = K.length, ve = V >>> 1; D < ve; ) {
          var ye = 2 * (D + 1) - 1, Ae = K[ye], Pe = ye + 1, Ee = K[Pe];
          if (0 > a(Ae, Y)) Pe < V && 0 > a(Ee, Ae) ? (K[D] = Ee, K[Pe] = Y, D = Pe) : (K[D] = Ae, K[ye] = Y, D = ye);
          else if (Pe < V && 0 > a(Ee, Y)) K[D] = Ee, K[Pe] = Y, D = Pe;
          else break e;
        }
      }
      return te;
    }
    function a(K, te) {
      var Y = K.sortIndex - te.sortIndex;
      return Y !== 0 ? Y : K.id - te.id;
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
    var f = [], d = [], h = 1, p = null, y = 3, b = !1, A = !1, w = !1, S = typeof setTimeout == "function" ? setTimeout : null, O = typeof clearTimeout == "function" ? clearTimeout : null, C = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function I(K) {
      for (var te = r(d); te !== null; ) {
        if (te.callback === null) n(d);
        else if (te.startTime <= K) n(d), te.sortIndex = te.expirationTime, t(f, te);
        else break;
        te = r(d);
      }
    }
    function k(K) {
      if (w = !1, I(K), !A) if (r(f) !== null) A = !0, fe(T);
      else {
        var te = r(d);
        te !== null && ae(k, te.startTime - K);
      }
    }
    function T(K, te) {
      A = !1, w && (w = !1, O(F), F = -1), b = !0;
      var Y = y;
      try {
        for (I(te), p = r(f); p !== null && (!(p.expirationTime > te) || K && !G()); ) {
          var D = p.callback;
          if (typeof D == "function") {
            p.callback = null, y = p.priorityLevel;
            var V = D(p.expirationTime <= te);
            te = e.unstable_now(), typeof V == "function" ? p.callback = V : p === r(f) && n(f), I(te);
          } else n(f);
          p = r(f);
        }
        if (p !== null) var ve = !0;
        else {
          var ye = r(d);
          ye !== null && ae(k, ye.startTime - te), ve = !1;
        }
        return ve;
      } finally {
        p = null, y = Y, b = !1;
      }
    }
    var E = !1, $ = null, F = -1, U = 5, H = -1;
    function G() {
      return !(e.unstable_now() - H < U);
    }
    function W() {
      if ($ !== null) {
        var K = e.unstable_now();
        H = K;
        var te = !0;
        try {
          te = $(!0, K);
        } finally {
          te ? ne() : (E = !1, $ = null);
        }
      } else E = !1;
    }
    var ne;
    if (typeof C == "function") ne = function() {
      C(W);
    };
    else if (typeof MessageChannel < "u") {
      var re = new MessageChannel(), le = re.port2;
      re.port1.onmessage = W, ne = function() {
        le.postMessage(null);
      };
    } else ne = function() {
      S(W, 0);
    };
    function fe(K) {
      $ = K, E || (E = !0, ne());
    }
    function ae(K, te) {
      F = S(function() {
        K(e.unstable_now());
      }, te);
    }
    e.unstable_IdlePriority = 5, e.unstable_ImmediatePriority = 1, e.unstable_LowPriority = 4, e.unstable_NormalPriority = 3, e.unstable_Profiling = null, e.unstable_UserBlockingPriority = 2, e.unstable_cancelCallback = function(K) {
      K.callback = null;
    }, e.unstable_continueExecution = function() {
      A || b || (A = !0, fe(T));
    }, e.unstable_forceFrameRate = function(K) {
      0 > K || 125 < K ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : U = 0 < K ? Math.floor(1e3 / K) : 5;
    }, e.unstable_getCurrentPriorityLevel = function() {
      return y;
    }, e.unstable_getFirstCallbackNode = function() {
      return r(f);
    }, e.unstable_next = function(K) {
      switch (y) {
        case 1:
        case 2:
        case 3:
          var te = 3;
          break;
        default:
          te = y;
      }
      var Y = y;
      y = te;
      try {
        return K();
      } finally {
        y = Y;
      }
    }, e.unstable_pauseExecution = function() {
    }, e.unstable_requestPaint = function() {
    }, e.unstable_runWithPriority = function(K, te) {
      switch (K) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          K = 3;
      }
      var Y = y;
      y = K;
      try {
        return te();
      } finally {
        y = Y;
      }
    }, e.unstable_scheduleCallback = function(K, te, Y) {
      var D = e.unstable_now();
      switch (typeof Y == "object" && Y !== null ? (Y = Y.delay, Y = typeof Y == "number" && 0 < Y ? D + Y : D) : Y = D, K) {
        case 1:
          var V = -1;
          break;
        case 2:
          V = 250;
          break;
        case 5:
          V = 1073741823;
          break;
        case 4:
          V = 1e4;
          break;
        default:
          V = 5e3;
      }
      return V = Y + V, K = { id: h++, callback: te, priorityLevel: K, startTime: Y, expirationTime: V, sortIndex: -1 }, Y > D ? (K.sortIndex = Y, t(d, K), r(f) === null && K === r(d) && (w ? (O(F), F = -1) : w = !0, ae(k, Y - D))) : (K.sortIndex = V, t(f, K), A || b || (A = !0, fe(T))), K;
    }, e.unstable_shouldYield = G, e.unstable_wrapCallback = function(K) {
      var te = y;
      return function() {
        var Y = y;
        y = te;
        try {
          return K.apply(this, arguments);
        } finally {
          y = Y;
        }
      };
    };
  })(hv)), hv;
}
var H0;
function cj() {
  return H0 || (H0 = 1, vv.exports = sj()), vv.exports;
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
var V0;
function fj() {
  if (V0) return tr;
  V0 = 1;
  var e = Qa(), t = cj();
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
  function A(i, o, s, v) {
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
  function w(i, o, s, v, m, g, P) {
    this.acceptsBooleans = o === 2 || o === 3 || o === 4, this.attributeName = v, this.attributeNamespace = m, this.mustUseProperty = s, this.propertyName = i, this.type = o, this.sanitizeURL = g, this.removeEmptyString = P;
  }
  var S = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(i) {
    S[i] = new w(i, 0, !1, i, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(i) {
    var o = i[0];
    S[o] = new w(o, 1, !1, i[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(i) {
    S[i] = new w(i, 2, !1, i.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(i) {
    S[i] = new w(i, 2, !1, i, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(i) {
    S[i] = new w(i, 3, !1, i.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(i) {
    S[i] = new w(i, 3, !0, i, null, !1, !1);
  }), ["capture", "download"].forEach(function(i) {
    S[i] = new w(i, 4, !1, i, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(i) {
    S[i] = new w(i, 6, !1, i, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(i) {
    S[i] = new w(i, 5, !1, i.toLowerCase(), null, !1, !1);
  });
  var O = /[\-:]([a-z])/g;
  function C(i) {
    return i[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(i) {
    var o = i.replace(
      O,
      C
    );
    S[o] = new w(o, 1, !1, i, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(i) {
    var o = i.replace(O, C);
    S[o] = new w(o, 1, !1, i, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(i) {
    var o = i.replace(O, C);
    S[o] = new w(o, 1, !1, i, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(i) {
    S[i] = new w(i, 1, !1, i.toLowerCase(), null, !1, !1);
  }), S.xlinkHref = new w("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(i) {
    S[i] = new w(i, 1, !1, i.toLowerCase(), null, !0, !0);
  });
  function I(i, o, s, v) {
    var m = S.hasOwnProperty(o) ? S[o] : null;
    (m !== null ? m.type !== 0 : v || !(2 < o.length) || o[0] !== "o" && o[0] !== "O" || o[1] !== "n" && o[1] !== "N") && (A(o, s, m, v) && (s = null), v || m === null ? y(o) && (s === null ? i.removeAttribute(o) : i.setAttribute(o, "" + s)) : m.mustUseProperty ? i[m.propertyName] = s === null ? m.type === 3 ? !1 : "" : s : (o = m.attributeName, v = m.attributeNamespace, s === null ? i.removeAttribute(o) : (m = m.type, s = m === 3 || m === 4 && s === !0 ? "" : "" + s, v ? i.setAttributeNS(v, o, s) : i.setAttribute(o, s))));
  }
  var k = e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, T = Symbol.for("react.element"), E = Symbol.for("react.portal"), $ = Symbol.for("react.fragment"), F = Symbol.for("react.strict_mode"), U = Symbol.for("react.profiler"), H = Symbol.for("react.provider"), G = Symbol.for("react.context"), W = Symbol.for("react.forward_ref"), ne = Symbol.for("react.suspense"), re = Symbol.for("react.suspense_list"), le = Symbol.for("react.memo"), fe = Symbol.for("react.lazy"), ae = Symbol.for("react.offscreen"), K = Symbol.iterator;
  function te(i) {
    return i === null || typeof i != "object" ? null : (i = K && i[K] || i["@@iterator"], typeof i == "function" ? i : null);
  }
  var Y = Object.assign, D;
  function V(i) {
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
`), P = m.length - 1, j = g.length - 1; 1 <= P && 0 <= j && m[P] !== g[j]; ) j--;
        for (; 1 <= P && 0 <= j; P--, j--) if (m[P] !== g[j]) {
          if (P !== 1 || j !== 1)
            do
              if (P--, j--, 0 > j || m[P] !== g[j]) {
                var M = `
` + m[P].replace(" at new ", " at ");
                return i.displayName && M.includes("<anonymous>") && (M = M.replace("<anonymous>", i.displayName)), M;
              }
            while (1 <= P && 0 <= j);
          break;
        }
      }
    } finally {
      ve = !1, Error.prepareStackTrace = s;
    }
    return (i = i ? i.displayName || i.name : "") ? V(i) : "";
  }
  function Ae(i) {
    switch (i.tag) {
      case 5:
        return V(i.type);
      case 16:
        return V("Lazy");
      case 13:
        return V("Suspense");
      case 19:
        return V("SuspenseList");
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
  function Pe(i) {
    if (i == null) return null;
    if (typeof i == "function") return i.displayName || i.name || null;
    if (typeof i == "string") return i;
    switch (i) {
      case $:
        return "Fragment";
      case E:
        return "Portal";
      case U:
        return "Profiler";
      case F:
        return "StrictMode";
      case ne:
        return "Suspense";
      case re:
        return "SuspenseList";
    }
    if (typeof i == "object") switch (i.$$typeof) {
      case G:
        return (i.displayName || "Context") + ".Consumer";
      case H:
        return (i._context.displayName || "Context") + ".Provider";
      case W:
        var o = i.render;
        return i = i.displayName, i || (i = o.displayName || o.name || "", i = i !== "" ? "ForwardRef(" + i + ")" : "ForwardRef"), i;
      case le:
        return o = i.displayName || null, o !== null ? o : Pe(i.type) || "Memo";
      case fe:
        o = i._payload, i = i._init;
        try {
          return Pe(i(o));
        } catch {
        }
    }
    return null;
  }
  function Ee(i) {
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
        return Pe(o);
      case 8:
        return o === F ? "StrictMode" : "Mode";
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
  function Ce(i) {
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
      }, set: function(P) {
        v = "" + P, g.call(this, P);
      } }), Object.defineProperty(i, o, { enumerable: s.enumerable }), { getValue: function() {
        return v;
      }, setValue: function(P) {
        v = "" + P;
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
  function ot(i) {
    if (i = i || (typeof document < "u" ? document : void 0), typeof i > "u") return null;
    try {
      return i.activeElement || i.body;
    } catch {
      return i.body;
    }
  }
  function Te(i, o) {
    var s = o.checked;
    return Y({}, o, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: s ?? i._wrapperState.initialChecked });
  }
  function be(i, o) {
    var s = o.defaultValue == null ? "" : o.defaultValue, v = o.checked != null ? o.checked : o.defaultChecked;
    s = Ce(o.value != null ? o.value : s), i._wrapperState = { initialChecked: v, initialValue: s, controlled: o.type === "checkbox" || o.type === "radio" ? o.checked != null : o.value != null };
  }
  function Nt(i, o) {
    o = o.checked, o != null && I(i, "checked", o, !1);
  }
  function Ir(i, o) {
    Nt(i, o);
    var s = Ce(o.value), v = o.type;
    if (s != null) v === "number" ? (s === 0 && i.value === "" || i.value != s) && (i.value = "" + s) : i.value !== "" + s && (i.value = "" + s);
    else if (v === "submit" || v === "reset") {
      i.removeAttribute("value");
      return;
    }
    o.hasOwnProperty("value") ? xf(i, o.type, s) : o.hasOwnProperty("defaultValue") && xf(i, o.type, Ce(o.defaultValue)), o.checked == null && o.defaultChecked != null && (i.defaultChecked = !!o.defaultChecked);
  }
  function co(i, o, s) {
    if (o.hasOwnProperty("value") || o.hasOwnProperty("defaultValue")) {
      var v = o.type;
      if (!(v !== "submit" && v !== "reset" || o.value !== void 0 && o.value !== null)) return;
      o = "" + i._wrapperState.initialValue, s || o === i.value || (i.value = o), i.defaultValue = o;
    }
    s = i.name, s !== "" && (i.name = ""), i.defaultChecked = !!i._wrapperState.initialChecked, s !== "" && (i.name = s);
  }
  function xf(i, o, s) {
    (o !== "number" || ot(i.ownerDocument) !== i) && (s == null ? i.defaultValue = "" + i._wrapperState.initialValue : i.defaultValue !== "" + s && (i.defaultValue = "" + s));
  }
  var fo = Array.isArray;
  function ra(i, o, s, v) {
    if (i = i.options, o) {
      o = {};
      for (var m = 0; m < s.length; m++) o["$" + s[m]] = !0;
      for (s = 0; s < i.length; s++) m = o.hasOwnProperty("$" + i[s].value), i[s].selected !== m && (i[s].selected = m), m && v && (i[s].defaultSelected = !0);
    } else {
      for (s = "" + Ce(s), o = null, m = 0; m < i.length; m++) {
        if (i[m].value === s) {
          i[m].selected = !0, v && (i[m].defaultSelected = !0);
          return;
        }
        o !== null || i[m].disabled || (o = i[m]);
      }
      o !== null && (o.selected = !0);
    }
  }
  function bf(i, o) {
    if (o.dangerouslySetInnerHTML != null) throw Error(r(91));
    return Y({}, o, { value: void 0, defaultValue: void 0, children: "" + i._wrapperState.initialValue });
  }
  function Xm(i, o) {
    var s = o.value;
    if (s == null) {
      if (s = o.children, o = o.defaultValue, s != null) {
        if (o != null) throw Error(r(92));
        if (fo(s)) {
          if (1 < s.length) throw Error(r(93));
          s = s[0];
        }
        o = s;
      }
      o == null && (o = ""), s = o;
    }
    i._wrapperState = { initialValue: Ce(s) };
  }
  function Qm(i, o) {
    var s = Ce(o.value), v = Ce(o.defaultValue);
    s != null && (s = "" + s, s !== i.value && (i.value = s), o.defaultValue == null && i.defaultValue !== s && (i.defaultValue = s)), v != null && (i.defaultValue = "" + v);
  }
  function Zm(i) {
    var o = i.textContent;
    o === i._wrapperState.initialValue && o !== "" && o !== null && (i.value = o);
  }
  function Jm(i) {
    switch (i) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function wf(i, o) {
    return i == null || i === "http://www.w3.org/1999/xhtml" ? Jm(o) : i === "http://www.w3.org/2000/svg" && o === "foreignObject" ? "http://www.w3.org/1999/xhtml" : i;
  }
  var Jl, ey = (function(i) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(o, s, v, m) {
      MSApp.execUnsafeLocalFunction(function() {
        return i(o, s, v, m);
      });
    } : i;
  })(function(i, o) {
    if (i.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in i) i.innerHTML = o;
    else {
      for (Jl = Jl || document.createElement("div"), Jl.innerHTML = "<svg>" + o.valueOf().toString() + "</svg>", o = Jl.firstChild; i.firstChild; ) i.removeChild(i.firstChild);
      for (; o.firstChild; ) i.appendChild(o.firstChild);
    }
  });
  function vo(i, o) {
    if (o) {
      var s = i.firstChild;
      if (s && s === i.lastChild && s.nodeType === 3) {
        s.nodeValue = o;
        return;
      }
    }
    i.textContent = o;
  }
  var ho = {
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
  }, aC = ["Webkit", "ms", "Moz", "O"];
  Object.keys(ho).forEach(function(i) {
    aC.forEach(function(o) {
      o = o + i.charAt(0).toUpperCase() + i.substring(1), ho[o] = ho[i];
    });
  });
  function ty(i, o, s) {
    return o == null || typeof o == "boolean" || o === "" ? "" : s || typeof o != "number" || o === 0 || ho.hasOwnProperty(i) && ho[i] ? ("" + o).trim() : o + "px";
  }
  function ry(i, o) {
    i = i.style;
    for (var s in o) if (o.hasOwnProperty(s)) {
      var v = s.indexOf("--") === 0, m = ty(s, o[s], v);
      s === "float" && (s = "cssFloat"), v ? i.setProperty(s, m) : i[s] = m;
    }
  }
  var oC = Y({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function Sf(i, o) {
    if (o) {
      if (oC[i] && (o.children != null || o.dangerouslySetInnerHTML != null)) throw Error(r(137, i));
      if (o.dangerouslySetInnerHTML != null) {
        if (o.children != null) throw Error(r(60));
        if (typeof o.dangerouslySetInnerHTML != "object" || !("__html" in o.dangerouslySetInnerHTML)) throw Error(r(61));
      }
      if (o.style != null && typeof o.style != "object") throw Error(r(62));
    }
  }
  function Af(i, o) {
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
  var Pf = null;
  function Of(i) {
    return i = i.target || i.srcElement || window, i.correspondingUseElement && (i = i.correspondingUseElement), i.nodeType === 3 ? i.parentNode : i;
  }
  var Ef = null, na = null, ia = null;
  function ny(i) {
    if (i = $o(i)) {
      if (typeof Ef != "function") throw Error(r(280));
      var o = i.stateNode;
      o && (o = Su(o), Ef(i.stateNode, i.type, o));
    }
  }
  function iy(i) {
    na ? ia ? ia.push(i) : ia = [i] : na = i;
  }
  function ay() {
    if (na) {
      var i = na, o = ia;
      if (ia = na = null, ny(i), o) for (i = 0; i < o.length; i++) ny(o[i]);
    }
  }
  function oy(i, o) {
    return i(o);
  }
  function ly() {
  }
  var kf = !1;
  function uy(i, o, s) {
    if (kf) return i(o, s);
    kf = !0;
    try {
      return oy(i, o, s);
    } finally {
      kf = !1, (na !== null || ia !== null) && (ly(), ay());
    }
  }
  function po(i, o) {
    var s = i.stateNode;
    if (s === null) return null;
    var v = Su(s);
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
  var Cf = !1;
  if (c) try {
    var mo = {};
    Object.defineProperty(mo, "passive", { get: function() {
      Cf = !0;
    } }), window.addEventListener("test", mo, mo), window.removeEventListener("test", mo, mo);
  } catch {
    Cf = !1;
  }
  function lC(i, o, s, v, m, g, P, j, M) {
    var B = Array.prototype.slice.call(arguments, 3);
    try {
      o.apply(s, B);
    } catch (X) {
      this.onError(X);
    }
  }
  var yo = !1, eu = null, tu = !1, If = null, uC = { onError: function(i) {
    yo = !0, eu = i;
  } };
  function sC(i, o, s, v, m, g, P, j, M) {
    yo = !1, eu = null, lC.apply(uC, arguments);
  }
  function cC(i, o, s, v, m, g, P, j, M) {
    if (sC.apply(this, arguments), yo) {
      if (yo) {
        var B = eu;
        yo = !1, eu = null;
      } else throw Error(r(198));
      tu || (tu = !0, If = B);
    }
  }
  function vi(i) {
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
  function sy(i) {
    if (i.tag === 13) {
      var o = i.memoizedState;
      if (o === null && (i = i.alternate, i !== null && (o = i.memoizedState)), o !== null) return o.dehydrated;
    }
    return null;
  }
  function cy(i) {
    if (vi(i) !== i) throw Error(r(188));
  }
  function fC(i) {
    var o = i.alternate;
    if (!o) {
      if (o = vi(i), o === null) throw Error(r(188));
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
          if (g === s) return cy(m), i;
          if (g === v) return cy(m), o;
          g = g.sibling;
        }
        throw Error(r(188));
      }
      if (s.return !== v.return) s = m, v = g;
      else {
        for (var P = !1, j = m.child; j; ) {
          if (j === s) {
            P = !0, s = m, v = g;
            break;
          }
          if (j === v) {
            P = !0, v = m, s = g;
            break;
          }
          j = j.sibling;
        }
        if (!P) {
          for (j = g.child; j; ) {
            if (j === s) {
              P = !0, s = g, v = m;
              break;
            }
            if (j === v) {
              P = !0, v = g, s = m;
              break;
            }
            j = j.sibling;
          }
          if (!P) throw Error(r(189));
        }
      }
      if (s.alternate !== v) throw Error(r(190));
    }
    if (s.tag !== 3) throw Error(r(188));
    return s.stateNode.current === s ? i : o;
  }
  function fy(i) {
    return i = fC(i), i !== null ? dy(i) : null;
  }
  function dy(i) {
    if (i.tag === 5 || i.tag === 6) return i;
    for (i = i.child; i !== null; ) {
      var o = dy(i);
      if (o !== null) return o;
      i = i.sibling;
    }
    return null;
  }
  var vy = t.unstable_scheduleCallback, hy = t.unstable_cancelCallback, dC = t.unstable_shouldYield, vC = t.unstable_requestPaint, lt = t.unstable_now, hC = t.unstable_getCurrentPriorityLevel, jf = t.unstable_ImmediatePriority, py = t.unstable_UserBlockingPriority, ru = t.unstable_NormalPriority, pC = t.unstable_LowPriority, my = t.unstable_IdlePriority, nu = null, Kr = null;
  function mC(i) {
    if (Kr && typeof Kr.onCommitFiberRoot == "function") try {
      Kr.onCommitFiberRoot(nu, i, void 0, (i.current.flags & 128) === 128);
    } catch {
    }
  }
  var jr = Math.clz32 ? Math.clz32 : xC, yC = Math.log, gC = Math.LN2;
  function xC(i) {
    return i >>>= 0, i === 0 ? 32 : 31 - (yC(i) / gC | 0) | 0;
  }
  var iu = 64, au = 4194304;
  function go(i) {
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
  function ou(i, o) {
    var s = i.pendingLanes;
    if (s === 0) return 0;
    var v = 0, m = i.suspendedLanes, g = i.pingedLanes, P = s & 268435455;
    if (P !== 0) {
      var j = P & ~m;
      j !== 0 ? v = go(j) : (g &= P, g !== 0 && (v = go(g)));
    } else P = s & ~m, P !== 0 ? v = go(P) : g !== 0 && (v = go(g));
    if (v === 0) return 0;
    if (o !== 0 && o !== v && (o & m) === 0 && (m = v & -v, g = o & -o, m >= g || m === 16 && (g & 4194240) !== 0)) return o;
    if ((v & 4) !== 0 && (v |= s & 16), o = i.entangledLanes, o !== 0) for (i = i.entanglements, o &= v; 0 < o; ) s = 31 - jr(o), m = 1 << s, v |= i[s], o &= ~m;
    return v;
  }
  function bC(i, o) {
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
  function wC(i, o) {
    for (var s = i.suspendedLanes, v = i.pingedLanes, m = i.expirationTimes, g = i.pendingLanes; 0 < g; ) {
      var P = 31 - jr(g), j = 1 << P, M = m[P];
      M === -1 ? ((j & s) === 0 || (j & v) !== 0) && (m[P] = bC(j, o)) : M <= o && (i.expiredLanes |= j), g &= ~j;
    }
  }
  function _f(i) {
    return i = i.pendingLanes & -1073741825, i !== 0 ? i : i & 1073741824 ? 1073741824 : 0;
  }
  function yy() {
    var i = iu;
    return iu <<= 1, (iu & 4194240) === 0 && (iu = 64), i;
  }
  function Tf(i) {
    for (var o = [], s = 0; 31 > s; s++) o.push(i);
    return o;
  }
  function xo(i, o, s) {
    i.pendingLanes |= o, o !== 536870912 && (i.suspendedLanes = 0, i.pingedLanes = 0), i = i.eventTimes, o = 31 - jr(o), i[o] = s;
  }
  function SC(i, o) {
    var s = i.pendingLanes & ~o;
    i.pendingLanes = o, i.suspendedLanes = 0, i.pingedLanes = 0, i.expiredLanes &= o, i.mutableReadLanes &= o, i.entangledLanes &= o, o = i.entanglements;
    var v = i.eventTimes;
    for (i = i.expirationTimes; 0 < s; ) {
      var m = 31 - jr(s), g = 1 << m;
      o[m] = 0, v[m] = -1, i[m] = -1, s &= ~g;
    }
  }
  function Mf(i, o) {
    var s = i.entangledLanes |= o;
    for (i = i.entanglements; s; ) {
      var v = 31 - jr(s), m = 1 << v;
      m & o | i[v] & o && (i[v] |= o), s &= ~m;
    }
  }
  var Le = 0;
  function gy(i) {
    return i &= -i, 1 < i ? 4 < i ? (i & 268435455) !== 0 ? 16 : 536870912 : 4 : 1;
  }
  var xy, Nf, by, wy, Sy, Df = !1, lu = [], Nn = null, Dn = null, $n = null, bo = /* @__PURE__ */ new Map(), wo = /* @__PURE__ */ new Map(), Rn = [], AC = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function Ay(i, o) {
    switch (i) {
      case "focusin":
      case "focusout":
        Nn = null;
        break;
      case "dragenter":
      case "dragleave":
        Dn = null;
        break;
      case "mouseover":
      case "mouseout":
        $n = null;
        break;
      case "pointerover":
      case "pointerout":
        bo.delete(o.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        wo.delete(o.pointerId);
    }
  }
  function So(i, o, s, v, m, g) {
    return i === null || i.nativeEvent !== g ? (i = { blockedOn: o, domEventName: s, eventSystemFlags: v, nativeEvent: g, targetContainers: [m] }, o !== null && (o = $o(o), o !== null && Nf(o)), i) : (i.eventSystemFlags |= v, o = i.targetContainers, m !== null && o.indexOf(m) === -1 && o.push(m), i);
  }
  function PC(i, o, s, v, m) {
    switch (o) {
      case "focusin":
        return Nn = So(Nn, i, o, s, v, m), !0;
      case "dragenter":
        return Dn = So(Dn, i, o, s, v, m), !0;
      case "mouseover":
        return $n = So($n, i, o, s, v, m), !0;
      case "pointerover":
        var g = m.pointerId;
        return bo.set(g, So(bo.get(g) || null, i, o, s, v, m)), !0;
      case "gotpointercapture":
        return g = m.pointerId, wo.set(g, So(wo.get(g) || null, i, o, s, v, m)), !0;
    }
    return !1;
  }
  function Py(i) {
    var o = hi(i.target);
    if (o !== null) {
      var s = vi(o);
      if (s !== null) {
        if (o = s.tag, o === 13) {
          if (o = sy(s), o !== null) {
            i.blockedOn = o, Sy(i.priority, function() {
              by(s);
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
  function uu(i) {
    if (i.blockedOn !== null) return !1;
    for (var o = i.targetContainers; 0 < o.length; ) {
      var s = Rf(i.domEventName, i.eventSystemFlags, o[0], i.nativeEvent);
      if (s === null) {
        s = i.nativeEvent;
        var v = new s.constructor(s.type, s);
        Pf = v, s.target.dispatchEvent(v), Pf = null;
      } else return o = $o(s), o !== null && Nf(o), i.blockedOn = s, !1;
      o.shift();
    }
    return !0;
  }
  function Oy(i, o, s) {
    uu(i) && s.delete(o);
  }
  function OC() {
    Df = !1, Nn !== null && uu(Nn) && (Nn = null), Dn !== null && uu(Dn) && (Dn = null), $n !== null && uu($n) && ($n = null), bo.forEach(Oy), wo.forEach(Oy);
  }
  function Ao(i, o) {
    i.blockedOn === o && (i.blockedOn = null, Df || (Df = !0, t.unstable_scheduleCallback(t.unstable_NormalPriority, OC)));
  }
  function Po(i) {
    function o(m) {
      return Ao(m, i);
    }
    if (0 < lu.length) {
      Ao(lu[0], i);
      for (var s = 1; s < lu.length; s++) {
        var v = lu[s];
        v.blockedOn === i && (v.blockedOn = null);
      }
    }
    for (Nn !== null && Ao(Nn, i), Dn !== null && Ao(Dn, i), $n !== null && Ao($n, i), bo.forEach(o), wo.forEach(o), s = 0; s < Rn.length; s++) v = Rn[s], v.blockedOn === i && (v.blockedOn = null);
    for (; 0 < Rn.length && (s = Rn[0], s.blockedOn === null); ) Py(s), s.blockedOn === null && Rn.shift();
  }
  var aa = k.ReactCurrentBatchConfig, su = !0;
  function EC(i, o, s, v) {
    var m = Le, g = aa.transition;
    aa.transition = null;
    try {
      Le = 1, $f(i, o, s, v);
    } finally {
      Le = m, aa.transition = g;
    }
  }
  function kC(i, o, s, v) {
    var m = Le, g = aa.transition;
    aa.transition = null;
    try {
      Le = 4, $f(i, o, s, v);
    } finally {
      Le = m, aa.transition = g;
    }
  }
  function $f(i, o, s, v) {
    if (su) {
      var m = Rf(i, o, s, v);
      if (m === null) ed(i, o, v, cu, s), Ay(i, v);
      else if (PC(m, i, o, s, v)) v.stopPropagation();
      else if (Ay(i, v), o & 4 && -1 < AC.indexOf(i)) {
        for (; m !== null; ) {
          var g = $o(m);
          if (g !== null && xy(g), g = Rf(i, o, s, v), g === null && ed(i, o, v, cu, s), g === m) break;
          m = g;
        }
        m !== null && v.stopPropagation();
      } else ed(i, o, v, null, s);
    }
  }
  var cu = null;
  function Rf(i, o, s, v) {
    if (cu = null, i = Of(v), i = hi(i), i !== null) if (o = vi(i), o === null) i = null;
    else if (s = o.tag, s === 13) {
      if (i = sy(o), i !== null) return i;
      i = null;
    } else if (s === 3) {
      if (o.stateNode.current.memoizedState.isDehydrated) return o.tag === 3 ? o.stateNode.containerInfo : null;
      i = null;
    } else o !== i && (i = null);
    return cu = i, null;
  }
  function Ey(i) {
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
        switch (hC()) {
          case jf:
            return 1;
          case py:
            return 4;
          case ru:
          case pC:
            return 16;
          case my:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var Ln = null, Lf = null, fu = null;
  function ky() {
    if (fu) return fu;
    var i, o = Lf, s = o.length, v, m = "value" in Ln ? Ln.value : Ln.textContent, g = m.length;
    for (i = 0; i < s && o[i] === m[i]; i++) ;
    var P = s - i;
    for (v = 1; v <= P && o[s - v] === m[g - v]; v++) ;
    return fu = m.slice(i, 1 < v ? 1 - v : void 0);
  }
  function du(i) {
    var o = i.keyCode;
    return "charCode" in i ? (i = i.charCode, i === 0 && o === 13 && (i = 13)) : i = o, i === 10 && (i = 13), 32 <= i || i === 13 ? i : 0;
  }
  function vu() {
    return !0;
  }
  function Cy() {
    return !1;
  }
  function lr(i) {
    function o(s, v, m, g, P) {
      this._reactName = s, this._targetInst = m, this.type = v, this.nativeEvent = g, this.target = P, this.currentTarget = null;
      for (var j in i) i.hasOwnProperty(j) && (s = i[j], this[j] = s ? s(g) : g[j]);
      return this.isDefaultPrevented = (g.defaultPrevented != null ? g.defaultPrevented : g.returnValue === !1) ? vu : Cy, this.isPropagationStopped = Cy, this;
    }
    return Y(o.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var s = this.nativeEvent;
      s && (s.preventDefault ? s.preventDefault() : typeof s.returnValue != "unknown" && (s.returnValue = !1), this.isDefaultPrevented = vu);
    }, stopPropagation: function() {
      var s = this.nativeEvent;
      s && (s.stopPropagation ? s.stopPropagation() : typeof s.cancelBubble != "unknown" && (s.cancelBubble = !0), this.isPropagationStopped = vu);
    }, persist: function() {
    }, isPersistent: vu }), o;
  }
  var oa = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(i) {
    return i.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, zf = lr(oa), Oo = Y({}, oa, { view: 0, detail: 0 }), CC = lr(Oo), Bf, Ff, Eo, hu = Y({}, Oo, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: Uf, button: 0, buttons: 0, relatedTarget: function(i) {
    return i.relatedTarget === void 0 ? i.fromElement === i.srcElement ? i.toElement : i.fromElement : i.relatedTarget;
  }, movementX: function(i) {
    return "movementX" in i ? i.movementX : (i !== Eo && (Eo && i.type === "mousemove" ? (Bf = i.screenX - Eo.screenX, Ff = i.screenY - Eo.screenY) : Ff = Bf = 0, Eo = i), Bf);
  }, movementY: function(i) {
    return "movementY" in i ? i.movementY : Ff;
  } }), Iy = lr(hu), IC = Y({}, hu, { dataTransfer: 0 }), jC = lr(IC), _C = Y({}, Oo, { relatedTarget: 0 }), Wf = lr(_C), TC = Y({}, oa, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), MC = lr(TC), NC = Y({}, oa, { clipboardData: function(i) {
    return "clipboardData" in i ? i.clipboardData : window.clipboardData;
  } }), DC = lr(NC), $C = Y({}, oa, { data: 0 }), jy = lr($C), RC = {
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
  }, LC = {
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
  }, zC = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function BC(i) {
    var o = this.nativeEvent;
    return o.getModifierState ? o.getModifierState(i) : (i = zC[i]) ? !!o[i] : !1;
  }
  function Uf() {
    return BC;
  }
  var FC = Y({}, Oo, { key: function(i) {
    if (i.key) {
      var o = RC[i.key] || i.key;
      if (o !== "Unidentified") return o;
    }
    return i.type === "keypress" ? (i = du(i), i === 13 ? "Enter" : String.fromCharCode(i)) : i.type === "keydown" || i.type === "keyup" ? LC[i.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: Uf, charCode: function(i) {
    return i.type === "keypress" ? du(i) : 0;
  }, keyCode: function(i) {
    return i.type === "keydown" || i.type === "keyup" ? i.keyCode : 0;
  }, which: function(i) {
    return i.type === "keypress" ? du(i) : i.type === "keydown" || i.type === "keyup" ? i.keyCode : 0;
  } }), WC = lr(FC), UC = Y({}, hu, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), _y = lr(UC), KC = Y({}, Oo, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: Uf }), HC = lr(KC), VC = Y({}, oa, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), GC = lr(VC), YC = Y({}, hu, {
    deltaX: function(i) {
      return "deltaX" in i ? i.deltaX : "wheelDeltaX" in i ? -i.wheelDeltaX : 0;
    },
    deltaY: function(i) {
      return "deltaY" in i ? i.deltaY : "wheelDeltaY" in i ? -i.wheelDeltaY : "wheelDelta" in i ? -i.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), qC = lr(YC), XC = [9, 13, 27, 32], Kf = c && "CompositionEvent" in window, ko = null;
  c && "documentMode" in document && (ko = document.documentMode);
  var QC = c && "TextEvent" in window && !ko, Ty = c && (!Kf || ko && 8 < ko && 11 >= ko), My = " ", Ny = !1;
  function Dy(i, o) {
    switch (i) {
      case "keyup":
        return XC.indexOf(o.keyCode) !== -1;
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
  function $y(i) {
    return i = i.detail, typeof i == "object" && "data" in i ? i.data : null;
  }
  var la = !1;
  function ZC(i, o) {
    switch (i) {
      case "compositionend":
        return $y(o);
      case "keypress":
        return o.which !== 32 ? null : (Ny = !0, My);
      case "textInput":
        return i = o.data, i === My && Ny ? null : i;
      default:
        return null;
    }
  }
  function JC(i, o) {
    if (la) return i === "compositionend" || !Kf && Dy(i, o) ? (i = ky(), fu = Lf = Ln = null, la = !1, i) : null;
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
        return Ty && o.locale !== "ko" ? null : o.data;
      default:
        return null;
    }
  }
  var eI = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function Ry(i) {
    var o = i && i.nodeName && i.nodeName.toLowerCase();
    return o === "input" ? !!eI[i.type] : o === "textarea";
  }
  function Ly(i, o, s, v) {
    iy(v), o = xu(o, "onChange"), 0 < o.length && (s = new zf("onChange", "change", null, s, v), i.push({ event: s, listeners: o }));
  }
  var Co = null, Io = null;
  function tI(i) {
    rg(i, 0);
  }
  function pu(i) {
    var o = da(i);
    if (Z(o)) return i;
  }
  function rI(i, o) {
    if (i === "change") return o;
  }
  var zy = !1;
  if (c) {
    var Hf;
    if (c) {
      var Vf = "oninput" in document;
      if (!Vf) {
        var By = document.createElement("div");
        By.setAttribute("oninput", "return;"), Vf = typeof By.oninput == "function";
      }
      Hf = Vf;
    } else Hf = !1;
    zy = Hf && (!document.documentMode || 9 < document.documentMode);
  }
  function Fy() {
    Co && (Co.detachEvent("onpropertychange", Wy), Io = Co = null);
  }
  function Wy(i) {
    if (i.propertyName === "value" && pu(Io)) {
      var o = [];
      Ly(o, Io, i, Of(i)), uy(tI, o);
    }
  }
  function nI(i, o, s) {
    i === "focusin" ? (Fy(), Co = o, Io = s, Co.attachEvent("onpropertychange", Wy)) : i === "focusout" && Fy();
  }
  function iI(i) {
    if (i === "selectionchange" || i === "keyup" || i === "keydown") return pu(Io);
  }
  function aI(i, o) {
    if (i === "click") return pu(o);
  }
  function oI(i, o) {
    if (i === "input" || i === "change") return pu(o);
  }
  function lI(i, o) {
    return i === o && (i !== 0 || 1 / i === 1 / o) || i !== i && o !== o;
  }
  var _r = typeof Object.is == "function" ? Object.is : lI;
  function jo(i, o) {
    if (_r(i, o)) return !0;
    if (typeof i != "object" || i === null || typeof o != "object" || o === null) return !1;
    var s = Object.keys(i), v = Object.keys(o);
    if (s.length !== v.length) return !1;
    for (v = 0; v < s.length; v++) {
      var m = s[v];
      if (!f.call(o, m) || !_r(i[m], o[m])) return !1;
    }
    return !0;
  }
  function Uy(i) {
    for (; i && i.firstChild; ) i = i.firstChild;
    return i;
  }
  function Ky(i, o) {
    var s = Uy(i);
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
      s = Uy(s);
    }
  }
  function Hy(i, o) {
    return i && o ? i === o ? !0 : i && i.nodeType === 3 ? !1 : o && o.nodeType === 3 ? Hy(i, o.parentNode) : "contains" in i ? i.contains(o) : i.compareDocumentPosition ? !!(i.compareDocumentPosition(o) & 16) : !1 : !1;
  }
  function Vy() {
    for (var i = window, o = ot(); o instanceof i.HTMLIFrameElement; ) {
      try {
        var s = typeof o.contentWindow.location.href == "string";
      } catch {
        s = !1;
      }
      if (s) i = o.contentWindow;
      else break;
      o = ot(i.document);
    }
    return o;
  }
  function Gf(i) {
    var o = i && i.nodeName && i.nodeName.toLowerCase();
    return o && (o === "input" && (i.type === "text" || i.type === "search" || i.type === "tel" || i.type === "url" || i.type === "password") || o === "textarea" || i.contentEditable === "true");
  }
  function uI(i) {
    var o = Vy(), s = i.focusedElem, v = i.selectionRange;
    if (o !== s && s && s.ownerDocument && Hy(s.ownerDocument.documentElement, s)) {
      if (v !== null && Gf(s)) {
        if (o = v.start, i = v.end, i === void 0 && (i = o), "selectionStart" in s) s.selectionStart = o, s.selectionEnd = Math.min(i, s.value.length);
        else if (i = (o = s.ownerDocument || document) && o.defaultView || window, i.getSelection) {
          i = i.getSelection();
          var m = s.textContent.length, g = Math.min(v.start, m);
          v = v.end === void 0 ? g : Math.min(v.end, m), !i.extend && g > v && (m = v, v = g, g = m), m = Ky(s, g);
          var P = Ky(
            s,
            v
          );
          m && P && (i.rangeCount !== 1 || i.anchorNode !== m.node || i.anchorOffset !== m.offset || i.focusNode !== P.node || i.focusOffset !== P.offset) && (o = o.createRange(), o.setStart(m.node, m.offset), i.removeAllRanges(), g > v ? (i.addRange(o), i.extend(P.node, P.offset)) : (o.setEnd(P.node, P.offset), i.addRange(o)));
        }
      }
      for (o = [], i = s; i = i.parentNode; ) i.nodeType === 1 && o.push({ element: i, left: i.scrollLeft, top: i.scrollTop });
      for (typeof s.focus == "function" && s.focus(), s = 0; s < o.length; s++) i = o[s], i.element.scrollLeft = i.left, i.element.scrollTop = i.top;
    }
  }
  var sI = c && "documentMode" in document && 11 >= document.documentMode, ua = null, Yf = null, _o = null, qf = !1;
  function Gy(i, o, s) {
    var v = s.window === s ? s.document : s.nodeType === 9 ? s : s.ownerDocument;
    qf || ua == null || ua !== ot(v) || (v = ua, "selectionStart" in v && Gf(v) ? v = { start: v.selectionStart, end: v.selectionEnd } : (v = (v.ownerDocument && v.ownerDocument.defaultView || window).getSelection(), v = { anchorNode: v.anchorNode, anchorOffset: v.anchorOffset, focusNode: v.focusNode, focusOffset: v.focusOffset }), _o && jo(_o, v) || (_o = v, v = xu(Yf, "onSelect"), 0 < v.length && (o = new zf("onSelect", "select", null, o, s), i.push({ event: o, listeners: v }), o.target = ua)));
  }
  function mu(i, o) {
    var s = {};
    return s[i.toLowerCase()] = o.toLowerCase(), s["Webkit" + i] = "webkit" + o, s["Moz" + i] = "moz" + o, s;
  }
  var sa = { animationend: mu("Animation", "AnimationEnd"), animationiteration: mu("Animation", "AnimationIteration"), animationstart: mu("Animation", "AnimationStart"), transitionend: mu("Transition", "TransitionEnd") }, Xf = {}, Yy = {};
  c && (Yy = document.createElement("div").style, "AnimationEvent" in window || (delete sa.animationend.animation, delete sa.animationiteration.animation, delete sa.animationstart.animation), "TransitionEvent" in window || delete sa.transitionend.transition);
  function yu(i) {
    if (Xf[i]) return Xf[i];
    if (!sa[i]) return i;
    var o = sa[i], s;
    for (s in o) if (o.hasOwnProperty(s) && s in Yy) return Xf[i] = o[s];
    return i;
  }
  var qy = yu("animationend"), Xy = yu("animationiteration"), Qy = yu("animationstart"), Zy = yu("transitionend"), Jy = /* @__PURE__ */ new Map(), eg = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function zn(i, o) {
    Jy.set(i, o), l(o, [i]);
  }
  for (var Qf = 0; Qf < eg.length; Qf++) {
    var Zf = eg[Qf], cI = Zf.toLowerCase(), fI = Zf[0].toUpperCase() + Zf.slice(1);
    zn(cI, "on" + fI);
  }
  zn(qy, "onAnimationEnd"), zn(Xy, "onAnimationIteration"), zn(Qy, "onAnimationStart"), zn("dblclick", "onDoubleClick"), zn("focusin", "onFocus"), zn("focusout", "onBlur"), zn(Zy, "onTransitionEnd"), u("onMouseEnter", ["mouseout", "mouseover"]), u("onMouseLeave", ["mouseout", "mouseover"]), u("onPointerEnter", ["pointerout", "pointerover"]), u("onPointerLeave", ["pointerout", "pointerover"]), l("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), l("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), l("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), l("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), l("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), l("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var To = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), dI = new Set("cancel close invalid load scroll toggle".split(" ").concat(To));
  function tg(i, o, s) {
    var v = i.type || "unknown-event";
    i.currentTarget = s, cC(v, o, void 0, i), i.currentTarget = null;
  }
  function rg(i, o) {
    o = (o & 4) !== 0;
    for (var s = 0; s < i.length; s++) {
      var v = i[s], m = v.event;
      v = v.listeners;
      e: {
        var g = void 0;
        if (o) for (var P = v.length - 1; 0 <= P; P--) {
          var j = v[P], M = j.instance, B = j.currentTarget;
          if (j = j.listener, M !== g && m.isPropagationStopped()) break e;
          tg(m, j, B), g = M;
        }
        else for (P = 0; P < v.length; P++) {
          if (j = v[P], M = j.instance, B = j.currentTarget, j = j.listener, M !== g && m.isPropagationStopped()) break e;
          tg(m, j, B), g = M;
        }
      }
    }
    if (tu) throw i = If, tu = !1, If = null, i;
  }
  function Ue(i, o) {
    var s = o[od];
    s === void 0 && (s = o[od] = /* @__PURE__ */ new Set());
    var v = i + "__bubble";
    s.has(v) || (ng(o, i, 2, !1), s.add(v));
  }
  function Jf(i, o, s) {
    var v = 0;
    o && (v |= 4), ng(s, i, v, o);
  }
  var gu = "_reactListening" + Math.random().toString(36).slice(2);
  function Mo(i) {
    if (!i[gu]) {
      i[gu] = !0, n.forEach(function(s) {
        s !== "selectionchange" && (dI.has(s) || Jf(s, !1, i), Jf(s, !0, i));
      });
      var o = i.nodeType === 9 ? i : i.ownerDocument;
      o === null || o[gu] || (o[gu] = !0, Jf("selectionchange", !1, o));
    }
  }
  function ng(i, o, s, v) {
    switch (Ey(o)) {
      case 1:
        var m = EC;
        break;
      case 4:
        m = kC;
        break;
      default:
        m = $f;
    }
    s = m.bind(null, o, s, i), m = void 0, !Cf || o !== "touchstart" && o !== "touchmove" && o !== "wheel" || (m = !0), v ? m !== void 0 ? i.addEventListener(o, s, { capture: !0, passive: m }) : i.addEventListener(o, s, !0) : m !== void 0 ? i.addEventListener(o, s, { passive: m }) : i.addEventListener(o, s, !1);
  }
  function ed(i, o, s, v, m) {
    var g = v;
    if ((o & 1) === 0 && (o & 2) === 0 && v !== null) e: for (; ; ) {
      if (v === null) return;
      var P = v.tag;
      if (P === 3 || P === 4) {
        var j = v.stateNode.containerInfo;
        if (j === m || j.nodeType === 8 && j.parentNode === m) break;
        if (P === 4) for (P = v.return; P !== null; ) {
          var M = P.tag;
          if ((M === 3 || M === 4) && (M = P.stateNode.containerInfo, M === m || M.nodeType === 8 && M.parentNode === m)) return;
          P = P.return;
        }
        for (; j !== null; ) {
          if (P = hi(j), P === null) return;
          if (M = P.tag, M === 5 || M === 6) {
            v = g = P;
            continue e;
          }
          j = j.parentNode;
        }
      }
      v = v.return;
    }
    uy(function() {
      var B = g, X = Of(s), Q = [];
      e: {
        var q = Jy.get(i);
        if (q !== void 0) {
          var oe = zf, de = i;
          switch (i) {
            case "keypress":
              if (du(s) === 0) break e;
            case "keydown":
            case "keyup":
              oe = WC;
              break;
            case "focusin":
              de = "focus", oe = Wf;
              break;
            case "focusout":
              de = "blur", oe = Wf;
              break;
            case "beforeblur":
            case "afterblur":
              oe = Wf;
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
              oe = Iy;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              oe = jC;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              oe = HC;
              break;
            case qy:
            case Xy:
            case Qy:
              oe = MC;
              break;
            case Zy:
              oe = GC;
              break;
            case "scroll":
              oe = CC;
              break;
            case "wheel":
              oe = qC;
              break;
            case "copy":
            case "cut":
            case "paste":
              oe = DC;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              oe = _y;
          }
          var he = (o & 4) !== 0, ut = !he && i === "scroll", L = he ? q !== null ? q + "Capture" : null : q;
          he = [];
          for (var N = B, z; N !== null; ) {
            z = N;
            var ee = z.stateNode;
            if (z.tag === 5 && ee !== null && (z = ee, L !== null && (ee = po(N, L), ee != null && he.push(No(N, ee, z)))), ut) break;
            N = N.return;
          }
          0 < he.length && (q = new oe(q, de, null, s, X), Q.push({ event: q, listeners: he }));
        }
      }
      if ((o & 7) === 0) {
        e: {
          if (q = i === "mouseover" || i === "pointerover", oe = i === "mouseout" || i === "pointerout", q && s !== Pf && (de = s.relatedTarget || s.fromElement) && (hi(de) || de[cn])) break e;
          if ((oe || q) && (q = X.window === X ? X : (q = X.ownerDocument) ? q.defaultView || q.parentWindow : window, oe ? (de = s.relatedTarget || s.toElement, oe = B, de = de ? hi(de) : null, de !== null && (ut = vi(de), de !== ut || de.tag !== 5 && de.tag !== 6) && (de = null)) : (oe = null, de = B), oe !== de)) {
            if (he = Iy, ee = "onMouseLeave", L = "onMouseEnter", N = "mouse", (i === "pointerout" || i === "pointerover") && (he = _y, ee = "onPointerLeave", L = "onPointerEnter", N = "pointer"), ut = oe == null ? q : da(oe), z = de == null ? q : da(de), q = new he(ee, N + "leave", oe, s, X), q.target = ut, q.relatedTarget = z, ee = null, hi(X) === B && (he = new he(L, N + "enter", de, s, X), he.target = z, he.relatedTarget = ut, ee = he), ut = ee, oe && de) t: {
              for (he = oe, L = de, N = 0, z = he; z; z = ca(z)) N++;
              for (z = 0, ee = L; ee; ee = ca(ee)) z++;
              for (; 0 < N - z; ) he = ca(he), N--;
              for (; 0 < z - N; ) L = ca(L), z--;
              for (; N--; ) {
                if (he === L || L !== null && he === L.alternate) break t;
                he = ca(he), L = ca(L);
              }
              he = null;
            }
            else he = null;
            oe !== null && ig(Q, q, oe, he, !1), de !== null && ut !== null && ig(Q, ut, de, he, !0);
          }
        }
        e: {
          if (q = B ? da(B) : window, oe = q.nodeName && q.nodeName.toLowerCase(), oe === "select" || oe === "input" && q.type === "file") var pe = rI;
          else if (Ry(q)) if (zy) pe = oI;
          else {
            pe = iI;
            var ge = nI;
          }
          else (oe = q.nodeName) && oe.toLowerCase() === "input" && (q.type === "checkbox" || q.type === "radio") && (pe = aI);
          if (pe && (pe = pe(i, B))) {
            Ly(Q, pe, s, X);
            break e;
          }
          ge && ge(i, q, B), i === "focusout" && (ge = q._wrapperState) && ge.controlled && q.type === "number" && xf(q, "number", q.value);
        }
        switch (ge = B ? da(B) : window, i) {
          case "focusin":
            (Ry(ge) || ge.contentEditable === "true") && (ua = ge, Yf = B, _o = null);
            break;
          case "focusout":
            _o = Yf = ua = null;
            break;
          case "mousedown":
            qf = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            qf = !1, Gy(Q, s, X);
            break;
          case "selectionchange":
            if (sI) break;
          case "keydown":
          case "keyup":
            Gy(Q, s, X);
        }
        var xe;
        if (Kf) e: {
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
        else la ? Dy(i, s) && (Se = "onCompositionEnd") : i === "keydown" && s.keyCode === 229 && (Se = "onCompositionStart");
        Se && (Ty && s.locale !== "ko" && (la || Se !== "onCompositionStart" ? Se === "onCompositionEnd" && la && (xe = ky()) : (Ln = X, Lf = "value" in Ln ? Ln.value : Ln.textContent, la = !0)), ge = xu(B, Se), 0 < ge.length && (Se = new jy(Se, i, null, s, X), Q.push({ event: Se, listeners: ge }), xe ? Se.data = xe : (xe = $y(s), xe !== null && (Se.data = xe)))), (xe = QC ? ZC(i, s) : JC(i, s)) && (B = xu(B, "onBeforeInput"), 0 < B.length && (X = new jy("onBeforeInput", "beforeinput", null, s, X), Q.push({ event: X, listeners: B }), X.data = xe));
      }
      rg(Q, o);
    });
  }
  function No(i, o, s) {
    return { instance: i, listener: o, currentTarget: s };
  }
  function xu(i, o) {
    for (var s = o + "Capture", v = []; i !== null; ) {
      var m = i, g = m.stateNode;
      m.tag === 5 && g !== null && (m = g, g = po(i, s), g != null && v.unshift(No(i, g, m)), g = po(i, o), g != null && v.push(No(i, g, m))), i = i.return;
    }
    return v;
  }
  function ca(i) {
    if (i === null) return null;
    do
      i = i.return;
    while (i && i.tag !== 5);
    return i || null;
  }
  function ig(i, o, s, v, m) {
    for (var g = o._reactName, P = []; s !== null && s !== v; ) {
      var j = s, M = j.alternate, B = j.stateNode;
      if (M !== null && M === v) break;
      j.tag === 5 && B !== null && (j = B, m ? (M = po(s, g), M != null && P.unshift(No(s, M, j))) : m || (M = po(s, g), M != null && P.push(No(s, M, j)))), s = s.return;
    }
    P.length !== 0 && i.push({ event: o, listeners: P });
  }
  var vI = /\r\n?/g, hI = /\u0000|\uFFFD/g;
  function ag(i) {
    return (typeof i == "string" ? i : "" + i).replace(vI, `
`).replace(hI, "");
  }
  function bu(i, o, s) {
    if (o = ag(o), ag(i) !== o && s) throw Error(r(425));
  }
  function wu() {
  }
  var td = null, rd = null;
  function nd(i, o) {
    return i === "textarea" || i === "noscript" || typeof o.children == "string" || typeof o.children == "number" || typeof o.dangerouslySetInnerHTML == "object" && o.dangerouslySetInnerHTML !== null && o.dangerouslySetInnerHTML.__html != null;
  }
  var id = typeof setTimeout == "function" ? setTimeout : void 0, pI = typeof clearTimeout == "function" ? clearTimeout : void 0, og = typeof Promise == "function" ? Promise : void 0, mI = typeof queueMicrotask == "function" ? queueMicrotask : typeof og < "u" ? function(i) {
    return og.resolve(null).then(i).catch(yI);
  } : id;
  function yI(i) {
    setTimeout(function() {
      throw i;
    });
  }
  function ad(i, o) {
    var s = o, v = 0;
    do {
      var m = s.nextSibling;
      if (i.removeChild(s), m && m.nodeType === 8) if (s = m.data, s === "/$") {
        if (v === 0) {
          i.removeChild(m), Po(o);
          return;
        }
        v--;
      } else s !== "$" && s !== "$?" && s !== "$!" || v++;
      s = m;
    } while (s);
    Po(o);
  }
  function Bn(i) {
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
  function lg(i) {
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
  var fa = Math.random().toString(36).slice(2), Hr = "__reactFiber$" + fa, Do = "__reactProps$" + fa, cn = "__reactContainer$" + fa, od = "__reactEvents$" + fa, gI = "__reactListeners$" + fa, xI = "__reactHandles$" + fa;
  function hi(i) {
    var o = i[Hr];
    if (o) return o;
    for (var s = i.parentNode; s; ) {
      if (o = s[cn] || s[Hr]) {
        if (s = o.alternate, o.child !== null || s !== null && s.child !== null) for (i = lg(i); i !== null; ) {
          if (s = i[Hr]) return s;
          i = lg(i);
        }
        return o;
      }
      i = s, s = i.parentNode;
    }
    return null;
  }
  function $o(i) {
    return i = i[Hr] || i[cn], !i || i.tag !== 5 && i.tag !== 6 && i.tag !== 13 && i.tag !== 3 ? null : i;
  }
  function da(i) {
    if (i.tag === 5 || i.tag === 6) return i.stateNode;
    throw Error(r(33));
  }
  function Su(i) {
    return i[Do] || null;
  }
  var ld = [], va = -1;
  function Fn(i) {
    return { current: i };
  }
  function Ke(i) {
    0 > va || (i.current = ld[va], ld[va] = null, va--);
  }
  function We(i, o) {
    va++, ld[va] = i.current, i.current = o;
  }
  var Wn = {}, Dt = Fn(Wn), Xt = Fn(!1), pi = Wn;
  function ha(i, o) {
    var s = i.type.contextTypes;
    if (!s) return Wn;
    var v = i.stateNode;
    if (v && v.__reactInternalMemoizedUnmaskedChildContext === o) return v.__reactInternalMemoizedMaskedChildContext;
    var m = {}, g;
    for (g in s) m[g] = o[g];
    return v && (i = i.stateNode, i.__reactInternalMemoizedUnmaskedChildContext = o, i.__reactInternalMemoizedMaskedChildContext = m), m;
  }
  function Qt(i) {
    return i = i.childContextTypes, i != null;
  }
  function Au() {
    Ke(Xt), Ke(Dt);
  }
  function ug(i, o, s) {
    if (Dt.current !== Wn) throw Error(r(168));
    We(Dt, o), We(Xt, s);
  }
  function sg(i, o, s) {
    var v = i.stateNode;
    if (o = o.childContextTypes, typeof v.getChildContext != "function") return s;
    v = v.getChildContext();
    for (var m in v) if (!(m in o)) throw Error(r(108, Ee(i) || "Unknown", m));
    return Y({}, s, v);
  }
  function Pu(i) {
    return i = (i = i.stateNode) && i.__reactInternalMemoizedMergedChildContext || Wn, pi = Dt.current, We(Dt, i), We(Xt, Xt.current), !0;
  }
  function cg(i, o, s) {
    var v = i.stateNode;
    if (!v) throw Error(r(169));
    s ? (i = sg(i, o, pi), v.__reactInternalMemoizedMergedChildContext = i, Ke(Xt), Ke(Dt), We(Dt, i)) : Ke(Xt), We(Xt, s);
  }
  var fn = null, Ou = !1, ud = !1;
  function fg(i) {
    fn === null ? fn = [i] : fn.push(i);
  }
  function bI(i) {
    Ou = !0, fg(i);
  }
  function Un() {
    if (!ud && fn !== null) {
      ud = !0;
      var i = 0, o = Le;
      try {
        var s = fn;
        for (Le = 1; i < s.length; i++) {
          var v = s[i];
          do
            v = v(!0);
          while (v !== null);
        }
        fn = null, Ou = !1;
      } catch (m) {
        throw fn !== null && (fn = fn.slice(i + 1)), vy(jf, Un), m;
      } finally {
        Le = o, ud = !1;
      }
    }
    return null;
  }
  var pa = [], ma = 0, Eu = null, ku = 0, pr = [], mr = 0, mi = null, dn = 1, vn = "";
  function yi(i, o) {
    pa[ma++] = ku, pa[ma++] = Eu, Eu = i, ku = o;
  }
  function dg(i, o, s) {
    pr[mr++] = dn, pr[mr++] = vn, pr[mr++] = mi, mi = i;
    var v = dn;
    i = vn;
    var m = 32 - jr(v) - 1;
    v &= ~(1 << m), s += 1;
    var g = 32 - jr(o) + m;
    if (30 < g) {
      var P = m - m % 5;
      g = (v & (1 << P) - 1).toString(32), v >>= P, m -= P, dn = 1 << 32 - jr(o) + m | s << m | v, vn = g + i;
    } else dn = 1 << g | s << m | v, vn = i;
  }
  function sd(i) {
    i.return !== null && (yi(i, 1), dg(i, 1, 0));
  }
  function cd(i) {
    for (; i === Eu; ) Eu = pa[--ma], pa[ma] = null, ku = pa[--ma], pa[ma] = null;
    for (; i === mi; ) mi = pr[--mr], pr[mr] = null, vn = pr[--mr], pr[mr] = null, dn = pr[--mr], pr[mr] = null;
  }
  var ur = null, sr = null, Ge = !1, Tr = null;
  function vg(i, o) {
    var s = br(5, null, null, 0);
    s.elementType = "DELETED", s.stateNode = o, s.return = i, o = i.deletions, o === null ? (i.deletions = [s], i.flags |= 16) : o.push(s);
  }
  function hg(i, o) {
    switch (i.tag) {
      case 5:
        var s = i.type;
        return o = o.nodeType !== 1 || s.toLowerCase() !== o.nodeName.toLowerCase() ? null : o, o !== null ? (i.stateNode = o, ur = i, sr = Bn(o.firstChild), !0) : !1;
      case 6:
        return o = i.pendingProps === "" || o.nodeType !== 3 ? null : o, o !== null ? (i.stateNode = o, ur = i, sr = null, !0) : !1;
      case 13:
        return o = o.nodeType !== 8 ? null : o, o !== null ? (s = mi !== null ? { id: dn, overflow: vn } : null, i.memoizedState = { dehydrated: o, treeContext: s, retryLane: 1073741824 }, s = br(18, null, null, 0), s.stateNode = o, s.return = i, i.child = s, ur = i, sr = null, !0) : !1;
      default:
        return !1;
    }
  }
  function fd(i) {
    return (i.mode & 1) !== 0 && (i.flags & 128) === 0;
  }
  function dd(i) {
    if (Ge) {
      var o = sr;
      if (o) {
        var s = o;
        if (!hg(i, o)) {
          if (fd(i)) throw Error(r(418));
          o = Bn(s.nextSibling);
          var v = ur;
          o && hg(i, o) ? vg(v, s) : (i.flags = i.flags & -4097 | 2, Ge = !1, ur = i);
        }
      } else {
        if (fd(i)) throw Error(r(418));
        i.flags = i.flags & -4097 | 2, Ge = !1, ur = i;
      }
    }
  }
  function pg(i) {
    for (i = i.return; i !== null && i.tag !== 5 && i.tag !== 3 && i.tag !== 13; ) i = i.return;
    ur = i;
  }
  function Cu(i) {
    if (i !== ur) return !1;
    if (!Ge) return pg(i), Ge = !0, !1;
    var o;
    if ((o = i.tag !== 3) && !(o = i.tag !== 5) && (o = i.type, o = o !== "head" && o !== "body" && !nd(i.type, i.memoizedProps)), o && (o = sr)) {
      if (fd(i)) throw mg(), Error(r(418));
      for (; o; ) vg(i, o), o = Bn(o.nextSibling);
    }
    if (pg(i), i.tag === 13) {
      if (i = i.memoizedState, i = i !== null ? i.dehydrated : null, !i) throw Error(r(317));
      e: {
        for (i = i.nextSibling, o = 0; i; ) {
          if (i.nodeType === 8) {
            var s = i.data;
            if (s === "/$") {
              if (o === 0) {
                sr = Bn(i.nextSibling);
                break e;
              }
              o--;
            } else s !== "$" && s !== "$!" && s !== "$?" || o++;
          }
          i = i.nextSibling;
        }
        sr = null;
      }
    } else sr = ur ? Bn(i.stateNode.nextSibling) : null;
    return !0;
  }
  function mg() {
    for (var i = sr; i; ) i = Bn(i.nextSibling);
  }
  function ya() {
    sr = ur = null, Ge = !1;
  }
  function vd(i) {
    Tr === null ? Tr = [i] : Tr.push(i);
  }
  var wI = k.ReactCurrentBatchConfig;
  function Ro(i, o, s) {
    if (i = s.ref, i !== null && typeof i != "function" && typeof i != "object") {
      if (s._owner) {
        if (s = s._owner, s) {
          if (s.tag !== 1) throw Error(r(309));
          var v = s.stateNode;
        }
        if (!v) throw Error(r(147, i));
        var m = v, g = "" + i;
        return o !== null && o.ref !== null && typeof o.ref == "function" && o.ref._stringRef === g ? o.ref : (o = function(P) {
          var j = m.refs;
          P === null ? delete j[g] : j[g] = P;
        }, o._stringRef = g, o);
      }
      if (typeof i != "string") throw Error(r(284));
      if (!s._owner) throw Error(r(290, i));
    }
    return i;
  }
  function Iu(i, o) {
    throw i = Object.prototype.toString.call(o), Error(r(31, i === "[object Object]" ? "object with keys {" + Object.keys(o).join(", ") + "}" : i));
  }
  function yg(i) {
    var o = i._init;
    return o(i._payload);
  }
  function gg(i) {
    function o(L, N) {
      if (i) {
        var z = L.deletions;
        z === null ? (L.deletions = [N], L.flags |= 16) : z.push(N);
      }
    }
    function s(L, N) {
      if (!i) return null;
      for (; N !== null; ) o(L, N), N = N.sibling;
      return null;
    }
    function v(L, N) {
      for (L = /* @__PURE__ */ new Map(); N !== null; ) N.key !== null ? L.set(N.key, N) : L.set(N.index, N), N = N.sibling;
      return L;
    }
    function m(L, N) {
      return L = Qn(L, N), L.index = 0, L.sibling = null, L;
    }
    function g(L, N, z) {
      return L.index = z, i ? (z = L.alternate, z !== null ? (z = z.index, z < N ? (L.flags |= 2, N) : z) : (L.flags |= 2, N)) : (L.flags |= 1048576, N);
    }
    function P(L) {
      return i && L.alternate === null && (L.flags |= 2), L;
    }
    function j(L, N, z, ee) {
      return N === null || N.tag !== 6 ? (N = iv(z, L.mode, ee), N.return = L, N) : (N = m(N, z), N.return = L, N);
    }
    function M(L, N, z, ee) {
      var pe = z.type;
      return pe === $ ? X(L, N, z.props.children, ee, z.key) : N !== null && (N.elementType === pe || typeof pe == "object" && pe !== null && pe.$$typeof === fe && yg(pe) === N.type) ? (ee = m(N, z.props), ee.ref = Ro(L, N, z), ee.return = L, ee) : (ee = Ju(z.type, z.key, z.props, null, L.mode, ee), ee.ref = Ro(L, N, z), ee.return = L, ee);
    }
    function B(L, N, z, ee) {
      return N === null || N.tag !== 4 || N.stateNode.containerInfo !== z.containerInfo || N.stateNode.implementation !== z.implementation ? (N = av(z, L.mode, ee), N.return = L, N) : (N = m(N, z.children || []), N.return = L, N);
    }
    function X(L, N, z, ee, pe) {
      return N === null || N.tag !== 7 ? (N = Oi(z, L.mode, ee, pe), N.return = L, N) : (N = m(N, z), N.return = L, N);
    }
    function Q(L, N, z) {
      if (typeof N == "string" && N !== "" || typeof N == "number") return N = iv("" + N, L.mode, z), N.return = L, N;
      if (typeof N == "object" && N !== null) {
        switch (N.$$typeof) {
          case T:
            return z = Ju(N.type, N.key, N.props, null, L.mode, z), z.ref = Ro(L, null, N), z.return = L, z;
          case E:
            return N = av(N, L.mode, z), N.return = L, N;
          case fe:
            var ee = N._init;
            return Q(L, ee(N._payload), z);
        }
        if (fo(N) || te(N)) return N = Oi(N, L.mode, z, null), N.return = L, N;
        Iu(L, N);
      }
      return null;
    }
    function q(L, N, z, ee) {
      var pe = N !== null ? N.key : null;
      if (typeof z == "string" && z !== "" || typeof z == "number") return pe !== null ? null : j(L, N, "" + z, ee);
      if (typeof z == "object" && z !== null) {
        switch (z.$$typeof) {
          case T:
            return z.key === pe ? M(L, N, z, ee) : null;
          case E:
            return z.key === pe ? B(L, N, z, ee) : null;
          case fe:
            return pe = z._init, q(
              L,
              N,
              pe(z._payload),
              ee
            );
        }
        if (fo(z) || te(z)) return pe !== null ? null : X(L, N, z, ee, null);
        Iu(L, z);
      }
      return null;
    }
    function oe(L, N, z, ee, pe) {
      if (typeof ee == "string" && ee !== "" || typeof ee == "number") return L = L.get(z) || null, j(N, L, "" + ee, pe);
      if (typeof ee == "object" && ee !== null) {
        switch (ee.$$typeof) {
          case T:
            return L = L.get(ee.key === null ? z : ee.key) || null, M(N, L, ee, pe);
          case E:
            return L = L.get(ee.key === null ? z : ee.key) || null, B(N, L, ee, pe);
          case fe:
            var ge = ee._init;
            return oe(L, N, z, ge(ee._payload), pe);
        }
        if (fo(ee) || te(ee)) return L = L.get(z) || null, X(N, L, ee, pe, null);
        Iu(N, ee);
      }
      return null;
    }
    function de(L, N, z, ee) {
      for (var pe = null, ge = null, xe = N, Se = N = 0, At = null; xe !== null && Se < z.length; Se++) {
        xe.index > Se ? (At = xe, xe = null) : At = xe.sibling;
        var Me = q(L, xe, z[Se], ee);
        if (Me === null) {
          xe === null && (xe = At);
          break;
        }
        i && xe && Me.alternate === null && o(L, xe), N = g(Me, N, Se), ge === null ? pe = Me : ge.sibling = Me, ge = Me, xe = At;
      }
      if (Se === z.length) return s(L, xe), Ge && yi(L, Se), pe;
      if (xe === null) {
        for (; Se < z.length; Se++) xe = Q(L, z[Se], ee), xe !== null && (N = g(xe, N, Se), ge === null ? pe = xe : ge.sibling = xe, ge = xe);
        return Ge && yi(L, Se), pe;
      }
      for (xe = v(L, xe); Se < z.length; Se++) At = oe(xe, L, Se, z[Se], ee), At !== null && (i && At.alternate !== null && xe.delete(At.key === null ? Se : At.key), N = g(At, N, Se), ge === null ? pe = At : ge.sibling = At, ge = At);
      return i && xe.forEach(function(Zn) {
        return o(L, Zn);
      }), Ge && yi(L, Se), pe;
    }
    function he(L, N, z, ee) {
      var pe = te(z);
      if (typeof pe != "function") throw Error(r(150));
      if (z = pe.call(z), z == null) throw Error(r(151));
      for (var ge = pe = null, xe = N, Se = N = 0, At = null, Me = z.next(); xe !== null && !Me.done; Se++, Me = z.next()) {
        xe.index > Se ? (At = xe, xe = null) : At = xe.sibling;
        var Zn = q(L, xe, Me.value, ee);
        if (Zn === null) {
          xe === null && (xe = At);
          break;
        }
        i && xe && Zn.alternate === null && o(L, xe), N = g(Zn, N, Se), ge === null ? pe = Zn : ge.sibling = Zn, ge = Zn, xe = At;
      }
      if (Me.done) return s(
        L,
        xe
      ), Ge && yi(L, Se), pe;
      if (xe === null) {
        for (; !Me.done; Se++, Me = z.next()) Me = Q(L, Me.value, ee), Me !== null && (N = g(Me, N, Se), ge === null ? pe = Me : ge.sibling = Me, ge = Me);
        return Ge && yi(L, Se), pe;
      }
      for (xe = v(L, xe); !Me.done; Se++, Me = z.next()) Me = oe(xe, L, Se, Me.value, ee), Me !== null && (i && Me.alternate !== null && xe.delete(Me.key === null ? Se : Me.key), N = g(Me, N, Se), ge === null ? pe = Me : ge.sibling = Me, ge = Me);
      return i && xe.forEach(function(ej) {
        return o(L, ej);
      }), Ge && yi(L, Se), pe;
    }
    function ut(L, N, z, ee) {
      if (typeof z == "object" && z !== null && z.type === $ && z.key === null && (z = z.props.children), typeof z == "object" && z !== null) {
        switch (z.$$typeof) {
          case T:
            e: {
              for (var pe = z.key, ge = N; ge !== null; ) {
                if (ge.key === pe) {
                  if (pe = z.type, pe === $) {
                    if (ge.tag === 7) {
                      s(L, ge.sibling), N = m(ge, z.props.children), N.return = L, L = N;
                      break e;
                    }
                  } else if (ge.elementType === pe || typeof pe == "object" && pe !== null && pe.$$typeof === fe && yg(pe) === ge.type) {
                    s(L, ge.sibling), N = m(ge, z.props), N.ref = Ro(L, ge, z), N.return = L, L = N;
                    break e;
                  }
                  s(L, ge);
                  break;
                } else o(L, ge);
                ge = ge.sibling;
              }
              z.type === $ ? (N = Oi(z.props.children, L.mode, ee, z.key), N.return = L, L = N) : (ee = Ju(z.type, z.key, z.props, null, L.mode, ee), ee.ref = Ro(L, N, z), ee.return = L, L = ee);
            }
            return P(L);
          case E:
            e: {
              for (ge = z.key; N !== null; ) {
                if (N.key === ge) if (N.tag === 4 && N.stateNode.containerInfo === z.containerInfo && N.stateNode.implementation === z.implementation) {
                  s(L, N.sibling), N = m(N, z.children || []), N.return = L, L = N;
                  break e;
                } else {
                  s(L, N);
                  break;
                }
                else o(L, N);
                N = N.sibling;
              }
              N = av(z, L.mode, ee), N.return = L, L = N;
            }
            return P(L);
          case fe:
            return ge = z._init, ut(L, N, ge(z._payload), ee);
        }
        if (fo(z)) return de(L, N, z, ee);
        if (te(z)) return he(L, N, z, ee);
        Iu(L, z);
      }
      return typeof z == "string" && z !== "" || typeof z == "number" ? (z = "" + z, N !== null && N.tag === 6 ? (s(L, N.sibling), N = m(N, z), N.return = L, L = N) : (s(L, N), N = iv(z, L.mode, ee), N.return = L, L = N), P(L)) : s(L, N);
    }
    return ut;
  }
  var ga = gg(!0), xg = gg(!1), ju = Fn(null), _u = null, xa = null, hd = null;
  function pd() {
    hd = xa = _u = null;
  }
  function md(i) {
    var o = ju.current;
    Ke(ju), i._currentValue = o;
  }
  function yd(i, o, s) {
    for (; i !== null; ) {
      var v = i.alternate;
      if ((i.childLanes & o) !== o ? (i.childLanes |= o, v !== null && (v.childLanes |= o)) : v !== null && (v.childLanes & o) !== o && (v.childLanes |= o), i === s) break;
      i = i.return;
    }
  }
  function ba(i, o) {
    _u = i, hd = xa = null, i = i.dependencies, i !== null && i.firstContext !== null && ((i.lanes & o) !== 0 && (Zt = !0), i.firstContext = null);
  }
  function yr(i) {
    var o = i._currentValue;
    if (hd !== i) if (i = { context: i, memoizedValue: o, next: null }, xa === null) {
      if (_u === null) throw Error(r(308));
      xa = i, _u.dependencies = { lanes: 0, firstContext: i };
    } else xa = xa.next = i;
    return o;
  }
  var gi = null;
  function gd(i) {
    gi === null ? gi = [i] : gi.push(i);
  }
  function bg(i, o, s, v) {
    var m = o.interleaved;
    return m === null ? (s.next = s, gd(o)) : (s.next = m.next, m.next = s), o.interleaved = s, hn(i, v);
  }
  function hn(i, o) {
    i.lanes |= o;
    var s = i.alternate;
    for (s !== null && (s.lanes |= o), s = i, i = i.return; i !== null; ) i.childLanes |= o, s = i.alternate, s !== null && (s.childLanes |= o), s = i, i = i.return;
    return s.tag === 3 ? s.stateNode : null;
  }
  var Kn = !1;
  function xd(i) {
    i.updateQueue = { baseState: i.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function wg(i, o) {
    i = i.updateQueue, o.updateQueue === i && (o.updateQueue = { baseState: i.baseState, firstBaseUpdate: i.firstBaseUpdate, lastBaseUpdate: i.lastBaseUpdate, shared: i.shared, effects: i.effects });
  }
  function pn(i, o) {
    return { eventTime: i, lane: o, tag: 0, payload: null, callback: null, next: null };
  }
  function Hn(i, o, s) {
    var v = i.updateQueue;
    if (v === null) return null;
    if (v = v.shared, (je & 2) !== 0) {
      var m = v.pending;
      return m === null ? o.next = o : (o.next = m.next, m.next = o), v.pending = o, hn(i, s);
    }
    return m = v.interleaved, m === null ? (o.next = o, gd(v)) : (o.next = m.next, m.next = o), v.interleaved = o, hn(i, s);
  }
  function Tu(i, o, s) {
    if (o = o.updateQueue, o !== null && (o = o.shared, (s & 4194240) !== 0)) {
      var v = o.lanes;
      v &= i.pendingLanes, s |= v, o.lanes = s, Mf(i, s);
    }
  }
  function Sg(i, o) {
    var s = i.updateQueue, v = i.alternate;
    if (v !== null && (v = v.updateQueue, s === v)) {
      var m = null, g = null;
      if (s = s.firstBaseUpdate, s !== null) {
        do {
          var P = { eventTime: s.eventTime, lane: s.lane, tag: s.tag, payload: s.payload, callback: s.callback, next: null };
          g === null ? m = g = P : g = g.next = P, s = s.next;
        } while (s !== null);
        g === null ? m = g = o : g = g.next = o;
      } else m = g = o;
      s = { baseState: v.baseState, firstBaseUpdate: m, lastBaseUpdate: g, shared: v.shared, effects: v.effects }, i.updateQueue = s;
      return;
    }
    i = s.lastBaseUpdate, i === null ? s.firstBaseUpdate = o : i.next = o, s.lastBaseUpdate = o;
  }
  function Mu(i, o, s, v) {
    var m = i.updateQueue;
    Kn = !1;
    var g = m.firstBaseUpdate, P = m.lastBaseUpdate, j = m.shared.pending;
    if (j !== null) {
      m.shared.pending = null;
      var M = j, B = M.next;
      M.next = null, P === null ? g = B : P.next = B, P = M;
      var X = i.alternate;
      X !== null && (X = X.updateQueue, j = X.lastBaseUpdate, j !== P && (j === null ? X.firstBaseUpdate = B : j.next = B, X.lastBaseUpdate = M));
    }
    if (g !== null) {
      var Q = m.baseState;
      P = 0, X = B = M = null, j = g;
      do {
        var q = j.lane, oe = j.eventTime;
        if ((v & q) === q) {
          X !== null && (X = X.next = {
            eventTime: oe,
            lane: 0,
            tag: j.tag,
            payload: j.payload,
            callback: j.callback,
            next: null
          });
          e: {
            var de = i, he = j;
            switch (q = o, oe = s, he.tag) {
              case 1:
                if (de = he.payload, typeof de == "function") {
                  Q = de.call(oe, Q, q);
                  break e;
                }
                Q = de;
                break e;
              case 3:
                de.flags = de.flags & -65537 | 128;
              case 0:
                if (de = he.payload, q = typeof de == "function" ? de.call(oe, Q, q) : de, q == null) break e;
                Q = Y({}, Q, q);
                break e;
              case 2:
                Kn = !0;
            }
          }
          j.callback !== null && j.lane !== 0 && (i.flags |= 64, q = m.effects, q === null ? m.effects = [j] : q.push(j));
        } else oe = { eventTime: oe, lane: q, tag: j.tag, payload: j.payload, callback: j.callback, next: null }, X === null ? (B = X = oe, M = Q) : X = X.next = oe, P |= q;
        if (j = j.next, j === null) {
          if (j = m.shared.pending, j === null) break;
          q = j, j = q.next, q.next = null, m.lastBaseUpdate = q, m.shared.pending = null;
        }
      } while (!0);
      if (X === null && (M = Q), m.baseState = M, m.firstBaseUpdate = B, m.lastBaseUpdate = X, o = m.shared.interleaved, o !== null) {
        m = o;
        do
          P |= m.lane, m = m.next;
        while (m !== o);
      } else g === null && (m.shared.lanes = 0);
      wi |= P, i.lanes = P, i.memoizedState = Q;
    }
  }
  function Ag(i, o, s) {
    if (i = o.effects, o.effects = null, i !== null) for (o = 0; o < i.length; o++) {
      var v = i[o], m = v.callback;
      if (m !== null) {
        if (v.callback = null, v = s, typeof m != "function") throw Error(r(191, m));
        m.call(v);
      }
    }
  }
  var Lo = {}, Vr = Fn(Lo), zo = Fn(Lo), Bo = Fn(Lo);
  function xi(i) {
    if (i === Lo) throw Error(r(174));
    return i;
  }
  function bd(i, o) {
    switch (We(Bo, o), We(zo, i), We(Vr, Lo), i = o.nodeType, i) {
      case 9:
      case 11:
        o = (o = o.documentElement) ? o.namespaceURI : wf(null, "");
        break;
      default:
        i = i === 8 ? o.parentNode : o, o = i.namespaceURI || null, i = i.tagName, o = wf(o, i);
    }
    Ke(Vr), We(Vr, o);
  }
  function wa() {
    Ke(Vr), Ke(zo), Ke(Bo);
  }
  function Pg(i) {
    xi(Bo.current);
    var o = xi(Vr.current), s = wf(o, i.type);
    o !== s && (We(zo, i), We(Vr, s));
  }
  function wd(i) {
    zo.current === i && (Ke(Vr), Ke(zo));
  }
  var Xe = Fn(0);
  function Nu(i) {
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
  var Sd = [];
  function Ad() {
    for (var i = 0; i < Sd.length; i++) Sd[i]._workInProgressVersionPrimary = null;
    Sd.length = 0;
  }
  var Du = k.ReactCurrentDispatcher, Pd = k.ReactCurrentBatchConfig, bi = 0, Qe = null, vt = null, wt = null, $u = !1, Fo = !1, Wo = 0, SI = 0;
  function $t() {
    throw Error(r(321));
  }
  function Od(i, o) {
    if (o === null) return !1;
    for (var s = 0; s < o.length && s < i.length; s++) if (!_r(i[s], o[s])) return !1;
    return !0;
  }
  function Ed(i, o, s, v, m, g) {
    if (bi = g, Qe = o, o.memoizedState = null, o.updateQueue = null, o.lanes = 0, Du.current = i === null || i.memoizedState === null ? EI : kI, i = s(v, m), Fo) {
      g = 0;
      do {
        if (Fo = !1, Wo = 0, 25 <= g) throw Error(r(301));
        g += 1, wt = vt = null, o.updateQueue = null, Du.current = CI, i = s(v, m);
      } while (Fo);
    }
    if (Du.current = zu, o = vt !== null && vt.next !== null, bi = 0, wt = vt = Qe = null, $u = !1, o) throw Error(r(300));
    return i;
  }
  function kd() {
    var i = Wo !== 0;
    return Wo = 0, i;
  }
  function Gr() {
    var i = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return wt === null ? Qe.memoizedState = wt = i : wt = wt.next = i, wt;
  }
  function gr() {
    if (vt === null) {
      var i = Qe.alternate;
      i = i !== null ? i.memoizedState : null;
    } else i = vt.next;
    var o = wt === null ? Qe.memoizedState : wt.next;
    if (o !== null) wt = o, vt = i;
    else {
      if (i === null) throw Error(r(310));
      vt = i, i = { memoizedState: vt.memoizedState, baseState: vt.baseState, baseQueue: vt.baseQueue, queue: vt.queue, next: null }, wt === null ? Qe.memoizedState = wt = i : wt = wt.next = i;
    }
    return wt;
  }
  function Uo(i, o) {
    return typeof o == "function" ? o(i) : o;
  }
  function Cd(i) {
    var o = gr(), s = o.queue;
    if (s === null) throw Error(r(311));
    s.lastRenderedReducer = i;
    var v = vt, m = v.baseQueue, g = s.pending;
    if (g !== null) {
      if (m !== null) {
        var P = m.next;
        m.next = g.next, g.next = P;
      }
      v.baseQueue = m = g, s.pending = null;
    }
    if (m !== null) {
      g = m.next, v = v.baseState;
      var j = P = null, M = null, B = g;
      do {
        var X = B.lane;
        if ((bi & X) === X) M !== null && (M = M.next = { lane: 0, action: B.action, hasEagerState: B.hasEagerState, eagerState: B.eagerState, next: null }), v = B.hasEagerState ? B.eagerState : i(v, B.action);
        else {
          var Q = {
            lane: X,
            action: B.action,
            hasEagerState: B.hasEagerState,
            eagerState: B.eagerState,
            next: null
          };
          M === null ? (j = M = Q, P = v) : M = M.next = Q, Qe.lanes |= X, wi |= X;
        }
        B = B.next;
      } while (B !== null && B !== g);
      M === null ? P = v : M.next = j, _r(v, o.memoizedState) || (Zt = !0), o.memoizedState = v, o.baseState = P, o.baseQueue = M, s.lastRenderedState = v;
    }
    if (i = s.interleaved, i !== null) {
      m = i;
      do
        g = m.lane, Qe.lanes |= g, wi |= g, m = m.next;
      while (m !== i);
    } else m === null && (s.lanes = 0);
    return [o.memoizedState, s.dispatch];
  }
  function Id(i) {
    var o = gr(), s = o.queue;
    if (s === null) throw Error(r(311));
    s.lastRenderedReducer = i;
    var v = s.dispatch, m = s.pending, g = o.memoizedState;
    if (m !== null) {
      s.pending = null;
      var P = m = m.next;
      do
        g = i(g, P.action), P = P.next;
      while (P !== m);
      _r(g, o.memoizedState) || (Zt = !0), o.memoizedState = g, o.baseQueue === null && (o.baseState = g), s.lastRenderedState = g;
    }
    return [g, v];
  }
  function Og() {
  }
  function Eg(i, o) {
    var s = Qe, v = gr(), m = o(), g = !_r(v.memoizedState, m);
    if (g && (v.memoizedState = m, Zt = !0), v = v.queue, jd(Ig.bind(null, s, v, i), [i]), v.getSnapshot !== o || g || wt !== null && wt.memoizedState.tag & 1) {
      if (s.flags |= 2048, Ko(9, Cg.bind(null, s, v, m, o), void 0, null), St === null) throw Error(r(349));
      (bi & 30) !== 0 || kg(s, o, m);
    }
    return m;
  }
  function kg(i, o, s) {
    i.flags |= 16384, i = { getSnapshot: o, value: s }, o = Qe.updateQueue, o === null ? (o = { lastEffect: null, stores: null }, Qe.updateQueue = o, o.stores = [i]) : (s = o.stores, s === null ? o.stores = [i] : s.push(i));
  }
  function Cg(i, o, s, v) {
    o.value = s, o.getSnapshot = v, jg(o) && _g(i);
  }
  function Ig(i, o, s) {
    return s(function() {
      jg(o) && _g(i);
    });
  }
  function jg(i) {
    var o = i.getSnapshot;
    i = i.value;
    try {
      var s = o();
      return !_r(i, s);
    } catch {
      return !0;
    }
  }
  function _g(i) {
    var o = hn(i, 1);
    o !== null && $r(o, i, 1, -1);
  }
  function Tg(i) {
    var o = Gr();
    return typeof i == "function" && (i = i()), o.memoizedState = o.baseState = i, i = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Uo, lastRenderedState: i }, o.queue = i, i = i.dispatch = OI.bind(null, Qe, i), [o.memoizedState, i];
  }
  function Ko(i, o, s, v) {
    return i = { tag: i, create: o, destroy: s, deps: v, next: null }, o = Qe.updateQueue, o === null ? (o = { lastEffect: null, stores: null }, Qe.updateQueue = o, o.lastEffect = i.next = i) : (s = o.lastEffect, s === null ? o.lastEffect = i.next = i : (v = s.next, s.next = i, i.next = v, o.lastEffect = i)), i;
  }
  function Mg() {
    return gr().memoizedState;
  }
  function Ru(i, o, s, v) {
    var m = Gr();
    Qe.flags |= i, m.memoizedState = Ko(1 | o, s, void 0, v === void 0 ? null : v);
  }
  function Lu(i, o, s, v) {
    var m = gr();
    v = v === void 0 ? null : v;
    var g = void 0;
    if (vt !== null) {
      var P = vt.memoizedState;
      if (g = P.destroy, v !== null && Od(v, P.deps)) {
        m.memoizedState = Ko(o, s, g, v);
        return;
      }
    }
    Qe.flags |= i, m.memoizedState = Ko(1 | o, s, g, v);
  }
  function Ng(i, o) {
    return Ru(8390656, 8, i, o);
  }
  function jd(i, o) {
    return Lu(2048, 8, i, o);
  }
  function Dg(i, o) {
    return Lu(4, 2, i, o);
  }
  function $g(i, o) {
    return Lu(4, 4, i, o);
  }
  function Rg(i, o) {
    if (typeof o == "function") return i = i(), o(i), function() {
      o(null);
    };
    if (o != null) return i = i(), o.current = i, function() {
      o.current = null;
    };
  }
  function Lg(i, o, s) {
    return s = s != null ? s.concat([i]) : null, Lu(4, 4, Rg.bind(null, o, i), s);
  }
  function _d() {
  }
  function zg(i, o) {
    var s = gr();
    o = o === void 0 ? null : o;
    var v = s.memoizedState;
    return v !== null && o !== null && Od(o, v[1]) ? v[0] : (s.memoizedState = [i, o], i);
  }
  function Bg(i, o) {
    var s = gr();
    o = o === void 0 ? null : o;
    var v = s.memoizedState;
    return v !== null && o !== null && Od(o, v[1]) ? v[0] : (i = i(), s.memoizedState = [i, o], i);
  }
  function Fg(i, o, s) {
    return (bi & 21) === 0 ? (i.baseState && (i.baseState = !1, Zt = !0), i.memoizedState = s) : (_r(s, o) || (s = yy(), Qe.lanes |= s, wi |= s, i.baseState = !0), o);
  }
  function AI(i, o) {
    var s = Le;
    Le = s !== 0 && 4 > s ? s : 4, i(!0);
    var v = Pd.transition;
    Pd.transition = {};
    try {
      i(!1), o();
    } finally {
      Le = s, Pd.transition = v;
    }
  }
  function Wg() {
    return gr().memoizedState;
  }
  function PI(i, o, s) {
    var v = qn(i);
    if (s = { lane: v, action: s, hasEagerState: !1, eagerState: null, next: null }, Ug(i)) Kg(o, s);
    else if (s = bg(i, o, s, v), s !== null) {
      var m = Gt();
      $r(s, i, v, m), Hg(s, o, v);
    }
  }
  function OI(i, o, s) {
    var v = qn(i), m = { lane: v, action: s, hasEagerState: !1, eagerState: null, next: null };
    if (Ug(i)) Kg(o, m);
    else {
      var g = i.alternate;
      if (i.lanes === 0 && (g === null || g.lanes === 0) && (g = o.lastRenderedReducer, g !== null)) try {
        var P = o.lastRenderedState, j = g(P, s);
        if (m.hasEagerState = !0, m.eagerState = j, _r(j, P)) {
          var M = o.interleaved;
          M === null ? (m.next = m, gd(o)) : (m.next = M.next, M.next = m), o.interleaved = m;
          return;
        }
      } catch {
      } finally {
      }
      s = bg(i, o, m, v), s !== null && (m = Gt(), $r(s, i, v, m), Hg(s, o, v));
    }
  }
  function Ug(i) {
    var o = i.alternate;
    return i === Qe || o !== null && o === Qe;
  }
  function Kg(i, o) {
    Fo = $u = !0;
    var s = i.pending;
    s === null ? o.next = o : (o.next = s.next, s.next = o), i.pending = o;
  }
  function Hg(i, o, s) {
    if ((s & 4194240) !== 0) {
      var v = o.lanes;
      v &= i.pendingLanes, s |= v, o.lanes = s, Mf(i, s);
    }
  }
  var zu = { readContext: yr, useCallback: $t, useContext: $t, useEffect: $t, useImperativeHandle: $t, useInsertionEffect: $t, useLayoutEffect: $t, useMemo: $t, useReducer: $t, useRef: $t, useState: $t, useDebugValue: $t, useDeferredValue: $t, useTransition: $t, useMutableSource: $t, useSyncExternalStore: $t, useId: $t, unstable_isNewReconciler: !1 }, EI = { readContext: yr, useCallback: function(i, o) {
    return Gr().memoizedState = [i, o === void 0 ? null : o], i;
  }, useContext: yr, useEffect: Ng, useImperativeHandle: function(i, o, s) {
    return s = s != null ? s.concat([i]) : null, Ru(
      4194308,
      4,
      Rg.bind(null, o, i),
      s
    );
  }, useLayoutEffect: function(i, o) {
    return Ru(4194308, 4, i, o);
  }, useInsertionEffect: function(i, o) {
    return Ru(4, 2, i, o);
  }, useMemo: function(i, o) {
    var s = Gr();
    return o = o === void 0 ? null : o, i = i(), s.memoizedState = [i, o], i;
  }, useReducer: function(i, o, s) {
    var v = Gr();
    return o = s !== void 0 ? s(o) : o, v.memoizedState = v.baseState = o, i = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: i, lastRenderedState: o }, v.queue = i, i = i.dispatch = PI.bind(null, Qe, i), [v.memoizedState, i];
  }, useRef: function(i) {
    var o = Gr();
    return i = { current: i }, o.memoizedState = i;
  }, useState: Tg, useDebugValue: _d, useDeferredValue: function(i) {
    return Gr().memoizedState = i;
  }, useTransition: function() {
    var i = Tg(!1), o = i[0];
    return i = AI.bind(null, i[1]), Gr().memoizedState = i, [o, i];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(i, o, s) {
    var v = Qe, m = Gr();
    if (Ge) {
      if (s === void 0) throw Error(r(407));
      s = s();
    } else {
      if (s = o(), St === null) throw Error(r(349));
      (bi & 30) !== 0 || kg(v, o, s);
    }
    m.memoizedState = s;
    var g = { value: s, getSnapshot: o };
    return m.queue = g, Ng(Ig.bind(
      null,
      v,
      g,
      i
    ), [i]), v.flags |= 2048, Ko(9, Cg.bind(null, v, g, s, o), void 0, null), s;
  }, useId: function() {
    var i = Gr(), o = St.identifierPrefix;
    if (Ge) {
      var s = vn, v = dn;
      s = (v & ~(1 << 32 - jr(v) - 1)).toString(32) + s, o = ":" + o + "R" + s, s = Wo++, 0 < s && (o += "H" + s.toString(32)), o += ":";
    } else s = SI++, o = ":" + o + "r" + s.toString(32) + ":";
    return i.memoizedState = o;
  }, unstable_isNewReconciler: !1 }, kI = {
    readContext: yr,
    useCallback: zg,
    useContext: yr,
    useEffect: jd,
    useImperativeHandle: Lg,
    useInsertionEffect: Dg,
    useLayoutEffect: $g,
    useMemo: Bg,
    useReducer: Cd,
    useRef: Mg,
    useState: function() {
      return Cd(Uo);
    },
    useDebugValue: _d,
    useDeferredValue: function(i) {
      var o = gr();
      return Fg(o, vt.memoizedState, i);
    },
    useTransition: function() {
      var i = Cd(Uo)[0], o = gr().memoizedState;
      return [i, o];
    },
    useMutableSource: Og,
    useSyncExternalStore: Eg,
    useId: Wg,
    unstable_isNewReconciler: !1
  }, CI = { readContext: yr, useCallback: zg, useContext: yr, useEffect: jd, useImperativeHandle: Lg, useInsertionEffect: Dg, useLayoutEffect: $g, useMemo: Bg, useReducer: Id, useRef: Mg, useState: function() {
    return Id(Uo);
  }, useDebugValue: _d, useDeferredValue: function(i) {
    var o = gr();
    return vt === null ? o.memoizedState = i : Fg(o, vt.memoizedState, i);
  }, useTransition: function() {
    var i = Id(Uo)[0], o = gr().memoizedState;
    return [i, o];
  }, useMutableSource: Og, useSyncExternalStore: Eg, useId: Wg, unstable_isNewReconciler: !1 };
  function Mr(i, o) {
    if (i && i.defaultProps) {
      o = Y({}, o), i = i.defaultProps;
      for (var s in i) o[s] === void 0 && (o[s] = i[s]);
      return o;
    }
    return o;
  }
  function Td(i, o, s, v) {
    o = i.memoizedState, s = s(v, o), s = s == null ? o : Y({}, o, s), i.memoizedState = s, i.lanes === 0 && (i.updateQueue.baseState = s);
  }
  var Bu = { isMounted: function(i) {
    return (i = i._reactInternals) ? vi(i) === i : !1;
  }, enqueueSetState: function(i, o, s) {
    i = i._reactInternals;
    var v = Gt(), m = qn(i), g = pn(v, m);
    g.payload = o, s != null && (g.callback = s), o = Hn(i, g, m), o !== null && ($r(o, i, m, v), Tu(o, i, m));
  }, enqueueReplaceState: function(i, o, s) {
    i = i._reactInternals;
    var v = Gt(), m = qn(i), g = pn(v, m);
    g.tag = 1, g.payload = o, s != null && (g.callback = s), o = Hn(i, g, m), o !== null && ($r(o, i, m, v), Tu(o, i, m));
  }, enqueueForceUpdate: function(i, o) {
    i = i._reactInternals;
    var s = Gt(), v = qn(i), m = pn(s, v);
    m.tag = 2, o != null && (m.callback = o), o = Hn(i, m, v), o !== null && ($r(o, i, v, s), Tu(o, i, v));
  } };
  function Vg(i, o, s, v, m, g, P) {
    return i = i.stateNode, typeof i.shouldComponentUpdate == "function" ? i.shouldComponentUpdate(v, g, P) : o.prototype && o.prototype.isPureReactComponent ? !jo(s, v) || !jo(m, g) : !0;
  }
  function Gg(i, o, s) {
    var v = !1, m = Wn, g = o.contextType;
    return typeof g == "object" && g !== null ? g = yr(g) : (m = Qt(o) ? pi : Dt.current, v = o.contextTypes, g = (v = v != null) ? ha(i, m) : Wn), o = new o(s, g), i.memoizedState = o.state !== null && o.state !== void 0 ? o.state : null, o.updater = Bu, i.stateNode = o, o._reactInternals = i, v && (i = i.stateNode, i.__reactInternalMemoizedUnmaskedChildContext = m, i.__reactInternalMemoizedMaskedChildContext = g), o;
  }
  function Yg(i, o, s, v) {
    i = o.state, typeof o.componentWillReceiveProps == "function" && o.componentWillReceiveProps(s, v), typeof o.UNSAFE_componentWillReceiveProps == "function" && o.UNSAFE_componentWillReceiveProps(s, v), o.state !== i && Bu.enqueueReplaceState(o, o.state, null);
  }
  function Md(i, o, s, v) {
    var m = i.stateNode;
    m.props = s, m.state = i.memoizedState, m.refs = {}, xd(i);
    var g = o.contextType;
    typeof g == "object" && g !== null ? m.context = yr(g) : (g = Qt(o) ? pi : Dt.current, m.context = ha(i, g)), m.state = i.memoizedState, g = o.getDerivedStateFromProps, typeof g == "function" && (Td(i, o, g, s), m.state = i.memoizedState), typeof o.getDerivedStateFromProps == "function" || typeof m.getSnapshotBeforeUpdate == "function" || typeof m.UNSAFE_componentWillMount != "function" && typeof m.componentWillMount != "function" || (o = m.state, typeof m.componentWillMount == "function" && m.componentWillMount(), typeof m.UNSAFE_componentWillMount == "function" && m.UNSAFE_componentWillMount(), o !== m.state && Bu.enqueueReplaceState(m, m.state, null), Mu(i, s, m, v), m.state = i.memoizedState), typeof m.componentDidMount == "function" && (i.flags |= 4194308);
  }
  function Sa(i, o) {
    try {
      var s = "", v = o;
      do
        s += Ae(v), v = v.return;
      while (v);
      var m = s;
    } catch (g) {
      m = `
Error generating stack: ` + g.message + `
` + g.stack;
    }
    return { value: i, source: o, stack: m, digest: null };
  }
  function Nd(i, o, s) {
    return { value: i, source: null, stack: s ?? null, digest: o ?? null };
  }
  function Dd(i, o) {
    try {
      console.error(o.value);
    } catch (s) {
      setTimeout(function() {
        throw s;
      });
    }
  }
  var II = typeof WeakMap == "function" ? WeakMap : Map;
  function qg(i, o, s) {
    s = pn(-1, s), s.tag = 3, s.payload = { element: null };
    var v = o.value;
    return s.callback = function() {
      Gu || (Gu = !0, Xd = v), Dd(i, o);
    }, s;
  }
  function Xg(i, o, s) {
    s = pn(-1, s), s.tag = 3;
    var v = i.type.getDerivedStateFromError;
    if (typeof v == "function") {
      var m = o.value;
      s.payload = function() {
        return v(m);
      }, s.callback = function() {
        Dd(i, o);
      };
    }
    var g = i.stateNode;
    return g !== null && typeof g.componentDidCatch == "function" && (s.callback = function() {
      Dd(i, o), typeof v != "function" && (Gn === null ? Gn = /* @__PURE__ */ new Set([this]) : Gn.add(this));
      var P = o.stack;
      this.componentDidCatch(o.value, { componentStack: P !== null ? P : "" });
    }), s;
  }
  function Qg(i, o, s) {
    var v = i.pingCache;
    if (v === null) {
      v = i.pingCache = new II();
      var m = /* @__PURE__ */ new Set();
      v.set(o, m);
    } else m = v.get(o), m === void 0 && (m = /* @__PURE__ */ new Set(), v.set(o, m));
    m.has(s) || (m.add(s), i = UI.bind(null, i, o, s), o.then(i, i));
  }
  function Zg(i) {
    do {
      var o;
      if ((o = i.tag === 13) && (o = i.memoizedState, o = o !== null ? o.dehydrated !== null : !0), o) return i;
      i = i.return;
    } while (i !== null);
    return null;
  }
  function Jg(i, o, s, v, m) {
    return (i.mode & 1) === 0 ? (i === o ? i.flags |= 65536 : (i.flags |= 128, s.flags |= 131072, s.flags &= -52805, s.tag === 1 && (s.alternate === null ? s.tag = 17 : (o = pn(-1, 1), o.tag = 2, Hn(s, o, 1))), s.lanes |= 1), i) : (i.flags |= 65536, i.lanes = m, i);
  }
  var jI = k.ReactCurrentOwner, Zt = !1;
  function Vt(i, o, s, v) {
    o.child = i === null ? xg(o, null, s, v) : ga(o, i.child, s, v);
  }
  function e0(i, o, s, v, m) {
    s = s.render;
    var g = o.ref;
    return ba(o, m), v = Ed(i, o, s, v, g, m), s = kd(), i !== null && !Zt ? (o.updateQueue = i.updateQueue, o.flags &= -2053, i.lanes &= ~m, mn(i, o, m)) : (Ge && s && sd(o), o.flags |= 1, Vt(i, o, v, m), o.child);
  }
  function t0(i, o, s, v, m) {
    if (i === null) {
      var g = s.type;
      return typeof g == "function" && !nv(g) && g.defaultProps === void 0 && s.compare === null && s.defaultProps === void 0 ? (o.tag = 15, o.type = g, r0(i, o, g, v, m)) : (i = Ju(s.type, null, v, o, o.mode, m), i.ref = o.ref, i.return = o, o.child = i);
    }
    if (g = i.child, (i.lanes & m) === 0) {
      var P = g.memoizedProps;
      if (s = s.compare, s = s !== null ? s : jo, s(P, v) && i.ref === o.ref) return mn(i, o, m);
    }
    return o.flags |= 1, i = Qn(g, v), i.ref = o.ref, i.return = o, o.child = i;
  }
  function r0(i, o, s, v, m) {
    if (i !== null) {
      var g = i.memoizedProps;
      if (jo(g, v) && i.ref === o.ref) if (Zt = !1, o.pendingProps = v = g, (i.lanes & m) !== 0) (i.flags & 131072) !== 0 && (Zt = !0);
      else return o.lanes = i.lanes, mn(i, o, m);
    }
    return $d(i, o, s, v, m);
  }
  function n0(i, o, s) {
    var v = o.pendingProps, m = v.children, g = i !== null ? i.memoizedState : null;
    if (v.mode === "hidden") if ((o.mode & 1) === 0) o.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, We(Pa, cr), cr |= s;
    else {
      if ((s & 1073741824) === 0) return i = g !== null ? g.baseLanes | s : s, o.lanes = o.childLanes = 1073741824, o.memoizedState = { baseLanes: i, cachePool: null, transitions: null }, o.updateQueue = null, We(Pa, cr), cr |= i, null;
      o.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, v = g !== null ? g.baseLanes : s, We(Pa, cr), cr |= v;
    }
    else g !== null ? (v = g.baseLanes | s, o.memoizedState = null) : v = s, We(Pa, cr), cr |= v;
    return Vt(i, o, m, s), o.child;
  }
  function i0(i, o) {
    var s = o.ref;
    (i === null && s !== null || i !== null && i.ref !== s) && (o.flags |= 512, o.flags |= 2097152);
  }
  function $d(i, o, s, v, m) {
    var g = Qt(s) ? pi : Dt.current;
    return g = ha(o, g), ba(o, m), s = Ed(i, o, s, v, g, m), v = kd(), i !== null && !Zt ? (o.updateQueue = i.updateQueue, o.flags &= -2053, i.lanes &= ~m, mn(i, o, m)) : (Ge && v && sd(o), o.flags |= 1, Vt(i, o, s, m), o.child);
  }
  function a0(i, o, s, v, m) {
    if (Qt(s)) {
      var g = !0;
      Pu(o);
    } else g = !1;
    if (ba(o, m), o.stateNode === null) Wu(i, o), Gg(o, s, v), Md(o, s, v, m), v = !0;
    else if (i === null) {
      var P = o.stateNode, j = o.memoizedProps;
      P.props = j;
      var M = P.context, B = s.contextType;
      typeof B == "object" && B !== null ? B = yr(B) : (B = Qt(s) ? pi : Dt.current, B = ha(o, B));
      var X = s.getDerivedStateFromProps, Q = typeof X == "function" || typeof P.getSnapshotBeforeUpdate == "function";
      Q || typeof P.UNSAFE_componentWillReceiveProps != "function" && typeof P.componentWillReceiveProps != "function" || (j !== v || M !== B) && Yg(o, P, v, B), Kn = !1;
      var q = o.memoizedState;
      P.state = q, Mu(o, v, P, m), M = o.memoizedState, j !== v || q !== M || Xt.current || Kn ? (typeof X == "function" && (Td(o, s, X, v), M = o.memoizedState), (j = Kn || Vg(o, s, j, v, q, M, B)) ? (Q || typeof P.UNSAFE_componentWillMount != "function" && typeof P.componentWillMount != "function" || (typeof P.componentWillMount == "function" && P.componentWillMount(), typeof P.UNSAFE_componentWillMount == "function" && P.UNSAFE_componentWillMount()), typeof P.componentDidMount == "function" && (o.flags |= 4194308)) : (typeof P.componentDidMount == "function" && (o.flags |= 4194308), o.memoizedProps = v, o.memoizedState = M), P.props = v, P.state = M, P.context = B, v = j) : (typeof P.componentDidMount == "function" && (o.flags |= 4194308), v = !1);
    } else {
      P = o.stateNode, wg(i, o), j = o.memoizedProps, B = o.type === o.elementType ? j : Mr(o.type, j), P.props = B, Q = o.pendingProps, q = P.context, M = s.contextType, typeof M == "object" && M !== null ? M = yr(M) : (M = Qt(s) ? pi : Dt.current, M = ha(o, M));
      var oe = s.getDerivedStateFromProps;
      (X = typeof oe == "function" || typeof P.getSnapshotBeforeUpdate == "function") || typeof P.UNSAFE_componentWillReceiveProps != "function" && typeof P.componentWillReceiveProps != "function" || (j !== Q || q !== M) && Yg(o, P, v, M), Kn = !1, q = o.memoizedState, P.state = q, Mu(o, v, P, m);
      var de = o.memoizedState;
      j !== Q || q !== de || Xt.current || Kn ? (typeof oe == "function" && (Td(o, s, oe, v), de = o.memoizedState), (B = Kn || Vg(o, s, B, v, q, de, M) || !1) ? (X || typeof P.UNSAFE_componentWillUpdate != "function" && typeof P.componentWillUpdate != "function" || (typeof P.componentWillUpdate == "function" && P.componentWillUpdate(v, de, M), typeof P.UNSAFE_componentWillUpdate == "function" && P.UNSAFE_componentWillUpdate(v, de, M)), typeof P.componentDidUpdate == "function" && (o.flags |= 4), typeof P.getSnapshotBeforeUpdate == "function" && (o.flags |= 1024)) : (typeof P.componentDidUpdate != "function" || j === i.memoizedProps && q === i.memoizedState || (o.flags |= 4), typeof P.getSnapshotBeforeUpdate != "function" || j === i.memoizedProps && q === i.memoizedState || (o.flags |= 1024), o.memoizedProps = v, o.memoizedState = de), P.props = v, P.state = de, P.context = M, v = B) : (typeof P.componentDidUpdate != "function" || j === i.memoizedProps && q === i.memoizedState || (o.flags |= 4), typeof P.getSnapshotBeforeUpdate != "function" || j === i.memoizedProps && q === i.memoizedState || (o.flags |= 1024), v = !1);
    }
    return Rd(i, o, s, v, g, m);
  }
  function Rd(i, o, s, v, m, g) {
    i0(i, o);
    var P = (o.flags & 128) !== 0;
    if (!v && !P) return m && cg(o, s, !1), mn(i, o, g);
    v = o.stateNode, jI.current = o;
    var j = P && typeof s.getDerivedStateFromError != "function" ? null : v.render();
    return o.flags |= 1, i !== null && P ? (o.child = ga(o, i.child, null, g), o.child = ga(o, null, j, g)) : Vt(i, o, j, g), o.memoizedState = v.state, m && cg(o, s, !0), o.child;
  }
  function o0(i) {
    var o = i.stateNode;
    o.pendingContext ? ug(i, o.pendingContext, o.pendingContext !== o.context) : o.context && ug(i, o.context, !1), bd(i, o.containerInfo);
  }
  function l0(i, o, s, v, m) {
    return ya(), vd(m), o.flags |= 256, Vt(i, o, s, v), o.child;
  }
  var Ld = { dehydrated: null, treeContext: null, retryLane: 0 };
  function zd(i) {
    return { baseLanes: i, cachePool: null, transitions: null };
  }
  function u0(i, o, s) {
    var v = o.pendingProps, m = Xe.current, g = !1, P = (o.flags & 128) !== 0, j;
    if ((j = P) || (j = i !== null && i.memoizedState === null ? !1 : (m & 2) !== 0), j ? (g = !0, o.flags &= -129) : (i === null || i.memoizedState !== null) && (m |= 1), We(Xe, m & 1), i === null)
      return dd(o), i = o.memoizedState, i !== null && (i = i.dehydrated, i !== null) ? ((o.mode & 1) === 0 ? o.lanes = 1 : i.data === "$!" ? o.lanes = 8 : o.lanes = 1073741824, null) : (P = v.children, i = v.fallback, g ? (v = o.mode, g = o.child, P = { mode: "hidden", children: P }, (v & 1) === 0 && g !== null ? (g.childLanes = 0, g.pendingProps = P) : g = es(P, v, 0, null), i = Oi(i, v, s, null), g.return = o, i.return = o, g.sibling = i, o.child = g, o.child.memoizedState = zd(s), o.memoizedState = Ld, i) : Bd(o, P));
    if (m = i.memoizedState, m !== null && (j = m.dehydrated, j !== null)) return _I(i, o, P, v, j, m, s);
    if (g) {
      g = v.fallback, P = o.mode, m = i.child, j = m.sibling;
      var M = { mode: "hidden", children: v.children };
      return (P & 1) === 0 && o.child !== m ? (v = o.child, v.childLanes = 0, v.pendingProps = M, o.deletions = null) : (v = Qn(m, M), v.subtreeFlags = m.subtreeFlags & 14680064), j !== null ? g = Qn(j, g) : (g = Oi(g, P, s, null), g.flags |= 2), g.return = o, v.return = o, v.sibling = g, o.child = v, v = g, g = o.child, P = i.child.memoizedState, P = P === null ? zd(s) : { baseLanes: P.baseLanes | s, cachePool: null, transitions: P.transitions }, g.memoizedState = P, g.childLanes = i.childLanes & ~s, o.memoizedState = Ld, v;
    }
    return g = i.child, i = g.sibling, v = Qn(g, { mode: "visible", children: v.children }), (o.mode & 1) === 0 && (v.lanes = s), v.return = o, v.sibling = null, i !== null && (s = o.deletions, s === null ? (o.deletions = [i], o.flags |= 16) : s.push(i)), o.child = v, o.memoizedState = null, v;
  }
  function Bd(i, o) {
    return o = es({ mode: "visible", children: o }, i.mode, 0, null), o.return = i, i.child = o;
  }
  function Fu(i, o, s, v) {
    return v !== null && vd(v), ga(o, i.child, null, s), i = Bd(o, o.pendingProps.children), i.flags |= 2, o.memoizedState = null, i;
  }
  function _I(i, o, s, v, m, g, P) {
    if (s)
      return o.flags & 256 ? (o.flags &= -257, v = Nd(Error(r(422))), Fu(i, o, P, v)) : o.memoizedState !== null ? (o.child = i.child, o.flags |= 128, null) : (g = v.fallback, m = o.mode, v = es({ mode: "visible", children: v.children }, m, 0, null), g = Oi(g, m, P, null), g.flags |= 2, v.return = o, g.return = o, v.sibling = g, o.child = v, (o.mode & 1) !== 0 && ga(o, i.child, null, P), o.child.memoizedState = zd(P), o.memoizedState = Ld, g);
    if ((o.mode & 1) === 0) return Fu(i, o, P, null);
    if (m.data === "$!") {
      if (v = m.nextSibling && m.nextSibling.dataset, v) var j = v.dgst;
      return v = j, g = Error(r(419)), v = Nd(g, v, void 0), Fu(i, o, P, v);
    }
    if (j = (P & i.childLanes) !== 0, Zt || j) {
      if (v = St, v !== null) {
        switch (P & -P) {
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
        m = (m & (v.suspendedLanes | P)) !== 0 ? 0 : m, m !== 0 && m !== g.retryLane && (g.retryLane = m, hn(i, m), $r(v, i, m, -1));
      }
      return rv(), v = Nd(Error(r(421))), Fu(i, o, P, v);
    }
    return m.data === "$?" ? (o.flags |= 128, o.child = i.child, o = KI.bind(null, i), m._reactRetry = o, null) : (i = g.treeContext, sr = Bn(m.nextSibling), ur = o, Ge = !0, Tr = null, i !== null && (pr[mr++] = dn, pr[mr++] = vn, pr[mr++] = mi, dn = i.id, vn = i.overflow, mi = o), o = Bd(o, v.children), o.flags |= 4096, o);
  }
  function s0(i, o, s) {
    i.lanes |= o;
    var v = i.alternate;
    v !== null && (v.lanes |= o), yd(i.return, o, s);
  }
  function Fd(i, o, s, v, m) {
    var g = i.memoizedState;
    g === null ? i.memoizedState = { isBackwards: o, rendering: null, renderingStartTime: 0, last: v, tail: s, tailMode: m } : (g.isBackwards = o, g.rendering = null, g.renderingStartTime = 0, g.last = v, g.tail = s, g.tailMode = m);
  }
  function c0(i, o, s) {
    var v = o.pendingProps, m = v.revealOrder, g = v.tail;
    if (Vt(i, o, v.children, s), v = Xe.current, (v & 2) !== 0) v = v & 1 | 2, o.flags |= 128;
    else {
      if (i !== null && (i.flags & 128) !== 0) e: for (i = o.child; i !== null; ) {
        if (i.tag === 13) i.memoizedState !== null && s0(i, s, o);
        else if (i.tag === 19) s0(i, s, o);
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
    if (We(Xe, v), (o.mode & 1) === 0) o.memoizedState = null;
    else switch (m) {
      case "forwards":
        for (s = o.child, m = null; s !== null; ) i = s.alternate, i !== null && Nu(i) === null && (m = s), s = s.sibling;
        s = m, s === null ? (m = o.child, o.child = null) : (m = s.sibling, s.sibling = null), Fd(o, !1, m, s, g);
        break;
      case "backwards":
        for (s = null, m = o.child, o.child = null; m !== null; ) {
          if (i = m.alternate, i !== null && Nu(i) === null) {
            o.child = m;
            break;
          }
          i = m.sibling, m.sibling = s, s = m, m = i;
        }
        Fd(o, !0, s, null, g);
        break;
      case "together":
        Fd(o, !1, null, null, void 0);
        break;
      default:
        o.memoizedState = null;
    }
    return o.child;
  }
  function Wu(i, o) {
    (o.mode & 1) === 0 && i !== null && (i.alternate = null, o.alternate = null, o.flags |= 2);
  }
  function mn(i, o, s) {
    if (i !== null && (o.dependencies = i.dependencies), wi |= o.lanes, (s & o.childLanes) === 0) return null;
    if (i !== null && o.child !== i.child) throw Error(r(153));
    if (o.child !== null) {
      for (i = o.child, s = Qn(i, i.pendingProps), o.child = s, s.return = o; i.sibling !== null; ) i = i.sibling, s = s.sibling = Qn(i, i.pendingProps), s.return = o;
      s.sibling = null;
    }
    return o.child;
  }
  function TI(i, o, s) {
    switch (o.tag) {
      case 3:
        o0(o), ya();
        break;
      case 5:
        Pg(o);
        break;
      case 1:
        Qt(o.type) && Pu(o);
        break;
      case 4:
        bd(o, o.stateNode.containerInfo);
        break;
      case 10:
        var v = o.type._context, m = o.memoizedProps.value;
        We(ju, v._currentValue), v._currentValue = m;
        break;
      case 13:
        if (v = o.memoizedState, v !== null)
          return v.dehydrated !== null ? (We(Xe, Xe.current & 1), o.flags |= 128, null) : (s & o.child.childLanes) !== 0 ? u0(i, o, s) : (We(Xe, Xe.current & 1), i = mn(i, o, s), i !== null ? i.sibling : null);
        We(Xe, Xe.current & 1);
        break;
      case 19:
        if (v = (s & o.childLanes) !== 0, (i.flags & 128) !== 0) {
          if (v) return c0(i, o, s);
          o.flags |= 128;
        }
        if (m = o.memoizedState, m !== null && (m.rendering = null, m.tail = null, m.lastEffect = null), We(Xe, Xe.current), v) break;
        return null;
      case 22:
      case 23:
        return o.lanes = 0, n0(i, o, s);
    }
    return mn(i, o, s);
  }
  var f0, Wd, d0, v0;
  f0 = function(i, o) {
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
  }, Wd = function() {
  }, d0 = function(i, o, s, v) {
    var m = i.memoizedProps;
    if (m !== v) {
      i = o.stateNode, xi(Vr.current);
      var g = null;
      switch (s) {
        case "input":
          m = Te(i, m), v = Te(i, v), g = [];
          break;
        case "select":
          m = Y({}, m, { value: void 0 }), v = Y({}, v, { value: void 0 }), g = [];
          break;
        case "textarea":
          m = bf(i, m), v = bf(i, v), g = [];
          break;
        default:
          typeof m.onClick != "function" && typeof v.onClick == "function" && (i.onclick = wu);
      }
      Sf(s, v);
      var P;
      s = null;
      for (B in m) if (!v.hasOwnProperty(B) && m.hasOwnProperty(B) && m[B] != null) if (B === "style") {
        var j = m[B];
        for (P in j) j.hasOwnProperty(P) && (s || (s = {}), s[P] = "");
      } else B !== "dangerouslySetInnerHTML" && B !== "children" && B !== "suppressContentEditableWarning" && B !== "suppressHydrationWarning" && B !== "autoFocus" && (a.hasOwnProperty(B) ? g || (g = []) : (g = g || []).push(B, null));
      for (B in v) {
        var M = v[B];
        if (j = m != null ? m[B] : void 0, v.hasOwnProperty(B) && M !== j && (M != null || j != null)) if (B === "style") if (j) {
          for (P in j) !j.hasOwnProperty(P) || M && M.hasOwnProperty(P) || (s || (s = {}), s[P] = "");
          for (P in M) M.hasOwnProperty(P) && j[P] !== M[P] && (s || (s = {}), s[P] = M[P]);
        } else s || (g || (g = []), g.push(
          B,
          s
        )), s = M;
        else B === "dangerouslySetInnerHTML" ? (M = M ? M.__html : void 0, j = j ? j.__html : void 0, M != null && j !== M && (g = g || []).push(B, M)) : B === "children" ? typeof M != "string" && typeof M != "number" || (g = g || []).push(B, "" + M) : B !== "suppressContentEditableWarning" && B !== "suppressHydrationWarning" && (a.hasOwnProperty(B) ? (M != null && B === "onScroll" && Ue("scroll", i), g || j === M || (g = [])) : (g = g || []).push(B, M));
      }
      s && (g = g || []).push("style", s);
      var B = g;
      (o.updateQueue = B) && (o.flags |= 4);
    }
  }, v0 = function(i, o, s, v) {
    s !== v && (o.flags |= 4);
  };
  function Ho(i, o) {
    if (!Ge) switch (i.tailMode) {
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
  function Rt(i) {
    var o = i.alternate !== null && i.alternate.child === i.child, s = 0, v = 0;
    if (o) for (var m = i.child; m !== null; ) s |= m.lanes | m.childLanes, v |= m.subtreeFlags & 14680064, v |= m.flags & 14680064, m.return = i, m = m.sibling;
    else for (m = i.child; m !== null; ) s |= m.lanes | m.childLanes, v |= m.subtreeFlags, v |= m.flags, m.return = i, m = m.sibling;
    return i.subtreeFlags |= v, i.childLanes = s, o;
  }
  function MI(i, o, s) {
    var v = o.pendingProps;
    switch (cd(o), o.tag) {
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
        return Rt(o), null;
      case 1:
        return Qt(o.type) && Au(), Rt(o), null;
      case 3:
        return v = o.stateNode, wa(), Ke(Xt), Ke(Dt), Ad(), v.pendingContext && (v.context = v.pendingContext, v.pendingContext = null), (i === null || i.child === null) && (Cu(o) ? o.flags |= 4 : i === null || i.memoizedState.isDehydrated && (o.flags & 256) === 0 || (o.flags |= 1024, Tr !== null && (Jd(Tr), Tr = null))), Wd(i, o), Rt(o), null;
      case 5:
        wd(o);
        var m = xi(Bo.current);
        if (s = o.type, i !== null && o.stateNode != null) d0(i, o, s, v, m), i.ref !== o.ref && (o.flags |= 512, o.flags |= 2097152);
        else {
          if (!v) {
            if (o.stateNode === null) throw Error(r(166));
            return Rt(o), null;
          }
          if (i = xi(Vr.current), Cu(o)) {
            v = o.stateNode, s = o.type;
            var g = o.memoizedProps;
            switch (v[Hr] = o, v[Do] = g, i = (o.mode & 1) !== 0, s) {
              case "dialog":
                Ue("cancel", v), Ue("close", v);
                break;
              case "iframe":
              case "object":
              case "embed":
                Ue("load", v);
                break;
              case "video":
              case "audio":
                for (m = 0; m < To.length; m++) Ue(To[m], v);
                break;
              case "source":
                Ue("error", v);
                break;
              case "img":
              case "image":
              case "link":
                Ue(
                  "error",
                  v
                ), Ue("load", v);
                break;
              case "details":
                Ue("toggle", v);
                break;
              case "input":
                be(v, g), Ue("invalid", v);
                break;
              case "select":
                v._wrapperState = { wasMultiple: !!g.multiple }, Ue("invalid", v);
                break;
              case "textarea":
                Xm(v, g), Ue("invalid", v);
            }
            Sf(s, g), m = null;
            for (var P in g) if (g.hasOwnProperty(P)) {
              var j = g[P];
              P === "children" ? typeof j == "string" ? v.textContent !== j && (g.suppressHydrationWarning !== !0 && bu(v.textContent, j, i), m = ["children", j]) : typeof j == "number" && v.textContent !== "" + j && (g.suppressHydrationWarning !== !0 && bu(
                v.textContent,
                j,
                i
              ), m = ["children", "" + j]) : a.hasOwnProperty(P) && j != null && P === "onScroll" && Ue("scroll", v);
            }
            switch (s) {
              case "input":
                we(v), co(v, g, !0);
                break;
              case "textarea":
                we(v), Zm(v);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof g.onClick == "function" && (v.onclick = wu);
            }
            v = m, o.updateQueue = v, v !== null && (o.flags |= 4);
          } else {
            P = m.nodeType === 9 ? m : m.ownerDocument, i === "http://www.w3.org/1999/xhtml" && (i = Jm(s)), i === "http://www.w3.org/1999/xhtml" ? s === "script" ? (i = P.createElement("div"), i.innerHTML = "<script><\/script>", i = i.removeChild(i.firstChild)) : typeof v.is == "string" ? i = P.createElement(s, { is: v.is }) : (i = P.createElement(s), s === "select" && (P = i, v.multiple ? P.multiple = !0 : v.size && (P.size = v.size))) : i = P.createElementNS(i, s), i[Hr] = o, i[Do] = v, f0(i, o, !1, !1), o.stateNode = i;
            e: {
              switch (P = Af(s, v), s) {
                case "dialog":
                  Ue("cancel", i), Ue("close", i), m = v;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  Ue("load", i), m = v;
                  break;
                case "video":
                case "audio":
                  for (m = 0; m < To.length; m++) Ue(To[m], i);
                  m = v;
                  break;
                case "source":
                  Ue("error", i), m = v;
                  break;
                case "img":
                case "image":
                case "link":
                  Ue(
                    "error",
                    i
                  ), Ue("load", i), m = v;
                  break;
                case "details":
                  Ue("toggle", i), m = v;
                  break;
                case "input":
                  be(i, v), m = Te(i, v), Ue("invalid", i);
                  break;
                case "option":
                  m = v;
                  break;
                case "select":
                  i._wrapperState = { wasMultiple: !!v.multiple }, m = Y({}, v, { value: void 0 }), Ue("invalid", i);
                  break;
                case "textarea":
                  Xm(i, v), m = bf(i, v), Ue("invalid", i);
                  break;
                default:
                  m = v;
              }
              Sf(s, m), j = m;
              for (g in j) if (j.hasOwnProperty(g)) {
                var M = j[g];
                g === "style" ? ry(i, M) : g === "dangerouslySetInnerHTML" ? (M = M ? M.__html : void 0, M != null && ey(i, M)) : g === "children" ? typeof M == "string" ? (s !== "textarea" || M !== "") && vo(i, M) : typeof M == "number" && vo(i, "" + M) : g !== "suppressContentEditableWarning" && g !== "suppressHydrationWarning" && g !== "autoFocus" && (a.hasOwnProperty(g) ? M != null && g === "onScroll" && Ue("scroll", i) : M != null && I(i, g, M, P));
              }
              switch (s) {
                case "input":
                  we(i), co(i, v, !1);
                  break;
                case "textarea":
                  we(i), Zm(i);
                  break;
                case "option":
                  v.value != null && i.setAttribute("value", "" + Ce(v.value));
                  break;
                case "select":
                  i.multiple = !!v.multiple, g = v.value, g != null ? ra(i, !!v.multiple, g, !1) : v.defaultValue != null && ra(
                    i,
                    !!v.multiple,
                    v.defaultValue,
                    !0
                  );
                  break;
                default:
                  typeof m.onClick == "function" && (i.onclick = wu);
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
        return Rt(o), null;
      case 6:
        if (i && o.stateNode != null) v0(i, o, i.memoizedProps, v);
        else {
          if (typeof v != "string" && o.stateNode === null) throw Error(r(166));
          if (s = xi(Bo.current), xi(Vr.current), Cu(o)) {
            if (v = o.stateNode, s = o.memoizedProps, v[Hr] = o, (g = v.nodeValue !== s) && (i = ur, i !== null)) switch (i.tag) {
              case 3:
                bu(v.nodeValue, s, (i.mode & 1) !== 0);
                break;
              case 5:
                i.memoizedProps.suppressHydrationWarning !== !0 && bu(v.nodeValue, s, (i.mode & 1) !== 0);
            }
            g && (o.flags |= 4);
          } else v = (s.nodeType === 9 ? s : s.ownerDocument).createTextNode(v), v[Hr] = o, o.stateNode = v;
        }
        return Rt(o), null;
      case 13:
        if (Ke(Xe), v = o.memoizedState, i === null || i.memoizedState !== null && i.memoizedState.dehydrated !== null) {
          if (Ge && sr !== null && (o.mode & 1) !== 0 && (o.flags & 128) === 0) mg(), ya(), o.flags |= 98560, g = !1;
          else if (g = Cu(o), v !== null && v.dehydrated !== null) {
            if (i === null) {
              if (!g) throw Error(r(318));
              if (g = o.memoizedState, g = g !== null ? g.dehydrated : null, !g) throw Error(r(317));
              g[Hr] = o;
            } else ya(), (o.flags & 128) === 0 && (o.memoizedState = null), o.flags |= 4;
            Rt(o), g = !1;
          } else Tr !== null && (Jd(Tr), Tr = null), g = !0;
          if (!g) return o.flags & 65536 ? o : null;
        }
        return (o.flags & 128) !== 0 ? (o.lanes = s, o) : (v = v !== null, v !== (i !== null && i.memoizedState !== null) && v && (o.child.flags |= 8192, (o.mode & 1) !== 0 && (i === null || (Xe.current & 1) !== 0 ? ht === 0 && (ht = 3) : rv())), o.updateQueue !== null && (o.flags |= 4), Rt(o), null);
      case 4:
        return wa(), Wd(i, o), i === null && Mo(o.stateNode.containerInfo), Rt(o), null;
      case 10:
        return md(o.type._context), Rt(o), null;
      case 17:
        return Qt(o.type) && Au(), Rt(o), null;
      case 19:
        if (Ke(Xe), g = o.memoizedState, g === null) return Rt(o), null;
        if (v = (o.flags & 128) !== 0, P = g.rendering, P === null) if (v) Ho(g, !1);
        else {
          if (ht !== 0 || i !== null && (i.flags & 128) !== 0) for (i = o.child; i !== null; ) {
            if (P = Nu(i), P !== null) {
              for (o.flags |= 128, Ho(g, !1), v = P.updateQueue, v !== null && (o.updateQueue = v, o.flags |= 4), o.subtreeFlags = 0, v = s, s = o.child; s !== null; ) g = s, i = v, g.flags &= 14680066, P = g.alternate, P === null ? (g.childLanes = 0, g.lanes = i, g.child = null, g.subtreeFlags = 0, g.memoizedProps = null, g.memoizedState = null, g.updateQueue = null, g.dependencies = null, g.stateNode = null) : (g.childLanes = P.childLanes, g.lanes = P.lanes, g.child = P.child, g.subtreeFlags = 0, g.deletions = null, g.memoizedProps = P.memoizedProps, g.memoizedState = P.memoizedState, g.updateQueue = P.updateQueue, g.type = P.type, i = P.dependencies, g.dependencies = i === null ? null : { lanes: i.lanes, firstContext: i.firstContext }), s = s.sibling;
              return We(Xe, Xe.current & 1 | 2), o.child;
            }
            i = i.sibling;
          }
          g.tail !== null && lt() > Oa && (o.flags |= 128, v = !0, Ho(g, !1), o.lanes = 4194304);
        }
        else {
          if (!v) if (i = Nu(P), i !== null) {
            if (o.flags |= 128, v = !0, s = i.updateQueue, s !== null && (o.updateQueue = s, o.flags |= 4), Ho(g, !0), g.tail === null && g.tailMode === "hidden" && !P.alternate && !Ge) return Rt(o), null;
          } else 2 * lt() - g.renderingStartTime > Oa && s !== 1073741824 && (o.flags |= 128, v = !0, Ho(g, !1), o.lanes = 4194304);
          g.isBackwards ? (P.sibling = o.child, o.child = P) : (s = g.last, s !== null ? s.sibling = P : o.child = P, g.last = P);
        }
        return g.tail !== null ? (o = g.tail, g.rendering = o, g.tail = o.sibling, g.renderingStartTime = lt(), o.sibling = null, s = Xe.current, We(Xe, v ? s & 1 | 2 : s & 1), o) : (Rt(o), null);
      case 22:
      case 23:
        return tv(), v = o.memoizedState !== null, i !== null && i.memoizedState !== null !== v && (o.flags |= 8192), v && (o.mode & 1) !== 0 ? (cr & 1073741824) !== 0 && (Rt(o), o.subtreeFlags & 6 && (o.flags |= 8192)) : Rt(o), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(r(156, o.tag));
  }
  function NI(i, o) {
    switch (cd(o), o.tag) {
      case 1:
        return Qt(o.type) && Au(), i = o.flags, i & 65536 ? (o.flags = i & -65537 | 128, o) : null;
      case 3:
        return wa(), Ke(Xt), Ke(Dt), Ad(), i = o.flags, (i & 65536) !== 0 && (i & 128) === 0 ? (o.flags = i & -65537 | 128, o) : null;
      case 5:
        return wd(o), null;
      case 13:
        if (Ke(Xe), i = o.memoizedState, i !== null && i.dehydrated !== null) {
          if (o.alternate === null) throw Error(r(340));
          ya();
        }
        return i = o.flags, i & 65536 ? (o.flags = i & -65537 | 128, o) : null;
      case 19:
        return Ke(Xe), null;
      case 4:
        return wa(), null;
      case 10:
        return md(o.type._context), null;
      case 22:
      case 23:
        return tv(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var Uu = !1, Lt = !1, DI = typeof WeakSet == "function" ? WeakSet : Set, ue = null;
  function Aa(i, o) {
    var s = i.ref;
    if (s !== null) if (typeof s == "function") try {
      s(null);
    } catch (v) {
      tt(i, o, v);
    }
    else s.current = null;
  }
  function Ud(i, o, s) {
    try {
      s();
    } catch (v) {
      tt(i, o, v);
    }
  }
  var h0 = !1;
  function $I(i, o) {
    if (td = su, i = Vy(), Gf(i)) {
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
          var P = 0, j = -1, M = -1, B = 0, X = 0, Q = i, q = null;
          t: for (; ; ) {
            for (var oe; Q !== s || m !== 0 && Q.nodeType !== 3 || (j = P + m), Q !== g || v !== 0 && Q.nodeType !== 3 || (M = P + v), Q.nodeType === 3 && (P += Q.nodeValue.length), (oe = Q.firstChild) !== null; )
              q = Q, Q = oe;
            for (; ; ) {
              if (Q === i) break t;
              if (q === s && ++B === m && (j = P), q === g && ++X === v && (M = P), (oe = Q.nextSibling) !== null) break;
              Q = q, q = Q.parentNode;
            }
            Q = oe;
          }
          s = j === -1 || M === -1 ? null : { start: j, end: M };
        } else s = null;
      }
      s = s || { start: 0, end: 0 };
    } else s = null;
    for (rd = { focusedElem: i, selectionRange: s }, su = !1, ue = o; ue !== null; ) if (o = ue, i = o.child, (o.subtreeFlags & 1028) !== 0 && i !== null) i.return = o, ue = i;
    else for (; ue !== null; ) {
      o = ue;
      try {
        var de = o.alternate;
        if ((o.flags & 1024) !== 0) switch (o.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (de !== null) {
              var he = de.memoizedProps, ut = de.memoizedState, L = o.stateNode, N = L.getSnapshotBeforeUpdate(o.elementType === o.type ? he : Mr(o.type, he), ut);
              L.__reactInternalSnapshotBeforeUpdate = N;
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
      } catch (ee) {
        tt(o, o.return, ee);
      }
      if (i = o.sibling, i !== null) {
        i.return = o.return, ue = i;
        break;
      }
      ue = o.return;
    }
    return de = h0, h0 = !1, de;
  }
  function Vo(i, o, s) {
    var v = o.updateQueue;
    if (v = v !== null ? v.lastEffect : null, v !== null) {
      var m = v = v.next;
      do {
        if ((m.tag & i) === i) {
          var g = m.destroy;
          m.destroy = void 0, g !== void 0 && Ud(o, s, g);
        }
        m = m.next;
      } while (m !== v);
    }
  }
  function Ku(i, o) {
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
  function Kd(i) {
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
  function p0(i) {
    var o = i.alternate;
    o !== null && (i.alternate = null, p0(o)), i.child = null, i.deletions = null, i.sibling = null, i.tag === 5 && (o = i.stateNode, o !== null && (delete o[Hr], delete o[Do], delete o[od], delete o[gI], delete o[xI])), i.stateNode = null, i.return = null, i.dependencies = null, i.memoizedProps = null, i.memoizedState = null, i.pendingProps = null, i.stateNode = null, i.updateQueue = null;
  }
  function m0(i) {
    return i.tag === 5 || i.tag === 3 || i.tag === 4;
  }
  function y0(i) {
    e: for (; ; ) {
      for (; i.sibling === null; ) {
        if (i.return === null || m0(i.return)) return null;
        i = i.return;
      }
      for (i.sibling.return = i.return, i = i.sibling; i.tag !== 5 && i.tag !== 6 && i.tag !== 18; ) {
        if (i.flags & 2 || i.child === null || i.tag === 4) continue e;
        i.child.return = i, i = i.child;
      }
      if (!(i.flags & 2)) return i.stateNode;
    }
  }
  function Hd(i, o, s) {
    var v = i.tag;
    if (v === 5 || v === 6) i = i.stateNode, o ? s.nodeType === 8 ? s.parentNode.insertBefore(i, o) : s.insertBefore(i, o) : (s.nodeType === 8 ? (o = s.parentNode, o.insertBefore(i, s)) : (o = s, o.appendChild(i)), s = s._reactRootContainer, s != null || o.onclick !== null || (o.onclick = wu));
    else if (v !== 4 && (i = i.child, i !== null)) for (Hd(i, o, s), i = i.sibling; i !== null; ) Hd(i, o, s), i = i.sibling;
  }
  function Vd(i, o, s) {
    var v = i.tag;
    if (v === 5 || v === 6) i = i.stateNode, o ? s.insertBefore(i, o) : s.appendChild(i);
    else if (v !== 4 && (i = i.child, i !== null)) for (Vd(i, o, s), i = i.sibling; i !== null; ) Vd(i, o, s), i = i.sibling;
  }
  var Ct = null, Nr = !1;
  function Vn(i, o, s) {
    for (s = s.child; s !== null; ) g0(i, o, s), s = s.sibling;
  }
  function g0(i, o, s) {
    if (Kr && typeof Kr.onCommitFiberUnmount == "function") try {
      Kr.onCommitFiberUnmount(nu, s);
    } catch {
    }
    switch (s.tag) {
      case 5:
        Lt || Aa(s, o);
      case 6:
        var v = Ct, m = Nr;
        Ct = null, Vn(i, o, s), Ct = v, Nr = m, Ct !== null && (Nr ? (i = Ct, s = s.stateNode, i.nodeType === 8 ? i.parentNode.removeChild(s) : i.removeChild(s)) : Ct.removeChild(s.stateNode));
        break;
      case 18:
        Ct !== null && (Nr ? (i = Ct, s = s.stateNode, i.nodeType === 8 ? ad(i.parentNode, s) : i.nodeType === 1 && ad(i, s), Po(i)) : ad(Ct, s.stateNode));
        break;
      case 4:
        v = Ct, m = Nr, Ct = s.stateNode.containerInfo, Nr = !0, Vn(i, o, s), Ct = v, Nr = m;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!Lt && (v = s.updateQueue, v !== null && (v = v.lastEffect, v !== null))) {
          m = v = v.next;
          do {
            var g = m, P = g.destroy;
            g = g.tag, P !== void 0 && ((g & 2) !== 0 || (g & 4) !== 0) && Ud(s, o, P), m = m.next;
          } while (m !== v);
        }
        Vn(i, o, s);
        break;
      case 1:
        if (!Lt && (Aa(s, o), v = s.stateNode, typeof v.componentWillUnmount == "function")) try {
          v.props = s.memoizedProps, v.state = s.memoizedState, v.componentWillUnmount();
        } catch (j) {
          tt(s, o, j);
        }
        Vn(i, o, s);
        break;
      case 21:
        Vn(i, o, s);
        break;
      case 22:
        s.mode & 1 ? (Lt = (v = Lt) || s.memoizedState !== null, Vn(i, o, s), Lt = v) : Vn(i, o, s);
        break;
      default:
        Vn(i, o, s);
    }
  }
  function x0(i) {
    var o = i.updateQueue;
    if (o !== null) {
      i.updateQueue = null;
      var s = i.stateNode;
      s === null && (s = i.stateNode = new DI()), o.forEach(function(v) {
        var m = HI.bind(null, i, v);
        s.has(v) || (s.add(v), v.then(m, m));
      });
    }
  }
  function Dr(i, o) {
    var s = o.deletions;
    if (s !== null) for (var v = 0; v < s.length; v++) {
      var m = s[v];
      try {
        var g = i, P = o, j = P;
        e: for (; j !== null; ) {
          switch (j.tag) {
            case 5:
              Ct = j.stateNode, Nr = !1;
              break e;
            case 3:
              Ct = j.stateNode.containerInfo, Nr = !0;
              break e;
            case 4:
              Ct = j.stateNode.containerInfo, Nr = !0;
              break e;
          }
          j = j.return;
        }
        if (Ct === null) throw Error(r(160));
        g0(g, P, m), Ct = null, Nr = !1;
        var M = m.alternate;
        M !== null && (M.return = null), m.return = null;
      } catch (B) {
        tt(m, o, B);
      }
    }
    if (o.subtreeFlags & 12854) for (o = o.child; o !== null; ) b0(o, i), o = o.sibling;
  }
  function b0(i, o) {
    var s = i.alternate, v = i.flags;
    switch (i.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (Dr(o, i), Yr(i), v & 4) {
          try {
            Vo(3, i, i.return), Ku(3, i);
          } catch (he) {
            tt(i, i.return, he);
          }
          try {
            Vo(5, i, i.return);
          } catch (he) {
            tt(i, i.return, he);
          }
        }
        break;
      case 1:
        Dr(o, i), Yr(i), v & 512 && s !== null && Aa(s, s.return);
        break;
      case 5:
        if (Dr(o, i), Yr(i), v & 512 && s !== null && Aa(s, s.return), i.flags & 32) {
          var m = i.stateNode;
          try {
            vo(m, "");
          } catch (he) {
            tt(i, i.return, he);
          }
        }
        if (v & 4 && (m = i.stateNode, m != null)) {
          var g = i.memoizedProps, P = s !== null ? s.memoizedProps : g, j = i.type, M = i.updateQueue;
          if (i.updateQueue = null, M !== null) try {
            j === "input" && g.type === "radio" && g.name != null && Nt(m, g), Af(j, P);
            var B = Af(j, g);
            for (P = 0; P < M.length; P += 2) {
              var X = M[P], Q = M[P + 1];
              X === "style" ? ry(m, Q) : X === "dangerouslySetInnerHTML" ? ey(m, Q) : X === "children" ? vo(m, Q) : I(m, X, Q, B);
            }
            switch (j) {
              case "input":
                Ir(m, g);
                break;
              case "textarea":
                Qm(m, g);
                break;
              case "select":
                var q = m._wrapperState.wasMultiple;
                m._wrapperState.wasMultiple = !!g.multiple;
                var oe = g.value;
                oe != null ? ra(m, !!g.multiple, oe, !1) : q !== !!g.multiple && (g.defaultValue != null ? ra(
                  m,
                  !!g.multiple,
                  g.defaultValue,
                  !0
                ) : ra(m, !!g.multiple, g.multiple ? [] : "", !1));
            }
            m[Do] = g;
          } catch (he) {
            tt(i, i.return, he);
          }
        }
        break;
      case 6:
        if (Dr(o, i), Yr(i), v & 4) {
          if (i.stateNode === null) throw Error(r(162));
          m = i.stateNode, g = i.memoizedProps;
          try {
            m.nodeValue = g;
          } catch (he) {
            tt(i, i.return, he);
          }
        }
        break;
      case 3:
        if (Dr(o, i), Yr(i), v & 4 && s !== null && s.memoizedState.isDehydrated) try {
          Po(o.containerInfo);
        } catch (he) {
          tt(i, i.return, he);
        }
        break;
      case 4:
        Dr(o, i), Yr(i);
        break;
      case 13:
        Dr(o, i), Yr(i), m = i.child, m.flags & 8192 && (g = m.memoizedState !== null, m.stateNode.isHidden = g, !g || m.alternate !== null && m.alternate.memoizedState !== null || (qd = lt())), v & 4 && x0(i);
        break;
      case 22:
        if (X = s !== null && s.memoizedState !== null, i.mode & 1 ? (Lt = (B = Lt) || X, Dr(o, i), Lt = B) : Dr(o, i), Yr(i), v & 8192) {
          if (B = i.memoizedState !== null, (i.stateNode.isHidden = B) && !X && (i.mode & 1) !== 0) for (ue = i, X = i.child; X !== null; ) {
            for (Q = ue = X; ue !== null; ) {
              switch (q = ue, oe = q.child, q.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  Vo(4, q, q.return);
                  break;
                case 1:
                  Aa(q, q.return);
                  var de = q.stateNode;
                  if (typeof de.componentWillUnmount == "function") {
                    v = q, s = q.return;
                    try {
                      o = v, de.props = o.memoizedProps, de.state = o.memoizedState, de.componentWillUnmount();
                    } catch (he) {
                      tt(v, s, he);
                    }
                  }
                  break;
                case 5:
                  Aa(q, q.return);
                  break;
                case 22:
                  if (q.memoizedState !== null) {
                    A0(Q);
                    continue;
                  }
              }
              oe !== null ? (oe.return = q, ue = oe) : A0(Q);
            }
            X = X.sibling;
          }
          e: for (X = null, Q = i; ; ) {
            if (Q.tag === 5) {
              if (X === null) {
                X = Q;
                try {
                  m = Q.stateNode, B ? (g = m.style, typeof g.setProperty == "function" ? g.setProperty("display", "none", "important") : g.display = "none") : (j = Q.stateNode, M = Q.memoizedProps.style, P = M != null && M.hasOwnProperty("display") ? M.display : null, j.style.display = ty("display", P));
                } catch (he) {
                  tt(i, i.return, he);
                }
              }
            } else if (Q.tag === 6) {
              if (X === null) try {
                Q.stateNode.nodeValue = B ? "" : Q.memoizedProps;
              } catch (he) {
                tt(i, i.return, he);
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
        Dr(o, i), Yr(i), v & 4 && x0(i);
        break;
      case 21:
        break;
      default:
        Dr(
          o,
          i
        ), Yr(i);
    }
  }
  function Yr(i) {
    var o = i.flags;
    if (o & 2) {
      try {
        e: {
          for (var s = i.return; s !== null; ) {
            if (m0(s)) {
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
            v.flags & 32 && (vo(m, ""), v.flags &= -33);
            var g = y0(i);
            Vd(i, g, m);
            break;
          case 3:
          case 4:
            var P = v.stateNode.containerInfo, j = y0(i);
            Hd(i, j, P);
            break;
          default:
            throw Error(r(161));
        }
      } catch (M) {
        tt(i, i.return, M);
      }
      i.flags &= -3;
    }
    o & 4096 && (i.flags &= -4097);
  }
  function RI(i, o, s) {
    ue = i, w0(i);
  }
  function w0(i, o, s) {
    for (var v = (i.mode & 1) !== 0; ue !== null; ) {
      var m = ue, g = m.child;
      if (m.tag === 22 && v) {
        var P = m.memoizedState !== null || Uu;
        if (!P) {
          var j = m.alternate, M = j !== null && j.memoizedState !== null || Lt;
          j = Uu;
          var B = Lt;
          if (Uu = P, (Lt = M) && !B) for (ue = m; ue !== null; ) P = ue, M = P.child, P.tag === 22 && P.memoizedState !== null ? P0(m) : M !== null ? (M.return = P, ue = M) : P0(m);
          for (; g !== null; ) ue = g, w0(g), g = g.sibling;
          ue = m, Uu = j, Lt = B;
        }
        S0(i);
      } else (m.subtreeFlags & 8772) !== 0 && g !== null ? (g.return = m, ue = g) : S0(i);
    }
  }
  function S0(i) {
    for (; ue !== null; ) {
      var o = ue;
      if ((o.flags & 8772) !== 0) {
        var s = o.alternate;
        try {
          if ((o.flags & 8772) !== 0) switch (o.tag) {
            case 0:
            case 11:
            case 15:
              Lt || Ku(5, o);
              break;
            case 1:
              var v = o.stateNode;
              if (o.flags & 4 && !Lt) if (s === null) v.componentDidMount();
              else {
                var m = o.elementType === o.type ? s.memoizedProps : Mr(o.type, s.memoizedProps);
                v.componentDidUpdate(m, s.memoizedState, v.__reactInternalSnapshotBeforeUpdate);
              }
              var g = o.updateQueue;
              g !== null && Ag(o, g, v);
              break;
            case 3:
              var P = o.updateQueue;
              if (P !== null) {
                if (s = null, o.child !== null) switch (o.child.tag) {
                  case 5:
                    s = o.child.stateNode;
                    break;
                  case 1:
                    s = o.child.stateNode;
                }
                Ag(o, P, s);
              }
              break;
            case 5:
              var j = o.stateNode;
              if (s === null && o.flags & 4) {
                s = j;
                var M = o.memoizedProps;
                switch (o.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    M.autoFocus && s.focus();
                    break;
                  case "img":
                    M.src && (s.src = M.src);
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
                    Q !== null && Po(Q);
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
          Lt || o.flags & 512 && Kd(o);
        } catch (q) {
          tt(o, o.return, q);
        }
      }
      if (o === i) {
        ue = null;
        break;
      }
      if (s = o.sibling, s !== null) {
        s.return = o.return, ue = s;
        break;
      }
      ue = o.return;
    }
  }
  function A0(i) {
    for (; ue !== null; ) {
      var o = ue;
      if (o === i) {
        ue = null;
        break;
      }
      var s = o.sibling;
      if (s !== null) {
        s.return = o.return, ue = s;
        break;
      }
      ue = o.return;
    }
  }
  function P0(i) {
    for (; ue !== null; ) {
      var o = ue;
      try {
        switch (o.tag) {
          case 0:
          case 11:
          case 15:
            var s = o.return;
            try {
              Ku(4, o);
            } catch (M) {
              tt(o, s, M);
            }
            break;
          case 1:
            var v = o.stateNode;
            if (typeof v.componentDidMount == "function") {
              var m = o.return;
              try {
                v.componentDidMount();
              } catch (M) {
                tt(o, m, M);
              }
            }
            var g = o.return;
            try {
              Kd(o);
            } catch (M) {
              tt(o, g, M);
            }
            break;
          case 5:
            var P = o.return;
            try {
              Kd(o);
            } catch (M) {
              tt(o, P, M);
            }
        }
      } catch (M) {
        tt(o, o.return, M);
      }
      if (o === i) {
        ue = null;
        break;
      }
      var j = o.sibling;
      if (j !== null) {
        j.return = o.return, ue = j;
        break;
      }
      ue = o.return;
    }
  }
  var LI = Math.ceil, Hu = k.ReactCurrentDispatcher, Gd = k.ReactCurrentOwner, xr = k.ReactCurrentBatchConfig, je = 0, St = null, st = null, It = 0, cr = 0, Pa = Fn(0), ht = 0, Go = null, wi = 0, Vu = 0, Yd = 0, Yo = null, Jt = null, qd = 0, Oa = 1 / 0, yn = null, Gu = !1, Xd = null, Gn = null, Yu = !1, Yn = null, qu = 0, qo = 0, Qd = null, Xu = -1, Qu = 0;
  function Gt() {
    return (je & 6) !== 0 ? lt() : Xu !== -1 ? Xu : Xu = lt();
  }
  function qn(i) {
    return (i.mode & 1) === 0 ? 1 : (je & 2) !== 0 && It !== 0 ? It & -It : wI.transition !== null ? (Qu === 0 && (Qu = yy()), Qu) : (i = Le, i !== 0 || (i = window.event, i = i === void 0 ? 16 : Ey(i.type)), i);
  }
  function $r(i, o, s, v) {
    if (50 < qo) throw qo = 0, Qd = null, Error(r(185));
    xo(i, s, v), ((je & 2) === 0 || i !== St) && (i === St && ((je & 2) === 0 && (Vu |= s), ht === 4 && Xn(i, It)), er(i, v), s === 1 && je === 0 && (o.mode & 1) === 0 && (Oa = lt() + 500, Ou && Un()));
  }
  function er(i, o) {
    var s = i.callbackNode;
    wC(i, o);
    var v = ou(i, i === St ? It : 0);
    if (v === 0) s !== null && hy(s), i.callbackNode = null, i.callbackPriority = 0;
    else if (o = v & -v, i.callbackPriority !== o) {
      if (s != null && hy(s), o === 1) i.tag === 0 ? bI(E0.bind(null, i)) : fg(E0.bind(null, i)), mI(function() {
        (je & 6) === 0 && Un();
      }), s = null;
      else {
        switch (gy(v)) {
          case 1:
            s = jf;
            break;
          case 4:
            s = py;
            break;
          case 16:
            s = ru;
            break;
          case 536870912:
            s = my;
            break;
          default:
            s = ru;
        }
        s = N0(s, O0.bind(null, i));
      }
      i.callbackPriority = o, i.callbackNode = s;
    }
  }
  function O0(i, o) {
    if (Xu = -1, Qu = 0, (je & 6) !== 0) throw Error(r(327));
    var s = i.callbackNode;
    if (Ea() && i.callbackNode !== s) return null;
    var v = ou(i, i === St ? It : 0);
    if (v === 0) return null;
    if ((v & 30) !== 0 || (v & i.expiredLanes) !== 0 || o) o = Zu(i, v);
    else {
      o = v;
      var m = je;
      je |= 2;
      var g = C0();
      (St !== i || It !== o) && (yn = null, Oa = lt() + 500, Ai(i, o));
      do
        try {
          FI();
          break;
        } catch (j) {
          k0(i, j);
        }
      while (!0);
      pd(), Hu.current = g, je = m, st !== null ? o = 0 : (St = null, It = 0, o = ht);
    }
    if (o !== 0) {
      if (o === 2 && (m = _f(i), m !== 0 && (v = m, o = Zd(i, m))), o === 1) throw s = Go, Ai(i, 0), Xn(i, v), er(i, lt()), s;
      if (o === 6) Xn(i, v);
      else {
        if (m = i.current.alternate, (v & 30) === 0 && !zI(m) && (o = Zu(i, v), o === 2 && (g = _f(i), g !== 0 && (v = g, o = Zd(i, g))), o === 1)) throw s = Go, Ai(i, 0), Xn(i, v), er(i, lt()), s;
        switch (i.finishedWork = m, i.finishedLanes = v, o) {
          case 0:
          case 1:
            throw Error(r(345));
          case 2:
            Pi(i, Jt, yn);
            break;
          case 3:
            if (Xn(i, v), (v & 130023424) === v && (o = qd + 500 - lt(), 10 < o)) {
              if (ou(i, 0) !== 0) break;
              if (m = i.suspendedLanes, (m & v) !== v) {
                Gt(), i.pingedLanes |= i.suspendedLanes & m;
                break;
              }
              i.timeoutHandle = id(Pi.bind(null, i, Jt, yn), o);
              break;
            }
            Pi(i, Jt, yn);
            break;
          case 4:
            if (Xn(i, v), (v & 4194240) === v) break;
            for (o = i.eventTimes, m = -1; 0 < v; ) {
              var P = 31 - jr(v);
              g = 1 << P, P = o[P], P > m && (m = P), v &= ~g;
            }
            if (v = m, v = lt() - v, v = (120 > v ? 120 : 480 > v ? 480 : 1080 > v ? 1080 : 1920 > v ? 1920 : 3e3 > v ? 3e3 : 4320 > v ? 4320 : 1960 * LI(v / 1960)) - v, 10 < v) {
              i.timeoutHandle = id(Pi.bind(null, i, Jt, yn), v);
              break;
            }
            Pi(i, Jt, yn);
            break;
          case 5:
            Pi(i, Jt, yn);
            break;
          default:
            throw Error(r(329));
        }
      }
    }
    return er(i, lt()), i.callbackNode === s ? O0.bind(null, i) : null;
  }
  function Zd(i, o) {
    var s = Yo;
    return i.current.memoizedState.isDehydrated && (Ai(i, o).flags |= 256), i = Zu(i, o), i !== 2 && (o = Jt, Jt = s, o !== null && Jd(o)), i;
  }
  function Jd(i) {
    Jt === null ? Jt = i : Jt.push.apply(Jt, i);
  }
  function zI(i) {
    for (var o = i; ; ) {
      if (o.flags & 16384) {
        var s = o.updateQueue;
        if (s !== null && (s = s.stores, s !== null)) for (var v = 0; v < s.length; v++) {
          var m = s[v], g = m.getSnapshot;
          m = m.value;
          try {
            if (!_r(g(), m)) return !1;
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
  function Xn(i, o) {
    for (o &= ~Yd, o &= ~Vu, i.suspendedLanes |= o, i.pingedLanes &= ~o, i = i.expirationTimes; 0 < o; ) {
      var s = 31 - jr(o), v = 1 << s;
      i[s] = -1, o &= ~v;
    }
  }
  function E0(i) {
    if ((je & 6) !== 0) throw Error(r(327));
    Ea();
    var o = ou(i, 0);
    if ((o & 1) === 0) return er(i, lt()), null;
    var s = Zu(i, o);
    if (i.tag !== 0 && s === 2) {
      var v = _f(i);
      v !== 0 && (o = v, s = Zd(i, v));
    }
    if (s === 1) throw s = Go, Ai(i, 0), Xn(i, o), er(i, lt()), s;
    if (s === 6) throw Error(r(345));
    return i.finishedWork = i.current.alternate, i.finishedLanes = o, Pi(i, Jt, yn), er(i, lt()), null;
  }
  function ev(i, o) {
    var s = je;
    je |= 1;
    try {
      return i(o);
    } finally {
      je = s, je === 0 && (Oa = lt() + 500, Ou && Un());
    }
  }
  function Si(i) {
    Yn !== null && Yn.tag === 0 && (je & 6) === 0 && Ea();
    var o = je;
    je |= 1;
    var s = xr.transition, v = Le;
    try {
      if (xr.transition = null, Le = 1, i) return i();
    } finally {
      Le = v, xr.transition = s, je = o, (je & 6) === 0 && Un();
    }
  }
  function tv() {
    cr = Pa.current, Ke(Pa);
  }
  function Ai(i, o) {
    i.finishedWork = null, i.finishedLanes = 0;
    var s = i.timeoutHandle;
    if (s !== -1 && (i.timeoutHandle = -1, pI(s)), st !== null) for (s = st.return; s !== null; ) {
      var v = s;
      switch (cd(v), v.tag) {
        case 1:
          v = v.type.childContextTypes, v != null && Au();
          break;
        case 3:
          wa(), Ke(Xt), Ke(Dt), Ad();
          break;
        case 5:
          wd(v);
          break;
        case 4:
          wa();
          break;
        case 13:
          Ke(Xe);
          break;
        case 19:
          Ke(Xe);
          break;
        case 10:
          md(v.type._context);
          break;
        case 22:
        case 23:
          tv();
      }
      s = s.return;
    }
    if (St = i, st = i = Qn(i.current, null), It = cr = o, ht = 0, Go = null, Yd = Vu = wi = 0, Jt = Yo = null, gi !== null) {
      for (o = 0; o < gi.length; o++) if (s = gi[o], v = s.interleaved, v !== null) {
        s.interleaved = null;
        var m = v.next, g = s.pending;
        if (g !== null) {
          var P = g.next;
          g.next = m, v.next = P;
        }
        s.pending = v;
      }
      gi = null;
    }
    return i;
  }
  function k0(i, o) {
    do {
      var s = st;
      try {
        if (pd(), Du.current = zu, $u) {
          for (var v = Qe.memoizedState; v !== null; ) {
            var m = v.queue;
            m !== null && (m.pending = null), v = v.next;
          }
          $u = !1;
        }
        if (bi = 0, wt = vt = Qe = null, Fo = !1, Wo = 0, Gd.current = null, s === null || s.return === null) {
          ht = 1, Go = o, st = null;
          break;
        }
        e: {
          var g = i, P = s.return, j = s, M = o;
          if (o = It, j.flags |= 32768, M !== null && typeof M == "object" && typeof M.then == "function") {
            var B = M, X = j, Q = X.tag;
            if ((X.mode & 1) === 0 && (Q === 0 || Q === 11 || Q === 15)) {
              var q = X.alternate;
              q ? (X.updateQueue = q.updateQueue, X.memoizedState = q.memoizedState, X.lanes = q.lanes) : (X.updateQueue = null, X.memoizedState = null);
            }
            var oe = Zg(P);
            if (oe !== null) {
              oe.flags &= -257, Jg(oe, P, j, g, o), oe.mode & 1 && Qg(g, B, o), o = oe, M = B;
              var de = o.updateQueue;
              if (de === null) {
                var he = /* @__PURE__ */ new Set();
                he.add(M), o.updateQueue = he;
              } else de.add(M);
              break e;
            } else {
              if ((o & 1) === 0) {
                Qg(g, B, o), rv();
                break e;
              }
              M = Error(r(426));
            }
          } else if (Ge && j.mode & 1) {
            var ut = Zg(P);
            if (ut !== null) {
              (ut.flags & 65536) === 0 && (ut.flags |= 256), Jg(ut, P, j, g, o), vd(Sa(M, j));
              break e;
            }
          }
          g = M = Sa(M, j), ht !== 4 && (ht = 2), Yo === null ? Yo = [g] : Yo.push(g), g = P;
          do {
            switch (g.tag) {
              case 3:
                g.flags |= 65536, o &= -o, g.lanes |= o;
                var L = qg(g, M, o);
                Sg(g, L);
                break e;
              case 1:
                j = M;
                var N = g.type, z = g.stateNode;
                if ((g.flags & 128) === 0 && (typeof N.getDerivedStateFromError == "function" || z !== null && typeof z.componentDidCatch == "function" && (Gn === null || !Gn.has(z)))) {
                  g.flags |= 65536, o &= -o, g.lanes |= o;
                  var ee = Xg(g, j, o);
                  Sg(g, ee);
                  break e;
                }
            }
            g = g.return;
          } while (g !== null);
        }
        j0(s);
      } catch (pe) {
        o = pe, st === s && s !== null && (st = s = s.return);
        continue;
      }
      break;
    } while (!0);
  }
  function C0() {
    var i = Hu.current;
    return Hu.current = zu, i === null ? zu : i;
  }
  function rv() {
    (ht === 0 || ht === 3 || ht === 2) && (ht = 4), St === null || (wi & 268435455) === 0 && (Vu & 268435455) === 0 || Xn(St, It);
  }
  function Zu(i, o) {
    var s = je;
    je |= 2;
    var v = C0();
    (St !== i || It !== o) && (yn = null, Ai(i, o));
    do
      try {
        BI();
        break;
      } catch (m) {
        k0(i, m);
      }
    while (!0);
    if (pd(), je = s, Hu.current = v, st !== null) throw Error(r(261));
    return St = null, It = 0, ht;
  }
  function BI() {
    for (; st !== null; ) I0(st);
  }
  function FI() {
    for (; st !== null && !dC(); ) I0(st);
  }
  function I0(i) {
    var o = M0(i.alternate, i, cr);
    i.memoizedProps = i.pendingProps, o === null ? j0(i) : st = o, Gd.current = null;
  }
  function j0(i) {
    var o = i;
    do {
      var s = o.alternate;
      if (i = o.return, (o.flags & 32768) === 0) {
        if (s = MI(s, o, cr), s !== null) {
          st = s;
          return;
        }
      } else {
        if (s = NI(s, o), s !== null) {
          s.flags &= 32767, st = s;
          return;
        }
        if (i !== null) i.flags |= 32768, i.subtreeFlags = 0, i.deletions = null;
        else {
          ht = 6, st = null;
          return;
        }
      }
      if (o = o.sibling, o !== null) {
        st = o;
        return;
      }
      st = o = i;
    } while (o !== null);
    ht === 0 && (ht = 5);
  }
  function Pi(i, o, s) {
    var v = Le, m = xr.transition;
    try {
      xr.transition = null, Le = 1, WI(i, o, s, v);
    } finally {
      xr.transition = m, Le = v;
    }
    return null;
  }
  function WI(i, o, s, v) {
    do
      Ea();
    while (Yn !== null);
    if ((je & 6) !== 0) throw Error(r(327));
    s = i.finishedWork;
    var m = i.finishedLanes;
    if (s === null) return null;
    if (i.finishedWork = null, i.finishedLanes = 0, s === i.current) throw Error(r(177));
    i.callbackNode = null, i.callbackPriority = 0;
    var g = s.lanes | s.childLanes;
    if (SC(i, g), i === St && (st = St = null, It = 0), (s.subtreeFlags & 2064) === 0 && (s.flags & 2064) === 0 || Yu || (Yu = !0, N0(ru, function() {
      return Ea(), null;
    })), g = (s.flags & 15990) !== 0, (s.subtreeFlags & 15990) !== 0 || g) {
      g = xr.transition, xr.transition = null;
      var P = Le;
      Le = 1;
      var j = je;
      je |= 4, Gd.current = null, $I(i, s), b0(s, i), uI(rd), su = !!td, rd = td = null, i.current = s, RI(s), vC(), je = j, Le = P, xr.transition = g;
    } else i.current = s;
    if (Yu && (Yu = !1, Yn = i, qu = m), g = i.pendingLanes, g === 0 && (Gn = null), mC(s.stateNode), er(i, lt()), o !== null) for (v = i.onRecoverableError, s = 0; s < o.length; s++) m = o[s], v(m.value, { componentStack: m.stack, digest: m.digest });
    if (Gu) throw Gu = !1, i = Xd, Xd = null, i;
    return (qu & 1) !== 0 && i.tag !== 0 && Ea(), g = i.pendingLanes, (g & 1) !== 0 ? i === Qd ? qo++ : (qo = 0, Qd = i) : qo = 0, Un(), null;
  }
  function Ea() {
    if (Yn !== null) {
      var i = gy(qu), o = xr.transition, s = Le;
      try {
        if (xr.transition = null, Le = 16 > i ? 16 : i, Yn === null) var v = !1;
        else {
          if (i = Yn, Yn = null, qu = 0, (je & 6) !== 0) throw Error(r(331));
          var m = je;
          for (je |= 4, ue = i.current; ue !== null; ) {
            var g = ue, P = g.child;
            if ((ue.flags & 16) !== 0) {
              var j = g.deletions;
              if (j !== null) {
                for (var M = 0; M < j.length; M++) {
                  var B = j[M];
                  for (ue = B; ue !== null; ) {
                    var X = ue;
                    switch (X.tag) {
                      case 0:
                      case 11:
                      case 15:
                        Vo(8, X, g);
                    }
                    var Q = X.child;
                    if (Q !== null) Q.return = X, ue = Q;
                    else for (; ue !== null; ) {
                      X = ue;
                      var q = X.sibling, oe = X.return;
                      if (p0(X), X === B) {
                        ue = null;
                        break;
                      }
                      if (q !== null) {
                        q.return = oe, ue = q;
                        break;
                      }
                      ue = oe;
                    }
                  }
                }
                var de = g.alternate;
                if (de !== null) {
                  var he = de.child;
                  if (he !== null) {
                    de.child = null;
                    do {
                      var ut = he.sibling;
                      he.sibling = null, he = ut;
                    } while (he !== null);
                  }
                }
                ue = g;
              }
            }
            if ((g.subtreeFlags & 2064) !== 0 && P !== null) P.return = g, ue = P;
            else e: for (; ue !== null; ) {
              if (g = ue, (g.flags & 2048) !== 0) switch (g.tag) {
                case 0:
                case 11:
                case 15:
                  Vo(9, g, g.return);
              }
              var L = g.sibling;
              if (L !== null) {
                L.return = g.return, ue = L;
                break e;
              }
              ue = g.return;
            }
          }
          var N = i.current;
          for (ue = N; ue !== null; ) {
            P = ue;
            var z = P.child;
            if ((P.subtreeFlags & 2064) !== 0 && z !== null) z.return = P, ue = z;
            else e: for (P = N; ue !== null; ) {
              if (j = ue, (j.flags & 2048) !== 0) try {
                switch (j.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Ku(9, j);
                }
              } catch (pe) {
                tt(j, j.return, pe);
              }
              if (j === P) {
                ue = null;
                break e;
              }
              var ee = j.sibling;
              if (ee !== null) {
                ee.return = j.return, ue = ee;
                break e;
              }
              ue = j.return;
            }
          }
          if (je = m, Un(), Kr && typeof Kr.onPostCommitFiberRoot == "function") try {
            Kr.onPostCommitFiberRoot(nu, i);
          } catch {
          }
          v = !0;
        }
        return v;
      } finally {
        Le = s, xr.transition = o;
      }
    }
    return !1;
  }
  function _0(i, o, s) {
    o = Sa(s, o), o = qg(i, o, 1), i = Hn(i, o, 1), o = Gt(), i !== null && (xo(i, 1, o), er(i, o));
  }
  function tt(i, o, s) {
    if (i.tag === 3) _0(i, i, s);
    else for (; o !== null; ) {
      if (o.tag === 3) {
        _0(o, i, s);
        break;
      } else if (o.tag === 1) {
        var v = o.stateNode;
        if (typeof o.type.getDerivedStateFromError == "function" || typeof v.componentDidCatch == "function" && (Gn === null || !Gn.has(v))) {
          i = Sa(s, i), i = Xg(o, i, 1), o = Hn(o, i, 1), i = Gt(), o !== null && (xo(o, 1, i), er(o, i));
          break;
        }
      }
      o = o.return;
    }
  }
  function UI(i, o, s) {
    var v = i.pingCache;
    v !== null && v.delete(o), o = Gt(), i.pingedLanes |= i.suspendedLanes & s, St === i && (It & s) === s && (ht === 4 || ht === 3 && (It & 130023424) === It && 500 > lt() - qd ? Ai(i, 0) : Yd |= s), er(i, o);
  }
  function T0(i, o) {
    o === 0 && ((i.mode & 1) === 0 ? o = 1 : (o = au, au <<= 1, (au & 130023424) === 0 && (au = 4194304)));
    var s = Gt();
    i = hn(i, o), i !== null && (xo(i, o, s), er(i, s));
  }
  function KI(i) {
    var o = i.memoizedState, s = 0;
    o !== null && (s = o.retryLane), T0(i, s);
  }
  function HI(i, o) {
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
    v !== null && v.delete(o), T0(i, s);
  }
  var M0;
  M0 = function(i, o, s) {
    if (i !== null) if (i.memoizedProps !== o.pendingProps || Xt.current) Zt = !0;
    else {
      if ((i.lanes & s) === 0 && (o.flags & 128) === 0) return Zt = !1, TI(i, o, s);
      Zt = (i.flags & 131072) !== 0;
    }
    else Zt = !1, Ge && (o.flags & 1048576) !== 0 && dg(o, ku, o.index);
    switch (o.lanes = 0, o.tag) {
      case 2:
        var v = o.type;
        Wu(i, o), i = o.pendingProps;
        var m = ha(o, Dt.current);
        ba(o, s), m = Ed(null, o, v, i, m, s);
        var g = kd();
        return o.flags |= 1, typeof m == "object" && m !== null && typeof m.render == "function" && m.$$typeof === void 0 ? (o.tag = 1, o.memoizedState = null, o.updateQueue = null, Qt(v) ? (g = !0, Pu(o)) : g = !1, o.memoizedState = m.state !== null && m.state !== void 0 ? m.state : null, xd(o), m.updater = Bu, o.stateNode = m, m._reactInternals = o, Md(o, v, i, s), o = Rd(null, o, v, !0, g, s)) : (o.tag = 0, Ge && g && sd(o), Vt(null, o, m, s), o = o.child), o;
      case 16:
        v = o.elementType;
        e: {
          switch (Wu(i, o), i = o.pendingProps, m = v._init, v = m(v._payload), o.type = v, m = o.tag = GI(v), i = Mr(v, i), m) {
            case 0:
              o = $d(null, o, v, i, s);
              break e;
            case 1:
              o = a0(null, o, v, i, s);
              break e;
            case 11:
              o = e0(null, o, v, i, s);
              break e;
            case 14:
              o = t0(null, o, v, Mr(v.type, i), s);
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
        return v = o.type, m = o.pendingProps, m = o.elementType === v ? m : Mr(v, m), $d(i, o, v, m, s);
      case 1:
        return v = o.type, m = o.pendingProps, m = o.elementType === v ? m : Mr(v, m), a0(i, o, v, m, s);
      case 3:
        e: {
          if (o0(o), i === null) throw Error(r(387));
          v = o.pendingProps, g = o.memoizedState, m = g.element, wg(i, o), Mu(o, v, null, s);
          var P = o.memoizedState;
          if (v = P.element, g.isDehydrated) if (g = { element: v, isDehydrated: !1, cache: P.cache, pendingSuspenseBoundaries: P.pendingSuspenseBoundaries, transitions: P.transitions }, o.updateQueue.baseState = g, o.memoizedState = g, o.flags & 256) {
            m = Sa(Error(r(423)), o), o = l0(i, o, v, s, m);
            break e;
          } else if (v !== m) {
            m = Sa(Error(r(424)), o), o = l0(i, o, v, s, m);
            break e;
          } else for (sr = Bn(o.stateNode.containerInfo.firstChild), ur = o, Ge = !0, Tr = null, s = xg(o, null, v, s), o.child = s; s; ) s.flags = s.flags & -3 | 4096, s = s.sibling;
          else {
            if (ya(), v === m) {
              o = mn(i, o, s);
              break e;
            }
            Vt(i, o, v, s);
          }
          o = o.child;
        }
        return o;
      case 5:
        return Pg(o), i === null && dd(o), v = o.type, m = o.pendingProps, g = i !== null ? i.memoizedProps : null, P = m.children, nd(v, m) ? P = null : g !== null && nd(v, g) && (o.flags |= 32), i0(i, o), Vt(i, o, P, s), o.child;
      case 6:
        return i === null && dd(o), null;
      case 13:
        return u0(i, o, s);
      case 4:
        return bd(o, o.stateNode.containerInfo), v = o.pendingProps, i === null ? o.child = ga(o, null, v, s) : Vt(i, o, v, s), o.child;
      case 11:
        return v = o.type, m = o.pendingProps, m = o.elementType === v ? m : Mr(v, m), e0(i, o, v, m, s);
      case 7:
        return Vt(i, o, o.pendingProps, s), o.child;
      case 8:
        return Vt(i, o, o.pendingProps.children, s), o.child;
      case 12:
        return Vt(i, o, o.pendingProps.children, s), o.child;
      case 10:
        e: {
          if (v = o.type._context, m = o.pendingProps, g = o.memoizedProps, P = m.value, We(ju, v._currentValue), v._currentValue = P, g !== null) if (_r(g.value, P)) {
            if (g.children === m.children && !Xt.current) {
              o = mn(i, o, s);
              break e;
            }
          } else for (g = o.child, g !== null && (g.return = o); g !== null; ) {
            var j = g.dependencies;
            if (j !== null) {
              P = g.child;
              for (var M = j.firstContext; M !== null; ) {
                if (M.context === v) {
                  if (g.tag === 1) {
                    M = pn(-1, s & -s), M.tag = 2;
                    var B = g.updateQueue;
                    if (B !== null) {
                      B = B.shared;
                      var X = B.pending;
                      X === null ? M.next = M : (M.next = X.next, X.next = M), B.pending = M;
                    }
                  }
                  g.lanes |= s, M = g.alternate, M !== null && (M.lanes |= s), yd(
                    g.return,
                    s,
                    o
                  ), j.lanes |= s;
                  break;
                }
                M = M.next;
              }
            } else if (g.tag === 10) P = g.type === o.type ? null : g.child;
            else if (g.tag === 18) {
              if (P = g.return, P === null) throw Error(r(341));
              P.lanes |= s, j = P.alternate, j !== null && (j.lanes |= s), yd(P, s, o), P = g.sibling;
            } else P = g.child;
            if (P !== null) P.return = g;
            else for (P = g; P !== null; ) {
              if (P === o) {
                P = null;
                break;
              }
              if (g = P.sibling, g !== null) {
                g.return = P.return, P = g;
                break;
              }
              P = P.return;
            }
            g = P;
          }
          Vt(i, o, m.children, s), o = o.child;
        }
        return o;
      case 9:
        return m = o.type, v = o.pendingProps.children, ba(o, s), m = yr(m), v = v(m), o.flags |= 1, Vt(i, o, v, s), o.child;
      case 14:
        return v = o.type, m = Mr(v, o.pendingProps), m = Mr(v.type, m), t0(i, o, v, m, s);
      case 15:
        return r0(i, o, o.type, o.pendingProps, s);
      case 17:
        return v = o.type, m = o.pendingProps, m = o.elementType === v ? m : Mr(v, m), Wu(i, o), o.tag = 1, Qt(v) ? (i = !0, Pu(o)) : i = !1, ba(o, s), Gg(o, v, m), Md(o, v, m, s), Rd(null, o, v, !0, i, s);
      case 19:
        return c0(i, o, s);
      case 22:
        return n0(i, o, s);
    }
    throw Error(r(156, o.tag));
  };
  function N0(i, o) {
    return vy(i, o);
  }
  function VI(i, o, s, v) {
    this.tag = i, this.key = s, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = o, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = v, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function br(i, o, s, v) {
    return new VI(i, o, s, v);
  }
  function nv(i) {
    return i = i.prototype, !(!i || !i.isReactComponent);
  }
  function GI(i) {
    if (typeof i == "function") return nv(i) ? 1 : 0;
    if (i != null) {
      if (i = i.$$typeof, i === W) return 11;
      if (i === le) return 14;
    }
    return 2;
  }
  function Qn(i, o) {
    var s = i.alternate;
    return s === null ? (s = br(i.tag, o, i.key, i.mode), s.elementType = i.elementType, s.type = i.type, s.stateNode = i.stateNode, s.alternate = i, i.alternate = s) : (s.pendingProps = o, s.type = i.type, s.flags = 0, s.subtreeFlags = 0, s.deletions = null), s.flags = i.flags & 14680064, s.childLanes = i.childLanes, s.lanes = i.lanes, s.child = i.child, s.memoizedProps = i.memoizedProps, s.memoizedState = i.memoizedState, s.updateQueue = i.updateQueue, o = i.dependencies, s.dependencies = o === null ? null : { lanes: o.lanes, firstContext: o.firstContext }, s.sibling = i.sibling, s.index = i.index, s.ref = i.ref, s;
  }
  function Ju(i, o, s, v, m, g) {
    var P = 2;
    if (v = i, typeof i == "function") nv(i) && (P = 1);
    else if (typeof i == "string") P = 5;
    else e: switch (i) {
      case $:
        return Oi(s.children, m, g, o);
      case F:
        P = 8, m |= 8;
        break;
      case U:
        return i = br(12, s, o, m | 2), i.elementType = U, i.lanes = g, i;
      case ne:
        return i = br(13, s, o, m), i.elementType = ne, i.lanes = g, i;
      case re:
        return i = br(19, s, o, m), i.elementType = re, i.lanes = g, i;
      case ae:
        return es(s, m, g, o);
      default:
        if (typeof i == "object" && i !== null) switch (i.$$typeof) {
          case H:
            P = 10;
            break e;
          case G:
            P = 9;
            break e;
          case W:
            P = 11;
            break e;
          case le:
            P = 14;
            break e;
          case fe:
            P = 16, v = null;
            break e;
        }
        throw Error(r(130, i == null ? i : typeof i, ""));
    }
    return o = br(P, s, o, m), o.elementType = i, o.type = v, o.lanes = g, o;
  }
  function Oi(i, o, s, v) {
    return i = br(7, i, v, o), i.lanes = s, i;
  }
  function es(i, o, s, v) {
    return i = br(22, i, v, o), i.elementType = ae, i.lanes = s, i.stateNode = { isHidden: !1 }, i;
  }
  function iv(i, o, s) {
    return i = br(6, i, null, o), i.lanes = s, i;
  }
  function av(i, o, s) {
    return o = br(4, i.children !== null ? i.children : [], i.key, o), o.lanes = s, o.stateNode = { containerInfo: i.containerInfo, pendingChildren: null, implementation: i.implementation }, o;
  }
  function YI(i, o, s, v, m) {
    this.tag = o, this.containerInfo = i, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = Tf(0), this.expirationTimes = Tf(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Tf(0), this.identifierPrefix = v, this.onRecoverableError = m, this.mutableSourceEagerHydrationData = null;
  }
  function ov(i, o, s, v, m, g, P, j, M) {
    return i = new YI(i, o, s, j, M), o === 1 ? (o = 1, g === !0 && (o |= 8)) : o = 0, g = br(3, null, null, o), i.current = g, g.stateNode = i, g.memoizedState = { element: v, isDehydrated: s, cache: null, transitions: null, pendingSuspenseBoundaries: null }, xd(g), i;
  }
  function qI(i, o, s) {
    var v = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: E, key: v == null ? null : "" + v, children: i, containerInfo: o, implementation: s };
  }
  function D0(i) {
    if (!i) return Wn;
    i = i._reactInternals;
    e: {
      if (vi(i) !== i || i.tag !== 1) throw Error(r(170));
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
      if (Qt(s)) return sg(i, s, o);
    }
    return o;
  }
  function $0(i, o, s, v, m, g, P, j, M) {
    return i = ov(s, v, !0, i, m, g, P, j, M), i.context = D0(null), s = i.current, v = Gt(), m = qn(s), g = pn(v, m), g.callback = o ?? null, Hn(s, g, m), i.current.lanes = m, xo(i, m, v), er(i, v), i;
  }
  function ts(i, o, s, v) {
    var m = o.current, g = Gt(), P = qn(m);
    return s = D0(s), o.context === null ? o.context = s : o.pendingContext = s, o = pn(g, P), o.payload = { element: i }, v = v === void 0 ? null : v, v !== null && (o.callback = v), i = Hn(m, o, P), i !== null && ($r(i, m, P, g), Tu(i, m, P)), P;
  }
  function rs(i) {
    if (i = i.current, !i.child) return null;
    switch (i.child.tag) {
      case 5:
        return i.child.stateNode;
      default:
        return i.child.stateNode;
    }
  }
  function R0(i, o) {
    if (i = i.memoizedState, i !== null && i.dehydrated !== null) {
      var s = i.retryLane;
      i.retryLane = s !== 0 && s < o ? s : o;
    }
  }
  function lv(i, o) {
    R0(i, o), (i = i.alternate) && R0(i, o);
  }
  function XI() {
    return null;
  }
  var L0 = typeof reportError == "function" ? reportError : function(i) {
    console.error(i);
  };
  function uv(i) {
    this._internalRoot = i;
  }
  ns.prototype.render = uv.prototype.render = function(i) {
    var o = this._internalRoot;
    if (o === null) throw Error(r(409));
    ts(i, o, null, null);
  }, ns.prototype.unmount = uv.prototype.unmount = function() {
    var i = this._internalRoot;
    if (i !== null) {
      this._internalRoot = null;
      var o = i.containerInfo;
      Si(function() {
        ts(null, i, null, null);
      }), o[cn] = null;
    }
  };
  function ns(i) {
    this._internalRoot = i;
  }
  ns.prototype.unstable_scheduleHydration = function(i) {
    if (i) {
      var o = wy();
      i = { blockedOn: null, target: i, priority: o };
      for (var s = 0; s < Rn.length && o !== 0 && o < Rn[s].priority; s++) ;
      Rn.splice(s, 0, i), s === 0 && Py(i);
    }
  };
  function sv(i) {
    return !(!i || i.nodeType !== 1 && i.nodeType !== 9 && i.nodeType !== 11);
  }
  function is(i) {
    return !(!i || i.nodeType !== 1 && i.nodeType !== 9 && i.nodeType !== 11 && (i.nodeType !== 8 || i.nodeValue !== " react-mount-point-unstable "));
  }
  function z0() {
  }
  function QI(i, o, s, v, m) {
    if (m) {
      if (typeof v == "function") {
        var g = v;
        v = function() {
          var B = rs(P);
          g.call(B);
        };
      }
      var P = $0(o, v, i, 0, null, !1, !1, "", z0);
      return i._reactRootContainer = P, i[cn] = P.current, Mo(i.nodeType === 8 ? i.parentNode : i), Si(), P;
    }
    for (; m = i.lastChild; ) i.removeChild(m);
    if (typeof v == "function") {
      var j = v;
      v = function() {
        var B = rs(M);
        j.call(B);
      };
    }
    var M = ov(i, 0, !1, null, null, !1, !1, "", z0);
    return i._reactRootContainer = M, i[cn] = M.current, Mo(i.nodeType === 8 ? i.parentNode : i), Si(function() {
      ts(o, M, s, v);
    }), M;
  }
  function as(i, o, s, v, m) {
    var g = s._reactRootContainer;
    if (g) {
      var P = g;
      if (typeof m == "function") {
        var j = m;
        m = function() {
          var M = rs(P);
          j.call(M);
        };
      }
      ts(o, P, i, m);
    } else P = QI(s, o, i, m, v);
    return rs(P);
  }
  xy = function(i) {
    switch (i.tag) {
      case 3:
        var o = i.stateNode;
        if (o.current.memoizedState.isDehydrated) {
          var s = go(o.pendingLanes);
          s !== 0 && (Mf(o, s | 1), er(o, lt()), (je & 6) === 0 && (Oa = lt() + 500, Un()));
        }
        break;
      case 13:
        Si(function() {
          var v = hn(i, 1);
          if (v !== null) {
            var m = Gt();
            $r(v, i, 1, m);
          }
        }), lv(i, 1);
    }
  }, Nf = function(i) {
    if (i.tag === 13) {
      var o = hn(i, 134217728);
      if (o !== null) {
        var s = Gt();
        $r(o, i, 134217728, s);
      }
      lv(i, 134217728);
    }
  }, by = function(i) {
    if (i.tag === 13) {
      var o = qn(i), s = hn(i, o);
      if (s !== null) {
        var v = Gt();
        $r(s, i, o, v);
      }
      lv(i, o);
    }
  }, wy = function() {
    return Le;
  }, Sy = function(i, o) {
    var s = Le;
    try {
      return Le = i, o();
    } finally {
      Le = s;
    }
  }, Ef = function(i, o, s) {
    switch (o) {
      case "input":
        if (Ir(i, s), o = s.name, s.type === "radio" && o != null) {
          for (s = i; s.parentNode; ) s = s.parentNode;
          for (s = s.querySelectorAll("input[name=" + JSON.stringify("" + o) + '][type="radio"]'), o = 0; o < s.length; o++) {
            var v = s[o];
            if (v !== i && v.form === i.form) {
              var m = Su(v);
              if (!m) throw Error(r(90));
              Z(v), Ir(v, m);
            }
          }
        }
        break;
      case "textarea":
        Qm(i, s);
        break;
      case "select":
        o = s.value, o != null && ra(i, !!s.multiple, o, !1);
    }
  }, oy = ev, ly = Si;
  var ZI = { usingClientEntryPoint: !1, Events: [$o, da, Su, iy, ay, ev] }, Xo = { findFiberByHostInstance: hi, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, JI = { bundleType: Xo.bundleType, version: Xo.version, rendererPackageName: Xo.rendererPackageName, rendererConfig: Xo.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: k.ReactCurrentDispatcher, findHostInstanceByFiber: function(i) {
    return i = fy(i), i === null ? null : i.stateNode;
  }, findFiberByHostInstance: Xo.findFiberByHostInstance || XI, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var os = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!os.isDisabled && os.supportsFiber) try {
      nu = os.inject(JI), Kr = os;
    } catch {
    }
  }
  return tr.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ZI, tr.createPortal = function(i, o) {
    var s = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!sv(o)) throw Error(r(200));
    return qI(i, o, null, s);
  }, tr.createRoot = function(i, o) {
    if (!sv(i)) throw Error(r(299));
    var s = !1, v = "", m = L0;
    return o != null && (o.unstable_strictMode === !0 && (s = !0), o.identifierPrefix !== void 0 && (v = o.identifierPrefix), o.onRecoverableError !== void 0 && (m = o.onRecoverableError)), o = ov(i, 1, !1, null, null, s, !1, v, m), i[cn] = o.current, Mo(i.nodeType === 8 ? i.parentNode : i), new uv(o);
  }, tr.findDOMNode = function(i) {
    if (i == null) return null;
    if (i.nodeType === 1) return i;
    var o = i._reactInternals;
    if (o === void 0)
      throw typeof i.render == "function" ? Error(r(188)) : (i = Object.keys(i).join(","), Error(r(268, i)));
    return i = fy(o), i = i === null ? null : i.stateNode, i;
  }, tr.flushSync = function(i) {
    return Si(i);
  }, tr.hydrate = function(i, o, s) {
    if (!is(o)) throw Error(r(200));
    return as(null, i, o, !0, s);
  }, tr.hydrateRoot = function(i, o, s) {
    if (!sv(i)) throw Error(r(405));
    var v = s != null && s.hydratedSources || null, m = !1, g = "", P = L0;
    if (s != null && (s.unstable_strictMode === !0 && (m = !0), s.identifierPrefix !== void 0 && (g = s.identifierPrefix), s.onRecoverableError !== void 0 && (P = s.onRecoverableError)), o = $0(o, null, i, 1, s ?? null, m, !1, g, P), i[cn] = o.current, Mo(i), v) for (i = 0; i < v.length; i++) s = v[i], m = s._getVersion, m = m(s._source), o.mutableSourceEagerHydrationData == null ? o.mutableSourceEagerHydrationData = [s, m] : o.mutableSourceEagerHydrationData.push(
      s,
      m
    );
    return new ns(o);
  }, tr.render = function(i, o, s) {
    if (!is(o)) throw Error(r(200));
    return as(null, i, o, !1, s);
  }, tr.unmountComponentAtNode = function(i) {
    if (!is(i)) throw Error(r(40));
    return i._reactRootContainer ? (Si(function() {
      as(null, null, i, !1, function() {
        i._reactRootContainer = null, i[cn] = null;
      });
    }), !0) : !1;
  }, tr.unstable_batchedUpdates = ev, tr.unstable_renderSubtreeIntoContainer = function(i, o, s, v) {
    if (!is(s)) throw Error(r(200));
    if (i == null || i._reactInternals === void 0) throw Error(r(38));
    return as(i, o, s, !1, v);
  }, tr.version = "18.3.1-next-f1338f8080-20240426", tr;
}
var G0;
function pS() {
  if (G0) return dv.exports;
  G0 = 1;
  function e() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(e);
      } catch (t) {
        console.error(t);
      }
  }
  return e(), dv.exports = fj(), dv.exports;
}
var Y0;
function dj() {
  if (Y0) return us;
  Y0 = 1;
  var e = pS();
  return us.createRoot = e.createRoot, us.hydrateRoot = e.hydrateRoot, us;
}
var vj = dj();
function mS(e) {
  var t, r, n = "";
  if (typeof e == "string" || typeof e == "number") n += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var a = e.length;
    for (t = 0; t < a; t++) e[t] && (r = mS(e[t])) && (n && (n += " "), n += r);
  } else for (r in e) e[r] && (n && (n += " "), n += r);
  return n;
}
function ze() {
  for (var e, t, r = 0, n = "", a = arguments.length; r < a; r++) (e = arguments[r]) && (t = mS(e)) && (n && (n += " "), n += t);
  return n;
}
var hj = ["dangerouslySetInnerHTML", "onCopy", "onCopyCapture", "onCut", "onCutCapture", "onPaste", "onPasteCapture", "onCompositionEnd", "onCompositionEndCapture", "onCompositionStart", "onCompositionStartCapture", "onCompositionUpdate", "onCompositionUpdateCapture", "onFocus", "onFocusCapture", "onBlur", "onBlurCapture", "onChange", "onChangeCapture", "onBeforeInput", "onBeforeInputCapture", "onInput", "onInputCapture", "onReset", "onResetCapture", "onSubmit", "onSubmitCapture", "onInvalid", "onInvalidCapture", "onLoad", "onLoadCapture", "onError", "onErrorCapture", "onKeyDown", "onKeyDownCapture", "onKeyPress", "onKeyPressCapture", "onKeyUp", "onKeyUpCapture", "onAbort", "onAbortCapture", "onCanPlay", "onCanPlayCapture", "onCanPlayThrough", "onCanPlayThroughCapture", "onDurationChange", "onDurationChangeCapture", "onEmptied", "onEmptiedCapture", "onEncrypted", "onEncryptedCapture", "onEnded", "onEndedCapture", "onLoadedData", "onLoadedDataCapture", "onLoadedMetadata", "onLoadedMetadataCapture", "onLoadStart", "onLoadStartCapture", "onPause", "onPauseCapture", "onPlay", "onPlayCapture", "onPlaying", "onPlayingCapture", "onProgress", "onProgressCapture", "onRateChange", "onRateChangeCapture", "onSeeked", "onSeekedCapture", "onSeeking", "onSeekingCapture", "onStalled", "onStalledCapture", "onSuspend", "onSuspendCapture", "onTimeUpdate", "onTimeUpdateCapture", "onVolumeChange", "onVolumeChangeCapture", "onWaiting", "onWaitingCapture", "onAuxClick", "onAuxClickCapture", "onClick", "onClickCapture", "onContextMenu", "onContextMenuCapture", "onDoubleClick", "onDoubleClickCapture", "onDrag", "onDragCapture", "onDragEnd", "onDragEndCapture", "onDragEnter", "onDragEnterCapture", "onDragExit", "onDragExitCapture", "onDragLeave", "onDragLeaveCapture", "onDragOver", "onDragOverCapture", "onDragStart", "onDragStartCapture", "onDrop", "onDropCapture", "onMouseDown", "onMouseDownCapture", "onMouseEnter", "onMouseLeave", "onMouseMove", "onMouseMoveCapture", "onMouseOut", "onMouseOutCapture", "onMouseOver", "onMouseOverCapture", "onMouseUp", "onMouseUpCapture", "onSelect", "onSelectCapture", "onTouchCancel", "onTouchCancelCapture", "onTouchEnd", "onTouchEndCapture", "onTouchMove", "onTouchMoveCapture", "onTouchStart", "onTouchStartCapture", "onPointerDown", "onPointerDownCapture", "onPointerMove", "onPointerMoveCapture", "onPointerUp", "onPointerUpCapture", "onPointerCancel", "onPointerCancelCapture", "onPointerEnter", "onPointerEnterCapture", "onPointerLeave", "onPointerLeaveCapture", "onPointerOver", "onPointerOverCapture", "onPointerOut", "onPointerOutCapture", "onGotPointerCapture", "onGotPointerCaptureCapture", "onLostPointerCapture", "onLostPointerCaptureCapture", "onScroll", "onScrollCapture", "onWheel", "onWheelCapture", "onAnimationStart", "onAnimationStartCapture", "onAnimationEnd", "onAnimationEndCapture", "onAnimationIteration", "onAnimationIterationCapture", "onTransitionEnd", "onTransitionEndCapture"];
function Uh(e) {
  if (typeof e != "string")
    return !1;
  var t = hj;
  return t.includes(e);
}
var pj = [
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
], mj = new Set(pj);
function yS(e) {
  return typeof e != "string" ? !1 : mj.has(e);
}
function gS(e) {
  return typeof e == "string" && e.startsWith("data-");
}
function ar(e) {
  if (typeof e != "object" || e === null)
    return {};
  var t = {};
  for (var r in e)
    Object.prototype.hasOwnProperty.call(e, r) && (yS(r) || gS(r)) && (t[r] = e[r]);
  return t;
}
function Ui(e) {
  if (e == null)
    return null;
  if (/* @__PURE__ */ x.isValidElement(e) && typeof e.props == "object" && e.props !== null) {
    var t = e.props;
    return ar(t);
  }
  return typeof e == "object" && !Array.isArray(e) ? ar(e) : null;
}
function Pr(e) {
  var t = {};
  for (var r in e)
    Object.prototype.hasOwnProperty.call(e, r) && (yS(r) || gS(r) || Uh(r)) && (t[r] = e[r]);
  return t;
}
function yj(e) {
  return e == null ? null : /* @__PURE__ */ x.isValidElement(e) ? Pr(e.props) : typeof e == "object" && !Array.isArray(e) ? Pr(e) : null;
}
var gj = ["children", "width", "height", "viewBox", "className", "style", "title", "desc"];
function Qv() {
  return Qv = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Qv.apply(null, arguments);
}
function xj(e, t) {
  if (e == null) return {};
  var r, n, a = bj(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]);
  }
  return a;
}
function bj(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
var xS = /* @__PURE__ */ x.forwardRef((e, t) => {
  var r = e.children, n = e.width, a = e.height, l = e.viewBox, u = e.className, c = e.style, f = e.title, d = e.desc, h = xj(e, gj), p = l || {
    width: n,
    height: a,
    x: 0,
    y: 0
  }, y = ze("recharts-surface", u);
  return /* @__PURE__ */ x.createElement("svg", Qv({}, Pr(h), {
    className: y,
    width: n,
    height: a,
    style: c,
    viewBox: "".concat(p.x, " ").concat(p.y, " ").concat(p.width, " ").concat(p.height),
    ref: t
  }), /* @__PURE__ */ x.createElement("title", null, f), /* @__PURE__ */ x.createElement("desc", null, d), r);
}), wj = ["children", "className"];
function Zv() {
  return Zv = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Zv.apply(null, arguments);
}
function Sj(e, t) {
  if (e == null) return {};
  var r, n, a = Aj(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]);
  }
  return a;
}
function Aj(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
var at = /* @__PURE__ */ x.forwardRef((e, t) => {
  var r = e.children, n = e.className, a = Sj(e, wj), l = ze("recharts-layer", n);
  return /* @__PURE__ */ x.createElement("g", Zv({
    className: l
  }, Pr(a), {
    ref: t
  }), r);
}), bS = pS();
function Jv(e) {
  return e === "__proto__";
}
const Pj = /\.|(\[(?:[^[\]]*|(["'])(?:(?!\2)[^\\]|\\.)*?\2)\])/;
function wS(e) {
  switch (typeof e) {
    case "number":
    case "symbol":
      return !1;
    case "string":
      return e === "" || e.startsWith(".") || e.endsWith(".") ? !1 : Pj.test(e);
    default:
      return !1;
  }
}
function Ec(e) {
  var t;
  return typeof e == "string" || typeof e == "symbol" ? e : Object.is((t = e == null ? void 0 : e.valueOf) == null ? void 0 : t.call(e), -0) ? "-0" : String(e);
}
function Kh(e) {
  return typeof e == "symbol" || e instanceof Symbol;
}
function Oj(e) {
  return e == null ? "" : SS(e);
}
function SS(e) {
  if (typeof e == "string") return e;
  if (Array.isArray(e)) return e.map(SS).join(",");
  if (Kh(e)) return e.toString();
  const t = e + "";
  return t === "0" && Object.is(Number(e), -0) ? "-0" : t;
}
function Hh(e) {
  if (Array.isArray(e)) return e.map(Ec);
  if (typeof e == "symbol") return [e];
  e = Oj(e);
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
function rn(e, t, r) {
  if (e == null) return r;
  switch (typeof t) {
    case "string": {
      if (Jv(t)) return r;
      const n = e[t];
      return n === void 0 ? wS(t) && !Object.hasOwn(e, t) ? rn(e, Hh(t), r) : r : n;
    }
    case "number":
    case "symbol": {
      typeof t == "number" && (t = Ec(t));
      const n = e[t];
      return n === void 0 ? r : n;
    }
    default: {
      if (Array.isArray(t)) return Ej(e, t, r);
      if (Object.is(t == null ? void 0 : t.valueOf(), -0) ? t = "-0" : t = String(t), Jv(t)) return r;
      const n = e[t];
      return n === void 0 ? r : n;
    }
  }
}
function Ej(e, t, r) {
  if (t.length === 0) return r;
  let n = e;
  for (let a = 0; a < t.length; a++) {
    if (n == null || Jv(t[a])) return r;
    n = n[t[a]];
  }
  return n === void 0 ? r : n;
}
var kj = 4;
function ni(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : kj, r = 10 ** t, n = Math.round(e * r) / r;
  return Object.is(n, -0) ? 0 : n;
}
function _t(e) {
  for (var t = arguments.length, r = new Array(t > 1 ? t - 1 : 0), n = 1; n < t; n++)
    r[n - 1] = arguments[n];
  return e.reduce((a, l, u) => {
    var c = r[u - 1];
    return typeof c == "string" ? a + c + l : c !== void 0 ? a + ni(c) + l : a + l;
  }, "");
}
var Ot = (e) => e === 0 ? 0 : e > 0 ? 1 : -1, Br = (e) => typeof e == "number" && e != +e, Ki = (e) => typeof e == "string" && e.length > 1 && e.indexOf("%") === e.length - 1, ie = (e) => (typeof e == "number" || e instanceof Number) && !Br(e), nn = (e) => ie(e) || typeof e == "string", Cj = 0, bl = (e) => {
  var t = ++Cj;
  return "".concat(e || "").concat(t);
}, Ft = function(t, r) {
  var n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0, a = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : !1;
  if (!ie(t) && typeof t != "string")
    return n;
  var l;
  if (Ki(t)) {
    if (r == null)
      return n;
    var u = t.indexOf("%");
    l = r * parseFloat(t.slice(0, u)) / 100;
  } else
    l = +t;
  return Br(l) && (l = n), a && r != null && l > r && (l = r), l;
}, AS = (e) => {
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
  return ie(e) && ie(t) ? ni(e + r * (t - e)) : t;
}
function PS(e, t, r) {
  if (!(!e || !e.length))
    return e.find((n) => n && (typeof t == "function" ? t(n) : rn(n, t)) === r);
}
var Ze = (e) => e === null || typeof e > "u", Vh = (e) => Ze(e) ? e : "".concat(e.charAt(0).toUpperCase()).concat(e.slice(1));
function Yt(e) {
  return e != null;
}
function Qi() {
}
function Gh(e) {
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
function q0(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function qr(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? q0(Object(r), !0).forEach(function(n) {
      Ij(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : q0(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function Ij(e, t, r) {
  return (t = jj(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function jj(e) {
  var t = _j(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function _j(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Tj = (e) => {
  var t = e.viewBox, r = e.position, n = e.offset, a = n === void 0 ? 0 : n, l = e.parentViewBox, u = Gh(t), c = u.x, f = u.y, d = u.height, h = u.upperWidth, p = u.lowerWidth, y = c, b = c + (h - p) / 2, A = (y + b) / 2, w = (h + p) / 2, S = y + h / 2, O = d >= 0 ? 1 : -1, C = O * a, I = O > 0 ? "end" : "start", k = O > 0 ? "start" : "end", T = h >= 0 ? 1 : -1, E = T * a, $ = T > 0 ? "end" : "start", F = T > 0 ? "start" : "end", U = l;
  if (r === "top") {
    var H = {
      x: y + h / 2,
      y: f - C,
      horizontalAnchor: "middle",
      verticalAnchor: I
    };
    return U && (H.height = Math.max(f - U.y, 0), H.width = h), H;
  }
  if (r === "bottom") {
    var G = {
      x: b + p / 2,
      y: f + d + C,
      horizontalAnchor: "middle",
      verticalAnchor: k
    };
    return U && (G.height = Math.max(U.y + U.height - (f + d), 0), G.width = p), G;
  }
  if (r === "left") {
    var W = {
      x: A - E,
      y: f + d / 2,
      horizontalAnchor: $,
      verticalAnchor: "middle"
    };
    return U && (W.width = Math.max(W.x - U.x, 0), W.height = d), W;
  }
  if (r === "right") {
    var ne = {
      x: A + w + E,
      y: f + d / 2,
      horizontalAnchor: F,
      verticalAnchor: "middle"
    };
    return U && (ne.width = Math.max(U.x + U.width - ne.x, 0), ne.height = d), ne;
  }
  var re = U ? {
    width: w,
    height: d
  } : {};
  return r === "insideLeft" ? qr({
    x: A + E,
    y: f + d / 2,
    horizontalAnchor: F,
    verticalAnchor: "middle"
  }, re) : r === "insideRight" ? qr({
    x: A + w - E,
    y: f + d / 2,
    horizontalAnchor: $,
    verticalAnchor: "middle"
  }, re) : r === "insideTop" ? qr({
    x: y + h / 2,
    y: f + C,
    horizontalAnchor: "middle",
    verticalAnchor: k
  }, re) : r === "insideBottom" ? qr({
    x: b + p / 2,
    y: f + d - C,
    horizontalAnchor: "middle",
    verticalAnchor: I
  }, re) : r === "insideTopLeft" ? qr({
    x: y + E,
    y: f + C,
    horizontalAnchor: F,
    verticalAnchor: k
  }, re) : r === "insideTopRight" ? qr({
    x: y + h - E,
    y: f + C,
    horizontalAnchor: $,
    verticalAnchor: k
  }, re) : r === "insideBottomLeft" ? qr({
    x: b + E,
    y: f + d - C,
    horizontalAnchor: F,
    verticalAnchor: I
  }, re) : r === "insideBottomRight" ? qr({
    x: b + p - E,
    y: f + d - C,
    horizontalAnchor: $,
    verticalAnchor: I
  }, re) : r && typeof r == "object" && (ie(r.x) || Ki(r.x)) && (ie(r.y) || Ki(r.y)) ? qr({
    x: c + Ft(r.x, w),
    y: f + Ft(r.y, d),
    horizontalAnchor: "end",
    verticalAnchor: "end"
  }, re) : qr({
    x: S,
    y: f + d / 2,
    horizontalAnchor: "middle",
    verticalAnchor: "middle"
  }, re);
}, Mj = ["top", "left", "right", "bottom"];
function Nj(e) {
  return e == null ? !1 : typeof e == "object" ? !0 : Mj.includes(e);
}
var Dj = /* @__PURE__ */ x.createContext(null);
function rt(e) {
  return function() {
    return e;
  };
}
const eh = Math.PI, th = 2 * eh, ji = 1e-6, $j = th - ji;
function OS(e) {
  this._ += e[0];
  for (let t = 1, r = e.length; t < r; ++t)
    this._ += arguments[t] + e[t];
}
function Rj(e) {
  let t = Math.floor(e);
  if (!(t >= 0)) throw new Error(`invalid digits: ${e}`);
  if (t > 15) return OS;
  const r = 10 ** t;
  return function(n) {
    this._ += n[0];
    for (let a = 1, l = n.length; a < l; ++a)
      this._ += Math.round(arguments[a] * r) / r + n[a];
  };
}
class Lj {
  constructor(t) {
    this._x0 = this._y0 = // start of current subpath
    this._x1 = this._y1 = null, this._ = "", this._append = t == null ? OS : Rj(t);
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
    else if (y > ji) if (!(Math.abs(p * f - d * h) > ji) || !l)
      this._append`L${this._x1 = t},${this._y1 = r}`;
    else {
      let b = n - u, A = a - c, w = f * f + d * d, S = b * b + A * A, O = Math.sqrt(w), C = Math.sqrt(y), I = l * Math.tan((eh - Math.acos((w + y - S) / (2 * O * C))) / 2), k = I / C, T = I / O;
      Math.abs(k - 1) > ji && this._append`L${t + k * h},${r + k * p}`, this._append`A${l},${l},0,0,${+(p * b > h * A)},${this._x1 = t + T * f},${this._y1 = r + T * d}`;
    }
  }
  arc(t, r, n, a, l, u) {
    if (t = +t, r = +r, n = +n, u = !!u, n < 0) throw new Error(`negative radius: ${n}`);
    let c = n * Math.cos(a), f = n * Math.sin(a), d = t + c, h = r + f, p = 1 ^ u, y = u ? a - l : l - a;
    this._x1 === null ? this._append`M${d},${h}` : (Math.abs(this._x1 - d) > ji || Math.abs(this._y1 - h) > ji) && this._append`L${d},${h}`, n && (y < 0 && (y = y % th + th), y > $j ? this._append`A${n},${n},0,1,${p},${t - c},${r - f}A${n},${n},0,1,${p},${this._x1 = d},${this._y1 = h}` : y > ji && this._append`A${n},${n},0,${+(y >= eh)},${p},${this._x1 = t + n * Math.cos(l)},${this._y1 = r + n * Math.sin(l)}`);
  }
  rect(t, r, n, a) {
    this._append`M${this._x0 = this._x1 = +t},${this._y0 = this._y1 = +r}h${n = +n}v${+a}h${-n}Z`;
  }
  toString() {
    return this._;
  }
}
function ES(e) {
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
  }, () => new Lj(t);
}
function Yh(e) {
  return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function kS(e) {
  this._context = e;
}
kS.prototype = {
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
function kc(e) {
  return new kS(e);
}
function CS(e) {
  return e[0];
}
function IS(e) {
  return e[1];
}
function jS(e, t) {
  var r = rt(!0), n = null, a = kc, l = null, u = ES(c);
  e = typeof e == "function" ? e : e === void 0 ? CS : rt(e), t = typeof t == "function" ? t : t === void 0 ? IS : rt(t);
  function c(f) {
    var d, h = (f = Yh(f)).length, p, y = !1, b;
    for (n == null && (l = a(b = u())), d = 0; d <= h; ++d)
      !(d < h && r(p = f[d], d, f)) === y && ((y = !y) ? l.lineStart() : l.lineEnd()), y && l.point(+e(p, d, f), +t(p, d, f));
    if (b) return l = null, b + "" || null;
  }
  return c.x = function(f) {
    return arguments.length ? (e = typeof f == "function" ? f : rt(+f), c) : e;
  }, c.y = function(f) {
    return arguments.length ? (t = typeof f == "function" ? f : rt(+f), c) : t;
  }, c.defined = function(f) {
    return arguments.length ? (r = typeof f == "function" ? f : rt(!!f), c) : r;
  }, c.curve = function(f) {
    return arguments.length ? (a = f, n != null && (l = a(n)), c) : a;
  }, c.context = function(f) {
    return arguments.length ? (f == null ? n = l = null : l = a(n = f), c) : n;
  }, c;
}
function ss(e, t, r) {
  var n = null, a = rt(!0), l = null, u = kc, c = null, f = ES(d);
  e = typeof e == "function" ? e : e === void 0 ? CS : rt(+e), t = typeof t == "function" ? t : rt(t === void 0 ? 0 : +t), r = typeof r == "function" ? r : r === void 0 ? IS : rt(+r);
  function d(p) {
    var y, b, A, w = (p = Yh(p)).length, S, O = !1, C, I = new Array(w), k = new Array(w);
    for (l == null && (c = u(C = f())), y = 0; y <= w; ++y) {
      if (!(y < w && a(S = p[y], y, p)) === O)
        if (O = !O)
          b = y, c.areaStart(), c.lineStart();
        else {
          for (c.lineEnd(), c.lineStart(), A = y - 1; A >= b; --A)
            c.point(I[A], k[A]);
          c.lineEnd(), c.areaEnd();
        }
      O && (I[y] = +e(S, y, p), k[y] = +t(S, y, p), c.point(n ? +n(S, y, p) : I[y], r ? +r(S, y, p) : k[y]));
    }
    if (C) return c = null, C + "" || null;
  }
  function h() {
    return jS().defined(a).curve(u).context(l);
  }
  return d.x = function(p) {
    return arguments.length ? (e = typeof p == "function" ? p : rt(+p), n = null, d) : e;
  }, d.x0 = function(p) {
    return arguments.length ? (e = typeof p == "function" ? p : rt(+p), d) : e;
  }, d.x1 = function(p) {
    return arguments.length ? (n = p == null ? null : typeof p == "function" ? p : rt(+p), d) : n;
  }, d.y = function(p) {
    return arguments.length ? (t = typeof p == "function" ? p : rt(+p), r = null, d) : t;
  }, d.y0 = function(p) {
    return arguments.length ? (t = typeof p == "function" ? p : rt(+p), d) : t;
  }, d.y1 = function(p) {
    return arguments.length ? (r = p == null ? null : typeof p == "function" ? p : rt(+p), d) : r;
  }, d.lineX0 = d.lineY0 = function() {
    return h().x(e).y(t);
  }, d.lineY1 = function() {
    return h().x(e).y(r);
  }, d.lineX1 = function() {
    return h().x(n).y(t);
  }, d.defined = function(p) {
    return arguments.length ? (a = typeof p == "function" ? p : rt(!!p), d) : a;
  }, d.curve = function(p) {
    return arguments.length ? (u = p, l != null && (c = u(l)), d) : u;
  }, d.context = function(p) {
    return arguments.length ? (p == null ? l = c = null : c = u(l = p), d) : l;
  }, d;
}
class _S {
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
function zj(e) {
  return new _S(e, !0);
}
function Bj(e) {
  return new _S(e, !1);
}
function Ms() {
}
function Ns(e, t, r) {
  e._context.bezierCurveTo(
    (2 * e._x0 + e._x1) / 3,
    (2 * e._y0 + e._y1) / 3,
    (e._x0 + 2 * e._x1) / 3,
    (e._y0 + 2 * e._y1) / 3,
    (e._x0 + 4 * e._x1 + t) / 6,
    (e._y0 + 4 * e._y1 + r) / 6
  );
}
function TS(e) {
  this._context = e;
}
TS.prototype = {
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
        Ns(this, this._x1, this._y1);
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
        Ns(this, e, t);
        break;
    }
    this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t;
  }
};
function Fj(e) {
  return new TS(e);
}
function MS(e) {
  this._context = e;
}
MS.prototype = {
  areaStart: Ms,
  areaEnd: Ms,
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
        Ns(this, e, t);
        break;
    }
    this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t;
  }
};
function Wj(e) {
  return new MS(e);
}
function NS(e) {
  this._context = e;
}
NS.prototype = {
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
        Ns(this, e, t);
        break;
    }
    this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t;
  }
};
function Uj(e) {
  return new NS(e);
}
function DS(e) {
  this._context = e;
}
DS.prototype = {
  areaStart: Ms,
  areaEnd: Ms,
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
function Kj(e) {
  return new DS(e);
}
function X0(e) {
  return e < 0 ? -1 : 1;
}
function Q0(e, t, r) {
  var n = e._x1 - e._x0, a = t - e._x1, l = (e._y1 - e._y0) / (n || a < 0 && -0), u = (r - e._y1) / (a || n < 0 && -0), c = (l * a + u * n) / (n + a);
  return (X0(l) + X0(u)) * Math.min(Math.abs(l), Math.abs(u), 0.5 * Math.abs(c)) || 0;
}
function Z0(e, t) {
  var r = e._x1 - e._x0;
  return r ? (3 * (e._y1 - e._y0) / r - t) / 2 : t;
}
function pv(e, t, r) {
  var n = e._x0, a = e._y0, l = e._x1, u = e._y1, c = (l - n) / 3;
  e._context.bezierCurveTo(n + c, a + c * t, l - c, u - c * r, l, u);
}
function Ds(e) {
  this._context = e;
}
Ds.prototype = {
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
        pv(this, this._t0, Z0(this, this._t0));
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
          this._point = 3, pv(this, Z0(this, r = Q0(this, e, t)), r);
          break;
        default:
          pv(this, this._t0, r = Q0(this, e, t));
          break;
      }
      this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t, this._t0 = r;
    }
  }
};
function $S(e) {
  this._context = new RS(e);
}
($S.prototype = Object.create(Ds.prototype)).point = function(e, t) {
  Ds.prototype.point.call(this, t, e);
};
function RS(e) {
  this._context = e;
}
RS.prototype = {
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
function Hj(e) {
  return new Ds(e);
}
function Vj(e) {
  return new $S(e);
}
function LS(e) {
  this._context = e;
}
LS.prototype = {
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
        for (var n = J0(e), a = J0(t), l = 0, u = 1; u < r; ++l, ++u)
          this._context.bezierCurveTo(n[0][l], a[0][l], n[1][l], a[1][l], e[u], t[u]);
    (this._line || this._line !== 0 && r === 1) && this._context.closePath(), this._line = 1 - this._line, this._x = this._y = null;
  },
  point: function(e, t) {
    this._x.push(+e), this._y.push(+t);
  }
};
function J0(e) {
  var t, r = e.length - 1, n, a = new Array(r), l = new Array(r), u = new Array(r);
  for (a[0] = 0, l[0] = 2, u[0] = e[0] + 2 * e[1], t = 1; t < r - 1; ++t) a[t] = 1, l[t] = 4, u[t] = 4 * e[t] + 2 * e[t + 1];
  for (a[r - 1] = 2, l[r - 1] = 7, u[r - 1] = 8 * e[r - 1] + e[r], t = 1; t < r; ++t) n = a[t] / l[t - 1], l[t] -= n, u[t] -= n * u[t - 1];
  for (a[r - 1] = u[r - 1] / l[r - 1], t = r - 2; t >= 0; --t) a[t] = (u[t] - a[t + 1]) / l[t];
  for (l[r - 1] = (e[r] + a[r - 1]) / 2, t = 0; t < r - 1; ++t) l[t] = 2 * e[t + 1] - a[t + 1];
  return [a, l];
}
function Gj(e) {
  return new LS(e);
}
function Cc(e, t) {
  this._context = e, this._t = t;
}
Cc.prototype = {
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
function Yj(e) {
  return new Cc(e, 0.5);
}
function qj(e) {
  return new Cc(e, 0);
}
function Xj(e) {
  return new Cc(e, 1);
}
function Hi(e, t) {
  if ((u = e.length) > 1)
    for (var r = 1, n, a, l = e[t[0]], u, c = l.length; r < u; ++r)
      for (a = l, l = e[t[r]], n = 0; n < c; ++n)
        l[n][1] += l[n][0] = isNaN(a[n][1]) ? a[n][0] : a[n][1];
}
function rh(e) {
  for (var t = e.length, r = new Array(t); --t >= 0; ) r[t] = t;
  return r;
}
function Qj(e, t) {
  return e[t];
}
function Zj(e) {
  const t = [];
  return t.key = e, t;
}
function Jj() {
  var e = rt([]), t = rh, r = Hi, n = Qj;
  function a(l) {
    var u = Array.from(e.apply(this, arguments), Zj), c, f = u.length, d = -1, h;
    for (const p of l)
      for (c = 0, ++d; c < f; ++c)
        (u[c][d] = [0, +n(p, u[c].key, d, l)]).data = p;
    for (c = 0, h = Yh(t(u)); c < f; ++c)
      u[h[c]].index = c;
    return r(u, h), u;
  }
  return a.keys = function(l) {
    return arguments.length ? (e = typeof l == "function" ? l : rt(Array.from(l)), a) : e;
  }, a.value = function(l) {
    return arguments.length ? (n = typeof l == "function" ? l : rt(+l), a) : n;
  }, a.order = function(l) {
    return arguments.length ? (t = l == null ? rh : typeof l == "function" ? l : rt(Array.from(l)), a) : t;
  }, a.offset = function(l) {
    return arguments.length ? (r = l ?? Hi, a) : r;
  }, a;
}
function e_(e, t) {
  if ((n = e.length) > 0) {
    for (var r, n, a = 0, l = e[0].length, u; a < l; ++a) {
      for (u = r = 0; r < n; ++r) u += e[r][a][1] || 0;
      if (u) for (r = 0; r < n; ++r) e[r][a][1] /= u;
    }
    Hi(e, t);
  }
}
function t_(e, t) {
  if ((a = e.length) > 0) {
    for (var r = 0, n = e[t[0]], a, l = n.length; r < l; ++r) {
      for (var u = 0, c = 0; u < a; ++u) c += e[u][r][1] || 0;
      n[r][1] += n[r][0] = -c / 2;
    }
    Hi(e, t);
  }
}
function r_(e, t) {
  if (!(!((u = e.length) > 0) || !((l = (a = e[t[0]]).length) > 0))) {
    for (var r = 0, n = 1, a, l, u; n < l; ++n) {
      for (var c = 0, f = 0, d = 0; c < u; ++c) {
        for (var h = e[t[c]], p = h[n][1] || 0, y = h[n - 1][1] || 0, b = (p - y) / 2, A = 0; A < c; ++A) {
          var w = e[t[A]], S = w[n][1] || 0, O = w[n - 1][1] || 0;
          b += S - O;
        }
        f += p, d += b * p;
      }
      a[n - 1][1] += a[n - 1][0] = r, f && (r -= d / f);
    }
    a[n - 1][1] += a[n - 1][0] = r, Hi(e, t);
  }
}
var zS = (e) => "radius" in e && "startAngle" in e && "endAngle" in e, qh = (e, t) => {
  if (!e || typeof e == "function" || typeof e == "boolean")
    return null;
  var r = e;
  if (/* @__PURE__ */ x.isValidElement(e) && (r = e.props), typeof r != "object" && typeof r != "function")
    return null;
  var n = {};
  return Object.keys(r).forEach((a) => {
    Uh(a) && typeof r[a] == "function" && (n[a] = ((l) => r[a](r, l)));
  }), n;
}, n_ = (e, t, r) => (n) => (e(t, r, n), null), Ic = (e, t, r) => {
  if (e === null || typeof e != "object" && typeof e != "function")
    return null;
  var n = null;
  return Object.keys(e).forEach((a) => {
    var l = e[a];
    Uh(a) && typeof l == "function" && (n || (n = {}), n[a] = n_(l, t, r));
  }), n;
};
function ex(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function i_(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? ex(Object(r), !0).forEach(function(n) {
      a_(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : ex(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function a_(e, t, r) {
  return (t = o_(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function o_(e) {
  var t = l_(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function l_(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function Ut(e, t) {
  var r = i_({}, e), n = t, a = Object.keys(t), l = a.reduce((u, c) => (u[c] === void 0 && n[c] !== void 0 && (u[c] = n[c]), u), r);
  return l;
}
function u_(e, t) {
  const r = /* @__PURE__ */ new Map();
  for (let n = 0; n < e.length; n++) {
    const a = e[n], l = t(a, n, e);
    r.has(l) || r.set(l, a);
  }
  return Array.from(r.values());
}
function s_(e, t) {
  return function(...r) {
    return e.apply(this, r.slice(0, t));
  };
}
function BS(e) {
  return e;
}
function c_(e) {
  return Number.isSafeInteger(e) && e >= 0;
}
function Xh(e) {
  return e != null && typeof e != "function" && c_(e.length);
}
function f_(e) {
  return function(t) {
    return rn(t, e);
  };
}
function FS(e) {
  return e == null || typeof e != "object" && typeof e != "function";
}
function d_(e) {
  return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
function nh(e) {
  return Object.getOwnPropertySymbols(e).filter((t) => Object.prototype.propertyIsEnumerable.call(e, t));
}
function Wa(e) {
  return e == null ? e === void 0 ? "[object Undefined]" : "[object Null]" : Object.prototype.toString.call(e);
}
const WS = "[object RegExp]", Qh = "[object String]", Zh = "[object Number]", Jh = "[object Boolean]", US = "[object Arguments]", KS = "[object Symbol]", HS = "[object Date]", VS = "[object Map]", GS = "[object Set]", YS = "[object Array]", v_ = "[object Function]", qS = "[object ArrayBuffer]", Cs = "[object Object]", h_ = "[object Error]", XS = "[object DataView]", QS = "[object Uint8Array]", ZS = "[object Uint8ClampedArray]", JS = "[object Uint16Array]", eA = "[object Uint32Array]", p_ = "[object BigUint64Array]", tA = "[object Int8Array]", rA = "[object Int16Array]", nA = "[object Int32Array]", m_ = "[object BigInt64Array]", iA = "[object Float32Array]", aA = "[object Float64Array]", tx = typeof globalThis == "object" && globalThis || typeof window == "object" && window || typeof self == "object" && self || typeof global == "object" && global || /* @__PURE__ */ (function() {
  return this;
})();
function ih(e) {
  return typeof tx.Buffer < "u" && tx.Buffer.isBuffer(e);
}
function y_(e, t) {
  return Mi(e, void 0, e, /* @__PURE__ */ new Map(), t);
}
function Mi(e, t, r, n = /* @__PURE__ */ new Map(), a = void 0) {
  const l = a == null ? void 0 : a(e, t, r, n);
  if (l !== void 0) return l;
  if (FS(e)) return e;
  if (n.has(e)) return n.get(e);
  if (Array.isArray(e)) {
    const u = new Array(e.length);
    n.set(e, u);
    for (let c = 0; c < e.length; c++) u[c] = Mi(e[c], c, r, n, a);
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
    for (const [c, f] of e) u.set(c, Mi(f, c, r, n, a));
    return u;
  }
  if (e instanceof Set) {
    const u = /* @__PURE__ */ new Set();
    n.set(e, u);
    for (const c of e) u.add(Mi(c, void 0, r, n, a));
    return u;
  }
  if (ih(e)) return e.subarray();
  if (d_(e)) {
    const u = new (Object.getPrototypeOf(e)).constructor(e.length);
    n.set(e, u);
    for (let c = 0; c < e.length; c++) u[c] = Mi(e[c], c, r, n, a);
    return u;
  }
  if (e instanceof ArrayBuffer || typeof SharedArrayBuffer < "u" && e instanceof SharedArrayBuffer) return e.slice(0);
  if (e instanceof DataView) {
    const u = new DataView(e.buffer.slice(0), e.byteOffset, e.byteLength);
    return n.set(e, u), Rr(u, e, r, n, a), u;
  }
  if (typeof File < "u" && e instanceof File) {
    const u = new File([e], e.name, { type: e.type });
    return n.set(e, u), Rr(u, e, r, n, a), u;
  }
  if (typeof Blob < "u" && e instanceof Blob) {
    const u = new Blob([e], { type: e.type });
    return n.set(e, u), Rr(u, e, r, n, a), u;
  }
  if (e instanceof Error) {
    const u = structuredClone(e);
    return n.set(e, u), u.message = e.message, u.name = e.name, u.stack = e.stack, u.cause = e.cause, u.constructor = e.constructor, Rr(u, e, r, n, a), u;
  }
  if (e instanceof Boolean) {
    const u = new Boolean(e.valueOf());
    return n.set(e, u), Rr(u, e, r, n, a), u;
  }
  if (e instanceof Number) {
    const u = new Number(e.valueOf());
    return n.set(e, u), Rr(u, e, r, n, a), u;
  }
  if (e instanceof String) {
    const u = new String(e.valueOf());
    return n.set(e, u), Rr(u, e, r, n, a), u;
  }
  if (typeof e == "object" && g_(e)) {
    const u = Object.create(Object.getPrototypeOf(e));
    return n.set(e, u), Rr(u, e, r, n, a), u;
  }
  return e;
}
function Rr(e, t, r = e, n, a) {
  const l = [...Object.keys(t), ...nh(t)];
  for (let u = 0; u < l.length; u++) {
    const c = l[u], f = Object.getOwnPropertyDescriptor(e, c);
    (f == null || f.writable) && (e[c] = Mi(t[c], c, r, n, a));
  }
}
function g_(e) {
  switch (Wa(e)) {
    case US:
    case YS:
    case qS:
    case XS:
    case Jh:
    case HS:
    case iA:
    case aA:
    case tA:
    case rA:
    case nA:
    case VS:
    case Zh:
    case Cs:
    case WS:
    case GS:
    case Qh:
    case KS:
    case QS:
    case ZS:
    case JS:
    case eA:
      return !0;
    default:
      return !1;
  }
}
function x_(e) {
  return Mi(e, void 0, e, /* @__PURE__ */ new Map(), void 0);
}
function hl(e, t) {
  return e === t || Number.isNaN(e) && Number.isNaN(t);
}
function oA(e) {
  return e !== null && (typeof e == "object" || typeof e == "function");
}
function lA(e, t, r) {
  return typeof r != "function" ? lA(e, t, () => {
  }) : ah(e, t, function n(a, l, u, c, f, d) {
    const h = r(a, l, u, c, f, d);
    return h !== void 0 ? !!h : ah(a, l, n, d, !1);
  }, /* @__PURE__ */ new Map(), !0);
}
function ah(e, t, r, n, a = !1) {
  if (t === e) return !0;
  switch (typeof t) {
    case "object":
      return b_(e, t, r, n, a);
    case "function":
      return Object.keys(t).length > 0 ? ah(e, { ...t }, r, n, a) : hl(e, t);
    default:
      return oA(e) && a ? typeof t == "string" ? t === "" : !0 : hl(e, t);
  }
}
function b_(e, t, r, n, a = !1) {
  if (t == null) return !0;
  if (Array.isArray(t)) return uA(e, t, r, n);
  if (t instanceof Map) return w_(e, t, r, n);
  if (t instanceof Set) return S_(e, t, r, n);
  const l = Object.keys(t);
  if (e == null) return a && l.length === 0;
  if (a)
    FS(e) && (e = Object(e));
  else {
    const u = Wa(e);
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
function w_(e, t, r, n) {
  if (t.size === 0) return !0;
  if (!(e instanceof Map)) return !1;
  for (const [a, l] of t.entries()) if (r(e.get(a), l, a, e, t, n) === !1) return !1;
  return !0;
}
function uA(e, t, r, n) {
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
function S_(e, t, r, n) {
  return t.size === 0 ? !0 : e instanceof Set ? uA([...e], [...t], r, n) : !1;
}
function sA(e, t) {
  return lA(e, t, () => {
  });
}
function A_(e) {
  return e = x_(e), (t) => sA(t, e);
}
function P_(e, t) {
  return y_(e, (r, n, a, l) => {
    if (typeof e == "object") {
      if (Wa(e) === "[object Object]" && typeof e.constructor != "function") {
        const u = {};
        return l.set(e, u), Rr(u, e, a, l), u;
      }
      switch (Object.prototype.toString.call(e)) {
        case Zh:
        case Qh:
        case Jh: {
          const u = new e.constructor(e == null ? void 0 : e.valueOf());
          return Rr(u, e), u;
        }
        case US: {
          const u = {};
          return Rr(u, e), u.length = e.length, u[Symbol.iterator] = e[Symbol.iterator], u;
        }
        default:
          return;
      }
    }
  });
}
function O_(e) {
  return P_(e);
}
const E_ = /^(?:0|[1-9]\d*)$/;
function cA(e, t = Number.MAX_SAFE_INTEGER) {
  switch (typeof e) {
    case "number":
      return Number.isInteger(e) && e >= 0 && e < t;
    case "symbol":
      return !1;
    case "string":
      return E_.test(e);
  }
}
function k_(e) {
  return e !== null && typeof e == "object" && Wa(e) === "[object Arguments]";
}
function C_(e, t) {
  let r;
  if (Array.isArray(t) ? r = t : typeof t == "string" && wS(t) && !(t in Object(e)) ? r = Hh(t) : r = [t], r.length === 0) return !1;
  let n = e;
  for (let a = 0; a < r.length; a++) {
    const l = Ec(r[a]);
    if ((n == null || !Object.hasOwn(n, l)) && !((Array.isArray(n) || k_(n)) && cA(l) && Number(l) < n.length))
      return !1;
    n = n[l];
  }
  return !0;
}
function I_(e, t) {
  switch (typeof e) {
    case "object":
      Object.is(e == null ? void 0 : e.valueOf(), -0) && (e = "-0");
      break;
    case "number":
      e = Ec(e);
      break;
  }
  return t = O_(t), function(r) {
    const n = rn(r, e);
    return n === void 0 ? C_(r, e) : t === void 0 ? n === void 0 : sA(n, t);
  };
}
function j_(e) {
  if (e == null) return BS;
  switch (typeof e) {
    case "function":
      return e;
    case "object":
      return Array.isArray(e) && e.length === 2 ? I_(e[0], e[1]) : A_(e);
    default:
      return f_(e);
  }
}
function __(e) {
  return e === 0 ? 0 : e;
}
function rx(e, t = BS) {
  return Xh(e) ? u_(Array.from(e), s_(j_(t), 1)).map(__) : [];
}
function T_(e, t, r) {
  return t === !0 ? rx(e, r) : typeof t == "function" ? rx(e, t) : e;
}
var mv = { exports: {} }, yv = {}, gv = { exports: {} }, xv = {};
/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var nx;
function M_() {
  if (nx) return xv;
  nx = 1;
  var e = Qa();
  function t(p, y) {
    return p === y && (p !== 0 || 1 / p === 1 / y) || p !== p && y !== y;
  }
  var r = typeof Object.is == "function" ? Object.is : t, n = e.useState, a = e.useEffect, l = e.useLayoutEffect, u = e.useDebugValue;
  function c(p, y) {
    var b = y(), A = n({ inst: { value: b, getSnapshot: y } }), w = A[0].inst, S = A[1];
    return l(
      function() {
        w.value = b, w.getSnapshot = y, f(w) && S({ inst: w });
      },
      [p, b, y]
    ), a(
      function() {
        return f(w) && S({ inst: w }), p(function() {
          f(w) && S({ inst: w });
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
  return xv.useSyncExternalStore = e.useSyncExternalStore !== void 0 ? e.useSyncExternalStore : h, xv;
}
var ix;
function N_() {
  return ix || (ix = 1, gv.exports = M_()), gv.exports;
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
var ax;
function D_() {
  if (ax) return yv;
  ax = 1;
  var e = Qa(), t = N_();
  function r(d, h) {
    return d === h && (d !== 0 || 1 / d === 1 / h) || d !== d && h !== h;
  }
  var n = typeof Object.is == "function" ? Object.is : r, a = t.useSyncExternalStore, l = e.useRef, u = e.useEffect, c = e.useMemo, f = e.useDebugValue;
  return yv.useSyncExternalStoreWithSelector = function(d, h, p, y, b) {
    var A = l(null);
    if (A.current === null) {
      var w = { hasValue: !1, value: null };
      A.current = w;
    } else w = A.current;
    A = c(
      function() {
        function O(E) {
          if (!C) {
            if (C = !0, I = E, E = y(E), b !== void 0 && w.hasValue) {
              var $ = w.value;
              if (b($, E))
                return k = $;
            }
            return k = E;
          }
          if ($ = k, n(I, E)) return $;
          var F = y(E);
          return b !== void 0 && b($, F) ? (I = E, $) : (I = E, k = F);
        }
        var C = !1, I, k, T = p === void 0 ? null : p;
        return [
          function() {
            return O(h());
          },
          T === null ? void 0 : function() {
            return O(T());
          }
        ];
      },
      [h, p, y, b]
    );
    var S = a(d, A[0], A[1]);
    return u(
      function() {
        w.hasValue = !0, w.value = S;
      },
      [S]
    ), f(S), S;
  }, yv;
}
var ox;
function $_() {
  return ox || (ox = 1, mv.exports = D_()), mv.exports;
}
var R_ = $_(), ep = /* @__PURE__ */ x.createContext(null), L_ = (e) => e, Fe = () => {
  var e = x.useContext(ep);
  return e ? e.store.dispatch : L_;
}, Is = () => {
}, z_ = () => Is, B_ = (e, t) => e === t;
function se(e) {
  var t = x.useContext(ep), r = x.useMemo(() => t ? (n) => {
    if (n != null)
      return e(n);
  } : Is, [t, e]);
  return R_.useSyncExternalStoreWithSelector(t ? t.subscription.addNestedSub : z_, t ? t.store.getState : Is, t ? t.store.getState : Is, r, B_);
}
function F_(e, t = `expected a function, instead received ${typeof e}`) {
  if (typeof e != "function")
    throw new TypeError(t);
}
function W_(e, t = "expected all items to be functions, instead received the following types: ") {
  if (!e.every((r) => typeof r == "function")) {
    const r = e.map(
      (n) => typeof n == "function" ? `function ${n.name || "unnamed"}()` : typeof n
    ).join(", ");
    throw new TypeError(`${t}[${r}]`);
  }
}
var lx = (e) => Array.isArray(e) ? e : [e];
function U_(e) {
  const t = Array.isArray(e[0]) ? e[0] : e;
  return W_(
    t,
    "createSelector expects all input-selectors to be functions, but received the following types: "
  ), t;
}
function K_(e, t) {
  const r = [], { length: n } = e;
  for (let a = 0; a < n; a++)
    r.push(e[a].apply(null, t));
  return r;
}
var H_ = class {
  constructor(e) {
    this.value = e;
  }
  deref() {
    return this.value;
  }
}, V_ = () => typeof WeakRef > "u" ? H_ : WeakRef, fA = /* @__PURE__ */ V_(), G_ = 0, ux = 1;
function cs() {
  return {
    s: G_,
    v: void 0,
    o: null,
    p: null
  };
}
function Y_(e) {
  return e instanceof fA ? e.deref() : e;
}
function dA(e, t = {}) {
  let r = cs();
  const { resultEqualityCheck: n } = t;
  let a, l = 0;
  function u() {
    let c = r;
    const { length: f } = arguments;
    for (let p = 0, y = f; p < y; p++) {
      const b = arguments[p];
      if (typeof b == "function" || typeof b == "object" && b !== null) {
        let A = c.o;
        A === null && (c.o = A = /* @__PURE__ */ new WeakMap());
        const w = A.get(b);
        w === void 0 ? (c = cs(), A.set(b, c)) : c = w;
      } else {
        let A = c.p;
        A === null && (c.p = A = /* @__PURE__ */ new Map());
        const w = A.get(b);
        w === void 0 ? (c = cs(), A.set(b, c)) : c = w;
      }
    }
    const d = c;
    let h;
    if (c.s === ux)
      h = c.v;
    else if (h = e.apply(null, arguments), l++, n) {
      const p = Y_(a);
      p != null && n(p, h) && (h = p, l !== 0 && l--), a = typeof h == "object" && h !== null || typeof h == "function" ? /* @__PURE__ */ new fA(h) : h;
    }
    return d.s = ux, d.v = h, h;
  }
  return u.clearCache = () => {
    r = cs(), u.resetResultsCount();
  }, u.resultsCount = () => l, u.resetResultsCount = () => {
    l = 0;
  }, u;
}
function q_(e, ...t) {
  const r = typeof e == "function" ? {
    memoize: e,
    memoizeOptions: t
  } : e, n = (...a) => {
    let l = 0, u = 0, c, f = {}, d = a.pop();
    typeof d == "object" && (f = d, d = a.pop()), F_(
      d,
      `createSelector expects an output function after the inputs, but received: [${typeof d}]`
    );
    const h = {
      ...r,
      ...f
    }, {
      memoize: p,
      memoizeOptions: y = [],
      argsMemoize: b = dA,
      argsMemoizeOptions: A = []
    } = h, w = lx(y), S = lx(A), O = U_(a), C = p(function() {
      return l++, d.apply(
        null,
        arguments
      );
    }, ...w), I = b(function() {
      u++;
      const T = K_(
        O,
        arguments
      );
      return c = C.apply(null, T), c;
    }, ...S);
    return Object.assign(I, {
      resultFunc: d,
      memoizedResultFunc: C,
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
var R = /* @__PURE__ */ q_(dA);
function X_(e, t = 1) {
  const r = [], n = Math.floor(t), a = (l, u) => {
    for (let c = 0; c < l.length; c++) {
      const f = l[c];
      Array.isArray(f) && u < n ? a(f, u + 1) : r.push(f);
    }
  };
  return a(e, 0), r;
}
function oh(e, t, r) {
  return oA(r) && (typeof t == "number" && Xh(r) && cA(t) && t < r.length || typeof t == "string" && t in r) ? hl(r[t], e) : !1;
}
function sx(e) {
  return typeof e == "symbol" ? 1 : e === null ? 2 : e === void 0 ? 3 : e !== e ? 4 : 0;
}
const Q_ = (e, t, r) => {
  if (e !== t) {
    const n = sx(e), a = sx(t);
    if (n === a && n === 0) {
      if (e < t) return r === "desc" ? 1 : -1;
      if (e > t) return r === "desc" ? -1 : 1;
    }
    return r === "desc" ? a - n : n - a;
  }
  return 0;
}, Z_ = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, J_ = /^\w*$/;
function e2(e, t) {
  return Array.isArray(e) ? !1 : typeof e == "number" || typeof e == "boolean" || e == null || Kh(e) ? !0 : typeof e == "string" && (J_.test(e) || !Z_.test(e)) || t != null;
}
function t2(e, t, r, n) {
  if (e == null) return [];
  r = r, Array.isArray(e) || (e = Xh(e) ? Array.from(e) : Object.values(e)), Array.isArray(t) || (t = t == null ? [null] : [t]), t.length === 0 && (t = [null]), Array.isArray(r) || (r = r == null ? [] : [r]), r = r.map((c) => String(c));
  const a = (c, f) => {
    let d = c, h = 0;
    for (; h < f.length && d != null; ++h) d = d[f[h]];
    return h > 0 && h === f.length ? d : void 0;
  }, l = (c, f) => {
    if (c == null) return f;
    if (f != null)
      return typeof c == "object" && "key" in c ? Object.hasOwn(f, c.key) ? f[c.key] : a(f, c.path) : typeof c == "function" ? c(f) : Array.isArray(c) ? a(f, c) : f[c];
  }, u = t.map((c) => (Array.isArray(c) && c.length === 1 && (c = c[0]), c == null || typeof c == "function" || Array.isArray(c) || e2(c) ? c : {
    key: c,
    path: Hh(c)
  }));
  return e.map((c) => ({
    original: c,
    criteria: u.map((f) => l(f, c))
  })).slice().sort((c, f) => {
    for (let d = 0; d < u.length; d++) {
      const h = Q_(c.criteria[d], f.criteria[d], r[d]);
      if (h !== 0) return h;
    }
    return 0;
  }).map((c) => c.original);
}
function jc(e, ...t) {
  const r = t.length;
  return r > 1 && oh(e, t[0], t[1]) ? t = [] : r > 2 && oh(t[0], t[1], t[2]) && (t = [t[0]]), t2(e, X_(t), ["asc"]);
}
var vA = (e) => e.legend.settings, r2 = (e) => e.legend.size, n2 = (e) => e.legend.payload;
R([n2, vA], (e, t) => {
  var r = t.itemSorter, n = e.flat(1);
  return r ? jc(n, r) : n;
});
function i2(e, t) {
  return u2(e) || l2(e, t) || o2(e, t) || a2();
}
function a2() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function o2(e, t) {
  if (e) {
    if (typeof e == "string") return cx(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? cx(e, t) : void 0;
  }
}
function cx(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function l2(e, t) {
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
function u2(e) {
  if (Array.isArray(e)) return e;
}
var fs = 1;
function fx(e, t) {
  return Math.abs(e.height - t.height) > fs || Math.abs(e.left - t.left) > fs || Math.abs(e.top - t.top) > fs || Math.abs(e.width - t.width) > fs;
}
function dx(e) {
  var t = e.getBoundingClientRect();
  return {
    height: t.height,
    left: t.left,
    top: t.top,
    width: t.width
  };
}
function s2() {
  var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [], t = x.useState({
    height: 0,
    left: 0,
    top: 0,
    width: 0
  }), r = i2(t, 2), n = r[0], a = r[1], l = x.useRef(null), u = x.useRef(n);
  u.current = n;
  var c = x.useCallback(
    (f) => {
      if (l.current != null && (l.current.disconnect(), l.current = null), f != null) {
        var d = dx(f);
        if (fx(d, u.current) && a(d), typeof ResizeObserver < "u") {
          var h = new ResizeObserver(() => {
            var p = dx(f);
            fx(p, u.current) && a(p);
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
function jt(e) {
  return `Minified Redux error #${e}; visit https://redux.js.org/Errors?code=${e} for the full message or use the non-minified dev environment for full errors. `;
}
var c2 = typeof Symbol == "function" && Symbol.observable || "@@observable", vx = c2, bv = () => Math.random().toString(36).substring(7).split("").join("."), f2 = {
  INIT: `@@redux/INIT${/* @__PURE__ */ bv()}`,
  REPLACE: `@@redux/REPLACE${/* @__PURE__ */ bv()}`,
  PROBE_UNKNOWN_ACTION: () => `@@redux/PROBE_UNKNOWN_ACTION${bv()}`
}, $s = f2;
function tp(e) {
  if (typeof e != "object" || e === null)
    return !1;
  let t = e;
  for (; Object.getPrototypeOf(t) !== null; )
    t = Object.getPrototypeOf(t);
  return Object.getPrototypeOf(e) === t || Object.getPrototypeOf(e) === null;
}
function hA(e, t, r) {
  if (typeof e != "function")
    throw new Error(jt(2));
  if (typeof t == "function" && typeof r == "function" || typeof r == "function" && typeof arguments[3] == "function")
    throw new Error(jt(0));
  if (typeof t == "function" && typeof r > "u" && (r = t, t = void 0), typeof r < "u") {
    if (typeof r != "function")
      throw new Error(jt(1));
    return r(hA)(e, t);
  }
  let n = e, a = t, l = /* @__PURE__ */ new Map(), u = l, c = 0, f = !1;
  function d() {
    u === l && (u = /* @__PURE__ */ new Map(), l.forEach((S, O) => {
      u.set(O, S);
    }));
  }
  function h() {
    if (f)
      throw new Error(jt(3));
    return a;
  }
  function p(S) {
    if (typeof S != "function")
      throw new Error(jt(4));
    if (f)
      throw new Error(jt(5));
    let O = !0;
    d();
    const C = c++;
    return u.set(C, S), function() {
      if (O) {
        if (f)
          throw new Error(jt(6));
        O = !1, d(), u.delete(C), l = null;
      }
    };
  }
  function y(S) {
    if (!tp(S))
      throw new Error(jt(7));
    if (typeof S.type > "u")
      throw new Error(jt(8));
    if (typeof S.type != "string")
      throw new Error(jt(17));
    if (f)
      throw new Error(jt(9));
    try {
      f = !0, a = n(a, S);
    } finally {
      f = !1;
    }
    return (l = u).forEach((C) => {
      C();
    }), S;
  }
  function b(S) {
    if (typeof S != "function")
      throw new Error(jt(10));
    n = S, y({
      type: $s.REPLACE
    });
  }
  function A() {
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
          throw new Error(jt(11));
        function C() {
          const k = O;
          k.next && k.next(h());
        }
        return C(), {
          unsubscribe: S(C)
        };
      },
      [vx]() {
        return this;
      }
    };
  }
  return y({
    type: $s.INIT
  }), {
    dispatch: y,
    subscribe: p,
    getState: h,
    replaceReducer: b,
    [vx]: A
  };
}
function d2(e) {
  Object.keys(e).forEach((t) => {
    const r = e[t];
    if (typeof r(void 0, {
      type: $s.INIT
    }) > "u")
      throw new Error(jt(12));
    if (typeof r(void 0, {
      type: $s.PROBE_UNKNOWN_ACTION()
    }) > "u")
      throw new Error(jt(13));
  });
}
function pA(e) {
  const t = Object.keys(e), r = {};
  for (let l = 0; l < t.length; l++) {
    const u = t[l];
    typeof e[u] == "function" && (r[u] = e[u]);
  }
  const n = Object.keys(r);
  let a;
  try {
    d2(r);
  } catch (l) {
    a = l;
  }
  return function(u = {}, c) {
    if (a)
      throw a;
    let f = !1;
    const d = {};
    for (let h = 0; h < n.length; h++) {
      const p = n[h], y = r[p], b = u[p], A = y(b, c);
      if (typeof A > "u")
        throw c && c.type, new Error(jt(14));
      d[p] = A, f = f || A !== b;
    }
    return f = f || n.length !== Object.keys(u).length, f ? d : u;
  };
}
function Rs(...e) {
  return e.length === 0 ? (t) => t : e.length === 1 ? e[0] : e.reduce((t, r) => (...n) => t(r(...n)));
}
function v2(...e) {
  return (t) => (r, n) => {
    const a = t(r, n);
    let l = () => {
      throw new Error(jt(15));
    };
    const u = {
      getState: a.getState,
      dispatch: (f, ...d) => l(f, ...d)
    }, c = e.map((f) => f(u));
    return l = Rs(...c)(a.dispatch), {
      ...a,
      dispatch: l
    };
  };
}
function mA(e) {
  return tp(e) && "type" in e && typeof e.type == "string";
}
var yA = Symbol.for("immer-nothing"), hx = Symbol.for("immer-draftable"), Wt = Symbol.for("immer-state");
function Lr(e, ...t) {
  throw new Error(
    `[Immer] minified error nr: ${e}. Full error at: https://bit.ly/3cXEKWf`
  );
}
var dr = Object, Ua = dr.getPrototypeOf, Ls = "constructor", _c = "prototype", lh = "configurable", zs = "enumerable", js = "writable", wl = "value", Pn = (e) => !!e && !!e[Wt];
function Or(e) {
  var t;
  return e ? gA(e) || Mc(e) || !!e[hx] || !!((t = e[Ls]) != null && t[hx]) || Nc(e) || Dc(e) : !1;
}
var h2 = dr[_c][Ls].toString(), px = /* @__PURE__ */ new WeakMap();
function gA(e) {
  if (!e || !rp(e))
    return !1;
  const t = Ua(e);
  if (t === null || t === dr[_c])
    return !0;
  const r = dr.hasOwnProperty.call(t, Ls) && t[Ls];
  if (r === Object)
    return !0;
  if (!Na(r))
    return !1;
  let n = px.get(r);
  return n === void 0 && (n = Function.toString.call(r), px.set(r, n)), n === h2;
}
function Tc(e, t, r = !0) {
  Ml(e) === 0 ? (r ? Reflect.ownKeys(e) : dr.keys(e)).forEach((a) => {
    t(a, e[a], e);
  }) : e.forEach((n, a) => t(a, n, e));
}
function Ml(e) {
  const t = e[Wt];
  return t ? t.type_ : Mc(e) ? 1 : Nc(e) ? 2 : Dc(e) ? 3 : 0;
}
var wv = (e, t, r = Ml(e)) => r === 2 ? e.has(t) : dr[_c].hasOwnProperty.call(e, t), uh = (e, t, r = Ml(e)) => (
  // @ts-ignore
  r === 2 ? e.get(t) : e[t]
), Bs = (e, t, r, n = Ml(e)) => {
  n === 2 ? e.set(t, r) : n === 3 ? e.add(r) : e[t] = r;
};
function p2(e, t) {
  return e === t ? e !== 0 || 1 / e === 1 / t : e !== e && t !== t;
}
var Mc = Array.isArray, Nc = (e) => e instanceof Map, Dc = (e) => e instanceof Set, rp = (e) => typeof e == "object", Na = (e) => typeof e == "function", Sv = (e) => typeof e == "boolean";
function m2(e) {
  const t = +e;
  return Number.isInteger(t) && String(t) === e;
}
var gn = (e) => e.copy_ || e.base_, np = (e) => e.modified_ ? e.copy_ : e.base_;
function sh(e, t) {
  if (Nc(e))
    return new Map(e);
  if (Dc(e))
    return new Set(e);
  if (Mc(e))
    return Array[_c].slice.call(e);
  const r = gA(e);
  if (t === !0 || t === "class_only" && !r) {
    const n = dr.getOwnPropertyDescriptors(e);
    delete n[Wt];
    let a = Reflect.ownKeys(n);
    for (let l = 0; l < a.length; l++) {
      const u = a[l], c = n[u];
      c[js] === !1 && (c[js] = !0, c[lh] = !0), (c.get || c.set) && (n[u] = {
        [lh]: !0,
        [js]: !0,
        // could live with !!desc.set as well here...
        [zs]: c[zs],
        [wl]: e[u]
      });
    }
    return dr.create(Ua(e), n);
  } else {
    const n = Ua(e);
    if (n !== null && r)
      return { ...e };
    const a = dr.create(n);
    return dr.assign(a, e);
  }
}
function ip(e, t = !1) {
  return $c(e) || Pn(e) || !Or(e) || (Ml(e) > 1 && dr.defineProperties(e, {
    set: ds,
    add: ds,
    clear: ds,
    delete: ds
  }), dr.freeze(e), t && Tc(
    e,
    (r, n) => {
      ip(n, !0);
    },
    !1
  )), e;
}
function y2() {
  Lr(2);
}
var ds = {
  [wl]: y2
};
function $c(e) {
  return e === null || !rp(e) ? !0 : dr.isFrozen(e);
}
var Fs = "MapSet", ch = "Patches", mx = "ArrayMethods", xA = {};
function Vi(e) {
  const t = xA[e];
  return t || Lr(0, e), t;
}
var yx = (e) => !!xA[e], Sl, bA = () => Sl, g2 = (e, t) => ({
  drafts_: [],
  parent_: e,
  immer_: t,
  // Whenever the modified draft contains a draft from another scope, we
  // need to prevent auto-freezing so the unowned draft can be finalized.
  canAutoFreeze_: !0,
  unfinalizedDrafts_: 0,
  handledSet_: /* @__PURE__ */ new Set(),
  processedForPatches_: /* @__PURE__ */ new Set(),
  mapSetPlugin_: yx(Fs) ? Vi(Fs) : void 0,
  arrayMethodsPlugin_: yx(mx) ? Vi(mx) : void 0
});
function gx(e, t) {
  t && (e.patchPlugin_ = Vi(ch), e.patches_ = [], e.inversePatches_ = [], e.patchListener_ = t);
}
function fh(e) {
  dh(e), e.drafts_.forEach(x2), e.drafts_ = null;
}
function dh(e) {
  e === Sl && (Sl = e.parent_);
}
var xx = (e) => Sl = g2(Sl, e);
function x2(e) {
  const t = e[Wt];
  t.type_ === 0 || t.type_ === 1 ? t.revoke_() : t.revoked_ = !0;
}
function bx(e, t) {
  t.unfinalizedDrafts_ = t.drafts_.length;
  const r = t.drafts_[0];
  if (e !== void 0 && e !== r) {
    r[Wt].modified_ && (fh(t), Lr(4)), Or(e) && (e = wx(t, e));
    const { patchPlugin_: a } = t;
    a && a.generateReplacementPatches_(
      r[Wt].base_,
      e,
      t
    );
  } else
    e = wx(t, r);
  return b2(t, e, !0), fh(t), t.patches_ && t.patchListener_(t.patches_, t.inversePatches_), e !== yA ? e : void 0;
}
function wx(e, t) {
  if ($c(t))
    return t;
  const r = t[Wt];
  if (!r)
    return Ws(t, e.handledSet_, e);
  if (!Rc(r, e))
    return t;
  if (!r.modified_)
    return r.base_;
  if (!r.finalized_) {
    const { callbacks_: n } = r;
    if (n)
      for (; n.length > 0; )
        n.pop()(e);
    AA(r, e);
  }
  return r.copy_;
}
function b2(e, t, r = !1) {
  !e.parent_ && e.immer_.autoFreeze_ && e.canAutoFreeze_ && ip(t, r);
}
function wA(e) {
  e.finalized_ = !0, e.scope_.unfinalizedDrafts_--;
}
var Rc = (e, t) => e.scope_ === t, w2 = [];
function SA(e, t, r, n) {
  const a = gn(e), l = e.type_;
  if (n !== void 0 && uh(a, n, l) === t) {
    Bs(a, n, r, l);
    return;
  }
  if (!e.draftLocations_) {
    const c = e.draftLocations_ = /* @__PURE__ */ new Map();
    Tc(a, (f, d) => {
      if (Pn(d)) {
        const h = c.get(d) || [];
        h.push(f), c.set(d, h);
      }
    });
  }
  const u = e.draftLocations_.get(t) ?? w2;
  for (const c of u)
    Bs(a, c, r, l);
}
function S2(e, t, r) {
  e.callbacks_.push(function(a) {
    var c;
    const l = t;
    if (!l || !Rc(l, a))
      return;
    (c = a.mapSetPlugin_) == null || c.fixSetContents(l);
    const u = np(l);
    SA(e, l.draft_ ?? l, u, r), AA(l, a);
  });
}
function AA(e, t) {
  var n;
  if (e.modified_ && !e.finalized_ && (e.type_ === 3 || e.type_ === 1 && e.allIndicesReassigned_ || (((n = e.assigned_) == null ? void 0 : n.size) ?? 0) > 0)) {
    const { patchPlugin_: a } = t;
    if (a) {
      const l = a.getPath(e);
      l && a.generatePatches_(e, l, t);
    }
    wA(e);
  }
}
function A2(e, t, r) {
  const { scope_: n } = e;
  if (Pn(r)) {
    const a = r[Wt];
    Rc(a, n) && a.callbacks_.push(function() {
      _s(e);
      const u = np(a);
      SA(e, r, u, t);
    });
  } else Or(r) && e.callbacks_.push(function() {
    const l = gn(e);
    e.type_ === 3 ? l.has(r) && Ws(r, n.handledSet_, n) : uh(l, t, e.type_) === r && n.drafts_.length > 1 && (e.assigned_.get(t) ?? !1) === !0 && e.copy_ && Ws(
      uh(e.copy_, t, e.type_),
      n.handledSet_,
      n
    );
  });
}
function Ws(e, t, r) {
  return !r.immer_.autoFreeze_ && r.unfinalizedDrafts_ < 1 || Pn(e) || t.has(e) || !Or(e) || $c(e) || (t.add(e), Tc(e, (n, a) => {
    if (Pn(a)) {
      const l = a[Wt];
      if (Rc(l, r)) {
        const u = np(l);
        Bs(e, n, u, e.type_), wA(l);
      }
    } else Or(a) && Ws(a, t, r);
  })), e;
}
function P2(e, t) {
  const r = Mc(e), n = {
    type_: r ? 1 : 0,
    // Track which produce call this is associated with.
    scope_: t ? t.scope_ : bA(),
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
  let a = n, l = Us;
  r && (a = [n], l = Al);
  const { revoke: u, proxy: c } = Proxy.revocable(a, l);
  return n.draft_ = c, n.revoke_ = u, [c, n];
}
var Us = {
  get(e, t) {
    if (t === Wt)
      return e;
    let r = e.scope_.arrayMethodsPlugin_;
    const n = e.type_ === 1 && typeof t == "string";
    if (n && r != null && r.isArrayOperationMethod(t))
      return r.createMethodInterceptor(e, t);
    const a = gn(e);
    if (!wv(a, t, e.type_))
      return E2(e, a, t);
    const l = a[t];
    if (e.finalized_ || !Or(l) || n && e.operationMethod && (r != null && r.isMutatingArrayMethod(
      e.operationMethod
    )) && m2(t))
      return l;
    if (l === Av(e.base_, t) || O2(e, t, l)) {
      _s(e);
      const u = e.type_ === 1 ? +t : t, c = hh(e.scope_, l, e, u);
      return e.copy_[u] = c;
    }
    return l;
  },
  has(e, t) {
    return t in gn(e);
  },
  ownKeys(e) {
    return Reflect.ownKeys(gn(e));
  },
  set(e, t, r) {
    const n = PA(gn(e), t);
    if (n != null && n.set)
      return n.set.call(e.draft_, r), !0;
    if (!e.modified_) {
      const a = Av(gn(e), t), l = a == null ? void 0 : a[Wt];
      if (l && l.base_ === r)
        return e.copy_[t] = r, e.assigned_.set(t, !1), !0;
      if (p2(r, a) && (r !== void 0 || wv(e.base_, t, e.type_)))
        return !0;
      _s(e), vh(e);
    }
    return e.copy_[t] === r && // special case: handle new props with value 'undefined'
    (r !== void 0 || wv(e.copy_, t, e.type_)) || // special case: NaN
    Number.isNaN(r) && Number.isNaN(e.copy_[t]) || (e.copy_[t] = r, e.assigned_.set(t, !0), A2(e, t, r)), !0;
  },
  deleteProperty(e, t) {
    return _s(e), Av(e.base_, t) !== void 0 || t in e.base_ ? (e.assigned_.set(t, !1), vh(e)) : e.assigned_.delete(t), e.copy_ && delete e.copy_[t], !0;
  },
  // Note: We never coerce `desc.value` into an Immer draft, because we can't make
  // the same guarantee in ES5 mode.
  getOwnPropertyDescriptor(e, t) {
    const r = gn(e), n = Reflect.getOwnPropertyDescriptor(r, t);
    return n && {
      [js]: !0,
      [lh]: e.type_ !== 1 || t !== "length",
      [zs]: n[zs],
      [wl]: r[t]
    };
  },
  defineProperty() {
    Lr(11);
  },
  getPrototypeOf(e) {
    return Ua(e.base_);
  },
  setPrototypeOf() {
    Lr(12);
  }
}, Al = {};
for (let e in Us) {
  let t = Us[e];
  Al[e] = function() {
    const r = arguments;
    return r[0] = r[0][0], t.apply(this, r);
  };
}
Al.deleteProperty = function(e, t) {
  return Al.set.call(this, e, t, void 0);
};
Al.set = function(e, t, r) {
  return Us.set.call(this, e[0], t, r, e[0]);
};
function Av(e, t) {
  const r = e[Wt];
  return (r ? gn(r) : e)[t];
}
function O2(e, t, r) {
  var n;
  return e.type_ !== 1 || !e.allIndicesReassigned_ || (n = e.assigned_) != null && n.get(t) || !Or(r) || r[Wt] ? !1 : e.baseRefs_.has(r);
}
function E2(e, t, r) {
  var a;
  const n = PA(t, r);
  return n ? wl in n ? n[wl] : (
    // This is a very special case, if the prop is a getter defined by the
    // prototype, we should invoke it with the draft as context!
    (a = n.get) == null ? void 0 : a.call(e.draft_)
  ) : void 0;
}
function PA(e, t) {
  if (!(t in e))
    return;
  let r = Ua(e);
  for (; r; ) {
    const n = Object.getOwnPropertyDescriptor(r, t);
    if (n)
      return n;
    r = Ua(r);
  }
}
function vh(e) {
  e.modified_ || (e.modified_ = !0, e.parent_ && vh(e.parent_));
}
function _s(e) {
  e.copy_ || (e.assigned_ = /* @__PURE__ */ new Map(), e.copy_ = sh(
    e.base_,
    e.scope_.immer_.useStrictShallowCopy_
  ));
}
var k2 = class {
  constructor(e) {
    this.autoFreeze_ = !0, this.useStrictShallowCopy_ = !1, this.useStrictIteration_ = !1, this.produce = (t, r, n) => {
      if (Na(t) && !Na(r)) {
        const l = r;
        r = t;
        const u = this;
        return function(f = l, ...d) {
          return u.produce(f, (h) => r.call(this, h, ...d));
        };
      }
      Na(r) || Lr(6), n !== void 0 && !Na(n) && Lr(7);
      let a;
      if (Or(t)) {
        const l = xx(this), u = hh(l, t, void 0);
        let c = !0;
        try {
          a = r(u), c = !1;
        } finally {
          c ? fh(l) : dh(l);
        }
        return gx(l, n), bx(a, l);
      } else if (!t || !rp(t)) {
        if (a = r(t), a === void 0 && (a = t), a === yA && (a = void 0), this.autoFreeze_ && ip(a, !0), n) {
          const l = [], u = [];
          Vi(ch).generateReplacementPatches_(t, a, {
            patches_: l,
            inversePatches_: u
          }), n(l, u);
        }
        return a;
      } else
        Lr(1, t);
    }, this.produceWithPatches = (t, r) => {
      if (Na(t))
        return (u, ...c) => this.produceWithPatches(u, (f) => t(f, ...c));
      let n, a;
      return [this.produce(t, r, (u, c) => {
        n = u, a = c;
      }), n, a];
    }, Sv(e == null ? void 0 : e.autoFreeze) && this.setAutoFreeze(e.autoFreeze), Sv(e == null ? void 0 : e.useStrictShallowCopy) && this.setUseStrictShallowCopy(e.useStrictShallowCopy), Sv(e == null ? void 0 : e.useStrictIteration) && this.setUseStrictIteration(e.useStrictIteration);
  }
  createDraft(e) {
    Or(e) || Lr(8), Pn(e) && (e = Sr(e));
    const t = xx(this), r = hh(t, e, void 0);
    return r[Wt].isManual_ = !0, dh(t), r;
  }
  finishDraft(e, t) {
    const r = e && e[Wt];
    (!r || !r.isManual_) && Lr(9);
    const { scope_: n } = r;
    return gx(n, t), bx(void 0, n);
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
    const n = Vi(ch).applyPatches_;
    return Pn(e) ? n(e, t) : this.produce(
      e,
      (a) => n(a, t)
    );
  }
};
function hh(e, t, r, n) {
  const [a, l] = Nc(t) ? Vi(Fs).proxyMap_(t, r) : Dc(t) ? Vi(Fs).proxySet_(t, r) : P2(t, r);
  return ((r == null ? void 0 : r.scope_) ?? bA()).drafts_.push(a), l.callbacks_ = (r == null ? void 0 : r.callbacks_) ?? [], l.key_ = n, r && n !== void 0 ? S2(r, l, n) : l.callbacks_.push(function(f) {
    var h;
    (h = f.mapSetPlugin_) == null || h.fixSetContents(l);
    const { patchPlugin_: d } = f;
    l.modified_ && d && d.generatePatches_(l, [], f);
  }), a;
}
function Sr(e) {
  return Pn(e) || Lr(10, e), OA(e);
}
function OA(e) {
  if (!Or(e) || $c(e))
    return e;
  const t = e[Wt];
  let r, n = !0;
  if (t) {
    if (!t.modified_)
      return t.base_;
    t.finalized_ = !0, r = sh(e, t.scope_.immer_.useStrictShallowCopy_), n = t.scope_.immer_.shouldUseStrictIteration();
  } else
    r = sh(e, !0);
  return Tc(
    r,
    (a, l) => {
      Bs(r, a, OA(l));
    },
    n
  ), t && (t.finalized_ = !1), r;
}
var Pv = globalThis.Iterator;
Pv == null || Pv.from;
var C2 = new k2(), EA = C2.produce, Ne = (e) => e;
function kA(e) {
  return ({ dispatch: r, getState: n }) => (a) => (l) => typeof l == "function" ? l(r, n, e) : a(l);
}
var I2 = kA(), j2 = kA, _2 = typeof window < "u" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : function() {
  if (arguments.length !== 0)
    return typeof arguments[0] == "object" ? Rs : Rs.apply(null, arguments);
};
function hr(e, t) {
  function r(...n) {
    if (t) {
      let a = t(...n);
      if (!a)
        throw new Error(vr(0));
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
  return r.toString = () => `${e}`, r.type = e, r.match = (n) => mA(n) && n.type === e, r;
}
var CA = class fl extends Array {
  constructor(...t) {
    super(...t), Object.setPrototypeOf(this, fl.prototype);
  }
  static get [Symbol.species]() {
    return fl;
  }
  concat(...t) {
    return super.concat.apply(this, t);
  }
  prepend(...t) {
    return t.length === 1 && Array.isArray(t[0]) ? new fl(...t[0].concat(this)) : new fl(...t.concat(this));
  }
};
function Sx(e) {
  return Or(e) ? EA(e, () => {
  }) : e;
}
function vs(e, t, r) {
  return e.has(t) ? e.get(t) : e.set(t, r(t)).get(t);
}
function T2(e) {
  return typeof e == "boolean";
}
var M2 = () => function(t) {
  const {
    thunk: r = !0,
    immutableCheck: n = !0,
    serializableCheck: a = !0,
    actionCreatorCheck: l = !0
  } = t ?? {};
  let u = new CA();
  return r && (T2(r) ? u.push(I2) : u.push(j2(r.extraArgument))), u;
}, IA = "RTK_autoBatch", He = () => (e) => ({
  payload: e,
  meta: {
    [IA]: !0
  }
}), Ax = (e) => (t) => {
  setTimeout(t, e);
}, N2 = (e, t) => (r) => {
  let n = !1;
  const a = () => {
    n || (n = !0, cancelAnimationFrame(l), clearTimeout(u), r());
  }, l = e(a), u = setTimeout(a, t);
}, jA = (e = {
  type: "raf"
}) => (t) => (...r) => {
  const n = t(...r);
  let a = !0, l = !1, u = !1;
  const c = /* @__PURE__ */ new Set(), f = e.type === "tick" ? queueMicrotask : e.type === "raf" ? (
    // requestAnimationFrame won't exist in SSR environments. Fall back to a vague approximation just to keep from erroring.
    typeof window < "u" && window.requestAnimationFrame ? N2(window.requestAnimationFrame, 100) : Ax(10)
  ) : e.type === "callback" ? e.queueNotification : Ax(e.timeout), d = () => {
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
        return a = !((p = h == null ? void 0 : h.meta) != null && p[IA]), l = !a, l && (u || (u = !0, f(d))), n.dispatch(h);
      } finally {
        a = !0;
      }
    }
  });
}, D2 = (e) => function(r) {
  const {
    autoBatch: n = !0
  } = r ?? {};
  let a = new CA(e);
  return n && a.push(jA(typeof n == "object" ? n : void 0)), a;
};
function $2(e) {
  const t = M2(), {
    reducer: r = void 0,
    middleware: n,
    devTools: a = !0,
    preloadedState: l = void 0,
    enhancers: u = void 0
  } = e || {};
  let c;
  if (typeof r == "function")
    c = r;
  else if (tp(r))
    c = pA(r);
  else
    throw new Error(vr(1));
  let f;
  typeof n == "function" ? f = n(t) : f = t();
  let d = Rs;
  a && (d = _2({
    // Enable capture of stack traces for dispatched Redux actions
    trace: !1,
    ...typeof a == "object" && a
  }));
  const h = v2(...f), p = D2(h);
  let y = typeof u == "function" ? u(p) : p();
  const b = d(...y);
  return hA(c, l, b);
}
function _A(e) {
  const t = {}, r = [];
  let n;
  const a = {
    addCase(l, u) {
      const c = typeof l == "string" ? l : l.type;
      if (!c)
        throw new Error(vr(28));
      if (c in t)
        throw new Error(vr(29));
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
function R2(e) {
  return typeof e == "function";
}
function L2(e, t) {
  let [r, n, a] = _A(t), l;
  if (R2(e))
    l = () => Sx(e());
  else {
    const c = Sx(e);
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
        if (Pn(h)) {
          const b = p(h, f);
          return b === void 0 ? h : b;
        } else {
          if (Or(h))
            return EA(h, (y) => p(y, f));
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
var z2 = "ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZXIjQW", B2 = (e = 21) => {
  let t = "", r = e;
  for (; r--; )
    t += z2[Math.random() * 64 | 0];
  return t;
}, F2 = /* @__PURE__ */ Symbol.for("rtk-slice-createasyncthunk");
function W2(e, t) {
  return `${e}/${t}`;
}
function U2({
  creators: e
} = {}) {
  var r;
  const t = (r = e == null ? void 0 : e.asyncThunk) == null ? void 0 : r[F2];
  return function(a) {
    const {
      name: l,
      reducerPath: u = l
    } = a;
    if (!l)
      throw new Error(vr(11));
    const c = (typeof a.reducers == "function" ? a.reducers(H2()) : a.reducers) || {}, f = Object.keys(c), d = {
      sliceCaseReducersByName: {},
      sliceCaseReducersByType: {},
      actionCreators: {},
      sliceMatchers: []
    }, h = {
      addCase(k, T) {
        const E = typeof k == "string" ? k : k.type;
        if (!E)
          throw new Error(vr(12));
        if (E in d.sliceCaseReducersByType)
          throw new Error(vr(13));
        return d.sliceCaseReducersByType[E] = T, h;
      },
      addMatcher(k, T) {
        return d.sliceMatchers.push({
          matcher: k,
          reducer: T
        }), h;
      },
      exposeAction(k, T) {
        return d.actionCreators[k] = T, h;
      },
      exposeCaseReducer(k, T) {
        return d.sliceCaseReducersByName[k] = T, h;
      }
    };
    f.forEach((k) => {
      const T = c[k], E = {
        reducerName: k,
        type: W2(l, k),
        createNotation: typeof a.reducers == "function"
      };
      G2(T) ? q2(E, T, h, t) : V2(E, T, h);
    });
    function p() {
      const [k = {}, T = [], E = void 0] = typeof a.extraReducers == "function" ? _A(a.extraReducers) : [a.extraReducers], $ = {
        ...k,
        ...d.sliceCaseReducersByType
      };
      return L2(a.initialState, (F) => {
        for (let U in $)
          F.addCase(U, $[U]);
        for (let U of d.sliceMatchers)
          F.addMatcher(U.matcher, U.reducer);
        for (let U of T)
          F.addMatcher(U.matcher, U.reducer);
        E && F.addDefaultCase(E);
      });
    }
    const y = (k) => k, b = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new WeakMap();
    let w;
    function S(k, T) {
      return w || (w = p()), w(k, T);
    }
    function O() {
      return w || (w = p()), w.getInitialState();
    }
    function C(k, T = !1) {
      function E(F) {
        let U = F[k];
        return typeof U > "u" && T && (U = vs(A, E, O)), U;
      }
      function $(F = y) {
        const U = vs(b, T, () => /* @__PURE__ */ new WeakMap());
        return vs(U, F, () => {
          const H = {};
          for (const [G, W] of Object.entries(a.selectors ?? {}))
            H[G] = K2(W, F, () => vs(A, F, O), T);
          return H;
        });
      }
      return {
        reducerPath: k,
        getSelectors: $,
        get selectors() {
          return $(E);
        },
        selectSlice: E
      };
    }
    const I = {
      name: l,
      reducer: S,
      actions: d.actionCreators,
      caseReducers: d.sliceCaseReducersByName,
      getInitialState: O,
      ...C(u),
      injectInto(k, {
        reducerPath: T,
        ...E
      } = {}) {
        const $ = T ?? u;
        return k.inject({
          reducerPath: $,
          reducer: S
        }, E), {
          ...I,
          ...C($, !0)
        };
      }
    };
    return I;
  };
}
function K2(e, t, r, n) {
  function a(l, ...u) {
    let c = t(l);
    return typeof c > "u" && n && (c = r()), e(c, ...u);
  }
  return a.unwrapped = e, a;
}
var Kt = /* @__PURE__ */ U2();
function H2() {
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
function V2({
  type: e,
  reducerName: t,
  createNotation: r
}, n, a) {
  let l, u;
  if ("reducer" in n) {
    if (r && !Y2(n))
      throw new Error(vr(17));
    l = n.reducer, u = n.prepare;
  } else
    l = n;
  a.addCase(e, l).exposeCaseReducer(t, l).exposeAction(t, u ? hr(e, u) : hr(e));
}
function G2(e) {
  return e._reducerDefinitionType === "asyncThunk";
}
function Y2(e) {
  return e._reducerDefinitionType === "reducerWithPrepare";
}
function q2({
  type: e,
  reducerName: t
}, r, n, a) {
  if (!a)
    throw new Error(vr(18));
  const {
    payloadCreator: l,
    fulfilled: u,
    pending: c,
    rejected: f,
    settled: d,
    options: h
  } = r, p = a(e, l, h);
  n.exposeAction(t, p), u && n.addCase(p.fulfilled, u), c && n.addCase(p.pending, c), f && n.addCase(p.rejected, f), d && n.addMatcher(p.settled, d), n.exposeCaseReducer(t, {
    fulfilled: u || hs,
    pending: c || hs,
    rejected: f || hs,
    settled: d || hs
  });
}
function hs() {
}
var X2 = "task", TA = "listener", MA = "completed", ap = "cancelled", Q2 = `task-${ap}`, Z2 = `task-${MA}`, ph = `${TA}-${ap}`, J2 = `${TA}-${MA}`, Lc = class {
  constructor(e) {
    ls(this, "code");
    ls(this, "name", "TaskAbortError");
    ls(this, "message");
    this.code = e, this.message = `${X2} ${ap} (reason: ${e})`;
  }
}, op = (e, t) => {
  if (typeof e != "function")
    throw new TypeError(vr(32));
}, Ks = () => {
}, NA = (e, t = Ks) => (e.catch(t), e), DA = (e, t) => (e.addEventListener("abort", t, {
  once: !0
}), () => e.removeEventListener("abort", t)), Bi = (e) => {
  if (e.aborted)
    throw new Lc(e.reason);
};
function $A(e, t) {
  let r = Ks;
  return new Promise((n, a) => {
    const l = () => a(new Lc(e.reason));
    if (e.aborted) {
      l();
      return;
    }
    r = DA(e, l), t.finally(() => r()).then(n, a);
  }).finally(() => {
    r = Ks;
  });
}
var eT = async (e, t) => {
  try {
    return await Promise.resolve(), {
      status: "ok",
      value: await e()
    };
  } catch (r) {
    return {
      status: r instanceof Lc ? "cancelled" : "rejected",
      error: r
    };
  } finally {
    t == null || t();
  }
}, Hs = (e) => (t) => NA($A(e, t).then((r) => (Bi(e), r))), RA = (e) => {
  const t = Hs(e);
  return (r) => t(new Promise((n) => setTimeout(n, r)));
}, {
  assign: Ra
} = Object, Px = {}, zc = "listenerMiddleware", tT = (e, t) => {
  const r = (n) => DA(e, () => n.abort(e.reason));
  return (n, a) => {
    op(n);
    const l = new AbortController();
    r(l);
    const u = eT(async () => {
      Bi(e), Bi(l.signal);
      const c = await n({
        pause: Hs(l.signal),
        delay: RA(l.signal),
        signal: l.signal
      });
      return Bi(l.signal), c;
    }, () => l.abort(Z2));
    return a != null && a.autoJoin && t.push(u.catch(Ks)), {
      result: Hs(e)(u),
      cancel() {
        l.abort(Q2);
      }
    };
  };
}, rT = (e, t) => {
  const r = async (n, a) => {
    Bi(t);
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
      const f = await $A(t, Promise.race(c));
      return Bi(t), f;
    } finally {
      l();
    }
  };
  return ((n, a) => NA(r(n, a)));
}, LA = (e) => {
  let {
    type: t,
    actionCreator: r,
    matcher: n,
    predicate: a,
    effect: l
  } = e;
  if (t)
    a = hr(t).match;
  else if (r)
    t = r.type, a = r.match;
  else if (n)
    a = n;
  else if (!a) throw new Error(vr(21));
  return op(l), {
    predicate: a,
    type: t,
    effect: l
  };
}, zA = /* @__PURE__ */ Ra((e) => {
  const {
    type: t,
    predicate: r,
    effect: n
  } = LA(e);
  return {
    id: B2(),
    effect: n,
    type: t,
    predicate: r,
    pending: /* @__PURE__ */ new Set(),
    unsubscribe: () => {
      throw new Error(vr(22));
    }
  };
}, {
  withTypes: () => zA
}), Ox = (e, t) => {
  const {
    type: r,
    effect: n,
    predicate: a
  } = LA(t);
  return Array.from(e.values()).find((l) => (typeof r == "string" ? l.type === r : l.predicate === a) && l.effect === n);
}, mh = (e) => {
  e.pending.forEach((t) => {
    t.abort(ph);
  });
}, nT = (e, t) => () => {
  for (const r of t.keys())
    mh(r);
  e.clear();
}, Ex = (e, t, r) => {
  try {
    e(t, r);
  } catch (n) {
    setTimeout(() => {
      throw n;
    }, 0);
  }
}, BA = /* @__PURE__ */ Ra(/* @__PURE__ */ hr(`${zc}/add`), {
  withTypes: () => BA
}), iT = /* @__PURE__ */ hr(`${zc}/removeAll`), FA = /* @__PURE__ */ Ra(/* @__PURE__ */ hr(`${zc}/remove`), {
  withTypes: () => FA
}), aT = (...e) => {
  console.error(`${zc}/error`, ...e);
}, Nl = (e = {}) => {
  const t = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), n = (b) => {
    const A = r.get(b) ?? 0;
    r.set(b, A + 1);
  }, a = (b) => {
    const A = r.get(b) ?? 1;
    A === 1 ? r.delete(b) : r.set(b, A - 1);
  }, {
    extra: l,
    onError: u = aT
  } = e;
  op(u);
  const c = (b) => (b.unsubscribe = () => t.delete(b.id), t.set(b.id, b), (A) => {
    b.unsubscribe(), A != null && A.cancelActive && mh(b);
  }), f = ((b) => {
    const A = Ox(t, b) ?? zA(b);
    return c(A);
  });
  Ra(f, {
    withTypes: () => f
  });
  const d = (b) => {
    const A = Ox(t, b);
    return A && (A.unsubscribe(), b.cancelActive && mh(A)), !!A;
  };
  Ra(d, {
    withTypes: () => d
  });
  const h = async (b, A, w, S) => {
    const O = new AbortController(), C = rT(f, O.signal), I = [];
    try {
      b.pending.add(O), n(b), await Promise.resolve(b.effect(
        A,
        // Use assign() rather than ... to avoid extra helper functions added to bundle
        Ra({}, w, {
          getOriginalState: S,
          condition: (k, T) => C(k, T).then(Boolean),
          take: C,
          delay: RA(O.signal),
          pause: Hs(O.signal),
          extra: l,
          signal: O.signal,
          fork: tT(O.signal, I),
          unsubscribe: b.unsubscribe,
          subscribe: () => {
            t.set(b.id, b);
          },
          cancelActiveListeners: () => {
            b.pending.forEach((k, T, E) => {
              k !== O && (k.abort(ph), E.delete(k));
            });
          },
          cancel: () => {
            O.abort(ph), b.pending.delete(O);
          },
          throwIfCancelled: () => {
            Bi(O.signal);
          }
        })
      ));
    } catch (k) {
      k instanceof Lc || Ex(u, k, {
        raisedBy: "effect"
      });
    } finally {
      await Promise.all(I), O.abort(J2), a(b), b.pending.delete(O);
    }
  }, p = nT(t, r);
  return {
    middleware: (b) => (A) => (w) => {
      if (!mA(w))
        return A(w);
      if (BA.match(w))
        return f(w.payload);
      if (iT.match(w)) {
        p();
        return;
      }
      if (FA.match(w))
        return d(w.payload);
      let S = b.getState();
      const O = () => {
        if (S === Px)
          throw new Error(vr(23));
        return S;
      };
      let C;
      try {
        if (C = A(w), t.size > 0) {
          const I = b.getState(), k = Array.from(t.values());
          for (const T of k) {
            let E = !1;
            try {
              E = T.predicate(w, I, S);
            } catch ($) {
              E = !1, Ex(u, $, {
                raisedBy: "predicate"
              });
            }
            E && h(T, w, b, O);
          }
        }
      } finally {
        S = Px;
      }
      return C;
    },
    startListening: f,
    stopListening: d,
    clearListeners: p
  };
};
function vr(e) {
  return `Minified Redux Toolkit error #${e}; visit https://redux-toolkit.js.org/Errors?code=${e} for the full message or use the non-minified dev environment for full errors. `;
}
var oT = {
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
}, WA = Kt({
  name: "chartLayout",
  initialState: oT,
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
}), Bc = WA.actions, lT = Bc.setMargin, uT = Bc.setLayout, sT = Bc.setChartSize, cT = Bc.setScale, fT = WA.reducer;
function UA(e, t, r) {
  return Array.isArray(e) && e && t + r !== 0 ? e.slice(t, r + 1) : e;
}
function Oe(e) {
  return Number.isFinite(e);
}
function an(e) {
  return typeof e == "number" && e > 0 && Number.isFinite(e);
}
function kx(e, t) {
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
    t % 2 ? kx(Object(r), !0).forEach(function(n) {
      dT(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : kx(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function dT(e, t, r) {
  return (t = vT(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function vT(e) {
  var t = hT(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function hT(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function $e(e, t, r) {
  return Ze(e) || Ze(t) ? r : nn(t) ? rn(e, t, r) : typeof t == "function" ? t(e) : r;
}
var pT = (e, t, r) => {
  if (t && r) {
    var n = r.width, a = r.height, l = t.align, u = t.verticalAlign, c = t.layout, f = t.position, d = t.offset, h = d === void 0 ? 0 : d;
    if (f != null) {
      if (Nj(f)) {
        if (f === "top" && ie(e.top))
          return rr(rr({}, e), {}, {
            top: e.top + (a || 0) + h
          });
        if (f === "bottom" && ie(e.bottom))
          return rr(rr({}, e), {}, {
            bottom: e.bottom + (a || 0) + h
          });
        if (f === "left" && ie(e.left))
          return rr(rr({}, e), {}, {
            left: e.left + (n || 0) + h
          });
        if (f === "right" && ie(e.right))
          return rr(rr({}, e), {}, {
            right: e.right + (n || 0) + h
          });
      }
      return e;
    }
    if ((c === "vertical" || c === "horizontal" && u === "middle") && l !== "center" && ie(e[l]))
      return rr(rr({}, e), {}, {
        [l]: e[l] + (n || 0)
      });
    if ((c === "horizontal" || c === "vertical" && l === "center") && u !== "middle" && ie(e[u]))
      return rr(rr({}, e), {}, {
        [u]: e[u] + (a || 0)
      });
  }
  return e;
}, ln = (e, t) => e === "horizontal" && t === "xAxis" || e === "vertical" && t === "yAxis" || e === "centric" && t === "angleAxis" || e === "radial" && t === "radiusAxis", KA = (e, t, r, n) => {
  if (n)
    return e.map((c) => c.coordinate);
  var a, l, u = e.map((c) => (c.coordinate === t && (a = !0), c.coordinate === r && (l = !0), c.coordinate));
  return a || u.push(t), l || u.push(r), u;
}, HA = (e, t, r) => {
  if (!e)
    return null;
  var n = e.duplicateDomain, a = e.type, l = e.range, u = e.scale, c = e.realScaleType, f = e.isCategorical, d = e.categoricalDomain, h = e.tickCount, p = e.ticks, y = e.niceTicks, b = e.axisType;
  if (!u)
    return null;
  var A = c === "scaleBand" && u.bandwidth ? u.bandwidth() / 2 : 2, w = a === "category" && u.bandwidth ? u.bandwidth() / A : 0;
  if (w = b === "angleAxis" && l && l.length >= 2 ? Ot(l[0] - l[1]) * 2 * w : w, p || y) {
    var S = (p || y || []).map((O, C) => {
      var I = n ? n.indexOf(O) : O, k = u.map(I);
      return Oe(k) ? {
        // If the scaleContent is not a number, the coordinate will be NaN.
        // That could be the case for example with a PointScale and a string as domain.
        coordinate: k + w,
        value: O,
        offset: w,
        index: C
      } : null;
    }).filter(Yt);
    return S;
  }
  return f && d ? d.map((O, C) => {
    var I = u.map(O);
    return Oe(I) ? {
      coordinate: I + w,
      value: O,
      index: C,
      offset: w
    } : null;
  }).filter(Yt) : u.ticks && h != null ? u.ticks(h).map((O, C) => {
    var I = u.map(O);
    return Oe(I) ? {
      coordinate: I + w,
      value: O,
      index: C,
      offset: w
    } : null;
  }).filter(Yt) : u.domain().map((O, C) => {
    var I = u.map(O);
    return Oe(I) ? {
      coordinate: I + w,
      // @ts-expect-error can't use Date as an index
      value: n ? n[O] : O,
      index: C,
      offset: w
    } : null;
  }).filter(Yt);
}, mT = (e, t) => {
  if (!t || t.length !== 2 || !ie(t[0]) || !ie(t[1]))
    return e;
  var r = Math.min(t[0], t[1]), n = Math.max(t[0], t[1]), a = [e[0], e[1]];
  return (!ie(e[0]) || e[0] < r) && (a[0] = r), (!ie(e[1]) || e[1] > n) && (a[1] = n), a[0] > n && (a[0] = n), a[1] < r && (a[1] = r), a;
}, yT = (e) => {
  var t, r = e.length;
  if (!(r <= 0)) {
    var n = (t = e[0]) === null || t === void 0 ? void 0 : t.length;
    if (!(n == null || n <= 0))
      for (var a = 0; a < n; ++a)
        for (var l = 0, u = 0, c = 0; c < r; ++c) {
          var f = e[c], d = f == null ? void 0 : f[a];
          if (d != null) {
            var h = d[1], p = d[0], y = Br(h) ? p : h;
            y >= 0 ? (d[0] = l, l += y, d[1] = l) : (d[0] = u, u += y, d[1] = u);
          }
        }
  }
}, gT = (e) => {
  var t, r = e.length;
  if (!(r <= 0)) {
    var n = (t = e[0]) === null || t === void 0 ? void 0 : t.length;
    if (!(n == null || n <= 0))
      for (var a = 0; a < n; ++a)
        for (var l = 0, u = 0; u < r; ++u) {
          var c = e[u], f = c == null ? void 0 : c[a];
          if (f != null) {
            var d = Br(f[1]) ? f[0] : f[1];
            d >= 0 ? (f[0] = l, l += d, f[1] = l) : (f[0] = 0, f[1] = 0);
          }
        }
  }
}, xT = {
  sign: yT,
  // @ts-expect-error definitelytyped types are incorrect
  expand: e_,
  // @ts-expect-error definitelytyped types are incorrect
  none: Hi,
  // @ts-expect-error definitelytyped types are incorrect
  silhouette: t_,
  // @ts-expect-error definitelytyped types are incorrect
  wiggle: r_,
  positive: gT
}, bT = (e, t, r) => {
  var n, a = (n = xT[r]) !== null && n !== void 0 ? n : Hi, l = Jj().keys(t).value((c, f) => Number($e(c, f, 0))).order(rh).offset(a), u = l(e);
  return u.forEach((c, f) => {
    c.forEach((d, h) => {
      var p = $e(e[h], t[f], 0);
      Array.isArray(p) && p.length === 2 && ie(p[0]) && ie(p[1]) && (d[0] = p[0], d[1] = p[1]);
    });
  }), u;
};
function VA(e) {
  return e == null ? void 0 : String(e);
}
function Cx(e) {
  var t = e.axis, r = e.ticks, n = e.bandSize, a = e.entry, l = e.index, u = e.dataKey;
  if (t.type === "category") {
    if (!t.allowDuplicatedCategory && t.dataKey && !Ze(a[t.dataKey])) {
      var c = PS(r, "value", a[t.dataKey]);
      if (c)
        return c.coordinate + n / 2;
    }
    return r != null && r[l] ? r[l].coordinate + n / 2 : null;
  }
  var f = $e(a, Ze(u) ? t.dataKey : u), d = t.scale.map(f);
  return ie(d) ? d : null;
}
var Ix = (e) => {
  var t = e.axis, r = e.ticks, n = e.offset, a = e.bandSize, l = e.entry, u = e.index;
  if (t.type === "category")
    return r[u] ? r[u].coordinate + n : null;
  var c = $e(l, t.dataKey, t.scale.domain()[u]);
  if (Ze(c))
    return null;
  var f = t.scale.map(c);
  return ie(f) ? f - a / 2 + n : null;
}, wT = (e) => {
  var t = e.numericAxis, r = t.scale.domain();
  if (t.type === "number") {
    var n = Math.min(r[0], r[1]), a = Math.max(r[0], r[1]);
    return n <= 0 && a >= 0 ? 0 : a < 0 ? a : n;
  }
  return r[0];
}, ST = (e) => {
  var t = e.flat(2).filter(ie);
  return [Math.min(...t), Math.max(...t)];
}, AT = (e) => [e[0] === 1 / 0 ? 0 : e[0], e[1] === -1 / 0 ? 0 : e[1]], PT = (e, t, r) => {
  if (!(e == null || Object.keys(e).length === 0))
    return AT(Object.keys(e).reduce((n, a) => {
      var l = e[a];
      if (!l)
        return n;
      var u = l.stackedData, c = u.reduce((f, d) => {
        var h = UA(d, t, r), p = ST(h);
        return !Oe(p[0]) || !Oe(p[1]) ? f : [Math.min(f[0], p[0]), Math.max(f[1], p[1])];
      }, [1 / 0, -1 / 0]);
      return [Math.min(c[0], n[0]), Math.max(c[1], n[1])];
    }, [1 / 0, -1 / 0]));
}, jx = /^dataMin[\s]*-[\s]*([0-9]+([.]{1}[0-9]+){0,1})$/, _x = /^dataMax[\s]*\+[\s]*([0-9]+([.]{1}[0-9]+){0,1})$/, Ka = (e, t, r) => {
  if (e && e.scale && e.scale.bandwidth) {
    var n = e.scale.bandwidth();
    if (!r || n > 0)
      return n;
  }
  if (e && t && t.length >= 2) {
    for (var a = jc(t, (w) => w.coordinate), l = [], u = 0, c = 1, f = a.length; c < f; c++) {
      var d, h, p = (((d = a[c]) === null || d === void 0 ? void 0 : d.coordinate) || 0) - (((h = a[c - 1]) === null || h === void 0 ? void 0 : h.coordinate) || 0);
      l.push(p), u = Math.max(p, u);
    }
    var y = u * 1e-4, b = 1 / 0;
    for (var A of l)
      A > y && (b = Math.min(A, b));
    return b === 1 / 0 ? 0 : b;
  }
  return r ? void 0 : 0;
};
function Tx(e) {
  var t = e.tooltipEntrySettings, r = e.dataKey, n = e.payload, a = e.value, l = e.name;
  return rr(rr({}, t), {}, {
    dataKey: r,
    payload: n,
    value: a,
    name: l
  });
}
function Za(e, t) {
  if (e != null)
    return String(e);
  if (typeof t == "string")
    return t;
}
var OT = (e, t) => {
  if (t === "horizontal")
    return e.relativeX;
  if (t === "vertical")
    return e.relativeY;
}, ET = (e, t) => t === "centric" ? e.angle : e.radius, Cn = (e) => e.layout.width, In = (e) => e.layout.height, kT = (e) => e.layout.scale, GA = (e) => e.layout.margin, Fc = R((e) => e.cartesianAxis.xAxis, (e) => Object.values(e)), Wc = R((e) => e.cartesianAxis.yAxis, (e) => Object.values(e)), YA = "data-recharts-item-index", qA = "data-recharts-item-id", Dl = 60, lp = 30;
function Mx(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function ps(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Mx(Object(r), !0).forEach(function(n) {
      CT(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Mx(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function CT(e, t, r) {
  return (t = IT(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function IT(e) {
  var t = jT(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function jT(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var _T = (e) => e.brush.height;
function TT(e) {
  var t = Wc(e);
  return t.reduce((r, n) => {
    if (n.orientation === "left" && !n.mirror && !n.hide) {
      var a = typeof n.width == "number" ? n.width : Dl;
      return r + a;
    }
    return r;
  }, 0);
}
function MT(e) {
  var t = Wc(e);
  return t.reduce((r, n) => {
    if (n.orientation === "right" && !n.mirror && !n.hide) {
      var a = typeof n.width == "number" ? n.width : Dl;
      return r + a;
    }
    return r;
  }, 0);
}
function NT(e) {
  var t = Fc(e);
  return t.reduce((r, n) => {
    if (n.orientation === "top" && !n.mirror && !n.hide) {
      var a = typeof n.height == "number" ? n.height : lp;
      return r + a;
    }
    return r;
  }, 0);
}
function DT(e) {
  var t = Fc(e);
  return t.reduce((r, n) => {
    if (n.orientation === "bottom" && !n.mirror && !n.hide) {
      var a = typeof n.height == "number" ? n.height : lp;
      return r + a;
    }
    return r;
  }, 0);
}
var gt = R([Cn, In, GA, _T, TT, MT, NT, DT, vA, r2], (e, t, r, n, a, l, u, c, f, d) => {
  var h = {
    left: (r.left || 0) + a,
    right: (r.right || 0) + l
  }, p = {
    top: (r.top || 0) + u,
    bottom: (r.bottom || 0) + c
  }, y = ps(ps({}, p), h), b = y.bottom;
  y.bottom += n, y = pT(y, f, d);
  var A = e - y.left - y.right, w = t - y.top - y.bottom;
  return ps(ps({
    brushBottom: b
  }, y), {}, {
    // never return negative values for height and width
    width: Math.max(A, 0),
    height: Math.max(w, 0)
  });
}), $T = R(gt, (e) => ({
  x: e.left,
  y: e.top,
  width: e.width,
  height: e.height
})), up = R(Cn, In, (e, t) => ({
  x: 0,
  y: 0,
  width: e,
  height: t
})), RT = /* @__PURE__ */ x.createContext(null), Ht = () => x.useContext(RT) != null, Uc = (e) => e.brush, Kc = R([Uc, gt, GA], (e, t, r) => ({
  height: e.height,
  x: ie(e.x) ? e.x : t.left,
  y: ie(e.y) ? e.y : t.top + t.height + t.brushBottom - ((r == null ? void 0 : r.bottom) || 0),
  width: ie(e.width) ? e.width : t.width
}));
function LT(e, t, { signal: r, edges: n } = {}) {
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
  }, A = () => {
    f();
  }, w = function(...S) {
    if (r != null && r.aborted) return;
    a = this, l = S;
    const O = h == null;
    p(), u && O && f();
  };
  return w.schedule = p, w.cancel = b, w.flush = A, r == null || r.addEventListener("abort", b, { once: !0 }), w;
}
function zT(e, t = 0, r = {}) {
  typeof r != "object" && (r = {});
  const { leading: n = !1, trailing: a = !0, maxWait: l } = r, u = Array(2);
  n && (u[0] = "leading"), a && (u[1] = "trailing");
  let c, f = null;
  const d = LT(function(...y) {
    c = e.apply(this, y), f = null;
  }, t, { edges: u }), h = function(...y) {
    return l != null && (f === null && (f = Date.now()), Date.now() - f >= l) ? ((n || a) && (c = e.apply(this, y)), f = Date.now(), d.cancel(), d.schedule(), c) : (d.apply(this, y), c);
  }, p = () => (d.flush(), c);
  return h.cancel = d.cancel, h.flush = p, h;
}
function BT(e, t = 0, r = {}) {
  const { leading: n = !0, trailing: a = !0 } = r;
  return zT(e, t, {
    leading: n,
    maxWait: t,
    trailing: a
  });
}
var Vs = function(t, r) {
  for (var n = arguments.length, a = new Array(n > 2 ? n - 2 : 0), l = 2; l < n; l++)
    a[l - 2] = arguments[l];
  if (typeof console < "u" && console.warn && (r === void 0 && console.warn("LogUtils requires an error message argument"), !t))
    if (r === void 0)
      console.warn("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");
    else {
      var u = 0;
      console.warn(r.replace(/%s/g, () => a[u++]));
    }
}, Zr = {
  width: "100%",
  height: "100%",
  debounce: 0,
  minWidth: 0,
  initialDimension: {
    width: -1,
    height: -1
  }
}, XA = (e, t, r) => {
  var n = r.width, a = n === void 0 ? Zr.width : n, l = r.height, u = l === void 0 ? Zr.height : l, c = r.aspect, f = r.maxHeight, d = Ki(a) ? e : Number(a), h = Ki(u) ? t : Number(u);
  return c && c > 0 && (d ? h = d / c : h && (d = h * c), f && h != null && h > f && (h = f)), {
    calculatedWidth: d,
    calculatedHeight: h
  };
}, FT = {
  width: 0,
  height: 0,
  overflow: "visible"
}, WT = {
  width: 0,
  overflowX: "visible"
}, UT = {
  height: 0,
  overflowY: "visible"
}, KT = {}, HT = (e) => {
  var t = e.width, r = e.height, n = Ki(t), a = Ki(r);
  return n && a ? FT : n ? WT : a ? UT : KT;
};
function VT(e) {
  var t = e.width, r = e.height, n = e.aspect, a = t, l = r;
  return a === void 0 && l === void 0 ? (a = Zr.width, l = Zr.height) : a === void 0 ? a = n && n > 0 ? void 0 : Zr.width : l === void 0 && (l = n && n > 0 ? void 0 : Zr.height), {
    width: a,
    height: l
  };
}
var GT = ["aspect", "initialDimension", "width", "height", "minWidth", "minHeight", "maxHeight", "children", "debounce", "id", "className", "onResize", "style"];
function Gs() {
  return Gs = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Gs.apply(null, arguments);
}
function Nx(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Dx(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Nx(Object(r), !0).forEach(function(n) {
      YT(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Nx(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function YT(e, t, r) {
  return (t = qT(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function qT(e) {
  var t = XT(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function XT(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function QT(e, t) {
  return tM(e) || eM(e, t) || JT(e, t) || ZT();
}
function ZT() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function JT(e, t) {
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
function eM(e, t) {
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
function tM(e) {
  if (Array.isArray(e)) return e;
}
function rM(e, t) {
  if (e == null) return {};
  var r, n, a = nM(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]);
  }
  return a;
}
function nM(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
var QA = /* @__PURE__ */ x.createContext(Zr.initialDimension);
function iM(e) {
  return an(e.width) && an(e.height);
}
function ZA(e) {
  var t = e.children, r = e.width, n = e.height, a = x.useMemo(() => ({
    width: r,
    height: n
  }), [r, n]);
  return iM(a) ? /* @__PURE__ */ x.createElement(QA.Provider, {
    value: a
  }, t) : null;
}
var sp = () => x.useContext(QA), aM = /* @__PURE__ */ x.forwardRef((e, t) => {
  var r = e.aspect, n = e.initialDimension, a = n === void 0 ? Zr.initialDimension : n, l = e.width, u = e.height, c = e.minWidth, f = c === void 0 ? Zr.minWidth : c, d = e.minHeight, h = e.maxHeight, p = e.children, y = e.debounce, b = y === void 0 ? Zr.debounce : y, A = e.id, w = e.className, S = e.onResize, O = e.style, C = O === void 0 ? {} : O, I = rM(e, GT), k = x.useRef(null), T = x.useRef();
  T.current = S, x.useImperativeHandle(t, () => k.current);
  var E = x.useState({
    containerWidth: a.width,
    containerHeight: a.height
  }), $ = QT(E, 2), F = $[0], U = $[1], H = x.useCallback((fe, ae) => {
    U((K) => {
      var te = Math.round(fe), Y = Math.round(ae);
      return K.containerWidth === te && K.containerHeight === Y ? K : {
        containerWidth: te,
        containerHeight: Y
      };
    });
  }, []);
  x.useEffect(() => {
    if (k.current == null || typeof ResizeObserver > "u")
      return Qi;
    var fe = (D) => {
      var V, ve = D[0];
      if (ve != null) {
        var ye = ve.contentRect, Ae = ye.width, Pe = ye.height;
        H(Ae, Pe), (V = T.current) === null || V === void 0 || V.call(T, Ae, Pe);
      }
    };
    b > 0 && (fe = BT(fe, b, {
      trailing: !0,
      leading: !1
    }));
    var ae = new ResizeObserver(fe), K = k.current.getBoundingClientRect(), te = K.width, Y = K.height;
    return H(te, Y), ae.observe(k.current), () => {
      ae.disconnect();
    };
  }, [H, b]);
  var G = F.containerWidth, W = F.containerHeight;
  Vs(!r || r > 0, "The aspect(%s) must be greater than zero.", r);
  var ne = XA(G, W, {
    width: l,
    height: u,
    aspect: r,
    maxHeight: h
  }), re = ne.calculatedWidth, le = ne.calculatedHeight;
  return Vs(G < 0 || W < 0 || re != null && re > 0 || le != null && le > 0, `The width(%s) and height(%s) of chart should be greater than 0,
       please check the style of container, or the props width(%s) and height(%s),
       or add a minWidth(%s) or minHeight(%s) or use aspect(%s) to control the
       height and width.`, re, le, l, u, f, d, r), /* @__PURE__ */ x.createElement("div", Gs({
    id: A ? "".concat(A) : void 0,
    className: ze("recharts-responsive-container", w),
    style: Dx(Dx({}, C), {}, {
      width: l,
      height: u,
      minWidth: f,
      minHeight: d,
      maxHeight: h
    }),
    ref: k
  }, I), /* @__PURE__ */ x.createElement("div", {
    style: HT({
      width: l,
      height: u
    })
  }, /* @__PURE__ */ x.createElement(ZA, {
    width: re,
    height: le
  }, p)));
}), Ni = /* @__PURE__ */ x.forwardRef((e, t) => {
  var r = sp();
  if (an(r.width) && an(r.height))
    return e.children;
  var n = VT({
    width: e.width,
    height: e.height,
    aspect: e.aspect
  }), a = n.width, l = n.height, u = XA(void 0, void 0, {
    width: a,
    height: l,
    aspect: e.aspect,
    maxHeight: e.maxHeight
  }), c = u.calculatedWidth, f = u.calculatedHeight;
  return ie(c) && ie(f) ? /* @__PURE__ */ x.createElement(ZA, {
    width: c,
    height: f
  }, e.children) : /* @__PURE__ */ x.createElement(aM, Gs({}, e, {
    width: a,
    height: l,
    ref: t
  }));
}), Hc = () => {
  var e, t = Ht(), r = se($T), n = se(Kc), a = (e = se(Uc)) === null || e === void 0 ? void 0 : e.padding;
  return !t || !n || !a ? r : {
    width: n.width - a.left - a.right,
    height: n.height - a.top - a.bottom,
    x: a.left,
    y: a.top
  };
}, oM = {
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  width: 0,
  height: 0,
  brushBottom: 0
}, JA = () => {
  var e;
  return (e = se(gt)) !== null && e !== void 0 ? e : oM;
}, eP = () => se(Cn), tP = () => se(In), _e = (e) => e.layout.layoutType, Zi = () => se(_e), cp = () => {
  var e = Zi();
  if (e === "horizontal" || e === "vertical")
    return e;
}, fp = (e) => {
  var t = e.layout.layoutType;
  if (t === "centric" || t === "radial")
    return t;
}, lM = () => se(fp), uM = () => {
  var e = Zi();
  return e !== void 0;
}, $l = (e) => {
  var t = Fe(), r = Ht(), n = e.width, a = e.height, l = sp(), u = n, c = a;
  return l && (u = l.width > 0 ? l.width : n, c = l.height > 0 ? l.height : a), x.useEffect(() => {
    !r && an(u) && an(c) && t(sT({
      width: u,
      height: c
    }));
  }, [t, r, u, c]), null;
}, sM = {
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
}, rP = Kt({
  name: "legend",
  initialState: sM,
  reducers: {
    setLegendSize(e, t) {
      e.size.width = t.payload.width, e.size.height = t.payload.height;
    },
    setLegendSettings(e, t) {
      e.settings.align = t.payload.align, e.settings.layout = t.payload.layout, e.settings.verticalAlign = t.payload.verticalAlign, e.settings.itemSorter = t.payload.itemSorter, e.settings.position = t.payload.position, e.settings.offset = t.payload.offset;
    },
    addLegendPayload: {
      reducer(e, t) {
        e.payload.push(Ne(t.payload));
      },
      prepare: He()
    },
    replaceLegendPayload: {
      reducer(e, t) {
        var r = t.payload, n = r.prev, a = r.next, l = Sr(e).payload.indexOf(Ne(n));
        l > -1 && (e.payload[l] = Ne(a));
      },
      prepare: He()
    },
    removeLegendPayload: {
      reducer(e, t) {
        var r = Sr(e).payload.indexOf(Ne(t.payload));
        r > -1 && e.payload.splice(r, 1);
      },
      prepare: He()
    }
  }
}), Rl = rP.actions;
Rl.setLegendSize;
Rl.setLegendSettings;
var nP = Rl.addLegendPayload, iP = Rl.replaceLegendPayload, aP = Rl.removeLegendPayload, cM = rP.reducer, Ov = { exports: {} }, Ev = {};
/**
 * @license React
 * use-sync-external-store-with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Rx;
function fM() {
  if (Rx) return Ev;
  Rx = 1;
  var e = Qa();
  function t(f, d) {
    return f === d && (f !== 0 || 1 / f === 1 / d) || f !== f && d !== d;
  }
  var r = typeof Object.is == "function" ? Object.is : t, n = e.useSyncExternalStore, a = e.useRef, l = e.useEffect, u = e.useMemo, c = e.useDebugValue;
  return Ev.useSyncExternalStoreWithSelector = function(f, d, h, p, y) {
    var b = a(null);
    if (b.current === null) {
      var A = { hasValue: !1, value: null };
      b.current = A;
    } else A = b.current;
    b = u(
      function() {
        function S(T) {
          if (!O) {
            if (O = !0, C = T, T = p(T), y !== void 0 && A.hasValue) {
              var E = A.value;
              if (y(E, T))
                return I = E;
            }
            return I = T;
          }
          if (E = I, r(C, T)) return E;
          var $ = p(T);
          return y !== void 0 && y(E, $) ? (C = T, E) : (C = T, I = $);
        }
        var O = !1, C, I, k = h === void 0 ? null : h;
        return [
          function() {
            return S(d());
          },
          k === null ? void 0 : function() {
            return S(k());
          }
        ];
      },
      [d, h, p, y]
    );
    var w = n(f, b[0], b[1]);
    return l(
      function() {
        A.hasValue = !0, A.value = w;
      },
      [w]
    ), c(w), w;
  }, Ev;
}
var Lx;
function dM() {
  return Lx || (Lx = 1, Ov.exports = fM()), Ov.exports;
}
dM();
function vM(e) {
  e();
}
function hM() {
  let e = null, t = null;
  return {
    clear() {
      e = null, t = null;
    },
    notify() {
      vM(() => {
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
var zx = {
  notify() {
  },
  get: () => []
};
function pM(e, t) {
  let r, n = zx, a = 0, l = !1;
  function u(w) {
    h();
    const S = n.subscribe(w);
    let O = !1;
    return () => {
      O || (O = !0, S(), p());
    };
  }
  function c() {
    n.notify();
  }
  function f() {
    A.onStateChange && A.onStateChange();
  }
  function d() {
    return l;
  }
  function h() {
    a++, r || (r = e.subscribe(f), n = hM());
  }
  function p() {
    a--, r && a === 0 && (r(), r = void 0, n.clear(), n = zx);
  }
  function y() {
    l || (l = !0, h());
  }
  function b() {
    l && (l = !1, p());
  }
  const A = {
    addNestedSub: u,
    notifyNestedSubs: c,
    handleChangeWrapper: f,
    isSubscribed: d,
    trySubscribe: y,
    tryUnsubscribe: b,
    getListeners: () => n
  };
  return A;
}
var mM = () => typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u", yM = /* @__PURE__ */ mM(), gM = () => typeof navigator < "u" && navigator.product === "ReactNative", xM = /* @__PURE__ */ gM(), bM = () => yM || xM ? x.useLayoutEffect : x.useEffect, wM = /* @__PURE__ */ bM();
function Bx(e, t) {
  return e === t ? e !== 0 || t !== 0 || 1 / e === 1 / t : e !== e && t !== t;
}
function SM(e, t) {
  if (Bx(e, t)) return !0;
  if (typeof e != "object" || e === null || typeof t != "object" || t === null)
    return !1;
  const r = Object.keys(e), n = Object.keys(t);
  if (r.length !== n.length) return !1;
  for (let a = 0; a < r.length; a++)
    if (!Object.prototype.hasOwnProperty.call(t, r[a]) || !Bx(e[r[a]], t[r[a]]))
      return !1;
  return !0;
}
var kv = /* @__PURE__ */ Symbol.for("react-redux-context"), Cv = typeof globalThis < "u" ? globalThis : (
  /* fall back to a per-module scope (pre-8.1 behaviour) if `globalThis` is not available */
  {}
);
function AM() {
  if (!x.createContext) return {};
  const e = Cv[kv] ?? (Cv[kv] = /* @__PURE__ */ new Map());
  let t = e.get(x.createContext);
  return t || (t = x.createContext(
    null
  ), e.set(x.createContext, t)), t;
}
var PM = /* @__PURE__ */ AM();
function OM(e) {
  const { children: t, context: r, serverState: n, store: a } = e, l = x.useMemo(() => {
    const f = pM(a);
    return {
      store: a,
      subscription: f,
      getServerState: n ? () => n : void 0
    };
  }, [a, n]), u = x.useMemo(() => a.getState(), [a]);
  wM(() => {
    const { subscription: f } = l;
    return f.onStateChange = f.notifyNestedSubs, f.trySubscribe(), u !== a.getState() && f.notifyNestedSubs(), () => {
      f.tryUnsubscribe(), f.onStateChange = void 0;
    };
  }, [l, u]);
  const c = r || PM;
  return /* @__PURE__ */ x.createElement(c.Provider, { value: l }, t);
}
var EM = OM, kM = /* @__PURE__ */ new Set([
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
function CM(e, t) {
  return e == null && t == null ? !0 : typeof e == "number" && typeof t == "number" ? e === t || e !== e && t !== t : e === t;
}
function Ll(e, t) {
  var r = /* @__PURE__ */ new Set([...Object.keys(e), ...Object.keys(t)]);
  for (var n of r)
    if (kM.has(n)) {
      if (e[n] == null && t[n] == null)
        continue;
      if (!SM(e[n], t[n]))
        return !1;
    } else if (!CM(e[n], t[n]))
      return !1;
  return !0;
}
function yh() {
  return yh = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, yh.apply(null, arguments);
}
function Fx(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Zo(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Fx(Object(r), !0).forEach(function(n) {
      IM(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Fx(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function IM(e, t, r) {
  return (t = jM(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function jM(e) {
  var t = _M(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function _M(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function TM(e, t) {
  return $M(e) || DM(e, t) || NM(e, t) || MM();
}
function MM() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function NM(e, t) {
  if (e) {
    if (typeof e == "string") return Wx(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? Wx(e, t) : void 0;
  }
}
function Wx(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function DM(e, t) {
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
function $M(e) {
  if (Array.isArray(e)) return e;
}
function RM(e) {
  return Array.isArray(e) && nn(e[0]) && nn(e[1]) ? e.join(" ~ ") : e;
}
var ka = {
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
function LM(e, t) {
  return t == null ? e : jc(e, t);
}
var zM = (e) => {
  var t = e.separator, r = t === void 0 ? ka.separator : t, n = e.contentStyle, a = e.itemStyle, l = e.labelStyle, u = l === void 0 ? ka.labelStyle : l, c = e.payload, f = e.formatter, d = e.itemSorter, h = e.wrapperClassName, p = e.labelClassName, y = e.label, b = e.labelFormatter, A = e.accessibilityLayer, w = A === void 0 ? ka.accessibilityLayer : A, S = () => {
    if (c && c.length) {
      var F = {
        padding: 0,
        margin: 0
      }, U = LM(c, d), H = U.map((G, W) => {
        if (!G || G.type === "none")
          return null;
        var ne = G.formatter || f || RM, re = G.value, le = G.name, fe = re, ae = le;
        if (ne) {
          var K = ne(re, le, G, W, c);
          if (Array.isArray(K)) {
            var te = TM(K, 2);
            fe = te[0], ae = te[1];
          } else if (K != null)
            fe = K;
          else
            return null;
        }
        var Y = Zo(Zo({}, ka.itemStyle), {}, {
          color: G.color || ka.itemStyle.color
        }, a);
        return /* @__PURE__ */ x.createElement("li", {
          className: "recharts-tooltip-item",
          key: "tooltip-item-".concat(W),
          style: Y
        }, nn(ae) ? /* @__PURE__ */ x.createElement("span", {
          className: "recharts-tooltip-item-name"
        }, ae) : null, nn(ae) ? /* @__PURE__ */ x.createElement("span", {
          className: "recharts-tooltip-item-separator"
        }, r) : null, /* @__PURE__ */ x.createElement("span", {
          className: "recharts-tooltip-item-value"
        }, fe), /* @__PURE__ */ x.createElement("span", {
          className: "recharts-tooltip-item-unit"
        }, G.unit || ""));
      });
      return /* @__PURE__ */ x.createElement("ul", {
        className: "recharts-tooltip-item-list",
        style: F
      }, H);
    }
    return null;
  }, O = Zo(Zo({}, ka.contentStyle), n), C = Zo({
    margin: 0
  }, u), I = !Ze(y), k = I ? y : "", T = ze("recharts-default-tooltip", h), E = ze("recharts-tooltip-label", p);
  I && b && c !== void 0 && c !== null && (k = b(y, c));
  var $ = w ? {
    role: "status",
    "aria-live": "assertive"
  } : {};
  return /* @__PURE__ */ x.createElement("div", yh({
    className: T,
    style: O
  }, $), /* @__PURE__ */ x.createElement("p", {
    className: E,
    style: C
  }, /* @__PURE__ */ x.isValidElement(k) ? k : "".concat(k)), S());
}, Jo = "recharts-tooltip-wrapper", BM = {
  visibility: "hidden"
};
function FM(e) {
  var t = e.coordinate, r = e.translateX, n = e.translateY;
  return ze(Jo, {
    ["".concat(Jo, "-right")]: ie(r) && t && ie(t.x) && r >= t.x,
    ["".concat(Jo, "-left")]: ie(r) && t && ie(t.x) && r < t.x,
    ["".concat(Jo, "-bottom")]: ie(n) && t && ie(t.y) && n >= t.y,
    ["".concat(Jo, "-top")]: ie(n) && t && ie(t.y) && n < t.y
  });
}
function Ux(e) {
  var t = e.allowEscapeViewBox, r = e.coordinate, n = e.key, a = e.offset, l = e.position, u = e.reverseDirection, c = e.tooltipDimension, f = e.viewBox, d = e.viewBoxDimension;
  if (l && ie(l[n]))
    return l[n];
  var h = r[n] - c - (a > 0 ? a : 0), p = r[n] + a;
  if (t[n])
    return u[n] ? h : p;
  var y = f[n];
  if (y == null)
    return 0;
  if (u[n]) {
    var b = h, A = y;
    return b < A ? Math.max(p, y) : Math.max(h, y);
  }
  if (d == null)
    return 0;
  var w = p + c, S = y + d;
  return w > S ? Math.max(h, y) : Math.max(p, y);
}
function WM(e) {
  var t = e.translateX, r = e.translateY, n = e.useTranslate3d;
  return {
    transform: n ? "translate3d(".concat(t, "px, ").concat(r, "px, 0)") : "translate(".concat(t, "px, ").concat(r, "px)")
  };
}
function UM(e) {
  var t = e.allowEscapeViewBox, r = e.coordinate, n = e.offsetTop, a = e.offsetLeft, l = e.position, u = e.reverseDirection, c = e.tooltipBox, f = e.useTranslate3d, d = e.viewBox, h, p, y;
  return c && c.height > 0 && c.width > 0 && r ? (p = Ux({
    allowEscapeViewBox: t,
    coordinate: r,
    key: "x",
    offset: a,
    position: l,
    reverseDirection: u,
    tooltipDimension: c.width,
    viewBox: d,
    viewBoxDimension: d.width
  }), y = Ux({
    allowEscapeViewBox: t,
    coordinate: r,
    key: "y",
    offset: n,
    position: l,
    reverseDirection: u,
    tooltipDimension: c.height,
    viewBox: d,
    viewBoxDimension: d.height
  }), h = WM({
    translateX: p,
    translateY: y,
    useTranslate3d: f
  })) : h = BM, {
    cssProperties: h,
    cssClasses: FM({
      translateX: p,
      translateY: y,
      coordinate: r
    })
  };
}
var KM = () => !(typeof window < "u" && window.document && window.document.createElement && window.setTimeout), zl = {
  isSsr: KM()
};
function HM(e, t) {
  return qM(e) || YM(e, t) || GM(e, t) || VM();
}
function VM() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function GM(e, t) {
  if (e) {
    if (typeof e == "string") return Kx(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? Kx(e, t) : void 0;
  }
}
function Kx(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function YM(e, t) {
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
function qM(e) {
  if (Array.isArray(e)) return e;
}
function oP() {
  var e = x.useState(() => zl.isSsr || !window.matchMedia ? !1 : window.matchMedia("(prefers-reduced-motion: reduce)").matches), t = HM(e, 2), r = t[0], n = t[1];
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
function Hx(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Ca(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Hx(Object(r), !0).forEach(function(n) {
      XM(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Hx(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function XM(e, t, r) {
  return (t = QM(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function QM(e) {
  var t = ZM(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function ZM(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function JM(e, t) {
  return nN(e) || rN(e, t) || tN(e, t) || eN();
}
function eN() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function tN(e, t) {
  if (e) {
    if (typeof e == "string") return Vx(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? Vx(e, t) : void 0;
  }
}
function Vx(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function rN(e, t) {
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
function nN(e) {
  if (Array.isArray(e)) return e;
}
function iN(e) {
  if (!(e.prefersReducedMotion && e.isAnimationActive === "auto") && e.isAnimationActive && e.active) {
    var t = typeof e.animationEasing == "string" ? e.animationEasing : "ease";
    return "transform ".concat(e.animationDuration, "ms ").concat(t);
  }
}
function aN(e) {
  var t, r, n, a, l, u, c = oP(), f = x.useState(() => ({
    dismissed: !1,
    dismissedAtCoordinate: {
      x: 0,
      y: 0
    }
  })), d = JM(f, 2), h = d[0], p = d[1];
  x.useEffect(() => {
    var O = (C) => {
      if (C.key === "Escape") {
        var I, k, T, E;
        p({
          dismissed: !0,
          dismissedAtCoordinate: {
            x: (I = (k = e.coordinate) === null || k === void 0 ? void 0 : k.x) !== null && I !== void 0 ? I : 0,
            y: (T = (E = e.coordinate) === null || E === void 0 ? void 0 : E.y) !== null && T !== void 0 ? T : 0
          }
        });
      }
    };
    return document.addEventListener("keydown", O), () => {
      document.removeEventListener("keydown", O);
    };
  }, [(t = e.coordinate) === null || t === void 0 ? void 0 : t.x, (r = e.coordinate) === null || r === void 0 ? void 0 : r.y]), h.dismissed && (((n = (a = e.coordinate) === null || a === void 0 ? void 0 : a.x) !== null && n !== void 0 ? n : 0) !== h.dismissedAtCoordinate.x || ((l = (u = e.coordinate) === null || u === void 0 ? void 0 : u.y) !== null && l !== void 0 ? l : 0) !== h.dismissedAtCoordinate.y) && p(Ca(Ca({}, h), {}, {
    dismissed: !1
  }));
  var y = UM({
    allowEscapeViewBox: e.allowEscapeViewBox,
    coordinate: e.coordinate,
    offsetLeft: typeof e.offset == "number" ? e.offset : e.offset.x,
    offsetTop: typeof e.offset == "number" ? e.offset : e.offset.y,
    position: e.position,
    reverseDirection: e.reverseDirection,
    tooltipBox: e.lastBoundingBox,
    useTranslate3d: e.useTranslate3d,
    viewBox: e.viewBox
  }), b = y.cssClasses, A = y.cssProperties, w = e.hasPortalFromProps ? {} : Ca(Ca({
    transition: iN({
      prefersReducedMotion: c,
      isAnimationActive: e.isAnimationActive,
      active: e.active,
      animationDuration: e.animationDuration,
      animationEasing: e.animationEasing
    })
  }, A), {}, {
    pointerEvents: "none",
    position: "absolute",
    top: 0,
    left: 0
  }), S = Ca(Ca({}, w), {}, {
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
var oN = /* @__PURE__ */ x.memo(aN), lP = () => {
  var e;
  return (e = se((t) => t.rootProps.accessibilityLayer)) !== null && e !== void 0 ? e : !0;
};
function gh() {
  return gh = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, gh.apply(null, arguments);
}
function Gx(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Yx(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Gx(Object(r), !0).forEach(function(n) {
      lN(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Gx(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function lN(e, t, r) {
  return (t = uN(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function uN(e) {
  var t = sN(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function sN(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var qx = {
  curveBasisClosed: Wj,
  curveBasisOpen: Uj,
  curveBasis: Fj,
  curveBumpX: zj,
  curveBumpY: Bj,
  curveLinearClosed: Kj,
  curveLinear: kc,
  curveMonotoneX: Hj,
  curveMonotoneY: Vj,
  curveNatural: Gj,
  curveStep: Yj,
  curveStepAfter: Xj,
  curveStepBefore: qj
}, Ys = (e) => Oe(e.x) && Oe(e.y), Xx = (e) => e.base != null && Ys(e.base) && Ys(e), el = (e) => e.x, tl = (e) => e.y, cN = (e, t) => {
  if (typeof e == "function")
    return e;
  var r = "curve".concat(Vh(e));
  if ((r === "curveMonotone" || r === "curveBump") && t) {
    var n = qx["".concat(r).concat(t === "vertical" ? "Y" : "X")];
    if (n)
      return n;
  }
  return qx[r] || kc;
}, Qx = {
  connectNulls: !1,
  type: "linear"
}, fN = (e) => {
  var t = e.type, r = t === void 0 ? Qx.type : t, n = e.points, a = n === void 0 ? [] : n, l = e.baseLine, u = e.layout, c = e.connectNulls, f = c === void 0 ? Qx.connectNulls : c, d = cN(r, u), h = f ? a.filter(Ys) : a;
  if (Array.isArray(l)) {
    var p, y = a.map((O, C) => Yx(Yx({}, O), {}, {
      base: l[C]
    }));
    u === "vertical" ? p = ss().y(tl).x1(el).x0((O) => O.base.x) : p = ss().x(el).y1(tl).y0((O) => O.base.y);
    var b = p.defined(Xx).curve(d), A = f ? y.filter(Xx) : y;
    return b(A);
  }
  var w;
  u === "vertical" && ie(l) ? w = ss().y(tl).x1(el).x0(l) : ie(l) ? w = ss().x(el).y1(tl).y0(l) : w = jS().x(el).y(tl);
  var S = w.defined(Ys).curve(d);
  return S(h);
}, pl = (e) => {
  var t = e.className, r = e.points, n = e.path, a = e.pathRef, l = Zi();
  if ((!r || !r.length) && !n)
    return null;
  var u = {
    type: e.type,
    points: e.points,
    baseLine: e.baseLine,
    layout: e.layout || l,
    connectNulls: e.connectNulls
  }, c = r && r.length ? fN(u) : n;
  return /* @__PURE__ */ x.createElement("path", gh({}, ar(e), qh(e), {
    className: ze("recharts-curve", t),
    d: c === null ? void 0 : c,
    ref: a
  }));
}, dN = ["x", "y", "top", "left", "width", "height", "className"];
function xh() {
  return xh = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, xh.apply(null, arguments);
}
function Zx(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function vN(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Zx(Object(r), !0).forEach(function(n) {
      hN(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Zx(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function hN(e, t, r) {
  return (t = pN(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function pN(e) {
  var t = mN(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function mN(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function yN(e, t) {
  if (e == null) return {};
  var r, n, a = gN(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]);
  }
  return a;
}
function gN(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
var xN = (e, t, r, n, a, l) => "M".concat(e, ",").concat(a, "v").concat(n, "M").concat(l, ",").concat(t, "h").concat(r), bN = (e) => {
  var t = e.x, r = t === void 0 ? 0 : t, n = e.y, a = n === void 0 ? 0 : n, l = e.top, u = l === void 0 ? 0 : l, c = e.left, f = c === void 0 ? 0 : c, d = e.width, h = d === void 0 ? 0 : d, p = e.height, y = p === void 0 ? 0 : p, b = e.className, A = yN(e, dN), w = vN({
    x: r,
    y: a,
    top: u,
    left: f,
    width: h,
    height: y
  }, A);
  return !ie(r) || !ie(a) || !ie(h) || !ie(y) || !ie(u) || !ie(f) ? null : /* @__PURE__ */ x.createElement("path", xh({}, Pr(w), {
    className: ze("recharts-cross", b),
    d: xN(r, a, h, y, u, f)
  }));
};
function wN(e, t, r, n) {
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
var qs = 1e-4, uP = (e, t) => [0, 3 * e, 3 * t - 6 * e, 3 * e - 3 * t + 1], sP = (e, t) => e.map((r, n) => r * t ** n).reduce((r, n) => r + n), Jx = (e, t) => (r) => {
  var n = uP(e, t);
  return sP(n, r);
}, SN = (e, t) => (r) => {
  var n = uP(e, t), a = [...n.map((l, u) => l * u).slice(1), 0];
  return sP(a, r);
}, AN = (e) => {
  var t, r = e.split("(");
  if (r.length !== 2 || r[0] !== "cubic-bezier")
    return null;
  var n = (t = r[1]) === null || t === void 0 || (t = t.split(")")[0]) === null || t === void 0 ? void 0 : t.split(",");
  if (n == null || n.length !== 4)
    return null;
  var a = n.map((l) => parseFloat(l));
  return [a[0], a[1], a[2], a[3]];
}, PN = function() {
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
        var a = AN(r[0]);
        if (a)
          return a;
      }
    }
  return r.length === 4 ? r : [0, 0, 1, 1];
}, ON = (e, t, r, n) => {
  var a = Jx(e, r), l = Jx(t, n), u = SN(e, r), c = (d) => d > 1 ? 1 : d < 0 ? 0 : d, f = (d) => {
    for (var h = d > 1 ? 1 : d, p = h, y = 0; y < 8; ++y) {
      var b = a(p) - h, A = u(p);
      if (Math.abs(b - h) < qs || A < qs)
        return l(p);
      p = c(p - b / A);
    }
    return l(p);
  };
  return f.isStepper = !1, f;
}, eb = function() {
  return ON(...PN(...arguments));
}, EN = function() {
  for (var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = t.stiff, n = r === void 0 ? 100 : r, a = t.damping, l = a === void 0 ? 8 : a, u = t.dt, c = u === void 0 ? 16.67 : u, f = 1, d = [0], h = 0, p = 0, y = 1e4, b = 0; b < y; ) {
    var A = -(h - f) * n, w = p * l;
    if (p += (A - w) * c / 1e3, h += p * c / 1e3, d.push(h), Math.abs(h - f) < qs && Math.abs(p) < qs)
      break;
    b++;
  }
  d[d.length - 1] = f;
  var S = d.length - 1;
  return (O) => {
    var C, I, k;
    if (O <= 0) return 0;
    if (O >= 1) return f;
    var T = O * S, E = Math.floor(T), $ = T - E;
    return ((C = d[E]) !== null && C !== void 0 ? C : 0) + (((I = d[E + 1]) !== null && I !== void 0 ? I : 0) - ((k = d[E]) !== null && k !== void 0 ? k : 0)) * $;
  };
}, kN = (e) => {
  if (typeof e == "string")
    switch (e) {
      case "ease":
      case "ease-in-out":
      case "ease-out":
      case "ease-in":
      case "linear":
        return eb(e);
      case "spring":
        return EN();
      default:
        if (e.split("(")[0] === "cubic-bezier")
          return eb(e);
    }
  return typeof e == "function" ? e : null;
}, CN = (e, t, r) => {
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
}, cP = /* @__PURE__ */ x.createContext(CN);
cP.Provider;
function IN(e) {
  var t = x.useContext(cP);
  return x.useMemo(() => e ?? t, [e, t]);
}
function jN(e, t, r) {
  return (t = _N(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function _N(e) {
  var t = TN(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function TN(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var tb = "init", rb = "pending", nb = "active", MN = "completed";
function Iv(e) {
  return Math.max(0, e);
}
class NN {
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
    jN(this, "state", tb), this.animationId = t.animationId, this.onAnimationEnd = t.onAnimationEnd, this.animationDuration = Iv(t.animationDuration), this.animationBegin = Iv(t.animationBegin), this.progress = 0, this.from = t.from, this.to = t.to, this.easing = t.easing, (r = t.onAnimationStart) === null || r === void 0 || r.call(t);
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
    if (this.getState() === tb)
      return this.state = rb, this.beginStartedTime = t, this.animationBegin;
    if (this.getState() === rb) {
      if (this.beginStartedTime == null)
        throw new Error();
      var r = t - this.beginStartedTime;
      return r >= this.animationBegin ? (this.state = nb, this.animationStartedTime = t, this.nextAnimationUpdate(0)) : Iv(this.animationBegin - r);
    }
    if (this.getState() === nb) {
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
    this.state = MN;
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
class DN extends NN {
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
class $N {
  setTimeout(t) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0, n = performance.now(), a = null, l = (u) => {
      u - n >= r ? t(u) : a = requestAnimationFrame(l);
    };
    return a = requestAnimationFrame(l), () => {
      a != null && cancelAnimationFrame(a);
    };
  }
}
function RN(e, t) {
  return FN(e) || BN(e, t) || zN(e, t) || LN();
}
function LN() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function zN(e, t) {
  if (e) {
    if (typeof e == "string") return ib(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? ib(e, t) : void 0;
  }
}
function ib(e, t) {
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
var WN = {
  begin: 0,
  duration: 1e3,
  easing: "ease",
  isActive: !0,
  canBegin: !0,
  onAnimationEnd: () => {
  },
  onAnimationStart: () => {
  }
}, ab = 0, jv = 1;
function fP(e) {
  var t = Ut(e, WN), r = t.animationId, n = t.isActive, a = t.canBegin, l = t.duration, u = t.easing, c = t.begin, f = t.onAnimationEnd, d = t.onAnimationStart, h = t.children, p = oP(), y = n === "auto" ? !zl.isSsr && !p : n, b = IN(t.animationController), A = x.useState(y ? ab : jv), w = RN(A, 2), S = w[0], O = w[1];
  return x.useEffect(() => {
    y || O(jv);
  }, [y]), x.useEffect(() => {
    var C = kN(u);
    if (!y || !a || C == null)
      return Qi;
    var I = new $N(), k = new DN({
      animationId: r,
      easing: C,
      animationDuration: l,
      animationBegin: c,
      onAnimationStart: d,
      onAnimationEnd: f,
      from: ab,
      to: jv
    });
    return b(I, k, O);
  }, [b, r, y, a, l, u, c, d, f]), h(Number(S));
}
function dP(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "animation-", r = x.useRef(bl(t)), n = x.useRef(e);
  return n.current !== e && (r.current = bl(t), n.current = e), r.current;
}
var UN = (e) => e.replace(/([A-Z])/g, (t) => "-".concat(t.toLowerCase())), KN = (e, t, r) => e.map((n) => "".concat(UN(n), " ").concat(t, "ms ").concat(r)).join(","), HN = ["radius"], VN = ["radius"], ob, lb, ub, sb, cb, fb, db, vb, hb, pb;
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
function yb(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? mb(Object(r), !0).forEach(function(n) {
      GN(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : mb(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function GN(e, t, r) {
  return (t = YN(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function YN(e) {
  var t = qN(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function qN(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function Xs() {
  return Xs = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Xs.apply(null, arguments);
}
function gb(e, t) {
  if (e == null) return {};
  var r, n, a = XN(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]);
  }
  return a;
}
function XN(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
function QN(e, t) {
  return tD(e) || eD(e, t) || JN(e, t) || ZN();
}
function ZN() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function JN(e, t) {
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
function eD(e, t) {
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
function tD(e) {
  if (Array.isArray(e)) return e;
}
function Xr(e, t) {
  return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } }));
}
var bb = (e, t, r, n, a) => {
  var l = ni(r), u = ni(n), c = Math.min(Math.abs(l) / 2, Math.abs(u) / 2), f = u >= 0 ? 1 : -1, d = l >= 0 ? 1 : -1, h = u >= 0 && l >= 0 || u < 0 && l < 0 ? 1 : 0, p;
  if (c > 0 && Array.isArray(a)) {
    for (var y = [0, 0, 0, 0], b = 0, A = 4; b < A; b++) {
      var w, S = (w = a[b]) !== null && w !== void 0 ? w : 0;
      y[b] = S > c ? c : S;
    }
    p = _t(ob || (ob = Xr(["M", ",", ""])), e, t + f * y[0]), y[0] > 0 && (p += _t(lb || (lb = Xr(["A ", ",", ",0,0,", ",", ",", ""])), y[0], y[0], h, e + d * y[0], t)), p += _t(ub || (ub = Xr(["L ", ",", ""])), e + r - d * y[1], t), y[1] > 0 && (p += _t(sb || (sb = Xr(["A ", ",", ",0,0,", `,
        `, ",", ""])), y[1], y[1], h, e + r, t + f * y[1])), p += _t(cb || (cb = Xr(["L ", ",", ""])), e + r, t + n - f * y[2]), y[2] > 0 && (p += _t(fb || (fb = Xr(["A ", ",", ",0,0,", `,
        `, ",", ""])), y[2], y[2], h, e + r - d * y[2], t + n)), p += _t(db || (db = Xr(["L ", ",", ""])), e + d * y[3], t + n), y[3] > 0 && (p += _t(vb || (vb = Xr(["A ", ",", ",0,0,", `,
        `, ",", ""])), y[3], y[3], h, e, t + n - f * y[3])), p += "Z";
  } else if (c > 0 && a === +a && a > 0) {
    var O = Math.min(c, a);
    p = _t(hb || (hb = Xr(["M ", ",", `
            A `, ",", ",0,0,", ",", ",", `
            L `, ",", `
            A `, ",", ",0,0,", ",", ",", `
            L `, ",", `
            A `, ",", ",0,0,", ",", ",", `
            L `, ",", `
            A `, ",", ",0,0,", ",", ",", " Z"])), e, t + f * O, O, O, h, e + d * O, t, e + r - d * O, t, O, O, h, e + r, t + f * O, e + r, t + n - f * O, O, O, h, e + r - d * O, t + n, e + d * O, t + n, O, O, h, e, t + n - f * O);
  } else
    p = _t(pb || (pb = Xr(["M ", ",", " h ", " v ", " h ", " Z"])), e, t, r, n, -r);
  return p;
}, wb = {
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
}, vP = (e) => {
  var t = Ut(e, wb), r = x.useRef(null), n = x.useState(-1), a = QN(n, 2), l = a[0], u = a[1];
  x.useEffect(() => {
    if (r.current && r.current.getTotalLength)
      try {
        var K = r.current.getTotalLength();
        K && u(K);
      } catch {
      }
  }, []);
  var c = t.x, f = t.y, d = t.width, h = t.height, p = t.radius, y = t.className, b = t.animationEasing, A = t.animationDuration, w = t.animationBegin, S = t.isAnimationActive, O = t.isUpdateAnimationActive, C = x.useRef(d), I = x.useRef(h), k = x.useRef(c), T = x.useRef(f), E = x.useMemo(() => ({
    x: c,
    y: f,
    width: d,
    height: h,
    radius: p
  }), [c, f, d, h, p]), $ = dP(E, "rectangle-");
  if (c !== +c || f !== +f || d !== +d || h !== +h || d === 0 || h === 0)
    return null;
  var F = ze("recharts-rectangle", y);
  if (!O) {
    var U = Pr(t);
    U.radius;
    var H = gb(U, HN);
    return /* @__PURE__ */ x.createElement("path", Xs({}, H, {
      x: ni(c),
      y: ni(f),
      width: ni(d),
      height: ni(h),
      radius: typeof p == "number" ? p : void 0,
      className: F,
      d: bb(c, f, d, h, p)
    }));
  }
  var G = C.current, W = I.current, ne = k.current, re = T.current, le = "0px ".concat(l === -1 ? 1 : l, "px"), fe = "".concat(l, "px ").concat(l, "px"), ae = KN(["strokeDasharray"], A, typeof b == "string" ? b : wb.animationEasing);
  return /* @__PURE__ */ x.createElement(fP, {
    animationId: $,
    key: $,
    canBegin: l > 0,
    duration: A,
    easing: b,
    isActive: O,
    begin: w
  }, (K) => {
    var te = nt(G, d, K), Y = nt(W, h, K), D = nt(ne, c, K), V = nt(re, f, K);
    r.current && (C.current = te, I.current = Y, k.current = D, T.current = V);
    var ve;
    S ? K > 0 ? ve = {
      transition: ae,
      strokeDasharray: fe
    } : ve = {
      strokeDasharray: le
    } : ve = {
      strokeDasharray: fe
    };
    var ye = Pr(t);
    ye.radius;
    var Ae = gb(ye, VN);
    return /* @__PURE__ */ x.createElement("path", Xs({}, Ae, {
      radius: typeof p == "number" ? p : void 0,
      className: F,
      d: bb(D, V, te, Y, p),
      ref: r,
      style: yb(yb({}, ve), t.style)
    }));
  });
};
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
function Ab(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Sb(Object(r), !0).forEach(function(n) {
      rD(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Sb(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function rD(e, t, r) {
  return (t = nD(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function nD(e) {
  var t = iD(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function iD(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Qs = Math.PI / 180, aD = (e) => e * 180 / Math.PI, ct = (e, t, r, n) => ({
  x: e + Math.cos(-Qs * n) * r,
  y: t + Math.sin(-Qs * n) * r
}), hP = function(t, r) {
  var n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
  return Math.min(Math.abs(t - (n.left || 0) - (n.right || 0)), Math.abs(r - (n.top || 0) - (n.bottom || 0))) / 2;
}, oD = (e, t) => {
  var r = e.x, n = e.y, a = t.x, l = t.y;
  return Math.sqrt((r - a) ** 2 + (n - l) ** 2);
}, lD = (e, t) => {
  var r = e.x, n = e.y, a = t.cx, l = t.cy, u = oD({
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
    angle: aD(f),
    angleInRadian: f
  };
}, uD = (e) => {
  var t = e.startAngle, r = e.endAngle, n = Math.floor(t / 360), a = Math.floor(r / 360), l = Math.min(n, a);
  return {
    startAngle: t - l * 360,
    endAngle: r - l * 360
  };
}, sD = (e, t) => {
  var r = t.startAngle, n = t.endAngle, a = Math.floor(r / 360), l = Math.floor(n / 360), u = Math.min(a, l);
  return e + u * 360;
}, cD = (e, t) => {
  var r = e.relativeX, n = e.relativeY, a = lD({
    x: r,
    y: n
  }, t), l = a.radius, u = a.angle, c = t.innerRadius, f = t.outerRadius;
  if (l < c || l > f || l === 0)
    return null;
  var d = uD(t), h = d.startAngle, p = d.endAngle, y = u, b;
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
  return b ? Ab(Ab({}, t), {}, {
    radius: l,
    angle: sD(y, t)
  }) : null;
};
function pP(e) {
  var t = e.cx, r = e.cy, n = e.radius, a = e.startAngle, l = e.endAngle, u = ct(t, r, n, a), c = ct(t, r, n, l);
  return {
    points: [u, c],
    cx: t,
    cy: r,
    radius: n,
    startAngle: a,
    endAngle: l
  };
}
var Pb, Ob, Eb, kb, Cb, Ib, jb;
function bh() {
  return bh = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, bh.apply(null, arguments);
}
function Di(e, t) {
  return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } }));
}
var fD = (e, t) => {
  var r = Ot(t - e), n = Math.min(Math.abs(t - e), 359.999);
  return r * n;
}, ms = (e) => {
  var t = e.cx, r = e.cy, n = e.radius, a = e.angle, l = e.sign, u = e.isExternal, c = e.cornerRadius, f = e.cornerIsExternal, d = c * (u ? 1 : -1) + n, h = Math.asin(c / d) / Qs, p = f ? a : a + l * h, y = ct(t, r, d, p), b = ct(t, r, n, p), A = f ? a - l * h : a, w = ct(t, r, d * Math.cos(h * Qs), A);
  return {
    center: y,
    circleTangency: b,
    lineTangency: w,
    theta: h
  };
}, mP = (e) => {
  var t = e.cx, r = e.cy, n = e.innerRadius, a = e.outerRadius, l = e.startAngle, u = e.endAngle, c = fD(l, u), f = l + c, d = ct(t, r, a, l), h = ct(t, r, a, f), p = _t(Pb || (Pb = Di(["M ", ",", `
    A `, ",", `,0,
    `, ",", `,
    `, ",", `
  `])), d.x, d.y, a, a, +(Math.abs(c) > 180), +(l > f), h.x, h.y);
  if (n > 0) {
    var y = ct(t, r, n, l), b = ct(t, r, n, f);
    p += _t(Ob || (Ob = Di(["L ", ",", `
            A `, ",", `,0,
            `, ",", `,
            `, ",", " Z"])), b.x, b.y, n, n, +(Math.abs(c) > 180), +(l <= f), y.x, y.y);
  } else
    p += _t(Eb || (Eb = Di(["L ", ",", " Z"])), t, r);
  return p;
}, dD = (e) => {
  var t = e.cx, r = e.cy, n = e.innerRadius, a = e.outerRadius, l = e.cornerRadius, u = e.forceCornerRadius, c = e.cornerIsExternal, f = e.startAngle, d = e.endAngle, h = Ot(d - f), p = ms({
    cx: t,
    cy: r,
    radius: a,
    angle: f,
    sign: h,
    cornerRadius: l,
    cornerIsExternal: c
  }), y = p.circleTangency, b = p.lineTangency, A = p.theta, w = ms({
    cx: t,
    cy: r,
    radius: a,
    angle: d,
    sign: -h,
    cornerRadius: l,
    cornerIsExternal: c
  }), S = w.circleTangency, O = w.lineTangency, C = w.theta, I = c ? Math.abs(f - d) : Math.abs(f - d) - A - C;
  if (I < 0)
    return u ? _t(kb || (kb = Di(["M ", ",", `
        a`, ",", ",0,0,1,", `,0
        a`, ",", ",0,0,1,", `,0
      `])), b.x, b.y, l, l, l * 2, l, l, -l * 2) : mP({
      cx: t,
      cy: r,
      innerRadius: n,
      outerRadius: a,
      startAngle: f,
      endAngle: d
    });
  var k = _t(Cb || (Cb = Di(["M ", ",", `
    A`, ",", ",0,0,", ",", ",", `
    A`, ",", ",0,", ",", ",", ",", `
    A`, ",", ",0,0,", ",", ",", `
  `])), b.x, b.y, l, l, +(h < 0), y.x, y.y, a, a, +(I > 180), +(h < 0), S.x, S.y, l, l, +(h < 0), O.x, O.y);
  if (n > 0) {
    var T = ms({
      cx: t,
      cy: r,
      radius: n,
      angle: f,
      sign: h,
      isExternal: !0,
      cornerRadius: l,
      cornerIsExternal: c
    }), E = T.circleTangency, $ = T.lineTangency, F = T.theta, U = ms({
      cx: t,
      cy: r,
      radius: n,
      angle: d,
      sign: -h,
      isExternal: !0,
      cornerRadius: l,
      cornerIsExternal: c
    }), H = U.circleTangency, G = U.lineTangency, W = U.theta, ne = c ? Math.abs(f - d) : Math.abs(f - d) - F - W;
    if (ne < 0 && l === 0)
      return "".concat(k, "L").concat(t, ",").concat(r, "Z");
    k += _t(Ib || (Ib = Di(["L", ",", `
      A`, ",", ",0,0,", ",", ",", `
      A`, ",", ",0,", ",", ",", ",", `
      A`, ",", ",0,0,", ",", ",", "Z"])), G.x, G.y, l, l, +(h < 0), H.x, H.y, n, n, +(ne > 180), +(h > 0), E.x, E.y, l, l, +(h < 0), $.x, $.y);
  } else
    k += _t(jb || (jb = Di(["L", ",", "Z"])), t, r);
  return k;
}, vD = {
  cx: 0,
  cy: 0,
  innerRadius: 0,
  outerRadius: 0,
  startAngle: 0,
  endAngle: 0,
  cornerRadius: 0,
  forceCornerRadius: !1,
  cornerIsExternal: !1
}, yP = (e) => {
  var t = Ut(e, vD), r = t.cx, n = t.cy, a = t.innerRadius, l = t.outerRadius, u = t.cornerRadius, c = t.forceCornerRadius, f = t.cornerIsExternal, d = t.startAngle, h = t.endAngle, p = t.className;
  if (l < a || d === h)
    return null;
  var y = ze("recharts-sector", p), b = l - a, A = Ft(u, b, 0, !0), w;
  return A > 0 && Math.abs(d - h) < 360 ? w = dD({
    cx: r,
    cy: n,
    innerRadius: a,
    outerRadius: l,
    cornerRadius: Math.min(A, b / 2),
    forceCornerRadius: c,
    cornerIsExternal: f,
    startAngle: d,
    endAngle: h
  }) : w = mP({
    cx: r,
    cy: n,
    innerRadius: a,
    outerRadius: l,
    startAngle: d,
    endAngle: h
  }), /* @__PURE__ */ x.createElement("path", bh({}, Pr(t), {
    className: y,
    d: w
  }));
};
function hD(e, t, r) {
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
  if (zS(t)) {
    if (e === "centric") {
      var n = t.cx, a = t.cy, l = t.innerRadius, u = t.outerRadius, c = t.angle, f = ct(n, a, l, c), d = ct(n, a, u, c);
      return [{
        x: f.x,
        y: f.y
      }, {
        x: d.x,
        y: d.y
      }];
    }
    return pP(t);
  }
}
function pD(e) {
  return Kh(e) ? NaN : Number(e);
}
function _v(e) {
  return e ? (e = pD(e), e === 1 / 0 || e === -1 / 0 ? (e < 0 ? -1 : 1) * Number.MAX_VALUE : e === e ? e : 0) : e === 0 ? e : 0;
}
function gP(e, t, r) {
  r && typeof r != "number" && oh(e, t, r) && (t = r = void 0), e = _v(e), t === void 0 ? (t = e, e = 0) : t = _v(t), r = r === void 0 ? e < t ? 1 : -1 : _v(r);
  const n = Math.max(Math.ceil((t - e) / (r || 1)), 0), a = new Array(n);
  for (let l = 0; l < n; l++)
    a[l] = e, e += r;
  return a;
}
var Wr = (e) => e.chartData, Bl = R([Wr], (e) => {
  var t = e.chartData != null ? e.chartData.length - 1 : 0;
  return {
    chartData: e.chartData,
    computedData: e.computedData,
    dataEndIndex: t,
    dataStartIndex: 0
  };
}), Vc = (e, t, r, n) => n ? Bl(e) : Wr(e), xP = (e, t, r) => r ? Bl(e) : Wr(e), mD = R([Vc], (e) => {
  var t = e.chartData, r = e.dataStartIndex, n = e.dataEndIndex;
  return t != null ? t.slice(r, n + 1) : [];
}), yD = R([Bl], (e) => {
  var t = e.chartData, r = e.dataStartIndex, n = e.dataEndIndex;
  return t != null ? t.slice(r, n + 1) : [];
}), gD = R([Wr], (e) => {
  var t = e.chartData, r = e.dataStartIndex, n = e.dataEndIndex;
  return t != null ? t.slice(r, n + 1) : [];
});
function dp(e, t) {
  return SD(e) || wD(e, t) || bD(e, t) || xD();
}
function xD() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function bD(e, t) {
  if (e) {
    if (typeof e == "string") return _b(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? _b(e, t) : void 0;
  }
}
function _b(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function wD(e, t) {
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
function SD(e) {
  if (Array.isArray(e)) return e;
}
function en(e) {
  if (Array.isArray(e) && e.length === 2) {
    var t = dp(e, 2), r = t[0], n = t[1];
    if (Oe(r) && Oe(n))
      return !0;
  }
  return !1;
}
function Tb(e, t, r) {
  return r ? e : [Math.min(e[0], t[0]), Math.max(e[1], t[1])];
}
function bP(e, t) {
  if (t && typeof e != "function" && Array.isArray(e) && e.length === 2) {
    var r = dp(e, 2), n = r[0], a = r[1], l, u;
    if (Oe(n))
      l = n;
    else if (typeof n == "function")
      return;
    if (Oe(a))
      u = a;
    else if (typeof a == "function")
      return;
    var c = [l, u];
    if (en(c))
      return c;
  }
}
function AD(e, t, r) {
  if (!(!r && t == null)) {
    if (typeof e == "function" && t != null)
      try {
        var n = e(t, r);
        if (en(n))
          return Tb(n, t, r);
      } catch {
      }
    if (Array.isArray(e) && e.length === 2) {
      var a = dp(e, 2), l = a[0], u = a[1], c, f;
      if (l === "auto")
        t != null && (c = Math.min(...t));
      else if (ie(l))
        c = l;
      else if (typeof l == "function")
        try {
          t != null && (c = l(t == null ? void 0 : t[0]));
        } catch {
        }
      else if (typeof l == "string" && jx.test(l)) {
        var d = jx.exec(l);
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
      else if (ie(u))
        f = u;
      else if (typeof u == "function")
        try {
          t != null && (f = u(t == null ? void 0 : t[1]));
        } catch {
        }
      else if (typeof u == "string" && _x.test(u)) {
        var p = _x.exec(u);
        if (p == null || p[1] == null || t == null)
          f = void 0;
        else {
          var y = +p[1];
          f = t[1] + y;
        }
      } else
        f = t == null ? void 0 : t[1];
      var b = [c, f];
      if (en(b))
        return t == null ? b : Tb(b, t, r);
    }
  }
}
var Ja = 1e9, PD = {
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
}, hp, qe = !0, Er = "[DecimalError] ", Fi = Er + "Invalid argument: ", vp = Er + "Exponent out of range: ", eo = Math.floor, _i = Math.pow, OD = /^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i, fr, Pt = 1e7, Ve = 7, wP = 9007199254740991, Zs = eo(wP / Ve), ce = {};
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
  var e = this, t = e.d.length - 1, r = (t - e.e) * Ve;
  if (t = e.d[t], t) for (; t % 10 == 0; t /= 10) r--;
  return r < 0 ? 0 : r;
};
ce.dividedBy = ce.div = function(e) {
  return Sn(this, new this.constructor(e));
};
ce.dividedToIntegerBy = ce.idiv = function(e) {
  var t = this, r = t.constructor;
  return Be(Sn(t, new r(e), 0, 1), r.precision);
};
ce.equals = ce.eq = function(e) {
  return !this.cmp(e);
};
ce.exponent = function() {
  return dt(this);
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
  else if (e = new n(e), e.s < 1 || e.eq(fr)) throw Error(Er + "NaN");
  if (r.s < 1) throw Error(Er + (r.s ? "NaN" : "-Infinity"));
  return r.eq(fr) ? new n(0) : (qe = !1, t = Sn(Pl(r, l), Pl(e, l), l), qe = !0, Be(t, a));
};
ce.minus = ce.sub = function(e) {
  var t = this;
  return e = new t.constructor(e), t.s == e.s ? PP(t, e) : SP(t, (e.s = -e.s, e));
};
ce.modulo = ce.mod = function(e) {
  var t, r = this, n = r.constructor, a = n.precision;
  if (e = new n(e), !e.s) throw Error(Er + "NaN");
  return r.s ? (qe = !1, t = Sn(r, e, 0, 1).times(e), qe = !0, r.minus(t)) : Be(new n(r), a);
};
ce.naturalExponential = ce.exp = function() {
  return AP(this);
};
ce.naturalLogarithm = ce.ln = function() {
  return Pl(this);
};
ce.negated = ce.neg = function() {
  var e = new this.constructor(this);
  return e.s = -e.s || 0, e;
};
ce.plus = ce.add = function(e) {
  var t = this;
  return e = new t.constructor(e), t.s == e.s ? SP(t, e) : PP(t, (e.s = -e.s, e));
};
ce.precision = ce.sd = function(e) {
  var t, r, n, a = this;
  if (e !== void 0 && e !== !!e && e !== 1 && e !== 0) throw Error(Fi + e);
  if (t = dt(a) + 1, n = a.d.length - 1, r = n * Ve + 1, n = a.d[n], n) {
    for (; n % 10 == 0; n /= 10) r--;
    for (n = a.d[0]; n >= 10; n /= 10) r++;
  }
  return e && t > r ? t : r;
};
ce.squareRoot = ce.sqrt = function() {
  var e, t, r, n, a, l, u, c = this, f = c.constructor;
  if (c.s < 1) {
    if (!c.s) return new f(0);
    throw Error(Er + "NaN");
  }
  for (e = dt(c), qe = !1, a = Math.sqrt(+c), a == 0 || a == 1 / 0 ? (t = Jr(c.d), (t.length + e) % 2 == 0 && (t += "0"), a = Math.sqrt(t), e = eo((e + 1) / 2) - (e < 0 || e % 2), a == 1 / 0 ? t = "5e" + e : (t = a.toExponential(), t = t.slice(0, t.indexOf("e") + 1) + e), n = new f(t)) : n = new f(a.toString()), r = f.precision, a = u = r + 3; ; )
    if (l = n, n = l.plus(Sn(c, l, u + 2)).times(0.5), Jr(l.d).slice(0, u) === (t = Jr(n.d)).slice(0, u)) {
      if (t = t.slice(u - 3, u + 1), a == u && t == "4999") {
        if (Be(l, r + 1, 0), l.times(l).eq(c)) {
          n = l;
          break;
        }
      } else if (t != "9999")
        break;
      u += 4;
    }
  return qe = !0, Be(n, r);
};
ce.times = ce.mul = function(e) {
  var t, r, n, a, l, u, c, f, d, h = this, p = h.constructor, y = h.d, b = (e = new p(e)).d;
  if (!h.s || !e.s) return new p(0);
  for (e.s *= h.s, r = h.e + e.e, f = y.length, d = b.length, f < d && (l = y, y = b, b = l, u = f, f = d, d = u), l = [], u = f + d, n = u; n--; ) l.push(0);
  for (n = d; --n >= 0; ) {
    for (t = 0, a = f + n; a > n; )
      c = l[a] + b[n] * y[a - n - 1] + t, l[a--] = c % Pt | 0, t = c / Pt | 0;
    l[a] = (l[a] + t) % Pt | 0;
  }
  for (; !l[--u]; ) l.pop();
  return t ? ++r : l.shift(), e.d = l, e.e = r, qe ? Be(e, p.precision) : e;
};
ce.toDecimalPlaces = ce.todp = function(e, t) {
  var r = this, n = r.constructor;
  return r = new n(r), e === void 0 ? r : (on(e, 0, Ja), t === void 0 ? t = n.rounding : on(t, 0, 8), Be(r, e + dt(r) + 1, t));
};
ce.toExponential = function(e, t) {
  var r, n = this, a = n.constructor;
  return e === void 0 ? r = Gi(n, !0) : (on(e, 0, Ja), t === void 0 ? t = a.rounding : on(t, 0, 8), n = Be(new a(n), e + 1, t), r = Gi(n, !0, e + 1)), r;
};
ce.toFixed = function(e, t) {
  var r, n, a = this, l = a.constructor;
  return e === void 0 ? Gi(a) : (on(e, 0, Ja), t === void 0 ? t = l.rounding : on(t, 0, 8), n = Be(new l(a), e + dt(a) + 1, t), r = Gi(n.abs(), !1, e + dt(n) + 1), a.isneg() && !a.isZero() ? "-" + r : r);
};
ce.toInteger = ce.toint = function() {
  var e = this, t = e.constructor;
  return Be(new t(e), dt(e) + 1, t.rounding);
};
ce.toNumber = function() {
  return +this;
};
ce.toPower = ce.pow = function(e) {
  var t, r, n, a, l, u, c = this, f = c.constructor, d = 12, h = +(e = new f(e));
  if (!e.s) return new f(fr);
  if (c = new f(c), !c.s) {
    if (e.s < 1) throw Error(Er + "Infinity");
    return c;
  }
  if (c.eq(fr)) return c;
  if (n = f.precision, e.eq(fr)) return Be(c, n);
  if (t = e.e, r = e.d.length - 1, u = t >= r, l = c.s, u) {
    if ((r = h < 0 ? -h : h) <= wP) {
      for (a = new f(fr), t = Math.ceil(n / Ve + 4), qe = !1; r % 2 && (a = a.times(c), Nb(a.d, t)), r = eo(r / 2), r !== 0; )
        c = c.times(c), Nb(c.d, t);
      return qe = !0, e.s < 0 ? new f(fr).div(a) : Be(a, n);
    }
  } else if (l < 0) throw Error(Er + "NaN");
  return l = l < 0 && e.d[Math.max(t, r)] & 1 ? -1 : 1, c.s = 1, qe = !1, a = e.times(Pl(c, n + d)), qe = !0, a = AP(a), a.s = l, a;
};
ce.toPrecision = function(e, t) {
  var r, n, a = this, l = a.constructor;
  return e === void 0 ? (r = dt(a), n = Gi(a, r <= l.toExpNeg || r >= l.toExpPos)) : (on(e, 1, Ja), t === void 0 ? t = l.rounding : on(t, 0, 8), a = Be(new l(a), e, t), r = dt(a), n = Gi(a, e <= r || r <= l.toExpNeg, e)), n;
};
ce.toSignificantDigits = ce.tosd = function(e, t) {
  var r = this, n = r.constructor;
  return e === void 0 ? (e = n.precision, t = n.rounding) : (on(e, 1, Ja), t === void 0 ? t = n.rounding : on(t, 0, 8)), Be(new n(r), e, t);
};
ce.toString = ce.valueOf = ce.val = ce.toJSON = ce[Symbol.for("nodejs.util.inspect.custom")] = function() {
  var e = this, t = dt(e), r = e.constructor;
  return Gi(e, t <= r.toExpNeg || t >= r.toExpPos);
};
function SP(e, t) {
  var r, n, a, l, u, c, f, d, h = e.constructor, p = h.precision;
  if (!e.s || !t.s)
    return t.s || (t = new h(e)), qe ? Be(t, p) : t;
  if (f = e.d, d = t.d, u = e.e, a = t.e, f = f.slice(), l = u - a, l) {
    for (l < 0 ? (n = f, l = -l, c = d.length) : (n = d, a = u, c = f.length), u = Math.ceil(p / Ve), c = u > c ? u + 1 : c + 1, l > c && (l = c, n.length = 1), n.reverse(); l--; ) n.push(0);
    n.reverse();
  }
  for (c = f.length, l = d.length, c - l < 0 && (l = c, n = d, d = f, f = n), r = 0; l; )
    r = (f[--l] = f[l] + d[l] + r) / Pt | 0, f[l] %= Pt;
  for (r && (f.unshift(r), ++a), c = f.length; f[--c] == 0; ) f.pop();
  return t.d = f, t.e = a, qe ? Be(t, p) : t;
}
function on(e, t, r) {
  if (e !== ~~e || e < t || e > r)
    throw Error(Fi + e);
}
function Jr(e) {
  var t, r, n, a = e.length - 1, l = "", u = e[0];
  if (a > 0) {
    for (l += u, t = 1; t < a; t++)
      n = e[t] + "", r = Ve - n.length, r && (l += ei(r)), l += n;
    u = e[t], n = u + "", r = Ve - n.length, r && (l += ei(r));
  } else if (u === 0)
    return "0";
  for (; u % 10 === 0; ) u /= 10;
  return l + u;
}
var Sn = /* @__PURE__ */ (function() {
  function e(n, a) {
    var l, u = 0, c = n.length;
    for (n = n.slice(); c--; )
      l = n[c] * a + u, n[c] = l % Pt | 0, u = l / Pt | 0;
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
      n[l] -= u, u = n[l] < a[l] ? 1 : 0, n[l] = u * Pt + n[l] - a[l];
    for (; !n[0] && n.length > 1; ) n.shift();
  }
  return function(n, a, l, u) {
    var c, f, d, h, p, y, b, A, w, S, O, C, I, k, T, E, $, F, U = n.constructor, H = n.s == a.s ? 1 : -1, G = n.d, W = a.d;
    if (!n.s) return new U(n);
    if (!a.s) throw Error(Er + "Division by zero");
    for (f = n.e - a.e, $ = W.length, T = G.length, b = new U(H), A = b.d = [], d = 0; W[d] == (G[d] || 0); ) ++d;
    if (W[d] > (G[d] || 0) && --f, l == null ? C = l = U.precision : u ? C = l + (dt(n) - dt(a)) + 1 : C = l, C < 0) return new U(0);
    if (C = C / Ve + 2 | 0, d = 0, $ == 1)
      for (h = 0, W = W[0], C++; (d < T || h) && C--; d++)
        I = h * Pt + (G[d] || 0), A[d] = I / W | 0, h = I % W | 0;
    else {
      for (h = Pt / (W[0] + 1) | 0, h > 1 && (W = e(W, h), G = e(G, h), $ = W.length, T = G.length), k = $, w = G.slice(0, $), S = w.length; S < $; ) w[S++] = 0;
      F = W.slice(), F.unshift(0), E = W[0], W[1] >= Pt / 2 && ++E;
      do
        h = 0, c = t(W, w, $, S), c < 0 ? (O = w[0], $ != S && (O = O * Pt + (w[1] || 0)), h = O / E | 0, h > 1 ? (h >= Pt && (h = Pt - 1), p = e(W, h), y = p.length, S = w.length, c = t(p, w, y, S), c == 1 && (h--, r(p, $ < y ? F : W, y))) : (h == 0 && (c = h = 1), p = W.slice()), y = p.length, y < S && p.unshift(0), r(w, p, S), c == -1 && (S = w.length, c = t(W, w, $, S), c < 1 && (h++, r(w, $ < S ? F : W, S))), S = w.length) : c === 0 && (h++, w = [0]), A[d++] = h, c && w[0] ? w[S++] = G[k] || 0 : (w = [G[k]], S = 1);
      while ((k++ < T || w[0] !== void 0) && C--);
    }
    return A[0] || A.shift(), b.e = f, Be(b, u ? l + dt(b) + 1 : l);
  };
})();
function AP(e, t) {
  var r, n, a, l, u, c, f = 0, d = 0, h = e.constructor, p = h.precision;
  if (dt(e) > 16) throw Error(vp + dt(e));
  if (!e.s) return new h(fr);
  for (qe = !1, c = p, u = new h(0.03125); e.abs().gte(0.1); )
    e = e.times(u), d += 5;
  for (n = Math.log(_i(2, d)) / Math.LN10 * 2 + 5 | 0, c += n, r = a = l = new h(fr), h.precision = c; ; ) {
    if (a = Be(a.times(e), c), r = r.times(++f), u = l.plus(Sn(a, r, c)), Jr(u.d).slice(0, c) === Jr(l.d).slice(0, c)) {
      for (; d--; ) l = Be(l.times(l), c);
      return h.precision = p, t == null ? (qe = !0, Be(l, p)) : l;
    }
    l = u;
  }
}
function dt(e) {
  for (var t = e.e * Ve, r = e.d[0]; r >= 10; r /= 10) t++;
  return t;
}
function Tv(e, t, r) {
  if (t > e.LN10.sd())
    throw qe = !0, r && (e.precision = r), Error(Er + "LN10 precision limit exceeded");
  return Be(new e(e.LN10), t);
}
function ei(e) {
  for (var t = ""; e--; ) t += "0";
  return t;
}
function Pl(e, t) {
  var r, n, a, l, u, c, f, d, h, p = 1, y = 10, b = e, A = b.d, w = b.constructor, S = w.precision;
  if (b.s < 1) throw Error(Er + (b.s ? "NaN" : "-Infinity"));
  if (b.eq(fr)) return new w(0);
  if (t == null ? (qe = !1, d = S) : d = t, b.eq(10))
    return t == null && (qe = !0), Tv(w, d);
  if (d += y, w.precision = d, r = Jr(A), n = r.charAt(0), l = dt(b), Math.abs(l) < 15e14) {
    for (; n < 7 && n != 1 || n == 1 && r.charAt(1) > 3; )
      b = b.times(e), r = Jr(b.d), n = r.charAt(0), p++;
    l = dt(b), n > 1 ? (b = new w("0." + r), l++) : b = new w(n + "." + r.slice(1));
  } else
    return f = Tv(w, d + 2, S).times(l + ""), b = Pl(new w(n + "." + r.slice(1)), d - y).plus(f), w.precision = S, t == null ? (qe = !0, Be(b, S)) : b;
  for (c = u = b = Sn(b.minus(fr), b.plus(fr), d), h = Be(b.times(b), d), a = 3; ; ) {
    if (u = Be(u.times(h), d), f = c.plus(Sn(u, new w(a), d)), Jr(f.d).slice(0, d) === Jr(c.d).slice(0, d))
      return c = c.times(2), l !== 0 && (c = c.plus(Tv(w, d + 2, S).times(l + ""))), c = Sn(c, new w(p), d), w.precision = S, t == null ? (qe = !0, Be(c, S)) : c;
    c = f, a += 2;
  }
}
function Mb(e, t) {
  var r, n, a;
  for ((r = t.indexOf(".")) > -1 && (t = t.replace(".", "")), (n = t.search(/e/i)) > 0 ? (r < 0 && (r = n), r += +t.slice(n + 1), t = t.substring(0, n)) : r < 0 && (r = t.length), n = 0; t.charCodeAt(n) === 48; ) ++n;
  for (a = t.length; t.charCodeAt(a - 1) === 48; ) --a;
  if (t = t.slice(n, a), t) {
    if (a -= n, r = r - n - 1, e.e = eo(r / Ve), e.d = [], n = (r + 1) % Ve, r < 0 && (n += Ve), n < a) {
      for (n && e.d.push(+t.slice(0, n)), a -= Ve; n < a; ) e.d.push(+t.slice(n, n += Ve));
      t = t.slice(n), n = Ve - t.length;
    } else
      n -= a;
    for (; n--; ) t += "0";
    if (e.d.push(+t), qe && (e.e > Zs || e.e < -Zs)) throw Error(vp + r);
  } else
    e.s = 0, e.e = 0, e.d = [0];
  return e;
}
function Be(e, t, r) {
  var n, a, l, u, c, f, d, h, p = e.d;
  for (u = 1, l = p[0]; l >= 10; l /= 10) u++;
  if (n = t - u, n < 0)
    n += Ve, a = t, d = p[h = 0];
  else {
    if (h = Math.ceil((n + 1) / Ve), l = p.length, h >= l) return e;
    for (d = l = p[h], u = 1; l >= 10; l /= 10) u++;
    n %= Ve, a = n - Ve + u;
  }
  if (r !== void 0 && (l = _i(10, u - a - 1), c = d / l % 10 | 0, f = t < 0 || p[h + 1] !== void 0 || d % l, f = r < 4 ? (c || f) && (r == 0 || r == (e.s < 0 ? 3 : 2)) : c > 5 || c == 5 && (r == 4 || f || r == 6 && // Check whether the digit to the left of the rounding digit is odd.
  (n > 0 ? a > 0 ? d / _i(10, u - a) : 0 : p[h - 1]) % 10 & 1 || r == (e.s < 0 ? 8 : 7))), t < 1 || !p[0])
    return f ? (l = dt(e), p.length = 1, t = t - l - 1, p[0] = _i(10, (Ve - t % Ve) % Ve), e.e = eo(-t / Ve) || 0) : (p.length = 1, p[0] = e.e = e.s = 0), e;
  if (n == 0 ? (p.length = h, l = 1, h--) : (p.length = h + 1, l = _i(10, Ve - n), p[h] = a > 0 ? (d / _i(10, u - a) % _i(10, a) | 0) * l : 0), f)
    for (; ; )
      if (h == 0) {
        (p[0] += l) == Pt && (p[0] = 1, ++e.e);
        break;
      } else {
        if (p[h] += l, p[h] != Pt) break;
        p[h--] = 0, l = 1;
      }
  for (n = p.length; p[--n] === 0; ) p.pop();
  if (qe && (e.e > Zs || e.e < -Zs))
    throw Error(vp + dt(e));
  return e;
}
function PP(e, t) {
  var r, n, a, l, u, c, f, d, h, p, y = e.constructor, b = y.precision;
  if (!e.s || !t.s)
    return t.s ? t.s = -t.s : t = new y(e), qe ? Be(t, b) : t;
  if (f = e.d, p = t.d, n = t.e, d = e.e, f = f.slice(), u = d - n, u) {
    for (h = u < 0, h ? (r = f, u = -u, c = p.length) : (r = p, n = d, c = f.length), a = Math.max(Math.ceil(b / Ve), c) + 2, u > a && (u = a, r.length = 1), r.reverse(), a = u; a--; ) r.push(0);
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
      for (l = a; l && f[--l] === 0; ) f[l] = Pt - 1;
      --f[l], f[a] += Pt;
    }
    f[a] -= p[a];
  }
  for (; f[--c] === 0; ) f.pop();
  for (; f[0] === 0; f.shift()) --n;
  return f[0] ? (t.d = f, t.e = n, qe ? Be(t, b) : t) : new y(0);
}
function Gi(e, t, r) {
  var n, a = dt(e), l = Jr(e.d), u = l.length;
  return t ? (r && (n = r - u) > 0 ? l = l.charAt(0) + "." + l.slice(1) + ei(n) : u > 1 && (l = l.charAt(0) + "." + l.slice(1)), l = l + (a < 0 ? "e" : "e+") + a) : a < 0 ? (l = "0." + ei(-a - 1) + l, r && (n = r - u) > 0 && (l += ei(n))) : a >= u ? (l += ei(a + 1 - u), r && (n = r - a - 1) > 0 && (l = l + "." + ei(n))) : ((n = a + 1) < u && (l = l.slice(0, n) + "." + l.slice(n)), r && (n = r - u) > 0 && (a + 1 === u && (l += "."), l += ei(n))), e.s < 0 ? "-" + l : l;
}
function Nb(e, t) {
  if (e.length > t)
    return e.length = t, !0;
}
function OP(e) {
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
        throw Error(Fi + l);
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
      return Mb(u, l.toString());
    } else if (typeof l != "string")
      throw Error(Fi + l);
    if (l.charCodeAt(0) === 45 ? (l = l.slice(1), u.s = -1) : u.s = 1, OD.test(l)) Mb(u, l);
    else throw Error(Fi + l);
  }
  if (a.prototype = ce, a.ROUND_UP = 0, a.ROUND_DOWN = 1, a.ROUND_CEIL = 2, a.ROUND_FLOOR = 3, a.ROUND_HALF_UP = 4, a.ROUND_HALF_DOWN = 5, a.ROUND_HALF_EVEN = 6, a.ROUND_HALF_CEIL = 7, a.ROUND_HALF_FLOOR = 8, a.clone = OP, a.config = a.set = ED, e === void 0 && (e = {}), e)
    for (n = ["precision", "rounding", "toExpNeg", "toExpPos", "LN10"], t = 0; t < n.length; ) e.hasOwnProperty(r = n[t++]) || (e[r] = this[r]);
  return a.config(e), a;
}
function ED(e) {
  if (!e || typeof e != "object")
    throw Error(Er + "Object expected");
  var t, r, n, a = [
    "precision",
    1,
    Ja,
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
      if (eo(n) === n && n >= a[t + 1] && n <= a[t + 2]) this[r] = n;
      else throw Error(Fi + r + ": " + n);
  if ((n = e[r = "LN10"]) !== void 0)
    if (n == Math.LN10) this[r] = new this(n);
    else throw Error(Fi + r + ": " + n);
  return this;
}
var hp = OP(PD);
fr = new hp(1);
const Ie = hp;
function EP(e) {
  var t;
  return e === 0 ? t = 1 : t = Math.floor(new Ie(e).abs().log(10).toNumber()) + 1, t;
}
function kP(e, t, r) {
  for (var n = new Ie(e), a = 0, l = []; n.lt(t) && a < 1e5; )
    l.push(n.toNumber()), n = n.add(r), a++;
  return l;
}
function Ol(e, t) {
  return jD(e) || ID(e, t) || CD(e, t) || kD();
}
function kD() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function CD(e, t) {
  if (e) {
    if (typeof e == "string") return Db(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? Db(e, t) : void 0;
  }
}
function Db(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function ID(e, t) {
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
function jD(e) {
  if (Array.isArray(e)) return e;
}
var CP = (e) => {
  var t = Ol(e, 2), r = t[0], n = t[1], a = r, l = n;
  return r > n && (a = n, l = r), [a, l];
}, pp = (e, t, r) => {
  if (e.lte(0))
    return new Ie(0);
  var n = EP(e.toNumber()), a = new Ie(10).pow(n), l = e.div(a), u = n !== 1 ? 0.05 : 0.1, c = new Ie(Math.ceil(l.div(u).toNumber())).add(r).mul(u), f = c.mul(a);
  return t ? new Ie(f.toNumber()) : new Ie(Math.ceil(f.toNumber()));
}, IP = (e, t, r) => {
  var n;
  if (e.lte(0))
    return new Ie(0);
  var a = [1, 2, 2.5, 5], l = e.toNumber(), u = Math.floor(new Ie(l).abs().log(10).toNumber()), c = new Ie(10).pow(u), f = e.div(c).toNumber(), d = a.findIndex((b) => b >= f - 1e-10);
  if (d === -1 && (c = c.mul(10), d = 0), d += r, d >= a.length) {
    var h = Math.floor(d / a.length);
    d %= a.length, c = c.mul(new Ie(10).pow(h));
  }
  var p = (n = a[d]) !== null && n !== void 0 ? n : 1, y = new Ie(p).mul(c);
  return t ? y : new Ie(Math.ceil(y.toNumber()));
}, _D = (e, t, r) => {
  var n = new Ie(1), a = new Ie(e);
  if (!a.isint() && r) {
    var l = Math.abs(e);
    l < 1 ? (n = new Ie(10).pow(EP(e) - 1), a = new Ie(Math.floor(a.div(n).toNumber())).mul(n)) : l > 1 && (a = new Ie(Math.floor(e)));
  } else e === 0 ? a = new Ie(Math.floor((t - 1) / 2)) : r || (a = new Ie(Math.floor(e)));
  for (var u = Math.floor((t - 1) / 2), c = [], f = 0; f < t; f++)
    c.push(a.add(new Ie(f - u).mul(n)).toNumber());
  return c;
}, jP = function(t, r, n, a) {
  var l = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : 0, u = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : pp;
  if (!Number.isFinite((r - t) / (n - 1)))
    return {
      step: new Ie(0),
      tickMin: new Ie(0),
      tickMax: new Ie(0)
    };
  var c = u(new Ie(r).sub(t).div(n - 1), a, l), f;
  t <= 0 && r >= 0 ? f = new Ie(0) : (f = new Ie(t).add(r).div(2), f = f.sub(new Ie(f).mod(c)));
  var d = Math.ceil(f.sub(t).div(c).toNumber()), h = Math.ceil(new Ie(r).sub(f).div(c).toNumber()), p = d + h + 1;
  return p > n ? jP(t, r, n, a, l + 1, u) : (p < n && (h = r > 0 ? h + (n - p) : h, d = r > 0 ? d : d + (n - p)), {
    step: c,
    tickMin: f.sub(new Ie(d).mul(c)),
    tickMax: f.add(new Ie(h).mul(c))
  });
}, $b = function(t) {
  var r = Ol(t, 2), n = r[0], a = r[1], l = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 6, u = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0, c = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : "auto", f = Math.max(l, 2), d = CP([n, a]), h = Ol(d, 2), p = h[0], y = h[1];
  if (p === -1 / 0 || y === 1 / 0) {
    var b = y === 1 / 0 ? [p, ...Array(l - 1).fill(1 / 0)] : [...Array(l - 1).fill(-1 / 0), y];
    return n > a ? b.reverse() : b;
  }
  if (p === y)
    return _D(p, l, u);
  var A = c === "snap125" ? IP : pp, w = jP(p, y, f, u, 0, A), S = w.step, O = w.tickMin, C = w.tickMax, I = kP(O, C.add(new Ie(0.1).mul(S)), S);
  return n > a ? I.reverse() : I;
}, Rb = function(t, r) {
  var n = Ol(t, 2), a = n[0], l = n[1], u = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0, c = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : "auto", f = CP([a, l]), d = Ol(f, 2), h = d[0], p = d[1];
  if (h === -1 / 0 || p === 1 / 0)
    return [a, l];
  if (h === p)
    return [h];
  var y = c === "snap125" ? IP : pp, b = Math.max(r, 2), A = y(new Ie(p).sub(h).div(b - 1), u, 0), w = [...kP(new Ie(h), new Ie(p), A), p];
  if (u === !1) {
    w = w.map((O) => Math.round(O));
    var S = w.length - 1;
    S > 0 && w[S] === w[S - 1] && (w = w.slice(0, S));
  }
  return a > l ? w.reverse() : w;
}, _P = (e) => e.rootProps.maxBarSize, TD = (e) => e.rootProps.barGap, TP = (e) => e.rootProps.barCategoryGap, MD = (e) => e.rootProps.barSize, Fl = (e) => e.rootProps.stackOffset, MP = (e) => e.rootProps.reverseStackOrder, mp = (e) => e.options.chartName, yp = (e) => e.rootProps.syncId, NP = (e) => e.rootProps.syncMethod, gp = (e) => e.options.eventEmitter, ND = (e) => e.rootProps.baseValue, ft = {
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
}, Ei = {
  allowDecimals: !1,
  // if I set this to false then Tooltip synchronisation stops working in Radar, wtf
  allowDataOverflow: !1,
  angleAxisId: 0,
  reversed: !1,
  scale: "auto",
  tick: !0,
  type: "auto"
}, Qr = {
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
}, Gc = (e, t) => {
  if (!(!e || !t))
    return e != null && e.reversed ? [t[1], t[0]] : t;
};
function Yc(e, t, r) {
  if (r !== "auto")
    return r;
  if (e != null)
    return ln(e, t) ? "category" : "number";
}
function Lb(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Js(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Lb(Object(r), !0).forEach(function(n) {
      DD(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Lb(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function DD(e, t, r) {
  return (t = $D(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function $D(e) {
  var t = RD(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function RD(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var zb = {
  allowDataOverflow: Ei.allowDataOverflow,
  allowDecimals: Ei.allowDecimals,
  allowDuplicatedCategory: !1,
  // defaultPolarAngleAxisProps.allowDuplicatedCategory has it set to true but the actual axis rendering ignores the prop because reasons,
  dataKey: void 0,
  domain: void 0,
  id: Ei.angleAxisId,
  includeHidden: !1,
  name: void 0,
  reversed: Ei.reversed,
  scale: Ei.scale,
  tick: Ei.tick,
  tickCount: void 0,
  ticks: void 0,
  type: Ei.type,
  unit: void 0,
  niceTicks: "auto"
}, Bb = {
  allowDataOverflow: Qr.allowDataOverflow,
  allowDecimals: Qr.allowDecimals,
  allowDuplicatedCategory: Qr.allowDuplicatedCategory,
  dataKey: void 0,
  domain: void 0,
  id: Qr.radiusAxisId,
  includeHidden: Qr.includeHidden,
  name: void 0,
  reversed: Qr.reversed,
  scale: Qr.scale,
  tick: Qr.tick,
  tickCount: Qr.tickCount,
  ticks: void 0,
  type: Qr.type,
  unit: void 0,
  niceTicks: "auto"
}, LD = (e, t) => {
  if (t != null)
    return e.polarAxis.angleAxis[t];
}, xp = R([LD, fp], (e, t) => {
  var r;
  if (e != null)
    return e;
  var n = (r = Yc(t, "angleAxis", zb.type)) !== null && r !== void 0 ? r : "category";
  return Js(Js({}, zb), {}, {
    type: n
  });
}), zD = (e, t) => e.polarAxis.radiusAxis[t], bp = R([zD, fp], (e, t) => {
  var r;
  if (e != null)
    return e;
  var n = (r = Yc(t, "radiusAxis", Bb.type)) !== null && r !== void 0 ? r : "category";
  return Js(Js({}, Bb), {}, {
    type: n
  });
}), qc = (e) => e.polarOptions, wp = R([Cn, In, gt], hP), DP = R([qc, wp], (e, t) => {
  if (e != null)
    return Ft(e.innerRadius, t, 0);
}), $P = R([qc, wp], (e, t) => {
  if (e != null)
    return Ft(e.outerRadius, t, t * 0.8);
}), BD = (e) => {
  if (e == null)
    return [0, 0];
  var t = e.startAngle, r = e.endAngle;
  return [t, r];
}, RP = R([qc], BD);
R([xp, RP], Gc);
var LP = R([wp, DP, $P], (e, t, r) => {
  if (!(e == null || t == null || r == null))
    return [t, r];
});
R([bp, LP], Gc);
var zP = R([_e, qc, DP, $P, Cn, In], (e, t, r, n, a, l) => {
  if (!(e !== "centric" && e !== "radial" || t == null || r == null || n == null)) {
    var u = t.cx, c = t.cy, f = t.startAngle, d = t.endAngle;
    return {
      cx: Ft(u, a, a / 2),
      cy: Ft(c, l, l / 2),
      innerRadius: r,
      outerRadius: n,
      startAngle: f,
      endAngle: d,
      clockWise: !1
      // this property look useful, why not use it?
    };
  }
}), Je = (e, t) => t, Wl = (e, t, r) => r;
function Xc(e) {
  return e == null ? void 0 : e.id;
}
function BP(e, t, r) {
  var n = t.chartData, a = n === void 0 ? [] : n, l = r.allowDuplicatedCategory, u = r.dataKey, c = /* @__PURE__ */ new Map();
  return e.forEach((f) => {
    var d, h = (d = f.data) !== null && d !== void 0 ? d : a;
    if (!(h == null || h.length === 0)) {
      var p = Xc(f);
      h.forEach((y, b) => {
        var A = u == null || l ? b : String($e(y, u, null)), w = $e(y, f.dataKey, 0), S;
        c.has(A) ? S = c.get(A) : S = {}, Object.assign(S, {
          [p]: w
        }), c.set(A, S);
      });
    }
  }), Array.from(c.values());
}
function Qc(e) {
  return "stackId" in e && e.stackId != null && e.dataKey != null;
}
var Ul = (e, t) => e === t ? !0 : e == null || t == null ? !1 : e[0] === t[0] && e[1] === t[1];
function Zc(e, t) {
  return Array.isArray(e) && Array.isArray(t) && e.length === 0 && t.length === 0 ? !0 : e === t;
}
function FD(e, t) {
  if (e.length === t.length) {
    for (var r = 0; r < e.length; r++)
      if (e[r] !== t[r])
        return !1;
    return !0;
  }
  return !1;
}
var Et = (e) => {
  var t = _e(e);
  return t === "horizontal" ? "xAxis" : t === "vertical" ? "yAxis" : t === "centric" ? "angleAxis" : "radiusAxis";
}, to = (e) => e.tooltip.settings.axisId;
function Sp(e) {
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
var FP = (e, t) => {
  if (t != null)
    switch (e) {
      case "linear": {
        if (!en(t)) {
          for (var r, n, a = 0; a < t.length; a++) {
            var l = t[a];
            Oe(l) && ((r === void 0 || l < r) && (r = l), (n === void 0 || l > n) && (n = l));
          }
          return r !== void 0 && n !== void 0 ? [r, n] : void 0;
        }
        return t;
      }
      default:
        return t;
    }
};
function ii(e, t) {
  return e == null || t == null ? NaN : e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function WD(e, t) {
  return e == null || t == null ? NaN : t < e ? -1 : t > e ? 1 : t >= e ? 0 : NaN;
}
function Ap(e) {
  let t, r, n;
  e.length !== 2 ? (t = ii, r = (c, f) => ii(e(c), f), n = (c, f) => e(c) - f) : (t = e === ii || e === WD ? e : UD, r = e, n = e);
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
function UD() {
  return 0;
}
function WP(e) {
  return e === null ? NaN : +e;
}
function* KD(e, t) {
  for (let r of e)
    r != null && (r = +r) >= r && (yield r);
}
const HD = Ap(ii), Kl = HD.right;
Ap(WP).center;
class Fb extends Map {
  constructor(t, r = YD) {
    if (super(), Object.defineProperties(this, { _intern: { value: /* @__PURE__ */ new Map() }, _key: { value: r } }), t != null) for (const [n, a] of t) this.set(n, a);
  }
  get(t) {
    return super.get(Wb(this, t));
  }
  has(t) {
    return super.has(Wb(this, t));
  }
  set(t, r) {
    return super.set(VD(this, t), r);
  }
  delete(t) {
    return super.delete(GD(this, t));
  }
}
function Wb({ _intern: e, _key: t }, r) {
  const n = t(r);
  return e.has(n) ? e.get(n) : r;
}
function VD({ _intern: e, _key: t }, r) {
  const n = t(r);
  return e.has(n) ? e.get(n) : (e.set(n, r), r);
}
function GD({ _intern: e, _key: t }, r) {
  const n = t(r);
  return e.has(n) && (r = e.get(n), e.delete(n)), r;
}
function YD(e) {
  return e !== null && typeof e == "object" ? e.valueOf() : e;
}
function qD(e = ii) {
  if (e === ii) return UP;
  if (typeof e != "function") throw new TypeError("compare is not a function");
  return (t, r) => {
    const n = e(t, r);
    return n || n === 0 ? n : (e(r, r) === 0) - (e(t, t) === 0);
  };
}
function UP(e, t) {
  return (e == null || !(e >= e)) - (t == null || !(t >= t)) || (e < t ? -1 : e > t ? 1 : 0);
}
const XD = Math.sqrt(50), QD = Math.sqrt(10), ZD = Math.sqrt(2);
function ec(e, t, r) {
  const n = (t - e) / Math.max(0, r), a = Math.floor(Math.log10(n)), l = n / Math.pow(10, a), u = l >= XD ? 10 : l >= QD ? 5 : l >= ZD ? 2 : 1;
  let c, f, d;
  return a < 0 ? (d = Math.pow(10, -a) / u, c = Math.round(e * d), f = Math.round(t * d), c / d < e && ++c, f / d > t && --f, d = -d) : (d = Math.pow(10, a) * u, c = Math.round(e / d), f = Math.round(t / d), c * d < e && ++c, f * d > t && --f), f < c && 0.5 <= r && r < 2 ? ec(e, t, r * 2) : [c, f, d];
}
function wh(e, t, r) {
  if (t = +t, e = +e, r = +r, !(r > 0)) return [];
  if (e === t) return [e];
  const n = t < e, [a, l, u] = n ? ec(t, e, r) : ec(e, t, r);
  if (!(l >= a)) return [];
  const c = l - a + 1, f = new Array(c);
  if (n)
    if (u < 0) for (let d = 0; d < c; ++d) f[d] = (l - d) / -u;
    else for (let d = 0; d < c; ++d) f[d] = (l - d) * u;
  else if (u < 0) for (let d = 0; d < c; ++d) f[d] = (a + d) / -u;
  else for (let d = 0; d < c; ++d) f[d] = (a + d) * u;
  return f;
}
function Sh(e, t, r) {
  return t = +t, e = +e, r = +r, ec(e, t, r)[2];
}
function Ah(e, t, r) {
  t = +t, e = +e, r = +r;
  const n = t < e, a = n ? Sh(t, e, r) : Sh(e, t, r);
  return (n ? -1 : 1) * (a < 0 ? 1 / -a : a);
}
function Ub(e, t) {
  let r;
  for (const n of e)
    n != null && (r < n || r === void 0 && n >= n) && (r = n);
  return r;
}
function Kb(e, t) {
  let r;
  for (const n of e)
    n != null && (r > n || r === void 0 && n >= n) && (r = n);
  return r;
}
function KP(e, t, r = 0, n = 1 / 0, a) {
  if (t = Math.floor(t), r = Math.floor(Math.max(0, r)), n = Math.floor(Math.min(e.length - 1, n)), !(r <= t && t <= n)) return e;
  for (a = a === void 0 ? UP : qD(a); n > r; ) {
    if (n - r > 600) {
      const f = n - r + 1, d = t - r + 1, h = Math.log(f), p = 0.5 * Math.exp(2 * h / 3), y = 0.5 * Math.sqrt(h * p * (f - p) / f) * (d - f / 2 < 0 ? -1 : 1), b = Math.max(r, Math.floor(t - d * p / f + y)), A = Math.min(n, Math.floor(t + (f - d) * p / f + y));
      KP(e, t, b, A, a);
    }
    const l = e[t];
    let u = r, c = n;
    for (rl(e, r, t), a(e[n], l) > 0 && rl(e, r, n); u < c; ) {
      for (rl(e, u, c), ++u, --c; a(e[u], l) < 0; ) ++u;
      for (; a(e[c], l) > 0; ) --c;
    }
    a(e[r], l) === 0 ? rl(e, r, c) : (++c, rl(e, c, n)), c <= t && (r = c + 1), t <= c && (n = c - 1);
  }
  return e;
}
function rl(e, t, r) {
  const n = e[t];
  e[t] = e[r], e[r] = n;
}
function JD(e, t, r) {
  if (e = Float64Array.from(KD(e)), !(!(n = e.length) || isNaN(t = +t))) {
    if (t <= 0 || n < 2) return Kb(e);
    if (t >= 1) return Ub(e);
    var n, a = (n - 1) * t, l = Math.floor(a), u = Ub(KP(e, l).subarray(0, l + 1)), c = Kb(e.subarray(l + 1));
    return u + (c - u) * (a - l);
  }
}
function e$(e, t, r = WP) {
  if (!(!(n = e.length) || isNaN(t = +t))) {
    if (t <= 0 || n < 2) return +r(e[0], 0, e);
    if (t >= 1) return +r(e[n - 1], n - 1, e);
    var n, a = (n - 1) * t, l = Math.floor(a), u = +r(e[l], l, e), c = +r(e[l + 1], l + 1, e);
    return u + (c - u) * (a - l);
  }
}
function t$(e, t, r) {
  e = +e, t = +t, r = (a = arguments.length) < 2 ? (t = e, e = 0, 1) : a < 3 ? 1 : +r;
  for (var n = -1, a = Math.max(0, Math.ceil((t - e) / r)) | 0, l = new Array(a); ++n < a; )
    l[n] = e + n * r;
  return l;
}
function kr(e, t) {
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
function jn(e, t) {
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
const Ph = Symbol("implicit");
function Pp() {
  var e = new Fb(), t = [], r = [], n = Ph;
  function a(l) {
    let u = e.get(l);
    if (u === void 0) {
      if (n !== Ph) return n;
      e.set(l, u = t.push(l) - 1);
    }
    return r[u % r.length];
  }
  return a.domain = function(l) {
    if (!arguments.length) return t.slice();
    t = [], e = new Fb();
    for (const u of l)
      e.has(u) || e.set(u, t.push(u) - 1);
    return a;
  }, a.range = function(l) {
    return arguments.length ? (r = Array.from(l), a) : r.slice();
  }, a.unknown = function(l) {
    return arguments.length ? (n = l, a) : n;
  }, a.copy = function() {
    return Pp(t, r).unknown(n);
  }, kr.apply(a, arguments), a;
}
function Op() {
  var e = Pp().unknown(void 0), t = e.domain, r = e.range, n = 0, a = 1, l, u, c = !1, f = 0, d = 0, h = 0.5;
  delete e.unknown;
  function p() {
    var y = t().length, b = a < n, A = b ? a : n, w = b ? n : a;
    l = (w - A) / Math.max(1, y - f + d * 2), c && (l = Math.floor(l)), A += (w - A - l * (y - f)) * h, u = l * (1 - f), c && (A = Math.round(A), u = Math.round(u));
    var S = t$(y).map(function(O) {
      return A + l * O;
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
    return Op(t(), [n, a]).round(c).paddingInner(f).paddingOuter(d).align(h);
  }, kr.apply(p(), arguments);
}
function HP(e) {
  var t = e.copy;
  return e.padding = e.paddingOuter, delete e.paddingInner, delete e.paddingOuter, e.copy = function() {
    return HP(t());
  }, e;
}
function r$() {
  return HP(Op.apply(null, arguments).paddingInner(1));
}
function Ep(e, t, r) {
  e.prototype = t.prototype = r, r.constructor = e;
}
function VP(e, t) {
  var r = Object.create(e.prototype);
  for (var n in t) r[n] = t[n];
  return r;
}
function Hl() {
}
var El = 0.7, tc = 1 / El, La = "\\s*([+-]?\\d+)\\s*", kl = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", tn = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", n$ = /^#([0-9a-f]{3,8})$/, i$ = new RegExp(`^rgb\\(${La},${La},${La}\\)$`), a$ = new RegExp(`^rgb\\(${tn},${tn},${tn}\\)$`), o$ = new RegExp(`^rgba\\(${La},${La},${La},${kl}\\)$`), l$ = new RegExp(`^rgba\\(${tn},${tn},${tn},${kl}\\)$`), u$ = new RegExp(`^hsl\\(${kl},${tn},${tn}\\)$`), s$ = new RegExp(`^hsla\\(${kl},${tn},${tn},${kl}\\)$`), Hb = {
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
Ep(Hl, Cl, {
  copy(e) {
    return Object.assign(new this.constructor(), this, e);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: Vb,
  // Deprecated! Use color.formatHex.
  formatHex: Vb,
  formatHex8: c$,
  formatHsl: f$,
  formatRgb: Gb,
  toString: Gb
});
function Vb() {
  return this.rgb().formatHex();
}
function c$() {
  return this.rgb().formatHex8();
}
function f$() {
  return GP(this).formatHsl();
}
function Gb() {
  return this.rgb().formatRgb();
}
function Cl(e) {
  var t, r;
  return e = (e + "").trim().toLowerCase(), (t = n$.exec(e)) ? (r = t[1].length, t = parseInt(t[1], 16), r === 6 ? Yb(t) : r === 3 ? new ir(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : r === 8 ? ys(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : r === 4 ? ys(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = i$.exec(e)) ? new ir(t[1], t[2], t[3], 1) : (t = a$.exec(e)) ? new ir(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = o$.exec(e)) ? ys(t[1], t[2], t[3], t[4]) : (t = l$.exec(e)) ? ys(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = u$.exec(e)) ? Qb(t[1], t[2] / 100, t[3] / 100, 1) : (t = s$.exec(e)) ? Qb(t[1], t[2] / 100, t[3] / 100, t[4]) : Hb.hasOwnProperty(e) ? Yb(Hb[e]) : e === "transparent" ? new ir(NaN, NaN, NaN, 0) : null;
}
function Yb(e) {
  return new ir(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function ys(e, t, r, n) {
  return n <= 0 && (e = t = r = NaN), new ir(e, t, r, n);
}
function d$(e) {
  return e instanceof Hl || (e = Cl(e)), e ? (e = e.rgb(), new ir(e.r, e.g, e.b, e.opacity)) : new ir();
}
function Oh(e, t, r, n) {
  return arguments.length === 1 ? d$(e) : new ir(e, t, r, n ?? 1);
}
function ir(e, t, r, n) {
  this.r = +e, this.g = +t, this.b = +r, this.opacity = +n;
}
Ep(ir, Oh, VP(Hl, {
  brighter(e) {
    return e = e == null ? tc : Math.pow(tc, e), new ir(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? El : Math.pow(El, e), new ir(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new ir(Wi(this.r), Wi(this.g), Wi(this.b), rc(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: qb,
  // Deprecated! Use color.formatHex.
  formatHex: qb,
  formatHex8: v$,
  formatRgb: Xb,
  toString: Xb
}));
function qb() {
  return `#${$i(this.r)}${$i(this.g)}${$i(this.b)}`;
}
function v$() {
  return `#${$i(this.r)}${$i(this.g)}${$i(this.b)}${$i((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function Xb() {
  const e = rc(this.opacity);
  return `${e === 1 ? "rgb(" : "rgba("}${Wi(this.r)}, ${Wi(this.g)}, ${Wi(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function rc(e) {
  return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function Wi(e) {
  return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function $i(e) {
  return e = Wi(e), (e < 16 ? "0" : "") + e.toString(16);
}
function Qb(e, t, r, n) {
  return n <= 0 ? e = t = r = NaN : r <= 0 || r >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new zr(e, t, r, n);
}
function GP(e) {
  if (e instanceof zr) return new zr(e.h, e.s, e.l, e.opacity);
  if (e instanceof Hl || (e = Cl(e)), !e) return new zr();
  if (e instanceof zr) return e;
  e = e.rgb();
  var t = e.r / 255, r = e.g / 255, n = e.b / 255, a = Math.min(t, r, n), l = Math.max(t, r, n), u = NaN, c = l - a, f = (l + a) / 2;
  return c ? (t === l ? u = (r - n) / c + (r < n) * 6 : r === l ? u = (n - t) / c + 2 : u = (t - r) / c + 4, c /= f < 0.5 ? l + a : 2 - l - a, u *= 60) : c = f > 0 && f < 1 ? 0 : u, new zr(u, c, f, e.opacity);
}
function h$(e, t, r, n) {
  return arguments.length === 1 ? GP(e) : new zr(e, t, r, n ?? 1);
}
function zr(e, t, r, n) {
  this.h = +e, this.s = +t, this.l = +r, this.opacity = +n;
}
Ep(zr, h$, VP(Hl, {
  brighter(e) {
    return e = e == null ? tc : Math.pow(tc, e), new zr(this.h, this.s, this.l * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? El : Math.pow(El, e), new zr(this.h, this.s, this.l * e, this.opacity);
  },
  rgb() {
    var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, r = this.l, n = r + (r < 0.5 ? r : 1 - r) * t, a = 2 * r - n;
    return new ir(
      Mv(e >= 240 ? e - 240 : e + 120, a, n),
      Mv(e, a, n),
      Mv(e < 120 ? e + 240 : e - 120, a, n),
      this.opacity
    );
  },
  clamp() {
    return new zr(Zb(this.h), gs(this.s), gs(this.l), rc(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const e = rc(this.opacity);
    return `${e === 1 ? "hsl(" : "hsla("}${Zb(this.h)}, ${gs(this.s) * 100}%, ${gs(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
  }
}));
function Zb(e) {
  return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function gs(e) {
  return Math.max(0, Math.min(1, e || 0));
}
function Mv(e, t, r) {
  return (e < 60 ? t + (r - t) * e / 60 : e < 180 ? r : e < 240 ? t + (r - t) * (240 - e) / 60 : t) * 255;
}
const kp = (e) => () => e;
function p$(e, t) {
  return function(r) {
    return e + r * t;
  };
}
function m$(e, t, r) {
  return e = Math.pow(e, r), t = Math.pow(t, r) - e, r = 1 / r, function(n) {
    return Math.pow(e + n * t, r);
  };
}
function y$(e) {
  return (e = +e) == 1 ? YP : function(t, r) {
    return r - t ? m$(t, r, e) : kp(isNaN(t) ? r : t);
  };
}
function YP(e, t) {
  var r = t - e;
  return r ? p$(e, r) : kp(isNaN(e) ? t : e);
}
const Jb = (function e(t) {
  var r = y$(t);
  function n(a, l) {
    var u = r((a = Oh(a)).r, (l = Oh(l)).r), c = r(a.g, l.g), f = r(a.b, l.b), d = YP(a.opacity, l.opacity);
    return function(h) {
      return a.r = u(h), a.g = c(h), a.b = f(h), a.opacity = d(h), a + "";
    };
  }
  return n.gamma = e, n;
})(1);
function g$(e, t) {
  t || (t = []);
  var r = e ? Math.min(t.length, e.length) : 0, n = t.slice(), a;
  return function(l) {
    for (a = 0; a < r; ++a) n[a] = e[a] * (1 - l) + t[a] * l;
    return n;
  };
}
function x$(e) {
  return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
function b$(e, t) {
  var r = t ? t.length : 0, n = e ? Math.min(r, e.length) : 0, a = new Array(n), l = new Array(r), u;
  for (u = 0; u < n; ++u) a[u] = ro(e[u], t[u]);
  for (; u < r; ++u) l[u] = t[u];
  return function(c) {
    for (u = 0; u < n; ++u) l[u] = a[u](c);
    return l;
  };
}
function w$(e, t) {
  var r = /* @__PURE__ */ new Date();
  return e = +e, t = +t, function(n) {
    return r.setTime(e * (1 - n) + t * n), r;
  };
}
function nc(e, t) {
  return e = +e, t = +t, function(r) {
    return e * (1 - r) + t * r;
  };
}
function S$(e, t) {
  var r = {}, n = {}, a;
  (e === null || typeof e != "object") && (e = {}), (t === null || typeof t != "object") && (t = {});
  for (a in t)
    a in e ? r[a] = ro(e[a], t[a]) : n[a] = t[a];
  return function(l) {
    for (a in r) n[a] = r[a](l);
    return n;
  };
}
var Eh = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, Nv = new RegExp(Eh.source, "g");
function A$(e) {
  return function() {
    return e;
  };
}
function P$(e) {
  return function(t) {
    return e(t) + "";
  };
}
function O$(e, t) {
  var r = Eh.lastIndex = Nv.lastIndex = 0, n, a, l, u = -1, c = [], f = [];
  for (e = e + "", t = t + ""; (n = Eh.exec(e)) && (a = Nv.exec(t)); )
    (l = a.index) > r && (l = t.slice(r, l), c[u] ? c[u] += l : c[++u] = l), (n = n[0]) === (a = a[0]) ? c[u] ? c[u] += a : c[++u] = a : (c[++u] = null, f.push({ i: u, x: nc(n, a) })), r = Nv.lastIndex;
  return r < t.length && (l = t.slice(r), c[u] ? c[u] += l : c[++u] = l), c.length < 2 ? f[0] ? P$(f[0].x) : A$(t) : (t = f.length, function(d) {
    for (var h = 0, p; h < t; ++h) c[(p = f[h]).i] = p.x(d);
    return c.join("");
  });
}
function ro(e, t) {
  var r = typeof t, n;
  return t == null || r === "boolean" ? kp(t) : (r === "number" ? nc : r === "string" ? (n = Cl(t)) ? (t = n, Jb) : O$ : t instanceof Cl ? Jb : t instanceof Date ? w$ : x$(t) ? g$ : Array.isArray(t) ? b$ : typeof t.valueOf != "function" && typeof t.toString != "function" || isNaN(t) ? S$ : nc)(e, t);
}
function Cp(e, t) {
  return e = +e, t = +t, function(r) {
    return Math.round(e * (1 - r) + t * r);
  };
}
function E$(e, t) {
  t === void 0 && (t = e, e = ro);
  for (var r = 0, n = t.length - 1, a = t[0], l = new Array(n < 0 ? 0 : n); r < n; ) l[r] = e(a, a = t[++r]);
  return function(u) {
    var c = Math.max(0, Math.min(n - 1, Math.floor(u *= n)));
    return l[c](u - c);
  };
}
function k$(e) {
  return function() {
    return e;
  };
}
function ic(e) {
  return +e;
}
var ew = [0, 1];
function qt(e) {
  return e;
}
function kh(e, t) {
  return (t -= e = +e) ? function(r) {
    return (r - e) / t;
  } : k$(isNaN(t) ? NaN : 0.5);
}
function C$(e, t) {
  var r;
  return e > t && (r = e, e = t, t = r), function(n) {
    return Math.max(e, Math.min(t, n));
  };
}
function I$(e, t, r) {
  var n = e[0], a = e[1], l = t[0], u = t[1];
  return a < n ? (n = kh(a, n), l = r(u, l)) : (n = kh(n, a), l = r(l, u)), function(c) {
    return l(n(c));
  };
}
function j$(e, t, r) {
  var n = Math.min(e.length, t.length) - 1, a = new Array(n), l = new Array(n), u = -1;
  for (e[n] < e[0] && (e = e.slice().reverse(), t = t.slice().reverse()); ++u < n; )
    a[u] = kh(e[u], e[u + 1]), l[u] = r(t[u], t[u + 1]);
  return function(c) {
    var f = Kl(e, c, 1, n) - 1;
    return l[f](a[f](c));
  };
}
function Vl(e, t) {
  return t.domain(e.domain()).range(e.range()).interpolate(e.interpolate()).clamp(e.clamp()).unknown(e.unknown());
}
function Jc() {
  var e = ew, t = ew, r = ro, n, a, l, u = qt, c, f, d;
  function h() {
    var y = Math.min(e.length, t.length);
    return u !== qt && (u = C$(e[0], e[y - 1])), c = y > 2 ? j$ : I$, f = d = null, p;
  }
  function p(y) {
    return y == null || isNaN(y = +y) ? l : (f || (f = c(e.map(n), t, r)))(n(u(y)));
  }
  return p.invert = function(y) {
    return u(a((d || (d = c(t, e.map(n), nc)))(y)));
  }, p.domain = function(y) {
    return arguments.length ? (e = Array.from(y, ic), h()) : e.slice();
  }, p.range = function(y) {
    return arguments.length ? (t = Array.from(y), h()) : t.slice();
  }, p.rangeRound = function(y) {
    return t = Array.from(y), r = Cp, h();
  }, p.clamp = function(y) {
    return arguments.length ? (u = y ? !0 : qt, h()) : u !== qt;
  }, p.interpolate = function(y) {
    return arguments.length ? (r = y, h()) : r;
  }, p.unknown = function(y) {
    return arguments.length ? (l = y, p) : l;
  }, function(y, b) {
    return n = y, a = b, h();
  };
}
function Ip() {
  return Jc()(qt, qt);
}
function _$(e) {
  return Math.abs(e = Math.round(e)) >= 1e21 ? e.toLocaleString("en").replace(/,/g, "") : e.toString(10);
}
function ac(e, t) {
  if (!isFinite(e) || e === 0) return null;
  var r = (e = t ? e.toExponential(t - 1) : e.toExponential()).indexOf("e"), n = e.slice(0, r);
  return [
    n.length > 1 ? n[0] + n.slice(2) : n,
    +e.slice(r + 1)
  ];
}
function Ha(e) {
  return e = ac(Math.abs(e)), e ? e[1] : NaN;
}
function T$(e, t) {
  return function(r, n) {
    for (var a = r.length, l = [], u = 0, c = e[0], f = 0; a > 0 && c > 0 && (f + c + 1 > n && (c = Math.max(1, n - f)), l.push(r.substring(a -= c, a + c)), !((f += c + 1) > n)); )
      c = e[u = (u + 1) % e.length];
    return l.reverse().join(t);
  };
}
function M$(e) {
  return function(t) {
    return t.replace(/[0-9]/g, function(r) {
      return e[+r];
    });
  };
}
var N$ = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
function Il(e) {
  if (!(t = N$.exec(e))) throw new Error("invalid format: " + e);
  var t;
  return new jp({
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
Il.prototype = jp.prototype;
function jp(e) {
  this.fill = e.fill === void 0 ? " " : e.fill + "", this.align = e.align === void 0 ? ">" : e.align + "", this.sign = e.sign === void 0 ? "-" : e.sign + "", this.symbol = e.symbol === void 0 ? "" : e.symbol + "", this.zero = !!e.zero, this.width = e.width === void 0 ? void 0 : +e.width, this.comma = !!e.comma, this.precision = e.precision === void 0 ? void 0 : +e.precision, this.trim = !!e.trim, this.type = e.type === void 0 ? "" : e.type + "";
}
jp.prototype.toString = function() {
  return this.fill + this.align + this.sign + this.symbol + (this.zero ? "0" : "") + (this.width === void 0 ? "" : Math.max(1, this.width | 0)) + (this.comma ? "," : "") + (this.precision === void 0 ? "" : "." + Math.max(0, this.precision | 0)) + (this.trim ? "~" : "") + this.type;
};
function D$(e) {
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
var oc;
function $$(e, t) {
  var r = ac(e, t);
  if (!r) return oc = void 0, e.toPrecision(t);
  var n = r[0], a = r[1], l = a - (oc = Math.max(-8, Math.min(8, Math.floor(a / 3))) * 3) + 1, u = n.length;
  return l === u ? n : l > u ? n + new Array(l - u + 1).join("0") : l > 0 ? n.slice(0, l) + "." + n.slice(l) : "0." + new Array(1 - l).join("0") + ac(e, Math.max(0, t + l - 1))[0];
}
function tw(e, t) {
  var r = ac(e, t);
  if (!r) return e + "";
  var n = r[0], a = r[1];
  return a < 0 ? "0." + new Array(-a).join("0") + n : n.length > a + 1 ? n.slice(0, a + 1) + "." + n.slice(a + 1) : n + new Array(a - n.length + 2).join("0");
}
const rw = {
  "%": (e, t) => (e * 100).toFixed(t),
  b: (e) => Math.round(e).toString(2),
  c: (e) => e + "",
  d: _$,
  e: (e, t) => e.toExponential(t),
  f: (e, t) => e.toFixed(t),
  g: (e, t) => e.toPrecision(t),
  o: (e) => Math.round(e).toString(8),
  p: (e, t) => tw(e * 100, t),
  r: tw,
  s: $$,
  X: (e) => Math.round(e).toString(16).toUpperCase(),
  x: (e) => Math.round(e).toString(16)
};
function nw(e) {
  return e;
}
var iw = Array.prototype.map, aw = ["y", "z", "a", "f", "p", "n", "µ", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"];
function R$(e) {
  var t = e.grouping === void 0 || e.thousands === void 0 ? nw : T$(iw.call(e.grouping, Number), e.thousands + ""), r = e.currency === void 0 ? "" : e.currency[0] + "", n = e.currency === void 0 ? "" : e.currency[1] + "", a = e.decimal === void 0 ? "." : e.decimal + "", l = e.numerals === void 0 ? nw : M$(iw.call(e.numerals, String)), u = e.percent === void 0 ? "%" : e.percent + "", c = e.minus === void 0 ? "−" : e.minus + "", f = e.nan === void 0 ? "NaN" : e.nan + "";
  function d(p, y) {
    p = Il(p);
    var b = p.fill, A = p.align, w = p.sign, S = p.symbol, O = p.zero, C = p.width, I = p.comma, k = p.precision, T = p.trim, E = p.type;
    E === "n" ? (I = !0, E = "g") : rw[E] || (k === void 0 && (k = 12), T = !0, E = "g"), (O || b === "0" && A === "=") && (O = !0, b = "0", A = "=");
    var $ = (y && y.prefix !== void 0 ? y.prefix : "") + (S === "$" ? r : S === "#" && /[boxX]/.test(E) ? "0" + E.toLowerCase() : ""), F = (S === "$" ? n : /[%p]/.test(E) ? u : "") + (y && y.suffix !== void 0 ? y.suffix : ""), U = rw[E], H = /[defgprs%]/.test(E);
    k = k === void 0 ? 6 : /[gprs]/.test(E) ? Math.max(1, Math.min(21, k)) : Math.max(0, Math.min(20, k));
    function G(W) {
      var ne = $, re = F, le, fe, ae;
      if (E === "c")
        re = U(W) + re, W = "";
      else {
        W = +W;
        var K = W < 0 || 1 / W < 0;
        if (W = isNaN(W) ? f : U(Math.abs(W), k), T && (W = D$(W)), K && +W == 0 && w !== "+" && (K = !1), ne = (K ? w === "(" ? w : c : w === "-" || w === "(" ? "" : w) + ne, re = (E === "s" && !isNaN(W) && oc !== void 0 ? aw[8 + oc / 3] : "") + re + (K && w === "(" ? ")" : ""), H) {
          for (le = -1, fe = W.length; ++le < fe; )
            if (ae = W.charCodeAt(le), 48 > ae || ae > 57) {
              re = (ae === 46 ? a + W.slice(le + 1) : W.slice(le)) + re, W = W.slice(0, le);
              break;
            }
        }
      }
      I && !O && (W = t(W, 1 / 0));
      var te = ne.length + W.length + re.length, Y = te < C ? new Array(C - te + 1).join(b) : "";
      switch (I && O && (W = t(Y + W, Y.length ? C - re.length : 1 / 0), Y = ""), A) {
        case "<":
          W = ne + W + re + Y;
          break;
        case "=":
          W = ne + Y + W + re;
          break;
        case "^":
          W = Y.slice(0, te = Y.length >> 1) + ne + W + re + Y.slice(te);
          break;
        default:
          W = Y + ne + W + re;
          break;
      }
      return l(W);
    }
    return G.toString = function() {
      return p + "";
    }, G;
  }
  function h(p, y) {
    var b = Math.max(-8, Math.min(8, Math.floor(Ha(y) / 3))) * 3, A = Math.pow(10, -b), w = d((p = Il(p), p.type = "f", p), { suffix: aw[8 + b / 3] });
    return function(S) {
      return w(A * S);
    };
  }
  return {
    format: d,
    formatPrefix: h
  };
}
var xs, _p, qP;
L$({
  thousands: ",",
  grouping: [3],
  currency: ["$", ""]
});
function L$(e) {
  return xs = R$(e), _p = xs.format, qP = xs.formatPrefix, xs;
}
function z$(e) {
  return Math.max(0, -Ha(Math.abs(e)));
}
function B$(e, t) {
  return Math.max(0, Math.max(-8, Math.min(8, Math.floor(Ha(t) / 3))) * 3 - Ha(Math.abs(e)));
}
function F$(e, t) {
  return e = Math.abs(e), t = Math.abs(t) - e, Math.max(0, Ha(t) - Ha(e)) + 1;
}
function XP(e, t, r, n) {
  var a = Ah(e, t, r), l;
  switch (n = Il(n ?? ",f"), n.type) {
    case "s": {
      var u = Math.max(Math.abs(e), Math.abs(t));
      return n.precision == null && !isNaN(l = B$(a, u)) && (n.precision = l), qP(n, u);
    }
    case "":
    case "e":
    case "g":
    case "p":
    case "r": {
      n.precision == null && !isNaN(l = F$(a, Math.max(Math.abs(e), Math.abs(t)))) && (n.precision = l - (n.type === "e"));
      break;
    }
    case "f":
    case "%": {
      n.precision == null && !isNaN(l = z$(a)) && (n.precision = l - (n.type === "%") * 2);
      break;
    }
  }
  return _p(n);
}
function ci(e) {
  var t = e.domain;
  return e.ticks = function(r) {
    var n = t();
    return wh(n[0], n[n.length - 1], r ?? 10);
  }, e.tickFormat = function(r, n) {
    var a = t();
    return XP(a[0], a[a.length - 1], r ?? 10, n);
  }, e.nice = function(r) {
    r == null && (r = 10);
    var n = t(), a = 0, l = n.length - 1, u = n[a], c = n[l], f, d, h = 10;
    for (c < u && (d = u, u = c, c = d, d = a, a = l, l = d); h-- > 0; ) {
      if (d = Sh(u, c, r), d === f)
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
function QP() {
  var e = Ip();
  return e.copy = function() {
    return Vl(e, QP());
  }, kr.apply(e, arguments), ci(e);
}
function ZP(e) {
  var t;
  function r(n) {
    return n == null || isNaN(n = +n) ? t : n;
  }
  return r.invert = r, r.domain = r.range = function(n) {
    return arguments.length ? (e = Array.from(n, ic), r) : e.slice();
  }, r.unknown = function(n) {
    return arguments.length ? (t = n, r) : t;
  }, r.copy = function() {
    return ZP(e).unknown(t);
  }, e = arguments.length ? Array.from(e, ic) : [0, 1], ci(r);
}
function JP(e, t) {
  e = e.slice();
  var r = 0, n = e.length - 1, a = e[r], l = e[n], u;
  return l < a && (u = r, r = n, n = u, u = a, a = l, l = u), e[r] = t.floor(a), e[n] = t.ceil(l), e;
}
function ow(e) {
  return Math.log(e);
}
function lw(e) {
  return Math.exp(e);
}
function W$(e) {
  return -Math.log(-e);
}
function U$(e) {
  return -Math.exp(-e);
}
function K$(e) {
  return isFinite(e) ? +("1e" + e) : e < 0 ? 0 : e;
}
function H$(e) {
  return e === 10 ? K$ : e === Math.E ? Math.exp : (t) => Math.pow(e, t);
}
function V$(e) {
  return e === Math.E ? Math.log : e === 10 && Math.log10 || e === 2 && Math.log2 || (e = Math.log(e), (t) => Math.log(t) / e);
}
function uw(e) {
  return (t, r) => -e(-t, r);
}
function Tp(e) {
  const t = e(ow, lw), r = t.domain;
  let n = 10, a, l;
  function u() {
    return a = V$(n), l = H$(n), r()[0] < 0 ? (a = uw(a), l = uw(l), e(W$, U$)) : e(ow, lw), t;
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
    let y = a(d), b = a(h), A, w;
    const S = c == null ? 10 : +c;
    let O = [];
    if (!(n % 1) && b - y < S) {
      if (y = Math.floor(y), b = Math.ceil(b), d > 0) {
        for (; y <= b; ++y)
          for (A = 1; A < n; ++A)
            if (w = y < 0 ? A / l(-y) : A * l(y), !(w < d)) {
              if (w > h) break;
              O.push(w);
            }
      } else for (; y <= b; ++y)
        for (A = n - 1; A >= 1; --A)
          if (w = y > 0 ? A / l(-y) : A * l(y), !(w < d)) {
            if (w > h) break;
            O.push(w);
          }
      O.length * 2 < S && (O = wh(d, h, S));
    } else
      O = wh(y, b, Math.min(b - y, S)).map(l);
    return p ? O.reverse() : O;
  }, t.tickFormat = (c, f) => {
    if (c == null && (c = 10), f == null && (f = n === 10 ? "s" : ","), typeof f != "function" && (!(n % 1) && (f = Il(f)).precision == null && (f.trim = !0), f = _p(f)), c === 1 / 0) return f;
    const d = Math.max(1, n * c / t.ticks().length);
    return (h) => {
      let p = h / l(Math.round(a(h)));
      return p * n < n - 0.5 && (p *= n), p <= d ? f(h) : "";
    };
  }, t.nice = () => r(JP(r(), {
    floor: (c) => l(Math.floor(a(c))),
    ceil: (c) => l(Math.ceil(a(c)))
  })), t;
}
function eO() {
  const e = Tp(Jc()).domain([1, 10]);
  return e.copy = () => Vl(e, eO()).base(e.base()), kr.apply(e, arguments), e;
}
function sw(e) {
  return function(t) {
    return Math.sign(t) * Math.log1p(Math.abs(t / e));
  };
}
function cw(e) {
  return function(t) {
    return Math.sign(t) * Math.expm1(Math.abs(t)) * e;
  };
}
function Mp(e) {
  var t = 1, r = e(sw(t), cw(t));
  return r.constant = function(n) {
    return arguments.length ? e(sw(t = +n), cw(t)) : t;
  }, ci(r);
}
function tO() {
  var e = Mp(Jc());
  return e.copy = function() {
    return Vl(e, tO()).constant(e.constant());
  }, kr.apply(e, arguments);
}
function fw(e) {
  return function(t) {
    return t < 0 ? -Math.pow(-t, e) : Math.pow(t, e);
  };
}
function G$(e) {
  return e < 0 ? -Math.sqrt(-e) : Math.sqrt(e);
}
function Y$(e) {
  return e < 0 ? -e * e : e * e;
}
function Np(e) {
  var t = e(qt, qt), r = 1;
  function n() {
    return r === 1 ? e(qt, qt) : r === 0.5 ? e(G$, Y$) : e(fw(r), fw(1 / r));
  }
  return t.exponent = function(a) {
    return arguments.length ? (r = +a, n()) : r;
  }, ci(t);
}
function Dp() {
  var e = Np(Jc());
  return e.copy = function() {
    return Vl(e, Dp()).exponent(e.exponent());
  }, kr.apply(e, arguments), e;
}
function q$() {
  return Dp.apply(null, arguments).exponent(0.5);
}
function dw(e) {
  return Math.sign(e) * e * e;
}
function X$(e) {
  return Math.sign(e) * Math.sqrt(Math.abs(e));
}
function rO() {
  var e = Ip(), t = [0, 1], r = !1, n;
  function a(l) {
    var u = X$(e(l));
    return isNaN(u) ? n : r ? Math.round(u) : u;
  }
  return a.invert = function(l) {
    return e.invert(dw(l));
  }, a.domain = function(l) {
    return arguments.length ? (e.domain(l), a) : e.domain();
  }, a.range = function(l) {
    return arguments.length ? (e.range((t = Array.from(l, ic)).map(dw)), a) : t.slice();
  }, a.rangeRound = function(l) {
    return a.range(l).round(!0);
  }, a.round = function(l) {
    return arguments.length ? (r = !!l, a) : r;
  }, a.clamp = function(l) {
    return arguments.length ? (e.clamp(l), a) : e.clamp();
  }, a.unknown = function(l) {
    return arguments.length ? (n = l, a) : n;
  }, a.copy = function() {
    return rO(e.domain(), t).round(r).clamp(e.clamp()).unknown(n);
  }, kr.apply(a, arguments), ci(a);
}
function nO() {
  var e = [], t = [], r = [], n;
  function a() {
    var u = 0, c = Math.max(1, t.length);
    for (r = new Array(c - 1); ++u < c; ) r[u - 1] = e$(e, u / c);
    return l;
  }
  function l(u) {
    return u == null || isNaN(u = +u) ? n : t[Kl(r, u)];
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
    return e.sort(ii), a();
  }, l.range = function(u) {
    return arguments.length ? (t = Array.from(u), a()) : t.slice();
  }, l.unknown = function(u) {
    return arguments.length ? (n = u, l) : n;
  }, l.quantiles = function() {
    return r.slice();
  }, l.copy = function() {
    return nO().domain(e).range(t).unknown(n);
  }, kr.apply(l, arguments);
}
function iO() {
  var e = 0, t = 1, r = 1, n = [0.5], a = [0, 1], l;
  function u(f) {
    return f != null && f <= f ? a[Kl(n, f, 0, r)] : l;
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
    return iO().domain([e, t]).range(a).unknown(l);
  }, kr.apply(ci(u), arguments);
}
function aO() {
  var e = [0.5], t = [0, 1], r, n = 1;
  function a(l) {
    return l != null && l <= l ? t[Kl(e, l, 0, n)] : r;
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
    return aO().domain(e).range(t).unknown(r);
  }, kr.apply(a, arguments);
}
const Dv = /* @__PURE__ */ new Date(), $v = /* @__PURE__ */ new Date();
function xt(e, t, r, n) {
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
  }, a.filter = (l) => xt((u) => {
    if (u >= u) for (; e(u), !l(u); ) u.setTime(u - 1);
  }, (u, c) => {
    if (u >= u)
      if (c < 0) for (; ++c <= 0; )
        for (; t(u, -1), !l(u); )
          ;
      else for (; --c >= 0; )
        for (; t(u, 1), !l(u); )
          ;
  }), r && (a.count = (l, u) => (Dv.setTime(+l), $v.setTime(+u), e(Dv), e($v), Math.floor(r(Dv, $v))), a.every = (l) => (l = Math.floor(l), !isFinite(l) || !(l > 0) ? null : l > 1 ? a.filter(n ? (u) => n(u) % l === 0 : (u) => a.count(0, u) % l === 0) : a)), a;
}
const lc = xt(() => {
}, (e, t) => {
  e.setTime(+e + t);
}, (e, t) => t - e);
lc.every = (e) => (e = Math.floor(e), !isFinite(e) || !(e > 0) ? null : e > 1 ? xt((t) => {
  t.setTime(Math.floor(t / e) * e);
}, (t, r) => {
  t.setTime(+t + r * e);
}, (t, r) => (r - t) / e) : lc);
lc.range;
const bn = 1e3, Ar = bn * 60, wn = Ar * 60, On = wn * 24, $p = On * 7, vw = On * 30, Rv = On * 365, Ri = xt((e) => {
  e.setTime(e - e.getMilliseconds());
}, (e, t) => {
  e.setTime(+e + t * bn);
}, (e, t) => (t - e) / bn, (e) => e.getUTCSeconds());
Ri.range;
const Rp = xt((e) => {
  e.setTime(e - e.getMilliseconds() - e.getSeconds() * bn);
}, (e, t) => {
  e.setTime(+e + t * Ar);
}, (e, t) => (t - e) / Ar, (e) => e.getMinutes());
Rp.range;
const Lp = xt((e) => {
  e.setUTCSeconds(0, 0);
}, (e, t) => {
  e.setTime(+e + t * Ar);
}, (e, t) => (t - e) / Ar, (e) => e.getUTCMinutes());
Lp.range;
const zp = xt((e) => {
  e.setTime(e - e.getMilliseconds() - e.getSeconds() * bn - e.getMinutes() * Ar);
}, (e, t) => {
  e.setTime(+e + t * wn);
}, (e, t) => (t - e) / wn, (e) => e.getHours());
zp.range;
const Bp = xt((e) => {
  e.setUTCMinutes(0, 0, 0);
}, (e, t) => {
  e.setTime(+e + t * wn);
}, (e, t) => (t - e) / wn, (e) => e.getUTCHours());
Bp.range;
const Gl = xt(
  (e) => e.setHours(0, 0, 0, 0),
  (e, t) => e.setDate(e.getDate() + t),
  (e, t) => (t - e - (t.getTimezoneOffset() - e.getTimezoneOffset()) * Ar) / On,
  (e) => e.getDate() - 1
);
Gl.range;
const ef = xt((e) => {
  e.setUTCHours(0, 0, 0, 0);
}, (e, t) => {
  e.setUTCDate(e.getUTCDate() + t);
}, (e, t) => (t - e) / On, (e) => e.getUTCDate() - 1);
ef.range;
const oO = xt((e) => {
  e.setUTCHours(0, 0, 0, 0);
}, (e, t) => {
  e.setUTCDate(e.getUTCDate() + t);
}, (e, t) => (t - e) / On, (e) => Math.floor(e / On));
oO.range;
function Ji(e) {
  return xt((t) => {
    t.setDate(t.getDate() - (t.getDay() + 7 - e) % 7), t.setHours(0, 0, 0, 0);
  }, (t, r) => {
    t.setDate(t.getDate() + r * 7);
  }, (t, r) => (r - t - (r.getTimezoneOffset() - t.getTimezoneOffset()) * Ar) / $p);
}
const tf = Ji(0), uc = Ji(1), Q$ = Ji(2), Z$ = Ji(3), Va = Ji(4), J$ = Ji(5), eR = Ji(6);
tf.range;
uc.range;
Q$.range;
Z$.range;
Va.range;
J$.range;
eR.range;
function ea(e) {
  return xt((t) => {
    t.setUTCDate(t.getUTCDate() - (t.getUTCDay() + 7 - e) % 7), t.setUTCHours(0, 0, 0, 0);
  }, (t, r) => {
    t.setUTCDate(t.getUTCDate() + r * 7);
  }, (t, r) => (r - t) / $p);
}
const rf = ea(0), sc = ea(1), tR = ea(2), rR = ea(3), Ga = ea(4), nR = ea(5), iR = ea(6);
rf.range;
sc.range;
tR.range;
rR.range;
Ga.range;
nR.range;
iR.range;
const Fp = xt((e) => {
  e.setDate(1), e.setHours(0, 0, 0, 0);
}, (e, t) => {
  e.setMonth(e.getMonth() + t);
}, (e, t) => t.getMonth() - e.getMonth() + (t.getFullYear() - e.getFullYear()) * 12, (e) => e.getMonth());
Fp.range;
const Wp = xt((e) => {
  e.setUTCDate(1), e.setUTCHours(0, 0, 0, 0);
}, (e, t) => {
  e.setUTCMonth(e.getUTCMonth() + t);
}, (e, t) => t.getUTCMonth() - e.getUTCMonth() + (t.getUTCFullYear() - e.getUTCFullYear()) * 12, (e) => e.getUTCMonth());
Wp.range;
const En = xt((e) => {
  e.setMonth(0, 1), e.setHours(0, 0, 0, 0);
}, (e, t) => {
  e.setFullYear(e.getFullYear() + t);
}, (e, t) => t.getFullYear() - e.getFullYear(), (e) => e.getFullYear());
En.every = (e) => !isFinite(e = Math.floor(e)) || !(e > 0) ? null : xt((t) => {
  t.setFullYear(Math.floor(t.getFullYear() / e) * e), t.setMonth(0, 1), t.setHours(0, 0, 0, 0);
}, (t, r) => {
  t.setFullYear(t.getFullYear() + r * e);
});
En.range;
const kn = xt((e) => {
  e.setUTCMonth(0, 1), e.setUTCHours(0, 0, 0, 0);
}, (e, t) => {
  e.setUTCFullYear(e.getUTCFullYear() + t);
}, (e, t) => t.getUTCFullYear() - e.getUTCFullYear(), (e) => e.getUTCFullYear());
kn.every = (e) => !isFinite(e = Math.floor(e)) || !(e > 0) ? null : xt((t) => {
  t.setUTCFullYear(Math.floor(t.getUTCFullYear() / e) * e), t.setUTCMonth(0, 1), t.setUTCHours(0, 0, 0, 0);
}, (t, r) => {
  t.setUTCFullYear(t.getUTCFullYear() + r * e);
});
kn.range;
function lO(e, t, r, n, a, l) {
  const u = [
    [Ri, 1, bn],
    [Ri, 5, 5 * bn],
    [Ri, 15, 15 * bn],
    [Ri, 30, 30 * bn],
    [l, 1, Ar],
    [l, 5, 5 * Ar],
    [l, 15, 15 * Ar],
    [l, 30, 30 * Ar],
    [a, 1, wn],
    [a, 3, 3 * wn],
    [a, 6, 6 * wn],
    [a, 12, 12 * wn],
    [n, 1, On],
    [n, 2, 2 * On],
    [r, 1, $p],
    [t, 1, vw],
    [t, 3, 3 * vw],
    [e, 1, Rv]
  ];
  function c(d, h, p) {
    const y = h < d;
    y && ([d, h] = [h, d]);
    const b = p && typeof p.range == "function" ? p : f(d, h, p), A = b ? b.range(d, +h + 1) : [];
    return y ? A.reverse() : A;
  }
  function f(d, h, p) {
    const y = Math.abs(h - d) / p, b = Ap(([, , S]) => S).right(u, y);
    if (b === u.length) return e.every(Ah(d / Rv, h / Rv, p));
    if (b === 0) return lc.every(Math.max(Ah(d, h, p), 1));
    const [A, w] = u[y / u[b - 1][2] < u[b][2] / y ? b - 1 : b];
    return A.every(w);
  }
  return [c, f];
}
const [aR, oR] = lO(kn, Wp, rf, oO, Bp, Lp), [lR, uR] = lO(En, Fp, tf, Gl, zp, Rp);
function Lv(e) {
  if (0 <= e.y && e.y < 100) {
    var t = new Date(-1, e.m, e.d, e.H, e.M, e.S, e.L);
    return t.setFullYear(e.y), t;
  }
  return new Date(e.y, e.m, e.d, e.H, e.M, e.S, e.L);
}
function zv(e) {
  if (0 <= e.y && e.y < 100) {
    var t = new Date(Date.UTC(-1, e.m, e.d, e.H, e.M, e.S, e.L));
    return t.setUTCFullYear(e.y), t;
  }
  return new Date(Date.UTC(e.y, e.m, e.d, e.H, e.M, e.S, e.L));
}
function nl(e, t, r) {
  return { y: e, m: t, d: r, H: 0, M: 0, S: 0, L: 0 };
}
function sR(e) {
  var t = e.dateTime, r = e.date, n = e.time, a = e.periods, l = e.days, u = e.shortDays, c = e.months, f = e.shortMonths, d = il(a), h = al(a), p = il(l), y = al(l), b = il(u), A = al(u), w = il(c), S = al(c), O = il(f), C = al(f), I = {
    a: ae,
    A: K,
    b: te,
    B: Y,
    c: null,
    d: xw,
    e: xw,
    f: TR,
    g: WR,
    G: KR,
    H: IR,
    I: jR,
    j: _R,
    L: uO,
    m: MR,
    M: NR,
    p: D,
    q: V,
    Q: Sw,
    s: Aw,
    S: DR,
    u: $R,
    U: RR,
    V: LR,
    w: zR,
    W: BR,
    x: null,
    X: null,
    y: FR,
    Y: UR,
    Z: HR,
    "%": ww
  }, k = {
    a: ve,
    A: ye,
    b: Ae,
    B: Pe,
    c: null,
    d: bw,
    e: bw,
    f: qR,
    g: aL,
    G: lL,
    H: VR,
    I: GR,
    j: YR,
    L: cO,
    m: XR,
    M: QR,
    p: Ee,
    q: Ce,
    Q: Sw,
    s: Aw,
    S: ZR,
    u: JR,
    U: eL,
    V: tL,
    w: rL,
    W: nL,
    x: null,
    X: null,
    y: iL,
    Y: oL,
    Z: uL,
    "%": ww
  }, T = {
    a: H,
    A: G,
    b: W,
    B: ne,
    c: re,
    d: yw,
    e: yw,
    f: OR,
    g: mw,
    G: pw,
    H: gw,
    I: gw,
    j: wR,
    L: PR,
    m: bR,
    M: SR,
    p: U,
    q: xR,
    Q: kR,
    s: CR,
    S: AR,
    u: hR,
    U: pR,
    V: mR,
    w: vR,
    W: yR,
    x: le,
    X: fe,
    y: mw,
    Y: pw,
    Z: gR,
    "%": ER
  };
  I.x = E(r, I), I.X = E(n, I), I.c = E(t, I), k.x = E(r, k), k.X = E(n, k), k.c = E(t, k);
  function E(J, me) {
    return function(we) {
      var Z = [], ot = -1, Te = 0, be = J.length, Nt, Ir, co;
      for (we instanceof Date || (we = /* @__PURE__ */ new Date(+we)); ++ot < be; )
        J.charCodeAt(ot) === 37 && (Z.push(J.slice(Te, ot)), (Ir = hw[Nt = J.charAt(++ot)]) != null ? Nt = J.charAt(++ot) : Ir = Nt === "e" ? " " : "0", (co = me[Nt]) && (Nt = co(we, Ir)), Z.push(Nt), Te = ot + 1);
      return Z.push(J.slice(Te, ot)), Z.join("");
    };
  }
  function $(J, me) {
    return function(we) {
      var Z = nl(1900, void 0, 1), ot = F(Z, J, we += "", 0), Te, be;
      if (ot != we.length) return null;
      if ("Q" in Z) return new Date(Z.Q);
      if ("s" in Z) return new Date(Z.s * 1e3 + ("L" in Z ? Z.L : 0));
      if (me && !("Z" in Z) && (Z.Z = 0), "p" in Z && (Z.H = Z.H % 12 + Z.p * 12), Z.m === void 0 && (Z.m = "q" in Z ? Z.q : 0), "V" in Z) {
        if (Z.V < 1 || Z.V > 53) return null;
        "w" in Z || (Z.w = 1), "Z" in Z ? (Te = zv(nl(Z.y, 0, 1)), be = Te.getUTCDay(), Te = be > 4 || be === 0 ? sc.ceil(Te) : sc(Te), Te = ef.offset(Te, (Z.V - 1) * 7), Z.y = Te.getUTCFullYear(), Z.m = Te.getUTCMonth(), Z.d = Te.getUTCDate() + (Z.w + 6) % 7) : (Te = Lv(nl(Z.y, 0, 1)), be = Te.getDay(), Te = be > 4 || be === 0 ? uc.ceil(Te) : uc(Te), Te = Gl.offset(Te, (Z.V - 1) * 7), Z.y = Te.getFullYear(), Z.m = Te.getMonth(), Z.d = Te.getDate() + (Z.w + 6) % 7);
      } else ("W" in Z || "U" in Z) && ("w" in Z || (Z.w = "u" in Z ? Z.u % 7 : "W" in Z ? 1 : 0), be = "Z" in Z ? zv(nl(Z.y, 0, 1)).getUTCDay() : Lv(nl(Z.y, 0, 1)).getDay(), Z.m = 0, Z.d = "W" in Z ? (Z.w + 6) % 7 + Z.W * 7 - (be + 5) % 7 : Z.w + Z.U * 7 - (be + 6) % 7);
      return "Z" in Z ? (Z.H += Z.Z / 100 | 0, Z.M += Z.Z % 100, zv(Z)) : Lv(Z);
    };
  }
  function F(J, me, we, Z) {
    for (var ot = 0, Te = me.length, be = we.length, Nt, Ir; ot < Te; ) {
      if (Z >= be) return -1;
      if (Nt = me.charCodeAt(ot++), Nt === 37) {
        if (Nt = me.charAt(ot++), Ir = T[Nt in hw ? me.charAt(ot++) : Nt], !Ir || (Z = Ir(J, we, Z)) < 0) return -1;
      } else if (Nt != we.charCodeAt(Z++))
        return -1;
    }
    return Z;
  }
  function U(J, me, we) {
    var Z = d.exec(me.slice(we));
    return Z ? (J.p = h.get(Z[0].toLowerCase()), we + Z[0].length) : -1;
  }
  function H(J, me, we) {
    var Z = b.exec(me.slice(we));
    return Z ? (J.w = A.get(Z[0].toLowerCase()), we + Z[0].length) : -1;
  }
  function G(J, me, we) {
    var Z = p.exec(me.slice(we));
    return Z ? (J.w = y.get(Z[0].toLowerCase()), we + Z[0].length) : -1;
  }
  function W(J, me, we) {
    var Z = O.exec(me.slice(we));
    return Z ? (J.m = C.get(Z[0].toLowerCase()), we + Z[0].length) : -1;
  }
  function ne(J, me, we) {
    var Z = w.exec(me.slice(we));
    return Z ? (J.m = S.get(Z[0].toLowerCase()), we + Z[0].length) : -1;
  }
  function re(J, me, we) {
    return F(J, t, me, we);
  }
  function le(J, me, we) {
    return F(J, r, me, we);
  }
  function fe(J, me, we) {
    return F(J, n, me, we);
  }
  function ae(J) {
    return u[J.getDay()];
  }
  function K(J) {
    return l[J.getDay()];
  }
  function te(J) {
    return f[J.getMonth()];
  }
  function Y(J) {
    return c[J.getMonth()];
  }
  function D(J) {
    return a[+(J.getHours() >= 12)];
  }
  function V(J) {
    return 1 + ~~(J.getMonth() / 3);
  }
  function ve(J) {
    return u[J.getUTCDay()];
  }
  function ye(J) {
    return l[J.getUTCDay()];
  }
  function Ae(J) {
    return f[J.getUTCMonth()];
  }
  function Pe(J) {
    return c[J.getUTCMonth()];
  }
  function Ee(J) {
    return a[+(J.getUTCHours() >= 12)];
  }
  function Ce(J) {
    return 1 + ~~(J.getUTCMonth() / 3);
  }
  return {
    format: function(J) {
      var me = E(J += "", I);
      return me.toString = function() {
        return J;
      }, me;
    },
    parse: function(J) {
      var me = $(J += "", !1);
      return me.toString = function() {
        return J;
      }, me;
    },
    utcFormat: function(J) {
      var me = E(J += "", k);
      return me.toString = function() {
        return J;
      }, me;
    },
    utcParse: function(J) {
      var me = $(J += "", !0);
      return me.toString = function() {
        return J;
      }, me;
    }
  };
}
var hw = { "-": "", _: " ", 0: "0" }, kt = /^\s*\d+/, cR = /^%/, fR = /[\\^$*+?|[\]().{}]/g;
function De(e, t, r) {
  var n = e < 0 ? "-" : "", a = (n ? -e : e) + "", l = a.length;
  return n + (l < r ? new Array(r - l + 1).join(t) + a : a);
}
function dR(e) {
  return e.replace(fR, "\\$&");
}
function il(e) {
  return new RegExp("^(?:" + e.map(dR).join("|") + ")", "i");
}
function al(e) {
  return new Map(e.map((t, r) => [t.toLowerCase(), r]));
}
function vR(e, t, r) {
  var n = kt.exec(t.slice(r, r + 1));
  return n ? (e.w = +n[0], r + n[0].length) : -1;
}
function hR(e, t, r) {
  var n = kt.exec(t.slice(r, r + 1));
  return n ? (e.u = +n[0], r + n[0].length) : -1;
}
function pR(e, t, r) {
  var n = kt.exec(t.slice(r, r + 2));
  return n ? (e.U = +n[0], r + n[0].length) : -1;
}
function mR(e, t, r) {
  var n = kt.exec(t.slice(r, r + 2));
  return n ? (e.V = +n[0], r + n[0].length) : -1;
}
function yR(e, t, r) {
  var n = kt.exec(t.slice(r, r + 2));
  return n ? (e.W = +n[0], r + n[0].length) : -1;
}
function pw(e, t, r) {
  var n = kt.exec(t.slice(r, r + 4));
  return n ? (e.y = +n[0], r + n[0].length) : -1;
}
function mw(e, t, r) {
  var n = kt.exec(t.slice(r, r + 2));
  return n ? (e.y = +n[0] + (+n[0] > 68 ? 1900 : 2e3), r + n[0].length) : -1;
}
function gR(e, t, r) {
  var n = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(t.slice(r, r + 6));
  return n ? (e.Z = n[1] ? 0 : -(n[2] + (n[3] || "00")), r + n[0].length) : -1;
}
function xR(e, t, r) {
  var n = kt.exec(t.slice(r, r + 1));
  return n ? (e.q = n[0] * 3 - 3, r + n[0].length) : -1;
}
function bR(e, t, r) {
  var n = kt.exec(t.slice(r, r + 2));
  return n ? (e.m = n[0] - 1, r + n[0].length) : -1;
}
function yw(e, t, r) {
  var n = kt.exec(t.slice(r, r + 2));
  return n ? (e.d = +n[0], r + n[0].length) : -1;
}
function wR(e, t, r) {
  var n = kt.exec(t.slice(r, r + 3));
  return n ? (e.m = 0, e.d = +n[0], r + n[0].length) : -1;
}
function gw(e, t, r) {
  var n = kt.exec(t.slice(r, r + 2));
  return n ? (e.H = +n[0], r + n[0].length) : -1;
}
function SR(e, t, r) {
  var n = kt.exec(t.slice(r, r + 2));
  return n ? (e.M = +n[0], r + n[0].length) : -1;
}
function AR(e, t, r) {
  var n = kt.exec(t.slice(r, r + 2));
  return n ? (e.S = +n[0], r + n[0].length) : -1;
}
function PR(e, t, r) {
  var n = kt.exec(t.slice(r, r + 3));
  return n ? (e.L = +n[0], r + n[0].length) : -1;
}
function OR(e, t, r) {
  var n = kt.exec(t.slice(r, r + 6));
  return n ? (e.L = Math.floor(n[0] / 1e3), r + n[0].length) : -1;
}
function ER(e, t, r) {
  var n = cR.exec(t.slice(r, r + 1));
  return n ? r + n[0].length : -1;
}
function kR(e, t, r) {
  var n = kt.exec(t.slice(r));
  return n ? (e.Q = +n[0], r + n[0].length) : -1;
}
function CR(e, t, r) {
  var n = kt.exec(t.slice(r));
  return n ? (e.s = +n[0], r + n[0].length) : -1;
}
function xw(e, t) {
  return De(e.getDate(), t, 2);
}
function IR(e, t) {
  return De(e.getHours(), t, 2);
}
function jR(e, t) {
  return De(e.getHours() % 12 || 12, t, 2);
}
function _R(e, t) {
  return De(1 + Gl.count(En(e), e), t, 3);
}
function uO(e, t) {
  return De(e.getMilliseconds(), t, 3);
}
function TR(e, t) {
  return uO(e, t) + "000";
}
function MR(e, t) {
  return De(e.getMonth() + 1, t, 2);
}
function NR(e, t) {
  return De(e.getMinutes(), t, 2);
}
function DR(e, t) {
  return De(e.getSeconds(), t, 2);
}
function $R(e) {
  var t = e.getDay();
  return t === 0 ? 7 : t;
}
function RR(e, t) {
  return De(tf.count(En(e) - 1, e), t, 2);
}
function sO(e) {
  var t = e.getDay();
  return t >= 4 || t === 0 ? Va(e) : Va.ceil(e);
}
function LR(e, t) {
  return e = sO(e), De(Va.count(En(e), e) + (En(e).getDay() === 4), t, 2);
}
function zR(e) {
  return e.getDay();
}
function BR(e, t) {
  return De(uc.count(En(e) - 1, e), t, 2);
}
function FR(e, t) {
  return De(e.getFullYear() % 100, t, 2);
}
function WR(e, t) {
  return e = sO(e), De(e.getFullYear() % 100, t, 2);
}
function UR(e, t) {
  return De(e.getFullYear() % 1e4, t, 4);
}
function KR(e, t) {
  var r = e.getDay();
  return e = r >= 4 || r === 0 ? Va(e) : Va.ceil(e), De(e.getFullYear() % 1e4, t, 4);
}
function HR(e) {
  var t = e.getTimezoneOffset();
  return (t > 0 ? "-" : (t *= -1, "+")) + De(t / 60 | 0, "0", 2) + De(t % 60, "0", 2);
}
function bw(e, t) {
  return De(e.getUTCDate(), t, 2);
}
function VR(e, t) {
  return De(e.getUTCHours(), t, 2);
}
function GR(e, t) {
  return De(e.getUTCHours() % 12 || 12, t, 2);
}
function YR(e, t) {
  return De(1 + ef.count(kn(e), e), t, 3);
}
function cO(e, t) {
  return De(e.getUTCMilliseconds(), t, 3);
}
function qR(e, t) {
  return cO(e, t) + "000";
}
function XR(e, t) {
  return De(e.getUTCMonth() + 1, t, 2);
}
function QR(e, t) {
  return De(e.getUTCMinutes(), t, 2);
}
function ZR(e, t) {
  return De(e.getUTCSeconds(), t, 2);
}
function JR(e) {
  var t = e.getUTCDay();
  return t === 0 ? 7 : t;
}
function eL(e, t) {
  return De(rf.count(kn(e) - 1, e), t, 2);
}
function fO(e) {
  var t = e.getUTCDay();
  return t >= 4 || t === 0 ? Ga(e) : Ga.ceil(e);
}
function tL(e, t) {
  return e = fO(e), De(Ga.count(kn(e), e) + (kn(e).getUTCDay() === 4), t, 2);
}
function rL(e) {
  return e.getUTCDay();
}
function nL(e, t) {
  return De(sc.count(kn(e) - 1, e), t, 2);
}
function iL(e, t) {
  return De(e.getUTCFullYear() % 100, t, 2);
}
function aL(e, t) {
  return e = fO(e), De(e.getUTCFullYear() % 100, t, 2);
}
function oL(e, t) {
  return De(e.getUTCFullYear() % 1e4, t, 4);
}
function lL(e, t) {
  var r = e.getUTCDay();
  return e = r >= 4 || r === 0 ? Ga(e) : Ga.ceil(e), De(e.getUTCFullYear() % 1e4, t, 4);
}
function uL() {
  return "+0000";
}
function ww() {
  return "%";
}
function Sw(e) {
  return +e;
}
function Aw(e) {
  return Math.floor(+e / 1e3);
}
var Ia, dO, vO;
sL({
  dateTime: "%x, %X",
  date: "%-m/%-d/%Y",
  time: "%-I:%M:%S %p",
  periods: ["AM", "PM"],
  days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
});
function sL(e) {
  return Ia = sR(e), dO = Ia.format, Ia.parse, vO = Ia.utcFormat, Ia.utcParse, Ia;
}
function cL(e) {
  return new Date(e);
}
function fL(e) {
  return e instanceof Date ? +e : +/* @__PURE__ */ new Date(+e);
}
function Up(e, t, r, n, a, l, u, c, f, d) {
  var h = Ip(), p = h.invert, y = h.domain, b = d(".%L"), A = d(":%S"), w = d("%I:%M"), S = d("%I %p"), O = d("%a %d"), C = d("%b %d"), I = d("%B"), k = d("%Y");
  function T(E) {
    return (f(E) < E ? b : c(E) < E ? A : u(E) < E ? w : l(E) < E ? S : n(E) < E ? a(E) < E ? O : C : r(E) < E ? I : k)(E);
  }
  return h.invert = function(E) {
    return new Date(p(E));
  }, h.domain = function(E) {
    return arguments.length ? y(Array.from(E, fL)) : y().map(cL);
  }, h.ticks = function(E) {
    var $ = y();
    return e($[0], $[$.length - 1], E ?? 10);
  }, h.tickFormat = function(E, $) {
    return $ == null ? T : d($);
  }, h.nice = function(E) {
    var $ = y();
    return (!E || typeof E.range != "function") && (E = t($[0], $[$.length - 1], E ?? 10)), E ? y(JP($, E)) : h;
  }, h.copy = function() {
    return Vl(h, Up(e, t, r, n, a, l, u, c, f, d));
  }, h;
}
function dL() {
  return kr.apply(Up(lR, uR, En, Fp, tf, Gl, zp, Rp, Ri, dO).domain([new Date(2e3, 0, 1), new Date(2e3, 0, 2)]), arguments);
}
function vL() {
  return kr.apply(Up(aR, oR, kn, Wp, rf, ef, Bp, Lp, Ri, vO).domain([Date.UTC(2e3, 0, 1), Date.UTC(2e3, 0, 2)]), arguments);
}
function nf() {
  var e = 0, t = 1, r, n, a, l, u = qt, c = !1, f;
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
      var b, A;
      return arguments.length ? ([b, A] = y, u = p(b, A), d) : [u(0), u(1)];
    };
  }
  return d.range = h(ro), d.rangeRound = h(Cp), d.unknown = function(p) {
    return arguments.length ? (f = p, d) : f;
  }, function(p) {
    return l = p, r = p(e), n = p(t), a = r === n ? 0 : 1 / (n - r), d;
  };
}
function fi(e, t) {
  return t.domain(e.domain()).interpolator(e.interpolator()).clamp(e.clamp()).unknown(e.unknown());
}
function hO() {
  var e = ci(nf()(qt));
  return e.copy = function() {
    return fi(e, hO());
  }, jn.apply(e, arguments);
}
function pO() {
  var e = Tp(nf()).domain([1, 10]);
  return e.copy = function() {
    return fi(e, pO()).base(e.base());
  }, jn.apply(e, arguments);
}
function mO() {
  var e = Mp(nf());
  return e.copy = function() {
    return fi(e, mO()).constant(e.constant());
  }, jn.apply(e, arguments);
}
function Kp() {
  var e = Np(nf());
  return e.copy = function() {
    return fi(e, Kp()).exponent(e.exponent());
  }, jn.apply(e, arguments);
}
function hL() {
  return Kp.apply(null, arguments).exponent(0.5);
}
function yO() {
  var e = [], t = qt;
  function r(n) {
    if (n != null && !isNaN(n = +n)) return t((Kl(e, n, 1) - 1) / (e.length - 1));
  }
  return r.domain = function(n) {
    if (!arguments.length) return e.slice();
    e = [];
    for (let a of n) a != null && !isNaN(a = +a) && e.push(a);
    return e.sort(ii), r;
  }, r.interpolator = function(n) {
    return arguments.length ? (t = n, r) : t;
  }, r.range = function() {
    return e.map((n, a) => t(a / (e.length - 1)));
  }, r.quantiles = function(n) {
    return Array.from({ length: n + 1 }, (a, l) => JD(e, l / n));
  }, r.copy = function() {
    return yO(t).domain(e);
  }, jn.apply(r, arguments);
}
function af() {
  var e = 0, t = 0.5, r = 1, n = 1, a, l, u, c, f, d = qt, h, p = !1, y;
  function b(w) {
    return isNaN(w = +w) ? y : (w = 0.5 + ((w = +h(w)) - l) * (n * w < n * l ? c : f), d(p ? Math.max(0, Math.min(1, w)) : w));
  }
  b.domain = function(w) {
    return arguments.length ? ([e, t, r] = w, a = h(e = +e), l = h(t = +t), u = h(r = +r), c = a === l ? 0 : 0.5 / (l - a), f = l === u ? 0 : 0.5 / (u - l), n = l < a ? -1 : 1, b) : [e, t, r];
  }, b.clamp = function(w) {
    return arguments.length ? (p = !!w, b) : p;
  }, b.interpolator = function(w) {
    return arguments.length ? (d = w, b) : d;
  };
  function A(w) {
    return function(S) {
      var O, C, I;
      return arguments.length ? ([O, C, I] = S, d = E$(w, [O, C, I]), b) : [d(0), d(0.5), d(1)];
    };
  }
  return b.range = A(ro), b.rangeRound = A(Cp), b.unknown = function(w) {
    return arguments.length ? (y = w, b) : y;
  }, function(w) {
    return h = w, a = w(e), l = w(t), u = w(r), c = a === l ? 0 : 0.5 / (l - a), f = l === u ? 0 : 0.5 / (u - l), n = l < a ? -1 : 1, b;
  };
}
function gO() {
  var e = ci(af()(qt));
  return e.copy = function() {
    return fi(e, gO());
  }, jn.apply(e, arguments);
}
function xO() {
  var e = Tp(af()).domain([0.1, 1, 10]);
  return e.copy = function() {
    return fi(e, xO()).base(e.base());
  }, jn.apply(e, arguments);
}
function bO() {
  var e = Mp(af());
  return e.copy = function() {
    return fi(e, bO()).constant(e.constant());
  }, jn.apply(e, arguments);
}
function Hp() {
  var e = Np(af());
  return e.copy = function() {
    return fi(e, Hp()).exponent(e.exponent());
  }, jn.apply(e, arguments);
}
function pL() {
  return Hp.apply(null, arguments).exponent(0.5);
}
const wO = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  scaleBand: Op,
  scaleDiverging: gO,
  scaleDivergingLog: xO,
  scaleDivergingPow: Hp,
  scaleDivergingSqrt: pL,
  scaleDivergingSymlog: bO,
  scaleIdentity: ZP,
  scaleImplicit: Ph,
  scaleLinear: QP,
  scaleLog: eO,
  scaleOrdinal: Pp,
  scalePoint: r$,
  scalePow: Dp,
  scaleQuantile: nO,
  scaleQuantize: iO,
  scaleRadial: rO,
  scaleSequential: hO,
  scaleSequentialLog: pO,
  scaleSequentialPow: Kp,
  scaleSequentialQuantile: yO,
  scaleSequentialSqrt: hL,
  scaleSequentialSymlog: mO,
  scaleSqrt: q$,
  scaleSymlog: tO,
  scaleThreshold: aO,
  scaleTime: dL,
  scaleUtc: vL,
  tickFormat: XP
}, Symbol.toStringTag, { value: "Module" }));
function mL(e) {
  var t = wO;
  if (e in t && typeof t[e] == "function")
    return t[e]();
  var r = "scale".concat(Vh(e));
  if (r in t && typeof t[r] == "function")
    return t[r]();
}
function Pw(e, t, r) {
  if (typeof e == "function")
    return e.copy().domain(t).range(r);
  if (e != null) {
    var n = mL(e);
    if (n != null)
      return n.domain(t).range(r), n;
  }
}
function Vp(e, t, r, n) {
  if (!(r == null || n == null))
    return typeof e.scale == "function" ? Pw(e.scale, r, n) : Pw(t, r, n);
}
function yL(e) {
  return "scale".concat(Vh(e));
}
function gL(e) {
  return yL(e) in wO;
}
var SO = (e, t, r) => {
  if (e != null) {
    var n = e.scale, a = e.type;
    if (n === "auto")
      return a === "category" && r && (r.indexOf("LineChart") >= 0 || r.indexOf("AreaChart") >= 0 || r.indexOf("ComposedChart") >= 0 && !t) ? "point" : a === "category" ? "band" : "linear";
    if (typeof n == "string")
      return gL(n) ? n : "point";
  }
};
function xL(e, t) {
  for (var r = 0, n = e.length, a = e[0] < e[e.length - 1]; r < n; ) {
    var l = Math.floor((r + n) / 2);
    (a ? e[l] < t : e[l] > t) ? r = l + 1 : n = l;
  }
  return r;
}
function AO(e, t) {
  if (e) {
    var r = t ?? e.domain(), n = r.map((l) => {
      var u;
      return (u = e(l)) !== null && u !== void 0 ? u : 0;
    }), a = e.range();
    if (!(r.length === 0 || a.length < 2))
      return (l) => {
        var u, c, f = xL(n, l);
        if (f <= 0)
          return r[0];
        if (f >= r.length)
          return r[r.length - 1];
        var d = (u = n[f - 1]) !== null && u !== void 0 ? u : 0, h = (c = n[f]) !== null && c !== void 0 ? c : 0;
        return Math.abs(l - d) <= Math.abs(l - h) ? r[f - 1] : r[f];
      };
  }
}
function bL(e) {
  if (e != null)
    return "invert" in e && typeof e.invert == "function" ? e.invert.bind(e) : AO(e, void 0);
}
function Ow(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function cc(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Ow(Object(r), !0).forEach(function(n) {
      wL(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Ow(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function wL(e, t, r) {
  return (t = SL(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function SL(e) {
  var t = AL(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function AL(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function PO(e, t) {
  return kL(e) || EL(e, t) || OL(e, t) || PL();
}
function PL() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function OL(e, t) {
  if (e) {
    if (typeof e == "string") return Ew(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? Ew(e, t) : void 0;
  }
}
function Ew(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function EL(e, t) {
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
function kL(e) {
  if (Array.isArray(e)) return e;
}
var Ch = [0, "auto"], pt = {
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
}, OO = (e, t) => e.cartesianAxis.xAxis[t], _n = (e, t) => {
  var r = OO(e, t);
  return r ?? pt;
}, mt = {
  allowDataOverflow: !1,
  allowDecimals: !0,
  allowDuplicatedCategory: !0,
  angle: 0,
  dataKey: void 0,
  domain: Ch,
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
  width: Dl
}, EO = (e, t) => e.cartesianAxis.yAxis[t], Tn = (e, t) => {
  var r = EO(e, t);
  return r ?? mt;
}, CL = {
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
}, Gp = (e, t) => {
  var r = e.cartesianAxis.zAxis[t];
  return r ?? CL;
}, et = (e, t, r) => {
  switch (t) {
    case "xAxis":
      return _n(e, r);
    case "yAxis":
      return Tn(e, r);
    case "zAxis":
      return Gp(e, r);
    case "angleAxis":
      return xp(e, r);
    case "radiusAxis":
      return bp(e, r);
    default:
      throw new Error("Unexpected axis type: ".concat(t));
  }
}, IL = (e, t, r) => {
  switch (t) {
    case "xAxis":
      return _n(e, r);
    case "yAxis":
      return Tn(e, r);
    default:
      throw new Error("Unexpected axis type: ".concat(t));
  }
}, no = (e, t, r) => {
  switch (t) {
    case "xAxis":
      return _n(e, r);
    case "yAxis":
      return Tn(e, r);
    case "angleAxis":
      return xp(e, r);
    case "radiusAxis":
      return bp(e, r);
    default:
      throw new Error("Unexpected axis type: ".concat(t));
  }
}, kO = (e) => e.graphicalItems.cartesianItems.some((t) => t.type === "bar") || e.graphicalItems.polarItems.some((t) => t.type === "radialBar");
function Yp(e, t) {
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
var of = (e) => e.graphicalItems.cartesianItems, jL = R([Je, Wl], Yp), qp = (e, t, r) => e.filter(r).filter((n) => (t == null ? void 0 : t.includeHidden) === !0 ? !0 : !n.hide), io = R([of, et, jL], qp, {
  memoizeOptions: {
    resultEqualityCheck: Zc
  }
}), CO = R([io], (e) => e.filter((t) => t.type === "area" || t.type === "bar").filter(Qc)), IO = (e) => e.filter((t) => !("stackId" in t) || t.stackId === void 0), _L = R([io], IO), Xp = (e) => e.map((t) => t.data).filter(Boolean).flat(1), TL = R([io], (e) => e.some((t) => !t.data)), jO = R([io], Xp, {
  memoizeOptions: {
    resultEqualityCheck: Zc
  }
}), Qp = (e, t) => {
  var r = t.chartData, n = r === void 0 ? [] : r, a = t.dataStartIndex, l = t.dataEndIndex;
  return e.length > 0 ? e : n.slice(a, l + 1);
}, Zp = R([jO, Vc], Qp), _O = (e, t, r) => (t == null ? void 0 : t.dataKey) != null ? e.map((n) => ({
  value: $e(n, t.dataKey)
})) : r.length > 0 ? r.map((n) => n.dataKey).flatMap((n) => e.map((a) => ({
  value: $e(a, n)
}))) : e.map((n) => ({
  value: n
})), TO = (e, t, r, n, a, l) => {
  var u = n.chartData, c = u === void 0 ? [] : u, f = n.dataStartIndex, d = n.dataEndIndex, h = _O(e, t, r);
  if (a && (t == null ? void 0 : t.dataKey) != null && l.length > 0) {
    var p = c.slice(f, d + 1), y = p.map((b) => ({
      value: $e(b, t.dataKey)
    })).filter((b) => b.value != null);
    return [...y, ...h];
  }
  return h;
}, Yl = R([Zp, et, io, Vc, TL, jO], TO);
function za(e) {
  if (nn(e) || e instanceof Date) {
    var t = Number(e);
    if (Oe(t))
      return t;
  }
}
function kw(e) {
  if (Array.isArray(e)) {
    var t = [za(e[0]), za(e[1])];
    return en(t) ? t : void 0;
  }
  var r = za(e);
  if (r != null)
    return [r, r];
}
function Fr(e) {
  return e.map(za).filter(Yt);
}
function ML(e, t) {
  var r = za(e), n = za(t);
  return r == null && n == null ? 0 : r == null ? -1 : n == null ? 1 : r - n;
}
var NL = R([Yl], (e) => e == null ? void 0 : e.map((t) => t.value).sort(ML));
function MO(e, t) {
  switch (e) {
    case "xAxis":
      return t.direction === "x";
    case "yAxis":
      return t.direction === "y";
    default:
      return !1;
  }
}
function DL(e, t, r) {
  if (!r)
    return [];
  if (!r.length)
    return [];
  var n;
  if (typeof t == "number" && !Br(t))
    n = t;
  else if (Array.isArray(t)) {
    var a = Fr(t);
    a.length > 0 && (n = Math.max(...a));
  }
  return n == null ? [] : Fr(r.flatMap((l) => {
    var u = $e(e, l.dataKey), c, f;
    if (Array.isArray(u)) {
      var d = PO(u, 2);
      c = d[0], f = d[1];
    } else
      c = f = u;
    if (!(!Oe(c) || !Oe(f)))
      return [n - c, n + f];
  }));
}
var bt = (e) => {
  var t = Et(e), r = to(e);
  return no(e, t, r);
}, Ya = R([bt], (e) => e == null ? void 0 : e.dataKey), $L = R([CO, Vc, bt], BP), NO = (e, t, r, n) => {
  var a = {}, l = t.reduce((u, c) => {
    if (c.stackId == null)
      return u;
    var f = u[c.stackId];
    return f == null && (f = []), f.push(c), u[c.stackId] = f, u;
  }, a);
  return Object.fromEntries(Object.entries(l).map((u) => {
    var c = PO(u, 2), f = c[0], d = c[1], h = n ? [...d].reverse() : d, p = h.map(Xc);
    return [f, {
      // @ts-expect-error getStackedData requires that the input is array of objects, Recharts does not test for that
      stackedData: bT(e, p, r),
      graphicalItems: h
    }];
  }));
}, fc = R([$L, CO, Fl, MP], NO), DO = (e, t, r, n) => {
  var a = t.dataStartIndex, l = t.dataEndIndex;
  if (n == null && r !== "zAxis")
    return PT(e, a, l);
}, RL = R([et], (e) => e.allowDataOverflow), Jp = (e) => {
  var t;
  if (e == null || !("domain" in e))
    return Ch;
  if (e.domain != null)
    return e.domain;
  if ("ticks" in e && e.ticks != null) {
    if (e.type === "number") {
      var r = Fr(e.ticks);
      return [Math.min(...r), Math.max(...r)];
    }
    if (e.type === "category")
      return e.ticks.map(String);
  }
  return (t = e == null ? void 0 : e.domain) !== null && t !== void 0 ? t : Ch;
}, em = R([et], Jp), tm = R([em, RL], bP), LL = R([fc, Wr, Je, tm], DO, {
  memoizeOptions: {
    resultEqualityCheck: Ul
  }
}), lf = (e) => e.errorBars, zL = (e, t, r) => e.flatMap((n) => t[n.id]).filter(Boolean).filter((n) => MO(r, n)), dc = function() {
  for (var t = arguments.length, r = new Array(t), n = 0; n < t; n++)
    r[n] = arguments[n];
  var a = r.filter(Boolean);
  if (a.length !== 0) {
    var l = a.flat(), u = Math.min(...l), c = Math.max(...l);
    return [u, c];
  }
}, rm = function(t, r, n, a, l) {
  var u = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : [], c, f;
  if (n.length > 0 && n.forEach((d) => {
    var h, p = d.data != null ? [...d.data] : u, y = (h = a[d.id]) === null || h === void 0 ? void 0 : h.filter((b) => MO(l, b));
    p.forEach((b) => {
      var A, w = $e(b, (A = r.dataKey) !== null && A !== void 0 ? A : d.dataKey), S = DL(b, w, y);
      if (S.length >= 2) {
        var O = Math.min(...S), C = Math.max(...S);
        (c == null || O < c) && (c = O), (f == null || C > f) && (f = C);
      }
      var I = kw(w);
      I != null && (c = c == null ? I[0] : Math.min(c, I[0]), f = f == null ? I[1] : Math.max(f, I[1]));
    });
  }), (r == null ? void 0 : r.dataKey) != null && n.length === 0 && t.forEach((d) => {
    var h = kw($e(d, r.dataKey));
    h != null && (c = c == null ? h[0] : Math.min(c, h[0]), f = f == null ? h[1] : Math.max(f, h[1]));
  }), Oe(c) && Oe(f))
    return [c, f];
}, BL = R([Zp, et, _L, lf, Je, mD], rm, {
  memoizeOptions: {
    resultEqualityCheck: Ul
  }
});
function FL(e) {
  var t = e.value;
  if (nn(t) || t instanceof Date)
    return t;
}
var WL = (e, t, r) => {
  var n = e.map(FL).filter((a) => a != null);
  return r && (t.dataKey == null || t.allowDuplicatedCategory && AS(n)) ? gP(0, e.length) : t.allowDuplicatedCategory ? n : Array.from(new Set(n));
}, $O = (e) => e.referenceElements.dots, ao = (e, t, r) => e.filter((n) => n.ifOverflow === "extendDomain").filter((n) => t === "xAxis" ? n.xAxisId === r : n.yAxisId === r), UL = R([$O, Je, Wl], ao), RO = (e) => e.referenceElements.areas, KL = R([RO, Je, Wl], ao), LO = (e) => e.referenceElements.lines, HL = R([LO, Je, Wl], ao), zO = (e, t) => {
  if (e != null) {
    var r = Fr(e.map((n) => t === "xAxis" ? n.x : n.y));
    if (r.length !== 0)
      return [Math.min(...r), Math.max(...r)];
  }
}, VL = R(UL, Je, zO), BO = (e, t) => {
  if (e != null) {
    var r = Fr(e.flatMap((n) => [t === "xAxis" ? n.x1 : n.y1, t === "xAxis" ? n.x2 : n.y2]));
    if (r.length !== 0)
      return [Math.min(...r), Math.max(...r)];
  }
}, GL = R([KL, Je], BO);
function YL(e) {
  var t;
  if (e.x != null)
    return Fr([e.x]);
  var r = (t = e.segment) === null || t === void 0 ? void 0 : t.map((n) => n.x);
  return r == null || r.length === 0 ? [] : Fr(r);
}
function qL(e) {
  var t;
  if (e.y != null)
    return Fr([e.y]);
  var r = (t = e.segment) === null || t === void 0 ? void 0 : t.map((n) => n.y);
  return r == null || r.length === 0 ? [] : Fr(r);
}
var FO = (e, t) => {
  if (e != null) {
    var r = e.flatMap((n) => t === "xAxis" ? YL(n) : qL(n));
    if (r.length !== 0)
      return [Math.min(...r), Math.max(...r)];
  }
}, XL = R([HL, Je], FO), QL = R(VL, XL, GL, (e, t, r) => dc(e, r, t)), nm = (e, t, r, n, a, l, u, c, f) => {
  if (r != null)
    return r;
  var d = u === "vertical" && c === "xAxis" || u === "horizontal" && c === "yAxis", h = d ? dc(n, l, a) : dc(l, a), p = AD(t, h, e.allowDataOverflow);
  return p ?? (e.allowDataOverflow && h == null && f != null ? f : p);
}, ZL = (e) => {
  if (!(e == null || e.type !== "number" || !("ticks" in e) || e.ticks == null)) {
    var t = Fr(e.ticks);
    if (t.length !== 0)
      return [Math.min(...t), Math.max(...t)];
  }
}, JL = R([et], ZL, {
  memoizeOptions: {
    resultEqualityCheck: Ul
  }
}), ez = R([et, em, tm, LL, BL, QL, _e, Je, JL], nm, {
  memoizeOptions: {
    resultEqualityCheck: Ul
  }
}), tz = [0, 1], im = (e, t, r, n, a, l, u) => {
  if (!((e == null || r == null || r.length === 0) && u === void 0)) {
    var c = e.dataKey, f = e.type, d = ln(t, l);
    if (d && c == null) {
      var h;
      return gP(0, (h = r == null ? void 0 : r.length) !== null && h !== void 0 ? h : 0);
    }
    return f === "category" ? WL(n, e, d) : a === "expand" && !d ? tz : u;
  }
}, am = R([et, _e, Zp, Yl, Fl, Je, ez], im), di = R([et, kO, mp], SO), om = (e, t, r) => {
  var n = t.niceTicks;
  if (n !== "none") {
    var a = Jp(t), l = Array.isArray(a) && (a[0] === "auto" || a[1] === "auto");
    if ((n === "snap125" || n === "adaptive") && t != null && t.tickCount && en(e)) {
      if (l)
        return $b(e, t.tickCount, t.allowDecimals, n);
      if (t.type === "number")
        return Rb(e, t.tickCount, t.allowDecimals, n);
    }
    if (n === "auto" && r === "linear" && t != null && t.tickCount) {
      if (l && en(e))
        return $b(e, t.tickCount, t.allowDecimals, "adaptive");
      if (t.type === "number" && en(e))
        return Rb(e, t.tickCount, t.allowDecimals, "adaptive");
    }
  }
}, lm = R([am, no, di], om), um = (e, t, r, n) => {
  if (
    /*
     * Angle axis for some reason uses nice ticks when rendering axis tick labels,
     * but doesn't use nice ticks for extending domain like all the other axes do.
     * Not really sure why? Is there a good reason,
     * or is it just because someone added support for nice ticks to the other axes and forgot this one?
     */
    n !== "angleAxis" && (e == null ? void 0 : e.type) === "number" && en(t) && Array.isArray(r) && r.length > 0
  ) {
    var a, l, u = t[0], c = (a = r[0]) !== null && a !== void 0 ? a : 0, f = t[1], d = (l = r[r.length - 1]) !== null && l !== void 0 ? l : 0;
    return [Math.min(u, c), Math.max(f, d)];
  }
  return t;
}, rz = R([et, am, lm, Je], um), nz = R(Yl, et, (e, t) => {
  if (!(!t || t.type !== "number")) {
    var r = 1 / 0, n = Array.from(Fr(e.map((p) => p.value))).sort((p, y) => p - y), a = n[0], l = n[n.length - 1];
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
}), WO = R(nz, _e, TP, gt, (e, t, r, n, a) => a, (e, t, r, n, a) => {
  if (!Oe(e))
    return 0;
  var l = t === "vertical" ? n.height : n.width;
  if (a === "gap")
    return e * l / 2;
  if (a === "no-gap") {
    var u = Ft(r, e * l), c = e * l / 2;
    return c - u - (c - u) / l * u;
  }
  return 0;
}), iz = (e, t, r) => {
  var n = _n(e, t);
  return n == null || typeof n.padding != "string" ? 0 : WO(e, "xAxis", t, r, n.padding);
}, az = (e, t, r) => {
  var n = Tn(e, t);
  return n == null || typeof n.padding != "string" ? 0 : WO(e, "yAxis", t, r, n.padding);
}, oz = R(_n, iz, (e, t) => {
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
}), lz = R(Tn, az, (e, t) => {
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
}), UO = R([gt, oz, Kc, Uc, (e, t, r) => r], (e, t, r, n, a) => {
  var l = n.padding;
  return a ? [l.left, r.width - l.right] : [e.left + t.left, e.left + e.width - t.right];
}), KO = R([gt, _e, lz, Kc, Uc, (e, t, r) => r], (e, t, r, n, a, l) => {
  var u = a.padding;
  return l ? [n.height - u.bottom, u.top] : t === "horizontal" ? [e.top + e.height - r.bottom, e.top + r.top] : [e.top + r.top, e.top + e.height - r.bottom];
}), ql = (e, t, r, n) => {
  var a;
  switch (t) {
    case "xAxis":
      return UO(e, r, n);
    case "yAxis":
      return KO(e, r, n);
    case "zAxis":
      return (a = Gp(e, r)) === null || a === void 0 ? void 0 : a.range;
    case "angleAxis":
      return RP(e);
    case "radiusAxis":
      return LP(e, r);
    default:
      return;
  }
}, HO = R([et, ql], Gc), uz = R([di, rz], FP), sm = R([et, di, uz, HO], Vp), VO = (e, t, r, n) => {
  if (!(r == null || r.dataKey == null)) {
    var a = r.type, l = r.scale, u = ln(e, n);
    if (u && (a === "number" || l !== "auto"))
      return t.map((c) => c.value);
  }
}, cm = R([_e, Yl, no, Je], VO), uf = R([sm], Sp);
R([sm], bL);
R([sm, NL], AO);
R([io, lf, Je], zL);
function GO(e, t) {
  return e.id < t.id ? -1 : e.id > t.id ? 1 : 0;
}
var sf = (e, t) => t, cf = (e, t, r) => r, sz = R(Fc, sf, cf, (e, t, r) => e.filter((n) => n.orientation === t).filter((n) => n.mirror === r).sort(GO)), cz = R(Wc, sf, cf, (e, t, r) => e.filter((n) => n.orientation === t).filter((n) => n.mirror === r).sort(GO)), YO = (e, t) => {
  var r = typeof t.height == "number" ? t.height : lp;
  return {
    width: e.width,
    height: r
  };
}, fz = (e, t) => {
  var r = typeof t.width == "number" ? t.width : Dl;
  return {
    width: r,
    height: e.height
  };
}, qO = R(gt, _n, YO), dz = (e, t, r) => {
  switch (t) {
    case "top":
      return e.top;
    case "bottom":
      return r - e.bottom;
    default:
      return 0;
  }
}, vz = (e, t, r) => {
  switch (t) {
    case "left":
      return e.left;
    case "right":
      return r - e.right;
    default:
      return 0;
  }
}, hz = R(In, gt, sz, sf, cf, (e, t, r, n, a) => {
  var l = {}, u;
  return r.forEach((c) => {
    var f = YO(t, c);
    u == null && (u = dz(t, n, e));
    var d = n === "top" && !a || n === "bottom" && a;
    l[c.id] = u - Number(d) * f.height, u += (d ? -1 : 1) * f.height;
  }), l;
}), pz = R(Cn, gt, cz, sf, cf, (e, t, r, n, a) => {
  var l = {}, u;
  return r.forEach((c) => {
    var f = fz(t, c);
    u == null && (u = vz(t, n, e));
    var d = n === "left" && !a || n === "right" && a;
    l[c.id] = u - Number(d) * f.width, u += (d ? -1 : 1) * f.width;
  }), l;
}), mz = (e, t) => {
  var r = _n(e, t);
  if (r != null)
    return hz(e, r.orientation, r.mirror);
}, yz = R([gt, _n, mz, (e, t) => t], (e, t, r, n) => {
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
}), gz = (e, t) => {
  var r = Tn(e, t);
  if (r != null)
    return pz(e, r.orientation, r.mirror);
}, xz = R([gt, Tn, gz, (e, t) => t], (e, t, r, n) => {
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
}), XO = R(gt, Tn, (e, t) => {
  var r = typeof t.width == "number" ? t.width : Dl;
  return {
    width: r,
    height: e.height
  };
}), Cw = (e, t, r) => {
  switch (t) {
    case "xAxis":
      return qO(e, r).width;
    case "yAxis":
      return XO(e, r).height;
    default:
      return;
  }
}, QO = (e, t, r, n) => {
  if (r != null) {
    var a = r.allowDuplicatedCategory, l = r.type, u = r.dataKey, c = ln(e, n), f = t.map((h) => h.value), d = f.filter((h) => h != null);
    if (u && c && l === "category" && a && AS(d))
      return f;
  }
}, fm = R([_e, Yl, et, Je], QO), Iw = R([_e, IL, di, uf, fm, cm, ql, lm, Je], (e, t, r, n, a, l, u, c, f) => {
  if (t != null) {
    var d = ln(e, f);
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
}), bz = (e, t, r, n, a, l, u, c, f) => {
  if (!(t == null || n == null)) {
    var d = ln(e, f), h = t.type, p = t.ticks, y = t.tickCount, b = (
      // @ts-expect-error This is testing for `scaleBand` but for band axis the type is reported as `band` so this looks like a dead code with a workaround elsewhere?
      r === "scaleBand" && typeof n.bandwidth == "function" ? n.bandwidth() / 2 : 2
    ), A = h === "category" && n.bandwidth ? n.bandwidth() / b : 0;
    A = f === "angleAxis" && l != null && l.length >= 2 ? Ot(l[0] - l[1]) * 2 * A : A;
    var w = p || a;
    return w ? w.map((S, O) => {
      var C = u ? u.indexOf(S) : S, I = n.map(C);
      return Oe(I) ? {
        index: O,
        coordinate: I + A,
        value: S,
        offset: A
      } : null;
    }).filter(Yt) : d && c ? c.map((S, O) => {
      var C = n.map(S);
      return Oe(C) ? {
        coordinate: C + A,
        value: S,
        index: O,
        offset: A
      } : null;
    }).filter(Yt) : n.ticks ? n.ticks(y).map((S, O) => {
      var C = n.map(S);
      return Oe(C) ? {
        coordinate: C + A,
        value: S,
        index: O,
        offset: A
      } : null;
    }).filter(Yt) : n.domain().map((S, O) => {
      var C = n.map(S);
      return Oe(C) ? {
        coordinate: C + A,
        // @ts-expect-error can't use Date as index
        value: u ? u[S] : S,
        index: O,
        offset: A
      } : null;
    }).filter(Yt);
  }
}, ZO = R([_e, no, di, uf, lm, ql, fm, cm, Je], bz), wz = (e, t, r, n, a, l, u) => {
  if (!(t == null || r == null || n == null || n[0] === n[1])) {
    var c = ln(e, u), f = t.tickCount, d = 0;
    return d = u === "angleAxis" && (n == null ? void 0 : n.length) >= 2 ? Ot(n[0] - n[1]) * 2 * d : d, c && l ? l.map((h, p) => {
      var y = r.map(h);
      return Oe(y) ? {
        coordinate: y + d,
        value: h,
        index: p,
        offset: d
      } : null;
    }).filter(Yt) : r.ticks ? r.ticks(f).map((h, p) => {
      var y = r.map(h);
      return Oe(y) ? {
        coordinate: y + d,
        value: h,
        index: p,
        offset: d
      } : null;
    }).filter(Yt) : r.domain().map((h, p) => {
      var y = r.map(h);
      return Oe(y) ? {
        coordinate: y + d,
        // @ts-expect-error can't use unknown as index
        value: a ? a[h] : h,
        index: p,
        offset: d
      } : null;
    }).filter(Yt);
  }
}, oi = R([_e, no, uf, ql, fm, cm, Je], wz), li = R(et, uf, (e, t) => {
  if (!(e == null || t == null))
    return cc(cc({}, e), {}, {
      scale: t
    });
}), Sz = R([et, di, am, HO], Vp), Az = R([Sz], Sp);
R((e, t, r) => Gp(e, r), Az, (e, t) => {
  if (!(e == null || t == null))
    return cc(cc({}, e), {}, {
      scale: t
    });
});
var Pz = R([_e, Fc, Wc], (e, t, r) => {
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
}), Oz = (e, t, r) => {
  var n;
  return (n = e.renderedTicks[t]) === null || n === void 0 ? void 0 : n[r];
};
R([Oz], (e) => {
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
var JO = (e) => e.options.defaultTooltipEventType, eE = (e) => e.options.validateTooltipEventTypes;
function tE(e, t, r) {
  if (e == null)
    return t;
  var n = e ? "axis" : "item";
  return r == null ? t : r.includes(n) ? n : t;
}
function Xl(e, t) {
  var r = JO(e), n = eE(e);
  return tE(t, r, n);
}
function Ez(e) {
  return se((t) => Xl(t, e));
}
var rE = (e, t) => {
  var r, n = Number(t);
  if (!(Br(n) || t == null))
    return n >= 0 ? e == null || (r = e[n]) === null || r === void 0 ? void 0 : r.value : void 0;
}, kz = (e) => e.tooltip.settings, ri = {
  active: !1,
  index: null,
  dataKey: void 0,
  graphicalItemId: void 0,
  coordinate: void 0
}, Cz = {
  itemInteraction: {
    click: ri,
    hover: ri
  },
  axisInteraction: {
    click: ri,
    hover: ri
  },
  keyboardInteraction: ri,
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
}, nE = Kt({
  name: "tooltip",
  initialState: Cz,
  reducers: {
    addTooltipEntrySettings: {
      reducer(e, t) {
        e.tooltipItemPayloads.push(Ne(t.payload));
      },
      prepare: He()
    },
    replaceTooltipEntrySettings: {
      reducer(e, t) {
        var r = t.payload, n = r.prev, a = r.next, l = Sr(e).tooltipItemPayloads.indexOf(Ne(n));
        l > -1 && (e.tooltipItemPayloads[l] = Ne(a));
      },
      prepare: He()
    },
    removeTooltipEntrySettings: {
      reducer(e, t) {
        var r = Sr(e).tooltipItemPayloads.indexOf(Ne(t.payload));
        r > -1 && e.tooltipItemPayloads.splice(r, 1);
      },
      prepare: He()
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
}), Cr = nE.actions, Iz = Cr.addTooltipEntrySettings, jz = Cr.replaceTooltipEntrySettings, _z = Cr.removeTooltipEntrySettings, Tz = Cr.setTooltipSettingsState, iE = Cr.setActiveMouseOverItemIndex, Mz = Cr.mouseLeaveItem, aE = Cr.mouseLeaveChart, Nz = Cr.setActiveClickItemIndex, oE = Cr.setMouseOverAxisIndex, Dz = Cr.setMouseClickAxisIndex, dl = Cr.setSyncInteraction, vc = Cr.setKeyboardInteraction, $z = nE.reducer;
function jw(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function bs(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? jw(Object(r), !0).forEach(function(n) {
      Rz(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : jw(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function Rz(e, t, r) {
  return (t = Lz(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function Lz(e) {
  var t = zz(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function zz(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function Bz(e, t, r) {
  return t === "axis" ? r === "click" ? e.axisInteraction.click : e.axisInteraction.hover : r === "click" ? e.itemInteraction.click : e.itemInteraction.hover;
}
function Fz(e) {
  return e.index != null;
}
var lE = (e, t, r, n) => {
  if (t == null)
    return ri;
  var a = Bz(e, t, r);
  if (a == null)
    return ri;
  if (a.active)
    return a;
  if (e.keyboardInteraction.active)
    return e.keyboardInteraction;
  if (e.syncInteraction.active && e.syncInteraction.index != null)
    return e.syncInteraction;
  var l = e.settings.active === !0;
  if (Fz(a)) {
    if (l)
      return bs(bs({}, a), {}, {
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
  return bs(bs({}, ri), {}, {
    coordinate: a.coordinate
  });
};
function Wz(e) {
  if (typeof e == "number")
    return Number.isFinite(e) ? e : void 0;
  if (e instanceof Date) {
    var t = e.valueOf();
    return Number.isFinite(t) ? t : void 0;
  }
  var r = Number(e);
  return Number.isFinite(r) ? r : void 0;
}
function Uz(e, t) {
  var r = Wz(e), n = t[0], a = t[1];
  if (r === void 0)
    return !1;
  var l = Math.min(n, a), u = Math.max(n, a);
  return r >= l && r <= u;
}
function Kz(e, t, r) {
  if (r == null || t == null)
    return !0;
  var n = $e(e, t);
  return n == null || !en(r) ? !0 : Uz(n, r);
}
var ml = (e, t, r, n) => {
  var a = e == null ? void 0 : e.index;
  if (a == null)
    return null;
  var l = Number(a);
  if (!Oe(l))
    return a;
  var u = 0, c = 1 / 0;
  t.length > 0 && (c = t.length - 1);
  var f = Math.max(u, Math.min(l, c)), d = t[f];
  return d == null || Kz(d, r, n) ? String(f) : null;
}, uE = (e, t, r, n, a, l, u) => {
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
}, sE = (e, t, r, n) => {
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
}, cE = (e) => e.options.tooltipPayloadSearcher, oo = (e) => e.tooltip;
function _w(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Tw(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? _w(Object(r), !0).forEach(function(n) {
      Hz(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : _w(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function Hz(e, t, r) {
  return (t = Vz(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function Vz(e) {
  var t = Gz(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function Gz(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function Yz(e) {
  if (typeof e == "string" || typeof e == "number")
    return e;
}
function qz(e) {
  if (typeof e == "string" || typeof e == "number" || typeof e == "boolean")
    return e;
}
function Xz(e) {
  if (typeof e == "string" || typeof e == "number")
    return e;
  if (typeof e == "function")
    return (t) => e(t);
}
function Mw(e) {
  if (typeof e == "string")
    return e;
}
function Qz(e) {
  if (!(e == null || typeof e != "object")) {
    var t = "name" in e ? Yz(e.name) : void 0, r = "unit" in e ? qz(e.unit) : void 0, n = "dataKey" in e ? Xz(e.dataKey) : void 0, a = "payload" in e ? e.payload : void 0, l = "color" in e ? Mw(e.color) : void 0, u = "fill" in e ? Mw(e.fill) : void 0;
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
function Zz(e, t) {
  return e ?? t;
}
var fE = (e, t, r, n, a, l, u) => {
  if (!(t == null || l == null)) {
    var c = r.chartData, f = r.computedData, d = r.dataStartIndex, h = r.dataEndIndex, p = [];
    return e.reduce((y, b) => {
      var A, w = b.dataDefinedOnItem, S = b.settings, O = Zz(w, c), C = Array.isArray(O) ? UA(O, d, h) : O, I = (A = S == null ? void 0 : S.dataKey) !== null && A !== void 0 ? A : n, k = S == null ? void 0 : S.nameKey, T;
      if (n && Array.isArray(C) && /*
       * findEntryInArray won't work for Scatter because Scatter provides an array of arrays
       * as tooltip payloads and findEntryInArray is not prepared to handle that.
       * Sad but also ScatterChart only allows 'item' tooltipEventType
       * and also this is only a problem if there are multiple Scatters and each has its own data array
       * so let's fix that some other time.
       */
      !Array.isArray(C[0]) && /*
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
      u === "axis" ? (T = PS(C, n, a), T == null && (T = l(C, t, f, k))) : T = l(C, t, f, k), Array.isArray(T))
        T.forEach(($) => {
          var F, U, H = Qz($), G = H == null ? void 0 : H.name, W = H == null ? void 0 : H.dataKey, ne = H == null ? void 0 : H.payload, re = Tw(Tw({}, S), {}, {
            name: G,
            unit: H == null ? void 0 : H.unit,
            // Preserve item-level color/fill from graphical items.
            color: (F = H == null ? void 0 : H.color) !== null && F !== void 0 ? F : S == null ? void 0 : S.color,
            fill: (U = H == null ? void 0 : H.fill) !== null && U !== void 0 ? U : S == null ? void 0 : S.fill
          });
          y.push(Tx({
            tooltipEntrySettings: re,
            dataKey: W,
            payload: ne,
            value: $e(ne, W),
            name: G == null ? void 0 : String(G)
          }));
        });
      else {
        var E;
        y.push(Tx({
          tooltipEntrySettings: S,
          dataKey: I,
          payload: T,
          // getValueByDataKey does not validate the output type
          value: $e(T, I),
          // getValueByDataKey does not validate the output type
          name: (E = $e(T, k)) !== null && E !== void 0 ? E : S == null ? void 0 : S.name
        }));
      }
      return y;
    }, p);
  }
}, dm = R([bt, kO, mp], SO), Jz = R([(e) => e.graphicalItems.cartesianItems, (e) => e.graphicalItems.polarItems], (e, t) => [...e, ...t]), e3 = R([Et, to], Yp), ta = R([Jz, bt, e3], qp, {
  memoizeOptions: {
    resultEqualityCheck: Zc
  }
}), t3 = R([ta], (e) => e.filter(Qc)), dE = R([ta], Xp, {
  memoizeOptions: {
    resultEqualityCheck: Zc
  }
}), r3 = R([ta], (e) => e.some((t) => !t.data)), Yi = R([dE, Wr], Qp), n3 = R([t3, Wr, bt], BP), vm = R([Yi, bt, ta, Wr, r3, dE], TO), vE = R([bt], Jp), i3 = R([bt], (e) => e.allowDataOverflow), hE = R([vE, i3], bP), a3 = R([ta], (e) => e.filter(Qc)), o3 = R([n3, a3, Fl, MP], NO), l3 = R([o3, Wr, Et, hE], DO), u3 = R([ta], IO), s3 = R([Yi, bt, u3, lf, Et, gD], rm, {
  memoizeOptions: {
    resultEqualityCheck: Ul
  }
}), c3 = R([$O, Et, to], ao), f3 = R([c3, Et], zO), d3 = R([RO, Et, to], ao), v3 = R([d3, Et], BO), h3 = R([LO, Et, to], ao), p3 = R([h3, Et], FO), m3 = R([f3, p3, v3], dc), y3 = R([bt, vE, hE, l3, s3, m3, _e, Et], nm), qa = R([bt, _e, Yi, vm, Fl, Et, y3], im), g3 = R([qa, bt, dm], om), x3 = R([bt, qa, g3, Et], um), pE = (e) => {
  var t = Et(e), r = to(e), n = !1;
  return ql(e, t, r, n);
}, mE = R([bt, pE], Gc), b3 = R([bt, dm, x3, mE], Vp), yE = R([b3], Sp), w3 = R([_e, vm, bt, Et], QO), S3 = R([_e, vm, bt, Et], VO), A3 = (e, t, r, n, a, l, u, c) => {
  if (t) {
    var f = t.type, d = ln(e, c);
    if (n) {
      var h = r === "scaleBand" && n.bandwidth ? n.bandwidth() / 2 : 2, p = f === "category" && n.bandwidth ? n.bandwidth() / h : 0;
      return p = c === "angleAxis" && a != null && (a == null ? void 0 : a.length) >= 2 ? Ot(a[0] - a[1]) * 2 * p : p, d && u ? u.map((y, b) => {
        var A = n.map(y);
        return Oe(A) ? {
          coordinate: A + p,
          value: y,
          index: b,
          offset: p
        } : null;
      }).filter(Yt) : n.domain().map((y, b) => {
        var A = n.map(y);
        return Oe(A) ? {
          coordinate: A + p,
          // @ts-expect-error can't use Date as an index
          value: l ? l[y] : y,
          index: b,
          offset: p
        } : null;
      }).filter(Yt);
    }
  }
}, Mn = R([_e, bt, dm, yE, pE, w3, S3, Et], A3), hm = R([JO, eE, kz], (e, t, r) => tE(r.shared, e, t)), gE = (e) => e.tooltip.settings.trigger, pm = (e) => e.tooltip.settings.defaultIndex, Ql = R([oo, hm, gE, pm], lE), ui = R([Ql, Yi, Ya, qa], ml), xE = R([Mn, ui], rE), mm = R([Ql], (e) => {
  if (e)
    return e.dataKey;
}), bE = R([Ql], (e) => {
  if (e)
    return e.graphicalItemId;
}), wE = R([oo, hm, gE, pm], sE), P3 = R([Cn, In, _e, gt, Mn, pm, wE], uE), O3 = R([Ql, P3], (e, t) => e != null && e.coordinate ? e.coordinate : t), E3 = R([Ql], (e) => {
  var t;
  return (t = e == null ? void 0 : e.active) !== null && t !== void 0 ? t : !1;
}), k3 = R([wE, ui, Wr, Ya, xE, cE, hm], fE), C3 = R([k3], (e) => {
  if (e != null) {
    var t = e.map((r) => r.payload).filter((r) => r != null);
    return Array.from(new Set(t));
  }
});
function Nw(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Dw(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Nw(Object(r), !0).forEach(function(n) {
      I3(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Nw(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function I3(e, t, r) {
  return (t = j3(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function j3(e) {
  var t = _3(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function _3(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var T3 = () => se(bt), M3 = () => {
  var e = T3(), t = se(Mn), r = se(yE);
  return Ka(!e || !r ? void 0 : Dw(Dw({}, e), {}, {
    scale: r
  }), t);
};
function $w(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function ja(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? $w(Object(r), !0).forEach(function(n) {
      N3(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : $w(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function N3(e, t, r) {
  return (t = D3(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function D3(e) {
  var t = $3(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function $3(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var R3 = (e, t, r, n) => {
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
}, L3 = (e, t, r, n) => {
  var a = t.find((d) => d && d.index === r);
  if (a) {
    if (e === "centric") {
      var l = a.coordinate, u = n.radius;
      return ja(ja(ja({}, n), ct(n.cx, n.cy, u, l)), {}, {
        angle: l,
        radius: u
      });
    }
    var c = a.coordinate, f = n.angle;
    return ja(ja(ja({}, n), ct(n.cx, n.cy, c, f)), {}, {
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
function z3(e, t) {
  var r = e.relativeX, n = e.relativeY;
  return r >= t.left && r <= t.left + t.width && n >= t.top && n <= t.top + t.height;
}
var SE = (e, t, r, n, a) => {
  var l, u = (l = t == null ? void 0 : t.length) !== null && l !== void 0 ? l : 0;
  if (u <= 1 || e == null)
    return 0;
  if (n === "angleAxis" && a != null && Math.abs(Math.abs(a[1] - a[0]) - 360) <= 1e-6)
    for (var c = a[1] - a[0], f = (le, fe, ae) => [e, e + c, e - c].some((K) => (ae ? K >= le : K > le) && K <= fe), d = 0; d < u; d++) {
      var h, p, y, b, A, w = d > 0 ? (h = r[d - 1]) === null || h === void 0 ? void 0 : h.coordinate : (p = r[u - 1]) === null || p === void 0 ? void 0 : p.coordinate, S = (y = r[d]) === null || y === void 0 ? void 0 : y.coordinate, O = d >= u - 1 ? (b = r[0]) === null || b === void 0 ? void 0 : b.coordinate : (A = r[d + 1]) === null || A === void 0 ? void 0 : A.coordinate, C = void 0;
      if (!(w == null || S == null || O == null))
        if (Ot(S - w) !== Ot(O - S)) {
          var I = [];
          if (Ot(O - S) === Ot(a[1] - a[0])) {
            C = O;
            var k = S + a[1] - a[0];
            I[0] = Math.min(k, (k + w) / 2), I[1] = Math.max(k, (k + w) / 2);
          } else {
            C = w;
            var T = O + a[1] - a[0];
            I[0] = Math.min(S, (T + S) / 2), I[1] = Math.max(S, (T + S) / 2);
          }
          var E = [Math.min(S, (C + S) / 2), Math.max(S, (C + S) / 2)];
          if (f(E[0], E[1], !1) || f(I[0], I[1], !0)) {
            var $;
            return ($ = r[d]) === null || $ === void 0 ? void 0 : $.index;
          }
        } else {
          var F = Math.min(w, O), U = Math.max(w, O);
          if (f((F + S) / 2, (U + S) / 2, !1)) {
            var H;
            return (H = r[d]) === null || H === void 0 ? void 0 : H.index;
          }
        }
    }
  else if (t)
    for (var G = 0; G < u; G++) {
      var W = t[G];
      if (W != null) {
        var ne = t[G + 1], re = t[G - 1];
        if (G === 0 && ne != null && e <= (W.coordinate + ne.coordinate) / 2 || G === u - 1 && re != null && e > (W.coordinate + re.coordinate) / 2 || G > 0 && G < u - 1 && re != null && ne != null && e > (W.coordinate + re.coordinate) / 2 && e <= (W.coordinate + ne.coordinate) / 2)
          return W.index;
      }
    }
  return -1;
}, AE = () => se(mp), ym = (e, t) => t, PE = (e, t, r) => r, gm = (e, t, r, n) => n, B3 = R(Mn, (e) => jc(e, (t) => t.coordinate)), xm = R([oo, ym, PE, gm], lE), bm = R([xm, Yi, Ya, qa], ml), F3 = (e, t, r) => {
  if (t != null) {
    var n = oo(e);
    return t === "axis" ? r === "hover" ? n.axisInteraction.hover.dataKey : n.axisInteraction.click.dataKey : r === "hover" ? n.itemInteraction.hover.dataKey : n.itemInteraction.click.dataKey;
  }
}, OE = R([oo, ym, PE, gm], sE), hc = R([Cn, In, _e, gt, Mn, gm, OE], uE), W3 = R([xm, hc], (e, t) => {
  var r;
  return (r = e.coordinate) !== null && r !== void 0 ? r : t;
}), EE = R([Mn, bm], rE), U3 = R([OE, bm, Wr, Ya, EE, cE, ym], fE), K3 = R([xm, bm], (e, t) => ({
  isActive: e.active && t != null,
  activeIndex: t
})), H3 = (e, t, r, n, a, l, u) => {
  if (!(!e || !r || !n || !a) && z3(e, u)) {
    var c = OT(e, t), f = SE(c, l, a, r, n), d = R3(t, a, f, e);
    return {
      activeIndex: String(f),
      activeCoordinate: d
    };
  }
}, V3 = (e, t, r, n, a, l, u) => {
  if (!(!e || !n || !a || !l || !r)) {
    var c = cD(e, r);
    if (c) {
      var f = ET(c, t), d = SE(f, u, l, n, a), h = L3(t, l, d, c);
      return {
        activeIndex: String(d),
        activeCoordinate: h
      };
    }
  }
}, G3 = (e, t, r, n, a, l, u, c) => {
  if (!(!e || !t || !n || !a || !l))
    return t === "horizontal" || t === "vertical" ? H3(e, t, n, a, l, u, c) : V3(e, t, r, n, a, l, u);
}, Y3 = R((e) => e.zIndex.zIndexMap, (e, t) => t, (e, t, r) => r, (e, t, r) => {
  if (t != null) {
    var n = e[t];
    if (n != null)
      return r ? n.panoramaElement : n.element;
  }
}), q3 = R((e) => e.zIndex.zIndexMap, (e) => {
  var t = Object.keys(e).map((n) => parseInt(n, 10)).concat(Object.values(ft)), r = Array.from(new Set(t));
  return r.sort((n, a) => n - a);
}, {
  memoizeOptions: {
    resultEqualityCheck: FD
  }
});
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
function Lw(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Rw(Object(r), !0).forEach(function(n) {
      X3(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Rw(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function X3(e, t, r) {
  return (t = Q3(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function Q3(e) {
  var t = Z3(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function Z3(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var J3 = {}, eB = {
  zIndexMap: Object.values(ft).reduce((e, t) => Lw(Lw({}, e), {}, {
    [t]: {
      element: void 0,
      panoramaElement: void 0,
      consumers: 0
    }
  }), J3)
}, tB = new Set(Object.values(ft));
function rB(e) {
  return tB.has(e);
}
var kE = Kt({
  name: "zIndex",
  initialState: eB,
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
      prepare: He()
    },
    unregisterZIndexPortal: {
      reducer: (e, t) => {
        var r = t.payload.zIndex;
        e.zIndexMap[r] && (e.zIndexMap[r].consumers -= 1, e.zIndexMap[r].consumers <= 0 && !rB(r) && delete e.zIndexMap[r]);
      },
      prepare: He()
    },
    registerZIndexPortalElement: {
      reducer: (e, t) => {
        var r = t.payload, n = r.zIndex, a = r.element, l = r.isPanorama;
        e.zIndexMap[n] ? l ? e.zIndexMap[n].panoramaElement = Ne(a) : e.zIndexMap[n].element = Ne(a) : e.zIndexMap[n] = {
          consumers: 0,
          element: l ? void 0 : Ne(a),
          panoramaElement: l ? Ne(a) : void 0
        };
      },
      prepare: He()
    },
    unregisterZIndexPortalElement: {
      reducer: (e, t) => {
        var r = t.payload.zIndex;
        e.zIndexMap[r] && (t.payload.isPanorama ? e.zIndexMap[r].panoramaElement = void 0 : e.zIndexMap[r].element = void 0);
      },
      prepare: He()
    }
  }
}), ff = kE.actions, nB = ff.registerZIndexPortal, Bv = ff.unregisterZIndexPortal, iB = ff.registerZIndexPortalElement, aB = ff.unregisterZIndexPortalElement, oB = kE.reducer;
function or(e) {
  var t = e.zIndex, r = e.children, n = uM(), a = n && t !== void 0 && t !== 0, l = Ht(), u = x.useRef(void 0), c = x.useRef(/* @__PURE__ */ new Set()), f = Fe(), d = se((p) => Y3(p, t, l));
  if (x.useLayoutEffect(() => {
    if (!a) {
      var p = c.current;
      p.forEach((b) => {
        f(Bv({
          zIndex: b
        }));
      }), p.clear(), u.current = void 0;
      return;
    }
    if (c.current.has(t) || (f(nB({
      zIndex: t
    })), c.current.add(t)), d) {
      u.current = d;
      var y = c.current;
      y.forEach((b) => {
        b !== t && (f(Bv({
          zIndex: b
        })), y.delete(b));
      });
    }
  }, [f, t, a, d]), x.useLayoutEffect(() => {
    var p = c.current;
    return () => {
      p.forEach((y) => {
        f(Bv({
          zIndex: y
        }));
      }), p.clear();
    };
  }, [f]), !a)
    return r;
  var h = d ?? u.current;
  return h ? /* @__PURE__ */ bS.createPortal(r, h) : null;
}
function Ih() {
  return Ih = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Ih.apply(null, arguments);
}
function zw(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function ws(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? zw(Object(r), !0).forEach(function(n) {
      lB(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : zw(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function lB(e, t, r) {
  return (t = uB(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function uB(e) {
  var t = sB(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function sB(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function cB(e) {
  var t = e.cursor, r = e.cursorComp, n = e.cursorProps;
  return /* @__PURE__ */ x.isValidElement(t) ? /* @__PURE__ */ x.cloneElement(t, n) : /* @__PURE__ */ x.createElement(r, n);
}
function fB(e) {
  var t, r = e.coordinate, n = e.payload, a = e.index, l = e.offset, u = e.tooltipAxisBandSize, c = e.layout, f = e.cursor, d = e.tooltipEventType, h = e.chartName, p = r, y = n, b = a;
  if (!f || !p || h !== "ScatterChart" && d !== "axis")
    return null;
  var A, w, S;
  if (h === "ScatterChart")
    A = p, w = bN, S = ft.cursorLine;
  else if (h === "BarChart")
    A = wN(c, p, l, u), w = vP, S = ft.cursorRectangle;
  else if (c === "radial" && zS(p)) {
    var O = pP(p), C = O.cx, I = O.cy, k = O.radius, T = O.startAngle, E = O.endAngle;
    A = {
      cx: C,
      cy: I,
      startAngle: T,
      endAngle: E,
      innerRadius: k,
      outerRadius: k
    }, w = yP, S = ft.cursorLine;
  } else
    A = {
      points: hD(c, p, l)
    }, w = pl, S = ft.cursorLine;
  var $ = typeof f == "object" && "className" in f ? f.className : void 0, F = ws(ws(ws(ws({
    stroke: "#ccc",
    pointerEvents: "none"
  }, l), A), Ui(f)), {}, {
    payload: y,
    payloadIndex: b,
    className: ze("recharts-tooltip-cursor", $)
  });
  return /* @__PURE__ */ x.createElement(or, {
    zIndex: (t = e.zIndex) !== null && t !== void 0 ? t : S
  }, /* @__PURE__ */ x.createElement(cB, {
    cursor: f,
    cursorComp: w,
    cursorProps: F
  }));
}
function dB(e) {
  var t = M3(), r = JA(), n = Zi(), a = AE();
  return t == null || r == null || n == null || a == null ? null : /* @__PURE__ */ x.createElement(fB, Ih({}, e, {
    offset: r,
    layout: n,
    tooltipAxisBandSize: t,
    chartName: a
  }));
}
var CE = /* @__PURE__ */ x.createContext(null), vB = () => x.useContext(CE), Fv = { exports: {} }, Bw;
function hB() {
  return Bw || (Bw = 1, (function(e) {
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
      var b = new a(h, p || f, y), A = r ? r + d : d;
      return f._events[A] ? f._events[A].fn ? f._events[A] = [f._events[A], b] : f._events[A].push(b) : (f._events[A] = b, f._eventsCount++), f;
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
      for (var y = 0, b = p.length, A = new Array(b); y < b; y++)
        A[y] = p[y].fn;
      return A;
    }, c.prototype.listenerCount = function(d) {
      var h = r ? r + d : d, p = this._events[h];
      return p ? p.fn ? 1 : p.length : 0;
    }, c.prototype.emit = function(d, h, p, y, b, A) {
      var w = r ? r + d : d;
      if (!this._events[w]) return !1;
      var S = this._events[w], O = arguments.length, C, I;
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
            return S.fn.call(S.context, h, p, y, b, A), !0;
        }
        for (I = 1, C = new Array(O - 1); I < O; I++)
          C[I - 1] = arguments[I];
        S.fn.apply(S.context, C);
      } else {
        var k = S.length, T;
        for (I = 0; I < k; I++)
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
              if (!C) for (T = 1, C = new Array(O - 1); T < O; T++)
                C[T - 1] = arguments[T];
              S[I].fn.apply(S[I].context, C);
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
      var A = this._events[b];
      if (A.fn)
        A.fn === h && (!y || A.once) && (!p || A.context === p) && u(this, b);
      else {
        for (var w = 0, S = [], O = A.length; w < O; w++)
          (A[w].fn !== h || y && !A[w].once || p && A[w].context !== p) && S.push(A[w]);
        S.length ? this._events[b] = S.length === 1 ? S[0] : S : u(this, b);
      }
      return this;
    }, c.prototype.removeAllListeners = function(d) {
      var h;
      return d ? (h = r ? r + d : d, this._events[h] && u(this, h)) : (this._events = new n(), this._eventsCount = 0), this;
    }, c.prototype.off = c.prototype.removeListener, c.prototype.addListener = c.prototype.on, c.prefixed = r, c.EventEmitter = c, e.exports = c;
  })(Fv)), Fv.exports;
}
var pB = hB();
const mB = /* @__PURE__ */ hS(pB);
var jl = new mB(), jh = "recharts.syncEvent.tooltip", Fw = "recharts.syncEvent.brush", wm = (e, t) => {
  if (t && Array.isArray(e)) {
    var r = Number.parseInt(t, 10);
    if (!Br(r))
      return e[r];
  }
}, yB = {
  chartName: "",
  tooltipPayloadSearcher: () => {
  },
  eventEmitter: void 0,
  defaultTooltipEventType: "axis"
}, IE = Kt({
  name: "options",
  initialState: yB,
  reducers: {
    createEventEmitter: (e) => {
      e.eventEmitter == null && (e.eventEmitter = Symbol("rechartsEventEmitter"));
    }
  }
}), gB = IE.reducer, xB = IE.actions.createEventEmitter;
function bB(e) {
  return e.tooltip.syncInteraction;
}
var wB = {
  chartData: void 0,
  computedData: void 0,
  dataStartIndex: 0,
  dataEndIndex: 0
}, jE = Kt({
  name: "chartData",
  initialState: wB,
  reducers: {
    setChartData(e, t) {
      if (e.chartData = Ne(t.payload), t.payload == null) {
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
}), Sm = jE.actions, Ww = Sm.setChartData, SB = Sm.setDataStartEndIndexes;
Sm.setComputedData;
var AB = jE.reducer, PB = ["x", "y"];
function Uw(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function _a(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Uw(Object(r), !0).forEach(function(n) {
      OB(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Uw(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function OB(e, t, r) {
  return (t = EB(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function EB(e) {
  var t = kB(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function kB(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function CB(e, t) {
  if (e == null) return {};
  var r, n, a = IB(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]);
  }
  return a;
}
function IB(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
function jB() {
  var e = se(yp), t = se(gp), r = Fe(), n = se(NP), a = se(Mn), l = Zi(), u = Hc(), c = se((f) => f.rootProps.className);
  x.useEffect(() => {
    if (e == null)
      return Qi;
    var f = (d, h, p) => {
      if (t !== p && e === d) {
        if (h.payload.active === !1) {
          r(dl({
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
            var b = h.payload.coordinate, A = b.x, w = b.y, S = CB(b, PB), O = h.payload.sourceViewBox, C = O.x, I = O.y, k = O.width, T = O.height, E = _a(_a({}, S), {}, {
              x: u.x + (k ? (A - C) / k : 0) * u.width,
              y: u.y + (T ? (w - I) / T : 0) * u.height
            });
            r(_a(_a({}, h), {}, {
              payload: _a(_a({}, h.payload), {}, {
                coordinate: E
              })
            }));
          } else
            r(h);
          return;
        }
        if (a != null) {
          var $;
          if (typeof n == "function") {
            var F = {
              activeTooltipIndex: h.payload.index == null ? void 0 : Number(h.payload.index),
              isTooltipActive: h.payload.active,
              activeIndex: h.payload.index == null ? void 0 : Number(h.payload.index),
              activeLabel: h.payload.label,
              activeDataKey: h.payload.dataKey,
              activeCoordinate: h.payload.coordinate
            }, U = n(a, F);
            $ = a[U];
          } else n === "value" && ($ = a.find((ae) => String(ae.value) === h.payload.label));
          var H = h.payload.coordinate;
          if (H == null || u == null) {
            r(dl({
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
          if ($ == null) {
            r(dl({
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
          var G = H.x, W = H.y, ne = Math.min(G, u.x + u.width), re = Math.min(W, u.y + u.height), le = {
            x: l === "horizontal" ? $.coordinate : ne,
            y: l === "horizontal" ? re : $.coordinate
          }, fe = dl({
            active: h.payload.active,
            coordinate: le,
            dataKey: h.payload.dataKey,
            index: String($.index),
            label: h.payload.label,
            sourceViewBox: h.payload.sourceViewBox,
            graphicalItemId: h.payload.graphicalItemId
          });
          r(fe);
        }
      }
    };
    return jl.on(jh, f), () => {
      jl.off(jh, f);
    };
  }, [c, r, t, e, n, a, l, u]);
}
function _B() {
  var e = se(yp), t = se(gp), r = Fe();
  x.useEffect(() => {
    if (e == null)
      return Qi;
    var n = (a, l, u) => {
      t !== u && e === a && r(SB(l));
    };
    return jl.on(Fw, n), () => {
      jl.off(Fw, n);
    };
  }, [r, t, e]);
}
function TB() {
  var e = Fe();
  x.useEffect(() => {
    e(xB());
  }, [e]), jB(), _B();
}
function MB(e, t, r, n, a, l) {
  var u = se((A) => F3(A, e, t)), c = se(bE), f = se(gp), d = se(yp), h = se(NP), p = se(bB), y = (p == null ? void 0 : p.sourceViewBox) != null, b = Hc();
  x.useEffect(() => {
    if (!y && d != null && f != null) {
      var A = dl({
        active: l,
        coordinate: r,
        dataKey: u,
        index: a,
        label: typeof n == "number" ? String(n) : n,
        sourceViewBox: b,
        graphicalItemId: c
      });
      jl.emit(jh, d, A, f);
    }
  }, [y, r, u, c, a, n, f, d, h, l, b]);
}
function Kw(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Hw(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Kw(Object(r), !0).forEach(function(n) {
      NB(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Kw(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function NB(e, t, r) {
  return (t = DB(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function DB(e) {
  var t = $B(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function $B(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function RB(e, t) {
  return FB(e) || BB(e, t) || zB(e, t) || LB();
}
function LB() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function zB(e, t) {
  if (e) {
    if (typeof e == "string") return Vw(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? Vw(e, t) : void 0;
  }
}
function Vw(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function BB(e, t) {
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
function FB(e) {
  if (Array.isArray(e)) return e;
}
function WB(e) {
  return e.dataKey;
}
function UB(e, t) {
  return /* @__PURE__ */ x.isValidElement(e) ? /* @__PURE__ */ x.cloneElement(e, t) : typeof e == "function" ? /* @__PURE__ */ x.createElement(e, t) : /* @__PURE__ */ x.createElement(zM, t);
}
var Gw = [], KB = {
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
function Li(e) {
  var t, r, n = Ut(e, KB), a = n.active, l = n.allowEscapeViewBox, u = n.animationDuration, c = n.animationEasing, f = n.content, d = n.filterNull, h = n.isAnimationActive, p = n.offset, y = n.payloadUniqBy, b = n.position, A = n.reverseDirection, w = n.useTranslate3d, S = n.wrapperStyle, O = n.cursor, C = n.shared, I = n.trigger, k = n.defaultIndex, T = n.portal, E = n.axisId, $ = Fe(), F = typeof k == "number" ? String(k) : k;
  x.useEffect(() => {
    $(Tz({
      shared: C,
      trigger: I,
      axisId: E,
      active: a,
      defaultIndex: F
    }));
  }, [$, C, I, E, a, F]);
  var U = Hc(), H = lP(), G = Ez(C), W = (t = se((we) => K3(we, G, I, F))) !== null && t !== void 0 ? t : {}, ne = W.activeIndex, re = W.isActive, le = se((we) => U3(we, G, I, F)), fe = se((we) => EE(we, G, I, F)), ae = se((we) => W3(we, G, I, F)), K = le, te = vB(), Y = (r = a ?? re) !== null && r !== void 0 ? r : !1, D = s2([K, Y]), V = RB(D, 2), ve = V[0], ye = V[1], Ae = G === "axis" ? fe : void 0;
  MB(G, I, ae, Ae, ne, Y);
  var Pe = T ?? te;
  if (Pe == null || U == null || G == null)
    return null;
  var Ee = K ?? Gw;
  Y || (Ee = Gw), d && Ee.length && (Ee = T_(Ee.filter((we) => we.value != null && (we.hide !== !0 || n.includeHidden)), y, WB));
  var Ce = Ee.length > 0, J = Hw(Hw({}, n), {}, {
    payload: Ee,
    label: Ae,
    active: Y,
    activeIndex: ne,
    coordinate: ae,
    accessibilityLayer: H
  }), me = /* @__PURE__ */ x.createElement(oN, {
    allowEscapeViewBox: l,
    animationDuration: u,
    animationEasing: c,
    isAnimationActive: h,
    active: Y,
    coordinate: ae,
    hasPayload: Ce,
    offset: p,
    position: b,
    reverseDirection: A,
    useTranslate3d: w,
    viewBox: U,
    wrapperStyle: S,
    lastBoundingBox: ve,
    innerRef: ye,
    hasPortalFromProps: !!T
  }, UB(f, J));
  return /* @__PURE__ */ x.createElement(x.Fragment, null, /* @__PURE__ */ bS.createPortal(me, Pe), Y && /* @__PURE__ */ x.createElement(dB, {
    cursor: O,
    tooltipEventType: G,
    coordinate: ae,
    payload: Ee,
    index: ne
  }));
}
var lo = (e) => null;
lo.displayName = "Cell";
function HB(e, t, r) {
  return (t = VB(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function VB(e) {
  var t = GB(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function GB(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
class YB {
  constructor(t) {
    HB(this, "cache", /* @__PURE__ */ new Map()), this.maxSize = t;
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
function Yw(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function qB(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Yw(Object(r), !0).forEach(function(n) {
      XB(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Yw(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function XB(e, t, r) {
  return (t = QB(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function QB(e) {
  var t = ZB(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function ZB(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var JB = {
  cacheSize: 2e3,
  enableCache: !0
}, _E = qB({}, JB), qw = new YB(_E.cacheSize), e4 = {
  position: "absolute",
  top: "-20000px",
  left: 0,
  padding: 0,
  margin: 0,
  border: "none",
  whiteSpace: "pre"
}, Xw = "recharts_measurement_span";
function t4(e, t) {
  var r = t.fontSize || "", n = t.fontFamily || "", a = t.fontWeight || "", l = t.fontStyle || "", u = t.letterSpacing || "", c = t.textTransform || "";
  return "".concat(e, "|").concat(r, "|").concat(n, "|").concat(a, "|").concat(l, "|").concat(u, "|").concat(c);
}
var Qw = (e, t) => {
  try {
    var r = document.getElementById(Xw);
    r || (r = document.createElement("span"), r.setAttribute("id", Xw), r.setAttribute("aria-hidden", "true"), document.body.appendChild(r)), Object.assign(r.style, e4, t), r.textContent = "".concat(e);
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
}, yl = function(t) {
  var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  if (t == null || zl.isSsr)
    return {
      width: 0,
      height: 0
    };
  if (!_E.enableCache)
    return Qw(t, r);
  var n = t4(t, r), a = qw.get(n);
  if (a)
    return a;
  var l = Qw(t, r);
  return qw.set(n, l), l;
}, TE;
function pc(e, t) {
  return a4(e) || i4(e, t) || n4(e, t) || r4();
}
function r4() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function n4(e, t) {
  if (e) {
    if (typeof e == "string") return Zw(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? Zw(e, t) : void 0;
  }
}
function Zw(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function i4(e, t) {
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
function a4(e) {
  if (Array.isArray(e)) return e;
}
function o4(e, t, r) {
  return (t = l4(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function l4(e) {
  var t = u4(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function u4(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Jw = /(-?\d+(?:\.\d+)?[a-zA-Z%]*)([*/])(-?\d+(?:\.\d+)?[a-zA-Z%]*)/, e1 = /(-?\d+(?:\.\d+)?[a-zA-Z%]*)([+-])(-?\d+(?:\.\d+)?[a-zA-Z%]*)/, s4 = /^(px|cm|vh|vw|em|rem|%|mm|in|pt|pc|ex|ch|vmin|vmax|Q)$/, c4 = /(-?\d+(?:\.\d+)?)([a-zA-Z%]+)?/, f4 = {
  cm: 96 / 2.54,
  mm: 96 / 25.4,
  pt: 96 / 72,
  pc: 96 / 6,
  in: 96,
  Q: 96 / (2.54 * 40),
  px: 1
}, d4 = ["cm", "mm", "pt", "pc", "in", "Q", "px"];
function v4(e) {
  return d4.includes(e);
}
var $a = "NaN";
function h4(e, t) {
  return e * f4[t];
}
class Tt {
  static parse(t) {
    var r, n = (r = c4.exec(t)) !== null && r !== void 0 ? r : [], a = pc(n, 3), l = a[1], u = a[2];
    return l == null ? Tt.NaN : new Tt(parseFloat(l), u ?? "");
  }
  constructor(t, r) {
    this.num = t, this.unit = r, this.num = t, this.unit = r, Br(t) && (this.unit = ""), r !== "" && !s4.test(r) && (this.num = NaN, this.unit = ""), v4(r) && (this.num = h4(t, r), this.unit = "px");
  }
  add(t) {
    return this.unit !== t.unit ? new Tt(NaN, "") : new Tt(this.num + t.num, this.unit);
  }
  subtract(t) {
    return this.unit !== t.unit ? new Tt(NaN, "") : new Tt(this.num - t.num, this.unit);
  }
  multiply(t) {
    return this.unit !== "" && t.unit !== "" && this.unit !== t.unit ? new Tt(NaN, "") : new Tt(this.num * t.num, this.unit || t.unit);
  }
  divide(t) {
    return this.unit !== "" && t.unit !== "" && this.unit !== t.unit ? new Tt(NaN, "") : new Tt(this.num / t.num, this.unit || t.unit);
  }
  toString() {
    return "".concat(this.num).concat(this.unit);
  }
  isNaN() {
    return Br(this.num);
  }
}
TE = Tt;
o4(Tt, "NaN", new TE(NaN, ""));
function ME(e) {
  if (e == null || e.includes($a))
    return $a;
  for (var t = e; t.includes("*") || t.includes("/"); ) {
    var r, n = (r = Jw.exec(t)) !== null && r !== void 0 ? r : [], a = pc(n, 4), l = a[1], u = a[2], c = a[3], f = Tt.parse(l ?? ""), d = Tt.parse(c ?? ""), h = u === "*" ? f.multiply(d) : f.divide(d);
    if (h.isNaN())
      return $a;
    t = t.replace(Jw, h.toString());
  }
  for (; t.includes("+") || /.-\d+(?:\.\d+)?/.test(t); ) {
    var p, y = (p = e1.exec(t)) !== null && p !== void 0 ? p : [], b = pc(y, 4), A = b[1], w = b[2], S = b[3], O = Tt.parse(A ?? ""), C = Tt.parse(S ?? ""), I = w === "+" ? O.add(C) : O.subtract(C);
    if (I.isNaN())
      return $a;
    t = t.replace(e1, I.toString());
  }
  return t;
}
var t1 = /\(([^()]*)\)/;
function p4(e) {
  for (var t = e, r; (r = t1.exec(t)) != null; ) {
    var n = r, a = pc(n, 2), l = a[1];
    t = t.replace(t1, ME(l));
  }
  return t;
}
function m4(e) {
  var t = e.replace(/\s+/g, "");
  return t = p4(t), t = ME(t), t;
}
function y4(e) {
  try {
    return m4(e);
  } catch {
    return $a;
  }
}
function Wv(e) {
  var t = y4(e.slice(5, -1));
  return t === $a ? "" : t;
}
var g4 = ["x", "y", "lineHeight", "capHeight", "fill", "scaleToFit", "textAnchor", "verticalAnchor"], x4 = ["dx", "dy", "angle", "className", "breakAll"];
function _h() {
  return _h = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, _h.apply(null, arguments);
}
function r1(e, t) {
  if (e == null) return {};
  var r, n, a = b4(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]);
  }
  return a;
}
function b4(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
function n1(e, t) {
  return P4(e) || A4(e, t) || S4(e, t) || w4();
}
function w4() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function S4(e, t) {
  if (e) {
    if (typeof e == "string") return i1(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? i1(e, t) : void 0;
  }
}
function i1(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function A4(e, t) {
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
function P4(e) {
  if (Array.isArray(e)) return e;
}
var NE = /[ \f\n\r\t\v\u2028\u2029]+/, DE = (e) => {
  var t = e.children, r = e.breakAll, n = e.style;
  try {
    var a = [];
    Ze(t) || (r ? a = t.toString().split("") : a = t.toString().split(NE));
    var l = a.map((c) => ({
      word: c,
      width: yl(c, n).width
    })), u = r ? 0 : yl(" ", n).width;
    return {
      wordsWithComputedWidth: l,
      spaceWidth: u
    };
  } catch {
    return null;
  }
};
function $E(e) {
  return e === "start" || e === "middle" || e === "end" || e === "inherit";
}
function O4(e) {
  return Ze(e) || typeof e == "string" || typeof e == "number" || typeof e == "boolean";
}
var RE = (e, t, r, n) => e.reduce((a, l) => {
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
}, []), LE = (e) => e.reduce((t, r) => t.width > r.width ? t : r), E4 = "…", a1 = (e, t, r, n, a, l, u, c) => {
  var f = e.slice(0, t), d = DE({
    breakAll: r,
    style: n,
    children: f + E4
  });
  if (!d)
    return [!1, []];
  var h = RE(d.wordsWithComputedWidth, l, u, c), p = h.length > a || LE(h).width > Number(l);
  return [p, h];
}, k4 = (e, t, r, n, a) => {
  var l = e.maxLines, u = e.children, c = e.style, f = e.breakAll, d = ie(l), h = String(u), p = RE(t, n, r, a);
  if (!d || a)
    return p;
  var y = p.length > l || LE(p).width > Number(n);
  if (!y)
    return p;
  for (var b = 0, A = h.length - 1, w = 0, S; b <= A && w <= h.length - 1; ) {
    var O = Math.floor((b + A) / 2), C = O - 1, I = a1(h, C, f, c, l, n, r, a), k = n1(I, 2), T = k[0], E = k[1], $ = a1(h, O, f, c, l, n, r, a), F = n1($, 1), U = F[0];
    if (!T && !U && (b = O + 1), T && U && (A = O - 1), !T && U) {
      S = E;
      break;
    }
    w++;
  }
  return S || p;
}, o1 = (e) => {
  var t = Ze(e) ? [] : e.toString().split(NE);
  return [{
    words: t,
    width: void 0
  }];
}, C4 = (e) => {
  var t = e.width, r = e.scaleToFit, n = e.children, a = e.style, l = e.breakAll, u = e.maxLines;
  if ((t || r) && !zl.isSsr) {
    var c, f, d = DE({
      breakAll: l,
      children: n,
      style: a
    });
    if (d) {
      var h = d.wordsWithComputedWidth, p = d.spaceWidth;
      c = h, f = p;
    } else
      return o1(n);
    return k4({
      breakAll: l,
      children: n,
      maxLines: u,
      style: a
    }, c, f, t, !!r);
  }
  return o1(n);
}, zE = "#808080", I4 = {
  angle: 0,
  breakAll: !1,
  // Magic number from d3
  capHeight: "0.71em",
  fill: zE,
  lineHeight: "1em",
  scaleToFit: !1,
  textAnchor: "start",
  // Maintain compat with existing charts / default SVG behavior
  verticalAnchor: "end",
  x: 0,
  y: 0
}, df = /* @__PURE__ */ x.forwardRef((e, t) => {
  var r = Ut(e, I4), n = r.x, a = r.y, l = r.lineHeight, u = r.capHeight, c = r.fill, f = r.scaleToFit, d = r.textAnchor, h = r.verticalAnchor, p = r1(r, g4), y = x.useMemo(() => C4({
    breakAll: p.breakAll,
    children: p.children,
    maxLines: p.maxLines,
    scaleToFit: f,
    style: p.style,
    width: p.width
  }), [p.breakAll, p.children, p.maxLines, f, p.style, p.width]), b = p.dx, A = p.dy, w = p.angle, S = p.className, O = p.breakAll, C = r1(p, x4);
  if (!nn(n) || !nn(a) || y.length === 0)
    return null;
  var I = Number(n) + (ie(b) ? b : 0), k = Number(a) + (ie(A) ? A : 0);
  if (!Oe(I) || !Oe(k))
    return null;
  var T;
  switch (h) {
    case "start":
      T = Wv("calc(".concat(u, ")"));
      break;
    case "middle":
      T = Wv("calc(".concat((y.length - 1) / 2, " * -").concat(l, " + (").concat(u, " / 2))"));
      break;
    default:
      T = Wv("calc(".concat(y.length - 1, " * -").concat(l, ")"));
      break;
  }
  var E = [], $ = y[0];
  if (f && $ != null) {
    var F = $.width, U = p.width;
    E.push("scale(".concat(ie(U) && ie(F) ? U / F : 1, ")"));
  }
  return w && E.push("rotate(".concat(w, ", ").concat(I, ", ").concat(k, ")")), E.length && (C.transform = E.join(" ")), /* @__PURE__ */ x.createElement("text", _h({}, Pr(C), {
    ref: t,
    x: I,
    y: k,
    className: ze("recharts-text", S),
    textAnchor: d,
    fill: c.includes("url") ? zE : c
  }), y.map((H, G) => {
    var W = H.words.join(O ? "" : " ");
    return (
      // duplicate words will cause duplicate keys which is why we add the array index here
      /* @__PURE__ */ x.createElement("tspan", {
        x: I,
        dy: G === 0 ? T : l,
        key: "".concat(W, "-").concat(G)
      }, W)
    );
  }));
});
df.displayName = "Text";
var j4 = ["labelRef"], _4 = ["content"];
function l1(e, t) {
  if (e == null) return {};
  var r, n, a = T4(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]);
  }
  return a;
}
function T4(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
function u1(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Ti(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? u1(Object(r), !0).forEach(function(n) {
      M4(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : u1(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function M4(e, t, r) {
  return (t = N4(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function N4(e) {
  var t = D4(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function D4(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function xn() {
  return xn = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, xn.apply(null, arguments);
}
var BE = /* @__PURE__ */ x.createContext(null), $4 = (e) => {
  var t = e.x, r = e.y, n = e.upperWidth, a = e.lowerWidth, l = e.width, u = e.height, c = e.children, f = x.useMemo(() => ({
    x: t,
    y: r,
    upperWidth: n,
    lowerWidth: a,
    width: l,
    height: u
  }), [t, r, n, a, l, u]);
  return /* @__PURE__ */ x.createElement(BE.Provider, {
    value: f
  }, c);
}, FE = () => {
  var e = x.useContext(BE), t = Hc();
  return e || (t ? Gh(t) : void 0);
}, WE = /* @__PURE__ */ x.createContext(null), R4 = (e) => {
  var t = e.cx, r = e.cy, n = e.innerRadius, a = e.outerRadius, l = e.startAngle, u = e.endAngle, c = e.clockWise, f = e.children, d = x.useMemo(() => ({
    cx: t,
    cy: r,
    innerRadius: n,
    outerRadius: a,
    startAngle: l,
    endAngle: u,
    clockWise: c
  }), [t, r, n, a, l, u, c]);
  return /* @__PURE__ */ x.createElement(WE.Provider, {
    value: d
  }, f);
}, L4 = () => {
  var e = x.useContext(WE), t = se(zP);
  return e || t;
}, z4 = (e) => {
  var t = e.value, r = e.formatter, n = Ze(e.children) ? t : e.children;
  return typeof r == "function" ? r(n) : n;
}, vf = (e) => e != null && typeof e == "function", B4 = (e, t) => {
  var r = Ot(t - e), n = Math.min(Math.abs(t - e), 360);
  return r * n;
}, F4 = (e, t, r, n, a) => {
  var l = e.offset, u = e.className, c = a.cx, f = a.cy, d = a.innerRadius, h = a.outerRadius, p = a.startAngle, y = a.endAngle, b = a.clockWise, A = (d + h) / 2, w = B4(p, y), S = w >= 0 ? 1 : -1, O, C;
  switch (t) {
    case "insideStart":
      O = p + S * l, C = b;
      break;
    case "insideEnd":
      O = y - S * l, C = !b;
      break;
    case "end":
      O = y + S * l, C = b;
      break;
    default:
      throw new Error("Unsupported position ".concat(t));
  }
  C = w <= 0 ? C : !C;
  var I = ct(c, f, A, O), k = ct(c, f, A, O + (C ? 1 : -1) * 359), T = "M".concat(I.x, ",").concat(I.y, `
    A`).concat(A, ",").concat(A, ",0,1,").concat(C ? 0 : 1, `,
    `).concat(k.x, ",").concat(k.y), E = Ze(e.id) ? bl("recharts-radial-line-") : e.id;
  return /* @__PURE__ */ x.createElement("text", xn({}, n, {
    dominantBaseline: "central",
    className: ze("recharts-radial-bar-label", u)
  }), /* @__PURE__ */ x.createElement("defs", null, /* @__PURE__ */ x.createElement("path", {
    id: E,
    d: T
  })), /* @__PURE__ */ x.createElement("textPath", {
    xlinkHref: "#".concat(E)
  }, r));
}, W4 = (e, t, r) => {
  var n = e.cx, a = e.cy, l = e.innerRadius, u = e.outerRadius, c = e.startAngle, f = e.endAngle, d = (c + f) / 2;
  if (r === "outside") {
    var h = ct(n, a, u + t, d), p = h.x, y = h.y;
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
  var b = (l + u) / 2, A = ct(n, a, b, d), w = A.x, S = A.y;
  return {
    x: w,
    y: S,
    textAnchor: "middle",
    verticalAnchor: "middle"
  };
}, Da = (e) => e != null && "cx" in e && ie(e.cx), U4 = {
  angle: 0,
  offset: 5,
  zIndex: ft.label,
  position: "middle",
  textBreakAll: !1
};
function K4(e) {
  if (!Da(e))
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
function ti(e) {
  var t, r, n = Ut(e, U4), a = n.viewBox, l = n.parentViewBox, u = n.position, c = n.value, f = n.children, d = n.content, h = n.className, p = h === void 0 ? "" : h, y = n.textBreakAll, b = n.labelRef, A = L4(), w = FE(), S = u === "center" ? w : A ?? w, O, C, I;
  a == null ? O = S : Da(a) ? O = a : O = Gh(a);
  var k = K4(O);
  if (!O || Ze(c) && Ze(f) && !/* @__PURE__ */ x.isValidElement(d) && typeof d != "function")
    return null;
  var T = Da(O) && (u === "insideStart" || u === "insideEnd" || u === "end");
  if (Da(O))
    T || (I = W4(O, n.offset, n.position));
  else if (k) {
    var E = Tj({
      viewBox: k,
      position: u,
      offset: n.offset,
      parentViewBox: Da(l) ? void 0 : l
    });
    I = Ti(Ti({
      x: E.x,
      y: E.y,
      textAnchor: E.horizontalAnchor,
      verticalAnchor: E.verticalAnchor
    }, E.width !== void 0 ? {
      width: E.width
    } : {}), E.height !== void 0 ? {
      height: E.height
    } : {});
  }
  var $ = Ti(Ti(Ti(Ti({}, ((t = I) === null || t === void 0 ? void 0 : t.x) !== void 0 ? {
    x: I.x
  } : {}), ((r = I) === null || r === void 0 ? void 0 : r.y) !== void 0 ? {
    y: I.y
  } : {}), n), {}, {
    viewBox: O
  });
  if (/* @__PURE__ */ x.isValidElement(d)) {
    $.labelRef;
    var F = l1($, j4);
    return /* @__PURE__ */ x.cloneElement(d, F);
  }
  if (typeof d == "function") {
    $.content;
    var U = l1($, _4);
    if (C = /* @__PURE__ */ x.createElement(d, U), /* @__PURE__ */ x.isValidElement(C))
      return C;
  } else
    C = z4(n);
  var H = Pr(n);
  return T && Da(O) ? F4(n, u, C, H, O) : I == null ? null : /* @__PURE__ */ x.createElement(or, {
    zIndex: n.zIndex
  }, /* @__PURE__ */ x.createElement(df, xn({
    ref: b,
    className: ze("recharts-label", p)
  }, H, I, {
    /*
     * textAnchor is decided by default based on the `position`
     * but we allow overriding via props for precise control.
     */
    textAnchor: $E(H.textAnchor) ? H.textAnchor : I.textAnchor,
    breakAll: y
  }), C));
}
ti.displayName = "Label";
var H4 = (e, t, r) => {
  if (!e)
    return null;
  var n = {
    viewBox: t,
    labelRef: r
  };
  return e === !0 ? /* @__PURE__ */ x.createElement(ti, xn({
    key: "label-implicit"
  }, n)) : nn(e) ? /* @__PURE__ */ x.createElement(ti, xn({
    key: "label-implicit",
    value: e
  }, n)) : /* @__PURE__ */ x.isValidElement(e) ? e.type === ti ? /* @__PURE__ */ x.cloneElement(e, Ti({
    key: "label-implicit"
  }, n)) : /* @__PURE__ */ x.createElement(ti, xn({
    key: "label-implicit",
    content: e
  }, n)) : vf(e) ? /* @__PURE__ */ x.createElement(ti, xn({
    key: "label-implicit",
    content: e
  }, n)) : e && typeof e == "object" ? /* @__PURE__ */ x.createElement(ti, xn({}, e, {
    key: "label-implicit"
  }, n)) : null;
};
function V4(e) {
  var t = e.label, r = e.labelRef, n = FE();
  return H4(t, n, r) || null;
}
var G4 = ["valueAccessor"], Y4 = ["dataKey", "clockWise", "id", "textBreakAll", "zIndex"];
function mc() {
  return mc = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, mc.apply(null, arguments);
}
function s1(e, t) {
  if (e == null) return {};
  var r, n, a = q4(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]);
  }
  return a;
}
function q4(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
var X4 = (e) => {
  var t = Array.isArray(e.value) ? e.value[e.value.length - 1] : e.value;
  if (O4(t))
    return t;
}, UE = /* @__PURE__ */ x.createContext(void 0), KE = UE.Provider, HE = /* @__PURE__ */ x.createContext(void 0), Q4 = HE.Provider;
function Z4() {
  return x.useContext(UE);
}
function J4() {
  return x.useContext(HE);
}
function Ts(e) {
  var t = e.valueAccessor, r = t === void 0 ? X4 : t, n = s1(e, G4), a = n.dataKey;
  n.clockWise;
  var l = n.id, u = n.textBreakAll, c = n.zIndex, f = s1(n, Y4), d = Z4(), h = J4(), p = d || h;
  return !p || !p.length ? null : /* @__PURE__ */ x.createElement(or, {
    zIndex: c ?? ft.label
  }, /* @__PURE__ */ x.createElement(at, {
    className: "recharts-label-list"
  }, p.map((y, b) => {
    var A, w = Ze(a) ? r(y, b) : $e(y.payload, a), S = Ze(l) ? {} : {
      id: "".concat(l, "-").concat(b)
    };
    return /* @__PURE__ */ x.createElement(ti, mc({
      key: "label-".concat(b)
    }, Pr(y), f, S, {
      /*
       * Prefer to use the explicit fill from LabelList props.
       * Only in an absence of that, fall back to the fill of the entry.
       * The entry fill can be quite difficult to see especially in Bar, Pie, RadialBar in inside positions.
       * On the other hand it's quite convenient in Scatter, Line, or when the position is outside the Bar, Pie filled shapes.
       */
      fill: (A = n.fill) !== null && A !== void 0 ? A : y.fill,
      parentViewBox: y.parentViewBox,
      value: w,
      textBreakAll: u,
      viewBox: y.viewBox,
      index: b,
      zIndex: 0
    }));
  })));
}
Ts.displayName = "LabelList";
function Am(e) {
  var t = e.label;
  return t ? t === !0 ? /* @__PURE__ */ x.createElement(Ts, {
    key: "labelList-implicit"
  }) : /* @__PURE__ */ x.isValidElement(t) || vf(t) ? /* @__PURE__ */ x.createElement(Ts, {
    key: "labelList-implicit",
    content: t
  }) : typeof t == "object" ? /* @__PURE__ */ x.createElement(Ts, mc({
    key: "labelList-implicit"
  }, t, {
    type: String(t.type)
  })) : null : null;
}
function Th() {
  return Th = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Th.apply(null, arguments);
}
var VE = (e) => {
  var t = e.cx, r = e.cy, n = e.r, a = e.className, l = ze("recharts-dot", a);
  return ie(t) && ie(r) && ie(n) ? /* @__PURE__ */ x.createElement("circle", Th({}, ar(e), qh(e), {
    className: l,
    cx: t,
    cy: r,
    r: n
  })) : null;
}, GE = (e) => e.graphicalItems.polarItems, e8 = R([Je, Wl], Yp), hf = R([GE, et, e8], qp), t8 = R([hf], Xp), pf = R([t8, Bl], Qp), r8 = R([pf, et, hf], _O);
R([pf, et, hf], (e, t, r) => r.length > 0 ? e.flatMap((n) => r.flatMap((a) => {
  var l, u = $e(n, (l = t.dataKey) !== null && l !== void 0 ? l : a.dataKey);
  return {
    value: u,
    errorDomain: []
    // polar charts do not have error bars
  };
})).filter(Boolean) : (t == null ? void 0 : t.dataKey) != null ? e.map((n) => ({
  value: $e(n, t.dataKey),
  errorDomain: []
})) : e.map((n) => ({
  value: n,
  errorDomain: []
})));
var c1 = () => {
}, n8 = R([pf, et, hf, lf, Je, yD], rm), i8 = R([et, em, tm, c1, n8, c1, _e, Je], nm), YE = R([et, _e, pf, r8, Fl, Je, i8], im), a8 = R([YE, no, di], om), o8 = R([et, YE, a8, Je], um);
R([di, o8], FP);
var l8 = {
  radiusAxis: {},
  angleAxis: {}
}, qE = Kt({
  name: "polarAxis",
  initialState: l8,
  reducers: {
    addRadiusAxis(e, t) {
      e.radiusAxis[t.payload.id] = Ne(t.payload);
    },
    removeRadiusAxis(e, t) {
      delete e.radiusAxis[t.payload.id];
    },
    addAngleAxis(e, t) {
      e.angleAxis[t.payload.id] = Ne(t.payload);
    },
    removeAngleAxis(e, t) {
      delete e.angleAxis[t.payload.id];
    }
  }
}), mf = qE.actions;
mf.addRadiusAxis;
mf.removeRadiusAxis;
mf.addAngleAxis;
mf.removeAngleAxis;
var u8 = qE.reducer;
function XE(e) {
  return e && typeof e == "object" && "className" in e && typeof e.className == "string" ? e.className : "";
}
function f1(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function d1(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? f1(Object(r), !0).forEach(function(n) {
      s8(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : f1(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function s8(e, t, r) {
  return (t = c8(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function c8(e) {
  var t = f8(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function f8(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var d8 = (e, t) => t, Pm = R([GE, d8], (e, t) => e.filter((r) => r.type === "pie").find((r) => r.id === t)), v8 = [], Om = (e, t, r) => (r == null ? void 0 : r.length) === 0 ? v8 : r, QE = R([Bl, Pm, Om], (e, t, r) => {
  var n = e.chartData;
  if (t != null) {
    var a;
    if ((t == null ? void 0 : t.data) != null && t.data.length > 0 ? a = t.data : a = n, (!a || !a.length) && r != null && (a = r.map((l) => d1(d1({}, t.presentationProps), l.props))), a != null)
      return a;
  }
}), h8 = R([QE, Pm, Om], (e, t, r) => {
  if (!(e == null || t == null))
    return e.map((n, a) => {
      var l, u = $e(n, t.nameKey, t.name), c;
      return r != null && (l = r[a]) !== null && l !== void 0 && (l = l.props) !== null && l !== void 0 && l.fill ? c = r[a].props.fill : typeof n == "object" && n != null && "fill" in n ? c = n.fill : c = t.fill, {
        value: Za(u, t.dataKey),
        dataKey: t.dataKey,
        color: c,
        // @ts-expect-error Legend payload.payload says it wants objects but our data can be unknown
        payload: n,
        type: t.legendType
      };
    });
}), p8 = R([QE, Pm, Om, gt], (e, t, r, n) => {
  if (!(t == null || e == null))
    return EF({
      offset: n,
      pieSettings: t,
      displayedData: e,
      cells: r
    });
}), Uv = { exports: {} }, Re = {};
/**
 * @license React
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var v1;
function m8() {
  if (v1) return Re;
  v1 = 1;
  var e = Symbol.for("react.element"), t = Symbol.for("react.portal"), r = Symbol.for("react.fragment"), n = Symbol.for("react.strict_mode"), a = Symbol.for("react.profiler"), l = Symbol.for("react.provider"), u = Symbol.for("react.context"), c = Symbol.for("react.server_context"), f = Symbol.for("react.forward_ref"), d = Symbol.for("react.suspense"), h = Symbol.for("react.suspense_list"), p = Symbol.for("react.memo"), y = Symbol.for("react.lazy"), b = Symbol.for("react.offscreen"), A;
  A = Symbol.for("react.module.reference");
  function w(S) {
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
    return w(S) === u;
  }, Re.isContextProvider = function(S) {
    return w(S) === l;
  }, Re.isElement = function(S) {
    return typeof S == "object" && S !== null && S.$$typeof === e;
  }, Re.isForwardRef = function(S) {
    return w(S) === f;
  }, Re.isFragment = function(S) {
    return w(S) === r;
  }, Re.isLazy = function(S) {
    return w(S) === y;
  }, Re.isMemo = function(S) {
    return w(S) === p;
  }, Re.isPortal = function(S) {
    return w(S) === t;
  }, Re.isProfiler = function(S) {
    return w(S) === a;
  }, Re.isStrictMode = function(S) {
    return w(S) === n;
  }, Re.isSuspense = function(S) {
    return w(S) === d;
  }, Re.isSuspenseList = function(S) {
    return w(S) === h;
  }, Re.isValidElementType = function(S) {
    return typeof S == "string" || typeof S == "function" || S === r || S === a || S === n || S === d || S === h || S === b || typeof S == "object" && S !== null && (S.$$typeof === y || S.$$typeof === p || S.$$typeof === l || S.$$typeof === u || S.$$typeof === f || S.$$typeof === A || S.getModuleId !== void 0);
  }, Re.typeOf = w, Re;
}
var h1;
function y8() {
  return h1 || (h1 = 1, Uv.exports = m8()), Uv.exports;
}
var g8 = y8(), p1 = (e) => typeof e == "string" ? e : e ? e.displayName || e.name || "Component" : "", m1 = null, Kv = null, ZE = (e) => {
  if (e === m1 && Array.isArray(Kv))
    return Kv;
  var t = [];
  return x.Children.forEach(e, (r) => {
    Ze(r) || (g8.isFragment(r) ? t = t.concat(ZE(r.props.children)) : t.push(r));
  }), Kv = t, m1 = e, t;
};
function Em(e, t) {
  var r = [], n = [];
  return Array.isArray(t) ? n = t.map((a) => p1(a)) : n = [p1(t)], ZE(e).forEach((a) => {
    var l = rn(a, "type.displayName") || rn(a, "type.name");
    l && n.indexOf(l) !== -1 && r.push(a);
  }), r;
}
var JE = (e) => e && typeof e == "object" && "clipDot" in e ? !!e.clipDot : !0;
function y1(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function g1(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? y1(Object(r), !0).forEach(function(n) {
      x8(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : y1(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function x8(e, t, r) {
  return (t = b8(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function b8(e) {
  var t = w8(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function w8(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function ek(e, t) {
  return g1(g1({}, t), e);
}
function S8(e) {
  return /* @__PURE__ */ x.isValidElement(e) ? e.props : e;
}
function A8(e, t) {
  return /* @__PURE__ */ x.cloneElement(e, ek(S8(e), t));
}
function P8(e) {
  if ("index" in e) {
    var t = e.index;
    return typeof t == "number" || typeof t == "string" ? t : void 0;
  }
}
function O8(e) {
  return "isActive" in e && e.isActive === !0;
}
function km(e) {
  var t = e.option, r = e.DefaultShape, n = e.shapeProps, a = e.activeClassName, l = a === void 0 ? "recharts-active-shape" : a, u = e.inActiveClassName, c = u === void 0 ? "recharts-shape" : u, f = P8(n), d;
  return /* @__PURE__ */ x.isValidElement(t) ? d = A8(t, n) : t === r ? d = /* @__PURE__ */ x.createElement(r, n) : typeof t == "function" ? d = t(n, f) : typeof t == "object" ? d = /* @__PURE__ */ x.createElement(r, ek(t, n)) : d = /* @__PURE__ */ x.createElement(r, n), O8(n) ? /* @__PURE__ */ x.createElement(at, {
    className: l
  }, d) : /* @__PURE__ */ x.createElement(at, {
    className: c
  }, d);
}
var Cm = (e, t, r) => {
  var n = Fe();
  return (a, l) => (u) => {
    e == null || e(a, l, u), n(iE({
      activeIndex: String(l),
      activeDataKey: t,
      activeCoordinate: a.tooltipPosition,
      activeGraphicalItemId: r
    }));
  };
}, Im = (e) => {
  var t = Fe();
  return (r, n) => (a) => {
    e == null || e(r, n, a), t(Mz());
  };
}, jm = (e, t, r) => {
  var n = Fe();
  return (a, l) => (u) => {
    e == null || e(a, l, u), n(Nz({
      activeIndex: String(l),
      activeDataKey: t,
      activeCoordinate: a.tooltipPosition,
      activeGraphicalItemId: r
    }));
  };
};
function _m(e) {
  var t = e.tooltipEntrySettings, r = Fe(), n = Ht(), a = x.useRef(null);
  return x.useLayoutEffect(() => {
    n || (a.current === null ? r(Iz(t)) : a.current !== t && r(jz({
      prev: a.current,
      next: t
    })), a.current = t);
  }, [t, r, n]), x.useLayoutEffect(() => () => {
    a.current && (r(_z(a.current)), a.current = null);
  }, [r]), null;
}
function tk(e) {
  var t = e.legendPayload, r = Fe(), n = Ht(), a = x.useRef(null);
  return x.useLayoutEffect(() => {
    n || (a.current === null ? r(nP(t)) : a.current !== t && r(iP({
      prev: a.current,
      next: t
    })), a.current = t);
  }, [r, n, t]), x.useLayoutEffect(() => () => {
    a.current && (r(aP(a.current)), a.current = null);
  }, [r]), null;
}
function E8(e) {
  var t = e.legendPayload, r = Fe(), n = se(_e), a = x.useRef(null);
  return x.useLayoutEffect(() => {
    n !== "centric" && n !== "radial" || (a.current === null ? r(nP(t)) : a.current !== t && r(iP({
      prev: a.current,
      next: t
    })), a.current = t);
  }, [r, n, t]), x.useLayoutEffect(() => () => {
    a.current && (r(aP(a.current)), a.current = null);
  }, [r]), null;
}
function k8(e, t) {
  return _8(e) || j8(e, t) || I8(e, t) || C8();
}
function C8() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function I8(e, t) {
  if (e) {
    if (typeof e == "string") return x1(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? x1(e, t) : void 0;
  }
}
function x1(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function j8(e, t) {
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
function _8(e) {
  if (Array.isArray(e)) return e;
}
var Tm = "index", Mm = "append";
function Nm(e, t) {
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
function T8(e, t) {
  var r = e.length / t.length, n = t.map((a, l) => e[Math.floor(l * r)]);
  return Nm(n, t);
}
function M8(e, t) {
  var r = t.map((n, a) => e[a]);
  return Nm(r, t);
}
function N8(e, t) {
  for (var r = /* @__PURE__ */ new Map(), n = 0; n < e.length; n++) {
    var a = e[n];
    if (a != null) {
      var l = t(a, n);
      l != null && !r.has(l) && r.set(l, a);
    }
  }
  return r;
}
function D8(e, t, r) {
  var n = N8(e, r), a = /* @__PURE__ */ new Set(), l = t.map((p, y) => {
    var b = r(p, y);
    if (b != null) {
      var A = n.get(b);
      if (A !== void 0)
        return a.add(b), A;
    }
  }), u = [];
  for (var c of n) {
    var f = k8(c, 2), d = f[0], h = f[1];
    a.has(d) || u.push(h);
  }
  return Nm(l, t, u);
}
function Mh(e, t, r) {
  return t == null ? null : e == null ? t.map((n) => ({
    status: "added",
    next: n
  })) : r === Tm ? T8(e, t) : r === Mm ? M8(e, t) : D8(e, t, r);
}
function rk(e, t) {
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
function $8(e, t) {
  return B8(e) || z8(e, t) || L8(e, t) || R8();
}
function R8() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function L8(e, t) {
  if (e) {
    if (typeof e == "string") return b1(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? b1(e, t) : void 0;
  }
}
function b1(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function z8(e, t) {
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
function B8(e) {
  if (Array.isArray(e)) return e;
}
function Dm(e, t) {
  var r = x.useState(!1), n = $8(r, 2), a = n[0], l = n[1], u = x.useCallback(() => {
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
function $m(e) {
  var t, r = e.animationInput, n = e.animationIdPrefix, a = e.items, l = e.previousItemsRef, u = e.isAnimationActive, c = e.animationBegin, f = e.animationDuration, d = e.animationEasing, h = e.onAnimationStart, p = e.onAnimationEnd, y = e.animationInterpolateFn, b = e.animationMatchBy, A = e.shouldUpdatePreviousRef, w = e.children, S = e.layout, O = dP(r, n), C = rk(O, l), I = (t = C.startValue) !== null && t !== void 0 ? t : null, k = Mh(I, a, b ?? Tm);
  return /* @__PURE__ */ x.createElement(fP, {
    animationId: O,
    begin: c,
    duration: f,
    isActive: u,
    easing: d,
    onAnimationEnd: p,
    onAnimationStart: h,
    key: O
  }, (T) => {
    var E = I == null, $ = a == null ? a : y(k, T, S), F = A ? A(T) : T > 0;
    return C.syncStepValue($, T, F), $ == null ? null : w($, T, E);
  });
}
var Hv;
function F8(e, t) {
  return H8(e) || K8(e, t) || U8(e, t) || W8();
}
function W8() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function U8(e, t) {
  if (e) {
    if (typeof e == "string") return w1(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? w1(e, t) : void 0;
  }
}
function w1(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function K8(e, t) {
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
function H8(e) {
  if (Array.isArray(e)) return e;
}
var V8 = () => {
  var e = x.useState(() => bl("uid-")), t = F8(e, 1), r = t[0];
  return r;
}, nk = (Hv = uj.useId) !== null && Hv !== void 0 ? Hv : V8;
function G8(e, t) {
  var r = nk();
  return t || (e ? "".concat(e, "-").concat(r) : r);
}
var Y8 = /* @__PURE__ */ x.createContext(void 0), Rm = (e) => {
  var t = e.id, r = e.type, n = e.children, a = G8("recharts-".concat(r), t);
  return /* @__PURE__ */ x.createElement(Y8.Provider, {
    value: a
  }, n(a));
}, q8 = {
  cartesianItems: [],
  polarItems: []
}, ik = Kt({
  name: "graphicalItems",
  initialState: q8,
  reducers: {
    addCartesianGraphicalItem: {
      reducer(e, t) {
        e.cartesianItems.push(Ne(t.payload));
      },
      prepare: He()
    },
    replaceCartesianGraphicalItem: {
      reducer(e, t) {
        var r = t.payload, n = r.prev, a = r.next, l = Sr(e).cartesianItems.indexOf(Ne(n));
        l > -1 && (e.cartesianItems[l] = Ne(a));
      },
      prepare: He()
    },
    removeCartesianGraphicalItem: {
      reducer(e, t) {
        var r = Sr(e).cartesianItems.indexOf(Ne(t.payload));
        r > -1 && e.cartesianItems.splice(r, 1);
      },
      prepare: He()
    },
    addPolarGraphicalItem: {
      reducer(e, t) {
        e.polarItems.push(Ne(t.payload));
      },
      prepare: He()
    },
    removePolarGraphicalItem: {
      reducer(e, t) {
        var r = Sr(e).polarItems.indexOf(Ne(t.payload));
        r > -1 && e.polarItems.splice(r, 1);
      },
      prepare: He()
    },
    replacePolarGraphicalItem: {
      reducer(e, t) {
        var r = t.payload, n = r.prev, a = r.next, l = Sr(e).polarItems.indexOf(Ne(n));
        l > -1 && (e.polarItems[l] = Ne(a));
      },
      prepare: He()
    }
  }
}), uo = ik.actions, X8 = uo.addCartesianGraphicalItem, Q8 = uo.replaceCartesianGraphicalItem, Z8 = uo.removeCartesianGraphicalItem, J8 = uo.addPolarGraphicalItem, eF = uo.removePolarGraphicalItem, tF = uo.replacePolarGraphicalItem, rF = ik.reducer, nF = (e) => {
  var t = Fe(), r = x.useRef(null);
  return x.useLayoutEffect(() => {
    r.current === null ? t(X8(e)) : r.current !== e && t(Q8({
      prev: r.current,
      next: e
    })), r.current = e;
  }, [t, e]), x.useLayoutEffect(() => () => {
    r.current && (t(Z8(r.current)), r.current = null);
  }, [t]), null;
}, ak = /* @__PURE__ */ x.memo(nF), iF = (e) => {
  var t = Fe(), r = x.useRef(null);
  return x.useLayoutEffect(() => {
    r.current === null ? t(J8(e)) : r.current !== e && t(tF({
      prev: r.current,
      next: e
    })), r.current = e;
  }, [t, e]), x.useLayoutEffect(() => () => {
    r.current && (t(eF(r.current)), r.current = null);
  }, [t]), null;
}, aF = /* @__PURE__ */ x.memo(iF), oF = ["key"], lF = ["onMouseEnter", "onClick", "onMouseLeave"], uF = ["id"], sF = ["id"];
function qi() {
  return qi = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, qi.apply(null, arguments);
}
function yf(e, t) {
  if (e == null) return {};
  var r, n, a = cF(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]);
  }
  return a;
}
function cF(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
function S1(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Ye(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? S1(Object(r), !0).forEach(function(n) {
      fF(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : S1(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function fF(e, t, r) {
  return (t = dF(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function dF(e) {
  var t = vF(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function vF(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var ok = yP;
function hF(e) {
  var t = x.useMemo(() => Em(e.children, lo), [e.children]), r = se((n) => h8(n, e.id, t));
  return r == null ? null : /* @__PURE__ */ x.createElement(E8, {
    legendPayload: r
  });
}
function pF(e) {
  if (!(e == null || typeof e == "boolean" || typeof e == "function")) {
    if (/* @__PURE__ */ x.isValidElement(e)) {
      var t, r = (t = e.props) === null || t === void 0 ? void 0 : t.fill;
      return typeof r == "string" ? r : void 0;
    }
    var n = e.fill;
    return typeof n == "string" ? n : void 0;
  }
}
var mF = /* @__PURE__ */ x.memo((e) => {
  var t = e.dataKey, r = e.nameKey, n = e.sectors, a = e.stroke, l = e.strokeWidth, u = e.fill, c = e.name, f = e.hide, d = e.tooltipType, h = e.formatter, p = e.id, y = e.activeShape, b = pF(y), A = n.map((S) => {
    var O = S.tooltipPayload;
    return b == null || O == null ? O : O.map((C) => Ye(Ye({}, C), {}, {
      color: b,
      fill: b
    }));
  }), w = {
    dataDefinedOnItem: A,
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
      name: Za(c, t),
      hide: f,
      type: d,
      color: u,
      unit: "",
      // why doesn't Pie support unit?
      formatter: h,
      graphicalItemId: p
    }
  };
  return /* @__PURE__ */ x.createElement(_m, {
    tooltipEntrySettings: w
  });
}), yF = (e, t) => e > t ? "start" : e < t ? "end" : "middle", gF = (e, t, r) => Ft(typeof t == "function" ? t(e) : t, r, r * 0.8), xF = (e, t, r) => {
  var n = t.top, a = t.left, l = t.width, u = t.height, c = hP(l, u), f = a + Ft(e.cx, l, l / 2), d = n + Ft(e.cy, u, u / 2), h = Ft(e.innerRadius, c, 0), p = gF(r, e.outerRadius, c), y = e.maxRadius || Math.sqrt(l * l + u * u) / 2;
  return {
    cx: f,
    cy: d,
    innerRadius: h,
    outerRadius: p,
    maxRadius: y
  };
}, bF = (e, t) => {
  var r = Ot(t - e), n = Math.min(Math.abs(t - e), 360);
  return r * n;
}, wF = (e, t) => {
  if (/* @__PURE__ */ x.isValidElement(e))
    return /* @__PURE__ */ x.cloneElement(e, t);
  if (typeof e == "function")
    return e(t);
  var r = ze("recharts-pie-label-line", typeof e != "boolean" ? e.className : "");
  t.key;
  var n = yf(t, oF);
  return /* @__PURE__ */ x.createElement(pl, qi({}, n, {
    type: "linear",
    className: r
  }));
}, SF = (e, t, r) => {
  if (/* @__PURE__ */ x.isValidElement(e))
    return /* @__PURE__ */ x.cloneElement(e, t);
  var n = r;
  if (typeof e == "function" && (n = e(t), /* @__PURE__ */ x.isValidElement(n)))
    return n;
  var a = ze("recharts-pie-label-text", XE(e));
  return /* @__PURE__ */ x.createElement(df, qi({}, t, {
    alignmentBaseline: "middle",
    className: a
  }), n);
};
function AF(e) {
  var t = e.sectors, r = e.props, n = e.showLabels, a = r.label, l = r.labelLine, u = r.dataKey;
  if (!n || !a || !t)
    return null;
  var c = ar(r), f = Ui(a), d = Ui(l), h = typeof a == "object" && "offsetRadius" in a && typeof a.offsetRadius == "number" && a.offsetRadius || 20, p = t.map((y, b) => {
    var A = (y.startAngle + y.endAngle) / 2, w = ct(y.cx, y.cy, y.outerRadius + h, A), S = Ye(Ye(Ye(Ye({}, c), y), {}, {
      // @ts-expect-error customLabelProps is contributing unknown props
      stroke: "none"
    }, f), {}, {
      index: b,
      textAnchor: yF(w.x, y.cx)
    }, w), O = Ye(Ye(Ye(Ye({}, c), y), {}, {
      // @ts-expect-error customLabelLineProps is contributing unknown props
      fill: "none",
      // @ts-expect-error customLabelLineProps is contributing unknown props
      stroke: y.fill
    }, d), {}, {
      index: b,
      points: [ct(y.cx, y.cy, y.outerRadius, A), w],
      key: "line"
    });
    return /* @__PURE__ */ x.createElement(or, {
      zIndex: ft.label,
      key: "label-".concat(y.startAngle, "-").concat(y.endAngle, "-").concat(y.midAngle, "-").concat(b)
    }, /* @__PURE__ */ x.createElement(at, null, l && wF(l, O), SF(a, S, $e(y, u))));
  });
  return /* @__PURE__ */ x.createElement(at, {
    className: "recharts-pie-labels"
  }, p);
}
function PF(e) {
  var t = e.sectors, r = e.props, n = e.showLabels, a = r.label;
  return typeof a == "object" && a != null && "position" in a ? /* @__PURE__ */ x.createElement(Am, {
    label: a
  }) : /* @__PURE__ */ x.createElement(AF, {
    sectors: t,
    props: r,
    showLabels: n
  });
}
function OF(e) {
  var t = e.sectors, r = e.activeShape, n = e.inactiveShape, a = e.allOtherPieProps, l = e.shape, u = e.id, c = e.animationElapsedTime, f = e.isAnimating, d = e.isEntrance, h = se(ui), p = se(mm), y = se(bE), b = a.onMouseEnter, A = a.onClick, w = a.onMouseLeave, S = yf(a, lF), O = Cm(b, a.dataKey, u), C = Im(w), I = jm(A, a.dataKey, u);
  return t == null || t.length === 0 ? null : /* @__PURE__ */ x.createElement(x.Fragment, null, t.map((k, T) => {
    if ((k == null ? void 0 : k.startAngle) === 0 && (k == null ? void 0 : k.endAngle) === 0 && t.length !== 1) return null;
    var E = y == null || y === u, $ = String(T) === h && (p == null || a.dataKey === p) && E, F = h ? n : null, U = r && $ ? r : F, H = Ye(Ye({}, k), {}, {
      stroke: k.stroke,
      tabIndex: -1,
      index: T,
      isActive: $,
      animationElapsedTime: c,
      isAnimating: f,
      isEntrance: d,
      [YA]: T,
      [qA]: u
    });
    return /* @__PURE__ */ x.createElement(at, qi({
      key: "sector-".concat(k == null ? void 0 : k.startAngle, "-").concat(k == null ? void 0 : k.endAngle, "-").concat(k.midAngle, "-").concat(T),
      tabIndex: -1,
      className: "recharts-pie-sector"
    }, Ic(S, k, T), {
      onMouseEnter: O(k, T),
      onMouseLeave: C(k, T),
      onClick: I(k, T)
    }), /* @__PURE__ */ x.createElement(km, {
      option: U ?? l,
      DefaultShape: ok,
      shapeProps: H
    }));
  }));
}
function EF(e) {
  var t, r = e.pieSettings, n = e.displayedData, a = e.cells, l = e.offset, u = r.cornerRadius, c = r.startAngle, f = r.endAngle, d = r.dataKey, h = r.nameKey, p = r.tooltipType, y = Math.abs(r.minAngle), b = bF(c, f), A = Math.abs(b), w = n.length <= 1 ? 0 : (t = r.paddingAngle) !== null && t !== void 0 ? t : 0, S = n.filter((F) => $e(F, d, 0) !== 0).length, O = (A >= 360 ? S : S - 1) * w, C = n.reduce((F, U) => {
    var H = $e(U, d, 0);
    return F + (ie(H) ? H : 0);
  }, 0), I = y > 0 && C > 0 && n.some((F) => {
    var U = $e(F, d, 0), H = (ie(U) ? U : 0) / C;
    return U !== 0 && H * A < y;
  }), k = I ? y : 0, T = A - S * k - O, E;
  if (C > 0) {
    var $;
    E = n.map((F, U) => {
      var H = $e(F, d, 0), G = $e(F, h, U), W = xF(r, l, F), ne = (ie(H) ? H : 0) / C, re, le = Ye(Ye({}, F), a && a[U] && a[U].props), fe = le != null && "fill" in le && typeof le.fill == "string" ? le.fill : r.fill;
      U ? re = $.endAngle + Ot(b) * w * (H !== 0 ? 1 : 0) : re = c;
      var ae = re + Ot(b) * ((H !== 0 ? k : 0) + ne * T), K = (re + ae) / 2, te = (W.innerRadius + W.outerRadius) / 2, Y = [{
        name: G,
        value: H,
        payload: le,
        dataKey: d,
        type: p,
        color: fe,
        fill: fe,
        graphicalItemId: r.id
      }], D = ct(W.cx, W.cy, te, K);
      return $ = Ye(Ye(Ye(Ye({}, r.presentationProps), {}, {
        percent: ne,
        cornerRadius: typeof u == "string" ? parseFloat(u) : u,
        name: G,
        tooltipPayload: Y,
        midAngle: K,
        middleRadius: te,
        tooltipPosition: D
      }, le), W), {}, {
        value: H,
        dataKey: d,
        startAngle: re,
        endAngle: ae,
        payload: le,
        paddingAngle: H !== 0 ? Ot(b) * w : 0
      }), $;
    });
  }
  return E;
}
function kF(e) {
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
  return /* @__PURE__ */ x.createElement(Q4, {
    value: t ? a : void 0
  }, n);
}
var CF = (e, t) => {
  if (e == null) return [];
  var r = [], n = e.find((l) => l.status !== "removed"), a = n ? n.next.startAngle : 0;
  return e.forEach((l, u) => {
    if (l.status !== "removed") {
      var c = u > 0 ? rn(l.next, "paddingAngle", 0) : 0;
      if (l.status === "matched") {
        var f = nt(l.prev.endAngle - l.prev.startAngle, l.next.endAngle - l.next.startAngle, t), d = Ye(Ye({}, l.next), {}, {
          startAngle: a + c,
          endAngle: a + f + c
        });
        r.push(d), a = d.endAngle;
      } else {
        var h = nt(0, l.next.endAngle - l.next.startAngle, t), p = Ye(Ye({}, l.next), {}, {
          startAngle: a + c,
          endAngle: a + h + c
        });
        r.push(p), a = p.endAngle;
      }
    }
  }), r;
};
function IF(e) {
  var t, r, n, a, l = e.props, u = e.previousSectorsRef, c = e.id, f = l.sectors, d = l.activeShape, h = l.inactiveShape, p = l.animationInterpolateFn, y = Dm(l.onAnimationStart, l.onAnimationEnd), b = y.isAnimating, A = y.handleAnimationStart, w = y.handleAnimationEnd, S = lM();
  if (S == null) return null;
  var O = f[0];
  return /* @__PURE__ */ x.createElement(kF, {
    showLabels: !b,
    sectors: f
  }, /* @__PURE__ */ x.createElement($m, {
    animationInput: l,
    animationIdPrefix: "recharts-pie-",
    items: f,
    previousItemsRef: u,
    isAnimationActive: l.isAnimationActive,
    animationBegin: l.animationBegin,
    animationDuration: l.animationDuration,
    animationEasing: l.animationEasing,
    onAnimationStart: A,
    onAnimationEnd: w,
    animationInterpolateFn: p,
    animationMatchBy: l.animationMatchBy,
    layout: S
  }, (C, I, k) => /* @__PURE__ */ x.createElement(at, null, /* @__PURE__ */ x.createElement(OF, {
    sectors: C,
    activeShape: d,
    inactiveShape: h,
    allOtherPieProps: l,
    shape: l.shape,
    id: c,
    animationElapsedTime: I,
    isAnimating: b || I < 1,
    isEntrance: k
  }))), /* @__PURE__ */ x.createElement(PF, {
    showLabels: !b,
    sectors: f,
    props: l
  }), /* @__PURE__ */ x.createElement(R4, {
    cx: (t = O == null ? void 0 : O.cx) !== null && t !== void 0 ? t : 0,
    cy: (r = O == null ? void 0 : O.cy) !== null && r !== void 0 ? r : 0,
    innerRadius: (n = O == null ? void 0 : O.innerRadius) !== null && n !== void 0 ? n : 0,
    outerRadius: (a = O == null ? void 0 : O.outerRadius) !== null && a !== void 0 ? a : 0,
    startAngle: l.startAngle,
    endAngle: l.endAngle,
    clockWise: !1
  }, l.children));
}
var jF = {
  animationBegin: 400,
  animationDuration: 1500,
  animationEasing: "ease",
  animationInterpolateFn: CF,
  animationMatchBy: Mm,
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
  shape: ok,
  startAngle: 0,
  stroke: "#fff",
  zIndex: ft.area
};
function _F(e) {
  var t = e.id, r = yf(e, uF), n = e.hide, a = e.className, l = e.rootTabIndex, u = x.useMemo(() => Em(e.children, lo), [e.children]), c = se((h) => p8(h, t, u)), f = x.useRef(null), d = ze("recharts-pie", a);
  return n || c == null ? (f.current = null, /* @__PURE__ */ x.createElement(at, {
    tabIndex: l,
    className: d
  })) : /* @__PURE__ */ x.createElement(or, {
    zIndex: e.zIndex
  }, /* @__PURE__ */ x.createElement(mF, {
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
  }), /* @__PURE__ */ x.createElement(at, {
    tabIndex: l,
    className: d
  }, /* @__PURE__ */ x.createElement(IF, {
    props: Ye(Ye({}, r), {}, {
      sectors: c
    }),
    previousSectorsRef: f,
    id: t
  })));
}
function TF(e) {
  var t = Ut(e, jF), r = t.id, n = yf(t, sF), a = ar(n);
  return /* @__PURE__ */ x.createElement(Rm, {
    id: r,
    type: "pie"
  }, (l) => /* @__PURE__ */ x.createElement(x.Fragment, null, /* @__PURE__ */ x.createElement(aF, {
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
  }), /* @__PURE__ */ x.createElement(hF, qi({}, n, {
    id: l
  })), /* @__PURE__ */ x.createElement(_F, qi({}, n, {
    id: l
  }))));
}
var Lm = TF;
Lm.displayName = "Pie";
var MF = ["points"];
function A1(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Vv(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? A1(Object(r), !0).forEach(function(n) {
      NF(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : A1(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function NF(e, t, r) {
  return (t = DF(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function DF(e) {
  var t = $F(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function $F(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function yc() {
  return yc = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, yc.apply(null, arguments);
}
function RF(e, t) {
  if (e == null) return {};
  var r, n, a = LF(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]);
  }
  return a;
}
function LF(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
function zF(e) {
  var t = e.option, r = e.dotProps, n = e.className;
  if (/* @__PURE__ */ x.isValidElement(t))
    return /* @__PURE__ */ x.cloneElement(t, r);
  if (typeof t == "function")
    return t(r);
  var a = ze(n, typeof t != "boolean" ? t.className : ""), l = r ?? {};
  l.points;
  var u = RF(l, MF);
  return /* @__PURE__ */ x.createElement(VE, yc({}, u, {
    className: a
  }));
}
function BF(e, t) {
  return e == null ? !1 : t ? !0 : e.length === 1;
}
function FF(e) {
  var t = e.points, r = e.dot, n = e.className, a = e.dotClassName, l = e.dataKey, u = e.baseProps, c = e.needClip, f = e.clipPathId, d = e.zIndex, h = d === void 0 ? ft.scatter : d;
  if (!BF(t, r))
    return null;
  var p = JE(r), y = yj(r), b = t.map((w, S) => {
    var O, C, I = Vv(Vv(Vv({
      r: 3
    }, u), y), {}, {
      index: S,
      cx: (O = w.x) !== null && O !== void 0 ? O : void 0,
      cy: (C = w.y) !== null && C !== void 0 ? C : void 0,
      dataKey: l,
      value: w.value,
      payload: w.payload,
      points: t
    });
    return /* @__PURE__ */ x.createElement(zF, {
      key: "dot-".concat(S),
      option: r,
      dotProps: I,
      className: a
    });
  }), A = {};
  return c && f != null && (A.clipPath = "url(#clipPath-".concat(p ? "" : "dots-").concat(f, ")")), /* @__PURE__ */ x.createElement(or, {
    zIndex: h
  }, /* @__PURE__ */ x.createElement(at, yc({
    className: n
  }, A), b));
}
function P1(e, t) {
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
    t % 2 ? P1(Object(r), !0).forEach(function(n) {
      WF(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : P1(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function WF(e, t, r) {
  return (t = UF(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function UF(e) {
  var t = KF(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function KF(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var lk = 0, HF = {
  xAxis: {},
  yAxis: {},
  zAxis: {}
}, uk = Kt({
  name: "cartesianAxis",
  initialState: HF,
  reducers: {
    addXAxis: {
      reducer(e, t) {
        e.xAxis[t.payload.id] = Ne(t.payload);
      },
      prepare: He()
    },
    replaceXAxis: {
      reducer(e, t) {
        var r = t.payload, n = r.prev, a = r.next;
        e.xAxis[n.id] !== void 0 && (n.id !== a.id && delete e.xAxis[n.id], e.xAxis[a.id] = Ne(a));
      },
      prepare: He()
    },
    removeXAxis: {
      reducer(e, t) {
        delete e.xAxis[t.payload.id];
      },
      prepare: He()
    },
    addYAxis: {
      reducer(e, t) {
        e.yAxis[t.payload.id] = Ne(t.payload);
      },
      prepare: He()
    },
    replaceYAxis: {
      reducer(e, t) {
        var r = t.payload, n = r.prev, a = r.next;
        e.yAxis[n.id] !== void 0 && (n.id !== a.id && delete e.yAxis[n.id], e.yAxis[a.id] = Ne(a));
      },
      prepare: He()
    },
    removeYAxis: {
      reducer(e, t) {
        delete e.yAxis[t.payload.id];
      },
      prepare: He()
    },
    addZAxis: {
      reducer(e, t) {
        e.zAxis[t.payload.id] = Ne(t.payload);
      },
      prepare: He()
    },
    replaceZAxis: {
      reducer(e, t) {
        var r = t.payload, n = r.prev, a = r.next;
        e.zAxis[n.id] !== void 0 && (n.id !== a.id && delete e.zAxis[n.id], e.zAxis[a.id] = Ne(a));
      },
      prepare: He()
    },
    removeZAxis: {
      reducer(e, t) {
        delete e.zAxis[t.payload.id];
      },
      prepare: He()
    },
    updateYAxisWidth(e, t) {
      var r = t.payload, n = r.id, a = r.width, l = e.yAxis[n];
      if (l) {
        var u, c = l.widthHistory || [];
        if (c.length === 3 && c[0] === c[2] && a === c[1] && a !== l.width && Math.abs(a - ((u = c[0]) !== null && u !== void 0 ? u : 0)) <= 1)
          return;
        var f = [...c, a].slice(-3);
        e.yAxis[n] = Ss(Ss({}, l), {}, {
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
        e.xAxis[n] = Ss(Ss({}, l), {}, {
          height: a,
          heightHistory: f
        });
      }
    }
  }
}), Ur = uk.actions, VF = Ur.addXAxis, GF = Ur.replaceXAxis, YF = Ur.removeXAxis, qF = Ur.addYAxis, XF = Ur.replaceYAxis, QF = Ur.removeYAxis;
Ur.addZAxis;
Ur.replaceZAxis;
Ur.removeZAxis;
var ZF = Ur.updateYAxisWidth, JF = Ur.updateXAxisHeight, e5 = uk.reducer, t5 = R([gt], (e) => ({
  top: e.top,
  bottom: e.bottom,
  left: e.left,
  right: e.right
})), r5 = R([t5, Cn, In], (e, t, r) => {
  if (!(!e || t == null || r == null))
    return {
      x: e.left,
      y: e.top,
      width: Math.max(0, t - e.left - e.right),
      height: Math.max(0, r - e.top - e.bottom)
    };
}), zm = () => se(r5), n5 = () => se(C3);
function O1(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Gv(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? O1(Object(r), !0).forEach(function(n) {
      i5(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : O1(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function i5(e, t, r) {
  return (t = a5(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function a5(e) {
  var t = o5(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function o5(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var l5 = (e) => {
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
  }, f = Gv(Gv(Gv({}, c), Ui(a)), qh(a)), d;
  return /* @__PURE__ */ x.isValidElement(a) ? d = /* @__PURE__ */ x.cloneElement(a, f) : typeof a == "function" ? d = a(f) : d = /* @__PURE__ */ x.createElement(VE, f), /* @__PURE__ */ x.createElement(at, {
    className: "recharts-active-dot",
    clipPath: u
  }, d);
};
function E1(e) {
  var t = e.points, r = e.mainColor, n = e.activeDot, a = e.itemDataKey, l = e.clipPath, u = e.zIndex, c = u === void 0 ? ft.activeDot : u, f = se(ui), d = n5();
  if (t == null || d == null)
    return null;
  var h = t.find((p) => d.includes(p.payload));
  return Ze(h) ? null : /* @__PURE__ */ x.createElement(or, {
    zIndex: c
  }, /* @__PURE__ */ x.createElement(l5, {
    point: h,
    childIndex: Number(f),
    mainColor: r,
    dataKey: a,
    activeDot: n,
    clipPath: l
  }));
}
function u5(e, t) {
  return d5(e) || f5(e, t) || c5(e, t) || s5();
}
function s5() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function c5(e, t) {
  if (e) {
    if (typeof e == "string") return k1(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? k1(e, t) : void 0;
  }
}
function k1(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function f5(e, t) {
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
function d5(e) {
  if (Array.isArray(e)) return e;
}
var C1 = (e, t, r) => {
  var n = r ?? e;
  if (!Ze(n))
    return Ft(n, t, 0);
}, v5 = (e, t, r) => {
  var n = {}, a = e.filter(Qc), l = e.filter((d) => d.stackId == null), u = a.reduce((d, h) => {
    var p = d[h.stackId];
    return p == null && (p = []), p.push(h), d[h.stackId] = p, d;
  }, n), c = Object.entries(u).map((d) => {
    var h, p = u5(d, 2), y = p[0], b = p[1], A = b.map((S) => S.dataKey), w = C1(t, r, (h = b[0]) === null || h === void 0 ? void 0 : h.barSize);
    return {
      stackId: y,
      dataKeys: A,
      barSize: w
    };
  }), f = l.map((d) => {
    var h = [d.dataKey].filter((y) => y != null), p = C1(t, r, d.barSize);
    return {
      stackId: void 0,
      dataKeys: h,
      barSize: p
    };
  });
  return [...c, ...f];
};
function I1(e, t) {
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
    t % 2 ? I1(Object(r), !0).forEach(function(n) {
      h5(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : I1(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function h5(e, t, r) {
  return (t = p5(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function p5(e) {
  var t = m5(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function m5(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function y5(e, t, r, n, a) {
  var l, u = n.length;
  if (!(u < 1)) {
    var c = Ft(e, r, 0, !0), f, d = [];
    if (Oe((l = n[0]) === null || l === void 0 ? void 0 : l.barSize)) {
      var h = !1, p = r / u, y = n.reduce((C, I) => C + (I.barSize || 0), 0);
      y += (u - 1) * c, y >= r && (y -= (u - 1) * c, c = 0), y >= r && p > 0 && (h = !0, p *= 0.9, y = u * p);
      var b = Math.round((r - y) / 2), A = {
        offset: b - c,
        size: 0
      };
      f = n.reduce((C, I) => {
        var k, T = {
          stackId: I.stackId,
          dataKeys: I.dataKeys,
          position: {
            offset: A.offset + A.size + c,
            size: h ? p : (k = I.barSize) !== null && k !== void 0 ? k : 0
          }
        }, E = [...C, T];
        return A = T.position, E;
      }, d);
    } else {
      var w = Ft(t, r, 0, !0);
      r - 2 * w - (u - 1) * c <= 0 && (c = 0);
      var S = (r - 2 * w - (u - 1) * c) / u;
      S > 1 && (S = Math.round(S));
      var O = Oe(a) ? Math.min(S, a) : S;
      f = n.reduce((C, I, k) => [...C, {
        stackId: I.stackId,
        dataKeys: I.dataKeys,
        position: {
          offset: w + u * (S - O) / 2 + (O + c) * k,
          size: O
        }
      }], d);
    }
    return f;
  }
}
var g5 = (e, t, r, n, a, l, u) => {
  var c = Ze(u) ? t : u, f = y5(r, n, a !== l ? a : l, e, c);
  return a !== l && f != null && (f = f.map((d) => As(As({}, d), {}, {
    position: As(As({}, d.position), {}, {
      offset: d.position.offset - a / 2
    })
  }))), f;
}, x5 = (e, t) => {
  var r = Xc(t);
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
}, b5 = (e, t) => {
  if (!(e == null || t == null)) {
    var r = e.find((n) => n.stackId === t.stackId && t.dataKey != null && n.dataKeys.includes(t.dataKey));
    if (r != null)
      return r.position;
  }
};
function w5(e, t) {
  return e && typeof e == "object" && "zIndex" in e && typeof e.zIndex == "number" && Oe(e.zIndex) ? e.zIndex : t;
}
var sk = (e) => {
  var t = e.chartData, r = Fe(), n = Ht();
  return x.useEffect(() => n ? () => {
  } : (r(Ww(t)), () => {
    r(Ww(void 0));
  }), [t, r, n]), null;
}, j1 = {
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
}, ck = Kt({
  name: "brush",
  initialState: j1,
  reducers: {
    setBrushSettings(e, t) {
      return t.payload == null ? j1 : t.payload;
    }
  }
});
ck.actions.setBrushSettings;
var S5 = ck.reducer;
function A5(e) {
  return (e % 180 + 180) % 180;
}
var P5 = function(t) {
  var r = t.width, n = t.height, a = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0, l = A5(a), u = l * Math.PI / 180, c = Math.atan(n / r), f = u > c && u < Math.PI - c ? n / Math.sin(u) : r / Math.cos(u);
  return Math.abs(f);
}, O5 = {
  dots: [],
  areas: [],
  lines: []
}, fk = Kt({
  name: "referenceElements",
  initialState: O5,
  reducers: {
    addDot: (e, t) => {
      e.dots.push(t.payload);
    },
    removeDot: (e, t) => {
      var r = Sr(e).dots.findIndex((n) => n === t.payload);
      r !== -1 && e.dots.splice(r, 1);
    },
    addArea: (e, t) => {
      e.areas.push(t.payload);
    },
    removeArea: (e, t) => {
      var r = Sr(e).areas.findIndex((n) => n === t.payload);
      r !== -1 && e.areas.splice(r, 1);
    },
    addLine: (e, t) => {
      e.lines.push(Ne(t.payload));
    },
    removeLine: (e, t) => {
      var r = Sr(e).lines.findIndex((n) => n === t.payload);
      r !== -1 && e.lines.splice(r, 1);
    }
  }
}), so = fk.actions;
so.addDot;
so.removeDot;
so.addArea;
so.removeArea;
so.addLine;
so.removeLine;
var E5 = fk.reducer;
function k5(e, t) {
  return _5(e) || j5(e, t) || I5(e, t) || C5();
}
function C5() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function I5(e, t) {
  if (e) {
    if (typeof e == "string") return _1(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? _1(e, t) : void 0;
  }
}
function _1(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function j5(e, t) {
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
function _5(e) {
  if (Array.isArray(e)) return e;
}
var T5 = /* @__PURE__ */ x.createContext(void 0), M5 = (e) => {
  var t = e.children, r = x.useState("".concat(bl("recharts"), "-clip")), n = k5(r, 1), a = n[0], l = zm();
  if (l == null)
    return null;
  var u = l.x, c = l.y, f = l.width, d = l.height;
  return /* @__PURE__ */ x.createElement(T5.Provider, {
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
function N5() {
}
function T1(e) {
  if (!e || typeof e != "object") return !1;
  const t = Object.getPrototypeOf(e);
  return t === null || t === Object.prototype || Object.getPrototypeOf(t) === null ? Object.prototype.toString.call(e) === "[object Object]" : !1;
}
function D5(e, t, r) {
  return vl(e, t, void 0, void 0, void 0, void 0, r);
}
function vl(e, t, r, n, a, l, u) {
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
      return gl(e, t, l, u);
  }
  return gl(e, t, l, u);
}
function gl(e, t, r, n) {
  if (Object.is(e, t)) return !0;
  let a = Wa(e), l = Wa(t);
  if (a === "[object Arguments]" && (a = Cs), l === "[object Arguments]" && (l = Cs), a !== l) return !1;
  switch (a) {
    case Qh:
      return e.toString() === t.toString();
    case Zh:
      return hl(e.valueOf(), t.valueOf());
    case Jh:
    case HS:
    case KS:
      return Object.is(e.valueOf(), t.valueOf());
    case WS:
      return e.source === t.source && e.flags === t.flags;
    case v_:
      return e === t;
  }
  r = r ?? /* @__PURE__ */ new Map();
  const u = r.get(e), c = r.get(t);
  if (u != null && c != null) return u === t;
  r.set(e, t), r.set(t, e);
  try {
    switch (a) {
      case VS:
        if (e.size !== t.size) return !1;
        for (const [f, d] of e.entries()) if (!t.has(f) || !vl(d, t.get(f), f, e, t, r, n)) return !1;
        return !0;
      case GS: {
        if (e.size !== t.size) return !1;
        const f = Array.from(e.values()), d = Array.from(t.values());
        for (let h = 0; h < f.length; h++) {
          const p = f[h], y = d.findIndex((b) => vl(p, b, void 0, e, t, r, n));
          if (y === -1) return !1;
          d.splice(y, 1);
        }
        return !0;
      }
      case YS:
      case QS:
      case ZS:
      case JS:
      case eA:
      case p_:
      case tA:
      case rA:
      case nA:
      case m_:
      case iA:
      case aA:
        if (ih(e) !== ih(t) || e.length !== t.length) return !1;
        for (let f = 0; f < e.length; f++) if (!vl(e[f], t[f], f, e, t, r, n)) return !1;
        return !0;
      case qS:
        return e.byteLength !== t.byteLength ? !1 : gl(new Uint8Array(e), new Uint8Array(t), r, n);
      case XS:
        return e.byteLength !== t.byteLength || e.byteOffset !== t.byteOffset ? !1 : gl(new Uint8Array(e), new Uint8Array(t), r, n);
      case h_:
        return e.name === t.name && e.message === t.message;
      case Cs: {
        if (!(gl(e.constructor, t.constructor, r, n) || T1(e) && T1(t))) return !1;
        const f = [...Object.keys(e), ...nh(e)], d = [...Object.keys(t), ...nh(t)];
        if (f.length !== d.length) return !1;
        for (let h = 0; h < f.length; h++) {
          const p = f[h], y = e[p];
          if (!Object.hasOwn(t, p)) return !1;
          const b = t[p];
          if (!vl(y, b, p, e, t, r, n)) return !1;
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
function $5(e, t) {
  return D5(e, t, N5);
}
function dk(e, t) {
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
function R5(e, t, r) {
  var n = {
    width: e.width + t.width,
    height: e.height + t.height
  };
  return P5(n, r);
}
function L5(e, t, r) {
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
function z5(e, t) {
  return dk(e, t + 1);
}
function B5(e, t, r, n, a) {
  for (var l = (n || []).slice(), u = t.start, c = t.end, f = 0, d = 1, h = u, p = function() {
    var A = n == null ? void 0 : n[f];
    if (A === void 0)
      return {
        v: dk(n, d)
      };
    var w = f, S, O = () => (S === void 0 && (S = r(A, w)), S), C = A.coordinate, I = f === 0 || _l(e, C, O, h, c);
    I || (f = 0, h = u, d += 1), I && (h = C + e * (O() / 2 + a), f += d);
  }, y; d <= l.length; )
    if (y = p(), y) return y.v;
  return [];
}
function F5(e, t, r, n, a) {
  var l = (n || []).slice(), u = l.length;
  if (u === 0)
    return [];
  for (var c = t.start, f = t.end, d = 1; d <= u; d++) {
    for (var h = (u - 1) % d, p = c, y = !0, b = function() {
      var k = n[w];
      if (k == null)
        return 0;
      var T = w, E, $ = () => (E === void 0 && (E = r(k, T)), E), F = k.coordinate, U = w === h || _l(e, F, $, p, f);
      if (!U)
        return y = !1, 1;
      U && (p = F + e * ($() / 2 + a));
    }, A, w = h; w < u && (A = b(), !(A !== 0 && A === 1)); w += d)
      ;
    if (y) {
      for (var S = [], O = h; O < u; O += d) {
        var C = n[O];
        C != null && S.push(C);
      }
      return S;
    }
  }
  return [];
}
function M1(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function zt(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? M1(Object(r), !0).forEach(function(n) {
      W5(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : M1(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function W5(e, t, r) {
  return (t = U5(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function U5(e) {
  var t = K5(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function K5(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function H5(e, t, r, n, a) {
  for (var l = (n || []).slice(), u = l.length, c = t.start, f = t.end, d = function(y) {
    var b = l[y];
    if (b == null)
      return 1;
    var A = b, w, S = () => (w === void 0 && (w = r(b, y)), w);
    if (y === u - 1) {
      var O = e * (A.coordinate + e * S() / 2 - f);
      l[y] = A = zt(zt({}, A), {}, {
        tickCoord: O > 0 ? A.coordinate - O * e : A.coordinate
      });
    } else
      l[y] = A = zt(zt({}, A), {}, {
        tickCoord: A.coordinate
      });
    if (A.tickCoord != null) {
      var C = _l(e, A.tickCoord, S, c, f);
      C && (f = A.tickCoord - e * (S() / 2 + a), l[y] = zt(zt({}, A), {}, {
        isShow: !0
      }));
    }
  }, h = u - 1; h >= 0; h--)
    d(h);
  return l;
}
function V5(e, t, r, n, a, l) {
  var u = (n || []).slice(), c = u.length, f = t.start, d = t.end;
  if (l) {
    var h = n[c - 1];
    if (h != null) {
      var p = r(h, c - 1), y = e * (h.coordinate + e * p / 2 - d);
      if (u[c - 1] = h = zt(zt({}, h), {}, {
        tickCoord: y > 0 ? h.coordinate - y * e : h.coordinate
      }), h.tickCoord != null) {
        var b = _l(e, h.tickCoord, () => p, f, d);
        b && (d = h.tickCoord - e * (p / 2 + a), u[c - 1] = zt(zt({}, h), {}, {
          isShow: !0
        }));
      }
    }
  }
  for (var A = l ? c - 1 : c, w = function(C) {
    var I = u[C];
    if (I == null)
      return 1;
    var k = I, T, E = () => (T === void 0 && (T = r(I, C)), T);
    if (C === 0) {
      var $ = e * (k.coordinate - e * E() / 2 - f);
      u[C] = k = zt(zt({}, k), {}, {
        tickCoord: $ < 0 ? k.coordinate - $ * e : k.coordinate
      });
    } else
      u[C] = k = zt(zt({}, k), {}, {
        tickCoord: k.coordinate
      });
    if (k.tickCoord != null) {
      var F = _l(e, k.tickCoord, E, f, d);
      F && (f = k.tickCoord + e * (E() / 2 + a), u[C] = zt(zt({}, k), {}, {
        isShow: !0
      }));
    }
  }, S = 0; S < A; S++)
    w(S);
  return u;
}
function Bm(e, t, r) {
  var n = e.tick, a = e.ticks, l = e.viewBox, u = e.minTickGap, c = e.orientation, f = e.interval, d = e.tickFormatter, h = e.unit, p = e.angle;
  if (!a || !a.length || !n)
    return [];
  if (ie(f) || zl.isSsr) {
    var y;
    return (y = z5(a, ie(f) ? f : 0)) !== null && y !== void 0 ? y : [];
  }
  var b = [], A = c === "top" || c === "bottom" ? "width" : "height", w = h && A === "width" ? yl(h, {
    fontSize: t,
    letterSpacing: r
  }) : {
    width: 0,
    height: 0
  }, S = (T, E) => {
    var $ = typeof d == "function" ? d(T.value, E) : T.value;
    return A === "width" ? R5(yl($, {
      fontSize: t,
      letterSpacing: r
    }), w, p) : yl($, {
      fontSize: t,
      letterSpacing: r
    })[A];
  }, O = a[0], C = a[1], I = a.length >= 2 && O != null && C != null ? Ot(C.coordinate - O.coordinate) : 1, k = L5(l, I, A);
  return f === "equidistantPreserveStart" ? B5(I, k, S, a, u) : f === "equidistantPreserveEnd" ? F5(I, k, S, a, u) : (f === "preserveStart" || f === "preserveStartEnd" ? b = V5(I, k, S, a, u, f === "preserveStartEnd") : b = H5(I, k, S, a, u), b.filter((T) => T.isShow));
}
var G5 = (e) => {
  var t = e.ticks, r = e.label, n = e.labelGapWithTick, a = n, l = e.tickSize, u = l === void 0 ? 0 : l, c = e.tickMargin, f = c === void 0 ? 0 : c, d = 0;
  if (t) {
    Array.from(t).forEach((b) => {
      if (b) {
        var A = b.getBoundingClientRect();
        A.width > d && (d = A.width);
      }
    });
    var h = r ? r.getBoundingClientRect().width : 0, p = u + f, y = d + p + h + (r ? a : 0);
    return Math.round(y);
  }
  return 0;
}, Y5 = (e) => {
  var t = e.ticks, r = e.label, n = e.labelGapWithTick, a = n, l = e.tickSize, u = l === void 0 ? 0 : l, c = e.tickMargin, f = c === void 0 ? 0 : c, d = 0;
  if (t) {
    Array.from(t).forEach((b) => {
      if (b) {
        var A = b.getBoundingClientRect();
        A.height > d && (d = A.height);
      }
    });
    var h = r ? r.getBoundingClientRect().height : 0, p = u + f, y = d + p + h + (r ? a : 0);
    return Math.round(y);
  }
  return 0;
}, q5 = {
  xAxis: {},
  yAxis: {}
}, vk = Kt({
  name: "renderedTicks",
  initialState: q5,
  reducers: {
    setRenderedTicks: (e, t) => {
      var r = t.payload, n = r.axisType, a = r.axisId, l = r.ticks;
      e[n][a] = Ne(l);
    },
    removeRenderedTicks: (e, t) => {
      var r = t.payload, n = r.axisType, a = r.axisId;
      delete e[n][a];
    }
  }
}), hk = vk.actions, X5 = hk.setRenderedTicks, Q5 = hk.removeRenderedTicks, Z5 = vk.reducer, J5 = ["axisLine", "width", "height", "className", "hide", "ticks", "axisType", "axisId"];
function N1(e, t) {
  return n6(e) || r6(e, t) || t6(e, t) || e6();
}
function e6() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function t6(e, t) {
  if (e) {
    if (typeof e == "string") return D1(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? D1(e, t) : void 0;
  }
}
function D1(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function r6(e, t) {
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
function n6(e) {
  if (Array.isArray(e)) return e;
}
function i6(e, t) {
  if (e == null) return {};
  var r, n, a = a6(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]);
  }
  return a;
}
function a6(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
function Xi() {
  return Xi = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Xi.apply(null, arguments);
}
function $1(e, t) {
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
    t % 2 ? $1(Object(r), !0).forEach(function(n) {
      o6(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : $1(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function o6(e, t, r) {
  return (t = l6(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function l6(e) {
  var t = u6(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function u6(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var An = {
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
  zIndex: ft.axis
};
function s6(e) {
  var t = e.x, r = e.y, n = e.width, a = e.height, l = e.orientation, u = e.mirror, c = e.axisLine, f = e.otherSvgProps;
  if (!c)
    return null;
  var d = it(it(it({}, f), ar(c)), {}, {
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
  return /* @__PURE__ */ x.createElement("line", Xi({}, d, {
    className: ze("recharts-cartesian-axis-line", rn(c, "className"))
  }));
}
function c6(e, t, r, n, a, l, u, c, f) {
  var d, h, p, y, b, A, w = c ? -1 : 1, S = e.tickSize || u, O = ie(e.tickCoord) ? e.tickCoord : e.coordinate;
  switch (l) {
    case "top":
      d = h = e.coordinate, y = r + +!c * a, p = y - w * S, A = p - w * f, b = O;
      break;
    case "left":
      p = y = e.coordinate, h = t + +!c * n, d = h - w * S, b = d - w * f, A = O;
      break;
    case "right":
      p = y = e.coordinate, h = t + +c * n, d = h + w * S, b = d + w * f, A = O;
      break;
    default:
      d = h = e.coordinate, y = r + +c * a, p = y + w * S, A = p + w * f, b = O;
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
      y: A
    }
  };
}
function f6(e, t) {
  switch (e) {
    case "left":
      return t ? "start" : "end";
    case "right":
      return t ? "end" : "start";
    default:
      return "middle";
  }
}
function d6(e, t) {
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
function v6(e) {
  var t = e.option, r = e.tickProps, n = e.value, a, l = ze(r.className, "recharts-cartesian-axis-tick-value");
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
    typeof t != "boolean" && (u = ze(u, XE(t))), a = /* @__PURE__ */ x.createElement(df, Xi({}, r, {
      className: u
    }), n);
  }
  return a;
}
function h6(e) {
  var t = e.ticks, r = e.axisType, n = e.axisId, a = Fe(), l = x.useRef(null);
  return x.useEffect(() => {
    if (!(n == null || r == null)) {
      var u = t.map((f) => ({
        value: f.value,
        coordinate: f.coordinate,
        offset: f.offset,
        index: f.index
      })), c = l.current;
      c != null && c.axisId === n && c.axisType === r && $5(c.ticks, u) || (l.current = {
        ticks: u,
        axisId: n,
        axisType: r
      }, a(X5({
        ticks: u,
        axisId: n,
        axisType: r
      })));
    }
  }, [a, t, n, r]), x.useEffect(() => n == null || r == null ? Qi : () => {
    a(Q5({
      axisId: n,
      axisType: r
    }));
  }, [a, n, r]), null;
}
var p6 = /* @__PURE__ */ x.forwardRef((e, t) => {
  var r = e.ticks, n = r === void 0 ? [] : r, a = e.tick, l = e.tickLine, u = e.stroke, c = e.tickFormatter, f = e.unit, d = e.padding, h = e.tickTextProps, p = e.orientation, y = e.mirror, b = e.x, A = e.y, w = e.width, S = e.height, O = e.tickSize, C = e.tickMargin, I = e.fontSize, k = e.letterSpacing, T = e.getTicksConfig, E = e.events, $ = e.axisType, F = e.axisId, U = Bm(it(it({}, T), {}, {
    ticks: n
  }), I, k), H = ar(T), G = Ui(a), W = $E(H.textAnchor) ? H.textAnchor : f6(p, y), ne = d6(p, y), re = {};
  typeof l == "object" && (re = l);
  var le = it(it({}, H), {}, {
    fill: "none"
  }, re), fe = U.map((te) => it({
    entry: te
  }, c6(te, b, A, w, S, p, O, y, C))), ae = fe.map((te) => {
    var Y = te.entry, D = te.line;
    return /* @__PURE__ */ x.createElement(at, {
      className: "recharts-cartesian-axis-tick",
      key: "tick-".concat(Y.value, "-").concat(Y.coordinate, "-").concat(Y.tickCoord)
    }, l && /* @__PURE__ */ x.createElement("line", Xi({}, le, D, {
      className: ze("recharts-cartesian-axis-tick-line", rn(l, "className"))
    })));
  }), K = fe.map((te, Y) => {
    var D, V, ve = te.entry, ye = te.tick, Ae = it(it(it(it({
      verticalAnchor: ne
    }, H), {}, {
      textAnchor: W,
      stroke: "none",
      fill: u
    }, ye), {}, {
      index: Y,
      payload: ve,
      visibleTicksCount: U.length,
      tickFormatter: c,
      padding: d
    }, h), {}, {
      angle: (D = (V = h == null ? void 0 : h.angle) !== null && V !== void 0 ? V : H.angle) !== null && D !== void 0 ? D : 0
    }), Pe = it(it({}, Ae), G);
    return /* @__PURE__ */ x.createElement(at, Xi({
      className: "recharts-cartesian-axis-tick-label",
      key: "tick-label-".concat(ve.value, "-").concat(ve.coordinate, "-").concat(ve.tickCoord)
    }, Ic(E, ve, Y)), a && /* @__PURE__ */ x.createElement(v6, {
      option: a,
      tickProps: Pe,
      value: "".concat(typeof c == "function" ? c(ve.value, Y) : ve.value).concat(f || "")
    }));
  });
  return /* @__PURE__ */ x.createElement("g", {
    className: "recharts-cartesian-axis-ticks recharts-".concat($, "-ticks")
  }, /* @__PURE__ */ x.createElement(h6, {
    ticks: U,
    axisId: F,
    axisType: $
  }), K.length > 0 && /* @__PURE__ */ x.createElement(or, {
    zIndex: ft.label
  }, /* @__PURE__ */ x.createElement("g", {
    className: "recharts-cartesian-axis-tick-labels recharts-".concat($, "-tick-labels"),
    ref: t
  }, K)), ae.length > 0 && /* @__PURE__ */ x.createElement("g", {
    className: "recharts-cartesian-axis-tick-lines recharts-".concat($, "-tick-lines")
  }, ae));
}), m6 = /* @__PURE__ */ x.forwardRef((e, t) => {
  var r = e.axisLine, n = e.width, a = e.height, l = e.className, u = e.hide, c = e.ticks, f = e.axisType, d = e.axisId, h = i6(e, J5), p = x.useState(""), y = N1(p, 2), b = y[0], A = y[1], w = x.useState(""), S = N1(w, 2), O = S[0], C = S[1], I = x.useRef(null);
  x.useImperativeHandle(t, () => ({
    getCalculatedWidth: () => {
      var T;
      return G5({
        ticks: I.current,
        label: (T = e.labelRef) === null || T === void 0 ? void 0 : T.current,
        labelGapWithTick: 5,
        tickSize: e.tickSize,
        tickMargin: e.tickMargin
      });
    },
    getCalculatedHeight: () => {
      var T;
      return Y5({
        ticks: I.current,
        label: (T = e.labelRef) === null || T === void 0 ? void 0 : T.current,
        labelGapWithTick: 5,
        tickSize: e.tickSize,
        tickMargin: e.tickMargin
      });
    }
  }));
  var k = x.useCallback((T) => {
    if (T) {
      var E = T.getElementsByClassName("recharts-cartesian-axis-tick-value");
      I.current = E;
      var $ = E[0];
      if ($) {
        var F = window.getComputedStyle($), U = F.fontSize, H = F.letterSpacing;
        (U !== b || H !== O) && (A(U), C(H));
      }
    }
  }, [b, O]);
  return u || n != null && n <= 0 || a != null && a <= 0 ? null : /* @__PURE__ */ x.createElement(or, {
    zIndex: e.zIndex
  }, /* @__PURE__ */ x.createElement(at, {
    className: ze("recharts-cartesian-axis", l)
  }, /* @__PURE__ */ x.createElement(s6, {
    x: e.x,
    y: e.y,
    width: n,
    height: a,
    orientation: e.orientation,
    mirror: e.mirror,
    axisLine: r,
    otherSvgProps: ar(e)
  }), /* @__PURE__ */ x.createElement(p6, {
    ref: k,
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
  }), /* @__PURE__ */ x.createElement($4, {
    x: e.x,
    y: e.y,
    width: e.width,
    height: e.height,
    lowerWidth: e.width,
    upperWidth: e.width
  }, /* @__PURE__ */ x.createElement(V4, {
    label: e.label,
    labelRef: e.labelRef
  }), e.children)));
}), Fm = /* @__PURE__ */ x.forwardRef((e, t) => {
  var r = Ut(e, An);
  return /* @__PURE__ */ x.createElement(m6, Xi({}, r, {
    ref: t
  }));
});
Fm.displayName = "CartesianAxis";
var y6 = {
  grid: {
    stroke: "#ccc",
    fill: "none"
  }
}, pk = /* @__PURE__ */ x.createContext(y6);
pk.Provider;
var g6 = () => x.useContext(pk), x6 = ["x1", "y1", "x2", "y2", "key"], b6 = ["offset"], w6 = ["xAxisId", "yAxisId"], S6 = ["xAxisId", "yAxisId"];
function R1(e, t) {
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
    t % 2 ? R1(Object(r), !0).forEach(function(n) {
      A6(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : R1(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function A6(e, t, r) {
  return (t = P6(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function P6(e) {
  var t = O6(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function O6(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function zi() {
  return zi = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, zi.apply(null, arguments);
}
function gc(e, t) {
  if (e == null) return {};
  var r, n, a = E6(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]);
  }
  return a;
}
function E6(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
var k6 = (e) => {
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
function mk(e) {
  var t = e.option, r = e.lineItemProps, n;
  if (/* @__PURE__ */ x.isValidElement(t))
    n = /* @__PURE__ */ x.cloneElement(t, r);
  else if (typeof t == "function")
    n = t(r);
  else {
    var a, l = r.x1, u = r.y1, c = r.x2, f = r.y2, d = r.key, h = gc(r, x6), p = (a = ar(h)) !== null && a !== void 0 ? a : {};
    p.offset;
    var y = gc(p, b6), b = Array.isArray(y.strokeDasharray) ? y.strokeDasharray.join(",") : y.strokeDasharray;
    n = /* @__PURE__ */ x.createElement("line", zi({}, y, {
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
function C6(e) {
  var t = e.x, r = e.width, n = e.horizontal, a = n === void 0 ? !0 : n, l = e.horizontalPoints;
  if (!a || !l || !l.length)
    return null;
  e.xAxisId, e.yAxisId;
  var u = gc(e, w6), c = l.map((f, d) => {
    var h = Bt(Bt({}, u), {}, {
      x1: t,
      y1: f,
      x2: t + r,
      y2: f,
      key: "line-".concat(d),
      index: d
    });
    return /* @__PURE__ */ x.createElement(mk, {
      key: "line-".concat(d),
      option: a,
      lineItemProps: h
    });
  });
  return /* @__PURE__ */ x.createElement("g", {
    className: "recharts-cartesian-grid-horizontal"
  }, c);
}
function I6(e) {
  var t = e.y, r = e.height, n = e.vertical, a = n === void 0 ? !0 : n, l = e.verticalPoints;
  if (!a || !l || !l.length)
    return null;
  e.xAxisId, e.yAxisId;
  var u = gc(e, S6), c = l.map((f, d) => {
    var h = Bt(Bt({}, u), {}, {
      x1: f,
      y1: t,
      x2: f,
      y2: t + r,
      key: "line-".concat(d),
      index: d
    });
    return /* @__PURE__ */ x.createElement(mk, {
      option: a,
      lineItemProps: h,
      key: "line-".concat(d)
    });
  });
  return /* @__PURE__ */ x.createElement("g", {
    className: "recharts-cartesian-grid-vertical"
  }, c);
}
function j6(e) {
  var t = e.horizontalFill, r = e.fillOpacity, n = e.x, a = e.y, l = e.width, u = e.height, c = e.horizontalPoints, f = e.horizontal, d = f === void 0 ? !0 : f;
  if (!d || !t || !t.length || c == null)
    return null;
  var h = c.map((y) => Math.round(y + a - a)).sort((y, b) => y - b);
  a !== h[0] && h.unshift(0);
  var p = h.map((y, b) => {
    var A = h[b + 1], w = A == null, S = w ? a + u - y : A - y;
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
function _6(e) {
  var t = e.vertical, r = t === void 0 ? !0 : t, n = e.verticalFill, a = e.fillOpacity, l = e.x, u = e.y, c = e.width, f = e.height, d = e.verticalPoints;
  if (!r || !n || !n.length)
    return null;
  var h = d.map((y) => Math.round(y + l - l)).sort((y, b) => y - b);
  l !== h[0] && h.unshift(0);
  var p = h.map((y, b) => {
    var A = h[b + 1], w = A == null, S = w ? l + c - y : A - y;
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
var T6 = (e, t) => {
  var r = e.xAxis, n = e.width, a = e.height, l = e.offset;
  return KA(Bm(Bt(Bt(Bt({}, An), r), {}, {
    ticks: HA(r),
    viewBox: {
      x: 0,
      y: 0,
      width: n,
      height: a
    }
  })), l.left, l.left + l.width, t);
}, M6 = (e, t) => {
  var r = e.yAxis, n = e.width, a = e.height, l = e.offset;
  return KA(Bm(Bt(Bt(Bt({}, An), r), {}, {
    ticks: HA(r),
    viewBox: {
      x: 0,
      y: 0,
      width: n,
      height: a
    }
  })), l.top, l.top + l.height, t);
}, N6 = {
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
  zIndex: ft.grid
};
function Nh(e) {
  var t, r, n, a, l, u, c = eP(), f = tP(), d = JA(), h = Bt(Bt({}, Ut(e, N6)), {}, {
    x: ie(e.x) ? e.x : d.left,
    y: ie(e.y) ? e.y : d.top,
    width: ie(e.width) ? e.width : d.width,
    height: ie(e.height) ? e.height : d.height
  }), p = h.xAxisId, y = h.yAxisId, b = h.x, A = h.y, w = h.width, S = h.height, O = h.syncWithTicks, C = h.horizontalValues, I = h.verticalValues, k = Ht(), T = se((ae) => Iw(ae, "xAxis", p, k)), E = se((ae) => Iw(ae, "yAxis", y, k)), $ = g6(), F = {
    stroke: (t = h.stroke) !== null && t !== void 0 ? t : $.grid.stroke,
    strokeWidth: (r = h.strokeWidth) !== null && r !== void 0 ? r : $.grid.strokeWidth,
    strokeOpacity: (n = h.strokeOpacity) !== null && n !== void 0 ? n : $.grid.strokeOpacity,
    strokeDasharray: (a = h.strokeDasharray) !== null && a !== void 0 ? a : $.grid.strokeDasharray
  };
  if (!an(w) || !an(S) || !ie(b) || !ie(A))
    return null;
  var U = h.verticalCoordinatesGenerator || T6, H = h.horizontalCoordinatesGenerator || M6, G = h.horizontalPoints, W = h.verticalPoints;
  if ((!G || !G.length) && typeof H == "function") {
    var ne = C && C.length, re = H({
      yAxis: E ? Bt(Bt({}, E), {}, {
        ticks: ne ? C : E.ticks
      }) : void 0,
      width: c ?? w,
      height: f ?? S,
      offset: d
    }, ne ? !0 : O);
    Vs(Array.isArray(re), "horizontalCoordinatesGenerator should return Array but instead it returned [".concat(typeof re, "]")), Array.isArray(re) && (G = re);
  }
  if ((!W || !W.length) && typeof U == "function") {
    var le = I && I.length, fe = U({
      xAxis: T ? Bt(Bt({}, T), {}, {
        ticks: le ? I : T.ticks
      }) : void 0,
      width: c ?? w,
      height: f ?? S,
      offset: d
    }, le ? !0 : O);
    Vs(Array.isArray(fe), "verticalCoordinatesGenerator should return Array but instead it returned [".concat(typeof fe, "]")), Array.isArray(fe) && (W = fe);
  }
  return /* @__PURE__ */ x.createElement(or, {
    zIndex: h.zIndex
  }, /* @__PURE__ */ x.createElement("g", {
    className: "recharts-cartesian-grid"
  }, /* @__PURE__ */ x.createElement(k6, {
    fill: (l = h.fill) !== null && l !== void 0 ? l : $.grid.fill,
    fillOpacity: (u = h.fillOpacity) !== null && u !== void 0 ? u : $.grid.fillOpacity,
    x: h.x,
    y: h.y,
    width: h.width,
    height: h.height,
    ry: h.ry
  }), /* @__PURE__ */ x.createElement(j6, zi({}, h, {
    horizontalPoints: G
  })), /* @__PURE__ */ x.createElement(_6, zi({}, h, {
    verticalPoints: W
  })), /* @__PURE__ */ x.createElement(C6, zi({}, h, F, {
    offset: d,
    horizontalPoints: G,
    xAxis: T,
    yAxis: E
  })), /* @__PURE__ */ x.createElement(I6, zi({}, h, F, {
    offset: d,
    verticalPoints: W,
    xAxis: T,
    yAxis: E
  }))));
}
Nh.displayName = "CartesianGrid";
var D6 = {}, yk = Kt({
  name: "errorBars",
  initialState: D6,
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
}), Wm = yk.actions;
Wm.addErrorBar;
Wm.replaceErrorBar;
Wm.removeErrorBar;
var $6 = yk.reducer, R6 = ["children"];
function L6(e, t) {
  if (e == null) return {};
  var r, n, a = z6(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]);
  }
  return a;
}
function z6(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
var B6 = {
  data: [],
  xAxisId: "xAxis-0",
  yAxisId: "yAxis-0",
  dataPointFormatter: () => ({
    x: 0,
    y: 0,
    value: 0
  }),
  errorBarOffset: 0
}, F6 = /* @__PURE__ */ x.createContext(B6);
function W6(e) {
  var t = e.children, r = L6(e, R6);
  return /* @__PURE__ */ x.createElement(F6.Provider, {
    value: r
  }, t);
}
function Um(e, t) {
  var r, n, a = se((d) => _n(d, e)), l = se((d) => Tn(d, t)), u = (r = a == null ? void 0 : a.allowDataOverflow) !== null && r !== void 0 ? r : pt.allowDataOverflow, c = (n = l == null ? void 0 : l.allowDataOverflow) !== null && n !== void 0 ? n : mt.allowDataOverflow, f = u || c;
  return {
    needClip: f,
    needClipX: u,
    needClipY: c
  };
}
function gk(e) {
  var t = e.xAxisId, r = e.yAxisId, n = e.clipPathId, a = zm(), l = Um(t, r), u = l.needClipX, c = l.needClipY, f = l.needClip, d = se((I) => UO(I, t, !1)), h = se((I) => KO(I, r, !1));
  if (!f || !a)
    return null;
  var p = a.x, y = a.y, b = a.width, A = a.height, w = u && d ? Math.min(d[0], d[1]) : p - b / 2, S = c && h ? Math.min(h[0], h[1]) : y - A / 2, O = u && d ? Math.abs(d[1] - d[0]) : b * 2, C = c && h ? Math.abs(h[1] - h[0]) : A * 2;
  return /* @__PURE__ */ x.createElement("clipPath", {
    id: "clipPath-".concat(n)
  }, /* @__PURE__ */ x.createElement("rect", {
    x: w,
    y: S,
    width: O,
    height: C
  }));
}
function U6(e) {
  var t = Ui(e), r = 3, n = 2;
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
function un(e, t) {
  var r, n;
  return (r = (n = e.graphicalItems.cartesianItems.find((a) => a.id === t)) === null || n === void 0 ? void 0 : n.xAxisId) !== null && r !== void 0 ? r : lk;
}
function sn(e, t) {
  var r, n;
  return (r = (n = e.graphicalItems.cartesianItems.find((a) => a.id === t)) === null || n === void 0 ? void 0 : n.yAxisId) !== null && r !== void 0 ? r : lk;
}
var xk = (e, t, r) => li(e, "xAxis", un(e, t), r), bk = (e, t, r) => oi(e, "xAxis", un(e, t), r), wk = (e, t, r) => li(e, "yAxis", sn(e, t), r), Sk = (e, t, r) => oi(e, "yAxis", sn(e, t), r), K6 = R([_e, xk, wk, bk, Sk], (e, t, r, n, a) => ln(e, "xAxis") ? Ka(t, n, !1) : Ka(r, a, !1)), H6 = (e, t) => t, Km = R([of, H6], (e, t) => e.filter((r) => r.type === "area").find((r) => r.id === t)), Ak = (e) => {
  var t = _e(e), r = ln(t, "xAxis");
  return r ? "yAxis" : "xAxis";
}, V6 = (e, t) => {
  var r = Ak(e);
  return r === "yAxis" ? sn(e, t) : un(e, t);
}, Pk = (e, t, r) => fc(e, Ak(e), V6(e, t), r), G6 = R([Km, Pk], (e, t) => {
  var r;
  if (!(e == null || t == null)) {
    var n = e.stackId, a = Xc(e);
    if (!(n == null || a == null)) {
      var l = (r = t[n]) === null || r === void 0 ? void 0 : r.stackedData, u = l == null ? void 0 : l.find((c) => c.key === a);
      if (u != null)
        return u.map((c) => [c[0], c[1]]);
    }
  }
}), Y6 = R([Km, Pk], (e, t) => {
  if (!(e == null || e.stackId == null || t == null)) {
    var r = t[e.stackId];
    if (r != null)
      return r.graphicalItems.map((n) => n.dataKey).filter(Yt);
  }
}), q6 = R([_e, xk, wk, bk, Sk, G6, xP, K6, Km, ND, Y6], (e, t, r, n, a, l, u, c, f, d, h) => {
  var p = u.chartData, y = u.dataStartIndex, b = u.dataEndIndex;
  if (!(f == null || e !== "horizontal" && e !== "vertical" || t == null || r == null || n == null || a == null || n.length === 0 || a.length === 0 || c == null)) {
    var A = f.data, w;
    if (A && A.length > 0 ? w = A : w = p == null ? void 0 : p.slice(y, b + 1), w != null)
      return wW({
        layout: e,
        xAxis: t,
        yAxis: r,
        xAxisTicks: n,
        yAxisTicks: a,
        dataStartIndex: y,
        areaSettings: f,
        stackedData: l,
        displayedData: w,
        chartBaseValue: d,
        bandSize: c,
        stackDataKeys: h
      });
  }
}), X6 = ["animationElapsedTime", "isAnimating", "isEntrance", "layout", "isRange", "stroke", "connectNulls"], Q6 = ["id", "baseLine"];
function xl() {
  return xl = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, xl.apply(null, arguments);
}
function L1(e, t) {
  if (e == null) return {};
  var r, n, a = Z6(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]);
  }
  return a;
}
function Z6(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
function J6(e) {
  var t, r, n = e.alpha, a = e.baseLine, l = e.points, u = e.strokeWidth, c = (t = l[0]) === null || t === void 0 ? void 0 : t.x, f = (r = l[l.length - 1]) === null || r === void 0 ? void 0 : r.x;
  if (!Oe(c) || !Oe(f))
    return null;
  var d = n * Math.abs(c - f), h = Math.max(...l.map((p) => p.y || 0));
  return ie(a) ? h = Math.max(a, h) : a && Array.isArray(a) && a.length && (h = Math.max(...a.map((p) => p.y || 0), h)), ie(h) ? /* @__PURE__ */ x.createElement("rect", {
    x: c < f ? c : c - d,
    y: 0,
    width: d,
    height: Math.floor(h + (u ? parseInt("".concat(u), 10) : 1))
  }) : null;
}
function eW(e) {
  var t, r, n = e.alpha, a = e.baseLine, l = e.points, u = e.strokeWidth, c = (t = l[0]) === null || t === void 0 ? void 0 : t.y, f = (r = l[l.length - 1]) === null || r === void 0 ? void 0 : r.y;
  if (!Oe(c) || !Oe(f))
    return null;
  var d = n * Math.abs(c - f), h = Math.max(...l.map((p) => p.x || 0));
  return ie(a) ? h = Math.max(a, h) : a && Array.isArray(a) && a.length && (h = Math.max(...a.map((p) => p.x || 0), h)), ie(h) ? /* @__PURE__ */ x.createElement("rect", {
    x: 0,
    y: c < f ? c : c - d,
    width: h + (u ? parseInt("".concat(u), 10) : 1),
    height: Math.floor(d)
  }) : null;
}
function tW(e) {
  var t = e.alpha, r = e.layout, n = e.points, a = e.baseLine, l = e.strokeWidth;
  return r === "vertical" ? /* @__PURE__ */ x.createElement(eW, {
    alpha: t,
    points: n,
    baseLine: a,
    strokeWidth: l
  }) : /* @__PURE__ */ x.createElement(J6, {
    alpha: t,
    points: n,
    baseLine: a,
    strokeWidth: l
  });
}
function rW(e) {
  var t = e.animationElapsedTime, r = t === void 0 ? 1 : t, n = e.isAnimating, a = n === void 0 ? !1 : n, l = e.isEntrance, u = l === void 0 ? !1 : l, c = e.layout, f = e.isRange, d = e.stroke, h = e.connectNulls, p = L1(e, X6), y = c === "vertical" ? "vertical" : "horizontal", b = h ?? !1, A = nk(), w = p.id, S = p.baseLine, O = L1(p, Q6), C = ar(O), I = /* @__PURE__ */ x.createElement(pl, xl({}, p, {
    id: w,
    baseLine: S,
    connectNulls: b,
    stroke: "none",
    className: "recharts-area-area",
    layout: y
  })), k = d !== "none" && /* @__PURE__ */ x.createElement(pl, xl({}, C, {
    className: "recharts-area-curve",
    layout: y,
    type: p.type,
    connectNulls: b,
    fill: "none",
    stroke: d,
    points: p.points
  })), T = d !== "none" && f && Array.isArray(S) && /* @__PURE__ */ x.createElement(pl, xl({}, C, {
    className: "recharts-area-curve",
    layout: y,
    type: p.type,
    connectNulls: b,
    fill: "none",
    stroke: d,
    points: S
  }));
  if (u && (a || r < 1)) {
    var E;
    return /* @__PURE__ */ x.createElement(at, null, /* @__PURE__ */ x.createElement("defs", null, /* @__PURE__ */ x.createElement("clipPath", {
      id: A
    }, /* @__PURE__ */ x.createElement(tW, {
      alpha: r,
      points: (E = p.points) !== null && E !== void 0 ? E : [],
      baseLine: S,
      layout: y,
      strokeWidth: p.strokeWidth
    }))), /* @__PURE__ */ x.createElement(at, {
      clipPath: "url(#".concat(A, ")")
    }, I, k, T));
  }
  return /* @__PURE__ */ x.createElement(x.Fragment, null, I, k, T);
}
var nW = ["id"], iW = ["activeDot", "animationBegin", "animationDuration", "animationEasing", "connectNulls", "dot", "fill", "fillOpacity", "hide", "isAnimationActive", "legendType", "stroke", "xAxisId", "yAxisId"];
function xc() {
  return xc = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, xc.apply(null, arguments);
}
function Ok(e, t) {
  if (e == null) return {};
  var r, n, a = aW(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]);
  }
  return a;
}
function aW(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
function z1(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Xa(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? z1(Object(r), !0).forEach(function(n) {
      oW(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : z1(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function oW(e, t, r) {
  return (t = lW(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function lW(e) {
  var t = uW(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function uW(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var sW = (e, t) => e == null ? [] : t === 1 ? e.flatMap((r) => r.status === "removed" ? [] : [r.next]) : e.flatMap((r) => r.status === "matched" ? [Xa(Xa({}, r.next), {}, {
  x: nt(r.prev.x, r.next.x, t),
  y: nt(r.prev.y, r.next.y, t)
})] : r.status === "added" ? [r.next] : []), Ek = {
  activeDot: !0,
  animationBegin: 0,
  animationDuration: 1500,
  animationEasing: "ease",
  animationMatchBy: Tm,
  animationInterpolateFn: sW,
  connectNulls: !1,
  dot: !1,
  fill: "#3182bd",
  fillOpacity: 0.6,
  hide: !1,
  isAnimationActive: "auto",
  legendType: "line",
  stroke: "#3182bd",
  strokeWidth: 1,
  type: "linear",
  label: !1,
  shape: rW,
  xAxisId: 0,
  yAxisId: 0,
  zIndex: ft.area
};
function bc(e, t) {
  return e && e !== "none" ? e : t;
}
var cW = (e) => {
  var t = e.dataKey, r = e.name, n = e.stroke, a = e.fill, l = e.legendType, u = e.hide;
  return [{
    inactive: u,
    dataKey: t,
    type: l,
    color: bc(n, a),
    value: Za(r, t),
    payload: e
  }];
}, fW = /* @__PURE__ */ x.memo((e) => {
  var t = e.dataKey, r = e.data, n = e.stroke, a = e.strokeWidth, l = e.fill, u = e.name, c = e.hide, f = e.unit, d = e.formatter, h = e.tooltipType, p = e.id, y = {
    dataDefinedOnItem: r,
    getPosition: Qi,
    settings: {
      stroke: n,
      strokeWidth: a,
      fill: l,
      dataKey: t,
      nameKey: void 0,
      name: Za(u, t),
      hide: c,
      type: h,
      color: bc(n, l),
      unit: f,
      formatter: d,
      graphicalItemId: p
    }
  };
  return /* @__PURE__ */ x.createElement(_m, {
    tooltipEntrySettings: y
  });
});
function dW(e) {
  var t = e.clipPathId, r = e.points, n = e.props, a = n.needClip, l = n.dot, u = n.dataKey, c = ar(n);
  return /* @__PURE__ */ x.createElement(FF, {
    points: r,
    dot: l,
    className: "recharts-area-dots",
    dotClassName: "recharts-area-dot",
    dataKey: u,
    baseProps: c,
    needClip: a,
    clipPathId: t
  });
}
function vW(e) {
  var t = e.showLabels, r = e.children, n = e.points, a = n.map((l) => {
    var u, c, f = {
      x: (u = l.x) !== null && u !== void 0 ? u : 0,
      y: (c = l.y) !== null && c !== void 0 ? c : 0,
      width: 0,
      lowerWidth: 0,
      upperWidth: 0,
      height: 0
    };
    return Xa(Xa({}, f), {}, {
      value: l.value,
      payload: l.payload,
      parentViewBox: void 0,
      viewBox: f,
      fill: void 0
    });
  });
  return /* @__PURE__ */ x.createElement(KE, {
    value: t ? a : void 0
  }, r);
}
function hW(e) {
  var t = e.points, r = e.baseLine, n = e.needClip, a = e.clipPathId, l = e.props, u = e.animationElapsedTime, c = e.isAnimating, f = e.isEntrance, d = l.layout, h = l.type, p = l.stroke, y = l.connectNulls, b = l.isRange, A = l.shape, w = l.id, S = Ok(l, nW), O = Pr(S), C = Xa(Xa({}, O), {}, {
    id: w,
    points: t,
    connectNulls: y,
    type: h,
    baseLine: r,
    layout: d,
    stroke: p,
    isRange: b,
    animationElapsedTime: u,
    isAnimating: c,
    isEntrance: f
  });
  return /* @__PURE__ */ x.createElement(x.Fragment, null, (t == null ? void 0 : t.length) > 1 && /* @__PURE__ */ x.createElement(at, {
    clipPath: n ? "url(#clipPath-".concat(a, ")") : void 0
  }, /* @__PURE__ */ x.createElement(km, {
    option: A,
    DefaultShape: Ek.shape,
    shapeProps: C
  })), /* @__PURE__ */ x.createElement(dW, {
    points: t,
    props: S,
    clipPathId: a
  }));
}
function pW(e, t, r) {
  if (ie(e)) {
    var n = ie(t) ? t : void 0;
    return nt(n, e, r);
  }
  if (Ze(e) || Br(e)) {
    var a = ie(t) ? t : void 0;
    return nt(a, 0, r);
  }
  return e;
}
function mW(e) {
  var t = e.needClip, r = e.clipPathId, n = e.props, a = e.previousPointsRef, l = e.previousBaselineRef, u = n.points, c = n.baseLine, f = n.isAnimationActive, d = n.animationBegin, h = n.animationDuration, p = n.animationEasing, y = n.animationMatchBy, b = n.animationInterpolateFn, A = x.useMemo(() => ({
    points: u,
    baseLine: c
  }), [u, c]), w = rk(A, l), S = cp(), O = Dm(n.onAnimationStart, n.onAnimationEnd), C = O.isAnimating, I = O.handleAnimationStart, k = O.handleAnimationEnd, T = w.startValue;
  if (S == null)
    return null;
  var E;
  return Array.isArray(c) && Array.isArray(T) ? E = Mh(T, c, y) : Array.isArray(c) ? E = Mh(null, c, y) : E = null, /* @__PURE__ */ x.createElement($m, {
    animationInput: A,
    animationIdPrefix: "recharts-area-",
    items: u,
    previousItemsRef: a,
    isAnimationActive: f,
    animationBegin: d,
    animationDuration: h,
    animationEasing: p,
    onAnimationStart: I,
    onAnimationEnd: k,
    animationInterpolateFn: b,
    animationMatchBy: y,
    layout: S
  }, ($, F, U) => {
    var H;
    return F === 1 ? H = c : Array.isArray(c) ? H = b(E, F, S) : H = U ? c : pW(c, T, F), w.syncStepValue(H, F), /* @__PURE__ */ x.createElement(vW, {
      showLabels: !C,
      points: u
    }, n.children, /* @__PURE__ */ x.createElement(hW, {
      points: $,
      baseLine: H,
      needClip: t,
      clipPathId: r,
      props: n,
      animationElapsedTime: F,
      isAnimating: C || F < 1,
      isEntrance: U
    }), /* @__PURE__ */ x.createElement(Am, {
      label: n.label
    }));
  });
}
function yW(e) {
  var t = e.needClip, r = e.clipPathId, n = e.props, a = x.useRef(null), l = x.useRef();
  return /* @__PURE__ */ x.createElement(mW, {
    needClip: t,
    clipPathId: r,
    props: n,
    previousPointsRef: a,
    previousBaselineRef: l
  });
}
class gW extends x.PureComponent {
  render() {
    var t = this.props, r = t.hide, n = t.dot, a = t.points, l = t.className, u = t.top, c = t.left, f = t.needClip, d = t.xAxisId, h = t.yAxisId, p = t.width, y = t.height, b = t.id, A = t.baseLine, w = t.zIndex;
    if (r)
      return null;
    var S = ze("recharts-area", l), O = b, C = U6(n), I = C.r, k = C.strokeWidth, T = JE(n), E = I * 2 + k, $ = f ? "url(#clipPath-".concat(T ? "" : "dots-").concat(O, ")") : void 0;
    return /* @__PURE__ */ x.createElement(or, {
      zIndex: w
    }, /* @__PURE__ */ x.createElement(at, {
      className: S
    }, f && /* @__PURE__ */ x.createElement("defs", null, /* @__PURE__ */ x.createElement(gk, {
      clipPathId: O,
      xAxisId: d,
      yAxisId: h
    }), !T && /* @__PURE__ */ x.createElement("clipPath", {
      id: "clipPath-dots-".concat(O)
    }, /* @__PURE__ */ x.createElement("rect", {
      x: c - E / 2,
      y: u - E / 2,
      width: p + E,
      height: y + E
    }))), /* @__PURE__ */ x.createElement(yW, {
      needClip: f,
      clipPathId: O,
      props: this.props
    })), /* @__PURE__ */ x.createElement(E1, {
      points: a,
      mainColor: bc(this.props.stroke, this.props.fill),
      itemDataKey: this.props.dataKey,
      activeDot: this.props.activeDot,
      clipPath: $
    }), this.props.isRange && Array.isArray(A) && /* @__PURE__ */ x.createElement(E1, {
      points: A,
      mainColor: bc(this.props.stroke, this.props.fill),
      itemDataKey: this.props.dataKey,
      activeDot: this.props.activeDot,
      clipPath: $
    }));
  }
}
function xW(e) {
  var t, r = e.activeDot, n = e.animationBegin, a = e.animationDuration, l = e.animationEasing, u = e.connectNulls, c = e.dot, f = e.fill, d = e.fillOpacity, h = e.hide, p = e.isAnimationActive, y = e.legendType, b = e.stroke, A = e.xAxisId, w = e.yAxisId, S = Ok(e, iW), O = Zi(), C = AE(), I = Um(A, w), k = I.needClip, T = Ht(), E = (t = se((le) => q6(le, e.id, T))) !== null && t !== void 0 ? t : {}, $ = E.points, F = E.isRange, U = E.baseLine, H = zm();
  if (O !== "horizontal" && O !== "vertical" || H == null || C !== "AreaChart" && C !== "ComposedChart")
    return null;
  var G = H.height, W = H.width, ne = H.x, re = H.y;
  return !$ || !$.length ? null : /* @__PURE__ */ x.createElement(gW, xc({}, S, {
    activeDot: r,
    animationBegin: n,
    animationDuration: a,
    animationEasing: l,
    baseLine: U,
    connectNulls: u,
    dot: c,
    fill: f,
    fillOpacity: d,
    height: G,
    hide: h,
    layout: O,
    isAnimationActive: p,
    isRange: F,
    legendType: y,
    needClip: k,
    points: $,
    stroke: b,
    width: W,
    left: ne,
    top: re,
    xAxisId: A,
    yAxisId: w
  }));
}
var bW = (e, t, r, n, a) => {
  var l = r ?? t;
  if (ie(l))
    return l;
  var u = e === "horizontal" ? a : n, c = u.scale.domain();
  if (u.type === "number") {
    var f = Math.max(c[0], c[1]), d = Math.min(c[0], c[1]);
    return l === "dataMin" ? d : l === "dataMax" || f < 0 ? f : Math.max(Math.min(c[0], c[1]), 0);
  }
  return l === "dataMin" ? c[0] : l === "dataMax" ? c[1] : c[0];
};
function wW(e) {
  var t = e.areaSettings, r = t.connectNulls, n = t.baseValue, a = t.dataKey, l = e.stackedData, u = e.layout, c = e.chartBaseValue, f = e.xAxis, d = e.yAxis, h = e.displayedData, p = e.dataStartIndex, y = e.xAxisTicks, b = e.yAxisTicks, A = e.bandSize, w = e.stackDataKeys, S = l && l.length, O = bW(u, c, n, f, d), C = u === "horizontal", I = !1, k = h.map((E, $) => {
    var F, U, H, G;
    if (S)
      G = l[p + $];
    else {
      var W = $e(E, a);
      Array.isArray(W) ? (G = W, I = !0) : G = [O, W];
    }
    var ne = (F = (U = G) === null || U === void 0 ? void 0 : U[1]) !== null && F !== void 0 ? F : null, re = $e(E, a), le = S && re == null && w != null && w.length > 0 && w.every((K) => $e(E, K) == null), fe = ne == null || S && !r && re == null || le;
    if (C) {
      var ae;
      return {
        x: Cx({
          axis: f,
          ticks: y,
          bandSize: A,
          entry: E,
          index: $
        }),
        y: fe ? null : (ae = d.scale.map(ne)) !== null && ae !== void 0 ? ae : null,
        value: G,
        payload: E
      };
    }
    return {
      x: fe ? null : (H = f.scale.map(ne)) !== null && H !== void 0 ? H : null,
      y: Cx({
        axis: d,
        ticks: b,
        bandSize: A,
        entry: E,
        index: $
      }),
      value: G,
      payload: E
    };
  }), T;
  return S || I ? T = k.map((E) => {
    var $, F = Array.isArray(E.value) ? E.value[0] : null;
    if (C) {
      var U;
      return {
        x: E.x,
        y: F != null && E.y != null && (U = d.scale.map(F)) !== null && U !== void 0 ? U : null,
        payload: E.payload
      };
    }
    return {
      x: F != null && ($ = f.scale.map(F)) !== null && $ !== void 0 ? $ : null,
      y: E.y,
      payload: E.payload
    };
  }) : T = C ? d.scale.map(O) : f.scale.map(O), {
    points: k,
    baseLine: T ?? 0,
    isRange: I
  };
}
function SW(e) {
  var t = Ut(e, Ek), r = Ht();
  return /* @__PURE__ */ x.createElement(Rm, {
    id: t.id,
    type: "area"
  }, (n) => /* @__PURE__ */ x.createElement(x.Fragment, null, /* @__PURE__ */ x.createElement(tk, {
    legendPayload: cW(t)
  }), /* @__PURE__ */ x.createElement(fW, {
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
  }), /* @__PURE__ */ x.createElement(ak, {
    type: "area",
    id: n,
    data: t.data,
    dataKey: t.dataKey,
    xAxisId: t.xAxisId,
    yAxisId: t.yAxisId,
    zAxisId: 0,
    stackId: VA(t.stackId),
    hide: t.hide,
    barSize: void 0,
    baseValue: t.baseValue,
    isPanorama: r,
    connectNulls: t.connectNulls
  }), /* @__PURE__ */ x.createElement(xW, xc({}, t, {
    id: n
  }))));
}
var kk = /* @__PURE__ */ x.memo(SW, Ll);
kk.displayName = "Area";
var AW = "Invariant failed";
function PW(e, t) {
  throw new Error(AW);
}
var OW = ["option"];
function EW(e, t) {
  if (e == null) return {};
  var r, n, a = kW(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]);
  }
  return a;
}
function kW(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
var Hm = vP;
function Vm(e) {
  var t = e.option, r = EW(e, OW);
  return /* @__PURE__ */ x.createElement(km, {
    option: t,
    DefaultShape: Hm,
    shapeProps: r,
    activeClassName: "recharts-active-bar",
    inActiveClassName: "recharts-inactive-bar"
  });
}
var CW = function(t) {
  var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
  return (n, a) => {
    if (ie(t)) return t;
    var l = ie(n) || Ze(n);
    return l ? t(n, a) : (l || PW(), r);
  };
}, IW = (e, t, r) => r, jW = (e, t) => t, Zl = R([of, jW], (e, t) => e.filter((r) => r.type === "bar").find((r) => r.id === t)), _W = R([Zl], (e) => e == null ? void 0 : e.maxBarSize), TW = (e, t, r, n) => n, MW = R([_e, of, un, sn, IW], (e, t, r, n, a) => t.filter((l) => e === "horizontal" ? l.xAxisId === r : l.yAxisId === n).filter((l) => l.isPanorama === a).filter((l) => l.hide === !1).filter((l) => l.type === "bar")), NW = (e, t, r) => {
  var n = _e(e), a = un(e, t), l = sn(e, t);
  if (!(a == null || l == null))
    return n === "horizontal" ? fc(e, "yAxis", l, r) : fc(e, "xAxis", a, r);
}, DW = (e, t) => {
  var r = _e(e), n = un(e, t), a = sn(e, t);
  if (!(n == null || a == null))
    return r === "horizontal" ? Cw(e, "xAxis", n) : Cw(e, "yAxis", a);
}, $W = R([MW, MD, DW], v5), RW = (e, t, r) => {
  var n, a, l = Zl(e, t);
  if (l == null)
    return 0;
  var u = un(e, t), c = sn(e, t);
  if (u == null || c == null)
    return 0;
  var f = _e(e), d = _P(e), h = l.maxBarSize, p = Ze(h) ? d : h, y, b;
  return f === "horizontal" ? (y = li(e, "xAxis", u, r), b = oi(e, "xAxis", u, r)) : (y = li(e, "yAxis", c, r), b = oi(e, "yAxis", c, r)), (n = (a = Ka(y, b, !0)) !== null && a !== void 0 ? a : p) !== null && n !== void 0 ? n : 0;
}, Ck = (e, t, r) => {
  var n = _e(e), a = un(e, t), l = sn(e, t);
  if (!(a == null || l == null)) {
    var u, c;
    return n === "horizontal" ? (u = li(e, "xAxis", a, r), c = oi(e, "xAxis", a, r)) : (u = li(e, "yAxis", l, r), c = oi(e, "yAxis", l, r)), Ka(u, c);
  }
}, LW = R([$W, _P, TD, TP, RW, Ck, _W], g5), zW = (e, t, r) => {
  var n = un(e, t);
  if (n != null)
    return li(e, "xAxis", n, r);
}, BW = (e, t, r) => {
  var n = sn(e, t);
  if (n != null)
    return li(e, "yAxis", n, r);
}, FW = (e, t, r) => {
  var n = un(e, t);
  if (n != null)
    return oi(e, "xAxis", n, r);
}, WW = (e, t, r) => {
  var n = sn(e, t);
  if (n != null)
    return oi(e, "yAxis", n, r);
}, UW = R([LW, Zl], b5), KW = R([NW, Zl], x5), HW = R([gt, up, zW, BW, FW, WW, UW, _e, xP, Ck, KW, Zl, TW], (e, t, r, n, a, l, u, c, f, d, h, p, y) => {
  var b = f.chartData, A = f.dataStartIndex, w = f.dataEndIndex;
  if (!(p == null || u == null || t == null || c !== "horizontal" && c !== "vertical" || r == null || n == null || a == null || l == null || d == null)) {
    var S = p.data, O;
    if (S != null && S.length > 0 ? O = S : O = b == null ? void 0 : b.slice(A, w + 1), O != null)
      return PU({
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
        dataStartIndex: A
      });
  }
}), VW = ["index"];
function Dh() {
  return Dh = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Dh.apply(null, arguments);
}
function GW(e, t) {
  if (e == null) return {};
  var r, n, a = YW(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]);
  }
  return a;
}
function YW(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
var Ik = /* @__PURE__ */ x.createContext(void 0), qW = (e) => {
  var t = x.useContext(Ik);
  if (t != null)
    return t.stackId;
  if (e != null)
    return VA(e);
}, XW = (e, t) => "recharts-bar-stack-clip-path-".concat(e, "-").concat(t), QW = (e) => {
  var t = x.useContext(Ik);
  if (t != null) {
    var r = t.stackId;
    return "url(#".concat(XW(r, e), ")");
  }
}, jk = (e) => {
  var t = e.index, r = GW(e, VW), n = QW(t);
  return /* @__PURE__ */ x.createElement(at, Dh({
    className: "recharts-bar-stack-layer",
    clipPath: n
  }, r));
}, ZW = ["onMouseEnter", "onMouseLeave", "onClick"], JW = ["value", "background", "tooltipPosition"], eU = ["id"], tU = ["onMouseEnter", "onClick", "onMouseLeave"];
function B1(e, t) {
  return aU(e) || iU(e, t) || nU(e, t) || rU();
}
function rU() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function nU(e, t) {
  if (e) {
    if (typeof e == "string") return F1(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? F1(e, t) : void 0;
  }
}
function F1(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function iU(e, t) {
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
function aU(e) {
  if (Array.isArray(e)) return e;
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
function W1(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function yt(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? W1(Object(r), !0).forEach(function(n) {
      oU(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : W1(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function oU(e, t, r) {
  return (t = lU(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function lU(e) {
  var t = uU(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function uU(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function wc(e, t) {
  if (e == null) return {};
  var r, n, a = sU(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]);
  }
  return a;
}
function sU(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
var cU = (e) => {
  var t = e.dataKey, r = e.name, n = e.fill, a = e.legendType, l = e.hide;
  return [{
    inactive: l,
    dataKey: t,
    type: a,
    color: n,
    value: Za(r, t),
    payload: e
  }];
}, fU = /* @__PURE__ */ x.memo((e) => {
  var t = e.dataKey, r = e.stroke, n = e.strokeWidth, a = e.fill, l = e.name, u = e.hide, c = e.unit, f = e.formatter, d = e.tooltipType, h = e.id, p = {
    dataDefinedOnItem: void 0,
    getPosition: Qi,
    settings: {
      stroke: r,
      strokeWidth: n,
      fill: a,
      dataKey: t,
      nameKey: void 0,
      name: Za(l, t),
      hide: u,
      type: d,
      color: a,
      unit: c,
      formatter: f,
      graphicalItemId: h
    }
  };
  return /* @__PURE__ */ x.createElement(_m, {
    tooltipEntrySettings: p
  });
});
function dU(e) {
  var t = se(ui), r = e.data, n = e.dataKey, a = e.background, l = e.allOtherBarProps, u = l.onMouseEnter, c = l.onMouseLeave, f = l.onClick, d = wc(l, ZW), h = Cm(u, n, l.id), p = Im(c), y = jm(f, n, l.id);
  if (!a || r == null)
    return null;
  var b = Ui(a);
  return /* @__PURE__ */ x.createElement(or, {
    zIndex: w5(a, ft.barBackground)
  }, r.map((A, w) => {
    A.value;
    var S = A.background;
    A.tooltipPosition;
    var O = wc(A, JW);
    if (!S)
      return null;
    var C = h(A, A.originalDataIndex), I = p(A, A.originalDataIndex), k = y(A, A.originalDataIndex), T = yt(yt(yt(yt(yt({
      option: a,
      isActive: String(A.originalDataIndex) === t
    }, O), {}, {
      // @ts-expect-error backgroundProps is contributing unknown props
      fill: "#eee"
    }, S), b), Ic(d, A, w)), {}, {
      onMouseEnter: C,
      onMouseLeave: I,
      onClick: k,
      dataKey: n,
      index: w,
      className: "recharts-bar-background-rectangle"
    });
    return /* @__PURE__ */ x.createElement(Vm, si({
      key: "background-bar-".concat(w)
    }, T));
  }));
}
function vU(e) {
  var t = e.showLabels, r = e.children, n = e.rects, a = n == null ? void 0 : n.map((l) => {
    var u = {
      x: l.x,
      y: l.y,
      width: l.width,
      lowerWidth: l.width,
      upperWidth: l.width,
      height: l.height
    };
    return yt(yt({}, u), {}, {
      value: l.value,
      payload: l.payload,
      parentViewBox: l.parentViewBox,
      viewBox: u,
      fill: l.fill
    });
  });
  return /* @__PURE__ */ x.createElement(KE, {
    value: t ? a : void 0
  }, r);
}
function hU(e) {
  var t = e.shape, r = e.activeBar, n = e.baseProps, a = e.entry, l = e.index, u = e.dataKey, c = se(ui), f = se(mm), d = r && String(a.originalDataIndex) === c && (f == null || u === f), h = c != null && (String(a.originalDataIndex) !== c || f != null && u !== f), p = x.useState(!1), y = B1(p, 2), b = y[0], A = y[1], w = x.useState(!1), S = B1(w, 2), O = S[0], C = S[1];
  x.useEffect(() => {
    var F;
    return d ? (A(!0), F = requestAnimationFrame(() => {
      C(!0);
    })) : (C(!1), h && A(!1)), () => {
      cancelAnimationFrame(F);
    };
  }, [d, h]);
  var I = x.useCallback(() => {
    d || A(!1);
  }, [d]), k = d && O, T = d || b, E;
  d ? r === !0 ? E = t : E = r : E = t;
  var $ = /* @__PURE__ */ x.createElement(Vm, si({}, n, {
    name: String(n.name)
  }, a, {
    isActive: k,
    option: E,
    index: l,
    dataKey: u,
    animationElapsedTime: e.animationElapsedTime,
    isAnimating: e.isAnimating,
    isEntrance: e.isEntrance,
    onTransitionEnd: I
  }));
  return T ? /* @__PURE__ */ x.createElement(or, {
    zIndex: ft.activeBar
  }, /* @__PURE__ */ x.createElement(jk, {
    index: a.originalDataIndex
  }, $)) : $;
}
function pU(e) {
  var t = e.shape, r = e.baseProps, n = e.entry, a = e.index, l = e.dataKey;
  return /* @__PURE__ */ x.createElement(Vm, si({}, r, {
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
function mU(e) {
  var t, r = e.data, n = e.props, a = e.animationElapsedTime, l = e.isAnimating, u = e.isEntrance, c = (t = ar(n)) !== null && t !== void 0 ? t : {}, f = c.id, d = wc(c, eU), h = n.shape, p = n.dataKey, y = n.activeBar, b = n.onMouseEnter, A = n.onClick, w = n.onMouseLeave, S = wc(n, tU), O = Cm(b, p, f), C = Im(w), I = jm(A, p, f);
  return r ? /* @__PURE__ */ x.createElement(x.Fragment, null, r.map((k, T) => /* @__PURE__ */ x.createElement(jk, si({
    index: k.originalDataIndex,
    key: "rectangle-".concat(k == null ? void 0 : k.x, "-").concat(k == null ? void 0 : k.y, "-").concat(k == null ? void 0 : k.value, "-").concat(T),
    className: "recharts-bar-rectangle"
  }, Ic(S, k, T), {
    onMouseEnter: O(k, k.originalDataIndex),
    onMouseLeave: C(k, k.originalDataIndex),
    onClick: I(k, k.originalDataIndex)
  }), y ? /* @__PURE__ */ x.createElement(hU, {
    shape: h,
    activeBar: y,
    baseProps: d,
    entry: k,
    index: T,
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
    /* @__PURE__ */ x.createElement(pU, {
      shape: h,
      baseProps: d,
      entry: k,
      index: T,
      dataKey: p,
      animationElapsedTime: a,
      isAnimating: l,
      isEntrance: u
    })
  )))) : null;
}
var yU = (e, t, r) => e == null ? [] : t === 1 ? e.flatMap((n) => n.status === "removed" ? [] : [n.next]) : e.flatMap((n) => {
  if (n.status === "removed")
    return r === "horizontal" ? [yt(yt({}, n.prev), {}, {
      height: nt(n.prev.height, 0, t),
      y: nt(n.prev.y, n.prev.y + n.prev.height, t)
    })] : [yt(yt({}, n.prev), {}, {
      width: nt(n.prev.width, 0, t)
    })];
  if (n.status === "matched")
    return [yt(yt({}, n.next), {}, {
      x: nt(n.prev.x, n.next.x, t),
      y: nt(n.prev.y, n.next.y, t),
      width: nt(n.prev.width, n.next.width, t),
      height: nt(n.prev.height, n.next.height, t)
    })];
  var a = n.next;
  return r === "horizontal" ? [yt(yt({}, a), {}, {
    height: nt(0, a.height, t),
    y: nt(a.stackedBarStart, a.y, t)
  })] : [yt(yt({}, a), {}, {
    width: nt(0, a.width, t),
    x: nt(a.stackedBarStart, a.x, t)
  })];
});
function gU(e) {
  var t = e.props, r = e.previousRectanglesRef, n = t.data, a = t.isAnimationActive, l = t.animationBegin, u = t.animationDuration, c = t.animationEasing, f = t.animationInterpolateFn, d = t.layout, h = Dm(t.onAnimationStart, t.onAnimationEnd), p = h.isAnimating, y = h.handleAnimationStart, b = h.handleAnimationEnd;
  return /* @__PURE__ */ x.createElement(vU, {
    showLabels: !p,
    rects: n
  }, /* @__PURE__ */ x.createElement($m, {
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
  }, (A, w, S) => /* @__PURE__ */ x.createElement(at, null, /* @__PURE__ */ x.createElement(mU, {
    props: t,
    data: A,
    animationElapsedTime: w,
    isAnimating: p || w < 1,
    isEntrance: S
  }))), /* @__PURE__ */ x.createElement(Am, {
    label: t.label
  }), t.children);
}
function xU(e) {
  var t = x.useRef(null);
  return /* @__PURE__ */ x.createElement(gU, {
    previousRectanglesRef: t,
    props: e
  });
}
var _k = 0, bU = (e, t) => {
  var r = Array.isArray(e.value) ? e.value[1] : e.value;
  return {
    x: e.x,
    y: e.y,
    value: r,
    // getValueByDataKey does not validate the output type
    errorVal: $e(e, t)
  };
};
class wU extends x.PureComponent {
  render() {
    var t = this.props, r = t.hide, n = t.data, a = t.dataKey, l = t.className, u = t.xAxisId, c = t.yAxisId, f = t.needClip, d = t.background, h = t.id;
    if (r || n == null)
      return null;
    var p = ze("recharts-bar", l), y = h;
    return /* @__PURE__ */ x.createElement(at, {
      className: p,
      id: h
    }, f && /* @__PURE__ */ x.createElement("defs", null, /* @__PURE__ */ x.createElement(gk, {
      clipPathId: y,
      xAxisId: u,
      yAxisId: c
    })), /* @__PURE__ */ x.createElement(at, {
      className: "recharts-bar-rectangles",
      clipPath: f ? "url(#clipPath-".concat(y, ")") : void 0
    }, /* @__PURE__ */ x.createElement(dU, {
      data: n,
      dataKey: a,
      background: d,
      allOtherBarProps: this.props
    }), /* @__PURE__ */ x.createElement(xU, this.props)));
  }
}
var SU = {
  activeBar: !1,
  animationBegin: 0,
  animationDuration: 400,
  animationEasing: "ease",
  animationInterpolateFn: yU,
  animationMatchBy: Mm,
  background: !1,
  hide: !1,
  isAnimationActive: "auto",
  label: !1,
  legendType: "rect",
  minPointSize: _k,
  shape: Hm,
  xAxisId: 0,
  yAxisId: 0,
  zIndex: ft.bar
};
function AU(e) {
  var t = e.xAxisId, r = e.yAxisId, n = e.hide, a = e.legendType, l = e.minPointSize, u = e.activeBar, c = e.animationBegin, f = e.animationDuration, d = e.animationEasing, h = e.isAnimationActive, p = Um(t, r), y = p.needClip, b = Zi(), A = Ht(), w = Em(e.children, lo), S = se((I) => HW(I, e.id, A, w));
  if (b !== "vertical" && b !== "horizontal")
    return null;
  var O, C = S == null ? void 0 : S[0];
  return C == null || C.height == null || C.width == null ? O = 0 : O = b === "vertical" ? C.height / 2 : C.width / 2, /* @__PURE__ */ x.createElement(W6, {
    xAxisId: t,
    yAxisId: r,
    data: S,
    dataPointFormatter: bU,
    errorBarOffset: O
  }, /* @__PURE__ */ x.createElement(wU, si({}, e, {
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
function PU(e) {
  var t = e.layout, r = e.barSettings, n = r.dataKey, a = r.minPointSize, l = r.hasCustomShape, u = e.pos, c = e.bandSize, f = e.xAxis, d = e.yAxis, h = e.xAxisTicks, p = e.yAxisTicks, y = e.stackedData, b = e.displayedData, A = e.offset, w = e.cells, S = e.parentViewBox, O = e.dataStartIndex, C = t === "horizontal" ? d : f, I = y ? C.scale.domain() : null, k = wT({
    numericAxis: C
  }), T = C.scale.map(k);
  return b.map((E, $) => {
    var F, U, H, G, W, ne;
    if (y) {
      var re = y[$ + O];
      if (re == null)
        return null;
      F = mT(re, I);
    } else
      F = $e(E, n), Array.isArray(F) || (F = [k, F]);
    var le = CW(a, _k)(F[1], $);
    if (t === "horizontal") {
      var fe, ae = d.scale.map(F[0]), K = d.scale.map(F[1]);
      if (ae == null || K == null)
        return null;
      U = Ix({
        axis: f,
        ticks: h,
        bandSize: c,
        offset: u.offset,
        entry: E,
        index: $
      }), H = (fe = K ?? ae) !== null && fe !== void 0 ? fe : void 0, G = u.size;
      var te = ae - K;
      if (W = Br(te) ? 0 : te, ne = {
        x: U,
        y: A.top,
        width: G,
        height: A.height
      }, Math.abs(le) > 0 && Math.abs(W) < Math.abs(le)) {
        var Y = Ot(W || le) * (Math.abs(le) - Math.abs(W));
        H -= Y, W += Y;
      }
    } else {
      var D = f.scale.map(F[0]), V = f.scale.map(F[1]);
      if (D == null || V == null)
        return null;
      if (U = D, H = Ix({
        axis: d,
        ticks: p,
        bandSize: c,
        offset: u.offset,
        entry: E,
        index: $
      }), G = V - D, W = u.size, ne = {
        x: A.left,
        y: H,
        width: A.width,
        height: W
      }, Math.abs(le) > 0 && Math.abs(G) < Math.abs(le)) {
        var ve = Ot(G || le) * (Math.abs(le) - Math.abs(G));
        G += ve;
      }
    }
    if (U == null || H == null || G == null || W == null || !l && (G === 0 || W === 0))
      return null;
    var ye = yt(yt({}, E), {}, {
      stackedBarStart: T,
      x: U,
      y: H,
      width: G,
      height: W,
      value: y ? F : F[1],
      payload: E,
      background: ne,
      tooltipPosition: {
        x: U + G / 2,
        y: H + W / 2
      },
      parentViewBox: S,
      originalDataIndex: $
    }, w && w[$] && w[$].props);
    return ye;
  }).filter(Boolean);
}
function OU(e) {
  var t = Ut(e, SU), r = qW(t.stackId), n = Ht();
  return /* @__PURE__ */ x.createElement(Rm, {
    id: t.id,
    type: "bar"
  }, (a) => /* @__PURE__ */ x.createElement(x.Fragment, null, /* @__PURE__ */ x.createElement(tk, {
    legendPayload: cU(t)
  }), /* @__PURE__ */ x.createElement(fU, {
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
  }), /* @__PURE__ */ x.createElement(ak, {
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
    hasCustomShape: t.shape != null && t.shape !== Hm
  }), /* @__PURE__ */ x.createElement(or, {
    zIndex: t.zIndex
  }, /* @__PURE__ */ x.createElement(AU, si({}, t, {
    id: a
  })))));
}
var Tl = /* @__PURE__ */ x.memo(OU, Ll);
Tl.displayName = "Bar";
var EU = ["domain", "range"], kU = ["domain", "range"];
function U1(e, t) {
  if (e == null) return {};
  var r, n, a = CU(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]);
  }
  return a;
}
function CU(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
function K1(e, t) {
  return e === t ? !0 : Array.isArray(e) && e.length === 2 && Array.isArray(t) && t.length === 2 ? e[0] === t[0] && e[1] === t[1] : !1;
}
function Tk(e, t) {
  if (e === t)
    return !0;
  var r = e.domain, n = e.range, a = U1(e, EU), l = t.domain, u = t.range, c = U1(t, kU);
  return !K1(r, l) || !K1(n, u) ? !1 : Ll(a, c);
}
var IU = ["type"], jU = ["dangerouslySetInnerHTML", "ticks", "scale"], _U = ["id", "scale"];
function $h() {
  return $h = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, $h.apply(null, arguments);
}
function H1(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function V1(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? H1(Object(r), !0).forEach(function(n) {
      TU(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : H1(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function TU(e, t, r) {
  return (t = MU(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function MU(e) {
  var t = NU(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function NU(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function Rh(e, t) {
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
function $U(e) {
  var t = Fe(), r = x.useRef(null), n = cp(), a = e.type, l = Rh(e, IU), u = Yc(n, "xAxis", a), c = x.useMemo(() => {
    if (u != null)
      return V1(V1({}, l), {}, {
        type: u
      });
  }, [l, u]);
  return x.useLayoutEffect(() => {
    c != null && (r.current === null ? t(VF(c)) : r.current !== c && t(GF({
      prev: r.current,
      next: c
    })), r.current = c);
  }, [c, t]), x.useLayoutEffect(() => () => {
    r.current && (t(YF(r.current)), r.current = null);
  }, [t]), null;
}
var RU = (e) => {
  var t = e.xAxisId, r = e.className, n = e.height, a = e.label, l = x.useRef(null), u = x.useRef(null), c = se(up), f = Ht(), d = Fe(), h = "xAxis", p = se((O) => ZO(O, h, t, f)), y = se((O) => qO(O, t)), b = se((O) => yz(O, t)), A = se((O) => OO(O, t));
  if (x.useLayoutEffect(() => {
    if (!(n !== "auto" || !y || vf(a) || /* @__PURE__ */ x.isValidElement(a) || A == null)) {
      var O = l.current;
      if (O) {
        var C = O.getCalculatedHeight();
        Math.round(y.height) !== Math.round(C) && d(JF({
          id: t,
          height: C
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
    A
  ]), y == null || b == null || A == null)
    return null;
  e.dangerouslySetInnerHTML, e.ticks, e.scale;
  var w = Rh(e, jU);
  A.id, A.scale;
  var S = Rh(A, _U);
  return /* @__PURE__ */ x.createElement(Fm, $h({}, w, S, {
    ref: l,
    labelRef: u,
    x: b.x,
    y: b.y,
    width: y.width,
    height: y.height,
    className: ze("recharts-".concat(h, " ").concat(h), r),
    viewBox: c,
    ticks: p,
    axisType: h,
    axisId: t
  }));
}, LU = {
  allowDataOverflow: pt.allowDataOverflow,
  allowDecimals: pt.allowDecimals,
  allowDuplicatedCategory: pt.allowDuplicatedCategory,
  angle: pt.angle,
  axisLine: An.axisLine,
  height: pt.height,
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
  tickLine: An.tickLine,
  tickSize: An.tickSize,
  type: pt.type,
  niceTicks: pt.niceTicks,
  xAxisId: 0
}, zU = (e) => {
  var t = Ut(e, LU);
  return /* @__PURE__ */ x.createElement(x.Fragment, null, /* @__PURE__ */ x.createElement($U, {
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
  }), /* @__PURE__ */ x.createElement(RU, t));
}, Ba = /* @__PURE__ */ x.memo(zU, Tk);
Ba.displayName = "XAxis";
var BU = ["type"], FU = ["dangerouslySetInnerHTML", "ticks", "scale"], WU = ["id", "scale"];
function Lh() {
  return Lh = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Lh.apply(null, arguments);
}
function G1(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Y1(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? G1(Object(r), !0).forEach(function(n) {
      UU(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : G1(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function UU(e, t, r) {
  return (t = KU(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function KU(e) {
  var t = HU(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function HU(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function zh(e, t) {
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
function GU(e) {
  var t = Fe(), r = x.useRef(null), n = cp(), a = e.type, l = zh(e, BU), u = Yc(n, "yAxis", a), c = x.useMemo(() => {
    if (u != null)
      return Y1(Y1({}, l), {}, {
        type: u
      });
  }, [u, l]);
  return x.useLayoutEffect(() => {
    c != null && (r.current === null ? t(qF(c)) : r.current !== c && t(XF({
      prev: r.current,
      next: c
    })), r.current = c);
  }, [c, t]), x.useLayoutEffect(() => () => {
    r.current && (t(QF(r.current)), r.current = null);
  }, [t]), null;
}
function YU(e) {
  var t = e.yAxisId, r = e.className, n = e.width, a = e.label, l = x.useRef(null), u = x.useRef(null), c = se(up), f = Ht(), d = Fe(), h = "yAxis", p = se((O) => XO(O, t)), y = se((O) => xz(O, t)), b = se((O) => ZO(O, h, t, f)), A = se((O) => EO(O, t));
  if (x.useLayoutEffect(() => {
    if (!(n !== "auto" || !p || vf(a) || /* @__PURE__ */ x.isValidElement(a) || A == null)) {
      var O = l.current;
      if (O) {
        var C = O.getCalculatedWidth();
        Math.round(p.width) !== Math.round(C) && d(ZF({
          id: t,
          width: C
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
    A
  ]), p == null || y == null || A == null)
    return null;
  e.dangerouslySetInnerHTML, e.ticks, e.scale;
  var w = zh(e, FU);
  A.id, A.scale;
  var S = zh(A, WU);
  return /* @__PURE__ */ x.createElement(Fm, Lh({}, w, S, {
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
    className: ze("recharts-".concat(h, " ").concat(h), r),
    viewBox: c,
    ticks: b,
    axisType: h,
    axisId: t
  }));
}
var qU = {
  allowDataOverflow: mt.allowDataOverflow,
  allowDecimals: mt.allowDecimals,
  allowDuplicatedCategory: mt.allowDuplicatedCategory,
  angle: mt.angle,
  axisLine: An.axisLine,
  hide: !1,
  includeHidden: mt.includeHidden,
  interval: mt.interval,
  label: !1,
  minTickGap: mt.minTickGap,
  mirror: mt.mirror,
  orientation: mt.orientation,
  padding: mt.padding,
  reversed: mt.reversed,
  scale: mt.scale,
  tick: mt.tick,
  tickCount: mt.tickCount,
  tickLine: An.tickLine,
  tickSize: An.tickSize,
  type: mt.type,
  niceTicks: mt.niceTicks,
  width: mt.width,
  yAxisId: 0
}, XU = (e) => {
  var t = Ut(e, qU);
  return /* @__PURE__ */ x.createElement(x.Fragment, null, /* @__PURE__ */ x.createElement(GU, {
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
  }), /* @__PURE__ */ x.createElement(YU, t));
}, Fa = /* @__PURE__ */ x.memo(XU, Tk);
Fa.displayName = "YAxis";
var QU = (e, t) => t, Gm = R([QU, _e, zP, Et, mE, Mn, B3, gt], G3);
function ZU(e) {
  return "getBBox" in e.currentTarget && typeof e.currentTarget.getBBox == "function";
}
function Ym(e) {
  var t = e.currentTarget.getBoundingClientRect(), r, n;
  if (ZU(e)) {
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
var Mk = hr("mouseClick"), Nk = Nl();
Nk.startListening({
  actionCreator: Mk,
  effect: (e, t) => {
    var r = e.payload, n = Gm(t.getState(), Ym(r));
    (n == null ? void 0 : n.activeIndex) != null && t.dispatch(Dz({
      activeIndex: n.activeIndex,
      activeDataKey: void 0,
      activeCoordinate: n.activeCoordinate
    }));
  }
});
var Bh = hr("mouseMove"), Dk = Nl(), Ta = null, ki = null, Yv = null;
Dk.startListening({
  actionCreator: Bh,
  effect: (e, t) => {
    var r = e.payload, n = t.getState(), a = n.eventSettings, l = a.throttleDelay, u = a.throttledEvents, c = u === "all" || (u == null ? void 0 : u.includes("mousemove"));
    Ta !== null && (cancelAnimationFrame(Ta), Ta = null), ki !== null && (typeof l != "number" || !c) && (clearTimeout(ki), ki = null), Yv = Ym(r);
    var f = () => {
      var d = t.getState(), h = Xl(d, d.tooltip.settings.shared);
      if (!Yv) {
        Ta = null, ki = null;
        return;
      }
      if (h === "axis") {
        var p = Gm(d, Yv);
        (p == null ? void 0 : p.activeIndex) != null ? t.dispatch(oE({
          activeIndex: p.activeIndex,
          activeDataKey: void 0,
          activeCoordinate: p.activeCoordinate
        })) : t.dispatch(aE());
      }
      Ta = null, ki = null;
    };
    if (!c) {
      f();
      return;
    }
    l === "raf" ? Ta = requestAnimationFrame(f) : typeof l == "number" && ki === null && (ki = setTimeout(f, l));
  }
});
function JU(e, t) {
  return t instanceof HTMLElement ? "HTMLElement <".concat(t.tagName, ' class="').concat(t.className, '">') : t === window ? "global.window" : e === "children" && typeof t == "object" && t !== null ? "<<CHILDREN>>" : t;
}
var q1 = {
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
}, $k = Kt({
  name: "rootProps",
  initialState: q1,
  reducers: {
    updateOptions: (e, t) => {
      var r;
      e.accessibilityLayer = t.payload.accessibilityLayer, e.barCategoryGap = t.payload.barCategoryGap, e.barGap = (r = t.payload.barGap) !== null && r !== void 0 ? r : q1.barGap, e.barSize = t.payload.barSize, e.maxBarSize = t.payload.maxBarSize, e.stackOffset = t.payload.stackOffset, e.syncId = t.payload.syncId, e.syncMethod = t.payload.syncMethod, e.className = t.payload.className, e.baseValue = t.payload.baseValue, e.reverseStackOrder = t.payload.reverseStackOrder;
    }
  }
}), eK = $k.reducer, tK = $k.actions.updateOptions, rK = null, nK = {
  updatePolarOptions: (e, t) => e === null ? t.payload : (e.startAngle = t.payload.startAngle, e.endAngle = t.payload.endAngle, e.cx = t.payload.cx, e.cy = t.payload.cy, e.innerRadius = t.payload.innerRadius, e.outerRadius = t.payload.outerRadius, e)
}, Rk = Kt({
  name: "polarOptions",
  initialState: rK,
  reducers: nK
}), iK = Rk.actions.updatePolarOptions, aK = Rk.reducer, Lk = hr("keyDown"), zk = hr("focus"), Bk = hr("blur"), gf = Nl(), Ma = null, Ci = null, Ps = null;
gf.startListening({
  actionCreator: Lk,
  effect: (e, t) => {
    Ps = e.payload, Ma !== null && (cancelAnimationFrame(Ma), Ma = null);
    var r = t.getState(), n = r.eventSettings, a = n.throttleDelay, l = n.throttledEvents, u = l === "all" || l.includes("keydown");
    Ci !== null && (typeof a != "number" || !u) && (clearTimeout(Ci), Ci = null);
    var c = () => {
      try {
        var f = t.getState(), d = f.rootProps.accessibilityLayer !== !1;
        if (!d)
          return;
        var h = f.tooltip.keyboardInteraction, p = Ps;
        if (p !== "ArrowRight" && p !== "ArrowLeft" && p !== "Enter")
          return;
        var y = ml(h, Yi(f), Ya(f), qa(f)), b = y == null ? -1 : Number(y), A = !Number.isFinite(b) || b < 0, w = Mn(f), S = Yi(f), O = Xl(f, f.tooltip.settings.shared);
        if (p === "Enter") {
          if (A)
            return;
          var C = hc(f, O, "hover", String(h.index));
          t.dispatch(vc({
            active: !h.active,
            activeIndex: h.index,
            activeCoordinate: C
          }));
          return;
        }
        var I = Pz(f), k = I === "left-to-right" ? 1 : -1, T = p === "ArrowRight" ? 1 : -1, E;
        if (A) {
          var $ = Ya(f), F = qa(f), U = T * k, H = (le) => ({
            active: !1,
            index: String(le),
            dataKey: void 0,
            graphicalItemId: void 0,
            coordinate: void 0
          });
          if (E = -1, U > 0) {
            for (var G = 0; G < S.length; G++)
              if (ml(H(G), S, $, F) != null) {
                E = G;
                break;
              }
          } else
            for (var W = S.length - 1; W >= 0; W--)
              if (ml(H(W), S, $, F) != null) {
                E = W;
                break;
              }
          if (E < 0)
            return;
        } else {
          E = b + T * k;
          var ne = (w == null ? void 0 : w.length) || S.length;
          if (ne === 0 || E >= ne || E < 0)
            return;
        }
        var re = hc(f, O, "hover", String(E));
        t.dispatch(vc({
          active: !0,
          activeIndex: E.toString(),
          activeCoordinate: re
        }));
      } finally {
        Ma = null, Ci = null;
      }
    };
    if (!u) {
      c();
      return;
    }
    a === "raf" ? Ma = requestAnimationFrame(c) : typeof a == "number" && Ci === null && (c(), Ps = null, Ci = setTimeout(() => {
      Ps ? c() : (Ci = null, Ma = null);
    }, a));
  }
});
gf.startListening({
  actionCreator: zk,
  effect: (e, t) => {
    var r = t.getState(), n = r.rootProps.accessibilityLayer !== !1;
    if (n) {
      var a = r.tooltip.keyboardInteraction;
      if (!a.active && a.index == null) {
        var l = "0", u = Xl(r, r.tooltip.settings.shared), c = hc(r, u, "hover", String(l));
        t.dispatch(vc({
          active: !0,
          activeIndex: l,
          activeCoordinate: c
        }));
      }
    }
  }
});
gf.startListening({
  actionCreator: Bk,
  effect: (e, t) => {
    var r = t.getState(), n = r.rootProps.accessibilityLayer !== !1;
    if (n) {
      var a = r.tooltip.keyboardInteraction;
      a.active && t.dispatch(vc({
        active: !1,
        activeIndex: a.index,
        activeCoordinate: a.coordinate
      }));
    }
  }
});
function Fk(e) {
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
var wr = hr("externalEvent"), Wk = Nl(), Os = /* @__PURE__ */ new Map(), ol = /* @__PURE__ */ new Map(), qv = /* @__PURE__ */ new Map();
Wk.startListening({
  actionCreator: wr,
  effect: (e, t) => {
    var r = e.payload, n = r.handler, a = r.reactEvent;
    if (n != null) {
      var l = a.type, u = Fk(a);
      qv.set(l, {
        handler: n,
        reactEvent: u
      });
      var c = Os.get(l);
      c !== void 0 && (cancelAnimationFrame(c), Os.delete(l));
      var f = t.getState(), d = f.eventSettings, h = d.throttleDelay, p = d.throttledEvents, y = p, b = y === "all" || (y == null ? void 0 : y.includes(l)), A = ol.get(l);
      A !== void 0 && (typeof h != "number" || !b) && (clearTimeout(A), ol.delete(l));
      var w = () => {
        var C = qv.get(l);
        try {
          if (!C)
            return;
          var I = C.handler, k = C.reactEvent, T = t.getState(), E = {
            activeCoordinate: O3(T),
            activeDataKey: mm(T),
            activeIndex: ui(T),
            activeLabel: xE(T),
            activeTooltipIndex: ui(T),
            isTooltipActive: E3(T)
          };
          I && I(E, k);
        } finally {
          Os.delete(l), ol.delete(l), qv.delete(l);
        }
      };
      if (!b) {
        w();
        return;
      }
      if (h === "raf") {
        var S = requestAnimationFrame(w);
        Os.set(l, S);
      } else if (typeof h == "number") {
        if (!ol.has(l)) {
          w();
          var O = setTimeout(w, h);
          ol.set(l, O);
        }
      } else
        w();
    }
  }
});
var oK = R([oo], (e) => e.tooltipItemPayloads), lK = R([oK, (e, t) => t, (e, t, r) => r], (e, t, r) => {
  if (t != null) {
    var n = e.find((l) => l.settings.graphicalItemId === r);
    if (n != null) {
      var a = n.getPosition;
      if (a != null)
        return a(t);
    }
  }
}), Uk = hr("touchMove"), Kk = Nl(), Ii = null, Jn = null, X1 = null, ll = null;
Kk.startListening({
  actionCreator: Uk,
  effect: (e, t) => {
    var r = e.payload;
    if (!(r.touches == null || r.touches.length === 0)) {
      ll = Fk(r);
      var n = t.getState(), a = n.eventSettings, l = a.throttleDelay, u = a.throttledEvents, c = u === "all" || u.includes("touchmove");
      Ii !== null && (cancelAnimationFrame(Ii), Ii = null), Jn !== null && (typeof l != "number" || !c) && (clearTimeout(Jn), Jn = null), X1 = Array.from(r.touches).map((d) => Ym({
        clientX: d.clientX,
        clientY: d.clientY,
        currentTarget: r.currentTarget
      }));
      var f = () => {
        if (ll != null) {
          var d = t.getState(), h = Xl(d, d.tooltip.settings.shared);
          if (h === "axis") {
            var p, y = (p = X1) === null || p === void 0 ? void 0 : p[0];
            if (y == null) {
              Ii = null, Jn = null;
              return;
            }
            var b = Gm(d, y);
            (b == null ? void 0 : b.activeIndex) != null && t.dispatch(oE({
              activeIndex: b.activeIndex,
              activeDataKey: void 0,
              activeCoordinate: b.activeCoordinate
            }));
          } else if (h === "item") {
            var A, w = ll.touches[0];
            if (document.elementFromPoint == null || w == null)
              return;
            var S = document.elementFromPoint(w.clientX, w.clientY);
            if (!S || !S.getAttribute)
              return;
            var O = S.getAttribute(YA), C = (A = S.getAttribute(qA)) !== null && A !== void 0 ? A : void 0, I = ta(d).find((E) => E.id === C);
            if (O == null || I == null || C == null)
              return;
            var k = I.dataKey, T = lK(d, O, C);
            t.dispatch(iE({
              activeDataKey: k,
              activeIndex: O,
              activeCoordinate: T,
              activeGraphicalItemId: C
            }));
          }
          Ii = null, Jn = null;
        }
      };
      if (!c) {
        f();
        return;
      }
      l === "raf" ? Ii = requestAnimationFrame(f) : typeof l == "number" && Jn === null && (f(), ll = null, Jn = setTimeout(() => {
        ll ? f() : (Jn = null, Ii = null);
      }, l));
    }
  }
});
var qm = {
  throttleDelay: "raf",
  throttledEvents: ["mousemove", "touchmove", "pointermove", "scroll", "wheel"]
}, Hk = Kt({
  name: "eventSettings",
  initialState: qm,
  reducers: {
    setEventSettings: (e, t) => {
      t.payload.throttleDelay != null && (e.throttleDelay = t.payload.throttleDelay), t.payload.throttledEvents != null && (e.throttledEvents = Ne(t.payload.throttledEvents));
    }
  }
}), uK = Hk.actions.setEventSettings, sK = Hk.reducer, cK = pA({
  brush: S5,
  cartesianAxis: e5,
  chartData: AB,
  errorBars: $6,
  eventSettings: sK,
  graphicalItems: rF,
  layout: fT,
  legend: cM,
  options: gB,
  polarAxis: u8,
  polarOptions: aK,
  referenceElements: E5,
  renderedTicks: Z5,
  rootProps: eK,
  tooltip: $z,
  zIndex: oB
}), fK = function(t) {
  var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "Chart";
  return $2({
    reducer: cK,
    // redux-toolkit v1 types are unhappy with the preloadedState type. Remove the `as any` when bumping to v2
    preloadedState: t,
    // @ts-expect-error redux-toolkit v1 types are unhappy with the middleware array. Remove this comment when bumping to v2
    middleware: (n) => {
      var a;
      return n({
        serializableCheck: !1,
        immutableCheck: !["commonjs", "es6", "production"].includes((a = "es6") !== null && a !== void 0 ? a : "")
      }).concat([Nk.middleware, Dk.middleware, gf.middleware, Wk.middleware, Kk.middleware]);
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
      return typeof n == "function" && (a = n()), a.concat(jA({
        type: "raf"
      }));
    },
    devTools: {
      serialize: {
        replacer: JU
      },
      name: "recharts-".concat(r)
    }
  });
};
function Vk(e) {
  var t = e.preloadedState, r = e.children, n = e.reduxStoreName, a = Ht(), l = x.useRef(null);
  if (a)
    return r;
  l.current == null && (l.current = fK(t, n));
  var u = ep;
  return /* @__PURE__ */ x.createElement(EM, {
    context: u,
    store: l.current
  }, r);
}
function dK(e) {
  var t = e.layout, r = e.margin, n = Fe(), a = Ht();
  return x.useEffect(() => {
    a || (n(uT(t)), n(lT(r)));
  }, [n, a, t, r]), null;
}
var Gk = /* @__PURE__ */ x.memo(dK, Ll);
function Yk(e) {
  var t = Fe();
  return x.useEffect(() => {
    t(tK(e));
  }, [t, e]), null;
}
var vK = (e) => {
  var t = Fe();
  return x.useEffect(() => {
    t(uK(e));
  }, [t, e]), null;
}, qk = /* @__PURE__ */ x.memo(vK, Ll);
function Q1(e) {
  var t = e.zIndex, r = e.isPanorama, n = x.useRef(null), a = Fe();
  return x.useLayoutEffect(() => (n.current && a(iB({
    zIndex: t,
    element: n.current,
    isPanorama: r
  })), () => {
    a(aB({
      zIndex: t,
      isPanorama: r
    }));
  }), [a, t, r]), /* @__PURE__ */ x.createElement("g", {
    tabIndex: -1,
    ref: n,
    className: "recharts-zIndex-layer_".concat(t)
  });
}
function Z1(e) {
  var t = e.children, r = e.isPanorama, n = se(q3);
  if (!n || n.length === 0)
    return t;
  var a = n.filter((u) => u < 0), l = n.filter((u) => u > 0);
  return /* @__PURE__ */ x.createElement(x.Fragment, null, a.map((u) => /* @__PURE__ */ x.createElement(Q1, {
    key: u,
    zIndex: u,
    isPanorama: r
  })), t, l.map((u) => /* @__PURE__ */ x.createElement(Q1, {
    key: u,
    zIndex: u,
    isPanorama: r
  })));
}
var hK = ["children"];
function pK(e, t) {
  if (e == null) return {};
  var r, n, a = mK(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]);
  }
  return a;
}
function mK(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
function Sc() {
  return Sc = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Sc.apply(null, arguments);
}
var yK = {
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
}, gK = /* @__PURE__ */ x.forwardRef((e, t) => {
  var r = eP(), n = tP(), a = lP();
  if (!an(r) || !an(n))
    return null;
  var l = e.children, u = e.otherAttributes, c = e.title, f = e.desc, d, h;
  return u != null && (typeof u.tabIndex == "number" ? d = u.tabIndex : d = a ? 0 : void 0, typeof u.role == "string" ? h = u.role : h = a ? "application" : void 0), /* @__PURE__ */ x.createElement(xS, Sc({}, u, {
    title: c,
    desc: f,
    role: h,
    tabIndex: d,
    width: r,
    height: n,
    style: yK,
    ref: t
  }), l);
}), xK = (e) => {
  var t = e.children, r = se(Kc);
  if (!r)
    return null;
  var n = r.width, a = r.height, l = r.y, u = r.x;
  return /* @__PURE__ */ x.createElement(xS, {
    width: n,
    height: a,
    x: u,
    y: l
  }, t);
}, J1 = /* @__PURE__ */ x.forwardRef((e, t) => {
  var r = e.children, n = pK(e, hK), a = Ht();
  return a ? /* @__PURE__ */ x.createElement(xK, null, /* @__PURE__ */ x.createElement(Z1, {
    isPanorama: !0
  }, r)) : /* @__PURE__ */ x.createElement(gK, Sc({
    ref: t
  }, n), /* @__PURE__ */ x.createElement(Z1, {
    isPanorama: !1
  }, r));
});
function bK(e, t) {
  return PK(e) || AK(e, t) || SK(e, t) || wK();
}
function wK() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function SK(e, t) {
  if (e) {
    if (typeof e == "string") return eS(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? eS(e, t) : void 0;
  }
}
function eS(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function AK(e, t) {
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
function PK(e) {
  if (Array.isArray(e)) return e;
}
function OK() {
  var e = Fe(), t = x.useState(null), r = bK(t, 2), n = r[0], a = r[1], l = se(kT);
  return x.useEffect(() => {
    if (n != null) {
      var u = n.getBoundingClientRect(), c = u.width / n.offsetWidth;
      Oe(c) && c !== l && e(cT(c));
    }
  }, [n, e, l]), a;
}
function tS(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function EK(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? tS(Object(r), !0).forEach(function(n) {
      kK(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : tS(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function kK(e, t, r) {
  return (t = CK(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function CK(e) {
  var t = IK(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function IK(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function ai() {
  return ai = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, ai.apply(null, arguments);
}
function Ac(e, t) {
  return MK(e) || TK(e, t) || _K(e, t) || jK();
}
function jK() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function _K(e, t) {
  if (e) {
    if (typeof e == "string") return rS(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? rS(e, t) : void 0;
  }
}
function rS(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function TK(e, t) {
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
function MK(e) {
  if (Array.isArray(e)) return e;
}
var NK = () => (TB(), null);
function Pc(e) {
  if (typeof e == "number")
    return e;
  if (typeof e == "string") {
    var t = parseFloat(e);
    if (!Number.isNaN(t))
      return t;
  }
  return 0;
}
var DK = /* @__PURE__ */ x.forwardRef((e, t) => {
  var r, n, a = x.useRef(null), l = x.useState({
    containerWidth: Pc((r = e.style) === null || r === void 0 ? void 0 : r.width),
    containerHeight: Pc((n = e.style) === null || n === void 0 ? void 0 : n.height)
  }), u = Ac(l, 2), c = u[0], f = u[1], d = x.useCallback((p, y) => {
    f((b) => {
      var A = Math.round(p), w = Math.round(y);
      return b.containerWidth === A && b.containerHeight === w ? b : {
        containerWidth: A,
        containerHeight: w
      };
    });
  }, []), h = x.useCallback((p) => {
    if (typeof t == "function" && t(p), a.current != null && (a.current.disconnect(), a.current = null), p != null && typeof ResizeObserver < "u") {
      var y = p.getBoundingClientRect(), b = y.width, A = y.height;
      d(b, A);
      var w = (O) => {
        var C = O[0];
        if (C != null) {
          var I = C.contentRect, k = I.width, T = I.height;
          d(k, T);
        }
      }, S = new ResizeObserver(w);
      S.observe(p), a.current = S;
    }
  }, [t, d]);
  return x.useEffect(() => () => {
    var p = a.current;
    p != null && p.disconnect();
  }, [d]), /* @__PURE__ */ x.createElement(x.Fragment, null, /* @__PURE__ */ x.createElement($l, {
    width: c.containerWidth,
    height: c.containerHeight
  }), /* @__PURE__ */ x.createElement("div", ai({
    ref: h
  }, e)));
}), $K = /* @__PURE__ */ x.forwardRef((e, t) => {
  var r = e.width, n = e.height, a = x.useState({
    containerWidth: Pc(r),
    containerHeight: Pc(n)
  }), l = Ac(a, 2), u = l[0], c = l[1], f = x.useCallback((h, p) => {
    c((y) => {
      var b = Math.round(h), A = Math.round(p);
      return y.containerWidth === b && y.containerHeight === A ? y : {
        containerWidth: b,
        containerHeight: A
      };
    });
  }, []), d = x.useCallback((h) => {
    if (typeof t == "function" && t(h), h != null) {
      var p = h.getBoundingClientRect(), y = p.width, b = p.height;
      f(y, b);
    }
  }, [t, f]);
  return /* @__PURE__ */ x.createElement(x.Fragment, null, /* @__PURE__ */ x.createElement($l, {
    width: u.containerWidth,
    height: u.containerHeight
  }), /* @__PURE__ */ x.createElement("div", ai({
    ref: d
  }, e)));
}), RK = /* @__PURE__ */ x.forwardRef((e, t) => {
  var r = e.width, n = e.height;
  return /* @__PURE__ */ x.createElement(x.Fragment, null, /* @__PURE__ */ x.createElement($l, {
    width: r,
    height: n
  }), /* @__PURE__ */ x.createElement("div", ai({
    ref: t
  }, e)));
}), LK = /* @__PURE__ */ x.forwardRef((e, t) => {
  var r = e.width, n = e.height;
  return typeof r == "string" || typeof n == "string" ? /* @__PURE__ */ x.createElement($K, ai({}, e, {
    ref: t
  })) : typeof r == "number" && typeof n == "number" ? /* @__PURE__ */ x.createElement(RK, ai({}, e, {
    width: r,
    height: n,
    ref: t
  })) : /* @__PURE__ */ x.createElement(x.Fragment, null, /* @__PURE__ */ x.createElement($l, {
    width: r,
    height: n
  }), /* @__PURE__ */ x.createElement("div", ai({
    ref: t
  }, e)));
});
function zK(e) {
  return e ? DK : LK;
}
var BK = /* @__PURE__ */ x.forwardRef((e, t) => {
  var r = e.children, n = e.className, a = e.height, l = e.onClick, u = e.onContextMenu, c = e.onDoubleClick, f = e.onMouseDown, d = e.onMouseEnter, h = e.onMouseLeave, p = e.onMouseMove, y = e.onMouseUp, b = e.onTouchEnd, A = e.onTouchMove, w = e.onTouchStart, S = e.style, O = e.width, C = e.responsive, I = e.dispatchTouchEvents, k = I === void 0 ? !0 : I, T = x.useRef(null), E = Fe(), $ = x.useState(null), F = Ac($, 2), U = F[0], H = F[1], G = x.useState(null), W = Ac(G, 2), ne = W[0], re = W[1], le = OK(), fe = sp(), ae = (fe == null ? void 0 : fe.width) > 0 ? fe.width : O, K = (fe == null ? void 0 : fe.height) > 0 ? fe.height : a, te = x.useCallback((be) => {
    le(be), typeof t == "function" && t(be), H(be), re(be), be != null && (T.current = be);
  }, [le, t, H, re]), Y = x.useCallback((be) => {
    E(Mk(be)), E(wr({
      handler: l,
      reactEvent: be
    }));
  }, [E, l]), D = x.useCallback((be) => {
    E(Bh(be)), E(wr({
      handler: d,
      reactEvent: be
    }));
  }, [E, d]), V = x.useCallback((be) => {
    E(aE()), E(wr({
      handler: h,
      reactEvent: be
    }));
  }, [E, h]), ve = x.useCallback((be) => {
    E(Bh(be)), E(wr({
      handler: p,
      reactEvent: be
    }));
  }, [E, p]), ye = x.useCallback(() => {
    E(zk());
  }, [E]), Ae = x.useCallback(() => {
    E(Bk());
  }, [E]), Pe = x.useCallback((be) => {
    E(Lk(be.key));
  }, [E]), Ee = x.useCallback((be) => {
    E(wr({
      handler: u,
      reactEvent: be
    }));
  }, [E, u]), Ce = x.useCallback((be) => {
    E(wr({
      handler: c,
      reactEvent: be
    }));
  }, [E, c]), J = x.useCallback((be) => {
    E(wr({
      handler: f,
      reactEvent: be
    }));
  }, [E, f]), me = x.useCallback((be) => {
    E(wr({
      handler: y,
      reactEvent: be
    }));
  }, [E, y]), we = x.useCallback((be) => {
    E(wr({
      handler: w,
      reactEvent: be
    }));
  }, [E, w]), Z = x.useCallback((be) => {
    k && E(Uk(be)), E(wr({
      handler: A,
      reactEvent: be
    }));
  }, [E, k, A]), ot = x.useCallback((be) => {
    E(wr({
      handler: b,
      reactEvent: be
    }));
  }, [E, b]), Te = zK(C);
  return /* @__PURE__ */ x.createElement(CE.Provider, {
    value: U
  }, /* @__PURE__ */ x.createElement(Dj.Provider, {
    value: ne
  }, /* @__PURE__ */ x.createElement(Te, {
    width: ae ?? (S == null ? void 0 : S.width),
    height: K ?? (S == null ? void 0 : S.height),
    className: ze("recharts-wrapper", n),
    style: EK({
      position: "relative",
      cursor: "default",
      width: ae,
      height: K
    }, S),
    onClick: Y,
    onContextMenu: Ee,
    onDoubleClick: Ce,
    onFocus: ye,
    onBlur: Ae,
    onKeyDown: Pe,
    onMouseDown: J,
    onMouseEnter: D,
    onMouseLeave: V,
    onMouseMove: ve,
    onMouseUp: me,
    onTouchEnd: ot,
    onTouchMove: Z,
    onTouchStart: we,
    ref: te
  }, /* @__PURE__ */ x.createElement(NK, null), r)));
}), FK = ["width", "height", "responsive", "children", "className", "style", "compact", "title", "desc"];
function WK(e, t) {
  if (e == null) return {};
  var r, n, a = UK(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]);
  }
  return a;
}
function UK(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
var Xk = /* @__PURE__ */ x.forwardRef((e, t) => {
  var r = e.width, n = e.height, a = e.responsive, l = e.children, u = e.className, c = e.style, f = e.compact, d = e.title, h = e.desc, p = WK(e, FK), y = ar(p);
  return f ? /* @__PURE__ */ x.createElement(x.Fragment, null, /* @__PURE__ */ x.createElement($l, {
    width: r,
    height: n
  }), /* @__PURE__ */ x.createElement(J1, {
    otherAttributes: y,
    title: d,
    desc: h
  }, l)) : /* @__PURE__ */ x.createElement(BK, {
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
  }, /* @__PURE__ */ x.createElement(J1, {
    otherAttributes: y,
    title: d,
    desc: h,
    ref: t
  }, /* @__PURE__ */ x.createElement(M5, null, l)));
});
function Fh() {
  return Fh = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Fh.apply(null, arguments);
}
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
function KK(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? nS(Object(r), !0).forEach(function(n) {
      HK(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : nS(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function HK(e, t, r) {
  return (t = VK(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function VK(e) {
  var t = GK(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function GK(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var YK = {
  top: 5,
  right: 5,
  bottom: 5,
  left: 5
}, qK = KK({
  accessibilityLayer: !0,
  barCategoryGap: "10%",
  barGap: 4,
  layout: "horizontal",
  margin: YK,
  responsive: !1,
  reverseStackOrder: !1,
  stackOffset: "none",
  syncMethod: "index"
}, qm), Qk = /* @__PURE__ */ x.forwardRef(function(t, r) {
  var n, a = Ut(t.categoricalChartProps, qK), l = t.chartName, u = t.defaultTooltipEventType, c = t.validateTooltipEventTypes, f = t.tooltipPayloadSearcher, d = t.categoricalChartProps, h = {
    chartName: l,
    defaultTooltipEventType: u,
    validateTooltipEventTypes: c,
    tooltipPayloadSearcher: f,
    eventEmitter: void 0
  };
  return /* @__PURE__ */ x.createElement(Vk, {
    preloadedState: {
      options: h
    },
    reduxStoreName: (n = d.id) !== null && n !== void 0 ? n : l
  }, /* @__PURE__ */ x.createElement(sk, {
    chartData: d.data
  }), /* @__PURE__ */ x.createElement(Gk, {
    layout: a.layout,
    margin: a.margin
  }), /* @__PURE__ */ x.createElement(qk, {
    throttleDelay: a.throttleDelay,
    throttledEvents: a.throttledEvents
  }), /* @__PURE__ */ x.createElement(Yk, {
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
  }), /* @__PURE__ */ x.createElement(Xk, Fh({}, a, {
    ref: r
  })));
}), XK = ["axis", "item"], Oc = /* @__PURE__ */ x.forwardRef((e, t) => /* @__PURE__ */ x.createElement(Qk, {
  chartName: "BarChart",
  defaultTooltipEventType: "axis",
  validateTooltipEventTypes: XK,
  tooltipPayloadSearcher: wm,
  categoricalChartProps: e,
  ref: t
}));
function QK(e) {
  var t = Fe();
  return x.useEffect(() => {
    t(iK(e));
  }, [t, e]), null;
}
var ZK = ["layout"];
function Wh() {
  return Wh = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Wh.apply(null, arguments);
}
function JK(e, t) {
  if (e == null) return {};
  var r, n, a = e9(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]);
  }
  return a;
}
function e9(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
function iS(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function t9(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? iS(Object(r), !0).forEach(function(n) {
      r9(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : iS(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function r9(e, t, r) {
  return (t = n9(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function n9(e) {
  var t = i9(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function i9(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var a9 = {
  top: 5,
  right: 5,
  bottom: 5,
  left: 5
}, Zk = t9({
  accessibilityLayer: !0,
  stackOffset: "none",
  barCategoryGap: "10%",
  barGap: 4,
  margin: a9,
  reverseStackOrder: !1,
  syncMethod: "index",
  layout: "radial",
  responsive: !1,
  cx: "50%",
  cy: "50%",
  innerRadius: 0,
  outerRadius: "80%"
}, qm), o9 = /* @__PURE__ */ x.forwardRef(function(t, r) {
  var n, a = Ut(t.categoricalChartProps, Zk), l = a.layout, u = JK(a, ZK), c = t.chartName, f = t.defaultTooltipEventType, d = t.validateTooltipEventTypes, h = t.tooltipPayloadSearcher, p = {
    chartName: c,
    defaultTooltipEventType: f,
    validateTooltipEventTypes: d,
    tooltipPayloadSearcher: h,
    eventEmitter: void 0
  };
  return /* @__PURE__ */ x.createElement(Vk, {
    preloadedState: {
      options: p
    },
    reduxStoreName: (n = a.id) !== null && n !== void 0 ? n : c
  }, /* @__PURE__ */ x.createElement(sk, {
    chartData: a.data
  }), /* @__PURE__ */ x.createElement(Gk, {
    layout: l,
    margin: a.margin
  }), /* @__PURE__ */ x.createElement(qk, {
    throttleDelay: a.throttleDelay,
    throttledEvents: a.throttledEvents
  }), /* @__PURE__ */ x.createElement(Yk, {
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
  }), /* @__PURE__ */ x.createElement(QK, {
    cx: a.cx,
    cy: a.cy,
    startAngle: a.startAngle,
    endAngle: a.endAngle,
    innerRadius: a.innerRadius,
    outerRadius: a.outerRadius
  }), /* @__PURE__ */ x.createElement(Xk, Wh({}, u, {
    ref: r
  })));
});
function aS(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function oS(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? aS(Object(r), !0).forEach(function(n) {
      l9(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : aS(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function l9(e, t, r) {
  return (t = u9(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function u9(e) {
  var t = s9(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function s9(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var c9 = ["item"], f9 = oS(oS({}, Zk), {}, {
  layout: "centric",
  startAngle: 0,
  endAngle: 360
}), Jk = /* @__PURE__ */ x.forwardRef((e, t) => {
  var r = Ut(e, f9);
  return /* @__PURE__ */ x.createElement(o9, {
    chartName: "PieChart",
    defaultTooltipEventType: "item",
    validateTooltipEventTypes: c9,
    tooltipPayloadSearcher: wm,
    categoricalChartProps: r,
    ref: t
  });
}), d9 = ["axis"], v9 = /* @__PURE__ */ x.forwardRef((e, t) => /* @__PURE__ */ x.createElement(Qk, {
  chartName: "AreaChart",
  defaultTooltipEventType: "axis",
  validateTooltipEventTypes: d9,
  tooltipPayloadSearcher: wm,
  categoricalChartProps: e,
  ref: t
}));
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const h9 = (e) => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), eC = (...e) => e.filter((t, r, n) => !!t && t.trim() !== "" && n.indexOf(t) === r).join(" ").trim();
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var p9 = {
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
const m9 = x.forwardRef(
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
      ...p9,
      width: t,
      height: t,
      stroke: e,
      strokeWidth: n ? Number(r) * 24 / Number(t) : r,
      className: eC("lucide", a),
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
const Mt = (e, t) => {
  const r = x.forwardRef(
    ({ className: n, ...a }, l) => x.createElement(m9, {
      ref: l,
      iconNode: t,
      className: eC(`lucide-${h9(e)}`, n),
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
const y9 = Mt("Ban", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m4.9 4.9 14.2 14.2", key: "1m5liu" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const tC = Mt("ChevronLeft", [
  ["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const rC = Mt("ChevronRight", [
  ["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const g9 = Mt("CircleCheck", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const x9 = Mt("Contact", [
  ["path", { d: "M16 2v2", key: "scm5qe" }],
  ["path", { d: "M7 22v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2", key: "1waht3" }],
  ["path", { d: "M8 2v2", key: "pbkmx" }],
  ["circle", { cx: "12", cy: "11", r: "3", key: "itu57m" }],
  ["rect", { x: "3", y: "4", width: "18", height: "18", rx: "2", key: "12vinp" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const b9 = Mt("Database", [
  ["ellipse", { cx: "12", cy: "5", rx: "9", ry: "3", key: "msslwz" }],
  ["path", { d: "M3 5V19A9 3 0 0 0 21 19V5", key: "1wlel7" }],
  ["path", { d: "M3 12A9 3 0 0 0 21 12", key: "mv7ke4" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const w9 = Mt("FileCheck2", [
  ["path", { d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4", key: "1pf5j1" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "m3 15 2 2 4-4", key: "1lhrkk" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const S9 = Mt("FileClock", [
  ["path", { d: "M16 22h2a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3", key: "37hlfg" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["circle", { cx: "8", cy: "16", r: "6", key: "10v15b" }],
  ["path", { d: "M9.5 17.5 8 16.25V14", key: "1o80t2" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const A9 = Mt("FileSearch", [
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  [
    "path",
    { d: "M4.268 21a2 2 0 0 0 1.727 1H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3", key: "ms7g94" }
  ],
  ["path", { d: "m9 18-1.5-1.5", key: "1j6qii" }],
  ["circle", { cx: "5", cy: "14", r: "3", key: "ufru5t" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const P9 = Mt("MessageCircle", [
  ["path", { d: "M7.9 20A9 9 0 1 0 4 16.1L2 22Z", key: "vv11sd" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const O9 = Mt("MessageSquareMore", [
  ["path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z", key: "1lielz" }],
  ["path", { d: "M8 10h.01", key: "19clt8" }],
  ["path", { d: "M12 10h.01", key: "1nrarc" }],
  ["path", { d: "M16 10h.01", key: "1m94wz" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const E9 = Mt("PenLine", [
  ["path", { d: "M12 20h9", key: "t2du7b" }],
  [
    "path",
    {
      d: "M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z",
      key: "1ykcvy"
    }
  ]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const k9 = Mt("Phone", [
  [
    "path",
    {
      d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
      key: "foiqr5"
    }
  ]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const C9 = Mt("RefreshCw", [
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
const nC = Mt("RotateCcw", [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const lS = Mt("Search", [
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
  ["path", { d: "m21 21-4.3-4.3", key: "1qie3q" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const uS = Mt("TriangleAlert", [
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
async function I9(e) {
  const t = new URLSearchParams(), r = { entryStart: "entry_start", entryEnd: "entry_end", resolutionStart: "resolution_start", resolutionEnd: "resolution_end", state: "state", resolution: "resolution", cnj: "cnj", integration: "integration", groupBy: "group_by", page: "page", pageSize: "page_size", sortBy: "sort_by", sortDirection: "sort_direction" };
  if (Object.entries(e).forEach(([n, a]) => {
    a !== "" && t.set(r[n], String(a));
  }), !window.MBA_AUTOMATION_API) throw new Error("A API do Backoffice não foi inicializada.");
  return window.MBA_AUTOMATION_API.request(`/api/carteira-processual?${t}`);
}
const j9 = new Intl.NumberFormat("pt-BR"), _9 = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }), nr = (e) => j9.format(e), sS = (e) => _9.format(e), cS = (e) => e.split("-").reverse().join("/");
async function T9(e = 1) {
  if (!window.MBA_AUTOMATION_API) throw new Error("A API do Backoffice não foi inicializada.");
  return window.MBA_AUTOMATION_API.request(`/api/acordos-indicadores?page=${e}&page_size=10`);
}
const M9 = [
  { label: "Acordo recusado", icon: y9, tone: "red" },
  { label: "Em negociação", icon: P9, tone: "amber" },
  { label: "Caso devolvido", icon: nC, tone: "gray" },
  { label: "Pendente Contato", icon: x9, tone: "blue" },
  { label: "Acordo Fechado", icon: g9, tone: "green" }
], N9 = [
  { label: "Tratar Whatsapp", icon: O9 },
  { label: "Cobrar Minuta", icon: S9 },
  { label: "Validar Minuta", icon: w9 },
  { label: "Tratar Contraproposta", icon: C9 },
  { label: "Assinar Minuta", icon: E9 },
  { label: "Ligar", icon: k9 }
], Xv = { border: "1px solid #dce5ed", borderRadius: 8, boxShadow: "0 5px 14px rgba(17,42,66,.08)", fontSize: 11 };
function fS(e, t) {
  var r;
  return ((r = e.find((n) => n.label.localeCompare(t, "pt-BR", { sensitivity: "base" }) === 0)) == null ? void 0 : r.value) ?? 0;
}
function dS({ label: e, value: t, icon: r, tone: n = "blue" }) {
  return /* @__PURE__ */ _.jsxs("article", { className: `agreements-mini ${n}`, children: [
    /* @__PURE__ */ _.jsx("span", { className: "agreements-mini-icon", children: /* @__PURE__ */ _.jsx(r, {}) }),
    /* @__PURE__ */ _.jsxs("div", { children: [
      /* @__PURE__ */ _.jsx("span", { children: e }),
      /* @__PURE__ */ _.jsx("strong", { children: nr(t) })
    ] })
  ] });
}
function D9(e) {
  const t = (e == null ? void 0 : e.toLocaleLowerCase("pt-BR")) ?? "";
  return t === "acordo fechado" ? "green" : t === "em negociação" ? "amber" : t === "acordo recusado" ? "red" : t === "pendente contato" ? "blue" : "gray";
}
function $9() {
  const [e, t] = x.useState(null), [r, n] = x.useState(1), [a, l] = x.useState(!0), [u, c] = x.useState(""), f = x.useCallback(async () => {
    l(!0), c("");
    try {
      t(await T9(r));
    } catch (h) {
      c(h instanceof Error ? h.message : "Não foi possível consultar os acordos.");
    } finally {
      l(!1);
    }
  }, [r]);
  x.useEffect(() => {
    f();
  }, [f]);
  const d = x.useMemo(() => (e == null ? void 0 : e.por_tipo.reduce((h, p) => h + p.value, 0)) ?? 0, [e]);
  return u ? /* @__PURE__ */ _.jsxs("section", { className: "agreements-section agreements-section-error", children: [
    /* @__PURE__ */ _.jsxs("div", { children: [
      /* @__PURE__ */ _.jsx("strong", { children: "ACORDOS — RESUMO POR SITUAÇÃO E TAREFA" }),
      /* @__PURE__ */ _.jsx("span", { children: u })
    ] }),
    /* @__PURE__ */ _.jsx("button", { type: "button", onClick: () => void f(), children: "Tentar novamente" })
  ] }) : e ? /* @__PURE__ */ _.jsxs("section", { className: "agreements-section", "aria-labelledby": "agreements-indicators-title", children: [
    /* @__PURE__ */ _.jsxs("header", { className: "agreements-heading", children: [
      /* @__PURE__ */ _.jsxs("div", { children: [
        /* @__PURE__ */ _.jsx("h2", { id: "agreements-indicators-title", children: "ACORDOS — RESUMO POR SITUAÇÃO E TAREFA" }),
        /* @__PURE__ */ _.jsx("p", { children: "Indicadores calculados diretamente da carteira de acordos." })
      ] }),
      /* @__PURE__ */ _.jsxs("div", { className: "agreements-totals", children: [
        /* @__PURE__ */ _.jsxs("span", { children: [
          /* @__PURE__ */ _.jsx("small", { children: "REGISTROS" }),
          /* @__PURE__ */ _.jsx("strong", { children: nr(e.summary.total) })
        ] }),
        e.summary.proposta_total !== null && /* @__PURE__ */ _.jsxs("span", { children: [
          /* @__PURE__ */ _.jsx("small", { children: "TOTAL PROPOSTAS" }),
          /* @__PURE__ */ _.jsx("strong", { children: sS(e.summary.proposta_total) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ _.jsxs("div", { className: "agreements-kpi-block", children: [
      /* @__PURE__ */ _.jsx("h3", { children: "Por situação" }),
      /* @__PURE__ */ _.jsx("div", { className: "agreements-situation-grid", children: M9.map((h) => /* @__PURE__ */ _.jsx(dS, { ...h, value: fS(e.por_situacao, h.label) }, h.label)) })
    ] }),
    /* @__PURE__ */ _.jsxs("div", { className: "agreements-kpi-block", children: [
      /* @__PURE__ */ _.jsxs("h3", { children: [
        "Por tarefa ",
        /* @__PURE__ */ _.jsxs("small", { children: [
          nr(e.quality.tarefas_validas),
          " registros com tarefa"
        ] })
      ] }),
      /* @__PURE__ */ _.jsx("div", { className: "agreements-task-grid", children: N9.map((h) => /* @__PURE__ */ _.jsx(dS, { ...h, value: fS(e.por_tarefa, h.label) }, h.label)) })
    ] }),
    /* @__PURE__ */ _.jsxs("div", { className: "agreements-charts", children: [
      /* @__PURE__ */ _.jsxs("article", { children: [
        /* @__PURE__ */ _.jsx("h3", { children: "Acordos por Situação" }),
        /* @__PURE__ */ _.jsx("div", { className: "agreements-chart-body", children: /* @__PURE__ */ _.jsx(Ni, { width: "100%", height: "100%", children: /* @__PURE__ */ _.jsxs(Oc, { data: e.por_situacao, layout: "vertical", margin: { top: 2, right: 28, bottom: 2, left: 10 }, children: [
          /* @__PURE__ */ _.jsx(Ba, { type: "number", hide: !0 }),
          /* @__PURE__ */ _.jsx(Fa, { type: "category", dataKey: "label", width: 105, tick: { fill: "#5c7084", fontSize: 9 }, axisLine: !1, tickLine: !1 }),
          /* @__PURE__ */ _.jsx(Li, { contentStyle: Xv, formatter: (h) => [nr(Number(h)), "Acordos"] }),
          /* @__PURE__ */ _.jsx(Tl, { dataKey: "value", fill: "#0a5fa8", radius: [0, 4, 4, 0], label: { position: "right", fill: "#52677a", fontSize: 9 } })
        ] }) }) })
      ] }),
      /* @__PURE__ */ _.jsxs("article", { children: [
        /* @__PURE__ */ _.jsx("h3", { children: "Acordos por Tarefa" }),
        /* @__PURE__ */ _.jsx("div", { className: "agreements-chart-body", children: /* @__PURE__ */ _.jsx(Ni, { width: "100%", height: "100%", children: /* @__PURE__ */ _.jsxs(Oc, { data: e.por_tarefa, layout: "vertical", margin: { top: 2, right: 28, bottom: 2, left: 10 }, children: [
          /* @__PURE__ */ _.jsx(Ba, { type: "number", hide: !0 }),
          /* @__PURE__ */ _.jsx(Fa, { type: "category", dataKey: "label", width: 112, tick: { fill: "#5c7084", fontSize: 9 }, axisLine: !1, tickLine: !1 }),
          /* @__PURE__ */ _.jsx(Li, { contentStyle: Xv, formatter: (h) => [nr(Number(h)), "Acordos"] }),
          /* @__PURE__ */ _.jsx(Tl, { dataKey: "value", fill: "#2c81c7", radius: [0, 4, 4, 0], label: { position: "right", fill: "#52677a", fontSize: 9 } })
        ] }) }) })
      ] }),
      /* @__PURE__ */ _.jsxs("article", { children: [
        /* @__PURE__ */ _.jsx("h3", { children: "Acordos por Tipo" }),
        /* @__PURE__ */ _.jsxs("div", { className: "agreements-donut", children: [
          /* @__PURE__ */ _.jsxs("div", { className: "agreements-donut-chart", children: [
            /* @__PURE__ */ _.jsx(Ni, { width: "100%", height: "100%", children: /* @__PURE__ */ _.jsxs(Jk, { children: [
              /* @__PURE__ */ _.jsx(Lm, { data: e.por_tipo, dataKey: "value", nameKey: "label", innerRadius: "62%", outerRadius: "84%", paddingAngle: 2, stroke: "none", children: e.por_tipo.map((h, p) => /* @__PURE__ */ _.jsx(lo, { fill: p === 0 ? "#0a5fa8" : p === 1 ? "#79acd3" : "#8ba0b3" }, h.label)) }),
              /* @__PURE__ */ _.jsx(Li, { contentStyle: Xv, formatter: (h) => [nr(Number(h)), "Acordos"] })
            ] }) }),
            /* @__PURE__ */ _.jsxs("div", { className: "agreements-donut-center", children: [
              /* @__PURE__ */ _.jsx("strong", { children: nr(d) }),
              /* @__PURE__ */ _.jsx("span", { children: "Total" })
            ] })
          ] }),
          /* @__PURE__ */ _.jsx("div", { className: "agreements-donut-legend", children: e.por_tipo.map((h, p) => /* @__PURE__ */ _.jsxs("span", { children: [
            /* @__PURE__ */ _.jsx("i", { className: `type-${Math.min(p, 2)}` }),
            /* @__PURE__ */ _.jsx("b", { children: h.label }),
            /* @__PURE__ */ _.jsx("small", { children: nr(h.value) })
          ] }, h.label)) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ _.jsxs("div", { className: "agreements-table-card", children: [
      /* @__PURE__ */ _.jsx("div", { className: "agreements-table-title", children: /* @__PURE__ */ _.jsxs("div", { children: [
        /* @__PURE__ */ _.jsx("h3", { children: "Registros de acordos" }),
        /* @__PURE__ */ _.jsxs("span", { children: [
          nr(e.table.total),
          " registros na base"
        ] })
      ] }) }),
      /* @__PURE__ */ _.jsx("div", { className: "agreements-table-scroll", children: /* @__PURE__ */ _.jsxs("table", { children: [
        /* @__PURE__ */ _.jsx("thead", { children: /* @__PURE__ */ _.jsxs("tr", { children: [
          /* @__PURE__ */ _.jsx("th", { children: "CNJ" }),
          /* @__PURE__ */ _.jsx("th", { children: "Situação" }),
          /* @__PURE__ */ _.jsx("th", { children: "Tipo" }),
          /* @__PURE__ */ _.jsx("th", { children: "Tarefa" }),
          /* @__PURE__ */ _.jsx("th", { children: "Proposta" })
        ] }) }),
        /* @__PURE__ */ _.jsx("tbody", { children: a ? /* @__PURE__ */ _.jsx("tr", { children: /* @__PURE__ */ _.jsx("td", { colSpan: 5, className: "agreements-table-state", children: "Carregando…" }) }) : e.table.rows.map((h) => /* @__PURE__ */ _.jsxs("tr", { children: [
          /* @__PURE__ */ _.jsx("td", { children: h.cnj ?? "—" }),
          /* @__PURE__ */ _.jsx("td", { children: /* @__PURE__ */ _.jsx("span", { className: `agreements-badge ${D9(h.situacao)}`, children: h.situacao ?? "Não informado" }) }),
          /* @__PURE__ */ _.jsx("td", { children: h.tipo ?? "—" }),
          /* @__PURE__ */ _.jsx("td", { children: h.tarefa ?? "—" }),
          /* @__PURE__ */ _.jsx("td", { className: "agreements-money", children: h.proposta === null ? "—" : sS(h.proposta) })
        ] }, h.id)) })
      ] }) }),
      /* @__PURE__ */ _.jsxs("footer", { children: [
        /* @__PURE__ */ _.jsxs("span", { children: [
          "Página ",
          e.table.page,
          " de ",
          Math.max(1, e.table.total_pages)
        ] }),
        /* @__PURE__ */ _.jsxs("div", { children: [
          /* @__PURE__ */ _.jsx("button", { disabled: r <= 1 || a, onClick: () => n((h) => h - 1), children: /* @__PURE__ */ _.jsx(tC, {}) }),
          /* @__PURE__ */ _.jsx("button", { disabled: r >= e.table.total_pages || a, onClick: () => n((h) => h + 1), children: /* @__PURE__ */ _.jsx(rC, {}) })
        ] })
      ] })
    ] })
  ] }) : /* @__PURE__ */ _.jsx("section", { className: "agreements-section agreements-section-loading", "aria-label": "Carregando indicadores de acordos", children: /* @__PURE__ */ _.jsx("span", { children: "Carregando indicadores de acordos…" }) });
}
const vS = { entryStart: "", entryEnd: "", resolutionStart: "", resolutionEnd: "", state: "", resolution: "", cnj: "", integration: "", groupBy: "month", page: 1, pageSize: 25, sortBy: "date", sortDirection: "desc" }, Es = ["#0a5fa8", "#2c81c7", "#78aeda", "#183d67", "#6b8aa8", "#9cb8d2", "#b9cce0"], ks = { border: "1px solid #dfe6ed", borderRadius: 8, boxShadow: "0 6px 18px rgba(17,42,66,.10)", fontSize: 12 };
function ul({ title: e, value: t, note: r }) {
  return /* @__PURE__ */ _.jsxs("article", { className: "carteira-metric", children: [
    /* @__PURE__ */ _.jsx("span", { children: e }),
    /* @__PURE__ */ _.jsx("strong", { children: t }),
    /* @__PURE__ */ _.jsx("small", { children: r })
  ] });
}
function sl({ title: e, children: t }) {
  return /* @__PURE__ */ _.jsxs("article", { className: "carteira-chart", children: [
    /* @__PURE__ */ _.jsx("h2", { children: e }),
    t
  ] });
}
function cl({ message: e = "Não há dados para os filtros selecionados." }) {
  return /* @__PURE__ */ _.jsxs("div", { className: "carteira-empty", children: [
    /* @__PURE__ */ _.jsx(b9, {}),
    /* @__PURE__ */ _.jsx("span", { children: e })
  ] });
}
function R9() {
  const [e, t] = x.useState(vS), [r, n] = x.useState(null), [a, l] = x.useState(""), [u, c] = x.useState(!0), f = x.useCallback(async (w) => {
    c(!0), l("");
    try {
      n(await I9(w));
    } catch (S) {
      l(S instanceof Error ? S.message : "Não foi possível carregar a carteira.");
    } finally {
      c(!1);
    }
  }, []);
  x.useEffect(() => {
    f(e);
  }, [e, f]);
  const d = (w) => t((S) => ({ ...S, ...w, page: w.page ?? 1 })), h = x.useMemo(() => (r == null ? void 0 : r.filters.states) ?? [], [r]), p = x.useMemo(() => (r == null ? void 0 : r.filters.resolutions) ?? [], [r]), y = r ? Math.max(1, Math.ceil(r.table.total / r.table.page_size)) : 1, b = (w) => d({ sortBy: w, sortDirection: e.sortBy === w && e.sortDirection === "asc" ? "desc" : "asc" }), A = (w, S) => /* @__PURE__ */ _.jsxs("button", { type: "button", className: "carteira-sort", onClick: () => b(S), children: [
    w,
    e.sortBy === S ? e.sortDirection === "asc" ? " ↑" : " ↓" : ""
  ] });
  return a ? /* @__PURE__ */ _.jsxs("section", { className: "carteira-error", children: [
    /* @__PURE__ */ _.jsx(uS, {}),
    /* @__PURE__ */ _.jsxs("div", { children: [
      /* @__PURE__ */ _.jsx("strong", { children: "Carteira Processual indisponível" }),
      /* @__PURE__ */ _.jsx("span", { children: a })
    ] }),
    /* @__PURE__ */ _.jsx("button", { onClick: () => void f(e), children: "Tentar novamente" })
  ] }) : /* @__PURE__ */ _.jsxs("div", { className: "carteira-page", children: [
    /* @__PURE__ */ _.jsx("header", { className: "carteira-header", children: /* @__PURE__ */ _.jsxs("div", { children: [
      /* @__PURE__ */ _.jsx("p", { children: "GESTÃO PROCESSUAL" }),
      /* @__PURE__ */ _.jsx("h1", { children: "Carteira Processual" }),
      /* @__PURE__ */ _.jsx("span", { children: "Visão analítica da base operacional, atualizada pelos filtros selecionados." })
    ] }) }),
    /* @__PURE__ */ _.jsxs("section", { className: "carteira-filters", "aria-label": "Filtros globais", children: [
      /* @__PURE__ */ _.jsxs("div", { className: "carteira-filter-title", children: [
        /* @__PURE__ */ _.jsx(A9, {}),
        /* @__PURE__ */ _.jsx("span", { children: "Filtros globais" })
      ] }),
      /* @__PURE__ */ _.jsxs("label", { children: [
        "Entrada — início",
        /* @__PURE__ */ _.jsx("input", { type: "date", value: e.entryStart, onChange: (w) => d({ entryStart: w.target.value }) })
      ] }),
      /* @__PURE__ */ _.jsxs("label", { children: [
        "Entrada — fim",
        /* @__PURE__ */ _.jsx("input", { type: "date", value: e.entryEnd, onChange: (w) => d({ entryEnd: w.target.value }) })
      ] }),
      /* @__PURE__ */ _.jsxs("label", { children: [
        "Resolução — início",
        /* @__PURE__ */ _.jsx("input", { type: "date", value: e.resolutionStart, onChange: (w) => d({ resolutionStart: w.target.value }) })
      ] }),
      /* @__PURE__ */ _.jsxs("label", { children: [
        "Resolução — fim",
        /* @__PURE__ */ _.jsx("input", { type: "date", value: e.resolutionEnd, onChange: (w) => d({ resolutionEnd: w.target.value }) })
      ] }),
      /* @__PURE__ */ _.jsxs("label", { children: [
        "UF",
        /* @__PURE__ */ _.jsxs("select", { value: e.state, onChange: (w) => d({ state: w.target.value }), children: [
          /* @__PURE__ */ _.jsx("option", { value: "", children: "Todas" }),
          h.map((w) => /* @__PURE__ */ _.jsx("option", { children: w }, w))
        ] })
      ] }),
      /* @__PURE__ */ _.jsxs("label", { children: [
        "Resolution",
        /* @__PURE__ */ _.jsxs("select", { value: e.resolution, onChange: (w) => d({ resolution: w.target.value }), children: [
          /* @__PURE__ */ _.jsx("option", { value: "", children: "Todas" }),
          p.map((w) => /* @__PURE__ */ _.jsx("option", { children: w }, w))
        ] })
      ] }),
      /* @__PURE__ */ _.jsxs("button", { className: "carteira-clear", type: "button", onClick: () => t(vS), children: [
        /* @__PURE__ */ _.jsx(nC, {}),
        "Limpar filtros"
      ] })
    ] }),
    r && /* @__PURE__ */ _.jsxs("div", { className: "carteira-schema-note", children: [
      /* @__PURE__ */ _.jsx(uS, {}),
      " A tabela atual não possui Tema, Matéria, Encerrado, Apto a encerramento ou Tipo de encerramento; essas análises não são estimadas."
    ] }),
    /* @__PURE__ */ _.jsxs("section", { className: "carteira-kpis", children: [
      /* @__PURE__ */ _.jsx(ul, { title: "Total de processos", value: nr((r == null ? void 0 : r.summary.total) ?? 0), note: "Considerando os filtros globais" }),
      /* @__PURE__ */ _.jsx(ul, { title: "Entradas", value: nr((r == null ? void 0 : r.summary.entries) ?? 0), note: "Registros com data de entrada" }),
      /* @__PURE__ */ _.jsx(ul, { title: "Processos ativos", value: "—", note: "Campo encerrado indisponível na base" }),
      /* @__PURE__ */ _.jsx(ul, { title: "Processos encerrados", value: "—", note: "Campo encerrado indisponível na base" }),
      /* @__PURE__ */ _.jsx(ul, { title: "Aptos a encerramento", value: "—", note: "Campo apto_encerramento indisponível" })
    ] }),
    /* @__PURE__ */ _.jsx($9, {}),
    /* @__PURE__ */ _.jsxs("section", { className: "carteira-grid carteira-grid-top", children: [
      /* @__PURE__ */ _.jsxs(sl, { title: "Entradas ao longo do tempo", children: [
        /* @__PURE__ */ _.jsx("div", { className: "carteira-chart-action", children: /* @__PURE__ */ _.jsxs("label", { children: [
          "Agrupar",
          /* @__PURE__ */ _.jsxs("select", { value: e.groupBy, onChange: (w) => d({ groupBy: w.target.value }), children: [
            /* @__PURE__ */ _.jsx("option", { value: "day", children: "Dia" }),
            /* @__PURE__ */ _.jsx("option", { value: "week", children: "Semana" }),
            /* @__PURE__ */ _.jsx("option", { value: "month", children: "Mês" })
          ] })
        ] }) }),
        r != null && r.charts.entradas_timeline.length ? /* @__PURE__ */ _.jsx("div", { className: "carteira-chart-body", children: /* @__PURE__ */ _.jsx(Ni, { width: "100%", height: "100%", children: /* @__PURE__ */ _.jsxs(v9, { data: r.charts.entradas_timeline, margin: { top: 8, right: 12, left: -24, bottom: 0 }, children: [
          /* @__PURE__ */ _.jsx(Nh, { vertical: !1, stroke: "#e6edf3" }),
          /* @__PURE__ */ _.jsx(Ba, { dataKey: "label", tick: { fontSize: 10, fill: "#617286" }, tickLine: !1 }),
          /* @__PURE__ */ _.jsx(Fa, { allowDecimals: !1, tick: { fontSize: 10, fill: "#617286" }, tickLine: !1, axisLine: !1 }),
          /* @__PURE__ */ _.jsx(Li, { contentStyle: ks, formatter: (w) => [nr(Number(w)), "Processos"] }),
          /* @__PURE__ */ _.jsx(kk, { type: "monotone", dataKey: "value", stroke: "#0a5fa8", fill: "#dcecf8", strokeWidth: 2 })
        ] }) }) }) : /* @__PURE__ */ _.jsx(cl, {})
      ] }),
      /* @__PURE__ */ _.jsx(sl, { title: "Processos por UF", children: r != null && r.charts.por_uf.length ? /* @__PURE__ */ _.jsx("div", { className: "carteira-chart-body", children: /* @__PURE__ */ _.jsx(Ni, { width: "100%", height: "100%", children: /* @__PURE__ */ _.jsxs(Oc, { data: r.charts.por_uf, layout: "vertical", margin: { top: 2, right: 28, left: 0, bottom: 2 }, children: [
        /* @__PURE__ */ _.jsx(Ba, { type: "number", hide: !0 }),
        /* @__PURE__ */ _.jsx(Fa, { type: "category", dataKey: "label", width: 72, tick: { fontSize: 11, fill: "#617286" }, tickLine: !1, axisLine: !1 }),
        /* @__PURE__ */ _.jsx(Li, { contentStyle: ks }),
        /* @__PURE__ */ _.jsx(Tl, { dataKey: "value", fill: "#0a5fa8", radius: [0, 4, 4, 0], label: { position: "right", fontSize: 10, fill: "#526477" } })
      ] }) }) }) : /* @__PURE__ */ _.jsx(cl, {}) })
    ] }),
    /* @__PURE__ */ _.jsxs("section", { className: "carteira-grid carteira-grid-bottom", children: [
      /* @__PURE__ */ _.jsx(sl, { title: "Distribuição de aging", children: r != null && r.charts.aging.length ? /* @__PURE__ */ _.jsx("div", { className: "carteira-chart-body", children: /* @__PURE__ */ _.jsx(Ni, { width: "100%", height: "100%", children: /* @__PURE__ */ _.jsxs(Oc, { data: r.charts.aging, margin: { top: 8, right: 10, left: -20, bottom: 0 }, children: [
        /* @__PURE__ */ _.jsx(Nh, { vertical: !1, stroke: "#e6edf3" }),
        /* @__PURE__ */ _.jsx(Ba, { dataKey: "label", tick: { fontSize: 10, fill: "#617286" }, tickLine: !1 }),
        /* @__PURE__ */ _.jsx(Fa, { allowDecimals: !1, tick: { fontSize: 10, fill: "#617286" }, tickLine: !1, axisLine: !1 }),
        /* @__PURE__ */ _.jsx(Li, { contentStyle: ks }),
        /* @__PURE__ */ _.jsx(Tl, { dataKey: "value", fill: "#2c81c7", radius: [4, 4, 0, 0] })
      ] }) }) }) : /* @__PURE__ */ _.jsx(cl, {}) }),
      /* @__PURE__ */ _.jsx(sl, { title: "Situação CPJ", children: r != null && r.charts.por_situacao.length ? /* @__PURE__ */ _.jsxs("div", { className: "carteira-donut", children: [
        /* @__PURE__ */ _.jsx(Ni, { width: "100%", height: "100%", children: /* @__PURE__ */ _.jsxs(Jk, { children: [
          /* @__PURE__ */ _.jsx(Lm, { data: r.charts.por_situacao, dataKey: "value", nameKey: "label", innerRadius: "55%", outerRadius: "82%", paddingAngle: 2, children: r.charts.por_situacao.map((w, S) => /* @__PURE__ */ _.jsx(lo, { fill: Es[S % Es.length] }, w.label)) }),
          /* @__PURE__ */ _.jsx(Li, { contentStyle: ks })
        ] }) }),
        /* @__PURE__ */ _.jsx("div", { className: "carteira-legend", children: r.charts.por_situacao.slice(0, 6).map((w, S) => /* @__PURE__ */ _.jsxs("span", { children: [
          /* @__PURE__ */ _.jsx("i", { style: { background: Es[S % Es.length] } }),
          w.label,
          " ",
          /* @__PURE__ */ _.jsx("b", { children: nr(w.value) })
        ] }, w.label)) })
      ] }) : /* @__PURE__ */ _.jsx(cl, {}) }),
      /* @__PURE__ */ _.jsx(sl, { title: "Tipo de encerramento", children: /* @__PURE__ */ _.jsx(cl, { message: "Campo tipo_encerramento não existe na base atual." }) })
    ] }),
    /* @__PURE__ */ _.jsxs("section", { className: "carteira-table-section", children: [
      /* @__PURE__ */ _.jsxs("div", { className: "carteira-table-heading", children: [
        /* @__PURE__ */ _.jsxs("div", { children: [
          /* @__PURE__ */ _.jsx("h2", { children: "Base de Processos" }),
          /* @__PURE__ */ _.jsx("span", { children: "Consulta paginada no servidor" })
        ] }),
        /* @__PURE__ */ _.jsxs("div", { className: "carteira-searches", children: [
          /* @__PURE__ */ _.jsxs("label", { children: [
            /* @__PURE__ */ _.jsx(lS, {}),
            /* @__PURE__ */ _.jsx("input", { placeholder: "Buscar por CNJ", value: e.cnj, onChange: (w) => d({ cnj: w.target.value }) })
          ] }),
          /* @__PURE__ */ _.jsxs("label", { children: [
            /* @__PURE__ */ _.jsx(lS, {}),
            /* @__PURE__ */ _.jsx("input", { placeholder: "Buscar por integração", value: e.integration, onChange: (w) => d({ integration: w.target.value }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ _.jsx("div", { className: "carteira-table-wrap", children: /* @__PURE__ */ _.jsxs("table", { children: [
        /* @__PURE__ */ _.jsx("thead", { children: /* @__PURE__ */ _.jsxs("tr", { children: [
          A("CNJ", "cnj"),
          A("Integração", "integration"),
          A("Data de entrada", "date"),
          A("UF", "state"),
          /* @__PURE__ */ _.jsx("th", { children: "Aging" }),
          A("Resolution", "resolution"),
          A("Data de resolução", "date_resolution"),
          A("Situação CPJ", "situation_cpj"),
          /* @__PURE__ */ _.jsx("th", { children: "Advogado adverso" })
        ] }) }),
        /* @__PURE__ */ _.jsx("tbody", { children: u ? /* @__PURE__ */ _.jsx("tr", { children: /* @__PURE__ */ _.jsx("td", { colSpan: 9, className: "carteira-table-status", children: "Carregando registros…" }) }) : r != null && r.table.rows.length ? r.table.rows.map((w) => /* @__PURE__ */ _.jsxs("tr", { children: [
          /* @__PURE__ */ _.jsx("td", { children: w.cnj || "—" }),
          /* @__PURE__ */ _.jsx("td", { children: w.integration || "—" }),
          /* @__PURE__ */ _.jsx("td", { children: w.date ? cS(w.date.slice(0, 10)) : "—" }),
          /* @__PURE__ */ _.jsx("td", { children: w.state || "—" }),
          /* @__PURE__ */ _.jsx("td", { children: w.aging ?? "—" }),
          /* @__PURE__ */ _.jsx("td", { children: w.resolution || "—" }),
          /* @__PURE__ */ _.jsx("td", { children: w.date_resolution ? cS(w.date_resolution.slice(0, 10)) : "—" }),
          /* @__PURE__ */ _.jsx("td", { children: w.situation_cpj || "—" }),
          /* @__PURE__ */ _.jsx("td", { children: w.adverse_lawyer || "—" })
        ] }, w.id)) : /* @__PURE__ */ _.jsx("tr", { children: /* @__PURE__ */ _.jsx("td", { colSpan: 9, className: "carteira-table-status", children: "Nenhum processo encontrado." }) }) })
      ] }) }),
      /* @__PURE__ */ _.jsxs("footer", { className: "carteira-pagination", children: [
        /* @__PURE__ */ _.jsx("span", { children: r ? `${nr(r.table.total)} registros` : "—" }),
        /* @__PURE__ */ _.jsxs("div", { children: [
          /* @__PURE__ */ _.jsx("button", { type: "button", disabled: !r || e.page <= 1, onClick: () => d({ page: e.page - 1 }), children: /* @__PURE__ */ _.jsx(tC, {}) }),
          /* @__PURE__ */ _.jsxs("strong", { children: [
            "Página ",
            e.page,
            " de ",
            y
          ] }),
          /* @__PURE__ */ _.jsx("button", { type: "button", disabled: !r || e.page >= y, onClick: () => d({ page: e.page + 1 }), children: /* @__PURE__ */ _.jsx(rC, {}) })
        ] })
      ] })
    ] })
  ] });
}
const iC = document.getElementById("dashboard-root");
if (!iC)
  throw new Error("O ponto de montagem #dashboard-root não foi encontrado.");
vj.createRoot(iC).render(/* @__PURE__ */ _.jsx(x.StrictMode, { children: /* @__PURE__ */ _.jsx(R9, {}) }));
