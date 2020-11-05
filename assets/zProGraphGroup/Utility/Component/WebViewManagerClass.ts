import pggUtility from "../pggUtility";

const {ccclass, property} = cc._decorator;

declare global {
    interface Window {
        webViewAndroidGameInterface: any;
        webkit: any;
        webView_ios_onFbLogin: any;
        webView_ios_onGoogleLogin: any;
        webView_ios_onClosePopup: any;
        webView_ios_onAddPopupUrl: any;
        webView_ios_onShareGame : any;
    }
}
window.webViewAndroidGameInterface = window.webViewAndroidGameInterface || {};
@ccclass
export default class WebViewManagerClass {
    fbAuthData: any;
    googleAuthData: any;

    constructor() {
        pggUtility.registerGlobalEvent("WEB_VIEW_ON_CLOSE_APP", this.closeApp, this);
        this.setWebViewGlobalEvents();
    }

    setWebViewGlobalEvents() {
        const self = this;

        if (this.getPlatform() === "android") {
            window.webViewAndroidGameInterface.onBackBtn = function () {
                console.log("[WebViewManagerClass] - [webView_android_onBackBtn] ");
                pggUtility.sendGlobalEvent(null, "WEB_VIEW_ON_BACK_BTN");
            };
        } else {

        }
    }

    isActive(): boolean {
        return !!pggUtility.queryParam("isWebView");
    }
    getPlatform(): string {
        return pggUtility.queryParam("platform");
    }

    fbLogin(onDone: (any) => void) {

        const self = this;

        if (this.getPlatform() === "android") {
            window.webViewAndroidGameInterface.onFbLogin = function (authData) {
                console.log("[WebViewManagerClass] - [webView_android_onFbLogin] onFunc - data: ", authData);
                self.fbAuthData = JSON.parse(authData);
                if (onDone)
                    onDone(self.fbAuthData);
            };
            console.log("[WebViewManagerClass] - [webView_android_fbLogin] - call");
            window.webViewAndroidGameInterface.fbLogin();
        } else {
            window.webView_ios_onFbLogin = function (authData) {
                console.log("[WebViewManagerClass] - [webView_ios_onFbLogin] - data: ", authData);
                self.fbAuthData = JSON.parse(authData);
                if (onDone)
                    onDone(self.fbAuthData);
            };
            console.log("[WebViewManagerClass] - [webView_ios_fbLogin] - call");
            window.webkit.messageHandlers.webView_ios_fbLogin.postMessage("");
        }

    }
    googleLogin(onDone: (any) => void) {
        const self = this;

        if (this.getPlatform() === "android") {
            window.webViewAndroidGameInterface.onGoogleLogin = function (authData) {
                console.log("[WebViewManagerClass] - [webView_android_onGoogleLogin] onFunc - data: ", authData);
                self.googleAuthData = JSON.parse(authData);
                if (onDone)
                    onDone(self.googleAuthData);
            };

            console.log("[WebViewManagerClass] - [webView_android_googleLogin] - call");
            window.webViewAndroidGameInterface.googleLogin();
        } else {
            window.webView_ios_onGoogleLogin = function (authData) {
                console.log("[WebViewManagerClass] - [webView_ios_onGoogleLogin] - data: ", authData);
                self.googleAuthData = JSON.parse(authData);
                if (onDone)
                    onDone(self.googleAuthData);
            };
            console.log("[WebViewManagerClass] - [webView_ios_googleLogin] - call");
            window.webkit.messageHandlers.webView_ios_googleLogin.postMessage("");
        }
    }
    closePopup(onDone: () => void) {
        const self = this;

        if (this.getPlatform() === "android") {
            window.webViewAndroidGameInterface.onClosePopup = function () {
                console.log("[WebViewManagerClass] - [webView_android_onClosePopup] onFunc - data: ",);
                if (onDone)
                    onDone();
            };

            console.log("[WebViewManagerClass] - [webView_android_closePopup] - call");
            window.webViewAndroidGameInterface.closePopup();
        } else {
            window.webView_ios_onClosePopup = function () {
                console.log("[WebViewManagerClass] - [webView_ios_onClosePopup] - ");
                if (onDone)
                    onDone();
            };
            console.log("[WebViewManagerClass] - [webView_ios_closePopup] - call");
            window.webkit.messageHandlers.webView_ios_closePopup.postMessage("");
        }
    }
    addPopupUrl(url: string, closeTimer: number, onDone: () => void) {
        const self = this;

        if (this.getPlatform() === "android") {
            window.webViewAndroidGameInterface.onAddPopupUrl = function () {
                console.log("[WebViewManagerClass] - [webView_android_onAddPopupUrl] onFunc");
                if (onDone)
                    onDone();
            };

            console.log("[WebViewManagerClass] - [webView_android_addPopupUrl] - call");
            window.webViewAndroidGameInterface.addPopupUrl(JSON.stringify({url: url, closeTimer: closeTimer}));
        } else {
            window.webView_ios_onAddPopupUrl = function () {
                console.log("[WebViewManagerClass] - [webView_ios_onAddPopupUrl]");
                if (onDone)
                    onDone();
            };
            console.log("[WebViewManagerClass] - [webView_ios_addPopupUrl] - call");
            window.webkit.messageHandlers.webView_ios_addPopupUrl.postMessage({url: url, closeTimer: closeTimer});
        }
    }
    sendAnalyticEvent(eventData) {
        const self = this;

        if (this.getPlatform() === "android") {
            if(window.webViewAndroidGameInterface.sendAnalyticEvent == null)
                return;
            console.log("[WebViewManagerClass] - [webView_android_sendAnalyticEvent] - call");
            window.webViewAndroidGameInterface.sendAnalyticEvent(JSON.stringify(eventData));
        } else {
            console.log("[WebViewManagerClass] - [webView_ios_sendAnalyticEvent] - call");
            if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.webView_ios_sendAnalyticEvent)
                window.webkit.messageHandlers.webView_ios_sendAnalyticEvent.postMessage(eventData);
        }
    }


    closeApp() {
        if (this.getPlatform() === "android") {
            console.log("[WebViewManagerClass] - [webView_android_closeApp] - call");
            window.webViewAndroidGameInterface.closeApp();
        }
    }

    shareGame(message: string, onDone: () => void) {
        const self = this;

        if (this.getPlatform() === "android") {
            window.webViewAndroidGameInterface.onShareGame = function () {
                console.log("[WebViewManagerClass] - [webView_android_onShareGame]");
                if (onDone)
                    onDone();
            };
            console.log("[WebViewManagerClass] - [webView_android_shareGame] - call message: ", message);
            window.webViewAndroidGameInterface.shareGame(message);
        } else {
            window.webView_ios_onShareGame = function () {
                console.log("[WebViewManagerClass] - [webView_ios_onShareGame] ");
                if (onDone)
                    onDone();
            };
            console.log("[WebViewManagerClass] - [webView_ios_shareGame] - call message: ", message);
            window.webkit.messageHandlers.webView_ios_shareGame.postMessage(message);
        }
    }

}
