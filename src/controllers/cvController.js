// src/controllers/cvController.js

const { getLanguageData } = require('../services/languageService');
const cvService = require('../services/cvService');

exports.getLanguage = (req, res) => {
  const lang = req.query.lang || 'en';
  res.json(getLanguageData(lang));
};

exports.exportCV = async (req, res, next, format) => {
  try {
    const lang = req.query.lang || 'en';
    const content = await cvService.generateCV(format, lang);
    
    res.contentType(getContentType(format));
    res.send(content);
  } catch (error) {
    next(error);
  }
};

exports.renderCV = async (req, res, next) => {
  try {
    const lang = req.query.lang || 'en';
    const html = await cvService.renderCV(lang);
    res.send(html);
  } catch (error) {
    next(error);
  }
};

function getContentType(format) {
  switch (format) {
    case 'png': return 'image/png';
    case 'pdf': return 'application/pdf';
    case 'html': return 'text/html';
    case 'audio': return 'audio/mpeg';
    default: throw new Error('Unsupported format');
  }
}