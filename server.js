const http = require('http');
const fs = require('fs');
const express = require('express');
const app = express();

app.get('/', function(request, response, next) {
    request.url = "/index.html";
    next();
});

app.use(express.static('public'));


app.listen(8080, function() {
    console.log('Listening on port 8080...');
});
