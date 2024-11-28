export const errorHandler = (error, req, res, next) => {
    console.log(error);
    if (error.code) {
        res.status(400).send({
            status: 'error',
            error: error.name,
            cause: error.cause,
            message: error.message,
        });
    } else {
        res.status(500).send({
            status: 'error',
            error: 'Error no manejado',
            message: 'Error interno del servidor',
        });
    }
};
