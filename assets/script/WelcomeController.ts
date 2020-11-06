const {ccclass, property} = cc._decorator;

@ccclass
export default class WelcomeController extends cc.Component {


    @property(cc.Node)
    questionsNode: cc.Node[] = [];

    @property()
    currentQuestionIndex: number = 0;
    onDone: any = null;

    init(onDone) {
        this.node.children[0].active = true;
        this.onDone = onDone;
        if (this.currentQuestionIndex >= this.questionsNode.length-1) {
            this.onEnd();
        } else {
            this.setCurrentQuestionNodeActive();
        }
    }

    nextQuestion() {
        if (this.currentQuestionIndex >= this.questionsNode.length-1) {
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
        this.node.children[0].active = false;

        if (this.onDone)
            this.onDone();
    }

    onQuestionAction(event, actionTag) {
        console.log("WelcomeController|onQuestionAction|actionTag= " , actionTag)
        this.nextQuestion();
    }

}
