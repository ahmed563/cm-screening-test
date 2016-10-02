exports.htmlResponse = (response, results) => {
    try {
        response.writeHead(200, {
            "Content-Type": "text/html"
        });
        response.write("<!DOCTYPE html>");
        response.write("<html>");
        response.write("<head>");
        response.write("</head>");
        response.write("<body>");
        response.write("<h1> Following are the titles of given websites: </h1>");
        response.write("<ul>");

        results.forEach(function(item, index) {
            response.write("<li>" + item.address + " - " + item.title + "</li>");
            if (index == results.length - 1) {
                response.write("</ul>");
                response.write("</body>");
                response.write("</html>");
                response.end();
            }
        });
    } catch (ex) {
        response.writeHead(500, {
            "Content-Type": "text/plain"
        });
        response.write(ex.message);
        response.end();
    }

}
