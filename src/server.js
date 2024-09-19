const express = require('express');
const path = require('path');
const cvRoutes = require('./routes/cvRoutes');
const errorHandler = require('./middlewares/errorHandler');
const { loadLanguages } = require('./services/languageService');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

// Cargar idiomas antes de iniciar el servidor
loadLanguages().then(() => {
  app.use('/api', cvRoutes);
  app.use(errorHandler);

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}).catch(error => {
  console.error('Failed to load languages:', error);
  process.exit(1);
});