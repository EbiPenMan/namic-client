import {ServerComponentFields, ServerProtocolEnum} from "./ServerComponent";
import {PK_TYPES_SEND} from "./PacketType";
import pggUtility from "../Utility/pggUtility";
import Packet from "./Packet";
import {LoginPlatformType} from "../Services/Login/LoginManager";
import pggGlobalManager from "../pggGlobalManager";
import {MutableDataModel} from "../Models/UserModel";

const {ccclass, property} = cc._decorator;


@ccclass("ServerManager")
export default class ServerManager {

    public fields: ServerComponentFields = null;
    private socket: WebSocket = null;
    public isConnected: boolean = false;
    public isConnecting: boolean = false;
    private callbacks: any[] = [];

    public static instance = null;

    init(fields: ServerComponentFields) {
        this.fields = fields;
    }

    connect(onAllReadyConnected?, onOpen?, context?, params?) {
        if (this.socket != null && this.isConnected) {
            if (onAllReadyConnected != null && context != null)
                onAllReadyConnected.call(context, params);
            return;
        }

        console.log("server|connect|connecting...");

        try {

            this.socket = new WebSocket(this.getConnectUrl());
            this.socket.binaryType = "arraybuffer";

            this.setSocketCallbacks(onOpen, context, params);

            this.isConnected = false;
            this.isConnecting = true;

        } catch (e) {
            this.isConnecting = false;
            console.error("server|connect|catch exp: ", e);
        }
    }

    getConnectUrl(): string {
        return this.getServerProtocolString(this.fields.serverProtocol, this.fields.isSsl) +
            "://" +
            this.fields.serverBaseUrl + ":" + this.fields.serverPort + this.fields.serverEndPointUrl;
    }

    getServerProtocolString(serverProtocolEnum: ServerProtocolEnum, isSsl: boolean): string {
        if (serverProtocolEnum === ServerProtocolEnum.WEBSOCKET) {
            return isSsl ? "wss" : "ws";
        }
        return isSsl ? "https" : "http";
    }


    setSocketCallbacks(onOpen, context, params) {
        if (!this.socket) {
            return;
        }

        let self = this;

        this.socket.onopen = function (event) {

            self.isConnected = true;
            self.isConnecting = false;

            if (onOpen != null && context != null)
                onOpen.call(context, params);

            console.log("server|setSocketCallbacks|onopen");
        };

        this.socket.onmessage = function (event) {

            let data = null;
            let packet = null;

            if (event.data instanceof ArrayBuffer) {
                data = atob(new TextDecoder('utf8').decode(event.data));
            } else {
                data = event.data;
            }

            try {
                packet = JSON.parse(data);
            } catch (ex) {
                console.warn("server|setSocketCallbacks|onmessage|catch on parsing data, exp: ", ex);
            }

            // console.log("server|setSocketCallbacks|onmessage|packet: ", packet);
            self.handlePackets(packet);

        };

        this.socket.onclose = function (event) {
            let error = {code: event.code, message: event.reason};
            console.log("server|setSocketCallbacks|onclose|event: ", error);

            self.socket = null;
            self.isConnected = false;
            self.isConnecting = false;

            self.callCallback(PK_TYPES_SEND.CONNECTION_CLOSED, null);

        };

        this.socket.onerror = function (data) {
            self.socket = null;
            self.isConnected = false;
            self.isConnecting = false;
            self.callCallback(PK_TYPES_SEND.CONNECTION_ERROR, null);
            console.error("server|setSocketCallbacks|onerror|error: ", data);
        };
    }

    handlePackets(packet) {

        // @ts-ignore
        new window.ProGraphGroup.logger
            .LogT("Server Manager", "#00a80f", (packet.error != null ? "#ff110050" : "#ffffff"))
            // @ts-ignore
            .setTitle("Get  Packet " + (packet.type != null ? "| " + packet.type : "") +
                (packet.error != null ? " | " + "ERROR - " + packet.error.codeStr : " | OK"))
            .group(true).setParam(packet)
            .show();
        this.callCallback(packet.type, packet);
    }

    //endregion

    //region Send

    sendData(packet) {
        if (this.socket == null) {
            console.error("server|sendData|socket == null");
            return;
        }

        this.socket.send(this.stringToBase64ArrayBuffer(JSON.stringify(packet)));

        // @ts-ignore
        new window.ProGraphGroup.logger
            .LogT("Server Manager", "#006e0a")
            .setTitle("Sent Packet " + (packet.type != null ? "| " + packet.type : ""))
            .group(true).setParam(packet)
            .show();

    }

    sendSingIn(loginPlatformType: LoginPlatformType, loginPlatformData: any, callback, context, params): string {
        const reqId = pggUtility.generateUUID();
        this.sendData(new Packet().setType(PK_TYPES_SEND.SING_IN).setReqIdClient(reqId).setData(
            {
                loginPlatformType: loginPlatformType,
                loginPlatformData: loginPlatformData,
            }
        ));

        if (callback != null && context != null)
            this.addCallback(PK_TYPES_SEND.SING_IN, callback, context, params, reqId, true);

        return reqId;
    }

    sendSingUp(loginPlatformType: LoginPlatformType, loginPlatformData: any, callback, context, params): string {
        const reqId = pggUtility.generateUUID();
        this.sendData(new Packet().setType(PK_TYPES_SEND.SING_UP).setReqIdClient(reqId).setData({
            loginPlatformType: loginPlatformType,
            loginPlatformData: loginPlatformData,
        }));
        if (callback != null && context != null)
            this.addCallback(PK_TYPES_SEND.SING_UP, callback, context, params, reqId, true);
        return reqId;
    }

    sendSingOut(callback, context, params): string {
        const reqId = pggUtility.generateUUID();
        this.sendData(new Packet().setType(PK_TYPES_SEND.SING_OUT).setReqIdClient(reqId));
        if (callback != null && context != null)
            this.addCallback(PK_TYPES_SEND.SING_OUT, callback, context, params, reqId, true);
        return reqId;
    }

    sendUpdateMutableData(mutableData: MutableDataModel, callback, context, params) {
        const reqId = pggUtility.generateUUID();
        this.sendData(new Packet().setType(PK_TYPES_SEND.UPDATE_MUTABLE_DATA).setReqIdClient(reqId).setData(mutableData));
        if (callback != null && context != null)
            this.addCallback(PK_TYPES_SEND.UPDATE_MUTABLE_DATA, callback, context, params, reqId, true);
        return reqId;
    }

    sendGetRootPlace(callback, context, params) {
        const reqId = pggUtility.generateUUID();
        this.sendData(new Packet().setType(PK_TYPES_SEND.PLACE_GET).setReqIdClient(reqId));
        if (callback != null && context != null)
            this.addCallback(PK_TYPES_SEND.PLACE_GET, callback, context, params, reqId, true);
        return reqId;
    }

    sendGetMyPlace(callback, context, params) {
        const reqId = pggUtility.generateUUID();
        this.sendData(new Packet().setType(PK_TYPES_SEND.PLACE_GET).setReqIdClient(reqId));
        if (callback != null && context != null)
            this.addCallback(PK_TYPES_SEND.PLACE_GET, callback, context, params, reqId, true);
        return reqId;
    }

    sendJoinPlace(placeId, callback, context, params) {
        const reqId = pggUtility.generateUUID();
        this.sendData(new Packet().setType(PK_TYPES_SEND.PLACE_JOIN).setReqIdClient(reqId)
            .setData({placeId: placeId}));
        if (callback != null && context != null)
            this.addCallback(PK_TYPES_SEND.PLACE_JOIN, callback, context, params, reqId, true);
        return reqId;
    }

    sendLeavePlace(placeId, callback, context, params) {
        const reqId = pggUtility.generateUUID();
        this.sendData(new Packet().setType(PK_TYPES_SEND.PLACE_LEAVE).setReqIdClient(reqId)
            .setData({placeId: placeId}));
        if (callback != null && context != null)
            this.addCallback(PK_TYPES_SEND.PLACE_LEAVE, callback, context, params, reqId, true);
        return reqId;
    }

    //endregion

    //region Logic

    addCallback(packetType, callback, context?, params?, reqId?, isTemporary?) {
        if (reqId == null)
            reqId = pggUtility.generateUUID();
        this.callbacks.push({
            reqId: reqId,
            packetType: packetType,
            callback: callback,
            context: context,
            params: params,
            isTemporary: isTemporary
        });
        return reqId;
    }

    removeCallbackByReqId(reqId) {
        const foundedIndex = this.callbacks.findIndex(x => x.reqId === reqId);
        if (foundedIndex !== -1) {
            this.callbacks.splice(foundedIndex, 1);
            return true;
        }
        return false;
    }

    removeCallbackByPacketType(packetType) {
        const self = this;
        this.callbacks
            .filter(x => x.packetType === packetType)
            .map(function (founded) {
                const foundedIndex = self.callbacks.findIndex(x => x.reqId === founded.reqId);
                if (foundedIndex !== -1) {
                    self.callbacks.splice(foundedIndex, 1);
                }
            });
    }

    clearCallback() {
        this.callbacks = [];
    }

    callCallback(packetType, packetRes) {
        const self = this;
        this.callbacks
            .filter(x => x.packetType === packetType)
            .map(function (founded) {
                founded.callback.call(founded.context, founded.params, packetRes);
                if(founded.isTemporary){
                    self.removeCallbackByReqId(founded.reqId);
                }
            });
    }

    //endregion

    //region Util

    stringToArrayBuffer(binary_string) {

        let len = binary_string.length;
        let bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    }

    stringToBase64ArrayBuffer(binary_string) {
        binary_string = btoa(binary_string);
        let len = binary_string.length;
        let bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    }

    //endregion


}
