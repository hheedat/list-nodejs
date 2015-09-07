module.exports = {

    view_init: [function (http) {
        commonInfo.increasePV();
        //console.log("http header : ", http.headers);

    }],

    route_check: [function (http) {
        commonInfo.increaseREQ();
        //console.log("http header : ", http.headers);
    }]

}