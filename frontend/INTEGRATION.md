# Frontend API Integration

This document describes how the Next.js frontend has been integrated with the Go backend API.

## API Integration

### API Service Layer (`lib/api.js`)
- **PDF API**: Upload, list, get, delete PDFs and generate summaries
- **Summary API**: List, get, delete summaries
- **Health API**: Check backend connectivity
- **Utility functions**: File size formatting, date formatting, status colors

### Custom Hooks (`hooks/useApi.js`)
- **useApi**: Generic hook for API calls with loading/error states
- **usePaginatedApi**: Hook for paginated data with search/filter support
- **useFileUpload**: Hook for file uploads with progress tracking

### Components
- **SummaryModal**: Modal for generating AI summaries with style and language options

## Pages Integration

### Documents (`/documents`)
- **Document listing**: Paginated list with search and sorting
- **File upload**: Drag & drop and file picker with progress
- **Document management**: View, generate summary, download, delete
- **Grid/List views**: Toggle between different display modes
- **Real-time updates**: Refresh data after operations

### Summaries (`/summaries`)
- **Summary listing**: Paginated list with filtering by style/language
- **Summary management**: View, copy, download, delete summaries
- **Statistics**: Count by language and average word count
- **Search functionality**: Search through summary content

### Home Page (`/`)
- **File upload**: Drag & drop PDF upload with progress
- **Live stats**: Real document and summary counts from API
- **Feature showcase**: Interactive summary style selection
- **Quick actions**: Navigation to main features

## API Endpoints Used

### PDF Management
```javascript
GET /pdf?page=1&itemsperpage=10&search=query&sort=created_at&order=desc
POST /pdf/upload (multipart/form-data)
GET /pdf/:id
DELETE /pdf/:id
POST /pdf/:id/summarize
```

### Summary Management
```javascript
GET /summaries?page=1&itemsperpage=10&search=query&sort=created_at&order=desc
GET /summaries/:id
DELETE /summaries/:id
```

### Health Check
```javascript
GET /ping
```

## Environment Variables

```env
NEXT_PUBLIC_API_URL_GO=http://localhost:8080
NEXT_PUBLIC_API_URL_PYTHON=http://localhost:8000
```

## Features Implemented

### ✅ Core Features
- [x] PDF upload with drag & drop
- [x] Document listing with pagination
- [x] Summary generation with AI
- [x] Search and filtering
- [x] Real-time statistics
- [x] Error handling
- [x] Loading states
- [x] Responsive design

### ✅ Advanced Features
- [x] File upload progress tracking
- [x] Grid/List view toggle
- [x] Copy to clipboard
- [x] Modal dialogs
- [x] Skeleton loading
- [x] Form validation
- [x] Status indicators

### ✅ UI/UX Features
- [x] Stroke-based design system
- [x] Hover animations
- [x] Focus states
- [x] Mobile responsive
- [x] Dark theme
- [x] Consistent typography

## Usage Examples

### Upload a PDF
```javascript
import { useFileUpload } from '../hooks/useApi';

const { upload, uploading, progress } = useFileUpload();

const handleUpload = async (file) => {
  try {
    const result = await upload(file, 'Document Title');
    console.log('Upload successful:', result);
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

### Fetch Documents
```javascript
import { pdfApi } from '../lib/api';

const fetchDocuments = async () => {
  try {
    const response = await pdfApi.getPDFs({
      page: 1,
      itemsPerPage: 10,
      search: 'query',
      sortBy: 'created_at',
      order: 'desc'
    });
    console.log('Documents:', response.data);
  } catch (error) {
    console.error('Fetch failed:', error);
  }
};
```

### Generate Summary
```javascript
import { pdfApi } from '../lib/api';

const generateSummary = async (documentId) => {
  try {
    const response = await pdfApi.generateSummary(documentId, {
      style: 'general',
      language: 'english'
    });
    console.log('Summary generated:', response);
  } catch (error) {
    console.error('Summary generation failed:', error);
  }
};
```

## Error Handling

All API calls include comprehensive error handling:
- Network errors
- HTTP status errors
- JSON parsing errors
- User-friendly error messages
- Graceful fallbacks

## Performance Optimizations

- Debounced search queries (500ms delay)
- Pagination for large datasets
- Skeleton loading states
- Optimistic UI updates
- Efficient re-renders with proper dependencies

## Next Steps

1. Add document viewer for PDFs
2. Implement summary editing
3. Add bulk operations
4. Implement user authentication
5. Add real-time notifications
6. Implement caching strategies