const express = require('express');
const routes = require('../Routes/routes');
const cors = require('cors');
const {boomErrorHandler} = require('../Middlewares/errorHandlers');
const {baseUrl} = require('../Types/types');

const app = express();
const port = process.env.PORT || 3000;

const allowedSides = [baseUrl];

app.use(cors({
    origin: (origin, callback) => {
        if (allowedSides.includes(origin) || !origin) {
            callback(null, true);   
        } else {
            callback(new Error('Not allowed side'));
        }
    }
}))

routes(app);

app.use(boomErrorHandler);
app.listen(port, () => {
    console.log('Running at the port '+ port);
});

