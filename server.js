const express = require('express');
const app = express();

const PORT = process.env.PORT || 8080;
const IP = process.env.IP || '0.0.0.0';

const mongo = require('./mongo_connection');

app.get('/', static_html('views/index.html'));
app.get('/survey', static_html('views/survey.html'));
app.get('/guestbook', static_html('views/guestbook.html'));

app.use('/public', express.static('public'));

app.get('/guestbook/submissions.json', function (request, response) {
    mongo.guestbook_get_submissions(function (error, result) {
        if (error) {
            response.status(500);
            response.type('text/plain');
            response.end(error);
        }
        else {
            response.status(200);
            response.type('application/json');
            response.end(JSON.stringify({ submissions: result }));
        }
    });
});

app.post('/guestbook/submit', function (request, response) {
    let { author, text } = request.query;

    if (!is_valid_guestbook_submission(author, text)) {
        response.status(400);
        response.type('text/plain');
        response.end('Invalid submission');
        return;
    }

    mongo.guestbook_add_submission(author, text, function (err, result) {
        if (err) {
            response.status(500);
            response.type('text/plain');
            response.end('Failed to save your submission');

            console.log(`Failed to save a guestbook submission: ${err}`);
        }
        else {
            response.status(200);
            response.type('text/plain');
            response.end(`Submission saved: ${text} by ${author}.`);
        }
    });
});

app.listen(PORT, IP, function () {
    console.log(`Listening on IP ${IP}, port ${PORT}...`);
});

function is_valid_guestbook_submission(author, text) {
    const MAX_AUTHOR_LENGTH = 300;
    const MAX_TEXT_LENGTH = 5000;
    return typeof (author) === 'string' &&
        author !== '' &&
        author.length < MAX_AUTHOR_LENGTH &&
        typeof (text) === 'string' &&
        text != '' &&
        text.length < MAX_TEXT_LENGTH;
}

function static_html(path) {
    return function (request, response) {
        response.sendFile(path, {
            root: '.'
        });
    };
}