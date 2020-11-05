var BaseEffect = require("BaseEffect");
cc.Class({
    extends: BaseEffect,
    properties: {},

    runEffect: function () {

        this._super();

        this._first_Init_Value = cc.v2(this.effectTaget.position);

        this._fill_Start_Values();
        this._fill_End_Values();

        this._startValueTemp = cc.v2(this._startValueRelative);
        this.effectTaget.position = this._startValueTemp;

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


        if (this.startValueType === baseEffectDefined.enValueType.Current) {
            this._startValueRelative = cc.v2(this._first_Init_Value);
        }
        else if (this.startValueType === baseEffectDefined.enValueType.Custom) {
            if (this.valueRelativeType === baseEffectDefined.enValueRelativeType.World) {
                this._startValueRelative = this.effectTaget.convertToNodeSpace(this.startValue);
                this._startValueRelative = this._startValueRelative.add(this._first_Init_Value);
            }
            else
                this._startValueRelative = cc.v2(this.startValue);
        }
        else if (this.startValueType === baseEffectDefined.enValueType.Node) {
            // let tempVal = cc.Vec2.ZERO;
            // this.startValueNode.getWorldPosition(tempVal);

            let tempPos = this.startValueNode.convertToWorldSpace(this.startValueNode.position);

            this._startValueRelative = this.effectTaget.convertToNodeSpace(tempPos);
            this._startValueRelative = this._startValueRelative.add(this._first_Init_Value);
        }
        else if (this.startValueType === baseEffectDefined.enValueType.Predefined) {

            if (this.valueRelativeType === baseEffectDefined.enValueRelativeType.World) {
                this._startValueRelative = this.effectTaget.convertToNodeSpace(this._calcPredefinedValue(this.startValuePredefined, this.effectTaget));
                this._startValueRelative = this._startValueRelative.add(this._first_Init_Value);
            }
            else
                this._startValueRelative = this._calcPredefinedValue(this.startValuePredefined, this.effectTaget);

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

        // this._startValueRelative.x *= this.effectTaget.scaleX;
        // this._startValueRelative.y *= this.effectTaget.scaleY;

        this.effectTaget.position = this._startValueRelative;


    },
    _fill_End_Values: function () {

        this._endValueRelative = cc.Vec2.ZERO;


        if (this.endValueType === baseEffectDefined.enValueType.Current) {
            this._endValueRelative = cc.v2(this._first_Init_Value);
        }
        else if (this.endValueType === baseEffectDefined.enValueType.Custom) {
            if (this.valueRelativeType === baseEffectDefined.enValueRelativeType.World) {
                this._endValueRelative = this.effectTaget.convertToNodeSpace(this.endValue);
                this._endValueRelative = this._endValueRelative.add(this._first_Init_Value);
            }
            else
                this._endValueRelative = cc.v2(this.endValue);
        }
        else if (this.endValueType === baseEffectDefined.enValueType.Node) {
            // let tempVal = cc.Vec2.ZERO;
            // this.endValueNode.getWorldPosition(tempVal);
            let tempPos = this.endValueNode.parent.convertToWorldSpaceAR(this.endValueNode.position);

            // let tempVal = this.endValueNode.getNodeToWorldTransform();
            // let tempPos = cc.v2(tempVal.x, tempVal.y);

            this._endValueRelative = this.effectTaget.parent.convertToNodeSpaceAR(tempPos);
            // this._endValueRelative.x += this.effectTaget.width / 2;
            // this._endValueRelative.y += this.effectTaget.height / 2;
            // this._endValueRelative = this._endValueRelative.add(this._first_Init_Value);
        }
        if (this.endValueType === baseEffectDefined.enValueType.Predefined) {

            if (this.valueRelativeType === baseEffectDefined.enValueRelativeType.World) {
                this._endValueRelative = this.effectTaget.convertToNodeSpace(this._calcPredefinedValue(this.endValuePredefined, this.effectTaget));
                this._endValueRelative = this._endValueRelative.add(this.effectTaget.position);
            }
            else
                this._endValueRelative = this._calcPredefinedValue(this.endValuePredefined, this.effectTaget);

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
            if (this.effectType === baseEffectDefined.enEffectType.By)
                this._endValueRelative.y = 0;
            else
                this._endValueRelative.y = this._first_Init_Value.y;
        }
        if (this.endValueJustUseY === true) {
            if (this.effectType === baseEffectDefined.enEffectType.By)
                this._endValueRelative.x = 0;
            else
                this._endValueRelative.x = this._first_Init_Value.x;
        }

        if (this.effectType === baseEffectDefined.enEffectType.By)
            this._endValueRelative = this._endValueRelative.add(this._startValueRelative);


        // this._endValueRelative.x *= this.effectTaget.scaleX;
        // this._endValueRelative.y *= this.effectTaget.scaleY;

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

                if (self.loopType === baseEffectDefined.enLoopType.Restart)
                    self.effectTaget.position = self._startValueRelative;
            }),

            //effect
            cc.moveTo(self.effectDuration, self._endValueTemp.x, self._endValueTemp.y).easing(self._getCurrentEaseObject()),

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
            self._startValueTemp = cc.v2(self._endValueTemp);
            self._endValueTemp = temp;
        }
        else if (self.loopType === baseEffectDefined.enLoopType.Incremental)
            self._endValueTemp = self.effectTaget.position.add(self.endValue);
    },

});
