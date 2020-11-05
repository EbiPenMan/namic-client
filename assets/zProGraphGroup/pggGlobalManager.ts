
const {ccclass} = cc._decorator;

// declare global {
//     interface Window {
//         ProGraphGroup: any;
//     }
// }
// window.ProGraphGroup = window.ProGraphGroup || {};

@ccclass
export default class pggGlobalManager {

    public static serverManager : any = null;
    public static loginManager : any = null;
    public static audioC : any = null;
    public static userC : any = null;

    // public static logger : any = null;
    // static getLogger(): any {
    //     if (pggGlobalManager.logger == null)
    //         pggGlobalManager.logger = window.ProGraphGroup.logger;
    //     return pggGlobalManager.logger;
    // }

}
