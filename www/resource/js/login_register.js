$(function () {
    var flagEmailUsed = false;

    function isEmpty(arr) {
        var regEmpty = /^\s*$/;
        for (var i = 0, l = arr.length; i < l; ++i) {
            if (regEmpty.test(arr[i].val())) {
                return arr[i];
            }
        }
        return false;
    }

    var warnText = {
        'email': '邮箱',
        'name': '昵称',
        'pwd': '密码'
    }

    function checkRegisterInput() {
        checkInputEmpty();
        checkEmailLegal();
        checkNameLegal();
        checkPwdLegal();
        checkMailUsed();
    }

    function checkEmailLegal() {

    }

    function checkNameLegal() {

    }

    function checkPwdLegal() {

    }

    function checkInputEmpty() {
        var $email = $("input[name=email]"),
            $name = $("input[name=name]"),
            $pwd = $("input[name=pwd]");

        var checkRe = isEmpty([$email, $name, $pwd]);
        if (checkRe) {
            $("#warn-line").html("请输入" + warnText[checkRe.attr("name")]);
            return false;
            event.preventDefault();
        }
    }

    function checkMailUsed() {
        var $email = $("input[name=email]");
        console.log("change");
        $.ajax({
            url: "/home/index/checkMail",
            dataType: "json",
            data: {email: $email.val()},
            type: "POST",
            success: function (data) {
                if (data.msg == "err") {
                    $("#email-used").html("这个邮箱已经被注册");
                    flagEmailUsed = true;
                } else if (data.msg == "ok") {
                    $("#email-used").html("");
                    flagEmailUsed = false;
                }
            }
        })
    }

    if ($(".register-box").length) {
        $("button[type=submit]").on("click", checkRegisterInput.bind(null, event));
        $("input[name=email]").on("change", checkMailUsed);
    }
})