import pggGlobalManager from "../zProGraphGroup/pggGlobalManager";
import {GenderType} from "../zProGraphGroup/Models/UserModel";
import {LanguageCode} from "../zProGraphGroup/Services/MultiLanguage/MultiLanguageManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class WelcomeController extends cc.Component {


    @property(cc.Node)
    questionsNode: cc.Node[] = [];

    @property()
    currentQuestionIndex: number = 0;
    onDone: any = null;

    init(onDone) {
        this.onDone = onDone;
        if (pggGlobalManager.getUserManager().userData.mutableData.passWelcomePage === true) {
            if (this.onDone)
                this.onDone();
            return;
        }

        this.node.children[0].active = true;
        if (this.currentQuestionIndex >= this.questionsNode.length - 1) {
            this.onEnd();
        } else {
            this.setCurrentQuestionNodeActive();
        }
    }

    nextQuestion() {
        if (this.currentQuestionIndex >= this.questionsNode.length - 1) {
            this.onEnd();
        } else {
            this.currentQuestionIndex++;
            this.setCurrentQuestionNodeActive();
        }
    }

    setCurrentQuestionNodeActive() {
        const self = this;
        this.questionsNode.map(function (node, index) {
            node.active = index === self.currentQuestionIndex;
        });
    }

    onEnd() {
        const self = this;
        this.node.children[0].active = false;
        pggGlobalManager.getUserManager().userData.mutableData.passWelcomePage = true;
        pggGlobalManager.getUserManager().saveMutableData(function (res) {
            if (self.onDone)
                self.onDone();
        }, null);

    }

    onQuestionAction(event, actionTag) {
        console.log("WelcomeController|onQuestionAction|actionTag= ", actionTag);

        if (actionTag === "lets-go") {

        } else if (actionTag === "age1") {
            pggGlobalManager.getUserManager().userData.mutableData.ageRangeMin = 0;
            pggGlobalManager.getUserManager().userData.mutableData.ageRangeMax = 6;
        } else if (actionTag === "age2") {
            pggGlobalManager.getUserManager().userData.mutableData.ageRangeMin = 6;
            pggGlobalManager.getUserManager().userData.mutableData.ageRangeMax = 9;
        } else if (actionTag === "age3") {
            pggGlobalManager.getUserManager().userData.mutableData.ageRangeMin = 9;
            pggGlobalManager.getUserManager().userData.mutableData.ageRangeMax = 80;
        } else if (actionTag === "male") {
            pggGlobalManager.getUserManager().userData.mutableData.gender = GenderType.MALE;
        } else if (actionTag === "female") {
            pggGlobalManager.getUserManager().userData.mutableData.gender = GenderType.FEMALE;
        } else if (actionTag === "game-lang-fa") {
            pggGlobalManager.getUserManager().userData.mutableData.gameLanguageCode = LanguageCode.FA;
        } else if (actionTag === "game-lang-en") {
            pggGlobalManager.getUserManager().userData.mutableData.gameLanguageCode = LanguageCode.EN;
        } else if (actionTag === "puzzle-lang-fa") {
            pggGlobalManager.getUserManager().userData.mutableData.puzzleLanguageCode = LanguageCode.FA;
        } else if (actionTag === "puzzle-lang-en") {
            pggGlobalManager.getUserManager().userData.mutableData.puzzleLanguageCode = LanguageCode.EN;
        }


        this.nextQuestion();
    }

}
