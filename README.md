# Insurance LLM System

An AI-powered insurance analysis system with React frontend and FastAPI backend.

## 🚀 Quick Start

### Option 1: Single Command (Recommended)

**Windows:**
```bash
start.bat
```

**Unix/Linux/Mac:**
```bash
./start.sh
```

### Option 2: Manual Commands

1. **Install all dependencies:**
```bash
npm run install-all
```

2. **Start both servers:**
```bash
npm run dev
```

## 📋 Prerequisites

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **Python** (v3.8 or higher) - [Download here](https://python.org/)
- **npm** (comes with Node.js)

## 🛠️ Available Commands

### Root Level Commands
```bash
npm run dev          # Start both frontend and backend
npm run start        # Same as dev
npm run frontend     # Start only frontend
npm run backend      # Start only backend
npm run install-all  # Install all dependencies
npm run build        # Build frontend for production
npm run test         # Run frontend tests
```

### Individual Installation Commands
```bash
npm run frontend-install  # Install frontend dependencies only
npm run backend-install   # Install backend dependencies only
```

## 🌐 Access Points

- **Frontend (React)**: http://localhost:3000
- **Backend (FastAPI)**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 📁 Project Structure

```
insurance-llm-system/
├── frontend/          # React TypeScript application
├── backend/           # FastAPI Python application
├── package.json       # Root package configuration
├── start.bat         # Windows startup script
├── start.sh          # Unix/Linux/Mac startup script
└── README.md         # This file
```

## 🔧 Development

### Frontend Development
- Built with React 19 + TypeScript
- Uses Tailwind CSS for styling
- Framer Motion for animations
- Voice recognition capabilities

### Backend Development
- FastAPI Python framework
- FAISS vector database for semantic search
- MongoDB for document storage
- Advanced LLM integration

## 🚨 Troubleshooting

### Common Issues

1. **Port already in use:**
   - Frontend: Change port in `frontend/package.json` scripts
   - Backend: Change port in `package.json` backend script

2. **Dependencies not found:**
   - Run `npm run install-all` to install all dependencies

3. **Python modules not found:**
   - Run `npm run backend-install` to install Python dependencies

4. **Node modules not found:**
   - Run `npm run frontend-install` to install Node.js dependencies

### Windows Users
- Use `start.bat` for easy startup
- Make sure Python and Node.js are in your PATH

### Unix/Linux/Mac Users
- Use `./start.sh` for easy startup
- Make the script executable: `chmod +x start.sh`

## 📝 Environment Variables

Create a `.env` file in the backend directory if needed:

```env
MONGODB_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details 