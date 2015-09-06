//这里定义一些全局通用的函数，该文件会被自动加载
var moment = require("moment");

var log = global.console.log;

global.console.log = function () {

    var timestamp = moment().format() + " ";

    var arg = Array.prototype.slice.call(arguments);
    arg.unshift(timestamp);
    arg.push("\n\n");

    log.apply(null, arg);

}

global.commonInfo = (function () {
    var pv;
    var req;
    var pv_before;
    var req_before;

    var SAVE_INFO_TIMER = 1000 * 60 * 10;
    var dateFlag;
    //var SAVE_INFO_TIMER = 1000 * 5;

    function startCount() {

        var dateTime = moment().format('YYYY-MM-DD');

        return D("Statistics").where({
            datetime: dateTime
        }).find().then(function (data) {
            if (!isEmpty(data)) {
                pv_before = pv = data.pv;
                req_before = req = data.req;

                console.log("start statistics from database succ, pv : ", pv, " req : ", req);
            } else {
                pv_before = pv = 0;
                req_before = req = 0;
                console.log("can not statistics from database , pv : ", pv, " req : ", req);
            }
        }).catch(function (err) {

            console.log("start count fail : ", err);

        });

    }

    function saveInfo() {

        var time = moment().format("YYYY-MM-DD HH:mm:ss");
        var dateTime = moment().format('YYYY-MM-DD');

        if (dateFlag !== dateTime) {

            dateFlag = dateTime;
            pv -= pv_before;
            req -= req_before;

        }

        pv_before = pv;
        req_before = req;

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

                        console.log("update statistics succ, affectedRows is : " + affectedRows + " pv : " + pv + " req : " + req);

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

                        console.log("add statistics succ, id is : " + insertId + " pv : " + pv + " req : " + req);

                    } else {

                        throw new Error("add fail");

                    }

                }).catch(function (err) {

                    console.log("add statistics fail : " + err + " pv : " + pv + " req : " + req);

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