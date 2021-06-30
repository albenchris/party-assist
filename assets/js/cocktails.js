// global variables start
var cocktailModalBtn = document.getElementById("cocktail-btn");
var cocktailModalEl = document.getElementById("cocktail-modal");
var mainContainerEl = document.getElementById("main-content-container");

var cocktailFormEl = document.getElementById("cocktail-search-form");
var cocktailNameInput = document.getElementById("cocktail-by-name");
var searchHistoryEl = document.getElementById("cocktail-search-history")
var recentCocktailsArr = JSON.parse(localStorage.getItem("recentCocktailsArr")) || [];

var apiURL = "https://www.thecocktaildb.com/api/json/v1/1/";
// global variables end

// function definitions start
function getSpecificDrink(event) {
    event.preventDefault();    
    var specificURL = apiURL + "search.php?s=" + cocktailNameInput.value.trim();

    fetch(specificURL)
        .then(function(response) {
            return response.json()
                .then(function(data) {
                    saveCocktailName(data);
                    displayCocktailRecipe(data);
                })
        }).catch(function(err) {
            console.log("Error: ", err);
            cocktailSearchErrorHandler();
        });
};

function getRandomDrink() {
    var randomURL = apiURL + "random.php";

    fetch(randomURL).then(function(response) {
        return response.json().then(function(data) {
            displayCocktailRecipe(data);
        })
    }).catch(function(err) {
        console.log("Error: ", err);
    });
};

function displayCocktailRecipe(cocktail) {
    // console.log(cocktail);
    closeCocktailModal();
    mainContainerEl.innerHTML = "";

    // image start
    var imgContainerEl = document.createElement("div");
    imgContainerEl.setAttribute("id", "image-container");

    var drinkName = document.createElement("h2");
    drinkName.classList.add("drink-name");
    drinkName.innerHTML = cocktail.drinks[0].strDrink.toUpperCase();

    var image = document.createElement("img");
    image.classList.add('cocktail-image');
    image.setAttribute("src", cocktail.drinks[0].strDrinkThumb);

    imgContainerEl.appendChild(drinkName);
    imgContainerEl.appendChild(image);
    // image end

    // ingredients start
    var ingredContainerEl = document.createElement("div");
    ingredContainerEl.setAttribute("id", "ingredients-container");

    var ingredientHeader = document.createElement('h3');
    ingredientHeader.classList.add('ingredients');
    ingredientHeader.innerText = 'Ingredients';

    var ingredientsList = document.createElement("ul");
    ingredientsList.classList.add("ingredients-list");

    for (var i=1; i<=15; i++) {
        if (cocktail.drinks[0][`strIngredient${i}`] == null) {
            break;
        }

        var ingredient = document.createElement("li");
        ingredient.innerHTML = cocktail.drinks[0][`strIngredient${i}`];

        if(cocktail.drinks[0][`strMeasure${i}`] == null) {
            break;
        }

        var measurement = document.createElement("span")
        measurement.innerHTML = " - " + cocktail.drinks[0][`strMeasure${i}`];
        ingredient.appendChild(measurement);
        ingredientsList.appendChild(ingredient);
    }

    ingredContainerEl.appendChild(ingredientHeader);
    ingredContainerEl.appendChild(ingredientsList);
    // ingredients end

    // instructions start
    var instrContainerEl = document.createElement("div");
    instrContainerEl.setAttribute("id", "instructions-container");

    var instrHeader = document.createElement("h3");
    instrHeader.classList.add('instructions');
    instrHeader.innerHTML = "Instructions";

    var instrList = document.createElement("ol");
    instrList.classList.add("instructions-list");

    var instrArr = cocktail.drinks[0].strInstructions.split(". ");

    for (j=0; j<instrArr.length; j++) {
        var instruction = document.createElement("li");
        instruction.innerHTML = instrArr[j];
        instrList.appendChild(instruction);
    }

    instrContainerEl.appendChild(instrHeader);
    instrContainerEl.appendChild(instrList);
    // instructions end

    mainContainerEl.appendChild(imgContainerEl);
    mainContainerEl.appendChild(ingredContainerEl);
    mainContainerEl.appendChild(instrContainerEl);
};

function closeCocktailModal() {
    cocktailModalEl.classList.add("hide");
};

function saveCocktailName(data) {
    var cocktailName = data.drinks[0].strDrink;

    for (let i=0; i<recentCocktailsArr.length; i++) {
        if (cocktailName === recentCocktailsArr[i]) return;
    }

    recentCocktailsArr.push(cocktailName);
    recentCocktailsArr.shift();
    // recentCocktailsArr.sort((a,b) => a - b);
    recentCocktailsArr.splice(5);

    localStorage.setItem("recentCocktailsArr", JSON.stringify(recentCocktailsArr));

    createCocktailBtn();
};

function createCocktailBtn() {
    searchHistoryEl.innerHTML = "";

    for (let i = 0; i < recentCocktailsArr.length; i++) {
        var cocktailNameButton = document.createElement("button");
        cocktailNameButton.setAttribute("cocktail", recentCocktailsArr[i]);
        cocktailNameButton.setAttribute("class", "cocktail-name pure-button modal-button");
        cocktailNameButton.textContent = recentCocktailsArr[i];

        searchHistoryEl.appendChild(cocktailNameButton);
    }
    console.log(recentCocktailsArr);
};

function cocktailBtnHandler(event) {
    event.preventDefault();
    var cocktailName = event.target.getAttribute("cocktail");

    if (cocktailName) {
        var buttonURL = apiURL + "search.php?s=" + cocktailName;

        fetch(buttonURL)
            .then(function(response) {
                return response.json()
                    .then(function(data) {
                        saveCocktailName(data);
                        displayCocktailRecipe(data);
                    })
            }).catch(function(err) {
                console.log("Error: ", err);
                cocktailSearchErrorHandler();
            });
    }
};

function cocktailSearchFormHandler(event) {
    event.preventDefault();

    var cocktailName = cocktailNameInput.value.trim();
    if (cocktailName) {
        getSpecificDrink(cocktailName);
    }
};

function cocktailModalHandler() {
    cocktailModalEl.classList.remove("hide");
    
    var confirmBtn = document.getElementById("random-confirm");
    var cancelBtn = document.getElementById("random-cancel");    

    confirmBtn.addEventListener("click", getRandomDrink);
    cancelBtn.addEventListener("click", closeCocktailModal);
};

function cocktailSearchErrorHandler() {
    closeCocktailModal();
    mainContainerEl.innerHTML = 
        "<div class='cocktail-search-error width-100'><h2>Sorry, we couldn't find that one." +
        "</br>Try searching for another cocktail," + 
        "</br>or if you're feeling adventurous," + 
        "</br>press this button.</h2>" +
        "<button id='surprise-confirm' class='confirm'>Surprise Me!</button></div>";

    var surpriseMeBtn = document.getElementById("surprise-confirm");
    surpriseMeBtn.addEventListener("click", getRandomDrink);
};
// function definitions end

createCocktailBtn();

// global event listenters
cocktailFormEl.addEventListener("submit", getSpecificDrink);
cocktailModalBtn.addEventListener("click", cocktailModalHandler);
searchHistoryEl.addEventListener("click", cocktailBtnHandler);
