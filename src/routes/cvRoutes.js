// src/routes/cvRoutes.js

const express = require('express');
const cvController = require('../controllers/cvController');

const router = express.Router();

// Ruta para obtener los datos del idioma
router.get('/language', cvController.getLanguage);

// Rutas para exportar el CV en diferentes formatos
router.get('/export-png', (req, res, next) => cvController.exportCV(req, res, next, 'png'));
router.get('/export-pdf', (req, res, next) => cvController.exportCV(req, res, next, 'pdf'));
router.get('/export-html', (req, res, next) => cvController.exportCV(req, res, next, 'html'));
router.get('/export-audio', (req, res, next) => cvController.exportCV(req, res, next, 'audio'));

// Ruta para renderizar el CV
router.get('/render', cvController.renderCV);

module.exports = router;