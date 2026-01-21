import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  onReset: () => void;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  // FIX: Converted to an arrow function to automatically bind `this`, resolving errors with accessing `this.props` and `this.setState`.
  public handleReset = (): void => {
    this.props.onReset();
    this.setState({ hasError: false });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="bg-white p-8 rounded-lg shadow-md border border-red-200 text-center">
          <div className="flex justify-center items-center mx-auto h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-600">An Unexpected Error Occurred</h2>
          <p className="text-gray-600 my-4">We're sorry for the inconvenience. Please try returning to the home page to continue.</p>
          <button
            onClick={this.handleReset}
            className="bg-teal-600 text-white font-bold py-2 px-6 rounded-md hover:bg-teal-700 transition-colors"
          >
            Return to Home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;