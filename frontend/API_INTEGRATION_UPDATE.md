# API Integration Update - Count Endpoints

## Overview
Updated the frontend to use the new count endpoints (`/pdf/count` and `/summaries/count`) from the Go backend, providing more efficient statistics fetching.

## Changes Made

### 1. Updated API Client (`lib/api.js`)
Added new methods to both `pdfApi` and `summaryApi`:
- `pdfApi.getPDFCount()` - Returns `{count: number}`
- `summaryApi.getSummaryCount()` - Returns `{count: number}`

### 2. Created Stats Hook (`hooks/useStats.js`)
New custom hooks for efficient stats management:
- `useStats(autoRefresh, refreshInterval)` - Basic PDF and summary counts
- `useSummaryStats()` - Detailed summary statistics with fallback to count endpoint

Features:
- Automatic fetching on mount
- Optional auto-refresh with configurable interval
- Loading and error states
- Manual refresh capability

### 3. Updated Home Page (`app/page.js`)
- Replaced manual stats fetching with `useStats` hook
- Added loading states for better UX
- Simplified upload success handler to use `refreshStats()`
- Removed unused imports and code

### 4. Enhanced Summaries Page (`app/summaries/page.js`)
- Added fallback to backend stats endpoint when no filters applied
- Improved error handling for stats fetching
- Better performance by using backend aggregation when possible

## Benefits

### Performance Improvements
- **Reduced Data Transfer**: Count endpoints return only the count, not full paginated responses
- **Faster Response Times**: Dedicated count queries are more efficient than pagination queries
- **Better Caching**: Simple count responses are easier to cache

### User Experience
- **Real-time Updates**: Stats refresh immediately after uploads/deletions
- **Loading States**: Users see loading indicators while stats are fetching
- **Error Resilience**: Graceful fallbacks when stats endpoints fail

### Code Quality
- **Reusable Hooks**: Stats logic can be used across multiple components
- **Cleaner Components**: Separated stats logic from UI components
- **Better Error Handling**: Centralized error handling in hooks

## API Endpoints Used

### New Count Endpoints
```javascript
GET /pdf/count
// Response: { count: 42 }

GET /summaries/count  
// Response: { count: 128 }

GET /summaries/stats (if available)
// Response: { 
//   totalSummaries: 128,
//   byLanguage: { english: 80, indonesian: 48 },
//   byStyle: { short: 30, general: 60, detailed: 38 },
//   averageProcessingTime: 2.5
// }
```

### Usage Examples
```javascript
// Basic stats
const { totalDocuments, totalSummaries, loading, refreshStats } = useStats();

// Auto-refreshing stats (every 30 seconds)
const { totalDocuments, totalSummaries } = useStats(true, 30000);

// Detailed summary stats
const { totalSummaries, byLanguage, byStyle, averageProcessingTime } = useSummaryStats();

// Manual API calls
const pdfCount = await pdfApi.getPDFCount();
const summaryCount = await summaryApi.getSummaryCount();
```

## Backward Compatibility
- All existing API endpoints continue to work
- Pagination responses still include `totalItems` for compatibility
- No breaking changes to existing functionality

## Future Enhancements
1. **Bulk Operations UI**: Add multi-select and bulk delete for summaries
2. **Real-time Updates**: WebSocket integration for live stats updates
3. **Advanced Filtering**: Use backend filtering instead of client-side
4. **Caching Strategy**: Implement client-side caching for stats
5. **Dashboard Widgets**: Create reusable stat widgets for other pages

## Testing
To test the new functionality:
1. Upload a PDF - stats should update immediately
2. Generate a summary - summary count should increase
3. Delete documents/summaries - counts should decrease
4. Check loading states by throttling network in dev tools
5. Verify fallback behavior by temporarily breaking stats endpoint