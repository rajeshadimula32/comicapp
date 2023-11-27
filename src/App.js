// src/App.js
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud';

function App() {
  const [comicText, setComicText] = useState('');
  const [comicPanels, setComicPanels] = useState([]);
  const [loading, setLoading] = useState(false); // Add loading state
  const [error, setError] = useState('');

  const generateComic = async () => {
    try {
      setLoading(true); // Set loading to true while generating

      const texts = comicText.split('\n').filter(Boolean);
      const images = [];

      for (const text of texts) {
        const response = await axios.post(
          API_URL,
          { inputs: text },
          {
            headers: {
              'Accept': 'image/png',
              'Authorization': 'Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM',
              'Content-Type': 'application/json'
            },
            responseType: 'arraybuffer',
          }
        );

        if (response.status === 200) {
          const blob = new Blob([response.data], { type: 'image/png' });
          const imageUrl = URL.createObjectURL(blob);
          images.push(imageUrl);
        } else {
          throw new Error(`Failed to generate comic panel: ${response.statusText}`);
        }
      }

      setComicPanels(images);
      setError('');
    } catch (error) {
      setError('An error occurred while generating the comic. Please try again later.');
      console.error('Error:', error);
    } finally {
      setLoading(false); // Set loading to false after images are loaded or an error occurs
    }
  };

  return (
    <div className="app">
      <div className="header">ComicApp</div>
      <div className="form-container">
        <label htmlFor="comic-text">Enter Text for 10 Panels:</label>
        <textarea
          id="comic-text"
          rows="4"
          cols="50"
          value={comicText}
          onChange={(e) => setComicText(e.target.value)}
        ></textarea>
        <div className="button-container">
          <button onClick={generateComic} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Comic'}
          </button>
        </div>
        {error && <p className="error">{error}</p>}
      </div>

      <div className="comic-container">
        {loading && <p>Loading...</p>}
        {!loading &&
          comicPanels.map((panel, index) => (
            <img
              key={index}
              src={panel}
              alt={`Comic Panel ${index + 1}`}
              className="comic-panel"
            />
          ))}
      </div>
    </div>
  );
}

export default App;
