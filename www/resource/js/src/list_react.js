var ListShow = React.createClass({
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
            <div className="list-wrapper">
                <div className="list-head">
                    <span></span>
                </div>
                <ListCon data={this.state.data}/>
            </div>
        );
    }
});

var ListCon = React.createClass({
    render: function () {
        var listItem = this.props.data.map(function (item) {
            return (
                <div className="list-item cf">
                    <span className="list-title">{item.title}</span>
                    <span className="list-time">{moment(item.time).endOf('day').fromNow()}</span>
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
                this.setState();
            }.bind(this),
            error:function(xhr,status,err){
                console.error(this.props.url,status,err);
            }.bind(this)
        });
    },
    render:function(){
        return (
            <div className="list-add">
                <input type="text" ref="title" placeholder="add new list ..."/>
                <button class="add" onClick={this.addList}>add</button>
            </div>
        );
    }
});

var List = React.createClass({
    render:function(){
        return (
            <div className="list">
                <ListAdd url="/home/list/add" />
                <ListShow url="/home/list/check" pollInterval={1000*60}/>
            </div>
        );
    }
});

React.render(
    <List/>,
    document.getElementById('list-con')
);