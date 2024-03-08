import express from 'express';
import multer from 'multer';
import fs from 'fs/promises';
import mongoose from 'mongoose';
import { Buffer } from 'buffer';
import path from 'path';

const upload = multer({ dest: 'uploads/' });

const app = express();

mongoose.connect('mongodb://localhost:27017/', { useNewUrlParser: true, useUnifiedTopology: true });

const fileSchema = new mongoose.Schema({ data: Buffer, contentType: String });
const File = mongoose.model('File', fileSchema);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Assuming your HTML file is named 'index.html'
});

app.post('/upload', upload.single('fileInput'), async (req, res) => {
    try {
        const fileData = await fs.readFile(req.file.path);
        const file = new File({ data: fileData, contentType: req.file.mimetype });
        await file.save();
        res.send('File uploaded and saved in database.');
    } catch (err) {
        res.status(500).send(err);
    }
});

app.listen(3000, () => console.log('Server started on port 3000'));