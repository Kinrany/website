const data = {
    submissions: [
        {
            author: "kinrany",
            text: "Привет, мир!"
        }
    ]
};

$.getJSON("./guestbook-submissions.json")
    .done(function (jsonData) {
        data.submissions = jsonData.submissions;
        console.log('Successfully loaded guestbook-submissions.json');
    })
    .fail(function () {
        console.log('Failed to load guestbook-submissions.json');
    });

let app = new Vue({
    el: '#guestbook',
    data: data
});