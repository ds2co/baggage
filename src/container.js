/**
 * Container class that creates the registry and 
 * stores classes in the correct place.  
 * @class Container
 */
class Container {

    /**
     * Creates an instance of Container.
     * 
     * @memberOf Container
     */
    constructor() {
        this.registry = new Map();
    }

    /**
     * Returns contents of registry. 
     * 
     * @returns {Map} registry
     * @memberOf Container
     */
    get() { 
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
    register(instance, level) {
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
    registerStorageObject(i, level) {
        if ([2, 3].indexOf(level) < 0) {
            throw new Error("Cannot create storage for this object.");
        }

        let storageName = 'bg-' + i.constructor.name;
        let extracted = {};

        if (localStorage.getItem(storageName)) {
            extracted = JSON.parse(localStorage.getItem(storageName));
        } else if (sessionStorage.getItem(storageName)) {
            extracted = JSON.parse(sessionStorage.getItem(storageName));
        }

        if (Object.keys(extracted).length > 0) {
            for (let key in extracted) {
                i[key] = extracted[key];
            }
        }

        let p = (level === 2) ?
            new Proxy(i, {
                get: (target, name) => {
                    return target[name];
                },
                set: (obj, prop, value) => {
                    obj[prop] = value;
                    this.setStorage(i.constructor.name, JSON.stringify(p), 2);
                    return true;
                }
            })
            :
            new Proxy(i, {
                get: (target, name) => {
                    return target[name];
                },
                set: (obj, prop, value) => {
                    obj[prop] = value;
                    this.setStorage(i.constructor.name, JSON.stringify(p), 3);
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
    setStorage(key, value, level) {
        let bgKey = 'bg-' + key;
        try {
            switch (level) {
                case 2:
                    sessionStorage.setItem(bgKey, value);
                    break;
                case 3:
                    localStorage.setItem(bgKey, value);
                    break;
                default:
                    throw 'Not a storage object.';
            }
        } catch (e) {
            console.warn('Browser storage is out of space. Added oject as carry on.');
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
    isNameTaken(name) {
        return this.registry.has(name);
    }

    /**
     * Removes all values stored in storage.
     * Note: good for logout func
     * @returns {void}
     * @memberOf Container
     */
    removeAll() {
        let n = 0;

        // Clear registry 
        this.registry.clear();

        // Clear localStorage
        for (n = 0; n < localStorage.length; n++) {
            if (localStorage.key(n).substring(0, 3) === 'bg-') {
                localStorage.removeItem(localStorage.key(n));
            }
        }

        // Clear sessionStorage
        for (n = 0; n < sessionStorage.length; n++) {
            if (sessionStorage.key(n).substring(0, 3) === 'bg-') {
                sessionStorage.removeItem(sessionStorage.key(n));
            }
        }
    }
}

/**
 * Exports a singleton instance of Container. 
 */
export const container = new Container();