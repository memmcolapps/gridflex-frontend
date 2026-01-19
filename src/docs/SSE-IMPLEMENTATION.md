# SSE (Server-Sent Events) Implementation for HES Real-Time Data

This documentation explains how to consume Server-Sent Events (SSE) from your Java Spring Boot backend using Next.js TypeScript.

## Overview

The implementation consists of several components:

1. **SSE Hook (`use-sse.ts`)** - Custom React hook for SSE connections
2. **SSE Service (`sse-service.ts`)** - Service class for managing multiple SSE connections
3. **SSE Demo Component (`sse-demo.tsx`)** - Example implementation showing how to use the service
4. **Updated Components** - Modified RealTimeDataTable and DataTable to support SSE

## Endpoints

Your Java Spring Boot backend provides two SSE endpoints:

### 1. Meter Status Stream
```
GET http://localhost:8081/grid-flex/v1/api/hes/service/meter-status/stream
```

**Sample Response:**
```
id:SYSTEM
event:meter-status
data:{"meterNo":"SYSTEM","lastSeen":"2025-11-24T11:42:56.5117527","status":"CONNECTED"}
```

### 2. Real-Time Data Stream
```
GET http://localhost:8081/grid-flex/v1/api/hes/service/stream
```

**Sample Response:**
```json
{
  "meterNo": "SYSTEM",
  "timestamp": "2025-11-24T11:42:56.5117527",
  "frequency": "50.1 Hz",
  "voltage": "230.5 V",
  "current": "5.2 A"
  // ... other meter readings
}
```

## Implementation Details

### 1. SSE Hook (`src/hooks/use-sse.ts`)

The `useSSE` hook provides a React-friendly way to consume SSE streams:

```typescript
const {
  data,
  isConnected,
  error,
  reconnect,
  close
} = useSSE('http://localhost:8081/grid-flex/v1/api/hes/service/meter-status/stream', {
  onMessage: (parsedData) => {
    console.log('Received:', parsedData);
  },
  onError: (error) => {
    console.error('SSE Error:', error);
  },
  reconnectInterval: 5000,
  reconnectAttempts: 5
});
```

**Features:**
- Automatic reconnection with configurable intervals
- Event listener support (e.g., 'meter-status' events)
- Connection status tracking
- Error handling
- Cleanup on component unmount

### 2. SSE Service (`src/service/sse-service.ts`)

The `SSEService` class manages multiple SSE connections:

```typescript
import { sseService } from '@/service/sse-service';

// Connect to meter status stream
sseService.connectToMeterStatus('http://localhost:8081/grid-flex/v1/api/hes/service/meter-status/stream', 'SYSTEM');

// Set up callbacks
sseService.onMeterStatus('SYSTEM', (status) => {
  console.log('Meter status:', status);
});

sseService.onConnectionStatus('SYSTEM', (connected) => {
  console.log('Connection status:', connected);
});
```

**Features:**
- Multiple connection management
- Per-meter callback registration
- Connection status monitoring
- Automatic cleanup

### 3. Demo Component (`src/components/hes/sse-demo.tsx`)

A complete working example that demonstrates:

- Connecting to both SSE streams
- Handling meter status updates
- Processing real-time data
- Displaying connection status
- UI indicators for meter connectivity

## Usage Examples

### Basic SSE Hook Usage

```typescript
import { useSSE } from '@/hooks/use-sse';

function MyComponent() {
  const { data, isConnected, error } = useSSE(
    'http://localhost:8081/grid-flex/v1/api/hes/service/meter-status/stream',
    {
      onMessage: (data) => {
        // Handle incoming data
      },
      onError: (error) => {
        // Handle connection errors
      }
    }
  );

  return (
    <div>
      <p>Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
      {error && <p>Error: {error}</p>}
      {/* Display data */}
    </div>
  );
}
```

### Using the SSE Service

```typescript
import { sseService } from '@/service/sse-service';
import { useEffect } from 'react';

function MyMeterComponent({ meterNo }: { meterNo: string }) {
  useEffect(() => {
    // Connect to streams
    sseService.connectToMeterStatus(
      'http://localhost:8081/grid-flex/v1/api/hes/service/meter-status/stream',
      meterNo
    );
    
    sseService.connectToRealTimeData(
      'http://localhost:8081/grid-flex/v1/api/hes/service/stream',
      meterNo
    );

    // Set up callbacks
    sseService.onMeterStatus(meterNo, (status) => {
      // Update meter status in state
    });

    sseService.onRealTimeData(meterNo, (data) => {
      // Update meter data in state
    });

    // Cleanup
    return () => {
      sseService.disconnectFromMeterStatus(meterNo);
      sseService.disconnectFromRealTimeData(meterNo);
    };
  }, [meterNo]);

  return <div>Meter Component</div>;
}
```

## Integration with Existing Components

### Updated RealTimeDataTable

The `RealTimeDataTable` component has been updated to:

1. Connect to both SSE streams
2. Handle meter status updates
3. Process real-time data
4. Display connection status
5. Show live data updates

### Updated DataTable

The `DataTable` component now includes:

1. **Status Column** - Shows connection status for each meter
2. **Status Icons** - Visual indicators (WiFi, WiFiOff, AlertCircle)
3. **Real-time Updates** - Automatically updates when new data arrives
4. **Connection Status** - Shows whether SSE streams are connected

## Error Handling

The implementation includes comprehensive error handling:

1. **Connection Errors** - Automatic reconnection attempts
2. **Parse Errors** - Graceful handling of malformed JSON
3. **Network Errors** - Fallback states and user notifications
4. **Cleanup** - Proper resource cleanup on component unmount

## Browser Compatibility

SSE is supported in all modern browsers:
- Chrome/Edge 6+
- Firefox 6+
- Safari 5+
- Opera 11+

For older browsers, consider using polyfills or WebSocket alternatives.

## Production Considerations

### 1. CORS Configuration

Ensure your Spring Boot backend includes proper CORS headers:

```java
@CrossOrigin(origins = "http://localhost:3000")
@GetMapping("/service/meter-status/stream")
public SseEmitter streamMeterStatus() {
    // Implementation
}
```

### 2. Authentication

If your SSE endpoints require authentication, you may need to:

1. Include authentication headers in the EventSource
2. Use query parameters for tokens
3. Implement session-based authentication

### 3. Performance

For production use with many meters:

1. **Connection Pooling** - Limit concurrent connections
2. **Data Batching** - Process multiple updates together
3. **Memory Management** - Clean up old data periodically
4. **Rate Limiting** - Throttle update frequency if needed

### 4. Security

1. **Input Validation** - Validate all incoming data
2. **Error Sanitization** - Don't expose sensitive information in errors
3. **Rate Limiting** - Prevent abuse of SSE endpoints
4. **HTTPS** - Use secure connections in production

## Testing

To test the SSE implementation:

1. Start your Spring Boot backend
2. Run the Next.js application
3. Navigate to the HES Real-Time Data page
4. Check the browser console for connection logs
5. Verify that data appears in the demo component

## Troubleshooting

### Common Issues

1. **Connection Fails**
   - Check if the backend is running
   - Verify the URL and port
   - Check CORS configuration

2. **No Data Received**
   - Check browser network tab for SSE events
   - Verify the backend is sending data
   - Check for JavaScript errors

3. **Reconnection Issues**
   - Check network connectivity
   - Verify backend is handling reconnection properly
   - Check for authentication issues

### Debug Tools

1. **Browser DevTools** - Network tab shows SSE connections
2. **Console Logging** - All SSE events are logged
3. **Connection Status** - Visual indicators show connection state

## Next Steps

1. **Remove Demo Component** - Once tested, remove or comment out the SSEDemo
2. **Integrate with Filters** - Connect SSE data with existing filter controls
3. **Add More Features** - Consider adding data export, historical views, etc.
4. **Optimize Performance** - Implement data caching and pagination if needed
5. **Add Tests** - Create unit and integration tests for SSE functionality

This implementation provides a solid foundation for consuming real-time data from your Java Spring Boot backend using Next.js and TypeScript.