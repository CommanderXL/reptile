var util = require('util');
var events = require('events');


const ev = events.EventEmitter();   //新生成一个obj,这个obj上继承了发射器原型上的属性


function Stream() {
   //events.EventEmitter.call(this);  //传入this对象,通过constructor生成的实例同样会进程events.EventEmitter原型上的所有属性
}

util.inherits(Stream, events.EventEmitter);


var stream = new Stream();

stream.on('data', function (data) {
    console.log(data);
});


stream.emit('data', 'Are you ok?');

console.log(Stream.super_);
