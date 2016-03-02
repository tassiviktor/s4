/*
 * S4 - Small JS library for lightweight sites and projects
 * 
 * This library is based work of
 *      Denis Ciccale (ki.js)
 *      James Doyle (extend.ki.js) 
 *      Chris Davies (form-to-obj)
 *      ant thanks to http://youmightnotneedjquery.com for some prototypes ;)
 */

!function (b, c, d, e) {

    /*
     * init function (internal use)
     * a = selector, dom element or function
     */
    function i(a, x) {
        c.push.apply(this, a && a.nodeType ? [a] : '' + a === a ? (typeof x === "object" ? x : (x && b.querySelector(x) ? b.querySelector(x) : b)).querySelectorAll(a) : e)
    }

    /*
     * $ main function
     * a = css selector, dom object, or function
     * http://www.dustindiaz.com/smallest-domready-ever
     * returns instance or executes function on ready
     */
    s4 = function (a, x) {
        return /^f/.test(typeof a) ? /c/.test(b.readyState) ? a() : $(b).on('DOMContentLoaded', a) : new i(a, x)
    }
    $ = s4;
    /* set s4 prototype */
    $[d] = i[d] = $.fn = i.fn = {
        length: 0,
        on: function (a, b) {
            return this.each(function (c) {
                c.addEventListener(a, b)
            })
        },
        off: function (a, b) {
            return this.each(function (c) {
                c.removeEventListener(a, b)
            })
        },
        /* for testing should be removed later */
        ready: function (a) {
            return this.on("DOMContentLoaded", a);
        },
        each: function (a, b) {
            c.forEach.call(this, a, b)
            return this
        },
        is: function (a) {
            var m = (this[0].matches || this[0].matchesSelector || this[0].msMatchesSelector || this[0].mozMatchesSelector || this[0].webkitMatchesSelector || this[0].oMatchesSelector);
            if (m) {
                return m.call(this[0], a);
            } else {
                var n = this[0].parentNode.querySelectorAll(a);
                for (var i = n.length; i--; ) {
                    if (n[i] === this[0]) {
                        return true;
                    }
                }
                return false;
            }
        },
        parent: function () {
            return (this.length < 2) ? $(this[0].parentNode) : [];
        },
        hasClass: function (a) {
            return this[0].classList.contains(a);
        },
        addClass: function (a) {
            this.each(function (b) {
                b.classList.add(a);
            })
            return this
        },
        removeClass: function (a) {
            this.each(function (b) {
                b.classList.remove(a);
            })
            return this
        },
        css: function (a, b) {
            if (typeof (a) === 'object') {
                for (var prop in a) {
                    this.each(function (c) {
                        c.style[prop] = a[prop];
                    });
                }
                return this;
            } else {
                return b === []._ ? this[0].style[a] : this.each(function (c) {
                    c.style[a] = b;
                });
            }
        },
        hasAttr: function (a) {
            return this[0].hasAttribute(a);
        },
        attr: function (a, b) {
            return b === []._ ? this[0].getAttribute(a) : this.each(function (c) {
                (a in c) ? c[a] = b : c.setAttribute(a, b);
            })
            return this
        },
        removeAttr: function (a) {
            return this.each(function (b) {
                b.removeAttribute(a);
            });
        },
        data: function (a, b) {
            return this.attr("data-" + a, b);
        },
        aria: function (a, b) {
            return this.attr("aria-" + a, b);
        },
        hide: function () {
            this.each(function (b) {
                b.style.display = 'none';
            })
            return this
        },
        show: function () {
            this.each(function (b) {
                b.style.display = '';
            })
            return this
        },
        before: function (a) {
            this.each(function (b) {
                b.insertAdjacentHTML('beforebegin', a);
            })
            return this
        },
        append: function (a) {
            this.each(function (b) {
                b.innerHTML += a;
            })
            return this
        },
        after: function (a) {
            this.each(function (b) {
                b.insertAdjacentHTML('afterend', a);
            })
            return this
        },
        remove: function () {
            return this.each(function (b) {
                b.parentNode.removeChild(b);
            });
        },
        replaceWith: function (a) {
            this.each(function (b) {
                b.outerHTML = a;
            })
            return this
        },
        first: function () {
            return this[0];
        },
        last: function () {
            return this[this.length - 1];
        },
        get: function (a) {
            return this[a];
        },
        html: function (a) {
            return a === []._ ? this[0].innerHTML : this.each(function (c) {
                c.innerHTML = a;
            })
            return this
        },
        text: function (a) {
            return a === []._ ? this[0].textContent : this.each(function (b) {
                b.textContent = a;
            });
        },
        val: function (a) {
            var r = [];
            a === []._ ?
                    (this[0].options && this[0].getAttribute("multiple") ?
                            s4.each(this[0], function (x, y) {
                                (y.selected) ? r.push(y.value) : 0;
                            }) : r.push(this[0].value))
                    : this.each(function (b) {
                        b.options && b.getAttribute("multiple") ?
                                s4.each(b, function (x, y) {
                                    (a.indexOf(y.value) > -1) ? y.selected = true : y.selected = false;
                                })
                                :
                                b.value = a;
                    });
            return r;
        },
        serializeJSON: function () {
        },
        serialize: function () {

        },
        splice: c.splice
    };
    s4.now = function () {
        return Date.now();
    }
    s4.type = function (a) {
        return Object.prototype.toString.call(a).replace(/^\[object (.+)\]$/, '$1').toLowerCase();
    }
    s4.inArray = function (a, b) {
        return b.indexOf(a)
    }
    s4.isArray = function (a) {
        Array.isArray(a)
    }
    s4.map = function (a, b) {
        a.map(b) /*Untested*/
    }
    s4.trim = function (a) {
        return a.trim();
    }
    s4.parseJSON = function (a) {
        return JSON.parse(a)
    }
    s4.parseHTML = function (a) {
        var b = document.implementation.createHTMLDocument();
        b.body.innerHTML = a;
        return b.body.children
    }

    s4.each = function (arr, callback) {
        for (var i = 0, l = arr.length; i < l; ++i) {
            callback.call(arr[i], i, arr[i]);
        }
        return this;
    }
    s4.param = function (obj, prefix) {
        var str = [];
        for (var p in obj) {
            var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
            str.push(typeof v == "object" ? $.param(v, k) : encodeURIComponent(k) + "=" + encodeURIComponent(v));
        }
        return str.join("&");
    }
    s4.stop = function (e) {
        if (!e.preventDefault) {
            e.returnValue = false;
        } else {
            e.preventDefault();
        }
    }

    s4.ajax = function (a) {
    }

    s4.getJSON = function (a, b) {
    }
}(document, [], 'prototype');