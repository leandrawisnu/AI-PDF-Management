# AI PDF Management System

A full-stack application for managing PDF documents with AI-powered summarization capabilities using Google Gemini AI.

## 🏗️ Architecture

This project consists of three main components:

- **Frontend**: Next.js application for user interface
- **Backend (Go)**: Go/Fiber API for PDF management and database operations
- **Backend (Python)**: FastAPI service for AI-powered PDF summarization
- **Database**: PostgreSQL for data persistence

## 🚀 Features

- **PDF Upload & Management**: Upload, store, and manage PDF documents
- **AI Summarization**: Generate summaries using Google Gemini AI with multiple styles and languages
- **Multi-language Support**: Indonesian and English summarization
- **Summary Styles**: Short, General, and Detailed summaries
- **RESTful API**: Clean API design with proper DTOs and validation
- **Pagination**: Efficient data retrieval with pagination support
- **Search**: Search through PDFs and summaries
- **Dockerized**: Full containerization with Docker Compose

## 📁 Project Structure

```
AI PDF Management/
├── frontend/                 # Next.js frontend application
├── backend - go/            # Go backend (PDF management)
│   ├── dto/                 # Data Transfer Objects
│   ├── models/              # Database models
│   ├── utils/               # Utility functions
│   ├── migrate/             # Database migration
│   └── uploads/             # PDF file storage
├── backend - python/        # Python backend (AI summarization)
├── collection - go/         # Bruno API collection for testing
├── postgres/                # PostgreSQL configuration
└── docker-compose.yml       # Docker orchestration
```

## 🛠️ Tech Stack

### Frontend
- **Next.js**: React framework
- **JavaScript**: Programming language

### Backend (Go)
- **Go 1.25.2**: Programming language
- **Fiber v2**: Web framework
- **GORM**: ORM for database operations
- **PostgreSQL**: Database driver
- **UUID**: Unique identifier generation

### Backend (Python)
- **FastAPI**: Web framework
- **Google Gemini AI**: AI summarization service
- **PyPDF2**: PDF text extraction
- **Uvicorn**: ASGI server

### Database
- **PostgreSQL 15**: Primary database
- **Adminer**: Database administration tool

## 🚦 Getting Started

### Prerequisites

- Docker and Docker Compose
- Go 1.25.2+ (for local development)
- Python 3.8+ (for local development)
- Node.js 18+ (for local development)

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "AI PDF Management"
   ```

2. **Set up Python backend environment**
   ```bash
   cd "backend - python"
   cp .env.example .env
   # Edit .env and add your Google Gemini API key
   ```

3. **Run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

### Manual Setup (Development)

#### Database Setup
```bash
cd postgres
docker-compose up -d
```

#### Go Backend
```bash
cd "backend - go"
go mod tidy
go run migrate/main.go  # Run database migration
go run main.go          # Start the server
```

#### Python Backend
```bash
cd "backend - python"
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🌐 API Endpoints

### Go Backend (Port 8080)

#### PDF Management
- `GET /ping` - Health check
- `GET /pdf` - List PDFs with pagination
- `POST /pdf` - Create PDF record manually
- `GET /pdf/:id` - Get PDF details with summaries
- `DELETE /pdf/:id` - Delete PDF
- `POST /pdf/upload` - Upload PDF file
- `POST /pdf/:id/summarize` - Generate AI summary

#### Summary Management
- `GET /summaries` - List summaries with pagination
- `GET /summaries/:id` - Get summary details
- `DELETE /summaries/:id` - Delete summary

### Python Backend (Port 8000)

- `GET /` - Health check
- `GET /health` - Detailed health check
- `POST /summarize` - Generate PDF summary with AI

## 📊 Database Schema

### PDF Model
```go
type PDF struct {
    gorm.Model
    Filename  string
    FileSize  int64
    Title     string
    PageCount int
    Summaries []Summaries
}
```

### Summary Model
```go
type Summaries struct {
    gorm.Model
    Style       string
    Content     string
    PDFID       uint
    Language    string
    SummaryTime float64
}
```

## 🎯 API Usage Examples

### Upload PDF
```bash
curl -X POST http://localhost:8080/pdf/upload \
  -F "file=@document.pdf" \
  -F "title=My Document"
```

### Generate Summary
```bash
curl -X POST http://localhost:8080/pdf/1/summarize \
  -H "Content-Type: application/json" \
  -d '{
    "style": "general",
    "language": "english"
  }'
```

### List PDFs
```bash
curl "http://localhost:8080/pdf?page=1&itemsperpage=10&search=document"
```

## 🔧 Configuration

### Environment Variables

#### Python Backend (.env)
```env
GOOGLE_API_KEY=your_gemini_api_key_here
```

#### Docker Compose
- PostgreSQL: `postgres:password@localhost:5432/myapp`
- Go Backend: `localhost:8080`
- Python Backend: `localhost:8000`
- Frontend: `localhost:3000`
- Adminer: `localhost:8080` (database admin)

## 🧪 Testing

API testing collection is available in `collection - go/` directory using Bruno API client.

Available test cases:
- Ping endpoint
- Upload PDF
- Get all PDFs
- Get PDF details
- Generate summary
- Delete PDF

## 📝 Development Notes

### Summary Styles
- **Short**: Brief overview of the document
- **General**: Moderate-length summary with main points
- **Detailed**: In-depth summary with key explanations

### Supported Languages
- **Indonesian**: Bahasa Indonesia responses
- **English**: English responses

### File Upload
- Supported format: PDF only
- Files stored in `backend - go/uploads/` directory
- Automatic UUID-based filename generation
- Page count extraction using npdfpages

## 🚀 Deployment

The application is fully containerized and can be deployed using Docker Compose:

```bash
docker-compose up -d --build
```

Services will be available at:
- Frontend: http://localhost:3000
- Go API: http://localhost:8080
- Python API: http://localhost:8000