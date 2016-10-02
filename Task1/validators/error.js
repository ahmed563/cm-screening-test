exports.generalError = (err, res) => {
  res.writeHead(200, {"Content-Type": "text/plain"});
  res.write(err.message);
  res.end();
}

exports.notFoundError = (err, res) => {
  res.writeHead(404, {"Content-Type": "text/plain"});
  res.write(err.message);
  res.end();
}
