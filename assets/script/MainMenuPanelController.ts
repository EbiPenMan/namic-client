import pggGlobalManager from "../zProGraphGroup/pggGlobalManager";
import PlaceQuickBoxItem from "./namic-core/PlaceQuickBoxItem";
import pggUtility from "../zProGraphGroup/Utility/pggUtility";
import {GlobalEventsName} from "../zProGraphGroup/Models/GlobalEventsName";


const {ccclass, property} = cc._decorator;

@ccclass
export default class MainMenuPanelController extends cc.Component {


    @property(cc.Node)
    rootPlaceContainerListNode : cc.Node = null;

    @property(cc.Prefab)
    rootPlacePref : cc.Prefab = null;

    @property(cc.Node)
    placeDashboardNode : cc.Node = null;


    init() {
        pggUtility.registerGlobalEvent( GlobalEventsName.ON_CLICK_BTN_SHOW_DASHBOARD, this.onClick_btn_showDashboard ,this);
        this.initRootPlace();
    }
    onClick_btn_showDashboard() {
        this.placeDashboardNode.active = true;
    }

    initRootPlace() {

        pggGlobalManager.serverManager.sendGetRootPlace(function (params, packetRes) {

            console.log("sendGetRootPlace: " , packetRes);

            let places : [] = packetRes.data;
            places.map(value => {
                let placeNode = cc.instantiate(this.rootPlacePref);
                let placeC : PlaceQuickBoxItem =  placeNode.getComponent(PlaceQuickBoxItem);
                placeC.init(value);
                this.rootPlaceContainerListNode.addChild(placeNode);
            })


        },this,null);


    }


}
