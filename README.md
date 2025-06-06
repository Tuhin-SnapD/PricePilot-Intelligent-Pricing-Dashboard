# Price Optimization Tool

This repository contains a full-stack web application for price optimization and demand forecasting.

## Technologies
- Backend: Django REST Framework, PostgreSQL, SimpleJWT
- Frontend: React.js, Chart.js, Axios

## Features
1. **User Authentication & Authorization**
   - JWT-based auth
   - Roles: Admin, Buyer, Supplier
   - Role-based permissions

2. **Product Management**
   - Create, Read, Update, Delete products
   - Search and filter products

3. **Demand Forecast**
   - Linear trend forecasting
   - Visualization via line chart

4. **Pricing Optimization**
   - Simple revenue-maximization algorithm
   - Displays optimized prices

## Getting Started

### Backend Setup
1. Navigate to `backend/`
2. Create a virtual environment and activate it:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create PostgreSQL database `pricing_db` and update credentials in `pricing_tool/settings.py`
5. Run migrations:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```
6. Create superuser:
   ```bash
   python manage.py createsuperuser
   ```
7. Start server:
   ```bash
   python manage.py runserver
   ```

Backend API endpoints:
- `POST /api/users/register/` to register
- `POST /api/users/login/` to get JWT tokens
- `GET /api/users/me/` to get user details
- `GET/POST /api/products/` Product list & create
- `GET/PUT/DELETE /api/products/{id}/` Product detail
- `GET /api/products/search/?name=&category=` Search & filter
- `GET /api/products/forecast/` Demand forecasts
- `GET /api/products/optimize/` Compute optimized prices

### Frontend Setup
1. Navigate to `frontend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start React app:
   ```bash
   npm start
   ```
4. Access frontend at `http://localhost:3000/`

## Usage
1. Register a user or login using the superuser.
2. Manage products via Products page.
3. View demand forecasts on the Forecast page.
4. Compute optimized prices on the Optimization page.

## Screenshots
_Include screenshots of UI as PDF or PPT per instructions_

## Key Learnings
- Integrating Django with React via REST APIs
- Implementing JWT authentication
- Basic forecasting and optimization algorithms
- Chart.js integration for data visualization
