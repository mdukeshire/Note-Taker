const express = require('express');
const path = require('path');
const fs = require('fs');
const db = require('./db/db.json')

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'))

app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    console.info(`GET /api/notes`);
    res.status(200).json(db);
});


app.get('/api/notes/:title', (req, res) => {
    if (req.params.title) {
        console.info(`${req.method} note request received`);
        const title = req.params.title;
        for (let i = 0; i < notes.length; i++) {
            const currentNote = notes[i];
            if (currentNote.title === title) {
                res.json(currentNote);
                return;
            }
        }
        res.status(404).send('No note found');
    } else {
        res.status(400).send('No ID');
    }
});

app.post('/api/notes', (req, res) => {

    console.info(`${req.method} add request received`);
    console.info(req.body)

    const { title, text } = req.body;

    if (title && text) {

        const newNote = {
            title,
            text
        };

        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            } else {

                const parsedNotes = JSON.parse(data);

                parsedNotes.push(newNote);

                fs.writeFile(
                    './db/db.json',
                    JSON.stringify(parsedNotes, null, 4),
                    (writeErr) =>
                        writeErr
                            ? console.error(writeErr)
                            : console.info('Updated succesfully')
                );
            }
        });
        res.status(201).json(res);
    } else {
        res.status(500).json('Error');
    }
});

app.listen(PORT, () =>
    console.log(`App listening http://localhost:${PORT} 🚀`)
);