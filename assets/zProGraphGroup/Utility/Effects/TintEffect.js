var BaseEffect = require("BaseEffect");
cc.Class({
    extends: BaseEffect,
    properties: {
        valueRelativeType: {
            default: baseEffectDefined.enValueRelativeType.World,
            type: baseEffectDefined.enValueTypeNoPredefined,
            override: true,
            visible: false
        },

        startValueType: {
            default: baseEffectDefined.enValueTypeNoPredefined.Current,
            type: baseEffectDefined.enValueTypeNoPredefined,
            override: true
        },
        startValue: {
            default: new cc.Color(255, 255, 255, 255),
            visible: function () {
                if (this.startValueType === baseEffectDefined.enValueType.Custom)
                    return true;
                else
                    return false;
            },
            override: true
        },
        startValueJustUseX: {
            default: false,
            override: true,
            visible: false
        },
        startValueJustUseY: {
            default: false,
            override: true,
            visible: false
        },
        startValueIncrease: {
            default: new cc.Color(0, 0, 0, 0),
            override: true
        },
        startValueIncreaseJustUseX: {
            default: false,
            visible: false,
            override: true
        },
        startValueIncreaseJustUseY: {
            default: false,
            visible: false,
            override: true
        },

        endValueType: {
            default: baseEffectDefined.enValueTypeNoPredefined.Current,
            type: baseEffectDefined.enValueTypeNoPredefined,
            override: true
        },
        endValue: {
            default: new cc.Color(255, 255, 255, 255),
            visible: function () {
                if (this.endValueType === baseEffectDefined.enValueType.Custom)
                    return true;
                else
                    return false;
            },
            override: true

        },
        endValueJustUseX: {
            default: false,
            override: true,
            visible: false
        },
        endValueJustUseY: {
            default: false,
            override: true,
            visible: false
        },
        endValueIncrease: {
            default: new cc.Color(0, 0, 0, 0),
            override: true
        },
        endValueIncreaseJustUseX: {
            default: false,
            visible: false,
            override: true
        },
        endValueIncreaseJustUseY: {
            default: false,
            visible: false,
            override: true
        },

    },

    runEffect: function () {

        this._super();

        this._first_Init_Value = this.effectTaget.color;

        this._fill_Start_Values();
        this._fill_End_Values();

        this._startValueTemp = new cc.Color(this._startValueRelative);
        this.effectTaget.color = this._startValueTemp;

        this._endValueTemp = new cc.Color(this._endValueRelative);

        if (this.effectType === baseEffectDefined.enEffectType.To) {
            this.loopType = this.loopTypeTo;
        }

        if (this.loops === 1) {
            this.loopType = baseEffectDefined.enLoopType.Restart;
        }

        this.run_Action_Loop();

    },

    _fill_Start_Values: function () {

        this._startValueRelative = new cc.Color(0, 0, 0, 255);


        if (this.startValueType === baseEffectDefined.enValueTypeNoPredefined.Current) {
            this._startValueRelative = new cc.Color(this._first_Init_Value);
        }
        else if (this.startValueType === baseEffectDefined.enValueTypeNoPredefined.Custom) {
            this._startValueRelative = new cc.Color(this.startValue);
        }
        else if (this.startValueType === baseEffectDefined.enValueTypeNoPredefined.Node) {
            this._startValueRelative = this.startValueNode.color;
        }

        // Calc Increase
        this._startValueRelative = this.addTwoColor(this._startValueRelative, this.startValueIncrease);

        this.effectTaget.color = this._startValueRelative;

    },
    _fill_End_Values: function () {

        this._endValueRelative = new cc.Color(0, 0, 0, 255);


        if (this.endValueType === baseEffectDefined.enValueTypeNoPredefined.Current) {
            this._endValueRelative = new cc.Color(this._first_Init_Value);
        }
        else if (this.endValueType === baseEffectDefined.enValueTypeNoPredefined.Custom) {
            this._endValueRelative = new cc.Color(this.endValue);
        }
        else if (this.endValueType === baseEffectDefined.enValueTypeNoPredefined.Node) {
            this._endValueRelative = this.endValueNode.color;
        }

        // Calc Increase
        this._endValueRelative = this.addTwoColor(this._endValueRelative, this.endValueIncrease);


        if (this.effectType === baseEffectDefined.enEffectType.By)
            this._endValueRelative = this.addTwoColor(this._endValueRelative, this._startValueRelative);

    },


    run_Action_Loop: function () {

        let self = this;

        if (this.stopPreviousAction)
            this._stopEffect()


        let Action = cc.sequence(
            // Loop delayTime
            cc.delayTime(self._currentLoopDelay),

            // Start delayTime
            cc.delayTime(self.startDelayTime),

            cc.callFunc(function () {

                if (self._currentLoopIndex === 0)
                    self._startCallback();

                if (self.loopType === baseEffectDefined.enLoopType.Restart) {
                    self.effectTaget.color = self._startValueRelative;
                }
            }),

            //effect
            cc.tintTo(self.effectDuration, self._endValueTemp.r, self._endValueTemp.g, self._endValueTemp.b).easing(self._getCurrentEaseObject()),

            // end delayTime
            cc.delayTime(self.endDelayTime),

            //endEvents
            cc.callFunc(function () {

                self._currentLoopIndex++;
                self._currentLoopDelay = self.loopDelayTime;

                if (self.loops === 0) {
                    self._reCalcValuesLoop();

                    self._endLoopStepCallback();
                    self.run_Action_Loop();
                }
                else {
                    if (self._currentLoopIndex >= self.loops)
                        self._endCallback();
                    else {
                        self._endLoopStepCallback();
                        self._reCalcValuesLoop();
                        self.run_Action_Loop();
                    }
                }
            }),
        );
        this.effectTaget.runAction(Action);
        this._currentAction = Action;
    },

    _reCalcValuesLoop: function () {
        let self = this;
        if (self.loopType === baseEffectDefined.enLoopType.PingPong) {
            let temp = new cc.Color(self._startValueTemp);
            self._startValueTemp = new cc.Color(self._endValueTemp);
            self._endValueTemp = temp;
        }
        else if (self.loopType === baseEffectDefined.enLoopType.Incremental) {
            self._endValueTemp = this.addTwoColor(self.effectTaget.color, self.endValue);
        }
    },

    addTwoColor: function (color1, color2) {
        let temp = new cc.Color();
        temp.r = color1.r + color2.r;
        temp.g = color1.g + color2.g;
        temp.b = color1.b + color2.b;
        temp.a = color1.a + color2.a;
        return temp;
    },


});
