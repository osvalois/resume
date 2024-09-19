// src/services/cvService.js

const puppeteer = require('puppeteer');
const { getLanguageData } = require('./languageService');
const {
  launchBrowser,
  createPage,
  waitForImages,
  takeScreenshot,
  generatePDF
} = require('../utils/puppeteerUtils');
const axios = require('axios');
const ejs = require('ejs');
const path = require('path');
const fs = require('fs').promises;

class CVService {
  constructor() {
    this.templatePath = path.join(__dirname, '../views/cv-template.ejs');
  }

  async generateCV(format, lang) {
    const languageData = getLanguageData(lang);
    const html = await this.renderCV(languageData);

    switch (format) {
      case 'png':
        return this.generateImage(html);
      case 'pdf':
        return this.generatePDF(html);
      case 'html':
        return html;
      case 'audio':
        return this.generateAudio(languageData);
      default:
        throw new Error('Unsupported format');
    }
  }

  async renderCV(languageData) {
    try {
      const template = await fs.readFile(this.templatePath, 'utf-8');
      return ejs.render(template, { data: languageData });
    } catch (error) {
      console.error('Error rendering CV:', error);
      throw new Error('Failed to render CV');
    }
  }

  async generateImage(html) {
    let browser;
    try {
      browser = await launchBrowser();
      const page = await createPage(browser);
      await page.setContent(html, { waitUntil: 'networkidle0' });
      await waitForImages(page);
      return await takeScreenshot(page);
    } finally {
      if (browser) await browser.close();
    }
  }

  async generatePDF(html) {
    let browser;
    try {
      browser = await launchBrowser();
      const page = await createPage(browser);
      await page.setContent(html, { waitUntil: 'networkidle0' });
      await waitForImages(page);
      return await generatePDF(page);
    } finally {
      if (browser) await browser.close();
    }
  }

  async generateAudio(languageData) {
    try {
      const text = this.generateTextForAudio(languageData);
      const response = await axios.post(
        'https://api.openai.com/v1/audio/speech',
        {
          model: 'tts-1',
          input: text,
          voice: 'alloy'
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          },
          responseType: 'arraybuffer'
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error generating audio:', error);
      throw new Error('Failed to generate audio');
    }
  }

  generateTextForAudio(languageData) {
    // Genera un texto resumido del CV para la versión de audio
    return `
      ${languageData.name}. ${languageData.title}.
      ${languageData.summary}
      Experiencia profesional:
      ${languageData.experience.map(exp => `
        ${exp.position} en ${exp.company} de ${exp.startDate} a ${exp.endDate}.
        ${exp.description}
      `).join('')}
      Educación:
      ${languageData.education.map(edu => `
        ${edu.degree} en ${edu.institution}, ${edu.year}.
      `).join('')}
      Habilidades: ${languageData.skills.join(', ')}.
    `;
  }
}

module.exports = new CVService();