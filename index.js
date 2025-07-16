const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const port = 3000;

// Middleware to parse form data and JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Home route
app.get('/', (req, res) => {
    const filesDir = path.join(__dirname, 'files');

    fs.readdir(filesDir, function (err, files) {
        if (err) {
            console.error("Error reading /files:", err);

        }

        res.render("index", { files });
    });
});
app.post(`/create`, (req, res) => {
    fs.writeFile(path.join(`./files/${req.body.title.split(' ').join('')}.txt`), req.body.task, (err) => {
        res.redirect(`/`);
    })
})
app.get('/files/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'files', req.params.filename);

    fs.readFile(filePath, 'utf-8', (err, fileData) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(404).send('File not found');
        }

        res.render("show", { fileData, filename: req.params.filename });
    });
});
app.get(`/edit/:filename`, (req, res) => {
    res.render("edit", { filename: req.params.filename });
});
app.post('/rename', (req, res) => {
    const oldPath = path.join(__dirname, 'files', req.body.previous);
    const newPath = path.join(__dirname, 'files', req.body.updated);

    fs.rename(oldPath, newPath, (err) => {
        if (err) {
            console.error("Rename error:", err);
            return res.status(500).send("Rename failed");
        }
        res.redirect('/');
    });
});


// Start server
app.listen(port, () => {
    console.log(`App is listening at http://localhost:${port}`);
});
