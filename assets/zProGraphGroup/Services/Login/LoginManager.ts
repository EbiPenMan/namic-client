import LoginUserPassController from "./LoginUserPassController";
import pggGlobalManager from "../../pggGlobalManager";
import {UserType} from "./UserManager";


const {ccclass, property} = cc._decorator;


export const enum LoginPlatformType {
    NONE = 0,
    USER_PASS = 1,
    GOOGLE = 2,
    PHONE = 3,
}


@ccclass
export default class LoginManager extends cc.Component {

    // @ts-ignore
    @property({type: cc.Enum(LoginPlatformType)})
    currentLoginPlatformType: LoginPlatformType = 0;

    @property(cc.Node)
    masterUiNode: cc.Node = null;

    @property(cc.Node)
    loaderMasterUi: cc.Node = null;

    @property(cc.Node)
    loginPlatformNode_UserPass: cc.Node = null;
    loginPlatformC_UserPass: LoginUserPassController = null;
    currentLoginPlatformC: any = null;

    init_onDone : any = null;

    currentUserType : UserType = UserType.PLAYER;

    onLoad() {
        pggGlobalManager.loginManager = this;
        this.loginPlatformC_UserPass = this.loginPlatformNode_UserPass.getComponent("LoginUserPassController");
    }

    init(onDone) {

        this.init_onDone = onDone;

        if (this.getCurrentLoginStorage() === LoginPlatformType.NONE) {
            this.showHideMasterPanel(true);
        } else {
            this.initLoginPlatform(this.getCurrentLoginStorage(), this.getLoginStorage(this.getCurrentLoginStorage()));
        }
    }

    showHideMasterPanel(state: boolean) {
        this.masterUiNode.active = state;
    }

    showHideLoader(state: boolean) {
        this.loaderMasterUi.active = state;
    }


    initLoginPlatform(loginPlatformType: LoginPlatformType, lastLoginData?: any) {

        const self = this;

        if (loginPlatformType === LoginPlatformType.USER_PASS) {
            this.currentLoginPlatformC = this.loginPlatformC_UserPass;
            this.loginPlatformC_UserPass.showPanel(lastLoginData,
                function (loginPlatformData: any) {
                    self.saveLoginStorage(loginPlatformType, loginPlatformData);
                    self.setCurrentLoginStorage(loginPlatformType);
                    self.call_onDone();
                }, function (error) {
                    if(error.codeStr === "ERROR_ALREADY_SING_IN"){
                        self.call_onDone();
                    }
                    else {
                        self.loginPlatformC_UserPass.hidePanel();
                        self.showHideLoader(false);
                        self.showHideMasterPanel(true);
                    }
                });
        }

    }

    call_onDone(){
        const self = this;
        self.showHideMasterPanel(false);
        self.showHideLoader(false);

        if(self.init_onDone)
            self.init_onDone();
    }

    loginWith(event: any, loginPlatformType: LoginPlatformType) {
        // @ts-ignore
        this.initLoginPlatform(LoginPlatformType[LoginPlatformType[loginPlatformType]]);
    }


    getCurrentLoginStorage(): LoginPlatformType {

        let lastLoginPlatformType: string = localStorage.getItem("loginData_lastLoginPlatformType");

        if (lastLoginPlatformType != null) {
            // @ts-ignore
            return LoginPlatformType[LoginPlatformType[lastLoginPlatformType]];
        }

        return LoginPlatformType.NONE;
    }

    setCurrentLoginStorage(loginPlatformType: LoginPlatformType) {
        localStorage.setItem("loginData_lastLoginPlatformType", loginPlatformType.toString());
    }

    saveLoginStorage(currentLoginPlatformType: LoginPlatformType, loginPlatformData: any) {
        localStorage.setItem("loginData_" + currentLoginPlatformType,
            JSON.stringify({
                loginPlatformType: currentLoginPlatformType,
                loginPlatformData: loginPlatformData
            })
        );
    }

    getLoginStorage(currentLoginPlatformType: LoginPlatformType): any {

        let loginData = localStorage.getItem("loginData_" + currentLoginPlatformType);
        if (loginData != null) {
            try {
                return JSON.parse(loginData);
            } catch (e) {
                console.warn("loginManager|getLoginStorage|catch on parsing data, exp: ", e);
                return null;
            }
        }
        return null;

    }


}
