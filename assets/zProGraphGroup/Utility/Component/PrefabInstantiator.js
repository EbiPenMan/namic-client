let clsPrefabsList = cc.Class({
    name: 'clsPrefabsList',
    properties: {
        prefab: cc.Prefab,
        targetContainer: cc.Node,
        name: "",
    }
});


cc.Class({
    extends: cc.Component,

    properties: {

        prefabsList: {
            default: [],
            type: clsPrefabsList
        }

    },

    onLoad() {


        for (let i = 0; i < this.prefabsList.length; i++) {

            if (this.prefabsList[i].targetContainer == null) {
                this.prefabsList[i].targetContainer = this.node;
            }

            let newNode = cc.instantiate(this.prefabsList[i].prefab);
            this.prefabsList[i].targetContainer.addChild(newNode);

            if (this.prefabsList[i].name !== "") {
                newNode.name = this.prefabsList[i].name;
            }

            newNode.x = 0;
            newNode.y = 0;

        }


    },

});
