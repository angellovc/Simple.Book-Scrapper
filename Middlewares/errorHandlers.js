const boomErrorHandler = (error, request, response, next) => {
    if (error.isBoom != true) 
        next(error);
    
    const {output} = error;
    response.status(output.statusCode).json(output.payload);
}

module.exports = {
    boomErrorHandler
}