HTMLElement.prototype.is = function (selector) {
    var clone = this.cloneNode(true);

    var outerWrapper = document.createElement('div');
    var innerWrapper = document.createElement('div');

    innerWrapper.id = 'temp' + new Date().getTime() + Math.round(Math.random() * 1000);

    outerWrapper.appendChild(innerWrapper);
    innerWrapper.appendChild(clone);

    return !!outerWrapper.querySelector('#' + innerWrapper.id + ' > ' + selector);
};

window.mutabor = window.mutabor || (function () {
    var mutabor = {
        insertFilter: function () {

        },

        removeFilter: function () {

        },

        attrFilter: function () {

        },

        textFilter: function () {

        },

        filter: function (type) {
            var params = Array.prototype.slice.call(arguments, 1);
            window.mutabor[type + 'Filter'].apply(this, params);
        }
    };

    return mutabor;
})();


