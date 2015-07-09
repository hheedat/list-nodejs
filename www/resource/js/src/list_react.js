dispacher.list = new Dispatcher();

var ListShow = React.createClass({
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
        this.loadDataFromServer().then(function(){
            dispacher.list.trigger("update-input-width");
        });
        setInterval(this.loadDataFromServer, this.props.pollInterval);
    },
    render: function () {
        return (
            <div className="list-wrapper">
                <div className="list-head">
                    <span></span>
                </div>
                <ListCon data={this.state.data} urlItemComplete="/home/list/itemComplete" urlItemUndo="/home/list/itemUndo"/>
            </div>
        );
    }
});

var ListCon = React.createClass({
    changeItemStatus:function(e){
        console.log("e",e,e.target.checked,e.target.getAttribute("data-id"));
        var url = e.target.checked ? this.props.urlItemComplete : this.props.urlItemUndo;
        return $.ajax({
            url: url,
            dataType: 'json',
            method: 'post',
            data:{
                id:e.target.getAttribute("data-id")
            },
            success: function (data) {
                dispacher.list.trigger("update-list");
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    render: function () {
        var self = this;
        var listItem = this.props.data.map(function (item) {
            return (
                <div className="list-item cf" key={item.id}>
                    <input type="checkbox" data-id={item.id} onChange={self.changeItemStatus}/>
                    <span className="list-title">{item.title}</span>
                    <span className="list-time">{moment(item.time).startOf('minute').fromNow()}</span>
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
    handleKeyDown:function(e){
        if(e.keyCode === 13){
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
            <div className="list-add cf">
                <input type="text" className="input-text" ref="title"  onKeyDown={this.handleKeyDown} placeholder="add new list ..."/>
                <button ref="addBtn" className="add" onClick={this.addList}>add</button>
            </div>
        );
    }
});

var List = React.createClass({
    render: function () {
        return (
            <div className="list">
                <ListAdd url="/home/list/add"/>
                <ListShow url="/home/list/check" pollInterval={1000*60}/>
            </div>
        );
    }
});

var ListDetail = React.createClass({
    getInitialState: function () {
        return null;
    },
    componentDidMount: function () {
        this.loadDataFromServer();
    },
    loadDataFromServer: function () {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: {
                id: this.props.dataID
            },
            success: function (data) {
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
        return (
            <div className="list-detail">
                <div className="title">
                    <input type="text" className="input-text" ref="title" value={data.title}/>
                    <input type="text" className="input-text" ref="time" value={data.time}/>
                    <div className="content">
                        <textarea name="" id="" ref="content">{data.content}</textarea>
                    </div>
                </div>
            </div>
        );
    }
});

React.render(
    <List/>,
    document.getElementById('list-con')
);