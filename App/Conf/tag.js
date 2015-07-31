module.exports = {
    view_init: [function (http) {
        commonInfo.increasePV();
        //console.log("pv -> ", commonInfo.getPV());
    }],
    route_check: [function (http) {
        commonInfo.increaseREQ();
        //console.log("req -> ", commonInfo.getREQ());
    }]
}