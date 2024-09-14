# CV Exporter

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Node Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)

CV Exporter is a web application that allows users to export their CV (Curriculum Vitae) in various formats, including PNG, PDF, and HTML. This project utilizes Express.js for the server-side implementation and Puppeteer for browser automation and document generation.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Docker Support](#docker-support)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Dependencies](#dependencies)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- Export CV as PNG image
- Export CV as PDF document
- Export CV as HTML file
- Responsive web design
- Docker support for easy deployment
- Fly.io configuration for cloud deployment

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (version 14.0.0 or higher)
- npm (usually comes with Node.js)
- Git (for version control)

## Installation

To install CV Exporter, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/cv-exporter.git
   ```

2. Navigate to the project directory:
   ```
   cd cv-exporter
   ```

3. Install the dependencies:
   ```
   npm install
   ```

## Usage

To start the server, run:

```
npm start
```

The application will be available at `http://localhost:3000`.

## API Endpoints

- `/`: Serves the main CV page
- `/export-image`: Exports the CV as a PNG image
- `/export-pdf`: Exports the CV as a PDF document
- `/export-html`: Exports the CV as an HTML file

## Docker Support

This project includes a Dockerfile for containerization. To build and run the Docker container:

1. Build the Docker image:
   ```
   docker build -t cv-exporter .
   ```

2. Run the container:
   ```
   docker run -p 3000:3000 cv-exporter
   ```

## Deployment

This project is configured for deployment on Fly.io. The `fly.toml` file contains the necessary configuration.

To deploy:

1. Install the Fly CLI
2. Authenticate with Fly.io
3. Run:
   ```
   fly deploy
   ```

## Project Structure

```
.
├── Dockerfile
├── fly.toml
├── package-lock.json
├── package.json
├── public
│   └── index.html
├── puppeteerUtils.js
└── server.js
```

- `Dockerfile`: Contains instructions for building the Docker image
- `fly.toml`: Configuration file for Fly.io deployment
- `package.json` & `package-lock.json`: Node.js package management files
- `public/index.html`: The main HTML file for the CV
- `puppeteerUtils.js`: Utility functions for Puppeteer operations
- `server.js`: The main Express.js server file

## Dependencies

- Express.js: Web application framework
- Puppeteer: Headless Chrome Node.js API
- pdf-lib: PDF manipulation library

For a full list of dependencies, refer to the `package.json` file.

## Development

To run the application in development mode with auto-reloading:

```
npm run dev
```

This command uses `nodemon` to watch for file changes and restart the server automatically.

## Contributing

Contributions to CV Exporter are welcome. Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
5. Push to the branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

## License

This project is licensed under the ISC License. See the `LICENSE` file for details.

## Contact

Your Name - your.email@example.com

Project Link: [https://github.com/yourusername/cv-exporter](https://github.com/yourusername/cv-exporter)