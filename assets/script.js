var randomBtn = document.getElementById("random-btn")
var randomModalEl = document.getElementById("random-modal");

var mainContainerEl = document.getElementById("main-content-container");

function getRandomDrink() {
    var randomURL = "https://www.thecocktaildb.com/api/json/v1/1/random.php"

    fetch(randomURL).then(function(response) {
        return response.json();
    }).then(function(response) {
        mainContainerEl.innerHTML = "";
        console.log(response);
    });
};

function resetState() {
    randomModalEl.classList.add("hide");
};

function randomBtnHandler() {
    randomModalEl.classList.remove("hide");
    
    var confirmBtn = document.getElementById("random-confirm");
    var cancelBtn = document.getElementById("random-cancel");

    confirmBtn.addEventListener("click", getRandomDrink);
    cancelBtn.addEventListener("click", resetState);
};

randomBtn.addEventListener("click", randomBtnHandler);