/*
 * S4 - Small JS library for lightweight sites and projects
 * 
 * This library is based work of
 *      Denis Ciccale (ki.js)
 *      James Doyle (extend.ki.js) 
 *      Chris Davies (form-to-obj)
 *      and thanks to http://youmightnotneedjquery.com for some prototypes ;)
 */
!function (b, c, d, e) {

    /*
     * init function (internal use)
     * a = selector, dom element or function
     */


    function i(a, x) {
        c.push.apply(this, a && a.nodeType ? [a] : '' + a === a ? (x && typeof x.querySelectorAll == "function") ? x : (typeof x === 'string' && /^#/.test(x) ? b.getElementById(x.substr(1)) : b).querySelectorAll(a) : e)
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
    // set ki prototype
    $[d] = i[d] = $.fn = i.fn = {
        // default length
        length: 0,
        splice: c.splice,
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
        each: function (a, b) {
            c.forEach.call(this, a, b)
            return this
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
            if ($.type(a) === 'object') {
                for (var prop in a) {
                    this.each(function (c) {
                        c.style[prop] = a[prop]
                    })
                }
                return this
            } else {
                return b === []._ ? this[0].style[a] : this.each(function (c) {
                    c.style[a] = b
                })
            }
        },
        hasAttr: function (a) {
            return this[0].hasAttribute(a)
        },
        attr: function (a, b) {
            return b === []._ ? this[0].getAttribute(a) : this.each(function (c) {
                (a in c) ? c[a] = b : c.setAttribute(a, b)
            })
        },
        removeAttr: function (a) {
            return this.each(function (b) {
                b.removeAttribute(a)
            });
        },
        data: function (a, b) {
            return this.attr("data-" + a, b)
        },
        aria: function (a, b) {
            return this.attr("aria-" + a, b)
        },
        hide: function () {
            return this.each(function (b) {
                b.style.display = 'none'
            })
        },
        show: function () {
            return this.each(function (b) {
                b.style.display = ''
            })
        },
        before: function (a) {
            return this.each(function (b) {
                b.insertAdjacentHTML('beforebegin', a)
            })
        },
        append: function (a) {
            return this.each(function (b) {
                b.appendChild(a[0]);
            })
        },
        after: function (a) {
            return this.each(function (b) {
                b.insertAdjacentHTML('afterend', a)
            })
        },
        remove: function () {
            return this.each(function (b) {
                b.parentNode.removeChild(b)
            });
        },
        replaceWith: function (a) {
            return this.each(function (b) {
                b.outerHTML = a
            })
        },
        first: function () {
            return this[0]
        },
        last: function () {
            return this[this.length - 1];
        },
        get: function (a) {
            return this[a];
        },
        html: function (a) {
            return a === []._ ? this[0].innerHTML : this.each(function (c) {
                c.innerHTML = a
            })
        },
        text: function (a) {
            return a === []._ ? this[0].textContent : this.each(function (b) {
                b.textContent = a
            });
        },
        val: function (a) {
            var r = [];
            a === []._ ?
                    (this[0].options && this[0].getAttribute("multiple") ?
                            $.each(this[0], function (x, y) {
                                (y.selected) ? r.push(y.value) : 0;
                            }) : r.push(this[0].value))
                    : this.each(function (b) {
                        b.options && b.getAttribute("multiple") ?
                                $.each(b, function (x, y) {
                                    (a.indexOf(y.value) > -1) ? y.selected = true : y.selected = false;
                                })
                                :
                                b.value = a;
                    });
            return r;
        },
        serializeArray: function () {
            var q = [];
            this.each(function (c, d) {
                $("input, select, checkbox, radio, textarea, div[contenteditable='true']", c).each(function (x) {
                    if (!x.disabled && x.type !== 'file') {
                        if (x.name) {
                            if (x.nodeName == "INPUT" && ['checkbox', 'radio'].indexOf(x.type) > -1 && x.checked) {
                                q.push({name: x.name, value: x.value});
                            } else if (x.nodeName == "SELECT" && x.type == 'select-multiple') {
                                for (var j = x.options.length - 1; j >= 0; j--)
                                    if (x.options[j].selected)
                                        q.push({name: x.name, value: x.options[j].value});
                            } else {
                                q.push({name: x.name, value: x.value});
                            }
                        } else if (x.nodeName == 'DIV' && x.getAttribute('contenteditable')) {
                            q.push({name: x.getAttribute('data-name'), value: x.innerHTML});
                        }
                    }
                })
            })
            return q;
        },
        serialize: function () {
            return bP(this.serializeArray());
        },
        serializeJSON: function () {
            return JSON.stringify(this.serializeArray());
        },
        load: function (a, b, c) {

        },
    }
    eUC = encodeURIComponent;
    /*Buildparams*/
    function bP(obj, pr) {
        var str = [];
        if ($.isArray(obj)) {
            $.each(obj, function (o, a) {
                var k = pr ? pr + "[" + a['name'] + "]" : a['name'], v = a['value'];
                str.push($.type(v) == "object" ? $.bP(v, k) : eUC(k) + "=" + eUC(v));
            });
        } else if ($.type(obj) == "object") {
            for (var p in obj) {
                var k = pr ? pr + "[" + p + "]" : p, v = obj[p];
                str.push($.type(v) == "object" ? $.bP(v, k) : eUC(k) + "=" + eUC(v));
            }
        } else {
            return obj;
        }
        return str.join("&");
    }
    $.now = function () {
        return Date.now();
    }
    // typeof null returns “object”
    $.type = function (a) {
        return ({}).toString.call(a).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
    }
    $.inArray = function (a, b) {
        return b.indexOf(a)
    }
    $.isArray = function (a) {
        return Array.isArray(a)
    }
    $.map = function (a, b) {
        return a.map(b) /*Untested*/
    }
    $.trim = function (a) {
        return a.trim();
    }
    $.parseJSON = function (a) {
        return JSON.parse(a)
    }
    $.parseHTML = function (a) {
        var b = document.implementation.createHTMLDocument();
        b.body.innerHTML = a;
        return b.body.children
    }

    $.each = function (arr, callback) {
        for (var i = 0, l = arr.length; i < l; ++i) {
            callback.call(arr[i], i, arr[i]);
        }
        return this;
    }

    $.param = function (o) {
        return bP(o);
    }
    $.stop = function (e) {
        if (!e.preventDefault) {
            e.returnValue = false;
        } else {
            e.preventDefault();
        }
    }
    $.createXHR = function () {
        return new window.XMLHttpRequest();
    }
    $.ajax = function (a) {
        var ct = "Content-Type"
        var f = "function"
        function e(r, s, rt) {
            if ($.type(a.error) == f)
                a.error(r, s, rt);
            c(r, s);
        }
        function c(r, s) {
            if ($.type(a.complete) == f)
                a.complete(r, s);
        }
        function s(rt, s, r) {
            if ((a.dataType && a.dataType == "json") || (!a.dataType && r.getResponseHeader('Content-Type').indexOf("/json") > -1)) {
                try {
                    x = JSON.parse(rt);
                    rt = x;
                } catch (exception) {
                    e(wr, "parsererror", rt);
                    return;
                }
            }
            if ($.type(a.success) == f) {
                a.success(rt, s, r);
            }
            c(r, s);
        }
        if (!a.data)
            a.data = null;
        if (!a.headers)
            a.headers = {};

        var d = a.data;
        var g = (a.type && ["GET", "POST"].indexOf(a.type) > -1) ? a.type : 'GET';
        var r = $.createXHR();

        dct = 'application/x-www-form-urlencoded; charset=UTF-8';

        (!a.headers[ct]) && g !== "GET" ? a.headers[ct] = ((a.contentType) ? a.contentType : dct) : null;

        if (!a.processData || a.processData !== false) {
            if (!a.headers[ct] || a.headers[ct].indexOf("x-www-form-urlencoded") > -1) {
                d = $.param(a.data);
            }
        }

        r.open(g, a.url + (g == "GET" && d ? "?" + d : ""), true, a.username, a.password);
        r.onload = function () {
            if (a.statusCode && $.type(a.statusCode[r.status]) == f)
                a.statusCode[r.status]();
            if (r.status === 1223) {
                r.status = 204;
            }
            (r.status >= 200 && r.status < 400) ?
                    s(r.responseText, r.status == 304 ? "notmodified" : "success", r) :
                    e(r, "error", r.responseText);

        }

        if (a.timeout && a.timeout > 0) {
            setTimeout(function () {
                if (r.readyState < 4) {
                    r.abort();
                    e(r, "timeout");
                }
            }, a.timeout);
        }

        r.onerror = function () {
            e(r, "error", r.responseText);
        }

        a.headers["X-Requested-With"] = 'XMLHttpRequest';
        if ($.type(a.beforeSend) == f)
            a.beforeSend(r, a);
        Object.keys(a.headers).forEach(function (k) {
            r.setRequestHeader(k, a.headers[k]);
        });

        (g == "GET") ? r.send() : r.send(d);

        return r;
    }
    $.get = function (a, b, s, d) {
        $.ajax({url: a, data: b, success: s, dataType: d});
    }
    $.post = function (a, b, s, d) {
        $.ajax({type: "POST", url: a, data: b, success: s, dataType: d});
    }
}(document, [], 'prototype');
