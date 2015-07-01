var ListShow = React.createClass({displayName: "ListShow",
    getInitialState: function () {
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
                    React.createElement("span", {className: "list-time"}, item.time)
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

React.render(
    React.createElement(ListShow, {url: "/home/list/check", pollInterval: 1000*60}),
    document.getElementById('list-con')
);