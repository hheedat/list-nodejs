var URL_ADD = "/home/list/add";
var URL_DELETE = "/home/list/delete";
var URL_UPDATE = "/home/list/update";
var URL_CHECK = "/home/list/check";
var URL_CHECKDETAIL = "/home/list/checkDetail";

var title = "test_title1";
var content = "test_content";
var time = "";

function add() {
    $.ajax({
        url: URL_ADD,
        dataType: "json",
        method: "post",
        data: {
            title: title,
            content: content
        },
        success: function (data) {
            console.log("return data -> ", data);
        },
        error: function (data) {
            console.log("err", data);
        }
    });
}
function del(id) {
    $.ajax({
        url: URL_DELETE,
        dataType: "json",
        method: "post",
        data: {
            id: id
        },
        success: function (data) {
            console.log("return data -> ", data);
        },
        error: function () {
            console.log("err");
        }
    });
}
function update(id) {
    $.ajax({
        url: URL_UPDATE,
        dataType: "json",
        method: "post",
        data: {
            id: id,
            title: title + 2333,
            content: content + "apple"
        },
        success: function (data) {
            console.log("return data -> ", data);
        },
        error: function () {
            console.log("err");
        }
    });
}
function check() {
    $.ajax({
        url: URL_CHECK,
        dataType: "json",
        method: "post",
        data: {},
        success: function (data) {
            console.log("return data -> ", data);
        },
        error: function () {
            console.log("err");
        }
    });
}

function checkDetail(id) {
    $.ajax({
        url: URL_CHECKDETAIL,
        dataType: "json",
        method: "post",
        data: {id: id},
        success: function (data) {
            console.log("return data -> ", data);
        },
        error: function (err) {
            console.log("err", err);
        }
    });
}
