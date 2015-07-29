var Analytics = React.createClass({
    getInitialState: function () {

    },
    componentDidMount: function () {

    },
    componentWillUnmount: function () {

    },
    render: function () {
        return (
            <div>
                <div class="visit">
                    <p>uv:</p>
                    <p>pv:</p>
                </div>
            </div>
        );
    }
});

var AdminLauncher = React.createClass({
    render: function () {
        return (
            <div>
                <Analytics/>
            </div>
        );
    }
});

React.render(
    <AdminLauncher/>,
    document.getElementById('wrapper')
);