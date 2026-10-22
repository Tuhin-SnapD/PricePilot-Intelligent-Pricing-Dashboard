const DEV = {
  API_BASE: "http://localhost:8000/api",
};

const PROD = {
  API_BASE: "https://api.mydomain.com",//Need to be changed
};

const CONFIG = process.env.NODE_ENV === "production" ? PROD : DEV;

// Allow overriding the API base (e.g. when the backend runs on another port)
if (process.env.REACT_APP_API_BASE) {
  CONFIG.API_BASE = process.env.REACT_APP_API_BASE;
}

export default CONFIG;
