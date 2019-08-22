// Global app controller
import Search from './models/Search';
import * as SearchView from './views/SearchView';
import * as RecipeView from './views/RecipeView';
import * as ShoppingListView from './views/ShoppingListView';
import * as likeView from './views/likeView';
import {elements, renderloader, clearLoader} from './views/base';
import Recipe from './models/Recipe';
import List from './models/ShoppingList';
import Likes from './models/Likes';
/* Global state of the app
* Search Object - This Object contains data that has everything related to search Query
* Current recipe Object
* Shopping list object
* Liked Recipes 
*/
const state = {};
////////////////////////////////// Search Controller //////////////////////
const controlSearch = async () => {
    // 1) Get the Query
    const query = SearchView.getInput();  
    //console.log(query); 

    if (query) {
        // 2) New Search object and add it to state 
        state.search = new Search(query);

        // 3) Prepare UI for results 
        SearchView.clearInput();
        SearchView.clearResults();
        renderloader(elements.searchRes);
        // 4) Search for recipes 
        try {
            await state.search.getResults();
            
            // 5) Render Results on UI 
            //console.log (state.search.result);
            clearLoader();
            SearchView.renderResults(state.search.result);
        }
        catch (error) {
            alert('Error getting Result');
            clearLoader();
        }
            
        
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
    
});

elements.resultPage.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        SearchView.clearResults();
        SearchView.renderResults(state.search.result, goToPage);
        console.log(goToPage);
    }
});
 ////////////////////////// Recipe Controller ///////////////////////////
const controlRecipe = async () => {

    // Get ID from URL
    const id = window.location.hash.replace('#', '');
    //console.log (id);
    
    if (id) {
        // Prepare UI for Changes
        RecipeView.clearRecipe();
        renderloader(elements.recipe);
        // Create New recipe Object.
        state.recipe = new Recipe(id);
         
        try {
            
            // Get recipe
            await state.recipe.getRecipe();
            state.recipe.parseIngredient();
            // Calculate Servongs 
            state.recipe.calcTime ();
            state.recipe.calcServings ();
            // render the reciepe
            clearLoader();
            RecipeView.renderRecipe(state.recipe, state.like.isLiked(id));
            //console.log (state.recipe);
        }
        catch (error){

            alert('Error processing Recipe')
        }
    }
     
}

//window.addEventListener('hashchange', controlRecipe);
//window.addEventListener('load', controlRecipe);

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

//// Hnandling recepi button clicks 

//// List Controller ////

const controlList = () => {
    
    if (!state.list) state.list = new List();

    //state.list.deleteList();
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredients);
        ShoppingListView.renderItem(item);
        //console.log(item);
        
    });
    //console.log(state.recipe);
}


/// Handle delete   

elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid ;
    //console.log (id);
    if (e.target.matches('.shopping__delete, .shopping__delete *')){
        
        state.list.deleteItem(id);

        ShoppingListView.deleteItemm(id);
    } else if (e.target.matches('.shopping__count-value')){
        const val = parseFloat(e.target.value, 10);
        //console.log(val)
        state.list.updateCount (id, val);
    }
});
// Testing purpose 
state.like = new Likes();
likeView.toggleLikeMenu(state.like.getTheNumber());
///// Likes Controller ////////
const likesControl = () => {
    
    if (!state.like) state.like = new Likes();

    if (state.like.isLiked(state.recipe.id)){
        state.like.deleteLike(state.recipe.id);
        likeView.toggleLike(false);
        likeView.deleteLike(state.recipe.id);
    } else {
        const like = state.like.addLike(state.recipe.id, state.recipe.title, state.recipe.publisher, state.recipe.img );
        likeView.toggleLike(true);
        likeView.renderLike(like);
        console.log (like);
    }
    likeView.toggleLikeMenu(state.like.getTheNumber());
    //console.log (like);
}

// Rrestore like on Page loads 

window.addEventListener('load', ()=> {
    state.like = new Likes(); // Empty object when page loads 
    state.like.readStorage(); /// Reading the data from local storage
    likeView.toggleLikeMenu(state.like.getTheNumber());// toggle like button 

    // Render likes 
    state.like.likes.forEach(like => likeView.renderLike(like));
});


elements.recipe.addEventListener('click',e =>{
    if(e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease is Clicks
        if (state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            RecipeView.updateServingsIng(state.recipe);
        }
    } else if(e.target.matches('.btn-increase, .btn-increase *')) {
        // increase is Clicks
        state.recipe.updateServings('inc');
        RecipeView.updateServingsIng(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        likesControl();
    }
    
});

 


