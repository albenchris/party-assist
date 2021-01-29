var randomBtn = document.getElementById("random-btn")
var randomModalEl = document.getElementById("random-modal");

var mainContainerEl = document.getElementById("main-content-container");

function getRandomDrink() {
    resetState();
    mainContainerEl.innerHTML = "";

    var randomURL = "https://www.thecocktaildb.com/api/json/v1/1/random.php"

    fetch(randomURL).then(function(response) {
        return response.json().then(function(data) {
            // console.log(data);
            displayRandomCocktail(data);
        })
    }).catch(function(err) {
        console.log("Error: ", err);
    });
};

function displayRandomCocktail(cocktail) {
    // image start
    var imgContainerEl = document.createElement("div");
    imgContainerEl.setAttribute("id", "image-container");
    imgContainerEl.classList.add("pur-u-1-4");
    var image = document.createElement("img");
    image.setAttribute("src", cocktail.drinks[0].strDrinkThumb);
    imgContainerEl.appendChild(image);
    // image end

    // ingredients start
    var ingredientsEl = document.createElement("div");
    ingredientsEl.setAttribute("id", "ingredients-container");
    ingredientsEl.classList.add("pur-u-1-4");
    var drinkName = document.createElement("h3");
    drinkName.classList.add("drink-name");
    drinkName.innerHTML = cocktail.drinks[0].strDrink
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
    ingredientsEl.appendChild(drinkName);
    ingredientsEl.appendChild(ingredientsList);
    // ingredients end

    // instructions start
    var instructionsEl = document.createElement("div");
    instructionsEl.setAttribute("id", "instructions-container");
    instructionsEl.classList.add("pur-u-1-4");
    instructionsEl.innerHTML = 
        "<h3 class='instructions'>Instructions</h3>" +
        "<p>" +
        cocktail.drinks[0][`strInstructions`] +
        "</p>";
    // instructions end

    mainContainerEl.appendChild(imgContainerEl);
    mainContainerEl.appendChild(ingredientsEl);
    mainContainerEl.appendChild(instructionsEl);
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