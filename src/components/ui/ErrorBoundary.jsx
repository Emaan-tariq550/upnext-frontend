import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // eslint-disable-next-line no-console
    console.error('UPNEXT crashed:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen flex-col items-center justify-center bg-upnext-bg px-4 text-center">
          <h1 className="font-display text-2xl text-upnext-primary">Something went wrong</h1>
          <p className="mt-2 max-w-md text-sm text-upnext-muted">
            UPNEXT hit an unexpected error. Try reloading the page — if this keeps happening, please
            let us know.
          </p>
          <button
            onClick={this.handleReload}
            className="mt-6 rounded-xl bg-upnext-primary px-5 py-3 font-medium text-white hover:bg-upnext-primaryDark"
          >
            Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;