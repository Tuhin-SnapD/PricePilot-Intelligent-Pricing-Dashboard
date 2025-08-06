# PricePilot Frontend

<div align="center">

![React](https://img.shields.io/badge/React-18.0+-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-4.0+-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0+-38B2AC?style=for-the-badge&logo=tailwind-css)
![Chart.js](https://img.shields.io/badge/Chart.js-4.0+-FF6384?style=for-the-badge&logo=chart.js)

**Modern React-based frontend for PricePilot's AI-powered pricing optimization platform. Features intuitive dashboards, real-time analytics, and responsive design.**

[🚀 Quick Start](#quick-start) • [📊 Features](#features) • [🏗️ Architecture](#architecture) • [🔧 Development](#development) • [📚 Components](#components)

</div>

---

## 🎯 Overview

The PricePilot Frontend is a sophisticated React application that provides an intuitive interface for managing products, visualizing demand forecasts, and computing optimal pricing strategies. Built with modern web technologies, it offers a seamless user experience with real-time data visualization and responsive design.

### Key Capabilities

- **📊 Interactive Dashboards**: Real-time analytics and performance metrics
- **🎨 Modern UI/UX**: Beautiful, responsive design with Tailwind CSS
- **📈 Data Visualization**: Advanced charts and graphs using Chart.js
- **🔐 Secure Authentication**: JWT-based authentication with role-based access
- **📱 Mobile-First Design**: Fully responsive across all devices
- **⚡ Real-Time Updates**: Live data synchronization with backend APIs

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or Yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Tuhin-SnapD/PricePilot-Intelligent-Pricing-Dashboard
   cd price-optimiser-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure API endpoint**
   ```bash
   # Copy the example config
   cp src/config.example.js src/config.js
   ```
   
   Edit `src/config.js`:
   ```javascript
   module.exports = {
     API_URL: 'http://localhost:8000/api',
   };
   ```

4. **Start development server**
   ```bash
   npm start
   # or
   yarn start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Make sure the backend is running at http://localhost:8000

---

## 📊 Features

### Core Features
- **🤖 AI-Powered Analytics**: Interactive dashboards for pricing insights
- **📈 Demand Forecasting**: Visual demand prediction with multiple algorithms
- **💰 Price Optimization**: Real-time pricing recommendations
- **📊 A/B Testing Simulation**: Strategy comparison and outcome prediction
- **🎯 Inventory Analysis**: Stock-aware pricing recommendations
- **📱 Responsive Design**: Mobile-first approach with Tailwind CSS

### Advanced Features
- **🎨 Modern UI Components**: Reusable, accessible React components
- **📊 Interactive Charts**: Chart.js-powered data visualizations
- **🔐 Role-Based Access**: Different interfaces for admin, supplier, and buyer roles
- **⚡ Real-Time Updates**: Live data synchronization
- **📤 Data Export**: CSV export functionality
- **🔍 Advanced Filtering**: Product search and filtering capabilities

---

## 🏗️ Architecture

### Project Structure
```
price-optimiser-frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── analytics/          # Analytics dashboard components
│   │   │   ├── ABTestingSimulator.js
│   │   │   ├── AnalyticsDashboard.js
│   │   │   ├── ElasticityHeatmap.js
│   │   │   ├── InventoryAnalysis.js
│   │   │   └── MLOptimization.js
│   │   ├── auth/              # Authentication components
│   │   │   ├── Login.js
│   │   │   └── Register.js
│   │   ├── common/            # Shared components
│   │   │   ├── ErrorBoundary.js
│   │   │   ├── Navbar.js
│   │   │   └── PrivateRoute.js
│   │   ├── forecasts/         # Forecasting components
│   │   │   └── DemandForecast.js
│   │   ├── optimization/      # Pricing optimization UI
│   │   │   └── PricingOptimization.js
│   │   └── products/          # Product management
│   │       ├── ProductForm.js
│   │       ├── ProductList.js
│   │       ├── ProductTable.js
│   │       └── SearchFilter.js
│   ├── contexts/              # React contexts
│   │   └── AuthContext.js
│   ├── api.js                 # API integration layer
│   ├── config.js              # Configuration settings
│   ├── App.js                 # Main application component
│   └── index.js               # Application entry point
├── package.json
└── tailwind.config.js
```

### Technology Stack
- **React 18**: Modern React with hooks and functional components
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Chart.js**: Interactive charts and data visualization
- **Axios**: HTTP client for API communication
- **React Router**: Client-side routing
- **Context API**: State management for authentication

---

## 🔧 Development

### Available Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject from Create React App (not recommended)
npm run eject
```

### Development Workflow

1. **Component Development**
   - Create new components in appropriate directories
   - Follow the existing component structure
   - Use Tailwind CSS for styling

2. **API Integration**
   - Use the `api.js` module for all API calls
   - Handle loading states and error boundaries
   - Implement proper error handling

3. **State Management**
   - Use React Context for global state (auth, user data)
   - Use local state for component-specific data
   - Implement proper state updates and re-renders

4. **Styling Guidelines**
   - Use Tailwind CSS utility classes
   - Follow mobile-first responsive design
   - Maintain consistent spacing and typography

---

## 📚 Components

### Authentication Components

#### Login.js
- JWT-based authentication form
- Form validation and error handling
- Redirect to dashboard on success

#### Register.js
- User registration form
- Role selection (admin, supplier, buyer)
- Password strength validation

### Product Management

#### ProductList.js
- Main product management interface
- Integrates search, table, and form components
- Handles product CRUD operations

#### ProductTable.js
- Responsive data table for products
- Sortable columns and pagination
- Role-based action buttons

#### ProductForm.js
- Modal form for creating/editing products
- Real-time validation
- Auto-save functionality

### Analytics Components

#### AnalyticsDashboard.js
- Main analytics interface
- Real-time performance metrics
- Interactive data visualizations

#### ABTestingSimulator.js
- A/B testing strategy simulation
- Visual comparison of different approaches
- Outcome prediction and analysis

#### ElasticityHeatmap.js
- Price elasticity visualization
- Category-based heatmap
- Interactive filtering

### Optimization Components

#### PricingOptimization.js
- AI-powered pricing recommendations
- Real-time optimization results
- Strategy comparison and selection

#### DemandForecast.js
- Multi-algorithm demand forecasting
- Interactive charts and graphs
- Historical trend analysis

---

## 🎨 Styling & Theming

### Tailwind CSS Configuration
```javascript
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
        accent: '#F59E0B',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

### Design System
- **Color Palette**: Consistent primary, secondary, and accent colors
- **Typography**: Inter font family with proper hierarchy
- **Spacing**: Consistent spacing scale using Tailwind utilities
- **Components**: Reusable component patterns

---

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Mobile-First Approach
- All components designed for mobile first
- Progressive enhancement for larger screens
- Touch-friendly interactions

---

## 🔐 Security

### Authentication
- JWT token-based authentication
- Secure token storage in localStorage
- Automatic token refresh
- Role-based access control

### Data Protection
- Input validation and sanitization
- XSS protection
- CSRF token handling
- Secure API communication

---

## 🧪 Testing

### Testing Strategy
- Unit tests for individual components
- Integration tests for component interactions
- E2E tests for critical user flows

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Generate coverage report
npm test -- --coverage
```

---

## 📦 Deployment

### Build Process
```bash
# Create production build
npm run build

# The build folder contains optimized static files
```

### Deployment Options
- **Netlify**: Drag and drop build folder
- **Vercel**: Connect GitHub repository
- **AWS S3**: Upload build files to S3 bucket
- **Nginx**: Serve build folder with Nginx

### Environment Configuration
- Update `config.js` with production API URL
- Set appropriate CORS headers on backend
- Configure CDN for static assets

---

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Install dependencies: `npm install`
4. Make your changes
5. Add tests for new functionality
6. Submit a pull request

### Code Standards
- Follow React best practices
- Use functional components with hooks
- Implement proper error handling
- Write meaningful commit messages
- Add JSDoc comments for complex functions

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

---

## 🙏 Acknowledgments

- **React Team**: For the amazing React framework
- **Tailwind CSS**: For the utility-first CSS framework
- **Chart.js**: For powerful data visualization
- **Create React App**: For the development setup

---

<div align="center">

**Made with ❤️ by the PricePilot Team**

</div>
