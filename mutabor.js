HTMLElement.prototype.is = function (selector) {
    var clone = this.cloneNode(true)

    var outerWrapper = document.createElement('div')
    var innerWrapper = document.createElement('div')

    innerWrapper.id = 'temp' + new Date().getTime() + Math.round(Math.random() * 1000)

    outerWrapper.appendChild(innerWrapper)
    innerWrapper.appendChild(clone)

    return !!outerWrapper.querySelector('#' + innerWrapper.id + ' > ' + selector)
}

window.mutabor = window.mutabor || (function () {
    var mutabor = {
        _interceptors: [],

        _registerInterceptor: function (type, handler) {
            window.document.addEventListener(type, handler)
            this._interceptors.push({
                'type': type,
                'handler': handler
            })
        },

        insert: function (selector, callback) {
            if (!callback) {
                callback = selector
                selector = null
            }

            this._registerInterceptor('DOMNodeInserted', function (event) {
                var target = event.srcElement || event.target
                var container = event.relatedNode

                if (selector && target.is(selector))
                    if (callback(target, event) === false)
                        if (container)
                            container.removeChild(target)
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
            window.mutabor[type + 'Filter'].apply(this, params)
        },

        reset: function () {
            this._interceptors.forEach(function (f) {
                window.document.removeEventListener(f.type, f.handler)
            })
            this._interceptors = []
        }
    }

    return mutabor
})()


