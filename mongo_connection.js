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
            if (err) callback(err);
            console.log('New guestbook submission: ' + author + ': "' + text + '"');
            callback(null, message);
        });
    },
    guestbook_get_submissions: function (callback) {
        if (!guestbook_submissions) {
            callback("not initialized");
        }

        guestbook_submissions.find({}).toArray(function (err, result) {
            if (err) callback(err);
            result.forEach(function(element, index) {
                delete result[index]._id;
            });
            callback(null, result);
        });
    }
}
