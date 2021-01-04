import pggGlobalManager from "../../zProGraphGroup/pggGlobalManager";
import pggUtility from "../../zProGraphGroup/Utility/pggUtility";
import {GlobalEventsName} from "../../zProGraphGroup/Models/GlobalEventsName";

const {ccclass, property} = cc._decorator;

@ccclass
export class PlaceQuickBoxItemData {
    _id: string = "";
    name: string = "";
    userIdList: string[] = [];
    image: cc.SpriteFrame = null;
    member_count_value: number = 0;
    member_online_count_value: number = 0;
    place_count_value: number = 0;
    role_count_value: number = 0;
}

@ccclass
export default class PlaceQuickBoxItem extends cc.Component {

    @property(cc.Sprite)
    sp_image: cc.Sprite = null;

    @property(cc.Label)
    lbl_member_count_value: cc.Label = null;

    @property(cc.Label)
    lbl_member_online_count_value: cc.Label = null;

    @property(cc.Label)
    lbl_place_count_value: cc.Label = null;

    @property(cc.Label)
    lbl_role_count_value: cc.Label = null;

    @property(cc.Node)
    btn_join_node: cc.Node = null;

    @property(cc.Node)
    btn_leave_node: cc.Node = null;

    @property(cc.Node)
    btn_showDashboard_node: cc.Node = null;

    data: PlaceQuickBoxItemData = new PlaceQuickBoxItemData();


    init(data?: Partial<PlaceQuickBoxItemData>,) {

        this.data = Object.assign(this.data, data);

        this.lbl_member_count_value.string = this.data.member_count_value.toString();
        this.lbl_member_online_count_value.string = this.data.member_online_count_value.toString();
        this.lbl_place_count_value.string = this.data.place_count_value.toString();
        this.lbl_role_count_value.string = this.data.role_count_value.toString();
        this.sp_image.spriteFrame = this.data.image;

        this.checkBtnState();

    }

    checkBtnState() {
        let foundedIndex = this.data.userIdList.findIndex(x => x === pggGlobalManager.getUserManager().userData._id);
        if (foundedIndex === -1) {
            this.btn_join_node.active = true;
            this.btn_leave_node.active = false;
            this.btn_showDashboard_node.active = false;
        } else {
            this.btn_join_node.active = false;
            this.btn_leave_node.active = true;
            this.btn_showDashboard_node.active = true;
        }
    }

    onClick_btn_join() {
        const self = this;
        pggGlobalManager.serverManager.sendJoinPlace(this.data._id, function (params, packetRes) {
            console.log("sendJoinPlace: ", packetRes);
            if (packetRes.data) {
                if (!self.data.userIdList.includes(pggGlobalManager.getUserManager().userData._id)) {
                    self.data.userIdList.push(pggGlobalManager.getUserManager().userData._id);
                    self.checkBtnState();
                }
            }
        }, this, null);
    }

    onClick_btn_leave() {
        const self = this;
        pggGlobalManager.serverManager.sendLeavePlace(this.data._id, function (params, packetRes) {
            console.log("sendJoinPlace: ", packetRes);
            if (packetRes.data) {
                let foundedIndex = self.data.userIdList.findIndex(x => x === pggGlobalManager.getUserManager().userData._id);
                if (foundedIndex !== -1) {
                    self.data.userIdList.splice(foundedIndex,1);
                    self.checkBtnState();
                }
            }
        }, this, null);
    }

    onClick_btn_showDashboard() {
        pggUtility.sendGlobalEvent(null, GlobalEventsName.ON_CLICK_BTN_SHOW_DASHBOARD, {placeId: this.data._id});
    }

}
