

//数据
var data = [
    {author: "小明", text: "一条信息"},
    {author: "小红", text: "二条信息"}
];


//class commentBox
var CommentBox = React.createClass({

    //组建初始状态
    getInitialState : function(){
        return {data : []};
    },


    //组建被渲染时调用
    componentDidMount : function(){
        this.loadCommentsFromServer();
        //setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    },

    loadCommentsFromServer : function(){
        var _this = this;
        $.ajax({
            url : this.props.url,
            dataType : "json",
            success : function(data){
                _this.setState({data:data});
            },
            error : function(xhr, status, err){
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });

    },

    handleCommentSubmit: function(comment) {

        var comments = this.state.data;
        var newComments = comments.concat([comment]);
        this.setState({data : newComments});

        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: comment,
            success: function(data) {
               // this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },

    render: function () {
        return (
            <div className="commentBox">
                <h1>Comments</h1>
                <CommentList data={this.state.data}/>
                <CommentForm  onCommentSubmit= {this.handleCommentSubmit}/>
            </div>
        );
    }
});


var CommentList = React.createClass({
    render: function () {

        var commentNodes = this.props.data.map(function (comment) {
            return (
                <Comment author={comment.author}>
                    {comment.text}
                </Comment>
            );
        });

        return (
            <div className="commentList">
                {commentNodes}
            </div>
        );
    }
});

var CommentForm = React.createClass({

    handleSubmit : function(e){
        //阻止浏览器默认提交表单
        e.preventDefault();

        var author = this.refs.author.getDOMNode().value.trim();
        var text = this.refs.text.getDOMNode().value.trim();
        if (!text || !author) {
            return;
        }
        this.refs.author.getDOMNode().value = '';
        this.refs.text.getDOMNode().value = '';

        //回传给父组件commentBox
        this.props.onCommentSubmit({author : author, text : text});
        return;
    },

    render: function () {

        return (
            //react 峰命名规范的方式给组件绑定事件处理器
           <form className="commentForm" onSubmit={this.handleSubmit}>

               <input type="text" placeholder="Your name"  ref="author"/>
               <input type="text" placeholder="Say something..." ref="text" />
               <button type="submit"  >Post</button>

           </form>
        );
    }
});


var converter = new Showdown.converter();

var Comment = React.createClass({

    render: function () {
        var rawMarkup = converter.makeHtml(this.props.children.toString());
        return (
            <div className="comment">
                <h2 className="commentAuthor">
                    {this.props.author}
                </h2>

                {/*这是测试一下标签注释*/}
                <span dangerouslySetInnerHTML={{__html: rawMarkup}}/>

                {/** 行内注释 data-name="123" **/}
                {/* <span >{rawMarkup}</span> */}
            </div>
        );
    }
});


//实例化
React.render(
    <CommentBox url="../json/comment.json" /** pollInterval={2000} **/></CommentBox>,
    document.getElementById('content')
);