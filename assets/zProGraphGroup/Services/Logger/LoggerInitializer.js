import pggGlobalManager from "../../pggGlobalManager";

let clsCategories_LoggerInitializer = cc.Class({
    name: 'clsCategories_LoggerInitializer',
    properties: {
        category: "",
        isActive: true,
        bgColor: {
            default: cc.Color.WHITE,
            visible: function () {
                return this.isActive;
            }
        },

        color: {
            default: cc.Color.BLACK,
            visible: function () {
                return this.isActive;
            }
        }

    },
});

let clsIsActive_LoggerInitializer = cc.Class({
    name: 'clsIsActive_LoggerInitializer',
    properties: {
        log: true,
        info: true,
        warn: true,
        error: true,
    },
});

let clsLoggerFields_LoggerInitializer = cc.Class({
    name: 'clsLoggerFields_LoggerInitializer',
    properties: {

        isActive: true,

        categories: {
            default: function () {
                return [new clsCategories_LoggerInitializer()];
            },
            type: [clsCategories_LoggerInitializer],
            visible: function () {
                return this.isActive;
            }
        },

        loggerType: {
            default: 0,
            type: ProGraphGroup.logger.enLoggerType,
            visible: function () {
                return this.isActive;
            }
        },

    },
});


cc.Class({
    extends: cc.Component,

    properties: {
        loggerFields: {
            default: function () {
                return new clsLoggerFields_LoggerInitializer();
            },
            type: clsLoggerFields_LoggerInitializer,
        },
    },

    onLoad() {
        window.ProGraphGroup.logger.init(this.loggerFields);
    },

});
