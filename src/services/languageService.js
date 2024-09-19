const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

const LANGUAGES = ['en', 'es'];
const GITHUB_RAW_URL = 'https://raw.githubusercontent.com/osvalois/resume/main/public/lan/';

let languageData = {};

async function loadLanguages() {
  for (const lang of LANGUAGES) {
    try {
      const response = await axios.get(`${GITHUB_RAW_URL}${lang}.json`);
      languageData[lang] = response.data;
      
      // Guardar localmente para uso futuro
      await fs.writeFile(
        path.join(__dirname, '..', 'locales', `${lang}.json`),
        JSON.stringify(response.data, null, 2)
      );
    } catch (error) {
      console.error(`Failed to load language ${lang}:`, error);
      // Intentar cargar desde el archivo local si existe
      try {
        const localData = await fs.readFile(
          path.join(__dirname, '..', 'locales', `${lang}.json`),
          'utf-8'
        );
        languageData[lang] = JSON.parse(localData);
      } catch (localError) {
        console.error(`Failed to load local language file for ${lang}:`, localError);
      }
    }
  }
}

function getLanguageData(lang) {
  return languageData[lang] || languageData['en'];  // Fallback to English
}

module.exports = {
  loadLanguages,
  getLanguageData
};