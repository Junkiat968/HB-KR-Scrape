import React, { useState } from 'react';
import axios from 'axios';
import { download } from 'downloadjs';
import { promisify } from 'util';
const JSZip = require('jszip/dist/jszip.min.js'); // Use the downgraded version

const Docxtemplater = require('docxtemplater');

const Scraper = () => {
  const [result, setResult] = useState('');

  const handleFileUpload = async (e) => {
    try {
      const file = e.target.files[0];

      // Read the uploaded Word document
      const reader = new FileReader();

      reader.onload = async () => {
        const docBuffer = reader.result;

        // Extract text content from the Word document using Docxtemplater
        const textContent = await extractTextFromWordDocument(docBuffer);

        // Detect and filter out Korean words
        const re = /[\u3131-\uD79D]/ugi;
        const filteredText = textContent
          .split(/\s+/)
          .filter((word) => word.match(re) === null)
          .join(' ');

        // Set the result
        setResult(filteredText);
      };

      if (file) {
        reader.readAsArrayBuffer(file);
      }
    } catch (error) {
      console.error('Error processing the document:', error);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([result], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'filtered_text.txt';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const extractTextFromWordDocument = async (docBuffer) => {
    try {
      // Convert the ArrayBuffer to a Uint8Array
      const uint8Array = new Uint8Array(docBuffer);

      // Create a ZIP archive
      const zip = new JSZip();
      zip.load(uint8Array);

      // Extract the document.xml from the Word document
      const documentXml = zip.file('word/document.xml').asText();

      // Parse the XML using Docxtemplater
      const doc = new Docxtemplater();
      doc.loadZip(zip);

      // Compile and render the document
      doc.render();

      // Extract text content
      const textContent = doc.getFullText();
      console.log(textContent)

      return textContent;
    } catch (error) {
      console.error('Error extracting text from the document:', error);
      return '';
    }
  };

  return (
    <div>
      <input type="file" accept=".docx" onChange={handleFileUpload} />
      <button onClick={handleDownload}>Download Filtered Text</button>
      <div>
        <strong>Filtered Text:</strong>
        <pre>{result}</pre>
      </div>
    </div>
  );
};

export default Scraper;
