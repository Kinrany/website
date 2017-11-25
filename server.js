const express = require('express');
const app = express();

const mongo = require('./mongo_connection');

app.get('/', static_html('views/index.html'));
app.get('/survey', static_html('views/survey.html'));
app.get('/guestbook', static_html('views/guestbook.html'));

app.use('/public', express.static('public'));

app.post('/guestbook/submit', function (request, response, next) {
    let { author, text } = request.query;

    if (!is_valid_guestbook_submission(author, text)) {
        response.writeHead(400);
        response.end('Invalid submission');
        return;
    }

    mongo.guestbook_add_submission(author, text, function (err, result) {
        if (err) {
            response.writeHead(500);
            response.end('Failed to save your submission');
            console.log('Failed to save a guestbook submission: ' + err);
        }
        else {
            response.writeHead(200);
            response.end('Submission saved: "' + text + '" by ' + author + '.');
        }
    });
});

app.listen(8080, function () {
    console.log('Listening on port 8080...');
});

function is_valid_guestbook_submission(author, text) {
    const MAX_AUTHOR_LENGTH = 300;
    const MAX_TEXT_LENGTH = 5000;
    return typeof(author) === 'string' && 
        author !== '' &&
        author.length < MAX_AUTHOR_LENGTH &&
        typeof(text) === 'string' &&
        text != '' &&
        text.length < MAX_TEXT_LENGTH;
}

function static_html(path) {
    return function(request, response, next) {
        response.sendFile(path, {
            root: '.'
        });
    };
}