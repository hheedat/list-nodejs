var Analytics = React.createClass({displayName: "Analytics",
    getInitialState: function () {

    },
    componentDidMount: function () {

    },
    componentWillUnmount: function () {

    },
    render: function () {
        return (
            React.createElement("div", null, 
                React.createElement("div", {class: "visit"}, 
                    React.createElement("p", null, "uv:"), 
                    React.createElement("p", null, "pv:")
                )
            )
        );
    }
});

var AdminLauncher = React.createClass({displayName: "AdminLauncher",
    render: function () {
        return (
            React.createElement("div", null, 
                React.createElement(Analytics, null)
            )
        );
    }
});

React.render(
    React.createElement(AdminLauncher, null),
    document.getElementById('wrapper')
);