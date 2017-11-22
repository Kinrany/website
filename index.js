let questions = [
    {
        id: 0,
        text: "Как пройти в библиотеку?",
        answers: [
            {
                id: 0,
                text: "Направо", 
            },
            {
                id: 1,
                text: "Налево" 
            }
        ]
    },
    {
        id: 1,
        text: "Какой фреймворк лучше?",
        answers: [ 
            {
                id: 0,
                text: "React"
            }, 
            {
                id: 1,
                text: "Angular" 
            },
            {
                id: 2,
                text: "Vue"
            }
        ]
    }
];

let answers = {};
questions.forEach(function (q) {
    answers[q.id] = q.answers[0].id;
});

let app = new Vue({
    el: '#app',
    data: {
        questions: questions,
        answers: answers
    }
});