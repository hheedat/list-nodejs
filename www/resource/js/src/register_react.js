'use strict';
var React = require('react');
var $ = require("jquery");
var moment = require("moment");

var RegisterBox = React.createClass({
    checkFlag: false,
    mail: '',
    pwd: '',
    username: '',
    getInitialState: function () {
        return {
            warning: {},
            applyMsg: {}
        };
    },
    submit: function () {

        this.checkFlag = true;

        if (this.isInputLegal()) {

            return $.ajax({

                url: this.props.urlRegister,
                method: 'post',
                dataType: 'json',
                data: {
                    mail: this.mail,
                    pwd: this.pwd,
                    name: this.username,
                }

            }).done(function (data) {

                if (data.errno == 0) {

                    this.setState({
                        applyMsg: {
                            apply: data.msg
                        }
                    });
                    setTimeout(function () {

                        window.location.href = this.props.urlRedirect;

                    }.bind(this), 100);

                } else {
                    this.setState({
                        warning: {
                            apply: data.msg
                        }
                    });
                }

            }.bind(this)).fail(function (xhr, status, err) {

                console.error(this.props.url, status, err);
                this.setState({
                    warning: {
                        apply: '出现了一些问题'
                    }
                });

            });
        }

    },
    isInputLegal: function () {

        if (!this.checkFlag) {
            return false;
        }

        var mail = this.mail = this.refs.mail.getDOMNode().value.trim();
        var pwd = this.pwd = this.refs.pwd.getDOMNode().value.trim();
        var username = this.username = this.refs.username.getDOMNode().value.trim();

        var regEmpty = /^\s*$/;
        var regMail = /^.+\@.+$/;

        var flag = true;

        if (regEmpty.test(username)) {
            this.setState({
                warning: {
                    username: '请输入您的用户名'
                }
            });
            return false;
        } else {
            this.setState({
                warning: {
                    username: ''
                }
            });
        }

        if (regEmpty.test(mail)) {
            this.setState({
                warning: {
                    mail: '请输入您的邮箱'
                }
            });
            return false;
        } else if (!regMail.test(mail)) {
            this.setState({
                warning: {
                    mail: '您输入的不是一个合法的邮箱'
                }
            });
            return false;
        } else {
            this.setState({
                warning: {
                    mail: ''
                }
            });
        }

        if (regEmpty.test(pwd)) {
            this.setState({
                warning: {
                    pwd: '请输入您的密码'
                }
            });
            return false;
        } else if (pwd.length < 6) {
            this.setState({
                warning: {
                    pwd: '密码必须大于6位'
                }
            });
            return false;
        } else {
            this.setState({
                warning: {
                    pwd: ''
                }
            });
        }

        return flag;

    },
    componentDidMount: function () {

    },
    componentWillUnmount: function () {

    },
    render: function () {
        return (
            <div className="main-box">
                <h4>注册</h4>

                <div className="register-box">
                    <div className="item">
                        <label htmlFor="username">用户名 : </label>
                        <input ref="username" type="text" id="username" onChange={this.isInputLegal} placeholder="用户名"/>

                        <p className="warning">{this.state.warning.username}</p>
                    </div>

                    <div className="item">
                        <label htmlFor="mail">邮箱 : </label>
                        <input ref="mail" type="text" id="mail" onChange={this.isInputLegal} placeholder="登录邮箱"/>

                        <p className="warning">{this.state.warning.mail}</p>
                    </div>

                    <div className="item">
                        <label htmlFor="pwd">密码 : </label>
                        <input ref="pwd" type="password" name="pwd" onChange={this.isInputLegal} placeholder="登录密码"/>

                        <p className="warning">{this.state.warning.pwd}</p>
                    </div>

                    <div className="item">
                        <button className="btn" onClick={this.submit}>注册</button>
                        <p className="warning">{this.state.warning.apply}</p>

                        <p className="msg">{this.state.applyMsg.apply}</p>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = RegisterBox;