const {request: gaxios} = require('gaxios');
const cheerio = require('cheerio');
const Book = require('../Models/Book');
const path = require('path');
const fs = require('fs');
const { throws } = require('assert');
const boom = require('boom');


class BookManager{

    _books = [];

    constructor({url}) {
        this._url = url;
    }

    addBook(book) {
        this._books.push(book);
    }

    removeBook(bookToRemove) {
        const index = this._books.findIndex((book) => {book.id === bookToRemove.id});
        this._books.splice(index, 1);
    }

    getBook(bookId) {
        const index = this._books.findIndex(book => book.id === bookId);
        return this._books[index];
    }


    async loadBooks(searchingText) {
        this._books = []
        try {
            const url = `${this._url}/ebooks/search/?query=${searchingText}&submit_search=Go`;
            const response = await gaxios({url: url});
    
            const selector = cheerio.load(response.data);
            const scrappedBooks = selector('li[class="booklink"] a');
    
            scrappedBooks.each((index, book) => {
                this._books.push(
                    new Book(this.getBookData(book)).toJson()
                )
            });
        } catch(error){
            throw boom.serverUnavailable(`Scrapped URL ${this._url} is not working. Loading Step`);
        }

        return this._books;
    }

    async downloadBook(bookId) {
        try {

            const session = await this.getSession(bookId);
            const url = `${this._url}/ebooks/${bookId}.kindle.noimages?${session}`;
            const filepath = path.join(__dirname, `../${this.getBook(bookId)?.name.replace(" ", "_")}.mobi`);
            const bookResponse = await gaxios({
                url: url,
                responseType: "stream",
            });
            const file = await fs.createWriteStream(filepath);
            const stream = bookResponse.data.pipe(file)
            return {stream, filepath};
        } catch(error) {
            throw boom.serverUnavailable(`Scrapped web ${this._url} is not working. Downloading step`);
        }
    }

    getSession = async (bookId) => {
        try {
            const response = await gaxios({
                url: this._url+'/ebooks/'+bookId,
            });
            return response.headers['set-cookie'].split(';')[0];
        } catch{
            throw boom.serverUnavailable(`Scrapped web ${this._url} is not working. Session step`);
        }
    }
    
    getBookData(scrappedBook) {
        const [span1, span2] = scrappedBook.children.filter(node => node.name === 'span');

        return {
            id: scrappedBook.attribs['href'].split('/')[2],
            name: span2.children.filter(node => node.name === 'span')[0].children[0].data,
            author: span2.children.filter(node => node.name === 'span')[1].children[0].data,
            img: this._url+span1.children[1].attribs['src'],

        }
    }
} 

module.exports = BookManager;

// getCookie()
// scrapper();