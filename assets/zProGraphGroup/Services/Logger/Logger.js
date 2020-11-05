if (window.ProGraphGroup === undefined)
    window.ProGraphGroup = {};

window.ProGraphGroup.logger = {

    enLoggerType: cc.Enum({
        Console: 0,
        CC: 1,
    }),

    isActive: true,

    loggerFields: null,

    _ccLog: cc.log,
    _ccError: cc.error,
    _ccWarn: cc.warn,
    //_ccInfo: cc.info,

    _conLog: console.log,
    _conError: console.error,
    _conWarn: console.warn,
    _conInfo: console.info,
    _conTable: console.table,

    _self: this,

    init(loggerFields) {

        if (!loggerFields)
            return;

        this.isActive = loggerFields.isActive;
        this.loggerFields = loggerFields;

        let self = this;

        if (!this.isActive) {
            cc.log = function () {
            };
            cc.error = function () {
            };
            cc.warn = function () {
            };

            console.log = cc.log;
            console.error = cc.error;
            console.warn = cc.warn;
        }
    },

    log: function (category, context, msg) {


        if (!this.isActive)
            return;

        if (msg == null)
            return;

        let catRes = null;
        let msgRes = null;
        let contextRes = null;
        let bgColorRes = null;
        let colorRes = null;


        if (category != null) {
            let indexCat = this.loggerFields.categories.findIndex(x => x.category === category);
            if (indexCat !== -1) {
                if (!this.loggerFields.categories[indexCat].isActive)
                    return;

                catRes = category;
                bgColorRes = this.loggerFields.categories[indexCat].bgColor;
                colorRes = this.loggerFields.categories[indexCat].color;
            } else {
                catRes = category;
                bgColorRes = "green";
                colorRes = "lightgreen";
            }
        } else {
            catRes = "Default";
            bgColorRes = "green";
            colorRes = "lightgreen";
        }

        if (context) {
            if (context.name) {
                contextRes = context.name;
            } else {
                contextRes = context.toString();
            }
        } else {
            contextRes = "null"
        }

        let headertext = "";


        for (let i = 2; i < arguments.length; i++) {

            if (this.loggerFields.loggerType === this.enLoggerType.Console) {

                if (i === 2) {


                    let addStacker = 0;

                    if (arguments[2] === "addStacker")
                        addStacker += 1;

                    headertext = `%c--------------- [${catRes}] - [${contextRes}] ---------------`;

                    // console.groupCollapsed(headertext, `background: ${bgColorRes}; color: ${colorRes}; display: block;`);

                    this._conLog(headertext, `background: ${bgColorRes}; color: ${colorRes}; display: block;`);

                    let err = new Error();
                    let ref = err.stack.split("\n")[2 + addStacker];
                    ref = ref.substring(ref.lastIndexOf("(") + 1, ref.lastIndexOf(")"));
                    this._conLog(`%c${ref}`, `background: ${bgColorRes}; color: ${colorRes}; display: block;`);


                    // var tbl_heaer = {
                    //     Category: { data: contextRes },
                    //     Context: { data: catRes },
                    //     Stack: { data: this._conLog(ref) }
                    // };
                    // console.table(tbl_heaer);


                }

                if (arguments[i] === "addStacker")
                    continue;

                if (typeof arguments[i] === "object") {
                    this._conLog(arguments[i]);
                } else {
                    msgRes = `%c${arguments[i]}`;
                    this._conLog(msgRes, `font-weight: bolder; background: ${colorRes}; color: ${bgColorRes}; display: block;`);
                }

                if (i === arguments.length - 1) {
                    let footer = "";
                    for (let j = 0; j < headertext.length - 2; j++) {
                        footer += "-";
                    }
                    this._conLog(`%c${footer}`, `background: ${bgColorRes}; color: ${colorRes}; display: block;`);
                }

            } else {

                if (i === 2) {

                    let addStacker = 0;

                    if (arguments[2] === "addStacker")
                        addStacker += 1;

                    headertext = `%c--------------- [${catRes}] - [${contextRes}] ---------------`;
                    this._ccLog(headertext, `background: ${bgColorRes}; color: ${colorRes}; display: block;`);

                    let err = new Error();
                    let ref = err.stack.split("\n")[2 + addStacker];
                    ref = ref.substring(ref.lastIndexOf("(") + 1, ref.lastIndexOf(")"));
                    this._ccLog(`%c${ref}`, `background: ${bgColorRes}; color: ${colorRes}; display: block;`);
                }

                if (arguments[i] === "addStacker")
                    continue;

                if (typeof arguments[i] === "object") {
                    this._ccLog(arguments[i]);
                } else {
                    msgRes = `%c${arguments[i]}`;
                    this._ccLog(msgRes, `font-weight: bolder;background: ${colorRes}; color: ${bgColorRes}; display: block;`);
                }

                if (i === arguments.length - 1) {
                    let footer = "";
                    for (let j = 0; j < headertext.length - 2; j++) {
                        footer += "-";
                    }
                    this._ccLog(`%c${footer}`, `background: ${bgColorRes}; color: ${colorRes}; display: block;`);
                    // console.groupEnd();
                }
            }
        }

    },


    LogT: /** @class */ (function () {

        function LogT(catName, color, bgColor) {

            this.logger = window.ProGraphGroup.logger;

            this.rows = [];
            this.count = 0;
            this.isActive = null;
            this.isGrouped = false;
            this.isGroupCollapsed = false;
            this.isNoStacker = false;
            this.isTable = true;
            this.title = "";

            if (catName != null) {
                let indexCat = this.logger.loggerFields.categories.findIndex(x => x.category === catName);
                if (indexCat !== -1) {
                    this.isActive = this.logger.loggerFields.categories[indexCat].isActive;

                    if (color == null)
                        color = this.logger.loggerFields.categories[indexCat].color;
                    if (bgColor == null)
                        bgColor = this.logger.loggerFields.categories[indexCat].bgColor;
                }
            } else {
                catName = "Default";
            }

            this.category = catName;


            if (color == null)
                color = "Green";
            if (bgColor == null)
                bgColor = "White";

            this.color = color;
            this.bgColor = bgColor;


        }

        LogT.prototype.setParam = function (/*  arguments */) {

            if (arguments.length === 1) {
                this.rows.push([arguments[0]]);
            } else {
                let row = [];
                for (let i = 0; i < arguments.length; i++) {
                    row.push(arguments[i]);
                }
                this.rows.push(row);
            }

            this.count++;
            return this;
        };

        LogT.prototype.setTitle = function (title) {
            this.title = title;
            return this;
        };

        LogT.prototype.group = function (isCollapsed) {

            if (isCollapsed == null)
                this.isGrouped = true;
            else
                this.isGroupCollapsed = isCollapsed;

            return this;
        };

        LogT.prototype.noStacker = function () {
            this.isNoStacker = true;
            return this;
        };

        LogT.prototype.noTable = function () {
            this.isTable = false;
            return this;
        };

        LogT.prototype.show = function (addStacker) {

            if (!this.logger.isActive)
                return;
            else if (this.isActive != null && !this.isActive) {
                return;
            }

            if (this.title !== "")
                this.category += ` - [${this.title}]`;

            if (cc.sys.isMobile) {
                this.logger._conLog(this.category, this.rows);
                return;
            }

            if (this.isGrouped)
                console.group("%c" + this.category, `background: ${this.bgColor};font-size: 15px;font-weight: 600; color: ${this.color}; padding: 5px;width: auto;display: block;`);
            else if (this.isGroupCollapsed) {
                console.groupCollapsed("%c" + this.category, `background: ${this.bgColor};font-size: 15px;font-weight: 600; color: ${this.color}; padding: 5px;width: auto;display: block;`);
            }

            if (!this.isNoStacker) {
                if (addStacker == null)
                    addStacker = 0;
                let err = new Error();
                let ref = err.stack.split("\n")[2 + addStacker];
                // ref = " " + ref.substring(ref.lastIndexOf("(") + 1, ref.lastIndexOf(")"));
                let stackerColor = this.color;
                if (stackerColor === "white" || stackerColor === "White" || stackerColor === "WHITE")
                    stackerColor = this.bgColor;
                this.logger._conLog(`%c Stacker:`, `color: ${stackerColor}; font-size: 15px;font-weight: 600;`, ref);
            }

            if (this.isTable)
                this.logger._conTable(this.rows);
            else {

                let rowObj = {};

                for (let jj = 0; jj < this.rows.length; jj++) {
                    rowObj[jj] = {};
                    for (let kk = 0; kk < this.rows[jj].length; kk++) {
                        rowObj[jj][kk] = this.rows[jj][kk];
                    }
                }

                this.logger._conLog(rowObj);
            }


            if (this.isGrouped || this.isGroupCollapsed)
                console.groupEnd();
        };

        LogT.prototype.end = function () {
            return this;
        };

        return LogT;

    }()),

    WarnT: /** @class */ (function () {

        function WarnT(catName, color, bgColor) {

            this.logger = window.ProGraphGroup.logger;

            this.rows = [];
            this.count = 0;
            this.isActive = null;
            this.isGrouped = false;
            this.isGroupCollapsed = false;
            this.isNoStacker = false;
            this.isTable = true;
            this.title = "";

            if (catName != null) {
                let indexCat = this.logger.loggerFields.categories.findIndex(x => x.category === catName);
                if (indexCat !== -1) {
                    this.isActive = this.logger.loggerFields.categories[indexCat].isActive;

                    if (color == null)
                        color = this.logger.loggerFields.categories[indexCat].color;
                    if (bgColor == null)
                        bgColor = this.logger.loggerFields.categories[indexCat].bgColor;
                }
            } else {
                catName = "Default";
            }

            this.category = catName;


            if (color == null)
                color = "Orange";
            if (bgColor == null)
                bgColor = "White";

            this.color = color;
            this.bgColor = bgColor;


        }

        WarnT.prototype.setParam = function (/*  arguments */) {

            if (arguments.length === 1) {
                this.rows.push([arguments[0]]);
            } else {
                let row = [];
                for (let i = 0; i < arguments.length; i++) {
                    row.push(arguments[i]);
                }
                this.rows.push(row);
            }

            this.count++;
            return this;
        };

        WarnT.prototype.setTitle = function (title) {
            this.title = title;
            return this;
        };

        WarnT.prototype.group = function (isCollapsed) {

            if (isCollapsed == null)
                this.isGrouped = true;
            else
                this.isGroupCollapsed = isCollapsed;

            return this;
        };

        WarnT.prototype.noStacker = function () {
            this.isNoStacker = true;
            return this;
        };

        WarnT.prototype.noTable = function () {
            this.isTable = false;
            return this;
        };

        WarnT.prototype.show = function (addStacker) {

            if (!this.logger.isActive)
                return;
            else if (this.isActive != null && !this.isActive) {
                return;
            }

            if (this.title !== "")
                this.category += ` - [${this.title}]`;

            if (this.isGrouped)
                console.group("%c" + this.category, `background: ${this.bgColor};font-size: 15px;font-weight: 600; color: ${this.color}; padding: 5px;width: auto;display: block;`);
            else if (this.isGroupCollapsed) {
                console.groupCollapsed("%c" + this.category, `background: ${this.bgColor};font-size: 15px;font-weight: 600; color: ${this.color}; padding: 5px;width: auto;display: block;`);
            }

            if (!this.isNoStacker) {
                if (addStacker == null)
                    addStacker = 0;
                let err = new Error();
                let ref = err.stack.split("\n")[2 + addStacker];
                // ref = " " + ref.substring(ref.lastIndexOf("(") + 1, ref.lastIndexOf(")"));
                let stackerColor = this.color;
                if (stackerColor === "white" || stackerColor === "White" || stackerColor === "WHITE")
                    stackerColor = this.bgColor;
                this.logger._conWarn(`%c Stacker:`, `color: ${stackerColor}; font-size: 15px;font-weight: 600;`, ref);
            }

            if (this.isTable)
                this.logger._conTable(this.rows);
            else {

                let rowObj = {};

                for (let jj = 0; jj < this.rows.length; jj++) {
                    rowObj[jj] = {};
                    for (let kk = 0; kk < this.rows[jj].length; kk++) {
                        rowObj[jj][kk] = this.rows[jj][kk];
                    }
                }

                this.logger._conWarn(rowObj);
            }


            if (this.isGrouped || this.isGroupCollapsed)
                console.groupEnd();
        };

        WarnT.prototype.end = function () {
            return this;
        };
        return WarnT;

    }()),

    ErrorT: /** @class */ (function () {

        function ErrorT(catName, color, bgColor) {

            this.logger = window.ProGraphGroup.logger;

            this.rows = [];
            this.count = 0;
            this.isActive = null;
            this.isGrouped = false;
            this.isGroupCollapsed = false;
            this.isNoStacker = false;
            this.isTable = true;
            this.title = "";

            if (catName != null) {
                let indexCat = this.logger.loggerFields.categories.findIndex(x => x.category === catName);
                if (indexCat !== -1) {
                    this.isActive = this.logger.loggerFields.categories[indexCat].isActive;

                    if (color == null)
                        color = this.logger.loggerFields.categories[indexCat].color;
                    if (bgColor == null)
                        bgColor = this.logger.loggerFields.categories[indexCat].bgColor;
                }
            } else {
                catName = "Default";
            }

            this.category = catName;


            if (color == null)
                color = "Red";
            if (bgColor == null)
                bgColor = "White";

            this.color = color;
            this.bgColor = bgColor;


        }

        ErrorT.prototype.setParam = function (/*  arguments */) {

            if (arguments.length === 1) {
                this.rows.push([arguments[0]]);
            } else {
                let row = [];
                for (let i = 0; i < arguments.length; i++) {
                    row.push(arguments[i]);
                }
                this.rows.push(row);
            }

            this.count++;
            return this;
        };

        ErrorT.prototype.setTitle = function (title) {
            this.title = title;
            return this;
        };

        ErrorT.prototype.group = function (isCollapsed) {

            if (isCollapsed == null)
                this.isGrouped = true;
            else
                this.isGroupCollapsed = isCollapsed;

            return this;
        };

        ErrorT.prototype.noStacker = function () {
            this.isNoStacker = true;
            return this;
        };

        ErrorT.prototype.noTable = function () {
            this.isTable = false;
            return this;
        };

        ErrorT.prototype.show = function (addStacker) {

            if (!this.logger.isActive)
                return;
            else if (this.isActive != null && !this.isActive) {
                return;
            }

            if (this.title !== "")
                this.category += ` - [${this.title}]`;

            if (this.isGrouped)
                console.group("%c" + this.category, `background: ${this.bgColor};font-size: 15px;font-weight: 600; color: ${this.color}; padding: 5px;width: auto;display: block;`);
            else if (this.isGroupCollapsed) {
                console.groupCollapsed("%c" + this.category, `background: ${this.bgColor};font-size: 15px;font-weight: 600; color: ${this.color}; padding: 5px;width: auto;display: block;`);
            }

            if (!this.isNoStacker) {
                if (addStacker == null)
                    addStacker = 0;
                let err = new Error();
                let ref = err.stack.split("\n")[2 + addStacker];
                // ref = " " + ref.substring(ref.lastIndexOf("(") + 1, ref.lastIndexOf(")"));
                let stackerColor = this.color;
                if (stackerColor === "white" || stackerColor === "White" || stackerColor === "WHITE")
                    stackerColor = this.bgColor;
                this.logger._conError(`%c Stacker:`, `color: ${stackerColor}; font-size: 15px;font-weight: 600;`, ref);
            }

            if (this.isTable)
                this.logger._conTable(this.rows);
            else {

                let rowObj = {};

                for (let jj = 0; jj < this.rows.length; jj++) {
                    rowObj[jj] = {};
                    for (let kk = 0; kk < this.rows[jj].length; kk++) {
                        rowObj[jj][kk] = this.rows[jj][kk];
                    }
                }

                this.logger._conError(rowObj);
            }


            if (this.isGrouped || this.isGroupCollapsed)
                console.groupEnd();
        };

        ErrorT.prototype.end = function () {
            return this;
        };

        return ErrorT;

    }()),


};
