const puppeteer = require('puppeteer');

exports.wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

exports.launchBrowser = async () => {
  console.log('Launching browser...');
  return await puppeteer.launch({
    headless: "new",
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-gpu'
    ],
    executablePath: process.env.CHROME_BIN || undefined,
  });
};

exports.createPage = async (browser, viewportWidth = 1200, viewportHeight = 800) => {
  console.log('Creating new page...');
  const page = await browser.newPage();
  await page.setViewport({ 
    width: viewportWidth, 
    height: viewportHeight, 
    deviceScaleFactor: 2 
  });
  return page;
};

exports.waitForImages = async (page) => {
  console.log('Waiting for images to load...');
  await page.evaluate(async () => {
    const selectors = Array.from(document.querySelectorAll("img"));
    await Promise.all(selectors.map(img => {
      if (img.complete) return;
      return new Promise((resolve, reject) => {
        img.addEventListener('load', resolve);
        img.addEventListener('error', reject);
      });
    }));
  });
};

exports.getPageHeight = async (page) => {
  console.log('Getting page height...');
  return await page.evaluate(() => document.body.scrollHeight);
};

exports.generatePDF = async (page) => {
  console.log('Generating PDF...');
  return await page.pdf({ 
    format: 'A4',
    printBackground: true,
    margin: {
      top: '0',
      right: '0',
      bottom: '0',
      left: '0'
    },
    preferCSSPageSize: true,
    scale: 1,
    quality: 100
  });
};

exports.takeScreenshot = async (page) => {
  console.log('Taking screenshot...');
  return await page.screenshot({ 
    fullPage: true,
    type: 'png',
    omitBackground: true
  });
};