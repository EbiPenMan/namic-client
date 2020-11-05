/* Resize a Node object to a size factor by modifying it's width/height property.
 * @warning This action doesn't support "reverse"
 * @class SizeTo
 * @extends ActionInterval
 * @param {Number} duration
 * @param {Number} width  width parameter
 * @param {Number} height height parameter
 * @return {ActionInterval}
 * @example
 * // example
 * // It resize to 100 in width and 200 in height
 * var actionTo = cc.sizeTo(2, 100, 200);
 */
cc.SizeTo = cc.Class({
    name: 'cc.SizeTo',
    extends: cc.ActionInterval,

    ctor: function (duration, width, height) {
        this._startWidth = 1;
        this._startHeight = 1;
        this._endWidth = 0;
        this._endHeight = 0;
        this._deltaX = 0;
        this._deltaY = 0;
        width !== undefined && cc.SizeTo.prototype.initWithDuration.call(this, duration, width, height);
    },

    /*
     * Initializes the action.
     * @param {Number} duration
     * @param {Number} width
     * @param {Number} height
     * @return {Boolean}
     */
    initWithDuration: function (duration, width, height) { //function overload here
        if (cc.ActionInterval.prototype.initWithDuration.call(this, duration)) {
            this._endWidth = width;
            this._endHeight = height;
            return true;
        }
        return false;
    },

    clone: function () {
        var action = new cc.SizeTo();
        this._cloneDecoration(action);
        action.initWithDuration(this._duration, this._endWidth, this._endHeight);
        return action;
    },

    startWithTarget: function (target) {
        cc.ActionInterval.prototype.startWithTarget.call(this, target);
        this._startWidth = target.width;
        this._startHeight = target.height;
        this._deltaX = this._endWidth - this._startWidth;
        this._deltaY = this._endHeight - this._startHeight;
    },

    update: function (dt) {
        dt = this._computeEaseTime(dt);
        if (this.target) {
            this.target.width = this._startWidth + this._deltaX * dt;
            this.target.height = this._startHeight + this._deltaY * dt;
        }
    }
});
/**
 * !#en Resize a Node object to a size factor by modifying it's width/height property.
 * !#zh 将节点大小缩放到指定的倍数。
 * @method sizeTo
 * @param {Number} duration
 * @param {Number} width  width parameter
 * @param {Number} height height parameter
 * @return {ActionInterval}
 * @example
 * // example
 * // It resize to 100 in width and 200 in height
 * var actionTo = cc.sizeTo(2, 100, 200);
 */
cc.sizeTo = function (duration, width, height) { //function overload
    return new cc.SizeTo(duration, width, height);
};
