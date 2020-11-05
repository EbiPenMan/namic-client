import pggGlobalManager from "../pggGlobalManager";

cc.Class({
    extends: cc.Component,

    properties: {

        def_music_volume: 3,
        def_sfx_volume: 1,

        def_MenuMusic: {
            type: cc.AudioClip,
            default: null
        },
        def_GameMusic: {
            type: cc.AudioClip,
            default: null
        },

        sfxList: {
            type: cc.AudioClip,
            default: []
        },

        currentMusicClipId : null,
        lastMusicClip:null,
    },

    onLoad: function () {
        pggGlobalManager.audioC = this;
        this.currentMusicClipId = null;
        cc.audioEngine.stopAll();

    },

    onSettingsChanged: function () {
        if (pggGlobalManager.userC.mutableData.soundSetting.music === false) {
            if (this.currentMusicClipId != null) {
                cc.audioEngine.stop(this.currentMusicClipId);
                this.currentMusicClipId = null;
            }
        }
        else {
            if (this.lastMusicClip != null) {
                this.playMusicByClip(this.lastMusicClip);
            }
        }
    },

    playDefMusic: function (loop = true, volume) {

        if (volume == null)
            volume = this.def_music_volume;

        if (cc.director.getScene().name === "Menu") {
            if (this.def_MenuMusic)
                this.lastMusicClip = this.def_MenuMusic;
        }
        else if (cc.director.getScene().name === "game") {
            if (this.def_GameMusic)
                this.lastMusicClip = this.def_GameMusic;
        }

        if (pggGlobalManager.userC.mutableData.soundSetting.music === false) {
            return;
        }

        if (this.currentMusicClipId != null) {
            cc.audioEngine.stop(this.currentMusicClipId);
            this.currentMusicClipId = null;
        }

        if (cc.director.getScene().name === "Menu") {
            if (this.def_MenuMusic)
                this.currentMusicClipId = cc.audioEngine.play(this.def_MenuMusic, loop, volume);
        }
        else if (cc.director.getScene().name === "game") {
            if (this.def_GameMusic)
                this.currentMusicClipId = cc.audioEngine.play(this.def_GameMusic, loop, volume);
        }

        return this.currentMusicClipId;

    },
    playMusicByClip: function (audioClip, loop = true, volume) {

        if (volume == null)
            volume = this.def_music_volume;

        if (audioClip == null) {
            return;
        }

        this.lastMusicClip = audioClip;

        if (pggGlobalManager.userC.mutableData.soundSetting.music === false) {
            return;
        }


        if (this.currentMusicClipId && this.currentMusicClipId.name === audioClip.name)
            return;

        if (this.currentMusicClipId != null) {
            cc.audioEngine.stop(this.currentMusicClipId);
            this.currentMusicClipId = null;
        }

        this.currentMusicClipId = cc.audioEngine.play(audioClip, loop, volume);

        return this.currentMusicClipId;
    },


    playSfxByClip: function (audioClip, loop = false, volume) {

        if (volume == null)
            volume = this.def_sfx_volume;

        if (pggGlobalManager.userC != null && pggGlobalManager.userC.mutableData.soundSetting.effect === false) {
            return;
        }

        if (audioClip == null) {
            return;
        }

        return cc.audioEngine.play(audioClip, loop, volume);

    },
    playSfxByName: function (event, filename, loop = false, volume) {

        let splitedFileNameAndVolume = filename.split(",");
        if (splitedFileNameAndVolume.length > 1) {
            volume = parseInt(splitedFileNameAndVolume[1]);
            filename = splitedFileNameAndVolume[0];
        }

        if (volume == null)
            volume = this.def_sfx_volume;

        if (pggGlobalManager.userC != null && pggGlobalManager.userC.mutableData.soundSetting.effect === false) {
            return;
        }

        let audioClip = this.sfxList.find(x => x.name === filename);

        if (audioClip == null) {
            return;
        }

        return this.playSfxByClip(audioClip, loop, volume);
    },

    stopById: function (id) {
        cc.audioEngine.stop(id);
    },


    onDestroy: function () {
        cc.audioEngine.stopAll();
    },


});
