// src/middlewares/errorHandler.js

const logger = require('../utils/logger');

// Mapa de códigos de error HTTP
const HTTP_STATUS_CODES = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

/**
 * Middleware para manejar errores centralizadamente
 * @param {Error} err - El error capturado
 * @param {Object} req - El objeto de solicitud Express
 * @param {Object} res - El objeto de respuesta Express
 * @param {Function} next - La función next de Express
 */
function errorHandler(err, req, res, next) {
  // Registrar el error
  logger.error(`Error: ${err.message}`, { 
    error: err, 
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip
  });

  // Determinar el código de estado HTTP
  const statusCode = err.statusCode || HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;

  // Preparar el mensaje de error
  const errorResponse = {
    error: {
      message: err.message || 'Se produjo un error interno en el servidor',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  };

  // Enviar la respuesta de error
  res.status(statusCode).json(errorResponse);
}

// Middleware para manejar rutas no encontradas
function notFoundHandler(req, res, next) {
  const err = new Error('Ruta no encontrada');
  err.statusCode = HTTP_STATUS_CODES.NOT_FOUND;
  next(err);
}

module.exports = {
  errorHandler,
  notFoundHandler
};