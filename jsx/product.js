/*
 * 1.拆分用户界面为一个组件树
 * FilterableProductTable 包含整个例子的容器
 *      SearchBar 接受所有 用户输入（ user input ）
 *      ProductTable 根据 用户输入（ user input ） 过滤和展示 数据集合（ data collection ）
 *          ProductCategoryRow   为每个 分类（ category ） 展示一列表头
 *          ProductRow  为每个 产品（ product ） 展示一列
 */



var FilterableProductTable = React.createClass({

    getInitialState : function(){
        return {
            filterText : "",
            inStockOnly : true
        }
    },

    render : function(){
        return (
            <div>
                <SearchBar filterText = {this.state.filterText} inStockOnly = {this.state.inStockOnly}  onUserInput={this.handleUserInput}></SearchBar>
                <ProductTable products={this.props.products}  filterText = {this.state.filterText} inStockOnly = {this.state.inStockOnly}></ProductTable>
            </div>
        );
    },

    handleUserInput : function(filterText,inStockOnly){
        this.setState({
            filterText: filterText,
            inStockOnly: inStockOnly
        })
    }
});

var ProductTable = React.createClass({
    render : function(){

        var rows = [];
        var lastCategory = null;

        var _this = this;


        this.props.products.forEach(function(product){

            if (product.name.indexOf(_this.props.filterText) === -1 || (!product.stocked && _this.props.inStockOnly)) {
                return;
            }

            if(product.category !== lastCategory){
                rows.push(<ProductCategoryRow category={product.category}   key={product.category}/>)
            }
            rows.push(<ProductRow product={product} key={product.name} />);
            lastCategory = product.category;
        });


        return (
           <table>
               <thead>
                   <tr>
                       <th>Name</th>
                       <th>Price</th>
                   </tr>
               </thead>
               <tbody>
                    {rows}
               </tbody>
           </table>
        );
    }
});


var ProductRow = React.createClass({
    render : function(){

        var name = this.props.product.stocked ?  this.props.product.name : <span style={{color:'red'}}>{this.props.product.name}</span>

        return (
            <tr>
                <td>{name}</td>
                <td>{this.props.product.price}</td>
            </tr>
        );
    }
});

var ProductCategoryRow = React.createClass({
    render : function(){
        return (
            <tr>
                <th colSpan="2">{this.props.category}</th>
            </tr>
        );
    }
});

var SearchBar = React.createClass({

    handleChange : function(){
        this.props.onUserInput(
            this.refs.filterTextInput.getDOMNode().value,
            this.refs.inStockOnlyInput.getDOMNode().checked
        );
    },

    render : function(){
        return (
        <form>
            <input type="text" placeholder="Search..." value={this.props.filterText} ref="filterTextInput"  onChange={this.handleChange} />
            <p>
                <input type="checkbox" checked={this.props.inStockOnly} ref="inStockOnlyInput"  onChange={this.handleChange}/>
                {' '}
                Only show products in stock
            </p>
        </form>
        )
    }
});



var data = [
    {"category": "Sporting Goods", "price": "$49.99", "stocked": true, "name": "Football"},
    {"category": "Sporting Goods", "price": "$9.99", "stocked": true, "name": "Baseball"},
    {"category": "Sporting Goods", "price": "$29.99", "stocked": false, "name": "Basketball"},
    {"category": "Electronics", "price": "$99.99", "stocked": true, "name": "iPod Touch"},
    {"category": "Electronics", "price": "$399.99", "stocked": false, "name": "iPhone 5"},
    {"category": "Electronics", "price": "$199.99", "stocked": true, "name": "Nexus 7"}
];

React.render(
    <FilterableProductTable products={data}></FilterableProductTable>,
    document.getElementById("content")
);

