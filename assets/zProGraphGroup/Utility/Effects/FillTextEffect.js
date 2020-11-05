cc.Class({
    extends: cc.Component,

    properties: {
        fillCharSpeed: 0.5,

        isLoop: false,
        loopDelay: 0,


        runEffectOnLoad: false,
        runEffectOnStart: false,

        text: "",

        _fillTimeTemp: 0,
        _isRun: false,

        _text: "",
        _lastIndex: 0,
        _loopDelayTemp: 0,
        _isInLoopDelaySec: false,
    },


    onLoad() {
        if (this.runEffectOnLoad) {
            this.initEffect();
            this.runEffect();
        }
    },

    start() {
        if (this.runEffectOnStart) {
            this.initEffect();
            this.runEffect();
        }
    },


    initEffect: function (event, value) {

        this.myTextComp = this.node.getComponent(cc.Label);


        if (value != null && value !== "")
            this._text = value;
        else if (this.text !== "")
            this._text = this.text;
        else
            this._text = this.myTextComp.string;

        this._lastIndex = 0;
        this.myTextComp.string = "";
    },

    runEffect: function () {

        this.node.active = true;


        if (this.text !== "") {
            this.initEffect();
        }
        else {
            this._lastIndex = 0;
            this.myTextComp.string = "";
        }


        this._isRun = true;

    },

    stopEffect: function () {
        this._isRun = false;
        this._isInLoopDelaySec = false;
        this.myTextComp.string = this._text;
    },

    update(dt) {

        if (this._isRun && this._isInLoopDelaySec === false) {

            this._fillTimeTemp += dt;

            if (this._fillTimeTemp >= this.fillCharSpeed) {
                this.myTextComp.string += this._text.substr(this._lastIndex, 1);
                this._lastIndex++;

                this._fillTimeTemp = 0;

                if (this._lastIndex >= this._text.length) {

                    if (this.isLoop) {
                        if (this.loopDelay > 0 && this._isInLoopDelaySec === false) {

                            this._loopDelayTemp = this.loopDelay;
                            this._isInLoopDelaySec = true;
                        }
                    }
                    else
                        this._isRun = false;
                }

            }
        }


        if (this._isInLoopDelaySec) {
            this._loopDelayTemp -= dt;
            if (this._loopDelayTemp <= 0) {
                this._lastIndex = 0;
                this.myTextComp.string = "";
                this._isInLoopDelaySec = false;
                this._loopDelayTemp = 0;
            }
        }


    },
});
