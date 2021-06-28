var triviaStartButton = document.getElementById("trivia-start-button");
var triviaContentEl = document.getElementById("trivia-content");

let triviaQuestions = [];

function getTrivia() {

    var triviaURL = "https://opentdb.com/api.php?amount=10&type=multiple"
    fetch(triviaURL)
        .then(function (response) {
            return response.json().then(function (data) {
                const newQuestions = [];
                data.results.map(item => {
                    // console.log(item);
                    questionObj = {
                        category: item.category,
                        type: item.type,
                        difficulty: item.difficulty,
                        question: item.question,
                        answers: [
                            {
                                text: item.correct_answer,
                                isCorrect: true
                            },
                            {
                                text: item.incorrect_answers[0],
                                isCorrect: false
                            },
                            {
                                text: item.incorrect_answers[1],
                                isCorrect: false
                            },
                            {
                                text: item.incorrect_answers[2],
                                isCorrect: false
                            }
                        ]
                    };
                    newQuestions.push(questionObj);
                });

                triviaQuestions = newQuestions;
                // console.log(triviaQuestions);
            });
        })
        .then(function () {
            if (triviaQuestions.length) {
                return playTrivia(triviaQuestions);
            }
            else return;
        })
        .catch(function (err) {
            console.log("Error", err);
        });
};

function playTrivia(triviaArr) {
    // console.log(triviaArr);
    // console.log(triviaArr[0]);

    // triviaArr.map(item => {
    //     // console.log(item.question);
    //     showQuestion(item);
    // });

    showNextQuestion();
};

function showNextQuestion() {
    console.log(triviaQuestions);

    showQuestion(triviaQuestions[0]);
    if (triviaQuestions.length) {
        triviaQuestions.shift();
    }
    // console.log(triviaQuestions);
};

function showQuestion(triviaObj) {
    console.log(triviaObj);
        const difficulty = document.createElement('h4');
        difficulty.innerHTML = `Difficulty: ${triviaObj.difficulty}`;
        
        const category = document.createElement('h4');
        category.innerHTML = `Category: ${triviaObj.category}`;

        const question = document.createElement('h3');
        question.innerHTML = triviaObj.question;

        const answerContainerEl = document.createElement('ul');
        triviaObj.answers.sort(() => Math.random() - .5);
        triviaObj.answers.map(answerItem => {
            const answerEl = document.createElement('button');
            answerEl.innerHTML = answerItem.text;
            answerContainerEl.appendChild(answerEl);
        });

        triviaContentEl.appendChild(category);
        triviaContentEl.appendChild(difficulty);
        triviaContentEl.appendChild(question);
        triviaContentEl.appendChild(answerContainerEl);

};

triviaStartButton.addEventListener("click", getTrivia);


