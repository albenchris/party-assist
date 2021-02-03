var cocktailBtn = document.getElementById("cocktail-btn")
var cocktailModalEl = document.getElementById("cocktail-modal");

var randomCocktailModalEl = document.getElementById("random-cocktail-modal");
var cocktailSearchModalEl = document.getElementById("cocktail-search-form");
var cocktailFormEl = document.getElementById("cocktail-search-form");
var cocktailNameInput = document.getElementById("cocktail-by-name");


var mainContainerEl = document.getElementById("main-content-container");

function getSpecificDrink(event) {
    // console.log(cocktailName);
    event.preventDefault();
    resetState();
    mainContainerEl.innerHTML = "";

    var specificURL = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + cocktailNameInput.value.trim();
    console.log(specificURL);

    fetch(specificURL).then(function(response) {
        return response.json().then(function(data) {
            displayCocktailRecipe(data);
        })
    }).catch(function(err) {
        console.log("Error: ", err);
        mainContainerEl.innerHTML = "<h2 class='cocktail-search-error'>Sorry, we couldn't find that one." +
            "</br>Try searching for another cocktail or, if you're feeling adventurous, press the " +
            "<button id='surprise-confirm' class='pure-button modal-button confirm'>Surprise Me!</button>" +
            " button.</h2>";
        cocktailSearchErrorHandler();
    });
};

function getRandomDrink() {
    resetState();
    mainContainerEl.innerHTML = "";

    var randomURL = "https://www.thecocktaildb.com/api/json/v1/1/random.php"

    fetch(randomURL).then(function(response) {
        return response.json().then(function(data) {
            displayCocktailRecipe(data);
        })
    }).catch(function(err) {
        console.log("Error: ", err);
    });
};

function displayCocktailRecipe(cocktail) {
    // image start
    var imgContainerEl = document.createElement("div");
    imgContainerEl.setAttribute("id", "image-container");
    imgContainerEl.classList.add("pure-u-4-10");

    var image = document.createElement("img");
    image.setAttribute("src", cocktail.drinks[0].strDrinkThumb);
    imgContainerEl.appendChild(image);
    // image end

    // ingredients start
    var ingredContainerEl = document.createElement("div");
    ingredContainerEl.setAttribute("id", "ingredients-container");
    ingredContainerEl.classList.add("pure-u-1-10");

    var drinkName = document.createElement("h2");
    drinkName.classList.add("drink-name");
    drinkName.innerHTML = cocktail.drinks[0].strDrink.toUpperCase();

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

    ingredContainerEl.appendChild(drinkName);
    ingredContainerEl.appendChild(ingredientsList);
    // ingredients end

    // instructions start
    var instrContainerEl = document.createElement("div");
    instrContainerEl.setAttribute("id", "instructions-container");
    instrContainerEl.classList.add("pure-u-5-10");

    var instrSectionName = document.createElement("h3");
    instrSectionName.innerHTML = "Instructions";

    var instrList = document.createElement("ol");
    instrList.classList.add("instructions-list");

    var instrArr = cocktail.drinks[0].strInstructions.split(". ");

    for (j=0; j<instrArr.length; j++) {
        var instruction = document.createElement("li");
        instruction.innerHTML = instrArr[j];
        instrList.appendChild(instruction);
    }

    instrContainerEl.appendChild(instrSectionName);
    instrContainerEl.appendChild(instrList);
    // instructions end

    mainContainerEl.appendChild(imgContainerEl);
    mainContainerEl.appendChild(ingredContainerEl);
    mainContainerEl.appendChild(instrContainerEl);
};

function resetState() {
    cocktailModalEl.classList.add("hide");
};

function cocktailModalSwitch() {
    randomCocktailModalEl.classList.toggle("hide");
    cocktailSearchModalEl.classList.toggle("hide");
};

function cocktailSearchFormHandler(event) {
    event.preventDefault();

    var cocktailName = cocktailNameInput.value.trim();
    if (cocktailName) {
        getSpecificDrink(cocktailNameInput);
    }
};

function cocktailBtnHandler() {
    cocktailModalEl.classList.remove("hide");
    
    var confirmBtn = document.getElementById("random-confirm");
    var cancelBtn = document.getElementById("random-cancel");    

    confirmBtn.addEventListener("click", getRandomDrink);
    cancelBtn.addEventListener("click", resetState);
};

function cocktailSearchErrorHandler() {
    var surpriseMeBtn = document.getElementById("surprise-confirm");
    surpriseMeBtn.addEventListener("click", getRandomDrink);
};

cocktailFormEl.addEventListener("submit", getSpecificDrink);
cocktailBtn.addEventListener("click", cocktailBtnHandler);