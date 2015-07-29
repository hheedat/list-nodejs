//这里定义一些全局通用的函数，该文件会被自动加载

global.commonInfo = (function () {
    var pv = 0;
    var req = 0;
    return {
        getPV: function () {
            return pv;
        },
        increasePV: function () {
            ++pv;
        },
        getREQ: function () {
            return req;
        },
        increaseREQ: function () {
            ++req;
        }
    }
})();