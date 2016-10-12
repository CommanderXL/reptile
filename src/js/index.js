/**
 * Created by XRene on 16/8/20.
 */
'use strict';
import React, {Component} from 'react';
import {render} from 'react-dom';
import Greeter from './component/greet';
import DropDown from './component/dropdown';
import $ from 'jquery';
import async from 'async';

require('../styles/common.less');
require('../styles/map.less');


/*var products = [
    {category: "Sporting Goods", price: "$49.99", stocked: true, name: "Football"},
    {category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball"},
    {category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball"},
    {category: "Electronics", price: "$99.99", stocked: true, name: "iPod Touch"},
    {category: "Electronics", price: "$399.99", stocked: false, name: "iPhone 5"},
    {category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7"}
];

var FilterableProductTable = React.createClass({
    getInitialState: function () {
        return {
            filterText: '',
            inStockOnly: false
        }
    },
    handleUserInput: function (filterText, inStockOnly) {
        this.setState({
            filterText: filterText,
            inStockOnly: inStockOnly
        });
    },
    render: function () {
        return (
            <div>
                <SearchBar
                    filterText={this.state.filterText}
                    inStockOnly={this.state.inStockOnly}
                    onUserInput={this.handleUserInput}
                    />
                <ProductTable
                    product={this.props.products}
                    filterText={this.state.filterText}
                    inStockOnly={this.state.inStockOnly}
                    />
            </div>
        )
    }
});

var SearchBar = React.createClass({
    changeHandle: function () {
        this.props.onUserInput(
            this.refs.searchBar.value,
            this.refs.stockOnly.checked
        );
    },
    render: function () {
        return (
            <form>
                <input type="text" placeholder="Search..." ref="searchBar" value={this.props.filterText} onChange={this.changeHandle}/>
                <p>
                    <input type="checkbox" ref="stockOnly" checked={this.props.inStockOnly} onChange={this.changeHandle}/>
                    {' '}
                    Only show products in stock
                </p>
            </form>
        )
    }
});

var ProductTable = React.createClass({
    render: function () {
        var dataList = this.props.product,
            lastCategory = null,
            rows = [];
        dataList.forEach(function(product ,index) {
            if(product.name.indexOf(this.props.filterText) === -1 || (!product.stocked && this.props.inStockOnly)) {
                return;
            }
            if(product.category !== lastCategory) {
                rows.push(<ProductCategoryRow category={product.category} key={product.category} />);
            }
            rows.push(<ProductRow product={product} key={product.name}/>);
            lastCategory = product.category;
        }.bind(this));
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
        )
    }
});

var ProductCategoryRow = React.createClass({
    render: function() {
        return (
            <tr>
                <td>{this.props.category}</td>
            </tr>
        )
    }
});

var ProductRow = React.createClass({

    render: function () {
        var name = this.props.product.stocked ?
            this.props.product.name :
            <span style={{color: 'red'}}>
                {this.props.product.name}
            </span>;
        return (
            <tr>
                <td>{name}</td>
                <td>{this.props.product.price}</td>
            </tr>
        )
    }
});*/


var map;

var _dataList = [
    {name: 'aa'},
    {name: 'bb'},
    {name: 'cc'}
];

var DropDownComponent = React.createClass({
    getInitialState: function () {
        return {
            city: '北京',
            district: [],
            loc: [],
            selectedDistrict: '',
            selectedLoc: ''
        }
    },
    componentDidMount: function () {
        $.ajax({
            url: '/getCity',
            method: 'get',
            success: function (data) {
                this.setState({
                    district: data
                });
            }.bind(this)
        });
    },
    districtChangeHandle: function (flag, district) {
        var data = {};
        if(flag === 'district') {
            this.setState({
                selectedDistrict: district
            });
            data.url = '/getLoc';
            data.params = {
                district: district
            };
        } else {
            data.url = '/getArea';
            data.params = {
                district: this.state.selectedDistrict,
                loc: district
            };
            this.setState({
                selectedLoc: district
            });
        }

        $.ajax({
            url: data.url,
            method: 'POST',
            data: data.params,
            success: function (data) {
                if(flag === 'district') {
                    this.setState({
                        loc: data
                    });
                } else {
                    if(data.length === 0) return alert('暂无数据');
                    this.props.getAllLoc(data);
                }
            }.bind(this)
        })
    },
    render: function () {
        return (
            <div className="dropdown-box">
                <DropDown
                    dataList={this.props.dataList}
                    keyName={'name'}
                    districtChangeHandle={this.districtChangeHandle}
                    />
                <DropDown
                    dataList={this.state.district}
                    keyName={'district'}
                    selectedDistrict={this.state.selectedDistrict}
                    districtChangeHandle={this.districtChangeHandle}
                    />
                <DropDown
                    dataList={this.state.loc}
                    keyName={'area'}
                    selectedLoc={this.state.selectedLoc}
                    districtChangeHandle={this.districtChangeHandle}
                    />
            </div>

        )
    }
});

var LocShowComponent = React.createClass({
    componentDidMount: function () {
        var map = new AMap.Map('map-container',{
            zoom: 10,
            center: [116.39, 39.9]
        });
    },
    render: function () {
        return (
            <div id={"map-container"}>
            </div>
        )
    }
});

var MapComponent = React.createClass({
    componentDidMount: function () {
        map = new AMap.Map('map-container',{
            zoom: 10,
            center: [116.39, 39.9]
        });
    },
    getInitialState: function () {
        return {
            locArr: []
        }
    },
    getAllLoc: function (data) {
        this.setState({
            locArr: data
        });

        AMap.service('AMap.PlaceSearch',function(){//回调函数
            //实例化PlaceSearch
            var placeSearch= new AMap.PlaceSearch({
                pageSize: 5,
                pageIndex: 1,
                city: "010"  //城市
            });
            console.log(this.state.locArr.length);
            async.mapLimit(this.state.locArr, 10, function (item, cb) {
                placeSearch.search(item.infoLoc, function (statue, result) {
                    var _loc = result.poiList.pois[0].location,
                        marker = new AMap.Marker({
                            position: [_loc.C, _loc.I],
                            title: item.infoTitle
                        });

                    marker.setMap(map);

                    cb('good');
                })
            }, function (err, results) {
                console.log('well done');
            });
            //TODO: 使用placeSearch对象调用关键字搜索的功能
            /*placeSearch.search(this.state.locArr[0].infoLoc, function (status, result) {
                var _loc = result.poiList.pois[0].location,
                    marker = new AMap.Marker({
                        position: [_loc.C, _loc.I]
                    });

                marker.setMap(map);
            });*/
        }.bind(this))
    },
    render: function () {

        var _dataList = [
            {name: '北京'},
            {name: 'bb'},
            {name: 'cc'}
        ];

        return (
            <div>
                <DropDownComponent
                    dataList={_dataList}
                    getAllLoc={this.getAllLoc}/>
                <LocShowComponent
                    locArr={this.state.locArr}/>
            </div>
        )
    }
});


//render(<FilterableProductTable products={products}/>, document.getElementById('root'));
render(<MapComponent />, document.querySelector('.dropdown'));

