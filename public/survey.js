const data = {
    questions: {},
    answers: {}
};

let questionsRequest = $.getJSON("./survey-questions.json");
questionsRequest.done(function(jsonData) {
    data.questions = jsonData.questions;

    let answers = {};
    data.questions.forEach(function (q) {
        answers[q.id] = q.answers[0].id;
    });
});

let app = new Vue({
    el: '#app',
    data: data
});