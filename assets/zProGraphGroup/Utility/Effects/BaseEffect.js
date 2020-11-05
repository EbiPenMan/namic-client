window.baseEffectDefined = {

    enEffectTargetMode: cc.Enum({
        Me: 0,
        Other: 1,
    }),

    enEffectType: cc.Enum({
        To: 0,
        By: 1,
    }),

    enLoopType: cc.Enum({
        Restart: 0,
        PingPong: 1,
        Incremental: 2,
    }),

    enLoopTypeNotInc: cc.Enum({
        Restart: 0,
        PingPong: 1,
    }),

    enEaseType: cc.Enum({

        none: -1,

        easeIn: -1,
        easeOut: -1,
        easeInOut: -1,

        easeSineIn: -1,
        easeSineOut: -1,
        easeSineInOut: -1,

        easeBackIn: -1,
        easeBackOut: -1,
        easeBackInOut: -1,

        easeBounceIn: -1,
        easeBounceOut: -1,
        easeBounceInOut: -1,

        easeElasticIn: -1,
        easeElasticOut: -1,
        easeElasticInOut: -1,

        easeExponentialIn: -1,
        easeExponentialOut: -1,
        easeExponentialInOut: -1,

        easeCubicActionIn: -1,
        easeCubicActionOut: -1,
        easeCubicActionInOut: -1,

        easeQuinticActionIn: -1,
        easeQuinticActionOut: -1,
        easeQuinticActionInOut: -1,

        easeQuarticActionIn: -1,
        easeQuarticActionOut: -1,
        easeQuarticActionInOut: -1,

        easeCircleActionIn: -1,
        easeCircleActionOut: -1,
        easeCircleActionInOut: -1,

        easeQuadraticActionIn: -1,
        easeQuadraticActionOut: -1,
        easeQuadraticActionInOut: -1,

        easeBezierAction: -1,

    }),

    enValueType: cc.Enum({
        Current: 0,
        Custom: 1,
        Node: 2,
        Predefined: 3,

    }),

    enValueTypeNoPredefined: cc.Enum({
        Current: 0,
        Custom: 1,
        Node: 2,
    }),

    enValueRelativeType: cc.Enum({
        Node: 0,
        World: 1,
    }),

    enValuePredefinedType_Pos: cc.Enum({

        Out_Top_Left: -1,
        Out_Top_Center: -1,
        Out_Top_Right: -1,

        Out_Down_Left: -1,
        Out_Down_Center: -1,
        Out_Down_Right: -1,

        Out_Left_Top: -1,
        Out_Left_Center: -1,
        Out_Left_Down: -1,

        Out_Right_Top: -1,
        Out_Right_Center: -1,
        Out_Right_Down: -1,

        In_Top_Left: -1,
        In_Top_Center: -1,
        In_Top_Right: -1,

        In_Down_Left: -1,
        In_Down_Center: -1,
        In_Down_Right: -1,

        In_Center_Left: -1,
        In_Center_Center: -1,
        In_Center_Right: -1,

    }),

    clsEasePoints_Base: cc.Class({
        name: 'clsEasePoints_Base',
        properties: {
            p1: 0,
            p2: 0.8,
            p3: 0.3,
            p4: 1,
        },
    }),

    clsInitValues_Base: cc.Class({
        name: 'clsInitValues_Base',
        properties: {
            setActive: false,
            active: {
                default: false,
                visible: function () {
                    return this.setActive;
                }
            },

            setOpacity: false,
            opacity: {
                default: 255,
                visible: function () {
                    return this.setOpacity;
                }
            },

            setPosition: false,
            position: {
                default: cc.Vec2.ZERO,
                visible: function () {
                    return this.setPosition;
                }
            },

            setScale: false,
            scale: {
                default: cc.Vec2.ZERO,
                visible: function () {
                    return this.setScale;
                }
            },

            setRotation: false,
            rotation: {
                default: 0,
                visible: function () {
                    return this.setRotation;
                }
            },

            setSize: false,
            size: {
                default: cc.Vec2.ZERO,
                visible: function () {
                    return this.setSize;
                }
            },
        },

    }),

    clsAutoTask_Base: cc.Class({
        name: 'clsAutoTask_Base',
        properties: {

            runEffectOnLoad: false,
            runEffectOnStart: false,
            runEffectOnEnable: false,

            activeNodeOnStartEffect: false,

            setOpacityOnStartEffect: false,
            opacity: 255,

            destroyOnCompleted: false,
            destroyNode: {
                default: null,
                type: cc.Node,
                visible: function () {
                    return this.destroyOnCompleted;
                }
            },

        },

    }),

};


cc.Class({
    extends: cc.Component,

    properties: {

        version: {
            default: "3.0",
            readonly: true,
        },
        activeLog: true,

        effectName: "",
        effectDescription: "",

        effectTargetMode: {
            default: window.baseEffectDefined.enEffectTargetMode.Me,
            type: window.baseEffectDefined.enEffectTargetMode
        },

        effectTaget: {
            type: cc.Node,
            default: null,
            visible: function () {
                return this.effectTargetMode !== window.baseEffectDefined.enEffectTargetMode.Me;
            },
            override: true

        },

        effectType: {
            default: window.baseEffectDefined.enEffectType.To,
            type: window.baseEffectDefined.enEffectType,
            override: true
        },

        valueRelativeType: {
            default: window.baseEffectDefined.enValueRelativeType.World,
            type: window.baseEffectDefined.enValueRelativeType,
            override: true
        },

        startValueType: {
            default: window.baseEffectDefined.enValueType.Current,
            type: window.baseEffectDefined.enValueType,
            override: true
        },
        startValuePredefined: {
            type: window.baseEffectDefined.enValuePredefinedType_Pos,
            default: window.baseEffectDefined.enValuePredefinedType_Pos.Out_Down_Center,
            visible: function () {
                return this.startValueType === window.baseEffectDefined.enValueType.Predefined;
            },
            override: true
        },
        startValueNode: {
            type: cc.Node,
            default: null,
            visible: function () {
                return this.startValueType === window.baseEffectDefined.enValueType.Node;
            },
            override: true
        },
        startValue: {
            default: cc.Vec2.ZERO,
            visible: function () {
                return this.startValueType === window.baseEffectDefined.enValueType.Custom;
            },
            override: true
        },
        startValueJustUseX: {
            default: false,
            override: true
        },
        startValueJustUseY: {
            default: false,
            override: true
        },
        startValueIncrease: {
            default: cc.Vec2.ZERO,
            override: true
        },
        startValueIncreaseJustUseX: {
            default: false,
            visible: function () {
                if (this.startValueIncrease.x !== 0)
                    return true;
                else {
                    this.startValueIncreaseJustUseX = false;
                    return false;
                }
            },
            override: true
        },
        startValueIncreaseJustUseY: {
            default: false,
            visible: function () {
                if (this.startValueIncrease.y !== 0)
                    return true;
                else {
                    this.startValueIncreaseJustUseY = false;
                    return false;
                }
            },
            override: true
        },

        endValueType: {
            default: window.baseEffectDefined.enValueType.Current,
            type: window.baseEffectDefined.enValueType,
            override: true
        },
        endValuePredefined: {
            type: window.baseEffectDefined.enValuePredefinedType_Pos,
            default: window.baseEffectDefined.enValuePredefinedType_Pos.Out_Down_Center,
            visible: function () {
                return this.endValueType === window.baseEffectDefined.enValueType.Predefined;
            },
            override: true
        },
        endValueNode: {
            type: cc.Node,
            default: null,
            visible: function () {
                return this.endValueType === window.baseEffectDefined.enValueType.Node;
            },
            override: true
        },
        endValue: {
            default: cc.Vec2.ZERO,
            visible: function () {
                return this.endValueType === window.baseEffectDefined.enValueType.Custom;
            },
            override: true

        },
        endValueJustUseX: {
            default: false,
            override: true
        },
        endValueJustUseY: {
            default: false,
            override: true
        },
        endValueIncrease: {
            default: cc.Vec2.ZERO,
            override: true
        },
        endValueIncreaseJustUseX: {
            default: false,
            visible: function () {
                return this.endValueIncrease.x !== 0;
            },
            override: true
        },
        endValueIncreaseJustUseY: {
            default: false,
            visible: function () {
                return this.endValueIncrease.y !== 0;
            },
            override: true
        },

        effectDuration: {
            default: 1,
            min: 0,
            override: true,
        },
        easeType: {
            default: window.baseEffectDefined.enEaseType.none,
            type: window.baseEffectDefined.enEaseType,
            override: true,
        },

        easeRate: {
            default: 3,
            visible: function () {
                return this.easeType === window.baseEffectDefined.enEaseType.easeIn || this.easeType === window.baseEffectDefined.enEaseType.easeOut || this.easeType === window.baseEffectDefined.enEaseType.easeInOut;
            }
        },
        easePeriod: {
            default: 3,
            visible: function () {
                return this.easeType === window.baseEffectDefined.enEaseType.easeElasticIn || this.easeType === window.baseEffectDefined.enEaseType.easeElasticOut || this.easeType === window.baseEffectDefined.enEaseType.easeElasticInOut;
            }
        },
        easePoints: {
            default: function () {
                return new window.baseEffectDefined.clsEasePoints_Base();
            },
            type: window.baseEffectDefined.clsEasePoints_Base,

            visible: function () {
                return this.easeType === window.baseEffectDefined.enEaseType.easeBezierAction;
            }
        },

        startDelayTime: 0,
        endDelayTime: 0,

        loops: {
            default: 1,
            min: 0,
            step: 1
        },
        loopType: {
            default: window.baseEffectDefined.enLoopType.Restart,
            type: window.baseEffectDefined.enLoopType,
            visible: function () {
                return this.loops !== 1 && this.effectType === window.baseEffectDefined.enEffectType.By;
            }
        },
        loopTypeTo: {
            default: window.baseEffectDefined.enLoopTypeNotInc.Restart,
            type: window.baseEffectDefined.enLoopTypeNotInc,
            visible: function () {
                if (this.loops !== 1 && this.effectType === window.baseEffectDefined.enEffectType.To)
                    return true;
                else
                    return false;
            }
        },
        loopDelayTime: {
            default: 0,
            visible: function () {
                return this.loops !== 1;
            }
        },

        stopPreviousAction: true,

        autoTasks: {
            type: window.baseEffectDefined.clsAutoTask_Base,
            default: function () {
                return new window.baseEffectDefined.clsAutoTask_Base();
            }
        },
        initValues: {
            type: window.baseEffectDefined.clsInitValues_Base,
            default: function () {
                return new window.baseEffectDefined.clsInitValues_Base();
            }
        },

        initEvents: {
            default: [],
            type: cc.Component.EventHandler,
        },
        startEvents: {
            default: [],
            type: cc.Component.EventHandler,
        },
        endEvents: {
            default: [],
            type: cc.Component.EventHandler,
        },
        endLoopStepEvents: {
            default: [],
            type: cc.Component.EventHandler,
            visible: function () {
                return this.loops !== 1;
            }
        },

        // ------ Private
        _currentLoopIndex: 0,
        _currentLoopDelay: 0,

        _first_Init_Value: cc.Vec2,

        _startValueTemp: cc.Vec2,
        _endValueTemp: cc.Vec2,

        _startValueRelative: cc.Vec2,
        _endValueRelative: cc.Vec2,

        _currentEaseObject: {
            default: function () {
                return {};
            }
        },
        _currentAction: undefined,

        // ------ Private
        _compList: [cc.Component],

    },

    onLoad() {

        if (this.effectTargetMode === window.baseEffectDefined.enEffectTargetMode.Me)
            this.effectTaget = this.node;

        this._updateCompList();


        if (this.autoTasks.runEffectOnLoad)
            this.runEffect();

    },

    onEnable: function () {
        if (this.autoTasks.runEffectOnEnable)
            this.runEffect();
    },

    start() {
        if (this.autoTasks.runEffectOnStart)
            this.runEffect();

    },


    runEffect: function () {

        if (this.effectTaget == null) {
            if (this.effectTargetMode === window.baseEffectDefined.enEffectTargetMode.Me)
                this.effectTaget = this.node;
        }


        this._currentLoopIndex = 0;
        this._currentLoopDelay = 0;


        if (this.autoTasks.activeNodeOnStartEffect)
            this.effectTaget.active = true;

        if (this.autoTasks.setOpacityOnStartEffect)
            this.effectTaget.opacity = this.autoTasks.opacity;

    },
    runEffectByName: function (event, name) {

        let comp = this._getCompByName(name);

        if (comp === undefined) {
            this._log("Can not found comp with name '" + name + "'.", this.runEffectByName, "war");
            return false;
        }

        comp.runEffect();
        return true;
    },

    _updateCompList: function () {
        this._compList = [];
        // this._compList = this.node.getComponents(this.__proto__.__classname__);
        this._compList = this.node.getComponents(this.__proto__.__proto__.__classname__);
        // this._compList = this.node.getComponents("BaseEffect");
    },


    _setInitValues: function () {

        if (this.effectTaget === undefined) {
            if (this.effectTargetMode === window.baseEffectDefined.enEffectTargetMode.Me)
                this.effectTaget = this.node;
        }


        if (this.initValues.setActive)
            this.effectTaget.active = this.initValues.active;

        if (this.initValues.setOpacity)
            this.effectTaget.opacity = this.initValues.opacity;

        if (this.initValues.setPosition)
            this.effectTaget.position = this.initValues.position;

        if (this.initValues.setScale)
            this.effectTaget.scale = this.initValues.scale;

        if (this.initValues.setRotation)
            this.effectTaget.angle = this.initValues.rotation;

        if (this.initValues.setSize) {
            this.effectTaget.width = this.initValues.size.x;
            this.effectTaget.height = this.initValues.size.y;
        }

    },
    setInitValuesByName: function (event, name) {

        let comp = this._getCompByName(name);

        if (comp === undefined) {
            this._log("Can not found comp with name '" + name + "'.", this.setInitValuesByName, "war");
            return;
        }
        comp._setInitValues();
    },

    _initCallback: function () {

        // this._log("emit initEvents", this._initCallback);
        cc.Component.EventHandler.emitEvents(this.initEvents, this);

    },
    _startCallback: function () {

        // this._log("emit startEvents", this._startCallback);
        cc.Component.EventHandler.emitEvents(this.startEvents, this);

    },
    _endCallback: function () {

        // this._log("emit endEvents", this._endCallback);
        cc.Component.EventHandler.emitEvents(this.endEvents, this);

        if (this.autoTasks.destroyOnCompleted)
            this.autoTasks.destroyNode.destroy();

    },
    _endLoopStepCallback: function () {

        // this._log("emit endLoopStepEvents", this._endLoopStepCallback);

        let event = {};
        event.target = this;
        event.LastLoopIndex = this._currentLoopIndex;

        cc.Component.EventHandler.emitEvents(this.endLoopStepEvents, event);

    },


    _stopEffect: function () {
        if (this._currentAction != null)
            this.effectTaget.stopAction(this._currentAction);
    },
    stopEffectByName: function (event, name) {
        let comp = this._getCompByName(name);

        if (comp === undefined) {
            this._log("Can not found comp with name '" + name + "'.", this.stopEffectByName, "war");
            return;
        }

        // if (comp._currentAction != null)
        comp._stopEffect();
    },

    _calcPredefinedValue: function (predefined, target) {

        let pos = cc.v2(0, 0);

        switch (predefined) {

            case window.baseEffectDefined.enValuePredefinedType_Pos.Out_Top_Left:
                if (cc.view.getVisibleSize().width > cc.view.getVisibleSize().height) {
                    pos = new cc.Vec2(0, (cc.view.getVisibleSize().width));
                    break;
                }
                else {
                    pos = new cc.Vec2(0, (cc.view.getVisibleSize().height));
                    break;
                }

            case window.baseEffectDefined.enValuePredefinedType_Pos.Out_Top_Center:
                if (cc.view.getVisibleSize().width > cc.view.getVisibleSize().height) {
                    pos = new cc.Vec2((cc.view.getVisibleSize().width * 0.5) - (target.width * 0.5), (cc.view.getVisibleSize().height));
                    break;
                }
                else {
                    pos = new cc.Vec2((cc.view.getVisibleSize().height * 0.5) - (target.height * 0.5), (cc.view.getVisibleSize().width));
                    break;
                }

            case window.baseEffectDefined.enValuePredefinedType_Pos.Out_Top_Right:
                if (cc.view.getVisibleSize().width > cc.view.getVisibleSize().height) {
                    pos = new cc.Vec2((cc.view.getVisibleSize().width) - (target.width), (cc.view.getVisibleSize().height));
                    break;
                }
                else {
                    pos = new cc.Vec2((cc.view.getVisibleSize().height) - (target.height), (cc.view.getVisibleSize().width));
                    break;
                }

            //----------------------------------------------------------

            case window.baseEffectDefined.enValuePredefinedType_Pos.Out_Down_Left:
                if (cc.view.getVisibleSize().width > cc.view.getVisibleSize().height) {
                    pos = new cc.Vec2(0, -(target.width));
                    break;
                }
                else {
                    pos = new cc.Vec2(0, -(target.height));
                    break;
                }

            case window.baseEffectDefined.enValuePredefinedType_Pos.Out_Down_Center:
                if (cc.view.getVisibleSize().width > cc.view.getVisibleSize().height) {
                    pos = new cc.Vec2((cc.view.getVisibleSize().width * 0.5) - (target.width * 0.5), -(target.width));
                    break;
                }
                else {
                    pos = new cc.Vec2((cc.view.getVisibleSize().height * 0.5) - (target.height * 0.5), -(target.height));
                    break;
                }

            case window.baseEffectDefined.enValuePredefinedType_Pos.Out_Down_Right:
                if (cc.view.getVisibleSize().width > cc.view.getVisibleSize().height) {
                    pos = new cc.Vec2((cc.view.getVisibleSize().width) - (target.width), -(target.width));
                    break;
                }
                else {
                    pos = new cc.Vec2((cc.view.getVisibleSize().height) - (target.height), -(target.height));
                    break;
                }
            //----------------------------------------------------------

            case window.baseEffectDefined.enValuePredefinedType_Pos.Out_Left_Top:

                if (cc.view.getVisibleSize().width > cc.view.getVisibleSize().height) {
                    pos = new cc.Vec2(-(target.width), (cc.view.getVisibleSize().width) - (target.width));
                    break;
                }
                else {
                    pos = new cc.Vec2(-(target.height), (cc.view.getVisibleSize().height) - (target.height));
                    break;
                }
            case window.baseEffectDefined.enValuePredefinedType_Pos.Out_Left_Center:
                if (cc.view.getVisibleSize().width > cc.view.getVisibleSize().height) {
                    pos = new cc.Vec2(-(target.width), (cc.view.getVisibleSize().width * 0.5) - (target.width * 0.5));
                    break;
                }
                else {
                    pos = new cc.Vec2(-(target.height), (cc.view.getVisibleSize().height * 0.5) - (target.height * 0.5));
                    break;
                }


            case window.baseEffectDefined.enValuePredefinedType_Pos.Out_Left_Down:
                if (cc.view.getVisibleSize().width > cc.view.getVisibleSize().height) {
                    pos = new cc.Vec2(-(target.width), 0);
                    break;
                }
                else {
                    pos = new cc.Vec2(-(target.height), 0);
                    break;
                }

            //----------------------------------------------------------

            case window.baseEffectDefined.enValuePredefinedType_Pos.Out_Right_Top:
                if (cc.view.getVisibleSize().width > cc.view.getVisibleSize().height) {
                    pos = new cc.Vec2((cc.view.getVisibleSize().width), (cc.view.getVisibleSize().height) - (target.height));
                    break;
                }
                else {
                    pos = new cc.Vec2((cc.view.getVisibleSize().height), (cc.view.getVisibleSize().width) - (target.width));
                    break;
                }
            case window.baseEffectDefined.enValuePredefinedType_Pos.Out_Right_Center:
                if (cc.view.getVisibleSize().width > cc.view.getVisibleSize().height) {
                    pos = new cc.Vec2((cc.view.getVisibleSize().width), (cc.view.getVisibleSize().height * 0.5) - (target.height * 0.5));
                    break;
                }
                else {
                    pos = new cc.Vec2((cc.view.getVisibleSize().height), (cc.view.getVisibleSize().width * 0.5) - (target.width * 0.5));
                    break;
                }

            case window.baseEffectDefined.enValuePredefinedType_Pos.Out_Right_Down:
                if (cc.view.getVisibleSize().width > cc.view.getVisibleSize().height) {
                    pos = new cc.Vec2((cc.view.getVisibleSize().width), 0);
                    break;
                }
                else {
                    pos = new cc.Vec2((cc.view.getVisibleSize().height), 0);
                    break;
                }
            //----------------------------------------------------------

            case window.baseEffectDefined.enValuePredefinedType_Pos.In_Top_Left:
                if (cc.view.getVisibleSize().width > cc.view.getVisibleSize().height) {
                    pos = new cc.Vec2(0, (cc.view.getVisibleSize().width) - target.width);
                    break;
                }
                else {
                    pos = new cc.Vec2(0, (cc.view.getVisibleSize().height) - target.height);
                    break;
                }

            case window.baseEffectDefined.enValuePredefinedType_Pos.In_Top_Center:
                if (cc.view.getVisibleSize().width > cc.view.getVisibleSize().height) {
                    pos = new cc.Vec2((cc.view.getVisibleSize().width * 0.5) - (target.width * 0.5), (cc.view.getVisibleSize().height) - target.height);
                    break;
                }
                else {
                    pos = new cc.Vec2((cc.view.getVisibleSize().height * 0.5) - (target.height * 0.5), (cc.view.getVisibleSize().width) - target.width);
                    break;
                }

            case window.baseEffectDefined.enValuePredefinedType_Pos.In_Top_Right:
                if (cc.view.getVisibleSize().width > cc.view.getVisibleSize().height) {
                    pos = new cc.Vec2((cc.view.getVisibleSize().width) - (target.width), (cc.view.getVisibleSize().height) - target.height);
                    break;
                }
                else {
                    pos = new cc.Vec2((cc.view.getVisibleSize().height) - (target.height), (cc.view.getVisibleSize().width) - target.width);
                    break;
                }
            //----------------------------------------------------------

            case window.baseEffectDefined.enValuePredefinedType_Pos.In_Down_Left:
                if (cc.view.getVisibleSize().width > cc.view.getVisibleSize().height) {
                    pos = new cc.Vec2(0, 0);
                    break;
                }
                else {
                    pos = new cc.Vec2(0, 0);
                    break;
                }
            case window.baseEffectDefined.enValuePredefinedType_Pos.In_Down_Center:
                if (cc.view.getVisibleSize().width > cc.view.getVisibleSize().height) {
                    pos = new cc.Vec2((cc.view.getVisibleSize().width * 0.5) - (target.width * 0.5), 0);
                    break;
                }
                else {
                    pos = new cc.Vec2((cc.view.getVisibleSize().height * 0.5) - (target.height * 0.5), 0);
                    break;
                }
            case window.baseEffectDefined.enValuePredefinedType_Pos.In_Down_Right:
                if (cc.view.getVisibleSize().width > cc.view.getVisibleSize().height) {
                    pos = new cc.Vec2((cc.view.getVisibleSize().width) - (target.width), 0);
                    break;
                }
                else {
                    pos = new cc.Vec2((cc.view.getVisibleSize().height) - (target.height), 0);
                    break;
                }
            //----------------------------------------------------------

            case window.baseEffectDefined.enValuePredefinedType_Pos.In_Center_Left:
                if (cc.view.getVisibleSize().width > cc.view.getVisibleSize().height) {
                    pos = new cc.Vec2(0, (cc.view.getVisibleSize().width * 0.5) - (target.width * 0.5));
                    break;
                }
                else {
                    pos = new cc.Vec2(0, (cc.view.getVisibleSize().height * 0.5) - (target.height * 0.5));
                    break;
                }
            case window.baseEffectDefined.enValuePredefinedType_Pos.In_Center_Center:
                if (cc.view.getVisibleSize().width > cc.view.getVisibleSize().height) {
                    pos = new cc.Vec2((cc.view.getVisibleSize().width * 0.5) - (target.width * 0.5), (cc.view.getVisibleSize().height * 0.5) - (target.height * 0.5));
                    break;
                }
                else {
                    pos = new cc.Vec2((cc.view.getVisibleSize().height * 0.5) - (target.height * 0.5), (cc.view.getVisibleSize().width * 0.5) - (target.width * 0.5));
                    break;
                }

            case window.baseEffectDefined.enValuePredefinedType_Pos.In_Center_Right:
                if (cc.view.getVisibleSize().width > cc.view.getVisibleSize().height) {
                    pos = new cc.Vec2((cc.view.getVisibleSize().width) - (target.width), (cc.view.getVisibleSize().height * 0.5) - (target.height * 0.5));
                    break;
                }
                else {
                    pos = new cc.Vec2((cc.view.getVisibleSize().height) - (target.height), (cc.view.getVisibleSize().width * 0.5) - (target.width * 0.5));
                    break;
                }

        }

        return pos;


    },


    _getCurrentEaseObject: function () {

        switch (this.easeType) {

            case window.baseEffectDefined.enEaseType.none:
                return cc.easeIn(1);
            case window.baseEffectDefined.enEaseType.easeIn:
                return cc.easeIn(this.easeRate);
            case window.baseEffectDefined.enEaseType.easeOut:
                return cc.easeOut(this.easeRate);
            case window.baseEffectDefined.enEaseType.easeInOut:
                return cc.easeInOut(this.easeRate);
            case window.baseEffectDefined.enEaseType.easeSineIn:
                return cc.easeSineIn();
            case window.baseEffectDefined.enEaseType.easeSineOut:
                return cc.easeSineOut();
            case window.baseEffectDefined.enEaseType.easeSineInOut:
                return cc.easeSineInOut();
            case window.baseEffectDefined.enEaseType.easeBackIn:
                return cc.easeBackIn();
            case window.baseEffectDefined.enEaseType.easeBackOut:
                return cc.easeBackOut();
            case window.baseEffectDefined.enEaseType.easeBackInOut:
                return cc.easeBackInOut();
            case window.baseEffectDefined.enEaseType.easeBounceIn:
                return cc.easeBounceIn();
            case window.baseEffectDefined.enEaseType.easeBounceOut:
                return cc.easeBounceOut();
            case window.baseEffectDefined.enEaseType.easeBounceInOut:
                return cc.easeBounceInOut();
            case window.baseEffectDefined.enEaseType.easeElasticIn:
                return cc.easeElasticIn(this.easePeriod);
            case window.baseEffectDefined.enEaseType.easeElasticOut:
                return cc.easeElasticOut(this.easePeriod);
            case window.baseEffectDefined.enEaseType.easeElasticInOut:
                return cc.easeElasticInOut(this.easePeriod);
            case window.baseEffectDefined.enEaseType.easeExponentialIn:
                return cc.easeExponentialIn();
            case window.baseEffectDefined.enEaseType.easeExponentialOut:
                return cc.easeExponentialOut();
            case window.baseEffectDefined.enEaseType.easeExponentialInOut:
                return cc.easeExponentialInOut();
            case window.baseEffectDefined.enEaseType.easeCubicActionIn:
                return cc.easeCubicActionIn();
            case window.baseEffectDefined.enEaseType.easeCubicActionOut:
                return cc.easeCubicActionOut();
            case window.baseEffectDefined.enEaseType.easeCubicActionInOut:
                return cc.easeCubicActionInOut();
            case window.baseEffectDefined.enEaseType.easeQuinticActionIn:
                return cc.easeQuinticActionIn();
            case window.baseEffectDefined.enEaseType.easeQuinticActionOut:
                return cc.easeQuinticActionOut();
            case window.baseEffectDefined.enEaseType.easeQuinticActionInOut:
                return cc.easeQuinticActionInOut();
            case window.baseEffectDefined.enEaseType.easeQuarticActionIn:
                return cc.easeQuarticActionIn();
            case window.baseEffectDefined.enEaseType.easeQuarticActionOut:
                return cc.easeQuarticActionOut();
            case window.baseEffectDefined.enEaseType.easeQuarticActionInOut:
                return cc.easeQuarticActionInOut();
            case window.baseEffectDefined.enEaseType.easeCircleActionIn:
                return cc.easeCircleActionIn();
            case window.baseEffectDefined.enEaseType.easeCircleActionOut:
                return cc.easeCircleActionOut();
            case window.baseEffectDefined.enEaseType.easeCircleActionInOut:
                return cc.easeCircleActionInOut();
            case window.baseEffectDefined.enEaseType.easeQuadraticActionIn:
                return cc.easeQuadraticActionIn();
            case window.baseEffectDefined.enEaseType.easeQuadraticActionOut:
                return cc.easeQuadraticActionOut();
            case window.baseEffectDefined.enEaseType.easeQuadraticActionInOut:
                return cc.easeQuadraticActionInOut();
            case window.baseEffectDefined.enEaseType.easeBezierAction:
                return cc.easeBezierAction(this.easePoints.p1, this.easePoints.p2, this.easePoints.p3, this.easePoints.p4);
        }


    },


    _getCompByName: function (name) {
        if (this._compList === undefined || this._compList.length === 0)
            this._updateCompList();

        return this._compList.find(x => x.effectName === name);
    },
    getCompByName: function (event, name) {
        if (this._compList === undefined || this._compList.length === 0)
            this._updateCompList();

        return this._compList.find(x => x.effectName === name);
    },

    _log: function (msg, caller, type /*  log , war , err  */) {
        if (this.activeLog) {
            if (type === undefined || type === "log")
                cc.log(this.name + "(name:" + this.effectName + ")." + caller.name + "() - " + msg);
            else if (type === "war")
                cc.warn(this.name + "(name:" + this.effectName + ")." + caller.name + "() - " + msg);
            else if (type === "err")
                cc.error(this.name + "(name:" + this.effectName + ")." + caller.name + "() - " + msg);
        }
    },


});
