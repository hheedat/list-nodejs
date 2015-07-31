webpackJsonp([2],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var React = __webpack_require__(1);
	var $ = __webpack_require__(157);
	var moment = __webpack_require__(158);
	var Dispatcher = __webpack_require__(244);
	var LastUpdateTime = __webpack_require__(245);

	dispacher.list = new Dispatcher();

	var ListShow = React.createClass({
	    displayName: 'ListShow',

	    timer: null,
	    getInitialState: function getInitialState() {
	        return {
	            data: []
	        };
	    },
	    loadDataFromServer: function loadDataFromServer() {
	        dispacher.list.trigger("show-loading");

	        return $.ajax({
	            url: this.props.url,
	            dataType: 'json',
	            method: 'post'
	        }).done((function (data) {

	            this.updateList(data);
	        }).bind(this)).fail((function (xhr, status, err) {

	            alert("出现了一些问题");
	            console.error(this.props.url, status, err.toString());
	        }).bind(this)).always(function () {

	            dispacher.list.trigger("hide-loading");
	        });
	    },
	    updateList: function updateList(data) {
	        if (!data) {
	            return false;
	        }
	        this.setState({ data: data.msg });
	    },
	    componentDidMount: function componentDidMount() {
	        dispacher.list.on("update-list", this.loadDataFromServer);
	        this.loadDataFromServer().then(function () {
	            dispacher.list.trigger("update-input-width");
	        });
	        this.timer = setInterval(this.loadDataFromServer, this.props.pollInterval);
	    },
	    componentWillUnmount: function componentWillUnmount() {
	        dispacher.list.off("update-list", this.loadDataFromServer);
	        clearInterval(this.timer);
	    },
	    render: function render() {
	        return React.createElement(
	            'div',
	            { className: "list-wrapper" },
	            React.createElement(
	                'div',
	                { className: "list-head" },
	                React.createElement('span', null)
	            ),
	            React.createElement(ListCon, { data: this.state.data, urlItemComplete: "/home/list/itemComplete",
	                urlItemUndo: "/home/list/itemUndo" })
	        );
	    }
	});

	var ListCon = React.createClass({
	    displayName: 'ListCon',

	    changeItemStatus: function changeItemStatus(e) {
	        e.stopPropagation();
	        var url = e.target.checked ? this.props.urlItemComplete : this.props.urlItemUndo;
	        dispacher.list.trigger("show-loading");

	        return $.ajax({
	            url: url,
	            dataType: 'json',
	            method: 'post',
	            data: {
	                id: e.target.getAttribute("data-id")
	            }
	        }).done(function (data) {

	            dispacher.list.trigger("update-list");
	        }).fail((function (xhr, status, err) {

	            alert("出现了一些问题");
	            console.error(this.props.url, status, err.toString());
	        }).bind(this)).always(function () {

	            dispacher.list.trigger("hide-loading");
	        });
	    },
	    checkItemDetail: function checkItemDetail(id) {
	        dispacher.list.trigger("show-list-detail", id);
	    },
	    render: function render() {
	        var self = this;
	        var listItem = this.props.data.map(function (item) {
	            return React.createElement(
	                'div',
	                { className: "list-item cf", key: item.id, onClick: self.checkItemDetail.bind(self, item.id) },
	                React.createElement('input', { type: "checkbox", 'data-id': item.id, onClick: self.changeItemStatus,
	                    defaultChecked: item.status ? false : true }),
	                React.createElement(
	                    'span',
	                    { className: "list-title" },
	                    item.title
	                ),
	                React.createElement(
	                    'span',
	                    { className: "list-time" },
	                    moment().date() != moment(item.time).date() ? moment().format("l") : moment(item.time).startOf('second').fromNow()
	                )
	            );
	        });
	        return React.createElement(
	            'div',
	            { className: "list-data" },
	            listItem
	        );
	    }
	});

	var ListAdd = React.createClass({
	    displayName: 'ListAdd',

	    getInitialState: function getInitialState() {
	        dispacher.list.on("update-input-width", this.setInputWidth);
	        return null;
	    },
	    componentDidMount: function componentDidMount() {
	        this.setInputWidth();
	        $(window).resize(this.setInputWidth);
	    },
	    setInputWidth: function setInputWidth() {
	        var title = this.refs.title.getDOMNode();
	        var addBtn = this.refs.addBtn.getDOMNode();
	        title.style.width = parseInt(getComputedStyle(title.parentNode).width) - parseInt(getComputedStyle(addBtn).width) - 40 + "px";
	    },
	    addList: function addList(e) {
	        var title = this.refs.title.getDOMNode().value.trim();
	        if (!title) {
	            return;
	        }
	        this.submitList({ title: title });
	        this.refs.title.getDOMNode().value = '';
	    },
	    handleKeyDown: function handleKeyDown(e) {
	        if (e.keyCode === 13) {
	            this.addList();
	        }
	    },
	    submitList: function submitList(data) {
	        dispacher.list.trigger("show-loading");

	        return $.ajax({
	            url: this.props.url,
	            dataType: 'json',
	            type: 'post',
	            data: data
	        }).done((function (data) {

	            dispacher.list.trigger("update-list");
	        }).bind(this)).fail((function (xhr, status, err) {

	            console.error(this.props.url, status, err);
	            alert("出现了一些问题");
	        }).bind(this)).always(function () {

	            dispacher.list.trigger("hide-loading");
	        });
	    },
	    render: function render() {
	        return React.createElement(
	            'div',
	            { className: "list-add cf" },
	            React.createElement('input', { type: "text", className: "input-text", ref: "title", onKeyDown: this.handleKeyDown,
	                placeholder: "add new list ..." }),
	            React.createElement(
	                'button',
	                { ref: "addBtn", className: "add", onClick: this.addList },
	                'add'
	            )
	        );
	    }
	});

	var ListDetail = React.createClass({
	    displayName: 'ListDetail',

	    dataID: null,
	    getInitialState: function getInitialState() {
	        dispacher.list.on("show-list-detail", this.loadDataFromServer);
	        return {
	            data: null
	        };
	    },
	    componentDidMount: function componentDidMount() {
	        //this.loadDataFromServer();
	    },
	    loadDataFromServer: function loadDataFromServer(e, id) {
	        this.dataID = id;
	        dispacher.list.trigger("show-loading");

	        return $.ajax({
	            url: this.props.urlCheck,
	            dataType: 'json',
	            type: 'POST',
	            data: {
	                id: id
	            }
	        }).done((function (data) {

	            this.updateList(data);
	            setTimeout((function () {
	                $(this.refs.mask.getDOMNode()).addClass("list-detail-mask-show");
	                $(this.refs.wrapper.getDOMNode()).addClass("list-detail-wrapper-show");
	            }).bind(this));
	        }).bind(this)).fail((function (xhr, status, err) {

	            console.error(this.props.url, status, err);
	            alert("出现了一些问题");
	        }).bind(this)).always(function () {

	            dispacher.list.trigger("hide-loading");
	        });
	    },
	    updateList: function updateList(data) {
	        if (!data) {
	            return false;
	        }
	        if (data.type === "succ") {
	            this.setState({ data: data.msg });
	        }
	    },
	    updateData: function updateData() {
	        var self = this;
	        var title = this.refs.title.getDOMNode().value.trim();
	        var content = this.refs.content.getDOMNode().value.trim();
	        if (!title) {
	            alert("title can not be null");
	            return;
	        }
	        dispacher.list.trigger("show-loading");

	        return $.ajax({
	            url: this.props.urlUpdate,
	            dataType: 'json',
	            method: 'post',
	            data: {
	                id: this.dataID,
	                title: title,
	                content: content
	            }
	        }).done(function () {

	            self.closeDetail();
	            dispacher.list.trigger("update-list");
	        }).fail((function (xhr, status, err) {

	            console.error(this.props.url, status, err);
	            alert("出现了一些问题");
	        }).bind(this)).always(function () {

	            dispacher.list.trigger("hide-loading");
	        });
	    },
	    deleteData: function deleteData(e) {
	        e.preventDefault();
	        var self = this;
	        dispacher.list.trigger("show-loading");

	        return $.ajax({
	            url: this.props.urlDelete,
	            dataType: 'json',
	            method: 'post',
	            data: {
	                id: this.dataID
	            }
	        }).done(function () {

	            self.closeDetail();
	            dispacher.list.trigger("update-list");
	        }).fail((function (xhr, status, err) {

	            console.error(this.props.url, status, err);
	            alert("出现了一些问题");
	        }).bind(this)).always(function () {

	            dispacher.list.trigger("hide-loading");
	        });
	    },
	    closeDetail: function closeDetail(e) {
	        if (!e || e.target.className.match(/list-detail-mask/) || e.target.className == "close-btn") {
	            $(this.refs.wrapper.getDOMNode()).removeClass("list-detail-wrapper-show");
	            $(this.refs.wrapper.getDOMNode()).removeClass("list-detail-wrapper-show");
	            setTimeout((function () {
	                this.setState({ data: null });
	            }).bind(this), 200);
	        }
	    },
	    render: function render() {
	        var detail = null;
	        if (this.state.data) {
	            detail = React.createElement(
	                'div',
	                { className: "list-detail-mask", ref: "mask", onClick: this.closeDetail },
	                React.createElement(
	                    'div',
	                    { className: "list-detail-wrapper", ref: "wrapper" },
	                    React.createElement(
	                        'div',
	                        { className: "list-detail" },
	                        React.createElement(
	                            'div',
	                            { className: "list-control cf" },
	                            React.createElement(
	                                'button',
	                                { className: "update-btn", onClick: this.updateData },
	                                'update'
	                            ),
	                            React.createElement(
	                                'button',
	                                { className: "close-btn", onClick: this.closeDetail },
	                                'close'
	                            )
	                        ),
	                        React.createElement(
	                            'div',
	                            { className: "list-detail-data" },
	                            React.createElement('textarea', { className: "my-textarea", ref: "title", defaultValue: this.state.data.title }),
	                            React.createElement('input', { type: "text", className: "input-text", ref: "time", disabled: "disabled",
	                                value: moment(this.state.data.time).format("YYYY-MM-DD HH:mm:ss") }),
	                            React.createElement(
	                                'div',
	                                { className: "content" },
	                                React.createElement('textarea', { className: "my-textarea", ref: "content",
	                                    defaultValue: this.state.data.content })
	                            )
	                        ),
	                        React.createElement(
	                            'a',
	                            { className: "del-btn", onClick: this.deleteData },
	                            'delete'
	                        )
	                    )
	                )
	            );
	        }
	        return React.createElement(
	            'div',
	            null,
	            detail
	        );
	    }
	});

	var ListShowComplete = React.createClass({
	    displayName: 'ListShowComplete',

	    isShow: false,
	    toggleShow: function toggleShow() {
	        if (this.isShow) {
	            //console.log(React.unmountComponentAtNode(document.getElementById("list-complete-show")));
	            this.isShow = false;
	            this.forceUpdate();
	        } else {
	            this.isShow = true;
	            this.forceUpdate();
	        }
	    },
	    render: function render() {
	        var inner = this.isShow ? React.createElement(
	            'div',
	            { id: "list-complete-show" },
	            React.createElement(ListShow, { url: "/home/list/checkComplete", pollInterval: 1000 * 60 })
	        ) : null;
	        return React.createElement(
	            'div',
	            { id: "list-complete" },
	            React.createElement(
	                'div',
	                { className: "show-complete" },
	                React.createElement(
	                    'a',
	                    { className: "show-complete-toggle", onClick: this.toggleShow, href: "javascript:void(0);" },
	                    this.isShow ? "HIDE COMPLETED ITEMS" : "SHOW COMPLETED ITEMS"
	                )
	            ),
	            inner
	        );
	    }
	});

	var LoadingBar = React.createClass({
	    displayName: 'LoadingBar',

	    getInitialState: function getInitialState() {
	        return {
	            className: "loading"
	        };
	    },
	    componentDidMount: function componentDidMount() {
	        dispacher.list.on("show-loading", this.show);
	        dispacher.list.on("hide-loading", this.hide);
	    },
	    show: function show() {
	        this.setState({ className: "loading is-loading" });
	    },
	    hide: function hide() {
	        this.setState({ className: "loading is-loading loading-complete" });
	        dispacher.list.trigger("last-update-time");
	    },
	    render: function render() {
	        return React.createElement(
	            'div',
	            { className: "loading-bar" },
	            React.createElement('div', { ref: "loadingBar", className: this.state.className })
	        );
	    }
	});

	var List = React.createClass({
	    displayName: 'List',

	    render: function render() {
	        return React.createElement(
	            'div',
	            { className: "list" },
	            React.createElement(LoadingBar, null),
	            React.createElement(ListAdd, { url: "/home/list/add" }),
	            React.createElement(ListShow, { url: "/home/list/check", pollInterval: 1000 * 60 }),
	            React.createElement(ListDetail, { urlCheck: "/home/list/checkDetail", urlUpdate: "/home/list/update",
	                urlDelete: "/home/list/delete" }),
	            React.createElement(ListShowComplete, null)
	        );
	    }
	});

	React.initializeTouchEvents(true);
	React.render(React.createElement(List, null), document.getElementById('list-con'));

	React.render(React.createElement(LastUpdateTime, { updateInterval: 1000 * 60 }), document.getElementById('last-update'));

/***/ },

/***/ 244:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $ = __webpack_require__(157);

	var Dispacher = window.Dispatcher = function () {
	    $.extend(this, $({}));
	};
	var dispacher = window.dispacher = {};

	module.exports = Dispatcher;

/***/ },

/***/ 245:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var React = __webpack_require__(1);
	var moment = __webpack_require__(158);

	var LastUpdateTime = React.createClass({
	    displayName: "LastUpdateTime",

	    timer: null,
	    lastUpdateTime: null,
	    getInitialState: function getInitialState() {
	        dispacher.list.on("last-update-time", this.newTime);
	        this.lastUpdateTime = moment();
	        return {
	            time: null //moment(this.lastUpdateTime).startOf('second').fromNow()
	        };
	    },
	    newTime: function newTime() {
	        this.lastUpdateTime = moment();
	        this.updateTime();
	    },
	    updateTime: function updateTime() {
	        this.setState({ time: moment(this.lastUpdateTime).format("MM-DD HH:mm:ss") });
	    },
	    componentDidMount: function componentDidMount() {
	        this.timer = setInterval((function () {
	            this.updateTime();
	        }).bind(this), this.props.updateInterval);
	    },
	    componentWillUnmount: function componentWillUnmount() {
	        clearInterval(this.timer);
	    },
	    render: function render() {
	        return React.createElement(
	            "span",
	            null,
	            this.state.time ? "LAST SYNC：" + this.state.time : ""
	        );
	    }
	});

	module.exports = LastUpdateTime;

/***/ }

});