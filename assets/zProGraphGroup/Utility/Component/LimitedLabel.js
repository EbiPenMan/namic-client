cc.Class({
    extends: cc.Component,

    properties: {
        lbl: cc.Label,
    },

    onLoad: function () {
        if (this.lbl == null) {
            this.lbl = this.node.getComponent(cc.Label);
        }
        this.isLong = false;
        this.isOk = false;
        this.isLerping = false;
    },

    update(dt) {
        if (this.lbl == null)
            return;
        if(!this.isLerping) {

            if (this.isLong && this.isOk) {
                this.lbl.string = this.lbl.string.substring(0, this.lbl.string.length - 3) + "...";
                this.isLong = false;
                this.isOk = false;
                this.isLerping = false;
            }
            else if (this.lbl.node.width > this.lbl.node.parent.width && !this.isLerping) {

                if (!this.isLong) {
                    this.orginalText = this.lbl.string;
                }
                this.isLong = true;
                this.lbl.string = this.lbl.string.substring(0, this.lbl.string.length - 1);
            }
            else if (!this.isOk && this.isLong === true) {
                this.isOk = true;
            }

        }
    },

    onClick: function () {
        if (this.orginalText && (this.isLerping == null || this.isLerping === false)) {
            this.isLerping = true;
            this.editedText = this.lbl.string;
            this.lbl.string = this.orginalText;

            this.count = 0;

            cc.director.getScheduler().schedule(this.lerping, this, 0.2, this.orginalText.length, 0, false);

        }
    },

    lerping: function () {

        if (this.lbl.string.length <= 0) {
            cc.director.getScheduler().unschedule(this.lerping, this);
            this.lbl.string = this.editedText;
            this.isLerping = false;
        }
        else {
            this.count++;
            // console.log("count: " + this.count + " length: " + this.orginalText.length);
            this.lbl.string = this.lbl.string.substring(1, this.lbl.string.length);
        }

    },

});
