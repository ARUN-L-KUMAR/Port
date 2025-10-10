# API Documentation

## Base URL
```
http://localhost:8000/api
```

## Endpoints

### 1. Root Endpoint

**GET /**

Returns a simple message to confirm the API is working.

**Response:**
```json
{
  "message": "Hello World"
}
```

### 2. Health Check

**GET /health**

Returns the health status of the application and database connection.

**Response (Success):**
```json
{
  "status": "OK",
  "timestamp": "2023-01-01T00:00:00.000Z",
  "service": "portfolio-backend"
}
```

**Response (Error):**
```json
{
  "status": "ERROR",
  "timestamp": "2023-01-01T00:00:00.000Z",
  "service": "portfolio-backend",
  "error": "Error message"
}
```

### 3. Create Status Check

**POST /status**

Creates a new status check entry.

**Request Body:**
```json
{
  "client_name": "string" (required)
}
```

**Response (Success):**
```json
{
  "id": "uuid",
  "client_name": "string",
  "timestamp": "ISO 8601 date string"
}
```

**Response (Validation Error):**
```json
{
  "error": "Validation failed",
  "details": ["array of error messages"]
}
```

### 4. Get Status Checks

**GET /status**

Retrieves all status checks, limited to 1000 entries.

**Response:**
```json
[
  {
    "id": "uuid",
    "client_name": "string",
    "timestamp": "ISO 8601 date string"
  }
]
```

## Error Responses

All error responses follow this format:

```json
{
  "error": {
    "message": "Error message",
    "status": 500,
    "timestamp": "ISO 8601 date string"
  }
}
```

Or for validation errors:

```json
{
  "error": "Validation failed",
  "details": ["array of error messages"]
}
```