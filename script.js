const API_KEY = "05748f69c08f4879ac8d20f03c3c04da"; 

async function searchRecipes() {
    const query = document.getElementById("searchQuery").value;
    const diet = document.getElementById("dietFilter").value;
    const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&query=${query}&diet=${diet}&number=10`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        displayRecipes(data.results);
    } catch (error) {
        console.error("Error fetching recipes:", error);
        document.getElementById("recipeResults").innerHTML = "<p>Failed to load recipes. Try again.</p>";
    }
}

async function getRecipeInstructions(recipeId) {
    const url = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.analyzedInstructions.length > 0) {
            return data.analyzedInstructions[0].steps
                .map(step => `${step.number}. ${step.step}`)
                .join("<br>");
        }

        // If no step-by-step instructions, fall back to source URL
        return `Instructions not available. <a href="${data.sourceUrl}" target="_blank">View Full Recipe</a>`;
    } catch (error) {
        console.error("Error fetching instructions:", error);
        return "Failed to load instructions.";
    }
}

async function displayRecipes(recipes) {
    const container = document.getElementById("recipeResults");
    container.innerHTML = "";

    if (recipes.length === 0) {
        container.innerHTML = "<p>No recipes found.</p>";
        return;
    }

    for (const recipe of recipes) {
        const recipeCard = document.createElement("div");
        recipeCard.classList.add("recipe-card");

        // Fetch instructions for each recipe
        const instructions = await getRecipeInstructions(recipe.id);

        recipeCard.innerHTML = `
            <h3>${recipe.title}</h3>
            <img src="${recipe.image}" alt="${recipe.title}">
            <p><strong>Instructions:</strong></p>
            <p>${instructions}</p>
            
        `;

        container.appendChild(recipeCard);
    }
}

// Back to Top Button Functionality
const backToTopBtn = document.createElement("button");
backToTopBtn.id = "backToTop";
backToTopBtn.innerText = "Back to Top";
document.body.appendChild(backToTopBtn);

// Show button when scrolling down
window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        backToTopBtn.style.display = "block";
    } else {
        backToTopBtn.style.display = "none";
    }
});

// Scroll smoothly to top when clicked
backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

// Add hover effect to make recipes shake slightly
document.addEventListener("DOMContentLoaded", () => {
    const recipeCards = document.querySelectorAll(".recipe-card");

    recipeCards.forEach((card) => {
        card.addEventListener("mouseenter", () => {
            card.classList.add("shake");
        });

        card.addEventListener("mouseleave", () => {
            card.classList.remove("shake");
        });
    });
});
