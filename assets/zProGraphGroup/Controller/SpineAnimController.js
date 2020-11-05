/**
 *   This class manages spine animations
 */
cc.Class({
    extends: cc.Component,
    editor: {
        requireComponent: sp.Skeleton
    },

    properties: {
        mixTime: 0.2,
        trackIndex: 0,
        animationName: "animation",
        isLoop: false,
        timeScale: 0.92,
        setOpacity: false,
        opacity: 255,

        completeEvents: {
            default: [],
            type: cc.Component.EventHandler,
        },

    },

    // use this for initialization
    onLoad: function () {
        this.spine = this.getComponent('sp.Skeleton');
    },

    runAnim: function () {

        if (this.setOpacity)
            this.node.opacity = this.opacity;

        this.spine.timeScale = this.timeScale;
        let self = this;

        this.spine.setCompleteListener(function () {
            cc.Component.EventHandler.emitEvents(self.completeEvents, self);
        })
        this.spine.setAnimation(this.trackIndex, this.animationName, this.isLoop);
    },

    setMix: function (anim1, anim2) {
        this.spine.setMix(anim1, anim2, this.mixTime);
        this.spine.setMix(anim2, anim1, this.mixTime);
    },
});
