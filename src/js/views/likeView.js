import {elements} from './base';

export const toggleLike = isLiked => {
    //icons.svg#icon-heart-outlined

    const iconString = isLiked ? "icon-heart" : 'icon-heart-outlined';

    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
};

export const toggleLikeMenu = numlikes => {
    elements.likeMenu.style.visibility = numlikes > 0 ? 'visible' : 'hidden';
}
export const renderLike = like => {
    const markup = `
    <li>
        <a class="likes__link" href="#${like.id}">
            <figure class="likes__fig">
                <img src="${like.img}" alt="Test">
            </figure>
            <div class="likes__data">
                <h4 class="likes__name">${like.title}</h4>
                <p class="likes__author">${like.publisher}</p>
            </div>
        </a>
    </li>
    
    `;
    elements.likeList.insertAdjacentHTML('afterbegin', markup)
}

export const deleteLike = id => {
    const item = document.querySelector(`.likes__link[href*="#${id}"]`);
    if (item) item.parentElement.removeChild(item);
}