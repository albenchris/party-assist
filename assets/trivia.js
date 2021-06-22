
//Start of Trivia

var triviaStartButton = document.getElementById("trivia-start-button");
var triviaContentEl = document.getElementById("trivia-content");



function getTrivia() {

    var triviaURL = "https://opentdb.com/api.php?amount=10&type=multiple"
    fetch(triviaURL)
        .then(function (response) {
            return response.json().then(function (data) {
                displayTrivia(data.results);
            });
        })
        .catch(function (err) {
            console.log("Error", err);
        });
};

function displayTrivia(triviaArr) {
    // console.log(triviaArr[0]);

    triviaArr.map(eachItem => {
        const difficulty = document.createElement('h4');
        difficulty.innerHTML = `Difficulty: ${eachItem.difficulty}`;
        const category = document.createElement('h4');
        category.innerHTML = `Category: ${eachItem.category}`;

        // const questionObj = {
        //     question: eachItem.question,
        //     answers: [
        //         {
        //             answer: eachItem.correct_answer,
        //             correctAnswer: true
        //         },
        //         {
        //             answer: eachItem.incorrect_answers[0],
        //             correctAnswer: false
        //         },
        //         {
        //             answer: eachItem.incorrect_answers[1],
        //             correctAnswer: false
        //         },
        //         {
        //             answer: eachItem.incorrect_answers[2],
        //             correctAnswer: false
        //         }
        //     ]
        // };

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

// function displayTrivia(trivia) {
//     console.log(trivia);

//     for (var q = 0; q < trivia.results.length; q++) {

//         var answerContainerEl = document.createElement("ul");
//         for (var ia = 0; ia < trivia.results[q].incorrect_answers.length; ia++) {
//             var incorrectAnswer = document.createElement("button");
//             console.log(trivia.results[q].incorrect_answers[ia])
//             incorrectAnswer.innerHTML = trivia.results[q].incorrect_answers[ia];

//             answerContainerEl.appendChild(incorrectAnswer);
//         }
//         var correctAnswer = document.createElement("button");
//         correctAnswer.innerHTML = trivia.results[q].correct_answer;
//         answerContainerEl.appendChild(correctAnswer);

//         triviaContentEl.appendChild(category);
//         triviaContentEl.appendChild(difficulty);
//         triviaContentEl.appendChild(question);
//         triviaContentEl.appendChild(answerContainerEl);
//     }
// };

triviaStartButton.addEventListener("click", getTrivia);


