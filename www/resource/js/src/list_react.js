'use strict';
var React = require('react');
var $ = require("jquery");
var moment = require("moment");
var Dispatcher = require('./dispacher');
var LastUpdateTime = require('./up_time_react');
var LoadingBar = require('./loading_bar_react');

dispacher.list = new Dispatcher();

var ListShow = React.createClass({
    timer: null,
    getInitialState: function () {
        return {
            data: []
        };
    },
    loadDataFromServer: function () {
        dispacher.list.trigger("show-loading");

        return $.ajax({
            url: this.props.url,
            dataType: 'json',
            method: 'post'
        }).done(function (data) {

            if (data.type == 'succ') {
                this.updateList(data);
            } else {
                alert('服务端出现了一些错误' + data.msg);
            }

        }.bind(this)).fail(function (xhr, status, err) {

            alert("出现了一些问题");
            console.error(this.props.url, status, err.toString());

        }.bind(this)).always(function () {

            dispacher.list.trigger("hide-loading");

        });

    },
    updateList: function (data) {
        if (!data) {
            return false;
        }
        this.setState({data: data.msg});
    },
    componentDidMount: function () {
        dispacher.list.on("update-list", this.loadDataFromServer);
        this.loadDataFromServer().then(function () {
            dispacher.list.trigger("update-input-width");
        });
        this.timer = setInterval(this.loadDataFromServer, this.props.pollInterval);
    },
    componentWillUnmount: function () {
        dispacher.list.off("update-list", this.loadDataFromServer);
        clearInterval(this.timer);
    },
    render: function () {
        return (
            <div className="list-wrapper">
                <div className="list-head">
                    <span></span>
                </div>
                <ListCon data={this.state.data} urlItemComplete="/home/list/itemComplete"
                         urlItemUndo="/home/list/itemUndo"/>
            </div>
        );
    }
});

var ListCon = React.createClass({
    changeItemStatus: function (e) {
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

            if (data.type == 'succ') {
                dispacher.list.trigger("update-list");
            } else {
                alert('服务端出现了一些错误' + data.msg);
            }

        }).fail(function (xhr, status, err) {

            alert("出现了一些问题");
            console.error(this.props.url, status, err.toString());

        }.bind(this)).always(function () {

            dispacher.list.trigger("hide-loading");

        });
    },
    checkItemDetail: function (id) {
        dispacher.list.trigger("show-list-detail", id);
    },
    render: function () {
        var self = this;
        var listItem = this.props.data.map(function (item) {
            return (
                <div className="list-item cf" key={item.id} onClick={self.checkItemDetail.bind(self,item.id)}>
                    <input type="checkbox" data-id={item.id} onClick={self.changeItemStatus}
                           defaultChecked={item.status ? false : true}/>
                    <span className="list-title">{item.title}</span>
                    <span className="list-time">
                        { moment().date() != moment(item.time).date() ? moment().format("l") : moment(item.time).startOf('second').fromNow()}
                    </span>
                </div>
            );
        });
        return (
            <div className="list-data">
                {listItem}
            </div>
        );
    }
});

var ListAdd = React.createClass({
    getInitialState: function () {
        dispacher.list.on("update-input-width", this.setInputWidth);
        return {
            inputWidth: null
        };
    },
    componentDidMount: function () {
        this.setInputWidth();
        window.addEventListener("resize", this.handleResize);
    },
    setInputWidth: function () {
        var title = this.refs.title.getDOMNode();
        var addBtn = this.refs.addBtn.getDOMNode();
        this.setState({
            inputWidth: (parseInt(getComputedStyle(title.parentNode).width) - parseInt(addBtn.offsetWidth) - 35) + "px"
        });
    },
    addList: function (e) {
        var title = this.refs.title.getDOMNode().value.trim();
        if (!title) {
            return;
        }
        this.submitList({title: title});
        this.refs.title.getDOMNode().value = '';
    },
    handleResize: function () {
        this.setInputWidth();
    },
    handleKeyDown: function (e) {
        if (e.keyCode === 13) {
            this.addList();
        }
    },
    submitList: function (data) {
        dispacher.list.trigger("show-loading");

        return $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'post',
            data: data
        }).done(function (data) {

            if (data.type == 'succ') {
                dispacher.list.trigger("update-list");
            } else {
                alert('服务端出现了一些错误' + data.msg);
            }

        }.bind(this)).fail(function (xhr, status, err) {

            console.error(this.props.url, status, err);
            alert("出现了一些问题");

        }.bind(this)).always(function () {

            dispacher.list.trigger("hide-loading");

        });
    },
    componentWillUnmount: function () {
        window.removeEventListener("resize", this.handleResize);
    },
    render: function () {
        return (
            <div className="list-add cf">
                <input type="text" className="input-text" ref="title" style={{width:this.state.inputWidth}}
                       onKeyDown={this.handleKeyDown}
                       placeholder="add new list ..."/>
                <button ref="addBtn" className="add" onClick={this.addList}>add</button>
            </div>
        );
    }
});

var ListDetail = React.createClass({
    dataID: null,
    getInitialState: function () {
        dispacher.list.on("show-list-detail", this.loadDataFromServer);
        return {
            data: null
        };
    },
    componentDidMount: function () {
        //this.loadDataFromServer();
    },
    loadDataFromServer: function (e, id) {
        this.dataID = id;
        dispacher.list.trigger("show-loading");

        return $.ajax({
            url: this.props.urlCheck,
            dataType: 'json',
            type: 'POST',
            data: {
                id: id
            }
        }).done(function (data) {

            if (data.type == 'succ') {
                this.updateList(data);
                setTimeout(function () {
                    $(this.refs.mask.getDOMNode()).addClass("list-detail-mask-show");
                    $(this.refs.wrapper.getDOMNode()).addClass("list-detail-wrapper-show");
                }.bind(this));
            } else {
                alert('服务端出现了一些错误' + data.msg);
            }

        }.bind(this)).fail(function (xhr, status, err) {

            console.error(this.props.url, status, err);
            alert("出现了一些问题");

        }.bind(this)).always(function () {

            dispacher.list.trigger("hide-loading");

        });
    },
    updateList: function (data) {
        if (!data) {
            return false;
        }

        this.setState({data: data.msg});
    },
    updateData: function () {
        var self = this;
        var title = this.refs.title.getDOMNode().value.trim();
        var content = this.refs.content.getDOMNode().value.trim();
        if (!title) {
            alert("title can not be null");
            return;
        }
        dispacher.list.trigger("show-loading");

        var jqxhr = $.ajax({
            url: this.props.urlUpdate,
            dataType: 'json',
            method: 'post',
            data: {
                id: this.dataID,
                title: title,
                content: content
            }
        });

        jqxhr.done(function (data) {

            if (data.type == "succ") {
                self.closeDetail();
                dispacher.list.trigger("update-list");
            } else {
                alert('服务端出现了一些错误' + data.msg);
            }

        }).fail(function (xhr, status, err) {

            console.error(this.props.url, status, err);
            alert("出现了一些问题");

        }.bind(this)).always(function () {

            dispacher.list.trigger("hide-loading");

        });
    },
    deleteData: function (e) {
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
        }).done(function (data) {

            if (data.type == "succ") {
                self.closeDetail();
                dispacher.list.trigger("update-list");
            } else {
                alert('服务端出现了一些错误' + data.msg);
            }

        }).fail(function (xhr, status, err) {

            console.error(this.props.url, status, err);
            alert("出现了一些问题");

        }.bind(this)).always(function () {

            dispacher.list.trigger("hide-loading");

        });
    },
    closeDetail: function (e) {
        if (!e || e.target.className.match(/list-detail-mask/) || e.target.className == "close-btn") {
            $(this.refs.wrapper.getDOMNode()).removeClass("list-detail-wrapper-show");
            $(this.refs.wrapper.getDOMNode()).removeClass("list-detail-wrapper-show");
            setTimeout(function () {
                this.setState({data: null});
            }.bind(this), 200);
        }
    },
    render: function () {
        var detail = null;
        if (this.state.data) {
            detail = (
                <div className="list-detail-mask" ref="mask" onClick={this.closeDetail}>
                    <div className="list-detail-wrapper" ref="wrapper">
                        <div className="list-detail">
                            <div className="list-control cf">
                                <button className="update-btn" onClick={this.updateData}>update</button>
                                <button className="close-btn" onClick={this.closeDetail}>close</button>
                            </div>
                            <div className="list-detail-data">
                                <textarea className="my-textarea" ref="title" defaultValue={this.state.data.title}/>
                                <input type="text" className="input-text" ref="time" disabled="disabled"
                                       value={moment(this.state.data.time).format("YYYY-MM-DD HH:mm:ss")}/>

                                <div className="content">
                                    <textarea className="my-textarea" ref="content"
                                              defaultValue={this.state.data.content}/>
                                </div>
                            </div>
                            <a className="del-btn" onClick={this.deleteData}>delete</a>
                        </div>
                    </div>
                </div>
            )
        }
        return (
            <div>
                {detail}
            </div>
        );
    }
});

var ListShowComplete = React.createClass({
    isShow: false,
    toggleShow: function () {
        if (this.isShow) {
            //console.log(React.unmountComponentAtNode(document.getElementById("list-complete-show")));
            this.isShow = false;
            this.forceUpdate();
        } else {
            this.isShow = true;
            this.forceUpdate();
        }
    },
    render: function () {
        var inner = this.isShow ? (
            <div id="list-complete-show">
                <ListShow url="/home/list/checkComplete" pollInterval={1000*60}/>
            </div>
        ) : null;
        return (
            <div id="list-complete">
                <div className="show-complete">
                    <a className="show-complete-toggle" onClick={this.toggleShow} href="javascript:void(0);">
                        {this.isShow ? "HIDE COMPLETED ITEMS" : "SHOW COMPLETED ITEMS"}</a>
                </div>
                {inner}
            </div>
        );
    }
});

var List = React.createClass({
    render: function () {
        return (
            <div className="list">
                <LoadingBar/>
                <ListAdd url="/home/list/add"/>
                <ListShow url="/home/list/check" pollInterval={1000*60}/>
                <ListDetail urlCheck="/home/list/checkDetail" urlUpdate="/home/list/update"
                            urlDelete="/home/list/delete"/>
                <ListShowComplete/>
            </div>
        );
    }
});

React.initializeTouchEvents(true);
React.render(
    <List/>,
    document.getElementById('list-con')
);

React.render(
    <LastUpdateTime updateInterval={1000*60}/>,
    document.getElementById('last-update')
);