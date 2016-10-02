var request = require('request');
var url = require('url');
var when = require('when');

exports.parseUrls = (_url) => {
    var parsed = url.parse(_url, true, false),
        query = Object.keys(parsed.query),
        result = {};
    if (query.length > 0) {
        query.forEach(function(key) {
            if (key.match(/([^\[]+)\[([^\]]+)\]/g)) {
                key.replace(/([^\[]+)\[([^\]]+)\]/g, function($0, $1, $2) {
                    result[$1] = result[$1] || {};
                    result[$1][$2] = parsed.query[key];
                });
            }
            else {
                result[key] = parsed.query[key];
            }
        });
    }
    return result;
};
exports.webChecker = (addr, cb) => {
    try {
        var address = [];
        if (addr == undefined || addr == null) {
            var error = new Error('Invalid Query');
            cb(error, null);
            return
        }
        if (typeof(addr) == "string") {
            address.push(addr);
        }
        else {
            address = addr;
        }
        var results = [];
        var itemProcessed = 0;
    }
    catch (e){
        cb(e, null);
    }
    //Control Flow Using Promises
    if (address.length > 0) {
        address.forEach(function(item, index){
            getTitle(item).then(function(data){
                try {
                    itemProcessed++;
                    results.push(data);
                    if (itemProcessed == address.length) {
                        cb(null, results);
                        return
                    }
                }
                catch (e) {
                    cb(e, null);
                    return
                }
            });
        })

    } else {
        var error = new Error('Invalid Query');
        cb(error, null);
        return
    }
}


function getTitle(item) {
    try {
        var deferred = when.defer();
        var result = {};
        if (item.indexOf("www") == -1) {
            item = "http://www." + item;
        }
        else if (item.indexOf("http://") == -1) {
            item = "http://" + item;
        }
    }
    catch(e){
        var error =  {
            address: item,
            title: e.message + e.type
        };
        deferred.resolve(error);
    }
    request.get(item, function (err, res) {
        if (err) {
            result = {
                address: item,
                title: err.message
            };
        }
        else {
            try {
                var re = /(<\s*title[^>]*>(.+?)<\s*\/\s*title)>/gi;
                var match = re.exec(res.body);
                if (match && match[2]) {
                    result = {
                        address: item,
                        title: match[2]
                    };
                }
            }
            catch (e) {
                var error =  {
                    address: item,
                    title: e.message + e.type
                };
                deferred.resolve(error);
            }
        }
        deferred.resolve(result);
    });
    return deferred.promise;
}
