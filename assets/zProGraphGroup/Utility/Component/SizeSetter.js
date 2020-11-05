cc.Class({
    extends: cc.Component,

    properties: {

        target: cc.Node,
        alignMode: {
            default: 0,
            type: cc.Widget.AlignMode,
        },

        widthMin: 0,
        widthMax: 0,
        heightMin: 0,
        heightMax: 0,

        additionalHeight: 0,
        additionalWidth: 0,

        noHeight: false,
        noWidth: false,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        if (this.target && this.alignMode === cc.Widget.AlignMode.ONCE) {
            this.setSize();
        }

        if (this.target && this.alignMode === cc.Widget.AlignMode.ON_WINDOW_RESIZE) {
            this.node.on(cc.Node.EventType.SIZE_CHANGED, function () {
                this.setSize();
            }, this);
        }

    },


    update(dt) {

        if (this.target && this.alignMode === cc.Widget.AlignMode.ALWAYS) {
            this.setSize();
        }


    },


    setSize: function () {

        if (this.noHeight === false) {
            this.node.height = this.target.height;

            if (this.heightMin > 0 && this.node.height < this.heightMin)
                this.node.height = this.heightMin;
            else if (this.heightMax > 0 && this.node.height > this.heightMax)
                this.node.height = this.heightMax;

            if (this.additionalHeight > 0) {
                this.node.height += this.additionalHeight;
            }

        }

    },

});
