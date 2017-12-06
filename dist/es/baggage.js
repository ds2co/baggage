var classCallCheck = function(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = (function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

/**
 * Container class that creates the registry and
 * stores classes in the correct place.
 * @class Container
 */
var Container = (function() {
  /**
   * Creates an instance of Container.
   *
   * @memberOf Container
   */
  function Container() {
    classCallCheck(this, Container);

    this.registry = new Map();
  }

  /**
   * Returns contents of registry.
   *
   * @returns {Map} registry
   * @memberOf Container
   */

  createClass(Container, [
    {
      key: "get",
      value: function get$$1() {
        return this.registry;
      }
      /**
       *  Adds singleton class instance to registry.
       *
       * @param {T} instance : Class instance
       * @param {number} level : Cache level, defaulted to carryon(1).
       * @returns {void}
       * @memberOf Container
       */
    },
    {
      key: "register",
      value: function register(instance, level) {
        switch (level) {
          case 2:
          case 3:
            this.registerStorageObject(instance, level);
            break;
          case 1:
          default:
            this.registry.set(instance.constructor.name, instance);
            break;
        }
      }
      /**
       * Gets storage data (if necessary) and adds a proxy
       *  of the class instance to the registry.
       *
       * @param {T} i : Class instance.
       * @param {number} level : Cache level. (2, 3)
       * @returns {void}
       * @memberOf Container
       */
    },
    {
      key: "registerStorageObject",
      value: function registerStorageObject(i, level) {
        var _this = this;

        if ([2, 3].indexOf(level) < 0) {
          throw new Error("Cannot create storage for this object.");
        }

        var storageName = "bg-" + i.constructor.name;
        var extracted = {};

        if (localStorage.getItem(storageName)) {
          extracted = JSON.parse(localStorage.getItem(storageName));
        } else if (sessionStorage.getItem(storageName)) {
          extracted = JSON.parse(sessionStorage.getItem(storageName));
        }

        if (Object.keys(extracted).length > 0) {
          for (var key in extracted) {
            i[key] = extracted[key];
          }
        }

        var p =
          level === 2
            ? new Proxy(i, {
                get: function get$$1(target, name) {
                  return target[name];
                },
                set: function set$$1(obj, prop, value) {
                  obj[prop] = value;
                  _this.setStorage(i.constructor.name, JSON.stringify(p), 2);
                  return true;
                }
              })
            : new Proxy(i, {
                get: function get$$1(target, name) {
                  return target[name];
                },
                set: function set$$1(obj, prop, value) {
                  obj[prop] = value;
                  _this.setStorage(i.constructor.name, JSON.stringify(p), 3);
                  return true;
                }
              });

        this.setStorage(i.constructor.name, JSON.stringify(p), level);
        this.registry.set(i.constructor.name, p);
      }

      /**
       * Sets the class instance into proper browser storage.
       *
       * @param {string} key : Class name
       * @param {string} value : Json object of class properties
       * @param {level} level : Cache level. (2, 3)
       * @returns {void}
       * @memberOf Container
       */
    },
    {
      key: "setStorage",
      value: function setStorage(key, value, level) {
        var bgKey = "bg-" + key;
        try {
          switch (level) {
            case 2:
              sessionStorage.setItem(bgKey, value);
              break;
            case 3:
              localStorage.setItem(bgKey, value);
              break;
            default:
              throw "Not a storage object.";
          }
        } catch (e) {
          console.warn(
            "Browser storage is out of space. Added oject as carry on."
          );
          if (sessionStorage.getItem(bgKey)) {
            sessionStorage.removeItem(bgKey);
          } else if (localStorage.getItem(bgKey)) {
            localStorage.removeItem(bgKey);
          }
          this.register(key, value, 1);
        }
      }

      /**
       * Checks if a class has already been added.
       *
       * @param {string} name : Class name
       * @returns {boolean} Whether registry contains the name or not.
       * @memberOf Container
       */
    },
    {
      key: "isNameTaken",
      value: function isNameTaken(name) {
        return this.registry.has(name);
      }

      /**
       * Removes all values stored in storage.
       * Note: good for logout func
       * @returns {void}
       * @memberOf Container
       */
    },
    {
      key: "removeAll",
      value: function removeAll() {
        var n = 0;

        // Clear registry
        this.registry.clear();

        // Clear localStorage
        for (n = 0; n < localStorage.length; n++) {
          if (localStorage.key(n).substring(0, 3) === "bg-") {
            localStorage.removeItem(localStorage.key(n));
          }
        }

        // Clear sessionStorage
        for (n = 0; n < sessionStorage.length; n++) {
          if (sessionStorage.key(n).substring(0, 3) === "bg-") {
            sessionStorage.removeItem(sessionStorage.key(n));
          }
        }
      }
    }
  ]);
  return Container;
})();

/**
 * Exports a singleton instance of Container.
 */

var container = new Container();

/**
 * Level 1 Caching
 * Singleton instance that gets wiped with page refresh.
 */
var CarryOn = 1;
/**
 * Level 2 Caching
 * Object instance gets stored in sessionStorage.
 * Data persists until the current tab/window is closed and
 *  only exists on that tab/window.
 */
var Checked = 2;
/**
 * Level 3 Caching
 * Object instance gets stored in localStorage.
 * Data persists until cleared by program.
 */
var Excessive = 3;

/**
 * Main class for the package.
 *
 * @class Baggage
 */
var Handler = (function() {
  function Handler() {
    classCallCheck(this, Handler);
  }

  createClass(Handler, null, [
    {
      key: "Check",

      /**
       * Add class into containers registry.
       *
       * @static
       * @param {T} clazz : The class func to add to the registry.
       * @param {number} level : Cache level, defaulted to carryon.
       * @returns {void}
       * @memberOf Baggage
       */
      value: function Check(clazz) {
        var level =
          arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

        if (
          typeof clazz !== "function" ||
          new clazz() instanceof clazz === false
        ) {
          throw new TypeError("Incorrect type. Must be a class function.");
        }

        var instance = new clazz();

        if (container.isNameTaken(instance.constructor.name)) {
          throw new Error("A class with this name has already been checked.");
        }

        if (isNaN(parseInt(level)) === true || [1, 2, 3].indexOf(level) < 0) {
          throw new TypeError("Level must be CarryOn, Checked, or Excessive.");
        }

        container.register(instance, level);

        loadRegistry();
      }

      /**
       * Removes all baggage (aka all items in container registry)
       *
       * @static
       * @returns {void}
       * @memberOf Baggage
       */
    },
    {
      key: "Claim",
      value: function Claim() {
        var items = container.get();
        items.forEach(function(value, key) {
          exports[key] = undefined;
        });
        container.removeAll();
      }
    }
  ]);
  return Handler;
})();

/**
 * Dynamically export classes added to container registry.
 * @returns {void}
 */
function loadRegistry() {
  var r = container.get();
  r.forEach(function(value, key) {
    exports[key] = value;
  });
}

/**
 * Runs load registry to populate dynamic exports.
 */
loadRegistry();

export { CarryOn, Checked, Excessive, Handler };
