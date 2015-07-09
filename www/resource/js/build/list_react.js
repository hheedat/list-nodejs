dispacher.list = new Dispatcher();

var ListShow = React.createClass({displayName: "ListShow",
    getInitialState: function () {
        dispacher.list.on("update-list", this.loadDataFromServer);
        return {
            data: []
        };
    },
    loadDataFromServer: function () {
        return $.ajax({
            url: this.props.url,
            dataType: 'json',
            method: 'post',
            success: function (data) {
                this.updataList(data);
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    updataList: function (data) {
        if (!data) {
            return false;
        }
        this.setState({data: data.msg});
    },
    componentDidMount: function () {
        this.loadDataFromServer().then(function () {
            dispacher.list.trigger("update-input-width");
        });
        setInterval(this.loadDataFromServer, this.props.pollInterval);
    },
    render: function () {
        return (
            React.createElement("div", {className: "list-wrapper"}, 
                React.createElement("div", {className: "list-head"}, 
                    React.createElement("span", null)
                ), 
                React.createElement(ListCon, {data: this.state.data, urlItemComplete: "/home/list/itemComplete", 
                         urlItemUndo: "/home/list/itemUndo"})
            )
        );
    }
});

var ListCon = React.createClass({displayName: "ListCon",
    changeItemStatus: function (e) {
        //console.log("e",e,e.target.checked,e.target.getAttribute("data-id"));
        e.stopPropagation();
        var url = e.target.checked ? this.props.urlItemComplete : this.props.urlItemUndo;
        return $.ajax({
            url: url,
            dataType: 'json',
            method: 'post',
            data: {
                id: e.target.getAttribute("data-id")
            },
            success: function (data) {
                dispacher.list.trigger("update-list");
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    checkItemDetail: function (id) {
        //console.log(e,e.target.key);
        console.log("id", id);
        dispacher.list.trigger("show-list-detail", id);
    },
    render: function () {
        var self = this;
        var listItem = this.props.data.map(function (item) {
            return (
                React.createElement("div", {className: "list-item cf", key: item.id, onClick: self.checkItemDetail.bind(self,item.id)}, 
                    React.createElement("input", {type: "checkbox", "data-id": item.id, onChange: self.changeItemStatus}), 
                    React.createElement("span", {className: "list-title"}, item.title), 
                    React.createElement("span", {className: "list-time"}, moment(item.time).startOf('minute').fromNow())
                )
            );
        });
        return (
            React.createElement("div", {className: "list-data"}, 
                listItem
            )
        );
    }
});

var ListAdd = React.createClass({displayName: "ListAdd",
    getInitialState: function () {
        dispacher.list.on("update-input-width", this.setInputWidth);
        return null;
    },
    componentDidMount: function () {
        this.setInputWidth();
        $(window).resize(this.setInputWidth);
    },
    setInputWidth: function () {
        var title = this.refs.title.getDOMNode();
        var addBtn = this.refs.addBtn.getDOMNode();
        title.style.width = (parseInt(getComputedStyle(title.parentNode).width) - parseInt(getComputedStyle(addBtn).width) - 40) + "px";
    },
    addList: function (e) {
        var title = this.refs.title.getDOMNode().value.trim();
        if (!title) {
            console.log("title can not be null");
            return;
        }
        this.submitList({title: title});
        this.refs.title.getDOMNode().value = '';
    },
    handleKeyDown: function (e) {
        if (e.keyCode === 13) {
            this.addList();
        }
    },
    submitList: function (data) {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: data,
            success: function (data) {
                dispacher.list.trigger("update-list");
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err);
            }.bind(this)
        });
    },
    render: function () {
        return (
            React.createElement("div", {className: "list-add cf"}, 
                React.createElement("input", {type: "text", className: "input-text", ref: "title", onKeyDown: this.handleKeyDown, 
                       placeholder: "add new list ..."}), 
                React.createElement("button", {ref: "addBtn", className: "add", onClick: this.addList}, "add")
            )
        );
    }
});

var ListDetail = React.createClass({displayName: "ListDetail",
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
        return $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: {
                id: id
            },
            success: function (data) {
                console.log("load list detail", data);
                this.updataList(data);
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err);
            }.bind(this)
        });
    },
    updataList: function (data) {
        if (!data) {
            return false;
        }
        if (data.type === "succ") {
            this.setState({data: data.msg});
        }
    },
    render: function () {
        var detail = null;
        if (this.state.data) {
            detail = (
                React.createElement("div", {className: "list-detail"}, 
                    React.createElement("div", {className: "list-control"}, 
                        React.createElement("button", null, "close")
                    ), 
                    React.createElement("div", {className: "title"}, 
                        React.createElement("input", {type: "text", className: "input-text", ref: "title", value: this.state.data.title}), 
                        React.createElement("input", {type: "text", className: "input-text", ref: "time", value: this.state.data.time}), 

                        React.createElement("div", {className: "content"}, 
                            React.createElement("textarea", {name: "", id: "", ref: "content"}, this.state.data.content)
                        )
                    )
                )
            )
        }
        return (
            React.createElement("div", null, 
                detail
            )
        );
    }
});

var List = React.createClass({displayName: "List",
    render: function () {
        return (
            React.createElement("div", {className: "list"}, 
                React.createElement(ListAdd, {url: "/home/list/add"}), 
                React.createElement(ListShow, {url: "/home/list/check", pollInterval: 1000*60}), 
                React.createElement(ListDetail, {url: "/home/list/checkDetail"})
            )
        );
    }
});

React.render(
    React.createElement(List, null),
    document.getElementById('list-con')
);