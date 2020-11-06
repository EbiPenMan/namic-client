import pggGlobalManager from "../zProGraphGroup/pggGlobalManager";
import {PK_TYPES_SERVER_SEND} from "../zProGraphGroup/Server/PacketType";
import SceneLoaderProgress from "./SceneLoaderProgress";


const {ccclass, property} = cc._decorator;

@ccclass
export default class LoaderManager extends cc.Component {

    @property(cc.Node)
    sceneLoaderProgressNode: cc.Node = null;
    sceneLoaderProgressC: SceneLoaderProgress = null;

    onLoad() {

        const self = this;

        this.sceneLoaderProgressC = this.sceneLoaderProgressNode.children[0].getComponent("SceneLoaderProgress");
        this.sceneLoaderProgressC.loadSceneAfterPreLoad(false);
        this.sceneLoaderProgressC.loadScene("Menu");

        pggGlobalManager.serverManager.connect(function () {
            pggGlobalManager.loginManager.init(function () {
                self.sceneLoaderProgressC.loadSceneAfterPreLoad(true);
            });
        }, null, this);
        pggGlobalManager.serverManager.addCallback(PK_TYPES_SERVER_SEND.CONNECTION_SUCCEED,
            function () {
                pggGlobalManager.loginManager.init(function () {
                    self.sceneLoaderProgressC.loadSceneAfterPreLoad(true);
                });
            });
    }
}
