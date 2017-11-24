const http = require('http');
const fs = require('fs');

const server = http.createServer(function(request, response) {
    fs.readFile('index.html', function(error, content) {
        if (error) {
            console.log(error);
            response.writeHead(500, {
                'Content-Type': 'text/plain'
            });
            response.end(500);
        }
        else {
            response.writeHead(200, {
                'Content-Type': 'text/html'
            });
            response.end(content);
        }
    });
});

server.listen(8080);
console.log('Listening on port 8080...');
