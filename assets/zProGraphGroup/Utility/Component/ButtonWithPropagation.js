/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

// const Component = require('./CCComponent');
// const GraySpriteState = require('../utils/gray-sprite-state');

/**
 * !#en Enum for transition type.
 * !#zh 过渡类型
 * @enum Button.Transition
 */
let Transition = cc.Enum({
    /**
     * !#en The none type.
     * !#zh 不做任何过渡
     * @property {Number} NONE
     */
    NONE: 0,

    /**
     * !#en The color type.
     * !#zh 颜色过渡
     * @property {Number} COLOR
     */
    COLOR: 1,

    /**
     * !#en The sprite type.
     * !#zh 精灵过渡
     * @property {Number} SPRITE
     */
    SPRITE: 2,
    /**
     * !#en The scale type
     * !#zh 缩放过渡
     * @property {Number} SCALE
     */
    SCALE: 3
});

const State = cc.Enum({
    NORMAL: 0,
    HOVER: 1,
    PRESSED: 2,
    DISABLED: 3,
});

/**
 * !#en
 * Button has 4 Transition types<br/>
 * When Button state changed:<br/>
 *  If Transition type is Button.Transition.NONE, Button will do nothing<br/>
 *  If Transition type is Button.Transition.COLOR, Button will change target's color<br/>
 *  If Transition type is Button.Transition.SPRITE, Button will change target Sprite's sprite<br/>
 *  If Transition type is Button.Transition.SCALE, Button will change target node's scale<br/>
 *
 * Button will trigger 5 events:<br/>
 *  Button.EVENT_TOUCH_DOWN<br/>
 *  Button.EVENT_TOUCH_UP<br/>
 *  Button.EVENT_HOVER_IN<br/>
 *  Button.EVENT_HOVER_MOVE<br/>
 *  Button.EVENT_HOVER_OUT<br/>
 *  User can get the current clicked node with 'event.target' from event object which is passed as parameter in the callback function of click event.
 *
 * !#zh
 * 按钮组件。可以被按下，或者点击。
 *
 * 按钮可以通过修改 Transition 来设置按钮状态过渡的方式：
 *
 *   - Button.Transition.NONE   // 不做任何过渡
 *   - Button.Transition.COLOR  // 进行颜色之间过渡
 *   - Button.Transition.SPRITE // 进行精灵之间过渡
 *   - Button.Transition.SCALE // 进行缩放过渡
 *
 * 按钮可以绑定事件（但是必须要在按钮的 Node 上才能绑定事件）：<br/>
 * 以下事件可以在全平台上都触发：
 *
 *   - cc.Node.EventType.TOUCH_START  // 按下时事件
 *   - cc.Node.EventType.TOUCH_Move   // 按住移动后事件
 *   - cc.Node.EventType.TOUCH_END    // 按下后松开后事件
 *   - cc.Node.EventType.TOUCH_CANCEL // 按下取消事件
 *
 * 以下事件只在 PC 平台上触发：
 *
 *   - cc.Node.EventType.MOUSE_DOWN  // 鼠标按下时事件
 *   - cc.Node.EventType.MOUSE_MOVE  // 鼠标按住移动后事件
 *   - cc.Node.EventType.MOUSE_ENTER // 鼠标进入目标事件
 *   - cc.Node.EventType.MOUSE_LEAVE // 鼠标离开目标事件
 *   - cc.Node.EventType.MOUSE_UP    // 鼠标松开事件
 *   - cc.Node.EventType.MOUSE_WHEEL // 鼠标滚轮事件
 *
 * 用户可以通过获取 __点击事件__ 回调函数的参数 event 的 target 属性获取当前点击对象。
 * @class Button
 * @extends Component
 * @uses GraySpriteState
 * @example
 *
 * // Add an event to the button.
 * button.node.on(cc.Node.EventType.TOUCH_START, function (event) {
 *     cc.log("This is a callback after the trigger event");
 * });

 * // You could also add a click event
 * //Note: In this way, you can't get the touch event info, so use it wisely.
 * button.node.on('click', function (button) {
 *    //The event is a custom event, you could get the Button component via first argument
 * })
 *
 */
cc.Class({
    extends: cc.Button,

    ctor () {
        this._pressed = false;
        this._hovered = false;
        this._fromColor = null;
        this._toColor = null;
        this._time = 0;
        this._transitionFinished = true;
        // init _originalScale in __preload()
        this._fromScale = cc.Vec2.ZERO;
        this._toScale = cc.Vec2.ZERO;
        this._originalScale = null;

        this._graySpriteMaterial = null;
        this._spriteMaterial = null;

        this._sprite = null;
    },

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.ui/ButtonWithPropagation',
        help: 'i18n:COMPONENT.help_url.button',
        inspector: 'packages://inspector/inspectors/comps/button.js',
        executeInEditMode: true
    },

    properties: {   },


    // touch event handler
    _onTouchBegan (event) {
        if (!this.interactable || !this.enabledInHierarchy) return;

        this._pressed = true;
        this._updateState();
        // event.stopPropagation();
    },

    _onTouchMove (event) {
        if (!this.interactable || !this.enabledInHierarchy || !this._pressed) return;
        // mobile phone will not emit _onMouseMoveOut,
        // so we have to do hit test when touch moving
        let touch = event.touch;
        let hit = this.node._hitTest(touch.getLocation());
        let target = this._getTarget();
        let originalScale = this._originalScale;

        if (this.transition === Transition.SCALE && originalScale) {
            if (hit) {
                this._fromScale.x = originalScale.x;
                this._fromScale.y = originalScale.y;
                this._toScale.x = originalScale.x * this.zoomScale;
                this._toScale.y = originalScale.y * this.zoomScale;
                this._transitionFinished = false;
            } else {
                this.time = 0;
                this._transitionFinished = true;
                target.setScale(originalScale.x, originalScale.y);
            }
        } else {
            let state;
            if (hit) {
                state = State.PRESSED;
            } else {
                state = State.NORMAL;
            }
            this._applyTransition(state);
        }
        // event.stopPropagation();
    },

    _onTouchEnded (event) {
        if (!this.interactable || !this.enabledInHierarchy) return;

        if (this._pressed) {
            cc.Component.EventHandler.emitEvents(this.clickEvents, event);
            this.node.emit('click', this);
        }
        this._pressed = false;
        this._updateState();
        // event.stopPropagation();
    },

});

// cc.ButtonWithPropagation = module.exports = ButtonWithPropagation;

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event click
 * @param {Event.EventCustom} event
 * @param {Button} button - The Button component.
 */
