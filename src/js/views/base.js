export const elements = {
    searchRes: document.querySelector('.results'),
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchResultList: document.querySelector('.results__list'),
    resultPage: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shopping: document.querySelector('.shopping__list'),
    likeMenu: document.querySelector('.likes__field'),
    likeList: document.querySelector('.likes__list')
}

export const elementStrings = {
    loader: 'loader'
};

export const renderloader = parent => {
    const loader = `
        <div class = "${elementStrings.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        
        </div>
    `;
    parent.insertAdjacentHTML('afterbegin' , loader);
}

export const clearLoader = () => {
    const loader = document.querySelector(`.${elementStrings.loader}`)
    if (loader) loader.parentElement.removeChild(loader);
};