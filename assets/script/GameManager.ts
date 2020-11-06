import pggGlobalManager from "../zProGraphGroup/pggGlobalManager";
import {PK_TYPES_SERVER_SEND} from "../zProGraphGroup/Server/PacketType";
import WelcomeController from "./WelcomeController";


const {ccclass, property} = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {


    @property(cc.Node)
    welcomePanelNode: cc.Node;

    @property(cc.Node)
    mainMenuPanelNode: cc.Node;

    onLoad() {

        const self = this;

        pggGlobalManager.serverManager.connect(
            function () {
                pggGlobalManager.loginManager.init(function (res) {
                    self.welcomePanelNode.getComponent("WelcomeController")
                        .init(function () {
                            self.showMainMenu();
                        });
                });
            }, null, this);

        pggGlobalManager.serverManager.addCallback(PK_TYPES_SERVER_SEND.CONNECTION_SUCCEED,
            function () {
                pggGlobalManager.loginManager.init(function (res) {
                    self.welcomePanelNode.getComponent("WelcomeController")
                        .init(function () {
                            self.showMainMenu();
                        });

                });
            });
    }

    showMainMenu() {
        this.mainMenuPanelNode.getComponent("MainMenuPanelController").init();
    }


}
