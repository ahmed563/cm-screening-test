var request = require('request');
var url = require('url');

var scrapper = require('../helpers/scraping');
var err = require('../validators/error');
var resp = require('../helpers/html')

exports.processRequest = (request, response) => {
    try {
        var requestedUrl = url.parse(request.url);
        if (requestedUrl.pathname.replace(/\//g,"") != "Iwanttitle") {
            err.notFoundError( {message: "Not Found"}, response);
            return
        }
        var urlList = scrapper.parseUrls(request.url);
        }
    catch (e){
        err.generalError(e, response);
        return
    }
    scrapper.webChecker(urlList.address, function(error, results) {
        if(error){
            err.generalError(error, response);
            return
        }
        try{
            resp.htmlResponse(response, results);
        }
        catch (e){
            err.generalError(e, response);
        }
        return
    });
}
