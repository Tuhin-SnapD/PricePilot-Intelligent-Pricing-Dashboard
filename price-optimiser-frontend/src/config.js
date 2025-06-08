const DEV = {
  API_BASE: "http://localhost:8000/api",
};

const PROD = {
  API_BASE: "https://api.mydomain.com",//Need to be changed
};

const CONFIG = process.env.NODE_ENV === "production" ? PROD : DEV;

export default CONFIG;
