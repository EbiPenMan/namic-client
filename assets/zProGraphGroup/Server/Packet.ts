const {ccclass, property} = cc._decorator;

@ccclass
export default class Packet{

    private type: any = null;
    private data : any = null;
    private error: any = null;
    private opCode: number = null;
    private reqIdServer: string = null;
    private reqIdClient: string = null;


    constructor(stringPacket? : string) {
        if (stringPacket) {
            let pk = null;
            try {
                pk = JSON.parse(stringPacket);
            }catch (e) {
                console.warn("packet|constructor|catch on parsing data, exp: ", e);
                return;
            }

            let key;

            // Object.getOwnPropertyNames(stringPacket);
            for (key in pk) {
                this[key] = pk[key];
            }
        }
    }

    createResponse(ReceivedPacket : Packet) : Packet {
        this
            .setType(ReceivedPacket.type)
            .setReqIdClient(ReceivedPacket.reqIdClient)
            .setReqIdServer(ReceivedPacket.reqIdServer);
        return this;
    }

    setType(type) : Packet {
        if (type)
            this.type = type;
        return this;
    }

    setData(data) : Packet {
        this.data = data;
        return this;
    }

    setError(error)  : Packet{
        if (error)
            this.error = error;
        return this;
    }

    setOpCode(opCode) : Packet {
        if (opCode)
            this.opCode = opCode;
        return this;
    }

    setReqIdServer(reqIdServer)  : Packet{
        if (reqIdServer)
            this.reqIdServer = reqIdServer;
        return this;
    }

    setReqIdClient(reqIdClient)  : Packet{
        if (reqIdClient)
            this.reqIdClient = reqIdClient;
        return this;
    }

    toString() : string {
        return JSON.stringify(this);
    }

    toBuffer() {
        // return Buffer.from(this.toString(), "utf-8");
    }

};

