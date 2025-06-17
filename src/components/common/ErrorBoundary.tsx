import { Component, ErrorInfo, ReactNode } from 'react';
import NotificationDropdown from '../organisms/NotificationDropdown';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static getDerivedStateFromError(_error: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Hata Yakalandı:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Bir hata oluştu. Lütfen sayfayı yenileyin.</div>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;





<ErrorBoundary>
  <NotificationDropdown />
</ErrorBoundary>