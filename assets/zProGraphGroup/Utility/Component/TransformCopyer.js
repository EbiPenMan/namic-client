cc.Class({
    extends: cc.Component,

    properties: {

        sourceNode: cc.Node,
        targetNode: cc.Node,

        runCopy: {
            default: false,
            notify: function () {
                if (this.sourceNode && this.targetNode && this.runCopy === true) {

                    this.targetNode.position = this.sourceNode.position;
                    this.targetNode.scaleX = this.sourceNode.scaleX;
                    this.targetNode.scaleY = this.sourceNode.scaleY;
                    this.targetNode.skewX = this.sourceNode.skewX;
                    this.targetNode.skewY = this.sourceNode.skewY;

                    this.targetNode.anchorX = this.sourceNode.anchorX;
                    this.targetNode.anchorY = this.sourceNode.anchorY;

                    this.targetNode.width = this.sourceNode.width;
                    this.targetNode.height = this.sourceNode.height;

                    this.runCopy = false;
                    this.targetNode = null;
                    this.sourceNode = null;
                }
            }
        },

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    // update (dt) {},
});
