class Book {

    constructor({id, name, author, img}) {
        this.id = id;
        this.name = name;
        this.author = author,img;
        this.img = img
    }

    get id() {
        return this._id;
    }

    set id(newId) {
        this._id = newId;
    }

    get name() {
        return this._name;
    }

    set name(newName) {
        this._name = newName;
    }

    get author() {
        return this._author;
    }

    set author(newAuthor) {
        this._author = newAuthor;
    }

    get img() {
        return this._img;
    }

    set img(newImg) {
        this._img = newImg;
    }

    toJson() {
        return {
            id: this.id,
            name: this.name,
            author: this.author,
            img: this.img
        }
    }
}

module.exports = Book;