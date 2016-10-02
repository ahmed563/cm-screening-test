var request = require('request');
var url = require('url');

exports.parseUrls = (_url) => {
    var parsed = url.parse(_url, true, false),
        query = Object.keys(parsed.query),
        result = {};
    if (query.length > 0) {
        query.forEach(function (key) {
            if (key.match(/([^\[]+)\[([^\]]+)\]/g)) {
                key.replace(/([^\[]+)\[([^\]]+)\]/g, function ($0, $1, $2) {
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

exports.webChecker = (addr, callback) => {
    try {
        var address = [];
        if (addr == undefined || addr == null) {
            var error = new Error('Invalid Query');
            callback(error, null);
            return
        }
        if (typeof(addr) == "string") {
            address.push(addr);
        }
        else {
            address = addr;
        }
        var itemsProcessed = 0;
        var results = [];
    }
    catch (e){
        callback(e, null);
    }
    //Control Flow Using callbacks
    if(address.length > 0)
        address.forEach(
            function(item) {
                getTitle(item, function(data){
                    itemsProcessed++;
                    results.push(data);
                    if (itemsProcessed == address.length) {
                        callback(null, results);
                        return
                    }

                });
            }
        );
    else {
        var error = new Error('Invalid Query');
        callback(error, null);
        return
    }
}


function getTitle(item, callback){
    var result = {};
    try {
        if (item.indexOf("www") == -1) {
            item = "http://www." + item;
        }
        else if (item.indexOf("http://") == -1) {
            item = "http://" + item;
        }
    }
    catch (e) {
        var error = {
            address: item,
            title: e.message + e.type
        };
        callback(error);
    }
    request.get(item, function(err, res) {
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
                var error = {
                    address: item,
                    title: e.message + e.type
                };
                callback(error);
            }
        }
        callback(result);
    });
}
