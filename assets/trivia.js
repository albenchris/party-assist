
//Start of Trivia

var triviaStartButton = document.getElementById("trivia-start-button");
var triviaContentEl = document.getElementById("trivia-content");

let triviaQuestions = [];

function getTrivia() {

    var triviaURL = "https://opentdb.com/api.php?amount=10&type=multiple"
    fetch(triviaURL)
        .then(function (response) {
            return response.json().then(function (data) {
                triviaQuestions = data.results;
                // console.log(triviaQuestions)
                displayTrivia(data.results);
            });
        })
        .catch(function (err) {
            console.log("Error", err);
        });
};

function displayTrivia(triviaArr) {
    console.log(triviaQuestions);
    // console.log(triviaArr[0]);

    triviaArr.map(eachItem => {
        const difficulty = document.createElement('h4');
        difficulty.innerHTML = `Difficulty: ${eachItem.difficulty}`;
        const category = document.createElement('h4');
        category.innerHTML = `Category: ${eachItem.category}`;

        const answersArr = [
            {
                text: eachItem.correct_answer,
                isCorrect: true
            },
            {
                text: eachItem.incorrect_answers[0],
                isCorrect: false
            },
            {
                text: eachItem.incorrect_answers[1],
                isCorrect: false
            },
            {
                text: eachItem.incorrect_answers[2],
                isCorrect: false
            }
        ];
        answersArr.sort(() => Math.random() - .5);
        console.log(answersArr);

        const question = document.createElement('h3');
        question.innerHTML = eachItem.question;

        const answerContainerEl = document.createElement('ul');
        answersArr.map(answerItem => {
            const answerEl = document.createElement('button');
            answerEl.innerHTML = answerItem.text;
            answerContainerEl.appendChild(answerEl);
        });

        triviaContentEl.appendChild(category);
        triviaContentEl.appendChild(difficulty);
        triviaContentEl.appendChild(question);
        triviaContentEl.appendChild(answerContainerEl);
    });
};

triviaStartButton.addEventListener("click", getTrivia);


