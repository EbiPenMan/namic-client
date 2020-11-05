
cc.Class({
    extends: cc.Component,

    properties: {
        isLoadedGameScene: false,
        loadedGameSceneCallback: null,
        loadedGameSceneCallbackContext: null,
        loadedGameSceneCallbackParams: null,
        loadedGameSceneStartTime: null,
    },

    start() {
        this.preLoadScene("Game", null, null, null);
    },

    preLoadScene: function (sceneName, context, callback, params) {

        console.log(" ===== Start Preload Scene" + sceneName);

        let self = this;

        this.isLoadedGameScene = false;
        this.loadedGameSceneStartTime = Date.now();

        self.loadedGameSceneCallbackContext = context;
        self.loadedGameSceneCallback = callback;
        self.loadedGameSceneCallbackParams = params;


        // cc.loader.onProgress = function (completedCount, totalCount, item) {
        //     var percent = 0;
        //     if (totalCount > 0) {
        //         percent = 100 * completedCount / totalCount;
        //     }
        //     console.warn( Math.round(percent) + '%');
        //     console.warn( "completedCount" , completedCount);
        //     console.warn( "totalCount" , totalCount);
        //     console.warn( "item" , item);
        // };

        cc.director.preloadScene(sceneName, function () {

            cc.loader.onProgress = null;
            console.log(" ===== End Preload " + sceneName + " Scene Time: ", Date.now() - self.loadedGameSceneStartTime);

            self.isLoadedGameScene = true;
            if (self.loadedGameSceneCallback != null) {
                self.loadedGameSceneCallback.apply(self.loadedGameSceneCallbackContext, self.loadedGameSceneCallbackParams);
                self.loadedGameSceneCallback = null;
                self.loadedGameSceneCallbackParams = null;
            }
        });


    },


});
