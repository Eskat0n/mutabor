window.mutabor = (function () {
    var _interceptors = [],
        _registerInterceptor = function (type, handler) {
            document.addEventListener(type, handler)
            _interceptors.push({
                'type': type,
                'handler': handler
            })
        },
        _is = function (element, selector) {
            var clone = element.cloneNode(true)

            var outerWrapper = document.createElement('div')
            var innerWrapper = document.createElement('div')

            innerWrapper.id = 'temp' + new Date().getTime() + Math.round(Math.random() * 1000)

            outerWrapper.appendChild(innerWrapper)
            innerWrapper.appendChild(clone)

            return !!outerWrapper.querySelector('#' + innerWrapper.id + ' > ' + selector)
        }

    return {
        insert: function (selector, callback) {
            if (!callback) {
                callback = selector
                selector = null
            }

            _registerInterceptor('DOMNodeInserted', function (event) {
                var target = event.srcElement || event.target
                var container = event.relatedNode

                var applyCallback = function () {
                    if (callback(target, event) === false)
                        if (container)
                            container.removeChild(target)
                }

                if (selector) {
                    var childTarget = target.querySelector(selector)

                    if (_is(target, selector)) {
                        applyCallback()
                    } else if (childTarget) {
                        target = childTarget
                        applyCallback()
                    }
                }
                else {
                    applyCallback()
                }
            })
        },

        remove: function (selector, callback) {

        },

        attribute: function (selector, callback) {

        },

        text: function (selector, callback) {

        },

        on: function (type) {
            var params = Array.prototype.slice.call(arguments, 1)
            this[type].apply(this, params)
        },

        reset: function () {
            _interceptors.forEach(function (f) {
                document.removeEventListener(f.type, f.handler)
            })
            _interceptors = []
        }
    };
})()


