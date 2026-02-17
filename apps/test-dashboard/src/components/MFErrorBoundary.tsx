import { Component, ComponentChild } from 'preact';
import { logger } from '@shared/logic';

export class MFErrorBoundary extends Component<{ name: string; children: ComponentChild }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    logger.error(`Aplikacja ${this.props.name} wybuchła!`, error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-center">
          <p className="font-bold">Coś poszło nie tak z modułem {this.props.name}</p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="mt-2 text-xs underline cursor-pointer"
          >
            Spróbuj ponownie
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}