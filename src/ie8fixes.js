'use strict';
// added: bind, trim, indexOf, forEach, map, filter, every, some, addEventListener, removeEventListener, 
// dispatchEvent, timeStamp, cancelable, bubbles, target, and currentTarget
// preventDefault(), stopPropagation(), stopImmediatePropagation() working with both synthetic and real events
// textContent, firstElementChild, lastElementChild, previousElementSibling, nextElementSibling, 
// childElementCount, document.defaultView, window.getComputedStyle, insertAdjacentHTML, classlist

// Add ECMA262-5 method binding if not supported natively
//
if (!('bind' in Function.prototype)) {
    Function.prototype.bind = function (owner) {
        var that = this;
        if (arguments.length <= 1) {
            return function () {
                return that.apply(owner, arguments);
            };
        } else {
            var args = Array.prototype.slice.call(arguments, 1);
            return function () {
                return that.apply(owner, arguments.length === 0 ? args : args.concat(Array.prototype.slice.call(arguments)));
            };
        }
    };
}

// Add ECMA262-5 string trim if not supported natively
//
if (!('trim' in String.prototype)) {
    String.prototype.trim = function () {
        return this.replace(/^\s+/, '').replace(/\s+$/, '');
    };
}

// Add ECMA262-5 Array methods if not supported natively
//
if (!('indexOf' in Array.prototype)) {
    Array.prototype.indexOf = function (find, i ) {
        if (i === undefined)
            i = 0;
        if (i < 0)
            i += this.length;
        if (i < 0)
            i = 0;
        for (var n = this.length; i < n; i++)
            if (i in this && this[i] === find)
                return i;
        return -1;
    };
}
/*
if (!('lastIndexOf' in Array.prototype)) {
    Array.prototype.lastIndexOf = function (find, i ) {
        if (i === undefined)
            i = this.length - 1;
        if (i < 0)
            i += this.length;
        if (i > this.length - 1)
            i = this.length - 1;
        for (i++; i-- > 0; ) 
            if (i in this && this[i] === find)
                return i;
        return -1;
    };
}
*/

if (!('forEach' in Array.prototype)) {
    Array.prototype.forEach = function (action, that /*opt*/) {
        for (var i = 0, n = this.length; i < n; i++)
            if (i in this)
                action.call(that, this[i], i, this);
    };
}
if (!('map' in Array.prototype)) {
    Array.prototype.map = function (mapper, that /*opt*/) {
        var other = new Array(this.length);
        for (var i = 0, n = this.length; i < n; i++)
            if (i in this)
                other[i] = mapper.call(that, this[i], i, this);
        return other;
    };
}
if (!('filter' in Array.prototype)) {
    Array.prototype.filter = function (filter, that /*opt*/) {
        var other = [], v;
        for (var i = 0, n = this.length; i < n; i++)
            if (i in this && filter.call(that, v = this[i], i, this))
                other.push(v);
        return other;
    };
}
if (!('every' in Array.prototype)) {
    Array.prototype.every = function (tester, that /*opt*/) {
        for (var i = 0, n = this.length; i < n; i++)
            if (i in this && !tester.call(that, this[i], i, this))
                return false;
        return true;
    };
}
if (!('some' in Array.prototype)) {
    Array.prototype.some = function (tester, that /*opt*/) {
        for (var i = 0, n = this.length; i < n; i++)
            if (i in this && tester.call(that, this[i], i, this))
                return true;
        return false;
    };
}

/*!
Copyright (C) 2013-2015 by WebReflection. MIT Licence
*/
(function(window){
  /*! (C) WebReflection Mit Style License */
  if (document.createEvent) return;
  var
    DUNNOABOUTDOMLOADED = true,
    READYEVENTDISPATCHED = false,
    ONREADYSTATECHANGE = 'onreadystatechange',
    DOMCONTENTLOADED = 'DOMContentLoaded',
    SECRET = '__IE8__' + Math.random(),
    // Object = window.Object,
    defineProperty = Object.defineProperty ||
    // just in case ...
    function (object, property, descriptor) {
      object[property] = descriptor.value;
    },
    defineProperties = Object.defineProperties ||
    // IE8 implemented defineProperty but not the plural...
    function (object, descriptors) {
      for(var key in descriptors) {
        if (hasOwnProperty.call(descriptors, key)) {
          try {
            defineProperty(object, key, descriptors[key]);
          } catch(o_O) {
            if (window.console) {
              console.log(key + ' failed on object:', object, o_O.message);
            }
          }
        }
      }
    },
    getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor,
    hasOwnProperty = Object.prototype.hasOwnProperty,
    // here IE7 will break like a charm
    ElementPrototype = window.Element.prototype,
    TextPrototype = window.Text.prototype,
    // none of above native constructors exist/are exposed
    possiblyNativeEvent = /^[a-z]+$/,
    // ^ actually could probably be just /^[a-z]+$/
    readyStateOK = /loaded|complete/,
    types = {},
    div = document.createElement('div'),
    html = document.documentElement,
    removeAttribute = html.removeAttribute,
    setAttribute = html.setAttribute
  ;

  function commonEventLoop(currentTarget, e, $handlers, synthetic) {
    for(var
      continuePropagation,
      handlers = $handlers.slice(),
      evt = enrich(e, currentTarget),
      i = 0, length = handlers.length; i < length; i++
    ) {
      handler = handlers[i];
      if (typeof handler === 'object') {
        if (typeof handler.handleEvent === 'function') {
          handler.handleEvent(evt);
        }
      } else {
        handler.call(currentTarget, evt);
      }
      if (evt.stoppedImmediatePropagation) break;
    }
    continuePropagation = !evt.stoppedPropagation;
    /*
    if (continuePropagation && !synthetic && !live(currentTarget)) {
      evt.cancelBubble = true;
    }
    */
    return (
      synthetic &&
      continuePropagation &&
      currentTarget.parentNode
    ) ?
      currentTarget.parentNode.dispatchEvent(evt) :
      !evt.defaultPrevented
    ;
  }

  function commonDescriptor(get, set) {
    return {
      // if you try with enumerable: true
      // IE8 will miserably fail
      configurable: true,
      get: get,
      set: set
    };
  }

  function commonTextContent(protoDest, protoSource, property) {
    var descriptor = getOwnPropertyDescriptor(
      protoSource || protoDest, property
    );
    defineProperty(
      protoDest,
      'textContent',
      commonDescriptor(
        function () {
          return descriptor.get.call(this);
        },
        function (textContent) {
          descriptor.set.call(this, textContent);
        }
      )
    );
  }

  function enrich(e, currentTarget) {
    e.currentTarget = currentTarget;
    e.eventPhase = (
      // AT_TARGET : BUBBLING_PHASE
      e.target === e.currentTarget ? 2 : 3
    );
    return e;
  }

  function find(array, value) {
    var i = array.length;
    while(i-- && array[i] !== value);
    return i;
  }

  function getTextContent() {
    if (this.tagName === 'BR') return '\n';
    var
      textNode = this.firstChild,
      arrayContent = []
    ;
    while(textNode) {
      if (textNode.nodeType !== 8 && textNode.nodeType !== 7) {
        arrayContent.push(textNode.textContent);
      }
      textNode = textNode.nextSibling;
    }
    return arrayContent.join('');
  }

  function live(self) {
    return self.nodeType !== 9 && html.contains(self);
  }

  function onkeyup(e) {
    var evt = document.createEvent('Event');
    evt.initEvent('input', true, true);
    (e.srcElement || e.fromElement || document).dispatchEvent(evt);
  }

  function onReadyState(e) {
    if (!READYEVENTDISPATCHED && readyStateOK.test(
      document.readyState
    )) {
      READYEVENTDISPATCHED = !READYEVENTDISPATCHED;
      document.detachEvent(ONREADYSTATECHANGE, onReadyState);
      e = document.createEvent('Event');
      e.initEvent(DOMCONTENTLOADED, true, true);
      document.dispatchEvent(e);
    }
  }

  function setTextContent(textContent) {
    var node;
    while ((node = this.lastChild)) {
      this.removeChild(node);
    }
    if (textContent != null) {
      this.appendChild(document.createTextNode(textContent));
    }
  }

  function verify(self, e) {
    if (!e) {
      e = window.event;
    }
    if (!e.target) {
      e.target = e.srcElement || e.fromElement || document;
    }
    if (!e.timeStamp) {
      e.timeStamp = (new Date).getTime();
    }
    return e;
  }

  // normalized textContent for:
  //  comment, script, style, text, title
  commonTextContent(
    window.HTMLCommentElement.prototype,
    ElementPrototype,
    'nodeValue'
  );

  commonTextContent(
    window.HTMLScriptElement.prototype,
    null,
    'text'
  );

  commonTextContent(
    TextPrototype,
    null,
    'nodeValue'
  );

  commonTextContent(
    window.HTMLTitleElement.prototype,
    null,
    'text'
  );

  defineProperty(
    window.HTMLStyleElement.prototype,
    'textContent',
    (function(descriptor){
      return commonDescriptor(
        function () {
          return descriptor.get.call(this.styleSheet);
        },
        function (textContent) {
          descriptor.set.call(this.styleSheet, textContent);
        }
      );
    }(getOwnPropertyDescriptor(window.CSSStyleSheet.prototype, 'cssText')))
  );

  defineProperties(
    ElementPrototype,
    {
      // bonus
      textContent: {
        get: getTextContent,
        set: setTextContent
      },
      // http://www.w3.org/TR/ElementTraversal/#interface-elementTraversal
      firstElementChild: {
        get: function () {
          for(var
            childNodes = this.childNodes || [],
            i = 0, length = childNodes.length;
            i < length; i++
          ) {
            if (childNodes[i].nodeType == 1) return childNodes[i];
          }
        }
      },
      lastElementChild: {
        get: function () {
          for(var
            childNodes = this.childNodes || [],
            i = childNodes.length;
            i--;
          ) {
            if (childNodes[i].nodeType == 1) return childNodes[i];
          }
        }
      },
      oninput: {
        get: function () {
          return this._oninput || null;
        },
        set: function (oninput) {
          if (this._oninput) {
            this.removeEventListener('input', this._oninput);
            this._oninput = oninput;
            if (oninput) {
              this.addEventListener('input', oninput);
            }
          }
        }
      },
      previousElementSibling: {
        get: function () {
          var previousElementSibling = this.previousSibling;
          while (previousElementSibling && previousElementSibling.nodeType != 1) {
            previousElementSibling = previousElementSibling.previousSibling;
          }
          return previousElementSibling;
        }
      },
      nextElementSibling: {
        get: function () {
          var nextElementSibling = this.nextSibling;
          while (nextElementSibling && nextElementSibling.nodeType != 1) {
            nextElementSibling = nextElementSibling.nextSibling;
          }
          return nextElementSibling;
        }
      },
      childElementCount: {
        get: function () {
          for(var
            count = 0,
            childNodes = this.childNodes || [],
            i = childNodes.length; i--; count += childNodes[i].nodeType == 1
          );
          return count;
        }
      },
      /*
      // children would be an override
      // IE8 already supports them but with comments too
      // not just nodeType 1
      children: {
        get: function () {
          for(var
            children = [],
            childNodes = this.childNodes || [],
            i = 0, length = childNodes.length;
            i < length; i++
          ) {
            if (childNodes[i].nodeType == 1) {
              children.push(childNodes[i]);
            }
          }
          return children;
        }
      },
      */
      // DOM Level 2 EventTarget methods and events
      addEventListener: {value: function (type, handler, capture) {
        if (typeof handler !== 'function' && typeof handler !== 'object') return;
        var
          self = this,
          ontype = 'on' + type,
          temple =  self[SECRET] ||
                      defineProperty(
                        self, SECRET, {value: {}}
                      )[SECRET],
          currentType = temple[ontype] || (temple[ontype] = {}),
          handlers  = currentType.h || (currentType.h = []),
          e, attr
        ;
        if (!hasOwnProperty.call(currentType, 'w')) {
          currentType.w = function (e) {
            // e[SECRET] is a silent notification needed to avoid
            // fired events during live test
            return e[SECRET] || commonEventLoop(self, verify(self, e), handlers, false);
          };
          // if not detected yet
          if (!hasOwnProperty.call(types, ontype)) {
            // and potentially a native event
            if(possiblyNativeEvent.test(type)) {
              // do this heavy thing
              try {
                // TODO:  should I consider tagName too so that
                //        INPUT[ontype] could be different ?
                e = document.createEventObject();
                // do not clone ever a node
                // specially a document one ...
                // use the secret to ignore them all
                e[SECRET] = true;
                // document a part if a node has never been
                // added to any other node, fireEvent might
                // behave very weirdly (read: trigger unspecified errors)
                if (self.nodeType != 9) {
                  if (self.parentNode == null) {
                    div.appendChild(self);
                  }
                  if (attr = self.getAttribute(ontype)) {
                    removeAttribute.call(self, ontype);
                  }
                }
                self.fireEvent(ontype, e);
                types[ontype] = true;
              } catch(e) {
                types[ontype] = false;
                while (div.hasChildNodes()) {
                  div.removeChild(div.firstChild);
                }
              }
              if (attr != null) {
                setAttribute.call(self, ontype, attr);
              }
            } else {
              // no need to bother since
              // 'x-event' ain't native for sure
              types[ontype] = false;
            }
          }
          if (currentType.n = types[ontype]) {
            self.attachEvent(ontype, currentType.w);
          }
        }
        if (find(handlers, handler) < 0) {
          handlers[capture ? 'unshift' : 'push'](handler);
        }
        if (type === 'input') {
          self.attachEvent('onkeyup', onkeyup);
        }
      }},
      dispatchEvent: {value: function (e) {
        var
          self = this,
          ontype = 'on' + e.type,
          temple =  self[SECRET],
          currentType = temple && temple[ontype],
          valid = !!currentType,
          parentNode
        ;
        if (!e.target) e.target = self;
        return (valid ? (
          currentType.n /* && live(self) */ ?
            self.fireEvent(ontype, e) :
            commonEventLoop(
              self,
              e,
              currentType.h,
              true
            )
        ) : (
          (parentNode = self.parentNode) /* && live(self) */ ?
            parentNode.dispatchEvent(e) :
            true
        )), !e.defaultPrevented;
      }},
      removeEventListener: {value: function (type, handler, capture) {
        if (typeof handler !== 'function' && typeof handler !== 'object') return;
        var
          self = this,
          ontype = 'on' + type,
          temple =  self[SECRET],
          currentType = temple && temple[ontype],
          handlers = currentType && currentType.h,
          i = handlers ? find(handlers, handler) : -1
        ;
        if (-1 < i) handlers.splice(i, 1);
      }}
    }
  );

  /* this is not needed in IE8
  defineProperties(window.HTMLSelectElement.prototype, {
    value: {
      get: function () {
        return this.options[this.selectedIndex].value;
      }
    }
  });
  //*/

  // EventTarget methods for Text nodes too
  defineProperties(TextPrototype, {
    addEventListener: {value: ElementPrototype.addEventListener},
    dispatchEvent: {value: ElementPrototype.dispatchEvent},
    removeEventListener: {value: ElementPrototype.removeEventListener}
  });

  defineProperties(
    window.XMLHttpRequest.prototype,
    {
      addEventListener: {value: function (type, handler, capture) {
        var
          self = this,
          ontype = 'on' + type,
          temple =  self[SECRET] ||
                      defineProperty(
                        self, SECRET, {value: {}}
                      )[SECRET],
          currentType = temple[ontype] || (temple[ontype] = {}),
          handlers  = currentType.h || (currentType.h = [])
        ;
        if (find(handlers, handler) < 0) {
          if (!self[ontype]) {
            self[ontype] = function () {
              var e = document.createEvent('Event');
              e.initEvent(type, true, true);
              self.dispatchEvent(e);
            };
          }
          handlers[capture ? 'unshift' : 'push'](handler);
        }
      }},
      dispatchEvent: {value: function (e) {
        var
          self = this,
          ontype = 'on' + e.type,
          temple =  self[SECRET],
          currentType = temple && temple[ontype],
          valid = !!currentType
        ;
        return valid && (
          currentType.n /* && live(self) */ ?
            self.fireEvent(ontype, e) :
            commonEventLoop(
              self,
              e,
              currentType.h,
              true
            )
        );
      }},
      removeEventListener: {value: ElementPrototype.removeEventListener}
    }
  );

  defineProperties(
    window.Event.prototype,
    {
      bubbles: {value: true, writable: true},
      cancelable: {value: true, writable: true},
      preventDefault: {value: function () {
        if (this.cancelable) {
          this.defaultPrevented = true;
          this.returnValue = false;
        }
      }},
      stopPropagation: {value: function () {
        this.stoppedPropagation = true;
        this.cancelBubble = true;
      }},
      stopImmediatePropagation: {value: function () {
        this.stoppedImmediatePropagation = true;
        this.stopPropagation();
      }},
      initEvent: {value: function(type, bubbles, cancelable){
        this.type = type;
        this.bubbles = !!bubbles;
        this.cancelable = !!cancelable;
        if (!this.bubbles) {
          this.stopPropagation();
        }
      }}
    }
  );

  defineProperties(
    window.HTMLDocument.prototype,
    {
      defaultView: {
        get: function () {
          return this.parentWindow;
        }
      },
      textContent: {
        get: function () {
          return this.nodeType === 11 ? getTextContent.call(this) : null;
        },
        set: function (textContent) {
          if (this.nodeType === 11) {
            setTextContent.call(this, textContent);
          }
        }
      },
      addEventListener: {value: function(type, handler, capture) {
        var self = this;
        ElementPrototype.addEventListener.call(self, type, handler, capture);
        // NOTE:  it won't fire if already loaded, this is NOT a $.ready() shim!
        //        this behaves just like standard browsers
        if (
          DUNNOABOUTDOMLOADED &&
          type === DOMCONTENTLOADED &&
          !readyStateOK.test(
            self.readyState
          )
        ) {
          DUNNOABOUTDOMLOADED = false;
          self.attachEvent(ONREADYSTATECHANGE, onReadyState);
          if (window == top) {
            (function gonna(e){try{
              self.documentElement.doScroll('left');
              onReadyState();
              }catch(o_O){
              setTimeout(gonna, 50);
            }}());
          }
        }
      }},
      dispatchEvent: {value: ElementPrototype.dispatchEvent},
      removeEventListener: {value: ElementPrototype.removeEventListener},
      createEvent: {value: function(Class){
        var e;
        if (Class !== 'Event') throw new Error('unsupported ' + Class);
        e = document.createEventObject();
        e.timeStamp = (new Date).getTime();
        return e;
      }}
    }
  );

  defineProperties(
    window.Window.prototype,
    {
      getComputedStyle: {value: function(){

        var // partially grabbed from jQuery and Dean's hack
          notpixel = /^(?:[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|))(?!px)[a-z%]+$/,
          position = /^(top|right|bottom|left)$/,
          re = /\-([a-z])/g,
          place = function (match, $1) {
            return $1.toUpperCase();
          }
        ;

        function ComputedStyle(_) {
          this._ = _;
        }

        ComputedStyle.prototype.getPropertyValue = function (name) {
          var
            el = this._,
            style = el.style,
            currentStyle = el.currentStyle,
            runtimeStyle = el.runtimeStyle,
            result,
            left,
            rtLeft
          ;
          name = (name === 'float' ? 'style-float' : name).replace(re, place);
          result = currentStyle ? currentStyle[name] : style[name];
          if (notpixel.test(result) && !position.test(name)) {
            left = style.left;
            rtLeft = runtimeStyle && runtimeStyle.left;
            if (rtLeft) {
              runtimeStyle.left = currentStyle.left;
            }
            style.left = name === 'fontSize' ? '1em' : result;
            result = style.pixelLeft + 'px';
            style.left = left;
            if (rtLeft) {
              runtimeStyle.left = rtLeft;
            }
          }
          return result == null ?
            result : ((result + '') || 'auto');
        };

        // unsupported
        function PseudoComputedStyle() {}
        PseudoComputedStyle.prototype.getPropertyValue = function () {
          return null;
        };

        return function (el, pseudo) {
          return pseudo ?
            new PseudoComputedStyle(el) :
            new ComputedStyle(el);
        };

      }()},

      addEventListener: {value: function (type, handler, capture) {
        var
          self = window,
          ontype = 'on' + type,
          handlers
        ;
        if (!self[ontype]) {
          self[ontype] = function(e) {
            return commonEventLoop(self, verify(self, e), handlers, false);
          };
        }
        handlers = self[ontype][SECRET] || (
          self[ontype][SECRET] = []
        );
        if (find(handlers, handler) < 0) {
          handlers[capture ? 'unshift' : 'push'](handler);
        }
      }},
      dispatchEvent: {value: function (e) {
        var method = window['on' + e.type];
        return method ? method.call(window, e) !== false && !e.defaultPrevented : true;
      }},
      removeEventListener: {value: function (type, handler, capture) {
        var
          ontype = 'on' + type,
          handlers = (window[ontype] || Object)[SECRET],
          i = handlers ? find(handlers, handler) : -1
         ;
        if (-1 < i) handlers.splice(i, 1);
      }}
    }
  );

  (function (styleSheets, HTML5Element, i) {
    for (i = 0; i < HTML5Element.length; i++) document.createElement(HTML5Element[i]);
    if (!styleSheets.length) document.createStyleSheet('');
    styleSheets[0].addRule(HTML5Element.join(','), 'display:block;');
  }(document.styleSheets, ['header', 'nav', 'section', 'article', 'aside', 'footer']));
}(this.window || global));


/*
 * insertAdjacentHTML.js
 *   Cross-browser full HTMLElement.insertAdjacentHTML implementation.
 * By Eli Grey, http://eligrey.com
 */

if (self.document && !("insertAdjacentHTML" in document.createElementNS("http://www.w3.org/1999/xhtml", "_"))) {

    HTMLElement.prototype.insertAdjacentHTML = function (position, html) {
        "use strict";
        var
                ref = this
                , container = ref.ownerDocument.createElementNS("http://www.w3.org/1999/xhtml", "_")
                , ref_parent = ref.parentNode
                , node, first_child, next_sibling
                ;
        container.innerHTML = html;
        switch (position.toLowerCase()) {
            case "beforebegin":
                while ((node = container.firstChild)) {
                    ref_parent.insertBefore(node, ref);
                }
                break;
            case "afterbegin":
                first_child = ref.firstChild;
                while ((node = container.lastChild)) {
                    first_child = ref.insertBefore(node, first_child);
                }
                break;
            case "beforeend":
                while ((node = container.firstChild)) {
                    ref.appendChild(node);
                }
                break;
            case "afterend":
                next_sibling = ref.nextSibling;
                while ((node = container.lastChild)) {
                    next_sibling = ref_parent.insertBefore(node, next_sibling);
                }
                break;
        }
    };
}

// classlist polyfill
if ("document" in self) {

// Full polyfill for browsers with no classList support
    if (!("classList" in document.createElement("_"))) {

        (function (view) {

            "use strict";
            if (!('Element' in view))
                return;
            var
                    classListProp = "classList"
                    , protoProp = "prototype"
                    , elemCtrProto = view.Element[protoProp]
                    , objCtr = Object
                    , strTrim = String[protoProp].trim || function () {
                return this.replace(/^\s+|\s+$/g, "");
            }
            , arrIndexOf = Array[protoProp].indexOf || function (item) {
                var
                        i = 0
                        , len = this.length
                        ;
                for (; i < len; i++) {
                    if (i in this && this[i] === item) {
                        return i;
                    }
                }
                return -1;
            }
// Vendors: please allow content code to instantiate DOMExceptions
            , DOMEx = function (type, message) {
                this.name = type;
                this.code = DOMException[type];
                this.message = message;
            }
            , checkTokenAndGetIndex = function (classList, token) {
                if (token === "") {
                    throw new DOMEx(
                            "SYNTAX_ERR"
                            , "An invalid or illegal string was specified"
                            );
                }
                if (/\s/.test(token)) {
                    throw new DOMEx(
                            "INVALID_CHARACTER_ERR"
                            , "String contains an invalid character"
                            );
                }
                return arrIndexOf.call(classList, token);
            }
            , ClassList = function (elem) {
                var
                        trimmedClasses = strTrim.call(elem.getAttribute("class") || "")
                        , classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
                        , i = 0
                        , len = classes.length
                        ;
                for (; i < len; i++) {
                    this.push(classes[i]);
                }
                this._updateClassName = function () {
                    elem.setAttribute("class", this.toString());
                };
            }
            , classListProto = ClassList[protoProp] = []
                    , classListGetter = function () {
                        return new ClassList(this);
                    }
            ;
// Most DOMException implementations don't allow calling DOMException's toString()
// on non-DOMExceptions. Error's toString() is sufficient here.
            DOMEx[protoProp] = Error[protoProp];
            classListProto.item = function (i) {
                return this[i] || null;
            };
            classListProto.contains = function (token) {
                token += "";
                return checkTokenAndGetIndex(this, token) !== -1;
            };
            classListProto.add = function () {
                var
                        tokens = arguments
                        , i = 0
                        , l = tokens.length
                        , token
                        , updated = false
                        ;
                do {
                    token = tokens[i] + "";
                    if (checkTokenAndGetIndex(this, token) === -1) {
                        this.push(token);
                        updated = true;
                    }
                } while (++i < l);
                if (updated) {
                    this._updateClassName();
                }
            };
            classListProto.remove = function () {
                var
                        tokens = arguments
                        , i = 0
                        , l = tokens.length
                        , token
                        , updated = false
                        , index
                        ;
                do {
                    token = tokens[i] + "";
                    index = checkTokenAndGetIndex(this, token);
                    while (index !== -1) {
                        this.splice(index, 1);
                        updated = true;
                        index = checkTokenAndGetIndex(this, token);
                    }
                } while (++i < l);
                if (updated) {
                    this._updateClassName();
                }
            };
            classListProto.toggle = function (token, force) {
                token += "";
                var
                        result = this.contains(token)
                        , method = result ?
                        force !== true && "remove"
                        :
                        force !== false && "add"
                        ;
                if (method) {
                    this[method](token);
                }

                if (force === true || force === false) {
                    return force;
                } else {
                    return !result;
                }
            };
            classListProto.toString = function () {
                return this.join(" ");
            };
            if (objCtr.defineProperty) {
                var classListPropDesc = {
                    get: classListGetter
                    , enumerable: true
                    , configurable: true
                };
                try {
                    objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
                } catch (ex) { // IE 8 doesn't support enumerable:true
                    if (ex.number === -0x7FF5EC54) {
                        classListPropDesc.enumerable = false;
                        objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
                    }
                }
            } else if (objCtr[protoProp].__defineGetter__) {
                elemCtrProto.__defineGetter__(classListProp, classListGetter);
            }

        }(self));
    } else {
        
// There is full or partial native classList support, so just check if we need
// to normalize the add/remove and toggle APIs.

        (function () {
            "use strict";
            var testElement = document.createElement("_");
            testElement.classList.add("c1", "c2");
            // Polyfill for IE 10/11 and Firefox <26, where classList.add and
            // classList.remove exist but support only one argument at a time.
            if (!testElement.classList.contains("c2")) {
                var createMethod = function (method) {
                    var original = DOMTokenList.prototype[method];
                    DOMTokenList.prototype[method] = function (token) {
                        var i, len = arguments.length;
                        for (i = 0; i < len; i++) {
                            token = arguments[i];
                            original.call(this, token);
                        }
                    };
                };
                createMethod('add');
                createMethod('remove');
            }

            testElement.classList.toggle("c3", false);
            // Polyfill for IE 10 and Firefox <24, where classList.toggle does not
            // support the second argument.
            if (testElement.classList.contains("c3")) {
                var _toggle = DOMTokenList.prototype.toggle;
                DOMTokenList.prototype.toggle = function (token, force) {
                    if (1 in arguments && !this.contains(token) === !force) {
                        return force;
                    } else {
                        return _toggle.call(this, token);
                    }
                };
            }

            testElement = null;
        }());
    }

}

if (window.attachEvent) {
    window.attachEvent('onload', function () {
        if (window.ActiveXObject !== undefined) {
            if (this.isLocal || !(/^(get|post|head|put|delete|options)$/i.test(this.type))) {
                s4.createXHR = function () {
                    return new window.ActiveXObject("Microsoft.XMLHTTP");
                }
            }
        }
    })
}
