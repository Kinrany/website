const express = require('express');

const PORT = process.env.PORT || 8080;
const IP = process.env.IP || '0.0.0.0';

const mongo = require('./mongo_connection');

express()
    .use('/public', express.static('public'))
    .get('/', static_html('views/index.html'))
    .get('/survey', static_html('views/survey.html'))
    .get('/guestbook', static_html('views/guestbook.html'))
    .get('/guestbook/submissions.json', function (req, res) {
        mongo.guestbook_get_submissions(function (err, result) {
            if (err) {
                res.status(500);
                res.type('text/plain');
                res.end(err);
            }
            else {
                res.status(200);
                res.type('application/json');
                res.end(JSON.stringify({ submissions: result }));
            }
        });
    })
    .post('/guestbook/submit', function (req, res) {
        let { author, text } = req.query;

        if (!is_valid_guestbook_submission(author, text)) {
            res.status(400);
            res.type('text/plain');
            res.end('Invalid submission');
            return;
        }

        mongo.guestbook_add_submission(author, text, function (err, result) {
            if (err) {
                res.status(500);
                res.type('text/plain');
                res.end('Failed to save your submission');

                console.log(`Failed to save a guestbook submission: ${err}`);
            }
            else {
                res.status(200);
                res.type('text/plain');
                res.end(`Submission saved: ${text} by ${author}.`);
            }
        });
    })
    .listen(PORT, IP, () => console.log(`Listening on IP ${IP}, port ${PORT}...`));

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
    return function (req, res) {
        res.sendFile(path, {
            root: '.'
        });
    };
}