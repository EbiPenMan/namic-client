import UserManager from "./Services/Login/UserManager";
import LoginManager from "./Services/Login/LoginManager";
import ServerManager from "./Server/ServerManager";
import GameManager from "../script/GameManager";

const {ccclass} = cc._decorator;

// declare global {
//     interface Window {
//         ProGraphGroup: any;
//     }
// }
// window.ProGraphGroup = window.ProGraphGroup || {};

@ccclass
export default class pggGlobalManager {

    public static serverManager: ServerManager = null;
    public static gameManager: GameManager = null;
    public static loginManager: LoginManager = null;
    public static audioC: any = null;
    public static userC: any = null;
    public static multilanguageManager: any = null;
    public static userManager: UserManager = null;
    public static getUserManager(): UserManager {
        if (pggGlobalManager.userManager == null)
            pggGlobalManager.userManager = new UserManager();
        return pggGlobalManager.userManager;
    }

    public static dataFromServer: any = null;
    public static serverConfigs: any = null;
    public static clientConfigs: any = null;


}
