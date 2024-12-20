const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name = 'ValidationError')
        return response.status(400).json({ error: error.message })
    
    next(error)
}

module.exports = {
    errorHandler,
    unknownEndpoint
}