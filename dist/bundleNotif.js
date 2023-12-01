/*! For license information please see bundleNotif.js.LICENSE.txt */
(() => {
  "use strict";
  var e = {};
  e.g = (function () {
    if ("object" == typeof globalThis) return globalThis;
    try {
      return this || new Function("return this")();
    } catch (e) {
      if ("object" == typeof window) return window;
    }
  })();
  const t = function (e) {
      const t = [];
      let n = 0;
      for (let r = 0; r < e.length; r++) {
        let i = e.charCodeAt(r);
        i < 128
          ? (t[n++] = i)
          : i < 2048
          ? ((t[n++] = (i >> 6) | 192), (t[n++] = (63 & i) | 128))
          : 55296 == (64512 & i) &&
            r + 1 < e.length &&
            56320 == (64512 & e.charCodeAt(r + 1))
          ? ((i = 65536 + ((1023 & i) << 10) + (1023 & e.charCodeAt(++r))),
            (t[n++] = (i >> 18) | 240),
            (t[n++] = ((i >> 12) & 63) | 128),
            (t[n++] = ((i >> 6) & 63) | 128),
            (t[n++] = (63 & i) | 128))
          : ((t[n++] = (i >> 12) | 224),
            (t[n++] = ((i >> 6) & 63) | 128),
            (t[n++] = (63 & i) | 128));
      }
      return t;
    },
    n = {
      byteToCharMap_: null,
      charToByteMap_: null,
      byteToCharMapWebSafe_: null,
      charToByteMapWebSafe_: null,
      ENCODED_VALS_BASE:
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
      get ENCODED_VALS() {
        return this.ENCODED_VALS_BASE + "+/=";
      },
      get ENCODED_VALS_WEBSAFE() {
        return this.ENCODED_VALS_BASE + "-_.";
      },
      HAS_NATIVE_SUPPORT: "function" == typeof atob,
      encodeByteArray(e, t) {
        if (!Array.isArray(e))
          throw Error("encodeByteArray takes an array as a parameter");
        this.init_();
        const n = t ? this.byteToCharMapWebSafe_ : this.byteToCharMap_,
          r = [];
        for (let t = 0; t < e.length; t += 3) {
          const i = e[t],
            s = t + 1 < e.length,
            o = s ? e[t + 1] : 0,
            a = t + 2 < e.length,
            c = a ? e[t + 2] : 0,
            h = i >> 2,
            u = ((3 & i) << 4) | (o >> 4);
          let l = ((15 & o) << 2) | (c >> 6),
            d = 63 & c;
          a || ((d = 64), s || (l = 64)), r.push(n[h], n[u], n[l], n[d]);
        }
        return r.join("");
      },
      encodeString(e, n) {
        return this.HAS_NATIVE_SUPPORT && !n
          ? btoa(e)
          : this.encodeByteArray(t(e), n);
      },
      decodeString(e, t) {
        return this.HAS_NATIVE_SUPPORT && !t
          ? atob(e)
          : (function (e) {
              const t = [];
              let n = 0,
                r = 0;
              for (; n < e.length; ) {
                const i = e[n++];
                if (i < 128) t[r++] = String.fromCharCode(i);
                else if (i > 191 && i < 224) {
                  const s = e[n++];
                  t[r++] = String.fromCharCode(((31 & i) << 6) | (63 & s));
                } else if (i > 239 && i < 365) {
                  const s =
                    (((7 & i) << 18) |
                      ((63 & e[n++]) << 12) |
                      ((63 & e[n++]) << 6) |
                      (63 & e[n++])) -
                    65536;
                  (t[r++] = String.fromCharCode(55296 + (s >> 10))),
                    (t[r++] = String.fromCharCode(56320 + (1023 & s)));
                } else {
                  const s = e[n++],
                    o = e[n++];
                  t[r++] = String.fromCharCode(
                    ((15 & i) << 12) | ((63 & s) << 6) | (63 & o)
                  );
                }
              }
              return t.join("");
            })(this.decodeStringToByteArray(e, t));
      },
      decodeStringToByteArray(e, t) {
        this.init_();
        const n = t ? this.charToByteMapWebSafe_ : this.charToByteMap_,
          i = [];
        for (let t = 0; t < e.length; ) {
          const s = n[e.charAt(t++)],
            o = t < e.length ? n[e.charAt(t)] : 0;
          ++t;
          const a = t < e.length ? n[e.charAt(t)] : 64;
          ++t;
          const c = t < e.length ? n[e.charAt(t)] : 64;
          if ((++t, null == s || null == o || null == a || null == c))
            throw new r();
          const h = (s << 2) | (o >> 4);
          if ((i.push(h), 64 !== a)) {
            const e = ((o << 4) & 240) | (a >> 2);
            if ((i.push(e), 64 !== c)) {
              const e = ((a << 6) & 192) | c;
              i.push(e);
            }
          }
        }
        return i;
      },
      init_() {
        if (!this.byteToCharMap_) {
          (this.byteToCharMap_ = {}),
            (this.charToByteMap_ = {}),
            (this.byteToCharMapWebSafe_ = {}),
            (this.charToByteMapWebSafe_ = {});
          for (let e = 0; e < this.ENCODED_VALS.length; e++)
            (this.byteToCharMap_[e] = this.ENCODED_VALS.charAt(e)),
              (this.charToByteMap_[this.byteToCharMap_[e]] = e),
              (this.byteToCharMapWebSafe_[e] =
                this.ENCODED_VALS_WEBSAFE.charAt(e)),
              (this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[e]] = e),
              e >= this.ENCODED_VALS_BASE.length &&
                ((this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(e)] = e),
                (this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(e)] = e));
        }
      },
    };
  class r extends Error {
    constructor() {
      super(...arguments), (this.name = "DecodeBase64StringError");
    }
  }
  const i = function (e) {
      return (function (e) {
        const r = t(e);
        return n.encodeByteArray(r, !0);
      })(e).replace(/\./g, "");
    },
    s = function (e) {
      try {
        return n.decodeString(e, !0);
      } catch (e) {
        console.error("base64Decode failed: ", e);
      }
      return null;
    },
    o = () => {
      try {
        return (
          (function () {
            if ("undefined" != typeof self) return self;
            if ("undefined" != typeof window) return window;
            if (void 0 !== e.g) return e.g;
            throw new Error("Unable to locate global object.");
          })().__FIREBASE_DEFAULTS__ ||
          (() => {
            if ("undefined" == typeof process || void 0 === process.env) return;
            const e = process.env.__FIREBASE_DEFAULTS__;
            return e ? JSON.parse(e) : void 0;
          })() ||
          (() => {
            if ("undefined" == typeof document) return;
            let e;
            try {
              e = document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/);
            } catch (e) {
              return;
            }
            const t = e && s(e[1]);
            return t && JSON.parse(t);
          })()
        );
      } catch (e) {
        return void console.info(
          `Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`
        );
      }
    },
    a = (e) => {
      var t, n;
      return null ===
        (n = null === (t = o()) || void 0 === t ? void 0 : t.emulatorHosts) ||
        void 0 === n
        ? void 0
        : n[e];
    },
    c = (e) => {
      const t = a(e);
      if (!t) return;
      const n = t.lastIndexOf(":");
      if (n <= 0 || n + 1 === t.length)
        throw new Error(
          `Invalid host ${t} with no separate hostname and port!`
        );
      const r = parseInt(t.substring(n + 1), 10);
      return "[" === t[0] ? [t.substring(1, n - 1), r] : [t.substring(0, n), r];
    },
    h = () => {
      var e;
      return null === (e = o()) || void 0 === e ? void 0 : e.config;
    },
    u = (e) => {
      var t;
      return null === (t = o()) || void 0 === t ? void 0 : t[`_${e}`];
    };
  class l {
    constructor() {
      (this.reject = () => {}),
        (this.resolve = () => {}),
        (this.promise = new Promise((e, t) => {
          (this.resolve = e), (this.reject = t);
        }));
    }
    wrapCallback(e) {
      return (t, n) => {
        t ? this.reject(t) : this.resolve(n),
          "function" == typeof e &&
            (this.promise.catch(() => {}), 1 === e.length ? e(t) : e(t, n));
      };
    }
  }
  function d() {
    return "undefined" != typeof navigator &&
      "string" == typeof navigator.userAgent
      ? navigator.userAgent
      : "";
  }
  class f extends Error {
    constructor(e, t, n) {
      super(t),
        (this.code = e),
        (this.customData = n),
        (this.name = "FirebaseError"),
        Object.setPrototypeOf(this, f.prototype),
        Error.captureStackTrace &&
          Error.captureStackTrace(this, p.prototype.create);
    }
  }
  class p {
    constructor(e, t, n) {
      (this.service = e), (this.serviceName = t), (this.errors = n);
    }
    create(e, ...t) {
      const n = t[0] || {},
        r = `${this.service}/${e}`,
        i = this.errors[e],
        s = i
          ? (function (e, t) {
              return e.replace(g, (e, n) => {
                const r = t[n];
                return null != r ? String(r) : `<${n}?>`;
              });
            })(i, n)
          : "Error",
        o = `${this.serviceName}: ${s} (${r}).`;
      return new f(r, o, n);
    }
  }
  const g = /\{\$([^}]+)}/g;
  function m(e, t) {
    if (e === t) return !0;
    const n = Object.keys(e),
      r = Object.keys(t);
    for (const i of n) {
      if (!r.includes(i)) return !1;
      const n = e[i],
        s = t[i];
      if (y(n) && y(s)) {
        if (!m(n, s)) return !1;
      } else if (n !== s) return !1;
    }
    for (const e of r) if (!n.includes(e)) return !1;
    return !0;
  }
  function y(e) {
    return null !== e && "object" == typeof e;
  }
  function v(e) {
    const t = [];
    for (const [n, r] of Object.entries(e))
      Array.isArray(r)
        ? r.forEach((e) => {
            t.push(encodeURIComponent(n) + "=" + encodeURIComponent(e));
          })
        : t.push(encodeURIComponent(n) + "=" + encodeURIComponent(r));
    return t.length ? "&" + t.join("&") : "";
  }
  function w(e) {
    const t = {};
    return (
      e
        .replace(/^\?/, "")
        .split("&")
        .forEach((e) => {
          if (e) {
            const [n, r] = e.split("=");
            t[decodeURIComponent(n)] = decodeURIComponent(r);
          }
        }),
      t
    );
  }
  function _(e) {
    const t = e.indexOf("?");
    if (!t) return "";
    const n = e.indexOf("#", t);
    return e.substring(t, n > 0 ? n : void 0);
  }
  class E {
    constructor(e, t) {
      (this.observers = []),
        (this.unsubscribes = []),
        (this.observerCount = 0),
        (this.task = Promise.resolve()),
        (this.finalized = !1),
        (this.onNoObservers = t),
        this.task
          .then(() => {
            e(this);
          })
          .catch((e) => {
            this.error(e);
          });
    }
    next(e) {
      this.forEachObserver((t) => {
        t.next(e);
      });
    }
    error(e) {
      this.forEachObserver((t) => {
        t.error(e);
      }),
        this.close(e);
    }
    complete() {
      this.forEachObserver((e) => {
        e.complete();
      }),
        this.close();
    }
    subscribe(e, t, n) {
      let r;
      if (void 0 === e && void 0 === t && void 0 === n)
        throw new Error("Missing Observer.");
      (r = (function (e, t) {
        if ("object" != typeof e || null === e) return !1;
        for (const t of ["next", "error", "complete"])
          if (t in e && "function" == typeof e[t]) return !0;
        return !1;
      })(e)
        ? e
        : { next: e, error: t, complete: n }),
        void 0 === r.next && (r.next = I),
        void 0 === r.error && (r.error = I),
        void 0 === r.complete && (r.complete = I);
      const i = this.unsubscribeOne.bind(this, this.observers.length);
      return (
        this.finalized &&
          this.task.then(() => {
            try {
              this.finalError ? r.error(this.finalError) : r.complete();
            } catch (e) {}
          }),
        this.observers.push(r),
        i
      );
    }
    unsubscribeOne(e) {
      void 0 !== this.observers &&
        void 0 !== this.observers[e] &&
        (delete this.observers[e],
        (this.observerCount -= 1),
        0 === this.observerCount &&
          void 0 !== this.onNoObservers &&
          this.onNoObservers(this));
    }
    forEachObserver(e) {
      if (!this.finalized)
        for (let t = 0; t < this.observers.length; t++) this.sendOne(t, e);
    }
    sendOne(e, t) {
      this.task.then(() => {
        if (void 0 !== this.observers && void 0 !== this.observers[e])
          try {
            t(this.observers[e]);
          } catch (e) {
            "undefined" != typeof console && console.error && console.error(e);
          }
      });
    }
    close(e) {
      this.finalized ||
        ((this.finalized = !0),
        void 0 !== e && (this.finalError = e),
        this.task.then(() => {
          (this.observers = void 0), (this.onNoObservers = void 0);
        }));
    }
  }
  function I() {}
  function T(e) {
    return e && e._delegate ? e._delegate : e;
  }
  class b {
    constructor(e, t, n) {
      (this.name = e),
        (this.instanceFactory = t),
        (this.type = n),
        (this.multipleInstances = !1),
        (this.serviceProps = {}),
        (this.instantiationMode = "LAZY"),
        (this.onInstanceCreated = null);
    }
    setInstantiationMode(e) {
      return (this.instantiationMode = e), this;
    }
    setMultipleInstances(e) {
      return (this.multipleInstances = e), this;
    }
    setServiceProps(e) {
      return (this.serviceProps = e), this;
    }
    setInstanceCreatedCallback(e) {
      return (this.onInstanceCreated = e), this;
    }
  }
  const S = "[DEFAULT]";
  class C {
    constructor(e, t) {
      (this.name = e),
        (this.container = t),
        (this.component = null),
        (this.instances = new Map()),
        (this.instancesDeferred = new Map()),
        (this.instancesOptions = new Map()),
        (this.onInitCallbacks = new Map());
    }
    get(e) {
      const t = this.normalizeInstanceIdentifier(e);
      if (!this.instancesDeferred.has(t)) {
        const e = new l();
        if (
          (this.instancesDeferred.set(t, e),
          this.isInitialized(t) || this.shouldAutoInitialize())
        )
          try {
            const n = this.getOrInitializeService({ instanceIdentifier: t });
            n && e.resolve(n);
          } catch (e) {}
      }
      return this.instancesDeferred.get(t).promise;
    }
    getImmediate(e) {
      var t;
      const n = this.normalizeInstanceIdentifier(
          null == e ? void 0 : e.identifier
        ),
        r = null !== (t = null == e ? void 0 : e.optional) && void 0 !== t && t;
      if (!this.isInitialized(n) && !this.shouldAutoInitialize()) {
        if (r) return null;
        throw Error(`Service ${this.name} is not available`);
      }
      try {
        return this.getOrInitializeService({ instanceIdentifier: n });
      } catch (e) {
        if (r) return null;
        throw e;
      }
    }
    getComponent() {
      return this.component;
    }
    setComponent(e) {
      if (e.name !== this.name)
        throw Error(
          `Mismatching Component ${e.name} for Provider ${this.name}.`
        );
      if (this.component)
        throw Error(`Component for ${this.name} has already been provided`);
      if (((this.component = e), this.shouldAutoInitialize())) {
        if (
          (function (e) {
            return "EAGER" === e.instantiationMode;
          })(e)
        )
          try {
            this.getOrInitializeService({ instanceIdentifier: S });
          } catch (e) {}
        for (const [e, t] of this.instancesDeferred.entries()) {
          const n = this.normalizeInstanceIdentifier(e);
          try {
            const e = this.getOrInitializeService({ instanceIdentifier: n });
            t.resolve(e);
          } catch (e) {}
        }
      }
    }
    clearInstance(e = S) {
      this.instancesDeferred.delete(e),
        this.instancesOptions.delete(e),
        this.instances.delete(e);
    }
    async delete() {
      const e = Array.from(this.instances.values());
      await Promise.all([
        ...e.filter((e) => "INTERNAL" in e).map((e) => e.INTERNAL.delete()),
        ...e.filter((e) => "_delete" in e).map((e) => e._delete()),
      ]);
    }
    isComponentSet() {
      return null != this.component;
    }
    isInitialized(e = S) {
      return this.instances.has(e);
    }
    getOptions(e = S) {
      return this.instancesOptions.get(e) || {};
    }
    initialize(e = {}) {
      const { options: t = {} } = e,
        n = this.normalizeInstanceIdentifier(e.instanceIdentifier);
      if (this.isInitialized(n))
        throw Error(`${this.name}(${n}) has already been initialized`);
      if (!this.isComponentSet())
        throw Error(`Component ${this.name} has not been registered yet`);
      const r = this.getOrInitializeService({
        instanceIdentifier: n,
        options: t,
      });
      for (const [e, t] of this.instancesDeferred.entries())
        n === this.normalizeInstanceIdentifier(e) && t.resolve(r);
      return r;
    }
    onInit(e, t) {
      var n;
      const r = this.normalizeInstanceIdentifier(t),
        i =
          null !== (n = this.onInitCallbacks.get(r)) && void 0 !== n
            ? n
            : new Set();
      i.add(e), this.onInitCallbacks.set(r, i);
      const s = this.instances.get(r);
      return (
        s && e(s, r),
        () => {
          i.delete(e);
        }
      );
    }
    invokeOnInitCallbacks(e, t) {
      const n = this.onInitCallbacks.get(t);
      if (n)
        for (const r of n)
          try {
            r(e, t);
          } catch (e) {}
    }
    getOrInitializeService({ instanceIdentifier: e, options: t = {} }) {
      let n = this.instances.get(e);
      if (
        !n &&
        this.component &&
        ((n = this.component.instanceFactory(this.container, {
          instanceIdentifier: ((r = e), r === S ? void 0 : r),
          options: t,
        })),
        this.instances.set(e, n),
        this.instancesOptions.set(e, t),
        this.invokeOnInitCallbacks(n, e),
        this.component.onInstanceCreated)
      )
        try {
          this.component.onInstanceCreated(this.container, e, n);
        } catch (e) {}
      var r;
      return n || null;
    }
    normalizeInstanceIdentifier(e = S) {
      return this.component ? (this.component.multipleInstances ? e : S) : e;
    }
    shouldAutoInitialize() {
      return (
        !!this.component && "EXPLICIT" !== this.component.instantiationMode
      );
    }
  }
  class k {
    constructor(e) {
      (this.name = e), (this.providers = new Map());
    }
    addComponent(e) {
      const t = this.getProvider(e.name);
      if (t.isComponentSet())
        throw new Error(
          `Component ${e.name} has already been registered with ${this.name}`
        );
      t.setComponent(e);
    }
    addOrOverwriteComponent(e) {
      this.getProvider(e.name).isComponentSet() &&
        this.providers.delete(e.name),
        this.addComponent(e);
    }
    getProvider(e) {
      if (this.providers.has(e)) return this.providers.get(e);
      const t = new C(e, this);
      return this.providers.set(e, t), t;
    }
    getProviders() {
      return Array.from(this.providers.values());
    }
  }
  const A = [];
  var N, R;
  ((R = N || (N = {}))[(R.DEBUG = 0)] = "DEBUG"),
    (R[(R.VERBOSE = 1)] = "VERBOSE"),
    (R[(R.INFO = 2)] = "INFO"),
    (R[(R.WARN = 3)] = "WARN"),
    (R[(R.ERROR = 4)] = "ERROR"),
    (R[(R.SILENT = 5)] = "SILENT");
  const D = {
      debug: N.DEBUG,
      verbose: N.VERBOSE,
      info: N.INFO,
      warn: N.WARN,
      error: N.ERROR,
      silent: N.SILENT,
    },
    O = N.INFO,
    P = {
      [N.DEBUG]: "log",
      [N.VERBOSE]: "log",
      [N.INFO]: "info",
      [N.WARN]: "warn",
      [N.ERROR]: "error",
    },
    L = (e, t, ...n) => {
      if (t < e.logLevel) return;
      const r = new Date().toISOString(),
        i = P[t];
      if (!i)
        throw new Error(
          `Attempted to log a message with an invalid logType (value: ${t})`
        );
      console[i](`[${r}]  ${e.name}:`, ...n);
    };
  class M {
    constructor(e) {
      (this.name = e),
        (this._logLevel = O),
        (this._logHandler = L),
        (this._userLogHandler = null),
        A.push(this);
    }
    get logLevel() {
      return this._logLevel;
    }
    set logLevel(e) {
      if (!(e in N))
        throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);
      this._logLevel = e;
    }
    setLogLevel(e) {
      this._logLevel = "string" == typeof e ? D[e] : e;
    }
    get logHandler() {
      return this._logHandler;
    }
    set logHandler(e) {
      if ("function" != typeof e)
        throw new TypeError(
          "Value assigned to `logHandler` must be a function"
        );
      this._logHandler = e;
    }
    get userLogHandler() {
      return this._userLogHandler;
    }
    set userLogHandler(e) {
      this._userLogHandler = e;
    }
    debug(...e) {
      this._userLogHandler && this._userLogHandler(this, N.DEBUG, ...e),
        this._logHandler(this, N.DEBUG, ...e);
    }
    log(...e) {
      this._userLogHandler && this._userLogHandler(this, N.VERBOSE, ...e),
        this._logHandler(this, N.VERBOSE, ...e);
    }
    info(...e) {
      this._userLogHandler && this._userLogHandler(this, N.INFO, ...e),
        this._logHandler(this, N.INFO, ...e);
    }
    warn(...e) {
      this._userLogHandler && this._userLogHandler(this, N.WARN, ...e),
        this._logHandler(this, N.WARN, ...e);
    }
    error(...e) {
      this._userLogHandler && this._userLogHandler(this, N.ERROR, ...e),
        this._logHandler(this, N.ERROR, ...e);
    }
  }
  const x = (e, t) => t.some((t) => e instanceof t);
  let U, V;
  const F = new WeakMap(),
    j = new WeakMap(),
    B = new WeakMap(),
    q = new WeakMap(),
    $ = new WeakMap();
  let z = {
    get(e, t, n) {
      if (e instanceof IDBTransaction) {
        if ("done" === t) return j.get(e);
        if ("objectStoreNames" === t) return e.objectStoreNames || B.get(e);
        if ("store" === t)
          return n.objectStoreNames[1]
            ? void 0
            : n.objectStore(n.objectStoreNames[0]);
      }
      return K(e[t]);
    },
    set: (e, t, n) => ((e[t] = n), !0),
    has: (e, t) =>
      (e instanceof IDBTransaction && ("done" === t || "store" === t)) ||
      t in e,
  };
  function H(e) {
    return "function" == typeof e
      ? (t = e) !== IDBDatabase.prototype.transaction ||
        "objectStoreNames" in IDBTransaction.prototype
        ? (
            V ||
            (V = [
              IDBCursor.prototype.advance,
              IDBCursor.prototype.continue,
              IDBCursor.prototype.continuePrimaryKey,
            ])
          ).includes(t)
          ? function (...e) {
              return t.apply(G(this), e), K(F.get(this));
            }
          : function (...e) {
              return K(t.apply(G(this), e));
            }
        : function (e, ...n) {
            const r = t.call(G(this), e, ...n);
            return B.set(r, e.sort ? e.sort() : [e]), K(r);
          }
      : (e instanceof IDBTransaction &&
          (function (e) {
            if (j.has(e)) return;
            const t = new Promise((t, n) => {
              const r = () => {
                  e.removeEventListener("complete", i),
                    e.removeEventListener("error", s),
                    e.removeEventListener("abort", s);
                },
                i = () => {
                  t(), r();
                },
                s = () => {
                  n(e.error || new DOMException("AbortError", "AbortError")),
                    r();
                };
              e.addEventListener("complete", i),
                e.addEventListener("error", s),
                e.addEventListener("abort", s);
            });
            j.set(e, t);
          })(e),
        x(
          e,
          U ||
            (U = [
              IDBDatabase,
              IDBObjectStore,
              IDBIndex,
              IDBCursor,
              IDBTransaction,
            ])
        )
          ? new Proxy(e, z)
          : e);
    var t;
  }
  function K(e) {
    if (e instanceof IDBRequest)
      return (function (e) {
        const t = new Promise((t, n) => {
          const r = () => {
              e.removeEventListener("success", i),
                e.removeEventListener("error", s);
            },
            i = () => {
              t(K(e.result)), r();
            },
            s = () => {
              n(e.error), r();
            };
          e.addEventListener("success", i), e.addEventListener("error", s);
        });
        return (
          t
            .then((t) => {
              t instanceof IDBCursor && F.set(t, e);
            })
            .catch(() => {}),
          $.set(t, e),
          t
        );
      })(e);
    if (q.has(e)) return q.get(e);
    const t = H(e);
    return t !== e && (q.set(e, t), $.set(t, e)), t;
  }
  const G = (e) => $.get(e),
    W = ["get", "getKey", "getAll", "getAllKeys", "count"],
    Q = ["put", "add", "delete", "clear"],
    X = new Map();
  function J(e, t) {
    if (!(e instanceof IDBDatabase) || t in e || "string" != typeof t) return;
    if (X.get(t)) return X.get(t);
    const n = t.replace(/FromIndex$/, ""),
      r = t !== n,
      i = Q.includes(n);
    if (
      !(n in (r ? IDBIndex : IDBObjectStore).prototype) ||
      (!i && !W.includes(n))
    )
      return;
    const s = async function (e, ...t) {
      const s = this.transaction(e, i ? "readwrite" : "readonly");
      let o = s.store;
      return (
        r && (o = o.index(t.shift())),
        (await Promise.all([o[n](...t), i && s.done]))[0]
      );
    };
    return X.set(t, s), s;
  }
  var Y;
  (Y = z),
    (z = {
      ...Y,
      get: (e, t, n) => J(e, t) || Y.get(e, t, n),
      has: (e, t) => !!J(e, t) || Y.has(e, t),
    });
  class Z {
    constructor(e) {
      this.container = e;
    }
    getPlatformInfoString() {
      return this.container
        .getProviders()
        .map((e) => {
          if (
            (function (e) {
              const t = e.getComponent();
              return "VERSION" === (null == t ? void 0 : t.type);
            })(e)
          ) {
            const t = e.getImmediate();
            return `${t.library}/${t.version}`;
          }
          return null;
        })
        .filter((e) => e)
        .join(" ");
    }
  }
  const ee = "@firebase/app",
    te = "0.9.23",
    ne = new M("@firebase/app"),
    re = "[DEFAULT]",
    ie = {
      [ee]: "fire-core",
      "@firebase/app-compat": "fire-core-compat",
      "@firebase/analytics": "fire-analytics",
      "@firebase/analytics-compat": "fire-analytics-compat",
      "@firebase/app-check": "fire-app-check",
      "@firebase/app-check-compat": "fire-app-check-compat",
      "@firebase/auth": "fire-auth",
      "@firebase/auth-compat": "fire-auth-compat",
      "@firebase/database": "fire-rtdb",
      "@firebase/database-compat": "fire-rtdb-compat",
      "@firebase/functions": "fire-fn",
      "@firebase/functions-compat": "fire-fn-compat",
      "@firebase/installations": "fire-iid",
      "@firebase/installations-compat": "fire-iid-compat",
      "@firebase/messaging": "fire-fcm",
      "@firebase/messaging-compat": "fire-fcm-compat",
      "@firebase/performance": "fire-perf",
      "@firebase/performance-compat": "fire-perf-compat",
      "@firebase/remote-config": "fire-rc",
      "@firebase/remote-config-compat": "fire-rc-compat",
      "@firebase/storage": "fire-gcs",
      "@firebase/storage-compat": "fire-gcs-compat",
      "@firebase/firestore": "fire-fst",
      "@firebase/firestore-compat": "fire-fst-compat",
      "fire-js": "fire-js",
      firebase: "fire-js-all",
    },
    se = new Map(),
    oe = new Map();
  function ae(e, t) {
    try {
      e.container.addComponent(t);
    } catch (n) {
      ne.debug(
        `Component ${t.name} failed to register with FirebaseApp ${e.name}`,
        n
      );
    }
  }
  function ce(e) {
    const t = e.name;
    if (oe.has(t))
      return (
        ne.debug(`There were multiple attempts to register component ${t}.`), !1
      );
    oe.set(t, e);
    for (const t of se.values()) ae(t, e);
    return !0;
  }
  function he(e, t) {
    const n = e.container
      .getProvider("heartbeat")
      .getImmediate({ optional: !0 });
    return n && n.triggerHeartbeat(), e.container.getProvider(t);
  }
  const ue = new p("app", "Firebase", {
    "no-app":
      "No Firebase App '{$appName}' has been created - call initializeApp() first",
    "bad-app-name": "Illegal App name: '{$appName}",
    "duplicate-app":
      "Firebase App named '{$appName}' already exists with different options or config",
    "app-deleted": "Firebase App named '{$appName}' already deleted",
    "no-options":
      "Need to provide options, when not being deployed to hosting via source.",
    "invalid-app-argument":
      "firebase.{$appName}() takes either no argument or a Firebase App instance.",
    "invalid-log-argument":
      "First argument to `onLog` must be null or a function.",
    "idb-open":
      "Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.",
    "idb-get":
      "Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.",
    "idb-set":
      "Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.",
    "idb-delete":
      "Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.",
  });
  class le {
    constructor(e, t, n) {
      (this._isDeleted = !1),
        (this._options = Object.assign({}, e)),
        (this._config = Object.assign({}, t)),
        (this._name = t.name),
        (this._automaticDataCollectionEnabled =
          t.automaticDataCollectionEnabled),
        (this._container = n),
        this.container.addComponent(new b("app", () => this, "PUBLIC"));
    }
    get automaticDataCollectionEnabled() {
      return this.checkDestroyed(), this._automaticDataCollectionEnabled;
    }
    set automaticDataCollectionEnabled(e) {
      this.checkDestroyed(), (this._automaticDataCollectionEnabled = e);
    }
    get name() {
      return this.checkDestroyed(), this._name;
    }
    get options() {
      return this.checkDestroyed(), this._options;
    }
    get config() {
      return this.checkDestroyed(), this._config;
    }
    get container() {
      return this._container;
    }
    get isDeleted() {
      return this._isDeleted;
    }
    set isDeleted(e) {
      this._isDeleted = e;
    }
    checkDestroyed() {
      if (this.isDeleted)
        throw ue.create("app-deleted", { appName: this._name });
    }
  }
  const de = "10.6.0";
  function fe(e, t = {}) {
    let n = e;
    "object" != typeof t && (t = { name: t });
    const r = Object.assign(
        { name: re, automaticDataCollectionEnabled: !1 },
        t
      ),
      i = r.name;
    if ("string" != typeof i || !i)
      throw ue.create("bad-app-name", { appName: String(i) });
    if ((n || (n = h()), !n)) throw ue.create("no-options");
    const s = se.get(i);
    if (s) {
      if (m(n, s.options) && m(r, s.config)) return s;
      throw ue.create("duplicate-app", { appName: i });
    }
    const o = new k(i);
    for (const e of oe.values()) o.addComponent(e);
    const a = new le(n, r, o);
    return se.set(i, a), a;
  }
  function pe(e = re) {
    const t = se.get(e);
    if (!t && e === re && h()) return fe();
    if (!t) throw ue.create("no-app", { appName: e });
    return t;
  }
  function ge(e, t, n) {
    var r;
    let i = null !== (r = ie[e]) && void 0 !== r ? r : e;
    n && (i += `-${n}`);
    const s = i.match(/\s|\//),
      o = t.match(/\s|\//);
    if (s || o) {
      const e = [`Unable to register library "${i}" with version "${t}":`];
      return (
        s &&
          e.push(
            `library name "${i}" contains illegal characters (whitespace or "/")`
          ),
        s && o && e.push("and"),
        o &&
          e.push(
            `version name "${t}" contains illegal characters (whitespace or "/")`
          ),
        void ne.warn(e.join(" "))
      );
    }
    ce(new b(`${i}-version`, () => ({ library: i, version: t }), "VERSION"));
  }
  const me = "firebase-heartbeat-database",
    ye = 1,
    ve = "firebase-heartbeat-store";
  let we = null;
  function _e() {
    return (
      we ||
        (we = (function (
          e,
          t,
          { blocked: n, upgrade: r, blocking: i, terminated: s } = {}
        ) {
          const o = indexedDB.open(e, t),
            a = K(o);
          return (
            r &&
              o.addEventListener("upgradeneeded", (e) => {
                r(K(o.result), e.oldVersion, e.newVersion, K(o.transaction), e);
              }),
            n &&
              o.addEventListener("blocked", (e) =>
                n(e.oldVersion, e.newVersion, e)
              ),
            a
              .then((e) => {
                s && e.addEventListener("close", () => s()),
                  i &&
                    e.addEventListener("versionchange", (e) =>
                      i(e.oldVersion, e.newVersion, e)
                    );
              })
              .catch(() => {}),
            a
          );
        })(me, ye, {
          upgrade: (e, t) => {
            0 === t && e.createObjectStore(ve);
          },
        }).catch((e) => {
          throw ue.create("idb-open", { originalErrorMessage: e.message });
        })),
      we
    );
  }
  async function Ee(e, t) {
    try {
      const n = (await _e()).transaction(ve, "readwrite"),
        r = n.objectStore(ve);
      await r.put(t, Ie(e)), await n.done;
    } catch (e) {
      if (e instanceof f) ne.warn(e.message);
      else {
        const t = ue.create("idb-set", {
          originalErrorMessage: null == e ? void 0 : e.message,
        });
        ne.warn(t.message);
      }
    }
  }
  function Ie(e) {
    return `${e.name}!${e.options.appId}`;
  }
  class Te {
    constructor(e) {
      (this.container = e), (this._heartbeatsCache = null);
      const t = this.container.getProvider("app").getImmediate();
      (this._storage = new Se(t)),
        (this._heartbeatsCachePromise = this._storage
          .read()
          .then((e) => ((this._heartbeatsCache = e), e)));
    }
    async triggerHeartbeat() {
      var e;
      const t = this.container
          .getProvider("platform-logger")
          .getImmediate()
          .getPlatformInfoString(),
        n = be();
      if (
        (null ==
          (null === (e = this._heartbeatsCache) || void 0 === e
            ? void 0
            : e.heartbeats) &&
          (this._heartbeatsCache = await this._heartbeatsCachePromise),
        this._heartbeatsCache.lastSentHeartbeatDate !== n &&
          !this._heartbeatsCache.heartbeats.some((e) => e.date === n))
      )
        return (
          this._heartbeatsCache.heartbeats.push({ date: n, agent: t }),
          (this._heartbeatsCache.heartbeats =
            this._heartbeatsCache.heartbeats.filter((e) => {
              const t = new Date(e.date).valueOf();
              return Date.now() - t <= 2592e6;
            })),
          this._storage.overwrite(this._heartbeatsCache)
        );
    }
    async getHeartbeatsHeader() {
      var e;
      if (
        (null === this._heartbeatsCache && (await this._heartbeatsCachePromise),
        null ==
          (null === (e = this._heartbeatsCache) || void 0 === e
            ? void 0
            : e.heartbeats) || 0 === this._heartbeatsCache.heartbeats.length)
      )
        return "";
      const t = be(),
        { heartbeatsToSend: n, unsentEntries: r } = (function (e, t = 1024) {
          const n = [];
          let r = e.slice();
          for (const i of e) {
            const e = n.find((e) => e.agent === i.agent);
            if (e) {
              if ((e.dates.push(i.date), Ce(n) > t)) {
                e.dates.pop();
                break;
              }
            } else if (
              (n.push({ agent: i.agent, dates: [i.date] }), Ce(n) > t)
            ) {
              n.pop();
              break;
            }
            r = r.slice(1);
          }
          return { heartbeatsToSend: n, unsentEntries: r };
        })(this._heartbeatsCache.heartbeats),
        s = i(JSON.stringify({ version: 2, heartbeats: n }));
      return (
        (this._heartbeatsCache.lastSentHeartbeatDate = t),
        r.length > 0
          ? ((this._heartbeatsCache.heartbeats = r),
            await this._storage.overwrite(this._heartbeatsCache))
          : ((this._heartbeatsCache.heartbeats = []),
            this._storage.overwrite(this._heartbeatsCache)),
        s
      );
    }
  }
  function be() {
    return new Date().toISOString().substring(0, 10);
  }
  class Se {
    constructor(e) {
      (this.app = e),
        (this._canUseIndexedDBPromise = this.runIndexedDBEnvironmentCheck());
    }
    async runIndexedDBEnvironmentCheck() {
      return (
        !!(function () {
          try {
            return "object" == typeof indexedDB;
          } catch (e) {
            return !1;
          }
        })() &&
        new Promise((e, t) => {
          try {
            let n = !0;
            const r = "validate-browser-context-for-indexeddb-analytics-module",
              i = self.indexedDB.open(r);
            (i.onsuccess = () => {
              i.result.close(), n || self.indexedDB.deleteDatabase(r), e(!0);
            }),
              (i.onupgradeneeded = () => {
                n = !1;
              }),
              (i.onerror = () => {
                var e;
                t(
                  (null === (e = i.error) || void 0 === e
                    ? void 0
                    : e.message) || ""
                );
              });
          } catch (e) {
            t(e);
          }
        })
          .then(() => !0)
          .catch(() => !1)
      );
    }
    async read() {
      if (await this._canUseIndexedDBPromise) {
        const e = await (async function (e) {
          try {
            const t = await _e();
            return await t.transaction(ve).objectStore(ve).get(Ie(e));
          } catch (e) {
            if (e instanceof f) ne.warn(e.message);
            else {
              const t = ue.create("idb-get", {
                originalErrorMessage: null == e ? void 0 : e.message,
              });
              ne.warn(t.message);
            }
          }
        })(this.app);
        return e || { heartbeats: [] };
      }
      return { heartbeats: [] };
    }
    async overwrite(e) {
      var t;
      if (await this._canUseIndexedDBPromise) {
        const n = await this.read();
        return Ee(this.app, {
          lastSentHeartbeatDate:
            null !== (t = e.lastSentHeartbeatDate) && void 0 !== t
              ? t
              : n.lastSentHeartbeatDate,
          heartbeats: e.heartbeats,
        });
      }
    }
    async add(e) {
      var t;
      if (await this._canUseIndexedDBPromise) {
        const n = await this.read();
        return Ee(this.app, {
          lastSentHeartbeatDate:
            null !== (t = e.lastSentHeartbeatDate) && void 0 !== t
              ? t
              : n.lastSentHeartbeatDate,
          heartbeats: [...n.heartbeats, ...e.heartbeats],
        });
      }
    }
  }
  function Ce(e) {
    return i(JSON.stringify({ version: 2, heartbeats: e })).length;
  }
  ce(new b("platform-logger", (e) => new Z(e), "PRIVATE")),
    ce(new b("heartbeat", (e) => new Te(e), "PRIVATE")),
    ge(ee, te, ""),
    ge(ee, te, "esm2017"),
    ge("fire-js", ""),
    ge("firebase", "10.6.0", "app");
  var ke,
    Ae =
      "undefined" != typeof globalThis
        ? globalThis
        : "undefined" != typeof window
        ? window
        : "undefined" != typeof global
        ? global
        : "undefined" != typeof self
        ? self
        : {},
    Ne = {},
    Re = Re || {},
    De = Ae || self;
  function Oe(e) {
    var t = typeof e;
    return (
      "array" ==
        (t =
          "object" != t ? t : e ? (Array.isArray(e) ? "array" : t) : "null") ||
      ("object" == t && "number" == typeof e.length)
    );
  }
  function Pe(e) {
    var t = typeof e;
    return ("object" == t && null != e) || "function" == t;
  }
  var Le = "closure_uid_" + ((1e9 * Math.random()) >>> 0),
    Me = 0;
  function xe(e, t, n) {
    return e.call.apply(e.bind, arguments);
  }
  function Ue(e, t, n) {
    if (!e) throw Error();
    if (2 < arguments.length) {
      var r = Array.prototype.slice.call(arguments, 2);
      return function () {
        var n = Array.prototype.slice.call(arguments);
        return Array.prototype.unshift.apply(n, r), e.apply(t, n);
      };
    }
    return function () {
      return e.apply(t, arguments);
    };
  }
  function Ve(e, t, n) {
    return (Ve =
      Function.prototype.bind &&
      -1 != Function.prototype.bind.toString().indexOf("native code")
        ? xe
        : Ue).apply(null, arguments);
  }
  function Fe(e, t) {
    var n = Array.prototype.slice.call(arguments, 1);
    return function () {
      var t = n.slice();
      return t.push.apply(t, arguments), e.apply(this, t);
    };
  }
  function je(e, t) {
    function n() {}
    (n.prototype = t.prototype),
      (e.$ = t.prototype),
      (e.prototype = new n()),
      (e.prototype.constructor = e),
      (e.ac = function (e, n, r) {
        for (
          var i = Array(arguments.length - 2), s = 2;
          s < arguments.length;
          s++
        )
          i[s - 2] = arguments[s];
        return t.prototype[n].apply(e, i);
      });
  }
  function Be() {
    (this.s = this.s), (this.o = this.o);
  }
  (Be.prototype.s = !1),
    (Be.prototype.sa = function () {
      var e;
      !this.s &&
        ((this.s = !0), this.N(), 0) &&
        ((e = this),
        (Object.prototype.hasOwnProperty.call(e, Le) && e[Le]) ||
          (e[Le] = ++Me));
    }),
    (Be.prototype.N = function () {
      if (this.o) for (; this.o.length; ) this.o.shift()();
    });
  const qe = Array.prototype.indexOf
    ? function (e, t) {
        return Array.prototype.indexOf.call(e, t, void 0);
      }
    : function (e, t) {
        if ("string" == typeof e)
          return "string" != typeof t || 1 != t.length ? -1 : e.indexOf(t, 0);
        for (let n = 0; n < e.length; n++) if (n in e && e[n] === t) return n;
        return -1;
      };
  function $e(e) {
    const t = e.length;
    if (0 < t) {
      const n = Array(t);
      for (let r = 0; r < t; r++) n[r] = e[r];
      return n;
    }
    return [];
  }
  function ze(e, t) {
    for (let t = 1; t < arguments.length; t++) {
      const n = arguments[t];
      if (Oe(n)) {
        const t = e.length || 0,
          r = n.length || 0;
        e.length = t + r;
        for (let i = 0; i < r; i++) e[t + i] = n[i];
      } else e.push(n);
    }
  }
  function He(e, t) {
    (this.type = e), (this.g = this.target = t), (this.defaultPrevented = !1);
  }
  He.prototype.h = function () {
    this.defaultPrevented = !0;
  };
  var Ke = (function () {
    if (!De.addEventListener || !Object.defineProperty) return !1;
    var e = !1,
      t = Object.defineProperty({}, "passive", {
        get: function () {
          e = !0;
        },
      });
    try {
      De.addEventListener("test", () => {}, t),
        De.removeEventListener("test", () => {}, t);
    } catch (e) {}
    return e;
  })();
  function Ge(e) {
    return /^[\s\xa0]*$/.test(e);
  }
  function We() {
    var e = De.navigator;
    return e && (e = e.userAgent) ? e : "";
  }
  function Qe(e) {
    return -1 != We().indexOf(e);
  }
  function Xe(e) {
    return Xe[" "](e), e;
  }
  Xe[" "] = function () {};
  var Je,
    Ye,
    Ze,
    et = Qe("Opera"),
    tt = Qe("Trident") || Qe("MSIE"),
    nt = Qe("Edge"),
    rt = nt || tt,
    it =
      Qe("Gecko") &&
      !(-1 != We().toLowerCase().indexOf("webkit") && !Qe("Edge")) &&
      !(Qe("Trident") || Qe("MSIE")) &&
      !Qe("Edge"),
    st = -1 != We().toLowerCase().indexOf("webkit") && !Qe("Edge");
  function ot() {
    var e = De.document;
    return e ? e.documentMode : void 0;
  }
  e: {
    var at = "",
      ct =
        ((Ye = We()),
        it
          ? /rv:([^\);]+)(\)|;)/.exec(Ye)
          : nt
          ? /Edge\/([\d\.]+)/.exec(Ye)
          : tt
          ? /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(Ye)
          : st
          ? /WebKit\/(\S+)/.exec(Ye)
          : et
          ? /(?:Version)[ \/]?(\S+)/.exec(Ye)
          : void 0);
    if ((ct && (at = ct ? ct[1] : ""), tt)) {
      var ht = ot();
      if (null != ht && ht > parseFloat(at)) {
        Je = String(ht);
        break e;
      }
    }
    Je = at;
  }
  De.document && tt ? (Ze = ot() || parseInt(Je, 10) || void 0) : (Ze = void 0);
  var ut = Ze;
  function lt(e, t) {
    if (
      (He.call(this, e ? e.type : ""),
      (this.relatedTarget = this.g = this.target = null),
      (this.button =
        this.screenY =
        this.screenX =
        this.clientY =
        this.clientX =
          0),
      (this.key = ""),
      (this.metaKey = this.shiftKey = this.altKey = this.ctrlKey = !1),
      (this.state = null),
      (this.pointerId = 0),
      (this.pointerType = ""),
      (this.i = null),
      e)
    ) {
      var n = (this.type = e.type),
        r =
          e.changedTouches && e.changedTouches.length
            ? e.changedTouches[0]
            : null;
      if (
        ((this.target = e.target || e.srcElement),
        (this.g = t),
        (t = e.relatedTarget))
      ) {
        if (it) {
          e: {
            try {
              Xe(t.nodeName);
              var i = !0;
              break e;
            } catch (e) {}
            i = !1;
          }
          i || (t = null);
        }
      } else
        "mouseover" == n
          ? (t = e.fromElement)
          : "mouseout" == n && (t = e.toElement);
      (this.relatedTarget = t),
        r
          ? ((this.clientX = void 0 !== r.clientX ? r.clientX : r.pageX),
            (this.clientY = void 0 !== r.clientY ? r.clientY : r.pageY),
            (this.screenX = r.screenX || 0),
            (this.screenY = r.screenY || 0))
          : ((this.clientX = void 0 !== e.clientX ? e.clientX : e.pageX),
            (this.clientY = void 0 !== e.clientY ? e.clientY : e.pageY),
            (this.screenX = e.screenX || 0),
            (this.screenY = e.screenY || 0)),
        (this.button = e.button),
        (this.key = e.key || ""),
        (this.ctrlKey = e.ctrlKey),
        (this.altKey = e.altKey),
        (this.shiftKey = e.shiftKey),
        (this.metaKey = e.metaKey),
        (this.pointerId = e.pointerId || 0),
        (this.pointerType =
          "string" == typeof e.pointerType
            ? e.pointerType
            : dt[e.pointerType] || ""),
        (this.state = e.state),
        (this.i = e),
        e.defaultPrevented && lt.$.h.call(this);
    }
  }
  je(lt, He);
  var dt = { 2: "touch", 3: "pen", 4: "mouse" };
  lt.prototype.h = function () {
    lt.$.h.call(this);
    var e = this.i;
    e.preventDefault ? e.preventDefault() : (e.returnValue = !1);
  };
  var ft = "closure_listenable_" + ((1e6 * Math.random()) | 0),
    pt = 0;
  function gt(e, t, n, r, i) {
    (this.listener = e),
      (this.proxy = null),
      (this.src = t),
      (this.type = n),
      (this.capture = !!r),
      (this.la = i),
      (this.key = ++pt),
      (this.fa = this.ia = !1);
  }
  function mt(e) {
    (e.fa = !0),
      (e.listener = null),
      (e.proxy = null),
      (e.src = null),
      (e.la = null);
  }
  function yt(e, t, n) {
    for (const r in e) t.call(n, e[r], r, e);
  }
  function vt(e) {
    const t = {};
    for (const n in e) t[n] = e[n];
    return t;
  }
  const wt =
    "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(
      " "
    );
  function _t(e, t) {
    let n, r;
    for (let t = 1; t < arguments.length; t++) {
      for (n in ((r = arguments[t]), r)) e[n] = r[n];
      for (let t = 0; t < wt.length; t++)
        (n = wt[t]),
          Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
  }
  function Et(e) {
    (this.src = e), (this.g = {}), (this.h = 0);
  }
  function It(e, t) {
    var n = t.type;
    if (n in e.g) {
      var r,
        i = e.g[n],
        s = qe(i, t);
      (r = 0 <= s) && Array.prototype.splice.call(i, s, 1),
        r && (mt(t), 0 == e.g[n].length && (delete e.g[n], e.h--));
    }
  }
  function Tt(e, t, n, r) {
    for (var i = 0; i < e.length; ++i) {
      var s = e[i];
      if (!s.fa && s.listener == t && s.capture == !!n && s.la == r) return i;
    }
    return -1;
  }
  Et.prototype.add = function (e, t, n, r, i) {
    var s = e.toString();
    (e = this.g[s]) || ((e = this.g[s] = []), this.h++);
    var o = Tt(e, t, r, i);
    return (
      -1 < o
        ? ((t = e[o]), n || (t.ia = !1))
        : (((t = new gt(t, this.src, s, !!r, i)).ia = n), e.push(t)),
      t
    );
  };
  var bt = "closure_lm_" + ((1e6 * Math.random()) | 0),
    St = {};
  function Ct(e, t, n, r, i) {
    if (r && r.once) return At(e, t, n, r, i);
    if (Array.isArray(t)) {
      for (var s = 0; s < t.length; s++) Ct(e, t[s], n, r, i);
      return null;
    }
    return (
      (n = Mt(n)),
      e && e[ft]
        ? e.O(t, n, Pe(r) ? !!r.capture : !!r, i)
        : kt(e, t, n, !1, r, i)
    );
  }
  function kt(e, t, n, r, i, s) {
    if (!t) throw Error("Invalid event type");
    var o = Pe(i) ? !!i.capture : !!i,
      a = Pt(e);
    if ((a || (e[bt] = a = new Et(e)), (n = a.add(t, n, r, o, s)).proxy))
      return n;
    if (
      ((r = (function () {
        const e = Ot;
        return function t(n) {
          return e.call(t.src, t.listener, n);
        };
      })()),
      (n.proxy = r),
      (r.src = e),
      (r.listener = n),
      e.addEventListener)
    )
      Ke || (i = o),
        void 0 === i && (i = !1),
        e.addEventListener(t.toString(), r, i);
    else if (e.attachEvent) e.attachEvent(Dt(t.toString()), r);
    else {
      if (!e.addListener || !e.removeListener)
        throw Error("addEventListener and attachEvent are unavailable.");
      e.addListener(r);
    }
    return n;
  }
  function At(e, t, n, r, i) {
    if (Array.isArray(t)) {
      for (var s = 0; s < t.length; s++) At(e, t[s], n, r, i);
      return null;
    }
    return (
      (n = Mt(n)),
      e && e[ft]
        ? e.P(t, n, Pe(r) ? !!r.capture : !!r, i)
        : kt(e, t, n, !0, r, i)
    );
  }
  function Nt(e, t, n, r, i) {
    if (Array.isArray(t))
      for (var s = 0; s < t.length; s++) Nt(e, t[s], n, r, i);
    else
      (r = Pe(r) ? !!r.capture : !!r),
        (n = Mt(n)),
        e && e[ft]
          ? ((e = e.i),
            (t = String(t).toString()) in e.g &&
              -1 < (n = Tt((s = e.g[t]), n, r, i)) &&
              (mt(s[n]),
              Array.prototype.splice.call(s, n, 1),
              0 == s.length && (delete e.g[t], e.h--)))
          : e &&
            (e = Pt(e)) &&
            ((t = e.g[t.toString()]),
            (e = -1),
            t && (e = Tt(t, n, r, i)),
            (n = -1 < e ? t[e] : null) && Rt(n));
  }
  function Rt(e) {
    if ("number" != typeof e && e && !e.fa) {
      var t = e.src;
      if (t && t[ft]) It(t.i, e);
      else {
        var n = e.type,
          r = e.proxy;
        t.removeEventListener
          ? t.removeEventListener(n, r, e.capture)
          : t.detachEvent
          ? t.detachEvent(Dt(n), r)
          : t.addListener && t.removeListener && t.removeListener(r),
          (n = Pt(t))
            ? (It(n, e), 0 == n.h && ((n.src = null), (t[bt] = null)))
            : mt(e);
      }
    }
  }
  function Dt(e) {
    return e in St ? St[e] : (St[e] = "on" + e);
  }
  function Ot(e, t) {
    if (e.fa) e = !0;
    else {
      t = new lt(t, this);
      var n = e.listener,
        r = e.la || e.src;
      e.ia && Rt(e), (e = n.call(r, t));
    }
    return e;
  }
  function Pt(e) {
    return (e = e[bt]) instanceof Et ? e : null;
  }
  var Lt = "__closure_events_fn_" + ((1e9 * Math.random()) >>> 0);
  function Mt(e) {
    return "function" == typeof e
      ? e
      : (e[Lt] ||
          (e[Lt] = function (t) {
            return e.handleEvent(t);
          }),
        e[Lt]);
  }
  function xt() {
    Be.call(this), (this.i = new Et(this)), (this.S = this), (this.J = null);
  }
  function Ut(e, t) {
    var n,
      r = e.J;
    if (r) for (n = []; r; r = r.J) n.push(r);
    if (((e = e.S), (r = t.type || t), "string" == typeof t)) t = new He(t, e);
    else if (t instanceof He) t.target = t.target || e;
    else {
      var i = t;
      _t((t = new He(r, e)), i);
    }
    if (((i = !0), n))
      for (var s = n.length - 1; 0 <= s; s--) {
        var o = (t.g = n[s]);
        i = Vt(o, r, !0, t) && i;
      }
    if (((i = Vt((o = t.g = e), r, !0, t) && i), (i = Vt(o, r, !1, t) && i), n))
      for (s = 0; s < n.length; s++) i = Vt((o = t.g = n[s]), r, !1, t) && i;
  }
  function Vt(e, t, n, r) {
    if (!(t = e.i.g[String(t)])) return !0;
    t = t.concat();
    for (var i = !0, s = 0; s < t.length; ++s) {
      var o = t[s];
      if (o && !o.fa && o.capture == n) {
        var a = o.listener,
          c = o.la || o.src;
        o.ia && It(e.i, o), (i = !1 !== a.call(c, r) && i);
      }
    }
    return i && !r.defaultPrevented;
  }
  je(xt, Be),
    (xt.prototype[ft] = !0),
    (xt.prototype.removeEventListener = function (e, t, n, r) {
      Nt(this, e, t, n, r);
    }),
    (xt.prototype.N = function () {
      if ((xt.$.N.call(this), this.i)) {
        var e,
          t = this.i;
        for (e in t.g) {
          for (var n = t.g[e], r = 0; r < n.length; r++) mt(n[r]);
          delete t.g[e], t.h--;
        }
      }
      this.J = null;
    }),
    (xt.prototype.O = function (e, t, n, r) {
      return this.i.add(String(e), t, !1, n, r);
    }),
    (xt.prototype.P = function (e, t, n, r) {
      return this.i.add(String(e), t, !0, n, r);
    });
  var Ft = De.JSON.stringify;
  function jt() {
    var e = Gt;
    let t = null;
    return (
      e.g &&
        ((t = e.g), (e.g = e.g.next), e.g || (e.h = null), (t.next = null)),
      t
    );
  }
  var Bt = new (class {
    constructor(e, t) {
      (this.i = e), (this.j = t), (this.h = 0), (this.g = null);
    }
    get() {
      let e;
      return (
        0 < this.h
          ? (this.h--, (e = this.g), (this.g = e.next), (e.next = null))
          : (e = this.i()),
        e
      );
    }
  })(
    () => new qt(),
    (e) => e.reset()
  );
  class qt {
    constructor() {
      this.next = this.g = this.h = null;
    }
    set(e, t) {
      (this.h = e), (this.g = t), (this.next = null);
    }
    reset() {
      this.next = this.g = this.h = null;
    }
  }
  function $t(e) {
    var t = 1;
    e = e.split(":");
    const n = [];
    for (; 0 < t && e.length; ) n.push(e.shift()), t--;
    return e.length && n.push(e.join(":")), n;
  }
  function zt(e) {
    De.setTimeout(() => {
      throw e;
    }, 0);
  }
  let Ht,
    Kt = !1,
    Gt = new (class {
      constructor() {
        this.h = this.g = null;
      }
      add(e, t) {
        const n = Bt.get();
        n.set(e, t), this.h ? (this.h.next = n) : (this.g = n), (this.h = n);
      }
    })(),
    Wt = () => {
      const e = De.Promise.resolve(void 0);
      Ht = () => {
        e.then(Qt);
      };
    };
  var Qt = () => {
    for (var e; (e = jt()); ) {
      try {
        e.h.call(e.g);
      } catch (e) {
        zt(e);
      }
      var t = Bt;
      t.j(e), 100 > t.h && (t.h++, (e.next = t.g), (t.g = e));
    }
    Kt = !1;
  };
  function Xt(e, t) {
    xt.call(this),
      (this.h = e || 1),
      (this.g = t || De),
      (this.j = Ve(this.qb, this)),
      (this.l = Date.now());
  }
  function Jt(e) {
    (e.ga = !1), e.T && (e.g.clearTimeout(e.T), (e.T = null));
  }
  function Yt(e, t, n) {
    if ("function" == typeof e) n && (e = Ve(e, n));
    else {
      if (!e || "function" != typeof e.handleEvent)
        throw Error("Invalid listener argument");
      e = Ve(e.handleEvent, e);
    }
    return 2147483647 < Number(t) ? -1 : De.setTimeout(e, t || 0);
  }
  function Zt(e) {
    e.g = Yt(() => {
      (e.g = null), e.i && ((e.i = !1), Zt(e));
    }, e.j);
    const t = e.h;
    (e.h = null), e.m.apply(null, t);
  }
  je(Xt, xt),
    ((ke = Xt.prototype).ga = !1),
    (ke.T = null),
    (ke.qb = function () {
      if (this.ga) {
        var e = Date.now() - this.l;
        0 < e && e < 0.8 * this.h
          ? (this.T = this.g.setTimeout(this.j, this.h - e))
          : (this.T && (this.g.clearTimeout(this.T), (this.T = null)),
            Ut(this, "tick"),
            this.ga && (Jt(this), this.start()));
      }
    }),
    (ke.start = function () {
      (this.ga = !0),
        this.T ||
          ((this.T = this.g.setTimeout(this.j, this.h)), (this.l = Date.now()));
    }),
    (ke.N = function () {
      Xt.$.N.call(this), Jt(this), delete this.g;
    });
  class en extends Be {
    constructor(e, t) {
      super(),
        (this.m = e),
        (this.j = t),
        (this.h = null),
        (this.i = !1),
        (this.g = null);
    }
    l(e) {
      (this.h = arguments), this.g ? (this.i = !0) : Zt(this);
    }
    N() {
      super.N(),
        this.g &&
          (De.clearTimeout(this.g),
          (this.g = null),
          (this.i = !1),
          (this.h = null));
    }
  }
  function tn(e) {
    Be.call(this), (this.h = e), (this.g = {});
  }
  je(tn, Be);
  var nn = [];
  function rn(e, t, n, r) {
    Array.isArray(n) || (n && (nn[0] = n.toString()), (n = nn));
    for (var i = 0; i < n.length; i++) {
      var s = Ct(t, n[i], r || e.handleEvent, !1, e.h || e);
      if (!s) break;
      e.g[s.key] = s;
    }
  }
  function sn(e) {
    yt(
      e.g,
      function (e, t) {
        this.g.hasOwnProperty(t) && Rt(e);
      },
      e
    ),
      (e.g = {});
  }
  function on() {
    this.g = !0;
  }
  function an(e, t, n, r) {
    e.info(function () {
      return (
        "XMLHTTP TEXT (" +
        t +
        "): " +
        (function (e, t) {
          if (!e.g) return t;
          if (!t) return null;
          try {
            var n = JSON.parse(t);
            if (n)
              for (e = 0; e < n.length; e++)
                if (Array.isArray(n[e])) {
                  var r = n[e];
                  if (!(2 > r.length)) {
                    var i = r[1];
                    if (Array.isArray(i) && !(1 > i.length)) {
                      var s = i[0];
                      if ("noop" != s && "stop" != s && "close" != s)
                        for (var o = 1; o < i.length; o++) i[o] = "";
                    }
                  }
                }
            return Ft(n);
          } catch (e) {
            return t;
          }
        })(e, n) +
        (r ? " " + r : "")
      );
    });
  }
  (tn.prototype.N = function () {
    tn.$.N.call(this), sn(this);
  }),
    (tn.prototype.handleEvent = function () {
      throw Error("EventHandler.handleEvent not implemented");
    }),
    (on.prototype.Ea = function () {
      this.g = !1;
    }),
    (on.prototype.info = function () {});
  var cn = {},
    hn = null;
  function un() {
    return (hn = hn || new xt());
  }
  function ln(e) {
    He.call(this, cn.Ta, e);
  }
  function dn(e) {
    const t = un();
    Ut(t, new ln(t));
  }
  function fn(e, t) {
    He.call(this, cn.STAT_EVENT, e), (this.stat = t);
  }
  function pn(e) {
    const t = un();
    Ut(t, new fn(t, e));
  }
  function gn(e, t) {
    He.call(this, cn.Ua, e), (this.size = t);
  }
  function mn(e, t) {
    if ("function" != typeof e)
      throw Error("Fn must not be null and must be a function");
    return De.setTimeout(function () {
      e();
    }, t);
  }
  (cn.Ta = "serverreachability"),
    je(ln, He),
    (cn.STAT_EVENT = "statevent"),
    je(fn, He),
    (cn.Ua = "timingevent"),
    je(gn, He);
  var yn = {
      NO_ERROR: 0,
      rb: 1,
      Eb: 2,
      Db: 3,
      yb: 4,
      Cb: 5,
      Fb: 6,
      Qa: 7,
      TIMEOUT: 8,
      Ib: 9,
    },
    vn = {
      wb: "complete",
      Sb: "success",
      Ra: "error",
      Qa: "abort",
      Kb: "ready",
      Lb: "readystatechange",
      TIMEOUT: "timeout",
      Gb: "incrementaldata",
      Jb: "progress",
      zb: "downloadprogress",
      $b: "uploadprogress",
    };
  function wn() {}
  function _n(e) {
    return e.h || (e.h = e.i());
  }
  function En() {}
  wn.prototype.h = null;
  var In,
    Tn = { OPEN: "a", vb: "b", Ra: "c", Hb: "d" };
  function bn() {
    He.call(this, "d");
  }
  function Sn() {
    He.call(this, "c");
  }
  function Cn() {}
  function kn(e, t, n, r) {
    (this.l = e),
      (this.j = t),
      (this.m = n),
      (this.W = r || 1),
      (this.U = new tn(this)),
      (this.P = Nn),
      (e = rt ? 125 : void 0),
      (this.V = new Xt(e)),
      (this.I = null),
      (this.i = !1),
      (this.s = this.A = this.v = this.L = this.G = this.Y = this.B = null),
      (this.F = []),
      (this.g = null),
      (this.C = 0),
      (this.o = this.u = null),
      (this.ca = -1),
      (this.J = !1),
      (this.O = 0),
      (this.M = null),
      (this.ba = this.K = this.aa = this.S = !1),
      (this.h = new An());
  }
  function An() {
    (this.i = null), (this.g = ""), (this.h = !1);
  }
  je(bn, He),
    je(Sn, He),
    je(Cn, wn),
    (Cn.prototype.g = function () {
      return new XMLHttpRequest();
    }),
    (Cn.prototype.i = function () {
      return {};
    }),
    (In = new Cn());
  var Nn = 45e3,
    Rn = {},
    Dn = {};
  function On(e, t, n) {
    (e.L = 1), (e.v = Jn(Kn(t))), (e.s = n), (e.S = !0), Pn(e, null);
  }
  function Pn(e, t) {
    (e.G = Date.now()), Un(e), (e.A = Kn(e.v));
    var n = e.A,
      r = e.W;
    Array.isArray(r) || (r = [String(r)]),
      ur(n.i, "t", r),
      (e.C = 0),
      (n = e.l.J),
      (e.h = new An()),
      (e.g = ui(e.l, n ? t : null, !e.s)),
      0 < e.O && (e.M = new en(Ve(e.Pa, e, e.g), e.O)),
      rn(e.U, e.g, "readystatechange", e.nb),
      (t = e.I ? vt(e.I) : {}),
      e.s
        ? (e.u || (e.u = "POST"),
          (t["Content-Type"] = "application/x-www-form-urlencoded"),
          e.g.ha(e.A, e.u, e.s, t))
        : ((e.u = "GET"), e.g.ha(e.A, e.u, null, t)),
      dn(),
      (function (e, t, n, r, i, s) {
        e.info(function () {
          if (e.g)
            if (s)
              for (var o = "", a = s.split("&"), c = 0; c < a.length; c++) {
                var h = a[c].split("=");
                if (1 < h.length) {
                  var u = h[0];
                  h = h[1];
                  var l = u.split("_");
                  o =
                    2 <= l.length && "type" == l[1]
                      ? o + (u + "=") + h + "&"
                      : o + (u + "=redacted&");
                }
              }
            else o = null;
          else o = s;
          return (
            "XMLHTTP REQ (" +
            r +
            ") [attempt " +
            i +
            "]: " +
            t +
            "\n" +
            n +
            "\n" +
            o
          );
        });
      })(e.j, e.u, e.A, e.m, e.W, e.s);
  }
  function Ln(e) {
    return !!e.g && "GET" == e.u && 2 != e.L && e.l.Ha;
  }
  function Mn(e, t, n) {
    let r,
      i = !0;
    for (; !e.J && e.C < n.length; ) {
      if (((r = xn(e, n)), r == Dn)) {
        4 == t && ((e.o = 4), pn(14), (i = !1)),
          an(e.j, e.m, null, "[Incomplete Response]");
        break;
      }
      if (r == Rn) {
        (e.o = 4), pn(15), an(e.j, e.m, n, "[Invalid Chunk]"), (i = !1);
        break;
      }
      an(e.j, e.m, r, null), qn(e, r);
    }
    Ln(e) && r != Dn && r != Rn && ((e.h.g = ""), (e.C = 0)),
      4 != t || 0 != n.length || e.h.h || ((e.o = 1), pn(16), (i = !1)),
      (e.i = e.i && i),
      i
        ? 0 < n.length &&
          !e.ba &&
          ((e.ba = !0),
          (t = e.l).g == e &&
            t.ca &&
            !t.M &&
            (t.l.info(
              "Great, no buffering proxy detected. Bytes received: " + n.length
            ),
            ni(t),
            (t.M = !0),
            pn(11)))
        : (an(e.j, e.m, n, "[Invalid Chunked Response]"), Bn(e), jn(e));
  }
  function xn(e, t) {
    var n = e.C,
      r = t.indexOf("\n", n);
    return -1 == r
      ? Dn
      : ((n = Number(t.substring(n, r))),
        isNaN(n)
          ? Rn
          : (r += 1) + n > t.length
          ? Dn
          : ((t = t.slice(r, r + n)), (e.C = r + n), t));
  }
  function Un(e) {
    (e.Y = Date.now() + e.P), Vn(e, e.P);
  }
  function Vn(e, t) {
    if (null != e.B) throw Error("WatchDog timer not null");
    e.B = mn(Ve(e.lb, e), t);
  }
  function Fn(e) {
    e.B && (De.clearTimeout(e.B), (e.B = null));
  }
  function jn(e) {
    0 == e.l.H || e.J || si(e.l, e);
  }
  function Bn(e) {
    Fn(e);
    var t = e.M;
    t && "function" == typeof t.sa && t.sa(),
      (e.M = null),
      Jt(e.V),
      sn(e.U),
      e.g && ((t = e.g), (e.g = null), t.abort(), t.sa());
  }
  function qn(e, t) {
    try {
      var n = e.l;
      if (0 != n.H && (n.g == e || yr(n.i, e)))
        if (!e.K && yr(n.i, e) && 3 == n.H) {
          try {
            var r = n.Ja.g.parse(t);
          } catch (e) {
            r = null;
          }
          if (Array.isArray(r) && 3 == r.length) {
            var i = r;
            if (0 == i[0]) {
              e: if (!n.u) {
                if (n.g) {
                  if (!(n.g.G + 3e3 < e.G)) break e;
                  ii(n), Wr(n);
                }
                ti(n), pn(18);
              }
            } else
              (n.Fa = i[1]),
                0 < n.Fa - n.V &&
                  37500 > i[2] &&
                  n.G &&
                  0 == n.A &&
                  !n.v &&
                  (n.v = mn(Ve(n.ib, n), 6e3));
            if (1 >= mr(n.i) && n.oa) {
              try {
                n.oa();
              } catch (e) {}
              n.oa = void 0;
            }
          } else ai(n, 11);
        } else if (((e.K || n.g == e) && ii(n), !Ge(t)))
          for (i = n.Ja.g.parse(t), t = 0; t < i.length; t++) {
            let h = i[t];
            if (((n.V = h[0]), (h = h[1]), 2 == n.H))
              if ("c" == h[0]) {
                (n.K = h[1]), (n.pa = h[2]);
                const t = h[3];
                null != t && ((n.ra = t), n.l.info("VER=" + n.ra));
                const i = h[4];
                null != i && ((n.Ga = i), n.l.info("SVER=" + n.Ga));
                const u = h[5];
                null != u &&
                  "number" == typeof u &&
                  0 < u &&
                  ((r = 1.5 * u),
                  (n.L = r),
                  n.l.info("backChannelRequestTimeoutMs_=" + r)),
                  (r = n);
                const l = e.g;
                if (l) {
                  const e = l.g
                    ? l.g.getResponseHeader("X-Client-Wire-Protocol")
                    : null;
                  if (e) {
                    var s = r.i;
                    s.g ||
                      (-1 == e.indexOf("spdy") &&
                        -1 == e.indexOf("quic") &&
                        -1 == e.indexOf("h2")) ||
                      ((s.j = s.l),
                      (s.g = new Set()),
                      s.h && (vr(s, s.h), (s.h = null)));
                  }
                  if (r.F) {
                    const e = l.g
                      ? l.g.getResponseHeader("X-HTTP-Session-Id")
                      : null;
                    e && ((r.Da = e), Xn(r.I, r.F, e));
                  }
                }
                (n.H = 3),
                  n.h && n.h.Ba(),
                  n.ca &&
                    ((n.S = Date.now() - e.G),
                    n.l.info("Handshake RTT: " + n.S + "ms"));
                var o = e;
                if ((((r = n).wa = hi(r, r.J ? r.pa : null, r.Y)), o.K)) {
                  wr(r.i, o);
                  var a = o,
                    c = r.L;
                  c && a.setTimeout(c), a.B && (Fn(a), Un(a)), (r.g = o);
                } else ei(r);
                0 < n.j.length && Xr(n);
              } else ("stop" != h[0] && "close" != h[0]) || ai(n, 7);
            else
              3 == n.H &&
                ("stop" == h[0] || "close" == h[0]
                  ? "stop" == h[0]
                    ? ai(n, 7)
                    : Gr(n)
                  : "noop" != h[0] && n.h && n.h.Aa(h),
                (n.A = 0));
          }
      dn();
    } catch (e) {}
  }
  function $n(e, t) {
    if (e.forEach && "function" == typeof e.forEach) e.forEach(t, void 0);
    else if (Oe(e) || "string" == typeof e)
      Array.prototype.forEach.call(e, t, void 0);
    else
      for (
        var n = (function (e) {
            if (e.ta && "function" == typeof e.ta) return e.ta();
            if (!e.Z || "function" != typeof e.Z) {
              if ("undefined" != typeof Map && e instanceof Map)
                return Array.from(e.keys());
              if (!("undefined" != typeof Set && e instanceof Set)) {
                if (Oe(e) || "string" == typeof e) {
                  var t = [];
                  e = e.length;
                  for (var n = 0; n < e; n++) t.push(n);
                  return t;
                }
                (t = []), (n = 0);
                for (const r in e) t[n++] = r;
                return t;
              }
            }
          })(e),
          r = (function (e) {
            if (e.Z && "function" == typeof e.Z) return e.Z();
            if (
              ("undefined" != typeof Map && e instanceof Map) ||
              ("undefined" != typeof Set && e instanceof Set)
            )
              return Array.from(e.values());
            if ("string" == typeof e) return e.split("");
            if (Oe(e)) {
              for (var t = [], n = e.length, r = 0; r < n; r++) t.push(e[r]);
              return t;
            }
            for (r in ((t = []), (n = 0), e)) t[n++] = e[r];
            return t;
          })(e),
          i = r.length,
          s = 0;
        s < i;
        s++
      )
        t.call(void 0, r[s], n && n[s], e);
  }
  ((ke = kn.prototype).setTimeout = function (e) {
    this.P = e;
  }),
    (ke.nb = function (e) {
      e = e.target;
      const t = this.M;
      t && 3 == Br(e) ? t.l() : this.Pa(e);
    }),
    (ke.Pa = function (e) {
      try {
        if (e == this.g)
          e: {
            const u = Br(this.g);
            var t = this.g.Ia();
            if (
              (this.g.da(),
              !(3 > u) &&
                (3 != u ||
                  rt ||
                  (this.g && (this.h.h || this.g.ja() || qr(this.g)))))
            ) {
              this.J || 4 != u || 7 == t || dn(), Fn(this);
              var n = this.g.da();
              this.ca = n;
              t: if (Ln(this)) {
                var r = qr(this.g);
                e = "";
                var i = r.length,
                  s = 4 == Br(this.g);
                if (!this.h.i) {
                  if ("undefined" == typeof TextDecoder) {
                    Bn(this), jn(this);
                    var o = "";
                    break t;
                  }
                  this.h.i = new De.TextDecoder();
                }
                for (t = 0; t < i; t++)
                  (this.h.h = !0),
                    (e += this.h.i.decode(r[t], { stream: s && t == i - 1 }));
                r.splice(0, i), (this.h.g += e), (this.C = 0), (o = this.h.g);
              } else o = this.g.ja();
              if (
                ((this.i = 200 == n),
                (function (e, t, n, r, i, s, o) {
                  e.info(function () {
                    return (
                      "XMLHTTP RESP (" +
                      r +
                      ") [ attempt " +
                      i +
                      "]: " +
                      t +
                      "\n" +
                      n +
                      "\n" +
                      s +
                      " " +
                      o
                    );
                  });
                })(this.j, this.u, this.A, this.m, this.W, u, n),
                this.i)
              ) {
                if (this.aa && !this.K) {
                  t: {
                    if (this.g) {
                      var a,
                        c = this.g;
                      if (
                        (a = c.g
                          ? c.g.getResponseHeader("X-HTTP-Initial-Response")
                          : null) &&
                        !Ge(a)
                      ) {
                        var h = a;
                        break t;
                      }
                    }
                    h = null;
                  }
                  if (!(n = h)) {
                    (this.i = !1), (this.o = 3), pn(12), Bn(this), jn(this);
                    break e;
                  }
                  an(
                    this.j,
                    this.m,
                    n,
                    "Initial handshake response via X-HTTP-Initial-Response"
                  ),
                    (this.K = !0),
                    qn(this, n);
                }
                this.S
                  ? (Mn(this, u, o),
                    rt &&
                      this.i &&
                      3 == u &&
                      (rn(this.U, this.V, "tick", this.mb), this.V.start()))
                  : (an(this.j, this.m, o, null), qn(this, o)),
                  4 == u && Bn(this),
                  this.i &&
                    !this.J &&
                    (4 == u ? si(this.l, this) : ((this.i = !1), Un(this)));
              } else
                (function (e) {
                  const t = {};
                  e = (
                    (e.g && 2 <= Br(e) && e.g.getAllResponseHeaders()) ||
                    ""
                  ).split("\r\n");
                  for (let r = 0; r < e.length; r++) {
                    if (Ge(e[r])) continue;
                    var n = $t(e[r]);
                    const i = n[0];
                    if ("string" != typeof (n = n[1])) continue;
                    n = n.trim();
                    const s = t[i] || [];
                    (t[i] = s), s.push(n);
                  }
                  !(function (e, t) {
                    for (const n in e) t.call(void 0, e[n], n, e);
                  })(t, function (e) {
                    return e.join(", ");
                  });
                })(this.g),
                  400 == n && 0 < o.indexOf("Unknown SID")
                    ? ((this.o = 3), pn(12))
                    : ((this.o = 0), pn(13)),
                  Bn(this),
                  jn(this);
            }
          }
      } catch (e) {}
    }),
    (ke.mb = function () {
      if (this.g) {
        var e = Br(this.g),
          t = this.g.ja();
        this.C < t.length &&
          (Fn(this), Mn(this, e, t), this.i && 4 != e && Un(this));
      }
    }),
    (ke.cancel = function () {
      (this.J = !0), Bn(this);
    }),
    (ke.lb = function () {
      this.B = null;
      const e = Date.now();
      0 <= e - this.Y
        ? ((function (e, t) {
            e.info(function () {
              return "TIMEOUT: " + t;
            });
          })(this.j, this.A),
          2 != this.L && (dn(), pn(17)),
          Bn(this),
          (this.o = 2),
          jn(this))
        : Vn(this, this.Y - e);
    });
  var zn = RegExp(
    "^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$"
  );
  function Hn(e) {
    if (
      ((this.g = this.s = this.j = ""),
      (this.m = null),
      (this.o = this.l = ""),
      (this.h = !1),
      e instanceof Hn)
    ) {
      (this.h = e.h),
        Gn(this, e.j),
        (this.s = e.s),
        (this.g = e.g),
        Wn(this, e.m),
        (this.l = e.l);
      var t = e.i,
        n = new or();
      (n.i = t.i),
        t.g && ((n.g = new Map(t.g)), (n.h = t.h)),
        Qn(this, n),
        (this.o = e.o);
    } else
      e && (t = String(e).match(zn))
        ? ((this.h = !1),
          Gn(this, t[1] || "", !0),
          (this.s = Yn(t[2] || "")),
          (this.g = Yn(t[3] || "", !0)),
          Wn(this, t[4]),
          (this.l = Yn(t[5] || "", !0)),
          Qn(this, t[6] || "", !0),
          (this.o = Yn(t[7] || "")))
        : ((this.h = !1), (this.i = new or(null, this.h)));
  }
  function Kn(e) {
    return new Hn(e);
  }
  function Gn(e, t, n) {
    (e.j = n ? Yn(t, !0) : t), e.j && (e.j = e.j.replace(/:$/, ""));
  }
  function Wn(e, t) {
    if (t) {
      if (((t = Number(t)), isNaN(t) || 0 > t))
        throw Error("Bad port number " + t);
      e.m = t;
    } else e.m = null;
  }
  function Qn(e, t, n) {
    t instanceof or
      ? ((e.i = t),
        (function (e, t) {
          t &&
            !e.j &&
            (ar(e),
            (e.i = null),
            e.g.forEach(function (e, t) {
              var n = t.toLowerCase();
              t != n && (cr(this, t), ur(this, n, e));
            }, e)),
            (e.j = t);
        })(e.i, e.h))
      : (n || (t = Zn(t, ir)), (e.i = new or(t, e.h)));
  }
  function Xn(e, t, n) {
    e.i.set(t, n);
  }
  function Jn(e) {
    return (
      Xn(
        e,
        "zx",
        Math.floor(2147483648 * Math.random()).toString(36) +
          Math.abs(
            Math.floor(2147483648 * Math.random()) ^ Date.now()
          ).toString(36)
      ),
      e
    );
  }
  function Yn(e, t) {
    return e
      ? t
        ? decodeURI(e.replace(/%25/g, "%2525"))
        : decodeURIComponent(e)
      : "";
  }
  function Zn(e, t, n) {
    return "string" == typeof e
      ? ((e = encodeURI(e).replace(t, er)),
        n && (e = e.replace(/%25([0-9a-fA-F]{2})/g, "%$1")),
        e)
      : null;
  }
  function er(e) {
    return (
      "%" +
      (((e = e.charCodeAt(0)) >> 4) & 15).toString(16) +
      (15 & e).toString(16)
    );
  }
  Hn.prototype.toString = function () {
    var e = [],
      t = this.j;
    t && e.push(Zn(t, tr, !0), ":");
    var n = this.g;
    return (
      (n || "file" == t) &&
        (e.push("//"),
        (t = this.s) && e.push(Zn(t, tr, !0), "@"),
        e.push(
          encodeURIComponent(String(n)).replace(/%25([0-9a-fA-F]{2})/g, "%$1")
        ),
        null != (n = this.m) && e.push(":", String(n))),
      (n = this.l) &&
        (this.g && "/" != n.charAt(0) && e.push("/"),
        e.push(Zn(n, "/" == n.charAt(0) ? rr : nr, !0))),
      (n = this.i.toString()) && e.push("?", n),
      (n = this.o) && e.push("#", Zn(n, sr)),
      e.join("")
    );
  };
  var tr = /[#\/\?@]/g,
    nr = /[#\?:]/g,
    rr = /[#\?]/g,
    ir = /[#\?@]/g,
    sr = /#/g;
  function or(e, t) {
    (this.h = this.g = null), (this.i = e || null), (this.j = !!t);
  }
  function ar(e) {
    e.g ||
      ((e.g = new Map()),
      (e.h = 0),
      e.i &&
        (function (e, t) {
          if (e) {
            e = e.split("&");
            for (var n = 0; n < e.length; n++) {
              var r = e[n].indexOf("="),
                i = null;
              if (0 <= r) {
                var s = e[n].substring(0, r);
                i = e[n].substring(r + 1);
              } else s = e[n];
              t(s, i ? decodeURIComponent(i.replace(/\+/g, " ")) : "");
            }
          }
        })(e.i, function (t, n) {
          e.add(decodeURIComponent(t.replace(/\+/g, " ")), n);
        }));
  }
  function cr(e, t) {
    ar(e),
      (t = lr(e, t)),
      e.g.has(t) && ((e.i = null), (e.h -= e.g.get(t).length), e.g.delete(t));
  }
  function hr(e, t) {
    return ar(e), (t = lr(e, t)), e.g.has(t);
  }
  function ur(e, t, n) {
    cr(e, t),
      0 < n.length &&
        ((e.i = null), e.g.set(lr(e, t), $e(n)), (e.h += n.length));
  }
  function lr(e, t) {
    return (t = String(t)), e.j && (t = t.toLowerCase()), t;
  }
  ((ke = or.prototype).add = function (e, t) {
    ar(this), (this.i = null), (e = lr(this, e));
    var n = this.g.get(e);
    return n || this.g.set(e, (n = [])), n.push(t), (this.h += 1), this;
  }),
    (ke.forEach = function (e, t) {
      ar(this),
        this.g.forEach(function (n, r) {
          n.forEach(function (n) {
            e.call(t, n, r, this);
          }, this);
        }, this);
    }),
    (ke.ta = function () {
      ar(this);
      const e = Array.from(this.g.values()),
        t = Array.from(this.g.keys()),
        n = [];
      for (let r = 0; r < t.length; r++) {
        const i = e[r];
        for (let e = 0; e < i.length; e++) n.push(t[r]);
      }
      return n;
    }),
    (ke.Z = function (e) {
      ar(this);
      let t = [];
      if ("string" == typeof e)
        hr(this, e) && (t = t.concat(this.g.get(lr(this, e))));
      else {
        e = Array.from(this.g.values());
        for (let n = 0; n < e.length; n++) t = t.concat(e[n]);
      }
      return t;
    }),
    (ke.set = function (e, t) {
      return (
        ar(this),
        (this.i = null),
        hr(this, (e = lr(this, e))) && (this.h -= this.g.get(e).length),
        this.g.set(e, [t]),
        (this.h += 1),
        this
      );
    }),
    (ke.get = function (e, t) {
      return e && 0 < (e = this.Z(e)).length ? String(e[0]) : t;
    }),
    (ke.toString = function () {
      if (this.i) return this.i;
      if (!this.g) return "";
      const e = [],
        t = Array.from(this.g.keys());
      for (var n = 0; n < t.length; n++) {
        var r = t[n];
        const s = encodeURIComponent(String(r)),
          o = this.Z(r);
        for (r = 0; r < o.length; r++) {
          var i = s;
          "" !== o[r] && (i += "=" + encodeURIComponent(String(o[r]))),
            e.push(i);
        }
      }
      return (this.i = e.join("&"));
    });
  var dr = class {
    constructor(e, t) {
      (this.g = e), (this.map = t);
    }
  };
  function fr(e) {
    (this.l = e || pr),
      (e = De.PerformanceNavigationTiming
        ? 0 < (e = De.performance.getEntriesByType("navigation")).length &&
          ("hq" == e[0].nextHopProtocol || "h2" == e[0].nextHopProtocol)
        : !!(De.g && De.g.Ka && De.g.Ka() && De.g.Ka().dc)),
      (this.j = e ? this.l : 1),
      (this.g = null),
      1 < this.j && (this.g = new Set()),
      (this.h = null),
      (this.i = []);
  }
  var pr = 10;
  function gr(e) {
    return !!e.h || (!!e.g && e.g.size >= e.j);
  }
  function mr(e) {
    return e.h ? 1 : e.g ? e.g.size : 0;
  }
  function yr(e, t) {
    return e.h ? e.h == t : !!e.g && e.g.has(t);
  }
  function vr(e, t) {
    e.g ? e.g.add(t) : (e.h = t);
  }
  function wr(e, t) {
    e.h && e.h == t ? (e.h = null) : e.g && e.g.has(t) && e.g.delete(t);
  }
  function _r(e) {
    if (null != e.h) return e.i.concat(e.h.F);
    if (null != e.g && 0 !== e.g.size) {
      let t = e.i;
      for (const n of e.g.values()) t = t.concat(n.F);
      return t;
    }
    return $e(e.i);
  }
  fr.prototype.cancel = function () {
    if (((this.i = _r(this)), this.h)) this.h.cancel(), (this.h = null);
    else if (this.g && 0 !== this.g.size) {
      for (const e of this.g.values()) e.cancel();
      this.g.clear();
    }
  };
  var Er = class {
    stringify(e) {
      return De.JSON.stringify(e, void 0);
    }
    parse(e) {
      return De.JSON.parse(e, void 0);
    }
  };
  function Ir() {
    this.g = new Er();
  }
  function Tr(e, t, n) {
    const r = n || "";
    try {
      $n(e, function (e, n) {
        let i = e;
        Pe(e) && (i = Ft(e)), t.push(r + n + "=" + encodeURIComponent(i));
      });
    } catch (e) {
      throw (t.push(r + "type=" + encodeURIComponent("_badmap")), e);
    }
  }
  function br(e, t, n, r, i) {
    try {
      (t.onload = null),
        (t.onerror = null),
        (t.onabort = null),
        (t.ontimeout = null),
        i(r);
    } catch (e) {}
  }
  function Sr(e) {
    (this.l = e.ec || null), (this.j = e.ob || !1);
  }
  function Cr(e, t) {
    xt.call(this),
      (this.F = e),
      (this.u = t),
      (this.m = void 0),
      (this.readyState = kr),
      (this.status = 0),
      (this.responseType =
        this.responseText =
        this.response =
        this.statusText =
          ""),
      (this.onreadystatechange = null),
      (this.v = new Headers()),
      (this.h = null),
      (this.C = "GET"),
      (this.B = ""),
      (this.g = !1),
      (this.A = this.j = this.l = null);
  }
  je(Sr, wn),
    (Sr.prototype.g = function () {
      return new Cr(this.l, this.j);
    }),
    (Sr.prototype.i = (function (e) {
      return function () {
        return e;
      };
    })({})),
    je(Cr, xt);
  var kr = 0;
  function Ar(e) {
    e.j.read().then(e.Xa.bind(e)).catch(e.ka.bind(e));
  }
  function Nr(e) {
    (e.readyState = 4), (e.l = null), (e.j = null), (e.A = null), Rr(e);
  }
  function Rr(e) {
    e.onreadystatechange && e.onreadystatechange.call(e);
  }
  ((ke = Cr.prototype).open = function (e, t) {
    if (this.readyState != kr)
      throw (this.abort(), Error("Error reopening a connection"));
    (this.C = e), (this.B = t), (this.readyState = 1), Rr(this);
  }),
    (ke.send = function (e) {
      if (1 != this.readyState)
        throw (this.abort(), Error("need to call open() first. "));
      this.g = !0;
      const t = {
        headers: this.v,
        method: this.C,
        credentials: this.m,
        cache: void 0,
      };
      e && (t.body = e),
        (this.F || De)
          .fetch(new Request(this.B, t))
          .then(this.$a.bind(this), this.ka.bind(this));
    }),
    (ke.abort = function () {
      (this.response = this.responseText = ""),
        (this.v = new Headers()),
        (this.status = 0),
        this.j && this.j.cancel("Request was aborted.").catch(() => {}),
        1 <= this.readyState &&
          this.g &&
          4 != this.readyState &&
          ((this.g = !1), Nr(this)),
        (this.readyState = kr);
    }),
    (ke.$a = function (e) {
      if (
        this.g &&
        ((this.l = e),
        this.h ||
          ((this.status = this.l.status),
          (this.statusText = this.l.statusText),
          (this.h = e.headers),
          (this.readyState = 2),
          Rr(this)),
        this.g && ((this.readyState = 3), Rr(this), this.g))
      )
        if ("arraybuffer" === this.responseType)
          e.arrayBuffer().then(this.Ya.bind(this), this.ka.bind(this));
        else if (void 0 !== De.ReadableStream && "body" in e) {
          if (((this.j = e.body.getReader()), this.u)) {
            if (this.responseType)
              throw Error(
                'responseType must be empty for "streamBinaryChunks" mode responses.'
              );
            this.response = [];
          } else
            (this.response = this.responseText = ""),
              (this.A = new TextDecoder());
          Ar(this);
        } else e.text().then(this.Za.bind(this), this.ka.bind(this));
    }),
    (ke.Xa = function (e) {
      if (this.g) {
        if (this.u && e.value) this.response.push(e.value);
        else if (!this.u) {
          var t = e.value ? e.value : new Uint8Array(0);
          (t = this.A.decode(t, { stream: !e.done })) &&
            (this.response = this.responseText += t);
        }
        e.done ? Nr(this) : Rr(this), 3 == this.readyState && Ar(this);
      }
    }),
    (ke.Za = function (e) {
      this.g && ((this.response = this.responseText = e), Nr(this));
    }),
    (ke.Ya = function (e) {
      this.g && ((this.response = e), Nr(this));
    }),
    (ke.ka = function () {
      this.g && Nr(this);
    }),
    (ke.setRequestHeader = function (e, t) {
      this.v.append(e, t);
    }),
    (ke.getResponseHeader = function (e) {
      return (this.h && this.h.get(e.toLowerCase())) || "";
    }),
    (ke.getAllResponseHeaders = function () {
      if (!this.h) return "";
      const e = [],
        t = this.h.entries();
      for (var n = t.next(); !n.done; )
        (n = n.value), e.push(n[0] + ": " + n[1]), (n = t.next());
      return e.join("\r\n");
    }),
    Object.defineProperty(Cr.prototype, "withCredentials", {
      get: function () {
        return "include" === this.m;
      },
      set: function (e) {
        this.m = e ? "include" : "same-origin";
      },
    });
  var Dr = De.JSON.parse;
  function Or(e) {
    xt.call(this),
      (this.headers = new Map()),
      (this.u = e || null),
      (this.h = !1),
      (this.C = this.g = null),
      (this.I = ""),
      (this.m = 0),
      (this.j = ""),
      (this.l = this.G = this.v = this.F = !1),
      (this.B = 0),
      (this.A = null),
      (this.K = Pr),
      (this.L = this.M = !1);
  }
  je(Or, xt);
  var Pr = "",
    Lr = /^https?$/i,
    Mr = ["POST", "PUT"];
  function xr(e, t) {
    (e.h = !1),
      e.g && ((e.l = !0), e.g.abort(), (e.l = !1)),
      (e.j = t),
      (e.m = 5),
      Ur(e),
      Fr(e);
  }
  function Ur(e) {
    e.F || ((e.F = !0), Ut(e, "complete"), Ut(e, "error"));
  }
  function Vr(e) {
    if (e.h && void 0 !== Re && (!e.C[1] || 4 != Br(e) || 2 != e.da()))
      if (e.v && 4 == Br(e)) Yt(e.La, 0, e);
      else if ((Ut(e, "readystatechange"), 4 == Br(e))) {
        e.h = !1;
        try {
          const o = e.da();
          e: switch (o) {
            case 200:
            case 201:
            case 202:
            case 204:
            case 206:
            case 304:
            case 1223:
              var t = !0;
              break e;
            default:
              t = !1;
          }
          var n;
          if (!(n = t)) {
            var r;
            if ((r = 0 === o)) {
              var i = String(e.I).match(zn)[1] || null;
              !i &&
                De.self &&
                De.self.location &&
                (i = De.self.location.protocol.slice(0, -1)),
                (r = !Lr.test(i ? i.toLowerCase() : ""));
            }
            n = r;
          }
          if (n) Ut(e, "complete"), Ut(e, "success");
          else {
            e.m = 6;
            try {
              var s = 2 < Br(e) ? e.g.statusText : "";
            } catch (e) {
              s = "";
            }
            (e.j = s + " [" + e.da() + "]"), Ur(e);
          }
        } finally {
          Fr(e);
        }
      }
  }
  function Fr(e, t) {
    if (e.g) {
      jr(e);
      const n = e.g,
        r = e.C[0] ? () => {} : null;
      (e.g = null), (e.C = null), t || Ut(e, "ready");
      try {
        n.onreadystatechange = r;
      } catch (e) {}
    }
  }
  function jr(e) {
    e.g && e.L && (e.g.ontimeout = null),
      e.A && (De.clearTimeout(e.A), (e.A = null));
  }
  function Br(e) {
    return e.g ? e.g.readyState : 0;
  }
  function qr(e) {
    try {
      if (!e.g) return null;
      if ("response" in e.g) return e.g.response;
      switch (e.K) {
        case Pr:
        case "text":
          return e.g.responseText;
        case "arraybuffer":
          if ("mozResponseArrayBuffer" in e.g)
            return e.g.mozResponseArrayBuffer;
      }
      return null;
    } catch (e) {
      return null;
    }
  }
  function $r(e) {
    let t = "";
    return (
      yt(e, function (e, n) {
        (t += n), (t += ":"), (t += e), (t += "\r\n");
      }),
      t
    );
  }
  function zr(e, t, n) {
    e: {
      for (r in n) {
        var r = !1;
        break e;
      }
      r = !0;
    }
    r ||
      ((n = $r(n)),
      "string" == typeof e
        ? null != n && encodeURIComponent(String(n))
        : Xn(e, t, n));
  }
  function Hr(e, t, n) {
    return (n && n.internalChannelParams && n.internalChannelParams[e]) || t;
  }
  function Kr(e) {
    (this.Ga = 0),
      (this.j = []),
      (this.l = new on()),
      (this.pa =
        this.wa =
        this.I =
        this.Y =
        this.g =
        this.Da =
        this.F =
        this.na =
        this.o =
        this.U =
        this.s =
          null),
      (this.fb = this.W = 0),
      (this.cb = Hr("failFast", !1, e)),
      (this.G = this.v = this.u = this.m = this.h = null),
      (this.aa = !0),
      (this.Fa = this.V = -1),
      (this.ba = this.A = this.C = 0),
      (this.ab = Hr("baseRetryDelayMs", 5e3, e)),
      (this.hb = Hr("retryDelaySeedMs", 1e4, e)),
      (this.eb = Hr("forwardChannelMaxRetries", 2, e)),
      (this.xa = Hr("forwardChannelRequestTimeoutMs", 2e4, e)),
      (this.va = (e && e.xmlHttpFactory) || void 0),
      (this.Ha = (e && e.useFetchStreams) || !1),
      (this.L = void 0),
      (this.J = (e && e.supportsCrossDomainXhr) || !1),
      (this.K = ""),
      (this.i = new fr(e && e.concurrentRequestLimit)),
      (this.Ja = new Ir()),
      (this.P = (e && e.fastHandshake) || !1),
      (this.O = (e && e.encodeInitMessageHeaders) || !1),
      this.P && this.O && (this.O = !1),
      (this.bb = (e && e.bc) || !1),
      e && e.Ea && this.l.Ea(),
      e && e.forceLongPolling && (this.aa = !1),
      (this.ca = (!this.P && this.aa && e && e.detectBufferingProxy) || !1),
      (this.qa = void 0),
      e &&
        e.longPollingTimeout &&
        0 < e.longPollingTimeout &&
        (this.qa = e.longPollingTimeout),
      (this.oa = void 0),
      (this.S = 0),
      (this.M = !1),
      (this.ma = this.B = null);
  }
  function Gr(e) {
    if ((Qr(e), 3 == e.H)) {
      var t = e.W++,
        n = Kn(e.I);
      if (
        (Xn(n, "SID", e.K),
        Xn(n, "RID", t),
        Xn(n, "TYPE", "terminate"),
        Yr(e, n),
        ((t = new kn(e, e.l, t)).L = 2),
        (t.v = Jn(Kn(n))),
        (n = !1),
        De.navigator && De.navigator.sendBeacon)
      )
        try {
          n = De.navigator.sendBeacon(t.v.toString(), "");
        } catch (e) {}
      !n && De.Image && ((new Image().src = t.v), (n = !0)),
        n || ((t.g = ui(t.l, null)), t.g.ha(t.v)),
        (t.G = Date.now()),
        Un(t);
    }
    ci(e);
  }
  function Wr(e) {
    e.g && (ni(e), e.g.cancel(), (e.g = null));
  }
  function Qr(e) {
    Wr(e),
      e.u && (De.clearTimeout(e.u), (e.u = null)),
      ii(e),
      e.i.cancel(),
      e.m && ("number" == typeof e.m && De.clearTimeout(e.m), (e.m = null));
  }
  function Xr(e) {
    if (!gr(e.i) && !e.m) {
      e.m = !0;
      var t = e.Na;
      Ht || Wt(), Kt || (Ht(), (Kt = !0)), Gt.add(t, e), (e.C = 0);
    }
  }
  function Jr(e, t) {
    var n;
    n = t ? t.m : e.W++;
    const r = Kn(e.I);
    Xn(r, "SID", e.K),
      Xn(r, "RID", n),
      Xn(r, "AID", e.V),
      Yr(e, r),
      e.o && e.s && zr(r, e.o, e.s),
      (n = new kn(e, e.l, n, e.C + 1)),
      null === e.o && (n.I = e.s),
      t && (e.j = t.F.concat(e.j)),
      (t = Zr(e, n, 1e3)),
      n.setTimeout(
        Math.round(0.5 * e.xa) + Math.round(0.5 * e.xa * Math.random())
      ),
      vr(e.i, n),
      On(n, r, t);
  }
  function Yr(e, t) {
    e.na &&
      yt(e.na, function (e, n) {
        Xn(t, n, e);
      }),
      e.h &&
        $n({}, function (e, n) {
          Xn(t, n, e);
        });
  }
  function Zr(e, t, n) {
    n = Math.min(e.j.length, n);
    var r = e.h ? Ve(e.h.Va, e.h, e) : null;
    e: {
      var i = e.j;
      let t = -1;
      for (;;) {
        const e = ["count=" + n];
        -1 == t
          ? 0 < n
            ? ((t = i[0].g), e.push("ofs=" + t))
            : (t = 0)
          : e.push("ofs=" + t);
        let s = !0;
        for (let o = 0; o < n; o++) {
          let n = i[o].g;
          const a = i[o].map;
          if (((n -= t), 0 > n)) (t = Math.max(0, i[o].g - 100)), (s = !1);
          else
            try {
              Tr(a, e, "req" + n + "_");
            } catch (e) {
              r && r(a);
            }
        }
        if (s) {
          r = e.join("&");
          break e;
        }
      }
    }
    return (e = e.j.splice(0, n)), (t.F = e), r;
  }
  function ei(e) {
    if (!e.g && !e.u) {
      e.ba = 1;
      var t = e.Ma;
      Ht || Wt(), Kt || (Ht(), (Kt = !0)), Gt.add(t, e), (e.A = 0);
    }
  }
  function ti(e) {
    return !(
      e.g ||
      e.u ||
      3 <= e.A ||
      (e.ba++, (e.u = mn(Ve(e.Ma, e), oi(e, e.A))), e.A++, 0)
    );
  }
  function ni(e) {
    null != e.B && (De.clearTimeout(e.B), (e.B = null));
  }
  function ri(e) {
    (e.g = new kn(e, e.l, "rpc", e.ba)),
      null === e.o && (e.g.I = e.s),
      (e.g.O = 0);
    var t = Kn(e.wa);
    Xn(t, "RID", "rpc"),
      Xn(t, "SID", e.K),
      Xn(t, "AID", e.V),
      Xn(t, "CI", e.G ? "0" : "1"),
      !e.G && e.qa && Xn(t, "TO", e.qa),
      Xn(t, "TYPE", "xmlhttp"),
      Yr(e, t),
      e.o && e.s && zr(t, e.o, e.s),
      e.L && e.g.setTimeout(e.L);
    var n = e.g;
    (e = e.pa),
      (n.L = 1),
      (n.v = Jn(Kn(t))),
      (n.s = null),
      (n.S = !0),
      Pn(n, e);
  }
  function ii(e) {
    null != e.v && (De.clearTimeout(e.v), (e.v = null));
  }
  function si(e, t) {
    var n = null;
    if (e.g == t) {
      ii(e), ni(e), (e.g = null);
      var r = 2;
    } else {
      if (!yr(e.i, t)) return;
      (n = t.F), wr(e.i, t), (r = 1);
    }
    if (0 != e.H)
      if (t.i)
        if (1 == r) {
          (n = t.s ? t.s.length : 0), (t = Date.now() - t.G);
          var i = e.C;
          Ut((r = un()), new gn(r, n)), Xr(e);
        } else ei(e);
      else if (
        3 == (i = t.o) ||
        (0 == i && 0 < t.ca) ||
        !(
          (1 == r &&
            (function (e, t) {
              return !(
                mr(e.i) >= e.i.j - (e.m ? 1 : 0) ||
                (e.m
                  ? ((e.j = t.F.concat(e.j)), 0)
                  : 1 == e.H ||
                    2 == e.H ||
                    e.C >= (e.cb ? 0 : e.eb) ||
                    ((e.m = mn(Ve(e.Na, e, t), oi(e, e.C))), e.C++, 0))
              );
            })(e, t)) ||
          (2 == r && ti(e))
        )
      )
        switch ((n && 0 < n.length && ((t = e.i), (t.i = t.i.concat(n))), i)) {
          case 1:
            ai(e, 5);
            break;
          case 4:
            ai(e, 10);
            break;
          case 3:
            ai(e, 6);
            break;
          default:
            ai(e, 2);
        }
  }
  function oi(e, t) {
    let n = e.ab + Math.floor(Math.random() * e.hb);
    return e.isActive() || (n *= 2), n * t;
  }
  function ai(e, t) {
    if ((e.l.info("Error code " + t), 2 == t)) {
      var n = null;
      e.h && (n = null);
      var r = Ve(e.pb, e);
      n ||
        ((n = new Hn("//www.google.com/images/cleardot.gif")),
        (De.location && "http" == De.location.protocol) || Gn(n, "https"),
        Jn(n)),
        (function (e, t) {
          const n = new on();
          if (De.Image) {
            const r = new Image();
            (r.onload = Fe(br, n, r, "TestLoadImage: loaded", !0, t)),
              (r.onerror = Fe(br, n, r, "TestLoadImage: error", !1, t)),
              (r.onabort = Fe(br, n, r, "TestLoadImage: abort", !1, t)),
              (r.ontimeout = Fe(br, n, r, "TestLoadImage: timeout", !1, t)),
              De.setTimeout(function () {
                r.ontimeout && r.ontimeout();
              }, 1e4),
              (r.src = e);
          } else t(!1);
        })(n.toString(), r);
    } else pn(2);
    (e.H = 0), e.h && e.h.za(t), ci(e), Qr(e);
  }
  function ci(e) {
    if (((e.H = 0), (e.ma = []), e.h)) {
      const t = _r(e.i);
      (0 == t.length && 0 == e.j.length) ||
        (ze(e.ma, t),
        ze(e.ma, e.j),
        (e.i.i.length = 0),
        $e(e.j),
        (e.j.length = 0)),
        e.h.ya();
    }
  }
  function hi(e, t, n) {
    var r = n instanceof Hn ? Kn(n) : new Hn(n);
    if ("" != r.g) t && (r.g = t + "." + r.g), Wn(r, r.m);
    else {
      var i = De.location;
      (r = i.protocol),
        (t = t ? t + "." + i.hostname : i.hostname),
        (i = +i.port);
      var s = new Hn(null);
      r && Gn(s, r), t && (s.g = t), i && Wn(s, i), n && (s.l = n), (r = s);
    }
    return (
      (n = e.F),
      (t = e.Da),
      n && t && Xn(r, n, t),
      Xn(r, "VER", e.ra),
      Yr(e, r),
      r
    );
  }
  function ui(e, t, n) {
    if (t && !e.J)
      throw Error("Can't create secondary domain capable XhrIo object.");
    return (
      (t = n && e.Ha && !e.va ? new Or(new Sr({ ob: !0 })) : new Or(e.va)).Oa(
        e.J
      ),
      t
    );
  }
  function li() {}
  function di() {
    if (tt && !(10 <= Number(ut)))
      throw Error("Environmental error: no available transport.");
  }
  function fi(e, t) {
    xt.call(this),
      (this.g = new Kr(t)),
      (this.l = e),
      (this.h = (t && t.messageUrlParams) || null),
      (e = (t && t.messageHeaders) || null),
      t &&
        t.clientProtocolHeaderRequired &&
        (e
          ? (e["X-Client-Protocol"] = "webchannel")
          : (e = { "X-Client-Protocol": "webchannel" })),
      (this.g.s = e),
      (e = (t && t.initMessageHeaders) || null),
      t &&
        t.messageContentType &&
        (e
          ? (e["X-WebChannel-Content-Type"] = t.messageContentType)
          : (e = { "X-WebChannel-Content-Type": t.messageContentType })),
      t &&
        t.Ca &&
        (e
          ? (e["X-WebChannel-Client-Profile"] = t.Ca)
          : (e = { "X-WebChannel-Client-Profile": t.Ca })),
      (this.g.U = e),
      (e = t && t.cc) && !Ge(e) && (this.g.o = e),
      (this.A = (t && t.supportsCrossDomainXhr) || !1),
      (this.v = (t && t.sendRawJson) || !1),
      (t = t && t.httpSessionIdParam) &&
        !Ge(t) &&
        ((this.g.F = t),
        null !== (e = this.h) && t in e && t in (e = this.h) && delete e[t]),
      (this.j = new mi(this));
  }
  function pi(e) {
    bn.call(this),
      e.__headers__ &&
        ((this.headers = e.__headers__),
        (this.statusCode = e.__status__),
        delete e.__headers__,
        delete e.__status__);
    var t = e.__sm__;
    if (t) {
      e: {
        for (const n in t) {
          e = n;
          break e;
        }
        e = void 0;
      }
      (this.i = e) &&
        ((e = this.i), (t = null !== t && e in t ? t[e] : void 0)),
        (this.data = t);
    } else this.data = e;
  }
  function gi() {
    Sn.call(this), (this.status = 1);
  }
  function mi(e) {
    this.g = e;
  }
  function yi() {
    (this.blockSize = -1),
      (this.blockSize = 64),
      (this.g = Array(4)),
      (this.m = Array(this.blockSize)),
      (this.i = this.h = 0),
      this.reset();
  }
  function vi(e, t, n) {
    n || (n = 0);
    var r = Array(16);
    if ("string" == typeof t)
      for (var i = 0; 16 > i; ++i)
        r[i] =
          t.charCodeAt(n++) |
          (t.charCodeAt(n++) << 8) |
          (t.charCodeAt(n++) << 16) |
          (t.charCodeAt(n++) << 24);
    else
      for (i = 0; 16 > i; ++i)
        r[i] = t[n++] | (t[n++] << 8) | (t[n++] << 16) | (t[n++] << 24);
    (t = e.g[0]), (n = e.g[1]), (i = e.g[2]);
    var s = e.g[3],
      o = (t + (s ^ (n & (i ^ s))) + r[0] + 3614090360) & 4294967295;
    (o =
      ((n =
        (i =
          (s =
            (t =
              (n =
                (i =
                  (s =
                    (t =
                      (n =
                        (i =
                          (s =
                            (t =
                              (n =
                                (i =
                                  (s =
                                    (t =
                                      (n =
                                        (i =
                                          (s =
                                            (t =
                                              (n =
                                                (i =
                                                  (s =
                                                    (t =
                                                      (n =
                                                        (i =
                                                          (s =
                                                            (t =
                                                              (n =
                                                                (i =
                                                                  (s =
                                                                    (t =
                                                                      (n =
                                                                        (i =
                                                                          (s =
                                                                            (t =
                                                                              (n =
                                                                                (i =
                                                                                  (s =
                                                                                    (t =
                                                                                      (n =
                                                                                        (i =
                                                                                          (s =
                                                                                            (t =
                                                                                              (n =
                                                                                                (i =
                                                                                                  (s =
                                                                                                    (t =
                                                                                                      (n =
                                                                                                        (i =
                                                                                                          (s =
                                                                                                            (t =
                                                                                                              (n =
                                                                                                                (i =
                                                                                                                  (s =
                                                                                                                    (t =
                                                                                                                      (n =
                                                                                                                        (i =
                                                                                                                          (s =
                                                                                                                            (t =
                                                                                                                              n +
                                                                                                                              (((o <<
                                                                                                                                7) &
                                                                                                                                4294967295) |
                                                                                                                                (o >>>
                                                                                                                                  25))) +
                                                                                                                            ((((o =
                                                                                                                              (s +
                                                                                                                                (i ^
                                                                                                                                  (t &
                                                                                                                                    (n ^
                                                                                                                                      i))) +
                                                                                                                                r[1] +
                                                                                                                                3905402710) &
                                                                                                                              4294967295) <<
                                                                                                                              12) &
                                                                                                                              4294967295) |
                                                                                                                              (o >>>
                                                                                                                                20))) +
                                                                                                                          ((((o =
                                                                                                                            (i +
                                                                                                                              (n ^
                                                                                                                                (s &
                                                                                                                                  (t ^
                                                                                                                                    n))) +
                                                                                                                              r[2] +
                                                                                                                              606105819) &
                                                                                                                            4294967295) <<
                                                                                                                            17) &
                                                                                                                            4294967295) |
                                                                                                                            (o >>>
                                                                                                                              15))) +
                                                                                                                        ((((o =
                                                                                                                          (n +
                                                                                                                            (t ^
                                                                                                                              (i &
                                                                                                                                (s ^
                                                                                                                                  t))) +
                                                                                                                            r[3] +
                                                                                                                            3250441966) &
                                                                                                                          4294967295) <<
                                                                                                                          22) &
                                                                                                                          4294967295) |
                                                                                                                          (o >>>
                                                                                                                            10))) +
                                                                                                                      ((((o =
                                                                                                                        (t +
                                                                                                                          (s ^
                                                                                                                            (n &
                                                                                                                              (i ^
                                                                                                                                s))) +
                                                                                                                          r[4] +
                                                                                                                          4118548399) &
                                                                                                                        4294967295) <<
                                                                                                                        7) &
                                                                                                                        4294967295) |
                                                                                                                        (o >>>
                                                                                                                          25))) +
                                                                                                                    ((((o =
                                                                                                                      (s +
                                                                                                                        (i ^
                                                                                                                          (t &
                                                                                                                            (n ^
                                                                                                                              i))) +
                                                                                                                        r[5] +
                                                                                                                        1200080426) &
                                                                                                                      4294967295) <<
                                                                                                                      12) &
                                                                                                                      4294967295) |
                                                                                                                      (o >>>
                                                                                                                        20))) +
                                                                                                                  ((((o =
                                                                                                                    (i +
                                                                                                                      (n ^
                                                                                                                        (s &
                                                                                                                          (t ^
                                                                                                                            n))) +
                                                                                                                      r[6] +
                                                                                                                      2821735955) &
                                                                                                                    4294967295) <<
                                                                                                                    17) &
                                                                                                                    4294967295) |
                                                                                                                    (o >>>
                                                                                                                      15))) +
                                                                                                                ((((o =
                                                                                                                  (n +
                                                                                                                    (t ^
                                                                                                                      (i &
                                                                                                                        (s ^
                                                                                                                          t))) +
                                                                                                                    r[7] +
                                                                                                                    4249261313) &
                                                                                                                  4294967295) <<
                                                                                                                  22) &
                                                                                                                  4294967295) |
                                                                                                                  (o >>>
                                                                                                                    10))) +
                                                                                                              ((((o =
                                                                                                                (t +
                                                                                                                  (s ^
                                                                                                                    (n &
                                                                                                                      (i ^
                                                                                                                        s))) +
                                                                                                                  r[8] +
                                                                                                                  1770035416) &
                                                                                                                4294967295) <<
                                                                                                                7) &
                                                                                                                4294967295) |
                                                                                                                (o >>>
                                                                                                                  25))) +
                                                                                                            ((((o =
                                                                                                              (s +
                                                                                                                (i ^
                                                                                                                  (t &
                                                                                                                    (n ^
                                                                                                                      i))) +
                                                                                                                r[9] +
                                                                                                                2336552879) &
                                                                                                              4294967295) <<
                                                                                                              12) &
                                                                                                              4294967295) |
                                                                                                              (o >>>
                                                                                                                20))) +
                                                                                                          ((((o =
                                                                                                            (i +
                                                                                                              (n ^
                                                                                                                (s &
                                                                                                                  (t ^
                                                                                                                    n))) +
                                                                                                              r[10] +
                                                                                                              4294925233) &
                                                                                                            4294967295) <<
                                                                                                            17) &
                                                                                                            4294967295) |
                                                                                                            (o >>>
                                                                                                              15))) +
                                                                                                        ((((o =
                                                                                                          (n +
                                                                                                            (t ^
                                                                                                              (i &
                                                                                                                (s ^
                                                                                                                  t))) +
                                                                                                            r[11] +
                                                                                                            2304563134) &
                                                                                                          4294967295) <<
                                                                                                          22) &
                                                                                                          4294967295) |
                                                                                                          (o >>>
                                                                                                            10))) +
                                                                                                      ((((o =
                                                                                                        (t +
                                                                                                          (s ^
                                                                                                            (n &
                                                                                                              (i ^
                                                                                                                s))) +
                                                                                                          r[12] +
                                                                                                          1804603682) &
                                                                                                        4294967295) <<
                                                                                                        7) &
                                                                                                        4294967295) |
                                                                                                        (o >>>
                                                                                                          25))) +
                                                                                                    ((((o =
                                                                                                      (s +
                                                                                                        (i ^
                                                                                                          (t &
                                                                                                            (n ^
                                                                                                              i))) +
                                                                                                        r[13] +
                                                                                                        4254626195) &
                                                                                                      4294967295) <<
                                                                                                      12) &
                                                                                                      4294967295) |
                                                                                                      (o >>>
                                                                                                        20))) +
                                                                                                  ((((o =
                                                                                                    (i +
                                                                                                      (n ^
                                                                                                        (s &
                                                                                                          (t ^
                                                                                                            n))) +
                                                                                                      r[14] +
                                                                                                      2792965006) &
                                                                                                    4294967295) <<
                                                                                                    17) &
                                                                                                    4294967295) |
                                                                                                    (o >>>
                                                                                                      15))) +
                                                                                                ((((o =
                                                                                                  (n +
                                                                                                    (t ^
                                                                                                      (i &
                                                                                                        (s ^
                                                                                                          t))) +
                                                                                                    r[15] +
                                                                                                    1236535329) &
                                                                                                  4294967295) <<
                                                                                                  22) &
                                                                                                  4294967295) |
                                                                                                  (o >>>
                                                                                                    10))) +
                                                                                              ((((o =
                                                                                                (t +
                                                                                                  (i ^
                                                                                                    (s &
                                                                                                      (n ^
                                                                                                        i))) +
                                                                                                  r[1] +
                                                                                                  4129170786) &
                                                                                                4294967295) <<
                                                                                                5) &
                                                                                                4294967295) |
                                                                                                (o >>>
                                                                                                  27))) +
                                                                                            ((((o =
                                                                                              (s +
                                                                                                (n ^
                                                                                                  (i &
                                                                                                    (t ^
                                                                                                      n))) +
                                                                                                r[6] +
                                                                                                3225465664) &
                                                                                              4294967295) <<
                                                                                              9) &
                                                                                              4294967295) |
                                                                                              (o >>>
                                                                                                23))) +
                                                                                          ((((o =
                                                                                            (i +
                                                                                              (t ^
                                                                                                (n &
                                                                                                  (s ^
                                                                                                    t))) +
                                                                                              r[11] +
                                                                                              643717713) &
                                                                                            4294967295) <<
                                                                                            14) &
                                                                                            4294967295) |
                                                                                            (o >>>
                                                                                              18))) +
                                                                                        ((((o =
                                                                                          (n +
                                                                                            (s ^
                                                                                              (t &
                                                                                                (i ^
                                                                                                  s))) +
                                                                                            r[0] +
                                                                                            3921069994) &
                                                                                          4294967295) <<
                                                                                          20) &
                                                                                          4294967295) |
                                                                                          (o >>>
                                                                                            12))) +
                                                                                      ((((o =
                                                                                        (t +
                                                                                          (i ^
                                                                                            (s &
                                                                                              (n ^
                                                                                                i))) +
                                                                                          r[5] +
                                                                                          3593408605) &
                                                                                        4294967295) <<
                                                                                        5) &
                                                                                        4294967295) |
                                                                                        (o >>>
                                                                                          27))) +
                                                                                    ((((o =
                                                                                      (s +
                                                                                        (n ^
                                                                                          (i &
                                                                                            (t ^
                                                                                              n))) +
                                                                                        r[10] +
                                                                                        38016083) &
                                                                                      4294967295) <<
                                                                                      9) &
                                                                                      4294967295) |
                                                                                      (o >>>
                                                                                        23))) +
                                                                                  ((((o =
                                                                                    (i +
                                                                                      (t ^
                                                                                        (n &
                                                                                          (s ^
                                                                                            t))) +
                                                                                      r[15] +
                                                                                      3634488961) &
                                                                                    4294967295) <<
                                                                                    14) &
                                                                                    4294967295) |
                                                                                    (o >>>
                                                                                      18))) +
                                                                                ((((o =
                                                                                  (n +
                                                                                    (s ^
                                                                                      (t &
                                                                                        (i ^
                                                                                          s))) +
                                                                                    r[4] +
                                                                                    3889429448) &
                                                                                  4294967295) <<
                                                                                  20) &
                                                                                  4294967295) |
                                                                                  (o >>>
                                                                                    12))) +
                                                                              ((((o =
                                                                                (t +
                                                                                  (i ^
                                                                                    (s &
                                                                                      (n ^
                                                                                        i))) +
                                                                                  r[9] +
                                                                                  568446438) &
                                                                                4294967295) <<
                                                                                5) &
                                                                                4294967295) |
                                                                                (o >>>
                                                                                  27))) +
                                                                            ((((o =
                                                                              (s +
                                                                                (n ^
                                                                                  (i &
                                                                                    (t ^
                                                                                      n))) +
                                                                                r[14] +
                                                                                3275163606) &
                                                                              4294967295) <<
                                                                              9) &
                                                                              4294967295) |
                                                                              (o >>>
                                                                                23))) +
                                                                          ((((o =
                                                                            (i +
                                                                              (t ^
                                                                                (n &
                                                                                  (s ^
                                                                                    t))) +
                                                                              r[3] +
                                                                              4107603335) &
                                                                            4294967295) <<
                                                                            14) &
                                                                            4294967295) |
                                                                            (o >>>
                                                                              18))) +
                                                                        ((((o =
                                                                          (n +
                                                                            (s ^
                                                                              (t &
                                                                                (i ^
                                                                                  s))) +
                                                                            r[8] +
                                                                            1163531501) &
                                                                          4294967295) <<
                                                                          20) &
                                                                          4294967295) |
                                                                          (o >>>
                                                                            12))) +
                                                                      ((((o =
                                                                        (t +
                                                                          (i ^
                                                                            (s &
                                                                              (n ^
                                                                                i))) +
                                                                          r[13] +
                                                                          2850285829) &
                                                                        4294967295) <<
                                                                        5) &
                                                                        4294967295) |
                                                                        (o >>>
                                                                          27))) +
                                                                    ((((o =
                                                                      (s +
                                                                        (n ^
                                                                          (i &
                                                                            (t ^
                                                                              n))) +
                                                                        r[2] +
                                                                        4243563512) &
                                                                      4294967295) <<
                                                                      9) &
                                                                      4294967295) |
                                                                      (o >>>
                                                                        23))) +
                                                                  ((((o =
                                                                    (i +
                                                                      (t ^
                                                                        (n &
                                                                          (s ^
                                                                            t))) +
                                                                      r[7] +
                                                                      1735328473) &
                                                                    4294967295) <<
                                                                    14) &
                                                                    4294967295) |
                                                                    (o >>>
                                                                      18))) +
                                                                ((((o =
                                                                  (n +
                                                                    (s ^
                                                                      (t &
                                                                        (i ^
                                                                          s))) +
                                                                    r[12] +
                                                                    2368359562) &
                                                                  4294967295) <<
                                                                  20) &
                                                                  4294967295) |
                                                                  (o >>> 12))) +
                                                              ((((o =
                                                                (t +
                                                                  (n ^ i ^ s) +
                                                                  r[5] +
                                                                  4294588738) &
                                                                4294967295) <<
                                                                4) &
                                                                4294967295) |
                                                                (o >>> 28))) +
                                                            ((((o =
                                                              (s +
                                                                (t ^ n ^ i) +
                                                                r[8] +
                                                                2272392833) &
                                                              4294967295) <<
                                                              11) &
                                                              4294967295) |
                                                              (o >>> 21))) +
                                                          ((((o =
                                                            (i +
                                                              (s ^ t ^ n) +
                                                              r[11] +
                                                              1839030562) &
                                                            4294967295) <<
                                                            16) &
                                                            4294967295) |
                                                            (o >>> 16))) +
                                                        ((((o =
                                                          (n +
                                                            (i ^ s ^ t) +
                                                            r[14] +
                                                            4259657740) &
                                                          4294967295) <<
                                                          23) &
                                                          4294967295) |
                                                          (o >>> 9))) +
                                                      ((((o =
                                                        (t +
                                                          (n ^ i ^ s) +
                                                          r[1] +
                                                          2763975236) &
                                                        4294967295) <<
                                                        4) &
                                                        4294967295) |
                                                        (o >>> 28))) +
                                                    ((((o =
                                                      (s +
                                                        (t ^ n ^ i) +
                                                        r[4] +
                                                        1272893353) &
                                                      4294967295) <<
                                                      11) &
                                                      4294967295) |
                                                      (o >>> 21))) +
                                                  ((((o =
                                                    (i +
                                                      (s ^ t ^ n) +
                                                      r[7] +
                                                      4139469664) &
                                                    4294967295) <<
                                                    16) &
                                                    4294967295) |
                                                    (o >>> 16))) +
                                                ((((o =
                                                  (n +
                                                    (i ^ s ^ t) +
                                                    r[10] +
                                                    3200236656) &
                                                  4294967295) <<
                                                  23) &
                                                  4294967295) |
                                                  (o >>> 9))) +
                                              ((((o =
                                                (t +
                                                  (n ^ i ^ s) +
                                                  r[13] +
                                                  681279174) &
                                                4294967295) <<
                                                4) &
                                                4294967295) |
                                                (o >>> 28))) +
                                            ((((o =
                                              (s +
                                                (t ^ n ^ i) +
                                                r[0] +
                                                3936430074) &
                                              4294967295) <<
                                              11) &
                                              4294967295) |
                                              (o >>> 21))) +
                                          ((((o =
                                            (i +
                                              (s ^ t ^ n) +
                                              r[3] +
                                              3572445317) &
                                            4294967295) <<
                                            16) &
                                            4294967295) |
                                            (o >>> 16))) +
                                        ((((o =
                                          (n + (i ^ s ^ t) + r[6] + 76029189) &
                                          4294967295) <<
                                          23) &
                                          4294967295) |
                                          (o >>> 9))) +
                                      ((((o =
                                        (t + (n ^ i ^ s) + r[9] + 3654602809) &
                                        4294967295) <<
                                        4) &
                                        4294967295) |
                                        (o >>> 28))) +
                                    ((((o =
                                      (s + (t ^ n ^ i) + r[12] + 3873151461) &
                                      4294967295) <<
                                      11) &
                                      4294967295) |
                                      (o >>> 21))) +
                                  ((((o =
                                    (i + (s ^ t ^ n) + r[15] + 530742520) &
                                    4294967295) <<
                                    16) &
                                    4294967295) |
                                    (o >>> 16))) +
                                ((((o =
                                  (n + (i ^ s ^ t) + r[2] + 3299628645) &
                                  4294967295) <<
                                  23) &
                                  4294967295) |
                                  (o >>> 9))) +
                              ((((o =
                                (t + (i ^ (n | ~s)) + r[0] + 4096336452) &
                                4294967295) <<
                                6) &
                                4294967295) |
                                (o >>> 26))) +
                            ((((o =
                              (s + (n ^ (t | ~i)) + r[7] + 1126891415) &
                              4294967295) <<
                              10) &
                              4294967295) |
                              (o >>> 22))) +
                          ((((o =
                            (i + (t ^ (s | ~n)) + r[14] + 2878612391) &
                            4294967295) <<
                            15) &
                            4294967295) |
                            (o >>> 17))) +
                        ((((o =
                          (n + (s ^ (i | ~t)) + r[5] + 4237533241) &
                          4294967295) <<
                          21) &
                          4294967295) |
                          (o >>> 11))) +
                      ((((o =
                        (t + (i ^ (n | ~s)) + r[12] + 1700485571) &
                        4294967295) <<
                        6) &
                        4294967295) |
                        (o >>> 26))) +
                    ((((o =
                      (s + (n ^ (t | ~i)) + r[3] + 2399980690) & 4294967295) <<
                      10) &
                      4294967295) |
                      (o >>> 22))) +
                  ((((o =
                    (i + (t ^ (s | ~n)) + r[10] + 4293915773) & 4294967295) <<
                    15) &
                    4294967295) |
                    (o >>> 17))) +
                ((((o =
                  (n + (s ^ (i | ~t)) + r[1] + 2240044497) & 4294967295) <<
                  21) &
                  4294967295) |
                  (o >>> 11))) +
              ((((o = (t + (i ^ (n | ~s)) + r[8] + 1873313359) & 4294967295) <<
                6) &
                4294967295) |
                (o >>> 26))) +
            ((((o = (s + (n ^ (t | ~i)) + r[15] + 4264355552) & 4294967295) <<
              10) &
              4294967295) |
              (o >>> 22))) +
          ((((o = (i + (t ^ (s | ~n)) + r[6] + 2734768916) & 4294967295) <<
            15) &
            4294967295) |
            (o >>> 17))) +
        ((((o = (n + (s ^ (i | ~t)) + r[13] + 1309151649) & 4294967295) << 21) &
          4294967295) |
          (o >>> 11))) +
        ((s =
          (t =
            n +
            ((((o = (t + (i ^ (n | ~s)) + r[4] + 4149444226) & 4294967295) <<
              6) &
              4294967295) |
              (o >>> 26))) +
          ((((o = (s + (n ^ (t | ~i)) + r[11] + 3174756917) & 4294967295) <<
            10) &
            4294967295) |
            (o >>> 22))) ^
          ((i =
            s +
            ((((o = (i + (t ^ (s | ~n)) + r[2] + 718787259) & 4294967295) <<
              15) &
              4294967295) |
              (o >>> 17))) |
            ~t)) +
        r[9] +
        3951481745) &
      4294967295),
      (e.g[0] = (e.g[0] + t) & 4294967295),
      (e.g[1] =
        (e.g[1] + (i + (((o << 21) & 4294967295) | (o >>> 11)))) & 4294967295),
      (e.g[2] = (e.g[2] + i) & 4294967295),
      (e.g[3] = (e.g[3] + s) & 4294967295);
  }
  function wi(e, t) {
    this.h = t;
    for (var n = [], r = !0, i = e.length - 1; 0 <= i; i--) {
      var s = 0 | e[i];
      (r && s == t) || ((n[i] = s), (r = !1));
    }
    this.g = n;
  }
  ((ke = Or.prototype).Oa = function (e) {
    this.M = e;
  }),
    (ke.ha = function (e, t, n, r) {
      if (this.g)
        throw Error(
          "[goog.net.XhrIo] Object is active with another request=" +
            this.I +
            "; newUri=" +
            e
        );
      (t = t ? t.toUpperCase() : "GET"),
        (this.I = e),
        (this.j = ""),
        (this.m = 0),
        (this.F = !1),
        (this.h = !0),
        (this.g = this.u ? this.u.g() : In.g()),
        (this.C = this.u ? _n(this.u) : _n(In)),
        (this.g.onreadystatechange = Ve(this.La, this));
      try {
        (this.G = !0), this.g.open(t, String(e), !0), (this.G = !1);
      } catch (e) {
        return void xr(this, e);
      }
      if (((e = n || ""), (n = new Map(this.headers)), r))
        if (Object.getPrototypeOf(r) === Object.prototype)
          for (var i in r) n.set(i, r[i]);
        else {
          if ("function" != typeof r.keys || "function" != typeof r.get)
            throw Error("Unknown input type for opt_headers: " + String(r));
          for (const e of r.keys()) n.set(e, r.get(e));
        }
      (r = Array.from(n.keys()).find((e) => "content-type" == e.toLowerCase())),
        (i = De.FormData && e instanceof De.FormData),
        !(0 <= qe(Mr, t)) ||
          r ||
          i ||
          n.set(
            "Content-Type",
            "application/x-www-form-urlencoded;charset=utf-8"
          );
      for (const [e, t] of n) this.g.setRequestHeader(e, t);
      this.K && (this.g.responseType = this.K),
        "withCredentials" in this.g &&
          this.g.withCredentials !== this.M &&
          (this.g.withCredentials = this.M);
      try {
        jr(this),
          0 < this.B &&
            ((this.L = (function (e) {
              return (
                tt && "number" == typeof e.timeout && void 0 !== e.ontimeout
              );
            })(this.g))
              ? ((this.g.timeout = this.B),
                (this.g.ontimeout = Ve(this.ua, this)))
              : (this.A = Yt(this.ua, this.B, this))),
          (this.v = !0),
          this.g.send(e),
          (this.v = !1);
      } catch (e) {
        xr(this, e);
      }
    }),
    (ke.ua = function () {
      void 0 !== Re &&
        this.g &&
        ((this.j = "Timed out after " + this.B + "ms, aborting"),
        (this.m = 8),
        Ut(this, "timeout"),
        this.abort(8));
    }),
    (ke.abort = function (e) {
      this.g &&
        this.h &&
        ((this.h = !1),
        (this.l = !0),
        this.g.abort(),
        (this.l = !1),
        (this.m = e || 7),
        Ut(this, "complete"),
        Ut(this, "abort"),
        Fr(this));
    }),
    (ke.N = function () {
      this.g &&
        (this.h &&
          ((this.h = !1), (this.l = !0), this.g.abort(), (this.l = !1)),
        Fr(this, !0)),
        Or.$.N.call(this);
    }),
    (ke.La = function () {
      this.s || (this.G || this.v || this.l ? Vr(this) : this.kb());
    }),
    (ke.kb = function () {
      Vr(this);
    }),
    (ke.isActive = function () {
      return !!this.g;
    }),
    (ke.da = function () {
      try {
        return 2 < Br(this) ? this.g.status : -1;
      } catch (e) {
        return -1;
      }
    }),
    (ke.ja = function () {
      try {
        return this.g ? this.g.responseText : "";
      } catch (e) {
        return "";
      }
    }),
    (ke.Wa = function (e) {
      if (this.g) {
        var t = this.g.responseText;
        return e && 0 == t.indexOf(e) && (t = t.substring(e.length)), Dr(t);
      }
    }),
    (ke.Ia = function () {
      return this.m;
    }),
    (ke.Sa = function () {
      return "string" == typeof this.j ? this.j : String(this.j);
    }),
    ((ke = Kr.prototype).ra = 8),
    (ke.H = 1),
    (ke.Na = function (e) {
      if (this.m)
        if (((this.m = null), 1 == this.H)) {
          if (!e) {
            (this.W = Math.floor(1e5 * Math.random())), (e = this.W++);
            const i = new kn(this, this.l, e);
            let s = this.s;
            if (
              (this.U && (s ? ((s = vt(s)), _t(s, this.U)) : (s = this.U)),
              null !== this.o || this.O || ((i.I = s), (s = null)),
              this.P)
            )
              e: {
                for (var t = 0, n = 0; n < this.j.length; n++) {
                  var r = this.j[n];
                  if (
                    void 0 ===
                    (r =
                      "__data__" in r.map &&
                      "string" == typeof (r = r.map.__data__)
                        ? r.length
                        : void 0)
                  )
                    break;
                  if (4096 < (t += r)) {
                    t = n;
                    break e;
                  }
                  if (4096 === t || n === this.j.length - 1) {
                    t = n + 1;
                    break e;
                  }
                }
                t = 1e3;
              }
            else t = 1e3;
            (t = Zr(this, i, t)),
              Xn((n = Kn(this.I)), "RID", e),
              Xn(n, "CVER", 22),
              this.F && Xn(n, "X-HTTP-Session-Id", this.F),
              Yr(this, n),
              s &&
                (this.O
                  ? (t =
                      "headers=" + encodeURIComponent(String($r(s))) + "&" + t)
                  : this.o && zr(n, this.o, s)),
              vr(this.i, i),
              this.bb && Xn(n, "TYPE", "init"),
              this.P
                ? (Xn(n, "$req", t),
                  Xn(n, "SID", "null"),
                  (i.aa = !0),
                  On(i, n, null))
                : On(i, n, t),
              (this.H = 2);
          }
        } else
          3 == this.H &&
            (e ? Jr(this, e) : 0 == this.j.length || gr(this.i) || Jr(this));
    }),
    (ke.Ma = function () {
      if (
        ((this.u = null),
        ri(this),
        this.ca && !(this.M || null == this.g || 0 >= this.S))
      ) {
        var e = 2 * this.S;
        this.l.info("BP detection timer enabled: " + e),
          (this.B = mn(Ve(this.jb, this), e));
      }
    }),
    (ke.jb = function () {
      this.B &&
        ((this.B = null),
        this.l.info("BP detection timeout reached."),
        this.l.info("Buffering proxy detected and switch to long-polling!"),
        (this.G = !1),
        (this.M = !0),
        pn(10),
        Wr(this),
        ri(this));
    }),
    (ke.ib = function () {
      null != this.v && ((this.v = null), Wr(this), ti(this), pn(19));
    }),
    (ke.pb = function (e) {
      e
        ? (this.l.info("Successfully pinged google.com"), pn(2))
        : (this.l.info("Failed to ping google.com"), pn(1));
    }),
    (ke.isActive = function () {
      return !!this.h && this.h.isActive(this);
    }),
    ((ke = li.prototype).Ba = function () {}),
    (ke.Aa = function () {}),
    (ke.za = function () {}),
    (ke.ya = function () {}),
    (ke.isActive = function () {
      return !0;
    }),
    (ke.Va = function () {}),
    (di.prototype.g = function (e, t) {
      return new fi(e, t);
    }),
    je(fi, xt),
    (fi.prototype.m = function () {
      (this.g.h = this.j), this.A && (this.g.J = !0);
      var e = this.g,
        t = this.l,
        n = this.h || void 0;
      pn(0),
        (e.Y = t),
        (e.na = n || {}),
        (e.G = e.aa),
        (e.I = hi(e, null, e.Y)),
        Xr(e);
    }),
    (fi.prototype.close = function () {
      Gr(this.g);
    }),
    (fi.prototype.u = function (e) {
      var t = this.g;
      if ("string" == typeof e) {
        var n = {};
        (n.__data__ = e), (e = n);
      } else this.v && (((n = {}).__data__ = Ft(e)), (e = n));
      t.j.push(new dr(t.fb++, e)), 3 == t.H && Xr(t);
    }),
    (fi.prototype.N = function () {
      (this.g.h = null),
        delete this.j,
        Gr(this.g),
        delete this.g,
        fi.$.N.call(this);
    }),
    je(pi, bn),
    je(gi, Sn),
    je(mi, li),
    (mi.prototype.Ba = function () {
      Ut(this.g, "a");
    }),
    (mi.prototype.Aa = function (e) {
      Ut(this.g, new pi(e));
    }),
    (mi.prototype.za = function (e) {
      Ut(this.g, new gi());
    }),
    (mi.prototype.ya = function () {
      Ut(this.g, "b");
    }),
    je(yi, function () {
      this.blockSize = -1;
    }),
    (yi.prototype.reset = function () {
      (this.g[0] = 1732584193),
        (this.g[1] = 4023233417),
        (this.g[2] = 2562383102),
        (this.g[3] = 271733878),
        (this.i = this.h = 0);
    }),
    (yi.prototype.j = function (e, t) {
      void 0 === t && (t = e.length);
      for (var n = t - this.blockSize, r = this.m, i = this.h, s = 0; s < t; ) {
        if (0 == i) for (; s <= n; ) vi(this, e, s), (s += this.blockSize);
        if ("string" == typeof e) {
          for (; s < t; )
            if (((r[i++] = e.charCodeAt(s++)), i == this.blockSize)) {
              vi(this, r), (i = 0);
              break;
            }
        } else
          for (; s < t; )
            if (((r[i++] = e[s++]), i == this.blockSize)) {
              vi(this, r), (i = 0);
              break;
            }
      }
      (this.h = i), (this.i += t);
    }),
    (yi.prototype.l = function () {
      var e = Array(
        (56 > this.h ? this.blockSize : 2 * this.blockSize) - this.h
      );
      e[0] = 128;
      for (var t = 1; t < e.length - 8; ++t) e[t] = 0;
      var n = 8 * this.i;
      for (t = e.length - 8; t < e.length; ++t) (e[t] = 255 & n), (n /= 256);
      for (this.j(e), e = Array(16), t = n = 0; 4 > t; ++t)
        for (var r = 0; 32 > r; r += 8) e[n++] = (this.g[t] >>> r) & 255;
      return e;
    });
  var _i = {};
  function Ei(e) {
    return -128 <= e && 128 > e
      ? (function (e, t) {
          var n = _i;
          return Object.prototype.hasOwnProperty.call(n, e)
            ? n[e]
            : (n[e] = (function (e) {
                return new wi([0 | e], 0 > e ? -1 : 0);
              })(e));
        })(e)
      : new wi([0 | e], 0 > e ? -1 : 0);
  }
  function Ii(e) {
    if (isNaN(e) || !isFinite(e)) return bi;
    if (0 > e) return Ni(Ii(-e));
    for (var t = [], n = 1, r = 0; e >= n; r++) (t[r] = (e / n) | 0), (n *= Ti);
    return new wi(t, 0);
  }
  var Ti = 4294967296,
    bi = Ei(0),
    Si = Ei(1),
    Ci = Ei(16777216);
  function ki(e) {
    if (0 != e.h) return !1;
    for (var t = 0; t < e.g.length; t++) if (0 != e.g[t]) return !1;
    return !0;
  }
  function Ai(e) {
    return -1 == e.h;
  }
  function Ni(e) {
    for (var t = e.g.length, n = [], r = 0; r < t; r++) n[r] = ~e.g[r];
    return new wi(n, ~e.h).add(Si);
  }
  function Ri(e, t) {
    return e.add(Ni(t));
  }
  function Di(e, t) {
    for (; (65535 & e[t]) != e[t]; )
      (e[t + 1] += e[t] >>> 16), (e[t] &= 65535), t++;
  }
  function Oi(e, t) {
    (this.g = e), (this.h = t);
  }
  function Pi(e, t) {
    if (ki(t)) throw Error("division by zero");
    if (ki(e)) return new Oi(bi, bi);
    if (Ai(e)) return (t = Pi(Ni(e), t)), new Oi(Ni(t.g), Ni(t.h));
    if (Ai(t)) return (t = Pi(e, Ni(t))), new Oi(Ni(t.g), t.h);
    if (30 < e.g.length) {
      if (Ai(e) || Ai(t))
        throw Error("slowDivide_ only works with positive integers.");
      for (var n = Si, r = t; 0 >= r.X(e); ) (n = Li(n)), (r = Li(r));
      var i = Mi(n, 1),
        s = Mi(r, 1);
      for (r = Mi(r, 2), n = Mi(n, 2); !ki(r); ) {
        var o = s.add(r);
        0 >= o.X(e) && ((i = i.add(n)), (s = o)),
          (r = Mi(r, 1)),
          (n = Mi(n, 1));
      }
      return (t = Ri(e, i.R(t))), new Oi(i, t);
    }
    for (i = bi; 0 <= e.X(t); ) {
      for (
        n = Math.max(1, Math.floor(e.ea() / t.ea())),
          r =
            48 >= (r = Math.ceil(Math.log(n) / Math.LN2))
              ? 1
              : Math.pow(2, r - 48),
          o = (s = Ii(n)).R(t);
        Ai(o) || 0 < o.X(e);

      )
        o = (s = Ii((n -= r))).R(t);
      ki(s) && (s = Si), (i = i.add(s)), (e = Ri(e, o));
    }
    return new Oi(i, e);
  }
  function Li(e) {
    for (var t = e.g.length + 1, n = [], r = 0; r < t; r++)
      n[r] = (e.D(r) << 1) | (e.D(r - 1) >>> 31);
    return new wi(n, e.h);
  }
  function Mi(e, t) {
    var n = t >> 5;
    t %= 32;
    for (var r = e.g.length - n, i = [], s = 0; s < r; s++)
      i[s] =
        0 < t ? (e.D(s + n) >>> t) | (e.D(s + n + 1) << (32 - t)) : e.D(s + n);
    return new wi(i, e.h);
  }
  ((ke = wi.prototype).ea = function () {
    if (Ai(this)) return -Ni(this).ea();
    for (var e = 0, t = 1, n = 0; n < this.g.length; n++) {
      var r = this.D(n);
      (e += (0 <= r ? r : Ti + r) * t), (t *= Ti);
    }
    return e;
  }),
    (ke.toString = function (e) {
      if (2 > (e = e || 10) || 36 < e) throw Error("radix out of range: " + e);
      if (ki(this)) return "0";
      if (Ai(this)) return "-" + Ni(this).toString(e);
      for (var t = Ii(Math.pow(e, 6)), n = this, r = ""; ; ) {
        var i = Pi(n, t).g,
          s = (
            (0 < (n = Ri(n, i.R(t))).g.length ? n.g[0] : n.h) >>> 0
          ).toString(e);
        if (ki((n = i))) return s + r;
        for (; 6 > s.length; ) s = "0" + s;
        r = s + r;
      }
    }),
    (ke.D = function (e) {
      return 0 > e ? 0 : e < this.g.length ? this.g[e] : this.h;
    }),
    (ke.X = function (e) {
      return Ai((e = Ri(this, e))) ? -1 : ki(e) ? 0 : 1;
    }),
    (ke.abs = function () {
      return Ai(this) ? Ni(this) : this;
    }),
    (ke.add = function (e) {
      for (
        var t = Math.max(this.g.length, e.g.length), n = [], r = 0, i = 0;
        i <= t;
        i++
      ) {
        var s = r + (65535 & this.D(i)) + (65535 & e.D(i)),
          o = (s >>> 16) + (this.D(i) >>> 16) + (e.D(i) >>> 16);
        (r = o >>> 16), (s &= 65535), (o &= 65535), (n[i] = (o << 16) | s);
      }
      return new wi(n, -2147483648 & n[n.length - 1] ? -1 : 0);
    }),
    (ke.R = function (e) {
      if (ki(this) || ki(e)) return bi;
      if (Ai(this)) return Ai(e) ? Ni(this).R(Ni(e)) : Ni(Ni(this).R(e));
      if (Ai(e)) return Ni(this.R(Ni(e)));
      if (0 > this.X(Ci) && 0 > e.X(Ci)) return Ii(this.ea() * e.ea());
      for (var t = this.g.length + e.g.length, n = [], r = 0; r < 2 * t; r++)
        n[r] = 0;
      for (r = 0; r < this.g.length; r++)
        for (var i = 0; i < e.g.length; i++) {
          var s = this.D(r) >>> 16,
            o = 65535 & this.D(r),
            a = e.D(i) >>> 16,
            c = 65535 & e.D(i);
          (n[2 * r + 2 * i] += o * c),
            Di(n, 2 * r + 2 * i),
            (n[2 * r + 2 * i + 1] += s * c),
            Di(n, 2 * r + 2 * i + 1),
            (n[2 * r + 2 * i + 1] += o * a),
            Di(n, 2 * r + 2 * i + 1),
            (n[2 * r + 2 * i + 2] += s * a),
            Di(n, 2 * r + 2 * i + 2);
        }
      for (r = 0; r < t; r++) n[r] = (n[2 * r + 1] << 16) | n[2 * r];
      for (r = t; r < 2 * t; r++) n[r] = 0;
      return new wi(n, 0);
    }),
    (ke.gb = function (e) {
      return Pi(this, e).h;
    }),
    (ke.and = function (e) {
      for (
        var t = Math.max(this.g.length, e.g.length), n = [], r = 0;
        r < t;
        r++
      )
        n[r] = this.D(r) & e.D(r);
      return new wi(n, this.h & e.h);
    }),
    (ke.or = function (e) {
      for (
        var t = Math.max(this.g.length, e.g.length), n = [], r = 0;
        r < t;
        r++
      )
        n[r] = this.D(r) | e.D(r);
      return new wi(n, this.h | e.h);
    }),
    (ke.xor = function (e) {
      for (
        var t = Math.max(this.g.length, e.g.length), n = [], r = 0;
        r < t;
        r++
      )
        n[r] = this.D(r) ^ e.D(r);
      return new wi(n, this.h ^ e.h);
    }),
    (di.prototype.createWebChannel = di.prototype.g),
    (fi.prototype.send = fi.prototype.u),
    (fi.prototype.open = fi.prototype.m),
    (fi.prototype.close = fi.prototype.close),
    (yn.NO_ERROR = 0),
    (yn.TIMEOUT = 8),
    (yn.HTTP_ERROR = 6),
    (vn.COMPLETE = "complete"),
    (En.EventType = Tn),
    (Tn.OPEN = "a"),
    (Tn.CLOSE = "b"),
    (Tn.ERROR = "c"),
    (Tn.MESSAGE = "d"),
    (xt.prototype.listen = xt.prototype.O),
    (Or.prototype.listenOnce = Or.prototype.P),
    (Or.prototype.getLastError = Or.prototype.Sa),
    (Or.prototype.getLastErrorCode = Or.prototype.Ia),
    (Or.prototype.getStatus = Or.prototype.da),
    (Or.prototype.getResponseJson = Or.prototype.Wa),
    (Or.prototype.getResponseText = Or.prototype.ja),
    (Or.prototype.send = Or.prototype.ha),
    (Or.prototype.setWithCredentials = Or.prototype.Oa),
    (yi.prototype.digest = yi.prototype.l),
    (yi.prototype.reset = yi.prototype.reset),
    (yi.prototype.update = yi.prototype.j),
    (wi.prototype.add = wi.prototype.add),
    (wi.prototype.multiply = wi.prototype.R),
    (wi.prototype.modulo = wi.prototype.gb),
    (wi.prototype.compare = wi.prototype.X),
    (wi.prototype.toNumber = wi.prototype.ea),
    (wi.prototype.toString = wi.prototype.toString),
    (wi.prototype.getBits = wi.prototype.D),
    (wi.fromNumber = Ii),
    (wi.fromString = function e(t, n) {
      if (0 == t.length) throw Error("number format error: empty string");
      if (2 > (n = n || 10) || 36 < n) throw Error("radix out of range: " + n);
      if ("-" == t.charAt(0)) return Ni(e(t.substring(1), n));
      if (0 <= t.indexOf("-"))
        throw Error('number format error: interior "-" character');
      for (var r = Ii(Math.pow(n, 8)), i = bi, s = 0; s < t.length; s += 8) {
        var o = Math.min(8, t.length - s),
          a = parseInt(t.substring(s, s + o), n);
        8 > o
          ? ((o = Ii(Math.pow(n, o))), (i = i.R(o).add(Ii(a))))
          : (i = (i = i.R(r)).add(Ii(a)));
      }
      return i;
    });
  var xi = (Ne.createWebChannelTransport = function () {
      return new di();
    }),
    Ui = (Ne.getStatEventTarget = function () {
      return un();
    }),
    Vi = (Ne.ErrorCode = yn),
    Fi = (Ne.EventType = vn),
    ji = (Ne.Event = cn),
    Bi = (Ne.Stat = {
      xb: 0,
      Ab: 1,
      Bb: 2,
      Ub: 3,
      Zb: 4,
      Wb: 5,
      Xb: 6,
      Vb: 7,
      Tb: 8,
      Yb: 9,
      PROXY: 10,
      NOPROXY: 11,
      Rb: 12,
      Nb: 13,
      Ob: 14,
      Mb: 15,
      Pb: 16,
      Qb: 17,
      tb: 18,
      sb: 19,
      ub: 20,
    }),
    qi = (Ne.FetchXmlHttpFactory = Sr),
    $i = (Ne.WebChannel = En),
    zi = (Ne.XhrIo = Or),
    Hi = (Ne.Md5 = yi),
    Ki = (Ne.Integer = wi);
  const Gi = "@firebase/firestore";
  class Wi {
    constructor(e) {
      this.uid = e;
    }
    isAuthenticated() {
      return null != this.uid;
    }
    toKey() {
      return this.isAuthenticated() ? "uid:" + this.uid : "anonymous-user";
    }
    isEqual(e) {
      return e.uid === this.uid;
    }
  }
  (Wi.UNAUTHENTICATED = new Wi(null)),
    (Wi.GOOGLE_CREDENTIALS = new Wi("google-credentials-uid")),
    (Wi.FIRST_PARTY = new Wi("first-party-uid")),
    (Wi.MOCK_USER = new Wi("mock-user"));
  let Qi = "10.5.2";
  const Xi = new M("@firebase/firestore");
  function Ji() {
    return Xi.logLevel;
  }
  function Yi(e, ...t) {
    if (Xi.logLevel <= N.DEBUG) {
      const n = t.map(ts);
      Xi.debug(`Firestore (${Qi}): ${e}`, ...n);
    }
  }
  function Zi(e, ...t) {
    if (Xi.logLevel <= N.ERROR) {
      const n = t.map(ts);
      Xi.error(`Firestore (${Qi}): ${e}`, ...n);
    }
  }
  function es(e, ...t) {
    if (Xi.logLevel <= N.WARN) {
      const n = t.map(ts);
      Xi.warn(`Firestore (${Qi}): ${e}`, ...n);
    }
  }
  function ts(e) {
    if ("string" == typeof e) return e;
    try {
      return (function (e) {
        return JSON.stringify(e);
      })(e);
    } catch (t) {
      return e;
    }
  }
  function ns(e = "Unexpected state") {
    const t = `FIRESTORE (${Qi}) INTERNAL ASSERTION FAILED: ` + e;
    throw (Zi(t), new Error(t));
  }
  function rs(e, t) {
    e || ns();
  }
  function is(e, t) {
    return e;
  }
  const ss = {
    OK: "ok",
    CANCELLED: "cancelled",
    UNKNOWN: "unknown",
    INVALID_ARGUMENT: "invalid-argument",
    DEADLINE_EXCEEDED: "deadline-exceeded",
    NOT_FOUND: "not-found",
    ALREADY_EXISTS: "already-exists",
    PERMISSION_DENIED: "permission-denied",
    UNAUTHENTICATED: "unauthenticated",
    RESOURCE_EXHAUSTED: "resource-exhausted",
    FAILED_PRECONDITION: "failed-precondition",
    ABORTED: "aborted",
    OUT_OF_RANGE: "out-of-range",
    UNIMPLEMENTED: "unimplemented",
    INTERNAL: "internal",
    UNAVAILABLE: "unavailable",
    DATA_LOSS: "data-loss",
  };
  class os extends f {
    constructor(e, t) {
      super(e, t),
        (this.code = e),
        (this.message = t),
        (this.toString = () =>
          `${this.name}: [code=${this.code}]: ${this.message}`);
    }
  }
  class as {
    constructor() {
      this.promise = new Promise((e, t) => {
        (this.resolve = e), (this.reject = t);
      });
    }
  }
  class cs {
    constructor(e, t) {
      (this.user = t),
        (this.type = "OAuth"),
        (this.headers = new Map()),
        this.headers.set("Authorization", `Bearer ${e}`);
    }
  }
  class hs {
    getToken() {
      return Promise.resolve(null);
    }
    invalidateToken() {}
    start(e, t) {
      e.enqueueRetryable(() => t(Wi.UNAUTHENTICATED));
    }
    shutdown() {}
  }
  class us {
    constructor(e) {
      (this.token = e), (this.changeListener = null);
    }
    getToken() {
      return Promise.resolve(this.token);
    }
    invalidateToken() {}
    start(e, t) {
      (this.changeListener = t), e.enqueueRetryable(() => t(this.token.user));
    }
    shutdown() {
      this.changeListener = null;
    }
  }
  class ls {
    constructor(e) {
      (this.t = e),
        (this.currentUser = Wi.UNAUTHENTICATED),
        (this.i = 0),
        (this.forceRefresh = !1),
        (this.auth = null);
    }
    start(e, t) {
      let n = this.i;
      const r = (e) =>
        this.i !== n ? ((n = this.i), t(e)) : Promise.resolve();
      let i = new as();
      this.o = () => {
        this.i++,
          (this.currentUser = this.u()),
          i.resolve(),
          (i = new as()),
          e.enqueueRetryable(() => r(this.currentUser));
      };
      const s = () => {
          const t = i;
          e.enqueueRetryable(async () => {
            await t.promise, await r(this.currentUser);
          });
        },
        o = (e) => {
          Yi("FirebaseAuthCredentialsProvider", "Auth detected"),
            (this.auth = e),
            this.auth.addAuthTokenListener(this.o),
            s();
        };
      this.t.onInit((e) => o(e)),
        setTimeout(() => {
          if (!this.auth) {
            const e = this.t.getImmediate({ optional: !0 });
            e
              ? o(e)
              : (Yi("FirebaseAuthCredentialsProvider", "Auth not yet detected"),
                i.resolve(),
                (i = new as()));
          }
        }, 0),
        s();
    }
    getToken() {
      const e = this.i,
        t = this.forceRefresh;
      return (
        (this.forceRefresh = !1),
        this.auth
          ? this.auth
              .getToken(t)
              .then((t) =>
                this.i !== e
                  ? (Yi(
                      "FirebaseAuthCredentialsProvider",
                      "getToken aborted due to token change."
                    ),
                    this.getToken())
                  : t
                  ? (rs("string" == typeof t.accessToken),
                    new cs(t.accessToken, this.currentUser))
                  : null
              )
          : Promise.resolve(null)
      );
    }
    invalidateToken() {
      this.forceRefresh = !0;
    }
    shutdown() {
      this.auth && this.auth.removeAuthTokenListener(this.o);
    }
    u() {
      const e = this.auth && this.auth.getUid();
      return rs(null === e || "string" == typeof e), new Wi(e);
    }
  }
  class ds {
    constructor(e, t, n) {
      (this.l = e),
        (this.h = t),
        (this.P = n),
        (this.type = "FirstParty"),
        (this.user = Wi.FIRST_PARTY),
        (this.I = new Map());
    }
    T() {
      return this.P ? this.P() : null;
    }
    get headers() {
      this.I.set("X-Goog-AuthUser", this.l);
      const e = this.T();
      return (
        e && this.I.set("Authorization", e),
        this.h && this.I.set("X-Goog-Iam-Authorization-Token", this.h),
        this.I
      );
    }
  }
  class fs {
    constructor(e, t, n) {
      (this.l = e), (this.h = t), (this.P = n);
    }
    getToken() {
      return Promise.resolve(new ds(this.l, this.h, this.P));
    }
    start(e, t) {
      e.enqueueRetryable(() => t(Wi.FIRST_PARTY));
    }
    shutdown() {}
    invalidateToken() {}
  }
  class ps {
    constructor(e) {
      (this.value = e),
        (this.type = "AppCheck"),
        (this.headers = new Map()),
        e &&
          e.length > 0 &&
          this.headers.set("x-firebase-appcheck", this.value);
    }
  }
  class gs {
    constructor(e) {
      (this.A = e),
        (this.forceRefresh = !1),
        (this.appCheck = null),
        (this.R = null);
    }
    start(e, t) {
      const n = (e) => {
        null != e.error &&
          Yi(
            "FirebaseAppCheckTokenProvider",
            `Error getting App Check token; using placeholder token instead. Error: ${e.error.message}`
          );
        const n = e.token !== this.R;
        return (
          (this.R = e.token),
          Yi(
            "FirebaseAppCheckTokenProvider",
            `Received ${n ? "new" : "existing"} token.`
          ),
          n ? t(e.token) : Promise.resolve()
        );
      };
      this.o = (t) => {
        e.enqueueRetryable(() => n(t));
      };
      const r = (e) => {
        Yi("FirebaseAppCheckTokenProvider", "AppCheck detected"),
          (this.appCheck = e),
          this.appCheck.addTokenListener(this.o);
      };
      this.A.onInit((e) => r(e)),
        setTimeout(() => {
          if (!this.appCheck) {
            const e = this.A.getImmediate({ optional: !0 });
            e
              ? r(e)
              : Yi(
                  "FirebaseAppCheckTokenProvider",
                  "AppCheck not yet detected"
                );
          }
        }, 0);
    }
    getToken() {
      const e = this.forceRefresh;
      return (
        (this.forceRefresh = !1),
        this.appCheck
          ? this.appCheck
              .getToken(e)
              .then((e) =>
                e
                  ? (rs("string" == typeof e.token),
                    (this.R = e.token),
                    new ps(e.token))
                  : null
              )
          : Promise.resolve(null)
      );
    }
    invalidateToken() {
      this.forceRefresh = !0;
    }
    shutdown() {
      this.appCheck && this.appCheck.removeTokenListener(this.o);
    }
  }
  function ms(e) {
    const t = "undefined" != typeof self && (self.crypto || self.msCrypto),
      n = new Uint8Array(e);
    if (t && "function" == typeof t.getRandomValues) t.getRandomValues(n);
    else for (let t = 0; t < e; t++) n[t] = Math.floor(256 * Math.random());
    return n;
  }
  class ys {
    static newId() {
      const e = 62 * Math.floor(256 / 62);
      let t = "";
      for (; t.length < 20; ) {
        const n = ms(40);
        for (let r = 0; r < n.length; ++r)
          t.length < 20 &&
            n[r] < e &&
            (t +=
              "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(
                n[r] % 62
              ));
      }
      return t;
    }
  }
  function vs(e, t) {
    return e < t ? -1 : e > t ? 1 : 0;
  }
  function ws(e, t, n) {
    return e.length === t.length && e.every((e, r) => n(e, t[r]));
  }
  class _s {
    constructor(e, t) {
      if (((this.seconds = e), (this.nanoseconds = t), t < 0))
        throw new os(
          ss.INVALID_ARGUMENT,
          "Timestamp nanoseconds out of range: " + t
        );
      if (t >= 1e9)
        throw new os(
          ss.INVALID_ARGUMENT,
          "Timestamp nanoseconds out of range: " + t
        );
      if (e < -62135596800)
        throw new os(
          ss.INVALID_ARGUMENT,
          "Timestamp seconds out of range: " + e
        );
      if (e >= 253402300800)
        throw new os(
          ss.INVALID_ARGUMENT,
          "Timestamp seconds out of range: " + e
        );
    }
    static now() {
      return _s.fromMillis(Date.now());
    }
    static fromDate(e) {
      return _s.fromMillis(e.getTime());
    }
    static fromMillis(e) {
      const t = Math.floor(e / 1e3),
        n = Math.floor(1e6 * (e - 1e3 * t));
      return new _s(t, n);
    }
    toDate() {
      return new Date(this.toMillis());
    }
    toMillis() {
      return 1e3 * this.seconds + this.nanoseconds / 1e6;
    }
    _compareTo(e) {
      return this.seconds === e.seconds
        ? vs(this.nanoseconds, e.nanoseconds)
        : vs(this.seconds, e.seconds);
    }
    isEqual(e) {
      return e.seconds === this.seconds && e.nanoseconds === this.nanoseconds;
    }
    toString() {
      return (
        "Timestamp(seconds=" +
        this.seconds +
        ", nanoseconds=" +
        this.nanoseconds +
        ")"
      );
    }
    toJSON() {
      return { seconds: this.seconds, nanoseconds: this.nanoseconds };
    }
    valueOf() {
      const e = this.seconds - -62135596800;
      return (
        String(e).padStart(12, "0") +
        "." +
        String(this.nanoseconds).padStart(9, "0")
      );
    }
  }
  class Es {
    constructor(e) {
      this.timestamp = e;
    }
    static fromTimestamp(e) {
      return new Es(e);
    }
    static min() {
      return new Es(new _s(0, 0));
    }
    static max() {
      return new Es(new _s(253402300799, 999999999));
    }
    compareTo(e) {
      return this.timestamp._compareTo(e.timestamp);
    }
    isEqual(e) {
      return this.timestamp.isEqual(e.timestamp);
    }
    toMicroseconds() {
      return 1e6 * this.timestamp.seconds + this.timestamp.nanoseconds / 1e3;
    }
    toString() {
      return "SnapshotVersion(" + this.timestamp.toString() + ")";
    }
    toTimestamp() {
      return this.timestamp;
    }
  }
  class Is {
    constructor(e, t, n) {
      void 0 === t ? (t = 0) : t > e.length && ns(),
        void 0 === n ? (n = e.length - t) : n > e.length - t && ns(),
        (this.segments = e),
        (this.offset = t),
        (this.len = n);
    }
    get length() {
      return this.len;
    }
    isEqual(e) {
      return 0 === Is.comparator(this, e);
    }
    child(e) {
      const t = this.segments.slice(this.offset, this.limit());
      return (
        e instanceof Is
          ? e.forEach((e) => {
              t.push(e);
            })
          : t.push(e),
        this.construct(t)
      );
    }
    limit() {
      return this.offset + this.length;
    }
    popFirst(e) {
      return (
        (e = void 0 === e ? 1 : e),
        this.construct(this.segments, this.offset + e, this.length - e)
      );
    }
    popLast() {
      return this.construct(this.segments, this.offset, this.length - 1);
    }
    firstSegment() {
      return this.segments[this.offset];
    }
    lastSegment() {
      return this.get(this.length - 1);
    }
    get(e) {
      return this.segments[this.offset + e];
    }
    isEmpty() {
      return 0 === this.length;
    }
    isPrefixOf(e) {
      if (e.length < this.length) return !1;
      for (let t = 0; t < this.length; t++)
        if (this.get(t) !== e.get(t)) return !1;
      return !0;
    }
    isImmediateParentOf(e) {
      if (this.length + 1 !== e.length) return !1;
      for (let t = 0; t < this.length; t++)
        if (this.get(t) !== e.get(t)) return !1;
      return !0;
    }
    forEach(e) {
      for (let t = this.offset, n = this.limit(); t < n; t++)
        e(this.segments[t]);
    }
    toArray() {
      return this.segments.slice(this.offset, this.limit());
    }
    static comparator(e, t) {
      const n = Math.min(e.length, t.length);
      for (let r = 0; r < n; r++) {
        const n = e.get(r),
          i = t.get(r);
        if (n < i) return -1;
        if (n > i) return 1;
      }
      return e.length < t.length ? -1 : e.length > t.length ? 1 : 0;
    }
  }
  class Ts extends Is {
    construct(e, t, n) {
      return new Ts(e, t, n);
    }
    canonicalString() {
      return this.toArray().join("/");
    }
    toString() {
      return this.canonicalString();
    }
    static fromString(...e) {
      const t = [];
      for (const n of e) {
        if (n.indexOf("//") >= 0)
          throw new os(
            ss.INVALID_ARGUMENT,
            `Invalid segment (${n}). Paths must not contain // in them.`
          );
        t.push(...n.split("/").filter((e) => e.length > 0));
      }
      return new Ts(t);
    }
    static emptyPath() {
      return new Ts([]);
    }
  }
  const bs = /^[_a-zA-Z][_a-zA-Z0-9]*$/;
  class Ss extends Is {
    construct(e, t, n) {
      return new Ss(e, t, n);
    }
    static isValidIdentifier(e) {
      return bs.test(e);
    }
    canonicalString() {
      return this.toArray()
        .map(
          (e) => (
            (e = e.replace(/\\/g, "\\\\").replace(/`/g, "\\`")),
            Ss.isValidIdentifier(e) || (e = "`" + e + "`"),
            e
          )
        )
        .join(".");
    }
    toString() {
      return this.canonicalString();
    }
    isKeyField() {
      return 1 === this.length && "__name__" === this.get(0);
    }
    static keyField() {
      return new Ss(["__name__"]);
    }
    static fromServerFormat(e) {
      const t = [];
      let n = "",
        r = 0;
      const i = () => {
        if (0 === n.length)
          throw new os(
            ss.INVALID_ARGUMENT,
            `Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`
          );
        t.push(n), (n = "");
      };
      let s = !1;
      for (; r < e.length; ) {
        const t = e[r];
        if ("\\" === t) {
          if (r + 1 === e.length)
            throw new os(
              ss.INVALID_ARGUMENT,
              "Path has trailing escape character: " + e
            );
          const t = e[r + 1];
          if ("\\" !== t && "." !== t && "`" !== t)
            throw new os(
              ss.INVALID_ARGUMENT,
              "Path has invalid escape sequence: " + e
            );
          (n += t), (r += 2);
        } else
          "`" === t
            ? ((s = !s), r++)
            : "." !== t || s
            ? ((n += t), r++)
            : (i(), r++);
      }
      if ((i(), s))
        throw new os(ss.INVALID_ARGUMENT, "Unterminated ` in path: " + e);
      return new Ss(t);
    }
    static emptyPath() {
      return new Ss([]);
    }
  }
  class Cs {
    constructor(e) {
      this.path = e;
    }
    static fromPath(e) {
      return new Cs(Ts.fromString(e));
    }
    static fromName(e) {
      return new Cs(Ts.fromString(e).popFirst(5));
    }
    static empty() {
      return new Cs(Ts.emptyPath());
    }
    get collectionGroup() {
      return this.path.popLast().lastSegment();
    }
    hasCollectionId(e) {
      return this.path.length >= 2 && this.path.get(this.path.length - 2) === e;
    }
    getCollectionGroup() {
      return this.path.get(this.path.length - 2);
    }
    getCollectionPath() {
      return this.path.popLast();
    }
    isEqual(e) {
      return null !== e && 0 === Ts.comparator(this.path, e.path);
    }
    toString() {
      return this.path.toString();
    }
    static comparator(e, t) {
      return Ts.comparator(e.path, t.path);
    }
    static isDocumentKey(e) {
      return e.length % 2 == 0;
    }
    static fromSegments(e) {
      return new Cs(new Ts(e.slice()));
    }
  }
  function ks(e) {
    return new As(e.readTime, e.key, -1);
  }
  class As {
    constructor(e, t, n) {
      (this.readTime = e), (this.documentKey = t), (this.largestBatchId = n);
    }
    static min() {
      return new As(Es.min(), Cs.empty(), -1);
    }
    static max() {
      return new As(Es.max(), Cs.empty(), -1);
    }
  }
  function Ns(e, t) {
    let n = e.readTime.compareTo(t.readTime);
    return 0 !== n
      ? n
      : ((n = Cs.comparator(e.documentKey, t.documentKey)),
        0 !== n ? n : vs(e.largestBatchId, t.largestBatchId));
  }
  const Rs =
    "The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";
  class Ds {
    constructor() {
      this.onCommittedListeners = [];
    }
    addOnCommittedListener(e) {
      this.onCommittedListeners.push(e);
    }
    raiseOnCommittedEvent() {
      this.onCommittedListeners.forEach((e) => e());
    }
  }
  async function Os(e) {
    if (e.code !== ss.FAILED_PRECONDITION || e.message !== Rs) throw e;
    Yi("LocalStore", "Unexpectedly lost primary lease");
  }
  class Ps {
    constructor(e) {
      (this.nextCallback = null),
        (this.catchCallback = null),
        (this.result = void 0),
        (this.error = void 0),
        (this.isDone = !1),
        (this.callbackAttached = !1),
        e(
          (e) => {
            (this.isDone = !0),
              (this.result = e),
              this.nextCallback && this.nextCallback(e);
          },
          (e) => {
            (this.isDone = !0),
              (this.error = e),
              this.catchCallback && this.catchCallback(e);
          }
        );
    }
    catch(e) {
      return this.next(void 0, e);
    }
    next(e, t) {
      return (
        this.callbackAttached && ns(),
        (this.callbackAttached = !0),
        this.isDone
          ? this.error
            ? this.wrapFailure(t, this.error)
            : this.wrapSuccess(e, this.result)
          : new Ps((n, r) => {
              (this.nextCallback = (t) => {
                this.wrapSuccess(e, t).next(n, r);
              }),
                (this.catchCallback = (e) => {
                  this.wrapFailure(t, e).next(n, r);
                });
            })
      );
    }
    toPromise() {
      return new Promise((e, t) => {
        this.next(e, t);
      });
    }
    wrapUserFunction(e) {
      try {
        const t = e();
        return t instanceof Ps ? t : Ps.resolve(t);
      } catch (e) {
        return Ps.reject(e);
      }
    }
    wrapSuccess(e, t) {
      return e ? this.wrapUserFunction(() => e(t)) : Ps.resolve(t);
    }
    wrapFailure(e, t) {
      return e ? this.wrapUserFunction(() => e(t)) : Ps.reject(t);
    }
    static resolve(e) {
      return new Ps((t, n) => {
        t(e);
      });
    }
    static reject(e) {
      return new Ps((t, n) => {
        n(e);
      });
    }
    static waitFor(e) {
      return new Ps((t, n) => {
        let r = 0,
          i = 0,
          s = !1;
        e.forEach((e) => {
          ++r,
            e.next(
              () => {
                ++i, s && i === r && t();
              },
              (e) => n(e)
            );
        }),
          (s = !0),
          i === r && t();
      });
    }
    static or(e) {
      let t = Ps.resolve(!1);
      for (const n of e) t = t.next((e) => (e ? Ps.resolve(e) : n()));
      return t;
    }
    static forEach(e, t) {
      const n = [];
      return (
        e.forEach((e, r) => {
          n.push(t.call(this, e, r));
        }),
        this.waitFor(n)
      );
    }
    static mapArray(e, t) {
      return new Ps((n, r) => {
        const i = e.length,
          s = new Array(i);
        let o = 0;
        for (let a = 0; a < i; a++) {
          const c = a;
          t(e[c]).next(
            (e) => {
              (s[c] = e), ++o, o === i && n(s);
            },
            (e) => r(e)
          );
        }
      });
    }
    static doWhile(e, t) {
      return new Ps((n, r) => {
        const i = () => {
          !0 === e()
            ? t().next(() => {
                i();
              }, r)
            : n();
        };
        i();
      });
    }
  }
  function Ls(e) {
    return "IndexedDbTransactionError" === e.name;
  }
  class Ms {
    constructor(e, t) {
      (this.previousValue = e),
        t &&
          ((t.sequenceNumberHandler = (e) => this.se(e)),
          (this.oe = (e) => t.writeSequenceNumber(e)));
    }
    se(e) {
      return (
        (this.previousValue = Math.max(e, this.previousValue)),
        this.previousValue
      );
    }
    next() {
      const e = ++this.previousValue;
      return this.oe && this.oe(e), e;
    }
  }
  function xs(e) {
    return null == e;
  }
  function Us(e) {
    return 0 === e && 1 / e == -1 / 0;
  }
  Ms._e = -1;
  function Vs(e) {
    let t = 0;
    for (const n in e) Object.prototype.hasOwnProperty.call(e, n) && t++;
    return t;
  }
  function Fs(e, t) {
    for (const n in e) Object.prototype.hasOwnProperty.call(e, n) && t(n, e[n]);
  }
  function js(e) {
    for (const t in e)
      if (Object.prototype.hasOwnProperty.call(e, t)) return !1;
    return !0;
  }
  class Bs {
    constructor(e, t) {
      (this.comparator = e), (this.root = t || $s.EMPTY);
    }
    insert(e, t) {
      return new Bs(
        this.comparator,
        this.root
          .insert(e, t, this.comparator)
          .copy(null, null, $s.BLACK, null, null)
      );
    }
    remove(e) {
      return new Bs(
        this.comparator,
        this.root
          .remove(e, this.comparator)
          .copy(null, null, $s.BLACK, null, null)
      );
    }
    get(e) {
      let t = this.root;
      for (; !t.isEmpty(); ) {
        const n = this.comparator(e, t.key);
        if (0 === n) return t.value;
        n < 0 ? (t = t.left) : n > 0 && (t = t.right);
      }
      return null;
    }
    indexOf(e) {
      let t = 0,
        n = this.root;
      for (; !n.isEmpty(); ) {
        const r = this.comparator(e, n.key);
        if (0 === r) return t + n.left.size;
        r < 0 ? (n = n.left) : ((t += n.left.size + 1), (n = n.right));
      }
      return -1;
    }
    isEmpty() {
      return this.root.isEmpty();
    }
    get size() {
      return this.root.size;
    }
    minKey() {
      return this.root.minKey();
    }
    maxKey() {
      return this.root.maxKey();
    }
    inorderTraversal(e) {
      return this.root.inorderTraversal(e);
    }
    forEach(e) {
      this.inorderTraversal((t, n) => (e(t, n), !1));
    }
    toString() {
      const e = [];
      return (
        this.inorderTraversal((t, n) => (e.push(`${t}:${n}`), !1)),
        `{${e.join(", ")}}`
      );
    }
    reverseTraversal(e) {
      return this.root.reverseTraversal(e);
    }
    getIterator() {
      return new qs(this.root, null, this.comparator, !1);
    }
    getIteratorFrom(e) {
      return new qs(this.root, e, this.comparator, !1);
    }
    getReverseIterator() {
      return new qs(this.root, null, this.comparator, !0);
    }
    getReverseIteratorFrom(e) {
      return new qs(this.root, e, this.comparator, !0);
    }
  }
  class qs {
    constructor(e, t, n, r) {
      (this.isReverse = r), (this.nodeStack = []);
      let i = 1;
      for (; !e.isEmpty(); )
        if (((i = t ? n(e.key, t) : 1), t && r && (i *= -1), i < 0))
          e = this.isReverse ? e.left : e.right;
        else {
          if (0 === i) {
            this.nodeStack.push(e);
            break;
          }
          this.nodeStack.push(e), (e = this.isReverse ? e.right : e.left);
        }
    }
    getNext() {
      let e = this.nodeStack.pop();
      const t = { key: e.key, value: e.value };
      if (this.isReverse)
        for (e = e.left; !e.isEmpty(); ) this.nodeStack.push(e), (e = e.right);
      else
        for (e = e.right; !e.isEmpty(); ) this.nodeStack.push(e), (e = e.left);
      return t;
    }
    hasNext() {
      return this.nodeStack.length > 0;
    }
    peek() {
      if (0 === this.nodeStack.length) return null;
      const e = this.nodeStack[this.nodeStack.length - 1];
      return { key: e.key, value: e.value };
    }
  }
  class $s {
    constructor(e, t, n, r, i) {
      (this.key = e),
        (this.value = t),
        (this.color = null != n ? n : $s.RED),
        (this.left = null != r ? r : $s.EMPTY),
        (this.right = null != i ? i : $s.EMPTY),
        (this.size = this.left.size + 1 + this.right.size);
    }
    copy(e, t, n, r, i) {
      return new $s(
        null != e ? e : this.key,
        null != t ? t : this.value,
        null != n ? n : this.color,
        null != r ? r : this.left,
        null != i ? i : this.right
      );
    }
    isEmpty() {
      return !1;
    }
    inorderTraversal(e) {
      return (
        this.left.inorderTraversal(e) ||
        e(this.key, this.value) ||
        this.right.inorderTraversal(e)
      );
    }
    reverseTraversal(e) {
      return (
        this.right.reverseTraversal(e) ||
        e(this.key, this.value) ||
        this.left.reverseTraversal(e)
      );
    }
    min() {
      return this.left.isEmpty() ? this : this.left.min();
    }
    minKey() {
      return this.min().key;
    }
    maxKey() {
      return this.right.isEmpty() ? this.key : this.right.maxKey();
    }
    insert(e, t, n) {
      let r = this;
      const i = n(e, r.key);
      return (
        (r =
          i < 0
            ? r.copy(null, null, null, r.left.insert(e, t, n), null)
            : 0 === i
            ? r.copy(null, t, null, null, null)
            : r.copy(null, null, null, null, r.right.insert(e, t, n))),
        r.fixUp()
      );
    }
    removeMin() {
      if (this.left.isEmpty()) return $s.EMPTY;
      let e = this;
      return (
        e.left.isRed() || e.left.left.isRed() || (e = e.moveRedLeft()),
        (e = e.copy(null, null, null, e.left.removeMin(), null)),
        e.fixUp()
      );
    }
    remove(e, t) {
      let n,
        r = this;
      if (t(e, r.key) < 0)
        r.left.isEmpty() ||
          r.left.isRed() ||
          r.left.left.isRed() ||
          (r = r.moveRedLeft()),
          (r = r.copy(null, null, null, r.left.remove(e, t), null));
      else {
        if (
          (r.left.isRed() && (r = r.rotateRight()),
          r.right.isEmpty() ||
            r.right.isRed() ||
            r.right.left.isRed() ||
            (r = r.moveRedRight()),
          0 === t(e, r.key))
        ) {
          if (r.right.isEmpty()) return $s.EMPTY;
          (n = r.right.min()),
            (r = r.copy(n.key, n.value, null, null, r.right.removeMin()));
        }
        r = r.copy(null, null, null, null, r.right.remove(e, t));
      }
      return r.fixUp();
    }
    isRed() {
      return this.color;
    }
    fixUp() {
      let e = this;
      return (
        e.right.isRed() && !e.left.isRed() && (e = e.rotateLeft()),
        e.left.isRed() && e.left.left.isRed() && (e = e.rotateRight()),
        e.left.isRed() && e.right.isRed() && (e = e.colorFlip()),
        e
      );
    }
    moveRedLeft() {
      let e = this.colorFlip();
      return (
        e.right.left.isRed() &&
          ((e = e.copy(null, null, null, null, e.right.rotateRight())),
          (e = e.rotateLeft()),
          (e = e.colorFlip())),
        e
      );
    }
    moveRedRight() {
      let e = this.colorFlip();
      return (
        e.left.left.isRed() && ((e = e.rotateRight()), (e = e.colorFlip())), e
      );
    }
    rotateLeft() {
      const e = this.copy(null, null, $s.RED, null, this.right.left);
      return this.right.copy(null, null, this.color, e, null);
    }
    rotateRight() {
      const e = this.copy(null, null, $s.RED, this.left.right, null);
      return this.left.copy(null, null, this.color, null, e);
    }
    colorFlip() {
      const e = this.left.copy(null, null, !this.left.color, null, null),
        t = this.right.copy(null, null, !this.right.color, null, null);
      return this.copy(null, null, !this.color, e, t);
    }
    checkMaxDepth() {
      const e = this.check();
      return Math.pow(2, e) <= this.size + 1;
    }
    check() {
      if (this.isRed() && this.left.isRed()) throw ns();
      if (this.right.isRed()) throw ns();
      const e = this.left.check();
      if (e !== this.right.check()) throw ns();
      return e + (this.isRed() ? 0 : 1);
    }
  }
  ($s.EMPTY = null),
    ($s.RED = !0),
    ($s.BLACK = !1),
    ($s.EMPTY = new (class {
      constructor() {
        this.size = 0;
      }
      get key() {
        throw ns();
      }
      get value() {
        throw ns();
      }
      get color() {
        throw ns();
      }
      get left() {
        throw ns();
      }
      get right() {
        throw ns();
      }
      copy(e, t, n, r, i) {
        return this;
      }
      insert(e, t, n) {
        return new $s(e, t);
      }
      remove(e, t) {
        return this;
      }
      isEmpty() {
        return !0;
      }
      inorderTraversal(e) {
        return !1;
      }
      reverseTraversal(e) {
        return !1;
      }
      minKey() {
        return null;
      }
      maxKey() {
        return null;
      }
      isRed() {
        return !1;
      }
      checkMaxDepth() {
        return !0;
      }
      check() {
        return 0;
      }
    })());
  class zs {
    constructor(e) {
      (this.comparator = e), (this.data = new Bs(this.comparator));
    }
    has(e) {
      return null !== this.data.get(e);
    }
    first() {
      return this.data.minKey();
    }
    last() {
      return this.data.maxKey();
    }
    get size() {
      return this.data.size;
    }
    indexOf(e) {
      return this.data.indexOf(e);
    }
    forEach(e) {
      this.data.inorderTraversal((t, n) => (e(t), !1));
    }
    forEachInRange(e, t) {
      const n = this.data.getIteratorFrom(e[0]);
      for (; n.hasNext(); ) {
        const r = n.getNext();
        if (this.comparator(r.key, e[1]) >= 0) return;
        t(r.key);
      }
    }
    forEachWhile(e, t) {
      let n;
      for (
        n =
          void 0 !== t ? this.data.getIteratorFrom(t) : this.data.getIterator();
        n.hasNext();

      )
        if (!e(n.getNext().key)) return;
    }
    firstAfterOrEqual(e) {
      const t = this.data.getIteratorFrom(e);
      return t.hasNext() ? t.getNext().key : null;
    }
    getIterator() {
      return new Hs(this.data.getIterator());
    }
    getIteratorFrom(e) {
      return new Hs(this.data.getIteratorFrom(e));
    }
    add(e) {
      return this.copy(this.data.remove(e).insert(e, !0));
    }
    delete(e) {
      return this.has(e) ? this.copy(this.data.remove(e)) : this;
    }
    isEmpty() {
      return this.data.isEmpty();
    }
    unionWith(e) {
      let t = this;
      return (
        t.size < e.size && ((t = e), (e = this)),
        e.forEach((e) => {
          t = t.add(e);
        }),
        t
      );
    }
    isEqual(e) {
      if (!(e instanceof zs)) return !1;
      if (this.size !== e.size) return !1;
      const t = this.data.getIterator(),
        n = e.data.getIterator();
      for (; t.hasNext(); ) {
        const e = t.getNext().key,
          r = n.getNext().key;
        if (0 !== this.comparator(e, r)) return !1;
      }
      return !0;
    }
    toArray() {
      const e = [];
      return (
        this.forEach((t) => {
          e.push(t);
        }),
        e
      );
    }
    toString() {
      const e = [];
      return this.forEach((t) => e.push(t)), "SortedSet(" + e.toString() + ")";
    }
    copy(e) {
      const t = new zs(this.comparator);
      return (t.data = e), t;
    }
  }
  class Hs {
    constructor(e) {
      this.iter = e;
    }
    getNext() {
      return this.iter.getNext().key;
    }
    hasNext() {
      return this.iter.hasNext();
    }
  }
  class Ks {
    constructor(e) {
      (this.fields = e), e.sort(Ss.comparator);
    }
    static empty() {
      return new Ks([]);
    }
    unionWith(e) {
      let t = new zs(Ss.comparator);
      for (const e of this.fields) t = t.add(e);
      for (const n of e) t = t.add(n);
      return new Ks(t.toArray());
    }
    covers(e) {
      for (const t of this.fields) if (t.isPrefixOf(e)) return !0;
      return !1;
    }
    isEqual(e) {
      return ws(this.fields, e.fields, (e, t) => e.isEqual(t));
    }
  }
  class Gs extends Error {
    constructor() {
      super(...arguments), (this.name = "Base64DecodeError");
    }
  }
  class Ws {
    constructor(e) {
      this.binaryString = e;
    }
    static fromBase64String(e) {
      const t = (function (e) {
        try {
          return atob(e);
        } catch (e) {
          throw "undefined" != typeof DOMException && e instanceof DOMException
            ? new Gs("Invalid base64 string: " + e)
            : e;
        }
      })(e);
      return new Ws(t);
    }
    static fromUint8Array(e) {
      const t = (function (e) {
        let t = "";
        for (let n = 0; n < e.length; ++n) t += String.fromCharCode(e[n]);
        return t;
      })(e);
      return new Ws(t);
    }
    [Symbol.iterator]() {
      let e = 0;
      return {
        next: () =>
          e < this.binaryString.length
            ? { value: this.binaryString.charCodeAt(e++), done: !1 }
            : { value: void 0, done: !0 },
      };
    }
    toBase64() {
      return (e = this.binaryString), btoa(e);
      var e;
    }
    toUint8Array() {
      return (function (e) {
        const t = new Uint8Array(e.length);
        for (let n = 0; n < e.length; n++) t[n] = e.charCodeAt(n);
        return t;
      })(this.binaryString);
    }
    approximateByteSize() {
      return 2 * this.binaryString.length;
    }
    compareTo(e) {
      return vs(this.binaryString, e.binaryString);
    }
    isEqual(e) {
      return this.binaryString === e.binaryString;
    }
  }
  Ws.EMPTY_BYTE_STRING = new Ws("");
  const Qs = new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);
  function Xs(e) {
    if ((rs(!!e), "string" == typeof e)) {
      let t = 0;
      const n = Qs.exec(e);
      if ((rs(!!n), n[1])) {
        let e = n[1];
        (e = (e + "000000000").substr(0, 9)), (t = Number(e));
      }
      const r = new Date(e);
      return { seconds: Math.floor(r.getTime() / 1e3), nanos: t };
    }
    return { seconds: Js(e.seconds), nanos: Js(e.nanos) };
  }
  function Js(e) {
    return "number" == typeof e ? e : "string" == typeof e ? Number(e) : 0;
  }
  function Ys(e) {
    return "string" == typeof e ? Ws.fromBase64String(e) : Ws.fromUint8Array(e);
  }
  function Zs(e) {
    var t, n;
    return (
      "server_timestamp" ===
      (null ===
        (n = (
          (null === (t = null == e ? void 0 : e.mapValue) || void 0 === t
            ? void 0
            : t.fields) || {}
        ).__type__) || void 0 === n
        ? void 0
        : n.stringValue)
    );
  }
  function eo(e) {
    const t = e.mapValue.fields.__previous_value__;
    return Zs(t) ? eo(t) : t;
  }
  function to(e) {
    const t = Xs(e.mapValue.fields.__local_write_time__.timestampValue);
    return new _s(t.seconds, t.nanos);
  }
  class no {
    constructor(e, t, n, r, i, s, o, a, c) {
      (this.databaseId = e),
        (this.appId = t),
        (this.persistenceKey = n),
        (this.host = r),
        (this.ssl = i),
        (this.forceLongPolling = s),
        (this.autoDetectLongPolling = o),
        (this.longPollingOptions = a),
        (this.useFetchStreams = c);
    }
  }
  class ro {
    constructor(e, t) {
      (this.projectId = e), (this.database = t || "(default)");
    }
    static empty() {
      return new ro("", "");
    }
    get isDefaultDatabase() {
      return "(default)" === this.database;
    }
    isEqual(e) {
      return (
        e instanceof ro &&
        e.projectId === this.projectId &&
        e.database === this.database
      );
    }
  }
  const io = { mapValue: { fields: { __type__: { stringValue: "__max__" } } } };
  function so(e) {
    return "nullValue" in e
      ? 0
      : "booleanValue" in e
      ? 1
      : "integerValue" in e || "doubleValue" in e
      ? 2
      : "timestampValue" in e
      ? 3
      : "stringValue" in e
      ? 5
      : "bytesValue" in e
      ? 6
      : "referenceValue" in e
      ? 7
      : "geoPointValue" in e
      ? 8
      : "arrayValue" in e
      ? 9
      : "mapValue" in e
      ? Zs(e)
        ? 4
        : _o(e)
        ? 9007199254740991
        : 10
      : ns();
  }
  function oo(e, t) {
    if (e === t) return !0;
    const n = so(e);
    if (n !== so(t)) return !1;
    switch (n) {
      case 0:
      case 9007199254740991:
        return !0;
      case 1:
        return e.booleanValue === t.booleanValue;
      case 4:
        return to(e).isEqual(to(t));
      case 3:
        return (function (e, t) {
          if (
            "string" == typeof e.timestampValue &&
            "string" == typeof t.timestampValue &&
            e.timestampValue.length === t.timestampValue.length
          )
            return e.timestampValue === t.timestampValue;
          const n = Xs(e.timestampValue),
            r = Xs(t.timestampValue);
          return n.seconds === r.seconds && n.nanos === r.nanos;
        })(e, t);
      case 5:
        return e.stringValue === t.stringValue;
      case 6:
        return (function (e, t) {
          return Ys(e.bytesValue).isEqual(Ys(t.bytesValue));
        })(e, t);
      case 7:
        return e.referenceValue === t.referenceValue;
      case 8:
        return (function (e, t) {
          return (
            Js(e.geoPointValue.latitude) === Js(t.geoPointValue.latitude) &&
            Js(e.geoPointValue.longitude) === Js(t.geoPointValue.longitude)
          );
        })(e, t);
      case 2:
        return (function (e, t) {
          if ("integerValue" in e && "integerValue" in t)
            return Js(e.integerValue) === Js(t.integerValue);
          if ("doubleValue" in e && "doubleValue" in t) {
            const n = Js(e.doubleValue),
              r = Js(t.doubleValue);
            return n === r ? Us(n) === Us(r) : isNaN(n) && isNaN(r);
          }
          return !1;
        })(e, t);
      case 9:
        return ws(e.arrayValue.values || [], t.arrayValue.values || [], oo);
      case 10:
        return (function (e, t) {
          const n = e.mapValue.fields || {},
            r = t.mapValue.fields || {};
          if (Vs(n) !== Vs(r)) return !1;
          for (const e in n)
            if (n.hasOwnProperty(e) && (void 0 === r[e] || !oo(n[e], r[e])))
              return !1;
          return !0;
        })(e, t);
      default:
        return ns();
    }
  }
  function ao(e, t) {
    return void 0 !== (e.values || []).find((e) => oo(e, t));
  }
  function co(e, t) {
    if (e === t) return 0;
    const n = so(e),
      r = so(t);
    if (n !== r) return vs(n, r);
    switch (n) {
      case 0:
      case 9007199254740991:
        return 0;
      case 1:
        return vs(e.booleanValue, t.booleanValue);
      case 2:
        return (function (e, t) {
          const n = Js(e.integerValue || e.doubleValue),
            r = Js(t.integerValue || t.doubleValue);
          return n < r
            ? -1
            : n > r
            ? 1
            : n === r
            ? 0
            : isNaN(n)
            ? isNaN(r)
              ? 0
              : -1
            : 1;
        })(e, t);
      case 3:
        return ho(e.timestampValue, t.timestampValue);
      case 4:
        return ho(to(e), to(t));
      case 5:
        return vs(e.stringValue, t.stringValue);
      case 6:
        return (function (e, t) {
          const n = Ys(e),
            r = Ys(t);
          return n.compareTo(r);
        })(e.bytesValue, t.bytesValue);
      case 7:
        return (function (e, t) {
          const n = e.split("/"),
            r = t.split("/");
          for (let e = 0; e < n.length && e < r.length; e++) {
            const t = vs(n[e], r[e]);
            if (0 !== t) return t;
          }
          return vs(n.length, r.length);
        })(e.referenceValue, t.referenceValue);
      case 8:
        return (function (e, t) {
          const n = vs(Js(e.latitude), Js(t.latitude));
          return 0 !== n ? n : vs(Js(e.longitude), Js(t.longitude));
        })(e.geoPointValue, t.geoPointValue);
      case 9:
        return (function (e, t) {
          const n = e.values || [],
            r = t.values || [];
          for (let e = 0; e < n.length && e < r.length; ++e) {
            const t = co(n[e], r[e]);
            if (t) return t;
          }
          return vs(n.length, r.length);
        })(e.arrayValue, t.arrayValue);
      case 10:
        return (function (e, t) {
          if (e === io.mapValue && t === io.mapValue) return 0;
          if (e === io.mapValue) return 1;
          if (t === io.mapValue) return -1;
          const n = e.fields || {},
            r = Object.keys(n),
            i = t.fields || {},
            s = Object.keys(i);
          r.sort(), s.sort();
          for (let e = 0; e < r.length && e < s.length; ++e) {
            const t = vs(r[e], s[e]);
            if (0 !== t) return t;
            const o = co(n[r[e]], i[s[e]]);
            if (0 !== o) return o;
          }
          return vs(r.length, s.length);
        })(e.mapValue, t.mapValue);
      default:
        throw ns();
    }
  }
  function ho(e, t) {
    if ("string" == typeof e && "string" == typeof t && e.length === t.length)
      return vs(e, t);
    const n = Xs(e),
      r = Xs(t),
      i = vs(n.seconds, r.seconds);
    return 0 !== i ? i : vs(n.nanos, r.nanos);
  }
  function uo(e) {
    return lo(e);
  }
  function lo(e) {
    return "nullValue" in e
      ? "null"
      : "booleanValue" in e
      ? "" + e.booleanValue
      : "integerValue" in e
      ? "" + e.integerValue
      : "doubleValue" in e
      ? "" + e.doubleValue
      : "timestampValue" in e
      ? (function (e) {
          const t = Xs(e);
          return `time(${t.seconds},${t.nanos})`;
        })(e.timestampValue)
      : "stringValue" in e
      ? e.stringValue
      : "bytesValue" in e
      ? (function (e) {
          return Ys(e).toBase64();
        })(e.bytesValue)
      : "referenceValue" in e
      ? (function (e) {
          return Cs.fromName(e).toString();
        })(e.referenceValue)
      : "geoPointValue" in e
      ? (function (e) {
          return `geo(${e.latitude},${e.longitude})`;
        })(e.geoPointValue)
      : "arrayValue" in e
      ? (function (e) {
          let t = "[",
            n = !0;
          for (const r of e.values || [])
            n ? (n = !1) : (t += ","), (t += lo(r));
          return t + "]";
        })(e.arrayValue)
      : "mapValue" in e
      ? (function (e) {
          const t = Object.keys(e.fields || {}).sort();
          let n = "{",
            r = !0;
          for (const i of t)
            r ? (r = !1) : (n += ","), (n += `${i}:${lo(e.fields[i])}`);
          return n + "}";
        })(e.mapValue)
      : ns();
  }
  function fo(e, t) {
    return {
      referenceValue: `projects/${e.projectId}/databases/${
        e.database
      }/documents/${t.path.canonicalString()}`,
    };
  }
  function po(e) {
    return !!e && "integerValue" in e;
  }
  function go(e) {
    return !!e && "arrayValue" in e;
  }
  function mo(e) {
    return !!e && "nullValue" in e;
  }
  function yo(e) {
    return !!e && "doubleValue" in e && isNaN(Number(e.doubleValue));
  }
  function vo(e) {
    return !!e && "mapValue" in e;
  }
  function wo(e) {
    if (e.geoPointValue)
      return { geoPointValue: Object.assign({}, e.geoPointValue) };
    if (e.timestampValue && "object" == typeof e.timestampValue)
      return { timestampValue: Object.assign({}, e.timestampValue) };
    if (e.mapValue) {
      const t = { mapValue: { fields: {} } };
      return Fs(e.mapValue.fields, (e, n) => (t.mapValue.fields[e] = wo(n))), t;
    }
    if (e.arrayValue) {
      const t = { arrayValue: { values: [] } };
      for (let n = 0; n < (e.arrayValue.values || []).length; ++n)
        t.arrayValue.values[n] = wo(e.arrayValue.values[n]);
      return t;
    }
    return Object.assign({}, e);
  }
  function _o(e) {
    return (
      "__max__" ===
      (((e.mapValue || {}).fields || {}).__type__ || {}).stringValue
    );
  }
  class Eo {
    constructor(e) {
      this.value = e;
    }
    static empty() {
      return new Eo({ mapValue: {} });
    }
    field(e) {
      if (e.isEmpty()) return this.value;
      {
        let t = this.value;
        for (let n = 0; n < e.length - 1; ++n)
          if (((t = (t.mapValue.fields || {})[e.get(n)]), !vo(t))) return null;
        return (t = (t.mapValue.fields || {})[e.lastSegment()]), t || null;
      }
    }
    set(e, t) {
      this.getFieldsMap(e.popLast())[e.lastSegment()] = wo(t);
    }
    setAll(e) {
      let t = Ss.emptyPath(),
        n = {},
        r = [];
      e.forEach((e, i) => {
        if (!t.isImmediateParentOf(i)) {
          const e = this.getFieldsMap(t);
          this.applyChanges(e, n, r), (n = {}), (r = []), (t = i.popLast());
        }
        e ? (n[i.lastSegment()] = wo(e)) : r.push(i.lastSegment());
      });
      const i = this.getFieldsMap(t);
      this.applyChanges(i, n, r);
    }
    delete(e) {
      const t = this.field(e.popLast());
      vo(t) && t.mapValue.fields && delete t.mapValue.fields[e.lastSegment()];
    }
    isEqual(e) {
      return oo(this.value, e.value);
    }
    getFieldsMap(e) {
      let t = this.value;
      t.mapValue.fields || (t.mapValue = { fields: {} });
      for (let n = 0; n < e.length; ++n) {
        let r = t.mapValue.fields[e.get(n)];
        (vo(r) && r.mapValue.fields) ||
          ((r = { mapValue: { fields: {} } }),
          (t.mapValue.fields[e.get(n)] = r)),
          (t = r);
      }
      return t.mapValue.fields;
    }
    applyChanges(e, t, n) {
      Fs(t, (t, n) => (e[t] = n));
      for (const t of n) delete e[t];
    }
    clone() {
      return new Eo(wo(this.value));
    }
  }
  class Io {
    constructor(e, t, n, r, i, s, o) {
      (this.key = e),
        (this.documentType = t),
        (this.version = n),
        (this.readTime = r),
        (this.createTime = i),
        (this.data = s),
        (this.documentState = o);
    }
    static newInvalidDocument(e) {
      return new Io(e, 0, Es.min(), Es.min(), Es.min(), Eo.empty(), 0);
    }
    static newFoundDocument(e, t, n, r) {
      return new Io(e, 1, t, Es.min(), n, r, 0);
    }
    static newNoDocument(e, t) {
      return new Io(e, 2, t, Es.min(), Es.min(), Eo.empty(), 0);
    }
    static newUnknownDocument(e, t) {
      return new Io(e, 3, t, Es.min(), Es.min(), Eo.empty(), 2);
    }
    convertToFoundDocument(e, t) {
      return (
        !this.createTime.isEqual(Es.min()) ||
          (2 !== this.documentType && 0 !== this.documentType) ||
          (this.createTime = e),
        (this.version = e),
        (this.documentType = 1),
        (this.data = t),
        (this.documentState = 0),
        this
      );
    }
    convertToNoDocument(e) {
      return (
        (this.version = e),
        (this.documentType = 2),
        (this.data = Eo.empty()),
        (this.documentState = 0),
        this
      );
    }
    convertToUnknownDocument(e) {
      return (
        (this.version = e),
        (this.documentType = 3),
        (this.data = Eo.empty()),
        (this.documentState = 2),
        this
      );
    }
    setHasCommittedMutations() {
      return (this.documentState = 2), this;
    }
    setHasLocalMutations() {
      return (this.documentState = 1), (this.version = Es.min()), this;
    }
    setReadTime(e) {
      return (this.readTime = e), this;
    }
    get hasLocalMutations() {
      return 1 === this.documentState;
    }
    get hasCommittedMutations() {
      return 2 === this.documentState;
    }
    get hasPendingWrites() {
      return this.hasLocalMutations || this.hasCommittedMutations;
    }
    isValidDocument() {
      return 0 !== this.documentType;
    }
    isFoundDocument() {
      return 1 === this.documentType;
    }
    isNoDocument() {
      return 2 === this.documentType;
    }
    isUnknownDocument() {
      return 3 === this.documentType;
    }
    isEqual(e) {
      return (
        e instanceof Io &&
        this.key.isEqual(e.key) &&
        this.version.isEqual(e.version) &&
        this.documentType === e.documentType &&
        this.documentState === e.documentState &&
        this.data.isEqual(e.data)
      );
    }
    mutableCopy() {
      return new Io(
        this.key,
        this.documentType,
        this.version,
        this.readTime,
        this.createTime,
        this.data.clone(),
        this.documentState
      );
    }
    toString() {
      return `Document(${this.key}, ${this.version}, ${JSON.stringify(
        this.data.value
      )}, {createTime: ${this.createTime}}), {documentType: ${
        this.documentType
      }}), {documentState: ${this.documentState}})`;
    }
  }
  class To {
    constructor(e, t) {
      (this.position = e), (this.inclusive = t);
    }
  }
  function bo(e, t, n) {
    let r = 0;
    for (let i = 0; i < e.position.length; i++) {
      const s = t[i],
        o = e.position[i];
      if (
        ((r = s.field.isKeyField()
          ? Cs.comparator(Cs.fromName(o.referenceValue), n.key)
          : co(o, n.data.field(s.field))),
        "desc" === s.dir && (r *= -1),
        0 !== r)
      )
        break;
    }
    return r;
  }
  function So(e, t) {
    if (null === e) return null === t;
    if (null === t) return !1;
    if (e.inclusive !== t.inclusive || e.position.length !== t.position.length)
      return !1;
    for (let n = 0; n < e.position.length; n++)
      if (!oo(e.position[n], t.position[n])) return !1;
    return !0;
  }
  class Co {
    constructor(e, t = "asc") {
      (this.field = e), (this.dir = t);
    }
  }
  function ko(e, t) {
    return e.dir === t.dir && e.field.isEqual(t.field);
  }
  class Ao {}
  class No extends Ao {
    constructor(e, t, n) {
      super(), (this.field = e), (this.op = t), (this.value = n);
    }
    static create(e, t, n) {
      return e.isKeyField()
        ? "in" === t || "not-in" === t
          ? this.createKeyFieldInFilter(e, t, n)
          : new xo(e, t, n)
        : "array-contains" === t
        ? new jo(e, n)
        : "in" === t
        ? new Bo(e, n)
        : "not-in" === t
        ? new qo(e, n)
        : "array-contains-any" === t
        ? new $o(e, n)
        : new No(e, t, n);
    }
    static createKeyFieldInFilter(e, t, n) {
      return "in" === t ? new Uo(e, n) : new Vo(e, n);
    }
    matches(e) {
      const t = e.data.field(this.field);
      return "!=" === this.op
        ? null !== t && this.matchesComparison(co(t, this.value))
        : null !== t &&
            so(this.value) === so(t) &&
            this.matchesComparison(co(t, this.value));
    }
    matchesComparison(e) {
      switch (this.op) {
        case "<":
          return e < 0;
        case "<=":
          return e <= 0;
        case "==":
          return 0 === e;
        case "!=":
          return 0 !== e;
        case ">":
          return e > 0;
        case ">=":
          return e >= 0;
        default:
          return ns();
      }
    }
    isInequality() {
      return ["<", "<=", ">", ">=", "!=", "not-in"].indexOf(this.op) >= 0;
    }
    getFlattenedFilters() {
      return [this];
    }
    getFilters() {
      return [this];
    }
  }
  class Ro extends Ao {
    constructor(e, t) {
      super(), (this.filters = e), (this.op = t), (this.ue = null);
    }
    static create(e, t) {
      return new Ro(e, t);
    }
    matches(e) {
      return Do(this)
        ? void 0 === this.filters.find((t) => !t.matches(e))
        : void 0 !== this.filters.find((t) => t.matches(e));
    }
    getFlattenedFilters() {
      return (
        null !== this.ue ||
          (this.ue = this.filters.reduce(
            (e, t) => e.concat(t.getFlattenedFilters()),
            []
          )),
        this.ue
      );
    }
    getFilters() {
      return Object.assign([], this.filters);
    }
  }
  function Do(e) {
    return "and" === e.op;
  }
  function Oo(e) {
    return (
      (function (e) {
        for (const t of e.filters) if (t instanceof Ro) return !1;
        return !0;
      })(e) && Do(e)
    );
  }
  function Po(e) {
    if (e instanceof No)
      return e.field.canonicalString() + e.op.toString() + uo(e.value);
    if (Oo(e)) return e.filters.map((e) => Po(e)).join(",");
    {
      const t = e.filters.map((e) => Po(e)).join(",");
      return `${e.op}(${t})`;
    }
  }
  function Lo(e, t) {
    return e instanceof No
      ? (function (e, t) {
          return (
            t instanceof No &&
            e.op === t.op &&
            e.field.isEqual(t.field) &&
            oo(e.value, t.value)
          );
        })(e, t)
      : e instanceof Ro
      ? (function (e, t) {
          return (
            t instanceof Ro &&
            e.op === t.op &&
            e.filters.length === t.filters.length &&
            e.filters.reduce((e, n, r) => e && Lo(n, t.filters[r]), !0)
          );
        })(e, t)
      : void ns();
  }
  function Mo(e) {
    return e instanceof No
      ? (function (e) {
          return `${e.field.canonicalString()} ${e.op} ${uo(e.value)}`;
        })(e)
      : e instanceof Ro
      ? (function (e) {
          return (
            e.op.toString() + " {" + e.getFilters().map(Mo).join(" ,") + "}"
          );
        })(e)
      : "Filter";
  }
  class xo extends No {
    constructor(e, t, n) {
      super(e, t, n), (this.key = Cs.fromName(n.referenceValue));
    }
    matches(e) {
      const t = Cs.comparator(e.key, this.key);
      return this.matchesComparison(t);
    }
  }
  class Uo extends No {
    constructor(e, t) {
      super(e, "in", t), (this.keys = Fo(0, t));
    }
    matches(e) {
      return this.keys.some((t) => t.isEqual(e.key));
    }
  }
  class Vo extends No {
    constructor(e, t) {
      super(e, "not-in", t), (this.keys = Fo(0, t));
    }
    matches(e) {
      return !this.keys.some((t) => t.isEqual(e.key));
    }
  }
  function Fo(e, t) {
    var n;
    return (
      (null === (n = t.arrayValue) || void 0 === n ? void 0 : n.values) || []
    ).map((e) => Cs.fromName(e.referenceValue));
  }
  class jo extends No {
    constructor(e, t) {
      super(e, "array-contains", t);
    }
    matches(e) {
      const t = e.data.field(this.field);
      return go(t) && ao(t.arrayValue, this.value);
    }
  }
  class Bo extends No {
    constructor(e, t) {
      super(e, "in", t);
    }
    matches(e) {
      const t = e.data.field(this.field);
      return null !== t && ao(this.value.arrayValue, t);
    }
  }
  class qo extends No {
    constructor(e, t) {
      super(e, "not-in", t);
    }
    matches(e) {
      if (ao(this.value.arrayValue, { nullValue: "NULL_VALUE" })) return !1;
      const t = e.data.field(this.field);
      return null !== t && !ao(this.value.arrayValue, t);
    }
  }
  class $o extends No {
    constructor(e, t) {
      super(e, "array-contains-any", t);
    }
    matches(e) {
      const t = e.data.field(this.field);
      return (
        !(!go(t) || !t.arrayValue.values) &&
        t.arrayValue.values.some((e) => ao(this.value.arrayValue, e))
      );
    }
  }
  class zo {
    constructor(e, t = null, n = [], r = [], i = null, s = null, o = null) {
      (this.path = e),
        (this.collectionGroup = t),
        (this.orderBy = n),
        (this.filters = r),
        (this.limit = i),
        (this.startAt = s),
        (this.endAt = o),
        (this.ce = null);
    }
  }
  function Ho(e, t = null, n = [], r = [], i = null, s = null, o = null) {
    return new zo(e, t, n, r, i, s, o);
  }
  function Ko(e) {
    const t = is(e);
    if (null === t.ce) {
      let e = t.path.canonicalString();
      null !== t.collectionGroup && (e += "|cg:" + t.collectionGroup),
        (e += "|f:"),
        (e += t.filters.map((e) => Po(e)).join(",")),
        (e += "|ob:"),
        (e += t.orderBy
          .map((e) =>
            (function (e) {
              return e.field.canonicalString() + e.dir;
            })(e)
          )
          .join(",")),
        xs(t.limit) || ((e += "|l:"), (e += t.limit)),
        t.startAt &&
          ((e += "|lb:"),
          (e += t.startAt.inclusive ? "b:" : "a:"),
          (e += t.startAt.position.map((e) => uo(e)).join(","))),
        t.endAt &&
          ((e += "|ub:"),
          (e += t.endAt.inclusive ? "a:" : "b:"),
          (e += t.endAt.position.map((e) => uo(e)).join(","))),
        (t.ce = e);
    }
    return t.ce;
  }
  function Go(e, t) {
    if (e.limit !== t.limit) return !1;
    if (e.orderBy.length !== t.orderBy.length) return !1;
    for (let n = 0; n < e.orderBy.length; n++)
      if (!ko(e.orderBy[n], t.orderBy[n])) return !1;
    if (e.filters.length !== t.filters.length) return !1;
    for (let n = 0; n < e.filters.length; n++)
      if (!Lo(e.filters[n], t.filters[n])) return !1;
    return (
      e.collectionGroup === t.collectionGroup &&
      !!e.path.isEqual(t.path) &&
      !!So(e.startAt, t.startAt) &&
      So(e.endAt, t.endAt)
    );
  }
  function Wo(e) {
    return (
      Cs.isDocumentKey(e.path) &&
      null === e.collectionGroup &&
      0 === e.filters.length
    );
  }
  class Qo {
    constructor(
      e,
      t = null,
      n = [],
      r = [],
      i = null,
      s = "F",
      o = null,
      a = null
    ) {
      (this.path = e),
        (this.collectionGroup = t),
        (this.explicitOrderBy = n),
        (this.filters = r),
        (this.limit = i),
        (this.limitType = s),
        (this.startAt = o),
        (this.endAt = a),
        (this.le = null),
        (this.he = null),
        (this.Pe = null),
        this.startAt,
        this.endAt;
    }
  }
  function Xo(e) {
    return new Qo(e);
  }
  function Jo(e) {
    return (
      0 === e.filters.length &&
      null === e.limit &&
      null == e.startAt &&
      null == e.endAt &&
      (0 === e.explicitOrderBy.length ||
        (1 === e.explicitOrderBy.length &&
          e.explicitOrderBy[0].field.isKeyField()))
    );
  }
  function Yo(e) {
    return null !== e.collectionGroup;
  }
  function Zo(e) {
    const t = is(e);
    if (null === t.le) {
      t.le = [];
      const e = new Set();
      for (const n of t.explicitOrderBy)
        t.le.push(n), e.add(n.field.canonicalString());
      const n =
          t.explicitOrderBy.length > 0
            ? t.explicitOrderBy[t.explicitOrderBy.length - 1].dir
            : "asc",
        r = (function (e) {
          let t = new zs(Ss.comparator);
          return (
            e.filters.forEach((e) => {
              e.getFlattenedFilters().forEach((e) => {
                e.isInequality() && (t = t.add(e.field));
              });
            }),
            t
          );
        })(t);
      r.forEach((r) => {
        e.has(r.canonicalString()) || r.isKeyField() || t.le.push(new Co(r, n));
      }),
        e.has(Ss.keyField().canonicalString()) ||
          t.le.push(new Co(Ss.keyField(), n));
    }
    return t.le;
  }
  function ea(e) {
    const t = is(e);
    return (
      t.he ||
        (t.he = (function (e, t) {
          if ("F" === e.limitType)
            return Ho(
              e.path,
              e.collectionGroup,
              t,
              e.filters,
              e.limit,
              e.startAt,
              e.endAt
            );
          {
            t = t.map((e) => {
              const t = "desc" === e.dir ? "asc" : "desc";
              return new Co(e.field, t);
            });
            const n = e.endAt
                ? new To(e.endAt.position, e.endAt.inclusive)
                : null,
              r = e.startAt
                ? new To(e.startAt.position, e.startAt.inclusive)
                : null;
            return Ho(e.path, e.collectionGroup, t, e.filters, e.limit, n, r);
          }
        })(t, Zo(e))),
      t.he
    );
  }
  function ta(e, t) {
    const n = e.filters.concat([t]);
    return new Qo(
      e.path,
      e.collectionGroup,
      e.explicitOrderBy.slice(),
      n,
      e.limit,
      e.limitType,
      e.startAt,
      e.endAt
    );
  }
  function na(e, t, n) {
    return new Qo(
      e.path,
      e.collectionGroup,
      e.explicitOrderBy.slice(),
      e.filters.slice(),
      t,
      n,
      e.startAt,
      e.endAt
    );
  }
  function ra(e, t) {
    return Go(ea(e), ea(t)) && e.limitType === t.limitType;
  }
  function ia(e) {
    return `${Ko(ea(e))}|lt:${e.limitType}`;
  }
  function sa(e) {
    return `Query(target=${(function (e) {
      let t = e.path.canonicalString();
      return (
        null !== e.collectionGroup &&
          (t += " collectionGroup=" + e.collectionGroup),
        e.filters.length > 0 &&
          (t += `, filters: [${e.filters.map((e) => Mo(e)).join(", ")}]`),
        xs(e.limit) || (t += ", limit: " + e.limit),
        e.orderBy.length > 0 &&
          (t += `, orderBy: [${e.orderBy
            .map((e) =>
              (function (e) {
                return `${e.field.canonicalString()} (${e.dir})`;
              })(e)
            )
            .join(", ")}]`),
        e.startAt &&
          ((t += ", startAt: "),
          (t += e.startAt.inclusive ? "b:" : "a:"),
          (t += e.startAt.position.map((e) => uo(e)).join(","))),
        e.endAt &&
          ((t += ", endAt: "),
          (t += e.endAt.inclusive ? "a:" : "b:"),
          (t += e.endAt.position.map((e) => uo(e)).join(","))),
        `Target(${t})`
      );
    })(ea(e))}; limitType=${e.limitType})`;
  }
  function oa(e, t) {
    return (
      t.isFoundDocument() &&
      (function (e, t) {
        const n = t.key.path;
        return null !== e.collectionGroup
          ? t.key.hasCollectionId(e.collectionGroup) && e.path.isPrefixOf(n)
          : Cs.isDocumentKey(e.path)
          ? e.path.isEqual(n)
          : e.path.isImmediateParentOf(n);
      })(e, t) &&
      (function (e, t) {
        for (const n of Zo(e))
          if (!n.field.isKeyField() && null === t.data.field(n.field))
            return !1;
        return !0;
      })(e, t) &&
      (function (e, t) {
        for (const n of e.filters) if (!n.matches(t)) return !1;
        return !0;
      })(e, t) &&
      (function (e, t) {
        return !(
          (e.startAt &&
            !(function (e, t, n) {
              const r = bo(e, t, n);
              return e.inclusive ? r <= 0 : r < 0;
            })(e.startAt, Zo(e), t)) ||
          (e.endAt &&
            !(function (e, t, n) {
              const r = bo(e, t, n);
              return e.inclusive ? r >= 0 : r > 0;
            })(e.endAt, Zo(e), t))
        );
      })(e, t)
    );
  }
  function aa(e) {
    return (t, n) => {
      let r = !1;
      for (const i of Zo(e)) {
        const e = ca(i, t, n);
        if (0 !== e) return e;
        r = r || i.field.isKeyField();
      }
      return 0;
    };
  }
  function ca(e, t, n) {
    const r = e.field.isKeyField()
      ? Cs.comparator(t.key, n.key)
      : (function (e, t, n) {
          const r = t.data.field(e),
            i = n.data.field(e);
          return null !== r && null !== i ? co(r, i) : ns();
        })(e.field, t, n);
    switch (e.dir) {
      case "asc":
        return r;
      case "desc":
        return -1 * r;
      default:
        return ns();
    }
  }
  class ha {
    constructor(e, t) {
      (this.mapKeyFn = e),
        (this.equalsFn = t),
        (this.inner = {}),
        (this.innerSize = 0);
    }
    get(e) {
      const t = this.mapKeyFn(e),
        n = this.inner[t];
      if (void 0 !== n)
        for (const [t, r] of n) if (this.equalsFn(t, e)) return r;
    }
    has(e) {
      return void 0 !== this.get(e);
    }
    set(e, t) {
      const n = this.mapKeyFn(e),
        r = this.inner[n];
      if (void 0 === r)
        return (this.inner[n] = [[e, t]]), void this.innerSize++;
      for (let n = 0; n < r.length; n++)
        if (this.equalsFn(r[n][0], e)) return void (r[n] = [e, t]);
      r.push([e, t]), this.innerSize++;
    }
    delete(e) {
      const t = this.mapKeyFn(e),
        n = this.inner[t];
      if (void 0 === n) return !1;
      for (let r = 0; r < n.length; r++)
        if (this.equalsFn(n[r][0], e))
          return (
            1 === n.length ? delete this.inner[t] : n.splice(r, 1),
            this.innerSize--,
            !0
          );
      return !1;
    }
    forEach(e) {
      Fs(this.inner, (t, n) => {
        for (const [t, r] of n) e(t, r);
      });
    }
    isEmpty() {
      return js(this.inner);
    }
    size() {
      return this.innerSize;
    }
  }
  const ua = new Bs(Cs.comparator);
  function la() {
    return ua;
  }
  const da = new Bs(Cs.comparator);
  function fa(...e) {
    let t = da;
    for (const n of e) t = t.insert(n.key, n);
    return t;
  }
  function pa(e) {
    let t = da;
    return e.forEach((e, n) => (t = t.insert(e, n.overlayedDocument))), t;
  }
  function ga() {
    return ya();
  }
  function ma() {
    return ya();
  }
  function ya() {
    return new ha(
      (e) => e.toString(),
      (e, t) => e.isEqual(t)
    );
  }
  new Bs(Cs.comparator);
  const va = new zs(Cs.comparator);
  function wa(...e) {
    let t = va;
    for (const n of e) t = t.add(n);
    return t;
  }
  const _a = new zs(vs);
  function Ea(e, t) {
    if (e.useProto3Json) {
      if (isNaN(t)) return { doubleValue: "NaN" };
      if (t === 1 / 0) return { doubleValue: "Infinity" };
      if (t === -1 / 0) return { doubleValue: "-Infinity" };
    }
    return { doubleValue: Us(t) ? "-0" : t };
  }
  function Ia(e) {
    return { integerValue: "" + e };
  }
  function Ta(e, t) {
    return (function (e) {
      return (
        "number" == typeof e &&
        Number.isInteger(e) &&
        !Us(e) &&
        e <= Number.MAX_SAFE_INTEGER &&
        e >= Number.MIN_SAFE_INTEGER
      );
    })(t)
      ? Ia(t)
      : Ea(e, t);
  }
  class ba {
    constructor() {
      this._ = void 0;
    }
  }
  function Sa(e, t, n) {
    return e instanceof ka
      ? (function (e, t) {
          const n = {
            fields: {
              __type__: { stringValue: "server_timestamp" },
              __local_write_time__: {
                timestampValue: { seconds: e.seconds, nanos: e.nanoseconds },
              },
            },
          };
          return (
            t && Zs(t) && (t = eo(t)),
            t && (n.fields.__previous_value__ = t),
            { mapValue: n }
          );
        })(n, t)
      : e instanceof Aa
      ? Na(e, t)
      : e instanceof Ra
      ? Da(e, t)
      : (function (e, t) {
          const n = (function (e, t) {
              return e instanceof Oa
                ? (function (e) {
                    return (
                      po(e) ||
                      (function (e) {
                        return !!e && "doubleValue" in e;
                      })(e)
                    );
                  })(t)
                  ? t
                  : { integerValue: 0 }
                : null;
            })(e, t),
            r = Pa(n) + Pa(e.Ie);
          return po(n) && po(e.Ie) ? Ia(r) : Ea(e.serializer, r);
        })(e, t);
  }
  function Ca(e, t, n) {
    return e instanceof Aa ? Na(e, t) : e instanceof Ra ? Da(e, t) : n;
  }
  class ka extends ba {}
  class Aa extends ba {
    constructor(e) {
      super(), (this.elements = e);
    }
  }
  function Na(e, t) {
    const n = La(t);
    for (const t of e.elements) n.some((e) => oo(e, t)) || n.push(t);
    return { arrayValue: { values: n } };
  }
  class Ra extends ba {
    constructor(e) {
      super(), (this.elements = e);
    }
  }
  function Da(e, t) {
    let n = La(t);
    for (const t of e.elements) n = n.filter((e) => !oo(e, t));
    return { arrayValue: { values: n } };
  }
  class Oa extends ba {
    constructor(e, t) {
      super(), (this.serializer = e), (this.Ie = t);
    }
  }
  function Pa(e) {
    return Js(e.integerValue || e.doubleValue);
  }
  function La(e) {
    return go(e) && e.arrayValue.values ? e.arrayValue.values.slice() : [];
  }
  class Ma {
    constructor(e, t) {
      (this.updateTime = e), (this.exists = t);
    }
    static none() {
      return new Ma();
    }
    static exists(e) {
      return new Ma(void 0, e);
    }
    static updateTime(e) {
      return new Ma(e);
    }
    get isNone() {
      return void 0 === this.updateTime && void 0 === this.exists;
    }
    isEqual(e) {
      return (
        this.exists === e.exists &&
        (this.updateTime
          ? !!e.updateTime && this.updateTime.isEqual(e.updateTime)
          : !e.updateTime)
      );
    }
  }
  function xa(e, t) {
    return void 0 !== e.updateTime
      ? t.isFoundDocument() && t.version.isEqual(e.updateTime)
      : void 0 === e.exists || e.exists === t.isFoundDocument();
  }
  class Ua {}
  function Va(e, t) {
    if (!e.hasLocalMutations || (t && 0 === t.fields.length)) return null;
    if (null === t)
      return e.isNoDocument()
        ? new Ga(e.key, Ma.none())
        : new qa(e.key, e.data, Ma.none());
    {
      const n = e.data,
        r = Eo.empty();
      let i = new zs(Ss.comparator);
      for (let e of t.fields)
        if (!i.has(e)) {
          let t = n.field(e);
          null === t && e.length > 1 && ((e = e.popLast()), (t = n.field(e))),
            null === t ? r.delete(e) : r.set(e, t),
            (i = i.add(e));
        }
      return new $a(e.key, r, new Ks(i.toArray()), Ma.none());
    }
  }
  function Fa(e, t, n) {
    e instanceof qa
      ? (function (e, t, n) {
          const r = e.value.clone(),
            i = Ha(e.fieldTransforms, t, n.transformResults);
          r.setAll(i),
            t.convertToFoundDocument(n.version, r).setHasCommittedMutations();
        })(e, t, n)
      : e instanceof $a
      ? (function (e, t, n) {
          if (!xa(e.precondition, t))
            return void t.convertToUnknownDocument(n.version);
          const r = Ha(e.fieldTransforms, t, n.transformResults),
            i = t.data;
          i.setAll(za(e)),
            i.setAll(r),
            t.convertToFoundDocument(n.version, i).setHasCommittedMutations();
        })(e, t, n)
      : (function (e, t, n) {
          t.convertToNoDocument(n.version).setHasCommittedMutations();
        })(0, t, n);
  }
  function ja(e, t, n, r) {
    return e instanceof qa
      ? (function (e, t, n, r) {
          if (!xa(e.precondition, t)) return n;
          const i = e.value.clone(),
            s = Ka(e.fieldTransforms, r, t);
          return (
            i.setAll(s),
            t.convertToFoundDocument(t.version, i).setHasLocalMutations(),
            null
          );
        })(e, t, n, r)
      : e instanceof $a
      ? (function (e, t, n, r) {
          if (!xa(e.precondition, t)) return n;
          const i = Ka(e.fieldTransforms, r, t),
            s = t.data;
          return (
            s.setAll(za(e)),
            s.setAll(i),
            t.convertToFoundDocument(t.version, s).setHasLocalMutations(),
            null === n
              ? null
              : n
                  .unionWith(e.fieldMask.fields)
                  .unionWith(e.fieldTransforms.map((e) => e.field))
          );
        })(e, t, n, r)
      : (function (e, t, n) {
          return xa(e.precondition, t)
            ? (t.convertToNoDocument(t.version).setHasLocalMutations(), null)
            : n;
        })(e, t, n);
  }
  function Ba(e, t) {
    return (
      e.type === t.type &&
      !!e.key.isEqual(t.key) &&
      !!e.precondition.isEqual(t.precondition) &&
      !!(function (e, t) {
        return (
          (void 0 === e && void 0 === t) ||
          (!(!e || !t) &&
            ws(e, t, (e, t) =>
              (function (e, t) {
                return (
                  e.field.isEqual(t.field) &&
                  (function (e, t) {
                    return (e instanceof Aa && t instanceof Aa) ||
                      (e instanceof Ra && t instanceof Ra)
                      ? ws(e.elements, t.elements, oo)
                      : e instanceof Oa && t instanceof Oa
                      ? oo(e.Ie, t.Ie)
                      : e instanceof ka && t instanceof ka;
                  })(e.transform, t.transform)
                );
              })(e, t)
            ))
        );
      })(e.fieldTransforms, t.fieldTransforms) &&
      (0 === e.type
        ? e.value.isEqual(t.value)
        : 1 !== e.type ||
          (e.data.isEqual(t.data) && e.fieldMask.isEqual(t.fieldMask)))
    );
  }
  class qa extends Ua {
    constructor(e, t, n, r = []) {
      super(),
        (this.key = e),
        (this.value = t),
        (this.precondition = n),
        (this.fieldTransforms = r),
        (this.type = 0);
    }
    getFieldMask() {
      return null;
    }
  }
  class $a extends Ua {
    constructor(e, t, n, r, i = []) {
      super(),
        (this.key = e),
        (this.data = t),
        (this.fieldMask = n),
        (this.precondition = r),
        (this.fieldTransforms = i),
        (this.type = 1);
    }
    getFieldMask() {
      return this.fieldMask;
    }
  }
  function za(e) {
    const t = new Map();
    return (
      e.fieldMask.fields.forEach((n) => {
        if (!n.isEmpty()) {
          const r = e.data.field(n);
          t.set(n, r);
        }
      }),
      t
    );
  }
  function Ha(e, t, n) {
    const r = new Map();
    rs(e.length === n.length);
    for (let i = 0; i < n.length; i++) {
      const s = e[i],
        o = s.transform,
        a = t.data.field(s.field);
      r.set(s.field, Ca(o, a, n[i]));
    }
    return r;
  }
  function Ka(e, t, n) {
    const r = new Map();
    for (const i of e) {
      const e = i.transform,
        s = n.data.field(i.field);
      r.set(i.field, Sa(e, s, t));
    }
    return r;
  }
  class Ga extends Ua {
    constructor(e, t) {
      super(),
        (this.key = e),
        (this.precondition = t),
        (this.type = 2),
        (this.fieldTransforms = []);
    }
    getFieldMask() {
      return null;
    }
  }
  class Wa {
    constructor(e, t, n, r) {
      (this.batchId = e),
        (this.localWriteTime = t),
        (this.baseMutations = n),
        (this.mutations = r);
    }
    applyToRemoteDocument(e, t) {
      const n = t.mutationResults;
      for (let t = 0; t < this.mutations.length; t++) {
        const r = this.mutations[t];
        r.key.isEqual(e.key) && Fa(r, e, n[t]);
      }
    }
    applyToLocalView(e, t) {
      for (const n of this.baseMutations)
        n.key.isEqual(e.key) && (t = ja(n, e, t, this.localWriteTime));
      for (const n of this.mutations)
        n.key.isEqual(e.key) && (t = ja(n, e, t, this.localWriteTime));
      return t;
    }
    applyToLocalDocumentSet(e, t) {
      const n = ma();
      return (
        this.mutations.forEach((r) => {
          const i = e.get(r.key),
            s = i.overlayedDocument;
          let o = this.applyToLocalView(s, i.mutatedFields);
          o = t.has(r.key) ? null : o;
          const a = Va(s, o);
          null !== a && n.set(r.key, a),
            s.isValidDocument() || s.convertToNoDocument(Es.min());
        }),
        n
      );
    }
    keys() {
      return this.mutations.reduce((e, t) => e.add(t.key), wa());
    }
    isEqual(e) {
      return (
        this.batchId === e.batchId &&
        ws(this.mutations, e.mutations, (e, t) => Ba(e, t)) &&
        ws(this.baseMutations, e.baseMutations, (e, t) => Ba(e, t))
      );
    }
  }
  class Qa {
    constructor(e, t) {
      (this.largestBatchId = e), (this.mutation = t);
    }
    getKey() {
      return this.mutation.key;
    }
    isEqual(e) {
      return null !== e && this.mutation === e.mutation;
    }
    toString() {
      return `Overlay{\n      largestBatchId: ${
        this.largestBatchId
      },\n      mutation: ${this.mutation.toString()}\n    }`;
    }
  }
  class Xa {
    constructor(e, t) {
      (this.count = e), (this.unchangedNames = t);
    }
  }
  var Ja, Ya;
  function Za(e) {
    if (void 0 === e) return Zi("GRPC error has no .code"), ss.UNKNOWN;
    switch (e) {
      case Ja.OK:
        return ss.OK;
      case Ja.CANCELLED:
        return ss.CANCELLED;
      case Ja.UNKNOWN:
        return ss.UNKNOWN;
      case Ja.DEADLINE_EXCEEDED:
        return ss.DEADLINE_EXCEEDED;
      case Ja.RESOURCE_EXHAUSTED:
        return ss.RESOURCE_EXHAUSTED;
      case Ja.INTERNAL:
        return ss.INTERNAL;
      case Ja.UNAVAILABLE:
        return ss.UNAVAILABLE;
      case Ja.UNAUTHENTICATED:
        return ss.UNAUTHENTICATED;
      case Ja.INVALID_ARGUMENT:
        return ss.INVALID_ARGUMENT;
      case Ja.NOT_FOUND:
        return ss.NOT_FOUND;
      case Ja.ALREADY_EXISTS:
        return ss.ALREADY_EXISTS;
      case Ja.PERMISSION_DENIED:
        return ss.PERMISSION_DENIED;
      case Ja.FAILED_PRECONDITION:
        return ss.FAILED_PRECONDITION;
      case Ja.ABORTED:
        return ss.ABORTED;
      case Ja.OUT_OF_RANGE:
        return ss.OUT_OF_RANGE;
      case Ja.UNIMPLEMENTED:
        return ss.UNIMPLEMENTED;
      case Ja.DATA_LOSS:
        return ss.DATA_LOSS;
      default:
        return ns();
    }
  }
  ((Ya = Ja || (Ja = {}))[(Ya.OK = 0)] = "OK"),
    (Ya[(Ya.CANCELLED = 1)] = "CANCELLED"),
    (Ya[(Ya.UNKNOWN = 2)] = "UNKNOWN"),
    (Ya[(Ya.INVALID_ARGUMENT = 3)] = "INVALID_ARGUMENT"),
    (Ya[(Ya.DEADLINE_EXCEEDED = 4)] = "DEADLINE_EXCEEDED"),
    (Ya[(Ya.NOT_FOUND = 5)] = "NOT_FOUND"),
    (Ya[(Ya.ALREADY_EXISTS = 6)] = "ALREADY_EXISTS"),
    (Ya[(Ya.PERMISSION_DENIED = 7)] = "PERMISSION_DENIED"),
    (Ya[(Ya.UNAUTHENTICATED = 16)] = "UNAUTHENTICATED"),
    (Ya[(Ya.RESOURCE_EXHAUSTED = 8)] = "RESOURCE_EXHAUSTED"),
    (Ya[(Ya.FAILED_PRECONDITION = 9)] = "FAILED_PRECONDITION"),
    (Ya[(Ya.ABORTED = 10)] = "ABORTED"),
    (Ya[(Ya.OUT_OF_RANGE = 11)] = "OUT_OF_RANGE"),
    (Ya[(Ya.UNIMPLEMENTED = 12)] = "UNIMPLEMENTED"),
    (Ya[(Ya.INTERNAL = 13)] = "INTERNAL"),
    (Ya[(Ya.UNAVAILABLE = 14)] = "UNAVAILABLE"),
    (Ya[(Ya.DATA_LOSS = 15)] = "DATA_LOSS");
  const ec = new Ki([4294967295, 4294967295], 0);
  function tc(e) {
    const t = new TextEncoder().encode(e),
      n = new Hi();
    return n.update(t), new Uint8Array(n.digest());
  }
  function nc(e) {
    const t = new DataView(e.buffer),
      n = t.getUint32(0, !0),
      r = t.getUint32(4, !0),
      i = t.getUint32(8, !0),
      s = t.getUint32(12, !0);
    return [new Ki([n, r], 0), new Ki([i, s], 0)];
  }
  class rc {
    constructor(e, t, n) {
      if (
        ((this.bitmap = e),
        (this.padding = t),
        (this.hashCount = n),
        t < 0 || t >= 8)
      )
        throw new ic(`Invalid padding: ${t}`);
      if (n < 0) throw new ic(`Invalid hash count: ${n}`);
      if (e.length > 0 && 0 === this.hashCount)
        throw new ic(`Invalid hash count: ${n}`);
      if (0 === e.length && 0 !== t)
        throw new ic(`Invalid padding when bitmap length is 0: ${t}`);
      (this.Te = 8 * e.length - t), (this.Ee = Ki.fromNumber(this.Te));
    }
    de(e, t, n) {
      let r = e.add(t.multiply(Ki.fromNumber(n)));
      return (
        1 === r.compare(ec) && (r = new Ki([r.getBits(0), r.getBits(1)], 0)),
        r.modulo(this.Ee).toNumber()
      );
    }
    Ae(e) {
      return 0 != (this.bitmap[Math.floor(e / 8)] & (1 << e % 8));
    }
    mightContain(e) {
      if (0 === this.Te) return !1;
      const t = tc(e),
        [n, r] = nc(t);
      for (let e = 0; e < this.hashCount; e++) {
        const t = this.de(n, r, e);
        if (!this.Ae(t)) return !1;
      }
      return !0;
    }
    static create(e, t, n) {
      const r = e % 8 == 0 ? 0 : 8 - (e % 8),
        i = new Uint8Array(Math.ceil(e / 8)),
        s = new rc(i, r, t);
      return n.forEach((e) => s.insert(e)), s;
    }
    insert(e) {
      if (0 === this.Te) return;
      const t = tc(e),
        [n, r] = nc(t);
      for (let e = 0; e < this.hashCount; e++) {
        const t = this.de(n, r, e);
        this.Re(t);
      }
    }
    Re(e) {
      const t = Math.floor(e / 8),
        n = e % 8;
      this.bitmap[t] |= 1 << n;
    }
  }
  class ic extends Error {
    constructor() {
      super(...arguments), (this.name = "BloomFilterError");
    }
  }
  class sc {
    constructor(e, t, n, r, i) {
      (this.snapshotVersion = e),
        (this.targetChanges = t),
        (this.targetMismatches = n),
        (this.documentUpdates = r),
        (this.resolvedLimboDocuments = i);
    }
    static createSynthesizedRemoteEventForCurrentChange(e, t, n) {
      const r = new Map();
      return (
        r.set(e, oc.createSynthesizedTargetChangeForCurrentChange(e, t, n)),
        new sc(Es.min(), r, new Bs(vs), la(), wa())
      );
    }
  }
  class oc {
    constructor(e, t, n, r, i) {
      (this.resumeToken = e),
        (this.current = t),
        (this.addedDocuments = n),
        (this.modifiedDocuments = r),
        (this.removedDocuments = i);
    }
    static createSynthesizedTargetChangeForCurrentChange(e, t, n) {
      return new oc(n, t, wa(), wa(), wa());
    }
  }
  class ac {
    constructor(e, t, n, r) {
      (this.Ve = e), (this.removedTargetIds = t), (this.key = n), (this.me = r);
    }
  }
  class cc {
    constructor(e, t) {
      (this.targetId = e), (this.fe = t);
    }
  }
  class hc {
    constructor(e, t, n = Ws.EMPTY_BYTE_STRING, r = null) {
      (this.state = e),
        (this.targetIds = t),
        (this.resumeToken = n),
        (this.cause = r);
    }
  }
  class uc {
    constructor() {
      (this.ge = 0),
        (this.pe = fc()),
        (this.ye = Ws.EMPTY_BYTE_STRING),
        (this.we = !1),
        (this.Se = !0);
    }
    get current() {
      return this.we;
    }
    get resumeToken() {
      return this.ye;
    }
    get be() {
      return 0 !== this.ge;
    }
    get De() {
      return this.Se;
    }
    Ce(e) {
      e.approximateByteSize() > 0 && ((this.Se = !0), (this.ye = e));
    }
    ve() {
      let e = wa(),
        t = wa(),
        n = wa();
      return (
        this.pe.forEach((r, i) => {
          switch (i) {
            case 0:
              e = e.add(r);
              break;
            case 2:
              t = t.add(r);
              break;
            case 1:
              n = n.add(r);
              break;
            default:
              ns();
          }
        }),
        new oc(this.ye, this.we, e, t, n)
      );
    }
    Fe() {
      (this.Se = !1), (this.pe = fc());
    }
    Me(e, t) {
      (this.Se = !0), (this.pe = this.pe.insert(e, t));
    }
    xe(e) {
      (this.Se = !0), (this.pe = this.pe.remove(e));
    }
    Oe() {
      this.ge += 1;
    }
    Ne() {
      this.ge -= 1;
    }
    Be() {
      (this.Se = !0), (this.we = !0);
    }
  }
  class lc {
    constructor(e) {
      (this.Le = e),
        (this.ke = new Map()),
        (this.qe = la()),
        (this.Qe = dc()),
        (this.Ke = new Bs(vs));
    }
    $e(e) {
      for (const t of e.Ve)
        e.me && e.me.isFoundDocument()
          ? this.Ue(t, e.me)
          : this.We(t, e.key, e.me);
      for (const t of e.removedTargetIds) this.We(t, e.key, e.me);
    }
    Ge(e) {
      this.forEachTarget(e, (t) => {
        const n = this.ze(t);
        switch (e.state) {
          case 0:
            this.je(t) && n.Ce(e.resumeToken);
            break;
          case 1:
            n.Ne(), n.be || n.Fe(), n.Ce(e.resumeToken);
            break;
          case 2:
            n.Ne(), n.be || this.removeTarget(t);
            break;
          case 3:
            this.je(t) && (n.Be(), n.Ce(e.resumeToken));
            break;
          case 4:
            this.je(t) && (this.He(t), n.Ce(e.resumeToken));
            break;
          default:
            ns();
        }
      });
    }
    forEachTarget(e, t) {
      e.targetIds.length > 0
        ? e.targetIds.forEach(t)
        : this.ke.forEach((e, n) => {
            this.je(n) && t(n);
          });
    }
    Je(e) {
      const t = e.targetId,
        n = e.fe.count,
        r = this.Ye(t);
      if (r) {
        const i = r.target;
        if (Wo(i))
          if (0 === n) {
            const e = new Cs(i.path);
            this.We(t, e, Io.newNoDocument(e, Es.min()));
          } else rs(1 === n);
        else {
          const r = this.Ze(t);
          if (r !== n) {
            const n = this.Xe(e),
              i = n ? this.et(n, e, r) : 1;
            if (0 !== i) {
              this.He(t);
              const e =
                2 === i
                  ? "TargetPurposeExistenceFilterMismatchBloom"
                  : "TargetPurposeExistenceFilterMismatch";
              this.Ke = this.Ke.insert(t, e);
            }
          }
        }
      }
    }
    Xe(e) {
      const t = e.fe.unchangedNames;
      if (!t || !t.bits) return null;
      const {
        bits: { bitmap: n = "", padding: r = 0 },
        hashCount: i = 0,
      } = t;
      let s, o;
      try {
        s = Ys(n).toUint8Array();
      } catch (e) {
        if (e instanceof Gs)
          return (
            es(
              "Decoding the base64 bloom filter in existence filter failed (" +
                e.message +
                "); ignoring the bloom filter and falling back to full re-query."
            ),
            null
          );
        throw e;
      }
      try {
        o = new rc(s, r, i);
      } catch (e) {
        return (
          es(
            e instanceof ic
              ? "BloomFilter error: "
              : "Applying bloom filter failed: ",
            e
          ),
          null
        );
      }
      return 0 === o.Te ? null : o;
    }
    et(e, t, n) {
      return t.fe.count === n - this.rt(e, t.targetId) ? 0 : 2;
    }
    rt(e, t) {
      const n = this.Le.getRemoteKeysForTarget(t);
      let r = 0;
      return (
        n.forEach((n) => {
          const i = this.Le.nt(),
            s = `projects/${i.projectId}/databases/${
              i.database
            }/documents/${n.path.canonicalString()}`;
          e.mightContain(s) || (this.We(t, n, null), r++);
        }),
        r
      );
    }
    it(e) {
      const t = new Map();
      this.ke.forEach((n, r) => {
        const i = this.Ye(r);
        if (i) {
          if (n.current && Wo(i.target)) {
            const t = new Cs(i.target.path);
            null !== this.qe.get(t) ||
              this.st(r, t) ||
              this.We(r, t, Io.newNoDocument(t, e));
          }
          n.De && (t.set(r, n.ve()), n.Fe());
        }
      });
      let n = wa();
      this.Qe.forEach((e, t) => {
        let r = !0;
        t.forEachWhile((e) => {
          const t = this.Ye(e);
          return (
            !t || "TargetPurposeLimboResolution" === t.purpose || ((r = !1), !1)
          );
        }),
          r && (n = n.add(e));
      }),
        this.qe.forEach((t, n) => n.setReadTime(e));
      const r = new sc(e, t, this.Ke, this.qe, n);
      return (this.qe = la()), (this.Qe = dc()), (this.Ke = new Bs(vs)), r;
    }
    Ue(e, t) {
      if (!this.je(e)) return;
      const n = this.st(e, t.key) ? 2 : 0;
      this.ze(e).Me(t.key, n),
        (this.qe = this.qe.insert(t.key, t)),
        (this.Qe = this.Qe.insert(t.key, this.ot(t.key).add(e)));
    }
    We(e, t, n) {
      if (!this.je(e)) return;
      const r = this.ze(e);
      this.st(e, t) ? r.Me(t, 1) : r.xe(t),
        (this.Qe = this.Qe.insert(t, this.ot(t).delete(e))),
        n && (this.qe = this.qe.insert(t, n));
    }
    removeTarget(e) {
      this.ke.delete(e);
    }
    Ze(e) {
      const t = this.ze(e).ve();
      return (
        this.Le.getRemoteKeysForTarget(e).size +
        t.addedDocuments.size -
        t.removedDocuments.size
      );
    }
    Oe(e) {
      this.ze(e).Oe();
    }
    ze(e) {
      let t = this.ke.get(e);
      return t || ((t = new uc()), this.ke.set(e, t)), t;
    }
    ot(e) {
      let t = this.Qe.get(e);
      return t || ((t = new zs(vs)), (this.Qe = this.Qe.insert(e, t))), t;
    }
    je(e) {
      const t = null !== this.Ye(e);
      return t || Yi("WatchChangeAggregator", "Detected inactive target", e), t;
    }
    Ye(e) {
      const t = this.ke.get(e);
      return t && t.be ? null : this.Le._t(e);
    }
    He(e) {
      this.ke.set(e, new uc()),
        this.Le.getRemoteKeysForTarget(e).forEach((t) => {
          this.We(e, t, null);
        });
    }
    st(e, t) {
      return this.Le.getRemoteKeysForTarget(e).has(t);
    }
  }
  function dc() {
    return new Bs(Cs.comparator);
  }
  function fc() {
    return new Bs(Cs.comparator);
  }
  const pc = { asc: "ASCENDING", desc: "DESCENDING" },
    gc = {
      "<": "LESS_THAN",
      "<=": "LESS_THAN_OR_EQUAL",
      ">": "GREATER_THAN",
      ">=": "GREATER_THAN_OR_EQUAL",
      "==": "EQUAL",
      "!=": "NOT_EQUAL",
      "array-contains": "ARRAY_CONTAINS",
      in: "IN",
      "not-in": "NOT_IN",
      "array-contains-any": "ARRAY_CONTAINS_ANY",
    },
    mc = { and: "AND", or: "OR" };
  class yc {
    constructor(e, t) {
      (this.databaseId = e), (this.useProto3Json = t);
    }
  }
  function vc(e, t) {
    return e.useProto3Json || xs(t) ? t : { value: t };
  }
  function wc(e, t) {
    return e.useProto3Json
      ? `${new Date(1e3 * t.seconds)
          .toISOString()
          .replace(/\.\d*/, "")
          .replace("Z", "")}.${("000000000" + t.nanoseconds).slice(-9)}Z`
      : { seconds: "" + t.seconds, nanos: t.nanoseconds };
  }
  function _c(e, t) {
    return e.useProto3Json ? t.toBase64() : t.toUint8Array();
  }
  function Ec(e) {
    return (
      rs(!!e),
      Es.fromTimestamp(
        (function (e) {
          const t = Xs(e);
          return new _s(t.seconds, t.nanos);
        })(e)
      )
    );
  }
  function Ic(e, t) {
    return (function (e) {
      return new Ts(["projects", e.projectId, "databases", e.database]);
    })(e)
      .child("documents")
      .child(t)
      .canonicalString();
  }
  function Tc(e) {
    const t = Ts.fromString(e);
    return rs(Vc(t)), t;
  }
  function bc(e, t) {
    const n = Tc(t);
    if (n.get(1) !== e.databaseId.projectId)
      throw new os(
        ss.INVALID_ARGUMENT,
        "Tried to deserialize key from different project: " +
          n.get(1) +
          " vs " +
          e.databaseId.projectId
      );
    if (n.get(3) !== e.databaseId.database)
      throw new os(
        ss.INVALID_ARGUMENT,
        "Tried to deserialize key from different database: " +
          n.get(3) +
          " vs " +
          e.databaseId.database
      );
    return new Cs(kc(n));
  }
  function Sc(e, t) {
    return Ic(e.databaseId, t);
  }
  function Cc(e) {
    return new Ts([
      "projects",
      e.databaseId.projectId,
      "databases",
      e.databaseId.database,
    ]).canonicalString();
  }
  function kc(e) {
    return rs(e.length > 4 && "documents" === e.get(4)), e.popFirst(5);
  }
  function Ac(e, t) {
    return { documents: [Sc(e, t.path)] };
  }
  function Nc(e, t) {
    const n = { structuredQuery: {} },
      r = t.path;
    null !== t.collectionGroup
      ? ((n.parent = Sc(e, r)),
        (n.structuredQuery.from = [
          { collectionId: t.collectionGroup, allDescendants: !0 },
        ]))
      : ((n.parent = Sc(e, r.popLast())),
        (n.structuredQuery.from = [{ collectionId: r.lastSegment() }]));
    const i = (function (e) {
      if (0 !== e.length) return Uc(Ro.create(e, "and"));
    })(t.filters);
    i && (n.structuredQuery.where = i);
    const s = (function (e) {
      if (0 !== e.length)
        return e.map((e) =>
          (function (e) {
            return { field: Mc(e.field), direction: Oc(e.dir) };
          })(e)
        );
    })(t.orderBy);
    s && (n.structuredQuery.orderBy = s);
    const o = vc(e, t.limit);
    return (
      null !== o && (n.structuredQuery.limit = o),
      t.startAt &&
        (n.structuredQuery.startAt = (function (e) {
          return { before: e.inclusive, values: e.position };
        })(t.startAt)),
      t.endAt &&
        (n.structuredQuery.endAt = (function (e) {
          return { before: !e.inclusive, values: e.position };
        })(t.endAt)),
      n
    );
  }
  function Rc(e) {
    let t = (function (e) {
      const t = Tc(e);
      return 4 === t.length ? Ts.emptyPath() : kc(t);
    })(e.parent);
    const n = e.structuredQuery,
      r = n.from ? n.from.length : 0;
    let i = null;
    if (r > 0) {
      rs(1 === r);
      const e = n.from[0];
      e.allDescendants ? (i = e.collectionId) : (t = t.child(e.collectionId));
    }
    let s = [];
    n.where &&
      (s = (function (e) {
        const t = Dc(e);
        return t instanceof Ro && Oo(t) ? t.getFilters() : [t];
      })(n.where));
    let o = [];
    n.orderBy &&
      (o = (function (e) {
        return e.map((e) =>
          (function (e) {
            return new Co(
              xc(e.field),
              (function (e) {
                switch (e) {
                  case "ASCENDING":
                    return "asc";
                  case "DESCENDING":
                    return "desc";
                  default:
                    return;
                }
              })(e.direction)
            );
          })(e)
        );
      })(n.orderBy));
    let a = null;
    n.limit &&
      (a = (function (e) {
        let t;
        return (t = "object" == typeof e ? e.value : e), xs(t) ? null : t;
      })(n.limit));
    let c = null;
    n.startAt &&
      (c = (function (e) {
        const t = !!e.before,
          n = e.values || [];
        return new To(n, t);
      })(n.startAt));
    let h = null;
    return (
      n.endAt &&
        (h = (function (e) {
          const t = !e.before,
            n = e.values || [];
          return new To(n, t);
        })(n.endAt)),
      (function (e, t, n, r, i, s, o, a) {
        return new Qo(e, t, n, r, i, s, o, a);
      })(t, i, o, s, a, "F", c, h)
    );
  }
  function Dc(e) {
    return void 0 !== e.unaryFilter
      ? (function (e) {
          switch (e.unaryFilter.op) {
            case "IS_NAN":
              const t = xc(e.unaryFilter.field);
              return No.create(t, "==", { doubleValue: NaN });
            case "IS_NULL":
              const n = xc(e.unaryFilter.field);
              return No.create(n, "==", { nullValue: "NULL_VALUE" });
            case "IS_NOT_NAN":
              const r = xc(e.unaryFilter.field);
              return No.create(r, "!=", { doubleValue: NaN });
            case "IS_NOT_NULL":
              const i = xc(e.unaryFilter.field);
              return No.create(i, "!=", { nullValue: "NULL_VALUE" });
            default:
              return ns();
          }
        })(e)
      : void 0 !== e.fieldFilter
      ? (function (e) {
          return No.create(
            xc(e.fieldFilter.field),
            (function (e) {
              switch (e) {
                case "EQUAL":
                  return "==";
                case "NOT_EQUAL":
                  return "!=";
                case "GREATER_THAN":
                  return ">";
                case "GREATER_THAN_OR_EQUAL":
                  return ">=";
                case "LESS_THAN":
                  return "<";
                case "LESS_THAN_OR_EQUAL":
                  return "<=";
                case "ARRAY_CONTAINS":
                  return "array-contains";
                case "IN":
                  return "in";
                case "NOT_IN":
                  return "not-in";
                case "ARRAY_CONTAINS_ANY":
                  return "array-contains-any";
                default:
                  return ns();
              }
            })(e.fieldFilter.op),
            e.fieldFilter.value
          );
        })(e)
      : void 0 !== e.compositeFilter
      ? (function (e) {
          return Ro.create(
            e.compositeFilter.filters.map((e) => Dc(e)),
            (function (e) {
              switch (e) {
                case "AND":
                  return "and";
                case "OR":
                  return "or";
                default:
                  return ns();
              }
            })(e.compositeFilter.op)
          );
        })(e)
      : ns();
  }
  function Oc(e) {
    return pc[e];
  }
  function Pc(e) {
    return gc[e];
  }
  function Lc(e) {
    return mc[e];
  }
  function Mc(e) {
    return { fieldPath: e.canonicalString() };
  }
  function xc(e) {
    return Ss.fromServerFormat(e.fieldPath);
  }
  function Uc(e) {
    return e instanceof No
      ? (function (e) {
          if ("==" === e.op) {
            if (yo(e.value))
              return { unaryFilter: { field: Mc(e.field), op: "IS_NAN" } };
            if (mo(e.value))
              return { unaryFilter: { field: Mc(e.field), op: "IS_NULL" } };
          } else if ("!=" === e.op) {
            if (yo(e.value))
              return { unaryFilter: { field: Mc(e.field), op: "IS_NOT_NAN" } };
            if (mo(e.value))
              return { unaryFilter: { field: Mc(e.field), op: "IS_NOT_NULL" } };
          }
          return {
            fieldFilter: { field: Mc(e.field), op: Pc(e.op), value: e.value },
          };
        })(e)
      : e instanceof Ro
      ? (function (e) {
          const t = e.getFilters().map((e) => Uc(e));
          return 1 === t.length
            ? t[0]
            : { compositeFilter: { op: Lc(e.op), filters: t } };
        })(e)
      : ns();
  }
  function Vc(e) {
    return e.length >= 4 && "projects" === e.get(0) && "databases" === e.get(2);
  }
  class Fc {
    constructor(
      e,
      t,
      n,
      r,
      i = Es.min(),
      s = Es.min(),
      o = Ws.EMPTY_BYTE_STRING,
      a = null
    ) {
      (this.target = e),
        (this.targetId = t),
        (this.purpose = n),
        (this.sequenceNumber = r),
        (this.snapshotVersion = i),
        (this.lastLimboFreeSnapshotVersion = s),
        (this.resumeToken = o),
        (this.expectedCount = a);
    }
    withSequenceNumber(e) {
      return new Fc(
        this.target,
        this.targetId,
        this.purpose,
        e,
        this.snapshotVersion,
        this.lastLimboFreeSnapshotVersion,
        this.resumeToken,
        this.expectedCount
      );
    }
    withResumeToken(e, t) {
      return new Fc(
        this.target,
        this.targetId,
        this.purpose,
        this.sequenceNumber,
        t,
        this.lastLimboFreeSnapshotVersion,
        e,
        null
      );
    }
    withExpectedCount(e) {
      return new Fc(
        this.target,
        this.targetId,
        this.purpose,
        this.sequenceNumber,
        this.snapshotVersion,
        this.lastLimboFreeSnapshotVersion,
        this.resumeToken,
        e
      );
    }
    withLastLimboFreeSnapshotVersion(e) {
      return new Fc(
        this.target,
        this.targetId,
        this.purpose,
        this.sequenceNumber,
        this.snapshotVersion,
        e,
        this.resumeToken,
        this.expectedCount
      );
    }
  }
  class jc {
    constructor(e) {
      this.ut = e;
    }
  }
  function Bc(e) {
    const t = Rc({ parent: e.parent, structuredQuery: e.structuredQuery });
    return "LAST" === e.limitType ? na(t, t.limit, "L") : t;
  }
  class qc {
    constructor() {}
    ht(e, t) {
      this.Pt(e, t), t.It();
    }
    Pt(e, t) {
      if ("nullValue" in e) this.Tt(t, 5);
      else if ("booleanValue" in e)
        this.Tt(t, 10), t.Et(e.booleanValue ? 1 : 0);
      else if ("integerValue" in e) this.Tt(t, 15), t.Et(Js(e.integerValue));
      else if ("doubleValue" in e) {
        const n = Js(e.doubleValue);
        isNaN(n) ? this.Tt(t, 13) : (this.Tt(t, 15), Us(n) ? t.Et(0) : t.Et(n));
      } else if ("timestampValue" in e) {
        const n = e.timestampValue;
        this.Tt(t, 20),
          "string" == typeof n
            ? t.dt(n)
            : (t.dt(`${n.seconds || ""}`), t.Et(n.nanos || 0));
      } else if ("stringValue" in e) this.At(e.stringValue, t), this.Rt(t);
      else if ("bytesValue" in e)
        this.Tt(t, 30), t.Vt(Ys(e.bytesValue)), this.Rt(t);
      else if ("referenceValue" in e) this.ft(e.referenceValue, t);
      else if ("geoPointValue" in e) {
        const n = e.geoPointValue;
        this.Tt(t, 45), t.Et(n.latitude || 0), t.Et(n.longitude || 0);
      } else
        "mapValue" in e
          ? _o(e)
            ? this.Tt(t, Number.MAX_SAFE_INTEGER)
            : (this.gt(e.mapValue, t), this.Rt(t))
          : "arrayValue" in e
          ? (this.yt(e.arrayValue, t), this.Rt(t))
          : ns();
    }
    At(e, t) {
      this.Tt(t, 25), this.wt(e, t);
    }
    wt(e, t) {
      t.dt(e);
    }
    gt(e, t) {
      const n = e.fields || {};
      this.Tt(t, 55);
      for (const e of Object.keys(n)) this.At(e, t), this.Pt(n[e], t);
    }
    yt(e, t) {
      const n = e.values || [];
      this.Tt(t, 50);
      for (const e of n) this.Pt(e, t);
    }
    ft(e, t) {
      this.Tt(t, 37),
        Cs.fromName(e).path.forEach((e) => {
          this.Tt(t, 60), this.wt(e, t);
        });
    }
    Tt(e, t) {
      e.Et(t);
    }
    Rt(e) {
      e.Et(2);
    }
  }
  qc.St = new qc();
  class $c {
    constructor() {
      this.on = new zc();
    }
    addToCollectionParentIndex(e, t) {
      return this.on.add(t), Ps.resolve();
    }
    getCollectionParents(e, t) {
      return Ps.resolve(this.on.getEntries(t));
    }
    addFieldIndex(e, t) {
      return Ps.resolve();
    }
    deleteFieldIndex(e, t) {
      return Ps.resolve();
    }
    deleteAllFieldIndexes(e) {
      return Ps.resolve();
    }
    createTargetIndexes(e, t) {
      return Ps.resolve();
    }
    getDocumentsMatchingTarget(e, t) {
      return Ps.resolve(null);
    }
    getIndexType(e, t) {
      return Ps.resolve(0);
    }
    getFieldIndexes(e, t) {
      return Ps.resolve([]);
    }
    getNextCollectionGroupToUpdate(e) {
      return Ps.resolve(null);
    }
    getMinOffset(e, t) {
      return Ps.resolve(As.min());
    }
    getMinOffsetFromCollectionGroup(e, t) {
      return Ps.resolve(As.min());
    }
    updateCollectionGroup(e, t, n) {
      return Ps.resolve();
    }
    updateIndexEntries(e, t) {
      return Ps.resolve();
    }
  }
  class zc {
    constructor() {
      this.index = {};
    }
    add(e) {
      const t = e.lastSegment(),
        n = e.popLast(),
        r = this.index[t] || new zs(Ts.comparator),
        i = !r.has(n);
      return (this.index[t] = r.add(n)), i;
    }
    has(e) {
      const t = e.lastSegment(),
        n = e.popLast(),
        r = this.index[t];
      return r && r.has(n);
    }
    getEntries(e) {
      return (this.index[e] || new zs(Ts.comparator)).toArray();
    }
  }
  new Uint8Array(0);
  class Hc {
    constructor(e, t, n) {
      (this.cacheSizeCollectionThreshold = e),
        (this.percentileToCollect = t),
        (this.maximumSequenceNumbersToCollect = n);
    }
    static withCacheSize(e) {
      return new Hc(
        e,
        Hc.DEFAULT_COLLECTION_PERCENTILE,
        Hc.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT
      );
    }
  }
  (Hc.DEFAULT_COLLECTION_PERCENTILE = 10),
    (Hc.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT = 1e3),
    (Hc.DEFAULT = new Hc(
      41943040,
      Hc.DEFAULT_COLLECTION_PERCENTILE,
      Hc.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT
    )),
    (Hc.DISABLED = new Hc(-1, 0, 0));
  class Kc {
    constructor(e) {
      this.xn = e;
    }
    next() {
      return (this.xn += 2), this.xn;
    }
    static On() {
      return new Kc(0);
    }
    static Nn() {
      return new Kc(-1);
    }
  }
  class Gc {
    constructor() {
      (this.changes = new ha(
        (e) => e.toString(),
        (e, t) => e.isEqual(t)
      )),
        (this.changesApplied = !1);
    }
    addEntry(e) {
      this.assertNotApplied(), this.changes.set(e.key, e);
    }
    removeEntry(e, t) {
      this.assertNotApplied(),
        this.changes.set(e, Io.newInvalidDocument(e).setReadTime(t));
    }
    getEntry(e, t) {
      this.assertNotApplied();
      const n = this.changes.get(t);
      return void 0 !== n ? Ps.resolve(n) : this.getFromCache(e, t);
    }
    getEntries(e, t) {
      return this.getAllFromCache(e, t);
    }
    apply(e) {
      return (
        this.assertNotApplied(),
        (this.changesApplied = !0),
        this.applyChanges(e)
      );
    }
    assertNotApplied() {}
  }
  class Wc {
    constructor(e, t) {
      (this.overlayedDocument = e), (this.mutatedFields = t);
    }
  }
  class Qc {
    constructor(e, t, n, r) {
      (this.remoteDocumentCache = e),
        (this.mutationQueue = t),
        (this.documentOverlayCache = n),
        (this.indexManager = r);
    }
    getDocument(e, t) {
      let n = null;
      return this.documentOverlayCache
        .getOverlay(e, t)
        .next((r) => ((n = r), this.remoteDocumentCache.getEntry(e, t)))
        .next(
          (e) => (null !== n && ja(n.mutation, e, Ks.empty(), _s.now()), e)
        );
    }
    getDocuments(e, t) {
      return this.remoteDocumentCache
        .getEntries(e, t)
        .next((t) => this.getLocalViewOfDocuments(e, t, wa()).next(() => t));
    }
    getLocalViewOfDocuments(e, t, n = wa()) {
      const r = ga();
      return this.populateOverlays(e, r, t).next(() =>
        this.computeViews(e, t, r, n).next((e) => {
          let t = fa();
          return (
            e.forEach((e, n) => {
              t = t.insert(e, n.overlayedDocument);
            }),
            t
          );
        })
      );
    }
    getOverlayedDocuments(e, t) {
      const n = ga();
      return this.populateOverlays(e, n, t).next(() =>
        this.computeViews(e, t, n, wa())
      );
    }
    populateOverlays(e, t, n) {
      const r = [];
      return (
        n.forEach((e) => {
          t.has(e) || r.push(e);
        }),
        this.documentOverlayCache.getOverlays(e, r).next((e) => {
          e.forEach((e, n) => {
            t.set(e, n);
          });
        })
      );
    }
    computeViews(e, t, n, r) {
      let i = la();
      const s = ya(),
        o = ya();
      return (
        t.forEach((e, t) => {
          const o = n.get(t.key);
          r.has(t.key) && (void 0 === o || o.mutation instanceof $a)
            ? (i = i.insert(t.key, t))
            : void 0 !== o
            ? (s.set(t.key, o.mutation.getFieldMask()),
              ja(o.mutation, t, o.mutation.getFieldMask(), _s.now()))
            : s.set(t.key, Ks.empty());
        }),
        this.recalculateAndSaveOverlays(e, i).next(
          (e) => (
            e.forEach((e, t) => s.set(e, t)),
            t.forEach((e, t) => {
              var n;
              return o.set(
                e,
                new Wc(t, null !== (n = s.get(e)) && void 0 !== n ? n : null)
              );
            }),
            o
          )
        )
      );
    }
    recalculateAndSaveOverlays(e, t) {
      const n = ya();
      let r = new Bs((e, t) => e - t),
        i = wa();
      return this.mutationQueue
        .getAllMutationBatchesAffectingDocumentKeys(e, t)
        .next((e) => {
          for (const i of e)
            i.keys().forEach((e) => {
              const s = t.get(e);
              if (null === s) return;
              let o = n.get(e) || Ks.empty();
              (o = i.applyToLocalView(s, o)), n.set(e, o);
              const a = (r.get(i.batchId) || wa()).add(e);
              r = r.insert(i.batchId, a);
            });
        })
        .next(() => {
          const s = [],
            o = r.getReverseIterator();
          for (; o.hasNext(); ) {
            const r = o.getNext(),
              a = r.key,
              c = r.value,
              h = ma();
            c.forEach((e) => {
              if (!i.has(e)) {
                const r = Va(t.get(e), n.get(e));
                null !== r && h.set(e, r), (i = i.add(e));
              }
            }),
              s.push(this.documentOverlayCache.saveOverlays(e, a, h));
          }
          return Ps.waitFor(s);
        })
        .next(() => n);
    }
    recalculateAndSaveOverlaysForDocumentKeys(e, t) {
      return this.remoteDocumentCache
        .getEntries(e, t)
        .next((t) => this.recalculateAndSaveOverlays(e, t));
    }
    getDocumentsMatchingQuery(e, t, n, r) {
      return (function (e) {
        return (
          Cs.isDocumentKey(e.path) &&
          null === e.collectionGroup &&
          0 === e.filters.length
        );
      })(t)
        ? this.getDocumentsMatchingDocumentQuery(e, t.path)
        : Yo(t)
        ? this.getDocumentsMatchingCollectionGroupQuery(e, t, n, r)
        : this.getDocumentsMatchingCollectionQuery(e, t, n, r);
    }
    getNextDocuments(e, t, n, r) {
      return this.remoteDocumentCache
        .getAllFromCollectionGroup(e, t, n, r)
        .next((i) => {
          const s =
            r - i.size > 0
              ? this.documentOverlayCache.getOverlaysForCollectionGroup(
                  e,
                  t,
                  n.largestBatchId,
                  r - i.size
                )
              : Ps.resolve(ga());
          let o = -1,
            a = i;
          return s.next((t) =>
            Ps.forEach(
              t,
              (t, n) => (
                o < n.largestBatchId && (o = n.largestBatchId),
                i.get(t)
                  ? Ps.resolve()
                  : this.remoteDocumentCache.getEntry(e, t).next((e) => {
                      a = a.insert(t, e);
                    })
              )
            )
              .next(() => this.populateOverlays(e, t, i))
              .next(() => this.computeViews(e, a, t, wa()))
              .next((e) => ({ batchId: o, changes: pa(e) }))
          );
        });
    }
    getDocumentsMatchingDocumentQuery(e, t) {
      return this.getDocument(e, new Cs(t)).next((e) => {
        let t = fa();
        return e.isFoundDocument() && (t = t.insert(e.key, e)), t;
      });
    }
    getDocumentsMatchingCollectionGroupQuery(e, t, n, r) {
      const i = t.collectionGroup;
      let s = fa();
      return this.indexManager.getCollectionParents(e, i).next((o) =>
        Ps.forEach(o, (o) => {
          const a = (function (e, t) {
            return new Qo(
              t,
              null,
              e.explicitOrderBy.slice(),
              e.filters.slice(),
              e.limit,
              e.limitType,
              e.startAt,
              e.endAt
            );
          })(t, o.child(i));
          return this.getDocumentsMatchingCollectionQuery(e, a, n, r).next(
            (e) => {
              e.forEach((e, t) => {
                s = s.insert(e, t);
              });
            }
          );
        }).next(() => s)
      );
    }
    getDocumentsMatchingCollectionQuery(e, t, n, r) {
      let i;
      return this.documentOverlayCache
        .getOverlaysForCollection(e, t.path, n.largestBatchId)
        .next(
          (s) => (
            (i = s),
            this.remoteDocumentCache.getDocumentsMatchingQuery(e, t, n, i, r)
          )
        )
        .next((e) => {
          i.forEach((t, n) => {
            const r = n.getKey();
            null === e.get(r) && (e = e.insert(r, Io.newInvalidDocument(r)));
          });
          let n = fa();
          return (
            e.forEach((e, r) => {
              const s = i.get(e);
              void 0 !== s && ja(s.mutation, r, Ks.empty(), _s.now()),
                oa(t, r) && (n = n.insert(e, r));
            }),
            n
          );
        });
    }
  }
  class Xc {
    constructor(e) {
      (this.serializer = e), (this.ur = new Map()), (this.cr = new Map());
    }
    getBundleMetadata(e, t) {
      return Ps.resolve(this.ur.get(t));
    }
    saveBundleMetadata(e, t) {
      return (
        this.ur.set(
          t.id,
          (function (e) {
            return {
              id: e.id,
              version: e.version,
              createTime: Ec(e.createTime),
            };
          })(t)
        ),
        Ps.resolve()
      );
    }
    getNamedQuery(e, t) {
      return Ps.resolve(this.cr.get(t));
    }
    saveNamedQuery(e, t) {
      return (
        this.cr.set(
          t.name,
          (function (e) {
            return {
              name: e.name,
              query: Bc(e.bundledQuery),
              readTime: Ec(e.readTime),
            };
          })(t)
        ),
        Ps.resolve()
      );
    }
  }
  class Jc {
    constructor() {
      (this.overlays = new Bs(Cs.comparator)), (this.lr = new Map());
    }
    getOverlay(e, t) {
      return Ps.resolve(this.overlays.get(t));
    }
    getOverlays(e, t) {
      const n = ga();
      return Ps.forEach(t, (t) =>
        this.getOverlay(e, t).next((e) => {
          null !== e && n.set(t, e);
        })
      ).next(() => n);
    }
    saveOverlays(e, t, n) {
      return (
        n.forEach((n, r) => {
          this.lt(e, t, r);
        }),
        Ps.resolve()
      );
    }
    removeOverlaysForBatchId(e, t, n) {
      const r = this.lr.get(n);
      return (
        void 0 !== r &&
          (r.forEach((e) => (this.overlays = this.overlays.remove(e))),
          this.lr.delete(n)),
        Ps.resolve()
      );
    }
    getOverlaysForCollection(e, t, n) {
      const r = ga(),
        i = t.length + 1,
        s = new Cs(t.child("")),
        o = this.overlays.getIteratorFrom(s);
      for (; o.hasNext(); ) {
        const e = o.getNext().value,
          s = e.getKey();
        if (!t.isPrefixOf(s.path)) break;
        s.path.length === i && e.largestBatchId > n && r.set(e.getKey(), e);
      }
      return Ps.resolve(r);
    }
    getOverlaysForCollectionGroup(e, t, n, r) {
      let i = new Bs((e, t) => e - t);
      const s = this.overlays.getIterator();
      for (; s.hasNext(); ) {
        const e = s.getNext().value;
        if (e.getKey().getCollectionGroup() === t && e.largestBatchId > n) {
          let t = i.get(e.largestBatchId);
          null === t && ((t = ga()), (i = i.insert(e.largestBatchId, t))),
            t.set(e.getKey(), e);
        }
      }
      const o = ga(),
        a = i.getIterator();
      for (
        ;
        a.hasNext() &&
        (a.getNext().value.forEach((e, t) => o.set(e, t)), !(o.size() >= r));

      );
      return Ps.resolve(o);
    }
    lt(e, t, n) {
      const r = this.overlays.get(n.key);
      if (null !== r) {
        const e = this.lr.get(r.largestBatchId).delete(n.key);
        this.lr.set(r.largestBatchId, e);
      }
      this.overlays = this.overlays.insert(n.key, new Qa(t, n));
      let i = this.lr.get(t);
      void 0 === i && ((i = wa()), this.lr.set(t, i)),
        this.lr.set(t, i.add(n.key));
    }
  }
  class Yc {
    constructor() {
      (this.hr = new zs(Zc.Pr)), (this.Ir = new zs(Zc.Tr));
    }
    isEmpty() {
      return this.hr.isEmpty();
    }
    addReference(e, t) {
      const n = new Zc(e, t);
      (this.hr = this.hr.add(n)), (this.Ir = this.Ir.add(n));
    }
    Er(e, t) {
      e.forEach((e) => this.addReference(e, t));
    }
    removeReference(e, t) {
      this.dr(new Zc(e, t));
    }
    Ar(e, t) {
      e.forEach((e) => this.removeReference(e, t));
    }
    Rr(e) {
      const t = new Cs(new Ts([])),
        n = new Zc(t, e),
        r = new Zc(t, e + 1),
        i = [];
      return (
        this.Ir.forEachInRange([n, r], (e) => {
          this.dr(e), i.push(e.key);
        }),
        i
      );
    }
    Vr() {
      this.hr.forEach((e) => this.dr(e));
    }
    dr(e) {
      (this.hr = this.hr.delete(e)), (this.Ir = this.Ir.delete(e));
    }
    mr(e) {
      const t = new Cs(new Ts([])),
        n = new Zc(t, e),
        r = new Zc(t, e + 1);
      let i = wa();
      return (
        this.Ir.forEachInRange([n, r], (e) => {
          i = i.add(e.key);
        }),
        i
      );
    }
    containsKey(e) {
      const t = new Zc(e, 0),
        n = this.hr.firstAfterOrEqual(t);
      return null !== n && e.isEqual(n.key);
    }
  }
  class Zc {
    constructor(e, t) {
      (this.key = e), (this.gr = t);
    }
    static Pr(e, t) {
      return Cs.comparator(e.key, t.key) || vs(e.gr, t.gr);
    }
    static Tr(e, t) {
      return vs(e.gr, t.gr) || Cs.comparator(e.key, t.key);
    }
  }
  class eh {
    constructor(e, t) {
      (this.indexManager = e),
        (this.referenceDelegate = t),
        (this.mutationQueue = []),
        (this.pr = 1),
        (this.yr = new zs(Zc.Pr));
    }
    checkEmpty(e) {
      return Ps.resolve(0 === this.mutationQueue.length);
    }
    addMutationBatch(e, t, n, r) {
      const i = this.pr;
      this.pr++,
        this.mutationQueue.length > 0 &&
          this.mutationQueue[this.mutationQueue.length - 1];
      const s = new Wa(i, t, n, r);
      this.mutationQueue.push(s);
      for (const t of r)
        (this.yr = this.yr.add(new Zc(t.key, i))),
          this.indexManager.addToCollectionParentIndex(e, t.key.path.popLast());
      return Ps.resolve(s);
    }
    lookupMutationBatch(e, t) {
      return Ps.resolve(this.wr(t));
    }
    getNextMutationBatchAfterBatchId(e, t) {
      const n = t + 1,
        r = this.Sr(n),
        i = r < 0 ? 0 : r;
      return Ps.resolve(
        this.mutationQueue.length > i ? this.mutationQueue[i] : null
      );
    }
    getHighestUnacknowledgedBatchId() {
      return Ps.resolve(0 === this.mutationQueue.length ? -1 : this.pr - 1);
    }
    getAllMutationBatches(e) {
      return Ps.resolve(this.mutationQueue.slice());
    }
    getAllMutationBatchesAffectingDocumentKey(e, t) {
      const n = new Zc(t, 0),
        r = new Zc(t, Number.POSITIVE_INFINITY),
        i = [];
      return (
        this.yr.forEachInRange([n, r], (e) => {
          const t = this.wr(e.gr);
          i.push(t);
        }),
        Ps.resolve(i)
      );
    }
    getAllMutationBatchesAffectingDocumentKeys(e, t) {
      let n = new zs(vs);
      return (
        t.forEach((e) => {
          const t = new Zc(e, 0),
            r = new Zc(e, Number.POSITIVE_INFINITY);
          this.yr.forEachInRange([t, r], (e) => {
            n = n.add(e.gr);
          });
        }),
        Ps.resolve(this.br(n))
      );
    }
    getAllMutationBatchesAffectingQuery(e, t) {
      const n = t.path,
        r = n.length + 1;
      let i = n;
      Cs.isDocumentKey(i) || (i = i.child(""));
      const s = new Zc(new Cs(i), 0);
      let o = new zs(vs);
      return (
        this.yr.forEachWhile((e) => {
          const t = e.key.path;
          return !!n.isPrefixOf(t) && (t.length === r && (o = o.add(e.gr)), !0);
        }, s),
        Ps.resolve(this.br(o))
      );
    }
    br(e) {
      const t = [];
      return (
        e.forEach((e) => {
          const n = this.wr(e);
          null !== n && t.push(n);
        }),
        t
      );
    }
    removeMutationBatch(e, t) {
      rs(0 === this.Dr(t.batchId, "removed")), this.mutationQueue.shift();
      let n = this.yr;
      return Ps.forEach(t.mutations, (r) => {
        const i = new Zc(r.key, t.batchId);
        return (
          (n = n.delete(i)),
          this.referenceDelegate.markPotentiallyOrphaned(e, r.key)
        );
      }).next(() => {
        this.yr = n;
      });
    }
    Fn(e) {}
    containsKey(e, t) {
      const n = new Zc(t, 0),
        r = this.yr.firstAfterOrEqual(n);
      return Ps.resolve(t.isEqual(r && r.key));
    }
    performConsistencyCheck(e) {
      return this.mutationQueue.length, Ps.resolve();
    }
    Dr(e, t) {
      return this.Sr(e);
    }
    Sr(e) {
      return 0 === this.mutationQueue.length
        ? 0
        : e - this.mutationQueue[0].batchId;
    }
    wr(e) {
      const t = this.Sr(e);
      return t < 0 || t >= this.mutationQueue.length
        ? null
        : this.mutationQueue[t];
    }
  }
  class th {
    constructor(e) {
      (this.Cr = e), (this.docs = new Bs(Cs.comparator)), (this.size = 0);
    }
    setIndexManager(e) {
      this.indexManager = e;
    }
    addEntry(e, t) {
      const n = t.key,
        r = this.docs.get(n),
        i = r ? r.size : 0,
        s = this.Cr(t);
      return (
        (this.docs = this.docs.insert(n, {
          document: t.mutableCopy(),
          size: s,
        })),
        (this.size += s - i),
        this.indexManager.addToCollectionParentIndex(e, n.path.popLast())
      );
    }
    removeEntry(e) {
      const t = this.docs.get(e);
      t && ((this.docs = this.docs.remove(e)), (this.size -= t.size));
    }
    getEntry(e, t) {
      const n = this.docs.get(t);
      return Ps.resolve(
        n ? n.document.mutableCopy() : Io.newInvalidDocument(t)
      );
    }
    getEntries(e, t) {
      let n = la();
      return (
        t.forEach((e) => {
          const t = this.docs.get(e);
          n = n.insert(
            e,
            t ? t.document.mutableCopy() : Io.newInvalidDocument(e)
          );
        }),
        Ps.resolve(n)
      );
    }
    getDocumentsMatchingQuery(e, t, n, r) {
      let i = la();
      const s = t.path,
        o = new Cs(s.child("")),
        a = this.docs.getIteratorFrom(o);
      for (; a.hasNext(); ) {
        const {
          key: e,
          value: { document: o },
        } = a.getNext();
        if (!s.isPrefixOf(e.path)) break;
        e.path.length > s.length + 1 ||
          Ns(ks(o), n) <= 0 ||
          ((r.has(o.key) || oa(t, o)) &&
            (i = i.insert(o.key, o.mutableCopy())));
      }
      return Ps.resolve(i);
    }
    getAllFromCollectionGroup(e, t, n, r) {
      ns();
    }
    vr(e, t) {
      return Ps.forEach(this.docs, (e) => t(e));
    }
    newChangeBuffer(e) {
      return new nh(this);
    }
    getSize(e) {
      return Ps.resolve(this.size);
    }
  }
  class nh extends Gc {
    constructor(e) {
      super(), (this._r = e);
    }
    applyChanges(e) {
      const t = [];
      return (
        this.changes.forEach((n, r) => {
          r.isValidDocument()
            ? t.push(this._r.addEntry(e, r))
            : this._r.removeEntry(n);
        }),
        Ps.waitFor(t)
      );
    }
    getFromCache(e, t) {
      return this._r.getEntry(e, t);
    }
    getAllFromCache(e, t) {
      return this._r.getEntries(e, t);
    }
  }
  class rh {
    constructor(e) {
      (this.persistence = e),
        (this.Fr = new ha((e) => Ko(e), Go)),
        (this.lastRemoteSnapshotVersion = Es.min()),
        (this.highestTargetId = 0),
        (this.Mr = 0),
        (this.Or = new Yc()),
        (this.targetCount = 0),
        (this.Nr = Kc.On());
    }
    forEachTarget(e, t) {
      return this.Fr.forEach((e, n) => t(n)), Ps.resolve();
    }
    getLastRemoteSnapshotVersion(e) {
      return Ps.resolve(this.lastRemoteSnapshotVersion);
    }
    getHighestSequenceNumber(e) {
      return Ps.resolve(this.Mr);
    }
    allocateTargetId(e) {
      return (
        (this.highestTargetId = this.Nr.next()),
        Ps.resolve(this.highestTargetId)
      );
    }
    setTargetsMetadata(e, t, n) {
      return (
        n && (this.lastRemoteSnapshotVersion = n),
        t > this.Mr && (this.Mr = t),
        Ps.resolve()
      );
    }
    kn(e) {
      this.Fr.set(e.target, e);
      const t = e.targetId;
      t > this.highestTargetId &&
        ((this.Nr = new Kc(t)), (this.highestTargetId = t)),
        e.sequenceNumber > this.Mr && (this.Mr = e.sequenceNumber);
    }
    addTargetData(e, t) {
      return this.kn(t), (this.targetCount += 1), Ps.resolve();
    }
    updateTargetData(e, t) {
      return this.kn(t), Ps.resolve();
    }
    removeTargetData(e, t) {
      return (
        this.Fr.delete(t.target),
        this.Or.Rr(t.targetId),
        (this.targetCount -= 1),
        Ps.resolve()
      );
    }
    removeTargets(e, t, n) {
      let r = 0;
      const i = [];
      return (
        this.Fr.forEach((s, o) => {
          o.sequenceNumber <= t &&
            null === n.get(o.targetId) &&
            (this.Fr.delete(s),
            i.push(this.removeMatchingKeysForTargetId(e, o.targetId)),
            r++);
        }),
        Ps.waitFor(i).next(() => r)
      );
    }
    getTargetCount(e) {
      return Ps.resolve(this.targetCount);
    }
    getTargetData(e, t) {
      const n = this.Fr.get(t) || null;
      return Ps.resolve(n);
    }
    addMatchingKeys(e, t, n) {
      return this.Or.Er(t, n), Ps.resolve();
    }
    removeMatchingKeys(e, t, n) {
      this.Or.Ar(t, n);
      const r = this.persistence.referenceDelegate,
        i = [];
      return (
        r &&
          t.forEach((t) => {
            i.push(r.markPotentiallyOrphaned(e, t));
          }),
        Ps.waitFor(i)
      );
    }
    removeMatchingKeysForTargetId(e, t) {
      return this.Or.Rr(t), Ps.resolve();
    }
    getMatchingKeysForTargetId(e, t) {
      const n = this.Or.mr(t);
      return Ps.resolve(n);
    }
    containsKey(e, t) {
      return Ps.resolve(this.Or.containsKey(t));
    }
  }
  class ih {
    constructor(e, t) {
      (this.Br = {}),
        (this.overlays = {}),
        (this.Lr = new Ms(0)),
        (this.kr = !1),
        (this.kr = !0),
        (this.referenceDelegate = e(this)),
        (this.qr = new rh(this)),
        (this.indexManager = new $c()),
        (this.remoteDocumentCache = (function (e) {
          return new th(e);
        })((e) => this.referenceDelegate.Qr(e))),
        (this.serializer = new jc(t)),
        (this.Kr = new Xc(this.serializer));
    }
    start() {
      return Promise.resolve();
    }
    shutdown() {
      return (this.kr = !1), Promise.resolve();
    }
    get started() {
      return this.kr;
    }
    setDatabaseDeletedListener() {}
    setNetworkEnabled() {}
    getIndexManager(e) {
      return this.indexManager;
    }
    getDocumentOverlayCache(e) {
      let t = this.overlays[e.toKey()];
      return t || ((t = new Jc()), (this.overlays[e.toKey()] = t)), t;
    }
    getMutationQueue(e, t) {
      let n = this.Br[e.toKey()];
      return (
        n ||
          ((n = new eh(t, this.referenceDelegate)), (this.Br[e.toKey()] = n)),
        n
      );
    }
    getTargetCache() {
      return this.qr;
    }
    getRemoteDocumentCache() {
      return this.remoteDocumentCache;
    }
    getBundleCache() {
      return this.Kr;
    }
    runTransaction(e, t, n) {
      Yi("MemoryPersistence", "Starting transaction:", e);
      const r = new sh(this.Lr.next());
      return (
        this.referenceDelegate.$r(),
        n(r)
          .next((e) => this.referenceDelegate.Ur(r).next(() => e))
          .toPromise()
          .then((e) => (r.raiseOnCommittedEvent(), e))
      );
    }
    Wr(e, t) {
      return Ps.or(
        Object.values(this.Br).map((n) => () => n.containsKey(e, t))
      );
    }
  }
  class sh extends Ds {
    constructor(e) {
      super(), (this.currentSequenceNumber = e);
    }
  }
  class oh {
    constructor(e) {
      (this.persistence = e), (this.Gr = new Yc()), (this.zr = null);
    }
    static jr(e) {
      return new oh(e);
    }
    get Hr() {
      if (this.zr) return this.zr;
      throw ns();
    }
    addReference(e, t, n) {
      return (
        this.Gr.addReference(n, t), this.Hr.delete(n.toString()), Ps.resolve()
      );
    }
    removeReference(e, t, n) {
      return (
        this.Gr.removeReference(n, t), this.Hr.add(n.toString()), Ps.resolve()
      );
    }
    markPotentiallyOrphaned(e, t) {
      return this.Hr.add(t.toString()), Ps.resolve();
    }
    removeTarget(e, t) {
      this.Gr.Rr(t.targetId).forEach((e) => this.Hr.add(e.toString()));
      const n = this.persistence.getTargetCache();
      return n
        .getMatchingKeysForTargetId(e, t.targetId)
        .next((e) => {
          e.forEach((e) => this.Hr.add(e.toString()));
        })
        .next(() => n.removeTargetData(e, t));
    }
    $r() {
      this.zr = new Set();
    }
    Ur(e) {
      const t = this.persistence.getRemoteDocumentCache().newChangeBuffer();
      return Ps.forEach(this.Hr, (n) => {
        const r = Cs.fromPath(n);
        return this.Jr(e, r).next((e) => {
          e || t.removeEntry(r, Es.min());
        });
      }).next(() => ((this.zr = null), t.apply(e)));
    }
    updateLimboDocument(e, t) {
      return this.Jr(e, t).next((e) => {
        e ? this.Hr.delete(t.toString()) : this.Hr.add(t.toString());
      });
    }
    Qr(e) {
      return 0;
    }
    Jr(e, t) {
      return Ps.or([
        () => Ps.resolve(this.Gr.containsKey(t)),
        () => this.persistence.getTargetCache().containsKey(e, t),
        () => this.persistence.Wr(e, t),
      ]);
    }
  }
  class ah {
    constructor(e, t, n, r) {
      (this.targetId = e), (this.fromCache = t), (this.ki = n), (this.qi = r);
    }
    static Qi(e, t) {
      let n = wa(),
        r = wa();
      for (const e of t.docChanges)
        switch (e.type) {
          case 0:
            n = n.add(e.doc.key);
            break;
          case 1:
            r = r.add(e.doc.key);
        }
      return new ah(e, t.fromCache, n, r);
    }
  }
  class ch {
    constructor() {
      this._documentReadCount = 0;
    }
    get documentReadCount() {
      return this._documentReadCount;
    }
    incrementDocumentReadCount(e) {
      this._documentReadCount += e;
    }
  }
  class hh {
    constructor() {
      (this.Ki = !1), (this.$i = !1), (this.Ui = 100), (this.Wi = 8);
    }
    initialize(e, t) {
      (this.Gi = e), (this.indexManager = t), (this.Ki = !0);
    }
    getDocumentsMatchingQuery(e, t, n, r) {
      const i = { result: null };
      return this.zi(e, t)
        .next((e) => {
          i.result = e;
        })
        .next(() => {
          if (!i.result)
            return this.ji(e, t, r, n).next((e) => {
              i.result = e;
            });
        })
        .next(() => {
          if (i.result) return;
          const n = new ch();
          return this.Hi(e, t, n).next((r) => {
            if (((i.result = r), this.$i)) return this.Ji(e, t, n, r.size);
          });
        })
        .next(() => i.result);
    }
    Ji(e, t, n, r) {
      return n.documentReadCount < this.Ui
        ? (Ji() <= N.DEBUG &&
            Yi(
              "QueryEngine",
              "SDK will not create cache indexes for query:",
              sa(t),
              "since it only creates cache indexes for collection contains",
              "more than or equal to",
              this.Ui,
              "documents"
            ),
          Ps.resolve())
        : (Ji() <= N.DEBUG &&
            Yi(
              "QueryEngine",
              "Query:",
              sa(t),
              "scans",
              n.documentReadCount,
              "local documents and returns",
              r,
              "documents as results."
            ),
          n.documentReadCount > this.Wi * r
            ? (Ji() <= N.DEBUG &&
                Yi(
                  "QueryEngine",
                  "The SDK decides to create cache indexes for query:",
                  sa(t),
                  "as using cache indexes may help improve performance."
                ),
              this.indexManager.createTargetIndexes(e, ea(t)))
            : Ps.resolve());
    }
    zi(e, t) {
      if (Jo(t)) return Ps.resolve(null);
      let n = ea(t);
      return this.indexManager.getIndexType(e, n).next((r) =>
        0 === r
          ? null
          : (null !== t.limit &&
              1 === r &&
              ((t = na(t, null, "F")), (n = ea(t))),
            this.indexManager.getDocumentsMatchingTarget(e, n).next((r) => {
              const i = wa(...r);
              return this.Gi.getDocuments(e, i).next((r) =>
                this.indexManager.getMinOffset(e, n).next((n) => {
                  const s = this.Yi(t, r);
                  return this.Zi(t, s, i, n.readTime)
                    ? this.zi(e, na(t, null, "F"))
                    : this.Xi(e, s, t, n);
                })
              );
            }))
      );
    }
    ji(e, t, n, r) {
      return Jo(t) || r.isEqual(Es.min())
        ? Ps.resolve(null)
        : this.Gi.getDocuments(e, n).next((i) => {
            const s = this.Yi(t, i);
            return this.Zi(t, s, n, r)
              ? Ps.resolve(null)
              : (Ji() <= N.DEBUG &&
                  Yi(
                    "QueryEngine",
                    "Re-using previous result from %s to execute query: %s",
                    r.toString(),
                    sa(t)
                  ),
                this.Xi(
                  e,
                  s,
                  t,
                  (function (e, t) {
                    const n = e.toTimestamp().seconds,
                      r = e.toTimestamp().nanoseconds + 1,
                      i = Es.fromTimestamp(
                        1e9 === r ? new _s(n + 1, 0) : new _s(n, r)
                      );
                    return new As(i, Cs.empty(), t);
                  })(r, -1)
                ).next((e) => e));
          });
    }
    Yi(e, t) {
      let n = new zs(aa(e));
      return (
        t.forEach((t, r) => {
          oa(e, r) && (n = n.add(r));
        }),
        n
      );
    }
    Zi(e, t, n, r) {
      if (null === e.limit) return !1;
      if (n.size !== t.size) return !0;
      const i = "F" === e.limitType ? t.last() : t.first();
      return !!i && (i.hasPendingWrites || i.version.compareTo(r) > 0);
    }
    Hi(e, t, n) {
      return (
        Ji() <= N.DEBUG &&
          Yi(
            "QueryEngine",
            "Using full collection scan to execute query:",
            sa(t)
          ),
        this.Gi.getDocumentsMatchingQuery(e, t, As.min(), n)
      );
    }
    Xi(e, t, n, r) {
      return this.Gi.getDocumentsMatchingQuery(e, n, r).next(
        (e) => (
          t.forEach((t) => {
            e = e.insert(t.key, t);
          }),
          e
        )
      );
    }
  }
  class uh {
    constructor(e, t, n, r) {
      (this.persistence = e),
        (this.es = t),
        (this.serializer = r),
        (this.ts = new Bs(vs)),
        (this.ns = new ha((e) => Ko(e), Go)),
        (this.rs = new Map()),
        (this.ss = e.getRemoteDocumentCache()),
        (this.qr = e.getTargetCache()),
        (this.Kr = e.getBundleCache()),
        this.os(n);
    }
    os(e) {
      (this.documentOverlayCache = this.persistence.getDocumentOverlayCache(e)),
        (this.indexManager = this.persistence.getIndexManager(e)),
        (this.mutationQueue = this.persistence.getMutationQueue(
          e,
          this.indexManager
        )),
        (this.localDocuments = new Qc(
          this.ss,
          this.mutationQueue,
          this.documentOverlayCache,
          this.indexManager
        )),
        this.ss.setIndexManager(this.indexManager),
        this.es.initialize(this.localDocuments, this.indexManager);
    }
    collectGarbage(e) {
      return this.persistence.runTransaction(
        "Collect garbage",
        "readwrite-primary",
        (t) => e.collect(t, this.ts)
      );
    }
  }
  async function lh(e, t) {
    const n = is(e);
    return await n.persistence.runTransaction(
      "Handle user change",
      "readonly",
      (e) => {
        let r;
        return n.mutationQueue
          .getAllMutationBatches(e)
          .next(
            (i) => ((r = i), n.os(t), n.mutationQueue.getAllMutationBatches(e))
          )
          .next((t) => {
            const i = [],
              s = [];
            let o = wa();
            for (const e of r) {
              i.push(e.batchId);
              for (const t of e.mutations) o = o.add(t.key);
            }
            for (const e of t) {
              s.push(e.batchId);
              for (const t of e.mutations) o = o.add(t.key);
            }
            return n.localDocuments
              .getDocuments(e, o)
              .next((e) => ({ _s: e, removedBatchIds: i, addedBatchIds: s }));
          });
      }
    );
  }
  function dh(e) {
    const t = is(e);
    return t.persistence.runTransaction(
      "Get last remote snapshot version",
      "readonly",
      (e) => t.qr.getLastRemoteSnapshotVersion(e)
    );
  }
  async function fh(e, t, n) {
    const r = is(e),
      i = r.ts.get(t),
      s = n ? "readwrite" : "readwrite-primary";
    try {
      n ||
        (await r.persistence.runTransaction("Release target", s, (e) =>
          r.persistence.referenceDelegate.removeTarget(e, i)
        ));
    } catch (e) {
      if (!Ls(e)) throw e;
      Yi(
        "LocalStore",
        `Failed to update sequence numbers for target ${t}: ${e}`
      );
    }
    (r.ts = r.ts.remove(t)), r.ns.delete(i.target);
  }
  function ph(e, t, n) {
    const r = is(e);
    let i = Es.min(),
      s = wa();
    return r.persistence.runTransaction("Execute query", "readwrite", (e) =>
      (function (e, t, n) {
        const r = is(e),
          i = r.ns.get(n);
        return void 0 !== i
          ? Ps.resolve(r.ts.get(i))
          : r.qr.getTargetData(t, n);
      })(r, e, ea(t))
        .next((t) => {
          if (t)
            return (
              (i = t.lastLimboFreeSnapshotVersion),
              r.qr.getMatchingKeysForTargetId(e, t.targetId).next((e) => {
                s = e;
              })
            );
        })
        .next(() =>
          r.es.getDocumentsMatchingQuery(e, t, n ? i : Es.min(), n ? s : wa())
        )
        .next(
          (e) => (
            (function (e, t, n) {
              let r = e.rs.get(t) || Es.min();
              n.forEach((e, t) => {
                t.readTime.compareTo(r) > 0 && (r = t.readTime);
              }),
                e.rs.set(t, r);
            })(
              r,
              (function (e) {
                return (
                  e.collectionGroup ||
                  (e.path.length % 2 == 1
                    ? e.path.lastSegment()
                    : e.path.get(e.path.length - 2))
                );
              })(t),
              e
            ),
            { documents: e, ls: s }
          )
        )
    );
  }
  class gh {
    constructor() {
      this.activeTargetIds = _a;
    }
    ds(e) {
      this.activeTargetIds = this.activeTargetIds.add(e);
    }
    As(e) {
      this.activeTargetIds = this.activeTargetIds.delete(e);
    }
    Es() {
      const e = {
        activeTargetIds: this.activeTargetIds.toArray(),
        updateTimeMs: Date.now(),
      };
      return JSON.stringify(e);
    }
  }
  class mh {
    constructor() {
      (this.eo = new gh()),
        (this.no = {}),
        (this.onlineStateHandler = null),
        (this.sequenceNumberHandler = null);
    }
    addPendingMutation(e) {}
    updateMutationState(e, t, n) {}
    addLocalQueryTarget(e) {
      return this.eo.ds(e), this.no[e] || "not-current";
    }
    updateQueryState(e, t, n) {
      this.no[e] = t;
    }
    removeLocalQueryTarget(e) {
      this.eo.As(e);
    }
    isLocalQueryTarget(e) {
      return this.eo.activeTargetIds.has(e);
    }
    clearQueryState(e) {
      delete this.no[e];
    }
    getAllActiveQueryTargets() {
      return this.eo.activeTargetIds;
    }
    isActiveQueryTarget(e) {
      return this.eo.activeTargetIds.has(e);
    }
    start() {
      return (this.eo = new gh()), Promise.resolve();
    }
    handleUserChange(e, t, n) {}
    setOnlineState(e) {}
    shutdown() {}
    writeSequenceNumber(e) {}
    notifyBundleLoaded(e) {}
  }
  class yh {
    ro(e) {}
    shutdown() {}
  }
  class vh {
    constructor() {
      (this.io = () => this.so()),
        (this.oo = () => this._o()),
        (this.ao = []),
        this.uo();
    }
    ro(e) {
      this.ao.push(e);
    }
    shutdown() {
      window.removeEventListener("online", this.io),
        window.removeEventListener("offline", this.oo);
    }
    uo() {
      window.addEventListener("online", this.io),
        window.addEventListener("offline", this.oo);
    }
    so() {
      Yi("ConnectivityMonitor", "Network connectivity changed: AVAILABLE");
      for (const e of this.ao) e(0);
    }
    _o() {
      Yi("ConnectivityMonitor", "Network connectivity changed: UNAVAILABLE");
      for (const e of this.ao) e(1);
    }
    static D() {
      return (
        "undefined" != typeof window &&
        void 0 !== window.addEventListener &&
        void 0 !== window.removeEventListener
      );
    }
  }
  let wh = null;
  function _h() {
    return (
      null === wh
        ? (wh = 268435456 + Math.round(2147483648 * Math.random()))
        : wh++,
      "0x" + wh.toString(16)
    );
  }
  const Eh = {
    BatchGetDocuments: "batchGet",
    Commit: "commit",
    RunQuery: "runQuery",
    RunAggregationQuery: "runAggregationQuery",
  };
  class Ih {
    constructor(e) {
      (this.co = e.co), (this.lo = e.lo);
    }
    ho(e) {
      this.Po = e;
    }
    Io(e) {
      this.To = e;
    }
    onMessage(e) {
      this.Eo = e;
    }
    close() {
      this.lo();
    }
    send(e) {
      this.co(e);
    }
    Ao() {
      this.Po();
    }
    Ro(e) {
      this.To(e);
    }
    Vo(e) {
      this.Eo(e);
    }
  }
  const Th = "WebChannelConnection";
  class bh extends class {
    constructor(e) {
      (this.databaseInfo = e), (this.databaseId = e.databaseId);
      const t = e.ssl ? "https" : "http",
        n = encodeURIComponent(this.databaseId.projectId),
        r = encodeURIComponent(this.databaseId.database);
      (this.mo = t + "://" + e.host),
        (this.fo = `projects/${n}/databases/${r}`),
        (this.po =
          "(default)" === this.databaseId.database
            ? `project_id=${n}`
            : `project_id=${n}&database_id=${r}`);
    }
    get yo() {
      return !1;
    }
    wo(e, t, n, r, i) {
      const s = _h(),
        o = this.So(e, t);
      Yi("RestConnection", `Sending RPC '${e}' ${s}:`, o, n);
      const a = {
        "google-cloud-resource-prefix": this.fo,
        "x-goog-request-params": this.po,
      };
      return (
        this.bo(a, r, i),
        this.Do(e, o, a, n).then(
          (t) => (Yi("RestConnection", `Received RPC '${e}' ${s}: `, t), t),
          (t) => {
            throw (
              (es(
                "RestConnection",
                `RPC '${e}' ${s} failed with error: `,
                t,
                "url: ",
                o,
                "request:",
                n
              ),
              t)
            );
          }
        )
      );
    }
    Co(e, t, n, r, i, s) {
      return this.wo(e, t, n, r, i);
    }
    bo(e, t, n) {
      (e["X-Goog-Api-Client"] = "gl-js/ fire/" + Qi),
        (e["Content-Type"] = "text/plain"),
        this.databaseInfo.appId &&
          (e["X-Firebase-GMPID"] = this.databaseInfo.appId),
        t && t.headers.forEach((t, n) => (e[n] = t)),
        n && n.headers.forEach((t, n) => (e[n] = t));
    }
    So(e, t) {
      const n = Eh[e];
      return `${this.mo}/v1/${t}:${n}`;
    }
  } {
    constructor(e) {
      super(e),
        (this.forceLongPolling = e.forceLongPolling),
        (this.autoDetectLongPolling = e.autoDetectLongPolling),
        (this.useFetchStreams = e.useFetchStreams),
        (this.longPollingOptions = e.longPollingOptions);
    }
    Do(e, t, n, r) {
      const i = _h();
      return new Promise((s, o) => {
        const a = new zi();
        a.setWithCredentials(!0),
          a.listenOnce(Fi.COMPLETE, () => {
            try {
              switch (a.getLastErrorCode()) {
                case Vi.NO_ERROR:
                  const t = a.getResponseJson();
                  Yi(
                    Th,
                    `XHR for RPC '${e}' ${i} received:`,
                    JSON.stringify(t)
                  ),
                    s(t);
                  break;
                case Vi.TIMEOUT:
                  Yi(Th, `RPC '${e}' ${i} timed out`),
                    o(new os(ss.DEADLINE_EXCEEDED, "Request time out"));
                  break;
                case Vi.HTTP_ERROR:
                  const n = a.getStatus();
                  if (
                    (Yi(
                      Th,
                      `RPC '${e}' ${i} failed with status:`,
                      n,
                      "response text:",
                      a.getResponseText()
                    ),
                    n > 0)
                  ) {
                    let e = a.getResponseJson();
                    Array.isArray(e) && (e = e[0]);
                    const t = null == e ? void 0 : e.error;
                    if (t && t.status && t.message) {
                      const e = (function (e) {
                        const t = e.toLowerCase().replace(/_/g, "-");
                        return Object.values(ss).indexOf(t) >= 0
                          ? t
                          : ss.UNKNOWN;
                      })(t.status);
                      o(new os(e, t.message));
                    } else
                      o(
                        new os(
                          ss.UNKNOWN,
                          "Server responded with status " + a.getStatus()
                        )
                      );
                  } else o(new os(ss.UNAVAILABLE, "Connection failed."));
                  break;
                default:
                  ns();
              }
            } finally {
              Yi(Th, `RPC '${e}' ${i} completed.`);
            }
          });
        const c = JSON.stringify(r);
        Yi(Th, `RPC '${e}' ${i} sending request:`, r),
          a.send(t, "POST", c, n, 15);
      });
    }
    vo(e, t, n) {
      const r = _h(),
        i = [this.mo, "/", "google.firestore.v1.Firestore", "/", e, "/channel"],
        s = xi(),
        o = Ui(),
        a = {
          httpSessionIdParam: "gsessionid",
          initMessageHeaders: {},
          messageUrlParams: {
            database: `projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`,
          },
          sendRawJson: !0,
          supportsCrossDomainXhr: !0,
          internalChannelParams: { forwardChannelRequestTimeoutMs: 6e5 },
          forceLongPolling: this.forceLongPolling,
          detectBufferingProxy: this.autoDetectLongPolling,
        },
        c = this.longPollingOptions.timeoutSeconds;
      void 0 !== c && (a.longPollingTimeout = Math.round(1e3 * c)),
        this.useFetchStreams && (a.xmlHttpFactory = new qi({})),
        this.bo(a.initMessageHeaders, t, n),
        (a.encodeInitMessageHeaders = !0);
      const h = i.join("");
      Yi(Th, `Creating RPC '${e}' stream ${r}: ${h}`, a);
      const u = s.createWebChannel(h, a);
      let l = !1,
        d = !1;
      const f = new Ih({
          co: (t) => {
            d
              ? Yi(
                  Th,
                  `Not sending because RPC '${e}' stream ${r} is closed:`,
                  t
                )
              : (l ||
                  (Yi(Th, `Opening RPC '${e}' stream ${r} transport.`),
                  u.open(),
                  (l = !0)),
                Yi(Th, `RPC '${e}' stream ${r} sending:`, t),
                u.send(t));
          },
          lo: () => u.close(),
        }),
        p = (e, t, n) => {
          e.listen(t, (e) => {
            try {
              n(e);
            } catch (e) {
              setTimeout(() => {
                throw e;
              }, 0);
            }
          });
        };
      return (
        p(u, $i.EventType.OPEN, () => {
          d || Yi(Th, `RPC '${e}' stream ${r} transport opened.`);
        }),
        p(u, $i.EventType.CLOSE, () => {
          d ||
            ((d = !0),
            Yi(Th, `RPC '${e}' stream ${r} transport closed`),
            f.Ro());
        }),
        p(u, $i.EventType.ERROR, (t) => {
          d ||
            ((d = !0),
            es(Th, `RPC '${e}' stream ${r} transport errored:`, t),
            f.Ro(
              new os(ss.UNAVAILABLE, "The operation could not be completed")
            ));
        }),
        p(u, $i.EventType.MESSAGE, (t) => {
          var n;
          if (!d) {
            const i = t.data[0];
            rs(!!i);
            const s = i,
              o =
                s.error ||
                (null === (n = s[0]) || void 0 === n ? void 0 : n.error);
            if (o) {
              Yi(Th, `RPC '${e}' stream ${r} received error:`, o);
              const t = o.status;
              let n = (function (e) {
                  const t = Ja[e];
                  if (void 0 !== t) return Za(t);
                })(t),
                i = o.message;
              void 0 === n &&
                ((n = ss.INTERNAL),
                (i =
                  "Unknown error status: " + t + " with message " + o.message)),
                (d = !0),
                f.Ro(new os(n, i)),
                u.close();
            } else Yi(Th, `RPC '${e}' stream ${r} received:`, i), f.Vo(i);
          }
        }),
        p(o, ji.STAT_EVENT, (t) => {
          t.stat === Bi.PROXY
            ? Yi(Th, `RPC '${e}' stream ${r} detected buffering proxy`)
            : t.stat === Bi.NOPROXY &&
              Yi(Th, `RPC '${e}' stream ${r} detected no buffering proxy`);
        }),
        setTimeout(() => {
          f.Ao();
        }, 0),
        f
      );
    }
  }
  function Sh() {
    return "undefined" != typeof document ? document : null;
  }
  function Ch(e) {
    return new yc(e, !0);
  }
  class kh {
    constructor(e, t, n = 1e3, r = 1.5, i = 6e4) {
      (this.si = e),
        (this.timerId = t),
        (this.Fo = n),
        (this.Mo = r),
        (this.xo = i),
        (this.Oo = 0),
        (this.No = null),
        (this.Bo = Date.now()),
        this.reset();
    }
    reset() {
      this.Oo = 0;
    }
    Lo() {
      this.Oo = this.xo;
    }
    ko(e) {
      this.cancel();
      const t = Math.floor(this.Oo + this.qo()),
        n = Math.max(0, Date.now() - this.Bo),
        r = Math.max(0, t - n);
      r > 0 &&
        Yi(
          "ExponentialBackoff",
          `Backing off for ${r} ms (base delay: ${this.Oo} ms, delay with jitter: ${t} ms, last attempt: ${n} ms ago)`
        ),
        (this.No = this.si.enqueueAfterDelay(
          this.timerId,
          r,
          () => ((this.Bo = Date.now()), e())
        )),
        (this.Oo *= this.Mo),
        this.Oo < this.Fo && (this.Oo = this.Fo),
        this.Oo > this.xo && (this.Oo = this.xo);
    }
    Qo() {
      null !== this.No && (this.No.skipDelay(), (this.No = null));
    }
    cancel() {
      null !== this.No && (this.No.cancel(), (this.No = null));
    }
    qo() {
      return (Math.random() - 0.5) * this.Oo;
    }
  }
  class Ah {
    constructor(e, t, n, r, i, s, o, a) {
      (this.si = e),
        (this.Ko = n),
        (this.$o = r),
        (this.connection = i),
        (this.authCredentialsProvider = s),
        (this.appCheckCredentialsProvider = o),
        (this.listener = a),
        (this.state = 0),
        (this.Uo = 0),
        (this.Wo = null),
        (this.Go = null),
        (this.stream = null),
        (this.zo = new kh(e, t));
    }
    jo() {
      return 1 === this.state || 5 === this.state || this.Ho();
    }
    Ho() {
      return 2 === this.state || 3 === this.state;
    }
    start() {
      4 !== this.state ? this.auth() : this.Jo();
    }
    async stop() {
      this.jo() && (await this.close(0));
    }
    Yo() {
      (this.state = 0), this.zo.reset();
    }
    Zo() {
      this.Ho() &&
        null === this.Wo &&
        (this.Wo = this.si.enqueueAfterDelay(this.Ko, 6e4, () => this.Xo()));
    }
    e_(e) {
      this.t_(), this.stream.send(e);
    }
    async Xo() {
      if (this.Ho()) return this.close(0);
    }
    t_() {
      this.Wo && (this.Wo.cancel(), (this.Wo = null));
    }
    n_() {
      this.Go && (this.Go.cancel(), (this.Go = null));
    }
    async close(e, t) {
      this.t_(),
        this.n_(),
        this.zo.cancel(),
        this.Uo++,
        4 !== e
          ? this.zo.reset()
          : t && t.code === ss.RESOURCE_EXHAUSTED
          ? (Zi(t.toString()),
            Zi(
              "Using maximum backoff delay to prevent overloading the backend."
            ),
            this.zo.Lo())
          : t &&
            t.code === ss.UNAUTHENTICATED &&
            3 !== this.state &&
            (this.authCredentialsProvider.invalidateToken(),
            this.appCheckCredentialsProvider.invalidateToken()),
        null !== this.stream &&
          (this.r_(), this.stream.close(), (this.stream = null)),
        (this.state = e),
        await this.listener.Io(t);
    }
    r_() {}
    auth() {
      this.state = 1;
      const e = this.i_(this.Uo),
        t = this.Uo;
      Promise.all([
        this.authCredentialsProvider.getToken(),
        this.appCheckCredentialsProvider.getToken(),
      ]).then(
        ([e, n]) => {
          this.Uo === t && this.s_(e, n);
        },
        (t) => {
          e(() => {
            const e = new os(
              ss.UNKNOWN,
              "Fetching auth token failed: " + t.message
            );
            return this.o_(e);
          });
        }
      );
    }
    s_(e, t) {
      const n = this.i_(this.Uo);
      (this.stream = this.__(e, t)),
        this.stream.ho(() => {
          n(
            () => (
              (this.state = 2),
              (this.Go = this.si.enqueueAfterDelay(
                this.$o,
                1e4,
                () => (this.Ho() && (this.state = 3), Promise.resolve())
              )),
              this.listener.ho()
            )
          );
        }),
        this.stream.Io((e) => {
          n(() => this.o_(e));
        }),
        this.stream.onMessage((e) => {
          n(() => this.onMessage(e));
        });
    }
    Jo() {
      (this.state = 5),
        this.zo.ko(async () => {
          (this.state = 0), this.start();
        });
    }
    o_(e) {
      return (
        Yi("PersistentStream", `close with error: ${e}`),
        (this.stream = null),
        this.close(4, e)
      );
    }
    i_(e) {
      return (t) => {
        this.si.enqueueAndForget(() =>
          this.Uo === e
            ? t()
            : (Yi(
                "PersistentStream",
                "stream callback skipped by getCloseGuardedDispatcher."
              ),
              Promise.resolve())
        );
      };
    }
  }
  class Nh extends Ah {
    constructor(e, t, n, r, i, s) {
      super(
        e,
        "listen_stream_connection_backoff",
        "listen_stream_idle",
        "health_check_timeout",
        t,
        n,
        r,
        s
      ),
        (this.serializer = i);
    }
    __(e, t) {
      return this.connection.vo("Listen", e, t);
    }
    onMessage(e) {
      this.zo.reset();
      const t = (function (e, t) {
          let n;
          if ("targetChange" in t) {
            t.targetChange;
            const r = (function (e) {
                return "NO_CHANGE" === e
                  ? 0
                  : "ADD" === e
                  ? 1
                  : "REMOVE" === e
                  ? 2
                  : "CURRENT" === e
                  ? 3
                  : "RESET" === e
                  ? 4
                  : ns();
              })(t.targetChange.targetChangeType || "NO_CHANGE"),
              i = t.targetChange.targetIds || [],
              s = (function (e, t) {
                return e.useProto3Json
                  ? (rs(void 0 === t || "string" == typeof t),
                    Ws.fromBase64String(t || ""))
                  : (rs(void 0 === t || t instanceof Uint8Array),
                    Ws.fromUint8Array(t || new Uint8Array()));
              })(e, t.targetChange.resumeToken),
              o = t.targetChange.cause,
              a =
                o &&
                (function (e) {
                  const t = void 0 === e.code ? ss.UNKNOWN : Za(e.code);
                  return new os(t, e.message || "");
                })(o);
            n = new hc(r, i, s, a || null);
          } else if ("documentChange" in t) {
            t.documentChange;
            const r = t.documentChange;
            r.document, r.document.name, r.document.updateTime;
            const i = bc(e, r.document.name),
              s = Ec(r.document.updateTime),
              o = r.document.createTime ? Ec(r.document.createTime) : Es.min(),
              a = new Eo({ mapValue: { fields: r.document.fields } }),
              c = Io.newFoundDocument(i, s, o, a),
              h = r.targetIds || [],
              u = r.removedTargetIds || [];
            n = new ac(h, u, c.key, c);
          } else if ("documentDelete" in t) {
            t.documentDelete;
            const r = t.documentDelete;
            r.document;
            const i = bc(e, r.document),
              s = r.readTime ? Ec(r.readTime) : Es.min(),
              o = Io.newNoDocument(i, s),
              a = r.removedTargetIds || [];
            n = new ac([], a, o.key, o);
          } else if ("documentRemove" in t) {
            t.documentRemove;
            const r = t.documentRemove;
            r.document;
            const i = bc(e, r.document),
              s = r.removedTargetIds || [];
            n = new ac([], s, i, null);
          } else {
            if (!("filter" in t)) return ns();
            {
              t.filter;
              const e = t.filter;
              e.targetId;
              const { count: r = 0, unchangedNames: i } = e,
                s = new Xa(r, i),
                o = e.targetId;
              n = new cc(o, s);
            }
          }
          return n;
        })(this.serializer, e),
        n = (function (e) {
          if (!("targetChange" in e)) return Es.min();
          const t = e.targetChange;
          return t.targetIds && t.targetIds.length
            ? Es.min()
            : t.readTime
            ? Ec(t.readTime)
            : Es.min();
        })(e);
      return this.listener.a_(t, n);
    }
    u_(e) {
      const t = {};
      (t.database = Cc(this.serializer)),
        (t.addTarget = (function (e, t) {
          let n;
          const r = t.target;
          if (
            ((n = Wo(r) ? { documents: Ac(e, r) } : { query: Nc(e, r) }),
            (n.targetId = t.targetId),
            t.resumeToken.approximateByteSize() > 0)
          ) {
            n.resumeToken = _c(e, t.resumeToken);
            const r = vc(e, t.expectedCount);
            null !== r && (n.expectedCount = r);
          } else if (t.snapshotVersion.compareTo(Es.min()) > 0) {
            n.readTime = wc(e, t.snapshotVersion.toTimestamp());
            const r = vc(e, t.expectedCount);
            null !== r && (n.expectedCount = r);
          }
          return n;
        })(this.serializer, e));
      const n = (function (e, t) {
        const n = (function (e) {
          switch (e) {
            case "TargetPurposeListen":
              return null;
            case "TargetPurposeExistenceFilterMismatch":
              return "existence-filter-mismatch";
            case "TargetPurposeExistenceFilterMismatchBloom":
              return "existence-filter-mismatch-bloom";
            case "TargetPurposeLimboResolution":
              return "limbo-document";
            default:
              return ns();
          }
        })(t.purpose);
        return null == n ? null : { "goog-listen-tags": n };
      })(this.serializer, e);
      n && (t.labels = n), this.e_(t);
    }
    c_(e) {
      const t = {};
      (t.database = Cc(this.serializer)), (t.removeTarget = e), this.e_(t);
    }
  }
  class Rh extends class {} {
    constructor(e, t, n, r) {
      super(),
        (this.authCredentials = e),
        (this.appCheckCredentials = t),
        (this.connection = n),
        (this.serializer = r),
        (this.d_ = !1);
    }
    A_() {
      if (this.d_)
        throw new os(
          ss.FAILED_PRECONDITION,
          "The client has already been terminated."
        );
    }
    wo(e, t, n) {
      return (
        this.A_(),
        Promise.all([
          this.authCredentials.getToken(),
          this.appCheckCredentials.getToken(),
        ])
          .then(([r, i]) => this.connection.wo(e, t, n, r, i))
          .catch((e) => {
            throw "FirebaseError" === e.name
              ? (e.code === ss.UNAUTHENTICATED &&
                  (this.authCredentials.invalidateToken(),
                  this.appCheckCredentials.invalidateToken()),
                e)
              : new os(ss.UNKNOWN, e.toString());
          })
      );
    }
    Co(e, t, n, r) {
      return (
        this.A_(),
        Promise.all([
          this.authCredentials.getToken(),
          this.appCheckCredentials.getToken(),
        ])
          .then(([i, s]) => this.connection.Co(e, t, n, i, s, r))
          .catch((e) => {
            throw "FirebaseError" === e.name
              ? (e.code === ss.UNAUTHENTICATED &&
                  (this.authCredentials.invalidateToken(),
                  this.appCheckCredentials.invalidateToken()),
                e)
              : new os(ss.UNKNOWN, e.toString());
          })
      );
    }
    terminate() {
      this.d_ = !0;
    }
  }
  class Dh {
    constructor(e, t) {
      (this.asyncQueue = e),
        (this.onlineStateHandler = t),
        (this.state = "Unknown"),
        (this.V_ = 0),
        (this.m_ = null),
        (this.f_ = !0);
    }
    g_() {
      0 === this.V_ &&
        (this.p_("Unknown"),
        (this.m_ = this.asyncQueue.enqueueAfterDelay(
          "online_state_timeout",
          1e4,
          () => (
            (this.m_ = null),
            this.y_("Backend didn't respond within 10 seconds."),
            this.p_("Offline"),
            Promise.resolve()
          )
        )));
    }
    w_(e) {
      "Online" === this.state
        ? this.p_("Unknown")
        : (this.V_++,
          this.V_ >= 1 &&
            (this.S_(),
            this.y_(
              `Connection failed 1 times. Most recent error: ${e.toString()}`
            ),
            this.p_("Offline")));
    }
    set(e) {
      this.S_(), (this.V_ = 0), "Online" === e && (this.f_ = !1), this.p_(e);
    }
    p_(e) {
      e !== this.state && ((this.state = e), this.onlineStateHandler(e));
    }
    y_(e) {
      const t = `Could not reach Cloud Firestore backend. ${e}\nThis typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;
      this.f_ ? (Zi(t), (this.f_ = !1)) : Yi("OnlineStateTracker", t);
    }
    S_() {
      null !== this.m_ && (this.m_.cancel(), (this.m_ = null));
    }
  }
  class Oh {
    constructor(e, t, n, r, i) {
      (this.localStore = e),
        (this.datastore = t),
        (this.asyncQueue = n),
        (this.remoteSyncer = {}),
        (this.b_ = []),
        (this.D_ = new Map()),
        (this.C_ = new Set()),
        (this.v_ = []),
        (this.F_ = i),
        this.F_.ro((e) => {
          n.enqueueAndForget(async () => {
            Bh(this) &&
              (Yi(
                "RemoteStore",
                "Restarting streams for network reachability change."
              ),
              await (async function (e) {
                const t = is(e);
                t.C_.add(4),
                  await Lh(t),
                  t.M_.set("Unknown"),
                  t.C_.delete(4),
                  await Ph(t);
              })(this));
          });
        }),
        (this.M_ = new Dh(n, r));
    }
  }
  async function Ph(e) {
    if (Bh(e)) for (const t of e.v_) await t(!0);
  }
  async function Lh(e) {
    for (const t of e.v_) await t(!1);
  }
  function Mh(e, t) {
    const n = is(e);
    n.D_.has(t.targetId) ||
      (n.D_.set(t.targetId, t), jh(n) ? Fh(n) : Wh(n).Ho() && Uh(n, t));
  }
  function xh(e, t) {
    const n = is(e),
      r = Wh(n);
    n.D_.delete(t),
      r.Ho() && Vh(n, t),
      0 === n.D_.size && (r.Ho() ? r.Zo() : Bh(n) && n.M_.set("Unknown"));
  }
  function Uh(e, t) {
    if (
      (e.x_.Oe(t.targetId),
      t.resumeToken.approximateByteSize() > 0 ||
        t.snapshotVersion.compareTo(Es.min()) > 0)
    ) {
      const n = e.remoteSyncer.getRemoteKeysForTarget(t.targetId).size;
      t = t.withExpectedCount(n);
    }
    Wh(e).u_(t);
  }
  function Vh(e, t) {
    e.x_.Oe(t), Wh(e).c_(t);
  }
  function Fh(e) {
    (e.x_ = new lc({
      getRemoteKeysForTarget: (t) => e.remoteSyncer.getRemoteKeysForTarget(t),
      _t: (t) => e.D_.get(t) || null,
      nt: () => e.datastore.serializer.databaseId,
    })),
      Wh(e).start(),
      e.M_.g_();
  }
  function jh(e) {
    return Bh(e) && !Wh(e).jo() && e.D_.size > 0;
  }
  function Bh(e) {
    return 0 === is(e).C_.size;
  }
  function qh(e) {
    e.x_ = void 0;
  }
  async function $h(e) {
    e.D_.forEach((t, n) => {
      Uh(e, t);
    });
  }
  async function zh(e, t) {
    qh(e), jh(e) ? (e.M_.w_(t), Fh(e)) : e.M_.set("Unknown");
  }
  async function Hh(e, t, n) {
    if ((e.M_.set("Online"), t instanceof hc && 2 === t.state && t.cause))
      try {
        await (async function (e, t) {
          const n = t.cause;
          for (const r of t.targetIds)
            e.D_.has(r) &&
              (await e.remoteSyncer.rejectListen(r, n),
              e.D_.delete(r),
              e.x_.removeTarget(r));
        })(e, t);
      } catch (n) {
        Yi(
          "RemoteStore",
          "Failed to remove targets %s: %s ",
          t.targetIds.join(","),
          n
        ),
          await Kh(e, n);
      }
    else if (
      (t instanceof ac ? e.x_.$e(t) : t instanceof cc ? e.x_.Je(t) : e.x_.Ge(t),
      !n.isEqual(Es.min()))
    )
      try {
        const t = await dh(e.localStore);
        n.compareTo(t) >= 0 &&
          (await (function (e, t) {
            const n = e.x_.it(t);
            return (
              n.targetChanges.forEach((n, r) => {
                if (n.resumeToken.approximateByteSize() > 0) {
                  const i = e.D_.get(r);
                  i && e.D_.set(r, i.withResumeToken(n.resumeToken, t));
                }
              }),
              n.targetMismatches.forEach((t, n) => {
                const r = e.D_.get(t);
                if (!r) return;
                e.D_.set(
                  t,
                  r.withResumeToken(Ws.EMPTY_BYTE_STRING, r.snapshotVersion)
                ),
                  Vh(e, t);
                const i = new Fc(r.target, t, n, r.sequenceNumber);
                Uh(e, i);
              }),
              e.remoteSyncer.applyRemoteEvent(n)
            );
          })(e, n));
      } catch (t) {
        Yi("RemoteStore", "Failed to raise snapshot:", t), await Kh(e, t);
      }
  }
  async function Kh(e, t, n) {
    if (!Ls(t)) throw t;
    e.C_.add(1),
      await Lh(e),
      e.M_.set("Offline"),
      n || (n = () => dh(e.localStore)),
      e.asyncQueue.enqueueRetryable(async () => {
        Yi("RemoteStore", "Retrying IndexedDB access"),
          await n(),
          e.C_.delete(1),
          await Ph(e);
      });
  }
  async function Gh(e, t) {
    const n = is(e);
    n.asyncQueue.verifyOperationInProgress(),
      Yi("RemoteStore", "RemoteStore received new credentials");
    const r = Bh(n);
    n.C_.add(3),
      await Lh(n),
      r && n.M_.set("Unknown"),
      await n.remoteSyncer.handleCredentialChange(t),
      n.C_.delete(3),
      await Ph(n);
  }
  function Wh(e) {
    return (
      e.O_ ||
        ((e.O_ = (function (e, t, n) {
          const r = is(e);
          return (
            r.A_(),
            new Nh(
              t,
              r.connection,
              r.authCredentials,
              r.appCheckCredentials,
              r.serializer,
              n
            )
          );
        })(e.datastore, e.asyncQueue, {
          ho: $h.bind(null, e),
          Io: zh.bind(null, e),
          a_: Hh.bind(null, e),
        })),
        e.v_.push(async (t) => {
          t
            ? (e.O_.Yo(), jh(e) ? Fh(e) : e.M_.set("Unknown"))
            : (await e.O_.stop(), qh(e));
        })),
      e.O_
    );
  }
  class Qh {
    constructor(e, t, n, r, i) {
      (this.asyncQueue = e),
        (this.timerId = t),
        (this.targetTimeMs = n),
        (this.op = r),
        (this.removalCallback = i),
        (this.deferred = new as()),
        (this.then = this.deferred.promise.then.bind(this.deferred.promise)),
        this.deferred.promise.catch((e) => {});
    }
    get promise() {
      return this.deferred.promise;
    }
    static createAndSchedule(e, t, n, r, i) {
      const s = Date.now() + n,
        o = new Qh(e, t, s, r, i);
      return o.start(n), o;
    }
    start(e) {
      this.timerHandle = setTimeout(() => this.handleDelayElapsed(), e);
    }
    skipDelay() {
      return this.handleDelayElapsed();
    }
    cancel(e) {
      null !== this.timerHandle &&
        (this.clearTimeout(),
        this.deferred.reject(
          new os(ss.CANCELLED, "Operation cancelled" + (e ? ": " + e : ""))
        ));
    }
    handleDelayElapsed() {
      this.asyncQueue.enqueueAndForget(() =>
        null !== this.timerHandle
          ? (this.clearTimeout(),
            this.op().then((e) => this.deferred.resolve(e)))
          : Promise.resolve()
      );
    }
    clearTimeout() {
      null !== this.timerHandle &&
        (this.removalCallback(this),
        clearTimeout(this.timerHandle),
        (this.timerHandle = null));
    }
  }
  function Xh(e, t) {
    if ((Zi("AsyncQueue", `${t}: ${e}`), Ls(e)))
      return new os(ss.UNAVAILABLE, `${t}: ${e}`);
    throw e;
  }
  class Jh {
    constructor(e) {
      (this.comparator = e
        ? (t, n) => e(t, n) || Cs.comparator(t.key, n.key)
        : (e, t) => Cs.comparator(e.key, t.key)),
        (this.keyedMap = fa()),
        (this.sortedSet = new Bs(this.comparator));
    }
    static emptySet(e) {
      return new Jh(e.comparator);
    }
    has(e) {
      return null != this.keyedMap.get(e);
    }
    get(e) {
      return this.keyedMap.get(e);
    }
    first() {
      return this.sortedSet.minKey();
    }
    last() {
      return this.sortedSet.maxKey();
    }
    isEmpty() {
      return this.sortedSet.isEmpty();
    }
    indexOf(e) {
      const t = this.keyedMap.get(e);
      return t ? this.sortedSet.indexOf(t) : -1;
    }
    get size() {
      return this.sortedSet.size;
    }
    forEach(e) {
      this.sortedSet.inorderTraversal((t, n) => (e(t), !1));
    }
    add(e) {
      const t = this.delete(e.key);
      return t.copy(t.keyedMap.insert(e.key, e), t.sortedSet.insert(e, null));
    }
    delete(e) {
      const t = this.get(e);
      return t
        ? this.copy(this.keyedMap.remove(e), this.sortedSet.remove(t))
        : this;
    }
    isEqual(e) {
      if (!(e instanceof Jh)) return !1;
      if (this.size !== e.size) return !1;
      const t = this.sortedSet.getIterator(),
        n = e.sortedSet.getIterator();
      for (; t.hasNext(); ) {
        const e = t.getNext().key,
          r = n.getNext().key;
        if (!e.isEqual(r)) return !1;
      }
      return !0;
    }
    toString() {
      const e = [];
      return (
        this.forEach((t) => {
          e.push(t.toString());
        }),
        0 === e.length
          ? "DocumentSet ()"
          : "DocumentSet (\n  " + e.join("  \n") + "\n)"
      );
    }
    copy(e, t) {
      const n = new Jh();
      return (
        (n.comparator = this.comparator), (n.keyedMap = e), (n.sortedSet = t), n
      );
    }
  }
  class Yh {
    constructor() {
      this.B_ = new Bs(Cs.comparator);
    }
    track(e) {
      const t = e.doc.key,
        n = this.B_.get(t);
      n
        ? 0 !== e.type && 3 === n.type
          ? (this.B_ = this.B_.insert(t, e))
          : 3 === e.type && 1 !== n.type
          ? (this.B_ = this.B_.insert(t, { type: n.type, doc: e.doc }))
          : 2 === e.type && 2 === n.type
          ? (this.B_ = this.B_.insert(t, { type: 2, doc: e.doc }))
          : 2 === e.type && 0 === n.type
          ? (this.B_ = this.B_.insert(t, { type: 0, doc: e.doc }))
          : 1 === e.type && 0 === n.type
          ? (this.B_ = this.B_.remove(t))
          : 1 === e.type && 2 === n.type
          ? (this.B_ = this.B_.insert(t, { type: 1, doc: n.doc }))
          : 0 === e.type && 1 === n.type
          ? (this.B_ = this.B_.insert(t, { type: 2, doc: e.doc }))
          : ns()
        : (this.B_ = this.B_.insert(t, e));
    }
    L_() {
      const e = [];
      return (
        this.B_.inorderTraversal((t, n) => {
          e.push(n);
        }),
        e
      );
    }
  }
  class Zh {
    constructor(e, t, n, r, i, s, o, a, c) {
      (this.query = e),
        (this.docs = t),
        (this.oldDocs = n),
        (this.docChanges = r),
        (this.mutatedKeys = i),
        (this.fromCache = s),
        (this.syncStateChanged = o),
        (this.excludesMetadataChanges = a),
        (this.hasCachedResults = c);
    }
    static fromInitialDocuments(e, t, n, r, i) {
      const s = [];
      return (
        t.forEach((e) => {
          s.push({ type: 0, doc: e });
        }),
        new Zh(e, t, Jh.emptySet(t), s, n, r, !0, !1, i)
      );
    }
    get hasPendingWrites() {
      return !this.mutatedKeys.isEmpty();
    }
    isEqual(e) {
      if (
        !(
          this.fromCache === e.fromCache &&
          this.hasCachedResults === e.hasCachedResults &&
          this.syncStateChanged === e.syncStateChanged &&
          this.mutatedKeys.isEqual(e.mutatedKeys) &&
          ra(this.query, e.query) &&
          this.docs.isEqual(e.docs) &&
          this.oldDocs.isEqual(e.oldDocs)
        )
      )
        return !1;
      const t = this.docChanges,
        n = e.docChanges;
      if (t.length !== n.length) return !1;
      for (let e = 0; e < t.length; e++)
        if (t[e].type !== n[e].type || !t[e].doc.isEqual(n[e].doc)) return !1;
      return !0;
    }
  }
  class eu {
    constructor() {
      (this.k_ = void 0), (this.listeners = []);
    }
  }
  class tu {
    constructor() {
      (this.queries = new ha((e) => ia(e), ra)),
        (this.onlineState = "Unknown"),
        (this.q_ = new Set());
    }
  }
  function nu(e, t) {
    const n = is(e);
    let r = !1;
    for (const e of t) {
      const t = e.query,
        i = n.queries.get(t);
      if (i) {
        for (const t of i.listeners) t.K_(e) && (r = !0);
        i.k_ = e;
      }
    }
    r && iu(n);
  }
  function ru(e, t, n) {
    const r = is(e),
      i = r.queries.get(t);
    if (i) for (const e of i.listeners) e.onError(n);
    r.queries.delete(t);
  }
  function iu(e) {
    e.q_.forEach((e) => {
      e.next();
    });
  }
  class su {
    constructor(e, t, n) {
      (this.query = e),
        (this.U_ = t),
        (this.W_ = !1),
        (this.G_ = null),
        (this.onlineState = "Unknown"),
        (this.options = n || {});
    }
    K_(e) {
      if (!this.options.includeMetadataChanges) {
        const t = [];
        for (const n of e.docChanges) 3 !== n.type && t.push(n);
        e = new Zh(
          e.query,
          e.docs,
          e.oldDocs,
          t,
          e.mutatedKeys,
          e.fromCache,
          e.syncStateChanged,
          !0,
          e.hasCachedResults
        );
      }
      let t = !1;
      return (
        this.W_
          ? this.z_(e) && (this.U_.next(e), (t = !0))
          : this.j_(e, this.onlineState) && (this.H_(e), (t = !0)),
        (this.G_ = e),
        t
      );
    }
    onError(e) {
      this.U_.error(e);
    }
    Q_(e) {
      this.onlineState = e;
      let t = !1;
      return (
        this.G_ &&
          !this.W_ &&
          this.j_(this.G_, e) &&
          (this.H_(this.G_), (t = !0)),
        t
      );
    }
    j_(e, t) {
      if (!e.fromCache) return !0;
      const n = "Offline" !== t;
      return (
        (!this.options.J_ || !n) &&
        (!e.docs.isEmpty() || e.hasCachedResults || "Offline" === t)
      );
    }
    z_(e) {
      if (e.docChanges.length > 0) return !0;
      const t = this.G_ && this.G_.hasPendingWrites !== e.hasPendingWrites;
      return (
        !(!e.syncStateChanged && !t) &&
        !0 === this.options.includeMetadataChanges
      );
    }
    H_(e) {
      (e = Zh.fromInitialDocuments(
        e.query,
        e.docs,
        e.mutatedKeys,
        e.fromCache,
        e.hasCachedResults
      )),
        (this.W_ = !0),
        this.U_.next(e);
    }
  }
  class ou {
    constructor(e) {
      this.key = e;
    }
  }
  class au {
    constructor(e) {
      this.key = e;
    }
  }
  class cu {
    constructor(e, t) {
      (this.query = e),
        (this.ia = t),
        (this.sa = null),
        (this.hasCachedResults = !1),
        (this.current = !1),
        (this.oa = wa()),
        (this.mutatedKeys = wa()),
        (this._a = aa(e)),
        (this.aa = new Jh(this._a));
    }
    get ua() {
      return this.ia;
    }
    ca(e, t) {
      const n = t ? t.la : new Yh(),
        r = t ? t.aa : this.aa;
      let i = t ? t.mutatedKeys : this.mutatedKeys,
        s = r,
        o = !1;
      const a =
          "F" === this.query.limitType && r.size === this.query.limit
            ? r.last()
            : null,
        c =
          "L" === this.query.limitType && r.size === this.query.limit
            ? r.first()
            : null;
      if (
        (e.inorderTraversal((e, t) => {
          const h = r.get(e),
            u = oa(this.query, t) ? t : null,
            l = !!h && this.mutatedKeys.has(h.key),
            d =
              !!u &&
              (u.hasLocalMutations ||
                (this.mutatedKeys.has(u.key) && u.hasCommittedMutations));
          let f = !1;
          h && u
            ? h.data.isEqual(u.data)
              ? l !== d && (n.track({ type: 3, doc: u }), (f = !0))
              : this.ha(h, u) ||
                (n.track({ type: 2, doc: u }),
                (f = !0),
                ((a && this._a(u, a) > 0) || (c && this._a(u, c) < 0)) &&
                  (o = !0))
            : !h && u
            ? (n.track({ type: 0, doc: u }), (f = !0))
            : h &&
              !u &&
              (n.track({ type: 1, doc: h }), (f = !0), (a || c) && (o = !0)),
            f &&
              (u
                ? ((s = s.add(u)), (i = d ? i.add(e) : i.delete(e)))
                : ((s = s.delete(e)), (i = i.delete(e))));
        }),
        null !== this.query.limit)
      )
        for (; s.size > this.query.limit; ) {
          const e = "F" === this.query.limitType ? s.last() : s.first();
          (s = s.delete(e.key)),
            (i = i.delete(e.key)),
            n.track({ type: 1, doc: e });
        }
      return { aa: s, la: n, Zi: o, mutatedKeys: i };
    }
    ha(e, t) {
      return (
        e.hasLocalMutations && t.hasCommittedMutations && !t.hasLocalMutations
      );
    }
    applyChanges(e, t, n) {
      const r = this.aa;
      (this.aa = e.aa), (this.mutatedKeys = e.mutatedKeys);
      const i = e.la.L_();
      i.sort(
        (e, t) =>
          (function (e, t) {
            const n = (e) => {
              switch (e) {
                case 0:
                  return 1;
                case 2:
                case 3:
                  return 2;
                case 1:
                  return 0;
                default:
                  return ns();
              }
            };
            return n(e) - n(t);
          })(e.type, t.type) || this._a(e.doc, t.doc)
      ),
        this.Pa(n);
      const s = t ? this.Ia() : [],
        o = 0 === this.oa.size && this.current ? 1 : 0,
        a = o !== this.sa;
      return (
        (this.sa = o),
        0 !== i.length || a
          ? {
              snapshot: new Zh(
                this.query,
                e.aa,
                r,
                i,
                e.mutatedKeys,
                0 === o,
                a,
                !1,
                !!n && n.resumeToken.approximateByteSize() > 0
              ),
              Ta: s,
            }
          : { Ta: s }
      );
    }
    Q_(e) {
      return this.current && "Offline" === e
        ? ((this.current = !1),
          this.applyChanges(
            {
              aa: this.aa,
              la: new Yh(),
              mutatedKeys: this.mutatedKeys,
              Zi: !1,
            },
            !1
          ))
        : { Ta: [] };
    }
    Ea(e) {
      return (
        !this.ia.has(e) && !!this.aa.has(e) && !this.aa.get(e).hasLocalMutations
      );
    }
    Pa(e) {
      e &&
        (e.addedDocuments.forEach((e) => (this.ia = this.ia.add(e))),
        e.modifiedDocuments.forEach((e) => {}),
        e.removedDocuments.forEach((e) => (this.ia = this.ia.delete(e))),
        (this.current = e.current));
    }
    Ia() {
      if (!this.current) return [];
      const e = this.oa;
      (this.oa = wa()),
        this.aa.forEach((e) => {
          this.Ea(e.key) && (this.oa = this.oa.add(e.key));
        });
      const t = [];
      return (
        e.forEach((e) => {
          this.oa.has(e) || t.push(new au(e));
        }),
        this.oa.forEach((n) => {
          e.has(n) || t.push(new ou(n));
        }),
        t
      );
    }
    da(e) {
      (this.ia = e.ls), (this.oa = wa());
      const t = this.ca(e.documents);
      return this.applyChanges(t, !0);
    }
    Aa() {
      return Zh.fromInitialDocuments(
        this.query,
        this.aa,
        this.mutatedKeys,
        0 === this.sa,
        this.hasCachedResults
      );
    }
  }
  class hu {
    constructor(e, t, n) {
      (this.query = e), (this.targetId = t), (this.view = n);
    }
  }
  class uu {
    constructor(e) {
      (this.key = e), (this.Ra = !1);
    }
  }
  class lu {
    constructor(e, t, n, r, i, s) {
      (this.localStore = e),
        (this.remoteStore = t),
        (this.eventManager = n),
        (this.sharedClientState = r),
        (this.currentUser = i),
        (this.maxConcurrentLimboResolutions = s),
        (this.Va = {}),
        (this.ma = new ha((e) => ia(e), ra)),
        (this.fa = new Map()),
        (this.ga = new Set()),
        (this.pa = new Bs(Cs.comparator)),
        (this.ya = new Map()),
        (this.wa = new Yc()),
        (this.Sa = {}),
        (this.ba = new Map()),
        (this.Da = Kc.Nn()),
        (this.onlineState = "Unknown"),
        (this.Ca = void 0);
    }
    get isPrimaryClient() {
      return !0 === this.Ca;
    }
  }
  async function du(e, t) {
    const n = (function (e) {
      const t = is(e);
      return (
        (t.remoteStore.remoteSyncer.applyRemoteEvent = pu.bind(null, t)),
        (t.remoteStore.remoteSyncer.getRemoteKeysForTarget = bu.bind(null, t)),
        (t.remoteStore.remoteSyncer.rejectListen = mu.bind(null, t)),
        (t.Va.a_ = nu.bind(null, t.eventManager)),
        (t.Va.Fa = ru.bind(null, t.eventManager)),
        t
      );
    })(e);
    let r, i;
    const s = n.ma.get(t);
    if (s)
      (r = s.targetId),
        n.sharedClientState.addLocalQueryTarget(r),
        (i = s.view.Aa());
    else {
      const e = await (function (e, t) {
          const n = is(e);
          return n.persistence
            .runTransaction("Allocate target", "readwrite", (e) => {
              let r;
              return n.qr
                .getTargetData(e, t)
                .next((i) =>
                  i
                    ? ((r = i), Ps.resolve(r))
                    : n.qr
                        .allocateTargetId(e)
                        .next(
                          (i) => (
                            (r = new Fc(
                              t,
                              i,
                              "TargetPurposeListen",
                              e.currentSequenceNumber
                            )),
                            n.qr.addTargetData(e, r).next(() => r)
                          )
                        )
                );
            })
            .then((e) => {
              const r = n.ts.get(e.targetId);
              return (
                (null === r ||
                  e.snapshotVersion.compareTo(r.snapshotVersion) > 0) &&
                  ((n.ts = n.ts.insert(e.targetId, e)),
                  n.ns.set(t, e.targetId)),
                e
              );
            });
        })(n.localStore, ea(t)),
        s = n.sharedClientState.addLocalQueryTarget(e.targetId);
      (r = e.targetId),
        (i = await (async function (e, t, n, r, i) {
          e.va = (t, n, r) =>
            (async function (e, t, n, r) {
              let i = t.view.ca(n);
              i.Zi &&
                (i = await ph(e.localStore, t.query, !1).then(
                  ({ documents: e }) => t.view.ca(e, i)
                ));
              const s = r && r.targetChanges.get(t.targetId),
                o = t.view.applyChanges(i, e.isPrimaryClient, s);
              return wu(e, t.targetId, o.Ta), o.snapshot;
            })(e, t, n, r);
          const s = await ph(e.localStore, t, !0),
            o = new cu(t, s.ls),
            a = o.ca(s.documents),
            c = oc.createSynthesizedTargetChangeForCurrentChange(
              n,
              r && "Offline" !== e.onlineState,
              i
            ),
            h = o.applyChanges(a, e.isPrimaryClient, c);
          wu(e, n, h.Ta);
          const u = new hu(t, n, o);
          return (
            e.ma.set(t, u),
            e.fa.has(n) ? e.fa.get(n).push(t) : e.fa.set(n, [t]),
            h.snapshot
          );
        })(n, t, r, "current" === s, e.resumeToken)),
        n.isPrimaryClient && Mh(n.remoteStore, e);
    }
    return i;
  }
  async function fu(e, t) {
    const n = is(e),
      r = n.ma.get(t),
      i = n.fa.get(r.targetId);
    if (i.length > 1)
      return (
        n.fa.set(
          r.targetId,
          i.filter((e) => !ra(e, t))
        ),
        void n.ma.delete(t)
      );
    n.isPrimaryClient
      ? (n.sharedClientState.removeLocalQueryTarget(r.targetId),
        n.sharedClientState.isActiveQueryTarget(r.targetId) ||
          (await fh(n.localStore, r.targetId, !1)
            .then(() => {
              n.sharedClientState.clearQueryState(r.targetId),
                xh(n.remoteStore, r.targetId),
                yu(n, r.targetId);
            })
            .catch(Os)))
      : (yu(n, r.targetId), await fh(n.localStore, r.targetId, !0));
  }
  async function pu(e, t) {
    const n = is(e);
    try {
      const e = await (function (e, t) {
        const n = is(e),
          r = t.snapshotVersion;
        let i = n.ts;
        return n.persistence
          .runTransaction("Apply remote event", "readwrite-primary", (e) => {
            const s = n.ss.newChangeBuffer({ trackRemovals: !0 });
            i = n.ts;
            const o = [];
            t.targetChanges.forEach((s, a) => {
              const c = i.get(a);
              if (!c) return;
              o.push(
                n.qr
                  .removeMatchingKeys(e, s.removedDocuments, a)
                  .next(() => n.qr.addMatchingKeys(e, s.addedDocuments, a))
              );
              let h = c.withSequenceNumber(e.currentSequenceNumber);
              null !== t.targetMismatches.get(a)
                ? (h = h
                    .withResumeToken(Ws.EMPTY_BYTE_STRING, Es.min())
                    .withLastLimboFreeSnapshotVersion(Es.min()))
                : s.resumeToken.approximateByteSize() > 0 &&
                  (h = h.withResumeToken(s.resumeToken, r)),
                (i = i.insert(a, h)),
                (function (e, t, n) {
                  return (
                    0 === e.resumeToken.approximateByteSize() ||
                    t.snapshotVersion.toMicroseconds() -
                      e.snapshotVersion.toMicroseconds() >=
                      3e8 ||
                    n.addedDocuments.size +
                      n.modifiedDocuments.size +
                      n.removedDocuments.size >
                      0
                  );
                })(c, h, s) && o.push(n.qr.updateTargetData(e, h));
            });
            let a = la(),
              c = wa();
            if (
              (t.documentUpdates.forEach((r) => {
                t.resolvedLimboDocuments.has(r) &&
                  o.push(
                    n.persistence.referenceDelegate.updateLimboDocument(e, r)
                  );
              }),
              o.push(
                (function (e, t, n) {
                  let r = wa(),
                    i = wa();
                  return (
                    n.forEach((e) => (r = r.add(e))),
                    t.getEntries(e, r).next((e) => {
                      let r = la();
                      return (
                        n.forEach((n, s) => {
                          const o = e.get(n);
                          s.isFoundDocument() !== o.isFoundDocument() &&
                            (i = i.add(n)),
                            s.isNoDocument() && s.version.isEqual(Es.min())
                              ? (t.removeEntry(n, s.readTime),
                                (r = r.insert(n, s)))
                              : !o.isValidDocument() ||
                                s.version.compareTo(o.version) > 0 ||
                                (0 === s.version.compareTo(o.version) &&
                                  o.hasPendingWrites)
                              ? (t.addEntry(s), (r = r.insert(n, s)))
                              : Yi(
                                  "LocalStore",
                                  "Ignoring outdated watch update for ",
                                  n,
                                  ". Current version:",
                                  o.version,
                                  " Watch version:",
                                  s.version
                                );
                        }),
                        { us: r, cs: i }
                      );
                    })
                  );
                })(e, s, t.documentUpdates).next((e) => {
                  (a = e.us), (c = e.cs);
                })
              ),
              !r.isEqual(Es.min()))
            ) {
              const t = n.qr
                .getLastRemoteSnapshotVersion(e)
                .next((t) =>
                  n.qr.setTargetsMetadata(e, e.currentSequenceNumber, r)
                );
              o.push(t);
            }
            return Ps.waitFor(o)
              .next(() => s.apply(e))
              .next(() => n.localDocuments.getLocalViewOfDocuments(e, a, c))
              .next(() => a);
          })
          .then((e) => ((n.ts = i), e));
      })(n.localStore, t);
      t.targetChanges.forEach((e, t) => {
        const r = n.ya.get(t);
        r &&
          (rs(
            e.addedDocuments.size +
              e.modifiedDocuments.size +
              e.removedDocuments.size <=
              1
          ),
          e.addedDocuments.size > 0
            ? (r.Ra = !0)
            : e.modifiedDocuments.size > 0
            ? rs(r.Ra)
            : e.removedDocuments.size > 0 && (rs(r.Ra), (r.Ra = !1)));
      }),
        await Iu(n, e, t);
    } catch (e) {
      await Os(e);
    }
  }
  function gu(e, t, n) {
    const r = is(e);
    if ((r.isPrimaryClient && 0 === n) || (!r.isPrimaryClient && 1 === n)) {
      const e = [];
      r.ma.forEach((n, r) => {
        const i = r.view.Q_(t);
        i.snapshot && e.push(i.snapshot);
      }),
        (function (e, t) {
          const n = is(e);
          n.onlineState = t;
          let r = !1;
          n.queries.forEach((e, n) => {
            for (const e of n.listeners) e.Q_(t) && (r = !0);
          }),
            r && iu(n);
        })(r.eventManager, t),
        e.length && r.Va.a_(e),
        (r.onlineState = t),
        r.isPrimaryClient && r.sharedClientState.setOnlineState(t);
    }
  }
  async function mu(e, t, n) {
    const r = is(e);
    r.sharedClientState.updateQueryState(t, "rejected", n);
    const i = r.ya.get(t),
      s = i && i.key;
    if (s) {
      let e = new Bs(Cs.comparator);
      e = e.insert(s, Io.newNoDocument(s, Es.min()));
      const n = wa().add(s),
        i = new sc(Es.min(), new Map(), new Bs(vs), e, n);
      await pu(r, i), (r.pa = r.pa.remove(s)), r.ya.delete(t), Eu(r);
    } else
      await fh(r.localStore, t, !1)
        .then(() => yu(r, t, n))
        .catch(Os);
  }
  function yu(e, t, n = null) {
    e.sharedClientState.removeLocalQueryTarget(t);
    for (const r of e.fa.get(t)) e.ma.delete(r), n && e.Va.Fa(r, n);
    e.fa.delete(t),
      e.isPrimaryClient &&
        e.wa.Rr(t).forEach((t) => {
          e.wa.containsKey(t) || vu(e, t);
        });
  }
  function vu(e, t) {
    e.ga.delete(t.path.canonicalString());
    const n = e.pa.get(t);
    null !== n &&
      (xh(e.remoteStore, n), (e.pa = e.pa.remove(t)), e.ya.delete(n), Eu(e));
  }
  function wu(e, t, n) {
    for (const r of n)
      r instanceof ou
        ? (e.wa.addReference(r.key, t), _u(e, r))
        : r instanceof au
        ? (Yi("SyncEngine", "Document no longer in limbo: " + r.key),
          e.wa.removeReference(r.key, t),
          e.wa.containsKey(r.key) || vu(e, r.key))
        : ns();
  }
  function _u(e, t) {
    const n = t.key,
      r = n.path.canonicalString();
    e.pa.get(n) ||
      e.ga.has(r) ||
      (Yi("SyncEngine", "New document in limbo: " + n), e.ga.add(r), Eu(e));
  }
  function Eu(e) {
    for (; e.ga.size > 0 && e.pa.size < e.maxConcurrentLimboResolutions; ) {
      const t = e.ga.values().next().value;
      e.ga.delete(t);
      const n = new Cs(Ts.fromString(t)),
        r = e.Da.next();
      e.ya.set(r, new uu(n)),
        (e.pa = e.pa.insert(n, r)),
        Mh(
          e.remoteStore,
          new Fc(ea(Xo(n.path)), r, "TargetPurposeLimboResolution", Ms._e)
        );
    }
  }
  async function Iu(e, t, n) {
    const r = is(e),
      i = [],
      s = [],
      o = [];
    r.ma.isEmpty() ||
      (r.ma.forEach((e, a) => {
        o.push(
          r.va(a, t, n).then((e) => {
            if (
              ((e || n) &&
                r.isPrimaryClient &&
                r.sharedClientState.updateQueryState(
                  a.targetId,
                  (null == e ? void 0 : e.fromCache) ? "not-current" : "current"
                ),
              e)
            ) {
              i.push(e);
              const t = ah.Qi(a.targetId, e);
              s.push(t);
            }
          })
        );
      }),
      await Promise.all(o),
      r.Va.a_(i),
      await (async function (e, t) {
        const n = is(e);
        try {
          await n.persistence.runTransaction(
            "notifyLocalViewChanges",
            "readwrite",
            (e) =>
              Ps.forEach(t, (t) =>
                Ps.forEach(t.ki, (r) =>
                  n.persistence.referenceDelegate.addReference(e, t.targetId, r)
                ).next(() =>
                  Ps.forEach(t.qi, (r) =>
                    n.persistence.referenceDelegate.removeReference(
                      e,
                      t.targetId,
                      r
                    )
                  )
                )
              )
          );
        } catch (e) {
          if (!Ls(e)) throw e;
          Yi("LocalStore", "Failed to update sequence numbers: " + e);
        }
        for (const e of t) {
          const t = e.targetId;
          if (!e.fromCache) {
            const e = n.ts.get(t),
              r = e.snapshotVersion,
              i = e.withLastLimboFreeSnapshotVersion(r);
            n.ts = n.ts.insert(t, i);
          }
        }
      })(r.localStore, s));
  }
  async function Tu(e, t) {
    const n = is(e);
    if (!n.currentUser.isEqual(t)) {
      Yi("SyncEngine", "User change. New user:", t.toKey());
      const e = await lh(n.localStore, t);
      (n.currentUser = t),
        (function (e, t) {
          e.ba.forEach((e) => {
            e.forEach((e) => {
              e.reject(
                new os(
                  ss.CANCELLED,
                  "'waitForPendingWrites' promise is rejected due to a user change."
                )
              );
            });
          }),
            e.ba.clear();
        })(n),
        n.sharedClientState.handleUserChange(
          t,
          e.removedBatchIds,
          e.addedBatchIds
        ),
        await Iu(n, e._s);
    }
  }
  function bu(e, t) {
    const n = is(e),
      r = n.ya.get(t);
    if (r && r.Ra) return wa().add(r.key);
    {
      let e = wa();
      const r = n.fa.get(t);
      if (!r) return e;
      for (const t of r) {
        const r = n.ma.get(t);
        e = e.unionWith(r.view.ua);
      }
      return e;
    }
  }
  class Su {
    constructor() {
      this.synchronizeTabs = !1;
    }
    async initialize(e) {
      (this.serializer = Ch(e.databaseInfo.databaseId)),
        (this.sharedClientState = this.createSharedClientState(e)),
        (this.persistence = this.createPersistence(e)),
        await this.persistence.start(),
        (this.localStore = this.createLocalStore(e)),
        (this.gcScheduler = this.createGarbageCollectionScheduler(
          e,
          this.localStore
        )),
        (this.indexBackfillerScheduler = this.createIndexBackfillerScheduler(
          e,
          this.localStore
        ));
    }
    createGarbageCollectionScheduler(e, t) {
      return null;
    }
    createIndexBackfillerScheduler(e, t) {
      return null;
    }
    createLocalStore(e) {
      return (function (e, t, n, r) {
        return new uh(e, t, n, r);
      })(this.persistence, new hh(), e.initialUser, this.serializer);
    }
    createPersistence(e) {
      return new ih(oh.jr, this.serializer);
    }
    createSharedClientState(e) {
      return new mh();
    }
    async terminate() {
      this.gcScheduler && this.gcScheduler.stop(),
        await this.sharedClientState.shutdown(),
        await this.persistence.shutdown();
    }
  }
  class Cu {
    async initialize(e, t) {
      this.localStore ||
        ((this.localStore = e.localStore),
        (this.sharedClientState = e.sharedClientState),
        (this.datastore = this.createDatastore(t)),
        (this.remoteStore = this.createRemoteStore(t)),
        (this.eventManager = this.createEventManager(t)),
        (this.syncEngine = this.createSyncEngine(t, !e.synchronizeTabs)),
        (this.sharedClientState.onlineStateHandler = (e) =>
          gu(this.syncEngine, e, 1)),
        (this.remoteStore.remoteSyncer.handleCredentialChange = Tu.bind(
          null,
          this.syncEngine
        )),
        await (async function (e, t) {
          const n = is(e);
          t
            ? (n.C_.delete(2), await Ph(n))
            : t || (n.C_.add(2), await Lh(n), n.M_.set("Unknown"));
        })(this.remoteStore, this.syncEngine.isPrimaryClient));
    }
    createEventManager(e) {
      return new tu();
    }
    createDatastore(e) {
      const t = Ch(e.databaseInfo.databaseId),
        n = (function (e) {
          return new bh(e);
        })(e.databaseInfo);
      return (function (e, t, n, r) {
        return new Rh(e, t, n, r);
      })(e.authCredentials, e.appCheckCredentials, n, t);
    }
    createRemoteStore(e) {
      return (function (e, t, n, r, i) {
        return new Oh(e, t, n, r, i);
      })(
        this.localStore,
        this.datastore,
        e.asyncQueue,
        (e) => gu(this.syncEngine, e, 0),
        vh.D() ? new vh() : new yh()
      );
    }
    createSyncEngine(e, t) {
      return (function (e, t, n, r, i, s, o) {
        const a = new lu(e, t, n, r, i, s);
        return o && (a.Ca = !0), a;
      })(
        this.localStore,
        this.remoteStore,
        this.eventManager,
        this.sharedClientState,
        e.initialUser,
        e.maxConcurrentLimboResolutions,
        t
      );
    }
    terminate() {
      return (async function (e) {
        const t = is(e);
        Yi("RemoteStore", "RemoteStore shutting down."),
          t.C_.add(5),
          await Lh(t),
          t.F_.shutdown(),
          t.M_.set("Unknown");
      })(this.remoteStore);
    }
  }
  class ku {
    constructor(e) {
      (this.observer = e), (this.muted = !1);
    }
    next(e) {
      this.observer.next && this.Oa(this.observer.next, e);
    }
    error(e) {
      this.observer.error
        ? this.Oa(this.observer.error, e)
        : Zi("Uncaught Error in snapshot listener:", e.toString());
    }
    Na() {
      this.muted = !0;
    }
    Oa(e, t) {
      this.muted ||
        setTimeout(() => {
          this.muted || e(t);
        }, 0);
    }
  }
  class Au {
    constructor(e, t, n, r) {
      (this.authCredentials = e),
        (this.appCheckCredentials = t),
        (this.asyncQueue = n),
        (this.databaseInfo = r),
        (this.user = Wi.UNAUTHENTICATED),
        (this.clientId = ys.newId()),
        (this.authCredentialListener = () => Promise.resolve()),
        (this.appCheckCredentialListener = () => Promise.resolve()),
        this.authCredentials.start(n, async (e) => {
          Yi("FirestoreClient", "Received user=", e.uid),
            await this.authCredentialListener(e),
            (this.user = e);
        }),
        this.appCheckCredentials.start(
          n,
          (e) => (
            Yi("FirestoreClient", "Received new app check token=", e),
            this.appCheckCredentialListener(e, this.user)
          )
        );
    }
    async getConfiguration() {
      return {
        asyncQueue: this.asyncQueue,
        databaseInfo: this.databaseInfo,
        clientId: this.clientId,
        authCredentials: this.authCredentials,
        appCheckCredentials: this.appCheckCredentials,
        initialUser: this.user,
        maxConcurrentLimboResolutions: 100,
      };
    }
    setCredentialChangeListener(e) {
      this.authCredentialListener = e;
    }
    setAppCheckTokenChangeListener(e) {
      this.appCheckCredentialListener = e;
    }
    verifyNotTerminated() {
      if (this.asyncQueue.isShuttingDown)
        throw new os(
          ss.FAILED_PRECONDITION,
          "The client has already been terminated."
        );
    }
    terminate() {
      this.asyncQueue.enterRestrictedMode();
      const e = new as();
      return (
        this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async () => {
          try {
            this._onlineComponents &&
              (await this._onlineComponents.terminate()),
              this._offlineComponents &&
                (await this._offlineComponents.terminate()),
              this.authCredentials.shutdown(),
              this.appCheckCredentials.shutdown(),
              e.resolve();
          } catch (t) {
            const n = Xh(t, "Failed to shutdown persistence");
            e.reject(n);
          }
        }),
        e.promise
      );
    }
  }
  async function Nu(e, t) {
    e.asyncQueue.verifyOperationInProgress(),
      Yi("FirestoreClient", "Initializing OfflineComponentProvider");
    const n = await e.getConfiguration();
    await t.initialize(n);
    let r = n.initialUser;
    e.setCredentialChangeListener(async (e) => {
      r.isEqual(e) || (await lh(t.localStore, e), (r = e));
    }),
      t.persistence.setDatabaseDeletedListener(() => e.terminate()),
      (e._offlineComponents = t);
  }
  async function Ru(e, t) {
    e.asyncQueue.verifyOperationInProgress();
    const n = await (async function (e) {
      if (!e._offlineComponents)
        if (e._uninitializedComponentsProvider) {
          Yi("FirestoreClient", "Using user provided OfflineComponentProvider");
          try {
            await Nu(e, e._uninitializedComponentsProvider._offline);
          } catch (t) {
            const n = t;
            if (
              !(function (e) {
                return "FirebaseError" === e.name
                  ? e.code === ss.FAILED_PRECONDITION ||
                      e.code === ss.UNIMPLEMENTED
                  : !(
                      "undefined" != typeof DOMException &&
                      e instanceof DOMException
                    ) ||
                      22 === e.code ||
                      20 === e.code ||
                      11 === e.code;
              })(n)
            )
              throw n;
            es(
              "Error using user provided cache. Falling back to memory cache: " +
                n
            ),
              await Nu(e, new Su());
          }
        } else
          Yi("FirestoreClient", "Using default OfflineComponentProvider"),
            await Nu(e, new Su());
      return e._offlineComponents;
    })(e);
    Yi("FirestoreClient", "Initializing OnlineComponentProvider");
    const r = await e.getConfiguration();
    await t.initialize(n, r),
      e.setCredentialChangeListener((e) => Gh(t.remoteStore, e)),
      e.setAppCheckTokenChangeListener((e, n) => Gh(t.remoteStore, n)),
      (e._onlineComponents = t);
  }
  async function Du(e) {
    const t = await (async function (e) {
        return (
          e._onlineComponents ||
            (e._uninitializedComponentsProvider
              ? (Yi(
                  "FirestoreClient",
                  "Using user provided OnlineComponentProvider"
                ),
                await Ru(e, e._uninitializedComponentsProvider._online))
              : (Yi("FirestoreClient", "Using default OnlineComponentProvider"),
                await Ru(e, new Cu()))),
          e._onlineComponents
        );
      })(e),
      n = t.eventManager;
    return (
      (n.onListen = du.bind(null, t.syncEngine)),
      (n.onUnlisten = fu.bind(null, t.syncEngine)),
      n
    );
  }
  function Ou(e, t, n = {}) {
    const r = new as();
    return (
      e.asyncQueue.enqueueAndForget(async () =>
        (function (e, t, n, r, i) {
          const s = new ku({
              next: (n) => {
                t.enqueueAndForget(() =>
                  (async function (e, t) {
                    const n = is(e),
                      r = t.query;
                    let i = !1;
                    const s = n.queries.get(r);
                    if (s) {
                      const e = s.listeners.indexOf(t);
                      e >= 0 &&
                        (s.listeners.splice(e, 1),
                        (i = 0 === s.listeners.length));
                    }
                    if (i) return n.queries.delete(r), n.onUnlisten(r);
                  })(e, o)
                ),
                  n.fromCache && "server" === r.source
                    ? i.reject(
                        new os(
                          ss.UNAVAILABLE,
                          'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)'
                        )
                      )
                    : i.resolve(n);
              },
              error: (e) => i.reject(e),
            }),
            o = new su(n, s, { includeMetadataChanges: !0, J_: !0 });
          return (async function (e, t) {
            const n = is(e),
              r = t.query;
            let i = !1,
              s = n.queries.get(r);
            if ((s || ((i = !0), (s = new eu())), i))
              try {
                s.k_ = await n.onListen(r);
              } catch (e) {
                const n = Xh(
                  e,
                  `Initialization of query '${sa(t.query)}' failed`
                );
                return void t.onError(n);
              }
            n.queries.set(r, s),
              s.listeners.push(t),
              t.Q_(n.onlineState),
              s.k_ && t.K_(s.k_) && iu(n);
          })(e, o);
        })(await Du(e), e.asyncQueue, t, n, r)
      ),
      r.promise
    );
  }
  function Pu(e) {
    const t = {};
    return (
      void 0 !== e.timeoutSeconds && (t.timeoutSeconds = e.timeoutSeconds), t
    );
  }
  const Lu = new Map();
  function Mu(e) {
    if (Cs.isDocumentKey(e))
      throw new os(
        ss.INVALID_ARGUMENT,
        `Invalid collection reference. Collection references must have an odd number of segments, but ${e} has ${e.length}.`
      );
  }
  function xu(e) {
    if (void 0 === e) return "undefined";
    if (null === e) return "null";
    if ("string" == typeof e)
      return (
        e.length > 20 && (e = `${e.substring(0, 20)}...`), JSON.stringify(e)
      );
    if ("number" == typeof e || "boolean" == typeof e) return "" + e;
    if ("object" == typeof e) {
      if (e instanceof Array) return "an array";
      {
        const t = (function (e) {
          return e.constructor ? e.constructor.name : null;
        })(e);
        return t ? `a custom ${t} object` : "an object";
      }
    }
    return "function" == typeof e ? "a function" : ns();
  }
  function Uu(e, t) {
    if (("_delegate" in e && (e = e._delegate), !(e instanceof t))) {
      if (t.name === e.constructor.name)
        throw new os(
          ss.INVALID_ARGUMENT,
          "Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?"
        );
      {
        const n = xu(e);
        throw new os(
          ss.INVALID_ARGUMENT,
          `Expected type '${t.name}', but it was: ${n}`
        );
      }
    }
    return e;
  }
  class Vu {
    constructor(e) {
      var t, n;
      if (void 0 === e.host) {
        if (void 0 !== e.ssl)
          throw new os(
            ss.INVALID_ARGUMENT,
            "Can't provide ssl option if host option is not set"
          );
        (this.host = "firestore.googleapis.com"), (this.ssl = !0);
      } else
        (this.host = e.host),
          (this.ssl = null === (t = e.ssl) || void 0 === t || t);
      if (
        ((this.credentials = e.credentials),
        (this.ignoreUndefinedProperties = !!e.ignoreUndefinedProperties),
        (this.localCache = e.localCache),
        void 0 === e.cacheSizeBytes)
      )
        this.cacheSizeBytes = 41943040;
      else {
        if (-1 !== e.cacheSizeBytes && e.cacheSizeBytes < 1048576)
          throw new os(
            ss.INVALID_ARGUMENT,
            "cacheSizeBytes must be at least 1048576"
          );
        this.cacheSizeBytes = e.cacheSizeBytes;
      }
      (function (e, t, n, r) {
        if (!0 === t && !0 === r)
          throw new os(
            ss.INVALID_ARGUMENT,
            "experimentalForceLongPolling and experimentalAutoDetectLongPolling cannot be used together."
          );
      })(
        0,
        e.experimentalForceLongPolling,
        0,
        e.experimentalAutoDetectLongPolling
      ),
        (this.experimentalForceLongPolling = !!e.experimentalForceLongPolling),
        this.experimentalForceLongPolling
          ? (this.experimentalAutoDetectLongPolling = !1)
          : void 0 === e.experimentalAutoDetectLongPolling
          ? (this.experimentalAutoDetectLongPolling = !0)
          : (this.experimentalAutoDetectLongPolling =
              !!e.experimentalAutoDetectLongPolling),
        (this.experimentalLongPollingOptions = Pu(
          null !== (n = e.experimentalLongPollingOptions) && void 0 !== n
            ? n
            : {}
        )),
        (function (e) {
          if (void 0 !== e.timeoutSeconds) {
            if (isNaN(e.timeoutSeconds))
              throw new os(
                ss.INVALID_ARGUMENT,
                `invalid long polling timeout: ${e.timeoutSeconds} (must not be NaN)`
              );
            if (e.timeoutSeconds < 5)
              throw new os(
                ss.INVALID_ARGUMENT,
                `invalid long polling timeout: ${e.timeoutSeconds} (minimum allowed value is 5)`
              );
            if (e.timeoutSeconds > 30)
              throw new os(
                ss.INVALID_ARGUMENT,
                `invalid long polling timeout: ${e.timeoutSeconds} (maximum allowed value is 30)`
              );
          }
        })(this.experimentalLongPollingOptions),
        (this.useFetchStreams = !!e.useFetchStreams);
    }
    isEqual(e) {
      return (
        this.host === e.host &&
        this.ssl === e.ssl &&
        this.credentials === e.credentials &&
        this.cacheSizeBytes === e.cacheSizeBytes &&
        this.experimentalForceLongPolling === e.experimentalForceLongPolling &&
        this.experimentalAutoDetectLongPolling ===
          e.experimentalAutoDetectLongPolling &&
        (function (e, t) {
          return e.timeoutSeconds === t.timeoutSeconds;
        })(
          this.experimentalLongPollingOptions,
          e.experimentalLongPollingOptions
        ) &&
        this.ignoreUndefinedProperties === e.ignoreUndefinedProperties &&
        this.useFetchStreams === e.useFetchStreams
      );
    }
  }
  class Fu {
    constructor(e, t, n, r) {
      (this._authCredentials = e),
        (this._appCheckCredentials = t),
        (this._databaseId = n),
        (this._app = r),
        (this.type = "firestore-lite"),
        (this._persistenceKey = "(lite)"),
        (this._settings = new Vu({})),
        (this._settingsFrozen = !1);
    }
    get app() {
      if (!this._app)
        throw new os(
          ss.FAILED_PRECONDITION,
          "Firestore was not initialized using the Firebase SDK. 'app' is not available"
        );
      return this._app;
    }
    get _initialized() {
      return this._settingsFrozen;
    }
    get _terminated() {
      return void 0 !== this._terminateTask;
    }
    _setSettings(e) {
      if (this._settingsFrozen)
        throw new os(
          ss.FAILED_PRECONDITION,
          "Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object."
        );
      (this._settings = new Vu(e)),
        void 0 !== e.credentials &&
          (this._authCredentials = (function (e) {
            if (!e) return new hs();
            switch (e.type) {
              case "firstParty":
                return new fs(
                  e.sessionIndex || "0",
                  e.iamToken || null,
                  e.authTokenFactory || null
                );
              case "provider":
                return e.client;
              default:
                throw new os(
                  ss.INVALID_ARGUMENT,
                  "makeAuthCredentialsProvider failed due to invalid credential type"
                );
            }
          })(e.credentials));
    }
    _getSettings() {
      return this._settings;
    }
    _freezeSettings() {
      return (this._settingsFrozen = !0), this._settings;
    }
    _delete() {
      return (
        this._terminateTask || (this._terminateTask = this._terminate()),
        this._terminateTask
      );
    }
    toJSON() {
      return {
        app: this._app,
        databaseId: this._databaseId,
        settings: this._settings,
      };
    }
    _terminate() {
      return (
        (function (e) {
          const t = Lu.get(e);
          t &&
            (Yi("ComponentProvider", "Removing Datastore"),
            Lu.delete(e),
            t.terminate());
        })(this),
        Promise.resolve()
      );
    }
  }
  class ju {
    constructor(e, t, n) {
      (this.converter = t),
        (this._query = n),
        (this.type = "query"),
        (this.firestore = e);
    }
    withConverter(e) {
      return new ju(this.firestore, e, this._query);
    }
  }
  class Bu {
    constructor(e, t, n) {
      (this.converter = t),
        (this._key = n),
        (this.type = "document"),
        (this.firestore = e);
    }
    get _path() {
      return this._key.path;
    }
    get id() {
      return this._key.path.lastSegment();
    }
    get path() {
      return this._key.path.canonicalString();
    }
    get parent() {
      return new qu(this.firestore, this.converter, this._key.path.popLast());
    }
    withConverter(e) {
      return new Bu(this.firestore, e, this._key);
    }
  }
  class qu extends ju {
    constructor(e, t, n) {
      super(e, t, Xo(n)), (this._path = n), (this.type = "collection");
    }
    get id() {
      return this._query.path.lastSegment();
    }
    get path() {
      return this._query.path.canonicalString();
    }
    get parent() {
      const e = this._path.popLast();
      return e.isEmpty() ? null : new Bu(this.firestore, null, new Cs(e));
    }
    withConverter(e) {
      return new qu(this.firestore, e, this._path);
    }
  }
  class $u {
    constructor() {
      (this.Ja = Promise.resolve()),
        (this.Ya = []),
        (this.Za = !1),
        (this.Xa = []),
        (this.eu = null),
        (this.tu = !1),
        (this.nu = !1),
        (this.ru = []),
        (this.zo = new kh(this, "async_queue_retry")),
        (this.iu = () => {
          const e = Sh();
          e &&
            Yi(
              "AsyncQueue",
              "Visibility state changed to " + e.visibilityState
            ),
            this.zo.Qo();
        });
      const e = Sh();
      e &&
        "function" == typeof e.addEventListener &&
        e.addEventListener("visibilitychange", this.iu);
    }
    get isShuttingDown() {
      return this.Za;
    }
    enqueueAndForget(e) {
      this.enqueue(e);
    }
    enqueueAndForgetEvenWhileRestricted(e) {
      this.su(), this.ou(e);
    }
    enterRestrictedMode(e) {
      if (!this.Za) {
        (this.Za = !0), (this.nu = e || !1);
        const t = Sh();
        t &&
          "function" == typeof t.removeEventListener &&
          t.removeEventListener("visibilitychange", this.iu);
      }
    }
    enqueue(e) {
      if ((this.su(), this.Za)) return new Promise(() => {});
      const t = new as();
      return this.ou(() =>
        this.Za && this.nu
          ? Promise.resolve()
          : (e().then(t.resolve, t.reject), t.promise)
      ).then(() => t.promise);
    }
    enqueueRetryable(e) {
      this.enqueueAndForget(() => (this.Ya.push(e), this._u()));
    }
    async _u() {
      if (0 !== this.Ya.length) {
        try {
          await this.Ya[0](), this.Ya.shift(), this.zo.reset();
        } catch (e) {
          if (!Ls(e)) throw e;
          Yi("AsyncQueue", "Operation failed with retryable error: " + e);
        }
        this.Ya.length > 0 && this.zo.ko(() => this._u());
      }
    }
    ou(e) {
      const t = this.Ja.then(
        () => (
          (this.tu = !0),
          e()
            .catch((e) => {
              (this.eu = e), (this.tu = !1);
              const t = (function (e) {
                let t = e.message || "";
                return (
                  e.stack &&
                    (t = e.stack.includes(e.message)
                      ? e.stack
                      : e.message + "\n" + e.stack),
                  t
                );
              })(e);
              throw (Zi("INTERNAL UNHANDLED ERROR: ", t), e);
            })
            .then((e) => ((this.tu = !1), e))
        )
      );
      return (this.Ja = t), t;
    }
    enqueueAfterDelay(e, t, n) {
      this.su(), this.ru.indexOf(e) > -1 && (t = 0);
      const r = Qh.createAndSchedule(this, e, t, n, (e) => this.au(e));
      return this.Xa.push(r), r;
    }
    su() {
      this.eu && ns();
    }
    verifyOperationInProgress() {}
    async uu() {
      let e;
      do {
        (e = this.Ja), await e;
      } while (e !== this.Ja);
    }
    cu(e) {
      for (const t of this.Xa) if (t.timerId === e) return !0;
      return !1;
    }
    lu(e) {
      return this.uu().then(() => {
        this.Xa.sort((e, t) => e.targetTimeMs - t.targetTimeMs);
        for (const t of this.Xa)
          if ((t.skipDelay(), "all" !== e && t.timerId === e)) break;
        return this.uu();
      });
    }
    hu(e) {
      this.ru.push(e);
    }
    au(e) {
      const t = this.Xa.indexOf(e);
      this.Xa.splice(t, 1);
    }
  }
  class zu extends Fu {
    constructor(e, t, n, r) {
      super(e, t, n, r),
        (this.type = "firestore"),
        (this._queue = new $u()),
        (this._persistenceKey = (null == r ? void 0 : r.name) || "[DEFAULT]");
    }
    _terminate() {
      return (
        this._firestoreClient || Hu(this), this._firestoreClient.terminate()
      );
    }
  }
  function Hu(e) {
    var t, n, r;
    const i = e._freezeSettings(),
      s = (function (e, t, n, r) {
        return new no(
          e,
          t,
          n,
          r.host,
          r.ssl,
          r.experimentalForceLongPolling,
          r.experimentalAutoDetectLongPolling,
          Pu(r.experimentalLongPollingOptions),
          r.useFetchStreams
        );
      })(
        e._databaseId,
        (null === (t = e._app) || void 0 === t ? void 0 : t.options.appId) ||
          "",
        e._persistenceKey,
        i
      );
    (e._firestoreClient = new Au(
      e._authCredentials,
      e._appCheckCredentials,
      e._queue,
      s
    )),
      (null === (n = i.localCache) || void 0 === n
        ? void 0
        : n._offlineComponentProvider) &&
        (null === (r = i.localCache) || void 0 === r
          ? void 0
          : r._onlineComponentProvider) &&
        (e._firestoreClient._uninitializedComponentsProvider = {
          _offlineKind: i.localCache.kind,
          _offline: i.localCache._offlineComponentProvider,
          _online: i.localCache._onlineComponentProvider,
        });
  }
  class Ku {
    constructor(e) {
      this._byteString = e;
    }
    static fromBase64String(e) {
      try {
        return new Ku(Ws.fromBase64String(e));
      } catch (e) {
        throw new os(
          ss.INVALID_ARGUMENT,
          "Failed to construct data from Base64 string: " + e
        );
      }
    }
    static fromUint8Array(e) {
      return new Ku(Ws.fromUint8Array(e));
    }
    toBase64() {
      return this._byteString.toBase64();
    }
    toUint8Array() {
      return this._byteString.toUint8Array();
    }
    toString() {
      return "Bytes(base64: " + this.toBase64() + ")";
    }
    isEqual(e) {
      return this._byteString.isEqual(e._byteString);
    }
  }
  class Gu {
    constructor(...e) {
      for (let t = 0; t < e.length; ++t)
        if (0 === e[t].length)
          throw new os(
            ss.INVALID_ARGUMENT,
            "Invalid field name at argument $(i + 1). Field names must not be empty."
          );
      this._internalPath = new Ss(e);
    }
    isEqual(e) {
      return this._internalPath.isEqual(e._internalPath);
    }
  }
  class Wu {
    constructor(e) {
      this._methodName = e;
    }
  }
  class Qu {
    constructor(e, t) {
      if (!isFinite(e) || e < -90 || e > 90)
        throw new os(
          ss.INVALID_ARGUMENT,
          "Latitude must be a number between -90 and 90, but was: " + e
        );
      if (!isFinite(t) || t < -180 || t > 180)
        throw new os(
          ss.INVALID_ARGUMENT,
          "Longitude must be a number between -180 and 180, but was: " + t
        );
      (this._lat = e), (this._long = t);
    }
    get latitude() {
      return this._lat;
    }
    get longitude() {
      return this._long;
    }
    isEqual(e) {
      return this._lat === e._lat && this._long === e._long;
    }
    toJSON() {
      return { latitude: this._lat, longitude: this._long };
    }
    _compareTo(e) {
      return vs(this._lat, e._lat) || vs(this._long, e._long);
    }
  }
  const Xu = /^__.*__$/;
  function Ju(e) {
    switch (e) {
      case 0:
      case 2:
      case 1:
        return !0;
      case 3:
      case 4:
        return !1;
      default:
        throw ns();
    }
  }
  class Yu {
    constructor(e, t, n, r, i, s) {
      (this.settings = e),
        (this.databaseId = t),
        (this.serializer = n),
        (this.ignoreUndefinedProperties = r),
        void 0 === i && this.Pu(),
        (this.fieldTransforms = i || []),
        (this.fieldMask = s || []);
    }
    get path() {
      return this.settings.path;
    }
    get Iu() {
      return this.settings.Iu;
    }
    Tu(e) {
      return new Yu(
        Object.assign(Object.assign({}, this.settings), e),
        this.databaseId,
        this.serializer,
        this.ignoreUndefinedProperties,
        this.fieldTransforms,
        this.fieldMask
      );
    }
    Eu(e) {
      var t;
      const n = null === (t = this.path) || void 0 === t ? void 0 : t.child(e),
        r = this.Tu({ path: n, du: !1 });
      return r.Au(e), r;
    }
    Ru(e) {
      var t;
      const n = null === (t = this.path) || void 0 === t ? void 0 : t.child(e),
        r = this.Tu({ path: n, du: !1 });
      return r.Pu(), r;
    }
    Vu(e) {
      return this.Tu({ path: void 0, du: !0 });
    }
    mu(e) {
      return rl(
        e,
        this.settings.methodName,
        this.settings.fu || !1,
        this.path,
        this.settings.gu
      );
    }
    contains(e) {
      return (
        void 0 !== this.fieldMask.find((t) => e.isPrefixOf(t)) ||
        void 0 !== this.fieldTransforms.find((t) => e.isPrefixOf(t.field))
      );
    }
    Pu() {
      if (this.path)
        for (let e = 0; e < this.path.length; e++) this.Au(this.path.get(e));
    }
    Au(e) {
      if (0 === e.length) throw this.mu("Document fields must not be empty");
      if (Ju(this.Iu) && Xu.test(e))
        throw this.mu('Document fields cannot begin and end with "__"');
    }
  }
  class Zu {
    constructor(e, t, n) {
      (this.databaseId = e),
        (this.ignoreUndefinedProperties = t),
        (this.serializer = n || Ch(e));
    }
    pu(e, t, n, r = !1) {
      return new Yu(
        { Iu: e, methodName: t, gu: n, path: Ss.emptyPath(), du: !1, fu: r },
        this.databaseId,
        this.serializer,
        this.ignoreUndefinedProperties
      );
    }
  }
  function el(e, t) {
    if (tl((e = T(e))))
      return (
        (function (e, t, n) {
          if (
            !tl(n) ||
            !(function (e) {
              return (
                "object" == typeof e &&
                null !== e &&
                (Object.getPrototypeOf(e) === Object.prototype ||
                  null === Object.getPrototypeOf(e))
              );
            })(n)
          ) {
            const r = xu(n);
            throw "an object" === r
              ? t.mu(e + " a custom object")
              : t.mu(e + " " + r);
          }
        })("Unsupported field value:", t, e),
        (function (e, t) {
          const n = {};
          return (
            js(e)
              ? t.path && t.path.length > 0 && t.fieldMask.push(t.path)
              : Fs(e, (e, r) => {
                  const i = el(r, t.Eu(e));
                  null != i && (n[e] = i);
                }),
            { mapValue: { fields: n } }
          );
        })(e, t)
      );
    if (e instanceof Wu)
      return (
        (function (e, t) {
          if (!Ju(t.Iu))
            throw t.mu(
              `${e._methodName}() can only be used with update() and set()`
            );
          if (!t.path)
            throw t.mu(
              `${e._methodName}() is not currently supported inside arrays`
            );
          const n = e._toFieldTransform(t);
          n && t.fieldTransforms.push(n);
        })(e, t),
        null
      );
    if (void 0 === e && t.ignoreUndefinedProperties) return null;
    if ((t.path && t.fieldMask.push(t.path), e instanceof Array)) {
      if (t.settings.du && 4 !== t.Iu)
        throw t.mu("Nested arrays are not supported");
      return (function (e, t) {
        const n = [];
        let r = 0;
        for (const i of e) {
          let e = el(i, t.Vu(r));
          null == e && (e = { nullValue: "NULL_VALUE" }), n.push(e), r++;
        }
        return { arrayValue: { values: n } };
      })(e, t);
    }
    return (function (e, t) {
      if (null === (e = T(e))) return { nullValue: "NULL_VALUE" };
      if ("number" == typeof e) return Ta(t.serializer, e);
      if ("boolean" == typeof e) return { booleanValue: e };
      if ("string" == typeof e) return { stringValue: e };
      if (e instanceof Date) {
        const n = _s.fromDate(e);
        return { timestampValue: wc(t.serializer, n) };
      }
      if (e instanceof _s) {
        const n = new _s(e.seconds, 1e3 * Math.floor(e.nanoseconds / 1e3));
        return { timestampValue: wc(t.serializer, n) };
      }
      if (e instanceof Qu)
        return {
          geoPointValue: { latitude: e.latitude, longitude: e.longitude },
        };
      if (e instanceof Ku)
        return { bytesValue: _c(t.serializer, e._byteString) };
      if (e instanceof Bu) {
        const n = t.databaseId,
          r = e.firestore._databaseId;
        if (!r.isEqual(n))
          throw t.mu(
            `Document reference is for database ${r.projectId}/${r.database} but should be for database ${n.projectId}/${n.database}`
          );
        return {
          referenceValue: Ic(
            e.firestore._databaseId || t.databaseId,
            e._key.path
          ),
        };
      }
      throw t.mu(`Unsupported field value: ${xu(e)}`);
    })(e, t);
  }
  function tl(e) {
    return !(
      "object" != typeof e ||
      null === e ||
      e instanceof Array ||
      e instanceof Date ||
      e instanceof _s ||
      e instanceof Qu ||
      e instanceof Ku ||
      e instanceof Bu ||
      e instanceof Wu
    );
  }
  const nl = new RegExp("[~\\*/\\[\\]]");
  function rl(e, t, n, r, i) {
    const s = r && !r.isEmpty(),
      o = void 0 !== i;
    let a = `Function ${t}() called with invalid data`;
    n && (a += " (via `toFirestore()`)"), (a += ". ");
    let c = "";
    return (
      (s || o) &&
        ((c += " (found"),
        s && (c += ` in field ${r}`),
        o && (c += ` in document ${i}`),
        (c += ")")),
      new os(ss.INVALID_ARGUMENT, a + e + c)
    );
  }
  class il {
    constructor(e, t, n, r, i) {
      (this._firestore = e),
        (this._userDataWriter = t),
        (this._key = n),
        (this._document = r),
        (this._converter = i);
    }
    get id() {
      return this._key.path.lastSegment();
    }
    get ref() {
      return new Bu(this._firestore, this._converter, this._key);
    }
    exists() {
      return null !== this._document;
    }
    data() {
      if (this._document) {
        if (this._converter) {
          const e = new sl(
            this._firestore,
            this._userDataWriter,
            this._key,
            this._document,
            null
          );
          return this._converter.fromFirestore(e);
        }
        return this._userDataWriter.convertValue(this._document.data.value);
      }
    }
    get(e) {
      if (this._document) {
        const t = this._document.data.field(ol("DocumentSnapshot.get", e));
        if (null !== t) return this._userDataWriter.convertValue(t);
      }
    }
  }
  class sl extends il {
    data() {
      return super.data();
    }
  }
  function ol(e, t) {
    return "string" == typeof t
      ? (function (e, t, n) {
          if (t.search(nl) >= 0)
            throw rl(
              `Invalid field path (${t}). Paths must not contain '~', '*', '/', '[', or ']'`,
              e,
              !1,
              void 0,
              n
            );
          try {
            return new Gu(...t.split("."))._internalPath;
          } catch (r) {
            throw rl(
              `Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,
              e,
              !1,
              void 0,
              n
            );
          }
        })(e, t)
      : t instanceof Gu
      ? t._internalPath
      : t._delegate._internalPath;
  }
  class al {}
  class cl extends al {}
  class hl extends cl {
    constructor(e, t, n) {
      super(),
        (this._field = e),
        (this._op = t),
        (this._value = n),
        (this.type = "where");
    }
    static _create(e, t, n) {
      return new hl(e, t, n);
    }
    _apply(e) {
      const t = this._parse(e);
      return fl(e._query, t), new ju(e.firestore, e.converter, ta(e._query, t));
    }
    _parse(e) {
      const t = (function (e) {
          const t = e._freezeSettings(),
            n = Ch(e._databaseId);
          return new Zu(e._databaseId, !!t.ignoreUndefinedProperties, n);
        })(e.firestore),
        n = (function (e, t, n, r, i, s, o) {
          let a;
          if (i.isKeyField()) {
            if ("array-contains" === s || "array-contains-any" === s)
              throw new os(
                ss.INVALID_ARGUMENT,
                `Invalid Query. You can't perform '${s}' queries on documentId().`
              );
            if ("in" === s || "not-in" === s) {
              dl(o, s);
              const t = [];
              for (const n of o) t.push(ll(r, e, n));
              a = { arrayValue: { values: t } };
            } else a = ll(r, e, o);
          } else
            ("in" !== s && "not-in" !== s && "array-contains-any" !== s) ||
              dl(o, s),
              (a = (function (e, t, n, r = !1) {
                return el(n, e.pu(r ? 4 : 3, t));
              })(n, "where", o, "in" === s || "not-in" === s));
          return No.create(i, s, a);
        })(
          e._query,
          0,
          t,
          e.firestore._databaseId,
          this._field,
          this._op,
          this._value
        );
      return n;
    }
  }
  class ul extends al {
    constructor(e, t) {
      super(), (this.type = e), (this._queryConstraints = t);
    }
    static _create(e, t) {
      return new ul(e, t);
    }
    _parse(e) {
      const t = this._queryConstraints
        .map((t) => t._parse(e))
        .filter((e) => e.getFilters().length > 0);
      return 1 === t.length ? t[0] : Ro.create(t, this._getOperator());
    }
    _apply(e) {
      const t = this._parse(e);
      return 0 === t.getFilters().length
        ? e
        : ((function (e, t) {
            let n = e;
            const r = t.getFlattenedFilters();
            for (const e of r) fl(n, e), (n = ta(n, e));
          })(e._query, t),
          new ju(e.firestore, e.converter, ta(e._query, t)));
    }
    _getQueryConstraints() {
      return this._queryConstraints;
    }
    _getOperator() {
      return "and" === this.type ? "and" : "or";
    }
  }
  function ll(e, t, n) {
    if ("string" == typeof (n = T(n))) {
      if ("" === n)
        throw new os(
          ss.INVALID_ARGUMENT,
          "Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string."
        );
      if (!Yo(t) && -1 !== n.indexOf("/"))
        throw new os(
          ss.INVALID_ARGUMENT,
          `Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${n}' contains a '/' character.`
        );
      const r = t.path.child(Ts.fromString(n));
      if (!Cs.isDocumentKey(r))
        throw new os(
          ss.INVALID_ARGUMENT,
          `Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${r}' is not because it has an odd number of segments (${r.length}).`
        );
      return fo(e, new Cs(r));
    }
    if (n instanceof Bu) return fo(e, n._key);
    throw new os(
      ss.INVALID_ARGUMENT,
      `Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${xu(
        n
      )}.`
    );
  }
  function dl(e, t) {
    if (!Array.isArray(e) || 0 === e.length)
      throw new os(
        ss.INVALID_ARGUMENT,
        `Invalid Query. A non-empty array is required for '${t.toString()}' filters.`
      );
  }
  function fl(e, t) {
    const n = (function (e, t) {
      for (const n of e)
        for (const e of n.getFlattenedFilters())
          if (t.indexOf(e.op) >= 0) return e.op;
      return null;
    })(
      e.filters,
      (function (e) {
        switch (e) {
          case "!=":
            return ["!=", "not-in"];
          case "array-contains-any":
          case "in":
            return ["not-in"];
          case "not-in":
            return ["array-contains-any", "in", "not-in", "!="];
          default:
            return [];
        }
      })(t.op)
    );
    if (null !== n)
      throw n === t.op
        ? new os(
            ss.INVALID_ARGUMENT,
            `Invalid query. You cannot use more than one '${t.op.toString()}' filter.`
          )
        : new os(
            ss.INVALID_ARGUMENT,
            `Invalid query. You cannot use '${t.op.toString()}' filters with '${n.toString()}' filters.`
          );
  }
  class pl {
    convertValue(e, t = "none") {
      switch (so(e)) {
        case 0:
          return null;
        case 1:
          return e.booleanValue;
        case 2:
          return Js(e.integerValue || e.doubleValue);
        case 3:
          return this.convertTimestamp(e.timestampValue);
        case 4:
          return this.convertServerTimestamp(e, t);
        case 5:
          return e.stringValue;
        case 6:
          return this.convertBytes(Ys(e.bytesValue));
        case 7:
          return this.convertReference(e.referenceValue);
        case 8:
          return this.convertGeoPoint(e.geoPointValue);
        case 9:
          return this.convertArray(e.arrayValue, t);
        case 10:
          return this.convertObject(e.mapValue, t);
        default:
          throw ns();
      }
    }
    convertObject(e, t) {
      return this.convertObjectMap(e.fields, t);
    }
    convertObjectMap(e, t = "none") {
      const n = {};
      return (
        Fs(e, (e, r) => {
          n[e] = this.convertValue(r, t);
        }),
        n
      );
    }
    convertGeoPoint(e) {
      return new Qu(Js(e.latitude), Js(e.longitude));
    }
    convertArray(e, t) {
      return (e.values || []).map((e) => this.convertValue(e, t));
    }
    convertServerTimestamp(e, t) {
      switch (t) {
        case "previous":
          const n = eo(e);
          return null == n ? null : this.convertValue(n, t);
        case "estimate":
          return this.convertTimestamp(to(e));
        default:
          return null;
      }
    }
    convertTimestamp(e) {
      const t = Xs(e);
      return new _s(t.seconds, t.nanos);
    }
    convertDocumentKey(e, t) {
      const n = Ts.fromString(e);
      rs(Vc(n));
      const r = new ro(n.get(1), n.get(3)),
        i = new Cs(n.popFirst(5));
      return (
        r.isEqual(t) ||
          Zi(
            `Document ${i} contains a document reference within a different database (${r.projectId}/${r.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`
          ),
        i
      );
    }
  }
  class gl {
    constructor(e, t) {
      (this.hasPendingWrites = e), (this.fromCache = t);
    }
    isEqual(e) {
      return (
        this.hasPendingWrites === e.hasPendingWrites &&
        this.fromCache === e.fromCache
      );
    }
  }
  class ml extends il {
    constructor(e, t, n, r, i, s) {
      super(e, t, n, r, s),
        (this._firestore = e),
        (this._firestoreImpl = e),
        (this.metadata = i);
    }
    exists() {
      return super.exists();
    }
    data(e = {}) {
      if (this._document) {
        if (this._converter) {
          const t = new yl(
            this._firestore,
            this._userDataWriter,
            this._key,
            this._document,
            this.metadata,
            null
          );
          return this._converter.fromFirestore(t, e);
        }
        return this._userDataWriter.convertValue(
          this._document.data.value,
          e.serverTimestamps
        );
      }
    }
    get(e, t = {}) {
      if (this._document) {
        const n = this._document.data.field(ol("DocumentSnapshot.get", e));
        if (null !== n)
          return this._userDataWriter.convertValue(n, t.serverTimestamps);
      }
    }
  }
  class yl extends ml {
    data(e = {}) {
      return super.data(e);
    }
  }
  class vl {
    constructor(e, t, n, r) {
      (this._firestore = e),
        (this._userDataWriter = t),
        (this._snapshot = r),
        (this.metadata = new gl(r.hasPendingWrites, r.fromCache)),
        (this.query = n);
    }
    get docs() {
      const e = [];
      return this.forEach((t) => e.push(t)), e;
    }
    get size() {
      return this._snapshot.docs.size;
    }
    get empty() {
      return 0 === this.size;
    }
    forEach(e, t) {
      this._snapshot.docs.forEach((n) => {
        e.call(
          t,
          new yl(
            this._firestore,
            this._userDataWriter,
            n.key,
            n,
            new gl(
              this._snapshot.mutatedKeys.has(n.key),
              this._snapshot.fromCache
            ),
            this.query.converter
          )
        );
      });
    }
    docChanges(e = {}) {
      const t = !!e.includeMetadataChanges;
      if (t && this._snapshot.excludesMetadataChanges)
        throw new os(
          ss.INVALID_ARGUMENT,
          "To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot()."
        );
      return (
        (this._cachedChanges &&
          this._cachedChangesIncludeMetadataChanges === t) ||
          ((this._cachedChanges = (function (e, t) {
            if (e._snapshot.oldDocs.isEmpty()) {
              let t = 0;
              return e._snapshot.docChanges.map((n) => {
                const r = new yl(
                  e._firestore,
                  e._userDataWriter,
                  n.doc.key,
                  n.doc,
                  new gl(
                    e._snapshot.mutatedKeys.has(n.doc.key),
                    e._snapshot.fromCache
                  ),
                  e.query.converter
                );
                return (
                  n.doc, { type: "added", doc: r, oldIndex: -1, newIndex: t++ }
                );
              });
            }
            {
              let n = e._snapshot.oldDocs;
              return e._snapshot.docChanges
                .filter((e) => t || 3 !== e.type)
                .map((t) => {
                  const r = new yl(
                    e._firestore,
                    e._userDataWriter,
                    t.doc.key,
                    t.doc,
                    new gl(
                      e._snapshot.mutatedKeys.has(t.doc.key),
                      e._snapshot.fromCache
                    ),
                    e.query.converter
                  );
                  let i = -1,
                    s = -1;
                  return (
                    0 !== t.type &&
                      ((i = n.indexOf(t.doc.key)), (n = n.delete(t.doc.key))),
                    1 !== t.type &&
                      ((n = n.add(t.doc)), (s = n.indexOf(t.doc.key))),
                    { type: wl(t.type), doc: r, oldIndex: i, newIndex: s }
                  );
                });
            }
          })(this, t)),
          (this._cachedChangesIncludeMetadataChanges = t)),
        this._cachedChanges
      );
    }
  }
  function wl(e) {
    switch (e) {
      case 0:
        return "added";
      case 2:
      case 3:
        return "modified";
      case 1:
        return "removed";
      default:
        return ns();
    }
  }
  class _l extends pl {
    constructor(e) {
      super(), (this.firestore = e);
    }
    convertBytes(e) {
      return new Ku(e);
    }
    convertReference(e) {
      const t = this.convertDocumentKey(e, this.firestore._databaseId);
      return new Bu(this.firestore, null, t);
    }
  }
  function El(e, t) {
    var n = {};
    for (var r in e)
      Object.prototype.hasOwnProperty.call(e, r) &&
        t.indexOf(r) < 0 &&
        (n[r] = e[r]);
    if (null != e && "function" == typeof Object.getOwnPropertySymbols) {
      var i = 0;
      for (r = Object.getOwnPropertySymbols(e); i < r.length; i++)
        t.indexOf(r[i]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(e, r[i]) &&
          (n[r[i]] = e[r[i]]);
    }
    return n;
  }
  new WeakMap(),
    (function (e, t = !0) {
      !(function (e) {
        Qi = e;
      })(de),
        ce(
          new b(
            "firestore",
            (e, { instanceIdentifier: n, options: r }) => {
              const i = e.getProvider("app").getImmediate(),
                s = new zu(
                  new ls(e.getProvider("auth-internal")),
                  new gs(e.getProvider("app-check-internal")),
                  (function (e, t) {
                    if (
                      !Object.prototype.hasOwnProperty.apply(e.options, [
                        "projectId",
                      ])
                    )
                      throw new os(
                        ss.INVALID_ARGUMENT,
                        '"projectId" not provided in firebase.initializeApp.'
                      );
                    return new ro(e.options.projectId, t);
                  })(i, n),
                  i
                );
              return (
                (r = Object.assign({ useFetchStreams: t }, r)),
                s._setSettings(r),
                s
              );
            },
            "PUBLIC"
          ).setMultipleInstances(!0)
        ),
        ge(Gi, "4.3.2", e),
        ge(Gi, "4.3.2", "esm2017");
    })(),
    Object.create,
    Object.create,
    "function" == typeof SuppressedError && SuppressedError;
  const Il = function () {
      return {
        "dependent-sdk-initialized-before-auth":
          "Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK.",
      };
    },
    Tl = new p("auth", "Firebase", {
      "dependent-sdk-initialized-before-auth":
        "Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK.",
    }),
    bl = new M("@firebase/auth");
  function Sl(e, ...t) {
    bl.logLevel <= N.ERROR && bl.error(`Auth (${de}): ${e}`, ...t);
  }
  function Cl(e, ...t) {
    throw Al(e, ...t);
  }
  function kl(e, ...t) {
    return Al(e, ...t);
  }
  function Al(e, ...t) {
    if ("string" != typeof e) {
      const n = t[0],
        r = [...t.slice(1)];
      return r[0] && (r[0].appName = e.name), e._errorFactory.create(n, ...r);
    }
    return Tl.create(e, ...t);
  }
  function Nl(e, t, ...n) {
    if (!e) throw Al(t, ...n);
  }
  function Rl(e) {
    const t = "INTERNAL ASSERTION FAILED: " + e;
    throw (Sl(t), new Error(t));
  }
  function Dl(e, t) {
    e || Rl(t);
  }
  function Ol() {
    var e;
    return (
      ("undefined" != typeof self &&
        (null === (e = self.location) || void 0 === e ? void 0 : e.href)) ||
      ""
    );
  }
  function Pl() {
    var e;
    return (
      ("undefined" != typeof self &&
        (null === (e = self.location) || void 0 === e ? void 0 : e.protocol)) ||
      null
    );
  }
  function Ll() {
    return (
      !(
        "undefined" != typeof navigator &&
        navigator &&
        "onLine" in navigator &&
        "boolean" == typeof navigator.onLine &&
        ("http:" === Pl() ||
          "https:" === Pl() ||
          (function () {
            const e =
              "object" == typeof chrome
                ? chrome.runtime
                : "object" == typeof browser
                ? browser.runtime
                : void 0;
            return "object" == typeof e && void 0 !== e.id;
          })() ||
          "connection" in navigator)
      ) || navigator.onLine
    );
  }
  class Ml {
    constructor(e, t) {
      (this.shortDelay = e),
        (this.longDelay = t),
        Dl(t > e, "Short delay should be less than long delay!"),
        (this.isMobile =
          ("undefined" != typeof window &&
            !!(window.cordova || window.phonegap || window.PhoneGap) &&
            /ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(d())) ||
          ("object" == typeof navigator &&
            "ReactNative" === navigator.product));
    }
    get() {
      return Ll()
        ? this.isMobile
          ? this.longDelay
          : this.shortDelay
        : Math.min(5e3, this.shortDelay);
    }
  }
  function xl(e, t) {
    Dl(e.emulator, "Emulator should always be set here");
    const { url: n } = e.emulator;
    return t ? `${n}${t.startsWith("/") ? t.slice(1) : t}` : n;
  }
  class Ul {
    static initialize(e, t, n) {
      (this.fetchImpl = e),
        t && (this.headersImpl = t),
        n && (this.responseImpl = n);
    }
    static fetch() {
      return this.fetchImpl
        ? this.fetchImpl
        : "undefined" != typeof self && "fetch" in self
        ? self.fetch
        : "undefined" != typeof globalThis && globalThis.fetch
        ? globalThis.fetch
        : "undefined" != typeof fetch
        ? fetch
        : void Rl(
            "Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill"
          );
    }
    static headers() {
      return this.headersImpl
        ? this.headersImpl
        : "undefined" != typeof self && "Headers" in self
        ? self.Headers
        : "undefined" != typeof globalThis && globalThis.Headers
        ? globalThis.Headers
        : "undefined" != typeof Headers
        ? Headers
        : void Rl(
            "Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill"
          );
    }
    static response() {
      return this.responseImpl
        ? this.responseImpl
        : "undefined" != typeof self && "Response" in self
        ? self.Response
        : "undefined" != typeof globalThis && globalThis.Response
        ? globalThis.Response
        : "undefined" != typeof Response
        ? Response
        : void Rl(
            "Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill"
          );
    }
  }
  const Vl = {
      CREDENTIAL_MISMATCH: "custom-token-mismatch",
      MISSING_CUSTOM_TOKEN: "internal-error",
      INVALID_IDENTIFIER: "invalid-email",
      MISSING_CONTINUE_URI: "internal-error",
      INVALID_PASSWORD: "wrong-password",
      MISSING_PASSWORD: "missing-password",
      EMAIL_EXISTS: "email-already-in-use",
      PASSWORD_LOGIN_DISABLED: "operation-not-allowed",
      INVALID_IDP_RESPONSE: "invalid-credential",
      INVALID_PENDING_TOKEN: "invalid-credential",
      FEDERATED_USER_ID_ALREADY_LINKED: "credential-already-in-use",
      MISSING_REQ_TYPE: "internal-error",
      EMAIL_NOT_FOUND: "user-not-found",
      RESET_PASSWORD_EXCEED_LIMIT: "too-many-requests",
      EXPIRED_OOB_CODE: "expired-action-code",
      INVALID_OOB_CODE: "invalid-action-code",
      MISSING_OOB_CODE: "internal-error",
      CREDENTIAL_TOO_OLD_LOGIN_AGAIN: "requires-recent-login",
      INVALID_ID_TOKEN: "invalid-user-token",
      TOKEN_EXPIRED: "user-token-expired",
      USER_NOT_FOUND: "user-token-expired",
      TOO_MANY_ATTEMPTS_TRY_LATER: "too-many-requests",
      PASSWORD_DOES_NOT_MEET_REQUIREMENTS:
        "password-does-not-meet-requirements",
      INVALID_CODE: "invalid-verification-code",
      INVALID_SESSION_INFO: "invalid-verification-id",
      INVALID_TEMPORARY_PROOF: "invalid-credential",
      MISSING_SESSION_INFO: "missing-verification-id",
      SESSION_EXPIRED: "code-expired",
      MISSING_ANDROID_PACKAGE_NAME: "missing-android-pkg-name",
      UNAUTHORIZED_DOMAIN: "unauthorized-continue-uri",
      INVALID_OAUTH_CLIENT_ID: "invalid-oauth-client-id",
      ADMIN_ONLY_OPERATION: "admin-restricted-operation",
      INVALID_MFA_PENDING_CREDENTIAL: "invalid-multi-factor-session",
      MFA_ENROLLMENT_NOT_FOUND: "multi-factor-info-not-found",
      MISSING_MFA_ENROLLMENT_ID: "missing-multi-factor-info",
      MISSING_MFA_PENDING_CREDENTIAL: "missing-multi-factor-session",
      SECOND_FACTOR_EXISTS: "second-factor-already-in-use",
      SECOND_FACTOR_LIMIT_EXCEEDED: "maximum-second-factor-count-exceeded",
      BLOCKING_FUNCTION_ERROR_RESPONSE: "internal-error",
      RECAPTCHA_NOT_ENABLED: "recaptcha-not-enabled",
      MISSING_RECAPTCHA_TOKEN: "missing-recaptcha-token",
      INVALID_RECAPTCHA_TOKEN: "invalid-recaptcha-token",
      INVALID_RECAPTCHA_ACTION: "invalid-recaptcha-action",
      MISSING_CLIENT_TYPE: "missing-client-type",
      MISSING_RECAPTCHA_VERSION: "missing-recaptcha-version",
      INVALID_RECAPTCHA_VERSION: "invalid-recaptcha-version",
      INVALID_REQ_TYPE: "invalid-req-type",
    },
    Fl = new Ml(3e4, 6e4);
  function jl(e, t) {
    return e.tenantId && !t.tenantId
      ? Object.assign(Object.assign({}, t), { tenantId: e.tenantId })
      : t;
  }
  async function Bl(e, t, n, r, i = {}) {
    return ql(e, i, async () => {
      let i = {},
        s = {};
      r && ("GET" === t ? (s = r) : (i = { body: JSON.stringify(r) }));
      const o = v(Object.assign({ key: e.config.apiKey }, s)).slice(1),
        a = await e._getAdditionalHeaders();
      return (
        (a["Content-Type"] = "application/json"),
        e.languageCode && (a["X-Firebase-Locale"] = e.languageCode),
        Ul.fetch()(
          zl(e, e.config.apiHost, n, o),
          Object.assign(
            { method: t, headers: a, referrerPolicy: "no-referrer" },
            i
          )
        )
      );
    });
  }
  async function ql(e, t, n) {
    e._canInitEmulator = !1;
    const r = Object.assign(Object.assign({}, Vl), t);
    try {
      const t = new Kl(e),
        i = await Promise.race([n(), t.promise]);
      t.clearNetworkTimeout();
      const s = await i.json();
      if ("needConfirmation" in s)
        throw Gl(e, "account-exists-with-different-credential", s);
      if (i.ok && !("errorMessage" in s)) return s;
      {
        const t = i.ok ? s.errorMessage : s.error.message,
          [n, o] = t.split(" : ");
        if ("FEDERATED_USER_ID_ALREADY_LINKED" === n)
          throw Gl(e, "credential-already-in-use", s);
        if ("EMAIL_EXISTS" === n) throw Gl(e, "email-already-in-use", s);
        if ("USER_DISABLED" === n) throw Gl(e, "user-disabled", s);
        const a = r[n] || n.toLowerCase().replace(/[_\s]+/g, "-");
        if (o)
          throw (function (e, t, n) {
            const r = Object.assign(Object.assign({}, Il()), { [t]: n });
            return new p("auth", "Firebase", r).create(t, { appName: e.name });
          })(e, a, o);
        Cl(e, a);
      }
    } catch (t) {
      if (t instanceof f) throw t;
      Cl(e, "network-request-failed", { message: String(t) });
    }
  }
  async function $l(e, t, n, r, i = {}) {
    const s = await Bl(e, t, n, r, i);
    return (
      "mfaPendingCredential" in s &&
        Cl(e, "multi-factor-auth-required", { _serverResponse: s }),
      s
    );
  }
  function zl(e, t, n, r) {
    const i = `${t}${n}?${r}`;
    return e.config.emulator ? xl(e.config, i) : `${e.config.apiScheme}://${i}`;
  }
  function Hl(e) {
    switch (e) {
      case "ENFORCE":
        return "ENFORCE";
      case "AUDIT":
        return "AUDIT";
      case "OFF":
        return "OFF";
      default:
        return "ENFORCEMENT_STATE_UNSPECIFIED";
    }
  }
  class Kl {
    constructor(e) {
      (this.auth = e),
        (this.timer = null),
        (this.promise = new Promise((e, t) => {
          this.timer = setTimeout(
            () => t(kl(this.auth, "network-request-failed")),
            Fl.get()
          );
        }));
    }
    clearNetworkTimeout() {
      clearTimeout(this.timer);
    }
  }
  function Gl(e, t, n) {
    const r = { appName: e.name };
    n.email && (r.email = n.email),
      n.phoneNumber && (r.phoneNumber = n.phoneNumber);
    const i = kl(e, t, r);
    return (i.customData._tokenResponse = n), i;
  }
  function Wl(e) {
    return void 0 !== e && void 0 !== e.enterprise;
  }
  class Ql {
    constructor(e) {
      if (
        ((this.siteKey = ""),
        (this.recaptchaEnforcementState = []),
        void 0 === e.recaptchaKey)
      )
        throw new Error("recaptchaKey undefined");
      (this.siteKey = e.recaptchaKey.split("/")[3]),
        (this.recaptchaEnforcementState = e.recaptchaEnforcementState);
    }
    getProviderEnforcementState(e) {
      if (
        !this.recaptchaEnforcementState ||
        0 === this.recaptchaEnforcementState.length
      )
        return null;
      for (const t of this.recaptchaEnforcementState)
        if (t.provider && t.provider === e) return Hl(t.enforcementState);
      return null;
    }
    isProviderEnabled(e) {
      return (
        "ENFORCE" === this.getProviderEnforcementState(e) ||
        "AUDIT" === this.getProviderEnforcementState(e)
      );
    }
  }
  function Xl(e) {
    if (e)
      try {
        const t = new Date(Number(e));
        if (!isNaN(t.getTime())) return t.toUTCString();
      } catch (e) {}
  }
  function Jl(e) {
    return 1e3 * Number(e);
  }
  function Yl(e) {
    const [t, n, r] = e.split(".");
    if (void 0 === t || void 0 === n || void 0 === r)
      return Sl("JWT malformed, contained fewer than 3 sections"), null;
    try {
      const e = s(n);
      return e
        ? JSON.parse(e)
        : (Sl("Failed to decode base64 JWT payload"), null);
    } catch (e) {
      return (
        Sl(
          "Caught error parsing JWT payload as JSON",
          null == e ? void 0 : e.toString()
        ),
        null
      );
    }
  }
  async function Zl(e, t, n = !1) {
    if (n) return t;
    try {
      return await t;
    } catch (t) {
      throw (
        (t instanceof f &&
          (function ({ code: e }) {
            return (
              "auth/user-disabled" === e || "auth/user-token-expired" === e
            );
          })(t) &&
          e.auth.currentUser === e &&
          (await e.auth.signOut()),
        t)
      );
    }
  }
  class ed {
    constructor(e) {
      (this.user = e),
        (this.isRunning = !1),
        (this.timerId = null),
        (this.errorBackoff = 3e4);
    }
    _start() {
      this.isRunning || ((this.isRunning = !0), this.schedule());
    }
    _stop() {
      this.isRunning &&
        ((this.isRunning = !1),
        null !== this.timerId && clearTimeout(this.timerId));
    }
    getInterval(e) {
      var t;
      if (e) {
        const e = this.errorBackoff;
        return (this.errorBackoff = Math.min(2 * this.errorBackoff, 96e4)), e;
      }
      {
        this.errorBackoff = 3e4;
        const e =
          (null !== (t = this.user.stsTokenManager.expirationTime) &&
          void 0 !== t
            ? t
            : 0) -
          Date.now() -
          3e5;
        return Math.max(0, e);
      }
    }
    schedule(e = !1) {
      if (!this.isRunning) return;
      const t = this.getInterval(e);
      this.timerId = setTimeout(async () => {
        await this.iteration();
      }, t);
    }
    async iteration() {
      try {
        await this.user.getIdToken(!0);
      } catch (e) {
        return void (
          "auth/network-request-failed" === (null == e ? void 0 : e.code) &&
          this.schedule(!0)
        );
      }
      this.schedule();
    }
  }
  class td {
    constructor(e, t) {
      (this.createdAt = e), (this.lastLoginAt = t), this._initializeTime();
    }
    _initializeTime() {
      (this.lastSignInTime = Xl(this.lastLoginAt)),
        (this.creationTime = Xl(this.createdAt));
    }
    _copy(e) {
      (this.createdAt = e.createdAt),
        (this.lastLoginAt = e.lastLoginAt),
        this._initializeTime();
    }
    toJSON() {
      return { createdAt: this.createdAt, lastLoginAt: this.lastLoginAt };
    }
  }
  async function nd(e) {
    var t;
    const n = e.auth,
      r = await e.getIdToken(),
      i = await Zl(
        e,
        (async function (e, t) {
          return Bl(e, "POST", "/v1/accounts:lookup", t);
        })(n, { idToken: r })
      );
    Nl(null == i ? void 0 : i.users.length, n, "internal-error");
    const s = i.users[0];
    e._notifyReloadListener(s);
    const o = (
        null === (t = s.providerUserInfo) || void 0 === t ? void 0 : t.length
      )
        ? s.providerUserInfo.map((e) => {
            var { providerId: t } = e,
              n = El(e, ["providerId"]);
            return {
              providerId: t,
              uid: n.rawId || "",
              displayName: n.displayName || null,
              email: n.email || null,
              phoneNumber: n.phoneNumber || null,
              photoURL: n.photoUrl || null,
            };
          })
        : [],
      a =
        ((c = e.providerData),
        (h = o),
        [
          ...c.filter((e) => !h.some((t) => t.providerId === e.providerId)),
          ...h,
        ]);
    var c, h;
    const u = e.isAnonymous,
      l = !((e.email && s.passwordHash) || (null == a ? void 0 : a.length)),
      d = !!u && l,
      f = {
        uid: s.localId,
        displayName: s.displayName || null,
        photoURL: s.photoUrl || null,
        email: s.email || null,
        emailVerified: s.emailVerified || !1,
        phoneNumber: s.phoneNumber || null,
        tenantId: s.tenantId || null,
        providerData: a,
        metadata: new td(s.createdAt, s.lastLoginAt),
        isAnonymous: d,
      };
    Object.assign(e, f);
  }
  class rd {
    constructor() {
      (this.refreshToken = null),
        (this.accessToken = null),
        (this.expirationTime = null);
    }
    get isExpired() {
      return !this.expirationTime || Date.now() > this.expirationTime - 3e4;
    }
    updateFromServerResponse(e) {
      Nl(e.idToken, "internal-error"),
        Nl(void 0 !== e.idToken, "internal-error"),
        Nl(void 0 !== e.refreshToken, "internal-error");
      const t =
        "expiresIn" in e && void 0 !== e.expiresIn
          ? Number(e.expiresIn)
          : (function (e) {
              const t = Yl(e);
              return (
                Nl(t, "internal-error"),
                Nl(void 0 !== t.exp, "internal-error"),
                Nl(void 0 !== t.iat, "internal-error"),
                Number(t.exp) - Number(t.iat)
              );
            })(e.idToken);
      this.updateTokensAndExpiration(e.idToken, e.refreshToken, t);
    }
    async getToken(e, t = !1) {
      return (
        Nl(!this.accessToken || this.refreshToken, e, "user-token-expired"),
        t || !this.accessToken || this.isExpired
          ? this.refreshToken
            ? (await this.refresh(e, this.refreshToken), this.accessToken)
            : null
          : this.accessToken
      );
    }
    clearRefreshToken() {
      this.refreshToken = null;
    }
    async refresh(e, t) {
      const {
        accessToken: n,
        refreshToken: r,
        expiresIn: i,
      } = await (async function (e, t) {
        const n = await ql(e, {}, async () => {
          const n = v({ grant_type: "refresh_token", refresh_token: t }).slice(
              1
            ),
            { tokenApiHost: r, apiKey: i } = e.config,
            s = zl(e, r, "/v1/token", `key=${i}`),
            o = await e._getAdditionalHeaders();
          return (
            (o["Content-Type"] = "application/x-www-form-urlencoded"),
            Ul.fetch()(s, { method: "POST", headers: o, body: n })
          );
        });
        return {
          accessToken: n.access_token,
          expiresIn: n.expires_in,
          refreshToken: n.refresh_token,
        };
      })(e, t);
      this.updateTokensAndExpiration(n, r, Number(i));
    }
    updateTokensAndExpiration(e, t, n) {
      (this.refreshToken = t || null),
        (this.accessToken = e || null),
        (this.expirationTime = Date.now() + 1e3 * n);
    }
    static fromJSON(e, t) {
      const { refreshToken: n, accessToken: r, expirationTime: i } = t,
        s = new rd();
      return (
        n &&
          (Nl("string" == typeof n, "internal-error", { appName: e }),
          (s.refreshToken = n)),
        r &&
          (Nl("string" == typeof r, "internal-error", { appName: e }),
          (s.accessToken = r)),
        i &&
          (Nl("number" == typeof i, "internal-error", { appName: e }),
          (s.expirationTime = i)),
        s
      );
    }
    toJSON() {
      return {
        refreshToken: this.refreshToken,
        accessToken: this.accessToken,
        expirationTime: this.expirationTime,
      };
    }
    _assign(e) {
      (this.accessToken = e.accessToken),
        (this.refreshToken = e.refreshToken),
        (this.expirationTime = e.expirationTime);
    }
    _clone() {
      return Object.assign(new rd(), this.toJSON());
    }
    _performRefresh() {
      return Rl("not implemented");
    }
  }
  function id(e, t) {
    Nl("string" == typeof e || void 0 === e, "internal-error", { appName: t });
  }
  class sd {
    constructor(e) {
      var { uid: t, auth: n, stsTokenManager: r } = e,
        i = El(e, ["uid", "auth", "stsTokenManager"]);
      (this.providerId = "firebase"),
        (this.proactiveRefresh = new ed(this)),
        (this.reloadUserInfo = null),
        (this.reloadListener = null),
        (this.uid = t),
        (this.auth = n),
        (this.stsTokenManager = r),
        (this.accessToken = r.accessToken),
        (this.displayName = i.displayName || null),
        (this.email = i.email || null),
        (this.emailVerified = i.emailVerified || !1),
        (this.phoneNumber = i.phoneNumber || null),
        (this.photoURL = i.photoURL || null),
        (this.isAnonymous = i.isAnonymous || !1),
        (this.tenantId = i.tenantId || null),
        (this.providerData = i.providerData ? [...i.providerData] : []),
        (this.metadata = new td(
          i.createdAt || void 0,
          i.lastLoginAt || void 0
        ));
    }
    async getIdToken(e) {
      const t = await Zl(this, this.stsTokenManager.getToken(this.auth, e));
      return (
        Nl(t, this.auth, "internal-error"),
        this.accessToken !== t &&
          ((this.accessToken = t),
          await this.auth._persistUserIfCurrent(this),
          this.auth._notifyListenersIfCurrent(this)),
        t
      );
    }
    getIdTokenResult(e) {
      return (async function (e, t = !1) {
        const n = T(e),
          r = await n.getIdToken(t),
          i = Yl(r);
        Nl(i && i.exp && i.auth_time && i.iat, n.auth, "internal-error");
        const s = "object" == typeof i.firebase ? i.firebase : void 0,
          o = null == s ? void 0 : s.sign_in_provider;
        return {
          claims: i,
          token: r,
          authTime: Xl(Jl(i.auth_time)),
          issuedAtTime: Xl(Jl(i.iat)),
          expirationTime: Xl(Jl(i.exp)),
          signInProvider: o || null,
          signInSecondFactor:
            (null == s ? void 0 : s.sign_in_second_factor) || null,
        };
      })(this, e);
    }
    reload() {
      return (async function (e) {
        const t = T(e);
        await nd(t),
          await t.auth._persistUserIfCurrent(t),
          t.auth._notifyListenersIfCurrent(t);
      })(this);
    }
    _assign(e) {
      this !== e &&
        (Nl(this.uid === e.uid, this.auth, "internal-error"),
        (this.displayName = e.displayName),
        (this.photoURL = e.photoURL),
        (this.email = e.email),
        (this.emailVerified = e.emailVerified),
        (this.phoneNumber = e.phoneNumber),
        (this.isAnonymous = e.isAnonymous),
        (this.tenantId = e.tenantId),
        (this.providerData = e.providerData.map((e) => Object.assign({}, e))),
        this.metadata._copy(e.metadata),
        this.stsTokenManager._assign(e.stsTokenManager));
    }
    _clone(e) {
      const t = new sd(
        Object.assign(Object.assign({}, this), {
          auth: e,
          stsTokenManager: this.stsTokenManager._clone(),
        })
      );
      return t.metadata._copy(this.metadata), t;
    }
    _onReload(e) {
      Nl(!this.reloadListener, this.auth, "internal-error"),
        (this.reloadListener = e),
        this.reloadUserInfo &&
          (this._notifyReloadListener(this.reloadUserInfo),
          (this.reloadUserInfo = null));
    }
    _notifyReloadListener(e) {
      this.reloadListener ? this.reloadListener(e) : (this.reloadUserInfo = e);
    }
    _startProactiveRefresh() {
      this.proactiveRefresh._start();
    }
    _stopProactiveRefresh() {
      this.proactiveRefresh._stop();
    }
    async _updateTokensIfNecessary(e, t = !1) {
      let n = !1;
      e.idToken &&
        e.idToken !== this.stsTokenManager.accessToken &&
        (this.stsTokenManager.updateFromServerResponse(e), (n = !0)),
        t && (await nd(this)),
        await this.auth._persistUserIfCurrent(this),
        n && this.auth._notifyListenersIfCurrent(this);
    }
    async delete() {
      const e = await this.getIdToken();
      return (
        await Zl(
          this,
          (async function (e, t) {
            return Bl(e, "POST", "/v1/accounts:delete", t);
          })(this.auth, { idToken: e })
        ),
        this.stsTokenManager.clearRefreshToken(),
        this.auth.signOut()
      );
    }
    toJSON() {
      return Object.assign(
        Object.assign(
          {
            uid: this.uid,
            email: this.email || void 0,
            emailVerified: this.emailVerified,
            displayName: this.displayName || void 0,
            isAnonymous: this.isAnonymous,
            photoURL: this.photoURL || void 0,
            phoneNumber: this.phoneNumber || void 0,
            tenantId: this.tenantId || void 0,
            providerData: this.providerData.map((e) => Object.assign({}, e)),
            stsTokenManager: this.stsTokenManager.toJSON(),
            _redirectEventId: this._redirectEventId,
          },
          this.metadata.toJSON()
        ),
        { apiKey: this.auth.config.apiKey, appName: this.auth.name }
      );
    }
    get refreshToken() {
      return this.stsTokenManager.refreshToken || "";
    }
    static _fromJSON(e, t) {
      var n, r, i, s, o, a, c, h;
      const u = null !== (n = t.displayName) && void 0 !== n ? n : void 0,
        l = null !== (r = t.email) && void 0 !== r ? r : void 0,
        d = null !== (i = t.phoneNumber) && void 0 !== i ? i : void 0,
        f = null !== (s = t.photoURL) && void 0 !== s ? s : void 0,
        p = null !== (o = t.tenantId) && void 0 !== o ? o : void 0,
        g = null !== (a = t._redirectEventId) && void 0 !== a ? a : void 0,
        m = null !== (c = t.createdAt) && void 0 !== c ? c : void 0,
        y = null !== (h = t.lastLoginAt) && void 0 !== h ? h : void 0,
        {
          uid: v,
          emailVerified: w,
          isAnonymous: _,
          providerData: E,
          stsTokenManager: I,
        } = t;
      Nl(v && I, e, "internal-error");
      const T = rd.fromJSON(this.name, I);
      Nl("string" == typeof v, e, "internal-error"),
        id(u, e.name),
        id(l, e.name),
        Nl("boolean" == typeof w, e, "internal-error"),
        Nl("boolean" == typeof _, e, "internal-error"),
        id(d, e.name),
        id(f, e.name),
        id(p, e.name),
        id(g, e.name),
        id(m, e.name),
        id(y, e.name);
      const b = new sd({
        uid: v,
        auth: e,
        email: l,
        emailVerified: w,
        displayName: u,
        isAnonymous: _,
        photoURL: f,
        phoneNumber: d,
        tenantId: p,
        stsTokenManager: T,
        createdAt: m,
        lastLoginAt: y,
      });
      return (
        E &&
          Array.isArray(E) &&
          (b.providerData = E.map((e) => Object.assign({}, e))),
        g && (b._redirectEventId = g),
        b
      );
    }
    static async _fromIdTokenResponse(e, t, n = !1) {
      const r = new rd();
      r.updateFromServerResponse(t);
      const i = new sd({
        uid: t.localId,
        auth: e,
        stsTokenManager: r,
        isAnonymous: n,
      });
      return await nd(i), i;
    }
  }
  const od = new Map();
  function ad(e) {
    Dl(e instanceof Function, "Expected a class definition");
    let t = od.get(e);
    return t
      ? (Dl(t instanceof e, "Instance stored in cache mismatched with class"),
        t)
      : ((t = new e()), od.set(e, t), t);
  }
  class cd {
    constructor() {
      (this.type = "NONE"), (this.storage = {});
    }
    async _isAvailable() {
      return !0;
    }
    async _set(e, t) {
      this.storage[e] = t;
    }
    async _get(e) {
      const t = this.storage[e];
      return void 0 === t ? null : t;
    }
    async _remove(e) {
      delete this.storage[e];
    }
    _addListener(e, t) {}
    _removeListener(e, t) {}
  }
  cd.type = "NONE";
  const hd = cd;
  function ud(e, t, n) {
    return `firebase:${e}:${t}:${n}`;
  }
  class ld {
    constructor(e, t, n) {
      (this.persistence = e), (this.auth = t), (this.userKey = n);
      const { config: r, name: i } = this.auth;
      (this.fullUserKey = ud(this.userKey, r.apiKey, i)),
        (this.fullPersistenceKey = ud("persistence", r.apiKey, i)),
        (this.boundEventHandler = t._onStorageEvent.bind(t)),
        this.persistence._addListener(this.fullUserKey, this.boundEventHandler);
    }
    setCurrentUser(e) {
      return this.persistence._set(this.fullUserKey, e.toJSON());
    }
    async getCurrentUser() {
      const e = await this.persistence._get(this.fullUserKey);
      return e ? sd._fromJSON(this.auth, e) : null;
    }
    removeCurrentUser() {
      return this.persistence._remove(this.fullUserKey);
    }
    savePersistenceForRedirect() {
      return this.persistence._set(
        this.fullPersistenceKey,
        this.persistence.type
      );
    }
    async setPersistence(e) {
      if (this.persistence === e) return;
      const t = await this.getCurrentUser();
      return (
        await this.removeCurrentUser(),
        (this.persistence = e),
        t ? this.setCurrentUser(t) : void 0
      );
    }
    delete() {
      this.persistence._removeListener(
        this.fullUserKey,
        this.boundEventHandler
      );
    }
    static async create(e, t, n = "authUser") {
      if (!t.length) return new ld(ad(hd), e, n);
      const r = (
        await Promise.all(
          t.map(async (e) => {
            if (await e._isAvailable()) return e;
          })
        )
      ).filter((e) => e);
      let i = r[0] || ad(hd);
      const s = ud(n, e.config.apiKey, e.name);
      let o = null;
      for (const n of t)
        try {
          const t = await n._get(s);
          if (t) {
            const r = sd._fromJSON(e, t);
            n !== i && (o = r), (i = n);
            break;
          }
        } catch (e) {}
      const a = r.filter((e) => e._shouldAllowMigration);
      return i._shouldAllowMigration && a.length
        ? ((i = a[0]),
          o && (await i._set(s, o.toJSON())),
          await Promise.all(
            t.map(async (e) => {
              if (e !== i)
                try {
                  await e._remove(s);
                } catch (e) {}
            })
          ),
          new ld(i, e, n))
        : new ld(i, e, n);
    }
  }
  function dd(e) {
    const t = e.toLowerCase();
    if (t.includes("opera/") || t.includes("opr/") || t.includes("opios/"))
      return "Opera";
    if (md(t)) return "IEMobile";
    if (t.includes("msie") || t.includes("trident/")) return "IE";
    if (t.includes("edge/")) return "Edge";
    if (fd(t)) return "Firefox";
    if (t.includes("silk/")) return "Silk";
    if (vd(t)) return "Blackberry";
    if (wd(t)) return "Webos";
    if (pd(t)) return "Safari";
    if ((t.includes("chrome/") || gd(t)) && !t.includes("edge/"))
      return "Chrome";
    if (yd(t)) return "Android";
    {
      const t = /([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,
        n = e.match(t);
      if (2 === (null == n ? void 0 : n.length)) return n[1];
    }
    return "Other";
  }
  function fd(e = d()) {
    return /firefox\//i.test(e);
  }
  function pd(e = d()) {
    const t = e.toLowerCase();
    return (
      t.includes("safari/") &&
      !t.includes("chrome/") &&
      !t.includes("crios/") &&
      !t.includes("android")
    );
  }
  function gd(e = d()) {
    return /crios\//i.test(e);
  }
  function md(e = d()) {
    return /iemobile/i.test(e);
  }
  function yd(e = d()) {
    return /android/i.test(e);
  }
  function vd(e = d()) {
    return /blackberry/i.test(e);
  }
  function wd(e = d()) {
    return /webos/i.test(e);
  }
  function _d(e = d()) {
    return (
      /iphone|ipad|ipod/i.test(e) || (/macintosh/i.test(e) && /mobile/i.test(e))
    );
  }
  function Ed(e = d()) {
    return (
      _d(e) || yd(e) || wd(e) || vd(e) || /windows phone/i.test(e) || md(e)
    );
  }
  function Id(e, t = []) {
    let n;
    switch (e) {
      case "Browser":
        n = dd(d());
        break;
      case "Worker":
        n = `${dd(d())}-${e}`;
        break;
      default:
        n = e;
    }
    const r = t.length ? t.join(",") : "FirebaseCore-web";
    return `${n}/JsCore/${de}/${r}`;
  }
  class Td {
    constructor(e) {
      (this.auth = e), (this.queue = []);
    }
    pushCallback(e, t) {
      const n = (t) =>
        new Promise((n, r) => {
          try {
            n(e(t));
          } catch (e) {
            r(e);
          }
        });
      (n.onAbort = t), this.queue.push(n);
      const r = this.queue.length - 1;
      return () => {
        this.queue[r] = () => Promise.resolve();
      };
    }
    async runMiddleware(e) {
      if (this.auth.currentUser === e) return;
      const t = [];
      try {
        for (const n of this.queue) await n(e), n.onAbort && t.push(n.onAbort);
      } catch (e) {
        t.reverse();
        for (const e of t)
          try {
            e();
          } catch (e) {}
        throw this.auth._errorFactory.create("login-blocked", {
          originalMessage: null == e ? void 0 : e.message,
        });
      }
    }
  }
  class bd {
    constructor(e) {
      var t, n, r, i;
      const s = e.customStrengthOptions;
      (this.customStrengthOptions = {}),
        (this.customStrengthOptions.minPasswordLength =
          null !== (t = s.minPasswordLength) && void 0 !== t ? t : 6),
        s.maxPasswordLength &&
          (this.customStrengthOptions.maxPasswordLength = s.maxPasswordLength),
        void 0 !== s.containsLowercaseCharacter &&
          (this.customStrengthOptions.containsLowercaseLetter =
            s.containsLowercaseCharacter),
        void 0 !== s.containsUppercaseCharacter &&
          (this.customStrengthOptions.containsUppercaseLetter =
            s.containsUppercaseCharacter),
        void 0 !== s.containsNumericCharacter &&
          (this.customStrengthOptions.containsNumericCharacter =
            s.containsNumericCharacter),
        void 0 !== s.containsNonAlphanumericCharacter &&
          (this.customStrengthOptions.containsNonAlphanumericCharacter =
            s.containsNonAlphanumericCharacter),
        (this.enforcementState = e.enforcementState),
        "ENFORCEMENT_STATE_UNSPECIFIED" === this.enforcementState &&
          (this.enforcementState = "OFF"),
        (this.allowedNonAlphanumericCharacters =
          null !==
            (r =
              null === (n = e.allowedNonAlphanumericCharacters) || void 0 === n
                ? void 0
                : n.join("")) && void 0 !== r
            ? r
            : ""),
        (this.forceUpgradeOnSignin =
          null !== (i = e.forceUpgradeOnSignin) && void 0 !== i && i),
        (this.schemaVersion = e.schemaVersion);
    }
    validatePassword(e) {
      var t, n, r, i, s, o;
      const a = { isValid: !0, passwordPolicy: this };
      return (
        this.validatePasswordLengthOptions(e, a),
        this.validatePasswordCharacterOptions(e, a),
        a.isValid &&
          (a.isValid =
            null === (t = a.meetsMinPasswordLength) || void 0 === t || t),
        a.isValid &&
          (a.isValid =
            null === (n = a.meetsMaxPasswordLength) || void 0 === n || n),
        a.isValid &&
          (a.isValid =
            null === (r = a.containsLowercaseLetter) || void 0 === r || r),
        a.isValid &&
          (a.isValid =
            null === (i = a.containsUppercaseLetter) || void 0 === i || i),
        a.isValid &&
          (a.isValid =
            null === (s = a.containsNumericCharacter) || void 0 === s || s),
        a.isValid &&
          (a.isValid =
            null === (o = a.containsNonAlphanumericCharacter) ||
            void 0 === o ||
            o),
        a
      );
    }
    validatePasswordLengthOptions(e, t) {
      const n = this.customStrengthOptions.minPasswordLength,
        r = this.customStrengthOptions.maxPasswordLength;
      n && (t.meetsMinPasswordLength = e.length >= n),
        r && (t.meetsMaxPasswordLength = e.length <= r);
    }
    validatePasswordCharacterOptions(e, t) {
      let n;
      this.updatePasswordCharacterOptionsStatuses(t, !1, !1, !1, !1);
      for (let r = 0; r < e.length; r++)
        (n = e.charAt(r)),
          this.updatePasswordCharacterOptionsStatuses(
            t,
            n >= "a" && n <= "z",
            n >= "A" && n <= "Z",
            n >= "0" && n <= "9",
            this.allowedNonAlphanumericCharacters.includes(n)
          );
    }
    updatePasswordCharacterOptionsStatuses(e, t, n, r, i) {
      this.customStrengthOptions.containsLowercaseLetter &&
        (e.containsLowercaseLetter || (e.containsLowercaseLetter = t)),
        this.customStrengthOptions.containsUppercaseLetter &&
          (e.containsUppercaseLetter || (e.containsUppercaseLetter = n)),
        this.customStrengthOptions.containsNumericCharacter &&
          (e.containsNumericCharacter || (e.containsNumericCharacter = r)),
        this.customStrengthOptions.containsNonAlphanumericCharacter &&
          (e.containsNonAlphanumericCharacter ||
            (e.containsNonAlphanumericCharacter = i));
    }
  }
  class Sd {
    constructor(e, t, n, r) {
      (this.app = e),
        (this.heartbeatServiceProvider = t),
        (this.appCheckServiceProvider = n),
        (this.config = r),
        (this.currentUser = null),
        (this.emulatorConfig = null),
        (this.operations = Promise.resolve()),
        (this.authStateSubscription = new kd(this)),
        (this.idTokenSubscription = new kd(this)),
        (this.beforeStateQueue = new Td(this)),
        (this.redirectUser = null),
        (this.isProactiveRefreshEnabled = !1),
        (this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION = 1),
        (this._canInitEmulator = !0),
        (this._isInitialized = !1),
        (this._deleted = !1),
        (this._initializationPromise = null),
        (this._popupRedirectResolver = null),
        (this._errorFactory = Tl),
        (this._agentRecaptchaConfig = null),
        (this._tenantRecaptchaConfigs = {}),
        (this._projectPasswordPolicy = null),
        (this._tenantPasswordPolicies = {}),
        (this.lastNotifiedUid = void 0),
        (this.languageCode = null),
        (this.tenantId = null),
        (this.settings = { appVerificationDisabledForTesting: !1 }),
        (this.frameworks = []),
        (this.name = e.name),
        (this.clientVersion = r.sdkClientVersion);
    }
    _initializeWithPersistence(e, t) {
      return (
        t && (this._popupRedirectResolver = ad(t)),
        (this._initializationPromise = this.queue(async () => {
          var n, r;
          if (
            !this._deleted &&
            ((this.persistenceManager = await ld.create(this, e)),
            !this._deleted)
          ) {
            if (
              null === (n = this._popupRedirectResolver) || void 0 === n
                ? void 0
                : n._shouldInitProactively
            )
              try {
                await this._popupRedirectResolver._initialize(this);
              } catch (e) {}
            await this.initializeCurrentUser(t),
              (this.lastNotifiedUid =
                (null === (r = this.currentUser) || void 0 === r
                  ? void 0
                  : r.uid) || null),
              this._deleted || (this._isInitialized = !0);
          }
        })),
        this._initializationPromise
      );
    }
    async _onStorageEvent() {
      if (this._deleted) return;
      const e = await this.assertedPersistence.getCurrentUser();
      return this.currentUser || e
        ? this.currentUser && e && this.currentUser.uid === e.uid
          ? (this._currentUser._assign(e),
            void (await this.currentUser.getIdToken()))
          : void (await this._updateCurrentUser(e, !0))
        : void 0;
    }
    async initializeCurrentUser(e) {
      var t;
      const n = await this.assertedPersistence.getCurrentUser();
      let r = n,
        i = !1;
      if (e && this.config.authDomain) {
        await this.getOrInitRedirectPersistenceManager();
        const n =
            null === (t = this.redirectUser) || void 0 === t
              ? void 0
              : t._redirectEventId,
          s = null == r ? void 0 : r._redirectEventId,
          o = await this.tryRedirectSignIn(e);
        (n && n !== s) ||
          !(null == o ? void 0 : o.user) ||
          ((r = o.user), (i = !0));
      }
      if (!r) return this.directlySetCurrentUser(null);
      if (!r._redirectEventId) {
        if (i)
          try {
            await this.beforeStateQueue.runMiddleware(r);
          } catch (e) {
            (r = n),
              this._popupRedirectResolver._overrideRedirectResult(this, () =>
                Promise.reject(e)
              );
          }
        return r
          ? this.reloadAndSetCurrentUserOrClear(r)
          : this.directlySetCurrentUser(null);
      }
      return (
        Nl(this._popupRedirectResolver, this, "argument-error"),
        await this.getOrInitRedirectPersistenceManager(),
        this.redirectUser &&
        this.redirectUser._redirectEventId === r._redirectEventId
          ? this.directlySetCurrentUser(r)
          : this.reloadAndSetCurrentUserOrClear(r)
      );
    }
    async tryRedirectSignIn(e) {
      let t = null;
      try {
        t = await this._popupRedirectResolver._completeRedirectFn(this, e, !0);
      } catch (e) {
        await this._setRedirectUser(null);
      }
      return t;
    }
    async reloadAndSetCurrentUserOrClear(e) {
      try {
        await nd(e);
      } catch (e) {
        if ("auth/network-request-failed" !== (null == e ? void 0 : e.code))
          return this.directlySetCurrentUser(null);
      }
      return this.directlySetCurrentUser(e);
    }
    useDeviceLanguage() {
      this.languageCode = (function () {
        if ("undefined" == typeof navigator) return null;
        const e = navigator;
        return (e.languages && e.languages[0]) || e.language || null;
      })();
    }
    async _delete() {
      this._deleted = !0;
    }
    async updateCurrentUser(e) {
      const t = e ? T(e) : null;
      return (
        t &&
          Nl(
            t.auth.config.apiKey === this.config.apiKey,
            this,
            "invalid-user-token"
          ),
        this._updateCurrentUser(t && t._clone(this))
      );
    }
    async _updateCurrentUser(e, t = !1) {
      if (!this._deleted)
        return (
          e && Nl(this.tenantId === e.tenantId, this, "tenant-id-mismatch"),
          t || (await this.beforeStateQueue.runMiddleware(e)),
          this.queue(async () => {
            await this.directlySetCurrentUser(e), this.notifyAuthListeners();
          })
        );
    }
    async signOut() {
      return (
        await this.beforeStateQueue.runMiddleware(null),
        (this.redirectPersistenceManager || this._popupRedirectResolver) &&
          (await this._setRedirectUser(null)),
        this._updateCurrentUser(null, !0)
      );
    }
    setPersistence(e) {
      return this.queue(async () => {
        await this.assertedPersistence.setPersistence(ad(e));
      });
    }
    _getRecaptchaConfig() {
      return null == this.tenantId
        ? this._agentRecaptchaConfig
        : this._tenantRecaptchaConfigs[this.tenantId];
    }
    async validatePassword(e) {
      this._getPasswordPolicyInternal() || (await this._updatePasswordPolicy());
      const t = this._getPasswordPolicyInternal();
      return t.schemaVersion !== this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION
        ? Promise.reject(
            this._errorFactory.create(
              "unsupported-password-policy-schema-version",
              {}
            )
          )
        : t.validatePassword(e);
    }
    _getPasswordPolicyInternal() {
      return null === this.tenantId
        ? this._projectPasswordPolicy
        : this._tenantPasswordPolicies[this.tenantId];
    }
    async _updatePasswordPolicy() {
      const e = await (async function (e, t = {}) {
          return Bl(e, "GET", "/v2/passwordPolicy", jl(e, t));
        })(this),
        t = new bd(e);
      null === this.tenantId
        ? (this._projectPasswordPolicy = t)
        : (this._tenantPasswordPolicies[this.tenantId] = t);
    }
    _getPersistence() {
      return this.assertedPersistence.persistence.type;
    }
    _updateErrorMap(e) {
      this._errorFactory = new p("auth", "Firebase", e());
    }
    onAuthStateChanged(e, t, n) {
      return this.registerStateListener(this.authStateSubscription, e, t, n);
    }
    beforeAuthStateChanged(e, t) {
      return this.beforeStateQueue.pushCallback(e, t);
    }
    onIdTokenChanged(e, t, n) {
      return this.registerStateListener(this.idTokenSubscription, e, t, n);
    }
    authStateReady() {
      return new Promise((e, t) => {
        if (this.currentUser) e();
        else {
          const n = this.onAuthStateChanged(() => {
            n(), e();
          }, t);
        }
      });
    }
    async revokeAccessToken(e) {
      if (this.currentUser) {
        const t = {
          providerId: "apple.com",
          tokenType: "ACCESS_TOKEN",
          token: e,
          idToken: await this.currentUser.getIdToken(),
        };
        null != this.tenantId && (t.tenantId = this.tenantId),
          await (async function (e, t) {
            return Bl(e, "POST", "/v2/accounts:revokeToken", jl(e, t));
          })(this, t);
      }
    }
    toJSON() {
      var e;
      return {
        apiKey: this.config.apiKey,
        authDomain: this.config.authDomain,
        appName: this.name,
        currentUser:
          null === (e = this._currentUser) || void 0 === e
            ? void 0
            : e.toJSON(),
      };
    }
    async _setRedirectUser(e, t) {
      const n = await this.getOrInitRedirectPersistenceManager(t);
      return null === e ? n.removeCurrentUser() : n.setCurrentUser(e);
    }
    async getOrInitRedirectPersistenceManager(e) {
      if (!this.redirectPersistenceManager) {
        const t = (e && ad(e)) || this._popupRedirectResolver;
        Nl(t, this, "argument-error"),
          (this.redirectPersistenceManager = await ld.create(
            this,
            [ad(t._redirectPersistence)],
            "redirectUser"
          )),
          (this.redirectUser =
            await this.redirectPersistenceManager.getCurrentUser());
      }
      return this.redirectPersistenceManager;
    }
    async _redirectUserForId(e) {
      var t, n;
      return (
        this._isInitialized && (await this.queue(async () => {})),
        (null === (t = this._currentUser) || void 0 === t
          ? void 0
          : t._redirectEventId) === e
          ? this._currentUser
          : (null === (n = this.redirectUser) || void 0 === n
              ? void 0
              : n._redirectEventId) === e
          ? this.redirectUser
          : null
      );
    }
    async _persistUserIfCurrent(e) {
      if (e === this.currentUser)
        return this.queue(async () => this.directlySetCurrentUser(e));
    }
    _notifyListenersIfCurrent(e) {
      e === this.currentUser && this.notifyAuthListeners();
    }
    _key() {
      return `${this.config.authDomain}:${this.config.apiKey}:${this.name}`;
    }
    _startProactiveRefresh() {
      (this.isProactiveRefreshEnabled = !0),
        this.currentUser && this._currentUser._startProactiveRefresh();
    }
    _stopProactiveRefresh() {
      (this.isProactiveRefreshEnabled = !1),
        this.currentUser && this._currentUser._stopProactiveRefresh();
    }
    get _currentUser() {
      return this.currentUser;
    }
    notifyAuthListeners() {
      var e, t;
      if (!this._isInitialized) return;
      this.idTokenSubscription.next(this.currentUser);
      const n =
        null !==
          (t =
            null === (e = this.currentUser) || void 0 === e ? void 0 : e.uid) &&
        void 0 !== t
          ? t
          : null;
      this.lastNotifiedUid !== n &&
        ((this.lastNotifiedUid = n),
        this.authStateSubscription.next(this.currentUser));
    }
    registerStateListener(e, t, n, r) {
      if (this._deleted) return () => {};
      const i = "function" == typeof t ? t : t.next.bind(t);
      let s = !1;
      const o = this._isInitialized
        ? Promise.resolve()
        : this._initializationPromise;
      if (
        (Nl(o, this, "internal-error"),
        o.then(() => {
          s || i(this.currentUser);
        }),
        "function" == typeof t)
      ) {
        const i = e.addObserver(t, n, r);
        return () => {
          (s = !0), i();
        };
      }
      {
        const n = e.addObserver(t);
        return () => {
          (s = !0), n();
        };
      }
    }
    async directlySetCurrentUser(e) {
      this.currentUser &&
        this.currentUser !== e &&
        this._currentUser._stopProactiveRefresh(),
        e && this.isProactiveRefreshEnabled && e._startProactiveRefresh(),
        (this.currentUser = e),
        e
          ? await this.assertedPersistence.setCurrentUser(e)
          : await this.assertedPersistence.removeCurrentUser();
    }
    queue(e) {
      return (this.operations = this.operations.then(e, e)), this.operations;
    }
    get assertedPersistence() {
      return (
        Nl(this.persistenceManager, this, "internal-error"),
        this.persistenceManager
      );
    }
    _logFramework(e) {
      e &&
        !this.frameworks.includes(e) &&
        (this.frameworks.push(e),
        this.frameworks.sort(),
        (this.clientVersion = Id(
          this.config.clientPlatform,
          this._getFrameworks()
        )));
    }
    _getFrameworks() {
      return this.frameworks;
    }
    async _getAdditionalHeaders() {
      var e;
      const t = { "X-Client-Version": this.clientVersion };
      this.app.options.appId &&
        (t["X-Firebase-gmpid"] = this.app.options.appId);
      const n = await (null ===
        (e = this.heartbeatServiceProvider.getImmediate({ optional: !0 })) ||
      void 0 === e
        ? void 0
        : e.getHeartbeatsHeader());
      n && (t["X-Firebase-Client"] = n);
      const r = await this._getAppCheckToken();
      return r && (t["X-Firebase-AppCheck"] = r), t;
    }
    async _getAppCheckToken() {
      var e;
      const t = await (null ===
        (e = this.appCheckServiceProvider.getImmediate({ optional: !0 })) ||
      void 0 === e
        ? void 0
        : e.getToken());
      return (
        (null == t ? void 0 : t.error) &&
          (function (e, ...t) {
            bl.logLevel <= N.WARN && bl.warn(`Auth (${de}): ${e}`, ...t);
          })(`Error while retrieving App Check token: ${t.error}`),
        null == t ? void 0 : t.token
      );
    }
  }
  function Cd(e) {
    return T(e);
  }
  class kd {
    constructor(e) {
      (this.auth = e),
        (this.observer = null),
        (this.addObserver = (function (e, t) {
          const n = new E(e, void 0);
          return n.subscribe.bind(n);
        })((e) => (this.observer = e)));
    }
    get next() {
      return (
        Nl(this.observer, this.auth, "internal-error"),
        this.observer.next.bind(this.observer)
      );
    }
  }
  function Ad(e) {
    return new Promise((t, n) => {
      const r = document.createElement("script");
      var i, s;
      r.setAttribute("src", e),
        (r.onload = t),
        (r.onerror = (e) => {
          const t = kl("internal-error");
          (t.customData = e), n(t);
        }),
        (r.type = "text/javascript"),
        (r.charset = "UTF-8"),
        (null !==
          (s =
            null === (i = document.getElementsByTagName("head")) || void 0 === i
              ? void 0
              : i[0]) && void 0 !== s
          ? s
          : document
        ).appendChild(r);
    });
  }
  function Nd(e) {
    return `__${e}${Math.floor(1e6 * Math.random())}`;
  }
  class Rd {
    constructor(e) {
      (this.type = "recaptcha-enterprise"), (this.auth = Cd(e));
    }
    async verify(e = "verify", t = !1) {
      function n(t, n, r) {
        const i = window.grecaptcha;
        Wl(i)
          ? i.enterprise.ready(() => {
              i.enterprise
                .execute(t, { action: e })
                .then((e) => {
                  n(e);
                })
                .catch(() => {
                  n("NO_RECAPTCHA");
                });
            })
          : r(Error("No reCAPTCHA enterprise script loaded."));
      }
      return new Promise((e, r) => {
        (async function (e) {
          if (!t) {
            if (null == e.tenantId && null != e._agentRecaptchaConfig)
              return e._agentRecaptchaConfig.siteKey;
            if (
              null != e.tenantId &&
              void 0 !== e._tenantRecaptchaConfigs[e.tenantId]
            )
              return e._tenantRecaptchaConfigs[e.tenantId].siteKey;
          }
          return new Promise(async (t, n) => {
            (async function (e, t) {
              return Bl(e, "GET", "/v2/recaptchaConfig", jl(e, t));
            })(e, {
              clientType: "CLIENT_TYPE_WEB",
              version: "RECAPTCHA_ENTERPRISE",
            })
              .then((r) => {
                if (void 0 !== r.recaptchaKey) {
                  const n = new Ql(r);
                  return (
                    null == e.tenantId
                      ? (e._agentRecaptchaConfig = n)
                      : (e._tenantRecaptchaConfigs[e.tenantId] = n),
                    t(n.siteKey)
                  );
                }
                n(new Error("recaptcha Enterprise site key undefined"));
              })
              .catch((e) => {
                n(e);
              });
          });
        })(this.auth)
          .then((i) => {
            if (!t && Wl(window.grecaptcha)) n(i, e, r);
            else {
              if ("undefined" == typeof window)
                return void r(
                  new Error("RecaptchaVerifier is only supported in browser")
                );
              Ad("" + i)
                .then(() => {
                  n(i, e, r);
                })
                .catch((e) => {
                  r(e);
                });
            }
          })
          .catch((e) => {
            r(e);
          });
      });
    }
  }
  async function Dd(e, t, n, r = !1) {
    const i = new Rd(e);
    let s;
    try {
      s = await i.verify(n);
    } catch (e) {
      s = await i.verify(n, !0);
    }
    const o = Object.assign({}, t);
    return (
      r
        ? Object.assign(o, { captchaResp: s })
        : Object.assign(o, { captchaResponse: s }),
      Object.assign(o, { clientType: "CLIENT_TYPE_WEB" }),
      Object.assign(o, { recaptchaVersion: "RECAPTCHA_ENTERPRISE" }),
      o
    );
  }
  async function Od(e, t, n, r) {
    var i;
    if (
      null === (i = e._getRecaptchaConfig()) || void 0 === i
        ? void 0
        : i.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")
    ) {
      const i = await Dd(e, t, n, "getOobCode" === n);
      return r(e, i);
    }
    return r(e, t).catch(async (i) => {
      if ("auth/missing-recaptcha-token" === i.code) {
        console.log(
          `${n} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`
        );
        const i = await Dd(e, t, n, "getOobCode" === n);
        return r(e, i);
      }
      return Promise.reject(i);
    });
  }
  function Pd(e) {
    const t = e.indexOf(":");
    return t < 0 ? "" : e.substr(0, t + 1);
  }
  function Ld(e) {
    if (!e) return null;
    const t = Number(e);
    return isNaN(t) ? null : t;
  }
  class Md {
    constructor(e, t) {
      (this.providerId = e), (this.signInMethod = t);
    }
    toJSON() {
      return Rl("not implemented");
    }
    _getIdTokenResponse(e) {
      return Rl("not implemented");
    }
    _linkToIdToken(e, t) {
      return Rl("not implemented");
    }
    _getReauthenticationResolver(e) {
      return Rl("not implemented");
    }
  }
  async function xd(e, t) {
    return Bl(e, "POST", "/v1/accounts:signUp", t);
  }
  async function Ud(e, t) {
    return $l(e, "POST", "/v1/accounts:signInWithPassword", jl(e, t));
  }
  class Vd extends Md {
    constructor(e, t, n, r = null) {
      super("password", n),
        (this._email = e),
        (this._password = t),
        (this._tenantId = r);
    }
    static _fromEmailAndPassword(e, t) {
      return new Vd(e, t, "password");
    }
    static _fromEmailAndCode(e, t, n = null) {
      return new Vd(e, t, "emailLink", n);
    }
    toJSON() {
      return {
        email: this._email,
        password: this._password,
        signInMethod: this.signInMethod,
        tenantId: this._tenantId,
      };
    }
    static fromJSON(e) {
      const t = "string" == typeof e ? JSON.parse(e) : e;
      if ((null == t ? void 0 : t.email) && (null == t ? void 0 : t.password)) {
        if ("password" === t.signInMethod)
          return this._fromEmailAndPassword(t.email, t.password);
        if ("emailLink" === t.signInMethod)
          return this._fromEmailAndCode(t.email, t.password, t.tenantId);
      }
      return null;
    }
    async _getIdTokenResponse(e) {
      switch (this.signInMethod) {
        case "password":
          return Od(
            e,
            {
              returnSecureToken: !0,
              email: this._email,
              password: this._password,
              clientType: "CLIENT_TYPE_WEB",
            },
            "signInWithPassword",
            Ud
          );
        case "emailLink":
          return (async function (e, t) {
            return $l(e, "POST", "/v1/accounts:signInWithEmailLink", jl(e, t));
          })(e, { email: this._email, oobCode: this._password });
        default:
          Cl(e, "internal-error");
      }
    }
    async _linkToIdToken(e, t) {
      switch (this.signInMethod) {
        case "password":
          return Od(
            e,
            {
              idToken: t,
              returnSecureToken: !0,
              email: this._email,
              password: this._password,
              clientType: "CLIENT_TYPE_WEB",
            },
            "signUpPassword",
            xd
          );
        case "emailLink":
          return (async function (e, t) {
            return $l(e, "POST", "/v1/accounts:signInWithEmailLink", jl(e, t));
          })(e, { idToken: t, email: this._email, oobCode: this._password });
        default:
          Cl(e, "internal-error");
      }
    }
    _getReauthenticationResolver(e) {
      return this._getIdTokenResponse(e);
    }
  }
  async function Fd(e, t) {
    return $l(e, "POST", "/v1/accounts:signInWithIdp", jl(e, t));
  }
  class jd extends Md {
    constructor() {
      super(...arguments), (this.pendingToken = null);
    }
    static _fromParams(e) {
      const t = new jd(e.providerId, e.signInMethod);
      return (
        e.idToken || e.accessToken
          ? (e.idToken && (t.idToken = e.idToken),
            e.accessToken && (t.accessToken = e.accessToken),
            e.nonce && !e.pendingToken && (t.nonce = e.nonce),
            e.pendingToken && (t.pendingToken = e.pendingToken))
          : e.oauthToken && e.oauthTokenSecret
          ? ((t.accessToken = e.oauthToken), (t.secret = e.oauthTokenSecret))
          : Cl("argument-error"),
        t
      );
    }
    toJSON() {
      return {
        idToken: this.idToken,
        accessToken: this.accessToken,
        secret: this.secret,
        nonce: this.nonce,
        pendingToken: this.pendingToken,
        providerId: this.providerId,
        signInMethod: this.signInMethod,
      };
    }
    static fromJSON(e) {
      const t = "string" == typeof e ? JSON.parse(e) : e,
        { providerId: n, signInMethod: r } = t,
        i = El(t, ["providerId", "signInMethod"]);
      if (!n || !r) return null;
      const s = new jd(n, r);
      return (
        (s.idToken = i.idToken || void 0),
        (s.accessToken = i.accessToken || void 0),
        (s.secret = i.secret),
        (s.nonce = i.nonce),
        (s.pendingToken = i.pendingToken || null),
        s
      );
    }
    _getIdTokenResponse(e) {
      return Fd(e, this.buildRequest());
    }
    _linkToIdToken(e, t) {
      const n = this.buildRequest();
      return (n.idToken = t), Fd(e, n);
    }
    _getReauthenticationResolver(e) {
      const t = this.buildRequest();
      return (t.autoCreate = !1), Fd(e, t);
    }
    buildRequest() {
      const e = { requestUri: "http://localhost", returnSecureToken: !0 };
      if (this.pendingToken) e.pendingToken = this.pendingToken;
      else {
        const t = {};
        this.idToken && (t.id_token = this.idToken),
          this.accessToken && (t.access_token = this.accessToken),
          this.secret && (t.oauth_token_secret = this.secret),
          (t.providerId = this.providerId),
          this.nonce && !this.pendingToken && (t.nonce = this.nonce),
          (e.postBody = v(t));
      }
      return e;
    }
  }
  const Bd = { USER_NOT_FOUND: "user-not-found" };
  class qd extends Md {
    constructor(e) {
      super("phone", "phone"), (this.params = e);
    }
    static _fromVerification(e, t) {
      return new qd({ verificationId: e, verificationCode: t });
    }
    static _fromTokenResponse(e, t) {
      return new qd({ phoneNumber: e, temporaryProof: t });
    }
    _getIdTokenResponse(e) {
      return (async function (e, t) {
        return $l(e, "POST", "/v1/accounts:signInWithPhoneNumber", jl(e, t));
      })(e, this._makeVerificationRequest());
    }
    _linkToIdToken(e, t) {
      return (async function (e, t) {
        const n = await $l(
          e,
          "POST",
          "/v1/accounts:signInWithPhoneNumber",
          jl(e, t)
        );
        if (n.temporaryProof)
          throw Gl(e, "account-exists-with-different-credential", n);
        return n;
      })(e, Object.assign({ idToken: t }, this._makeVerificationRequest()));
    }
    _getReauthenticationResolver(e) {
      return (async function (e, t) {
        return $l(
          e,
          "POST",
          "/v1/accounts:signInWithPhoneNumber",
          jl(e, Object.assign(Object.assign({}, t), { operation: "REAUTH" })),
          Bd
        );
      })(e, this._makeVerificationRequest());
    }
    _makeVerificationRequest() {
      const {
        temporaryProof: e,
        phoneNumber: t,
        verificationId: n,
        verificationCode: r,
      } = this.params;
      return e && t
        ? { temporaryProof: e, phoneNumber: t }
        : { sessionInfo: n, code: r };
    }
    toJSON() {
      const e = { providerId: this.providerId };
      return (
        this.params.phoneNumber && (e.phoneNumber = this.params.phoneNumber),
        this.params.temporaryProof &&
          (e.temporaryProof = this.params.temporaryProof),
        this.params.verificationCode &&
          (e.verificationCode = this.params.verificationCode),
        this.params.verificationId &&
          (e.verificationId = this.params.verificationId),
        e
      );
    }
    static fromJSON(e) {
      "string" == typeof e && (e = JSON.parse(e));
      const {
        verificationId: t,
        verificationCode: n,
        phoneNumber: r,
        temporaryProof: i,
      } = e;
      return n || t || r || i
        ? new qd({
            verificationId: t,
            verificationCode: n,
            phoneNumber: r,
            temporaryProof: i,
          })
        : null;
    }
  }
  class $d {
    constructor(e) {
      var t, n, r, i, s, o;
      const a = w(_(e)),
        c = null !== (t = a.apiKey) && void 0 !== t ? t : null,
        h = null !== (n = a.oobCode) && void 0 !== n ? n : null,
        u = (function (e) {
          switch (e) {
            case "recoverEmail":
              return "RECOVER_EMAIL";
            case "resetPassword":
              return "PASSWORD_RESET";
            case "signIn":
              return "EMAIL_SIGNIN";
            case "verifyEmail":
              return "VERIFY_EMAIL";
            case "verifyAndChangeEmail":
              return "VERIFY_AND_CHANGE_EMAIL";
            case "revertSecondFactorAddition":
              return "REVERT_SECOND_FACTOR_ADDITION";
            default:
              return null;
          }
        })(null !== (r = a.mode) && void 0 !== r ? r : null);
      Nl(c && h && u, "argument-error"),
        (this.apiKey = c),
        (this.operation = u),
        (this.code = h),
        (this.continueUrl =
          null !== (i = a.continueUrl) && void 0 !== i ? i : null),
        (this.languageCode =
          null !== (s = a.languageCode) && void 0 !== s ? s : null),
        (this.tenantId = null !== (o = a.tenantId) && void 0 !== o ? o : null);
    }
    static parseLink(e) {
      const t = (function (e) {
        const t = w(_(e)).link,
          n = t ? w(_(t)).deep_link_id : null,
          r = w(_(e)).deep_link_id;
        return (r ? w(_(r)).link : null) || r || n || t || e;
      })(e);
      try {
        return new $d(t);
      } catch (e) {
        return null;
      }
    }
  }
  class zd {
    constructor() {
      this.providerId = zd.PROVIDER_ID;
    }
    static credential(e, t) {
      return Vd._fromEmailAndPassword(e, t);
    }
    static credentialWithLink(e, t) {
      const n = $d.parseLink(t);
      return (
        Nl(n, "argument-error"), Vd._fromEmailAndCode(e, n.code, n.tenantId)
      );
    }
  }
  (zd.PROVIDER_ID = "password"),
    (zd.EMAIL_PASSWORD_SIGN_IN_METHOD = "password"),
    (zd.EMAIL_LINK_SIGN_IN_METHOD = "emailLink");
  class Hd {
    constructor(e) {
      (this.providerId = e),
        (this.defaultLanguageCode = null),
        (this.customParameters = {});
    }
    setDefaultLanguage(e) {
      this.defaultLanguageCode = e;
    }
    setCustomParameters(e) {
      return (this.customParameters = e), this;
    }
    getCustomParameters() {
      return this.customParameters;
    }
  }
  class Kd extends Hd {
    constructor() {
      super(...arguments), (this.scopes = []);
    }
    addScope(e) {
      return this.scopes.includes(e) || this.scopes.push(e), this;
    }
    getScopes() {
      return [...this.scopes];
    }
  }
  class Gd extends Kd {
    constructor() {
      super("facebook.com");
    }
    static credential(e) {
      return jd._fromParams({
        providerId: Gd.PROVIDER_ID,
        signInMethod: Gd.FACEBOOK_SIGN_IN_METHOD,
        accessToken: e,
      });
    }
    static credentialFromResult(e) {
      return Gd.credentialFromTaggedObject(e);
    }
    static credentialFromError(e) {
      return Gd.credentialFromTaggedObject(e.customData || {});
    }
    static credentialFromTaggedObject({ _tokenResponse: e }) {
      if (!e || !("oauthAccessToken" in e)) return null;
      if (!e.oauthAccessToken) return null;
      try {
        return Gd.credential(e.oauthAccessToken);
      } catch (e) {
        return null;
      }
    }
  }
  (Gd.FACEBOOK_SIGN_IN_METHOD = "facebook.com"),
    (Gd.PROVIDER_ID = "facebook.com");
  class Wd extends Kd {
    constructor() {
      super("google.com"), this.addScope("profile");
    }
    static credential(e, t) {
      return jd._fromParams({
        providerId: Wd.PROVIDER_ID,
        signInMethod: Wd.GOOGLE_SIGN_IN_METHOD,
        idToken: e,
        accessToken: t,
      });
    }
    static credentialFromResult(e) {
      return Wd.credentialFromTaggedObject(e);
    }
    static credentialFromError(e) {
      return Wd.credentialFromTaggedObject(e.customData || {});
    }
    static credentialFromTaggedObject({ _tokenResponse: e }) {
      if (!e) return null;
      const { oauthIdToken: t, oauthAccessToken: n } = e;
      if (!t && !n) return null;
      try {
        return Wd.credential(t, n);
      } catch (e) {
        return null;
      }
    }
  }
  (Wd.GOOGLE_SIGN_IN_METHOD = "google.com"), (Wd.PROVIDER_ID = "google.com");
  class Qd extends Kd {
    constructor() {
      super("github.com");
    }
    static credential(e) {
      return jd._fromParams({
        providerId: Qd.PROVIDER_ID,
        signInMethod: Qd.GITHUB_SIGN_IN_METHOD,
        accessToken: e,
      });
    }
    static credentialFromResult(e) {
      return Qd.credentialFromTaggedObject(e);
    }
    static credentialFromError(e) {
      return Qd.credentialFromTaggedObject(e.customData || {});
    }
    static credentialFromTaggedObject({ _tokenResponse: e }) {
      if (!e || !("oauthAccessToken" in e)) return null;
      if (!e.oauthAccessToken) return null;
      try {
        return Qd.credential(e.oauthAccessToken);
      } catch (e) {
        return null;
      }
    }
  }
  (Qd.GITHUB_SIGN_IN_METHOD = "github.com"), (Qd.PROVIDER_ID = "github.com");
  class Xd extends Kd {
    constructor() {
      super("twitter.com");
    }
    static credential(e, t) {
      return jd._fromParams({
        providerId: Xd.PROVIDER_ID,
        signInMethod: Xd.TWITTER_SIGN_IN_METHOD,
        oauthToken: e,
        oauthTokenSecret: t,
      });
    }
    static credentialFromResult(e) {
      return Xd.credentialFromTaggedObject(e);
    }
    static credentialFromError(e) {
      return Xd.credentialFromTaggedObject(e.customData || {});
    }
    static credentialFromTaggedObject({ _tokenResponse: e }) {
      if (!e) return null;
      const { oauthAccessToken: t, oauthTokenSecret: n } = e;
      if (!t || !n) return null;
      try {
        return Xd.credential(t, n);
      } catch (e) {
        return null;
      }
    }
  }
  (Xd.TWITTER_SIGN_IN_METHOD = "twitter.com"), (Xd.PROVIDER_ID = "twitter.com");
  class Jd {
    constructor(e) {
      (this.user = e.user),
        (this.providerId = e.providerId),
        (this._tokenResponse = e._tokenResponse),
        (this.operationType = e.operationType);
    }
    static async _fromIdTokenResponse(e, t, n, r = !1) {
      const i = await sd._fromIdTokenResponse(e, n, r),
        s = Yd(n);
      return new Jd({
        user: i,
        providerId: s,
        _tokenResponse: n,
        operationType: t,
      });
    }
    static async _forOperation(e, t, n) {
      await e._updateTokensIfNecessary(n, !0);
      const r = Yd(n);
      return new Jd({
        user: e,
        providerId: r,
        _tokenResponse: n,
        operationType: t,
      });
    }
  }
  function Yd(e) {
    return e.providerId ? e.providerId : "phoneNumber" in e ? "phone" : null;
  }
  class Zd extends f {
    constructor(e, t, n, r) {
      var i;
      super(t.code, t.message),
        (this.operationType = n),
        (this.user = r),
        Object.setPrototypeOf(this, Zd.prototype),
        (this.customData = {
          appName: e.name,
          tenantId: null !== (i = e.tenantId) && void 0 !== i ? i : void 0,
          _serverResponse: t.customData._serverResponse,
          operationType: n,
        });
    }
    static _fromErrorAndOperation(e, t, n, r) {
      return new Zd(e, t, n, r);
    }
  }
  function ef(e, t, n, r) {
    return (
      "reauthenticate" === t
        ? n._getReauthenticationResolver(e)
        : n._getIdTokenResponse(e)
    ).catch((n) => {
      if ("auth/multi-factor-auth-required" === n.code)
        throw Zd._fromErrorAndOperation(e, n, t, r);
      throw n;
    });
  }
  new WeakMap();
  const tf = "__sak";
  class nf {
    constructor(e, t) {
      (this.storageRetriever = e), (this.type = t);
    }
    _isAvailable() {
      try {
        return this.storage
          ? (this.storage.setItem(tf, "1"),
            this.storage.removeItem(tf),
            Promise.resolve(!0))
          : Promise.resolve(!1);
      } catch (e) {
        return Promise.resolve(!1);
      }
    }
    _set(e, t) {
      return this.storage.setItem(e, JSON.stringify(t)), Promise.resolve();
    }
    _get(e) {
      const t = this.storage.getItem(e);
      return Promise.resolve(t ? JSON.parse(t) : null);
    }
    _remove(e) {
      return this.storage.removeItem(e), Promise.resolve();
    }
    get storage() {
      return this.storageRetriever();
    }
  }
  class rf extends nf {
    constructor() {
      super(() => window.localStorage, "LOCAL"),
        (this.boundEventHandler = (e, t) => this.onStorageEvent(e, t)),
        (this.listeners = {}),
        (this.localCache = {}),
        (this.pollTimer = null),
        (this.safariLocalStorageNotSynced =
          (function () {
            const e = d();
            return pd(e) || _d(e);
          })() &&
          (function () {
            try {
              return !(!window || window === window.top);
            } catch (e) {
              return !1;
            }
          })()),
        (this.fallbackToPolling = Ed()),
        (this._shouldAllowMigration = !0);
    }
    forAllChangedKeys(e) {
      for (const t of Object.keys(this.listeners)) {
        const n = this.storage.getItem(t),
          r = this.localCache[t];
        n !== r && e(t, r, n);
      }
    }
    onStorageEvent(e, t = !1) {
      if (!e.key)
        return void this.forAllChangedKeys((e, t, n) => {
          this.notifyListeners(e, n);
        });
      const n = e.key;
      if (
        (t ? this.detachListener() : this.stopPolling(),
        this.safariLocalStorageNotSynced)
      ) {
        const r = this.storage.getItem(n);
        if (e.newValue !== r)
          null !== e.newValue
            ? this.storage.setItem(n, e.newValue)
            : this.storage.removeItem(n);
        else if (this.localCache[n] === e.newValue && !t) return;
      }
      const r = () => {
          const e = this.storage.getItem(n);
          (t || this.localCache[n] !== e) && this.notifyListeners(n, e);
        },
        i = this.storage.getItem(n);
      !(function () {
        const e = d();
        return e.indexOf("MSIE ") >= 0 || e.indexOf("Trident/") >= 0;
      })() ||
      10 !== document.documentMode ||
      i === e.newValue ||
      e.newValue === e.oldValue
        ? r()
        : setTimeout(r, 10);
    }
    notifyListeners(e, t) {
      this.localCache[e] = t;
      const n = this.listeners[e];
      if (n) for (const e of Array.from(n)) e(t ? JSON.parse(t) : t);
    }
    startPolling() {
      this.stopPolling(),
        (this.pollTimer = setInterval(() => {
          this.forAllChangedKeys((e, t, n) => {
            this.onStorageEvent(
              new StorageEvent("storage", { key: e, oldValue: t, newValue: n }),
              !0
            );
          });
        }, 1e3));
    }
    stopPolling() {
      this.pollTimer &&
        (clearInterval(this.pollTimer), (this.pollTimer = null));
    }
    attachListener() {
      window.addEventListener("storage", this.boundEventHandler);
    }
    detachListener() {
      window.removeEventListener("storage", this.boundEventHandler);
    }
    _addListener(e, t) {
      0 === Object.keys(this.listeners).length &&
        (this.fallbackToPolling ? this.startPolling() : this.attachListener()),
        this.listeners[e] ||
          ((this.listeners[e] = new Set()),
          (this.localCache[e] = this.storage.getItem(e))),
        this.listeners[e].add(t);
    }
    _removeListener(e, t) {
      this.listeners[e] &&
        (this.listeners[e].delete(t),
        0 === this.listeners[e].size && delete this.listeners[e]),
        0 === Object.keys(this.listeners).length &&
          (this.detachListener(), this.stopPolling());
    }
    async _set(e, t) {
      await super._set(e, t), (this.localCache[e] = JSON.stringify(t));
    }
    async _get(e) {
      const t = await super._get(e);
      return (this.localCache[e] = JSON.stringify(t)), t;
    }
    async _remove(e) {
      await super._remove(e), delete this.localCache[e];
    }
  }
  rf.type = "LOCAL";
  const sf = rf;
  class of extends nf {
    constructor() {
      super(() => window.sessionStorage, "SESSION");
    }
    _addListener(e, t) {}
    _removeListener(e, t) {}
  }
  of.type = "SESSION";
  const af = of;
  class cf {
    constructor(e) {
      (this.eventTarget = e),
        (this.handlersMap = {}),
        (this.boundEventHandler = this.handleEvent.bind(this));
    }
    static _getInstance(e) {
      const t = this.receivers.find((t) => t.isListeningto(e));
      if (t) return t;
      const n = new cf(e);
      return this.receivers.push(n), n;
    }
    isListeningto(e) {
      return this.eventTarget === e;
    }
    async handleEvent(e) {
      const t = e,
        { eventId: n, eventType: r, data: i } = t.data,
        s = this.handlersMap[r];
      if (!(null == s ? void 0 : s.size)) return;
      t.ports[0].postMessage({ status: "ack", eventId: n, eventType: r });
      const o = Array.from(s).map(async (e) => e(t.origin, i)),
        a = await (function (e) {
          return Promise.all(
            e.map(async (e) => {
              try {
                return { fulfilled: !0, value: await e };
              } catch (e) {
                return { fulfilled: !1, reason: e };
              }
            })
          );
        })(o);
      t.ports[0].postMessage({
        status: "done",
        eventId: n,
        eventType: r,
        response: a,
      });
    }
    _subscribe(e, t) {
      0 === Object.keys(this.handlersMap).length &&
        this.eventTarget.addEventListener("message", this.boundEventHandler),
        this.handlersMap[e] || (this.handlersMap[e] = new Set()),
        this.handlersMap[e].add(t);
    }
    _unsubscribe(e, t) {
      this.handlersMap[e] && t && this.handlersMap[e].delete(t),
        (t && 0 !== this.handlersMap[e].size) || delete this.handlersMap[e],
        0 === Object.keys(this.handlersMap).length &&
          this.eventTarget.removeEventListener(
            "message",
            this.boundEventHandler
          );
    }
  }
  function hf(e = "", t = 10) {
    let n = "";
    for (let e = 0; e < t; e++) n += Math.floor(10 * Math.random());
    return e + n;
  }
  cf.receivers = [];
  class uf {
    constructor(e) {
      (this.target = e), (this.handlers = new Set());
    }
    removeMessageHandler(e) {
      e.messageChannel &&
        (e.messageChannel.port1.removeEventListener("message", e.onMessage),
        e.messageChannel.port1.close()),
        this.handlers.delete(e);
    }
    async _send(e, t, n = 50) {
      const r =
        "undefined" != typeof MessageChannel ? new MessageChannel() : null;
      if (!r) throw new Error("connection_unavailable");
      let i, s;
      return new Promise((o, a) => {
        const c = hf("", 20);
        r.port1.start();
        const h = setTimeout(() => {
          a(new Error("unsupported_event"));
        }, n);
        (s = {
          messageChannel: r,
          onMessage(e) {
            const t = e;
            if (t.data.eventId === c)
              switch (t.data.status) {
                case "ack":
                  clearTimeout(h),
                    (i = setTimeout(() => {
                      a(new Error("timeout"));
                    }, 3e3));
                  break;
                case "done":
                  clearTimeout(i), o(t.data.response);
                  break;
                default:
                  clearTimeout(h),
                    clearTimeout(i),
                    a(new Error("invalid_response"));
              }
          },
        }),
          this.handlers.add(s),
          r.port1.addEventListener("message", s.onMessage),
          this.target.postMessage({ eventType: e, eventId: c, data: t }, [
            r.port2,
          ]);
      }).finally(() => {
        s && this.removeMessageHandler(s);
      });
    }
  }
  function lf() {
    return window;
  }
  function df() {
    return (
      void 0 !== lf().WorkerGlobalScope &&
      "function" == typeof lf().importScripts
    );
  }
  const ff = "firebaseLocalStorageDb",
    pf = "firebaseLocalStorage",
    gf = "fbase_key";
  class mf {
    constructor(e) {
      this.request = e;
    }
    toPromise() {
      return new Promise((e, t) => {
        this.request.addEventListener("success", () => {
          e(this.request.result);
        }),
          this.request.addEventListener("error", () => {
            t(this.request.error);
          });
      });
    }
  }
  function yf(e, t) {
    return e.transaction([pf], t ? "readwrite" : "readonly").objectStore(pf);
  }
  function vf() {
    const e = indexedDB.open(ff, 1);
    return new Promise((t, n) => {
      e.addEventListener("error", () => {
        n(e.error);
      }),
        e.addEventListener("upgradeneeded", () => {
          const t = e.result;
          try {
            t.createObjectStore(pf, { keyPath: gf });
          } catch (e) {
            n(e);
          }
        }),
        e.addEventListener("success", async () => {
          const n = e.result;
          n.objectStoreNames.contains(pf)
            ? t(n)
            : (n.close(),
              await (function () {
                const e = indexedDB.deleteDatabase(ff);
                return new mf(e).toPromise();
              })(),
              t(await vf()));
        });
    });
  }
  async function wf(e, t, n) {
    const r = yf(e, !0).put({ [gf]: t, value: n });
    return new mf(r).toPromise();
  }
  function _f(e, t) {
    const n = yf(e, !0).delete(t);
    return new mf(n).toPromise();
  }
  class Ef {
    constructor() {
      (this.type = "LOCAL"),
        (this._shouldAllowMigration = !0),
        (this.listeners = {}),
        (this.localCache = {}),
        (this.pollTimer = null),
        (this.pendingWrites = 0),
        (this.receiver = null),
        (this.sender = null),
        (this.serviceWorkerReceiverAvailable = !1),
        (this.activeServiceWorker = null),
        (this._workerInitializationPromise =
          this.initializeServiceWorkerMessaging().then(
            () => {},
            () => {}
          ));
    }
    async _openDb() {
      return this.db || (this.db = await vf()), this.db;
    }
    async _withRetries(e) {
      let t = 0;
      for (;;)
        try {
          const t = await this._openDb();
          return await e(t);
        } catch (e) {
          if (t++ > 3) throw e;
          this.db && (this.db.close(), (this.db = void 0));
        }
    }
    async initializeServiceWorkerMessaging() {
      return df() ? this.initializeReceiver() : this.initializeSender();
    }
    async initializeReceiver() {
      (this.receiver = cf._getInstance(df() ? self : null)),
        this.receiver._subscribe("keyChanged", async (e, t) => ({
          keyProcessed: (await this._poll()).includes(t.key),
        })),
        this.receiver._subscribe("ping", async (e, t) => ["keyChanged"]);
    }
    async initializeSender() {
      var e, t;
      if (
        ((this.activeServiceWorker = await (async function () {
          if (
            !(null === navigator || void 0 === navigator
              ? void 0
              : navigator.serviceWorker)
          )
            return null;
          try {
            return (await navigator.serviceWorker.ready).active;
          } catch (e) {
            return null;
          }
        })()),
        !this.activeServiceWorker)
      )
        return;
      this.sender = new uf(this.activeServiceWorker);
      const n = await this.sender._send("ping", {}, 800);
      n &&
        (null === (e = n[0]) || void 0 === e ? void 0 : e.fulfilled) &&
        (null === (t = n[0]) || void 0 === t
          ? void 0
          : t.value.includes("keyChanged")) &&
        (this.serviceWorkerReceiverAvailable = !0);
    }
    async notifyServiceWorker(e) {
      var t;
      if (
        this.sender &&
        this.activeServiceWorker &&
        ((null ===
          (t =
            null === navigator || void 0 === navigator
              ? void 0
              : navigator.serviceWorker) || void 0 === t
          ? void 0
          : t.controller) || null) === this.activeServiceWorker
      )
        try {
          await this.sender._send(
            "keyChanged",
            { key: e },
            this.serviceWorkerReceiverAvailable ? 800 : 50
          );
        } catch (t) {}
    }
    async _isAvailable() {
      try {
        if (!indexedDB) return !1;
        const e = await vf();
        return await wf(e, tf, "1"), await _f(e, tf), !0;
      } catch (e) {}
      return !1;
    }
    async _withPendingWrite(e) {
      this.pendingWrites++;
      try {
        await e();
      } finally {
        this.pendingWrites--;
      }
    }
    async _set(e, t) {
      return this._withPendingWrite(
        async () => (
          await this._withRetries((n) => wf(n, e, t)),
          (this.localCache[e] = t),
          this.notifyServiceWorker(e)
        )
      );
    }
    async _get(e) {
      const t = await this._withRetries((t) =>
        (async function (e, t) {
          const n = yf(e, !1).get(t),
            r = await new mf(n).toPromise();
          return void 0 === r ? null : r.value;
        })(t, e)
      );
      return (this.localCache[e] = t), t;
    }
    async _remove(e) {
      return this._withPendingWrite(
        async () => (
          await this._withRetries((t) => _f(t, e)),
          delete this.localCache[e],
          this.notifyServiceWorker(e)
        )
      );
    }
    async _poll() {
      const e = await this._withRetries((e) => {
        const t = yf(e, !1).getAll();
        return new mf(t).toPromise();
      });
      if (!e) return [];
      if (0 !== this.pendingWrites) return [];
      const t = [],
        n = new Set();
      for (const { fbase_key: r, value: i } of e)
        n.add(r),
          JSON.stringify(this.localCache[r]) !== JSON.stringify(i) &&
            (this.notifyListeners(r, i), t.push(r));
      for (const e of Object.keys(this.localCache))
        this.localCache[e] &&
          !n.has(e) &&
          (this.notifyListeners(e, null), t.push(e));
      return t;
    }
    notifyListeners(e, t) {
      this.localCache[e] = t;
      const n = this.listeners[e];
      if (n) for (const e of Array.from(n)) e(t);
    }
    startPolling() {
      this.stopPolling(),
        (this.pollTimer = setInterval(async () => this._poll(), 800));
    }
    stopPolling() {
      this.pollTimer &&
        (clearInterval(this.pollTimer), (this.pollTimer = null));
    }
    _addListener(e, t) {
      0 === Object.keys(this.listeners).length && this.startPolling(),
        this.listeners[e] || ((this.listeners[e] = new Set()), this._get(e)),
        this.listeners[e].add(t);
    }
    _removeListener(e, t) {
      this.listeners[e] &&
        (this.listeners[e].delete(t),
        0 === this.listeners[e].size && delete this.listeners[e]),
        0 === Object.keys(this.listeners).length && this.stopPolling();
    }
  }
  Ef.type = "LOCAL";
  const If = Ef;
  Nd("rcb"), new Ml(3e4, 6e4);
  class Tf {
    constructor(e) {
      (this.providerId = Tf.PROVIDER_ID), (this.auth = Cd(e));
    }
    verifyPhoneNumber(e, t) {
      return (async function (e, t, n) {
        var r;
        const i = await n.verify();
        try {
          let s;
          if (
            (Nl("string" == typeof i, e, "argument-error"),
            Nl("recaptcha" === n.type, e, "argument-error"),
            (s = "string" == typeof t ? { phoneNumber: t } : t),
            "session" in s)
          ) {
            const t = s.session;
            if ("phoneNumber" in s) {
              Nl("enroll" === t.type, e, "internal-error");
              const n = await (function (e, t) {
                return Bl(
                  e,
                  "POST",
                  "/v2/accounts/mfaEnrollment:start",
                  jl(e, t)
                );
              })(e, {
                idToken: t.credential,
                phoneEnrollmentInfo: {
                  phoneNumber: s.phoneNumber,
                  recaptchaToken: i,
                },
              });
              return n.phoneSessionInfo.sessionInfo;
            }
            {
              Nl("signin" === t.type, e, "internal-error");
              const n =
                (null === (r = s.multiFactorHint) || void 0 === r
                  ? void 0
                  : r.uid) || s.multiFactorUid;
              Nl(n, e, "missing-multi-factor-info");
              const o = await (function (e, t) {
                return Bl(e, "POST", "/v2/accounts/mfaSignIn:start", jl(e, t));
              })(e, {
                mfaPendingCredential: t.credential,
                mfaEnrollmentId: n,
                phoneSignInInfo: { recaptchaToken: i },
              });
              return o.phoneResponseInfo.sessionInfo;
            }
          }
          {
            const { sessionInfo: t } = await (async function (e, t) {
              return Bl(
                e,
                "POST",
                "/v1/accounts:sendVerificationCode",
                jl(e, t)
              );
            })(e, { phoneNumber: s.phoneNumber, recaptchaToken: i });
            return t;
          }
        } finally {
          n._reset();
        }
      })(this.auth, e, T(t));
    }
    static credential(e, t) {
      return qd._fromVerification(e, t);
    }
    static credentialFromResult(e) {
      const t = e;
      return Tf.credentialFromTaggedObject(t);
    }
    static credentialFromError(e) {
      return Tf.credentialFromTaggedObject(e.customData || {});
    }
    static credentialFromTaggedObject({ _tokenResponse: e }) {
      if (!e) return null;
      const { phoneNumber: t, temporaryProof: n } = e;
      return t && n ? qd._fromTokenResponse(t, n) : null;
    }
  }
  (Tf.PROVIDER_ID = "phone"), (Tf.PHONE_SIGN_IN_METHOD = "phone");
  class bf extends Md {
    constructor(e) {
      super("custom", "custom"), (this.params = e);
    }
    _getIdTokenResponse(e) {
      return Fd(e, this._buildIdpRequest());
    }
    _linkToIdToken(e, t) {
      return Fd(e, this._buildIdpRequest(t));
    }
    _getReauthenticationResolver(e) {
      return Fd(e, this._buildIdpRequest());
    }
    _buildIdpRequest(e) {
      const t = {
        requestUri: this.params.requestUri,
        sessionId: this.params.sessionId,
        postBody: this.params.postBody,
        tenantId: this.params.tenantId,
        pendingToken: this.params.pendingToken,
        returnSecureToken: !0,
        returnIdpCredential: !0,
      };
      return e && (t.idToken = e), t;
    }
  }
  function Sf(e) {
    return (async function (e, t, n = !1) {
      const r = "signIn",
        i = await ef(e, r, t),
        s = await Jd._fromIdTokenResponse(e, r, i);
      return n || (await e._updateCurrentUser(s.user)), s;
    })(e.auth, new bf(e), e.bypassAuthState);
  }
  function Cf(e) {
    const { auth: t, user: n } = e;
    return (
      Nl(n, t, "internal-error"),
      (async function (e, t, n = !1) {
        const { auth: r } = e,
          i = "reauthenticate";
        try {
          const s = await Zl(e, ef(r, i, t, e), n);
          Nl(s.idToken, r, "internal-error");
          const o = Yl(s.idToken);
          Nl(o, r, "internal-error");
          const { sub: a } = o;
          return Nl(e.uid === a, r, "user-mismatch"), Jd._forOperation(e, i, s);
        } catch (e) {
          throw (
            ("auth/user-not-found" === (null == e ? void 0 : e.code) &&
              Cl(r, "user-mismatch"),
            e)
          );
        }
      })(n, new bf(e), e.bypassAuthState)
    );
  }
  async function kf(e) {
    const { auth: t, user: n } = e;
    return (
      Nl(n, t, "internal-error"),
      (async function (e, t, n = !1) {
        const r = await Zl(
          e,
          t._linkToIdToken(e.auth, await e.getIdToken()),
          n
        );
        return Jd._forOperation(e, "link", r);
      })(n, new bf(e), e.bypassAuthState)
    );
  }
  class Af {
    constructor(e, t, n, r, i = !1) {
      (this.auth = e),
        (this.resolver = n),
        (this.user = r),
        (this.bypassAuthState = i),
        (this.pendingPromise = null),
        (this.eventManager = null),
        (this.filter = Array.isArray(t) ? t : [t]);
    }
    execute() {
      return new Promise(async (e, t) => {
        this.pendingPromise = { resolve: e, reject: t };
        try {
          (this.eventManager = await this.resolver._initialize(this.auth)),
            await this.onExecution(),
            this.eventManager.registerConsumer(this);
        } catch (e) {
          this.reject(e);
        }
      });
    }
    async onAuthEvent(e) {
      const {
        urlResponse: t,
        sessionId: n,
        postBody: r,
        tenantId: i,
        error: s,
        type: o,
      } = e;
      if (s) return void this.reject(s);
      const a = {
        auth: this.auth,
        requestUri: t,
        sessionId: n,
        tenantId: i || void 0,
        postBody: r || void 0,
        user: this.user,
        bypassAuthState: this.bypassAuthState,
      };
      try {
        this.resolve(await this.getIdpTask(o)(a));
      } catch (e) {
        this.reject(e);
      }
    }
    onError(e) {
      this.reject(e);
    }
    getIdpTask(e) {
      switch (e) {
        case "signInViaPopup":
        case "signInViaRedirect":
          return Sf;
        case "linkViaPopup":
        case "linkViaRedirect":
          return kf;
        case "reauthViaPopup":
        case "reauthViaRedirect":
          return Cf;
        default:
          Cl(this.auth, "internal-error");
      }
    }
    resolve(e) {
      Dl(this.pendingPromise, "Pending promise was never set"),
        this.pendingPromise.resolve(e),
        this.unregisterAndCleanUp();
    }
    reject(e) {
      Dl(this.pendingPromise, "Pending promise was never set"),
        this.pendingPromise.reject(e),
        this.unregisterAndCleanUp();
    }
    unregisterAndCleanUp() {
      this.eventManager && this.eventManager.unregisterConsumer(this),
        (this.pendingPromise = null),
        this.cleanUp();
    }
  }
  const Nf = new Ml(2e3, 1e4);
  class Rf extends Af {
    constructor(e, t, n, r, i) {
      super(e, t, r, i),
        (this.provider = n),
        (this.authWindow = null),
        (this.pollId = null),
        Rf.currentPopupAction && Rf.currentPopupAction.cancel(),
        (Rf.currentPopupAction = this);
    }
    async executeNotNull() {
      const e = await this.execute();
      return Nl(e, this.auth, "internal-error"), e;
    }
    async onExecution() {
      Dl(1 === this.filter.length, "Popup operations only handle one event");
      const e = hf();
      (this.authWindow = await this.resolver._openPopup(
        this.auth,
        this.provider,
        this.filter[0],
        e
      )),
        (this.authWindow.associatedEvent = e),
        this.resolver._originValidation(this.auth).catch((e) => {
          this.reject(e);
        }),
        this.resolver._isIframeWebStorageSupported(this.auth, (e) => {
          e || this.reject(kl(this.auth, "web-storage-unsupported"));
        }),
        this.pollUserCancellation();
    }
    get eventId() {
      var e;
      return (
        (null === (e = this.authWindow) || void 0 === e
          ? void 0
          : e.associatedEvent) || null
      );
    }
    cancel() {
      this.reject(kl(this.auth, "cancelled-popup-request"));
    }
    cleanUp() {
      this.authWindow && this.authWindow.close(),
        this.pollId && window.clearTimeout(this.pollId),
        (this.authWindow = null),
        (this.pollId = null),
        (Rf.currentPopupAction = null);
    }
    pollUserCancellation() {
      const e = () => {
        var t, n;
        (
          null ===
            (n =
              null === (t = this.authWindow) || void 0 === t
                ? void 0
                : t.window) || void 0 === n
            ? void 0
            : n.closed
        )
          ? (this.pollId = window.setTimeout(() => {
              (this.pollId = null),
                this.reject(kl(this.auth, "popup-closed-by-user"));
            }, 8e3))
          : (this.pollId = window.setTimeout(e, Nf.get()));
      };
      e();
    }
  }
  Rf.currentPopupAction = null;
  const Df = "pendingRedirect",
    Of = new Map();
  class Pf extends Af {
    constructor(e, t, n = !1) {
      super(
        e,
        [
          "signInViaRedirect",
          "linkViaRedirect",
          "reauthViaRedirect",
          "unknown",
        ],
        t,
        void 0,
        n
      ),
        (this.eventId = null);
    }
    async execute() {
      let e = Of.get(this.auth._key());
      if (!e) {
        try {
          const t = (await (async function (e, t) {
            const n = (function (e) {
                return ud(Df, e.config.apiKey, e.name);
              })(t),
              r = (function (e) {
                return ad(e._redirectPersistence);
              })(e);
            if (!(await r._isAvailable())) return !1;
            const i = "true" === (await r._get(n));
            return await r._remove(n), i;
          })(this.resolver, this.auth))
            ? await super.execute()
            : null;
          e = () => Promise.resolve(t);
        } catch (t) {
          e = () => Promise.reject(t);
        }
        Of.set(this.auth._key(), e);
      }
      return (
        this.bypassAuthState ||
          Of.set(this.auth._key(), () => Promise.resolve(null)),
        e()
      );
    }
    async onAuthEvent(e) {
      if ("signInViaRedirect" === e.type) return super.onAuthEvent(e);
      if ("unknown" !== e.type) {
        if (e.eventId) {
          const t = await this.auth._redirectUserForId(e.eventId);
          if (t) return (this.user = t), super.onAuthEvent(e);
          this.resolve(null);
        }
      } else this.resolve(null);
    }
    async onExecution() {}
    cleanUp() {}
  }
  function Lf(e, t) {
    Of.set(e._key(), t);
  }
  async function Mf(e, t, n = !1) {
    const r = Cd(e),
      i = (function (e, t) {
        return t
          ? ad(t)
          : (Nl(e._popupRedirectResolver, e, "argument-error"),
            e._popupRedirectResolver);
      })(r, t),
      s = new Pf(r, i, n),
      o = await s.execute();
    return (
      o &&
        !n &&
        (delete o.user._redirectEventId,
        await r._persistUserIfCurrent(o.user),
        await r._setRedirectUser(null, t)),
      o
    );
  }
  class xf {
    constructor(e) {
      (this.auth = e),
        (this.cachedEventUids = new Set()),
        (this.consumers = new Set()),
        (this.queuedRedirectEvent = null),
        (this.hasHandledPotentialRedirect = !1),
        (this.lastProcessedEventTime = Date.now());
    }
    registerConsumer(e) {
      this.consumers.add(e),
        this.queuedRedirectEvent &&
          this.isEventForConsumer(this.queuedRedirectEvent, e) &&
          (this.sendToConsumer(this.queuedRedirectEvent, e),
          this.saveEventToCache(this.queuedRedirectEvent),
          (this.queuedRedirectEvent = null));
    }
    unregisterConsumer(e) {
      this.consumers.delete(e);
    }
    onEvent(e) {
      if (this.hasEventBeenHandled(e)) return !1;
      let t = !1;
      return (
        this.consumers.forEach((n) => {
          this.isEventForConsumer(e, n) &&
            ((t = !0), this.sendToConsumer(e, n), this.saveEventToCache(e));
        }),
        this.hasHandledPotentialRedirect ||
          !(function (e) {
            switch (e.type) {
              case "signInViaRedirect":
              case "linkViaRedirect":
              case "reauthViaRedirect":
                return !0;
              case "unknown":
                return Vf(e);
              default:
                return !1;
            }
          })(e) ||
          ((this.hasHandledPotentialRedirect = !0),
          t || ((this.queuedRedirectEvent = e), (t = !0))),
        t
      );
    }
    sendToConsumer(e, t) {
      var n;
      if (e.error && !Vf(e)) {
        const r =
          (null === (n = e.error.code) || void 0 === n
            ? void 0
            : n.split("auth/")[1]) || "internal-error";
        t.onError(kl(this.auth, r));
      } else t.onAuthEvent(e);
    }
    isEventForConsumer(e, t) {
      const n = null === t.eventId || (!!e.eventId && e.eventId === t.eventId);
      return t.filter.includes(e.type) && n;
    }
    hasEventBeenHandled(e) {
      return (
        Date.now() - this.lastProcessedEventTime >= 6e5 &&
          this.cachedEventUids.clear(),
        this.cachedEventUids.has(Uf(e))
      );
    }
    saveEventToCache(e) {
      this.cachedEventUids.add(Uf(e)),
        (this.lastProcessedEventTime = Date.now());
    }
  }
  function Uf(e) {
    return [e.type, e.eventId, e.sessionId, e.tenantId]
      .filter((e) => e)
      .join("-");
  }
  function Vf({ type: e, error: t }) {
    return (
      "unknown" === e && "auth/no-auth-event" === (null == t ? void 0 : t.code)
    );
  }
  const Ff = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
    jf = /^https?/;
  function Bf(e) {
    const t = Ol(),
      { protocol: n, hostname: r } = new URL(t);
    if (e.startsWith("chrome-extension://")) {
      const i = new URL(e);
      return "" === i.hostname && "" === r
        ? "chrome-extension:" === n &&
            e.replace("chrome-extension://", "") ===
              t.replace("chrome-extension://", "")
        : "chrome-extension:" === n && i.hostname === r;
    }
    if (!jf.test(n)) return !1;
    if (Ff.test(e)) return r === e;
    const i = e.replace(/\./g, "\\.");
    return new RegExp("^(.+\\." + i + "|" + i + ")$", "i").test(r);
  }
  const qf = new Ml(3e4, 6e4);
  function $f() {
    const e = lf().___jsl;
    if (null == e ? void 0 : e.H)
      for (const t of Object.keys(e.H))
        if (
          ((e.H[t].r = e.H[t].r || []),
          (e.H[t].L = e.H[t].L || []),
          (e.H[t].r = [...e.H[t].L]),
          e.CP)
        )
          for (let t = 0; t < e.CP.length; t++) e.CP[t] = null;
  }
  let zf = null;
  function Hf(e) {
    return (
      (zf =
        zf ||
        (function (e) {
          return new Promise((t, n) => {
            var r, i, s;
            function o() {
              $f(),
                gapi.load("gapi.iframes", {
                  callback: () => {
                    t(gapi.iframes.getContext());
                  },
                  ontimeout: () => {
                    $f(), n(kl(e, "network-request-failed"));
                  },
                  timeout: qf.get(),
                });
            }
            if (
              null ===
                (i =
                  null === (r = lf().gapi) || void 0 === r
                    ? void 0
                    : r.iframes) || void 0 === i
                ? void 0
                : i.Iframe
            )
              t(gapi.iframes.getContext());
            else {
              if (
                !(null === (s = lf().gapi) || void 0 === s ? void 0 : s.load)
              ) {
                const t = Nd("iframefcb");
                return (
                  (lf()[t] = () => {
                    gapi.load ? o() : n(kl(e, "network-request-failed"));
                  }),
                  Ad(``).catch((e) => n(e))
                );
              }
              o();
            }
          }).catch((e) => {
            throw ((zf = null), e);
          });
        })(e)),
      zf
    );
  }
  const Kf = new Ml(5e3, 15e3),
    Gf = {
      style: {
        position: "absolute",
        top: "-100px",
        width: "1px",
        height: "1px",
      },
      "aria-hidden": "true",
      tabindex: "-1",
    },
    Wf = new Map([
      ["identitytoolkit.googleapis.com", "p"],
      ["staging-identitytoolkit.sandbox.googleapis.com", "s"],
      ["test-identitytoolkit.sandbox.googleapis.com", "t"],
    ]);
  function Qf(e) {
    const t = e.config;
    Nl(t.authDomain, e, "auth-domain-config-required");
    const n = t.emulator
        ? xl(t, "emulator/auth/iframe")
        : `https://${e.config.authDomain}/__/auth/iframe`,
      r = { apiKey: t.apiKey, appName: e.name, v: de },
      i = Wf.get(e.config.apiHost);
    i && (r.eid = i);
    const s = e._getFrameworks();
    return s.length && (r.fw = s.join(",")), `${n}?${v(r).slice(1)}`;
  }
  const Xf = {
    location: "yes",
    resizable: "yes",
    statusbar: "yes",
    toolbar: "no",
  };
  class Jf {
    constructor(e) {
      (this.window = e), (this.associatedEvent = null);
    }
    close() {
      if (this.window)
        try {
          this.window.close();
        } catch (e) {}
    }
  }
  const Yf = encodeURIComponent("fac");
  async function Zf(e, t, n, r, i, s) {
    Nl(e.config.authDomain, e, "auth-domain-config-required"),
      Nl(e.config.apiKey, e, "invalid-api-key");
    const o = {
      apiKey: e.config.apiKey,
      appName: e.name,
      authType: n,
      redirectUrl: r,
      v: de,
      eventId: i,
    };
    if (t instanceof Hd) {
      t.setDefaultLanguage(e.languageCode),
        (o.providerId = t.providerId || ""),
        (function (e) {
          for (const t in e)
            if (Object.prototype.hasOwnProperty.call(e, t)) return !1;
          return !0;
        })(t.getCustomParameters()) ||
          (o.customParameters = JSON.stringify(t.getCustomParameters()));
      for (const [e, t] of Object.entries(s || {})) o[e] = t;
    }
    if (t instanceof Kd) {
      const e = t.getScopes().filter((e) => "" !== e);
      e.length > 0 && (o.scopes = e.join(","));
    }
    e.tenantId && (o.tid = e.tenantId);
    const a = o;
    for (const e of Object.keys(a)) void 0 === a[e] && delete a[e];
    const c = await e._getAppCheckToken(),
      h = c ? `#${Yf}=${encodeURIComponent(c)}` : "";
    return `${(function ({ config: e }) {
      return e.emulator
        ? xl(e, "emulator/auth/handler")
        : `https://${e.authDomain}/__/auth/handler`;
    })(e)}?${v(a).slice(1)}${h}`;
  }
  const ep = "webStorageSupport",
    tp = class {
      constructor() {
        (this.eventManagers = {}),
          (this.iframes = {}),
          (this.originValidationPromises = {}),
          (this._redirectPersistence = af),
          (this._completeRedirectFn = Mf),
          (this._overrideRedirectResult = Lf);
      }
      async _openPopup(e, t, n, r) {
        var i;
        return (
          Dl(
            null === (i = this.eventManagers[e._key()]) || void 0 === i
              ? void 0
              : i.manager,
            "_initialize() not called before _openPopup()"
          ),
          (function (e, t, n, r = 500, i = 600) {
            const s = Math.max(
                (window.screen.availHeight - i) / 2,
                0
              ).toString(),
              o = Math.max((window.screen.availWidth - r) / 2, 0).toString();
            let a = "";
            const c = Object.assign(Object.assign({}, Xf), {
                width: r.toString(),
                height: i.toString(),
                top: s,
                left: o,
              }),
              h = d().toLowerCase();
            n && (a = gd(h) ? "_blank" : n),
              fd(h) && ((t = t || "http://localhost"), (c.scrollbars = "yes"));
            const u = Object.entries(c).reduce(
              (e, [t, n]) => `${e}${t}=${n},`,
              ""
            );
            if (
              (function (e = d()) {
                var t;
                return (
                  _d(e) &&
                  !!(null === (t = window.navigator) || void 0 === t
                    ? void 0
                    : t.standalone)
                );
              })(h) &&
              "_self" !== a
            )
              return (
                (function (e, t) {
                  const n = document.createElement("a");
                  (n.href = e), (n.target = t);
                  const r = document.createEvent("MouseEvent");
                  r.initMouseEvent(
                    "click",
                    !0,
                    !0,
                    window,
                    1,
                    0,
                    0,
                    0,
                    0,
                    !1,
                    !1,
                    !1,
                    !1,
                    1,
                    null
                  ),
                    n.dispatchEvent(r);
                })(t || "", a),
                new Jf(null)
              );
            const l = window.open(t || "", a, u);
            Nl(l, e, "popup-blocked");
            try {
              l.focus();
            } catch (e) {}
            return new Jf(l);
          })(e, await Zf(e, t, n, Ol(), r), hf())
        );
      }
      async _openRedirect(e, t, n, r) {
        return (
          await this._originValidation(e),
          (i = await Zf(e, t, n, Ol(), r)),
          (lf().location.href = i),
          new Promise(() => {})
        );
        var i;
      }
      _initialize(e) {
        const t = e._key();
        if (this.eventManagers[t]) {
          const { manager: e, promise: n } = this.eventManagers[t];
          return e
            ? Promise.resolve(e)
            : (Dl(n, "If manager is not set, promise should be"), n);
        }
        const n = this.initAndGetManager(e);
        return (
          (this.eventManagers[t] = { promise: n }),
          n.catch(() => {
            delete this.eventManagers[t];
          }),
          n
        );
      }
      async initAndGetManager(e) {
        const t = await (async function (e) {
            const t = await Hf(e),
              n = lf().gapi;
            return (
              Nl(n, e, "internal-error"),
              t.open(
                {
                  where: document.body,
                  url: Qf(e),
                  messageHandlersFilter: n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,
                  attributes: Gf,
                  dontclear: !0,
                },
                (t) =>
                  new Promise(async (n, r) => {
                    await t.restyle({ setHideOnLeave: !1 });
                    const i = kl(e, "network-request-failed"),
                      s = lf().setTimeout(() => {
                        r(i);
                      }, Kf.get());
                    function o() {
                      lf().clearTimeout(s), n(t);
                    }
                    t.ping(o).then(o, () => {
                      r(i);
                    });
                  })
              )
            );
          })(e),
          n = new xf(e);
        return (
          t.register(
            "authEvent",
            (t) => (
              Nl(null == t ? void 0 : t.authEvent, e, "invalid-auth-event"),
              { status: n.onEvent(t.authEvent) ? "ACK" : "ERROR" }
            ),
            gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER
          ),
          (this.eventManagers[e._key()] = { manager: n }),
          (this.iframes[e._key()] = t),
          n
        );
      }
      _isIframeWebStorageSupported(e, t) {
        this.iframes[e._key()].send(
          ep,
          { type: ep },
          (n) => {
            var r;
            const i =
              null === (r = null == n ? void 0 : n[0]) || void 0 === r
                ? void 0
                : r[ep];
            void 0 !== i && t(!!i), Cl(e, "internal-error");
          },
          gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER
        );
      }
      _originValidation(e) {
        const t = e._key();
        return (
          this.originValidationPromises[t] ||
            (this.originValidationPromises[t] = (async function (e) {
              if (e.config.emulator) return;
              const { authorizedDomains: t } = await (async function (
                e,
                t = {}
              ) {
                return Bl(e, "GET", "/v1/projects", t);
              })(e);
              for (const e of t)
                try {
                  if (Bf(e)) return;
                } catch (e) {}
              Cl(e, "unauthorized-domain");
            })(e)),
          this.originValidationPromises[t]
        );
      }
      get _shouldInitProactively() {
        return Ed() || pd() || _d();
      }
    };
  var np = "@firebase/auth",
    rp = "1.4.0";
  class ip {
    constructor(e) {
      (this.auth = e), (this.internalListeners = new Map());
    }
    getUid() {
      var e;
      return (
        this.assertAuthConfigured(),
        (null === (e = this.auth.currentUser) || void 0 === e
          ? void 0
          : e.uid) || null
      );
    }
    async getToken(e) {
      return (
        this.assertAuthConfigured(),
        await this.auth._initializationPromise,
        this.auth.currentUser
          ? { accessToken: await this.auth.currentUser.getIdToken(e) }
          : null
      );
    }
    addAuthTokenListener(e) {
      if ((this.assertAuthConfigured(), this.internalListeners.has(e))) return;
      const t = this.auth.onIdTokenChanged((t) => {
        e((null == t ? void 0 : t.stsTokenManager.accessToken) || null);
      });
      this.internalListeners.set(e, t), this.updateProactiveRefresh();
    }
    removeAuthTokenListener(e) {
      this.assertAuthConfigured();
      const t = this.internalListeners.get(e);
      t &&
        (this.internalListeners.delete(e), t(), this.updateProactiveRefresh());
    }
    assertAuthConfigured() {
      Nl(
        this.auth._initializationPromise,
        "dependent-sdk-initialized-before-auth"
      );
    }
    updateProactiveRefresh() {
      this.internalListeners.size > 0
        ? this.auth._startProactiveRefresh()
        : this.auth._stopProactiveRefresh();
    }
  }
  const sp = u("authIdTokenMaxAge") || 300;
  let op = null;
  var ap;
  (ap = "Browser"),
    ce(
      new b(
        "auth",
        (e, { options: t }) => {
          const n = e.getProvider("app").getImmediate(),
            r = e.getProvider("heartbeat"),
            i = e.getProvider("app-check-internal"),
            { apiKey: s, authDomain: o } = n.options;
          Nl(s && !s.includes(":"), "invalid-api-key", { appName: n.name });
          const a = {
              apiKey: s,
              authDomain: o,
              clientPlatform: ap,
              apiHost: "identitytoolkit.googleapis.com",
              tokenApiHost: "securetoken.googleapis.com",
              apiScheme: "https",
              sdkClientVersion: Id(ap),
            },
            c = new Sd(n, r, i, a);
          return (
            (function (e, t) {
              const n = (null == t ? void 0 : t.persistence) || [],
                r = (Array.isArray(n) ? n : [n]).map(ad);
              (null == t ? void 0 : t.errorMap) &&
                e._updateErrorMap(t.errorMap),
                e._initializeWithPersistence(
                  r,
                  null == t ? void 0 : t.popupRedirectResolver
                );
            })(c, t),
            c
          );
        },
        "PUBLIC"
      )
        .setInstantiationMode("EXPLICIT")
        .setInstanceCreatedCallback((e, t, n) => {
          e.getProvider("auth-internal").initialize();
        })
    ),
    ce(
      new b(
        "auth-internal",
        (e) => {
          return (t = Cd(e.getProvider("auth").getImmediate())), new ip(t);
          var t;
        },
        "PRIVATE"
      ).setInstantiationMode("EXPLICIT")
    ),
    ge(
      np,
      rp,
      (function (e) {
        switch (e) {
          case "Node":
            return "node";
          case "ReactNative":
            return "rn";
          case "Worker":
            return "webworker";
          case "Cordova":
            return "cordova";
          default:
            return;
        }
      })(ap)
    ),
    ge(np, rp, "esm2017");
  const cp = fe({
      apiKey: "AIzaSyCG0zGyABlsi6tH9YJrK24Iy1CEJN6NM-s",
      authDomain: "heist-supervisor.firebaseapp.com",
      projectId: "heist-supervisor",
      storageBucket: "heist-supervisor.appspot.com",
      messagingSenderId: "991582455386",
      appId: "1:991582455386:web:766451a21a8ca17cf73a63",
      measurementId: "G-GZ10GLQXX7",
    }),
    hp = (function (e, t) {
      const n = "string" == typeof e ? e : "(default)",
        r = he("object" == typeof e ? e : pe(), "firestore").getImmediate({
          identifier: n,
        });
      if (!r._initialized) {
        const e = c("firestore");
        e &&
          (function (e, t, n, r = {}) {
            var s;
            const o = (e = Uu(e, Fu))._getSettings(),
              a = `${t}:${n}`;
            if (
              ("firestore.googleapis.com" !== o.host &&
                o.host !== a &&
                es(
                  "Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."
                ),
              e._setSettings(
                Object.assign(Object.assign({}, o), { host: a, ssl: !1 })
              ),
              r.mockUserToken)
            ) {
              let t, n;
              if ("string" == typeof r.mockUserToken)
                (t = r.mockUserToken), (n = Wi.MOCK_USER);
              else {
                t = (function (e, t) {
                  if (e.uid)
                    throw new Error(
                      'The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.'
                    );
                  const n = t || "demo-project",
                    r = e.iat || 0,
                    s = e.sub || e.user_id;
                  if (!s)
                    throw new Error(
                      "mockUserToken must contain 'sub' or 'user_id' field!"
                    );
                  const o = Object.assign(
                    {
                      iss: `https://securetoken.google.com/${n}`,
                      aud: n,
                      iat: r,
                      exp: r + 3600,
                      auth_time: r,
                      sub: s,
                      user_id: s,
                      firebase: { sign_in_provider: "custom", identities: {} },
                    },
                    e
                  );
                  return [
                    i(JSON.stringify({ alg: "none", type: "JWT" })),
                    i(JSON.stringify(o)),
                    "",
                  ].join(".");
                })(
                  r.mockUserToken,
                  null === (s = e._app) || void 0 === s
                    ? void 0
                    : s.options.projectId
                );
                const o = r.mockUserToken.sub || r.mockUserToken.user_id;
                if (!o)
                  throw new os(
                    ss.INVALID_ARGUMENT,
                    "mockUserToken must contain 'sub' or 'user_id' field!"
                  );
                n = new Wi(o);
              }
              e._authCredentials = new us(new cs(t, n));
            }
          })(r, ...e);
      }
      return r;
    })(cp),
    up =
      ((function (e = pe()) {
        const t = he(e, "auth");
        if (t.isInitialized()) return t.getImmediate();
        const n = (function (e, t) {
            const n = he(e, "auth");
            if (n.isInitialized()) {
              const e = n.getImmediate();
              if (m(n.getOptions(), null != t ? t : {})) return e;
              Cl(e, "already-initialized");
            }
            return n.initialize({ options: t });
          })(e, { popupRedirectResolver: tp, persistence: [If, sf, af] }),
          r = u("authTokenSyncURL");
        if (r) {
          const e =
            ((i = r),
            async (e) => {
              const t = e && (await e.getIdTokenResult()),
                n =
                  t &&
                  (new Date().getTime() - Date.parse(t.issuedAtTime)) / 1e3;
              if (n && n > sp) return;
              const r = null == t ? void 0 : t.token;
              op !== r &&
                ((op = r),
                await fetch(i, {
                  method: r ? "POST" : "DELETE",
                  headers: r ? { Authorization: `Bearer ${r}` } : {},
                }));
            });
          !(function (e, t, n) {
            T(e).beforeAuthStateChanged(t, n);
          })(n, e, () => e(n.currentUser)),
            (function (t, n, r, i) {
              T(t).onIdTokenChanged((t) => e(t), void 0, void 0);
            })(n);
        }
        var i;
        const s = a("auth");
        s &&
          (function (e, t, n) {
            const r = Cd(e);
            Nl(r._canInitEmulator, r, "emulator-config-failed"),
              Nl(/^https?:\/\//.test(t), r, "invalid-emulator-scheme");
            const i = !!(null == n ? void 0 : n.disableWarnings),
              s = Pd(t),
              { host: o, port: a } = (function (e) {
                const t = Pd(e),
                  n = /(\/\/)?([^?#/]+)/.exec(e.substr(t.length));
                if (!n) return { host: "", port: null };
                const r = n[2].split("@").pop() || "",
                  i = /^(\[[^\]]+\])(:|$)/.exec(r);
                if (i) {
                  const e = i[1];
                  return { host: e, port: Ld(r.substr(e.length + 1)) };
                }
                {
                  const [e, t] = r.split(":");
                  return { host: e, port: Ld(t) };
                }
              })(t),
              c = null === a ? "" : `:${a}`;
            (r.config.emulator = { url: `${s}//${o}${c}/` }),
              (r.settings.appVerificationDisabledForTesting = !0),
              (r.emulatorConfig = Object.freeze({
                host: o,
                port: a,
                protocol: s.replace(":", ""),
                options: Object.freeze({ disableWarnings: i }),
              })),
              i ||
                (function () {
                  function e() {
                    const e = document.createElement("p"),
                      t = e.style;
                    (e.innerText =
                      "Running in emulator mode. Do not use with production credentials."),
                      (t.position = "fixed"),
                      (t.width = "100%"),
                      (t.backgroundColor = "#ffffff"),
                      (t.border = ".1em solid #000000"),
                      (t.color = "#b50000"),
                      (t.bottom = "0px"),
                      (t.left = "0px"),
                      (t.margin = "0px"),
                      (t.zIndex = "10000"),
                      (t.textAlign = "center"),
                      e.classList.add("firebase-emulator-warning"),
                      document.body.appendChild(e);
                  }
                  "undefined" != typeof console &&
                    "function" == typeof console.info &&
                    console.info(
                      "WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."
                    ),
                    "undefined" != typeof window &&
                      "undefined" != typeof document &&
                      ("loading" === document.readyState
                        ? window.addEventListener("DOMContentLoaded", e)
                        : e());
                })();
          })(n, `http://${s}`);
      })(),
      "type.googleapis.com/google.protobuf.Int64Value"),
    lp = "type.googleapis.com/google.protobuf.UInt64Value";
  function dp(e, t) {
    const n = {};
    for (const r in e) e.hasOwnProperty(r) && (n[r] = t(e[r]));
    return n;
  }
  function fp(e) {
    if (null == e) return null;
    if (
      (e instanceof Number && (e = e.valueOf()),
      "number" == typeof e && isFinite(e))
    )
      return e;
    if (!0 === e || !1 === e) return e;
    if ("[object String]" === Object.prototype.toString.call(e)) return e;
    if (e instanceof Date) return e.toISOString();
    if (Array.isArray(e)) return e.map((e) => fp(e));
    if ("function" == typeof e || "object" == typeof e)
      return dp(e, (e) => fp(e));
    throw new Error("Data cannot be encoded in JSON: " + e);
  }
  function pp(e) {
    if (null == e) return e;
    if (e["@type"])
      switch (e["@type"]) {
        case up:
        case lp: {
          const t = Number(e.value);
          if (isNaN(t))
            throw new Error("Data cannot be decoded from JSON: " + e);
          return t;
        }
        default:
          throw new Error("Data cannot be decoded from JSON: " + e);
      }
    return Array.isArray(e)
      ? e.map((e) => pp(e))
      : "function" == typeof e || "object" == typeof e
      ? dp(e, (e) => pp(e))
      : e;
  }
  const gp = "functions",
    mp = {
      OK: "ok",
      CANCELLED: "cancelled",
      UNKNOWN: "unknown",
      INVALID_ARGUMENT: "invalid-argument",
      DEADLINE_EXCEEDED: "deadline-exceeded",
      NOT_FOUND: "not-found",
      ALREADY_EXISTS: "already-exists",
      PERMISSION_DENIED: "permission-denied",
      UNAUTHENTICATED: "unauthenticated",
      RESOURCE_EXHAUSTED: "resource-exhausted",
      FAILED_PRECONDITION: "failed-precondition",
      ABORTED: "aborted",
      OUT_OF_RANGE: "out-of-range",
      UNIMPLEMENTED: "unimplemented",
      INTERNAL: "internal",
      UNAVAILABLE: "unavailable",
      DATA_LOSS: "data-loss",
    };
  class yp extends f {
    constructor(e, t, n) {
      super(`${gp}/${e}`, t || ""), (this.details = n);
    }
  }
  class vp {
    constructor(e, t, n) {
      (this.auth = null),
        (this.messaging = null),
        (this.appCheck = null),
        (this.auth = e.getImmediate({ optional: !0 })),
        (this.messaging = t.getImmediate({ optional: !0 })),
        this.auth ||
          e.get().then(
            (e) => (this.auth = e),
            () => {}
          ),
        this.messaging ||
          t.get().then(
            (e) => (this.messaging = e),
            () => {}
          ),
        this.appCheck ||
          n.get().then(
            (e) => (this.appCheck = e),
            () => {}
          );
    }
    async getAuthToken() {
      if (this.auth)
        try {
          const e = await this.auth.getToken();
          return null == e ? void 0 : e.accessToken;
        } catch (e) {
          return;
        }
    }
    async getMessagingToken() {
      if (
        this.messaging &&
        "Notification" in self &&
        "granted" === Notification.permission
      )
        try {
          return await this.messaging.getToken();
        } catch (e) {
          return;
        }
    }
    async getAppCheckToken(e) {
      if (this.appCheck) {
        const t = e
          ? await this.appCheck.getLimitedUseToken()
          : await this.appCheck.getToken();
        return t.error ? null : t.token;
      }
      return null;
    }
    async getContext(e) {
      return {
        authToken: await this.getAuthToken(),
        messagingToken: await this.getMessagingToken(),
        appCheckToken: await this.getAppCheckToken(e),
      };
    }
  }
  const wp = "us-central1";
  class _p {
    constructor(e, t, n, r, i = wp, s) {
      (this.app = e),
        (this.fetchImpl = s),
        (this.emulatorOrigin = null),
        (this.contextProvider = new vp(t, n, r)),
        (this.cancelAllRequests = new Promise((e) => {
          this.deleteService = () => Promise.resolve(e());
        }));
      try {
        const e = new URL(i);
        (this.customDomain = e.origin), (this.region = wp);
      } catch (e) {
        (this.customDomain = null), (this.region = i);
      }
    }
    _delete() {
      return this.deleteService();
    }
    _url(e) {
      const t = this.app.options.projectId;
      return null !== this.emulatorOrigin
        ? `${this.emulatorOrigin}/${t}/${this.region}/${e}`
        : null !== this.customDomain
        ? `${this.customDomain}/${e}`
        : `https://${this.region}-${t}.cloudfunctions.net/${e}`;
    }
  }
  async function Ep(e, t, n, r) {
    let i;
    n["Content-Type"] = "application/json";
    try {
      i = await r(e, { method: "POST", body: JSON.stringify(t), headers: n });
    } catch (e) {
      return { status: 0, json: null };
    }
    let s = null;
    try {
      s = await i.json();
    } catch (e) {}
    return { status: i.status, json: s };
  }
  const Ip = "@firebase/functions",
    Tp = "0.10.0";
  var bp;
  (bp = fetch.bind(self)),
    ce(
      new b(
        gp,
        (e, { instanceIdentifier: t }) => {
          const n = e.getProvider("app").getImmediate(),
            r = e.getProvider("auth-internal"),
            i = e.getProvider("messaging-internal"),
            s = e.getProvider("app-check-internal");
          return new _p(n, r, i, s, t, bp);
        },
        "PUBLIC"
      ).setMultipleInstances(!0)
    ),
    ge(Ip, Tp, void 0),
    ge(Ip, Tp, "esm2017");
  const Sp = (function (e = pe(), t = wp) {
    const n = he(T(e), gp).getImmediate({ identifier: t }),
      r = c("functions");
    return (
      r &&
        (function (e, t, n) {
          !(function (e, t, n) {
            e.emulatorOrigin = `http://${t}:${n}`;
          })(T(e), t, n);
        })(n, ...r),
      n
    );
  })(cp);
  let Cp;
  const kp =
    ("sendInvitation",
    (function (e, t, n) {
      return (r) =>
        (function (e, t, n, r) {
          const i = e._url(t);
          return (async function (e, t, n, r) {
            const i = { data: (n = fp(n)) },
              s = {},
              o = await e.contextProvider.getContext(
                r.limitedUseAppCheckTokens
              );
            o.authToken && (s.Authorization = "Bearer " + o.authToken),
              o.messagingToken &&
                (s["Firebase-Instance-ID-Token"] = o.messagingToken),
              null !== o.appCheckToken &&
                (s["X-Firebase-AppCheck"] = o.appCheckToken);
            const a = (function (e) {
                let t = null;
                return {
                  promise: new Promise((n, r) => {
                    t = setTimeout(() => {
                      r(new yp("deadline-exceeded", "deadline-exceeded"));
                    }, e);
                  }),
                  cancel: () => {
                    t && clearTimeout(t);
                  },
                };
              })(r.timeout || 7e4),
              c = await Promise.race([
                Ep(t, i, s, e.fetchImpl),
                a.promise,
                e.cancelAllRequests,
              ]);
            if ((a.cancel(), !c))
              throw new yp(
                "cancelled",
                "Firebase Functions instance was deleted."
              );
            const h = (function (e, t) {
              let n,
                r = (function (e) {
                  if (e >= 200 && e < 300) return "ok";
                  switch (e) {
                    case 0:
                    case 500:
                      return "internal";
                    case 400:
                      return "invalid-argument";
                    case 401:
                      return "unauthenticated";
                    case 403:
                      return "permission-denied";
                    case 404:
                      return "not-found";
                    case 409:
                      return "aborted";
                    case 429:
                      return "resource-exhausted";
                    case 499:
                      return "cancelled";
                    case 501:
                      return "unimplemented";
                    case 503:
                      return "unavailable";
                    case 504:
                      return "deadline-exceeded";
                  }
                  return "unknown";
                })(e),
                i = r;
              try {
                const e = t && t.error;
                if (e) {
                  const t = e.status;
                  if ("string" == typeof t) {
                    if (!mp[t]) return new yp("internal", "internal");
                    (r = mp[t]), (i = t);
                  }
                  const s = e.message;
                  "string" == typeof s && (i = s),
                    (n = e.details),
                    void 0 !== n && (n = pp(n));
                }
              } catch (e) {}
              return "ok" === r ? null : new yp(r, i, n);
            })(c.status, c.json);
            if (h) throw h;
            if (!c.json)
              throw new yp("internal", "Response is not valid JSON object.");
            let u = c.json.data;
            if ((void 0 === u && (u = c.json.result), void 0 === u))
              throw new yp("internal", "Response is missing data field.");
            return { data: pp(u) };
          })(e, i, n, r);
        })(e, t, r, n || {});
    })(T(Sp), "sendInvitation", undefined));
  function Ap(e, t, n = 5e3) {
    const r = document.createElement("div");
    (r.className = "notification"),
      "error" === e
        ? (r.innerHTML = `\n      \n        <img src="../app/assets/errorLogo.png" class="stateLogo"\n      \n      <p>${t}</p>\n      `)
        : "valide" === e &&
          (r.innerHTML = `\n      \n        <img src="../app/assets/validLogo.png" class="stateLogo"\n      \n      <p>${t}</p>\n      `);
    const i = document.getElementById("notifContent");
    i.appendChild(r),
      setTimeout(() => {
        r.classList.add("slideIn");
      }, 100),
      n > 0 &&
        setTimeout(() => {
          r.classList.remove("slideIn"),
            r.classList.add("slideOut"),
            r.addEventListener("transitionend", function e() {
              r.removeEventListener("transitionend", e), i.removeChild(r);
            });
        }, n);
  }
  chrome.runtime.onMessage.addListener(function (e, t, n) {
    "notification" === e.type &&
      ((Cp = e.adress),
      (async function () {
        const e = (function (e, t, ...n) {
          if (
            ((e = T(e)),
            (function (e, t, n) {
              if (!n)
                throw new os(
                  ss.INVALID_ARGUMENT,
                  `Function ${e}() cannot be called with an empty ${t}.`
                );
            })("collection", "path", t),
            e instanceof Fu)
          ) {
            const r = Ts.fromString(t, ...n);
            return Mu(r), new qu(e, null, r);
          }
          {
            if (!(e instanceof Bu || e instanceof qu))
              throw new os(
                ss.INVALID_ARGUMENT,
                "Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore"
              );
            const r = e._path.child(Ts.fromString(t, ...n));
            return Mu(r), new qu(e.firestore, null, r);
          }
        })(hp, "users");
        console.log("second"), console.log(Cp);
        const t = (function (e, t, ...n) {
            let r = [];
            t instanceof al && r.push(t),
              (r = r.concat(n)),
              (function (e) {
                const t = e.filter((e) => e instanceof ul).length,
                  n = e.filter((e) => e instanceof hl).length;
                if (t > 1 || (t > 0 && n > 0))
                  throw new os(
                    ss.INVALID_ARGUMENT,
                    "InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`."
                  );
              })(r);
            for (const t of r) e = t._apply(e);
            return e;
          })(
            e,
            (function (e, t, n) {
              const r = ol("where", "wallet");
              return hl._create(r, "==", n);
            })(0, 0, Cp)
          ),
          n = await (function (e) {
            e = Uu(e, ju);
            const t = Uu(e.firestore, zu),
              n = (function (e) {
                return (
                  e._firestoreClient || Hu(e),
                  e._firestoreClient.verifyNotTerminated(),
                  e._firestoreClient
                );
              })(t),
              r = new _l(t);
            return (
              (function (e) {
                if ("L" === e.limitType && 0 === e.explicitOrderBy.length)
                  throw new os(
                    ss.UNIMPLEMENTED,
                    "limitToLast() queries require specifying at least one orderBy() clause"
                  );
              })(e._query),
              Ou(n, e._query).then((n) => new vl(t, r, e, n))
            );
          })(t);
        0 === n.size
          ? (Ap("error", "Error : un-registered Adress.", 2500),
            setTimeout(() => {
              window.close();
            }, 3e3))
          : n.forEach((e) => {
              const t = e.data().uid,
                n = e.data().username;
              document.getElementById(
                "buttonList"
              ).innerHTML = `\n    <h2>Comfirm send invite to ${n}.</h2>\n    <button class="button" id="sendInvite">send invite</button>\n    `;
              const r = document.getElementById("sendInvite");
              r.addEventListener("click", () => {
                !(function (e) {
                  const t = e;
                  (t.style.backgroundColor = "#444444"),
                    (t.style.color = "#888888"),
                    (t.textContent = "Pending..."),
                    (t.className = "button99"),
                    (t.id = "bouton99");
                })(r),
                  (async function (e, t) {
                    const n = localStorage.getItem("username");
                    try {
                      return (
                        await kp({
                          message: Cp,
                          player1: n,
                          player2: e,
                          uid2: t,
                        })
                      ).data.status;
                    } catch (e) {
                      return void console.log(e);
                    }
                  })(n, t).then((e) => {
                    "sent" === e
                      ? (Ap("valide", "Invitation sent successfully.", 2500),
                        setTimeout(() => {
                          window.close();
                        }, 3e3))
                      : "already exist" === e
                      ? (Ap("error", "Error : Session already Exist.", 2500),
                        setTimeout(() => {
                          window.close();
                        }, 3e3))
                      : (Ap("error", "Server Error try later.", 2500),
                        setTimeout(() => {
                          window.close();
                        }, 3e3));
                  });
              });
            });
      })());
  }),
    chrome.runtime.onMessage.addListener(function (e, t, n) {
      "testMessage" === e.type && console.log("Test message received");
    });
})();