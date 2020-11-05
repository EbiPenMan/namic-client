var BaseEffect = require("BaseEffect");
cc.Class({
    extends: BaseEffect,
    properties: {
        valueRelativeType: {
            default: baseEffectDefined.enValueRelativeType.World,
            type: baseEffectDefined.enValueTypeNoPredefined,
            override: true,
            visible: false,
        },

        startValueType: {
            default: baseEffectDefined.enValueTypeNoPredefined.Current,
            type: baseEffectDefined.enValueTypeNoPredefined,
            override: true
        },

        endValueType: {
            default: baseEffectDefined.enValueTypeNoPredefined.Current,
            type: baseEffectDefined.enValueTypeNoPredefined,
            override: true
        },

    },

    runEffect: function () {

        this._super();

        this._first_Init_Value.x = this.effectTaget.scaleX;
        this._first_Init_Value.y = this.effectTaget.scaleY;

        this._fill_Start_Values();
        this._fill_End_Values();

        this._startValueTemp = cc.v2(this._startValueRelative);
        this.effectTaget.scaleX = this._startValueTemp.x;
        this.effectTaget.scaleY = this._startValueTemp.y;

        this._endValueTemp = cc.v2(this._endValueRelative);

        if (this.effectType === baseEffectDefined.enEffectType.To) {
            this.loopType = this.loopTypeTo;
        }

        if (this.loops === 1) {
            this.loopType = baseEffectDefined.enLoopType.Restart;
        }

        this.run_Action_Loop();

    },

    _fill_Start_Values: function () {

        this._startValueRelative = cc.Vec2.ZERO;


        if (this.startValueType === baseEffectDefined.enValueTypeNoPredefined.Current) {
            this._startValueRelative = cc.v2(this._first_Init_Value);
        }
        else if (this.startValueType === baseEffectDefined.enValueTypeNoPredefined.Custom) {
            this._startValueRelative = cc.v2(this.startValue);
        }
        else if (this.startValueType === baseEffectDefined.enValueTypeNoPredefined.Node) {
            this._startValueRelative.x = this.startValueNode.scaleX;
            this._startValueRelative.y = this.startValueNode.scaleY;
        }


        // Calc Increase
        if (this.startValueIncreaseJustUseX === true)
            this._startValueRelative.x += this.startValueIncrease.x;
        if (this.startValueIncreaseJustUseY === true)
            this._startValueRelative.y += this.startValueIncrease.y;
        else if (this.startValueIncreaseJustUseX === false && this.startValueIncreaseJustUseY === false)
            this._startValueRelative = this._startValueRelative.add(this.startValueIncrease);


        // Check Just Use
        if (this.startValueJustUseX === true)
            this._startValueRelative.y = this._first_Init_Value.y;
        if (this.startValueJustUseY === true)
            this._startValueRelative.x = this._first_Init_Value.x;


        this.effectTaget.scaleX = this._startValueRelative.x;
        this.effectTaget.scaleY = this._startValueRelative.y;

    },
    _fill_End_Values: function () {

        this._endValueRelative = cc.Vec2.ZERO;


        if (this.endValueType === baseEffectDefined.enValueTypeNoPredefined.Current) {
            this._endValueRelative = cc.v2(this._first_Init_Value);
        }
        else if (this.endValueType === baseEffectDefined.enValueTypeNoPredefined.Custom) {
            this._endValueRelative = cc.v2(this.endValue);
        }
        else if (this.endValueType === baseEffectDefined.enValueTypeNoPredefined.Node) {
            this._endValueRelative.x = this.endValueNode.scaleX;
            this._endValueRelative.y = this.endValueNode.scaleY;
        }

        // Calc Increase
        if (this.endValueIncreaseJustUseX === true)
            this._endValueRelative.x += this.endValueIncrease.x;
        if (this.endValueIncreaseJustUseY === true)
            this._endValueRelative.y += this.endValueIncrease.y;
        else if (this.endValueIncreaseJustUseX === false && this.endValueIncreaseJustUseY === false)
            this._endValueRelative = this._endValueRelative.add(this.endValueIncrease);


        // Check Just Use
        if (this.endValueJustUseX === true) {
            if (self.effectType === baseEffectDefined.enEffectType.By)
                this._endValueRelative.y = 0;
            else
                this._endValueRelative.y = this._first_Init_Value.y;
        }
        if (this.endValueJustUseY === true) {
            if (self.effectType === baseEffectDefined.enEffectType.By)
                this._endValueRelative.x = 0;
            else
                this._endValueRelative.x = this._first_Init_Value.x;
        }

        if (this.effectType === baseEffectDefined.enEffectType.By)
            this._endValueRelative = this._endValueRelative.add(this._startValueRelative);

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
                    self.effectTaget.scaleX = self._startValueRelative.x;
                    self.effectTaget.scaleY = self._startValueRelative.y;
                }
            }),

            //effect
            cc.scaleTo(self.effectDuration, self._endValueTemp.x, self._endValueTemp.y).easing(self._getCurrentEaseObject()),

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
            let temp = cc.v2(self._startValueTemp);
            self._startValueTemp = cc.v2(self._endValueTemp);
            self._endValueTemp = cc.v2(temp);
        }
        else if (self.loopType === baseEffectDefined.enLoopType.Incremental) {
            self._endValueTemp.x = self.effectTaget.scaleX + self.endValue.x;
            self._endValueTemp.y = self.effectTaget.scaleY + self.endValue.y;
        }
    },

});
