import pggGlobalManager from "../../pggGlobalManager";
import {LoginPlatformType} from "./LoginManager";


const {ccclass, property} = cc._decorator;

@ccclass
export default class LoginUserPassController extends cc.Component {


    @property(cc.EditBox)
    txt_userName: cc.EditBox;
    @property(cc.EditBox)
    txt_password: cc.EditBox;
    @property(cc.EditBox)
    txt_passwordRepeat: cc.EditBox;
    @property(cc.Label)
    lbl_message: cc.Label;
    @property(cc.Node)
    rootPanelNode: cc.Node;
    @property(cc.Node)
    itemsNode: cc.Node;
    @property(cc.Node)
    loaderNode: cc.Node;

    showPanel_onDone: any = null;
    showPanel_onError: any = null;

    onLoad() {
        this.rootPanelNode.active = false;
    }

    showPanel(lastLoginData: any, onDone, OnError) {
        this.showPanel_onDone = onDone;
        this.showPanel_onError = OnError;
        if (lastLoginData != null) {
            this.signIn(null, lastLoginData.loginPlatformData.userName, atob(lastLoginData.loginPlatformData.password));
        } else {
            this.rootPanelNode.active = true;
            this.itemsNode.active = true;
            this.loaderNode.active = false;
        }
    }

    hidePanel() {
        this.rootPanelNode.active = false;
    }

    signIn(event?, userName?, password?) {
        const self = this;

        if (!userName)
            userName = this.txt_password.string;
        if (!password)
            password = this.txt_password.string;

        const validateMessage = this.validateData(userName, password);

        if (validateMessage === "ok") {
            const reqId = pggGlobalManager.serverManager.sendSingIn(
                LoginPlatformType.USER_PASS,
                {userName, password},
                function (params, packetRes) {
                    if (packetRes.reqIdClient === reqId) {
                        // console.log("params: ", params);
                        // console.log("packetRes: ", packetRes);
                        if (packetRes.data) {
                            self.lbl_message.string = "ورود موفقیت آمیز بود";
                            self.rootPanelNode.active = false;
                            if (self.showPanel_onDone)
                                self.showPanel_onDone({userName:userName , password :btoa(password) });
                        } else if (packetRes.error) {
                            if (self.showPanel_onError)
                                self.showPanel_onError(packetRes.error);
                            self.lbl_message.string = JSON.stringify(packetRes.error.message);
                        }
                    }
                }
                , this, {test2: "test2"});
        } else {
            this.lbl_message.string = validateMessage;
        }
    }

    signUp(event, userName, password, passwordRepeat) {
        const self = this;

        if (!userName)
            userName = this.txt_password.string;
        if (!password)
            password = this.txt_password.string;
        if (!passwordRepeat)
            passwordRepeat = this.txt_passwordRepeat.string;

        const validateMessage = this.validateData(userName, password, passwordRepeat);

        if (validateMessage === "ok") {
            const reqId = pggGlobalManager.serverManager.sendSingUp(
                LoginPlatformType.USER_PASS,
                {userName, password},
                function (params, packetRes) {
                    if (packetRes.reqIdClient === reqId) {
                        // console.log("params: ", params);
                        // console.log("packetRes: ", packetRes);
                        if (packetRes.data) {
                            self.signIn();
                        }
                    }
                }, this, {test1: "test1"});
        } else {
            this.lbl_message.string = validateMessage;
        }
    }

    singOut() {
        const reqId = pggGlobalManager.serverManager.sendSingOut(
            function (params, packetRes) {
                if (packetRes.reqIdClient === reqId) {
                    // console.log("params: ", params);
                    // console.log("packetRes: ", packetRes);
                }
            }, this, {test1: "test1"});
    }

    validateData(userName, password, passwordRepeat?) {
        if (passwordRepeat != null && password !== passwordRepeat)
            return "رمز ورود یکی نیست";
        return "ok";
    }

    onBack(){
        this.hidePanel();
        if(this.showPanel_onError)
            this.showPanel_onError();
    }
}
