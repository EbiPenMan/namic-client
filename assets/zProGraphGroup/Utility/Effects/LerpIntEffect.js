import pggUtility from "../pggUtility";

cc.Class({
    extends: cc.Component,

    properties: {
        target: cc.Label,
        _isRun: false,
        _number: 0,
        _numberTemp: 0,

        isRunOnload: false,
        startDelayTime: 0,
        _startDelayTimeTemp: 0,
        startValue: 0,
        nodeTemp : null,
    },

    onLoad() {
        this.duration = 0.7;
        if (this.isRunOnload) {
            this.initEffect();
            this.runEffect();
        }
    },


    initEffect: function (event, endValue, startValue) {

        if (this.target == null)
            this.myTextComp = this.node.getComponent(cc.Label);
        else {
            this.myTextComp = this.target;
        }
        if (endValue != null)
            this._numberTemp = Number(endValue);
        else
            this._numberTemp = Number(this.myTextComp.string);

        if (startValue != null) {
            this.startValue = Number(startValue);
            this.myTextComp.string = startValue;
        }
        else {
            this.startValue = 0;
            this.myTextComp.string = "";
        }

    },

    runEffect: function (event, withInit, duration) {
        if (duration) {
            this.duration = duration;
        }
        else {
            this.duration = 0.7;
        }
        this._startDelayTimeTemp = this.startDelayTime;
        if (withInit === true) {
            this.initEffect();
        }
        this._isRun = true;
        let self = this;

        this.nodeTemp = new cc.Node();
        this.nodeTemp.parent = this.node.parent;
        this.nodeTemp.x = this.startValue;
        this.nodeTemp.y = 0;
        let action = cc.targetedAction(this.nodeTemp, cc.sequence(
            cc.moveTo(self.duration, cc.v2(self._numberTemp, 0), cc.v2(self.startValue, 0)),
            cc.callFunc(function () {
                self._isRun = false;
                self.nodeTemp.destroy();
                self.myTextComp.string = self._numberTemp;

                try {
                    let parsedNumber = parseInt(self.myTextComp.string);
                    self.myTextComp.string = pggUtility.numberFormater(parsedNumber);
                } catch (e) {

                }
            })
        ));
        this.node.runAction(action);
        this._isRun = true;
    },
    update(dt) {
        if (this._isRun) {
            this.myTextComp.string = Math.floor(this.nodeTemp.x);
        }
    },


})
;
