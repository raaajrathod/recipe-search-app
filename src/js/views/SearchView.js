import {elements} from './base';


export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = "";
};

export const clearResults = () => {
    elements.searchResultList.innerHTML = "";
    elements.resultPage.innerHTML = '';
}
/* 
// Pasta with tomato and Spinach
acc = 0 / acc + cur = 5 / newTitle = ['pasta']
acc = 5 / acc + cur = 9 / newTitle = ['pasta', 'with']
acc = 9 / acc + cur = 15 / newTitle = ['pasta', 'with', 'tomato']
acc = 15 / acc + cur = 18 / newTitle = ['pasta', 'with', 'tomato']
acc = 18 / acc + cur = 25 / newTitle = ['pasta', 'with', 'tomato']
*/
const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit){
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit){
                newTitle.push(cur);
            }
            return acc + cur.length; // This return statment will update the acc
        }, 0);
        /// Return the Result
        return `${newTitle.join(' ')} ...`;
    }
    return title;
}

const renderRecipe = recipe => {
    const markup = `
        <li>
            <a class="results__link " href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;
    elements.searchResultList.insertAdjacentHTML ('beforeend', markup);
};

const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
            <svg class="search__icon">
                <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
            </svg>
            
    </button>
            <!--
                <button class="btn-inline results__btn--prev">
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-left"></use>
                    </svg>
                    <span>Page 1</span>
                </button>
                <button class="btn-inline results__btn--next">
                    <span>Page 3</span>
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-right"></use>
                    </svg>
                </button>
            -->

`; 

const renderButtons = (page, numOfResults, resPerPage) => {
    const pages = Math.ceil(numOfResults/resPerPage);
    let button;
    if (page === 1 && pages > 1 ){
        // Button to go on next page
        button = createButton(page , 'next');
    } else if (page === pages){
        // button to go on previos page 
       button = createButton (page , 'prev');
    }else if (page < pages && pages > 1) {
        // Both buttons 
        button = `
            ${button = createButton (page , 'prev')}
            ${button = createButton (page , 'next')}
        `;
    }

    elements.resultPage.insertAdjacentHTML('afterbegin', button);
}

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;
    recipes.slice(start, end).forEach(renderRecipe);
    renderButtons(page, recipes.length, resPerPage);
};