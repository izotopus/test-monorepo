import { Component, ComponentChild } from 'preact';

interface Props {
  name: string;
  logger: any;
  onEvent?: (event: any) => void;
}

export class ErrorBoundary extends Component<Props, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    this.props.logger.critical('Runtime', `Crash in ${this.props.name}: ${error.message}`, {
      stack: errorInfo?.componentStack
    });

    this.props.onEvent?.({
      type: 'COMPONENT_CRASHED',
      payload: { module: this.props.name, error: error.message }
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border border-dashed border-red-500 rounded bg-red-50 m-2">
          <p className="text-red-700 font-bold">Moduł {this.props.name} jest tymczasowo niedostępny.</p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="text-xs bg-red-500 text-white px-2 py-1 mt-2 rounded"
          >
            Spróbuj ponownie
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}