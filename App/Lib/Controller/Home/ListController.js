module.exports = Controller("Home/BaseController",function(){
    "use strict";
    return {
        indexAction:function(){
            var self = this;
            console.log("index action in list controller");
            return self.display();
        },
        addAction:function(){
            var self = this;
            console.log("add action in list controller");
            if(self.isPost()){
                var title = self.post('title');
                if(isEmpty(title)) return self.json({msg:"title is empty"});

                var content = self.post('content');
                var time = new Date();
                var belong = self.userInfo.id;

                return D("List").add({
                    title:title,
                    content:content,
                    time:time,
                    belong:belong
                }).then(function(insertId){
                    console.log("the new list id is : "+insertId);
                    if(insertId){
                        return self.json({"msg":"succ"});
                    }else{
                        throw new Error("注册似乎出了一些问题");
                    }
                }).catch(function(err){
                    return self.json({"msg":err});
                });
            }
        },
        deleteAction:function(){

        },
        updateAction:function(){

        },
        checkAction:function(){

        }
    }
});