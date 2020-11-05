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
            default: 0,
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
            default: 0,
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
            default: 0,
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
            default: 0,
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

        this._first_Init_Value = this.effectTaget.angle;

        this._fill_Start_Values();
        this._fill_End_Values();

        this._startValueTemp = this._startValueRelative;
        this.effectTaget.angle = this._startValueTemp;

        this._endValueTemp = this._endValueRelative;

        if (this.effectType === baseEffectDefined.enEffectType.To) {
            this.loopType = this.loopTypeTo;
        }

        if (this.loops === 1) {
            this.loopType = baseEffectDefined.enLoopType.Restart;
        }

        this.run_Action_Loop();

    },

    _fill_Start_Values: function () {

        this._startValueRelative = 0;


        if (this.startValueType === baseEffectDefined.enValueTypeNoPredefined.Current) {
            this._startValueRelative = this._first_Init_Value;
        }
        else if (this.startValueType === baseEffectDefined.enValueTypeNoPredefined.Custom) {
            this._startValueRelative = this.startValue;
        }
        else if (this.startValueType === baseEffectDefined.enValueTypeNoPredefined.Node) {
            this._startValueRelative = this.startValueNode.angle;
        }

        // Calc Increase
        this._startValueRelative += this.startValueIncrease;

        this.effectTaget.angle = this._startValueRelative;

    },
    _fill_End_Values: function () {

        this._endValueRelative = 0;


        if (this.endValueType === baseEffectDefined.enValueTypeNoPredefined.Current) {
            this._endValueRelative = this._first_Init_Value;
        }
        else if (this.endValueType === baseEffectDefined.enValueTypeNoPredefined.Custom) {
            this._endValueRelative = this.endValue;
        }
        else if (this.endValueType === baseEffectDefined.enValueTypeNoPredefined.Node) {
            this._endValueRelative = this.endValueNode.angle;
        }

        // Calc Increase
        this._endValueRelative += this.endValueIncrease;


        if (this.effectType === baseEffectDefined.enEffectType.By)
            this._endValueRelative += this._startValueRelative;

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
                    self.effectTaget.angle = self._startValueRelative;
                }
            }),

            //effect
            cc.rotateTo(self.effectDuration, self._endValueTemp).easing(self._getCurrentEaseObject()),

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
            let temp = self._startValueTemp;
            self._startValueTemp = self._endValueTemp;
            self._endValueTemp = temp;
        }
        else if (self.loopType === baseEffectDefined.enLoopType.Incremental) {
            self._endValueTemp = self.effectTaget.angle + self.endValue;
        }
    },


});
