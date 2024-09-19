// src/utils/logger.js

const winston = require('winston');
const path = require('path');

// Configuración de niveles de log personalizados
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Configuración de colores para cada nivel
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Añadir colores a winston
winston.addColors(colors);

// Configuración del formato de log
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// Configuración de los transportes (destinos) de los logs
const transports = [
  // Consola
  new winston.transports.Console(),
  // Archivo para todos los logs
  new winston.transports.File({
    filename: path.join(__dirname, '..', '..', 'logs', 'all.log'),
  }),
  // Archivo solo para errores
  new winston.transports.File({
    filename: path.join(__dirname, '..', '..', 'logs', 'error.log'),
    level: 'error',
  }),
];

// Crear el logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels,
  format,
  transports,
});

// Si estamos en desarrollo, log a la consola
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

module.exports = logger;