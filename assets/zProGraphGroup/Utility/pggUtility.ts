// @ts-ignore
import CacheManager from "../Services/Storages/Cache/CacheManager";

const {ccclass, property} = cc._decorator;


export const enum BaseNumber {
    BIN = 2,
    OCT = 8,
    DEC = 10,
    HEX = 16
}


@ccclass
// @ts-ignore
export default class pggUtility {


    public static registerGlobalEvent(eventName, callback, context) {
        // @ts-ignore
        cc.game.on(eventName, callback, context);
        // console.log(eventName + " event for " + context.name + " registered.");
    }
    public static removeGlobalEvent(eventName, callback, context) {
        // @ts-ignore
        cc.game.off(eventName, callback, context);
        console.log(eventName + " event for " + context.name + " removed.");
    }
    public static sendGlobalEvent(event, eventName, params = null) {
        // @ts-ignore
        cc.game.emit(eventName, params);
        console.log(eventName + " event was sent.");
    }

    public static checkHasScriptTag(scriptUrl: string): boolean {
        const ele = document.querySelector(`script[src*='${scriptUrl}']`);
        return ele != null;
    }
    public static addAndLoadScript(scriptUrl: string, onDone: () => void, onError: (error: any) => void): void {

        try {
            const script = document.createElement("script");
            script.type = "text/javascript";

            // @ts-ignore
            if (script.readyState) {  //IE
                // @ts-ignore
                script.onreadystatechange = function () {
                    // @ts-ignore
                    if (script.readyState === "loaded" ||
                        // @ts-ignore
                        script.readyState === "complete") {
                        // @ts-ignore
                        script.onreadystatechange = null;
                        if (onDone)
                            onDone();
                    } else {
                        if (onError)
                            onError("error on IE")
                    }
                };
            } else {  //Others
                script.onload = function () {
                    if (onDone)
                        onDone();
                };
                script.onerror = function (error) {
                    if (onError)
                        onError(error);
                };
            }

            script.src = scriptUrl;
            document.getElementsByTagName("head")[0].appendChild(script);

        } catch (e) {
            console.error("on addAndLoadScript exception: ", e);
            if (onError)
                onError("on addAndLoadScript exception");
        }

    }

    public static checkScript(path: string, onDone: () => void, onError: () => void): boolean {

        console.log("checkScript path: ", path);

        if (!pggUtility.checkHasScriptTag(path)) {

            pggUtility.addAndLoadScript(path, () => {
                if (onDone)
                    onDone();
                return true;
            }, function () {
                if (onError)
                    onError();
                return false;
            });
        } else {
            if (onDone)
                onDone();
            return true;
        }

    }

    public static makeBrowserFullScreen(node) {
        try {
            var requestFullScreen = function (element) {

                // Supports most browsers and their versions.
                var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen ||
                    element.mozRequestFullScreen || element.msRequestFullScreen;

                if (requestMethod) { // Native full screen.
                    requestMethod.call(element);
                    // @ts-ignore
                } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
                    // @ts-ignore
                    var wscript = new ActiveXObject("WScript.Shell");
                    if (wscript !== null) {
                        wscript.SendKeys("{F11}");
                    }
                }
            };
            var elem = window.document.body; // Make the body go full screen.
            requestFullScreen(elem);
        } catch (e) {
            console.error("on addAndLoadScript exception: ", e);
        }
    }


    public static generateUUID(perfix: string = null, postfix: string = null, sectionsCount: number = 3, sectionSplitter: string = "_", sectionsLength: number = 8, baseNumber: BaseNumber = BaseNumber.HEX, addTime: boolean = true) {

        let uuid = "";

        if (perfix)
            uuid += perfix;


        if (sectionSplitter == null)
            sectionSplitter = "";

        if (addTime) {

            if (perfix)
                uuid += sectionSplitter + Date.now();
            else
                uuid += Date.now();

        }

        for (let i = 0; i < sectionsCount; i++) {
            uuid += sectionSplitter + Math.floor((1 + Math.random()) * Math.pow(10, sectionsLength)).toString(baseNumber).substring(1);
        }

        if (postfix)
            uuid += sectionSplitter + postfix;


        return uuid;
    }


    // @ts-ignore
    public static replaceParent(targetObj: cc.Node, newParent: cc.Number) {

        // @ts-ignore
        let tempObjWM = cc.Vec3.ZERO;
        // @ts-ignore
        targetObj.getWorldPosition(tempObjWM);

        // @ts-ignore
        if (targetObj.parent != null) {
            // @ts-ignore
            targetObj.parent.removeChild(targetObj);
        }
        newParent.addChild(targetObj);

        // @ts-ignore
        let finalPos = cc.Vec3.ZERO;
        finalPos = targetObj.position.add(targetObj.convertToNodeSpaceAR(tempObjWM));
        targetObj.position = finalPos;

    }

    public static loadImage(imagePath, callback: (error, res) => void) {
        let _this = this;

        let fromCache = CacheManager.get(imagePath);
        if (fromCache != null) {
            if (callback)
                callback(null, fromCache);
            return;
        }

        try {
            if (imagePath.startsWith("http")) {
                // @ts-ignore
                cc.loader.load({url: imagePath, type: 'png'}, (error, res) => {
                    if (error) {
                        console.error("can not load image : ", imagePath);
                    } else {
                        CacheManager.set(imagePath, res);
                    }
                    if (callback)
                        callback(error, res);
                });
            } else {
                // @ts-ignore
                cc.loader.loadRes(imagePath, 'png', (error, res) => {
                    if (error) {
                        console.error("can not load image : ", imagePath);
                    } else {
                        CacheManager.set(imagePath, res);
                    }
                    if (callback)
                        callback(error, res);
                });
            }
        } catch (e) {
            console.error("on loadImage exception: ", e);
            if (callback)
                callback("on loadImage exception", null);
        }
    }
    public static loadAsset(assetPath, assetType, callback) {
        let _this = this;

        let fromCache = CacheManager.get(assetPath);
        if (fromCache != null) {
            if (callback)
                callback(null, fromCache);
            return;
        }

        try {
            if (!assetPath && assetPath === "") {
                if (callback)
                    callback("on loadAsset assetPath is null", null);
                return;
            }

            if (assetPath.startsWith("http")) {
                // @ts-ignore
                cc.loader.load({url: assetPath, type: assetType}, (error, res) => {
                    if (error) {
                        console.error("can not load asset : ", assetPath);
                    } else {
                        CacheManager.set(assetPath, res);
                    }
                    if (callback)
                        callback(error, res);
                });
            } else {
                // @ts-ignore
                cc.loader.loadRes(assetPath, assetType, (error, res) => {
                    if (error) {
                        console.error("can not load asset : ", assetPath);
                    } else {
                        CacheManager.set(assetPath, res);
                    }
                    if (callback)
                        callback(error, res);
                });
            }
        } catch (e) {
            console.error("on loadAsset exception: ", e);
            if (callback)
                callback("on loadAsset exception", null);
        }

    }
    public static loadImageAsBlob(imagePath, callback) {

        let fromCache = CacheManager.get(imagePath);
        if (fromCache != null) {
            if (callback)
                callback(null, fromCache);
            return;
        }

        try {
            fetch(imagePath)
                .then(function (response) {
                    return response.blob();
                })
                .then(function (myBlob) {
                    let newPath = URL.createObjectURL(myBlob);

                    // @ts-ignore
                    cc.loader.load({url: newPath, type: 'png'}, (error, res) => {
                        if (error) {
                            console.error("can not load ImageAsBlob : ", newPath);
                            if (callback)
                                callback(error, null);
                        } else {
                            CacheManager.set(imagePath, res);
                            if (callback)
                                callback(null, res);
                        }
                    });
                });
        } catch (e) {
            console.error("on loadImageAsBlob exception: ", e);
            if (callback)
                callback("on loadImageAsBlob exception", null);
        }

    }
    public static loadAssetAsBlob(assetPath, assetType, callback) {

        let fromCache = CacheManager.get(assetPath);
        if (fromCache != null) {
            if (callback)
                callback(null, fromCache);
            return;
        }

        try {

            fetch(assetPath)
                .then(function (response) {
                    return response.blob();
                })
                .then(function (myBlob) {
                    let newPath = URL.createObjectURL(myBlob);

                    // @ts-ignore
                    cc.loader.load({url: newPath, type: assetType}, (error, res) => {
                        if (error) {
                            console.error("can not load AssetAsBlob : ", newPath);
                        } else {
                            CacheManager.set(assetPath, res);
                            if (callback)
                                callback(null, res);
                        }
                    });

                });

        } catch (e) {
            console.error("on loadAssetAsBlob exception: ", e);
            if (callback)
                callback("on loadAssetAsBlob exception", null);
        }
    }

    // public static loadAssetAsync(assetPath, assetType) : Promise<any> {
    //     let _this = this;
    //
    //     Promise.
    //
    //     if (!assetPath && assetPath === "") {
    //         if (callback)
    //             callback("on loadAsset assetPath is null", null);
    //         return;
    //     }
    //
    //     if (assetPath.startsWith("http")) {
    //         // @ts-ignore
    //         cc.loader.load({url: assetPath, type: assetType}, (error, res) => {
    //             if(error)
    //             {
    //                 return new Promise(((resolve, reject) => ));
    //             }
    //         });
    //     } else {
    //         // @ts-ignore
    //         cc.loader.loadRes(assetPath, assetType, (error, res) => {
    //             if (callback)
    //                 callback(error, res);
    //         });
    //     }
    //
    // }


    public static queryParam(name): string {
        // let url = window.location.href;
        // name = name.replace(/[\[\]]/g, "\\$&");
        // var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        //     results = regex.exec(url);
        // if (!results) return null;
        // if (!results[2]) return '';
        // return decodeURIComponent(results[2].replace(/\+/g, " "));

        // name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        // var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        // var results = regex.exec(url);
        // return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));

        let url = new URL(window.location.href);
        let value = new URLSearchParams(url.search).get(name);
        if (value == null)
            return value;
        return value.split(' ').join('+');

    }
    public static getAllQueryParamsObject(): any {
        let url = new URL(window.location.href);
        let urlParams: any = new URLSearchParams(url.search);

        let queryObject: any = null;

        urlParams.forEach(function (value, key) {
            if (queryObject == null)
                queryObject = {};
            try {
                queryObject[key] = JSON.parse(value);
            } catch (e) {
                queryObject[key] = value;
            }
        });
        return queryObject;
    }


    // @ts-ignore
    public static getSpriteFrameFromAtlasByName(atlasTexture: cc.Texture2D, atlasData: any, spriteFrameName: string): cc.SpriteFrame {
        let texture = atlasData.frames[spriteFrameName];
        let rect = texture.textureRect.replace(/{|}/g, "").split(',');
        // @ts-ignore
        let spf = new cc.SpriteFrame(atlasTexture, new cc.Rect(parseFloat(rect[0]), parseFloat(rect[1]), parseFloat(rect[2]), parseFloat(rect[3])), texture.textureRotated);
        spf.name = spriteFrameName;
        return spf;
    }

    public static getFullFileNameFromUrl(url: string): string {
        return url.substring(url.lastIndexOf('/') + 1);
    }
    public static getFileNameFromUrl(url: string, haveFileExtension: boolean = false, haveQueryParams: boolean = false): string {

        let fullName = pggUtility.getFullFileNameFromUrl(url);

        if (haveFileExtension === true && haveQueryParams === true)
            return fullName;

        const justHaveExt = fullName.substring(0, fullName.indexOf("?"));
        const justName = justHaveExt.substring(0, justHaveExt.indexOf("."));
        const nameAndExt = justName + fullName.substring(fullName.indexOf("?"));

        if (haveFileExtension === true && haveQueryParams === false)
            return justHaveExt;

        if (haveFileExtension === false && haveQueryParams === true)
            return nameAndExt;

        if (haveFileExtension === false && haveQueryParams === false)
            return justName;

    }
    public static getFileExtensionFromUrl(url: string): string {
        return url.substring(url.lastIndexOf('.'));
    }

    public static getRandomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    public static getRandomFloat(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }
    // public static floatRoundDecimalDigit (number: number, maxDigitCount: number): number {
    //     return parseFloat((Math.round(number * 100) / 100)).toFixed(maxDigitCount);
    // }

    public static sortArray(arrayRef: any[], key: string, order = 0) {

        if (arrayRef == null)
            return;

        arrayRef.sort(function (a, b) {
            if (order == 0) {
                if (a[key] < b[key]) return -1;
                if (a[key] > b[key]) return 1;
            } else if (order == 1) {
                if (a[key] > b[key]) return -1;
                if (a[key] < b[key]) return 1;
            }
            return 0;
        });
    }
    public static sortArrayWithRef(arrayRef: any[], key: string, order = 0, ref: string) {

        if (arrayRef == null)
            return;


        arrayRef.sort(function (a, b) {

            let aRef = a[ref];
            let bRef = b[ref];

            if (order == 0) {
                if (aRef[key] < bRef[key]) return -1;
                if (aRef[key] > bRef[key]) return 1;
            } else if (order == 1) {
                if (aRef[key] > bRef[key]) return -1;
                if (aRef[key] < bRef[key]) return 1;
            }
            return 0;
        });
    }

    public static sortArrayByDate(arrayRef: any[], key: string, order = 0) {

        if (arrayRef == null)
            return;

        arrayRef.sort(function (a, b) {
            if (order == 0) {
                if (new Date(a[key]) < new Date(b[key])) return -1;
                if (new Date(a[key]) > new Date(b[key])) return 1;
            } else if (order == 1) {
                if (new Date(a[key]) > new Date(b[key])) return -1;
                if (new Date(a[key]) < new Date(b[key])) return 1;
            }
            return 0;
        });
    }


    public static difDate(date1: number, date2: number, NoNegative: boolean = true, NoDay: boolean = false): any {

        if (date1.toString().length < 13) {
            let countOfFor = 13 - date1.toString().length;
            for (let i = 0; i < countOfFor; i++) {
                date1 *= 10;
            }
        }

        if (date2.toString().length < 13) {
            let countOfFor = 13 - date2.toString().length;
            for (let i = 0; i < countOfFor; i++) {
                date2 *= 10;
            }
        }

        let res: any = {};

        res.seconds = Math.floor((date1 - (date2)) / 1000);
        res.minutes = Math.floor(res.seconds / 60);
        res.hours = Math.floor(res.minutes / 60);
        res.days = Math.floor(res.hours / 24);

        res.hours = res.hours - (res.days * 24);
        res.minutes = res.minutes - (res.days * 24 * 60) - (res.hours * 60);
        res.seconds = res.seconds - (res.days * 24 * 60 * 60) - (res.hours * 60 * 60) - (res.minutes * 60);

        if (NoNegative === false) {
            if (res.days < 0 || res.hours < 0 || res.minutes < 0 || res.seconds < 0) {
                res.days = 0;
                res.hours = 0;
                res.minutes = 0;
                res.seconds = 0;
            }
        }

        if (NoDay) {
            if (res.days > 0) {
                res.hours += res.days * 24;
                res.days = 0;
            }
        }

        return res;
    }


    // @ts-ignore
    public static findDeepOnNode(node: cc.Node, nodeName: string): cc.Node {

        if (node.name == nodeName) return node;
        for (var i = 0; i < node.children.length; i++) {
            var res = pggUtility.findDeepOnNode(node.children[i], nodeName);
            if (res) return res;
        }
    }

    // @ts-ignore
    public static findDeepOnScene(nodeName: string): cc.Node {

        // @ts-ignore
        let node = cc.director.getScene();
        if (node.name == nodeName) return node;
        for (var i = 0; i < node.children.length; i++) {
            var res = pggUtility.findDeepOnNode(node.children[i], nodeName);
            if (res) return res;
        }
    }

    public static addElementToEnum(enumObject: any, elementName: string, elementValue: number = -1) {

        let newEnum = {};

        if (elementValue == -1) {
            elementValue = enumObject.__enums__.length;
        }

        // remove all old name : value and value : name
        for (let i = 0; i < enumObject.__enums__.length; i++) {
            delete enumObject[enumObject.__enums__[i].name];
            delete enumObject[enumObject.__enums__[i].value];
        }

        // add all old value : name
        for (let i = 0; i < enumObject.__enums__.length; i++) {
            Object.defineProperty(enumObject, enumObject.__enums__[i].value, {
                "value": enumObject.__enums__[i].name,
                "writable": true,
                "enumerable": true,
                "configurable": true
            })
        }

        // add new value : name
        Object.defineProperty(enumObject, elementValue, {
            "value": elementName,
            "writable": true,
            "enumerable": true,
            "configurable": true
        });

        // add all old name : value
        for (let i = 0; i < enumObject.__enums__.length; i++) {
            Object.defineProperty(enumObject, enumObject.__enums__[i].name, {
                "value": enumObject.__enums__[i].value,
                "writable": true,
                "enumerable": true,
                "configurable": true
            })
        }

        // add new name : value
        Object.defineProperty(enumObject, elementName, {
            "value": elementValue,
            "writable": true,
            "enumerable": true,
            "configurable": true
        });


        // add new {name , value} to array
        enumObject.__enums__.push({name: elementName, value: elementValue});


        // sort array
        enumObject.__enums__.sort(function (a, b) {
            return a.value - b.value;
        });
    }


    public static executeFunctionByName(functionName: string, context: any /*, args */) {
        var args = Array.prototype.slice.call(arguments, 2);
        var namespaces = functionName.split(".");
        var func = namespaces.pop();
        for (var i = 0; i < namespaces.length; i++) {
            context = context[namespaces[i]];
        }
        return context[func].apply(context, args);
    }

    public static getOwnMethods(obj: any) {
        var props = Object.getOwnPropertyNames(obj.__proto__);
        return props.filter(function (prop) {
            return obj[prop] && obj[prop].constructor &&
                obj[prop].call && obj[prop].apply;
        });
    }

    public static trimString(str: string): string {
        return str.replace(/\s/g, '');
    }

    public static getArrayUniqueItems(array: any[], key: string): any[] {
        var newArray = [];
        var lookupObject = {};

        for (var i in array) {
            lookupObject[array[i][key]] = array[i];
        }

        for (i in lookupObject) {
            newArray.push(lookupObject[i]);
        }
        return newArray;
    }

    public static epochConvertToValid(inputNumber: number): number {
        let notices;
        let outputText = "";
        if ((inputNumber >= 100000000) && (inputNumber < 180000000)) {
            notices += '<br/>Expected a more recent date? You are missing 1 digit.';
            return inputNumber;
        }
        if ((inputNumber >= 100000000000000) || (inputNumber <= -100000000000000)) {
            outputText += '<b>Assuming that this timestamp is in microseconds (1/1,000,000 second):</b><br/>';
            inputNumber = Math.floor(inputNumber / 1000);
        } else if ((inputNumber >= 100000000000) || (inputNumber <= -100000000000)) {
            outputText += '<b>Assuming that this timestamp is in milliseconds:</b><br/>';
        } else {
            if (inputNumber > 10000000000) {
                notices += '<br>This conversion uses your timestamp in seconds.<br/>Remove the last 3 digits if you are trying to convert milliseconds.';
            }
            inputNumber = (inputNumber * 1000);
        }
        if (inputNumber < -6857222400000) {
            notices += '<br/>Dates before 14 september 1752 (pre-Gregorian calendar) are not accurate.';
            return inputNumber;
        }

        return inputNumber;
    }

    public static encryptString(str: string): string {
        return btoa(str);
    }
    public static decryptString(str: string): string {
        return atob(str);
    }

    public static copyToClipboard(str) {
        const el = document.createElement('textarea');
        el.value = str;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    };

    public static numberFormater(numb): string {
        try {
            let temp = parseInt(numb);
            if (temp.toString() !== "NaN")
                return temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            else
                return numb;
        } catch (e) {
            return numb;
        }
    }

    public static numberUnFormater(str): string {
        try {
            return str.replace(",", "");
        } catch (e) {
            return str;
        }
    }


    public static webAudioTouchUnlock(context) {
        return new Promise(function (resolve, reject) {
            // @ts-ignore
            if (!context || !(context instanceof (window.AudioContext || window.webkitAudioContext))) {
                reject('WebAudioTouchUnlock: You need to pass an instance of AudioContext to this method call');
                return;
            }
            if (context.state === 'suspended' && 'ontouchstart' in window) {
                var unlock_1 = function () {
                    context.resume().then(function () {
                        document.body.removeEventListener('touchstart', unlock_1);
                        document.body.removeEventListener('touchend', unlock_1);
                        resolve(true);
                    }, function (reason) {
                        reject(reason);
                    });
                };
                document.body.addEventListener('touchstart', unlock_1, false);
                document.body.addEventListener('touchend', unlock_1, false);
            } else {
                resolve(false);
            }
        });
    }
}
