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
    imgContainerEl.classList.add("pur-u-1-4");

    var image = document.createElement("img");
    image.setAttribute("src", cocktail.drinks[0].strDrinkThumb);
    imgContainerEl.appendChild(image);
    // image end

    // ingredients start
    var ingredContainerEl = document.createElement("div");
    ingredContainerEl.setAttribute("id", "ingredients-container");
    ingredContainerEl.classList.add("pur-u-1-4");

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
    instrContainerEl.classList.add("pur-u-1-4");

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

// function cocktailModalSwitch() {
//     randomCocktailModalEl.classList.toggle("hide");
//     cocktailSearchModalEl.classList.toggle("hide");
// };

function cocktailSearchFormHandler(event) {
    event.preventDefault();
    // randomCocktailModalEl.classList.add("hide");
    // cocktailSearchModalEl.classList.remove("hide");

    var cocktailName = cocktailNameInput.value.trim();
    if (cocktailName) {
        getSpecificDrink(cocktailNameInput);
        cocktailNameInput.value = "";
    }

    // var cocktailSearchBtn = document.getElementById("cocktail-search-btn");
};

function cocktailBtnHandler() {
    cocktailModalEl.classList.remove("hide");
    
    var confirmBtn = document.getElementById("random-confirm");
    // var modalSwitchBtn = document.getElementById("switch-to-search");
    var cancelBtn = document.getElementById("random-cancel");


    confirmBtn.addEventListener("click", getRandomDrink);
    // modalSwitchBtn.addEventListener("click", cocktailModalSwitch);
    cancelBtn.addEventListener("click", resetState);
};

cocktailFormEl.addEventListener("submit", getSpecificDrink);
cocktailBtn.addEventListener("click", cocktailBtnHandler);