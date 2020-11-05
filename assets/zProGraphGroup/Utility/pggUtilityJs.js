// #region Prototype

if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/\${(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}
(function () {
    if (typeof Object.defineProperty === 'function') {
        try {
            Object.defineProperty(Array.prototype, 'sortBy', {value: sb});
        } catch (e) {
        }
    }
    if (!Array.prototype.sortBy) Array.prototype.sortBy = sb;

    function sb(f) {
        for (var i = this.length; i;) {
            var o = this[--i];
            this[i] = [].concat(f.call(o, o, i), o);
        }
        this.sort(function (a, b) {
            for (var i = 0, len = a.length; i < len; ++i) {
                if (a[i] != b[i]) return a[i] < b[i] ? -1 : 1;
            }
            return 0;
        });
        for (var i = this.length; i;) {
            this[--i] = this[i][this[i].length - 1];
        }
        return this;
    }
})();


Date.prototype.stdTimezoneOffset = function () {
    var jan = new Date(this.getFullYear(), 0, 1);
    var jul = new Date(this.getFullYear(), 6, 1);
    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
}
Date.prototype.printLocalTimezone = function () {
    if (typeof moment !== 'undefined') {
        var md = moment(this);
        return 'GMT' + md.format('Z');
    }
    return '';
}
Date.prototype.relativeDate = function () {
    if (typeof moment !== 'undefined') {
        moment.locale('en');
        var md = moment(this);
        return md.fromNow();
    }
    return '';
}
Date.prototype.epochConverterLocaleString = function (disabletz) {
    disabletz = disabletz || false;
    if (typeof moment === 'undefined') {
        return this.toDateString() + ' ' + this.toTimeString();
    }
    moment.locale(locale);
    var md = moment(this);
    if (!md.isValid()) {
        return 'Invalid input.';
    }
    var currentLocaleData = moment.localeData();
    var myLocaleData = moment.localeData(locale);
    var myFormat = ecFixFormat(myLocaleData.longDateFormat('LLLL'));
    if (md.format('SSS') != '000') {
        myFormat = myFormat.replace(':mm', ':mm:ss.SSS');
        myFormat = myFormat.replace('.mm', '.mm.ss.SSS');
    }
    else {
        myFormat = myFormat.replace(':mm', ':mm:ss');
        myFormat = myFormat.replace('.mm', '.mm.ss');
    }
    if (!disabletz) {
        myFormat += ' [GMT]Z';
    }
    var customDate = md.format(myFormat);
    return customDate;
}
Date.prototype.epochConverterGMTString = function () {
    if (typeof moment === 'undefined') {
        return this.toUTCString();
    }
    moment.locale('en');
    var md = moment(this);
    if (!md.isValid()) {
        return 'Invalid input.';
    }
    var myLocaleData = moment.localeData(locale);
    var myFormat = ecFixFormat(myLocaleData.longDateFormat('LLLL')).replace(/\[([^\]]*)\]/g, ' ');
    if (md.format('SSS') != '000') {
        myFormat = myFormat.replace(':mm', ':mm:ss.SSS');
    }
    else {
        myFormat = myFormat.replace(':mm', ':mm:ss');
    }
    return md.utc().format(myFormat);
}
String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

if (!String.prototype.padStart) {
    String.prototype.padStart = function padStart(targetLength, padString) {
        targetLength = targetLength >> 0; //truncate if number or convert non-number to 0;
        padString = String((typeof padString !== 'undefined' ? padString : ' '));
        if (this.length > targetLength) {
            return String(this);
        }
        else {
            targetLength = targetLength - this.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
            }
            return padString.slice(0, targetLength) + String(this);
        }
    };
};

String.prototype.copyToClipboard = function () {
    const el = document.createElement('textarea');  // Create a <textarea> element
    el.value = this;                                 // Set its value to the string that you want copied
    el.setAttribute('readonly', '');                // Make it readonly to be tamper-proof
    el.style.position = 'absolute';
    el.style.left = '-9999px';                      // Move outside the screen to make it invisible
    document.body.appendChild(el);                  // Append the <textarea> element to the HTML document
    const selected =
        document.getSelection().rangeCount > 0        // Check if there is any content selected previously
            ? document.getSelection().getRangeAt(0)     // Store selection if found
            : false;                                    // Mark as false to know no selection existed before
    el.select();                                    // Select the <textarea> content
    document.execCommand('copy');                   // Copy - only works as a result of a user action (e.g. click events)
    document.body.removeChild(el);                  // Remove the <textarea> element
    if (selected) {                                 // If a selection existed before copying
        document.getSelection().removeAllRanges();    // Unselect everything on the HTML document
        document.getSelection().addRange(selected);   // Restore the original selection
    }
};
Array.prototype.findAllIndexes2 = function (value) {
    return this.map((element, i) => element === value ? i : '').filter(String);
};

if (!Array.prototype.filterIndex) {
    Array.prototype.filterIndex = function (func, thisArg) {

        'use strict';
        if (!((typeof func === 'Function' || typeof func === 'function') && this))
            throw new TypeError();

        let len = this.length >>> 0,
            res = new Array(len), // preallocate array
            t = this, c = 0, i = -1;

        let kValue;
        if (thisArg === undefined) {
            while (++i !== len) {
                // checks to see if the key was set
                if (i in this) {
                    kValue = t[i]; // in case t is changed in callback
                    if (func(t[i], i, t)) {
                        res[c++] = i;
                    }
                }
            }
        }
        else {
            while (++i !== len) {
                // checks to see if the key was set
                if (i in this) {
                    kValue = t[i];
                    if (func.call(thisArg, t[i], i, t)) {
                        res[c++] = i;
                    }
                }
            }
        }

        res.length = c; // shrink down array to proper size
        return res;
    };
}
// #endregion