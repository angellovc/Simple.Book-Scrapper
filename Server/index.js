const express = require('express');
const routes = require('../Routes/routes');
const cors = require('cors');
const {boomErrorHandler} = require('../Middlewares/errorHandlers');

const app = express();
const port = 3000;

app.use(cors({
    origin: "*"
}))

routes(app);

app.use(boomErrorHandler);
app.listen(port, () => {
    console.log('Running at the port '+ port);
});

