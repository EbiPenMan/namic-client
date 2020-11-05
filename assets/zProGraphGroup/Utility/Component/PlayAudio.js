import pggGlobalManager from "../../pggGlobalManager";

cc.Class({
    extends: cc.Component,

    properties: {
        audioControllerPath: "Canvas",
    },

    // LIFE-CYCLE CALLBACKS:


    playAudio: function (event, clipName) {
        pggGlobalManager.audioC.playSfxByName(null, clipName);
    }

});
