/**
 * controller
 * @return
 */
module.exports = Controller("Home/BaseController", function () {
    "use strict";
    return {
        indexAction: function () {
            //render View/Home/index_index.ejs file
            var self = this;

            if (isEmpty(self.userInfo)) {

                if (self.isGet()) {

                    var warning = self.get("warning");

                    if (warning == "nologin") {
                        self.assign({
                            "info": "您还没有登录"
                        });
                    }

                }
                return self.display();

            } else {
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

                var mail = self.post('mail');
                var pwd = self.post('pwd');

                if (isEmpty(mail) || isEmpty(pwd)) {

                    return self.json({
                        type: 'err',
                        errno: 1,
                        msg: '您绕过了前端脚本验证提交了空信息？'
                    });

                }

                return D('User').where({

                    mail: mail,
                    pwd: md5(pwd)

                }).find().then(function (data) {

                    if (isEmpty(data)) {

                        throw new Error("登录邮箱或者密码不正确");

                    } else {

                        //用户登录成功写入Session
                        return self.session('userInfo', data);

                    }
                }).then(function () {

                    return self.json({
                        errno: 0,
                        type: 'succ',
                        msg: '登录成功,喜大普奔'
                    });

                }).catch(function (err) {

                    console.log(err);

                    return self.json({
                        type: 'err',
                        errno: 2,
                        msg: '登录邮箱或者密码不正确'
                    });

                });
            } else {
                return self.display('home:index:index');
            }
        },
        registerAction: function () {
            var self = this;
            if (self.isPost()) {

                var mail = self.post('mail');
                var name = self.post('name');
                var pwd = self.post('pwd');

                if (isEmpty(mail) || isEmpty(name) || isEmpty(pwd)) {

                    return self.json({
                        type: 'err',
                        errno: 1,
                        msg: '绕过了前端脚本检测提交了空信息？'
                    });

                }

                return D('User').where({

                    mail: mail

                }).find().then(function (data) {

                        if (!isEmpty(data)) {

                            return self.json({
                                type: 'err',
                                errno: 3,
                                msg: '这个邮箱已经被注册'
                            });

                        } else {

                            return D('User').add({

                                mail: mail,
                                name: name,
                                pwd: md5(pwd)

                            }).then(function (insertId) {

                                console.log("the new user id is : " + insertId);

                                if (insertId) {

                                    return D('User').where({

                                        id: insertId

                                    }).find().then(function (data) {

                                        if (isEmpty(data)) {

                                            throw new Error("没有找到刚刚注册的数据");

                                        } else {

                                            //用户登录成功写入Session
                                            return self.session('userInfo', data);

                                        }
                                    });

                                } else {

                                    throw new Error("注册似乎出了一些问题");

                                }
                            }).then(function () {

                                return self.json({
                                    errno: 0,
                                    type: 'succ',
                                    msg: '注册成功,喜大普奔'
                                });

                            }).catch(function (err) {

                                console.log(err);

                                return self.json({
                                    type: 'err',
                                    errno: 4,
                                    msg: "注册似乎出了一些问题"
                                });

                            });
                        }
                    }
                );
            }
            else {
                return self.display('home:index:index');
            }
        },
        checkMailAction: function () {
            var self = this;
            if (self.isPost()) {

                var mail = self.post('mail');

                return D('User').where({

                    mail: mail

                }).find().then(function (data) {

                    if (!isEmpty(data)) {

                        return self.json({
                            errno: 3,
                            type: 'err',
                            msg: '这个邮箱已经被注册'
                        });

                    } else {

                        return self.json({
                            errno: 0,
                            type: 'succ',
                            msg: 'ok'
                        });

                    }
                });
            }
        }
        ,
        _404Action: function () {

            var self = this;
            self.status(404);
            self.end('404 page not found');

        }
    };
});