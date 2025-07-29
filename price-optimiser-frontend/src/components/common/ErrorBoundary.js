import React from 'react';
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console and set state
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-black to-gray-800 text-white flex items-center justify-center px-6">
          <div className="max-w-md w-full bg-gray-900 rounded-lg shadow-xl p-8 text-center">
            <div className="mb-6">
              <FiAlertTriangle className="text-red-400 text-6xl mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-red-400 mb-2">
                Oops! Something went wrong
              </h1>
              <p className="text-gray-300 text-sm">
                We encountered an unexpected error. Please try refreshing the page.
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={this.handleReload}
                className="w-full bg-teal-500 hover:bg-teal-600 text-black font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <FiRefreshCw className="w-5 h-5" />
                <span>Refresh Page</span>
              </button>

              <button
                onClick={() => window.history.back()}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Go Back
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-400 hover:text-gray-300">
                  Error Details (Development)
                </summary>
                <div className="mt-2 p-4 bg-gray-800 rounded text-xs text-red-300 overflow-auto max-h-40">
                  <div className="mb-2">
                    <strong>Error:</strong>
                    <pre className="whitespace-pre-wrap">{this.state.error.toString()}</pre>
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong>Component Stack:</strong>
                      <pre className="whitespace-pre-wrap">{this.state.errorInfo.componentStack}</pre>
                    </div>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 