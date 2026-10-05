// Envuelve un handler async de Express 4 para que cualquier error
// (de la base de datos, de parseo, etc.) llegue al middleware de errores
// en lugar de convertirse en una promesa rechazada que tumba el proceso.
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
