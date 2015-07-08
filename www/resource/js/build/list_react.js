var dispacherList = new Dispatcher();

var ListShow = React.createClass({displayName: "ListShow",
    getInitialState: function () {
        dispacherList.on("update-list",this.loadDataFromServer);
        return {
            data: []
        };
    },
    loadDataFromServer: function () {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            method:'post',
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
        this.loadDataFromServer();
        setInterval(this.loadDataFromServer, this.props.pollInterval);
    },
    render: function () {
        return (
            React.createElement("div", {className: "list-wrapper"}, 
                React.createElement("div", {className: "list-head"}, 
                    React.createElement("span", null)
                ), 
                React.createElement(ListCon, {data: this.state.data})
            )
        );
    }
});

var ListCon = React.createClass({displayName: "ListCon",
    render: function () {
        var listItem = this.props.data.map(function (item) {
            return (
                React.createElement("div", {className: "list-item cf"}, 
                    React.createElement("span", {className: "list-title"}, item.title), 
                    React.createElement("span", {className: "list-time"}, moment(item.time).endOf('day').fromNow())
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
    addList:function(e){
        var title = this.refs.title.getDOMNode().value.trim();
        if(!title){
            console.log("title can not be null");
            return ;
        }
        this.submitList({title:title});
        this.refs.title.getDOMNode().value = '';
    },
    submitList:function(data){
        $.ajax({
            url:this.props.url,
            dataType:'json',
            type:'POST',
            data:data,
            success:function(data){
                dispacherList.trigger("update-list");
            }.bind(this),
            error:function(xhr,status,err){
                console.error(this.props.url,status,err);
            }.bind(this)
        });
    },
    render:function(){
        return (
            React.createElement("div", {className: "list-add"}, 
                React.createElement("input", {type: "text", ref: "title", placeholder: "add new list ..."}), 
                React.createElement("button", {class: "add", onClick: this.addList}, "add")
            )
        );
    }
});

var List = React.createClass({displayName: "List",
    render:function(){
        return (
            React.createElement("div", {className: "list"}, 
                React.createElement(ListAdd, {url: "/home/list/add"}), 
                React.createElement(ListShow, {url: "/home/list/check", pollInterval: 1000*60})
            )
        );
    }
});

React.render(
    React.createElement(List, null),
    document.getElementById('list-con')
);