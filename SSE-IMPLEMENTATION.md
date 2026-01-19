# HES Real-time Data SSE Implementation

## Overview
This implementation adds Server-Sent Events (SSE) functionality to the HES real-time data page, enabling live meter data streaming.

## Components Updated

### 1. Real-time Data Page (`src/app/(protected)/hes/hes-realtime-data/page.tsx`)
- **Added SSE Integration**: Now uses `useSSE` hook from `@/hooks/use-sse`
- **Added sseService**: Uses `sseService` from `@/service/sse-service` for individual meter connections
- **Connection Status**: Shows real-time connection status with visual indicators
- **Error Handling**: Includes connection retry functionality

### 2. Real-time Data Table (`src/components/hes/real-time-data-table.tsx`)
- **SSE Data Support**: Now accepts and processes real-time SSE data
- **Connection Status**: Displays connection status for each selected meter
- **Hybrid Data**: Combines real-time SSE data with fallback to mock data
- **Props Interface**: Updated to accept SSE-related props

### 3. Environment Configuration (`.env.example`)
- **SSE API URL**: `NEXT_PUBLIC_SSE_API_URL` for backend SSE endpoint
- **Reconnection Settings**: Configurable retry intervals and attempts

## Required Backend API Endpoints

To make this work, your backend needs to implement these SSE endpoints:

### 1. General SSE Stream
```
GET /api/sse/meters
```
- Streams general meter data updates
- Used for global monitoring

### 2. Individual Meter Status
```
GET /api/sse/meter-status/{meterId}
```
- Streams connection status for specific meter
- Emits `meter-status` events

### 3. Individual Meter Real-time Data
```
GET /api/sse/real-time-data/{meterId}
```
- Streams real-time reading data for specific meter
- Emits meter reading data

## SSE Data Format

### Meter Status Event
```json
{
  "meterNo": "62124022443",
  "lastSeen": "2025-12-15T15:42:58.080Z",
  "status": "CONNECTED"
}
```

### Real-time Data Event
```json
{
  "meterNo": "62124022443",
  "timestamp": "2025-12-15T15:42:58.080Z",
  "Total absolute cumulative active energy register": "1456.78 kWh",
  "Frequency": "50.1 Hz",
  "L1 Voltage": "230.5 V",
  "L1 Current": "5.2 A",
  "Remaining Credit Amount": "250.00"
}
```

## Environment Setup

1. **Copy environment file**:
   ```bash
   cp .env.example .env
   ```

2. **Configure SSE API URL** in `.env`:
   ```env
   NEXT_PUBLIC_SSE_API_URL=http://your-backend-url/api/sse
   ```

3. **Install required dependencies** (if not already installed):
   ```bash
   # The following should already be available:
   # - @tanstack/react-query (for useSSE hook)
   # - React hooks (useState, useEffect, etc.)
   ```

## Key Features

### 1. Automatic Reconnection
- Configurable retry attempts (default: 3)
- Configurable retry interval (default: 5000ms)
- Visual connection status indicator

### 2. Connection Management
- Individual meter connections via `sseService`
- Automatic cleanup on component unmount
- Global connection status tracking

### 3. Data Fallback
- Real-time SSE data takes priority
- Falls back to mock data if SSE unavailable
- Seamless transition between data sources

### 4. Error Handling
- Connection error display
- Manual retry functionality
- Console error logging for debugging

## Usage

1. **Navigate to HES Real-time Data page**
2. **Select meters** using the filter panel
3. **Monitor connection status** via visual indicators
4. **View real-time data** as it streams in
5. **Export data** using the export button

## Troubleshooting

### 404 Errors on SSE Endpoints
- Ensure backend SSE endpoints are implemented
- Verify `NEXT_PUBLIC_SSE_API_URL` is correctly set
- Check CORS configuration for SSE connections

### Connection Issues
- Check network connectivity
- Verify backend SSE server is running
- Review browser console for detailed errors

### Data Not Updating
- Confirm SSE events are being emitted correctly
- Check data format matches expected structure
- Verify meter IDs are correct

## Integration Notes

- **useSSE Hook**: Manages general SSE connection
- **sseService**: Manages individual meter connections
- **RealTimeDataTable**: Processes and displays data
- **Connection Status**: Real-time visual feedback

This implementation provides a robust foundation for real-time meter data streaming while maintaining backward compatibility with mock data fallbacks.