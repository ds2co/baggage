import { container } from './container';

/**
 * Level 1 Caching
 * Singleton instance that gets wiped with page refresh. 
 */
export const CarryOn = 1;
/**
 * Level 2 Caching
 * Object instance gets stored in sessionStorage.
 * Data persists until the current tab/window is closed and
 *  only exists on that tab/window. 
 */
export const Checked = 2;
/**
 * Level 3 Caching
 * Object instance gets stored in localStorage.
 * Data persists until cleared by program. 
 */
export const Excessive = 3;

/**
 * Main class for the package. 
 * 
 * @class Baggage
 */
export class Handler {

    /**
     * Add class into containers registry.
     * 
     * @static
     * @param {T} clazz : The class func to add to the registry. 
     * @param {number} level : Cache level, defaulted to carryon.
     * @returns {void}
     * @memberOf Baggage
     */
    static Check(clazz, level = 1) {
        if (typeof clazz !== 'function' || (new clazz()) instanceof clazz === false) {
            throw new TypeError('Incorrect type. Must be a class function.');
        }

        const instance = new clazz();

        if (container.isNameTaken(instance.constructor.name)) {
            throw new Error('A class with this name has already been checked.');
        }

        if (isNaN(parseInt(level)) === true || [1, 2, 3].indexOf(level) < 0) {
            throw new TypeError('Level must be CarryOn, Checked, or Excessive.');
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
    static Claim() {
        let items = container.get();
        items.forEach(function (value, key) { exports[key] = undefined; });
        container.removeAll();
    }
}

/**
 * Dynamically export classes added to container registry.
 * @returns {void}
 */
function loadRegistry() {
    let r = container.get();
    r.forEach(function (value, key) { exports[key] = value; });
}

/**
 * Runs load registry to populate dynamic exports.
 */
loadRegistry();
