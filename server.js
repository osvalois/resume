const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const axios = require('axios');
const {
  wait,
  launchBrowser,
  createPage,
  waitForImages,
  getPageHeight,
  takeScreenshot,
  generatePDF
} = require('./puppeteerUtils');

const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Función para generar audio con la API de OpenAI
// Función para generar audio con la API de OpenAI
async function generateAudio(text) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/audio/speech',
      {
        model: 'text-to-speech-1', // Asegúrate de que este sea el modelo correcto
        input: text,
        voice: 'alloy'
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, // Asegúrate de que esta clave sea válida
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer' // Esto es importante para recibir el audio
      }
    );

    return response.data; // El audio se devuelve como un buffer
  } catch (error) {
    if (error.response) {
      console.error('Error generating audio:', error.response.data); // Imprime el error detallado
      throw new Error('Error generating audio: ' + error.response.data.message);
    } else {
      console.error('Error generating audio:', error);
      throw new Error('Error generating audio: ' + error.message);
    }
  }
}


// Extraer texto del CV
async function extractTextFromCV(page) {
  return await page.evaluate(() => {
    const sections = document.querySelectorAll('.cv-section');
    let cvText = '';
    sections.forEach(section => {
      const title = section.querySelector('h2').textContent;
      const content = section.querySelector('p, ul').textContent;
      cvText += `${title}. ${content} `;
    });
    return cvText.trim();
  });
}

// Exportar CV en el formato especificado
async function exportCV(res, format) {
  let browser;
  try {
    console.log(`Starting ${format} export process...`);
    browser = await launchBrowser();
    const page = await createPage(browser);

    console.log('Navigating to CV page...');
    await page.goto(`http://localhost:${port}`, {
      waitUntil: ['networkidle0', 'domcontentloaded'],
      timeout: 60000
    });

    console.log('Waiting for content to load...');
    await page.waitForSelector('.container', { visible: true, timeout: 30000 });
    await waitForImages(page);

    console.log('Waiting for final rendering...');
    await wait(2000);

    let content;
    switch (format) {
      case 'png':
        content = await takeScreenshot(page);
        res.contentType('image/png');
        break;
      case 'pdf':
        content = await generatePDF(page);
        res.contentType('application/pdf');
        break;
      case 'html':
        content = await page.content();
        res.contentType('text/html');
        break;
      case 'audio':
        const cvText = await extractTextFromCV(page);
        content = await generateAudio(cvText);
        res.contentType('audio/mpeg'); // Configurando el tipo de contenido a audio
        break;
      default:
        throw new Error('Unsupported format');
    }

    console.log(`Sending ${format}...`);
    res.send(content);
  } catch (error) {
    console.error(`Error generating CV ${format}:`, error);
    res.status(500).send(`Error generating CV ${format}: ${error.message}`);
  } finally {
    if (browser) {
      console.log('Closing browser...');
      await browser.close();
    }
  }
}

// Rutas para exportar en diferentes formatos
app.get('/export-image', async (req, res) => {
  await exportCV(res, 'png');
});

app.get('/export-pdf', async (req, res) => {
  await exportCV(res, 'pdf');
});

app.get('/export-html', async (req, res) => {
  await exportCV(res, 'html');
});

app.get('/export-audio', async (req, res) => {
  await exportCV(res, 'audio');
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
