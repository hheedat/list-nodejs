var LastUpdateTime = React.createClass({
    timer: null,
    lastUpdateTime: null,
    getInitialState: function () {
        dispacher.list.on("last-update-time", this.newTime);
        this.lastUpdateTime = moment();
        return {
            time: null//moment(this.lastUpdateTime).startOf('second').fromNow()
        };
    },
    newTime: function () {
        this.lastUpdateTime = moment();
        this.updateTime();
    },
    updateTime: function () {
        this.setState({time: moment(this.lastUpdateTime).format("MM-DD HH:mm:ss")});
    },
    componentDidMount: function () {
        this.timer = setInterval(function () {
            this.updateTime();
        }.bind(this), this.props.updateInterval);
    },
    componentWillUnmount: function () {
        clearInterval(this.timer);
    },
    render: function () {
        return (
            <span>
                {this.state.time ? "LAST UPDATE：" + this.state.time : ""}
            </span>
        );
    }
});

React.render(
    <LastUpdateTime updateInterval={1000*60}/>,
    document.getElementById('last-update')
);