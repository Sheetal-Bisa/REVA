import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [documents, setDocuments] = useState([]);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [chatSessions, setChatSessions] = useState([
    { id: 1, title: 'New Conversation', messages: [], timestamp: new Date().toISOString() }
  ]);
  const [currentSessionId, setCurrentSessionId] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.classList.toggle('light-theme', newTheme === 'light');
  };

  // Apply theme on mount
  React.useEffect(() => {
    document.body.classList.toggle('light-theme', theme === 'light');
  }, [theme]);

  // Fetch documents
  const fetchDocuments = async () => {
    try {
      const response = await axios.get(`${API_URL}/documents`);
      setDocuments(response.data.documents);
    } catch (error) {
      console.error('Failed to fetch documents');
    }
  };

  // Upload multiple documents
  const handleMultipleFileUpload = async () => {
    if (selectedFiles.length === 0) return;

    setIsLoading(true);
    const uploadResults = [];

    for (const file of selectedFiles) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post(`${API_URL}/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        uploadResults.push({
          success: true,
          filename: response.data.filename,
          chunks: response.data.chunk_count
        });
      } catch (error) {
        uploadResults.push({
          success: false,
          filename: file.name,
          error: error.response?.data?.detail || 'Upload failed'
        });
      }
    }

    setIsLoading(false);
    setSelectedFiles([]);
    fetchDocuments();

    // Show results
    alert(
      uploadResults.map(r =>
        r.success
          ? `✓ ${r.filename} (${r.chunks} chunks)`
          : `✗ ${r.filename}: ${r.error}`
      ).join('\n')
    );
  };

  // Send query
  const handleQuery = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage = { type: 'user', text: query, timestamp: new Date().toISOString() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setQuery('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/query`, {
        query: query,
        language: 'en',
        session_id: `session_${currentSessionId}`
      });

      const assistantMessage = {
        type: 'assistant',
        text: response.data.response,
        sources: response.data.sources,
        responseTime: response.data.response_time,
        timestamp: new Date().toISOString()
      };

      const newMessages = [...updatedMessages, assistantMessage];
      setMessages(newMessages);

      // Update chat session
      updateChatSession(currentSessionId, newMessages);
    } catch (error) {
      setMessages(prev => [...prev, {
        type: 'error',
        text: error.response?.data?.detail || 'Query failed',
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Update chat session
  const updateChatSession = (sessionId, messages) => {
    setChatSessions(prev => prev.map(session =>
      session.id === sessionId
        ? { ...session, messages, timestamp: new Date().toISOString(), title: messages[0]?.text.substring(0, 50) || 'New Conversation' }
        : session
    ));
  };

  // Create new chat session
  const createNewSession = () => {
    const newId = Math.max(...chatSessions.map(s => s.id)) + 1;
    setChatSessions([...chatSessions, {
      id: newId,
      title: 'New Conversation',
      messages: [],
      timestamp: new Date().toISOString()
    }]);
    setCurrentSessionId(newId);
    setMessages([]);
    setActiveTab('chat');
  };

  // Load chat session
  const loadChatSession = (sessionId) => {
    const session = chatSessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentSessionId(sessionId);
      setMessages(session.messages);
      setActiveTab('chat');
    }
  };

  // Delete chat session
  const deleteChatSession = (sessionId) => {
    if (chatSessions.length === 1) return;
    setChatSessions(prev => prev.filter(s => s.id !== sessionId));
    if (currentSessionId === sessionId) {
      const remaining = chatSessions.filter(s => s.id !== sessionId)[0];
      loadChatSession(remaining.id);
    }
  };

  React.useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <button className="theme-toggle" onClick={toggleTheme} title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {theme === 'dark' ? (
              <circle cx="12" cy="12" r="5" />
            ) : (
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            )}
          </svg>
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
        <h1 className="title">REVA</h1>
        <p className="subtitle">Retrieval Embedding Vector Agent</p>
      </header>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          Chat
        </button>
        <button
          className={`tab-button ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          Upload
        </button>
        <button
          className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </div>

      {/* Main Container */}
      <div className="container">
        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <section className="card chat-section full-width">
            <div className="section-header">
              <h2 className="section-title">Chat</h2>
              <button onClick={createNewSession} className="btn btn-secondary">
                + New Chat
              </button>
            </div>

            <div className="messages">
              {messages.length === 0 ? (
                <div className="empty-state">
                  Start a conversation by asking questions about your documents
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
        )}

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <section className="card upload-section full-width">
            <h2 className="section-title">Upload Documents</h2>

            <div className="upload-area">
              <input
                type="file"
                accept=".txt,.md,.csv"
                multiple
                onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
                className="file-input"
                id="file-input-multiple"
              />
              <label htmlFor="file-input-multiple" className="file-label">
                {selectedFiles.length > 0
                  ? `${selectedFiles.length} file(s) selected`
                  : 'Choose files (.txt, .md, .csv)'}
              </label>

              {selectedFiles.length > 0 && (
                <div className="selected-files">
                  {selectedFiles.map((file, idx) => (
                    <div key={idx} className="file-item">
                      <span className="file-name">{file.name}</span>
                      <button
                        onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== idx))}
                        className="remove-file"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={handleMultipleFileUpload}
                disabled={selectedFiles.length === 0 || isLoading}
                className="btn btn-primary"
              >
                {isLoading ? 'Uploading...' : `Upload ${selectedFiles.length} Document${selectedFiles.length !== 1 ? 's' : ''}`}
              </button>
            </div>

            {/* Documents List */}
            {documents.length > 0 && (
              <div className="documents-section-content">
                <h3 className="subsection-title">Uploaded Documents ({documents.length})</h3>
                <div className="documents-list">
                  {documents.map(doc => (
                    <div key={doc.id} className="document-item">
                      <div className="document-info">
                        <div className="document-name">{doc.name}</div>
                        <div className="document-meta">{doc.chunk_count} chunks</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <section className="card analytics-section full-width">
            <h2 className="section-title">Chat History</h2>

            <div className="chat-sessions">
              {chatSessions.map(session => (
                <div key={session.id} className="session-item">
                  <div className="session-info" onClick={() => loadChatSession(session.id)}>
                    <div className="session-title">{session.title}</div>
                    <div className="session-meta">
                      {session.messages.length} messages • {new Date(session.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="session-actions">
                    <button
                      onClick={() => loadChatSession(session.id)}
                      className="btn btn-secondary btn-small"
                    >
                      Continue
                    </button>
                    {chatSessions.length > 1 && (
                      <button
                        onClick={() => deleteChatSession(session.id)}
                        className="btn btn-danger btn-small"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default App;
