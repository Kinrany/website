const mongo = require('mongodb');

const client = mongo.MongoClient;
const url = "mongodb://localhost:27017/website_db";
let guestbook_submissions = null;

client.connect(url, function (err, db) {
    if (err) throw err;
    guestbook_submissions = db.collection('guestbook_submissions');
    console.log('Connected to ' + url + '...');
});

module.exports = {
    guestbook_add_submission: function (author, text, callback) {
        if (!guestbook_submissions) {
            callback("not initialized");
        }

        let message = {
            author: author,
            text: text
        };

        guestbook_submissions.insertOne(message, function (err, res) {
            if (err) throw err;
            console.log('New guestbook submission: ' + author + ': "' + text + '"');
            callback(null, message);
        });
    }
}
