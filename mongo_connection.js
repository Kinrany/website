const mongo = require('mongodb');

const client = mongo.MongoClient;
const url = "mongodb://localhost:27017/website_db";
let guestbook_submissions = null;
let guestbook_buffer = [];

client.connect(url, function (err, db) {
    if (err) {
        console.log('Failed to connect to the database.');
        console.log('Session data will not be saved.');
        return;
    }

    guestbook_submissions = db.collection('guestbook_submissions');
    console.log('Connected to ' + url + '...');

    // push buffered submissions to the db
    let tmp_buffer = guestbook_buffer.slice();
    guestbook_buffer = guestbook_buffer.slice(tmp_buffer.length);
    tmp_buffer.forEach(m => guestbook_add_submission_to_db(m, (e) => {
        if (e) {
            console.log('Error while saving buffered messages.');
            console.error(e);
        }
    }));
});

module.exports = {
    guestbook_add_submission: function (author, text, callback) {
        let message = {
            author: author,
            text: text
        };

        try {
            if (!guestbook_submissions) {
                guestbook_buffer.push(message);
                callback(null, message);
            }
            else {
                guestbook_add_submission_to_db(message, callback);
            }
        }
        catch (e) {
            callback(e);
        }
    },
    guestbook_get_submissions: function (callback) {
        try {
            if (!guestbook_submissions) {
                callback(null, guestbook_buffer.slice());
            }

            guestbook_submissions.find({}).toArray(function (err, result) {
                if (err) {
                    callback(err);
                }
                else {
                    result.forEach(function (element, index) {
                        delete result[index]._id;
                    });
                    callback(null, result);
                }
            });
        }
        catch (e) {
            callback(e);
        }
    }
}

function guestbook_add_submission_to_db(message, callback) {
    guestbook_submissions.insertOne(message, function (err, result) {
        if (err) {
            callback(err);
        }
        else {
            console.log(`New guestbook submission: ${author}: ${text}`);
            callback(null, message);
        }
    });
}