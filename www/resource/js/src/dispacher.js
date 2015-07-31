var $ = require('jquery');

var Dispacher = window.Dispatcher = function () {
    $.extend(this, $({}));
}
var dispacher = window.dispacher = {};

module.exports = Dispatcher;