import UserModel, {MutableDataModel} from "../../Models/UserModel";
import pggGlobalManager from "../../pggGlobalManager";
import {LoginPlatformType} from "./LoginManager";


const {ccclass, property} = cc._decorator;

export const enum UserType {
    PLAYER = "PLAYER",
    COACH = "COACH"
}


@ccclass
export default class UserManager  {

    public userData : UserModel = null;


    public saveMutableData(onDone:(res :{result:any,mutableData:MutableDataModel}) => void , onError:(any) => void ){
        const reqId = pggGlobalManager.serverManager.sendUpdateMutableData(
            this.userData.mutableData,
            function (params, packetRes) {
                if (packetRes.reqIdClient === reqId) {
                    if (packetRes.data) {
                        this.userData.mutableData = packetRes.data.mutableData
                        if (onDone)
                            onDone(packetRes.data);
                    } else if (packetRes.error) {
                        if (onError)
                            onError(packetRes.error);
                    }
                }
            }
            , this,null);
    }

}
