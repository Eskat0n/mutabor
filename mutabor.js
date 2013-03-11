window.mutabor = (function () {
    var _interceptors = [],
        _eventTypes = ['DOMSubtreeModified', 'DOMNodeInserted', 'DOMNodeRemoved', 'DOMNodeInsertedIntoDocument', 'DOMNodeRemovedFromDocument', 'DOMAttrModified', 'DOMCharacterDataModified'];

    var _is = function (element, selector) {
        if (!element.querySelector)
            return false;

        var clone = element.cloneNode(true);

        var outerWrapper = document.createElement('div');
        var innerWrapper = document.createElement('div');

        innerWrapper.id = 'temp' + new Date().getTime() + Math.round(Math.random() * 1000);

        outerWrapper.appendChild(innerWrapper);
        innerWrapper.appendChild(clone);

        return !!outerWrapper.querySelector('#' + innerWrapper.id + ' > ' + selector)
    };

    var _methodMix = function (obj1, obj2) {
        var newObj = {};

        for (var key1 in obj1)
            if (obj1.hasOwnProperty(key1))
                newObj[key1] = obj1[key1];

        for (var key2 in obj2)
            if (obj2.hasOwnProperty(key2))
                newObj[key2] = obj2[key2];

        return newObj
    };

    var _registerInterceptor = function (type, selector, interceptorInvoker) {
        var eventHandler = function (event) {
            var target = event.srcElement || event.target;

            if (selector) {
                var childTarget = target.querySelector ? target.querySelector(selector) : null;

                if (_is(target, selector))
                    interceptorInvoker(target, event);
                else if (childTarget)
                    interceptorInvoker(childTarget, event)
            }
            else {
                interceptorInvoker(target, event)
            }
        };

        document.addEventListener(type, eventHandler);
        _interceptors.push({
            'type': type,
            'handler': eventHandler
        });

        return _methodMix(window.mutabor, {
            now: function () {
                Array.prototype.slice.apply(document.querySelectorAll(selector)).forEach(interceptorInvoker);
                return window.mutabor
            }
        })
    };

    var _detectCapabilities = function () {
        var caps = {};

        var div = document.createElement('DIV');
        div.style.display = 'none';

        for (var i = 0; i < _eventTypes.length; i++) {
            var eventType = _eventTypes[i];
            caps[eventType] = false;
            div.addEventListener(eventType, function (evt) {
                caps[evt.type] = true;
            });
        }

        var body = document.getElementsByTagName('body')[0];
        body.appendChild(div);
        div.setAttribute('mutabor-test', 'mutabor-test');
        div.innerHTML = 'mutabor-test';
        if (div.firstChild && div.firstChild.deleteData) {
            div.firstChild.deleteData(4, 4); //check for DOMCharacterDataModified
        }
        body.removeChild(div);
        return caps;
    };

    window.addEventListener('load', function () {
        if (window.mutaborDetectCaps === false ||
           (window.mutabor && window.mutabor.detectCaps === false))
            return;
        window.mutabor.caps = _detectCapabilities();
    });

    return {
        caps: null,

        insert: function (selector, interceptor) {
            if (!interceptor) {
                interceptor = selector;
                selector = null
            }

            return _registerInterceptor('DOMNodeInserted', selector, function (target, event) {
                var container = event.relatedNode;
                if (interceptor(target, event) === false)
                    if (container)
                        container.removeChild(target)
            })
        },

        remove: function (selector, interceptor) {
            if (!interceptor) {
                interceptor = selector;
                selector = null
            }

            return _registerInterceptor('DOMNodeRemoved', selector, interceptor)
        },

        attribute: function () {
            throw 'DOMAttrModified is not supported in WebKit so this interceptor is not implemented'
        },

        text: function () {
            throw 'DOMCharacterDataModifiedis not supported in WebKit so this interceptor is not implemented'
        },

        on: function (type) {
            var params = Array.prototype.slice.call(arguments, 1);
            this[type].apply(this, params)
        },

        reset: function () {
            _interceptors.forEach(function (f) {
                document.removeEventListener(f.type, f.handler)
            });
            _interceptors = []
        },

        toString: function () {
            return 'mutabor version 0.2'
        }
    };
})();
