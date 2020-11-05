const {ccclass, property} = cc._decorator;

@ccclass
export default class CacheManager {

    public static caches: any = {};

    public static set(key: string, value: any, category: string = "default", forceUpdate: boolean = true, acceptNull: boolean = true): any {

        if (CacheManager.caches[category] == null)
            CacheManager.caches[category] = {};

        if (CacheManager.caches[category][key] == null || forceUpdate === true) {

            if (value == null && acceptNull === false) {
                console.log(`CacheManager|set|warn|value is null and not acceptNull|category: ${category} - key: ${key} - value: `, value);
                return CacheManager.caches[category][key];
            }

            CacheManager.caches[category][key] = value;

        }
        return CacheManager.caches[category][key];

    }

    public static get(key: string, category: string = "default", fromAllCat: boolean = false) {

        if (fromAllCat !== true) {

            if (CacheManager.caches[category] === undefined) {
                console.log(`CacheManager|get|error|not found category|category: ${category} - key: ${key}`);
                return undefined;
            }

            if (CacheManager.caches[category] === null) {
                console.log(`CacheManager|get|error|category not initialized yet. set before get|category: ${category} - key: ${key}`);
                return undefined;
            }

            if (CacheManager.caches[category][key] === undefined) {
                // console.log(`CacheManager|get|error|not found key|category: ${category} - key: ${key}`);
                return undefined;
            }


            // console.log(`CacheManager|get|ok|found key|category: ${category} - key: ${key}`);
            return CacheManager.caches[category][key];

        } else {
            // console.log(`CacheManager|get|ok|found all key|category: ${category} - key: ${key}`);
            return CacheManager.getKeyFromAllCats(key);
        }

    }

    public static clear(key: string, category: string = "default"): boolean {

        if (CacheManager.caches[category] === undefined) {
            console.log(`CacheManager|clear|error|not found category|category: ${category} - key: ${key}`);
            return false;
        }

        if (CacheManager.caches[category] === null) {
            console.log(`CacheManager|clear|error|category not initialized yet. set before clear|category: ${category} - key: ${key}`);
            return false;
        }

        if (CacheManager.caches[category][key] === undefined) {
            console.log(`CacheManager|clear|error|not found key|category: ${category} - key: ${key}`);
            return false;
        }

        if (key == null) {
            CacheManager.caches[category] = null;
        } else {
            CacheManager.caches[category][key] = null;
        }

        return true;

    }
    public static clearAll() {
        CacheManager.caches = {};
    }

    private static getKeyFromAllCats(key: string): any[] {
        const allCats = CacheManager.getAllCats();
        let allKeyValues = [];

        for (let i = 0; i < allCats.length; i++) {
            if (allCats[i][key] != null) {
                allKeyValues.push(allCats[i][key])
            }
        }
        return allKeyValues;
    }
    private static getAllCats(): any[] {
        const allCatNames = Object.getOwnPropertyNames(CacheManager.caches);
        let allCats = [];
        allCats.push(...allCatNames.map(function (catName) {
            return CacheManager.caches[catName];
        }));
        return allCats;
    }

}
