module.exports = Controller("Admin/BaseController", function () {
    "use strict";
    return {
        indexAction: function () {
            //render View/Home/index_index.ejs file
            this.display();
        },
        getInfoAction: function () {

            var self = this;
            if (self.isPost()) {

                return D("Statistics").where({
                    id: ['>', 0]
                }).field("id,pv,req,datetime").order('id DESC').limit(30).select().then(function (data) {

                    if (!isEmpty(data)) {

                        return self.json({type: "succ", msg: data});

                    } else {

                        return self.json({type: "err", msg: "this belong id have no data"});

                    }

                }).catch(function (err) {

                    console.log({type: "err", "msg": err});
                    return self.json({type: "err", "msg": "get info fail"});

                });
            }

        },
        getUsersInfoAction: function () {

            var self = this;
            if (self.isPost()) {

                D('User').count().then(function (count) {

                    return self.json({type: "succ", msg: count});

                }).catch(function (err) {

                    console.log({type: "err", "msg": err});
                    return self.json({type: "err", "msg": "get users info fail"});

                });

            }

        },
        getListInfoAction: function () {

            var self = this;
            if (self.isPost()) {

                D('List').count().then(function (count) {

                    return self.json({type: "succ", msg: count});

                }).catch(function (err) {

                    console.log({type: "err", "msg": err});
                    return self.json({type: "err", "msg": "get list info fail"});

                });

            }

        }
    };
});

