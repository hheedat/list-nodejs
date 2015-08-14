var React = require('react');

var LoadingBar = React.createClass({
    getInitialState: function () {
        return {
            className: "loading"
        };
    },
    componentDidMount: function () {
        dispacher.list.on("show-loading", this.show);
        dispacher.list.on("hide-loading", this.hide);
    },
    show: function () {
        this.setState({className: "loading is-loading"});
    },
    hide: function () {
        this.setState({className: "loading is-loading loading-complete"});
        dispacher.list.trigger("last-update-time");
    },
    render: function () {
        return (
            <div className="loading-bar">
                <div ref="loadingBar" className={this.state.className}></div>
            </div>
        );
    }
});

module.exports = LoadingBar;