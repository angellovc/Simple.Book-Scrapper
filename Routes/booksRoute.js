const fs = require('fs');
const express = require('express');
const router = express.Router();
const BookManager = require('../Services/booksManager');
const service = new BookManager({url: "https://www.gutenbe.org"});

router.get('/', (request, response) => {
    response.send('API with router')
});

router.get('/:book', async (request, response, next) => {
    try {
        const books = await service.loadBooks(request.params.book);
        response.json(books);
    } catch(error){
        next(error);
    }

});

router.get('/:book/download', async (request, response, next) => {
    try {
        const {stream, filepath} = await service.downloadBook(request.params.book);
        stream.on('finish', function() {
            console.log(filepath);
            const folders = filepath.split('/');
            response.download(filepath, folders[folders.length]);
        });
        response.on('finish', function() {
            fs.unlinkSync(filepath);
        });
    } catch(error){
        next(error);
    }

});


module.exports = router