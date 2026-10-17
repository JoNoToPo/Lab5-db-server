const STRINGS = {
    SERVER_RUNNING: "API server listening on port %PORT%",
    NOT_FOUND: "Route not found",
    METHOD_NOT_ALLOWED: "Method not allowed",
    EMPTY_QUERY: "No SQL query was provided",
    INVALID_JSON: "Request body must be valid JSON",
    INVALID_ROWS: "Body must contain a non-empty 'rows' array of { name, dateOfBirth }",
    BODY_TOO_LARGE: "Request body is too large",
    INSERT_SUCCESS: "Inserted %COUNT% row(s) into the patient table",
    QUERY_SUCCESS: "Query executed successfully",
    PERMISSION_DENIED: "Permission denied: this endpoint only allows reading (SELECT) data",
    DB_ERROR: "Database error: %MSG%",
    SERVER_ERROR: "Internal server error"
}