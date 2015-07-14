/**
 * controller
 * @return
 */
module.exports = Controller("Home/BaseController", function () {
    "use strict";
    return {
        indexAction: function () {
            //render View/Home/index_index.html file
            var self = this;
            console.log("user info : " + self.userInfo);
            if (isEmpty(self.userInfo)) {
                if(self.isGet()){
                    var warning = self.get("warning");
                    if(warning == "nologin"){
                        self.assign({
                            "info": "您还没有登录"
                        });
                    }
                }
                return self.display();
            } else {
                //self.assign({
                //    'islogin':true,
                //    'name':self.userInfo.name
                //});
                return self.display();
            }
        },
        logoutAction: function () {
            var self = this;
            return self.session().then(function () {
                return self.redirect('index');
            });
        },
        loginAction: function () {
            var self = this;

            if (self.isPost()) {
                var email = self.post('email');
                var pwd = self.post('pwd');
                var name = null;

                if (isEmpty(email) || isEmpty(pwd)) {
                    return self.assign({
                        'info': '您绕过了前端脚本检测提交了空信息？',
                        'title': '登录-好好登录'
                    });
                    self.display();
                }

                return D('User').where({
                    email: email,
                    pwd: md5(pwd)
                }).find().then(function (data) {
                    if (isEmpty(data)) {
                        self.assign({
                            'info': '登录邮箱或者密码不正确',
                            'title': '登录'
                        });
                        return self.display();
                    } else {
                        //用户登录成功写入Session
                        name = data.name;
                        return self.session('userInfo', data);
                    }
                }).then(function () {
                    return self.redirect('/list');
                });
            } else {
                self.assign({
                    'title': '登录'
                });
                return self.display();
            }
        },
        registerAction: function () {
            var self = this;
            if (self.isPost()) {
                var email = self.post('email');
                var name = self.post('name');
                var pwd = self.post('pwd');

                if (isEmpty(email) || isEmpty(name) || isEmpty(pwd)) {
                    return self.assign({
                        'info': '您绕过了前端脚本检测提交了空信息？',
                        'title': '注册-好好注册'
                    });
                    self.display();
                }

                return D('User').where({
                    email: email
                }).find().then(function (data) {
                    if (!isEmpty(data)) {
                        self.assign({
                            'info': '这个邮箱已经被注册',
                            'title': '注册'
                        });
                        self.display();
                    } else {
                        return D('User').add({
                            email: email,
                            name: name,
                            pwd: md5(pwd)
                        }).then(function (insertId) {
                            console.log("the new user id is : " + insertId);
                            if (insertId) {
                                self.assign({
                                    'info': '注册成功'
                                });
                                return self.display('index');
                            } else {
                                throw new Error("注册似乎出了一些问题");
                            }
                        }).catch(function (err) {
                            self.assign({
                                'info': err
                            });
                            return self.display();
                        });
                    }
                });
            } else {
                self.assign({
                    'title': '注册'
                });
                return self.display();
            }
        },
        checkMailAction: function () {
            var self = this;
            if (self.isPost()) {
                var email = self.post('email');
                return D('User').where({
                    email: email
                }).find().then(function (data) {
                    if (!isEmpty(data)) {
                        return self.json({msg: "err"});
                    } else {
                        return self.json({msg: "ok"});
                    }
                });
            }
        },
        _404Action: function () {
            var self = this;
            self.status(404);
            self.end('404 page not found');
        }
    };
});