import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:8000';

function App() {
  const [documents, setDocuments] = useState([]);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Upload document
  const handleFileUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setIsLoading(true);
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMessages([...messages, {
        type: 'system',
        text: `Document uploaded: ${response.data.filename} (${response.data.chunk_count} chunks)`
      }]);

      fetchDocuments();
      setSelectedFile(null);
    } catch (error) {
      setMessages([...messages, {
        type: 'error',
        text: error.response?.data?.detail || 'Upload failed'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch documents
  const fetchDocuments = async () => {
    try {
      const response = await axios.get(`${API_URL}/documents`);
      setDocuments(response.data.documents);
    } catch (error) {
      console.error('Failed to fetch documents');
    }
  };

  // Send query
  const handleQuery = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage = { type: 'user', text: query };
    setMessages([...messages, userMessage]);
    setQuery('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/query`, {
        query: query,
        language: 'en',
        session_id: 'default'
      });

      setMessages(prev => [...prev, {
        type: 'assistant',
        text: response.data.response,
        sources: response.data.sources,
        responseTime: response.data.response_time
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        type: 'error',
        text: error.response?.data?.detail || 'Query failed'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <h1 className="title">Knowledge Assistant</h1>
        <p className="subtitle">Enterprise Document Intelligence</p>
      </header>

      {/* Main Container */}
      <div className="container">
        {/* Upload Section */}
        <section className="card upload-section">
          <h2 className="section-title">Upload Document</h2>
          <div className="upload-area">
            <input
              type="file"
              accept=".txt,.md,.csv"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="file-input"
              id="file-input"
            />
            <label htmlFor="file-input" className="file-label">
              {selectedFile ? selectedFile.name : 'Choose file (.txt, .md, .csv)'}
            </label>
            <button
              onClick={handleFileUpload}
              disabled={!selectedFile || isLoading}
              className="btn btn-primary"
            >
              Upload
            </button>
          </div>
        </section>

        {/* Documents List */}
        {documents.length > 0 && (
          <section className="card documents-section">
            <h2 className="section-title">Documents ({documents.length})</h2>
            <div className="documents-list">
              {documents.map(doc => (
                <div key={doc.id} className="document-item">
                  <div className="document-name">{doc.name}</div>
                  <div className="document-meta">{doc.chunk_count} chunks</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Chat Section */}
        <section className="card chat-section">
          <h2 className="section-title">Ask Questions</h2>

          <div className="messages">
            {messages.length === 0 ? (
              <div className="empty-state">
                Upload a document and start asking questions
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={`message message-${msg.type}`}>
                  <div className="message-content">
                    {msg.text}
                    {msg.sources && (
                      <div className="sources">
                        <span className="sources-label">Sources:</span>
                        {msg.sources.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="message message-loading">
                <div className="loading-indicator">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleQuery} className="query-form">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a question about your documents..."
              className="query-input"
              disabled={isLoading || documents.length === 0}
            />
            <button
              type="submit"
              disabled={!query.trim() || isLoading || documents.length === 0}
              className="btn btn-primary"
            >
              Send
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default App;
