window.mutabor = (function () {
    var _interceptors = [];

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

        obj1.getOwnPropertyNames().forEach(function (key) {
            newObj[key] = obj1[key];
        });
        obj2.getOwnPropertyNames().forEach(function (key) {
            newObj[key] = obj2[key];
        });

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
                document.querySelectorAll(selector).forEach(interceptionInvoker);
                return window.mutabor
            }
        })
    };

    return {
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
            return 'mutabor version 0.1'
        }
    };
})();