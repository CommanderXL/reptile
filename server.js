const request = require('superagent');
const cheerio = require('cheerio');
const config = require('./config');
const event = new (require('events').EventEmitter)();   //事件实例
const path = require('path');
const async = require('async');
const phantom = require('phantom');     //提供一个js的runtime
const $$ = require('jquery');
const mysql = require('mysql');



//phantomInit构造实例
var phantomInit = function (url, cb1, cb2) {
    var phInstance = null,
        sitePage= null;
    phantom.create().then(instance => {
        "use strict";
        phInstance = instance;
        return instance.createPage();
    }).then(page => {
        "use strict";
        sitePage = page;
        return page.open(url);
    }).then(status => {
        "use strict";
        sitePage.evaluate(cb1).then(cb2)
        return sitePage.property('content');
    }).then(content => {
        "use strict";
        sitePage.close();   //页面关闭
        phInstance.exit();  //ph进程退出
    });
};

/*
phantomInit('http://bj.lianjia.com/zufang/dongcheng/', function () {
    "use strict";
    return document.querySelector('body').innerHTML;
}, function (html) {
    console.log(html);
});*/


//抓取所有的大区数据
request.get(config.web[0].baseUrl)
    .end((err, res) => {
        "use strict";
        let $ = cheerio.load(res.text),
            optionList = $('[data-index=0] .option-list a');

        let areaList = [];
        for(let key in optionList) {
            var _index = Number(key);
            if(_index > 0 && _index < 18) {
                let area = optionList[key],
                    _obj = {
                        name: '',
                        url: ''
                    };
                if(area.children) {
                    _obj.name = area.children[0].data;
                    _obj.url = area.attribs.href;
                    areaList.push(_obj);
                }
            }
        }
        event.emit('bigArea', areaList);
    });



//抓取大区对应的小区数据
event.addListener('bigArea', function (areaList) {
    areaList = areaList || [];
    var url = config.web[0].rootUrl;
    //console.log(url);
    areaList.forEach(function (item, index) {
        item.url = url + item.url
    });
    areaList.length = 1;
    //控制并发抓取小区数据
    async.mapSeries(areaList, function (item, cb) {
        "use strict";

        item.locationList = [];

        request.get(item.url)
            .end((err, res) => {
                let $ = cheerio.load(res.text),
                    optionList = $('[data-index=0] .sub-option-list a');

                for(let key in optionList) {
                    if(typeof Number(key) === 'number' && Number(key)) {
                        let area = optionList[key],
                            _obj = {
                                name: '',
                                url: ''
                            };
                        if(area.children) {
                            _obj.name = area.children[0].data;
                            _obj.url = url + area.attribs.href;
                            item.locationList.push(_obj);
                        }
                    }
                }
                cb(null, item);
            });
    }, function (err, results) {
        "use strict";
        event.emit('smallArea', results);
    });
});


//限制并发抓取住房数据
event.addListener('smallArea', function (areaList) {
    areaList = areaList || [];
    var smallAreaObj = {},
        url = config.web[0].rootUrl;
    async.mapSeries(areaList, function (item, cb) {
        var areaName = item.name;
        smallAreaObj[areaName] = {};
        smallAreaObj[areaName].pageList = [];
        async.mapLimit(item.locationList, 2, function (_item, _cb) {      //开2个进程进行对于js的执行
            "use strict";
            phantomInit(_item.url, function () {
                return document.querySelector('body').innerHTML;
            }, function (html) {
                var $ = cheerio.load(html),
                    pageList = $('.page-box a'),
                    maxPage = 1,
                    i = 2;

                for(let key in pageList) {
                    if(typeof Number(key) === 'number' && Number(key)) {
                        let pageItem = pageList[key];
                        maxPage = Math.max(maxPage, pageItem.attribs['data-page']);     //获取对象的属性  pageItem.attribs.data-page  这种写法有问题 =====>>>>>  pageItem.attribs['data-page']
                    }
                }

                while(i <= maxPage) {
                    let href = url + item.url + 'pg' + i + '/';
                    smallAreaObj[areaName].pageList.push(href);
                    i++;
                }
                cb(smallAreaObj);
            });
        }, function (err, results) {
            console.log('inner callback done');
        });

        cb('inner fn has finished');
    }, function(err, results) {
        "use strict";
        console.log(results);
    });
});


event.addListener('getAllSites', function (pageList) {

});

