const DEFAULT_API_BASE =
  process.env.NODE_ENV === "production"
    ? "/api"
    : "http://localhost:8000/api";

// Set REACT_APP_API_BASE to point the frontend at a different backend.
const API_BASE = (process.env.REACT_APP_API_BASE || DEFAULT_API_BASE).replace(
  /\/$/,
  ""
);

const config = { API_BASE };

export default config;
