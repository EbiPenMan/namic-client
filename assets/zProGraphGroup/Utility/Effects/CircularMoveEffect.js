let enLookAtType = cc.Enum({
    None: 0,
    Front: 1,
    CenterPivot: 2,
    Node: 3,
});


let enDirectionType = cc.Enum({
    Clockwise: 0,
    Counterclockwise: 1
});


var BaseEffect = require("BaseEffect");
cc.Class({
    extends: BaseEffect,
    properties: {

        effectType: {
            default: baseEffectDefined.enEffectType.By,
            type: baseEffectDefined.enEffectType,
            override: true,
            visible: false
        },


        valueRelativeType: {
            default: baseEffectDefined.enValueRelativeType.World,
            type: baseEffectDefined.enValueTypeNoPredefined,
            override: true,
            visible: false
        },

        startValueType: {
            default: baseEffectDefined.enValueTypeNoPredefined.Custom,
            type: baseEffectDefined.enValueTypeNoPredefined,
            override: true,
            visible: false
        },
        startValue: {
            default: 0,
            visible: true,
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
            override: true,
            visible: false
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
            default: baseEffectDefined.enValueTypeNoPredefined.Custom,
            type: baseEffectDefined.enValueTypeNoPredefined,
            override: true,
            visible: false
        },
        endValue: {
            default: 0,
            visible: true,
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
            override: true,
            visible: false
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

        // effectDuration: {
        //     default: 1,
        //     min: 0
        // },


        easeType: {
            default: baseEffectDefined.enEaseType.none,
            type: baseEffectDefined.enEaseType,
            override: true,
            visible: false
        },

        centerTarget: cc.Node,
        radius: 0,
        direction: {
            default: enDirectionType.Clockwise,
            type: enDirectionType
        },
        lookAt: {
            default: enLookAtType.None,
            type: enLookAtType
        },

        _angle: 0,

        _posTemp: cc.Vec2,

        _circleCenter: cc.Vec2,
        _oldPos: cc.Vec2,


        _isStartedEffect: false,
        _pastEffectDuration: 0,
        _init_val_add_radius: cc.Vec2,
        _directionFactorSign: 1,
        _ClockwiseEnd: 0,

        _startDelayTimeTemp: 0,
        _endDelayTimeTemp: 0,
        _waitingForStartDelay: false,
        _waitingForEndDelay: false,

        _loopDelayTimeTemp: 0,
        _waitingForLoopDelayTime: false,
        _isEndWaitingLoopDelay: false,
    },

    runEffect: function () {

        this._super();

        // this._first_Init_Value = this.effectTaget.rotation;

        this._circleCenter = this.centerTarget.position;
        this._init_val_add_radius = this.effectTaget.position.sub(cc.v2(0, -this.radius));


        this._fill_Start_Values();
        this._fill_End_Values();

        this._startValueTemp = this._startValueRelative;


        this._endValueTemp = this._endValueRelative;

        if (this.effectType === baseEffectDefined.enEffectType.To) {
            this.loopType = this.loopTypeTo;
        }

        if (this.loops === 1) {
            this.loopType = baseEffectDefined.enLoopType.Restart;
        }


        this._angle = this._startValueTemp;


        this._calc_Start_End_By_Direction();


        this.dist = Math.abs(this._endValueTemp - this._angle);


        if (this.startDelayTime > 0) {
            this._startDelayTimeTemp = this.startDelayTime;
            this._waitingForStartDelay = true;
        }
        else {
            this._isStartedEffect = true;
            this._startCallback();

        }

    },

    _fill_Start_Values: function () {

        this._startValueRelative = this.startValue;

    },
    _fill_End_Values: function () {

        this._endValueRelative = this.endValue;

        if (this.loopType === baseEffectDefined.enLoopType.Incremental) {

            if (this.direction === enDirectionType.Clockwise) {
                this._endValueRelative -= this.endValue;
            }
            else {
                this._endValueRelative += this.endValue;
            }
        }

    },

    _calc_Start_End_By_Direction: function () {

        if (this.direction === enDirectionType.Clockwise) {
            if (this._startValueTemp > this._endValueTemp) {

            }
            else {
                this._endValueTemp -= 360;

            }
        }
        else if (this.direction === enDirectionType.Counterclockwise) {
            if (this._startValueTemp > this._endValueTemp) {
                this._endValueTemp += 360;
            }
            else {

            }
        }

    },

    _stopEffect: function () {

        this._super();

        this._isStartedEffect = false;
        this._pastEffectDuration = 0;
        this.centerTarget.position = this._circleCenter;
    },
    _endEffect: function () {

        this._stopEffect();

        this._isStartedEffect = false;
        this._pastEffectDuration = 0;

        // if (this.verticalRandomRange !== 0 || this.horizontalRandomRange !== 0)
        //     this.effectTaget.position = this._startInitPos;
        //
        // if (this.rotateRandomRange !== 0)
        //     this.effectTaget.rotation = this._startInitRotation;

        this._endCallback();
    },


    update(dt) {


        if (this._isStartedEffect) {

            if (this._checkEndLoop()) {

                if (this._currentLoopIndex >= this.loops - 1 && this.loops !== 0) {

                    this._isStartedEffect = false;

                    this._angle = this._endValueTemp;
                    this.effectTaget.position = this._getPosOnCircle(this._endValueTemp, this.radius, this._circleCenter);


                    if (this.endDelayTime > 0 && this._waitingForEndDelay === false) {
                        this._endDelayTimeTemp = this.endDelayTime;
                        this._waitingForEndDelay = true;
                    }
                    else
                        this._endCallback();
                }
                else {

                    if (this._waitingForLoopDelayTime === false) {

                        if (this.loopDelayTime > 0) {
                            this._loopDelayTimeTemp = this.loopDelayTime;
                            this._waitingForLoopDelayTime = true;
                        }
                        else {
                            this._loop_Run_Code();
                        }
                    }


                }
            }
            else {
                let v = ((this.dist / (this.effectDuration)) * dt);// * this._directionFactorSign;
                this._move(v);
            }


        }


        if (this._waitingForStartDelay) {

            this._startDelayTimeTemp -= dt;

            if (this._startDelayTimeTemp <= 0) {
                this._waitingForStartDelay = false;
                this._isStartedEffect = true;
                this._startCallback();
            }
        }

        if (this._waitingForEndDelay) {

            this._endDelayTimeTemp -= dt;

            if (this._endDelayTimeTemp <= 0) {
                this._endCallback();
                this._waitingForEndDelay = false;
            }
        }


        if (this._waitingForLoopDelayTime) {

            this._loopDelayTimeTemp -= dt;

            if (this._loopDelayTimeTemp <= 0) {
                this._waitingForLoopDelayTime = false;
                this._loop_Run_Code();
            }
        }


    },


    _loop_Run_Code: function () {

        this._endLoopStepCallback();

        if (this.loopType === baseEffectDefined.enLoopType.Restart) {
            this._angle = this._startValueTemp;
        }
        else if (this.loopType === baseEffectDefined.enLoopType.PingPong) {


            // this._ClockwiseEnd =  (this._endValueTemp - this._startValueTemp) - (360 - this._startValueTemp);
            // this._endValueTemp = this._ClockwiseEnd;


            if (this._endValueTemp < 0)
                this._endValueTemp += 360;

            let temp = this._startValueTemp;


            this._startValueTemp = this._endValueTemp;
            this._endValueTemp = temp;
            // this._directionFactorSign = this._directionFactorSign * -1;


            if (this.direction === enDirectionType.Clockwise) {
                this.direction = enDirectionType.Counterclockwise;
            }
            else {
                this.direction = enDirectionType.Clockwise;

            }

            this._calc_Start_End_By_Direction();

            this._angle = this._startValueTemp;


        }
        else if (this.loopType === baseEffectDefined.enLoopType.Incremental) {


            if (this.direction === enDirectionType.Clockwise) {

                if (this._endValueTemp <= 0) {
                    this._endValueTemp = this._endValueTemp + 360;
                    this._startValueTemp = this._endValueTemp;
                    this._angle = this._startValueTemp;

                }

                this._endValueTemp -= this.endValue;
            }
            else {

                if (this._endValueTemp >= 360) {
                    this._endValueTemp = this._endValueTemp - 360;
                    this._startValueTemp = this._endValueTemp;
                    this._angle = this._startValueTemp;

                }

                this._endValueTemp += this.endValue;
            }


            this._calc_Start_End_By_Direction();


        }
        this._isEndWaitingLoopDelay = true;
        this._currentLoopIndex++;
    },


    _checkEndLoop: function () {

        if (this.direction === enDirectionType.Clockwise) {

            if (this._angle <= this._endValueTemp)
                return true;
            else
                return false;
        }
        else {

            if (Math.abs(this._angle) >= Math.abs(this._endValueTemp))
                return true;
            else
                return false;
        }

    },


    _move: function (speed) {


        this._posTemp = this._getPosOnCircle(this._angle, this.radius, this._circleCenter);


        if (this.isRotateToDirection) {
            let diff = this._oldPos.sub(this.effectTaget.position);
            let angle = Math.atan2(diff.x, diff.y);
            this.effectTaget.angle = cc.radiansToDegrees(angle);
            this._oldPos = this.effectTaget.position;
        }

        this.effectTaget.position = this._posTemp;

        if (this.direction === enDirectionType.Clockwise)
            this._angle -= speed;
        else if (this.direction === enDirectionType.Counterclockwise)
            this._angle += speed;


    },


    _getPosOnCircle: function (angle, radius, circleCenter) {
        let radi = cc.degreesToRadians(angle);

        let posTemp = cc.v2(0, 0);

        posTemp.x = circleCenter.x + (Math.cos(radi)) * radius;
        posTemp.y = circleCenter.y + (Math.sin(radi)) * radius;

        return posTemp;
    },


});
