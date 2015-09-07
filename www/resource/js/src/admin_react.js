'use strict';
//var React = require("react");
//var $ = require("jquery");
//var moment = require("moment");

var Analytics = React.createClass({
    loadTimer: null,
    getInitialState: function () {
        return {
            info: []
        }
    },
    componentDidMount: function () {
        this.loadDataFromServer();
        this.loadTimer = setInterval(this.loadDataFromServer, this.props.pollInterval);
    },
    loadDataFromServer: function () {
        return $.ajax({
            url: this.props.urlInfo,
            method: 'post',
            dataType: 'json'
        }).done(function (data) {

            if (data.type == 'succ') {
                this.setState({info: data.msg});
            } else {
                alert('服务端出现了一些错误' + data.msg);
            }

        }.bind(this)).fail(function (xhr, status, err) {

            alert("出现了一些问题");
            console.error(status, err.toString());

        }.bind(this));
    },
    componentWillUnmount: function () {
        clearInterval(this.loadTimer);
    },
    render: function () {
        var items;
        if (this.state.info.length) {
            items = this.state.info.map(function (item) {
                return (
                    <tr key={item.id}>
                        <td>{moment(item.datetime).format('YYYY-MM-DD')}</td>
                        <td>{item.pv}</td>
                        <td>{item.req}</td>
                    </tr>
                )
            });
        } else {
            items = (
                <tr>
                    <td colSpan="3">loading...</td>
                </tr>
            )
        }

        return (
            <table className="visit-info">
                <tbody>
                <tr>
                    <th>Time</th>
                    <th>PV</th>
                    <th>REQ</th>
                </tr>
                {items}
                </tbody>
            </table>
        );
    }
});

var UserInfo = React.createClass({
    loadTimer: null,
    getInitialState: function () {
        return {
            count: 'loading...'
        }
    },
    componentDidMount: function () {
        this.loadDataFromServer();
        this.loadTimer = setInterval(this.loadDataFromServer, this.props.pollInterval);
    },
    loadDataFromServer: function () {
        return $.ajax({
            url: this.props.urlUserInfo,
            method: 'post',
            dataType: 'json'
        }).done(function (data) {

            if (data.type == 'succ') {
                this.setState({count: data.msg});
            } else {
                alert('服务端出现了一些错误' + data.msg);
            }

        }.bind(this)).fail(function (xhr, status, err) {

            alert("出现了一些问题");
            console.error(status, err.toString());

        }.bind(this));
    },
    componentWillUnmount: function () {
        clearInterval(this.loadTimer);
    },
    render: function () {
        return (
            <table className="user-info">
                <tbody>
                <tr>
                    <th>User Num</th>
                </tr>
                <tr>
                    <td>{this.state.count}</td>
                </tr>
                </tbody>
            </table>
        );
    }
});

var ListInfo = React.createClass({
    loadTimer: null,
    getInitialState: function () {
        return {
            count: 'loading...'
        }
    },
    componentDidMount: function () {
        this.loadDataFromServer();
        this.loadTimer = setInterval(this.loadDataFromServer, this.props.pollInterval);
    },
    loadDataFromServer: function () {
        return $.ajax({
            url: this.props.urlListInfo,
            method: 'post',
            dataType: 'json'
        }).done(function (data) {

            if (data.type == 'succ') {
                this.setState({count: data.msg});
            } else {
                alert('服务端出现了一些错误' + data.msg);
            }

        }.bind(this)).fail(function (xhr, status, err) {

            alert("出现了一些问题");
            console.error(status, err.toString());

        }.bind(this));
    },
    componentWillUnmount: function () {
        clearInterval(this.loadTimer);
    },
    render: function () {
        return (
            <table className="list-info">
                <tbody>
                <tr>
                    <th>List Num</th>
                </tr>
                <tr>
                    <td>{this.state.count}</td>
                </tr>
                </tbody>
            </table>
        );
    }
});

var AdminLauncher = React.createClass({
    render: function () {
        return (
            <div className="cf">
                <UserInfo urlUserInfo='/admin/index/getUsersInfo' pollInterval={1000*60}/>
                <ListInfo urlListInfo='/admin/index/getListInfo' pollInterval={1000*60}/>
                <Analytics urlInfo='/admin/index/getInfo' pollInterval={1000*60}/>
            </div>
        );
    }
});

React.render(
    <AdminLauncher/>,
    document.getElementById('wrapper')
);