const booksRoute = require('./booksRoute');

const routes = (app) => {
    app.use('/books', booksRoute)
}

module.exports = routes