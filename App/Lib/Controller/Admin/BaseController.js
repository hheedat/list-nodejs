var util = require('util');

module.exports = Controller(function () {
    'use strict';
    return {
        init: function (http) {

            this.super('init', http);
            /**
             * 其他的通用逻辑
             */

            var self = this;

            //console.log("http:  " + util.inspect(http));
            console.log("(╯‵□′)╯︵┻━┻  action ->", http.action, "  controller ->", http.controller, "  group ->", http.group);

            return self.session('userInfo').then(function (userInfo) {

                if (isEmpty(userInfo)) {

                    //ajax访问返回一个json的错误信息
                    if (self.isAjax()) {

                        return self.error(403);

                    } else {

                        self.assign({
                            "info": "没有登录,就想访问管理员页面 ?!    (╯‵□′)╯︵┻━┻"
                        });
                        return self.display('home:index:index');

                    }
                } else {

                    self.userInfo = userInfo;
                    self.assign('userInfo', userInfo);
                }
            });
        }
    }
})