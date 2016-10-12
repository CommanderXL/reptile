/**
 * Created by XRene on 16/8/23.
 */
'use strict';

import React from 'react';
import classSet from 'classnames';
import {render} from 'react-dom';


require('../../styles/dropdown.less');


var DropDown = React.createClass({
    getInitialState: function () {
        return {
            isListShow: true,
            tips: '点击查看'
        }
    },
    nameClickHandle: function () {
        this.setState({isListShow: !this.state.isListShow});
    },
    changeTipsHandle: function (name) {
        this.setState({
            tips: name,
            isListShow: !this.state.isListShow
        });
    },
    render: function () {
        return (
            <div className="dropdown">
                <p className="dropdown-name" onClick={this.nameClickHandle}>{this.state.tips}</p>
                <DropDownList
                    dataList={this.props.dataList}
                    isListShow={this.state.isListShow}
                    districtChangeHandle={this.props.districtChangeHandle}
                    changeTipsHandle={this.changeTipsHandle}
                    keyName={this.props.keyName}/>
            </div>
        )
    }
});


var DropDownList = React.createClass({
    testHandle: function (keyName, name) {
        this.props.districtChangeHandle(keyName, name);
        this.props.changeTipsHandle(name);
    },
    render: function () {
        //如果数据为空则返回
        if(!this.props.dataList || this.props.dataList.length == 0) {
            return  (<div></div>);
        }

        var dataList = this.props.dataList.map(function (item, index) {
            return  <li key={index} onClick={this.testHandle.bind(this, this.props.keyName, item[this.props.keyName])}>{item[this.props.keyName]}</li>
        }.bind(this));  //这个地方注意this的处理,将事件函数上下文绑定到组件实例上

        var classes = classSet({
            'dropdown-list': true,
            'isListShow': this.props.isListShow
        });

        return (
            <div className={classes}>
                <ul className="list-box">
                    {dataList}
                </ul>
            </div>
        )
    }
});

export default DropDown;


