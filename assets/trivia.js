
//Start of Trivia

var triviaStartButton = document.getElementById("trivia-start-button");
var triviaContentEl = document.getElementById("trivia-content");



function getTrivia() {

    var triviaURL = "https://opentdb.com/api.php?amount=10&type=multiple"
    fetch(triviaURL).then(function (response) {
        return response.json().then(function (data) {
            displayTrivia(data);
        })
    }).catch(function (err) {
        console.log("Error", err);
    });
};

function displayTrivia(trivia) {
    console.log(trivia);

    for (var q = 0; q < trivia.results.length; q++) {
        var difficulty = document.createElement("h4");
        difficulty.innerHTML = "Difficulty: " + trivia.results[q].difficulty;
        var category = document.createElement("h4");
        category.innerHTML = "Category: " + trivia.results[q].category;

        var question = document.createElement("h3");
        question.innerHTML = trivia.results[q].question;

        var answerContainerEl = document.createElement("ul");
        for (var ia = 0; ia < trivia.results[q].incorrect_answers.length; ia++) {
            var incorrectAnswer = document.createElement("button");
            console.log(trivia.results[q].incorrect_answers[ia])
            incorrectAnswer.innerHTML = trivia.results[q].incorrect_answers[ia];

            answerContainerEl.appendChild(incorrectAnswer);
        }
        var correctAnswer = document.createElement("button");
        correctAnswer.innerHTML = trivia.results[q].correct_answer;
        answerContainerEl.appendChild(correctAnswer);

        triviaContentEl.appendChild(category);
        triviaContentEl.appendChild(difficulty);
        triviaContentEl.appendChild(question);
        triviaContentEl.appendChild(answerContainerEl);
    }
};

triviaStartButton.addEventListener("click", getTrivia);


