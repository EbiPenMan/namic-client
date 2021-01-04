import pggGlobalManager from "../pggGlobalManager";
import ServerManager from "./ServerManager";

const {ccclass, property} = cc._decorator;


export const enum ServerProtocolEnum {
    WEBSOCKET = 0,
    HTTP = 1,
    TCP = 2,
    UDP = 3,
    GRPC = 4,
}

@ccclass('ServerComponentFields')
// @ts-ignore
export class ServerComponentFields {

    // @ts-ignore
    @property({type: cc.Enum(ServerProtocolEnum)})
    serverProtocol: ServerProtocolEnum = 0;
    @property()
    isSsl: boolean = false;
    @property()
    serverPort: string = "8080";
    @property()
    serverBaseUrl: string = "localhost";
    @property()
    serverEndPointUrl: string = "/ws";
}

@ccclass
export default class ServerComponent extends cc.Component {

    @property({type: ServerComponentFields})
    serverComponentFields: ServerComponentFields = new ServerComponentFields();


    onLoad() {
        if (pggGlobalManager.serverManager == null) {
            pggGlobalManager.serverManager = new ServerManager();
            pggGlobalManager.serverManager.init(this.serverComponentFields);
        } else if (pggGlobalManager.serverManager.fields == null) {
            pggGlobalManager.serverManager.init(this.serverComponentFields);
        }
    }

}
