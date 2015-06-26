module.exports = Controller(function(){
    'use strict';
    return {
        init: function(http){
            this.super('init', http);
            /**
             * 其他的通用逻辑
             */
            //login请求不判断当前是否已经登录
            if (this.http.action === 'login') {
                return;
            }

            var self = this;
            return self.session('userInfo').then(function (userInfo) {
                //用户信息为空
                if (isEmpty(userInfo)) {
                    //ajax访问返回一个json的错误信息
                    if (self.isAjax()) {
                        return self.error(403);
                    } else {
                        //跳转到登录页
                        return self.redirect('login');
                    }
                } else {
                    //用户已经登录
                    self.userInfo = userInfo;
                    self.assign('userInfo', userInfo);
                }
            });
        }
    }
})