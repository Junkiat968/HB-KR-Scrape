document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const processButton = document.getElementById('processButton');
    const downloadLink = document.getElementById('downloadLink');
  
    processButton.addEventListener('click', async () => {
      const file = fileInput.files[0];
  
      if (!file) {
        alert('Please select a Word document file.');
        return;
      }
  
      const formData = new FormData();
      formData.append('file', file);
  
      try {
        const response = await fetch('/upload', {
          method: 'POST',
          body: formData,
        });
  
        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
  
          // Display download link
          downloadLink.href = url;
          downloadLink.download = 'processed.docx';
          downloadLink.style.display = 'block';
        } else {
          alert('Error processing the document.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred.');
      }
    });
  });
  