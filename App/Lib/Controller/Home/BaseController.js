/**
 * 项目里的Controller基类
 * 这里做一些通用的处理逻辑，其他Controller继承该类
 * @param  {[type]}
 * @return {[type]}         [description]
 */
var util = require('util');
module.exports = Controller(function () {
    'use strict';
    return {
        init: function (http) {
            this.super("init", http);
            //其他的通用逻辑
            var self = this;
            //console.log("http:  " + util.inspect(http));
            console.log("action ->", http.action, "  controller ->", http.controller);

            return self.session("userInfo").then(function (data) {
                if (!isEmpty(data)) {
                    if (http.action === "logout") {
                        return;
                    }
                    if (http.controller !== "List") {
                        return self.redirect("/list");
                    }
                    self.userInfo = data;
                    self.assign({
                        'islogin': true,
                        'name': self.userInfo.name
                    });
                } else {
                    if (http.controller === "Index") {
                        return;
                    }
                    return self.redirect("/?warning=nologin");
                }
            });
        }
    }
})