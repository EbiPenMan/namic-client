import pggGlobalManager from "../pggGlobalManager";
import {PK_TYPES_SEND, PK_TYPES_SERVER_SEND} from "../Server/PacketType";

const {ccclass, property} = cc._decorator;

@ccclass
export default class DcController extends cc.Component {

    @property(cc.Node)
    rootPanelNode: cc.Node = null;
    @property(cc.Node)
    itemsNode: cc.Node = null;
    @property(cc.Node)
    loaderNode: cc.Node = null;

    checkConnectionInterval: any = null;
    onDisconnectTimeout: any = null;

    callbackReqId_CONNECTION_CLOSED: string = null;
    callbackReqId_CONNECTION_ERROR: string = null;
    callbackReqId_CONNECTION_SUCCEED: string = null;

    onLoad() {
        const self = this;
        this.rootPanelNode.active = false;

        if (pggGlobalManager.serverManager == null) {
            console.warn("dcC|onLoad|call pggGlobalManager.serverManager == null , not set callback");
            return;
        }

      this.callbackReqId_CONNECTION_CLOSED = pggGlobalManager.serverManager.addCallback(PK_TYPES_SEND.CONNECTION_CLOSED,
            function () {
                self.onDisconnect();
            }, this);

        this.callbackReqId_CONNECTION_ERROR = pggGlobalManager.serverManager.addCallback(PK_TYPES_SEND.CONNECTION_ERROR,
            function () {
                self.onDisconnect();
            }, this);

        this.callbackReqId_CONNECTION_SUCCEED = pggGlobalManager.serverManager.addCallback(PK_TYPES_SERVER_SEND.CONNECTION_SUCCEED,
            function () {
                self.checkConnection();
            }, this);
    }

    checkConnection() {

        console.log("dcC|checkConnection");

        const self = this;
        this.checkConnectionInterval = setInterval(function () {
            if (pggGlobalManager.serverManager.isConnected === false && pggGlobalManager.serverManager.isConnecting === false && self.rootPanelNode.active === false) {
                console.log("dcC|checkConnection|call reconnect isConnected === false");
                self.reconnect();
            } else if (pggGlobalManager.serverManager.isConnected === true && self.rootPanelNode.active === true) {
                self.rootPanelNode.active = false;
            }
        }, 3000)
    }

    reconnect() {
        this.rootPanelNode.active = true;
        this.itemsNode.active = false;
        this.loaderNode.active = true;

        pggGlobalManager.serverManager.connect();
        // GameData.loginC.showPanel(function () {
        //     this.rootPanelNode.active = false;
        // });
    }

    onDisconnect() {
        console.log("dcC|onDisconnect");
        const self = this;
        this.rootPanelNode.active = true;
        this.itemsNode.active = true;
        this.loaderNode.active = false;
        this.onDisconnectTimeout = setTimeout(function () {
            console.log("dcC|onDisconnect|setTimeout");
            if (pggGlobalManager.serverManager.isConnected === false && pggGlobalManager.serverManager.isConnecting === false && self.rootPanelNode.active === false)
                self.onDisconnect();
            else if(self.onDisconnectTimeout)
                clearTimeout(self.onDisconnectTimeout);
        }, 1000);
    }

    onDestroy() {
        if (this.checkConnectionInterval)
            clearInterval(this.checkConnectionInterval);
        if (this.onDisconnectTimeout)
            clearInterval(this.onDisconnectTimeout);

        pggGlobalManager.serverManager.removeCallbackByReqId(this.callbackReqId_CONNECTION_CLOSED);
        pggGlobalManager.serverManager.removeCallbackByReqId(this.callbackReqId_CONNECTION_ERROR);
        pggGlobalManager.serverManager.removeCallbackByReqId(this.callbackReqId_CONNECTION_SUCCEED);
    }

}
