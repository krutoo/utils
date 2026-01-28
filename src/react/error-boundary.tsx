import { Component, type ErrorInfo, type ReactNode } from 'react';

export interface ErrorBoundaryProps {
  children?: ReactNode;
  fallback?: ReactNode;
  onError?: (error: unknown, errorInfo: ErrorInfo) => void;
}

export interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Component for handling of render errors via props.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  static getDerivedStateFromError(): ErrorBoundaryState {
    return {
      hasError: true,
    };
  }

  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  /** @inheritdoc */
  override componentDidCatch(error: unknown, errorInfo: ErrorInfo): void {
    this.props.onError?.(error, errorInfo);
  }

  /** @inheritdoc */
  override render(): ReactNode {
    const { children, fallback } = this.props;

    return <>{this.state.hasError ? fallback : children}</>;
  }
}
