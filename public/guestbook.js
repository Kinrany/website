const data = {
    submissions: [],
    message_author: '',
    message_text: '',
    loading_operations_counter: 0
};

load_submissions();

let app = new Vue({
    el: '#guestbook',
    data: data,
    methods: {
        send_message: send_message,
        load_submissions: load_submissions
    }
});

function send_message() {
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
            load_submissions();
        })
        .fail(function () {
            console.log('Post failed');
        });
}

function load_submissions() {
    data.loading_operations_counter += 1;
    $.getJSON("/guestbook/submissions.json")
        .done(function (jsonData) {
            data.submissions = jsonData.submissions;
            console.log('Successfully loaded guestbook submissions');
        })
        .fail(function () {
            console.log('Failed to load guestbook submissions');
        })
        .always(function () {
            data.loading_operations_counter -= 1;
        });
}