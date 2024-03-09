// File: models/File.js

import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  data: Buffer,
  contentType: String
});

const l = mongoose.model('File', fileSchema);

export { l as File};