const express = require('express');
const { Gaze } = require('gaze');
const fs = require('fs');
const path = require('path');
const merger = require('swagger-merger');

const app = express();
const APP_PORT = process.env.APP_PORT || 8000;
const SWAGGER_PORT = process.env.SWAGGER_PORT || 8001;

function resolvePath(dir) {
  return path.join(__dirname, dir);
}

function mergeSwagger(project) {
  const inputPath = resolvePath(`../schemas/${project}/index.yaml`);
  const outputPath = resolvePath(`../schemas/${project}/swagger.yaml`);

  return merger({ input: inputPath, output: outputPath })
    .then(() => console.log(`Swagger merged for project: ${project}`))
    .catch((err) =>
      console.error(`Error merging Swagger for ${project}:`, err)
    );
}

function watch() {
  const gaze = new Gaze(resolvePath('../schemas/**'));

  gaze.on('error', (err) => {
    throw err;
  });

  gaze.on('all', (event, file) => {
    const relativePath = path.relative(resolvePath('../schemas'), file);
    const project = relativePath.split(path.sep)[0];

    try {
      mergeSwagger(project);
      fs.copyFileSync(
        resolvePath(`../schemas/${project}/swagger.yaml`),
        resolvePath(`../docs/swagger.yaml`)
      );
    } catch (err) {
      console.error(`Error processing project ${project}:`, err.message);
    }
  });
}

app.get('/:project', async (req, res) => {
  const project = req.params.project;
  const file = resolvePath(`../schemas/${project}/swagger.yaml`);

  try {
    if (!fs.existsSync(file)) {
      await mergeSwagger(project);
    }
    fs.copyFileSync(file, resolvePath(`../docs/swagger.yaml`));
    console.log(`redirecting to http://localhost:${SWAGGER_PORT}/`);
    res.redirect(`http://localhost:${SWAGGER_PORT}/`);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

watch();

app.listen(APP_PORT, () => {
  console.log(`Swagger-watch service running on http://localhost:${APP_PORT}`);
});
