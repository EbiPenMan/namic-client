/**
 *   This class manages a simple frame animation (play, pause, resume)
 */

cc.Class({
    extends: cc.Component,

    properties: {
        animFrames: {
            default: [],
            type: cc.SpriteFrame,
        },

        targetSprite: {
            default: null,
            type: cc.Sprite,
        },

        duration: 1.5,
    },

    // use this for initialization
    onLoad: function () {
        //Create an animation with sprite frames
        //var animFrames = [];
        //var frame = cache.getSpriteFrame("grossini_dance_01.png");
        //animFrames.push(frame);


        this.isPlaying = false;
        this.passedDuration = 0;
        this.timeFromLastFrameChange = 0;
        this.changeFrameEvery = 0;
        this.currFrameIndex = 0;
    },

    play: function () {
        this.passedDuration = 0;
        this.isPlaying = true;
        this.timeFromLastFrameChange = 0;
        this.changeFrameEvery = this.duration / this.animFrames.length;
        this.currFrameIndex = 0;
    },

    update: function (dt) {
        if (!this.isPlaying) {
            return;
        }
        this.timeFromLastFrameChange += dt;
        if (this.timeFromLastFrameChange > this.changeFrameEvery) {
            this.targetSprite.spriteFrame = this.animFrames[this.currFrameIndex];
            this.currFrameIndex++;
            this.timeFromLastFrameChange = 0;
            if (this.currFrameIndex >= this.animFrames.length) {
                this.isPlaying = false;
            }
        }
    },

    pause: function () {
        this.isPlaying = false;
    },

    resume: function () {
        this.isPlaying = true;
    },
});
