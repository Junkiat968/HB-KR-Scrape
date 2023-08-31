import React, { useState } from 'react';
import axios from 'axios';
import { franc } from 'franc-min';
import { download } from 'downloadjs';

const Scraper = () => {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState('');

  const handleChange = (e) => {
    setUrl(e.target.value);
  };

  const handleScrape = async () => {
    try {
      const response = await axios.get(url);

      const htmlText = response.data;
console.log(htmlText)
      // Extract text content
      const textContent = htmlText.replace(/<[^>]*>?/gm, '');

      console.log("before filter", textContent)
      // Detect and filter out Korean words
      const re = /[\u3131-\uD79D]/ugi
// console.log("abcde".match(re)) // null
// console.log("안녕".match(re)) 
      const filteredText = textContent
        .split(/\s+/)
        .filter((word) => {
            // console.log("word match",word)
            // console.log("T/F",(word.match(re) == null))
            return (word.match(re) == null)
        //   const lang = franc(word, { minLength: 1 });
        //   return lang !== 'kor'; // Filter out Korean words
        })
        .join(' ');

      // Set the result
      setResult(filteredText);
      console.log("after filter",filteredText)
    } catch (error) {
      console.error('Error scraping data:', error);
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
  

  return (
    <div>
      <input type="text" placeholder="Enter HTML URL" onChange={handleChange} />
      <button onClick={handleScrape}>Scrape Text</button>
      <button onClick={handleDownload}>Download Filtered Text</button>
    </div>
  );
};

export default Scraper;
