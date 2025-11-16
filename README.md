# REVA - Retrieval Embedding Vector Agent

A sophisticated enterprise RAG (Retrieval-Augmented Generation) chatbot with a clean, professional interface inspired by Jony Ive's design principles.

## What is REVA?

**REVA** stands for **Retrieval Embedding Vector Agent** - an intelligent document analysis system that combines:
- **Retrieval**: Advanced document search capabilities
- **Embedding**: Semantic understanding through vector representations
- **Vector**: Efficient similarity matching
- **Agent**: Autonomous AI-powered assistance

## Features

### Core Capabilities
- **Multi-Document Upload**: Upload and process multiple documents simultaneously (.txt, .md, .csv)
- **Intelligent Q&A**: Advanced question answering using OpenAI GPT-4
- **Source Attribution**: Track and display source documents for every answer
- **Chat History**: Save and resume previous conversations
- **Session Management**: Create and manage multiple chat sessions

### User Interface
- **Dark/Light Theme**: Toggle between elegant dark and light modes
- **Tab Navigation**: Clean interface with Chat, Upload, and Analytics sections
- **Professional Design**: Minimalist aesthetic with purple accent colors
- **Responsive Layout**: Works seamlessly on desktop and mobile devices

## Tech Stack

**Backend:**
- FastAPI - High-performance Python web framework
- OpenAI GPT-4 - Advanced language model
- Vector Embeddings - Semantic document search
- Python 3.13

**Frontend:**
- React 18 - Modern UI framework
- Axios - HTTP client
- Custom CSS - Jony Ive-inspired design system
- LocalStorage - Theme and session persistence

## Setup Instructions

### Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- OpenAI API Key

### Quick Start (Local Development)

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Create virtual environment:**
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Configure environment variables:**

Create a `.env` file in the project root:
```bash
OPENAI_API_KEY=your_openai_api_key_here
```

5. **Start backend server:**
```bash
python main.py
```

Backend will run on `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start development server:**
```bash
npm start
```

Frontend will run on `http://localhost:3000`

**Note:** If port 3000 is already in use, you can run on a different port:
```bash
PORT=3001 npm start
```

## Usage Guide

### Getting Started

1. **Access the Application**
   - Open your browser and navigate to `http://localhost:3000` (or your configured port)

2. **Upload Documents**
   - Click on the "Upload" tab
   - Select one or more documents (.txt, .md, or .csv files)
   - Click "Upload" to process your documents

3. **Ask Questions**
   - Navigate to the "Chat" tab
   - Type your question in the input field
   - Receive AI-powered answers with source citations

4. **Manage Conversations**
   - Use the "Analytics" tab to view chat history
   - Continue previous conversations or start new ones
   - Delete old chat sessions as needed

5. **Customize Appearance**
   - Click the theme toggle button (top right) to switch between dark and light modes
   - Your preference will be saved automatically

## Design Philosophy

REVA is built following Jony Ive's design principles:
- **Simplicity**: Clean, uncluttered interface
- **Minimalism**: Only essential elements, nothing superfluous
- **Typography**: Clear, readable fonts with perfect spacing
- **Whitespace**: Thoughtful use of space for visual breathing room
- **Animations**: Smooth, purposeful transitions
- **Color**: Professional purple accent on neutral backgrounds
- **Elegance**: Sophisticated and refined aesthetic

## Project Structure

```
REVA/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   ├── venv/               # Virtual environment
│   └── uploads/            # Uploaded documents storage
├── frontend/
│   ├── public/
│   │   └── index.html      # HTML template
│   ├── src/
│   │   ├── App.js          # Main React component
│   │   ├── App.css         # Styles
│   │   ├── index.js        # React entry point
│   │   └── index.css       # Global styles
│   ├── package.json        # NPM dependencies
│   └── node_modules/       # NPM packages (not committed)
├── .env                     # Environment variables (not committed)
├── .env.example            # Environment template
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## API Endpoints

- `POST /upload` - Upload and process documents
- `POST /query` - Submit questions and get AI responses
- `GET /documents` - Retrieve list of uploaded documents

## Contributing

Contributions are welcome! Please ensure your code follows the existing design principles and maintains the clean, professional aesthetic.

## License

This project is for educational and enterprise use.

## Railway Deployment

REVA is ready for deployment on Railway! 

### Quick Deploy

1. Push your code to GitHub
2. Go to [Railway](https://railway.app/new)
3. Deploy from your GitHub repository
4. Add environment variable: `OPENAI_API_KEY`
5. Railway will automatically detect and deploy using the included configuration

### Detailed Instructions

- See [RAILWAY_DEPLOYMENT.md](RAILWAY_DEPLOYMENT.md) for complete deployment guide
- See [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) for step-by-step checklist
- Run `railway-setup.bat` (Windows) or `railway-setup.sh` (Mac/Linux) for interactive setup

### Configuration Files

The following files are configured for Railway deployment:
- `railway.json` - Railway project configuration
- `nixpacks.toml` - Build configuration
- `Procfile` - Start command
- `runtime.txt` - Python version
- `.railwayignore` - Files to exclude from deployment

## Acknowledgments

- Design inspired by Jony Ive's minimalist principles
- Powered by OpenAI's GPT-4
- Built with modern web technologies
- Deployment optimized for Railway
