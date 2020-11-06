

const {ccclass, property} = cc._decorator;

@ccclass
export default class MainMenuPanelController extends cc.Component {


    init(){
        this.node.children[0].active = true;
    }


}
