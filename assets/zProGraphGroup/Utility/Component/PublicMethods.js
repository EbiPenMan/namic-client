cc.Class({
    extends: cc.Component,

    properties: {
        delayTime: 0,
        destroyNode: cc.Node,

    },

    destroyParentNodeByLevel: function (event, level) {

    },

    destroySelectedNode: function () {
        this._destroyNode(this.destroyNode);
    },

    destroyMyNode: function () {
        this._destroyNode(this.node);
    },

    destroyOtherNode: function (event, node) {
        this._destroyNode(this.destroyNode);
    },

    _destroyNode: function (node) {

        let self = this;

        let Action = cc.sequence(
            cc.delayTime(self.delayTime),
            cc.callFunc(function () {
                node.destroy();
            }),
        );
        this.effectTaget.runAction(Action);

    },

});
