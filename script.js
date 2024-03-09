import express from 'express';
import multer from 'multer';
import fs from 'fs/promises';
import mongoose from 'mongoose';
import { Buffer } from 'buffer';
import path from 'path';
import fetch from 'node-fetch'; 
import { File } from './models/files.js'; 

const upload = multer({ dest: 'uploads/' });

const app = express();

mongoose.connect('mongodb://localhost:27017/', { useNewUrlParser: true, useUnifiedTopology: true });

const fileSchema = new mongoose.Schema({ data: Buffer, contentType: String });
const File = mongoose.model('File', fileSchema);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); 
});

app.post('/upload', upload.single('fileInput'), async (req, res) => {
    try {
        const fileData = await fs.readFile(req.file.path);
        const file = new File({ data: fileData, contentType: req.file.mimetype });
        await file.save();
        // OCR API
        const apiKey = 'K86594455288957';
        const url = 'https://api.ocr.space/parse/image';
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'apiKey': apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                base64Image: `data:${req.file.mimetype};base64,${fileData.toString('base64')}`
            })
        });
        const data = await response.json();
        res.send(data); 
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/file/:id', async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) {
            return res.status(404).send('File not found.');
        }
        res.set('Content-Type', file.contentType);
        res.send(file.data);
    } catch (err) {
        res.status(500).send(err);
    }
});

fs.readFile('output.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(`Error reading file from disk: ${err}`);
    } else {
        console.log(`File contents: ${data}`);
    }
});

app.listen(3000, () => console.log('Server started on port 3000'));