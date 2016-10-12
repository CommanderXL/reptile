var util = require('util');
var events = require('events');
var methods = require('methods');
const event = new (require('events').EventEmitter)();   //事件实例

'use strict';

const ev = events.EventEmitter();   //新生成一个obj,这个obj上继承了发射器原型上的属性


function Stream() {
   //events.EventEmitter.call(this);  //传入this对象,通过constructor生成的实例同样会进程events.EventEmitter原型上的所有属性
}

util.inherits(Stream, events.EventEmitter);


var stream = new Stream();

stream.on('data', function (data) {
    console.log(data);
});


//stream.emit('data', 'Are you ok?');

var route = require('./route');         //如果route文件夹下没有package.json文件制定main字段的话,则会加载这个文件夹下的index.js,即Index.js会作为route文件夹的出口文件



var express = require('express')();


express.on('ok', function () {
    console.info('I have the method of event');
});

express.emit('ok', 'well')

