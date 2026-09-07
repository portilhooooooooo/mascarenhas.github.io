var __ = Object.defineProperty;
var C_ = (e, t, r) => t in e ? __(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var Uu = (e, t, r) => C_(e, typeof t != "symbol" ? t + "" : t, r);
function I_(e, t) {
  for (var r = 0; r < t.length; r++) {
    const n = t[r];
    if (typeof n != "string" && !Array.isArray(n)) {
      for (const o in n)
        if (o !== "default" && !(o in e)) {
          const l = Object.getOwnPropertyDescriptor(n, o);
          l && Object.defineProperty(e, o, l.get ? l : {
            enumerable: !0,
            get: () => n[o]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }));
}
function J1(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Bd = { exports: {} }, Ro = {}, Fd = { exports: {} }, Oe = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Yg;
function j_() {
  if (Yg) return Oe;
  Yg = 1;
  var e = Symbol.for("react.element"), t = Symbol.for("react.portal"), r = Symbol.for("react.fragment"), n = Symbol.for("react.strict_mode"), o = Symbol.for("react.profiler"), l = Symbol.for("react.provider"), s = Symbol.for("react.context"), c = Symbol.for("react.forward_ref"), f = Symbol.for("react.suspense"), d = Symbol.for("react.memo"), h = Symbol.for("react.lazy"), p = Symbol.iterator;
  function y($) {
    return $ === null || typeof $ != "object" ? null : ($ = p && $[p] || $["@@iterator"], typeof $ == "function" ? $ : null);
  }
  var x = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, A = Object.assign, S = {};
  function b($, H, fe) {
    this.props = $, this.context = H, this.refs = S, this.updater = fe || x;
  }
  b.prototype.isReactComponent = {}, b.prototype.setState = function($, H) {
    if (typeof $ != "object" && typeof $ != "function" && $ != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, $, H, "setState");
  }, b.prototype.forceUpdate = function($) {
    this.updater.enqueueForceUpdate(this, $, "forceUpdate");
  };
  function E() {
  }
  E.prototype = b.prototype;
  function k($, H, fe) {
    this.props = $, this.context = H, this.refs = S, this.updater = fe || x;
  }
  var C = k.prototype = new E();
  C.constructor = k, A(C, b.prototype), C.isPureReactComponent = !0;
  var j = Array.isArray, T = Object.prototype.hasOwnProperty, O = { current: null }, _ = { key: !0, ref: !0, __self: !0, __source: !0 };
  function F($, H, fe) {
    var ge, Ae = {}, Pe = null, Ee = null;
    if (H != null) for (ge in H.ref !== void 0 && (Ee = H.ref), H.key !== void 0 && (Pe = "" + H.key), H) T.call(H, ge) && !_.hasOwnProperty(ge) && (Ae[ge] = H[ge]);
    var _e = arguments.length - 2;
    if (_e === 1) Ae.children = fe;
    else if (1 < _e) {
      for (var J = Array(_e), pe = 0; pe < _e; pe++) J[pe] = arguments[pe + 2];
      Ae.children = J;
    }
    if ($ && $.defaultProps) for (ge in _e = $.defaultProps, _e) Ae[ge] === void 0 && (Ae[ge] = _e[ge]);
    return { $$typeof: e, type: $, key: Pe, ref: Ee, props: Ae, _owner: O.current };
  }
  function K($, H) {
    return { $$typeof: e, type: $.type, key: H, ref: $.ref, props: $.props, _owner: $._owner };
  }
  function V($) {
    return typeof $ == "object" && $ !== null && $.$$typeof === e;
  }
  function q($) {
    var H = { "=": "=0", ":": "=2" };
    return "$" + $.replace(/[=:]/g, function(fe) {
      return H[fe];
    });
  }
  var W = /\/+/g;
  function ie($, H) {
    return typeof $ == "object" && $ !== null && $.key != null ? q("" + $.key) : H.toString(36);
  }
  function re($, H, fe, ge, Ae) {
    var Pe = typeof $;
    (Pe === "undefined" || Pe === "boolean") && ($ = null);
    var Ee = !1;
    if ($ === null) Ee = !0;
    else switch (Pe) {
      case "string":
      case "number":
        Ee = !0;
        break;
      case "object":
        switch ($.$$typeof) {
          case e:
          case t:
            Ee = !0;
        }
    }
    if (Ee) return Ee = $, Ae = Ae(Ee), $ = ge === "" ? "." + ie(Ee, 0) : ge, j(Ae) ? (fe = "", $ != null && (fe = $.replace(W, "$&/") + "/"), re(Ae, H, fe, "", function(pe) {
      return pe;
    })) : Ae != null && (V(Ae) && (Ae = K(Ae, fe + (!Ae.key || Ee && Ee.key === Ae.key ? "" : ("" + Ae.key).replace(W, "$&/") + "/") + $)), H.push(Ae)), 1;
    if (Ee = 0, ge = ge === "" ? "." : ge + ":", j($)) for (var _e = 0; _e < $.length; _e++) {
      Pe = $[_e];
      var J = ge + ie(Pe, _e);
      Ee += re(Pe, H, fe, J, Ae);
    }
    else if (J = y($), typeof J == "function") for ($ = J.call($), _e = 0; !(Pe = $.next()).done; ) Pe = Pe.value, J = ge + ie(Pe, _e++), Ee += re(Pe, H, fe, J, Ae);
    else if (Pe === "object") throw H = String($), Error("Objects are not valid as a React child (found: " + (H === "[object Object]" ? "object with keys {" + Object.keys($).join(", ") + "}" : H) + "). If you meant to render a collection of children, use an array instead.");
    return Ee;
  }
  function we($, H, fe) {
    if ($ == null) return $;
    var ge = [], Ae = 0;
    return re($, ge, "", "", function(Pe) {
      return H.call(fe, Pe, Ae++);
    }), ge;
  }
  function ve($) {
    if ($._status === -1) {
      var H = $._result;
      H = H(), H.then(function(fe) {
        ($._status === 0 || $._status === -1) && ($._status = 1, $._result = fe);
      }, function(fe) {
        ($._status === 0 || $._status === -1) && ($._status = 2, $._result = fe);
      }), $._status === -1 && ($._status = 0, $._result = H);
    }
    if ($._status === 1) return $._result.default;
    throw $._result;
  }
  var ae = { current: null }, U = { transition: null }, te = { ReactCurrentDispatcher: ae, ReactCurrentBatchConfig: U, ReactCurrentOwner: O };
  function Y() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return Oe.Children = { map: we, forEach: function($, H, fe) {
    we($, function() {
      H.apply(this, arguments);
    }, fe);
  }, count: function($) {
    var H = 0;
    return we($, function() {
      H++;
    }), H;
  }, toArray: function($) {
    return we($, function(H) {
      return H;
    }) || [];
  }, only: function($) {
    if (!V($)) throw Error("React.Children.only expected to receive a single React element child.");
    return $;
  } }, Oe.Component = b, Oe.Fragment = r, Oe.Profiler = o, Oe.PureComponent = k, Oe.StrictMode = n, Oe.Suspense = f, Oe.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = te, Oe.act = Y, Oe.cloneElement = function($, H, fe) {
    if ($ == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + $ + ".");
    var ge = A({}, $.props), Ae = $.key, Pe = $.ref, Ee = $._owner;
    if (H != null) {
      if (H.ref !== void 0 && (Pe = H.ref, Ee = O.current), H.key !== void 0 && (Ae = "" + H.key), $.type && $.type.defaultProps) var _e = $.type.defaultProps;
      for (J in H) T.call(H, J) && !_.hasOwnProperty(J) && (ge[J] = H[J] === void 0 && _e !== void 0 ? _e[J] : H[J]);
    }
    var J = arguments.length - 2;
    if (J === 1) ge.children = fe;
    else if (1 < J) {
      _e = Array(J);
      for (var pe = 0; pe < J; pe++) _e[pe] = arguments[pe + 2];
      ge.children = _e;
    }
    return { $$typeof: e, type: $.type, key: Ae, ref: Pe, props: ge, _owner: Ee };
  }, Oe.createContext = function($) {
    return $ = { $$typeof: s, _currentValue: $, _currentValue2: $, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, $.Provider = { $$typeof: l, _context: $ }, $.Consumer = $;
  }, Oe.createElement = F, Oe.createFactory = function($) {
    var H = F.bind(null, $);
    return H.type = $, H;
  }, Oe.createRef = function() {
    return { current: null };
  }, Oe.forwardRef = function($) {
    return { $$typeof: c, render: $ };
  }, Oe.isValidElement = V, Oe.lazy = function($) {
    return { $$typeof: h, _payload: { _status: -1, _result: $ }, _init: ve };
  }, Oe.memo = function($, H) {
    return { $$typeof: d, type: $, compare: H === void 0 ? null : H };
  }, Oe.startTransition = function($) {
    var H = U.transition;
    U.transition = {};
    try {
      $();
    } finally {
      U.transition = H;
    }
  }, Oe.unstable_act = Y, Oe.useCallback = function($, H) {
    return ae.current.useCallback($, H);
  }, Oe.useContext = function($) {
    return ae.current.useContext($);
  }, Oe.useDebugValue = function() {
  }, Oe.useDeferredValue = function($) {
    return ae.current.useDeferredValue($);
  }, Oe.useEffect = function($, H) {
    return ae.current.useEffect($, H);
  }, Oe.useId = function() {
    return ae.current.useId();
  }, Oe.useImperativeHandle = function($, H, fe) {
    return ae.current.useImperativeHandle($, H, fe);
  }, Oe.useInsertionEffect = function($, H) {
    return ae.current.useInsertionEffect($, H);
  }, Oe.useLayoutEffect = function($, H) {
    return ae.current.useLayoutEffect($, H);
  }, Oe.useMemo = function($, H) {
    return ae.current.useMemo($, H);
  }, Oe.useReducer = function($, H, fe) {
    return ae.current.useReducer($, H, fe);
  }, Oe.useRef = function($) {
    return ae.current.useRef($);
  }, Oe.useState = function($) {
    return ae.current.useState($);
  }, Oe.useSyncExternalStore = function($, H, fe) {
    return ae.current.useSyncExternalStore($, H, fe);
  }, Oe.useTransition = function() {
    return ae.current.useTransition();
  }, Oe.version = "18.3.1", Oe;
}
var Gg;
function Ba() {
  return Gg || (Gg = 1, Fd.exports = j_()), Fd.exports;
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
var Xg;
function T_() {
  if (Xg) return Ro;
  Xg = 1;
  var e = Ba(), t = Symbol.for("react.element"), r = Symbol.for("react.fragment"), n = Object.prototype.hasOwnProperty, o = e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, l = { key: !0, ref: !0, __self: !0, __source: !0 };
  function s(c, f, d) {
    var h, p = {}, y = null, x = null;
    d !== void 0 && (y = "" + d), f.key !== void 0 && (y = "" + f.key), f.ref !== void 0 && (x = f.ref);
    for (h in f) n.call(f, h) && !l.hasOwnProperty(h) && (p[h] = f[h]);
    if (c && c.defaultProps) for (h in f = c.defaultProps, f) p[h] === void 0 && (p[h] = f[h]);
    return { $$typeof: t, type: c, key: y, ref: x, props: p, _owner: o.current };
  }
  return Ro.Fragment = r, Ro.jsx = s, Ro.jsxs = s, Ro;
}
var qg;
function N_() {
  return qg || (qg = 1, Bd.exports = T_()), Bd.exports;
}
var N = N_(), Hu = {}, Wd = { exports: {} }, Yt = {}, Ud = { exports: {} }, Hd = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Qg;
function M_() {
  return Qg || (Qg = 1, (function(e) {
    function t(U, te) {
      var Y = U.length;
      U.push(te);
      e: for (; 0 < Y; ) {
        var $ = Y - 1 >>> 1, H = U[$];
        if (0 < o(H, te)) U[$] = te, U[Y] = H, Y = $;
        else break e;
      }
    }
    function r(U) {
      return U.length === 0 ? null : U[0];
    }
    function n(U) {
      if (U.length === 0) return null;
      var te = U[0], Y = U.pop();
      if (Y !== te) {
        U[0] = Y;
        e: for (var $ = 0, H = U.length, fe = H >>> 1; $ < fe; ) {
          var ge = 2 * ($ + 1) - 1, Ae = U[ge], Pe = ge + 1, Ee = U[Pe];
          if (0 > o(Ae, Y)) Pe < H && 0 > o(Ee, Ae) ? (U[$] = Ee, U[Pe] = Y, $ = Pe) : (U[$] = Ae, U[ge] = Y, $ = ge);
          else if (Pe < H && 0 > o(Ee, Y)) U[$] = Ee, U[Pe] = Y, $ = Pe;
          else break e;
        }
      }
      return te;
    }
    function o(U, te) {
      var Y = U.sortIndex - te.sortIndex;
      return Y !== 0 ? Y : U.id - te.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var l = performance;
      e.unstable_now = function() {
        return l.now();
      };
    } else {
      var s = Date, c = s.now();
      e.unstable_now = function() {
        return s.now() - c;
      };
    }
    var f = [], d = [], h = 1, p = null, y = 3, x = !1, A = !1, S = !1, b = typeof setTimeout == "function" ? setTimeout : null, E = typeof clearTimeout == "function" ? clearTimeout : null, k = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function C(U) {
      for (var te = r(d); te !== null; ) {
        if (te.callback === null) n(d);
        else if (te.startTime <= U) n(d), te.sortIndex = te.expirationTime, t(f, te);
        else break;
        te = r(d);
      }
    }
    function j(U) {
      if (S = !1, C(U), !A) if (r(f) !== null) A = !0, ve(T);
      else {
        var te = r(d);
        te !== null && ae(j, te.startTime - U);
      }
    }
    function T(U, te) {
      A = !1, S && (S = !1, E(F), F = -1), x = !0;
      var Y = y;
      try {
        for (C(te), p = r(f); p !== null && (!(p.expirationTime > te) || U && !q()); ) {
          var $ = p.callback;
          if (typeof $ == "function") {
            p.callback = null, y = p.priorityLevel;
            var H = $(p.expirationTime <= te);
            te = e.unstable_now(), typeof H == "function" ? p.callback = H : p === r(f) && n(f), C(te);
          } else n(f);
          p = r(f);
        }
        if (p !== null) var fe = !0;
        else {
          var ge = r(d);
          ge !== null && ae(j, ge.startTime - te), fe = !1;
        }
        return fe;
      } finally {
        p = null, y = Y, x = !1;
      }
    }
    var O = !1, _ = null, F = -1, K = 5, V = -1;
    function q() {
      return !(e.unstable_now() - V < K);
    }
    function W() {
      if (_ !== null) {
        var U = e.unstable_now();
        V = U;
        var te = !0;
        try {
          te = _(!0, U);
        } finally {
          te ? ie() : (O = !1, _ = null);
        }
      } else O = !1;
    }
    var ie;
    if (typeof k == "function") ie = function() {
      k(W);
    };
    else if (typeof MessageChannel < "u") {
      var re = new MessageChannel(), we = re.port2;
      re.port1.onmessage = W, ie = function() {
        we.postMessage(null);
      };
    } else ie = function() {
      b(W, 0);
    };
    function ve(U) {
      _ = U, O || (O = !0, ie());
    }
    function ae(U, te) {
      F = b(function() {
        U(e.unstable_now());
      }, te);
    }
    e.unstable_IdlePriority = 5, e.unstable_ImmediatePriority = 1, e.unstable_LowPriority = 4, e.unstable_NormalPriority = 3, e.unstable_Profiling = null, e.unstable_UserBlockingPriority = 2, e.unstable_cancelCallback = function(U) {
      U.callback = null;
    }, e.unstable_continueExecution = function() {
      A || x || (A = !0, ve(T));
    }, e.unstable_forceFrameRate = function(U) {
      0 > U || 125 < U ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : K = 0 < U ? Math.floor(1e3 / U) : 5;
    }, e.unstable_getCurrentPriorityLevel = function() {
      return y;
    }, e.unstable_getFirstCallbackNode = function() {
      return r(f);
    }, e.unstable_next = function(U) {
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
        return U();
      } finally {
        y = Y;
      }
    }, e.unstable_pauseExecution = function() {
    }, e.unstable_requestPaint = function() {
    }, e.unstable_runWithPriority = function(U, te) {
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
        return te();
      } finally {
        y = Y;
      }
    }, e.unstable_scheduleCallback = function(U, te, Y) {
      var $ = e.unstable_now();
      switch (typeof Y == "object" && Y !== null ? (Y = Y.delay, Y = typeof Y == "number" && 0 < Y ? $ + Y : $) : Y = $, U) {
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
      return H = Y + H, U = { id: h++, callback: te, priorityLevel: U, startTime: Y, expirationTime: H, sortIndex: -1 }, Y > $ ? (U.sortIndex = Y, t(d, U), r(f) === null && U === r(d) && (S ? (E(F), F = -1) : S = !0, ae(j, Y - $))) : (U.sortIndex = H, t(f, U), A || x || (A = !0, ve(T))), U;
    }, e.unstable_shouldYield = q, e.unstable_wrapCallback = function(U) {
      var te = y;
      return function() {
        var Y = y;
        y = te;
        try {
          return U.apply(this, arguments);
        } finally {
          y = Y;
        }
      };
    };
  })(Hd)), Hd;
}
var Zg;
function D_() {
  return Zg || (Zg = 1, Ud.exports = M_()), Ud.exports;
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
var Jg;
function $_() {
  if (Jg) return Yt;
  Jg = 1;
  var e = Ba(), t = D_();
  function r(i) {
    for (var a = "https://reactjs.org/docs/error-decoder.html?invariant=" + i, u = 1; u < arguments.length; u++) a += "&args[]=" + encodeURIComponent(arguments[u]);
    return "Minified React error #" + i + "; visit " + a + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var n = /* @__PURE__ */ new Set(), o = {};
  function l(i, a) {
    s(i, a), s(i + "Capture", a);
  }
  function s(i, a) {
    for (o[i] = a, i = 0; i < a.length; i++) n.add(a[i]);
  }
  var c = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), f = Object.prototype.hasOwnProperty, d = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, h = {}, p = {};
  function y(i) {
    return f.call(p, i) ? !0 : f.call(h, i) ? !1 : d.test(i) ? p[i] = !0 : (h[i] = !0, !1);
  }
  function x(i, a, u, v) {
    if (u !== null && u.type === 0) return !1;
    switch (typeof a) {
      case "function":
      case "symbol":
        return !0;
      case "boolean":
        return v ? !1 : u !== null ? !u.acceptsBooleans : (i = i.toLowerCase().slice(0, 5), i !== "data-" && i !== "aria-");
      default:
        return !1;
    }
  }
  function A(i, a, u, v) {
    if (a === null || typeof a > "u" || x(i, a, u, v)) return !0;
    if (v) return !1;
    if (u !== null) switch (u.type) {
      case 3:
        return !a;
      case 4:
        return a === !1;
      case 5:
        return isNaN(a);
      case 6:
        return isNaN(a) || 1 > a;
    }
    return !1;
  }
  function S(i, a, u, v, m, g, P) {
    this.acceptsBooleans = a === 2 || a === 3 || a === 4, this.attributeName = v, this.attributeNamespace = m, this.mustUseProperty = u, this.propertyName = i, this.type = a, this.sanitizeURL = g, this.removeEmptyString = P;
  }
  var b = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(i) {
    b[i] = new S(i, 0, !1, i, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(i) {
    var a = i[0];
    b[a] = new S(a, 1, !1, i[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(i) {
    b[i] = new S(i, 2, !1, i.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(i) {
    b[i] = new S(i, 2, !1, i, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(i) {
    b[i] = new S(i, 3, !1, i.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(i) {
    b[i] = new S(i, 3, !0, i, null, !1, !1);
  }), ["capture", "download"].forEach(function(i) {
    b[i] = new S(i, 4, !1, i, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(i) {
    b[i] = new S(i, 6, !1, i, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(i) {
    b[i] = new S(i, 5, !1, i.toLowerCase(), null, !1, !1);
  });
  var E = /[\-:]([a-z])/g;
  function k(i) {
    return i[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(i) {
    var a = i.replace(
      E,
      k
    );
    b[a] = new S(a, 1, !1, i, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(i) {
    var a = i.replace(E, k);
    b[a] = new S(a, 1, !1, i, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(i) {
    var a = i.replace(E, k);
    b[a] = new S(a, 1, !1, i, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(i) {
    b[i] = new S(i, 1, !1, i.toLowerCase(), null, !1, !1);
  }), b.xlinkHref = new S("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(i) {
    b[i] = new S(i, 1, !1, i.toLowerCase(), null, !0, !0);
  });
  function C(i, a, u, v) {
    var m = b.hasOwnProperty(a) ? b[a] : null;
    (m !== null ? m.type !== 0 : v || !(2 < a.length) || a[0] !== "o" && a[0] !== "O" || a[1] !== "n" && a[1] !== "N") && (A(a, u, m, v) && (u = null), v || m === null ? y(a) && (u === null ? i.removeAttribute(a) : i.setAttribute(a, "" + u)) : m.mustUseProperty ? i[m.propertyName] = u === null ? m.type === 3 ? !1 : "" : u : (a = m.attributeName, v = m.attributeNamespace, u === null ? i.removeAttribute(a) : (m = m.type, u = m === 3 || m === 4 && u === !0 ? "" : "" + u, v ? i.setAttributeNS(v, a, u) : i.setAttribute(a, u))));
  }
  var j = e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, T = Symbol.for("react.element"), O = Symbol.for("react.portal"), _ = Symbol.for("react.fragment"), F = Symbol.for("react.strict_mode"), K = Symbol.for("react.profiler"), V = Symbol.for("react.provider"), q = Symbol.for("react.context"), W = Symbol.for("react.forward_ref"), ie = Symbol.for("react.suspense"), re = Symbol.for("react.suspense_list"), we = Symbol.for("react.memo"), ve = Symbol.for("react.lazy"), ae = Symbol.for("react.offscreen"), U = Symbol.iterator;
  function te(i) {
    return i === null || typeof i != "object" ? null : (i = U && i[U] || i["@@iterator"], typeof i == "function" ? i : null);
  }
  var Y = Object.assign, $;
  function H(i) {
    if ($ === void 0) try {
      throw Error();
    } catch (u) {
      var a = u.stack.trim().match(/\n( *(at )?)/);
      $ = a && a[1] || "";
    }
    return `
` + $ + i;
  }
  var fe = !1;
  function ge(i, a) {
    if (!i || fe) return "";
    fe = !0;
    var u = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      if (a) if (a = function() {
        throw Error();
      }, Object.defineProperty(a.prototype, "props", { set: function() {
        throw Error();
      } }), typeof Reflect == "object" && Reflect.construct) {
        try {
          Reflect.construct(a, []);
        } catch (B) {
          var v = B;
        }
        Reflect.construct(i, [], a);
      } else {
        try {
          a.call();
        } catch (B) {
          v = B;
        }
        i.call(a.prototype);
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
`), P = m.length - 1, I = g.length - 1; 1 <= P && 0 <= I && m[P] !== g[I]; ) I--;
        for (; 1 <= P && 0 <= I; P--, I--) if (m[P] !== g[I]) {
          if (P !== 1 || I !== 1)
            do
              if (P--, I--, 0 > I || m[P] !== g[I]) {
                var M = `
` + m[P].replace(" at new ", " at ");
                return i.displayName && M.includes("<anonymous>") && (M = M.replace("<anonymous>", i.displayName)), M;
              }
            while (1 <= P && 0 <= I);
          break;
        }
      }
    } finally {
      fe = !1, Error.prepareStackTrace = u;
    }
    return (i = i ? i.displayName || i.name : "") ? H(i) : "";
  }
  function Ae(i) {
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
        return i = ge(i.type, !1), i;
      case 11:
        return i = ge(i.type.render, !1), i;
      case 1:
        return i = ge(i.type, !0), i;
      default:
        return "";
    }
  }
  function Pe(i) {
    if (i == null) return null;
    if (typeof i == "function") return i.displayName || i.name || null;
    if (typeof i == "string") return i;
    switch (i) {
      case _:
        return "Fragment";
      case O:
        return "Portal";
      case K:
        return "Profiler";
      case F:
        return "StrictMode";
      case ie:
        return "Suspense";
      case re:
        return "SuspenseList";
    }
    if (typeof i == "object") switch (i.$$typeof) {
      case q:
        return (i.displayName || "Context") + ".Consumer";
      case V:
        return (i._context.displayName || "Context") + ".Provider";
      case W:
        var a = i.render;
        return i = i.displayName, i || (i = a.displayName || a.name || "", i = i !== "" ? "ForwardRef(" + i + ")" : "ForwardRef"), i;
      case we:
        return a = i.displayName || null, a !== null ? a : Pe(i.type) || "Memo";
      case ve:
        a = i._payload, i = i._init;
        try {
          return Pe(i(a));
        } catch {
        }
    }
    return null;
  }
  function Ee(i) {
    var a = i.type;
    switch (i.tag) {
      case 24:
        return "Cache";
      case 9:
        return (a.displayName || "Context") + ".Consumer";
      case 10:
        return (a._context.displayName || "Context") + ".Provider";
      case 18:
        return "DehydratedFragment";
      case 11:
        return i = a.render, i = i.displayName || i.name || "", a.displayName || (i !== "" ? "ForwardRef(" + i + ")" : "ForwardRef");
      case 7:
        return "Fragment";
      case 5:
        return a;
      case 4:
        return "Portal";
      case 3:
        return "Root";
      case 6:
        return "Text";
      case 16:
        return Pe(a);
      case 8:
        return a === F ? "StrictMode" : "Mode";
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
        if (typeof a == "function") return a.displayName || a.name || null;
        if (typeof a == "string") return a;
    }
    return null;
  }
  function _e(i) {
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
    var a = i.type;
    return (i = i.nodeName) && i.toLowerCase() === "input" && (a === "checkbox" || a === "radio");
  }
  function pe(i) {
    var a = J(i) ? "checked" : "value", u = Object.getOwnPropertyDescriptor(i.constructor.prototype, a), v = "" + i[a];
    if (!i.hasOwnProperty(a) && typeof u < "u" && typeof u.get == "function" && typeof u.set == "function") {
      var m = u.get, g = u.set;
      return Object.defineProperty(i, a, { configurable: !0, get: function() {
        return m.call(this);
      }, set: function(P) {
        v = "" + P, g.call(this, P);
      } }), Object.defineProperty(i, a, { enumerable: u.enumerable }), { getValue: function() {
        return v;
      }, setValue: function(P) {
        v = "" + P;
      }, stopTracking: function() {
        i._valueTracker = null, delete i[a];
      } };
    }
  }
  function be(i) {
    i._valueTracker || (i._valueTracker = pe(i));
  }
  function Z(i) {
    if (!i) return !1;
    var a = i._valueTracker;
    if (!a) return !0;
    var u = a.getValue(), v = "";
    return i && (v = J(i) ? i.checked ? "true" : "false" : i.value), i = v, i !== u ? (a.setValue(i), !0) : !1;
  }
  function Ze(i) {
    if (i = i || (typeof document < "u" ? document : void 0), typeof i > "u") return null;
    try {
      return i.activeElement || i.body;
    } catch {
      return i.body;
    }
  }
  function je(i, a) {
    var u = a.checked;
    return Y({}, a, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: u ?? i._wrapperState.initialChecked });
  }
  function xe(i, a) {
    var u = a.defaultValue == null ? "" : a.defaultValue, v = a.checked != null ? a.checked : a.defaultChecked;
    u = _e(a.value != null ? a.value : u), i._wrapperState = { initialChecked: v, initialValue: u, controlled: a.type === "checkbox" || a.type === "radio" ? a.checked != null : a.value != null };
  }
  function Ot(i, a) {
    a = a.checked, a != null && C(i, "checked", a, !1);
  }
  function Ar(i, a) {
    Ot(i, a);
    var u = _e(a.value), v = a.type;
    if (u != null) v === "number" ? (u === 0 && i.value === "" || i.value != u) && (i.value = "" + u) : i.value !== "" + u && (i.value = "" + u);
    else if (v === "submit" || v === "reset") {
      i.removeAttribute("value");
      return;
    }
    a.hasOwnProperty("value") ? Gc(i, a.type, u) : a.hasOwnProperty("defaultValue") && Gc(i, a.type, _e(a.defaultValue)), a.checked == null && a.defaultChecked != null && (i.defaultChecked = !!a.defaultChecked);
  }
  function Qa(i, a, u) {
    if (a.hasOwnProperty("value") || a.hasOwnProperty("defaultValue")) {
      var v = a.type;
      if (!(v !== "submit" && v !== "reset" || a.value !== void 0 && a.value !== null)) return;
      a = "" + i._wrapperState.initialValue, u || a === i.value || (i.value = a), i.defaultValue = a;
    }
    u = i.name, u !== "" && (i.name = ""), i.defaultChecked = !!i._wrapperState.initialChecked, u !== "" && (i.name = u);
  }
  function Gc(i, a, u) {
    (a !== "number" || Ze(i.ownerDocument) !== i) && (u == null ? i.defaultValue = "" + i._wrapperState.initialValue : i.defaultValue !== "" + u && (i.defaultValue = "" + u));
  }
  var Za = Array.isArray;
  function Vi(i, a, u, v) {
    if (i = i.options, a) {
      a = {};
      for (var m = 0; m < u.length; m++) a["$" + u[m]] = !0;
      for (u = 0; u < i.length; u++) m = a.hasOwnProperty("$" + i[u].value), i[u].selected !== m && (i[u].selected = m), m && v && (i[u].defaultSelected = !0);
    } else {
      for (u = "" + _e(u), a = null, m = 0; m < i.length; m++) {
        if (i[m].value === u) {
          i[m].selected = !0, v && (i[m].defaultSelected = !0);
          return;
        }
        a !== null || i[m].disabled || (a = i[m]);
      }
      a !== null && (a.selected = !0);
    }
  }
  function Xc(i, a) {
    if (a.dangerouslySetInnerHTML != null) throw Error(r(91));
    return Y({}, a, { value: void 0, defaultValue: void 0, children: "" + i._wrapperState.initialValue });
  }
  function nm(i, a) {
    var u = a.value;
    if (u == null) {
      if (u = a.children, a = a.defaultValue, u != null) {
        if (a != null) throw Error(r(92));
        if (Za(u)) {
          if (1 < u.length) throw Error(r(93));
          u = u[0];
        }
        a = u;
      }
      a == null && (a = ""), u = a;
    }
    i._wrapperState = { initialValue: _e(u) };
  }
  function im(i, a) {
    var u = _e(a.value), v = _e(a.defaultValue);
    u != null && (u = "" + u, u !== i.value && (i.value = u), a.defaultValue == null && i.defaultValue !== u && (i.defaultValue = u)), v != null && (i.defaultValue = "" + v);
  }
  function am(i) {
    var a = i.textContent;
    a === i._wrapperState.initialValue && a !== "" && a !== null && (i.value = a);
  }
  function om(i) {
    switch (i) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function qc(i, a) {
    return i == null || i === "http://www.w3.org/1999/xhtml" ? om(a) : i === "http://www.w3.org/2000/svg" && a === "foreignObject" ? "http://www.w3.org/1999/xhtml" : i;
  }
  var Dl, lm = (function(i) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(a, u, v, m) {
      MSApp.execUnsafeLocalFunction(function() {
        return i(a, u, v, m);
      });
    } : i;
  })(function(i, a) {
    if (i.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in i) i.innerHTML = a;
    else {
      for (Dl = Dl || document.createElement("div"), Dl.innerHTML = "<svg>" + a.valueOf().toString() + "</svg>", a = Dl.firstChild; i.firstChild; ) i.removeChild(i.firstChild);
      for (; a.firstChild; ) i.appendChild(a.firstChild);
    }
  });
  function Ja(i, a) {
    if (a) {
      var u = i.firstChild;
      if (u && u === i.lastChild && u.nodeType === 3) {
        u.nodeValue = a;
        return;
      }
    }
    i.textContent = a;
  }
  var eo = {
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
  }, TO = ["Webkit", "ms", "Moz", "O"];
  Object.keys(eo).forEach(function(i) {
    TO.forEach(function(a) {
      a = a + i.charAt(0).toUpperCase() + i.substring(1), eo[a] = eo[i];
    });
  });
  function um(i, a, u) {
    return a == null || typeof a == "boolean" || a === "" ? "" : u || typeof a != "number" || a === 0 || eo.hasOwnProperty(i) && eo[i] ? ("" + a).trim() : a + "px";
  }
  function sm(i, a) {
    i = i.style;
    for (var u in a) if (a.hasOwnProperty(u)) {
      var v = u.indexOf("--") === 0, m = um(u, a[u], v);
      u === "float" && (u = "cssFloat"), v ? i.setProperty(u, m) : i[u] = m;
    }
  }
  var NO = Y({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function Qc(i, a) {
    if (a) {
      if (NO[i] && (a.children != null || a.dangerouslySetInnerHTML != null)) throw Error(r(137, i));
      if (a.dangerouslySetInnerHTML != null) {
        if (a.children != null) throw Error(r(60));
        if (typeof a.dangerouslySetInnerHTML != "object" || !("__html" in a.dangerouslySetInnerHTML)) throw Error(r(61));
      }
      if (a.style != null && typeof a.style != "object") throw Error(r(62));
    }
  }
  function Zc(i, a) {
    if (i.indexOf("-") === -1) return typeof a.is == "string";
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
  var Jc = null;
  function ef(i) {
    return i = i.target || i.srcElement || window, i.correspondingUseElement && (i = i.correspondingUseElement), i.nodeType === 3 ? i.parentNode : i;
  }
  var tf = null, Yi = null, Gi = null;
  function cm(i) {
    if (i = Ao(i)) {
      if (typeof tf != "function") throw Error(r(280));
      var a = i.stateNode;
      a && (a = iu(a), tf(i.stateNode, i.type, a));
    }
  }
  function fm(i) {
    Yi ? Gi ? Gi.push(i) : Gi = [i] : Yi = i;
  }
  function dm() {
    if (Yi) {
      var i = Yi, a = Gi;
      if (Gi = Yi = null, cm(i), a) for (i = 0; i < a.length; i++) cm(a[i]);
    }
  }
  function vm(i, a) {
    return i(a);
  }
  function hm() {
  }
  var rf = !1;
  function pm(i, a, u) {
    if (rf) return i(a, u);
    rf = !0;
    try {
      return vm(i, a, u);
    } finally {
      rf = !1, (Yi !== null || Gi !== null) && (hm(), dm());
    }
  }
  function to(i, a) {
    var u = i.stateNode;
    if (u === null) return null;
    var v = iu(u);
    if (v === null) return null;
    u = v[a];
    e: switch (a) {
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
    if (u && typeof u != "function") throw Error(r(231, a, typeof u));
    return u;
  }
  var nf = !1;
  if (c) try {
    var ro = {};
    Object.defineProperty(ro, "passive", { get: function() {
      nf = !0;
    } }), window.addEventListener("test", ro, ro), window.removeEventListener("test", ro, ro);
  } catch {
    nf = !1;
  }
  function MO(i, a, u, v, m, g, P, I, M) {
    var B = Array.prototype.slice.call(arguments, 3);
    try {
      a.apply(u, B);
    } catch (X) {
      this.onError(X);
    }
  }
  var no = !1, $l = null, Ll = !1, af = null, DO = { onError: function(i) {
    no = !0, $l = i;
  } };
  function $O(i, a, u, v, m, g, P, I, M) {
    no = !1, $l = null, MO.apply(DO, arguments);
  }
  function LO(i, a, u, v, m, g, P, I, M) {
    if ($O.apply(this, arguments), no) {
      if (no) {
        var B = $l;
        no = !1, $l = null;
      } else throw Error(r(198));
      Ll || (Ll = !0, af = B);
    }
  }
  function oi(i) {
    var a = i, u = i;
    if (i.alternate) for (; a.return; ) a = a.return;
    else {
      i = a;
      do
        a = i, (a.flags & 4098) !== 0 && (u = a.return), i = a.return;
      while (i);
    }
    return a.tag === 3 ? u : null;
  }
  function mm(i) {
    if (i.tag === 13) {
      var a = i.memoizedState;
      if (a === null && (i = i.alternate, i !== null && (a = i.memoizedState)), a !== null) return a.dehydrated;
    }
    return null;
  }
  function ym(i) {
    if (oi(i) !== i) throw Error(r(188));
  }
  function RO(i) {
    var a = i.alternate;
    if (!a) {
      if (a = oi(i), a === null) throw Error(r(188));
      return a !== i ? null : i;
    }
    for (var u = i, v = a; ; ) {
      var m = u.return;
      if (m === null) break;
      var g = m.alternate;
      if (g === null) {
        if (v = m.return, v !== null) {
          u = v;
          continue;
        }
        break;
      }
      if (m.child === g.child) {
        for (g = m.child; g; ) {
          if (g === u) return ym(m), i;
          if (g === v) return ym(m), a;
          g = g.sibling;
        }
        throw Error(r(188));
      }
      if (u.return !== v.return) u = m, v = g;
      else {
        for (var P = !1, I = m.child; I; ) {
          if (I === u) {
            P = !0, u = m, v = g;
            break;
          }
          if (I === v) {
            P = !0, v = m, u = g;
            break;
          }
          I = I.sibling;
        }
        if (!P) {
          for (I = g.child; I; ) {
            if (I === u) {
              P = !0, u = g, v = m;
              break;
            }
            if (I === v) {
              P = !0, v = g, u = m;
              break;
            }
            I = I.sibling;
          }
          if (!P) throw Error(r(189));
        }
      }
      if (u.alternate !== v) throw Error(r(190));
    }
    if (u.tag !== 3) throw Error(r(188));
    return u.stateNode.current === u ? i : a;
  }
  function gm(i) {
    return i = RO(i), i !== null ? xm(i) : null;
  }
  function xm(i) {
    if (i.tag === 5 || i.tag === 6) return i;
    for (i = i.child; i !== null; ) {
      var a = xm(i);
      if (a !== null) return a;
      i = i.sibling;
    }
    return null;
  }
  var wm = t.unstable_scheduleCallback, bm = t.unstable_cancelCallback, zO = t.unstable_shouldYield, BO = t.unstable_requestPaint, Je = t.unstable_now, FO = t.unstable_getCurrentPriorityLevel, of = t.unstable_ImmediatePriority, Sm = t.unstable_UserBlockingPriority, Rl = t.unstable_NormalPriority, WO = t.unstable_LowPriority, Am = t.unstable_IdlePriority, zl = null, zr = null;
  function UO(i) {
    if (zr && typeof zr.onCommitFiberRoot == "function") try {
      zr.onCommitFiberRoot(zl, i, void 0, (i.current.flags & 128) === 128);
    } catch {
    }
  }
  var Pr = Math.clz32 ? Math.clz32 : VO, HO = Math.log, KO = Math.LN2;
  function VO(i) {
    return i >>>= 0, i === 0 ? 32 : 31 - (HO(i) / KO | 0) | 0;
  }
  var Bl = 64, Fl = 4194304;
  function io(i) {
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
  function Wl(i, a) {
    var u = i.pendingLanes;
    if (u === 0) return 0;
    var v = 0, m = i.suspendedLanes, g = i.pingedLanes, P = u & 268435455;
    if (P !== 0) {
      var I = P & ~m;
      I !== 0 ? v = io(I) : (g &= P, g !== 0 && (v = io(g)));
    } else P = u & ~m, P !== 0 ? v = io(P) : g !== 0 && (v = io(g));
    if (v === 0) return 0;
    if (a !== 0 && a !== v && (a & m) === 0 && (m = v & -v, g = a & -a, m >= g || m === 16 && (g & 4194240) !== 0)) return a;
    if ((v & 4) !== 0 && (v |= u & 16), a = i.entangledLanes, a !== 0) for (i = i.entanglements, a &= v; 0 < a; ) u = 31 - Pr(a), m = 1 << u, v |= i[u], a &= ~m;
    return v;
  }
  function YO(i, a) {
    switch (i) {
      case 1:
      case 2:
      case 4:
        return a + 250;
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
        return a + 5e3;
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
  function GO(i, a) {
    for (var u = i.suspendedLanes, v = i.pingedLanes, m = i.expirationTimes, g = i.pendingLanes; 0 < g; ) {
      var P = 31 - Pr(g), I = 1 << P, M = m[P];
      M === -1 ? ((I & u) === 0 || (I & v) !== 0) && (m[P] = YO(I, a)) : M <= a && (i.expiredLanes |= I), g &= ~I;
    }
  }
  function lf(i) {
    return i = i.pendingLanes & -1073741825, i !== 0 ? i : i & 1073741824 ? 1073741824 : 0;
  }
  function Pm() {
    var i = Bl;
    return Bl <<= 1, (Bl & 4194240) === 0 && (Bl = 64), i;
  }
  function uf(i) {
    for (var a = [], u = 0; 31 > u; u++) a.push(i);
    return a;
  }
  function ao(i, a, u) {
    i.pendingLanes |= a, a !== 536870912 && (i.suspendedLanes = 0, i.pingedLanes = 0), i = i.eventTimes, a = 31 - Pr(a), i[a] = u;
  }
  function XO(i, a) {
    var u = i.pendingLanes & ~a;
    i.pendingLanes = a, i.suspendedLanes = 0, i.pingedLanes = 0, i.expiredLanes &= a, i.mutableReadLanes &= a, i.entangledLanes &= a, a = i.entanglements;
    var v = i.eventTimes;
    for (i = i.expirationTimes; 0 < u; ) {
      var m = 31 - Pr(u), g = 1 << m;
      a[m] = 0, v[m] = -1, i[m] = -1, u &= ~g;
    }
  }
  function sf(i, a) {
    var u = i.entangledLanes |= a;
    for (i = i.entanglements; u; ) {
      var v = 31 - Pr(u), m = 1 << v;
      m & a | i[v] & a && (i[v] |= a), u &= ~m;
    }
  }
  var $e = 0;
  function Em(i) {
    return i &= -i, 1 < i ? 4 < i ? (i & 268435455) !== 0 ? 16 : 536870912 : 4 : 1;
  }
  var Om, cf, km, _m, Cm, ff = !1, Ul = [], In = null, jn = null, Tn = null, oo = /* @__PURE__ */ new Map(), lo = /* @__PURE__ */ new Map(), Nn = [], qO = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function Im(i, a) {
    switch (i) {
      case "focusin":
      case "focusout":
        In = null;
        break;
      case "dragenter":
      case "dragleave":
        jn = null;
        break;
      case "mouseover":
      case "mouseout":
        Tn = null;
        break;
      case "pointerover":
      case "pointerout":
        oo.delete(a.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        lo.delete(a.pointerId);
    }
  }
  function uo(i, a, u, v, m, g) {
    return i === null || i.nativeEvent !== g ? (i = { blockedOn: a, domEventName: u, eventSystemFlags: v, nativeEvent: g, targetContainers: [m] }, a !== null && (a = Ao(a), a !== null && cf(a)), i) : (i.eventSystemFlags |= v, a = i.targetContainers, m !== null && a.indexOf(m) === -1 && a.push(m), i);
  }
  function QO(i, a, u, v, m) {
    switch (a) {
      case "focusin":
        return In = uo(In, i, a, u, v, m), !0;
      case "dragenter":
        return jn = uo(jn, i, a, u, v, m), !0;
      case "mouseover":
        return Tn = uo(Tn, i, a, u, v, m), !0;
      case "pointerover":
        var g = m.pointerId;
        return oo.set(g, uo(oo.get(g) || null, i, a, u, v, m)), !0;
      case "gotpointercapture":
        return g = m.pointerId, lo.set(g, uo(lo.get(g) || null, i, a, u, v, m)), !0;
    }
    return !1;
  }
  function jm(i) {
    var a = li(i.target);
    if (a !== null) {
      var u = oi(a);
      if (u !== null) {
        if (a = u.tag, a === 13) {
          if (a = mm(u), a !== null) {
            i.blockedOn = a, Cm(i.priority, function() {
              km(u);
            });
            return;
          }
        } else if (a === 3 && u.stateNode.current.memoizedState.isDehydrated) {
          i.blockedOn = u.tag === 3 ? u.stateNode.containerInfo : null;
          return;
        }
      }
    }
    i.blockedOn = null;
  }
  function Hl(i) {
    if (i.blockedOn !== null) return !1;
    for (var a = i.targetContainers; 0 < a.length; ) {
      var u = vf(i.domEventName, i.eventSystemFlags, a[0], i.nativeEvent);
      if (u === null) {
        u = i.nativeEvent;
        var v = new u.constructor(u.type, u);
        Jc = v, u.target.dispatchEvent(v), Jc = null;
      } else return a = Ao(u), a !== null && cf(a), i.blockedOn = u, !1;
      a.shift();
    }
    return !0;
  }
  function Tm(i, a, u) {
    Hl(i) && u.delete(a);
  }
  function ZO() {
    ff = !1, In !== null && Hl(In) && (In = null), jn !== null && Hl(jn) && (jn = null), Tn !== null && Hl(Tn) && (Tn = null), oo.forEach(Tm), lo.forEach(Tm);
  }
  function so(i, a) {
    i.blockedOn === a && (i.blockedOn = null, ff || (ff = !0, t.unstable_scheduleCallback(t.unstable_NormalPriority, ZO)));
  }
  function co(i) {
    function a(m) {
      return so(m, i);
    }
    if (0 < Ul.length) {
      so(Ul[0], i);
      for (var u = 1; u < Ul.length; u++) {
        var v = Ul[u];
        v.blockedOn === i && (v.blockedOn = null);
      }
    }
    for (In !== null && so(In, i), jn !== null && so(jn, i), Tn !== null && so(Tn, i), oo.forEach(a), lo.forEach(a), u = 0; u < Nn.length; u++) v = Nn[u], v.blockedOn === i && (v.blockedOn = null);
    for (; 0 < Nn.length && (u = Nn[0], u.blockedOn === null); ) jm(u), u.blockedOn === null && Nn.shift();
  }
  var Xi = j.ReactCurrentBatchConfig, Kl = !0;
  function JO(i, a, u, v) {
    var m = $e, g = Xi.transition;
    Xi.transition = null;
    try {
      $e = 1, df(i, a, u, v);
    } finally {
      $e = m, Xi.transition = g;
    }
  }
  function ek(i, a, u, v) {
    var m = $e, g = Xi.transition;
    Xi.transition = null;
    try {
      $e = 4, df(i, a, u, v);
    } finally {
      $e = m, Xi.transition = g;
    }
  }
  function df(i, a, u, v) {
    if (Kl) {
      var m = vf(i, a, u, v);
      if (m === null) If(i, a, v, Vl, u), Im(i, v);
      else if (QO(m, i, a, u, v)) v.stopPropagation();
      else if (Im(i, v), a & 4 && -1 < qO.indexOf(i)) {
        for (; m !== null; ) {
          var g = Ao(m);
          if (g !== null && Om(g), g = vf(i, a, u, v), g === null && If(i, a, v, Vl, u), g === m) break;
          m = g;
        }
        m !== null && v.stopPropagation();
      } else If(i, a, v, null, u);
    }
  }
  var Vl = null;
  function vf(i, a, u, v) {
    if (Vl = null, i = ef(v), i = li(i), i !== null) if (a = oi(i), a === null) i = null;
    else if (u = a.tag, u === 13) {
      if (i = mm(a), i !== null) return i;
      i = null;
    } else if (u === 3) {
      if (a.stateNode.current.memoizedState.isDehydrated) return a.tag === 3 ? a.stateNode.containerInfo : null;
      i = null;
    } else a !== i && (i = null);
    return Vl = i, null;
  }
  function Nm(i) {
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
        switch (FO()) {
          case of:
            return 1;
          case Sm:
            return 4;
          case Rl:
          case WO:
            return 16;
          case Am:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var Mn = null, hf = null, Yl = null;
  function Mm() {
    if (Yl) return Yl;
    var i, a = hf, u = a.length, v, m = "value" in Mn ? Mn.value : Mn.textContent, g = m.length;
    for (i = 0; i < u && a[i] === m[i]; i++) ;
    var P = u - i;
    for (v = 1; v <= P && a[u - v] === m[g - v]; v++) ;
    return Yl = m.slice(i, 1 < v ? 1 - v : void 0);
  }
  function Gl(i) {
    var a = i.keyCode;
    return "charCode" in i ? (i = i.charCode, i === 0 && a === 13 && (i = 13)) : i = a, i === 10 && (i = 13), 32 <= i || i === 13 ? i : 0;
  }
  function Xl() {
    return !0;
  }
  function Dm() {
    return !1;
  }
  function Qt(i) {
    function a(u, v, m, g, P) {
      this._reactName = u, this._targetInst = m, this.type = v, this.nativeEvent = g, this.target = P, this.currentTarget = null;
      for (var I in i) i.hasOwnProperty(I) && (u = i[I], this[I] = u ? u(g) : g[I]);
      return this.isDefaultPrevented = (g.defaultPrevented != null ? g.defaultPrevented : g.returnValue === !1) ? Xl : Dm, this.isPropagationStopped = Dm, this;
    }
    return Y(a.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var u = this.nativeEvent;
      u && (u.preventDefault ? u.preventDefault() : typeof u.returnValue != "unknown" && (u.returnValue = !1), this.isDefaultPrevented = Xl);
    }, stopPropagation: function() {
      var u = this.nativeEvent;
      u && (u.stopPropagation ? u.stopPropagation() : typeof u.cancelBubble != "unknown" && (u.cancelBubble = !0), this.isPropagationStopped = Xl);
    }, persist: function() {
    }, isPersistent: Xl }), a;
  }
  var qi = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(i) {
    return i.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, pf = Qt(qi), fo = Y({}, qi, { view: 0, detail: 0 }), tk = Qt(fo), mf, yf, vo, ql = Y({}, fo, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: xf, button: 0, buttons: 0, relatedTarget: function(i) {
    return i.relatedTarget === void 0 ? i.fromElement === i.srcElement ? i.toElement : i.fromElement : i.relatedTarget;
  }, movementX: function(i) {
    return "movementX" in i ? i.movementX : (i !== vo && (vo && i.type === "mousemove" ? (mf = i.screenX - vo.screenX, yf = i.screenY - vo.screenY) : yf = mf = 0, vo = i), mf);
  }, movementY: function(i) {
    return "movementY" in i ? i.movementY : yf;
  } }), $m = Qt(ql), rk = Y({}, ql, { dataTransfer: 0 }), nk = Qt(rk), ik = Y({}, fo, { relatedTarget: 0 }), gf = Qt(ik), ak = Y({}, qi, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), ok = Qt(ak), lk = Y({}, qi, { clipboardData: function(i) {
    return "clipboardData" in i ? i.clipboardData : window.clipboardData;
  } }), uk = Qt(lk), sk = Y({}, qi, { data: 0 }), Lm = Qt(sk), ck = {
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
  }, fk = {
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
  }, dk = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function vk(i) {
    var a = this.nativeEvent;
    return a.getModifierState ? a.getModifierState(i) : (i = dk[i]) ? !!a[i] : !1;
  }
  function xf() {
    return vk;
  }
  var hk = Y({}, fo, { key: function(i) {
    if (i.key) {
      var a = ck[i.key] || i.key;
      if (a !== "Unidentified") return a;
    }
    return i.type === "keypress" ? (i = Gl(i), i === 13 ? "Enter" : String.fromCharCode(i)) : i.type === "keydown" || i.type === "keyup" ? fk[i.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: xf, charCode: function(i) {
    return i.type === "keypress" ? Gl(i) : 0;
  }, keyCode: function(i) {
    return i.type === "keydown" || i.type === "keyup" ? i.keyCode : 0;
  }, which: function(i) {
    return i.type === "keypress" ? Gl(i) : i.type === "keydown" || i.type === "keyup" ? i.keyCode : 0;
  } }), pk = Qt(hk), mk = Y({}, ql, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Rm = Qt(mk), yk = Y({}, fo, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: xf }), gk = Qt(yk), xk = Y({}, qi, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), wk = Qt(xk), bk = Y({}, ql, {
    deltaX: function(i) {
      return "deltaX" in i ? i.deltaX : "wheelDeltaX" in i ? -i.wheelDeltaX : 0;
    },
    deltaY: function(i) {
      return "deltaY" in i ? i.deltaY : "wheelDeltaY" in i ? -i.wheelDeltaY : "wheelDelta" in i ? -i.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Sk = Qt(bk), Ak = [9, 13, 27, 32], wf = c && "CompositionEvent" in window, ho = null;
  c && "documentMode" in document && (ho = document.documentMode);
  var Pk = c && "TextEvent" in window && !ho, zm = c && (!wf || ho && 8 < ho && 11 >= ho), Bm = " ", Fm = !1;
  function Wm(i, a) {
    switch (i) {
      case "keyup":
        return Ak.indexOf(a.keyCode) !== -1;
      case "keydown":
        return a.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function Um(i) {
    return i = i.detail, typeof i == "object" && "data" in i ? i.data : null;
  }
  var Qi = !1;
  function Ek(i, a) {
    switch (i) {
      case "compositionend":
        return Um(a);
      case "keypress":
        return a.which !== 32 ? null : (Fm = !0, Bm);
      case "textInput":
        return i = a.data, i === Bm && Fm ? null : i;
      default:
        return null;
    }
  }
  function Ok(i, a) {
    if (Qi) return i === "compositionend" || !wf && Wm(i, a) ? (i = Mm(), Yl = hf = Mn = null, Qi = !1, i) : null;
    switch (i) {
      case "paste":
        return null;
      case "keypress":
        if (!(a.ctrlKey || a.altKey || a.metaKey) || a.ctrlKey && a.altKey) {
          if (a.char && 1 < a.char.length) return a.char;
          if (a.which) return String.fromCharCode(a.which);
        }
        return null;
      case "compositionend":
        return zm && a.locale !== "ko" ? null : a.data;
      default:
        return null;
    }
  }
  var kk = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function Hm(i) {
    var a = i && i.nodeName && i.nodeName.toLowerCase();
    return a === "input" ? !!kk[i.type] : a === "textarea";
  }
  function Km(i, a, u, v) {
    fm(v), a = tu(a, "onChange"), 0 < a.length && (u = new pf("onChange", "change", null, u, v), i.push({ event: u, listeners: a }));
  }
  var po = null, mo = null;
  function _k(i) {
    sy(i, 0);
  }
  function Ql(i) {
    var a = ra(i);
    if (Z(a)) return i;
  }
  function Ck(i, a) {
    if (i === "change") return a;
  }
  var Vm = !1;
  if (c) {
    var bf;
    if (c) {
      var Sf = "oninput" in document;
      if (!Sf) {
        var Ym = document.createElement("div");
        Ym.setAttribute("oninput", "return;"), Sf = typeof Ym.oninput == "function";
      }
      bf = Sf;
    } else bf = !1;
    Vm = bf && (!document.documentMode || 9 < document.documentMode);
  }
  function Gm() {
    po && (po.detachEvent("onpropertychange", Xm), mo = po = null);
  }
  function Xm(i) {
    if (i.propertyName === "value" && Ql(mo)) {
      var a = [];
      Km(a, mo, i, ef(i)), pm(_k, a);
    }
  }
  function Ik(i, a, u) {
    i === "focusin" ? (Gm(), po = a, mo = u, po.attachEvent("onpropertychange", Xm)) : i === "focusout" && Gm();
  }
  function jk(i) {
    if (i === "selectionchange" || i === "keyup" || i === "keydown") return Ql(mo);
  }
  function Tk(i, a) {
    if (i === "click") return Ql(a);
  }
  function Nk(i, a) {
    if (i === "input" || i === "change") return Ql(a);
  }
  function Mk(i, a) {
    return i === a && (i !== 0 || 1 / i === 1 / a) || i !== i && a !== a;
  }
  var Er = typeof Object.is == "function" ? Object.is : Mk;
  function yo(i, a) {
    if (Er(i, a)) return !0;
    if (typeof i != "object" || i === null || typeof a != "object" || a === null) return !1;
    var u = Object.keys(i), v = Object.keys(a);
    if (u.length !== v.length) return !1;
    for (v = 0; v < u.length; v++) {
      var m = u[v];
      if (!f.call(a, m) || !Er(i[m], a[m])) return !1;
    }
    return !0;
  }
  function qm(i) {
    for (; i && i.firstChild; ) i = i.firstChild;
    return i;
  }
  function Qm(i, a) {
    var u = qm(i);
    i = 0;
    for (var v; u; ) {
      if (u.nodeType === 3) {
        if (v = i + u.textContent.length, i <= a && v >= a) return { node: u, offset: a - i };
        i = v;
      }
      e: {
        for (; u; ) {
          if (u.nextSibling) {
            u = u.nextSibling;
            break e;
          }
          u = u.parentNode;
        }
        u = void 0;
      }
      u = qm(u);
    }
  }
  function Zm(i, a) {
    return i && a ? i === a ? !0 : i && i.nodeType === 3 ? !1 : a && a.nodeType === 3 ? Zm(i, a.parentNode) : "contains" in i ? i.contains(a) : i.compareDocumentPosition ? !!(i.compareDocumentPosition(a) & 16) : !1 : !1;
  }
  function Jm() {
    for (var i = window, a = Ze(); a instanceof i.HTMLIFrameElement; ) {
      try {
        var u = typeof a.contentWindow.location.href == "string";
      } catch {
        u = !1;
      }
      if (u) i = a.contentWindow;
      else break;
      a = Ze(i.document);
    }
    return a;
  }
  function Af(i) {
    var a = i && i.nodeName && i.nodeName.toLowerCase();
    return a && (a === "input" && (i.type === "text" || i.type === "search" || i.type === "tel" || i.type === "url" || i.type === "password") || a === "textarea" || i.contentEditable === "true");
  }
  function Dk(i) {
    var a = Jm(), u = i.focusedElem, v = i.selectionRange;
    if (a !== u && u && u.ownerDocument && Zm(u.ownerDocument.documentElement, u)) {
      if (v !== null && Af(u)) {
        if (a = v.start, i = v.end, i === void 0 && (i = a), "selectionStart" in u) u.selectionStart = a, u.selectionEnd = Math.min(i, u.value.length);
        else if (i = (a = u.ownerDocument || document) && a.defaultView || window, i.getSelection) {
          i = i.getSelection();
          var m = u.textContent.length, g = Math.min(v.start, m);
          v = v.end === void 0 ? g : Math.min(v.end, m), !i.extend && g > v && (m = v, v = g, g = m), m = Qm(u, g);
          var P = Qm(
            u,
            v
          );
          m && P && (i.rangeCount !== 1 || i.anchorNode !== m.node || i.anchorOffset !== m.offset || i.focusNode !== P.node || i.focusOffset !== P.offset) && (a = a.createRange(), a.setStart(m.node, m.offset), i.removeAllRanges(), g > v ? (i.addRange(a), i.extend(P.node, P.offset)) : (a.setEnd(P.node, P.offset), i.addRange(a)));
        }
      }
      for (a = [], i = u; i = i.parentNode; ) i.nodeType === 1 && a.push({ element: i, left: i.scrollLeft, top: i.scrollTop });
      for (typeof u.focus == "function" && u.focus(), u = 0; u < a.length; u++) i = a[u], i.element.scrollLeft = i.left, i.element.scrollTop = i.top;
    }
  }
  var $k = c && "documentMode" in document && 11 >= document.documentMode, Zi = null, Pf = null, go = null, Ef = !1;
  function ey(i, a, u) {
    var v = u.window === u ? u.document : u.nodeType === 9 ? u : u.ownerDocument;
    Ef || Zi == null || Zi !== Ze(v) || (v = Zi, "selectionStart" in v && Af(v) ? v = { start: v.selectionStart, end: v.selectionEnd } : (v = (v.ownerDocument && v.ownerDocument.defaultView || window).getSelection(), v = { anchorNode: v.anchorNode, anchorOffset: v.anchorOffset, focusNode: v.focusNode, focusOffset: v.focusOffset }), go && yo(go, v) || (go = v, v = tu(Pf, "onSelect"), 0 < v.length && (a = new pf("onSelect", "select", null, a, u), i.push({ event: a, listeners: v }), a.target = Zi)));
  }
  function Zl(i, a) {
    var u = {};
    return u[i.toLowerCase()] = a.toLowerCase(), u["Webkit" + i] = "webkit" + a, u["Moz" + i] = "moz" + a, u;
  }
  var Ji = { animationend: Zl("Animation", "AnimationEnd"), animationiteration: Zl("Animation", "AnimationIteration"), animationstart: Zl("Animation", "AnimationStart"), transitionend: Zl("Transition", "TransitionEnd") }, Of = {}, ty = {};
  c && (ty = document.createElement("div").style, "AnimationEvent" in window || (delete Ji.animationend.animation, delete Ji.animationiteration.animation, delete Ji.animationstart.animation), "TransitionEvent" in window || delete Ji.transitionend.transition);
  function Jl(i) {
    if (Of[i]) return Of[i];
    if (!Ji[i]) return i;
    var a = Ji[i], u;
    for (u in a) if (a.hasOwnProperty(u) && u in ty) return Of[i] = a[u];
    return i;
  }
  var ry = Jl("animationend"), ny = Jl("animationiteration"), iy = Jl("animationstart"), ay = Jl("transitionend"), oy = /* @__PURE__ */ new Map(), ly = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function Dn(i, a) {
    oy.set(i, a), l(a, [i]);
  }
  for (var kf = 0; kf < ly.length; kf++) {
    var _f = ly[kf], Lk = _f.toLowerCase(), Rk = _f[0].toUpperCase() + _f.slice(1);
    Dn(Lk, "on" + Rk);
  }
  Dn(ry, "onAnimationEnd"), Dn(ny, "onAnimationIteration"), Dn(iy, "onAnimationStart"), Dn("dblclick", "onDoubleClick"), Dn("focusin", "onFocus"), Dn("focusout", "onBlur"), Dn(ay, "onTransitionEnd"), s("onMouseEnter", ["mouseout", "mouseover"]), s("onMouseLeave", ["mouseout", "mouseover"]), s("onPointerEnter", ["pointerout", "pointerover"]), s("onPointerLeave", ["pointerout", "pointerover"]), l("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), l("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), l("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), l("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), l("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), l("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var xo = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), zk = new Set("cancel close invalid load scroll toggle".split(" ").concat(xo));
  function uy(i, a, u) {
    var v = i.type || "unknown-event";
    i.currentTarget = u, LO(v, a, void 0, i), i.currentTarget = null;
  }
  function sy(i, a) {
    a = (a & 4) !== 0;
    for (var u = 0; u < i.length; u++) {
      var v = i[u], m = v.event;
      v = v.listeners;
      e: {
        var g = void 0;
        if (a) for (var P = v.length - 1; 0 <= P; P--) {
          var I = v[P], M = I.instance, B = I.currentTarget;
          if (I = I.listener, M !== g && m.isPropagationStopped()) break e;
          uy(m, I, B), g = M;
        }
        else for (P = 0; P < v.length; P++) {
          if (I = v[P], M = I.instance, B = I.currentTarget, I = I.listener, M !== g && m.isPropagationStopped()) break e;
          uy(m, I, B), g = M;
        }
      }
    }
    if (Ll) throw i = af, Ll = !1, af = null, i;
  }
  function Fe(i, a) {
    var u = a[$f];
    u === void 0 && (u = a[$f] = /* @__PURE__ */ new Set());
    var v = i + "__bubble";
    u.has(v) || (cy(a, i, 2, !1), u.add(v));
  }
  function Cf(i, a, u) {
    var v = 0;
    a && (v |= 4), cy(u, i, v, a);
  }
  var eu = "_reactListening" + Math.random().toString(36).slice(2);
  function wo(i) {
    if (!i[eu]) {
      i[eu] = !0, n.forEach(function(u) {
        u !== "selectionchange" && (zk.has(u) || Cf(u, !1, i), Cf(u, !0, i));
      });
      var a = i.nodeType === 9 ? i : i.ownerDocument;
      a === null || a[eu] || (a[eu] = !0, Cf("selectionchange", !1, a));
    }
  }
  function cy(i, a, u, v) {
    switch (Nm(a)) {
      case 1:
        var m = JO;
        break;
      case 4:
        m = ek;
        break;
      default:
        m = df;
    }
    u = m.bind(null, a, u, i), m = void 0, !nf || a !== "touchstart" && a !== "touchmove" && a !== "wheel" || (m = !0), v ? m !== void 0 ? i.addEventListener(a, u, { capture: !0, passive: m }) : i.addEventListener(a, u, !0) : m !== void 0 ? i.addEventListener(a, u, { passive: m }) : i.addEventListener(a, u, !1);
  }
  function If(i, a, u, v, m) {
    var g = v;
    if ((a & 1) === 0 && (a & 2) === 0 && v !== null) e: for (; ; ) {
      if (v === null) return;
      var P = v.tag;
      if (P === 3 || P === 4) {
        var I = v.stateNode.containerInfo;
        if (I === m || I.nodeType === 8 && I.parentNode === m) break;
        if (P === 4) for (P = v.return; P !== null; ) {
          var M = P.tag;
          if ((M === 3 || M === 4) && (M = P.stateNode.containerInfo, M === m || M.nodeType === 8 && M.parentNode === m)) return;
          P = P.return;
        }
        for (; I !== null; ) {
          if (P = li(I), P === null) return;
          if (M = P.tag, M === 5 || M === 6) {
            v = g = P;
            continue e;
          }
          I = I.parentNode;
        }
      }
      v = v.return;
    }
    pm(function() {
      var B = g, X = ef(u), Q = [];
      e: {
        var G = oy.get(i);
        if (G !== void 0) {
          var ne = pf, se = i;
          switch (i) {
            case "keypress":
              if (Gl(u) === 0) break e;
            case "keydown":
            case "keyup":
              ne = pk;
              break;
            case "focusin":
              se = "focus", ne = gf;
              break;
            case "focusout":
              se = "blur", ne = gf;
              break;
            case "beforeblur":
            case "afterblur":
              ne = gf;
              break;
            case "click":
              if (u.button === 2) break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              ne = $m;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              ne = nk;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              ne = gk;
              break;
            case ry:
            case ny:
            case iy:
              ne = ok;
              break;
            case ay:
              ne = wk;
              break;
            case "scroll":
              ne = tk;
              break;
            case "wheel":
              ne = Sk;
              break;
            case "copy":
            case "cut":
            case "paste":
              ne = uk;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              ne = Rm;
          }
          var ce = (a & 4) !== 0, et = !ce && i === "scroll", L = ce ? G !== null ? G + "Capture" : null : G;
          ce = [];
          for (var D = B, R; D !== null; ) {
            R = D;
            var ee = R.stateNode;
            if (R.tag === 5 && ee !== null && (R = ee, L !== null && (ee = to(D, L), ee != null && ce.push(bo(D, ee, R)))), et) break;
            D = D.return;
          }
          0 < ce.length && (G = new ne(G, se, null, u, X), Q.push({ event: G, listeners: ce }));
        }
      }
      if ((a & 7) === 0) {
        e: {
          if (G = i === "mouseover" || i === "pointerover", ne = i === "mouseout" || i === "pointerout", G && u !== Jc && (se = u.relatedTarget || u.fromElement) && (li(se) || se[nn])) break e;
          if ((ne || G) && (G = X.window === X ? X : (G = X.ownerDocument) ? G.defaultView || G.parentWindow : window, ne ? (se = u.relatedTarget || u.toElement, ne = B, se = se ? li(se) : null, se !== null && (et = oi(se), se !== et || se.tag !== 5 && se.tag !== 6) && (se = null)) : (ne = null, se = B), ne !== se)) {
            if (ce = $m, ee = "onMouseLeave", L = "onMouseEnter", D = "mouse", (i === "pointerout" || i === "pointerover") && (ce = Rm, ee = "onPointerLeave", L = "onPointerEnter", D = "pointer"), et = ne == null ? G : ra(ne), R = se == null ? G : ra(se), G = new ce(ee, D + "leave", ne, u, X), G.target = et, G.relatedTarget = R, ee = null, li(X) === B && (ce = new ce(L, D + "enter", se, u, X), ce.target = R, ce.relatedTarget = et, ee = ce), et = ee, ne && se) t: {
              for (ce = ne, L = se, D = 0, R = ce; R; R = ea(R)) D++;
              for (R = 0, ee = L; ee; ee = ea(ee)) R++;
              for (; 0 < D - R; ) ce = ea(ce), D--;
              for (; 0 < R - D; ) L = ea(L), R--;
              for (; D--; ) {
                if (ce === L || L !== null && ce === L.alternate) break t;
                ce = ea(ce), L = ea(L);
              }
              ce = null;
            }
            else ce = null;
            ne !== null && fy(Q, G, ne, ce, !1), se !== null && et !== null && fy(Q, et, se, ce, !0);
          }
        }
        e: {
          if (G = B ? ra(B) : window, ne = G.nodeName && G.nodeName.toLowerCase(), ne === "select" || ne === "input" && G.type === "file") var de = Ck;
          else if (Hm(G)) if (Vm) de = Nk;
          else {
            de = jk;
            var me = Ik;
          }
          else (ne = G.nodeName) && ne.toLowerCase() === "input" && (G.type === "checkbox" || G.type === "radio") && (de = Tk);
          if (de && (de = de(i, B))) {
            Km(Q, de, u, X);
            break e;
          }
          me && me(i, G, B), i === "focusout" && (me = G._wrapperState) && me.controlled && G.type === "number" && Gc(G, "number", G.value);
        }
        switch (me = B ? ra(B) : window, i) {
          case "focusin":
            (Hm(me) || me.contentEditable === "true") && (Zi = me, Pf = B, go = null);
            break;
          case "focusout":
            go = Pf = Zi = null;
            break;
          case "mousedown":
            Ef = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            Ef = !1, ey(Q, u, X);
            break;
          case "selectionchange":
            if ($k) break;
          case "keydown":
          case "keyup":
            ey(Q, u, X);
        }
        var ye;
        if (wf) e: {
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
        else Qi ? Wm(i, u) && (Se = "onCompositionEnd") : i === "keydown" && u.keyCode === 229 && (Se = "onCompositionStart");
        Se && (zm && u.locale !== "ko" && (Qi || Se !== "onCompositionStart" ? Se === "onCompositionEnd" && Qi && (ye = Mm()) : (Mn = X, hf = "value" in Mn ? Mn.value : Mn.textContent, Qi = !0)), me = tu(B, Se), 0 < me.length && (Se = new Lm(Se, i, null, u, X), Q.push({ event: Se, listeners: me }), ye ? Se.data = ye : (ye = Um(u), ye !== null && (Se.data = ye)))), (ye = Pk ? Ek(i, u) : Ok(i, u)) && (B = tu(B, "onBeforeInput"), 0 < B.length && (X = new Lm("onBeforeInput", "beforeinput", null, u, X), Q.push({ event: X, listeners: B }), X.data = ye));
      }
      sy(Q, a);
    });
  }
  function bo(i, a, u) {
    return { instance: i, listener: a, currentTarget: u };
  }
  function tu(i, a) {
    for (var u = a + "Capture", v = []; i !== null; ) {
      var m = i, g = m.stateNode;
      m.tag === 5 && g !== null && (m = g, g = to(i, u), g != null && v.unshift(bo(i, g, m)), g = to(i, a), g != null && v.push(bo(i, g, m))), i = i.return;
    }
    return v;
  }
  function ea(i) {
    if (i === null) return null;
    do
      i = i.return;
    while (i && i.tag !== 5);
    return i || null;
  }
  function fy(i, a, u, v, m) {
    for (var g = a._reactName, P = []; u !== null && u !== v; ) {
      var I = u, M = I.alternate, B = I.stateNode;
      if (M !== null && M === v) break;
      I.tag === 5 && B !== null && (I = B, m ? (M = to(u, g), M != null && P.unshift(bo(u, M, I))) : m || (M = to(u, g), M != null && P.push(bo(u, M, I)))), u = u.return;
    }
    P.length !== 0 && i.push({ event: a, listeners: P });
  }
  var Bk = /\r\n?/g, Fk = /\u0000|\uFFFD/g;
  function dy(i) {
    return (typeof i == "string" ? i : "" + i).replace(Bk, `
`).replace(Fk, "");
  }
  function ru(i, a, u) {
    if (a = dy(a), dy(i) !== a && u) throw Error(r(425));
  }
  function nu() {
  }
  var jf = null, Tf = null;
  function Nf(i, a) {
    return i === "textarea" || i === "noscript" || typeof a.children == "string" || typeof a.children == "number" || typeof a.dangerouslySetInnerHTML == "object" && a.dangerouslySetInnerHTML !== null && a.dangerouslySetInnerHTML.__html != null;
  }
  var Mf = typeof setTimeout == "function" ? setTimeout : void 0, Wk = typeof clearTimeout == "function" ? clearTimeout : void 0, vy = typeof Promise == "function" ? Promise : void 0, Uk = typeof queueMicrotask == "function" ? queueMicrotask : typeof vy < "u" ? function(i) {
    return vy.resolve(null).then(i).catch(Hk);
  } : Mf;
  function Hk(i) {
    setTimeout(function() {
      throw i;
    });
  }
  function Df(i, a) {
    var u = a, v = 0;
    do {
      var m = u.nextSibling;
      if (i.removeChild(u), m && m.nodeType === 8) if (u = m.data, u === "/$") {
        if (v === 0) {
          i.removeChild(m), co(a);
          return;
        }
        v--;
      } else u !== "$" && u !== "$?" && u !== "$!" || v++;
      u = m;
    } while (u);
    co(a);
  }
  function $n(i) {
    for (; i != null; i = i.nextSibling) {
      var a = i.nodeType;
      if (a === 1 || a === 3) break;
      if (a === 8) {
        if (a = i.data, a === "$" || a === "$!" || a === "$?") break;
        if (a === "/$") return null;
      }
    }
    return i;
  }
  function hy(i) {
    i = i.previousSibling;
    for (var a = 0; i; ) {
      if (i.nodeType === 8) {
        var u = i.data;
        if (u === "$" || u === "$!" || u === "$?") {
          if (a === 0) return i;
          a--;
        } else u === "/$" && a++;
      }
      i = i.previousSibling;
    }
    return null;
  }
  var ta = Math.random().toString(36).slice(2), Br = "__reactFiber$" + ta, So = "__reactProps$" + ta, nn = "__reactContainer$" + ta, $f = "__reactEvents$" + ta, Kk = "__reactListeners$" + ta, Vk = "__reactHandles$" + ta;
  function li(i) {
    var a = i[Br];
    if (a) return a;
    for (var u = i.parentNode; u; ) {
      if (a = u[nn] || u[Br]) {
        if (u = a.alternate, a.child !== null || u !== null && u.child !== null) for (i = hy(i); i !== null; ) {
          if (u = i[Br]) return u;
          i = hy(i);
        }
        return a;
      }
      i = u, u = i.parentNode;
    }
    return null;
  }
  function Ao(i) {
    return i = i[Br] || i[nn], !i || i.tag !== 5 && i.tag !== 6 && i.tag !== 13 && i.tag !== 3 ? null : i;
  }
  function ra(i) {
    if (i.tag === 5 || i.tag === 6) return i.stateNode;
    throw Error(r(33));
  }
  function iu(i) {
    return i[So] || null;
  }
  var Lf = [], na = -1;
  function Ln(i) {
    return { current: i };
  }
  function We(i) {
    0 > na || (i.current = Lf[na], Lf[na] = null, na--);
  }
  function Re(i, a) {
    na++, Lf[na] = i.current, i.current = a;
  }
  var Rn = {}, kt = Ln(Rn), Wt = Ln(!1), ui = Rn;
  function ia(i, a) {
    var u = i.type.contextTypes;
    if (!u) return Rn;
    var v = i.stateNode;
    if (v && v.__reactInternalMemoizedUnmaskedChildContext === a) return v.__reactInternalMemoizedMaskedChildContext;
    var m = {}, g;
    for (g in u) m[g] = a[g];
    return v && (i = i.stateNode, i.__reactInternalMemoizedUnmaskedChildContext = a, i.__reactInternalMemoizedMaskedChildContext = m), m;
  }
  function Ut(i) {
    return i = i.childContextTypes, i != null;
  }
  function au() {
    We(Wt), We(kt);
  }
  function py(i, a, u) {
    if (kt.current !== Rn) throw Error(r(168));
    Re(kt, a), Re(Wt, u);
  }
  function my(i, a, u) {
    var v = i.stateNode;
    if (a = a.childContextTypes, typeof v.getChildContext != "function") return u;
    v = v.getChildContext();
    for (var m in v) if (!(m in a)) throw Error(r(108, Ee(i) || "Unknown", m));
    return Y({}, u, v);
  }
  function ou(i) {
    return i = (i = i.stateNode) && i.__reactInternalMemoizedMergedChildContext || Rn, ui = kt.current, Re(kt, i), Re(Wt, Wt.current), !0;
  }
  function yy(i, a, u) {
    var v = i.stateNode;
    if (!v) throw Error(r(169));
    u ? (i = my(i, a, ui), v.__reactInternalMemoizedMergedChildContext = i, We(Wt), We(kt), Re(kt, i)) : We(Wt), Re(Wt, u);
  }
  var an = null, lu = !1, Rf = !1;
  function gy(i) {
    an === null ? an = [i] : an.push(i);
  }
  function Yk(i) {
    lu = !0, gy(i);
  }
  function zn() {
    if (!Rf && an !== null) {
      Rf = !0;
      var i = 0, a = $e;
      try {
        var u = an;
        for ($e = 1; i < u.length; i++) {
          var v = u[i];
          do
            v = v(!0);
          while (v !== null);
        }
        an = null, lu = !1;
      } catch (m) {
        throw an !== null && (an = an.slice(i + 1)), wm(of, zn), m;
      } finally {
        $e = a, Rf = !1;
      }
    }
    return null;
  }
  var aa = [], oa = 0, uu = null, su = 0, ur = [], sr = 0, si = null, on = 1, ln = "";
  function ci(i, a) {
    aa[oa++] = su, aa[oa++] = uu, uu = i, su = a;
  }
  function xy(i, a, u) {
    ur[sr++] = on, ur[sr++] = ln, ur[sr++] = si, si = i;
    var v = on;
    i = ln;
    var m = 32 - Pr(v) - 1;
    v &= ~(1 << m), u += 1;
    var g = 32 - Pr(a) + m;
    if (30 < g) {
      var P = m - m % 5;
      g = (v & (1 << P) - 1).toString(32), v >>= P, m -= P, on = 1 << 32 - Pr(a) + m | u << m | v, ln = g + i;
    } else on = 1 << g | u << m | v, ln = i;
  }
  function zf(i) {
    i.return !== null && (ci(i, 1), xy(i, 1, 0));
  }
  function Bf(i) {
    for (; i === uu; ) uu = aa[--oa], aa[oa] = null, su = aa[--oa], aa[oa] = null;
    for (; i === si; ) si = ur[--sr], ur[sr] = null, ln = ur[--sr], ur[sr] = null, on = ur[--sr], ur[sr] = null;
  }
  var Zt = null, Jt = null, Ke = !1, Or = null;
  function wy(i, a) {
    var u = vr(5, null, null, 0);
    u.elementType = "DELETED", u.stateNode = a, u.return = i, a = i.deletions, a === null ? (i.deletions = [u], i.flags |= 16) : a.push(u);
  }
  function by(i, a) {
    switch (i.tag) {
      case 5:
        var u = i.type;
        return a = a.nodeType !== 1 || u.toLowerCase() !== a.nodeName.toLowerCase() ? null : a, a !== null ? (i.stateNode = a, Zt = i, Jt = $n(a.firstChild), !0) : !1;
      case 6:
        return a = i.pendingProps === "" || a.nodeType !== 3 ? null : a, a !== null ? (i.stateNode = a, Zt = i, Jt = null, !0) : !1;
      case 13:
        return a = a.nodeType !== 8 ? null : a, a !== null ? (u = si !== null ? { id: on, overflow: ln } : null, i.memoizedState = { dehydrated: a, treeContext: u, retryLane: 1073741824 }, u = vr(18, null, null, 0), u.stateNode = a, u.return = i, i.child = u, Zt = i, Jt = null, !0) : !1;
      default:
        return !1;
    }
  }
  function Ff(i) {
    return (i.mode & 1) !== 0 && (i.flags & 128) === 0;
  }
  function Wf(i) {
    if (Ke) {
      var a = Jt;
      if (a) {
        var u = a;
        if (!by(i, a)) {
          if (Ff(i)) throw Error(r(418));
          a = $n(u.nextSibling);
          var v = Zt;
          a && by(i, a) ? wy(v, u) : (i.flags = i.flags & -4097 | 2, Ke = !1, Zt = i);
        }
      } else {
        if (Ff(i)) throw Error(r(418));
        i.flags = i.flags & -4097 | 2, Ke = !1, Zt = i;
      }
    }
  }
  function Sy(i) {
    for (i = i.return; i !== null && i.tag !== 5 && i.tag !== 3 && i.tag !== 13; ) i = i.return;
    Zt = i;
  }
  function cu(i) {
    if (i !== Zt) return !1;
    if (!Ke) return Sy(i), Ke = !0, !1;
    var a;
    if ((a = i.tag !== 3) && !(a = i.tag !== 5) && (a = i.type, a = a !== "head" && a !== "body" && !Nf(i.type, i.memoizedProps)), a && (a = Jt)) {
      if (Ff(i)) throw Ay(), Error(r(418));
      for (; a; ) wy(i, a), a = $n(a.nextSibling);
    }
    if (Sy(i), i.tag === 13) {
      if (i = i.memoizedState, i = i !== null ? i.dehydrated : null, !i) throw Error(r(317));
      e: {
        for (i = i.nextSibling, a = 0; i; ) {
          if (i.nodeType === 8) {
            var u = i.data;
            if (u === "/$") {
              if (a === 0) {
                Jt = $n(i.nextSibling);
                break e;
              }
              a--;
            } else u !== "$" && u !== "$!" && u !== "$?" || a++;
          }
          i = i.nextSibling;
        }
        Jt = null;
      }
    } else Jt = Zt ? $n(i.stateNode.nextSibling) : null;
    return !0;
  }
  function Ay() {
    for (var i = Jt; i; ) i = $n(i.nextSibling);
  }
  function la() {
    Jt = Zt = null, Ke = !1;
  }
  function Uf(i) {
    Or === null ? Or = [i] : Or.push(i);
  }
  var Gk = j.ReactCurrentBatchConfig;
  function Po(i, a, u) {
    if (i = u.ref, i !== null && typeof i != "function" && typeof i != "object") {
      if (u._owner) {
        if (u = u._owner, u) {
          if (u.tag !== 1) throw Error(r(309));
          var v = u.stateNode;
        }
        if (!v) throw Error(r(147, i));
        var m = v, g = "" + i;
        return a !== null && a.ref !== null && typeof a.ref == "function" && a.ref._stringRef === g ? a.ref : (a = function(P) {
          var I = m.refs;
          P === null ? delete I[g] : I[g] = P;
        }, a._stringRef = g, a);
      }
      if (typeof i != "string") throw Error(r(284));
      if (!u._owner) throw Error(r(290, i));
    }
    return i;
  }
  function fu(i, a) {
    throw i = Object.prototype.toString.call(a), Error(r(31, i === "[object Object]" ? "object with keys {" + Object.keys(a).join(", ") + "}" : i));
  }
  function Py(i) {
    var a = i._init;
    return a(i._payload);
  }
  function Ey(i) {
    function a(L, D) {
      if (i) {
        var R = L.deletions;
        R === null ? (L.deletions = [D], L.flags |= 16) : R.push(D);
      }
    }
    function u(L, D) {
      if (!i) return null;
      for (; D !== null; ) a(L, D), D = D.sibling;
      return null;
    }
    function v(L, D) {
      for (L = /* @__PURE__ */ new Map(); D !== null; ) D.key !== null ? L.set(D.key, D) : L.set(D.index, D), D = D.sibling;
      return L;
    }
    function m(L, D) {
      return L = Yn(L, D), L.index = 0, L.sibling = null, L;
    }
    function g(L, D, R) {
      return L.index = R, i ? (R = L.alternate, R !== null ? (R = R.index, R < D ? (L.flags |= 2, D) : R) : (L.flags |= 2, D)) : (L.flags |= 1048576, D);
    }
    function P(L) {
      return i && L.alternate === null && (L.flags |= 2), L;
    }
    function I(L, D, R, ee) {
      return D === null || D.tag !== 6 ? (D = Md(R, L.mode, ee), D.return = L, D) : (D = m(D, R), D.return = L, D);
    }
    function M(L, D, R, ee) {
      var de = R.type;
      return de === _ ? X(L, D, R.props.children, ee, R.key) : D !== null && (D.elementType === de || typeof de == "object" && de !== null && de.$$typeof === ve && Py(de) === D.type) ? (ee = m(D, R.props), ee.ref = Po(L, D, R), ee.return = L, ee) : (ee = Du(R.type, R.key, R.props, null, L.mode, ee), ee.ref = Po(L, D, R), ee.return = L, ee);
    }
    function B(L, D, R, ee) {
      return D === null || D.tag !== 4 || D.stateNode.containerInfo !== R.containerInfo || D.stateNode.implementation !== R.implementation ? (D = Dd(R, L.mode, ee), D.return = L, D) : (D = m(D, R.children || []), D.return = L, D);
    }
    function X(L, D, R, ee, de) {
      return D === null || D.tag !== 7 ? (D = gi(R, L.mode, ee, de), D.return = L, D) : (D = m(D, R), D.return = L, D);
    }
    function Q(L, D, R) {
      if (typeof D == "string" && D !== "" || typeof D == "number") return D = Md("" + D, L.mode, R), D.return = L, D;
      if (typeof D == "object" && D !== null) {
        switch (D.$$typeof) {
          case T:
            return R = Du(D.type, D.key, D.props, null, L.mode, R), R.ref = Po(L, null, D), R.return = L, R;
          case O:
            return D = Dd(D, L.mode, R), D.return = L, D;
          case ve:
            var ee = D._init;
            return Q(L, ee(D._payload), R);
        }
        if (Za(D) || te(D)) return D = gi(D, L.mode, R, null), D.return = L, D;
        fu(L, D);
      }
      return null;
    }
    function G(L, D, R, ee) {
      var de = D !== null ? D.key : null;
      if (typeof R == "string" && R !== "" || typeof R == "number") return de !== null ? null : I(L, D, "" + R, ee);
      if (typeof R == "object" && R !== null) {
        switch (R.$$typeof) {
          case T:
            return R.key === de ? M(L, D, R, ee) : null;
          case O:
            return R.key === de ? B(L, D, R, ee) : null;
          case ve:
            return de = R._init, G(
              L,
              D,
              de(R._payload),
              ee
            );
        }
        if (Za(R) || te(R)) return de !== null ? null : X(L, D, R, ee, null);
        fu(L, R);
      }
      return null;
    }
    function ne(L, D, R, ee, de) {
      if (typeof ee == "string" && ee !== "" || typeof ee == "number") return L = L.get(R) || null, I(D, L, "" + ee, de);
      if (typeof ee == "object" && ee !== null) {
        switch (ee.$$typeof) {
          case T:
            return L = L.get(ee.key === null ? R : ee.key) || null, M(D, L, ee, de);
          case O:
            return L = L.get(ee.key === null ? R : ee.key) || null, B(D, L, ee, de);
          case ve:
            var me = ee._init;
            return ne(L, D, R, me(ee._payload), de);
        }
        if (Za(ee) || te(ee)) return L = L.get(R) || null, X(D, L, ee, de, null);
        fu(D, ee);
      }
      return null;
    }
    function se(L, D, R, ee) {
      for (var de = null, me = null, ye = D, Se = D = 0, ht = null; ye !== null && Se < R.length; Se++) {
        ye.index > Se ? (ht = ye, ye = null) : ht = ye.sibling;
        var Te = G(L, ye, R[Se], ee);
        if (Te === null) {
          ye === null && (ye = ht);
          break;
        }
        i && ye && Te.alternate === null && a(L, ye), D = g(Te, D, Se), me === null ? de = Te : me.sibling = Te, me = Te, ye = ht;
      }
      if (Se === R.length) return u(L, ye), Ke && ci(L, Se), de;
      if (ye === null) {
        for (; Se < R.length; Se++) ye = Q(L, R[Se], ee), ye !== null && (D = g(ye, D, Se), me === null ? de = ye : me.sibling = ye, me = ye);
        return Ke && ci(L, Se), de;
      }
      for (ye = v(L, ye); Se < R.length; Se++) ht = ne(ye, L, Se, R[Se], ee), ht !== null && (i && ht.alternate !== null && ye.delete(ht.key === null ? Se : ht.key), D = g(ht, D, Se), me === null ? de = ht : me.sibling = ht, me = ht);
      return i && ye.forEach(function(Gn) {
        return a(L, Gn);
      }), Ke && ci(L, Se), de;
    }
    function ce(L, D, R, ee) {
      var de = te(R);
      if (typeof de != "function") throw Error(r(150));
      if (R = de.call(R), R == null) throw Error(r(151));
      for (var me = de = null, ye = D, Se = D = 0, ht = null, Te = R.next(); ye !== null && !Te.done; Se++, Te = R.next()) {
        ye.index > Se ? (ht = ye, ye = null) : ht = ye.sibling;
        var Gn = G(L, ye, Te.value, ee);
        if (Gn === null) {
          ye === null && (ye = ht);
          break;
        }
        i && ye && Gn.alternate === null && a(L, ye), D = g(Gn, D, Se), me === null ? de = Gn : me.sibling = Gn, me = Gn, ye = ht;
      }
      if (Te.done) return u(
        L,
        ye
      ), Ke && ci(L, Se), de;
      if (ye === null) {
        for (; !Te.done; Se++, Te = R.next()) Te = Q(L, Te.value, ee), Te !== null && (D = g(Te, D, Se), me === null ? de = Te : me.sibling = Te, me = Te);
        return Ke && ci(L, Se), de;
      }
      for (ye = v(L, ye); !Te.done; Se++, Te = R.next()) Te = ne(ye, L, Se, Te.value, ee), Te !== null && (i && Te.alternate !== null && ye.delete(Te.key === null ? Se : Te.key), D = g(Te, D, Se), me === null ? de = Te : me.sibling = Te, me = Te);
      return i && ye.forEach(function(k_) {
        return a(L, k_);
      }), Ke && ci(L, Se), de;
    }
    function et(L, D, R, ee) {
      if (typeof R == "object" && R !== null && R.type === _ && R.key === null && (R = R.props.children), typeof R == "object" && R !== null) {
        switch (R.$$typeof) {
          case T:
            e: {
              for (var de = R.key, me = D; me !== null; ) {
                if (me.key === de) {
                  if (de = R.type, de === _) {
                    if (me.tag === 7) {
                      u(L, me.sibling), D = m(me, R.props.children), D.return = L, L = D;
                      break e;
                    }
                  } else if (me.elementType === de || typeof de == "object" && de !== null && de.$$typeof === ve && Py(de) === me.type) {
                    u(L, me.sibling), D = m(me, R.props), D.ref = Po(L, me, R), D.return = L, L = D;
                    break e;
                  }
                  u(L, me);
                  break;
                } else a(L, me);
                me = me.sibling;
              }
              R.type === _ ? (D = gi(R.props.children, L.mode, ee, R.key), D.return = L, L = D) : (ee = Du(R.type, R.key, R.props, null, L.mode, ee), ee.ref = Po(L, D, R), ee.return = L, L = ee);
            }
            return P(L);
          case O:
            e: {
              for (me = R.key; D !== null; ) {
                if (D.key === me) if (D.tag === 4 && D.stateNode.containerInfo === R.containerInfo && D.stateNode.implementation === R.implementation) {
                  u(L, D.sibling), D = m(D, R.children || []), D.return = L, L = D;
                  break e;
                } else {
                  u(L, D);
                  break;
                }
                else a(L, D);
                D = D.sibling;
              }
              D = Dd(R, L.mode, ee), D.return = L, L = D;
            }
            return P(L);
          case ve:
            return me = R._init, et(L, D, me(R._payload), ee);
        }
        if (Za(R)) return se(L, D, R, ee);
        if (te(R)) return ce(L, D, R, ee);
        fu(L, R);
      }
      return typeof R == "string" && R !== "" || typeof R == "number" ? (R = "" + R, D !== null && D.tag === 6 ? (u(L, D.sibling), D = m(D, R), D.return = L, L = D) : (u(L, D), D = Md(R, L.mode, ee), D.return = L, L = D), P(L)) : u(L, D);
    }
    return et;
  }
  var ua = Ey(!0), Oy = Ey(!1), du = Ln(null), vu = null, sa = null, Hf = null;
  function Kf() {
    Hf = sa = vu = null;
  }
  function Vf(i) {
    var a = du.current;
    We(du), i._currentValue = a;
  }
  function Yf(i, a, u) {
    for (; i !== null; ) {
      var v = i.alternate;
      if ((i.childLanes & a) !== a ? (i.childLanes |= a, v !== null && (v.childLanes |= a)) : v !== null && (v.childLanes & a) !== a && (v.childLanes |= a), i === u) break;
      i = i.return;
    }
  }
  function ca(i, a) {
    vu = i, Hf = sa = null, i = i.dependencies, i !== null && i.firstContext !== null && ((i.lanes & a) !== 0 && (Ht = !0), i.firstContext = null);
  }
  function cr(i) {
    var a = i._currentValue;
    if (Hf !== i) if (i = { context: i, memoizedValue: a, next: null }, sa === null) {
      if (vu === null) throw Error(r(308));
      sa = i, vu.dependencies = { lanes: 0, firstContext: i };
    } else sa = sa.next = i;
    return a;
  }
  var fi = null;
  function Gf(i) {
    fi === null ? fi = [i] : fi.push(i);
  }
  function ky(i, a, u, v) {
    var m = a.interleaved;
    return m === null ? (u.next = u, Gf(a)) : (u.next = m.next, m.next = u), a.interleaved = u, un(i, v);
  }
  function un(i, a) {
    i.lanes |= a;
    var u = i.alternate;
    for (u !== null && (u.lanes |= a), u = i, i = i.return; i !== null; ) i.childLanes |= a, u = i.alternate, u !== null && (u.childLanes |= a), u = i, i = i.return;
    return u.tag === 3 ? u.stateNode : null;
  }
  var Bn = !1;
  function Xf(i) {
    i.updateQueue = { baseState: i.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function _y(i, a) {
    i = i.updateQueue, a.updateQueue === i && (a.updateQueue = { baseState: i.baseState, firstBaseUpdate: i.firstBaseUpdate, lastBaseUpdate: i.lastBaseUpdate, shared: i.shared, effects: i.effects });
  }
  function sn(i, a) {
    return { eventTime: i, lane: a, tag: 0, payload: null, callback: null, next: null };
  }
  function Fn(i, a, u) {
    var v = i.updateQueue;
    if (v === null) return null;
    if (v = v.shared, (Ie & 2) !== 0) {
      var m = v.pending;
      return m === null ? a.next = a : (a.next = m.next, m.next = a), v.pending = a, un(i, u);
    }
    return m = v.interleaved, m === null ? (a.next = a, Gf(v)) : (a.next = m.next, m.next = a), v.interleaved = a, un(i, u);
  }
  function hu(i, a, u) {
    if (a = a.updateQueue, a !== null && (a = a.shared, (u & 4194240) !== 0)) {
      var v = a.lanes;
      v &= i.pendingLanes, u |= v, a.lanes = u, sf(i, u);
    }
  }
  function Cy(i, a) {
    var u = i.updateQueue, v = i.alternate;
    if (v !== null && (v = v.updateQueue, u === v)) {
      var m = null, g = null;
      if (u = u.firstBaseUpdate, u !== null) {
        do {
          var P = { eventTime: u.eventTime, lane: u.lane, tag: u.tag, payload: u.payload, callback: u.callback, next: null };
          g === null ? m = g = P : g = g.next = P, u = u.next;
        } while (u !== null);
        g === null ? m = g = a : g = g.next = a;
      } else m = g = a;
      u = { baseState: v.baseState, firstBaseUpdate: m, lastBaseUpdate: g, shared: v.shared, effects: v.effects }, i.updateQueue = u;
      return;
    }
    i = u.lastBaseUpdate, i === null ? u.firstBaseUpdate = a : i.next = a, u.lastBaseUpdate = a;
  }
  function pu(i, a, u, v) {
    var m = i.updateQueue;
    Bn = !1;
    var g = m.firstBaseUpdate, P = m.lastBaseUpdate, I = m.shared.pending;
    if (I !== null) {
      m.shared.pending = null;
      var M = I, B = M.next;
      M.next = null, P === null ? g = B : P.next = B, P = M;
      var X = i.alternate;
      X !== null && (X = X.updateQueue, I = X.lastBaseUpdate, I !== P && (I === null ? X.firstBaseUpdate = B : I.next = B, X.lastBaseUpdate = M));
    }
    if (g !== null) {
      var Q = m.baseState;
      P = 0, X = B = M = null, I = g;
      do {
        var G = I.lane, ne = I.eventTime;
        if ((v & G) === G) {
          X !== null && (X = X.next = {
            eventTime: ne,
            lane: 0,
            tag: I.tag,
            payload: I.payload,
            callback: I.callback,
            next: null
          });
          e: {
            var se = i, ce = I;
            switch (G = a, ne = u, ce.tag) {
              case 1:
                if (se = ce.payload, typeof se == "function") {
                  Q = se.call(ne, Q, G);
                  break e;
                }
                Q = se;
                break e;
              case 3:
                se.flags = se.flags & -65537 | 128;
              case 0:
                if (se = ce.payload, G = typeof se == "function" ? se.call(ne, Q, G) : se, G == null) break e;
                Q = Y({}, Q, G);
                break e;
              case 2:
                Bn = !0;
            }
          }
          I.callback !== null && I.lane !== 0 && (i.flags |= 64, G = m.effects, G === null ? m.effects = [I] : G.push(I));
        } else ne = { eventTime: ne, lane: G, tag: I.tag, payload: I.payload, callback: I.callback, next: null }, X === null ? (B = X = ne, M = Q) : X = X.next = ne, P |= G;
        if (I = I.next, I === null) {
          if (I = m.shared.pending, I === null) break;
          G = I, I = G.next, G.next = null, m.lastBaseUpdate = G, m.shared.pending = null;
        }
      } while (!0);
      if (X === null && (M = Q), m.baseState = M, m.firstBaseUpdate = B, m.lastBaseUpdate = X, a = m.shared.interleaved, a !== null) {
        m = a;
        do
          P |= m.lane, m = m.next;
        while (m !== a);
      } else g === null && (m.shared.lanes = 0);
      hi |= P, i.lanes = P, i.memoizedState = Q;
    }
  }
  function Iy(i, a, u) {
    if (i = a.effects, a.effects = null, i !== null) for (a = 0; a < i.length; a++) {
      var v = i[a], m = v.callback;
      if (m !== null) {
        if (v.callback = null, v = u, typeof m != "function") throw Error(r(191, m));
        m.call(v);
      }
    }
  }
  var Eo = {}, Fr = Ln(Eo), Oo = Ln(Eo), ko = Ln(Eo);
  function di(i) {
    if (i === Eo) throw Error(r(174));
    return i;
  }
  function qf(i, a) {
    switch (Re(ko, a), Re(Oo, i), Re(Fr, Eo), i = a.nodeType, i) {
      case 9:
      case 11:
        a = (a = a.documentElement) ? a.namespaceURI : qc(null, "");
        break;
      default:
        i = i === 8 ? a.parentNode : a, a = i.namespaceURI || null, i = i.tagName, a = qc(a, i);
    }
    We(Fr), Re(Fr, a);
  }
  function fa() {
    We(Fr), We(Oo), We(ko);
  }
  function jy(i) {
    di(ko.current);
    var a = di(Fr.current), u = qc(a, i.type);
    a !== u && (Re(Oo, i), Re(Fr, u));
  }
  function Qf(i) {
    Oo.current === i && (We(Fr), We(Oo));
  }
  var Ye = Ln(0);
  function mu(i) {
    for (var a = i; a !== null; ) {
      if (a.tag === 13) {
        var u = a.memoizedState;
        if (u !== null && (u = u.dehydrated, u === null || u.data === "$?" || u.data === "$!")) return a;
      } else if (a.tag === 19 && a.memoizedProps.revealOrder !== void 0) {
        if ((a.flags & 128) !== 0) return a;
      } else if (a.child !== null) {
        a.child.return = a, a = a.child;
        continue;
      }
      if (a === i) break;
      for (; a.sibling === null; ) {
        if (a.return === null || a.return === i) return null;
        a = a.return;
      }
      a.sibling.return = a.return, a = a.sibling;
    }
    return null;
  }
  var Zf = [];
  function Jf() {
    for (var i = 0; i < Zf.length; i++) Zf[i]._workInProgressVersionPrimary = null;
    Zf.length = 0;
  }
  var yu = j.ReactCurrentDispatcher, ed = j.ReactCurrentBatchConfig, vi = 0, Ge = null, at = null, dt = null, gu = !1, _o = !1, Co = 0, Xk = 0;
  function _t() {
    throw Error(r(321));
  }
  function td(i, a) {
    if (a === null) return !1;
    for (var u = 0; u < a.length && u < i.length; u++) if (!Er(i[u], a[u])) return !1;
    return !0;
  }
  function rd(i, a, u, v, m, g) {
    if (vi = g, Ge = a, a.memoizedState = null, a.updateQueue = null, a.lanes = 0, yu.current = i === null || i.memoizedState === null ? Jk : e_, i = u(v, m), _o) {
      g = 0;
      do {
        if (_o = !1, Co = 0, 25 <= g) throw Error(r(301));
        g += 1, dt = at = null, a.updateQueue = null, yu.current = t_, i = u(v, m);
      } while (_o);
    }
    if (yu.current = bu, a = at !== null && at.next !== null, vi = 0, dt = at = Ge = null, gu = !1, a) throw Error(r(300));
    return i;
  }
  function nd() {
    var i = Co !== 0;
    return Co = 0, i;
  }
  function Wr() {
    var i = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return dt === null ? Ge.memoizedState = dt = i : dt = dt.next = i, dt;
  }
  function fr() {
    if (at === null) {
      var i = Ge.alternate;
      i = i !== null ? i.memoizedState : null;
    } else i = at.next;
    var a = dt === null ? Ge.memoizedState : dt.next;
    if (a !== null) dt = a, at = i;
    else {
      if (i === null) throw Error(r(310));
      at = i, i = { memoizedState: at.memoizedState, baseState: at.baseState, baseQueue: at.baseQueue, queue: at.queue, next: null }, dt === null ? Ge.memoizedState = dt = i : dt = dt.next = i;
    }
    return dt;
  }
  function Io(i, a) {
    return typeof a == "function" ? a(i) : a;
  }
  function id(i) {
    var a = fr(), u = a.queue;
    if (u === null) throw Error(r(311));
    u.lastRenderedReducer = i;
    var v = at, m = v.baseQueue, g = u.pending;
    if (g !== null) {
      if (m !== null) {
        var P = m.next;
        m.next = g.next, g.next = P;
      }
      v.baseQueue = m = g, u.pending = null;
    }
    if (m !== null) {
      g = m.next, v = v.baseState;
      var I = P = null, M = null, B = g;
      do {
        var X = B.lane;
        if ((vi & X) === X) M !== null && (M = M.next = { lane: 0, action: B.action, hasEagerState: B.hasEagerState, eagerState: B.eagerState, next: null }), v = B.hasEagerState ? B.eagerState : i(v, B.action);
        else {
          var Q = {
            lane: X,
            action: B.action,
            hasEagerState: B.hasEagerState,
            eagerState: B.eagerState,
            next: null
          };
          M === null ? (I = M = Q, P = v) : M = M.next = Q, Ge.lanes |= X, hi |= X;
        }
        B = B.next;
      } while (B !== null && B !== g);
      M === null ? P = v : M.next = I, Er(v, a.memoizedState) || (Ht = !0), a.memoizedState = v, a.baseState = P, a.baseQueue = M, u.lastRenderedState = v;
    }
    if (i = u.interleaved, i !== null) {
      m = i;
      do
        g = m.lane, Ge.lanes |= g, hi |= g, m = m.next;
      while (m !== i);
    } else m === null && (u.lanes = 0);
    return [a.memoizedState, u.dispatch];
  }
  function ad(i) {
    var a = fr(), u = a.queue;
    if (u === null) throw Error(r(311));
    u.lastRenderedReducer = i;
    var v = u.dispatch, m = u.pending, g = a.memoizedState;
    if (m !== null) {
      u.pending = null;
      var P = m = m.next;
      do
        g = i(g, P.action), P = P.next;
      while (P !== m);
      Er(g, a.memoizedState) || (Ht = !0), a.memoizedState = g, a.baseQueue === null && (a.baseState = g), u.lastRenderedState = g;
    }
    return [g, v];
  }
  function Ty() {
  }
  function Ny(i, a) {
    var u = Ge, v = fr(), m = a(), g = !Er(v.memoizedState, m);
    if (g && (v.memoizedState = m, Ht = !0), v = v.queue, od($y.bind(null, u, v, i), [i]), v.getSnapshot !== a || g || dt !== null && dt.memoizedState.tag & 1) {
      if (u.flags |= 2048, jo(9, Dy.bind(null, u, v, m, a), void 0, null), vt === null) throw Error(r(349));
      (vi & 30) !== 0 || My(u, a, m);
    }
    return m;
  }
  function My(i, a, u) {
    i.flags |= 16384, i = { getSnapshot: a, value: u }, a = Ge.updateQueue, a === null ? (a = { lastEffect: null, stores: null }, Ge.updateQueue = a, a.stores = [i]) : (u = a.stores, u === null ? a.stores = [i] : u.push(i));
  }
  function Dy(i, a, u, v) {
    a.value = u, a.getSnapshot = v, Ly(a) && Ry(i);
  }
  function $y(i, a, u) {
    return u(function() {
      Ly(a) && Ry(i);
    });
  }
  function Ly(i) {
    var a = i.getSnapshot;
    i = i.value;
    try {
      var u = a();
      return !Er(i, u);
    } catch {
      return !0;
    }
  }
  function Ry(i) {
    var a = un(i, 1);
    a !== null && Ir(a, i, 1, -1);
  }
  function zy(i) {
    var a = Wr();
    return typeof i == "function" && (i = i()), a.memoizedState = a.baseState = i, i = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Io, lastRenderedState: i }, a.queue = i, i = i.dispatch = Zk.bind(null, Ge, i), [a.memoizedState, i];
  }
  function jo(i, a, u, v) {
    return i = { tag: i, create: a, destroy: u, deps: v, next: null }, a = Ge.updateQueue, a === null ? (a = { lastEffect: null, stores: null }, Ge.updateQueue = a, a.lastEffect = i.next = i) : (u = a.lastEffect, u === null ? a.lastEffect = i.next = i : (v = u.next, u.next = i, i.next = v, a.lastEffect = i)), i;
  }
  function By() {
    return fr().memoizedState;
  }
  function xu(i, a, u, v) {
    var m = Wr();
    Ge.flags |= i, m.memoizedState = jo(1 | a, u, void 0, v === void 0 ? null : v);
  }
  function wu(i, a, u, v) {
    var m = fr();
    v = v === void 0 ? null : v;
    var g = void 0;
    if (at !== null) {
      var P = at.memoizedState;
      if (g = P.destroy, v !== null && td(v, P.deps)) {
        m.memoizedState = jo(a, u, g, v);
        return;
      }
    }
    Ge.flags |= i, m.memoizedState = jo(1 | a, u, g, v);
  }
  function Fy(i, a) {
    return xu(8390656, 8, i, a);
  }
  function od(i, a) {
    return wu(2048, 8, i, a);
  }
  function Wy(i, a) {
    return wu(4, 2, i, a);
  }
  function Uy(i, a) {
    return wu(4, 4, i, a);
  }
  function Hy(i, a) {
    if (typeof a == "function") return i = i(), a(i), function() {
      a(null);
    };
    if (a != null) return i = i(), a.current = i, function() {
      a.current = null;
    };
  }
  function Ky(i, a, u) {
    return u = u != null ? u.concat([i]) : null, wu(4, 4, Hy.bind(null, a, i), u);
  }
  function ld() {
  }
  function Vy(i, a) {
    var u = fr();
    a = a === void 0 ? null : a;
    var v = u.memoizedState;
    return v !== null && a !== null && td(a, v[1]) ? v[0] : (u.memoizedState = [i, a], i);
  }
  function Yy(i, a) {
    var u = fr();
    a = a === void 0 ? null : a;
    var v = u.memoizedState;
    return v !== null && a !== null && td(a, v[1]) ? v[0] : (i = i(), u.memoizedState = [i, a], i);
  }
  function Gy(i, a, u) {
    return (vi & 21) === 0 ? (i.baseState && (i.baseState = !1, Ht = !0), i.memoizedState = u) : (Er(u, a) || (u = Pm(), Ge.lanes |= u, hi |= u, i.baseState = !0), a);
  }
  function qk(i, a) {
    var u = $e;
    $e = u !== 0 && 4 > u ? u : 4, i(!0);
    var v = ed.transition;
    ed.transition = {};
    try {
      i(!1), a();
    } finally {
      $e = u, ed.transition = v;
    }
  }
  function Xy() {
    return fr().memoizedState;
  }
  function Qk(i, a, u) {
    var v = Kn(i);
    if (u = { lane: v, action: u, hasEagerState: !1, eagerState: null, next: null }, qy(i)) Qy(a, u);
    else if (u = ky(i, a, u, v), u !== null) {
      var m = zt();
      Ir(u, i, v, m), Zy(u, a, v);
    }
  }
  function Zk(i, a, u) {
    var v = Kn(i), m = { lane: v, action: u, hasEagerState: !1, eagerState: null, next: null };
    if (qy(i)) Qy(a, m);
    else {
      var g = i.alternate;
      if (i.lanes === 0 && (g === null || g.lanes === 0) && (g = a.lastRenderedReducer, g !== null)) try {
        var P = a.lastRenderedState, I = g(P, u);
        if (m.hasEagerState = !0, m.eagerState = I, Er(I, P)) {
          var M = a.interleaved;
          M === null ? (m.next = m, Gf(a)) : (m.next = M.next, M.next = m), a.interleaved = m;
          return;
        }
      } catch {
      } finally {
      }
      u = ky(i, a, m, v), u !== null && (m = zt(), Ir(u, i, v, m), Zy(u, a, v));
    }
  }
  function qy(i) {
    var a = i.alternate;
    return i === Ge || a !== null && a === Ge;
  }
  function Qy(i, a) {
    _o = gu = !0;
    var u = i.pending;
    u === null ? a.next = a : (a.next = u.next, u.next = a), i.pending = a;
  }
  function Zy(i, a, u) {
    if ((u & 4194240) !== 0) {
      var v = a.lanes;
      v &= i.pendingLanes, u |= v, a.lanes = u, sf(i, u);
    }
  }
  var bu = { readContext: cr, useCallback: _t, useContext: _t, useEffect: _t, useImperativeHandle: _t, useInsertionEffect: _t, useLayoutEffect: _t, useMemo: _t, useReducer: _t, useRef: _t, useState: _t, useDebugValue: _t, useDeferredValue: _t, useTransition: _t, useMutableSource: _t, useSyncExternalStore: _t, useId: _t, unstable_isNewReconciler: !1 }, Jk = { readContext: cr, useCallback: function(i, a) {
    return Wr().memoizedState = [i, a === void 0 ? null : a], i;
  }, useContext: cr, useEffect: Fy, useImperativeHandle: function(i, a, u) {
    return u = u != null ? u.concat([i]) : null, xu(
      4194308,
      4,
      Hy.bind(null, a, i),
      u
    );
  }, useLayoutEffect: function(i, a) {
    return xu(4194308, 4, i, a);
  }, useInsertionEffect: function(i, a) {
    return xu(4, 2, i, a);
  }, useMemo: function(i, a) {
    var u = Wr();
    return a = a === void 0 ? null : a, i = i(), u.memoizedState = [i, a], i;
  }, useReducer: function(i, a, u) {
    var v = Wr();
    return a = u !== void 0 ? u(a) : a, v.memoizedState = v.baseState = a, i = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: i, lastRenderedState: a }, v.queue = i, i = i.dispatch = Qk.bind(null, Ge, i), [v.memoizedState, i];
  }, useRef: function(i) {
    var a = Wr();
    return i = { current: i }, a.memoizedState = i;
  }, useState: zy, useDebugValue: ld, useDeferredValue: function(i) {
    return Wr().memoizedState = i;
  }, useTransition: function() {
    var i = zy(!1), a = i[0];
    return i = qk.bind(null, i[1]), Wr().memoizedState = i, [a, i];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(i, a, u) {
    var v = Ge, m = Wr();
    if (Ke) {
      if (u === void 0) throw Error(r(407));
      u = u();
    } else {
      if (u = a(), vt === null) throw Error(r(349));
      (vi & 30) !== 0 || My(v, a, u);
    }
    m.memoizedState = u;
    var g = { value: u, getSnapshot: a };
    return m.queue = g, Fy($y.bind(
      null,
      v,
      g,
      i
    ), [i]), v.flags |= 2048, jo(9, Dy.bind(null, v, g, u, a), void 0, null), u;
  }, useId: function() {
    var i = Wr(), a = vt.identifierPrefix;
    if (Ke) {
      var u = ln, v = on;
      u = (v & ~(1 << 32 - Pr(v) - 1)).toString(32) + u, a = ":" + a + "R" + u, u = Co++, 0 < u && (a += "H" + u.toString(32)), a += ":";
    } else u = Xk++, a = ":" + a + "r" + u.toString(32) + ":";
    return i.memoizedState = a;
  }, unstable_isNewReconciler: !1 }, e_ = {
    readContext: cr,
    useCallback: Vy,
    useContext: cr,
    useEffect: od,
    useImperativeHandle: Ky,
    useInsertionEffect: Wy,
    useLayoutEffect: Uy,
    useMemo: Yy,
    useReducer: id,
    useRef: By,
    useState: function() {
      return id(Io);
    },
    useDebugValue: ld,
    useDeferredValue: function(i) {
      var a = fr();
      return Gy(a, at.memoizedState, i);
    },
    useTransition: function() {
      var i = id(Io)[0], a = fr().memoizedState;
      return [i, a];
    },
    useMutableSource: Ty,
    useSyncExternalStore: Ny,
    useId: Xy,
    unstable_isNewReconciler: !1
  }, t_ = { readContext: cr, useCallback: Vy, useContext: cr, useEffect: od, useImperativeHandle: Ky, useInsertionEffect: Wy, useLayoutEffect: Uy, useMemo: Yy, useReducer: ad, useRef: By, useState: function() {
    return ad(Io);
  }, useDebugValue: ld, useDeferredValue: function(i) {
    var a = fr();
    return at === null ? a.memoizedState = i : Gy(a, at.memoizedState, i);
  }, useTransition: function() {
    var i = ad(Io)[0], a = fr().memoizedState;
    return [i, a];
  }, useMutableSource: Ty, useSyncExternalStore: Ny, useId: Xy, unstable_isNewReconciler: !1 };
  function kr(i, a) {
    if (i && i.defaultProps) {
      a = Y({}, a), i = i.defaultProps;
      for (var u in i) a[u] === void 0 && (a[u] = i[u]);
      return a;
    }
    return a;
  }
  function ud(i, a, u, v) {
    a = i.memoizedState, u = u(v, a), u = u == null ? a : Y({}, a, u), i.memoizedState = u, i.lanes === 0 && (i.updateQueue.baseState = u);
  }
  var Su = { isMounted: function(i) {
    return (i = i._reactInternals) ? oi(i) === i : !1;
  }, enqueueSetState: function(i, a, u) {
    i = i._reactInternals;
    var v = zt(), m = Kn(i), g = sn(v, m);
    g.payload = a, u != null && (g.callback = u), a = Fn(i, g, m), a !== null && (Ir(a, i, m, v), hu(a, i, m));
  }, enqueueReplaceState: function(i, a, u) {
    i = i._reactInternals;
    var v = zt(), m = Kn(i), g = sn(v, m);
    g.tag = 1, g.payload = a, u != null && (g.callback = u), a = Fn(i, g, m), a !== null && (Ir(a, i, m, v), hu(a, i, m));
  }, enqueueForceUpdate: function(i, a) {
    i = i._reactInternals;
    var u = zt(), v = Kn(i), m = sn(u, v);
    m.tag = 2, a != null && (m.callback = a), a = Fn(i, m, v), a !== null && (Ir(a, i, v, u), hu(a, i, v));
  } };
  function Jy(i, a, u, v, m, g, P) {
    return i = i.stateNode, typeof i.shouldComponentUpdate == "function" ? i.shouldComponentUpdate(v, g, P) : a.prototype && a.prototype.isPureReactComponent ? !yo(u, v) || !yo(m, g) : !0;
  }
  function eg(i, a, u) {
    var v = !1, m = Rn, g = a.contextType;
    return typeof g == "object" && g !== null ? g = cr(g) : (m = Ut(a) ? ui : kt.current, v = a.contextTypes, g = (v = v != null) ? ia(i, m) : Rn), a = new a(u, g), i.memoizedState = a.state !== null && a.state !== void 0 ? a.state : null, a.updater = Su, i.stateNode = a, a._reactInternals = i, v && (i = i.stateNode, i.__reactInternalMemoizedUnmaskedChildContext = m, i.__reactInternalMemoizedMaskedChildContext = g), a;
  }
  function tg(i, a, u, v) {
    i = a.state, typeof a.componentWillReceiveProps == "function" && a.componentWillReceiveProps(u, v), typeof a.UNSAFE_componentWillReceiveProps == "function" && a.UNSAFE_componentWillReceiveProps(u, v), a.state !== i && Su.enqueueReplaceState(a, a.state, null);
  }
  function sd(i, a, u, v) {
    var m = i.stateNode;
    m.props = u, m.state = i.memoizedState, m.refs = {}, Xf(i);
    var g = a.contextType;
    typeof g == "object" && g !== null ? m.context = cr(g) : (g = Ut(a) ? ui : kt.current, m.context = ia(i, g)), m.state = i.memoizedState, g = a.getDerivedStateFromProps, typeof g == "function" && (ud(i, a, g, u), m.state = i.memoizedState), typeof a.getDerivedStateFromProps == "function" || typeof m.getSnapshotBeforeUpdate == "function" || typeof m.UNSAFE_componentWillMount != "function" && typeof m.componentWillMount != "function" || (a = m.state, typeof m.componentWillMount == "function" && m.componentWillMount(), typeof m.UNSAFE_componentWillMount == "function" && m.UNSAFE_componentWillMount(), a !== m.state && Su.enqueueReplaceState(m, m.state, null), pu(i, u, m, v), m.state = i.memoizedState), typeof m.componentDidMount == "function" && (i.flags |= 4194308);
  }
  function da(i, a) {
    try {
      var u = "", v = a;
      do
        u += Ae(v), v = v.return;
      while (v);
      var m = u;
    } catch (g) {
      m = `
Error generating stack: ` + g.message + `
` + g.stack;
    }
    return { value: i, source: a, stack: m, digest: null };
  }
  function cd(i, a, u) {
    return { value: i, source: null, stack: u ?? null, digest: a ?? null };
  }
  function fd(i, a) {
    try {
      console.error(a.value);
    } catch (u) {
      setTimeout(function() {
        throw u;
      });
    }
  }
  var r_ = typeof WeakMap == "function" ? WeakMap : Map;
  function rg(i, a, u) {
    u = sn(-1, u), u.tag = 3, u.payload = { element: null };
    var v = a.value;
    return u.callback = function() {
      Cu || (Cu = !0, Od = v), fd(i, a);
    }, u;
  }
  function ng(i, a, u) {
    u = sn(-1, u), u.tag = 3;
    var v = i.type.getDerivedStateFromError;
    if (typeof v == "function") {
      var m = a.value;
      u.payload = function() {
        return v(m);
      }, u.callback = function() {
        fd(i, a);
      };
    }
    var g = i.stateNode;
    return g !== null && typeof g.componentDidCatch == "function" && (u.callback = function() {
      fd(i, a), typeof v != "function" && (Un === null ? Un = /* @__PURE__ */ new Set([this]) : Un.add(this));
      var P = a.stack;
      this.componentDidCatch(a.value, { componentStack: P !== null ? P : "" });
    }), u;
  }
  function ig(i, a, u) {
    var v = i.pingCache;
    if (v === null) {
      v = i.pingCache = new r_();
      var m = /* @__PURE__ */ new Set();
      v.set(a, m);
    } else m = v.get(a), m === void 0 && (m = /* @__PURE__ */ new Set(), v.set(a, m));
    m.has(u) || (m.add(u), i = m_.bind(null, i, a, u), a.then(i, i));
  }
  function ag(i) {
    do {
      var a;
      if ((a = i.tag === 13) && (a = i.memoizedState, a = a !== null ? a.dehydrated !== null : !0), a) return i;
      i = i.return;
    } while (i !== null);
    return null;
  }
  function og(i, a, u, v, m) {
    return (i.mode & 1) === 0 ? (i === a ? i.flags |= 65536 : (i.flags |= 128, u.flags |= 131072, u.flags &= -52805, u.tag === 1 && (u.alternate === null ? u.tag = 17 : (a = sn(-1, 1), a.tag = 2, Fn(u, a, 1))), u.lanes |= 1), i) : (i.flags |= 65536, i.lanes = m, i);
  }
  var n_ = j.ReactCurrentOwner, Ht = !1;
  function Rt(i, a, u, v) {
    a.child = i === null ? Oy(a, null, u, v) : ua(a, i.child, u, v);
  }
  function lg(i, a, u, v, m) {
    u = u.render;
    var g = a.ref;
    return ca(a, m), v = rd(i, a, u, v, g, m), u = nd(), i !== null && !Ht ? (a.updateQueue = i.updateQueue, a.flags &= -2053, i.lanes &= ~m, cn(i, a, m)) : (Ke && u && zf(a), a.flags |= 1, Rt(i, a, v, m), a.child);
  }
  function ug(i, a, u, v, m) {
    if (i === null) {
      var g = u.type;
      return typeof g == "function" && !Nd(g) && g.defaultProps === void 0 && u.compare === null && u.defaultProps === void 0 ? (a.tag = 15, a.type = g, sg(i, a, g, v, m)) : (i = Du(u.type, null, v, a, a.mode, m), i.ref = a.ref, i.return = a, a.child = i);
    }
    if (g = i.child, (i.lanes & m) === 0) {
      var P = g.memoizedProps;
      if (u = u.compare, u = u !== null ? u : yo, u(P, v) && i.ref === a.ref) return cn(i, a, m);
    }
    return a.flags |= 1, i = Yn(g, v), i.ref = a.ref, i.return = a, a.child = i;
  }
  function sg(i, a, u, v, m) {
    if (i !== null) {
      var g = i.memoizedProps;
      if (yo(g, v) && i.ref === a.ref) if (Ht = !1, a.pendingProps = v = g, (i.lanes & m) !== 0) (i.flags & 131072) !== 0 && (Ht = !0);
      else return a.lanes = i.lanes, cn(i, a, m);
    }
    return dd(i, a, u, v, m);
  }
  function cg(i, a, u) {
    var v = a.pendingProps, m = v.children, g = i !== null ? i.memoizedState : null;
    if (v.mode === "hidden") if ((a.mode & 1) === 0) a.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, Re(ha, er), er |= u;
    else {
      if ((u & 1073741824) === 0) return i = g !== null ? g.baseLanes | u : u, a.lanes = a.childLanes = 1073741824, a.memoizedState = { baseLanes: i, cachePool: null, transitions: null }, a.updateQueue = null, Re(ha, er), er |= i, null;
      a.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, v = g !== null ? g.baseLanes : u, Re(ha, er), er |= v;
    }
    else g !== null ? (v = g.baseLanes | u, a.memoizedState = null) : v = u, Re(ha, er), er |= v;
    return Rt(i, a, m, u), a.child;
  }
  function fg(i, a) {
    var u = a.ref;
    (i === null && u !== null || i !== null && i.ref !== u) && (a.flags |= 512, a.flags |= 2097152);
  }
  function dd(i, a, u, v, m) {
    var g = Ut(u) ? ui : kt.current;
    return g = ia(a, g), ca(a, m), u = rd(i, a, u, v, g, m), v = nd(), i !== null && !Ht ? (a.updateQueue = i.updateQueue, a.flags &= -2053, i.lanes &= ~m, cn(i, a, m)) : (Ke && v && zf(a), a.flags |= 1, Rt(i, a, u, m), a.child);
  }
  function dg(i, a, u, v, m) {
    if (Ut(u)) {
      var g = !0;
      ou(a);
    } else g = !1;
    if (ca(a, m), a.stateNode === null) Pu(i, a), eg(a, u, v), sd(a, u, v, m), v = !0;
    else if (i === null) {
      var P = a.stateNode, I = a.memoizedProps;
      P.props = I;
      var M = P.context, B = u.contextType;
      typeof B == "object" && B !== null ? B = cr(B) : (B = Ut(u) ? ui : kt.current, B = ia(a, B));
      var X = u.getDerivedStateFromProps, Q = typeof X == "function" || typeof P.getSnapshotBeforeUpdate == "function";
      Q || typeof P.UNSAFE_componentWillReceiveProps != "function" && typeof P.componentWillReceiveProps != "function" || (I !== v || M !== B) && tg(a, P, v, B), Bn = !1;
      var G = a.memoizedState;
      P.state = G, pu(a, v, P, m), M = a.memoizedState, I !== v || G !== M || Wt.current || Bn ? (typeof X == "function" && (ud(a, u, X, v), M = a.memoizedState), (I = Bn || Jy(a, u, I, v, G, M, B)) ? (Q || typeof P.UNSAFE_componentWillMount != "function" && typeof P.componentWillMount != "function" || (typeof P.componentWillMount == "function" && P.componentWillMount(), typeof P.UNSAFE_componentWillMount == "function" && P.UNSAFE_componentWillMount()), typeof P.componentDidMount == "function" && (a.flags |= 4194308)) : (typeof P.componentDidMount == "function" && (a.flags |= 4194308), a.memoizedProps = v, a.memoizedState = M), P.props = v, P.state = M, P.context = B, v = I) : (typeof P.componentDidMount == "function" && (a.flags |= 4194308), v = !1);
    } else {
      P = a.stateNode, _y(i, a), I = a.memoizedProps, B = a.type === a.elementType ? I : kr(a.type, I), P.props = B, Q = a.pendingProps, G = P.context, M = u.contextType, typeof M == "object" && M !== null ? M = cr(M) : (M = Ut(u) ? ui : kt.current, M = ia(a, M));
      var ne = u.getDerivedStateFromProps;
      (X = typeof ne == "function" || typeof P.getSnapshotBeforeUpdate == "function") || typeof P.UNSAFE_componentWillReceiveProps != "function" && typeof P.componentWillReceiveProps != "function" || (I !== Q || G !== M) && tg(a, P, v, M), Bn = !1, G = a.memoizedState, P.state = G, pu(a, v, P, m);
      var se = a.memoizedState;
      I !== Q || G !== se || Wt.current || Bn ? (typeof ne == "function" && (ud(a, u, ne, v), se = a.memoizedState), (B = Bn || Jy(a, u, B, v, G, se, M) || !1) ? (X || typeof P.UNSAFE_componentWillUpdate != "function" && typeof P.componentWillUpdate != "function" || (typeof P.componentWillUpdate == "function" && P.componentWillUpdate(v, se, M), typeof P.UNSAFE_componentWillUpdate == "function" && P.UNSAFE_componentWillUpdate(v, se, M)), typeof P.componentDidUpdate == "function" && (a.flags |= 4), typeof P.getSnapshotBeforeUpdate == "function" && (a.flags |= 1024)) : (typeof P.componentDidUpdate != "function" || I === i.memoizedProps && G === i.memoizedState || (a.flags |= 4), typeof P.getSnapshotBeforeUpdate != "function" || I === i.memoizedProps && G === i.memoizedState || (a.flags |= 1024), a.memoizedProps = v, a.memoizedState = se), P.props = v, P.state = se, P.context = M, v = B) : (typeof P.componentDidUpdate != "function" || I === i.memoizedProps && G === i.memoizedState || (a.flags |= 4), typeof P.getSnapshotBeforeUpdate != "function" || I === i.memoizedProps && G === i.memoizedState || (a.flags |= 1024), v = !1);
    }
    return vd(i, a, u, v, g, m);
  }
  function vd(i, a, u, v, m, g) {
    fg(i, a);
    var P = (a.flags & 128) !== 0;
    if (!v && !P) return m && yy(a, u, !1), cn(i, a, g);
    v = a.stateNode, n_.current = a;
    var I = P && typeof u.getDerivedStateFromError != "function" ? null : v.render();
    return a.flags |= 1, i !== null && P ? (a.child = ua(a, i.child, null, g), a.child = ua(a, null, I, g)) : Rt(i, a, I, g), a.memoizedState = v.state, m && yy(a, u, !0), a.child;
  }
  function vg(i) {
    var a = i.stateNode;
    a.pendingContext ? py(i, a.pendingContext, a.pendingContext !== a.context) : a.context && py(i, a.context, !1), qf(i, a.containerInfo);
  }
  function hg(i, a, u, v, m) {
    return la(), Uf(m), a.flags |= 256, Rt(i, a, u, v), a.child;
  }
  var hd = { dehydrated: null, treeContext: null, retryLane: 0 };
  function pd(i) {
    return { baseLanes: i, cachePool: null, transitions: null };
  }
  function pg(i, a, u) {
    var v = a.pendingProps, m = Ye.current, g = !1, P = (a.flags & 128) !== 0, I;
    if ((I = P) || (I = i !== null && i.memoizedState === null ? !1 : (m & 2) !== 0), I ? (g = !0, a.flags &= -129) : (i === null || i.memoizedState !== null) && (m |= 1), Re(Ye, m & 1), i === null)
      return Wf(a), i = a.memoizedState, i !== null && (i = i.dehydrated, i !== null) ? ((a.mode & 1) === 0 ? a.lanes = 1 : i.data === "$!" ? a.lanes = 8 : a.lanes = 1073741824, null) : (P = v.children, i = v.fallback, g ? (v = a.mode, g = a.child, P = { mode: "hidden", children: P }, (v & 1) === 0 && g !== null ? (g.childLanes = 0, g.pendingProps = P) : g = $u(P, v, 0, null), i = gi(i, v, u, null), g.return = a, i.return = a, g.sibling = i, a.child = g, a.child.memoizedState = pd(u), a.memoizedState = hd, i) : md(a, P));
    if (m = i.memoizedState, m !== null && (I = m.dehydrated, I !== null)) return i_(i, a, P, v, I, m, u);
    if (g) {
      g = v.fallback, P = a.mode, m = i.child, I = m.sibling;
      var M = { mode: "hidden", children: v.children };
      return (P & 1) === 0 && a.child !== m ? (v = a.child, v.childLanes = 0, v.pendingProps = M, a.deletions = null) : (v = Yn(m, M), v.subtreeFlags = m.subtreeFlags & 14680064), I !== null ? g = Yn(I, g) : (g = gi(g, P, u, null), g.flags |= 2), g.return = a, v.return = a, v.sibling = g, a.child = v, v = g, g = a.child, P = i.child.memoizedState, P = P === null ? pd(u) : { baseLanes: P.baseLanes | u, cachePool: null, transitions: P.transitions }, g.memoizedState = P, g.childLanes = i.childLanes & ~u, a.memoizedState = hd, v;
    }
    return g = i.child, i = g.sibling, v = Yn(g, { mode: "visible", children: v.children }), (a.mode & 1) === 0 && (v.lanes = u), v.return = a, v.sibling = null, i !== null && (u = a.deletions, u === null ? (a.deletions = [i], a.flags |= 16) : u.push(i)), a.child = v, a.memoizedState = null, v;
  }
  function md(i, a) {
    return a = $u({ mode: "visible", children: a }, i.mode, 0, null), a.return = i, i.child = a;
  }
  function Au(i, a, u, v) {
    return v !== null && Uf(v), ua(a, i.child, null, u), i = md(a, a.pendingProps.children), i.flags |= 2, a.memoizedState = null, i;
  }
  function i_(i, a, u, v, m, g, P) {
    if (u)
      return a.flags & 256 ? (a.flags &= -257, v = cd(Error(r(422))), Au(i, a, P, v)) : a.memoizedState !== null ? (a.child = i.child, a.flags |= 128, null) : (g = v.fallback, m = a.mode, v = $u({ mode: "visible", children: v.children }, m, 0, null), g = gi(g, m, P, null), g.flags |= 2, v.return = a, g.return = a, v.sibling = g, a.child = v, (a.mode & 1) !== 0 && ua(a, i.child, null, P), a.child.memoizedState = pd(P), a.memoizedState = hd, g);
    if ((a.mode & 1) === 0) return Au(i, a, P, null);
    if (m.data === "$!") {
      if (v = m.nextSibling && m.nextSibling.dataset, v) var I = v.dgst;
      return v = I, g = Error(r(419)), v = cd(g, v, void 0), Au(i, a, P, v);
    }
    if (I = (P & i.childLanes) !== 0, Ht || I) {
      if (v = vt, v !== null) {
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
        m = (m & (v.suspendedLanes | P)) !== 0 ? 0 : m, m !== 0 && m !== g.retryLane && (g.retryLane = m, un(i, m), Ir(v, i, m, -1));
      }
      return Td(), v = cd(Error(r(421))), Au(i, a, P, v);
    }
    return m.data === "$?" ? (a.flags |= 128, a.child = i.child, a = y_.bind(null, i), m._reactRetry = a, null) : (i = g.treeContext, Jt = $n(m.nextSibling), Zt = a, Ke = !0, Or = null, i !== null && (ur[sr++] = on, ur[sr++] = ln, ur[sr++] = si, on = i.id, ln = i.overflow, si = a), a = md(a, v.children), a.flags |= 4096, a);
  }
  function mg(i, a, u) {
    i.lanes |= a;
    var v = i.alternate;
    v !== null && (v.lanes |= a), Yf(i.return, a, u);
  }
  function yd(i, a, u, v, m) {
    var g = i.memoizedState;
    g === null ? i.memoizedState = { isBackwards: a, rendering: null, renderingStartTime: 0, last: v, tail: u, tailMode: m } : (g.isBackwards = a, g.rendering = null, g.renderingStartTime = 0, g.last = v, g.tail = u, g.tailMode = m);
  }
  function yg(i, a, u) {
    var v = a.pendingProps, m = v.revealOrder, g = v.tail;
    if (Rt(i, a, v.children, u), v = Ye.current, (v & 2) !== 0) v = v & 1 | 2, a.flags |= 128;
    else {
      if (i !== null && (i.flags & 128) !== 0) e: for (i = a.child; i !== null; ) {
        if (i.tag === 13) i.memoizedState !== null && mg(i, u, a);
        else if (i.tag === 19) mg(i, u, a);
        else if (i.child !== null) {
          i.child.return = i, i = i.child;
          continue;
        }
        if (i === a) break e;
        for (; i.sibling === null; ) {
          if (i.return === null || i.return === a) break e;
          i = i.return;
        }
        i.sibling.return = i.return, i = i.sibling;
      }
      v &= 1;
    }
    if (Re(Ye, v), (a.mode & 1) === 0) a.memoizedState = null;
    else switch (m) {
      case "forwards":
        for (u = a.child, m = null; u !== null; ) i = u.alternate, i !== null && mu(i) === null && (m = u), u = u.sibling;
        u = m, u === null ? (m = a.child, a.child = null) : (m = u.sibling, u.sibling = null), yd(a, !1, m, u, g);
        break;
      case "backwards":
        for (u = null, m = a.child, a.child = null; m !== null; ) {
          if (i = m.alternate, i !== null && mu(i) === null) {
            a.child = m;
            break;
          }
          i = m.sibling, m.sibling = u, u = m, m = i;
        }
        yd(a, !0, u, null, g);
        break;
      case "together":
        yd(a, !1, null, null, void 0);
        break;
      default:
        a.memoizedState = null;
    }
    return a.child;
  }
  function Pu(i, a) {
    (a.mode & 1) === 0 && i !== null && (i.alternate = null, a.alternate = null, a.flags |= 2);
  }
  function cn(i, a, u) {
    if (i !== null && (a.dependencies = i.dependencies), hi |= a.lanes, (u & a.childLanes) === 0) return null;
    if (i !== null && a.child !== i.child) throw Error(r(153));
    if (a.child !== null) {
      for (i = a.child, u = Yn(i, i.pendingProps), a.child = u, u.return = a; i.sibling !== null; ) i = i.sibling, u = u.sibling = Yn(i, i.pendingProps), u.return = a;
      u.sibling = null;
    }
    return a.child;
  }
  function a_(i, a, u) {
    switch (a.tag) {
      case 3:
        vg(a), la();
        break;
      case 5:
        jy(a);
        break;
      case 1:
        Ut(a.type) && ou(a);
        break;
      case 4:
        qf(a, a.stateNode.containerInfo);
        break;
      case 10:
        var v = a.type._context, m = a.memoizedProps.value;
        Re(du, v._currentValue), v._currentValue = m;
        break;
      case 13:
        if (v = a.memoizedState, v !== null)
          return v.dehydrated !== null ? (Re(Ye, Ye.current & 1), a.flags |= 128, null) : (u & a.child.childLanes) !== 0 ? pg(i, a, u) : (Re(Ye, Ye.current & 1), i = cn(i, a, u), i !== null ? i.sibling : null);
        Re(Ye, Ye.current & 1);
        break;
      case 19:
        if (v = (u & a.childLanes) !== 0, (i.flags & 128) !== 0) {
          if (v) return yg(i, a, u);
          a.flags |= 128;
        }
        if (m = a.memoizedState, m !== null && (m.rendering = null, m.tail = null, m.lastEffect = null), Re(Ye, Ye.current), v) break;
        return null;
      case 22:
      case 23:
        return a.lanes = 0, cg(i, a, u);
    }
    return cn(i, a, u);
  }
  var gg, gd, xg, wg;
  gg = function(i, a) {
    for (var u = a.child; u !== null; ) {
      if (u.tag === 5 || u.tag === 6) i.appendChild(u.stateNode);
      else if (u.tag !== 4 && u.child !== null) {
        u.child.return = u, u = u.child;
        continue;
      }
      if (u === a) break;
      for (; u.sibling === null; ) {
        if (u.return === null || u.return === a) return;
        u = u.return;
      }
      u.sibling.return = u.return, u = u.sibling;
    }
  }, gd = function() {
  }, xg = function(i, a, u, v) {
    var m = i.memoizedProps;
    if (m !== v) {
      i = a.stateNode, di(Fr.current);
      var g = null;
      switch (u) {
        case "input":
          m = je(i, m), v = je(i, v), g = [];
          break;
        case "select":
          m = Y({}, m, { value: void 0 }), v = Y({}, v, { value: void 0 }), g = [];
          break;
        case "textarea":
          m = Xc(i, m), v = Xc(i, v), g = [];
          break;
        default:
          typeof m.onClick != "function" && typeof v.onClick == "function" && (i.onclick = nu);
      }
      Qc(u, v);
      var P;
      u = null;
      for (B in m) if (!v.hasOwnProperty(B) && m.hasOwnProperty(B) && m[B] != null) if (B === "style") {
        var I = m[B];
        for (P in I) I.hasOwnProperty(P) && (u || (u = {}), u[P] = "");
      } else B !== "dangerouslySetInnerHTML" && B !== "children" && B !== "suppressContentEditableWarning" && B !== "suppressHydrationWarning" && B !== "autoFocus" && (o.hasOwnProperty(B) ? g || (g = []) : (g = g || []).push(B, null));
      for (B in v) {
        var M = v[B];
        if (I = m != null ? m[B] : void 0, v.hasOwnProperty(B) && M !== I && (M != null || I != null)) if (B === "style") if (I) {
          for (P in I) !I.hasOwnProperty(P) || M && M.hasOwnProperty(P) || (u || (u = {}), u[P] = "");
          for (P in M) M.hasOwnProperty(P) && I[P] !== M[P] && (u || (u = {}), u[P] = M[P]);
        } else u || (g || (g = []), g.push(
          B,
          u
        )), u = M;
        else B === "dangerouslySetInnerHTML" ? (M = M ? M.__html : void 0, I = I ? I.__html : void 0, M != null && I !== M && (g = g || []).push(B, M)) : B === "children" ? typeof M != "string" && typeof M != "number" || (g = g || []).push(B, "" + M) : B !== "suppressContentEditableWarning" && B !== "suppressHydrationWarning" && (o.hasOwnProperty(B) ? (M != null && B === "onScroll" && Fe("scroll", i), g || I === M || (g = [])) : (g = g || []).push(B, M));
      }
      u && (g = g || []).push("style", u);
      var B = g;
      (a.updateQueue = B) && (a.flags |= 4);
    }
  }, wg = function(i, a, u, v) {
    u !== v && (a.flags |= 4);
  };
  function To(i, a) {
    if (!Ke) switch (i.tailMode) {
      case "hidden":
        a = i.tail;
        for (var u = null; a !== null; ) a.alternate !== null && (u = a), a = a.sibling;
        u === null ? i.tail = null : u.sibling = null;
        break;
      case "collapsed":
        u = i.tail;
        for (var v = null; u !== null; ) u.alternate !== null && (v = u), u = u.sibling;
        v === null ? a || i.tail === null ? i.tail = null : i.tail.sibling = null : v.sibling = null;
    }
  }
  function Ct(i) {
    var a = i.alternate !== null && i.alternate.child === i.child, u = 0, v = 0;
    if (a) for (var m = i.child; m !== null; ) u |= m.lanes | m.childLanes, v |= m.subtreeFlags & 14680064, v |= m.flags & 14680064, m.return = i, m = m.sibling;
    else for (m = i.child; m !== null; ) u |= m.lanes | m.childLanes, v |= m.subtreeFlags, v |= m.flags, m.return = i, m = m.sibling;
    return i.subtreeFlags |= v, i.childLanes = u, a;
  }
  function o_(i, a, u) {
    var v = a.pendingProps;
    switch (Bf(a), a.tag) {
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
        return Ct(a), null;
      case 1:
        return Ut(a.type) && au(), Ct(a), null;
      case 3:
        return v = a.stateNode, fa(), We(Wt), We(kt), Jf(), v.pendingContext && (v.context = v.pendingContext, v.pendingContext = null), (i === null || i.child === null) && (cu(a) ? a.flags |= 4 : i === null || i.memoizedState.isDehydrated && (a.flags & 256) === 0 || (a.flags |= 1024, Or !== null && (Cd(Or), Or = null))), gd(i, a), Ct(a), null;
      case 5:
        Qf(a);
        var m = di(ko.current);
        if (u = a.type, i !== null && a.stateNode != null) xg(i, a, u, v, m), i.ref !== a.ref && (a.flags |= 512, a.flags |= 2097152);
        else {
          if (!v) {
            if (a.stateNode === null) throw Error(r(166));
            return Ct(a), null;
          }
          if (i = di(Fr.current), cu(a)) {
            v = a.stateNode, u = a.type;
            var g = a.memoizedProps;
            switch (v[Br] = a, v[So] = g, i = (a.mode & 1) !== 0, u) {
              case "dialog":
                Fe("cancel", v), Fe("close", v);
                break;
              case "iframe":
              case "object":
              case "embed":
                Fe("load", v);
                break;
              case "video":
              case "audio":
                for (m = 0; m < xo.length; m++) Fe(xo[m], v);
                break;
              case "source":
                Fe("error", v);
                break;
              case "img":
              case "image":
              case "link":
                Fe(
                  "error",
                  v
                ), Fe("load", v);
                break;
              case "details":
                Fe("toggle", v);
                break;
              case "input":
                xe(v, g), Fe("invalid", v);
                break;
              case "select":
                v._wrapperState = { wasMultiple: !!g.multiple }, Fe("invalid", v);
                break;
              case "textarea":
                nm(v, g), Fe("invalid", v);
            }
            Qc(u, g), m = null;
            for (var P in g) if (g.hasOwnProperty(P)) {
              var I = g[P];
              P === "children" ? typeof I == "string" ? v.textContent !== I && (g.suppressHydrationWarning !== !0 && ru(v.textContent, I, i), m = ["children", I]) : typeof I == "number" && v.textContent !== "" + I && (g.suppressHydrationWarning !== !0 && ru(
                v.textContent,
                I,
                i
              ), m = ["children", "" + I]) : o.hasOwnProperty(P) && I != null && P === "onScroll" && Fe("scroll", v);
            }
            switch (u) {
              case "input":
                be(v), Qa(v, g, !0);
                break;
              case "textarea":
                be(v), am(v);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof g.onClick == "function" && (v.onclick = nu);
            }
            v = m, a.updateQueue = v, v !== null && (a.flags |= 4);
          } else {
            P = m.nodeType === 9 ? m : m.ownerDocument, i === "http://www.w3.org/1999/xhtml" && (i = om(u)), i === "http://www.w3.org/1999/xhtml" ? u === "script" ? (i = P.createElement("div"), i.innerHTML = "<script><\/script>", i = i.removeChild(i.firstChild)) : typeof v.is == "string" ? i = P.createElement(u, { is: v.is }) : (i = P.createElement(u), u === "select" && (P = i, v.multiple ? P.multiple = !0 : v.size && (P.size = v.size))) : i = P.createElementNS(i, u), i[Br] = a, i[So] = v, gg(i, a, !1, !1), a.stateNode = i;
            e: {
              switch (P = Zc(u, v), u) {
                case "dialog":
                  Fe("cancel", i), Fe("close", i), m = v;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  Fe("load", i), m = v;
                  break;
                case "video":
                case "audio":
                  for (m = 0; m < xo.length; m++) Fe(xo[m], i);
                  m = v;
                  break;
                case "source":
                  Fe("error", i), m = v;
                  break;
                case "img":
                case "image":
                case "link":
                  Fe(
                    "error",
                    i
                  ), Fe("load", i), m = v;
                  break;
                case "details":
                  Fe("toggle", i), m = v;
                  break;
                case "input":
                  xe(i, v), m = je(i, v), Fe("invalid", i);
                  break;
                case "option":
                  m = v;
                  break;
                case "select":
                  i._wrapperState = { wasMultiple: !!v.multiple }, m = Y({}, v, { value: void 0 }), Fe("invalid", i);
                  break;
                case "textarea":
                  nm(i, v), m = Xc(i, v), Fe("invalid", i);
                  break;
                default:
                  m = v;
              }
              Qc(u, m), I = m;
              for (g in I) if (I.hasOwnProperty(g)) {
                var M = I[g];
                g === "style" ? sm(i, M) : g === "dangerouslySetInnerHTML" ? (M = M ? M.__html : void 0, M != null && lm(i, M)) : g === "children" ? typeof M == "string" ? (u !== "textarea" || M !== "") && Ja(i, M) : typeof M == "number" && Ja(i, "" + M) : g !== "suppressContentEditableWarning" && g !== "suppressHydrationWarning" && g !== "autoFocus" && (o.hasOwnProperty(g) ? M != null && g === "onScroll" && Fe("scroll", i) : M != null && C(i, g, M, P));
              }
              switch (u) {
                case "input":
                  be(i), Qa(i, v, !1);
                  break;
                case "textarea":
                  be(i), am(i);
                  break;
                case "option":
                  v.value != null && i.setAttribute("value", "" + _e(v.value));
                  break;
                case "select":
                  i.multiple = !!v.multiple, g = v.value, g != null ? Vi(i, !!v.multiple, g, !1) : v.defaultValue != null && Vi(
                    i,
                    !!v.multiple,
                    v.defaultValue,
                    !0
                  );
                  break;
                default:
                  typeof m.onClick == "function" && (i.onclick = nu);
              }
              switch (u) {
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
            v && (a.flags |= 4);
          }
          a.ref !== null && (a.flags |= 512, a.flags |= 2097152);
        }
        return Ct(a), null;
      case 6:
        if (i && a.stateNode != null) wg(i, a, i.memoizedProps, v);
        else {
          if (typeof v != "string" && a.stateNode === null) throw Error(r(166));
          if (u = di(ko.current), di(Fr.current), cu(a)) {
            if (v = a.stateNode, u = a.memoizedProps, v[Br] = a, (g = v.nodeValue !== u) && (i = Zt, i !== null)) switch (i.tag) {
              case 3:
                ru(v.nodeValue, u, (i.mode & 1) !== 0);
                break;
              case 5:
                i.memoizedProps.suppressHydrationWarning !== !0 && ru(v.nodeValue, u, (i.mode & 1) !== 0);
            }
            g && (a.flags |= 4);
          } else v = (u.nodeType === 9 ? u : u.ownerDocument).createTextNode(v), v[Br] = a, a.stateNode = v;
        }
        return Ct(a), null;
      case 13:
        if (We(Ye), v = a.memoizedState, i === null || i.memoizedState !== null && i.memoizedState.dehydrated !== null) {
          if (Ke && Jt !== null && (a.mode & 1) !== 0 && (a.flags & 128) === 0) Ay(), la(), a.flags |= 98560, g = !1;
          else if (g = cu(a), v !== null && v.dehydrated !== null) {
            if (i === null) {
              if (!g) throw Error(r(318));
              if (g = a.memoizedState, g = g !== null ? g.dehydrated : null, !g) throw Error(r(317));
              g[Br] = a;
            } else la(), (a.flags & 128) === 0 && (a.memoizedState = null), a.flags |= 4;
            Ct(a), g = !1;
          } else Or !== null && (Cd(Or), Or = null), g = !0;
          if (!g) return a.flags & 65536 ? a : null;
        }
        return (a.flags & 128) !== 0 ? (a.lanes = u, a) : (v = v !== null, v !== (i !== null && i.memoizedState !== null) && v && (a.child.flags |= 8192, (a.mode & 1) !== 0 && (i === null || (Ye.current & 1) !== 0 ? ot === 0 && (ot = 3) : Td())), a.updateQueue !== null && (a.flags |= 4), Ct(a), null);
      case 4:
        return fa(), gd(i, a), i === null && wo(a.stateNode.containerInfo), Ct(a), null;
      case 10:
        return Vf(a.type._context), Ct(a), null;
      case 17:
        return Ut(a.type) && au(), Ct(a), null;
      case 19:
        if (We(Ye), g = a.memoizedState, g === null) return Ct(a), null;
        if (v = (a.flags & 128) !== 0, P = g.rendering, P === null) if (v) To(g, !1);
        else {
          if (ot !== 0 || i !== null && (i.flags & 128) !== 0) for (i = a.child; i !== null; ) {
            if (P = mu(i), P !== null) {
              for (a.flags |= 128, To(g, !1), v = P.updateQueue, v !== null && (a.updateQueue = v, a.flags |= 4), a.subtreeFlags = 0, v = u, u = a.child; u !== null; ) g = u, i = v, g.flags &= 14680066, P = g.alternate, P === null ? (g.childLanes = 0, g.lanes = i, g.child = null, g.subtreeFlags = 0, g.memoizedProps = null, g.memoizedState = null, g.updateQueue = null, g.dependencies = null, g.stateNode = null) : (g.childLanes = P.childLanes, g.lanes = P.lanes, g.child = P.child, g.subtreeFlags = 0, g.deletions = null, g.memoizedProps = P.memoizedProps, g.memoizedState = P.memoizedState, g.updateQueue = P.updateQueue, g.type = P.type, i = P.dependencies, g.dependencies = i === null ? null : { lanes: i.lanes, firstContext: i.firstContext }), u = u.sibling;
              return Re(Ye, Ye.current & 1 | 2), a.child;
            }
            i = i.sibling;
          }
          g.tail !== null && Je() > pa && (a.flags |= 128, v = !0, To(g, !1), a.lanes = 4194304);
        }
        else {
          if (!v) if (i = mu(P), i !== null) {
            if (a.flags |= 128, v = !0, u = i.updateQueue, u !== null && (a.updateQueue = u, a.flags |= 4), To(g, !0), g.tail === null && g.tailMode === "hidden" && !P.alternate && !Ke) return Ct(a), null;
          } else 2 * Je() - g.renderingStartTime > pa && u !== 1073741824 && (a.flags |= 128, v = !0, To(g, !1), a.lanes = 4194304);
          g.isBackwards ? (P.sibling = a.child, a.child = P) : (u = g.last, u !== null ? u.sibling = P : a.child = P, g.last = P);
        }
        return g.tail !== null ? (a = g.tail, g.rendering = a, g.tail = a.sibling, g.renderingStartTime = Je(), a.sibling = null, u = Ye.current, Re(Ye, v ? u & 1 | 2 : u & 1), a) : (Ct(a), null);
      case 22:
      case 23:
        return jd(), v = a.memoizedState !== null, i !== null && i.memoizedState !== null !== v && (a.flags |= 8192), v && (a.mode & 1) !== 0 ? (er & 1073741824) !== 0 && (Ct(a), a.subtreeFlags & 6 && (a.flags |= 8192)) : Ct(a), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(r(156, a.tag));
  }
  function l_(i, a) {
    switch (Bf(a), a.tag) {
      case 1:
        return Ut(a.type) && au(), i = a.flags, i & 65536 ? (a.flags = i & -65537 | 128, a) : null;
      case 3:
        return fa(), We(Wt), We(kt), Jf(), i = a.flags, (i & 65536) !== 0 && (i & 128) === 0 ? (a.flags = i & -65537 | 128, a) : null;
      case 5:
        return Qf(a), null;
      case 13:
        if (We(Ye), i = a.memoizedState, i !== null && i.dehydrated !== null) {
          if (a.alternate === null) throw Error(r(340));
          la();
        }
        return i = a.flags, i & 65536 ? (a.flags = i & -65537 | 128, a) : null;
      case 19:
        return We(Ye), null;
      case 4:
        return fa(), null;
      case 10:
        return Vf(a.type._context), null;
      case 22:
      case 23:
        return jd(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var Eu = !1, It = !1, u_ = typeof WeakSet == "function" ? WeakSet : Set, oe = null;
  function va(i, a) {
    var u = i.ref;
    if (u !== null) if (typeof u == "function") try {
      u(null);
    } catch (v) {
      Xe(i, a, v);
    }
    else u.current = null;
  }
  function xd(i, a, u) {
    try {
      u();
    } catch (v) {
      Xe(i, a, v);
    }
  }
  var bg = !1;
  function s_(i, a) {
    if (jf = Kl, i = Jm(), Af(i)) {
      if ("selectionStart" in i) var u = { start: i.selectionStart, end: i.selectionEnd };
      else e: {
        u = (u = i.ownerDocument) && u.defaultView || window;
        var v = u.getSelection && u.getSelection();
        if (v && v.rangeCount !== 0) {
          u = v.anchorNode;
          var m = v.anchorOffset, g = v.focusNode;
          v = v.focusOffset;
          try {
            u.nodeType, g.nodeType;
          } catch {
            u = null;
            break e;
          }
          var P = 0, I = -1, M = -1, B = 0, X = 0, Q = i, G = null;
          t: for (; ; ) {
            for (var ne; Q !== u || m !== 0 && Q.nodeType !== 3 || (I = P + m), Q !== g || v !== 0 && Q.nodeType !== 3 || (M = P + v), Q.nodeType === 3 && (P += Q.nodeValue.length), (ne = Q.firstChild) !== null; )
              G = Q, Q = ne;
            for (; ; ) {
              if (Q === i) break t;
              if (G === u && ++B === m && (I = P), G === g && ++X === v && (M = P), (ne = Q.nextSibling) !== null) break;
              Q = G, G = Q.parentNode;
            }
            Q = ne;
          }
          u = I === -1 || M === -1 ? null : { start: I, end: M };
        } else u = null;
      }
      u = u || { start: 0, end: 0 };
    } else u = null;
    for (Tf = { focusedElem: i, selectionRange: u }, Kl = !1, oe = a; oe !== null; ) if (a = oe, i = a.child, (a.subtreeFlags & 1028) !== 0 && i !== null) i.return = a, oe = i;
    else for (; oe !== null; ) {
      a = oe;
      try {
        var se = a.alternate;
        if ((a.flags & 1024) !== 0) switch (a.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (se !== null) {
              var ce = se.memoizedProps, et = se.memoizedState, L = a.stateNode, D = L.getSnapshotBeforeUpdate(a.elementType === a.type ? ce : kr(a.type, ce), et);
              L.__reactInternalSnapshotBeforeUpdate = D;
            }
            break;
          case 3:
            var R = a.stateNode.containerInfo;
            R.nodeType === 1 ? R.textContent = "" : R.nodeType === 9 && R.documentElement && R.removeChild(R.documentElement);
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
        Xe(a, a.return, ee);
      }
      if (i = a.sibling, i !== null) {
        i.return = a.return, oe = i;
        break;
      }
      oe = a.return;
    }
    return se = bg, bg = !1, se;
  }
  function No(i, a, u) {
    var v = a.updateQueue;
    if (v = v !== null ? v.lastEffect : null, v !== null) {
      var m = v = v.next;
      do {
        if ((m.tag & i) === i) {
          var g = m.destroy;
          m.destroy = void 0, g !== void 0 && xd(a, u, g);
        }
        m = m.next;
      } while (m !== v);
    }
  }
  function Ou(i, a) {
    if (a = a.updateQueue, a = a !== null ? a.lastEffect : null, a !== null) {
      var u = a = a.next;
      do {
        if ((u.tag & i) === i) {
          var v = u.create;
          u.destroy = v();
        }
        u = u.next;
      } while (u !== a);
    }
  }
  function wd(i) {
    var a = i.ref;
    if (a !== null) {
      var u = i.stateNode;
      switch (i.tag) {
        case 5:
          i = u;
          break;
        default:
          i = u;
      }
      typeof a == "function" ? a(i) : a.current = i;
    }
  }
  function Sg(i) {
    var a = i.alternate;
    a !== null && (i.alternate = null, Sg(a)), i.child = null, i.deletions = null, i.sibling = null, i.tag === 5 && (a = i.stateNode, a !== null && (delete a[Br], delete a[So], delete a[$f], delete a[Kk], delete a[Vk])), i.stateNode = null, i.return = null, i.dependencies = null, i.memoizedProps = null, i.memoizedState = null, i.pendingProps = null, i.stateNode = null, i.updateQueue = null;
  }
  function Ag(i) {
    return i.tag === 5 || i.tag === 3 || i.tag === 4;
  }
  function Pg(i) {
    e: for (; ; ) {
      for (; i.sibling === null; ) {
        if (i.return === null || Ag(i.return)) return null;
        i = i.return;
      }
      for (i.sibling.return = i.return, i = i.sibling; i.tag !== 5 && i.tag !== 6 && i.tag !== 18; ) {
        if (i.flags & 2 || i.child === null || i.tag === 4) continue e;
        i.child.return = i, i = i.child;
      }
      if (!(i.flags & 2)) return i.stateNode;
    }
  }
  function bd(i, a, u) {
    var v = i.tag;
    if (v === 5 || v === 6) i = i.stateNode, a ? u.nodeType === 8 ? u.parentNode.insertBefore(i, a) : u.insertBefore(i, a) : (u.nodeType === 8 ? (a = u.parentNode, a.insertBefore(i, u)) : (a = u, a.appendChild(i)), u = u._reactRootContainer, u != null || a.onclick !== null || (a.onclick = nu));
    else if (v !== 4 && (i = i.child, i !== null)) for (bd(i, a, u), i = i.sibling; i !== null; ) bd(i, a, u), i = i.sibling;
  }
  function Sd(i, a, u) {
    var v = i.tag;
    if (v === 5 || v === 6) i = i.stateNode, a ? u.insertBefore(i, a) : u.appendChild(i);
    else if (v !== 4 && (i = i.child, i !== null)) for (Sd(i, a, u), i = i.sibling; i !== null; ) Sd(i, a, u), i = i.sibling;
  }
  var xt = null, _r = !1;
  function Wn(i, a, u) {
    for (u = u.child; u !== null; ) Eg(i, a, u), u = u.sibling;
  }
  function Eg(i, a, u) {
    if (zr && typeof zr.onCommitFiberUnmount == "function") try {
      zr.onCommitFiberUnmount(zl, u);
    } catch {
    }
    switch (u.tag) {
      case 5:
        It || va(u, a);
      case 6:
        var v = xt, m = _r;
        xt = null, Wn(i, a, u), xt = v, _r = m, xt !== null && (_r ? (i = xt, u = u.stateNode, i.nodeType === 8 ? i.parentNode.removeChild(u) : i.removeChild(u)) : xt.removeChild(u.stateNode));
        break;
      case 18:
        xt !== null && (_r ? (i = xt, u = u.stateNode, i.nodeType === 8 ? Df(i.parentNode, u) : i.nodeType === 1 && Df(i, u), co(i)) : Df(xt, u.stateNode));
        break;
      case 4:
        v = xt, m = _r, xt = u.stateNode.containerInfo, _r = !0, Wn(i, a, u), xt = v, _r = m;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!It && (v = u.updateQueue, v !== null && (v = v.lastEffect, v !== null))) {
          m = v = v.next;
          do {
            var g = m, P = g.destroy;
            g = g.tag, P !== void 0 && ((g & 2) !== 0 || (g & 4) !== 0) && xd(u, a, P), m = m.next;
          } while (m !== v);
        }
        Wn(i, a, u);
        break;
      case 1:
        if (!It && (va(u, a), v = u.stateNode, typeof v.componentWillUnmount == "function")) try {
          v.props = u.memoizedProps, v.state = u.memoizedState, v.componentWillUnmount();
        } catch (I) {
          Xe(u, a, I);
        }
        Wn(i, a, u);
        break;
      case 21:
        Wn(i, a, u);
        break;
      case 22:
        u.mode & 1 ? (It = (v = It) || u.memoizedState !== null, Wn(i, a, u), It = v) : Wn(i, a, u);
        break;
      default:
        Wn(i, a, u);
    }
  }
  function Og(i) {
    var a = i.updateQueue;
    if (a !== null) {
      i.updateQueue = null;
      var u = i.stateNode;
      u === null && (u = i.stateNode = new u_()), a.forEach(function(v) {
        var m = g_.bind(null, i, v);
        u.has(v) || (u.add(v), v.then(m, m));
      });
    }
  }
  function Cr(i, a) {
    var u = a.deletions;
    if (u !== null) for (var v = 0; v < u.length; v++) {
      var m = u[v];
      try {
        var g = i, P = a, I = P;
        e: for (; I !== null; ) {
          switch (I.tag) {
            case 5:
              xt = I.stateNode, _r = !1;
              break e;
            case 3:
              xt = I.stateNode.containerInfo, _r = !0;
              break e;
            case 4:
              xt = I.stateNode.containerInfo, _r = !0;
              break e;
          }
          I = I.return;
        }
        if (xt === null) throw Error(r(160));
        Eg(g, P, m), xt = null, _r = !1;
        var M = m.alternate;
        M !== null && (M.return = null), m.return = null;
      } catch (B) {
        Xe(m, a, B);
      }
    }
    if (a.subtreeFlags & 12854) for (a = a.child; a !== null; ) kg(a, i), a = a.sibling;
  }
  function kg(i, a) {
    var u = i.alternate, v = i.flags;
    switch (i.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (Cr(a, i), Ur(i), v & 4) {
          try {
            No(3, i, i.return), Ou(3, i);
          } catch (ce) {
            Xe(i, i.return, ce);
          }
          try {
            No(5, i, i.return);
          } catch (ce) {
            Xe(i, i.return, ce);
          }
        }
        break;
      case 1:
        Cr(a, i), Ur(i), v & 512 && u !== null && va(u, u.return);
        break;
      case 5:
        if (Cr(a, i), Ur(i), v & 512 && u !== null && va(u, u.return), i.flags & 32) {
          var m = i.stateNode;
          try {
            Ja(m, "");
          } catch (ce) {
            Xe(i, i.return, ce);
          }
        }
        if (v & 4 && (m = i.stateNode, m != null)) {
          var g = i.memoizedProps, P = u !== null ? u.memoizedProps : g, I = i.type, M = i.updateQueue;
          if (i.updateQueue = null, M !== null) try {
            I === "input" && g.type === "radio" && g.name != null && Ot(m, g), Zc(I, P);
            var B = Zc(I, g);
            for (P = 0; P < M.length; P += 2) {
              var X = M[P], Q = M[P + 1];
              X === "style" ? sm(m, Q) : X === "dangerouslySetInnerHTML" ? lm(m, Q) : X === "children" ? Ja(m, Q) : C(m, X, Q, B);
            }
            switch (I) {
              case "input":
                Ar(m, g);
                break;
              case "textarea":
                im(m, g);
                break;
              case "select":
                var G = m._wrapperState.wasMultiple;
                m._wrapperState.wasMultiple = !!g.multiple;
                var ne = g.value;
                ne != null ? Vi(m, !!g.multiple, ne, !1) : G !== !!g.multiple && (g.defaultValue != null ? Vi(
                  m,
                  !!g.multiple,
                  g.defaultValue,
                  !0
                ) : Vi(m, !!g.multiple, g.multiple ? [] : "", !1));
            }
            m[So] = g;
          } catch (ce) {
            Xe(i, i.return, ce);
          }
        }
        break;
      case 6:
        if (Cr(a, i), Ur(i), v & 4) {
          if (i.stateNode === null) throw Error(r(162));
          m = i.stateNode, g = i.memoizedProps;
          try {
            m.nodeValue = g;
          } catch (ce) {
            Xe(i, i.return, ce);
          }
        }
        break;
      case 3:
        if (Cr(a, i), Ur(i), v & 4 && u !== null && u.memoizedState.isDehydrated) try {
          co(a.containerInfo);
        } catch (ce) {
          Xe(i, i.return, ce);
        }
        break;
      case 4:
        Cr(a, i), Ur(i);
        break;
      case 13:
        Cr(a, i), Ur(i), m = i.child, m.flags & 8192 && (g = m.memoizedState !== null, m.stateNode.isHidden = g, !g || m.alternate !== null && m.alternate.memoizedState !== null || (Ed = Je())), v & 4 && Og(i);
        break;
      case 22:
        if (X = u !== null && u.memoizedState !== null, i.mode & 1 ? (It = (B = It) || X, Cr(a, i), It = B) : Cr(a, i), Ur(i), v & 8192) {
          if (B = i.memoizedState !== null, (i.stateNode.isHidden = B) && !X && (i.mode & 1) !== 0) for (oe = i, X = i.child; X !== null; ) {
            for (Q = oe = X; oe !== null; ) {
              switch (G = oe, ne = G.child, G.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  No(4, G, G.return);
                  break;
                case 1:
                  va(G, G.return);
                  var se = G.stateNode;
                  if (typeof se.componentWillUnmount == "function") {
                    v = G, u = G.return;
                    try {
                      a = v, se.props = a.memoizedProps, se.state = a.memoizedState, se.componentWillUnmount();
                    } catch (ce) {
                      Xe(v, u, ce);
                    }
                  }
                  break;
                case 5:
                  va(G, G.return);
                  break;
                case 22:
                  if (G.memoizedState !== null) {
                    Ig(Q);
                    continue;
                  }
              }
              ne !== null ? (ne.return = G, oe = ne) : Ig(Q);
            }
            X = X.sibling;
          }
          e: for (X = null, Q = i; ; ) {
            if (Q.tag === 5) {
              if (X === null) {
                X = Q;
                try {
                  m = Q.stateNode, B ? (g = m.style, typeof g.setProperty == "function" ? g.setProperty("display", "none", "important") : g.display = "none") : (I = Q.stateNode, M = Q.memoizedProps.style, P = M != null && M.hasOwnProperty("display") ? M.display : null, I.style.display = um("display", P));
                } catch (ce) {
                  Xe(i, i.return, ce);
                }
              }
            } else if (Q.tag === 6) {
              if (X === null) try {
                Q.stateNode.nodeValue = B ? "" : Q.memoizedProps;
              } catch (ce) {
                Xe(i, i.return, ce);
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
        Cr(a, i), Ur(i), v & 4 && Og(i);
        break;
      case 21:
        break;
      default:
        Cr(
          a,
          i
        ), Ur(i);
    }
  }
  function Ur(i) {
    var a = i.flags;
    if (a & 2) {
      try {
        e: {
          for (var u = i.return; u !== null; ) {
            if (Ag(u)) {
              var v = u;
              break e;
            }
            u = u.return;
          }
          throw Error(r(160));
        }
        switch (v.tag) {
          case 5:
            var m = v.stateNode;
            v.flags & 32 && (Ja(m, ""), v.flags &= -33);
            var g = Pg(i);
            Sd(i, g, m);
            break;
          case 3:
          case 4:
            var P = v.stateNode.containerInfo, I = Pg(i);
            bd(i, I, P);
            break;
          default:
            throw Error(r(161));
        }
      } catch (M) {
        Xe(i, i.return, M);
      }
      i.flags &= -3;
    }
    a & 4096 && (i.flags &= -4097);
  }
  function c_(i, a, u) {
    oe = i, _g(i);
  }
  function _g(i, a, u) {
    for (var v = (i.mode & 1) !== 0; oe !== null; ) {
      var m = oe, g = m.child;
      if (m.tag === 22 && v) {
        var P = m.memoizedState !== null || Eu;
        if (!P) {
          var I = m.alternate, M = I !== null && I.memoizedState !== null || It;
          I = Eu;
          var B = It;
          if (Eu = P, (It = M) && !B) for (oe = m; oe !== null; ) P = oe, M = P.child, P.tag === 22 && P.memoizedState !== null ? jg(m) : M !== null ? (M.return = P, oe = M) : jg(m);
          for (; g !== null; ) oe = g, _g(g), g = g.sibling;
          oe = m, Eu = I, It = B;
        }
        Cg(i);
      } else (m.subtreeFlags & 8772) !== 0 && g !== null ? (g.return = m, oe = g) : Cg(i);
    }
  }
  function Cg(i) {
    for (; oe !== null; ) {
      var a = oe;
      if ((a.flags & 8772) !== 0) {
        var u = a.alternate;
        try {
          if ((a.flags & 8772) !== 0) switch (a.tag) {
            case 0:
            case 11:
            case 15:
              It || Ou(5, a);
              break;
            case 1:
              var v = a.stateNode;
              if (a.flags & 4 && !It) if (u === null) v.componentDidMount();
              else {
                var m = a.elementType === a.type ? u.memoizedProps : kr(a.type, u.memoizedProps);
                v.componentDidUpdate(m, u.memoizedState, v.__reactInternalSnapshotBeforeUpdate);
              }
              var g = a.updateQueue;
              g !== null && Iy(a, g, v);
              break;
            case 3:
              var P = a.updateQueue;
              if (P !== null) {
                if (u = null, a.child !== null) switch (a.child.tag) {
                  case 5:
                    u = a.child.stateNode;
                    break;
                  case 1:
                    u = a.child.stateNode;
                }
                Iy(a, P, u);
              }
              break;
            case 5:
              var I = a.stateNode;
              if (u === null && a.flags & 4) {
                u = I;
                var M = a.memoizedProps;
                switch (a.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    M.autoFocus && u.focus();
                    break;
                  case "img":
                    M.src && (u.src = M.src);
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
              if (a.memoizedState === null) {
                var B = a.alternate;
                if (B !== null) {
                  var X = B.memoizedState;
                  if (X !== null) {
                    var Q = X.dehydrated;
                    Q !== null && co(Q);
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
          It || a.flags & 512 && wd(a);
        } catch (G) {
          Xe(a, a.return, G);
        }
      }
      if (a === i) {
        oe = null;
        break;
      }
      if (u = a.sibling, u !== null) {
        u.return = a.return, oe = u;
        break;
      }
      oe = a.return;
    }
  }
  function Ig(i) {
    for (; oe !== null; ) {
      var a = oe;
      if (a === i) {
        oe = null;
        break;
      }
      var u = a.sibling;
      if (u !== null) {
        u.return = a.return, oe = u;
        break;
      }
      oe = a.return;
    }
  }
  function jg(i) {
    for (; oe !== null; ) {
      var a = oe;
      try {
        switch (a.tag) {
          case 0:
          case 11:
          case 15:
            var u = a.return;
            try {
              Ou(4, a);
            } catch (M) {
              Xe(a, u, M);
            }
            break;
          case 1:
            var v = a.stateNode;
            if (typeof v.componentDidMount == "function") {
              var m = a.return;
              try {
                v.componentDidMount();
              } catch (M) {
                Xe(a, m, M);
              }
            }
            var g = a.return;
            try {
              wd(a);
            } catch (M) {
              Xe(a, g, M);
            }
            break;
          case 5:
            var P = a.return;
            try {
              wd(a);
            } catch (M) {
              Xe(a, P, M);
            }
        }
      } catch (M) {
        Xe(a, a.return, M);
      }
      if (a === i) {
        oe = null;
        break;
      }
      var I = a.sibling;
      if (I !== null) {
        I.return = a.return, oe = I;
        break;
      }
      oe = a.return;
    }
  }
  var f_ = Math.ceil, ku = j.ReactCurrentDispatcher, Ad = j.ReactCurrentOwner, dr = j.ReactCurrentBatchConfig, Ie = 0, vt = null, nt = null, wt = 0, er = 0, ha = Ln(0), ot = 0, Mo = null, hi = 0, _u = 0, Pd = 0, Do = null, Kt = null, Ed = 0, pa = 1 / 0, fn = null, Cu = !1, Od = null, Un = null, Iu = !1, Hn = null, ju = 0, $o = 0, kd = null, Tu = -1, Nu = 0;
  function zt() {
    return (Ie & 6) !== 0 ? Je() : Tu !== -1 ? Tu : Tu = Je();
  }
  function Kn(i) {
    return (i.mode & 1) === 0 ? 1 : (Ie & 2) !== 0 && wt !== 0 ? wt & -wt : Gk.transition !== null ? (Nu === 0 && (Nu = Pm()), Nu) : (i = $e, i !== 0 || (i = window.event, i = i === void 0 ? 16 : Nm(i.type)), i);
  }
  function Ir(i, a, u, v) {
    if (50 < $o) throw $o = 0, kd = null, Error(r(185));
    ao(i, u, v), ((Ie & 2) === 0 || i !== vt) && (i === vt && ((Ie & 2) === 0 && (_u |= u), ot === 4 && Vn(i, wt)), Vt(i, v), u === 1 && Ie === 0 && (a.mode & 1) === 0 && (pa = Je() + 500, lu && zn()));
  }
  function Vt(i, a) {
    var u = i.callbackNode;
    GO(i, a);
    var v = Wl(i, i === vt ? wt : 0);
    if (v === 0) u !== null && bm(u), i.callbackNode = null, i.callbackPriority = 0;
    else if (a = v & -v, i.callbackPriority !== a) {
      if (u != null && bm(u), a === 1) i.tag === 0 ? Yk(Ng.bind(null, i)) : gy(Ng.bind(null, i)), Uk(function() {
        (Ie & 6) === 0 && zn();
      }), u = null;
      else {
        switch (Em(v)) {
          case 1:
            u = of;
            break;
          case 4:
            u = Sm;
            break;
          case 16:
            u = Rl;
            break;
          case 536870912:
            u = Am;
            break;
          default:
            u = Rl;
        }
        u = Fg(u, Tg.bind(null, i));
      }
      i.callbackPriority = a, i.callbackNode = u;
    }
  }
  function Tg(i, a) {
    if (Tu = -1, Nu = 0, (Ie & 6) !== 0) throw Error(r(327));
    var u = i.callbackNode;
    if (ma() && i.callbackNode !== u) return null;
    var v = Wl(i, i === vt ? wt : 0);
    if (v === 0) return null;
    if ((v & 30) !== 0 || (v & i.expiredLanes) !== 0 || a) a = Mu(i, v);
    else {
      a = v;
      var m = Ie;
      Ie |= 2;
      var g = Dg();
      (vt !== i || wt !== a) && (fn = null, pa = Je() + 500, mi(i, a));
      do
        try {
          h_();
          break;
        } catch (I) {
          Mg(i, I);
        }
      while (!0);
      Kf(), ku.current = g, Ie = m, nt !== null ? a = 0 : (vt = null, wt = 0, a = ot);
    }
    if (a !== 0) {
      if (a === 2 && (m = lf(i), m !== 0 && (v = m, a = _d(i, m))), a === 1) throw u = Mo, mi(i, 0), Vn(i, v), Vt(i, Je()), u;
      if (a === 6) Vn(i, v);
      else {
        if (m = i.current.alternate, (v & 30) === 0 && !d_(m) && (a = Mu(i, v), a === 2 && (g = lf(i), g !== 0 && (v = g, a = _d(i, g))), a === 1)) throw u = Mo, mi(i, 0), Vn(i, v), Vt(i, Je()), u;
        switch (i.finishedWork = m, i.finishedLanes = v, a) {
          case 0:
          case 1:
            throw Error(r(345));
          case 2:
            yi(i, Kt, fn);
            break;
          case 3:
            if (Vn(i, v), (v & 130023424) === v && (a = Ed + 500 - Je(), 10 < a)) {
              if (Wl(i, 0) !== 0) break;
              if (m = i.suspendedLanes, (m & v) !== v) {
                zt(), i.pingedLanes |= i.suspendedLanes & m;
                break;
              }
              i.timeoutHandle = Mf(yi.bind(null, i, Kt, fn), a);
              break;
            }
            yi(i, Kt, fn);
            break;
          case 4:
            if (Vn(i, v), (v & 4194240) === v) break;
            for (a = i.eventTimes, m = -1; 0 < v; ) {
              var P = 31 - Pr(v);
              g = 1 << P, P = a[P], P > m && (m = P), v &= ~g;
            }
            if (v = m, v = Je() - v, v = (120 > v ? 120 : 480 > v ? 480 : 1080 > v ? 1080 : 1920 > v ? 1920 : 3e3 > v ? 3e3 : 4320 > v ? 4320 : 1960 * f_(v / 1960)) - v, 10 < v) {
              i.timeoutHandle = Mf(yi.bind(null, i, Kt, fn), v);
              break;
            }
            yi(i, Kt, fn);
            break;
          case 5:
            yi(i, Kt, fn);
            break;
          default:
            throw Error(r(329));
        }
      }
    }
    return Vt(i, Je()), i.callbackNode === u ? Tg.bind(null, i) : null;
  }
  function _d(i, a) {
    var u = Do;
    return i.current.memoizedState.isDehydrated && (mi(i, a).flags |= 256), i = Mu(i, a), i !== 2 && (a = Kt, Kt = u, a !== null && Cd(a)), i;
  }
  function Cd(i) {
    Kt === null ? Kt = i : Kt.push.apply(Kt, i);
  }
  function d_(i) {
    for (var a = i; ; ) {
      if (a.flags & 16384) {
        var u = a.updateQueue;
        if (u !== null && (u = u.stores, u !== null)) for (var v = 0; v < u.length; v++) {
          var m = u[v], g = m.getSnapshot;
          m = m.value;
          try {
            if (!Er(g(), m)) return !1;
          } catch {
            return !1;
          }
        }
      }
      if (u = a.child, a.subtreeFlags & 16384 && u !== null) u.return = a, a = u;
      else {
        if (a === i) break;
        for (; a.sibling === null; ) {
          if (a.return === null || a.return === i) return !0;
          a = a.return;
        }
        a.sibling.return = a.return, a = a.sibling;
      }
    }
    return !0;
  }
  function Vn(i, a) {
    for (a &= ~Pd, a &= ~_u, i.suspendedLanes |= a, i.pingedLanes &= ~a, i = i.expirationTimes; 0 < a; ) {
      var u = 31 - Pr(a), v = 1 << u;
      i[u] = -1, a &= ~v;
    }
  }
  function Ng(i) {
    if ((Ie & 6) !== 0) throw Error(r(327));
    ma();
    var a = Wl(i, 0);
    if ((a & 1) === 0) return Vt(i, Je()), null;
    var u = Mu(i, a);
    if (i.tag !== 0 && u === 2) {
      var v = lf(i);
      v !== 0 && (a = v, u = _d(i, v));
    }
    if (u === 1) throw u = Mo, mi(i, 0), Vn(i, a), Vt(i, Je()), u;
    if (u === 6) throw Error(r(345));
    return i.finishedWork = i.current.alternate, i.finishedLanes = a, yi(i, Kt, fn), Vt(i, Je()), null;
  }
  function Id(i, a) {
    var u = Ie;
    Ie |= 1;
    try {
      return i(a);
    } finally {
      Ie = u, Ie === 0 && (pa = Je() + 500, lu && zn());
    }
  }
  function pi(i) {
    Hn !== null && Hn.tag === 0 && (Ie & 6) === 0 && ma();
    var a = Ie;
    Ie |= 1;
    var u = dr.transition, v = $e;
    try {
      if (dr.transition = null, $e = 1, i) return i();
    } finally {
      $e = v, dr.transition = u, Ie = a, (Ie & 6) === 0 && zn();
    }
  }
  function jd() {
    er = ha.current, We(ha);
  }
  function mi(i, a) {
    i.finishedWork = null, i.finishedLanes = 0;
    var u = i.timeoutHandle;
    if (u !== -1 && (i.timeoutHandle = -1, Wk(u)), nt !== null) for (u = nt.return; u !== null; ) {
      var v = u;
      switch (Bf(v), v.tag) {
        case 1:
          v = v.type.childContextTypes, v != null && au();
          break;
        case 3:
          fa(), We(Wt), We(kt), Jf();
          break;
        case 5:
          Qf(v);
          break;
        case 4:
          fa();
          break;
        case 13:
          We(Ye);
          break;
        case 19:
          We(Ye);
          break;
        case 10:
          Vf(v.type._context);
          break;
        case 22:
        case 23:
          jd();
      }
      u = u.return;
    }
    if (vt = i, nt = i = Yn(i.current, null), wt = er = a, ot = 0, Mo = null, Pd = _u = hi = 0, Kt = Do = null, fi !== null) {
      for (a = 0; a < fi.length; a++) if (u = fi[a], v = u.interleaved, v !== null) {
        u.interleaved = null;
        var m = v.next, g = u.pending;
        if (g !== null) {
          var P = g.next;
          g.next = m, v.next = P;
        }
        u.pending = v;
      }
      fi = null;
    }
    return i;
  }
  function Mg(i, a) {
    do {
      var u = nt;
      try {
        if (Kf(), yu.current = bu, gu) {
          for (var v = Ge.memoizedState; v !== null; ) {
            var m = v.queue;
            m !== null && (m.pending = null), v = v.next;
          }
          gu = !1;
        }
        if (vi = 0, dt = at = Ge = null, _o = !1, Co = 0, Ad.current = null, u === null || u.return === null) {
          ot = 1, Mo = a, nt = null;
          break;
        }
        e: {
          var g = i, P = u.return, I = u, M = a;
          if (a = wt, I.flags |= 32768, M !== null && typeof M == "object" && typeof M.then == "function") {
            var B = M, X = I, Q = X.tag;
            if ((X.mode & 1) === 0 && (Q === 0 || Q === 11 || Q === 15)) {
              var G = X.alternate;
              G ? (X.updateQueue = G.updateQueue, X.memoizedState = G.memoizedState, X.lanes = G.lanes) : (X.updateQueue = null, X.memoizedState = null);
            }
            var ne = ag(P);
            if (ne !== null) {
              ne.flags &= -257, og(ne, P, I, g, a), ne.mode & 1 && ig(g, B, a), a = ne, M = B;
              var se = a.updateQueue;
              if (se === null) {
                var ce = /* @__PURE__ */ new Set();
                ce.add(M), a.updateQueue = ce;
              } else se.add(M);
              break e;
            } else {
              if ((a & 1) === 0) {
                ig(g, B, a), Td();
                break e;
              }
              M = Error(r(426));
            }
          } else if (Ke && I.mode & 1) {
            var et = ag(P);
            if (et !== null) {
              (et.flags & 65536) === 0 && (et.flags |= 256), og(et, P, I, g, a), Uf(da(M, I));
              break e;
            }
          }
          g = M = da(M, I), ot !== 4 && (ot = 2), Do === null ? Do = [g] : Do.push(g), g = P;
          do {
            switch (g.tag) {
              case 3:
                g.flags |= 65536, a &= -a, g.lanes |= a;
                var L = rg(g, M, a);
                Cy(g, L);
                break e;
              case 1:
                I = M;
                var D = g.type, R = g.stateNode;
                if ((g.flags & 128) === 0 && (typeof D.getDerivedStateFromError == "function" || R !== null && typeof R.componentDidCatch == "function" && (Un === null || !Un.has(R)))) {
                  g.flags |= 65536, a &= -a, g.lanes |= a;
                  var ee = ng(g, I, a);
                  Cy(g, ee);
                  break e;
                }
            }
            g = g.return;
          } while (g !== null);
        }
        Lg(u);
      } catch (de) {
        a = de, nt === u && u !== null && (nt = u = u.return);
        continue;
      }
      break;
    } while (!0);
  }
  function Dg() {
    var i = ku.current;
    return ku.current = bu, i === null ? bu : i;
  }
  function Td() {
    (ot === 0 || ot === 3 || ot === 2) && (ot = 4), vt === null || (hi & 268435455) === 0 && (_u & 268435455) === 0 || Vn(vt, wt);
  }
  function Mu(i, a) {
    var u = Ie;
    Ie |= 2;
    var v = Dg();
    (vt !== i || wt !== a) && (fn = null, mi(i, a));
    do
      try {
        v_();
        break;
      } catch (m) {
        Mg(i, m);
      }
    while (!0);
    if (Kf(), Ie = u, ku.current = v, nt !== null) throw Error(r(261));
    return vt = null, wt = 0, ot;
  }
  function v_() {
    for (; nt !== null; ) $g(nt);
  }
  function h_() {
    for (; nt !== null && !zO(); ) $g(nt);
  }
  function $g(i) {
    var a = Bg(i.alternate, i, er);
    i.memoizedProps = i.pendingProps, a === null ? Lg(i) : nt = a, Ad.current = null;
  }
  function Lg(i) {
    var a = i;
    do {
      var u = a.alternate;
      if (i = a.return, (a.flags & 32768) === 0) {
        if (u = o_(u, a, er), u !== null) {
          nt = u;
          return;
        }
      } else {
        if (u = l_(u, a), u !== null) {
          u.flags &= 32767, nt = u;
          return;
        }
        if (i !== null) i.flags |= 32768, i.subtreeFlags = 0, i.deletions = null;
        else {
          ot = 6, nt = null;
          return;
        }
      }
      if (a = a.sibling, a !== null) {
        nt = a;
        return;
      }
      nt = a = i;
    } while (a !== null);
    ot === 0 && (ot = 5);
  }
  function yi(i, a, u) {
    var v = $e, m = dr.transition;
    try {
      dr.transition = null, $e = 1, p_(i, a, u, v);
    } finally {
      dr.transition = m, $e = v;
    }
    return null;
  }
  function p_(i, a, u, v) {
    do
      ma();
    while (Hn !== null);
    if ((Ie & 6) !== 0) throw Error(r(327));
    u = i.finishedWork;
    var m = i.finishedLanes;
    if (u === null) return null;
    if (i.finishedWork = null, i.finishedLanes = 0, u === i.current) throw Error(r(177));
    i.callbackNode = null, i.callbackPriority = 0;
    var g = u.lanes | u.childLanes;
    if (XO(i, g), i === vt && (nt = vt = null, wt = 0), (u.subtreeFlags & 2064) === 0 && (u.flags & 2064) === 0 || Iu || (Iu = !0, Fg(Rl, function() {
      return ma(), null;
    })), g = (u.flags & 15990) !== 0, (u.subtreeFlags & 15990) !== 0 || g) {
      g = dr.transition, dr.transition = null;
      var P = $e;
      $e = 1;
      var I = Ie;
      Ie |= 4, Ad.current = null, s_(i, u), kg(u, i), Dk(Tf), Kl = !!jf, Tf = jf = null, i.current = u, c_(u), BO(), Ie = I, $e = P, dr.transition = g;
    } else i.current = u;
    if (Iu && (Iu = !1, Hn = i, ju = m), g = i.pendingLanes, g === 0 && (Un = null), UO(u.stateNode), Vt(i, Je()), a !== null) for (v = i.onRecoverableError, u = 0; u < a.length; u++) m = a[u], v(m.value, { componentStack: m.stack, digest: m.digest });
    if (Cu) throw Cu = !1, i = Od, Od = null, i;
    return (ju & 1) !== 0 && i.tag !== 0 && ma(), g = i.pendingLanes, (g & 1) !== 0 ? i === kd ? $o++ : ($o = 0, kd = i) : $o = 0, zn(), null;
  }
  function ma() {
    if (Hn !== null) {
      var i = Em(ju), a = dr.transition, u = $e;
      try {
        if (dr.transition = null, $e = 16 > i ? 16 : i, Hn === null) var v = !1;
        else {
          if (i = Hn, Hn = null, ju = 0, (Ie & 6) !== 0) throw Error(r(331));
          var m = Ie;
          for (Ie |= 4, oe = i.current; oe !== null; ) {
            var g = oe, P = g.child;
            if ((oe.flags & 16) !== 0) {
              var I = g.deletions;
              if (I !== null) {
                for (var M = 0; M < I.length; M++) {
                  var B = I[M];
                  for (oe = B; oe !== null; ) {
                    var X = oe;
                    switch (X.tag) {
                      case 0:
                      case 11:
                      case 15:
                        No(8, X, g);
                    }
                    var Q = X.child;
                    if (Q !== null) Q.return = X, oe = Q;
                    else for (; oe !== null; ) {
                      X = oe;
                      var G = X.sibling, ne = X.return;
                      if (Sg(X), X === B) {
                        oe = null;
                        break;
                      }
                      if (G !== null) {
                        G.return = ne, oe = G;
                        break;
                      }
                      oe = ne;
                    }
                  }
                }
                var se = g.alternate;
                if (se !== null) {
                  var ce = se.child;
                  if (ce !== null) {
                    se.child = null;
                    do {
                      var et = ce.sibling;
                      ce.sibling = null, ce = et;
                    } while (ce !== null);
                  }
                }
                oe = g;
              }
            }
            if ((g.subtreeFlags & 2064) !== 0 && P !== null) P.return = g, oe = P;
            else e: for (; oe !== null; ) {
              if (g = oe, (g.flags & 2048) !== 0) switch (g.tag) {
                case 0:
                case 11:
                case 15:
                  No(9, g, g.return);
              }
              var L = g.sibling;
              if (L !== null) {
                L.return = g.return, oe = L;
                break e;
              }
              oe = g.return;
            }
          }
          var D = i.current;
          for (oe = D; oe !== null; ) {
            P = oe;
            var R = P.child;
            if ((P.subtreeFlags & 2064) !== 0 && R !== null) R.return = P, oe = R;
            else e: for (P = D; oe !== null; ) {
              if (I = oe, (I.flags & 2048) !== 0) try {
                switch (I.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Ou(9, I);
                }
              } catch (de) {
                Xe(I, I.return, de);
              }
              if (I === P) {
                oe = null;
                break e;
              }
              var ee = I.sibling;
              if (ee !== null) {
                ee.return = I.return, oe = ee;
                break e;
              }
              oe = I.return;
            }
          }
          if (Ie = m, zn(), zr && typeof zr.onPostCommitFiberRoot == "function") try {
            zr.onPostCommitFiberRoot(zl, i);
          } catch {
          }
          v = !0;
        }
        return v;
      } finally {
        $e = u, dr.transition = a;
      }
    }
    return !1;
  }
  function Rg(i, a, u) {
    a = da(u, a), a = rg(i, a, 1), i = Fn(i, a, 1), a = zt(), i !== null && (ao(i, 1, a), Vt(i, a));
  }
  function Xe(i, a, u) {
    if (i.tag === 3) Rg(i, i, u);
    else for (; a !== null; ) {
      if (a.tag === 3) {
        Rg(a, i, u);
        break;
      } else if (a.tag === 1) {
        var v = a.stateNode;
        if (typeof a.type.getDerivedStateFromError == "function" || typeof v.componentDidCatch == "function" && (Un === null || !Un.has(v))) {
          i = da(u, i), i = ng(a, i, 1), a = Fn(a, i, 1), i = zt(), a !== null && (ao(a, 1, i), Vt(a, i));
          break;
        }
      }
      a = a.return;
    }
  }
  function m_(i, a, u) {
    var v = i.pingCache;
    v !== null && v.delete(a), a = zt(), i.pingedLanes |= i.suspendedLanes & u, vt === i && (wt & u) === u && (ot === 4 || ot === 3 && (wt & 130023424) === wt && 500 > Je() - Ed ? mi(i, 0) : Pd |= u), Vt(i, a);
  }
  function zg(i, a) {
    a === 0 && ((i.mode & 1) === 0 ? a = 1 : (a = Fl, Fl <<= 1, (Fl & 130023424) === 0 && (Fl = 4194304)));
    var u = zt();
    i = un(i, a), i !== null && (ao(i, a, u), Vt(i, u));
  }
  function y_(i) {
    var a = i.memoizedState, u = 0;
    a !== null && (u = a.retryLane), zg(i, u);
  }
  function g_(i, a) {
    var u = 0;
    switch (i.tag) {
      case 13:
        var v = i.stateNode, m = i.memoizedState;
        m !== null && (u = m.retryLane);
        break;
      case 19:
        v = i.stateNode;
        break;
      default:
        throw Error(r(314));
    }
    v !== null && v.delete(a), zg(i, u);
  }
  var Bg;
  Bg = function(i, a, u) {
    if (i !== null) if (i.memoizedProps !== a.pendingProps || Wt.current) Ht = !0;
    else {
      if ((i.lanes & u) === 0 && (a.flags & 128) === 0) return Ht = !1, a_(i, a, u);
      Ht = (i.flags & 131072) !== 0;
    }
    else Ht = !1, Ke && (a.flags & 1048576) !== 0 && xy(a, su, a.index);
    switch (a.lanes = 0, a.tag) {
      case 2:
        var v = a.type;
        Pu(i, a), i = a.pendingProps;
        var m = ia(a, kt.current);
        ca(a, u), m = rd(null, a, v, i, m, u);
        var g = nd();
        return a.flags |= 1, typeof m == "object" && m !== null && typeof m.render == "function" && m.$$typeof === void 0 ? (a.tag = 1, a.memoizedState = null, a.updateQueue = null, Ut(v) ? (g = !0, ou(a)) : g = !1, a.memoizedState = m.state !== null && m.state !== void 0 ? m.state : null, Xf(a), m.updater = Su, a.stateNode = m, m._reactInternals = a, sd(a, v, i, u), a = vd(null, a, v, !0, g, u)) : (a.tag = 0, Ke && g && zf(a), Rt(null, a, m, u), a = a.child), a;
      case 16:
        v = a.elementType;
        e: {
          switch (Pu(i, a), i = a.pendingProps, m = v._init, v = m(v._payload), a.type = v, m = a.tag = w_(v), i = kr(v, i), m) {
            case 0:
              a = dd(null, a, v, i, u);
              break e;
            case 1:
              a = dg(null, a, v, i, u);
              break e;
            case 11:
              a = lg(null, a, v, i, u);
              break e;
            case 14:
              a = ug(null, a, v, kr(v.type, i), u);
              break e;
          }
          throw Error(r(
            306,
            v,
            ""
          ));
        }
        return a;
      case 0:
        return v = a.type, m = a.pendingProps, m = a.elementType === v ? m : kr(v, m), dd(i, a, v, m, u);
      case 1:
        return v = a.type, m = a.pendingProps, m = a.elementType === v ? m : kr(v, m), dg(i, a, v, m, u);
      case 3:
        e: {
          if (vg(a), i === null) throw Error(r(387));
          v = a.pendingProps, g = a.memoizedState, m = g.element, _y(i, a), pu(a, v, null, u);
          var P = a.memoizedState;
          if (v = P.element, g.isDehydrated) if (g = { element: v, isDehydrated: !1, cache: P.cache, pendingSuspenseBoundaries: P.pendingSuspenseBoundaries, transitions: P.transitions }, a.updateQueue.baseState = g, a.memoizedState = g, a.flags & 256) {
            m = da(Error(r(423)), a), a = hg(i, a, v, u, m);
            break e;
          } else if (v !== m) {
            m = da(Error(r(424)), a), a = hg(i, a, v, u, m);
            break e;
          } else for (Jt = $n(a.stateNode.containerInfo.firstChild), Zt = a, Ke = !0, Or = null, u = Oy(a, null, v, u), a.child = u; u; ) u.flags = u.flags & -3 | 4096, u = u.sibling;
          else {
            if (la(), v === m) {
              a = cn(i, a, u);
              break e;
            }
            Rt(i, a, v, u);
          }
          a = a.child;
        }
        return a;
      case 5:
        return jy(a), i === null && Wf(a), v = a.type, m = a.pendingProps, g = i !== null ? i.memoizedProps : null, P = m.children, Nf(v, m) ? P = null : g !== null && Nf(v, g) && (a.flags |= 32), fg(i, a), Rt(i, a, P, u), a.child;
      case 6:
        return i === null && Wf(a), null;
      case 13:
        return pg(i, a, u);
      case 4:
        return qf(a, a.stateNode.containerInfo), v = a.pendingProps, i === null ? a.child = ua(a, null, v, u) : Rt(i, a, v, u), a.child;
      case 11:
        return v = a.type, m = a.pendingProps, m = a.elementType === v ? m : kr(v, m), lg(i, a, v, m, u);
      case 7:
        return Rt(i, a, a.pendingProps, u), a.child;
      case 8:
        return Rt(i, a, a.pendingProps.children, u), a.child;
      case 12:
        return Rt(i, a, a.pendingProps.children, u), a.child;
      case 10:
        e: {
          if (v = a.type._context, m = a.pendingProps, g = a.memoizedProps, P = m.value, Re(du, v._currentValue), v._currentValue = P, g !== null) if (Er(g.value, P)) {
            if (g.children === m.children && !Wt.current) {
              a = cn(i, a, u);
              break e;
            }
          } else for (g = a.child, g !== null && (g.return = a); g !== null; ) {
            var I = g.dependencies;
            if (I !== null) {
              P = g.child;
              for (var M = I.firstContext; M !== null; ) {
                if (M.context === v) {
                  if (g.tag === 1) {
                    M = sn(-1, u & -u), M.tag = 2;
                    var B = g.updateQueue;
                    if (B !== null) {
                      B = B.shared;
                      var X = B.pending;
                      X === null ? M.next = M : (M.next = X.next, X.next = M), B.pending = M;
                    }
                  }
                  g.lanes |= u, M = g.alternate, M !== null && (M.lanes |= u), Yf(
                    g.return,
                    u,
                    a
                  ), I.lanes |= u;
                  break;
                }
                M = M.next;
              }
            } else if (g.tag === 10) P = g.type === a.type ? null : g.child;
            else if (g.tag === 18) {
              if (P = g.return, P === null) throw Error(r(341));
              P.lanes |= u, I = P.alternate, I !== null && (I.lanes |= u), Yf(P, u, a), P = g.sibling;
            } else P = g.child;
            if (P !== null) P.return = g;
            else for (P = g; P !== null; ) {
              if (P === a) {
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
          Rt(i, a, m.children, u), a = a.child;
        }
        return a;
      case 9:
        return m = a.type, v = a.pendingProps.children, ca(a, u), m = cr(m), v = v(m), a.flags |= 1, Rt(i, a, v, u), a.child;
      case 14:
        return v = a.type, m = kr(v, a.pendingProps), m = kr(v.type, m), ug(i, a, v, m, u);
      case 15:
        return sg(i, a, a.type, a.pendingProps, u);
      case 17:
        return v = a.type, m = a.pendingProps, m = a.elementType === v ? m : kr(v, m), Pu(i, a), a.tag = 1, Ut(v) ? (i = !0, ou(a)) : i = !1, ca(a, u), eg(a, v, m), sd(a, v, m, u), vd(null, a, v, !0, i, u);
      case 19:
        return yg(i, a, u);
      case 22:
        return cg(i, a, u);
    }
    throw Error(r(156, a.tag));
  };
  function Fg(i, a) {
    return wm(i, a);
  }
  function x_(i, a, u, v) {
    this.tag = i, this.key = u, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = a, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = v, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function vr(i, a, u, v) {
    return new x_(i, a, u, v);
  }
  function Nd(i) {
    return i = i.prototype, !(!i || !i.isReactComponent);
  }
  function w_(i) {
    if (typeof i == "function") return Nd(i) ? 1 : 0;
    if (i != null) {
      if (i = i.$$typeof, i === W) return 11;
      if (i === we) return 14;
    }
    return 2;
  }
  function Yn(i, a) {
    var u = i.alternate;
    return u === null ? (u = vr(i.tag, a, i.key, i.mode), u.elementType = i.elementType, u.type = i.type, u.stateNode = i.stateNode, u.alternate = i, i.alternate = u) : (u.pendingProps = a, u.type = i.type, u.flags = 0, u.subtreeFlags = 0, u.deletions = null), u.flags = i.flags & 14680064, u.childLanes = i.childLanes, u.lanes = i.lanes, u.child = i.child, u.memoizedProps = i.memoizedProps, u.memoizedState = i.memoizedState, u.updateQueue = i.updateQueue, a = i.dependencies, u.dependencies = a === null ? null : { lanes: a.lanes, firstContext: a.firstContext }, u.sibling = i.sibling, u.index = i.index, u.ref = i.ref, u;
  }
  function Du(i, a, u, v, m, g) {
    var P = 2;
    if (v = i, typeof i == "function") Nd(i) && (P = 1);
    else if (typeof i == "string") P = 5;
    else e: switch (i) {
      case _:
        return gi(u.children, m, g, a);
      case F:
        P = 8, m |= 8;
        break;
      case K:
        return i = vr(12, u, a, m | 2), i.elementType = K, i.lanes = g, i;
      case ie:
        return i = vr(13, u, a, m), i.elementType = ie, i.lanes = g, i;
      case re:
        return i = vr(19, u, a, m), i.elementType = re, i.lanes = g, i;
      case ae:
        return $u(u, m, g, a);
      default:
        if (typeof i == "object" && i !== null) switch (i.$$typeof) {
          case V:
            P = 10;
            break e;
          case q:
            P = 9;
            break e;
          case W:
            P = 11;
            break e;
          case we:
            P = 14;
            break e;
          case ve:
            P = 16, v = null;
            break e;
        }
        throw Error(r(130, i == null ? i : typeof i, ""));
    }
    return a = vr(P, u, a, m), a.elementType = i, a.type = v, a.lanes = g, a;
  }
  function gi(i, a, u, v) {
    return i = vr(7, i, v, a), i.lanes = u, i;
  }
  function $u(i, a, u, v) {
    return i = vr(22, i, v, a), i.elementType = ae, i.lanes = u, i.stateNode = { isHidden: !1 }, i;
  }
  function Md(i, a, u) {
    return i = vr(6, i, null, a), i.lanes = u, i;
  }
  function Dd(i, a, u) {
    return a = vr(4, i.children !== null ? i.children : [], i.key, a), a.lanes = u, a.stateNode = { containerInfo: i.containerInfo, pendingChildren: null, implementation: i.implementation }, a;
  }
  function b_(i, a, u, v, m) {
    this.tag = a, this.containerInfo = i, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = uf(0), this.expirationTimes = uf(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = uf(0), this.identifierPrefix = v, this.onRecoverableError = m, this.mutableSourceEagerHydrationData = null;
  }
  function $d(i, a, u, v, m, g, P, I, M) {
    return i = new b_(i, a, u, I, M), a === 1 ? (a = 1, g === !0 && (a |= 8)) : a = 0, g = vr(3, null, null, a), i.current = g, g.stateNode = i, g.memoizedState = { element: v, isDehydrated: u, cache: null, transitions: null, pendingSuspenseBoundaries: null }, Xf(g), i;
  }
  function S_(i, a, u) {
    var v = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: O, key: v == null ? null : "" + v, children: i, containerInfo: a, implementation: u };
  }
  function Wg(i) {
    if (!i) return Rn;
    i = i._reactInternals;
    e: {
      if (oi(i) !== i || i.tag !== 1) throw Error(r(170));
      var a = i;
      do {
        switch (a.tag) {
          case 3:
            a = a.stateNode.context;
            break e;
          case 1:
            if (Ut(a.type)) {
              a = a.stateNode.__reactInternalMemoizedMergedChildContext;
              break e;
            }
        }
        a = a.return;
      } while (a !== null);
      throw Error(r(171));
    }
    if (i.tag === 1) {
      var u = i.type;
      if (Ut(u)) return my(i, u, a);
    }
    return a;
  }
  function Ug(i, a, u, v, m, g, P, I, M) {
    return i = $d(u, v, !0, i, m, g, P, I, M), i.context = Wg(null), u = i.current, v = zt(), m = Kn(u), g = sn(v, m), g.callback = a ?? null, Fn(u, g, m), i.current.lanes = m, ao(i, m, v), Vt(i, v), i;
  }
  function Lu(i, a, u, v) {
    var m = a.current, g = zt(), P = Kn(m);
    return u = Wg(u), a.context === null ? a.context = u : a.pendingContext = u, a = sn(g, P), a.payload = { element: i }, v = v === void 0 ? null : v, v !== null && (a.callback = v), i = Fn(m, a, P), i !== null && (Ir(i, m, P, g), hu(i, m, P)), P;
  }
  function Ru(i) {
    if (i = i.current, !i.child) return null;
    switch (i.child.tag) {
      case 5:
        return i.child.stateNode;
      default:
        return i.child.stateNode;
    }
  }
  function Hg(i, a) {
    if (i = i.memoizedState, i !== null && i.dehydrated !== null) {
      var u = i.retryLane;
      i.retryLane = u !== 0 && u < a ? u : a;
    }
  }
  function Ld(i, a) {
    Hg(i, a), (i = i.alternate) && Hg(i, a);
  }
  function A_() {
    return null;
  }
  var Kg = typeof reportError == "function" ? reportError : function(i) {
    console.error(i);
  };
  function Rd(i) {
    this._internalRoot = i;
  }
  zu.prototype.render = Rd.prototype.render = function(i) {
    var a = this._internalRoot;
    if (a === null) throw Error(r(409));
    Lu(i, a, null, null);
  }, zu.prototype.unmount = Rd.prototype.unmount = function() {
    var i = this._internalRoot;
    if (i !== null) {
      this._internalRoot = null;
      var a = i.containerInfo;
      pi(function() {
        Lu(null, i, null, null);
      }), a[nn] = null;
    }
  };
  function zu(i) {
    this._internalRoot = i;
  }
  zu.prototype.unstable_scheduleHydration = function(i) {
    if (i) {
      var a = _m();
      i = { blockedOn: null, target: i, priority: a };
      for (var u = 0; u < Nn.length && a !== 0 && a < Nn[u].priority; u++) ;
      Nn.splice(u, 0, i), u === 0 && jm(i);
    }
  };
  function zd(i) {
    return !(!i || i.nodeType !== 1 && i.nodeType !== 9 && i.nodeType !== 11);
  }
  function Bu(i) {
    return !(!i || i.nodeType !== 1 && i.nodeType !== 9 && i.nodeType !== 11 && (i.nodeType !== 8 || i.nodeValue !== " react-mount-point-unstable "));
  }
  function Vg() {
  }
  function P_(i, a, u, v, m) {
    if (m) {
      if (typeof v == "function") {
        var g = v;
        v = function() {
          var B = Ru(P);
          g.call(B);
        };
      }
      var P = Ug(a, v, i, 0, null, !1, !1, "", Vg);
      return i._reactRootContainer = P, i[nn] = P.current, wo(i.nodeType === 8 ? i.parentNode : i), pi(), P;
    }
    for (; m = i.lastChild; ) i.removeChild(m);
    if (typeof v == "function") {
      var I = v;
      v = function() {
        var B = Ru(M);
        I.call(B);
      };
    }
    var M = $d(i, 0, !1, null, null, !1, !1, "", Vg);
    return i._reactRootContainer = M, i[nn] = M.current, wo(i.nodeType === 8 ? i.parentNode : i), pi(function() {
      Lu(a, M, u, v);
    }), M;
  }
  function Fu(i, a, u, v, m) {
    var g = u._reactRootContainer;
    if (g) {
      var P = g;
      if (typeof m == "function") {
        var I = m;
        m = function() {
          var M = Ru(P);
          I.call(M);
        };
      }
      Lu(a, P, i, m);
    } else P = P_(u, a, i, m, v);
    return Ru(P);
  }
  Om = function(i) {
    switch (i.tag) {
      case 3:
        var a = i.stateNode;
        if (a.current.memoizedState.isDehydrated) {
          var u = io(a.pendingLanes);
          u !== 0 && (sf(a, u | 1), Vt(a, Je()), (Ie & 6) === 0 && (pa = Je() + 500, zn()));
        }
        break;
      case 13:
        pi(function() {
          var v = un(i, 1);
          if (v !== null) {
            var m = zt();
            Ir(v, i, 1, m);
          }
        }), Ld(i, 1);
    }
  }, cf = function(i) {
    if (i.tag === 13) {
      var a = un(i, 134217728);
      if (a !== null) {
        var u = zt();
        Ir(a, i, 134217728, u);
      }
      Ld(i, 134217728);
    }
  }, km = function(i) {
    if (i.tag === 13) {
      var a = Kn(i), u = un(i, a);
      if (u !== null) {
        var v = zt();
        Ir(u, i, a, v);
      }
      Ld(i, a);
    }
  }, _m = function() {
    return $e;
  }, Cm = function(i, a) {
    var u = $e;
    try {
      return $e = i, a();
    } finally {
      $e = u;
    }
  }, tf = function(i, a, u) {
    switch (a) {
      case "input":
        if (Ar(i, u), a = u.name, u.type === "radio" && a != null) {
          for (u = i; u.parentNode; ) u = u.parentNode;
          for (u = u.querySelectorAll("input[name=" + JSON.stringify("" + a) + '][type="radio"]'), a = 0; a < u.length; a++) {
            var v = u[a];
            if (v !== i && v.form === i.form) {
              var m = iu(v);
              if (!m) throw Error(r(90));
              Z(v), Ar(v, m);
            }
          }
        }
        break;
      case "textarea":
        im(i, u);
        break;
      case "select":
        a = u.value, a != null && Vi(i, !!u.multiple, a, !1);
    }
  }, vm = Id, hm = pi;
  var E_ = { usingClientEntryPoint: !1, Events: [Ao, ra, iu, fm, dm, Id] }, Lo = { findFiberByHostInstance: li, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, O_ = { bundleType: Lo.bundleType, version: Lo.version, rendererPackageName: Lo.rendererPackageName, rendererConfig: Lo.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: j.ReactCurrentDispatcher, findHostInstanceByFiber: function(i) {
    return i = gm(i), i === null ? null : i.stateNode;
  }, findFiberByHostInstance: Lo.findFiberByHostInstance || A_, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Wu = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Wu.isDisabled && Wu.supportsFiber) try {
      zl = Wu.inject(O_), zr = Wu;
    } catch {
    }
  }
  return Yt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = E_, Yt.createPortal = function(i, a) {
    var u = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!zd(a)) throw Error(r(200));
    return S_(i, a, null, u);
  }, Yt.createRoot = function(i, a) {
    if (!zd(i)) throw Error(r(299));
    var u = !1, v = "", m = Kg;
    return a != null && (a.unstable_strictMode === !0 && (u = !0), a.identifierPrefix !== void 0 && (v = a.identifierPrefix), a.onRecoverableError !== void 0 && (m = a.onRecoverableError)), a = $d(i, 1, !1, null, null, u, !1, v, m), i[nn] = a.current, wo(i.nodeType === 8 ? i.parentNode : i), new Rd(a);
  }, Yt.findDOMNode = function(i) {
    if (i == null) return null;
    if (i.nodeType === 1) return i;
    var a = i._reactInternals;
    if (a === void 0)
      throw typeof i.render == "function" ? Error(r(188)) : (i = Object.keys(i).join(","), Error(r(268, i)));
    return i = gm(a), i = i === null ? null : i.stateNode, i;
  }, Yt.flushSync = function(i) {
    return pi(i);
  }, Yt.hydrate = function(i, a, u) {
    if (!Bu(a)) throw Error(r(200));
    return Fu(null, i, a, !0, u);
  }, Yt.hydrateRoot = function(i, a, u) {
    if (!zd(i)) throw Error(r(405));
    var v = u != null && u.hydratedSources || null, m = !1, g = "", P = Kg;
    if (u != null && (u.unstable_strictMode === !0 && (m = !0), u.identifierPrefix !== void 0 && (g = u.identifierPrefix), u.onRecoverableError !== void 0 && (P = u.onRecoverableError)), a = Ug(a, null, i, 1, u ?? null, m, !1, g, P), i[nn] = a.current, wo(i), v) for (i = 0; i < v.length; i++) u = v[i], m = u._getVersion, m = m(u._source), a.mutableSourceEagerHydrationData == null ? a.mutableSourceEagerHydrationData = [u, m] : a.mutableSourceEagerHydrationData.push(
      u,
      m
    );
    return new zu(a);
  }, Yt.render = function(i, a, u) {
    if (!Bu(a)) throw Error(r(200));
    return Fu(null, i, a, !1, u);
  }, Yt.unmountComponentAtNode = function(i) {
    if (!Bu(i)) throw Error(r(40));
    return i._reactRootContainer ? (pi(function() {
      Fu(null, null, i, !1, function() {
        i._reactRootContainer = null, i[nn] = null;
      });
    }), !0) : !1;
  }, Yt.unstable_batchedUpdates = Id, Yt.unstable_renderSubtreeIntoContainer = function(i, a, u, v) {
    if (!Bu(u)) throw Error(r(200));
    if (i == null || i._reactInternals === void 0) throw Error(r(38));
    return Fu(i, a, u, !1, v);
  }, Yt.version = "18.3.1-next-f1338f8080-20240426", Yt;
}
var e0;
function eb() {
  if (e0) return Wd.exports;
  e0 = 1;
  function e() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(e);
      } catch (t) {
        console.error(t);
      }
  }
  return e(), Wd.exports = $_(), Wd.exports;
}
var t0;
function L_() {
  if (t0) return Hu;
  t0 = 1;
  var e = eb();
  return Hu.createRoot = e.createRoot, Hu.hydrateRoot = e.hydrateRoot, Hu;
}
var R_ = L_(), w = Ba();
const z_ = /* @__PURE__ */ J1(w), B_ = /* @__PURE__ */ I_({
  __proto__: null,
  default: z_
}, [w]);
function tb(e) {
  var t, r, n = "";
  if (typeof e == "string" || typeof e == "number") n += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var o = e.length;
    for (t = 0; t < o; t++) e[t] && (r = tb(e[t])) && (n && (n += " "), n += r);
  } else for (r in e) e[r] && (n && (n += " "), n += r);
  return n;
}
function ze() {
  for (var e, t, r = 0, n = "", o = arguments.length; r < o; r++) (e = arguments[r]) && (t = tb(e)) && (n && (n += " "), n += t);
  return n;
}
var F_ = ["dangerouslySetInnerHTML", "onCopy", "onCopyCapture", "onCut", "onCutCapture", "onPaste", "onPasteCapture", "onCompositionEnd", "onCompositionEndCapture", "onCompositionStart", "onCompositionStartCapture", "onCompositionUpdate", "onCompositionUpdateCapture", "onFocus", "onFocusCapture", "onBlur", "onBlurCapture", "onChange", "onChangeCapture", "onBeforeInput", "onBeforeInputCapture", "onInput", "onInputCapture", "onReset", "onResetCapture", "onSubmit", "onSubmitCapture", "onInvalid", "onInvalidCapture", "onLoad", "onLoadCapture", "onError", "onErrorCapture", "onKeyDown", "onKeyDownCapture", "onKeyPress", "onKeyPressCapture", "onKeyUp", "onKeyUpCapture", "onAbort", "onAbortCapture", "onCanPlay", "onCanPlayCapture", "onCanPlayThrough", "onCanPlayThroughCapture", "onDurationChange", "onDurationChangeCapture", "onEmptied", "onEmptiedCapture", "onEncrypted", "onEncryptedCapture", "onEnded", "onEndedCapture", "onLoadedData", "onLoadedDataCapture", "onLoadedMetadata", "onLoadedMetadataCapture", "onLoadStart", "onLoadStartCapture", "onPause", "onPauseCapture", "onPlay", "onPlayCapture", "onPlaying", "onPlayingCapture", "onProgress", "onProgressCapture", "onRateChange", "onRateChangeCapture", "onSeeked", "onSeekedCapture", "onSeeking", "onSeekingCapture", "onStalled", "onStalledCapture", "onSuspend", "onSuspendCapture", "onTimeUpdate", "onTimeUpdateCapture", "onVolumeChange", "onVolumeChangeCapture", "onWaiting", "onWaitingCapture", "onAuxClick", "onAuxClickCapture", "onClick", "onClickCapture", "onContextMenu", "onContextMenuCapture", "onDoubleClick", "onDoubleClickCapture", "onDrag", "onDragCapture", "onDragEnd", "onDragEndCapture", "onDragEnter", "onDragEnterCapture", "onDragExit", "onDragExitCapture", "onDragLeave", "onDragLeaveCapture", "onDragOver", "onDragOverCapture", "onDragStart", "onDragStartCapture", "onDrop", "onDropCapture", "onMouseDown", "onMouseDownCapture", "onMouseEnter", "onMouseLeave", "onMouseMove", "onMouseMoveCapture", "onMouseOut", "onMouseOutCapture", "onMouseOver", "onMouseOverCapture", "onMouseUp", "onMouseUpCapture", "onSelect", "onSelectCapture", "onTouchCancel", "onTouchCancelCapture", "onTouchEnd", "onTouchEndCapture", "onTouchMove", "onTouchMoveCapture", "onTouchStart", "onTouchStartCapture", "onPointerDown", "onPointerDownCapture", "onPointerMove", "onPointerMoveCapture", "onPointerUp", "onPointerUpCapture", "onPointerCancel", "onPointerCancelCapture", "onPointerEnter", "onPointerEnterCapture", "onPointerLeave", "onPointerLeaveCapture", "onPointerOver", "onPointerOverCapture", "onPointerOut", "onPointerOutCapture", "onGotPointerCapture", "onGotPointerCaptureCapture", "onLostPointerCapture", "onLostPointerCaptureCapture", "onScroll", "onScrollCapture", "onWheel", "onWheelCapture", "onAnimationStart", "onAnimationStartCapture", "onAnimationEnd", "onAnimationEndCapture", "onAnimationIteration", "onAnimationIterationCapture", "onTransitionEnd", "onTransitionEndCapture"];
function gh(e) {
  if (typeof e != "string")
    return !1;
  var t = F_;
  return t.includes(e);
}
var W_ = [
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
], U_ = new Set(W_);
function rb(e) {
  return typeof e != "string" ? !1 : U_.has(e);
}
function nb(e) {
  return typeof e == "string" && e.startsWith("data-");
}
function gr(e) {
  if (typeof e != "object" || e === null)
    return {};
  var t = {};
  for (var r in e)
    Object.prototype.hasOwnProperty.call(e, r) && (rb(r) || nb(r)) && (t[r] = e[r]);
  return t;
}
function ic(e) {
  if (e == null)
    return null;
  if (/* @__PURE__ */ w.isValidElement(e) && typeof e.props == "object" && e.props !== null) {
    var t = e.props;
    return gr(t);
  }
  return typeof e == "object" && !Array.isArray(e) ? gr(e) : null;
}
function ar(e) {
  var t = {};
  for (var r in e)
    Object.prototype.hasOwnProperty.call(e, r) && (rb(r) || nb(r) || gh(r)) && (t[r] = e[r]);
  return t;
}
function H_(e) {
  return e == null ? null : /* @__PURE__ */ w.isValidElement(e) ? ar(e.props) : typeof e == "object" && !Array.isArray(e) ? ar(e) : null;
}
var K_ = ["children", "width", "height", "viewBox", "className", "style", "title", "desc"];
function kv() {
  return kv = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, kv.apply(null, arguments);
}
function V_(e, t) {
  if (e == null) return {};
  var r, n, o = Y_(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (o[r] = e[r]);
  }
  return o;
}
function Y_(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
var ib = /* @__PURE__ */ w.forwardRef((e, t) => {
  var r = e.children, n = e.width, o = e.height, l = e.viewBox, s = e.className, c = e.style, f = e.title, d = e.desc, h = V_(e, K_), p = l || {
    width: n,
    height: o,
    x: 0,
    y: 0
  }, y = ze("recharts-surface", s);
  return /* @__PURE__ */ w.createElement("svg", kv({}, ar(h), {
    className: y,
    width: n,
    height: o,
    style: c,
    viewBox: "".concat(p.x, " ").concat(p.y, " ").concat(p.width, " ").concat(p.height),
    ref: t
  }), /* @__PURE__ */ w.createElement("title", null, f), /* @__PURE__ */ w.createElement("desc", null, d), r);
}), G_ = ["children", "className"];
function _v() {
  return _v = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, _v.apply(null, arguments);
}
function X_(e, t) {
  if (e == null) return {};
  var r, n, o = q_(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (o[r] = e[r]);
  }
  return o;
}
function q_(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
var or = /* @__PURE__ */ w.forwardRef((e, t) => {
  var r = e.children, n = e.className, o = X_(e, G_), l = ze("recharts-layer", n);
  return /* @__PURE__ */ w.createElement("g", _v({
    className: l
  }, ar(o), {
    ref: t
  }), r);
}), ab = eb();
function Cv(e) {
  return e === "__proto__";
}
const Q_ = /\.|(\[(?:[^[\]]*|(["'])(?:(?!\2)[^\\]|\\.)*?\2)\])/;
function ob(e) {
  switch (typeof e) {
    case "number":
    case "symbol":
      return !1;
    case "string":
      return e === "" || e.startsWith(".") || e.endsWith(".") ? !1 : Q_.test(e);
    default:
      return !1;
  }
}
function ac(e) {
  var t;
  return typeof e == "string" || typeof e == "symbol" ? e : Object.is((t = e == null ? void 0 : e.valueOf) == null ? void 0 : t.call(e), -0) ? "-0" : String(e);
}
function xh(e) {
  return typeof e == "symbol" || e instanceof Symbol;
}
function Z_(e) {
  return e == null ? "" : lb(e);
}
function lb(e) {
  if (typeof e == "string") return e;
  if (Array.isArray(e)) return e.map(lb).join(",");
  if (xh(e)) return e.toString();
  const t = e + "";
  return t === "0" && Object.is(Number(e), -0) ? "-0" : t;
}
function wh(e) {
  if (Array.isArray(e)) return e.map(ac);
  if (typeof e == "symbol") return [e];
  e = Z_(e);
  const t = [], r = e.length;
  if (r === 0) return t;
  let n = 0, o = "", l = "", s = !1, c = !1;
  const f = /^-?\d+(?:\.\d+)?$/;
  for (e.charCodeAt(0) === 46 && t.push(""); n < r; ) {
    const d = e[n];
    if (l) d === "\\" && n + 1 < r ? (n++, o += e[n]) : d === l ? l = "" : o += d;
    else if (s) if (d === '"' || d === "'")
      l = d, c = !0;
    else if (d === "]") {
      if (s = !1, !c && o.includes(".") && !f.test(o)) {
        const h = o.split(".");
        for (let p = 0; p < h.length; p++) h[p] !== "" && t.push(h[p]);
      } else t.push(o);
      o = "";
    } else o += d;
    else if (d === "[")
      s = !0, c = !1, o && (t.push(o), o = "");
    else if (d === ".") {
      o && (t.push(o), o = "");
      const h = e[n + 1];
      (h === void 0 || h === ".") && t.push("");
    } else o += d;
    n++;
  }
  return o && t.push(o), t;
}
function Bi(e, t, r) {
  if (e == null) return r;
  switch (typeof t) {
    case "string": {
      if (Cv(t)) return r;
      const n = e[t];
      return n === void 0 ? ob(t) && !Object.hasOwn(e, t) ? Bi(e, wh(t), r) : r : n;
    }
    case "number":
    case "symbol": {
      typeof t == "number" && (t = ac(t));
      const n = e[t];
      return n === void 0 ? r : n;
    }
    default: {
      if (Array.isArray(t)) return J_(e, t, r);
      if (Object.is(t == null ? void 0 : t.valueOf(), -0) ? t = "-0" : t = String(t), Cv(t)) return r;
      const n = e[t];
      return n === void 0 ? r : n;
    }
  }
}
function J_(e, t, r) {
  if (t.length === 0) return r;
  let n = e;
  for (let o = 0; o < t.length; o++) {
    if (n == null || Cv(t[o])) return r;
    n = n[t[o]];
  }
  return n === void 0 ? r : n;
}
var eC = 4;
function pn(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : eC, r = 10 ** t, n = Math.round(e * r) / r;
  return Object.is(n, -0) ? 0 : n;
}
function St(e) {
  for (var t = arguments.length, r = new Array(t > 1 ? t - 1 : 0), n = 1; n < t; n++)
    r[n - 1] = arguments[n];
  return e.reduce((o, l, s) => {
    var c = r[s - 1];
    return typeof c == "string" ? o + c + l : c !== void 0 ? o + pn(c) + l : o + l;
  }, "");
}
var pr = (e) => e === 0 ? 0 : e > 0 ? 1 : -1, Zr = (e) => typeof e == "number" && e != +e, Mi = (e) => typeof e == "string" && e.length > 1 && e.indexOf("%") === e.length - 1, le = (e) => (typeof e == "number" || e instanceof Number) && !Zr(e), Jr = (e) => le(e) || typeof e == "string", tC = 0, il = (e) => {
  var t = ++tC;
  return "".concat(e || "").concat(t);
}, ni = function(t, r) {
  var n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0, o = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : !1;
  if (!le(t) && typeof t != "string")
    return n;
  var l;
  if (Mi(t)) {
    if (r == null)
      return n;
    var s = t.indexOf("%");
    l = r * parseFloat(t.slice(0, s)) / 100;
  } else
    l = +t;
  return Zr(l) && (l = n), o && r != null && l > r && (l = r), l;
}, ub = (e) => {
  if (!Array.isArray(e))
    return !1;
  for (var t = e.length, r = {}, n = 0; n < t; n++)
    if (!r[String(e[n])])
      r[String(e[n])] = !0;
    else
      return !0;
  return !1;
};
function rr(e, t, r) {
  return le(e) && le(t) ? pn(e + r * (t - e)) : t;
}
function sb(e, t, r) {
  if (!(!e || !e.length))
    return e.find((n) => n && (typeof t == "function" ? t(n) : Bi(n, t)) === r);
}
var st = (e) => e === null || typeof e > "u", bh = (e) => st(e) ? e : "".concat(e.charAt(0).toUpperCase()).concat(e.slice(1));
function Bt(e) {
  return e != null;
}
function Fi() {
}
function Sh(e) {
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
function r0(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Hr(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? r0(Object(r), !0).forEach(function(n) {
      rC(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : r0(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function rC(e, t, r) {
  return (t = nC(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function nC(e) {
  var t = iC(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function iC(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var aC = (e) => {
  var t = e.viewBox, r = e.position, n = e.offset, o = n === void 0 ? 0 : n, l = e.parentViewBox, s = Sh(t), c = s.x, f = s.y, d = s.height, h = s.upperWidth, p = s.lowerWidth, y = c, x = c + (h - p) / 2, A = (y + x) / 2, S = (h + p) / 2, b = y + h / 2, E = d >= 0 ? 1 : -1, k = E * o, C = E > 0 ? "end" : "start", j = E > 0 ? "start" : "end", T = h >= 0 ? 1 : -1, O = T * o, _ = T > 0 ? "end" : "start", F = T > 0 ? "start" : "end", K = l;
  if (r === "top") {
    var V = {
      x: y + h / 2,
      y: f - k,
      horizontalAnchor: "middle",
      verticalAnchor: C
    };
    return K && (V.height = Math.max(f - K.y, 0), V.width = h), V;
  }
  if (r === "bottom") {
    var q = {
      x: x + p / 2,
      y: f + d + k,
      horizontalAnchor: "middle",
      verticalAnchor: j
    };
    return K && (q.height = Math.max(K.y + K.height - (f + d), 0), q.width = p), q;
  }
  if (r === "left") {
    var W = {
      x: A - O,
      y: f + d / 2,
      horizontalAnchor: _,
      verticalAnchor: "middle"
    };
    return K && (W.width = Math.max(W.x - K.x, 0), W.height = d), W;
  }
  if (r === "right") {
    var ie = {
      x: A + S + O,
      y: f + d / 2,
      horizontalAnchor: F,
      verticalAnchor: "middle"
    };
    return K && (ie.width = Math.max(K.x + K.width - ie.x, 0), ie.height = d), ie;
  }
  var re = K ? {
    width: S,
    height: d
  } : {};
  return r === "insideLeft" ? Hr({
    x: A + O,
    y: f + d / 2,
    horizontalAnchor: F,
    verticalAnchor: "middle"
  }, re) : r === "insideRight" ? Hr({
    x: A + S - O,
    y: f + d / 2,
    horizontalAnchor: _,
    verticalAnchor: "middle"
  }, re) : r === "insideTop" ? Hr({
    x: y + h / 2,
    y: f + k,
    horizontalAnchor: "middle",
    verticalAnchor: j
  }, re) : r === "insideBottom" ? Hr({
    x: x + p / 2,
    y: f + d - k,
    horizontalAnchor: "middle",
    verticalAnchor: C
  }, re) : r === "insideTopLeft" ? Hr({
    x: y + O,
    y: f + k,
    horizontalAnchor: F,
    verticalAnchor: j
  }, re) : r === "insideTopRight" ? Hr({
    x: y + h - O,
    y: f + k,
    horizontalAnchor: _,
    verticalAnchor: j
  }, re) : r === "insideBottomLeft" ? Hr({
    x: x + O,
    y: f + d - k,
    horizontalAnchor: F,
    verticalAnchor: C
  }, re) : r === "insideBottomRight" ? Hr({
    x: x + p - O,
    y: f + d - k,
    horizontalAnchor: _,
    verticalAnchor: C
  }, re) : r && typeof r == "object" && (le(r.x) || Mi(r.x)) && (le(r.y) || Mi(r.y)) ? Hr({
    x: c + ni(r.x, S),
    y: f + ni(r.y, d),
    horizontalAnchor: "end",
    verticalAnchor: "end"
  }, re) : Hr({
    x: b,
    y: f + d / 2,
    horizontalAnchor: "middle",
    verticalAnchor: "middle"
  }, re);
}, oC = ["top", "left", "right", "bottom"];
function lC(e) {
  return e == null ? !1 : typeof e == "object" ? !0 : oC.includes(e);
}
var uC = /* @__PURE__ */ w.createContext(null);
function qe(e) {
  return function() {
    return e;
  };
}
const Iv = Math.PI, jv = 2 * Iv, Ai = 1e-6, sC = jv - Ai;
function cb(e) {
  this._ += e[0];
  for (let t = 1, r = e.length; t < r; ++t)
    this._ += arguments[t] + e[t];
}
function cC(e) {
  let t = Math.floor(e);
  if (!(t >= 0)) throw new Error(`invalid digits: ${e}`);
  if (t > 15) return cb;
  const r = 10 ** t;
  return function(n) {
    this._ += n[0];
    for (let o = 1, l = n.length; o < l; ++o)
      this._ += Math.round(arguments[o] * r) / r + n[o];
  };
}
class fC {
  constructor(t) {
    this._x0 = this._y0 = // start of current subpath
    this._x1 = this._y1 = null, this._ = "", this._append = t == null ? cb : cC(t);
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
  quadraticCurveTo(t, r, n, o) {
    this._append`Q${+t},${+r},${this._x1 = +n},${this._y1 = +o}`;
  }
  bezierCurveTo(t, r, n, o, l, s) {
    this._append`C${+t},${+r},${+n},${+o},${this._x1 = +l},${this._y1 = +s}`;
  }
  arcTo(t, r, n, o, l) {
    if (t = +t, r = +r, n = +n, o = +o, l = +l, l < 0) throw new Error(`negative radius: ${l}`);
    let s = this._x1, c = this._y1, f = n - t, d = o - r, h = s - t, p = c - r, y = h * h + p * p;
    if (this._x1 === null)
      this._append`M${this._x1 = t},${this._y1 = r}`;
    else if (y > Ai) if (!(Math.abs(p * f - d * h) > Ai) || !l)
      this._append`L${this._x1 = t},${this._y1 = r}`;
    else {
      let x = n - s, A = o - c, S = f * f + d * d, b = x * x + A * A, E = Math.sqrt(S), k = Math.sqrt(y), C = l * Math.tan((Iv - Math.acos((S + y - b) / (2 * E * k))) / 2), j = C / k, T = C / E;
      Math.abs(j - 1) > Ai && this._append`L${t + j * h},${r + j * p}`, this._append`A${l},${l},0,0,${+(p * x > h * A)},${this._x1 = t + T * f},${this._y1 = r + T * d}`;
    }
  }
  arc(t, r, n, o, l, s) {
    if (t = +t, r = +r, n = +n, s = !!s, n < 0) throw new Error(`negative radius: ${n}`);
    let c = n * Math.cos(o), f = n * Math.sin(o), d = t + c, h = r + f, p = 1 ^ s, y = s ? o - l : l - o;
    this._x1 === null ? this._append`M${d},${h}` : (Math.abs(this._x1 - d) > Ai || Math.abs(this._y1 - h) > Ai) && this._append`L${d},${h}`, n && (y < 0 && (y = y % jv + jv), y > sC ? this._append`A${n},${n},0,1,${p},${t - c},${r - f}A${n},${n},0,1,${p},${this._x1 = d},${this._y1 = h}` : y > Ai && this._append`A${n},${n},0,${+(y >= Iv)},${p},${this._x1 = t + n * Math.cos(l)},${this._y1 = r + n * Math.sin(l)}`);
  }
  rect(t, r, n, o) {
    this._append`M${this._x0 = this._x1 = +t},${this._y0 = this._y1 = +r}h${n = +n}v${+o}h${-n}Z`;
  }
  toString() {
    return this._;
  }
}
function fb(e) {
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
  }, () => new fC(t);
}
function Ah(e) {
  return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function db(e) {
  this._context = e;
}
db.prototype = {
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
function oc(e) {
  return new db(e);
}
function vb(e) {
  return e[0];
}
function hb(e) {
  return e[1];
}
function pb(e, t) {
  var r = qe(!0), n = null, o = oc, l = null, s = fb(c);
  e = typeof e == "function" ? e : e === void 0 ? vb : qe(e), t = typeof t == "function" ? t : t === void 0 ? hb : qe(t);
  function c(f) {
    var d, h = (f = Ah(f)).length, p, y = !1, x;
    for (n == null && (l = o(x = s())), d = 0; d <= h; ++d)
      !(d < h && r(p = f[d], d, f)) === y && ((y = !y) ? l.lineStart() : l.lineEnd()), y && l.point(+e(p, d, f), +t(p, d, f));
    if (x) return l = null, x + "" || null;
  }
  return c.x = function(f) {
    return arguments.length ? (e = typeof f == "function" ? f : qe(+f), c) : e;
  }, c.y = function(f) {
    return arguments.length ? (t = typeof f == "function" ? f : qe(+f), c) : t;
  }, c.defined = function(f) {
    return arguments.length ? (r = typeof f == "function" ? f : qe(!!f), c) : r;
  }, c.curve = function(f) {
    return arguments.length ? (o = f, n != null && (l = o(n)), c) : o;
  }, c.context = function(f) {
    return arguments.length ? (f == null ? n = l = null : l = o(n = f), c) : n;
  }, c;
}
function Ku(e, t, r) {
  var n = null, o = qe(!0), l = null, s = oc, c = null, f = fb(d);
  e = typeof e == "function" ? e : e === void 0 ? vb : qe(+e), t = typeof t == "function" ? t : qe(t === void 0 ? 0 : +t), r = typeof r == "function" ? r : r === void 0 ? hb : qe(+r);
  function d(p) {
    var y, x, A, S = (p = Ah(p)).length, b, E = !1, k, C = new Array(S), j = new Array(S);
    for (l == null && (c = s(k = f())), y = 0; y <= S; ++y) {
      if (!(y < S && o(b = p[y], y, p)) === E)
        if (E = !E)
          x = y, c.areaStart(), c.lineStart();
        else {
          for (c.lineEnd(), c.lineStart(), A = y - 1; A >= x; --A)
            c.point(C[A], j[A]);
          c.lineEnd(), c.areaEnd();
        }
      E && (C[y] = +e(b, y, p), j[y] = +t(b, y, p), c.point(n ? +n(b, y, p) : C[y], r ? +r(b, y, p) : j[y]));
    }
    if (k) return c = null, k + "" || null;
  }
  function h() {
    return pb().defined(o).curve(s).context(l);
  }
  return d.x = function(p) {
    return arguments.length ? (e = typeof p == "function" ? p : qe(+p), n = null, d) : e;
  }, d.x0 = function(p) {
    return arguments.length ? (e = typeof p == "function" ? p : qe(+p), d) : e;
  }, d.x1 = function(p) {
    return arguments.length ? (n = p == null ? null : typeof p == "function" ? p : qe(+p), d) : n;
  }, d.y = function(p) {
    return arguments.length ? (t = typeof p == "function" ? p : qe(+p), r = null, d) : t;
  }, d.y0 = function(p) {
    return arguments.length ? (t = typeof p == "function" ? p : qe(+p), d) : t;
  }, d.y1 = function(p) {
    return arguments.length ? (r = p == null ? null : typeof p == "function" ? p : qe(+p), d) : r;
  }, d.lineX0 = d.lineY0 = function() {
    return h().x(e).y(t);
  }, d.lineY1 = function() {
    return h().x(e).y(r);
  }, d.lineX1 = function() {
    return h().x(n).y(t);
  }, d.defined = function(p) {
    return arguments.length ? (o = typeof p == "function" ? p : qe(!!p), d) : o;
  }, d.curve = function(p) {
    return arguments.length ? (s = p, l != null && (c = s(l)), d) : s;
  }, d.context = function(p) {
    return arguments.length ? (p == null ? l = c = null : c = s(l = p), d) : l;
  }, d;
}
class mb {
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
function dC(e) {
  return new mb(e, !0);
}
function vC(e) {
  return new mb(e, !1);
}
function ds() {
}
function vs(e, t, r) {
  e._context.bezierCurveTo(
    (2 * e._x0 + e._x1) / 3,
    (2 * e._y0 + e._y1) / 3,
    (e._x0 + 2 * e._x1) / 3,
    (e._y0 + 2 * e._y1) / 3,
    (e._x0 + 4 * e._x1 + t) / 6,
    (e._y0 + 4 * e._y1 + r) / 6
  );
}
function yb(e) {
  this._context = e;
}
yb.prototype = {
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
        vs(this, this._x1, this._y1);
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
        vs(this, e, t);
        break;
    }
    this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t;
  }
};
function hC(e) {
  return new yb(e);
}
function gb(e) {
  this._context = e;
}
gb.prototype = {
  areaStart: ds,
  areaEnd: ds,
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
        vs(this, e, t);
        break;
    }
    this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t;
  }
};
function pC(e) {
  return new gb(e);
}
function xb(e) {
  this._context = e;
}
xb.prototype = {
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
        vs(this, e, t);
        break;
    }
    this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t;
  }
};
function mC(e) {
  return new xb(e);
}
function wb(e) {
  this._context = e;
}
wb.prototype = {
  areaStart: ds,
  areaEnd: ds,
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
function yC(e) {
  return new wb(e);
}
function n0(e) {
  return e < 0 ? -1 : 1;
}
function i0(e, t, r) {
  var n = e._x1 - e._x0, o = t - e._x1, l = (e._y1 - e._y0) / (n || o < 0 && -0), s = (r - e._y1) / (o || n < 0 && -0), c = (l * o + s * n) / (n + o);
  return (n0(l) + n0(s)) * Math.min(Math.abs(l), Math.abs(s), 0.5 * Math.abs(c)) || 0;
}
function a0(e, t) {
  var r = e._x1 - e._x0;
  return r ? (3 * (e._y1 - e._y0) / r - t) / 2 : t;
}
function Kd(e, t, r) {
  var n = e._x0, o = e._y0, l = e._x1, s = e._y1, c = (l - n) / 3;
  e._context.bezierCurveTo(n + c, o + c * t, l - c, s - c * r, l, s);
}
function hs(e) {
  this._context = e;
}
hs.prototype = {
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
        Kd(this, this._t0, a0(this, this._t0));
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
          this._point = 3, Kd(this, a0(this, r = i0(this, e, t)), r);
          break;
        default:
          Kd(this, this._t0, r = i0(this, e, t));
          break;
      }
      this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t, this._t0 = r;
    }
  }
};
function bb(e) {
  this._context = new Sb(e);
}
(bb.prototype = Object.create(hs.prototype)).point = function(e, t) {
  hs.prototype.point.call(this, t, e);
};
function Sb(e) {
  this._context = e;
}
Sb.prototype = {
  moveTo: function(e, t) {
    this._context.moveTo(t, e);
  },
  closePath: function() {
    this._context.closePath();
  },
  lineTo: function(e, t) {
    this._context.lineTo(t, e);
  },
  bezierCurveTo: function(e, t, r, n, o, l) {
    this._context.bezierCurveTo(t, e, n, r, l, o);
  }
};
function gC(e) {
  return new hs(e);
}
function xC(e) {
  return new bb(e);
}
function Ab(e) {
  this._context = e;
}
Ab.prototype = {
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
        for (var n = o0(e), o = o0(t), l = 0, s = 1; s < r; ++l, ++s)
          this._context.bezierCurveTo(n[0][l], o[0][l], n[1][l], o[1][l], e[s], t[s]);
    (this._line || this._line !== 0 && r === 1) && this._context.closePath(), this._line = 1 - this._line, this._x = this._y = null;
  },
  point: function(e, t) {
    this._x.push(+e), this._y.push(+t);
  }
};
function o0(e) {
  var t, r = e.length - 1, n, o = new Array(r), l = new Array(r), s = new Array(r);
  for (o[0] = 0, l[0] = 2, s[0] = e[0] + 2 * e[1], t = 1; t < r - 1; ++t) o[t] = 1, l[t] = 4, s[t] = 4 * e[t] + 2 * e[t + 1];
  for (o[r - 1] = 2, l[r - 1] = 7, s[r - 1] = 8 * e[r - 1] + e[r], t = 1; t < r; ++t) n = o[t] / l[t - 1], l[t] -= n, s[t] -= n * s[t - 1];
  for (o[r - 1] = s[r - 1] / l[r - 1], t = r - 2; t >= 0; --t) o[t] = (s[t] - o[t + 1]) / l[t];
  for (l[r - 1] = (e[r] + o[r - 1]) / 2, t = 0; t < r - 1; ++t) l[t] = 2 * e[t + 1] - o[t + 1];
  return [o, l];
}
function wC(e) {
  return new Ab(e);
}
function lc(e, t) {
  this._context = e, this._t = t;
}
lc.prototype = {
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
function bC(e) {
  return new lc(e, 0.5);
}
function SC(e) {
  return new lc(e, 0);
}
function AC(e) {
  return new lc(e, 1);
}
function Di(e, t) {
  if ((s = e.length) > 1)
    for (var r = 1, n, o, l = e[t[0]], s, c = l.length; r < s; ++r)
      for (o = l, l = e[t[r]], n = 0; n < c; ++n)
        l[n][1] += l[n][0] = isNaN(o[n][1]) ? o[n][0] : o[n][1];
}
function Tv(e) {
  for (var t = e.length, r = new Array(t); --t >= 0; ) r[t] = t;
  return r;
}
function PC(e, t) {
  return e[t];
}
function EC(e) {
  const t = [];
  return t.key = e, t;
}
function OC() {
  var e = qe([]), t = Tv, r = Di, n = PC;
  function o(l) {
    var s = Array.from(e.apply(this, arguments), EC), c, f = s.length, d = -1, h;
    for (const p of l)
      for (c = 0, ++d; c < f; ++c)
        (s[c][d] = [0, +n(p, s[c].key, d, l)]).data = p;
    for (c = 0, h = Ah(t(s)); c < f; ++c)
      s[h[c]].index = c;
    return r(s, h), s;
  }
  return o.keys = function(l) {
    return arguments.length ? (e = typeof l == "function" ? l : qe(Array.from(l)), o) : e;
  }, o.value = function(l) {
    return arguments.length ? (n = typeof l == "function" ? l : qe(+l), o) : n;
  }, o.order = function(l) {
    return arguments.length ? (t = l == null ? Tv : typeof l == "function" ? l : qe(Array.from(l)), o) : t;
  }, o.offset = function(l) {
    return arguments.length ? (r = l ?? Di, o) : r;
  }, o;
}
function kC(e, t) {
  if ((n = e.length) > 0) {
    for (var r, n, o = 0, l = e[0].length, s; o < l; ++o) {
      for (s = r = 0; r < n; ++r) s += e[r][o][1] || 0;
      if (s) for (r = 0; r < n; ++r) e[r][o][1] /= s;
    }
    Di(e, t);
  }
}
function _C(e, t) {
  if ((o = e.length) > 0) {
    for (var r = 0, n = e[t[0]], o, l = n.length; r < l; ++r) {
      for (var s = 0, c = 0; s < o; ++s) c += e[s][r][1] || 0;
      n[r][1] += n[r][0] = -c / 2;
    }
    Di(e, t);
  }
}
function CC(e, t) {
  if (!(!((s = e.length) > 0) || !((l = (o = e[t[0]]).length) > 0))) {
    for (var r = 0, n = 1, o, l, s; n < l; ++n) {
      for (var c = 0, f = 0, d = 0; c < s; ++c) {
        for (var h = e[t[c]], p = h[n][1] || 0, y = h[n - 1][1] || 0, x = (p - y) / 2, A = 0; A < c; ++A) {
          var S = e[t[A]], b = S[n][1] || 0, E = S[n - 1][1] || 0;
          x += b - E;
        }
        f += p, d += x * p;
      }
      o[n - 1][1] += o[n - 1][0] = r, f && (r -= d / f);
    }
    o[n - 1][1] += o[n - 1][0] = r, Di(e, t);
  }
}
var Pb = (e) => "radius" in e && "startAngle" in e && "endAngle" in e, Ph = (e, t) => {
  if (!e || typeof e == "function" || typeof e == "boolean")
    return null;
  var r = e;
  if (/* @__PURE__ */ w.isValidElement(e) && (r = e.props), typeof r != "object" && typeof r != "function")
    return null;
  var n = {};
  return Object.keys(r).forEach((o) => {
    gh(o) && typeof r[o] == "function" && (n[o] = ((l) => r[o](r, l)));
  }), n;
}, IC = (e, t, r) => (n) => (e(t, r, n), null), jC = (e, t, r) => {
  if (e === null || typeof e != "object" && typeof e != "function")
    return null;
  var n = null;
  return Object.keys(e).forEach((o) => {
    var l = e[o];
    gh(o) && typeof l == "function" && (n || (n = {}), n[o] = IC(l, t, r));
  }), n;
};
function l0(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function TC(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? l0(Object(r), !0).forEach(function(n) {
      NC(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : l0(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function NC(e, t, r) {
  return (t = MC(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function MC(e) {
  var t = DC(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function DC(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function qt(e, t) {
  var r = TC({}, e), n = t, o = Object.keys(t), l = o.reduce((s, c) => (s[c] === void 0 && n[c] !== void 0 && (s[c] = n[c]), s), r);
  return l;
}
function $C(e, t) {
  const r = /* @__PURE__ */ new Map();
  for (let n = 0; n < e.length; n++) {
    const o = e[n], l = t(o, n, e);
    r.has(l) || r.set(l, o);
  }
  return Array.from(r.values());
}
function LC(e, t) {
  return function(...r) {
    return e.apply(this, r.slice(0, t));
  };
}
function Eb(e) {
  return e;
}
function RC(e) {
  return Number.isSafeInteger(e) && e >= 0;
}
function Eh(e) {
  return e != null && typeof e != "function" && RC(e.length);
}
function zC(e) {
  return function(t) {
    return Bi(t, e);
  };
}
function Ob(e) {
  return e == null || typeof e != "object" && typeof e != "function";
}
function BC(e) {
  return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
function Nv(e) {
  return Object.getOwnPropertySymbols(e).filter((t) => Object.prototype.propertyIsEnumerable.call(e, t));
}
function ja(e) {
  return e == null ? e === void 0 ? "[object Undefined]" : "[object Null]" : Object.prototype.toString.call(e);
}
const kb = "[object RegExp]", Oh = "[object String]", kh = "[object Number]", _h = "[object Boolean]", _b = "[object Arguments]", Cb = "[object Symbol]", Ib = "[object Date]", jb = "[object Map]", Tb = "[object Set]", Nb = "[object Array]", FC = "[object Function]", Mb = "[object ArrayBuffer]", ls = "[object Object]", WC = "[object Error]", Db = "[object DataView]", $b = "[object Uint8Array]", Lb = "[object Uint8ClampedArray]", Rb = "[object Uint16Array]", zb = "[object Uint32Array]", UC = "[object BigUint64Array]", Bb = "[object Int8Array]", Fb = "[object Int16Array]", Wb = "[object Int32Array]", HC = "[object BigInt64Array]", Ub = "[object Float32Array]", Hb = "[object Float64Array]", u0 = typeof globalThis == "object" && globalThis || typeof window == "object" && window || typeof self == "object" && self || typeof global == "object" && global || /* @__PURE__ */ (function() {
  return this;
})();
function Mv(e) {
  return typeof u0.Buffer < "u" && u0.Buffer.isBuffer(e);
}
function KC(e, t) {
  return Oi(e, void 0, e, /* @__PURE__ */ new Map(), t);
}
function Oi(e, t, r, n = /* @__PURE__ */ new Map(), o = void 0) {
  const l = o == null ? void 0 : o(e, t, r, n);
  if (l !== void 0) return l;
  if (Ob(e)) return e;
  if (n.has(e)) return n.get(e);
  if (Array.isArray(e)) {
    const s = new Array(e.length);
    n.set(e, s);
    for (let c = 0; c < e.length; c++) s[c] = Oi(e[c], c, r, n, o);
    return Object.hasOwn(e, "index") && (s.index = e.index), Object.hasOwn(e, "input") && (s.input = e.input), s;
  }
  if (e instanceof Date) return new Date(e.getTime());
  if (e instanceof RegExp) {
    const s = new RegExp(e.source, e.flags);
    return s.lastIndex = e.lastIndex, s;
  }
  if (e instanceof Map) {
    const s = /* @__PURE__ */ new Map();
    n.set(e, s);
    for (const [c, f] of e) s.set(c, Oi(f, c, r, n, o));
    return s;
  }
  if (e instanceof Set) {
    const s = /* @__PURE__ */ new Set();
    n.set(e, s);
    for (const c of e) s.add(Oi(c, void 0, r, n, o));
    return s;
  }
  if (Mv(e)) return e.subarray();
  if (BC(e)) {
    const s = new (Object.getPrototypeOf(e)).constructor(e.length);
    n.set(e, s);
    for (let c = 0; c < e.length; c++) s[c] = Oi(e[c], c, r, n, o);
    return s;
  }
  if (e instanceof ArrayBuffer || typeof SharedArrayBuffer < "u" && e instanceof SharedArrayBuffer) return e.slice(0);
  if (e instanceof DataView) {
    const s = new DataView(e.buffer.slice(0), e.byteOffset, e.byteLength);
    return n.set(e, s), jr(s, e, r, n, o), s;
  }
  if (typeof File < "u" && e instanceof File) {
    const s = new File([e], e.name, { type: e.type });
    return n.set(e, s), jr(s, e, r, n, o), s;
  }
  if (typeof Blob < "u" && e instanceof Blob) {
    const s = new Blob([e], { type: e.type });
    return n.set(e, s), jr(s, e, r, n, o), s;
  }
  if (e instanceof Error) {
    const s = structuredClone(e);
    return n.set(e, s), s.message = e.message, s.name = e.name, s.stack = e.stack, s.cause = e.cause, s.constructor = e.constructor, jr(s, e, r, n, o), s;
  }
  if (e instanceof Boolean) {
    const s = new Boolean(e.valueOf());
    return n.set(e, s), jr(s, e, r, n, o), s;
  }
  if (e instanceof Number) {
    const s = new Number(e.valueOf());
    return n.set(e, s), jr(s, e, r, n, o), s;
  }
  if (e instanceof String) {
    const s = new String(e.valueOf());
    return n.set(e, s), jr(s, e, r, n, o), s;
  }
  if (typeof e == "object" && VC(e)) {
    const s = Object.create(Object.getPrototypeOf(e));
    return n.set(e, s), jr(s, e, r, n, o), s;
  }
  return e;
}
function jr(e, t, r = e, n, o) {
  const l = [...Object.keys(t), ...Nv(t)];
  for (let s = 0; s < l.length; s++) {
    const c = l[s], f = Object.getOwnPropertyDescriptor(e, c);
    (f == null || f.writable) && (e[c] = Oi(t[c], c, r, n, o));
  }
}
function VC(e) {
  switch (ja(e)) {
    case _b:
    case Nb:
    case Mb:
    case Db:
    case _h:
    case Ib:
    case Ub:
    case Hb:
    case Bb:
    case Fb:
    case Wb:
    case jb:
    case kh:
    case ls:
    case kb:
    case Tb:
    case Oh:
    case Cb:
    case $b:
    case Lb:
    case Rb:
    case zb:
      return !0;
    default:
      return !1;
  }
}
function YC(e) {
  return Oi(e, void 0, e, /* @__PURE__ */ new Map(), void 0);
}
function Zo(e, t) {
  return e === t || Number.isNaN(e) && Number.isNaN(t);
}
function Kb(e) {
  return e !== null && (typeof e == "object" || typeof e == "function");
}
function Vb(e, t, r) {
  return typeof r != "function" ? Vb(e, t, () => {
  }) : Dv(e, t, function n(o, l, s, c, f, d) {
    const h = r(o, l, s, c, f, d);
    return h !== void 0 ? !!h : Dv(o, l, n, d, !1);
  }, /* @__PURE__ */ new Map(), !0);
}
function Dv(e, t, r, n, o = !1) {
  if (t === e) return !0;
  switch (typeof t) {
    case "object":
      return GC(e, t, r, n, o);
    case "function":
      return Object.keys(t).length > 0 ? Dv(e, { ...t }, r, n, o) : Zo(e, t);
    default:
      return Kb(e) && o ? typeof t == "string" ? t === "" : !0 : Zo(e, t);
  }
}
function GC(e, t, r, n, o = !1) {
  if (t == null) return !0;
  if (Array.isArray(t)) return Yb(e, t, r, n);
  if (t instanceof Map) return XC(e, t, r, n);
  if (t instanceof Set) return qC(e, t, r, n);
  const l = Object.keys(t);
  if (e == null) return o && l.length === 0;
  if (o)
    Ob(e) && (e = Object(e));
  else {
    const s = ja(e);
    if (s !== "[object Object]" && s !== "[object Arguments]") return !1;
  }
  if (l.length === 0) return !0;
  if (n != null && n.has(t)) return n.get(t) === e;
  n == null || n.set(t, e);
  try {
    for (let s = 0; s < l.length; s++) {
      const c = l[s];
      if (!(c in e) || t[c] === void 0 && e[c] !== void 0 || t[c] === null && e[c] !== null || !r(e[c], t[c], c, e, t, n)) return !1;
    }
    return !0;
  } finally {
    n == null || n.delete(t);
  }
}
function XC(e, t, r, n) {
  if (t.size === 0) return !0;
  if (!(e instanceof Map)) return !1;
  for (const [o, l] of t.entries()) if (r(e.get(o), l, o, e, t, n) === !1) return !1;
  return !0;
}
function Yb(e, t, r, n) {
  if (t.length === 0) return !0;
  if (!Array.isArray(e)) return !1;
  const o = /* @__PURE__ */ new Set();
  for (let l = 0; l < t.length; l++) {
    const s = t[l];
    let c = !1;
    for (let f = 0; f < e.length; f++) {
      if (o.has(f)) continue;
      const d = e[f];
      let h = !1;
      if (r(d, s, l, e, t, n) && (h = !0), h) {
        o.add(f), c = !0;
        break;
      }
    }
    if (!c) return !1;
  }
  return !0;
}
function qC(e, t, r, n) {
  return t.size === 0 ? !0 : e instanceof Set ? Yb([...e], [...t], r, n) : !1;
}
function Gb(e, t) {
  return Vb(e, t, () => {
  });
}
function QC(e) {
  return e = YC(e), (t) => Gb(t, e);
}
function ZC(e, t) {
  return KC(e, (r, n, o, l) => {
    if (typeof e == "object") {
      if (ja(e) === "[object Object]" && typeof e.constructor != "function") {
        const s = {};
        return l.set(e, s), jr(s, e, o, l), s;
      }
      switch (Object.prototype.toString.call(e)) {
        case kh:
        case Oh:
        case _h: {
          const s = new e.constructor(e == null ? void 0 : e.valueOf());
          return jr(s, e), s;
        }
        case _b: {
          const s = {};
          return jr(s, e), s.length = e.length, s[Symbol.iterator] = e[Symbol.iterator], s;
        }
        default:
          return;
      }
    }
  });
}
function JC(e) {
  return ZC(e);
}
const eI = /^(?:0|[1-9]\d*)$/;
function Xb(e, t = Number.MAX_SAFE_INTEGER) {
  switch (typeof e) {
    case "number":
      return Number.isInteger(e) && e >= 0 && e < t;
    case "symbol":
      return !1;
    case "string":
      return eI.test(e);
  }
}
function tI(e) {
  return e !== null && typeof e == "object" && ja(e) === "[object Arguments]";
}
function rI(e, t) {
  let r;
  if (Array.isArray(t) ? r = t : typeof t == "string" && ob(t) && !(t in Object(e)) ? r = wh(t) : r = [t], r.length === 0) return !1;
  let n = e;
  for (let o = 0; o < r.length; o++) {
    const l = ac(r[o]);
    if ((n == null || !Object.hasOwn(n, l)) && !((Array.isArray(n) || tI(n)) && Xb(l) && Number(l) < n.length))
      return !1;
    n = n[l];
  }
  return !0;
}
function nI(e, t) {
  switch (typeof e) {
    case "object":
      Object.is(e == null ? void 0 : e.valueOf(), -0) && (e = "-0");
      break;
    case "number":
      e = ac(e);
      break;
  }
  return t = JC(t), function(r) {
    const n = Bi(r, e);
    return n === void 0 ? rI(r, e) : t === void 0 ? n === void 0 : Gb(n, t);
  };
}
function iI(e) {
  if (e == null) return Eb;
  switch (typeof e) {
    case "function":
      return e;
    case "object":
      return Array.isArray(e) && e.length === 2 ? nI(e[0], e[1]) : QC(e);
    default:
      return zC(e);
  }
}
function aI(e) {
  return e === 0 ? 0 : e;
}
function s0(e, t = Eb) {
  return Eh(e) ? $C(Array.from(e), LC(iI(t), 1)).map(aI) : [];
}
function oI(e, t, r) {
  return t === !0 ? s0(e, r) : typeof t == "function" ? s0(e, t) : e;
}
var Vd = { exports: {} }, Yd = {}, Gd = { exports: {} }, Xd = {};
/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var c0;
function lI() {
  if (c0) return Xd;
  c0 = 1;
  var e = Ba();
  function t(p, y) {
    return p === y && (p !== 0 || 1 / p === 1 / y) || p !== p && y !== y;
  }
  var r = typeof Object.is == "function" ? Object.is : t, n = e.useState, o = e.useEffect, l = e.useLayoutEffect, s = e.useDebugValue;
  function c(p, y) {
    var x = y(), A = n({ inst: { value: x, getSnapshot: y } }), S = A[0].inst, b = A[1];
    return l(
      function() {
        S.value = x, S.getSnapshot = y, f(S) && b({ inst: S });
      },
      [p, x, y]
    ), o(
      function() {
        return f(S) && b({ inst: S }), p(function() {
          f(S) && b({ inst: S });
        });
      },
      [p]
    ), s(x), x;
  }
  function f(p) {
    var y = p.getSnapshot;
    p = p.value;
    try {
      var x = y();
      return !r(p, x);
    } catch {
      return !0;
    }
  }
  function d(p, y) {
    return y();
  }
  var h = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? d : c;
  return Xd.useSyncExternalStore = e.useSyncExternalStore !== void 0 ? e.useSyncExternalStore : h, Xd;
}
var f0;
function uI() {
  return f0 || (f0 = 1, Gd.exports = lI()), Gd.exports;
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
var d0;
function sI() {
  if (d0) return Yd;
  d0 = 1;
  var e = Ba(), t = uI();
  function r(d, h) {
    return d === h && (d !== 0 || 1 / d === 1 / h) || d !== d && h !== h;
  }
  var n = typeof Object.is == "function" ? Object.is : r, o = t.useSyncExternalStore, l = e.useRef, s = e.useEffect, c = e.useMemo, f = e.useDebugValue;
  return Yd.useSyncExternalStoreWithSelector = function(d, h, p, y, x) {
    var A = l(null);
    if (A.current === null) {
      var S = { hasValue: !1, value: null };
      A.current = S;
    } else S = A.current;
    A = c(
      function() {
        function E(O) {
          if (!k) {
            if (k = !0, C = O, O = y(O), x !== void 0 && S.hasValue) {
              var _ = S.value;
              if (x(_, O))
                return j = _;
            }
            return j = O;
          }
          if (_ = j, n(C, O)) return _;
          var F = y(O);
          return x !== void 0 && x(_, F) ? (C = O, _) : (C = O, j = F);
        }
        var k = !1, C, j, T = p === void 0 ? null : p;
        return [
          function() {
            return E(h());
          },
          T === null ? void 0 : function() {
            return E(T());
          }
        ];
      },
      [h, p, y, x]
    );
    var b = o(d, A[0], A[1]);
    return s(
      function() {
        S.hasValue = !0, S.value = b;
      },
      [b]
    ), f(b), b;
  }, Yd;
}
var v0;
function cI() {
  return v0 || (v0 = 1, Vd.exports = sI()), Vd.exports;
}
var fI = cI(), Ch = /* @__PURE__ */ w.createContext(null), dI = (e) => e, rt = () => {
  var e = w.useContext(Ch);
  return e ? e.store.dispatch : dI;
}, us = () => {
}, vI = () => us, hI = (e, t) => e === t;
function he(e) {
  var t = w.useContext(Ch), r = w.useMemo(() => t ? (n) => {
    if (n != null)
      return e(n);
  } : us, [t, e]);
  return fI.useSyncExternalStoreWithSelector(t ? t.subscription.addNestedSub : vI, t ? t.store.getState : us, t ? t.store.getState : us, r, hI);
}
function pI(e, t = `expected a function, instead received ${typeof e}`) {
  if (typeof e != "function")
    throw new TypeError(t);
}
function mI(e, t = "expected all items to be functions, instead received the following types: ") {
  if (!e.every((r) => typeof r == "function")) {
    const r = e.map(
      (n) => typeof n == "function" ? `function ${n.name || "unnamed"}()` : typeof n
    ).join(", ");
    throw new TypeError(`${t}[${r}]`);
  }
}
var h0 = (e) => Array.isArray(e) ? e : [e];
function yI(e) {
  const t = Array.isArray(e[0]) ? e[0] : e;
  return mI(
    t,
    "createSelector expects all input-selectors to be functions, but received the following types: "
  ), t;
}
function gI(e, t) {
  const r = [], { length: n } = e;
  for (let o = 0; o < n; o++)
    r.push(e[o].apply(null, t));
  return r;
}
var xI = class {
  constructor(e) {
    this.value = e;
  }
  deref() {
    return this.value;
  }
}, wI = () => typeof WeakRef > "u" ? xI : WeakRef, qb = /* @__PURE__ */ wI(), bI = 0, p0 = 1;
function Vu() {
  return {
    s: bI,
    v: void 0,
    o: null,
    p: null
  };
}
function SI(e) {
  return e instanceof qb ? e.deref() : e;
}
function Qb(e, t = {}) {
  let r = Vu();
  const { resultEqualityCheck: n } = t;
  let o, l = 0;
  function s() {
    let c = r;
    const { length: f } = arguments;
    for (let p = 0, y = f; p < y; p++) {
      const x = arguments[p];
      if (typeof x == "function" || typeof x == "object" && x !== null) {
        let A = c.o;
        A === null && (c.o = A = /* @__PURE__ */ new WeakMap());
        const S = A.get(x);
        S === void 0 ? (c = Vu(), A.set(x, c)) : c = S;
      } else {
        let A = c.p;
        A === null && (c.p = A = /* @__PURE__ */ new Map());
        const S = A.get(x);
        S === void 0 ? (c = Vu(), A.set(x, c)) : c = S;
      }
    }
    const d = c;
    let h;
    if (c.s === p0)
      h = c.v;
    else if (h = e.apply(null, arguments), l++, n) {
      const p = SI(o);
      p != null && n(p, h) && (h = p, l !== 0 && l--), o = typeof h == "object" && h !== null || typeof h == "function" ? /* @__PURE__ */ new qb(h) : h;
    }
    return d.s = p0, d.v = h, h;
  }
  return s.clearCache = () => {
    r = Vu(), s.resetResultsCount();
  }, s.resultsCount = () => l, s.resetResultsCount = () => {
    l = 0;
  }, s;
}
function AI(e, ...t) {
  const r = typeof e == "function" ? {
    memoize: e,
    memoizeOptions: t
  } : e, n = (...o) => {
    let l = 0, s = 0, c, f = {}, d = o.pop();
    typeof d == "object" && (f = d, d = o.pop()), pI(
      d,
      `createSelector expects an output function after the inputs, but received: [${typeof d}]`
    );
    const h = {
      ...r,
      ...f
    }, {
      memoize: p,
      memoizeOptions: y = [],
      argsMemoize: x = Qb,
      argsMemoizeOptions: A = []
    } = h, S = h0(y), b = h0(A), E = yI(o), k = p(function() {
      return l++, d.apply(
        null,
        arguments
      );
    }, ...S), C = x(function() {
      s++;
      const T = gI(
        E,
        arguments
      );
      return c = k.apply(null, T), c;
    }, ...b);
    return Object.assign(C, {
      resultFunc: d,
      memoizedResultFunc: k,
      dependencies: E,
      dependencyRecomputations: () => s,
      resetDependencyRecomputations: () => {
        s = 0;
      },
      lastResult: () => c,
      recomputations: () => l,
      resetRecomputations: () => {
        l = 0;
      },
      memoize: p,
      argsMemoize: x
    });
  };
  return Object.assign(n, {
    withTypes: () => n
  }), n;
}
var z = /* @__PURE__ */ AI(Qb);
function PI(e, t = 1) {
  const r = [], n = Math.floor(t), o = (l, s) => {
    for (let c = 0; c < l.length; c++) {
      const f = l[c];
      Array.isArray(f) && s < n ? o(f, s + 1) : r.push(f);
    }
  };
  return o(e, 0), r;
}
function $v(e, t, r) {
  return Kb(r) && (typeof t == "number" && Eh(r) && Xb(t) && t < r.length || typeof t == "string" && t in r) ? Zo(r[t], e) : !1;
}
function m0(e) {
  return typeof e == "symbol" ? 1 : e === null ? 2 : e === void 0 ? 3 : e !== e ? 4 : 0;
}
const EI = (e, t, r) => {
  if (e !== t) {
    const n = m0(e), o = m0(t);
    if (n === o && n === 0) {
      if (e < t) return r === "desc" ? 1 : -1;
      if (e > t) return r === "desc" ? -1 : 1;
    }
    return r === "desc" ? o - n : n - o;
  }
  return 0;
}, OI = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, kI = /^\w*$/;
function _I(e, t) {
  return Array.isArray(e) ? !1 : typeof e == "number" || typeof e == "boolean" || e == null || xh(e) ? !0 : typeof e == "string" && (kI.test(e) || !OI.test(e)) || t != null;
}
function CI(e, t, r, n) {
  if (e == null) return [];
  r = r, Array.isArray(e) || (e = Eh(e) ? Array.from(e) : Object.values(e)), Array.isArray(t) || (t = t == null ? [null] : [t]), t.length === 0 && (t = [null]), Array.isArray(r) || (r = r == null ? [] : [r]), r = r.map((c) => String(c));
  const o = (c, f) => {
    let d = c, h = 0;
    for (; h < f.length && d != null; ++h) d = d[f[h]];
    return h > 0 && h === f.length ? d : void 0;
  }, l = (c, f) => {
    if (c == null) return f;
    if (f != null)
      return typeof c == "object" && "key" in c ? Object.hasOwn(f, c.key) ? f[c.key] : o(f, c.path) : typeof c == "function" ? c(f) : Array.isArray(c) ? o(f, c) : f[c];
  }, s = t.map((c) => (Array.isArray(c) && c.length === 1 && (c = c[0]), c == null || typeof c == "function" || Array.isArray(c) || _I(c) ? c : {
    key: c,
    path: wh(c)
  }));
  return e.map((c) => ({
    original: c,
    criteria: s.map((f) => l(f, c))
  })).slice().sort((c, f) => {
    for (let d = 0; d < s.length; d++) {
      const h = EI(c.criteria[d], f.criteria[d], r[d]);
      if (h !== 0) return h;
    }
    return 0;
  }).map((c) => c.original);
}
function uc(e, ...t) {
  const r = t.length;
  return r > 1 && $v(e, t[0], t[1]) ? t = [] : r > 2 && $v(t[0], t[1], t[2]) && (t = [t[0]]), CI(e, PI(t), ["asc"]);
}
var Zb = (e) => e.legend.settings, II = (e) => e.legend.size, jI = (e) => e.legend.payload;
z([jI, Zb], (e, t) => {
  var r = t.itemSorter, n = e.flat(1);
  return r ? uc(n, r) : n;
});
function TI(e, t) {
  return $I(e) || DI(e, t) || MI(e, t) || NI();
}
function NI() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function MI(e, t) {
  if (e) {
    if (typeof e == "string") return y0(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? y0(e, t) : void 0;
  }
}
function y0(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function DI(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, o, l, s, c = [], f = !0, d = !1;
    try {
      if (l = (r = r.call(e)).next, t !== 0) for (; !(f = (n = l.call(r)).done) && (c.push(n.value), c.length !== t); f = !0) ;
    } catch (h) {
      d = !0, o = h;
    } finally {
      try {
        if (!f && r.return != null && (s = r.return(), Object(s) !== s)) return;
      } finally {
        if (d) throw o;
      }
    }
    return c;
  }
}
function $I(e) {
  if (Array.isArray(e)) return e;
}
var Yu = 1;
function g0(e, t) {
  return Math.abs(e.height - t.height) > Yu || Math.abs(e.left - t.left) > Yu || Math.abs(e.top - t.top) > Yu || Math.abs(e.width - t.width) > Yu;
}
function x0(e) {
  var t = e.getBoundingClientRect();
  return {
    height: t.height,
    left: t.left,
    top: t.top,
    width: t.width
  };
}
function LI() {
  var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [], t = w.useState({
    height: 0,
    left: 0,
    top: 0,
    width: 0
  }), r = TI(t, 2), n = r[0], o = r[1], l = w.useRef(null), s = w.useRef(n);
  s.current = n;
  var c = w.useCallback(
    (f) => {
      if (l.current != null && (l.current.disconnect(), l.current = null), f != null) {
        var d = x0(f);
        if (g0(d, s.current) && o(d), typeof ResizeObserver < "u") {
          var h = new ResizeObserver(() => {
            var p = x0(f);
            g0(p, s.current) && o(p);
          });
          h.observe(f), l.current = h;
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...e]
  );
  return w.useEffect(() => () => {
    var f;
    (f = l.current) === null || f === void 0 || f.disconnect();
  }, []), [n, c];
}
function bt(e) {
  return `Minified Redux error #${e}; visit https://redux.js.org/Errors?code=${e} for the full message or use the non-minified dev environment for full errors. `;
}
var RI = typeof Symbol == "function" && Symbol.observable || "@@observable", w0 = RI, qd = () => Math.random().toString(36).substring(7).split("").join("."), zI = {
  INIT: `@@redux/INIT${/* @__PURE__ */ qd()}`,
  REPLACE: `@@redux/REPLACE${/* @__PURE__ */ qd()}`,
  PROBE_UNKNOWN_ACTION: () => `@@redux/PROBE_UNKNOWN_ACTION${qd()}`
}, ps = zI;
function Ih(e) {
  if (typeof e != "object" || e === null)
    return !1;
  let t = e;
  for (; Object.getPrototypeOf(t) !== null; )
    t = Object.getPrototypeOf(t);
  return Object.getPrototypeOf(e) === t || Object.getPrototypeOf(e) === null;
}
function Jb(e, t, r) {
  if (typeof e != "function")
    throw new Error(bt(2));
  if (typeof t == "function" && typeof r == "function" || typeof r == "function" && typeof arguments[3] == "function")
    throw new Error(bt(0));
  if (typeof t == "function" && typeof r > "u" && (r = t, t = void 0), typeof r < "u") {
    if (typeof r != "function")
      throw new Error(bt(1));
    return r(Jb)(e, t);
  }
  let n = e, o = t, l = /* @__PURE__ */ new Map(), s = l, c = 0, f = !1;
  function d() {
    s === l && (s = /* @__PURE__ */ new Map(), l.forEach((b, E) => {
      s.set(E, b);
    }));
  }
  function h() {
    if (f)
      throw new Error(bt(3));
    return o;
  }
  function p(b) {
    if (typeof b != "function")
      throw new Error(bt(4));
    if (f)
      throw new Error(bt(5));
    let E = !0;
    d();
    const k = c++;
    return s.set(k, b), function() {
      if (E) {
        if (f)
          throw new Error(bt(6));
        E = !1, d(), s.delete(k), l = null;
      }
    };
  }
  function y(b) {
    if (!Ih(b))
      throw new Error(bt(7));
    if (typeof b.type > "u")
      throw new Error(bt(8));
    if (typeof b.type != "string")
      throw new Error(bt(17));
    if (f)
      throw new Error(bt(9));
    try {
      f = !0, o = n(o, b);
    } finally {
      f = !1;
    }
    return (l = s).forEach((k) => {
      k();
    }), b;
  }
  function x(b) {
    if (typeof b != "function")
      throw new Error(bt(10));
    n = b, y({
      type: ps.REPLACE
    });
  }
  function A() {
    const b = p;
    return {
      /**
       * The minimal observable subscription method.
       * @param observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe(E) {
        if (typeof E != "object" || E === null)
          throw new Error(bt(11));
        function k() {
          const j = E;
          j.next && j.next(h());
        }
        return k(), {
          unsubscribe: b(k)
        };
      },
      [w0]() {
        return this;
      }
    };
  }
  return y({
    type: ps.INIT
  }), {
    dispatch: y,
    subscribe: p,
    getState: h,
    replaceReducer: x,
    [w0]: A
  };
}
function BI(e) {
  Object.keys(e).forEach((t) => {
    const r = e[t];
    if (typeof r(void 0, {
      type: ps.INIT
    }) > "u")
      throw new Error(bt(12));
    if (typeof r(void 0, {
      type: ps.PROBE_UNKNOWN_ACTION()
    }) > "u")
      throw new Error(bt(13));
  });
}
function eS(e) {
  const t = Object.keys(e), r = {};
  for (let l = 0; l < t.length; l++) {
    const s = t[l];
    typeof e[s] == "function" && (r[s] = e[s]);
  }
  const n = Object.keys(r);
  let o;
  try {
    BI(r);
  } catch (l) {
    o = l;
  }
  return function(s = {}, c) {
    if (o)
      throw o;
    let f = !1;
    const d = {};
    for (let h = 0; h < n.length; h++) {
      const p = n[h], y = r[p], x = s[p], A = y(x, c);
      if (typeof A > "u")
        throw c && c.type, new Error(bt(14));
      d[p] = A, f = f || A !== x;
    }
    return f = f || n.length !== Object.keys(s).length, f ? d : s;
  };
}
function ms(...e) {
  return e.length === 0 ? (t) => t : e.length === 1 ? e[0] : e.reduce((t, r) => (...n) => t(r(...n)));
}
function FI(...e) {
  return (t) => (r, n) => {
    const o = t(r, n);
    let l = () => {
      throw new Error(bt(15));
    };
    const s = {
      getState: o.getState,
      dispatch: (f, ...d) => l(f, ...d)
    }, c = e.map((f) => f(s));
    return l = ms(...c)(o.dispatch), {
      ...o,
      dispatch: l
    };
  };
}
function tS(e) {
  return Ih(e) && "type" in e && typeof e.type == "string";
}
var rS = Symbol.for("immer-nothing"), b0 = Symbol.for("immer-draftable"), Mt = Symbol.for("immer-state");
function Nr(e, ...t) {
  throw new Error(
    `[Immer] minified error nr: ${e}. Full error at: https://bit.ly/3cXEKWf`
  );
}
var nr = Object, Ta = nr.getPrototypeOf, ys = "constructor", sc = "prototype", Lv = "configurable", gs = "enumerable", ss = "writable", al = "value", wn = (e) => !!e && !!e[Mt];
function xr(e) {
  var t;
  return e ? nS(e) || fc(e) || !!e[b0] || !!((t = e[ys]) != null && t[b0]) || dc(e) || vc(e) : !1;
}
var WI = nr[sc][ys].toString(), S0 = /* @__PURE__ */ new WeakMap();
function nS(e) {
  if (!e || !jh(e))
    return !1;
  const t = Ta(e);
  if (t === null || t === nr[sc])
    return !0;
  const r = nr.hasOwnProperty.call(t, ys) && t[ys];
  if (r === Object)
    return !0;
  if (!Pa(r))
    return !1;
  let n = S0.get(r);
  return n === void 0 && (n = Function.toString.call(r), S0.set(r, n)), n === WI;
}
function cc(e, t, r = !0) {
  yl(e) === 0 ? (r ? Reflect.ownKeys(e) : nr.keys(e)).forEach((o) => {
    t(o, e[o], e);
  }) : e.forEach((n, o) => t(o, n, e));
}
function yl(e) {
  const t = e[Mt];
  return t ? t.type_ : fc(e) ? 1 : dc(e) ? 2 : vc(e) ? 3 : 0;
}
var Qd = (e, t, r = yl(e)) => r === 2 ? e.has(t) : nr[sc].hasOwnProperty.call(e, t), Rv = (e, t, r = yl(e)) => (
  // @ts-ignore
  r === 2 ? e.get(t) : e[t]
), xs = (e, t, r, n = yl(e)) => {
  n === 2 ? e.set(t, r) : n === 3 ? e.add(r) : e[t] = r;
};
function UI(e, t) {
  return e === t ? e !== 0 || 1 / e === 1 / t : e !== e && t !== t;
}
var fc = Array.isArray, dc = (e) => e instanceof Map, vc = (e) => e instanceof Set, jh = (e) => typeof e == "object", Pa = (e) => typeof e == "function", Zd = (e) => typeof e == "boolean";
function HI(e) {
  const t = +e;
  return Number.isInteger(t) && String(t) === e;
}
var dn = (e) => e.copy_ || e.base_, Th = (e) => e.modified_ ? e.copy_ : e.base_;
function zv(e, t) {
  if (dc(e))
    return new Map(e);
  if (vc(e))
    return new Set(e);
  if (fc(e))
    return Array[sc].slice.call(e);
  const r = nS(e);
  if (t === !0 || t === "class_only" && !r) {
    const n = nr.getOwnPropertyDescriptors(e);
    delete n[Mt];
    let o = Reflect.ownKeys(n);
    for (let l = 0; l < o.length; l++) {
      const s = o[l], c = n[s];
      c[ss] === !1 && (c[ss] = !0, c[Lv] = !0), (c.get || c.set) && (n[s] = {
        [Lv]: !0,
        [ss]: !0,
        // could live with !!desc.set as well here...
        [gs]: c[gs],
        [al]: e[s]
      });
    }
    return nr.create(Ta(e), n);
  } else {
    const n = Ta(e);
    if (n !== null && r)
      return { ...e };
    const o = nr.create(n);
    return nr.assign(o, e);
  }
}
function Nh(e, t = !1) {
  return hc(e) || wn(e) || !xr(e) || (yl(e) > 1 && nr.defineProperties(e, {
    set: Gu,
    add: Gu,
    clear: Gu,
    delete: Gu
  }), nr.freeze(e), t && cc(
    e,
    (r, n) => {
      Nh(n, !0);
    },
    !1
  )), e;
}
function KI() {
  Nr(2);
}
var Gu = {
  [al]: KI
};
function hc(e) {
  return e === null || !jh(e) ? !0 : nr.isFrozen(e);
}
var ws = "MapSet", Bv = "Patches", A0 = "ArrayMethods", iS = {};
function $i(e) {
  const t = iS[e];
  return t || Nr(0, e), t;
}
var P0 = (e) => !!iS[e], ol, aS = () => ol, VI = (e, t) => ({
  drafts_: [],
  parent_: e,
  immer_: t,
  // Whenever the modified draft contains a draft from another scope, we
  // need to prevent auto-freezing so the unowned draft can be finalized.
  canAutoFreeze_: !0,
  unfinalizedDrafts_: 0,
  handledSet_: /* @__PURE__ */ new Set(),
  processedForPatches_: /* @__PURE__ */ new Set(),
  mapSetPlugin_: P0(ws) ? $i(ws) : void 0,
  arrayMethodsPlugin_: P0(A0) ? $i(A0) : void 0
});
function E0(e, t) {
  t && (e.patchPlugin_ = $i(Bv), e.patches_ = [], e.inversePatches_ = [], e.patchListener_ = t);
}
function Fv(e) {
  Wv(e), e.drafts_.forEach(YI), e.drafts_ = null;
}
function Wv(e) {
  e === ol && (ol = e.parent_);
}
var O0 = (e) => ol = VI(ol, e);
function YI(e) {
  const t = e[Mt];
  t.type_ === 0 || t.type_ === 1 ? t.revoke_() : t.revoked_ = !0;
}
function k0(e, t) {
  t.unfinalizedDrafts_ = t.drafts_.length;
  const r = t.drafts_[0];
  if (e !== void 0 && e !== r) {
    r[Mt].modified_ && (Fv(t), Nr(4)), xr(e) && (e = _0(t, e));
    const { patchPlugin_: o } = t;
    o && o.generateReplacementPatches_(
      r[Mt].base_,
      e,
      t
    );
  } else
    e = _0(t, r);
  return GI(t, e, !0), Fv(t), t.patches_ && t.patchListener_(t.patches_, t.inversePatches_), e !== rS ? e : void 0;
}
function _0(e, t) {
  if (hc(t))
    return t;
  const r = t[Mt];
  if (!r)
    return bs(t, e.handledSet_, e);
  if (!pc(r, e))
    return t;
  if (!r.modified_)
    return r.base_;
  if (!r.finalized_) {
    const { callbacks_: n } = r;
    if (n)
      for (; n.length > 0; )
        n.pop()(e);
    uS(r, e);
  }
  return r.copy_;
}
function GI(e, t, r = !1) {
  !e.parent_ && e.immer_.autoFreeze_ && e.canAutoFreeze_ && Nh(t, r);
}
function oS(e) {
  e.finalized_ = !0, e.scope_.unfinalizedDrafts_--;
}
var pc = (e, t) => e.scope_ === t, XI = [];
function lS(e, t, r, n) {
  const o = dn(e), l = e.type_;
  if (n !== void 0 && Rv(o, n, l) === t) {
    xs(o, n, r, l);
    return;
  }
  if (!e.draftLocations_) {
    const c = e.draftLocations_ = /* @__PURE__ */ new Map();
    cc(o, (f, d) => {
      if (wn(d)) {
        const h = c.get(d) || [];
        h.push(f), c.set(d, h);
      }
    });
  }
  const s = e.draftLocations_.get(t) ?? XI;
  for (const c of s)
    xs(o, c, r, l);
}
function qI(e, t, r) {
  e.callbacks_.push(function(o) {
    var c;
    const l = t;
    if (!l || !pc(l, o))
      return;
    (c = o.mapSetPlugin_) == null || c.fixSetContents(l);
    const s = Th(l);
    lS(e, l.draft_ ?? l, s, r), uS(l, o);
  });
}
function uS(e, t) {
  var n;
  if (e.modified_ && !e.finalized_ && (e.type_ === 3 || e.type_ === 1 && e.allIndicesReassigned_ || (((n = e.assigned_) == null ? void 0 : n.size) ?? 0) > 0)) {
    const { patchPlugin_: o } = t;
    if (o) {
      const l = o.getPath(e);
      l && o.generatePatches_(e, l, t);
    }
    oS(e);
  }
}
function QI(e, t, r) {
  const { scope_: n } = e;
  if (wn(r)) {
    const o = r[Mt];
    pc(o, n) && o.callbacks_.push(function() {
      cs(e);
      const s = Th(o);
      lS(e, r, s, t);
    });
  } else xr(r) && e.callbacks_.push(function() {
    const l = dn(e);
    e.type_ === 3 ? l.has(r) && bs(r, n.handledSet_, n) : Rv(l, t, e.type_) === r && n.drafts_.length > 1 && (e.assigned_.get(t) ?? !1) === !0 && e.copy_ && bs(
      Rv(e.copy_, t, e.type_),
      n.handledSet_,
      n
    );
  });
}
function bs(e, t, r) {
  return !r.immer_.autoFreeze_ && r.unfinalizedDrafts_ < 1 || wn(e) || t.has(e) || !xr(e) || hc(e) || (t.add(e), cc(e, (n, o) => {
    if (wn(o)) {
      const l = o[Mt];
      if (pc(l, r)) {
        const s = Th(l);
        xs(e, n, s, e.type_), oS(l);
      }
    } else xr(o) && bs(o, t, r);
  })), e;
}
function ZI(e, t) {
  const r = fc(e), n = {
    type_: r ? 1 : 0,
    // Track which produce call this is associated with.
    scope_: t ? t.scope_ : aS(),
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
  let o = n, l = Ss;
  r && (o = [n], l = ll);
  const { revoke: s, proxy: c } = Proxy.revocable(o, l);
  return n.draft_ = c, n.revoke_ = s, [c, n];
}
var Ss = {
  get(e, t) {
    if (t === Mt)
      return e;
    let r = e.scope_.arrayMethodsPlugin_;
    const n = e.type_ === 1 && typeof t == "string";
    if (n && r != null && r.isArrayOperationMethod(t))
      return r.createMethodInterceptor(e, t);
    const o = dn(e);
    if (!Qd(o, t, e.type_))
      return ej(e, o, t);
    const l = o[t];
    if (e.finalized_ || !xr(l) || n && e.operationMethod && (r != null && r.isMutatingArrayMethod(
      e.operationMethod
    )) && HI(t))
      return l;
    if (l === Jd(e.base_, t) || JI(e, t, l)) {
      cs(e);
      const s = e.type_ === 1 ? +t : t, c = Hv(e.scope_, l, e, s);
      return e.copy_[s] = c;
    }
    return l;
  },
  has(e, t) {
    return t in dn(e);
  },
  ownKeys(e) {
    return Reflect.ownKeys(dn(e));
  },
  set(e, t, r) {
    const n = sS(dn(e), t);
    if (n != null && n.set)
      return n.set.call(e.draft_, r), !0;
    if (!e.modified_) {
      const o = Jd(dn(e), t), l = o == null ? void 0 : o[Mt];
      if (l && l.base_ === r)
        return e.copy_[t] = r, e.assigned_.set(t, !1), !0;
      if (UI(r, o) && (r !== void 0 || Qd(e.base_, t, e.type_)))
        return !0;
      cs(e), Uv(e);
    }
    return e.copy_[t] === r && // special case: handle new props with value 'undefined'
    (r !== void 0 || Qd(e.copy_, t, e.type_)) || // special case: NaN
    Number.isNaN(r) && Number.isNaN(e.copy_[t]) || (e.copy_[t] = r, e.assigned_.set(t, !0), QI(e, t, r)), !0;
  },
  deleteProperty(e, t) {
    return cs(e), Jd(e.base_, t) !== void 0 || t in e.base_ ? (e.assigned_.set(t, !1), Uv(e)) : e.assigned_.delete(t), e.copy_ && delete e.copy_[t], !0;
  },
  // Note: We never coerce `desc.value` into an Immer draft, because we can't make
  // the same guarantee in ES5 mode.
  getOwnPropertyDescriptor(e, t) {
    const r = dn(e), n = Reflect.getOwnPropertyDescriptor(r, t);
    return n && {
      [ss]: !0,
      [Lv]: e.type_ !== 1 || t !== "length",
      [gs]: n[gs],
      [al]: r[t]
    };
  },
  defineProperty() {
    Nr(11);
  },
  getPrototypeOf(e) {
    return Ta(e.base_);
  },
  setPrototypeOf() {
    Nr(12);
  }
}, ll = {};
for (let e in Ss) {
  let t = Ss[e];
  ll[e] = function() {
    const r = arguments;
    return r[0] = r[0][0], t.apply(this, r);
  };
}
ll.deleteProperty = function(e, t) {
  return ll.set.call(this, e, t, void 0);
};
ll.set = function(e, t, r) {
  return Ss.set.call(this, e[0], t, r, e[0]);
};
function Jd(e, t) {
  const r = e[Mt];
  return (r ? dn(r) : e)[t];
}
function JI(e, t, r) {
  var n;
  return e.type_ !== 1 || !e.allIndicesReassigned_ || (n = e.assigned_) != null && n.get(t) || !xr(r) || r[Mt] ? !1 : e.baseRefs_.has(r);
}
function ej(e, t, r) {
  var o;
  const n = sS(t, r);
  return n ? al in n ? n[al] : (
    // This is a very special case, if the prop is a getter defined by the
    // prototype, we should invoke it with the draft as context!
    (o = n.get) == null ? void 0 : o.call(e.draft_)
  ) : void 0;
}
function sS(e, t) {
  if (!(t in e))
    return;
  let r = Ta(e);
  for (; r; ) {
    const n = Object.getOwnPropertyDescriptor(r, t);
    if (n)
      return n;
    r = Ta(r);
  }
}
function Uv(e) {
  e.modified_ || (e.modified_ = !0, e.parent_ && Uv(e.parent_));
}
function cs(e) {
  e.copy_ || (e.assigned_ = /* @__PURE__ */ new Map(), e.copy_ = zv(
    e.base_,
    e.scope_.immer_.useStrictShallowCopy_
  ));
}
var tj = class {
  constructor(e) {
    this.autoFreeze_ = !0, this.useStrictShallowCopy_ = !1, this.useStrictIteration_ = !1, this.produce = (t, r, n) => {
      if (Pa(t) && !Pa(r)) {
        const l = r;
        r = t;
        const s = this;
        return function(f = l, ...d) {
          return s.produce(f, (h) => r.call(this, h, ...d));
        };
      }
      Pa(r) || Nr(6), n !== void 0 && !Pa(n) && Nr(7);
      let o;
      if (xr(t)) {
        const l = O0(this), s = Hv(l, t, void 0);
        let c = !0;
        try {
          o = r(s), c = !1;
        } finally {
          c ? Fv(l) : Wv(l);
        }
        return E0(l, n), k0(o, l);
      } else if (!t || !jh(t)) {
        if (o = r(t), o === void 0 && (o = t), o === rS && (o = void 0), this.autoFreeze_ && Nh(o, !0), n) {
          const l = [], s = [];
          $i(Bv).generateReplacementPatches_(t, o, {
            patches_: l,
            inversePatches_: s
          }), n(l, s);
        }
        return o;
      } else
        Nr(1, t);
    }, this.produceWithPatches = (t, r) => {
      if (Pa(t))
        return (s, ...c) => this.produceWithPatches(s, (f) => t(f, ...c));
      let n, o;
      return [this.produce(t, r, (s, c) => {
        n = s, o = c;
      }), n, o];
    }, Zd(e == null ? void 0 : e.autoFreeze) && this.setAutoFreeze(e.autoFreeze), Zd(e == null ? void 0 : e.useStrictShallowCopy) && this.setUseStrictShallowCopy(e.useStrictShallowCopy), Zd(e == null ? void 0 : e.useStrictIteration) && this.setUseStrictIteration(e.useStrictIteration);
  }
  createDraft(e) {
    xr(e) || Nr(8), wn(e) && (e = mr(e));
    const t = O0(this), r = Hv(t, e, void 0);
    return r[Mt].isManual_ = !0, Wv(t), r;
  }
  finishDraft(e, t) {
    const r = e && e[Mt];
    (!r || !r.isManual_) && Nr(9);
    const { scope_: n } = r;
    return E0(n, t), k0(void 0, n);
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
      const o = t[r];
      if (o.path.length === 0 && o.op === "replace") {
        e = o.value;
        break;
      }
    }
    r > -1 && (t = t.slice(r + 1));
    const n = $i(Bv).applyPatches_;
    return wn(e) ? n(e, t) : this.produce(
      e,
      (o) => n(o, t)
    );
  }
};
function Hv(e, t, r, n) {
  const [o, l] = dc(t) ? $i(ws).proxyMap_(t, r) : vc(t) ? $i(ws).proxySet_(t, r) : ZI(t, r);
  return ((r == null ? void 0 : r.scope_) ?? aS()).drafts_.push(o), l.callbacks_ = (r == null ? void 0 : r.callbacks_) ?? [], l.key_ = n, r && n !== void 0 ? qI(r, l, n) : l.callbacks_.push(function(f) {
    var h;
    (h = f.mapSetPlugin_) == null || h.fixSetContents(l);
    const { patchPlugin_: d } = f;
    l.modified_ && d && d.generatePatches_(l, [], f);
  }), o;
}
function mr(e) {
  return wn(e) || Nr(10, e), cS(e);
}
function cS(e) {
  if (!xr(e) || hc(e))
    return e;
  const t = e[Mt];
  let r, n = !0;
  if (t) {
    if (!t.modified_)
      return t.base_;
    t.finalized_ = !0, r = zv(e, t.scope_.immer_.useStrictShallowCopy_), n = t.scope_.immer_.shouldUseStrictIteration();
  } else
    r = zv(e, !0);
  return cc(
    r,
    (o, l) => {
      xs(r, o, cS(l));
    },
    n
  ), t && (t.finalized_ = !1), r;
}
var ev = globalThis.Iterator;
ev == null || ev.from;
var rj = new tj(), fS = rj.produce, Ne = (e) => e;
function dS(e) {
  return ({ dispatch: r, getState: n }) => (o) => (l) => typeof l == "function" ? l(r, n, e) : o(l);
}
var nj = dS(), ij = dS, aj = typeof window < "u" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : function() {
  if (arguments.length !== 0)
    return typeof arguments[0] == "object" ? ms : ms.apply(null, arguments);
};
function lr(e, t) {
  function r(...n) {
    if (t) {
      let o = t(...n);
      if (!o)
        throw new Error(ir(0));
      return {
        type: e,
        payload: o.payload,
        ..."meta" in o && {
          meta: o.meta
        },
        ..."error" in o && {
          error: o.error
        }
      };
    }
    return {
      type: e,
      payload: n[0]
    };
  }
  return r.toString = () => `${e}`, r.type = e, r.match = (n) => tS(n) && n.type === e, r;
}
var vS = class Xo extends Array {
  constructor(...t) {
    super(...t), Object.setPrototypeOf(this, Xo.prototype);
  }
  static get [Symbol.species]() {
    return Xo;
  }
  concat(...t) {
    return super.concat.apply(this, t);
  }
  prepend(...t) {
    return t.length === 1 && Array.isArray(t[0]) ? new Xo(...t[0].concat(this)) : new Xo(...t.concat(this));
  }
};
function C0(e) {
  return xr(e) ? fS(e, () => {
  }) : e;
}
function Xu(e, t, r) {
  return e.has(t) ? e.get(t) : e.set(t, r(t)).get(t);
}
function oj(e) {
  return typeof e == "boolean";
}
var lj = () => function(t) {
  const {
    thunk: r = !0,
    immutableCheck: n = !0,
    serializableCheck: o = !0,
    actionCreatorCheck: l = !0
  } = t ?? {};
  let s = new vS();
  return r && (oj(r) ? s.push(nj) : s.push(ij(r.extraArgument))), s;
}, hS = "RTK_autoBatch", Ue = () => (e) => ({
  payload: e,
  meta: {
    [hS]: !0
  }
}), I0 = (e) => (t) => {
  setTimeout(t, e);
}, uj = (e, t) => (r) => {
  let n = !1;
  const o = () => {
    n || (n = !0, cancelAnimationFrame(l), clearTimeout(s), r());
  }, l = e(o), s = setTimeout(o, t);
}, pS = (e = {
  type: "raf"
}) => (t) => (...r) => {
  const n = t(...r);
  let o = !0, l = !1, s = !1;
  const c = /* @__PURE__ */ new Set(), f = e.type === "tick" ? queueMicrotask : e.type === "raf" ? (
    // requestAnimationFrame won't exist in SSR environments. Fall back to a vague approximation just to keep from erroring.
    typeof window < "u" && window.requestAnimationFrame ? uj(window.requestAnimationFrame, 100) : I0(10)
  ) : e.type === "callback" ? e.queueNotification : I0(e.timeout), d = () => {
    s = !1, l && (l = !1, c.forEach((h) => h()));
  };
  return Object.assign({}, n, {
    // Override the base `store.subscribe` method to keep original listeners
    // from running if we're delaying notifications
    subscribe(h) {
      const p = () => o && h(), y = n.subscribe(p);
      return c.add(h), () => {
        y(), c.delete(h);
      };
    },
    // Override the base `store.dispatch` method so that we can check actions
    // for the `shouldAutoBatch` flag and determine if batching is active
    dispatch(h) {
      var p;
      try {
        return o = !((p = h == null ? void 0 : h.meta) != null && p[hS]), l = !o, l && (s || (s = !0, f(d))), n.dispatch(h);
      } finally {
        o = !0;
      }
    }
  });
}, sj = (e) => function(r) {
  const {
    autoBatch: n = !0
  } = r ?? {};
  let o = new vS(e);
  return n && o.push(pS(typeof n == "object" ? n : void 0)), o;
};
function cj(e) {
  const t = lj(), {
    reducer: r = void 0,
    middleware: n,
    devTools: o = !0,
    preloadedState: l = void 0,
    enhancers: s = void 0
  } = e || {};
  let c;
  if (typeof r == "function")
    c = r;
  else if (Ih(r))
    c = eS(r);
  else
    throw new Error(ir(1));
  let f;
  typeof n == "function" ? f = n(t) : f = t();
  let d = ms;
  o && (d = aj({
    // Enable capture of stack traces for dispatched Redux actions
    trace: !1,
    ...typeof o == "object" && o
  }));
  const h = FI(...f), p = sj(h);
  let y = typeof s == "function" ? s(p) : p();
  const x = d(...y);
  return Jb(c, l, x);
}
function mS(e) {
  const t = {}, r = [];
  let n;
  const o = {
    addCase(l, s) {
      const c = typeof l == "string" ? l : l.type;
      if (!c)
        throw new Error(ir(28));
      if (c in t)
        throw new Error(ir(29));
      return t[c] = s, o;
    },
    addAsyncThunk(l, s) {
      return s.pending && (t[l.pending.type] = s.pending), s.rejected && (t[l.rejected.type] = s.rejected), s.fulfilled && (t[l.fulfilled.type] = s.fulfilled), s.settled && r.push({
        matcher: l.settled,
        reducer: s.settled
      }), o;
    },
    addMatcher(l, s) {
      return r.push({
        matcher: l,
        reducer: s
      }), o;
    },
    addDefaultCase(l) {
      return n = l, o;
    }
  };
  return e(o), [t, r, n];
}
function fj(e) {
  return typeof e == "function";
}
function dj(e, t) {
  let [r, n, o] = mS(t), l;
  if (fj(e))
    l = () => C0(e());
  else {
    const c = C0(e);
    l = () => c;
  }
  function s(c = l(), f) {
    let d = [r[f.type], ...n.filter(({
      matcher: h
    }) => h(f)).map(({
      reducer: h
    }) => h)];
    return d.filter((h) => !!h).length === 0 && (d = [o]), d.reduce((h, p) => {
      if (p)
        if (wn(h)) {
          const x = p(h, f);
          return x === void 0 ? h : x;
        } else {
          if (xr(h))
            return fS(h, (y) => p(y, f));
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
  return s.getInitialState = l, s;
}
var vj = "ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZXIjQW", hj = (e = 21) => {
  let t = "", r = e;
  for (; r--; )
    t += vj[Math.random() * 64 | 0];
  return t;
}, pj = /* @__PURE__ */ Symbol.for("rtk-slice-createasyncthunk");
function mj(e, t) {
  return `${e}/${t}`;
}
function yj({
  creators: e
} = {}) {
  var r;
  const t = (r = e == null ? void 0 : e.asyncThunk) == null ? void 0 : r[pj];
  return function(o) {
    const {
      name: l,
      reducerPath: s = l
    } = o;
    if (!l)
      throw new Error(ir(11));
    const c = (typeof o.reducers == "function" ? o.reducers(xj()) : o.reducers) || {}, f = Object.keys(c), d = {
      sliceCaseReducersByName: {},
      sliceCaseReducersByType: {},
      actionCreators: {},
      sliceMatchers: []
    }, h = {
      addCase(j, T) {
        const O = typeof j == "string" ? j : j.type;
        if (!O)
          throw new Error(ir(12));
        if (O in d.sliceCaseReducersByType)
          throw new Error(ir(13));
        return d.sliceCaseReducersByType[O] = T, h;
      },
      addMatcher(j, T) {
        return d.sliceMatchers.push({
          matcher: j,
          reducer: T
        }), h;
      },
      exposeAction(j, T) {
        return d.actionCreators[j] = T, h;
      },
      exposeCaseReducer(j, T) {
        return d.sliceCaseReducersByName[j] = T, h;
      }
    };
    f.forEach((j) => {
      const T = c[j], O = {
        reducerName: j,
        type: mj(l, j),
        createNotation: typeof o.reducers == "function"
      };
      bj(T) ? Aj(O, T, h, t) : wj(O, T, h);
    });
    function p() {
      const [j = {}, T = [], O = void 0] = typeof o.extraReducers == "function" ? mS(o.extraReducers) : [o.extraReducers], _ = {
        ...j,
        ...d.sliceCaseReducersByType
      };
      return dj(o.initialState, (F) => {
        for (let K in _)
          F.addCase(K, _[K]);
        for (let K of d.sliceMatchers)
          F.addMatcher(K.matcher, K.reducer);
        for (let K of T)
          F.addMatcher(K.matcher, K.reducer);
        O && F.addDefaultCase(O);
      });
    }
    const y = (j) => j, x = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new WeakMap();
    let S;
    function b(j, T) {
      return S || (S = p()), S(j, T);
    }
    function E() {
      return S || (S = p()), S.getInitialState();
    }
    function k(j, T = !1) {
      function O(F) {
        let K = F[j];
        return typeof K > "u" && T && (K = Xu(A, O, E)), K;
      }
      function _(F = y) {
        const K = Xu(x, T, () => /* @__PURE__ */ new WeakMap());
        return Xu(K, F, () => {
          const V = {};
          for (const [q, W] of Object.entries(o.selectors ?? {}))
            V[q] = gj(W, F, () => Xu(A, F, E), T);
          return V;
        });
      }
      return {
        reducerPath: j,
        getSelectors: _,
        get selectors() {
          return _(O);
        },
        selectSlice: O
      };
    }
    const C = {
      name: l,
      reducer: b,
      actions: d.actionCreators,
      caseReducers: d.sliceCaseReducersByName,
      getInitialState: E,
      ...k(s),
      injectInto(j, {
        reducerPath: T,
        ...O
      } = {}) {
        const _ = T ?? s;
        return j.inject({
          reducerPath: _,
          reducer: b
        }, O), {
          ...C,
          ...k(_, !0)
        };
      }
    };
    return C;
  };
}
function gj(e, t, r, n) {
  function o(l, ...s) {
    let c = t(l);
    return typeof c > "u" && n && (c = r()), e(c, ...s);
  }
  return o.unwrapped = e, o;
}
var Dt = /* @__PURE__ */ yj();
function xj() {
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
function wj({
  type: e,
  reducerName: t,
  createNotation: r
}, n, o) {
  let l, s;
  if ("reducer" in n) {
    if (r && !Sj(n))
      throw new Error(ir(17));
    l = n.reducer, s = n.prepare;
  } else
    l = n;
  o.addCase(e, l).exposeCaseReducer(t, l).exposeAction(t, s ? lr(e, s) : lr(e));
}
function bj(e) {
  return e._reducerDefinitionType === "asyncThunk";
}
function Sj(e) {
  return e._reducerDefinitionType === "reducerWithPrepare";
}
function Aj({
  type: e,
  reducerName: t
}, r, n, o) {
  if (!o)
    throw new Error(ir(18));
  const {
    payloadCreator: l,
    fulfilled: s,
    pending: c,
    rejected: f,
    settled: d,
    options: h
  } = r, p = o(e, l, h);
  n.exposeAction(t, p), s && n.addCase(p.fulfilled, s), c && n.addCase(p.pending, c), f && n.addCase(p.rejected, f), d && n.addMatcher(p.settled, d), n.exposeCaseReducer(t, {
    fulfilled: s || qu,
    pending: c || qu,
    rejected: f || qu,
    settled: d || qu
  });
}
function qu() {
}
var Pj = "task", yS = "listener", gS = "completed", Mh = "cancelled", Ej = `task-${Mh}`, Oj = `task-${gS}`, Kv = `${yS}-${Mh}`, kj = `${yS}-${gS}`, mc = class {
  constructor(e) {
    Uu(this, "code");
    Uu(this, "name", "TaskAbortError");
    Uu(this, "message");
    this.code = e, this.message = `${Pj} ${Mh} (reason: ${e})`;
  }
}, Dh = (e, t) => {
  if (typeof e != "function")
    throw new TypeError(ir(32));
}, As = () => {
}, xS = (e, t = As) => (e.catch(t), e), wS = (e, t) => (e.addEventListener("abort", t, {
  once: !0
}), () => e.removeEventListener("abort", t)), ji = (e) => {
  if (e.aborted)
    throw new mc(e.reason);
};
function bS(e, t) {
  let r = As;
  return new Promise((n, o) => {
    const l = () => o(new mc(e.reason));
    if (e.aborted) {
      l();
      return;
    }
    r = wS(e, l), t.finally(() => r()).then(n, o);
  }).finally(() => {
    r = As;
  });
}
var _j = async (e, t) => {
  try {
    return await Promise.resolve(), {
      status: "ok",
      value: await e()
    };
  } catch (r) {
    return {
      status: r instanceof mc ? "cancelled" : "rejected",
      error: r
    };
  } finally {
    t == null || t();
  }
}, Ps = (e) => (t) => xS(bS(e, t).then((r) => (ji(e), r))), SS = (e) => {
  const t = Ps(e);
  return (r) => t(new Promise((n) => setTimeout(n, r)));
}, {
  assign: ka
} = Object, j0 = {}, yc = "listenerMiddleware", Cj = (e, t) => {
  const r = (n) => wS(e, () => n.abort(e.reason));
  return (n, o) => {
    Dh(n);
    const l = new AbortController();
    r(l);
    const s = _j(async () => {
      ji(e), ji(l.signal);
      const c = await n({
        pause: Ps(l.signal),
        delay: SS(l.signal),
        signal: l.signal
      });
      return ji(l.signal), c;
    }, () => l.abort(Oj));
    return o != null && o.autoJoin && t.push(s.catch(As)), {
      result: Ps(e)(s),
      cancel() {
        l.abort(Ej);
      }
    };
  };
}, Ij = (e, t) => {
  const r = async (n, o) => {
    ji(t);
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
    o != null && c.push(new Promise((f) => setTimeout(f, o, null)));
    try {
      const f = await bS(t, Promise.race(c));
      return ji(t), f;
    } finally {
      l();
    }
  };
  return ((n, o) => xS(r(n, o)));
}, AS = (e) => {
  let {
    type: t,
    actionCreator: r,
    matcher: n,
    predicate: o,
    effect: l
  } = e;
  if (t)
    o = lr(t).match;
  else if (r)
    t = r.type, o = r.match;
  else if (n)
    o = n;
  else if (!o) throw new Error(ir(21));
  return Dh(l), {
    predicate: o,
    type: t,
    effect: l
  };
}, PS = /* @__PURE__ */ ka((e) => {
  const {
    type: t,
    predicate: r,
    effect: n
  } = AS(e);
  return {
    id: hj(),
    effect: n,
    type: t,
    predicate: r,
    pending: /* @__PURE__ */ new Set(),
    unsubscribe: () => {
      throw new Error(ir(22));
    }
  };
}, {
  withTypes: () => PS
}), T0 = (e, t) => {
  const {
    type: r,
    effect: n,
    predicate: o
  } = AS(t);
  return Array.from(e.values()).find((l) => (typeof r == "string" ? l.type === r : l.predicate === o) && l.effect === n);
}, Vv = (e) => {
  e.pending.forEach((t) => {
    t.abort(Kv);
  });
}, jj = (e, t) => () => {
  for (const r of t.keys())
    Vv(r);
  e.clear();
}, N0 = (e, t, r) => {
  try {
    e(t, r);
  } catch (n) {
    setTimeout(() => {
      throw n;
    }, 0);
  }
}, ES = /* @__PURE__ */ ka(/* @__PURE__ */ lr(`${yc}/add`), {
  withTypes: () => ES
}), Tj = /* @__PURE__ */ lr(`${yc}/removeAll`), OS = /* @__PURE__ */ ka(/* @__PURE__ */ lr(`${yc}/remove`), {
  withTypes: () => OS
}), Nj = (...e) => {
  console.error(`${yc}/error`, ...e);
}, gl = (e = {}) => {
  const t = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), n = (x) => {
    const A = r.get(x) ?? 0;
    r.set(x, A + 1);
  }, o = (x) => {
    const A = r.get(x) ?? 1;
    A === 1 ? r.delete(x) : r.set(x, A - 1);
  }, {
    extra: l,
    onError: s = Nj
  } = e;
  Dh(s);
  const c = (x) => (x.unsubscribe = () => t.delete(x.id), t.set(x.id, x), (A) => {
    x.unsubscribe(), A != null && A.cancelActive && Vv(x);
  }), f = ((x) => {
    const A = T0(t, x) ?? PS(x);
    return c(A);
  });
  ka(f, {
    withTypes: () => f
  });
  const d = (x) => {
    const A = T0(t, x);
    return A && (A.unsubscribe(), x.cancelActive && Vv(A)), !!A;
  };
  ka(d, {
    withTypes: () => d
  });
  const h = async (x, A, S, b) => {
    const E = new AbortController(), k = Ij(f, E.signal), C = [];
    try {
      x.pending.add(E), n(x), await Promise.resolve(x.effect(
        A,
        // Use assign() rather than ... to avoid extra helper functions added to bundle
        ka({}, S, {
          getOriginalState: b,
          condition: (j, T) => k(j, T).then(Boolean),
          take: k,
          delay: SS(E.signal),
          pause: Ps(E.signal),
          extra: l,
          signal: E.signal,
          fork: Cj(E.signal, C),
          unsubscribe: x.unsubscribe,
          subscribe: () => {
            t.set(x.id, x);
          },
          cancelActiveListeners: () => {
            x.pending.forEach((j, T, O) => {
              j !== E && (j.abort(Kv), O.delete(j));
            });
          },
          cancel: () => {
            E.abort(Kv), x.pending.delete(E);
          },
          throwIfCancelled: () => {
            ji(E.signal);
          }
        })
      ));
    } catch (j) {
      j instanceof mc || N0(s, j, {
        raisedBy: "effect"
      });
    } finally {
      await Promise.all(C), E.abort(kj), o(x), x.pending.delete(E);
    }
  }, p = jj(t, r);
  return {
    middleware: (x) => (A) => (S) => {
      if (!tS(S))
        return A(S);
      if (ES.match(S))
        return f(S.payload);
      if (Tj.match(S)) {
        p();
        return;
      }
      if (OS.match(S))
        return d(S.payload);
      let b = x.getState();
      const E = () => {
        if (b === j0)
          throw new Error(ir(23));
        return b;
      };
      let k;
      try {
        if (k = A(S), t.size > 0) {
          const C = x.getState(), j = Array.from(t.values());
          for (const T of j) {
            let O = !1;
            try {
              O = T.predicate(S, C, b);
            } catch (_) {
              O = !1, N0(s, _, {
                raisedBy: "predicate"
              });
            }
            O && h(T, S, x, E);
          }
        }
      } finally {
        b = j0;
      }
      return k;
    },
    startListening: f,
    stopListening: d,
    clearListeners: p
  };
};
function ir(e) {
  return `Minified Redux Toolkit error #${e}; visit https://redux-toolkit.js.org/Errors?code=${e} for the full message or use the non-minified dev environment for full errors. `;
}
var Mj = {
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
}, kS = Dt({
  name: "chartLayout",
  initialState: Mj,
  reducers: {
    setLayout(e, t) {
      e.layoutType = t.payload;
    },
    setChartSize(e, t) {
      e.width = t.payload.width, e.height = t.payload.height;
    },
    setMargin(e, t) {
      var r, n, o, l;
      e.margin.top = (r = t.payload.top) !== null && r !== void 0 ? r : 0, e.margin.right = (n = t.payload.right) !== null && n !== void 0 ? n : 0, e.margin.bottom = (o = t.payload.bottom) !== null && o !== void 0 ? o : 0, e.margin.left = (l = t.payload.left) !== null && l !== void 0 ? l : 0;
    },
    setScale(e, t) {
      e.scale = t.payload;
    }
  }
}), gc = kS.actions, Dj = gc.setMargin, $j = gc.setLayout, Lj = gc.setChartSize, Rj = gc.setScale, zj = kS.reducer;
function _S(e, t, r) {
  return Array.isArray(e) && e && t + r !== 0 ? e.slice(t, r + 1) : e;
}
function ke(e) {
  return Number.isFinite(e);
}
function en(e) {
  return typeof e == "number" && e > 0 && Number.isFinite(e);
}
function M0(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Gt(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? M0(Object(r), !0).forEach(function(n) {
      Bj(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : M0(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function Bj(e, t, r) {
  return (t = Fj(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function Fj(e) {
  var t = Wj(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function Wj(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function tt(e, t, r) {
  return st(e) || st(t) ? r : Jr(t) ? Bi(e, t, r) : typeof t == "function" ? t(e) : r;
}
var Uj = (e, t, r) => {
  if (t && r) {
    var n = r.width, o = r.height, l = t.align, s = t.verticalAlign, c = t.layout, f = t.position, d = t.offset, h = d === void 0 ? 0 : d;
    if (f != null) {
      if (lC(f)) {
        if (f === "top" && le(e.top))
          return Gt(Gt({}, e), {}, {
            top: e.top + (o || 0) + h
          });
        if (f === "bottom" && le(e.bottom))
          return Gt(Gt({}, e), {}, {
            bottom: e.bottom + (o || 0) + h
          });
        if (f === "left" && le(e.left))
          return Gt(Gt({}, e), {}, {
            left: e.left + (n || 0) + h
          });
        if (f === "right" && le(e.right))
          return Gt(Gt({}, e), {}, {
            right: e.right + (n || 0) + h
          });
      }
      return e;
    }
    if ((c === "vertical" || c === "horizontal" && s === "middle") && l !== "center" && le(e[l]))
      return Gt(Gt({}, e), {}, {
        [l]: e[l] + (n || 0)
      });
    if ((c === "horizontal" || c === "vertical" && l === "center") && s !== "middle" && le(e[s]))
      return Gt(Gt({}, e), {}, {
        [s]: e[s] + (o || 0)
      });
  }
  return e;
}, $r = (e, t) => e === "horizontal" && t === "xAxis" || e === "vertical" && t === "yAxis" || e === "centric" && t === "angleAxis" || e === "radial" && t === "radiusAxis", CS = (e, t, r, n) => {
  if (n)
    return e.map((c) => c.coordinate);
  var o, l, s = e.map((c) => (c.coordinate === t && (o = !0), c.coordinate === r && (l = !0), c.coordinate));
  return o || s.push(t), l || s.push(r), s;
}, IS = (e, t, r) => {
  if (!e)
    return null;
  var n = e.duplicateDomain, o = e.type, l = e.range, s = e.scale, c = e.realScaleType, f = e.isCategorical, d = e.categoricalDomain, h = e.tickCount, p = e.ticks, y = e.niceTicks, x = e.axisType;
  if (!s)
    return null;
  var A = c === "scaleBand" && s.bandwidth ? s.bandwidth() / 2 : 2, S = o === "category" && s.bandwidth ? s.bandwidth() / A : 0;
  if (S = x === "angleAxis" && l && l.length >= 2 ? pr(l[0] - l[1]) * 2 * S : S, p || y) {
    var b = (p || y || []).map((E, k) => {
      var C = n ? n.indexOf(E) : E, j = s.map(C);
      return ke(j) ? {
        // If the scaleContent is not a number, the coordinate will be NaN.
        // That could be the case for example with a PointScale and a string as domain.
        coordinate: j + S,
        value: E,
        offset: S,
        index: k
      } : null;
    }).filter(Bt);
    return b;
  }
  return f && d ? d.map((E, k) => {
    var C = s.map(E);
    return ke(C) ? {
      coordinate: C + S,
      value: E,
      index: k,
      offset: S
    } : null;
  }).filter(Bt) : s.ticks && h != null ? s.ticks(h).map((E, k) => {
    var C = s.map(E);
    return ke(C) ? {
      coordinate: C + S,
      value: E,
      index: k,
      offset: S
    } : null;
  }).filter(Bt) : s.domain().map((E, k) => {
    var C = s.map(E);
    return ke(C) ? {
      coordinate: C + S,
      // @ts-expect-error can't use Date as an index
      value: n ? n[E] : E,
      index: k,
      offset: S
    } : null;
  }).filter(Bt);
}, Hj = (e) => {
  var t, r = e.length;
  if (!(r <= 0)) {
    var n = (t = e[0]) === null || t === void 0 ? void 0 : t.length;
    if (!(n == null || n <= 0))
      for (var o = 0; o < n; ++o)
        for (var l = 0, s = 0, c = 0; c < r; ++c) {
          var f = e[c], d = f == null ? void 0 : f[o];
          if (d != null) {
            var h = d[1], p = d[0], y = Zr(h) ? p : h;
            y >= 0 ? (d[0] = l, l += y, d[1] = l) : (d[0] = s, s += y, d[1] = s);
          }
        }
  }
}, Kj = (e) => {
  var t, r = e.length;
  if (!(r <= 0)) {
    var n = (t = e[0]) === null || t === void 0 ? void 0 : t.length;
    if (!(n == null || n <= 0))
      for (var o = 0; o < n; ++o)
        for (var l = 0, s = 0; s < r; ++s) {
          var c = e[s], f = c == null ? void 0 : c[o];
          if (f != null) {
            var d = Zr(f[1]) ? f[0] : f[1];
            d >= 0 ? (f[0] = l, l += d, f[1] = l) : (f[0] = 0, f[1] = 0);
          }
        }
  }
}, Vj = {
  sign: Hj,
  // @ts-expect-error definitelytyped types are incorrect
  expand: kC,
  // @ts-expect-error definitelytyped types are incorrect
  none: Di,
  // @ts-expect-error definitelytyped types are incorrect
  silhouette: _C,
  // @ts-expect-error definitelytyped types are incorrect
  wiggle: CC,
  positive: Kj
}, Yj = (e, t, r) => {
  var n, o = (n = Vj[r]) !== null && n !== void 0 ? n : Di, l = OC().keys(t).value((c, f) => Number(tt(c, f, 0))).order(Tv).offset(o), s = l(e);
  return s.forEach((c, f) => {
    c.forEach((d, h) => {
      var p = tt(e[h], t[f], 0);
      Array.isArray(p) && p.length === 2 && le(p[0]) && le(p[1]) && (d[0] = p[0], d[1] = p[1]);
    });
  }), s;
};
function Gj(e) {
  return e == null ? void 0 : String(e);
}
function Es(e) {
  var t = e.axis, r = e.ticks, n = e.bandSize, o = e.entry, l = e.index, s = e.dataKey;
  if (t.type === "category") {
    if (!t.allowDuplicatedCategory && t.dataKey && !st(o[t.dataKey])) {
      var c = sb(r, "value", o[t.dataKey]);
      if (c)
        return c.coordinate + n / 2;
    }
    return r != null && r[l] ? r[l].coordinate + n / 2 : null;
  }
  var f = tt(o, st(s) ? t.dataKey : s), d = t.scale.map(f);
  return le(d) ? d : null;
}
var Xj = (e) => {
  var t = e.flat(2).filter(le);
  return [Math.min(...t), Math.max(...t)];
}, qj = (e) => [e[0] === 1 / 0 ? 0 : e[0], e[1] === -1 / 0 ? 0 : e[1]], Qj = (e, t, r) => {
  if (!(e == null || Object.keys(e).length === 0))
    return qj(Object.keys(e).reduce((n, o) => {
      var l = e[o];
      if (!l)
        return n;
      var s = l.stackedData, c = s.reduce((f, d) => {
        var h = _S(d, t, r), p = Xj(h);
        return !ke(p[0]) || !ke(p[1]) ? f : [Math.min(f[0], p[0]), Math.max(f[1], p[1])];
      }, [1 / 0, -1 / 0]);
      return [Math.min(c[0], n[0]), Math.max(c[1], n[1])];
    }, [1 / 0, -1 / 0]));
}, D0 = /^dataMin[\s]*-[\s]*([0-9]+([.]{1}[0-9]+){0,1})$/, $0 = /^dataMax[\s]*\+[\s]*([0-9]+([.]{1}[0-9]+){0,1})$/, Na = (e, t, r) => {
  if (e && e.scale && e.scale.bandwidth) {
    var n = e.scale.bandwidth();
    if (!r || n > 0)
      return n;
  }
  if (e && t && t.length >= 2) {
    for (var o = uc(t, (S) => S.coordinate), l = [], s = 0, c = 1, f = o.length; c < f; c++) {
      var d, h, p = (((d = o[c]) === null || d === void 0 ? void 0 : d.coordinate) || 0) - (((h = o[c - 1]) === null || h === void 0 ? void 0 : h.coordinate) || 0);
      l.push(p), s = Math.max(p, s);
    }
    var y = s * 1e-4, x = 1 / 0;
    for (var A of l)
      A > y && (x = Math.min(A, x));
    return x === 1 / 0 ? 0 : x;
  }
  return r ? void 0 : 0;
};
function L0(e) {
  var t = e.tooltipEntrySettings, r = e.dataKey, n = e.payload, o = e.value, l = e.name;
  return Gt(Gt({}, t), {}, {
    dataKey: r,
    payload: n,
    value: o,
    name: l
  });
}
function xc(e, t) {
  if (e != null)
    return String(e);
  if (typeof t == "string")
    return t;
}
var Zj = (e, t) => {
  if (t === "horizontal")
    return e.relativeX;
  if (t === "vertical")
    return e.relativeY;
}, Jj = (e, t) => t === "centric" ? e.angle : e.radius, Pn = (e) => e.layout.width, En = (e) => e.layout.height, eT = (e) => e.layout.scale, jS = (e) => e.layout.margin, wc = z((e) => e.cartesianAxis.xAxis, (e) => Object.values(e)), bc = z((e) => e.cartesianAxis.yAxis, (e) => Object.values(e)), tT = "data-recharts-item-index", rT = "data-recharts-item-id", xl = 60, $h = 30;
function R0(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Qu(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? R0(Object(r), !0).forEach(function(n) {
      nT(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : R0(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function nT(e, t, r) {
  return (t = iT(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function iT(e) {
  var t = aT(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function aT(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var oT = (e) => e.brush.height;
function lT(e) {
  var t = bc(e);
  return t.reduce((r, n) => {
    if (n.orientation === "left" && !n.mirror && !n.hide) {
      var o = typeof n.width == "number" ? n.width : xl;
      return r + o;
    }
    return r;
  }, 0);
}
function uT(e) {
  var t = bc(e);
  return t.reduce((r, n) => {
    if (n.orientation === "right" && !n.mirror && !n.hide) {
      var o = typeof n.width == "number" ? n.width : xl;
      return r + o;
    }
    return r;
  }, 0);
}
function sT(e) {
  var t = wc(e);
  return t.reduce((r, n) => {
    if (n.orientation === "top" && !n.mirror && !n.hide) {
      var o = typeof n.height == "number" ? n.height : $h;
      return r + o;
    }
    return r;
  }, 0);
}
function cT(e) {
  var t = wc(e);
  return t.reduce((r, n) => {
    if (n.orientation === "bottom" && !n.mirror && !n.hide) {
      var o = typeof n.height == "number" ? n.height : $h;
      return r + o;
    }
    return r;
  }, 0);
}
var Et = z([Pn, En, jS, oT, lT, uT, sT, cT, Zb, II], (e, t, r, n, o, l, s, c, f, d) => {
  var h = {
    left: (r.left || 0) + o,
    right: (r.right || 0) + l
  }, p = {
    top: (r.top || 0) + s,
    bottom: (r.bottom || 0) + c
  }, y = Qu(Qu({}, p), h), x = y.bottom;
  y.bottom += n, y = Uj(y, f, d);
  var A = e - y.left - y.right, S = t - y.top - y.bottom;
  return Qu(Qu({
    brushBottom: x
  }, y), {}, {
    // never return negative values for height and width
    width: Math.max(A, 0),
    height: Math.max(S, 0)
  });
}), fT = z(Et, (e) => ({
  x: e.left,
  y: e.top,
  width: e.width,
  height: e.height
})), TS = z(Pn, En, (e, t) => ({
  x: 0,
  y: 0,
  width: e,
  height: t
})), dT = /* @__PURE__ */ w.createContext(null), $t = () => w.useContext(dT) != null, Sc = (e) => e.brush, Ac = z([Sc, Et, jS], (e, t, r) => ({
  height: e.height,
  x: le(e.x) ? e.x : t.left,
  y: le(e.y) ? e.y : t.top + t.height + t.brushBottom - ((r == null ? void 0 : r.bottom) || 0),
  width: le(e.width) ? e.width : t.width
}));
function vT(e, t, { signal: r, edges: n } = {}) {
  let o, l = null;
  const s = n != null && n.includes("leading"), c = n == null || n.includes("trailing"), f = () => {
    l !== null && (e.apply(o, l), o = void 0, l = null);
  }, d = () => {
    c && f(), x();
  };
  let h = null;
  const p = () => {
    h != null && clearTimeout(h), h = setTimeout(() => {
      h = null, d();
    }, t);
  }, y = () => {
    h !== null && (clearTimeout(h), h = null);
  }, x = () => {
    y(), o = void 0, l = null;
  }, A = () => {
    f();
  }, S = function(...b) {
    if (r != null && r.aborted) return;
    o = this, l = b;
    const E = h == null;
    p(), s && E && f();
  };
  return S.schedule = p, S.cancel = x, S.flush = A, r == null || r.addEventListener("abort", x, { once: !0 }), S;
}
function hT(e, t = 0, r = {}) {
  typeof r != "object" && (r = {});
  const { leading: n = !1, trailing: o = !0, maxWait: l } = r, s = Array(2);
  n && (s[0] = "leading"), o && (s[1] = "trailing");
  let c, f = null;
  const d = vT(function(...y) {
    c = e.apply(this, y), f = null;
  }, t, { edges: s }), h = function(...y) {
    return l != null && (f === null && (f = Date.now()), Date.now() - f >= l) ? ((n || o) && (c = e.apply(this, y)), f = Date.now(), d.cancel(), d.schedule(), c) : (d.apply(this, y), c);
  }, p = () => (d.flush(), c);
  return h.cancel = d.cancel, h.flush = p, h;
}
function pT(e, t = 0, r = {}) {
  const { leading: n = !0, trailing: o = !0 } = r;
  return hT(e, t, {
    leading: n,
    maxWait: t,
    trailing: o
  });
}
var Os = function(t, r) {
  for (var n = arguments.length, o = new Array(n > 2 ? n - 2 : 0), l = 2; l < n; l++)
    o[l - 2] = arguments[l];
  if (typeof console < "u" && console.warn && (r === void 0 && console.warn("LogUtils requires an error message argument"), !t))
    if (r === void 0)
      console.warn("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");
    else {
      var s = 0;
      console.warn(r.replace(/%s/g, () => o[s++]));
    }
}, Gr = {
  width: "100%",
  height: "100%",
  debounce: 0,
  minWidth: 0,
  initialDimension: {
    width: -1,
    height: -1
  }
}, NS = (e, t, r) => {
  var n = r.width, o = n === void 0 ? Gr.width : n, l = r.height, s = l === void 0 ? Gr.height : l, c = r.aspect, f = r.maxHeight, d = Mi(o) ? e : Number(o), h = Mi(s) ? t : Number(s);
  return c && c > 0 && (d ? h = d / c : h && (d = h * c), f && h != null && h > f && (h = f)), {
    calculatedWidth: d,
    calculatedHeight: h
  };
}, mT = {
  width: 0,
  height: 0,
  overflow: "visible"
}, yT = {
  width: 0,
  overflowX: "visible"
}, gT = {
  height: 0,
  overflowY: "visible"
}, xT = {}, wT = (e) => {
  var t = e.width, r = e.height, n = Mi(t), o = Mi(r);
  return n && o ? mT : n ? yT : o ? gT : xT;
};
function bT(e) {
  var t = e.width, r = e.height, n = e.aspect, o = t, l = r;
  return o === void 0 && l === void 0 ? (o = Gr.width, l = Gr.height) : o === void 0 ? o = n && n > 0 ? void 0 : Gr.width : l === void 0 && (l = n && n > 0 ? void 0 : Gr.height), {
    width: o,
    height: l
  };
}
var ST = ["aspect", "initialDimension", "width", "height", "minWidth", "minHeight", "maxHeight", "children", "debounce", "id", "className", "onResize", "style"];
function ks() {
  return ks = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, ks.apply(null, arguments);
}
function z0(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function B0(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? z0(Object(r), !0).forEach(function(n) {
      AT(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : z0(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function AT(e, t, r) {
  return (t = PT(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function PT(e) {
  var t = ET(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function ET(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function OT(e, t) {
  return IT(e) || CT(e, t) || _T(e, t) || kT();
}
function kT() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function _T(e, t) {
  if (e) {
    if (typeof e == "string") return F0(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? F0(e, t) : void 0;
  }
}
function F0(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function CT(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, o, l, s, c = [], f = !0, d = !1;
    try {
      if (l = (r = r.call(e)).next, t !== 0) for (; !(f = (n = l.call(r)).done) && (c.push(n.value), c.length !== t); f = !0) ;
    } catch (h) {
      d = !0, o = h;
    } finally {
      try {
        if (!f && r.return != null && (s = r.return(), Object(s) !== s)) return;
      } finally {
        if (d) throw o;
      }
    }
    return c;
  }
}
function IT(e) {
  if (Array.isArray(e)) return e;
}
function jT(e, t) {
  if (e == null) return {};
  var r, n, o = TT(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (o[r] = e[r]);
  }
  return o;
}
function TT(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
var MS = /* @__PURE__ */ w.createContext(Gr.initialDimension);
function NT(e) {
  return en(e.width) && en(e.height);
}
function DS(e) {
  var t = e.children, r = e.width, n = e.height, o = w.useMemo(() => ({
    width: r,
    height: n
  }), [r, n]);
  return NT(o) ? /* @__PURE__ */ w.createElement(MS.Provider, {
    value: o
  }, t) : null;
}
var Lh = () => w.useContext(MS), MT = /* @__PURE__ */ w.forwardRef((e, t) => {
  var r = e.aspect, n = e.initialDimension, o = n === void 0 ? Gr.initialDimension : n, l = e.width, s = e.height, c = e.minWidth, f = c === void 0 ? Gr.minWidth : c, d = e.minHeight, h = e.maxHeight, p = e.children, y = e.debounce, x = y === void 0 ? Gr.debounce : y, A = e.id, S = e.className, b = e.onResize, E = e.style, k = E === void 0 ? {} : E, C = jT(e, ST), j = w.useRef(null), T = w.useRef();
  T.current = b, w.useImperativeHandle(t, () => j.current);
  var O = w.useState({
    containerWidth: o.width,
    containerHeight: o.height
  }), _ = OT(O, 2), F = _[0], K = _[1], V = w.useCallback((ve, ae) => {
    K((U) => {
      var te = Math.round(ve), Y = Math.round(ae);
      return U.containerWidth === te && U.containerHeight === Y ? U : {
        containerWidth: te,
        containerHeight: Y
      };
    });
  }, []);
  w.useEffect(() => {
    if (j.current == null || typeof ResizeObserver > "u")
      return Fi;
    var ve = ($) => {
      var H, fe = $[0];
      if (fe != null) {
        var ge = fe.contentRect, Ae = ge.width, Pe = ge.height;
        V(Ae, Pe), (H = T.current) === null || H === void 0 || H.call(T, Ae, Pe);
      }
    };
    x > 0 && (ve = pT(ve, x, {
      trailing: !0,
      leading: !1
    }));
    var ae = new ResizeObserver(ve), U = j.current.getBoundingClientRect(), te = U.width, Y = U.height;
    return V(te, Y), ae.observe(j.current), () => {
      ae.disconnect();
    };
  }, [V, x]);
  var q = F.containerWidth, W = F.containerHeight;
  Os(!r || r > 0, "The aspect(%s) must be greater than zero.", r);
  var ie = NS(q, W, {
    width: l,
    height: s,
    aspect: r,
    maxHeight: h
  }), re = ie.calculatedWidth, we = ie.calculatedHeight;
  return Os(q < 0 || W < 0 || re != null && re > 0 || we != null && we > 0, `The width(%s) and height(%s) of chart should be greater than 0,
       please check the style of container, or the props width(%s) and height(%s),
       or add a minWidth(%s) or minHeight(%s) or use aspect(%s) to control the
       height and width.`, re, we, l, s, f, d, r), /* @__PURE__ */ w.createElement("div", ks({
    id: A ? "".concat(A) : void 0,
    className: ze("recharts-responsive-container", S),
    style: B0(B0({}, k), {}, {
      width: l,
      height: s,
      minWidth: f,
      minHeight: d,
      maxHeight: h
    }),
    ref: j
  }, C), /* @__PURE__ */ w.createElement("div", {
    style: wT({
      width: l,
      height: s
    })
  }, /* @__PURE__ */ w.createElement(DS, {
    width: re,
    height: we
  }, p)));
}), DT = /* @__PURE__ */ w.forwardRef((e, t) => {
  var r = Lh();
  if (en(r.width) && en(r.height))
    return e.children;
  var n = bT({
    width: e.width,
    height: e.height,
    aspect: e.aspect
  }), o = n.width, l = n.height, s = NS(void 0, void 0, {
    width: o,
    height: l,
    aspect: e.aspect,
    maxHeight: e.maxHeight
  }), c = s.calculatedWidth, f = s.calculatedHeight;
  return le(c) && le(f) ? /* @__PURE__ */ w.createElement(DS, {
    width: c,
    height: f
  }, e.children) : /* @__PURE__ */ w.createElement(MT, ks({}, e, {
    width: o,
    height: l,
    ref: t
  }));
}), Pc = () => {
  var e, t = $t(), r = he(fT), n = he(Ac), o = (e = he(Sc)) === null || e === void 0 ? void 0 : e.padding;
  return !t || !n || !o ? r : {
    width: n.width - o.left - o.right,
    height: n.height - o.top - o.bottom,
    x: o.left,
    y: o.top
  };
}, $T = {
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  width: 0,
  height: 0,
  brushBottom: 0
}, $S = () => {
  var e;
  return (e = he(Et)) !== null && e !== void 0 ? e : $T;
}, LS = () => he(Pn), RS = () => he(En), Be = (e) => e.layout.layoutType, Wi = () => he(Be), Rh = () => {
  var e = Wi();
  if (e === "horizontal" || e === "vertical")
    return e;
}, zS = (e) => {
  var t = e.layout.layoutType;
  if (t === "centric" || t === "radial")
    return t;
}, LT = () => {
  var e = Wi();
  return e !== void 0;
}, wl = (e) => {
  var t = rt(), r = $t(), n = e.width, o = e.height, l = Lh(), s = n, c = o;
  return l && (s = l.width > 0 ? l.width : n, c = l.height > 0 ? l.height : o), w.useEffect(() => {
    !r && en(s) && en(c) && t(Lj({
      width: s,
      height: c
    }));
  }, [t, r, s, c]), null;
}, RT = {
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
}, BS = Dt({
  name: "legend",
  initialState: RT,
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
      prepare: Ue()
    },
    replaceLegendPayload: {
      reducer(e, t) {
        var r = t.payload, n = r.prev, o = r.next, l = mr(e).payload.indexOf(Ne(n));
        l > -1 && (e.payload[l] = Ne(o));
      },
      prepare: Ue()
    },
    removeLegendPayload: {
      reducer(e, t) {
        var r = mr(e).payload.indexOf(Ne(t.payload));
        r > -1 && e.payload.splice(r, 1);
      },
      prepare: Ue()
    }
  }
}), bl = BS.actions;
bl.setLegendSize;
bl.setLegendSettings;
var zT = bl.addLegendPayload, BT = bl.replaceLegendPayload, FT = bl.removeLegendPayload, WT = BS.reducer, tv = { exports: {} }, rv = {};
/**
 * @license React
 * use-sync-external-store-with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var W0;
function UT() {
  if (W0) return rv;
  W0 = 1;
  var e = Ba();
  function t(f, d) {
    return f === d && (f !== 0 || 1 / f === 1 / d) || f !== f && d !== d;
  }
  var r = typeof Object.is == "function" ? Object.is : t, n = e.useSyncExternalStore, o = e.useRef, l = e.useEffect, s = e.useMemo, c = e.useDebugValue;
  return rv.useSyncExternalStoreWithSelector = function(f, d, h, p, y) {
    var x = o(null);
    if (x.current === null) {
      var A = { hasValue: !1, value: null };
      x.current = A;
    } else A = x.current;
    x = s(
      function() {
        function b(T) {
          if (!E) {
            if (E = !0, k = T, T = p(T), y !== void 0 && A.hasValue) {
              var O = A.value;
              if (y(O, T))
                return C = O;
            }
            return C = T;
          }
          if (O = C, r(k, T)) return O;
          var _ = p(T);
          return y !== void 0 && y(O, _) ? (k = T, O) : (k = T, C = _);
        }
        var E = !1, k, C, j = h === void 0 ? null : h;
        return [
          function() {
            return b(d());
          },
          j === null ? void 0 : function() {
            return b(j());
          }
        ];
      },
      [d, h, p, y]
    );
    var S = n(f, x[0], x[1]);
    return l(
      function() {
        A.hasValue = !0, A.value = S;
      },
      [S]
    ), c(S), S;
  }, rv;
}
var U0;
function HT() {
  return U0 || (U0 = 1, tv.exports = UT()), tv.exports;
}
HT();
function KT(e) {
  e();
}
function VT() {
  let e = null, t = null;
  return {
    clear() {
      e = null, t = null;
    },
    notify() {
      KT(() => {
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
      const o = t = {
        callback: r,
        next: null,
        prev: t
      };
      return o.prev ? o.prev.next = o : e = o, function() {
        !n || e === null || (n = !1, o.next ? o.next.prev = o.prev : t = o.prev, o.prev ? o.prev.next = o.next : e = o.next);
      };
    }
  };
}
var H0 = {
  notify() {
  },
  get: () => []
};
function YT(e, t) {
  let r, n = H0, o = 0, l = !1;
  function s(S) {
    h();
    const b = n.subscribe(S);
    let E = !1;
    return () => {
      E || (E = !0, b(), p());
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
    o++, r || (r = e.subscribe(f), n = VT());
  }
  function p() {
    o--, r && o === 0 && (r(), r = void 0, n.clear(), n = H0);
  }
  function y() {
    l || (l = !0, h());
  }
  function x() {
    l && (l = !1, p());
  }
  const A = {
    addNestedSub: s,
    notifyNestedSubs: c,
    handleChangeWrapper: f,
    isSubscribed: d,
    trySubscribe: y,
    tryUnsubscribe: x,
    getListeners: () => n
  };
  return A;
}
var GT = () => typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u", XT = /* @__PURE__ */ GT(), qT = () => typeof navigator < "u" && navigator.product === "ReactNative", QT = /* @__PURE__ */ qT(), ZT = () => XT || QT ? w.useLayoutEffect : w.useEffect, JT = /* @__PURE__ */ ZT();
function K0(e, t) {
  return e === t ? e !== 0 || t !== 0 || 1 / e === 1 / t : e !== e && t !== t;
}
function eN(e, t) {
  if (K0(e, t)) return !0;
  if (typeof e != "object" || e === null || typeof t != "object" || t === null)
    return !1;
  const r = Object.keys(e), n = Object.keys(t);
  if (r.length !== n.length) return !1;
  for (let o = 0; o < r.length; o++)
    if (!Object.prototype.hasOwnProperty.call(t, r[o]) || !K0(e[r[o]], t[r[o]]))
      return !1;
  return !0;
}
var nv = /* @__PURE__ */ Symbol.for("react-redux-context"), iv = typeof globalThis < "u" ? globalThis : (
  /* fall back to a per-module scope (pre-8.1 behaviour) if `globalThis` is not available */
  {}
);
function tN() {
  if (!w.createContext) return {};
  const e = iv[nv] ?? (iv[nv] = /* @__PURE__ */ new Map());
  let t = e.get(w.createContext);
  return t || (t = w.createContext(
    null
  ), e.set(w.createContext, t)), t;
}
var rN = /* @__PURE__ */ tN();
function nN(e) {
  const { children: t, context: r, serverState: n, store: o } = e, l = w.useMemo(() => {
    const f = YT(o);
    return {
      store: o,
      subscription: f,
      getServerState: n ? () => n : void 0
    };
  }, [o, n]), s = w.useMemo(() => o.getState(), [o]);
  JT(() => {
    const { subscription: f } = l;
    return f.onStateChange = f.notifyNestedSubs, f.trySubscribe(), s !== o.getState() && f.notifyNestedSubs(), () => {
      f.tryUnsubscribe(), f.onStateChange = void 0;
    };
  }, [l, s]);
  const c = r || rN;
  return /* @__PURE__ */ w.createElement(c.Provider, { value: l }, t);
}
var iN = nN, aN = /* @__PURE__ */ new Set([
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
function oN(e, t) {
  return e == null && t == null ? !0 : typeof e == "number" && typeof t == "number" ? e === t || e !== e && t !== t : e === t;
}
function Sl(e, t) {
  var r = /* @__PURE__ */ new Set([...Object.keys(e), ...Object.keys(t)]);
  for (var n of r)
    if (aN.has(n)) {
      if (e[n] == null && t[n] == null)
        continue;
      if (!eN(e[n], t[n]))
        return !1;
    } else if (!oN(e[n], t[n]))
      return !1;
  return !0;
}
function Yv() {
  return Yv = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Yv.apply(null, arguments);
}
function V0(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function zo(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? V0(Object(r), !0).forEach(function(n) {
      lN(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : V0(Object(r)).forEach(function(n) {
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
function cN(e, t) {
  return hN(e) || vN(e, t) || dN(e, t) || fN();
}
function fN() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function dN(e, t) {
  if (e) {
    if (typeof e == "string") return Y0(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? Y0(e, t) : void 0;
  }
}
function Y0(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function vN(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, o, l, s, c = [], f = !0, d = !1;
    try {
      if (l = (r = r.call(e)).next, t !== 0) for (; !(f = (n = l.call(r)).done) && (c.push(n.value), c.length !== t); f = !0) ;
    } catch (h) {
      d = !0, o = h;
    } finally {
      try {
        if (!f && r.return != null && (s = r.return(), Object(s) !== s)) return;
      } finally {
        if (d) throw o;
      }
    }
    return c;
  }
}
function hN(e) {
  if (Array.isArray(e)) return e;
}
function pN(e) {
  return Array.isArray(e) && Jr(e[0]) && Jr(e[1]) ? e.join(" ~ ") : e;
}
var ya = {
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
function mN(e, t) {
  return t == null ? e : uc(e, t);
}
var yN = (e) => {
  var t = e.separator, r = t === void 0 ? ya.separator : t, n = e.contentStyle, o = e.itemStyle, l = e.labelStyle, s = l === void 0 ? ya.labelStyle : l, c = e.payload, f = e.formatter, d = e.itemSorter, h = e.wrapperClassName, p = e.labelClassName, y = e.label, x = e.labelFormatter, A = e.accessibilityLayer, S = A === void 0 ? ya.accessibilityLayer : A, b = () => {
    if (c && c.length) {
      var F = {
        padding: 0,
        margin: 0
      }, K = mN(c, d), V = K.map((q, W) => {
        if (!q || q.type === "none")
          return null;
        var ie = q.formatter || f || pN, re = q.value, we = q.name, ve = re, ae = we;
        if (ie) {
          var U = ie(re, we, q, W, c);
          if (Array.isArray(U)) {
            var te = cN(U, 2);
            ve = te[0], ae = te[1];
          } else if (U != null)
            ve = U;
          else
            return null;
        }
        var Y = zo(zo({}, ya.itemStyle), {}, {
          color: q.color || ya.itemStyle.color
        }, o);
        return /* @__PURE__ */ w.createElement("li", {
          className: "recharts-tooltip-item",
          key: "tooltip-item-".concat(W),
          style: Y
        }, Jr(ae) ? /* @__PURE__ */ w.createElement("span", {
          className: "recharts-tooltip-item-name"
        }, ae) : null, Jr(ae) ? /* @__PURE__ */ w.createElement("span", {
          className: "recharts-tooltip-item-separator"
        }, r) : null, /* @__PURE__ */ w.createElement("span", {
          className: "recharts-tooltip-item-value"
        }, ve), /* @__PURE__ */ w.createElement("span", {
          className: "recharts-tooltip-item-unit"
        }, q.unit || ""));
      });
      return /* @__PURE__ */ w.createElement("ul", {
        className: "recharts-tooltip-item-list",
        style: F
      }, V);
    }
    return null;
  }, E = zo(zo({}, ya.contentStyle), n), k = zo({
    margin: 0
  }, s), C = !st(y), j = C ? y : "", T = ze("recharts-default-tooltip", h), O = ze("recharts-tooltip-label", p);
  C && x && c !== void 0 && c !== null && (j = x(y, c));
  var _ = S ? {
    role: "status",
    "aria-live": "assertive"
  } : {};
  return /* @__PURE__ */ w.createElement("div", Yv({
    className: T,
    style: E
  }, _), /* @__PURE__ */ w.createElement("p", {
    className: O,
    style: k
  }, /* @__PURE__ */ w.isValidElement(j) ? j : "".concat(j)), b());
}, Bo = "recharts-tooltip-wrapper", gN = {
  visibility: "hidden"
};
function xN(e) {
  var t = e.coordinate, r = e.translateX, n = e.translateY;
  return ze(Bo, {
    ["".concat(Bo, "-right")]: le(r) && t && le(t.x) && r >= t.x,
    ["".concat(Bo, "-left")]: le(r) && t && le(t.x) && r < t.x,
    ["".concat(Bo, "-bottom")]: le(n) && t && le(t.y) && n >= t.y,
    ["".concat(Bo, "-top")]: le(n) && t && le(t.y) && n < t.y
  });
}
function G0(e) {
  var t = e.allowEscapeViewBox, r = e.coordinate, n = e.key, o = e.offset, l = e.position, s = e.reverseDirection, c = e.tooltipDimension, f = e.viewBox, d = e.viewBoxDimension;
  if (l && le(l[n]))
    return l[n];
  var h = r[n] - c - (o > 0 ? o : 0), p = r[n] + o;
  if (t[n])
    return s[n] ? h : p;
  var y = f[n];
  if (y == null)
    return 0;
  if (s[n]) {
    var x = h, A = y;
    return x < A ? Math.max(p, y) : Math.max(h, y);
  }
  if (d == null)
    return 0;
  var S = p + c, b = y + d;
  return S > b ? Math.max(h, y) : Math.max(p, y);
}
function wN(e) {
  var t = e.translateX, r = e.translateY, n = e.useTranslate3d;
  return {
    transform: n ? "translate3d(".concat(t, "px, ").concat(r, "px, 0)") : "translate(".concat(t, "px, ").concat(r, "px)")
  };
}
function bN(e) {
  var t = e.allowEscapeViewBox, r = e.coordinate, n = e.offsetTop, o = e.offsetLeft, l = e.position, s = e.reverseDirection, c = e.tooltipBox, f = e.useTranslate3d, d = e.viewBox, h, p, y;
  return c && c.height > 0 && c.width > 0 && r ? (p = G0({
    allowEscapeViewBox: t,
    coordinate: r,
    key: "x",
    offset: o,
    position: l,
    reverseDirection: s,
    tooltipDimension: c.width,
    viewBox: d,
    viewBoxDimension: d.width
  }), y = G0({
    allowEscapeViewBox: t,
    coordinate: r,
    key: "y",
    offset: n,
    position: l,
    reverseDirection: s,
    tooltipDimension: c.height,
    viewBox: d,
    viewBoxDimension: d.height
  }), h = wN({
    translateX: p,
    translateY: y,
    useTranslate3d: f
  })) : h = gN, {
    cssProperties: h,
    cssClasses: xN({
      translateX: p,
      translateY: y,
      coordinate: r
    })
  };
}
var SN = () => !(typeof window < "u" && window.document && window.document.createElement && window.setTimeout), Al = {
  isSsr: SN()
};
function AN(e, t) {
  return kN(e) || ON(e, t) || EN(e, t) || PN();
}
function PN() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function EN(e, t) {
  if (e) {
    if (typeof e == "string") return X0(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? X0(e, t) : void 0;
  }
}
function X0(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function ON(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, o, l, s, c = [], f = !0, d = !1;
    try {
      if (l = (r = r.call(e)).next, t !== 0) for (; !(f = (n = l.call(r)).done) && (c.push(n.value), c.length !== t); f = !0) ;
    } catch (h) {
      d = !0, o = h;
    } finally {
      try {
        if (!f && r.return != null && (s = r.return(), Object(s) !== s)) return;
      } finally {
        if (d) throw o;
      }
    }
    return c;
  }
}
function kN(e) {
  if (Array.isArray(e)) return e;
}
function FS() {
  var e = w.useState(() => Al.isSsr || !window.matchMedia ? !1 : window.matchMedia("(prefers-reduced-motion: reduce)").matches), t = AN(e, 2), r = t[0], n = t[1];
  return w.useEffect(() => {
    if (window.matchMedia) {
      var o = window.matchMedia("(prefers-reduced-motion: reduce)"), l = () => {
        n(o.matches);
      };
      return o.addEventListener("change", l), () => {
        o.removeEventListener("change", l);
      };
    }
  }, []), r;
}
function q0(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function ga(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? q0(Object(r), !0).forEach(function(n) {
      _N(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : q0(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function _N(e, t, r) {
  return (t = CN(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function CN(e) {
  var t = IN(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function IN(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function jN(e, t) {
  return DN(e) || MN(e, t) || NN(e, t) || TN();
}
function TN() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function NN(e, t) {
  if (e) {
    if (typeof e == "string") return Q0(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? Q0(e, t) : void 0;
  }
}
function Q0(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function MN(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, o, l, s, c = [], f = !0, d = !1;
    try {
      if (l = (r = r.call(e)).next, t !== 0) for (; !(f = (n = l.call(r)).done) && (c.push(n.value), c.length !== t); f = !0) ;
    } catch (h) {
      d = !0, o = h;
    } finally {
      try {
        if (!f && r.return != null && (s = r.return(), Object(s) !== s)) return;
      } finally {
        if (d) throw o;
      }
    }
    return c;
  }
}
function DN(e) {
  if (Array.isArray(e)) return e;
}
function $N(e) {
  if (!(e.prefersReducedMotion && e.isAnimationActive === "auto") && e.isAnimationActive && e.active) {
    var t = typeof e.animationEasing == "string" ? e.animationEasing : "ease";
    return "transform ".concat(e.animationDuration, "ms ").concat(t);
  }
}
function LN(e) {
  var t, r, n, o, l, s, c = FS(), f = w.useState(() => ({
    dismissed: !1,
    dismissedAtCoordinate: {
      x: 0,
      y: 0
    }
  })), d = jN(f, 2), h = d[0], p = d[1];
  w.useEffect(() => {
    var E = (k) => {
      if (k.key === "Escape") {
        var C, j, T, O;
        p({
          dismissed: !0,
          dismissedAtCoordinate: {
            x: (C = (j = e.coordinate) === null || j === void 0 ? void 0 : j.x) !== null && C !== void 0 ? C : 0,
            y: (T = (O = e.coordinate) === null || O === void 0 ? void 0 : O.y) !== null && T !== void 0 ? T : 0
          }
        });
      }
    };
    return document.addEventListener("keydown", E), () => {
      document.removeEventListener("keydown", E);
    };
  }, [(t = e.coordinate) === null || t === void 0 ? void 0 : t.x, (r = e.coordinate) === null || r === void 0 ? void 0 : r.y]), h.dismissed && (((n = (o = e.coordinate) === null || o === void 0 ? void 0 : o.x) !== null && n !== void 0 ? n : 0) !== h.dismissedAtCoordinate.x || ((l = (s = e.coordinate) === null || s === void 0 ? void 0 : s.y) !== null && l !== void 0 ? l : 0) !== h.dismissedAtCoordinate.y) && p(ga(ga({}, h), {}, {
    dismissed: !1
  }));
  var y = bN({
    allowEscapeViewBox: e.allowEscapeViewBox,
    coordinate: e.coordinate,
    offsetLeft: typeof e.offset == "number" ? e.offset : e.offset.x,
    offsetTop: typeof e.offset == "number" ? e.offset : e.offset.y,
    position: e.position,
    reverseDirection: e.reverseDirection,
    tooltipBox: e.lastBoundingBox,
    useTranslate3d: e.useTranslate3d,
    viewBox: e.viewBox
  }), x = y.cssClasses, A = y.cssProperties, S = e.hasPortalFromProps ? {} : ga(ga({
    transition: $N({
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
  }), b = ga(ga({}, S), {}, {
    visibility: !h.dismissed && e.active && e.hasPayload ? "visible" : "hidden"
  }, e.wrapperStyle);
  return /* @__PURE__ */ w.createElement("div", {
    // @ts-expect-error TypeScript library does not recognize xmlns attribute, but it's required for an HTML chunk inside SVG.
    xmlns: "http://www.w3.org/1999/xhtml",
    tabIndex: -1,
    className: x,
    style: b,
    ref: e.innerRef
  }, e.children);
}
var RN = /* @__PURE__ */ w.memo(LN), WS = () => {
  var e;
  return (e = he((t) => t.rootProps.accessibilityLayer)) !== null && e !== void 0 ? e : !0;
};
function Gv() {
  return Gv = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Gv.apply(null, arguments);
}
function Z0(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function J0(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Z0(Object(r), !0).forEach(function(n) {
      zN(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Z0(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function zN(e, t, r) {
  return (t = BN(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function BN(e) {
  var t = FN(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function FN(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var ex = {
  curveBasisClosed: pC,
  curveBasisOpen: mC,
  curveBasis: hC,
  curveBumpX: dC,
  curveBumpY: vC,
  curveLinearClosed: yC,
  curveLinear: oc,
  curveMonotoneX: gC,
  curveMonotoneY: xC,
  curveNatural: wC,
  curveStep: bC,
  curveStepAfter: AC,
  curveStepBefore: SC
}, _s = (e) => ke(e.x) && ke(e.y), tx = (e) => e.base != null && _s(e.base) && _s(e), Fo = (e) => e.x, Wo = (e) => e.y, WN = (e, t) => {
  if (typeof e == "function")
    return e;
  var r = "curve".concat(bh(e));
  if ((r === "curveMonotone" || r === "curveBump") && t) {
    var n = ex["".concat(r).concat(t === "vertical" ? "Y" : "X")];
    if (n)
      return n;
  }
  return ex[r] || oc;
}, rx = {
  connectNulls: !1,
  type: "linear"
}, UN = (e) => {
  var t = e.type, r = t === void 0 ? rx.type : t, n = e.points, o = n === void 0 ? [] : n, l = e.baseLine, s = e.layout, c = e.connectNulls, f = c === void 0 ? rx.connectNulls : c, d = WN(r, s), h = f ? o.filter(_s) : o;
  if (Array.isArray(l)) {
    var p, y = o.map((E, k) => J0(J0({}, E), {}, {
      base: l[k]
    }));
    s === "vertical" ? p = Ku().y(Wo).x1(Fo).x0((E) => E.base.x) : p = Ku().x(Fo).y1(Wo).y0((E) => E.base.y);
    var x = p.defined(tx).curve(d), A = f ? y.filter(tx) : y;
    return x(A);
  }
  var S;
  s === "vertical" && le(l) ? S = Ku().y(Wo).x1(Fo).x0(l) : le(l) ? S = Ku().x(Fo).y1(Wo).y0(l) : S = pb().x(Fo).y(Wo);
  var b = S.defined(_s).curve(d);
  return b(h);
}, Jo = (e) => {
  var t = e.className, r = e.points, n = e.path, o = e.pathRef, l = Wi();
  if ((!r || !r.length) && !n)
    return null;
  var s = {
    type: e.type,
    points: e.points,
    baseLine: e.baseLine,
    layout: e.layout || l,
    connectNulls: e.connectNulls
  }, c = r && r.length ? UN(s) : n;
  return /* @__PURE__ */ w.createElement("path", Gv({}, gr(e), Ph(e), {
    className: ze("recharts-curve", t),
    d: c === null ? void 0 : c,
    ref: o
  }));
}, HN = ["x", "y", "top", "left", "width", "height", "className"];
function Xv() {
  return Xv = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Xv.apply(null, arguments);
}
function nx(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function KN(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? nx(Object(r), !0).forEach(function(n) {
      VN(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : nx(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function VN(e, t, r) {
  return (t = YN(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function YN(e) {
  var t = GN(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function GN(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function XN(e, t) {
  if (e == null) return {};
  var r, n, o = qN(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (o[r] = e[r]);
  }
  return o;
}
function qN(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
var QN = (e, t, r, n, o, l) => "M".concat(e, ",").concat(o, "v").concat(n, "M").concat(l, ",").concat(t, "h").concat(r), ZN = (e) => {
  var t = e.x, r = t === void 0 ? 0 : t, n = e.y, o = n === void 0 ? 0 : n, l = e.top, s = l === void 0 ? 0 : l, c = e.left, f = c === void 0 ? 0 : c, d = e.width, h = d === void 0 ? 0 : d, p = e.height, y = p === void 0 ? 0 : p, x = e.className, A = XN(e, HN), S = KN({
    x: r,
    y: o,
    top: s,
    left: f,
    width: h,
    height: y
  }, A);
  return !le(r) || !le(o) || !le(h) || !le(y) || !le(s) || !le(f) ? null : /* @__PURE__ */ w.createElement("path", Xv({}, ar(S), {
    className: ze("recharts-cross", x),
    d: QN(r, o, h, y, s, f)
  }));
};
function JN(e, t, r, n) {
  var o = n / 2;
  return {
    stroke: "none",
    fill: "#ccc",
    x: e === "horizontal" ? t.x - o : r.left + 0.5,
    y: e === "horizontal" ? r.top + 0.5 : t.y - o,
    width: e === "horizontal" ? n : r.width - 1,
    height: e === "horizontal" ? r.height - 1 : n
  };
}
var Cs = 1e-4, US = (e, t) => [0, 3 * e, 3 * t - 6 * e, 3 * e - 3 * t + 1], HS = (e, t) => e.map((r, n) => r * t ** n).reduce((r, n) => r + n), ix = (e, t) => (r) => {
  var n = US(e, t);
  return HS(n, r);
}, eM = (e, t) => (r) => {
  var n = US(e, t), o = [...n.map((l, s) => l * s).slice(1), 0];
  return HS(o, r);
}, tM = (e) => {
  var t, r = e.split("(");
  if (r.length !== 2 || r[0] !== "cubic-bezier")
    return null;
  var n = (t = r[1]) === null || t === void 0 || (t = t.split(")")[0]) === null || t === void 0 ? void 0 : t.split(",");
  if (n == null || n.length !== 4)
    return null;
  var o = n.map((l) => parseFloat(l));
  return [o[0], o[1], o[2], o[3]];
}, rM = function() {
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
        var o = tM(r[0]);
        if (o)
          return o;
      }
    }
  return r.length === 4 ? r : [0, 0, 1, 1];
}, nM = (e, t, r, n) => {
  var o = ix(e, r), l = ix(t, n), s = eM(e, r), c = (d) => d > 1 ? 1 : d < 0 ? 0 : d, f = (d) => {
    for (var h = d > 1 ? 1 : d, p = h, y = 0; y < 8; ++y) {
      var x = o(p) - h, A = s(p);
      if (Math.abs(x - h) < Cs || A < Cs)
        return l(p);
      p = c(p - x / A);
    }
    return l(p);
  };
  return f.isStepper = !1, f;
}, ax = function() {
  return nM(...rM(...arguments));
}, iM = function() {
  for (var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = t.stiff, n = r === void 0 ? 100 : r, o = t.damping, l = o === void 0 ? 8 : o, s = t.dt, c = s === void 0 ? 16.67 : s, f = 1, d = [0], h = 0, p = 0, y = 1e4, x = 0; x < y; ) {
    var A = -(h - f) * n, S = p * l;
    if (p += (A - S) * c / 1e3, h += p * c / 1e3, d.push(h), Math.abs(h - f) < Cs && Math.abs(p) < Cs)
      break;
    x++;
  }
  d[d.length - 1] = f;
  var b = d.length - 1;
  return (E) => {
    var k, C, j;
    if (E <= 0) return 0;
    if (E >= 1) return f;
    var T = E * b, O = Math.floor(T), _ = T - O;
    return ((k = d[O]) !== null && k !== void 0 ? k : 0) + (((C = d[O + 1]) !== null && C !== void 0 ? C : 0) - ((j = d[O]) !== null && j !== void 0 ? j : 0)) * _;
  };
}, aM = (e) => {
  if (typeof e == "string")
    switch (e) {
      case "ease":
      case "ease-in-out":
      case "ease-out":
      case "ease-in":
      case "linear":
        return ax(e);
      case "spring":
        return iM();
      default:
        if (e.split("(")[0] === "cubic-bezier")
          return ax(e);
    }
  return typeof e == "function" ? e : null;
}, oM = (e, t, r) => {
  var n, o = (l) => {
    var s = t.tick(l);
    if (t.getState() === "active") {
      if (r(t.getInterpolated()), t.getProgress() === 1) {
        t.complete(), n = void 0;
        return;
      }
      n = e.setTimeout(o, s);
      return;
    }
    n = e.setTimeout(o, s);
  };
  return n = e.setTimeout(o, 0), () => {
    var l;
    return (l = n) === null || l === void 0 ? void 0 : l();
  };
}, KS = /* @__PURE__ */ w.createContext(oM);
KS.Provider;
function lM(e) {
  var t = w.useContext(KS);
  return w.useMemo(() => e ?? t, [e, t]);
}
function uM(e, t, r) {
  return (t = sM(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function sM(e) {
  var t = cM(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function cM(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var ox = "init", lx = "pending", ux = "active", fM = "completed";
function av(e) {
  return Math.max(0, e);
}
class dM {
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
    uM(this, "state", ox), this.animationId = t.animationId, this.onAnimationEnd = t.onAnimationEnd, this.animationDuration = av(t.animationDuration), this.animationBegin = av(t.animationBegin), this.progress = 0, this.from = t.from, this.to = t.to, this.easing = t.easing, (r = t.onAnimationStart) === null || r === void 0 || r.call(t);
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
    if (this.getState() === ox)
      return this.state = lx, this.beginStartedTime = t, this.animationBegin;
    if (this.getState() === lx) {
      if (this.beginStartedTime == null)
        throw new Error();
      var r = t - this.beginStartedTime;
      return r >= this.animationBegin ? (this.state = ux, this.animationStartedTime = t, this.nextAnimationUpdate(0)) : av(this.animationBegin - r);
    }
    if (this.getState() === ux) {
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
    this.state = fM;
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
class vM extends dM {
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
    return this.easing(rr(this.getFrom(), this.getTo(), this.getProgress()));
  }
}
class hM {
  setTimeout(t) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0, n = performance.now(), o = null, l = (s) => {
      s - n >= r ? t(s) : o = requestAnimationFrame(l);
    };
    return o = requestAnimationFrame(l), () => {
      o != null && cancelAnimationFrame(o);
    };
  }
}
function pM(e, t) {
  return xM(e) || gM(e, t) || yM(e, t) || mM();
}
function mM() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function yM(e, t) {
  if (e) {
    if (typeof e == "string") return sx(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? sx(e, t) : void 0;
  }
}
function sx(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function gM(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, o, l, s, c = [], f = !0, d = !1;
    try {
      if (l = (r = r.call(e)).next, t !== 0) for (; !(f = (n = l.call(r)).done) && (c.push(n.value), c.length !== t); f = !0) ;
    } catch (h) {
      d = !0, o = h;
    } finally {
      try {
        if (!f && r.return != null && (s = r.return(), Object(s) !== s)) return;
      } finally {
        if (d) throw o;
      }
    }
    return c;
  }
}
function xM(e) {
  if (Array.isArray(e)) return e;
}
var wM = {
  begin: 0,
  duration: 1e3,
  easing: "ease",
  isActive: !0,
  canBegin: !0,
  onAnimationEnd: () => {
  },
  onAnimationStart: () => {
  }
}, cx = 0, ov = 1;
function VS(e) {
  var t = qt(e, wM), r = t.animationId, n = t.isActive, o = t.canBegin, l = t.duration, s = t.easing, c = t.begin, f = t.onAnimationEnd, d = t.onAnimationStart, h = t.children, p = FS(), y = n === "auto" ? !Al.isSsr && !p : n, x = lM(t.animationController), A = w.useState(y ? cx : ov), S = pM(A, 2), b = S[0], E = S[1];
  return w.useEffect(() => {
    y || E(ov);
  }, [y]), w.useEffect(() => {
    var k = aM(s);
    if (!y || !o || k == null)
      return Fi;
    var C = new hM(), j = new vM({
      animationId: r,
      easing: k,
      animationDuration: l,
      animationBegin: c,
      onAnimationStart: d,
      onAnimationEnd: f,
      from: cx,
      to: ov
    });
    return x(C, j, E);
  }, [x, r, y, o, l, s, c, d, f]), h(Number(b));
}
function YS(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "animation-", r = w.useRef(il(t)), n = w.useRef(e);
  return n.current !== e && (r.current = il(t), n.current = e), r.current;
}
var bM = (e) => e.replace(/([A-Z])/g, (t) => "-".concat(t.toLowerCase())), SM = (e, t, r) => e.map((n) => "".concat(bM(n), " ").concat(t, "ms ").concat(r)).join(","), AM = ["radius"], PM = ["radius"], fx, dx, vx, hx, px, mx, yx, gx, xx, wx;
function bx(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Sx(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? bx(Object(r), !0).forEach(function(n) {
      EM(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : bx(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function EM(e, t, r) {
  return (t = OM(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function OM(e) {
  var t = kM(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function kM(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function Is() {
  return Is = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Is.apply(null, arguments);
}
function Ax(e, t) {
  if (e == null) return {};
  var r, n, o = _M(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (o[r] = e[r]);
  }
  return o;
}
function _M(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
function CM(e, t) {
  return NM(e) || TM(e, t) || jM(e, t) || IM();
}
function IM() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function jM(e, t) {
  if (e) {
    if (typeof e == "string") return Px(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? Px(e, t) : void 0;
  }
}
function Px(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function TM(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, o, l, s, c = [], f = !0, d = !1;
    try {
      if (l = (r = r.call(e)).next, t !== 0) for (; !(f = (n = l.call(r)).done) && (c.push(n.value), c.length !== t); f = !0) ;
    } catch (h) {
      d = !0, o = h;
    } finally {
      try {
        if (!f && r.return != null && (s = r.return(), Object(s) !== s)) return;
      } finally {
        if (d) throw o;
      }
    }
    return c;
  }
}
function NM(e) {
  if (Array.isArray(e)) return e;
}
function Kr(e, t) {
  return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } }));
}
var Ex = (e, t, r, n, o) => {
  var l = pn(r), s = pn(n), c = Math.min(Math.abs(l) / 2, Math.abs(s) / 2), f = s >= 0 ? 1 : -1, d = l >= 0 ? 1 : -1, h = s >= 0 && l >= 0 || s < 0 && l < 0 ? 1 : 0, p;
  if (c > 0 && Array.isArray(o)) {
    for (var y = [0, 0, 0, 0], x = 0, A = 4; x < A; x++) {
      var S, b = (S = o[x]) !== null && S !== void 0 ? S : 0;
      y[x] = b > c ? c : b;
    }
    p = St(fx || (fx = Kr(["M", ",", ""])), e, t + f * y[0]), y[0] > 0 && (p += St(dx || (dx = Kr(["A ", ",", ",0,0,", ",", ",", ""])), y[0], y[0], h, e + d * y[0], t)), p += St(vx || (vx = Kr(["L ", ",", ""])), e + r - d * y[1], t), y[1] > 0 && (p += St(hx || (hx = Kr(["A ", ",", ",0,0,", `,
        `, ",", ""])), y[1], y[1], h, e + r, t + f * y[1])), p += St(px || (px = Kr(["L ", ",", ""])), e + r, t + n - f * y[2]), y[2] > 0 && (p += St(mx || (mx = Kr(["A ", ",", ",0,0,", `,
        `, ",", ""])), y[2], y[2], h, e + r - d * y[2], t + n)), p += St(yx || (yx = Kr(["L ", ",", ""])), e + d * y[3], t + n), y[3] > 0 && (p += St(gx || (gx = Kr(["A ", ",", ",0,0,", `,
        `, ",", ""])), y[3], y[3], h, e, t + n - f * y[3])), p += "Z";
  } else if (c > 0 && o === +o && o > 0) {
    var E = Math.min(c, o);
    p = St(xx || (xx = Kr(["M ", ",", `
            A `, ",", ",0,0,", ",", ",", `
            L `, ",", `
            A `, ",", ",0,0,", ",", ",", `
            L `, ",", `
            A `, ",", ",0,0,", ",", ",", `
            L `, ",", `
            A `, ",", ",0,0,", ",", ",", " Z"])), e, t + f * E, E, E, h, e + d * E, t, e + r - d * E, t, E, E, h, e + r, t + f * E, e + r, t + n - f * E, E, E, h, e + r - d * E, t + n, e + d * E, t + n, E, E, h, e, t + n - f * E);
  } else
    p = St(wx || (wx = Kr(["M ", ",", " h ", " v ", " h ", " Z"])), e, t, r, n, -r);
  return p;
}, Ox = {
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
}, MM = (e) => {
  var t = qt(e, Ox), r = w.useRef(null), n = w.useState(-1), o = CM(n, 2), l = o[0], s = o[1];
  w.useEffect(() => {
    if (r.current && r.current.getTotalLength)
      try {
        var U = r.current.getTotalLength();
        U && s(U);
      } catch {
      }
  }, []);
  var c = t.x, f = t.y, d = t.width, h = t.height, p = t.radius, y = t.className, x = t.animationEasing, A = t.animationDuration, S = t.animationBegin, b = t.isAnimationActive, E = t.isUpdateAnimationActive, k = w.useRef(d), C = w.useRef(h), j = w.useRef(c), T = w.useRef(f), O = w.useMemo(() => ({
    x: c,
    y: f,
    width: d,
    height: h,
    radius: p
  }), [c, f, d, h, p]), _ = YS(O, "rectangle-");
  if (c !== +c || f !== +f || d !== +d || h !== +h || d === 0 || h === 0)
    return null;
  var F = ze("recharts-rectangle", y);
  if (!E) {
    var K = ar(t);
    K.radius;
    var V = Ax(K, AM);
    return /* @__PURE__ */ w.createElement("path", Is({}, V, {
      x: pn(c),
      y: pn(f),
      width: pn(d),
      height: pn(h),
      radius: typeof p == "number" ? p : void 0,
      className: F,
      d: Ex(c, f, d, h, p)
    }));
  }
  var q = k.current, W = C.current, ie = j.current, re = T.current, we = "0px ".concat(l === -1 ? 1 : l, "px"), ve = "".concat(l, "px ").concat(l, "px"), ae = SM(["strokeDasharray"], A, typeof x == "string" ? x : Ox.animationEasing);
  return /* @__PURE__ */ w.createElement(VS, {
    animationId: _,
    key: _,
    canBegin: l > 0,
    duration: A,
    easing: x,
    isActive: E,
    begin: S
  }, (U) => {
    var te = rr(q, d, U), Y = rr(W, h, U), $ = rr(ie, c, U), H = rr(re, f, U);
    r.current && (k.current = te, C.current = Y, j.current = $, T.current = H);
    var fe;
    b ? U > 0 ? fe = {
      transition: ae,
      strokeDasharray: ve
    } : fe = {
      strokeDasharray: we
    } : fe = {
      strokeDasharray: ve
    };
    var ge = ar(t);
    ge.radius;
    var Ae = Ax(ge, PM);
    return /* @__PURE__ */ w.createElement("path", Is({}, Ae, {
      radius: typeof p == "number" ? p : void 0,
      className: F,
      d: Ex($, H, te, Y, p),
      ref: r,
      style: Sx(Sx({}, fe), t.style)
    }));
  });
};
function kx(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function _x(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? kx(Object(r), !0).forEach(function(n) {
      DM(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : kx(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function DM(e, t, r) {
  return (t = $M(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function $M(e) {
  var t = LM(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function LM(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var js = Math.PI / 180, RM = (e) => e * 180 / Math.PI, Pt = (e, t, r, n) => ({
  x: e + Math.cos(-js * n) * r,
  y: t + Math.sin(-js * n) * r
}), zM = function(t, r) {
  var n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
  return Math.min(Math.abs(t - (n.left || 0) - (n.right || 0)), Math.abs(r - (n.top || 0) - (n.bottom || 0))) / 2;
}, BM = (e, t) => {
  var r = e.x, n = e.y, o = t.x, l = t.y;
  return Math.sqrt((r - o) ** 2 + (n - l) ** 2);
}, FM = (e, t) => {
  var r = e.x, n = e.y, o = t.cx, l = t.cy, s = BM({
    x: r,
    y: n
  }, {
    x: o,
    y: l
  });
  if (s <= 0)
    return {
      radius: s,
      angle: 0
    };
  var c = (r - o) / s, f = Math.acos(c);
  return n > l && (f = 2 * Math.PI - f), {
    radius: s,
    angle: RM(f),
    angleInRadian: f
  };
}, WM = (e) => {
  var t = e.startAngle, r = e.endAngle, n = Math.floor(t / 360), o = Math.floor(r / 360), l = Math.min(n, o);
  return {
    startAngle: t - l * 360,
    endAngle: r - l * 360
  };
}, UM = (e, t) => {
  var r = t.startAngle, n = t.endAngle, o = Math.floor(r / 360), l = Math.floor(n / 360), s = Math.min(o, l);
  return e + s * 360;
}, HM = (e, t) => {
  var r = e.relativeX, n = e.relativeY, o = FM({
    x: r,
    y: n
  }, t), l = o.radius, s = o.angle, c = t.innerRadius, f = t.outerRadius;
  if (l < c || l > f || l === 0)
    return null;
  var d = WM(t), h = d.startAngle, p = d.endAngle, y = s, x;
  if (h <= p) {
    for (; y > p; )
      y -= 360;
    for (; y < h; )
      y += 360;
    x = y >= h && y <= p;
  } else {
    for (; y > h; )
      y -= 360;
    for (; y < p; )
      y += 360;
    x = y >= p && y <= h;
  }
  return x ? _x(_x({}, t), {}, {
    radius: l,
    angle: UM(y, t)
  }) : null;
};
function GS(e) {
  var t = e.cx, r = e.cy, n = e.radius, o = e.startAngle, l = e.endAngle, s = Pt(t, r, n, o), c = Pt(t, r, n, l);
  return {
    points: [s, c],
    cx: t,
    cy: r,
    radius: n,
    startAngle: o,
    endAngle: l
  };
}
var Cx, Ix, jx, Tx, Nx, Mx, Dx;
function qv() {
  return qv = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, qv.apply(null, arguments);
}
function ki(e, t) {
  return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } }));
}
var KM = (e, t) => {
  var r = pr(t - e), n = Math.min(Math.abs(t - e), 359.999);
  return r * n;
}, Zu = (e) => {
  var t = e.cx, r = e.cy, n = e.radius, o = e.angle, l = e.sign, s = e.isExternal, c = e.cornerRadius, f = e.cornerIsExternal, d = c * (s ? 1 : -1) + n, h = Math.asin(c / d) / js, p = f ? o : o + l * h, y = Pt(t, r, d, p), x = Pt(t, r, n, p), A = f ? o - l * h : o, S = Pt(t, r, d * Math.cos(h * js), A);
  return {
    center: y,
    circleTangency: x,
    lineTangency: S,
    theta: h
  };
}, XS = (e) => {
  var t = e.cx, r = e.cy, n = e.innerRadius, o = e.outerRadius, l = e.startAngle, s = e.endAngle, c = KM(l, s), f = l + c, d = Pt(t, r, o, l), h = Pt(t, r, o, f), p = St(Cx || (Cx = ki(["M ", ",", `
    A `, ",", `,0,
    `, ",", `,
    `, ",", `
  `])), d.x, d.y, o, o, +(Math.abs(c) > 180), +(l > f), h.x, h.y);
  if (n > 0) {
    var y = Pt(t, r, n, l), x = Pt(t, r, n, f);
    p += St(Ix || (Ix = ki(["L ", ",", `
            A `, ",", `,0,
            `, ",", `,
            `, ",", " Z"])), x.x, x.y, n, n, +(Math.abs(c) > 180), +(l <= f), y.x, y.y);
  } else
    p += St(jx || (jx = ki(["L ", ",", " Z"])), t, r);
  return p;
}, VM = (e) => {
  var t = e.cx, r = e.cy, n = e.innerRadius, o = e.outerRadius, l = e.cornerRadius, s = e.forceCornerRadius, c = e.cornerIsExternal, f = e.startAngle, d = e.endAngle, h = pr(d - f), p = Zu({
    cx: t,
    cy: r,
    radius: o,
    angle: f,
    sign: h,
    cornerRadius: l,
    cornerIsExternal: c
  }), y = p.circleTangency, x = p.lineTangency, A = p.theta, S = Zu({
    cx: t,
    cy: r,
    radius: o,
    angle: d,
    sign: -h,
    cornerRadius: l,
    cornerIsExternal: c
  }), b = S.circleTangency, E = S.lineTangency, k = S.theta, C = c ? Math.abs(f - d) : Math.abs(f - d) - A - k;
  if (C < 0)
    return s ? St(Tx || (Tx = ki(["M ", ",", `
        a`, ",", ",0,0,1,", `,0
        a`, ",", ",0,0,1,", `,0
      `])), x.x, x.y, l, l, l * 2, l, l, -l * 2) : XS({
      cx: t,
      cy: r,
      innerRadius: n,
      outerRadius: o,
      startAngle: f,
      endAngle: d
    });
  var j = St(Nx || (Nx = ki(["M ", ",", `
    A`, ",", ",0,0,", ",", ",", `
    A`, ",", ",0,", ",", ",", ",", `
    A`, ",", ",0,0,", ",", ",", `
  `])), x.x, x.y, l, l, +(h < 0), y.x, y.y, o, o, +(C > 180), +(h < 0), b.x, b.y, l, l, +(h < 0), E.x, E.y);
  if (n > 0) {
    var T = Zu({
      cx: t,
      cy: r,
      radius: n,
      angle: f,
      sign: h,
      isExternal: !0,
      cornerRadius: l,
      cornerIsExternal: c
    }), O = T.circleTangency, _ = T.lineTangency, F = T.theta, K = Zu({
      cx: t,
      cy: r,
      radius: n,
      angle: d,
      sign: -h,
      isExternal: !0,
      cornerRadius: l,
      cornerIsExternal: c
    }), V = K.circleTangency, q = K.lineTangency, W = K.theta, ie = c ? Math.abs(f - d) : Math.abs(f - d) - F - W;
    if (ie < 0 && l === 0)
      return "".concat(j, "L").concat(t, ",").concat(r, "Z");
    j += St(Mx || (Mx = ki(["L", ",", `
      A`, ",", ",0,0,", ",", ",", `
      A`, ",", ",0,", ",", ",", ",", `
      A`, ",", ",0,0,", ",", ",", "Z"])), q.x, q.y, l, l, +(h < 0), V.x, V.y, n, n, +(ie > 180), +(h > 0), O.x, O.y, l, l, +(h < 0), _.x, _.y);
  } else
    j += St(Dx || (Dx = ki(["L", ",", "Z"])), t, r);
  return j;
}, YM = {
  cx: 0,
  cy: 0,
  innerRadius: 0,
  outerRadius: 0,
  startAngle: 0,
  endAngle: 0,
  cornerRadius: 0,
  forceCornerRadius: !1,
  cornerIsExternal: !1
}, GM = (e) => {
  var t = qt(e, YM), r = t.cx, n = t.cy, o = t.innerRadius, l = t.outerRadius, s = t.cornerRadius, c = t.forceCornerRadius, f = t.cornerIsExternal, d = t.startAngle, h = t.endAngle, p = t.className;
  if (l < o || d === h)
    return null;
  var y = ze("recharts-sector", p), x = l - o, A = ni(s, x, 0, !0), S;
  return A > 0 && Math.abs(d - h) < 360 ? S = VM({
    cx: r,
    cy: n,
    innerRadius: o,
    outerRadius: l,
    cornerRadius: Math.min(A, x / 2),
    forceCornerRadius: c,
    cornerIsExternal: f,
    startAngle: d,
    endAngle: h
  }) : S = XS({
    cx: r,
    cy: n,
    innerRadius: o,
    outerRadius: l,
    startAngle: d,
    endAngle: h
  }), /* @__PURE__ */ w.createElement("path", qv({}, ar(t), {
    className: y,
    d: S
  }));
};
function XM(e, t, r) {
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
  if (Pb(t)) {
    if (e === "centric") {
      var n = t.cx, o = t.cy, l = t.innerRadius, s = t.outerRadius, c = t.angle, f = Pt(n, o, l, c), d = Pt(n, o, s, c);
      return [{
        x: f.x,
        y: f.y
      }, {
        x: d.x,
        y: d.y
      }];
    }
    return GS(t);
  }
}
function qM(e) {
  return xh(e) ? NaN : Number(e);
}
function lv(e) {
  return e ? (e = qM(e), e === 1 / 0 || e === -1 / 0 ? (e < 0 ? -1 : 1) * Number.MAX_VALUE : e === e ? e : 0) : e === 0 ? e : 0;
}
function qS(e, t, r) {
  r && typeof r != "number" && $v(e, t, r) && (t = r = void 0), e = lv(e), t === void 0 ? (t = e, e = 0) : t = lv(t), r = r === void 0 ? e < t ? 1 : -1 : lv(r);
  const n = Math.max(Math.ceil((t - e) / (r || 1)), 0), o = new Array(n);
  for (let l = 0; l < n; l++)
    o[l] = e, e += r;
  return o;
}
var Lr = (e) => e.chartData, zh = z([Lr], (e) => {
  var t = e.chartData != null ? e.chartData.length - 1 : 0;
  return {
    chartData: e.chartData,
    computedData: e.computedData,
    dataEndIndex: t,
    dataStartIndex: 0
  };
}), Pl = (e, t, r, n) => n ? zh(e) : Lr(e), QM = (e, t, r) => r ? zh(e) : Lr(e), ZM = z([Pl], (e) => {
  var t = e.chartData, r = e.dataStartIndex, n = e.dataEndIndex;
  return t != null ? t.slice(r, n + 1) : [];
});
z([zh], (e) => {
  var t = e.chartData, r = e.dataStartIndex, n = e.dataEndIndex;
  return t != null ? t.slice(r, n + 1) : [];
});
var JM = z([Lr], (e) => {
  var t = e.chartData, r = e.dataStartIndex, n = e.dataEndIndex;
  return t != null ? t.slice(r, n + 1) : [];
});
function Bh(e, t) {
  return n2(e) || r2(e, t) || t2(e, t) || e2();
}
function e2() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function t2(e, t) {
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
function r2(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, o, l, s, c = [], f = !0, d = !1;
    try {
      if (l = (r = r.call(e)).next, t !== 0) for (; !(f = (n = l.call(r)).done) && (c.push(n.value), c.length !== t); f = !0) ;
    } catch (h) {
      d = !0, o = h;
    } finally {
      try {
        if (!f && r.return != null && (s = r.return(), Object(s) !== s)) return;
      } finally {
        if (d) throw o;
      }
    }
    return c;
  }
}
function n2(e) {
  if (Array.isArray(e)) return e;
}
function qr(e) {
  if (Array.isArray(e) && e.length === 2) {
    var t = Bh(e, 2), r = t[0], n = t[1];
    if (ke(r) && ke(n))
      return !0;
  }
  return !1;
}
function Lx(e, t, r) {
  return r ? e : [Math.min(e[0], t[0]), Math.max(e[1], t[1])];
}
function QS(e, t) {
  if (t && typeof e != "function" && Array.isArray(e) && e.length === 2) {
    var r = Bh(e, 2), n = r[0], o = r[1], l, s;
    if (ke(n))
      l = n;
    else if (typeof n == "function")
      return;
    if (ke(o))
      s = o;
    else if (typeof o == "function")
      return;
    var c = [l, s];
    if (qr(c))
      return c;
  }
}
function i2(e, t, r) {
  if (!(!r && t == null)) {
    if (typeof e == "function" && t != null)
      try {
        var n = e(t, r);
        if (qr(n))
          return Lx(n, t, r);
      } catch {
      }
    if (Array.isArray(e) && e.length === 2) {
      var o = Bh(e, 2), l = o[0], s = o[1], c, f;
      if (l === "auto")
        t != null && (c = Math.min(...t));
      else if (le(l))
        c = l;
      else if (typeof l == "function")
        try {
          t != null && (c = l(t == null ? void 0 : t[0]));
        } catch {
        }
      else if (typeof l == "string" && D0.test(l)) {
        var d = D0.exec(l);
        if (d == null || d[1] == null || t == null)
          c = void 0;
        else {
          var h = +d[1];
          c = t[0] - h;
        }
      } else
        c = t == null ? void 0 : t[0];
      if (s === "auto")
        t != null && (f = Math.max(...t));
      else if (le(s))
        f = s;
      else if (typeof s == "function")
        try {
          t != null && (f = s(t == null ? void 0 : t[1]));
        } catch {
        }
      else if (typeof s == "string" && $0.test(s)) {
        var p = $0.exec(s);
        if (p == null || p[1] == null || t == null)
          f = void 0;
        else {
          var y = +p[1];
          f = t[1] + y;
        }
      } else
        f = t == null ? void 0 : t[1];
      var x = [c, f];
      if (qr(x))
        return t == null ? x : Lx(x, t, r);
    }
  }
}
var Fa = 1e9, a2 = {
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
}, Wh, Ve = !0, wr = "[DecimalError] ", Ti = wr + "Invalid argument: ", Fh = wr + "Exponent out of range: ", Wa = Math.floor, Pi = Math.pow, o2 = /^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i, tr, pt = 1e7, He = 7, ZS = 9007199254740991, Ts = Wa(ZS / He), ue = {};
ue.absoluteValue = ue.abs = function() {
  var e = new this.constructor(this);
  return e.s && (e.s = 1), e;
};
ue.comparedTo = ue.cmp = function(e) {
  var t, r, n, o, l = this;
  if (e = new l.constructor(e), l.s !== e.s) return l.s || -e.s;
  if (l.e !== e.e) return l.e > e.e ^ l.s < 0 ? 1 : -1;
  for (n = l.d.length, o = e.d.length, t = 0, r = n < o ? n : o; t < r; ++t)
    if (l.d[t] !== e.d[t]) return l.d[t] > e.d[t] ^ l.s < 0 ? 1 : -1;
  return n === o ? 0 : n > o ^ l.s < 0 ? 1 : -1;
};
ue.decimalPlaces = ue.dp = function() {
  var e = this, t = e.d.length - 1, r = (t - e.e) * He;
  if (t = e.d[t], t) for (; t % 10 == 0; t /= 10) r--;
  return r < 0 ? 0 : r;
};
ue.dividedBy = ue.div = function(e) {
  return gn(this, new this.constructor(e));
};
ue.dividedToIntegerBy = ue.idiv = function(e) {
  var t = this, r = t.constructor;
  return Le(gn(t, new r(e), 0, 1), r.precision);
};
ue.equals = ue.eq = function(e) {
  return !this.cmp(e);
};
ue.exponent = function() {
  return it(this);
};
ue.greaterThan = ue.gt = function(e) {
  return this.cmp(e) > 0;
};
ue.greaterThanOrEqualTo = ue.gte = function(e) {
  return this.cmp(e) >= 0;
};
ue.isInteger = ue.isint = function() {
  return this.e > this.d.length - 2;
};
ue.isNegative = ue.isneg = function() {
  return this.s < 0;
};
ue.isPositive = ue.ispos = function() {
  return this.s > 0;
};
ue.isZero = function() {
  return this.s === 0;
};
ue.lessThan = ue.lt = function(e) {
  return this.cmp(e) < 0;
};
ue.lessThanOrEqualTo = ue.lte = function(e) {
  return this.cmp(e) < 1;
};
ue.logarithm = ue.log = function(e) {
  var t, r = this, n = r.constructor, o = n.precision, l = o + 5;
  if (e === void 0)
    e = new n(10);
  else if (e = new n(e), e.s < 1 || e.eq(tr)) throw Error(wr + "NaN");
  if (r.s < 1) throw Error(wr + (r.s ? "NaN" : "-Infinity"));
  return r.eq(tr) ? new n(0) : (Ve = !1, t = gn(ul(r, l), ul(e, l), l), Ve = !0, Le(t, o));
};
ue.minus = ue.sub = function(e) {
  var t = this;
  return e = new t.constructor(e), t.s == e.s ? tA(t, e) : JS(t, (e.s = -e.s, e));
};
ue.modulo = ue.mod = function(e) {
  var t, r = this, n = r.constructor, o = n.precision;
  if (e = new n(e), !e.s) throw Error(wr + "NaN");
  return r.s ? (Ve = !1, t = gn(r, e, 0, 1).times(e), Ve = !0, r.minus(t)) : Le(new n(r), o);
};
ue.naturalExponential = ue.exp = function() {
  return eA(this);
};
ue.naturalLogarithm = ue.ln = function() {
  return ul(this);
};
ue.negated = ue.neg = function() {
  var e = new this.constructor(this);
  return e.s = -e.s || 0, e;
};
ue.plus = ue.add = function(e) {
  var t = this;
  return e = new t.constructor(e), t.s == e.s ? JS(t, e) : tA(t, (e.s = -e.s, e));
};
ue.precision = ue.sd = function(e) {
  var t, r, n, o = this;
  if (e !== void 0 && e !== !!e && e !== 1 && e !== 0) throw Error(Ti + e);
  if (t = it(o) + 1, n = o.d.length - 1, r = n * He + 1, n = o.d[n], n) {
    for (; n % 10 == 0; n /= 10) r--;
    for (n = o.d[0]; n >= 10; n /= 10) r++;
  }
  return e && t > r ? t : r;
};
ue.squareRoot = ue.sqrt = function() {
  var e, t, r, n, o, l, s, c = this, f = c.constructor;
  if (c.s < 1) {
    if (!c.s) return new f(0);
    throw Error(wr + "NaN");
  }
  for (e = it(c), Ve = !1, o = Math.sqrt(+c), o == 0 || o == 1 / 0 ? (t = Xr(c.d), (t.length + e) % 2 == 0 && (t += "0"), o = Math.sqrt(t), e = Wa((e + 1) / 2) - (e < 0 || e % 2), o == 1 / 0 ? t = "5e" + e : (t = o.toExponential(), t = t.slice(0, t.indexOf("e") + 1) + e), n = new f(t)) : n = new f(o.toString()), r = f.precision, o = s = r + 3; ; )
    if (l = n, n = l.plus(gn(c, l, s + 2)).times(0.5), Xr(l.d).slice(0, s) === (t = Xr(n.d)).slice(0, s)) {
      if (t = t.slice(s - 3, s + 1), o == s && t == "4999") {
        if (Le(l, r + 1, 0), l.times(l).eq(c)) {
          n = l;
          break;
        }
      } else if (t != "9999")
        break;
      s += 4;
    }
  return Ve = !0, Le(n, r);
};
ue.times = ue.mul = function(e) {
  var t, r, n, o, l, s, c, f, d, h = this, p = h.constructor, y = h.d, x = (e = new p(e)).d;
  if (!h.s || !e.s) return new p(0);
  for (e.s *= h.s, r = h.e + e.e, f = y.length, d = x.length, f < d && (l = y, y = x, x = l, s = f, f = d, d = s), l = [], s = f + d, n = s; n--; ) l.push(0);
  for (n = d; --n >= 0; ) {
    for (t = 0, o = f + n; o > n; )
      c = l[o] + x[n] * y[o - n - 1] + t, l[o--] = c % pt | 0, t = c / pt | 0;
    l[o] = (l[o] + t) % pt | 0;
  }
  for (; !l[--s]; ) l.pop();
  return t ? ++r : l.shift(), e.d = l, e.e = r, Ve ? Le(e, p.precision) : e;
};
ue.toDecimalPlaces = ue.todp = function(e, t) {
  var r = this, n = r.constructor;
  return r = new n(r), e === void 0 ? r : (tn(e, 0, Fa), t === void 0 ? t = n.rounding : tn(t, 0, 8), Le(r, e + it(r) + 1, t));
};
ue.toExponential = function(e, t) {
  var r, n = this, o = n.constructor;
  return e === void 0 ? r = Li(n, !0) : (tn(e, 0, Fa), t === void 0 ? t = o.rounding : tn(t, 0, 8), n = Le(new o(n), e + 1, t), r = Li(n, !0, e + 1)), r;
};
ue.toFixed = function(e, t) {
  var r, n, o = this, l = o.constructor;
  return e === void 0 ? Li(o) : (tn(e, 0, Fa), t === void 0 ? t = l.rounding : tn(t, 0, 8), n = Le(new l(o), e + it(o) + 1, t), r = Li(n.abs(), !1, e + it(n) + 1), o.isneg() && !o.isZero() ? "-" + r : r);
};
ue.toInteger = ue.toint = function() {
  var e = this, t = e.constructor;
  return Le(new t(e), it(e) + 1, t.rounding);
};
ue.toNumber = function() {
  return +this;
};
ue.toPower = ue.pow = function(e) {
  var t, r, n, o, l, s, c = this, f = c.constructor, d = 12, h = +(e = new f(e));
  if (!e.s) return new f(tr);
  if (c = new f(c), !c.s) {
    if (e.s < 1) throw Error(wr + "Infinity");
    return c;
  }
  if (c.eq(tr)) return c;
  if (n = f.precision, e.eq(tr)) return Le(c, n);
  if (t = e.e, r = e.d.length - 1, s = t >= r, l = c.s, s) {
    if ((r = h < 0 ? -h : h) <= ZS) {
      for (o = new f(tr), t = Math.ceil(n / He + 4), Ve = !1; r % 2 && (o = o.times(c), zx(o.d, t)), r = Wa(r / 2), r !== 0; )
        c = c.times(c), zx(c.d, t);
      return Ve = !0, e.s < 0 ? new f(tr).div(o) : Le(o, n);
    }
  } else if (l < 0) throw Error(wr + "NaN");
  return l = l < 0 && e.d[Math.max(t, r)] & 1 ? -1 : 1, c.s = 1, Ve = !1, o = e.times(ul(c, n + d)), Ve = !0, o = eA(o), o.s = l, o;
};
ue.toPrecision = function(e, t) {
  var r, n, o = this, l = o.constructor;
  return e === void 0 ? (r = it(o), n = Li(o, r <= l.toExpNeg || r >= l.toExpPos)) : (tn(e, 1, Fa), t === void 0 ? t = l.rounding : tn(t, 0, 8), o = Le(new l(o), e, t), r = it(o), n = Li(o, e <= r || r <= l.toExpNeg, e)), n;
};
ue.toSignificantDigits = ue.tosd = function(e, t) {
  var r = this, n = r.constructor;
  return e === void 0 ? (e = n.precision, t = n.rounding) : (tn(e, 1, Fa), t === void 0 ? t = n.rounding : tn(t, 0, 8)), Le(new n(r), e, t);
};
ue.toString = ue.valueOf = ue.val = ue.toJSON = ue[Symbol.for("nodejs.util.inspect.custom")] = function() {
  var e = this, t = it(e), r = e.constructor;
  return Li(e, t <= r.toExpNeg || t >= r.toExpPos);
};
function JS(e, t) {
  var r, n, o, l, s, c, f, d, h = e.constructor, p = h.precision;
  if (!e.s || !t.s)
    return t.s || (t = new h(e)), Ve ? Le(t, p) : t;
  if (f = e.d, d = t.d, s = e.e, o = t.e, f = f.slice(), l = s - o, l) {
    for (l < 0 ? (n = f, l = -l, c = d.length) : (n = d, o = s, c = f.length), s = Math.ceil(p / He), c = s > c ? s + 1 : c + 1, l > c && (l = c, n.length = 1), n.reverse(); l--; ) n.push(0);
    n.reverse();
  }
  for (c = f.length, l = d.length, c - l < 0 && (l = c, n = d, d = f, f = n), r = 0; l; )
    r = (f[--l] = f[l] + d[l] + r) / pt | 0, f[l] %= pt;
  for (r && (f.unshift(r), ++o), c = f.length; f[--c] == 0; ) f.pop();
  return t.d = f, t.e = o, Ve ? Le(t, p) : t;
}
function tn(e, t, r) {
  if (e !== ~~e || e < t || e > r)
    throw Error(Ti + e);
}
function Xr(e) {
  var t, r, n, o = e.length - 1, l = "", s = e[0];
  if (o > 0) {
    for (l += s, t = 1; t < o; t++)
      n = e[t] + "", r = He - n.length, r && (l += qn(r)), l += n;
    s = e[t], n = s + "", r = He - n.length, r && (l += qn(r));
  } else if (s === 0)
    return "0";
  for (; s % 10 === 0; ) s /= 10;
  return l + s;
}
var gn = /* @__PURE__ */ (function() {
  function e(n, o) {
    var l, s = 0, c = n.length;
    for (n = n.slice(); c--; )
      l = n[c] * o + s, n[c] = l % pt | 0, s = l / pt | 0;
    return s && n.unshift(s), n;
  }
  function t(n, o, l, s) {
    var c, f;
    if (l != s)
      f = l > s ? 1 : -1;
    else
      for (c = f = 0; c < l; c++)
        if (n[c] != o[c]) {
          f = n[c] > o[c] ? 1 : -1;
          break;
        }
    return f;
  }
  function r(n, o, l) {
    for (var s = 0; l--; )
      n[l] -= s, s = n[l] < o[l] ? 1 : 0, n[l] = s * pt + n[l] - o[l];
    for (; !n[0] && n.length > 1; ) n.shift();
  }
  return function(n, o, l, s) {
    var c, f, d, h, p, y, x, A, S, b, E, k, C, j, T, O, _, F, K = n.constructor, V = n.s == o.s ? 1 : -1, q = n.d, W = o.d;
    if (!n.s) return new K(n);
    if (!o.s) throw Error(wr + "Division by zero");
    for (f = n.e - o.e, _ = W.length, T = q.length, x = new K(V), A = x.d = [], d = 0; W[d] == (q[d] || 0); ) ++d;
    if (W[d] > (q[d] || 0) && --f, l == null ? k = l = K.precision : s ? k = l + (it(n) - it(o)) + 1 : k = l, k < 0) return new K(0);
    if (k = k / He + 2 | 0, d = 0, _ == 1)
      for (h = 0, W = W[0], k++; (d < T || h) && k--; d++)
        C = h * pt + (q[d] || 0), A[d] = C / W | 0, h = C % W | 0;
    else {
      for (h = pt / (W[0] + 1) | 0, h > 1 && (W = e(W, h), q = e(q, h), _ = W.length, T = q.length), j = _, S = q.slice(0, _), b = S.length; b < _; ) S[b++] = 0;
      F = W.slice(), F.unshift(0), O = W[0], W[1] >= pt / 2 && ++O;
      do
        h = 0, c = t(W, S, _, b), c < 0 ? (E = S[0], _ != b && (E = E * pt + (S[1] || 0)), h = E / O | 0, h > 1 ? (h >= pt && (h = pt - 1), p = e(W, h), y = p.length, b = S.length, c = t(p, S, y, b), c == 1 && (h--, r(p, _ < y ? F : W, y))) : (h == 0 && (c = h = 1), p = W.slice()), y = p.length, y < b && p.unshift(0), r(S, p, b), c == -1 && (b = S.length, c = t(W, S, _, b), c < 1 && (h++, r(S, _ < b ? F : W, b))), b = S.length) : c === 0 && (h++, S = [0]), A[d++] = h, c && S[0] ? S[b++] = q[j] || 0 : (S = [q[j]], b = 1);
      while ((j++ < T || S[0] !== void 0) && k--);
    }
    return A[0] || A.shift(), x.e = f, Le(x, s ? l + it(x) + 1 : l);
  };
})();
function eA(e, t) {
  var r, n, o, l, s, c, f = 0, d = 0, h = e.constructor, p = h.precision;
  if (it(e) > 16) throw Error(Fh + it(e));
  if (!e.s) return new h(tr);
  for (Ve = !1, c = p, s = new h(0.03125); e.abs().gte(0.1); )
    e = e.times(s), d += 5;
  for (n = Math.log(Pi(2, d)) / Math.LN10 * 2 + 5 | 0, c += n, r = o = l = new h(tr), h.precision = c; ; ) {
    if (o = Le(o.times(e), c), r = r.times(++f), s = l.plus(gn(o, r, c)), Xr(s.d).slice(0, c) === Xr(l.d).slice(0, c)) {
      for (; d--; ) l = Le(l.times(l), c);
      return h.precision = p, t == null ? (Ve = !0, Le(l, p)) : l;
    }
    l = s;
  }
}
function it(e) {
  for (var t = e.e * He, r = e.d[0]; r >= 10; r /= 10) t++;
  return t;
}
function uv(e, t, r) {
  if (t > e.LN10.sd())
    throw Ve = !0, r && (e.precision = r), Error(wr + "LN10 precision limit exceeded");
  return Le(new e(e.LN10), t);
}
function qn(e) {
  for (var t = ""; e--; ) t += "0";
  return t;
}
function ul(e, t) {
  var r, n, o, l, s, c, f, d, h, p = 1, y = 10, x = e, A = x.d, S = x.constructor, b = S.precision;
  if (x.s < 1) throw Error(wr + (x.s ? "NaN" : "-Infinity"));
  if (x.eq(tr)) return new S(0);
  if (t == null ? (Ve = !1, d = b) : d = t, x.eq(10))
    return t == null && (Ve = !0), uv(S, d);
  if (d += y, S.precision = d, r = Xr(A), n = r.charAt(0), l = it(x), Math.abs(l) < 15e14) {
    for (; n < 7 && n != 1 || n == 1 && r.charAt(1) > 3; )
      x = x.times(e), r = Xr(x.d), n = r.charAt(0), p++;
    l = it(x), n > 1 ? (x = new S("0." + r), l++) : x = new S(n + "." + r.slice(1));
  } else
    return f = uv(S, d + 2, b).times(l + ""), x = ul(new S(n + "." + r.slice(1)), d - y).plus(f), S.precision = b, t == null ? (Ve = !0, Le(x, b)) : x;
  for (c = s = x = gn(x.minus(tr), x.plus(tr), d), h = Le(x.times(x), d), o = 3; ; ) {
    if (s = Le(s.times(h), d), f = c.plus(gn(s, new S(o), d)), Xr(f.d).slice(0, d) === Xr(c.d).slice(0, d))
      return c = c.times(2), l !== 0 && (c = c.plus(uv(S, d + 2, b).times(l + ""))), c = gn(c, new S(p), d), S.precision = b, t == null ? (Ve = !0, Le(c, b)) : c;
    c = f, o += 2;
  }
}
function Rx(e, t) {
  var r, n, o;
  for ((r = t.indexOf(".")) > -1 && (t = t.replace(".", "")), (n = t.search(/e/i)) > 0 ? (r < 0 && (r = n), r += +t.slice(n + 1), t = t.substring(0, n)) : r < 0 && (r = t.length), n = 0; t.charCodeAt(n) === 48; ) ++n;
  for (o = t.length; t.charCodeAt(o - 1) === 48; ) --o;
  if (t = t.slice(n, o), t) {
    if (o -= n, r = r - n - 1, e.e = Wa(r / He), e.d = [], n = (r + 1) % He, r < 0 && (n += He), n < o) {
      for (n && e.d.push(+t.slice(0, n)), o -= He; n < o; ) e.d.push(+t.slice(n, n += He));
      t = t.slice(n), n = He - t.length;
    } else
      n -= o;
    for (; n--; ) t += "0";
    if (e.d.push(+t), Ve && (e.e > Ts || e.e < -Ts)) throw Error(Fh + r);
  } else
    e.s = 0, e.e = 0, e.d = [0];
  return e;
}
function Le(e, t, r) {
  var n, o, l, s, c, f, d, h, p = e.d;
  for (s = 1, l = p[0]; l >= 10; l /= 10) s++;
  if (n = t - s, n < 0)
    n += He, o = t, d = p[h = 0];
  else {
    if (h = Math.ceil((n + 1) / He), l = p.length, h >= l) return e;
    for (d = l = p[h], s = 1; l >= 10; l /= 10) s++;
    n %= He, o = n - He + s;
  }
  if (r !== void 0 && (l = Pi(10, s - o - 1), c = d / l % 10 | 0, f = t < 0 || p[h + 1] !== void 0 || d % l, f = r < 4 ? (c || f) && (r == 0 || r == (e.s < 0 ? 3 : 2)) : c > 5 || c == 5 && (r == 4 || f || r == 6 && // Check whether the digit to the left of the rounding digit is odd.
  (n > 0 ? o > 0 ? d / Pi(10, s - o) : 0 : p[h - 1]) % 10 & 1 || r == (e.s < 0 ? 8 : 7))), t < 1 || !p[0])
    return f ? (l = it(e), p.length = 1, t = t - l - 1, p[0] = Pi(10, (He - t % He) % He), e.e = Wa(-t / He) || 0) : (p.length = 1, p[0] = e.e = e.s = 0), e;
  if (n == 0 ? (p.length = h, l = 1, h--) : (p.length = h + 1, l = Pi(10, He - n), p[h] = o > 0 ? (d / Pi(10, s - o) % Pi(10, o) | 0) * l : 0), f)
    for (; ; )
      if (h == 0) {
        (p[0] += l) == pt && (p[0] = 1, ++e.e);
        break;
      } else {
        if (p[h] += l, p[h] != pt) break;
        p[h--] = 0, l = 1;
      }
  for (n = p.length; p[--n] === 0; ) p.pop();
  if (Ve && (e.e > Ts || e.e < -Ts))
    throw Error(Fh + it(e));
  return e;
}
function tA(e, t) {
  var r, n, o, l, s, c, f, d, h, p, y = e.constructor, x = y.precision;
  if (!e.s || !t.s)
    return t.s ? t.s = -t.s : t = new y(e), Ve ? Le(t, x) : t;
  if (f = e.d, p = t.d, n = t.e, d = e.e, f = f.slice(), s = d - n, s) {
    for (h = s < 0, h ? (r = f, s = -s, c = p.length) : (r = p, n = d, c = f.length), o = Math.max(Math.ceil(x / He), c) + 2, s > o && (s = o, r.length = 1), r.reverse(), o = s; o--; ) r.push(0);
    r.reverse();
  } else {
    for (o = f.length, c = p.length, h = o < c, h && (c = o), o = 0; o < c; o++)
      if (f[o] != p[o]) {
        h = f[o] < p[o];
        break;
      }
    s = 0;
  }
  for (h && (r = f, f = p, p = r, t.s = -t.s), c = f.length, o = p.length - c; o > 0; --o) f[c++] = 0;
  for (o = p.length; o > s; ) {
    if (f[--o] < p[o]) {
      for (l = o; l && f[--l] === 0; ) f[l] = pt - 1;
      --f[l], f[o] += pt;
    }
    f[o] -= p[o];
  }
  for (; f[--c] === 0; ) f.pop();
  for (; f[0] === 0; f.shift()) --n;
  return f[0] ? (t.d = f, t.e = n, Ve ? Le(t, x) : t) : new y(0);
}
function Li(e, t, r) {
  var n, o = it(e), l = Xr(e.d), s = l.length;
  return t ? (r && (n = r - s) > 0 ? l = l.charAt(0) + "." + l.slice(1) + qn(n) : s > 1 && (l = l.charAt(0) + "." + l.slice(1)), l = l + (o < 0 ? "e" : "e+") + o) : o < 0 ? (l = "0." + qn(-o - 1) + l, r && (n = r - s) > 0 && (l += qn(n))) : o >= s ? (l += qn(o + 1 - s), r && (n = r - o - 1) > 0 && (l = l + "." + qn(n))) : ((n = o + 1) < s && (l = l.slice(0, n) + "." + l.slice(n)), r && (n = r - s) > 0 && (o + 1 === s && (l += "."), l += qn(n))), e.s < 0 ? "-" + l : l;
}
function zx(e, t) {
  if (e.length > t)
    return e.length = t, !0;
}
function rA(e) {
  var t, r, n;
  function o(l) {
    var s = this;
    if (!(s instanceof o)) return new o(l);
    if (s.constructor = o, l instanceof o) {
      s.s = l.s, s.e = l.e, s.d = (l = l.d) ? l.slice() : l;
      return;
    }
    if (typeof l == "number") {
      if (l * 0 !== 0)
        throw Error(Ti + l);
      if (l > 0)
        s.s = 1;
      else if (l < 0)
        l = -l, s.s = -1;
      else {
        s.s = 0, s.e = 0, s.d = [0];
        return;
      }
      if (l === ~~l && l < 1e7) {
        s.e = 0, s.d = [l];
        return;
      }
      return Rx(s, l.toString());
    } else if (typeof l != "string")
      throw Error(Ti + l);
    if (l.charCodeAt(0) === 45 ? (l = l.slice(1), s.s = -1) : s.s = 1, o2.test(l)) Rx(s, l);
    else throw Error(Ti + l);
  }
  if (o.prototype = ue, o.ROUND_UP = 0, o.ROUND_DOWN = 1, o.ROUND_CEIL = 2, o.ROUND_FLOOR = 3, o.ROUND_HALF_UP = 4, o.ROUND_HALF_DOWN = 5, o.ROUND_HALF_EVEN = 6, o.ROUND_HALF_CEIL = 7, o.ROUND_HALF_FLOOR = 8, o.clone = rA, o.config = o.set = l2, e === void 0 && (e = {}), e)
    for (n = ["precision", "rounding", "toExpNeg", "toExpPos", "LN10"], t = 0; t < n.length; ) e.hasOwnProperty(r = n[t++]) || (e[r] = this[r]);
  return o.config(e), o;
}
function l2(e) {
  if (!e || typeof e != "object")
    throw Error(wr + "Object expected");
  var t, r, n, o = [
    "precision",
    1,
    Fa,
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
  for (t = 0; t < o.length; t += 3)
    if ((n = e[r = o[t]]) !== void 0)
      if (Wa(n) === n && n >= o[t + 1] && n <= o[t + 2]) this[r] = n;
      else throw Error(Ti + r + ": " + n);
  if ((n = e[r = "LN10"]) !== void 0)
    if (n == Math.LN10) this[r] = new this(n);
    else throw Error(Ti + r + ": " + n);
  return this;
}
var Wh = rA(a2);
tr = new Wh(1);
const Ce = Wh;
function nA(e) {
  var t;
  return e === 0 ? t = 1 : t = Math.floor(new Ce(e).abs().log(10).toNumber()) + 1, t;
}
function iA(e, t, r) {
  for (var n = new Ce(e), o = 0, l = []; n.lt(t) && o < 1e5; )
    l.push(n.toNumber()), n = n.add(r), o++;
  return l;
}
function sl(e, t) {
  return f2(e) || c2(e, t) || s2(e, t) || u2();
}
function u2() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function s2(e, t) {
  if (e) {
    if (typeof e == "string") return Bx(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? Bx(e, t) : void 0;
  }
}
function Bx(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function c2(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, o, l, s, c = [], f = !0, d = !1;
    try {
      if (l = (r = r.call(e)).next, t !== 0) for (; !(f = (n = l.call(r)).done) && (c.push(n.value), c.length !== t); f = !0) ;
    } catch (h) {
      d = !0, o = h;
    } finally {
      try {
        if (!f && r.return != null && (s = r.return(), Object(s) !== s)) return;
      } finally {
        if (d) throw o;
      }
    }
    return c;
  }
}
function f2(e) {
  if (Array.isArray(e)) return e;
}
var aA = (e) => {
  var t = sl(e, 2), r = t[0], n = t[1], o = r, l = n;
  return r > n && (o = n, l = r), [o, l];
}, Uh = (e, t, r) => {
  if (e.lte(0))
    return new Ce(0);
  var n = nA(e.toNumber()), o = new Ce(10).pow(n), l = e.div(o), s = n !== 1 ? 0.05 : 0.1, c = new Ce(Math.ceil(l.div(s).toNumber())).add(r).mul(s), f = c.mul(o);
  return t ? new Ce(f.toNumber()) : new Ce(Math.ceil(f.toNumber()));
}, oA = (e, t, r) => {
  var n;
  if (e.lte(0))
    return new Ce(0);
  var o = [1, 2, 2.5, 5], l = e.toNumber(), s = Math.floor(new Ce(l).abs().log(10).toNumber()), c = new Ce(10).pow(s), f = e.div(c).toNumber(), d = o.findIndex((x) => x >= f - 1e-10);
  if (d === -1 && (c = c.mul(10), d = 0), d += r, d >= o.length) {
    var h = Math.floor(d / o.length);
    d %= o.length, c = c.mul(new Ce(10).pow(h));
  }
  var p = (n = o[d]) !== null && n !== void 0 ? n : 1, y = new Ce(p).mul(c);
  return t ? y : new Ce(Math.ceil(y.toNumber()));
}, d2 = (e, t, r) => {
  var n = new Ce(1), o = new Ce(e);
  if (!o.isint() && r) {
    var l = Math.abs(e);
    l < 1 ? (n = new Ce(10).pow(nA(e) - 1), o = new Ce(Math.floor(o.div(n).toNumber())).mul(n)) : l > 1 && (o = new Ce(Math.floor(e)));
  } else e === 0 ? o = new Ce(Math.floor((t - 1) / 2)) : r || (o = new Ce(Math.floor(e)));
  for (var s = Math.floor((t - 1) / 2), c = [], f = 0; f < t; f++)
    c.push(o.add(new Ce(f - s).mul(n)).toNumber());
  return c;
}, lA = function(t, r, n, o) {
  var l = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : 0, s = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : Uh;
  if (!Number.isFinite((r - t) / (n - 1)))
    return {
      step: new Ce(0),
      tickMin: new Ce(0),
      tickMax: new Ce(0)
    };
  var c = s(new Ce(r).sub(t).div(n - 1), o, l), f;
  t <= 0 && r >= 0 ? f = new Ce(0) : (f = new Ce(t).add(r).div(2), f = f.sub(new Ce(f).mod(c)));
  var d = Math.ceil(f.sub(t).div(c).toNumber()), h = Math.ceil(new Ce(r).sub(f).div(c).toNumber()), p = d + h + 1;
  return p > n ? lA(t, r, n, o, l + 1, s) : (p < n && (h = r > 0 ? h + (n - p) : h, d = r > 0 ? d : d + (n - p)), {
    step: c,
    tickMin: f.sub(new Ce(d).mul(c)),
    tickMax: f.add(new Ce(h).mul(c))
  });
}, Fx = function(t) {
  var r = sl(t, 2), n = r[0], o = r[1], l = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 6, s = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0, c = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : "auto", f = Math.max(l, 2), d = aA([n, o]), h = sl(d, 2), p = h[0], y = h[1];
  if (p === -1 / 0 || y === 1 / 0) {
    var x = y === 1 / 0 ? [p, ...Array(l - 1).fill(1 / 0)] : [...Array(l - 1).fill(-1 / 0), y];
    return n > o ? x.reverse() : x;
  }
  if (p === y)
    return d2(p, l, s);
  var A = c === "snap125" ? oA : Uh, S = lA(p, y, f, s, 0, A), b = S.step, E = S.tickMin, k = S.tickMax, C = iA(E, k.add(new Ce(0.1).mul(b)), b);
  return n > o ? C.reverse() : C;
}, Wx = function(t, r) {
  var n = sl(t, 2), o = n[0], l = n[1], s = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0, c = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : "auto", f = aA([o, l]), d = sl(f, 2), h = d[0], p = d[1];
  if (h === -1 / 0 || p === 1 / 0)
    return [o, l];
  if (h === p)
    return [h];
  var y = c === "snap125" ? oA : Uh, x = Math.max(r, 2), A = y(new Ce(p).sub(h).div(x - 1), s, 0), S = [...iA(new Ce(h), new Ce(p), A), p];
  if (s === !1) {
    S = S.map((E) => Math.round(E));
    var b = S.length - 1;
    b > 0 && S[b] === S[b - 1] && (S = S.slice(0, b));
  }
  return o > l ? S.reverse() : S;
}, v2 = (e) => e.rootProps.barCategoryGap, Ec = (e) => e.rootProps.stackOffset, uA = (e) => e.rootProps.reverseStackOrder, Hh = (e) => e.options.chartName, Kh = (e) => e.rootProps.syncId, sA = (e) => e.rootProps.syncMethod, Vh = (e) => e.options.eventEmitter, h2 = (e) => e.rootProps.baseValue, Nt = {
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
}, xi = {
  allowDecimals: !1,
  // if I set this to false then Tooltip synchronisation stops working in Radar, wtf
  allowDataOverflow: !1,
  angleAxisId: 0,
  reversed: !1,
  scale: "auto",
  tick: !0,
  type: "auto"
}, Vr = {
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
}, Oc = (e, t) => {
  if (!(!e || !t))
    return e != null && e.reversed ? [t[1], t[0]] : t;
};
function kc(e, t, r) {
  if (r !== "auto")
    return r;
  if (e != null)
    return $r(e, t) ? "category" : "number";
}
function Ux(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Ns(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Ux(Object(r), !0).forEach(function(n) {
      p2(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Ux(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function p2(e, t, r) {
  return (t = m2(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function m2(e) {
  var t = y2(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function y2(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Hx = {
  allowDataOverflow: xi.allowDataOverflow,
  allowDecimals: xi.allowDecimals,
  allowDuplicatedCategory: !1,
  // defaultPolarAngleAxisProps.allowDuplicatedCategory has it set to true but the actual axis rendering ignores the prop because reasons,
  dataKey: void 0,
  domain: void 0,
  id: xi.angleAxisId,
  includeHidden: !1,
  name: void 0,
  reversed: xi.reversed,
  scale: xi.scale,
  tick: xi.tick,
  tickCount: void 0,
  ticks: void 0,
  type: xi.type,
  unit: void 0,
  niceTicks: "auto"
}, Kx = {
  allowDataOverflow: Vr.allowDataOverflow,
  allowDecimals: Vr.allowDecimals,
  allowDuplicatedCategory: Vr.allowDuplicatedCategory,
  dataKey: void 0,
  domain: void 0,
  id: Vr.radiusAxisId,
  includeHidden: Vr.includeHidden,
  name: void 0,
  reversed: Vr.reversed,
  scale: Vr.scale,
  tick: Vr.tick,
  tickCount: Vr.tickCount,
  ticks: void 0,
  type: Vr.type,
  unit: void 0,
  niceTicks: "auto"
}, g2 = (e, t) => {
  if (t != null)
    return e.polarAxis.angleAxis[t];
}, Yh = z([g2, zS], (e, t) => {
  var r;
  if (e != null)
    return e;
  var n = (r = kc(t, "angleAxis", Hx.type)) !== null && r !== void 0 ? r : "category";
  return Ns(Ns({}, Hx), {}, {
    type: n
  });
}), x2 = (e, t) => e.polarAxis.radiusAxis[t], Gh = z([x2, zS], (e, t) => {
  var r;
  if (e != null)
    return e;
  var n = (r = kc(t, "radiusAxis", Kx.type)) !== null && r !== void 0 ? r : "category";
  return Ns(Ns({}, Kx), {}, {
    type: n
  });
}), _c = (e) => e.polarOptions, Xh = z([Pn, En, Et], zM), cA = z([_c, Xh], (e, t) => {
  if (e != null)
    return ni(e.innerRadius, t, 0);
}), fA = z([_c, Xh], (e, t) => {
  if (e != null)
    return ni(e.outerRadius, t, t * 0.8);
}), w2 = (e) => {
  if (e == null)
    return [0, 0];
  var t = e.startAngle, r = e.endAngle;
  return [t, r];
}, dA = z([_c], w2);
z([Yh, dA], Oc);
var vA = z([Xh, cA, fA], (e, t, r) => {
  if (!(e == null || t == null || r == null))
    return [t, r];
});
z([Gh, vA], Oc);
var hA = z([Be, _c, cA, fA, Pn, En], (e, t, r, n, o, l) => {
  if (!(e !== "centric" && e !== "radial" || t == null || r == null || n == null)) {
    var s = t.cx, c = t.cy, f = t.startAngle, d = t.endAngle;
    return {
      cx: ni(s, o, o / 2),
      cy: ni(c, l, l / 2),
      innerRadius: r,
      outerRadius: n,
      startAngle: f,
      endAngle: d,
      clockWise: !1
      // this property look useful, why not use it?
    };
  }
}), mt = (e, t) => t, Cc = (e, t, r) => r;
function qh(e) {
  return e == null ? void 0 : e.id;
}
function pA(e, t, r) {
  var n = t.chartData, o = n === void 0 ? [] : n, l = r.allowDuplicatedCategory, s = r.dataKey, c = /* @__PURE__ */ new Map();
  return e.forEach((f) => {
    var d, h = (d = f.data) !== null && d !== void 0 ? d : o;
    if (!(h == null || h.length === 0)) {
      var p = qh(f);
      h.forEach((y, x) => {
        var A = s == null || l ? x : String(tt(y, s, null)), S = tt(y, f.dataKey, 0), b;
        c.has(A) ? b = c.get(A) : b = {}, Object.assign(b, {
          [p]: S
        }), c.set(A, b);
      });
    }
  }), Array.from(c.values());
}
function Qh(e) {
  return "stackId" in e && e.stackId != null && e.dataKey != null;
}
var El = (e, t) => e === t ? !0 : e == null || t == null ? !1 : e[0] === t[0] && e[1] === t[1];
function Ic(e, t) {
  return Array.isArray(e) && Array.isArray(t) && e.length === 0 && t.length === 0 ? !0 : e === t;
}
function b2(e, t) {
  if (e.length === t.length) {
    for (var r = 0; r < e.length; r++)
      if (e[r] !== t[r])
        return !1;
    return !0;
  }
  return !1;
}
var yt = (e) => {
  var t = Be(e);
  return t === "horizontal" ? "xAxis" : t === "vertical" ? "yAxis" : t === "centric" ? "angleAxis" : "radiusAxis";
}, Ua = (e) => e.tooltip.settings.axisId;
function Zh(e) {
  if (e != null) {
    var t = e.ticks, r = e.bandwidth, n = e.range(), o = [Math.min(...n), Math.max(...n)];
    return {
      domain: () => e.domain(),
      range: (function(l) {
        function s() {
          return l.apply(this, arguments);
        }
        return s.toString = function() {
          return l.toString();
        }, s;
      })(() => o),
      rangeMin: () => o[0],
      rangeMax: () => o[1],
      isInRange(l) {
        var s = o[0], c = o[1];
        return s <= c ? l >= s && l <= c : l >= c && l <= s;
      },
      bandwidth: r ? () => r.call(e) : void 0,
      ticks: t ? (l) => t.call(e, l) : void 0,
      map: (l, s) => {
        var c = e(l);
        if (c != null) {
          if (e.bandwidth && s !== null && s !== void 0 && s.position) {
            var f = e.bandwidth();
            switch (s.position) {
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
var S2 = (e, t) => {
  if (t != null)
    switch (e) {
      case "linear": {
        if (!qr(t)) {
          for (var r, n, o = 0; o < t.length; o++) {
            var l = t[o];
            ke(l) && ((r === void 0 || l < r) && (r = l), (n === void 0 || l > n) && (n = l));
          }
          return r !== void 0 && n !== void 0 ? [r, n] : void 0;
        }
        return t;
      }
      default:
        return t;
    }
};
function ti(e, t) {
  return e == null || t == null ? NaN : e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function A2(e, t) {
  return e == null || t == null ? NaN : t < e ? -1 : t > e ? 1 : t >= e ? 0 : NaN;
}
function Jh(e) {
  let t, r, n;
  e.length !== 2 ? (t = ti, r = (c, f) => ti(e(c), f), n = (c, f) => e(c) - f) : (t = e === ti || e === A2 ? e : P2, r = e, n = e);
  function o(c, f, d = 0, h = c.length) {
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
  function s(c, f, d = 0, h = c.length) {
    const p = o(c, f, d, h - 1);
    return p > d && n(c[p - 1], f) > -n(c[p], f) ? p - 1 : p;
  }
  return { left: o, center: s, right: l };
}
function P2() {
  return 0;
}
function mA(e) {
  return e === null ? NaN : +e;
}
function* E2(e, t) {
  for (let r of e)
    r != null && (r = +r) >= r && (yield r);
}
const O2 = Jh(ti), Ol = O2.right;
Jh(mA).center;
class Vx extends Map {
  constructor(t, r = C2) {
    if (super(), Object.defineProperties(this, { _intern: { value: /* @__PURE__ */ new Map() }, _key: { value: r } }), t != null) for (const [n, o] of t) this.set(n, o);
  }
  get(t) {
    return super.get(Yx(this, t));
  }
  has(t) {
    return super.has(Yx(this, t));
  }
  set(t, r) {
    return super.set(k2(this, t), r);
  }
  delete(t) {
    return super.delete(_2(this, t));
  }
}
function Yx({ _intern: e, _key: t }, r) {
  const n = t(r);
  return e.has(n) ? e.get(n) : r;
}
function k2({ _intern: e, _key: t }, r) {
  const n = t(r);
  return e.has(n) ? e.get(n) : (e.set(n, r), r);
}
function _2({ _intern: e, _key: t }, r) {
  const n = t(r);
  return e.has(n) && (r = e.get(n), e.delete(n)), r;
}
function C2(e) {
  return e !== null && typeof e == "object" ? e.valueOf() : e;
}
function I2(e = ti) {
  if (e === ti) return yA;
  if (typeof e != "function") throw new TypeError("compare is not a function");
  return (t, r) => {
    const n = e(t, r);
    return n || n === 0 ? n : (e(r, r) === 0) - (e(t, t) === 0);
  };
}
function yA(e, t) {
  return (e == null || !(e >= e)) - (t == null || !(t >= t)) || (e < t ? -1 : e > t ? 1 : 0);
}
const j2 = Math.sqrt(50), T2 = Math.sqrt(10), N2 = Math.sqrt(2);
function Ms(e, t, r) {
  const n = (t - e) / Math.max(0, r), o = Math.floor(Math.log10(n)), l = n / Math.pow(10, o), s = l >= j2 ? 10 : l >= T2 ? 5 : l >= N2 ? 2 : 1;
  let c, f, d;
  return o < 0 ? (d = Math.pow(10, -o) / s, c = Math.round(e * d), f = Math.round(t * d), c / d < e && ++c, f / d > t && --f, d = -d) : (d = Math.pow(10, o) * s, c = Math.round(e / d), f = Math.round(t / d), c * d < e && ++c, f * d > t && --f), f < c && 0.5 <= r && r < 2 ? Ms(e, t, r * 2) : [c, f, d];
}
function Qv(e, t, r) {
  if (t = +t, e = +e, r = +r, !(r > 0)) return [];
  if (e === t) return [e];
  const n = t < e, [o, l, s] = n ? Ms(t, e, r) : Ms(e, t, r);
  if (!(l >= o)) return [];
  const c = l - o + 1, f = new Array(c);
  if (n)
    if (s < 0) for (let d = 0; d < c; ++d) f[d] = (l - d) / -s;
    else for (let d = 0; d < c; ++d) f[d] = (l - d) * s;
  else if (s < 0) for (let d = 0; d < c; ++d) f[d] = (o + d) / -s;
  else for (let d = 0; d < c; ++d) f[d] = (o + d) * s;
  return f;
}
function Zv(e, t, r) {
  return t = +t, e = +e, r = +r, Ms(e, t, r)[2];
}
function Jv(e, t, r) {
  t = +t, e = +e, r = +r;
  const n = t < e, o = n ? Zv(t, e, r) : Zv(e, t, r);
  return (n ? -1 : 1) * (o < 0 ? 1 / -o : o);
}
function Gx(e, t) {
  let r;
  for (const n of e)
    n != null && (r < n || r === void 0 && n >= n) && (r = n);
  return r;
}
function Xx(e, t) {
  let r;
  for (const n of e)
    n != null && (r > n || r === void 0 && n >= n) && (r = n);
  return r;
}
function gA(e, t, r = 0, n = 1 / 0, o) {
  if (t = Math.floor(t), r = Math.floor(Math.max(0, r)), n = Math.floor(Math.min(e.length - 1, n)), !(r <= t && t <= n)) return e;
  for (o = o === void 0 ? yA : I2(o); n > r; ) {
    if (n - r > 600) {
      const f = n - r + 1, d = t - r + 1, h = Math.log(f), p = 0.5 * Math.exp(2 * h / 3), y = 0.5 * Math.sqrt(h * p * (f - p) / f) * (d - f / 2 < 0 ? -1 : 1), x = Math.max(r, Math.floor(t - d * p / f + y)), A = Math.min(n, Math.floor(t + (f - d) * p / f + y));
      gA(e, t, x, A, o);
    }
    const l = e[t];
    let s = r, c = n;
    for (Uo(e, r, t), o(e[n], l) > 0 && Uo(e, r, n); s < c; ) {
      for (Uo(e, s, c), ++s, --c; o(e[s], l) < 0; ) ++s;
      for (; o(e[c], l) > 0; ) --c;
    }
    o(e[r], l) === 0 ? Uo(e, r, c) : (++c, Uo(e, c, n)), c <= t && (r = c + 1), t <= c && (n = c - 1);
  }
  return e;
}
function Uo(e, t, r) {
  const n = e[t];
  e[t] = e[r], e[r] = n;
}
function M2(e, t, r) {
  if (e = Float64Array.from(E2(e)), !(!(n = e.length) || isNaN(t = +t))) {
    if (t <= 0 || n < 2) return Xx(e);
    if (t >= 1) return Gx(e);
    var n, o = (n - 1) * t, l = Math.floor(o), s = Gx(gA(e, l).subarray(0, l + 1)), c = Xx(e.subarray(l + 1));
    return s + (c - s) * (o - l);
  }
}
function D2(e, t, r = mA) {
  if (!(!(n = e.length) || isNaN(t = +t))) {
    if (t <= 0 || n < 2) return +r(e[0], 0, e);
    if (t >= 1) return +r(e[n - 1], n - 1, e);
    var n, o = (n - 1) * t, l = Math.floor(o), s = +r(e[l], l, e), c = +r(e[l + 1], l + 1, e);
    return s + (c - s) * (o - l);
  }
}
function $2(e, t, r) {
  e = +e, t = +t, r = (o = arguments.length) < 2 ? (t = e, e = 0, 1) : o < 3 ? 1 : +r;
  for (var n = -1, o = Math.max(0, Math.ceil((t - e) / r)) | 0, l = new Array(o); ++n < o; )
    l[n] = e + n * r;
  return l;
}
function br(e, t) {
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
function On(e, t) {
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
const eh = Symbol("implicit");
function ep() {
  var e = new Vx(), t = [], r = [], n = eh;
  function o(l) {
    let s = e.get(l);
    if (s === void 0) {
      if (n !== eh) return n;
      e.set(l, s = t.push(l) - 1);
    }
    return r[s % r.length];
  }
  return o.domain = function(l) {
    if (!arguments.length) return t.slice();
    t = [], e = new Vx();
    for (const s of l)
      e.has(s) || e.set(s, t.push(s) - 1);
    return o;
  }, o.range = function(l) {
    return arguments.length ? (r = Array.from(l), o) : r.slice();
  }, o.unknown = function(l) {
    return arguments.length ? (n = l, o) : n;
  }, o.copy = function() {
    return ep(t, r).unknown(n);
  }, br.apply(o, arguments), o;
}
function tp() {
  var e = ep().unknown(void 0), t = e.domain, r = e.range, n = 0, o = 1, l, s, c = !1, f = 0, d = 0, h = 0.5;
  delete e.unknown;
  function p() {
    var y = t().length, x = o < n, A = x ? o : n, S = x ? n : o;
    l = (S - A) / Math.max(1, y - f + d * 2), c && (l = Math.floor(l)), A += (S - A - l * (y - f)) * h, s = l * (1 - f), c && (A = Math.round(A), s = Math.round(s));
    var b = $2(y).map(function(E) {
      return A + l * E;
    });
    return r(x ? b.reverse() : b);
  }
  return e.domain = function(y) {
    return arguments.length ? (t(y), p()) : t();
  }, e.range = function(y) {
    return arguments.length ? ([n, o] = y, n = +n, o = +o, p()) : [n, o];
  }, e.rangeRound = function(y) {
    return [n, o] = y, n = +n, o = +o, c = !0, p();
  }, e.bandwidth = function() {
    return s;
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
    return tp(t(), [n, o]).round(c).paddingInner(f).paddingOuter(d).align(h);
  }, br.apply(p(), arguments);
}
function xA(e) {
  var t = e.copy;
  return e.padding = e.paddingOuter, delete e.paddingInner, delete e.paddingOuter, e.copy = function() {
    return xA(t());
  }, e;
}
function L2() {
  return xA(tp.apply(null, arguments).paddingInner(1));
}
function rp(e, t, r) {
  e.prototype = t.prototype = r, r.constructor = e;
}
function wA(e, t) {
  var r = Object.create(e.prototype);
  for (var n in t) r[n] = t[n];
  return r;
}
function kl() {
}
var cl = 0.7, Ds = 1 / cl, _a = "\\s*([+-]?\\d+)\\s*", fl = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", Qr = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", R2 = /^#([0-9a-f]{3,8})$/, z2 = new RegExp(`^rgb\\(${_a},${_a},${_a}\\)$`), B2 = new RegExp(`^rgb\\(${Qr},${Qr},${Qr}\\)$`), F2 = new RegExp(`^rgba\\(${_a},${_a},${_a},${fl}\\)$`), W2 = new RegExp(`^rgba\\(${Qr},${Qr},${Qr},${fl}\\)$`), U2 = new RegExp(`^hsl\\(${fl},${Qr},${Qr}\\)$`), H2 = new RegExp(`^hsla\\(${fl},${Qr},${Qr},${fl}\\)$`), qx = {
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
rp(kl, dl, {
  copy(e) {
    return Object.assign(new this.constructor(), this, e);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: Qx,
  // Deprecated! Use color.formatHex.
  formatHex: Qx,
  formatHex8: K2,
  formatHsl: V2,
  formatRgb: Zx,
  toString: Zx
});
function Qx() {
  return this.rgb().formatHex();
}
function K2() {
  return this.rgb().formatHex8();
}
function V2() {
  return bA(this).formatHsl();
}
function Zx() {
  return this.rgb().formatRgb();
}
function dl(e) {
  var t, r;
  return e = (e + "").trim().toLowerCase(), (t = R2.exec(e)) ? (r = t[1].length, t = parseInt(t[1], 16), r === 6 ? Jx(t) : r === 3 ? new Xt(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : r === 8 ? Ju(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : r === 4 ? Ju(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = z2.exec(e)) ? new Xt(t[1], t[2], t[3], 1) : (t = B2.exec(e)) ? new Xt(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = F2.exec(e)) ? Ju(t[1], t[2], t[3], t[4]) : (t = W2.exec(e)) ? Ju(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = U2.exec(e)) ? rw(t[1], t[2] / 100, t[3] / 100, 1) : (t = H2.exec(e)) ? rw(t[1], t[2] / 100, t[3] / 100, t[4]) : qx.hasOwnProperty(e) ? Jx(qx[e]) : e === "transparent" ? new Xt(NaN, NaN, NaN, 0) : null;
}
function Jx(e) {
  return new Xt(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function Ju(e, t, r, n) {
  return n <= 0 && (e = t = r = NaN), new Xt(e, t, r, n);
}
function Y2(e) {
  return e instanceof kl || (e = dl(e)), e ? (e = e.rgb(), new Xt(e.r, e.g, e.b, e.opacity)) : new Xt();
}
function th(e, t, r, n) {
  return arguments.length === 1 ? Y2(e) : new Xt(e, t, r, n ?? 1);
}
function Xt(e, t, r, n) {
  this.r = +e, this.g = +t, this.b = +r, this.opacity = +n;
}
rp(Xt, th, wA(kl, {
  brighter(e) {
    return e = e == null ? Ds : Math.pow(Ds, e), new Xt(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? cl : Math.pow(cl, e), new Xt(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new Xt(Ni(this.r), Ni(this.g), Ni(this.b), $s(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: ew,
  // Deprecated! Use color.formatHex.
  formatHex: ew,
  formatHex8: G2,
  formatRgb: tw,
  toString: tw
}));
function ew() {
  return `#${_i(this.r)}${_i(this.g)}${_i(this.b)}`;
}
function G2() {
  return `#${_i(this.r)}${_i(this.g)}${_i(this.b)}${_i((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function tw() {
  const e = $s(this.opacity);
  return `${e === 1 ? "rgb(" : "rgba("}${Ni(this.r)}, ${Ni(this.g)}, ${Ni(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function $s(e) {
  return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function Ni(e) {
  return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function _i(e) {
  return e = Ni(e), (e < 16 ? "0" : "") + e.toString(16);
}
function rw(e, t, r, n) {
  return n <= 0 ? e = t = r = NaN : r <= 0 || r >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new Mr(e, t, r, n);
}
function bA(e) {
  if (e instanceof Mr) return new Mr(e.h, e.s, e.l, e.opacity);
  if (e instanceof kl || (e = dl(e)), !e) return new Mr();
  if (e instanceof Mr) return e;
  e = e.rgb();
  var t = e.r / 255, r = e.g / 255, n = e.b / 255, o = Math.min(t, r, n), l = Math.max(t, r, n), s = NaN, c = l - o, f = (l + o) / 2;
  return c ? (t === l ? s = (r - n) / c + (r < n) * 6 : r === l ? s = (n - t) / c + 2 : s = (t - r) / c + 4, c /= f < 0.5 ? l + o : 2 - l - o, s *= 60) : c = f > 0 && f < 1 ? 0 : s, new Mr(s, c, f, e.opacity);
}
function X2(e, t, r, n) {
  return arguments.length === 1 ? bA(e) : new Mr(e, t, r, n ?? 1);
}
function Mr(e, t, r, n) {
  this.h = +e, this.s = +t, this.l = +r, this.opacity = +n;
}
rp(Mr, X2, wA(kl, {
  brighter(e) {
    return e = e == null ? Ds : Math.pow(Ds, e), new Mr(this.h, this.s, this.l * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? cl : Math.pow(cl, e), new Mr(this.h, this.s, this.l * e, this.opacity);
  },
  rgb() {
    var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, r = this.l, n = r + (r < 0.5 ? r : 1 - r) * t, o = 2 * r - n;
    return new Xt(
      sv(e >= 240 ? e - 240 : e + 120, o, n),
      sv(e, o, n),
      sv(e < 120 ? e + 240 : e - 120, o, n),
      this.opacity
    );
  },
  clamp() {
    return new Mr(nw(this.h), es(this.s), es(this.l), $s(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const e = $s(this.opacity);
    return `${e === 1 ? "hsl(" : "hsla("}${nw(this.h)}, ${es(this.s) * 100}%, ${es(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
  }
}));
function nw(e) {
  return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function es(e) {
  return Math.max(0, Math.min(1, e || 0));
}
function sv(e, t, r) {
  return (e < 60 ? t + (r - t) * e / 60 : e < 180 ? r : e < 240 ? t + (r - t) * (240 - e) / 60 : t) * 255;
}
const np = (e) => () => e;
function q2(e, t) {
  return function(r) {
    return e + r * t;
  };
}
function Q2(e, t, r) {
  return e = Math.pow(e, r), t = Math.pow(t, r) - e, r = 1 / r, function(n) {
    return Math.pow(e + n * t, r);
  };
}
function Z2(e) {
  return (e = +e) == 1 ? SA : function(t, r) {
    return r - t ? Q2(t, r, e) : np(isNaN(t) ? r : t);
  };
}
function SA(e, t) {
  var r = t - e;
  return r ? q2(e, r) : np(isNaN(e) ? t : e);
}
const iw = (function e(t) {
  var r = Z2(t);
  function n(o, l) {
    var s = r((o = th(o)).r, (l = th(l)).r), c = r(o.g, l.g), f = r(o.b, l.b), d = SA(o.opacity, l.opacity);
    return function(h) {
      return o.r = s(h), o.g = c(h), o.b = f(h), o.opacity = d(h), o + "";
    };
  }
  return n.gamma = e, n;
})(1);
function J2(e, t) {
  t || (t = []);
  var r = e ? Math.min(t.length, e.length) : 0, n = t.slice(), o;
  return function(l) {
    for (o = 0; o < r; ++o) n[o] = e[o] * (1 - l) + t[o] * l;
    return n;
  };
}
function eD(e) {
  return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
function tD(e, t) {
  var r = t ? t.length : 0, n = e ? Math.min(r, e.length) : 0, o = new Array(n), l = new Array(r), s;
  for (s = 0; s < n; ++s) o[s] = Ha(e[s], t[s]);
  for (; s < r; ++s) l[s] = t[s];
  return function(c) {
    for (s = 0; s < n; ++s) l[s] = o[s](c);
    return l;
  };
}
function rD(e, t) {
  var r = /* @__PURE__ */ new Date();
  return e = +e, t = +t, function(n) {
    return r.setTime(e * (1 - n) + t * n), r;
  };
}
function Ls(e, t) {
  return e = +e, t = +t, function(r) {
    return e * (1 - r) + t * r;
  };
}
function nD(e, t) {
  var r = {}, n = {}, o;
  (e === null || typeof e != "object") && (e = {}), (t === null || typeof t != "object") && (t = {});
  for (o in t)
    o in e ? r[o] = Ha(e[o], t[o]) : n[o] = t[o];
  return function(l) {
    for (o in r) n[o] = r[o](l);
    return n;
  };
}
var rh = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, cv = new RegExp(rh.source, "g");
function iD(e) {
  return function() {
    return e;
  };
}
function aD(e) {
  return function(t) {
    return e(t) + "";
  };
}
function oD(e, t) {
  var r = rh.lastIndex = cv.lastIndex = 0, n, o, l, s = -1, c = [], f = [];
  for (e = e + "", t = t + ""; (n = rh.exec(e)) && (o = cv.exec(t)); )
    (l = o.index) > r && (l = t.slice(r, l), c[s] ? c[s] += l : c[++s] = l), (n = n[0]) === (o = o[0]) ? c[s] ? c[s] += o : c[++s] = o : (c[++s] = null, f.push({ i: s, x: Ls(n, o) })), r = cv.lastIndex;
  return r < t.length && (l = t.slice(r), c[s] ? c[s] += l : c[++s] = l), c.length < 2 ? f[0] ? aD(f[0].x) : iD(t) : (t = f.length, function(d) {
    for (var h = 0, p; h < t; ++h) c[(p = f[h]).i] = p.x(d);
    return c.join("");
  });
}
function Ha(e, t) {
  var r = typeof t, n;
  return t == null || r === "boolean" ? np(t) : (r === "number" ? Ls : r === "string" ? (n = dl(t)) ? (t = n, iw) : oD : t instanceof dl ? iw : t instanceof Date ? rD : eD(t) ? J2 : Array.isArray(t) ? tD : typeof t.valueOf != "function" && typeof t.toString != "function" || isNaN(t) ? nD : Ls)(e, t);
}
function ip(e, t) {
  return e = +e, t = +t, function(r) {
    return Math.round(e * (1 - r) + t * r);
  };
}
function lD(e, t) {
  t === void 0 && (t = e, e = Ha);
  for (var r = 0, n = t.length - 1, o = t[0], l = new Array(n < 0 ? 0 : n); r < n; ) l[r] = e(o, o = t[++r]);
  return function(s) {
    var c = Math.max(0, Math.min(n - 1, Math.floor(s *= n)));
    return l[c](s - c);
  };
}
function uD(e) {
  return function() {
    return e;
  };
}
function Rs(e) {
  return +e;
}
var aw = [0, 1];
function Ft(e) {
  return e;
}
function nh(e, t) {
  return (t -= e = +e) ? function(r) {
    return (r - e) / t;
  } : uD(isNaN(t) ? NaN : 0.5);
}
function sD(e, t) {
  var r;
  return e > t && (r = e, e = t, t = r), function(n) {
    return Math.max(e, Math.min(t, n));
  };
}
function cD(e, t, r) {
  var n = e[0], o = e[1], l = t[0], s = t[1];
  return o < n ? (n = nh(o, n), l = r(s, l)) : (n = nh(n, o), l = r(l, s)), function(c) {
    return l(n(c));
  };
}
function fD(e, t, r) {
  var n = Math.min(e.length, t.length) - 1, o = new Array(n), l = new Array(n), s = -1;
  for (e[n] < e[0] && (e = e.slice().reverse(), t = t.slice().reverse()); ++s < n; )
    o[s] = nh(e[s], e[s + 1]), l[s] = r(t[s], t[s + 1]);
  return function(c) {
    var f = Ol(e, c, 1, n) - 1;
    return l[f](o[f](c));
  };
}
function _l(e, t) {
  return t.domain(e.domain()).range(e.range()).interpolate(e.interpolate()).clamp(e.clamp()).unknown(e.unknown());
}
function jc() {
  var e = aw, t = aw, r = Ha, n, o, l, s = Ft, c, f, d;
  function h() {
    var y = Math.min(e.length, t.length);
    return s !== Ft && (s = sD(e[0], e[y - 1])), c = y > 2 ? fD : cD, f = d = null, p;
  }
  function p(y) {
    return y == null || isNaN(y = +y) ? l : (f || (f = c(e.map(n), t, r)))(n(s(y)));
  }
  return p.invert = function(y) {
    return s(o((d || (d = c(t, e.map(n), Ls)))(y)));
  }, p.domain = function(y) {
    return arguments.length ? (e = Array.from(y, Rs), h()) : e.slice();
  }, p.range = function(y) {
    return arguments.length ? (t = Array.from(y), h()) : t.slice();
  }, p.rangeRound = function(y) {
    return t = Array.from(y), r = ip, h();
  }, p.clamp = function(y) {
    return arguments.length ? (s = y ? !0 : Ft, h()) : s !== Ft;
  }, p.interpolate = function(y) {
    return arguments.length ? (r = y, h()) : r;
  }, p.unknown = function(y) {
    return arguments.length ? (l = y, p) : l;
  }, function(y, x) {
    return n = y, o = x, h();
  };
}
function ap() {
  return jc()(Ft, Ft);
}
function dD(e) {
  return Math.abs(e = Math.round(e)) >= 1e21 ? e.toLocaleString("en").replace(/,/g, "") : e.toString(10);
}
function zs(e, t) {
  if (!isFinite(e) || e === 0) return null;
  var r = (e = t ? e.toExponential(t - 1) : e.toExponential()).indexOf("e"), n = e.slice(0, r);
  return [
    n.length > 1 ? n[0] + n.slice(2) : n,
    +e.slice(r + 1)
  ];
}
function Ma(e) {
  return e = zs(Math.abs(e)), e ? e[1] : NaN;
}
function vD(e, t) {
  return function(r, n) {
    for (var o = r.length, l = [], s = 0, c = e[0], f = 0; o > 0 && c > 0 && (f + c + 1 > n && (c = Math.max(1, n - f)), l.push(r.substring(o -= c, o + c)), !((f += c + 1) > n)); )
      c = e[s = (s + 1) % e.length];
    return l.reverse().join(t);
  };
}
function hD(e) {
  return function(t) {
    return t.replace(/[0-9]/g, function(r) {
      return e[+r];
    });
  };
}
var pD = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
function vl(e) {
  if (!(t = pD.exec(e))) throw new Error("invalid format: " + e);
  var t;
  return new op({
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
vl.prototype = op.prototype;
function op(e) {
  this.fill = e.fill === void 0 ? " " : e.fill + "", this.align = e.align === void 0 ? ">" : e.align + "", this.sign = e.sign === void 0 ? "-" : e.sign + "", this.symbol = e.symbol === void 0 ? "" : e.symbol + "", this.zero = !!e.zero, this.width = e.width === void 0 ? void 0 : +e.width, this.comma = !!e.comma, this.precision = e.precision === void 0 ? void 0 : +e.precision, this.trim = !!e.trim, this.type = e.type === void 0 ? "" : e.type + "";
}
op.prototype.toString = function() {
  return this.fill + this.align + this.sign + this.symbol + (this.zero ? "0" : "") + (this.width === void 0 ? "" : Math.max(1, this.width | 0)) + (this.comma ? "," : "") + (this.precision === void 0 ? "" : "." + Math.max(0, this.precision | 0)) + (this.trim ? "~" : "") + this.type;
};
function mD(e) {
  e: for (var t = e.length, r = 1, n = -1, o; r < t; ++r)
    switch (e[r]) {
      case ".":
        n = o = r;
        break;
      case "0":
        n === 0 && (n = r), o = r;
        break;
      default:
        if (!+e[r]) break e;
        n > 0 && (n = 0);
        break;
    }
  return n > 0 ? e.slice(0, n) + e.slice(o + 1) : e;
}
var Bs;
function yD(e, t) {
  var r = zs(e, t);
  if (!r) return Bs = void 0, e.toPrecision(t);
  var n = r[0], o = r[1], l = o - (Bs = Math.max(-8, Math.min(8, Math.floor(o / 3))) * 3) + 1, s = n.length;
  return l === s ? n : l > s ? n + new Array(l - s + 1).join("0") : l > 0 ? n.slice(0, l) + "." + n.slice(l) : "0." + new Array(1 - l).join("0") + zs(e, Math.max(0, t + l - 1))[0];
}
function ow(e, t) {
  var r = zs(e, t);
  if (!r) return e + "";
  var n = r[0], o = r[1];
  return o < 0 ? "0." + new Array(-o).join("0") + n : n.length > o + 1 ? n.slice(0, o + 1) + "." + n.slice(o + 1) : n + new Array(o - n.length + 2).join("0");
}
const lw = {
  "%": (e, t) => (e * 100).toFixed(t),
  b: (e) => Math.round(e).toString(2),
  c: (e) => e + "",
  d: dD,
  e: (e, t) => e.toExponential(t),
  f: (e, t) => e.toFixed(t),
  g: (e, t) => e.toPrecision(t),
  o: (e) => Math.round(e).toString(8),
  p: (e, t) => ow(e * 100, t),
  r: ow,
  s: yD,
  X: (e) => Math.round(e).toString(16).toUpperCase(),
  x: (e) => Math.round(e).toString(16)
};
function uw(e) {
  return e;
}
var sw = Array.prototype.map, cw = ["y", "z", "a", "f", "p", "n", "µ", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"];
function gD(e) {
  var t = e.grouping === void 0 || e.thousands === void 0 ? uw : vD(sw.call(e.grouping, Number), e.thousands + ""), r = e.currency === void 0 ? "" : e.currency[0] + "", n = e.currency === void 0 ? "" : e.currency[1] + "", o = e.decimal === void 0 ? "." : e.decimal + "", l = e.numerals === void 0 ? uw : hD(sw.call(e.numerals, String)), s = e.percent === void 0 ? "%" : e.percent + "", c = e.minus === void 0 ? "−" : e.minus + "", f = e.nan === void 0 ? "NaN" : e.nan + "";
  function d(p, y) {
    p = vl(p);
    var x = p.fill, A = p.align, S = p.sign, b = p.symbol, E = p.zero, k = p.width, C = p.comma, j = p.precision, T = p.trim, O = p.type;
    O === "n" ? (C = !0, O = "g") : lw[O] || (j === void 0 && (j = 12), T = !0, O = "g"), (E || x === "0" && A === "=") && (E = !0, x = "0", A = "=");
    var _ = (y && y.prefix !== void 0 ? y.prefix : "") + (b === "$" ? r : b === "#" && /[boxX]/.test(O) ? "0" + O.toLowerCase() : ""), F = (b === "$" ? n : /[%p]/.test(O) ? s : "") + (y && y.suffix !== void 0 ? y.suffix : ""), K = lw[O], V = /[defgprs%]/.test(O);
    j = j === void 0 ? 6 : /[gprs]/.test(O) ? Math.max(1, Math.min(21, j)) : Math.max(0, Math.min(20, j));
    function q(W) {
      var ie = _, re = F, we, ve, ae;
      if (O === "c")
        re = K(W) + re, W = "";
      else {
        W = +W;
        var U = W < 0 || 1 / W < 0;
        if (W = isNaN(W) ? f : K(Math.abs(W), j), T && (W = mD(W)), U && +W == 0 && S !== "+" && (U = !1), ie = (U ? S === "(" ? S : c : S === "-" || S === "(" ? "" : S) + ie, re = (O === "s" && !isNaN(W) && Bs !== void 0 ? cw[8 + Bs / 3] : "") + re + (U && S === "(" ? ")" : ""), V) {
          for (we = -1, ve = W.length; ++we < ve; )
            if (ae = W.charCodeAt(we), 48 > ae || ae > 57) {
              re = (ae === 46 ? o + W.slice(we + 1) : W.slice(we)) + re, W = W.slice(0, we);
              break;
            }
        }
      }
      C && !E && (W = t(W, 1 / 0));
      var te = ie.length + W.length + re.length, Y = te < k ? new Array(k - te + 1).join(x) : "";
      switch (C && E && (W = t(Y + W, Y.length ? k - re.length : 1 / 0), Y = ""), A) {
        case "<":
          W = ie + W + re + Y;
          break;
        case "=":
          W = ie + Y + W + re;
          break;
        case "^":
          W = Y.slice(0, te = Y.length >> 1) + ie + W + re + Y.slice(te);
          break;
        default:
          W = Y + ie + W + re;
          break;
      }
      return l(W);
    }
    return q.toString = function() {
      return p + "";
    }, q;
  }
  function h(p, y) {
    var x = Math.max(-8, Math.min(8, Math.floor(Ma(y) / 3))) * 3, A = Math.pow(10, -x), S = d((p = vl(p), p.type = "f", p), { suffix: cw[8 + x / 3] });
    return function(b) {
      return S(A * b);
    };
  }
  return {
    format: d,
    formatPrefix: h
  };
}
var ts, lp, AA;
xD({
  thousands: ",",
  grouping: [3],
  currency: ["$", ""]
});
function xD(e) {
  return ts = gD(e), lp = ts.format, AA = ts.formatPrefix, ts;
}
function wD(e) {
  return Math.max(0, -Ma(Math.abs(e)));
}
function bD(e, t) {
  return Math.max(0, Math.max(-8, Math.min(8, Math.floor(Ma(t) / 3))) * 3 - Ma(Math.abs(e)));
}
function SD(e, t) {
  return e = Math.abs(e), t = Math.abs(t) - e, Math.max(0, Ma(t) - Ma(e)) + 1;
}
function PA(e, t, r, n) {
  var o = Jv(e, t, r), l;
  switch (n = vl(n ?? ",f"), n.type) {
    case "s": {
      var s = Math.max(Math.abs(e), Math.abs(t));
      return n.precision == null && !isNaN(l = bD(o, s)) && (n.precision = l), AA(n, s);
    }
    case "":
    case "e":
    case "g":
    case "p":
    case "r": {
      n.precision == null && !isNaN(l = SD(o, Math.max(Math.abs(e), Math.abs(t)))) && (n.precision = l - (n.type === "e"));
      break;
    }
    case "f":
    case "%": {
      n.precision == null && !isNaN(l = wD(o)) && (n.precision = l - (n.type === "%") * 2);
      break;
    }
  }
  return lp(n);
}
function ii(e) {
  var t = e.domain;
  return e.ticks = function(r) {
    var n = t();
    return Qv(n[0], n[n.length - 1], r ?? 10);
  }, e.tickFormat = function(r, n) {
    var o = t();
    return PA(o[0], o[o.length - 1], r ?? 10, n);
  }, e.nice = function(r) {
    r == null && (r = 10);
    var n = t(), o = 0, l = n.length - 1, s = n[o], c = n[l], f, d, h = 10;
    for (c < s && (d = s, s = c, c = d, d = o, o = l, l = d); h-- > 0; ) {
      if (d = Zv(s, c, r), d === f)
        return n[o] = s, n[l] = c, t(n);
      if (d > 0)
        s = Math.floor(s / d) * d, c = Math.ceil(c / d) * d;
      else if (d < 0)
        s = Math.ceil(s * d) / d, c = Math.floor(c * d) / d;
      else
        break;
      f = d;
    }
    return e;
  }, e;
}
function EA() {
  var e = ap();
  return e.copy = function() {
    return _l(e, EA());
  }, br.apply(e, arguments), ii(e);
}
function OA(e) {
  var t;
  function r(n) {
    return n == null || isNaN(n = +n) ? t : n;
  }
  return r.invert = r, r.domain = r.range = function(n) {
    return arguments.length ? (e = Array.from(n, Rs), r) : e.slice();
  }, r.unknown = function(n) {
    return arguments.length ? (t = n, r) : t;
  }, r.copy = function() {
    return OA(e).unknown(t);
  }, e = arguments.length ? Array.from(e, Rs) : [0, 1], ii(r);
}
function kA(e, t) {
  e = e.slice();
  var r = 0, n = e.length - 1, o = e[r], l = e[n], s;
  return l < o && (s = r, r = n, n = s, s = o, o = l, l = s), e[r] = t.floor(o), e[n] = t.ceil(l), e;
}
function fw(e) {
  return Math.log(e);
}
function dw(e) {
  return Math.exp(e);
}
function AD(e) {
  return -Math.log(-e);
}
function PD(e) {
  return -Math.exp(-e);
}
function ED(e) {
  return isFinite(e) ? +("1e" + e) : e < 0 ? 0 : e;
}
function OD(e) {
  return e === 10 ? ED : e === Math.E ? Math.exp : (t) => Math.pow(e, t);
}
function kD(e) {
  return e === Math.E ? Math.log : e === 10 && Math.log10 || e === 2 && Math.log2 || (e = Math.log(e), (t) => Math.log(t) / e);
}
function vw(e) {
  return (t, r) => -e(-t, r);
}
function up(e) {
  const t = e(fw, dw), r = t.domain;
  let n = 10, o, l;
  function s() {
    return o = kD(n), l = OD(n), r()[0] < 0 ? (o = vw(o), l = vw(l), e(AD, PD)) : e(fw, dw), t;
  }
  return t.base = function(c) {
    return arguments.length ? (n = +c, s()) : n;
  }, t.domain = function(c) {
    return arguments.length ? (r(c), s()) : r();
  }, t.ticks = (c) => {
    const f = r();
    let d = f[0], h = f[f.length - 1];
    const p = h < d;
    p && ([d, h] = [h, d]);
    let y = o(d), x = o(h), A, S;
    const b = c == null ? 10 : +c;
    let E = [];
    if (!(n % 1) && x - y < b) {
      if (y = Math.floor(y), x = Math.ceil(x), d > 0) {
        for (; y <= x; ++y)
          for (A = 1; A < n; ++A)
            if (S = y < 0 ? A / l(-y) : A * l(y), !(S < d)) {
              if (S > h) break;
              E.push(S);
            }
      } else for (; y <= x; ++y)
        for (A = n - 1; A >= 1; --A)
          if (S = y > 0 ? A / l(-y) : A * l(y), !(S < d)) {
            if (S > h) break;
            E.push(S);
          }
      E.length * 2 < b && (E = Qv(d, h, b));
    } else
      E = Qv(y, x, Math.min(x - y, b)).map(l);
    return p ? E.reverse() : E;
  }, t.tickFormat = (c, f) => {
    if (c == null && (c = 10), f == null && (f = n === 10 ? "s" : ","), typeof f != "function" && (!(n % 1) && (f = vl(f)).precision == null && (f.trim = !0), f = lp(f)), c === 1 / 0) return f;
    const d = Math.max(1, n * c / t.ticks().length);
    return (h) => {
      let p = h / l(Math.round(o(h)));
      return p * n < n - 0.5 && (p *= n), p <= d ? f(h) : "";
    };
  }, t.nice = () => r(kA(r(), {
    floor: (c) => l(Math.floor(o(c))),
    ceil: (c) => l(Math.ceil(o(c)))
  })), t;
}
function _A() {
  const e = up(jc()).domain([1, 10]);
  return e.copy = () => _l(e, _A()).base(e.base()), br.apply(e, arguments), e;
}
function hw(e) {
  return function(t) {
    return Math.sign(t) * Math.log1p(Math.abs(t / e));
  };
}
function pw(e) {
  return function(t) {
    return Math.sign(t) * Math.expm1(Math.abs(t)) * e;
  };
}
function sp(e) {
  var t = 1, r = e(hw(t), pw(t));
  return r.constant = function(n) {
    return arguments.length ? e(hw(t = +n), pw(t)) : t;
  }, ii(r);
}
function CA() {
  var e = sp(jc());
  return e.copy = function() {
    return _l(e, CA()).constant(e.constant());
  }, br.apply(e, arguments);
}
function mw(e) {
  return function(t) {
    return t < 0 ? -Math.pow(-t, e) : Math.pow(t, e);
  };
}
function _D(e) {
  return e < 0 ? -Math.sqrt(-e) : Math.sqrt(e);
}
function CD(e) {
  return e < 0 ? -e * e : e * e;
}
function cp(e) {
  var t = e(Ft, Ft), r = 1;
  function n() {
    return r === 1 ? e(Ft, Ft) : r === 0.5 ? e(_D, CD) : e(mw(r), mw(1 / r));
  }
  return t.exponent = function(o) {
    return arguments.length ? (r = +o, n()) : r;
  }, ii(t);
}
function fp() {
  var e = cp(jc());
  return e.copy = function() {
    return _l(e, fp()).exponent(e.exponent());
  }, br.apply(e, arguments), e;
}
function ID() {
  return fp.apply(null, arguments).exponent(0.5);
}
function yw(e) {
  return Math.sign(e) * e * e;
}
function jD(e) {
  return Math.sign(e) * Math.sqrt(Math.abs(e));
}
function IA() {
  var e = ap(), t = [0, 1], r = !1, n;
  function o(l) {
    var s = jD(e(l));
    return isNaN(s) ? n : r ? Math.round(s) : s;
  }
  return o.invert = function(l) {
    return e.invert(yw(l));
  }, o.domain = function(l) {
    return arguments.length ? (e.domain(l), o) : e.domain();
  }, o.range = function(l) {
    return arguments.length ? (e.range((t = Array.from(l, Rs)).map(yw)), o) : t.slice();
  }, o.rangeRound = function(l) {
    return o.range(l).round(!0);
  }, o.round = function(l) {
    return arguments.length ? (r = !!l, o) : r;
  }, o.clamp = function(l) {
    return arguments.length ? (e.clamp(l), o) : e.clamp();
  }, o.unknown = function(l) {
    return arguments.length ? (n = l, o) : n;
  }, o.copy = function() {
    return IA(e.domain(), t).round(r).clamp(e.clamp()).unknown(n);
  }, br.apply(o, arguments), ii(o);
}
function jA() {
  var e = [], t = [], r = [], n;
  function o() {
    var s = 0, c = Math.max(1, t.length);
    for (r = new Array(c - 1); ++s < c; ) r[s - 1] = D2(e, s / c);
    return l;
  }
  function l(s) {
    return s == null || isNaN(s = +s) ? n : t[Ol(r, s)];
  }
  return l.invertExtent = function(s) {
    var c = t.indexOf(s);
    return c < 0 ? [NaN, NaN] : [
      c > 0 ? r[c - 1] : e[0],
      c < r.length ? r[c] : e[e.length - 1]
    ];
  }, l.domain = function(s) {
    if (!arguments.length) return e.slice();
    e = [];
    for (let c of s) c != null && !isNaN(c = +c) && e.push(c);
    return e.sort(ti), o();
  }, l.range = function(s) {
    return arguments.length ? (t = Array.from(s), o()) : t.slice();
  }, l.unknown = function(s) {
    return arguments.length ? (n = s, l) : n;
  }, l.quantiles = function() {
    return r.slice();
  }, l.copy = function() {
    return jA().domain(e).range(t).unknown(n);
  }, br.apply(l, arguments);
}
function TA() {
  var e = 0, t = 1, r = 1, n = [0.5], o = [0, 1], l;
  function s(f) {
    return f != null && f <= f ? o[Ol(n, f, 0, r)] : l;
  }
  function c() {
    var f = -1;
    for (n = new Array(r); ++f < r; ) n[f] = ((f + 1) * t - (f - r) * e) / (r + 1);
    return s;
  }
  return s.domain = function(f) {
    return arguments.length ? ([e, t] = f, e = +e, t = +t, c()) : [e, t];
  }, s.range = function(f) {
    return arguments.length ? (r = (o = Array.from(f)).length - 1, c()) : o.slice();
  }, s.invertExtent = function(f) {
    var d = o.indexOf(f);
    return d < 0 ? [NaN, NaN] : d < 1 ? [e, n[0]] : d >= r ? [n[r - 1], t] : [n[d - 1], n[d]];
  }, s.unknown = function(f) {
    return arguments.length && (l = f), s;
  }, s.thresholds = function() {
    return n.slice();
  }, s.copy = function() {
    return TA().domain([e, t]).range(o).unknown(l);
  }, br.apply(ii(s), arguments);
}
function NA() {
  var e = [0.5], t = [0, 1], r, n = 1;
  function o(l) {
    return l != null && l <= l ? t[Ol(e, l, 0, n)] : r;
  }
  return o.domain = function(l) {
    return arguments.length ? (e = Array.from(l), n = Math.min(e.length, t.length - 1), o) : e.slice();
  }, o.range = function(l) {
    return arguments.length ? (t = Array.from(l), n = Math.min(e.length, t.length - 1), o) : t.slice();
  }, o.invertExtent = function(l) {
    var s = t.indexOf(l);
    return [e[s - 1], e[s]];
  }, o.unknown = function(l) {
    return arguments.length ? (r = l, o) : r;
  }, o.copy = function() {
    return NA().domain(e).range(t).unknown(r);
  }, br.apply(o, arguments);
}
const fv = /* @__PURE__ */ new Date(), dv = /* @__PURE__ */ new Date();
function ct(e, t, r, n) {
  function o(l) {
    return e(l = arguments.length === 0 ? /* @__PURE__ */ new Date() : /* @__PURE__ */ new Date(+l)), l;
  }
  return o.floor = (l) => (e(l = /* @__PURE__ */ new Date(+l)), l), o.ceil = (l) => (e(l = new Date(l - 1)), t(l, 1), e(l), l), o.round = (l) => {
    const s = o(l), c = o.ceil(l);
    return l - s < c - l ? s : c;
  }, o.offset = (l, s) => (t(l = /* @__PURE__ */ new Date(+l), s == null ? 1 : Math.floor(s)), l), o.range = (l, s, c) => {
    const f = [];
    if (l = o.ceil(l), c = c == null ? 1 : Math.floor(c), !(l < s) || !(c > 0)) return f;
    let d;
    do
      f.push(d = /* @__PURE__ */ new Date(+l)), t(l, c), e(l);
    while (d < l && l < s);
    return f;
  }, o.filter = (l) => ct((s) => {
    if (s >= s) for (; e(s), !l(s); ) s.setTime(s - 1);
  }, (s, c) => {
    if (s >= s)
      if (c < 0) for (; ++c <= 0; )
        for (; t(s, -1), !l(s); )
          ;
      else for (; --c >= 0; )
        for (; t(s, 1), !l(s); )
          ;
  }), r && (o.count = (l, s) => (fv.setTime(+l), dv.setTime(+s), e(fv), e(dv), Math.floor(r(fv, dv))), o.every = (l) => (l = Math.floor(l), !isFinite(l) || !(l > 0) ? null : l > 1 ? o.filter(n ? (s) => n(s) % l === 0 : (s) => o.count(0, s) % l === 0) : o)), o;
}
const Fs = ct(() => {
}, (e, t) => {
  e.setTime(+e + t);
}, (e, t) => t - e);
Fs.every = (e) => (e = Math.floor(e), !isFinite(e) || !(e > 0) ? null : e > 1 ? ct((t) => {
  t.setTime(Math.floor(t / e) * e);
}, (t, r) => {
  t.setTime(+t + r * e);
}, (t, r) => (r - t) / e) : Fs);
Fs.range;
const mn = 1e3, yr = mn * 60, yn = yr * 60, bn = yn * 24, dp = bn * 7, gw = bn * 30, vv = bn * 365, Ci = ct((e) => {
  e.setTime(e - e.getMilliseconds());
}, (e, t) => {
  e.setTime(+e + t * mn);
}, (e, t) => (t - e) / mn, (e) => e.getUTCSeconds());
Ci.range;
const vp = ct((e) => {
  e.setTime(e - e.getMilliseconds() - e.getSeconds() * mn);
}, (e, t) => {
  e.setTime(+e + t * yr);
}, (e, t) => (t - e) / yr, (e) => e.getMinutes());
vp.range;
const hp = ct((e) => {
  e.setUTCSeconds(0, 0);
}, (e, t) => {
  e.setTime(+e + t * yr);
}, (e, t) => (t - e) / yr, (e) => e.getUTCMinutes());
hp.range;
const pp = ct((e) => {
  e.setTime(e - e.getMilliseconds() - e.getSeconds() * mn - e.getMinutes() * yr);
}, (e, t) => {
  e.setTime(+e + t * yn);
}, (e, t) => (t - e) / yn, (e) => e.getHours());
pp.range;
const mp = ct((e) => {
  e.setUTCMinutes(0, 0, 0);
}, (e, t) => {
  e.setTime(+e + t * yn);
}, (e, t) => (t - e) / yn, (e) => e.getUTCHours());
mp.range;
const Cl = ct(
  (e) => e.setHours(0, 0, 0, 0),
  (e, t) => e.setDate(e.getDate() + t),
  (e, t) => (t - e - (t.getTimezoneOffset() - e.getTimezoneOffset()) * yr) / bn,
  (e) => e.getDate() - 1
);
Cl.range;
const Tc = ct((e) => {
  e.setUTCHours(0, 0, 0, 0);
}, (e, t) => {
  e.setUTCDate(e.getUTCDate() + t);
}, (e, t) => (t - e) / bn, (e) => e.getUTCDate() - 1);
Tc.range;
const MA = ct((e) => {
  e.setUTCHours(0, 0, 0, 0);
}, (e, t) => {
  e.setUTCDate(e.getUTCDate() + t);
}, (e, t) => (t - e) / bn, (e) => Math.floor(e / bn));
MA.range;
function Ui(e) {
  return ct((t) => {
    t.setDate(t.getDate() - (t.getDay() + 7 - e) % 7), t.setHours(0, 0, 0, 0);
  }, (t, r) => {
    t.setDate(t.getDate() + r * 7);
  }, (t, r) => (r - t - (r.getTimezoneOffset() - t.getTimezoneOffset()) * yr) / dp);
}
const Nc = Ui(0), Ws = Ui(1), TD = Ui(2), ND = Ui(3), Da = Ui(4), MD = Ui(5), DD = Ui(6);
Nc.range;
Ws.range;
TD.range;
ND.range;
Da.range;
MD.range;
DD.range;
function Hi(e) {
  return ct((t) => {
    t.setUTCDate(t.getUTCDate() - (t.getUTCDay() + 7 - e) % 7), t.setUTCHours(0, 0, 0, 0);
  }, (t, r) => {
    t.setUTCDate(t.getUTCDate() + r * 7);
  }, (t, r) => (r - t) / dp);
}
const Mc = Hi(0), Us = Hi(1), $D = Hi(2), LD = Hi(3), $a = Hi(4), RD = Hi(5), zD = Hi(6);
Mc.range;
Us.range;
$D.range;
LD.range;
$a.range;
RD.range;
zD.range;
const yp = ct((e) => {
  e.setDate(1), e.setHours(0, 0, 0, 0);
}, (e, t) => {
  e.setMonth(e.getMonth() + t);
}, (e, t) => t.getMonth() - e.getMonth() + (t.getFullYear() - e.getFullYear()) * 12, (e) => e.getMonth());
yp.range;
const gp = ct((e) => {
  e.setUTCDate(1), e.setUTCHours(0, 0, 0, 0);
}, (e, t) => {
  e.setUTCMonth(e.getUTCMonth() + t);
}, (e, t) => t.getUTCMonth() - e.getUTCMonth() + (t.getUTCFullYear() - e.getUTCFullYear()) * 12, (e) => e.getUTCMonth());
gp.range;
const Sn = ct((e) => {
  e.setMonth(0, 1), e.setHours(0, 0, 0, 0);
}, (e, t) => {
  e.setFullYear(e.getFullYear() + t);
}, (e, t) => t.getFullYear() - e.getFullYear(), (e) => e.getFullYear());
Sn.every = (e) => !isFinite(e = Math.floor(e)) || !(e > 0) ? null : ct((t) => {
  t.setFullYear(Math.floor(t.getFullYear() / e) * e), t.setMonth(0, 1), t.setHours(0, 0, 0, 0);
}, (t, r) => {
  t.setFullYear(t.getFullYear() + r * e);
});
Sn.range;
const An = ct((e) => {
  e.setUTCMonth(0, 1), e.setUTCHours(0, 0, 0, 0);
}, (e, t) => {
  e.setUTCFullYear(e.getUTCFullYear() + t);
}, (e, t) => t.getUTCFullYear() - e.getUTCFullYear(), (e) => e.getUTCFullYear());
An.every = (e) => !isFinite(e = Math.floor(e)) || !(e > 0) ? null : ct((t) => {
  t.setUTCFullYear(Math.floor(t.getUTCFullYear() / e) * e), t.setUTCMonth(0, 1), t.setUTCHours(0, 0, 0, 0);
}, (t, r) => {
  t.setUTCFullYear(t.getUTCFullYear() + r * e);
});
An.range;
function DA(e, t, r, n, o, l) {
  const s = [
    [Ci, 1, mn],
    [Ci, 5, 5 * mn],
    [Ci, 15, 15 * mn],
    [Ci, 30, 30 * mn],
    [l, 1, yr],
    [l, 5, 5 * yr],
    [l, 15, 15 * yr],
    [l, 30, 30 * yr],
    [o, 1, yn],
    [o, 3, 3 * yn],
    [o, 6, 6 * yn],
    [o, 12, 12 * yn],
    [n, 1, bn],
    [n, 2, 2 * bn],
    [r, 1, dp],
    [t, 1, gw],
    [t, 3, 3 * gw],
    [e, 1, vv]
  ];
  function c(d, h, p) {
    const y = h < d;
    y && ([d, h] = [h, d]);
    const x = p && typeof p.range == "function" ? p : f(d, h, p), A = x ? x.range(d, +h + 1) : [];
    return y ? A.reverse() : A;
  }
  function f(d, h, p) {
    const y = Math.abs(h - d) / p, x = Jh(([, , b]) => b).right(s, y);
    if (x === s.length) return e.every(Jv(d / vv, h / vv, p));
    if (x === 0) return Fs.every(Math.max(Jv(d, h, p), 1));
    const [A, S] = s[y / s[x - 1][2] < s[x][2] / y ? x - 1 : x];
    return A.every(S);
  }
  return [c, f];
}
const [BD, FD] = DA(An, gp, Mc, MA, mp, hp), [WD, UD] = DA(Sn, yp, Nc, Cl, pp, vp);
function hv(e) {
  if (0 <= e.y && e.y < 100) {
    var t = new Date(-1, e.m, e.d, e.H, e.M, e.S, e.L);
    return t.setFullYear(e.y), t;
  }
  return new Date(e.y, e.m, e.d, e.H, e.M, e.S, e.L);
}
function pv(e) {
  if (0 <= e.y && e.y < 100) {
    var t = new Date(Date.UTC(-1, e.m, e.d, e.H, e.M, e.S, e.L));
    return t.setUTCFullYear(e.y), t;
  }
  return new Date(Date.UTC(e.y, e.m, e.d, e.H, e.M, e.S, e.L));
}
function Ho(e, t, r) {
  return { y: e, m: t, d: r, H: 0, M: 0, S: 0, L: 0 };
}
function HD(e) {
  var t = e.dateTime, r = e.date, n = e.time, o = e.periods, l = e.days, s = e.shortDays, c = e.months, f = e.shortMonths, d = Ko(o), h = Vo(o), p = Ko(l), y = Vo(l), x = Ko(s), A = Vo(s), S = Ko(c), b = Vo(c), E = Ko(f), k = Vo(f), C = {
    a: ae,
    A: U,
    b: te,
    B: Y,
    c: null,
    d: Pw,
    e: Pw,
    f: v$,
    g: A$,
    G: E$,
    H: c$,
    I: f$,
    j: d$,
    L: $A,
    m: h$,
    M: p$,
    p: $,
    q: H,
    Q: kw,
    s: _w,
    S: m$,
    u: y$,
    U: g$,
    V: x$,
    w: w$,
    W: b$,
    x: null,
    X: null,
    y: S$,
    Y: P$,
    Z: O$,
    "%": Ow
  }, j = {
    a: fe,
    A: ge,
    b: Ae,
    B: Pe,
    c: null,
    d: Ew,
    e: Ew,
    f: I$,
    g: B$,
    G: W$,
    H: k$,
    I: _$,
    j: C$,
    L: RA,
    m: j$,
    M: T$,
    p: Ee,
    q: _e,
    Q: kw,
    s: _w,
    S: N$,
    u: M$,
    U: D$,
    V: $$,
    w: L$,
    W: R$,
    x: null,
    X: null,
    y: z$,
    Y: F$,
    Z: U$,
    "%": Ow
  }, T = {
    a: V,
    A: q,
    b: W,
    B: ie,
    c: re,
    d: Sw,
    e: Sw,
    f: o$,
    g: bw,
    G: ww,
    H: Aw,
    I: Aw,
    j: r$,
    L: a$,
    m: t$,
    M: n$,
    p: K,
    q: e$,
    Q: u$,
    s: s$,
    S: i$,
    u: XD,
    U: qD,
    V: QD,
    w: GD,
    W: ZD,
    x: we,
    X: ve,
    y: bw,
    Y: ww,
    Z: JD,
    "%": l$
  };
  C.x = O(r, C), C.X = O(n, C), C.c = O(t, C), j.x = O(r, j), j.X = O(n, j), j.c = O(t, j);
  function O(J, pe) {
    return function(be) {
      var Z = [], Ze = -1, je = 0, xe = J.length, Ot, Ar, Qa;
      for (be instanceof Date || (be = /* @__PURE__ */ new Date(+be)); ++Ze < xe; )
        J.charCodeAt(Ze) === 37 && (Z.push(J.slice(je, Ze)), (Ar = xw[Ot = J.charAt(++Ze)]) != null ? Ot = J.charAt(++Ze) : Ar = Ot === "e" ? " " : "0", (Qa = pe[Ot]) && (Ot = Qa(be, Ar)), Z.push(Ot), je = Ze + 1);
      return Z.push(J.slice(je, Ze)), Z.join("");
    };
  }
  function _(J, pe) {
    return function(be) {
      var Z = Ho(1900, void 0, 1), Ze = F(Z, J, be += "", 0), je, xe;
      if (Ze != be.length) return null;
      if ("Q" in Z) return new Date(Z.Q);
      if ("s" in Z) return new Date(Z.s * 1e3 + ("L" in Z ? Z.L : 0));
      if (pe && !("Z" in Z) && (Z.Z = 0), "p" in Z && (Z.H = Z.H % 12 + Z.p * 12), Z.m === void 0 && (Z.m = "q" in Z ? Z.q : 0), "V" in Z) {
        if (Z.V < 1 || Z.V > 53) return null;
        "w" in Z || (Z.w = 1), "Z" in Z ? (je = pv(Ho(Z.y, 0, 1)), xe = je.getUTCDay(), je = xe > 4 || xe === 0 ? Us.ceil(je) : Us(je), je = Tc.offset(je, (Z.V - 1) * 7), Z.y = je.getUTCFullYear(), Z.m = je.getUTCMonth(), Z.d = je.getUTCDate() + (Z.w + 6) % 7) : (je = hv(Ho(Z.y, 0, 1)), xe = je.getDay(), je = xe > 4 || xe === 0 ? Ws.ceil(je) : Ws(je), je = Cl.offset(je, (Z.V - 1) * 7), Z.y = je.getFullYear(), Z.m = je.getMonth(), Z.d = je.getDate() + (Z.w + 6) % 7);
      } else ("W" in Z || "U" in Z) && ("w" in Z || (Z.w = "u" in Z ? Z.u % 7 : "W" in Z ? 1 : 0), xe = "Z" in Z ? pv(Ho(Z.y, 0, 1)).getUTCDay() : hv(Ho(Z.y, 0, 1)).getDay(), Z.m = 0, Z.d = "W" in Z ? (Z.w + 6) % 7 + Z.W * 7 - (xe + 5) % 7 : Z.w + Z.U * 7 - (xe + 6) % 7);
      return "Z" in Z ? (Z.H += Z.Z / 100 | 0, Z.M += Z.Z % 100, pv(Z)) : hv(Z);
    };
  }
  function F(J, pe, be, Z) {
    for (var Ze = 0, je = pe.length, xe = be.length, Ot, Ar; Ze < je; ) {
      if (Z >= xe) return -1;
      if (Ot = pe.charCodeAt(Ze++), Ot === 37) {
        if (Ot = pe.charAt(Ze++), Ar = T[Ot in xw ? pe.charAt(Ze++) : Ot], !Ar || (Z = Ar(J, be, Z)) < 0) return -1;
      } else if (Ot != be.charCodeAt(Z++))
        return -1;
    }
    return Z;
  }
  function K(J, pe, be) {
    var Z = d.exec(pe.slice(be));
    return Z ? (J.p = h.get(Z[0].toLowerCase()), be + Z[0].length) : -1;
  }
  function V(J, pe, be) {
    var Z = x.exec(pe.slice(be));
    return Z ? (J.w = A.get(Z[0].toLowerCase()), be + Z[0].length) : -1;
  }
  function q(J, pe, be) {
    var Z = p.exec(pe.slice(be));
    return Z ? (J.w = y.get(Z[0].toLowerCase()), be + Z[0].length) : -1;
  }
  function W(J, pe, be) {
    var Z = E.exec(pe.slice(be));
    return Z ? (J.m = k.get(Z[0].toLowerCase()), be + Z[0].length) : -1;
  }
  function ie(J, pe, be) {
    var Z = S.exec(pe.slice(be));
    return Z ? (J.m = b.get(Z[0].toLowerCase()), be + Z[0].length) : -1;
  }
  function re(J, pe, be) {
    return F(J, t, pe, be);
  }
  function we(J, pe, be) {
    return F(J, r, pe, be);
  }
  function ve(J, pe, be) {
    return F(J, n, pe, be);
  }
  function ae(J) {
    return s[J.getDay()];
  }
  function U(J) {
    return l[J.getDay()];
  }
  function te(J) {
    return f[J.getMonth()];
  }
  function Y(J) {
    return c[J.getMonth()];
  }
  function $(J) {
    return o[+(J.getHours() >= 12)];
  }
  function H(J) {
    return 1 + ~~(J.getMonth() / 3);
  }
  function fe(J) {
    return s[J.getUTCDay()];
  }
  function ge(J) {
    return l[J.getUTCDay()];
  }
  function Ae(J) {
    return f[J.getUTCMonth()];
  }
  function Pe(J) {
    return c[J.getUTCMonth()];
  }
  function Ee(J) {
    return o[+(J.getUTCHours() >= 12)];
  }
  function _e(J) {
    return 1 + ~~(J.getUTCMonth() / 3);
  }
  return {
    format: function(J) {
      var pe = O(J += "", C);
      return pe.toString = function() {
        return J;
      }, pe;
    },
    parse: function(J) {
      var pe = _(J += "", !1);
      return pe.toString = function() {
        return J;
      }, pe;
    },
    utcFormat: function(J) {
      var pe = O(J += "", j);
      return pe.toString = function() {
        return J;
      }, pe;
    },
    utcParse: function(J) {
      var pe = _(J += "", !0);
      return pe.toString = function() {
        return J;
      }, pe;
    }
  };
}
var xw = { "-": "", _: " ", 0: "0" }, gt = /^\s*\d+/, KD = /^%/, VD = /[\\^$*+?|[\]().{}]/g;
function Me(e, t, r) {
  var n = e < 0 ? "-" : "", o = (n ? -e : e) + "", l = o.length;
  return n + (l < r ? new Array(r - l + 1).join(t) + o : o);
}
function YD(e) {
  return e.replace(VD, "\\$&");
}
function Ko(e) {
  return new RegExp("^(?:" + e.map(YD).join("|") + ")", "i");
}
function Vo(e) {
  return new Map(e.map((t, r) => [t.toLowerCase(), r]));
}
function GD(e, t, r) {
  var n = gt.exec(t.slice(r, r + 1));
  return n ? (e.w = +n[0], r + n[0].length) : -1;
}
function XD(e, t, r) {
  var n = gt.exec(t.slice(r, r + 1));
  return n ? (e.u = +n[0], r + n[0].length) : -1;
}
function qD(e, t, r) {
  var n = gt.exec(t.slice(r, r + 2));
  return n ? (e.U = +n[0], r + n[0].length) : -1;
}
function QD(e, t, r) {
  var n = gt.exec(t.slice(r, r + 2));
  return n ? (e.V = +n[0], r + n[0].length) : -1;
}
function ZD(e, t, r) {
  var n = gt.exec(t.slice(r, r + 2));
  return n ? (e.W = +n[0], r + n[0].length) : -1;
}
function ww(e, t, r) {
  var n = gt.exec(t.slice(r, r + 4));
  return n ? (e.y = +n[0], r + n[0].length) : -1;
}
function bw(e, t, r) {
  var n = gt.exec(t.slice(r, r + 2));
  return n ? (e.y = +n[0] + (+n[0] > 68 ? 1900 : 2e3), r + n[0].length) : -1;
}
function JD(e, t, r) {
  var n = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(t.slice(r, r + 6));
  return n ? (e.Z = n[1] ? 0 : -(n[2] + (n[3] || "00")), r + n[0].length) : -1;
}
function e$(e, t, r) {
  var n = gt.exec(t.slice(r, r + 1));
  return n ? (e.q = n[0] * 3 - 3, r + n[0].length) : -1;
}
function t$(e, t, r) {
  var n = gt.exec(t.slice(r, r + 2));
  return n ? (e.m = n[0] - 1, r + n[0].length) : -1;
}
function Sw(e, t, r) {
  var n = gt.exec(t.slice(r, r + 2));
  return n ? (e.d = +n[0], r + n[0].length) : -1;
}
function r$(e, t, r) {
  var n = gt.exec(t.slice(r, r + 3));
  return n ? (e.m = 0, e.d = +n[0], r + n[0].length) : -1;
}
function Aw(e, t, r) {
  var n = gt.exec(t.slice(r, r + 2));
  return n ? (e.H = +n[0], r + n[0].length) : -1;
}
function n$(e, t, r) {
  var n = gt.exec(t.slice(r, r + 2));
  return n ? (e.M = +n[0], r + n[0].length) : -1;
}
function i$(e, t, r) {
  var n = gt.exec(t.slice(r, r + 2));
  return n ? (e.S = +n[0], r + n[0].length) : -1;
}
function a$(e, t, r) {
  var n = gt.exec(t.slice(r, r + 3));
  return n ? (e.L = +n[0], r + n[0].length) : -1;
}
function o$(e, t, r) {
  var n = gt.exec(t.slice(r, r + 6));
  return n ? (e.L = Math.floor(n[0] / 1e3), r + n[0].length) : -1;
}
function l$(e, t, r) {
  var n = KD.exec(t.slice(r, r + 1));
  return n ? r + n[0].length : -1;
}
function u$(e, t, r) {
  var n = gt.exec(t.slice(r));
  return n ? (e.Q = +n[0], r + n[0].length) : -1;
}
function s$(e, t, r) {
  var n = gt.exec(t.slice(r));
  return n ? (e.s = +n[0], r + n[0].length) : -1;
}
function Pw(e, t) {
  return Me(e.getDate(), t, 2);
}
function c$(e, t) {
  return Me(e.getHours(), t, 2);
}
function f$(e, t) {
  return Me(e.getHours() % 12 || 12, t, 2);
}
function d$(e, t) {
  return Me(1 + Cl.count(Sn(e), e), t, 3);
}
function $A(e, t) {
  return Me(e.getMilliseconds(), t, 3);
}
function v$(e, t) {
  return $A(e, t) + "000";
}
function h$(e, t) {
  return Me(e.getMonth() + 1, t, 2);
}
function p$(e, t) {
  return Me(e.getMinutes(), t, 2);
}
function m$(e, t) {
  return Me(e.getSeconds(), t, 2);
}
function y$(e) {
  var t = e.getDay();
  return t === 0 ? 7 : t;
}
function g$(e, t) {
  return Me(Nc.count(Sn(e) - 1, e), t, 2);
}
function LA(e) {
  var t = e.getDay();
  return t >= 4 || t === 0 ? Da(e) : Da.ceil(e);
}
function x$(e, t) {
  return e = LA(e), Me(Da.count(Sn(e), e) + (Sn(e).getDay() === 4), t, 2);
}
function w$(e) {
  return e.getDay();
}
function b$(e, t) {
  return Me(Ws.count(Sn(e) - 1, e), t, 2);
}
function S$(e, t) {
  return Me(e.getFullYear() % 100, t, 2);
}
function A$(e, t) {
  return e = LA(e), Me(e.getFullYear() % 100, t, 2);
}
function P$(e, t) {
  return Me(e.getFullYear() % 1e4, t, 4);
}
function E$(e, t) {
  var r = e.getDay();
  return e = r >= 4 || r === 0 ? Da(e) : Da.ceil(e), Me(e.getFullYear() % 1e4, t, 4);
}
function O$(e) {
  var t = e.getTimezoneOffset();
  return (t > 0 ? "-" : (t *= -1, "+")) + Me(t / 60 | 0, "0", 2) + Me(t % 60, "0", 2);
}
function Ew(e, t) {
  return Me(e.getUTCDate(), t, 2);
}
function k$(e, t) {
  return Me(e.getUTCHours(), t, 2);
}
function _$(e, t) {
  return Me(e.getUTCHours() % 12 || 12, t, 2);
}
function C$(e, t) {
  return Me(1 + Tc.count(An(e), e), t, 3);
}
function RA(e, t) {
  return Me(e.getUTCMilliseconds(), t, 3);
}
function I$(e, t) {
  return RA(e, t) + "000";
}
function j$(e, t) {
  return Me(e.getUTCMonth() + 1, t, 2);
}
function T$(e, t) {
  return Me(e.getUTCMinutes(), t, 2);
}
function N$(e, t) {
  return Me(e.getUTCSeconds(), t, 2);
}
function M$(e) {
  var t = e.getUTCDay();
  return t === 0 ? 7 : t;
}
function D$(e, t) {
  return Me(Mc.count(An(e) - 1, e), t, 2);
}
function zA(e) {
  var t = e.getUTCDay();
  return t >= 4 || t === 0 ? $a(e) : $a.ceil(e);
}
function $$(e, t) {
  return e = zA(e), Me($a.count(An(e), e) + (An(e).getUTCDay() === 4), t, 2);
}
function L$(e) {
  return e.getUTCDay();
}
function R$(e, t) {
  return Me(Us.count(An(e) - 1, e), t, 2);
}
function z$(e, t) {
  return Me(e.getUTCFullYear() % 100, t, 2);
}
function B$(e, t) {
  return e = zA(e), Me(e.getUTCFullYear() % 100, t, 2);
}
function F$(e, t) {
  return Me(e.getUTCFullYear() % 1e4, t, 4);
}
function W$(e, t) {
  var r = e.getUTCDay();
  return e = r >= 4 || r === 0 ? $a(e) : $a.ceil(e), Me(e.getUTCFullYear() % 1e4, t, 4);
}
function U$() {
  return "+0000";
}
function Ow() {
  return "%";
}
function kw(e) {
  return +e;
}
function _w(e) {
  return Math.floor(+e / 1e3);
}
var xa, BA, FA;
H$({
  dateTime: "%x, %X",
  date: "%-m/%-d/%Y",
  time: "%-I:%M:%S %p",
  periods: ["AM", "PM"],
  days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
});
function H$(e) {
  return xa = HD(e), BA = xa.format, xa.parse, FA = xa.utcFormat, xa.utcParse, xa;
}
function K$(e) {
  return new Date(e);
}
function V$(e) {
  return e instanceof Date ? +e : +/* @__PURE__ */ new Date(+e);
}
function xp(e, t, r, n, o, l, s, c, f, d) {
  var h = ap(), p = h.invert, y = h.domain, x = d(".%L"), A = d(":%S"), S = d("%I:%M"), b = d("%I %p"), E = d("%a %d"), k = d("%b %d"), C = d("%B"), j = d("%Y");
  function T(O) {
    return (f(O) < O ? x : c(O) < O ? A : s(O) < O ? S : l(O) < O ? b : n(O) < O ? o(O) < O ? E : k : r(O) < O ? C : j)(O);
  }
  return h.invert = function(O) {
    return new Date(p(O));
  }, h.domain = function(O) {
    return arguments.length ? y(Array.from(O, V$)) : y().map(K$);
  }, h.ticks = function(O) {
    var _ = y();
    return e(_[0], _[_.length - 1], O ?? 10);
  }, h.tickFormat = function(O, _) {
    return _ == null ? T : d(_);
  }, h.nice = function(O) {
    var _ = y();
    return (!O || typeof O.range != "function") && (O = t(_[0], _[_.length - 1], O ?? 10)), O ? y(kA(_, O)) : h;
  }, h.copy = function() {
    return _l(h, xp(e, t, r, n, o, l, s, c, f, d));
  }, h;
}
function Y$() {
  return br.apply(xp(WD, UD, Sn, yp, Nc, Cl, pp, vp, Ci, BA).domain([new Date(2e3, 0, 1), new Date(2e3, 0, 2)]), arguments);
}
function G$() {
  return br.apply(xp(BD, FD, An, gp, Mc, Tc, mp, hp, Ci, FA).domain([Date.UTC(2e3, 0, 1), Date.UTC(2e3, 0, 2)]), arguments);
}
function Dc() {
  var e = 0, t = 1, r, n, o, l, s = Ft, c = !1, f;
  function d(p) {
    return p == null || isNaN(p = +p) ? f : s(o === 0 ? 0.5 : (p = (l(p) - r) * o, c ? Math.max(0, Math.min(1, p)) : p));
  }
  d.domain = function(p) {
    return arguments.length ? ([e, t] = p, r = l(e = +e), n = l(t = +t), o = r === n ? 0 : 1 / (n - r), d) : [e, t];
  }, d.clamp = function(p) {
    return arguments.length ? (c = !!p, d) : c;
  }, d.interpolator = function(p) {
    return arguments.length ? (s = p, d) : s;
  };
  function h(p) {
    return function(y) {
      var x, A;
      return arguments.length ? ([x, A] = y, s = p(x, A), d) : [s(0), s(1)];
    };
  }
  return d.range = h(Ha), d.rangeRound = h(ip), d.unknown = function(p) {
    return arguments.length ? (f = p, d) : f;
  }, function(p) {
    return l = p, r = p(e), n = p(t), o = r === n ? 0 : 1 / (n - r), d;
  };
}
function ai(e, t) {
  return t.domain(e.domain()).interpolator(e.interpolator()).clamp(e.clamp()).unknown(e.unknown());
}
function WA() {
  var e = ii(Dc()(Ft));
  return e.copy = function() {
    return ai(e, WA());
  }, On.apply(e, arguments);
}
function UA() {
  var e = up(Dc()).domain([1, 10]);
  return e.copy = function() {
    return ai(e, UA()).base(e.base());
  }, On.apply(e, arguments);
}
function HA() {
  var e = sp(Dc());
  return e.copy = function() {
    return ai(e, HA()).constant(e.constant());
  }, On.apply(e, arguments);
}
function wp() {
  var e = cp(Dc());
  return e.copy = function() {
    return ai(e, wp()).exponent(e.exponent());
  }, On.apply(e, arguments);
}
function X$() {
  return wp.apply(null, arguments).exponent(0.5);
}
function KA() {
  var e = [], t = Ft;
  function r(n) {
    if (n != null && !isNaN(n = +n)) return t((Ol(e, n, 1) - 1) / (e.length - 1));
  }
  return r.domain = function(n) {
    if (!arguments.length) return e.slice();
    e = [];
    for (let o of n) o != null && !isNaN(o = +o) && e.push(o);
    return e.sort(ti), r;
  }, r.interpolator = function(n) {
    return arguments.length ? (t = n, r) : t;
  }, r.range = function() {
    return e.map((n, o) => t(o / (e.length - 1)));
  }, r.quantiles = function(n) {
    return Array.from({ length: n + 1 }, (o, l) => M2(e, l / n));
  }, r.copy = function() {
    return KA(t).domain(e);
  }, On.apply(r, arguments);
}
function $c() {
  var e = 0, t = 0.5, r = 1, n = 1, o, l, s, c, f, d = Ft, h, p = !1, y;
  function x(S) {
    return isNaN(S = +S) ? y : (S = 0.5 + ((S = +h(S)) - l) * (n * S < n * l ? c : f), d(p ? Math.max(0, Math.min(1, S)) : S));
  }
  x.domain = function(S) {
    return arguments.length ? ([e, t, r] = S, o = h(e = +e), l = h(t = +t), s = h(r = +r), c = o === l ? 0 : 0.5 / (l - o), f = l === s ? 0 : 0.5 / (s - l), n = l < o ? -1 : 1, x) : [e, t, r];
  }, x.clamp = function(S) {
    return arguments.length ? (p = !!S, x) : p;
  }, x.interpolator = function(S) {
    return arguments.length ? (d = S, x) : d;
  };
  function A(S) {
    return function(b) {
      var E, k, C;
      return arguments.length ? ([E, k, C] = b, d = lD(S, [E, k, C]), x) : [d(0), d(0.5), d(1)];
    };
  }
  return x.range = A(Ha), x.rangeRound = A(ip), x.unknown = function(S) {
    return arguments.length ? (y = S, x) : y;
  }, function(S) {
    return h = S, o = S(e), l = S(t), s = S(r), c = o === l ? 0 : 0.5 / (l - o), f = l === s ? 0 : 0.5 / (s - l), n = l < o ? -1 : 1, x;
  };
}
function VA() {
  var e = ii($c()(Ft));
  return e.copy = function() {
    return ai(e, VA());
  }, On.apply(e, arguments);
}
function YA() {
  var e = up($c()).domain([0.1, 1, 10]);
  return e.copy = function() {
    return ai(e, YA()).base(e.base());
  }, On.apply(e, arguments);
}
function GA() {
  var e = sp($c());
  return e.copy = function() {
    return ai(e, GA()).constant(e.constant());
  }, On.apply(e, arguments);
}
function bp() {
  var e = cp($c());
  return e.copy = function() {
    return ai(e, bp()).exponent(e.exponent());
  }, On.apply(e, arguments);
}
function q$() {
  return bp.apply(null, arguments).exponent(0.5);
}
const XA = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  scaleBand: tp,
  scaleDiverging: VA,
  scaleDivergingLog: YA,
  scaleDivergingPow: bp,
  scaleDivergingSqrt: q$,
  scaleDivergingSymlog: GA,
  scaleIdentity: OA,
  scaleImplicit: eh,
  scaleLinear: EA,
  scaleLog: _A,
  scaleOrdinal: ep,
  scalePoint: L2,
  scalePow: fp,
  scaleQuantile: jA,
  scaleQuantize: TA,
  scaleRadial: IA,
  scaleSequential: WA,
  scaleSequentialLog: UA,
  scaleSequentialPow: wp,
  scaleSequentialQuantile: KA,
  scaleSequentialSqrt: X$,
  scaleSequentialSymlog: HA,
  scaleSqrt: ID,
  scaleSymlog: CA,
  scaleThreshold: NA,
  scaleTime: Y$,
  scaleUtc: G$,
  tickFormat: PA
}, Symbol.toStringTag, { value: "Module" }));
function Q$(e) {
  var t = XA;
  if (e in t && typeof t[e] == "function")
    return t[e]();
  var r = "scale".concat(bh(e));
  if (r in t && typeof t[r] == "function")
    return t[r]();
}
function Cw(e, t, r) {
  if (typeof e == "function")
    return e.copy().domain(t).range(r);
  if (e != null) {
    var n = Q$(e);
    if (n != null)
      return n.domain(t).range(r), n;
  }
}
function Sp(e, t, r, n) {
  if (!(r == null || n == null))
    return typeof e.scale == "function" ? Cw(e.scale, r, n) : Cw(t, r, n);
}
function Z$(e) {
  return "scale".concat(bh(e));
}
function J$(e) {
  return Z$(e) in XA;
}
var qA = (e, t, r) => {
  if (e != null) {
    var n = e.scale, o = e.type;
    if (n === "auto")
      return o === "category" && r && (r.indexOf("LineChart") >= 0 || r.indexOf("AreaChart") >= 0 || r.indexOf("ComposedChart") >= 0 && !t) ? "point" : o === "category" ? "band" : "linear";
    if (typeof n == "string")
      return J$(n) ? n : "point";
  }
};
function eL(e, t) {
  for (var r = 0, n = e.length, o = e[0] < e[e.length - 1]; r < n; ) {
    var l = Math.floor((r + n) / 2);
    (o ? e[l] < t : e[l] > t) ? r = l + 1 : n = l;
  }
  return r;
}
function QA(e, t) {
  if (e) {
    var r = t ?? e.domain(), n = r.map((l) => {
      var s;
      return (s = e(l)) !== null && s !== void 0 ? s : 0;
    }), o = e.range();
    if (!(r.length === 0 || o.length < 2))
      return (l) => {
        var s, c, f = eL(n, l);
        if (f <= 0)
          return r[0];
        if (f >= r.length)
          return r[r.length - 1];
        var d = (s = n[f - 1]) !== null && s !== void 0 ? s : 0, h = (c = n[f]) !== null && c !== void 0 ? c : 0;
        return Math.abs(l - d) <= Math.abs(l - h) ? r[f - 1] : r[f];
      };
  }
}
function tL(e) {
  if (e != null)
    return "invert" in e && typeof e.invert == "function" ? e.invert.bind(e) : QA(e, void 0);
}
function Iw(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Hs(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Iw(Object(r), !0).forEach(function(n) {
      rL(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Iw(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function rL(e, t, r) {
  return (t = nL(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function nL(e) {
  var t = iL(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function iL(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function ZA(e, t) {
  return uL(e) || lL(e, t) || oL(e, t) || aL();
}
function aL() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function oL(e, t) {
  if (e) {
    if (typeof e == "string") return jw(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? jw(e, t) : void 0;
  }
}
function jw(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function lL(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, o, l, s, c = [], f = !0, d = !1;
    try {
      if (l = (r = r.call(e)).next, t !== 0) for (; !(f = (n = l.call(r)).done) && (c.push(n.value), c.length !== t); f = !0) ;
    } catch (h) {
      d = !0, o = h;
    } finally {
      try {
        if (!f && r.return != null && (s = r.return(), Object(s) !== s)) return;
      } finally {
        if (d) throw o;
      }
    }
    return c;
  }
}
function uL(e) {
  if (Array.isArray(e)) return e;
}
var ih = [0, "auto"], lt = {
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
}, JA = (e, t) => e.cartesianAxis.xAxis[t], kn = (e, t) => {
  var r = JA(e, t);
  return r ?? lt;
}, ut = {
  allowDataOverflow: !1,
  allowDecimals: !0,
  allowDuplicatedCategory: !0,
  angle: 0,
  dataKey: void 0,
  domain: ih,
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
  width: xl
}, eP = (e, t) => e.cartesianAxis.yAxis[t], _n = (e, t) => {
  var r = eP(e, t);
  return r ?? ut;
}, sL = {
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
}, Ap = (e, t) => {
  var r = e.cartesianAxis.zAxis[t];
  return r ?? sL;
}, Lt = (e, t, r) => {
  switch (t) {
    case "xAxis":
      return kn(e, r);
    case "yAxis":
      return _n(e, r);
    case "zAxis":
      return Ap(e, r);
    case "angleAxis":
      return Yh(e, r);
    case "radiusAxis":
      return Gh(e, r);
    default:
      throw new Error("Unexpected axis type: ".concat(t));
  }
}, cL = (e, t, r) => {
  switch (t) {
    case "xAxis":
      return kn(e, r);
    case "yAxis":
      return _n(e, r);
    default:
      throw new Error("Unexpected axis type: ".concat(t));
  }
}, Il = (e, t, r) => {
  switch (t) {
    case "xAxis":
      return kn(e, r);
    case "yAxis":
      return _n(e, r);
    case "angleAxis":
      return Yh(e, r);
    case "radiusAxis":
      return Gh(e, r);
    default:
      throw new Error("Unexpected axis type: ".concat(t));
  }
}, tP = (e) => e.graphicalItems.cartesianItems.some((t) => t.type === "bar") || e.graphicalItems.polarItems.some((t) => t.type === "radialBar");
function rP(e, t) {
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
var Pp = (e) => e.graphicalItems.cartesianItems, fL = z([mt, Cc], rP), nP = (e, t, r) => e.filter(r).filter((n) => (t == null ? void 0 : t.includeHidden) === !0 ? !0 : !n.hide), Ka = z([Pp, Lt, fL], nP, {
  memoizeOptions: {
    resultEqualityCheck: Ic
  }
}), iP = z([Ka], (e) => e.filter((t) => t.type === "area" || t.type === "bar").filter(Qh)), aP = (e) => e.filter((t) => !("stackId" in t) || t.stackId === void 0), dL = z([Ka], aP), oP = (e) => e.map((t) => t.data).filter(Boolean).flat(1), vL = z([Ka], (e) => e.some((t) => !t.data)), lP = z([Ka], oP, {
  memoizeOptions: {
    resultEqualityCheck: Ic
  }
}), uP = (e, t) => {
  var r = t.chartData, n = r === void 0 ? [] : r, o = t.dataStartIndex, l = t.dataEndIndex;
  return e.length > 0 ? e : n.slice(o, l + 1);
}, Ep = z([lP, Pl], uP), hL = (e, t, r) => (t == null ? void 0 : t.dataKey) != null ? e.map((n) => ({
  value: tt(n, t.dataKey)
})) : r.length > 0 ? r.map((n) => n.dataKey).flatMap((n) => e.map((o) => ({
  value: tt(o, n)
}))) : e.map((n) => ({
  value: n
})), sP = (e, t, r, n, o, l) => {
  var s = n.chartData, c = s === void 0 ? [] : s, f = n.dataStartIndex, d = n.dataEndIndex, h = hL(e, t, r);
  if (o && (t == null ? void 0 : t.dataKey) != null && l.length > 0) {
    var p = c.slice(f, d + 1), y = p.map((x) => ({
      value: tt(x, t.dataKey)
    })).filter((x) => x.value != null);
    return [...y, ...h];
  }
  return h;
}, jl = z([Ep, Lt, Ka, Pl, vL, lP], sP);
function Ca(e) {
  if (Jr(e) || e instanceof Date) {
    var t = Number(e);
    if (ke(t))
      return t;
  }
}
function Tw(e) {
  if (Array.isArray(e)) {
    var t = [Ca(e[0]), Ca(e[1])];
    return qr(t) ? t : void 0;
  }
  var r = Ca(e);
  if (r != null)
    return [r, r];
}
function Dr(e) {
  return e.map(Ca).filter(Bt);
}
function pL(e, t) {
  var r = Ca(e), n = Ca(t);
  return r == null && n == null ? 0 : r == null ? -1 : n == null ? 1 : r - n;
}
var mL = z([jl], (e) => e == null ? void 0 : e.map((t) => t.value).sort(pL));
function cP(e, t) {
  switch (e) {
    case "xAxis":
      return t.direction === "x";
    case "yAxis":
      return t.direction === "y";
    default:
      return !1;
  }
}
function yL(e, t, r) {
  if (!r)
    return [];
  if (!r.length)
    return [];
  var n;
  if (typeof t == "number" && !Zr(t))
    n = t;
  else if (Array.isArray(t)) {
    var o = Dr(t);
    o.length > 0 && (n = Math.max(...o));
  }
  return n == null ? [] : Dr(r.flatMap((l) => {
    var s = tt(e, l.dataKey), c, f;
    if (Array.isArray(s)) {
      var d = ZA(s, 2);
      c = d[0], f = d[1];
    } else
      c = f = s;
    if (!(!ke(c) || !ke(f)))
      return [n - c, n + f];
  }));
}
var ft = (e) => {
  var t = yt(e), r = Ua(e);
  return Il(e, t, r);
}, La = z([ft], (e) => e == null ? void 0 : e.dataKey), gL = z([iP, Pl, ft], pA), fP = (e, t, r, n) => {
  var o = {}, l = t.reduce((s, c) => {
    if (c.stackId == null)
      return s;
    var f = s[c.stackId];
    return f == null && (f = []), f.push(c), s[c.stackId] = f, s;
  }, o);
  return Object.fromEntries(Object.entries(l).map((s) => {
    var c = ZA(s, 2), f = c[0], d = c[1], h = n ? [...d].reverse() : d, p = h.map(qh);
    return [f, {
      // @ts-expect-error getStackedData requires that the input is array of objects, Recharts does not test for that
      stackedData: Yj(e, p, r),
      graphicalItems: h
    }];
  }));
}, dP = z([gL, iP, Ec, uA], fP), vP = (e, t, r, n) => {
  var o = t.dataStartIndex, l = t.dataEndIndex;
  if (n == null && r !== "zAxis")
    return Qj(e, o, l);
}, xL = z([Lt], (e) => e.allowDataOverflow), Op = (e) => {
  var t;
  if (e == null || !("domain" in e))
    return ih;
  if (e.domain != null)
    return e.domain;
  if ("ticks" in e && e.ticks != null) {
    if (e.type === "number") {
      var r = Dr(e.ticks);
      return [Math.min(...r), Math.max(...r)];
    }
    if (e.type === "category")
      return e.ticks.map(String);
  }
  return (t = e == null ? void 0 : e.domain) !== null && t !== void 0 ? t : ih;
}, hP = z([Lt], Op), pP = z([hP, xL], QS), wL = z([dP, Lr, mt, pP], vP, {
  memoizeOptions: {
    resultEqualityCheck: El
  }
}), kp = (e) => e.errorBars, bL = (e, t, r) => e.flatMap((n) => t[n.id]).filter(Boolean).filter((n) => cP(r, n)), Ks = function() {
  for (var t = arguments.length, r = new Array(t), n = 0; n < t; n++)
    r[n] = arguments[n];
  var o = r.filter(Boolean);
  if (o.length !== 0) {
    var l = o.flat(), s = Math.min(...l), c = Math.max(...l);
    return [s, c];
  }
}, mP = function(t, r, n, o, l) {
  var s = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : [], c, f;
  if (n.length > 0 && n.forEach((d) => {
    var h, p = d.data != null ? [...d.data] : s, y = (h = o[d.id]) === null || h === void 0 ? void 0 : h.filter((x) => cP(l, x));
    p.forEach((x) => {
      var A, S = tt(x, (A = r.dataKey) !== null && A !== void 0 ? A : d.dataKey), b = yL(x, S, y);
      if (b.length >= 2) {
        var E = Math.min(...b), k = Math.max(...b);
        (c == null || E < c) && (c = E), (f == null || k > f) && (f = k);
      }
      var C = Tw(S);
      C != null && (c = c == null ? C[0] : Math.min(c, C[0]), f = f == null ? C[1] : Math.max(f, C[1]));
    });
  }), (r == null ? void 0 : r.dataKey) != null && n.length === 0 && t.forEach((d) => {
    var h = Tw(tt(d, r.dataKey));
    h != null && (c = c == null ? h[0] : Math.min(c, h[0]), f = f == null ? h[1] : Math.max(f, h[1]));
  }), ke(c) && ke(f))
    return [c, f];
}, SL = z([Ep, Lt, dL, kp, mt, ZM], mP, {
  memoizeOptions: {
    resultEqualityCheck: El
  }
});
function AL(e) {
  var t = e.value;
  if (Jr(t) || t instanceof Date)
    return t;
}
var PL = (e, t, r) => {
  var n = e.map(AL).filter((o) => o != null);
  return r && (t.dataKey == null || t.allowDuplicatedCategory && ub(n)) ? qS(0, e.length) : t.allowDuplicatedCategory ? n : Array.from(new Set(n));
}, yP = (e) => e.referenceElements.dots, Va = (e, t, r) => e.filter((n) => n.ifOverflow === "extendDomain").filter((n) => t === "xAxis" ? n.xAxisId === r : n.yAxisId === r), EL = z([yP, mt, Cc], Va), gP = (e) => e.referenceElements.areas, OL = z([gP, mt, Cc], Va), xP = (e) => e.referenceElements.lines, kL = z([xP, mt, Cc], Va), wP = (e, t) => {
  if (e != null) {
    var r = Dr(e.map((n) => t === "xAxis" ? n.x : n.y));
    if (r.length !== 0)
      return [Math.min(...r), Math.max(...r)];
  }
}, _L = z(EL, mt, wP), bP = (e, t) => {
  if (e != null) {
    var r = Dr(e.flatMap((n) => [t === "xAxis" ? n.x1 : n.y1, t === "xAxis" ? n.x2 : n.y2]));
    if (r.length !== 0)
      return [Math.min(...r), Math.max(...r)];
  }
}, CL = z([OL, mt], bP);
function IL(e) {
  var t;
  if (e.x != null)
    return Dr([e.x]);
  var r = (t = e.segment) === null || t === void 0 ? void 0 : t.map((n) => n.x);
  return r == null || r.length === 0 ? [] : Dr(r);
}
function jL(e) {
  var t;
  if (e.y != null)
    return Dr([e.y]);
  var r = (t = e.segment) === null || t === void 0 ? void 0 : t.map((n) => n.y);
  return r == null || r.length === 0 ? [] : Dr(r);
}
var SP = (e, t) => {
  if (e != null) {
    var r = e.flatMap((n) => t === "xAxis" ? IL(n) : jL(n));
    if (r.length !== 0)
      return [Math.min(...r), Math.max(...r)];
  }
}, TL = z([kL, mt], SP), NL = z(_L, TL, CL, (e, t, r) => Ks(e, r, t)), AP = (e, t, r, n, o, l, s, c, f) => {
  if (r != null)
    return r;
  var d = s === "vertical" && c === "xAxis" || s === "horizontal" && c === "yAxis", h = d ? Ks(n, l, o) : Ks(l, o), p = i2(t, h, e.allowDataOverflow);
  return p ?? (e.allowDataOverflow && h == null && f != null ? f : p);
}, ML = (e) => {
  if (!(e == null || e.type !== "number" || !("ticks" in e) || e.ticks == null)) {
    var t = Dr(e.ticks);
    if (t.length !== 0)
      return [Math.min(...t), Math.max(...t)];
  }
}, DL = z([Lt], ML, {
  memoizeOptions: {
    resultEqualityCheck: El
  }
}), $L = z([Lt, hP, pP, wL, SL, NL, Be, mt, DL], AP, {
  memoizeOptions: {
    resultEqualityCheck: El
  }
}), LL = [0, 1], PP = (e, t, r, n, o, l, s) => {
  if (!((e == null || r == null || r.length === 0) && s === void 0)) {
    var c = e.dataKey, f = e.type, d = $r(t, l);
    if (d && c == null) {
      var h;
      return qS(0, (h = r == null ? void 0 : r.length) !== null && h !== void 0 ? h : 0);
    }
    return f === "category" ? PL(n, e, d) : o === "expand" && !d ? LL : s;
  }
}, _p = z([Lt, Be, Ep, jl, Ec, mt, $L], PP), Ya = z([Lt, tP, Hh], qA), EP = (e, t, r) => {
  var n = t.niceTicks;
  if (n !== "none") {
    var o = Op(t), l = Array.isArray(o) && (o[0] === "auto" || o[1] === "auto");
    if ((n === "snap125" || n === "adaptive") && t != null && t.tickCount && qr(e)) {
      if (l)
        return Fx(e, t.tickCount, t.allowDecimals, n);
      if (t.type === "number")
        return Wx(e, t.tickCount, t.allowDecimals, n);
    }
    if (n === "auto" && r === "linear" && t != null && t.tickCount) {
      if (l && qr(e))
        return Fx(e, t.tickCount, t.allowDecimals, "adaptive");
      if (t.type === "number" && qr(e))
        return Wx(e, t.tickCount, t.allowDecimals, "adaptive");
    }
  }
}, Cp = z([_p, Il, Ya], EP), OP = (e, t, r, n) => {
  if (
    /*
     * Angle axis for some reason uses nice ticks when rendering axis tick labels,
     * but doesn't use nice ticks for extending domain like all the other axes do.
     * Not really sure why? Is there a good reason,
     * or is it just because someone added support for nice ticks to the other axes and forgot this one?
     */
    n !== "angleAxis" && (e == null ? void 0 : e.type) === "number" && qr(t) && Array.isArray(r) && r.length > 0
  ) {
    var o, l, s = t[0], c = (o = r[0]) !== null && o !== void 0 ? o : 0, f = t[1], d = (l = r[r.length - 1]) !== null && l !== void 0 ? l : 0;
    return [Math.min(s, c), Math.max(f, d)];
  }
  return t;
}, RL = z([Lt, _p, Cp, mt], OP), zL = z(jl, Lt, (e, t) => {
  if (!(!t || t.type !== "number")) {
    var r = 1 / 0, n = Array.from(Dr(e.map((p) => p.value))).sort((p, y) => p - y), o = n[0], l = n[n.length - 1];
    if (o == null || l == null)
      return 1 / 0;
    var s = l - o;
    if (s === 0)
      return 1 / 0;
    for (var c = 0; c < n.length - 1; c++) {
      var f = n[c], d = n[c + 1];
      if (!(f == null || d == null)) {
        var h = d - f;
        r = Math.min(r, h);
      }
    }
    return r / s;
  }
}), kP = z(zL, Be, v2, Et, (e, t, r, n, o) => o, (e, t, r, n, o) => {
  if (!ke(e))
    return 0;
  var l = t === "vertical" ? n.height : n.width;
  if (o === "gap")
    return e * l / 2;
  if (o === "no-gap") {
    var s = ni(r, e * l), c = e * l / 2;
    return c - s - (c - s) / l * s;
  }
  return 0;
}), BL = (e, t, r) => {
  var n = kn(e, t);
  return n == null || typeof n.padding != "string" ? 0 : kP(e, "xAxis", t, r, n.padding);
}, FL = (e, t, r) => {
  var n = _n(e, t);
  return n == null || typeof n.padding != "string" ? 0 : kP(e, "yAxis", t, r, n.padding);
}, WL = z(kn, BL, (e, t) => {
  var r, n;
  if (e == null)
    return {
      left: 0,
      right: 0
    };
  var o = e.padding;
  return typeof o == "string" ? {
    left: t,
    right: t
  } : {
    left: ((r = o.left) !== null && r !== void 0 ? r : 0) + t,
    right: ((n = o.right) !== null && n !== void 0 ? n : 0) + t
  };
}), UL = z(_n, FL, (e, t) => {
  var r, n;
  if (e == null)
    return {
      top: 0,
      bottom: 0
    };
  var o = e.padding;
  return typeof o == "string" ? {
    top: t,
    bottom: t
  } : {
    top: ((r = o.top) !== null && r !== void 0 ? r : 0) + t,
    bottom: ((n = o.bottom) !== null && n !== void 0 ? n : 0) + t
  };
}), _P = z([Et, WL, Ac, Sc, (e, t, r) => r], (e, t, r, n, o) => {
  var l = n.padding;
  return o ? [l.left, r.width - l.right] : [e.left + t.left, e.left + e.width - t.right];
}), CP = z([Et, Be, UL, Ac, Sc, (e, t, r) => r], (e, t, r, n, o, l) => {
  var s = o.padding;
  return l ? [n.height - s.bottom, s.top] : t === "horizontal" ? [e.top + e.height - r.bottom, e.top + r.top] : [e.top + r.top, e.top + e.height - r.bottom];
}), Tl = (e, t, r, n) => {
  var o;
  switch (t) {
    case "xAxis":
      return _P(e, r, n);
    case "yAxis":
      return CP(e, r, n);
    case "zAxis":
      return (o = Ap(e, r)) === null || o === void 0 ? void 0 : o.range;
    case "angleAxis":
      return dA(e);
    case "radiusAxis":
      return vA(e, r);
    default:
      return;
  }
}, IP = z([Lt, Tl], Oc), HL = z([Ya, RL], S2), Ip = z([Lt, Ya, HL, IP], Sp), jP = (e, t, r, n) => {
  if (!(r == null || r.dataKey == null)) {
    var o = r.type, l = r.scale, s = $r(e, n);
    if (s && (o === "number" || l !== "auto"))
      return t.map((c) => c.value);
  }
}, jp = z([Be, jl, Il, mt], jP), Lc = z([Ip], Zh);
z([Ip], tL);
z([Ip, mL], QA);
z([Ka, kp, mt], bL);
function TP(e, t) {
  return e.id < t.id ? -1 : e.id > t.id ? 1 : 0;
}
var Rc = (e, t) => t, zc = (e, t, r) => r, KL = z(wc, Rc, zc, (e, t, r) => e.filter((n) => n.orientation === t).filter((n) => n.mirror === r).sort(TP)), VL = z(bc, Rc, zc, (e, t, r) => e.filter((n) => n.orientation === t).filter((n) => n.mirror === r).sort(TP)), NP = (e, t) => {
  var r = typeof t.height == "number" ? t.height : $h;
  return {
    width: e.width,
    height: r
  };
}, YL = (e, t) => {
  var r = typeof t.width == "number" ? t.width : xl;
  return {
    width: r,
    height: e.height
  };
}, GL = z(Et, kn, NP), XL = (e, t, r) => {
  switch (t) {
    case "top":
      return e.top;
    case "bottom":
      return r - e.bottom;
    default:
      return 0;
  }
}, qL = (e, t, r) => {
  switch (t) {
    case "left":
      return e.left;
    case "right":
      return r - e.right;
    default:
      return 0;
  }
}, QL = z(En, Et, KL, Rc, zc, (e, t, r, n, o) => {
  var l = {}, s;
  return r.forEach((c) => {
    var f = NP(t, c);
    s == null && (s = XL(t, n, e));
    var d = n === "top" && !o || n === "bottom" && o;
    l[c.id] = s - Number(d) * f.height, s += (d ? -1 : 1) * f.height;
  }), l;
}), ZL = z(Pn, Et, VL, Rc, zc, (e, t, r, n, o) => {
  var l = {}, s;
  return r.forEach((c) => {
    var f = YL(t, c);
    s == null && (s = qL(t, n, e));
    var d = n === "left" && !o || n === "right" && o;
    l[c.id] = s - Number(d) * f.width, s += (d ? -1 : 1) * f.width;
  }), l;
}), JL = (e, t) => {
  var r = kn(e, t);
  if (r != null)
    return QL(e, r.orientation, r.mirror);
}, eR = z([Et, kn, JL, (e, t) => t], (e, t, r, n) => {
  if (t != null) {
    var o = r == null ? void 0 : r[n];
    return o == null ? {
      x: e.left,
      y: 0
    } : {
      x: e.left,
      y: o
    };
  }
}), tR = (e, t) => {
  var r = _n(e, t);
  if (r != null)
    return ZL(e, r.orientation, r.mirror);
}, rR = z([Et, _n, tR, (e, t) => t], (e, t, r, n) => {
  if (t != null) {
    var o = r == null ? void 0 : r[n];
    return o == null ? {
      x: 0,
      y: e.top
    } : {
      x: o,
      y: e.top
    };
  }
}), nR = z(Et, _n, (e, t) => {
  var r = typeof t.width == "number" ? t.width : xl;
  return {
    width: r,
    height: e.height
  };
}), MP = (e, t, r, n) => {
  if (r != null) {
    var o = r.allowDuplicatedCategory, l = r.type, s = r.dataKey, c = $r(e, n), f = t.map((h) => h.value), d = f.filter((h) => h != null);
    if (s && c && l === "category" && o && ub(d))
      return f;
  }
}, Tp = z([Be, jl, Lt, mt], MP), Nw = z([Be, cL, Ya, Lc, Tp, jp, Tl, Cp, mt], (e, t, r, n, o, l, s, c, f) => {
  if (t != null) {
    var d = $r(e, f);
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
      duplicateDomain: o,
      isCategorical: d,
      niceTicks: c,
      range: s,
      realScaleType: r,
      scale: n
    };
  }
}), iR = (e, t, r, n, o, l, s, c, f) => {
  if (!(t == null || n == null)) {
    var d = $r(e, f), h = t.type, p = t.ticks, y = t.tickCount, x = (
      // @ts-expect-error This is testing for `scaleBand` but for band axis the type is reported as `band` so this looks like a dead code with a workaround elsewhere?
      r === "scaleBand" && typeof n.bandwidth == "function" ? n.bandwidth() / 2 : 2
    ), A = h === "category" && n.bandwidth ? n.bandwidth() / x : 0;
    A = f === "angleAxis" && l != null && l.length >= 2 ? pr(l[0] - l[1]) * 2 * A : A;
    var S = p || o;
    return S ? S.map((b, E) => {
      var k = s ? s.indexOf(b) : b, C = n.map(k);
      return ke(C) ? {
        index: E,
        coordinate: C + A,
        value: b,
        offset: A
      } : null;
    }).filter(Bt) : d && c ? c.map((b, E) => {
      var k = n.map(b);
      return ke(k) ? {
        coordinate: k + A,
        value: b,
        index: E,
        offset: A
      } : null;
    }).filter(Bt) : n.ticks ? n.ticks(y).map((b, E) => {
      var k = n.map(b);
      return ke(k) ? {
        coordinate: k + A,
        value: b,
        index: E,
        offset: A
      } : null;
    }).filter(Bt) : n.domain().map((b, E) => {
      var k = n.map(b);
      return ke(k) ? {
        coordinate: k + A,
        // @ts-expect-error can't use Date as index
        value: s ? s[b] : b,
        index: E,
        offset: A
      } : null;
    }).filter(Bt);
  }
}, DP = z([Be, Il, Ya, Lc, Cp, Tl, Tp, jp, mt], iR), aR = (e, t, r, n, o, l, s) => {
  if (!(t == null || r == null || n == null || n[0] === n[1])) {
    var c = $r(e, s), f = t.tickCount, d = 0;
    return d = s === "angleAxis" && (n == null ? void 0 : n.length) >= 2 ? pr(n[0] - n[1]) * 2 * d : d, c && l ? l.map((h, p) => {
      var y = r.map(h);
      return ke(y) ? {
        coordinate: y + d,
        value: h,
        index: p,
        offset: d
      } : null;
    }).filter(Bt) : r.ticks ? r.ticks(f).map((h, p) => {
      var y = r.map(h);
      return ke(y) ? {
        coordinate: y + d,
        value: h,
        index: p,
        offset: d
      } : null;
    }).filter(Bt) : r.domain().map((h, p) => {
      var y = r.map(h);
      return ke(y) ? {
        coordinate: y + d,
        // @ts-expect-error can't use unknown as index
        value: o ? o[h] : h,
        index: p,
        offset: d
      } : null;
    }).filter(Bt);
  }
}, Bc = z([Be, Il, Lc, Tl, Tp, jp, mt], aR), Fc = z(Lt, Lc, (e, t) => {
  if (!(e == null || t == null))
    return Hs(Hs({}, e), {}, {
      scale: t
    });
}), oR = z([Lt, Ya, _p, IP], Sp), lR = z([oR], Zh);
z((e, t, r) => Ap(e, r), lR, (e, t) => {
  if (!(e == null || t == null))
    return Hs(Hs({}, e), {}, {
      scale: t
    });
});
var uR = z([Be, wc, bc], (e, t, r) => {
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
}), sR = (e, t, r) => {
  var n;
  return (n = e.renderedTicks[t]) === null || n === void 0 ? void 0 : n[r];
};
z([sR], (e) => {
  if (!(!e || e.length === 0))
    return (t) => {
      var r, n = 1 / 0, o = e[0];
      for (var l of e) {
        var s = Math.abs(l.coordinate - t);
        s < n && (n = s, o = l);
      }
      return (r = o) === null || r === void 0 ? void 0 : r.value;
    };
});
var $P = (e) => e.options.defaultTooltipEventType, LP = (e) => e.options.validateTooltipEventTypes;
function RP(e, t, r) {
  if (e == null)
    return t;
  var n = e ? "axis" : "item";
  return r == null ? t : r.includes(n) ? n : t;
}
function Nl(e, t) {
  var r = $P(e), n = LP(e);
  return RP(t, r, n);
}
function cR(e) {
  return he((t) => Nl(t, e));
}
var zP = (e, t) => {
  var r, n = Number(t);
  if (!(Zr(n) || t == null))
    return n >= 0 ? e == null || (r = e[n]) === null || r === void 0 ? void 0 : r.value : void 0;
}, fR = (e) => e.tooltip.settings, Zn = {
  active: !1,
  index: null,
  dataKey: void 0,
  graphicalItemId: void 0,
  coordinate: void 0
}, dR = {
  itemInteraction: {
    click: Zn,
    hover: Zn
  },
  axisInteraction: {
    click: Zn,
    hover: Zn
  },
  keyboardInteraction: Zn,
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
}, BP = Dt({
  name: "tooltip",
  initialState: dR,
  reducers: {
    addTooltipEntrySettings: {
      reducer(e, t) {
        e.tooltipItemPayloads.push(Ne(t.payload));
      },
      prepare: Ue()
    },
    replaceTooltipEntrySettings: {
      reducer(e, t) {
        var r = t.payload, n = r.prev, o = r.next, l = mr(e).tooltipItemPayloads.indexOf(Ne(n));
        l > -1 && (e.tooltipItemPayloads[l] = Ne(o));
      },
      prepare: Ue()
    },
    removeTooltipEntrySettings: {
      reducer(e, t) {
        var r = mr(e).tooltipItemPayloads.indexOf(Ne(t.payload));
        r > -1 && e.tooltipItemPayloads.splice(r, 1);
      },
      prepare: Ue()
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
}), Sr = BP.actions, vR = Sr.addTooltipEntrySettings, hR = Sr.replaceTooltipEntrySettings, pR = Sr.removeTooltipEntrySettings, mR = Sr.setTooltipSettingsState, yR = Sr.setActiveMouseOverItemIndex;
Sr.mouseLeaveItem;
var FP = Sr.mouseLeaveChart;
Sr.setActiveClickItemIndex;
var WP = Sr.setMouseOverAxisIndex, gR = Sr.setMouseClickAxisIndex, qo = Sr.setSyncInteraction, Vs = Sr.setKeyboardInteraction, xR = BP.reducer;
function Mw(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function rs(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Mw(Object(r), !0).forEach(function(n) {
      wR(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Mw(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function wR(e, t, r) {
  return (t = bR(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function bR(e) {
  var t = SR(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function SR(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function AR(e, t, r) {
  return t === "axis" ? r === "click" ? e.axisInteraction.click : e.axisInteraction.hover : r === "click" ? e.itemInteraction.click : e.itemInteraction.hover;
}
function PR(e) {
  return e.index != null;
}
var UP = (e, t, r, n) => {
  if (t == null)
    return Zn;
  var o = AR(e, t, r);
  if (o == null)
    return Zn;
  if (o.active)
    return o;
  if (e.keyboardInteraction.active)
    return e.keyboardInteraction;
  if (e.syncInteraction.active && e.syncInteraction.index != null)
    return e.syncInteraction;
  var l = e.settings.active === !0;
  if (PR(o)) {
    if (l)
      return rs(rs({}, o), {}, {
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
  return rs(rs({}, Zn), {}, {
    coordinate: o.coordinate
  });
};
function ER(e) {
  if (typeof e == "number")
    return Number.isFinite(e) ? e : void 0;
  if (e instanceof Date) {
    var t = e.valueOf();
    return Number.isFinite(t) ? t : void 0;
  }
  var r = Number(e);
  return Number.isFinite(r) ? r : void 0;
}
function OR(e, t) {
  var r = ER(e), n = t[0], o = t[1];
  if (r === void 0)
    return !1;
  var l = Math.min(n, o), s = Math.max(n, o);
  return r >= l && r <= s;
}
function kR(e, t, r) {
  if (r == null || t == null)
    return !0;
  var n = tt(e, t);
  return n == null || !qr(r) ? !0 : OR(n, r);
}
var el = (e, t, r, n) => {
  var o = e == null ? void 0 : e.index;
  if (o == null)
    return null;
  var l = Number(o);
  if (!ke(l))
    return o;
  var s = 0, c = 1 / 0;
  t.length > 0 && (c = t.length - 1);
  var f = Math.max(s, Math.min(l, c)), d = t[f];
  return d == null || kR(d, r, n) ? String(f) : null;
}, HP = (e, t, r, n, o, l, s) => {
  if (l != null) {
    var c = s[0], f = c == null ? void 0 : c.getPosition(l);
    if (f != null)
      return f;
    var d = o == null ? void 0 : o[Number(l)];
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
}, KP = (e, t, r, n) => {
  if (t === "axis")
    return e.tooltipItemPayloads;
  if (e.tooltipItemPayloads.length === 0)
    return [];
  var o;
  if (r === "hover" ? o = e.itemInteraction.hover.graphicalItemId : o = e.itemInteraction.click.graphicalItemId, e.syncInteraction.active && o == null)
    return e.tooltipItemPayloads;
  if (o == null && (n != null || e.keyboardInteraction.active)) {
    var l = e.tooltipItemPayloads[0];
    return l != null ? [l] : [];
  }
  return e.tooltipItemPayloads.filter((s) => {
    var c;
    return ((c = s.settings) === null || c === void 0 ? void 0 : c.graphicalItemId) === o;
  });
}, VP = (e) => e.options.tooltipPayloadSearcher, Ga = (e) => e.tooltip;
function Dw(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function $w(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Dw(Object(r), !0).forEach(function(n) {
      _R(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Dw(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function _R(e, t, r) {
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
function jR(e) {
  if (typeof e == "string" || typeof e == "number")
    return e;
}
function TR(e) {
  if (typeof e == "string" || typeof e == "number" || typeof e == "boolean")
    return e;
}
function NR(e) {
  if (typeof e == "string" || typeof e == "number")
    return e;
  if (typeof e == "function")
    return (t) => e(t);
}
function Lw(e) {
  if (typeof e == "string")
    return e;
}
function MR(e) {
  if (!(e == null || typeof e != "object")) {
    var t = "name" in e ? jR(e.name) : void 0, r = "unit" in e ? TR(e.unit) : void 0, n = "dataKey" in e ? NR(e.dataKey) : void 0, o = "payload" in e ? e.payload : void 0, l = "color" in e ? Lw(e.color) : void 0, s = "fill" in e ? Lw(e.fill) : void 0;
    return {
      name: t,
      unit: r,
      dataKey: n,
      payload: o,
      color: l,
      fill: s
    };
  }
}
function DR(e, t) {
  return e ?? t;
}
var YP = (e, t, r, n, o, l, s) => {
  if (!(t == null || l == null)) {
    var c = r.chartData, f = r.computedData, d = r.dataStartIndex, h = r.dataEndIndex, p = [];
    return e.reduce((y, x) => {
      var A, S = x.dataDefinedOnItem, b = x.settings, E = DR(S, c), k = Array.isArray(E) ? _S(E, d, h) : E, C = (A = b == null ? void 0 : b.dataKey) !== null && A !== void 0 ? A : n, j = b == null ? void 0 : b.nameKey, T;
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
      s === "axis" ? (T = sb(k, n, o), T == null && (T = l(k, t, f, j))) : T = l(k, t, f, j), Array.isArray(T))
        T.forEach((_) => {
          var F, K, V = MR(_), q = V == null ? void 0 : V.name, W = V == null ? void 0 : V.dataKey, ie = V == null ? void 0 : V.payload, re = $w($w({}, b), {}, {
            name: q,
            unit: V == null ? void 0 : V.unit,
            // Preserve item-level color/fill from graphical items.
            color: (F = V == null ? void 0 : V.color) !== null && F !== void 0 ? F : b == null ? void 0 : b.color,
            fill: (K = V == null ? void 0 : V.fill) !== null && K !== void 0 ? K : b == null ? void 0 : b.fill
          });
          y.push(L0({
            tooltipEntrySettings: re,
            dataKey: W,
            payload: ie,
            value: tt(ie, W),
            name: q == null ? void 0 : String(q)
          }));
        });
      else {
        var O;
        y.push(L0({
          tooltipEntrySettings: b,
          dataKey: C,
          payload: T,
          // getValueByDataKey does not validate the output type
          value: tt(T, C),
          // getValueByDataKey does not validate the output type
          name: (O = tt(T, j)) !== null && O !== void 0 ? O : b == null ? void 0 : b.name
        }));
      }
      return y;
    }, p);
  }
}, Np = z([ft, tP, Hh], qA), $R = z([(e) => e.graphicalItems.cartesianItems, (e) => e.graphicalItems.polarItems], (e, t) => [...e, ...t]), LR = z([yt, Ua], rP), Ki = z([$R, ft, LR], nP, {
  memoizeOptions: {
    resultEqualityCheck: Ic
  }
}), RR = z([Ki], (e) => e.filter(Qh)), GP = z([Ki], oP, {
  memoizeOptions: {
    resultEqualityCheck: Ic
  }
}), zR = z([Ki], (e) => e.some((t) => !t.data)), Ri = z([GP, Lr], uP), BR = z([RR, Lr, ft], pA), Mp = z([Ri, ft, Ki, Lr, zR, GP], sP), XP = z([ft], Op), FR = z([ft], (e) => e.allowDataOverflow), qP = z([XP, FR], QS), WR = z([Ki], (e) => e.filter(Qh)), UR = z([BR, WR, Ec, uA], fP), HR = z([UR, Lr, yt, qP], vP), KR = z([Ki], aP), VR = z([Ri, ft, KR, kp, yt, JM], mP, {
  memoizeOptions: {
    resultEqualityCheck: El
  }
}), YR = z([yP, yt, Ua], Va), GR = z([YR, yt], wP), XR = z([gP, yt, Ua], Va), qR = z([XR, yt], bP), QR = z([xP, yt, Ua], Va), ZR = z([QR, yt], SP), JR = z([GR, ZR, qR], Ks), ez = z([ft, XP, qP, HR, VR, JR, Be, yt], AP), Ra = z([ft, Be, Ri, Mp, Ec, yt, ez], PP), tz = z([Ra, ft, Np], EP), rz = z([ft, Ra, tz, yt], OP), QP = (e) => {
  var t = yt(e), r = Ua(e), n = !1;
  return Tl(e, t, r, n);
}, ZP = z([ft, QP], Oc), nz = z([ft, Np, rz, ZP], Sp), JP = z([nz], Zh), iz = z([Be, Mp, ft, yt], MP), az = z([Be, Mp, ft, yt], jP), oz = (e, t, r, n, o, l, s, c) => {
  if (t) {
    var f = t.type, d = $r(e, c);
    if (n) {
      var h = r === "scaleBand" && n.bandwidth ? n.bandwidth() / 2 : 2, p = f === "category" && n.bandwidth ? n.bandwidth() / h : 0;
      return p = c === "angleAxis" && o != null && (o == null ? void 0 : o.length) >= 2 ? pr(o[0] - o[1]) * 2 * p : p, d && s ? s.map((y, x) => {
        var A = n.map(y);
        return ke(A) ? {
          coordinate: A + p,
          value: y,
          index: x,
          offset: p
        } : null;
      }).filter(Bt) : n.domain().map((y, x) => {
        var A = n.map(y);
        return ke(A) ? {
          coordinate: A + p,
          // @ts-expect-error can't use Date as an index
          value: l ? l[y] : y,
          index: x,
          offset: p
        } : null;
      }).filter(Bt);
    }
  }
}, Cn = z([Be, ft, Np, JP, QP, iz, az, yt], oz), Dp = z([$P, LP, fR], (e, t, r) => RP(r.shared, e, t)), eE = (e) => e.tooltip.settings.trigger, $p = (e) => e.tooltip.settings.defaultIndex, Ml = z([Ga, Dp, eE, $p], UP), hl = z([Ml, Ri, La, Ra], el), tE = z([Cn, hl], zP), lz = z([Ml], (e) => {
  if (e)
    return e.dataKey;
}), uz = z([Ml], (e) => {
  if (e)
    return e.graphicalItemId;
}), rE = z([Ga, Dp, eE, $p], KP), sz = z([Pn, En, Be, Et, Cn, $p, rE], HP), cz = z([Ml, sz], (e, t) => e != null && e.coordinate ? e.coordinate : t), fz = z([Ml], (e) => {
  var t;
  return (t = e == null ? void 0 : e.active) !== null && t !== void 0 ? t : !1;
}), dz = z([rE, hl, Lr, La, tE, VP, Dp], YP), vz = z([dz], (e) => {
  if (e != null) {
    var t = e.map((r) => r.payload).filter((r) => r != null);
    return Array.from(new Set(t));
  }
});
function Rw(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function zw(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Rw(Object(r), !0).forEach(function(n) {
      hz(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Rw(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function hz(e, t, r) {
  return (t = pz(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function pz(e) {
  var t = mz(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function mz(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var yz = () => he(ft), gz = () => {
  var e = yz(), t = he(Cn), r = he(JP);
  return Na(!e || !r ? void 0 : zw(zw({}, e), {}, {
    scale: r
  }), t);
};
function Bw(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function wa(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Bw(Object(r), !0).forEach(function(n) {
      xz(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Bw(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function xz(e, t, r) {
  return (t = wz(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function wz(e) {
  var t = bz(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function bz(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Sz = (e, t, r, n) => {
  var o = t.find((l) => l && l.index === r);
  if (o) {
    if (e === "horizontal")
      return {
        x: o.coordinate,
        y: n.relativeY
      };
    if (e === "vertical")
      return {
        x: n.relativeX,
        y: o.coordinate
      };
  }
  return {
    x: 0,
    y: 0
  };
}, Az = (e, t, r, n) => {
  var o = t.find((d) => d && d.index === r);
  if (o) {
    if (e === "centric") {
      var l = o.coordinate, s = n.radius;
      return wa(wa(wa({}, n), Pt(n.cx, n.cy, s, l)), {}, {
        angle: l,
        radius: s
      });
    }
    var c = o.coordinate, f = n.angle;
    return wa(wa(wa({}, n), Pt(n.cx, n.cy, c, f)), {}, {
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
function Pz(e, t) {
  var r = e.relativeX, n = e.relativeY;
  return r >= t.left && r <= t.left + t.width && n >= t.top && n <= t.top + t.height;
}
var nE = (e, t, r, n, o) => {
  var l, s = (l = t == null ? void 0 : t.length) !== null && l !== void 0 ? l : 0;
  if (s <= 1 || e == null)
    return 0;
  if (n === "angleAxis" && o != null && Math.abs(Math.abs(o[1] - o[0]) - 360) <= 1e-6)
    for (var c = o[1] - o[0], f = (we, ve, ae) => [e, e + c, e - c].some((U) => (ae ? U >= we : U > we) && U <= ve), d = 0; d < s; d++) {
      var h, p, y, x, A, S = d > 0 ? (h = r[d - 1]) === null || h === void 0 ? void 0 : h.coordinate : (p = r[s - 1]) === null || p === void 0 ? void 0 : p.coordinate, b = (y = r[d]) === null || y === void 0 ? void 0 : y.coordinate, E = d >= s - 1 ? (x = r[0]) === null || x === void 0 ? void 0 : x.coordinate : (A = r[d + 1]) === null || A === void 0 ? void 0 : A.coordinate, k = void 0;
      if (!(S == null || b == null || E == null))
        if (pr(b - S) !== pr(E - b)) {
          var C = [];
          if (pr(E - b) === pr(o[1] - o[0])) {
            k = E;
            var j = b + o[1] - o[0];
            C[0] = Math.min(j, (j + S) / 2), C[1] = Math.max(j, (j + S) / 2);
          } else {
            k = S;
            var T = E + o[1] - o[0];
            C[0] = Math.min(b, (T + b) / 2), C[1] = Math.max(b, (T + b) / 2);
          }
          var O = [Math.min(b, (k + b) / 2), Math.max(b, (k + b) / 2)];
          if (f(O[0], O[1], !1) || f(C[0], C[1], !0)) {
            var _;
            return (_ = r[d]) === null || _ === void 0 ? void 0 : _.index;
          }
        } else {
          var F = Math.min(S, E), K = Math.max(S, E);
          if (f((F + b) / 2, (K + b) / 2, !1)) {
            var V;
            return (V = r[d]) === null || V === void 0 ? void 0 : V.index;
          }
        }
    }
  else if (t)
    for (var q = 0; q < s; q++) {
      var W = t[q];
      if (W != null) {
        var ie = t[q + 1], re = t[q - 1];
        if (q === 0 && ie != null && e <= (W.coordinate + ie.coordinate) / 2 || q === s - 1 && re != null && e > (W.coordinate + re.coordinate) / 2 || q > 0 && q < s - 1 && re != null && ie != null && e > (W.coordinate + re.coordinate) / 2 && e <= (W.coordinate + ie.coordinate) / 2)
          return W.index;
      }
    }
  return -1;
}, iE = () => he(Hh), Lp = (e, t) => t, aE = (e, t, r) => r, Rp = (e, t, r, n) => n, Ez = z(Cn, (e) => uc(e, (t) => t.coordinate)), zp = z([Ga, Lp, aE, Rp], UP), Bp = z([zp, Ri, La, Ra], el), Oz = (e, t, r) => {
  if (t != null) {
    var n = Ga(e);
    return t === "axis" ? r === "hover" ? n.axisInteraction.hover.dataKey : n.axisInteraction.click.dataKey : r === "hover" ? n.itemInteraction.hover.dataKey : n.itemInteraction.click.dataKey;
  }
}, oE = z([Ga, Lp, aE, Rp], KP), Ys = z([Pn, En, Be, Et, Cn, Rp, oE], HP), kz = z([zp, Ys], (e, t) => {
  var r;
  return (r = e.coordinate) !== null && r !== void 0 ? r : t;
}), lE = z([Cn, Bp], zP), _z = z([oE, Bp, Lr, La, lE, VP, Lp], YP), Cz = z([zp, Bp], (e, t) => ({
  isActive: e.active && t != null,
  activeIndex: t
})), Iz = (e, t, r, n, o, l, s) => {
  if (!(!e || !r || !n || !o) && Pz(e, s)) {
    var c = Zj(e, t), f = nE(c, l, o, r, n), d = Sz(t, o, f, e);
    return {
      activeIndex: String(f),
      activeCoordinate: d
    };
  }
}, jz = (e, t, r, n, o, l, s) => {
  if (!(!e || !n || !o || !l || !r)) {
    var c = HM(e, r);
    if (c) {
      var f = Jj(c, t), d = nE(f, s, l, n, o), h = Az(t, l, d, c);
      return {
        activeIndex: String(d),
        activeCoordinate: h
      };
    }
  }
}, Tz = (e, t, r, n, o, l, s, c) => {
  if (!(!e || !t || !n || !o || !l))
    return t === "horizontal" || t === "vertical" ? Iz(e, t, n, o, l, s, c) : jz(e, t, r, n, o, l, s);
}, Nz = z((e) => e.zIndex.zIndexMap, (e, t) => t, (e, t, r) => r, (e, t, r) => {
  if (t != null) {
    var n = e[t];
    if (n != null)
      return r ? n.panoramaElement : n.element;
  }
}), Mz = z((e) => e.zIndex.zIndexMap, (e) => {
  var t = Object.keys(e).map((n) => parseInt(n, 10)).concat(Object.values(Nt)), r = Array.from(new Set(t));
  return r.sort((n, o) => n - o);
}, {
  memoizeOptions: {
    resultEqualityCheck: b2
  }
});
function Fw(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Ww(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Fw(Object(r), !0).forEach(function(n) {
      Dz(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Fw(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function Dz(e, t, r) {
  return (t = $z(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function $z(e) {
  var t = Lz(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function Lz(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Rz = {}, zz = {
  zIndexMap: Object.values(Nt).reduce((e, t) => Ww(Ww({}, e), {}, {
    [t]: {
      element: void 0,
      panoramaElement: void 0,
      consumers: 0
    }
  }), Rz)
}, Bz = new Set(Object.values(Nt));
function Fz(e) {
  return Bz.has(e);
}
var uE = Dt({
  name: "zIndex",
  initialState: zz,
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
      prepare: Ue()
    },
    unregisterZIndexPortal: {
      reducer: (e, t) => {
        var r = t.payload.zIndex;
        e.zIndexMap[r] && (e.zIndexMap[r].consumers -= 1, e.zIndexMap[r].consumers <= 0 && !Fz(r) && delete e.zIndexMap[r]);
      },
      prepare: Ue()
    },
    registerZIndexPortalElement: {
      reducer: (e, t) => {
        var r = t.payload, n = r.zIndex, o = r.element, l = r.isPanorama;
        e.zIndexMap[n] ? l ? e.zIndexMap[n].panoramaElement = Ne(o) : e.zIndexMap[n].element = Ne(o) : e.zIndexMap[n] = {
          consumers: 0,
          element: l ? void 0 : Ne(o),
          panoramaElement: l ? Ne(o) : void 0
        };
      },
      prepare: Ue()
    },
    unregisterZIndexPortalElement: {
      reducer: (e, t) => {
        var r = t.payload.zIndex;
        e.zIndexMap[r] && (t.payload.isPanorama ? e.zIndexMap[r].panoramaElement = void 0 : e.zIndexMap[r].element = void 0);
      },
      prepare: Ue()
    }
  }
}), Wc = uE.actions, Wz = Wc.registerZIndexPortal, mv = Wc.unregisterZIndexPortal, Uz = Wc.registerZIndexPortalElement, Hz = Wc.unregisterZIndexPortalElement, Kz = uE.reducer;
function rn(e) {
  var t = e.zIndex, r = e.children, n = LT(), o = n && t !== void 0 && t !== 0, l = $t(), s = w.useRef(void 0), c = w.useRef(/* @__PURE__ */ new Set()), f = rt(), d = he((p) => Nz(p, t, l));
  if (w.useLayoutEffect(() => {
    if (!o) {
      var p = c.current;
      p.forEach((x) => {
        f(mv({
          zIndex: x
        }));
      }), p.clear(), s.current = void 0;
      return;
    }
    if (c.current.has(t) || (f(Wz({
      zIndex: t
    })), c.current.add(t)), d) {
      s.current = d;
      var y = c.current;
      y.forEach((x) => {
        x !== t && (f(mv({
          zIndex: x
        })), y.delete(x));
      });
    }
  }, [f, t, o, d]), w.useLayoutEffect(() => {
    var p = c.current;
    return () => {
      p.forEach((y) => {
        f(mv({
          zIndex: y
        }));
      }), p.clear();
    };
  }, [f]), !o)
    return r;
  var h = d ?? s.current;
  return h ? /* @__PURE__ */ ab.createPortal(r, h) : null;
}
function ah() {
  return ah = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, ah.apply(null, arguments);
}
function Uw(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function ns(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Uw(Object(r), !0).forEach(function(n) {
      Vz(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Uw(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function Vz(e, t, r) {
  return (t = Yz(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function Yz(e) {
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
function Xz(e) {
  var t = e.cursor, r = e.cursorComp, n = e.cursorProps;
  return /* @__PURE__ */ w.isValidElement(t) ? /* @__PURE__ */ w.cloneElement(t, n) : /* @__PURE__ */ w.createElement(r, n);
}
function qz(e) {
  var t, r = e.coordinate, n = e.payload, o = e.index, l = e.offset, s = e.tooltipAxisBandSize, c = e.layout, f = e.cursor, d = e.tooltipEventType, h = e.chartName, p = r, y = n, x = o;
  if (!f || !p || h !== "ScatterChart" && d !== "axis")
    return null;
  var A, S, b;
  if (h === "ScatterChart")
    A = p, S = ZN, b = Nt.cursorLine;
  else if (h === "BarChart")
    A = JN(c, p, l, s), S = MM, b = Nt.cursorRectangle;
  else if (c === "radial" && Pb(p)) {
    var E = GS(p), k = E.cx, C = E.cy, j = E.radius, T = E.startAngle, O = E.endAngle;
    A = {
      cx: k,
      cy: C,
      startAngle: T,
      endAngle: O,
      innerRadius: j,
      outerRadius: j
    }, S = GM, b = Nt.cursorLine;
  } else
    A = {
      points: XM(c, p, l)
    }, S = Jo, b = Nt.cursorLine;
  var _ = typeof f == "object" && "className" in f ? f.className : void 0, F = ns(ns(ns(ns({
    stroke: "#ccc",
    pointerEvents: "none"
  }, l), A), ic(f)), {}, {
    payload: y,
    payloadIndex: x,
    className: ze("recharts-tooltip-cursor", _)
  });
  return /* @__PURE__ */ w.createElement(rn, {
    zIndex: (t = e.zIndex) !== null && t !== void 0 ? t : b
  }, /* @__PURE__ */ w.createElement(Xz, {
    cursor: f,
    cursorComp: S,
    cursorProps: F
  }));
}
function Qz(e) {
  var t = gz(), r = $S(), n = Wi(), o = iE();
  return t == null || r == null || n == null || o == null ? null : /* @__PURE__ */ w.createElement(qz, ah({}, e, {
    offset: r,
    layout: n,
    tooltipAxisBandSize: t,
    chartName: o
  }));
}
var sE = /* @__PURE__ */ w.createContext(null), Zz = () => w.useContext(sE), yv = { exports: {} }, Hw;
function Jz() {
  return Hw || (Hw = 1, (function(e) {
    var t = Object.prototype.hasOwnProperty, r = "~";
    function n() {
    }
    Object.create && (n.prototype = /* @__PURE__ */ Object.create(null), new n().__proto__ || (r = !1));
    function o(f, d, h) {
      this.fn = f, this.context = d, this.once = h || !1;
    }
    function l(f, d, h, p, y) {
      if (typeof h != "function")
        throw new TypeError("The listener must be a function");
      var x = new o(h, p || f, y), A = r ? r + d : d;
      return f._events[A] ? f._events[A].fn ? f._events[A] = [f._events[A], x] : f._events[A].push(x) : (f._events[A] = x, f._eventsCount++), f;
    }
    function s(f, d) {
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
      for (var y = 0, x = p.length, A = new Array(x); y < x; y++)
        A[y] = p[y].fn;
      return A;
    }, c.prototype.listenerCount = function(d) {
      var h = r ? r + d : d, p = this._events[h];
      return p ? p.fn ? 1 : p.length : 0;
    }, c.prototype.emit = function(d, h, p, y, x, A) {
      var S = r ? r + d : d;
      if (!this._events[S]) return !1;
      var b = this._events[S], E = arguments.length, k, C;
      if (b.fn) {
        switch (b.once && this.removeListener(d, b.fn, void 0, !0), E) {
          case 1:
            return b.fn.call(b.context), !0;
          case 2:
            return b.fn.call(b.context, h), !0;
          case 3:
            return b.fn.call(b.context, h, p), !0;
          case 4:
            return b.fn.call(b.context, h, p, y), !0;
          case 5:
            return b.fn.call(b.context, h, p, y, x), !0;
          case 6:
            return b.fn.call(b.context, h, p, y, x, A), !0;
        }
        for (C = 1, k = new Array(E - 1); C < E; C++)
          k[C - 1] = arguments[C];
        b.fn.apply(b.context, k);
      } else {
        var j = b.length, T;
        for (C = 0; C < j; C++)
          switch (b[C].once && this.removeListener(d, b[C].fn, void 0, !0), E) {
            case 1:
              b[C].fn.call(b[C].context);
              break;
            case 2:
              b[C].fn.call(b[C].context, h);
              break;
            case 3:
              b[C].fn.call(b[C].context, h, p);
              break;
            case 4:
              b[C].fn.call(b[C].context, h, p, y);
              break;
            default:
              if (!k) for (T = 1, k = new Array(E - 1); T < E; T++)
                k[T - 1] = arguments[T];
              b[C].fn.apply(b[C].context, k);
          }
      }
      return !0;
    }, c.prototype.on = function(d, h, p) {
      return l(this, d, h, p, !1);
    }, c.prototype.once = function(d, h, p) {
      return l(this, d, h, p, !0);
    }, c.prototype.removeListener = function(d, h, p, y) {
      var x = r ? r + d : d;
      if (!this._events[x]) return this;
      if (!h)
        return s(this, x), this;
      var A = this._events[x];
      if (A.fn)
        A.fn === h && (!y || A.once) && (!p || A.context === p) && s(this, x);
      else {
        for (var S = 0, b = [], E = A.length; S < E; S++)
          (A[S].fn !== h || y && !A[S].once || p && A[S].context !== p) && b.push(A[S]);
        b.length ? this._events[x] = b.length === 1 ? b[0] : b : s(this, x);
      }
      return this;
    }, c.prototype.removeAllListeners = function(d) {
      var h;
      return d ? (h = r ? r + d : d, this._events[h] && s(this, h)) : (this._events = new n(), this._eventsCount = 0), this;
    }, c.prototype.off = c.prototype.removeListener, c.prototype.addListener = c.prototype.on, c.prefixed = r, c.EventEmitter = c, e.exports = c;
  })(yv)), yv.exports;
}
var e3 = Jz();
const t3 = /* @__PURE__ */ J1(e3);
var pl = new t3(), oh = "recharts.syncEvent.tooltip", Kw = "recharts.syncEvent.brush", r3 = (e, t) => {
  if (t && Array.isArray(e)) {
    var r = Number.parseInt(t, 10);
    if (!Zr(r))
      return e[r];
  }
}, n3 = {
  chartName: "",
  tooltipPayloadSearcher: () => {
  },
  eventEmitter: void 0,
  defaultTooltipEventType: "axis"
}, cE = Dt({
  name: "options",
  initialState: n3,
  reducers: {
    createEventEmitter: (e) => {
      e.eventEmitter == null && (e.eventEmitter = Symbol("rechartsEventEmitter"));
    }
  }
}), i3 = cE.reducer, a3 = cE.actions.createEventEmitter;
function o3(e) {
  return e.tooltip.syncInteraction;
}
var l3 = {
  chartData: void 0,
  computedData: void 0,
  dataStartIndex: 0,
  dataEndIndex: 0
}, fE = Dt({
  name: "chartData",
  initialState: l3,
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
      var r = t.payload, n = r.startIndex, o = r.endIndex;
      n != null && (e.dataStartIndex = n), o != null && (e.dataEndIndex = o);
    }
  }
}), Fp = fE.actions, Vw = Fp.setChartData, u3 = Fp.setDataStartEndIndexes;
Fp.setComputedData;
var s3 = fE.reducer, c3 = ["x", "y"];
function Yw(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function ba(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Yw(Object(r), !0).forEach(function(n) {
      f3(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Yw(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function f3(e, t, r) {
  return (t = d3(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function d3(e) {
  var t = v3(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function v3(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function h3(e, t) {
  if (e == null) return {};
  var r, n, o = p3(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (o[r] = e[r]);
  }
  return o;
}
function p3(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
function m3() {
  var e = he(Kh), t = he(Vh), r = rt(), n = he(sA), o = he(Cn), l = Wi(), s = Pc(), c = he((f) => f.rootProps.className);
  w.useEffect(() => {
    if (e == null)
      return Fi;
    var f = (d, h, p) => {
      if (t !== p && e === d) {
        if (h.payload.active === !1) {
          r(qo({
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
          if (s && h !== null && h !== void 0 && (y = h.payload) !== null && y !== void 0 && y.coordinate && h.payload.sourceViewBox) {
            var x = h.payload.coordinate, A = x.x, S = x.y, b = h3(x, c3), E = h.payload.sourceViewBox, k = E.x, C = E.y, j = E.width, T = E.height, O = ba(ba({}, b), {}, {
              x: s.x + (j ? (A - k) / j : 0) * s.width,
              y: s.y + (T ? (S - C) / T : 0) * s.height
            });
            r(ba(ba({}, h), {}, {
              payload: ba(ba({}, h.payload), {}, {
                coordinate: O
              })
            }));
          } else
            r(h);
          return;
        }
        if (o != null) {
          var _;
          if (typeof n == "function") {
            var F = {
              activeTooltipIndex: h.payload.index == null ? void 0 : Number(h.payload.index),
              isTooltipActive: h.payload.active,
              activeIndex: h.payload.index == null ? void 0 : Number(h.payload.index),
              activeLabel: h.payload.label,
              activeDataKey: h.payload.dataKey,
              activeCoordinate: h.payload.coordinate
            }, K = n(o, F);
            _ = o[K];
          } else n === "value" && (_ = o.find((ae) => String(ae.value) === h.payload.label));
          var V = h.payload.coordinate;
          if (V == null || s == null) {
            r(qo({
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
          if (_ == null) {
            r(qo({
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
          var q = V.x, W = V.y, ie = Math.min(q, s.x + s.width), re = Math.min(W, s.y + s.height), we = {
            x: l === "horizontal" ? _.coordinate : ie,
            y: l === "horizontal" ? re : _.coordinate
          }, ve = qo({
            active: h.payload.active,
            coordinate: we,
            dataKey: h.payload.dataKey,
            index: String(_.index),
            label: h.payload.label,
            sourceViewBox: h.payload.sourceViewBox,
            graphicalItemId: h.payload.graphicalItemId
          });
          r(ve);
        }
      }
    };
    return pl.on(oh, f), () => {
      pl.off(oh, f);
    };
  }, [c, r, t, e, n, o, l, s]);
}
function y3() {
  var e = he(Kh), t = he(Vh), r = rt();
  w.useEffect(() => {
    if (e == null)
      return Fi;
    var n = (o, l, s) => {
      t !== s && e === o && r(u3(l));
    };
    return pl.on(Kw, n), () => {
      pl.off(Kw, n);
    };
  }, [r, t, e]);
}
function g3() {
  var e = rt();
  w.useEffect(() => {
    e(a3());
  }, [e]), m3(), y3();
}
function x3(e, t, r, n, o, l) {
  var s = he((A) => Oz(A, e, t)), c = he(uz), f = he(Vh), d = he(Kh), h = he(sA), p = he(o3), y = (p == null ? void 0 : p.sourceViewBox) != null, x = Pc();
  w.useEffect(() => {
    if (!y && d != null && f != null) {
      var A = qo({
        active: l,
        coordinate: r,
        dataKey: s,
        index: o,
        label: typeof n == "number" ? String(n) : n,
        sourceViewBox: x,
        graphicalItemId: c
      });
      pl.emit(oh, d, A, f);
    }
  }, [y, r, s, c, o, n, f, d, h, l, x]);
}
function Gw(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Xw(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Gw(Object(r), !0).forEach(function(n) {
      w3(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Gw(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function w3(e, t, r) {
  return (t = b3(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function b3(e) {
  var t = S3(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function S3(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function A3(e, t) {
  return k3(e) || O3(e, t) || E3(e, t) || P3();
}
function P3() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function E3(e, t) {
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
function O3(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, o, l, s, c = [], f = !0, d = !1;
    try {
      if (l = (r = r.call(e)).next, t !== 0) for (; !(f = (n = l.call(r)).done) && (c.push(n.value), c.length !== t); f = !0) ;
    } catch (h) {
      d = !0, o = h;
    } finally {
      try {
        if (!f && r.return != null && (s = r.return(), Object(s) !== s)) return;
      } finally {
        if (d) throw o;
      }
    }
    return c;
  }
}
function k3(e) {
  if (Array.isArray(e)) return e;
}
function _3(e) {
  return e.dataKey;
}
function C3(e, t) {
  return /* @__PURE__ */ w.isValidElement(e) ? /* @__PURE__ */ w.cloneElement(e, t) : typeof e == "function" ? /* @__PURE__ */ w.createElement(e, t) : /* @__PURE__ */ w.createElement(yN, t);
}
var Qw = [], I3 = {
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
function j3(e) {
  var t, r, n = qt(e, I3), o = n.active, l = n.allowEscapeViewBox, s = n.animationDuration, c = n.animationEasing, f = n.content, d = n.filterNull, h = n.isAnimationActive, p = n.offset, y = n.payloadUniqBy, x = n.position, A = n.reverseDirection, S = n.useTranslate3d, b = n.wrapperStyle, E = n.cursor, k = n.shared, C = n.trigger, j = n.defaultIndex, T = n.portal, O = n.axisId, _ = rt(), F = typeof j == "number" ? String(j) : j;
  w.useEffect(() => {
    _(mR({
      shared: k,
      trigger: C,
      axisId: O,
      active: o,
      defaultIndex: F
    }));
  }, [_, k, C, O, o, F]);
  var K = Pc(), V = WS(), q = cR(k), W = (t = he((be) => Cz(be, q, C, F))) !== null && t !== void 0 ? t : {}, ie = W.activeIndex, re = W.isActive, we = he((be) => _z(be, q, C, F)), ve = he((be) => lE(be, q, C, F)), ae = he((be) => kz(be, q, C, F)), U = we, te = Zz(), Y = (r = o ?? re) !== null && r !== void 0 ? r : !1, $ = LI([U, Y]), H = A3($, 2), fe = H[0], ge = H[1], Ae = q === "axis" ? ve : void 0;
  x3(q, C, ae, Ae, ie, Y);
  var Pe = T ?? te;
  if (Pe == null || K == null || q == null)
    return null;
  var Ee = U ?? Qw;
  Y || (Ee = Qw), d && Ee.length && (Ee = oI(Ee.filter((be) => be.value != null && (be.hide !== !0 || n.includeHidden)), y, _3));
  var _e = Ee.length > 0, J = Xw(Xw({}, n), {}, {
    payload: Ee,
    label: Ae,
    active: Y,
    activeIndex: ie,
    coordinate: ae,
    accessibilityLayer: V
  }), pe = /* @__PURE__ */ w.createElement(RN, {
    allowEscapeViewBox: l,
    animationDuration: s,
    animationEasing: c,
    isAnimationActive: h,
    active: Y,
    coordinate: ae,
    hasPayload: _e,
    offset: p,
    position: x,
    reverseDirection: A,
    useTranslate3d: S,
    viewBox: K,
    wrapperStyle: b,
    lastBoundingBox: fe,
    innerRef: ge,
    hasPortalFromProps: !!T
  }, C3(f, J));
  return /* @__PURE__ */ w.createElement(w.Fragment, null, /* @__PURE__ */ ab.createPortal(pe, Pe), Y && /* @__PURE__ */ w.createElement(Qz, {
    cursor: E,
    tooltipEventType: q,
    coordinate: ae,
    payload: Ee,
    index: ie
  }));
}
function T3(e, t, r) {
  return (t = N3(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function N3(e) {
  var t = M3(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function M3(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
class D3 {
  constructor(t) {
    T3(this, "cache", /* @__PURE__ */ new Map()), this.maxSize = t;
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
function Zw(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function $3(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Zw(Object(r), !0).forEach(function(n) {
      L3(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Zw(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function L3(e, t, r) {
  return (t = R3(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function R3(e) {
  var t = z3(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function z3(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var B3 = {
  cacheSize: 2e3,
  enableCache: !0
}, dE = $3({}, B3), Jw = new D3(dE.cacheSize), F3 = {
  position: "absolute",
  top: "-20000px",
  left: 0,
  padding: 0,
  margin: 0,
  border: "none",
  whiteSpace: "pre"
}, e1 = "recharts_measurement_span";
function W3(e, t) {
  var r = t.fontSize || "", n = t.fontFamily || "", o = t.fontWeight || "", l = t.fontStyle || "", s = t.letterSpacing || "", c = t.textTransform || "";
  return "".concat(e, "|").concat(r, "|").concat(n, "|").concat(o, "|").concat(l, "|").concat(s, "|").concat(c);
}
var t1 = (e, t) => {
  try {
    var r = document.getElementById(e1);
    r || (r = document.createElement("span"), r.setAttribute("id", e1), r.setAttribute("aria-hidden", "true"), document.body.appendChild(r)), Object.assign(r.style, F3, t), r.textContent = "".concat(e);
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
}, tl = function(t) {
  var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  if (t == null || Al.isSsr)
    return {
      width: 0,
      height: 0
    };
  if (!dE.enableCache)
    return t1(t, r);
  var n = W3(t, r), o = Jw.get(n);
  if (o)
    return o;
  var l = t1(t, r);
  return Jw.set(n, l), l;
}, vE;
function Gs(e, t) {
  return V3(e) || K3(e, t) || H3(e, t) || U3();
}
function U3() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function H3(e, t) {
  if (e) {
    if (typeof e == "string") return r1(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? r1(e, t) : void 0;
  }
}
function r1(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function K3(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, o, l, s, c = [], f = !0, d = !1;
    try {
      if (l = (r = r.call(e)).next, t === 0) {
        if (Object(r) !== r) return;
        f = !1;
      } else for (; !(f = (n = l.call(r)).done) && (c.push(n.value), c.length !== t); f = !0) ;
    } catch (h) {
      d = !0, o = h;
    } finally {
      try {
        if (!f && r.return != null && (s = r.return(), Object(s) !== s)) return;
      } finally {
        if (d) throw o;
      }
    }
    return c;
  }
}
function V3(e) {
  if (Array.isArray(e)) return e;
}
function Y3(e, t, r) {
  return (t = G3(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function G3(e) {
  var t = X3(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function X3(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var n1 = /(-?\d+(?:\.\d+)?[a-zA-Z%]*)([*/])(-?\d+(?:\.\d+)?[a-zA-Z%]*)/, i1 = /(-?\d+(?:\.\d+)?[a-zA-Z%]*)([+-])(-?\d+(?:\.\d+)?[a-zA-Z%]*)/, q3 = /^(px|cm|vh|vw|em|rem|%|mm|in|pt|pc|ex|ch|vmin|vmax|Q)$/, Q3 = /(-?\d+(?:\.\d+)?)([a-zA-Z%]+)?/, Z3 = {
  cm: 96 / 2.54,
  mm: 96 / 25.4,
  pt: 96 / 72,
  pc: 96 / 6,
  in: 96,
  Q: 96 / (2.54 * 40),
  px: 1
}, J3 = ["cm", "mm", "pt", "pc", "in", "Q", "px"];
function eB(e) {
  return J3.includes(e);
}
var Oa = "NaN";
function tB(e, t) {
  return e * Z3[t];
}
class At {
  static parse(t) {
    var r, n = (r = Q3.exec(t)) !== null && r !== void 0 ? r : [], o = Gs(n, 3), l = o[1], s = o[2];
    return l == null ? At.NaN : new At(parseFloat(l), s ?? "");
  }
  constructor(t, r) {
    this.num = t, this.unit = r, this.num = t, this.unit = r, Zr(t) && (this.unit = ""), r !== "" && !q3.test(r) && (this.num = NaN, this.unit = ""), eB(r) && (this.num = tB(t, r), this.unit = "px");
  }
  add(t) {
    return this.unit !== t.unit ? new At(NaN, "") : new At(this.num + t.num, this.unit);
  }
  subtract(t) {
    return this.unit !== t.unit ? new At(NaN, "") : new At(this.num - t.num, this.unit);
  }
  multiply(t) {
    return this.unit !== "" && t.unit !== "" && this.unit !== t.unit ? new At(NaN, "") : new At(this.num * t.num, this.unit || t.unit);
  }
  divide(t) {
    return this.unit !== "" && t.unit !== "" && this.unit !== t.unit ? new At(NaN, "") : new At(this.num / t.num, this.unit || t.unit);
  }
  toString() {
    return "".concat(this.num).concat(this.unit);
  }
  isNaN() {
    return Zr(this.num);
  }
}
vE = At;
Y3(At, "NaN", new vE(NaN, ""));
function hE(e) {
  if (e == null || e.includes(Oa))
    return Oa;
  for (var t = e; t.includes("*") || t.includes("/"); ) {
    var r, n = (r = n1.exec(t)) !== null && r !== void 0 ? r : [], o = Gs(n, 4), l = o[1], s = o[2], c = o[3], f = At.parse(l ?? ""), d = At.parse(c ?? ""), h = s === "*" ? f.multiply(d) : f.divide(d);
    if (h.isNaN())
      return Oa;
    t = t.replace(n1, h.toString());
  }
  for (; t.includes("+") || /.-\d+(?:\.\d+)?/.test(t); ) {
    var p, y = (p = i1.exec(t)) !== null && p !== void 0 ? p : [], x = Gs(y, 4), A = x[1], S = x[2], b = x[3], E = At.parse(A ?? ""), k = At.parse(b ?? ""), C = S === "+" ? E.add(k) : E.subtract(k);
    if (C.isNaN())
      return Oa;
    t = t.replace(i1, C.toString());
  }
  return t;
}
var a1 = /\(([^()]*)\)/;
function rB(e) {
  for (var t = e, r; (r = a1.exec(t)) != null; ) {
    var n = r, o = Gs(n, 2), l = o[1];
    t = t.replace(a1, hE(l));
  }
  return t;
}
function nB(e) {
  var t = e.replace(/\s+/g, "");
  return t = rB(t), t = hE(t), t;
}
function iB(e) {
  try {
    return nB(e);
  } catch {
    return Oa;
  }
}
function gv(e) {
  var t = iB(e.slice(5, -1));
  return t === Oa ? "" : t;
}
var aB = ["x", "y", "lineHeight", "capHeight", "fill", "scaleToFit", "textAnchor", "verticalAnchor"], oB = ["dx", "dy", "angle", "className", "breakAll"];
function lh() {
  return lh = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, lh.apply(null, arguments);
}
function o1(e, t) {
  if (e == null) return {};
  var r, n, o = lB(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (o[r] = e[r]);
  }
  return o;
}
function lB(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
function l1(e, t) {
  return fB(e) || cB(e, t) || sB(e, t) || uB();
}
function uB() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function sB(e, t) {
  if (e) {
    if (typeof e == "string") return u1(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? u1(e, t) : void 0;
  }
}
function u1(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function cB(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, o, l, s, c = [], f = !0, d = !1;
    try {
      if (l = (r = r.call(e)).next, t === 0) {
        if (Object(r) !== r) return;
        f = !1;
      } else for (; !(f = (n = l.call(r)).done) && (c.push(n.value), c.length !== t); f = !0) ;
    } catch (h) {
      d = !0, o = h;
    } finally {
      try {
        if (!f && r.return != null && (s = r.return(), Object(s) !== s)) return;
      } finally {
        if (d) throw o;
      }
    }
    return c;
  }
}
function fB(e) {
  if (Array.isArray(e)) return e;
}
var pE = /[ \f\n\r\t\v\u2028\u2029]+/, mE = (e) => {
  var t = e.children, r = e.breakAll, n = e.style;
  try {
    var o = [];
    st(t) || (r ? o = t.toString().split("") : o = t.toString().split(pE));
    var l = o.map((c) => ({
      word: c,
      width: tl(c, n).width
    })), s = r ? 0 : tl(" ", n).width;
    return {
      wordsWithComputedWidth: l,
      spaceWidth: s
    };
  } catch {
    return null;
  }
};
function yE(e) {
  return e === "start" || e === "middle" || e === "end" || e === "inherit";
}
function dB(e) {
  return st(e) || typeof e == "string" || typeof e == "number" || typeof e == "boolean";
}
var gE = (e, t, r, n) => e.reduce((o, l) => {
  var s = l.word, c = l.width, f = o[o.length - 1];
  if (f && c != null && (t == null || n || f.width + c + r < Number(t)))
    f.words.push(s), f.width += c + r;
  else {
    var d = {
      words: [s],
      width: c
    };
    o.push(d);
  }
  return o;
}, []), xE = (e) => e.reduce((t, r) => t.width > r.width ? t : r), vB = "…", s1 = (e, t, r, n, o, l, s, c) => {
  var f = e.slice(0, t), d = mE({
    breakAll: r,
    style: n,
    children: f + vB
  });
  if (!d)
    return [!1, []];
  var h = gE(d.wordsWithComputedWidth, l, s, c), p = h.length > o || xE(h).width > Number(l);
  return [p, h];
}, hB = (e, t, r, n, o) => {
  var l = e.maxLines, s = e.children, c = e.style, f = e.breakAll, d = le(l), h = String(s), p = gE(t, n, r, o);
  if (!d || o)
    return p;
  var y = p.length > l || xE(p).width > Number(n);
  if (!y)
    return p;
  for (var x = 0, A = h.length - 1, S = 0, b; x <= A && S <= h.length - 1; ) {
    var E = Math.floor((x + A) / 2), k = E - 1, C = s1(h, k, f, c, l, n, r, o), j = l1(C, 2), T = j[0], O = j[1], _ = s1(h, E, f, c, l, n, r, o), F = l1(_, 1), K = F[0];
    if (!T && !K && (x = E + 1), T && K && (A = E - 1), !T && K) {
      b = O;
      break;
    }
    S++;
  }
  return b || p;
}, c1 = (e) => {
  var t = st(e) ? [] : e.toString().split(pE);
  return [{
    words: t,
    width: void 0
  }];
}, pB = (e) => {
  var t = e.width, r = e.scaleToFit, n = e.children, o = e.style, l = e.breakAll, s = e.maxLines;
  if ((t || r) && !Al.isSsr) {
    var c, f, d = mE({
      breakAll: l,
      children: n,
      style: o
    });
    if (d) {
      var h = d.wordsWithComputedWidth, p = d.spaceWidth;
      c = h, f = p;
    } else
      return c1(n);
    return hB({
      breakAll: l,
      children: n,
      maxLines: s,
      style: o
    }, c, f, t, !!r);
  }
  return c1(n);
}, wE = "#808080", mB = {
  angle: 0,
  breakAll: !1,
  // Magic number from d3
  capHeight: "0.71em",
  fill: wE,
  lineHeight: "1em",
  scaleToFit: !1,
  textAnchor: "start",
  // Maintain compat with existing charts / default SVG behavior
  verticalAnchor: "end",
  x: 0,
  y: 0
}, Wp = /* @__PURE__ */ w.forwardRef((e, t) => {
  var r = qt(e, mB), n = r.x, o = r.y, l = r.lineHeight, s = r.capHeight, c = r.fill, f = r.scaleToFit, d = r.textAnchor, h = r.verticalAnchor, p = o1(r, aB), y = w.useMemo(() => pB({
    breakAll: p.breakAll,
    children: p.children,
    maxLines: p.maxLines,
    scaleToFit: f,
    style: p.style,
    width: p.width
  }), [p.breakAll, p.children, p.maxLines, f, p.style, p.width]), x = p.dx, A = p.dy, S = p.angle, b = p.className, E = p.breakAll, k = o1(p, oB);
  if (!Jr(n) || !Jr(o) || y.length === 0)
    return null;
  var C = Number(n) + (le(x) ? x : 0), j = Number(o) + (le(A) ? A : 0);
  if (!ke(C) || !ke(j))
    return null;
  var T;
  switch (h) {
    case "start":
      T = gv("calc(".concat(s, ")"));
      break;
    case "middle":
      T = gv("calc(".concat((y.length - 1) / 2, " * -").concat(l, " + (").concat(s, " / 2))"));
      break;
    default:
      T = gv("calc(".concat(y.length - 1, " * -").concat(l, ")"));
      break;
  }
  var O = [], _ = y[0];
  if (f && _ != null) {
    var F = _.width, K = p.width;
    O.push("scale(".concat(le(K) && le(F) ? K / F : 1, ")"));
  }
  return S && O.push("rotate(".concat(S, ", ").concat(C, ", ").concat(j, ")")), O.length && (k.transform = O.join(" ")), /* @__PURE__ */ w.createElement("text", lh({}, ar(k), {
    ref: t,
    x: C,
    y: j,
    className: ze("recharts-text", b),
    textAnchor: d,
    fill: c.includes("url") ? wE : c
  }), y.map((V, q) => {
    var W = V.words.join(E ? "" : " ");
    return (
      // duplicate words will cause duplicate keys which is why we add the array index here
      /* @__PURE__ */ w.createElement("tspan", {
        x: C,
        dy: q === 0 ? T : l,
        key: "".concat(W, "-").concat(q)
      }, W)
    );
  }));
});
Wp.displayName = "Text";
var yB = ["labelRef"], gB = ["content"];
function f1(e, t) {
  if (e == null) return {};
  var r, n, o = xB(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (o[r] = e[r]);
  }
  return o;
}
function xB(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
function d1(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Ei(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? d1(Object(r), !0).forEach(function(n) {
      wB(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : d1(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function wB(e, t, r) {
  return (t = bB(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function bB(e) {
  var t = SB(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function SB(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function vn() {
  return vn = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, vn.apply(null, arguments);
}
var bE = /* @__PURE__ */ w.createContext(null), AB = (e) => {
  var t = e.x, r = e.y, n = e.upperWidth, o = e.lowerWidth, l = e.width, s = e.height, c = e.children, f = w.useMemo(() => ({
    x: t,
    y: r,
    upperWidth: n,
    lowerWidth: o,
    width: l,
    height: s
  }), [t, r, n, o, l, s]);
  return /* @__PURE__ */ w.createElement(bE.Provider, {
    value: f
  }, c);
}, SE = () => {
  var e = w.useContext(bE), t = Pc();
  return e || (t ? Sh(t) : void 0);
}, PB = /* @__PURE__ */ w.createContext(null), EB = () => {
  var e = w.useContext(PB), t = he(hA);
  return e || t;
}, OB = (e) => {
  var t = e.value, r = e.formatter, n = st(e.children) ? t : e.children;
  return typeof r == "function" ? r(n) : n;
}, Uc = (e) => e != null && typeof e == "function", kB = (e, t) => {
  var r = pr(t - e), n = Math.min(Math.abs(t - e), 360);
  return r * n;
}, _B = (e, t, r, n, o) => {
  var l = e.offset, s = e.className, c = o.cx, f = o.cy, d = o.innerRadius, h = o.outerRadius, p = o.startAngle, y = o.endAngle, x = o.clockWise, A = (d + h) / 2, S = kB(p, y), b = S >= 0 ? 1 : -1, E, k;
  switch (t) {
    case "insideStart":
      E = p + b * l, k = x;
      break;
    case "insideEnd":
      E = y - b * l, k = !x;
      break;
    case "end":
      E = y + b * l, k = x;
      break;
    default:
      throw new Error("Unsupported position ".concat(t));
  }
  k = S <= 0 ? k : !k;
  var C = Pt(c, f, A, E), j = Pt(c, f, A, E + (k ? 1 : -1) * 359), T = "M".concat(C.x, ",").concat(C.y, `
    A`).concat(A, ",").concat(A, ",0,1,").concat(k ? 0 : 1, `,
    `).concat(j.x, ",").concat(j.y), O = st(e.id) ? il("recharts-radial-line-") : e.id;
  return /* @__PURE__ */ w.createElement("text", vn({}, n, {
    dominantBaseline: "central",
    className: ze("recharts-radial-bar-label", s)
  }), /* @__PURE__ */ w.createElement("defs", null, /* @__PURE__ */ w.createElement("path", {
    id: O,
    d: T
  })), /* @__PURE__ */ w.createElement("textPath", {
    xlinkHref: "#".concat(O)
  }, r));
}, CB = (e, t, r) => {
  var n = e.cx, o = e.cy, l = e.innerRadius, s = e.outerRadius, c = e.startAngle, f = e.endAngle, d = (c + f) / 2;
  if (r === "outside") {
    var h = Pt(n, o, s + t, d), p = h.x, y = h.y;
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
      y: o,
      textAnchor: "middle",
      verticalAnchor: "middle"
    };
  if (r === "centerTop")
    return {
      x: n,
      y: o,
      textAnchor: "middle",
      verticalAnchor: "start"
    };
  if (r === "centerBottom")
    return {
      x: n,
      y: o,
      textAnchor: "middle",
      verticalAnchor: "end"
    };
  var x = (l + s) / 2, A = Pt(n, o, x, d), S = A.x, b = A.y;
  return {
    x: S,
    y: b,
    textAnchor: "middle",
    verticalAnchor: "middle"
  };
}, Ea = (e) => e != null && "cx" in e && le(e.cx), IB = {
  angle: 0,
  offset: 5,
  zIndex: Nt.label,
  position: "middle",
  textBreakAll: !1
};
function jB(e) {
  if (!Ea(e))
    return e;
  var t = e.cx, r = e.cy, n = e.outerRadius, o = n * 2;
  return {
    x: t - n,
    y: r - n,
    width: o,
    upperWidth: o,
    lowerWidth: o,
    height: o
  };
}
function Qn(e) {
  var t, r, n = qt(e, IB), o = n.viewBox, l = n.parentViewBox, s = n.position, c = n.value, f = n.children, d = n.content, h = n.className, p = h === void 0 ? "" : h, y = n.textBreakAll, x = n.labelRef, A = EB(), S = SE(), b = s === "center" ? S : A ?? S, E, k, C;
  o == null ? E = b : Ea(o) ? E = o : E = Sh(o);
  var j = jB(E);
  if (!E || st(c) && st(f) && !/* @__PURE__ */ w.isValidElement(d) && typeof d != "function")
    return null;
  var T = Ea(E) && (s === "insideStart" || s === "insideEnd" || s === "end");
  if (Ea(E))
    T || (C = CB(E, n.offset, n.position));
  else if (j) {
    var O = aC({
      viewBox: j,
      position: s,
      offset: n.offset,
      parentViewBox: Ea(l) ? void 0 : l
    });
    C = Ei(Ei({
      x: O.x,
      y: O.y,
      textAnchor: O.horizontalAnchor,
      verticalAnchor: O.verticalAnchor
    }, O.width !== void 0 ? {
      width: O.width
    } : {}), O.height !== void 0 ? {
      height: O.height
    } : {});
  }
  var _ = Ei(Ei(Ei(Ei({}, ((t = C) === null || t === void 0 ? void 0 : t.x) !== void 0 ? {
    x: C.x
  } : {}), ((r = C) === null || r === void 0 ? void 0 : r.y) !== void 0 ? {
    y: C.y
  } : {}), n), {}, {
    viewBox: E
  });
  if (/* @__PURE__ */ w.isValidElement(d)) {
    _.labelRef;
    var F = f1(_, yB);
    return /* @__PURE__ */ w.cloneElement(d, F);
  }
  if (typeof d == "function") {
    _.content;
    var K = f1(_, gB);
    if (k = /* @__PURE__ */ w.createElement(d, K), /* @__PURE__ */ w.isValidElement(k))
      return k;
  } else
    k = OB(n);
  var V = ar(n);
  return T && Ea(E) ? _B(n, s, k, V, E) : C == null ? null : /* @__PURE__ */ w.createElement(rn, {
    zIndex: n.zIndex
  }, /* @__PURE__ */ w.createElement(Wp, vn({
    ref: x,
    className: ze("recharts-label", p)
  }, V, C, {
    /*
     * textAnchor is decided by default based on the `position`
     * but we allow overriding via props for precise control.
     */
    textAnchor: yE(V.textAnchor) ? V.textAnchor : C.textAnchor,
    breakAll: y
  }), k));
}
Qn.displayName = "Label";
var TB = (e, t, r) => {
  if (!e)
    return null;
  var n = {
    viewBox: t,
    labelRef: r
  };
  return e === !0 ? /* @__PURE__ */ w.createElement(Qn, vn({
    key: "label-implicit"
  }, n)) : Jr(e) ? /* @__PURE__ */ w.createElement(Qn, vn({
    key: "label-implicit",
    value: e
  }, n)) : /* @__PURE__ */ w.isValidElement(e) ? e.type === Qn ? /* @__PURE__ */ w.cloneElement(e, Ei({
    key: "label-implicit"
  }, n)) : /* @__PURE__ */ w.createElement(Qn, vn({
    key: "label-implicit",
    content: e
  }, n)) : Uc(e) ? /* @__PURE__ */ w.createElement(Qn, vn({
    key: "label-implicit",
    content: e
  }, n)) : e && typeof e == "object" ? /* @__PURE__ */ w.createElement(Qn, vn({}, e, {
    key: "label-implicit"
  }, n)) : null;
};
function NB(e) {
  var t = e.label, r = e.labelRef, n = SE();
  return TB(t, n, r) || null;
}
var MB = ["valueAccessor"], DB = ["dataKey", "clockWise", "id", "textBreakAll", "zIndex"];
function Xs() {
  return Xs = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Xs.apply(null, arguments);
}
function v1(e, t) {
  if (e == null) return {};
  var r, n, o = $B(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (o[r] = e[r]);
  }
  return o;
}
function $B(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
var LB = (e) => {
  var t = Array.isArray(e.value) ? e.value[e.value.length - 1] : e.value;
  if (dB(t))
    return t;
}, AE = /* @__PURE__ */ w.createContext(void 0), PE = AE.Provider, EE = /* @__PURE__ */ w.createContext(void 0);
EE.Provider;
function RB() {
  return w.useContext(AE);
}
function zB() {
  return w.useContext(EE);
}
function fs(e) {
  var t = e.valueAccessor, r = t === void 0 ? LB : t, n = v1(e, MB), o = n.dataKey;
  n.clockWise;
  var l = n.id, s = n.textBreakAll, c = n.zIndex, f = v1(n, DB), d = RB(), h = zB(), p = d || h;
  return !p || !p.length ? null : /* @__PURE__ */ w.createElement(rn, {
    zIndex: c ?? Nt.label
  }, /* @__PURE__ */ w.createElement(or, {
    className: "recharts-label-list"
  }, p.map((y, x) => {
    var A, S = st(o) ? r(y, x) : tt(y.payload, o), b = st(l) ? {} : {
      id: "".concat(l, "-").concat(x)
    };
    return /* @__PURE__ */ w.createElement(Qn, Xs({
      key: "label-".concat(x)
    }, ar(y), f, b, {
      /*
       * Prefer to use the explicit fill from LabelList props.
       * Only in an absence of that, fall back to the fill of the entry.
       * The entry fill can be quite difficult to see especially in Bar, Pie, RadialBar in inside positions.
       * On the other hand it's quite convenient in Scatter, Line, or when the position is outside the Bar, Pie filled shapes.
       */
      fill: (A = n.fill) !== null && A !== void 0 ? A : y.fill,
      parentViewBox: y.parentViewBox,
      value: S,
      textBreakAll: s,
      viewBox: y.viewBox,
      index: x,
      zIndex: 0
    }));
  })));
}
fs.displayName = "LabelList";
function OE(e) {
  var t = e.label;
  return t ? t === !0 ? /* @__PURE__ */ w.createElement(fs, {
    key: "labelList-implicit"
  }) : /* @__PURE__ */ w.isValidElement(t) || Uc(t) ? /* @__PURE__ */ w.createElement(fs, {
    key: "labelList-implicit",
    content: t
  }) : typeof t == "object" ? /* @__PURE__ */ w.createElement(fs, Xs({
    key: "labelList-implicit"
  }, t, {
    type: String(t.type)
  })) : null : null;
}
function uh() {
  return uh = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, uh.apply(null, arguments);
}
var kE = (e) => {
  var t = e.cx, r = e.cy, n = e.r, o = e.className, l = ze("recharts-dot", o);
  return le(t) && le(r) && le(n) ? /* @__PURE__ */ w.createElement("circle", uh({}, gr(e), Ph(e), {
    className: l,
    cx: t,
    cy: r,
    r: n
  })) : null;
}, BB = {
  radiusAxis: {},
  angleAxis: {}
}, _E = Dt({
  name: "polarAxis",
  initialState: BB,
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
}), Hc = _E.actions;
Hc.addRadiusAxis;
Hc.removeRadiusAxis;
Hc.addAngleAxis;
Hc.removeAngleAxis;
var FB = _E.reducer;
function WB(e) {
  return e && typeof e == "object" && "className" in e && typeof e.className == "string" ? e.className : "";
}
var xv = { exports: {} }, De = {};
/**
 * @license React
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var h1;
function UB() {
  if (h1) return De;
  h1 = 1;
  var e = Symbol.for("react.element"), t = Symbol.for("react.portal"), r = Symbol.for("react.fragment"), n = Symbol.for("react.strict_mode"), o = Symbol.for("react.profiler"), l = Symbol.for("react.provider"), s = Symbol.for("react.context"), c = Symbol.for("react.server_context"), f = Symbol.for("react.forward_ref"), d = Symbol.for("react.suspense"), h = Symbol.for("react.suspense_list"), p = Symbol.for("react.memo"), y = Symbol.for("react.lazy"), x = Symbol.for("react.offscreen"), A;
  A = Symbol.for("react.module.reference");
  function S(b) {
    if (typeof b == "object" && b !== null) {
      var E = b.$$typeof;
      switch (E) {
        case e:
          switch (b = b.type, b) {
            case r:
            case o:
            case n:
            case d:
            case h:
              return b;
            default:
              switch (b = b && b.$$typeof, b) {
                case c:
                case s:
                case f:
                case y:
                case p:
                case l:
                  return b;
                default:
                  return E;
              }
          }
        case t:
          return E;
      }
    }
  }
  return De.ContextConsumer = s, De.ContextProvider = l, De.Element = e, De.ForwardRef = f, De.Fragment = r, De.Lazy = y, De.Memo = p, De.Portal = t, De.Profiler = o, De.StrictMode = n, De.Suspense = d, De.SuspenseList = h, De.isAsyncMode = function() {
    return !1;
  }, De.isConcurrentMode = function() {
    return !1;
  }, De.isContextConsumer = function(b) {
    return S(b) === s;
  }, De.isContextProvider = function(b) {
    return S(b) === l;
  }, De.isElement = function(b) {
    return typeof b == "object" && b !== null && b.$$typeof === e;
  }, De.isForwardRef = function(b) {
    return S(b) === f;
  }, De.isFragment = function(b) {
    return S(b) === r;
  }, De.isLazy = function(b) {
    return S(b) === y;
  }, De.isMemo = function(b) {
    return S(b) === p;
  }, De.isPortal = function(b) {
    return S(b) === t;
  }, De.isProfiler = function(b) {
    return S(b) === o;
  }, De.isStrictMode = function(b) {
    return S(b) === n;
  }, De.isSuspense = function(b) {
    return S(b) === d;
  }, De.isSuspenseList = function(b) {
    return S(b) === h;
  }, De.isValidElementType = function(b) {
    return typeof b == "string" || typeof b == "function" || b === r || b === o || b === n || b === d || b === h || b === x || typeof b == "object" && b !== null && (b.$$typeof === y || b.$$typeof === p || b.$$typeof === l || b.$$typeof === s || b.$$typeof === f || b.$$typeof === A || b.getModuleId !== void 0);
  }, De.typeOf = S, De;
}
var p1;
function HB() {
  return p1 || (p1 = 1, xv.exports = UB()), xv.exports;
}
HB();
var Up = (e) => e && typeof e == "object" && "clipDot" in e ? !!e.clipDot : !0;
function m1(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function y1(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? m1(Object(r), !0).forEach(function(n) {
      KB(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : m1(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function KB(e, t, r) {
  return (t = VB(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function VB(e) {
  var t = YB(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function YB(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function CE(e, t) {
  return y1(y1({}, t), e);
}
function GB(e) {
  return /* @__PURE__ */ w.isValidElement(e) ? e.props : e;
}
function XB(e, t) {
  return /* @__PURE__ */ w.cloneElement(e, CE(GB(e), t));
}
function qB(e) {
  if ("index" in e) {
    var t = e.index;
    return typeof t == "number" || typeof t == "string" ? t : void 0;
  }
}
function QB(e) {
  return "isActive" in e && e.isActive === !0;
}
function IE(e) {
  var t = e.option, r = e.DefaultShape, n = e.shapeProps, o = e.activeClassName, l = o === void 0 ? "recharts-active-shape" : o, s = e.inActiveClassName, c = s === void 0 ? "recharts-shape" : s, f = qB(n), d;
  return /* @__PURE__ */ w.isValidElement(t) ? d = XB(t, n) : t === r ? d = /* @__PURE__ */ w.createElement(r, n) : typeof t == "function" ? d = t(n, f) : typeof t == "object" ? d = /* @__PURE__ */ w.createElement(r, CE(t, n)) : d = /* @__PURE__ */ w.createElement(r, n), QB(n) ? /* @__PURE__ */ w.createElement(or, {
    className: l
  }, d) : /* @__PURE__ */ w.createElement(or, {
    className: c
  }, d);
}
function jE(e) {
  var t = e.tooltipEntrySettings, r = rt(), n = $t(), o = w.useRef(null);
  return w.useLayoutEffect(() => {
    n || (o.current === null ? r(vR(t)) : o.current !== t && r(hR({
      prev: o.current,
      next: t
    })), o.current = t);
  }, [t, r, n]), w.useLayoutEffect(() => () => {
    o.current && (r(pR(o.current)), o.current = null);
  }, [r]), null;
}
function TE(e) {
  var t = e.legendPayload, r = rt(), n = $t(), o = w.useRef(null);
  return w.useLayoutEffect(() => {
    n || (o.current === null ? r(zT(t)) : o.current !== t && r(BT({
      prev: o.current,
      next: t
    })), o.current = t);
  }, [r, n, t]), w.useLayoutEffect(() => () => {
    o.current && (r(FT(o.current)), o.current = null);
  }, [r]), null;
}
function ZB(e, t) {
  return rF(e) || tF(e, t) || eF(e, t) || JB();
}
function JB() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function eF(e, t) {
  if (e) {
    if (typeof e == "string") return g1(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? g1(e, t) : void 0;
  }
}
function g1(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function tF(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, o, l, s, c = [], f = !0, d = !1;
    try {
      if (l = (r = r.call(e)).next, t !== 0) for (; !(f = (n = l.call(r)).done) && (c.push(n.value), c.length !== t); f = !0) ;
    } catch (h) {
      d = !0, o = h;
    } finally {
      try {
        if (!f && r.return != null && (s = r.return(), Object(s) !== s)) return;
      } finally {
        if (d) throw o;
      }
    }
    return c;
  }
}
function rF(e) {
  if (Array.isArray(e)) return e;
}
var Kc = "index", nF = "append";
function Hp(e, t) {
  var r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : [], n = [];
  for (var o of r)
    n.push({
      status: "removed",
      prev: o
    });
  for (var l = 0; l < t.length; l++) {
    var s = e[l], c = t[l];
    s != null ? n.push({
      status: "matched",
      prev: s,
      next: c
    }) : n.push({
      status: "added",
      next: c
    });
  }
  return n;
}
function iF(e, t) {
  var r = e.length / t.length, n = t.map((o, l) => e[Math.floor(l * r)]);
  return Hp(n, t);
}
function aF(e, t) {
  var r = t.map((n, o) => e[o]);
  return Hp(r, t);
}
function oF(e, t) {
  for (var r = /* @__PURE__ */ new Map(), n = 0; n < e.length; n++) {
    var o = e[n];
    if (o != null) {
      var l = t(o, n);
      l != null && !r.has(l) && r.set(l, o);
    }
  }
  return r;
}
function lF(e, t, r) {
  var n = oF(e, r), o = /* @__PURE__ */ new Set(), l = t.map((p, y) => {
    var x = r(p, y);
    if (x != null) {
      var A = n.get(x);
      if (A !== void 0)
        return o.add(x), A;
    }
  }), s = [];
  for (var c of n) {
    var f = ZB(c, 2), d = f[0], h = f[1];
    o.has(d) || s.push(h);
  }
  return Hp(l, t, s);
}
function sh(e, t, r) {
  return t == null ? null : e == null ? t.map((n) => ({
    status: "added",
    next: n
  })) : r === Kc ? iF(e, t) : r === nF ? aF(e, t) : lF(e, t, r);
}
function NE(e, t) {
  var r = w.useRef(e), n = w.useRef(t.current), o = w.useRef(!0);
  r.current !== e && (r.current = e, n.current = t.current, o.current = !1);
  var l = w.useCallback(function(s, c) {
    var f = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0;
    if (c === 0) {
      o.current = !0;
      return;
    }
    c === 1 && (n.current = s), c > 0 && o.current && f && (t.current = s);
  }, [t]);
  return {
    startValue: n.current,
    syncStepValue: l
  };
}
function uF(e, t) {
  return dF(e) || fF(e, t) || cF(e, t) || sF();
}
function sF() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function cF(e, t) {
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
function fF(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, o, l, s, c = [], f = !0, d = !1;
    try {
      if (l = (r = r.call(e)).next, t !== 0) for (; !(f = (n = l.call(r)).done) && (c.push(n.value), c.length !== t); f = !0) ;
    } catch (h) {
      d = !0, o = h;
    } finally {
      try {
        if (!f && r.return != null && (s = r.return(), Object(s) !== s)) return;
      } finally {
        if (d) throw o;
      }
    }
    return c;
  }
}
function dF(e) {
  if (Array.isArray(e)) return e;
}
function ME(e, t) {
  var r = w.useState(!1), n = uF(r, 2), o = n[0], l = n[1], s = w.useCallback(() => {
    typeof e == "function" && e(), l(!0);
  }, [e]), c = w.useCallback(() => {
    typeof t == "function" && t(), l(!1);
  }, [t]);
  return {
    isAnimating: o,
    handleAnimationStart: s,
    handleAnimationEnd: c
  };
}
function DE(e) {
  var t, r = e.animationInput, n = e.animationIdPrefix, o = e.items, l = e.previousItemsRef, s = e.isAnimationActive, c = e.animationBegin, f = e.animationDuration, d = e.animationEasing, h = e.onAnimationStart, p = e.onAnimationEnd, y = e.animationInterpolateFn, x = e.animationMatchBy, A = e.shouldUpdatePreviousRef, S = e.children, b = e.layout, E = YS(r, n), k = NE(E, l), C = (t = k.startValue) !== null && t !== void 0 ? t : null, j = sh(C, o, x ?? Kc);
  return /* @__PURE__ */ w.createElement(VS, {
    animationId: E,
    begin: c,
    duration: f,
    isActive: s,
    easing: d,
    onAnimationEnd: p,
    onAnimationStart: h,
    key: E
  }, (T) => {
    var O = C == null, _ = o == null ? o : y(j, T, b), F = A ? A(T) : T > 0;
    return k.syncStepValue(_, T, F), _ == null ? null : S(_, T, O);
  });
}
var wv;
function vF(e, t) {
  return yF(e) || mF(e, t) || pF(e, t) || hF();
}
function hF() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function pF(e, t) {
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
function mF(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, o, l, s, c = [], f = !0, d = !1;
    try {
      if (l = (r = r.call(e)).next, t !== 0) for (; !(f = (n = l.call(r)).done) && (c.push(n.value), c.length !== t); f = !0) ;
    } catch (h) {
      d = !0, o = h;
    } finally {
      try {
        if (!f && r.return != null && (s = r.return(), Object(s) !== s)) return;
      } finally {
        if (d) throw o;
      }
    }
    return c;
  }
}
function yF(e) {
  if (Array.isArray(e)) return e;
}
var gF = () => {
  var e = w.useState(() => il("uid-")), t = vF(e, 1), r = t[0];
  return r;
}, $E = (wv = B_.useId) !== null && wv !== void 0 ? wv : gF;
function xF(e, t) {
  var r = $E();
  return t || (e ? "".concat(e, "-").concat(r) : r);
}
var wF = /* @__PURE__ */ w.createContext(void 0), LE = (e) => {
  var t = e.id, r = e.type, n = e.children, o = xF("recharts-".concat(r), t);
  return /* @__PURE__ */ w.createElement(wF.Provider, {
    value: o
  }, n(o));
}, bF = {
  cartesianItems: [],
  polarItems: []
}, RE = Dt({
  name: "graphicalItems",
  initialState: bF,
  reducers: {
    addCartesianGraphicalItem: {
      reducer(e, t) {
        e.cartesianItems.push(Ne(t.payload));
      },
      prepare: Ue()
    },
    replaceCartesianGraphicalItem: {
      reducer(e, t) {
        var r = t.payload, n = r.prev, o = r.next, l = mr(e).cartesianItems.indexOf(Ne(n));
        l > -1 && (e.cartesianItems[l] = Ne(o));
      },
      prepare: Ue()
    },
    removeCartesianGraphicalItem: {
      reducer(e, t) {
        var r = mr(e).cartesianItems.indexOf(Ne(t.payload));
        r > -1 && e.cartesianItems.splice(r, 1);
      },
      prepare: Ue()
    },
    addPolarGraphicalItem: {
      reducer(e, t) {
        e.polarItems.push(Ne(t.payload));
      },
      prepare: Ue()
    },
    removePolarGraphicalItem: {
      reducer(e, t) {
        var r = mr(e).polarItems.indexOf(Ne(t.payload));
        r > -1 && e.polarItems.splice(r, 1);
      },
      prepare: Ue()
    },
    replacePolarGraphicalItem: {
      reducer(e, t) {
        var r = t.payload, n = r.prev, o = r.next, l = mr(e).polarItems.indexOf(Ne(n));
        l > -1 && (e.polarItems[l] = Ne(o));
      },
      prepare: Ue()
    }
  }
}), Xa = RE.actions, SF = Xa.addCartesianGraphicalItem, AF = Xa.replaceCartesianGraphicalItem, PF = Xa.removeCartesianGraphicalItem;
Xa.addPolarGraphicalItem;
Xa.removePolarGraphicalItem;
Xa.replacePolarGraphicalItem;
var EF = RE.reducer, OF = (e) => {
  var t = rt(), r = w.useRef(null);
  return w.useLayoutEffect(() => {
    r.current === null ? t(SF(e)) : r.current !== e && t(AF({
      prev: r.current,
      next: e
    })), r.current = e;
  }, [t, e]), w.useLayoutEffect(() => () => {
    r.current && (t(PF(r.current)), r.current = null);
  }, [t]), null;
}, zE = /* @__PURE__ */ w.memo(OF), kF = ["points"];
function b1(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function bv(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? b1(Object(r), !0).forEach(function(n) {
      _F(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : b1(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function _F(e, t, r) {
  return (t = CF(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function CF(e) {
  var t = IF(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function IF(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function qs() {
  return qs = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, qs.apply(null, arguments);
}
function jF(e, t) {
  if (e == null) return {};
  var r, n, o = TF(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (o[r] = e[r]);
  }
  return o;
}
function TF(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
function NF(e) {
  var t = e.option, r = e.dotProps, n = e.className;
  if (/* @__PURE__ */ w.isValidElement(t))
    return /* @__PURE__ */ w.cloneElement(t, r);
  if (typeof t == "function")
    return t(r);
  var o = ze(n, typeof t != "boolean" ? t.className : ""), l = r ?? {};
  l.points;
  var s = jF(l, kF);
  return /* @__PURE__ */ w.createElement(kE, qs({}, s, {
    className: o
  }));
}
function MF(e, t) {
  return e == null ? !1 : t ? !0 : e.length === 1;
}
function BE(e) {
  var t = e.points, r = e.dot, n = e.className, o = e.dotClassName, l = e.dataKey, s = e.baseProps, c = e.needClip, f = e.clipPathId, d = e.zIndex, h = d === void 0 ? Nt.scatter : d;
  if (!MF(t, r))
    return null;
  var p = Up(r), y = H_(r), x = t.map((S, b) => {
    var E, k, C = bv(bv(bv({
      r: 3
    }, s), y), {}, {
      index: b,
      cx: (E = S.x) !== null && E !== void 0 ? E : void 0,
      cy: (k = S.y) !== null && k !== void 0 ? k : void 0,
      dataKey: l,
      value: S.value,
      payload: S.payload,
      points: t
    });
    return /* @__PURE__ */ w.createElement(NF, {
      key: "dot-".concat(b),
      option: r,
      dotProps: C,
      className: o
    });
  }), A = {};
  return c && f != null && (A.clipPath = "url(#clipPath-".concat(p ? "" : "dots-").concat(f, ")")), /* @__PURE__ */ w.createElement(rn, {
    zIndex: h
  }, /* @__PURE__ */ w.createElement(or, qs({
    className: n
  }, A), x));
}
function S1(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function is(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? S1(Object(r), !0).forEach(function(n) {
      DF(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : S1(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function DF(e, t, r) {
  return (t = $F(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function $F(e) {
  var t = LF(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function LF(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var FE = 0, RF = {
  xAxis: {},
  yAxis: {},
  zAxis: {}
}, WE = Dt({
  name: "cartesianAxis",
  initialState: RF,
  reducers: {
    addXAxis: {
      reducer(e, t) {
        e.xAxis[t.payload.id] = Ne(t.payload);
      },
      prepare: Ue()
    },
    replaceXAxis: {
      reducer(e, t) {
        var r = t.payload, n = r.prev, o = r.next;
        e.xAxis[n.id] !== void 0 && (n.id !== o.id && delete e.xAxis[n.id], e.xAxis[o.id] = Ne(o));
      },
      prepare: Ue()
    },
    removeXAxis: {
      reducer(e, t) {
        delete e.xAxis[t.payload.id];
      },
      prepare: Ue()
    },
    addYAxis: {
      reducer(e, t) {
        e.yAxis[t.payload.id] = Ne(t.payload);
      },
      prepare: Ue()
    },
    replaceYAxis: {
      reducer(e, t) {
        var r = t.payload, n = r.prev, o = r.next;
        e.yAxis[n.id] !== void 0 && (n.id !== o.id && delete e.yAxis[n.id], e.yAxis[o.id] = Ne(o));
      },
      prepare: Ue()
    },
    removeYAxis: {
      reducer(e, t) {
        delete e.yAxis[t.payload.id];
      },
      prepare: Ue()
    },
    addZAxis: {
      reducer(e, t) {
        e.zAxis[t.payload.id] = Ne(t.payload);
      },
      prepare: Ue()
    },
    replaceZAxis: {
      reducer(e, t) {
        var r = t.payload, n = r.prev, o = r.next;
        e.zAxis[n.id] !== void 0 && (n.id !== o.id && delete e.zAxis[n.id], e.zAxis[o.id] = Ne(o));
      },
      prepare: Ue()
    },
    removeZAxis: {
      reducer(e, t) {
        delete e.zAxis[t.payload.id];
      },
      prepare: Ue()
    },
    updateYAxisWidth(e, t) {
      var r = t.payload, n = r.id, o = r.width, l = e.yAxis[n];
      if (l) {
        var s, c = l.widthHistory || [];
        if (c.length === 3 && c[0] === c[2] && o === c[1] && o !== l.width && Math.abs(o - ((s = c[0]) !== null && s !== void 0 ? s : 0)) <= 1)
          return;
        var f = [...c, o].slice(-3);
        e.yAxis[n] = is(is({}, l), {}, {
          width: o,
          widthHistory: f
        });
      }
    },
    updateXAxisHeight(e, t) {
      var r = t.payload, n = r.id, o = r.height, l = e.xAxis[n];
      if (l) {
        var s, c = l.heightHistory || [];
        if (c.length === 3 && c[0] === c[2] && o === c[1] && o !== l.height && Math.abs(o - ((s = c[0]) !== null && s !== void 0 ? s : 0)) <= 1)
          return;
        var f = [...c, o].slice(-3);
        e.xAxis[n] = is(is({}, l), {}, {
          height: o,
          heightHistory: f
        });
      }
    }
  }
}), Rr = WE.actions, zF = Rr.addXAxis, BF = Rr.replaceXAxis, FF = Rr.removeXAxis, WF = Rr.addYAxis, UF = Rr.replaceYAxis, HF = Rr.removeYAxis;
Rr.addZAxis;
Rr.replaceZAxis;
Rr.removeZAxis;
var KF = Rr.updateYAxisWidth, VF = Rr.updateXAxisHeight, YF = WE.reducer, GF = z([Et], (e) => ({
  top: e.top,
  bottom: e.bottom,
  left: e.left,
  right: e.right
})), XF = z([GF, Pn, En], (e, t, r) => {
  if (!(!e || t == null || r == null))
    return {
      x: e.left,
      y: e.top,
      width: Math.max(0, t - e.left - e.right),
      height: Math.max(0, r - e.top - e.bottom)
    };
}), Vc = () => he(XF), qF = () => he(vz);
function A1(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Sv(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? A1(Object(r), !0).forEach(function(n) {
      QF(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : A1(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function QF(e, t, r) {
  return (t = ZF(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function ZF(e) {
  var t = JF(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function JF(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var e4 = (e) => {
  var t = e.point, r = e.childIndex, n = e.mainColor, o = e.activeDot, l = e.dataKey, s = e.clipPath;
  if (o === !1 || t.x == null || t.y == null)
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
  }, f = Sv(Sv(Sv({}, c), ic(o)), Ph(o)), d;
  return /* @__PURE__ */ w.isValidElement(o) ? d = /* @__PURE__ */ w.cloneElement(o, f) : typeof o == "function" ? d = o(f) : d = /* @__PURE__ */ w.createElement(kE, f), /* @__PURE__ */ w.createElement(or, {
    className: "recharts-active-dot",
    clipPath: s
  }, d);
};
function ch(e) {
  var t = e.points, r = e.mainColor, n = e.activeDot, o = e.itemDataKey, l = e.clipPath, s = e.zIndex, c = s === void 0 ? Nt.activeDot : s, f = he(hl), d = qF();
  if (t == null || d == null)
    return null;
  var h = t.find((p) => d.includes(p.payload));
  return st(h) ? null : /* @__PURE__ */ w.createElement(rn, {
    zIndex: c
  }, /* @__PURE__ */ w.createElement(e4, {
    point: h,
    childIndex: Number(f),
    mainColor: r,
    dataKey: o,
    activeDot: n,
    clipPath: l
  }));
}
var t4 = (e) => {
  var t = e.chartData, r = rt(), n = $t();
  return w.useEffect(() => n ? () => {
  } : (r(Vw(t)), () => {
    r(Vw(void 0));
  }), [t, r, n]), null;
}, P1 = {
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
}, UE = Dt({
  name: "brush",
  initialState: P1,
  reducers: {
    setBrushSettings(e, t) {
      return t.payload == null ? P1 : t.payload;
    }
  }
});
UE.actions.setBrushSettings;
var r4 = UE.reducer;
function n4(e) {
  return (e % 180 + 180) % 180;
}
var i4 = function(t) {
  var r = t.width, n = t.height, o = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0, l = n4(o), s = l * Math.PI / 180, c = Math.atan(n / r), f = s > c && s < Math.PI - c ? n / Math.sin(s) : r / Math.cos(s);
  return Math.abs(f);
}, a4 = {
  dots: [],
  areas: [],
  lines: []
}, HE = Dt({
  name: "referenceElements",
  initialState: a4,
  reducers: {
    addDot: (e, t) => {
      e.dots.push(t.payload);
    },
    removeDot: (e, t) => {
      var r = mr(e).dots.findIndex((n) => n === t.payload);
      r !== -1 && e.dots.splice(r, 1);
    },
    addArea: (e, t) => {
      e.areas.push(t.payload);
    },
    removeArea: (e, t) => {
      var r = mr(e).areas.findIndex((n) => n === t.payload);
      r !== -1 && e.areas.splice(r, 1);
    },
    addLine: (e, t) => {
      e.lines.push(Ne(t.payload));
    },
    removeLine: (e, t) => {
      var r = mr(e).lines.findIndex((n) => n === t.payload);
      r !== -1 && e.lines.splice(r, 1);
    }
  }
}), qa = HE.actions;
qa.addDot;
qa.removeDot;
qa.addArea;
qa.removeArea;
qa.addLine;
qa.removeLine;
var o4 = HE.reducer;
function l4(e, t) {
  return f4(e) || c4(e, t) || s4(e, t) || u4();
}
function u4() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function s4(e, t) {
  if (e) {
    if (typeof e == "string") return E1(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? E1(e, t) : void 0;
  }
}
function E1(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function c4(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, o, l, s, c = [], f = !0, d = !1;
    try {
      if (l = (r = r.call(e)).next, t !== 0) for (; !(f = (n = l.call(r)).done) && (c.push(n.value), c.length !== t); f = !0) ;
    } catch (h) {
      d = !0, o = h;
    } finally {
      try {
        if (!f && r.return != null && (s = r.return(), Object(s) !== s)) return;
      } finally {
        if (d) throw o;
      }
    }
    return c;
  }
}
function f4(e) {
  if (Array.isArray(e)) return e;
}
var d4 = /* @__PURE__ */ w.createContext(void 0), v4 = (e) => {
  var t = e.children, r = w.useState("".concat(il("recharts"), "-clip")), n = l4(r, 1), o = n[0], l = Vc();
  if (l == null)
    return null;
  var s = l.x, c = l.y, f = l.width, d = l.height;
  return /* @__PURE__ */ w.createElement(d4.Provider, {
    value: o
  }, /* @__PURE__ */ w.createElement("defs", null, /* @__PURE__ */ w.createElement("clipPath", {
    id: o
  }, /* @__PURE__ */ w.createElement("rect", {
    x: s,
    y: c,
    height: d,
    width: f
  }))), t);
};
function h4() {
}
function O1(e) {
  if (!e || typeof e != "object") return !1;
  const t = Object.getPrototypeOf(e);
  return t === null || t === Object.prototype || Object.getPrototypeOf(t) === null ? Object.prototype.toString.call(e) === "[object Object]" : !1;
}
function p4(e, t, r) {
  return Qo(e, t, void 0, void 0, void 0, void 0, r);
}
function Qo(e, t, r, n, o, l, s) {
  const c = s(e, t, r, n, o, l);
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
      return rl(e, t, l, s);
  }
  return rl(e, t, l, s);
}
function rl(e, t, r, n) {
  if (Object.is(e, t)) return !0;
  let o = ja(e), l = ja(t);
  if (o === "[object Arguments]" && (o = ls), l === "[object Arguments]" && (l = ls), o !== l) return !1;
  switch (o) {
    case Oh:
      return e.toString() === t.toString();
    case kh:
      return Zo(e.valueOf(), t.valueOf());
    case _h:
    case Ib:
    case Cb:
      return Object.is(e.valueOf(), t.valueOf());
    case kb:
      return e.source === t.source && e.flags === t.flags;
    case FC:
      return e === t;
  }
  r = r ?? /* @__PURE__ */ new Map();
  const s = r.get(e), c = r.get(t);
  if (s != null && c != null) return s === t;
  r.set(e, t), r.set(t, e);
  try {
    switch (o) {
      case jb:
        if (e.size !== t.size) return !1;
        for (const [f, d] of e.entries()) if (!t.has(f) || !Qo(d, t.get(f), f, e, t, r, n)) return !1;
        return !0;
      case Tb: {
        if (e.size !== t.size) return !1;
        const f = Array.from(e.values()), d = Array.from(t.values());
        for (let h = 0; h < f.length; h++) {
          const p = f[h], y = d.findIndex((x) => Qo(p, x, void 0, e, t, r, n));
          if (y === -1) return !1;
          d.splice(y, 1);
        }
        return !0;
      }
      case Nb:
      case $b:
      case Lb:
      case Rb:
      case zb:
      case UC:
      case Bb:
      case Fb:
      case Wb:
      case HC:
      case Ub:
      case Hb:
        if (Mv(e) !== Mv(t) || e.length !== t.length) return !1;
        for (let f = 0; f < e.length; f++) if (!Qo(e[f], t[f], f, e, t, r, n)) return !1;
        return !0;
      case Mb:
        return e.byteLength !== t.byteLength ? !1 : rl(new Uint8Array(e), new Uint8Array(t), r, n);
      case Db:
        return e.byteLength !== t.byteLength || e.byteOffset !== t.byteOffset ? !1 : rl(new Uint8Array(e), new Uint8Array(t), r, n);
      case WC:
        return e.name === t.name && e.message === t.message;
      case ls: {
        if (!(rl(e.constructor, t.constructor, r, n) || O1(e) && O1(t))) return !1;
        const f = [...Object.keys(e), ...Nv(e)], d = [...Object.keys(t), ...Nv(t)];
        if (f.length !== d.length) return !1;
        for (let h = 0; h < f.length; h++) {
          const p = f[h], y = e[p];
          if (!Object.hasOwn(t, p)) return !1;
          const x = t[p];
          if (!Qo(y, x, p, e, t, r, n)) return !1;
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
function m4(e, t) {
  return p4(e, t, h4);
}
function KE(e, t) {
  if (t < 1)
    return [];
  if (t === 1)
    return e;
  for (var r = [], n = 0; n < e.length; n += t) {
    var o = e[n];
    o !== void 0 && r.push(o);
  }
  return r;
}
function y4(e, t, r) {
  var n = {
    width: e.width + t.width,
    height: e.height + t.height
  };
  return i4(n, r);
}
function g4(e, t, r) {
  var n = r === "width", o = e.x, l = e.y, s = e.width, c = e.height;
  return t === 1 ? {
    start: n ? o : l,
    end: n ? o + s : l + c
  } : {
    start: n ? o + s : l + c,
    end: n ? o : l
  };
}
function ml(e, t, r, n, o) {
  if (e * t < e * n || e * t > e * o)
    return !1;
  var l = r();
  return e * (t - e * l / 2 - n) >= 0 && e * (t + e * l / 2 - o) <= 0;
}
function x4(e, t) {
  return KE(e, t + 1);
}
function w4(e, t, r, n, o) {
  for (var l = (n || []).slice(), s = t.start, c = t.end, f = 0, d = 1, h = s, p = function() {
    var A = n == null ? void 0 : n[f];
    if (A === void 0)
      return {
        v: KE(n, d)
      };
    var S = f, b, E = () => (b === void 0 && (b = r(A, S)), b), k = A.coordinate, C = f === 0 || ml(e, k, E, h, c);
    C || (f = 0, h = s, d += 1), C && (h = k + e * (E() / 2 + o), f += d);
  }, y; d <= l.length; )
    if (y = p(), y) return y.v;
  return [];
}
function b4(e, t, r, n, o) {
  var l = (n || []).slice(), s = l.length;
  if (s === 0)
    return [];
  for (var c = t.start, f = t.end, d = 1; d <= s; d++) {
    for (var h = (s - 1) % d, p = c, y = !0, x = function() {
      var j = n[S];
      if (j == null)
        return 0;
      var T = S, O, _ = () => (O === void 0 && (O = r(j, T)), O), F = j.coordinate, K = S === h || ml(e, F, _, p, f);
      if (!K)
        return y = !1, 1;
      K && (p = F + e * (_() / 2 + o));
    }, A, S = h; S < s && (A = x(), !(A !== 0 && A === 1)); S += d)
      ;
    if (y) {
      for (var b = [], E = h; E < s; E += d) {
        var k = n[E];
        k != null && b.push(k);
      }
      return b;
    }
  }
  return [];
}
function k1(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function jt(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? k1(Object(r), !0).forEach(function(n) {
      S4(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : k1(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function S4(e, t, r) {
  return (t = A4(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function A4(e) {
  var t = P4(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function P4(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function E4(e, t, r, n, o) {
  for (var l = (n || []).slice(), s = l.length, c = t.start, f = t.end, d = function(y) {
    var x = l[y];
    if (x == null)
      return 1;
    var A = x, S, b = () => (S === void 0 && (S = r(x, y)), S);
    if (y === s - 1) {
      var E = e * (A.coordinate + e * b() / 2 - f);
      l[y] = A = jt(jt({}, A), {}, {
        tickCoord: E > 0 ? A.coordinate - E * e : A.coordinate
      });
    } else
      l[y] = A = jt(jt({}, A), {}, {
        tickCoord: A.coordinate
      });
    if (A.tickCoord != null) {
      var k = ml(e, A.tickCoord, b, c, f);
      k && (f = A.tickCoord - e * (b() / 2 + o), l[y] = jt(jt({}, A), {}, {
        isShow: !0
      }));
    }
  }, h = s - 1; h >= 0; h--)
    d(h);
  return l;
}
function O4(e, t, r, n, o, l) {
  var s = (n || []).slice(), c = s.length, f = t.start, d = t.end;
  if (l) {
    var h = n[c - 1];
    if (h != null) {
      var p = r(h, c - 1), y = e * (h.coordinate + e * p / 2 - d);
      if (s[c - 1] = h = jt(jt({}, h), {}, {
        tickCoord: y > 0 ? h.coordinate - y * e : h.coordinate
      }), h.tickCoord != null) {
        var x = ml(e, h.tickCoord, () => p, f, d);
        x && (d = h.tickCoord - e * (p / 2 + o), s[c - 1] = jt(jt({}, h), {}, {
          isShow: !0
        }));
      }
    }
  }
  for (var A = l ? c - 1 : c, S = function(k) {
    var C = s[k];
    if (C == null)
      return 1;
    var j = C, T, O = () => (T === void 0 && (T = r(C, k)), T);
    if (k === 0) {
      var _ = e * (j.coordinate - e * O() / 2 - f);
      s[k] = j = jt(jt({}, j), {}, {
        tickCoord: _ < 0 ? j.coordinate - _ * e : j.coordinate
      });
    } else
      s[k] = j = jt(jt({}, j), {}, {
        tickCoord: j.coordinate
      });
    if (j.tickCoord != null) {
      var F = ml(e, j.tickCoord, O, f, d);
      F && (f = j.tickCoord + e * (O() / 2 + o), s[k] = jt(jt({}, j), {}, {
        isShow: !0
      }));
    }
  }, b = 0; b < A; b++)
    S(b);
  return s;
}
function Kp(e, t, r) {
  var n = e.tick, o = e.ticks, l = e.viewBox, s = e.minTickGap, c = e.orientation, f = e.interval, d = e.tickFormatter, h = e.unit, p = e.angle;
  if (!o || !o.length || !n)
    return [];
  if (le(f) || Al.isSsr) {
    var y;
    return (y = x4(o, le(f) ? f : 0)) !== null && y !== void 0 ? y : [];
  }
  var x = [], A = c === "top" || c === "bottom" ? "width" : "height", S = h && A === "width" ? tl(h, {
    fontSize: t,
    letterSpacing: r
  }) : {
    width: 0,
    height: 0
  }, b = (T, O) => {
    var _ = typeof d == "function" ? d(T.value, O) : T.value;
    return A === "width" ? y4(tl(_, {
      fontSize: t,
      letterSpacing: r
    }), S, p) : tl(_, {
      fontSize: t,
      letterSpacing: r
    })[A];
  }, E = o[0], k = o[1], C = o.length >= 2 && E != null && k != null ? pr(k.coordinate - E.coordinate) : 1, j = g4(l, C, A);
  return f === "equidistantPreserveStart" ? w4(C, j, b, o, s) : f === "equidistantPreserveEnd" ? b4(C, j, b, o, s) : (f === "preserveStart" || f === "preserveStartEnd" ? x = O4(C, j, b, o, s, f === "preserveStartEnd") : x = E4(C, j, b, o, s), x.filter((T) => T.isShow));
}
var k4 = (e) => {
  var t = e.ticks, r = e.label, n = e.labelGapWithTick, o = n, l = e.tickSize, s = l === void 0 ? 0 : l, c = e.tickMargin, f = c === void 0 ? 0 : c, d = 0;
  if (t) {
    Array.from(t).forEach((x) => {
      if (x) {
        var A = x.getBoundingClientRect();
        A.width > d && (d = A.width);
      }
    });
    var h = r ? r.getBoundingClientRect().width : 0, p = s + f, y = d + p + h + (r ? o : 0);
    return Math.round(y);
  }
  return 0;
}, _4 = (e) => {
  var t = e.ticks, r = e.label, n = e.labelGapWithTick, o = n, l = e.tickSize, s = l === void 0 ? 0 : l, c = e.tickMargin, f = c === void 0 ? 0 : c, d = 0;
  if (t) {
    Array.from(t).forEach((x) => {
      if (x) {
        var A = x.getBoundingClientRect();
        A.height > d && (d = A.height);
      }
    });
    var h = r ? r.getBoundingClientRect().height : 0, p = s + f, y = d + p + h + (r ? o : 0);
    return Math.round(y);
  }
  return 0;
}, C4 = {
  xAxis: {},
  yAxis: {}
}, VE = Dt({
  name: "renderedTicks",
  initialState: C4,
  reducers: {
    setRenderedTicks: (e, t) => {
      var r = t.payload, n = r.axisType, o = r.axisId, l = r.ticks;
      e[n][o] = Ne(l);
    },
    removeRenderedTicks: (e, t) => {
      var r = t.payload, n = r.axisType, o = r.axisId;
      delete e[n][o];
    }
  }
}), YE = VE.actions, I4 = YE.setRenderedTicks, j4 = YE.removeRenderedTicks, T4 = VE.reducer, N4 = ["axisLine", "width", "height", "className", "hide", "ticks", "axisType", "axisId"];
function _1(e, t) {
  return L4(e) || $4(e, t) || D4(e, t) || M4();
}
function M4() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function D4(e, t) {
  if (e) {
    if (typeof e == "string") return C1(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? C1(e, t) : void 0;
  }
}
function C1(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function $4(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, o, l, s, c = [], f = !0, d = !1;
    try {
      if (l = (r = r.call(e)).next, t !== 0) for (; !(f = (n = l.call(r)).done) && (c.push(n.value), c.length !== t); f = !0) ;
    } catch (h) {
      d = !0, o = h;
    } finally {
      try {
        if (!f && r.return != null && (s = r.return(), Object(s) !== s)) return;
      } finally {
        if (d) throw o;
      }
    }
    return c;
  }
}
function L4(e) {
  if (Array.isArray(e)) return e;
}
function R4(e, t) {
  if (e == null) return {};
  var r, n, o = z4(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (o[r] = e[r]);
  }
  return o;
}
function z4(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
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
function I1(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Qe(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? I1(Object(r), !0).forEach(function(n) {
      B4(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : I1(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function B4(e, t, r) {
  return (t = F4(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function F4(e) {
  var t = W4(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function W4(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var xn = {
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
  zIndex: Nt.axis
};
function U4(e) {
  var t = e.x, r = e.y, n = e.width, o = e.height, l = e.orientation, s = e.mirror, c = e.axisLine, f = e.otherSvgProps;
  if (!c)
    return null;
  var d = Qe(Qe(Qe({}, f), gr(c)), {}, {
    fill: "none"
  });
  if (l === "top" || l === "bottom") {
    var h = +(l === "top" && !s || l === "bottom" && s);
    d = Qe(Qe({}, d), {}, {
      x1: t,
      y1: r + h * o,
      x2: t + n,
      y2: r + h * o
    });
  } else {
    var p = +(l === "left" && !s || l === "right" && s);
    d = Qe(Qe({}, d), {}, {
      x1: t + p * n,
      y1: r,
      x2: t + p * n,
      y2: r + o
    });
  }
  return /* @__PURE__ */ w.createElement("line", zi({}, d, {
    className: ze("recharts-cartesian-axis-line", Bi(c, "className"))
  }));
}
function H4(e, t, r, n, o, l, s, c, f) {
  var d, h, p, y, x, A, S = c ? -1 : 1, b = e.tickSize || s, E = le(e.tickCoord) ? e.tickCoord : e.coordinate;
  switch (l) {
    case "top":
      d = h = e.coordinate, y = r + +!c * o, p = y - S * b, A = p - S * f, x = E;
      break;
    case "left":
      p = y = e.coordinate, h = t + +!c * n, d = h - S * b, x = d - S * f, A = E;
      break;
    case "right":
      p = y = e.coordinate, h = t + +c * n, d = h + S * b, x = d + S * f, A = E;
      break;
    default:
      d = h = e.coordinate, y = r + +c * o, p = y + S * b, A = p + S * f, x = E;
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
      x,
      y: A
    }
  };
}
function K4(e, t) {
  switch (e) {
    case "left":
      return t ? "start" : "end";
    case "right":
      return t ? "end" : "start";
    default:
      return "middle";
  }
}
function V4(e, t) {
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
function Y4(e) {
  var t = e.option, r = e.tickProps, n = e.value, o, l = ze(r.className, "recharts-cartesian-axis-tick-value");
  if (/* @__PURE__ */ w.isValidElement(t))
    o = /* @__PURE__ */ w.cloneElement(t, Qe(Qe({}, r), {}, {
      className: l
    }));
  else if (typeof t == "function")
    o = t(Qe(Qe({}, r), {}, {
      className: l
    }));
  else {
    var s = "recharts-cartesian-axis-tick-value";
    typeof t != "boolean" && (s = ze(s, WB(t))), o = /* @__PURE__ */ w.createElement(Wp, zi({}, r, {
      className: s
    }), n);
  }
  return o;
}
function G4(e) {
  var t = e.ticks, r = e.axisType, n = e.axisId, o = rt(), l = w.useRef(null);
  return w.useEffect(() => {
    if (!(n == null || r == null)) {
      var s = t.map((f) => ({
        value: f.value,
        coordinate: f.coordinate,
        offset: f.offset,
        index: f.index
      })), c = l.current;
      c != null && c.axisId === n && c.axisType === r && m4(c.ticks, s) || (l.current = {
        ticks: s,
        axisId: n,
        axisType: r
      }, o(I4({
        ticks: s,
        axisId: n,
        axisType: r
      })));
    }
  }, [o, t, n, r]), w.useEffect(() => n == null || r == null ? Fi : () => {
    o(j4({
      axisId: n,
      axisType: r
    }));
  }, [o, n, r]), null;
}
var X4 = /* @__PURE__ */ w.forwardRef((e, t) => {
  var r = e.ticks, n = r === void 0 ? [] : r, o = e.tick, l = e.tickLine, s = e.stroke, c = e.tickFormatter, f = e.unit, d = e.padding, h = e.tickTextProps, p = e.orientation, y = e.mirror, x = e.x, A = e.y, S = e.width, b = e.height, E = e.tickSize, k = e.tickMargin, C = e.fontSize, j = e.letterSpacing, T = e.getTicksConfig, O = e.events, _ = e.axisType, F = e.axisId, K = Kp(Qe(Qe({}, T), {}, {
    ticks: n
  }), C, j), V = gr(T), q = ic(o), W = yE(V.textAnchor) ? V.textAnchor : K4(p, y), ie = V4(p, y), re = {};
  typeof l == "object" && (re = l);
  var we = Qe(Qe({}, V), {}, {
    fill: "none"
  }, re), ve = K.map((te) => Qe({
    entry: te
  }, H4(te, x, A, S, b, p, E, y, k))), ae = ve.map((te) => {
    var Y = te.entry, $ = te.line;
    return /* @__PURE__ */ w.createElement(or, {
      className: "recharts-cartesian-axis-tick",
      key: "tick-".concat(Y.value, "-").concat(Y.coordinate, "-").concat(Y.tickCoord)
    }, l && /* @__PURE__ */ w.createElement("line", zi({}, we, $, {
      className: ze("recharts-cartesian-axis-tick-line", Bi(l, "className"))
    })));
  }), U = ve.map((te, Y) => {
    var $, H, fe = te.entry, ge = te.tick, Ae = Qe(Qe(Qe(Qe({
      verticalAnchor: ie
    }, V), {}, {
      textAnchor: W,
      stroke: "none",
      fill: s
    }, ge), {}, {
      index: Y,
      payload: fe,
      visibleTicksCount: K.length,
      tickFormatter: c,
      padding: d
    }, h), {}, {
      angle: ($ = (H = h == null ? void 0 : h.angle) !== null && H !== void 0 ? H : V.angle) !== null && $ !== void 0 ? $ : 0
    }), Pe = Qe(Qe({}, Ae), q);
    return /* @__PURE__ */ w.createElement(or, zi({
      className: "recharts-cartesian-axis-tick-label",
      key: "tick-label-".concat(fe.value, "-").concat(fe.coordinate, "-").concat(fe.tickCoord)
    }, jC(O, fe, Y)), o && /* @__PURE__ */ w.createElement(Y4, {
      option: o,
      tickProps: Pe,
      value: "".concat(typeof c == "function" ? c(fe.value, Y) : fe.value).concat(f || "")
    }));
  });
  return /* @__PURE__ */ w.createElement("g", {
    className: "recharts-cartesian-axis-ticks recharts-".concat(_, "-ticks")
  }, /* @__PURE__ */ w.createElement(G4, {
    ticks: K,
    axisId: F,
    axisType: _
  }), U.length > 0 && /* @__PURE__ */ w.createElement(rn, {
    zIndex: Nt.label
  }, /* @__PURE__ */ w.createElement("g", {
    className: "recharts-cartesian-axis-tick-labels recharts-".concat(_, "-tick-labels"),
    ref: t
  }, U)), ae.length > 0 && /* @__PURE__ */ w.createElement("g", {
    className: "recharts-cartesian-axis-tick-lines recharts-".concat(_, "-tick-lines")
  }, ae));
}), q4 = /* @__PURE__ */ w.forwardRef((e, t) => {
  var r = e.axisLine, n = e.width, o = e.height, l = e.className, s = e.hide, c = e.ticks, f = e.axisType, d = e.axisId, h = R4(e, N4), p = w.useState(""), y = _1(p, 2), x = y[0], A = y[1], S = w.useState(""), b = _1(S, 2), E = b[0], k = b[1], C = w.useRef(null);
  w.useImperativeHandle(t, () => ({
    getCalculatedWidth: () => {
      var T;
      return k4({
        ticks: C.current,
        label: (T = e.labelRef) === null || T === void 0 ? void 0 : T.current,
        labelGapWithTick: 5,
        tickSize: e.tickSize,
        tickMargin: e.tickMargin
      });
    },
    getCalculatedHeight: () => {
      var T;
      return _4({
        ticks: C.current,
        label: (T = e.labelRef) === null || T === void 0 ? void 0 : T.current,
        labelGapWithTick: 5,
        tickSize: e.tickSize,
        tickMargin: e.tickMargin
      });
    }
  }));
  var j = w.useCallback((T) => {
    if (T) {
      var O = T.getElementsByClassName("recharts-cartesian-axis-tick-value");
      C.current = O;
      var _ = O[0];
      if (_) {
        var F = window.getComputedStyle(_), K = F.fontSize, V = F.letterSpacing;
        (K !== x || V !== E) && (A(K), k(V));
      }
    }
  }, [x, E]);
  return s || n != null && n <= 0 || o != null && o <= 0 ? null : /* @__PURE__ */ w.createElement(rn, {
    zIndex: e.zIndex
  }, /* @__PURE__ */ w.createElement(or, {
    className: ze("recharts-cartesian-axis", l)
  }, /* @__PURE__ */ w.createElement(U4, {
    x: e.x,
    y: e.y,
    width: n,
    height: o,
    orientation: e.orientation,
    mirror: e.mirror,
    axisLine: r,
    otherSvgProps: gr(e)
  }), /* @__PURE__ */ w.createElement(X4, {
    ref: j,
    axisType: f,
    events: h,
    fontSize: x,
    getTicksConfig: e,
    height: e.height,
    letterSpacing: E,
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
  }), /* @__PURE__ */ w.createElement(AB, {
    x: e.x,
    y: e.y,
    width: e.width,
    height: e.height,
    lowerWidth: e.width,
    upperWidth: e.width
  }, /* @__PURE__ */ w.createElement(NB, {
    label: e.label,
    labelRef: e.labelRef
  }), e.children)));
}), Vp = /* @__PURE__ */ w.forwardRef((e, t) => {
  var r = qt(e, xn);
  return /* @__PURE__ */ w.createElement(q4, zi({}, r, {
    ref: t
  }));
});
Vp.displayName = "CartesianAxis";
var Q4 = {
  grid: {
    stroke: "#ccc",
    fill: "none"
  }
}, GE = /* @__PURE__ */ w.createContext(Q4);
GE.Provider;
var Z4 = () => w.useContext(GE), J4 = ["x1", "y1", "x2", "y2", "key"], e8 = ["offset"], t8 = ["xAxisId", "yAxisId"], r8 = ["xAxisId", "yAxisId"];
function j1(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Tt(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? j1(Object(r), !0).forEach(function(n) {
      n8(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : j1(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function n8(e, t, r) {
  return (t = i8(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function i8(e) {
  var t = a8(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function a8(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function Ii() {
  return Ii = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Ii.apply(null, arguments);
}
function Qs(e, t) {
  if (e == null) return {};
  var r, n, o = o8(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (o[r] = e[r]);
  }
  return o;
}
function o8(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
var l8 = (e) => {
  var t = e.fill;
  if (!t || t === "none")
    return null;
  var r = e.fillOpacity, n = e.x, o = e.y, l = e.width, s = e.height, c = e.ry;
  return /* @__PURE__ */ w.createElement("rect", {
    x: n,
    y: o,
    ry: c,
    width: l,
    height: s,
    stroke: "none",
    fill: t,
    fillOpacity: r,
    className: "recharts-cartesian-grid-bg"
  });
};
function XE(e) {
  var t = e.option, r = e.lineItemProps, n;
  if (/* @__PURE__ */ w.isValidElement(t))
    n = /* @__PURE__ */ w.cloneElement(t, r);
  else if (typeof t == "function")
    n = t(r);
  else {
    var o, l = r.x1, s = r.y1, c = r.x2, f = r.y2, d = r.key, h = Qs(r, J4), p = (o = gr(h)) !== null && o !== void 0 ? o : {};
    p.offset;
    var y = Qs(p, e8), x = Array.isArray(y.strokeDasharray) ? y.strokeDasharray.join(",") : y.strokeDasharray;
    n = /* @__PURE__ */ w.createElement("line", Ii({}, y, {
      strokeDasharray: x,
      x1: l,
      y1: s,
      x2: c,
      y2: f,
      fill: "none",
      key: d
    }));
  }
  return n;
}
function u8(e) {
  var t = e.x, r = e.width, n = e.horizontal, o = n === void 0 ? !0 : n, l = e.horizontalPoints;
  if (!o || !l || !l.length)
    return null;
  e.xAxisId, e.yAxisId;
  var s = Qs(e, t8), c = l.map((f, d) => {
    var h = Tt(Tt({}, s), {}, {
      x1: t,
      y1: f,
      x2: t + r,
      y2: f,
      key: "line-".concat(d),
      index: d
    });
    return /* @__PURE__ */ w.createElement(XE, {
      key: "line-".concat(d),
      option: o,
      lineItemProps: h
    });
  });
  return /* @__PURE__ */ w.createElement("g", {
    className: "recharts-cartesian-grid-horizontal"
  }, c);
}
function s8(e) {
  var t = e.y, r = e.height, n = e.vertical, o = n === void 0 ? !0 : n, l = e.verticalPoints;
  if (!o || !l || !l.length)
    return null;
  e.xAxisId, e.yAxisId;
  var s = Qs(e, r8), c = l.map((f, d) => {
    var h = Tt(Tt({}, s), {}, {
      x1: f,
      y1: t,
      x2: f,
      y2: t + r,
      key: "line-".concat(d),
      index: d
    });
    return /* @__PURE__ */ w.createElement(XE, {
      option: o,
      lineItemProps: h,
      key: "line-".concat(d)
    });
  });
  return /* @__PURE__ */ w.createElement("g", {
    className: "recharts-cartesian-grid-vertical"
  }, c);
}
function c8(e) {
  var t = e.horizontalFill, r = e.fillOpacity, n = e.x, o = e.y, l = e.width, s = e.height, c = e.horizontalPoints, f = e.horizontal, d = f === void 0 ? !0 : f;
  if (!d || !t || !t.length || c == null)
    return null;
  var h = c.map((y) => Math.round(y + o - o)).sort((y, x) => y - x);
  o !== h[0] && h.unshift(0);
  var p = h.map((y, x) => {
    var A = h[x + 1], S = A == null, b = S ? o + s - y : A - y;
    if (b <= 0)
      return null;
    var E = x % t.length;
    return /* @__PURE__ */ w.createElement("rect", {
      key: "react-".concat(x),
      y,
      x: n,
      height: b,
      width: l,
      stroke: "none",
      fill: t[E],
      fillOpacity: r,
      className: "recharts-cartesian-grid-bg"
    });
  });
  return /* @__PURE__ */ w.createElement("g", {
    className: "recharts-cartesian-gridstripes-horizontal"
  }, p);
}
function f8(e) {
  var t = e.vertical, r = t === void 0 ? !0 : t, n = e.verticalFill, o = e.fillOpacity, l = e.x, s = e.y, c = e.width, f = e.height, d = e.verticalPoints;
  if (!r || !n || !n.length)
    return null;
  var h = d.map((y) => Math.round(y + l - l)).sort((y, x) => y - x);
  l !== h[0] && h.unshift(0);
  var p = h.map((y, x) => {
    var A = h[x + 1], S = A == null, b = S ? l + c - y : A - y;
    if (b <= 0)
      return null;
    var E = x % n.length;
    return /* @__PURE__ */ w.createElement("rect", {
      key: "react-".concat(x),
      x: y,
      y: s,
      width: b,
      height: f,
      stroke: "none",
      fill: n[E],
      fillOpacity: o,
      className: "recharts-cartesian-grid-bg"
    });
  });
  return /* @__PURE__ */ w.createElement("g", {
    className: "recharts-cartesian-gridstripes-vertical"
  }, p);
}
var d8 = (e, t) => {
  var r = e.xAxis, n = e.width, o = e.height, l = e.offset;
  return CS(Kp(Tt(Tt(Tt({}, xn), r), {}, {
    ticks: IS(r),
    viewBox: {
      x: 0,
      y: 0,
      width: n,
      height: o
    }
  })), l.left, l.left + l.width, t);
}, v8 = (e, t) => {
  var r = e.yAxis, n = e.width, o = e.height, l = e.offset;
  return CS(Kp(Tt(Tt(Tt({}, xn), r), {}, {
    ticks: IS(r),
    viewBox: {
      x: 0,
      y: 0,
      width: n,
      height: o
    }
  })), l.top, l.top + l.height, t);
}, h8 = {
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
  zIndex: Nt.grid
};
function qE(e) {
  var t, r, n, o, l, s, c = LS(), f = RS(), d = $S(), h = Tt(Tt({}, qt(e, h8)), {}, {
    x: le(e.x) ? e.x : d.left,
    y: le(e.y) ? e.y : d.top,
    width: le(e.width) ? e.width : d.width,
    height: le(e.height) ? e.height : d.height
  }), p = h.xAxisId, y = h.yAxisId, x = h.x, A = h.y, S = h.width, b = h.height, E = h.syncWithTicks, k = h.horizontalValues, C = h.verticalValues, j = $t(), T = he((ae) => Nw(ae, "xAxis", p, j)), O = he((ae) => Nw(ae, "yAxis", y, j)), _ = Z4(), F = {
    stroke: (t = h.stroke) !== null && t !== void 0 ? t : _.grid.stroke,
    strokeWidth: (r = h.strokeWidth) !== null && r !== void 0 ? r : _.grid.strokeWidth,
    strokeOpacity: (n = h.strokeOpacity) !== null && n !== void 0 ? n : _.grid.strokeOpacity,
    strokeDasharray: (o = h.strokeDasharray) !== null && o !== void 0 ? o : _.grid.strokeDasharray
  };
  if (!en(S) || !en(b) || !le(x) || !le(A))
    return null;
  var K = h.verticalCoordinatesGenerator || d8, V = h.horizontalCoordinatesGenerator || v8, q = h.horizontalPoints, W = h.verticalPoints;
  if ((!q || !q.length) && typeof V == "function") {
    var ie = k && k.length, re = V({
      yAxis: O ? Tt(Tt({}, O), {}, {
        ticks: ie ? k : O.ticks
      }) : void 0,
      width: c ?? S,
      height: f ?? b,
      offset: d
    }, ie ? !0 : E);
    Os(Array.isArray(re), "horizontalCoordinatesGenerator should return Array but instead it returned [".concat(typeof re, "]")), Array.isArray(re) && (q = re);
  }
  if ((!W || !W.length) && typeof K == "function") {
    var we = C && C.length, ve = K({
      xAxis: T ? Tt(Tt({}, T), {}, {
        ticks: we ? C : T.ticks
      }) : void 0,
      width: c ?? S,
      height: f ?? b,
      offset: d
    }, we ? !0 : E);
    Os(Array.isArray(ve), "verticalCoordinatesGenerator should return Array but instead it returned [".concat(typeof ve, "]")), Array.isArray(ve) && (W = ve);
  }
  return /* @__PURE__ */ w.createElement(rn, {
    zIndex: h.zIndex
  }, /* @__PURE__ */ w.createElement("g", {
    className: "recharts-cartesian-grid"
  }, /* @__PURE__ */ w.createElement(l8, {
    fill: (l = h.fill) !== null && l !== void 0 ? l : _.grid.fill,
    fillOpacity: (s = h.fillOpacity) !== null && s !== void 0 ? s : _.grid.fillOpacity,
    x: h.x,
    y: h.y,
    width: h.width,
    height: h.height,
    ry: h.ry
  }), /* @__PURE__ */ w.createElement(c8, Ii({}, h, {
    horizontalPoints: q
  })), /* @__PURE__ */ w.createElement(f8, Ii({}, h, {
    verticalPoints: W
  })), /* @__PURE__ */ w.createElement(u8, Ii({}, h, F, {
    offset: d,
    horizontalPoints: q,
    xAxis: T,
    yAxis: O
  })), /* @__PURE__ */ w.createElement(s8, Ii({}, h, F, {
    offset: d,
    verticalPoints: W,
    xAxis: T,
    yAxis: O
  }))));
}
qE.displayName = "CartesianGrid";
var p8 = ["animationElapsedTime", "isAnimating", "isEntrance", "visibleLength", "strokeDasharray", "connectNulls"];
function fh() {
  return fh = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, fh.apply(null, arguments);
}
function m8(e, t) {
  if (e == null) return {};
  var r, n, o = y8(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (o[r] = e[r]);
  }
  return o;
}
function y8(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
function g8(e) {
  try {
    return e && e.getTotalLength && e.getTotalLength() || 0;
  } catch {
    return 0;
  }
}
function QE(e, t) {
  return "".concat(t, "px ").concat(e, "px");
}
function x8(e) {
  return e.length % 2 !== 0 ? [...e, ...e] : e;
}
function w8(e, t) {
  for (var r = [], n = 0; n < t; ++n)
    r.push(...e);
  return r;
}
function b8(e, t, r) {
  var n = x8(r), o = n.reduce((x, A) => x + A, 0);
  if (!o)
    return QE(t, e);
  for (var l = Math.floor(e / o), s = e % o, c = [], f = 0, d = 0; f < n.length; d += (h = n[f]) !== null && h !== void 0 ? h : 0, ++f) {
    var h, p = n[f];
    if (p != null && d + p > s) {
      c = [...n.slice(0, f), s - d];
      break;
    }
  }
  var y = c.length % 2 === 0 ? [0, t] : [t];
  return [...w8(n, l), ...c, ...y].map((x) => "".concat(x, "px")).join(", ");
}
function S8(e, t, r) {
  if (e) {
    var n = "".concat(e).split(/[,\s]+/gim).map((o) => parseFloat(o));
    return b8(r, t, n);
  }
  return QE(t, r);
}
function A8(e) {
  e.animationElapsedTime, e.isAnimating, e.isEntrance;
  var t = e.visibleLength, r = e.strokeDasharray, n = e.connectNulls, o = m8(e, p8), l = n ?? !1, s;
  if (t != null) {
    var c, f = o.pathRef, d = g8((c = f == null ? void 0 : f.current) !== null && c !== void 0 ? c : null);
    s = S8(r, d, t);
  } else r != null && (s = String(r));
  return /* @__PURE__ */ w.createElement(Jo, fh({}, o, {
    connectNulls: l,
    strokeDasharray: s
  }));
}
function P8(e) {
  var t = w.useRef(0), r = w.useRef(0), n = w.useRef(!1), o = w.useRef(e);
  return o.current !== e && (t.current = r.current, o.current = e), w.useCallback((l, s) => {
    if (n.current)
      return null;
    var c = Math.min(pn(t.current + l * s), s);
    return l > 0 && s > 0 && (r.current = Math.max(r.current, c), c >= s) ? (n.current = !0, null) : c;
  }, []);
}
var E8 = {}, ZE = Dt({
  name: "errorBars",
  initialState: E8,
  reducers: {
    addErrorBar: (e, t) => {
      var r = t.payload, n = r.itemId, o = r.errorBar;
      e[n] || (e[n] = []), e[n].push(o);
    },
    replaceErrorBar: (e, t) => {
      var r = t.payload, n = r.itemId, o = r.prev, l = r.next;
      e[n] && (e[n] = e[n].map((s) => s.dataKey === o.dataKey && s.direction === o.direction ? l : s));
    },
    removeErrorBar: (e, t) => {
      var r = t.payload, n = r.itemId, o = r.errorBar;
      e[n] && (e[n] = e[n].filter((l) => l.dataKey !== o.dataKey || l.direction !== o.direction));
    }
  }
}), Yp = ZE.actions;
Yp.addErrorBar;
Yp.replaceErrorBar;
Yp.removeErrorBar;
var O8 = ZE.reducer, k8 = ["children"];
function _8(e, t) {
  if (e == null) return {};
  var r, n, o = C8(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (o[r] = e[r]);
  }
  return o;
}
function C8(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
var I8 = {
  data: [],
  xAxisId: "xAxis-0",
  yAxisId: "yAxis-0",
  dataPointFormatter: () => ({
    x: 0,
    y: 0,
    value: 0
  }),
  errorBarOffset: 0
}, j8 = /* @__PURE__ */ w.createContext(I8);
function T8(e) {
  var t = e.children, r = _8(e, k8);
  return /* @__PURE__ */ w.createElement(j8.Provider, {
    value: r
  }, t);
}
function Gp(e, t) {
  var r, n, o = he((d) => kn(d, e)), l = he((d) => _n(d, t)), s = (r = o == null ? void 0 : o.allowDataOverflow) !== null && r !== void 0 ? r : lt.allowDataOverflow, c = (n = l == null ? void 0 : l.allowDataOverflow) !== null && n !== void 0 ? n : ut.allowDataOverflow, f = s || c;
  return {
    needClip: f,
    needClipX: s,
    needClipY: c
  };
}
function JE(e) {
  var t = e.xAxisId, r = e.yAxisId, n = e.clipPathId, o = Vc(), l = Gp(t, r), s = l.needClipX, c = l.needClipY, f = l.needClip, d = he((C) => _P(C, t, !1)), h = he((C) => CP(C, r, !1));
  if (!f || !o)
    return null;
  var p = o.x, y = o.y, x = o.width, A = o.height, S = s && d ? Math.min(d[0], d[1]) : p - x / 2, b = c && h ? Math.min(h[0], h[1]) : y - A / 2, E = s && d ? Math.abs(d[1] - d[0]) : x * 2, k = c && h ? Math.abs(h[1] - h[0]) : A * 2;
  return /* @__PURE__ */ w.createElement("clipPath", {
    id: "clipPath-".concat(n)
  }, /* @__PURE__ */ w.createElement("rect", {
    x: S,
    y: b,
    width: E,
    height: k
  }));
}
var eO = (e, t, r, n) => Fc(e, "xAxis", t, n), tO = (e, t, r, n) => Bc(e, "xAxis", t, n), rO = (e, t, r, n) => Fc(e, "yAxis", r, n), nO = (e, t, r, n) => Bc(e, "yAxis", r, n), N8 = z([Be, eO, rO, tO, nO], (e, t, r, n, o) => $r(e, "xAxis") ? Na(t, n, !1) : Na(r, o, !1)), M8 = (e, t, r, n, o) => o;
function D8(e) {
  return e.type === "line";
}
var $8 = z([Pp, M8], (e, t) => e.filter(D8).find((r) => r.id === t)), L8 = z([Be, eO, rO, tO, nO, $8, N8, Pl], (e, t, r, n, o, l, s, c) => {
  var f = c.chartData, d = c.dataStartIndex, h = c.dataEndIndex;
  if (!(l == null || t == null || r == null || n == null || o == null || n.length === 0 || o.length === 0 || s == null || e !== "horizontal" && e !== "vertical")) {
    var p = l.dataKey, y = l.data, x;
    if (y != null && y.length > 0 ? x = y : x = f == null ? void 0 : f.slice(d, h + 1), x != null)
      return i5({
        layout: e,
        xAxis: t,
        yAxis: r,
        xAxisTicks: n,
        yAxisTicks: o,
        dataKey: p,
        bandSize: s,
        displayedData: x
      });
  }
});
function iO(e) {
  var t = ic(e), r = 3, n = 2;
  if (t != null) {
    var o = t.r, l = t.strokeWidth, s = Number(o), c = Number(l);
    return (Number.isNaN(s) || s < 0) && (s = r), (Number.isNaN(c) || c < 0) && (c = n), {
      r: s,
      strokeWidth: c
    };
  }
  return {
    r,
    strokeWidth: n
  };
}
var R8 = ["id"], z8 = ["type", "layout", "connectNulls", "needClip", "shape", "strokeDasharray"], B8 = ["activeDot", "animateNewValues", "animationBegin", "animationDuration", "animationEasing", "connectNulls", "dot", "hide", "isAnimationActive", "label", "legendType", "xAxisId", "yAxisId", "id"];
function Zs() {
  return Zs = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Zs.apply(null, arguments);
}
function Xp(e, t) {
  if (e == null) return {};
  var r, n, o = F8(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (o[r] = e[r]);
  }
  return o;
}
function F8(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
function T1(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Yr(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? T1(Object(r), !0).forEach(function(n) {
      W8(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : T1(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function W8(e, t, r) {
  return (t = U8(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function U8(e) {
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
function K8(e) {
  try {
    return e && e.getTotalLength && e.getTotalLength() || 0;
  } catch {
    return 0;
  }
}
function V8(e) {
  var t = 0, r = 0;
  for (var n of e)
    n.status === "matched" && n.prev.x != null && n.next.x != null && (t += n.next.x - n.prev.x, r++);
  return r > 0 ? t / r : 0;
}
var Y8 = (e, t) => {
  if (e == null)
    return [];
  if (t === 1) return e.flatMap((c) => c.status === "removed" ? [] : [c.next]);
  var r = V8(e), n = [];
  for (var o of e)
    if (o.status === "matched")
      n.push(Yr(Yr({}, o.next), {}, {
        x: rr(o.prev.x, o.next.x, t),
        y: rr(o.prev.y, o.next.y, t)
      }));
    else if (o.status === "added")
      if (o.next.x != null) {
        var l = o.next.x - r;
        n.push(Yr(Yr({}, o.next), {}, {
          x: rr(l, o.next.x, t),
          y: o.next.y
        }));
      } else
        n.push(o.next);
    else if (o.status === "removed" && o.prev.x != null) {
      var s = o.prev.x + r;
      n.push(Yr(Yr({}, o.prev), {}, {
        x: rr(o.prev.x, s, t),
        y: o.prev.y
      }));
    }
  return n;
}, qp = {
  activeDot: !0,
  animateNewValues: !0,
  animationBegin: 0,
  animationDuration: 1500,
  animationEasing: "ease",
  animationInterpolateFn: Y8,
  animationMatchBy: Kc,
  connectNulls: !1,
  dot: !0,
  fill: "#fff",
  hide: !1,
  isAnimationActive: "auto",
  label: !1,
  legendType: "line",
  shape: A8,
  stroke: "#3182bd",
  strokeWidth: 1,
  xAxisId: 0,
  yAxisId: 0,
  zIndex: Nt.line,
  type: "linear"
}, G8 = (e) => {
  var t = e.dataKey, r = e.name, n = e.stroke, o = e.legendType, l = e.hide;
  return [{
    inactive: l,
    dataKey: t,
    type: o,
    color: n,
    value: xc(r, t),
    payload: e
  }];
}, X8 = /* @__PURE__ */ w.memo((e) => {
  var t = e.dataKey, r = e.data, n = e.stroke, o = e.strokeWidth, l = e.fill, s = e.name, c = e.hide, f = e.unit, d = e.formatter, h = e.tooltipType, p = e.id, y = {
    dataDefinedOnItem: r,
    getPosition: Fi,
    settings: {
      stroke: n,
      strokeWidth: o,
      fill: l,
      dataKey: t,
      nameKey: void 0,
      name: xc(s, t),
      hide: c,
      type: h,
      color: n,
      unit: f,
      formatter: d,
      graphicalItemId: p
    }
  };
  return /* @__PURE__ */ w.createElement(jE, {
    tooltipEntrySettings: y
  });
});
function q8(e) {
  var t = e.clipPathId, r = e.points, n = e.props, o = n.dot, l = n.dataKey, s = n.needClip;
  n.id;
  var c = Xp(n, R8), f = gr(c);
  return /* @__PURE__ */ w.createElement(BE, {
    points: r,
    dot: o,
    className: "recharts-line-dots",
    dotClassName: "recharts-line-dot",
    dataKey: l,
    baseProps: f,
    needClip: s,
    clipPathId: t
  });
}
function Q8(e) {
  var t = e.showLabels, r = e.children, n = e.points, o = w.useMemo(() => n == null ? void 0 : n.map((l) => {
    var s, c, f = {
      x: (s = l.x) !== null && s !== void 0 ? s : 0,
      y: (c = l.y) !== null && c !== void 0 ? c : 0,
      width: 0,
      lowerWidth: 0,
      upperWidth: 0,
      height: 0
    };
    return Yr(Yr({}, f), {}, {
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
  return /* @__PURE__ */ w.createElement(PE, {
    value: t ? o : void 0
  }, r);
}
function Z8(e) {
  var t = e.clipPathId, r = e.pathRef, n = e.points, o = e.props, l = e.animationElapsedTime, s = e.isAnimating, c = e.isEntrance, f = e.visibleLength, d = o.type, h = o.layout, p = o.connectNulls, y = o.needClip, x = o.shape, A = o.strokeDasharray, S = Xp(o, z8), b = Yr(Yr({}, ar(S)), {}, {
    fill: "none",
    className: "recharts-line-curve",
    clipPath: y ? "url(#clipPath-".concat(t, ")") : void 0,
    points: n,
    type: d,
    layout: h,
    connectNulls: p,
    strokeDasharray: A ?? o.strokeDasharray,
    pathRef: r,
    animationElapsedTime: l,
    isAnimating: s,
    isEntrance: o.animateNewValues ? c : !1,
    visibleLength: f
  });
  return /* @__PURE__ */ w.createElement(w.Fragment, null, (n == null ? void 0 : n.length) > 1 && /* @__PURE__ */ w.createElement(IE, {
    option: x,
    DefaultShape: qp.shape,
    shapeProps: b
  }), /* @__PURE__ */ w.createElement(q8, {
    points: n,
    clipPathId: t,
    props: o
  }));
}
function J8(e) {
  var t = e.clipPathId, r = e.props, n = e.pathRef, o = e.previousPointsRef, l = r.points, s = r.isAnimationActive, c = r.animationBegin, f = r.animationDuration, d = r.animationEasing, h = r.animationMatchBy, p = r.animationInterpolateFn, y = r.layout, x = K8(n.current), A = ME(r.onAnimationStart, r.onAnimationEnd), S = A.isAnimating, b = A.handleAnimationStart, E = A.handleAnimationEnd, k = !S, C = P8(l), j = w.useCallback((T) => T > 0 && x > 0, [x]);
  return /* @__PURE__ */ w.createElement(Q8, {
    points: l,
    showLabels: k
  }, r.children, /* @__PURE__ */ w.createElement(DE, {
    animationInput: l,
    animationIdPrefix: "recharts-line-",
    items: l,
    previousItemsRef: o,
    isAnimationActive: s,
    animationBegin: c,
    animationDuration: f,
    animationEasing: d,
    onAnimationStart: b,
    onAnimationEnd: E,
    animationInterpolateFn: p,
    animationMatchBy: h,
    shouldUpdatePreviousRef: j,
    layout: y
  }, (T, O, _) => {
    var F = S || O < 1, K = F ? C(O, x) : null;
    return /* @__PURE__ */ w.createElement(Z8, {
      props: r,
      points: T,
      clipPathId: t,
      pathRef: n,
      animationElapsedTime: O,
      isAnimating: F,
      isEntrance: _,
      visibleLength: K
    });
  }), /* @__PURE__ */ w.createElement(OE, {
    label: r.label
  }));
}
function e5(e) {
  var t = e.clipPathId, r = e.props, n = w.useRef(null), o = w.useRef(null);
  return /* @__PURE__ */ w.createElement(J8, {
    props: r,
    clipPathId: t,
    previousPointsRef: n,
    pathRef: o
  });
}
var t5 = (e, t) => {
  var r, n;
  return {
    x: (r = e.x) !== null && r !== void 0 ? r : void 0,
    y: (n = e.y) !== null && n !== void 0 ? n : void 0,
    value: e.value,
    // getValueByDataKey does not validate the output type
    errorVal: tt(e.payload, t)
  };
};
class r5 extends w.Component {
  render() {
    var t = this.props, r = t.hide, n = t.dot, o = t.points, l = t.className, s = t.xAxisId, c = t.yAxisId, f = t.top, d = t.left, h = t.width, p = t.height, y = t.id, x = t.needClip, A = t.zIndex;
    if (r)
      return null;
    var S = ze("recharts-line", l), b = y, E = iO(n), k = E.r, C = E.strokeWidth, j = Up(n), T = k * 2 + C, O = x ? "url(#clipPath-".concat(j ? "" : "dots-").concat(b, ")") : void 0;
    return /* @__PURE__ */ w.createElement(rn, {
      zIndex: A
    }, /* @__PURE__ */ w.createElement(or, {
      className: S
    }, x && /* @__PURE__ */ w.createElement("defs", null, /* @__PURE__ */ w.createElement(JE, {
      clipPathId: b,
      xAxisId: s,
      yAxisId: c
    }), !j && /* @__PURE__ */ w.createElement("clipPath", {
      id: "clipPath-dots-".concat(b)
    }, /* @__PURE__ */ w.createElement("rect", {
      x: d - T / 2,
      y: f - T / 2,
      width: h + T,
      height: p + T
    }))), /* @__PURE__ */ w.createElement(T8, {
      xAxisId: s,
      yAxisId: c,
      data: o,
      dataPointFormatter: t5,
      errorBarOffset: 0
    }, /* @__PURE__ */ w.createElement(e5, {
      props: this.props,
      clipPathId: b
    }))), /* @__PURE__ */ w.createElement(ch, {
      activeDot: this.props.activeDot,
      points: o,
      mainColor: this.props.stroke,
      itemDataKey: this.props.dataKey,
      clipPath: O
    }));
  }
}
function n5(e) {
  var t = qt(e, qp), r = t.activeDot, n = t.animateNewValues, o = t.animationBegin, l = t.animationDuration, s = t.animationEasing, c = t.connectNulls, f = t.dot, d = t.hide, h = t.isAnimationActive, p = t.label, y = t.legendType, x = t.xAxisId, A = t.yAxisId, S = t.id, b = Xp(t, B8), E = Gp(x, A), k = E.needClip, C = Vc(), j = Wi(), T = $t(), O = he((q) => L8(q, x, A, T, S));
  if (j !== "horizontal" && j !== "vertical" || O == null || C == null)
    return null;
  var _ = C.height, F = C.width, K = C.x, V = C.y;
  return /* @__PURE__ */ w.createElement(r5, Zs({}, b, {
    id: S,
    connectNulls: c,
    dot: f,
    activeDot: r,
    animateNewValues: n,
    animationBegin: o,
    animationDuration: l,
    animationEasing: s,
    isAnimationActive: h,
    hide: d,
    label: p,
    legendType: y,
    xAxisId: x,
    yAxisId: A,
    points: O,
    layout: j,
    height: _,
    width: F,
    left: K,
    top: V,
    needClip: k
  }));
}
function i5(e) {
  var t = e.layout, r = e.xAxis, n = e.yAxis, o = e.xAxisTicks, l = e.yAxisTicks, s = e.dataKey, c = e.bandSize, f = e.displayedData;
  return f.map((d, h) => {
    var p = tt(d, s);
    if (t === "horizontal") {
      var y = Es({
        axis: r,
        ticks: o,
        bandSize: c,
        entry: d,
        index: h
      }), x = st(p) ? null : n.scale.map(p);
      return {
        x: y,
        y: x ?? null,
        value: p,
        payload: d
      };
    }
    var A = st(p) ? null : r.scale.map(p), S = Es({
      axis: n,
      ticks: l,
      bandSize: c,
      entry: d,
      index: h
    });
    return A == null || S == null ? null : {
      x: A,
      y: S,
      value: p,
      payload: d
    };
  }).filter(Boolean);
}
function a5(e) {
  var t = qt(e, qp), r = $t();
  return /* @__PURE__ */ w.createElement(LE, {
    id: t.id,
    type: "line"
  }, (n) => /* @__PURE__ */ w.createElement(w.Fragment, null, /* @__PURE__ */ w.createElement(TE, {
    legendPayload: G8(t)
  }), /* @__PURE__ */ w.createElement(X8, {
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
  }), /* @__PURE__ */ w.createElement(zE, {
    type: "line",
    id: n,
    data: t.data,
    xAxisId: t.xAxisId,
    yAxisId: t.yAxisId,
    zAxisId: 0,
    dataKey: t.dataKey,
    hide: t.hide,
    isPanorama: r
  }), /* @__PURE__ */ w.createElement(n5, Zs({}, t, {
    id: n
  }))));
}
var aO = /* @__PURE__ */ w.memo(a5, Sl);
aO.displayName = "Line";
function Qp(e, t) {
  var r, n;
  return (r = (n = e.graphicalItems.cartesianItems.find((o) => o.id === t)) === null || n === void 0 ? void 0 : n.xAxisId) !== null && r !== void 0 ? r : FE;
}
function Zp(e, t) {
  var r, n;
  return (r = (n = e.graphicalItems.cartesianItems.find((o) => o.id === t)) === null || n === void 0 ? void 0 : n.yAxisId) !== null && r !== void 0 ? r : FE;
}
var oO = (e, t, r) => Fc(e, "xAxis", Qp(e, t), r), lO = (e, t, r) => Bc(e, "xAxis", Qp(e, t), r), uO = (e, t, r) => Fc(e, "yAxis", Zp(e, t), r), sO = (e, t, r) => Bc(e, "yAxis", Zp(e, t), r), o5 = z([Be, oO, uO, lO, sO], (e, t, r, n, o) => $r(e, "xAxis") ? Na(t, n, !1) : Na(r, o, !1)), l5 = (e, t) => t, Jp = z([Pp, l5], (e, t) => e.filter((r) => r.type === "area").find((r) => r.id === t)), cO = (e) => {
  var t = Be(e), r = $r(t, "xAxis");
  return r ? "yAxis" : "xAxis";
}, u5 = (e, t) => {
  var r = cO(e);
  return r === "yAxis" ? Zp(e, t) : Qp(e, t);
}, fO = (e, t, r) => dP(e, cO(e), u5(e, t), r), s5 = z([Jp, fO], (e, t) => {
  var r;
  if (!(e == null || t == null)) {
    var n = e.stackId, o = qh(e);
    if (!(n == null || o == null)) {
      var l = (r = t[n]) === null || r === void 0 ? void 0 : r.stackedData, s = l == null ? void 0 : l.find((c) => c.key === o);
      if (s != null)
        return s.map((c) => [c[0], c[1]]);
    }
  }
}), c5 = z([Jp, fO], (e, t) => {
  if (!(e == null || e.stackId == null || t == null)) {
    var r = t[e.stackId];
    if (r != null)
      return r.graphicalItems.map((n) => n.dataKey).filter(Bt);
  }
}), f5 = z([Be, oO, uO, lO, sO, s5, QM, o5, Jp, h2, c5], (e, t, r, n, o, l, s, c, f, d, h) => {
  var p = s.chartData, y = s.dataStartIndex, x = s.dataEndIndex;
  if (!(f == null || e !== "horizontal" && e !== "vertical" || t == null || r == null || n == null || o == null || n.length === 0 || o.length === 0 || c == null)) {
    var A = f.data, S;
    if (A && A.length > 0 ? S = A : S = p == null ? void 0 : p.slice(y, x + 1), S != null)
      return L5({
        layout: e,
        xAxis: t,
        yAxis: r,
        xAxisTicks: n,
        yAxisTicks: o,
        dataStartIndex: y,
        areaSettings: f,
        stackedData: l,
        displayedData: S,
        chartBaseValue: d,
        bandSize: c,
        stackDataKeys: h
      });
  }
}), d5 = ["animationElapsedTime", "isAnimating", "isEntrance", "layout", "isRange", "stroke", "connectNulls"], v5 = ["id", "baseLine"];
function nl() {
  return nl = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, nl.apply(null, arguments);
}
function N1(e, t) {
  if (e == null) return {};
  var r, n, o = h5(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (o[r] = e[r]);
  }
  return o;
}
function h5(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
function p5(e) {
  var t, r, n = e.alpha, o = e.baseLine, l = e.points, s = e.strokeWidth, c = (t = l[0]) === null || t === void 0 ? void 0 : t.x, f = (r = l[l.length - 1]) === null || r === void 0 ? void 0 : r.x;
  if (!ke(c) || !ke(f))
    return null;
  var d = n * Math.abs(c - f), h = Math.max(...l.map((p) => p.y || 0));
  return le(o) ? h = Math.max(o, h) : o && Array.isArray(o) && o.length && (h = Math.max(...o.map((p) => p.y || 0), h)), le(h) ? /* @__PURE__ */ w.createElement("rect", {
    x: c < f ? c : c - d,
    y: 0,
    width: d,
    height: Math.floor(h + (s ? parseInt("".concat(s), 10) : 1))
  }) : null;
}
function m5(e) {
  var t, r, n = e.alpha, o = e.baseLine, l = e.points, s = e.strokeWidth, c = (t = l[0]) === null || t === void 0 ? void 0 : t.y, f = (r = l[l.length - 1]) === null || r === void 0 ? void 0 : r.y;
  if (!ke(c) || !ke(f))
    return null;
  var d = n * Math.abs(c - f), h = Math.max(...l.map((p) => p.x || 0));
  return le(o) ? h = Math.max(o, h) : o && Array.isArray(o) && o.length && (h = Math.max(...o.map((p) => p.x || 0), h)), le(h) ? /* @__PURE__ */ w.createElement("rect", {
    x: 0,
    y: c < f ? c : c - d,
    width: h + (s ? parseInt("".concat(s), 10) : 1),
    height: Math.floor(d)
  }) : null;
}
function y5(e) {
  var t = e.alpha, r = e.layout, n = e.points, o = e.baseLine, l = e.strokeWidth;
  return r === "vertical" ? /* @__PURE__ */ w.createElement(m5, {
    alpha: t,
    points: n,
    baseLine: o,
    strokeWidth: l
  }) : /* @__PURE__ */ w.createElement(p5, {
    alpha: t,
    points: n,
    baseLine: o,
    strokeWidth: l
  });
}
function g5(e) {
  var t = e.animationElapsedTime, r = t === void 0 ? 1 : t, n = e.isAnimating, o = n === void 0 ? !1 : n, l = e.isEntrance, s = l === void 0 ? !1 : l, c = e.layout, f = e.isRange, d = e.stroke, h = e.connectNulls, p = N1(e, d5), y = c === "vertical" ? "vertical" : "horizontal", x = h ?? !1, A = $E(), S = p.id, b = p.baseLine, E = N1(p, v5), k = gr(E), C = /* @__PURE__ */ w.createElement(Jo, nl({}, p, {
    id: S,
    baseLine: b,
    connectNulls: x,
    stroke: "none",
    className: "recharts-area-area",
    layout: y
  })), j = d !== "none" && /* @__PURE__ */ w.createElement(Jo, nl({}, k, {
    className: "recharts-area-curve",
    layout: y,
    type: p.type,
    connectNulls: x,
    fill: "none",
    stroke: d,
    points: p.points
  })), T = d !== "none" && f && Array.isArray(b) && /* @__PURE__ */ w.createElement(Jo, nl({}, k, {
    className: "recharts-area-curve",
    layout: y,
    type: p.type,
    connectNulls: x,
    fill: "none",
    stroke: d,
    points: b
  }));
  if (s && (o || r < 1)) {
    var O;
    return /* @__PURE__ */ w.createElement(or, null, /* @__PURE__ */ w.createElement("defs", null, /* @__PURE__ */ w.createElement("clipPath", {
      id: A
    }, /* @__PURE__ */ w.createElement(y5, {
      alpha: r,
      points: (O = p.points) !== null && O !== void 0 ? O : [],
      baseLine: b,
      layout: y,
      strokeWidth: p.strokeWidth
    }))), /* @__PURE__ */ w.createElement(or, {
      clipPath: "url(#".concat(A, ")")
    }, C, j, T));
  }
  return /* @__PURE__ */ w.createElement(w.Fragment, null, C, j, T);
}
var x5 = ["id"], w5 = ["activeDot", "animationBegin", "animationDuration", "animationEasing", "connectNulls", "dot", "fill", "fillOpacity", "hide", "isAnimationActive", "legendType", "stroke", "xAxisId", "yAxisId"];
function Js() {
  return Js = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Js.apply(null, arguments);
}
function dO(e, t) {
  if (e == null) return {};
  var r, n, o = b5(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (o[r] = e[r]);
  }
  return o;
}
function b5(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
function M1(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function za(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? M1(Object(r), !0).forEach(function(n) {
      S5(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : M1(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function S5(e, t, r) {
  return (t = A5(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function A5(e) {
  var t = P5(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function P5(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var E5 = (e, t) => e == null ? [] : t === 1 ? e.flatMap((r) => r.status === "removed" ? [] : [r.next]) : e.flatMap((r) => r.status === "matched" ? [za(za({}, r.next), {}, {
  x: rr(r.prev.x, r.next.x, t),
  y: rr(r.prev.y, r.next.y, t)
})] : r.status === "added" ? [r.next] : []), vO = {
  activeDot: !0,
  animationBegin: 0,
  animationDuration: 1500,
  animationEasing: "ease",
  animationMatchBy: Kc,
  animationInterpolateFn: E5,
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
  shape: g5,
  xAxisId: 0,
  yAxisId: 0,
  zIndex: Nt.area
};
function ec(e, t) {
  return e && e !== "none" ? e : t;
}
var O5 = (e) => {
  var t = e.dataKey, r = e.name, n = e.stroke, o = e.fill, l = e.legendType, s = e.hide;
  return [{
    inactive: s,
    dataKey: t,
    type: l,
    color: ec(n, o),
    value: xc(r, t),
    payload: e
  }];
}, k5 = /* @__PURE__ */ w.memo((e) => {
  var t = e.dataKey, r = e.data, n = e.stroke, o = e.strokeWidth, l = e.fill, s = e.name, c = e.hide, f = e.unit, d = e.formatter, h = e.tooltipType, p = e.id, y = {
    dataDefinedOnItem: r,
    getPosition: Fi,
    settings: {
      stroke: n,
      strokeWidth: o,
      fill: l,
      dataKey: t,
      nameKey: void 0,
      name: xc(s, t),
      hide: c,
      type: h,
      color: ec(n, l),
      unit: f,
      formatter: d,
      graphicalItemId: p
    }
  };
  return /* @__PURE__ */ w.createElement(jE, {
    tooltipEntrySettings: y
  });
});
function _5(e) {
  var t = e.clipPathId, r = e.points, n = e.props, o = n.needClip, l = n.dot, s = n.dataKey, c = gr(n);
  return /* @__PURE__ */ w.createElement(BE, {
    points: r,
    dot: l,
    className: "recharts-area-dots",
    dotClassName: "recharts-area-dot",
    dataKey: s,
    baseProps: c,
    needClip: o,
    clipPathId: t
  });
}
function C5(e) {
  var t = e.showLabels, r = e.children, n = e.points, o = n.map((l) => {
    var s, c, f = {
      x: (s = l.x) !== null && s !== void 0 ? s : 0,
      y: (c = l.y) !== null && c !== void 0 ? c : 0,
      width: 0,
      lowerWidth: 0,
      upperWidth: 0,
      height: 0
    };
    return za(za({}, f), {}, {
      value: l.value,
      payload: l.payload,
      parentViewBox: void 0,
      viewBox: f,
      fill: void 0
    });
  });
  return /* @__PURE__ */ w.createElement(PE, {
    value: t ? o : void 0
  }, r);
}
function I5(e) {
  var t = e.points, r = e.baseLine, n = e.needClip, o = e.clipPathId, l = e.props, s = e.animationElapsedTime, c = e.isAnimating, f = e.isEntrance, d = l.layout, h = l.type, p = l.stroke, y = l.connectNulls, x = l.isRange, A = l.shape, S = l.id, b = dO(l, x5), E = ar(b), k = za(za({}, E), {}, {
    id: S,
    points: t,
    connectNulls: y,
    type: h,
    baseLine: r,
    layout: d,
    stroke: p,
    isRange: x,
    animationElapsedTime: s,
    isAnimating: c,
    isEntrance: f
  });
  return /* @__PURE__ */ w.createElement(w.Fragment, null, (t == null ? void 0 : t.length) > 1 && /* @__PURE__ */ w.createElement(or, {
    clipPath: n ? "url(#clipPath-".concat(o, ")") : void 0
  }, /* @__PURE__ */ w.createElement(IE, {
    option: A,
    DefaultShape: vO.shape,
    shapeProps: k
  })), /* @__PURE__ */ w.createElement(_5, {
    points: t,
    props: b,
    clipPathId: o
  }));
}
function j5(e, t, r) {
  if (le(e)) {
    var n = le(t) ? t : void 0;
    return rr(n, e, r);
  }
  if (st(e) || Zr(e)) {
    var o = le(t) ? t : void 0;
    return rr(o, 0, r);
  }
  return e;
}
function T5(e) {
  var t = e.needClip, r = e.clipPathId, n = e.props, o = e.previousPointsRef, l = e.previousBaselineRef, s = n.points, c = n.baseLine, f = n.isAnimationActive, d = n.animationBegin, h = n.animationDuration, p = n.animationEasing, y = n.animationMatchBy, x = n.animationInterpolateFn, A = w.useMemo(() => ({
    points: s,
    baseLine: c
  }), [s, c]), S = NE(A, l), b = Rh(), E = ME(n.onAnimationStart, n.onAnimationEnd), k = E.isAnimating, C = E.handleAnimationStart, j = E.handleAnimationEnd, T = S.startValue;
  if (b == null)
    return null;
  var O;
  return Array.isArray(c) && Array.isArray(T) ? O = sh(T, c, y) : Array.isArray(c) ? O = sh(null, c, y) : O = null, /* @__PURE__ */ w.createElement(DE, {
    animationInput: A,
    animationIdPrefix: "recharts-area-",
    items: s,
    previousItemsRef: o,
    isAnimationActive: f,
    animationBegin: d,
    animationDuration: h,
    animationEasing: p,
    onAnimationStart: C,
    onAnimationEnd: j,
    animationInterpolateFn: x,
    animationMatchBy: y,
    layout: b
  }, (_, F, K) => {
    var V;
    return F === 1 ? V = c : Array.isArray(c) ? V = x(O, F, b) : V = K ? c : j5(c, T, F), S.syncStepValue(V, F), /* @__PURE__ */ w.createElement(C5, {
      showLabels: !k,
      points: s
    }, n.children, /* @__PURE__ */ w.createElement(I5, {
      points: _,
      baseLine: V,
      needClip: t,
      clipPathId: r,
      props: n,
      animationElapsedTime: F,
      isAnimating: k || F < 1,
      isEntrance: K
    }), /* @__PURE__ */ w.createElement(OE, {
      label: n.label
    }));
  });
}
function N5(e) {
  var t = e.needClip, r = e.clipPathId, n = e.props, o = w.useRef(null), l = w.useRef();
  return /* @__PURE__ */ w.createElement(T5, {
    needClip: t,
    clipPathId: r,
    props: n,
    previousPointsRef: o,
    previousBaselineRef: l
  });
}
class M5 extends w.PureComponent {
  render() {
    var t = this.props, r = t.hide, n = t.dot, o = t.points, l = t.className, s = t.top, c = t.left, f = t.needClip, d = t.xAxisId, h = t.yAxisId, p = t.width, y = t.height, x = t.id, A = t.baseLine, S = t.zIndex;
    if (r)
      return null;
    var b = ze("recharts-area", l), E = x, k = iO(n), C = k.r, j = k.strokeWidth, T = Up(n), O = C * 2 + j, _ = f ? "url(#clipPath-".concat(T ? "" : "dots-").concat(E, ")") : void 0;
    return /* @__PURE__ */ w.createElement(rn, {
      zIndex: S
    }, /* @__PURE__ */ w.createElement(or, {
      className: b
    }, f && /* @__PURE__ */ w.createElement("defs", null, /* @__PURE__ */ w.createElement(JE, {
      clipPathId: E,
      xAxisId: d,
      yAxisId: h
    }), !T && /* @__PURE__ */ w.createElement("clipPath", {
      id: "clipPath-dots-".concat(E)
    }, /* @__PURE__ */ w.createElement("rect", {
      x: c - O / 2,
      y: s - O / 2,
      width: p + O,
      height: y + O
    }))), /* @__PURE__ */ w.createElement(N5, {
      needClip: f,
      clipPathId: E,
      props: this.props
    })), /* @__PURE__ */ w.createElement(ch, {
      points: o,
      mainColor: ec(this.props.stroke, this.props.fill),
      itemDataKey: this.props.dataKey,
      activeDot: this.props.activeDot,
      clipPath: _
    }), this.props.isRange && Array.isArray(A) && /* @__PURE__ */ w.createElement(ch, {
      points: A,
      mainColor: ec(this.props.stroke, this.props.fill),
      itemDataKey: this.props.dataKey,
      activeDot: this.props.activeDot,
      clipPath: _
    }));
  }
}
function D5(e) {
  var t, r = e.activeDot, n = e.animationBegin, o = e.animationDuration, l = e.animationEasing, s = e.connectNulls, c = e.dot, f = e.fill, d = e.fillOpacity, h = e.hide, p = e.isAnimationActive, y = e.legendType, x = e.stroke, A = e.xAxisId, S = e.yAxisId, b = dO(e, w5), E = Wi(), k = iE(), C = Gp(A, S), j = C.needClip, T = $t(), O = (t = he((we) => f5(we, e.id, T))) !== null && t !== void 0 ? t : {}, _ = O.points, F = O.isRange, K = O.baseLine, V = Vc();
  if (E !== "horizontal" && E !== "vertical" || V == null || k !== "AreaChart" && k !== "ComposedChart")
    return null;
  var q = V.height, W = V.width, ie = V.x, re = V.y;
  return !_ || !_.length ? null : /* @__PURE__ */ w.createElement(M5, Js({}, b, {
    activeDot: r,
    animationBegin: n,
    animationDuration: o,
    animationEasing: l,
    baseLine: K,
    connectNulls: s,
    dot: c,
    fill: f,
    fillOpacity: d,
    height: q,
    hide: h,
    layout: E,
    isAnimationActive: p,
    isRange: F,
    legendType: y,
    needClip: j,
    points: _,
    stroke: x,
    width: W,
    left: ie,
    top: re,
    xAxisId: A,
    yAxisId: S
  }));
}
var $5 = (e, t, r, n, o) => {
  var l = r ?? t;
  if (le(l))
    return l;
  var s = e === "horizontal" ? o : n, c = s.scale.domain();
  if (s.type === "number") {
    var f = Math.max(c[0], c[1]), d = Math.min(c[0], c[1]);
    return l === "dataMin" ? d : l === "dataMax" || f < 0 ? f : Math.max(Math.min(c[0], c[1]), 0);
  }
  return l === "dataMin" ? c[0] : l === "dataMax" ? c[1] : c[0];
};
function L5(e) {
  var t = e.areaSettings, r = t.connectNulls, n = t.baseValue, o = t.dataKey, l = e.stackedData, s = e.layout, c = e.chartBaseValue, f = e.xAxis, d = e.yAxis, h = e.displayedData, p = e.dataStartIndex, y = e.xAxisTicks, x = e.yAxisTicks, A = e.bandSize, S = e.stackDataKeys, b = l && l.length, E = $5(s, c, n, f, d), k = s === "horizontal", C = !1, j = h.map((O, _) => {
    var F, K, V, q;
    if (b)
      q = l[p + _];
    else {
      var W = tt(O, o);
      Array.isArray(W) ? (q = W, C = !0) : q = [E, W];
    }
    var ie = (F = (K = q) === null || K === void 0 ? void 0 : K[1]) !== null && F !== void 0 ? F : null, re = tt(O, o), we = b && re == null && S != null && S.length > 0 && S.every((U) => tt(O, U) == null), ve = ie == null || b && !r && re == null || we;
    if (k) {
      var ae;
      return {
        x: Es({
          axis: f,
          ticks: y,
          bandSize: A,
          entry: O,
          index: _
        }),
        y: ve ? null : (ae = d.scale.map(ie)) !== null && ae !== void 0 ? ae : null,
        value: q,
        payload: O
      };
    }
    return {
      x: ve ? null : (V = f.scale.map(ie)) !== null && V !== void 0 ? V : null,
      y: Es({
        axis: d,
        ticks: x,
        bandSize: A,
        entry: O,
        index: _
      }),
      value: q,
      payload: O
    };
  }), T;
  return b || C ? T = j.map((O) => {
    var _, F = Array.isArray(O.value) ? O.value[0] : null;
    if (k) {
      var K;
      return {
        x: O.x,
        y: F != null && O.y != null && (K = d.scale.map(F)) !== null && K !== void 0 ? K : null,
        payload: O.payload
      };
    }
    return {
      x: F != null && (_ = f.scale.map(F)) !== null && _ !== void 0 ? _ : null,
      y: O.y,
      payload: O.payload
    };
  }) : T = k ? d.scale.map(E) : f.scale.map(E), {
    points: j,
    baseLine: T ?? 0,
    isRange: C
  };
}
function R5(e) {
  var t = qt(e, vO), r = $t();
  return /* @__PURE__ */ w.createElement(LE, {
    id: t.id,
    type: "area"
  }, (n) => /* @__PURE__ */ w.createElement(w.Fragment, null, /* @__PURE__ */ w.createElement(TE, {
    legendPayload: O5(t)
  }), /* @__PURE__ */ w.createElement(k5, {
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
  }), /* @__PURE__ */ w.createElement(zE, {
    type: "area",
    id: n,
    data: t.data,
    dataKey: t.dataKey,
    xAxisId: t.xAxisId,
    yAxisId: t.yAxisId,
    zAxisId: 0,
    stackId: Gj(t.stackId),
    hide: t.hide,
    barSize: void 0,
    baseValue: t.baseValue,
    isPanorama: r,
    connectNulls: t.connectNulls
  }), /* @__PURE__ */ w.createElement(D5, Js({}, t, {
    id: n
  }))));
}
var hO = /* @__PURE__ */ w.memo(R5, Sl);
hO.displayName = "Area";
var z5 = ["domain", "range"], B5 = ["domain", "range"];
function D1(e, t) {
  if (e == null) return {};
  var r, n, o = F5(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (o[r] = e[r]);
  }
  return o;
}
function F5(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
function $1(e, t) {
  return e === t ? !0 : Array.isArray(e) && e.length === 2 && Array.isArray(t) && t.length === 2 ? e[0] === t[0] && e[1] === t[1] : !1;
}
function pO(e, t) {
  if (e === t)
    return !0;
  var r = e.domain, n = e.range, o = D1(e, z5), l = t.domain, s = t.range, c = D1(t, B5);
  return !$1(r, l) || !$1(n, s) ? !1 : Sl(o, c);
}
var W5 = ["type"], U5 = ["dangerouslySetInnerHTML", "ticks", "scale"], H5 = ["id", "scale"];
function dh() {
  return dh = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, dh.apply(null, arguments);
}
function L1(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function R1(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? L1(Object(r), !0).forEach(function(n) {
      K5(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : L1(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function K5(e, t, r) {
  return (t = V5(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function V5(e) {
  var t = Y5(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function Y5(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function vh(e, t) {
  if (e == null) return {};
  var r, n, o = G5(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (o[r] = e[r]);
  }
  return o;
}
function G5(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
function X5(e) {
  var t = rt(), r = w.useRef(null), n = Rh(), o = e.type, l = vh(e, W5), s = kc(n, "xAxis", o), c = w.useMemo(() => {
    if (s != null)
      return R1(R1({}, l), {}, {
        type: s
      });
  }, [l, s]);
  return w.useLayoutEffect(() => {
    c != null && (r.current === null ? t(zF(c)) : r.current !== c && t(BF({
      prev: r.current,
      next: c
    })), r.current = c);
  }, [c, t]), w.useLayoutEffect(() => () => {
    r.current && (t(FF(r.current)), r.current = null);
  }, [t]), null;
}
var q5 = (e) => {
  var t = e.xAxisId, r = e.className, n = e.height, o = e.label, l = w.useRef(null), s = w.useRef(null), c = he(TS), f = $t(), d = rt(), h = "xAxis", p = he((E) => DP(E, h, t, f)), y = he((E) => GL(E, t)), x = he((E) => eR(E, t)), A = he((E) => JA(E, t));
  if (w.useLayoutEffect(() => {
    if (!(n !== "auto" || !y || Uc(o) || /* @__PURE__ */ w.isValidElement(o) || A == null)) {
      var E = l.current;
      if (E) {
        var k = E.getCalculatedHeight();
        Math.round(y.height) !== Math.round(k) && d(VF({
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
    o,
    t,
    n,
    A
  ]), y == null || x == null || A == null)
    return null;
  e.dangerouslySetInnerHTML, e.ticks, e.scale;
  var S = vh(e, U5);
  A.id, A.scale;
  var b = vh(A, H5);
  return /* @__PURE__ */ w.createElement(Vp, dh({}, S, b, {
    ref: l,
    labelRef: s,
    x: x.x,
    y: x.y,
    width: y.width,
    height: y.height,
    className: ze("recharts-".concat(h, " ").concat(h), r),
    viewBox: c,
    ticks: p,
    axisType: h,
    axisId: t
  }));
}, Q5 = {
  allowDataOverflow: lt.allowDataOverflow,
  allowDecimals: lt.allowDecimals,
  allowDuplicatedCategory: lt.allowDuplicatedCategory,
  angle: lt.angle,
  axisLine: xn.axisLine,
  height: lt.height,
  hide: !1,
  includeHidden: lt.includeHidden,
  interval: lt.interval,
  label: !1,
  minTickGap: lt.minTickGap,
  mirror: lt.mirror,
  orientation: lt.orientation,
  padding: lt.padding,
  reversed: lt.reversed,
  scale: lt.scale,
  tick: lt.tick,
  tickCount: lt.tickCount,
  tickLine: xn.tickLine,
  tickSize: xn.tickSize,
  type: lt.type,
  niceTicks: lt.niceTicks,
  xAxisId: 0
}, Z5 = (e) => {
  var t = qt(e, Q5);
  return /* @__PURE__ */ w.createElement(w.Fragment, null, /* @__PURE__ */ w.createElement(X5, {
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
  }), /* @__PURE__ */ w.createElement(q5, t));
}, mO = /* @__PURE__ */ w.memo(Z5, pO);
mO.displayName = "XAxis";
var J5 = ["type"], e6 = ["dangerouslySetInnerHTML", "ticks", "scale"], t6 = ["id", "scale"];
function hh() {
  return hh = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, hh.apply(null, arguments);
}
function z1(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function B1(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? z1(Object(r), !0).forEach(function(n) {
      r6(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : z1(Object(r)).forEach(function(n) {
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
function ph(e, t) {
  if (e == null) return {};
  var r, n, o = a6(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (o[r] = e[r]);
  }
  return o;
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
function o6(e) {
  var t = rt(), r = w.useRef(null), n = Rh(), o = e.type, l = ph(e, J5), s = kc(n, "yAxis", o), c = w.useMemo(() => {
    if (s != null)
      return B1(B1({}, l), {}, {
        type: s
      });
  }, [s, l]);
  return w.useLayoutEffect(() => {
    c != null && (r.current === null ? t(WF(c)) : r.current !== c && t(UF({
      prev: r.current,
      next: c
    })), r.current = c);
  }, [c, t]), w.useLayoutEffect(() => () => {
    r.current && (t(HF(r.current)), r.current = null);
  }, [t]), null;
}
function l6(e) {
  var t = e.yAxisId, r = e.className, n = e.width, o = e.label, l = w.useRef(null), s = w.useRef(null), c = he(TS), f = $t(), d = rt(), h = "yAxis", p = he((E) => nR(E, t)), y = he((E) => rR(E, t)), x = he((E) => DP(E, h, t, f)), A = he((E) => eP(E, t));
  if (w.useLayoutEffect(() => {
    if (!(n !== "auto" || !p || Uc(o) || /* @__PURE__ */ w.isValidElement(o) || A == null)) {
      var E = l.current;
      if (E) {
        var k = E.getCalculatedWidth();
        Math.round(p.width) !== Math.round(k) && d(KF({
          id: t,
          width: k
        }));
      }
    }
  }, [
    // The dependency on cartesianAxisRef.current is not needed because useLayoutEffect will run after every render.
    // The ref will be populated by then.
    // To re-run this effect when ticks change, we can depend on the ticks array from the store.
    x,
    p,
    d,
    o,
    t,
    n,
    A
  ]), p == null || y == null || A == null)
    return null;
  e.dangerouslySetInnerHTML, e.ticks, e.scale;
  var S = ph(e, e6);
  A.id, A.scale;
  var b = ph(A, t6);
  return /* @__PURE__ */ w.createElement(Vp, hh({}, S, b, {
    ref: l,
    labelRef: s,
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
    ticks: x,
    axisType: h,
    axisId: t
  }));
}
var u6 = {
  allowDataOverflow: ut.allowDataOverflow,
  allowDecimals: ut.allowDecimals,
  allowDuplicatedCategory: ut.allowDuplicatedCategory,
  angle: ut.angle,
  axisLine: xn.axisLine,
  hide: !1,
  includeHidden: ut.includeHidden,
  interval: ut.interval,
  label: !1,
  minTickGap: ut.minTickGap,
  mirror: ut.mirror,
  orientation: ut.orientation,
  padding: ut.padding,
  reversed: ut.reversed,
  scale: ut.scale,
  tick: ut.tick,
  tickCount: ut.tickCount,
  tickLine: xn.tickLine,
  tickSize: xn.tickSize,
  type: ut.type,
  niceTicks: ut.niceTicks,
  width: ut.width,
  yAxisId: 0
}, s6 = (e) => {
  var t = qt(e, u6);
  return /* @__PURE__ */ w.createElement(w.Fragment, null, /* @__PURE__ */ w.createElement(o6, {
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
  }), /* @__PURE__ */ w.createElement(l6, t));
}, yO = /* @__PURE__ */ w.memo(s6, pO);
yO.displayName = "YAxis";
var c6 = (e, t) => t, em = z([c6, Be, hA, yt, ZP, Cn, Ez, Et], Tz);
function f6(e) {
  return "getBBox" in e.currentTarget && typeof e.currentTarget.getBBox == "function";
}
function tm(e) {
  var t = e.currentTarget.getBoundingClientRect(), r, n;
  if (f6(e)) {
    var o = e.currentTarget.getBBox();
    r = o.width > 0 ? t.width / o.width : 1, n = o.height > 0 ? t.height / o.height : 1;
  } else {
    var l = e.currentTarget;
    r = l.offsetWidth > 0 ? t.width / l.offsetWidth : 1, n = l.offsetHeight > 0 ? t.height / l.offsetHeight : 1;
  }
  var s = (c, f) => ({
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
  return "touches" in e ? Array.from(e.touches).map((c) => s(c.clientX, c.clientY)) : s(e.clientX, e.clientY);
}
var gO = lr("mouseClick"), xO = gl();
xO.startListening({
  actionCreator: gO,
  effect: (e, t) => {
    var r = e.payload, n = em(t.getState(), tm(r));
    (n == null ? void 0 : n.activeIndex) != null && t.dispatch(gR({
      activeIndex: n.activeIndex,
      activeDataKey: void 0,
      activeCoordinate: n.activeCoordinate
    }));
  }
});
var mh = lr("mouseMove"), wO = gl(), Sa = null, wi = null, Av = null;
wO.startListening({
  actionCreator: mh,
  effect: (e, t) => {
    var r = e.payload, n = t.getState(), o = n.eventSettings, l = o.throttleDelay, s = o.throttledEvents, c = s === "all" || (s == null ? void 0 : s.includes("mousemove"));
    Sa !== null && (cancelAnimationFrame(Sa), Sa = null), wi !== null && (typeof l != "number" || !c) && (clearTimeout(wi), wi = null), Av = tm(r);
    var f = () => {
      var d = t.getState(), h = Nl(d, d.tooltip.settings.shared);
      if (!Av) {
        Sa = null, wi = null;
        return;
      }
      if (h === "axis") {
        var p = em(d, Av);
        (p == null ? void 0 : p.activeIndex) != null ? t.dispatch(WP({
          activeIndex: p.activeIndex,
          activeDataKey: void 0,
          activeCoordinate: p.activeCoordinate
        })) : t.dispatch(FP());
      }
      Sa = null, wi = null;
    };
    if (!c) {
      f();
      return;
    }
    l === "raf" ? Sa = requestAnimationFrame(f) : typeof l == "number" && wi === null && (wi = setTimeout(f, l));
  }
});
function d6(e, t) {
  return t instanceof HTMLElement ? "HTMLElement <".concat(t.tagName, ' class="').concat(t.className, '">') : t === window ? "global.window" : e === "children" && typeof t == "object" && t !== null ? "<<CHILDREN>>" : t;
}
var F1 = {
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
}, bO = Dt({
  name: "rootProps",
  initialState: F1,
  reducers: {
    updateOptions: (e, t) => {
      var r;
      e.accessibilityLayer = t.payload.accessibilityLayer, e.barCategoryGap = t.payload.barCategoryGap, e.barGap = (r = t.payload.barGap) !== null && r !== void 0 ? r : F1.barGap, e.barSize = t.payload.barSize, e.maxBarSize = t.payload.maxBarSize, e.stackOffset = t.payload.stackOffset, e.syncId = t.payload.syncId, e.syncMethod = t.payload.syncMethod, e.className = t.payload.className, e.baseValue = t.payload.baseValue, e.reverseStackOrder = t.payload.reverseStackOrder;
    }
  }
}), v6 = bO.reducer, h6 = bO.actions.updateOptions, p6 = null, m6 = {
  updatePolarOptions: (e, t) => e === null ? t.payload : (e.startAngle = t.payload.startAngle, e.endAngle = t.payload.endAngle, e.cx = t.payload.cx, e.cy = t.payload.cy, e.innerRadius = t.payload.innerRadius, e.outerRadius = t.payload.outerRadius, e)
}, SO = Dt({
  name: "polarOptions",
  initialState: p6,
  reducers: m6
});
SO.actions.updatePolarOptions;
var y6 = SO.reducer, AO = lr("keyDown"), PO = lr("focus"), EO = lr("blur"), Yc = gl(), Aa = null, bi = null, as = null;
Yc.startListening({
  actionCreator: AO,
  effect: (e, t) => {
    as = e.payload, Aa !== null && (cancelAnimationFrame(Aa), Aa = null);
    var r = t.getState(), n = r.eventSettings, o = n.throttleDelay, l = n.throttledEvents, s = l === "all" || l.includes("keydown");
    bi !== null && (typeof o != "number" || !s) && (clearTimeout(bi), bi = null);
    var c = () => {
      try {
        var f = t.getState(), d = f.rootProps.accessibilityLayer !== !1;
        if (!d)
          return;
        var h = f.tooltip.keyboardInteraction, p = as;
        if (p !== "ArrowRight" && p !== "ArrowLeft" && p !== "Enter")
          return;
        var y = el(h, Ri(f), La(f), Ra(f)), x = y == null ? -1 : Number(y), A = !Number.isFinite(x) || x < 0, S = Cn(f), b = Ri(f), E = Nl(f, f.tooltip.settings.shared);
        if (p === "Enter") {
          if (A)
            return;
          var k = Ys(f, E, "hover", String(h.index));
          t.dispatch(Vs({
            active: !h.active,
            activeIndex: h.index,
            activeCoordinate: k
          }));
          return;
        }
        var C = uR(f), j = C === "left-to-right" ? 1 : -1, T = p === "ArrowRight" ? 1 : -1, O;
        if (A) {
          var _ = La(f), F = Ra(f), K = T * j, V = (we) => ({
            active: !1,
            index: String(we),
            dataKey: void 0,
            graphicalItemId: void 0,
            coordinate: void 0
          });
          if (O = -1, K > 0) {
            for (var q = 0; q < b.length; q++)
              if (el(V(q), b, _, F) != null) {
                O = q;
                break;
              }
          } else
            for (var W = b.length - 1; W >= 0; W--)
              if (el(V(W), b, _, F) != null) {
                O = W;
                break;
              }
          if (O < 0)
            return;
        } else {
          O = x + T * j;
          var ie = (S == null ? void 0 : S.length) || b.length;
          if (ie === 0 || O >= ie || O < 0)
            return;
        }
        var re = Ys(f, E, "hover", String(O));
        t.dispatch(Vs({
          active: !0,
          activeIndex: O.toString(),
          activeCoordinate: re
        }));
      } finally {
        Aa = null, bi = null;
      }
    };
    if (!s) {
      c();
      return;
    }
    o === "raf" ? Aa = requestAnimationFrame(c) : typeof o == "number" && bi === null && (c(), as = null, bi = setTimeout(() => {
      as ? c() : (bi = null, Aa = null);
    }, o));
  }
});
Yc.startListening({
  actionCreator: PO,
  effect: (e, t) => {
    var r = t.getState(), n = r.rootProps.accessibilityLayer !== !1;
    if (n) {
      var o = r.tooltip.keyboardInteraction;
      if (!o.active && o.index == null) {
        var l = "0", s = Nl(r, r.tooltip.settings.shared), c = Ys(r, s, "hover", String(l));
        t.dispatch(Vs({
          active: !0,
          activeIndex: l,
          activeCoordinate: c
        }));
      }
    }
  }
});
Yc.startListening({
  actionCreator: EO,
  effect: (e, t) => {
    var r = t.getState(), n = r.rootProps.accessibilityLayer !== !1;
    if (n) {
      var o = r.tooltip.keyboardInteraction;
      o.active && t.dispatch(Vs({
        active: !1,
        activeIndex: o.index,
        activeCoordinate: o.coordinate
      }));
    }
  }
});
function OO(e) {
  e.persist();
  var t = e.currentTarget;
  return new Proxy(e, {
    get: (r, n) => {
      if (n === "currentTarget")
        return t;
      var o = Reflect.get(r, n);
      return typeof o == "function" ? o.bind(r) : o;
    }
  });
}
var hr = lr("externalEvent"), kO = gl(), os = /* @__PURE__ */ new Map(), Yo = /* @__PURE__ */ new Map(), Pv = /* @__PURE__ */ new Map();
kO.startListening({
  actionCreator: hr,
  effect: (e, t) => {
    var r = e.payload, n = r.handler, o = r.reactEvent;
    if (n != null) {
      var l = o.type, s = OO(o);
      Pv.set(l, {
        handler: n,
        reactEvent: s
      });
      var c = os.get(l);
      c !== void 0 && (cancelAnimationFrame(c), os.delete(l));
      var f = t.getState(), d = f.eventSettings, h = d.throttleDelay, p = d.throttledEvents, y = p, x = y === "all" || (y == null ? void 0 : y.includes(l)), A = Yo.get(l);
      A !== void 0 && (typeof h != "number" || !x) && (clearTimeout(A), Yo.delete(l));
      var S = () => {
        var k = Pv.get(l);
        try {
          if (!k)
            return;
          var C = k.handler, j = k.reactEvent, T = t.getState(), O = {
            activeCoordinate: cz(T),
            activeDataKey: lz(T),
            activeIndex: hl(T),
            activeLabel: tE(T),
            activeTooltipIndex: hl(T),
            isTooltipActive: fz(T)
          };
          C && C(O, j);
        } finally {
          os.delete(l), Yo.delete(l), Pv.delete(l);
        }
      };
      if (!x) {
        S();
        return;
      }
      if (h === "raf") {
        var b = requestAnimationFrame(S);
        os.set(l, b);
      } else if (typeof h == "number") {
        if (!Yo.has(l)) {
          S();
          var E = setTimeout(S, h);
          Yo.set(l, E);
        }
      } else
        S();
    }
  }
});
var g6 = z([Ga], (e) => e.tooltipItemPayloads), x6 = z([g6, (e, t) => t, (e, t, r) => r], (e, t, r) => {
  if (t != null) {
    var n = e.find((l) => l.settings.graphicalItemId === r);
    if (n != null) {
      var o = n.getPosition;
      if (o != null)
        return o(t);
    }
  }
}), _O = lr("touchMove"), CO = gl(), Si = null, Xn = null, W1 = null, Go = null;
CO.startListening({
  actionCreator: _O,
  effect: (e, t) => {
    var r = e.payload;
    if (!(r.touches == null || r.touches.length === 0)) {
      Go = OO(r);
      var n = t.getState(), o = n.eventSettings, l = o.throttleDelay, s = o.throttledEvents, c = s === "all" || s.includes("touchmove");
      Si !== null && (cancelAnimationFrame(Si), Si = null), Xn !== null && (typeof l != "number" || !c) && (clearTimeout(Xn), Xn = null), W1 = Array.from(r.touches).map((d) => tm({
        clientX: d.clientX,
        clientY: d.clientY,
        currentTarget: r.currentTarget
      }));
      var f = () => {
        if (Go != null) {
          var d = t.getState(), h = Nl(d, d.tooltip.settings.shared);
          if (h === "axis") {
            var p, y = (p = W1) === null || p === void 0 ? void 0 : p[0];
            if (y == null) {
              Si = null, Xn = null;
              return;
            }
            var x = em(d, y);
            (x == null ? void 0 : x.activeIndex) != null && t.dispatch(WP({
              activeIndex: x.activeIndex,
              activeDataKey: void 0,
              activeCoordinate: x.activeCoordinate
            }));
          } else if (h === "item") {
            var A, S = Go.touches[0];
            if (document.elementFromPoint == null || S == null)
              return;
            var b = document.elementFromPoint(S.clientX, S.clientY);
            if (!b || !b.getAttribute)
              return;
            var E = b.getAttribute(tT), k = (A = b.getAttribute(rT)) !== null && A !== void 0 ? A : void 0, C = Ki(d).find((O) => O.id === k);
            if (E == null || C == null || k == null)
              return;
            var j = C.dataKey, T = x6(d, E, k);
            t.dispatch(yR({
              activeDataKey: j,
              activeIndex: E,
              activeCoordinate: T,
              activeGraphicalItemId: k
            }));
          }
          Si = null, Xn = null;
        }
      };
      if (!c) {
        f();
        return;
      }
      l === "raf" ? Si = requestAnimationFrame(f) : typeof l == "number" && Xn === null && (f(), Go = null, Xn = setTimeout(() => {
        Go ? f() : (Xn = null, Si = null);
      }, l));
    }
  }
});
var IO = {
  throttleDelay: "raf",
  throttledEvents: ["mousemove", "touchmove", "pointermove", "scroll", "wheel"]
}, jO = Dt({
  name: "eventSettings",
  initialState: IO,
  reducers: {
    setEventSettings: (e, t) => {
      t.payload.throttleDelay != null && (e.throttleDelay = t.payload.throttleDelay), t.payload.throttledEvents != null && (e.throttledEvents = Ne(t.payload.throttledEvents));
    }
  }
}), w6 = jO.actions.setEventSettings, b6 = jO.reducer, S6 = eS({
  brush: r4,
  cartesianAxis: YF,
  chartData: s3,
  errorBars: O8,
  eventSettings: b6,
  graphicalItems: EF,
  layout: zj,
  legend: WT,
  options: i3,
  polarAxis: FB,
  polarOptions: y6,
  referenceElements: o4,
  renderedTicks: T4,
  rootProps: v6,
  tooltip: xR,
  zIndex: Kz
}), A6 = function(t) {
  var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "Chart";
  return cj({
    reducer: S6,
    // redux-toolkit v1 types are unhappy with the preloadedState type. Remove the `as any` when bumping to v2
    preloadedState: t,
    // @ts-expect-error redux-toolkit v1 types are unhappy with the middleware array. Remove this comment when bumping to v2
    middleware: (n) => {
      var o;
      return n({
        serializableCheck: !1,
        immutableCheck: !["commonjs", "es6", "production"].includes((o = "es6") !== null && o !== void 0 ? o : "")
      }).concat([xO.middleware, wO.middleware, Yc.middleware, kO.middleware, CO.middleware]);
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
      var o = n;
      return typeof n == "function" && (o = n()), o.concat(pS({
        type: "raf"
      }));
    },
    devTools: {
      serialize: {
        replacer: d6
      },
      name: "recharts-".concat(r)
    }
  });
};
function P6(e) {
  var t = e.preloadedState, r = e.children, n = e.reduxStoreName, o = $t(), l = w.useRef(null);
  if (o)
    return r;
  l.current == null && (l.current = A6(t, n));
  var s = Ch;
  return /* @__PURE__ */ w.createElement(iN, {
    context: s,
    store: l.current
  }, r);
}
function E6(e) {
  var t = e.layout, r = e.margin, n = rt(), o = $t();
  return w.useEffect(() => {
    o || (n($j(t)), n(Dj(r)));
  }, [n, o, t, r]), null;
}
var O6 = /* @__PURE__ */ w.memo(E6, Sl);
function k6(e) {
  var t = rt();
  return w.useEffect(() => {
    t(h6(e));
  }, [t, e]), null;
}
var _6 = (e) => {
  var t = rt();
  return w.useEffect(() => {
    t(w6(e));
  }, [t, e]), null;
}, C6 = /* @__PURE__ */ w.memo(_6, Sl);
function U1(e) {
  var t = e.zIndex, r = e.isPanorama, n = w.useRef(null), o = rt();
  return w.useLayoutEffect(() => (n.current && o(Uz({
    zIndex: t,
    element: n.current,
    isPanorama: r
  })), () => {
    o(Hz({
      zIndex: t,
      isPanorama: r
    }));
  }), [o, t, r]), /* @__PURE__ */ w.createElement("g", {
    tabIndex: -1,
    ref: n,
    className: "recharts-zIndex-layer_".concat(t)
  });
}
function H1(e) {
  var t = e.children, r = e.isPanorama, n = he(Mz);
  if (!n || n.length === 0)
    return t;
  var o = n.filter((s) => s < 0), l = n.filter((s) => s > 0);
  return /* @__PURE__ */ w.createElement(w.Fragment, null, o.map((s) => /* @__PURE__ */ w.createElement(U1, {
    key: s,
    zIndex: s,
    isPanorama: r
  })), t, l.map((s) => /* @__PURE__ */ w.createElement(U1, {
    key: s,
    zIndex: s,
    isPanorama: r
  })));
}
var I6 = ["children"];
function j6(e, t) {
  if (e == null) return {};
  var r, n, o = T6(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (o[r] = e[r]);
  }
  return o;
}
function T6(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
function tc() {
  return tc = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, tc.apply(null, arguments);
}
var N6 = {
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
}, M6 = /* @__PURE__ */ w.forwardRef((e, t) => {
  var r = LS(), n = RS(), o = WS();
  if (!en(r) || !en(n))
    return null;
  var l = e.children, s = e.otherAttributes, c = e.title, f = e.desc, d, h;
  return s != null && (typeof s.tabIndex == "number" ? d = s.tabIndex : d = o ? 0 : void 0, typeof s.role == "string" ? h = s.role : h = o ? "application" : void 0), /* @__PURE__ */ w.createElement(ib, tc({}, s, {
    title: c,
    desc: f,
    role: h,
    tabIndex: d,
    width: r,
    height: n,
    style: N6,
    ref: t
  }), l);
}), D6 = (e) => {
  var t = e.children, r = he(Ac);
  if (!r)
    return null;
  var n = r.width, o = r.height, l = r.y, s = r.x;
  return /* @__PURE__ */ w.createElement(ib, {
    width: n,
    height: o,
    x: s,
    y: l
  }, t);
}, K1 = /* @__PURE__ */ w.forwardRef((e, t) => {
  var r = e.children, n = j6(e, I6), o = $t();
  return o ? /* @__PURE__ */ w.createElement(D6, null, /* @__PURE__ */ w.createElement(H1, {
    isPanorama: !0
  }, r)) : /* @__PURE__ */ w.createElement(M6, tc({
    ref: t
  }, n), /* @__PURE__ */ w.createElement(H1, {
    isPanorama: !1
  }, r));
});
function $6(e, t) {
  return B6(e) || z6(e, t) || R6(e, t) || L6();
}
function L6() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function R6(e, t) {
  if (e) {
    if (typeof e == "string") return V1(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? V1(e, t) : void 0;
  }
}
function V1(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function z6(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, o, l, s, c = [], f = !0, d = !1;
    try {
      if (l = (r = r.call(e)).next, t !== 0) for (; !(f = (n = l.call(r)).done) && (c.push(n.value), c.length !== t); f = !0) ;
    } catch (h) {
      d = !0, o = h;
    } finally {
      try {
        if (!f && r.return != null && (s = r.return(), Object(s) !== s)) return;
      } finally {
        if (d) throw o;
      }
    }
    return c;
  }
}
function B6(e) {
  if (Array.isArray(e)) return e;
}
function F6() {
  var e = rt(), t = w.useState(null), r = $6(t, 2), n = r[0], o = r[1], l = he(eT);
  return w.useEffect(() => {
    if (n != null) {
      var s = n.getBoundingClientRect(), c = s.width / n.offsetWidth;
      ke(c) && c !== l && e(Rj(c));
    }
  }, [n, e, l]), o;
}
function Y1(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function W6(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Y1(Object(r), !0).forEach(function(n) {
      U6(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Y1(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function U6(e, t, r) {
  return (t = H6(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function H6(e) {
  var t = K6(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function K6(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function ri() {
  return ri = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, ri.apply(null, arguments);
}
function rc(e, t) {
  return X6(e) || G6(e, t) || Y6(e, t) || V6();
}
function V6() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Y6(e, t) {
  if (e) {
    if (typeof e == "string") return G1(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? G1(e, t) : void 0;
  }
}
function G1(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function G6(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, o, l, s, c = [], f = !0, d = !1;
    try {
      if (l = (r = r.call(e)).next, t !== 0) for (; !(f = (n = l.call(r)).done) && (c.push(n.value), c.length !== t); f = !0) ;
    } catch (h) {
      d = !0, o = h;
    } finally {
      try {
        if (!f && r.return != null && (s = r.return(), Object(s) !== s)) return;
      } finally {
        if (d) throw o;
      }
    }
    return c;
  }
}
function X6(e) {
  if (Array.isArray(e)) return e;
}
var q6 = () => (g3(), null);
function nc(e) {
  if (typeof e == "number")
    return e;
  if (typeof e == "string") {
    var t = parseFloat(e);
    if (!Number.isNaN(t))
      return t;
  }
  return 0;
}
var Q6 = /* @__PURE__ */ w.forwardRef((e, t) => {
  var r, n, o = w.useRef(null), l = w.useState({
    containerWidth: nc((r = e.style) === null || r === void 0 ? void 0 : r.width),
    containerHeight: nc((n = e.style) === null || n === void 0 ? void 0 : n.height)
  }), s = rc(l, 2), c = s[0], f = s[1], d = w.useCallback((p, y) => {
    f((x) => {
      var A = Math.round(p), S = Math.round(y);
      return x.containerWidth === A && x.containerHeight === S ? x : {
        containerWidth: A,
        containerHeight: S
      };
    });
  }, []), h = w.useCallback((p) => {
    if (typeof t == "function" && t(p), o.current != null && (o.current.disconnect(), o.current = null), p != null && typeof ResizeObserver < "u") {
      var y = p.getBoundingClientRect(), x = y.width, A = y.height;
      d(x, A);
      var S = (E) => {
        var k = E[0];
        if (k != null) {
          var C = k.contentRect, j = C.width, T = C.height;
          d(j, T);
        }
      }, b = new ResizeObserver(S);
      b.observe(p), o.current = b;
    }
  }, [t, d]);
  return w.useEffect(() => () => {
    var p = o.current;
    p != null && p.disconnect();
  }, [d]), /* @__PURE__ */ w.createElement(w.Fragment, null, /* @__PURE__ */ w.createElement(wl, {
    width: c.containerWidth,
    height: c.containerHeight
  }), /* @__PURE__ */ w.createElement("div", ri({
    ref: h
  }, e)));
}), Z6 = /* @__PURE__ */ w.forwardRef((e, t) => {
  var r = e.width, n = e.height, o = w.useState({
    containerWidth: nc(r),
    containerHeight: nc(n)
  }), l = rc(o, 2), s = l[0], c = l[1], f = w.useCallback((h, p) => {
    c((y) => {
      var x = Math.round(h), A = Math.round(p);
      return y.containerWidth === x && y.containerHeight === A ? y : {
        containerWidth: x,
        containerHeight: A
      };
    });
  }, []), d = w.useCallback((h) => {
    if (typeof t == "function" && t(h), h != null) {
      var p = h.getBoundingClientRect(), y = p.width, x = p.height;
      f(y, x);
    }
  }, [t, f]);
  return /* @__PURE__ */ w.createElement(w.Fragment, null, /* @__PURE__ */ w.createElement(wl, {
    width: s.containerWidth,
    height: s.containerHeight
  }), /* @__PURE__ */ w.createElement("div", ri({
    ref: d
  }, e)));
}), J6 = /* @__PURE__ */ w.forwardRef((e, t) => {
  var r = e.width, n = e.height;
  return /* @__PURE__ */ w.createElement(w.Fragment, null, /* @__PURE__ */ w.createElement(wl, {
    width: r,
    height: n
  }), /* @__PURE__ */ w.createElement("div", ri({
    ref: t
  }, e)));
}), eW = /* @__PURE__ */ w.forwardRef((e, t) => {
  var r = e.width, n = e.height;
  return typeof r == "string" || typeof n == "string" ? /* @__PURE__ */ w.createElement(Z6, ri({}, e, {
    ref: t
  })) : typeof r == "number" && typeof n == "number" ? /* @__PURE__ */ w.createElement(J6, ri({}, e, {
    width: r,
    height: n,
    ref: t
  })) : /* @__PURE__ */ w.createElement(w.Fragment, null, /* @__PURE__ */ w.createElement(wl, {
    width: r,
    height: n
  }), /* @__PURE__ */ w.createElement("div", ri({
    ref: t
  }, e)));
});
function tW(e) {
  return e ? Q6 : eW;
}
var rW = /* @__PURE__ */ w.forwardRef((e, t) => {
  var r = e.children, n = e.className, o = e.height, l = e.onClick, s = e.onContextMenu, c = e.onDoubleClick, f = e.onMouseDown, d = e.onMouseEnter, h = e.onMouseLeave, p = e.onMouseMove, y = e.onMouseUp, x = e.onTouchEnd, A = e.onTouchMove, S = e.onTouchStart, b = e.style, E = e.width, k = e.responsive, C = e.dispatchTouchEvents, j = C === void 0 ? !0 : C, T = w.useRef(null), O = rt(), _ = w.useState(null), F = rc(_, 2), K = F[0], V = F[1], q = w.useState(null), W = rc(q, 2), ie = W[0], re = W[1], we = F6(), ve = Lh(), ae = (ve == null ? void 0 : ve.width) > 0 ? ve.width : E, U = (ve == null ? void 0 : ve.height) > 0 ? ve.height : o, te = w.useCallback((xe) => {
    we(xe), typeof t == "function" && t(xe), V(xe), re(xe), xe != null && (T.current = xe);
  }, [we, t, V, re]), Y = w.useCallback((xe) => {
    O(gO(xe)), O(hr({
      handler: l,
      reactEvent: xe
    }));
  }, [O, l]), $ = w.useCallback((xe) => {
    O(mh(xe)), O(hr({
      handler: d,
      reactEvent: xe
    }));
  }, [O, d]), H = w.useCallback((xe) => {
    O(FP()), O(hr({
      handler: h,
      reactEvent: xe
    }));
  }, [O, h]), fe = w.useCallback((xe) => {
    O(mh(xe)), O(hr({
      handler: p,
      reactEvent: xe
    }));
  }, [O, p]), ge = w.useCallback(() => {
    O(PO());
  }, [O]), Ae = w.useCallback(() => {
    O(EO());
  }, [O]), Pe = w.useCallback((xe) => {
    O(AO(xe.key));
  }, [O]), Ee = w.useCallback((xe) => {
    O(hr({
      handler: s,
      reactEvent: xe
    }));
  }, [O, s]), _e = w.useCallback((xe) => {
    O(hr({
      handler: c,
      reactEvent: xe
    }));
  }, [O, c]), J = w.useCallback((xe) => {
    O(hr({
      handler: f,
      reactEvent: xe
    }));
  }, [O, f]), pe = w.useCallback((xe) => {
    O(hr({
      handler: y,
      reactEvent: xe
    }));
  }, [O, y]), be = w.useCallback((xe) => {
    O(hr({
      handler: S,
      reactEvent: xe
    }));
  }, [O, S]), Z = w.useCallback((xe) => {
    j && O(_O(xe)), O(hr({
      handler: A,
      reactEvent: xe
    }));
  }, [O, j, A]), Ze = w.useCallback((xe) => {
    O(hr({
      handler: x,
      reactEvent: xe
    }));
  }, [O, x]), je = tW(k);
  return /* @__PURE__ */ w.createElement(sE.Provider, {
    value: K
  }, /* @__PURE__ */ w.createElement(uC.Provider, {
    value: ie
  }, /* @__PURE__ */ w.createElement(je, {
    width: ae ?? (b == null ? void 0 : b.width),
    height: U ?? (b == null ? void 0 : b.height),
    className: ze("recharts-wrapper", n),
    style: W6({
      position: "relative",
      cursor: "default",
      width: ae,
      height: U
    }, b),
    onClick: Y,
    onContextMenu: Ee,
    onDoubleClick: _e,
    onFocus: ge,
    onBlur: Ae,
    onKeyDown: Pe,
    onMouseDown: J,
    onMouseEnter: $,
    onMouseLeave: H,
    onMouseMove: fe,
    onMouseUp: pe,
    onTouchEnd: Ze,
    onTouchMove: Z,
    onTouchStart: be,
    ref: te
  }, /* @__PURE__ */ w.createElement(q6, null), r)));
}), nW = ["width", "height", "responsive", "children", "className", "style", "compact", "title", "desc"];
function iW(e, t) {
  if (e == null) return {};
  var r, n, o = aW(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (n = 0; n < l.length; n++) r = l[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (o[r] = e[r]);
  }
  return o;
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
var oW = /* @__PURE__ */ w.forwardRef((e, t) => {
  var r = e.width, n = e.height, o = e.responsive, l = e.children, s = e.className, c = e.style, f = e.compact, d = e.title, h = e.desc, p = iW(e, nW), y = gr(p);
  return f ? /* @__PURE__ */ w.createElement(w.Fragment, null, /* @__PURE__ */ w.createElement(wl, {
    width: r,
    height: n
  }), /* @__PURE__ */ w.createElement(K1, {
    otherAttributes: y,
    title: d,
    desc: h
  }, l)) : /* @__PURE__ */ w.createElement(rW, {
    className: s,
    style: c,
    width: r,
    height: n,
    responsive: o ?? !1,
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
  }, /* @__PURE__ */ w.createElement(K1, {
    otherAttributes: y,
    title: d,
    desc: h,
    ref: t
  }, /* @__PURE__ */ w.createElement(v4, null, l)));
});
function yh() {
  return yh = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, yh.apply(null, arguments);
}
function X1(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function lW(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? X1(Object(r), !0).forEach(function(n) {
      uW(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : X1(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function uW(e, t, r) {
  return (t = sW(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function sW(e) {
  var t = cW(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function cW(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var fW = {
  top: 5,
  right: 5,
  bottom: 5,
  left: 5
}, dW = lW({
  accessibilityLayer: !0,
  barCategoryGap: "10%",
  barGap: 4,
  layout: "horizontal",
  margin: fW,
  responsive: !1,
  reverseStackOrder: !1,
  stackOffset: "none",
  syncMethod: "index"
}, IO), vW = /* @__PURE__ */ w.forwardRef(function(t, r) {
  var n, o = qt(t.categoricalChartProps, dW), l = t.chartName, s = t.defaultTooltipEventType, c = t.validateTooltipEventTypes, f = t.tooltipPayloadSearcher, d = t.categoricalChartProps, h = {
    chartName: l,
    defaultTooltipEventType: s,
    validateTooltipEventTypes: c,
    tooltipPayloadSearcher: f,
    eventEmitter: void 0
  };
  return /* @__PURE__ */ w.createElement(P6, {
    preloadedState: {
      options: h
    },
    reduxStoreName: (n = d.id) !== null && n !== void 0 ? n : l
  }, /* @__PURE__ */ w.createElement(t4, {
    chartData: d.data
  }), /* @__PURE__ */ w.createElement(O6, {
    layout: o.layout,
    margin: o.margin
  }), /* @__PURE__ */ w.createElement(C6, {
    throttleDelay: o.throttleDelay,
    throttledEvents: o.throttledEvents
  }), /* @__PURE__ */ w.createElement(k6, {
    baseValue: o.baseValue,
    accessibilityLayer: o.accessibilityLayer,
    barCategoryGap: o.barCategoryGap,
    maxBarSize: o.maxBarSize,
    stackOffset: o.stackOffset,
    barGap: o.barGap,
    barSize: o.barSize,
    syncId: o.syncId,
    syncMethod: o.syncMethod,
    className: o.className,
    reverseStackOrder: o.reverseStackOrder
  }), /* @__PURE__ */ w.createElement(oW, yh({}, o, {
    ref: r
  })));
}), hW = ["axis"], pW = /* @__PURE__ */ w.forwardRef((e, t) => /* @__PURE__ */ w.createElement(vW, {
  chartName: "ComposedChart",
  defaultTooltipEventType: "axis",
  validateTooltipEventTypes: hW,
  tooltipPayloadSearcher: r3,
  categoricalChartProps: e,
  ref: t
}));
async function mW(e) {
  const t = new URLSearchParams(), r = { entryStart: "entry_start", entryEnd: "entry_end", resolutionStart: "resolution_start", resolutionEnd: "resolution_end", state: "state", resolution: "resolution", cnj: "cnj", integration: "integration", product: "product", situation: "situation", attention: "attention", groupBy: "group_by", page: "page", pageSize: "page_size", sortBy: "sort_by", sortDirection: "sort_direction" };
  if (Object.keys(e).forEach((n) => {
    e[n] !== "" && t.set(r[n], String(e[n]));
  }), !window.MBA_AUTOMATION_API) throw new Error("Serviço indisponível.");
  return await window.MBA_AUTOMATION_API.request(`/api/carteira-processual?${t}`);
}
const yW = new Intl.NumberFormat("pt-BR"), gW = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }), Jn = (e) => yW.format(e), q1 = (e) => gW.format(e), Ev = (e) => e.split("-").reverse().join("/");
async function xW(e = 1, t = "") {
  if (!window.MBA_AUTOMATION_API) throw new Error("Serviço indisponível.");
  return await window.MBA_AUTOMATION_API.request(`/api/acordos-indicadores?page=${e}&page_size=10&origem_acordo=${encodeURIComponent(t)}`);
}
function hn({ label: e, value: t, note: r }) {
  return /* @__PURE__ */ N.jsxs("div", { className: "metric", children: [
    /* @__PURE__ */ N.jsx("span", { children: e }),
    /* @__PURE__ */ N.jsx("strong", { children: t }),
    r && /* @__PURE__ */ N.jsx("small", { children: r })
  ] });
}
function ei({ title: e, children: t }) {
  return /* @__PURE__ */ N.jsxs("section", { className: "chart-panel", children: [
    /* @__PURE__ */ N.jsx("h2", { children: e }),
    t
  ] });
}
function Ia({ items: e }) {
  const t = Math.max(...e.map((r) => r.value), 1);
  return e.length ? /* @__PURE__ */ N.jsx("div", { className: "horizontal-bars", children: e.map((r) => /* @__PURE__ */ N.jsxs("div", { className: "bar-row", children: [
    /* @__PURE__ */ N.jsxs("div", { children: [
      /* @__PURE__ */ N.jsx("span", { children: r.label }),
      /* @__PURE__ */ N.jsx("strong", { children: Jn(r.value) })
    ] }),
    /* @__PURE__ */ N.jsx("div", { className: "bar-track", children: /* @__PURE__ */ N.jsx("span", { style: { width: `${r.value / t * 100}%` } }) })
  ] }, r.label)) }) : /* @__PURE__ */ N.jsx("p", { className: "empty-state", children: "Nenhum registro neste recorte." });
}
function wW() {
  const [e, t] = w.useState(null), [r, n] = w.useState(""), [o, l] = w.useState(1), [s, c] = w.useState(""), [f, d] = w.useState(0);
  return w.useEffect(() => {
    let h = !0;
    return t(null), c(""), xW(o, r).then((p) => {
      h && t(p);
    }).catch(() => {
      h && c("Não foi possível carregar os acordos.");
    }), () => {
      h = !1;
    };
  }, [o, r, f]), /* @__PURE__ */ N.jsxs("section", { className: "executive-agreements", id: "executive-agreements", children: [
    /* @__PURE__ */ N.jsxs("header", { className: "section-heading", children: [
      /* @__PURE__ */ N.jsxs("div", { children: [
        /* @__PURE__ */ N.jsx("p", { className: "eyebrow", children: "Visão executiva" }),
        /* @__PURE__ */ N.jsx("h2", { children: "Acordos em tratativa" }),
        /* @__PURE__ */ N.jsx("p", { children: "Resultados da carteira de acordos. Preditivos em saneamento são acompanhados separadamente." })
      ] }),
      /* @__PURE__ */ N.jsxs("label", { children: [
        "Origem",
        /* @__PURE__ */ N.jsxs("select", { value: r, onChange: (h) => {
          n(h.target.value), l(1);
        }, children: [
          /* @__PURE__ */ N.jsx("option", { value: "", children: "Todas as origens" }),
          /* @__PURE__ */ N.jsx("option", { value: "terceirizado", children: "Terceirizado" }),
          /* @__PURE__ */ N.jsx("option", { value: "interno", children: "Interno" })
        ] })
      ] })
    ] }),
    s ? /* @__PURE__ */ N.jsxs("div", { className: "error-state", role: "alert", children: [
      s,
      /* @__PURE__ */ N.jsx("button", { onClick: () => d((h) => h + 1), children: "Tentar novamente" })
    ] }) : e ? /* @__PURE__ */ N.jsxs(N.Fragment, { children: [
      /* @__PURE__ */ N.jsxs("div", { className: "metrics metrics-five", children: [
        /* @__PURE__ */ N.jsx(hn, { label: "Total de acordos", value: Jn(e.summary.total) }),
        /* @__PURE__ */ N.jsx(hn, { label: "Ticket médio das propostas", value: e.summary.ticket_medio === null ? "—" : q1(e.summary.ticket_medio) }),
        /* @__PURE__ */ N.jsx(hn, { label: "Acordos fechados", value: Jn(e.summary.fechados) }),
        /* @__PURE__ */ N.jsx(hn, { label: "Em negociação", value: Jn(e.summary.em_negociacao) }),
        /* @__PURE__ */ N.jsx(hn, { label: "Acordos recusados", value: Jn(e.summary.recusados) })
      ] }),
      /* @__PURE__ */ N.jsxs("div", { className: "composition-grid", children: [
        /* @__PURE__ */ N.jsx(ei, { title: "Por situação", children: /* @__PURE__ */ N.jsx(Ia, { items: e.por_situacao }) }),
        /* @__PURE__ */ N.jsx(ei, { title: "Por tarefa", children: /* @__PURE__ */ N.jsx(Ia, { items: e.por_tarefa }) }),
        /* @__PURE__ */ N.jsx(ei, { title: "Por tipo", children: /* @__PURE__ */ N.jsx(Ia, { items: e.por_tipo }) })
      ] }),
      /* @__PURE__ */ N.jsxs("details", { className: "agreement-records", children: [
        /* @__PURE__ */ N.jsxs("summary", { children: [
          "Consultar ",
          Jn(e.table.total),
          " registros de acordos"
        ] }),
        /* @__PURE__ */ N.jsx("div", { className: "table-scroll", children: /* @__PURE__ */ N.jsxs("table", { children: [
          /* @__PURE__ */ N.jsx("thead", { children: /* @__PURE__ */ N.jsxs("tr", { children: [
            /* @__PURE__ */ N.jsx("th", { children: "CNJ" }),
            /* @__PURE__ */ N.jsx("th", { children: "Situação" }),
            /* @__PURE__ */ N.jsx("th", { children: "Tipo" }),
            /* @__PURE__ */ N.jsx("th", { children: "Tarefa" }),
            /* @__PURE__ */ N.jsx("th", { children: "Proposta" }),
            /* @__PURE__ */ N.jsx("th", { children: "Origem" })
          ] }) }),
          /* @__PURE__ */ N.jsx("tbody", { children: e.table.rows.length ? e.table.rows.map((h) => /* @__PURE__ */ N.jsxs("tr", { children: [
            /* @__PURE__ */ N.jsx("td", { children: h.cnj || "—" }),
            /* @__PURE__ */ N.jsx("td", { children: h.situacao || "—" }),
            /* @__PURE__ */ N.jsx("td", { children: h.tipo || "—" }),
            /* @__PURE__ */ N.jsx("td", { children: h.tarefa || "—" }),
            /* @__PURE__ */ N.jsx("td", { children: h.proposta === null ? "—" : q1(h.proposta) }),
            /* @__PURE__ */ N.jsx("td", { children: h.origem_acordo })
          ] }, h.id)) : /* @__PURE__ */ N.jsx("tr", { children: /* @__PURE__ */ N.jsx("td", { colSpan: 6, children: "Nenhum acordo nesta origem." }) }) })
        ] }) }),
        /* @__PURE__ */ N.jsxs("div", { className: "pagination", children: [
          /* @__PURE__ */ N.jsxs("span", { children: [
            "Página ",
            o,
            " de ",
            Math.max(1, e.table.total_pages)
          ] }),
          /* @__PURE__ */ N.jsx("button", { disabled: o <= 1, onClick: () => l((h) => h - 1), children: "Anterior" }),
          /* @__PURE__ */ N.jsx("button", { disabled: o >= e.table.total_pages, onClick: () => l((h) => h + 1), children: "Próxima" })
        ] })
      ] })
    ] }) : /* @__PURE__ */ N.jsx("div", { className: "loading-state", role: "status", children: "Carregando acordos…" })
  ] });
}
const Ov = { entryStart: "", entryEnd: "", resolutionStart: "", resolutionEnd: "", state: "", resolution: "", cnj: "", integration: "", product: "", situation: "", attention: "", groupBy: "month", page: 1, pageSize: 25, sortBy: "date", sortDirection: "desc" }, Q1 = ["Carteira Processual", "Entradas", "Encerramentos", "Auditoria"];
function bW() {
  const [e, t] = w.useState({ ...Ov, cnj: window.MBA_PORTFOLIO_SEARCH || "" }), [r, n] = w.useState(null), [o, l] = w.useState(""), [s, c] = w.useState(!0), [f, d] = w.useState(0), [h, p] = w.useState(0), [y, x] = w.useState("entry"), A = w.useRef(null);
  w.useEffect(() => {
    var _;
    window.MBA_PORTFOLIO_SECTION === "agreements" && ((_ = document.getElementById("executive-agreements")) == null || _.scrollIntoView(), window.MBA_PORTFOLIO_SECTION = void 0);
  }, []), w.useEffect(() => {
    let _ = !0;
    return c(!0), l(""), mW(e).then((F) => {
      _ && n(F);
    }).catch(() => {
      _ && (n(null), l("Não foi possível carregar a carteira. Tente novamente."));
    }).finally(() => {
      _ && c(!1);
    }), () => {
      _ = !1;
    };
  }, [e, f]);
  const S = (_) => t((F) => ({ ...F, ..._, page: _.page ?? 1 }));
  w.useEffect(() => {
    const _ = (F) => {
      var K;
      t((V) => ({ ...V, cnj: F.detail, page: 1 })), (K = A.current) == null || K.scrollIntoView({ behavior: "smooth" });
    };
    return window.addEventListener("mba:portfolio-search", _), () => window.removeEventListener("mba:portfolio-search", _);
  }, []);
  const b = (_) => {
    p(_), x(_ === 2 ? "resolution" : "entry"), S({ ...Ov, cnj: e.cnj, attention: _ === 3 ? "divergent" : "" });
  }, E = y === "entry" ? e.entryStart : e.resolutionStart, k = y === "entry" ? e.entryEnd : e.resolutionEnd, C = (_) => {
    x(_), S({ entryStart: _ === "entry" ? E : "", entryEnd: _ === "entry" ? k : "", resolutionStart: _ === "resolution" ? E : "", resolutionEnd: _ === "resolution" ? k : "" });
  }, j = (_) => {
    var F;
    S({ attention: _ }), (F = A.current) == null || F.scrollIntoView({ behavior: "smooth" });
  }, T = (_) => _ === void 0 ? "—" : Jn(_), O = r == null ? void 0 : r.attention.closures_below_average;
  return /* @__PURE__ */ N.jsxs("div", { className: "portfolio", children: [
    /* @__PURE__ */ N.jsx("nav", { className: "context-nav", "aria-label": "Gestão Processual", children: Q1.map((_, F) => /* @__PURE__ */ N.jsx("button", { "aria-current": h === F ? "page" : void 0, onClick: () => b(F), children: _ }, _)) }),
    /* @__PURE__ */ N.jsxs("header", { className: "portfolio-heading", children: [
      /* @__PURE__ */ N.jsxs("div", { children: [
        /* @__PURE__ */ N.jsx("p", { className: "eyebrow", children: "Gestão Processual" }),
        /* @__PURE__ */ N.jsx("h1", { children: Q1[h] }),
        /* @__PURE__ */ N.jsx("p", { children: "Visão consolidada da base operacional." })
      ] }),
      /* @__PURE__ */ N.jsxs("div", { className: "data-status", children: [
        /* @__PURE__ */ N.jsx("span", { className: o ? "status-dot error" : "status-dot" }),
        s ? "Atualizando…" : o ? "Dados indisponíveis" : "Dados carregados",
        /* @__PURE__ */ N.jsx("small", { children: r != null && r.updated_at ? `Última atualização: ${new Date(r.updated_at).toLocaleString("pt-BR")}` : "Última atualização não informada" })
      ] })
    ] }),
    /* @__PURE__ */ N.jsxs("section", { className: "portfolio-filters", "aria-label": "Filtros da carteira", children: [
      /* @__PURE__ */ N.jsxs("label", { children: [
        "Tipo de data",
        /* @__PURE__ */ N.jsxs("select", { value: y, onChange: (_) => C(_.target.value), children: [
          /* @__PURE__ */ N.jsx("option", { value: "entry", children: "Entrada" }),
          /* @__PURE__ */ N.jsx("option", { value: "resolution", children: "Encerramento" })
        ] })
      ] }),
      /* @__PURE__ */ N.jsxs("fieldset", { className: "period-filter", children: [
        /* @__PURE__ */ N.jsx("legend", { children: "Período" }),
        /* @__PURE__ */ N.jsx("input", { "aria-label": "Início do período", type: "date", value: E, max: k || void 0, onChange: (_) => S(y === "entry" ? { entryStart: _.target.value } : { resolutionStart: _.target.value }) }),
        /* @__PURE__ */ N.jsx("span", { children: "até" }),
        /* @__PURE__ */ N.jsx("input", { "aria-label": "Fim do período", type: "date", value: k, min: E || void 0, onChange: (_) => S(y === "entry" ? { entryEnd: _.target.value } : { resolutionEnd: _.target.value }) })
      ] }),
      /* @__PURE__ */ N.jsxs("label", { children: [
        "UF",
        /* @__PURE__ */ N.jsxs("select", { value: e.state, onChange: (_) => S({ state: _.target.value }), children: [
          /* @__PURE__ */ N.jsx("option", { value: "", children: "Todas" }),
          r == null ? void 0 : r.filters.states.map((_) => /* @__PURE__ */ N.jsx("option", { children: _ }, _))
        ] })
      ] }),
      /* @__PURE__ */ N.jsxs("label", { children: [
        "Produto",
        /* @__PURE__ */ N.jsxs("select", { value: e.product, onChange: (_) => S({ product: _.target.value }), children: [
          /* @__PURE__ */ N.jsx("option", { value: "", children: "Todos" }),
          r == null ? void 0 : r.filters.products.map((_) => /* @__PURE__ */ N.jsx("option", { children: _ }, _))
        ] })
      ] }),
      /* @__PURE__ */ N.jsxs("label", { children: [
        "Situação",
        /* @__PURE__ */ N.jsxs("select", { value: e.situation, onChange: (_) => S({ situation: _.target.value }), children: [
          /* @__PURE__ */ N.jsx("option", { value: "", children: "Todas" }),
          /* @__PURE__ */ N.jsx("option", { value: "active", children: "Ativo" }),
          /* @__PURE__ */ N.jsx("option", { value: "closed", children: "Encerrado" }),
          /* @__PURE__ */ N.jsx("option", { value: "unknown", children: "Não informado" })
        ] })
      ] }),
      /* @__PURE__ */ N.jsxs("label", { children: [
        "Tipo de encerramento",
        /* @__PURE__ */ N.jsxs("select", { value: e.resolution, onChange: (_) => S({ resolution: _.target.value }), children: [
          /* @__PURE__ */ N.jsx("option", { value: "", children: "Todos" }),
          r == null ? void 0 : r.filters.resolutions.map((_) => /* @__PURE__ */ N.jsx("option", { children: _ }, _))
        ] })
      ] }),
      /* @__PURE__ */ N.jsx("button", { className: "text-button", onClick: () => {
        t(Ov), x("entry");
      }, children: "Limpar" })
    ] }),
    o ? /* @__PURE__ */ N.jsxs("div", { className: "error-state", role: "alert", children: [
      o,
      /* @__PURE__ */ N.jsx("button", { onClick: () => d((_) => _ + 1), children: "Tentar novamente" })
    ] }) : /* @__PURE__ */ N.jsxs("div", { "aria-busy": s, className: s ? "portfolio-content is-loading" : "portfolio-content", children: [
      /* @__PURE__ */ N.jsxs("section", { className: "metrics", children: [
        /* @__PURE__ */ N.jsx(hn, { label: "Total de processos", value: T(r == null ? void 0 : r.summary.total) }),
        /* @__PURE__ */ N.jsx(hn, { label: "Processos ativos", value: T(r == null ? void 0 : r.summary.active) }),
        /* @__PURE__ */ N.jsx(hn, { label: "Processos encerrados", value: T(r == null ? void 0 : r.summary.closed) }),
        /* @__PURE__ */ N.jsx(hn, { label: "Aging médio", value: (r == null ? void 0 : r.summary.aging_mean) == null ? "—" : `${r.summary.aging_mean.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} dias`, note: "Carteira ativa" })
      ] }),
      !!(r != null && r.summary.unknown) && /* @__PURE__ */ N.jsxs("p", { className: "quality-note", children: [
        T(r == null ? void 0 : r.summary.unknown),
        " processos com situação não informada."
      ] }),
      /* @__PURE__ */ N.jsxs("div", { className: "evolution-grid", children: [
        /* @__PURE__ */ N.jsxs(ei, { title: "Entradas × Encerramentos", children: [
          /* @__PURE__ */ N.jsxs("div", { className: "chart-toolbar", children: [
            /* @__PURE__ */ N.jsxs("span", { children: [
              /* @__PURE__ */ N.jsx("i", { className: "legend-entry" }),
              "Entradas ",
              /* @__PURE__ */ N.jsx("i", { className: "legend-closed" }),
              "Encerramentos"
            ] }),
            /* @__PURE__ */ N.jsx("label", { className: "sr-only", htmlFor: "group-by", children: "Agrupamento" }),
            /* @__PURE__ */ N.jsxs("select", { id: "group-by", value: e.groupBy, onChange: (_) => S({ groupBy: _.target.value }), children: [
              /* @__PURE__ */ N.jsx("option", { value: "month", children: "Por mês" }),
              /* @__PURE__ */ N.jsx("option", { value: "week", children: "Por semana" }),
              /* @__PURE__ */ N.jsx("option", { value: "day", children: "Por dia" })
            ] })
          ] }),
          r != null && r.charts.timeline.length ? /* @__PURE__ */ N.jsx("div", { className: "timeline", children: /* @__PURE__ */ N.jsx(DT, { width: "100%", height: "100%", children: /* @__PURE__ */ N.jsxs(pW, { data: r.charts.timeline, margin: { top: 12, right: 12, left: 0, bottom: 8 }, children: [
            /* @__PURE__ */ N.jsx(qE, { vertical: !1, stroke: "#e7edf3" }),
            /* @__PURE__ */ N.jsx(mO, { dataKey: "date", tickFormatter: (_) => String(_).slice(0, 7).split("-").reverse().join("/"), tick: { fontSize: 13, fill: "#65758a" }, axisLine: !1, tickLine: !1, minTickGap: 30 }),
            /* @__PURE__ */ N.jsx(yO, { tick: { fontSize: 13, fill: "#65758a" }, axisLine: !1, tickLine: !1, width: 58 }),
            /* @__PURE__ */ N.jsx(j3, { labelFormatter: (_) => Ev(String(_)), formatter: (_, F) => [Jn(Number(_)), F === "entries" ? "Entradas" : "Encerramentos"], contentStyle: { borderRadius: 8, fontSize: 14, border: "1px solid #e4eaf0" } }),
            /* @__PURE__ */ N.jsx(hO, { type: "monotone", dataKey: "entries", stroke: "#1965c0", fill: "#eaf2fc", strokeWidth: 2 }),
            /* @__PURE__ */ N.jsx(aO, { type: "monotone", dataKey: "closures", stroke: "#243c56", strokeWidth: 2, dot: !1 })
          ] }) }) }) : /* @__PURE__ */ N.jsx("div", { className: "empty-state", children: s ? "Carregando evolução…" : "Nenhum evento neste período." })
        ] }),
        /* @__PURE__ */ N.jsxs(ei, { title: "Movimentação no período", children: [
          /* @__PURE__ */ N.jsxs("div", { className: "movement", children: [
            /* @__PURE__ */ N.jsxs("div", { children: [
              /* @__PURE__ */ N.jsx("span", { children: "Entradas" }),
              /* @__PURE__ */ N.jsx("strong", { children: T(r == null ? void 0 : r.movement.entries) })
            ] }),
            /* @__PURE__ */ N.jsxs("div", { children: [
              /* @__PURE__ */ N.jsx("span", { children: "Encerramentos" }),
              /* @__PURE__ */ N.jsx("strong", { children: T(r == null ? void 0 : r.movement.closures) })
            ] }),
            /* @__PURE__ */ N.jsxs("div", { className: "movement-balance", children: [
              /* @__PURE__ */ N.jsx("span", { children: "Saldo da movimentação" }),
              /* @__PURE__ */ N.jsxs("strong", { children: [
                r && r.movement.balance > 0 ? "+" : "",
                T(r == null ? void 0 : r.movement.balance)
              ] })
            ] })
          ] }),
          /* @__PURE__ */ N.jsx("p", { className: "quality-note", children: "Eventos de entrada e encerramento no mesmo período. Situação consolidada conforme Benner." })
        ] })
      ] }),
      /* @__PURE__ */ N.jsxs("div", { className: "composition-grid", children: [
        /* @__PURE__ */ N.jsx(ei, { title: "Processos por produto", children: /* @__PURE__ */ N.jsx(Ia, { items: (r == null ? void 0 : r.charts.por_produto) || [] }) }),
        /* @__PURE__ */ N.jsx(ei, { title: "Processos por UF", children: /* @__PURE__ */ N.jsx(Ia, { items: (r == null ? void 0 : r.charts.por_uf) || [] }) }),
        /* @__PURE__ */ N.jsx(ei, { title: "Aging da carteira ativa", children: /* @__PURE__ */ N.jsx(Ia, { items: (r == null ? void 0 : r.charts.aging) || [] }) })
      ] }),
      /* @__PURE__ */ N.jsxs("section", { className: "attention-section", children: [
        /* @__PURE__ */ N.jsx("h2", { children: "Pontos de atenção" }),
        /* @__PURE__ */ N.jsxs("div", { className: "attention-list", children: [
          /* @__PURE__ */ N.jsxs("button", { onClick: () => j("aging"), children: [
            /* @__PURE__ */ N.jsx("span", { children: "Aging acima de 180 dias" }),
            /* @__PURE__ */ N.jsxs("strong", { children: [
              T(r == null ? void 0 : r.attention.aging),
              " ",
              /* @__PURE__ */ N.jsx("span", { children: "↗" })
            ] })
          ] }),
          /* @__PURE__ */ N.jsxs("button", { onClick: () => j("divergent"), children: [
            /* @__PURE__ */ N.jsx("span", { children: "Divergência CPJ × Benner" }),
            /* @__PURE__ */ N.jsxs("strong", { children: [
              T(r == null ? void 0 : r.attention.divergent),
              " ",
              /* @__PURE__ */ N.jsx("span", { children: "↗" })
            ] })
          ] }),
          /* @__PURE__ */ N.jsxs("button", { onClick: () => j("archive"), children: [
            /* @__PURE__ */ N.jsx("span", { children: "Aptos a arquivamento" }),
            /* @__PURE__ */ N.jsxs("strong", { children: [
              T(r == null ? void 0 : r.attention.archive),
              " ",
              /* @__PURE__ */ N.jsx("span", { children: "↗" })
            ] })
          ] }),
          O != null && O.available ? /* @__PURE__ */ N.jsxs("button", { disabled: !O.below, onClick: () => {
            var _;
            x("resolution"), S({ entryStart: "", entryEnd: "", resolutionStart: O.start, resolutionEnd: O.end, attention: "" }), (_ = A.current) == null || _.scrollIntoView({ behavior: "smooth" });
          }, children: [
            /* @__PURE__ */ N.jsx("span", { children: "Encerramentos no último mês completo" }),
            /* @__PURE__ */ N.jsx("strong", { children: O.below ? "Abaixo da média ↗" : "Dentro ou acima da média" })
          ] }) : /* @__PURE__ */ N.jsx("p", { children: "Comparativo de encerramentos: histórico insuficiente." })
        ] })
      ] }),
      /* @__PURE__ */ N.jsxs("section", { ref: A, className: "portfolio-table", id: "portfolio-table", children: [
        /* @__PURE__ */ N.jsxs("header", { className: "section-heading", children: [
          /* @__PURE__ */ N.jsxs("div", { children: [
            /* @__PURE__ */ N.jsx("h2", { children: "Base de processos" }),
            /* @__PURE__ */ N.jsxs("p", { children: [
              r ? `${T(r.table.total)} registros` : "Carregando…",
              e.attention && " · Recorte de atenção aplicado"
            ] })
          ] }),
          /* @__PURE__ */ N.jsxs("form", { onSubmit: (_) => {
            _.preventDefault();
            const F = _.currentTarget;
            S({ cnj: F.elements.namedItem("cnj").value });
          }, children: [
            /* @__PURE__ */ N.jsx("label", { className: "sr-only", htmlFor: "cnj-search", children: "Buscar por CNJ" }),
            /* @__PURE__ */ N.jsx("input", { id: "cnj-search", name: "cnj", placeholder: "Buscar por CNJ", defaultValue: e.cnj }, e.cnj),
            /* @__PURE__ */ N.jsx("button", { children: "Buscar" })
          ] })
        ] }),
        e.attention && /* @__PURE__ */ N.jsx("button", { className: "text-button", onClick: () => S({ attention: "" }), children: "Remover recorte de atenção" }),
        /* @__PURE__ */ N.jsx("div", { className: "table-scroll", children: /* @__PURE__ */ N.jsxs("table", { children: [
          /* @__PURE__ */ N.jsx("thead", { children: /* @__PURE__ */ N.jsx("tr", { children: [["CNJ", "cnj"], ["Produto", "product"], ["Entrada", "date"], ["UF", "state"], ["Aging", "aging"], ["Encerramento", "date_resolution"], ["Tipo de encerramento", "resolution"], ["CPJ", "situation_cpj"], ["Benner", "situation_benner"]].map(([_, F]) => /* @__PURE__ */ N.jsx("th", { "aria-sort": e.sortBy === F ? e.sortDirection === "asc" ? "ascending" : "descending" : "none", children: /* @__PURE__ */ N.jsxs("button", { onClick: () => S({ sortBy: F, sortDirection: e.sortBy === F && e.sortDirection === "asc" ? "desc" : "asc" }), children: [
            _,
            e.sortBy === F ? " ↕" : ""
          ] }) }, F)) }) }),
          /* @__PURE__ */ N.jsx("tbody", { children: s ? /* @__PURE__ */ N.jsx("tr", { children: /* @__PURE__ */ N.jsx("td", { colSpan: 9, children: "Carregando registros…" }) }) : r != null && r.table.rows.length ? r.table.rows.map((_) => /* @__PURE__ */ N.jsxs("tr", { children: [
            /* @__PURE__ */ N.jsx("td", { children: _.cnj || "—" }),
            /* @__PURE__ */ N.jsx("td", { children: _.product || "—" }),
            /* @__PURE__ */ N.jsx("td", { children: _.date ? Ev(_.date) : "—" }),
            /* @__PURE__ */ N.jsx("td", { children: _.state || "—" }),
            /* @__PURE__ */ N.jsx("td", { children: _.aging ?? "—" }),
            /* @__PURE__ */ N.jsx("td", { children: _.date_resolution ? Ev(_.date_resolution) : "—" }),
            /* @__PURE__ */ N.jsx("td", { children: _.resolution || "—" }),
            /* @__PURE__ */ N.jsx("td", { children: _.situation_cpj || "—" }),
            /* @__PURE__ */ N.jsx("td", { children: _.situation_benner || "—" })
          ] }, _.id)) : /* @__PURE__ */ N.jsx("tr", { children: /* @__PURE__ */ N.jsx("td", { colSpan: 9, children: "Nenhum processo encontrado." }) }) })
        ] }) }),
        /* @__PURE__ */ N.jsxs("footer", { className: "pagination", children: [
          /* @__PURE__ */ N.jsxs("span", { children: [
            "Página ",
            e.page,
            " de ",
            Math.max(1, (r == null ? void 0 : r.table.total_pages) || 1)
          ] }),
          /* @__PURE__ */ N.jsx("button", { disabled: s || e.page <= 1, onClick: () => S({ page: e.page - 1 }), children: "Anterior" }),
          /* @__PURE__ */ N.jsx("button", { disabled: s || e.page >= ((r == null ? void 0 : r.table.total_pages) || 1), onClick: () => S({ page: e.page + 1 }), children: "Próxima" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ N.jsx(wW, {})
  ] });
}
const Z1 = document.getElementById("dashboard-root");
let Tr = null;
function rm() {
  var r;
  const e = window.MBA_CURRENT_USER;
  if (!!!(e && e.access_kind === "administrative" && e.permissions["dashboard.view"] && ((r = document.getElementById("dashboard")) != null && r.classList.contains("active")))) {
    Tr == null || Tr.unmount(), Tr = null;
    return;
  }
  Z1 && !Tr && (Tr = R_.createRoot(Z1), Tr.render(/* @__PURE__ */ N.jsx(bW, {})));
}
window.addEventListener("mba:authenticated", rm);
window.addEventListener("mba:page-changed", rm);
window.addEventListener("mba:session-ended", () => {
  Tr == null || Tr.unmount(), Tr = null;
});
rm();
