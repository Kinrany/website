const data = {
    submissions: [
        {
            author: "kinrany",
            text: "Привет, мир!"
        }
    ],
    message_author: '',
    message_text: ''
};

$.getJSON("/guestbook/submissions.json")
    .done(function (jsonData) {
        data.submissions = jsonData.submissions;
        console.log('Successfully loaded guestbook submissions');
    })
    .fail(function () {
        console.log('Failed to load guestbook submissions');
    });

let app = new Vue({
    el: '#guestbook',
    data: data,
    methods: {
        send_message: function () {
            let { message_author: author, message_text: text } = data;
            data.message_author = '';
            data.message_text = '';
            $.post(`/guestbook/submit?author=${author}&text=${text}`)
                .done(function () {
                    console.log('Posted');
                    data.submissions.push({
                        author: author,
                        text: text
                    });
                })
                .fail(function () {
                    console.log('Post failed');
                });
        }
    }
});