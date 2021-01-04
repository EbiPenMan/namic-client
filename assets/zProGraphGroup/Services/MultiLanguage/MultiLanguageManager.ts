import pggGlobalManager from "../../pggGlobalManager";


const {ccclass, property} = cc._decorator;
export const enum LanguageCode {
    NONE = 0,
    FA = 1,
    EN = 2
}
@ccclass
export default class MultiLanguageManager extends cc.Component {


    // @ts-ignore
    @property({type: cc.Enum(LanguageCode)})
    defaultUiLanguageCode: LanguageCode = 0;

    // @ts-ignore
    @property({type: cc.Enum(LanguageCode)})
    defaultPuzzleLanguageCode: LanguageCode = 0;


    protected onLoad() {
        pggGlobalManager.multilanguageManager = this;
    }


}
