const {ccclass, property} = cc._decorator;

@ccclass
export default class SceneLoaderProgress extends cc.Component {


    @property(cc.Label)
    lblProgress: cc.Label = null;

    @property(cc.ProgressBar)
    progressBar: cc.ProgressBar = null;


    @property(cc.Node)
    rootPanelNode: cc.Node = null;

    @property()
    forceLoadScene: boolean = false;

    preLoaded: boolean = false;
    currentSceneName: string = null;

    loadScene(sceneName: string) {

        const self = this;

        let progress = 0;
        self.lblProgress.node.active = true;
        self.progressBar.node.active = true;

        self.preLoaded = false;
        self.currentSceneName = sceneName;

        self.rootPanelNode.active = true;

        let _loadScene = function () {
            cc.director.preloadScene(sceneName,
                function (completedCount, totalCount, item) {
                    progress = 100 * completedCount / totalCount;
                    if (progress < 100) {
                        self.lblProgress.string = Math.floor(progress) + "%";
                        self.progressBar.progress = Math.floor(progress) / 100;
                    }
                },
                function (error) {
                    if (error) {
                        console.error('============== error on load scene: ' + sceneName + " error: ", error);
                        setTimeout(function () {
                            _loadScene();
                        }, 1000);
                    } else {
                        console.log('+++++++++++++ Success to load scene: ' + sceneName);
                        cc.loader.onProgress = null;

                        if (self.forceLoadScene) {
                            self.preLoaded = false;
                            cc.director.loadScene(self.currentSceneName);
                        }
                        else {
                            self.preLoaded = true;
                        }
                    }
                }
            );
        };
        _loadScene();
    }

    loadSceneAfterPreLoad(newState: boolean) {
        this.forceLoadScene = newState;
        if (this.preLoaded && newState) {
            this.preLoaded = false;
            cc.director.loadScene(this.currentSceneName);
        }
    }

}
