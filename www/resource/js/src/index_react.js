'use strict';
//var React = require('react');
var LoginBox = require('./login_react');
var RegisterBox = require('./register_react');

var LoginRegisterBox = React.createClass({
    render: function () {
        return (
            <div>
                <LoginBox urlLogin='/home/index/login' urlRedirect="/list"/>
                <RegisterBox urlRegister='/home/index/register' urlRedirect="/list"/>
            </div>
        );
    }
});

React.render(
    <LoginRegisterBox/>,
    document.getElementById('wrapper')
);