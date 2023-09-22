const express = require('express');
const multer = require('multer');
const JSZip = require('jszip');
const fs = require('fs');
const app = express();
const port = 3000;

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Serve static files from the "public" directory
app.use(express.static('public'));

// Function to remove Korean characters from text
function removeKoreanCharacters(text) {
  // Regular expression to match Korean characters
  const koreanRegex = /[가-힣]/g;
  return text.replace(koreanRegex, '');
}

// Handle file uploads
app.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    const docBuffer = req.file.buffer;

    // Load the Word document using JSZip
    const zip = new JSZip();
    zip.load(docBuffer);

    // Access the document content (Word document is in "word/document.xml")
    const content = zip.file('word/document.xml').asText();

    // Remove Korean characters from the content
    const modifiedContent = removeKoreanCharacters(content);

    // Update the content in the Word document
    zip.file('word/document.xml', modifiedContent);

    // Generate the updated Word document
    const outputBuffer = zip.generate({ type: 'nodebuffer' });

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
