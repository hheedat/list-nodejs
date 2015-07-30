var moment = require("moment");

module.exports = Controller("Home/BaseController", function () {
    "use strict";
    return {
        indexAction: function () {
            var self = this;
            return self.display();
        },
        addAction: function () {
            var self = this;
            if (self.isPost()) {
                var title = self.post('title');
                if (isEmpty(title)) return self.json({type: "err", msg: "title is empty"});

                var content = self.post('content');
                var time = moment().format("YYYY-MM-DD HH:mm:ss");
                var belong = self.userInfo.id;

                return D("List").add({
                    title: title,
                    content: content,
                    time: time,
                    belong: belong,
                    isuse: 1
                }).then(function (insertId) {
                    console.log("the new list id is : " + insertId);
                    if (insertId) {
                        return self.json({type: "succ", "msg": "success"});
                    } else {
                        throw new Error("add fail");
                    }
                }).catch(function (err) {
                    console.log({type: "err", "msg": err});
                    return self.json({type: "err", "msg": "add fail"});
                });
            }
        },
        deleteAction: function () {
            var self = this;
            if (self.isPost()) {
                var id = self.post("id");
                if (isEmpty(id)) return self.json({type: "err", msg: "id is empty"});

                return D("List").where({
                    "id": id
                }).update({
                    "isuse": 0
                }).then(function (affectedRows) {
                    console.log("delete update affectedRows", affectedRows);
                    if (affectedRows) {
                        return self.json({type: "succ", msg: "success"});
                    } else {
                        return self.json({type: "err", msg: "this id have no data"});
                    }
                }).catch(function (err) {
                    console.log({type: "err", "msg": err});
                    return self.json({type: "err", "msg": "this id have no data"});
                });
            }
        },
        itemCompleteAction: function () {
            var self = this;
            if (self.isPost()) {
                var id = self.post("id");
                if (isEmpty(id)) return self.json({type: "err", msg: "id is empty"});

                return D("List").where({
                    "id": id
                }).update({
                    "status": 0
                }).then(function (affectedRows) {
                    console.log("delete update affectedRows", affectedRows);
                    if (affectedRows) {
                        return self.json({type: "succ", msg: "success"});
                    } else {
                        return self.json({type: "err", msg: "this id have no data"});
                    }
                }).catch(function (err) {
                    console.log({type: "err", "msg": err});
                    return self.json({type: "err", "msg": "update fail"});
                });
            }
        },
        itemUndoAction: function () {
            var self = this;
            if (self.isPost()) {
                var id = self.post("id");
                if (isEmpty(id)) return self.json({type: "err", msg: "id is empty"});

                return D("List").where({
                    "id": id
                }).update({
                    "status": 1
                }).then(function (affectedRows) {
                    console.log("delete update affectedRows", affectedRows);
                    if (affectedRows) {
                        return self.json({type: "succ", msg: "success"});
                    } else {
                        return self.json({type: "err", msg: "this id have no data"});
                    }
                }).catch(function (err) {
                    console.log({type: "err", "msg": err});
                    return self.json({type: "err", "msg": "update fail"});
                });
            }
        },
        updateAction: function () {
            var self = this;
            if (self.isPost()) {
                var id = self.post("id");
                var title = self.post("title");
                var content = self.post("content");
                //var time = moment().format("YYYY-MM-DD hh:mm:ss");

                if (isEmpty(id) || (isEmpty(title) && isEmpty(content))) {
                    return self.json({type: "err", msg: "missing parameter"});
                }

                return D("List").where({
                    "id": id
                }).update({
                    "title": title,
                    "content": content
                }).then(function (affectedRows) {
                    console.log("update affectedRows", affectedRows);
                    if (affectedRows) {
                        return self.json({type: "succ", msg: "success"});
                    } else {
                        return self.json({type: "err", msg: "this id have no data"});
                    }
                }).catch(function (err) {
                    console.log({type: "err", "msg": err});
                    return self.json({type: "err", "msg": "update fail"});
                });
            }
        },
        checkAction: function (status) {
            var self = this;
            if (self.isPost()) {
                var belong = self.userInfo.id;
                var status = status === 0 ? 0 : 1;
                if (isEmpty(belong)) return self.json({type: "err", msg: "must have a belong id"});

                return D("list").where({
                    "belong": belong,
                    "isuse": 1,
                    "status": status
                }).order('time DESC').field("id,title,time,status").select().then(function (data) {
                    if (data) {
                        return self.json({type: "succ", msg: data});
                    } else {
                        return self.json({type: "err", msg: "this belong id have no data"});
                    }
                }).catch(function (err) {
                    console.log({type: "err", "msg": err});
                    return self.json({type: "err", "msg": "check fail"});
                });
            }
        },
        checkCompleteAction: function () {
            this.action("home:list:check", [0]);
        },
        checkDetailAction: function () {
            var self = this;
            if (self.isPost()) {
                var belong = self.userInfo.id;
                var id = self.post("id");
                if (isEmpty(belong) || isEmpty(id)) return self.json({
                    type: "err",
                    msg: "must have a belong id and id"
                });

                return D("list").where({
                    "belong": belong,
                    "id": id
                }).field("id,title,content,time").find().then(function (data) {
                    if (data) {
                        return self.json({type: "succ", msg: data});
                    } else {
                        return self.json({type: "err", msg: "this belong id have no data"});
                    }
                }).catch(function (err) {
                    console.log({type: "err", "msg": err});
                    return self.json({type: "err", "msg": "check detail fail"});
                });
            }
        }
    }
});