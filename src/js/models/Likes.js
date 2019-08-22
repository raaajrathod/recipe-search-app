export default class Likes {
    constructor(){
        this.likes = [];
    }

    addLike (id,title, publisher, img) {
            const like =  {id,title, publisher, img}
            this.likes.push(like);
             //// Persist data in local Storage 
            this.persistData();


            return like;
    }

    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);
        this.persistData();
        // Persist data in local Storage 
    }

    isLiked (id) {
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    getTheNumber () {
        return this.likes.length;
    }

    persistData () {

        localStorage.setItem('like', JSON.stringify(this.likes));

    }

    readStorage () {
        const storage = JSON.parse(localStorage.getItem('like'));
        // Restore likes from the local storage 
        if (storage) this.likes = storage;
    }
}   

