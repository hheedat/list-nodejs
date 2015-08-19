webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var React = __webpack_require__(1);
	var $ = __webpack_require__(157);
	var moment = __webpack_require__(158);

	var Analytics = React.createClass({
	    displayName: "Analytics",

	    loadTimer: null,
	    getInitialState: function getInitialState() {
	        return {
	            info: []
	        };
	    },
	    componentDidMount: function componentDidMount() {
	        this.loadDataFromServer();
	        this.loadTimer = setInterval(this.loadDataFromServer, this.props.pollInterval);
	    },
	    loadDataFromServer: function loadDataFromServer() {
	        return $.ajax({
	            url: this.props.urlInfo,
	            method: 'post',
	            dataType: 'json'
	        }).done((function (data) {

	            if (data.type == 'succ') {
	                this.setState({ info: data.msg });
	            } else {
	                alert('服务端出现了一些错误' + data.msg);
	            }
	        }).bind(this)).fail((function (xhr, status, err) {

	            alert("出现了一些问题");
	            console.error(status, err.toString());
	        }).bind(this));
	    },
	    componentWillUnmount: function componentWillUnmount() {
	        clearInterval(this.loadTimer);
	    },
	    render: function render() {
	        var items;
	        if (this.state.info.length) {
	            items = this.state.info.map(function (item) {
	                return React.createElement(
	                    "tr",
	                    { key: item.id },
	                    React.createElement(
	                        "td",
	                        null,
	                        moment(item.datetime).format('YYYY-MM-DD')
	                    ),
	                    React.createElement(
	                        "td",
	                        null,
	                        item.pv
	                    ),
	                    React.createElement(
	                        "td",
	                        null,
	                        item.req
	                    )
	                );
	            });
	        } else {
	            items = React.createElement(
	                "tr",
	                null,
	                React.createElement(
	                    "td",
	                    { colSpan: "3" },
	                    "loading..."
	                )
	            );
	        }

	        return React.createElement(
	            "table",
	            { className: "visit-info" },
	            React.createElement(
	                "tbody",
	                null,
	                React.createElement(
	                    "tr",
	                    null,
	                    React.createElement(
	                        "th",
	                        null,
	                        "Time"
	                    ),
	                    React.createElement(
	                        "th",
	                        null,
	                        "PV"
	                    ),
	                    React.createElement(
	                        "th",
	                        null,
	                        "REQ"
	                    )
	                ),
	                items
	            )
	        );
	    }
	});

	var UserInfo = React.createClass({
	    displayName: "UserInfo",

	    loadTimer: null,
	    getInitialState: function getInitialState() {
	        return {
	            count: 'loading...'
	        };
	    },
	    componentDidMount: function componentDidMount() {
	        this.loadDataFromServer();
	        this.loadTimer = setInterval(this.loadDataFromServer, this.props.pollInterval);
	    },
	    loadDataFromServer: function loadDataFromServer() {
	        return $.ajax({
	            url: this.props.urlUserInfo,
	            method: 'post',
	            dataType: 'json'
	        }).done((function (data) {

	            if (data.type == 'succ') {
	                this.setState({ count: data.msg });
	            } else {
	                alert('服务端出现了一些错误' + data.msg);
	            }
	        }).bind(this)).fail((function (xhr, status, err) {

	            alert("出现了一些问题");
	            console.error(status, err.toString());
	        }).bind(this));
	    },
	    componentWillUnmount: function componentWillUnmount() {
	        clearInterval(this.loadTimer);
	    },
	    render: function render() {
	        return React.createElement(
	            "table",
	            { className: "user-info" },
	            React.createElement(
	                "tbody",
	                null,
	                React.createElement(
	                    "tr",
	                    null,
	                    React.createElement(
	                        "th",
	                        null,
	                        "User Num"
	                    )
	                ),
	                React.createElement(
	                    "tr",
	                    null,
	                    React.createElement(
	                        "td",
	                        null,
	                        this.state.count
	                    )
	                )
	            )
	        );
	    }
	});

	var ListInfo = React.createClass({
	    displayName: "ListInfo",

	    loadTimer: null,
	    getInitialState: function getInitialState() {
	        return {
	            count: 'loading...'
	        };
	    },
	    componentDidMount: function componentDidMount() {
	        this.loadDataFromServer();
	        this.loadTimer = setInterval(this.loadDataFromServer, this.props.pollInterval);
	    },
	    loadDataFromServer: function loadDataFromServer() {
	        return $.ajax({
	            url: this.props.urlListInfo,
	            method: 'post',
	            dataType: 'json'
	        }).done((function (data) {

	            if (data.type == 'succ') {
	                this.setState({ count: data.msg });
	            } else {
	                alert('服务端出现了一些错误' + data.msg);
	            }
	        }).bind(this)).fail((function (xhr, status, err) {

	            alert("出现了一些问题");
	            console.error(status, err.toString());
	        }).bind(this));
	    },
	    componentWillUnmount: function componentWillUnmount() {
	        clearInterval(this.loadTimer);
	    },
	    render: function render() {
	        return React.createElement(
	            "table",
	            { className: "list-info" },
	            React.createElement(
	                "tbody",
	                null,
	                React.createElement(
	                    "tr",
	                    null,
	                    React.createElement(
	                        "th",
	                        null,
	                        "List Num"
	                    )
	                ),
	                React.createElement(
	                    "tr",
	                    null,
	                    React.createElement(
	                        "td",
	                        null,
	                        this.state.count
	                    )
	                )
	            )
	        );
	    }
	});

	var AdminLauncher = React.createClass({
	    displayName: "AdminLauncher",

	    render: function render() {
	        return React.createElement(
	            "div",
	            { className: "cf" },
	            React.createElement(UserInfo, { urlUserInfo: "/admin/index/getUsersInfo", pollInterval: 1000 * 60 }),
	            React.createElement(ListInfo, { urlListInfo: "/admin/index/getListInfo", pollInterval: 1000 * 60 }),
	            React.createElement(Analytics, { urlInfo: "/admin/index/getInfo", pollInterval: 1000 * 60 })
	        );
	    }
	});

	React.render(React.createElement(AdminLauncher, null), document.getElementById('wrapper'));

/***/ }
]);