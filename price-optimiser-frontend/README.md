# Price Optimizer Frontend

A React.js single-page application for managing products, visualizing demand forecasts, and computing optimal prices. Built with Create React App, Tailwind CSS, Chart.js, and Axios.

---

## Table of Contents

1. [Prerequisites](#prerequisites)  
2. [Local Setup Guide](#local-setup-guide)  
3. [Getting Started](#getting-started)  
4. [Project Structure](#project-structure)  
5. [Key Modules & Components](#key-modules--components)  
6. [Styling & Theming](#styling--theming)  
7. [Available Scripts](#available-scripts)  
8. [Configuration](#configuration)  
9. [Deployment](#deployment)  
10. [License](#license)  

---

## Prerequisites

- **Node.js** (LTS recommended, ≥ 14.x).  
- **npm** (bundled with Node) or **Yarn** ≥ 1.22.  
- **Git** for version control.  
- A running backend API (see backend README) at `http://localhost:8000/api`.

---

## Local Setup Guide

Follow these steps to get the frontend running locally:

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/price-optimizer-frontend.git
cd price-optimizer-frontend
```

### 2. Install Dependencies

Choose one:

- **Using npm**  
  ```bash
  npm install
  ```
- **Using Yarn**  
  ```bash
  yarn install
  ```

This installs React, Tailwind CSS, Chart.js, Axios, and other required packages.

### 3. Configure API Endpoint

Instead of environment variables, this project uses a `config.js` file to manage runtime settings:

1. Copy the example config:
   ```bash
   cp src/config.example.js src/config.js
   ```
2. Open `src/config.js` and set your API URL:
   ```js
   // src/config.js
   module.exports = {
     API_URL: 'http://localhost:8000/api',
   };
   ```
3. If your backend runs at a different address, update `API_URL` accordingly.

### 4. Tailwind CSS Setup

Tailwind is preconfigured via PostCSS. No additional setup is needed beyond installing dependencies.

### 5. Start the Development Server

```bash
npm start
# or
yarn start
```

- Application opens at `http://localhost:3000`.  
- Hot-reloading enabled for rapid development.

### 6. Verify API Connectivity

- Log in at `/login`.  
- Ensure products load under `/products`.  
- Test the demand forecast modal and pricing optimization features.

### 7. Build for Production

```bash
npm run build
# or
yarn build
```

Generates optimized static files in the `build/` directory.

---

## Project Structure

```
price-optimizer-frontend/
├── public/
│   └── index.html
├── src/
│   ├── api.js
│   ├── config.js         # API endpoint and other runtime settings
│   ├── config.example.js
│   ├── App.js
│   ├── index.js
│   ├── routes.js
│   ├── contexts/
│   │   └── AuthContext.js
│   ├── components/
│   │   ├── auth/
│   │   │   ├── Login.js
│   │   │   └── Register.js
│   │   ├── common/
│   │   │   ├── Navbar.js
│   │   │   └── PrivateRoute.js
│   │   ├── products/
│   │   │   ├── ProductList.js
│   │   │   ├── ProductTable.js
│   │   │   ├── ProductForm.js
│   │   │   └── SearchFilter.js
│   │   ├── forecasts/
│   │   │   ├── DemandForecast.js
│   │   │   └── DemandForecastChartModal.js
│   │   └── optimization/
│   │       └── PricingOptimization.js
│   ├── styles/
│   │   ├── index.css
│   │   └── tailwind.config.js
│   └── utils/
│       └── formatPrice.js
├── .gitignore
├── package.json
└── README.md
```

---

## Key Modules & Components

### API Layer (`src/api.js`)

- Configures Axios with base URL from `REACT_APP_API_URL`.  
- Attaches JWT token on each request header.  
- Exports helper methods: `.get()`, `.post()`, `.put()`, `.delete()`.

---

### Authentication (`src/contexts/AuthContext.js`)

- **AuthContext** provides `user`, `login()`, `logout()`, and token persistence.  
- Stores JWT in `localStorage`.  
- On app load, decodes token to set `user` (including `role`).  
- Redirects unauthenticated users to `/login`.

---

### Routing & Guards

- **`src/routes.js`** defines public (`/login`, `/register`) and protected routes (`/products`, `/forecast`, `/optimize`).  
- **`PrivateRoute.jsx`** wraps protected routes, checking `user` from `AuthContext`.

---

### Product Management

1. **`ProductList.jsx`**  
   - Fetches product list via `api.get('/products/')`.  
   - Holds state: `products`, `editingProduct`, `showForm`, `filterParams`.  
   - Renders **SearchFilter**, **ProductTable**, and **ProductForm**.

2. **`SearchFilter.jsx`**  
   - Controlled inputs for name/category.  
   - On submit, passes filter object to `ProductList`.

3. **`ProductTable.jsx`**  
   - Displays products in a responsive table.  
   - Columns: Name, Category, Cost Price, Selling Price, Units Sold, Actions (view/edit/delete).  
   - Checks `user.role` to show/hide columns or buttons.  
   - Emits callbacks for edit/delete.

4. **`ProductForm.jsx`**  
   - Modal form for creating/updating a product.  
   - Controlled form state; validation for required fields.  
   - Submits via `api.post('/products/')` or `api.put('/products/:id/')`.

---

### Demand Forecasting

- **`DemandForecast.jsx`** button toggles forecast view.  
- **`DemandForecastChartModal.jsx`**  
  - Fetches forecast data from `/products/forecast/?ids=[…]`.  
  - Uses Chart.js to render a line chart of “selling_price” vs. “forecasted_demand”.  
  - Configurable to plot only selected products.

---

### Pricing Optimization

- **`PricingOptimization.jsx`**  
  - Fetches `/products/` and `/products/optimize/?ids=[…]`.  
  - Merges cost, current price, and optimized price.  
  - Displays results in a table similar to **ProductTable**, with an extra “Optimized Price” column.  
  - Toggle “Include Forecast” switch to re-fetch with/without forecast.

---

### Shared UI Components

- **`Navbar.jsx`**  
  - Shows app logo, navigation links, and “Logout” button.  
  - Highlights active route.

- **`PrivateRoute.jsx`**  
  - Wraps `<Route>` and redirects to `/login` if no valid `user`.

- **`formatPrice.js`**  
  - Utility to format numbers as USD (`$xx.xx`).

---

## Styling & Theming

- **Tailwind CSS** via `postcss` integration.  
- Custom colors and spacing in `tailwind.config.js`.  
- Utility-first classes throughout components.

---

## Styling & Theming

- **Tailwind CSS** via PostCSS.  
- Custom colors and spacing defined in `tailwind.config.js`.

---

## Available Scripts

- `npm start` / `yarn start`: Dev server with hot reload.  
- `npm run build` / `yarn build`: Production build.  
- `npm test` / `yarn test`: Run tests.  
- `npm run eject` / `yarn eject`: Eject CRA configuration (not recommended).

---

## Configuration

Settings are managed via `src/config.js`:

```js
module.exports = {
  API_URL: 'http://localhost:8000/api',
};
```

---

## Deployment

1. Build: `npm run build`.  
2. Serve `build/` directory (Netlify, Vercel, Nginx, etc.).  
3. Ensure `API_URL` in `config.js` points to the production API.

---

## License

MIT © Your Name / Your Organization
