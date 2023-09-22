const express = require('express');
const multer = require('multer');
const Docxtemplater = require('docxtemplater');
const PizZip = require('pizzip');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Serve static files from the "public" directory
app.use(express.static('public'));

// Handle file uploads
app.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    const docBuffer = req.file.buffer;

    // Create a new Docxtemplater instance with pizzip
    const zip = new PizZip(docBuffer);
    const doc = new Docxtemplater().loadZip(zip);

    // Perform any template variable replacements here if needed
    // For example: doc.setData({ variableName: 'replacementText' });
    // doc.render();

    // Send the processed Word document back to the client
    const outputBuffer = doc.getZip().generate({ type: 'nodebuffer' });
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', 'attachment; filename=processed.docx');
    res.send(outputBuffer);
  } catch (error) {
    console.error('Error processing the document:', error);
    res.status(500).send('Error processing the document.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
