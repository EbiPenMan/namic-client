import pggGlobalManager from "../zProGraphGroup/pggGlobalManager";
import {PK_TYPES_SERVER_SEND} from "../zProGraphGroup/Server/PacketType";


const {ccclass, property} = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {


    onLoad () {

        pggGlobalManager.serverManager.connect(
            function () {
                pggGlobalManager.loginManager.init();
        },null,this);

        pggGlobalManager.serverManager.addCallback(PK_TYPES_SERVER_SEND.CONNECTION_SUCCEED,
            function () {
                pggGlobalManager.loginManager.init()
            });
    }


}
