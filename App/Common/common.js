//这里定义一些全局通用的函数，该文件会被自动加载
var moment = require("moment");

global.commonInfo = (function () {
    var pv;
    var req;

    //var SAVE_INFO_TIMER = 1000 * 60 * 60;
    var SAVE_INFO_TIMER = 1000 * 15;

    var console = {
        log: function () {
        }
    }

    function startCount() {

        var dateTime = moment().format('YYYY-MM-DD');

        return D("Statistics").where({
            datetime: dateTime
        }).find().then(function (data) {
            if (!isEmpty(data)) {
                pv = data.pv;
                req = data.req;
            } else {
                pv = 0;
                req = 0;
            }
        }).catch(function (err) {

            console.log("start count fail : ", err);

        });

    }

    function saveInfo() {

        var time = moment().format("YYYY-MM-DD HH:mm:ss");
        var dateTime = moment().format('YYYY-MM-DD');

        return D("Statistics").where({
            datetime: dateTime
        }).find().then(function (data) {

            if (!isEmpty(data)) {

                return D("Statistics").where({
                    datetime: dateTime
                }).update({
                    pv: pv,
                    req: req,
                    time: time
                }).then(function (affectedRows) {

                    if (affectedRows) {

                        console.log("update info succ, affectedRows is : " + affectedRows);

                    } else {

                        throw error();

                    }

                }).catch(function (err) {

                    console.log("update info fail : ", err);

                });

            } else {

                return D("Statistics").add({
                    pv: pv,
                    req: req,
                    time: time,
                    datetime: dateTime
                }).then(function (insertId) {

                    if (insertId) {

                        console.log("add info succ, id is : " + insertId);

                    } else {

                        throw new Error("add fail");

                    }

                }).catch(function (err) {

                    console.log("add info fail : ", {type: "err", "msg": err});

                });

            }

        });

    }

    setTimeout(function () {
        startCount().then(function () {

            var saveInfoTimer = setInterval(saveInfo, SAVE_INFO_TIMER);

        });
    }, 1000 * 10);

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